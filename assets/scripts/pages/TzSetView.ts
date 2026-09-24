import { _decorator, Component, Label, Node } from 'cc';
import { ViewStack } from '../UiComps/ViewStack';
import { Tab } from '../UiComps/Tab';
import GD from '../base/GameData';
import { UIMgr } from '../managers/UIMgr';
import { AtkDtTzTypeString, AtkTzTypeString, ct, DefDtTzTypeString, DefTzTypeString } from '../base/types';
import WS from '../base/net';
import { Err, MT } from '../base/MT';
const { ccclass, property } = _decorator;

@ccclass('TzSetView')
export class TzSetView extends Component {
    @property(ViewStack)
    view0:ViewStack;
    @property(ViewStack)
    view:ViewStack;
    @property(Tab)
    tab:Tab
    @property(Tab)
    defOrAtktab:Tab
    @property(Node)
    tzPros:Node
    @property(Node)
    dtTzPros:Node
    @property(Node)
    saveBtn:Node

    selectedProIndex:number;
    selectedTzType:number;//普通套装0，大天使套装1
    oldTzTypeList:Array<number>=[];
    hasChange:boolean=false;

    protected onLoad(): void {
        this.saveBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.hasChange){
                //与炼体公用消息类型LianTiAct
                let req=outer_pb.LianTiAct.create()
                req.LTPros=GD.role.data.TzSet
                let buf=outer_pb.LianTiAct.encode(req).finish()
                WS.send(MT.SaveTzSet,buf,(d:any)=>{
                    let rsp=outer_pb.LianTiAct.decode(d)
                    this.hasChange=false;
                    GD.role.data.TzSet=req.LTPros;
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        if(rsp.BasePros){
                            UIMgr.I.resetRoleBasePros(rsp.BasePros)
                        }
                        UIMgr.I.tip('保存成功',ct.green)
                    }else{
                        UIMgr.I.tip('保存失败')
                        this.tab.select(0)
                    }
                })
            }else{
                UIMgr.I.tip('套装未更改，无需保存')
            }
        },this);
        this.tab.selectedHandler=(node:Node,index:number)=>{
            this.view.selectedIndex=index;
            // this.selectedTzType=index;
            this.defOrAtktab.select(0)
            GD.playClickSound()
        }
        this.defOrAtktab.selectedHandler=(node:Node,index:number)=>{
            if(index==0){
                //防御套
                if(this.tab.selectedIndex==0){
                    //索引0~4为防御套装类型，5~9为攻击套装类型，10~13大天防御套，14~17大天攻击套
                    this.oldTzTypeList = GD.role.data.TzSet.slice(0,5)
                    this.renderTzPro()
                }else{
                    this.oldTzTypeList = GD.role.data.TzSet.slice(10,14)
                    this.renderDtTzPro()
                }
            }else{
                //攻击套
                if(this.tab.selectedIndex==0){
                    //索引0~4为防御套装类型，5~9为攻击套装类型，10~13大天防御套，14~17大天攻击套
                    this.oldTzTypeList = GD.role.data.TzSet.slice(5,10)
                    this.renderTzPro()
                }else{
                    this.oldTzTypeList = GD.role.data.TzSet.slice(14)
                    this.renderDtTzPro()
                }
            }
            GD.playClickSound()
        }
        this.tzPros.children.forEach((node:Node,index:number)=>{
            node.on(Node.EventType.TOUCH_END,()=>{
                this.selectedProIndex=index;
                this.selectedTzType=0;
                UIMgr.I.PopView.showTzProsBox(0,this.defOrAtktab.selectedIndex,index,this.oldTzTypeList,this.onSelectedTzPro)
            })
        })
        this.dtTzPros.children.forEach((node:Node,index:number)=>{
            node.on(Node.EventType.TOUCH_END,()=>{
                this.selectedProIndex=index;
                this.selectedTzType=1;
                UIMgr.I.PopView.showTzProsBox(1,this.defOrAtktab.selectedIndex,index,this.oldTzTypeList,this.onSelectedTzPro)
            })
        })
    }
    renderTzPro(){
        this.tzPros.children.forEach((node:Node,index:number)=>{
            let proType = this.oldTzTypeList[index]
            let info:string;
            let label=node.children[0].getComponent(Label);
            let color:ct
            if(this.defOrAtktab.selectedIndex==0){
                info=DefTzTypeString[proType] + (proType>=10?'%':'')
            }else{
                info=AtkTzTypeString[proType] + (proType>=7?'%':'')
            }
            if(index<=2){
                color=ct.blue
            }else{
                color=ct.brown
            }
            label.string=info
            label.color.fromHEX(color)
        })
    }
    renderDtTzPro(){
        this.dtTzPros.children.forEach((node:Node,index:number)=>{
            let proType = this.oldTzTypeList[index]
            let info:string;
            if(this.defOrAtktab.selectedIndex==0){
                info=DefDtTzTypeString[proType]
            }else{
                info=AtkDtTzTypeString[proType]
            }
            node.children[0].getComponent(Label).string=info
        })
    }
    onSelectedTzPro=(index:number)=>{
        this.oldTzTypeList[this.selectedProIndex] = index;
        if(this.selectedTzType==0){
            this.renderTzPro()
        }else{
            this.renderDtTzPro()
        }
        this.hasChange=true;
    }
    protected onEnable(): void {
        if(GD.role.defTzNum==0&&GD.role.atkTzNum==0){
            this.view0.selectedIndex=0
        }else{
            this.view0.selectedIndex=1
            this.tab.select(0)
        }
    }
}


