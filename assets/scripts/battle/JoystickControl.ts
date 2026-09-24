
import {Node, Component, EventTouch, Vec2, Vec3, _decorator } from "cc";
import { PlayerControl } from "./PlayerControl";
import { UnitState } from "../base/types";
import GD from "../base/GameData";

const { ccclass, property } = _decorator;

@ccclass('JoystickControl')
export default class JoystickControl extends Component {
    @property(Node)
    private cursor: Node = null;

    player:PlayerControl = null;
    private touchPos:Vec2 = Vec2.ZERO;
    private joyMoveDir:Vec3 = new Vec3(0,0,0);
    static I:JoystickControl;
    onLoad(){
        JoystickControl.I=this;
    }
    bindPlayer(player:PlayerControl){
        this.player=player
        const touchNode:Node = this.node;
        touchNode.on(Node.EventType.TOUCH_START,this.onJoystickTouchStart,this);
        touchNode.on(Node.EventType.TOUCH_MOVE,this.onJoystickTouchMove,this);
        touchNode.on(Node.EventType.TOUCH_END,this.onJoystickTouchEnd,this);
        touchNode.on(Node.EventType.TOUCH_CANCEL,this.onJoystickTouchEnd,this);
    }
    lostPlayer(){
        this.player=null;
        const touchNode:Node = this.node;
        touchNode.off(Node.EventType.TOUCH_START,this.onJoystickTouchStart,this);
        touchNode.off(Node.EventType.TOUCH_MOVE,this.onJoystickTouchMove,this);
        touchNode.off(Node.EventType.TOUCH_END,this.onJoystickTouchEnd,this);
        touchNode.off(Node.EventType.TOUCH_CANCEL,this.onJoystickTouchEnd,this);
    }
    public onJoystickTouchStart(event:EventTouch){
        // if(GD.role.isLimited(false))return
        if(this.player.state!=UnitState.Death){
            this.touchPos = event.getUILocation();
            this.player.startJoystickMove()
            // const winSize:Size = view.getVisibleSize();
            // this.joyStick.node.position = new Vec3(this.touchPos.x - winSize.width * 0.5,this.touchPos.y - winSize.height * 0.5);
            // this.joyStick.show();
        }
    }
    public onJoystickTouchMove(event:EventTouch){
        if(this.player.state!=UnitState.Death){
            const currentPos:Vec2 = event.getUILocation();
            const moveDir:Vec2 = currentPos.subtract(this.touchPos).normalize();
            this.player.moveDir.x=moveDir.x
            this.player.moveDir.y=moveDir.y
            this.joyMoveDir.x = moveDir.x;
            this.joyMoveDir.y = moveDir.y;
            this.cursor.position = this.joyMoveDir.clone().multiplyScalar(20);
        }
    }
    public onJoystickTouchEnd(event:EventTouch){
        // if(GD.role.isLimited(false))return
        this.joyMoveDir.x = 0;
        this.joyMoveDir.y = 0;
        this.player.moveDir.x=0
        this.player.moveDir.y=0
        this.cursor.position = this.joyMoveDir.clone().multiplyScalar(20);
        // this.joyStick.hidden();
        this.player.stopJoystickMove(event!=null)
    }
}
