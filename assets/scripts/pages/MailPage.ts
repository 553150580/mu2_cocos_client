import { _decorator, Component, Label, Node, RichText } from 'cc';
import { List } from '../UiComps/List';
import { BasePage } from './BasePage';
import { UIMgr } from '../managers/UIMgr';
import WS from '../base/net';
import { Err, MT } from '../base/MT';
import GD from '../base/GameData';
import { ct } from '../base/types';
import Tools from '../base/tools';
import { ShowItemType } from './PopView';
import GameManager from '../managers/GameManager';
const { ccclass, property } = _decorator;

export class Mail{
    uid:string;
    mail:outer_pb.IEmail;
    constructor(uid:string,mail:outer_pb.IEmail){
        this.uid=uid;
        this.mail=mail;
    }
}
@ccclass('MailPage')
export class MailPage extends BasePage {
    @property(List)
    list:List
    @property(Node)
    allBtn:Node
    @property(Node)
    mailInfoBox:Node
    @property(Node)
    readBtn:Node;
    @property(RichText)
    mailRich:RichText;
    @property(List)
    itemList:List;

    static I:MailPage
    onLoad(): void {
        MailPage.I=this;
        super.onLoad();
        this.mailInfoBox.on(Node.EventType.TOUCH_END,()=>{
            this.mailInfoBox.active=false;
        });
        this.list.array=[];
        this.list.selectedHandler = (node:Node,index:number)=>{
            let mail:Mail = this.list.array[index];
            this.mailInfoBox.active=true;
            this.readBtn.off(Node.EventType.TOUCH_END)
            this.readBtn.on(Node.EventType.TOUCH_END,()=>{
                this.deleteOneMail(mail)
            })
            Tools.renderMailRich(this.mailRich,mail);
            this.itemList.array=mail.mail.Items;
            GameManager.I.playOpenSound()
        }
        this.list.cellRender = (node:Node,index:number)=>{
            let data:Mail = this.list.array[index];
            let rich = node.children[0].getComponent(RichText);
            node.children[1].active=data.mail.Items.length>0;
            Tools.renderMailRich(rich,data);
        };
        this.allBtn.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.Mails.length>0){
                WS.send(MT.DeleteAllEmails,GD.EmptyRequestBuff,(d:any)=>{
                    let rsp=outer_pb.MailAct.decode(d);
                    this.getMailItems(rsp)
                    GD.role.Mails=[]
                    this.list.array=GD.role.Mails;
                    UIMgr.I.tip('读取成功',ct.green)
                    UIMgr.I.switchMailRedPoint()
                })
            }
        })
        this.itemList.cellRender = (node:Node,index:number)=>{
            const item:outer_pb.MailItem = this.itemList.array[index];
            if(item.Type==0){
                Tools.renderBagItem(0,item.Equip,node)
            }else{
                Tools.renderBagItem(1,item,node)
            }
        };
        this.itemList.selectedHandler = (node:Node,index:number)=>{
            const item:outer_pb.MailItem = this.itemList.array[index];
            if(item.Type==0){
                UIMgr.I.PopView.show(0,item.Equip,false,ShowItemType.Equip)
            }else{
                UIMgr.I.PopView.show(0,item,false,ShowItemType.Item)
            }
        }
    }
    deleteOneMail=(data:Mail)=>{
        let req = outer_pb.MailAct.create();
        req.Uid=data.uid;
        let buff = outer_pb.MailAct.encode(req).finish();
        WS.send(MT.DeleteOneEmail,buff,(d:any)=>{
            let rsp=outer_pb.MailAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                let i=GD.role.Mails.findIndex((mail:Mail)=>{return mail.uid==rsp.Uid;})
                if(i>-1){
                    GD.role.Mails.splice(i,1)
                    this.list.refresh();
                }
                this.getMailItems(rsp)
                UIMgr.I.tip('读取成功',ct.green)
                UIMgr.I.switchMailRedPoint()
            }else{
                UIMgr.I.tip('读取失败')
            }
        })
        this.mailInfoBox.active=false;
    }
    getMailItems=(rsp:outer_pb.MailAct)=>{
        if(rsp.Items){
            // for(let idStr in rsp.Items){
            //     let id = parseInt(idStr)
            //     let num = rsp.Items[idStr]
            //     GD.role.getItem(id,num,true,false,'领取邮件')
            // }
            GD.role.getItems(rsp.Items,true,false,'领取邮件')
        }
        if(rsp.Equips.length>0){
            rsp.Equips.forEach(equip=>{
                GD.role.getEquip(equip,true)
            })
        }
    }
    initData(data:any){
        this.list.array=GD.role.Mails;
    }
}


