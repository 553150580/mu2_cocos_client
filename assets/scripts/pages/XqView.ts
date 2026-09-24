import { _decorator, Component, Label, Node, RichText, Sprite, SpriteFrame, Toggle } from 'cc';
import { ViewStack } from '../UiComps/ViewStack';
import GD from '../base/GameData';
import WS from '../base/net';
import { Err, MT } from '../base/MT';
import { UIMgr } from '../managers/UIMgr';
import { BodyType, ct, Item, RoleType } from '../base/types';
import Tools from '../base/tools';
import { ShowItemType } from './PopView';
const { ccclass, property } = _decorator;

@ccclass('XqView')
export class XqView extends Component {
    @property(ViewStack)
    view:ViewStack;
    @property(Node)
    activeBtn:Node;
    @property(Label)
    groupPro1:Label;
    @property(Label)
    groupPro2:Label;
    @property(Label)
    allTypes:Label;
    @property(Node)
    bodyBox:Node;
    @property(Node)
    infoBox:Node;
    @property(Label)
    curType:Label;
    @property(Label)
    need:Label;
    @property(Node)
    xqOnBtn:Node;
    @property(Node)
    xqOffBtn:Node;
    @property(Node)
    xqUpBtn:Node;
    @property(Node)
    proBox:Node;
    @property(Label)
    luckyPro:Label;

    selectedBodyNode:Node;
    selectedBodyType:number;
    selectedProNode:Node;
    selectedProIndex:number;

    protected onEnable(): void {
        let show = GD.role.hasEnoughLv(280,false)
        if(show&&GD.role.XqPros[1]!=null){
            this.view.selectedIndex=0;
            this.infoBox.active=false;
            if(this.selectedBodyNode)this.selectedBodyNode.children[0].active=false;
            this.selectedBodyNode=null;
            this.renderBody();
        }else{
            this.view.selectedIndex=1;
            this.activeBtn.active=show
        }
    }
    protected onLoad(): void {
        this.activeBtn.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.hasEnoughLv(280)){
                WS.send(MT.ActiveXiangQian,GD.EmptyRequestBuff,(d:any)=>{
                    let rsp = outer_pb.XqAct.decode(d)
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        GD.role.XqPros=rsp.XqPros
                        this.view.selectedIndex=0
                        this.infoBox.active=false;
                        this.renderBody();
                        UIMgr.I.tip('激活成功',ct.green)
                    }else{
                        UIMgr.I.tip('激活失败')
                    }
                })
            }
        })
        this.bodyBox.children.forEach((node:Node,index:number)=>{
            node.on(Node.EventType.TOUCH_END,()=>{
                if(this.selectedBodyNode)this.selectedBodyNode.children[0].active=false;
                this.selectedBodyNode = node;
                node.children[0].active=true;
                this.selectedBodyType=index+1;
                this.infoBox.active=true;
                if(this.selectedProNode)this.selectedProNode.children[0].active=false;
                this.selectedProNode = null;
                this.renderCellPros(this.selectedBodyType)
                GD.playClickSound()
            })
        })
        this.proBox.children.forEach((node:Node,index:number)=>{
            node.on(Node.EventType.TOUCH_END,()=>{
                if(this.selectedProNode)this.selectedProNode.children[0].active=false;
                this.selectedProNode = node;
                node.children[0].active=true;
                this.selectedProIndex=index;
                this.refreshNeed()
                GD.playClickSound()
            })
        })
        this.xqOnBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.selectedBodyType>0&&this.selectedProNode){
                let pros = GD.role.XqPros[this.selectedBodyType]
                if(pros){
                    let p = pros.XqPros[this.selectedProIndex]
                    if(p){
                        UIMgr.I.tip('该孔已镶嵌')
                        return
                    }
                }
                UIMgr.I.PopView.showBagItemByFilter(this.bagItemselectedHandler,this.bagItemFilter)
            }else{
                UIMgr.I.tip('请先点击选择一个镶宝孔')
            }
        })
        this.xqOffBtn.on(Node.EventType.TOUCH_END,()=>{
            this.xqActOffOrUp(MT.XiangQianOff,this.onXiangQianOff)
        })
        this.xqUpBtn.on(Node.EventType.TOUCH_END,()=>{
            this.xqActOffOrUp(MT.XiangQianUp,this.onXiangQianUp)
        })
    }
    refreshNeed(){
        if(this.selectedBodyType>0){
            let str=''
            let pros = GD.role.XqPros[this.selectedBodyType]
            if(pros){
                let p = pros.XqPros[this.selectedProIndex]
                if(p){
                    if(p.Lv<10){
                        let base = GD.ItemBaseDatas.get(p.YgType)
                        str=`需要：${base.Name} x${p.Lv+1}` //p.Lv*(p.Lv+1)
                    }else{
                        str='已满级'
                    }
                }
            }
            this.need.string=str
        }
    }
    bagItemFilter = (item:Item)=>{
        let id = item.Id
        if(id<711||id>765) return false;
        let can:boolean=true
        let bodyType=this.selectedBodyType
        if(bodyType==BodyType.LeftHand||bodyType==BodyType.Neck||bodyType==BodyType.Wing){
            //主手、项链、翅膀只能镶嵌武器类型荧光宝石
            can = id < 741
        }else if(bodyType==BodyType.RightHand){
            //副手
            let roleType = GD.role.data.RoleType
            if (id < 741 && roleType != RoleType.ZS && roleType != RoleType.GJS && roleType != RoleType.MJS && roleType != RoleType.ZHS) {
                //战士、魔剑士、弓箭手才能在副手上镶嵌武器类型
                can = false
            }else{
                let pros = GD.role.XqPros[BodyType.RightHand]
                if(pros){
                    for(let i in pros.XqPros){
                        let p = pros.XqPros[i]
                        if(p.YgType>0 && ((p.YgType < 741 && id >= 741) || (p.YgType >= 741 && id < 741))){
                            //副手只能武器类型、防具类型二者选一，不能混合镶嵌
                            can = false
                            break
                        }
                    }
                }
            }
        }else if(id<741){
            //其它部位只能镶嵌防具类型
            can = false
        }
        if(can){
            let pros = GD.role.XqPros[bodyType]
            if(pros){
                for(let i in pros.XqPros){
                    let p = pros.XqPros[i]
                    if(p.YgType==id){
                        //不能重复镶嵌
                        can = false
                        break
                    }
                }
            }
        }
        return can
    }
    bagItemselectedHandler = (node:Node,index:number,self:any)=>{
        self.hide()
        let data:Item =self.bagList.array[index]
        UIMgr.I.PopView.show(0,data,false,ShowItemType.Item,'镶嵌',this.doXiangQianOn,()=>{
            UIMgr.I.PopView.showBagItemByFilter(this.bagItemselectedHandler,this.bagItemFilter)
        })
    }
    doXiangQianOn=(d:any)=>{
        let req=outer_pb.XqAct.create()
        req.BodyType=this.selectedBodyType
        req.XqIndex=this.selectedProIndex
        req.Id=d.Id
        let buf=outer_pb.XqAct.encode(req).finish()
        WS.send(MT.XiangQianOn,buf,this.onXiangQianOn)
    }
    xqActOffOrUp(type:MT,cb:(d:any)=>void){
        if(this.selectedBodyType>0&&this.selectedProNode){
            let pros = GD.role.XqPros[this.selectedBodyType]
            if(pros){
                let p = pros.XqPros[this.selectedProIndex]
                if(p){
                    if(type==MT.XiangQianUp&&p.Lv>=10){
                        UIMgr.I.tip('已满级')
                    }else{
                        if(type==MT.XiangQianOff){
                            UIMgr.I.PopView.showMsgBox(null,'拆除',(pass:string)=>{
                                this.sendXqOffOrUp(type,cb,pass)
                            },'取消',true)
                        }else if(GD.role.hasEnoughItem(p.YgType,p.Lv+1)){
                            this.sendXqOffOrUp(type,cb,'')
                        }
                    }
                }else{
                    UIMgr.I.tip('该孔未镶嵌')
                }
            }
        }else{
            UIMgr.I.tip('请先点击选择一个镶宝孔')
        }
    }
    sendXqOffOrUp=(type:MT,cb:(d:any)=>void,pass:string)=>{
        let req=outer_pb.XqAct.create()
        req.BodyType=this.selectedBodyType
        req.XqIndex=this.selectedProIndex
        req.Pass=pass;
        let buf=outer_pb.XqAct.encode(req).finish()
        WS.send(type,buf,cb)
    }
    onXiangQianOn=(d:any)=>{
        let rsp=outer_pb.XqAct.decode(d)
        if(rsp.ErrCode==Err.ErrCode_Success){
            GD.role.XqPros=rsp.XqPros
            GD.role.reduceItem(rsp.Id,1)
            this.renderCellPros(rsp.BodyType)
            this.refreshBodyNode(this.selectedBodyNode,rsp.BodyType)
            UIMgr.I.resetRoleBasePros(rsp.BasePros)
            UIMgr.I.tip('镶嵌成功',ct.green)
            this.refreshNeed()
        }else{
            UIMgr.I.tip('操作失败')
        }
    }
    onXiangQianOff=(d:any)=>{
        let rsp=outer_pb.XqAct.decode(d)
        if(rsp.ErrCode==Err.ErrCode_Success){
            GD.role.XqPros=rsp.XqPros
            if(rsp.Num>0) GD.role.getItem(rsp.Id,rsp.Num,false);
            this.renderCellPros(rsp.BodyType)
            this.refreshBodyNode(this.selectedBodyNode,rsp.BodyType)
            UIMgr.I.resetRoleBasePros(rsp.BasePros)
            UIMgr.I.tip('拆除成功',ct.green)
            this.refreshNeed()
        }else{
            UIMgr.I.tip('操作失败')
        }
    }
    onXiangQianUp=(d:any)=>{
        let rsp=outer_pb.XqAct.decode(d)
        if(rsp.ErrCode==Err.ErrCode_Success){
            GD.role.XqPros=rsp.XqPros
            if(rsp.Num>0) GD.role.reduceItem(rsp.Id,rsp.Num)
            this.renderCellPros(rsp.BodyType)
            this.refreshBodyNode(this.selectedBodyNode,rsp.BodyType)
            UIMgr.I.resetRoleBasePros(rsp.BasePros)
            UIMgr.I.tip('升级成功',ct.green)
            this.refreshNeed()
        }else{
            UIMgr.I.tip('操作失败')
        }
    }
    renderCellPros(bodyType:number){
        this.need.string=''
        let name = this.bodyBox.children[bodyType-1].children[1].getComponent(Label).string
        this.curType.string = `【${name}镶宝】`
        let xqPros = GD.role.XqPros[bodyType]
        this.proBox.children.forEach((node:Node,i:number)=>{
            let label = node.children[1].getComponent(RichText)
            let str:string
            let icon = node.children[2].children[0];
            if(xqPros){
                let pro = xqPros.XqPros[i]
                if(pro){
                    str = Tools.getXqProInfo(pro.YgType,pro.Lv)
                    icon.active = true
                    Tools.loadSpriteFrame("ui/item/"+pro.YgType,GD.commonBundle).then(sp=>{
                        icon.getComponent(Sprite).spriteFrame = sp;
                    })
                    icon.children[0].getComponent(Label).string = 'Lv.'+pro.Lv
                }
            }
            if(str){
                label.string = str
            }else{
                icon.active=false;
                label.string = `<color=${ct.gray}>镶宝${i+1}：空</>`
            }
        })
        this.caculateLuckPro(xqPros);
    }
    renderBody(){
        this.bodyBox.children.forEach((node:Node,index:number)=>{
            this.refreshBodyNode(node,index+1,false)
        })
        this.caculateAllTypes()
    }
    refreshBodyNode=(node:Node,bodyType:number,reCaculateAllType:boolean=true)=>{
        let xqPros = GD.role.XqPros[bodyType]
        let signs = node.children[2]
        signs.children.forEach((node:Node,index:number)=>{
            let mark = node.children[0]
            if(xqPros){
                let pro = xqPros.XqPros[index]
                if(pro){
                    mark.active = true
                    Tools.loadSpriteFrame("ui/item/"+pro.YgType,GD.commonBundle).then(sp=>{
                        mark.getComponent(Sprite).spriteFrame = sp;
                    })
                    mark.children[0].getComponent(Label).string = 'Lv.'+pro.Lv
                }else{
                    mark.active = false
                }
            }else{
                mark.active = false
            }
        })
        if(reCaculateAllType){
            this.caculateAllTypes()
        }
    }
    caculateLuckPro(xqPros:outer_pb.IXqPros){
        //5孔都镶嵌时，才有可能出幸运荧光属性
        let luckStr = '幸运荧光属性：无'
        if(xqPros){
            let minLv:number=99;
            let xqs = xqPros.XqPros;
            let a=0
            for(let i in xqs){
                a++
                let pro = xqs[i]
                if(pro){
                    if(pro.Lv<minLv){
                        minLv=pro.Lv
                    }
                }else{
                    minLv=0
                }
            }
            if(a<5) minLv=0
            if(minLv<99&&minLv>0){
                let pro0 = xqs[0]
                let pro1 = xqs[1]
                let pro2 = xqs[2]
                if(pro0&&pro1&&pro2){
                    let type0 = (pro0.YgType / 10)>>0
                    let type1 = (pro1.YgType / 10)>>0
                    let type2 = (pro2.YgType / 10)>>0
                    if(pro0.YgType<741){
                        //攻击类型
                        let n=minLv*11
                        if(type0==71){
                            //火
                            if(type1==72&&type2==73){
                                //火、雷、冰：最大攻击力+11*最低孔位等级
                                luckStr = `最大攻击力 +${n}`
                            }else if(type1==73&&type2==72){
                                //火、冰、雷：幸运一击伤害增加+11*最低孔位等级
                                luckStr = `幸运一击伤害增加 +${n}`
                            }
                        }else if(type0==72){
                            //雷
                            if(type1==73&&type2==71){
                                //雷、冰、火：技能攻击力+11*最低孔位等级
                                luckStr = `技能攻击力 +${n}`
                            }else if(type1==71&&type2==73){
                                //雷、火、冰：所有属性攻击力+11*最低孔位等级
                                luckStr = `所有元素攻击力 +${n}`
                            }
                        }else if(type0==73){
                            //冰
                            if(type1==72&&type2==71){
                                //冰、雷、火：卓越一击伤害增加+11*最低孔位等级
                                luckStr = `卓越一击伤害增加 +${n}`
                            }else if(type1==71&&type2==72){
                                //冰、火、雷：攻击成功率增加+11*最低孔位等级
                                luckStr = `攻击成功率增加 +${n}`
                            }
                        }
                    }else{
                        //防御类型
                        let n=minLv*5
                        if(type0==74){
                            //水
                            if (type1 == 75 && type2 == 76) {
                                //水、风、土：所有属性防御力+5*最低孔位等级
                                luckStr = `所有元素防御力增加 +${n}`
                            } else if (type1 == 76 && type2 == 75) {
                                //水、土、风：防御力+5*最低孔位等级
                                luckStr = `防御力增加 +${n}`
                            }
                        }else if(type0==75){
                            //风
                            if (type1 == 76 && type2 == 74) {
                                //风、土、水：最大生命值+10*最低孔位等级
                                luckStr = `最大生命值增加 +${n*2}`
                            } else if (type1 == 74 && type2 == 76) {
                                //风、水、土：最大魔法值+10*最低孔位等级
                                luckStr = `最大魔法值增加 +${n*2}`
                            }
                        }else if(type0==76){
                            //土
                            if (type1 == 75 && type2 == 74 ){
                                //土、风、水：防御成功率增加+5*最低孔位等级
                                luckStr = `防御成功率增加 +${n}`
                            } else if (type1 == 74 && type2 == 75) {
                                //土、水、风：最大AG值增加+5*最低孔位等级
                                luckStr = `最大AG值增加 +${n}`
                            }
                        }
                    }
                }
            }
        }
        this.luckyPro.string=luckStr;
    }
    caculateAllTypes(){
        let huo:number=0,lei:number=0,bing:number=0,shui:number=0,feng:number=0,tu:number=0;
        let minLv:number=99;
        let a=0
        for(let t in GD.role.XqPros){
            a++;
            let xqPros = GD.role.XqPros[t]
            if(xqPros){
                let b=0
                for(let i in xqPros.XqPros){
                    b++
                    let pro = xqPros.XqPros[i]
                    if(pro){
                        if(pro.Lv<minLv){
                            minLv=pro.Lv
                        }
                        let type=pro.YgType/10>>0
                        if (type == 71) {
                            huo++
                        } else if (type == 72) {
                            lei++
                        } else if (type == 73) {
                            bing++
                        } else if (type == 74) {
                            shui++
                        } else if (type == 75) {
                            feng++
                        } else if (type == 76) {
                            tu++
                        }
                    }
                }
                if(b<5)minLv=0
            }
        }
        if(a<12)minLv=0
        if(minLv==99)minLv=0
        this.allTypes.string=`全身已镶嵌：火x${huo}、雷x${lei}、冰x${bing}、水x${shui}、风x${feng}、土x${tu}  最低等级为${minLv}`
        if(minLv>0){
            if (huo >= 5 && lei >= 5 && bing >= 5 && shui >= 10 && feng >= 10 && tu >= 10) {
                this.groupPro1.string=`双倍伤害概率 +${2+minLv}%`
                this.groupPro2.string=`无视目标防御力概率 +${0.5+minLv*5/10}%`
                return
            }
        }
        this.groupPro1.string='全身组合荧光属性1：无'
        this.groupPro2.string='全身组合荧光属性2：无'
    }
}


