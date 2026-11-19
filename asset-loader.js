(() => {
'use strict';
// Keep one background request at a time. Foreground chapter requests can promote
// queued jobs and share an in-flight request instead of downloading twice.
window.createChapterLoader=function({vn,content,manifest,loadImage,loadAudio,audioForScene}){
 const keys=['pregnancy','dormitory','cafeteria'],images=new Set(manifest.images),audio=new Set(manifest.audio);
 const groups=Object.fromEntries(keys.map(key=>[key,{images:new Set(),audio:new Set()}]));
 const chapter=scene=>scene?.noteKey||(scene?.story==='学生宿舍'?'dormitory':scene?.story==='傍晚的配餐室和雨中的游泳池'?'cafeteria':'pregnancy');
 const resolve=name=>vn.ART_ALIASES?.[name]||name;
 function collect(value,target){
  if(typeof value==='string'){const name=resolve(value);if(images.has(name))target.add(name);}
  else if(Array.isArray(value))value.forEach(item=>collect(item,target));
  else if(value&&typeof value==='object')Object.values(value).forEach(item=>collect(item,target));
 }
 const sharedImages=['reading-room','a4-cover-book','title-art','s2-cat-idle','s2-cat-rest','s2-cat-return','s2-reading-desk'];
 const sharedAudio=['bgm_01_title','sfx_01_choice','sfx_02_clue_tap','sfx_03_clue_open','sfx_04_clue_close','sfx_05_clue_store','sfx_06_page_turn','sfx_07_book_cross','sfx_10_failure'];
 for(const key of keys){sharedImages.forEach(name=>collect(name,groups[key].images));sharedAudio.filter(name=>audio.has(name)).forEach(name=>groups[key].audio.add(name));}
 for(const scene of vn.scenes){const group=groups[chapter(scene)];collect(scene,group.images);for(const file of audioForScene(scene))if(audio.has(file))group.audio.add(file);}
 for(const item of Object.values(vn.ITEMS)){const key=chapter(item);collect(item,groups[key].images);}
 for(const book of content.books)collect(book,groups[book.key].images);
 const extra={pregnancy:['hospital-backyard','a4-charts-bedroom','a4-charts-rack','a4-charts-phone','a4-chart-folder'],dormitory:['d2-hive','d2-patchwork','d2-flashlight','d2-exterior'],cafeteria:['d3-seawall-dusk','d3-pool-rain','d3-factory-objects','a4-finale-table']};
 for(const key of keys)collect(extra[key],groups[key].images);
 // The last chapter can end in a cross-story recap, so include its illustration
 // dependencies even when the player arrives directly through an old save.
 collect(vn.ENDINGS,groups.pregnancy.images);
 collect(window.GAME_FINALE_ASSETS||[],groups.cafeteria.images);
 ['bgm_08_finale','sfx_13_stairs','loop_01_window_rain','loop_06_bees','loop_08_pool_rain','loop_09_coast','loop_10_cold_wind','loop_03_cicadas'].filter(name=>audio.has(name)).forEach(name=>groups.cafeteria.audio.add(name));
 const jobs=new Map(),queue=[];let active=0,backgroundActive=0,foreground=0;
 function pump(){
  queue.sort((a,b)=>Number(b.urgent)-Number(a.urgent));
  while(active<4){
   const index=queue.findIndex(job=>job.urgent||(!foreground&&!backgroundActive));
   if(index<0)return;
   const job=queue.splice(index,1)[0],background=!job.urgent;
   active++;if(background)backgroundActive++;
   Promise.resolve().then(()=>job.kind==='images'?loadImage(job.name):loadAudio(job.name))
    .then(()=>{job.done=true;job.resolve();},error=>{jobs.delete(job.id);job.reject(error);})
    .finally(()=>{active--;if(background)backgroundActive--;pump();});
  }
 }
 function request(kind,name,urgent){
  const id=kind+':'+name;let job=jobs.get(id);
  if(!job){job={id,kind,name,urgent,done:false};job.promise=new Promise((resolve,reject)=>{job.resolve=resolve;job.reject=reject;});jobs.set(id,job);queue.push(job);}
  else if(urgent)job.urgent=true;
  pump();return job.promise;
 }
 function list(key){const group=groups[key]||groups.pregnancy;return [...group.images].map(name=>['images',name]).concat([...group.audio].map(name=>['audio',name]));}
 function ready(key){return list(key).every(([kind,name])=>jobs.get(kind+':'+name)?.done);}
 async function ensure(key,onProgress=()=>{}){
  const tasks=list(key);foreground++;
  let completed=0;onProgress(0);
  try{
   const results=await Promise.allSettled(tasks.map(([kind,name])=>request(kind,name,true).then(()=>{completed++;onProgress(Math.floor(completed*100/tasks.length));})));
   if(results.some(result=>result.status==='rejected'))throw Error('Chapter media unavailable');
  }finally{foreground--;pump();}
 }
 let backgroundRun=0;
 async function background(key){
  const ticket=++backgroundRun,index=keys.indexOf(key),order=[...keys.slice(index+1),...keys.slice(0,index)];
  // Also finish unassigned export/gallery illustrations, after the chapters.
  const remaining=order.flatMap(list),assigned=new Set(list(key).concat(remaining).map(([kind,name])=>kind+':'+name));
  for(const name of images)if(!assigned.has('images:'+name))remaining.push(['images',name]);
  for(const name of audio)if(!assigned.has('audio:'+name))remaining.push(['audio',name]);
  for(const [kind,name]of remaining){if(ticket!==backgroundRun)return;try{await request(kind,name,false);}catch{/* Retry on the next visit; reading continues. */}}
 }
 return {ensure,ready,background,chapter,plan:key=>({images:[...(groups[key]||groups.pregnancy).images],audio:[...(groups[key]||groups.pregnancy).audio]}),diagnostics:()=>({foreground,active,backgroundActive,loaded:[...jobs.values()].filter(job=>job.done).map(job=>job.id)})};
};
})();
