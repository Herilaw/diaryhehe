(() => {
'use strict';
window.createCafeteriaUI=function({$,asset,esc,modal,closeModal,getState,persist,resume,listenSound,makeRain,testAccess}){
 const records=VN.ECHO_RECORDS,listenings=VN.LISTENINGS;
 let atmosphere='',dogArt='',frame=0,stopSound=null,held=false,elapsed=0,lastTick=0,session=0,wipeKey='',wiped=0,wipeTimer=0;
 const known=()=>testAccess()?records:records.filter(r=>(getState().echoes||[]).includes(r.id));
 function observe(id){if(!records.some(r=>r.id===id))return;const s=getState();s.echoes??=[];if(!s.echoes.includes(id)){s.echoes.push(id);persist();}}
 function heard(id){return !!getState().flags['heard_'+id];}
 function stop(){session++;held=false;cancelAnimationFrame(frame);stopSound?.();stopSound=null;}
 function render(scene,node){
  const inside=scene.inside&&scene.story===CAFETERIA_SOURCE.title;
  $('echo-control').classList.toggle('hidden',!inside);$('listen-prompt').classList.add('hidden');$('glass-interaction').classList.add('hidden');if(!node.wipe)wipeKey='';
  $('stage').classList.toggle('story-three',!!inside);$('stage').classList.toggle('memory-mode',!!inside&&!!node.memory);
  if(node.echo)observe(node.echo);
  const art=inside&&!node.explore?node.dog:null;
  $('companion').classList.toggle('hidden',!art);
  if(art&&art!==dogArt){dogArt=art;$('companion').src=asset(art);}
  const kind=inside?(node.ambience||''):'';
  if(kind!==atmosphere){atmosphere=kind;const layer=$('sensory-layer');layer.dataset.kind=kind;
   let html='';
   if(kind==='mist')html='<i class="mist-bank"></i><i class="mist-bank mist-far"></i>';
   if(kind==='sea'||kind==='dusk')html='<i class="sea-shimmer"></i><i class="grass-shadow"></i>';
   if(kind==='machine')html='<i class="conveyor-glint"></i>'+Array.from({length:5},(_,i)=>'<i class="rising-steam" style="--i:'+i+'"></i>').join('');
   if(kind==='steam')html=Array.from({length:7},(_,i)=>'<i class="rising-steam old-steam" style="--i:'+i+'"></i>').join('');
   if(kind==='summer')html='<i class="factory-sunbeam"></i>'+Array.from({length:14},(_,i)=>'<i class="factory-dust" style="--i:'+i+'"></i>').join('');
   if(kind==='night')html='<i class="night-lamplight"></i>';
   layer.innerHTML=html;
  }
 }
 function ready(node){const needs=node.listen&&!heard(node.listen);$('listen-prompt').classList.toggle('hidden',!needs);if(needs){$('listen-open').onclick=()=>openListening(node.listen);$('next').classList.add('hidden');}if(node.wipe&&!getState().flags['wiped_'+node.wipe]){openWipe(node.wipe);$('next').classList.add('hidden');return true;}return !!needs;}
 function openWipe(id){
  const layer=$('glass-interaction'),canvas=$('glass-fog'),ctx=canvas.getContext('2d');layer.classList.remove('hidden');if(wipeKey===id)return;wipeKey=id;wiped=0;canvas.width=1100;canvas.height=430;
  ctx.globalCompositeOperation='source-over';ctx.fillStyle='#dce4d2b8';ctx.fillRect(0,0,1100,430);
  for(let i=0;i<70;i++){const x=(i*197+61)%1100,y=(i*83+31)%430;ctx.fillStyle='#f3f4df55';ctx.beginPath();ctx.ellipse(x,y,1+i%3,4+i%9,0,0,Math.PI*2);ctx.fill();}
  ctx.globalCompositeOperation='destination-out';ctx.lineWidth=82;ctx.lineCap='round';let previous=null;
  const point=e=>{const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*1100,y:(e.clientY-r.top)/r.height*430};};
  const done=()=>{if(wipeKey!==id||getState().flags['wiped_'+id])return;getState().flags['wiped_'+id]=true;persist();layer.classList.add('glass-clear');wipeTimer=setTimeout(()=>{layer.classList.add('hidden');layer.classList.remove('glass-clear');resume();},650);};
  const erase=p=>{if(!previous){previous=p;return;}ctx.beginPath();ctx.moveTo(previous.x,previous.y);ctx.lineTo(p.x,p.y);ctx.stroke();wiped+=Math.hypot(p.x-previous.x,p.y-previous.y);previous=p;if(wiped>1650)done();};
  canvas.onpointerdown=e=>{canvas.setPointerCapture(e.pointerId);previous=point(e);};canvas.onpointermove=e=>{if(previous)erase(point(e));};canvas.onpointerup=canvas.onpointercancel=()=>{previous=null;};
  $('wipe-help').onclick=()=>{for(let i=0;i<6;i++){previous={x:170+i*140,y:100};erase({x:230+i*140,y:330});}done();};
 }
 function open(){
  stop();const unlocked=known();modal('余响','<div class="echo-intro"><span class="echo-line"></span><p>有些声音，停下以后才听得见。</p></div><div class="echo-shelf">'+records.map((r,i)=>{const has=unlocked.some(q=>q.id===r.id);return '<button class="echo-card '+(has?'':'sealed')+'" data-echo="'+r.id+'" '+(!has?'disabled':'')+'><span class="echo-number">'+String(i+1).padStart(2,'0')+'</span>'+(has?'<img src="'+asset(r.art)+'" alt=""><strong>'+esc(r.title)+'</strong><small>'+esc(r.place)+'</small>':'<i class="sealed-ripple"></i><span>尚未留下余响</span>')+'</button>';}).join('')+'</div>');
  $('modal-content').querySelectorAll('[data-echo]:not(:disabled)').forEach(b=>b.onclick=()=>openRecord(b.dataset.echo));
 }
 const foleyLabel=kind=>({rain:'听门外的雨',pool:'听雨水和池水',machine:'听喷淋与轨道',metal:'听铝碗碰响',chain:'听狗链轻响',paper:'听展开的纸',cicada:'听工厂外的蝉'}[kind]||'听一会儿');
 function openRecord(id){
  stop();const r=known().find(r=>r.id===id);if(!r)return;
  modal(r.title,'<div class="echo-detail"><img src="'+asset(r.art)+'" alt="'+esc(r.title)+'">'+(id==='goodnight'?'<span class="echo-goodnight">晚　安</span>':'')+'<p>'+esc(r.text)+'</p><div class="echo-wave" aria-hidden="true">'+Array.from({length:30},(_,i)=>'<i style="--i:'+i+'"></i>').join('')+'</div></div><div class="toolbar"><button id="echo-sound" class="plain-button" aria-pressed="false">'+foleyLabel(r.sound)+'</button><button id="echo-back" class="plain-button">返回余响</button></div>');
  $('echo-back').onclick=open;$('echo-sound').onclick=()=>{const playing=$('echo-sound').getAttribute('aria-pressed')==='true';stopSound?.();stopSound=null;if(!playing)stopSound=listenSound(r.sound);$('echo-sound').setAttribute('aria-pressed',String(!playing));$('echo-sound').textContent=playing?(foleyLabel(r.sound)):'停下来';$('modal-content').classList.toggle('echo-playing',!playing);};
 }
 function openListening(id){
  const q=listenings[id];if(!q)return;stop();elapsed=0;lastTick=0;const ticket=session;
  modal(q.title,'<div class="listening" data-listening="'+id+'"><div class="listening-window"><img class="listening-present" src="'+asset(q.present)+'" alt="眼前的场景"><img class="listening-memory" src="'+asset(q.memory)+'" alt="讲述中的回忆">'+(id==='pool'?'<div class="rain-field listening-rain" aria-hidden="true">'+makeRain()+'</div>':'')+'<span class="listening-edge"></span><div class="listening-ripples"><i></i><i></i><i></i></div></div><div class="listening-words" aria-live="polite"><p>'+esc(q.lines[0])+'</p></div><button id="listen-hold" class="listen-hold" aria-label="按住倾听，也可按住空格键"><span class="listen-ring"></span><span id="listen-label">按住，听一会儿</span><small>松开可停下</small></button><button id="listen-confirm" class="plain-button hidden">记住这一刻</button></div>');
  const box=$('modal-content').querySelector('.listening'),button=$('listen-hold');
  function tick(now){if(ticket!==session||!$('modal').open)return;if(!lastTick)lastTick=now;if(held)elapsed=Math.min(2400,elapsed+Math.min(now-lastTick,80));lastTick=now;const p=elapsed/2400;box.style.setProperty('--heard',p);stopSound?.progress?.(p);box.classList.toggle('is-listening',held);const line=Math.min(2,Math.floor(p*3));box.querySelector('.listening-words p').textContent=q.lines[line];
   if(p>=1){held=false;stopSound?.();stopSound=null;button.classList.add('hidden');$('listen-confirm').classList.remove('hidden');box.classList.add('listening-complete');return;}frame=requestAnimationFrame(tick);
  }
  const start=e=>{e.preventDefault();if(elapsed>=2400||held)return;held=true;lastTick=0;stopSound=listenSound(q.sound);button.setAttribute('aria-pressed','true');};
  const pause=()=>{held=false;stopSound?.();stopSound=null;button.setAttribute('aria-pressed','false');};
  button.onpointerdown=e=>{button.setPointerCapture(e.pointerId);start(e);};button.onpointerup=pause;button.onpointercancel=pause;
  button.onkeydown=e=>{if(e.code==='Space'||e.code==='Enter')start(e);};button.onkeyup=e=>{if(e.code==='Space'||e.code==='Enter'){e.preventDefault();pause();}};button.onblur=pause;
  $('listen-confirm').onclick=()=>{getState().flags['heard_'+id]=true;observe(q.echo);persist();stop();closeModal();resume();};
  frame=requestAnimationFrame(tick);button.focus();
 }
 $('echo-control').onclick=open;$('modal').addEventListener('close',()=>{stop();$('modal-content').classList.remove('echo-playing');});
 return {render,ready,observe,heard,openListening,clear(){stop();clearTimeout(wipeTimer);wipeKey='';atmosphere='';dogArt='';$('echo-control').classList.add('hidden');$('listen-prompt').classList.add('hidden');$('glass-interaction').classList.add('hidden');$('glass-interaction').classList.remove('glass-clear');$('companion').classList.add('hidden');$('sensory-layer').innerHTML='';$('stage').classList.remove('story-three','memory-mode');}};
};
})();
