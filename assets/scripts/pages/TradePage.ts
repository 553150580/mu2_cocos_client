import { _decorator, Component, Label, Node } from 'cc';
import { List } from '../UiComps/List';
import { BasePage } from './BasePage';
import Tools from '../base/tools';
import { ct, Item } from '../base/types';
import { UIMgr } from '../managers/UIMgr';
import { ShowItemType } from './PopView';
import WS from '../base/net';
import { Err, MT } from '../base/MT';
import GD from '../base/GameData';
const { ccclass, property } = _decorator;

@ccclass('TradePage')
export class TradePage extends BasePage {
    @property(List)
    otherList:List
    @property(List)
    myList:List
    @property(Label)
    otherName:Label
    @property(Label)
    otherState:Label
    @property(Node)
    cancelBtn:Node
    @property(Node)
    add1EquipBtn:Node
    @property(Node)
    add1ItemBtn:Node
    @property(Node)
    okBtn:Node
    @property(Label)
    otherPoint:Label
    @property(Label)
    myPoint:Label
    @property(Node)
    addPointBtn:Node

    onLoad(): void {
        this.otherList.cellRender=(node,index)=>{
            this.renderCell(node,index,this.otherList)
        }
        this.addPointBtn.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.data.MuPoint>1){
                UIMgr.I.PopView.showSliderBox('支付点数',ct.brown,GD.role.data.MuPoint,'确定',(num:number)=>{
                    let req = outer_pb.TradeAct.create();
                    req.MuPoint = num
                    let buff = outer_pb.TradeAct.encode(req).finish();
                    WS.send(MT.TradeAdd1Item,buff,(d:any)=>{
                        let rsp=outer_pb.TradeAct.decode(d);
                        if(rsp.ErrCode==Err.ErrCode_Success){
                            this.updateTradeData(rsp)
                            // GD.role.reduceMuPoint(num)
                            UIMgr.I.tip('添加成功',ct.green)
                        }else{
                            UIMgr.I.tip('添加失败')
                        }
                    });
                })
            }else{
                UIMgr.I.tip('您的点数不足2点')
            }
        },this)
        this.otherList.selectedHandler=(node,index)=>{
            let data:outer_pb.TradeItem = this.otherList.array[index]
            let type=ShowItemType.TradeItem
            if(data.Equip){
                type=ShowItemType.TradeEquip
            }
            UIMgr.I.PopView.show(0,data,false,type,'',null)
        }
        this.myList.cellRender=(node,index)=>{
            this.renderCell(node,index,this.myList)
        }
        this.myList.selectedHandler=(node,index)=>{
            let data:outer_pb.TradeItem = this.myList.array[index]
            let type=ShowItemType.TradeItem
            if(data.Equip){
                type=ShowItemType.TradeEquip
            }
            UIMgr.I.PopView.show(0,data,false,type,'取消',this.delete1Item)
        }
        this.add1EquipBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.myItemNum<10){
                UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler,(equip:outer_pb.IEquip)=>{
                    return equip.IsLock==false
                })
            }else{
                UIMgr.I.tip('交易栏满了')
            }
        },this)
        this.add1ItemBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.myItemNum<10){
                UIMgr.I.PopView.showBagItemByFilter(this.bagItemselectedHandler,this.bagItemFilter)
            }else{
                UIMgr.I.tip('交易栏满了')
            }
        },this)
        this.okBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.myTradeObj&&this.myTradeObj.IsMeOk==false){
                WS.send(MT.TradeOk,GD.EmptyRequestBuff)
            }
        },this)
        this.cancelBtn.on(Node.EventType.TOUCH_END,()=>{
            WS.send(MT.TradeCancel,GD.EmptyRequestBuff)
        },this)
        WS.cbs.set(MT.TradeItemsChanged,this.onTradeItemsChanged)
        WS.cbs.set(MT.TradeComplete,this.onTradeComplete)
        WS.cbs.set(MT.TradeOk,this.onTradeOk)
        WS.cbs.set(MT.TradeCancel,this.onTradeCancel)
    }
    initData(rsp: any): void {
        this.updateTradeData(rsp)
    }
    onTradeCancel=(d:any)=>{
        let rsp=outer_pb.TradeAct.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            //补回去
            let my=rsp.Items[GD.role.data.Id]
            for(let k in my.Items){
                let item=my.Items[k]
                if(item.Equip){
                    GD.role.getBagEquip(item.Equip,false)
                }else{
                    GD.role.getBagItem(item.Id,item.Num,false)
                }
            }
            // if(my.MuPoint>0) GD.role.addMuPoint(my.MuPoint,false)
        }
        UIMgr.I.hideCurPage()
    }
    onTradeOk=(d:any)=>{
        let rsp=outer_pb.TradeAct.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            this.updateTradeData(rsp)
        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughItem){
            UIMgr.I.tip('道具不足')
        }else{
            UIMgr.I.tip('交易失败')
        }
    }
    onTradeComplete=(d:any)=>{
        let rsp=outer_pb.TradeAct.decode(d);
        //放进背包
        let my=rsp.Items[GD.role.data.Id]
        for(let k in my.Items){
            let item=my.Items[k]
            if(item.Equip){
                GD.role.getEquip(item.Equip,false)
            }else{
                GD.role.getItem(item.Id,item.Num,false)
            }
        }
        if(rsp.ChangeMuPoints){
            let get:number=rsp.ChangeMuPoints[GD.role.data.Id]
            if(get>0){
                GD.role.addMuPoint(get,true)//收入
            }else if(get<0){
                GD.role.reduceMuPoint(-get) //支出
            }
            
        }
        UIMgr.I.tip('交易成功',ct.green)
        UIMgr.I.hideCurPage()
    }
    onTradeItemsChanged=(d:any)=>{
        let rsp=outer_pb.TradeAct.decode(d);
        this.updateTradeData(rsp)
    }
    bagEquipSelectedHandler = (node:Node,index:number,self:any)=>{
        self.hide()
        let data:outer_pb.IEquip =self.bagList.array[index]
        UIMgr.I.PopView.show(0,data,false,ShowItemType.Equip,'选择',this.add1Equip,()=>{
            UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler,(equip:outer_pb.IEquip)=>{
                return equip.IsLock==false
            })
        })
    }
    selectedItem:outer_pb.IItem
    bagItemselectedHandler = (node:Node,index:number,self:any)=>{
        self.hide()
        let item:Item =self.bagList.array[index]
        this.selectedItem=item;
        let base = GD.ItemBaseDatas.get(item.Id);
        let str = `${base.Name}x${item.Num.toLocaleString()}`
        let curMaxSliderValue=item.Num>10000?10000:item.Num;
        let color = Tools.getItemColor(item.Id)
        UIMgr.I.PopView.showSliderBox(str,color,curMaxSliderValue,'确定',this.add1Item,null,false,true,()=>{
            UIMgr.I.PopView.showBagItemByFilter(this.bagItemselectedHandler,this.bagItemFilter)
        })
    }
    bagItemFilter=(item:Item)=>{
        //item.Id>17排除药水、金币、点数、随机回城卷轴等，item.Id==4为技能书页
        return item.Id>17||item.Id==4
    }
    add1Equip=(data:outer_pb.IEquip)=>{
        let req = outer_pb.TradeAct.create();
        req.Uid = data.Uid;
        let buff = outer_pb.TradeAct.encode(req).finish();
        WS.send(MT.TradeAdd1Item,buff,(d:any)=>{
            let rsp=outer_pb.TradeAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                this.updateTradeData(rsp)
                GD.role.tryDeleteBagEquip(data.Uid)
                UIMgr.I.tip('添加成功',ct.green)
            }else{
                UIMgr.I.tip('添加失败')
            }
        });
    }
    add1Item=(num:number)=>{
        if(this.selectedItem){
            let req = outer_pb.TradeAct.create();
            req.Num = num;
            req.ItemId=this.selectedItem.Id
            let buff = outer_pb.TradeAct.encode(req).finish();
            WS.send(MT.TradeAdd1Item,buff,(d:any)=>{
                let rsp=outer_pb.TradeAct.decode(d);
                if(rsp.ErrCode==Err.ErrCode_Success){
                    this.updateTradeData(rsp)
                    GD.role.reduceItem(this.selectedItem.Id,num)
                    UIMgr.I.tip('添加成功',ct.green)
                }else{
                    UIMgr.I.tip('添加失败')
                }
            });
        }else{
            UIMgr.I.tip('道具不存在')
        }
    }
    myTradeObj:outer_pb.ITradeObj;
    myItemNum:number=0
    updateTradeData=(data:outer_pb.ITradeAct)=>{
        let otherItems:Array<outer_pb.ITradeItem>=[]
        let my=data.Items[GD.role.data.Id]
        let myItems:Array<outer_pb.ITradeItem>=[]
        let otherName=''
        let okBtnLabel=this.okBtn.children[0].getComponent(Label)
        let color=ct.brown
        let otherColor=ct.red
        let otherStateStr='未确认'
        let okStr="确定交易"
        if(my){
            this.myTradeObj=my
            this.myPoint.string=my.MuPoint+''
            if(my.IsMeOk){
                color=ct.gray;
                okStr='已确定'
            }
            for(let uid in my.Items){
                myItems.push(my.Items[uid])
            }
            myItems.sort((a,b)=>{return a.Time-b.Time})
            this.myItemNum=myItems.length;
            otherName=my.OtherName
            let other=data.Items[my.OtherId]
            if(other){
                this.otherPoint.string=other.MuPoint+''
                if(other.IsMeOk){
                    otherColor=ct.green
                    otherStateStr='已确认'
                }
                for(let uid in other.Items){
                    otherItems.push(other.Items[uid])
                }
                otherItems.sort((a,b)=>{return a.Time-b.Time})
            }
        }
        this.myList.array=myItems
        this.otherList.array=otherItems
        this.otherName.string=otherName
        okBtnLabel.string=okStr
        okBtnLabel.color.fromHEX(color)
        this.otherState.color.fromHEX(otherColor)
        this.otherState.string=otherStateStr
    }
    delete1Item=(item:outer_pb.TradeItem)=>{
        let req = outer_pb.TradeAct.create();
        req.Uid = item.Uid;
        let buff = outer_pb.TradeAct.encode(req).finish();
        WS.send(MT.TradeDelete1Item,buff,(d:any)=>{
            let rsp=outer_pb.TradeAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                this.updateTradeData(rsp)
                //补回去
                if(item.Equip){
                    GD.role.getBagEquip(item.Equip,false)
                }else{
                    GD.role.getBagItem(item.Id,item.Num,false)
                }
                UIMgr.I.tip('取消成功',ct.green)
            }else{
                UIMgr.I.tip('取消失败')
            }
        });
    }
    renderCell=(node:Node,index:number,list:List)=>{
        let data:outer_pb.TradeItem = list.array[index]
        let item:any
        let type=1
        if(data.Equip){
            type=0
            item=data.Equip
        }else{
            item=new Item(data.Id,data.Num,false)
        }
        Tools.renderBagItem(type,item,node)
    }
}


