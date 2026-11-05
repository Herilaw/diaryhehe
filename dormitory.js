/* Complete source-led adaptation of 学生宿舍. Original passages remain traceable. */
(() => {
'use strict';
const vn=window.VN,source=window.DORM_SOURCE,scenes=vn.scenes,items=vn.ITEMS;
vn.ART_ALIASES={'d2-manager-room':'d2-manager-room-clean','d2-manager-bed':'d2-manager-bed-clean'};
const n=(s,t,more={})=>({s,t,...more}),a=t=>n('',t),me=t=>n('我',t),say=t=>n('我',t,{spoken:true});
const manager=t=>n('先生',t),cousin=t=>n('表弟',t),choice=(t,options)=>n('我',t,{choices:options}),opt=(text,reply=[],more={})=>({text,reply,...more});
const obj=(id,x=53,y=49,w=19)=>({id,x,y,w});
const look=(t,ids,more={})=>n('我',t,{explore:{items:ids.map((id,i)=>obj(id,ids.length===1?54:ids.length===2?36+i*28:24+i*26,49,ids.length===1?21:18)),required:ids,missing:'我还没有看清眼前的东西。'},...more});
const add=(id,chapter,bg,cast,nodes,more={})=>{const s={id,story:'学生宿舍',chapter,date:'',bg,cast,narrator:'d2-narrator-bust',nodes,...more};scenes.push(s);return s;};
const item=(id,name,art,pages,more={})=>items[id]={name,art,pages,story:'学生宿舍',...more};
Object.assign(vn.PORTRAITS,{
 'd2-cousin-bust':{name:'表弟'},'d2-manager-bust':{name:'先生'},'d2-manager-sick-bust':{name:'先生'},
 'd2-math-student-bust':{name:'数学系学生',mirror:true},'d2-librarian-bust':{name:'图书管理员'},'d2-shopkeeper-bust':{name:'店主'},'d2-manager-asleep-bust':{name:'先生'}
});
item('d2-directory','职业电话号码簿','d2-directory',['大大小小的宿舍广告挤在一起：浴室、电话、健身设施、隔音钢琴室。','那个宿舍只有很小的一行。我把号码抄在纸上，又对了一遍。'],{carry:false,record:'directory'});
item('d2-newspapers','二月以后的旧报纸','d2-newspapers',['从二月十四日起的地方版，被我一叠一叠翻过去。','报上有中毒、窒息、诈骗和误食毒蘑的消息。纸上的世界在继续运转，我却找不到那只左手。','笑蘑是一种毒蘑菇，学名是 Panaeolus papilionaceus。'],{carry:false,record:'newspapers'});
item('d2-list','购物单','d2-list',['自行车排在第一位。我们为它走了五家店，用了半天时间。','书箱可以重新油漆，教科书和参考书由我来送。有限的钱，一笔一笔地算。']);
item('d2-pledge','入住保证书','d2-pledge',['“我保证，在这个学生宿舍里，度过幸福的学生生活。”','表弟一笔一画地签上名字。我却怎么也想不起，自己从前是否签过这样一句话。'],{inscription:'我保证，在这个学生宿舍里，\n度过幸福的学生生活。',carry:false,record:'pledge'});
item('d2-sewing','没有缝完的拼布','d2-patchwork',['紫色与黄色的方格、佩兹利涡旋纹，被针脚接在一起。','我有时得打开纸箱，才能想起自己做的是床罩，还是壁饰。','这种华丽、精细的花纹以苏格兰西部的佩兹利命名。从十八世纪起，这个名字便与它连在了一起。'],{carry:false,record:'patchwork'});
item('d2-cake','草莓蛋糕','d2-cake',['本来是给表弟带来的。先生用右脚脚趾夹起银色的小叉子。','我仍在听自行车的声音。表弟一直没有回来。'],{carry:false,record:'cake'});
item('d2-pie','苹果派','d2-applepie',['十天以后，我又带着点心来到宿舍。','白纸盒在胸前渐渐变暖。这次仍没能亲手交给表弟。'],{carry:false,record:'pie'});
item('d2-notebook','数学笔记本','d2-notebook',['字迹饱满而工整。答案下面有两条下画线。','在先生的描述里，削尖的H铅笔、温热的咖啡与那个学生的左手，总连在一起。'],{carry:false,record:'notebook'});
item('d2-calendar','停在二月的日历','d2-calendar',['小论文、研讨小组联欢会、家教。二月十四日到二十三日标着滑雪。','他失踪的日子是二月十三日，旅行的前一天。'],{inscription:'二月\n13\n14 — 23　滑雪',carry:false,record:'calendar'});
item('d2-ticket','夜行巴士车票','d2-ticket',['车票还在手提包的口袋里。装着滑雪板的布套靠在书柜旁。','像出门只会花很短的一点时间，他仍给自己留下了回来的位置。'],{carry:false,record:'ticket'});
item('d2-letter1','第一封航空信','d2-letter-one',['黄色信封，外国女人的邮票，瑞典的邮戳。','换护照、搬家估算、通知邮局、去部长家告别、每天慢跑。五件事都写得清楚，却没有一件真正向我靠近。']);
item('d2-letter2','第二封航空信','d2-letter-two',['“准备得怎么样了？没收到你的回信，我很担心。”','电话水电煤气解约、国际驾照、税金、行李寄存、日本食品。连同上次的五件，已经有十件。']);
item('d2-pudding','奶油布丁','d2-pudding',['这次表弟去了高原集训。我把布丁盒放在先生枕头旁。','窗外在下雨。先生没有去医院，也没有答应会好起来。'],{carry:false,record:'pudding'});
item('d2-medicine','药粉与水','d2-medicine',['药袋在床头柜抽屉里。水杯、电话、纸巾与茶具，已经挪到了床边。','这是松弛肌肉、镇定神经的药。先生说，吃药也只是一种自我安慰。'],{carry:false,record:'bedside'});
item('d2-stain1','初见的圆形痕迹','d2-stain-small',['先生视线以上几乎没有东西。天花板角落里，只有一个直径约十五厘米的污垢。','我把它的位置记住了。当时并不知道，它会和后来发生的事连在一起。'],{carry:false,record:'stain1'});
item('d2-stain2','扩大了一圈的痕迹','d2-stain-medium',['几种颜料混合似的暗色，在天花板上染出一个圆。','蜜蜂穿过我们之间，停在正中央。它比入住那天大了一圈。'],{carry:false,record:'stain2'});
item('d2-stain3','雨天的深色痕迹','d2-stain-rain',['圆圆的痕迹又变大了，颜色也更深。白色天花板衬得它格外明显。','我正想问先生，那究竟是什么。他先开口，请我帮他吃药。'],{carry:false,record:'stain3'});
item('d2-stain4','滴液的阿米巴状痕迹','d2-stain-large',['圆形已经变得像阿米巴虫，扩展到头顶上。增加的不只是面积，还有体积。','黏稠的液体，正从它的中心慢慢滴落。'],{carry:false,record:'stain4'});
item('d2-red','最初的花坛','d2-garden',['入住那天，花坛里开着一排胭脂红的郁金香。','它们排在同一个长方形花坛里。'],{carry:false,record:'flower1'});
item('d2-orange','草莓蛋糕那天的花坛','d2-veranda',['这次开放的是橘黄色的一排。上次是胭脂红。','一只蜜蜂钻进杯形的花瓣，又从里面出来。'],{carry:false,record:'flower2'});
item('d2-purple','雨中的淡紫色郁金香','d2-garden-rain',['濡湿的花瓣像口红一样晶莹。下雨天，蜜蜂仍在飞。','我每次来，都看到另一排不同颜色的花。'],{carry:false,record:'flower3'});
item('d2-blue','深蓝色的郁金香','d2-garden-blue',['像泼过蓝色墨水一样，深蓝色里没有一丝杂色。','先生说，那是他和失踪学生一起种下的。'],{carry:false,record:'flower4'});
item('d2-bulbs','捡来的球根','d2-bulb',['从花店后门垃圾堆里捡来，像树种子一样小。','他按颜色与数量计算，把所有球根一个不剩地种进花坛，坑深五厘米。'],{carry:false,record:'bulbs'});
item('d2-liquid','地毯上的液滴','d2-drop',['液体不凉也不热，黏稠得难以被地毯吸收。','我觉得它像血。但那时，我还没有看到它从哪里来。'],{carry:false,record:'drop'});
item('d2-flashlight','鞋柜里的手电筒','d2-flashlight',['我从入口的鞋柜里拿出它。','开关很紧。等走进雨里，手指更滑了。']);
item('d2-grille','通气孔的铁盖','d2-vent-cover',['盖子生了锈，很重。我一松手，它就砸进土里。','箱子因此晃了几晃。我抓住通气孔，才没有掉下去。'],{carry:false,record:'grille'});

const record=(id,room,label,art,caption,group,stage)=>({id,room,label,art,caption,group,stage});
vn.DORM_RECORDS=[
 record('directory','outside','电话号码簿','d2-directory','在密密麻麻的宿舍广告里，找到很小的一行。'),
 record('pledge','manager','入住保证书','d2-pledge','签名已经落下。“幸福”仍像一个陌生的词。'),
 record('patchwork','outside','拼布','d2-patchwork','表弟搬走之后，我又开始缝布。'),
 record('newspapers','outside','旧报纸','d2-newspapers','地方版里没有找到我在找的那个人。'),
 record('stain1','manager','入住时','d2-stain-small','直径约十五厘米。','stain',1),
 record('stain2','manager','草莓蛋糕那天','d2-stain-medium','又大了一圈，蜜蜂停在正中。','stain',2),
 record('stain3','manager','雨天','d2-stain-rain','圆形更大、更深；我没来得及问出口。','stain',3),
 record('stain4','manager','滴落的傍晚','d2-stain-large','形状、面积与体积都变了，中心正在滴液。','stain',4),
 record('flower1','garden','入住时','d2-garden','胭脂红。','flower',1),
 record('flower2','garden','再次来访','d2-veranda','橘黄色。','flower',2),
 record('flower3','garden','雨天','d2-garden-rain','淡紫色。','flower',3),
 record('flower4','garden','最后的傍晚','d2-garden-blue','没有杂色的深蓝。','flower',4),
 record('cake','manager','草莓蛋糕','d2-cake','临时有事。那天没见到表弟。'),
 record('pie','manager','苹果派','d2-applepie','电车事故。第二次仍没见到他。'),
 record('notebook','student','数学笔记本','d2-notebook','削尖的H铅笔，答案下的两条线。'),
 record('calendar','student','二月日历','d2-calendar','十三日失踪，十四日出发去滑雪。'),
 record('ticket','student','巴士票','d2-ticket','旅行的准备还留在屋里。'),
 record('pudding','manager','奶油布丁','d2-pudding','表弟去了高原集训。'),
 record('bedside','manager','物品的位置','d2-medicine','电话、纸巾、茶具都移到了床边。'),
 record('bulbs','garden','球根','d2-bulb','一起种花的记忆。'),
 record('drop','manager','液滴','d2-drop','我当时以为是血。'),
 record('cousin-door','cousin','锁着的房门','d2-upperhall-night','门没能打开。我没有看到房间里有什么。'),
 record('cousin-room','cousin','入住时的房间','d2-cousin-room','我和表弟最初一起看过这里。那时候，他还没有搬进来。'),
 record('grille','garden','通气孔','d2-vent-cover','铁盖移开，手电筒终于照进里面。'),
 record('hive','garden','蜂巢','d2-hive','流出来的是蜂蜜；人的去向并未因此明朗。')
];

// The bridge takes place outside the book, after the first story's reading notes.
add('d2-bridge','两篇之间','reading-room',[],[
 a('我把写下来的纸折成两半，夹回第一篇末尾。纸角露在书外，像一小截还没有说完的话。'),
 me('先到这里吧。'),a('我起身去倒茶。走过茶几的时候，腿碰到桌角，杯里的水轻轻晃了一圈。我停住，等那一圈水纹平下来。'),
 a('这一次，没有酸甜的气味从厨房里飘来。家里安安静静。窗外的球声已经停了。'),
 choice('书还摊在桌上。我不太愿意背对着它。',[
  opt('把书合起来',[a('我把两边封面拢在一起。夹着手记的地方稍稍鼓起，书没有合严。'),me('一本书而已。')]),
  opt('去看一眼目录',[a('第一篇后面的题目是《学生宿舍》。我沿着那几个字看过去，试着想起自己住过的那些房间。')])
 ]),
 a('水壶响了。我回身关火，才发现手里仍握着那把茶匙。它当然没有果酱，勺背上却映着一小块深得发黑的窗。'),
 a('我把茶匙放进水池。金属碰到陶瓷的那一下，屋里忽然响起电话铃。'),
 me('谁会这个时候打电话？'),a('手机还扣在茶几上，屏幕没有亮。铃声来自书旁。可是那里只有杯子、一张纸和那本小说。'),
 choice('铃声停了一次，又重新响起来。',[
  opt('拿起手机确认',[a('没有未接来电。我甚至打开了通话记录，最后一通还是昨天。铃声却没有因此停下。')]),
  opt('走回茶几旁',[a('每走近一步，铃声就清楚一点。它带着旧式电话振铃的金属颤音，和手机的声音完全不同。')])
 ]),
 a('书不知什么时候重新摊开了。露出的正是下一篇。纸页没有发光，也没有翻动，只是那行字像刚刚有人写下。'),
 a('“在一个冷风飕飕的初春的下午，表弟出乎意料地给我打来了电话。”'),
 me('我没有表弟。至少，不是这个表弟。'),
 a('我记得第一篇是怎样结束的。门后的孩子，我到最后也没有看见。如今隔着一张纸的地方，又有人在等我接电话。'),
 a('铃声第三次停下时，我才听见另一个声音。像一滴水，碰到了很深的地方。没有回声，却使我的耳朵隐隐发痛。'),
 choice('我把手停在书页上方。',[
  opt('“这一次，先听清楚对方说什么。”',[me('我不想再把自己的猜测当成别人已经发生过的事。')],{set:{d2Intent:'listen'}}),
  opt('“如果还能回来，我就接。”',[a('这个条件没有任何人答应。但我还是这样对自己说了。')],{set:{d2Intent:'return'}})
 ]),
 a('我想起自己曾经等过一通很重要的电话。那时只要铃一响，整个人就会比念头先站起来。'),
 a('手指落到纸面的时候，电话又响了。掌心下面的东西变得坚硬、冰凉，我握住了一个有重量的听筒。'),
 n('','桌上的阳光暗下去。手记、茶杯和书脊退到了同一个很远的地方。最后一声铃，贴着我的耳朵响了起来。',{fx:'book',exitTarget:'d2-sound'})
],{autoNext:true,bridge:true});

function visual(i){
 if(i<=8)return {bg:'d2-exterior',cast:[],ambience:'hum'};
 if(i<=78)return {bg:'d2-home-day',cast:[],ambience:i<47?'phone':''};
 if(i<=86)return {bg:i>=84?'d2-home-storm':'d2-home-day',cast:[],ambience:i>=84?'storm':''};
 if(i<=108)return {bg:i>=96&&i<=103?'d2-country-memory':i===105?'d2-bicycle-shop':'d2-home-day',cast:i>=96&&i<=103?[]:['d2-cousin-bust']};
 if(i<=154)return {bg:i>=140?'d2-neighborhood':'d2-station',cast:['d2-cousin-bust']};
 if(i<=159)return {bg:'d2-exterior',cast:['d2-cousin-bust']};
 if(i<=161)return {bg:'d2-entry',cast:['d2-cousin-bust']};
 if(i===162)return {bg:'d2-dining',cast:[]};
 if(i<=174)return {bg:'d2-manager-room',cast:['d2-cousin-bust','d2-manager-bust']};
 if(i<=181)return {bg:'d2-tea-closeup',cast:[]};
 if(i<=184)return {bg:'d2-manager-room',cast:['d2-cousin-bust','d2-manager-bust']};
 if(i===185)return {bg:'d2-cousin-room',cast:['d2-cousin-bust','d2-manager-bust'],record:'cousin-room'};
 if(i<=189)return {bg:'d2-entry',cast:['d2-cousin-bust','d2-manager-bust']};
 if(i<=201)return {bg:'d2-home-day',cast:['d2-cousin-bust']};
 if(i<=205)return {bg:'d2-home-night',cast:[]};
 if(i===206)return {bg:'d2-exterior',cast:[],ambience:'petals'};
 if(i<=228)return {bg:'d2-veranda',cast:['d2-manager-bust'],ambience:'bees'};
 if(i===229)return {bg:'d2-manager-room',cast:['d2-manager-bust'],ambience:'bees'};
 if(i<=234)return {bg:'d2-veranda',cast:['d2-manager-bust'],ambience:'bees'};
 if(i<=294)return {bg:'d2-garden',cast:['d2-manager-bust'],ambience:'bees'};
 if(i<=307)return {bg:'d2-student-room',cast:['d2-manager-bust']};
 if(i<=319)return {bg:i>=311?'d2-hand-cg':'d2-student-room',cast:i>=311?['d2-math-student-bust']:['d2-manager-bust']};
 if(i<=322)return {bg:'d2-student-room',cast:['d2-manager-bust']};
 if(i<=333)return {bg:'d2-library',cast:i>=329?['d2-librarian-bust']:[]};
 if(i<=344)return {bg:'d2-home-day',cast:[]};
 if(i<=374)return {bg:'d2-manager-bed',cast:['d2-manager-sick-bust'],ambience:'rain'};
 if(i<=379)return {bg:'d2-garden-rain',cast:[],ambience:'rain-bees'};
 if(i<=398)return {bg:'d2-manager-bed',cast:['d2-manager-sick-bust'],ambience:'rain-bees'};
 if(i<=412)return {bg:'d2-home-night',cast:[],ambience:i>=411?'hum':''};
 if(i<=427)return {bg:'d2-manager-bed',cast:['d2-manager-sick-bust'],ambience:'rain'};
 if(i<=430)return {bg:'d2-garden-blue',cast:[],ambience:'rain-bees'};
 if(i<=437)return {bg:'d2-manager-bed',cast:['d2-manager-sick-bust'],ambience:'rain'};
 if(i<=441)return {bg:'d2-bulbs-cg',cast:[]};
 if(i<=444)return {bg:'d2-manager-bed',cast:['d2-manager-sick-bust'],ambience:'rain-hum'};
 if(i<=448)return {bg:'d2-manager-bed',cast:['d2-manager-asleep-bust'],ambience:'rain-hum'};
 if(i<=477)return {bg:'d2-manager-bed',cast:['d2-manager-asleep-bust'],ambience:'honey-hum'};
 if(i<=479)return {bg:'d2-manager-bed',cast:['d2-manager-asleep-bust'],ambience:'hum'};
 if(i<=483)return {bg:'d2-upperhall-night',cast:[],ambience:'hum'};
 if(i===484)return {bg:'d2-student-room-night',cast:[],ambience:'hum'};
 if(i<=486)return {bg:'d2-entry',cast:[],ambience:'hum'};
 if(i<=488)return {bg:'d2-yard-night',cast:[],ambience:'rain-hum'};
 if(i===489)return {bg:'d2-vent',cast:[],ambience:'rain-hum',fx:'torch'};
 return {bg:'d2-hive',cast:[],ambience:'honey-hum',fx:i===490?'reveal':undefined};
}
const defs=[
 ['d2-sound','那声音',0,8,0],['d2-call','初春的来电',9,46,0],['d2-directory','正在运转',47,78,0],['d2-wait','暴风雨',79,86,0],
 ['d2-cousin','五天',87,108,0],['d2-journey','去宿舍的路',109,154,0],['d2-arrival','入住',155,189,1],['d2-leave','搬走以后',190,205,1],
 ['d2-visit1','草莓蛋糕',206,234,2],['d2-visit2','苹果派',235,294,3],['d2-empty-room','二月十三日',295,322,3],['d2-library','旧报纸',323,333,3],
 ['d2-letter','第一封信',334,344,3],['d2-illness','雨中的探访',345,398,4],['d2-second-letter','第二封信',399,412,4],['d2-care','每天的点心',413,427,5],
 ['d2-tulips','深蓝色',428,444,5],['d2-drops','滴落的东西',445,479,5],['d2-search','锁着的房门',480,486,5],['d2-hive','通气孔',487,494,5]
];
for(const[id,chapter,start,end,visit]of defs){const nodes=source.records.filter(r=>r.ids[0]>=start&&r.ids[0]<=end).map(r=>({...n(r.s,r.t,{spoken:r.spoken,sourceIds:r.ids}),...visual(r.ids[0])}));add(id,chapter,visual(start).bg,[],nodes,{visit,room:start>=295&&start<=322?'student':start>=345&&start<=398||start>=413&&start<=479?'manager':start>=487?'garden':start>=155&&start<=189?'entry':null});}
const containing=id=>scenes.find(s=>s.story==='学生宿舍'&&s.nodes.some(n=>n.sourceIds?.includes(id)));
function insert(id,nodes,where='after'){
 const s=containing(id);if(!s)throw Error('Missing original paragraph '+id);
 const at=s.nodes.findIndex(n=>n.sourceIds?.includes(id)),base=visual(id);
 s.nodes.splice(at+(where==='after'?1:0),0,...nodes.map(q=>({...base,...q})));
}
insert(47,[look('电话号码还印在那一页。我得先找到它。',['d2-directory']),say('找到了。先拨过去问问。')]);
insert(78,[choice('听筒放回去，我仍把那几个数字抄了下来。',[
 opt('给表弟留个肯定的答复',[a('我说有空房，也说要带好材料。那句“特殊的变化”，被我暂且放在了一边。')],{set:{d2Promise:true}}),
 opt('把自己的犹豫也告诉他',[say('宿舍还在，不过现在住的人很少。等你来了，我们一起去看看。'),a('电话那头，他很快答应了。我听见纸张展开的声音，像是正在记地址。')],{set:{d2Caution:1}})
])]);
insert(103,[choice('他说完，手指还停在眼镜框上。',[
 opt('“你居然记得那么清楚。”',[cousin('别的事情记不住，颜色却一直没忘。'),say('我倒先想起奶奶择豆角的声音。'),a('我们各自记着同一个下午的不同部分。')]),
 opt('把话题转到要买的东西',[say('等会儿把需要的东西写下来吧。'),cousin('自行车最要紧。旧一点也没关系。')])
])]);
insert(105,[look('购物单被折了好几次。我们把它摊在店门口，再算一遍。',['d2-list'],{bg:'d2-bicycle-shop',cast:[]}),choice('店主把那辆二手车推过来，轮子空转了两圈。',[
 opt('请表弟试一试刹车',[n('店主','前后的刹车我都调过了。你骑一圈再决定。',{cast:['d2-shopkeeper-bust','d2-cousin-bust']}),cousin('可以。我去前面的路口转回来。'),a('我站在门边，看着他很轻地跨上车。')]),
 opt('先问还能不能便宜一点',[n('店主','价钱已经不高。这样，给你把车铃也换个好的。',{cast:['d2-shopkeeper-bust','d2-cousin-bust']}),cousin('这个就够用了。'),a('他按响车铃，声音短短的，没等散开就被街声盖住了。')])
],{bg:'d2-bicycle-shop'})]);
insert(154,[a('走到这里，我才发现，自己一直在替一个曾经住过的地方作保证。'),choice('表弟夹紧纸袋，等着我迈步。',[
 opt('把没有把握的话暂且收住',[a('“先进去看看。”我这样说。表弟点了点头。')]),
 opt('再确认一遍他的意思',[say('如果看过不喜欢，我们还可以再找。'),cousin('我知道。表姐，你别那么担心。')])
])]);
insert(162,[choice('食堂空着。我的脚步却仍不由自主地放轻了。',[
 opt('朝从前的餐桌看一眼',[a('桌面没有水汽，厨房也没有声音。我记得这里从前到开饭的时候，总有人走来走去。')]),
 opt('跟上表弟',[a('他已经停在先生门前。我离开食堂，走到他身旁。')])
])]);
insert(171,[look('表弟把笔放下。我又看了一遍保证书。',['d2-pledge'],{bg:'d2-manager-room'}),n('','只有天花板上的那个圆，不在他伸得到的地方。',{bg:'d2-silence-ceiling',cast:[]}),look('我抬头，视线越过那些摆得很低的东西。',['d2-stain1'],{bg:'d2-manager-room'}),look('从窗边向外看，花坛里是胭脂红的一排。',['d2-red'],{bg:'d2-garden'})]);
insert(184,[choice('茶还热着。表弟用两只手托着杯子。',[
 opt('“这里住起来一定很方便吧。”',[manager('熟悉了就好。东西摆在哪里，身体会记得。'),a('我往杯子旁边看去。每一件东西，都像有一个不该随便挪动的位置。')]),
 opt('安静地把茶喝完',[a('杯底落回桌面时，我尽量没让它发出声音。表弟也已经喝完，手仍围着杯子。')])
]),n('','我们跟着先生走上楼。走廊里的暖气管沿着墙根，一直延伸到房门前。',{bg:'d2-upperhall-day',cast:['d2-cousin-bust','d2-manager-bust']})]);
insert(201,[choice('门关上以后，屋里只剩下我。',[
 opt('把给他的那套餐具收起来',[a('第二只碗洗得很快。我把它放回架上，才发现这几天一直在按两个人的分量煮饭。')]),
 opt('去看没做完的拼布',[a('布还卷在原处。五天过去，没有一针移动过。我把它慢慢铺开。')])
]),look('针线盒里的紫色与黄色，和表弟来之前一样。',['d2-sewing'],{bg:'d2-home-night'})]);
insert(207,[look('我把给表弟的蛋糕盒打开了。',['d2-cake'],{bg:'d2-veranda'})]);
insert(210,[look('这回开放的，是橘黄色的一排。',['d2-orange'],{bg:'d2-veranda'})]);
insert(229,[look('那只蜜蜂停在痕迹的正中间。',['d2-stain2'],{bg:'d2-manager-room',ambience:'bees'})]);
insert(234,[choice('天色已经晚了，我还站在门口。',[
 opt('“请告诉他，我来过。”',[manager('好。点心我也会告诉他的。'),a('我没有问他什么时候一定会回来。')]),
 opt('再向楼上看一眼',[a('窗帘没有动。我等了一会儿，才把手从门框上放下来。')])
])]);
insert(241,[look('苹果派的纸盒被我抱得有些变形。',['d2-pie'],{bg:'d2-garden'})]);
insert(280,[choice('先生的话停在那个不见了的记事本上。',[
 opt('“您一定被问得很难受吧。”',[manager('有些事，说得越仔细，反而越不知道自己有没有说清。'),a('我不能凭这句话替他洗去怀疑，也不能因此加重它。先生还在咳嗽。')]),
 opt('“您后来还找过他吗？”',[manager('我能去的地方，都看过了。他的房间也还留着。'),a('他说得很慢，像每一个地方都要重新想一遍。')])
])]);
insert(298,[look('我不敢挪动他的东西，只把目光放近一些。',['d2-notebook','d2-calendar','d2-ticket'],{bg:'d2-student-room'})]);
insert(304,[choice('我们仍旧站在房间中央。',[
 opt('问日历上的滑雪箭头',[say('这里的十四日，是准备出发的日子吗？'),manager('是。东西都已经收拾好了。')]),
 opt('看向桌上的H铅笔',[a('铅笔削得很尖。我没有拿起来，只看着那一点细细的石墨。')])
])]);
insert(315,[n('数学系学生','首先这样去思考的话，问题就简单了。',{bg:'d2-hand-cg',cast:['d2-math-student-bust']}),a('那句话在先生的回忆里，像一张仍然朝人转过来的脸。')]);
insert(324,[look('我把二月十四日以后的报纸，搬到桌边。',['d2-newspapers'],{bg:'d2-library'}),choice('地方版的短消息太多了。',[
 opt('从失踪次日往后翻',[a('我把日期排好，翻过一张，再翻过一张。没有标题能让我停下来。')],{set:{d2Search:'date'}}),
 opt('先找大学生失踪的消息',[a('我追着那些像是有关联的字眼找。读到后面，才发现自己又看了别人的事故。')],{set:{d2Search:'person'}})
])]);
insert(341,[look('丈夫把出发前要做的事，逐条写在信的末尾。',['d2-letter1'],{bg:'d2-home-day'})]);
insert(344,[choice('抽屉合上了，信纸却像还在眼前。',[
 opt('拿出信，试着写一个开头',[a('我写了“信收到了”。再往后，却不知道先说宿舍，还是先说自己还没有去换护照。'),a('纸被我重新折起来。')]),
 opt('先把桌上的针线收一收',[a('我把细小的针插回针垫，数了一遍。别的事做不起来，这件事却可以立刻做完。')])
])]);
insert(346,[look('我把布丁放到床边，先看了看先生。',['d2-pudding'],{bg:'d2-manager-bed'})]);
insert(374,[choice('我没有办法替先生回答自己的问题。',[
 opt('再提一次陪他去医院',[say('如果您改变主意，我会陪您。哪一天都可以。'),manager('谢谢。你先坐一会儿吧。'),a('他没有答应，也没有发脾气。我只好把椅子往床边挪了一点。')],{set:{d2Care:1}}),
 opt('先把窗缝关小一点',[a('雨水沿着窗玻璃往下流。我留下一道通气的缝，回到椅子上。')],{set:{d2Care:1}})
])]);
insert(378,[look('雨里的花和蜜蜂，都清楚得出奇。',['d2-purple'],{bg:'d2-garden-rain',ambience:'rain-bees'})]);
insert(380,[look('我又抬起头，看那个比以前更大的圆。',['d2-stain3'],{bg:'d2-manager-bed',ambience:'rain-bees'})]);
insert(387,[look('先生够得到的东西，都向床边聚了过来。',['d2-medicine'],{bg:'d2-manager-bed'}),choice('水杯已经倒好。我把药袋折出一个小小的口。',[
 opt('“这样可以吗？”',[manager('可以。慢一点就好。'),a('我等他把头稍稍抬起来，才将袋口靠近。')]),
 opt('先让他缓一缓呼吸',[a('我握着药袋，没有催促。等他的呼吸平稳一些，才往前坐近。')])
])]);
insert(406,[look('第二封信又列了五件事。',['d2-letter2'],{bg:'d2-home-night'})]);
insert(412,[choice('十件事没有排好先后。布已经铺满了桌子。',[
 opt('把两封信放在一起',[a('两张清单从一数到十，顺序很明白。不能向前走的，好像只有我。')]),
 opt('再接上一块布',[a('我把蓝色格子与黑白圆点对齐，沿着缝口下针。蜂声不知从哪里穿过来。')])
])]);
insert(427,[a('点心盒轻轻地空了。我把手指上的奶油擦掉，仍留着一点洗不掉似的油亮。')]);
insert(428,[look('雨中的花，已经变成了没有杂色的深蓝。',['d2-blue'],{bg:'d2-garden-blue',ambience:'rain-bees'})]);
insert(436,[look('先生记得那些球根，也记得它们一个都没剩下。',['d2-bulbs'],{bg:'d2-bulbs-cg'})]);
insert(448,[choice('我坐在黑暗里，试着分清雨声和蜂声。',[
 opt('侧耳听屋里',[a('雨声像沉在下面。那条细而均匀的振动，正横在我的耳朵深处。')],{set:{d2Heard:true}}),
 opt('望向窗外',[a('花坛看不见了。只有玻璃上的雨痕，偶尔接住一点室内的光。')])
])]);
insert(449,[look('我抬起头。那个圆，已经变得认不出来了。',['d2-stain4'],{bg:'d2-manager-bed',ambience:'honey-hum'})]);
insert(456,[look('我摊开手掌，脚边还有浮在地毯上的液体。',['d2-liquid'],{bg:'d2-manager-bed',ambience:'honey-hum'})]);
insert(483,[n('我','表弟，你在里面吗？',{spoken:true,bg:'d2-upperhall-night',record:'cousin-door'}),a('我把耳朵贴近门。没有回答。门里面的情形，我什么都看不见。')]);
insert(484,[choice('那件毛衣仍旧搭在椅背上。',[
 opt('再看一眼床底',[a('我弯下身，等视线适应下面的黑暗。没有人。')]),
 opt('推开衣柜的门',[a('门很轻地开了。里面也没有表弟。')])
])]);
insert(486,[look('鞋柜里有一支手电筒。我把它拿出来。',['d2-flashlight'],{bg:'d2-entry'})]);
insert(488,[choice('空啤酒箱在脚下轻轻地晃。',[
 opt('贴住墙，抓牢通气孔边缘',[a('我等箱子不再晃动，才试着松动铁盖。')]),
 opt('踩到箱沿上，直接往里面探身',[],{ending:'d2fall'})
])]);
insert(489,[look('铁盖已经落到土里。黑洞洞的通气孔露了出来。',['d2-grille'],{bg:'d2-vent',ambience:'rain-hum'})]);
const hiveScene=scenes.find(s=>s.id==='d2-hive');
// The supplied scan says “手掌” here, although the character has no arms.
// Keep the coughing/trembling action, without adding a limb that he does not have.
const trembling=scenes.flatMap(s=>s.nodes).find(n=>n.sourceIds?.includes(284));
trembling.t=trembling.t.replace('他的手掌都在剧烈地颤抖','他的身体都在剧烈地颤抖');
hiveScene.nodes.push(n('','手指还停在够不到蜂蜜的地方。那声音没有回答我。眼前的光圈却开始缩小，像有人从很远的地方，慢慢松开了握着手电筒的手。',{bg:'d2-hive',ambience:'honey-hum',fx:'book',record:'hive'}));
hiveScene.autoNext=true;
add('d2-return','书外的傍晚','reading-room',[],[
 a('手里没有手电筒。我的手指碰到了书页的边。'),a('客厅比刚才暗了。窗上只剩一块淡淡的天色，茶杯没有动，夹在第一篇里的纸角也还露着。'),
 me('是蜂蜜。'),a('我低声说了一遍，又把书翻回最后几行。那几行没有说表弟站在哪里，也没有说失踪的学生后来去了哪里。'),
 choice('书页上已经没有可以往下追的地方。',[
 opt('回想一次次没见到的表弟',[me('临时有事、电车事故、手球集训。每一次都有解释。我却一次也没能把东西亲手交给他。'),me('不能证明的事情，和让我不安的事情，原来可以同时存在。')]),
 opt('回想那两封没有回完的信',[me('瑞典的事那么具体。我却和她一样，越看越觉得遥远。'),me('她在等待离开，也一次次走回同一个地方。我不确定，她究竟更害怕哪一种生活。')]),
 opt('回想先生记得的那些身体',[me('他记得手、肩胛骨、脚趾，记得能完成一件小事的动作。'),me('这些凝视里有向往，也有让我不舒服的部分。我没法只用同情，或者只用怀疑，把它们解释完。')])
 ]),
 a('我把手掌翻过来。掌纹里没有黏稠的东西。可那种接不住、拽不回来的感觉，仍停在指尖。'),
 me('看清流下来的是什么，并不等于找到了所有人。'),
 a('窗外，天已经快黑了。我没有再去辨认那些很细的声音，只把书轻轻放平。'),
 n('我','这一篇，我想把看见的和猜到的分开记下。',{finish:'dormitory'})
],{room:null});
add('d2-afterword','书签','reading-room',[],[
 a('我在第二篇末尾又夹下一张纸。书脊比刚才厚了一点，合起来时发出轻轻的一声。'),
 me('今天先放在这里。'),
 a('窗上的最后一点天光退去了。我把台灯打开，桌上的杯子、纸和书，又各自有了清楚的影子。'),
 me('有些地方，走出来以后，仍会在耳朵里留很久。'),
 n('','我把书放到手边。下次再打开时，会从夹着纸的地方认出自己曾经来过。',{finish:'session'})
],{room:null});
scenes.find(s=>s.id==='d2-return').nextStory='d2-afterword';
vn.ENDINGS.d2fall={title:'箱子倒下以后',text:'你的重心越过箱沿。湿滑的塑料箱猛地一歪，手指没能抓住通气孔。手电筒的光在墙上划过，又熄在雨里。那一夜，你没能看清里面有什么。',bg:'d2-yard-night'};
for(const s of scenes.filter(s=>s.story==='学生宿舍'))for(const node of s.nodes)for(const o of node.choices||[])for(const reply of o.reply||[]){reply.bg??=node.bg||s.bg;reply.cast??=node.cast||s.cast;reply.ambience??=node.ambience||s.ambience;}
scenes.find(s=>s.id==='aug11').autoNext=true;
scenes.find(s=>s.id==='return').nextStory='d2-bridge';
})();
