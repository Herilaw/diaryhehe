(() => {
'use strict';
window.createDormitoryUI=function({$,asset,esc,modal,getState,persist,sound,testAccess}){
 const records=VN.DORM_RECORDS||[],rooms=[['entry','玄关'],['manager','先生的房间'],['garden','花坛与通气孔'],['cousin','表弟的房门'],['student','那位学生的房间'],['outside','宿舍之外']];
 let atmosphere='',selectedRoom='manager';
 const state=()=>getState(),known=()=>testAccess()?records:records.filter(r=>(state().observations||[]).includes(r.id));
 function observe(id){if(!id||!records.some(r=>r.id===id))return;state().observations??=[];if(!state().observations.includes(id)){state().observations.push(id);persist();}}
 function render(scene,node){
  const inside=scene.story==='学生宿舍'&&scene.visit>0;
  $('dorm-control').classList.toggle('hidden',!inside);
  $('dorm-current').textContent=['','入住','草莓蛋糕','苹果派','雨天','最后的傍晚'][scene.visit]||'宿舍';
  if(node.record)observe(node.record);
  const kind=node.ambience??scene.ambience??(['jun15','may01'].includes(scene.id)?'rain':'');
  if(atmosphere!==kind){atmosphere=kind;let html='';
   if(kind==='storm')html+='<div class="storm-flash"></div>';
   if(kind.includes('bees'))html+='<i class="flying-bee bee-one"></i><i class="flying-bee bee-two"></i>';
   if(kind.includes('honey'))html+='<i class="honey-drip drip-one"></i><i class="honey-drip drip-two"></i><div class="honey-ripple"></div>';
   if(kind.includes('hum'))html+='<div class="humming-shadow"></div>';
   if(kind==='petals')html+=Array.from({length:8},(_,i)=>'<i class="falling-petal" style="--i:'+i+'"></i>').join('');
   if(kind==='phone')html+='<div class="phone-echo"></div>';
   $('weather').innerHTML=html;$('weather').dataset.kind=kind;
  }
  const location=node.bg||scene.bg,detail=$('scene-details');
  $('torch-beam').classList.toggle('hidden',!['d2-vent','d2-hive'].includes(location));
  if(inside&&['d2-manager-room','d2-manager-bed'].includes(location)&&!node.explore){const stage=node.sourceIds?.[0]>=449||node.ambience?.includes('honey')?4:scene.visit>=4?3:scene.visit>=2?2:1;detail.innerHTML='<img class="ceiling-stain stage-'+stage+'" src="'+asset('d2-stain-'+['','small','medium','rain','large'][stage])+'" alt="">';}else detail.innerHTML='';
 }
 function open(room=selectedRoom){
  selectedRoom=room;const observations=known(),list=observations.filter(r=>r.room===room),s=state();
  const accessible=r=>testAccess()||r==='entry'||observations.some(o=>o.room===r)||r==='cousin'&&s.visited.includes('d2-search')||r==='outside'&&s.visited.includes('d2-leave');
  const compareButtons=['stain','flower'].map(group=>observations.filter(r=>r.group===group)).filter(a=>a.length>1).map(a=>'<button class="plain-button" data-compare="'+a[0].group+'">'+(a[0].group==='stain'?'对照天花板的痕迹':'对照花坛')+'</button>').join('');
  modal('宿舍探访','<div class="dorm-ledger"><div class="dorm-building"><div class="dorm-roof"></div><div class="dorm-floor unknown"><span>三楼</span><i></i><i></i><i></i></div><div class="dorm-floor"><span>二楼</span>'+['cousin','student'].map(id=>'<button data-room-note="'+id+'" '+(!accessible(id)?'disabled':'')+' class="'+(id===room?'selected':'')+'">'+(id==='cousin'?'表弟的房门':'那位学生的房间')+'</button>').join('')+'</div><div class="dorm-floor"><span>一楼</span>'+['entry','manager'].map(id=>'<button data-room-note="'+id+'" '+(!accessible(id)?'disabled':'')+' class="'+(id===room?'selected':'')+'">'+rooms.find(r=>r[0]===id)[1]+'</button>').join('')+'</div><div class="dorm-ground"><button data-room-note="garden">花坛与通气孔</button><button data-room-note="outside">宿舍之外</button></div></div><div class="dorm-notes"><h3>'+esc(rooms.find(r=>r[0]===room)?.[1]||'探访')+'</h3>'+(room==='entry'?'<img class="ledger-room-image" src="'+asset('d2-entry')+'" alt="玄关"><p>公用电话、鞋柜与食堂对面的房门。</p>':'')+(list.length?'<div class="dorm-record-list">'+list.map(r=>'<button data-record="'+r.id+'"><img src="'+asset(r.art)+'" alt=""><span>'+esc(r.label)+'</span></button>').join('')+'</div>':room==='entry'?'':'<p class="empty">这里还没有留下记录。</p>')+'</div></div><div class="toolbar">'+compareButtons+'</div>');
  $('modal-content').querySelectorAll('[data-room-note]').forEach(b=>b.onclick=()=>open(b.dataset.roomNote));
  $('modal-content').querySelectorAll('[data-record]').forEach(b=>b.onclick=()=>showRecord(b.dataset.record));
  $('modal-content').querySelectorAll('[data-compare]').forEach(b=>b.onclick=()=>compare(b.dataset.compare));
 }
 function showRecord(id){const r=known().find(r=>r.id===id);if(!r)return;modal(r.label,'<div class="record-detail"><img src="'+asset(r.art)+'" alt="'+esc(r.label)+'"><p>'+esc(r.caption)+'</p></div><button class="plain-button" id="record-back">返回探访记录</button>');$('record-back').onclick=()=>open(r.room);}
 function compare(group){
  const versions=known().filter(r=>r.group===group).sort((a,b)=>a.stage-b.stage);if(versions.length<2)return;
  modal(group==='stain'?'天花板的痕迹':'花坛','<div class="compare-select"><label>先前<select id="compare-old">'+versions.slice(0,-1).map((r,i)=>'<option value="'+i+'">'+esc(r.label)+'</option>').join('')+'</select></label><label>后来<select id="compare-new">'+versions.slice(1).map((r,i)=>'<option value="'+(i+1)+'" '+(i===versions.length-2?'selected':'')+'>'+esc(r.label)+'</option>').join('')+'</select></label></div><div class="compare-stage '+group+'"><img id="compare-under" alt="先前"><div id="compare-over"><img alt="后来"></div><i id="compare-line"></i></div><input id="compare-slider" class="compare-slider" type="range" min="0" max="100" value="50" aria-label="拖动对照先前与后来的变化"><div class="compare-captions"><p id="compare-caption-old"></p><p id="compare-caption-new"></p></div><button class="plain-button" id="compare-back">返回探访记录</button>');
  const update=()=>{const old=versions[Number($('compare-old').value)],next=versions[Number($('compare-new').value)];$('compare-under').src=asset(next.art);$('compare-over').querySelector('img').src=asset(old.art);$('compare-caption-old').textContent=old.caption;$('compare-caption-new').textContent=next.caption;};
  $('compare-old').onchange=update;$('compare-new').onchange=update;update();
  $('compare-slider').oninput=e=>{const value=e.target.value;$('compare-over').style.clipPath='inset(0 '+(100-value)+'% 0 0)';$('compare-line').style.left=value+'%';};$('compare-back').onclick=()=>open(group==='stain'?'manager':'garden');
 }
 $('dorm-control').onclick=()=>open();
 $('stage').addEventListener('pointermove',e=>{const r=$('stage').getBoundingClientRect();$('torch-beam').style.setProperty('--light-x',((e.clientX-r.left)/r.width*100)+'%');$('torch-beam').style.setProperty('--light-y',((e.clientY-r.top)/r.height*100)+'%');});
 return {render,open,observe,clear(){atmosphere='';$('dorm-control').classList.add('hidden');$('scene-details').innerHTML='';$('torch-beam').classList.add('hidden');}};
};
})();
