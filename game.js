(() => {
'use strict';
const $=id=>document.getElementById(id), esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY='pregnancy-diary-game-v3',scenes=VN.scenes,items=VN.ITEMS;
const byId=Object.fromEntries(scenes.map(s=>[s.id,s]));
const NOTE_BOOKS=window.READING_NOTES,NOTE_KEYS=NOTE_BOOKS.map(n=>n.key);
const readableText=text=>String(text).replace(/[①-⑳㉑-㊿]/g,'');
if(location.protocol==='file:'&&window.GAME_LOCAL_MEDIA_PACKS){
 const packs=new Map();
 window.prepareLocalGameMedia=()=>Promise.all(window.GAME_LOCAL_MEDIA_PACKS.map(file=>{
  if(!packs.has(file)){
   const pending=new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=file;
    script.onload=resolve;
    script.onerror=()=>{script.remove();reject(Error('Local media unavailable: '+file));};
    document.head.append(script);
   }).catch(error=>{packs.delete(file);throw error;});
   packs.set(file,pending);
  }
  return packs.get(file);
 }));
}
const preparedImages=new Map();
const asset=name=>{name=VN.ART_ALIASES?.[name]||name;return preparedImages.get(name)||window.GAME_ASSETS?.[name]||'assets/'+name+'.webp';};
async function preloadImage(name){
 if(preparedImages.has(name))return;
 if(window.prepareLocalGameMedia)await window.prepareLocalGameMedia();
 const embedded=window.GAME_ASSETS?.[name];
 let url=embedded;
 if(!url){
  const response=await fetch('assets/'+name+'.webp',{signal:AbortSignal.timeout?.(45000)});
  if(!response.ok)throw Error('Image unavailable: '+name);
  url=URL.createObjectURL(await response.blob());
 }
 try{
  const image=new Image();
  image.src=url;
  await image.decode();
  preparedImages.set(name,url);
 }catch(error){
  if(!embedded)URL.revokeObjectURL(url);
  throw error;
 }
}
function splitText(text,max=76){
 const out=[];let left=text;
 while(left.length>max){let cut=0;for(let i=Math.min(max,left.length)-1;i>=Math.floor(max*.48);i--)if(/[。！？；，、]/.test(left[i])){cut=i+1;break;}if(!cut)cut=max;out.push(left.slice(0,cut));left=left.slice(cut);}
 if(left)out.push(left);return out.length?out:[''];
}
function normalize(nodes){return nodes.flatMap(node=>{const parts=splitText(node.t||'',node.spoken?44:76);return parts.map((t,i)=>({...node,t:readableText(t),fx:i===0&&node.fx!=='book'?node.fx:undefined,exitFx:i===parts.length-1?(node.fx==='book'?'book':node.exitFx):undefined,choices:i===parts.length-1?node.choices:undefined,explore:i===parts.length-1?node.explore:undefined,listen:i===parts.length-1?node.listen:undefined,wipe:i===parts.length-1?node.wipe:undefined,task:i===parts.length-1?node.task:undefined,sfx:i===0?node.sfx:undefined,finish:i===parts.length-1?node.finish:undefined}));});}
for(const item of Object.values(items))item.pages=item.pages.flatMap(t=>splitText(readableText(t),76));
for(const s of scenes){s.nodes=normalize(s.nodes);for(const node of s.nodes)if(node.choices)for(const opt of node.choices)opt.reply=normalize(opt.reply||[]);}
const intro=scenes[0];const crossing=intro.nodes.findIndex(n=>n.exitFx==='book');for(let i=crossing+1;i<intro.nodes.length;i++){intro.nodes[i].bg='kitchen';intro.nodes[i].cast=['sister-bust'];}
const fresh=()=>({v:2,revision:4,scene:'intro',index:0,inventory:[],found:[],flags:{},visited:['intro'],log:[],branch:null,finished:false,journal:'',ending:null,checkpoint:null,pending:null,roomViews:{},observations:[],completedStories:[],journals:{}});
const readingSizes=['极小','小','默认','大','极大'];
const readingScales=[.8,.9,1,1.15,1.3];
let state=fresh(),settings={speed:27,readingSize:2,musicVolume:.70,effectsVolume:.75,sound:true,auto:false};
const foley=window.createGameAudio(()=>settings);
let sceneTransition=0;
const dormUI=window.createDormitoryUI({$,asset,esc,modal,getState:()=>state,persist,sound,testAccess});
const cafUI=window.createCafeteriaUI({$,asset,esc,modal,closeModal,getState:()=>state,persist,resume:render,listenSound,makeRain:()=>experience.rainDrops(),testAccess});
let view=null,typing=false,fullText='',typeTimer=null,autoTimer=null,lock=false,title=true,lastBg='',toastTimer=null,fxKey='';
const volatile={};let storageAvailable=true;
function read(k){try{const val=localStorage.getItem(KEY+k);return val?JSON.parse(val):volatile[k]||null;}catch{return volatile[k]||null;}}
function write(k,v){volatile[k]=v;try{localStorage.setItem(KEY+k,JSON.stringify(v));}catch{storageAvailable=false;}}
let qaUnlocked=!!$('qa-entry')&&read('-qa-unlocked')===true;
function testAccess(){return qaUnlocked;}
function applyReadingSize(){
 if(!Number.isInteger(settings.readingSize)||readingScales[settings.readingSize]===undefined)settings.readingSize=2;
 document.documentElement.style.setProperty('--reading-scale',readingScales[settings.readingSize]);
}
const stored=read('-settings');
if(stored){
 const {volume,musicVolume,effectsVolume,...preferences}=stored;
 settings={...settings,...preferences,auto:false};
 if(Number.isFinite(musicVolume))settings.musicVolume=Math.max(0,Math.min(1,musicVolume));
 const savedEffects=effectsVolume??volume;
 if(Number.isFinite(savedEffects))settings.effectsVolume=Math.max(0,Math.min(1,savedEffects));
}
const storedLibrary=read('-library');
const noteLibrary={unlocked:Array.isArray(storedLibrary?.unlocked)?storedLibrary.unlocked.filter(k=>NOTE_KEYS.includes(k)):[],journals:{}};
for(const key of NOTE_KEYS)if(typeof storedLibrary?.journals?.[key]==='string')noteLibrary.journals[key]=storedLibrary.journals[key].slice(0,10000);
const experience=window.createExperienceUI({$,asset,esc,modal,closeModal,getState:()=>state,resume:render,replay:s=>load({state:s}),fresh,read,write,noteLibrary,sound,foley,persist,openNote:key=>showReflection(key,true),title:showTitle,testAccess});
applyReadingSize();
function upgradeLegacy(s){
 if(!s||s.revision>=4)return s;const copy=structuredClone(s);
 const grams=t=>{t=String(t||'').replace(/[\s“”"，。！？、：；（）.,!?]/g,'');return new Set(Array.from({length:Math.max(0,t.length-1)},(_,i)=>t.slice(i,i+2)));};
 function remap(id,index,event=false){const table=VN.LEGACY_PAGES?.[id],nodes=byId[id]?.nodes,old=table?.[index];if(!old||!nodes)return index;const direct=nodes.findIndex(n=>n.legacyID===old.raw&&(event||old.event?!!(n.choices||n.explore):n.t===old.t));if(direct>=0)return direct;const a=grams(old.t);let best=0,score=-1;for(let i=0;i<nodes.length;i++){const b=grams(nodes[i].t);let common=0;for(const g of a)if(b.has(g))common++;const value=common/Math.max(1,Math.min(a.size,b.size))-.045*Math.abs(i/nodes.length-index/table.length)+(nodes[i].t===old.t?1:0);if(value>score){score=value;best=i;}}return best;}
 copy.index=remap(copy.scene,copy.index);if(copy.branch){const b=copy.branch,old=VN.LEGACY_PAGES?.[b.scene]?.[b.index],text=VN.LEGACY_BRANCHES?.[b.scene+':'+old?.raw+':'+b.choice]?.[b.pos];b.index=remap(b.scene,b.index,true);const reply=byId[b.scene]?.nodes[b.index]?.choices?.[b.choice]?.reply;if(text&&reply?.length){const exact=reply.findIndex(n=>n.t===text);if(exact>=0)b.pos=exact;else b.pos=Math.min(b.pos,reply.length-1);}}copy.revision=4;return copy;
}
function safeState(s){
 s=upgradeLegacy(s);
 if(!s||s.v!==2||!byId[s.scene]||!Number.isInteger(s.index)||s.index<0||s.index>=byId[s.scene].nodes.length)throw Error('存档位置无效');
 for(const k of ['inventory','found','visited','log'])if(!Array.isArray(s[k]))throw Error('存档不完整');
 if(s.inventory.some(x=>!items[x])||s.found.some(x=>!items[x])||s.visited.some(x=>!byId[x]))throw Error('存档物品无效');
 if(!s.flags||typeof s.flags!=='object'||Array.isArray(s.flags)||typeof s.journal!=='string'||s.journal.length>12000)throw Error('存档不完整');
 if(s.ending&&!VN.ENDINGS[s.ending])throw Error('结局无效');
 if(s.branch){const b=s.branch;const opts=byId[b.scene]?.nodes[b.index]?.choices;if(!opts||!opts[b.choice]||!Number.isInteger(b.pos)||b.pos<0||b.pos>=opts[b.choice].reply.length)throw Error('分支位置无效');}
 const clean=structuredClone(s);clean.roomViews=clean.roomViews||{};if(clean.pending&&!byId[clean.pending])throw Error('日期位置无效');clean.observations=Array.isArray(clean.observations)?clean.observations.filter(id=>VN.DORM_RECORDS.some(r=>r.id===id)):[];clean.completedStories=Array.isArray(clean.completedStories)?clean.completedStories.filter(id=>NOTE_KEYS.includes(id)):(clean.finished?['pregnancy']:[]);clean.journals=clean.journals&&typeof clean.journals==='object'&&!Array.isArray(clean.journals)?clean.journals:{};for(const value of Object.values(clean.journals))if(typeof value!=='string'||value.length>12000)throw Error('手记无效');clean.log=clean.log.filter(x=>typeof x.t==='string'&&typeof x.s==='string').slice(-600);
 clean.inventory=[...new Set([...clean.inventory,...clean.found])];
 clean.echoes=[...new Set([...(Array.isArray(clean.echoes)?clean.echoes:[]),...clean.found.map(id=>items[id]?.echo)].filter(id=>VN.ECHO_RECORDS.some(r=>r.id===id)))];
 const gate=byId.aug11.nodes.findIndex(n=>n.explore?.required?.includes('spoon'));
 if(clean.scene==='aug11'&&clean.index>gate&&gate>=0&&!['note','spoon'].every(id=>clean.found.includes(id))){clean.index=gate;clean.branch=null;clean.pending=null;clean.ending=null;}
 if(clean.checkpoint){clean.checkpoint=safeState({...clean.checkpoint,checkpoint:null});}
 return clean;
}
function chapterLabel(s){if(byId[s.scene]?.chapter)return byId[s.scene].chapter;if(s.scene==='intro')return '序章';if(s.scene==='return')return '尾声';return byId[s.scene]?.date||'序章';}
function saved(trigger='manual'){return {title:saveLabel(state),story:byId[state.scene]?.story||'妊娠日历',chapter:chapterLabel(state),trigger,time:new Date().toISOString(),state:structuredClone(state)};}
function persist(trigger='progress'){if(!title)write('-auto',saved(trigger));}
function toast(t){clearTimeout(toastTimer);$('toast').textContent=t;$('toast').classList.add('show');toastTimer=setTimeout(()=>$('toast').classList.remove('show'),1800);}
function modal(name,html){clearTimeout(autoTimer);$('modal-title').textContent=name;$('modal-content').innerHTML=html;if(!$('modal').open)$('modal').showModal();$('modal').querySelector('.modal-shell').scrollTop=0;}
function closeModal(){$('modal').close();scheduleAuto();}
function current(){if(state.branch){const b=state.branch;return byId[b.scene].nodes[b.index].choices[b.choice].reply[b.pos];}return byId[state.scene].nodes[state.index];}
function allowed(node){if(!node.when)return true;const value=state.flags[node.when.flag];if(node.when.equals!==undefined)return value===node.when.equals;return Number(value||0)>=(node.when.min||1);}
let dissolveTimer=null;
function bg(name){if(lastBg===name)return;const previous=$('background-previous');clearTimeout(dissolveTimer);previous.classList.remove('changing');if(lastBg&&!title&&name!=='title-art'){previous.style.backgroundImage=$('background').style.backgroundImage;previous.dataset.flip=$('background').dataset.flip||'false';void previous.offsetWidth;previous.classList.add('changing');dissolveTimer=setTimeout(()=>{previous.classList.remove('changing');previous.style.backgroundImage='';},1200);}lastBg=name;$('background').dataset.flip=String(name==='d2-hand-cg');$('background').style.backgroundImage="url('"+asset(name)+"')";$('background').classList.remove('blackout');}
function cast(list,speaker){
 $('cast').classList.remove('hidden');const full=list||[],slots=full.length===1?[null,full[0]]:full.slice(0,2);$('cast').classList.toggle('single',full.length===1);
 const profile=art=>VN.PORTRAITS?.[art]||{name:art?.startsWith('husband')?'姐夫':'姐姐'};
 const hasSpeaker=speaker==='我'||full.some(art=>profile(art).name===speaker);
 for(let i=0;i<2;i++){
  const el=$(i?'character-right':'character-left'),art=slots[i];if(!art){el.classList.add('hidden');continue;}
  const src=asset(art),person=profile(art);if(el.getAttribute('src')!==src){el.src=src;el.classList.remove('enter');void el.offsetWidth;el.classList.add('enter');}
  el.alt=person.name;el.dataset.character=art;el.style.setProperty('--flip',person.flip?'-1':'1');el.style.scale=person.mirror?'-1 1':'';el.classList.remove('hidden');el.classList.toggle('speaking',speaker===person.name);el.classList.toggle('dim',!!speaker&&hasSpeaker&&speaker!==person.name);el.style.zIndex=speaker===person.name?'2':'1';
 }
}
function finishTyping(){clearInterval(typeTimer);typing=false;$('dialogue-text').textContent=fullText;afterText();}
function say(s,t,record=true){
 clearInterval(typeTimer);clearTimeout(autoTimer);t=readableText(t);fullText=t;const name=s||'';
 $('dialogue-text').scrollTop=0;
 $('speaker').textContent=name;$('name-frame').classList.toggle('hidden',!name);$('dialogue').classList.remove('hidden');$('next').classList.remove('hidden');
 if(record){const k=[state.scene,state.index,state.branch?.choice??'',state.branch?.pos??''].join(':');if(state.log.at(-1)?.k!==k)state.log.push({k,s:name,t});if(state.log.length>600)state.log.shift();}
 if(settings.speed===0||matchMedia('(prefers-reduced-motion: reduce)').matches){typing=false;$('dialogue-text').textContent=t;afterText();return;}
 let at=0;typing=true;$('dialogue-text').textContent='';typeTimer=setInterval(()=>{at++;$('dialogue-text').textContent=t.slice(0,at);if(at>=t.length)finishTyping();},settings.speed);
}
function afterText(){
 if(view){scheduleAuto();return;}if(state.pending){showDatePrompt();return;}
 const n=current();if(n.choices){$('next').classList.add('hidden');renderChoices(n.choices);}else {if(n.explore&&!n.explore.required.every(id=>state.found.includes(id)))$('next').classList.add('hidden');cafUI.ready(n);experience.ready(n);scheduleAuto();}
}
function renderChoices(options){$('choices').classList.remove('hidden');$('choices').innerHTML=options.map((o,i)=>'<button class="choice" data-choice="'+i+'">'+esc(o.text)+'</button>').join('');$('choices').querySelectorAll('button').forEach(b=>b.onclick=()=>choose(Number(b.dataset.choice)));}
function choose(i){
 if(lock||view||typing)return;const node=current(),opt=node.choices?.[i];if(!opt)return;
 const cp=structuredClone(state);cp.checkpoint=null;state.checkpoint=cp;
 for(const [k,v]of Object.entries(opt.set||{}))state.flags[k]=typeof v==='number'?Number(state.flags[k]||0)+v:v;
 $('choices').classList.add('hidden');
 if(opt.ending){state.ending=opt.ending;renderEnding();persist();return;}
 if(opt.reply?.length){state.branch={scene:state.scene,index:state.index,choice:i,pos:0};render();}
 else {state.index++;step();}
 persist();
}
function render(){
 title=false;$('stage').classList.remove('title-mode');clearInterval(typeTimer);clearTimeout(autoTimer);$('title-screen').classList.add('hidden');$('ending').classList.add('hidden');$('menu-toggle').classList.remove('hidden');$('choices').classList.add('hidden');$('objects').classList.add('hidden');$('item-view').classList.add('hidden');$('date-prompt').classList.add('hidden');$('room-nav').classList.add('hidden');$('narrator').classList.add('hidden');
 if(state.ending){renderEnding();return;}
 let node=current();if(!allowed(node)){advance();return;}
 const scene=byId[state.scene];bg(node.bg||scene.bg);cast(node.cast||scene.cast,node.s);dormUI.render(scene,node);cafUI.render(scene,node);experience.render(scene,node);foley.render(scene,node,[state.scene,state.index,state.branch?.choice??"",state.branch?.pos??""].join(":"));
 $('current-date').textContent=scene.date||'';$('date-control').classList.toggle('hidden',!scene.date);
 if(node.spoken){$('narrator').src=asset(node.narrator||scene.narrator||'narrator-bust');$('narrator').classList.remove('hidden');}$('dialogue').classList.toggle('has-narrator',!!node.spoken);
 if(node.explore){cast([],node.s);drawObjects(node.explore);}
 say(node.s,node.t);persist();
 if(node.fx){const key=state.scene+':'+state.index+':'+(state.branch?.pos??'');if(fxKey!==key){fxKey=key;effect(node.fx);}}
}
function drawObjects(explore){
 let shown=explore.items;
 if(explore.views){const key=state.scene+':'+state.index;const i=state.roomViews[key]||0;const v=explore.views[i];shown=v.items;bg(v.bg);$('room-nav').classList.remove('hidden');$('room-nav').innerHTML=explore.views.map((v,j)=>'<button data-room="'+j+'" class="'+(i===j?'selected':'')+'">'+esc(v.label)+'</button>').join('');$('room-nav').querySelectorAll('[data-room]').forEach(b=>b.onclick=()=>{state.roomViews[key]=Number(b.dataset.room);drawObjects(explore);persist();});}

 $('objects').classList.remove('hidden');$('objects').innerHTML=shown.filter(p=>!state.found.includes(p.id)||p.stay).map(p=>'<button class="object" data-object="'+esc(p.id)+'" style="left:'+p.x+'%;top:'+p.y+'%;width:'+p.w+'%;height:'+p.w*1.4+'%" aria-label="查看'+esc(items[p.id].name)+'"><img src="'+asset(items[p.id].art)+'" alt="'+esc(items[p.id].name)+'"></button>').join('');
 $('objects').querySelectorAll('[data-object]').forEach(b=>b.onclick=()=>openItem(b.dataset.object,'scene'));
}
function openItem(id,source){
 if(lock||!items[id])return;finishTyping();clearTimeout(autoTimer);view={id,source,step:-1};$('choices').classList.add('hidden');$('objects').classList.add('hidden');$('cast').classList.add('hidden');$('narrator').classList.add('hidden');$('companion').classList.add('hidden');$('room-nav').classList.add('hidden');$('dialogue').classList.remove('has-narrator');$('item-view').classList.remove('hidden');
 const item=items[id];$('item-view').dataset.kind=id;$('item-image').src=asset(item.art);$('item-image').alt=item.name;$('item-name').textContent=item.name;
 $('item-inscription').textContent=item.inscription||'';$('item-inscription').className='item-inscription '+(id==='pamphlet'?'pamphlet':'');
 if(!item.inscription)$('item-inscription').classList.add('hidden');else $('item-inscription').classList.remove('hidden');
 say('', '',false);
 if(source==='scene')sound('tap');
 const opened=view;
 setTimeout(()=>{
  if(view!==opened)return;
  sound(/telegram/.test(id)?'telegram':'open');
 },source==='scene'?180:0);
}
function itemNext(){
 const item=items[view.id];view.step++;
 if(view.step<item.pages.length){say('我',item.pages[view.step],false);return;}
 if(view.source!=='scene'||state.found.includes(view.id))sound('close');
 if(view.source==='scene'){
  if(!state.found.includes(view.id)){state.found.push(view.id);{if(!state.inventory.includes(view.id))state.inventory.push(view.id);toast((item.carry===false?'已记住：':'已收起：')+item.name);sound('collect');}}dormUI.observe(item.record);cafUI.observe(item.echo);
 }
 const source=view.source;view=null;$('item-view').classList.add('hidden');render();persist();if(source==='bag')showBag();
}
function closeItem(){const source=view?.source;if(view)sound('close');view=null;$('item-view').classList.add('hidden');render();if(source==='bag')showBag();}
function next(){
 if(experience.isCinematic()){experience.advanceCinematic();return;}
 if(title||lock||$('modal').open||state.ending||state.pending)return;
 if(typing){finishTyping();return;}
 if(view){itemNext();return;}
 const node=current();
 if(node.choices)return;
 if(node.explore&&!node.explore.required.every(id=>state.found.includes(id))){say('我',node.explore.missing,false);return;}
 if(node.listen&&!cafUI.heard(node.listen)){cafUI.openListening(node.listen);return;}
 if(node.wipe&&!state.flags['wiped_'+node.wipe]){cafUI.ready(node);return;}
 if(node.task&&!state.flags['task_'+node.task]){experience.openTask(node.task);return;}
 if(node.exitFx){effect(node.exitFx,()=>{if(node.exitTarget)goTo(node.exitTarget);else advance();});return;}
 if(node.finish==='session'){showSessionEnd();return;}
 if(node.finish){state.finished=true;const key=storyKey();state.completedStories??=[];if(!state.completedStories.includes(key))state.completedStories.push(key);syncNotesFromState();persist();showReflection(key);return;}
 advance();
}
function advance(){
 if(state.branch){const b=state.branch;const reply=byId[b.scene].nodes[b.index].choices[b.choice].reply;b.pos++;if(b.pos>=reply.length){state.scene=b.scene;state.index=b.index+1;state.branch=null;}}
 else state.index++;
 step();
}
function step(){
 const scene=byId[state.scene];
 if(state.index>=scene.nodes.length){const i=scenes.indexOf(scene);state.index=scene.nodes.length-1;if(i>=scenes.length-1){showSessionEnd();return;}if(scene.autoNext){goTo(scenes[i+1].id);return;}state.pending=scenes[i+1].id;showDatePrompt();persist();}
 else render();
}
function showDatePrompt(){const target=byId[state.pending];if(!target)return;$('next').classList.add('hidden');$('objects').classList.add('hidden');$('room-nav').classList.add('hidden');$('date-next').textContent=target.date?'继续下一日期 · '+target.date+'　→':target.chapter?'继续 · '+target.chapter+'　→':'回到午后　→';$('date-prompt').classList.remove('hidden');clearTimeout(autoTimer);}
function commitDate(){
 if(!state.pending||lock)return;
 const target=byId[state.pending];if(target.story==='学生宿舍'||target.story==='傍晚的配餐室和雨中的游泳池'){commitChapter(target);return;}const ticket=++sceneTransition,overlay=$('date-transition');
 lock=true;clearTimeout(autoTimer);$('date-prompt').classList.add('hidden');
 $('date-from').textContent=byId[state.scene].date||'序章';$('date-to').textContent=target.date||'午后';
 const source=window.STORY?.[scenes.filter(s=>s.date).findIndex(s=>s.id===target.id)];
 const cn=s=>{const digits={一:1,二:2,三:3,四:4,五:5,六:6,七:7,八:8,九:9};if(s==='十')return 10;if(s.includes('十')){const[a,b]=s.split('十');return (digits[a]||1)*10+(digits[b]||0);}return digits[s]||0;};
 const parts=(target.date||'').match(/^(.+)月(.+)日$/),day=parts?cn(parts[2]):1,month=parts?cn(parts[1]):1;
 const weekday=source?.heading?.match(/星期([日一二三四五六])/),week=weekday?'日一二三四五六'.indexOf(weekday[1]):0;
 $('date-weekday').textContent=weekday?'星期'+weekday[1]:'';
 const count=[31,28,31,30,31,30,31,31,30,31,30,31][month-1],offset=(week-(day-1)%7+7)%7;
 $('date-mini-grid').innerHTML=Array.from({length:Math.ceil((offset+count)/7)*7},(_,i)=>{const n=i-offset+1;return '<i'+(n===day?' class="marked"':'')+'>'+String(n<1||n>count?'':n)+'</i>';}).join('');
 overlay.querySelector('.date-leaf-turn').dataset.date=$('date-from').textContent;
 overlay.classList.toggle('returning',!target.date);overlay.classList.remove('hidden');sound('turn');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 setTimeout(()=>{if(ticket!==sceneTransition||title)return;state.scene=target.id;state.index=0;state.branch=null;state.pending=null;if(!state.visited.includes(target.id))state.visited.push(target.id);render();persist('chapter');},reduced?10:1350);
 setTimeout(()=>{if(ticket!==sceneTransition||title)return;overlay.classList.add('hidden');lock=false;scheduleAuto();},reduced?50:2850);
}
function goTo(id){const target=byId[id];if(!target)return;state.scene=id;state.index=0;state.branch=null;state.pending=null;state.ending=null;state.finished=false;view=null;if(!state.visited.includes(id))state.visited.push(id);render();persist('chapter');}
function commitChapter(target){const ticket=++sceneTransition;lock=true;clearTimeout(autoTimer);$('date-prompt').classList.add('hidden');$('chapter-from').textContent=byId[state.scene].chapter||'';$('chapter-to').textContent=target.chapter;experience.transition(target,byId[state.scene]);$('chapter-transition').classList.remove('hidden');sound(target.story==='学生宿舍'?'dormTransition':'rainTransition');const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;setTimeout(()=>{if(ticket!==sceneTransition||title)return;goTo(target.id);},reduced?10:1150);setTimeout(()=>{if(ticket!==sceneTransition||title)return;$('chapter-transition').classList.add('hidden');lock=false;scheduleAuto();},reduced?50:2800);}
function effect(type,onDone){
 const ticket=sceneTransition;
 if(type==='doorbell'||type==='homeward'){const cls=type==='doorbell'?'doorbell-ring':'homeward-motion';$('stage').classList.remove(cls);void $('stage').offsetWidth;$('stage').classList.add(cls);if(type==='doorbell')sound('bell');setTimeout(()=>$('stage').classList.remove(cls),type==='doorbell'?1200:2700);return;}
 if(type==='shake'){$('background').classList.add('shake');setTimeout(()=>$('background').classList.remove('shake'),650);sound('drop');return;}
 if(type==='torch'||type==='reveal'){$('stage').classList.remove('torch-reveal','hive-reveal');void $('stage').offsetWidth;$('stage').classList.add(type==='torch'?'torch-reveal':'hive-reveal');setTimeout(()=>$('stage').classList.remove('torch-reveal','hive-reveal'),1400);return;}
 if(type==='book'){lock=true;clearTimeout(autoTimer);const el=$('transition');el.classList.remove('hidden');$('transition-text').textContent='';$('background').classList.add('book-zoom');sound('book');
  setTimeout(()=>{$('background').classList.remove('book-zoom');},1800);
  setTimeout(()=>{if(ticket!==sceneTransition||title)return;el.classList.add('hidden');lock=false;if(onDone)onDone();scheduleAuto();},matchMedia('(prefers-reduced-motion: reduce)').matches?80:2800);
 }
}
function renderEnding(){clearInterval(typeTimer);clearTimeout(autoTimer);const end=VN.ENDINGS[state.ending];$('ending').classList.remove('hidden');$('dialogue').classList.add('hidden');$('choices').classList.add('hidden');$('objects').classList.add('hidden');$('ending-title').textContent=end.title;$('ending-text').textContent=end.text;bg(end.bg||(state.ending==='fall'?'hospital':'reading-room'));$('weather').innerHTML='';dormUI.clear();cafUI.clear();experience.clear();foley.mix('');sound('failure');}
function retry(){if(!state.checkpoint)return;const cp=structuredClone(state.checkpoint);cp.ending=null;state=cp;view=null;render();persist();}
function scheduleAuto(){clearTimeout(autoTimer);if(!settings.auto||typing||view||title||lock||experience.isCinematic()||$('modal').open||state.ending||state.pending)return;const n=current();if(!n.choices&&!n.explore&&!n.finish&&!n.exitFx&&!n.listen&&!n.wipe&&!n.task)autoTimer=setTimeout(next,Math.max(1700,n.t.length*85));}
function showMenu(){
 const opts=[['back','返回游戏'],['save','存档'],['load','读档'],['bag','背包'],['log','回看'],['chapters','选择章节'],['journal','手记'],['settings','设置'],['title','返回标题']];
 
 modal('菜单','<div class="menu-list">'+opts.map(([key,label])=>'<button data-menu="'+key+'">'+label+'</button>').join('')+'</div>');
 $('modal-content').querySelectorAll('[data-menu]').forEach(b=>b.onclick=()=>({back:closeModal,save:()=>showSaves('save'),load:()=>showSaves('load'),bag:showBag,log:showLog,calendar:showCalendar,settings:showSettings,title:()=>{closeModal();showTitle();},journal:showNotebooks,chapters:()=>experience.chapters()})[b.dataset.menu]());
}
function showBag(){
 const collected=testAccess()?Object.keys(items):[...new Set(state.inventory)].filter(id=>items[id]),groups=[...new Set(collected.map(id=>items[id].story||'妊娠日历'))];
 modal('背包',collected.length?groups.map(story=>'<section class="bag-section"><h3>'+esc(story)+'</h3><div class="bag">'+collected.filter(id=>(items[id].story||'妊娠日历')===story).map(id=>'<button class="bag-item" data-bag="'+id+'"><img src="'+asset(items[id].art)+'" alt=""><span>'+esc(items[id].name)+'</span>'+'</button>').join('')+'</div></section>').join(''):'<p class="empty">背包是空的。</p>');
 $('modal-content').querySelectorAll('[data-bag]').forEach(b=>b.onclick=()=>{closeModal();openItem(b.dataset.bag,'bag');});
}
function saveLabel(s){return (byId[s.scene]?.story||'妊娠日历')+'-'+chapterLabel(s);}
const saveSlots=['auto','1','2','3','4','5','6'];
function showSaves(mode='load'){
 modal(mode==='save'?'存档':'读档','<div class="save-list">'+saveSlots.map(id=>{const val=read('-'+id);return '<div class="save-slot"><div><strong>'+(id==='auto'?'自动存档':'存档 '+id)+'　'+(val?esc(saveLabel(val.state)):'空')+'</strong><small>'+(val?new Date(val.time).toLocaleString('zh-CN'):'')+'</small></div><div>'+((mode==='save'&&id!=='auto')?'<button data-save="'+id+'">保存</button>':'')+'<button data-load="'+id+'" '+(!val?'disabled':'')+'>读取</button></div></div>';}).join('')+'</div><div class="file-actions"><button id="export">导出存档</button><button id="import">导入存档</button><button id="clear-saves">清除存档</button><input id="import-file" type="file" accept=".json" class="hidden"></div>');
 $('modal-content').querySelectorAll('[data-save]').forEach(b=>b.onclick=()=>{write('-'+b.dataset.save,saved());showSaves(mode);toast('保存成功');});
 $('modal-content').querySelectorAll('[data-load]').forEach(b=>b.onclick=()=>load(read('-'+b.dataset.load)));
 $('export').onclick=()=>download('妊娠日历-存档.json',JSON.stringify({...saved(),progress:experience.archive(),library:noteLibrary}),'application/json');
 $('import').onclick=()=>$('import-file').click();$('import-file').onchange=async e=>{const f=e.target.files[0];if(!f)return;if(f.size>2000000){toast('存档文件过大');return;}try{const data=JSON.parse(await f.text());if(e.target.isConnected&&$('modal').open)load(data);}catch{toast('无法读取存档');}};
 $('clear-saves').onclick=()=>confirmClearSaves(mode);
}
function confirmClearSaves(mode,final=false){
 const text=final?'永久删除这些进度并返回标题？此操作无法撤销。':'将清除本浏览器中的自动存档、全部手动存档、章节解锁、手记和拼贴。字号及音量等设置会保留。';
 modal(final?'最后确认':'清除存档','<p class="empty">'+text+'</p><div class="toolbar"><button class="plain-button" id="cancel-clear">取消</button><button class="plain-button" id="confirm-clear">'+(final?'永久删除':'继续确认')+'</button></div>');
 $('cancel-clear').onclick=()=>showSaves(mode);
 $('confirm-clear').onclick=final?clearSaves:()=>confirmClearSaves(mode,true);
 $('cancel-clear').focus();
}
function clearSaves(){
 const keys=[...saveSlots.map(slot=>'-'+slot),'-journey','-library','-qa-unlocked'];
 let cleared=true;
 for(const key of keys){
  delete volatile[key];
  try{localStorage.removeItem(KEY+key);}catch{cleared=false;}
 }
 qaUnlocked=false;
 state=fresh();
 noteLibrary.unlocked=[];
 noteLibrary.journals={};
 experience.resetProgress();
 title=true;
 closeModal();
 showTitle();
 toast(cleared?'存档已清除':'本次会话的进度已清除，浏览器未允许清除本地存档');
}
function load(val){try{const restored=safeState(val?.state);experience.importProgress(val?.progress);for(const key of val?.library?.unlocked||[]){if(NOTE_KEYS.includes(key)&&!noteLibrary.unlocked.includes(key))noteLibrary.unlocked.push(key);}for(const key of NOTE_KEYS){const text=val?.library?.journals?.[key];if(typeof text==='string'&&!noteLibrary.journals[key])noteLibrary.journals[key]=text.slice(0,10000);}sceneTransition++;experience.clear();foley.stop();state=restored;syncNotesFromState();view=null;title=false;closeModal();render();persist();}catch(e){toast(e.message);}}
function showCalendar(){
 const dates=scenes.filter(s=>s.date);
 modal('日历','<div class="calendar">'+dates.map(s=>'<button data-day="'+s.id+'" '+(!testAccess()&&!state.visited.includes(s.id)?'disabled':'')+'>'+esc(s.date)+'</button>').join('')+'</div>');
 $('modal-content').querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{state.scene=b.dataset.day;state.index=0;state.pending=null;state.branch=null;state.ending=null;view=null;closeModal();render();persist();});
}
function showLog(){modal('回看',state.log.length?state.log.map(l=>'<div class="log-line">'+(l.s?'<b>'+esc(l.s)+'</b>':'')+esc(readableText(l.t))+'</div>').join(''):'<p class="empty">还没有对话。</p>');const box=$('modal').querySelector('.modal-shell');setTimeout(()=>box.scrollTop=box.scrollHeight,0);}
function showSettings(){
 const sizeOptions=readingSizes.map((name,i)=>'<option value="'+i+'"'+(i===settings.readingSize?' selected':'')+'>'+name+'</option>').join('');
 modal('设置','<div class="setting"><label for="speed">文字速度</label><input id="speed" type="range" min="0" max="60" step="3" value="'+settings.speed+'"></div><div class="setting"><label for="reading-size">字号</label><select id="reading-size">'+sizeOptions+'</select></div><div class="setting"><label for="music-volume">BGM 音量</label><input id="music-volume" type="range" min="0" max="1" step=".05" value="'+settings.musicVolume+'"></div><div class="setting"><label for="effects-volume">音效音量</label><input id="effects-volume" type="range" min="0" max="1" step=".05" value="'+settings.effectsVolume+'"></div><div class="setting"><span>声音</span><button id="sound">'+(settings.sound?'开启':'关闭')+'</button></div><div class="setting"><span>自动播放</span><button id="auto">'+(settings.auto?'开启':'关闭')+'</button></div><div class="setting"><span>全屏</span><button id="fullscreen">切换</button></div>');
 $('speed').oninput=e=>{settings.speed=Number(e.target.value);write('-settings',settings);};
 $('reading-size').onchange=e=>{settings.readingSize=Number(e.target.value);applyReadingSize();write('-settings',settings);};
 for(const [id,key] of [['music-volume','musicVolume'],['effects-volume','effectsVolume']])$(id).oninput=e=>{settings[key]=Number(e.target.value);updateVolume();write('-settings',settings);};
 $('sound').onclick=()=>{settings.sound=!settings.sound;initAudio();updateVolume();write('-settings',settings);showSettings();};
 $('auto').onclick=()=>{settings.auto=!settings.auto;write('-settings',settings);showSettings();};
 $('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('game').requestFullscreen();}catch{toast('无法切换全屏');}};
}
function storyKey(s=state){const story=byId[s.scene]?.story;return byId[s.scene]?.noteKey||(story==='学生宿舍'?'dormitory':story==='傍晚的配餐室和雨中的游泳池'?'cafeteria':'pregnancy');}
function syncNotesFromState(){
 const completed=[...(state.completedStories||[])];if(state.finished)completed.push(storyKey());
 for(const key of completed)if(NOTE_KEYS.includes(key)&&!noteLibrary.unlocked.includes(key))noteLibrary.unlocked.push(key);
 for(const key of NOTE_KEYS){const old=key==='pregnancy'?state.journal:state.journals?.[key];if(!(key in noteLibrary.journals)&&typeof old==='string'&&old)noteLibrary.journals[key]=old;}
 for(const key of noteLibrary.unlocked)if(typeof noteLibrary.journals[key]==='string'){if(key==='pregnancy')state.journal=noteLibrary.journals[key];else{state.journals??={};state.journals[key]=noteLibrary.journals[key];}}
 write('-library',noteLibrary);
}
function showNotebooks(){
 syncNotesFromState();modal('手记','<div class="notebook-shelf">'+NOTE_BOOKS.map((note,i)=>{const unlocked=noteLibrary.unlocked.includes(note.key);return '<button class="notebook-card" data-notebook="'+note.key+'" '+(!unlocked?'disabled':'')+'><span class="notebook-number">第'+['一','二','三'][i]+'篇</span><strong>'+(unlocked?esc(note.title):'？？？')+'</strong><span class="notebook-status">'+(unlocked?'回顾手记':'未解锁')+'</span></button>';}).join('')+'</div><div class="toolbar"><button class="plain-button" id="notebook-collage">拼一页手记</button></div>');
 $('notebook-collage').onclick=()=>experience.collage();
 $('modal-content').querySelectorAll('[data-notebook]:not(:disabled)').forEach(b=>b.onclick=()=>showReflection(b.dataset.notebook,true));
}
function showReflection(key,fromShelf=false){
 syncNotesFromState();key=key||(state.finished?storyKey():(noteLibrary.unlocked.at(-1)||'pregnancy'));
 const note=NOTE_BOOKS.find(n=>n.key===key);if(!note||!noteLibrary.unlocked.includes(key)){showNotebooks();return;}
 const value=noteLibrary.journals[key]??(key==='pregnancy'?state.journal:state.journals?.[key])??'';
 modal('读后手记 · '+note.title,'<div class="read-note">'+note.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join('')+'</div><label class="journal-label" for="journal">把想留下的话写在这里。</label><textarea id="journal" class="journal" maxlength="10000">'+esc(value)+'</textarea><div class="toolbar"><button class="plain-button" id="save-journal">保存</button><button class="plain-button" id="export-journal">导出图片</button><button class="plain-button" id="export-journal-text">导出文字</button>'+(fromShelf?'<button class="plain-button" id="notebook-back">返回手记</button>':'')+'<button class="plain-button" id="continue-story">继续游戏</button><button class="plain-button" id="reflection-title">返回标题</button></div>');
 const update=()=>{const text=$('journal').value;noteLibrary.journals[key]=text;if(key==='pregnancy')state.journal=text;else{state.journals??={};state.journals[key]=text;}write('-library',noteLibrary);persist();};
 $('journal').oninput=update;$('save-journal').onclick=()=>{update();toast('已保存');};$('export-journal').onclick=()=>{update();experience.shareNote(note,noteLibrary.journals[key]||'',()=>showReflection(key,fromShelf));};$('export-journal-text').onclick=()=>download(note.title+'-手记.txt',$('journal').value,'text/plain');
 if(fromShelf)$('notebook-back').onclick=()=>{update();showNotebooks();};
 $('continue-story').onclick=()=>{update();const target=state.finished?byId[state.scene].nextStory:null;closeModal();if(target)goTo(target);};
 $('reflection-title').onclick=()=>{update();closeModal();showTitle();};
}
function showSessionEnd(){persist();experience.finale();}

function bindTestAccess(){
 const button=$('qa-entry');
 if(!button)return;
 const dialog=$('qa-dialog'),form=$('qa-form'),input=form.querySelector('input');
 let clicks=0,lastClick=0;
 document.addEventListener('click',event=>{
  if(event.target!==button){clicks=0;return;}
  if(!title||dialog.open||$('modal').open)return;
  const now=performance.now();
  if(now-lastClick>1500)clicks=0;
  lastClick=now;
  if(++clicks!==5)return;
  clicks=0;
  form.reset();
  dialog.showModal();
  input.focus();
 });
 form.addEventListener('submit',event=>{
  event.preventDefault();
  if(input.value!=='heritestpassword'){form.reset();input.focus();return;}
  qaUnlocked=true;
  write('-qa-unlocked',true);
  noteLibrary.unlocked=[...NOTE_KEYS];
  write('-library',noteLibrary);
  experience.importProgress({reached:scenes.map(scene=>scene.id),objects:Object.keys(items),endSeen:true});
  form.reset();
  dialog.close();
 });
}
bindTestAccess();

function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function showTitle(){
 persist('title');sceneTransition++;$('stage').classList.add('title-mode');title=true;clearInterval(typeTimer);clearTimeout(autoTimer);view=null;lock=false;for(const id of ['dialogue','cast','objects','choices','item-view','ending','menu-toggle','transition','date-transition','date-control','room-nav','narrator','date-prompt','dorm-control','chapter-transition','echo-control','listen-prompt','companion'])$(id).classList.add('hidden');$('title-screen').classList.remove('hidden');bg('title-art');$('weather').innerHTML='';dormUI.clear();cafUI.clear();experience.clear();foley.stop();foley.mix('title');$('background-previous').classList.remove('changing');$('background-previous').style.backgroundImage='';
}
function start(){sceneTransition++;experience.clear();$('stage').classList.remove('opening-cover');void $('stage').offsetWidth;$('stage').classList.add('opening-cover');setTimeout(()=>$('stage').classList.remove('opening-cover'),1500);fxKey='';state=fresh();title=false;view=null;initAudio();render();}
function showHeadphoneIntro(){
 const prompt=$('headphone-intro');
 if(prompt.open)return;
 const progress=$('asset-progress'),label=$('asset-progress-label'),actions=$('asset-load-actions');
 const images=window.GAME_ASSET_LIST?.images||Object.keys(window.GAME_ASSETS||{});
 const audio=window.GAME_ASSET_LIST?.audio||Object.keys(window.GAME_AUDIO||{});
 progress.value=0;
 label.textContent='正在准备素材…';
 actions.classList.add('hidden');
 prompt.showModal();
 prompt.oncancel=event=>event.preventDefault();
 $('asset-load-back').onclick=()=>prompt.close();
 if(!images?.length||!audio?.length){
  label.textContent='素材清单无法读取，请刷新网页后再试。';
  $('asset-load-retry').disabled=true;
  actions.classList.remove('hidden');
  return;
 }
 const minimumDisplay=new Promise(resolve=>setTimeout(resolve,5000));
 let pending=[...images.map(name=>()=>preloadImage(name)),...audio.map(name=>()=>foley.preload(name))];
 const total=pending.length;
 let loaded=0;
 progress.max=100;
 async function prepare(){
  actions.classList.add('hidden');
  const batch=pending;
  pending=[];
  let next=0;
  const update=()=>{
   progress.value=Math.floor(loaded*100/total);
   label.textContent='正在预载素材 · '+progress.value+'%';
  };
  update();
  async function worker(){
   while(next<batch.length){
    const job=batch[next++];
    try{
     await job();
     loaded++;
     update();
    }catch{
     pending.push(job);
    }
   }
  }
  await Promise.all(Array.from({length:4},worker));
  if(pending.length){
   label.textContent='素材未能全部加载，请重试。';
   actions.classList.remove('hidden');
   $('asset-load-retry').focus();
   return;
  }
  label.textContent='素材已准备好 · 100%';
  await minimumDisplay;
  prompt.close();
  start();
 }
 $('asset-load-retry').disabled=false;
 $('asset-load-retry').onclick=prepare;
 prepare();
}
function showPlayerNotice(){
 const dialog=$('player-notice'),button=$('notice-close');
 if(dialog.open)return;
 let remaining=read('-notice-seen')?0:15000;
 let previous=performance.now(),visible=!document.hidden,timer;
 function update(){
  const now=performance.now();
  if(visible)remaining=Math.max(0,remaining-(now-previous));
  previous=now;
  visible=!document.hidden;
  button.disabled=remaining>0;
  const label=remaining>0?Math.ceil(remaining/1000)+' 秒后可关闭':'关闭';
  if(button.textContent!==label)button.textContent=label;
  if(!remaining)clearInterval(timer);
 }
 function dismiss(){
  update();
  if(remaining>0)return;
  write('-notice-seen',true);
  dialog.close();
 }
 dialog.oncancel=event=>{event.preventDefault();dismiss();};
 dialog.onclose=()=>{
  clearInterval(timer);
  document.removeEventListener('visibilitychange',update);
 };
 button.onclick=dismiss;
 dialog.showModal();
 update();
 if(remaining){
  document.addEventListener('visibilitychange',update);
  timer=setInterval(update,150);
 }
}
function initAudio(){foley.init();}
function updateVolume(){foley.configure();}
function listenSound(kind){return foley.listen(kind);}
function sound(type){return foley.play(type);}
$('start').onclick=()=>{if(read('-auto')){modal('开始游戏','<p class="empty">重新开始将覆盖自动存档。</p><div class="toolbar"><button class="plain-button" id="confirm-start">重新开始</button><button class="plain-button" id="cancel-start">取消</button></div>');$('confirm-start').onclick=()=>{closeModal();showHeadphoneIntro();};$('cancel-start').onclick=closeModal;}else showHeadphoneIntro();};
$('continue').onclick=()=>showSaves('load');
$('notice-open')?.addEventListener('click',showPlayerNotice);
const customSoundControls='#qa-entry,#dialogue-text,#date-next,#item-close,[data-object],[data-bag],[data-paper],#paper-folder,#task-open,#stitch-hold,#torch-steady,#listen-hold,[data-pick],#collage-export,#export-journal,#finale-skip';
document.addEventListener('click',event=>{
 initAudio();
 const control=event.target.closest('button, a.plain-button');
 if(control&&!control.disabled&&!control.matches(customSoundControls)){
  // Let navigation finish switching audio scenes before playing the UI sound.
  setTimeout(()=>sound('select'),0);
 }
},{capture:true});
document.addEventListener('keydown',initAudio,{capture:true});
$('date-control').onclick=showCalendar;$('date-next').onclick=commitDate;$('menu-toggle').onclick=showMenu;$('close-modal').onclick=closeModal;$('dialogue-text').onclick=next;$('next').onclick=next;$('item-image').onclick=()=>{if(typing)finishTyping();else itemNext();};$('item-close').onclick=closeItem;$('retry').onclick=retry;$('ending-menu').onclick=showTitle;
$('modal').addEventListener('close',scheduleAuto);
document.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)||$('headphone-intro').open||$('player-notice')?.open)return;if(e.key==='Escape'&&!title&&!$('modal').open){e.preventDefault();if(view)closeItem();else showMenu();return;}if((e.code==='ArrowRight'||(e.code==='Space'&&(!title||!e.target.closest('button,a'))))&&!$('modal').open){e.preventDefault();next();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){persist('background');clearTimeout(autoTimer);foley.pause(true);}else{foley.pause(false);updateVolume();scheduleAuto();}});
window.addEventListener('beforeunload',()=>persist('exit'));
window.addEventListener('pagehide',()=>persist('exit'));
window.Game={getState:()=>structuredClone(state),validateSave:safeState,journey:experience.diagnostics,audio:foley.diagnostics,getNode:()=>structuredClone(current()),isTyping:()=>typing,isLocked:()=>lock,getView:()=>view?{...view}:null};
const motes=document.getElementById('cover-motes');for(let i=0;i<28;i++){const mote=document.createElement('i');mote.className='cover-mote';mote.style.cssText='left:'+((i*37+11)%98)+'%;top:'+((i*23+19)%95)+'%;--delay:'+(-i*.81)+'s;--life:'+(8+i%7)+'s;--drift:'+(-14+i%5*9)+'px;--size:'+(i%3===0?2:1)+'px';motes.appendChild(mote);}
$('cover-book-object').src=asset('a4-cover-book');
$('title-screen').style.setProperty('--cover-art',"url('"+asset('title-art')+"')");
showTitle();
if($('player-notice')&&!read('-notice-seen'))showPlayerNotice();
})();
