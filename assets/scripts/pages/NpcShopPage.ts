import { _decorator,  Label, Node, RichText, Sprite } from 'cc';
import { List } from '../UiComps/List';
import { BasePage } from './BasePage';
import { ct,  Npc, ShopItem } from '../base/types';
import GD from '../base/GameData';
import Tools from '../base/tools';
import { UIMgr } from '../managers/UIMgr';
import { AdvanceRoleTypeLvInfo, Fb_em_info, Fb_xs_info, PriceTypeStr, ZhuanShengInfo } from '../base/consts';
import { ShowItemType } from './PopView';
import WS from '../base/net';
import { ConfigType, Err, MT } from '../base/MT';
import GameManager from '../managers/GameManager';
import { ViewStack } from '../UiComps/ViewStack';
import { BattleManager } from '../battle/BattleManager';
import { Tab } from '../UiComps/Tab';
const { ccclass, property } = _decorator;

@ccclass('NpcShopPage')
export class NpcShopPage extends BasePage {
    @property(Label)
    npcName:Label
    @property(Label)
    msgLabel:Label
    @property(List)
    shopItemList:List
    @property(Node)
    content:Node
    @property(Node)
    zzBtn:Node
    @property(RichText)
    zzRich:RichText
    @property(Tab)
    zsTab:Tab
    @property(Node)
    fbCells:Node
    @property(RichText)
    fbInfo1:RichText
    @property(Label)
    fbNumInfo:Label
    @property(Label)
    hisInfo:Label
    @property(Node)
    joinFbBtn:Node
    @property(Node)
    sdFbBtn:Node
    selectedFbLv:number=-1;
    curMaxSliderValue:number=0;
    onLoad(): void {
        super.onLoad();
        this.zsTab.select(0)
        this.shopItemList.cellRender = (node:Node,index:number)=>{
            let id = this.shopItemList.array[index]
            let item:ShopItem;
            if(this.npc.Id===43){
                item = GD.kfShopItems.get(id);
            }else if(this.npc.Id==44){
                item = GD.zmShopItems.get(id);
            }else{
                item = GD.shopItems.get(id);
            }
            let icon = node.children[2].getComponent(Sprite);
            let iconPath = item.Id<10000?'ui/item/':'ui/equip/';
            Tools.loadSpriteFrame(iconPath+item.iconId,GD.commonBundle).then(sp=>{
                icon.spriteFrame = sp;
            })
            node.children[3].getComponent(Label).string = 'x1';
            let name=node.children[0].getComponent(Label)
            name.string = item.name;
            name.color.fromHEX(Tools.getItemColor(id));
            let price = node.children[5].getComponent(Label);
            let p = item.Price
            if (id == 5 || id == 6) {
                item.Price=p
                p=Tools.getHpMpItemPrice()
            }else if(GD.role.data.IsYkMode&&item.PriceYk>0){
                p=item.PriceYk
            }
            let priceTypeIcon = price.node.children[0].getComponent(Sprite);
            let iconid=14
            if(item.PriceType==2){
                iconid=15;
            }else if(item.PriceType==3){
                iconid=3;
            }else if(item.PriceType==4){
                iconid=54;
            }else if(item.PriceType==5){
                iconid=82;
            }
            if(p==0){
                price.string='仅展示，不出售'
                price.color.fromHEX(ct.gray)
                priceTypeIcon.spriteFrame = null
            }else{
                price.string=p.toLocaleString()
                price.color.fromHEX(ct.yellow)
                Tools.loadSpriteFrame("ui/item/" + iconid,GD.commonBundle).then(sp=>{
                    priceTypeIcon.spriteFrame = sp;
                })
            }
        }
        this.shopItemList.selectedHandler = (node:Node,index:number)=>{
            let id = this.shopItemList.array[index]
            let item:ShopItem;
            if(this.npc.Id===43){
                item = GD.kfShopItems.get(id);
            }else if(this.npc.Id==44){
                item = GD.zmShopItems.get(id);
            }else{
                item = GD.shopItems.get(id);
            }
            this.selectedItem = item;
            let str='购买'
            if(item.Price==0){
                str=''
            }
            if(id>=10000){
                if(GD.role.BagEquips.length>=50){
                    UIMgr.I.tip('背包满了')
                    return;
                }
                UIMgr.I.PopView.show(0,item,false,ShowItemType.NpcShopEquip,str,this.buyEquip)
            }else{
                UIMgr.I.PopView.show(0,item,false,ShowItemType.NpcShopItem,str,this.buyItem)
            }
        }
        this.fbCells.children.forEach((node,index)=>{
            node.on(Node.EventType.TOUCH_END,()=>{
                if(index!=this.selectedFbLv){
                    if(this.selectedFbLv>=0){
                        this.fbCells.children[this.selectedFbLv].children[0].active=false;
                    }
                    node.children[0].active=true;
                    this.selectedFbLv=index;
                }
            },this);
        })
        this.joinFbBtn.on(Node.EventType.TOUCH_END,this.tryJoinFb,this);
        this.sdFbBtn.on(Node.EventType.TOUCH_END,this.trySdFb,this);
    }
    tryJoinFb=()=>{
        if(GD.curMap.mapData.IsKf==1){
            UIMgr.I.tip('挑战副本请回本服，并进入期望的线路')
            return
        }
        if(this.selectedFbLv>=0){
            let minMapId=0
            const id = this.npc.Id;
            if(id==10){
                minMapId=601
            }else if(id==20){
                minMapId=651
            }
            let mapId = minMapId+this.selectedFbLv
            let needLv=GD.MapList.get(mapId).NeedLv;
            if(GD.role.hasEnoughLv(needLv,false)){
                let room = GD.MapList.get(mapId)
                if(room){
                    if(GD.role.ResetDayData.FbNums[room.FbType-1]>0){
                        BattleManager.I.joinLine(GD.role.data.WorldLv,mapId,-1,GD.role.data.LineId)
                    }else{
                        UIMgr.I.tip('剩余副本次数不足')
                    }
                }
            }else{
                UIMgr.I.tip('等级不足')
            }
        }else{
            UIMgr.I.tip('请先选择要挑战的副本层数')
        }
    }
    trySdFb=()=>{
        if(GD.role.data.IsYkMode==false||GD.role.hasBaseYk()){
            const id = this.npc.Id;
            let his:outer_pb.IFbHistory;
            const data=GD.role.ResetDayData;
            let num=0;
            if(id==10){
                num = data.FbNums[0]
                his = data.Fb_em
            }else if(id==20){
                num = data.FbNums[1]
                his = data.Fb_xs
            }
            if(his){
                if(num>0){
                    let ticketId=0
                    if(id==10){
                        ticketId = 569+his.Lv
                    }else if(id==20){
                        ticketId = 539+his.Lv
                    }
                    if(GD.role.hasEnoughItem(ticketId,1)){
                        if(GD.curMap.mapData.IsKf==0&&his.LineLv!=GD.curMap.lineLv){
                            let l=this.lineLvs[his.LineLv-1];
                            UIMgr.I.tip(`当前副本记录为[${l}线路]，请前往该线路扫荡`)
                            return
                        } 
                        // if(GD.role.BagEquips.length>GD.configs.get(ConfigType.MaxBagCap)){
                        //     UIMgr.I.tip('背包已满')
                        //     return
                        // }
                        let needDia = GD.configs.get(ConfigType.SdFbNeedDia)
                        if(GD.role.hasGoldYk(false)){
                            needDia=0
                        }
                        if(needDia==0||GD.role.hasEnoughDia(needDia)){
                            let req = outer_pb.UseItemAct.create();
                            req.Id=id
                            let buff = outer_pb.UseItemAct.encode(req).finish();
                            WS.send(MT.SdFb,buff,this.onSdFb)
                        }
                    }
                }else{
                    UIMgr.I.tip('剩余次数不足')
                }
            }else{
                UIMgr.I.tip('无挑战记录')
            }
        }
    }
    onSdFb=(d:any)=>{
        let rsp = outer_pb.UseItemAct.decode(d)
        // console.log('onSdFb',rsp)
        if(rsp.ErrCode==Err.ErrCode_Success){
            if(rsp.CostDia>0)GD.role.reduceDia(rsp.CostDia)
            GD.role.reduceItem(rsp.Id,1);
            GD.role.ResetDayData.FbNums = rsp.FbNums;
            this.renderFbView();
            UIMgr.I.getAndShowResultBox(rsp,'扫荡副本收益')
        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughLineTime){
            UIMgr.I.tip('请前往对应线路扫荡')
        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughDia){
            UIMgr.I.tip('钻石不足')
        }else{
            UIMgr.I.tip('剩余次数不足 或 无挑战记录')
        }
    }
    lineLvs:Array<string>=['普通','黄金','专属']
    renderFbView=()=>{
        this.selectedFbLv=-1;
        this.hisInfo.string=''
        let name=''
        let info1=''
        let his:outer_pb.IFbHistory;
        let minMapId=0
        const id = this.npc.Id;
        let num=0;
        const data = GD.role.ResetDayData;
        if(id==10){
            name='恶魔广场'
            minMapId=601
            info1=Fb_em_info
            his = data.Fb_em
            num = data.FbNums[0]
        }else if(id==20){
            name='血色城堡'
            minMapId=651
            info1=Fb_xs_info
            his = data.Fb_xs
            num = data.FbNums[1]
        }
        this.fbInfo1.string=`${info1}，扫荡副本需要<color=${ct.qing}>${GD.configs.get(ConfigType.SdFbNeedDia)}钻石/次</>(黄金月卡免费)`;
        this.fbNumInfo.string=`今日剩余次数：${num}`
        let info:string
        if(his){
            let num=0
            for(let k in his.Nums){
                num+=his.Nums[k]
            }
            info = `${this.lineLvs[his.LineLv-1]}线路，第${his.Lv}层，经验x${his.Exp/10000>>0}万，怪物归属${num}只，Boss归属${his.Boss.length}只`
        }else{
            info='无挑战记录'
        }
        this.hisInfo.string=info
        this.fbCells.children.forEach((node,index)=>{
            node.children[0].active=false;
            let label1=node.children[1].getComponent(Label)
            let label2=node.children[2].getComponent(Label)
            label1.string=`${name}${index+1}`;
            let needLv=GD.MapList.get(minMapId+index).NeedLv;
            let showLv=needLv
            let needZsNum=0
            if(needLv>400){
                needZsNum = needLv-400;
                showLv=0;
            }
            let color=ct.gray;
            let info2
            if(GD.role.hasEnoughLv(needLv,false)){
                color=ct.blue
                info2='可挑战'
            }else{
                info2=`可挑战等级：${needZsNum}转${showLv}级`
            }
            label2.string=info2
            label1.color.fromHEX(color)
            label2.color.fromHEX(color)
        })
    }
    //转职
    doZZ=()=>{
        if(GD.role.data.Lv>=this.needLv){
            if(GD.role.hasEnoughGold(this.needGold)){
                WS.send(MT.AddRoleTypeLv,GD.EmptyRequestBuff,(d:any)=>{
                    let rsp = outer_pb.NpcShopAct.decode(d);
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        GD.role.reduceGold(rsp.Cost)
                        if(rsp.BasePros){
                            UIMgr.I.resetRoleBasePros(rsp.BasePros)
                            if(rsp.BasePros.RoleTypeLv==2){
                                UIMgr.I.ljBar.node.active=true;
                                UIMgr.I.refreshLjBar();
                            }
                        }
                        GameManager.I.playTipSound('zz')
                        UIMgr.I.tip('转职成功',ct.green)
                        UIMgr.I.hideCurPage();
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughItem){
                        UIMgr.I.tip('金币不足')
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughLv){
                        UIMgr.I.tip('等级不足')
                    }else{
                        UIMgr.I.tip('转职失败')
                    }
                })
            }
        }else{
            UIMgr.I.tip('等级不足')
        }
    }
    //转生
    doZs=()=>{
        if(GD.role.data.Lv>=400){
            let type = this.zsTab.selectedIndex
            let can=false;
            if(type==0){
                can=GD.role.hasEnoughGold(this.needGold)
            }else{
                can=GD.role.hasEnoughDia(this.needDia)
            }
            if(can){
                let req = outer_pb.NpcShopAct.create()
                req.Id=type
                let buff= outer_pb.NpcShopAct.encode(req).finish();
                WS.send(MT.DoZs,buff,(d:any)=>{
                    let rsp = outer_pb.NpcShopAct.decode(d);
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        if(rsp.Id==0){
                            GD.role.reduceGold(rsp.Cost)
                        }else{
                            GD.role.reduceDia(rsp.Cost)
                        }
                        GD.role.data.Lv=0;
                        GD.role.data.ZsNum++;
                        GD.role.data.Exp=0;
                        GD.role.data.MaxExp=rsp.Num;
                        UIMgr.I.refreshLvUI();
                        UIMgr.I.refreshExpUI();
                        if(rsp.BasePros)UIMgr.I.resetRoleBasePros(rsp.BasePros)
                        GameManager.I.playTipSound('zz')
                        UIMgr.I.tip('转生成功',ct.green)
                        UIMgr.I.hideCurPage();
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughItem){
                        UIMgr.I.tip('金币不足')
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughLv){
                        UIMgr.I.tip('等级不足a')
                    }else{
                        UIMgr.I.tip('转生失败')
                    }
                })
            }
        }else{
            UIMgr.I.tip('等级不足')
        }
    }
    selectedItem:ShopItem;
    buyItem=(item:ShopItem)=>{
        let num = 1
        let id = item.Id
        if(id==2){
            num=10
        }
        let max=0;
        if(item.PriceType==1){
            max=Math.floor((GD.role.data.Gold as number)/item.Price);
        }else if(item.PriceType==2){
            max=Math.floor((GD.role.data.Dia as number)/item.Price);
        }else if(item.PriceType==3){
            max=Math.floor((GD.role.data.MuPoint as number)/item.Price);
        }else if(item.PriceType==4){
            max=Math.floor((GD.role.kfJf as number)/item.Price);
            if(max>100)max=100;//跨服积分商店，每次最多只能买100个，不如会超限制
        }else if(item.PriceType==5){
            max=Math.floor((GD.role.data.ZmGx as number)/item.Price);
            if(max>100)max=100;//战盟商店，每次最多只能买100个，不如会超限制
        }
        if(max>0){
            if(max>10000)max=10000;
            UIMgr.I.PopView.showSliderBox(`${item.name}x${num}`,Tools.getItemColor(id),max,'购买',this.onSliderOk,item,false,false)
        }else{
            UIMgr.I.tip(`${PriceTypeStr[item.PriceType]}不足`)
        }
        this.curMaxSliderValue=max
    }
    buyEquip=(item:ShopItem)=>{
        this.doBuy(item,1)
    }
    doBuy=(item:ShopItem,num:number)=>{
        let req = outer_pb.NpcShopAct.create();
        req.Num = num
        req.Id = item.Id
        req.NpcId = this.npc.Id;
        let buff = outer_pb.NpcShopAct.encode(req).finish();
        let type = MT.BuyNpcShopItem
        if(this.npc.Id==43){
            type = MT.BuyKfShopItem
        }else if(this.npc.Id==44){
            type = MT.ZmBuyShopItem
        }
        WS.send(type,buff,(d:any)=>{
            let rsp = outer_pb.NpcShopAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                const id = rsp.Id
                if(item.PriceType==1){
                    GD.role.reduceGold(rsp.Cost); //金币
                }else if(item.PriceType==2){
                    GD.role.reduceDia(rsp.Cost); //钻石
                }else if(item.PriceType==3){
                    GD.role.reduceMuPoint(rsp.Cost);
                }else if(item.PriceType==4){
                    GD.role.reduceKfJf(rsp.Cost)//跨服积分
                }else if(item.PriceType==5){
                    GD.role.reduceZmGx(rsp.Cost)//战盟贡献
                }
                if(rsp.NpcId==43||rsp.NpcId==44){
                    if(rsp.Equips.length>0){
                        rsp.Equips.forEach(equip=>{
                            GD.role.getEquip(equip,true)
                        })
                    }
                    if(rsp.Items){
                        GD.role.getItems(rsp.Items,true,true)
                    }
                    let info=''
                    if(rsp.NpcId==43){
                        info=`${this.npc.Name}，您的跨服积分剩余：${(GD.role.kfJf).toLocaleString()}`;
                    }else{
                        info=`${this.npc.Name}，您的战盟贡献剩余：${(GD.role.data.ZmGx).toLocaleString()}`;
                    }
                    this.npcName.string = info
                }else{
                    if(id>=10000){
                        //装备
                        GD.role.getEquip(rsp.EquipData,true)
                    }else{
                        GD.role.getItem(rsp.Id,rsp.Num,true)
                    }
                }
                UIMgr.I.tip('购买成功',ct.green)
            }else{
                UIMgr.I.tip('购买失败')
            }
        })
    }
    onSliderOk=(num:number)=>{
        this.doBuy(this.selectedItem,num)
    }
    msg:string;
    talkMsg:string;
    msgIndex:number;
    needGold:number=0;
    needDia:number=0;
    needLv:number=0;
    npc:Npc;
    initData(data: any): void {
        this.npc = data as Npc;
        this.npcName.string = this.npc.Name;
        const id = this.npc.Id
        let nodeName=''+id
        const taskId = GD.role.ResetDayData.MainQuest.TaskId;
        this.msg=this.npc.Msg[0];
        this.zsTab.node.active=taskId==79
        if(id==10||id==20){
            //卡隆10，恶魔入口;大天使使者20，血色入口
            nodeName='fb'
            this.renderFbView();
        }else if((id==21&&taskId==58)||(id==15&&taskId==62)||(id==28&&taskId==76)||(id==29&&taskId==79)){
            this.zzBtn.off(Node.EventType.TOUCH_END)
            let str=''
            let cb:()=>void
            if(id==29){
                this.msg = ZhuanShengInfo
                str = '转世重生'
                cb=this.doZs
            }else{
                this.msg = AdvanceRoleTypeLvInfo
                str = '职业进阶'
                cb=this.doZZ
            }
            this.zzBtn.children[0].getComponent(Label).string = str
            this.zzBtn.on(Node.EventType.TOUCH_END,cb)
            str=`为了保证和维护大陆的正常运转，所有勇士<br/>在举行【<color=${ct.green}>${str}</>】仪式时，都要缴纳手续费<br/><br/>`
            nodeName='job';
            if(taskId==58){
                this.needGold=3000000
                this.needLv=150
                str += `当前第一次转职，需要：<br/><color=${ct.brown}>等级>=150级</><br/><color=${ct.yellow}>300万金币</><br/>`
            }else if(taskId==62){
                this.needGold=5000000
                this.needLv=220
                str += `当前第二次转职，需要：<br/><color=${ct.brown}>等级>=220级</><br/><color=${ct.yellow}>500万金币</><br/>`
            }else if(taskId==76){
                this.needGold=10000000
                this.needLv=380
                str += `当前第三次转职，需要：<br/><color=${ct.brown}>等级满380级</><br/><color=${ct.yellow}>1000万金币</>`
            }else if(taskId==79){
                const zsNum = GD.role.data.ZsNum+1;
                this.needGold = GD.configs.get(ConfigType.ZhuanShengNeedBaseGold)*zsNum //转生次数*20亿金币、或10万钻石
                this.needDia = GD.configs.get(ConfigType.ZhuanShengNeedBaseDIa)*zsNum
                let needStr = `${this.needGold/100000000}亿金币`
                let color=ct.yellow
                if(this.zsTab.selectedIndex==1){
                    needStr = `${this.needDia/10000}万钻石`
                    color=ct.qing
                }
                this.needLv=400
                str += `当前第${zsNum}次转生，需要：<br/><color=${ct.brown}>等级满400级</><br/><color=${color}>${needStr}</><br/>`
            }
            this.zzRich.string=str
        }else{
            if(this.npc.SellItems.length>0){
                this.scheduleOnce(()=>{
                    this.shopItemList.array=this.npc.SellItems;
                },0)
                nodeName='shop';
            }
            if(this.npc.Id==43){
                //获取当前跨服积分
                WS.send(MT.GetMyKfJf,GD.EmptyRequestBuff,(d:any)=>{
                    let rsp = outer_pb.NpcShopAct.decode(d);
                    GD.role.kfJf=rsp.Cost
                    this.npcName.string = `${this.npc.Name}，您的跨服积分剩余：${(rsp.Cost>>0).toLocaleString()}`;
                })
            }else if(this.npc.Id==44){
                //战盟商店
                this.npcName.string = `${this.npc.Name}，您的战盟贡献剩余：${GD.role.data.ZmGx.toLocaleString()}`;
            }
        }
        this.content.children.forEach(node=>{
            node.active = node.name==nodeName;
        })
        this.msgIndex=0;
        this.talkMsg=''
        this.schedule(this.talk,0.1)
    }
    talk(){
        if(this.msgIndex<this.msg.length){
            this.talkMsg+=this.msg[this.msgIndex];
            this.msgIndex++;
            this.msgLabel.string = this.talkMsg;
        }else{
            this.unschedule(this.talk)
        }
    }
    onHide(): void {
        this.selectedItem=null;
        this.msg=null;
        this.talkMsg=null;
        this.msgLabel.string=''
        this.unschedule(this.talk);
    }
}


