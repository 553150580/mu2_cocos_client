import { _decorator, Component, EditBox, Label, Node, RichText } from 'cc';
import { BasePage } from './BasePage';
import { ViewStack } from '../UiComps/ViewStack';
import { Tab } from '../UiComps/Tab';
import WS from '../base/net';
import { Err, MT } from '../base/MT';
import GD from '../base/GameData';
import { ct } from '../base/types';
import { UIMgr } from '../managers/UIMgr';
const { ccclass, property } = _decorator;

@ccclass('TgCodePage')
export class TgCodePage extends BasePage {
    @property(ViewStack)
    view:ViewStack;
    @property(Tab)
    tab:Tab;
    @property(EditBox)
    code1:EditBox;
    @property(EditBox)
    code2:EditBox;
    @property(Node)
    getBtn:Node;
    @property(Node)
    getPointBtn:Node;
    @property(Node)
    bindBtn:Node;
    @property(Node)
    registBtn:Node;
    @property(Label)
    bindLabel:Label;
    @property(RichText)
    tgRich:RichText;
    @property(EditBox)
    myTgCode:EditBox;

    onLoad(): void {
        super.onLoad()
        this.tab.selectedHandler=(node,index)=>{
            let i=index
            if(index==0){
                if(this.bindCode==''){
                    i=0
                    this.code1.string=''
                }else{
                    i=3
                }
            }else if(index==1){
                if(this.myCode==''){
                    i=2
                    this.code2.string=''
                }else{
                    i=1
                }
                this.refreshRich();
            }
            this.view.selectedIndex=i
            GD.playClickSound()
        }
        this.bindBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.bindCode==''){
                if(GD.role.data.IsYkMode==false||GD.role.hasBaseYk()){
                    let sign = this.code1.string;
                    if(sign.length==6){
                        let req = outer_pb.CommonAct.create();
                        req.Sign=sign
                        let buff = outer_pb.CommonAct.encode(req).finish();
                        WS.send(MT.BindAccountTgCode,buff,(d:any)=>{
                            let rsp = outer_pb.CommonAct.decode(d)
                            if(rsp.ErrCode==Err.ErrCode_Success){
                                GD.role.addDia(rsp.Num,true,'绑定推广码')
                                this.bindCode=rsp.Sign
                                this.refreshBindLabel();
                                this.tab.select(0)
                            }else{
                                UIMgr.I.tip('绑定失败')
                            }
                        })
                    }else{
                        UIMgr.I.tip('推广码需要6位')
                    }
                }
            }else{
                UIMgr.I.tip('已绑定推广码')
            }
        })
        this.getBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.tgBoxNum>0){
                UIMgr.I.PopView.showSliderBox('领取推广奖励：回馈宝箱',ct.yellow,this.tgBoxNum,'领取',(num:number)=>{
                    let req = outer_pb.CommonAct.create();
                    req.Num=num
                    let buff = outer_pb.CommonAct.encode(req).finish();
                    WS.send(MT.GetMyAccountTgBox,buff,(d:any)=>{
                        let rsp = outer_pb.CommonAct.decode(d)
                        if(rsp.ErrCode==Err.ErrCode_Success){
                            GD.role.getItem(70,rsp.Num,true,true,'领取推广奖励')
                            this.tgBoxNum-=rsp.Num
                            this.refreshRich()
                        }else{
                            UIMgr.I.tip('领取失败')
                        }
                    })
                })
            }else{
                UIMgr.I.tip('剩余奖励数量不足')
            }
        })
        this.getPointBtn.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.hasBaseYk()){
                if(this.tgPointNum>0){
                    UIMgr.I.PopView.showSliderBox('领取推广奖励：50点/笔',ct.brown,this.tgPointNum,'领取',(num:number)=>{
                        let req = outer_pb.CommonAct.create();
                        req.Num=num
                        let buff = outer_pb.CommonAct.encode(req).finish();
                        WS.send(MT.GetMyAccountTgPoint,buff,(d:any)=>{
                            let rsp = outer_pb.CommonAct.decode(d)
                            if(rsp.ErrCode==Err.ErrCode_Success){
                                GD.role.addMuPoint(rsp.Num,true,'领取推广奖励')
                                this.tgPointNum-=num
                                this.refreshRich()
                            }else{
                                UIMgr.I.tip('领取失败')
                            }
                        })
                    })
                }else{
                    UIMgr.I.tip('剩余奖励数量不足')
                }
            }
        })
        this.registBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.myCode==''){
                let sign = this.code2.string;
                if(sign.length==6){
                    let req = outer_pb.CommonAct.create();
                    req.Sign=sign
                    let buff = outer_pb.CommonAct.encode(req).finish();
                    WS.send(MT.RegisterAccountTgCode,buff,(d:any)=>{
                        let rsp = outer_pb.CommonAct.decode(d)
                        if(rsp.ErrCode==Err.ErrCode_Success){
                            this.myCode=rsp.Sign
                            this.tab.select(1)
                            UIMgr.I.tip('申请成功',ct.green)
                        }else{
                            UIMgr.I.tip('申请失败')
                        }
                    })
                }else{
                    UIMgr.I.tip('推广码需要6位')
                }
            }else{
                UIMgr.I.tip('已有推广码')
            }
        })
    }
    refreshBindLabel=()=>{
        this.bindLabel.string=`已绑定推广码：${this.bindCode}`
    }
    refreshRich=()=>{
        this.myTgCode.string=this.myCode
         this.tgRich.string=`<color=${ct.gray}>(把您的推广码发给朋友，奖励将源源不断)</><br/>已累计推广充值：${this.tgLc}<br/>剩余可领取<color=${ct.yellow}>回馈宝箱</>个数：${this.tgBoxNum}<br/><color=${ct.gray}>(推广充值每满100可领1个宝箱)</><br/>剩余可领取<color=${ct.brown}>点数</>：${this.tgPointNum*50}点<br/><color=${ct.gray}>(推广充值每满1000可领50点)<br/>(特权卡有效期内可领)</>`     
    }
    tgLc:number=0;
    tgBoxNum:number=0;
    tgPointNum:number=0;
    bindCode:string='' 
    myCode:string='' //我的推广码
    initData(data: any): void {
        WS.send(MT.GetMyAccountTgBoxNum,GD.EmptyRequestBuff,(d:any)=>{
            let rsp = outer_pb.CommonAct.decode(d)
            if(rsp.ErrCode==Err.ErrCode_Success){
                this.tgLc=rsp.AllLc
                this.tgBoxNum=rsp.Num
                this.tgPointNum=rsp.Time
                this.bindCode=rsp.Name
                this.myCode=rsp.Sign
                this.refreshBindLabel()
                this.refreshRich()
                this.tab.select(0)
            }
        })
    }
}


