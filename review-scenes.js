/* Shared places keep one architecture; memory shots never become new events. */
(() => {
'use strict';
const vn=window.VN;vn.ITEMS.model.art='a4-dental-material';vn.ITEMS.model.name='取牙型的材料';
Object.assign(vn.ART_ALIASES,{
 'magazine-corner':'a4-magazine-corner','title-art':'a4-cover-room','kitchen-night':'a4-kitchen-night',
 'living-room-rain':'a4-family-rain','living-room-moonlight':'a4-family-moon',
 'd2-manager-room':'a4-manager-room','d2-manager-room-clean':'a4-manager-room','d2-manager-bed':'a4-manager-bed','d2-manager-bed-clean':'a4-manager-bed',
 'd2-garden-rain':'a4-flower-purple','d2-garden-blue':'a4-flower-blue','d2-veranda':'a4-dorm-veranda',
 'd3-wash-window':'a4-wash-window','d3-catering-dusk':'a4-catering-dusk','d3-catering-empty':'a4-catering-empty','d3-conveyor-cg':'a4-conveyor','d3-food-stores':'a4-food-stores','d3-shrimp-line':'a4-shrimp-line',
 'd3-sleeping-child':'a4-sleeping-child','d3-factory-outside':'a4-factory-outside','d3-boy-rain-bust':'a4-boy-rain-neutral'
});
for(const[id,art]of [['d2-red','a4-flower-red'],['d2-orange','a4-flower-orange'],['d2-purple','a4-flower-purple'],['d2-blue','a4-flower-blue']])vn.ITEMS[id].art=art;
for(const r of vn.DORM_RECORDS){if(r.group==='flower')r.art=['','a4-flower-red','a4-flower-orange','a4-flower-purple','a4-flower-blue'][r.stage];}
for(const scene of vn.scenes){
 for(const node of scene.nodes){
  const source=node.sourceIds?.[0];
  if(scene.id==='aug11'&&node.sourceParagraph===3)node.bg='a4-flower-shop';
  if(scene.id==='apr16'&&node.sourceParagraph<=2){node.bg='a4-family-parlor';node.cast=['pregnant-bust'];}
  if(scene.story==='学生宿舍'){
   if(node.bg==='d2-garden')node.bg=scene.visit===1?'a4-flower-red':'a4-dorm-courtyard';
   if(source>=311&&source<=319||node.bg==='d2-hand-cg'||node.bg==='d2-country-memory'||node.bg==='d2-bulbs-cg')node.memory=true;
   if(source>=449&&source<=479)node.weather='soft';
   if(node.explore?.items.some(p=>p.id==='d2-sewing'))node.task='patchwork-first';
   if(node.explore?.items.some(p=>p.id==='d2-letter2'))node.task='patchwork-return';
   if(node.explore?.items.some(p=>p.id==='d2-grille'))node.task='torch';
   if(source===274)node.sfx='wood';if(source===486)node.sfx='click';
  }
  if(scene.story==='傍晚的配餐室和雨中的游泳池'){
   if(source===86)node.sfx='chain';if(source===164)node.sfx='paper';if(source===206)node.sfx='paper';if(source===266)node.sfx='can';
   if(source===112||source===121)node.ambience='machine';
  }
  for(const option of node.choices||[])for(const reply of option.reply||[]){
   if(scene.date){if(reply.bg==='reading-room')reply.bg='a4-family-parlor';if(scene.id==='aug11'&&/楼梯/.test(reply.t))reply.bg='clinic-stairs';}
   if(scene.story==='学生宿舍'&&reply.bg==='d2-garden')reply.bg=scene.visit===1?'a4-flower-red':'a4-dorm-courtyard';
  }
 }
}
for(const scene of vn.scenes.filter(s=>s.date).slice(10)){const remap=n=>{if(n.bg==='a4-family-parlor')n.bg='a4-family-green';if(n.bg==='a4-family-rain')n.bg='a4-family-rain-green';};remap(scene);for(const n of scene.nodes){remap(n);for(const o of n.choices||[])for(const r of o.reply||[])remap(r);}}
const bridge2=vn.scenes.find(s=>s.id==='d2-bridge');let inKitchen=false;
for(const node of bridge2.nodes){if(/起身去倒茶|水壶响|放进水池|回身关火/.test(node.t))inKitchen=true;if(/走回茶几|书不知|书还摊|手机还扣/.test(node.t))inKitchen=false;node.bg=inKitchen?'a4-reader-kitchen':'reading-room';}
const bridge3=vn.scenes.find(s=>s.id==='d3-bridge');for(const node of bridge3.nodes)for(const choice of node.choices||[])for(const reply of choice.reply||[]){if(/热了一点|盛饭|水流|水龙头/.test(reply.t))reply.bg='a4-reader-kitchen-night';}
let bridgeRain=false;
for(const node of bridge3.nodes){
 if(node.t.startsWith('窗玻璃上轻轻响了一下'))bridgeRain=true;
 if(node.t.startsWith('雨声被拉远了'))bridgeRain=false;
 if(bridgeRain){
  node.weather='soft';
  for(const option of node.choices||[])for(const reply of option.reply||[])reply.weather='soft';
 }
}
for(const id of ['d3-return','d3-bookmark'])vn.scenes.find(s=>s.id===id).weather='soft';
const intro=vn.scenes.find(s=>s.id==='intro');const last=intro.nodes.length-1;if(intro.nodes[last].t==='这句话比我的念头更早一步说了出来。'){intro.nodes[last-1].t='我把指尖抵在桌沿，等着自己开口。';intro.nodes[last-1].spoken=false;intro.nodes[last].t='她还在看着我。桌上的酸奶没有动。';}
})();
