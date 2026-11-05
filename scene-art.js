/* Stage directions only: story text and saved page positions stay intact. */
(() => {
'use strict';
const scenes = window.VN.scenes;
const find = id => scenes.find(s => s.id === id);
const portraits = {
 'sister-bust': {name:'姐姐'}, 'pregnant-bust': {name:'姐姐'},
 'husband-bust': {name:'姐夫', flip:true},
 'oldwoman-bust': {name:'老太太'}, 'clinic-doctor-bust': {name:'大夫'},
 'nurse-bust': {name:'护士'}, 'grandmother-bust': {name:'婆婆'},
 'grandfather-bust': {name:'公公'}, 'security-bust': {name:'警卫'},
 'manager-bust': {name:'店长'}, 'dentist-bust': {name:'女大夫'},
 'nikaido-bust': {name:'二阶堂先生'}
};
window.VN.PORTRAITS = portraits;
function paint(id, from, through, bg, cast) {
 const s = find(id);
 if (!s || !s.nodes[through]) throw Error('Invalid art direction: '+id+'/'+through);
 for (let i=from;i<=through;i++) {
  if (bg) s.nodes[i].bg=bg;
  if (cast!==undefined) s.nodes[i].cast=[...cast];
 }
}
paint('dec29',7,9,'bedroom',[]);
paint('dec29',16,16,'hospital',[]);
paint('dec29',17,23,'hospital-backyard',[]);
paint('dec29',29,32,'hospital-backyard',[]);
paint('dec29',33,35,'hospital-window',[]);
paint('dec29',39,40,'home-entry',[]);
paint('dec30',0,2,'bedroom',[]);
paint('jan03',0,0,'home-entry',['grandfather-bust','grandmother-bust']);
paint('jan03',1,3,'reading-room',['grandfather-bust','grandmother-bust']);
paint('jan03',4,4,'reading-room',['husband-bust','grandmother-bust']);
paint('jan03',5,5,'reading-room',['grandmother-bust','sister-bust']);
paint('jan03',6,6,'reading-room',['grandfather-bust','grandmother-bust']);
paint('jan03',7,7,'reading-room',['grandmother-bust','sister-bust']);
paint('jan03',9,11,'bedroom-night',['sister-bust']);
paint('jan13',9,9,'hospital-waiting',['clinic-doctor-bust','nurse-bust']);
paint('jan13',11,11,'examination-room',['nurse-bust','nurse-bust']);
paint('jan13',12,14,'examination-room',['clinic-doctor-bust']);
paint('jan13',15,17,'clinic-ultrasound',['nurse-bust']);
paint('jan13',19,19,'clinic-ultrasound',['nurse-bust']);
paint('jan28',13,14,'bedroom-night',[]);
paint('feb06',0,0,'garden',[]);
paint('feb06',15,16,'bathroom',[]);
paint('feb10',1,8,'bedroom',['husband-bust','sister-bust']);
paint('feb10',9,9,'home-entry',['husband-bust']);
paint('feb10',10,12,'home-entry',['nikaido-bust','sister-bust']);
paint('feb10',13,14,'living-room-moonlight',['husband-bust']);
paint('feb10',15,19,'home-entry',['husband-bust','sister-bust']);
paint('mar14',0,0,'bedroom',['sister-bust']);
paint('mar14',1,2,'bathroom',[]);
paint('mar14',3,10,'garden-night',[]);
paint('mar22',0,0,'home-entry',['grandfather-bust','grandmother-bust']);
paint('mar22',1,1,'reading-room',['grandmother-bust','sister-bust']);
paint('mar22',2,3,'reading-room',['grandfather-bust','grandmother-bust']);
paint('mar22',9,10,'reading-room',['grandfather-bust','grandmother-bust']);
paint('mar22',11,13,'reading-room',['husband-bust']);
paint('mar31',0,2,'supermarket-backdoor',['security-bust']);
paint('mar31',3,9,'supermarket-sampling',[]);
paint('mar31',10,17,'supermarket-sampling',['oldwoman-bust']);
paint('mar31',18,22,'supermarket-sampling',[]);
paint('apr16',10,17,'kitchen-pantry',[]);
paint('may01',0,2,'kitchen',['pregnant-bust']);
paint('may01',3,21,'living-room-rain',['husband-bust','pregnant-bust']);
paint('may16',4,5,'dental-clinic',['dentist-bust']);
paint('may28',6,7,'supermarket-fruit',['manager-bust']);
paint('may28',8,8,'supermarket-fruit',[]);
paint('may28',9,10,'kitchen-night',[]);
paint('may28',11,14,'kitchen-jam-close',[]);
paint('may28',15,16,'university-room',[]);
paint('may28',17,21,'kitchen-jam-close',[]);
paint('may28',22,22,'university-room',[]);
paint('may28',23,32,'kitchen-jam-close',['husband-bust','pregnant-bust']);
paint('jun15',12,12,'kitchen-jam-day',[]);
paint('jun15',13,14,'supermarket-fruit',['manager-bust']);
paint('jun15',15,15,'street-rain',[]);
paint('jul02',7,8,'kitchen-jam-day',[]);
paint('jul02',18,18,'kitchen-jam-day',[]);
paint('jul02',21,24,'kitchen-jam-day',[]);
paint('aug08',1,2,'garden',['husband-bust']);
paint('aug11',7,9,'street-summer',[]);
paint('aug11',12,13,'hospital-backyard',[]);
paint('aug11',14,15,'examination-room',[]);
paint('aug11',16,17,'hospital-window',[]);
paint('aug11',18,19,'clinic-stairs',[]);
// Replies remain in the location and with the people of their parent action.
for (const s of scenes) for (const n of s.nodes) {
 for (const choice of n.choices || []) for (const reply of choice.reply || []) {
  reply.bg ??= n.bg || s.bg;
  reply.cast ??= n.cast || s.cast;
  if (n.light) reply.light ??= n.light;
 }
}
})();
