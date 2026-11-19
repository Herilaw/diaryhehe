(() => {
'use strict';
window.createS2UI = function({ system, data, asset, modal, closeModal, sound, toast, enterBook, getBook, suspend, resume, notebooks, collage, isTitle, canResume }) {
  const c = data.copy;
  const esc = value => String(value).replace(/[&<>"']/g,char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const root = document.getElementById('s2-hub');
  const bookOf = key => data.books.find(book => book.key === key);
  const artOf = key => asset(window.VN.ITEMS[key]?.art || key);
  let opened = false, selected = 'pregnancy', tab = 'desk', intent = null, chosenPiece = null, signature = '', drag = null;
  function button(text,action,value='',extra='') { return '<button type="button" data-s2="'+action+'" data-value="'+esc(value)+'" '+extra+'>'+esc(text)+'</button>'; }
  function showText(title,paragraphs,buttons='') { modal(title,paragraphs.map(text=>'<p class="s2-copy">'+esc(text)+'</p>').join('')+buttons); }
  function finishDrag() {
    if (!drag) return;
    window.removeEventListener('pointermove',drag.move);
    window.removeEventListener('pointerup',drag.up);
    window.removeEventListener('pointercancel',drag.cancel);
    drag.element.remove(); drag = null;
    root.querySelectorAll('.s2-cell.near').forEach(el=>el.classList.remove('near'));
  }
  function close() { const wasOpen=opened;finishDrag(); opened=false; intent=null; root.classList.add('hidden'); root.replaceChildren();if(wasOpen)resume(); }
  function readBook() {
    if (!system.available(selected)||!system.ready(selected)) return;
    const continuation = intent?.key === selected ? intent.callback : canResume(selected)?()=>{}:()=>enterBook(selected);
    close(); continuation();
  }
  function intro() {
    showText(c.introTitle,c.introLines,'<div class="toolbar">'+button(c.introContinue,'intro-done')+'</div>');
    document.getElementById('modal-content').querySelector('[data-s2=intro-done]').onclick=()=>{system.introSeen();closeModal();render(true);};
  }
  function open(key=getBook(),callback=null,initialTab=null) {
    selected=bookOf(key)?key:'pregnancy'; tab=initialTab||(system.ready(selected)?'puzzle':'desk'); chosenPiece=null;
    intent=callback?{key:selected,callback}:null; opened=true; suspend(); closeModal(); root.classList.remove('hidden'); signature=''; render(true);
    if(!system.snapshot().introSeen)intro();
  }
  function eventWindow() {
    const trip=system.snapshot().trip, event=data.events.find(event=>event.id===trip?.event);
    if(!trip||!event)return;
    if(trip.choice!==null){showText(event.title,[event.choices[trip.choice].response]);return;}
    showText(event.title,[event.body],'<div class="s2-event-options">'+event.choices.map((choice,index)=>button(choice.text,'event-choice',index)).join('')+'</div>');
    document.getElementById('modal-content').querySelectorAll('[data-s2=event-choice]').forEach(el=>el.onclick=()=>{
      if(!system.choose(Number(el.dataset.value)))return;
      sound('paper');showText(event.title,[event.choices[Number(el.dataset.value)].response]);
    });
  }
  function prepareWindow(kind) {
    const state=system.snapshot();
    modal(kind==='main'?c.mainSlot:c.snackSlot,'<div class="s2-supply-list">'+data.supplies.filter(item=>item.kind===kind).map(item=>{
      const equipped=state.equipped[kind]===item.id;
      return '<section class="s2-supply"><span class="s2-paper-icon" aria-hidden="true">'+(kind==='main'?'〰':'⌁')+'</span><div><h3>'+esc(item.name)+'</h3><p>'+esc(item.desc)+'</p><small>'+esc(c.stock)+' '+state.inventory[item.id]+'</small></div><div class="s2-supply-actions">'+button(c.buy+' · '+item.price+' '+c.ink,'buy',item.id)+button(equipped?c.remove:c.choose,equipped?'unequip':'equip',item.id)+'</div></section>';
    }).join('')+'</div>');
    document.getElementById('modal-content').querySelectorAll('[data-s2]').forEach(el=>el.onclick=()=>{
      const item=data.supplies.find(item=>item.id===el.dataset.value);
      if(el.dataset.s2==='buy'){
        if(!system.buy(item.id)){toast(c.notEnough);return;}sound('collect');
      }else{
        if(!system.equip(kind,el.dataset.s2==='unequip'?null:item.id)){toast(system.snapshot().trip?c.chooseLocked:c.inventoryEmpty);return;}
        sound('paper');
      }
      prepareWindow(kind);
    });
  }
  function pieceSvg(book,cell,prefix) {
    const geo=window.S2_JIGSAW.buildGeometry(book.seed,book.grid), row=Math.floor(cell/book.grid), col=cell%book.grid;
    const bb=window.S2_JIGSAW.pieceBBox(geo,row,col), path=window.S2_JIGSAW.piecePath(geo,row,col), id=prefix+'-'+book.key+'-'+cell;
    return '<svg viewBox="'+[bb.x,bb.y,bb.w,bb.h].join(' ')+'" aria-hidden="true"><defs><clipPath id="'+id+'"><path d="'+path+'"/></clipPath></defs><image href="'+esc(asset(book.art))+'" x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" clip-path="url(#'+id+')"/><path d="'+path+'" fill="none" stroke="#e5cea8" stroke-width=".4"/></svg>';
  }
function readingLabel(book,progress) {
  return !intent&&canResume(book.key)?c.continueReading:progress.read?c.reread:c.enter;
}
function flowSteps(active) {
  const labels = [c.stepPrepare, c.stepTravel, c.stepPuzzle, c.stepRead];
  return '<ol class="s2-steps" aria-label="'+esc(c.tutorial)+'">'+labels.map((label,index)=>
    `<li class="${index===active?'current':index<active?'done':''}" ${index===active?'aria-current="step"':''}><span>${index<active?'✓':String(index+1).padStart(2,'0')}</span>${esc(label)}</li>`
  ).join('')+'</ol>';
}

function pageHeading(book, progress) {
  const total = book.grid ** 2;
  return `<div class="s2-page-heading"><div><span class="s2-book-label">${esc(book.label)}</span><h3>${esc(book.title)}</h3></div><div class="s2-page-progress"><span>${esc(progress.read?c.completed:c.fragmentLabel)}</span><strong>${progress.fragments}<small> / ${total}</small></strong><i style="--found:${progress.fragments/total*100}%" aria-hidden="true"></i></div></div>`;
}

function preparation(state) {
  return `<div class="s2-equip">${[['main',c.mainSlot],['snack',c.snackSlot]].map(([kind,label])=>{
    const item = data.supplies.find(item=>item.id===state.equipped[kind]);
    return `<button type="button" data-s2="prepare" data-value="${kind}"><span class="s2-slot-mark" aria-hidden="true">${kind==='main'?'01':'02'}</span><span><small>${esc(label)}${kind==='snack'?' · '+esc(c.optional):''}</small><strong>${esc(item?.name||(kind==='main'?c.needMain:c.noSnack))}</strong></span><span class="s2-slot-arrow" aria-hidden="true">↗</span></button>`;
  }).join('')}</div>`;
}

function puzzleView(state, book) {
  const progress = state.books[book.key];
  const geo = window.S2_JIGSAW.buildGeometry(book.seed,book.grid);
  const available = geo.order.slice(0,progress.fragments).filter(cell=>!progress.placed.includes(cell));
  const placed = progress.placed.map(cell=>{
    const bb=window.S2_JIGSAW.pieceBBox(geo,Math.floor(cell/book.grid),cell%book.grid);
    return `<span class="s2-board-piece" style="left:${bb.x}%;top:${bb.y}%;width:${bb.w}%;height:${bb.h}%">${pieceSvg(book,cell,'board')}</span>`;
  }).join('');
  const cells=Array.from({length:book.grid**2},(_,cell)=>`<button type="button" class="s2-cell" data-cell="${cell}" style="left:${cell%book.grid*100/book.grid}%;top:${Math.floor(cell/book.grid)*100/book.grid}%;width:${100/book.grid}%;height:${100/book.grid}%" aria-label="${esc(c.target)} ${cell+1}" ${progress.placed.includes(cell)?'disabled':''}></button>`).join('');
  const ready=system.ready(book.key), image=progress.read?book.after:book.art;
  return `<div class="s2-puzzle-panel">${pageHeading(book,progress)}${flowSteps(ready?3:2)}<div class="s2-puzzle-heading"><p class="s2-help">${esc(ready?c.puzzleReady:c.puzzleHint)}</p>${ready?button(readingLabel(book,progress),'read','','class="s2-primary"'):''}</div><div class="s2-puzzle-workbench ${ready?'complete':''}"><div class="s2-board-frame ${ready?'ready':''}"><div class="s2-board" style="--board-art:url('${esc(asset(image))}')">${ready?`<img class="s2-whole-art" src="${esc(asset(image))}" alt="${esc(book.title)}">`:placed+cells}</div></div><div class="s2-tray" role="group" aria-label="${esc(c.piece)}">${available.map(cell=>`<button type="button" class="s2-tray-piece ${chosenPiece===cell?'selected':''}" data-piece="${cell}" aria-label="${esc(c.piece)} ${cell+1}" aria-pressed="${chosenPiece===cell}">${pieceSvg(book,cell,'tray')}</button>`).join('')}</div></div>${!ready&&progress.fragments<book.grid**2?`<p class="s2-help s2-missing">${esc(c.puzzleMissing)}</p>`:''}</div>`;
}

function deskView(state, book) {
  const progress = state.books[book.key];
  const trip = state.trip;
  const ready = system.ready(book.key);
  const piecesComplete = progress.fragments === book.grid ** 2;
  let step = 0;
  let hint = !state.equipped.main ? c.hintPrepare : state.energy<15 ? c.needEnergy : c.hintDepart;
  let action = button(!state.equipped.main?c.prepareMain:c.depart,!state.equipped.main?'prepare':'depart',!state.equipped.main?'main':'','class="s2-primary"');
  let body = preparation(state);
  if (state.energy<15 && state.equipped.main) action=button(c.rest,'rest','','class="s2-primary"');
  if (trip) {
    step = 1;
    hint = trip.status==='countdown'?c.hintPacking:trip.status==='returned'?c.hintReturned:trip.choice===null?c.hintAway:c.hintReturning;
    const status = trip.status==='countdown'?c.packing:trip.status==='returned'?c.returned:c.away;
    action = trip.status==='returned' ? button(c.receive,'claim','','class="s2-primary"')
      : trip.status==='away' && trip.choice===null ? button(c.tripObserve,'event','','class="s2-primary"')
      : button(trip.status==='countdown'?status:c.waitingReturn,'event','','class="s2-primary" disabled');
    body = `<div class="s2-trip"><div class="s2-trip-caption"><span><i aria-hidden="true"></i>${esc(status)}</span><small>${esc(bookOf(trip.book).label)}</small></div><progress id="s2-trip-progress" max="100" value="0" aria-label="${esc(c.tripProgress)}"></progress><div class="s2-trip-bottom"><span>${esc(c.tripTime)}</span><strong id="s2-trip-time"></strong></div>${trip.choice!==null||trip.status==='returned'?'<div class="s2-actions">'+button(trip.choice===null?c.tripObserve:c.tripSeen,'event')+'</div>':''}</div>`;
  } else if (ready || piecesComplete) {
    step = ready ? 3 : 2;
    hint = ready ? !intent&&canResume(book.key)?c.hintContinue:progress.read?c.hintReread:c.hintEnter : c.hintPuzzle;
    action = button(ready?(readingLabel(book,progress)):c.tabPuzzle,ready?'read':'puzzle','','class="s2-primary"');
    body = `<details class="s2-repeat-preparation"><summary>${esc(c.repeatTrip)}</summary>${preparation(state)}<div class="s2-actions">${button(c.depart,'depart','','class="s2-secondary" '+(!state.equipped.main||state.energy<15?'disabled':''))}</div></details>`;
  }
  return `<div class="s2-desk-panel">${pageHeading(book,progress)}${flowSteps(step)}<div class="s2-next-step"><span>${esc(c.nextStep)}</span><p>${esc(hint)}</p></div>${body}<div class="s2-action-footer">${action}</div></div>`;
}
    function recordsView(state,book) {
    return '<h3>'+esc(c.clueTitle)+'</h3><p class="s2-help">'+esc(c.clueHint)+'</p><div class="s2-record-grid">'+data.records.filter(record=>record.book===book.key).map(record=>{
      const known=state.records.includes(record.id);
      return '<button type="button" class="s2-record '+(known?'known':'')+'" data-s2="record" data-value="'+record.id+'" '+(!known?'disabled':'')+'>'+(known?'<img src="'+esc(artOf(record.art))+'" alt="">':'<span class="s2-unknown">？</span>')+'<strong>'+esc(known?record.title:c.locked)+'</strong><small>'+esc(known?c.clueOpen:c.clueLocked)+'</small></button>';
    }).join('')+'</div><div class="s2-guide-notes">'+data.guideNotes.filter(note=>state.guide.includes(note.id)).map(note=>'<details><summary>'+esc(note.title)+'</summary><p>'+esc(note.body)+'</p></details>').join('')+'</div><div class="s2-actions">'+button(c.noteLink,'notebooks')+button(c.collageLink,'collage')+'</div>'+(system.full()?button(state.completeSeen?c.fullRepeat:c.fullButton,'full','','class="s2-primary"'):'');
  }
  function albumView(state) {
    return '<h3>'+esc(c.albumTitle)+'</h3>'+(!state.photos.length?'<p class="s2-copy">'+esc(c.albumEmpty)+'</p>':'<div class="s2-album-grid">'+state.photos.map((id,index)=>'<article><button type="button" class="s2-photo" data-s2="zoom" data-value="'+id+'" aria-label="'+esc(c.albumZoom)+'"><img src="'+esc(asset(id))+'" alt=""></button><div>'+button('←','photo-prev',id,'aria-label="'+esc(c.albumPrev)+'" '+(index===0?'disabled':''))+button(c.albumRemove,'photo-remove',id)+button('→','photo-next',id,'aria-label="'+esc(c.albumNext)+'" '+(index===state.photos.length-1?'disabled':''))+'</div></article>').join('')+'</div>');
  }
function render(force=false) {
  if(!opened)return;
  const state=system.snapshot(), book=bookOf(selected);
  const next=JSON.stringify([selected,tab,state.books,state.trip,state.inventory,state.equipped,state.records,state.photos,state.guide,state.introSeen,state.completeSeen,state.energy>=15,chosenPiece]);
  if(!force&&signature===next){updateStats(state);return;}
  signature=next;finishDrag();
  const focus=document.activeElement?.closest('[data-s2]');
  const focusAction=focus&&root.contains(focus)?[focus.dataset.s2,focus.dataset.value]:null;
  const oldPanel=root.querySelector('.s2-panel');
  const viewKey=selected+':'+tab;
  const sameView=root.dataset.view===viewKey;
  const scrollTop=sameView?oldPanel?.scrollTop||0:0;
  const repeatOpen=sameView&&!!root.querySelector('.s2-repeat-preparation')?.open;
  root.dataset.view=viewKey;
  const paw='<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="13" cy="16" rx="4" ry="6" transform="rotate(-25 13 16)"/><ellipse cx="23" cy="11" rx="4" ry="6"/><ellipse cx="33" cy="15" rx="4" ry="6" transform="rotate(25 33 15)"/><ellipse cx="39" cy="25" rx="3.5" ry="5" transform="rotate(35 39 25)"/><path d="M12 34c0-6 7-15 12-15s14 9 14 15c0 9-9 6-13 6s-13 3-13-6Z"/></svg>';
  root.innerHTML=`<div class="s2-desk-background" style="background-image:url('${esc(asset('s2-reading-desk'))}')"></div><div class="s2-desk-shade"></div>
    <header class="s2-header"><div class="s2-title-plaque"><span class="s2-brand-mark">${paw}</span><div><span class="s2-overline">${esc(c.deskEyebrow)}</span><h2>${esc(c.deskTitle)}</h2></div></div><div class="s2-header-actions">${button(c.helpTitle,'help','','class="s2-help-button"')}${button('↩ '+(isTitle()?c.titleClose:c.close),'close','','class="s2-close"')}</div></header>
    <div class="s2-layout"><aside class="s2-companion-panel"><div class="s2-cat-space"><button type="button" id="s2-cat" data-s2="care" aria-label="${esc(c.care)}"><img id="s2-cat-image" alt="${esc(c.catAlt)}"></button><p id="s2-cat-status"></p><div class="s2-cat-actions">${button(c.care,'care')}${button(c.rest,'rest')}</div></div><div class="s2-resource-card"><div class="s2-stats"><span class="s2-ink-stat">${esc(c.ink)}<b id="s2-ink"></b></span><span>${esc(c.energy)}<b id="s2-energy"></b></span><span>${esc(c.affection)}<b id="s2-affection"></b></span></div><progress id="s2-energy-meter" max="100" value="${state.energy}" aria-label="${esc(c.energy)}"></progress>${button(c.collect,'collect','','id="s2-collect"')}</div></aside>
    <section class="s2-workspace"><nav class="s2-book-tabs" aria-label="${esc(c.chapterLabel)}">${data.books.map(item=>button(system.available(item.key)?item.label:c.locked,'book',item.key,'class="'+(selected===item.key?'selected':'')+'" aria-pressed="'+(selected===item.key)+'" '+(!system.available(item.key)?'disabled':''))).join('')}</nav><div class="s2-paper-sheet"><nav class="s2-view-tabs" aria-label="${esc(c.deskTitle)}">${[['desk',c.tabDesk],['puzzle',c.tabPuzzle],['records',c.tabRecords],['album',c.tabAlbum]].map(([value,label])=>button(label,'tab',value,'aria-pressed="'+(tab===value)+'"')).join('')}</nav><div class="s2-panel">${tab==='puzzle'?puzzleView(state,book):tab==='records'?recordsView(state,book):tab==='album'?albumView(state):deskView(state,book)}</div></div></section></div>`;
  if(repeatOpen&&root.querySelector('.s2-repeat-preparation'))root.querySelector('.s2-repeat-preparation').open=true;
  root.querySelector('.s2-panel').scrollTop=scrollTop;
  updateStats(state);
  if(focusAction){const match=[...root.querySelectorAll('[data-s2]')].find(el=>el.dataset.s2===focusAction[0]&&el.dataset.value===focusAction[1]);match?.focus({preventScroll:true});}
}
  function updateStats(state) {
    for(const [id,value] of [['s2-ink',state.ink],['s2-energy',state.energy],['s2-affection',state.affection]])document.getElementById(id).textContent=Math.floor(value);
    document.getElementById('s2-energy-meter').value=state.energy;
    const trip=state.trip,time=Date.now();
    const image=trip?.status==='returned'?'s2-cat-return':state.restUntil>time?'s2-cat-rest':'s2-cat-idle';
    const cat=document.getElementById('s2-cat-image');if(cat.dataset.key!==image){cat.src=asset(image);cat.dataset.key=image;}
    root.classList.toggle('s2-cat-away',!!trip&&trip.status==='away');
    document.getElementById('s2-cat-status').textContent=trip?trip.status==='countdown'?c.packing:trip.status==='away'?c.away:c.returned:state.restUntil>time?c.restStatus:c.home;
    const collect=document.getElementById('s2-collect');collect.disabled=state.stock===0;
    collect.textContent=c.collect+(state.stock?' · '+state.stock*data.tuning.inkPerStock:'');
    const bar=document.getElementById('s2-trip-progress');
    if(bar){
      const start=trip.status==='countdown'?trip.start:trip.departAt,end=trip.status==='countdown'?trip.departAt:trip.endAt;
      bar.value=trip.status==='returned'?100:Math.max(0,Math.min(100,(time-start)/Math.max(1,end-start)*100));
      document.getElementById('s2-trip-time').textContent=trip.status==='returned'?c.returned:Math.max(0,Math.ceil((end-time)/1000))+' s';
    }
  }
  function place(cell) {
    if(chosenPiece===null)return;
    if(cell!==chosenPiece){sound('failure');toast(c.puzzleWrong);return;}
    const book=selected,success=system.place(book,cell);chosenPiece=null;
    if(success)sound('collect');render(true);
  }
  root.addEventListener('click',event=>{
    const cell=event.target.closest('[data-cell]');if(cell){place(Number(cell.dataset.cell));return;}
    const piece=event.target.closest('[data-piece]');if(piece){chosenPiece=Number(piece.dataset.piece);render(true);return;}
    const control=event.target.closest('[data-s2]');if(!control||control.disabled)return;
    const action=control.dataset.s2,value=control.dataset.value;
    if(action==='close'){close();return;}
    if(action==='book'){if(system.available(value)){selected=value;chosenPiece=null;render(true);}return;}
    if(action==='tab'){tab=value;chosenPiece=null;render(true);return;}
    if(action==='puzzle'){tab='puzzle';render(true);return;}
    if(action==='read'){readBook();return;}
    if(action==='collect'){if(system.collect())sound('paper');else toast(c.collectEmpty);return;}
    if(action==='care'||action==='rest'){const ok=system.care(action==='rest');toast(ok?action==='rest'?c.resting:c.careDone:system.snapshot().trip?c.careAway:c.careWait);if(ok)sound('tap');return;}
    if(action==='prepare'){prepareWindow(value);return;}
    if(action==='depart'){if(system.depart(selected))sound('paper');return;}
    if(action==='event'){eventWindow();return;}
    if(action==='claim'){const reward=system.claim();if(!reward)return;sound('collect');tab='puzzle';render(true);showText(c.rewardTitle,[c.rewardBody,...(reward.guideDrop?[c.rewardGuide]:[])]);return;}
    if(action==='record'){const record=data.records.find(record=>record.id===value);if(system.snapshot().records.includes(value))modal(record.title,'<img class="s2-record-detail" src="'+esc(artOf(record.art))+'" alt=""><p class="s2-copy">'+esc(record.body)+'</p>');return;}
    if(action==='notebooks'){notebooks();return;}
    if(action==='collage'){collage();return;}
    if(action==='full'){system.markComplete();showText(c.fullTitle,c.fullLines);return;}
    if(action==='help'){showText(c.deskTitle,[c.tutorial,c.newRound]);return;}
    if(action==='zoom'){modal(c.albumZoom,'<img class="s2-zoom-image" src="'+esc(asset(value))+'" alt="">');return;}
    if(action==='photo-remove')system.removePhoto(value);
    if(action==='photo-prev')system.movePhoto(value,-1);
    if(action==='photo-next')system.movePhoto(value,1);
  });
  root.addEventListener('pointerdown',event=>{
    const piece=event.target.closest('[data-piece]');if(!piece||event.button>0)return;
    const cell=Number(piece.dataset.piece),book=bookOf(selected),board=root.querySelector('.s2-board');
    if(!board)return;
    finishDrag();let moved=false;
    const rect=board.getBoundingClientRect(),size=rect.width/book.grid,element=document.createElement('div');
    element.className='s2-drag-piece';element.innerHTML=pieceSvg(book,cell,'drag');element.style.width=size*1.82+'px';element.style.height=size*1.82+'px';
    document.body.append(element);
    const near=(x,y)=>Math.hypot(x-(rect.left+(cell%book.grid+.5)*size),y-(rect.top+(Math.floor(cell/book.grid)+.5)*size))<=size*.38;
    const move=point=>{
      moved||=Math.hypot(point.clientX-event.clientX,point.clientY-event.clientY)>6;
      element.style.left=point.clientX+'px';element.style.top=point.clientY+'px';
      root.querySelectorAll('.s2-cell').forEach(target=>target.classList.toggle('near',Number(target.dataset.cell)===cell&&near(point.clientX,point.clientY)));
    };
    const up=point=>{const valid=near(point.clientX,point.clientY);finishDrag();if(moved){point.preventDefault();chosenPiece=cell;if(valid)place(cell);else{sound('close');render(true);}}};
    const cancel=()=>{finishDrag();render(true);};
    drag={element,move,up,cancel};move(event);
    window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',cancel);
  });
  root.addEventListener('keydown',event=>{if(event.key==='Escape'&&!document.getElementById('modal').open){event.preventDefault();event.stopPropagation();if(drag)finishDrag();else close();}});
  const unsubscribeViewport=window.GameViewport?.subscribe(blocked=>{if(blocked)finishDrag();});
  system.subscribe(()=>render());
  const timer=setInterval(()=>{system.tick();if(opened)render();},500);
  window.addEventListener('pagehide',()=>{finishDrag();system.tick();});
  return {open,close,isOpen:()=>opened,refresh:()=>render(true),capture(id){const state=system.snapshot();if(state.photos.includes(id)){toast(c.albumDuplicate);return;}if(state.photos.length>=data.tuning.maxPhotos){toast(c.albumFull);return;}if(system.photo(id)){sound('paper');toast(c.albumSaved);}},dispose(){clearInterval(timer);unsubscribeViewport?.();finishDrag();}};
};
})();
