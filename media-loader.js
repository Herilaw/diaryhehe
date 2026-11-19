(() => {
'use strict';
const failures=[],inFlight=new Map();
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const signature=(bytes,offset,length)=>String.fromCharCode(...new Uint8Array(bytes,offset,length));
async function validate(kind,name,bytes){
 const meta=window.GAME_ASSET_LIST?.metadata?.[kind]?.[name];
 if(meta&&bytes.byteLength!==meta.bytes)throw Error('Media size mismatch');
 if(kind==='images'){
  if(bytes.byteLength<20||signature(bytes,0,4)!=='RIFF'||signature(bytes,8,4)!=='WEBP')throw Error('Invalid WebP data');
  if(new DataView(bytes).getUint32(4,true)+8!==bytes.byteLength)throw Error('Incomplete WebP data');
 }else if(bytes.byteLength<4||signature(bytes,0,4)!=='OggS')throw Error('Invalid Ogg data');
 if(meta?.sha256&&window.crypto?.subtle){
  const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),n=>n.toString(16).padStart(2,'0')).join('');
  if(hash!==meta.sha256)throw Error('Media checksum mismatch');
 }
 return bytes;
}
async function fetchBytes(kind,name){
 const id=kind+':'+name;if(inFlight.has(id))return inFlight.get(id);
 const pending=(async()=>{
  const meta=window.GAME_ASSET_LIST?.metadata?.[kind]?.[name],version=window.GAME_ASSET_LIST?.version||'1';
  const file=kind==='images'?'assets/'+name+'.webp':'audio/mixed/'+name+'.ogg';
  let last;
  for(let attempt=0;attempt<3;attempt++){
   const controller=typeof AbortController==='function'?new AbortController():null;
   // Avoid AbortSignal.timeout(), which is absent in older mobile WebViews.
   // Apply the deadline to both the response headers and the complete body.
   const timer=controller?setTimeout(()=>controller.abort(),90000):null;
   try{
    const suffix=attempt?'&retry='+Date.now()+'-'+attempt:'';
    const response=await fetch(file+'?v='+version+suffix,{cache:attempt?'reload':'force-cache',signal:controller?.signal});
    if(!response.ok){const error=Error('HTTP '+response.status);error.status=response.status;throw error;}
    return await validate(kind,name,await response.arrayBuffer());
   }catch(error){
    last=error;failures.push({kind,name,attempt:attempt+1,error:error.name==='AbortError'?'timeout':error.message,status:error.status||null,time:Date.now()});
    if(failures.length>60)failures.shift();
   }finally{if(timer!==null)clearTimeout(timer);}
   if(attempt<2)await delay(400*(attempt+1));
  }
  const error=Error('Media unavailable: '+id);error.cause=last;error.media={kind,name};throw error;
 })();
 inFlight.set(id,pending);
 try{return await pending;}finally{inFlight.delete(id);}
}
window.GameMedia={fetchBytes,validate,diagnostics:()=>({failures:failures.map(item=>({...item}))})};
})();
