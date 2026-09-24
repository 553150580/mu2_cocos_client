import { _decorator, EventTouch, Graphics, Input, Label, Node, Sprite, UITransform, Vec2, Vec3 } from 'cc';
import { BasePage } from './BasePage';
import { PlayerControl } from '../battle/PlayerControl';
import { MapControl } from '../battle/MapControl';
import GD from '../base/GameData';
import { PageType, UIMgr } from '../managers/UIMgr';
import { ct } from '../base/types';
import Tools from '../base/tools';
import { CosRad, SinRad } from '../base/consts';
const { ccclass, property } = _decorator;

@ccclass('MapPage')
export class MapPage extends BasePage {
    @property(Label)
    mapName: Label = null;
    @property(Node)
    mapBg: Node = null;
    @property(Node)
    viewRect: Node = null;
    @property(Node)
    sjBtn: Node = null;
    @property(Node)
    backHomeBtn: Node = null;
    @property(Node)
    roomBtn: Node = null;
    @property(Node)
    playerPoint: Node = null;

    player:PlayerControl
    graphics:Graphics
    rate:number=1;
    rate2:number=1;
    curMap:MapControl;
    doorNodes:Array<Node>;
    // static I:MapPage;
    start() {
        // MapPage.I=this;
        this.graphics = this.viewRect.getComponent(Graphics);
        this.sjBtn.on(Input.EventType.TOUCH_END,this.onSjBtnTouch,this)
        this.backHomeBtn.on(Input.EventType.TOUCH_END,this.onBackHomeBtnTouch,this)
        this.mapBg.on(Input.EventType.TOUCH_END,this.onViewTouch,this)
        this.roomBtn.on(Input.EventType.TOUCH_END,(e:any)=>{
            UIMgr.I.show(PageType.RoomPage);
        },this)
    }
    onBackHomeBtnTouch(e:any){
        let skill = GD.role.skills.get(4)
        this.player.tryUseSkill(skill)
    }
    onSjBtnTouch(e:any){
        let skill = GD.role.skills.get(3)
        this.player.tryUseSkill(skill)
    }
    onViewTouch(enent:EventTouch){
        let touchPos: Vec2 = enent.getUILocation();
        let v3=this.mapBg.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(touchPos.x,touchPos.y))
        v3.x *=this.rate
        v3.y *=this.rate
        let point = Tools.pxPosToCellPos(v3.x,v3.y)
        v3.x=point.I
        v3.y=point.J
        this.player.clickMoveTo(v3,false);
    }
    initData(d:any){
        if(GD.curMap){
            this.player=GD.player;
            this.curMap=GD.curMap;
            this.rate=this.curMap.floorNode.getComponent(UITransform).width/256;
            this.rate2=this.rate/2;
            this.mapName.string = this.curMap.mapName;
            this.doorNodes=[]
            this.curMap.entityLayer.children.forEach((n)=>{
                if(n.name.startsWith('door')){
                    this.doorNodes.push(n)
                }
            })
            Tools.drawPathTexture(this.mapBg.getComponent(Sprite),this.curMap.mapCells);
            this.initPointObjs();
            // Tools.loadSpriteFrame(`map/bg/${this.curMap.mapId}_mini`).then(sp=>{
            //     this.mapBg.getComponent(Sprite).spriteFrame= sp;
            // })
        }
    }
    onHide(){
        this.player=null;
        this.curMap=null;
        this.points=[];
    }
    protected update(dt: number): void {
        if(this.player){
            let p=this.player.node.getPosition();
            p.x = p.x/this.rate2>>0;
            p.y = p.y/this.rate2>>0;
            this.playerPoint.setPosition(p);
            this.graphics.clear();
            this.curMap.monsterList.forEach(n=>{
                let x = n.node.position.x/this.rate2;
                let y = n.node.position.y/this.rate2;
                this.drawCircleFlag(x,y,ct.brown,3);

                // let pos = this.player.node.position.clone().subtract(n.node.position);
                // if(pos.length()<400){
                //     //如果是怪物的话，用i,j来计算坐标
                //     pos.x = n.position.x/this.rate;
                //     pos.y = n.position.y/this.rate;
                //     this.drawCircleFlag(pos,"#B9B9B9",4); //绘制障碍物标记
                // }
            })
            let teamId = GD.role.data.TeamId;
            this.curMap.otherList.forEach(n=>{
                let x = n.node.position.x/this.rate2;
                let y = n.node.position.y/this.rate2;
                if(teamId>0&&n.data.TeamId==GD.role.data.TeamId){
                    this.drawCircleFlag(x,y,ct.blue,4);
                }else{
                    this.drawCircleFlag(x,y,ct.white,4);
                }
            })
            this.points.forEach(obj=>{
                this.drawCircleFlagObj(obj)
            })
            // this.doorNodes.forEach(n=>{
            //     let x = n.position.x/this.rate2;
            //     let y = n.position.y/this.rate2;
            //     this.drawCircleFlag(x,y,ct.qing,4);
            // })
            // this.curMap.hasBoss&&this.curMap.bossPoints.children.forEach(n=>{
            //     let x = n.position.x/this.rate2;
            //     let y = n.position.y/this.rate2;
            //     const origX = x * CosRad - y * SinRad;
            //     const origY = x * SinRad + y * CosRad;
            //     this.drawCircleFlag(origX,origY,ct.red,4);
            // })
            // this.curMap.monsterPoints.children.forEach(n=>{
            //     let x = n.position.x/this.rate2;
            //     let y = n.position.y/this.rate2;
            //     const origX = x * CosRad - y * SinRad;
            //     const origY = x * SinRad + y * CosRad;
            //     this.drawCircleFlag(origX,origY,ct.red,2);
            // })
        }
    }
    points:Array<PointsObj>=[];
    initPointObjs(){
        this.points=[]
        this.doorNodes.forEach(n=>{
            let x = n.position.x/this.rate2;
            let y = n.position.y/this.rate2;
            this.points.push({x:x,y:y,color:ct.qing,w:4})
        })
        this.curMap.monsterPoints.children.forEach(n=>{
            let x = n.position.x/this.rate2;
            let y = n.position.y/this.rate2;
            const origX = x * CosRad - y * SinRad;
            const origY = x * SinRad + y * CosRad;
            let num = n.getComponent(Label).string.split(',').length;
            // this.drawCircleFlag(origX,origY,ct.red,2);
            this.points.push({x:origX,y:origY,color:ct.yellow,w:num+2})
        })
        this.curMap.hasBoss&&this.curMap.bossPoints.children.forEach(n=>{
            let x = n.position.x/this.rate2;
            let y = n.position.y/this.rate2;
            const origX = x * CosRad - y * SinRad;
            const origY = x * SinRad + y * CosRad;
            // this.drawCircleFlag(origX,origY,ct.red,4);
            this.points.push({x:origX,y:origY,color:ct.red,w:8})
        })
    }
    private drawCircleFlagObj(obj:PointsObj){
        this.graphics.fillColor.fromHEX(obj.color);
        this.graphics.circle(obj.x, obj.y,obj.w);
        this.graphics.fill();
    }
    private drawCircleFlag(x:number,y:number,hexColor:string, radius:number){
        this.graphics.fillColor.fromHEX(hexColor);
        this.graphics.circle(x, y,radius);
        this.graphics.fill();
    }
}
class PointsObj{
    x:number;
    y:number;
    color:ct;
    w:number;//显示宽度
}


