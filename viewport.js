(() => {
'use strict';
const gate=document.getElementById('orientation-gate');
const mobile=!!navigator.userAgentData?.mobile||/Android|iPhone|iPad|iPod|Mobile|Tablet|Silk|Kindle/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const listeners=new Set(),waiting=[],inertBefore=new Map();
let blocked=false,previousFocus=null;
function portrait(){
 const type=screen.orientation?.type;
 return type?/^portrait/.test(type):matchMedia('(orientation: portrait)').matches;
}
function raiseGate(){
 if(!blocked)return;
 if(gate.open)gate.close();
 gate.showModal();
}
function sync(){
 const next=mobile&&portrait();
 if(next===blocked){if(next&&!gate.open)gate.showModal();return;}
 blocked=next;document.documentElement.classList.toggle('orientation-blocked',blocked);
 if(blocked){
  previousFocus=document.activeElement;previousFocus?.blur?.();
  for(const element of document.body.children){
   if(element===gate||['SCRIPT','STYLE'].includes(element.tagName))continue;
   inertBefore.set(element,element.inert);element.inert=true;
  }
  gate.showModal();
 }else{
  gate.close();for(const[element,value]of inertBefore)element.inert=value;inertBefore.clear();
  if(previousFocus?.isConnected&&!previousFocus.closest('.hidden'))previousFocus.focus({preventScroll:true});
 }
 for(const listener of listeners)listener(blocked);
 window.dispatchEvent(new CustomEvent('gameorientationchange',{detail:{blocked}}));
 if(!blocked)for(const action of waiting.splice(0))action();
}
window.GameViewport={get blocked(){return blocked;},mobile,whenPlayable(action){if(blocked)waiting.push(action);else action();},subscribe(listener){listeners.add(listener);listener(blocked);return()=>listeners.delete(listener);}};
gate.addEventListener('cancel',event=>event.preventDefault());
gate.addEventListener('close',()=>{if(blocked&&!gate.open)gate.showModal();});
// Keep the rotation screen above loading, reading notices and game dialogs.
const observer=new MutationObserver(records=>{if(blocked&&records.some(record=>record.target!==gate&&record.target.open))raiseGate();});
for(const dialog of document.querySelectorAll('dialog'))if(dialog!==gate)observer.observe(dialog,{attributes:true,attributeFilter:['open']});
for(const type of ['click','dblclick','pointerdown','pointerup','pointermove','touchstart','touchmove','keydown','keyup','wheel','contextmenu']){
 document.addEventListener(type,event=>{if(!blocked)return;event.preventDefault();event.stopImmediatePropagation();},{capture:true,passive:false});
}
window.addEventListener('resize',sync);window.addEventListener('orientationchange',sync);screen.orientation?.addEventListener?.('change',sync);
window.addEventListener('pageshow',sync);document.addEventListener('visibilitychange',sync);
sync();
})();
