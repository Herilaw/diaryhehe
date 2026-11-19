(() => {
'use strict';
// Kabi, Hamster Doctor v1.0.0, src/util/jigsaw.ts. Type annotations removed.
/**
 * 异形拼图几何工具：
 * - 以故事的固定 seed 生成每条内部边的凸/凹方向与形状抖动（相邻两片自动互补）；
 * - 生成每片的 SVG path（经典蘑菇头插片：贝塞尔曲线，带轻微随机，避免机械切块感）；
 * - 生成碎片的发放顺序（seed 固定的乱序排列，「已收集前 N 片」即可确定拥有哪些片）。
 *
 * 坐标系：棋盘为 BOARD × BOARD 的正方形（BOARD=100 的归一化单位），
 * 格子边长 cell = BOARD / grid，插片凸头外伸约 cell * TAB。
 */

const BOARD = 100;
/** 凸头外伸高度（相对格子边长） */
const TAB = 0.26;
/** 凸头颈口半宽（相对格子边长） */
const NECK = 0.09;

/** mulberry32：小巧的确定性伪随机数发生器 */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 一条内部边的形状参数（在「边的规范方向」局部坐标系下描述） */




function makeEdge(rand) {
  return {
    sign: rand() < 0.5 ? 1 : -1,
    mid: 0.5 + (rand() - 0.5) * 0.14,
    tab: TAB * (0.85 + rand() * 0.35),
    neck: NECK * (0.85 + rand() * 0.4),
    lean: (rand() - 0.5) * 0.08,
  };
}

/** 由 seed + grid 生成整张拼图的确定性几何（形状与发放顺序每次进游戏一致） */
function buildGeometry(seed, grid) {
  const rand = rng(seed * 7919 + grid * 131);
  const hEdges = [];
  for (let r = 0; r < grid - 1; r++) {
    const row = [];
    for (let c = 0; c < grid; c++) row.push(makeEdge(rand));
    hEdges.push(row);
  }
  const vEdges = [];
  for (let r = 0; r < grid; r++) {
    const row = [];
    for (let c = 0; c < grid - 1; c++) row.push(makeEdge(rand));
    vEdges.push(row);
  }
  // 碎片发放顺序（Fisher-Yates，独立于形状抖动）
  const order = Array.from({ length: grid * grid }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return { grid, cell: BOARD / grid, hEdges, vEdges, order };
}



/**
 * 生成一条带凸头的边的贝塞尔指令串。
 * 边从 P0 → P1（长度 cell），法线 n 指向 sign=+1 的一侧。
 * 三段三次贝塞尔：缓入肩部 → 蘑菇头 → 缓出肩部。
 */
function curvyEdge(p0, p1, shape, cell, flip) {
  // flip=true 表示按规范方向的反向走这条边（邻片共享同一形状，需反向遍历）
  const sign = shape.sign * (flip ? -1 : 1);
  const mid = flip ? 1 - shape.mid : shape.mid;
  const lean = flip ? -shape.lean : shape.lean;

  const ux = (p1[0] - p0[0]) / cell;
  const uy = (p1[1] - p0[1]) / cell;
  // 法线（左手侧）
  const nx = uy * sign;
  const ny = -ux * sign;

  const P = (along, out) => [
    p0[0] + ux * cell * along + nx * cell * out,
    p0[1] + uy * cell * along + ny * cell * out,
  ];

  const neck = shape.neck;
  const tab = shape.tab;
  const a = mid - neck; // 颈口起点
  const b = mid + neck; // 颈口终点

  const shoulder = 0.035; // 肩部微微隆起，衔接更柔和
  const segs = [];
  const c = (c1, c2, end) =>
    segs.push(`C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${end[0]} ${end[1]}`);

  // 1) 起点 → 颈口起点（肩部缓入）
  c(P(a * 0.4, 0), P(a * 0.8, shoulder), P(a, shoulder * 1.6));
  // 2) 蘑菇头：颈口起点 → 颈口终点（控制点向外甩出并左右收拢形成头部外扩）
  c(
    P(a - neck * 1.6 + lean, tab * 0.92),
    P(b + neck * 1.6 + lean, tab * 0.92),
    P(b, shoulder * 1.6),
  );
  // 3) 颈口终点 → 终点（肩部缓出）
  c(P(b + (1 - b) * 0.2, shoulder), P(b + (1 - b) * 0.6, 0), [p1[0], p1[1]]);
  return segs.join(' ');
}

/**
 * 生成格 (row, col) 这一片的完整 SVG path（M 起点 + 四条边 + Z）。
 * 边界边为直线；内部边用共享形状（右/下边按规范方向，左/上边反向遍历）。
 */
function piecePath(geo, row, col) {
  const { grid, cell, hEdges, vEdges } = geo;
  const x0 = col * cell;
  const y0 = row * cell;
  const x1 = x0 + cell;
  const y1 = y0 + cell;

  const parts = [`M ${x0} ${y0}`];

  // 上边（左→右）：是上邻格 (row-1,col) 的下边，反向？规范方向为从左到右，
  // hEdges[row-1][col] 的规范方向就是左→右，flip=false 即可。
  if (row === 0) parts.push(`L ${x1} ${y0}`);
  else parts.push(curvyEdge([x0, y0], [x1, y0], hEdges[row - 1][col], cell, false));

  // 右边（上→下）：vEdges[row][col]，规范方向上→下，flip=false。
  if (col === grid - 1) parts.push(`L ${x1} ${y1}`);
  else parts.push(curvyEdge([x1, y0], [x1, y1], vEdges[row][col], cell, false));

  // 下边（右→左）：hEdges[row][col] 规范方向左→右，此处反向 flip=true。
  if (row === grid - 1) parts.push(`L ${x0} ${y1}`);
  else parts.push(curvyEdge([x1, y1], [x0, y1], hEdges[row][col], cell, true));

  // 左边（下→上）：vEdges[row][col-1] 规范方向上→下，此处反向 flip=true。
  if (col === 0) parts.push('Z');
  else {
    parts.push(curvyEdge([x0, y1], [x0, y0], vEdges[row][col - 1], cell, true));
    parts.push('Z');
  }
  return parts.join(' ');
}

/** 一片的包围盒（含可能外伸的凸头），用于给每片单独开 SVG 视窗 */
function pieceBBox(geo, row, col) {
  const { cell } = geo;
  const pad = cell * (TAB * 1.35 + 0.06); // 凸头 + 抖动余量
  const x = col * cell - pad;
  const y = row * cell - pad;
  return { x, y, w: cell + pad * 2, h: cell + pad * 2, pad };
}

/** 已收集数量 → 拥有的格子索引集合（按发放顺序前 N 个） */
function ownedCells(geo, collected) {
  return new Set(geo.order.slice(0, Math.max(0, Math.min(collected, geo.order.length))));
}

window.S2_JIGSAW = { BOARD, rng, buildGeometry, piecePath, pieceBBox, ownedCells };
})();
