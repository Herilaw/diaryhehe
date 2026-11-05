/* Rebuild the diary from every supplied paragraph; retain the authored actions. */
(() => {
'use strict';
const vn=window.VN,days=window.STORY,diaries=vn.scenes.filter(s=>s.date),legacy={},legacyBranches={};
function split(t,max){const a=[];while(t.length>max){let k=0;for(let i=max-1;i>=Math.floor(max*.48);i--)if(/[。！？；，、]/.test(t[i])){k=i+1;break;}k||=max;a.push(t.slice(0,k));t=t.slice(k);}if(t)a.push(t);return a.length?a:[''];}
for(const s of diaries){legacy[s.id]=s.nodes.flatMap((n,raw)=>split(n.t||'',n.spoken?44:76).map((t,page,parts)=>({t,raw,event:!!(n.choices||n.explore)&&page===parts.length-1})));}
vn.LEGACY_PAGES=legacy;for(const scene of diaries)scene.nodes.forEach((n,raw)=>(n.choices||[]).forEach((o,c)=>legacyBranches[scene.id+':'+raw+':'+c]=(o.reply||[]).flatMap(n=>split(n.t||'',n.spoken?44:76))));vn.LEGACY_BRANCHES=legacyBranches;
const maps=[
 {1:'姐姐',2:'我',3:'姐姐',5:'姐姐',6:'我',7:'姐姐',9:'我',12:'姐姐',16:'我',18:'姐姐',27:'我',29:'姐姐',31:'thought',34:'姐夫',36:'我',37:'姐姐',38:'我',39:'姐姐',41:'姐姐',42:'我',43:'姐姐',44:'我',47:'thought'},
 {3:'姐夫',5:'我',7:'姐夫',10:'姐夫',13:'姐姐',17:'我',18:'姐夫'},
 {3:'姐姐'},
 {1:'姐姐',3:'姐姐',5:'姐姐',6:'我',7:'姐姐',9:'我',12:'姐姐',14:'姐姐',16:'姐姐',18:'姐姐'},
 {3:'姐姐',6:'姐姐',8:'我',9:'姐姐',10:'我',12:'我',14:'姐姐',16:'我',18:'姐姐',20:'姐姐',22:'姐姐',24:'姐姐',26:'姐姐',28:'姐姐',30:'姐姐',33:'我',34:['姐姐','我'],35:'姐姐'},
 {3:['姐姐',null],7:'姐夫'},
 {2:'姐姐',4:'我',5:'姐姐',8:'姐姐',10:'姐姐',11:'我',13:'姐姐',15:'姐姐',16:'我',19:'姐姐',21:'姐姐',22:'我',23:'姐姐',24:'我'},
 {7:'姐姐',11:'姐夫',13:'姐姐'}, {},{},
 {2:'姐姐',4:'婆婆',6:'我',7:'婆婆',11:'我',12:'姐夫',13:'我',14:'姐夫',15:'我',16:'姐夫',17:'我',18:'姐夫'},
 {7:'我',12:'老太太',14:'我',20:'老太太',21:'我',22:'老太太',24:'我'},
 {7:'我',9:'姐姐',11:'姐姐',13:'我',16:'姐姐',18:'我',20:'姐姐',22:'我'},
 {4:'姐姐',5:'姐夫',6:'姐姐',8:'姐夫',10:'我',12:'姐姐',15:'姐夫',16:'姐夫',17:'姐夫',18:'姐夫'},
 {5:'姐夫',8:'姐夫',10:'姐夫',15:'thought'},
 {2:'姐姐',14:'小册子',15:'小册子',16:'小册子',19:'姐姐',21:'姐姐',23:'我',26:'thought'},
 {7:'我',8:'我',11:'姐姐',12:'我',13:'我'},
 {3:'姐姐',5:'姐姐',7:'我',10:'我',11:'姐姐',12:'姐姐',13:'我',15:'姐姐',16:'姐姐',18:'我',20:'姐姐',22:'thought',24:'我',26:'我'},
 {},{4:'我'},{0:'留言条'}
];
function visual(d,p){
 const kitchen={bg:'kitchen',cast:[d>=12?'pregnant-bust':'sister-bust']},parlor={bg:'a4-family-parlor',cast:[d>=12?'pregnant-bust':'sister-bust']};
 if(d===0){if(p>=13&&p<=32){if(p<=20)return {bg:'hospital-backyard',cast:['a4-young-sister-bust'],memory:true,narrator:'a4-young-narrator-bust'};if(p<=25)return {bg:'examination-room',cast:[],memory:true,narrator:'a4-young-narrator-bust'};return {bg:p>=30?'hospital-window':'hospital-backyard',cast:p===29?['a4-young-sister-bust']:[],memory:true,narrator:'a4-young-narrator-bust'};}if(p>=35&&p<=44)return {bg:'home-entry',cast:['sister-bust']};if(p>=45)return {bg:'a4-family-parlor',cast:[]};if(p===34)return {...kitchen,cast:['husband-bust','sister-bust']};return kitchen;}
 if(d===1)return p<2?{bg:'bedroom',cast:[]}:{...kitchen,cast:['husband-bust','sister-bust']};
 if(d===2)return p===0?{bg:'home-entry',cast:['grandfather-bust','grandmother-bust']}:p<3?{...parlor,cast:['grandfather-bust','grandmother-bust']}:{...parlor,cast:['sister-bust']};
 if(d===3)return kitchen;
 if(d===4){if(p===14)return {bg:'examination-room',cast:['nurse-bust','nurse-bust'],memory:true};if([20,22,24,26,28,30].includes(p))return {bg:p>=24?'clinic-ultrasound':'examination-room',cast:[],memory:true};return parlor;}
 if(d===5)return p>=8?{bg:'bedroom-night',cast:['husband-bust','sister-bust']}:{...kitchen,cast:p>=6?['husband-bust','sister-bust']:['sister-bust']};
 if(d===6)return p===0?{bg:'garden',cast:[]}:kitchen;
 if(d===7){if(p<=3)return {bg:'bedroom',cast:['sister-bust']};if(p===4||p===9)return {bg:'home-entry',cast:['nikaido-bust','sister-bust'],memory:true,weather:'storm'};if(p===10||p===11)return {bg:'a4-family-moon',cast:['husband-bust']};if(p===12||p===13)return {bg:'home-entry',cast:p===13?['sister-bust']:['husband-bust']};return parlor;}
 if(d===8)return {bg:'a4-family-parlor',cast:[]};
 if(d===9)return p===0?{bg:'bedroom',cast:['sister-bust']}:p===1?{bg:'bathroom',cast:[]}:{bg:'garden-night',cast:[],ambience:'night'};
 if(d===10)return {bg:p===0?'home-entry':'a4-family-parlor',cast:p<=9?['grandmother-bust','sister-bust']:['husband-bust']};
 if(d===11)return p<=2?{bg:'supermarket-backdoor',cast:p===2?['security-bust']:[]}:{bg:'supermarket-sampling',cast:p>=11&&p<=24?['oldwoman-bust']:[]};
 if(d===12)return kitchen;
 if(d===13)return p>=3?{bg:'a4-family-rain',cast:['husband-bust','pregnant-bust'],ambience:'rain'}:kitchen;
 if(d===14)return p<2?parlor:{bg:'dental-clinic',cast:p===3||p===7?['dentist-bust']:p>=4?['husband-bust']:[],memory:true};
 if(d===15){if(p<=4)return parlor;if(p===5||p===6)return {bg:'supermarket-fruit',cast:p===6?['manager-bust']:[]};if(p>=12&&p<=17)return {bg:'university-room',cast:[],memory:true};return {bg:p<9?'a4-kitchen-night':'kitchen-jam-close',cast:p>=18?['husband-bust','pregnant-bust']:[],ambience:'boil'};}
 if(d===16)return p===13?{bg:'supermarket-fruit',cast:[],ambience:'rain'}:{bg:p>=4?'kitchen-jam-day':'kitchen',cast:['pregnant-bust'],ambience:'rain'};
 if(d===17)return p<=6?kitchen:{bg:'kitchen-jam-day',cast:['pregnant-bust'],ambience:'boil'};
 if(d===18)return {bg:'a4-family-parlor',cast:[]};
 if(d===19)return {bg:p===1?'garden':'kitchen-jam-day',cast:p===1?['husband-bust']:['pregnant-bust'],ambience:p===1?'fan':'summer'};
 if(d===20){if(p<=1)return {bg:'kitchen',cast:[]};if(p<=3)return {bg:'street-summer',cast:[],ambience:'summer'};if(p===4)return {bg:'hospital',cast:[]};if(p<=6)return {bg:'hospital-backyard',cast:[]};if(p===7)return {bg:'examination-room',cast:[]};if(p===8)return {bg:'hospital-window',cast:[]};if(p===9)return {bg:'clinic-stairs',cast:[]};return {bg:'corridor',cast:[]};}
 return kitchen;
}
function grams(t){const s=t.replace(/[\s“”"，。！？、：；（）·.,!?]/g,'');return new Set(Array.from({length:Math.max(0,s.length-1)},(_,i)=>s.slice(i,i+2)));}
function similarity(a,b){const x=grams(a),y=grams(b);let same=0;for(const g of x)if(y.has(g))same++;return same/Math.max(1,Math.min(x.size,y.size));}
const sourceCount=[];
for(let d=0;d<diaries.length;d++){
 const scene=diaries[d],old=scene.nodes,paras=days[d].original,buckets=paras.map(()=>[]),newNodes=[];
 function match(t,ratio=.5){let best=0,value=-1;for(let p=0;p<paras.length;p++){const v=similarity(t,paras[p])-.04*Math.abs(p/paras.length-ratio);if(v>value){value=v;best=p;}}return best;}
 for(let raw=0;raw<old.length;raw++){
  const q=old[raw];if(!q.explore&&!q.choices)continue;
  let anchor=match(q.t,raw/old.length),nearest=-1;
  for(let j=Math.max(0,raw-2);j<=Math.min(old.length-1,raw+1);j++){if(j===raw||old[j].explore||old[j].choices)continue;const p=match(old[j].t,j/old.length),score=similarity(old[j].t,paras[p])-.05*Math.abs(raw-j);if(score>nearest){nearest=score;anchor=p;}}
  if(d===0&&q.explore?.required?.includes('chart1'))anchor=10;
  if(d===0&&q.explore?.required?.includes('dictionary'))anchor=46;
  if(d===4&&q.explore)anchor=5;
  if(d===7&&q.choices)anchor=13;
  if(d===14&&q.choices)anchor=17;
  if(d===4&&q.choices)anchor=32;
  if(d===5&&q.explore)anchor=4;
  if(d===9&&q.explore)anchor=1;
  if(d===10&&q.explore)anchor=5;
  if(d===12&&q.explore)anchor=24;
  if(d===14&&q.explore)anchor=17;
  if(d===15&&q.explore){const ids=q.explore.items.map(p=>p.id);anchor=ids.includes('fruit')?7:ids.includes('pamphlet')?17:25;}
  if(d===17&&q.explore)anchor=6;
  if(d===20&&q.explore)anchor=0;
  if(d===20&&q.choices&&q.choices[0].text.includes('拿上'))anchor=0;
  if(d===20&&q.choices&&q.choices.some(o=>o.ending==='fall'))anchor=4;
  const copy=JSON.parse(JSON.stringify(q));copy.legacyID=raw;copy.revisionKey=scene.id+':event:'+raw;Object.assign(copy,visual(d,anchor));
  if(copy.explore)copy.cast=[];
  if(d===7&&copy.choices){copy.t='姐姐进屋以后，姐夫替她把围巾挂好。';copy.bg='home-entry';copy.cast=['husband-bust'];copy.memory=false;}
  if(d===14&&copy.choices){copy.t='那块粉红色的东西贴在最里面的牙上。我尽量不去碰它。';copy.choices[0].text='把目光移向顶灯';copy.choices[0].reply=[{s:'',t:'灯泡周围有一小圈灰。我盯着那一圈灰，数了一会儿自己的呼吸。'},{s:'姐夫',t:'再等一会儿。'},{s:'',t:'他俯下身来看。我把嘴张得更大了一点。'}];copy.choices[1].text='用舌尖试一下';copy.choices[1].reply=[{s:'',t:'舌尖碰到了一点凉意。我马上把它收回去。'}];}
  if(d===15&&copy.explore?.required?.includes('pamphlet'))copy.t='会场发下的小册子被我卷成了细筒。第一页有一张葡萄柚的照片。';
  if(d===15&&copy.choices&&copy.choices.length===3){copy.t='她的勺子又伸进锅里。我看着剩下的果酱。';copy.choices[0].text='移开视线';copy.choices[0].reply[0].t='我看了看姐姐没有摘下的耳环。她的勺子又举起来，刚刚吃过中华料理的嘴唇仍在动。';copy.choices[2].reply[0].t='我转过身打开水龙头。身后不断传来勺子碰锅的声音。';}
  if(d===20&&copy.choices&&copy.choices[0].text.includes('拿上')){copy.bg='kitchen';copy.choices[0].text='把纸条折好';copy.choices[0].reply[0].t='我沿着纸边，慢慢把它对折。';}
  if(d===20&&copy.choices&&copy.choices.some(o=>o.ending==='fall'))copy.bg='hospital';
  if(d===0&&copy.explore?.required?.includes('chart1')){copy.task='papers';copy.t='姐姐在催了。我先去卧室，再把报刊架和电话桌也找一遍。';}
  if(d===4&&copy.explore)copy.t='我捏住照片的白边，把它拿近了一点。';
  if(d===4&&copy.choices){copy.t='那只手套还躺在地板上。';copy.choices[0].text='把照片转回姐姐面前';copy.choices[0].reply=[{s:'我',t:'先收起来吧，别压折了。',spoken:true},{s:'姐姐',t:'就放在那里。'},{s:'',t:'我把照片推过去，白边擦过桌面。'}];copy.choices[1].text='先把地上的手套捡起来';copy.choices[1].reply=[{s:'',t:'手套的指尖已经凉了。我把它放到沙发扶手上，姐姐没有看。'},{s:'我',t:'你的手套。',spoken:true}];}
  for(const option of copy.choices||[])for(const reply of option.reply||[]){Object.assign(reply,visual(d,anchor));if(copy.explore)reply.cast=[];if(d===7&&copy.choices){reply.bg='home-entry';reply.cast=['husband-bust'];reply.memory=false;}}
  buckets[anchor].push(copy);
 }
 if(d===3)buckets[7].push({s:'我',t:'我把勺子放近一点。它没有沾上沙子。',...visual(d,7),cast:[],revisionKey:'jan08:sandy',explore:{items:[{id:'a4-sandy-spoon',x:53,y:46,w:25}],required:['a4-sandy-spoon'],missing:'勺子还搁在盘边。'}});
 for(let p=0;p<paras.length;p++){
  const text=paras[p],role=maps[d][p],tokens=role?text.match(/[“"][^”"]*[”"]|[^“"]+/g)||[text]:[text];let spokenIndex=0;
  for(let part=0;part<tokens.length;part++){
   const t=tokens[part];let speaker='',spoken=false;
   if(/^[“"]/.test(t)&&role){let r=Array.isArray(role)?role[spokenIndex]:role;spokenIndex++;if(r==='thought')speaker='我';else if(r){speaker=r;spoken=r==='我';}}
   const node={s:speaker,t,spoken,...visual(d,p),sourceDay:d,sourceParagraph:p,sourcePart:part,revisionKey:scene.id+':source:'+p+':'+part};
   if((d===3&&p===15)||(d===14&&p===16))node.sfx='spoon';if(d===7&&p===12)node.sfx='key';if(d===20&&p===9)node.sfx='wood';
   newNodes.push(node);
  }
  newNodes.push(...buckets[p]);
 }
 if(d===20){const cross=old.findLast(n=>n.fx==='book'||n.exitFx==='book');if(cross)newNodes.push({...cross,revisionKey:'aug11:crossing'});}
 scene.nodes=newNodes;scene.bg=visual(d,0).bg;scene.cast=visual(d,0).cast;sourceCount.push(paras.length);
}
vn.ITEMS.chart1.art='a4-charts-bedroom';vn.ITEMS.chart2.art='a4-charts-rack';vn.ITEMS.chart3.art='a4-charts-phone';
vn.ITEMS.chart1.pages=['卧室里有一叠图表。我把露在外面的纸角理到一起。','每天清晨记下来的数字，连成一排参差的尖齿。'];
vn.ITEMS.chart2.pages=['报刊架上也夹着图表，混在旧报纸之间。','以前看报时瞥见这些曲线，我还在心里想过姐姐的排卵日。'];
vn.ITEMS.chart3.pages=['电话桌旁还有几张。和别处找到的放在一起，二十四张总算齐了。','有时打着电话，我会无意间看到它们，想着这个月的低温期真长。'];
vn.ITEMS['a4-sandy-spoon']={name:'奶油酱旁的小勺',art:'a4-sandy-spoon',story:'妊娠日历',carry:false,pages:['姐姐说它有干燥的沙子味。我眼前仍是每天用的那把小勺。','我把勺柄在手里转了一点。金属没有变化；她却已经不想吃了。']};
Object.assign(vn.PORTRAITS,{'a4-young-sister-bust':{name:'姐姐'},'a4-young-narrator-bust':{name:'我'}});
vn.REVISION_SOURCE={diaries:sourceCount.length,paragraphs:sourceCount.reduce((a,b)=>a+b,0),characters:days.reduce((n,d)=>n+d.original.join('').length,0)};
})();
