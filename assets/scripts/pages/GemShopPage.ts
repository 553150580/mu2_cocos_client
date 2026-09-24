import { _decorator, Component, EditBox, Label, Node, RichText, Slider, Sprite } from 'cc';
import { List } from '../UiComps/List';
import { BasePage } from './BasePage';
import { BoxMsg, ct, GemShopItem, ShopItem } from '../base/types';
import GD from '../base/GameData';
import Tools from '../base/tools';
import WS from '../base/net';
import { ConfigType, Err, MT } from '../base/MT';
import { Tab } from '../UiComps/Tab';
import { UIMgr } from '../managers/UIMgr';
import { ShowItemType } from './PopView';
const { ccclass, property } = _decorator;

@ccclass('GemShopPage')
export class GemShopPage extends BasePage {
    @property(Tab)
    tab:Tab
    @property(Tab)
    doTab:Tab
    @property(List)
    shopItemList:List
    @property(Node)
    infoBtn:Node
    @property(Node)
    doBtn:Node
    @property(Node)
    sliderBox:Node
    @property(Slider)
    slider:Slider
    @property(RichText)
    sliderInfo:RichText
    @property(EditBox)
    sliderNumInput:EditBox
    @property(Node)
    reduceBtn:Node
    @property(Node)
    addBtn:Node
    @property(Node)
    minBtn:Node;
    @property(Node)
    maxBtn:Node;

    selectedItem:GemShopItem;
    selectedNode:Node;
    onLoad(): void {
        super.onLoad()
        this.doTab.selectedHandler=(node:Node,index:number)=>{
            this.refreshDoBox()
            GD.playClickSound()
        }
        this.tab.selectedHandler=(node:Node,index:number)=>{
            if(index==1){
                let can=false
                if(GD.role.hasEnoughLv(380,false)){
                    can=true
                }else if(GD.role.data.OpenDayNum>=GD.configs.get(ConfigType.OpenKfDayNum)&&GD.role.hasEnoughLv(320,false)){
                    can=true
                }
                if(can==false){
                    this.tab.select(0)
                    UIMgr.I.tip("未达到开启条件")
                    return
                }
            }
            this.selectedNull();
            let req = outer_pb.NpcShopAct.create();
            req.IsKf = index==1;
            let buff = outer_pb.NpcShopAct.encode(req).finish();
            WS.send(MT.GetGemMarketItem,buff,(d:any)=>{
                let rsp=outer_pb.NpcShopAct.decode(d)
                if(rsp.ErrCode==Err.ErrCode_Success){
                   let arr:Array<GemShopItem>=[]
                    for(let key in rsp.GemMarket){
                        let id = parseInt(key)
                        let obj = rsp.GemMarket[key]
                        let item = new GemShopItem()
                        item.Id=id
                        item.Price=obj.Price
                        item.Num=obj.Num
                        let base = GD.gemShopItems.get(id)
                        item.Step=base.Step
                        item.iconId=base.iconId
                        item.name=base.name
                        arr.push(item)
                    }
                    this.shopItemList.array=arr                 
                }else{
                    UIMgr.I.tip("未达到开启条件1")
                }
            })
            GD.playClickSound()
        }
        this.shopItemList.cellRender = (node:Node,index:number)=>{
            node.children[0].active=node==this.selectedNode;
            let item:GemShopItem = this.shopItemList.array[index]
            let icon = node.children[3].getComponent(Sprite);
            let iconPath = item.Id<10000?'ui/item/':'ui/equip/';
            Tools.loadSpriteFrame(iconPath+item.iconId,GD.commonBundle).then(sp=>{
                icon.spriteFrame = sp;
            })
            let name=node.children[1].getComponent(Label)
            name.string = item.name;
            name.color.fromHEX(Tools.getItemColor(item.Id));
            node.children[6].getComponent(Label).string=item.Price.toLocaleString()
            let base = GD.gemShopItems.get(item.Id)
            node.children[4].getComponent(Label).string=`${item.Num}/${base.Num}`
        }
        this.shopItemList.selectedHandler = (node:Node,index:number)=>{
            let item:GemShopItem = this.shopItemList.array[index]
            this.selectedItem = item;
            this.selectedNode&&(this.selectedNode.children[0].active=false)
            this.selectedNode=node
            node.children[0].active=true
            this.sliderBox.active=true
            let n=this.doTab.selectedIndex;
            this.doTab.select(n>=0?n:0)
        }
        this.slider.node.on('slide',(slider:Slider)=>{
            this.curSliderValue = ((this.max-1)*slider.progress>>0)+1
            this.refreshSliderInfo()
        })
        this.reduceBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.curSliderValue>1){
                this.curSliderValue--
                this.updateSlider()
                this.refreshSliderInfo()
                GD.playClickSound()
            }
        },this);
        this.addBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.curSliderValue<this.max){
                this.curSliderValue++
                this.updateSlider()
                this.refreshSliderInfo()
                GD.playClickSound()
            }
        },this);
        this.minBtn.on(Node.EventType.TOUCH_END,()=>{
            this.curSliderValue=1
            this.updateSlider()
            this.refreshSliderInfo()
            GD.playClickSound()
        },this);
        this.maxBtn.on(Node.EventType.TOUCH_END,()=>{
            this.curSliderValue=this.max
            this.updateSlider()
            this.refreshSliderInfo()
            GD.playClickSound()
        },this);
        this.sliderNumInput.node.on('editing-did-ended', (eb:EditBox)=>{
            let num = parseInt(this.sliderNumInput.string)
            if(num>this.max){
                UIMgr.I.tip('超过最大值，已重置为最大值')
                num=this.max
            }else if(num<=0){
                num=1
            }
            this.curSliderValue=num
            this.updateSlider()
            this.refreshSliderInfo()
        }, this)
        this.doBtn.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.data.IsYkMode||GD.role.hasBaseYk()){
                const type = this.doTab.selectedIndex
                let item=this.selectedItem;
                const dia=this.curSliderValue*item.Price;
                if(type==0){
                    let myItem=GD.role.BagItems.find(i=>{return i.Id==item.Id})
                    if(myItem==null||myItem.Num<this.curSliderValue){
                        UIMgr.I.tip("数量不足")
                        return
                    }
                }else if(GD.role.hasEnoughDia(dia)==false){
                    return
                }
                let rate=0.9
                if(this.tab.selectedIndex==1){
                    rate=0.85
                }
                let info=`<br/>确定以单价<color=${ct.qing}>${item.Price}钻石</>`
                let after=''
                let btn=''
                if(type==0){
                    btn='售出'
                    after=`税后可得：<color=${ct.qing}>钻石x${dia*rate>>0}</>`
                }else{
                    btn='购买'
                    after=`合计需要：<color=${ct.qing}>钻石x${dia}</>`
                }
                info+=`${btn} <color=${Tools.getItemColor(item.Id)}>${item.name}x${this.curSliderValue}</>？<br/>${after}`
                UIMgr.I.PopView.showMsgBox([new BoxMsg(info,ct.brown)],btn,this.tryDo,'取消')
            }
        },this);
        this.infoBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.selectedItem){
                UIMgr.I.PopView.show(0,this.selectedItem,false,ShowItemType.NpcShopItem,'')
            }
        })
    }
    tryDo=()=>{
        let req = outer_pb.NpcShopAct.create();
        req.IsKf = this.tab.selectedIndex==1;
        let msgType=MT.BuyGemMarketItem
        if(this.doTab.selectedIndex==0){
            //售出
            msgType=MT.SellGemMarketItem
        }
        let item=this.selectedItem;
        let n=this.curSliderValue
        req.Id=item.Id
        req.Num=n
        req.Price=item.Price
        let buff = outer_pb.NpcShopAct.encode(req).finish();
        WS.send(msgType,buff,(d:any)=>{
            let rsp=outer_pb.NpcShopAct.decode(d)
            if(rsp.ErrCode==Err.ErrCode_Failed){
                UIMgr.I.tip("交易失败"+rsp.ErrCode)
            }else{
                item.Num=rsp.Num;
                item.Price=rsp.Price;
                this.shopItemList.refresh()
                if(rsp.ErrCode==Err.ErrCode_Success){
                    if(msgType==MT.BuyGemMarketItem){
                        GD.role.reduceDia(rsp.Cost)
                        GD.role.getItem(rsp.Id,n,true)
                    }else{
                        GD.role.addDia(rsp.Cost,true)
                        GD.role.reduceItem(rsp.Id,n)
                    }
                }else if(rsp.ErrCode==Err.ErrCode_PriceChanged){
                    UIMgr.I.tip("交易失败，价格改变了")
                }else if(rsp.ErrCode==Err.ErrCode_NotEnoughItem){
                    UIMgr.I.tip("道具不足")
                }else if(rsp.ErrCode==Err.ErrCode_NotEnoughNum){
                    UIMgr.I.tip("数量不足")
                }else if(rsp.ErrCode==Err.ErrCode_NotEnoughDia){
                    UIMgr.I.tip("钻石不足")
                }
                this.refreshDoBox();
            }
        })
    }
    max:number=1;
    curSliderValue:number=1;
    refreshDoBox=()=>{
        let item=this.selectedItem
        if(item){
            const base = GD.gemShopItems.get(item.Id)
            const n=this.doTab.selectedIndex;
            this.max=item.Num
            let btStr='买 入'
            let after=''
            if(n==0){
                //售出
                btStr='系统回收'
                this.max=base.Num-item.Num
                let myItem=GD.role.BagItems.find(i=>{return i.Id==item.Id})
                let hasNum=0
                if(myItem){
                    hasNum=myItem.Num
                    this.max = Math.min(myItem.Num,this.max)
                }
                after=`<br/><color=${ct.gray}>(背包拥有${hasNum}个,当前单价可卖${this.max}个)</>`
            }else{
                //买入
                this.max = Math.min(GD.role.data.Dia/item.Price>>0,this.max)
                if(this.max==0)this.max=1
            }
            let info=`<color=${Tools.getItemColor(item.Id)}>${base.name}${after}</><br/>当前市场单价：<color=${ct.qing}>${item.Price}钻石</>`
            this.sliderInfo.string=info
            this.curSliderValue=this.max
            this.doBtn.children[0].getComponent(Label).string=btStr
            this.updateSlider()
            this.refreshSliderInfo()
        }
    }
    refreshSliderInfo=()=>{
        this.sliderNumInput.string=this.curSliderValue+''
    }
    updateSlider(){
        if(this.max<=1){
            this.slider.progress = 0
        }else{
            this.slider.progress=(this.curSliderValue-1)/(this.max-1)
        }
    }
    selectedNull=()=>{
        this.selectedNode&&(this.selectedNode.children[0].active=false)
        this.selectedNode=null;
        this.selectedItem=null;
        this.shopItemList.array=[]
        this.sliderBox.active=false
    }
    initData(data: any): void {
        this.tab.select(0)
    }
    onHide(): void {
        this.selectedNull();
    }
}


