import { _decorator, CCInteger, Collider2D, Component, Contact2DType, Label, Node } from 'cc';
import { BattleManager } from './BattleManager';
import GD from '../base/GameData';
import { ct, Door } from '../base/types';
import { MapControl } from './MapControl';
import WS from '../base/net';
import { MT } from '../base/MT';
import JoystickControl from './JoystickControl';
const { ccclass, property } = _decorator;

@ccclass('DoorControl')
export class DoorControl extends Component {
    @property(CCInteger)
    doorId:number;

    skin:Node;
    // nameLabel:Label;
    data:Door;

    private colliders_2D:Collider2D = null;
    start() {
        this.colliders_2D = this.getComponent(Collider2D);
        this.colliders_2D.on(Contact2DType.BEGIN_CONTACT,this.onCollisionEnter2D,this);
        this.skin = this.node.children[0];
        let mapId = this.node.parent.parent.getComponent(MapControl).mapId
        let door:Door = GD.MapList.get(mapId).Doors.find(d=>{return d.Id==this.doorId})
        if(door){
            this.data=door
            let nameLabel = this.node.children[1].children[0].getComponent(Label);
            let name = door.TargetName.split('').join('\n'); 
            nameLabel.string = `【${door.NeedLv}级】\n${name}`
            if((GD.role.data.Lv+GD.role.data.ZsNum*400)<door.NeedLv){
                nameLabel.color.fromHEX(ct.red)
            }else{
                nameLabel.color.fromHEX(ct.green)
            }
            // let pos = this.node.getPosition();//this.node.position.clone()
            // nameLabel.node.parent.parent = this.node.parent.parent.parent.getChildByName('entityLayer');
            // //位置不对
            // const rx = pos.x*CosRad1+pos.y*SinRad1
            // const ry = -pos.x*SinRad1+pos.y*CosRad1
            // pos.x = rx;
            // pos.y = ry;
            // nameLabel.node.parent.setPosition(pos)
        }
    }
    protected update(dt: number): void {
        this.skin.angle = (this.skin.angle-2)%360;
    }
    public onCollisionEnter2D(self:Collider2D, other:Collider2D){   
        if(other.tag == 99){ //99代表玩家主角色
            if(GD.role.hasEnoughLv(this.data.NeedLv)){
                JoystickControl.I.onJoystickTouchEnd(null)
                if(this.data.TargetId==GD.curMap.mapId){
                    //本地图
                    GD.player.setMoveMotion(false)
                    let req = outer_pb.JoinLineAct.create();
                    req.DoorId=this.data.Id;
                    let buff = outer_pb.JoinLineAct.encode(req).finish();
                    WS.send(MT.GoToMapPosByDoor,buff)
                }else{
                    BattleManager.I.joinLine(GD.role.data.WorldLv,this.data.TargetId,-1,GD.role.data.LineId,null,false,true);
                }
            }
        }
    }
    protected onDestroy(): void {
        this.colliders_2D.off(Contact2DType.BEGIN_CONTACT,this.onCollisionEnter2D,this);
    }
}