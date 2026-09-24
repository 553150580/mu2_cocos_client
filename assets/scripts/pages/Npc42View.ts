import { _decorator, Component, Label, Node, RichText } from 'cc';
import { Tab } from '../UiComps/Tab';
import GD from '../base/GameData';
import {  ct, ShopItem } from '../base/types';
import { UIMgr } from '../managers/UIMgr';
import { ShowItemType } from './PopView';
import WS from '../base/net';
import { Err, MT } from '../base/MT';
import Tools from '../base/tools';
const { ccclass, property } = _decorator;

//驯兽师
@ccclass('Npc42View')
export class Npc42View extends Component {
    @property(Tab)
    tab:Tab;
    @property(Label)
    head:Label;
    @property(RichText)
    need:RichText;
    @property(Node)
    buyBtn:Node;
    @property(RichText)
    infoRich:RichText;
    @property(Label)
    info0:Label;
    
    // buffTypes:Array<string>; 
    needDias:Array<number>=[168,120,480,1200]
    static I:Npc42View
    protected onLoad(): void {
        Npc42View.I=this;
        // this.buffTypes=this.tab.labels.split(',')
        this.tab.selectedHandler=(node:Node,index:number)=>{
            this.head.string=`【${UIMgr.I.buffTypes[index]}】` 
            this.refreshInfoRich()
            GD.playClickSound();
        }
        this.buyBtn.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.ResetDayData.MainQuest.TaskId<4){
                UIMgr.I.tip('暂时无法领取，请先找老兵')
                return
            }
            const type=this.tab.selectedIndex
            const bp=GD.role.basePros
            if(type<bp.Type&&bp.Time>0){
                UIMgr.I.tip('更好的增益生效中，无法替换')
                return
            }
            if(type==bp.Type&&type<3&&bp.Time>=60*60*24){
                UIMgr.I.tip('已有同类型增益时长大于24小时，无法继续购买')
                return
            }
            if(type<2&&GD.role.hasEnoughLv(80,false)==false){
                this.doBuy(1)
            }else{
                let msg=`【${UIMgr.I.buffTypes[type]}】24小时`
                let item = new ShopItem()
                item.Price=this.needDias[type]
                item.PriceType=2
                let max=GD.role.data.Dia/item.Price>>0
                if(type!=3){
                    max=Math.min(max,3)
                }
                UIMgr.I.PopView.showSliderBox(msg,ct.purple,max,'确 定',this.doBuy,item)
            }
        })
    }
    refreshInfoRich(){
        const type=this.tab.selectedIndex
        let bp = GD.role.basePros
        let pros:string
        if(bp.Time>0&&bp.Type==type){
            if(bp.IsDia){
                pros=`<color=${ct.green}>剩余时长：${Tools.getDeltaTimeString(bp.Time)}</><br/>`
            }else{
                pros=`<color=${ct.green}>已生效：80级后失效</><br/>`
            }
        }else{
            pros=`<color=${ct.red}>已过期</><br/>`
        }
        if(type==0){
            pros+='最小攻击力+20<br/>'
            pros+='最大攻击力+20<br/>'
        }else if(type==1){
            pros+='防御力+30<br/>'
            pros+='最大生命值+100<br/>'
        }else{
            pros+='防御力+30<br/>'
            pros+='最大生命值+100<br/>'
            pros+='最小攻击力+20<br/>'
            pros+='最大攻击力+20<br/>'
            if(type==2){
                pros+=`<color=${ct.yellow}>杀怪、泡点、任务获得经验提升+10%</>`
            }else if(type==3){
                pros+=`<color=${ct.purple}>所有元素攻击力+50</><br/>`
                pros+=`<color=${ct.purple}>所有元素伤害提升+20%</><br/>`
                pros+=`<color=${ct.yellow}>杀怪、泡点、任务获得经验提升+20%</>`
            }
        }
        let needStr:string
        let info:string
        let infoColor:ct=ct.white
        if(type>1||GD.role.hasEnoughLv(80,false)){
            needStr = `需要：<color=${ct.qing}>${this.needDias[type]}钻石</>/24小时`
            info = '每次领取均为24小时，领取多次可累积时长（0转80级之前不扣时长）'
            infoColor=ct.brown
        }else{
            needStr = `<color=${ct.green}>0转80级前免费</>`
            info = '(0转80级前可免费领取，领取后一直有效，0转80级后自动失效)'
        }
        this.info0.string=info
        this.info0.color.fromHEX(infoColor)
        this.need.string=needStr;
        this.infoRich.string=pros;
    }
    doBuy=(num:number=1)=>{
        let req=outer_pb.DiaBuffAct.create()
        req.Type=this.tab.selectedIndex
        req.Num=num
        // console.log('doBuyBuff',req)
        let buf=outer_pb.DiaBuffAct.encode(req).finish()
        WS.send(MT.BuyDiaBuff,buf,this.onBuy)
    }
    onBuy=(d:any)=>{
        let rsp=outer_pb.DiaBuffAct.decode(d)
        // console.log('onBuyBuff',rsp)
        if(rsp.ErrCode==Err.ErrCode_Success){
            if(rsp.Num>0){
                GD.role.addDia(rsp.Num,true,'退回')
            }
            if(rsp.NeedDia>0){
                GD.role.reduceDia(rsp.NeedDia)
            }
            if(rsp.BasePros){
                UIMgr.I.resetRoleBasePros(rsp.BasePros)
            }else{
                let bp=GD.role.basePros
                bp.Type=rsp.Type
                bp.Time=rsp.Time
                bp.IsDia=rsp.IsDia
            }
            this.refreshInfoRich();
            UIMgr.I.updateBuffTime();
            UIMgr.I.tip('领取成功',ct.green)
        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughDia){
            UIMgr.I.tip('领取失败，钻石不足')
        }else{
            UIMgr.I.tip('领取失败'+rsp.ErrCode)
        }
    }
    protected onEnable(): void {
        this.tab.select(GD.role.basePros.Type)
    }
    protected onDisable(): void {
        this.infoRich.string=''
    }
}