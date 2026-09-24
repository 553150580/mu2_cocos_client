import { _decorator, Component, Label, Node, RichText } from 'cc';
import { Tab } from '../UiComps/Tab';
import GD from '../base/GameData';
import { BodyType, ct, EquipType, PointTypeString, TsType, YsTypeString } from '../base/types';
import { UIMgr } from '../managers/UIMgr';
import { ShowItemType } from './PopView';
import WS from '../base/net';
import { Err, MT } from '../base/MT';
const { ccclass, property } = _decorator;

//驯兽师
@ccclass('Npc13View')
export class Npc13View extends Component {
    @property(Tab)
    tab:Tab;
    @property(Label)
    head:Label;
    @property(Node)
    equip1Btn:Node;
    @property(Node)
    equip2Btn:Node;
    @property(Node)
    tsBtn:Node;
    @property(RichText)
    infoRich:RichText;
    
    tsTypes:Array<string>;
    static I:Npc13View
    protected onLoad(): void {
        Npc13View.I=this;
        this.tsTypes=this.tab.labels.split(',')
        this.tab.selectedHandler=(node:Node,index:number)=>{
            this.head.string=`【${this.tsTypes[index]}吞噬升级】` 
            this.resetNull();
            this.refreshTsView()
            GD.playClickSound();
        }
        this.equip1Btn.on(Node.EventType.TOUCH_END,()=>{
            if(this.equip1){
                UIMgr.I.PopView.show(0,this.equip1,false,ShowItemType.Equip,'取消',(d:outer_pb.IEquip)=>{
                    this.equip1=null
                    this.bodyType=BodyType.None
                    this.refreshTsView()
                    GD.playGetItemSound()
                })
            }else{
                UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler1_ts,this.bagEquipFilter1_ts)
            }
        },this);
        this.equip2Btn.on(Node.EventType.TOUCH_END,()=>{
            if(this.equip2){
                UIMgr.I.PopView.show(0,this.equip2,false,ShowItemType.Equip,'取消',(d:outer_pb.IEquip)=>{
                    this.equip2=null
                    this.refreshTsView()
                    GD.playGetItemSound()
                })
            }else{
                UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler2_ts,this.bagEquipFilter2_ts)
            }
        },this);
        this.tsBtn.on(Node.EventType.TOUCH_END,this.doTs)
    }
    bagEquipSelectedHandler1_ts = (node:Node,index:number,self:any)=>{
        self.hide()
        let data:outer_pb.IEquip =self.bagList.array[index]
        UIMgr.I.PopView.show(0,data,false,ShowItemType.Equip,'选择',(d:outer_pb.IEquip)=>{
            this.equip1=d
            this.bodyType=BodyType.None
            if(this.equip2==null) this.autoSelectEquip2()
            this.refreshTsView()
            GD.playGetItemSound()
        },()=>{
            UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler1_ts,this.bagEquipFilter1_ts)
        })
    }
    bagEquipSelectedHandler2_ts = (node:Node,index:number,self:any)=>{
        self.hide()
        let data:outer_pb.IEquip =self.bagList.array[index]
        UIMgr.I.PopView.show(0,data,false,ShowItemType.Equip,'选择',(d:outer_pb.IEquip)=>{
            this.equip2=d
            this.refreshTsView()
            GD.playGetItemSound()
        },()=>{
            UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler2_ts,this.bagEquipFilter2_ts)
        })
    }
    bagEquipFilter1_ts = (equip:outer_pb.IEquip)=>{
        const et = equip.Id/10000>>0
        if(this.equip2 && (equip.Uid==this.equip2.Uid || et!=this.equip2.Id/10000>>0))return false
        const tsT = this.tab.selectedIndex;
        if(tsT==0){
            //守护（恶魔、天使）
            if((et == EquipType.Em||et == EquipType.TianShi) && equip.Lv<100){
                return true
            }
        }else if(tsT==1){
            //戒指、项链
            if((et == EquipType.Ring||et == EquipType.Neck) && equip.Lv<10&&equip.QhLv>=9){
                if(this.equip2){
                    if(this.equip2.ZyList.length>0){
                        if(equip.ZyList.length==0)return false
                    }else{
                        if(equip.ZyList.length>0)return false
                    }
                    return true
                }else{
                    return true
                }
            }
        }else if(tsT==2){
            //勋章
            if((et == EquipType.XunZhang) && equip.Lv<100){
                return true
            }
        }else if(tsT==3){
            //坐骑
            if((et == EquipType.Horse) && equip.Lv<100){
                return true
            }
        }
        return false
    }
    bagEquipFilter2_ts = (equip:outer_pb.IEquip)=>{
        if(equip.IsLock)return false
        const et = equip.Id/10000>>0
        if(this.equip1 && (equip.Uid==this.equip1.Uid || et!=this.equip1.Id/10000>>0))return false
        const tsT = this.tab.selectedIndex;
        if(tsT==0){
            //守护（恶魔、天使）
            if(et == EquipType.Em||et == EquipType.TianShi){
                return true
            }
        }else if(tsT==1){
            //戒指、项链
            if((et == EquipType.Ring||et == EquipType.Neck) && equip.QhLv>=7){
                if(this.equip1){
                    if(this.equip1.ZyList.length>0){
                        if(equip.ZyList.length==0)return false
                    }else{
                        if(equip.ZyList.length>0)return false
                    }
                    return true
                }else{
                    return true
                }
            }
        }else if(tsT==2){
            //勋章
            if((et == EquipType.XunZhang)){
                return true
            }
        }else if(tsT==3){
            //坐骑
            if((et == EquipType.Horse)){
                return true
            }
        }
        return false
    }
    resetNull(){
        this.equip1=null
        this.equip2=null
        this.bodyType=BodyType.None
    }
    equip1:outer_pb.IEquip;
    equip2:outer_pb.IEquip;
    bodyType:BodyType=BodyType.None;
    refreshTsView(){
        const tsType=this.tab.selectedIndex
        const tsTypeStr=this.tsTypes[tsType]
        let name1=`主${tsTypeStr}`
        let exp1=`点击选择${tsTypeStr}`
        let color1=ct.gray
        if(this.equip1){
            const lv = this.equip1.Lv
            name1 = `${GD.EquipBaseDatas.get(this.equip1.Id).Name} Lv.${lv}`
            let nextLvExp = 1
            if(tsType==1){
                nextLvExp = (lv+1)*(lv+2)*2
            }
            let maxLv=100
            if(tsType==1){
                maxLv=10
            }
            exp1 = `(经验值：${this.equip1.Exp}/${lv<maxLv?nextLvExp:'-'})`
            color1 = ct.purple
            const et=this.equip1.Id/10000>>0;
            if(et==EquipType.Ring||et==EquipType.Neck){
                if(this.equip1.ZyList.length>0){
                    color1=ct.green
                }else{
                    color1=ct.blue
                }
            }
        }
        this.refreshInfoRich()
        let label1=this.equip1Btn.children[0].getComponent(Label)
        label1.string=name1
        label1.color.fromHEX(color1)
        this.equip1Btn.children[1].getComponent(Label).string=exp1

        let name2=`材料${tsTypeStr}`
        let exp2=`点击选择${tsTypeStr}`
        let color2=ct.gray
        if(this.equip2){
            const lv = this.equip2.Lv
            name2 = `${GD.EquipBaseDatas.get(this.equip2.Id).Name} Lv.${lv}`
            let allExp=this.equip2.Exp+1
            if(tsType==1){
                if(lv>0){
                    for(let i=1;i<=lv;i++){
                        allExp += i*(i+1)*2
                    }
                }
            }else{
                allExp=lv+1
            }
            exp2 = `(总经验值：${allExp})`
            color2 = ct.purple
            const et=this.equip2.Id/10000>>0;
            if(et==EquipType.Ring||et==EquipType.Neck){
                if(this.equip2.ZyList.length>0){
                    color2=ct.green
                }else{
                    color2=ct.blue
                }
            }
        }
        label1=this.equip2Btn.children[0].getComponent(Label)
        label1.string=name2
        label1.color.fromHEX(color2)
        this.equip2Btn.children[1].getComponent(Label).string=exp2
    }
    refreshInfoRich(){
        const equip = this.equip1;
        let pros=''
        if(equip){
            const et=equip.Id/10000>>0
            const lv = equip.Lv
            let nextLv = lv+1
            let addLv=1
            if(et==EquipType.Ring||et==EquipType.Neck){
                if(nextLv>10)nextLv=10
            }else{
                if(this.equip2){
                    addLv = this.equip2.Lv+1
                    nextLv = lv+addLv
                }
                if(nextLv>100)nextLv=100
            }
            pros+=`<color=${ct.gray}>====(主道具升级后提升属性值预览)====</><br/>`
            if(et==EquipType.Em){
                pros+=`<color=${ct.purple}>攻击速度+${10+lv}</> <color=${ct.green}>(+${addLv*1})</><br/>`
                pros+=`<color=${ct.blue}>伤害提升+${((10+lv)*10>>0)/10}%</> <color=${ct.green}>(+${addLv*1}%)</><br/>`
                pros+=`<color=${ct.blue}>最大攻击力+${30+2*lv}</> <color=${ct.green}>(+${addLv*2})</><br/>`
            }else if(et==EquipType.TianShi){
                pros+=`<color=${ct.blue}>伤害吸收+${((10+0.5*lv)*10>>0)/10}%</> <color=${ct.green}>(+${addLv/2}%)</><br/>`
                pros+=`<color=${ct.blue}>最大生命值+${50+5*lv}</> <color=${ct.green}>(+${addLv*5})</><br/>`
                pros+=`<color=${ct.blue}>生命自动恢复+${10+lv*2}</> <color=${ct.green}>(+${addLv*2})</><br/>`
            }else if(et==EquipType.Horse){
                const addExp=20+2*lv
                const addSkill=1+(lv/10>>0)
                pros+=`<color=${ct.brown}>所有技能等级+${addSkill}</> <color=${ct.green}>(+${(1+(nextLv/10>>0)-addSkill)})</><br/>`
                pros+=`<color=${ct.brown}>对玩家伤害提升+${10+lv}%</> <color=${ct.green}>(+${addLv*1}%)</><br/>`
                pros+=`<color=${ct.brown}>受到玩家伤害减少+${((10+0.6*lv)*10>>0)/10}%</> <color=${ct.green}>(+${(addLv*6/10)}%)</><br/>`
                pros+=`<color=${ct.blue}>杀死怪物获得金币提升+${40+5*lv}%</> <color=${ct.green}>(+${addLv*5}%)</><br/>`
                pros+=`<color=${ct.blue}>自动获得泡点经验提升+${addExp}%</> <color=${ct.green}>(+${addLv*2}%)</><br/>`
                pros+=`<color=${ct.blue}>杀死怪物获得经验值提升+${addExp}%</> <color=${ct.green}>(+${addLv*2}%)</><br/>`
            }else if(et==EquipType.XunZhang){
                const twoDmg=3+0.25*lv
                const wsDmg=1+0.1*lv
                pros+=`<color=${ct.blue}>${PointTypeString[equip.YsList[0]]}+${10+lv*10}</> <color=${ct.green}>(+${addLv*10})</><br/>`
                pros+=`<color=${ct.purple}>${YsTypeString[equip.YsList[1]]}元素+${1+lv}</> <color=${ct.green}>(+${addLv*1})</><br/>`
                pros+=`<color=${ct.brown}>双倍伤害概率+${((twoDmg)*10>>0)/10}%</> <color=${ct.green}>(+${addLv*25/100}%)</><br/>`
                pros+=`<color=${ct.red}>无视防御概率+${((wsDmg)*100>>0)/100}%</> <color=${ct.green}>(+${addLv/10}%)</><br/>`
                pros+=`<color=${ct.purple}>双倍元素伤害概率+${((twoDmg)*10>>0)/10}%</> <color=${ct.green}>(+${addLv*25/100}%)</><br/>`
                pros+=`<color=${ct.purple}>无视元素防御概率+${((wsDmg)*10>>0)/10}%</> <color=${ct.green}>(+${addLv/10}%)</><br/>`
                pros+=`<color=${ct.purple}>受到任意类型的反伤减少+${((5+0.8*lv)*10>>0)/10}%</> <color=${ct.green}>(+${addLv*8/10}%)</><br/>`
            }else if(et==EquipType.Ring||et==EquipType.Neck){
                let a=0
                if (equip.QhLv > 9) {
                    a = (equip.QhLv % 9) * ((equip.QhLv % 9) + 1) / 2
                }
                const n = lv*(lv+1)
                const nextN = nextLv*(nextLv+1)
                if(equip.ZyList.length==0){
                    if(et==EquipType.Ring){
                        let qhNum = equip.QhLv*5+a;
                        pros+= `<color=${ct.blue}>最大生命值：${10+lv*(lv+1)+qhNum}</>  <color=${ct.green}>(+${nextN-n})</><br/>`
                    }else{
                        let v = lv*(lv+1)/2+equip.QhLv*3+a+5;
                        pros+= `<color=${ct.blue}>最大攻击力：${v}</>  <color=${ct.green}>(+${(nextN-n)/2>>0})</><br/>`
                    }
                }else {
                    if(et==EquipType.Ring){
                        let qhNum = equip.QhLv*5+a;
                        pros+= `<color=${ct.blue}>最大生命值：${20+lv*(lv+1)*2+qhNum}</>  <color=${ct.green}>(+${(nextN-n)*2})</><br/>`
                    }else{
                        let v = lv*(lv+1)+equip.QhLv*3+a+10;
                        pros+= `<color=${ct.blue}>最大攻击力：${v}</>  <color=${ct.green}>(+${nextN-n})</><br/>`
                    }
                }
                const ys= 1+lv*(lv+1)
                const nextLvYs = 1+nextLv*(nextLv+1)
                let base = GD.EquipBaseDatas.get(equip.Id)
                pros+= `<color=${ct.purple}>${YsTypeString[base.YsType]}：${equip.ZyList.length>0?ys:ys/2>>0}</> <color=${ct.green}>(+${nextLvYs-ys})</><br/>`
            }
        }
        this.infoRich.string=pros;
    }

    selectedTsEquip(equip1:outer_pb.IEquip,bodyType:BodyType,tsType:TsType){
        this.tab.select(tsType)
        this.bodyType=bodyType
        this.equip1=equip1
        this.autoSelectEquip2()
        this.refreshTsView()
    }
    autoSelectEquip2=()=>{
        if(this.equip1){
            let equip=GD.role.BagEquips.find((equip:outer_pb.IEquip)=>{
                if(equip.Uid==this.equip1.Uid || equip.Lv>0 || equip.IsLock|| equip.TzLv>0){
                    return false
                }
                const tsT = this.tab.selectedIndex;
                if(tsT==0){
                    if(equip.Id==this.equip1.Id){
                        return true
                    }
                }else{
                    const et = equip.Id/10000>>0
                    if(et!=this.equip1.Id/10000>>0)return false
                    if(tsT==1){
                        //戒指、项链
                        if((et == EquipType.Ring||et == EquipType.Neck)&&equip.QhLv>=7){
                            if(this.equip1.ZyList.length>0){
                                if(equip.ZyList.length>0)return true
                            }else{
                                if(equip.ZyList.length==0)return true
                            }
                        }
                    }else if(tsT==2){
                        //勋章
                        return et == EquipType.XunZhang
                    }else if(tsT==3){
                        //坐骑
                        return et == EquipType.Horse
                    }
                }
                return false
            })
            if(equip){
                this.equip2=equip
            }
        }
    }
    doTs=()=>{
        if(this.equip1&&this.equip2&&this.equip1.Uid!=this.equip2.Uid){
            // if(this.tab.selectedIndex!=1){
            //     //除了首饰，吞噬恶魔、天使、勋章、炎狼有转生次数需求
            //     //准备等级<=10级时，吞噬升级和装备等级需求0转0级，之后每+10级需要多1转
            //     let needLv = (this.equip1.Lv+this.equip2.Lv-1)/10>>0
            //     if(needLv>0){
            //         needLv = 400+needLv
            //     }
            //     if(GD.role.hasEnoughLv(needLv)==false){
            //         return
            //     }
            // }
            let req=outer_pb.PetAct.create()
            req.Uid1=this.equip1.Uid
            req.Uid2=this.equip2.Uid
            req.BodyType=this.bodyType
            // console.log('doTs',req)
            let buf=outer_pb.PetAct.encode(req).finish()
            WS.send(MT.TunShi,buf,this.onTs)
        }else{
            UIMgr.I.tip(`未选择${this.tsTypes[this.tab.selectedIndex]}`)
        }
    }
    onTs=(d:any)=>{
        let rsp=outer_pb.PetAct.decode(d)
        // console.log('onTs',rsp)
        if(rsp.ErrCode==Err.ErrCode_Success){
            this.equip1.Exp = rsp.Pet.Exp
            this.equip1.Lv = rsp.Pet.Lv
            GD.role.tryDeleteBagEquip(rsp.Uid2)
            this.equip2=null
            this.autoSelectEquip2()
            this.refreshTsView()
            if(rsp.BasePros){
                UIMgr.I.resetRoleBasePros(rsp.BasePros)
            }
            UIMgr.I.tip('吞噬成功',ct.green)
        }else{
            UIMgr.I.tip('无法操作')
        }
    }
    protected onEnable(): void {
        this.tab.select(0)
        this.refreshTsView()
    }
    protected onDisable(): void {
        this.resetNull();
        this.infoRich.string=''
    }
}