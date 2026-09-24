import { _decorator, Camera, Component, Graphics, Node, Vec3} from 'cc';
import { MapControl } from './MapControl';
import { PlayerControl } from './PlayerControl';
import { MapCellWidth } from './BattleManager';
import GD from '../base/GameData';
import { ct } from '../base/types';
const { ccclass, property } = _decorator;

@ccclass('MiniMapControl')
export class MiniMapControl extends Component {
    @property(Node)
    miniCamera:Node
    @property(Node)
    miniMapTure:Node
    @property(Node)
    viewRect: Node = null;
    player:PlayerControl
    graphics:Graphics
    rate:number=1;
    curMap:MapControl;
    draw:boolean=true;
    
    static I:MiniMapControl;
    onLoad() {
        MiniMapControl.I=this;
        this.graphics = this.viewRect.getComponent(Graphics);
        this.schedule(this.updateMap,0.034)
    }
    bindPlayer(p:PlayerControl,curMap:MapControl){
        this.player=p;
        this.curMap=curMap;
        this.rate=126/11/MapCellWidth //curMap.floorBg.getComponent(UITransform).width
    }
    lostPlayer(){
        this.player=null;
        this.curMap=null;
    }
    setDraw(draw:boolean){
        this.draw=draw
        if(draw===false){
            this.graphics.clear();
        }
        this.miniCamera.active=draw
        this.miniMapTure.active=draw
    }
    updateMap() {
        if(this.player&&this.draw){
            this.graphics.clear();
            this.curMap.monsterList.forEach(m=>{
                let pos = this.player.node.position.clone().subtract(m.node.position);
                pos.x = -pos.x*this.rate;
                pos.y = -pos.y*this.rate;
                this.drawCircleFlag(pos,ct.brown,4); 
                //绘制障碍物标记
                // if(pos.length()<400){
                //     //如果是怪物的话，用i,j来计算坐标
                //     pos.x = -(pos.x/this.rate>>0);
                //     pos.y = -(pos.y/this.rate>>0);
                //     this.drawCircleFlag(pos,"#B9B9B9",4); //绘制障碍物标记
                // }
            })
            let teamId = GD.role.data.TeamId;
            this.curMap.otherList.forEach(n=>{
                let pos = this.player.node.position.clone().subtract(n.node.position);
                pos.x = -pos.x*this.rate;
                pos.y = -pos.y*this.rate;
                if(teamId>0&&n.data.TeamId==GD.role.data.TeamId){
                    this.drawCircleFlag(pos,ct.darkGreen,4);
                }else{
                    this.drawCircleFlag(pos,ct.white,4);
                }
            })
        }
    }
    private drawCircleFlag(pos:Vec3,hexColor:string, radius:number){
        this.graphics.fillColor.fromHEX(hexColor);
        this.graphics.circle(pos.x, pos.y,radius);
        this.graphics.fill();
    }
}


