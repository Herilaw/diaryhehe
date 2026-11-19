(() => {
"use strict";
const changes=[
  {
    "id": "JQ-0001",
    "path": "VN.scenes[id=intro].nodes[0].t",
    "text": "午饭的碗已经洗好，窗台上的水渍也快干了。这个假期，直到现在才算真正的空下来。"
  },
  {
    "id": "JQ-0004",
    "path": "VN.scenes[id=intro].nodes[3].t",
    "text": "茶几上的那本书，是前些时候买回来的。买的时候想着少玩点手机多看书来“陶冶一下情操”，却到现在都没有翻开这本书。"
  },
  {
    "id": "JQ-0005",
    "path": "VN.scenes[id=intro].nodes[4].t",
    "text": "今天就读这本书吧，至少先看完第一篇故事。"
  },
  {
    "id": "JQ-0006",
    "path": "VN.scenes[id=intro].nodes[5].t",
    "text": "我把书拿起来，抚平封面翘起来的一角。"
  },
  {
    "id": "JQ-0010",
    "path": "VN.scenes[id=intro].nodes[8].t",
    "text": "我停了一下。这个名字太像一本放在抽屉里的私人记录，仿佛掀开封面，就是在偷看别人的隐私。"
  },
  {
    "id": "JQ-0013",
    "path": "VN.scenes[id=intro].nodes[9].choices[0].reply[0].t",
    "text": "既然开始读了，就按顺序来。"
  },
  {
    "id": "JQ-0015",
    "path": "VN.scenes[id=intro].nodes[9].choices[1].reply[0].t",
    "text": "目录上有三个题目。我没有往后翻，把食指重新放在第一篇的页码旁。"
  },
  {
    "id": "JQ-0017",
    "path": "VN.scenes[id=intro].nodes[10].t",
    "text": "第一页的标题下面隔着几行才是日期。窗边的光慢慢落到那行字上。"
  },
  {
    "id": "JQ-0023",
    "path": "VN.scenes[id=intro].nodes[16].t",
    "text": "书页贴在手指上。我想把它翻过去，才发觉指尖下面没有纸的触感。"
  },
  {
    "id": "JQ-0025",
    "path": "VN.scenes[id=intro].nodes[18].t",
    "text": "印着字的地方竟然凹下去了。客厅里的钟依然在走，每响一下，书就近一点。"
  },
  {
    "id": "JQ-0040",
    "path": "VN.scenes[id=intro].nodes[27].t",
    "text": "我不知道她的名字，却知道她是我的姐姐。"
  },
  {
    "id": "JQ-0045",
    "path": "VN.scenes[id=intro].nodes[32].t",
    "text": "她还在看着我。"
  },
  {
    "id": "JQ-0051",
    "path": "VN.scenes[id=dec29].nodes[16].choices[1].reply[0].t",
    "text": "先理好吧，到那里要不要给大夫看，再由你决定。"
  },
  {
    "id": "JQ-0060",
    "path": "VN.scenes[id=dec30].nodes[15].t",
    "text": "我手边还有一个胡椒瓶。"
  },
  {
    "id": "JQ-0072",
    "path": "VN.scenes[id=jan08].nodes[11].t",
    "text": "我把勺子放得近了一点。"
  },
  {
    "id": "JQ-0076",
    "path": "VN.scenes[id=jan08].nodes[17].choices[0].reply[0].t",
    "text": "我把盘子挪过来，没有接话。她弓着背，看我又吃了一口。"
  },
  {
    "id": "JQ-0088",
    "path": "VN.scenes[id=jan13].nodes[34].choices[1].reply[0].t",
    "text": "手套的指尖已经凉了。我把它放到沙发扶手上，姐姐没有看我。"
  },
  {
    "id": "JQ-0138",
    "path": "VN.scenes[id=mar31].nodes[22].t",
    "text": "很少有人连续来取第二次，她的手仍拘谨地停在荷包上。"
  },
  {
    "id": "JQ-0151",
    "path": "VN.scenes[id=apr16].nodes[27].choices[0].reply[1].t",
    "text": "她没有等我出门，就已经把袋口拆开了。"
  },
  {
    "id": "JQ-0158",
    "path": "VN.scenes[id=may01].nodes[15].choices[0].reply[2].t",
    "text": "你们根本没明白。不是枇杷的就没有意义。"
  },
  {
    "id": "JQ-0164",
    "path": "VN.scenes[id=may01].nodes[15].choices[2].reply[1].t",
    "text": "姐姐的脸一下子绷紧，姐夫赶紧伸手搂住她的肩。"
  },
  {
    "id": "JQ-0178",
    "path": "VN.scenes[id=may28].nodes[11].choices[0].reply[0].t",
    "text": "我去掉白色部分，把黄皮切细，放进锅里。刀刃、手背和菜板上，全溅上了果汁。"
  },
  {
    "id": "JQ-0195",
    "path": "VN.scenes[id=jun15].nodes[11].t",
    "text": "我看着她把锅底上剩的最后一点也刮了下来。"
  },
  {
    "id": "JQ-0205",
    "path": "VN.scenes[id=jul02].nodes[19].t",
    "text": "搅拌的勺子碰在锅底。"
  },
  {
    "id": "JQ-0216",
    "path": "VN.scenes[id=jul22].nodes[2].choices[1].reply[0].t",
    "text": "我没法把怀中的婴儿，和姐姐现在的身体联系到一起。那个画面每次都停在同一个地方。"
  },
  {
    "id": "JQ-0250",
    "path": "VN.scenes[id=aug11].nodes[14].choices[1].reply[1].t",
    "text": "婴儿还在哭。我最终松开贴在窗框上的手，走进楼里。"
  },
  {
    "id": "JQ-0255",
    "path": "VN.scenes[id=return].nodes[3].t",
    "text": "书翻到了第一篇末尾。没有医院，没有楼梯，也没有那个婴儿。"
  },
  {
    "id": "JQ-0257",
    "path": "VN.scenes[id=return].nodes[5].t",
    "text": "我把手放到阳光里。拇指边没有结痂的伤口。"
  },
  {
    "id": "JQ-0270",
    "path": "VN.scenes[id=return].nodes[12].choices[1].reply[1].t",
    "text": "可身体改变的是她，痛也是她来受。她连害怕的对象都无法选择。我陪了她那么久，却没怎么听过她的想法。"
  },
  {
    "id": "JQ-0273",
    "path": "VN.scenes[id=return].nodes[12].choices[2].reply[1].t",
    "text": "那些比喻看得见、摸得着，竟比我从没见过的孩子更像真的。"
  },
  {
    "id": "JQ-0277",
    "path": "VN.scenes[id=return].nodes[16].t",
    "text": "那把反复递出去的小勺，已经没法再看成一把普通的小勺。"
  },
  {
    "id": "JQ-0279",
    "path": "VN.scenes[id=return].nodes[18].t",
    "text": "窗外有孩子跑过，球碰到墙，又弹回来。我拿出一张书签，在书里夹下。"
  },
  {
    "id": "JQ-0280",
    "path": "VN.scenes[id=return].nodes[19].t",
    "text": "第一篇读完了。我想在继续之前，留下几句话。"
  },
  {
    "id": "JQ-0282",
    "path": "VN.scenes[id=d2-bridge].nodes[0].t",
    "text": "我把写下来话的纸折成两半，夹回第一篇末尾。纸角露在书外，像一小截还没有说完的话。"
  },
  {
    "id": "JQ-0292",
    "path": "VN.scenes[id=d2-bridge].nodes[5].t",
    "text": "水壶响了。我回身关火，才发现手里仍握着那把茶匙。它的上面当然没有果酱，勺背上却映着一小块深得发黑的窗。"
  },
  {
    "id": "JQ-0295",
    "path": "VN.scenes[id=d2-bridge].nodes[8].t",
    "text": "手机还扣在茶几上，铃声来自书页。可是那里只有杯子、一张手记和那本小说。"
  },
  {
    "id": "JQ-0298",
    "path": "VN.scenes[id=d2-bridge].nodes[9].choices[0].reply[0].t",
    "text": "没有未接来电。我甚至打开了通话记录，最后一通电话还是昨天。铃声却没有因此停下。"
  },
  {
    "id": "JQ-0300",
    "path": "VN.scenes[id=d2-bridge].nodes[9].choices[1].reply[0].t",
    "text": "我每走近一步，铃声就清楚一点。它带着旧式电话振铃的金属颤音，和手机的声音完全不同。"
  },
  {
    "id": "JQ-0301",
    "path": "VN.scenes[id=d2-bridge].nodes[10].t",
    "text": "书不知什么时候重新翻开了。露出的正是下一篇。纸页没有发光，也没有翻动，但是那行字像是刚刚有人写下来的。"
  },
  {
    "id": "JQ-0303",
    "path": "VN.scenes[id=d2-bridge].nodes[12].t",
    "text": "我没有表弟。"
  },
  {
    "id": "JQ-0304",
    "path": "VN.scenes[id=d2-bridge].nodes[13].t",
    "text": "我记得第一篇是怎样结束的。门后的孩子，我到最后也没有看见。如今隔着一张纸的地方，又有人在等我接电话？！"
  },
  {
    "id": "JQ-0313",
    "path": "VN.scenes[id=d2-bridge].nodes[18].t",
    "text": "桌上的阳光暗下去。手记、茶杯和书脊都退到了同一个很远的地方。最后一声铃，贴着我的耳朵响了起来。"
  },
  {
    "id": "JQ-0322",
    "path": "VN.scenes[id=d2-directory].nodes[30].choices[0].reply[0].t",
    "text": "我说有空房，也说要带好材料。“特殊的变化”，被我暂且放在了一边。"
  },
  {
    "id": "JQ-0344",
    "path": "VN.scenes[id=d2-cousin].nodes[19].choices[1].reply[0].t",
    "text": "价钱已经不高了。这样，给你把车铃也换个好的。"
  },
  {
    "id": "JQ-0370",
    "path": "VN.scenes[id=d2-arrival].nodes[32].choices[0].reply[0].t",
    "text": "熟悉了就好。"
  },
  {
    "id": "JQ-0373",
    "path": "VN.scenes[id=d2-arrival].nodes[32].choices[1].reply[0].t",
    "text": "杯底放回桌面时，我尽量没让它发出声音。表弟也已经喝完，手仍围着杯子。"
  },
  {
    "id": "JQ-0386",
    "path": "VN.scenes[id=d2-visit1].nodes[5].t",
    "text": "这次看到的花，是橘黄色的一排。"
  },
  {
    "id": "JQ-0401",
    "path": "VN.scenes[id=d2-visit2].nodes[43].choices[0].reply[0].t",
    "text": "有些事，说得越仔细，反而越不知道自己有没有说清楚。"
  },
  {
    "id": "JQ-0402",
    "path": "VN.scenes[id=d2-visit2].nodes[43].choices[0].reply[1].t",
    "text": "我不能凭这句话替他洗去怀疑，也不能因此加重怀疑。先生还在咳嗽。"
  },
  {
    "id": "JQ-0404",
    "path": "VN.scenes[id=d2-visit2].nodes[43].choices[1].reply[0].t",
    "text": "我能去的地方，都看过了。"
  },
  {
    "id": "JQ-0521",
    "path": "VN.scenes[id=d2-afterword].nodes[1].t",
    "text": "今天先读到这里。"
  },
  {
    "id": "JQ-0528",
    "path": "VN.scenes[id=d3-bridge].nodes[2].t",
    "text": "我读到这里，没有接着读下去。那两个字已经被划掉。我能说的是自己看见了什么，再往后的部分，书没有告诉我。"
  },
  {
    "id": "JQ-0538",
    "path": "VN.scenes[id=d3-bridge].nodes[6].t",
    "text": "原来不是每个故事，都要把最后一点地方全盘告诉读者。"
  },
  {
    "id": "JQ-0548",
    "path": "VN.scenes[id=d3-bridge].nodes[12].t",
    "text": "这次不是电话的声音了。"
  },
  {
    "id": "JQ-0554",
    "path": "VN.scenes[id=d3-bridge].nodes[15].choices[0].reply[1].t",
    "text": "如果有人说话，这次我会先听下去。"
  },
  {
    "id": "JQ-0601",
    "path": "VN.scenes[id=d3-paint].nodes[5].choices[1].reply[0].t",
    "text": "我把刷子侧过来，留出银色的边缘。换气扇一直转着，和窗外的雨声掺在一起。"
  },
  {
    "id": "JQ-0609",
    "path": "VN.scenes[id=d3-threshold].nodes[16].choices[0].reply[2].t",
    "text": "这话没有把问题变得更容易。我望了一眼还在往下滴水的帽檐。"
  },
  {
    "id": "JQ-0616",
    "path": "VN.scenes[id=d3-threshold].nodes[32].t",
    "text": "刷子重新落到墙上。外面的雨没有因为谁来过、又走了，而改变一点声音。"
  },
  {
    "id": "JQ-0641",
    "path": "VN.scenes[id=d3-thousand].nodes[22].choices[0].text",
    "text": "先不追问他的工作\n·"
  },
  {
    "id": "JQ-0646",
    "path": "VN.scenes[id=d3-thousand].nodes[36].t",
    "text": "我在心里，把那一长串食物重新排列了一遍。"
  },
  {
    "id": "JQ-0731",
    "path": "VN.scenes[id=d3-return].nodes[4].choices[0].reply[1].t",
    "text": "可他不是因此就变成一个没有问题的人。那只啤酒罐，和后来那句死讯，都还停留在记忆里。"
  },
  {
    "id": "JQ-0746",
    "path": "VN.scenes[id=d3-bookmark].nodes[2].t",
    "text": "我慢慢合上封面。客厅的灯没有随之熄灭，雨也没有停。杯子、台灯和书，仍在可以伸手碰到的地方。"
  },
  {
    "id": "JQ-0747",
    "path": "VN.scenes[id=d3-bookmark].nodes[3].t",
    "text": "我把书放到桌边，为明天留出一块空地。"
  },
  {
    "id": "DJ-0012",
    "path": "VN.ITEMS[chart3].pages[0]",
    "text": "电话桌旁还有几张。和别处找到的放在一起，二十四张总算找齐了。"
  },
  {
    "id": "DJ-0033",
    "path": "VN.ITEMS[model].pages[1]",
    "text": "它没有味道，只是有一点凉。姐夫的手指碰到了口腔黏膜，口罩里面传出喘气声。"
  },
  {
    "id": "DJ-0041",
    "path": "VN.ITEMS[pamphlet].pages[2]",
    "text": "那些句子我当时并没有认真看。现在，它们却1一个字一个字地浮了上来。"
  },
  {
    "id": "DJ-0120",
    "path": "VN.ITEMS[d2-red].pages[1]",
    "text": "它们在同一个长方形花坛里。"
  },
  {
    "id": "DJ-0122",
    "path": "VN.ITEMS[d2-orange].pages[0]",
    "text": "这次是橘黄色的一排。上次是胭脂红。"
  },
  {
    "id": "DJ-0156",
    "path": "VN.ITEMS[d3-yellow-boots].pages[1]",
    "text": "我只把这一眼留在记忆里。"
  },
  {
    "id": "DJ-0159",
    "path": "VN.ITEMS[d3-chain].pages[1]",
    "text": "链子能吸收阳光。握在手里时，却总是冰凉的。"
  },
  {
    "id": "DJ-0189",
    "path": "VN.ITEMS[d3-shovel].pages[2]",
    "text": "这是他讲述的童年所见，不能用来1解释眼前那间干净、精密的配餐室。"
  },
  {
    "id": "JL-0004",
    "path": "VN.DORM_RECORDS[1].caption",
    "text": "签名已经写下。“幸福”仍像一个陌生的词。"
  },
  {
    "id": "JZ-0006",
    "path": "VN.ENDINGS[d2fall].text",
    "text": "你的重心越过箱沿。湿滑的塑料箱猛地一歪，手指却没能抓住通气孔。手电筒的光在墙上划过，又熄在雨里。那一夜，你没能看清里面有什么。"
  },
  {
    "id": "CAT-0007",
    "path": "S2_CONTENT.copy.hintContinue",
    "text": "回到刚才读到的书页"
  },
  {
    "id": "CAT-0016",
    "path": "S2_CONTENT.copy.hintPrepare",
    "text": "先准备好一枚随身书签，就可以陪猫出发。"
  },
  {
    "id": "CAT-0017",
    "path": "S2_CONTENT.copy.hintDepart",
    "text": "书签已经准备好。陪它寻页，带回这篇故事的画页。"
  },
  {
    "id": "CAT-0018",
    "path": "S2_CONTENT.copy.hintPacking",
    "text": "书签已经放入页间，猫马上出发。"
  },
  {
    "id": "CAT-0020",
    "path": "S2_CONTENT.copy.hintReturning",
    "text": "这一程的选择已记下，等它带着纸片回来。"
  },
  {
    "id": "CAT-0023",
    "path": "S2_CONTENT.copy.hintEnter",
    "text": "画页已经完整，可以走进这一篇故事了。"
  },
  {
    "id": "CAT-0024",
    "path": "S2_CONTENT.copy.hintReread",
    "text": "这一篇故事已读完。可以重看故事，也可以翻阅留下的札记。"
  },
  {
    "id": "CAT-0056",
    "path": "S2_CONTENT.copy.equipped",
    "text": "已经准备好"
  },
  {
    "id": "CAT-0059",
    "path": "S2_CONTENT.copy.needMain",
    "text": "先准备好一枚书签"
  },
  {
    "id": "CAT-0061",
    "path": "S2_CONTENT.copy.needPrevious",
    "text": "先读完前一篇故事，再翻开这枚书签。"
  },
  {
    "id": "CAT-0068",
    "path": "S2_CONTENT.copy.tripSeen",
    "text": "这一程的停留已记下。"
  },
  {
    "id": "CAT-0073",
    "path": "S2_CONTENT.copy.tripNoFragments",
    "text": "这一页的纸片已经齐了。"
  },
  {
    "id": "CAT-0077",
    "path": "S2_CONTENT.copy.puzzleMissing",
    "text": "还有纸片留在书页中。"
  },
  {
    "id": "CAT-0079",
    "path": "S2_CONTENT.copy.puzzleWrong",
    "text": "这里连接不上。再看一眼纸片的边缘。"
  },
  {
    "id": "CAT-0087",
    "path": "S2_CONTENT.copy.clueHint",
    "text": "调查、倾听和阅读留下的记录，会保留到这里。"
  },
  {
    "id": "CAT-0094",
    "path": "S2_CONTENT.copy.albumEmpty",
    "text": "阅读时点“留一幅画”，就能把眼前的画面保留进来。"
  },
  {
    "id": "CAT-0098",
    "path": "S2_CONTENT.copy.albumFull",
    "text": "画册已经放满。可以先取出一幅画，再留新的。"
  },
  {
    "id": "CAT-0107",
    "path": "S2_CONTENT.copy.readReward",
    "text": "合上这一篇故事，猫又挨近了一点。准备匣也添满了。"
  },
  {
    "id": "CAT-0112",
    "path": "S2_CONTENT.copy.fullLines[1]",
    "text": "你把散开的纸页依次放好。"
  },
  {
    "id": "CAT-0113",
    "path": "S2_CONTENT.copy.fullLines[2]",
    "text": "那些经历，已经在心里停留了一会儿。"
  },
  {
    "id": "CAT-0114",
    "path": "S2_CONTENT.copy.fullLines[3]",
    "text": "你没有将故事补充完整。只是把书放在了伸手能够拿到的地方。"
  },
  {
    "id": "CAT-0122",
    "path": "S2_CONTENT.copy.tutorial",
    "text": "摸摸猫，准备好书签，再陪它去寻页。纸片拼好以后，就能走进这一篇故事。读书时得到的记录会留在札记里。"
  },
  {
    "id": "CAT-0155",
    "path": "S2_CONTENT.records[2].body",
    "text": "果实、甜味和气味反复传回来。同一种东西，落到不同的人身上，会留下不同的感受。"
  },
  {
    "id": "CAT-0157",
    "path": "S2_CONTENT.records[3].body",
    "text": "你把两样东西都看过了，才从这间屋子离开。动作很小，后面的空白却很长。"
  },
  {
    "id": "CAT-0161",
    "path": "S2_CONTENT.records[5].body",
    "text": "花色在几次探访间改变，前后并排放着，变化就有了可见的轮廓。"
  },
  {
    "id": "CAT-0167",
    "path": "S2_CONTENT.records[8].body",
    "text": "一句简短的话先抵达纸面，后来又在别的声音和记忆里慢慢传回来。"
  },
  {
    "id": "CAT-0173",
    "path": "S2_CONTENT.records[11].body",
    "text": "废厂里的物件、味道与很早以前的记忆连接在一起。离开画面后，感官留下的东西还没有立刻散去。"
  },
  {
    "id": "CAT-0187",
    "path": "S2_CONTENT.events[2].body",
    "text": "猫走过的地方透出一点光。你挪动书页，让那道光平稳。"
  }
];

// Capture the previous pagination for safe migration of existing revision-4 saves.
function split(text,max){const out=[];let left=text;while(left.length>max){let cut=0;for(let i=Math.min(max,left.length)-1;i>=Math.floor(max*.48);i--)if(/[。！？；，、]/.test(left[i])){cut=i+1;break;}if(!cut)cut=max;out.push(left.slice(0,cut));left=left.slice(cut);}if(left)out.push(left);return out.length?out:[''];}
const oldPages={},oldReplies={};
for(const scene of window.VN.scenes){
 oldPages[scene.id]=[];
 scene.nodes.forEach((node,raw)=>{
  node.copyRaw=raw;
  split(node.t||'',node.spoken?44:76).forEach((text,part)=>oldPages[scene.id].push({raw,part,text}));
  (node.choices||[]).forEach((choice,index)=>{const pages=[];choice.reply.forEach((reply,raw)=>{reply.copyRaw=raw;split(reply.t||'',reply.spoken?44:76).forEach((text,part)=>pages.push({raw,part,text}));});oldReplies[scene.id+':'+raw+':'+index]=pages;});
 });
}
window.REVIEWED_PAGINATION={scenes:oldPages,replies:oldReplies};
for(const change of changes){
 const parts=change.path.match(/[^.\[\]]+|\[[^\]]+\]/g);
 let target=window;
 for(let i=0;i<parts.length-1;i++){
  const part=parts[i];
  if(part.startsWith('[id='))target=target.find(value=>value.id===part.slice(4,-1));
  else target=target[part.startsWith('[')?part.slice(1,-1):part];
  if(target===undefined)throw Error('润色稿位置不存在：'+change.id);
 }
 const last=parts.at(-1);target[last.startsWith('[')?last.slice(1,-1):last]=change.text;
}
})();
