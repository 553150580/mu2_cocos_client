import { _decorator, Component, Label, Node, RichText } from 'cc';
import { List } from '../UiComps/List';
import { UIMgr } from '../managers/UIMgr';
import { ShowItemType } from './PopView';
import { BodyType, ct, EquipType, WingBase } from '../base/types';
import GD from '../base/GameData';
import WS from '../base/net';
import { Err, MT } from '../base/MT';
import Tools from '../base/tools';
const { ccclass, property } = _decorator;

@ccclass('Npc45View')
export class Npc45View extends Component {
    @property(Node)
    doBtn:Node;
    @property(List)
    list:List;
    @property(RichText)
    need:RichText;
    @property(Node)
    equipBtn:Node;

    equip:outer_pb.IEquip
    bodyType:BodyType=BodyType.None
    selectedNode:Node
    needId:number=0
    static I:Npc45View
    protected onLoad(): void {
        Npc45View.I=this;
        this.doBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.equip&&this.needId>0&&GD.role.hasEnoughItem(this.needId,1)){
                let req = outer_pb.PetAct.create();
                req.Uid1=this.equip.Uid
                req.Id=this.list.array[this.list.selectedIndex]
                let buff = outer_pb.PetAct.encode(req).finish();
                WS.send(MT.SwitchEquipType,buff,(d:any)=>{
                    let rsp=outer_pb.PetAct.decode(d)
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        this.equip.Id=rsp.Id
                        if(rsp.Pet.SkillId>0)this.equip.SkillId=rsp.Pet.SkillId
                        GD.role.reduceItem(this.needId,1)
                        UIMgr.I.tip('转换成功',ct.green)
                        this.resetNull()
                        this.refreshView();
                    }else{
                        UIMgr.I.tip('道具不足')
                    }
                })
            }
        })
        this.list.cellRender=(node,index)=>{
            let id=this.list.array[index];
            let base = GD.EquipBaseDatas.get(id)
            node.children[2].getComponent(RichText).string=base.Name;
            node.children[1].children[0].active = node==this.selectedNode;
        }
        this.list.selectedHandler=(node,index)=>{
            if(this.selectedNode){
                this.selectedNode.children[1].children[0].active = false;
            }
            this.selectedNode=node
            node.children[1].children[0].active = true
            GD.playClickSound();
        }
        this.equipBtn.on(Node.EventType.TOUCH_END,()=>{
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
    }
    protected onEnable(): void {
        this.resetNull()
    }
    resetNull=()=>{
        this.list.array=[]
        this.needId=0
        this.equip=null
        this.refreshView()
    }
    wing2Ids=[200101,200102,200103,200104,200105,200106]
    wing3Ids=[200201,200202,200203,200204,200205,200206]
    ringIds=[60001,60002,60003,60004,60005,60006,60007]
    neckIds=[70001,70002,70003,70004,70005,70006,70007]
    weapon380=[80014, 80017, 80120, 100010, 80249, 80305, 80407, 80506]
    weapon400=[80013, 80121, 100011, 80250, 80251, 80306, 80410, 80507, 110004,80252]
    refreshView=()=>{
        let equip=this.equip
        let arr=[]
        this.needId=0
        let needStr=''
        let name1='点击选择装备'
        let color1=ct.gray
        if(equip){
            let equip_base = GD.EquipBaseDatas.get(equip.Id)
            const et = equip.Id/10000>>0
            if(et==EquipType.Wing){
                let wing:WingBase = equip_base
                if(wing.EquipLv==2){
                    arr=this.wing2Ids.filter(id=>{return id!=equip.Id})
                    this.needId=76
                }else if(wing.EquipLv==3){
                    arr=this.wing3Ids.filter(id=>{return id!=equip.Id})
                    this.needId=77
                }
            }else if(et==EquipType.Ring){
                arr=this.ringIds.filter(id=>{return id!=equip.Id})
                this.needId=78
            }else if(et==EquipType.Neck){
                arr=this.neckIds.filter(id=>{return id!=equip.Id})
                this.needId=78
            }else if(et==EquipType.Weapon||et==EquipType.JianTong||et==EquipType.ZHBook){
                if(equip_base.NeedLv==380){
                    arr=this.weapon380.filter(id=>{return id!=equip.Id})
                    this.needId=83
                }else if(equip_base.NeedLv==400){
                    arr=this.weapon400.filter(id=>{return id!=equip.Id})
                    this.needId=84
                }
            }
            let base=GD.ItemBaseDatas.get(this.needId)
            needStr=`转换需要：<color=${Tools.getItemColor(this.needId)}>${base.Name}x1</>`
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
            name1 = `${equip_base.Name}+${equip.QhLv}z${equip.ZjLv}xy${equip.LuckyLv}`
        }
        this.list.array=arr
        this.need.string=needStr
        let label= this.equipBtn.children[0].getComponent(Label)
        label.string=name1
        label.color.fromHEX(color1)
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
        const et = equip.Id/10000>>0
        let base:WingBase = GD.EquipBaseDatas.get(equip.Id)
        if(et==EquipType.Wing){
            if(base.EquipLv>1){
                return true
            }
        }else if(et==EquipType.Ring||et==EquipType.Neck){
            return true
        }else if(et==EquipType.Weapon||et==EquipType.JianTong||et==EquipType.ZHBook){
            if(base.NeedLv==380||base.NeedLv==400){
                return true
            }
        }
        return false
    }
}


