import { _decorator, Component, error, Label, Node, RichText, Toggle } from 'cc';
import { Tab } from '../UiComps/Tab';
import GD from '../base/GameData';
import { ViewStack } from '../UiComps/ViewStack';
import { BoxMsg, ct } from '../base/types';
import WS from '../base/net';
import { ConfigType, Err, MT } from '../base/MT';
import { UIMgr } from '../managers/UIMgr';
import { LianMaxLvStr } from '../base/consts';
const { ccclass, property } = _decorator;

@ccclass('lianTiView')
export class lianTiView extends Component {
    @property(ViewStack)
    view:ViewStack;
    @property(Tab)
    tab:Tab;
    @property(RichText)
    proRich:RichText;
    @property(Node)
    goldBtn:Node;
    @property(Node)
    activBtn:Node;
    @property(Node)
    diaBtn:Node;
    @property(Node)
    smBtn:Node;
    @property(Node)
    showVipBtn:Node;
    @property(Node)
    showVipInfo:Node;
    @property(Label)
    headLabel:Label;
    @property(Toggle)
    switchTypeLv:Toggle;
    @property(Tab)
    switchTab:Tab;
    @property(Label)
    curLvRate:Label;
    // @property(Label)
    // goldRate:Label;
    // @property(Label)
    // diaRate:Label;
    // @property(Label)
    // smRate:Label;
    @property(Label)
    gold:Label;
    @property(Label)
    dia:Label;
    // @property(Label)
    // sm:Label;
    protected onLoad(): void {
        this.switchTab.selectedHandler=(node,index)=>{
            this.switchTypeLv.isChecked=false;
            const type = this.tab.selectedIndex
            let req=outer_pb.LianTiAct.create()
            req.Type=type;
            let upType:number;
            if(type==0){
                upType=index+1
            }else if(type==1){
                upType=index==0?0:index+1
            }else{
                upType=index;
            }
            req.UpType=upType;
            let buf=outer_pb.LianTiAct.encode(req).finish()
            WS.send(MT.SwitchLianTiType,buf,(d:any)=>{
                let rsp=outer_pb.LianTiAct.decode(d)
                if(rsp.ErrCode==Err.ErrCode_Success){
                    GD.role.LianTiPros=rsp.LTPros;
                    UIMgr.I.resetRoleBasePros(rsp.BasePros)
                    this.show(this.tab.selectedIndex)
                    UIMgr.I.tip('置换成功',ct.green)
                }else{
                    UIMgr.I.tip('置换失败')
                }
            })
        }
        this.switchTypeLv.node.on('toggle',(toggle:Toggle)=>{
            if(toggle.isChecked){
                this.switchTab.select(-1)
                let str:string;
                const t=this.tab.selectedIndex
                if(t==0){
                    str='防御炼体,攻击炼体'
                }else if(t==1){
                    str='生命炼体,攻击炼体'
                }else{
                    str='生命炼体,防御炼体'
                }
                this.switchTab.labels=str
            }
        },this);
        this.showVipBtn.on(Node.EventType.TOUCH_END,()=>{
            const need = GD.configs.get(ConfigType.BuyLianTiVipNeedMuPoint)
            UIMgr.I.PopView.showMsgBox([new BoxMsg(`<br/>每次炼体时所需金币、钻石永久减半<br/><color=${ct.brown}>需要${need}点</><br/><color=${ct.brown}>(送许愿币x${need})</>`,ct.white)],'激活',()=>{this.tryActivLTVip(need)},'取消')
        },this);
        this.activBtn.on(Node.EventType.TOUCH_END,()=>{
            GD.playClickSound();
            if(GD.role.hasEnoughLv(100,false)){
                WS.send(MT.ActiveLianTi,GD.EmptyRequestBuff,(d:any)=>{
                    let rsp = outer_pb.LianTiAct.decode(d)
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        GD.role.LianTiPros = rsp.LTPros
                        this.view.selectedIndex=0
                        this.show(0)
                        UIMgr.I.tip('激活成功',ct.green)
                    }else{
                        UIMgr.I.tip('激活失败')
                    }
                })
            }
        },this);
        this.goldBtn.on(Node.EventType.TOUCH_END,()=>{
            let lv=GD.role.LianTiPros[this.tab.selectedIndex]
            let maxLv = GD.role.data.ZsNum>0 ? 400+GD.role.data.DsLv : GD.role.data.Lv+GD.role.data.DsLv
            if(lv<maxLv){
                let need = GD.configs.get(ConfigType.LianTiBaseNeedGold)+lv*10000
                if(GD.role.data.LtVip){
                    need = need/2>>0
                }
                if(GD.role.hasEnoughGold(need)){
                    this.sendUp(0)
                }
            }else{
                UIMgr.I.tip(LianMaxLvStr)
            }
        },this);
        this.diaBtn.on(Node.EventType.TOUCH_END,()=>{
            let lv=GD.role.LianTiPros[this.tab.selectedIndex]
            let maxLv = GD.role.data.ZsNum>0 ? 400+GD.role.data.DsLv : GD.role.data.Lv+GD.role.data.DsLv
            if(lv<maxLv){
                let need = GD.configs.get(ConfigType.LianTiBaseNeedDia)+lv
                if(GD.role.data.LtVip){
                    need = need/2>>0
                }
                if(GD.role.hasEnoughDia(need)){
                    this.sendUp(1)
                }
            }else{
                UIMgr.I.tip(LianMaxLvStr)
            }
            
        },this);
        this.smBtn.on(Node.EventType.TOUCH_END,()=>{
            let lv=GD.role.LianTiPros[this.tab.selectedIndex]
            let maxLv = GD.role.data.ZsNum>0 ? 400+GD.role.data.DsLv : GD.role.data.Lv+GD.role.data.DsLv
            if(lv<maxLv){
                if(GD.role.hasEnoughItem(625,1)){
                    this.sendUp(2)
                }
            }else{
                UIMgr.I.tip(LianMaxLvStr)
            }
        },this);
        this.tab.selectedHandler=(node:Node,index:number)=>{
            this.switchTypeLv.isChecked=false;
            let lv = GD.role.LianTiPros[index]
            this.headLabel.string = `【${this.h[index]}炼体】 Lv.${lv}`
            let jie = lv/20>>0 //第几阶段（每20级加一个阶段）
            let jie1 = (lv+1)/20>>0
            let str:string='';
            const add1per2 = (lv+1)/2>>0
            const add1 = ((lv+2)/2>>0)-add1per2 //1级开始，每2级加1点
            const add1per4 = (lv+1)/4>>0
            const add2 = ((lv+2)/4>>0)-add1per4 //1级开始，每4级加1点
            if(index==0){
                str+=`最大生命值+${lv} (<color=${ct.green}>+1</>)<br/><color=${ct.gray}>(每1级+1)</><br/><br/>`
                str+=`最大护盾值+${lv*2} (<color=${ct.green}>+2</>)<br/><color=${ct.gray}>(每1级+2)</><br/><br/>`
                str+=`自动恢复生命值+${jie} (<color=${ct.green}>+${jie==jie1?0:jie1}</>)<br/><color=${ct.gray}>(每20级+1)</><br/><br/>`
                str+=`反射怪物伤害值+${lv} (<color=${ct.green}>+1</>)<br/><color=${ct.gray}>(每1级+1)</><br/>`
            }else if(index==1){
                str+=`防御力+${add1per4} (<color=${ct.green}>+${add2}</>)<br/><color=${ct.gray}>(每4级+1)</><br/><br/>`
                str+=`防御成功率+${add1per2} (<color=${ct.green}>+${add1}</>)<br/><color=${ct.gray}>(每2级+1)</><br/><br/>`
                str+=`自动恢复魔法值+${jie} (<color=${ct.green}>+${jie==jie1?0:jie1}</>)<br/><color=${ct.gray}>(每20级+1)</><br/><br/>`
                str+=`受到反射伤害值减少+${lv} (<color=${ct.green}>+1</>)<br/><color=${ct.gray}>(每1级+1)</><br/>`
            }else{
                str+=`最大诅咒力+${add1per4} (<color=${ct.green}>+${add2}</>)<br/><color=${ct.gray}>(每4级+1)</><br/><br/>`
                str+=`最大物理攻击力+${add1per4} (<color=${ct.green}>+${add2}</>)<br/><color=${ct.gray}>(每4级+1)</><br/><br/>`
                str+=`最大魔法攻击力+${add1per4} (<color=${ct.green}>+${add2}</>)<br/><color=${ct.gray}>(每4级+1)</><br/><br/>`
                str+=`攻击成功率+${add1per2} (<color=${ct.green}>+${add1}</>)<br/><color=${ct.gray}>(每2级+1)</><br/>`
            }
            this.proRich.string=str
            // this.activeLabel.string = `(当前生效属性：${this.h[index]})`
            // if(lv>0&&GD.role.LianTiPros[1]!=index){
            //     let req=outer_pb.LianTiAct.create()
            //     req.Type=index;
            //     let buf=outer_pb.LianTiAct.encode(req).finish()
            //     WS.send(MT.SwitchLianTiType,buf,(d:any)=>{
            //         let rsp=outer_pb.LianTiAct.decode(d)
            //         GD.role.LianTiPros[1]=index
            //         UIMgr.I.resetRoleBasePros(rsp.BasePros)
            //     })
            // }
            // this.activeLabel.string = `(当前生效属性：${this.h[type]})`
            let rate = (Math.max(100-(lv/20>>0)*5-lv%10*5,1)*10>>0)/10
            rate += (GD.role.LianTiPros[index+3] + GD.role.LianTiPros[index+6]*2 + GD.role.LianTiPros[index+9]*10)/10;
            this.curLvRate.string = `(升到下一级基础成功率：${rate}%)`
            let needRate = 1
            if(GD.role.data.LtVip){
                needRate=2
            }
            this.gold.string = `（需要：金币x${(GD.configs.get(ConfigType.LianTiBaseNeedGold)/10000+lv)/needRate>>0}万）`
            this.dia.string = `（需要：钻石x${(GD.configs.get(ConfigType.LianTiBaseNeedDia)+lv)/needRate>>0}）`
            GD.playClickSound()
        }
    }
    tryActivLTVip(need:number){
        if(GD.role.hasEnoughMuPoint(need)){
            WS.send(MT.BuyLianTiVip,GD.EmptyRequestBuff,(d:any)=>{
                let rsp=outer_pb.UseItemAct.decode(d)
                if(rsp.ErrCode==Err.ErrCode_Success){
                    GD.role.data.LtVip=true
                    GD.role.reduceMuPoint(need)
                    if(rsp.Items){
                        GD.role.getItems(rsp.Items,true,true)
                    }
                    this.show(0)
                    UIMgr.I.tip('激活成功',ct.green)
                }else{
                    UIMgr.I.tip('激活失败')
                }
            })
        }
    }
    sendUp(upType:number){
        let req=outer_pb.LianTiAct.create()
        req.UpType=upType;
        req.Type=this.tab.selectedIndex
        let buf=outer_pb.LianTiAct.encode(req).finish()
        WS.send(MT.UpLianTi,buf,(d:any)=>{
            let rsp=outer_pb.LianTiAct.decode(d)
            if(rsp.Num>0){
                GD.role.reduceItem(rsp.Id,rsp.Num);
                GD.role.LianTiPros=rsp.LTPros
                this.show(this.tab.selectedIndex)
            }
            if(rsp.ErrCode==Err.ErrCode_Success){
                UIMgr.I.resetRoleBasePros(rsp.BasePros)
                UIMgr.I.tip('升级成功',ct.green)
            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughItem){
                UIMgr.I.tip('道具不足')
            }else{
                UIMgr.I.tip('升级失败')
            }
        })
    }
    //索引0的值表示炼体等级，索引1的值表示当前选择的炼体模式(默认为0)，索引2的值表示金币升级失败次数，索引3的值表示钻石升级失败次数，索引4的值表示神石升级失败次数
    protected onEnable(): void {
        if((GD.role.data.Lv+GD.role.data.ZsNum*400)<100&&GD.role.data.ZsNum==0){
            this.view.selectedIndex=1
            this.activBtn.active=false
        }else {
            if(GD.role.LianTiPros.length>0){
                this.view.selectedIndex=0
                this.show(0)
            }else{
                this.activBtn.active=true
                this.view.selectedIndex=1
            }
        }
    }
    h:Array<string>=['生命','防御','攻击']
    show(type:number){
        this.tab.select(type)
        this.showVipBtn.active=!GD.role.data.LtVip;
        this.showVipInfo.active=GD.role.data.LtVip;
        
    }
    protected onDisable(): void {
        this.proRich.string=''
    }
}


