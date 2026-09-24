import { _decorator, Collider2D, Contact2DType, Label, Sprite } from 'cc';
import { BaseComponent } from '../base/BaseComponent';
import GD from '../base/GameData';
import { UIMgr } from '../managers/UIMgr';
import { ct, UnitState } from '../base/types';
import Tools from '../base/tools';
const { ccclass, property } = _decorator;

@ccclass('DropItemControl')
export class DropItemControl extends BaseComponent {
    @property(Label)
    nameLabel:Label=null
    @property(Sprite)
    icon:Sprite
    @property(Sprite)
    light:Sprite

    data:outer_pb.IDropItem

    private collider2D:Collider2D = null; 
    onLoad() {
        this.collider2D = this.getComponent(Collider2D);
        this.collider2D.on(Contact2DType.BEGIN_CONTACT,this.onCollisionEnter2D,this);
    }
    protected onEnable(): void {
        // let pastTime = Date.now()/1000-(this.data.DropTime as number)
        let pastTime = Tools.getBeiJingSecond()-(this.data.DropTime as number)
        if(this.data.Owner as number>0){
            let time = 60-pastTime
            if(time>0){
                this.scheduleOnce(this.onSetToNoOwner,time)
            }else{
                this.data.Owner=0
            }
        }
        let deleteTime = 60*3 - pastTime
        if(deleteTime>0){
            this.scheduleOnce(this.onItemDelete,deleteTime)
        }else{
            this.onItemDelete()
        }
    }
    stopCollider=()=>{
        this.collider2D&&(this.collider2D.enabled=false);
    }
    startCollider=()=>{
        this.collider2D&&(this.collider2D.enabled=true);
    }
    protected onDisable(): void {
        this.light.node.active=false
        this.unscheduleAllCallbacks()
    }
    private onCollisionEnter2D(self:Collider2D, other:Collider2D){   
        if(other.tag == 99&&GD.player.state==UnitState.Moving){ //99代表玩家主角色
            this.tryPickUp()
        }
    }
    onSetToNoOwner(){
        this.data.Owner=0
    }
    onItemDelete(){
        GD.curMap.delete1DropItem(this)
    }
    tryPickUp(){
        if(!(this.data.Owner==GD.role.data.Id||this.data.Owner as number==0)){
        // if(!(this.data.Owner==GD.role.data.Name||this.data.Owner==''||(GD.role.myTeam&&this.data.OwnerTeamId==GD.role.myTeam.TeamId))){
            UIMgr.I.showProsMsg('该道具不属于您',ct.red,false,true)
            // let req = outer_pb.PickUpOneDropItem.create();
            // req.Uid=this.data.Uid;
            // let buff = outer_pb.PickUpOneDropItem.encode(req).finish();
            // WS.send(MT.TryPickUpOneDropItem,buff)
            // console.log('tryPickUp:',req,this.data)
        }else if(this.data.ItemType==1&&GD.role.BagEquips.length>=50){
            UIMgr.I.showProsMsg('装备背包满了',ct.red,false,true)
        }
    }
    
}


