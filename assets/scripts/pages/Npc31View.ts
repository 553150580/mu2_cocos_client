import { _decorator, Component, Label, Node, RichText, Toggle } from 'cc';
import { Tab } from '../UiComps/Tab';
import GD from '../base/GameData';
import { BodyType, ct, EquipType, FuMoTypeStr, PointTypeString, WingBase, WingZyPros, YsTypeString, ZyTypeString } from '../base/types';
import { UIMgr } from '../managers/UIMgr';
import { ShowItemType } from './PopView';
import Tools from '../base/tools';
import { FuMoInfo0, FuMoInfo1, FuMoInfo2 } from '../base/consts';
import WS from '../base/net';
import { ConfigType, Err, MT } from '../base/MT';
import { ViewStack } from '../UiComps/ViewStack';
const { ccclass, property } = _decorator;

@ccclass('Npc31View')
export class Npc31View extends Component {
    @property(Tab)
    tab:Tab;
    @property(ViewStack)
    view:ViewStack;
    @property(Label)
    head:Label;
    @property(Node)
    equipCell:Node;
    @property(Node)
    prosBox:Node;
    @property(Node)
    actBtn:Node;
    @property(Label)
    info:Label;
    @property(Label)
    need:Label;
    @property(Label)
    bdNum:Label;

    @property(Label)
    resetHead:Label;
    @property(Label)
    resetInfo:Label;
    @property(Node)
    resetCell:Node;
    @property(Node)
    doResetBtn:Node;
    @property(RichText)
    resetRich:RichText;
    @property(RichText)
    resetNeed:RichText

    // @property(Node)
    // resetZyCell:Node;
    // @property(Node)
    // doResetZyBtn:Node;
    // @property(RichText)
    // resetZyRich:RichText;
    // @property(RichText)
    // resetZyNeed:RichText;


    selectedCell:Node;
    selectedIndex:number=0;
    tabStrs:Array<string> //['附魔','附魔升级','附魔重置','勋章重置','卓越重置','增加卓越']
    resetXzInfo='重置后将随机重置属性点类型、元素类型，成功率100%'
    resetZyInfo='重置后随机更改卓越属性类型（也可能不变），重置不增加属性个数\n具有卓越属性的装备均可重置（武器、防具、首饰、翅膀、宠物）'
    addZyInfo='为卓越防具、戒指添加一条随机卓越属性\n属性类型不会重复，最多可添加至6条（成功率100%）'
    needDias:Array<number>;
    lockNum:number=0
    static I:Npc31View;
    protected onLoad(): void {
        Npc31View.I=this;
        this.tabStrs=this.tab.labels.split(',')
        this.tab.selectedHandler=(node:Node,index:number)=>{
            const headStr=`【${this.tabStrs[index]}】`
            if(index<3){
                this.resetNull()
                this.view.selectedIndex=0
                this.head.string = headStr
                this.refreshView()
            }else{
                let resetBtnStr='重置'
                let info=''
                let headColor=ct.blue
                if(index==3){
                    headColor=ct.brown
                    info=this.resetXzInfo
                }else{
                    headColor=ct.green
                    this.refreshResetView()
                    if(index==4){
                        info=this.resetZyInfo
                    }else{
                        info=this.addZyInfo
                        resetBtnStr='增加'
                    }
                }
                this.view.selectedIndex=1
                this.resetHead.string=headStr
                this.resetHead.color.fromHEX(headColor)
                this.equip=null;
                this.resetInfo.string=info
                this.doResetBtn.children[0].getComponent(Label).string=resetBtnStr
                this.refreshResetView()
            }
            GD.playClickSound();
        }
        this.equipCell.on(Node.EventType.TOUCH_END,()=>{
            if(this.equip){
                UIMgr.I.PopView.show(0,this.equip,false,ShowItemType.Equip,'取消',(d:outer_pb.IEquip)=>{
                    this.equip=null
                    this.bodyType=BodyType.None
                    this.refreshView()
                    GD.playGetItemSound()
                })
            }else{
                UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler,this.bagEquipFilter)
            }
        },this);
        this.prosBox.children.forEach((node:Node,index:number)=>{
            node.on(Node.EventType.TOUCH_END,()=>{
                if(this.tab.selectedIndex==1){
                    if(this.selectedCell)this.selectedCell.children[0].active=false;
                    this.selectedCell=node;
                    node.children[0].active=true;
                    this.selectedIndex=index;
                    this.refreshView();
                    GD.playClickSound();
                }
            })
            let toggleNode = node.children[2];
            toggleNode.on('toggle',(toggle:Toggle)=>{
                if(toggle.isChecked){
                    this.lockNum++
                    if(this.lockNum>3){
                        toggle.isChecked=false
                        UIMgr.I.tip('最多只能同时锁定3条')
                    }
                }else{
                    this.lockNum--
                }
                this.refreshView();
            })
        })
        this.actBtn.on(Node.EventType.TOUCH_END,this.tryDo)
        this.resetCell.on(Node.EventType.TOUCH_END,()=>{
            if(this.equip){
                UIMgr.I.PopView.show(0,this.equip,false,ShowItemType.Equip,'取消',(d:outer_pb.IEquip)=>{
                    this.equip=null
                    this.bodyType=BodyType.None
                    this.refreshResetView()
                    GD.playGetItemSound()
                })
            }else{
                UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler1,this.bagEquipFilter1)
            }
        },this);
        this.doResetBtn.on(Node.EventType.TOUCH_END,this.doReset)

        // this.resetZyCell.on(Node.EventType.TOUCH_END,()=>{
        //     if(this.equip){
        //         UIMgr.I.PopView.show(0,this.equip,false,ShowItemType.Equip,'取消',(d:outer_pb.IEquip)=>{
        //             this.equip=null
        //             this.bodyType=BodyType.None
        //             this.refreshResetZyView()
        //             GD.playGetItemSound()
        //         })
        //     }else{
        //         UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler1_Zy,this.bagEquipFilter1_Zy)
        //     }
        // },this);
        // this.doResetZyBtn.on(Node.EventType.TOUCH_END,this.doResetZy)
    }
    doReset=()=>{
        const type=this.tab.selectedIndex
        if(type==3){
            this.doResetXz()
        }else if(type==4){
            this.doResetZy()
        }else if(type==5){
            this.doAddZy()
        }
    }
    resetNull(){
        if(this.selectedCell)this.selectedCell.children[0].active=false;
        this.selectedCell=null;
        this.selectedIndex=0;
        this.lockNum=0;
        if(this.tab.selectedIndex==2){
            this.prosBox.children.forEach((node:Node,index:number)=>{
                node.children[2].getComponent(Toggle).isChecked=false;
            })
        }
    }
    bagEquipSelectedHandler = (node:Node,index:number,self:any)=>{
        self.hide()
        let data:outer_pb.IEquip =self.bagList.array[index]
        UIMgr.I.PopView.show(0,data,false,ShowItemType.Equip,'选择',(d:outer_pb.IEquip)=>{
            this.equip=d
            this.bodyType=BodyType.None
            this.refreshView()
            GD.playGetItemSound()
        },()=>{
            UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler,this.bagEquipFilter)
        })
    }
    bagEquipFilter = (equip:outer_pb.IEquip)=>{
        return equip.Id/10000>>0 < EquipType.Pet && equip.QhLv>=9 && equip.ZjLv>=4;
    }
    selectedFuMoEquip(equip:outer_pb.IEquip,bodyType:BodyType){
        this.tab.select(0)
        this.bodyType=bodyType
        this.equip=equip
        this.refreshView()
    }
    resetXzNeedDia:number=0
    protected onEnable(): void {
        this.needDias=[
            GD.configs.get(ConfigType.ResetFuMoNeedDia0),
            GD.configs.get(ConfigType.ResetFuMoNeedDia1),
            GD.configs.get(ConfigType.ResetFuMoNeedDia2),
            GD.configs.get(ConfigType.ResetFuMoNeedDia3)
        ]
        this.resetXzNeedDia = GD.configs.get(ConfigType.ResetXunZhangNeedDia)
        this.tab.select(0)
    }
    equip:outer_pb.IEquip;
    bodyType:BodyType=BodyType.None;
    refreshView(){
        let equip=this.equip
        let name='点击选择装备'
        let color=ct.gray
        const actType=this.tab.selectedIndex
        if(equip){
            let numStr=''
            if(actType==1&&this.selectedCell&&equip.Data[this.selectedIndex+1]){
                numStr=`(第${equip.Data[this.selectedIndex+1]}次)`
            }
            this.bdNum.string=numStr
            name = GD.EquipBaseDatas.get(equip.Id).Name
            if(equip.ZyList.length>0){
                color=ct.green
                name = '卓越的 '+name
            }else if(equip.ZjLv>0||equip.LuckyLv>0||equip.YsList.length>0){
                if(equip.QhLv>=7){
                    color=ct.yellow
                }else{
                    color=ct.blue
                }
            }
            if(equip.TzLv>0)color=ct.red
            let len=equip.YsList.length;
            this.lockNum=0
            this.prosBox.children.forEach((node:Node,index:number)=>{
                if(index<len){
                    node.active=true
                    let toggleNode=node.children[2];
                    toggleNode.active = actType==2;//锁定toggle
                    let richColor=ct.blue
                    if(actType==2&&toggleNode.getComponent(Toggle).isChecked){
                        this.lockNum ++
                        richColor=ct.gray
                    }
                    
                    //10100，百位+千位表示级别a/100-100，个位+十位表示属性类型a%100（0~26）
                    const value=equip.YsList[index];
                    const lv=(value/100-100)>>0
                    const type=value%100
                    if(type>=26){
                        richColor=ct.purple
                    }
                    let nextV = ''
                    let sign=''
                    if(type>=21){
                        sign='%'
                    }
                    let curV= Tools.getFuMoProValue(type,lv)
                    if(actType==1){
                        //下一级属性值
                        if(lv>=10){
                            nextV=' (已满10级)'
                        }else{
                            nextV = ` (<color=${ct.green}>+${((Tools.getFuMoProValue(type,lv+1)-curV)*100>>0)/100}</>)${sign}`
                        }
                    }
                    node.children[1].getComponent(RichText).string=`<color=${richColor}>Lv.${lv} ${FuMoTypeStr[type]}+${Tools.getFuMoProValue(type,lv)}${sign}${nextV}</>`
                }else{
                    node.active=false
                }
            })
        }else{
            this.prosBox.children.forEach((node:Node,index:number)=>{
                node.children[1].getComponent(RichText).string=''
                node.children[2].active=false;
            })
        }
        let label1=this.equipCell.children[0].getComponent(Label)
        label1.string=name
        label1.color.fromHEX(color)
        this.actBtn.children[0].getComponent(Label).string=this.tabStrs[actType]
        let needStr=''
        let needColor=ct.yellow
        let info:string=''
        if(actType==0||actType==1){
            needStr='(需要：附魔宝石x1)'
            if(actType==0){
                info=FuMoInfo0
            }else{
                info=FuMoInfo1
            }
        }else if(actType==2){
            needStr=`需要：钻石x${this.needDias[this.lockNum]}`;
            needColor=ct.qing;
            info=FuMoInfo2
        }
        this.need.string=needStr
        this.need.color.fromHEX(needColor)
        this.info.string=info;
    }
    tryDo=()=>{
        let equip=this.equip
        if(equip){
            const actType=this.tab.selectedIndex
            let dzType=10
            if(actType==0){
                if(equip.YsList.length>=4){
                    UIMgr.I.tip('已满属性')
                    return
                }
                dzType=8
            }else{
                if(equip.YsList.length==0){
                    UIMgr.I.tip('请先添加附魔属性')
                    return
                }
                if(actType==1){
                    if(this.selectedCell==null){
                        UIMgr.I.tip('请选择要升级的属性')
                        return
                    }
                    let value=equip.YsList[this.selectedIndex]
                    if((value/100-100)>>0 >=10){
                        UIMgr.I.tip('该属性已满级')
                        return
                    }
                    dzType=9
                }else if(actType==2&&GD.role.hasEnoughDia(this.needDias[this.lockNum])==false){
                    return
                }
            }
            let lockIndex:Array<number>=[]
            this.prosBox.children.forEach((node:Node,index:number)=>{
                if(node.children[2].getComponent(Toggle).isChecked) lockIndex.push(index)
            })
            let req=outer_pb.DzAct.create()
            req.Uid=equip.Uid
            req.DzType=dzType;
            req.LockIndexs=lockIndex
            req.Index=this.selectedIndex
            req.BodyType=this.bodyType;
            // console.log('tryDo',req)
            let buf=outer_pb.DzAct.encode(req).finish()
            WS.send(MT.DzAct,buf,(d:any)=>{
                let rsp=outer_pb.DzAct.decode(d)
                // console.log('onDo',rsp)
                if(rsp.ErrCode==Err.ErrCode_NotEnoughItem||rsp.ErrCode==Err.ErrCode_EquipNotFound){
                    UIMgr.I.tip('所需道具不足')
                }else{
                    if(rsp.Equip){
                        equip.YsList=rsp.Equip.YsList
                        this.refreshView();
                    }
                    if(rsp.Items){
                        rsp.Items.forEach(item=>{
                            GD.role.reduceItem(item.Id,item.Num)
                        })
                    }
                    if(rsp.BasePros){
                        UIMgr.I.resetRoleBasePros(rsp.BasePros)
                    }
                    if(rsp.ErrCode==Err.ErrCode_Failed){
                        if(actType==0){
                            UIMgr.I.tip('附魔失败')
                        }else if(actType==1){
                            UIMgr.I.tip('升级失败')
                        }else{
                            UIMgr.I.tip('无法操作')
                        }
                    }else if(rsp.ErrCode==Err.ErrCode_Success){
                        let str='重置'
                        if(actType==0){
                            str='附魔'
                        }else if(actType==1){
                            str='升级'
                        }
                        UIMgr.I.tip(`${str}成功`,ct.green)
                    }
                }
            })
        }else{
            UIMgr.I.tip('未选择装备')
        }
    }
    //=============
    // equip:outer_pb.IEquip;
    needZyCzFuNum:number=5;
    addZyNeedItems:Array<Array<number>>
    refreshResetView(){
        let name1='点击选择装备'
        let color1=ct.gray
        let info=''
        let needStr=''
        if(this.equip){
            const base=GD.EquipBaseDatas.get(this.equip.Id)
            const name=base.Name
            const type=this.tab.selectedIndex
            name1=name
            if(type==3){
                let lv = this.equip.Lv
                name1 = `${name} Lv.${lv}`
                color1 = ct.purple
                info+=`<color=${ct.blue}>${PointTypeString[this.equip.YsList[0]]}+${5+lv*5}</><br/>`
                info+=`<color=${ct.purple}>${YsTypeString[this.equip.YsList[1]]}元素+${1+lv}</><br/><br/>`
                needStr=`需要：<color=${ct.qing}>钻石x${this.resetXzNeedDia}</>`
            }else if(type==4){
                this.needZyCzFuNum=5
                const equipType=this.equip.Id/10000>>0
                if(equipType==EquipType.Pet){
                    color1 = ct.purple
                    let cb:(type:number,lv:number)=>string;
                    if(this.equip.Id==210001){
                        cb=Tools.getYingHuaZyStr
                    }else{
                        cb=Tools.getNanGuaZyStr
                    }
                    let lv = this.equip.Lv
                    this.equip.ZyList.forEach(type=>{
                        info += `${cb(type,lv)}<br/>`
                    })
                    this.needZyCzFuNum=10
                }else {
                    color1 = ct.green
                    if(equipType==EquipType.Wing){
                        this.equip.ZyList.forEach(t=>{
                            let num = ''
                            if(t<2){
                                //+生命值、魔法值
                                num=` +${this.equip.QhLv*5+base.EquipLv*50}`
                            }else if(t==2){
                                //+攻击速度
                                num=` +${5+base.EquipLv*2}`
                            }
                            info+=`${WingZyPros[t]}${num}<br/>`
                        })
                        this.needZyCzFuNum=10
                    }else{
                        this.equip.ZyList.forEach(t=>{
                            info+=ZyTypeString[t]+'<br/>'
                        })
                        this.needZyCzFuNum=5
                    }
                }
                if(this.equip.ZyList.length>1) this.needZyCzFuNum *=2;
                needStr=`需要：<color=${ct.blue}>卓越属性重置符x${this.needZyCzFuNum}</>`
            }else if(type==5){
                this.equip.ZyList.forEach(t=>{
                    info+=ZyTypeString[t]+'<br/>'
                })
                color1 = ct.green
                const zyNum=this.equip.ZyList.length
                this.addZyNeedItems=[[79,zyNum],[14,1000000000*zyNum],[600,100*zyNum],[407,100*zyNum]]
                needStr='增加操作需要以下道具：<br/>'
                this.addZyNeedItems.forEach(v=>{
                    const id=v[0]
                    const num=v[1]
                    const item = GD.ItemBaseDatas.get(id)
                    needStr += `<color=${Tools.getItemColor(id)}>${item.Name}x${num.toLocaleString()}</><br/>`
                })
            }
            this.doResetBtn.active=true
        }else{
            this.doResetBtn.active=false
        }
        let label1=this.resetCell.children[0].getComponent(Label)
        label1.string=name1
        label1.color.fromHEX(color1)
        this.resetRich.string=info
        this.resetNeed.string=needStr
    }
    bagEquipSelectedHandler1 = (node:Node,index:number,self:any)=>{
        self.hide()
        let data:outer_pb.IEquip =self.bagList.array[index]
        UIMgr.I.PopView.show(0,data,false,ShowItemType.Equip,'选择',(d:outer_pb.IEquip)=>{
            this.equip=d
            this.bodyType=BodyType.None
            this.refreshResetView()
            GD.playGetItemSound()
        },()=>{
            UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler1,this.bagEquipFilter1)
        })
    }
    bagEquipFilter1 = (equip:outer_pb.IEquip)=>{
        const type=this.tab.selectedIndex
        const et=equip.Id/10000>>0
        if(type==3){
            return et == EquipType.XunZhang
        }else {
            const zyNum=equip.ZyList.length
            if(type==4){
                return zyNum>0&&zyNum<6 && et <= EquipType.Pet
            }else if(type==5){
                return zyNum>0&&zyNum<6 && (et <= EquipType.Ring||et==EquipType.Shield)
            }
        }
    }
    doResetXz=()=>{
        if(this.equip){
            if(GD.role.hasEnoughDia(200)){
                let req=outer_pb.PetAct.create()
                req.Uid1=this.equip.Uid
                req.BodyType=this.bodyType
                let buf=outer_pb.PetAct.encode(req).finish()
                WS.send(MT.ResetXz,buf,this.onResetXz)
            }
        }else{
            UIMgr.I.tip('未选择勋章')
        }
    }
    onResetXz=(d:any)=>{
        let rsp=outer_pb.PetAct.decode(d)
        if(rsp.ErrCode==Err.ErrCode_Success){
            this.equip.YsList=rsp.Pet.YsList
            GD.role.reduceItem(rsp.Id,rsp.Num)
            this.refreshResetView()
            if(rsp.BasePros){
                UIMgr.I.resetRoleBasePros(rsp.BasePros)
            }
            UIMgr.I.tip('重置成功',ct.green)
        }else{
            UIMgr.I.tip('所需道具不足')
        }
    }
    //3勋章重置、4卓越重置、5增加卓越
    selectedResetEquip=(resetType:number,equip:outer_pb.IEquip,bodyType:BodyType)=>{
        this.tab.select(resetType)
        this.bodyType=bodyType
        this.equip=equip
        this.refreshResetView()
    }
    doResetZy=()=>{
        if(this.equip){
            if(GD.role.hasEnoughItem(69,this.needZyCzFuNum)){
                let req=outer_pb.PetAct.create()
                req.Uid1=this.equip.Uid
                req.BodyType=this.bodyType
                let buf=outer_pb.PetAct.encode(req).finish()
                WS.send(MT.ResetEquipZy,buf,this.onResetZy)
            }
        }else{
            UIMgr.I.tip('未选择装备')
        }
    }
    onResetZy=(d:any)=>{
        let rsp=outer_pb.PetAct.decode(d)
        if(rsp.ErrCode==Err.ErrCode_Success){
            this.equip.ZyList=rsp.Pet.ZyList
            GD.role.reduceItem(rsp.Id,rsp.Num)
            this.refreshResetView()
            if(rsp.BasePros){
                UIMgr.I.resetRoleBasePros(rsp.BasePros)
            }
            UIMgr.I.tip('重置成功',ct.green)
        }else{
            UIMgr.I.tip('所需道具不足')
        }
    }
    doAddZy=()=>{
        if(this.equip){
            if(this.equip.ZyList.length>=6){
                UIMgr.I.tip('已经满属性了')
                return
            }
            for(let i=0;i<this.addZyNeedItems.length;i++){
                const v=this.addZyNeedItems[i]
                const id=v[0]
                const num=v[1]
                if(GD.role.hasEnoughItem(id,num)==false){
                    return
                }
            }
            let req=outer_pb.PetAct.create()
            req.Uid1=this.equip.Uid
            req.BodyType=this.bodyType
            let buf=outer_pb.PetAct.encode(req).finish()
            WS.send(MT.AddEquipZy,buf,this.onAddZy)
        }else{
            UIMgr.I.tip('未选择装备')
        }
    }
    onAddZy=(d:any)=>{
        let rsp=outer_pb.PetAct.decode(d)
        if(rsp.ErrCode==Err.ErrCode_Success){
            this.equip.ZyList=rsp.Pet.ZyList
            if(rsp.Items){
                for(let i in rsp.Items){
                    let id = parseInt(i)
                    let num = rsp.Items[i]
                    GD.role.reduceItem(id,num)
                }
            }
            this.refreshResetView()
            if(rsp.BasePros){
                UIMgr.I.resetRoleBasePros(rsp.BasePros)
            }
            UIMgr.I.tip('增加成功',ct.green)
        }else{
            UIMgr.I.tip('所需道具不足')
        }
    }
    //============
    protected onDisable(): void {
        this.equip=null;
        this.equip=null;
    }
    //==============================
    // refreshResetZyView(){
    //     let name1='点击选择装备'
    //     let color1=ct.gray
    //     let info=''
    //     this.needZyCzFuNum=5
    //     if(this.equip){
    //         let base:WingBase = GD.EquipBaseDatas.get(this.equip.Id)
    //         name1=base.Name
    //         const equipType=this.equip.Id/10000>>0
    //         if(equipType==EquipType.Pet){
    //             color1 = ct.purple
    //             let cb:(type:number,lv:number)=>string;
    //             if(this.equip.Id==210001){
    //                 cb=Tools.getYingHuaZyStr
    //             }else{
    //                 cb=Tools.getNanGuaZyStr
    //             }
    //             let lv = this.equip.Lv
    //             this.equip.ZyList.forEach(type=>{
    //                 info += `${cb(type,lv)}<br/>`
    //             })
    //             this.needZyCzFuNum=10
    //         }else {
    //             if(equipType==EquipType.Wing){
    //                 color1 = ct.blue
    //                 this.equip.ZyList.forEach(t=>{
    //                     let num = ''
    //                     if(t<2){
    //                         //+生命值、魔法值
    //                         num=` +${this.equip.QhLv*5+base.EquipLv*50}`
    //                     }else if(t==2){
    //                         //+攻击速度
    //                         num=` +${5+base.EquipLv*2}`
    //                     }
    //                     info+=`${WingZyPros[t]}${num}<br/>`
    //                 })
    //                 this.needZyCzFuNum=10
    //             }else{
    //                 color1=ct.green
    //                 this.equip.ZyList.forEach(t=>{
    //                     info+=ZyTypeString[t]+'<br/>'
    //                 })
    //                 this.needZyCzFuNum=5
    //             }
    //         }
    //         if(this.equip.ZyList.length>1) this.needZyCzFuNum *=2;
    //         this.doResetZyBtn.active=true
    //     }else{
    //         this.doResetZyBtn.active=false
    //     }
    //     let label1=this.resetZyCell.children[0].getComponent(Label)
    //     label1.string=name1
    //     label1.color.fromHEX(color1)
    //     this.resetZyRich.string=info
    //     this.resetZyNeed.string=`需要：卓越属性重置符x${this.needZyCzFuNum}`
    // }
    
    // refreshAddZyView(){
    //     let name1='点击选择装备'
    //     let color1=ct.gray
    //     let info=''
    //     this.addZyNeedItems=[]
    //     if(this.equip&&this.equip.ZyList.length>0){
    //         let base:WingBase = GD.EquipBaseDatas.get(this.equip.Id)
    //         name1=base.Name
    //         this.equip.ZyList.forEach(t=>{
    //             info+=ZyTypeString[t]+'<br/>'
    //         })
    //         color1 = ct.green
    //         const zyNum=this.equip.ZyList.length
    //         this.addZyNeedItems.push([79,zyNum],[14,1000000000*zyNum],[600,100*zyNum],[407,100*zyNum])
    //         this.doResetZyBtn.active=true
    //     }else{
    //         this.doResetZyBtn.active=false
    //     }
    //     let label1=this.resetZyCell.children[0].getComponent(Label)
    //     label1.string=name1
    //     label1.color.fromHEX(color1)
    //     this.resetZyRich.string=info
    //     this.resetZyNeed.string=`需要：卓越属性重置符x${this.needZyCzFuNum}`
    // }
}


