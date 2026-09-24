import { _decorator, Component, Label, Node,  RichText, Toggle } from 'cc';
import { ViewStack } from '../UiComps/ViewStack';
import { Tab } from '../UiComps/Tab';
import { GrowthProNames, yhDhInfoStr } from '../base/consts';
import GD from '../base/GameData';
import { BodyType, ct,  EquipType,  YsTypeString } from '../base/types';
import { UIMgr } from '../managers/UIMgr';
import { ShowItemType } from './PopView';
import WS from '../base/net';
import { ConfigType, Err, MT } from '../base/MT';
import Tools from '../base/tools';
const { ccclass, property } = _decorator;

//樱花精灵
@ccclass('Npc14View')
export class Npc14View extends Component {
    @property(ViewStack)
    view:ViewStack;
    @property(Tab)
    tab:Tab;
    @property(RichText)
    dhRich:RichText;
    @property(Node)
    whiteBtn:Node;
    @property(Node)
    redBtn:Node;
    @property(Node)
    yellowBtn:Node;
    @property(Node)
    ngBtn:Node;
    @property(Node)
    hcPet1Btn:Node;
    @property(Node)
    hcPet2Btn:Node;
    @property(Node)
    hcBtn:Node;
    @property(Node)
    rhPet1Btn:Node;
    @property(Node)
    rhPet2Btn:Node;
    @property(Node)
    rhBtn:Node;
    @property(Node)
    xlPetBtn:Node;
    @property(Node)
    growProsBox:Node;
    @property(Node)
    xlActBox:Node;
    @property(Node)
    xlBtn:Node;
    @property(Toggle)
    expOnly:Toggle;

    @property(Node)
    resetPetBtn:Node;
    @property(RichText)
    resetRich:RichText
    @property(Node)
    doResetBtn:Node;
    @property(Label)
    resetPetNeed:Label

    // @property(Node)
    // resetXzBtn:Node;
    // @property(RichText)
    // resetXzRich:RichText
    // @property(Node)
    // doResetXzBtn:Node;
    
    static I:Npc14View
    protected onLoad(): void {
        Npc14View.I=this;
        this.dhRich.string=yhDhInfoStr
        this.tab.selectedHandler=(node:Node,index:number)=>{
            this.view.selectedIndex=index;
            this.resetNull();
            if(index==1){
                this.refreshHcView()
            }else if(index==2){
                this.refreshRhView()
            }else if(index==3){
                this.refreshXlView()
            }else if(index==4){
                this.refreshResetView()
            }
            GD.playClickSound();
        }
        this.expOnly.node.on('toggle',(toggle:Toggle)=>{
            this.refreshHcView()
        })
        this.whiteBtn.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.hasEnoughItem(30,10)){
                Tools.sendUseItemAct(30,10,false)
                GD.playClickSound();
            }
        },this);
        this.redBtn.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.hasEnoughItem(31,30)){
                Tools.sendUseItemAct(31,30,false)
                GD.playClickSound();
            }
        },this);
        this.yellowBtn.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.hasEnoughItem(32,50)){
                Tools.sendUseItemAct(32,50,false)
                GD.playClickSound();
            }
        },this);
        this.ngBtn.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.hasEnoughItem(39,100)){
                Tools.sendUseItemAct(39,100,false)
                GD.playClickSound();
            }
        },this);
        this.hcPet1Btn.on(Node.EventType.TOUCH_END,()=>{
            if(this.pet1){
                UIMgr.I.PopView.show(0,this.pet1,false,ShowItemType.Equip,'取消',(d:outer_pb.IEquip)=>{
                    this.pet1=null
                    this.bodyType=BodyType.None
                    this.refreshHcView()
                    GD.playGetItemSound()
                })
            }else{
                UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler1_hc,this.bagEquipFilter1_hc)
            }
        },this);
        this.hcPet2Btn.on(Node.EventType.TOUCH_END,()=>{
            if(this.pet2){
                UIMgr.I.PopView.show(0,this.pet2,false,ShowItemType.Equip,'取消',(d:outer_pb.IEquip)=>{
                    this.pet2=null
                    this.refreshHcView()
                    GD.playGetItemSound()
                })
            }else{
                UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler2_hc,this.bagEquipFilter2_hc)
            }
        },this);
        this.hcBtn.on(Node.EventType.TOUCH_END,this.doHcPet,this);
        this.rhPet1Btn.on(Node.EventType.TOUCH_END,()=>{
            if(this.pet1){
                UIMgr.I.PopView.show(0,this.pet1,false,ShowItemType.Equip,'取消',(d:outer_pb.IEquip)=>{
                    this.pet1=null
                    this.bodyType=BodyType.None
                    this.refreshRhView()
                    GD.playGetItemSound()
                })
            }else{
                UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler1_Rh,this.bagEquipFilter1_Rh)
            }
        },this);
        this.rhPet2Btn.on(Node.EventType.TOUCH_END,()=>{
            if(this.pet2){
                UIMgr.I.PopView.show(0,this.pet2,false,ShowItemType.Equip,'取消',(d:outer_pb.IEquip)=>{
                    this.pet2=null
                    this.refreshRhView()
                    GD.playGetItemSound()
                })
            }else{
                UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler2_Rh,this.bagEquipFilter2_Rh)
            }
        },this);
        this.rhBtn.on(Node.EventType.TOUCH_END,this.doRhPet,this);
        this.xlPetBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.pet1){
                UIMgr.I.PopView.show(0,this.pet1,false,ShowItemType.Equip,'取消',(d:outer_pb.IEquip)=>{
                    this.pet1=null
                    this.bodyType=BodyType.None
                    this.refreshXlView()
                    GD.playGetItemSound()
                })
            }else{
                UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler1_Xl,this.bagEquipFilter1_xl)
            }
        },this);
        this.growProsBox.children.forEach((node:Node,index:number)=>{
            node.on(Node.EventType.TOUCH_END,()=>{
                if(this.selectedXlCell)this.selectedXlCell.children[0].active=false;
                this.selectedXlCell=node;
                node.children[0].active=true;
                this.selectedXlIndex=index;
                this.xlActBox.active=true;
                this.refreshXlView()
                GD.playClickSound();
            })
        })
        // this.goldXlBtn.on(Node.EventType.TOUCH_END,()=>{
        //     if(GD.role.hasEnoughGold(1000000)) this.doXlPet(0)
        // })
        // this.diaXlBtn.on(Node.EventType.TOUCH_END,()=>{
        //     if(GD.role.hasEnoughDia(100)) this.doXlPet(1)
        // })
        this.xlBtn.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.hasEnoughItem(40,1)) this.doXlPet()
        })
        this.resetPetBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.pet1){
                UIMgr.I.PopView.show(0,this.pet1,false,ShowItemType.Equip,'取消',(d:outer_pb.IEquip)=>{
                    this.pet1=null
                    this.bodyType=BodyType.None
                    this.refreshResetView()
                    GD.playGetItemSound()
                })
            }else{
                UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler1_Reset,this.bagEquipFilter1_xl)
            }
        },this);
        this.doResetBtn.on(Node.EventType.TOUCH_END,this.doResetPet)
    }
    //============
    selectedXlCell:Node;
    selectedXlIndex:number=0;
    
    refreshXlView(){
        let name1='点击选择宠物'
        let color1=ct.gray
        if(this.pet1){
            let lv = this.pet1.Lv
            name1 = `${GD.EquipBaseDatas.get(this.pet1.Id).Name} Lv.${lv}`
            color1 = ct.purple
            this.growProsBox.active=true
            this.growProsBox.children.forEach((node:Node,index:number)=>{
                let value = this.pet1.Grow[index]
                let color:ct
                if(value<500){
                    color = ct.gray
                }else if(value<2000){
                    color = ct.white
                }else if(value<4000){
                    color = ct.blue
                }else if(value<6000){
                    color = ct.green
                }else if(value<8000){
                    color = ct.brown
                }else if(value<9000){
                    color = ct.purple
                }else{
                    color = ct.red
                }
                node.children[1].getComponent(RichText).string=`${GrowthProNames[index]}：<color=${color}>${value}</>`
            })
            // if(this.selectedXlCell){
            //     let index = this.selectedXlIndex
            //     let values = this.pet1.Growth[index].Values
            //     this.goldRang.string=`范围：${500+values[1]}至${7000+values[1]}`;
            //     this.diaRang.string=`范围：${2000+values[2]}至${7000+values[2]}`;
            //     this.lhRang.string=`范围：${4000+values[3]}至${7000+values[3]}`;
            //     this.goldNeed.string=`需要：金币x${this.goldNeedNum/10000}万`
            //     this.diaNeed.string=`需要：钻石x${this.diaNeedNum}`
            // }
        }else{
            this.xlActBox.active=this.growProsBox.active=false
        }
        let label1=this.xlPetBtn.children[0].getComponent(Label)
        label1.string=name1
        label1.color.fromHEX(color1)
    }
    bagEquipSelectedHandler1_Xl = (node:Node,index:number,self:any)=>{
        self.hide()
        let data:outer_pb.IEquip =self.bagList.array[index]
        UIMgr.I.PopView.show(0,data,false,ShowItemType.Equip,'选择',(d:outer_pb.IEquip)=>{
            this.pet1=d
            this.bodyType=BodyType.None
            this.xlActBox.active=false
            this.refreshXlView()
            this.unSelectXlCell()
            GD.playGetItemSound()
        },()=>{
            UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler1_Xl,this.bagEquipFilter1_xl)
        })
    }
    bagEquipFilter1_xl = (equip:outer_pb.IEquip)=>{
        return equip.Id/10000>>0 == EquipType.Pet
    }
    doXlPet(){
        if(this.pet1){
            if(this.selectedXlCell){
                let req=outer_pb.PetAct.create()
                req.Uid1=this.pet1.Uid
                req.Index=this.selectedXlIndex
                req.BodyType=this.bodyType
                let buf=outer_pb.PetAct.encode(req).finish()
                WS.send(MT.XlPet,buf,this.onXlPet)
            }else{
                UIMgr.I.tip('请选择一个要洗炼的属性')
            }
        }else{
            UIMgr.I.tip('未选择宠物')
        }
    }
    onXlPet=(d:any)=>{
        let rsp=outer_pb.PetAct.decode(d)
        if(rsp.ErrCode==Err.ErrCode_Success){
            this.pet1.Grow=rsp.Pet.Grow
            GD.role.reduceItem(rsp.Id,rsp.Num)
            this.refreshXlView()
            if(rsp.BasePros){
                UIMgr.I.resetRoleBasePros(rsp.BasePros)
            }
            UIMgr.I.tip(`洗炼成功：成长值+${rsp.Value}`,ct.green)
        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughItem){
            UIMgr.I.tip('所需道具不足')
        }else{
            UIMgr.I.tip('洗炼失败1')
        }
    }
    selectedXlPet(pet:outer_pb.IEquip,bodyType:BodyType){
        this.tab.select(3)
        this.bodyType=bodyType
        this.pet1=pet
        this.refreshXlView()
    }
    //=============
    refreshResetView(){
        let name1='点击选择宠物'
        let color1=ct.gray
        let info=''
        if(this.pet1){
            let lv = this.pet1.Lv
            name1 = `${GD.EquipBaseDatas.get(this.pet1.Id).Name} Lv.${lv}`
            color1 = ct.purple
            info=`<color=${ct.purple}>主元素属性：${YsTypeString[this.pet1.YsList[0]]}</><br/>`
            if(this.pet1.YsList.length>1){
                let ysTypes = []
                this.pet1.YsList.slice(1).forEach(type=>{
                    ysTypes.push(YsTypeString[type])
                })
                info=`${info}<color=${ct.purple0}>副元素属性：${ysTypes.join(' ')}</><br/>`
            }else{
                info = `${info}<color=${ct.purple0}>副元素属性：无</><br/>`
            }
            this.doResetBtn.active=true
        }else{
            this.doResetBtn.active=false
        }
        let label1=this.resetPetBtn.children[0].getComponent(Label)
        label1.string=name1
        label1.color.fromHEX(color1)
        this.resetRich.string=info
        this.resetPetNeed.string=`需要：钻石x${this.resetPetNeedDia}`
    }
    bagEquipSelectedHandler1_Reset = (node:Node,index:number,self:any)=>{
        self.hide()
        let data:outer_pb.IEquip =self.bagList.array[index]
        UIMgr.I.PopView.show(0,data,false,ShowItemType.Equip,'选择',(d:outer_pb.IEquip)=>{
            this.pet1=d
            this.bodyType=BodyType.None
            this.refreshResetView()
            GD.playGetItemSound()
        },()=>{
            UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler1_Reset,this.bagEquipFilter1_xl)
        })
    }
    doResetPet=()=>{
        if(this.pet1){
            if(GD.role.hasEnoughDia(this.resetPetNeedDia)){
                let req=outer_pb.PetAct.create()
                req.Uid1=this.pet1.Uid
                req.BodyType=this.bodyType
                let buf=outer_pb.PetAct.encode(req).finish()
                WS.send(MT.ResetPet,buf,this.onResetPet)
            }
        }else{
            UIMgr.I.tip('未选择宠物')
        }
    }
    onResetPet=(d:any)=>{
        let rsp=outer_pb.PetAct.decode(d)
        if(rsp.ErrCode==Err.ErrCode_Success){
            this.pet1.YsList=rsp.Pet.YsList
            GD.role.reduceItem(rsp.Id,rsp.Num)
            this.refreshResetView()
            if(rsp.BasePros){
                UIMgr.I.resetRoleBasePros(rsp.BasePros)
            }
            UIMgr.I.tip('切换主元素成功',ct.green)
        }else{
            UIMgr.I.tip('所需道具不足')
        }
    }
    selectedResetPet=(pet:outer_pb.IEquip,bodyType:BodyType)=>{
        this.tab.select(4)
        this.bodyType=bodyType
        this.pet1=pet
        this.refreshResetView()
    }
    
    //============
    bagEquipSelectedHandler1_Rh = (node:Node,index:number,self:any)=>{
        self.hide()
        let data:outer_pb.IEquip =self.bagList.array[index]
        UIMgr.I.PopView.show(0,data,false,ShowItemType.Equip,'选择',(d:outer_pb.IEquip)=>{
            this.pet1=d
            this.bodyType=BodyType.None
            this.refreshRhView()
            GD.playGetItemSound()
        },()=>{
            UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler1_Rh,this.bagEquipFilter1_Rh)
        })
    }
    bagEquipSelectedHandler2_Rh = (node:Node,index:number,self:any)=>{
        self.hide()
        let data:outer_pb.IEquip =self.bagList.array[index]
        UIMgr.I.PopView.show(0,data,false,ShowItemType.Equip,'选择',(d:outer_pb.IEquip)=>{
            this.pet2=d
            this.refreshRhView()
            GD.playGetItemSound()
        },()=>{
            UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler2_Rh,this.bagEquipFilter2_Rh)
        })
    }
    bagEquipFilter1_Rh = (equip:outer_pb.IEquip)=>{
        if(equip.Id/10000>>0 == EquipType.Pet && equip.Lv>=15){
            if(equip.ZyList.length<9)return false
            if(equip.YsList.length>=8)return false
            if(equip.Grow.some(v=>{return v<10000}))return false
            if(this.pet2){
                return equip.Uid!=this.pet2.Uid
            }else{
                return true
            }
        }
        return false
    }
    bagEquipFilter2_Rh = (equip:outer_pb.IEquip)=>{
        if(equip.IsLock)return false
        if(equip.ZyList.length<9)return false
        if(equip.YsList.length>1)return false
        if(equip.Grow.some(v=>{return v<10000}))return false
        if(equip.Id/10000>>0 == EquipType.Pet && equip.Lv==0){
            if(this.pet1){
                return equip.Uid!=this.pet1.Uid
            }else{
                return true
            }
        }
        return false
    }
    selectedRhPet(pet:outer_pb.IEquip,bodyType:BodyType){
        this.tab.select(2)
        this.bodyType=bodyType
        this.pet1=pet
        this.refreshRhView()
    }
    //=====================
    bagEquipSelectedHandler1_hc = (node:Node,index:number,self:any)=>{
        self.hide()
        let data:outer_pb.IEquip =self.bagList.array[index]
        UIMgr.I.PopView.show(0,data,false,ShowItemType.Equip,'选择',(d:outer_pb.IEquip)=>{
            this.pet1=d
            this.bodyType=BodyType.None
            if(this.pet2==null)this.autoSelectHcPet2()
            this.refreshHcView()
            GD.playGetItemSound()
        },()=>{
            UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler1_hc,this.bagEquipFilter1_hc)
        })
    }
    bagEquipSelectedHandler2_hc = (node:Node,index:number,self:any)=>{
        self.hide()
        let data:outer_pb.IEquip =self.bagList.array[index]
        UIMgr.I.PopView.show(0,data,false,ShowItemType.Equip,'选择',(d:outer_pb.IEquip)=>{
            this.pet2=d
            this.refreshHcView()
            GD.playGetItemSound()
        },()=>{
            UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler2_hc,this.bagEquipFilter2_hc)
        })
    }
    bagEquipFilter1_hc = (equip:outer_pb.IEquip)=>{
        if(equip.Id/10000>>0 == EquipType.Pet && equip.Lv<20){
            if(this.pet2){
                return equip.Id==this.pet2.Id && equip.Uid!=this.pet2.Uid
            }else{
                return true
            }
        }
        return false
    }
    bagEquipFilter2_hc = (equip:outer_pb.IEquip)=>{
        if(equip.IsLock)return false
        if(equip.Id/10000>>0 == EquipType.Pet){
            if(this.pet1){
                return equip.Id==this.pet1.Id && equip.Uid!=this.pet1.Uid
            }else{
                return true
            }
        }
        return false
    }
    resetNull(){
        this.pet1=null
        this.pet2=null
        this.unSelectXlCell()
    }
    unSelectXlCell(){
        if(this.selectedXlCell){
            this.selectedXlCell.children[0].active=false;
            this.selectedXlCell=null;
        }
    }
    pet1:outer_pb.IEquip;
    pet2:outer_pb.IEquip;
    bodyType:BodyType=BodyType.None;
    refreshHcView(){
        let name1='主宠物'
        let exp1='点击选择宠物'
        let color1=ct.gray
        if(this.pet1){
            let lv = this.pet1.Lv
            name1 = `${GD.EquipBaseDatas.get(this.pet1.Id).Name} Lv.${lv}`
            exp1 = `(经验值：${this.pet1.Exp}/${lv<20?(lv+1)*(lv+2):'-'})`
            color1 = ct.purple
        }
        let label1=this.hcPet1Btn.children[0].getComponent(Label)
        label1.string=name1
        label1.color.fromHEX(color1)
        this.hcPet1Btn.children[1].getComponent(Label).string=exp1

        let name2='材料宠物'
        let exp2='点击选择宠物'
        let color2=ct.gray
        let showOnly=false
        if(this.pet2){
            let lv = this.pet2.Lv
            showOnly = this.pet2.Exp>0||lv>0
            name2 = `${GD.EquipBaseDatas.get(this.pet2.Id).Name} Lv.${lv}`
            let allExp=this.getPetAllExp(this.pet2,showOnly&&this.expOnly.isChecked)
            // let allExp=this.pet2.Exp+1
            // if(this.expOnly.isChecked){
            //     allExp=this.pet2.Exp //不含本体经验1
            // }
            // for(let i=1;i<=lv;i++){
            //     allExp += i*(i+1)
            // }
            // if (this.pet2.Lv == 20 && this.pet2.YsList.length > 1) {
			// 	//不止一个元素属性（融合过的宠物）
			// 	allExp = allExp * this.pet2.YsList.length
			// }
            exp2 = `(总经验值：${allExp})`
            color2 = ct.purple
        }
        this.expOnly.node.active=showOnly
        label1=this.hcPet2Btn.children[0].getComponent(Label)
        label1.string=name2
        label1.color.fromHEX(color2)
        this.hcPet2Btn.children[1].getComponent(Label).string=exp2
    }
    getPetAllExp=(pet:outer_pb.IEquip,isExpOnly:boolean):number=>{
        let lv = pet.Lv
        let allExp=pet.Exp+1
        if(isExpOnly){
            allExp=pet.Exp //不含本体经验1
        }
        for(let i=1;i <= lv;i++){
            allExp += i*(i+1)
        }
        if (pet.Lv == 20 && pet.YsList.length > 1) {
            //不止一个元素属性（融合过的宠物）
            allExp = allExp * pet.YsList.length
        }
        return allExp
    }
    selectedHcPet(pet:outer_pb.IEquip,bodyType:BodyType){
        this.tab.select(1)
        this.bodyType=bodyType
        this.pet1=pet
        this.autoSelectHcPet2()
        this.refreshHcView()
    }
    autoSelectHcPet2=()=>{
        if(this.pet1){
            let equip=GD.role.BagEquips.find((equip:outer_pb.IEquip)=>{
                if(equip.Id==this.pet1.Id && equip.Uid!=this.pet1.Uid && equip.Lv==0&&equip.IsLock==false){
                    return true
                }
                return false
            })
            if(equip){
                this.pet2=equip
            }
        }
    }
    doHcPet(){
        if(this.pet1&&this.pet2&&this.pet1.Id==this.pet2.Id&&this.pet1.Uid!=this.pet2.Uid&&this.pet1.Lv<20){
            // if(this.expOnly.isChecked&& this.getPetAllExp(this.pet2,true)>0){
            // }
            let req=outer_pb.PetAct.create()
            req.Uid1=this.pet1.Uid
            req.Uid2=this.pet2.Uid
            req.BodyType=this.bodyType
            req.ExpOnly=this.expOnly.node.active&&this.expOnly.isChecked
            let buf=outer_pb.PetAct.encode(req).finish()
            WS.send(MT.HcPet,buf,this.onHcPet)
        }else{
            UIMgr.I.tip('未选择宠物')
        }
    }
    onHcPet=(d:any)=>{
        //2,6,12,20,30,42,56,72,90,110,132,156,182,210,240,272,306,342,380,420
        let rsp=outer_pb.PetAct.decode(d)
        if(rsp.ErrCode==Err.ErrCode_Success){
            this.pet1.Exp = rsp.Pet.Exp
            this.pet1.Lv = rsp.Pet.Lv
            if(rsp.Uid2!=''){
                 GD.role.tryDeleteBagEquip(rsp.Uid2)
            }else{
                this.pet2.Exp = rsp.Equip2.Exp
                this.pet2.Lv = rsp.Equip2.Lv
            }
            this.pet2=null
            this.autoSelectHcPet2()
            this.refreshHcView()
            UIMgr.I.tip('合成成功',ct.green)
        }else{
            UIMgr.I.tip('无法操作')
        }
    }
    doRhPet(){
        if(this.pet1&&this.pet2&&this.pet1.Uid!=this.pet2.Uid&&this.pet1.Lv>=15&&this.pet2.Lv==0){
            let req=outer_pb.PetAct.create()
            req.Uid1=this.pet1.Uid
            req.Uid2=this.pet2.Uid
            req.BodyType=this.bodyType
            let buf=outer_pb.PetAct.encode(req).finish()
            WS.send(MT.RhPet,buf,this.onRhPet)
        }else{
            UIMgr.I.tip('未选择宠物')
        }
    }
    onRhPet=(d:any)=>{
        let rsp=outer_pb.PetAct.decode(d)
        if(rsp.ErrCode==Err.ErrCode_Success){
            this.pet1.YsList=rsp.Pet.YsList
            GD.role.tryDeleteBagEquip(rsp.Uid2)
            this.pet2=null
            this.refreshRhView()
            UIMgr.I.tip('融合成功',ct.green)
        }else{
            UIMgr.I.tip('无法操作')
        }
    }
    refreshRhView(){
        let name1='主宠物'
        let ys1='点击选择宠物'
        let color1=ct.gray
        if(this.pet1){
            let lv = this.pet1.Lv
            name1 = `${GD.EquipBaseDatas.get(this.pet1.Id).Name} Lv.${lv}`
            let ysList=[]
            this.pet1.YsList.forEach(v=>{
                ysList.push(YsTypeString[v])
            })
            ys1 = `(${ysList.join(',')})`
            color1 = ct.purple
        }
        let label1=this.rhPet1Btn.children[0].getComponent(Label)
        label1.string=name1
        label1.color.fromHEX(color1)
        this.rhPet1Btn.children[1].getComponent(Label).string=ys1

        let name2='材料宠物'
        let ys2='点击选择宠物'
        let color2=ct.gray
        if(this.pet2){
            let lv = this.pet2.Lv
            name2 = `${GD.EquipBaseDatas.get(this.pet2.Id).Name} Lv.${lv}`
            let ysList=[]
            this.pet2.YsList.forEach(v=>{
                ysList.push(YsTypeString[v])
            })
            ys2 = `(${ysList.join(',')})`
            color2 = ct.purple
        }
        let label2=this.rhPet2Btn.children[0].getComponent(Label)
        label2.string=name2
        label2.color.fromHEX(color2)
        this.rhPet2Btn.children[1].getComponent(Label).string=ys2
    }
    resetPetNeedDia:number
    // goldNeedNum:number
    // diaNeedNum:number
    protected onEnable(): void {
        this.resetPetNeedDia=GD.configs.get(ConfigType.ResetPetMainYsNeedDia)
        // this.goldNeedNum=GD.configs.get(ConfigType.XiLianPetNeedGold)
        // this.diaNeedNum=GD.configs.get(ConfigType.XiLianPetNeedDia)
        this.tab.select(0)
    }
    protected onDisable(): void {
        this.resetNull();
    }
}


