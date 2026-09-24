import { _decorator, Component, EditBox, Label, Node, ProgressBar, RichText } from 'cc';
import { List } from '../UiComps/List';
import { BasePage } from './BasePage';
import GD from '../base/GameData';
import { UIMgr } from '../managers/UIMgr';
import WS from '../base/net';
import { Err, MT } from '../base/MT';
import { ViewStack } from '../UiComps/ViewStack';
import Tools from '../base/tools';
import { ct } from '../base/types';
const { ccclass, property } = _decorator;

@ccclass('GuessPage')
export class GuessPage extends BasePage {
    @property(ViewStack)
    view:ViewStack
    @property(Node)
    roleBox:Node
    @property(Label)
    who:Label
    @property(EditBox)
    input:EditBox
    @property(Node)
    guessBtn:Node
    @property(Label)
    answerNum:Label
    @property(Label)
    myWord:Label
    @property(Label)
    curScore:Label
    @property(Label)
    fitNum:Label
    @property(ProgressBar)
    bar:ProgressBar
    @property(List)
    detailList:List
    @property(List)
    hisList:List
    @property(List)
    phList:List
    @property(Label)
    lastAnswer:Label
    @property(RichText)
    info2:RichText

    // @property(Node)
    // getBtn:Node

    curAnswerNum:number=0
    isFinished:boolean=true;
    // lastGuessTime:number=0;
    guessBtnLabel:Label;
    canGuess:boolean=true;
    onLoad(): void {
        super.onLoad()
        this.guessBtnLabel= this.guessBtn.children[0].getComponent(Label)
        this.detailList.cellRender = (node:Node,index:number)=>{
            let info:any = this.detailList.array[index]
            let label=node.children[0].getComponent(Label)
            label.string=info.msg
            label.color.fromHEX(info.ct)
        }
        this.hisList.cellRender = (node:Node,index:number)=>{
            let his:outer_pb.MatchResult = this.hisList.array[index]
            node.children[0].getComponent(Label).string=his.Word
            node.children[1].getComponent(Label).string=`${his.Score}%`
        }
        this.hisList.selectedHandler = (node:Node,index:number)=>{
            let his:outer_pb.MatchResult = this.hisList.array[index]
            this.updateMyResultUI(this.hisList.array,his,his.Word)
            GD.playClickSound()
        }
        this.phList.cellRender = (node:Node,index:number)=>{
            let res:outer_pb.GuessResult = this.phList.array[index]
            node.children[0].getComponent(Label).string=res.Name
            node.children[1].getComponent(Label).string=`${res.Score}%`
        }
        // this.getBtn.on(Node.EventType.TOUCH_END,()=>{
        //     WS.send(MT.GetAnswer,GD.EmptyRequestBuff,(d:any)=>{
        //         let rsp=outer_pb.GuessAct.decode(d)
        //         this.lastAnswer.string=rsp.Answer
        //     })
        // })
        this.guessBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.canGuess==false){
                return
            }
            let word=this.input.string
            let len=word.length;
            if(len==0||this.curAnswerNum==0)return
            if(len<=this.curAnswerNum+4){
                let req = outer_pb.GuessAct.create();
                req.Word=word
                let buff = outer_pb.GuessAct.encode(req).finish();
                WS.send(MT.Guess,buff,(d:any)=>{
                    let rsp=outer_pb.GuessAct.decode(d)
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        // this.lastGuessTime=now;
                        this.canGuess=false
                        this.guessBtnLabel.string='再想想'
                        this.guessBtnLabel.color.fromHEX(ct.gray)
                        this.scheduleOnce(()=>{
                            this.canGuess=true
                            this.guessBtnLabel.string='猜'
                            this.guessBtnLabel.color.fromHEX(ct.green)
                        },5)
                        this.updateResultUI(rsp,false)
                        if(rsp.IsFinished){
                            if(rsp.ItemId>0){
                                GD.role.getItem(rsp.ItemId,rsp.ItemNum,true,true)
                            }
                            // if(rsp.Dia>0) GD.role.addDia(rsp.Dia,true)
                            // if(rsp.BaseYk>0){
                            //     GD.role.data.BaseYk=rsp.BaseYk
                            //     UIMgr.I.tip("获得30天特权卡时长",ct.green)
                            // }
                            // if(rsp.GoldYk>0){
                            //     GD.role.data.GoldYk=rsp.GoldYk
                            //     UIMgr.I.tip("获得30天黄金卡时长",ct.green)
                            // }
                        }else{
                            UIMgr.I.tip("猜字完成",ct.green)
                        }
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughNum){
                        UIMgr.I.tip("每5秒只能答1次")
                    }else{
                        UIMgr.I.tip("猜字失败")
                    }
                })
                GD.playClickSound()
            }else{
                UIMgr.I.tip('字数太多')
            }
        },this);
        WS.cbs.set(MT.GuessPhChanged,this.onGuessPhChanged)
        WS.cbs.set(MT.GuessGameStop,this.onGuessGameStop)
        WS.cbs.set(MT.GuessGameStart,this.onGuessGameStart)
    }
    onGuessPhChanged=(d:any)=>{
        let rsp=outer_pb.GuessAct.decode(d)
        this.phList.array=rsp.GuessPh
    }
    onGuessGameStop=(d:any)=>{
        let rsp=outer_pb.GuessAct.decode(d)
        this.isFinished=rsp.IsFinished
        this.view.selectedIndex=1
        let whoName=''
        if(rsp.RoleInfo){
            Tools.renderRoleList(this.roleBox,null,rsp.RoleInfo);
            whoName=`恭喜玩家【${rsp.RoleInfo.Name}】夺得本期猜词活动头彩！`
        }else{
            this.roleBox.removeAllChildren()
        }
        this.who.string=whoName
        this.updateWinner(rsp)
    }
    onGuessGameStart=(d:any)=>{
        let rsp=outer_pb.GuessAct.decode(d)
        this.view.selectedIndex=0
        this.curAnswerNum=rsp.Num
        this.isFinished=rsp.IsFinished
        this.updateWinner(rsp)
        this.updateResultUI(rsp,true)
    }
    initData(data: any): void {
        this.detailList.array=[]
        this.hisList.array=[]
        this.phList.array=[]
        WS.send(MT.TryJoinGuessGame,GD.EmptyRequestBuff,(d:any)=>{
            let rsp=outer_pb.GuessAct.decode(d)
            this.curAnswerNum=rsp.Num
            this.isFinished=rsp.IsFinished
            this.updateWinner(rsp)
            // let dia=30/(rsp.Price/10)*1000>>0
            // this.info2.string=`(有人猜中后活动立即结束，猜中角色奖励30点等价钻石)<br/>(当前奖励约为<color=${ct.qing}>${dia}钻石</>，奖励自动发放至角色)`
            this.info2.string=`(有人猜中后活动立即结束，猜中角色奖励随机宝石x1)<br/>(奖励自动发放至角色)`
            if(rsp.IsFinished){
                this.view.selectedIndex=1
                let whoName=''
                if(rsp.RoleInfo){
                    Tools.renderRoleList(this.roleBox,null,rsp.RoleInfo);
                    whoName=`恭喜玩家【${rsp.RoleInfo.Name}】夺得本期猜词活动头彩！`
                }else{
                    this.roleBox.removeAllChildren()
                }
                this.who.string=whoName
            }else{
                this.view.selectedIndex=0
                this.updateResultUI(rsp,true)
            }
        })
    }
    updateWinner=(rsp:outer_pb.GuessAct)=>{
        this.lastAnswer.string=`上次答案：${rsp.Answer}          上次答对者：${rsp.Winner==''?'无':rsp.Winner}`
    }
    onHide(): void {
        WS.send(MT.TryLeaveGuessGame,GD.EmptyRequestBuff)
    }
    details:Array<any>=[
        {msg:'意思相关联',ct:ct.blue},
        {msg:'有部分字相同',ct:ct.blue},
        {msg:'没有相同的字',ct:ct.red},
        {msg:'属于同一类别',ct:ct.green},
        {msg:'类别不同',ct:ct.red},
        {msg:'意思非常接近',ct:ct.green},
        {msg:'类别可能相关',ct:ct.blue},
        {msg:'属于该类别',ct:ct.green},
    ]
    // details:Array<string>=[
    //     '多个字与答案相近', //0
    //     '部分字与答案匹配',//1
    //     '个别字与答案有关',//2
    //     '没有字与答案匹配',//3
    //     '类别完全匹配！',//4
    //     '类别非常接近',//5
    //     '类别可能相关',//6
    //     '语义上与答案接近',//7
    //     '语义上有一定关联',//8
    //     '字数完全正确',//9
    //     '字数接近答案',//10
    //     '与答案差距较大',//11
    //     '完全匹配！',//12
    // ]
    updateResultUI=(data:outer_pb.GuessAct,newPh:boolean)=>{
        this.updateMyResultUI(data.MyHisList,null,data.Word)
        this.answerNum.string=`本次答案字数：${this.curAnswerNum}字`
        this.hisList.array=data.MyHisList;
        if(newPh){
            this.phList.array=data.GuessPh;
        }
    }
    updateMyResultUI=(resList:Array<outer_pb.IMatchResult>,res:outer_pb.IMatchResult,word:string)=>{
        let list:Array<any>=[]
        let fitStr=''
        let scoreStr=''
        let myWordStr=''
        if(resList.length>0){
            if(res==null)res=resList[resList.length-1]
            myWordStr=word
            fitStr=`字匹配：${res.CharMatches}/${res.TotalChars}`
            scoreStr=`相似度：${res.Score}%`
            if(res.Details.length>0){
                res.Details.forEach(v=>{
                    list.push(this.details[v])
                })
            }
            if(res.Category!=''){
                myWordStr += `  (类别：${res.Category})`
            }
        }else{
            myWordStr='无'
            fitStr=`字匹配：0/0`
            scoreStr=`相似度：0%`
        }
        this.detailList.array=list;
        this.myWord.string=myWordStr
        this.fitNum.string=fitStr
        this.curScore.string=scoreStr
    }
}



