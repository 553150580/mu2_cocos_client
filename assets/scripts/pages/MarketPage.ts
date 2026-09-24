import { _decorator,  EditBox,  Label, Node, randomRange, resources, RichText, Slider, Sprite, SpriteFrame, Toggle, UITransform, Widget } from 'cc';
import { List } from '../UiComps/List';
import { Tab } from '../UiComps/Tab';
import { BasePage } from './BasePage';
import { ViewStack } from '../UiComps/ViewStack';
import Tools from '../base/tools';
import { BoxMsg, ChatChannelType,  ct,  Item,  ShopItemStatus } from '../base/types';
import { UIMgr } from '../managers/UIMgr';
import WS from '../base/net';
import { ConfigType, Err, MT } from '../base/MT';
import GD from '../base/GameData';
import { Data } from '../UiComps/Data';
import { EquipTypeStr, ItemFramePath, ItemTypeStr, MarketHelpStr, } from '../base/consts';
import GameManager from '../managers/GameManager';
const { ccclass, property } = _decorator;

const enum HistoryType{
    OrderBuyFailed, //竞购失败，退回资金
    Sell, //出售
    Buy, //购买获得
    OneBuy,
    DownSellCostDia
}

export const CanSellLockedEquip = '无法上架已锁定装备，请先解锁'
const HistoryTypeName = ['竞购失败退回','售出','买入','一口价买入','竞购下架手续费']
const HistoryColors = [ct.white,ct.blue,ct.green,ct.red,ct.yellow]
const HasSayStr = '最近喊过话了'
const NewStr = '摊位上新 '
const NoItemStr = '摊位没有商品'
const NoItemStr1 = '暂无匹配的商品'
const IsEmptyStr = '该玩家的摊位已售空'
const InputNameStr = '请先输入道具名字'
const UpSuccessStr = '上架成功'
const UpFailedStr0 = '上架失败'
const UpFailedStr1 = '上架失败，摊位货架已满'
const UpFailedDia = `你的摊位<color=${ct.qing}>库存钻石</>为负数，无法上架道具`
const UpFailedStr2 = `上架失败，摊位的<color=${ct.blue}>临时仓库</>满了`
const UpFailedStr3 = `上架失败，摊位<color=${ct.blue}>货架</>或<color=${ct.blue}>临时仓库</>已满`
const NoShopInfo = '暂无摊位信息'
const NoShopInfo2 = '您还没有摊位，点击注册一个'
const NoShopInfo1 = '您还没有摊位，请先前往市场注册一个'
const IsYouself = '这是您自己的商品'
const BuyFailed = `摊位<color=${ct.blue}>临时仓库</>已满，请先预留足够空间`
const HasOrdered ='您已参与该商品的竞购'
const NotEnoughDia = `摊位<color=${ct.qing}>库存钻石</>不足，请先存入足够钻石`
const NotEnoughPoint1 = `摊位<color=${ct.brown}>库存点数</>不足，请先存入足够点数`
const BuyFailed1 = `购买失败，您的摊位<color=${ct.blue}>临时仓库</>已满`
const BuyFailed2 = '购买失败，商品已下架'
const BuyFailed3 = '购买失败，价格已被修改'
const BuySuccess = '购买成功'
const OrderSuccess = '竞购成功'
const GetOkStr = '取回成功'
const GetFailedStr = '取回失败'
// const ResetOkStr = '修改成功'
// const ResetFailedStr = '修改失败'
// const ResetFailedStr1 = '无法修改，有人竞购了'
// const ResetFailedStr2 = '价格没变'
const DownSuccessStr = '下架成功'
const DownFailedStr = '下架失败'
const LoadShopStr = '加载摊位中...'
const RegistOk = '注册成功'
const RegistFailed = '注册失败'
// const OneBuyStr = '一口价买\n(2倍单价)'
// const DownStr = "下架"
// const SetPriceStr = '修改价格'
// const GetStr = '取回'
// const ReUpStr = '重新上架'
// const UpStr ='上架'
const PushDiaOkStr =`存入成功，摊位<color=${ct.qing}>库存钻石</>+`
// const PushPointOkStr =`存入成功，摊位<color=${ct.brown}>库存点数</>+`
const PushMoneyFailedStr ='存入失败'
const PopDiaOkStr =`取出成功，<color=${ct.qing}>钻石</>+`
// const PopPointOkStr =`取出成功，<color=${ct.brown}>点数</>+`
const PopDiaFailedStr ='取出失败'
const NoSearchStr ='没有匹配项'
const BigerMaxStr ='超过最大值，已重置为最大值'
const NotEnoughGold = `您的<color=${ct.yellow}>金币</>不足100万`
// const NotEnoughDia2 = `您的<color=${ct.qing}>钻石</>不足1000`
// const NotEnoughPoint = `您的<color=${ct.brown}>奇迹点数</>不足`
const NotEnoughDia1 = `您的<color=${ct.qing}>钻石</>不足`
const ZeroStr = '余额不足'
const ShopDiaStr = '摊位库存钻石'
const ShopPointStr = '摊位库存点数'
const GetStr1 = '取出'
const PutStr1 = '存入'
const YourDiaStr = '您的钻石x'
// const YourPointStr = '您的点数x'

@ccclass('MarketPage')
export class MarketPage extends BasePage {
    @property(Label)
    head:Label
    @property(Tab)
    mainTab:Tab
    @property(ViewStack)
    view:ViewStack
    @property(List)
    itemList:List
    @property(Tab)
    itemTypeTab:Tab

    @property(List)
    otherShopList:List
    @property(Label)
    otherName:Label
    @property(Node)
    getMarketBtn:Node
    @property(Node)
    prePageBtn:Node
    @property(Node)
    nextPageBtn:Node
    @property(Label)
    pageLabel:Label
    @property(Node)
    tabs:Node
    @property(EditBox)
    searchEB:EditBox
    @property(Tab)
    searchTab:Tab
    @property(Toggle)
    sortTypeToggle:Toggle
    @property(Tab)
    sortTypeTab:Tab
    @property(Toggle)
    minItemTypeToggle:Toggle
    @property(Tab)
    minItemTypeTab:Tab
    @property(Toggle)
    roleTypeToggle:Toggle
    @property(Tab)
    roleTypeTab:Tab
    @property(Toggle)
    equipLvToggle:Toggle
    @property(Tab)
    equipLvTab:Tab
    @property(Toggle)
    pinZiToggle:Toggle
    @property(Tab)
    pinZiTab:Tab
    @property(Toggle)
    zyTypeToggle:Toggle
    @property(Tab)
    zyTypeTab:Tab

    @property(List)
    historyList:List
    @property(Node)
    registeBox:Node
    @property(Node)
    registeBtn:Node
    @property(Label)
    registeLabel:Label
    @property(List)
    myShopList:List
    @property(List)
    bagList:List
    @property(Tab)
    bagTab:Tab
    @property(Toggle)
    bagTypeToggle:Toggle
    @property(Tab)
    bagTypeTab:Tab
    @property(Tab)
    shopTab:Tab
    @property(Label)
    shopCap:Label
    // @property(Sprite)
    // moneySkin:Sprite
    @property(Label)
    shopMoney:Label
    // @property(Label)
    // shopPoint:Label
    @property(Node)
    sellGold:Node
    @property(Node)
    popMoney:Node
    @property(Node)
    pushMoney:Node
    // @property(Node)
    // popPoint:Node
    // @property(Node)
    // pushPoint:Node
    // @property(Node)
    // sellPoint:Node
    // @property(Node)
    // sellDia:Node
    @property(Node)
    refreshH:Node
    @property(Node)
    say:Node

    
    @property(Node)
    compareBox:Node;
    @property(RichText)
    compareRich1:RichText;
    @property(RichText)
    compareRich2:RichText;
    @property(Node)
    infoBox:Node;
    @property(Node)
    infoFrame:Node;
    @property(RichText)
    richText:RichText;
    @property(Node)
    numBox:Node;
    @property(Node)
    leftBtn:Node;
    @property(Node)
    rightBtn:Node;
    @property(Label)
    statusInfo:Label;
    @property(Label)
    deltaPrice:Label;
    @property(Node)
    addBtn:Node;
    @property(Node)
    reduceBtn:Node;
    @property(EditBox)
    numEdit:EditBox;
    @property(EditBox)
    price1Edit:EditBox;
    @property(Label)
    priceAll:Label;
    // @property(Label)
    // perPrice:Label;
    @property(Slider)
    slider:Slider;
    @property(Node)
    helpBtn:Node;
    @property(Node)
    closeBtn:Node;
    @property(Sprite)
    coinIcon1:Sprite;
    @property(Sprite)
    coinIcon2:Sprite;
    // @property(Tab)
    // priceTypeTab:Tab;
    @property(Widget)
    priceBoxTrans:Widget
    
    diaIcon:SpriteFrame;
    pointIcon:SpriteFrame;
    // @property(Node)
    // infoBox:Node
    // @property(RichText)
    // infoText:RichText
    minTypeStrs:Array<string>=[
        EquipTypeStr,
        ItemTypeStr,
    ]
    myShop:outer_pb.IShop;
    historys:Array<outer_pb.IShopHistory>=[];
    kfHistorys:Array<outer_pb.IShopHistory>=[];
    selectedBagItem:Item;
    selectedShopItem:outer_pb.IShopItem
    timeLabels:Array<Label>=[]
    updateLabels() {
        if(this.timeLabels.length>0){
            this.timeLabels.forEach(d=>{
                let data = d.getComponent(Data)
                let obj = Tools.getShopItemPendingTime(data.data);
                d.string = obj.str
                d.color.fromHEX(obj.color)
            })
        }
    }
    onLoad(): void {
        super.onLoad();
        Tools.loadSpriteFrame("ui/item/15",GD.commonBundle).then(sp=>{
            this.diaIcon = sp;
        })
        Tools.loadSpriteFrame("ui/item/3",GD.commonBundle).then(sp=>{
            this.pointIcon = sp;
        })
        this.node.on('refreshBag',this.refreshBag)
        this.itemTypeTab.selectedHandler=(node,index)=>{
            this.searchTab.node.active=false;
            this.searchEB.node.active = index==4;
            let showTabs = index==1||index==2;
            this.tabs.active = showTabs;
            this.sortTypeTab.select(0)
            this.zyTypeTab.select(0)
            if(showTabs){
                this.equipLvToggle.node.active = this.pinZiToggle.node.active= this.zyTypeToggle.node.active = index==1
                // this.roleTypeToggle.node.active = index!=3
                this.roleTypeTab.select(0)
                this.minItemTypeTab.labels = this.minTypeStrs[index-1]
                this.minItemTypeTab.select(0)
                this.minItemTypeTab.node.getComponent(Widget).bottom = 55;
            }
            this.getMarket(1)
        }
        // this.minItemTypeTab.needReset=false
        this.minItemTypeTab.selectedHandler=(node:Node,index)=>{
            this.minItemTypeToggle.isChecked=false;
            this.minItemTypeToggle.node.children[1].getComponent(Label).string=node.children[1].getComponent(Label).string;
            // this.getMarket(this.cur_page);
        }
        // this.sortTypeTab.needReset=false
        this.sortTypeTab.selectedHandler=(node:Node,index)=>{
            this.sortTypeToggle.isChecked=false;
            this.sortTypeToggle.node.children[1].getComponent(Label).string=node.children[1].getComponent(Label).string;
            if(this.cur_totalPage==1){
                this.sortShopList(this.itemList.array)
            }
        }
        // this.roleTypeTab.needReset=false
        this.roleTypeTab.selectedHandler=(node:Node,index)=>{
            this.roleTypeToggle.isChecked=false;
            this.roleTypeToggle.node.children[1].getComponent(Label).string=node.children[1].getComponent(Label).string;
            // this.getMarket(this.cur_page);
        }
        this.equipLvTab.select(0)
        // this.equipLvTab.needReset=false
        this.equipLvTab.selectedHandler=(node:Node,index)=>{
            this.equipLvToggle.isChecked=false;
            this.equipLvToggle.node.children[1].getComponent(Label).string=node.children[1].getComponent(Label).string;
            // this.getMarket(this.cur_page);
        }
        this.pinZiTab.select(0)
        // this.pinZiTab.needReset=false
        this.pinZiTab.selectedHandler=(node:Node,index)=>{
            this.pinZiToggle.isChecked=false;
            this.pinZiToggle.node.children[1].getComponent(Label).string=node.children[1].getComponent(Label).string;
            // this.getMarket(this.cur_page);
        }
        this.zyTypeTab.select(0)
        this.zyTypeTab.selectedHandler=(node:Node,index)=>{
            this.zyTypeToggle.isChecked=false;
            this.zyTypeToggle.node.children[1].getComponent(Label).string=node.children[1].getComponent(Label).string;
            // this.getMarket(this.cur_page);
        }
        this.mainTab.selectedHandler=(node,index)=>{
            this.timeLabels=[]; 
            this.unschedule(this.updateLabels);
            this.view.selectedIndex=index;
            if(index==0){
                // this.getMarket()
                this.itemList.array=[];
                this.itemTypeTab.select(0)
                // this.getMarket(1)
            }else if(index==1){
                this.getNewHistory()
            }else{
                this.getMyShop()
            }
        }
        this.historyList.cellRender = (node:Node,index:number)=>{
            let hitory:outer_pb.IShopHistory = this.historyList.array[index];
            let nameLabel = node.children[0].getComponent(Label);
            nameLabel.string = hitory.Name;
            nameLabel.color.fromHEX(HistoryColors[hitory.Color]);
            node.children[1].getComponent(Label).string = Tools.formatTimestamp(hitory.Time as number)
            let labelType = node.children[2].getComponent(Label)
            let price = node.children[4].getComponent(Label)
            let num = hitory.Price.toLocaleString();
            let price_color = ct.red;
            if(hitory.Price>0){
                price_color=ct.green
            }
            price.string=num
            price.color.fromHEX(price_color);
            let icon = node.children[5].getComponent(Sprite)
            if(hitory.PriceType==0){
                icon.spriteFrame=this.diaIcon
            }else{
                icon.spriteFrame=this.pointIcon
            }
            let type_color = ct.green;
            if(hitory.Type==HistoryType.OrderBuyFailed||hitory.Type==HistoryType.DownSellCostDia){
                type_color = ct.red;
            }
            labelType.string=HistoryTypeName[hitory.Type]
            labelType.color.fromHEX(type_color);
        }
        this.itemList.cellRender = (node:Node,index:number)=>{
            this.renderShopItems(this.itemList,node,index,true,false)
        }
        this.itemList.selectedHandler = (node:Node,index:number)=>{
            this.selectedShopItem = this.itemList.array[index]
            this.showInfoBox(2);
        }
        this.myShopList.cellRender = (node:Node,index:number)=>{
            this.renderShopItems(this.myShopList,node,index,false,this.shopTab.selectedIndex==1)
        }
        this.myShopList.selectedHandler = (node:Node,index:number)=>{
            this.selectedShopItem = this.myShopList.array[index]
            this.showInfoBox(1);
        }
        this.otherShopList.cellRender = (node:Node,index:number)=>{
            this.renderShopItems(this.otherShopList,node,index,true,false)
        }
        this.otherShopList.selectedHandler = (node:Node,index:number)=>{
            this.selectedShopItem = this.otherShopList.array[index]
            this.showInfoBox(2);
        }
        this.bagList.cellRender = (node:Node,index:number)=>{
            let item:any = this.bagList.array[index];
            Tools.renderBagItem(this.bagTab.selectedIndex,item,node)
            let lock = node.children[3]
            if(this.bagTab.selectedIndex==0){
                lock.active = item.IsLock
            }else{
                lock.active = false;
            }
        }
        this.bagList.selectedHandler = (node:Node,index:number)=>{
            this.selectedBagItem = this.bagList.array[index]
            this.showInfoBox(0);
        }
        this.bagTypeTab.selectedHandler=(node:Node,index)=>{
            Tools.filterBagLit(this.bagTypeToggle,node,this.bagTab.selectedIndex,index,this.bagList,false)
        }
        this.bagTab.selectedHandler = (node:Node,index:number)=>{
            if(index==0){
                this.bagTypeTab.labels=EquipTypeStr
                this.bagList.array=GD.role.BagEquips
            }else{
                this.bagTypeTab.labels=ItemTypeStr
                this.bagList.array=GD.role.BagItems
            }
            this.bagTypeTab.node.getComponent(Widget).verticalCenter=0
            this.bagTypeTab.select(0)
            this.bagList.scrollToTop();
        }
        this.shopTab.selectedHandler = (node:Node,index:number)=>{
            this.refreshMyShopList(index)
        }
        this.refreshH.on(Node.EventType.TOUCH_END,this.getNewHistory,this);
        this.say.on(Node.EventType.TOUCH_END,this.sayMsg,this);
        this.infoBox.on(Node.EventType.TOUCH_END,()=>{this.infoBox.active=false},this);
        this.sellGold.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.data.Gold as number>1000000){
                this.selectedBagItem = new Item(400,(GD.role.data.Gold as number)/1000000>>0,false)
                this.showInfoBox(0,true,0);
            }else{
                UIMgr.I.tip(NotEnoughGold)
            }
        },this);
        // this.sellDia.on(Node.EventType.TOUCH_END,()=>{
        //     if(GD.role.data.Dia>1000){
        //         this.selectedBagItem = new CountItem(401,(GD.role.data.Dia as number)/1000>>0)
        //         this.showInfoBox(0,true,1);
        //     }else{
        //         UIMgr.I.tip(NotEnoughDia2)
        //     }
        // },this);
        // this.sellPoint.on(Node.EventType.TOUCH_END,()=>{
        //     if(GD.role.data.MuPoint>0){
        //         this.selectedBagItem = new CountItem(3,GD.role.data.MuPoint as number)
        //         this.showInfoBox(0,true,2);
        //     }else{
        //         UIMgr.I.tip(NotEnoughPoint)
        //     }
        // },this);
        this.helpBtn.on(Node.EventType.TOUCH_END,()=>{
            GD.playClickSound();
            UIMgr.I.PopView.showHelpBox(MarketHelpStr)
        },this);
        this.closeBtn.on(Node.EventType.TOUCH_END,()=>{
            UIMgr.I.hideCurPage()
        },this);
        this.popMoney.on(Node.EventType.TOUCH_END,()=>{
            //取出钻石
            if(this.myShop.Dia>0){
                UIMgr.I.PopView.showSliderBox(`${ShopDiaStr}x${this.myShop.Dia}`,ct.qing,this.myShop.Dia as number,GetStr1,this.onPopDia)
            }else{
                UIMgr.I.tip(ZeroStr)
            }
            // if(this.isKf){
            //     //取出点数
            //     if(this.myShop.MuPoint>0){
            //         UIMgr.I.PopView.showSliderBox(`${ShopPointStr}x${this.myShop.MuPoint}`,ct.brown,this.myShop.MuPoint,GetStr1,this.onPopPoint)
            //     }else{
            //         UIMgr.I.tip(ZeroStr)
            //     }
            // }else{
            //     //取出钻石
            //     if(this.myShop.Dia>0){
            //         UIMgr.I.PopView.showSliderBox(`${ShopDiaStr}x${this.myShop.Dia}`,ct.qing,this.myShop.Dia as number,GetStr1,this.onPopDia)
            //     }else{
            //         UIMgr.I.tip(ZeroStr)
            //     }
            // }
        },this);
        this.pushMoney.on(Node.EventType.TOUCH_END,()=>{
            //存入钻石
            if(GD.role.data.Dia>0){
                UIMgr.I.PopView.showSliderBox(`${YourDiaStr}${GD.role.data.Dia.toLocaleString()}`,ct.qing,GD.role.data.Dia as number,PutStr1,this.onPushDia)
            }else{
                UIMgr.I.tip(NotEnoughDia1)
            }
            // if(this.isKf){
            //     //存入点数
            //     if(GD.role.data.MuPoint>0){
            //         UIMgr.I.PopView.showSliderBox(`${YourPointStr}${GD.role.data.MuPoint.toLocaleString()}`,ct.brown,GD.role.data.MuPoint,PutStr1,this.onPushPoint)
            //     }else{
            //         UIMgr.I.tip(NotEnoughPoint)
            //     }
            // }else{
            //     //存入钻石
            //     if(GD.role.data.Dia>0){
            //         UIMgr.I.PopView.showSliderBox(`${YourDiaStr}${GD.role.data.Dia.toLocaleString()}`,ct.qing,GD.role.data.Dia as number,PutStr1,this.onPushDia)
            //     }else{
            //         UIMgr.I.tip(NotEnoughDia1)
            //     }
            // }
        },this);
        // this.popPoint.on(Node.EventType.TOUCH_END,()=>{
        //     //取出点数
        //     if(this.myShop.MuPoint>0){
        //         UIMgr.I.PopView.showSliderBox(`${ShopPointStr}x${this.myShop.MuPoint}`,ct.brown,this.myShop.MuPoint,GetStr1,this.onPopPoint)
        //     }else{
        //         UIMgr.I.tip(ZeroStr)
        //     }
        // },this);
        // this.pushPoint.on(Node.EventType.TOUCH_END,()=>{
        //     //存入点数
        //     if(this.isKf){
        //         if(GD.role.data.MuPoint>0){
        //             UIMgr.I.PopView.showSliderBox(`${YourPointStr}${GD.role.data.MuPoint.toLocaleString()}`,ct.brown,GD.role.data.MuPoint,PutStr1,this.onPushPoint)
        //         }else{
        //             UIMgr.I.tip(NotEnoughPoint)
        //         }
        //     }
        // },this);
        // this.priceTypeTab.selectedHandler=(node,index)=>{
        //     if(index==0){
        //         this.coinIcon1.spriteFrame=this.diaIcon
        //         this.coinIcon2.spriteFrame=this.diaIcon
        //     }else{
        //         this.coinIcon1.spriteFrame=this.pointIcon
        //         this.coinIcon2.spriteFrame=this.pointIcon
        //     }
        // }
        this.addBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.infoMode!=1&&this.cur_num<this.cur_max_num){
                // if(this.infoMode==2&&(Date.now()/1000>>0)-(this.selectedShopItem.EndTime as number)<this.PendTime){
                // if(this.infoMode==2&&(Date.now()/1000>>0)<=(this.selectedShopItem.EndTime as number)){
                if(this.infoMode==2&&this.selectedShopItem.Status!=ShopItemStatus.StatusAvailable){
                    UIMgr.I.tip('竞购期间无法分批购买')
                    return
                }
                this.cur_num++;
                this.refreshNumUI()
            }
        },this);
        this.reduceBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.infoMode!=1&&this.cur_num>1){
                // if(this.infoMode==2&&(Date.now()/1000>>0)-(this.selectedShopItem.StartTime as number)<this.PendTime){
                if(this.infoMode==2&&this.selectedShopItem.Status!=ShopItemStatus.StatusAvailable){
                    UIMgr.I.tip('竞购期间无法分批购买')
                    return
                }
                this.cur_num--;
                this.refreshNumUI()
            }
        },this);
        this.registeBtn.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.data.IsYkMode||GD.role.hasBaseYk()){
                this.registeShop()
            }
        },this);
        this.getMarketBtn.on(Node.EventType.TOUCH_END,()=>{
            this.searchTab.node.active=false;
            this.getMarket(1)
        },this);
        this.prePageBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.cur_page>1){
                this.cur_page--;
                this.getMarket(this.cur_page)
            }
        },this);
        this.nextPageBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.cur_page<this.cur_totalPage){
                this.cur_page++;
                this.getMarket(this.cur_page)
            }
        },this);
        this.numEdit.node.on('editing-did-ended', (eb:EditBox)=>{
            // if(this.isKf&&this.infoMode!=0)return;
            if(this.infoMode!=1){ //临时仓库道具、已上架的我的商品不能改数量
                // if(this.infoMode==2&&(Date.now()/1000>>0)-(this.selectedShopItem.StartTime as number)<this.PendTime){
                if(this.infoMode==2&&this.selectedShopItem.Status!=ShopItemStatus.StatusAvailable){
                    eb.string=this.cur_num+'';
                    UIMgr.I.tip('竞购期间无法分批购买')
                    return
                }
                this.cur_num = parseInt(eb.string)
                if(this.cur_num>this.cur_max_num){
                    UIMgr.I.tip(BigerMaxStr)
                    this.cur_num=this.cur_max_num
                }else if(this.cur_num<=0){
                    this.cur_num=1
                }
            }
            this.refreshNumUI()
        }, this)
        this.price1Edit.node.on('editing-did-ended', (eb:EditBox)=>{
            if(this.infoMode!=2){ //不能改价 this.cur_price不变
                this.cur_price = parseInt(eb.string)
                if(this.cur_price<2){
                    this.cur_price=2
                }
            }
            this.refreshNumUI()
        }, this)
        this.slider.node.on('slide',(slider:Slider)=>{
            if(this.infoMode!=1){
                // if(this.infoMode==2&&(Date.now()/1000>>0)-(this.selectedShopItem.StartTime as number)<this.PendTime){
                if(this.infoMode==2&&this.selectedShopItem.Status!=ShopItemStatus.StatusAvailable){
                    UIMgr.I.tip('竞购期间无法分批购买')
                    return
                }
                this.cur_num = ((this.cur_max_num-this.cur_min_num)*slider.progress>>0)+this.cur_min_num
                this.numEdit.string=this.cur_num+''
                this.priceAll.string = this.cur_price*this.cur_num+''
                // if(this.isKf){
                //     this.priceAll.string = this.cur_price+''
                // }else{
                //     this.priceAll.string = this.cur_price*this.cur_num+''
                // }
            }
        })
        this.searchEB.node.on('text-changed', (eb:EditBox)=>{
            let name = eb.string;
            this.searchItem(name);
        }, this)
        this.searchEB.node.on('editing-did-began', (eb:EditBox)=>{
            this.searchTab.labels = '';
            let name = eb.string;
            this.searchItem(name)
        }, this)
        this.searchTab.selectedHandler = (node,index)=>{
            this.searchTab.node.active=false;
            this.searchEB.string = node.children[1].getComponent(Label).string;
            if(this.searchedItems.length>0) {
                let id = this.searchedItems[index].Id;
                this.getMarket(1,id);
            }
        }
    }
    // PendTime:number=0
    // protected onEnable(): void {
    //     this.PendTime = GD.configs.get(ConfigType.PendTime)
    // }
    cur_num:number=1;
    cur_max_num:number=1;
    cur_min_num:number=1;
    cur_price:number=2;
    refreshNumUI(){
        this.numEdit.string=this.cur_num+''
        let progress=0;
        if(this.cur_max_num>this.cur_min_num){
            progress=(this.cur_num-this.cur_min_num)/(this.cur_max_num-this.cur_min_num)
        }
        this.slider.progress=progress;
        this.priceAll.string = this.cur_price*this.cur_num+''
        // let per='单价'
        // if(this.isKf){
        //     per='总价'
        //     this.priceAll.string = this.cur_price+''
        // }else{
        //     this.priceAll.string = this.cur_price*this.cur_num+''
        // }
        // this.perPrice.string=per
        this.price1Edit.string=this.cur_price+'';
    }
    searchedItems:Array<any>=[];
    searchItem=(name:string)=>{
        this.searchedItems = [];
        if(name!=''){
            this.searchTab.node.active=true;
            let namestrs = []
            GD.EquipBaseDatas.forEach((equip,id)=>{
                if(equip.Name.indexOf(name)!=-1){
                    this.searchedItems.push({Id:id,Name:equip.Name})
                    namestrs.push(equip.Name);
                }
            })
            GD.ItemBaseDatas.forEach((item,id)=>{
                if(item.Name.indexOf(name)!=-1){
                    this.searchedItems.push({Id:id,Name:item.Name})
                    namestrs.push(item.Name);
                }
            })
            let n = namestrs.length
            if(n>0){
                this.searchTab.labels = namestrs.join(',')
                this.searchTab.getComponent(Widget).bottom=55;
            }else{
                this.searchTab.labels = NoSearchStr
            }
        }
    }
    onPopDia=(num:number)=>{
        if(this.myShop&&this.myShop.Dia as number>0 && num>0 && num<=(this.myShop.Dia as number)){
            let req = outer_pb.MoneyAct.create();
            req.Num = num
            req.IsKf=this.isKf;
            let buff = outer_pb.MoneyAct.encode(req).finish();
            // console.log('popDia',num)
            WS.send(MT.PopShopDia,buff,(d:any)=>{
                let rsp=outer_pb.MoneyAct.decode(d);
                // console.log('onPopDia',rsp)
                if(rsp.ErrCode==Err.ErrCode_Success){
                    (this.myShop.Dia as number) -= rsp.Num as number;
                    this.shopMoney.string=this.myShop.Dia.toLocaleString();
                    (GD.role.data.Dia as number) += rsp.Num as number;
                    UIMgr.I.refreshDiaUI()
                    UIMgr.I.tip(`${PopDiaOkStr}${rsp.Num}`,ct.green)
                }else{
                    UIMgr.I.tip(PopDiaFailedStr)
                }
            })
        }
    }
    onPushDia=(num:number)=>{
        if(this.myShop && GD.role.data.Dia as number>0 && num>0 && num<=(GD.role.data.Dia as number)){
            let req = outer_pb.MoneyAct.create();
            req.Num = num
            req.IsKf=this.isKf;
            // console.log('pushDia',num)
            let buff = outer_pb.MoneyAct.encode(req).finish();
            WS.send(MT.PushDiaToShop,buff,(d:any)=>{
                let rsp=outer_pb.MoneyAct.decode(d);
                // console.log('onPushDia',rsp)
                if(rsp.ErrCode==Err.ErrCode_Success){
                    (this.myShop.Dia as number) += rsp.Num as number;
                    this.shopMoney.string=this.myShop.Dia.toLocaleString();
                    (GD.role.data.Dia as number) -= rsp.Num as number;
                    UIMgr.I.refreshDiaUI()
                    UIMgr.I.tip(`${PushDiaOkStr}${rsp.Num}`,ct.green)
                }else{
                    UIMgr.I.tip(PushMoneyFailedStr)
                }
            })
        }
    }
    // onPopPoint=(num:number)=>{
    //     if(this.myShop&&this.myShop.MuPoint>0 && num>0 && num<=(this.myShop.MuPoint as number)){
    //         let req = outer_pb.MoneyAct.create();
    //         req.Num = num
    //         req.IsKf=this.isKf;
    //         let buff = outer_pb.MoneyAct.encode(req).finish();
    //         // console.log('onPopPoint',num)
    //         WS.send(MT.PopShopPoint,buff,(d:any)=>{
    //             let rsp=outer_pb.MoneyAct.decode(d);
    //             // console.log('onPopPoint',rsp)
    //             if(rsp.ErrCode==Err.ErrCode_Success){
    //                 (this.myShop.MuPoint as number) -= rsp.Num as number;
    //                 this.shopMoney.string=this.myShop.MuPoint.toLocaleString();
    //                 (GD.role.data.MuPoint as number) += rsp.Num as number;
    //                 UIMgr.I.refreshMuPointUI()
    //                 UIMgr.I.tip(`${PopPointOkStr}${rsp.Num}`,ct.green)
    //             }else{
    //                 UIMgr.I.tip(PopDiaFailedStr)
    //             }
    //         })
    //     }
    // }
    // onPushPoint=(num:number)=>{
    //     if(this.myShop && GD.role.data.MuPoint as number>0 && num>0 && num<=(GD.role.data.MuPoint as number)){
    //         let req = outer_pb.MoneyAct.create();
    //         req.Num = num
    //         req.IsKf=this.isKf;
    //         // console.log('onPushPoint',num)
    //         let buff = outer_pb.MoneyAct.encode(req).finish();
    //         WS.send(MT.PushPointToShop,buff,(d:any)=>{
    //             let rsp=outer_pb.MoneyAct.decode(d);
    //             // console.log('onPushPoint',rsp)
    //             if(rsp.ErrCode==Err.ErrCode_Success){
    //                 (this.myShop.MuPoint as number) += rsp.Num as number;
    //                 this.shopMoney.string=this.myShop.MuPoint.toLocaleString();
    //                 (GD.role.data.MuPoint as number) -= rsp.Num as number;
    //                 UIMgr.I.refreshMuPointUI()
    //                 UIMgr.I.tip(`${PushPointOkStr}${rsp.Num}`,ct.green)
    //             }else{
    //                 UIMgr.I.tip(PushMoneyFailedStr)
    //             }
    //         })
    //     }
    // }
    switchPriceTypeTab(priceType:number,show:boolean){
        if(priceType==0){
            this.coinIcon1.spriteFrame=this.diaIcon
            this.coinIcon2.spriteFrame=this.diaIcon
        }else{
            this.coinIcon1.spriteFrame=this.pointIcon
            this.coinIcon2.spriteFrame=this.pointIcon
        }
        // this.priceTypeTab.select(priceType)
        // this.priceTypeTab.node.active=show;
        // this.priceBoxTrans.top=show?62:0;
    }
    infoMode:number=0;//0表示bagItem，1表示myShopItem，2表示shopItem,3表示上架金币,4表示上架点数,5表示对比模式
    showInfoBox(infoMode:number,isMoney:boolean=false,moneyType:number=0){
        this.cur_min_num=1;
        this.infoMode=infoMode;
        this.infoBox.active=true;
        this.leftBtn.off(Node.EventType.TOUCH_END);
        this.rightBtn.off(Node.EventType.TOUCH_END);
        let rightLabel=this.rightBtn.children[0].getComponent(Label);
        let info=''
        let dp=''
        let rightColor=ct.white;
        let dpColor=ct.qing;
        let rightBtnStr=''
        let showRightBtn=true
        if(infoMode==0){
            //背包
            this.cur_price=2
            this.switchPriceTypeTab(0,true)
            // if(isMoney){
            //     let priceType=0 //上架金币时，价格只能为钻石
            //     // let priceType=this.isKf?1:0 //上架金币时，价格只能为：本服钻石、跨服点数
            //     if(moneyType==1){
            //         priceType=1 //上架钻石时，价格只能为点数
            //     }
            //     if(moneyType==2) this.cur_price=10
            //     this.switchPriceTypeTab(priceType,false)
            // }else{
            //     this.switchPriceTypeTab(0,true)
            //     // this.switchPriceTypeTab(this.isKf?1:0,true)
            // }
            this.leftBtn.active=false;
            rightBtnStr='上架'
            this.rightBtn.on(Node.EventType.TOUCH_END,()=>{
                this.upSell(isMoney)
            });
            // this.bagItemType = bagItemType
            if(this.bagTab.selectedIndex==0&&isMoney==false){
                this.cur_num=this.cur_max_num = 1
                this.numBox.active=false;
                Tools.showEquip(this.selectedBagItem,this.richText,null)
            }else{
                this.numBox.active=true;
                this.addBtn.active=this.reduceBtn.active=this.slider.node.active=true;
                const num = this.selectedBagItem.Num
                this.cur_num=this.cur_max_num = num>9999?9999:num;
                Tools.showItem(this.selectedBagItem.Id,this.selectedBagItem.Num,this.richText,null)
            }
        }else {
            this.switchPriceTypeTab(this.selectedShopItem.PriceType,false)
            this.cur_price=this.selectedShopItem.CurPrice as number;
            let leftBtnLabel=this.leftBtn.children[0].getComponent(Label)
            if(infoMode==1){
                //我的摊位
                this.leftBtn.active=true;
                // let left_cb:()=>void
                // let left_str:string
                let right_cb:()=>void
                if(this.shopTab.selectedIndex==0){
                    //摊位商品
                    // left_cb = this.downSell
                    // left_str = DownStr
                    right_cb = this.downSell
                    rightBtnStr = '下架'
                    this.leftBtn.active=false;
                }else{
                    //临时仓库
                    this.leftBtn.active=true;
                    // left_cb = this.downShopCkItemToBag
                    // left_str = GetStr
                    this.leftBtn.on(Node.EventType.TOUCH_END,this.downShopCkItemToBag)
                    leftBtnLabel.string='取回'
                    right_cb = this.reUpSell
                    rightBtnStr = '重新上架'
                }
                this.rightBtn.on(Node.EventType.TOUCH_END,right_cb)
                this.addBtn.active=this.reduceBtn.active=this.slider.node.active=false;
            }else{
                //商品列表
                // let isPending = (Date.now()/1000>>0)-(this.selectedShopItem.StartTime as number)<this.PendTime
                let isPending = this.selectedShopItem.Status==ShopItemStatus.StatusPending//(Date.now()/1000>>0)<=(this.selectedShopItem.EndTime as number)
                let show = !isPending
                // if(this.isKf) show=false
                this.addBtn.active=this.reduceBtn.active=this.slider.node.active=show;
                // let canAddPrice = false;
                let buyType=0;
                rightBtnStr='竞购'
                let hasOrdered=false
                let isMy = this.selectedShopItem.Owner == GD.role.data.Id;
                if(isPending){
                    //我参与了预购，才能加价
                    hasOrdered = this.selectedShopItem.PreOrders.findIndex(Id=>{return Id==GD.role.data.Id})>-1
                    // let num = this.selectedShopItem.PreOrders.length;
                    // canAddPrice= hasOrdered && num>1;
                    // if(canAddPrice){
                    if(hasOrdered){
                        buyType=1;
                        rightBtnStr='加价'
                        rightColor=ct.brown;
                        let up=this.selectedShopItem.CurPrice/10>>0;
                        if(up==0){
                            up=1
                        }
                        let t=this.selectedShopItem.PriceType;
                        let need=up*this.selectedShopItem.ItemNum
                        // if(this.isKf) need = up;
                        dp=`需补:${need}${t==0?'钻':'点'}`
                        dpColor=t==0?ct.qing:ct.brown;
                    }
                    // if(hasOrdered&&num==1){
                    //     info='您当前价的唯一竞购者'
                    // }
                }else{
                    rightBtnStr='购买'
                }
                showRightBtn = isMy==false;
                if(showRightBtn&&this.selectedShopItem.ItemType==1){
                    this.leftBtn.active=true;
                    leftBtnLabel.string='对比'
                    this.leftBtn.on(Node.EventType.TOUCH_END,this.onCompare)
                }else{
                    this.leftBtn.active=false;
                }
                // showRightBtn = isMy==false&&(canAddPrice||hasOrdered==false)
                if(showRightBtn){
                    this.rightBtn.on(Node.EventType.TOUCH_END,()=>{
                        this.doBuy(buyType) //竞购、购买
                    })
                }else{
                    if(isMy){
                        info='您自己的商品'
                    }
                }
            }
            if(this.selectedShopItem.ItemType==1){
                this.numBox.active=false;
                this.cur_num=this.cur_max_num = 1
                let equip = this.selectedShopItem.EquipData
                Tools.showEquip(equip,this.richText,null,null)
            }else{
                this.numBox.active=true;//this.isKf==false;
                this.cur_num=this.cur_max_num = this.selectedShopItem.ItemNum;
                Tools.showItem(this.selectedShopItem.ItemId,this.selectedShopItem.ItemNum,this.richText,null,null)
            }
        }
        this.statusInfo.string=info;
        this.deltaPrice.string=dp;
        this.deltaPrice.color.fromHEX(dpColor)
        this.rightBtn.active=showRightBtn
        if(showRightBtn){
            rightLabel.string = rightBtnStr;
            rightLabel.color.fromHEX(rightColor)
        }
        this.refreshNumUI();
        Tools.resetInfoFrameHeight(this.richText,this.infoFrame,0);
        // this.infoFrame.getComponent(UITransform).height = this.richText.node.getComponent(UITransform).height+40;
        this.compareBox.on(Node.EventType.TOUCH_END,()=>{
            this.compareBox.active=false;
            this.infoBox.active=true;
        })
    }
    onCompare=()=>{
        let equip = this.selectedShopItem.EquipData
        let bodyType = Tools.getBodyType(equip)
        if(bodyType){
            let old = GD.role.BodyEquips[bodyType]
            if(old){
                GameManager.I.playClickSound();
                this.infoBox.active=false;
                this.compareBox.active=true;
                Tools.showEquip(old,this.compareRich1,null)
                Tools.showEquip(equip,this.compareRich2,null)
                let max = Math.max(this.compareRich1.node.getComponent(UITransform).height,this.compareRich2.node.getComponent(UITransform).height)*0.8
                this.compareRich1.node.parent.parent.getComponent(UITransform).height = max//+40;
                this.compareRich2.node.parent.parent.getComponent(UITransform).height = max//+40;
                return;
            }
        }
        UIMgr.I.tip('可装备栏为空，无可对比装备')
    }
    onHide(): void {
        this.myShopList.array=[]
        this.bagList.array=[]
        this.historyList.array=[]
        this.itemList.array=[]
        this.selectedBagItem=null
        this.selectedShopItem=null
        this.timeLabels=[]
        this.richText.string=''
        this.infoBox.active=false;
        this.cur_totalPage=1;
        this.cur_page=1;
        this.cur_other_id=null;
        this.unschedule(this.updateLabels)
    }
    isKf:boolean=false
    initData(data: any): void {
        this.onHide();
        let h='【本服】道具交易市场'
        let color=ct.green
        if(data){
            if(data.Id){
                this.isKf=false;
                this.view.selectedIndex=3 //显示other shop
                this.cur_other_id = data.Id;
                this.otherName.string = `${data.Name} 的摊位`;
                this.getOtherShopItems();
                if(this.myShop==null){
                    let req = outer_pb.MarketAct.create();
                    req.IsKf=this.isKf;
                    let buff = outer_pb.MarketAct.encode(req).finish();
                    WS.send(MT.GetMyShop,buff,(d:any)=>{
                        let rsp=outer_pb.MarketAct.decode(d);
                        // console.log('GetMyShop',rsp)
                        if(rsp.ErrCode==Err.ErrCode_Success){
                            this.myShop=rsp.MyShop;
                        }
                        // else{
                        //     UIMgr.I.tip(NoShopInfo1);
                        // }
                    })
                }
            }else{
                h='【跨服】道具交易市场'
                color=ct.red
                this.isKf = true //设置是否是跨服模式
                this.mainTab.select(2)
            }
        }else{
            this.isKf = false
            this.mainTab.select(2)
        }
        this.say.active=!this.isKf
        this.head.string=h
        this.head.color.fromHEX(color)
        // this.rate.string=`(当前交易税率为${(1-GD.configs.MarketRate)*100>>0}%)`
    }
    cur_other_id:number;
    getOtherShopItems(){
        let req = outer_pb.MarketAct.create();
        // this.pageLabel1.string=`${this.cur_page}/${this.cur_totalPage}`;
        req.MainType = 5;
        req.RoleId = this.cur_other_id;
        req.IsKf=this.isKf;
        this.otherShopList.array=[]
        let buff = outer_pb.MarketAct.encode(req).finish();
        WS.send(MT.GetMarket,buff,this.onGetOtherShop)
    }
    onGetOtherShop=(d:any)=>{
        let rsp=outer_pb.MarketAct.decode(d);
        // console.log('onGetOtherShop',rsp,'myId=',GD.role.data.Id)
        if(rsp.ShopItems.length>0){
            // this.pageLabel1.string=`${this.cur_page}/${this.cur_totalPage}`;
            rsp.ShopItems.sort((a,b)=>{return (b.StartTime as number)-(a.StartTime as number)});
            this.otherShopList.array=rsp.ShopItems;
        }else{
            UIMgr.I.tip(IsEmptyStr);
        }
    }
    lastSendSayTime:number=0
    sayMsg(){
        if(this.myShop&&this.myShop.ShopItems.length>0){
            let now = Date.now()/1000>>0;
            if(now-this.lastSendSayTime<10){
                UIMgr.I.tip(HasSayStr)
                return
            }
            this.doSayMsg()
            // UIMgr.I.PopView.showMsgBox([new BoxMsg(`喊话宣传需要${GD.configs.get(ConfigType.MarketSayNeedDia)}钻石`,ct.qing)],'喊话',this.doSayMsg,'取消');
        }else{
            UIMgr.I.tip(NoItemStr)
        }
    }
    doSayMsg=()=>{
        // if(GD.role.data.Dia<10){
        //     UIMgr.I.tip(NotEnoughDia1)
        // }else{
            let list = this.myShop.ShopItems;
            let msg:string=NewStr
            let items:Array<outer_pb.DropItem>=[]
            list.sort((a,b)=>{return (b.StartTime as number)-(a.StartTime as number)});
            for(let i=0;i<list.length;i++){
                if(i<5){
                    let item = list[i];
                    msg += '{i} '
                    let it = outer_pb.DropItem.create();
                    it.ItemId=item.ItemId
                    it.ItemType=item.ItemType
                    it.ItemNum=item.ItemNum
                    it.EquipData=item.EquipData
                    it.Uid=(randomRange(1,9999)>>0)+''
                    items.push(it);
                }
            }
            msg+='...'
            let req = outer_pb.ChatMsg.create();
            if(this.isKf){
                req.Chanel=ChatChannelType.KuaFu;
            }else{
                req.Chanel=ChatChannelType.World;
            }
            req.msg=msg;
            req.Items=items;
            req.IsSay=true;
            let buff = outer_pb.ChatMsg.encode(req).finish();
            this.lastSendSayTime = Date.now()/1000>>0;
            WS.send(MT.SendChatMsg,buff)
        // }
    }
    refreshBag=()=>{
        if(this.mainTab.selectedIndex==2){
            if(this.bagTypeTab.selectedIndex>0){
                this.bagTypeTab.select(this.bagTypeTab.selectedIndex)
            }else{
                // this.bagList.refresh();
                if(this.bagTab.selectedIndex==0){
                    this.bagList.array=GD.role.BagEquips
                }else{
                    this.bagList.array=GD.role.BagItems.filter(item=>{ return item.Id!=5&&item.Id!=6})
                }
            }
        }
    }
    renderShopItems=(list:List,node:Node,index:number,isMarketItem:boolean,isMyCkItem:boolean)=>{
        let item:outer_pb.IShopItem = list.array[index];
        let info:string='';
        let name:string=''
        let nameColor:ct=ct.white;
        let path:string=ItemFramePath.Gray;
        let frame = node.children[1].getComponent(Sprite);
        let iocnPath:string
        if(item.ItemType==1){
            let equip = item.EquipData;
            iocnPath = `ui/equip/${equip.Id}`
            let base = GD.EquipBaseDatas.get(equip.Id)
            if(base){
                name=base.Name
                if(equip.ZjLv>0){
                    nameColor=ct.blue
                    path = ItemFramePath.Blue
                }
                if(equip.LuckyLv>0){
                    nameColor=ct.blue
                    path = ItemFramePath.Blue
                }
                if(equip.ZyList.length>0){
                    nameColor=ct.green
                    path = ItemFramePath.Green
                }
                if(equip.TzLv>0){
                    path = ItemFramePath.Red
                }
                if(equip.DtTzLv>0){
                    path = ItemFramePath.Yellow
                }
                info = `+${equip.QhLv}z${equip.ZjLv}xy${equip.LuckyLv}`
            }
        }else{
            nameColor=ct.yellow
            info = 'x'+item.ItemNum;
            let base = GD.ItemBaseDatas.get(item.ItemId)
            if(base){
                name=base.Name
                iocnPath = `ui/item/${base.IconId}`
            }
        }
        Tools.loadSpriteFrame("muui/" + path,resources).then(sp=>{
            frame.spriteFrame = sp;
        })
        let nameLabel =  node.children[0].getComponent(Label);
        nameLabel.string=name;
        nameLabel.color.fromHEX(nameColor);
        node.children[3].getComponent(Label).string = info;
        Tools.loadSpriteFrame(iocnPath,GD.commonBundle).then(sp=>{
            node.children[2].getComponent(Sprite).spriteFrame = sp;
        })

        let timeLabel = node.children[4].getComponent(Label);
        if(isMyCkItem){
            timeLabel.string=''
        }else{
            let obj = Tools.getShopItemPendingTime(item);
            timeLabel.string = obj.str
            timeLabel.color.fromHEX(obj.color)
            let timeLabelData = timeLabel.getComponent(Data);
            timeLabelData.data = item;
            this.timeLabels.push(timeLabel);
        }
        let b_num = item.PreOrders.length
        node.children[7].getComponent(Toggle).isChecked=b_num>0;
        let orderNum = node.children[8].getComponent(Label);
        orderNum.string = ''+b_num;
        orderNum.color.fromHEX(b_num>0?ct.brown:ct.gray);
        let price=node.children[9].getComponent(Label);
        price.string = `x${item.CurPrice.toLocaleString()}`;
        let icon = price.node.children[0].getComponent(Sprite)
        if(item.PriceType==0){
            icon.spriteFrame=this.diaIcon
            price.color.fromHEX(ct.qing)
        }else{
            icon.spriteFrame=this.pointIcon
            price.color.fromHEX(ct.brown)
        }
        if(isMarketItem){
            node.children[10].active = item.PreOrders.findIndex(id=>{return id==GD.role.data.Id})>-1;
            node.children[11].active = item.Owner==GD.role.data.Id;
        }
    }
    cur_page:number=1;
    cur_totalPage:number=1;
    getMarket(page:number,id:number=0){
        let req = outer_pb.MarketAct.create();
        req.Page=page;
        req.IsKf=this.isKf;
        this.cur_page=page;
        this.pageLabel.string=`${this.cur_page}/${this.cur_totalPage}`;
        req.MainType = this.itemTypeTab.selectedIndex;
        if(req.MainType==1||req.MainType==2){
            //装备、道具（其它为全部、预购、搜索，不需要发送以下属性）
            req.SortType = this.sortTypeTab.selectedIndex
            let minType = this.minItemTypeTab.selectedIndex
            if(minType>12){
                minType=minType+7
            }
            req.MinItemType = minType
            const i = this.roleTypeTab.selectedIndex;
            req.RoleType = i>0?Math.pow(2,i-1):0;
            if(req.MainType==1){
                //装备
                req.EquipLv = this.equipLvTab.selectedIndex;
                req.PinZiLv = this.pinZiTab.selectedIndex;
                req.Num = this.zyTypeTab.selectedIndex;
            }
        }else if(req.MainType==4){
            if(id>0){
                req.SearchId=id;
            }else{
                UIMgr.I.tip(InputNameStr)
                return
            }
        }
        this.itemList.array=[]
        let buff = outer_pb.MarketAct.encode(req).finish();
        WS.send(MT.GetMarket,buff,this.onGetMarket)
    }
    onGetMarket=(d:any)=>{
        let rsp=outer_pb.MarketAct.decode(d);
        // console.log('onGetMarket',rsp)
        this.cur_totalPage = rsp.TotalPages;
        if(rsp.ShopItems.length>0){
            this.pageLabel.string=`${this.cur_page}/${this.cur_totalPage}`;
            this.sortShopList(rsp.ShopItems)
        }else{
            UIMgr.I.tip(NoItemStr1);
        }
    }
    sortShopList=(shopItems:Array<outer_pb.IShopItem>)=>{
        if(this.cur_totalPage==1){
            let index = this.sortTypeTab.selectedIndex
            if(index==0){
                shopItems.sort((a,b)=>{return (b.StartTime as number)-(a.StartTime as number)})
            }else if(index==1){
                shopItems.sort((a,b)=>{return (a.StartTime as number)-(b.StartTime as number)})
            }else if(index==2){
                shopItems.sort((a,b)=>{return (b.CurPrice as number)-(a.CurPrice as number)})
            }else if(index==3){
                shopItems.sort((a,b)=>{return (a.CurPrice as number)-(b.CurPrice as number)})
            }
        }
        this.resetList(this.itemList,shopItems)
    }
    resetList=(list:List,array:any)=>{
        this.timeLabels=[];
        this.unschedule(this.updateLabels);
        list.array=array
        if(array.length>0) this.schedule(this.updateLabels,1);
    }
    //只获取未读取的记录（根据已拉取的最新的一条记录的时间）
    historyOwner:string=''
    getNewHistory(){
        this.refreshH.active=false
        if(this.historyOwner!=GD.role.data.Name) {
            this.historys=[];
            this.kfHistorys=[]
        }
        let his=this.historys
        if(this.isKf){
            his=this.kfHistorys
        }
        let req = outer_pb.MarketAct.create();
        req.IsKf=this.isKf;
        req.Price=his.length>0?his[0].Time:0;//用Price代表Time
        let buff = outer_pb.MarketAct.encode(req).finish();
        WS.send(MT.GetMyNewHistory,buff,(d:any)=>{
            this.historyOwner=GD.role.data.Name;
            this.refreshH.active=true
            let rsp=outer_pb.MarketAct.decode(d);
            // console.log('getHistory',rsp)
            his.push(...rsp.History)
            his.sort((a,b)=>{return (b.Time as number)-(a.Time as number)})
            this.historyList.array=his
        })
    }
    //其中的记录：只获取未读取的记录
    getMyShop(){
        this.myShop=null;
        this.myShopList.array=[]
        this.showBag()
        // if(GD.role.hasGetBagData){
        //     console.log('just show bag')
        //     this.showBag()
        // }else{
        //     Tools.getRoleBagBodyData(this.showBag)
        // }
        this.registeBox.active=true;
        this.registeBtn.active=false;
        this.registeLabel.string=LoadShopStr;
        let req = outer_pb.MarketAct.create();
        req.IsKf=this.isKf;
        let buff = outer_pb.MarketAct.encode(req).finish();
        WS.send(MT.GetMyShop,buff,(d:any)=>{
            let rsp=outer_pb.MarketAct.decode(d);
            // console.log('GetMyShop',rsp)
            if(rsp.ErrCode==Err.ErrCode_Success){
                this.myShop=rsp.MyShop;
                this.shopTab.select(0)
                this.registeBox.active=false;
            }else{
                this.registeBtn.active=true;
                this.refreshShopMoneyUi();
                this.registeLabel.string=NoShopInfo2
            }
        })
    }
    registeShop(){
        let req = outer_pb.MarketAct.create();
        req.IsKf=this.isKf;
        let buff = outer_pb.MarketAct.encode(req).finish();
        WS.send(MT.RegistShop,buff,(d:any)=>{
            let rsp=outer_pb.MarketAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                this.myShop=rsp.MyShop;
                this.shopTab.select(0)
                this.registeBox.active=false;
                UIMgr.I.tip(RegistOk,ct.green)
            }else{
                // this.registeBtn.active=true;
                this.registeLabel.string=RegistFailed
            }
        })
    }
    showBag=()=>{
        this.bagTab.select(0)
    }
    refreshMyShopList=(index:number)=>{
        if(index==0){
            this.resetList(this.myShopList,this.myShop.ShopItems)
            this.shopCap.string=`(${this.myShop.ShopItems.length}/${GD.role.getMaxShopCap()})`;
        }else{
            this.resetList(this.myShopList,this.myShop.ShopCk)
            this.shopCap.string=`(${this.myShop.ShopCk.length}/${GD.role.getMaxShopCap()})`;
        }
        this.myShopList.scrollToTop();
        this.refreshShopMoneyUi();
    }
    refreshShopMoneyUi=()=>{
        this.shopMoney.string=this.myShop?this.myShop.Dia.toLocaleString():'0';
        // let color=ct.qing
        // if(this.isKf){
        //     color=ct.brown
            // this.moneySkin.spriteFrame=this.pointIcon
        //     this.shopMoney.string=this.myShop?this.myShop.MuPoint.toLocaleString():'0';
        // }else{
        //     this.moneySkin.spriteFrame=this.diaIcon
        //     this.shopMoney.string=this.myShop?this.myShop.Dia.toLocaleString():'0';
        // }
        // this.shopMoney.color.fromHEX(color)
    }
    //上架
    upSell=(isMoney:boolean)=>{
        if(this.myShop&&this.selectedBagItem&&(GD.role.data.IsYkMode||GD.role.hasBaseYk())){
            if(this.myShop.ShopItems.length>=GD.role.getMaxShopCap()){
                UIMgr.I.tip(UpFailedStr1)
                return
            }
            if(this.myShop.ShopCk.length>=GD.role.getMaxShopCap()){
                UIMgr.I.tip(UpFailedStr2)
                return
            }
            if(this.myShop.Dia<0||this.myShop.MuPoint<0){
                UIMgr.I.tip(UpFailedDia)
                return
            }
            this.infoBox.active=false;
            let upSellItem = outer_pb.ShopItem.create()
            // upSellItem.PriceType=this.priceTypeTab.selectedIndex;//钻石0、点数1
            upSellItem.PriceType=0;//this.isKf?1:0;
            if(this.bagTab.selectedIndex==0&&isMoney==false){
                let equip = this.selectedBagItem as outer_pb.IEquip
                if(equip.IsLock){
                    UIMgr.I.tip(CanSellLockedEquip)
                    return
                }else{
                    upSellItem.ItemType = 1
                    upSellItem.Uid=equip.Uid;
                    upSellItem.ItemNum = 1;
                }
                // let has=false
                // if(equip.Data){
                //     for(let k in equip.Data){
                //         has=true
                //         break
                //     }
                // }
                // if(has){
                //     //有保底次数
                //     UIMgr.I.PopView.showMsgBox([new BoxMsg('该装备有锻造保底数据，上架后将清除所有保底数据',ct.brown)],'上架',(d:string)=>{
                //         this.sendUpSell(upSellItem)
                //     },'取消')
                //     return
                // }
            }else{
                upSellItem.ItemType = 2
                upSellItem.ItemId = this.selectedBagItem.Id
                upSellItem.ItemNum = this.cur_num
            }
            this.sendUpSell(upSellItem)
        }else{
            UIMgr.I.tip(NoShopInfo)
        }
    }
    sendUpSell=(item:outer_pb.ShopItem)=>{
        let req = outer_pb.MarketAct.create();
        req.ShopItem = item
        req.Price = this.cur_price
        req.IsKf=this.isKf;
        let buff = outer_pb.MarketAct.encode(req).finish();
        WS.send(MT.UpSellItem,buff,(d:any)=>{
            let rsp=outer_pb.MarketAct.decode(d);
            // console.log('onUpSellItem',rsp)
            if(rsp.ErrCode==Err.ErrCode_Success){
                let item = rsp.ShopItem;
                this.myShop.ShopItems.push(item)
                this.shopTab.select(0)
                UIMgr.I.tip(UpSuccessStr,ct.green)
                if(item.ItemType==1){
                    GD.role.tryDeleteBagEquip(item.EquipData.Uid)
                    this.refreshBag()
                }else if(item.ItemType==2){
                    if(item.ItemId==400){
                        //1袋金币(100W)
                        GD.role.reduceGold(item.ItemNum*1000000);
                    }else if(item.ItemId==401){
                        //1袋钻石(1000个)
                        GD.role.reduceDia(item.ItemNum*1000);
                    }else if(item.ItemId==3){
                        //点数
                        GD.role.reduceMuPoint(item.ItemNum);
                    }else{
                        GD.role.reduceItem(item.ItemId,item.ItemNum)
                        this.refreshBag();
                    }
                }
            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughCap){
                UIMgr.I.tip(UpFailedStr3)
            }else{
                UIMgr.I.tip(UpFailedStr0+rsp.ErrCode)
            }
        })
    }
    // 重新上架不能修改数量（只能改变价格）
    reUpSell=()=>{
        // console.log('ReUpSell',this.selectedShopItem)
        if(this.myShop&&this.selectedShopItem&&(GD.role.data.IsYkMode||GD.role.hasBaseYk())){
            if(this.myShop.ShopItems.length>=GD.role.getMaxShopCap()){
                UIMgr.I.tip(UpFailedStr1)
                return
            }
            if(this.myShop.Dia<0||this.myShop.MuPoint<0){
                UIMgr.I.tip(UpFailedDia)
                return
            }
            this.infoBox.active=false;
            let req = outer_pb.MarketAct.create();
            req.Uid = this.selectedShopItem.Uid;
            req.Price = this.cur_price;
            req.IsKf=this.isKf;
            let buff = outer_pb.MarketAct.encode(req).finish();
            WS.send(MT.ReUpSellItem,buff,(d:any)=>{
                let rsp=outer_pb.MarketAct.decode(d);
                // console.log('onReUpSellItem',rsp)
                if(rsp.ErrCode==Err.ErrCode_Success){
                    let item = rsp.ShopItem;
                    this.myShop.ShopItems.push(item)
                    let i = this.myShop.ShopCk.findIndex(item1=>{return item1.Uid==item.Uid})
                    if(i>-1){
                        this.myShop.ShopCk.splice(i,1)
                    }
                    this.shopTab.select(1);
                    UIMgr.I.tip(UpSuccessStr,ct.green)
                }else if(rsp.ErrCode==Err.ErrCode_NotEnoughCap){
                    UIMgr.I.tip(UpFailedStr1)
                }else{
                    UIMgr.I.tip(UpFailedStr0)
                }
            })
        }else{
            UIMgr.I.tip(NoShopInfo)
        }
    }
    //下架
    downSell=()=>{
        // console.log('DownSell')
        let shopItem = this.selectedShopItem
        if(shopItem){
            if(shopItem.PreOrders.length>0){
                this.showCheckDownSell()
            }else{
                let req = outer_pb.MarketAct.create();
                req.Uid = shopItem.Uid;
                req.IsKf=this.isKf;
                let buff = outer_pb.MarketAct.encode(req).finish();
                WS.send(MT.CheckCanDownSellItem,buff,(d:any)=>{
                    let rsp=outer_pb.MarketAct.decode(d);
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        this.doDownSell()
                    }else if(rsp.ErrCode==Err.ErrCode_HasPreOrders){
                        shopItem.PreOrders=rsp.ShopItem.PreOrders
                        this.refreshMyShopList(0);
                        this.showCheckDownSell();
                    }else{
                        UIMgr.I.tip('商品不存在，或已售出')
                    }
                })
            }
        }
    }
    showCheckDownSell(){
        let msg = new BoxMsg('<br/>该商品已被竞购，强制下架将扣除总售价的10%手续费',ct.brown);
        UIMgr.I.PopView.showMsgBox([msg],'强制下架',this.doDownSell,'取消下架')
    }
    doDownSell=()=>{
        let shopItem = this.selectedShopItem
        this.infoBox.active=false;
        let req = outer_pb.MarketAct.create();
        req.Uid = shopItem.Uid;
        req.IsKf=this.isKf;
        let buff = outer_pb.MarketAct.encode(req).finish();
        WS.send(MT.DownSellItem,buff,(d:any)=>{
            let rsp=outer_pb.MarketAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                if(rsp.Price>0){
                    // if(rsp.IsKf){
                    //     this.myShop.MuPoint-=rsp.Price
                    // }else{
                    //     this.myShop.Dia-=rsp.Price
                    // }
                    this.myShop.Dia-=rsp.Price
                    this.refreshShopMoneyUi()
                }
                let i = this.myShop.ShopItems.findIndex(item1=>{return item1.Uid==shopItem.Uid})
                if(i>-1)this.myShop.ShopItems.splice(i,1)
                this.refreshMyShopList(this.shopTab.selectedIndex);
                UIMgr.I.tip(DownSuccessStr,ct.green)
                this.pushShopItemToBag(shopItem,false)
            }else{
                UIMgr.I.tip(DownFailedStr)
            }
        })
    }
    //修改价格
    // resetPrice=()=>{
    //     // console.log('resetPrice')
    //     let shopItem = this.selectedShopItem
    //     if(shopItem){
    //         if(shopItem.PreOrders.length>0){
    //             UIMgr.I.tip(ResetFailedStr1)
    //             return
    //         }
    //         if(shopItem.Price==this.cur_price){
    //             UIMgr.I.tip(ResetFailedStr2)
    //             return
    //         }
    //         this.infoBox.active=false;
    //         let req = outer_pb.MarketAct.create();
    //         req.Uid = shopItem.Uid;
    //         req.Price = this.cur_price;
    //         let buff = outer_pb.MarketAct.encode(req).finish();
    //         WS.send(MT.ResetItemPrice,buff,(d:any)=>{
    //             let rsp=outer_pb.MarketAct.decode(d);
    //             if(rsp.ErrCode==Err.ErrCode_Success){
    //                 shopItem.Price = rsp.Price;
    //                 UIMgr.I.tip(ResetOkStr,ct.green)
    //             }else if(rsp.ErrCode==Err.ErrCode_HasPreOrders){
    //                 shopItem.PreOrders=rsp.ShopItem.PreOrders
    //                 UIMgr.I.tip(ResetFailedStr1)
    //             }else{
    //                 UIMgr.I.tip(ResetFailedStr)
    //             }
    //             this.refreshMyShopList(this.shopTab.selectedIndex);
    //         })
    //     }
    // }
    pushShopItemToBag(shopItem:outer_pb.IShopItem,isNew:boolean){
        if(shopItem.ItemType==1){
            // shopItem.EquipData.IsLock=true
            GD.role.getEquip(shopItem.EquipData,isNew)
        }else if(shopItem.ItemType==2){
            GD.role.getItem(shopItem.ItemId,shopItem.ItemNum,isNew)
        }
        this.bagTypeTab.select(0)
    }
    //从临时仓库放回背包
    downShopCkItemToBag=()=>{
        // console.log('DownShopCkItemToBag')
        let shopItem = this.selectedShopItem
        if(shopItem){
            this.infoBox.active=false;
            let req = outer_pb.MarketAct.create();
            req.Uid = shopItem.Uid;
            req.IsKf=this.isKf;
            let buff = outer_pb.MarketAct.encode(req).finish();
            WS.send(MT.DownShopCkItemToBag,buff,(d:any)=>{
                let rsp=outer_pb.MarketAct.decode(d);
                // console.log('onDownShopCkItemToBag',rsp)
                if(rsp.ErrCode==Err.ErrCode_Success){
                    let i = this.myShop.ShopCk.findIndex(item1=>{return item1.Uid==shopItem.Uid})
                    if(i>-1)this.myShop.ShopCk.splice(i,1)
                    this.refreshMyShopList(this.shopTab.selectedIndex);
                    UIMgr.I.tip(GetOkStr,ct.green)
                    if(shopItem.Owner!=GD.role.data.Id&&shopItem.EquipData!=null){
                        shopItem.EquipData.IsLock=true
                    }
                    this.pushShopItemToBag(shopItem,false)
                }else{
                    UIMgr.I.tip(GetFailedStr)
                }
            })
        }
    }
    doBuy=(buyType:number)=>{
        // console.log('TryBuy',isOneBuy)
        if(GD.role.data.IsYkMode||GD.role.hasBaseYk()){
            if(this.myShop&&this.selectedShopItem){
                let shopItem = this.selectedShopItem;
                if(shopItem.Owner==GD.role.data.Id){
                    UIMgr.I.tip(IsYouself)
                    return
                }
                let isPending = shopItem.Status==ShopItemStatus.StatusPending//(Date.now()/1000>>0)-(shopItem.StartTime as number)<this.PendTime
                if(isPending && this.myShop.ShopCk.length>=GD.role.getMaxShopCap()){
                    UIMgr.I.tip(BuyFailed)
                    return
                }
                let need = (shopItem.CurPrice as number)*this.cur_num //可直接购买、跟拍、预购的价格
                // if(this.isKf) need = shopItem.CurPrice
                let hasOrdered = shopItem.PreOrders.findIndex(Id=>{return Id==GD.role.data.Id})>-1
                if(isPending){
                    if(buyType==0){
                        //跟拍、预购
                        if(hasOrdered){
                            UIMgr.I.tip(HasOrdered)
                            return
                        }
                    }else{
                        //加价
                        let incre = (shopItem.CurPrice as number)/10>>0
                        if(incre==0) incre=1;
                        let price = (shopItem.CurPrice as number)+incre;
                        let curNeed = price*this.cur_num
                        // if(this.isKf){
                        //     curNeed = price
                        // }
                        if(hasOrdered){
                            //补差价就行
                            need = curNeed-need
                        }else{
                            need = curNeed
                        }
                    }
                }
                if(shopItem.PriceType==0){
                    if((this.myShop.Dia as number)<need){
                        UIMgr.I.tip(NotEnoughDia)
                        return
                    }
                }else{
                    if((this.myShop.MuPoint as number)<need){
                        UIMgr.I.tip(NotEnoughPoint1)
                        return
                    }
                }
            
                this.infoBox.active=false; 
                let req = outer_pb.MarketAct.create();
                req.Uid = shopItem.Uid;
                req.Price = this.cur_price;
                req.Num = this.cur_num;
                req.BuyType = buyType;
                req.IsKf=this.isKf;
                // req.IsOneBuy = isOneBuy;
                let buff = outer_pb.MarketAct.encode(req).finish();
                WS.send(MT.BuyMarketItem,buff,(d:any)=>{
                    let rsp=outer_pb.MarketAct.decode(d);
                    // console.log('onBuyMarketItem',rsp)
                    let list = this.itemList
                    if(this.view.selectedIndex==3){
                        list = this.otherShopList
                    }
                    let arr = list.array
                    if(rsp.ErrCode==Err.ErrCode_SuccessBuy){
                        //购买成功
                        let i = arr.findIndex(item1=>{return item1.Uid==rsp.Uid})
                        if(i>-1){
                            if(rsp.Num<arr[i].ItemNum){
                                arr[i].ItemNum-=rsp.Num
                            }else{
                                arr.splice(i,1)
                            }
                            this.resetList(list,arr);
                        }
                        this.pushShopItemToBag(rsp.ShopItem,true);
                        let str:string
                        if(rsp.ShopItem.PriceType==0){
                            str=ShopDiaStr
                        }else{
                            str=ShopPointStr
                        }
                        UIMgr.I.showProsMsg(`${str}-${rsp.Price}`,ct.red,true)
                        UIMgr.I.tip(BuySuccess,ct.green)
                    }else if(rsp.ErrCode==Err.ErrCode_SuccessOrdered){
                        let i = arr.findIndex(item1=>{return item1.Uid==rsp.ShopItem.Uid})
                        if(i>-1){
                            arr[i]=rsp.ShopItem
                            this.resetList(list,arr);
                        }
                        let str:string
                        if(rsp.ShopItem.PriceType==0){
                            str=ShopDiaStr
                        }else{
                            str=ShopPointStr
                        }
                        UIMgr.I.showProsMsg(`${str}-${rsp.Price}`,ct.red,true)
                        UIMgr.I.tip(OrderSuccess,ct.green)
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughCap){
                        UIMgr.I.tip(BuyFailed1)
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughDia){
                        let str:string
                        if(shopItem.PriceType==0){
                            str=NotEnoughDia
                        }else{
                            str=NotEnoughPoint1
                        }
                        UIMgr.I.tip(str)
                    }else if(rsp.ErrCode==Err.ErrCode_PriceChanged){
                        shopItem.CurPrice = rsp.ShopItem.CurPrice
                        this.resetList(list,arr);
                        UIMgr.I.tip(BuyFailed3)
                    }else{
                        let i = arr.findIndex(item1=>{return item1.Uid==rsp.Uid})
                        if(i>-1){
                            arr.splice(i,1)
                            this.resetList(list,arr);
                        }
                        UIMgr.I.tip(BuyFailed2)
                    }
                })
            }else{
                UIMgr.I.tip(NoShopInfo1);
            }
        }
    }
}