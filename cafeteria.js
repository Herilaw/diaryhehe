/* Third story. Every cleaned body paragraph is retained with its source-line IDs. */
(() => {
'use strict';
const vn=window.VN,scenes=vn.scenes,items=vn.ITEMS,source=window.CAFETERIA_SOURCE;
const STORY='傍晚的配餐室和雨中的游泳池';
Object.assign(vn.ART_ALIASES,{'d3-bath-pink':'d3-bath-pink-v2','d3-rain-room':'d3-rain-room-v2','d3-home-ready':'d3-home-ready-v2','d3-shrimp-line':'d3-shrimp-line-v2','d3-stove':'d3-stove-v2'});
const n=(s,t,more={})=>({s,t,...more}),a=t=>n('',t),me=t=>n('我',t),say=t=>n('我',t,{spoken:true}),father=t=>n('男人',t),boy=t=>n('男孩',t);
const choice=(t,options)=>n('我',t,{choices:options}),opt=(text,reply=[],more={})=>({text,reply,...more});
const add=(id,chapter,bg,nodes,more={})=>{const s={id,story:STORY,noteKey:'cafeteria',chapter,date:'',bg,cast:[],narrator:'d3-narrator-bust',inside:true,nodes,...more};scenes.push(s);return s;};
const item=(id,name,pages,more={})=>items[id]={name,art:id,pages,story:STORY,carry:false,...more};
const look=(t,ids,more={})=>n('我',t,{explore:{items:ids.map((id,i)=>({id,x:ids.length===1?52:ids.length===2?35+i*30:23+i*27,y:46,w:ids.length===1?22:19})),required:ids,missing:'还有一处没有看清。'},...more});
Object.assign(vn.PORTRAITS,{
 'd3-fiance-bust':{name:'未婚夫'},'d3-realtor-bust':{name:'女办事员'},
 'd3-father-bust':{name:'男人'},'d3-father-rain-bust':{name:'男人'},
 'd3-boy-bust':{name:'男孩'},'d3-boy-rain-bust':{name:'男孩'},'d3-boy-dusk-bust':{name:'男孩'},
 'd3-boy-memory-bust':{name:'小时候的他'},'d3-grandfather-bust':{name:'爷爷'}
});
item('d3-stove','德国造的煤气灶',['我扭了扭开关。咔、咔，声音很干脆。','女办事员说，十年前住在这里的德国留学生留下了它。他因此放心；我仍看着瓷砖露出的水泥。']);
item('d3-album','旧信与影集',['本来只想把它们放进柜子。读完一封，又翻到下一页，一上午便过去了。','照片里的年月都还清楚。陪我搬进这间房子的，却只有赳赳。']);
item('d3-bread-soup','即食汤与干面包',['厨房用具和餐具都还不齐。窗外一直下雨，我也懒得出去。','煤气灶很好用。面包却很干，嚼它的时候，雨声格外清楚。']);
item('d3-paint','粉红色油漆',['搪瓷浴盆、银色水龙头、毛巾架。小小的浴室没有什么多余的东西。','旧瓷砖的角落里还留着很淡的粉红。新的颜色，一点点盖了上去。']);
item('d3-yellow-boots','黄色的小雨靴',['水珠沾在小得像玩具的雨靴上。孩子没有拿伞，也没有笑，只紧紧拉着父亲的手。','我只把这一眼留在记忆里，并没有把它从孩子脚上拿走。'],{echo:'threshold'});
item('d3-chain','赳赳的狗链',['赳赳已经跟了我十年。它的个头和项圈的样子，像回忆下面的日期。','链子能接住阳光。握在手里时，却总是冰凉的。'],{echo:'chain'});
item('d3-dish-basket','鸟笼一样的餐具筐',['里面装着盘子、碗和勺子。传送带走得像旋转木马一样慢。','清洗液从四面喷来，筐子消失几秒，又带着水珠出来。最后，餐具会被送进烘干机。'],{echo:'conveyor'});
item('d3-menu','一千多人的饭',['上千个面包、炸虾、柠檬片和牛奶。上千个洋葱，十公斤黄油，五十升色拉油，上百捆意大利面。','男人说，二楼好像是控制室。一个程序设置下去，机器便依次切虾背、裹粉、裹蛋、裹面包渣，再送进油里。','明天是汉堡包。他看见那台像巨大刨冰机一样的绞肉机被搬出来了。']);
item('d3-wedding-telegram','婚礼前的电报',['“下周六十点在教堂门前见面。”','“尽快办理居民证迁出手续。”','我们买不起电话。生活里的事情，只好这样一件一件送过来。'],{inscription:'下周六十点\n教堂门前见面'});
item('d3-telegram','“晚安”',['只有一个词。总在我一条腿已经跨上床时送来。','我穿着睡衣站在昏暗的玄关，把它反复看上五十遍。每一个字都渗进了身体。'],{inscription:'晚　安',echo:'goodnight'});
item('d3-carton','窗下的胡萝卜箱',['箱子侧面画着熟透的红胡萝卜。附近还有装冷冻鱿鱼、布丁、玉米和英国辣酱油的箱子。','太阳要落下去了。男孩晃着腿，男人望着远方，配餐室里已经没有人。']);
item('d3-red-cap','红色泳帽',['不会游泳的孩子要戴这种红帽子。其他孩子戴的是白底黑条泳帽。','雨水和泳池里的水混在一起。摘下帽子，头发会被染成淡红色。','他说，自己不记得因此受过欺负。那种想融入集体的吃力，并不全来自别人做了什么。'],{echo:'pool'});
item('d3-aluminum-tray','铝制餐具',['铝制餐具一碰响，那些画面就会重新浮现。','他努力要咽下去，身体却像在水里一样，不听自己的话。'],{echo:'meal'});
item('d3-shovel','铁锹与靴底纹',['二十五年前那间木头配餐室里，做的是炖菜和土豆沙拉。','修路用的铁锹搅动着肉、洋葱和胡萝卜。另一个锅里，黑胶靴把土豆踩碎，纹路一层层重叠。','这是他讲述的童年所见，不能拿来解释眼前那间干净、精密的配餐室。']);
item('d3-swim-bag','装着泳具的塑料包',['那天恰好有游泳课。他背着书包，膝盖一下下顶着泳具包，在街上走。','以为已经走了很久，其实只过了两个小时，便遇到了爷爷。']);
item('d3-factory-objects','铁锈里的小东西',['六边形和四边形的螺母、弹簧、干电池、柠檬碳酸饮料空瓶、老式发卷、陶笛、温度计。','喀秋莎是一种老式发卷；奥卡利那笛是 ocarina 的中文音译，也就是陶笛。小小的东西都埋在红锈和尘土里。','据说，意大利北部一个小村的面包师，经常用烤箱烧制低温陶制玩具和一些新奇的东西。一次，他做出了一种上面带着像脖子一样哨口的蛋形玩具，因为很像常见的小鹅，就把它叫作“ocarina”。这个词在意大利方言里，就是“小鹅”的意思。']);
item('d3-roller','停转的滚轮',['它已经只是一个沉重的铁块。塑料背包被挂在旁边的操作杆上。','最初闻到的只有干燥的铁味。再等一会儿，仿佛有很远、很柔和的甜味飘了过来。'],{echo:'chocolate'});
item('d3-beer','爷爷的啤酒罐',['啤酒越剩越少，他喝得也越来越慢，不时往罐口里看。','空罐落进破烂堆，哐啷一声，仿佛在那里待了好多年。']);
item('d3-envelope','修学旅行基金',['今天必须交给老师的钱，还放在书包里的信封中。','“拿这个买酒喝吧。”他把信封放到台座上。爷爷喝红的眼角，聚起了皱纹。','我把这一幕记住了。它没有替祖父后来的人生另写一个结局。']);

vn.ECHO_RECORDS=[
 {id:'threshold',title:'雨里的门槛',art:'d3-yellow-boots',place:'玄关',text:'两摊水。一个没有姓名的人，问起“难处”。',sound:'rain'},
 {id:'chain',title:'链子的温度',art:'d3-chain',place:'土堤',text:'十年的回忆里，始终有一只狗。',sound:'chain'},
 {id:'conveyor',title:'缓慢的鸟笼',art:'d3-dish-basket',place:'配餐室',text:'喷头停下，水珠还留在铁丝上。',sound:'machine'},
 {id:'pool',title:'淡红色的头发',art:'d3-red-cap',place:'雨中的游泳池',text:'水的压力，想不被人注意的努力。',sound:'pool'},
 {id:'meal',title:'铝碗碰响',art:'d3-aluminum-tray',place:'旧配餐室',text:'还没有来得及辨认情绪，胸口就已经堵住。',sound:'metal'},
 {id:'chocolate',title:'铁味之后',art:'d3-roller',place:'巧克力工厂',text:'机器停了。甜味似乎还能从很远的地方回来。',sound:'cicada'},
 {id:'goodnight',title:'晚安',art:'d3-telegram',place:'家',text:'纸的触感，字的形状，夜晚的空气。',sound:'paper'}
];
vn.ECHO_RECORDS.sort((a,b)=>['threshold','chain','conveyor','goodnight','pool','meal','chocolate'].indexOf(a.id)-['threshold','chain','conveyor','goodnight','pool','meal','chocolate'].indexOf(b.id));
vn.LISTENINGS={
 pool:{title:'隔着同一扇窗',present:'d3-catering-empty',memory:'d3-pool-rain',sound:'pool',echo:'pool',lines:['窗里的传送带没有动。','雨落在洋铁皮屋顶上。','同一片寂静里，出现了另一个人的夏天。']},
 meal:{title:'胸口的回声',present:'d3-school-corridor',memory:'d3-old-catering',sound:'metal',echo:'meal',lines:['先是铝制餐具的声音。','然后，铁锹、蒸汽和靴底纹一起回来。','吞咽和游泳，都成了一件用力也做不到的事。']},
 chocolate:{title:'再等一会儿',present:'d3-roller-cg',memory:'d3-chocolate-memory',sound:'cicada',echo:'chocolate',lines:['最初只是干燥的铁味。','蝉还在叫。没有人催他回学校。','很远的地方，仿佛有一点香甜的气味。']}
};

add('d3-bridge','最后一篇','d3-reader-night',[
 a('我把第二张手记放在第一张旁边。纸上有几个字被我划掉了。划得很重，透过背面还能摸到笔尖留下的凹痕。'),
 me('“他一定……”'),a('我读到这里，没有接下去。那两个字已经被划掉。我能说的是自己看见了什么，再往后的部分，书没有给我。'),
 a('桌上的茶已经凉透。我把杯子端起来，才发现肚子有些饿。窗外的楼一盏接一盏亮起灯，下午就这样过去了。'),
 choice('厨房离这里只有几步。',[
  opt('先给自己弄一点吃的',[a('我热了一点剩饭。锅里响起很小的噼啪声，我把火调低，等那阵声音缓下来。'),a('盛饭的勺子碰到碗沿。我忽然想起那只右脚，停了一下，才继续把饭盛满。')]),
  opt('先去洗掉杯子里的茶渍',[a('水流冲着杯底，绕过一道浅褐色的圆。我用拇指擦了两下，茶渍才慢慢淡下去。'),a('关上水龙头，管道里还响了一会儿。我站着听到最后，才把杯子扣好。')])
 ]),
 a('回到客厅时，台灯已经显得比窗外亮了。书摊在原处。第二篇的末行下面，纸张空出很大一块地方。'),
 me('原来不是每个故事，都要把最后一点地方填满。'),
 a('我翻过那一页。下一篇的题目很长，要一字一字看过去。'),
 a('《傍晚的配餐室和雨中的游泳池》。'),
 choice('我把书往灯下面挪了一点。',[
  opt('先想一想自己记得的泳池',[a('我先想起消毒水味，再想起湿脚踩上地面的冷。至于那时和谁一起去，倒要等一会儿才想起来。')]),
  opt('把注意力放在“傍晚”上',[a('那个时候，学校应该已经安静了。走廊、课桌，还有放学后没人再经过的窗口，都比白天显得长一些。')])
 ]),
 a('窗玻璃上轻轻响了一下。我以为是树叶，转过头，才看见一点雨水正沿着玻璃往下滑。'),
 a('下午明明还是晴天。我走到窗边，把开着的一条缝合上。雨声小了些，屋里却更容易听见别的声音。'),
 me('不是电话了。'),a('很轻的一声金属摩擦，像链子绕过门把手。我朝玄关看去，那里没有狗，也没有挂着会响的钥匙。'),
 a('我坐回去，将前两张手记压在书边。这次我记得自己在哪里，也记得是为什么打开它。'),
 choice('书页上的第一句话还没有读完。',[
  opt('把手机放远一点，继续读',[a('我把手机扣在沙发上。屏幕熄灭以后，纸上的字反倒更清楚了。'),me('如果有人说话，我这次先听下去。')]),
  opt('把桌灯拨亮一格',[a('灯罩里面传来一声轻响。光落到手背上，仍是客厅里的暖色。'),me('慢慢来。不是每个停顿，都需要我替它找答案。')])
 ]),
 a('“我和赳赳一起搬去那个家，是在一个被雾笼罩的初冬的早晨。”'),
 a('赳赳。我在心里念了一遍这个名字。脚背忽然碰到一小团热意，像有什么东西在椅子下翻了个身。'),
 me('等一下，我还没有——'),a('我低头去看。先看见的是一截卷着的尾巴，随后是脚边的三叶草。客厅里没有三叶草。'),
 a('雨声被拉远了。一辆小卡车在我听不见发动机的地方，发出哐当哐当的声音。手下也不再是桌子，而是一块凉凉的木板。'),
 n('','我仍握着书角。纸的边缘却慢慢变软，变成了开襟毛衣的一角。雾从檐廊外移过来，一只温热的鼻子轻轻碰了碰我的手。',{fx:'book',exitTarget:'d3-move'})
],{inside:false,bridge:true,autoNext:true});

function visual(i){
 if([203,229,268].includes(i))return {bg:'d3-sleeping-child',cast:[],ambience:'dusk'};
 if(i===241)return {bg:'d3-hand-cg',cast:[],ambience:'summer',memory:true};
 let v={bg:'d3-house-mist',cast:[],dog:'d3-dog-rest',ambience:'mist'};
 if(i<=9)return v;
 if(i<=14)return {bg:'d3-house-room',cast:['d3-fiance-bust']};
 if(i<=22)return {bg:'d3-kitchen',cast:['d3-fiance-bust','d3-realtor-bust']};
 if(i===23)return {bg:'d3-house-room',cast:['d3-fiance-bust','d3-realtor-bust']};
 if(i<=27)return {bg:'d3-garden',cast:['d3-fiance-bust','d3-realtor-bust']};
 if(i<=36)return v;
 if(i<=40)return {bg:'d3-rain-room',cast:[],dog:'d3-dog-rest',ambience:'rain'};
 if(i<=45)return {bg:'d3-bath-faded',cast:[],ambience:'rain',fx:i===45?'doorbell':undefined};
 if(i<=77)return {bg:'d3-rain-entry',cast:['d3-father-rain-bust','d3-boy-rain-bust'],dog:'d3-dog-rest',ambience:'rain'};
 if(i===78)return {bg:'d3-house-room',cast:[]};
 if(i===79)return {bg:'d3-village',cast:[],dog:'d3-dog',ambience:'sea'};
 if(i<=81)return {bg:'d3-seawall-day',cast:[],dog:'d3-dog',ambience:'sea'};
 if(i<=111)return {bg:'d3-school-gate',cast:i>=83?['d3-father-bust','d3-boy-bust']:[],dog:'d3-dog',ambience:'sea'};
 if(i===112||i===121)return {bg:'d3-conveyor-cg',cast:[],ambience:'machine'};
 if(i<=160){
  if(i===127||i===131)return {bg:'d3-food-stores',cast:[],ambience:'machine'};
  if(i===133)return {bg:'d3-shrimp-line',cast:[],ambience:'machine'};
  return {bg:'d3-wash-window',cast:['d3-father-bust','d3-boy-bust'],dog:'d3-dog-rest',ambience:'machine'};
 }
 if(i===161)return {bg:'d3-home-ready',cast:[]};
 if(i===162)return {bg:'d3-laundry-rack',cast:['d3-fiance-bust'],dog:'d3-dog-rest'};
 if(i===164)return {bg:'d3-telegram-night',cast:[],dog:'d3-dog-rest',ambience:'night'};
 if(i<=167)return {bg:'d3-steam-school',cast:[],dog:'d3-dog',ambience:'sea'};
 if(i<=169)return {bg:'d3-seawall-dusk',cast:[],dog:'d3-dog',ambience:'sea'};
 if(i<=200)return {bg:'d3-catering-dusk',cast:['d3-father-bust','d3-boy-dusk-bust'],dog:i>=195?'d3-dog-rest':'d3-dog',ambience:'dusk'};
 if(i===201||i===204)return {bg:'d3-pool-rain',cast:[],ambience:'rain',memory:true};
 if(i===219)return {bg:'d3-pool-eyewash',cast:[],ambience:'rain',memory:true};
 if(i<=227)return {bg:i===218?'d3-catering-empty':'d3-catering-dusk',cast:i===218?[]:['d3-father-bust'],dog:'d3-dog-rest',ambience:'dusk'};
 if(i===228||i===230||i===233)return {bg:'d3-old-catering',cast:[],ambience:'steam',memory:true};
 if(i===237)return {bg:'d3-school-corridor',cast:[],ambience:'metal',memory:true};

 if(i<=240)return {bg:i===238?'d3-catering-dusk':'d3-truant-road',cast:i===238?['d3-father-bust']:['d3-boy-memory-bust','d3-grandfather-bust'],dog:i===238?'d3-dog-rest':null,ambience:i===238?'dusk':'summer',memory:i!==238};
 if(i===242)return {bg:'d3-factory-outside',cast:['d3-boy-memory-bust','d3-grandfather-bust'],ambience:'summer',memory:true};
 if(i<=267)return {bg:i===255||i===256||i===258?'d3-chocolate-memory':i>=260&&i<=265?'d3-roller-cg':'d3-factory-inside',cast:[250,251,252,253,254,259,262,264,266,267].includes(i)?['d3-boy-memory-bust','d3-grandfather-bust']:[],ambience:'summer',memory:true};
 if(i<=278)return {bg:'d3-catering-dusk',cast:['d3-father-bust'],dog:'d3-dog-rest',ambience:'dusk'};
 if(i<=288)return {bg:'d3-goodbye',cast:i<=286?['d3-father-bust','d3-boy-dusk-bust']:[],dog:'d3-dog',ambience:'dusk'};
 return {bg:'d3-homeward',cast:[],dog:'d3-dog',ambience:'night',fx:'homeward'};
}
const defs=[
 ['d3-move','晨雾',6,9],['d3-viewing','德国造的煤气灶',10,27],['d3-three-weeks','最后三周',28,36],
 ['d3-rain','没有电话的雨天',37,40],['d3-paint','粉红色的浴室',41,45],['d3-threshold','有什么难处吗',46,77],
 ['d3-walk','土堤上的午后',78,99],['d3-window','配餐室',100,126],['d3-thousand','一千多人的饭',127,160],
 ['d3-home','新家的形状',161,164],['d3-absence','十天左右',165,167],['d3-dusk','窗下的纸箱',168,194],
 ['d3-pool','雨中的游泳池',195,219],['d3-meal','咽不下去的东西',220,237],['d3-grandfather','逃学的上午',238,241],
 ['d3-factory','秘密的地方',242,254],['d3-chocolate','铁味之后',255,267],['d3-parting','从明天开始',268,289]
];
for(const[id,chapter,start,end]of defs)add(id,chapter,visual(start).bg,source.records.filter(r=>r.ids[0]>=start&&r.ids[0]<=end).map(r=>({...n(r.s==='他'?'未婚夫':r.s,r.t,{spoken:r.spoken,sourceIds:r.ids}),...visual(r.ids[0])})));
function insert(id,nodes,where='after'){
 const s=scenes.find(s=>s.story===STORY&&s.nodes.some(n=>n.sourceIds?.includes(id)));if(!s)throw Error('Missing third-story paragraph '+id);
 const at=s.nodes.findIndex(n=>n.sourceIds?.includes(id)),base=visual(id);
 s.nodes.splice(at+(where==='after'?1:0),0,...nodes.map(q=>({...base,...q})));
}
insert(9,[choice('赳赳在脚边哼了一声。我还有整整一个早晨。',[
 opt('先摸一摸它的脖子',[a('手指底下是热的。它把下巴放到我的膝上，像是在确认纸箱都搬进来了，自己也不用再走了。'),say('今天先不急，赳赳。')]),
 opt('先认一认屋里的声音',[a('小卡车走远后，木板偶尔轻响一下。再往外听，只有雾里的鸟声。我一时还找不到“家里”应该从哪里算起。')])
])]);
insert(20,[look('我蹲下来，把刚才那两三个开关又看了一遍。',['d3-stove'],{cast:[]}),choice('他还在等我的意见。',[
 opt('“好用就行。以后坏了我们再修。”',[n('未婚夫','嗯。先试过，再担心也来得及。'),say('瓷砖的缺口倒是一眼就看得见。'),n('女办事员','这里打扫得很干净。您看，边角我也都擦过了。')]),
 opt('“德国造，就一定不会出毛病吗？”',[n('未婚夫','也不是一定。只是我喜欢这种结实的老东西。'),say('那我记下来了，是你喜欢。'),a('他说着笑了一下。我也没有继续扭那个开关。')])
])]);
insert(36,[a('赳赳把头压低了一点。我腾出一只手，开始拆下一只纸箱。这间房子还要慢慢学会，怎样容下我们。')]);
insert(38,[look('旧信和影集被放在一旁。眼前这顿饭，也简单得不能再简单。',['d3-album','d3-bread-soup']),choice('我本来想把一上午花在收拾上。',[
 opt('再看完手里的这一封',[a('我读到落款，才把信折好。那些过完的日子，有时比还没过的日子更容易叫人停下来。')]),
 opt('把影集轻轻合上',[say('下午先做一件能做完的事。'),a('我把它放进衣柜，不再给自己留着半页。')])
])]);
insert(44,[look('刷子的柄已经被我握热了。墙上那一点旧粉红，快被新的颜色遮住。',['d3-paint']),choice('还有一面墙没有刷完。',[
 opt('先退后一点，看颜色匀不匀',[a('雨点从窗外飘进来。我挪开油漆罐，尽量不让它们碰到刚刷过的地方。')]),
 opt('沿着水龙头的边缘慢慢刷',[a('我把刷子侧过来，留出银色的边。换气扇一直转着，和窗外的雨声掺在一起。')])
])]);
insert(54,[look('我的视线落到孩子脚下。',['d3-yellow-boots'],{cast:[]})]);
insert(62,[choice('“难处”。他没有催我，问题却一直停在那里。',[
 opt('先问他，是指哪一种难处',[say('是生活里的事，还是别的什么？'),father('您愿意说的，都可以。'),a('这话没有把问题变得容易。我望了一眼还在往下滴水的帽檐。')]),
 opt('看看孩子有没有在发冷',[say('小朋友淋着雨，没关系吗？'),father('谢谢。我们不会耽搁太久。'),a('孩子仍旧抓着他的手。我不知道这种时候，怎样的招呼才不显得生硬。')])
])]);
insert(77,[a('两摊水的边缘慢慢变浅。我没有追出去问姓名，只回到开着换气扇的浴室。'),n('我','刚才刷到哪里了？',{spoken:true,bg:'d3-bath-pink',cast:[],dog:null}),n('','刷子重新落到墙上。外面的雨没有因为谁来过，又走了，而改变一点声音。',{bg:'d3-bath-pink',cast:[],dog:null})]);
insert(81,[look('链子在阳光下闪着。我把手握紧了一点。',['d3-chain'])]);
insert(99,[choice('赳赳已经停在门柱旁。男孩的眼睛还跟着它。',[
 opt('把狗链放长一点',[say('它不咬人的。只是刚到这里，什么都想闻一闻。'),boy('它也搬家了吗？'),say('对。和我一起。')]),
 opt('先等男孩自己靠近',[a('我没有把赳赳往他怀里送。赳赳绕了一小圈，找到舒服的地方，又伏下了。')])
])]);
insert(112,[look('那只装满餐具的“鸟笼”刚从水雾里出来。',['d3-dish-basket'],{cast:[],dog:null})]);
insert(126,[choice('窗上留着我们呼吸的雾气。',[
 opt('跟着传送带，等下一次停顿',[a('它没有因为我们在看而变快。喷头响起，餐具的轮廓消失，再重新显出来。'),say('我好像有一点明白，他为什么能一直看了。')]),
 opt('问一问上午会是什么样',[say('一千多人的饭，真的能在这里一起做出来吗？'),father('能。等做饭的时候，这里面比现在还要忙。')])
])]);
insert(133,[n('','我在脑海里跟着那一只虾走完了全程。玻璃这边的我们，却只听见洗餐具的水声。',{bg:'d3-shrimp-line',cast:[],dog:null})]);
insert(130,[n('我','他擦开的地方，又渐渐蒙上一层水汽。我伸出手指，贴上玻璃。',{bg:'d3-wash-window',cast:[],dog:null,wipe:'glass'})]);
insert(146,[choice('他说得比第一次来我家时轻松。我还有很多事情不知道。',[
 opt('先不追问他的工作',[say('看来，这里倒像是你们每天会来报到的地方。'),father('孩子高兴，我也能歇一会儿。')]),
 opt('看看男孩正在看哪里',[a('他的目光沿着餐具筐往前挪，到了喷头下就停住。赳赳的毛沾在他的毛衣上，他一点也没留意。')])
])]);
insert(160,[look('我在心里，把那一长串食物重新排了一遍。',['d3-menu'],{cast:[],dog:null})]);
insert(162,[choice('晾衣架的横杆已经磨光了。他把手里的碎木屑拍掉。',[
 opt('“以后就把床单晒在这里。”',[n('未婚夫','太阳好的时候，下午应该就干了。'),say('赳赳不要去咬就好。'),a('我们一齐望向它。它闻了闻木头，好像并没有觉得这是什么了不起的东西。')]),
 opt('摸摸横杆，试试还有没有木刺',[a('掌心从一头慢慢滑到另一头，没有被扎到。他站在旁边，很认真地看着我的手。'),say('很好。可以用了。')])
])]);
insert(164,[look('我把送来的电报放在灯下，一张一张看。',['d3-wedding-telegram','d3-telegram'],{cast:[],dog:null}),choice('“晚安”。下面没有更多字了。',[
 opt('再读一遍',[a('我这次读得很慢。玄关很冷，纸边贴着掌心，字却一点点暖起来。')]),
 opt('把电报放到枕边',[a('我没有把它塞进装旧信的纸箱。晚上伸手能碰到的地方，还空着一点位置。')])
])]);
insert(167,[a('我没有为了等人，把狗链拉回去。只是每次经过这里，总会在那个看不清的窗口前慢一点。')]);
insert(181,[look('我们可以坐的地方，就是这一只胡萝卜箱。',['d3-carton'],{cast:[],dog:null}),choice('男孩又去追赳赳了。我坐下时，纸箱轻轻响了一下。',[
 opt('等他先开口',[a('海风穿过校舍的缝隙。没有上课铃，也没有餐具落进水里的声音。这个时候，不说话并不难受。')]),
 opt('“下午的这里，原来这么安静。”',[father('刚才还忙着的。停下来以后，就显得很静。'),a('他朝窗里看去。我也看了一眼已经干透的台面。')])
])]);
insert(194,[a('话题转来转去，总能回到赳赳。它已经不再绕着孩子跑，慢慢把身体放低。')]);
insert(205,[look('在他的讲述里，那顶红泳帽比泳池的水还要清楚。',['d3-red-cap'],{bg:'d3-pool-eyewash',cast:[],dog:null,memory:true})]);
insert(207,[choice('他撕胶带的手停了一下，像是打算把话收回去。',[
 opt('“你可以接着说。”',[say('我在听。你不用把它讲得有意思。'),a('他把手里那一小段胶带折起来，没有立即再撕。')]),
 opt('先把自己的身体转向他',[a('我往箱子边挪了挪，背对越来越冷的海风。他抬起眼，确认我没有准备起身。')])
])]);
insert(219,[n('我','窗里已经没有水声了。我却仿佛听见，另一处屋顶正在下雨。',{bg:'d3-catering-empty',cast:[],dog:null,ambience:'dusk',memory:false,listen:'pool'})]);
insert(228,[a('我没有闻到他曾经闻过的那种气味。可是他说到这里，我知道那并不是一句“不喜欢吃饭”可以说完的事。')]);
insert(234,[look('那些动作，比“可怕”两个字更早地留在了他身上。',['d3-shovel'],{bg:'d3-old-catering',cast:[],dog:null,memory:true})]);
insert(237,[look('餐具一碰响，刚才的画面就又回来了。',['d3-aluminum-tray','d3-swim-bag'],{cast:[],dog:null}),n('我','我没有打断他。空了的配餐室里，那些铝碗已经收好，一点声音也没有。',{listen:'meal',cast:[],dog:null})]);
insert(241,[choice('他的讲述走出学校，来到那条上午的街道。',[
 opt('跟着那只伸过来的手',[a('平时不喜欢的酒气，那天没有把他推开。他把另一只手攥紧，和爷爷一起，往学校以外的方向走。')]),
 opt('看看孩子带着的泳具包',[a('红泳帽还在包里。没有人把它拿出来，也没有人问他为什么这时候不在学校。')])
])]);
insert(244,[look('脚底下咯吱作响。尘土里，有些东西还认得出来。',['d3-factory-objects'],{cast:[],dog:null})]);
insert(254,[n('爷爷','是做巧克力的。',{bg:'d3-factory-inside',cast:['d3-boy-memory-bust','d3-grandfather-bust'],memory:true}),choice('男孩抬头。那些没法辨认的铁块，忽然有了一个用途。',[
 opt('看爷爷指着哪一台机器',[a('指尖从投料口移到下一台机器，再指向脚下的滚轮。那是一条已经停下，却还可以沿着话语走一遍的路线。')]),
 opt('想象这里从前的样子',[a('墙还是完整的时候，天光不会这样落下来。那时，铁锈底下也许是涂得很亮的油漆。')])
])]);
insert(261,[look('滚轮没有转。手底下是干燥而粗糙的铁。',['d3-roller'],{cast:[],dog:null}),n('我','不要急着睁眼。先是铁味，再等一会儿。',{listen:'chocolate',cast:[],dog:null})]);
insert(267,[look('空罐已经落进尘土。信封还放在机器台座上。',['d3-beer','d3-envelope'],{bg:'d3-factory-inside',cast:[],dog:null,memory:true})]);
insert(269,[choice('故事停下来，眼前只剩窗下的暮色。',[
 opt('想问那之后的生活',[a('我已经想好要问什么，却等了一会儿，才把那句话说出来。他的目光没有离开远处。')]),
 opt('先把刚才听见的停顿留住',[a('我没有立刻接话。那只空罐的声音，似乎还在机器底下回荡。等它消散以后，我才开口。')])
])]);
insert(275,[a('没有一个足够长的结尾，让刚才的一切各就各位。他说完了，我却仍在那个有铁味的地方站着。')]);
insert(288,[a('我没有再问他姓名，也没有问明天该怎样联系。孩子的手被父亲牵住，帽顶的小绒球晃了一下。')]);
const last=scenes.find(s=>s.id==='d3-parting');last.nodes.push(n('','我跑过一扇已经拉下的卷帘门。狗链冰凉，掌心却很热。我只想赶在最后一点晚风之前，重新碰到那张写着“晚安”的纸。',{bg:'d3-homeward',cast:[],dog:'d3-dog',ambience:'night',fx:'book',exitTarget:'d3-return'}));last.autoNext=true;
add('d3-return','灯下的纸','d3-reader-night',[
 a('脚步停下来的时候，我仍坐在客厅里。台灯亮着，窗外还在下雨。手指间夹着的，是那页小说的纸边。'),
 me('晚安。'),a('这两个字不是写给我的。我还是轻轻读了一遍，读得比在书里时更慢。'),
 a('我低头看向脚边。没有赳赳。沙发底下只有自己的拖鞋，一只比另一只朝外偏了一点。'),
 choice('书里的那个下午，终于完整地留在了纸上。',[
 opt('想一想爷爷的那只手',[me('他没有把逃学的孩子送回去，也没有先要一个解释。'),me('可他不是因此就变成一个没有问题的人。那只啤酒罐，和后来那句死讯，都还留在那里。')]),
 opt('想一想男孩为什么爱看配餐室',[me('我仍不知道那个小男孩，看见的和父亲是不是同一种东西。'),me('我听见的是父亲讲出的回忆。孩子安静地看着，后来靠着赳赳睡着了。那一小块地方，仍属于他自己。')]),
 opt('想一想回家时冰凉的狗链',[me('她正在走向一场不被祝福的婚姻，也正一点点把房子收拾成家。'),me('听完别人的孤独以后，她想回去读“晚安”。我觉得自己现在能跟上那几步了。')])
 ]),
 a('我把书往前翻了一点。妊娠的姐姐、没有等到的表弟、隔着窗口讲故事的男人，仍各自在他们的段落里。'),
 me('我不能把他们带到同一个答案里。'),a('但有些声音已经不一样了。厨房里碰响的勺子、楼道里擦过的鞋底，还有窗外的雨，各自有了停顿。'),
 me('至少，我愿意多听一会儿。'),
 n('我','这一次，我把记得的声音，和没能说清的话，一起留在灯下。',{finish:'cafeteria'})
],{inside:false,nextStory:'d3-bookmark'});
add('d3-bookmark','合上书以后','d3-reader-night',[
 a('第三张手记夹进书里。纸角没有完全对齐，我用手指理了理，没有把它们藏进书页深处。'),
 me('都在这里了。'),a('我慢慢合上封面。客厅没有随之熄灭，雨也没有停。杯子、台灯和书，仍在可以伸手碰到的地方。'),
 a('我把书放到桌边，为明天留出一块空地方。'),
 n('','灯下，三张薄薄的书签各自露着一角。',{finish:'session'})
],{inside:false});
scenes.find(s=>s.id==='d2-return').nextStory='d3-bridge';
// A legacy two-story save may resume at this bookmark. Continue it into the new chapter.
const old=scenes.find(s=>s.id==='d2-afterword');old.nodes.at(-1).finish=undefined;old.nodes.at(-1).t='书里还有一篇。我把灯拨亮，手掌重新放回封面上。';old.autoNext=false;
for(const s of scenes.filter(s=>s.story===STORY))for(const node of s.nodes)for(const o of node.choices||[])for(const reply of o.reply||[]){for(const key of ['bg','cast','dog','ambience','memory'])reply[key]??=node[key]??s[key];}
})();
