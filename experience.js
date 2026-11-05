(() => {
'use strict';
window.createExperienceUI=function(api){
 const {$,asset,esc,modal,closeModal,getState,resume,replay,fresh,read,write,noteLibrary,sound,foley,testAccess}=api;
 const scenes=VN.scenes,books=[{key:'pregnancy',title:'妊娠日历'},{key:'dormitory',title:'学生宿舍'},{key:'cafeteria',title:'傍晚的配餐室和雨中的游泳池'}];
 const key=s=>s.noteKey||(s.story==='学生宿舍'?'dormitory':s.story==='傍晚的配餐室和雨中的游泳池'?'cafeteria':'pregnancy');
 const saved=read('-journey'),journey={reached:Array.isArray(saved?.reached)?saved.reached.filter(id=>scenes.some(s=>s.id===id)):[],entries:saved?.entries&&typeof saved.entries==='object'?saved.entries:{},endSeen:!!saved?.endSeen,objects:Array.isArray(saved?.objects)?saved.objects.filter(id=>VN.ITEMS[id]):[],collage:saved?.collage&&typeof saved.collage==='object'?saved.collage:{pieces:[],text:''}};
 let finalePaused=false;
 let selectedBook='pregnancy',taskSession=0,lastStage='',lastRain='',effectTimer=null,finaleTimer=null,finaleIndex=0,finaleRun=0,finaleActive=false,shareURLs=[];
 function rememberObjects(state){let added=false;for(const id of state?.found||[])if(VN.ITEMS[id]&&!journey.objects.includes(id)){journey.objects.push(id);added=true;}return added;}
 function remember(id){if(!scenes.some(s=>s.id===id)||journey.reached.includes(id))return;journey.reached.push(id);}
 for(const slot of ['-auto','-1','-2','-3','-4','-5','-6']){const val=read(slot)?.state;if(val){rememberObjects(val);for(const id of val.visited||[])remember(id);remember(val.scene);}}
 for(const k of noteLibrary.unlocked){for(const s of scenes.filter(s=>key(s)===k&&!['d2-afterword','d3-bookmark'].includes(s.id)))remember(s.id);}
 write('-journey',journey);
 function rememberCurrent(scene){
  const oldCount=journey.reached.length;for(const id of getState().visited||[])remember(id);const added=rememberObjects(getState());if(added||journey.reached.length!==oldCount)write('-journey',journey);
  if(!journey.reached.includes(scene.id)){remember(scene.id);write('-journey',journey);}
  if(!journey.entries[scene.id]&&getState().index===0&&!getState().branch){const s=structuredClone(getState());s.log=[];s.journal='';s.journals={};s.checkpoint=null;s.index=0;s.branch=null;s.pending=null;s.ending=null;s.finished=false;journey.entries[scene.id]=s;write('-journey',journey);}
 }
 function entry(id){
  const target=scenes.find(s=>s.id===id),saved=journey.entries[id];if(saved){const s=structuredClone(saved);s.revision=4;s.scene=id;s.index=0;s.branch=null;s.checkpoint=null;s.pending=null;s.ending=null;s.finished=false;s.log=[];return s;}
  const s=fresh(),at=scenes.indexOf(target);s.scene=id;s.index=0;s.visited=scenes.slice(0,at+1).map(s=>s.id);s.found=[];s.inventory=[];s.observations=[];s.echoes=[];
  for(const previous of scenes.slice(0,at))for(const n of previous.nodes){for(const item of n.explore?.required||[]){if(!s.found.includes(item)){s.found.push(item);s.inventory.push(item);}if(VN.ITEMS[item]?.record)s.observations.push(VN.ITEMS[item].record);if(VN.ITEMS[item]?.echo)s.echoes.push(VN.ITEMS[item].echo);}if(n.record)s.observations.push(n.record);if(n.task)s.flags['task_'+n.task]=true;if(n.listen)s.flags['heard_'+n.listen]=true;if(n.wipe)s.flags['wiped_'+n.wipe]=true;}
  s.observations=[...new Set(s.observations)];s.echoes=[...new Set(s.echoes)];s.completedStories=books.slice(0,books.findIndex(b=>b.key===key(target))).map(b=>b.key).filter(k=>noteLibrary.unlocked.includes(k));return s;
 }
 function chapters(book=selectedBook){
  for(const k of noteLibrary.unlocked)for(const sc of scenes.filter(sc=>key(sc)===k&&!['d2-afterword','d3-bookmark'].includes(sc.id)))remember(sc.id);write('-journey',journey);
  selectedBook=book;const list=scenes.filter(s=>key(s)===book&&(testAccess()||s.id!=='d2-afterword'));
  modal('选择章节','<div class="story-tabs">'+books.map((b,i)=>{const unlocked=scenes.some(s=>key(s)===b.key&&journey.reached.includes(s.id));return '<button data-story="'+b.key+'" class="'+(b.key===book?'selected':'')+'" '+(!unlocked&&b.key!=='pregnancy'?'disabled':'')+'><small>第'+['一','二','三'][i]+'篇</small><strong>'+(unlocked?esc(b.title):'？？？')+'</strong></button>';}).join('')+'</div><div class="chapter-shelf">'+list.map((s,i)=>{const unlocked=journey.reached.includes(s.id),label=s.chapter||(s.id==='intro'?'序章':s.id==='return'?'读后':'')||s.date||'书页';return '<button class="chapter-card '+(unlocked?'':'sealed')+'" data-chapter="'+s.id+'" '+(!unlocked?'disabled':'')+'>'+(unlocked?'<img src="'+asset(s.bg)+'" alt="">':'<span class="closed-chapter"></span>')+'<span><small>'+String(i+1).padStart(2,'0')+'</small><strong>'+(unlocked?esc(label):'？？？')+'</strong></span></button>';}).join('')+'</div>');
  $('modal-content').querySelectorAll('[data-story]').forEach(b=>b.onclick=()=>chapters(b.dataset.story));
  $('modal-content').querySelectorAll('[data-chapter]:not(:disabled)').forEach(b=>b.onclick=()=>{const s=entry(b.dataset.chapter);closeModal();replay(s);});
 }
 function resetProgress(){
  Object.assign(journey,{reached:[],entries:{},endSeen:false,objects:[],collage:{pieces:[],text:''}});
  selectedBook='pregnancy';
 }
 function rainDrops(storm=false, soft=false){
  const count=storm?252:soft?120:180;
  const wind=storm?13:5;
  return Array.from({length:count},()=>{
   const depth=Math.random();
   const x=-14+Math.random()*114;
   const length=12+depth*23+Math.random()*6;
   const width=1.4+depth*1.4;
   const duration=(storm ? 0.58 : 0.78)+(1-depth)*.48+Math.random()*.27;
   const angle=Math.max(0,wind+(Math.random()-.5)*9);
   const drift=Math.tan(angle*Math.PI/180)*112;
   const opacity=(.30+depth*.43)*(soft ? 0.8 : 1);
   const delay=-Math.random()*duration;
   return '<span class="rain-drop" style="--x:'+x.toFixed(2)+'%;--length:'+length.toFixed(1)+'px;--width:'+width.toFixed(1)+'px;--time:'+duration.toFixed(3)+'s;--delay:'+delay.toFixed(3)+'s;--tilt:'+(-angle).toFixed(1)+'deg;--drift:'+drift.toFixed(2)+'cqh;--alpha:'+opacity.toFixed(2)+'"></span>';
  }).join('');
 }
 function render(scene,node){
  rememberCurrent(scene);$('stage').classList.toggle('low-light',scene.id==='aug11'&&(node.bg||scene.bg)==='corridor');$('stage').classList.toggle('memory-mode',!!node.memory);$('stage').classList.toggle('story-one',key(scene)==='pregnancy'&&!!scene.date);$('task-prompt').classList.add('hidden');
  const bg=node.bg||scene.bg||'',mood=node.ambience||scene.ambience||'';let kind='';
  const wet=/rain|storm/.test(mood+' '+bg);
  const rain=node.weather||scene.weather||(wet?(/storm/.test(mood+' '+bg)?'storm':/pool|yard|street/.test(bg)?'outdoor':'soft'):'');
  if(lastRain!==rain){
   lastRain=rain;
   $('rain-field').innerHTML=rain?rainDrops(rain==='storm',rain==='soft'):'';
  }
  if(/jam/.test(bg))kind='simmer';else if(scene.id==='aug08')kind='summer-heat';else if(node.memory)kind='remembered';
  if(lastStage!==kind){lastStage=kind;$('experience-atmosphere').dataset.kind=kind;$('experience-atmosphere').innerHTML=kind==='simmer'?'<i class="pan-heat"></i><i class="pan-breath"></i>':kind==='summer-heat'?'<i class="hot-air"></i><i class="fan-shadow"></i>':kind==='remembered'?'<i class="memory-grain"></i>':'';}
 }
 function ready(node){const required=node.explore?.required||[];if(node.task&&!getState().flags['task_'+node.task]&&required.every(id=>getState().found.includes(id))){$('task-prompt').classList.remove('hidden');$('task-open').textContent=node.task==='papers'?'把图表收好':node.task==='torch'?'举起手电筒':'接着缝下去';$('task-open').onclick=()=>openTask(node.task);$('next').classList.add('hidden');return true;}return false;}
 function completeTask(id){getState().flags['task_'+id]=true;api.persist();taskSession++;closeModal();resume();sound('collect');}
 function openTask(id){taskSession++;if(id==='papers')paperTask(id);else if(id==='torch')torchTask(id);else stitchTask(id);}
 function paperTask(id){
  sound('paper');modal('二十四张图表','<div class="paper-task"><p>先把不同地方找到的纸页收在一起。</p><div class="paper-sorting">'+[['chart1','卧室'],['chart2','报刊架'],['chart3','电话桌']].map(([item,label],i)=>'<button class="loose-papers" data-paper="'+item+'" style="--angle:'+[-7,4,-3][i]+'deg" aria-label="把'+label+'找到的图表放入纸套"><img src="'+asset(VN.ITEMS[item].art)+'" alt=""><span>'+label+'</span></button>').join('')+'</div><button class="paper-folder" id="paper-folder" aria-label="收拢纸页"><img src="'+asset('a4-chart-folder')+'" alt="纸套"><span id="paper-count">还没有收好</span><i></i><i></i><i></i></button><button class="plain-button hidden" id="paper-done">收好图表</button></div>');
  const done=new Set();const collect=button=>{if(done.has(button.dataset.paper))return;done.add(button.dataset.paper);button.classList.add('paper-filed');sound('paper');$('paper-count').textContent=done.size===3?'二十四张，都在这里了。':'我把纸边理齐。';$('paper-folder').querySelectorAll('i').forEach((el,i)=>el.classList.toggle('filled',i<done.size));if(done.size===3)$('paper-done').classList.remove('hidden');};
  $('modal-content').querySelectorAll('[data-paper]').forEach(b=>{let start=null,moved=false;b.onclick=()=>{if(!moved)collect(b);};b.onpointerdown=e=>{start={x:e.clientX,y:e.clientY};moved=false;b.setPointerCapture(e.pointerId);};b.onpointermove=e=>{if(!start)return;const x=e.clientX-start.x,y=e.clientY-start.y;if(Math.hypot(x,y)>8)moved=true;b.style.translate=x+'px '+y+'px';};b.onpointerup=e=>{if(!start)return;const r=$('paper-folder').getBoundingClientRect();if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)collect(b);b.style.translate='';start=null;};b.onpointercancel=()=>{start=null;b.style.translate='';};});
  $('paper-folder').onclick=()=>{const b=$('modal-content').querySelector('[data-paper]:not(.paper-filed)');if(b)collect(b);};$('paper-done').onclick=()=>completeTask(id);
 }
 function stitchTask(id){
  const late=id.includes('return'),colors=late?['#677f83','#d8d0b6','#812f2b','#65734a']:['#777183','#d6b95d','#777183','#d6b95d'];
  modal('没有缝完的拼布','<div class="stitch-task"><p>'+(late?'信纸被放回抽屉。手里仍是一块接着一块的布。':'布头还卷在原处。我把它一点点铺平。')+'</p><div class="fabric-board '+(late?'fabric-late':'fabric-early')+'">'+colors.map((c,i)=>'<div class="fabric-piece piece-'+i+'" style="--cloth:'+c+'"></div>').join('')+'<svg viewBox="0 0 600 330" aria-hidden="true"><path class="sewn-line" d="M300 20V310M20 165H580"/></svg><i class="sewing-needle"></i><button id="stitch-hold" aria-label="按住缝下去">按住，接上一针</button></div><p id="stitch-caption">我把接缝仔细地对好。</p><button id="stitch-done" class="plain-button hidden">收起针线</button></div>');
  let held=false,elapsed=0,last=0;const ticket=taskSession,button=$('stitch-hold'),line=$('modal-content').querySelector('.sewn-line');
  function tick(t){if(ticket!==taskSession||!$('modal').open)return;if(!last)last=t;if(held)elapsed+=Math.min(80,t-last);last=t;const p=Math.min(1,elapsed/2400);line.style.clipPath='inset(0 0 '+(100*(1-p))+'% 0)';const tip=line.getPointAtLength(line.getTotalLength()*p),needle=$('modal-content').querySelector('.sewing-needle');needle.style.left=(tip.x/600*100)+'%';needle.style.top=(tip.y/330*100)+'%';needle.classList.toggle('needle-moving',held);if(p>=1){button.classList.add('hidden');$('stitch-caption').textContent=late?'一块布接上了。那些信里的事情，还留在抽屉里。':'我总算接好了这一小段。';$('stitch-done').classList.remove('hidden');return;}requestAnimationFrame(tick);}
  const begin=e=>{e.preventDefault();if(held)return;held=true;last=0;sound('stitch');},end=()=>held=false;button.onpointerdown=e=>{button.setPointerCapture(e.pointerId);begin(e);};button.onpointerup=button.onpointercancel=end;button.onkeydown=e=>{if(['Space','Enter'].includes(e.code))begin(e);};button.onkeyup=end;$('stitch-done').onclick=()=>completeTask(id);requestAnimationFrame(tick);button.focus();
 }
 function torchTask(id){
  modal('通气孔里面','<div class="torch-task"><div class="torch-view" id="torch-view" style="background-image:url(\''+asset('d2-hive')+'\')"><div class="torch-dark" id="torch-dark"></div><div class="torch-grip">按住开关，慢慢移动光束</div></div><p id="torch-caption">沿着滴落的地方，往深处照。</p><button class="plain-button" id="torch-steady">稳住手电</button><button class="plain-button hidden" id="torch-done">再看清一点</button></div>');
  let held=false,elapsed=0,last=0,x=.2,y=.65,assist=false,noise=null;const ticket=taskSession,view=$('torch-view'),dark=$('torch-dark');
  function point(e){const r=view.getBoundingClientRect();x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));}
  function tick(t){if(ticket!==taskSession||!$('modal').open){noise?.();return;}if(!last)last=t;const dt=Math.min(80,t-last);last=t;if(assist){x+=(.55-x)*.12;y+=(.45-y)*.12;held=true;}dark.style.setProperty('--beam-x',x*100+'%');dark.style.setProperty('--beam-y',y*100+'%');view.classList.toggle('torch-on',held);if(held&&Math.hypot(x-.55,y-.45)<.23)elapsed+=dt;const p=Math.min(1,elapsed/1800);dark.style.setProperty('--found',p);if(p>=1){held=false;noise?.();view.classList.add('torch-found');$('torch-caption').textContent='光照到了里面。';$('torch-steady').classList.add('hidden');$('torch-done').classList.remove('hidden');return;}requestAnimationFrame(tick);}
  view.onpointerdown=e=>{view.setPointerCapture(e.pointerId);point(e);held=true;sound('flashlight');noise=foley.listen('bees');};view.onpointermove=e=>{if(held)point(e);};view.onpointerup=view.onpointercancel=()=>{held=false;noise?.();};$('torch-steady').onclick=()=>{assist=true;sound('flashlight');noise=foley.listen('bees');};$('torch-done').onclick=()=>completeTask(id);requestAnimationFrame(tick);
 }
 async function shareNote(note,journal,back){
  for(const url of shareURLs)URL.revokeObjectURL(url);shareURLs=[];sound('paper');
  modal('导出手记图片','<p class="empty">正在把这一页排好……</p>');
  try{
   if(window.prepareLocalGameMedia)await window.prepareLocalGameMedia();
   const art={pregnancy:'hospital-backyard',dormitory:'d2-exterior',cafeteria:'d3-seawall-dusk'}[note.key]||'a4-finale-table',image=new Image();image.src=asset(art);await image.decode();
   const pieces=note.collage?await Promise.all(note.collage.map(async p=>{const im=new Image();im.src=asset(VN.ITEMS[p.id].art);await im.decode();return {...p,image:im};})):null;
   const measure=document.createElement('canvas').getContext('2d');measure.font='32px "Microsoft YaHei", sans-serif';const text=(journal.trim()||'书页合上以后，有些声音仍留在耳边。').replace(/\n{3,}/g,'\n\n'),lines=[];
   for(const paragraph of text.split('\n')){let line='';for(const ch of Array.from(paragraph)){if(measure.measureText(line+ch).width>932){lines.push(line);line='';}line+=ch;}lines.push(line||'');}
   const chunks=[];for(let i=0;i<lines.length;i+=48)chunks.push(lines.slice(i,i+48));
   for(let page=0;page<chunks.length;page++){
    const part=chunks[page],c=document.createElement('canvas');c.width=1200;c.height=Math.max(1650,1180+part.length*54);const ctx=c.getContext('2d');ctx.fillStyle='#e5d8b9';ctx.fillRect(0,0,c.width,c.height);
    const fadeEnd=670;
    ctx.save();ctx.beginPath();ctx.rect(0,0,c.width,fadeEnd);ctx.clip();
    if(pieces){
     ctx.fillStyle='#d8c5a1';ctx.fillRect(80,80,1040,fadeEnd-80);
     for(const p of pieces){
      const im=p.image,scale=Math.min(310/im.width,390/im.height),w=im.width*scale,h=im.height*scale;
      ctx.save();ctx.translate(80+p.x*1040,80+p.y*500);ctx.rotate((p.rotation||0)*Math.PI/180);
      ctx.scale(p.scale??1,p.scale??1);
      ctx.shadowColor='#4a311944';ctx.shadowBlur=15;ctx.shadowOffsetY=6;ctx.drawImage(im,-w/2,-h/2,w,h);
      const inscription=VN.ITEMS[p.id].inscription;
      if(inscription){
       ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.fillStyle='#59432d';ctx.textAlign='center';
       ctx.font=(inscription.replace(/\n/g,'').length<8?'26':'17')+'px KaiTi,serif';
       const lines=inscription.split('\n');
       for(let i=0;i<lines.length;i++)ctx.fillText(lines[i],0,-(lines.length-1)*11+i*22,170);
      }
      ctx.restore();
     }
    }else{
     const scale=Math.max(c.width/image.width,fadeEnd/image.height),w=image.width*scale,h=image.height*scale;
     ctx.drawImage(image,(c.width-w)/2,0,w,h);
    }
    const fade=ctx.createLinearGradient(0,440,0,fadeEnd);
    fade.addColorStop(0,'#e5d8b900');fade.addColorStop(1,'#e5d8b9');
    ctx.fillStyle=fade;ctx.fillRect(0,440,c.width,fadeEnd-440);ctx.restore();
    ctx.strokeStyle='#8c7549';ctx.lineWidth=2;ctx.strokeRect(45,45,1110,c.height-90);ctx.strokeStyle='#b5a074';ctx.strokeRect(58,58,1084,c.height-116);
    ctx.fillStyle='#665330';ctx.font='22px "Microsoft YaHei",sans-serif';ctx.fillText((note.collage?'留 在 书 页 之 外':'玩家读后手记')+(chunks.length>1?'  '+(page+1)+' / '+chunks.length:''),124,696);
    ctx.fillStyle='#332e22';ctx.font='44px KaiTi, "Microsoft YaHei",serif';let title=note.title;if(ctx.measureText(title).width>960)ctx.font='36px KaiTi,serif';ctx.fillText(title,120,775);ctx.fillRect(124,817,88,3);
    ctx.font='32px "Microsoft YaHei",sans-serif';ctx.fillStyle='#4b4231';for(let i=0;i<part.length;i++)ctx.fillText(part[i],128,900+i*54);
    const foot=c.height-190;ctx.strokeStyle='#aa9569';ctx.beginPath();ctx.moveTo(124,foot);ctx.lineTo(1076,foot);ctx.stroke();ctx.fillStyle='#796749';ctx.font='21px "Microsoft YaHei",sans-serif';
    ctx.fillText('互动网页解谜文游《妊娠日历》',124,foot+35);
    ctx.fillText('改编自《妊娠日历》 · 原著：（日）小川洋子',124,foot+69);
    ctx.fillText('互动改编：何日（@二级号，小红书号：5276147249）',124,foot+103);
    const blob=await new Promise(r=>c.toBlob(r,'image/png'));if(!blob)throw Error('导出失败');shareURLs.push(URL.createObjectURL(blob));c.width=c.height=1;await new Promise(r=>setTimeout(r,0));
   }
   let page=0;const show=()=>{modal('导出手记图片','<div class="share-preview"><img src="'+shareURLs[page]+'" alt="'+esc(note.title)+'读后手记"></div><div class="toolbar">'+(shareURLs.length>1?'<button class="plain-button" id="share-prev" '+(!page?'disabled':'')+'>上一张</button><span class="share-page">'+(page+1)+' / '+shareURLs.length+'</span><button class="plain-button" id="share-next" '+(page===shareURLs.length-1?'disabled':'')+'>下一张</button>':'')+'<a class="plain-button" id="share-save" download="'+esc(note.title)+'-手记'+(shareURLs.length>1?'-'+(page+1):'')+'.png" href="'+shareURLs[page]+'">保存图片</a><button class="plain-button" id="share-back">返回手记</button></div>');if(shareURLs.length>1){$('share-prev').onclick=()=>{page--;show();};$('share-next').onclick=()=>{page++;show();};}$('share-back').onclick=back;};show();
  }catch{modal('导出手记图片','<p class="empty">图片暂时没有排好，请再试一次。</p><button class="plain-button" id="share-back">返回手记</button>');$('share-back').onclick=back;}
 }

 function collage(){
  rememberObjects(getState());journey.collage.pieces=(journey.collage.pieces||[]).filter(p=>journey.objects.includes(p.id)).slice(0,3);journey.collage.text=String(journey.collage.text||'').slice(0,600);write('-journey',journey);
  if(!journey.objects.length){modal('拼一页手记','<p class="empty">还没有可以放上纸页的物品。等在故事里找到一些东西，再回来看看。</p>');return;}
  modal('拼一页手记','<p class="collage-intro">把一到三件物品摆到纸上，再选中要调整的一件。</p><div class="collage-layout"><div class="collage-paper" id="collage-paper"></div><div class="collage-picks" id="collage-picks">'+journey.objects.map(id=>'<button data-pick="'+id+'" aria-label="选择'+esc(VN.ITEMS[id].name)+'"><img src="'+asset(VN.ITEMS[id].art)+'" alt="">'+esc(VN.ITEMS[id].name)+'</button>').join('')+'</div></div><div class="collage-editor"><fieldset class="collage-adjust" id="collage-adjust"><legend>调整物品</legend><label for="collage-selection">当前物品</label><select id="collage-selection"></select><label for="collage-size">大小 <output id="collage-size-value" for="collage-size"></output></label><input id="collage-size" type="range" min="50" max="150" value="100"><label for="collage-angle">角度 <output id="collage-angle-value" for="collage-angle"></output></label><input id="collage-angle" type="range" min="-180" max="180" value="0"></fieldset><label for="collage-text">这些东西让我想起……</label><textarea id="collage-text" maxlength="600">'+esc(journey.collage.text)+'</textarea></div><div class="toolbar"><button class="plain-button" id="collage-export">导出这一页</button><button class="plain-button" id="collage-clear">重新摆放</button></div>');
  let selected=journey.collage.pieces.at(-1)?.id;
  const save=()=>write('-journey',journey);
  const paper=$('collage-paper'),pieceSelect=$('collage-selection');
  const size=$('collage-size'),angle=$('collage-angle');
  function selectPiece(id){
   const p=journey.collage.pieces.find(p=>p.id===id);
   selected=p?.id;
   $('collage-adjust').disabled=!p;
   pieceSelect.value=selected||'';
   size.value=Math.round((p?.scale??1)*100);
   angle.value=p?.rotation??0;
   $('collage-size-value').textContent=p?size.value+'%':'';
   $('collage-angle-value').textContent=p?angle.value+'°':'';
   paper.querySelectorAll('[data-piece]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.piece===selected)));
  }
  function renderPaper(){
   pieceSelect.innerHTML=journey.collage.pieces.map(p=>'<option value="'+p.id+'">'+esc(VN.ITEMS[p.id].name)+'</option>').join('')||'<option value="">请先摆放物品</option>';
   $('collage-paper').innerHTML=journey.collage.pieces.map(p=>'<button class="collage-object" data-piece="'+p.id+'" style="left:'+p.x*100+'%;top:'+p.y*100+'%;--rotation:'+(p.rotation||0)+'deg;--piece-scale:'+(p.scale??1)+'" aria-label="选择或移动'+esc(VN.ITEMS[p.id].name)+'"><img src="'+asset(VN.ITEMS[p.id].art)+'" alt="'+esc(VN.ITEMS[p.id].name)+'">'+(VN.ITEMS[p.id].inscription?'<span class="collage-inscription">'+esc(VN.ITEMS[p.id].inscription)+'</span>':'')+'</button>').join('');
   $('collage-picks').querySelectorAll('[data-pick]').forEach(b=>{const active=journey.collage.pieces.some(p=>p.id===b.dataset.pick);b.classList.toggle('chosen',active);b.setAttribute('aria-pressed',String(active));});
   $('collage-paper').querySelectorAll('[data-piece]').forEach(b=>{let held=false;const p=journey.collage.pieces.find(p=>p.id===b.dataset.piece);b.onfocus=b.onclick=()=>selectPiece(p.id);b.onpointerdown=e=>{selectPiece(p.id);held=true;b.setPointerCapture(e.pointerId);e.preventDefault();};b.onpointermove=e=>{if(!held)return;const r=$('collage-paper').getBoundingClientRect();p.x=Math.max(.14,Math.min(.86,(e.clientX-r.left)/r.width));p.y=Math.max(.36,Math.min(.68,(e.clientY-r.top)/r.height));b.style.left=p.x*100+'%';b.style.top=p.y*100+'%';};b.onpointerup=b.onpointercancel=()=>{held=false;save();};b.onkeydown=e=>{const delta=.03;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();e.stopPropagation();selectPiece(p.id);p.x=Math.max(.14,Math.min(.86,p.x+(e.key==='ArrowRight'?delta:e.key==='ArrowLeft'?-delta:0)));p.y=Math.max(.36,Math.min(.68,p.y+(e.key==='ArrowDown'?delta:e.key==='ArrowUp'?-delta:0)));b.style.left=p.x*100+'%';b.style.top=p.y*100+'%';save();}};});
   selectPiece(journey.collage.pieces.some(p=>p.id===selected)?selected:journey.collage.pieces.at(-1)?.id);
  }
  $('collage-picks').querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{const id=b.dataset.pick,i=journey.collage.pieces.findIndex(p=>p.id===id);if(i>=0)journey.collage.pieces.splice(i,1);else if(journey.collage.pieces.length<3){selected=id;journey.collage.pieces.push({id,x:[.27,.7,.48][journey.collage.pieces.length],y:[.5,.5,.55][journey.collage.pieces.length],rotation:[-7,5,-3][journey.collage.pieces.length]});}else{b.animate([{translate:'-3px 0'},{translate:'3px 0'},{translate:'0 0'}],{duration:180});return;}sound('paper');save();renderPaper();});
  $('collage-text').oninput=()=>{journey.collage.text=$('collage-text').value;save();};
  pieceSelect.onchange=()=>selectPiece(pieceSelect.value);
  size.oninput=angle.oninput=()=>{
   const p=journey.collage.pieces.find(p=>p.id===selected);
   if(!p)return;
   p.scale=Number(size.value)/100;
   p.rotation=Number(angle.value);
   const piece=paper.querySelector('[data-piece][aria-pressed="true"]');
   piece.style.setProperty('--piece-scale',p.scale);
   piece.style.setProperty('--rotation',p.rotation+'deg');
   $('collage-size-value').textContent=size.value+'%';
   $('collage-angle-value').textContent=angle.value+'°';
   save();
  };
  $('collage-clear').onclick=()=>{journey.collage.pieces=[];save();renderPaper();};$('collage-export').onclick=()=>{if(!journey.collage.pieces.length)return;shareNote({key:'collage',title:'我从书里带回的东西',collage:structuredClone(journey.collage.pieces)},journey.collage.text,collage);};renderPaper();
 }

 function transition(target,from){
  const el=$('chapter-transition'),second=key(target)==='dormitory';el.classList.toggle('dorm-film-transition',second);el.classList.toggle('sense-film-transition',!second);el.classList.remove('sensory-transition');
  $('chapter-preview').style.backgroundImage='url("'+asset(target.bg)+'")';$('chapter-reel').innerHTML=(second?'':'<div class="rain-field chapter-rain">'+rainDrops(false,true)+'</div>')+Array.from({length:8},(_,i)=>'<i style="--i:'+i+'"></i>').join('');$('chapter-to').textContent=target.chapter||target.date||'';$('chapter-from').textContent=from.chapter||from.date||'';
 }
 const finale=[
  {art:'a4-finale-table',rain:'soft',kind:'paper',title:'灯还亮着',text:'我把第三张纸放下。窗外的雨不知什么时候变小了。桌上只有一本书，和三张没有完全对齐的手记。'},
  {art:'a4-family-parlor',kind:'paper',title:'十二月二十九日',text:'她为了去医院，找了很久的体温表。二十四张纸，从卧室、报刊架和电话桌回到了一起。'},
  {art:'clinic-ultrasound',kind:'room',title:'一张照片',text:'我曾把那一小块黑色放到眼前。她说到肚子上的软膏，远比说到照片里的胎儿更仔细。'},
  {art:'kitchen-jam-close',kind:'boil',title:'一勺接着一勺',text:'有些气味让她无处可逃；后来，果酱又一锅一锅地熬好。想到风险、反复确认产地、把勺子递过去，都没有随着日历翻过而消失。'},
  {art:'corridor',kind:'wood',title:'门还在前面',text:'婴儿的哭声隔着门传来。我仍没有看见那个孩子。书停在她走向房间的那一步，没有把门后的情形交给我。'},
  {art:'d2-exterior',kind:'wind',title:'六年以后',text:'第二个故事里，也有人重新走回一个熟悉的地方。宿舍还在，许多原来应该响起的声音却已经没有了。'},
  {art:'a4-manager-room',kind:'paper',title:'幸福的学生生活',text:'表弟签下那句保证。他的眼镜框、先生漂亮的右脚、还没有喝凉的茶，当时都在可以看清的位置上。'},
  {art:'d2-student-room',kind:'room',title:'二月十三日',text:'后来，我看见了滑雪的箭头、留下的车票和摊开的数学笔记本。那些东西像是仍在等一个只出门片刻的人。'},
  {art:'a4-flower-blue',kind:'rain',rain:'soft',title:'一排不同的花',text:'一次次探访，花开成了不同的颜色。天花板上的圆也越来越大。两封信被收进抽屉，点心却一次次被带到宿舍。'},
  {art:'d2-hive',kind:'bees',title:'照见的东西',text:'手电筒照出了蜂巢，裂缝里流着蜂蜜。可看清一种液体，并没有让表弟回来，也没有找到那只握着H铅笔的左手。'},
  {art:'d3-house-mist',kind:'wind',title:'最后三周',text:'第三个故事开始时，一只温热的狗鼻子碰到了手背。婚礼还没有举行，旧房子里有收拾不完的东西。'},
  {art:'a4-catering-dusk',kind:'sea',title:'坐下来听',text:'我在纸箱上坐下，听一个还不知道姓名的人说话。他没有一开始就把自己的故事，整理成一个很容易听懂的样子。'},
  {art:'d3-pool-rain',rain:'outdoor',kind:'pool',title:'红色的泳帽',text:'水压住胸口，饭也咽不下去。那种拼命想融入其中的吃力，隔了很多年，才被他说给另一个人听。'},
  {art:'d3-hand-cg',kind:'wind',title:'没有被送回学校',text:'祖父没有先问他为什么逃学。那只平时不喜欢的、像油纸一样干燥的手，被他紧紧握住了。'},
  {art:'d3-roller-cg',kind:'cicada',title:'铁味之后',text:'机器早已停了。最初只是干燥的铁味，再等一会儿，仿佛有很远、很柔和的一点甜味回来。'},
  {art:'d3-telegram-night',kind:'paper',title:'晚安',text:'他后来学会了游泳，祖父却已经死了。听完这句话，她想回家，把那张电报再读一遍。纸的触感、字的形状、夜晚的空气，一起回到了手里。'},
  {art:'a4-finale-table',kind:'paper',title:'轮到书外的我',text:'我没有替他们补完没有说出的部分。可合上书的时候，再听见一只勺子碰到碗沿，已经和下午刚坐下时有些不同。'}
 ];
 function openFinale(start=0){
  $('title-screen').classList.add('hidden');
  closeModal();finalePaused=false;$('finale-pause').textContent='暂停回顾';finaleActive=true;finaleIndex=start;finaleRun++;$('finale').classList.remove('hidden');$('dialogue').classList.add('hidden');$('cast').classList.add('hidden');$('narrator').classList.add('hidden');$('companion').classList.add('hidden');$('menu-toggle').classList.add('hidden');$('next').classList.add('hidden');showFinaleSlide();
 }
 function showFinaleSlide(){
  clearTimeout(finaleTimer);const slide=finale[finaleIndex],el=$('finale');el.classList.remove('finale-card-arrive');void el.offsetWidth;el.classList.add('finale-card-arrive');el.dataset.phase=String(Math.floor(finaleIndex/5));$('finale-image').style.backgroundImage='url("'+asset(slide.art)+'")';$('finale-rain').innerHTML=slide.rain?rainDrops(false,slide.rain==='soft'):'';$('finale-title').textContent=slide.title;$('finale-text').textContent=slide.text;$('finale-progress').style.setProperty('--progress',(finaleIndex+1)/finale.length);$('finale-next').textContent=finaleIndex===finale.length-1?'留下这一页':'继续';$('finale-audio').textContent=String(finaleIndex+1).padStart(2,'0');const bed=slide.rain?(slide.kind==='pool'?'pool':'rain'):slide.kind;foley.mix('finale',['wood','paper'].includes(bed)?{}:{[bed]:.42});if(slide.kind==='wood')sound('stairs');
  const ticket=finaleRun;if(!finalePaused)finaleTimer=setTimeout(()=>{if(finaleActive&&ticket===finaleRun)advanceFinale();},Math.max(7200,slide.text.length*145));
 }
 function advanceFinale(){if(finaleIndex<finale.length-1){finaleIndex++;showFinaleSlide();}else endScreen();}
 function endScreen(){
  clearTimeout(finaleTimer);finaleActive=false;journey.endSeen=true;write('-journey',journey);foley.stop();$('finale').classList.add('hidden');$('end-screen').classList.remove('hidden');$('end-screen').style.setProperty('--end-art','url("'+asset('a4-finale-table')+'")');sound('turn');
  $('end-bookmarks').innerHTML=books.map((b,i)=>'<button '+(!noteLibrary.unlocked.includes(b.key)?'disabled ':'')+'data-end-note="'+b.key+'" style="--i:'+i+'"><span>第'+['一','二','三'][i]+'篇</span><strong>'+(noteLibrary.unlocked.includes(b.key)?esc(b.title):'？？？')+'</strong><small>留下的手记</small></button>').join('');$('end-bookmarks').querySelectorAll('button').forEach(b=>b.onclick=()=>api.openNote(b.dataset.endNote));
 }
 $('finale-pause').onclick=()=>{finalePaused=!finalePaused;$('finale-pause').textContent=finalePaused?'继续回顾':'暂停回顾';clearTimeout(finaleTimer);if(!finalePaused){const ticket=finaleRun;finaleTimer=setTimeout(()=>{if(finaleActive&&ticket===finaleRun)advanceFinale();},8500);}};
 $('chapters').onclick=()=>chapters();$('finale-next').onclick=()=>{clearTimeout(finaleTimer);advanceFinale();};$('finale-skip').onclick=endScreen;$('end-replay').onclick=()=>{$('end-screen').classList.add('hidden');openFinale();};$('end-chapters').onclick=()=>chapters();$('end-collage').onclick=collage;$('end-title').onclick=()=>{$('end-screen').classList.add('hidden');api.title();};
 $('modal').addEventListener('close',()=>{taskSession++;});
 $('stage').addEventListener('pointermove',e=>{const r=$('stage').getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;$('title-screen').style.setProperty('--pointer-x',x);$('title-screen').style.setProperty('--pointer-y',y);});
 return {isCinematic:()=>finaleActive||!$('end-screen').classList.contains('hidden'),advanceCinematic(){if(finaleActive){clearTimeout(finaleTimer);advanceFinale();}},chapters,collage,render,ready,rainDrops,openTask,shareNote,transition,resetProgress,archive:()=>structuredClone({reached:journey.reached,objects:journey.objects,endSeen:journey.endSeen,collage:journey.collage}),importProgress(value){if(!value||typeof value!=='object')return;for(const id of Array.isArray(value.reached)?value.reached:[])remember(id);rememberObjects({found:Array.isArray(value.objects)?value.objects:[]});journey.endSeen||=!!value.endSeen;write('-journey',journey);},finale:openFinale,diagnostics:()=>({reached:[...journey.reached],entries:Object.keys(journey.entries),endSeen:journey.endSeen,objects:[...journey.objects]}),clear(){taskSession++;finaleRun++;finaleActive=false;clearTimeout(finaleTimer);clearTimeout(effectTimer);lastStage='';lastRain='';$('rain-field').replaceChildren();$('stage').classList.remove('low-light');$('task-prompt').classList.add('hidden');$('finale').classList.add('hidden');$('end-screen').classList.add('hidden');$('experience-atmosphere').innerHTML='';}};
};
})();
