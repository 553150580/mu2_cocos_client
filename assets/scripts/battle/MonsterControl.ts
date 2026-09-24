import { _decorator, Animation, Label, Node, ProgressBar, Sprite, Tween, tween, Vec3, Widget } from 'cc';
import { ct, DmgLabel, DmgType, FireType, MonsterBaseData, MonsterColorTypes, Point, SoundType, Unit, UnitState, UnitType } from '../base/types';
import { BaseComponent } from '../base/BaseComponent';
import GameManager from '../managers/GameManager';
import { PlayerControl, PlayerType } from './PlayerControl';
import GD from '../base/GameData';
import { UIMgr } from '../managers/UIMgr';
import MovieClip from '../utils/MovieClip';
import Pools from '../base/Pools';
import Tools from '../base/tools';
import { AniController } from '../utils/AniController';
const { ccclass, property } = _decorator;

export const MonsterMoveSpeed=200

@ccclass('MonsterControl')
export class MonsterControl extends BaseComponent {
    @property(Label)
    nameLabel:Label=null
    @property(Label)
    ownerLabel:Label=null
    @property(Sprite)
    skin:Sprite
    @property(Node)
    skillLayer:Node
    @property(Node)
    effectLayer:Node
    // @property(AniController)
    // AniController:AniController
    // @property(MovieClip)
    // movieClip:MovieClip
    @property(ProgressBar)
    hpBar:ProgressBar
    @property(Node)
    private selecter:Node
    @property(Widget)
    hpWidget:Widget;
    @property(MovieClip)
    beAtkedEffect:MovieClip;
    @property(Animation)
    ani:Animation;
    skillNodePool:Map<number,Node>=new Map();
    needAddDmgLabels:Array<DmgLabel>=[]

    scheduleAddDmgLabels(){
        if(this.needAddDmgLabels.length>0){
            let label = this.needAddDmgLabels.pop()
            let node = label.label.node
            node.parent=GD.curMap.dmgLabelLayer;
            let com = node.getComponent(BaseComponent)
            let y = node.position.y+300;
            if(label.dmgType>1&&label.dmgType!=DmgType.Ys){
                //特殊类型伤害，放大特效
                tween(com).to(0.1,{scaleX:2,scallY:2}).to(0.2,{scaleX:1,scallY:1}).to(1,{y:y}).call(()=>{
                    //call的时候可能已经销毁了地图，该node已经回收
                    if(node.parent){
                        node.removeFromParent();
                        Pools.dmgLabelPool.push(label)
                    }
                }).start()
            }else{
                tween(com).to(1.3,{y:y}).call(()=>{
                    //call的时候可能已经销毁了地图，该node已经回收
                    if(node.parent){
                        node.removeFromParent();
                        Pools.dmgLabelPool.push(label)
                    }
                }).start()
            }
            //开始显示数字后，是否需要删除目标
            if(label.DeathUnit){
                this.setDeath()
            }
        }
    }

    data:outer_pb.IMonsterInfo;
    base:MonsterBaseData;
    // maxHp:number=0;
    moveTween:Tween<Node>;
    unitType:UnitType=UnitType.Monster;

    private _direction:number=0;
    get direction():number{
        return this._direction;
    }
    // /**
    //  * 方向值范围为 0-7，方向值设定如下，0是下，1是左下，2是左，3是左上，4是上，5是右上，6是右，7是右下
    //  *        4
    //  *      3   5
    //  *    2   *   6
    //  *      1   7
    //  *        0
    //  */
    // set direction(value:number){
        // this._direction = value;
        // if(value =1){ //水平翻转
        //     var scale:Vec3 = this.movieClip.node.scale;
        //     scale.x = -1;
        //     this.movieClip.node.scale = scale;
        // }else{
        //     var scale:Vec3 = this.movieClip.node.scale;
        //     scale.x = 1;
        //     this.movieClip.node.scale = scale;
        // }
        // this.AniController.currentDirection=value
        // if(value > 4){ //方向为5、6、7的时候水平翻转
        //     this.movieClip.rowIndex = 4 - value % 4;
        //     var scale:Vec3 = this.movieClip.node.scale;
        //     scale.x = -1;
        //     this.movieClip.node.scale = scale;
        // }else{
        //     this.movieClip.rowIndex = value;
        //     var scale:Vec3 = this.movieClip.node.scale;
        //     scale.x = 1;
        //     this.movieClip.node.scale = scale;
        // }
    // }

    private _state:UnitState=UnitState.Idle
    get state():UnitState{
        return this._state;
    }
    set state(value:UnitState){
        this._state = value;
        // switch(this._state){
        //     case UnitState.Idle: 
        //         this.movieClip.play(0)
        //         break;
        //     case UnitState.Atking:
        //         this.movieClip.play(1)
        //         break; 
        //     case UnitState.Moving: 
        //         this.movieClip.play(2)
        //         break;
        // }
        // this.AniController.currentAction=value
        //朝向
        // var halfCol:number = this.movieClip.col / 2;
        // switch(this._state){
        //     case UnitState.Idle: 
        //         this.movieClip.begin = 0;
        //         this.movieClip.end = halfCol;
        //     break;
        //     case UnitState.Moving: 
        //         this.movieClip.begin = halfCol;
        //         this.movieClip.end = this.movieClip.col;
        //     break;
        // }
    }
    targetPos:Vec3=new Vec3()
    moveToPos(i:number,j:number){
        this.data.I = i;
        this.data.J = j;
        
        let rotatePos = Tools.cellPosToPxPos_Rotate45(i,j)
        this.targetPos.x=rotatePos.x
        this.targetPos.y=rotatePos.y+30
        if(this.moveTween){
            this.moveTween.stop()
        }
        this.lookAtPos(this.targetPos.x,this.targetPos.y)
        this.state = UnitState.Moving;
        this.moveTween = tween(this.node).to(1,{position:this.targetPos}).call(()=>{
            this.moveTween=null;
            this.state = UnitState.Idle;
        }).start();
    }
    // resetPosAt(i:number,j:number){
    //     this.data.I = i;
    //     this.data.J = j;
    //     let pos:Vec3=this.node.position

    //     let rotatePos = Tools.cellPosToPxPos_Rotate45(i,j)
    //     pos.x=rotatePos.x
    //     pos.y=rotatePos.y+30

    //     this.node.position=pos
    //     if(GD.player.selectedUnit==this) UIMgr.I.updateTargetBox();
    // }
    select(isSelected:boolean){
        this.selecter&&(this.selecter.active=isSelected)
    }
    getCellPos():Point{
        return new Point(this.data.I,this.data.J)
    }
    beAtked(dmg:number,sdDmg:number=0){
        this.data.CurHp-=dmg
        this.hpBar.progress = this.data.CurHp/this.data.MaxHp;
        if(GD.player.selectedUnit==this) UIMgr.I.updateTargetBox();
        this.ani.play();
    }
    changeHp(cur:number,max:number){
        this.data.CurHp=cur;
        this.data.MaxHp=max;
        this.hpBar.progress = this.data.CurHp/this.data.MaxHp;
        if(GD.player.selectedUnit==this) UIMgr.I.updateTargetBox();
    }
    setDeath=()=>{ 
        if(this.data.Type==3){
            this.setToDeathState()
        }else{
            this.data.CurHp = 0
            this.hpBar.progress = 0
            GD.curMap.delete1Monster(this)
        }
    }
    setToDeathState=()=>{
        this.state=UnitState.Death
        this.changeHp(0,this.data.MaxHp)
        this.refreshNameLabel();
    }
    protected onEnable(): void {
        this.schedule(this.scheduleAddDmgLabels,0.06)
    }
    protected onDisable(): void {
        this.needAddDmgLabels=[]
        this.unschedule(this.scheduleAddDmgLabels)
    }
    refreshEffectUi(buffInfos:{[k: string]: outer_pb.IBuffInfo;}){
        if(buffInfos){
            this.effectLayer.children.forEach(node=>{
                node.active = !!buffInfos[node.name]
            })
        }else{
            this.effectLayer.children.forEach(node=>{
                node.active = false
            })
        }
    }
    refreshNameLabel(){
        let pre:string=''
        let data=this.data;
        if(data){
            let nameColor:ct;
            let skinColor='#fff'
            this.ownerLabel.node.active = data.Owner!=''
            let lv:number=data.Lv;
            if(data.Type==4){
                //宝宝
                this.ownerLabel.string=`[${data.Owner}]`
                if(lv<5){
                    nameColor=ct.white
                }else if(lv<10){
                    nameColor=ct.blue
                }else{
                    nameColor=ct.green
                }
            }else{
                lv=this.base.Lv;
                let maxDropLv = this.base.MaxDropLv
                if(data.Type==1){
                    pre='黄金 '
                    skinColor=ct.yellow
                }else if(data.Type==2){
                    maxDropLv+=50
                    pre='精英 '
                    skinColor=ct.purple
                }else if(data.Type==3||data.Type==5){
                    pre='史诗 ' //世界BOSS、个人BOSS
                    maxDropLv+=50
                    skinColor=ct.red
                }else if(data.Type==8){
                    maxDropLv+=400
                    pre='变异 '
                    skinColor=ct.red
                }else if(data.Type==9){
                    maxDropLv+=400
                    pre='狂暴 '
                }
                if(data.Type<0){
                    nameColor=ct.brown
                }else{
                    nameColor = MonsterColorTypes[data.Type]
                }
                if(data.Owner!=''){
                    this.ownerLabel.string=`[归属] ${data.Owner}`
                }else if(GD.curMap.mapData.Id!=777){
                    this.ownerLabel.string=''
                    if(GD.curLineLv<3){
                        let lv = GD.role.data.Lv;
                        if(data.Type>0){
                            const zsNum = GD.role.data.ZsNum
                            if(GD.role.data.ZsNum>0){
                                //如果是BOSS，则每多转一次，加10级，上限400
                                lv+=10*zsNum
                                if(lv>400) lv=400
                            }
                        }
                        if(lv>=maxDropLv){
                            nameColor=ct.gray
                        }
                    }
                }
            }
            let after=''
            if(this.state==UnitState.Death){
                nameColor=ct.gray;
                skinColor='#555'
                after='（亡魂）'
            }
            this.skin.color.fromHEX(skinColor)
            if(data.Type==3||data.Type==5){
                this.skin.enabled=false
                this.scheduleOnce(()=>{
                    this.skin.enabled=true;
                },0)
            }
            this.nameLabel.string = `Lv.${lv} ${pre}${this.base.Name}${after}`;
            this.nameLabel.color.fromHEX(nameColor)

            // this.movieClip.pieceHeight
            // 把影片的宽高赋值给根节点
            // this.width = this.movieClip.uiTransform.width;
            // this.height = this.movieClip.uiTransform.height;
            // const halfH = this.height/2;
            // this.hpBar.node.y=halfH;
            // this.beAtkedEffect.node.y=halfH;
            // // this.movieClip.node.y=0;
            // this.selecter.y=halfH-25;
        }
    }
    atkTarget=(target:Unit,rsp:any)=>{
        //朝向
        let pos = target.node.position;
        this.lookAtPos(pos.x,pos.y)

        let isKilled = rsp.Result==1
        let cb:()=>void;
        if(target.unitType==UnitType.Player){
            let role = target as PlayerControl
            cb = ()=>{
                if(role.playerType==PlayerType.Me){
                    if(GD.curMap){
                        GD.curMap.addDmgFont(role,rsp.Dmg,DmgType.RedWs,false,isKilled)
                        if(rsp.YsDmg) GD.curMap.addDmgFont(role,rsp.YsDmg,DmgType.Ys)
                    }
                }else if(isKilled){
                    target.setDeath()
                }
                role.beAtked(rsp.CurHp)
                // role.beAtked(rsp.Dmg+rsp.YsDmg)
            }
        }else{
            //怪物被怪物攻击
            cb = ()=>{
                if(rsp.FromId==GD.role.data.Id){
                    //被我的宝宝攻击、我的宝宝攻击怪物，显示伤害
                    if(GD.curMap){
                        GD.role.tjDmg += rsp.Dmg;
                        GD.curMap.addDmgFont(target,rsp.Dmg,rsp.FromId==GD.role.data.Id?DmgType.BaoBao:DmgType.RedWs,false,isKilled)
                        if(rsp.YsDmg) GD.curMap.addDmgFont(target,rsp.YsDmg,DmgType.Ys)
                    }
                    if(rsp.GetExp>0){
                        GD.role.getExp(rsp.GetExp,rsp.CurExp,false,true)
                        // if(rsp.Owner==GD.role.data.Id ||(GD.role.myTeam && GD.role.myTeam.TeamId == rsp.OwnerTeamId)){
                        //     GD.role.getExp(rsp.GetExp,rsp.CurExp,false,true)
                        // }
                    }
                }else if(isKilled){
                    target.setDeath()
                }
                target.beAtked(rsp.Dmg+rsp.YsDmg,0)
            }
        }
        let skill = GD.allSkills.get(rsp.SkillId);
        if(skill&&skill.TargetNum==1){
            if(rsp.FromId==GD.role.data.Id){
                //我的宝宝攻击，消耗我的蓝
                // console.log('reduceAg2',skill.NeedAg)
                if(skill.NeedMp>0)GD.player.reduceMp(skill.NeedMp)
                if(skill.NeedAg>0)GD.player.reduceAg(skill.NeedAg)
            }
            if(skill.FireType==FireType.BulletTo){
                GD.curMap&&GD.curMap.fireBulletTo(this,target,rsp.SkillId,cb)
            }else{
                if(skill.FireType==FireType.OnTarget){
                    GD.curMap&&GD.curMap.fireSkillAniAroundUnit(target,skill).then(()=>{cb()})
                }else{
                    cb()
                }
            }
        }else{
            cb()
        }
        // if(isKilled){
        //     target.setDeath()
        //     // this.scheduleOnce(()=>{
        //     //     target.setDeath()
        //     // },0.5)
        // }
        if(this.data&&this.data.Type==4){
            //宝宝攻击动作
            this.ani.play();
        }
        GameManager.I.playMonsterSound(this.base.SoundId,SoundType.Atk)
    }
    // onLoad () {
    //     input.on(Input.EventType.TOUCH_END,this.onClick,this)
    // }
    // onClick(event:EventTouch){
    //     // let p1=event.getLocation()//以左下角为原点
    //     // let p2=event.getUILocation()//以左下角为原点
    //     // let p3=event.getLocationInView()//以左上角为原点
    //     const touch = event.getLocation();
    //     let trans = this.node.getComponent(UITransform);
    //     let pos = CameraControl.I.camera.worldToScreen(this.node.worldPosition)
    //     let rect = new Rect(pos.x-trans.width/2,pos.y,trans.width,trans.height)
    //     if(rect.contains(touch)){
    //         console.log('click!',this.node.name);
    //     }else{
    //         console.log('null!');
    //     }
    // }

    /**
     * 单位朝向某个点
     * @param px 
     * @param py 
     *        4
     *      3   5
     *    2   *   6
     *      1   7
     *        0
      */
    public lookAtPos(px:number,py:number){
        // let pos=this.node.position
        // if(px>pos.x){
        //     this.direction=0
        // }else{
        //     this.direction=1
        // }

        // const dx:number = px - this.node.position.x;
        // const dy:number = py - this.node.position.y;

        // const moveAngle:number = Math.atan2(dy,dx);
        // let dire:number = Math.round((-moveAngle + Math.PI)/(Math.PI / 4));
        // // this.direction = dire > 5 ? dire-6 : dire+2;
        // this.AniController.currentDirection = dire;
    }

    /**
     * 单位望向目标对象
     * @param target 
     */
    // public lookAtTarget(target:Node){
    //     // const dir:Vec3 = target.position.clone().subtract(this.node.position);
    //     const dx:number = target.position.x - this.node.position.x;
    //     const dy:number = target.position.y - this.node.position.y;
    //     const moveAngle:number = Math.atan2(dy,dx);
    //     const dire:number = Math.round((-moveAngle + Math.PI)/(Math.PI / 4));
    //     this.direction = dire > 5 ? dire-6 : dire+2;
    // }
}


