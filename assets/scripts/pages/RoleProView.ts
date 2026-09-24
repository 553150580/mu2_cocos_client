import { _decorator, Component, EventTouch, Label, math, Node, RichText, Widget } from 'cc';
import { List } from '../UiComps/List';
import GD from '../base/GameData';
import WS from '../base/net';
import { ConfigType, Err, MT } from '../base/MT';
import { ct, RoleType, RoleTypeLvStr, YsColors, YsTypeString } from '../base/types';
import { UIMgr } from '../managers/UIMgr';
import { ShowItemType } from './PopView';
import GameManager from '../managers/GameManager';
import Tools from '../base/tools';
import { Tab } from '../UiComps/Tab';
const { ccclass, property } = _decorator;

@ccclass('RoleProView')
export class RoleProView extends Component {
    @property(Label)
    level:Label
    @property(Label)
    free:Label
    @property(Label)
    exp:Label
    @property(Label)
    gs:Label
    @property(Label)
    ag:Label
    @property(Label)
    sd:Label
    @property(Label)
    redPoint:Label
    @property(Label)
    hudun:Label
    // @property(Node)
    // moreProBtn:Node

    @property(RichText)
    LL:RichText
    @property(Node)
    addLLBtn:Node
    @property(Node)
    reduceLLBtn:Node
    @property(RichText)
    atk:RichText
    @property(RichText)
    atkRate:RichText
    @property(RichText)
    pvpAtk:RichText
    @property(RichText)
    pvpAtkRate:RichText

    @property(RichText)
    MJ:RichText
    @property(Node)
    addMJBtn:Node
    @property(Node)
    reduceMJBtn:Node
    @property(RichText)
    def:RichText
    @property(RichText)
    defRate:RichText
    @property(RichText)
    pvpDef:RichText
    @property(RichText)
    pvpDefRate:RichText
    @property(RichText)
    speed:RichText

    @property(Tab)
    addTab:Tab

    @property(RichText)
    TL:RichText
    @property(Node)
    addTLBtn:Node
    @property(Node)
    reduceTLBtn:Node
    @property(RichText)
    hp:RichText

    @property(RichText)
    ZL:RichText
    @property(Node)
    addZLBtn:Node
    @property(Node)
    reduceZLBtn:Node
    @property(RichText)
    mp:RichText
    @property(RichText)
    zlAtk1:RichText
    @property(RichText)
    zlPvPAtk1:RichText
    @property(RichText)
    zlAtk2:RichText
    @property(RichText)
    zlPvPAtk2:RichText
    @property(RichText)
    zzAtkUp:RichText
    @property(RichText)
    zzAtkUp1:RichText

    @property(Node)
    TSNode:Node
    @property(RichText)
    TS:RichText
    @property(Node)
    addTSBtn:Node
    @property(Node)
    reduceTSBtn:Node
    @property(RichText)
    ysProRich0:RichText
    @property(RichText)
    ysProRich1:RichText
    @property(RichText)
    ysProRich2:RichText

    @property(Label)
    roleType:Label
    @property(Node)
    addPointOkBtn:Node
    @property(Node)
    resetPointBtn:Node

    addLL:number=0;
    addMJ:number=0;
    addTL:number=0;
    addZL:number=0;
    addTS:number=0;
    freePoint:number=0;
    // tempPros:outer_pb.IGetBasePros;
    protected update(dt: number): void {
        this.reduceLLBtn.active=this.addLL>0;
        this.reduceMJBtn.active=this.addMJ>0;
        this.reduceTLBtn.active=this.addTL>0;
        this.reduceZLBtn.active=this.addZL>0;
        this.reduceTSBtn.active=this.addTS>0;
        this.addTab.node.active =this.addLLBtn.active=this.addTLBtn.active=this.addMJBtn.active=this.addZLBtn.active=this.addTSBtn.active = this.freePoint>0
        this.addPointOkBtn.active= this.addLL>0||this.addMJ>0||this.addTL>0||this.addZL>0||this.addTS>0;
        if(this.hasSchedule&&this.freePoint<=0){
            this.unscheduleAllCallbacks()
        }
    }
    hasSchedule:boolean=false
    onAddLL=()=>{
        let num=1
        let n = this.addTab.selectedIndex;
        if(n==1){
            num=10
        }else if(n==2){
            num=50
        }
        if(this.freePoint-num>=0){
            this.freePoint-=num;
            this.addLL+=num;
            this.refreshAddTempResult()
        }
    }
    addManyLL=()=>{
        this.schedule(this.onAddLL,0.05)
    }
    onAddMj=()=>{
        let num=1
        let n = this.addTab.selectedIndex;
        if(n==1){
            num=10
        }else if(n==2){
            num=50
        }
        if(this.freePoint-num>=0){
            num = num>>0;
            this.freePoint-=num;
            this.addMJ+=num;
            this.refreshAddTempResult()
        }
    }
    addManyMJ=()=>{
        this.schedule(this.onAddMj,0.05)
    }
    onAddTL=()=>{
        let num=1
        let n = this.addTab.selectedIndex;
        if(n==1){
            num=10
        }else if(n==2){
            num=50
        }
        if(this.freePoint-num>=0){
            this.freePoint-=num;
            this.addTL+=num;
            this.refreshAddTempResult()
        }
    }
    addManyTL=()=>{
        this.schedule(this.onAddTL,0.05)
    }
    onAddZL=()=>{
        let num=1
        let n = this.addTab.selectedIndex;
        if(n==1){
            num=10
        }else if(n==2){
            num=50
        }
        if(this.freePoint-num>=0){
            this.freePoint-=num;
            this.addZL+=num;
            this.refreshAddTempResult()
        }
    }
    addManyZL=()=>{
        this.schedule(this.onAddZL,0.05)
    }
    onAddTS=()=>{
        let num=1
        let n = this.addTab.selectedIndex;
        if(n==1){
            num=10
        }else if(n==2){
            num=50
        }
        if(this.freePoint-num>=0){
            this.freePoint-=num;
            this.addTS+=num;
            this.refreshAddTempResult()
        }
    }
    addManyTS=()=>{
        this.schedule(this.onAddTS,0.05)
    }
    protected onLoad(): void {
        this.addTab.selectedHandler=(node,index)=>{
            GD.playClickSound();
        }
        this.addTab.select(0)
        // this.moreProBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
        //     WS.send(MT.GetMorePros,GD.EmptyRequestBuff,(d:any)=>{
        //         let data=0
        //         let msg='1111'
        //         UIMgr.I.PopView.showHelpBox(msg)
        //     })
        // },this);
        this.addLLBtn.on(Node.EventType.TOUCH_START,(event:EventTouch)=>{
            this.hasSchedule=true;
            this.scheduleOnce(this.addManyLL,1)
            GD.playClickSound();
        },this);
        this.addLLBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.onAddLL();
            this.unscheduleAllCallbacks();
        },this);
        this.addMJBtn.on(Node.EventType.TOUCH_START,(event:EventTouch)=>{
            this.hasSchedule=true;
            this.scheduleOnce(this.addManyMJ,1)
            GD.playClickSound();
        },this);
        this.addMJBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.onAddMj();
            this.unscheduleAllCallbacks();
        },this);
        this.addTLBtn.on(Node.EventType.TOUCH_START,(event:EventTouch)=>{
            this.hasSchedule=true;
            this.scheduleOnce(this.addManyTL,1)
            GD.playClickSound();
        },this);
        this.addTLBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.onAddTL();
            this.unscheduleAllCallbacks();
        },this);
        this.addZLBtn.on(Node.EventType.TOUCH_START,(event:EventTouch)=>{
            this.hasSchedule=true;
            this.scheduleOnce(this.addManyZL,1)
            GD.playClickSound();
        },this);
        this.addZLBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.onAddZL();
            this.unscheduleAllCallbacks();
        },this);
        this.addTSBtn.on(Node.EventType.TOUCH_START,(event:EventTouch)=>{
            this.hasSchedule=true;
            this.scheduleOnce(this.addManyTS,1)
            GD.playClickSound();
        },this);
        this.addTSBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.onAddTS();
            this.unscheduleAllCallbacks();
        },this);
        this.reduceLLBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            let num=1
            let n = this.addTab.selectedIndex;
            if(n==1){
                num=10
            }else if(n==2){
                num=50
            }
            if(this.addLL-num>=0){
                this.addLL-=num;
                this.freePoint+=num;
                this.refreshAddTempResult()
                GD.playClickSound();
            }
        },this);
        this.reduceMJBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            let num=1
            let n = this.addTab.selectedIndex;
            if(n==1){
                num=10
            }else if(n==2){
                num=50
            }
            if(this.addMJ-num>=0){
                this.addMJ-=num;
                this.freePoint+=num;
                this.refreshAddTempResult()
                GD.playClickSound();
            }
        },this);
        this.reduceTLBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            let num=1
            let n = this.addTab.selectedIndex;
            if(n==1){
                num=10
            }else if(n==2){
                num=50
            }
            if(this.addTL-num>=0){
                this.addTL-=num;
                this.freePoint+=num;
                this.refreshAddTempResult()
                GD.playClickSound();
            }
        },this);
        this.reduceZLBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            let num=1
            let n = this.addTab.selectedIndex;
            if(n==1){
                num=10
            }else if(n==2){
                num=50
            }
            if(this.addZL-num>=0){
                this.addZL-=num;
                this.freePoint+=num;
                this.refreshAddTempResult()
                GD.playClickSound();
            }
        },this);
        this.reduceTSBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            let num=1
            let n = this.addTab.selectedIndex;
            if(n==1){
                num=10
            }else if(n==2){
                num=50
            }
            if(this.addTS-num>=0){
                this.addTS-=num;
                this.freePoint+=num;
                this.refreshAddTempResult()
                GD.playClickSound();
            }
        },this);
        this.addPointOkBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            if(this.addLL>0||this.addMJ>0||this.addTL>0||this.addZL>0||this.addTS>0){
                let req = outer_pb.AddPoint.create();
                req.AddLL=this.addLL;
                req.AddMJ=this.addMJ;
                req.AddTL=this.addTL;
                req.AddZL=this.addZL;
                req.AddTS=this.addTS;
                let buff = outer_pb.AddPoint.encode(req).finish();
                WS.send(MT.AddPoint,buff,this.onAddPoint)
                this.unscheduleAllCallbacks();
            }
        },this);
        this.resetPointBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            const freeLv=GD.configs.get(ConfigType.ResetPointFreeLv);
            let str:string=`<size=26><color=${ct.brown}>重置属性点</></size><br/><br/><color=${ct.brown}>${freeLv}级以前免费，${freeLv}级后${GD.configs.get(ConfigType.ResetPointNeedDia)}钻石/次</><br/><br/>`
            UIMgr.I.PopView.show(0,str,false,ShowItemType.Msg,'重置',this.sendReset)
        },this);
    }
    sendReset=(d:any)=>{
        if(GD.role.hasEnoughLv(GD.configs.get(ConfigType.ResetPointFreeLv),false) && GD.role.data.Dia<GD.configs.get(ConfigType.ResetPointNeedDia)){
            UIMgr.I.tip('钻石不足')
        }else{
            WS.send(MT.ResetPoint,GD.EmptyRequestBuff,this.onResetPoint)
        }
    }
    protected onEnable(): void {
        this.reduceLLBtn.active=this.reduceMJBtn.active=this.reduceTLBtn.active=this.reduceZLBtn.active=this.reduceTSBtn.active=false;
        this.TSNode.active = GD.role.data.RoleType==RoleType.SDS;
        WS.send(MT.GetBasePros,GD.EmptyRequestBuff,(d:any)=>{
            let pro=outer_pb.BasePros.decode(d)
            GD.role.basePros=pro
            this.roleType.string = RoleTypeLvStr[Math.log2(GD.role.data.RoleType)][pro.RoleTypeLv];
            this.freePoint=pro.FreePoint||0;
            GD.role.tempPros = outer_pb.BasePros.create(pro)
            GD.role.caculateAddPro(pro);//计算addPros和新的speed
            this.refreshProLabels()
        })
    }
    protected onDisable(): void {
        this.addLL=this.addMJ=this.addTL=this.addZL=this.addTS=this.freePoint=0;
        GD.role.recaculateTempPros(0,0,0,0,0);//恢复数值
        this.unscheduleAllCallbacks();
    }
    refreshAddTempResult(){
        this.refreshFreePoint();
        GD.role.recaculateTempPros(this.addLL,this.addMJ,this.addTL,this.addZL,this.addTS);
        this.refreshProLabels(false);
    }
    onAddPoint=(d:any)=>{
        let rsp=outer_pb.AddPoint.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            this.setPoint(rsp)
            // if(rsp.BasePros){
            //     rsp.BasePros.Skills.forEach(id=>{
            //         let skill = GD.role.skills.get(id)
            //         if(skill){
            //             skill.canUse=true;
            //         }
            //     })
            //     UIMgr.I.resetAllSkillSlotSkin();
            // }
            GameManager.I.playClickSound();
        }else{
            UIMgr.I.tip('加点失败')
        }
    }
    onResetPoint=(d:any)=>{
        let rsp=outer_pb.AddPoint.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            this.setPoint(rsp)
            // if(rsp.SetSkills.length>0){
            //     rsp.BasePros.Skills.forEach(id=>{
            //         let skill = GD.role.skills.get(id)
            //         if(skill){
            //             skill.canUse=false;
            //         }
            //     })
            //     UIMgr.I.resetAllSkillSlotSkin();
            // }
            if(rsp.Dia>0){
                GD.role.reduceDia(rsp.Dia)
            }
            UIMgr.I.tip('重置属性点成功',ct.green)
        }else{
            UIMgr.I.tip('重置属性点失败')
        }
    }
    setPoint=(rsp:outer_pb.AddPoint)=>{
        this.addLL=this.addMJ=this.addTL=this.addZL=this.addTS=0;
        this.setPro(rsp.BasePros);
    }
    refreshFreePoint(){
        this.free.string=`可分配点数：${this.freePoint}`
    }
    setPro(rsp:outer_pb.IBasePros){
        UIMgr.I.resetRoleBasePros(rsp)
        this.freePoint=rsp.FreePoint||0;
        this.refreshProLabels();
        GD.player.updateAllEquipUI(GD.role.BodyEquips,GD.role.data.RoleType,false);
    }
    refreshProLabels(refreshYsPros:boolean=true){
        let data = GD.role.data;
        let rsp = GD.role.tempPros;
        this.level.string=`等级：${Tools.getLvStr(data)}`
        const rp=GD.role.basePros.RedPoint;
        let color = ct.white
        if(rp>=GD.configs.get(ConfigType.RedNameRedPointNum)){
            color=ct.red
        }else if(rp>0){
            color=ct.brown
        }else if(rp<0){
            color=ct.blue
        }
        this.redPoint.string=`善恶值：${rp}`
        this.redPoint.color.fromHEX(color)
        this.hudun.string=`保护盾：${Tools.getRemainTimeString(GD.role.basePros.HuDunTime)}`
        this.refreshFreePoint();
        this.exp.string=`经验值：${data.Exp.toLocaleString()} / ${data.MaxExp.toLocaleString()}`
        this.gs.string=`果实点数：${(rsp.GsPoint?rsp.GsPoint:0)} / ${data.ZsNum>0?400+data.DsLv:data.Lv+data.DsLv}`
        this.ag.string=`最大技能值(AG)：${rsp.MaxAg>>0}(+${Math.round(rsp.MaxAgUp*1000)/10}%)`
        this.sd.string=`最大护盾值(SD)：${rsp.MaxSd>>0}(+${Math.round(rsp.MaxSdUp*1000)/10}%)`

        let addPro = rsp.AllLL-rsp.LL>0?`<color=${ct.blue}>+${rsp.AllLL-rsp.LL}</>`:'' //附加的属性点
        this.LL.string=`${rsp.LL}${addPro}<color=${ct.green}>${this.addLL?'+'+this.addLL:''}</>`//(data.LL+this.addLL).toString()
        let maxAtkUp = `(<color=${ct.red}>+${Math.round(rsp.MaxAtkUp*1000)/10}%</>)`
        this.atk.string=`物理攻击力：${rsp.MinAtk>>0}~${rsp.MaxAtk>>0}${maxAtkUp}`
        this.atkRate.string=`攻击成功率：${rsp.AtkRate>>0}(<color=${ct.red}>+${Math.round(rsp.AtkRateUp*1000)/10}%</>)`
        this.pvpAtk.string=`附加PvP物理攻击力：${rsp.AddPvPAtk>>0}`
        this.pvpAtkRate.string=`附加PvP攻击成功率：${rsp.AddPvPAtkRate>>0}`

        addPro = rsp.AllMJ-rsp.MJ>0?`<color=${ct.blue}>+${rsp.AllMJ-rsp.MJ}</>`:'' //附加的属性点
        this.MJ.string=`${rsp.MJ}${addPro}<color=${ct.green}>${this.addMJ?'+'+this.addMJ:''}</>`//(data.MJ+this.addMJ).toString();
        this.def.string=`防御力：(${rsp.Def>>0}<color=${ct.blue}>+${rsp.TaoDef>>0}</>)(<color=${ct.red}>+${Math.round(rsp.DefUp*1000)/10}%</>)`
        this.defRate.string=`防御成功率：(${rsp.DefRate>>0}<color=${ct.blue}>+${rsp.TaoDefRate>>0}</>)(<color=${ct.red}>+${Math.round(rsp.DefRateUp*1000)/10}%</>)`
        this.pvpDef.string=`附加PvP防御力：<color=${ct.purple}>${rsp.AddPvPDef>>0}</>`
        this.pvpDefRate.string=`附加PvP防御成功率：<color=${ct.purple}>${rsp.AddPvPDefRate>>0}</>`
        
        let defaultAtkCd = GD.configs.get(ConfigType.DefaultAtkCd) //1.8
        // let speedAddCd = GD.configs.get(ConfigType.PlayerMinAtkCd) //0.0032
        //公共攻击CD
        let atkCd = Tools.calAtkCd(GD.role.tempSpeed) //Math.min(defaultAtkCd-0.2, GD.role.tempSpeed*speedAddCd)
        // let reduceSkillCd = ((defaultAtkCd-reduceCd)*1000>>0)/1000; //1.8-reduceCd
        this.speed.string=`攻击速度：<color=${ct.purple}>${GD.role.tempSpeed>>0}</>（技能CD减少<color=${ct.brown}>${((defaultAtkCd-atkCd)*10000>>0)/10000}</>秒，攻击间隔<color=${ct.green}>${(atkCd*10000>>0)/10000}</>秒）`

        addPro = rsp.AllTL-rsp.TL>0?`<color=${ct.blue}>+${rsp.AllTL-rsp.TL}</>`:'' //附加的属性点
        this.TL.string=`${rsp.TL}${addPro}<color=${ct.green}>${this.addTL?'+'+this.addTL:''}</>`//(data.TL+this.addTL).toString()
        this.hp.string=`最大生命值(HP)：${rsp.MaxHp>>0}(<color=${ct.red}>+${Math.round(rsp.MaxHpUp*1000)/10}%</>)`

        addPro = rsp.AllZL-rsp.ZL>0?`<color=${ct.blue}>+${rsp.AllZL-rsp.ZL}</>`:'' //附加的属性点
        this.ZL.string=`${rsp.ZL}${addPro}<color=${ct.green}>${this.addZL?'+'+this.addZL:''}</>`//(data.ZL+this.addZL).toString()
        this.mp.string=`最大魔法值(MP)：${rsp.MaxMp>>0}(<color=${ct.red}>+${Math.round(rsp.MaxMpUp*1000)/10}%</>)`
        // this.zlAtk2.string=`诅咒力：${rsp.MinZzAtk*(1+rsp.BaseAtkUp)>>0}~${rsp.MaxZzAtk*(1+rsp.BaseAtkUp)>>0}`
        // this.zlPvPAtk2.string=`PvP诅咒力：${(rsp.MinZzAtk+rsp.AddPvPAtk)*(1+rsp.BaseAtkUp)>>0}~${(rsp.MaxZzAtk+rsp.AddPvPAtk)*(1+rsp.BaseAtkUp)>>0}`
        const minMagicAtk = (rsp.MinMagicAtk+rsp.MaxMagicAtk*rsp.MinMagicAtkUp)>>0;
        let magicAtk =`魔法攻击力：${minMagicAtk}~${rsp.MaxMagicAtk>>0}${maxAtkUp}`
        let PvPmagicAtk=`附加PvP魔法攻击力：<color=${ct.purple}>${rsp.AddPvPAtk>>0}</>`
        let atkUp=`物理技能攻击力提升：${rsp.AtkUp*100>>0}%`
        let magicUp=`魔法技能攻击力提升：${Math.round(rsp.MagicAtkUp*1000)/10}%`
        this.zzAtkUp.string=''
        this.zzAtkUp1.string=''
        if(data.RoleType==1||data.RoleType==4||data.RoleType==16){
            this.zlAtk1.string=atkUp
            this.zlPvPAtk1.string=''
            this.zlAtk2.string=''
            this.zlPvPAtk2.string=''
        }else if(data.RoleType==2){
            this.zlAtk1.string=magicAtk
            this.zlPvPAtk1.string=PvPmagicAtk
            this.zlAtk2.string=magicUp
            this.zlPvPAtk2.string=''
        }else if(data.RoleType==8){
            this.zlAtk1.string=magicAtk
            this.zlPvPAtk1.string=PvPmagicAtk
            this.zlAtk2.string=magicUp
            this.zlPvPAtk2.string=atkUp
        }else if(data.RoleType==32){
            this.zlAtk1.string=magicAtk
            this.zlPvPAtk1.string=PvPmagicAtk
            this.zlAtk2.string=`诅咒力：${rsp.MinZzAtk>>0}~${rsp.MaxZzAtk>>0}${maxAtkUp}`
            this.zlPvPAtk2.string=`附加PvP诅咒力：<color=${ct.purple}>${rsp.AddPvPAtk>>0}</>`
            this.zzAtkUp.string=magicUp
            this.zzAtkUp1.string=`诅咒技能攻击力提升：${Math.round(rsp.ZzAtkUp*1000)/10}%`
        }

        addPro = rsp.AllTS-rsp.TS>0?`<color=${ct.blue}>+${rsp.AllTS-rsp.TS}</>`:'' //附加的属性点
        this.TS.string=`${rsp.TS}${addPro}<color=${ct.green}>${this.addTS?'+'+this.addTS:''}</>`//(data.TS+this.addTS).toString()
        //元素
        if(refreshYsPros){
            let ys:string=''
            let atkStr:string=''
            let defStr:string=''
            YsTypeString.forEach((s,i)=>{
                if(i>0){
                    let num0=rsp.YsPros[i]
                    let atk = rsp.YsAtks[i]
                    let def = rsp.YsDefs[i]
                    let pre=`<color=${YsColors[i]}>${s}`
                    ys+=`${pre}元素：${num0?num0:0}</><br/>`
                    atkStr+=`${pre}攻击力：${atk?atk>>0:0}</><br/>`
                    defStr+=`${pre}防御力：${def?def>>0:0}</><br/>`
                }
            })
            this.ysProRich0.string=ys
            this.ysProRich1.string=atkStr
            this.ysProRich2.string=defStr
            // this.ysProRich.node.parent.getComponent(Widget).top = GD.role.data.RoleType==RoleType.SDS?1075:1035;
        }
    }
    // getNumStrByLen(num:number,len:number):string{
    //     let str=num+''
    //     console.log(1,str,str.length)
    //     if(str.length<len){
    //         for(let i=str.length;i<=len;i++){
    //             str=`${str}-`
    //         }
    //     }
    //     console.log(2,str,str.length)
    //     return str
    // }
}


