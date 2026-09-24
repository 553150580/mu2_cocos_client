
import { _decorator, Camera, Component, Node, Vec3 } from 'cc';
import { PlayerControl } from './PlayerControl';
const { ccclass, property } = _decorator;

 
@ccclass('CameraControl')
export class CameraControl extends Component {
    @property(Camera)
    camera:Camera=null;
    @property(Node)
    miniMapCamera:Node=null;
    // @property(Node)
    // addBtn:Node=null;
    // @property(Node)
    // reduceBtn:Node=null;

    player:PlayerControl = null;
    tempPos:Vec3=new Vec3();
    // miniPos:Vec3=new Vec3()
    static I:CameraControl
    onLoad(){
        CameraControl.I=this
        // this.addBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
        //     let pos:Vec3 = this.camera.node.position
        //     if(pos.z<2000){
        //         pos.z+=100
        //     }
        //     this.camera.node.position=pos;
        // },this);
        // this.reduceBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
        //     let pos:Vec3 = this.camera.node.position
        //     if(pos.z>1000){
        //         pos.z-=100
        //     }
        //     this.camera.node.position=pos;
        // },this);
    }
    bindPlayer(player:PlayerControl){
        this.player=player
        this.node.position=this.player.node.position.clone();
        this.miniMapCamera.position=this.player.node.position.clone();
    }
    lostPlayer(){
        this.player=null;
    }
    update (deltaTime: number) {
        if(this.player){
            let tempPos:Vec3 = this.miniMapCamera.position
            tempPos.x=this.node.position.x;
            tempPos.y=this.node.position.y;
            // this.tempPos.z=this.node.position.z;
            this.node.position=tempPos.lerp(this.player.node.position,deltaTime*8);

            let pos:Vec3 = this.miniMapCamera.position
            pos.x=this.player.node.position.x
            pos.y=this.player.node.position.y
            this.miniMapCamera.setPosition(pos);
            // this.miniMapCamera.position=this.player.node.position.clone();
        }
    }
}
