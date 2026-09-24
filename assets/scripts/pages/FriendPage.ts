import { _decorator, Component, EditBox, EventTouch, Label, Node } from 'cc';
import { List } from '../UiComps/List';
import { BasePage } from './BasePage';
import { ct } from '../base/types';
import { UIMgr } from '../managers/UIMgr';
import WS from '../base/net';
import { Err, MT } from '../base/MT';
import GD from '../base/GameData';
const { ccclass, property } = _decorator;

const OneHour = 60*60
const OneDay =3600*24
@ccclass('FriendPage')
export class FriendPage extends BasePage {
    @property(List)
    list:List
    // @property(Node)
    // addBtn:Node
    // @property(EditBox)
    // input:EditBox

    static I:FriendPage
    onLoad(): void {
        FriendPage.I=this;
        super.onLoad();
        this.list.array=[];
        this.list.selectedHandler = (node:Node,index:number)=>{
            let data:outer_pb.Friend = this.list.array[index];
            UIMgr.I.PopView.show(1,data);
        }
        this.list.cellRender = (node:Node,index:number)=>{
            let data:outer_pb.Friend = this.list.array[index];
            let label0 = node.children[0].getComponent(Label);
            let label1 = node.children[1].getComponent(Label);
            label0.string=data.Name
            let color:ct=ct.white
            let color1 = ct.gray
            let str:string;
            if(data.State==2){
                str = `(在线)`
                color1=ct.green
            }else if(data.State==1){
                str = `(托管中)`
                color1=ct.brown
            }else{
                color=ct.gray;
                let passTime = (Date.now()/1000>>0)-(data.LastTime as number)
                // console.log(data.Name,passTime,data.LastTime)
                if(passTime<60){
                    str = `(${passTime}秒之前)`
                }else if(passTime<OneHour){
                    str = `(${passTime/60>>0}分钟之前)`
                }else if(passTime<OneDay){
                    str = `(${passTime/OneHour>>0}小时之前)`
                }else{
                    str = `(${passTime/OneDay>>0}天之前)`
                }
            }
            label0.color.fromHEX(color)
            label1.string=str;
            label1.color.fromHEX(color1)
        };
        // this.addBtn.on(Node.EventType.TOUCH_END,this.tryAddFriend)
    }
    // tryAddFriend=(d:any)=>{
    //     let name = this.input.string
    //     if(name==''||name.length<2||name.length>6){
    //         UIMgr.I.tip('昵称为空、太短、太长')
    //         return
    //     }else{
    //         let req = outer_pb.FriendAct.create();
    //         req.Name=name;
    //         let buff = outer_pb.FriendAct.encode(req).finish();
    //         WS.send(MT.AddFriend,buff,(d:any)=>{
    //             let rsp=outer_pb.FriendAct.decode(d);
    //             if(rsp.ErrCode==Err.ErrCode_Success){
    //                 GD.friendList.push(rsp.NewFriend)
    //                 this.refreshList();
    //                 UIMgr.I.tip('添加成功',ct.green)
    //             }else{
    //                 UIMgr.I.tip('添加失败')
    //             }
    //         })
    //     }
    // }
    initData(data:any){
        WS.send(MT.GetFriends,GD.EmptyRequestBuff,this.onGetFriends)
    }
    onGetFriends=(d:any)=>{
        let data = outer_pb.FriendAct.decode(d)
        GD.friendList=data.Friends;
        this.refreshList();
    }
    refreshList(){
        let now = Date.now()/1000>>0;
        GD.friendList.sort((f1,f2)=>{
            if(f1.State==2){
                f1.LastTime=now
            }
            if(f2.State==2){
                f2.LastTime=now
            }
            return (f2.LastTime as number)-(f1.LastTime as number)
        })
        this.list.array = GD.friendList;
    }
    onHide(){
        this.list.array=[]
    }
}


