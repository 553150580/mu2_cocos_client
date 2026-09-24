import { _decorator, Label, Node, RichText, Vec3 } from 'cc';
import { UIMgr } from '../managers/UIMgr';
import { BasePage } from './BasePage';
const { ccclass, property } = _decorator;

export const enum MsgType{
    Info,
    OffLine,
    Death,
    FocusOut,
}

@ccclass('BoxMsgPage')
export class BoxMsgPage extends BasePage {
    @property(RichText)
    msgLabel:RichText;
    @property(Node)
    btn1:Node;
    @property(Node)
    btn2:Node;

    msgType:MsgType=MsgType.OffLine
    // static I:BoxMsgPage;
    onLoad() {
        // BoxMsgPage.I=this;
        this.bg.off(Node.EventType.TOUCH_END);
        this.btn1.on(Node.EventType.TOUCH_END,()=>{
            if(this.msgType==MsgType.OffLine){
                UIMgr.I.reConnect();
            }else if(this.msgType==MsgType.FocusOut){
                UIMgr.I.sendFocusChange(true)
            }else if(this.msgType==MsgType.Death){
                //立即回城
                // WS.send(MT.RelifeAtHome,GD.EmptyRequestBuff);
            }
            this.btn1.active=false;
            this.scheduleOnce(()=>{this.btn1.active=true;},10)
        })
        // this.okBtn2.on(Input.EventType.TOUCH_END,()=>{
            // if(this.msgType==MsgType.Death){
                //原地复活
                // if(GD.curLineLv===0){
                //     //普通线路，无法原地复活
                // }else{
                    // let req = outer_pb.RelifeAtPlace.create();
                    // let buff = outer_pb.RelifeAtPlace.encode(req).finish();
                    // WS.send(MT.RelifeAtPlace,buff);
                // }
            // }
        // })
    }
    initData(d:any) {
        //<color=#00ff00>Rich</color><br/><color=#0fffff>Text</color>
        this.btn1.active=true;
        UIMgr.I.PopView.hide();
        this.msgType = d.t;
        this.msgLabel.string=d.msg;
        this.btn1.children[0].getComponent(Label).string=d.s1
        if(d.s2){
            let pos:Vec3 = this.btn1.position
            pos.x=-100;
            this.btn1.position=pos
            this.btn2.children[0].getComponent(Label).string=d.s2
            this.btn2.active=true
        }else{
            let pos:Vec3 = this.btn1.position
            pos.x=0;
            this.btn1.position=pos
            this.btn2.active=false
        }
    }
}


