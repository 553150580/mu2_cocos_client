import { _decorator, Component, EditBox, Label, Node, RichText, Sprite } from 'cc';
import { BasePage } from './BasePage';
import { List } from '../UiComps/List';
import { Tab } from '../UiComps/Tab';
import { ViewStack } from '../UiComps/ViewStack';
import WS from '../base/net';
import { Err, MT } from '../base/MT';
import GD from '../base/GameData';
import { UIMgr } from '../managers/UIMgr';
import { BoxMsg, ct } from '../base/types';
import Tools from '../base/tools';
const { ccclass, property } = _decorator;

@ccclass('DiaMarketPage')
export class DiaMarketPage extends BasePage {
    @property(Tab)
    tab:Tab;
    @property(ViewStack)
    view:ViewStack;
    @property(Node)
    refreshBtn:Node;
    @property(Node)
    actBtn:Node;
    @property(Label)
    numInfo:Label;
    @property(Label)
    priceInfo:Label;
    @property(Node)
    addNumBtn:Node;
    @property(Node)
    reduceNumBtn:Node;
    @property(Node)
    addPriceBtn:Node;
    @property(Node)
    reducePriceBtn:Node;
    @property(EditBox)
    numEdit:EditBox;
    @property(EditBox)
    priceEdit:EditBox;
    @property(Label)
    totalLabel:Label;
    @property(Tab)
    actTab:Tab;
    @property(Node)
    sellBox:Node;
    @property(Node)
    buyBox:Node;
    @property(Label)
    myNumLabel:Label;
    @property(Label)
    myPointLabel:Label;
    @property(Node)
    popBtn:Node;
    @property(List)
    orderList:List;
    @property(Node)
    orderSortBox:Node;
    @property(List)
    popHisList:List;
    @property(RichText)
    curPriceRich:RichText;

    buyOrders:Array<DiaMarketOrder>=[];
    sellOrders:Array<DiaMarketOrder>=[];
    curNum:number=1;
    curPrice:number=70;
    lastRefreshTime:number=0;
    selectedCell:Node=null;
    myorders:Array<outer_pb.IOrder>=[]
    onLoad(): void {
        super.onLoad()
        this.tab.selectedHandler=(node,index)=>{
            this.view.selectedIndex=index;
            if(this.selectedCell)this.selectedCell.active=false;
            this.selectedCell=null;
            this.updateData()
            this.refreshBtn.active=index<2
        }
        this.orderSortBox.children.forEach((node,index)=>{
            node.on(Node.EventType.TOUCH_END,()=>{
                this.refreshOrderlist(this.myorders,index)
                this.sortTypes[index]=!this.sortTypes[index]
                GD.playClickSound()
            })
        })
        this.refreshBtn.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.data.IsYkMode||GD.role.hasBaseYk(false)){
                let now=Date.now()/1000
                if(now-this.lastRefreshTime>5){
                    this.updateData()
                    this.lastRefreshTime=now;
                    GD.playClickSound()
                }else{
                    UIMgr.I.tip('刷新太频繁了')
                }
            }
        })
        this.popBtn.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.diaShopBagDiaNum>0||GD.role.diaShop10PointNum>=10){
                WS.send(MT.PopMoneyFromDiaMarket,GD.EmptyRequestBuff,(d:any)=>{
                    let rsp = outer_pb.DiaMarketAct.decode(d);
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        rsp.Num>0&&GD.role.addDia(rsp.Num,true,'提现')
                        rsp.Price>0&&GD.role.addMuPoint(rsp.Price,true,'提现')
                        this.refreshMyData(rsp)
                        UIMgr.I.tip('提现成功',ct.green)
                    }else{
                        UIMgr.I.tip('提现失败')
                    }
                })
            }else{
                UIMgr.I.tip('余额不足（点数的小数部分需凑整后才能提现）')
            }
        })
        this.sellBox.children.forEach((node,index)=>{
            node.on(Node.EventType.TOUCH_END,()=>{
                const len=this.sellOrders.length;
                const i=4-index
                if(i<len){
                    if(this.selectedCell)this.selectedCell.active=false;
                    this.selectedCell=node.children[0]
                    this.selectedCell.active=true;
                    let order = this.sellOrders[i]
                    this.actTab.select(1)
                    this.refreshBuyBox(order.num,order.price)
                    GD.playClickSound()
                }
            })
        })
        this.buyBox.children.forEach((node,index)=>{
            node.on(Node.EventType.TOUCH_END,()=>{
                const len=this.buyOrders.length;
                if(index<len){
                    if(this.selectedCell)this.selectedCell.active=false;
                    this.selectedCell=node.children[0]
                    this.selectedCell.active=true;
                    let order = this.buyOrders[index]
                    this.switchToSellMode(order)
                    GD.playClickSound()
                }
            })
        })
        this.actTab.selectedHandler=(node,index)=>{
            this.refreshBuyBox(this.curNum,this.curPrice)
            this.actBtn.children[0].getComponent(Label).string=index==0?'下单卖出':'下单求购'
            this.numInfo.string=index==0?'卖出数量':'求购数量'
            this.priceInfo.string=index==0?'卖出单价':'求购单价'
            GD.playClickSound()
        }
        this.actBtn.on(Node.EventType.TOUCH_END,this.onActBtnClick)
        this.reduceNumBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.curNum>1){
                this.curNum--
                this.refreshBuyBox(this.curNum,this.curPrice)
                GD.playClickSound()
            }
        })
        this.addNumBtn.on(Node.EventType.TOUCH_END,()=>{
            const type = this.actTab.selectedIndex;
            let can:boolean=false
            if(type==1){
                //买入钻石，需要判断余额中，点数是否足够
                if(GD.role.hasEnoughMuPoint((this.curNum+1)*this.curPrice/10)){
                    this.curNum++
                    can=true;
                }
            }else{
                //卖出钻石，需要判断余额中，钻石是否足够
                if(GD.role.hasEnoughDia((this.curNum+1)*1000,false)){
                    this.curNum++
                    can=true;
                }else{
                    UIMgr.I.tip('钻石不足（每袋1000钻石）')
                }
            }
            if(can){
                this.refreshBuyBox(this.curNum,this.curPrice)
                GD.playClickSound()
            }
        })
        this.reducePriceBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.curPrice>1){
                this.curPrice--
                this.refreshBuyBox(this.curNum,this.curPrice)
                GD.playClickSound()
            }
        })
        this.addPriceBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.curPrice>=1000)return
            this.curPrice++
            this.refreshBuyBox(this.curNum,this.curPrice)
            GD.playClickSound()

            // const type = this.actTab.selectedIndex;
            // let can:boolean=false
            // if(type==1){
            //     //买入钻石，需要判断余额中，点数是否足够
            //     if(GD.role.hasEnoughMuPoint(this.curNum*(this.curPrice+1)/10)){
            //         this.curPrice++
            //         can=true;
            //     }
            // }else{
            //     //卖出钻石
            //     this.curPrice++
            //     can=true;
            // }
            // if(can){
            //     this.refreshBuyBox(this.curNum,this.curPrice)
            //     GD.playClickSound()
            // }
        })
        this.numEdit.node.on('editing-did-ended', (eb:EditBox)=>{
            let num = parseInt(this.numEdit.string)
            if(num<0){
                num=1
            }else if(num>9999){
                num=9999
            }
            this.numEdit.string=num+''
            this.curNum=num;
            this.refreshBuyBox(this.curNum,this.curPrice)
        }, this)
        this.priceEdit.node.on('editing-did-ended', (eb:EditBox)=>{
            let p=7
            try {
                p = parseFloat(this.priceEdit.string)
                if(p<0){
                    p=7
                }
            } catch (error) {
                console.log(error)
            }
            if(p>100)p=100
            this.curPrice=p*10>>0;
            this.priceEdit.string=p+''
            this.refreshBuyBox(this.curNum,this.curPrice)
        }, this)
        this.orderList.cellRender=(node,index)=>{
            let order:outer_pb.Order=this.orderList.array[index];
            node.children[0].getComponent(Label).string=Tools.formatTimestamp(order.UpdateTime);
            node.children[1].getComponent(Label).string=order.Type==0?'求购':'卖出';
            node.children[2].getComponent(Label).string = order.Price/10+'';
            let deal = node.children[3].getComponent(Label);
            deal.string = order.DealNum+'';
            deal.color.fromHEX(order.DealNum>0?ct.green:ct.gray)
            let num = node.children[4].getComponent(Label);
            num.string = order.Num+'';
            num.color.fromHEX(order.Num>0?ct.qing:ct.gray)
            let cancelBtn = node.children[6]
            cancelBtn.off(Node.EventType.TOUCH_END)
            if(order.Num<=0){
                cancelBtn.active=false
            }else{
                cancelBtn.active=true
                cancelBtn.on(Node.EventType.TOUCH_END,()=>{
                    //取消订单
                    let req=outer_pb.DiaMarketAct.create()
                    req.OrderId=order.ID;
                    let buff = outer_pb.DiaMarketAct.encode(req).finish()
                    WS.send(MT.CancelOrder,buff,(d:any)=>{
                        let rsp = outer_pb.DiaMarketAct.decode(d);
                        if(rsp.ErrCode==Err.ErrCode_Success){
                            this.refreshOrderlist(rsp.MyOrders)
                            UIMgr.I.tip('取消订单成功，剩余款项已退还至您的余额中',ct.green)
                        }else{
                            UIMgr.I.tip('取消订单失败')
                        }
                    })
                })
            }
        }
        this.popHisList.cellRender=(node,index)=>{
            let his:outer_pb.GetHis=this.popHisList.array[index];
            node.children[0].getComponent(Label).string=Tools.formatTimestamp(his.Time);
            node.children[1].getComponent(Label).string=`提现钻石：+${his.Dia}`;
            node.children[2].getComponent(Label).string=`提现点数：+${his.Point}`;
        }
    }
    initData(data: any): void {
        this.tab.select(0)
    }
    sortTypes:Array<boolean>=[true,true,true,true,true,true]
    refreshOrderlist=(orders:Array<outer_pb.IOrder>,sortType:number=0)=>{
        let isFront = this.sortTypes[sortType]
        if(sortType==0){
            //默认按更新时间排序
            orders=orders.sort((a,b)=>{
                if(isFront){
                    return b.UpdateTime-a.UpdateTime
                }else{
                    return a.UpdateTime-b.UpdateTime
                }
            })
        }else if(sortType==1){
            orders=orders.sort((a,b)=>{
                if(isFront){
                    return b.Type-a.Type
                }else{
                    return a.Type-b.Type
                }
            })
        }else if(sortType==2){
            orders=orders.sort((a,b)=>{
                if(isFront){
                    return b.Price-a.Price
                }else{
                    return a.Price-b.Price
                }
            })
        }else if(sortType==3){
            orders=orders.sort((a,b)=>{
                if(isFront){
                    return b.DealNum-a.DealNum
                }else{
                    return a.DealNum-b.DealNum
                }
            })
        }else {
            orders=orders.sort((a,b)=>{
                if(isFront){
                    return b.Num-a.Num
                }else{
                    return a.Num-b.Num
                }
            })
        }
        this.myorders=orders;
        this.orderList.array=orders
    }
    switchToSellMode=(order:DiaMarketOrder)=>{
        this.actTab.select(0)
        this.refreshBuyBox(order.num,order.price)
    }
    refreshBuyBox=(num:number,price:number)=>{
        const type=this.actTab.selectedIndex;
        if(type==0){
            //卖出钻石，根据剩余钻石，来设置num
            num = Math.min(num,GD.role.data.Dia/1000>>0)
        }else{
            num = Math.min(num,GD.role.data.MuPoint/(price/10)>>0)
        }
        this.curNum=num;
        this.curPrice=price;
        this.numEdit.string=num+''
        this.priceEdit.string=price/10+''
        this.totalLabel.string=num*price/10+''
    }
    updateData=()=>{
        const type = this.tab.selectedIndex;
        if(type==0){
            this.getDiaShopData()
        }else {
            if(type==1){
                this.getMyOrders()
            }else if(type==2){
                this.getPopHis()
            }
            GD.playClickSound()
        }
    }
    getDiaShopData=()=>{
        WS.send(MT.GetMyDiaShop,GD.EmptyRequestBuff,(d:any)=>{
            let rsp = outer_pb.DiaMarketAct.decode(d);
            if(rsp.ErrCode!=Err.ErrCode_Success){
                //未注册（无特权卡不允许注册），余额均为0
                rsp.BagNum=0
                rsp.Point10=0
            }
            this.onGetDiaShopData(rsp)
        })
    }
    onGetDiaShopData=(rsp:outer_pb.DiaMarketAct,switchToSellMode:boolean=true)=>{
        this.buyOrders=[]
        for(let k in rsp.BuyOrders){
            let price = parseInt(k)
            let num = rsp.BuyOrders[k]
            this.buyOrders.push(new DiaMarketOrder(price,num))
        }
        this.buyOrders.sort((a,b)=>{return b.price-a.price})
        let order:DiaMarketOrder;
        if(this.buyOrders.length>0){
            order=this.buyOrders[0]
        }else{
            order=new DiaMarketOrder(70,0)
        }
        switchToSellMode&&this.switchToSellMode(order)

        this.sellOrders=[]
        for(let k in rsp.SellOrders){
            let price = parseInt(k)
            let num = rsp.SellOrders[k]
            this.sellOrders.push(new DiaMarketOrder(price,num))
        }
        this.sellOrders.sort((a,b)=>{return a.price-b.price})
        this.refreshMarket(rsp.CurPrice);
        this.refreshMyData(rsp);
    }
    refreshMyData=(rsp:outer_pb.DiaMarketAct)=>{
        GD.role.diaShopBagDiaNum=rsp.BagNum
        GD.role.diaShop10PointNum=rsp.Point10
        this.myNumLabel.string=rsp.BagNum+' 袋'
        this.myPointLabel.string=rsp.Point10/10+' 点'
    }
    getMyOrders=()=>{
        this.orderList.array=[]
        if(GD.role.data.IsYkMode||GD.role.hasBaseYk(false)){
            WS.send(MT.GetMyDiaShopOrders,GD.EmptyRequestBuff,(d:any)=>{
                let rsp = outer_pb.DiaMarketAct.decode(d);
                if(rsp.ErrCode==Err.ErrCode_Success){
                    this.refreshOrderlist(rsp.MyOrders);
                }
            })
        }
    }
    getPopHis=()=>{
        this.popHisList.array=[]
        if(GD.role.data.IsYkMode||GD.role.hasBaseYk(false)){
            WS.send(MT.GetMyDiaShopPopHis,GD.EmptyRequestBuff,(d:any)=>{
                let rsp = outer_pb.DiaMarketAct.decode(d);
                if(rsp.ErrCode==Err.ErrCode_Success){
                    this.popHisList.array=rsp.HisList.sort((a,b)=>{return b.Time-a.Time});
                }
            })
        }
    }
    curChargedPrice:number
    refreshMarket=(curPrice:number)=>{
        this.sellBox.children.forEach((node,index)=>{
            const len=this.sellOrders.length;
            const i=4-index
            let order:DiaMarketOrder;
            if(i<len){
                order = this.sellOrders[i]
            }
            this.renderMarketOrder(node,order)
        })
        this.buyBox.children.forEach((node,index)=>{
            const len=this.buyOrders.length;
            let order:DiaMarketOrder;
            if(index<len){
                order = this.buyOrders[index]
            }
            this.renderMarketOrder(node,order)
        })
        this.curChargedPrice=curPrice;
        this.curPriceRich.string=`最近成交均价：<color=${ct.brown}>${curPrice/10} 点/袋</>（每袋＝<color=${ct.qing}>1000钻</>）`
    }
    renderMarketOrder=(node:Node,order:DiaMarketOrder)=>{
        let label1 = node.children[2].getComponent(Label);
        let label2 = node.children[3].getComponent(Label);
        if(order){
            label1.string=`${order.price/10} 点/袋`;
            label2.string=`${order.num} 袋`;          
        }else{
            label1.string='-';
            label2.string='-';
        }
    }
    onActBtnClick=()=>{
        if(GD.role.data.IsYkMode||GD.role.hasBaseYk()){
            const type = this.actTab.selectedIndex
            // if(this.curPrice<this.curChargedPrice*0.7||this.curPrice>this.curChargedPrice*1.3){
            //     UIMgr.I.tip('您的出价大幅偏离市场价格，无法下单')
            //     return
            // }
            if(this.curNum>0&&this.curPrice>0){
                let name:string
                let pre:string
                let needPoint:string
                let needDia:string
                let total=this.curNum*this.curPrice/10
                if(type==1){
                    if(GD.role.hasEnoughMuPoint(total)==false){
                        return;
                    }
                    name='下单求购钻石'
                    pre='求购'
                    needPoint=`（<color=${ct.red}>需预付点数：</><color=${ct.brown}>${Math.ceil(total)}</>）<br/><color=${ct.gray}>(多扣的小数部分将与成交差价一起返还至余额)</>`
                    needDia=''
                }else{
                    if(GD.role.hasEnoughDia(this.curNum*1000,false)==false){
                        UIMgr.I.tip('钻石不足（每袋1000钻石）')
                        return;
                    }
                    name='下单卖出钻石'
                    pre='卖出'
                    needPoint=''
                    needDia=`（<color=${ct.red}>需扣除钻石：</><color=${ct.qing}>${this.curNum*1000}</>）`
                }
                let msg=`是否【${name}】?<br/>${pre}数量：<color=${ct.qing}>${this.curNum} 袋</>${needDia}<br/>${pre}单价：<color=${ct.brown}>${this.curPrice/10} 点/袋</><br/>总价：<color=${ct.brown}>${total} 点</>${needPoint}`
                UIMgr.I.PopView.showMsgBox([new BoxMsg(msg,ct.white)],'下单',this.doAct,'取消')
            }else{
                UIMgr.I.tip('数量或单价不能为0')
            }
        }
    }
    doAct=()=>{
        let req=outer_pb.DiaMarketAct.create()
        req.Type=this.actTab.selectedIndex;
        req.Num=this.curNum;
        req.Price=this.curPrice;
        let buff = outer_pb.DiaMarketAct.encode(req).finish()
        WS.send(MT.CreatNewOrder,buff,(d:any)=>{
            let rsp = outer_pb.DiaMarketAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                this.onGetDiaShopData(rsp,false)
                if(req.Type==0){
                    GD.role.reduceDia(rsp.Num)
                }else{
                    GD.role.reduceMuPoint(rsp.Num)
                }
                this.refreshMyData(rsp)
                UIMgr.I.tip('下单成功',ct.green)
            }else if(rsp.ErrCode==Err.ErrCode_TooManyOrderNum){
                //无特权卡不允许操作
                UIMgr.I.tip('下单失败，超过最大订单数10')
            }else{
                //无特权卡不允许操作
                UIMgr.I.tip('下单失败'+rsp.ErrCode)
            }
        })
    }
}

class DiaMarketOrder{
    price:number
    num:number;
    constructor(price:number,num:number){
        this.price=price;
        this.num=num;
    }
}

