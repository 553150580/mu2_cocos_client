import { _decorator, Component, EditBox, EventTouch, Label, Node, randomRange, RichText, Sprite, Toggle, Widget } from 'cc';
import { List } from '../UiComps/List';
import { BasePage } from './BasePage';
import WS from '../base/net';
import { MT } from '../base/MT';
import GD from '../base/GameData';
import { Tab } from '../UiComps/Tab';
import { UIMgr } from '../managers/UIMgr';
import { ChatChannelType, ct } from '../base/types';
import Tools, { ValidNameRegex } from '../base/tools';
import { RichTextHandler } from '../UiComps/RichTextHandler';
import GameManager from '../managers/GameManager';
const { ccclass, property } = _decorator;

@ccclass('ChatPage')
export class ChatPage extends BasePage {
    @property(Tab)
    tab:Tab;
    @property(List)
    list:List
    @property(Node)
    sendBtn:Node
    @property(EditBox)
    nameInput:EditBox
    @property(EditBox)
    msgInput:EditBox
    @property(Node)
    addPosBtn:Node
    @property(Node)
    addItemBtn:Node
    @property(Node)
    addEmoteBtn:Node

    curPos:outer_pb.IPosition;
    items:Array<outer_pb.IDropItem>=[]; 
    curTargetName:string=''
    curTargetId:number=0;
    onLoad() {
        super.onLoad();
        this.addPosBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            if(this.curPos==null){
                let data=GD.role.data;
                this.curPos = {WorldLv:data.WorldLv,RoomId:data.RoomId,LineId:data.LineId,I:data.I,J:data.J}
                this.msgInput.string += '{p}'
            }else{
                UIMgr.I.tip('已加入您的坐标信息')
            }
        })
        this.nameInput.node.on('editing-did-ended', (eb:EditBox)=>{
            this.curTargetName=eb.string
            this.curTargetId=0
        }, this)
        this.addItemBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            UIMgr.I.PopView.showBag(this.bagItemselectedHandler)
        })
        this.tab.selectedHandler = (node:Node,index:number)=>{
            GD.playClickSound();
            node.children[2].active=false
            // let centerWg = this.list.node.parent.getComponent(Widget)
            // centerWg.bottom = (index!=0&&index!=9)?120:5;
            // centerWg.top=5;
            // centerWg.updateAlignment()
            let msgInputWg = this.msgInput.node.getComponent(Widget)
            msgInputWg.left=index==8?205:70;
            // msgInputWg.updateAlignment()
            if(index==9){
                this.list.array=UIMgr.I.chatList.array;
            }else{
                this.list.array=GD.chatMsgs.get(index)
                if(index==8){
                    this.nameInput.string=this.curTargetName
                }
            }
        }
        this.sendBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            let chanel = this.tab.selectedIndex
            if(chanel==ChatChannelType.System||chanel>=ChatChannelType.All)return
            let needLv = GD.ChatChanelNeedLv.get(chanel);
            if(GD.role.hasEnoughLv(needLv)){
                //todo 频率限制：
                const last = GD.ChatChanelNextTime.get(chanel)
                const now=Date.now()/1000>>0
                if(now<last){
                    UIMgr.I.tip('发送太频繁了')
                    return
                }
                if(chanel==ChatChannelType.Team&&GD.role.data.TeamId==0){
                    UIMgr.I.tip('未加入队伍')
                    return
                }
                if(chanel==ChatChannelType.ZhanMeng&&GD.role.data.Zm==""){
                    UIMgr.I.tip('未加入战盟')
                    return
                }
                if(chanel==ChatChannelType.LianMeng){
                    UIMgr.I.tip('未加入联盟')
                    return
                }
                let msg = this.msgInput.string;
                if(msg.length>0&&msg.length<30){
                    let req = outer_pb.ChatMsg.create();
                    //私聊
                    if(chanel==ChatChannelType.Private){
                        if(!ValidNameRegex.test(this.curTargetName)){
                            UIMgr.I.tip('昵称为空、太短、太长')
                            return
                        }
                        req.OtherName=this.curTargetName;
                    }
                    if(this.curTargetId>0){
                        req.OtherId=this.curTargetId
                    }
                    req.Chanel=chanel;
                    req.msg=msg;
                    if(this.curPos) req.Position = this.curPos;
                    if(this.items) req.Items=this.items;
                    let buff = outer_pb.ChatMsg.encode(req).finish();
                    WS.send(MT.SendChatMsg,buff)
                    this.reset();
                    GD.ChatChanelNextTime.set(chanel,now+GD.ChatChanelInterval.get(chanel))
                }else{
                    UIMgr.I.tip('消息太长或为空')
                }
            }
        },this);
        this.list.array=[];
        this.list.cellRender = (node:Node,index:number)=>{
            let data:outer_pb.ChatMsg = this.list.array[index];
            let text = node.getComponent(RichText)
            node.getComponent(RichTextHandler).data=data;
            Tools.renderChatListCell(data,text);
            data.HasRead=true;
        };
    }
    bagItemselectedHandler = (node:Node,index:number,self:any)=>{
        // self.bagBox.active=false;
        self.hide()
        if(this.items.length>=10){
            UIMgr.I.tip('无法继续添加，每次最多可展示10件道具')
            GameManager.I.playErrorSound()
        }else{
            let data:any =self.bagList.array[index]
            let item = outer_pb.DropItem.create()
            if(self.bagTab.selectedIndex==0){
                let equip = data as outer_pb.IEquip
                item.EquipData=equip
                item.ItemType=1
            }else{
                item.Uid=(randomRange(1,9999)>>0)+''
                item.ItemType=2
                item.ItemId=data.Id
                item.ItemNum=data.Num
            }
            this.items.push(item)
            this.msgInput.string += '{i}'
            GD.playClickSound()
            UIMgr.I.tip('已添加道具，显示为{i}，直接发送即可',ct.green)
        }
    }
    refreshList(chanel:ChatChannelType){
        let index = this.tab.selectedIndex
        if(index==ChatChannelType.All||chanel==index){
            this.list.refresh()
        }else{
            //显示小红点
            this.tab.node.children[chanel].children[2].active=true;
        }
    }
    initData(d:any) {
        this.reset();
        let curChanel=ChatChannelType.World
        if(d){
            //私聊
            curChanel=ChatChannelType.Private
            this.curTargetName=d.Name;
            this.curTargetId=d.Id;
        }
        this.tab.select(curChanel)
        GD.chatMsgs.forEach((msgs,ch)=>{
            if(curChanel!=ch){
                if(msgs.some(msg=>{return msg.HasRead==false})){
                    //显示小红点
                    this.tab.node.children[ch].children[2].active=true;
                }
            }
        })
    }
    reset(){
        this.msgInput.string=''
        this.curPos=null;
        this.items=[];
    }
}


