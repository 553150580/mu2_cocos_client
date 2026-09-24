import { _decorator, EventTouch, Label, Node, RichText } from "cc";
import { BasePage } from "./BasePage";
import GD from "../base/GameData";
import { UIMgr } from "../managers/UIMgr";
import WS from "../base/net";
import { MT } from "../base/MT";
const { ccclass, property } = _decorator;

@ccclass("NpcTalkPage")
export class NpcTalkPage extends BasePage {
    @property(Label)
    npcName:Label
    @property(RichText)
    msgRich:RichText
    @property(Node)
    closeBtn:Node

    msgIndex:number=0;
    msgs:Array<string>=[];
    npcId:number=0;

    onLoad(): void {
        super.onLoad()
        this.closeBtn.on(Node.EventType.TOUCH_END,()=>{
            this.isTalking=false;
            this.msgIndex=this.msgs.length
            this.onBgClick(null)
            UIMgr.I.hideCurPage();
        })
    }
    onBgClick(event: EventTouch): void {
        this.unschedule(this.talk)
        if(this.isTalking){
            this.msgRich.string = this.curMsg
            this.isTalking=false;
        }else{
            this.msgIndex++;
            if(this.msgIndex>=this.msgs.length){
                this.talkIndex=this.curMsg.length;
                this.talkedStr=null
                this.curMsg=null
                this.msgRich.string =''
                UIMgr.I.hideCurPage();
                let req = outer_pb.QuestAct.create()
                req.TaskId=this.npcId
                let buff = outer_pb.QuestAct.encode(req).finish();
                WS.send(MT.TalkToNPC,buff)
            }else{
                this.startTalk(this.msgs[this.msgIndex])
            }
        }
    }
    initData(id: number): void {
        this.npcId=id;
        let npc = GD.npc_list.get(id);
        this.msgs = npc.Msg
        this.npcName.string = npc.Name;
        if(this.msgs.length>1){
            this.msgIndex=1; //忽略第一条
            this.startTalk(this.msgs[this.msgIndex])
        }else{
            this.startTalk(this.msgs[0])
        }
    }
    curMsg:string;
    talkedStr:string;
    talkIndex:number;
    isTalking:boolean;
    startTalk(msg:string){
        if(msg){
            this.talkIndex=0;
            this.talkedStr=''
            this.isTalking=true;
            this.curMsg=msg; //忽略第一条
            this.schedule(this.talk,0.1)
        }
    }
    talk(){
        if(this.talkIndex>=this.curMsg.length){
            this.unschedule(this.talk)
            this.isTalking=false;
        }else{
            this.talkedStr+=this.curMsg[this.talkIndex];
            this.talkIndex++;
            this.msgRich.string = this.talkedStr;
        }
    }
}
// export const 老兵 = ["什么时候带带我啊，兄弟！","二十多年了，终于又在这片奇迹大陆遇见勇士您了！","还记得当年您带我一起去地下城打幽灵吗？哎，多么难忘的一段时光啊！","再次感谢当年您把幽灵掉的第一颗祝福宝石让给了我！","您这次来打算长期在这里奋斗，创出属于自己的一片天地吗？","太好了！看来我也得好好准备一下，迎接这片大陆的挑战了！","不过，最近大陆发生了一些不寻常的变化，勇士您还得多加小心！","不知道是不是我老了，我现在居然打不过当年被我虐了N遍的冰后！","希望您在遇到强大的怪物面前，能勇于挑战！不要放弃！","我愿祝你一臂之力，这是我珍藏多年的保命戒指一对，送你了！加油！"]
// export const 安吉拉 =["老哥！留下来多坐会儿呗！听听我新普的曲子如何？","勇士，好久不见，都有点想你了！","这些年过的怎么样？一切顺利吗？","一晃20多年就过去了，人生还有几个20年？","所以.....要记得及时行乐！","老娘我也快老了，精力大不如从前了，最近来了很多新人，有点让我应接不暇！","不过忙起来也好，人气变好了，我的生意也在慢慢好转！","对了，听老兵说你又要在奇迹大陆闯荡一番事业，我特地攒了些银子给你！","得空了，记得常回来看看我哦！"]
// export const 帕西 =["有什么不懂的，尽管问，我帮你问问DS，他无所不知，无所不能！","我的老朋友！你可算是来找我来了！","来来来，20多年不见，你的法术见长了没？","最近奇迹大陆又不怎么太平了，总有些奇奇怪怪的怪物出现！","幸好你回来了，我们得救了！","听老兵说，你准备好了？","不错，这是我多年来攒的一点积蓄，祝你一臂之力！"]
// export const 汉斯 =["什么时候打到好武器了，记得拿来给老哥我瞧瞧！也让我开开眼！","兄弟！真的是你！哈哈，还真是！来来来，让我瞧瞧！","嗯，变老了！和我一样，哈哈！","老兵说你回来了，我刚开始还有点不相信呢！这次要留下来多久？","很好！不愧是我的好兄弟！","大陆和以前有点不一样了，出发前记得在附近多历练历练！","兄弟我打了一辈子的铁，攒了些金币，你拿去用，其它还需要什么就跟我说！","记得常回来我这里看看，陪我喝喝酒，解解闷！"]
// export const 摩尔塞 =["魔与咒，其实大差不差！","回来啦，我的勇士！","嗯，还是那么年轻！和我一样，哈哈！","老兵说你回来了，我刚开始还有点不相信呢！这次要留下来多久？","很好！加油干，我看好你！","不过，大陆和以前有点不一样了，出发前记得在附近多历练历练！","这些金币你先拿去用，其它还需要什么再跟我说！","记得常回来我这里看看，陪我喝喝酒，解解闷！"]
// export const 老板娘莉亚 =["要什么随便看，随便拿，别客气！老娘不介意！","老兵说你又回来奇迹大陆了，我还以为他跟我瞎说呢！没想到真的是你！","这么多年不见，过的还好吗？和你一起来的还有谁？","经常听老兵说起过去他的那些兄弟，一个一个的消失了，也不知道这次能回来几人？","我相信，像你一样，能重新回到这片大陆的人都过的还不错！","都不年轻了，要注意身体，别太拼了，人生还有几个20年呐！","你看看我，是不是老了很多？","这些年我的生意也很惨淡，差点就要扛不住了！幸好你们回来了，这让我看到了希望！","我也没什么拿得出手的，这是当年你临走时寄存我这的项链，帮你保管了这么多年，现在算物归原主了！","如果可以，就多来瞧瞧我，多关照关照我的生意，好么？","对了，大陆最近经常有强大的怪物出没，有的泛着金光，有的甚至泛着红光，碰见它们的时候记得小心一些！"]
// var 战盟使者 =["人多力量大，是永恒的真理！你别不信！","你可算是来见我了，这些年你不在，可把我忙坏了！","奇迹大陆的怪物越来越强悍了，我这把老骨头都快支撑不住了！","准备好来重新接管你的战盟吗？","嗯，能接任就再好不过了，虽然忙一些，但作为盟主，还是有些好处的！","不过不想管也没关系，也许有人会愿意管，你跟着他们一起开辟天下，也不失为一种好方式","那个老兵，说你这次回来准备大干一场呢，看来他说的没错！加油，我的兄弟！"]
// var 圣导士赛维娜=["尊敬的勇士，你可准备好了？","看来老兵的眼光不错，你果然能坚持下来！","不过，真正的考验才刚开始，你可准备好转职了？","很好，那就开始吧！","不过，一切从简，省的你为了搜集断魂之剑、精灵之泪或者先知之魂而四处奔波，这次就一项任务！","击败10只任意黄金BOSS，就算完成转职任务了，难吗？","我也是没办法呀，这黄金BOSS属实讨厌，时不时的冒出来，搞得我都不能安心在这赏雪了！","去吧，组上你的那些兄弟，一起挑战也是可以的哦！"]


