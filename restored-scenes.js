(() => {
const {scenes,ITEMS}=VN,source=window.STORY;
const scene=id=>scenes.find(s=>s.id===id);
const note=(t,more={})=>({s:'',t,...more});
function original(day,ids,more={}){return ids.map(i=>{const t=source[day].original[i];if(!t)throw Error('Missing original '+day+'/'+i);const speaker=day===4&&[14,20,24,26,28].includes(i)?'姐姐':day===6&&[8,10].includes(i)?'姐姐':day===7&&i===11?'姐夫':'';return {...note(t,more),s:speaker,t:speaker?t.replace(/^[“\x22]|[”\x22]$/g,''):t};});}
function locate(id,needle){const s=scene(id),i=s.nodes.findIndex(n=>n.t.includes(needle));if(i<0)throw Error('Missing insertion '+id+':'+needle);return[s,i];}
function before(id,needle,nodes){const[s,i]=locate(id,needle);s.nodes.splice(i,0,...nodes);}
function after(id,needle,nodes){const[s,i]=locate(id,needle);s.nodes.splice(i+1,0,...nodes);}
function replace(id,needle,nodes){const[s,i]=locate(id,needle);s.nodes.splice(i,1,...nodes);}
const hospital={bg:'hospital',cast:[]},clinic={bg:'examination-room',cast:[]},dental={bg:'dental-clinic',cast:['husband-bust']};
before('dec29','姐姐最后还是决定',original(0,[8]));
replace('dec29','那是一栋古老',original(0,[13,14],hospital));
replace('dec29','小时候，我们踩着',original(0,[15,16,17,18,19,20],hospital));
before('dec29','楼上的女人',original(0,[21,22,23,24,25],clinic));
replace('dec29','楼上的女人',original(0,[26,27,28,29,30,31,32],hospital));
after('dec29','医院真的不换',[
 {s:'姐夫',t:'那家医院离家近，走着也能去，我觉得还不错。',cast:['husband-bust','sister-bust']},
 note('只要我不坚持，家里就不会有人跟姐姐唱反调。姐夫的表态，总是谁也不得罪。')
]);
const search=scene('dec29').nodes.find(n=>n.explore);
const beforeSearch=scene('dec29').nodes[scene('dec29').nodes.indexOf(search)-1];
beforeSearch.t='图表本来应该放在卧室里。可我记得在报刊架、电话桌上，也见过那些锯齿一样的线。';
search.t='姐姐在催了。我先去卧室，再把客厅和电话桌也找一遍。';
search.explore.views=[
 {label:'卧室',bg:'bedroom',items:[{id:'chart1',x:67,y:56,w:14}]},
 {label:'报刊架',bg:'magazine-corner',items:[{id:'chart2',x:33,y:56,w:14}]},
 {label:'电话桌',bg:'telephone-table',items:[{id:'chart3',x:43,y:52,w:14}]}
];
search.explore.missing='还有图表没找到。卧室、报刊架、电话桌，都得看一遍。';
ITEMS.chart1.pages=['卧室的床头柜上压着几张图表。我把抽屉里的也取出来，一共八张。','每天清晨记录的数字，连成一排参差的尖齿。我按照月份，把纸张叠好。'];
ITEMS.chart2.pages=['报刊架里还有八张，夹在旧报纸和广告中间。一张角上沾着咖啡渍。','以前看报时瞥见这些图表，我还在心里想过：“啊，原来这天是姐姐的排卵日啊。”'];
ITEMS.chart3.pages=['最后八张在电话桌上。合起来，正好是两年的二十四张。','有时打着电话，我会无意间看到它们，想着“这个月的低温期真长”。现在想想，真是不可思议。'];
ITEMS.dictionary={name:'词典',art:'clue-dictionary',inscription:'恭喜（感）\n表示祝贺时的寒暄语。',pages:['“恭喜（感）表示祝贺时的寒暄语。”','我用指尖点着这行汉字，怎么也看不出有什么喜庆的色彩。']};
after('dec29','真的值得恭喜吗',[
 {s:'我',t:'我从书架上取下词典，翻到“恭喜”那一页。',explore:{items:[{id:'dictionary',x:61,y:58,w:22}],required:['dictionary'],missing:'词典还摊在桌上。'},bg:'reading-room',cast:[]},
 {s:'我',t:'看来这个词本身，什么意思都没有。',thought:true,bg:'reading-room',cast:[]},
 ...original(0,[48],{bg:'reading-room',cast:[]})
]);
after('dec30','昨天不是梦',original(1,[0]));
after('dec30','牙科技师，却爱喝',[
 note('早餐桌上因此总有一股糕点屋的香味。我常想，他就不怕得虫牙吗？')
]);
before('dec30','没有人提昨天的检查',original(1,[12,14]));
after('jan03','我站在玄关',original(2,[1]));
before('jan08','中午，我与姐姐',original(3,[1]));
before('jan08','她把勺子放回盘里',original(3,[11]));
before('jan08','姐姐把想说的话',original(3,[17]));
after('jan13','这就是我的胎儿',[
 {s:'姐姐',t:'也就是说，妊娠反应的根儿在这儿呢。'},
 ...original(4,[7])
]);
replace('jan13','他是个五十多岁',original(4,[14]));
before('jan13','护士把透明软膏',original(4,[20]));
replace('jan13','护士把透明软膏',original(4,[24,26,28]));
after('jan13','地板上躺着',original(4,[37,38]));
before('jan28','妊娠反应没有减轻',original(5,[1,2]));
before('jan28','这本杂志说',original(5,[5]));
after('jan28','他们每天早早进卧室',original(5,[9]));
before('feb06','早晨，我用平底锅',original(6,[0]));
after('feb06','她趴在餐桌上，真的哭了',original(6,[3,7]));
before('feb06','不光是腊肉鸡蛋',original(6,[8,10]));
before('feb06','我并不是不想吃东西',original(6,[18]));
before('feb06','我甚至画过',[
 {s:'姐姐',t:'我想象过：餐桌中间放着玫瑰花，烛光映在葡萄酒杯上，汤和肉菜冒着热气。当然，那里没有任何气味。'}
]);
before('feb10','姐姐在床上摆出',original(7,[0]));
replace('feb10','我只见过二阶堂',original(7,[4]));
after('feb10','有心理测试、催眠',original(7,[5]));
before('feb10','夜里，出租车',original(7,[9,10,11]));
replace('mar01','一对对竖着排列',original(8,[3]));
replace('mar14','肥皂换成无香型',original(9,[1]));
replace('mar14','百日红和花坛',original(9,[2,3,4]));
before('mar22','二老走后',original(10,[8,9]));
after('mar31','从冷清的后门进去',original(11,[1,2,3]));
replace('mar31','纸箱堆成台子',original(11,[4,5,6]));

before('mar31','我能尝一下吗',original(11,[9,11]));
replace('mar31','周围的货架比人还高',original(11,[16,17]));
before('apr16','送走姐夫后',original(12,[4,5,6]));
before('apr16','最下面一层还有个小袋子',original(12,[19,20,21]));
before('may01','一个下雨的晚上',original(13,[1,2]));
after('may01','家里还有冰激凌',[
 {s:'姐夫',t:'吃点巧克力怎么样？'},
 {s:'姐夫',t:'你把二阶堂先生给你的药吃了，今天还是先睡觉吧。'},
 ...original(13,[19])
]);
before('may16','我想起第一次见到',original(14,[2]));
after('may16','女大夫问了我',original(14,[7],dental));
before('may16','粉红色的粉末',original(14,[12,13],dental));
before('may16','他捏起那块粉红色',original(14,[15,16],dental));
before('may28','“胎儿”“腹腔”',original(15,[1]));
before('may28','钥匙插进门锁',original(15,[9,10,11,13]));
after('may28','她像没听见',original(15,[24,25]));
before('jun15','我每次这样想',original(16,[3]));
before('jun15','还有吗',original(16,[5,6]));
before('jun15','果篮里、冰箱上',original(16,[10]));
before('jul02','姐姐从医院回来时',original(17,[0,1]));
before('jul02','大夫说会难产',original(17,[8,9]));
before('jul02','她一个个说着',original(17,[21]));
after('jul22','最终浮上来的',original(18,[2]));
replace('aug08','等着一件不知何时',original(19,[2]));
replace('aug11','我侧着身子',original(20,[6],hospital));
replace('aug11','不用搬纸箱',original(20,[7],hospital));
replace('aug11','三楼有个穿睡衣',original(20,[8],hospital));
replace('aug11','婴儿一直哭个不停。抓着',original(20,[9],{bg:'corridor',cast:[]}));
const spokenStarts=[
 '你……刚才说','……还是有多少','你不是每天','基础体温表不就是','先理好。','医院真的','没什么。你记得','情况怎么样','哇，能知道','鱼蟹羹。','昨晚回来','那我下次','至少应该','请进','我来收','什么味','要不要换','你先休息','这种照片是怎么','这东西也','和以前相比','那检查的时候','为什么？','我以为你会','自己的身体','是姐夫吗','那粥呢','你又没有','只是普通','我不做了','我闻不出','我换掉','这又不是','又要去','她去过那么','你就从来','今天怎么样','为什么是狗','动物也','铃铛给我','你见过生小狗','是不是像豌豆','今天发泡','可以，请吧','请吧，请品尝','喜欢的话','吃羊角','好。你等','再等一下','放了很久','还想吃','真的有这种','先别开车','是果肉','你让我们','你还记得','没什么。只是','你怎么知道','没有枇杷','你知道进口','只是看到','这一锅','你那么','以后能','我明天','这是美国产','他说你胖','大夫说会','……很难想象','你是怕见','软软的','做好了','慢一点','真想看','姐姐？'
];
for(const sc of scenes)for(const node of sc.nodes){
 for(const candidate of [node,...(node.choices||[]).flatMap(o=>o.reply||[])]){
  if(candidate.s==='我')candidate.spoken=!candidate.explore&&!candidate.choices&&!candidate.thought&&spokenStarts.some(t=>candidate.t.startsWith(t));
 }
}
})();
