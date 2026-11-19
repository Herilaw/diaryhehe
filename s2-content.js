(() => {
'use strict';
// All additional player-facing text lives here. Export with tools/export-s2-copy.cjs.
window.S2_CONTENT = {
  copy: {
    deskTitle: '猫与书桌', deskEyebrow: '书外的午后', catAlt: '橘白色的猫', close: '回到书页', titleClose: '返回标题',
    continueReading: '继续阅读', hintContinue: '回到刚才读到的书页，继续这一篇。', prepareMain: '准备书签', waitingReturn: '等待猫回来', helpTitle: '玩法说明', nextStep: '接下来', stepPrepare: '准备', stepTravel: '寻页', stepPuzzle: '拼页', stepRead: '入书',
    hintPrepare: '先放好一枚随身书签，就可以陪猫出发。',
    hintDepart: '书签已经备好。陪它寻页，带回这篇故事的画页。',
    hintPacking: '书签已放入页间，猫马上出发。',
    hintAway: '猫正在寻页。可以看看它停在哪里，做一次小小的选择。',
    hintReturning: '这一趟的选择已记下，等它带着纸片回来。',
    hintReturned: '猫已经回来了。接过纸片，再把画页拼起来。',
    hintPuzzle: '这一篇的纸片齐了。把它们放回画页，就能进入故事。',
    hintEnter: '画页已经完整，可以走进这一篇了。',
    hintReread: '这一篇已读完。可以重看故事，也可以翻阅留下的札记。',
    repeatTrip: '再去寻页', prepTitle: '出发前的准备', optional: '可选', fragmentLabel: '已寻回的画页',
    ink: '墨点', energy: '精神', affection: '亲近', collect: '收起墨点', collectEmpty: '纸面还很干净。',
    care: '摸摸它', rest: '让它歇一会儿', careWait: '它正专心洗脸，等一会儿再摸吧。',
    careAway: '它还在书页那边。', careDone: '它把脑袋靠过来，尾巴轻轻扫了一下你的手。',
    resting: '它在灯下蜷好。你也放松了肩膀。', home: '在书桌边', packing: '钻进书页以前',
    away: '循着纸上的气味', returned: '它回来了', restStatus: '蜷在灯下',
    tabDesk: '书桌', tabPuzzle: '拼合画页', tabRecords: '物象札记', tabAlbum: '画面收藏',
    prepare: '准备匣', mainSlot: '随身书签', snackSlot: '附加便签', choose: '放进去', remove: '取下来',
    buy: '换取', stock: '匣中', equipped: '已经备好', noSnack: '这次不带便签',
    depart: '陪它寻页', needMain: '先备好一枚书签', needEnergy: '先陪它歇一会儿',
    needPrevious: '先读完前一篇，再翻开这枚书签。', notEnough: '手边的墨点还不够。',
    inventoryEmpty: '准备匣里已经没有这一件了。', chooseLocked: '等它回来，再整理准备匣。',
    tripTime: '归途', tripProgress: '寻页进度', tripObserve: '看看它停在哪里', tripSeen: '这一趟的停留已记下。',
    receive: '接过它带回的纸片', rewardTitle: '爪边的纸片', rewardBody: '它用前爪按住纸角，等你把纸片放回书里。',
    rewardGuide: '另外记下一处小小的见闻。', tripNoFragments: '这一页的纸片已经齐了。这次只看看沿途。',
    rewardClaimed: '纸片已经收好。', puzzleTitle: '把画页放回原处', puzzleHint: '拖动纸片，或先选纸片、再点它应在的位置。靠近时会亮起细线。',
    puzzleMissing: '还有纸片留在书页那边。已有的可以先拼。', puzzleReady: '画面完整了。轻轻翻过去。',
    puzzleWrong: '这里接不上。再看一眼纸片的边缘。', piece: '纸片', target: '画页位置',
    enter: '走进这一篇', reread: '重看这一篇', locked: '？？？', chapterLabel: '书签',
    clueTitle: '读到过的东西', clueHint: '调查、倾听和阅读留下的记录，会慢慢落到这里。',
    clueLocked: '纸上还空着。', clueOpen: '翻开札记', recordCollected: '一处物象留在了书签里。',
    recordComplete: '这一篇的物象已经收齐。', recordReward: '墨点已收好。',
    albumTitle: '留下这一刻', albumEmpty: '阅读时点“留一幅画”，就能把眼前的画面放进来。',
    albumCapture: '留一幅画', albumSaved: '这一刻留在了画册里。', albumDuplicate: '这幅画已经在画册里了。',
    albumFull: '画册已经放满。可以先取出一幅，再留新的。', albumRemove: '取出这幅',
    albumPrev: '往前放', albumNext: '往后放', albumZoom: '展开画面',
    noteLink: '读后手记', collageLink: '拼一页手记', progress: '画页', completed: '已读完',
    readReward: '合上这一篇，猫又挨近了一点。准备匣也添满了。',
    fullTitle: '它把最后一张纸压平', fullButton: '灯还亮着', fullRepeat: '重看灯下的片刻',
    fullLines: [
      '猫在书上睡着了。尾巴搭在最后一枚书签旁边。',
      '你把散开的纸页依次放好。房间里依旧只有台灯和很轻的呼吸。',
      '那些房间、雨声和没有说完的话，已经在心里待了一会儿。',
      '你没有替它们写出结论。只是把书放在了伸手能够拿到的地方。'
    ],
    introTitle: '它也想看这本书',
    introLines: [
      '你刚把书放平，猫就跳上了桌。它没有踩住书脊，只把鼻尖凑到纸边。',
      '你替它挪开杯子。它却望着书页间一小片晃动的光，伸出爪子。',
      '纸面轻轻陷了下去。再抬眼时，它已经坐在那片光里，回头等你。',
      '你在页边放好书签。等它带回散开的画页，你们就一起往里面走。'
    ],
    introContinue: '把书摊开', importError: '这份猫与书桌的记录无法读取。',
    tutorial: '摸摸猫，备好书签，再陪它去寻页。纸片拼好以后，就能走进这一篇。读书时得到的记录会留在札记里。',
    tutorialButton: '记住了', resetNotice: '猫、画页和准备匣也会从这个存档中清除。',
    completeLabel: '三枚书签', lockedAlbum: '这幅画还没有遇见。',
    tripAction: '留意这里', back: '返回', newRound: '重新开始也会保留已经收好的画页和札记。'
  },
  tuning: { startInk: 90, maxEnergy: 100, produceMs: 15000, stockCap: 12, inkPerStock: 3, regenMs: 5000, careCooldownMs: 12000, packingMs: 2200, firstTripMs: 7000, tripMs: 20000, fragmentReward: 3, recordReward: 8, readReward: 45, maxPhotos: 24 },
  supplies: [
    { id: 'paper', kind: 'main', name: '素纸书签', desc: '一枚平整的书签，夹在刚翻开的那一页。', price: 8, duration: 1 },
    { id: 'ribbon', kind: 'main', name: '细绳书签', desc: '沿着细绳回来，能少绕一点路。', price: 14, duration: .7 },
    { id: 'blank', kind: 'snack', name: '空白便签', desc: '顺路多记一处小见闻。', price: 6, bonus: 1 },
    { id: 'fold', kind: 'snack', name: '折角便签', desc: '把经过的细节多留一些。', price: 10, bonus: 2 }
  ],
  books: [
    { key: 'pregnancy', title: '妊娠日历', label: '第一枚书签', entry: 'dec29', gate: 'dec29', grid: 2, seed: 108, art: 'a4-family-parlor', after: 'a4-family-green', intro: '冬日的窗边，纸页还带着手指留下的温度。', afterText: '再看这扇窗，你已经记得许多发生在屋里的小事。' },
    { key: 'dormitory', title: '学生宿舍', label: '第二枚书签', entry: 'd2-bridge', gate: 'd2-sound', grid: 3, seed: 310, art: 'd2-garden', after: 'd2-garden-blue', intro: '楼前的花坛很安静。猫沿着一段细小的阴影走过去。', afterText: '花坛和窗户仍在原处。有些变化，只有再回来时才看得见。' },
    { key: 'cafeteria', title: '傍晚的配餐室和雨中的游泳池', label: '第三枚书签', entry: 'd3-bridge', gate: 'd3-move', grid: 3, seed: 512, art: 'a4-catering-empty', after: 'a4-catering-dusk', intro: '窗里的光一点点暗下去，纸边却留着雨水似的亮。', afterText: '声音停下以后，空下来的地方仍留在画里。' }
  ],
  records: [
    { id: 'calendar', book: 'pregnancy', title: '散开的图表', art: 'chart1', items: ['chart1','chart2','chart3'], body: '三处纸页分别被找回。你记住的还有找寻时经过的房间，以及姐姐原本放东西的位置。' },
    { id: 'photo', book: 'pregnancy', title: '旧照片', art: 'photo', items: ['photo'], body: '照片把很早以前的人留在纸上。此刻翻看它的人，却站在另一个时间里。' },
    { id: 'jam', book: 'pregnancy', title: '锅边的气味', art: 'jam', items: ['jam'], body: '果实、甜味和气味反复回来。同一种东西，落到不同的人身上，会留下不同的感受。' },
    { id: 'spoon', book: 'pregnancy', title: '纸条与小勺', art: 'spoon', items: ['note','spoon'], body: '你把两样东西都看过，才从这间屋子离开。动作很小，后面的空白却很长。' },
    { id: 'pledge', book: 'dormitory', title: '入住的纸页', art: 'd2-pledge', items: ['d2-pledge'], body: '最初，宿舍只是一个暂时住进去的地方。回头读时，这张纸已经连着很长的一段探访。' },
    { id: 'flowers', book: 'dormitory', title: '同一片花坛', art: 'd2-blue', items: ['d2-red','d2-orange','d2-purple','d2-blue'], body: '花色在几次探访间改变，建筑却一直留在同一个地方。前后并排放着，变化就有了可见的轮廓。' },
    { id: 'letters', book: 'dormitory', title: '两次来信', art: 'd2-letter1', items: ['d2-letter1','d2-letter2'], body: '信把远处和眼前短暂连起。它说出的内容和没有说出的部分，都留在反复展开的纸面上。' },
    { id: 'vent', book: 'dormitory', title: '光照进去的地方', art: 'd2-grille', items: ['d2-grille'], flags: ['task_torch'], body: '手电照进通气孔时，你看清了一部分东西。故事留下的余地，仍在那束光以外。' },
    { id: 'telegram', book: 'cafeteria', title: '电报里的晚安', art: 'd3-telegram', items: ['d3-telegram'], body: '一句简短的话先抵达纸面，后来又在别的声音和记忆里慢慢回来。' },
    { id: 'meals', book: 'cafeteria', title: '一千多人的饭', art: 'd3-menu', items: ['d3-menu'], flags: ['wiped_glass'], body: '隔着窗看见的工序逐渐清楚。许多人的饭从这里经过，眼前的具体动作也因此有了重量。' },
    { id: 'pool', book: 'cafeteria', title: '雨落进水里', art: 'd3-red-cap', items: ['d3-red-cap'], flags: ['heard_pool'], body: '雨声和水声把此刻推向了另一段时间。你按住倾听，让回忆慢慢显出来。' },
    { id: 'factory', book: 'cafeteria', title: '铁味之后', art: 'd3-factory-objects', items: ['d3-factory-objects'], flags: ['heard_chocolate'], body: '废厂里的物件、味道与很早以前的记忆连在一起。离开画面后，感官留下的东西还没有立刻散去。' }
  ],
  events: [
    { id: 'window', title: '窗边的纸影', body: '猫停在页边，爪下压着两片挨得很近的纸。你先把哪一片托起来？', choices: [ { text: '先托起压住的那片', response: '底下的纸边完整地露出来。猫顺着那条边继续往前。', ink: 3, seconds: 3 }, { text: '先夹好松开的那片', response: '你替它留住了容易滑走的一角。旁边的一笔细线也清楚了。', ink: 6, seconds: 0 } ] },
    { id: 'footstep', title: '页边停了一下', body: '它回头看你，鼻尖碰着一小块折起的纸。', choices: [ { text: '把折角轻轻展平', response: '它从平整的纸面走过去，脚步快了一点。', ink: 3, seconds: 3 }, { text: '把折角的样子记下来', response: '你在便签上留下一道短线。它继续沿着自己的路走。', ink: 6, seconds: 0 } ] },
    { id: 'light', title: '灯光照到纸背', body: '猫走过的地方透出一点光。你挪动书页，让那道光落稳。', choices: [ { text: '给它让出一条平路', response: '书页微微一沉，它已经走到了近处。', ink: 3, seconds: 3 }, { text: '看看光里留下的痕迹', response: '你多记住了一点纸面的纹路。它的尾巴在页边晃了晃。', ink: 6, seconds: 0 } ] }
  ],
  guideNotes: [
    { id: 'paw', title: '纸面的脚印', body: '很淡的一点痕迹，像刚刚有人把手指放在这里。' },
    { id: 'crease', title: '折角', body: '展开后还有一道浅线。你把它夹回已经读过的地方。' },
    { id: 'warmth', title: '灯下的温度', body: '猫在书旁待了一会儿，纸面也仿佛暖了一点。' }
  ]
};
})();
