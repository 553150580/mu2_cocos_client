import { _decorator, Component, Label, Node, RichText, Toggle } from 'cc';
import { Tab } from '../UiComps/Tab';
import GD from '../base/GameData';
import { BodyType, ct,  EquipType, FuMoTypeStr, WingBase, WingZyPros, ZyTypeString } from '../base/types';
import { UIMgr } from '../managers/UIMgr';
import { ShowItemType } from './PopView';
import WS from '../base/net';
import { Err, MT } from '../base/MT';
const { ccclass, property } = _decorator;

@ccclass('Npc32View')
export class Npc32View extends Component {
    @property(Node)
    equip1Btn:Node;
    @property(Node)
    equip2Btn:Node;
    @property(Node)
    okBtn:Node;
    @property(RichText)
    infoRich1:RichText;
    @property(RichText)
    infoRich2:RichText;
    @property(Tab)
    tab:Tab;
    @property(Toggle)
    toggle:Toggle;
    @property(Label)
    needLabel:Label

    equip1:outer_pb.IEquip;
    equip2:outer_pb.IEquip;
    bodyType:BodyType=BodyType.None;
    typesStr:Array<string>;
    static I:Npc32View;
    protected onLoad(): void {
        Npc32View.I=this;
        this.typesStr = this.tab.labels.split(',')
        this.typesStr.unshift('请选择转移类型')
        this.tab.selectedHandler=(node:Node,index:number)=>{
            this.equip1=null
            this.equip2=null
            this.bodyType=BodyType.None
            this.refreshView()
            this.toggle.isChecked=false;
            this.setToggleName(this.typesStr[index+1],ct.white)
            GD.playClickSound();
        }
        this.equip1Btn.on(Node.EventType.TOUCH_END,()=>{
            if(this.tab.selectedIndex>=0){
                if(this.equip1){
                    UIMgr.I.PopView.show(0,this.equip1,false,ShowItemType.Equip,'取消',(d:outer_pb.IEquip)=>{
                        this.equip1=null
                        this.bodyType=BodyType.None
                        this.refreshView()
                        GD.playGetItemSound()
                    })
                }else{
                    UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler1,this.bagEquipFilter1)
                }
            }else{
                UIMgr.I.tip('请先选择转移类型')
            }
        },this);
        this.equip2Btn.on(Node.EventType.TOUCH_END,()=>{
            if(this.equip2){
                UIMgr.I.PopView.show(0,this.equip2,false,ShowItemType.Equip,'取消',(d:outer_pb.IEquip)=>{
                    this.equip2=null
                    this.refreshView()
                    GD.playGetItemSound()
                })
            }else{
                if(this.tab.selectedIndex>=0){
                    if(this.equip1){
                        UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler2,this.bagEquipFilter2)
                    }else{
                        UIMgr.I.tip('请先选择左边的装备')
                    }
                }else{
                    UIMgr.I.tip('请先选择转移类型')
                }
            }
        },this);
        this.okBtn.on(Node.EventType.TOUCH_END,this.doMovePro)
    }
    protected onEnable(): void {
        this.setToggleName('请选择转移类型',ct.brown)
        this.tab.selectedIndex=-1
        this.isDoMoving=false;
        this.refreshView()
    }
    protected onDisable(): void {
        this.bodyType=BodyType.None
        this.equip1=null
        this.equip2=null
    }
    setToggleName(name:string,color:ct){
        let label=this.toggle.node.children[1].getComponent(Label);
        label.string= name;
        label.color.fromHEX(color)
    }
    bagEquipSelectedHandler1 = (node:Node,index:number,self:any)=>{
        self.hide()
        let data:outer_pb.IEquip =self.bagList.array[index]
        UIMgr.I.PopView.show(0,data,false,ShowItemType.Equip,'选择',(d:outer_pb.IEquip)=>{
            this.equip1=d
            this.bodyType=BodyType.None
            this.equip2=null
            this.refreshView()
            GD.playGetItemSound()
        },()=>{
            UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler1,this.bagEquipFilter1)
        })
    }
    bagEquipSelectedHandler2 = (node:Node,index:number,self:any)=>{
        self.hide()
        let data:outer_pb.IEquip =self.bagList.array[index]
        UIMgr.I.PopView.show(0,data,false,ShowItemType.Equip,'选择',(d:outer_pb.IEquip)=>{
            this.equip2=d
            this.refreshView()
            GD.playGetItemSound()
        },()=>{
            UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler2,this.bagEquipFilter2)
        })
    }
    bagEquipFilter1 = (equip:outer_pb.IEquip)=>{
        let et1 = equip.Id/10000>>0
        if(et1>EquipType.Wing||equip.IsLock)return false
        if(this.equip2){
            let et2=this.equip2.Id/10000>>0
            if((et1 == EquipType.Weapon || et1 == EquipType.JianTong || et1 == EquipType.ZHBook)){
                et1=EquipType.Weapon
            }
            if((et2 == EquipType.Weapon || et2 == EquipType.JianTong || et2 == EquipType.ZHBook)){
                et2=EquipType.Weapon
            }
            if(equip.Uid==this.equip2.Uid || et1!=et2){
                return false
            }
        }
        const zyType = this.tab.selectedIndex;
        if(zyType==0){
            if(equip.IsBZ)return false;//爆竹装备无法转移强化
        }
        if(zyType==5){
            if(et1==EquipType.Wing){
                return true
            }else{
                if(this.equip2){
                    //卓越属性转移，需要同名(id)装备
                    if(equip.Id!=this.equip2.Id)return false
                }
                return equip.ZyList.length>0
            }
        }
        if(zyType==10){
            if(equip.SkillId==0)return false
        }
        return true
        // return this.filterEquip(equip,zyType)
    }
    bagEquipFilter2 = (equip:outer_pb.IEquip)=>{
        let et2 = equip.Id/10000>>0
        if(et2>EquipType.Wing||equip.IsLock)return false
        const zyType = this.tab.selectedIndex;
        const e1=this.equip1
        if(e1){
            let et1=e1.Id/10000>>0
            if((et1 == EquipType.Weapon || et1 == EquipType.JianTong || et1 == EquipType.ZHBook)){
                et1=EquipType.Weapon
            }
            if((et2 == EquipType.Weapon || et2 == EquipType.JianTong || et2 == EquipType.ZHBook)){
                et2=EquipType.Weapon
            }
            if(equip.Uid==e1.Uid || et2!=et1 ){
                return false
            }
            if(zyType<0)return false
            if(zyType==0){
                if(equip.IsBZ)return false;//爆竹装备无法转移强化
            }
            if(zyType==10){ //技能转移
                if(equip.SkillId==0||equip.SkillId!=e1.SkillId)return false
                if((e1.ZyList.length==0&&equip.ZyList.length==0)||(e1.ZyList.length>0&&equip.ZyList.length>0)){
                    return true
                }
            }
            if(zyType==5){
                if(et2==EquipType.Wing){
                    //翅膀卓越属性转移，需要代翅膀
                    let wing1:WingBase = GD.EquipBaseDatas.get(e1.Id)
                    let wing2:WingBase = GD.EquipBaseDatas.get(equip.Id)
                    if(wing1.EquipLv!=wing2.EquipLv) {
                        return false;
                    }else{
                        return e1.ZyList.length>0 || equip.ZyList.length>0
                    }
                }else if(equip.Id!=e1.Id){
                    //卓越属性转移，需要同名(id)装备
                    return false
                }
                return equip.ZyList.length>0
            }
            return true
        }else{
            return false
        }
    }
    // selectedEquip(equip1:outer_pb.IEquip,bodyType:BodyType){
    //     this.bodyType=bodyType
    //     this.equip1=equip1
    //     this.tab.select(0)
    // }
    can:boolean=false
    needDia:number=0
    refreshView(){
        this.can=false
        let e1=this.equip1
        let e2=this.equip2
        this.renderRich(this.infoRich1,e1,this.equip1Btn)
        this.renderRich(this.infoRich2,e2,this.equip2Btn)
        let need=''
        let needColor=ct.brown;
        if(e1&&e2){
            this.can=true
            const zyType = this.tab.selectedIndex;
            let num=0
            if(zyType==0){
                const max = Math.max(e1.QhLv,e2.QhLv);
                if(max>=9){
                    num = max-6
                }else{
                    this.can=false
                    need='需要其中一件装备达到【强化+9】及以上才能转移'
                }
            }else if(zyType==1){
                const et = e1.Id/10000>>0
                let step=4
                if(et==EquipType.Ring||et==EquipType.Shield)step=5;
                const max = Math.max(e1.ZjLv,e2.ZjLv)/step;
                if(max<3){
                    this.can=false
                    need=`需要其中一件装备达到【追加+${step*3}】及以上才能转移`
                }else if(e1.ZjLv==e2.ZjLv){
                    need='无需转移'
                    this.can=false
                }else{
                    num = max
                }
            }else if(zyType==2){
                if(e1.LuckyLv==e2.LuckyLv){
                    need='无需转移'
                    this.can=false
                }else{
                    num = Math.max(e1.LuckyLv,e2.LuckyLv)
                    let rate=3
                    if(num>3){
                        rate=num
                    }
                    num=num*rate
                }
            }else if(zyType==3){
                if(e1.ZsLv==e2.ZsLv||e1.ZsType==0||e2.ZsType==0){
                    need='必须都具有再生属性，且进化等级不相等'
                    this.can=false
                }else{
                    num = Math.max(e1.ZsLv,e2.ZsLv)
                }
            }else if(zyType==4){
                if(e1.PvpLv==e2.PvpLv){
                    need='无需转移'
                    this.can=false
                }else{
                    num = Math.max(e1.PvpLv,e2.PvpLv)*2
                }
            }else if(zyType==5){
                //卓越属性
                const isWing=(e1.Id/10000>>0)==EquipType.Wing
                if(isWing==false&&(e1.ZyList.length==0||e2.ZyList.length==0)){
                    need='无法转移'
                    this.can=false
                }else{
                    let rate=1
                    if(isWing){
                        let wing1:WingBase = GD.EquipBaseDatas.get(e1.Id)
                        rate = wing1.EquipLv
                    }
                    num = Math.max(e1.ZyList.length,e2.ZyList.length)*5*rate
                }
            }else if(zyType==6){
                if(e1.TzTL==e2.TzTL||e1.TzLv==0||e2.TzLv==0){
                    need='必须都是套装，且套装体力不相等'
                    this.can=false
                }else{
                    num = Math.max(e1.TzTL,e2.TzTL)/5*2
                }
            }else if(zyType==7){
                if(e1.TzLv==e2.TzLv||(e1.TzLv==0&&e2.TzLv==0)){
                    need='必须有一件是套装，且套装等级不相等'
                    this.can=false
                }else{
                    num = Math.max(e1.TzLv,e2.TzLv)*5
                }
            }else if(zyType==8){
                if(e1.DtTzLv==e2.DtTzLv||(e1.DtTzLv==0&&e2.DtTzLv==0)||e1.TzLv==0||e2.TzLv==0){
                    need='必须都是套装且有一件是大天套，且大天使套装等级不相等'
                    this.can=false
                }else{
                    num = Math.max(e1.DtTzLv,e2.DtTzLv)*5
                }
            }else if(zyType==9){
                //附魔属性
                let totalLv1=0
                e1.YsList.forEach(v=>{
                    totalLv1 += (v/100-100)>>0
                })
                let totalLv2=0
                e2.YsList.forEach(v=>{
                    totalLv2 += (v/100-100)>>0
                })
                if(totalLv1==0&&totalLv2==0){
                    need='无需转移'
                    this.can=false
                }else{
                    num = Math.max(totalLv1,totalLv2)
                }
            }else if(zyType==10){
                if(e1.SkillId==0||e2.SkillId==0){
                    need='必须都是技能装备'
                    this.can=false
                }else{
                    if((e1.ZyList.length==0&&e2.ZyList.length==0)||(e1.ZyList.length>0&&e2.ZyList.length>0)){
                        let lv1=0
                        if(e1.Data){
                            lv1=e1.Data[5]||0
                        }
                        let lv2=0
                        if(e2.Data){
                            lv2=e2.Data[5]||0
                        }
                        if(lv1==lv2){
                            need='无需转移'
                            this.can=false
                        }else{
                            num = Math.max(lv1,lv2)*5
                        }
                    }else{
                        need='必须都是卓越装备，或都为非卓越装备'
                        this.can=false
                    }
                }
            }
            if(num==0)this.can=false
            if(this.can){
                this.needDia=num*500;
                need = `需要：钻石x${this.needDia}`;
                needColor=ct.qing
            }
        }
        this.needLabel.string=need
        this.needLabel.color.fromHEX(needColor)
    }
    renderRich(rich:RichText,equip:outer_pb.IEquip,cell:Node){
        const zyType = this.tab.selectedIndex;
        let pro=''
        let color = ct.blue
        let name1='点击选择装备'
        let color1=ct.gray
        if(equip){
            if(equip.QhLv>=7){
                color1=ct.yellow
            }else if(equip.ZjLv>0||equip.LuckyLv>0||equip.YsList.length>0){
                color1=ct.blue
            }else{
                color1=ct.white
            }
            if(equip.ZyList.length>0){
                color1=ct.green
            }
            if(equip.TzLv>0){
                color1=ct.red
            }
            name1 = `${GD.EquipBaseDatas.get(equip.Id).Name}+${equip.QhLv}z${equip.ZjLv}xy${equip.LuckyLv}`
            if(zyType==0){
                pro = `强化等级：${equip.QhLv}`
            }else if(zyType==1){
                pro = `追加等级：${equip.ZjLv}`
            }else if(zyType==2){
                let failedNum=equip.Data[0]
                let ln=''
                if(failedNum){
                    ln=`（第${failedNum}次)`
                }
                pro = `幸运等级：${equip.LuckyLv}${ln}`
            }else if(zyType==3){
                color=ct.yellow
                pro = `进化等级：${equip.ZsLv}`
            }else if(zyType==4){
                color=ct.purple
                pro = `PvP等级：${equip.PvpLv}`
            }else if(zyType==5){
                //卓越属性
                color=ct.green
                if(equip.ZyList.length>0){
                    let list = ZyTypeString;
                    if((equip.Id/10000>>0)==EquipType.Wing){
                        list = WingZyPros;
                    }
                    equip.ZyList.forEach(type=>{
                        pro += `${list[type]}<br/>`
                    })
                }
            }else if(zyType==6){
                pro = `套装体力：${equip.TzTL}`
            }else if(zyType==7){
                pro = `套装体力：${equip.TzTL}<br/>套装等级：${equip.TzLv}`
            }else if(zyType==8){
                color=ct.purple
                pro = `大天使套装等级：${equip.DtTzLv}`
            }else if(zyType==9){
                //附魔属性
                if(equip.YsList&&equip.YsList.length>0){
                    //复制并排序
                    let list = equip.YsList.slice().sort((a,b)=>{
                        return a%100-b%100
                    })
                    list.forEach(v=>{
                        const type = v%100
                        const lv = (v/100-100)>>0
                        pro+=`${FuMoTypeStr[type]} Lv.${lv}<br/>`
                    })
                }
            }else if(zyType==10){
                let lv=0
                if(equip.Data){
                    lv=equip.Data[5]||0
                }
                pro = `技能：${GD.allSkills.get(equip.SkillId).Name} Lv.${lv}`
            }
        }
        let label=cell.children[0].getComponent(Label)
        label.string=name1
        label.color.fromHEX(color1)
        rich.string=`<color=${color}>${pro}</>`
    }
    isDoMoving:boolean=false
    doMovePro=()=>{
        if(this.isDoMoving)return
        if(this.tab.selectedIndex>=0){
            if(this.can){
                if(GD.role.hasEnoughDia(this.needDia)){
                    let req=outer_pb.PetAct.create()
                    req.ActType=this.tab.selectedIndex
                    req.Uid1=this.equip1.Uid
                    req.Uid2=this.equip2.Uid
                    req.BodyType=this.bodyType
                    // console.log('doMovePro',req)
                    let buf=outer_pb.PetAct.encode(req).finish()
                    WS.send(MT.MovePro,buf,this.onMovePro)
                    this.scheduleOnce(()=>{this.isDoMoving=false},15)
                }
            }else{
                UIMgr.I.tip('无法转移，装备未达到转移要求')
            }
        }else{
            UIMgr.I.tip('请先选择转移类型')
        }
    }
    onMovePro=(d:any)=>{
        this.isDoMoving=false;
        let rsp=outer_pb.PetAct.decode(d)
        // console.log('onMovePro',rsp)
        if(rsp.ErrCode==Err.ErrCode_Success){
            const zyType = rsp.ActType
            this.equip1.Data=rsp.Pet.Data
            this.equip2.Data=rsp.Equip2.Data
            if(zyType==0){
                this.equip1.QhLv = rsp.Pet.QhLv;
                this.equip2.QhLv = rsp.Equip2.QhLv;
            }else if(zyType==1){
                this.equip1.ZjLv = rsp.Pet.ZjLv;
                this.equip2.ZjLv = rsp.Equip2.ZjLv;
            }else if(zyType==2){
                this.equip1.LuckyLv = rsp.Pet.LuckyLv;
                this.equip2.LuckyLv = rsp.Equip2.LuckyLv;
            }else if(zyType==3){
                this.equip1.ZsLv = rsp.Pet.ZsLv;
                this.equip2.ZsLv = rsp.Equip2.ZsLv;
                this.equip1.ZsType = rsp.Pet.ZsType;
                this.equip2.ZsType = rsp.Equip2.ZsType;
            }else if(zyType==4){
                this.equip1.PvpLv = rsp.Pet.PvpLv;
                this.equip2.PvpLv = rsp.Equip2.PvpLv;
            }else if(zyType==5){
                //卓越属性
                this.equip1.ZyList = rsp.Pet.ZyList;
                this.equip2.ZyList = rsp.Equip2.ZyList;
            }else if(zyType==6){
                this.equip1.TzTL = rsp.Pet.TzTL;
                this.equip2.TzTL = rsp.Equip2.TzTL;
            }else if(zyType==7){
                this.equip1.TzLv = rsp.Pet.TzLv;
                this.equip2.TzLv = rsp.Equip2.TzLv;
                this.equip1.TzTL = rsp.Pet.TzTL;
                this.equip2.TzTL = rsp.Equip2.TzTL;
            }else if(zyType==8){
                this.equip1.DtTzLv = rsp.Pet.DtTzLv;
                this.equip2.DtTzLv = rsp.Equip2.DtTzLv;
            }else if(zyType==9){
                //附魔属性
                this.equip1.YsList = rsp.Pet.YsList;
                this.equip2.YsList = rsp.Equip2.YsList;
            }
            GD.role.reduceDia(rsp.Num)
            this.equip1=null
            this.equip2=null
            this.refreshView()
            if(rsp.BasePros){
                UIMgr.I.resetRoleBasePros(rsp.BasePros)
            }
            UIMgr.I.tip('转移成功',ct.green)
        }else{
            UIMgr.I.tip('无法操作')
        }
    }
}