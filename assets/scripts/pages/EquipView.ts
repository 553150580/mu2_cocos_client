import { _decorator, Component, EventTouch, Label, Node, NodeEventType, RichText, Sprite, Toggle, UITransform, Widget } from 'cc';
import { Tab } from '../UiComps/Tab';
import { List } from '../UiComps/List';
import GD from '../base/GameData';
import {  AtkEquipBase, BodyType, BoxMsg, ct, DzType,  EquipType, Item, ItemType, RoleType, TsType, WingBase, ZSType } from '../base/types';
import Tools from '../base/tools';
import WS from '../base/net';
import {  ConfigType, Err, MT } from '../base/MT';
import { PageType, UIMgr } from '../managers/UIMgr';
import { EquipTypeStr, ItemTypeStr, QhOrZyAddBuffInfo } from '../base/consts';
import GameManager from '../managers/GameManager';
import { ViewStack } from '../UiComps/ViewStack';
import { Npc14View } from './Npc14View';
import { Npc13View } from './Npc13View';
import { HcPage } from './HcPage';
import { Npc31View } from './Npc31View';
import { RoleUIControl } from '../battle/RoleUIControl';
const { ccclass, property } = _decorator;

@ccclass('EquipView')
export class EquipView extends Component {
    @property(Tab)
    bagTab:Tab;
    @property(List)
    list:List;
    @property(Toggle)
    itemTypeToggle:Toggle;
    @property(Tab)
    itemTypeTab:Tab;
    @property(Toggle)
    deleteManyToggle:Toggle
    @property(Node)
    sortBtn:Node
    @property(Node)
    infoBox:Node;
    @property(Node)
    infoBg:Node
    @property(Sprite)
    infoFrame:Sprite
    @property(RichText)
    infoText:RichText
    @property(Label)
    infoHead:Label
    @property(Sprite)
    infoIconFrame:Sprite
    @property(Sprite)
    infoIcon:Sprite

    @property(Node)
    compareBox:Node;
    @property(Node)
    compareBg:Node
    @property(Sprite)
    compareFrame1:Sprite
    @property(RichText)
    compareText1:RichText
    @property(Sprite)
    compareFrame2:Sprite
    @property(RichText)
    compareText2:RichText
    @property(Node)
    switchBtn:Node
    @property(Label)
    qhAddBuff:Label
    @property(Label)
    zyAddBuff:Label
    @property(Node)
    chaiFen:Node
    @property(RichText)
    hsPrice:RichText 
    @property(Node)
    recoverBtn:Node 
    // @property(Node)
    // bindBtn:Node 
    @property(Node)
    pushCkBtn:Node
    @property(Node)
    compareBtn:Node
    @property(Node)
    recoverAll:Node
    @property(Node)
    lockBtn:Node
    @property(Toggle)
    dzToggle:Toggle
    @property(Toggle)
    qhToggle:Toggle
    @property(Toggle)
    gjToggle:Toggle
    @property(Node)
    dressBtn:Node
    @property(Node)
    capBox:Node
    @property(Label)
    capLabel:Label
    @property(Node)
    weapon:Node
    @property(Node)
    body:Node
    @property(Node)
    hand:Node
    @property(Node)
    ring1:Node
    @property(Node)
    foot:Node
    @property(Node)
    dunPai:Node
    @property(Node)
    head:Node
    @property(Node)
    neck:Node
    @property(Node)
    ring2:Node
    @property(Node)
    leg:Node
    @property(Node)
    em:Node
    @property(Node)
    tianshi:Node
    @property(Node)
    wing:Node
    @property(Node)
    horse:Node
    @property(Node)
    xunZhang:Node
    @property(Node)
    pet:Node
    @property(Node)
    roleBox:Node
    @property(Node)
    bodyBox:Node
    @property(Node)
    cancelBtn:Node
    @property(Node)
    cancleAll:Node

    @property(Node)
    filterView:Node
    @property(Node)
    filterBtn:Node
    @property(Node)
    filterBg:Node
    @property(Node)
    zyToggles:Node
    @property(Node)
    ysBox:Node
    @property(Node)
    addQhBtn:Node
    @property(Label)
    qhLabel:Label
    @property(Node)
    reduceQhBtn:Node
    @property(Node)
    addZjBtn:Node
    @property(Label)
    zjLabel:Label
    @property(Node)
    reduceZjBtn:Node
    @property(Node)
    addXyBtn:Node
    @property(Label)
    xyLabel:Label
    @property(Node)
    reduceXyBtn:Node
    @property(Toggle)
    save4z4:Toggle
    @property(Toggle)
    saveQh6:Toggle
    @property(Toggle)
    saveZ12xy3:Toggle
    @property(Toggle)
    saveMagicWeapon:Toggle
    @property(Toggle)
    saveZyWeapon:Toggle
    @property(Toggle)
    save380:Toggle
    // @property(Toggle)
    // save400:Toggle
    @property(Toggle)
    zsToggle:Toggle
    @property(Toggle)
    fsToggle:Toggle
    @property(Toggle)
    gjsToggle:Toggle
    @property(Toggle)
    mjsToggle:Toggle
    @property(Toggle)
    sdsToggle:Toggle
    @property(Toggle)
    zhToggle:Toggle
    @property(Toggle)
    fjNot380Toggle:Toggle

    @property(ViewStack)
    dzView:ViewStack
    @property(Node)
    zfQhBtn:Node
    @property(Node)
    lhQhBtn:Node
    @property(Node)
    yjQh9Btn:Node
    @property(Node)
    gjQhBtn:Node
    @property(Node)
    tzQhBtn:Node
    @property(Node)
    dtsQhBtn:Node
    @property(Node)
    zjBtn:Node
    @property(Node)
    xyBtn:Node
    @property(Node)
    zsBtn:Node
    @property(Node)
    jhBtn:Node
    @property(Node)
    pvpBtn:Node
    @property(Node)
    djBtn:Node
    @property(Node)
    czBtn:Node
    @property(Node)
    tsNeckBtn:Node
    // @property(Node)
    // moveProBtn:Node

    @property(Node)
    hcPet:Node
    @property(Node)
    rhPet:Node
    @property(Node)
    xlPet:Node
    @property(Node)
    djPet:Node
    @property(Node)
    czPet:Node
    @property(Node)
    resetPet:Node
    @property(Node)
    resetXz:Node
    @property(Node)
    fuMo:Node
    @property(Node)
    tsShouHu:Node

    role:RoleUIControl;
    selectedIndex:number;
    selectedNode:Node;
    selectedBodyNode:Node;
    selectedItem:any;
    // bodyType:BodyType=BodyType.None;
    selectedIndexList:number[]=[];
    selectedBodyType:BodyType;

    isShow:boolean=false;
    static I:EquipView;
    hideToggle=()=>{
        this.gjToggle.isChecked=this.qhToggle.isChecked=false
    }
    onLoad() {
        EquipView.I=this;
        this.node.on('refreshBag',this.refreshBag)
        this.node.on('cancelToggle',this.cancelToggle)
        this.dzToggle.node.on('toggle',()=>{
            this.hideToggle();
            if(this.selectedItem){
                let equip = this.selectedItem as outer_pb.IEquip;
                let equipType = equip.Id/10000>>0
                if(equipType<EquipType.Pet){
                    this.dzView.selectedIndex=0
                    this.tsNeckBtn.active=equipType==EquipType.Ring||equipType==EquipType.Neck
                }else if(equipType==EquipType.Pet){
                    this.dzView.selectedIndex=1
                }else if(equipType==EquipType.Em||equipType==EquipType.TianShi||equipType==EquipType.Horse||equipType==EquipType.XunZhang){
                    this.dzView.selectedIndex=2
                    this.resetXz.active=equipType==EquipType.XunZhang;
                }
            }
            GD.playClickSound();
        },this);
        this.gjToggle.node.on('toggle',(toggle:Toggle)=>{
            if(toggle.isChecked&&this.qhToggle.isChecked)this.qhToggle.isChecked=false
        })
        this.qhToggle.node.on('toggle',(toggle:Toggle)=>{
            if(toggle.isChecked&&this.gjToggle.isChecked)this.gjToggle.isChecked=false
        })
        this.lockBtn.on(Node.EventType.TOUCH_END,this.tryLockEquip,this);
        this.zfQhBtn.on(Node.EventType.TOUCH_END,this.zfQh,this);
        this.lhQhBtn.on(Node.EventType.TOUCH_END,this.lhQh,this);
        this.yjQh9Btn.on(Node.EventType.TOUCH_END,this.yjQh9,this);
        this.gjQhBtn.on(Node.EventType.TOUCH_END,this.gjQh,this);
        this.tzQhBtn.on(Node.EventType.TOUCH_END,this.tzQh,this);
        this.dtsQhBtn.on(Node.EventType.TOUCH_END,this.dtsQh,this);
        this.zjBtn.on(Node.EventType.TOUCH_END,this.addZj,this);
        this.xyBtn.on(Node.EventType.TOUCH_END,this.addXy,this);
        this.zsBtn.on(Node.EventType.TOUCH_END,this.addZs,this);
        this.jhBtn.on(Node.EventType.TOUCH_END,this.addJh,this);
        this.pvpBtn.on(Node.EventType.TOUCH_END,this.addPvp,this);
        this.djBtn.on(Node.EventType.TOUCH_END,this.djZy,this);
        this.djPet.on(Node.EventType.TOUCH_END,this.djZy,this);
        this.qhAddBuff.node.parent.on(Node.EventType.TOUCH_END,()=>{
            UIMgr.I.PopView.showHelpBox(QhOrZyAddBuffInfo)
        },this);
        //属性转移
        // this.moveProBtn.on(Node.EventType.TOUCH_END,()=>{
        //     let equip = this.selectedItem as outer_pb.IEquip;
        //     if(equip.IsLock){
        //         UIMgr.I.tip('转移属性之前需要先解锁装备')
        //     }else{
        //         UIMgr.I.show(PageType.NpcShopPage,GD.npc_list.get(32))
        //         Npc32View.I.selectedEquip(this.selectedItem,this.selectedBodyType)
        //     }
        // },this);
        this.tsNeckBtn.on(Node.EventType.TOUCH_END,()=>{
            let equip = this.selectedItem as outer_pb.IEquip;
            if(equip.QhLv<9){
                UIMgr.I.tip('强化+9及以上首饰才能吞噬与被吞噬')
            }else{
                if(equip.Lv<10){
                    UIMgr.I.show(PageType.NpcShopPage,GD.npc_list.get(13))
                    Npc13View.I.selectedTsEquip(this.selectedItem,this.selectedBodyType,TsType.RingNeck)
                }else{
                    UIMgr.I.tip('已满10级')
                }
            }
        },this);
        this.tsShouHu.on(Node.EventType.TOUCH_END,()=>{
            let equip = this.selectedItem as outer_pb.IEquip;
            if(equip.Lv<100){
                UIMgr.I.show(PageType.NpcShopPage,GD.npc_list.get(13))
                const equipType = equip.Id/10000>>0;
                let tsType=TsType.ShouHu
                if(equipType==EquipType.XunZhang){
                    tsType=TsType.XunZhang
                }else if(equipType==EquipType.Horse){
                    tsType=TsType.Horse
                }
                Npc13View.I.selectedTsEquip(this.selectedItem,this.selectedBodyType,tsType)
            }else{
                UIMgr.I.tip('已满100级')
            }
        },this);
        this.hcPet.on(Node.EventType.TOUCH_END,()=>{
            let equip = this.selectedItem as outer_pb.IEquip;
            if(equip.Lv<20){
                UIMgr.I.show(PageType.NpcShopPage,GD.npc_list.get(14))
                Npc14View.I.selectedHcPet(this.selectedItem,this.selectedBodyType)
            }else{
                UIMgr.I.tip('已满20级')
            }
        },this);
        this.rhPet.on(Node.EventType.TOUCH_END,()=>{
            let equip = this.selectedItem as outer_pb.IEquip;
            if(equip.YsList.length>=8){
                UIMgr.I.tip('已满融合')
            }else{
                if(equip.Lv>=15&&equip.ZyList.length>=9&&equip.Grow.every(v=>{return v>=10000})){
                    UIMgr.I.show(PageType.NpcShopPage,GD.npc_list.get(14))
                    Npc14View.I.selectedRhPet(this.selectedItem,this.selectedBodyType)
                }else{
                    UIMgr.I.tip('满15级且满成长值满卓越的宠物才可融合')
                }
            }
        },this);
        this.xlPet.on(Node.EventType.TOUCH_END,()=>{
            UIMgr.I.show(PageType.NpcShopPage,GD.npc_list.get(14))
            Npc14View.I.selectedXlPet(this.selectedItem,this.selectedBodyType)
        },this);
        this.resetPet.on(Node.EventType.TOUCH_END,()=>{
            UIMgr.I.show(PageType.NpcShopPage,GD.npc_list.get(14))
            Npc14View.I.selectedResetPet(this.selectedItem,this.selectedBodyType)
        },this);
        this.resetXz.on(Node.EventType.TOUCH_END,()=>{
            UIMgr.I.show(PageType.NpcShopPage,GD.npc_list.get(31))
            Npc31View.I.selectedResetEquip(3,this.selectedItem,this.selectedBodyType)
        },this);
        this.fuMo.on(Node.EventType.TOUCH_END,()=>{
            let equip = this.selectedItem as outer_pb.IEquip;
            if(equip.QhLv<9||equip.ZjLv<4){
                UIMgr.I.tip('+9追4及以上装备才能附魔')
            }else{
                UIMgr.I.show(PageType.NpcShopPage,GD.npc_list.get(31))
                Npc31View.I.selectedFuMoEquip(this.selectedItem,this.selectedBodyType)
            }
        },this);
        this.czBtn.on(Node.EventType.TOUCH_END,this.czZy,this);
        this.czPet.on(Node.EventType.TOUCH_END,this.czZy,this);
        this.filterBtn.on(Node.EventType.TOUCH_END,this.showBagSet,this);
        this.addQhBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            if(GD.role.BagSet.QhLv<9){
                GD.playClickSound();
                GD.role.BagSet.QhLv++;
                this.qhLabel.string=`强化等级 >= ${GD.role.BagSet.QhLv}`
            }else{
                UIMgr.I.showProsMsg('强化+9以上请手动回收')
            }
        },this);
        this.reduceQhBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            if(GD.role.BagSet.QhLv>0){
                GD.role.BagSet.QhLv--;
                this.qhLabel.string=`强化等级 >= ${GD.role.BagSet.QhLv}`
                GD.playClickSound();
            }
        },this);
        this.addZjBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            if(GD.role.BagSet.ZjLv<16){
                GD.role.BagSet.ZjLv+=4; //4 8 12 16、5 10 15 20
                this.zjLabel.string=`追加等级 >= ${GD.role.BagSet.ZjLv}`
                GD.playClickSound();
            }else{
                UIMgr.I.showProsMsg('追加+16以上请手动回收')
            }
        },this);
        this.reduceZjBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            if(GD.role.BagSet.ZjLv>0){
                GD.playClickSound();
                GD.role.BagSet.ZjLv-=4;
                this.zjLabel.string=`追加等级 >= ${GD.role.BagSet.ZjLv}`
            }
        },this);
        this.addXyBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            if(GD.role.BagSet.XyLv<4){
                GD.playClickSound();
                GD.role.BagSet.XyLv++;
                this.xyLabel.string=`幸运等级 >= ${GD.role.BagSet.XyLv}`
            }else{
                UIMgr.I.showProsMsg('幸运+4以上请手动回收')
            }
        },this);
        this.reduceXyBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            if(GD.role.BagSet.XyLv>0){
                GD.role.BagSet.XyLv--;
                this.xyLabel.string=`幸运等级 >= ${GD.role.BagSet.XyLv}`
                GD.playClickSound();
            }
        },this);
        this.filterBg.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.filterView.active=false;
            //保存到BagSet
            this.saveBagSet();
            this.filterBagEquip()
            GameManager.I.playOpenSound();
        },this);
        this.bodyBox.children.forEach((node,index)=>{
            //0为roleBox
            if(index>0){
                node.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
                    this.selectedBodyNode=node;
                    this.selectedBodyType = index
                    this.selectedItem = GD.role.BodyEquips[index]
                    this.showInfoBox(true);
                },this);
            }
        })
        this.infoBg.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.infoText.string=''
            this.hideInfoBox()
            this.selectedBodyType=BodyType.None;
            this.setSelectedNull();
        },this);
        this.sortBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            const type = this.bagTab.selectedIndex;
            this.list.array.sort((item1:outer_pb.IEquip,item2:outer_pb.IEquip)=>{
                if(type==0){
                    if(item1.IsLock){
                        return -1;
                    }
                    if(item2.IsLock){
                        return 1;
                    }
                }
                return item1.Id-item2.Id
            })
            this.list.refresh()
        },this);
        this.compareBg.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.hideInfoBox()
            this.compareBox.active=false;
            this.selectedBodyType=BodyType.None;
            this.setSelectedNull();
        },this);
        this.compareBtn.on(Node.EventType.TOUCH_END,this.onCompareBtnClick,this);
        this.switchBtn.on(Node.EventType.TOUCH_END,this.onDressBtnClick,this);
        // this.yjSave.on(Node.EventType.TOUCH_END,this.onMoveMyManyBagItemsIntoCk,this);
        // this.itemTypeTab.needReset=false
        this.itemTypeTab.selectedHandler=(node:Node,index)=>{
            GD.playClickSound();
            this.setSelectedNull();
            Tools.filterBagLit(this.itemTypeToggle,node,this.bagTab.selectedIndex,index,this.list)
        }
        this.bagTab.selectedHandler = (node:Node,index:number)=>{
            if(this.isShow){
                // GD.playClickSound();
            }else{
                this.isShow=true;
            }
            this.selectedIndexList=[];
            this.deleteManyToggle.isChecked=false;
            let btnStr=''
            if(index==0){
                this.itemTypeTab.labels = EquipTypeStr;
                this.list.array = GD.role.BagEquips.sort(Tools.sortBagEquip);
                this.capBox.active=true;
                // this.deleteManyToggle.node.active=true
                btnStr='批量回收'
                this.refreshCapLabel()
                this.showRole();
            }else{
                this.itemTypeTab.labels = ItemTypeStr;
                this.capBox.active=false;
                // this.deleteManyToggle.node.active=false
                btnStr='批量存仓'
                this.list.array = GD.role.BagItems.sort((a,b)=>{return a.Id-b.Id});
            }
            this.deleteManyToggle.node.children[0].getComponent(Label).string=btnStr
            // this.itemTypeTab.getComponent(Widget).top=53;
            this.itemTypeTab.select(0);
        }
        this.cancelBtn.on(Node.EventType.TOUCH_END,this.cancelToggle,this)
        this.cancleAll.on(Node.EventType.TOUCH_END,()=>{this.setSelectedNull();this.refreshBag()},this)
        this.deleteManyToggle.node.on('toggle',this.onToggle,this);
        this.recoverBtn.on(Node.EventType.TOUCH_END,this.onRecoverBtnClick,this)
        // this.bindBtn.on(Node.EventType.TOUCH_END,this.onBindBtnClick,this)
        this.pushCkBtn.on(Node.EventType.TOUCH_END,this.pushCk,this)
        this.dressBtn.on(Node.EventType.TOUCH_END,this.onDressBtnClick,this)
        this.recoverAll.on(Node.EventType.TOUCH_END,this.onRecoverAllBtnClick,this)
        this.chaiFen.on(Node.EventType.TOUCH_END,this.onDoChaiFen,this)
        this.list.cellRender = (node:Node,index:number)=>{
            let data:any = this.list.array[index];
            //是否是新道具
            node.children[5].active=data.IsNew;
            //是否更好
            let better = node.children[4]
            let lock = node.children[6]
            if(this.bagTab.selectedIndex==0){
                better.active=this.isBetter(data);
                lock.active = data.IsLock
            }else{
                lock.active = better.active=false;
            }
            Tools.renderBagItem(this.bagTab.selectedIndex,data,node)
            this.refreshCellSkin(node,index);
        }
        this.list.selectedHandler = (node:Node,index:number)=>{
            if(this.list.isMultiple){
                if(this.bagTab.selectedIndex==0){
                    let equip = this.list.array[index];
                    const et = equip.Id/10000>>0;
                    if(et>=EquipType.Wing||(equip.ZyList.length>0&&equip.QhLv>3)){
                        UIMgr.I.tip('贵重道具无法批量回收')
                        return
                    }
                }
                const i = this.selectedIndexList.indexOf(index);
                if(i==-1){
                    this.selectedIndexList.push(index);
                }else{
                    this.selectedIndexList.splice(i,1);
                }
                this.refreshCellSkin(node,index);
                GameManager.I.playClickSound();
            }else{
                //单选
                let old = this.selectedNode;
                this.selectedNode=node;
                this.selectedBodyType=BodyType.None;
                let item = this.list.array[index]
                this.selectedItem=item;
                item.IsNew=false;
                node.children[5].active=false;
                this.selectedIndex = index;
                old&&this.refreshCellSkin(old,-1);
                this.showInfoBox(false);
            }
        }
    }
    czZy=()=>{
        let equip = this.selectedItem as outer_pb.IEquip;
        if(equip.ZyList.length==0){
            UIMgr.I.tip('只有卓越装备才能重置卓越属性')
        }else{
            UIMgr.I.show(PageType.NpcShopPage,GD.npc_list.get(31))
            Npc31View.I.selectedResetEquip(4,this.selectedItem,this.selectedBodyType)
        }
    }
    tryLockEquip(){
        let equip = this.selectedItem as outer_pb.IEquip; //缓存，防止变化
        if(equip.IsLock&&GD.role.data.HasLockPass){
            //解锁，需要提供密码
            UIMgr.I.PopView.showMsgBox(null,'解锁',(pass:string)=>{
                this.doLockEquip(pass)
            },'',true)
        }else{
            this.doLockEquip('')
        }
    }
    doLockEquip=(pass:string)=>{
        let equip = this.selectedItem as outer_pb.IEquip; //缓存，防止变化
        let req = outer_pb.DzAct.create();
        req.Uid=this.selectedItem.Uid;
        req.BodyType = this.selectedBodyType||0;
        req.pass=pass
        let buff = outer_pb.DzAct.encode(req).finish();
        WS.send(MT.LockEquip,buff,(d:any)=>{
            let rsp=outer_pb.DzAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                equip.IsLock=rsp.Equip.IsLock;
                if(rsp.BodyType>0){
                    this.bodyBox.children[rsp.BodyType].children[2].active=equip.IsLock;
                }else{
                    this.refreshBag();
                }
                let info = ''
                if(equip.IsLock){
                    info='锁定'
                }else{
                    info='解锁'
                }
                this.resetLockBtn(equip)
                UIMgr.I.tip(`${info}成功`,ct.green)
            }else if(rsp.ErrCode==Err.ErrCode_EquipNotFound){
                UIMgr.I.tip('解锁失败')
            }else{
                UIMgr.I.tip('密码错误')
            }
        })
    }
    qhCheck=[new BoxMsg('<br/>强化后会提升装备需求，您确定强化吗？',ct.brown)]
    zfQh() {
        let equip = this.selectedItem as outer_pb.IEquip;
        if(this.isBodyEquip){
            UIMgr.I.PopView.showMsgBox(this.qhCheck,'确定',()=>{
                if(equip.QhLv<6){
                    if(GD.role.hasEnoughItem(601,1)){
                        this.tryDz(DzType.ZfQh)
                    }
                }else{
                    UIMgr.I.tip('+6以上只能用灵魂强化')
                }
            },'取消')
        }else{
            if(equip.QhLv<6){
                if(GD.role.hasEnoughItem(601,1)){
                    this.tryDz(DzType.ZfQh)
                }
            }else{
                UIMgr.I.tip('+6以上只能用灵魂强化')
            }
        }
    }
    lhQh() {
        let equip = this.selectedItem as outer_pb.IEquip;
        if(this.isBodyEquip){
            UIMgr.I.PopView.showMsgBox(this.qhCheck,'确定',()=>{
                if(equip.QhLv<9){
                    if(GD.role.hasEnoughItem(602,1)){
                        this.tryDz(DzType.LhQh)
                    }
                }else{
                    UIMgr.I.tip('+9以上只能使用高级强化')
                }
            },'取消')
        }else{
            if(equip.QhLv<9){
                if(GD.role.hasEnoughItem(602,1)){
                    this.tryDz(DzType.LhQh)
                }
            }else{
                UIMgr.I.tip('+9以上只能使用高级强化')
            }
        }
    }
    yjQh9() {
        let equip = this.selectedItem as outer_pb.IEquip;
        if(this.isBodyEquip){
            UIMgr.I.PopView.showMsgBox(this.qhCheck,'确定',()=>{
                if(equip.QhLv<9){
                    if(GD.role.hasEnoughItem(601,1)||GD.role.hasEnoughItem(602,1)){
                        this.tryDz(DzType.YjQh9) 
                    }
                }else{
                    UIMgr.I.tip('+9以上只能使用高级强化')
                }
            },'取消')
        }else{
            if(equip.QhLv<9){
                if(GD.role.hasEnoughItem(601,1)||GD.role.hasEnoughItem(602,1)){
                    this.tryDz(DzType.YjQh9) 
                }
            }else{
                UIMgr.I.tip('+9以上只能使用高级强化')
            }
        }
    }
    djZy(){
        let eq = this.selectedItem as outer_pb.IEquip;
        let et=eq.Id/10000>>0
        let maxLen = 6
        if(et==EquipType.Wing||et==EquipType.Pet) maxLen=9
        if(eq.ZyList.length>=maxLen){
            UIMgr.I.tip('已满属性')
        }else{
            if(et==EquipType.Pet||
                ((et==EquipType.Weapon||et==EquipType.Wing||et==EquipType.JianTong||et==EquipType.Neck||et==EquipType.ZHBook)&&
                (et==EquipType.Wing||eq.ZyList.length>0)&&
                eq.QhLv>=9&&eq.ZjLv>=4)){
                UIMgr.I.show(PageType.HcPage)
                HcPage.I.dzSelectHcType(null,12,eq,this.selectedBodyType)
                // HcPage.I.addOneNeed1Equip_fromEquipView(eq,this.selectedBodyType)
            }else{
                UIMgr.I.tip('宠物、翅膀、+9追4卓越武器项链才能叠加')
            }
        }
    }
    //高级强化：强化+10~15
    gjQh() {
        let equip = this.selectedItem as outer_pb.IEquip;
        if(equip.QhLv>=9){
            if(equip.QhLv<15){
                UIMgr.I.show(PageType.HcPage)
                HcPage.I.dzSelectHcType(null,7,equip,this.selectedBodyType)
                // HcPage.I.addOneNeed1Equip_fromEquipView(equip,this.selectedBodyType)
            }else{
                UIMgr.I.tip('已强化满15级')
            }
        }else{
            UIMgr.I.tip('+9以上才能进行高级强化')
        }
    }
    tzQh() {
        let equip = this.selectedItem as outer_pb.IEquip;
        if(equip.ZyList.length>0&&equip.QhLv>=15&&equip.ZjLv>=4){
            if(equip.TzLv<20){
                let hcType = equip.TzLv>0?15:14
                UIMgr.I.show(PageType.HcPage)
                HcPage.I.dzSelectHcType(null,hcType,equip,this.selectedBodyType)
                // HcPage.I.addOneNeed1Equip_fromEquipView(equip,this.selectedBodyType)
            }else{
                UIMgr.I.tip('已满20级')
            }
        }else{
            UIMgr.I.tip('+15追4及以上卓越装备才能进阶套装')
        }
    }
    dtsQh() {
        let equip = this.selectedItem as outer_pb.IEquip;
        if(equip.TzLv>0){
            if(equip.DtTzLv<20){
                UIMgr.I.show(PageType.HcPage)
                HcPage.I.dzSelectHcType(null,16,equip,this.selectedBodyType)
                // HcPage.I.addOneNeed1Equip_fromEquipView(equip,this.selectedBodyType)
            }else{
                UIMgr.I.tip('已满20级')
            }
        }else{
            UIMgr.I.tip('只有套装才能进阶大天使套装属性')
        }
    }
    addZj(){
        this.hideToggle();
        let equip = this.selectedItem as outer_pb.IEquip;
        let equipType = equip.Id/10000>>0
        let p = 4
        if(equipType==EquipType.Shield||equipType==EquipType.Ring){
            p = 5
        }
        if(equip.ZjLv/p<6){
            if(GD.role.hasEnoughItem(603,1)){
                this.tryDz(DzType.AddZj)
            }
        }else{
            UIMgr.I.tip('已追加满级')
        }
    }
    addXy(){
        this.hideToggle();
        let equip = this.selectedItem as outer_pb.IEquip;
        if(equip.LuckyLv<9){
            if(GD.role.hasEnoughItem(621,1)){
                this.tryDz(DzType.AddXy)
            }
        }else{
            UIMgr.I.tip('已达满幸运+9')
        }
    }
    addZs(){
        this.hideToggle();
        if(GD.role.hasEnoughItem(606,1)){
            this.tryDz(DzType.AddZs)
        }
    }
    addJh(){
        this.hideToggle();
        let equip = this.selectedItem as outer_pb.IEquip;
        if(equip.ZsType==ZSType.None){
            UIMgr.I.tip('请先为装备添加再生属性')
        }else if(equip.ZsLv==15){
            UIMgr.I.tip('已进化满15级')
        }else if(equip.ZsLv<equip.QhLv){
            let id = 614
            if(equip.ZsLv>9) id=615
            if(GD.role.hasEnoughItem(id,1)){
                this.tryDz(DzType.AddJh)
            }
        }else{
            UIMgr.I.tip('再生属性进化等级无法超过装备的强化等级')
        }
    }
    addPvp(){
        let equip = this.selectedItem as outer_pb.IEquip;
        if(equip.PvpLv>=10){
            UIMgr.I.tip('已满10级')
        }else if(equip.QhLv<13||equip.ZjLv<16){
            UIMgr.I.tip('+13追16及以上的装备才能锻造PvP属性')
        }else{
            if(GD.role.hasEnoughItem(607,1)){
                this.tryDz(DzType.AddPvP)
            }
        }
    }
    needRefreshList:boolean=false
    tryDz(dzType:DzType){
        let equip = this.selectedItem as outer_pb.IEquip; //缓存，防止变化
        let req = outer_pb.DzAct.create();
        req.Uid=this.selectedItem.Uid;
        req.BodyType = this.selectedBodyType||0;
        req.DzType = dzType
        let buff = outer_pb.DzAct.encode(req).finish();
        WS.send(MT.DzAct,buff,(d:any)=>{
            let rsp=outer_pb.DzAct.decode(d);
            if(rsp.BasePros){
                UIMgr.I.resetRoleBasePros(rsp.BasePros)
            }
            if(rsp.Equip){
                let e=rsp.Equip
                equip.QhLv=e.QhLv
                equip.ZjLv=e.ZjLv
                equip.LuckyLv=e.LuckyLv
                equip.ZsType=e.ZsType
                equip.ZsLv=e.ZsLv
                equip.PvpLv=e.PvpLv
                equip.Data=e.Data
                if(rsp.BodyType>0)this.refreshBodySlot(rsp.BodyType)
                Tools.showEquip(equip,this.infoText,this.infoHead)
                Tools.resetInfoFrameHeight(this.infoText,this.infoFrame.node);
                this.setDirty();
                // this.infoFrame.getComponent(UITransform).height = this.infoText.node.getComponent(UITransform).height+60;
            }
            if(rsp.Items.length>0){
                rsp.Items.forEach(item=>{
                    GD.role.reduceItem(item.Id,item.Num)
                })
            }
            if(rsp.ErrCode==Err.ErrCode_Success){
                if(dzType<=DzType.AddXy) this.needRefreshList=true
                UIMgr.I.showProsMsg('锻造成功',ct.green)
                GameManager.I.playTipSound('ding')
            }else{
                GameManager.I.playErrorSound()
                if(rsp.ErrCode==Err.ErrCode_Failed){
                    UIMgr.I.showProsMsg('锻造失败')
                }else if(rsp.ErrCode==Err.ErrCode_NotEnoughItem){
                    UIMgr.I.showProsMsg('道具不足')
                }else if(rsp.ErrCode==Err.ErrCode_EquipNotFound){
                    UIMgr.I.showProsMsg('装备不存在')
                }
            }
        });
    }
    protected onEnable(): void {
        this.show()
    }
    show=()=>{
        this.bagTab.select(0,true);
        for(let i=BodyType.Head;i<=BodyType.Pet;i++){
            this._refreshBodySlot(i)
        }
        this.refreshQhAddBuff()
    }
    refreshQhAddBuff=()=>{
        let data=GD.role.basePros
        this.qhAddBuff.string=`最大攻击力+${Math.round(data.MaxAtkUp*1000)/10}% 防御力+${data.TaoDef>>0} 防御率+${data.TaoDefRate>>0}`
        let addZyBuffNum=0
        for(let k in GD.role.BodyEquips){
            let equip=GD.role.BodyEquips[k]
            if(equip&&equip.ZyList.length>0){
                const zyNum=equip.ZyList.length
                const equipType = equip.Id/10000>>0
                if(equipType==EquipType.Wing){
                    let base:WingBase = GD.EquipBaseDatas.get(equip.Id)
                    if(base.EquipLv==3){
                        //3代翅膀：所有卓越属性条数都+2%
                        addZyBuffNum+=zyNum*2
                    }else{
                        //1/2代翅膀：所有卓越属性条数都+1%
                        addZyBuffNum+=zyNum
                    }
                }else if(zyNum>1){
                    //其它的从第二条卓越属性开始计算，没多一条+1%
                    addZyBuffNum += (zyNum-1)*0.5
                }
            }
        }
        this.zyAddBuff.string=`卓越属性条数加成：伤害提升+${Math.round(addZyBuffNum*10)/10}%`
    }
    protected onDisable(): void {
        this.hideInfoBox()
        this.isShow=false
        GD.role.BagEquips.forEach(equip=>{equip.IsNew=false})
    }
    refreshBag=()=>{
        Tools.filterBagLit1(this.bagTab.selectedIndex,this.itemTypeTab.selectedIndex,this.list)
        if(this.bagTab.selectedIndex==1){
            if(this.infoBox.active&&this.selectedItem&&this.infoBoxMode==0){
                let d = GD.ItemBaseDatas.get(this.selectedItem.Id)
                if(d){
                    this.infoHead.string = `${d.Name} x${this.selectedItem.Num}`
                    if(this.selectedItem.Num<=0){
                        this.infoBox.active=false
                    }
                }
            }
        }
        this.refreshCapLabel()
    }
    private refreshCapLabel=()=>{
        this.capLabel.string = `${GD.role.BagEquips.length}/${GD.role.getMaxBagCap()}`;
    }
    cancelToggle=()=>{
        this.selectedIndexList=[];
        this.deleteManyToggle.isChecked=false;
    }
    saveBagSet(){
        let set = GD.role.BagSet;
        //0~11是卓越属性，12是卓越忽略强化追加，13是保留幸运卓越，14是同时满足还是或，15是保留首饰类型，16是保留技能武器
        this.zyToggles.children.forEach((node,i)=>{
            if(i==14){
                set.Zys[i]=node.getComponent(Tab).selectedIndex;
            }else{
                set.Zys[i]=node.getComponent(Toggle).isChecked?1:0;
            }
        })
        //17~43是附魔属性
        this.ysBox.children.forEach((node,i)=>{
            set.Zys[i+17]=node.getComponent(Toggle).isChecked?1:0;
        })
        //44是+4追4
        set.Zys[44]=this.save4z4.isChecked?1:0;
        //45是+6
        set.Zys[45]=this.saveQh6.isChecked?1:0;
        //46是追12幸运3
        set.Zys[46]=this.saveZ12xy3.isChecked?1:0;
        set.Sets[13]=this.saveMagicWeapon.isChecked?1:0;
        set.Sets[14]=this.saveZyWeapon.isChecked?1:0;
        set.Sets[15]=this.save380.isChecked?1:0;
        // set.Sets[16]=this.save400.isChecked?1:0;
        set.Sets[17]=this.zsToggle.isChecked?1:0;
        set.Sets[18]=this.fsToggle.isChecked?1:0;
        set.Sets[19]=this.gjsToggle.isChecked?1:0;
        set.Sets[20]=this.mjsToggle.isChecked?1:0;
        set.Sets[21]=this.sdsToggle.isChecked?1:0;
        set.Sets[22]=this.zhToggle.isChecked?1:0;
        set.Sets[23]=this.fjNot380Toggle.isChecked?1:0;
        WS.send(MT.SaveBagSet,outer_pb.BagSet.encode(set).finish())
    }
    showBagSet=()=>{
        this.filterView.active=true;
        let set = GD.role.BagSet;
        this.qhLabel.string = `强化等级 >= ${set.QhLv}`;
        this.zjLabel.string = `追加等级 >= ${set.ZjLv}`;
        this.xyLabel.string = `幸运等级 >= ${set.XyLv}`;
        if(set.Zys.length<47){
            set.Zys = [
                1,1,1,1,1,1,1,1,1,1,1,1,//0-11卓越属性
                1,1,1,1,0, //12-16
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,//17-43附魔属性
                1,0,1, //44、45、46：保留+4z4、+6、z12xy3
            ];
        }
        this.zyToggles.children.forEach((node,i)=>{
            if(i==14){
                node.getComponent(Tab).select(set.Zys[i]);
            }else{
                node.getComponent(Toggle).isChecked = set.Zys[i]==1//?true:false;
            }
        });
        this.ysBox.children.forEach((node,i)=>{
            node.getComponent(Toggle).isChecked = set.Zys[i+17]==1//?true:false;
        })
        this.save4z4.isChecked = set.Zys[44]==1
        this.saveQh6.isChecked = set.Zys[45]==1
        this.saveZ12xy3.isChecked = set.Zys[46]==1
        this.saveMagicWeapon.isChecked = set.Sets[13]==1
        this.saveZyWeapon.isChecked = set.Sets[14]==1
        this.save380.isChecked = set.Sets[15]==1
        // this.save400.isChecked = set.Sets[16]==1
        this.zsToggle.isChecked = set.Sets[17]==1
        this.fsToggle.isChecked = set.Sets[18]==1
        this.gjsToggle.isChecked = set.Sets[19]==1
        this.mjsToggle.isChecked = set.Sets[20]==1
        this.sdsToggle.isChecked = set.Sets[21]==1
        this.zhToggle.isChecked = set.Sets[22]==1
        this.fjNot380Toggle.isChecked = set.Sets[23]==1
        GameManager.I.playOpenSound();
    }
    private canSell(data:outer_pb.IEquip):boolean{
        if(data.IsLock||data.QhLv>9||data.Exp>0||data.YsList.length>2||data.ZjLv>15||data.LuckyLv>4||data.Lv>0||data.PvpLv>0||data.ZsType>0||data.TzLv>0)return false;
        let equipType = data.Id/10000>>0;
        if (equipType >= EquipType.Wing) {
            return false
        }
        let base=GD.EquipBaseDatas.get(data.Id)
        if (base.DropLv >= 900) {
            //玛雅武器、大天使等特殊装备
            return false
        }
        let isZy = data.ZyList.length>0;
        let set = GD.role.BagSet;
        if(equipType==EquipType.Ring||equipType==EquipType.Neck){
            let ringNeck = set.Zys[14];
            if(ringNeck==0){
                return false;
            }else if(ringNeck==1){
                if(isZy) return false;
            }
        }
        if(data.YsList.length>0){
            let i= data.YsList.findIndex(v=>{
                return set.Zys[v%100+17]==1;
            });
            if(i>-1) {
                return false;
            }
        }
        if(isZy){
            if(set.Zys[13]==1&&data.LuckyLv>0)return false;//保留幸运卓越
            //保留卓越武器
            if(equipType>=EquipType.Weapon&&equipType!=EquipType.Shield){
                let save=set.Sets[14]
                if(save){
                    return false
                }
            }
            //保留>=380卓越
            let save=set.Sets[15]
            if(save&&base.NeedLv>=380){
                return false
            }
            //保留400卓越
            // save=set.Sets[16]
            // if(save&&base.NeedLv==400){
            //     return false
            // }
            let can:boolean=true;
            if(set.Zys[12]==0){
                //卓越不忽略强化、追加
                can = this.canSell1(data)
            }
            let i = data.ZyList.findIndex((z,i)=>{return set.Zys[z]==1;});
            if(i>-1) {
                can = false;
            }
            if(can==false&&(equipType<EquipType.Weapon||equipType==EquipType.Shield)){
                //回收所有380以下卓越防具、首饰(含双属)
                let save=set.Sets[23]
                if(save&&base.NeedLv<380){
                    return true
                }
            }
            if(data.ZyList.length>1){
                return false
            }
            return can;
        }else{
            if(equipType>=EquipType.Weapon&&equipType!=EquipType.Shield&&(base.RoleType==RoleType.ZHS||data.Id<80101||equipType==EquipType.JianTong||data.SkillId>0)) {
                //保留普通高级武器
                // if(base.DropLv >= 69 ){
                //     return false
                // }
                //保留技能武器
                if(equipType!=EquipType.Shield&&data.SkillId>0){
                    let saveSkill=set.Zys[15]
                    if(saveSkill){
                        const type=base.RoleType
                        if(set.Sets[17]&&(type&1)>0)return false
                        if(set.Sets[18]&&(type&2)>0)return false
                        if(set.Sets[19]&&(type&4)>0)return false
                        if(set.Sets[20]&&(type&8)>0)return false
                        if(set.Sets[21]&&(type&16)>0)return false
                        if(set.Sets[22]&&(type&32)>0)return false
                    }
                }
                //保留法杖、箭筒
                if(data.Id<80101||equipType==EquipType.JianTong){
                    let save=set.Sets[13]
                    if(save){
                        return false
                    }
                }
            }
            return this.canSell1(data)
        }
    }
    canSell1(data:outer_pb.IEquip):boolean{
        //保留+4追4
        const set = GD.role.BagSet;
        let save = set.Zys[44]
        if(save&&data.QhLv>=4&&data.ZjLv>=4){
            return false
        }
        //保留+5
        save = set.Zys[45]
        if(save&&data.QhLv>=5){
            return false
        }
        //保留追12幸运3
        save = set.Zys[46]
        if(save&&data.ZjLv>=12&&data.LuckyLv>=3){
            return false
        }

        let isAnd = set.Zys[16]
        if(isAnd){
            return data.QhLv<set.QhLv||data.ZjLv<set.ZjLv||data.LuckyLv<set.XyLv
        }else{
            //or
            return !(data.QhLv>=set.QhLv||data.ZjLv>=set.ZjLv||data.LuckyLv>=set.XyLv)
        }
    }
    showRole(){
        let info = GD.role.data
        if(this.role==null||this.role.name!=info.Name){
            Tools.get_UI_Role(info,this.roleBox,false).then((role:RoleUIControl)=>{
                this.role = role;
                this.role.updateAllEquipUI(GD.role.BodyEquips,info.RoleType,false);
            })
            // Tools.getOtherUIBox(info.Name,info.Lv,info.DsLv,info.ZsNum,info.RoleType,this.roleBox,info.ChIdLv).then((role:PlayerControl)=>{
            //     this.role = role;
            //     this.role.updateAllEquipUI(GD.role.BodyEquips,info.RoleType,false);
            // });
        }
    }
    isBetter(item:outer_pb.IEquip):boolean{
        let base:any = GD.EquipBaseDatas.get(item.Id);
        if(base&& (!base.RoleType||(base.RoleType&GD.role.data.RoleType)>0)){
            let bodyType = Tools.getBodyType(item);
            if(bodyType){
                let old = GD.role.BodyEquips[bodyType];
                if(old){
                    let newEquipType = item.Id/10000>>0
                    let oldEquipType = old.Id/10000>>0
                    //武器、防具、首饰
                    if(bodyType<=10){
                        let old_base = GD.EquipBaseDatas.get(old.Id)
                        let a=0
                        if (item.QhLv > 9) {
                            a = (item.QhLv % 9) * ((item.QhLv % 9) + 1) / 2
                        }
                        let item_num = item.QhLv*3+a+item.ZjLv
                        let isZy = item.ZyList.length>0
                        if(newEquipType==EquipType.Ring){
                            item_num = item.QhLv*5+a+item.ZjLv+item.Lv*(isZy?20:10)
                        }else if(newEquipType==EquipType.Neck){
                            item_num = item.QhLv*3+a+item.ZjLv+item.Lv*(isZy?10:5)
                        }else{
                            if(newEquipType==EquipType.JianTong||newEquipType==EquipType.Weapon||newEquipType==EquipType.ZHBook){
                                if(base.MagicAtkUp>0){
                                    item_num += isZy?base.ZyMagicAtkUp:base.MagicAtkUp
                                }else{
                                    item_num += isZy?base.MaxZyAtk:base.MaxAtk
                                }
                            }else{
                                item_num += isZy?base.ZyDef:base.Def;
                            }
                        }

                        let b=0
                        if (old.QhLv > 9) {
                            b = (old.QhLv % 9) * ((old.QhLv % 9) + 1) / 2
                        }
                        let old_num = old.QhLv*3+b+old.ZjLv;
                        let oldIsZy = old.ZyList.length>0;
                        if(oldEquipType==EquipType.Ring){
                            old_num = old.QhLv*5+b+old.ZjLv+old.Lv*(old.ZyList.length>0?20:10)
                        }else if(oldEquipType==EquipType.Neck){
                            old_num = old.QhLv*3+b+old.ZjLv+old.Lv*(old.ZyList.length>0?10:5)
                        }else{
                            if(oldEquipType==EquipType.JianTong||oldEquipType==EquipType.Weapon||newEquipType==EquipType.ZHBook){
                                if(old_base.MagicAtkUp>0){
                                    old_num += oldIsZy?old_base.ZyMagicAtkUp:old_base.MagicAtkUp
                                }else{
                                    old_num += oldIsZy?old_base.MaxZyAtk:old_base.MaxAtk
                                }
                            }else{
                                old_num += oldIsZy?old_base.ZyDef:old_base.Def;
                            }
                        }
                        return item_num>old_num
                    }else {
                        return item.Lv>old.Lv;
                    }
                }
            }
            return true
        }else{
            return false
        }
    }
    refreshCellSkin=(node:Node,index:number)=>{
        let isSelected = false;
        if(this.list.isMultiple){
            isSelected = this.selectedIndexList.indexOf(index)>-1;
        }else{
            isSelected = this.selectedNode == node;
        }
        //可显示被选中模式下，才显示选中状态背景
        node.children[0].active = this.list.isMultiple ? isSelected : this.list.showCheckmark&&isSelected;
        //多选模式下，才显示选择标记
        const check_icon = node.children[3];
        check_icon.active = this.list.isMultiple;
        if(check_icon.active){
            check_icon.children[0].active = isSelected;
        }
    }
    resetLockBtn(equip:outer_pb.IEquip){
        let info=''
        let color=ct.white
        if(equip.IsLock){
            info='已锁定'
            color=ct.brown
        }else{
            info='未锁定'
        }
        let label=this.lockBtn.children[0].getComponent(Label)
        label.string=info;
        label.color.fromHEX(color)
    }
    infoBoxMode:number=0;
    needMinNum:number=0;
    needCheck:boolean=false;
    isBodyEquip:boolean=false;
    showInfoBox(isBodyEquip:boolean){
        if(this.selectedItem){
            this.isBodyEquip=isBodyEquip
            let node:Node;
            let isEquip = this.bagTab.selectedIndex==0
            let showChaiFen:boolean=false;
            this.lockBtn.active=this.dzToggle.node.active=isEquip||this.selectedBodyType>BodyType.None;//this.bindBtn.active=
            let id = this.selectedItem.Id
            let showRecoverAll=false
            if(this.selectedBodyType>BodyType.None){
                //装备栏的装备
                node=this.selectedBodyNode;
                this.infoBoxMode=1
                this.pushCkBtn.active = this.recoverBtn.active = this.compareBtn.active = false
                this.dressBtn.active = true
                this.dressBtn.children[0].getComponent(Label).string='卸下'
                this.resetLockBtn(this.selectedItem)
                Tools.showEquip(this.selectedItem,this.infoText,this.infoHead)
            }else{
                this.pushCkBtn.active = id!=5&&id!=6
                this.needCheck=false
                node=this.selectedNode;
                this.infoBoxMode=0
                let comPareLabel = this.compareBtn.children[0].getComponent(Label);
                let dressBtnLabel = this.dressBtn.children[0].getComponent(Label);
                if(isEquip){
                    let equip:outer_pb.IEquip=this.selectedItem;
                    const et = equip.Id/10000>>0
                    showChaiFen = equip.Lv>0&&(et==EquipType.Em||et==EquipType.TianShi||et==EquipType.XunZhang||et==EquipType.Horse)
                    this.resetLockBtn(this.selectedItem)
                    Tools.showEquip(this.selectedItem,this.infoText,this.infoHead)
                    let obj = Tools.getEquipRecoverPrice(this.selectedItem);
                    this.hsPrice.string=obj//obj.priceStr;
                    // this.hsPrice.color.fromHEX(ct.yellow);
                    // this.hsPrice.color.fromHEX(obj.priceType==0?ct.yellow:ct.qing);
                    this.dressBtn.active = this.compareBtn.active = true
                    comPareLabel.string='对比'
                    dressBtnLabel.string='穿戴'
                }else{
                    Tools.showItem(id,this.selectedItem.Num,this.infoText,this.infoHead)
                    let base = GD.ItemBaseDatas.get(id);
                    let show1=true
                    let show10=true
                    if(base){
                        let btnStr1=''
                        let btnStr10=''
                        this.needMinNum=1
                        let allStr=''
                        if(base.ItemType==ItemType.Box){
                            btnStr1='打开1个'
                            btnStr10='打开10个'
                            if(id==26||id==33){
                                //南瓜、樱花箱子
                                showRecoverAll=true
                                allStr='打开全部'
                            }else if(id==500){
                                //爆竹
                                showRecoverAll=true
                                allStr='全部打开'
                            }
                        }else if(base.ItemType==ItemType.CanUse){
                            if(id>=711&&id<=765){
                                //荧光宝石
                                btnStr1='转换1个'
                                btnStr10='转换10个'
                            }else if(id==614||id==608||id==609){
                                btnStr1='合成1个'
                                btnStr10=''
                                show10=false
                                if(id==614){
                                    this.needMinNum=10 //低进
                                }else if(id==608||id==609){
                                    this.needMinNum=50 //羽毛、国王
                                }
                            }else if(id==18){
                                btnStr1='合成1个'
                                btnStr10='合成10个'
                                this.needMinNum=5 //昆顿印记
                                showRecoverAll=true
                                allStr='合成全部'
                            }else if(id==605){
                                btnStr1='提炼1个'
                                btnStr10='提炼10个'
                            }else if(id==47){
                                btnStr1='熔炼1次'
                                btnStr10='熔炼10次'
                                this.needMinNum=100 //装备残片
                                showRecoverAll=true
                                allStr='熔炼全部'
                            }else if(id==53||id==75){
                                btnStr1='提炼1个'
                                btnStr10='提炼10个'
                                this.needMinNum=1000 //宝石原矿、宝石碎片
                                showRecoverAll=true
                                allStr='提炼全部'
                            }else if(id==19){
                                btnStr1='回收1个'
                                btnStr10='进入'
                                this.needCheck=true
                                showRecoverAll=true
                                allStr='回收全部'
                            }else if(id==612){
                                btnStr1='合成1个'
                                btnStr10='合成10个'
                                this.needMinNum=30 //套装石
                                showRecoverAll=true
                                this.needCheck=true
                                allStr='合成全部'
                            }else{
                                btnStr1='使用1个'
                                btnStr10='使用10个'
                            }
                        }else if(base.ItemType==ItemType.SkillItem||(id>=403&&id<=406)){
                            btnStr1='回收1个'
                            btnStr10='回收10个'
                            showRecoverAll=true
                            allStr='回收全部'
                            this.needCheck = base.ItemType==ItemType.SkillItem
                        }else{
                            let item = GD.HasFjPriceItems.get(id)
                            if(item){
                                btnStr1='回收1个'
                                btnStr10='回收10个'
                                showRecoverAll=true
                                allStr='回收全部'
                                this.needCheck=true
                            }else{
                                show1=false
                                show10=false
                            }
                        }
                        comPareLabel.string=btnStr1
                        dressBtnLabel.string=btnStr10
                        this.recoverAll.children[0].getComponent(Label).string=allStr
                    }else{
                        show1=false
                        show10=false
                    }
                    this.compareBtn.active = show1
                    this.dressBtn.active = show10
                    // if(this.selectedItem.Num<10) this.dressBtn.active = false
                }
                this.recoverBtn.active = isEquip//&&(id/10000>>0)<EquipType.Wing
            }
            this.chaiFen.active = showChaiFen
            this.recoverAll.active = showRecoverAll
            this.dzToggle.isChecked=false;
            this.infoIconFrame.spriteFrame=node.getComponent(Sprite).spriteFrame;
            this.infoIcon.spriteFrame=node.children[this.selectedBodyType?0:1].getComponent(Sprite).spriteFrame;
            this.infoBox.active=true;
            Tools.resetInfoFrameHeight(this.infoText,this.infoFrame.node);
            GameManager.I.playOpenSound();
        }
        this.setDirty();
    }
    setDirty=()=>{
        this.chaiFen.getComponent(Widget).setDirty();
        this.pushCkBtn.getComponent(Widget).setDirty();
        this.dzToggle.getComponent(Widget).setDirty();
        this.infoFrame.getComponent(Widget).setDirty();
        this.lockBtn.getComponent(Widget).setDirty();
        this.recoverBtn.getComponent(Widget).setDirty();
        // this.bindBtn.getComponent(Widget).setDirty();
        this.compareBtn.getComponent(Widget).setDirty();
        this.dressBtn.getComponent(Widget).setDirty();
        this.recoverAll.getComponent(Widget).setDirty();
        this.infoIconFrame.getComponent(Widget).setDirty();
        this.infoText.getComponent(Widget).setDirty();
        this.infoHead.getComponent(Widget).setDirty();
        this.infoText.node.parent.getComponent(Widget).setDirty();
    }
    onCompareBtnClick=(event:EventTouch)=>{
        if(this.infoBoxMode==0&&this.selectedItem){
            GameManager.I.playClickSound();
            if(this.bagTab.selectedIndex==0){
                let equip = this.selectedItem as outer_pb.IEquip
                let bodyType = Tools.getBodyType(equip)
                if(bodyType){
                    let old = GD.role.BodyEquips[bodyType]
                    if(old){
                        GameManager.I.playClickSound();
                        this.hideInfoBox()
                        this.compareBox.active=true;
                        Tools.showEquip(old,this.compareText1,null)
                        Tools.showEquip(this.selectedItem,this.compareText2,null)
                        let max = Math.max(this.compareText1.node.getComponent(UITransform).height,this.compareText2.node.getComponent(UITransform).height)*0.8
                        this.compareFrame1.getComponent(UITransform).height = max//+40;
                        this.compareFrame2.getComponent(UITransform).height = max//+40;
                        return;
                    }
                }
                UIMgr.I.tip('可装备栏为空，无可对比装备')
            }else{
                //打开箱子
                let id = this.selectedItem.Id;
                const num=this.selectedItem.Num
                if(num>=this.needMinNum){
                    if(num<=this.needMinNum){
                        this.hideInfoBox()
                    }
                    Tools.sendUseItemAct(id,1,this.needCheck);
                    if(id==500) GameManager.I.playTipSound('baozu');
                }else{
                    UIMgr.I.tip('数量不足')
                }
            }
        }
    }
    onDoChaiFen=()=>{
        if(this.selectedItem){
            let equip:outer_pb.IEquip=this.selectedItem;
            const et = equip.Id/10000>>0
            if(equip.Lv>0&&(et==EquipType.Em||et==EquipType.TianShi||et==EquipType.XunZhang||et==EquipType.Horse)){
                UIMgr.I.PopView.showSliderBox(`将该装备拆成2个，请设置拆出新装备的等级<br/>新装备的等级=设置的数值-1<br/><color=${ct.qing}>拆分需要：2000钻石x拆分数量</>`,ct.brown,equip.Lv,'拆分',(num:number)=>{
                    let need=num*2000
                    if(GD.role.hasEnoughDia(need)){
                        let req = outer_pb.PetAct.create();
                        req.Uid1=equip.Uid;
                        req.Num=num;
                        let buff = outer_pb.PetAct.encode(req).finish();
                        WS.send(MT.ChaiFen,buff,(d:any)=>{
                            let rsp=outer_pb.PetAct.decode(d);
                            if(rsp.ErrCode==Err.ErrCode_Success){
                                equip.Lv=rsp.Pet.Lv
                                GD.role.reduceDia(rsp.Num)
                                GD.role.getEquip(rsp.Equip2,true);
                                this.refreshBag();
                                Tools.showEquip(equip,this.infoText,this.infoHead)
                                Tools.resetInfoFrameHeight(this.infoText,this.infoFrame.node);
                                this.setDirty();
                                UIMgr.I.tip('拆分成功',ct.green)
                            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughDia){
                                UIMgr.I.tip('钻石不足')
                            }else{
                                UIMgr.I.tip('无法拆分')
                            }
                        })
                    }
                })
            }
        }
    }
    onRecoverAllBtnClick(){
        if(this.selectedItem){
            const num=this.selectedItem.Num
            if(num>=this.needMinNum){
                if(this.bagTab.selectedIndex==1){
                    const id=this.selectedItem.Id
                    Tools.sendUseItemAct(id,num/this.needMinNum>>0,this.needCheck||id==500,id==500) //500表示爆竹，全部打开时需要确认，且需要发送是否全部打开标志
                    GD.playClickSound();
                    if(num<=this.needMinNum){
                        this.hideInfoBox()
                    }
                }                
            }else{
                UIMgr.I.tip('数量不足')
            }
        }
    }
    // onMoveMyManyBagItemsIntoCk=()=>{
    //     WS.send(MT.MoveMyManyBagItemsIntoCk,GD.EmptyRequestBuff,(d:any)=>{
    //         let rsp=outer_pb.UseItemAct.decode(d);
    //         if(rsp.ErrCode==Err.ErrCode_Success){
    //             UIMgr.I.tip('操作成功',ct.green)
    //         }else{
    //             UIMgr.I.tip('操作失败')
    //         }
    //     })
    // }
    onDressBtnClick(){
        if(this.infoBoxMode==0){
            if(this.selectedItem){
                if(this.bagTab.selectedIndex==0){
                    //背包装备：穿戴
                    let equip = this.selectedItem as outer_pb.IEquip
                    let bodyType = Tools.checkCanDress(equip)
                    if(bodyType){
                        this.hideInfoBox()
                        this.compareBox.active=false;
                        this.setSelectedNull();
                        let req = outer_pb.DressEquip.create();
                        req.DressUid=equip.Uid;
                        req.BodyType = bodyType;
                        let buff = outer_pb.DressEquip.encode(req).finish();
                        WS.send(MT.DressEquip,buff,this.onDressEquip);
                    }else{
                        UIMgr.I.tip('无法装备')
                    }
                }else{
                    //打开或使用道具10个
                    let id = this.selectedItem.Id;
                    //爆竹、黄金宝箱需要检查背包空间
                    // if(id>=500&&id<=510&&GD.role.BagEquips.length>=GD.configs.MaxBagCap){
                    //     UIMgr.I.tip('背包满了，请先清理背包')
                    //     return
                    // }
                    const num=this.selectedItem.Num;
                    if(id==19&&num>0){
                        this.hideInfoBox()
                        //打开进入卡利玛神庙的层数列表
                        UIMgr.I.PopView.showKaLvBox(509);
                    }else{
                        if(num>=this.needMinNum*10){
                            Tools.sendUseItemAct(id,10,this.needCheck)
                            if(id==500){
                                GameManager.I.playTipSound('baozu')
                            }else{
                                GD.playClickSound();
                            }
                        }else{
                            UIMgr.I.tip('数量不足')
                        }
                        if(num<this.needMinNum){
                            this.hideInfoBox()
                        }
                    }
                }
            }
        }else{
            //装备栏装备：卸下
            if(this.selectedBodyType>BodyType.None&&this.selectedItem){
                this.hideInfoBox()
                this.setSelectedNull();
                let req = outer_pb.DressEquip.create();
                req.BodyType = this.selectedBodyType;
                let buff = outer_pb.DressEquip.encode(req).finish();
                WS.send(MT.UnDressEquip,buff,this.onUnDressEquip);
                this.deleteManyToggle.isChecked&&this.cancelToggle()
            }
        }
    }
    onToggle(toggle:Toggle){
        const type=this.bagTab.selectedIndex
        this.filterBtn.active = type==0;
        this.cancleAll.active = type==1;
        if(toggle.isChecked==false){
            if(this.selectedIndexList.length>0){
                if(type==0){
                    //批量回收装备
                    if(GD.role.data.IsYkMode==false||GD.role.hasBaseYk()){
                        let uids:Array<string>=[];
                        this.selectedIndexList.forEach(i=>{
                            let equip = this.list.array[i]  as outer_pb.IEquip;
                            if(equip.IsLock==false) uids.push(equip.Uid);
                        })
                        this.sendRecoverEquips(uids,'')
                    }
                }else{
                    //批量存入道具到仓库
                    let ids:Array<number>=[];
                    this.selectedIndexList.forEach(i=>{
                        let item = this.list.array[i]  as Item;
                        const id=item.Id
                        if(id!=5&&id!=6) ids.push(id);
                    })
                    if(ids.length>0){
                        let req = outer_pb.CkAct.create();
                        req.Ids = ids;
                        req.Id = 0; //0表示默认仓库，//GD.role.data.Id;
                        let buff = outer_pb.CkAct.encode(req).finish();
                        WS.send(MT.MoveMyManyBagItemsIntoCk,buff,(d:any)=>{
                            let rsp=outer_pb.CkAct.decode(d);
                            if(rsp.ErrCode==Err.ErrCode_Success){
                                rsp.Ids.forEach(id=>{
                                    GD.role.tryDeleteItem(id)
                                })
                                this.refreshBag()
                                let str='仓库';
                                if(GD.role.data.DefaultCk>0&&GD.role.hasBaseYk(false)){
                                    str='【默认仓库】'
                                }
                                UIMgr.I.tip(`成功存入${str}`,ct.green)
                            }else{
                                UIMgr.I.tip('存入失败')
                            }
                        })
                    }
                }
            }
            this.setSelectedNull();
        }else{
            let btnStr=''
            if(type==0){
                this.filterBagEquip()
                btnStr='确定回收'
            }else{
                this.filterBagItem()
                btnStr='确定存仓'
            }
            this.deleteManyToggle.node.children[1].children[0].getComponent(Label).string=btnStr
        }
        GameManager.I.playClickSound();
        // this.setSelectedNull();
        this.list.isMultiple = toggle.isChecked;
    }
    filterBagItem(){
        this.selectedIndexList=[]
            //并过滤背包道具的选择
        this.list.array.forEach((item:Item,index:number)=>{
            if(item.Id!=5&&item.Id!=6){
                this.selectedIndexList.push(index);
            }
        })
        this.list.refresh();
    }
    filterBagEquip(){
        this.selectedIndexList=[]
            //并过滤背包道具的选择
        this.list.array.forEach((equip:outer_pb.IEquip,index:number)=>{
            if(this.canSell(equip)){
                this.selectedIndexList.push(index);
            }
        })
        this.list.refresh();
    }
    pushCk=()=>{
        if(this.selectedItem){
            if(this.bagTab.selectedIndex==0){
                //背包装备：穿戴
                let equip = this.selectedItem as outer_pb.IEquip
                let req = outer_pb.CkAct.create();
                req.UidList=[equip.Uid];
                req.Id=0 //0表示默认仓库 //GD.role.data.Id;
                let buff = outer_pb.CkAct.encode(req).finish();
                WS.send(MT.MoveMyBagEquipIntoCk,buff,(d:any)=>{
                    let rsp = outer_pb.CkAct.decode(d);
                    let str='仓库';
                    if(GD.role.data.DefaultCk>0&&GD.role.hasBaseYk(false)){
                        str='【默认仓库】'
                    }
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        GD.role.tryDeleteBagEquip(equip.Uid)
                        this.refreshBag();
                        UIMgr.I.tip(`成功存入${str}`,ct.green)
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughCap){
                        UIMgr.I.tip(`${str}容量不足`)
                    }else{
                        UIMgr.I.tip('操作失败')
                    }
                })
            }else{
                let item = this.selectedItem as outer_pb.IItem
                let base = GD.ItemBaseDatas.get(item.Id);
                let str = `${base.Name}x${item.Num.toLocaleString()}`
                this.curMaxSliderValue=item.Num>10000?10000:item.Num;
                let color = Tools.getItemColor(item.Id)
                UIMgr.I.PopView.showSliderBox(str,color,this.curMaxSliderValue,'存入仓库',this.onSliderOk)
            }
        }
        this.hideInfoBox();
    }
    curMaxSliderValue:number=1
    onSliderOk=(num:number)=>{
        let item = this.selectedItem as outer_pb.IItem
        if(item==null)return
        if(num>item.Num){
            num=item.Num
        }
        if(num<=0){
            UIMgr.I.tip('数量必须大于0')
        }else{
            let req = outer_pb.CkAct.create();
            req.ItemId=this.selectedItem.Id;
            req.ActNum=num;
            let buff = outer_pb.CkAct.encode(req).finish();
            WS.send(MT.MoveMyBagItemsIntoDefaultCk,buff,(d:any)=>{
                let rsp = outer_pb.CkAct.decode(d);
                // console.log('onMoveMyBagItemsIntoCk',rsp)
                if(rsp.ErrCode==Err.ErrCode_Success){
                    if(rsp.ActType==0){
                        //从背包存入到仓库
                        GD.role.reduceItem(req.ItemId,req.ActNum)
                        this.refreshBag();
                        let str='仓库';
                        if(GD.role.data.DefaultCk>0&&GD.role.hasBaseYk(false)){
                            str='【默认仓库】'
                        }
                        UIMgr.I.tip(`成功存入${str}`,ct.green)
                    }
                }
            })
        }
    }
    //绑定装备
    // onBindBtnClick(){
    //     if(this.bagTab.selectedIndex==0&&this.selectedItem){
    //         let equip = this.selectedItem as outer_pb.IEquip
    //         let base:AtkEquipBase=GD.EquipBaseDatas.get(equip.Id)
    //         if(base){
    //             //绑定价格根据钻石交易行的比例
    //             // let equipType=equip.Id/10000>>0
    //             // let can = equipType>=EquipType.Wing||equip.QhLv>9||equip.ZjLv>12||equip.TzLv>0||equip.DtTzLv>0||equip.ZyList.length>0||equip.Lv>0||equip.Exp>0||equip.LuckyLv>5
    //             // let price=equip.QhLv
    //             //绑定【${base.Name}】需要：<color=${ct.gray}>暂未开放</>
    //             let msg=`<br/>绑定功能暂未开放<br/><color=${ct.gray}>装备绑定后，佩戴角色在黄名、红名状态下死亡时不会掉落该装备</><br/>`
    //             UIMgr.I.PopView.showMsgBox([new BoxMsg(msg,ct.white)],'绑定',(pass:string)=>{
    //                 UIMgr.I.tip('绑定功能暂未开放')
    //             },'取消',false)
    //         }
    //     }
    // }
    //回收一件装备
    onRecoverBtnClick(){
        if(this.bagTab.selectedIndex==0&&this.selectedItem){
            this.hideInfoBox()
            let equip = this.selectedItem as outer_pb.IEquip
            if(equip.IsLock){
                UIMgr.I.tip('无法回收已锁定装备，请先解锁')
            }else{
                let et=equip.Id/10000>>0
                if(et>=EquipType.Wing||equip.ZyList.length>0||(equip.IsBZ==false&&(equip.QhLv>3||equip.LuckyLv>3||equip.ZjLv>12||equip.PvpLv>0||equip.ZsType>ZSType.None||equip.Lv>0||equip.Exp>0))){
                    //回收贵重道具，需要提供密码
                    UIMgr.I.PopView.showMsgBox([new BoxMsg('<br/><br/>贵重道具，确定回收吗？',ct.gray)],'回收',(pass:string)=>{
                        this.sendRecoverEquips([equip.Uid],pass)
                    },'取消',true)
                }else{
                    this.sendRecoverEquips([equip.Uid],'')
                }
            }
        }
    }
    sendRecoverEquips(uids:Array<string>,pass:string){
        let req = outer_pb.RecoverEquips.create();
        req.UidList=uids;
        req.Pass=pass;
        let buff = outer_pb.RecoverEquips.encode(req).finish();
        WS.send(MT.RecoverEquips,buff,this.onRecoverEquips)
    }
    hideInfoBox(){
        this.infoBox.active=false;
        if(this.needRefreshList){
            this.list.refresh()
            this.needRefreshList=false;
        }
    }
    onUnDressEquip=(d:any)=>{
        let rsp = outer_pb.DressEquip.decode(d);
        // console.log('onUnDressEquip',rsp)
        if(rsp.BodyType){
            if(rsp.UnDressUid){
                let old = GD.role.BodyEquips[rsp.BodyType]
                if(old.Uid==rsp.UnDressUid){
                    GD.role.BodyEquips[rsp.BodyType]=null
                    if(old.TzLv>0)GD.role.resetTzPros();
                    //旧的放入背包
                    GD.role.BagEquips.push(old)
                    if(this.itemTypeTab.selectedIndex>0){
                        this.itemTypeTab.select(this.itemTypeTab.selectedIndex)
                    }else{
                        this.list.refresh();
                    }
                    // if(old.SkillId>0||rsp.BodyType==BodyType.Horse){
                    //     let skillId=old.SkillId
                    //     if(rsp.BodyType==BodyType.Horse&&old.Lv>=5)skillId=67
                    //     let skill = GD.role.skills.get(skillId);
                    //     if(skill){
                    //         if(skill.Lv==0){
                    //             skill.canUse=false;
                    //             GD.role.skills.delete(skill.Id)
                    //             UIMgr.I.resetAllSkillSlotSkin();
                    //         }else{
                    //             skill.Lv--;
                    //         }
                    //     }
                    // }
                    GD.player.updateEquipUI(null,rsp.BodyType,GD.role.data.RoleType) //场景的role
                    this.role.updateEquipUI(null,rsp.BodyType,GD.role.data.RoleType) //装备栏的预览role
                    //更新装备栏显示
                    UIMgr.I.resetRoleBasePros(rsp.BasePros)
                    this.refreshBodySlot(rsp.BodyType)
                    UIMgr.I.showProsMsg('卸下成功',ct.green)
                    GameManager.I.playTipSound('getItem');
                }
            }
        }else{
            UIMgr.I.tip('卸下失败')
        }
    }
    onDressEquip=(d:any)=>{
        let rsp = outer_pb.DressEquip.decode(d);
        // console.log('onDressEquip',rsp)
        if(rsp.BodyType){
            let shouldResetTzPros=false
            if(rsp.UnDressUid){
                let old = GD.role.BodyEquips[rsp.BodyType]
                if(old&&old.Uid==rsp.UnDressUid){
                    GD.player.updateEquipUI(null,rsp.BodyType,GD.role.data.RoleType) //场景的role
                    this.role.updateEquipUI(null,rsp.BodyType,GD.role.data.RoleType) //装备栏的预览role
                    if(old.TzLv>0)shouldResetTzPros=true
                    //旧的放入背包
                    GD.role.BagEquips.push(old);
                }
            }
            let newEquip = GD.role.tryDeleteBagEquip(rsp.DressUid)
            if(newEquip){
                if(newEquip.TzLv>0)shouldResetTzPros=true
                //穿到身上
                GD.role.BodyEquips[rsp.BodyType]=newEquip
                GD.player.updateEquipUI(newEquip.Id,rsp.BodyType,GD.role.data.RoleType)
                this.role.updateEquipUI(newEquip.Id,rsp.BodyType,GD.role.data.RoleType,newEquip.QhLv)
            }
            if(this.itemTypeTab.selectedIndex>0){
                this.itemTypeTab.select(this.itemTypeTab.selectedIndex)
            }else{
                this.list.refresh();
            }
            if(shouldResetTzPros)GD.role.resetTzPros();
            // this.role.updateAllEquipUI(GD.role.BodyEquips,GD.role.data.RoleType,false);
            //更新装备栏显示
            UIMgr.I.resetRoleBasePros(rsp.BasePros)
            this.refreshBodySlot(rsp.BodyType)
            UIMgr.I.showProsMsg('穿戴成功',ct.green)
            GameManager.I.playTipSound('getItem');
        }else{
            UIMgr.I.tip('穿戴失败')
        }
    }
    refreshBodySlot(bodyType:BodyType){
        this._refreshBodySlot(bodyType)
        this.refreshQhAddBuff()
    }
    private _refreshBodySlot(bodyType:BodyType){
        let equip = GD.role.BodyEquips[bodyType]
        let can=true
        if(equip){
            can = !!Tools.checkCanDress(equip)
        }
        Tools._refreshBodySlotNode(this.bodyBox.children[bodyType],equip,true,can)
    }
    onRecoverEquips=(d:any)=>{
        let rsp = outer_pb.RecoverEquips.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            rsp.UidList.forEach(uid=>{
                GD.role.tryDeleteBagEquip(uid)
            })
            this.itemTypeTab.select(this.itemTypeTab.selectedIndex)
            for(let i in rsp.Items){
                const id = parseInt(i)
                GD.role.getItem(id,rsp.Items[i],true,true,'回收装备')
            }
            this.setSelectedNull();
            this.refreshCapLabel()
        }else{
            UIMgr.I.tip('回收失败，背包数据不同步，请托管一下更新背包')
        }
    }
    
    setSelectedNull(){
        this.list.selectedIndex=-1;
        this.selectedIndex=-1;
        this.selectedNode=null;
        this.selectedBodyNode=null;
        this.selectedItem=null;
        this.selectedIndexList=[];
    }
}