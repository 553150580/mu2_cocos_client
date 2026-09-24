
import { _decorator, Vec3, BoxCollider2D, ProgressBar, Node, Sprite, MotionStreak, Animation, AnimationState, tween, RichText, UITransform, Label } from 'cc';
import MovieClip from '../utils/MovieClip';
import { BattleManager, MapCellWidth } from './BattleManager';
import { UIMgr } from '../managers/UIMgr';
import { UnitState, RoleType, Skill, FireType, ct, UseSkillResult, UnitType, Unit, BodyType, EquipType, TargetType, Point, PkMode, SkillType, DmgType, DmgLabel, MapPkMode } from '../base/types';
import GD from '../base/GameData';
import { MonsterControl } from './MonsterControl';
import Tools from '../base/tools';
import { CameraControl } from './CameraControl';
import { BaseComponent } from '../base/BaseComponent';
import WS from '../base/net';
import { ConfigType, MT } from '../base/MT';
import GameManager from '../managers/GameManager';
import { NoTargetAtNeiborStr, CosRad1, SinRad1 } from '../base/consts';
import Pools from '../base/Pools';
const { ccclass, property } = _decorator;


//是玩家自己还是其它玩家
export enum PlayerType{
    Me,
    Other
}

@ccclass('PlayerControl')
export class PlayerControl extends BaseComponent {
    @property(Sprite)
    chengHao:Sprite
    @property(Node)
    dian:Node
    @property(Sprite)
    chengHaoLv:Sprite
    @property(RichText)
    nameLabel:RichText
    @property(MovieClip)
    movieClip:MovieClip
    @property(ProgressBar)
    hpBar:ProgressBar
    @property(ProgressBar)
    sdBar:ProgressBar
    // @property(Node)
    // buffEffectLayer:Node=null
    // @property(MovieClip)
    // idle_clip:MovieClip;
    // @property(MovieClip)
    // walk_clip:MovieClip;
    @property(Node)
    effectLayer:Node
    @property(Node)
    skillLayer:Node
    @property(Sprite)
    wing:Sprite
    @property(Sprite)
    left_foot:Sprite
    @property(Sprite)
    right_foot:Sprite
    @property(Sprite)
    leftHand:Sprite
    @property(Sprite)
    left_weapon:Sprite
    @property(Sprite)
    leg:Sprite
    // @property(Sprite)
    // right_leg:Sprite
    @property(Sprite)
    body:Sprite
    @property(Sprite)
    rightHand:Sprite
    @property(Sprite)
    right_weapon:Sprite
    @property(Sprite)
    head:Sprite
    @property(Sprite)
    shield:Sprite
    @property(Sprite)
    jianTong:Sprite
    @property(MovieClip)
    beAtkedEffect:MovieClip;
    @property(Node)
    enemySign:Node
    @property(Node)
    huDun:Node
    @property(Node)
    sd_dun:Node
    @property(Node)
    otherBox:Node
    @property(Node)
    shopBox:Node
    @property(Label)
    shopName:Label

    isShop:boolean=false;
    motion:MotionStreak
    setMoveMotion(play:boolean){
        if(play){
            this.motion.enabled=GD.playMoveMotion
        }else{
            this.motion.enabled=false
        }
    }

    ani:Animation
    sdDunAni:Animation
    skillNodePool:Map<number,Node>=new Map();
    //龙骨动画模式
    // @property(dragonBones.ArmatureDisplay)
    // armatureDisplay: dragonBones.ArmatureDisplay = null;
     // private ani: dragonBones.AnimationState = null;
    isJoystickMoving:boolean=false
    playerType:PlayerType=PlayerType.Me;
    unitType:UnitType=UnitType.Player;
    roleType:RoleType //角色职业类型0,1,2,3,4,5,6
    selectedUnit:Unit
    needAddDmgLabels:Array<DmgLabel>

    private scheduleAddDmgLabels(){
        if(this.needAddDmgLabels.length>0){
            let label = this.needAddDmgLabels.pop()
            let node = label.label.node;
            node.parent=GD.curMap.dmgLabelLayer;
            let com = node.getComponent(BaseComponent)
            let y = node.position.y+200;
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
    startScheduleDmgLabels=()=>{
        this.needAddDmgLabels=[]
        this.schedule(this.scheduleAddDmgLabels,0.1)
    }
    stopScheduleDmgLabels=()=>{
        this.needAddDmgLabels=[]
        this.unschedule(this.scheduleAddDmgLabels)
    }
    //for other
    data:outer_pb.IOtherRoleInfo;
    // skills:Map<number,Skill>;
    targetPos:Vec3=new Vec3();
    /**
     * 方向值范围为 0-7，方向值设定如下，0是下，1是左下，2是左，3是左上，4是上，5是右上，6是右，7是右下
     *        4
     *      3   5
     *    2   *   6
     *      1   7
     *        0
     */
    // private _direction:number=0;
    // public set direction(value:number){
    //     this._direction = value;
    //     switch(this._direction){
    //         case 0 : 
    //             this.movieClip.rowIndex = 0;
    //             break;
    //         case 1 : 
    //             this.movieClip.rowIndex = 4;
    //             break;
    //         case 2 : 
    //             this.movieClip.rowIndex = 1;
    //             break;
    //         case 3 : 
    //             this.movieClip.rowIndex = 6;
    //             break;
    //         case 4 : 
    //             this.movieClip.rowIndex = 3;
    //             break;
    //         case 5 : 
    //             this.movieClip.rowIndex = 7;
    //             break;
    //         case 6 : 
    //             this.movieClip.rowIndex = 2;
    //             break;
    //         case 7 : 
    //             this.movieClip.rowIndex = 5;
    //             break;
    //     }
    // }
    private _state:UnitState=UnitState.Idle
    get state():UnitState{
        return this._state;
    }
    set state(value:UnitState){
        if(this._state == value){
            return;
        }
        this._state = value;
        // this.movieClip.node.active = false; //停掉旧的
        // let skin:string = 'skin_idle';
        this.unschedule(this.playMoveSound)
        if(value==UnitState.Moving){
            this.ani.play(this.walkAni)
            this.lastSendPos.x=this.x
            this.lastSendPos.y=this.y
            // skin = 'skin_walk'
            if(this.playerType==PlayerType.Me){
                this.unschedule(this.setAuto);
                UIMgr.I.switchAuto(false);
                this.schedule(this.playMoveSound,0.5)
            }
        }else if(value==UnitState.Idle){
            this.ani.play()
            // skin = 'skin_idle'
            if(this.playerType==PlayerType.Me&&GD.role.data.IsAuto==false){
                this.unschedule(this.setAuto);
                this.scheduleOnce(this.setAuto,30);
            }
        }
        // else if(value==UnitState.Atking){
        //     skin = 'skin_atk'
        // }else if(value==UnitState.Death){
        //     skin = 'skin_death'
        // }

        // this.movieClip = this.node.getChildByName(skin).getComponent(MovieClip);
        // this.direction = this._direction;
        // this.movieClip.node.active = true;
        // this.movieClip.playIndex = 0;
        // this.movieClip.playAction();
    }
    setAuto(){
        if(GD.role.data.IsAuto==false){
            UIMgr.I.switchAuto(true)
        }
    }
    playMoveSound(){
        GameManager.I.playTipSound('walk')
    }
    // protected start(): void {
         //龙骨动画模式
        // this.ani = this.armatureDisplay.playAnimation("down", 0);
        // this.ani.stop();
        //===============键盘控制模式=========
        // this._keyCodeMap[KeyCode.KEY_W] = false;
        // this._keyCodeMap[KeyCode.KEY_A] = false;
        // this._keyCodeMap[KeyCode.KEY_S] = false;
        // this._keyCodeMap[KeyCode.KEY_D] = false;
        // //速度矩阵
        // let sqrt = Math.cos(45);
        // this.speedMat = [
        //     [v2(-sqrt, sqrt), v2(0, 1), v2(sqrt, sqrt)],
        //     [v2(-1, 0), v2(0, 0), v2(1, 0)],
        //     [v2(-sqrt, -sqrt), v2(0, -1), v2(sqrt, -sqrt)]
        // ]
        // //按键事件
        // input.on(Input.EventType.KEY_DOWN,this.onKeyDown,this);
        // input.on(Input.EventType.KEY_UP,this.onKeyUp,this);
    // }
    onAniFinished(type: Animation.EventType, state: AnimationState) {
        this.ani.play();//播放默认的idle动画
    }
    onSdAniFinished(type: Animation.EventType, state: AnimationState) {
        this.sd_dun.active=false;
    }
    tryStopSdAni=()=>{
        // if(this.ani.getState(this.sdAni).isMotionless){
        //     this.ani.getState(this.sdAni).play();
        // }
        this.ani.resume();
    }
    atkAni:string;
    atkAni_gjs:string;
    walkAni:string;
    // sdAni:string;
    init(role:any,playerType:PlayerType) {
        // this.sd_dun.active=false;
        this.ani = this.node.getComponent(Animation);
        this.ani.on(Animation.EventType.FINISHED, this.onAniFinished, this);
        this.sdDunAni = this.sd_dun.getComponent(Animation);
        this.sdDunAni.on(Animation.EventType.FINISHED, this.onSdAniFinished, this);
        // this.ani.resume();
        this.atkAni = this.ani.clips[1].name;
        // this.sdAni = this.ani.clips[2].name
        this.atkAni_gjs = this.ani.clips[2].name;
        this.walkAni = this.ani.clips[3].name;
        this.playerType=playerType;
        let collider = this.node.getComponent(BoxCollider2D)
        this.motion=this.node.getComponent(MotionStreak);
        let chIdLv:Array<number>=[]
        if(playerType==PlayerType.Me){
            collider.tag=99;
            this.opacity=255;
            this.node.active=true;
            if(this.handAtkObj==null){
                this.handAtkObj = outer_pb.UseSkill.create();
            }
            this.curSkill = GD.role.skills.get(GD.role.data.NormalAtkSkillId)
            this.resetMyAllUIBars();
            this.updateAllEquipUI(GD.role.BodyEquips,GD.role.data.RoleType,false);
            UIMgr.I.setAtkBtnSkillSkin(this.curSkill);
            this.enemySign.active = false;
            chIdLv = GD.role.data.ChIdLv;
            // this.data=null;
        }else{
            chIdLv = role.ChIdLv;
            collider.tag=98;
            let other = role as outer_pb.OtherRoleInfo;
            this.data = other;
            this.hpBar.progress = other.CurHp/other.MaxHp;
            this.sdBar.progress = other.CurSd/other.MaxSd;
            let pos:Vec3 = this.node.position;

            let rotatePos = Tools.cellPosToPxPos_Rotate45(other.I,other.J)
            pos.x=rotatePos.x
            pos.y=rotatePos.y
            this.node.setPosition(pos);
            this.updateAllEquipUI(other.BodyEquips,other.RoleType,true);
            this.refreshEnemySign()
        }
        //竞技场内不显示称号
        if(GD.curMap.isPkMap) chIdLv=null;
        this.refreshNameLabel(role)
        this.refreshChengHaoUI(chIdLv)
        this.refreshHudun();
    }
    protected onDisable(): void {
        this.unschedule(this.caculateExp);
    }
    stopCaculateExp(){
        this.unschedule(this.caculateExp);
    }
    lastCaculateExpTime:number;
    startScheduleCaculateExpPer=()=>{
        this.unschedule(this.caculateExp);
        this.lastCaculateExpTime = Date.now()/1000>>0;
        GD.role.expFromMonster=0;
        GD.role.tjDmg=0;
        this.schedule(this.caculateExp,1.0);
    }
    caculateExp=()=>{
        let deltaT = (Date.now()/1000>>0) - this.lastCaculateExpTime;
        let expPer=0
        let dmgPer=0
        if(deltaT>0){
            expPer = Math.floor(GD.role.expFromMonster/deltaT);
            dmgPer = Math.floor(GD.role.tjDmg/deltaT);
        }
        UIMgr.I.updateExpPerUI(expPer,dmgPer);
    }
    updateAllEquipUI(bodyEquips:any,roleType:RoleType,isOther:boolean){
        for(let type=BodyType.Head;type<BodyType.Pet;type++){
            let equip:outer_pb.Equip = bodyEquips[type]
            let id:number
            let qhLv:number=0;
            if(equip){
                if(isOther||Tools.checkCanDress(equip)){
                    id = equip.Id
                    qhLv=equip.QhLv;
                }
            }
            this.updateEquipUI(id,type,roleType,qhLv)
        }
    }
    updateEquipUI(equipId:number,bodyType:BodyType,roleType:RoleType,qhLv:number=0){
        switch(bodyType){
            case BodyType.Foot:
                Tools.refreshRoleEquipUI(this.left_foot,equipId,bodyType,roleType,'_1',qhLv)
                Tools.refreshRoleEquipUI(this.right_foot,equipId,bodyType,roleType,'_2',qhLv)
                break;
            case BodyType.Hand://护手
                Tools.refreshRoleEquipUI(this.leftHand,equipId,bodyType,roleType,'_1',qhLv)
                Tools.refreshRoleEquipUI(this.rightHand,equipId,bodyType,roleType,'_2',qhLv)
                break;
            case BodyType.LeftHand: //weapon
                Tools.refreshRoleEquipUI(this.left_weapon,equipId,bodyType,roleType,'',qhLv)
                break;
            case BodyType.Leg:
                Tools.refreshRoleEquipUI(this.leg,equipId,bodyType,roleType,'',qhLv)
                // Tools.refreshRoleEquipUI(this.right_leg,equipId,bodyType,roleType,'_2',qhLv)
                break;
            case BodyType.Body:
                Tools.refreshRoleEquipUI(this.body,equipId,bodyType,roleType,'',qhLv)
                break;
            case BodyType.Head:
                Tools.refreshRoleEquipUI(this.head,equipId,bodyType,roleType,'',qhLv)
                break;
            case BodyType.RightHand://盾牌、箭筒、武器
                if(equipId){
                    let equipType = equipId/10000>>0
                    if(equipType==EquipType.Shield){
                        Tools.refreshRoleEquipUI(this.shield,equipId,bodyType,roleType,'',qhLv)
                        Tools.refreshRoleEquipUI(this.right_weapon,null,bodyType,roleType,'',qhLv)
                        Tools.refreshRoleEquipUI(this.jianTong,null,bodyType,roleType,'',qhLv)
                    }else if(equipType==EquipType.JianTong){
                        Tools.refreshRoleEquipUI(this.jianTong,equipId,bodyType,roleType,'',qhLv)
                        Tools.refreshRoleEquipUI(this.right_weapon,null,bodyType,roleType,'',qhLv)
                        Tools.refreshRoleEquipUI(this.shield,null,bodyType,roleType,'',qhLv)
                    }else{
                        Tools.refreshRoleEquipUI(this.right_weapon,equipId,bodyType,roleType,'',qhLv)
                        Tools.refreshRoleEquipUI(this.shield,null,bodyType,roleType,'',qhLv)
                        Tools.refreshRoleEquipUI(this.jianTong,null,bodyType,roleType,'',qhLv)
                    }
                }else{
                    Tools.refreshRoleEquipUI(this.right_weapon,equipId,bodyType,roleType,'',qhLv)
                    Tools.refreshRoleEquipUI(this.shield,equipId,bodyType,roleType,'',qhLv)
                    Tools.refreshRoleEquipUI(this.jianTong,equipId,bodyType,roleType,'',qhLv)
                }
                break;
            case BodyType.Wing:
                Tools.refreshRoleEquipUI(this.wing,equipId,bodyType,roleType,'',qhLv)
                break;
            default:
                break;
        }
    }
    refreshNameLabel(role:any){
        let zm = role.Zm;
        let name = role.Name;
        let color=ct.white;
        if(role.GoldYk>Date.now()/1000>>0){
            color=ct.yellow
        }
        let rp = 0;
        if(this.playerType==PlayerType.Me){
            rp = GD.role.basePros.RedPoint
        }else{
            rp = role.RedPoint;
        }
        if (zm !=''){
            zm = `<color=${ct.blue}>[${zm}]</>`
        }
        const isPkEnemy = GD.curMap.isPkModeMap&&role.TeamId!=GD.role.data.TeamId;
        if(isPkEnemy||rp>=GD.configs.get(ConfigType.RedNameRedPointNum)){
            color=ct.red
        }else if(rp>=300){
            color=ct.brown
        }else if(rp<0){
            color=ct.blue
        }
        this.otherBox.active=!this.isShop;
        this.shopBox.active=this.isShop;
        if(this.isShop){
            this.shopName.string=''
            const str = `[${name}] 的摊位`;
            this.shopName.string = str;
            this.shopBox.getComponent(UITransform).width = str.length*14+20//this.shopName.node.getComponent(UITransform).width;
        }else{
            let sid = '';
            if(GD.curMap.mapData.IsKf){
                sid=`<color=${ct.brown}>S${role.Sid}-</>`
            }
            this.nameLabel.string = ''
            this.nameLabel.string = `<outline color=black width=2>${sid}${zm}<color=${color}>${name}</></>`;
        }
        
    }
    refreshChengHaoUI(idLv:Array<number>){
        if(idLv==null||idLv.length!=2||idLv[0]==0){
            this.chengHao.spriteFrame = null;
            this.chengHaoLv.spriteFrame = null;
            this.dian.active=false
        }else{
            this.dian.active=true
            Tools.loadSpriteFrame(`ui/chengHao/${idLv[0]}`,GD.commonBundle).then(sp=>{
                if(sp)this.chengHao.spriteFrame = sp;
            })
            Tools.loadSpriteFrame(`ui/chengHao/lv${idLv[1]}`,GD.commonBundle).then(sp=>{
                if(sp)this.chengHaoLv.spriteFrame = sp;
            })
        }
    }
    refreshHudun(){
        let ht = 0;
        if(this.playerType==PlayerType.Me){
            ht =GD.role.basePros.HuDunTime
        }else{
            ht=this.data.HuDunTime;
        }
        this.huDun.active = ht>Date.now()/1000>>0
    }
    refreshEnemySign(){
        let n = GD.role.basePros.EnemyList[this.data.Id]
        this.enemySign.active = n!=null;
    }
    handAtkObj:outer_pb.UseSkill;
    moveDir:Vec3 = new Vec3(0,0,0);
    
    curSkill:Skill;
    update(dt: number) {
        if(this.playerType==PlayerType.Me){
            if(this.state==UnitState.Moving&&GD.curMap.isPkModeMap){
                //像other一样移动
                this.updateOtherPos(dt);
            }
            //自动状态下，客户端啥也不做，由服务器下发消息
            if(GD.role.data.IsAuto) return;
            if(this.state==UnitState.Idle){
                //啥也不做
            }else if(this.state==UnitState.Moving){
                if(this.isJoystickMoving){
                    this.joystickTo(dt)
                }else if(this.path.length>2){
                    this._playerNaveTo(dt)
                }
            }else if(this.state==UnitState.Atking){
                // if(this.selectedUnit){
                    // if(GD.curMap.mapCells[GD.role.data.I][GD.role.data.J]==1){
                    //     this.lostTarget()
                    //     return
                    // }
                    // let now=Date.now();
                    // if(now>GD.role.nextAtkTime){
                    //     //和服务端一样，检测攻击技能列表，哪个可用用哪个
                    //     for(let i=0;i<GD.role.atkSkills.length;i++){
                    //         let skill = GD.role.atkSkills[i]
                    //         if(now>skill.NextUseTime){
                    //             if(this.tryUseSkill(skill,false)){
                    //                 break;
                    //             }
                    //         }
                    //     }
                    // }
                // }else{
                //     this.lostTarget();
                // }
            }
        }else{
            if(this.state==UnitState.Moving){
                this.updateOtherPos(dt);
            }
        }
    }
    updateOtherPos(dt:number){
        const pos:Vec3 = this.node.position;
        const dx:number = this.targetPos.x - pos.x;
        const dy:number = this.targetPos.y - pos.y;
        // const speed:number = MapCellWidth/(this.data.MoveInterval/dt)*0.9;
        let data = this.data
        if(this.playerType==PlayerType.Me){
            data=GD.role.data;
        }
        const speed:number = data.MoveInterval*(dt*1000)*0.95;
        if(dx * dx + dy * dy > speed * speed){
            const angle = Math.atan2(dy,dx);
            // let dir:number = Math.round((-angle + Math.PI)/(Math.PI / 4));
            // this.direction = dir > 5 ? dir-6 : dir+2;
            pos.x += (Math.cos(angle) * speed)>>0;
            pos.y += (Math.sin(angle) * speed)>>0;
        }else{
            this.state=UnitState.Idle;
            pos.x = this.targetPos.x;
            pos.y = this.targetPos.y;
        }
        this.node.position = pos;
    }
    otherMoveTo=(i:number,j:number,x:number,y:number)=>{
        this.targetPos.x = x
        this.targetPos.y = y
        if(this.playerType==PlayerType.Me){
            GD.role.data.I=i
            GD.role.data.J=j
        }else{
            this.data.I = i
            this.data.J = j
        }
        // other.direction = rsp.Dir;
        this.state=UnitState.Moving
    }
    lastSendMoveTime:number=0;
    lastSendPos:Vec3=new Vec3();
    joystickTo(dt:number){
        //摇杆移动（优先于寻路）
        //播放动画
        // let h = Math.round(this.moveDir.x),v = Math.round(this.moveDir.y);
        // if(h==-1){
        //     if(v==1){
        //         this.direction=3
        //     }else if(v==-1){
        //         this.direction=1
        //     }else{
        //         this.direction=2; //如果是龙骨，则直接播放 this.playAnimate("left");
        //     }
        // }else if(h==1){
        //     if(v==1){
        //         this.direction=5
        //     }else if(v==-1){
        //         this.direction=7
        //     }else{
        //         this.direction=6
        //     }
        // }else if(h==0&&v==1){
        //     this.direction=4
        // }else if(h==0&&v==-1){
        //     this.direction=0
        // }
        const data = GD.role.data
        // const speed:number = MapCellWidth/((data.MoveInterval+0.01)/dt);
        const speed:number = data.MoveInterval*(dt*1000);//速度x时间 (像素/ms)
        let vx = this.moveDir.x*speed>>0;
        let vy = this.moveDir.y*speed>>0;
        let pos:Vec3 = this.node.position;
        const newX=pos.x+vx;
        const newY=pos.y+vy
        // 逆向旋转45度（逆时针旋转矩阵）
        const rotatedX = newX * CosRad1 - newY * SinRad1;
        const rotatedY = newX * SinRad1 + newY * CosRad1;
        const i = Math.floor(GD.curMap.mapHeight / 2 - rotatedY/ MapCellWidth);
        const j = Math.floor(rotatedX / MapCellWidth + GD.curMap.mapWidth / 2);
        //判断是否碰到障碍
        if(i<0||j<0||i>=GD.curMap.mapHeight||j>=GD.curMap.mapWidth||GD.curMap.mapCells[i][j]>1){
            return
        }
        pos.x = newX
        pos.y = newY
        this.node.setPosition(pos)

        //走到了新格子内
        if(data.I!=i || data.J!=j){
            data.I=i
            data.J=j
            if(this.playerType==PlayerType.Me){
                UIMgr.I.mapPosLabel.string=`(${i},${j})`;
                GD.curMap&&GD.curMap.updateMapTiles()
            }
        }
        //判断是否需要发送
        //（210ms=12帧,speed=MapCellWidth/(GD.role.moveInterval/dt)=像素/帧
        this.lastSendMoveTime+=dt
        if(this.lastSendMoveTime>0.20){
            this.lastSendMoveTime=0
            let dis = Tools.get2dis_pix(pos.x,pos.y,this.lastSendPos.x,this.lastSendPos.y)
            if(dis>0){
                this.lastSendPos.x=pos.x
                this.lastSendPos.y=pos.y
                //发送
                this.sendMove(i,j,pos.x,pos.y)
                // let movePbObj = outer_pb.HandMoveToPos.create()
                // movePbObj.I=i;
                // movePbObj.J=j;
                // movePbObj.X=pos.x>>0;
                // movePbObj.Y=pos.y>>0;
                // // this.movePbObj.Dir=this._direction;
                // let buff = outer_pb.HandMoveToPos.encode(movePbObj).finish();
                // WS.send(MT.HandMoveToPos,buff)
            }
        }
    }
    path:Array<number> = []
    pathIndex:number=2;
    isNearToTarget:boolean=false;
    clickMoveTo(pos:Vec3,isPixPos:boolean){
        if(this.state!=UnitState.Death){
            GD.role.data.IsAuto=false
            if(isPixPos){ //像素坐标
                const point=Tools.pxPosToCellPos(pos.x,pos.y)
                this.tryNaveToCell(point.I,point.J)
            }else{
                this.tryNaveToCell(pos.x,pos.y);//x,y就是i,j
            }
        }
    }
    tryNaveToCell(i:number,j:number){
        if(this.state==UnitState.Moving){
            this._naveToCell(i,j,false)
            // this.doEndMove()
            // this.scheduleOnce(()=>{
            //     this._naveToCell(i,j)
            // },0.1)
        }else{
            this._naveToCell(i,j,true)
        }
    }
    private _naveToCell(i:number,j:number,resetTime:boolean){
        //判断是否i、j是否合法
        if(i<0||j<0||i>=GD.curMap.mapHeight||j>=GD.curMap.mapWidth||GD.curMap.mapCells[i][j]>1){
            // UIMgr.I.sm('该位置有障碍不可达')
            this.path=[];
            this.state=UnitState.Idle;
            return
        }
        const data = GD.role.data
        if(data.I!=i || data.J!=j){
            this.path=[]
            this.pathIndex=2;
            if(GD.curMap.astar.findPath(data.I,data.J,i,j,this.path)){
                if(this.state!=UnitState.Moving){
                    this.state=UnitState.Moving
                    WS.send(MT.StartMove,GD.EmptyRequestBuff)
                }
                if(resetTime){
                    this.lastSendMoveTime=0;
                }
                this.isNearToTarget=false;
                // WS.send(MT.StartMove,GD.EmptyRequestBuff)
            }
        }
    }
    //主角网格寻路移动
    lastSendClickCell:Point=new Point(0,0);
    private _playerNaveTo(dt:number){
        if(this.state==UnitState.Death){
            return
        }
        if(this.pathIndex<this.path.length){
            const data = GD.role.data
            let i = this.path[this.pathIndex]
            let j = this.path[this.pathIndex+1]
            // if(GD.curMap.mapCells[i][j]>1){
            //     //动态避障（重新寻路到目标点）
            //     if(this.pathIndex<this.path.length-1){
            //         this.naveToCell(this.path[this.path.length-2],this.path[this.path.length-1])
            //     }
            //     return;
            // }
            const pos:Vec3 = this.node.position;
            //目标格子位置
            let targetPos = Tools.cellPosToPxPos_Rotate45(i,j)
            const dx:number = targetPos.x - pos.x;
            const dy:number = targetPos.y - pos.y;
            //=====================================================
            const distSq = dx*dx+dy*dy;
            // if(distSq < 1e-6){  //distSq === 0 用严格等于有时会因浮点问题失灵，建议用小阈值判断
            //     //已经在目的地
            //     return
            // }
            const dist = Math.sqrt(distSq)
            const travel  = data.MoveInterval*dt*1000
            if(travel>=dist){
                //越过或刚好到达目的地时，直接设置为目标位置
                pos.x=targetPos.x;
                pos.y=targetPos.y;
                this.pathIndex+=2
                data.I=i
                data.J=j
                UIMgr.I.mapPosLabel.string=`(${i},${j})`;
                GD.curMap&&GD.curMap.updateMapTiles()
            }else{
                //按比例移动（避免使用角度）
                const t = travel/dist
                pos.x += dx*t;
                pos.y += dy*t;
            }
            this.node.position = pos;
            // const angle = Math.atan2(dy,dx);
            // let dir:number = Math.round((-angle + Math.PI)/(Math.PI / 4));
            // this.direction = dir > 5 ? dir-6 : dir+2;
            //=====================================================
            // const speed:number = data.MoveInterval*dt*1000; //速度x时间 (像素/ms)
            // const angle = Math.atan2(dy,dx);
            // // let dir:number = Math.round((-angle + Math.PI)/(Math.PI / 4));
            // // this.direction = dir > 5 ? dir-6 : dir+2;
            // pos.x += (Math.cos(angle) * speed)>>0;
            // pos.y += (Math.sin(angle) * speed)>>0;
            // this.node.position = pos;
            // if(dx * dx + dy * dy <= speed * speed){
            //     this.pathIndex+=2
            //     data.I=i
            //     data.J=j
            //     UIMgr.I.mapPosLabel.string=`(${i},${j})`;
            // }
            //==========================================================
             //判断是否需要发送
            //（210ms=12帧,speed=MapCellWidth/(GD.role.moveInterval/dt)=像素/帧
            this.lastSendMoveTime+=dt
            if(this.lastSendMoveTime>0.2){
                this.lastSendMoveTime=0
                let dis = Tools.get2dis_pix(pos.x,pos.y,this.lastSendPos.x,this.lastSendPos.y)
                if(dis>0){
                    this.lastSendPos.x=pos.x
                    this.lastSendPos.y=pos.y
                    //发送
                    this.sendMove(i,j,pos.x,pos.y)
                }
            }
        }else{
            this.doEndMove()
        }
    }
    private doEndMove(){
        this.pathIndex+=2
        // data.I=i
        // data.J=j
        // UIMgr.I.mapPosLabel.string=`(${i},${j})`;
        this.state=UnitState.Idle
        this.path=[];
        if(this.isNearToTarget){
            this.isNearToTarget=false
            // this.state=UnitState.Atking;
            if(this.curSkill){
                this.tryUseSkill(this.curSkill)
                this.state=UnitState.Atking;
            }
        }
        let movePbObj = outer_pb.HandMoveToPos.create()
        movePbObj.I=GD.role.data.I;
        movePbObj.J=GD.role.data.J;
        movePbObj.X=this.x>>0;
        movePbObj.Y=this.y>>0;
        movePbObj.IsEnd=true;
        let buff = outer_pb.HandMoveToPos.encode(movePbObj).finish();
        // WS.send(MT.EndMove,buff)
        WS.send(MT.HandMoveToPos,buff)
    }
    sendMove=(i:number,j:number,x:number,y:number)=>{
        let moveObj = outer_pb.HandMoveToPos.create({
            I:i,
            J:j,
            X:x>>0,
            Y:y>>0,
        })
        const buf=outer_pb.HandMoveToPos.encode(moveObj).finish()
        WS.send(MT.HandMoveToPos,buf)
    }
    getCellPos():Point{
        if(this.playerType==PlayerType.Other){
            return new Point(this.data.I,this.data.J)
        }else{
            return new Point(GD.role.data.I,GD.role.data.J)
        }
    }
    getRoleId():number{
        if(this.playerType==PlayerType.Me){
            return GD.role.data.Id
        }else{
            return this.data.Id
        }
    }
    //靠近目标（直到攻击距离范围）
    nearToTarget(target:Unit,radius:number){
        //判断是否i、j是否合法
        let pos=target.getCellPos();
        let i:number=pos.I;
        let j:number=pos.J;
        const data = GD.role.data
        if(data.I!=i || data.J!=j){
            let path=[]
            let n = GD.curMap.mapCells[i][j];
            GD.curMap.mapCells[i][j]=0 //为了目标可达，临时设置为0
            let can = GD.curMap.astar.findPath(data.I,data.J,i,j,path);
            GD.curMap.mapCells[i][j]=n //还原
            if(can){
                let len = path.length
                if(len>=(radius+1)*2){
                    this.path = path.slice(0,len-radius*2)
                    this.pathIndex=2;
                    this.lastSendMoveTime=0
                    this.isNearToTarget=true;
                    if(this.state!=UnitState.Moving){
                        this.state=UnitState.Moving
                        WS.send(MT.StartMove,GD.EmptyRequestBuff)
                    }
                }
            }
        }
    }
    lostTarget(){
        this.changeTarget(null)
        this.state=UnitState.Idle;
    }
    private _canUseSkill(skill:Skill,isHandClick:boolean):boolean{
        let now = Date.now()
        if(skill.Id>4){
            const data = GD.role.data
            if(isHandClick){
                if(GD.curMap.mapCells[data.I][data.J]==1){
                    this.lostTarget()
                    UIMgr.I.showProsMsg('安全区无法释放技能',ct.red,true,true)
                    return false;
                }
                let now = Date.now()
                if(now<GD.role.nextAtkTime){
                    // this.lostTarget()
                    UIMgr.I.showProsMsg('攻击冷却时间未到1',ct.red,true,true)
                    return false;
                }
                if(now<skill.NextUseTime){
                    // this.lostTarget()
                    UIMgr.I.showProsMsg('技能冷却时间未到',ct.red,true,true)
                    return false;
                }
            }
            if(skill.NeedMp>0&&GD.role.basePros.CurMp<skill.NeedMp){
                // this.lostTarget()
                if(isHandClick){
                    UIMgr.I.showProsMsg('魔法值不足',ct.red,true,true)
                }
                return false
            }
            if(skill.NeedAg>0&&GD.role.basePros.CurAg<skill.NeedAg){
                // this.lostTarget()
                if(isHandClick){
                    UIMgr.I.showProsMsg('技能值不足',ct.red,true,true)
                }
                return false
            }
        }else if(skill.Id==1&&now<skill.NextUseTime){
            UIMgr.I.showProsMsg('使用血瓶冷却时间未到',ct.red,true,true)
            return false;
        }
        return true;
    }
    tryUseSkill(skill:Skill,isHandClick:boolean=true):boolean{
        if(this._canUseSkill(skill,isHandClick)){
            let now = Date.now()
            let cb = BattleManager.I.skillCallBacks.get(skill.Id)
            if(cb){
                let res = cb(this,skill,now)
                if(res==UseSkillResult.Success){
                    UIMgr.I.resetCd(skill,now)
                }
            }else{
                this._playerHandAtkTarget(skill,now)
            }
            return true;
        }else{
            return false;
        }
    }
    private _playerHandAtkTarget(skill:Skill,now:number){
        if(this.selectedUnit==null){
            this.searchTarget(skill)
        }
        if(skill.NeedTarget){
            let curTarget=this.selectedUnit;
            if(curTarget&&curTarget.node.parent){
                this.lookAtTarget(curTarget.node)
                let pos=curTarget.getCellPos();
                let dis = Tools.get2dis(GD.role.data.I,GD.role.data.J,pos.I,pos.J)
                if(dis>skill.UseDis){
                    this.nearToTarget(curTarget,skill.UseDis)//移动靠近后攻击
                }else{
                    this._sendUseSkill(skill,now,curTarget)
                }
            }
            // else{
            //     this.searchTarget(skill)
            // }
        }else if(skill.TargetType<=TargetType.TeamMenberAndSelf||GD.curMap.monsterList.size+GD.curMap.otherList.size>0){
            this._sendUseSkill(skill,now)
        }else{
            //缺少目标
            UIMgr.I.showProsMsg(NoTargetAtNeiborStr,ct.red,true,true)
            this.lostTarget();
        }
    }
    startAtk(){
        if(this.curSkill){
            this.tryUseSkill(this.curSkill)
        }
        // let skill=this.curSkill;
        // if(skill){
        //     if(this.selectedUnit){
        //         if(this._canUseSkill(skill,true)){
        //             let target=this.selectedUnit
        //             let canUse=true;
        //             //TODO 判断curSkill是否能用在selectedUnit身上
        //             const type = skill.TargetType
        //             if(type==TargetType.Enemy&&!this.isMyEnemy(target)){
        //                 canUse=false
        //             }
        //             if(canUse){
        //                 let pos = target.getCellPos();
        //                 let dis = Tools.get2dis(GD.role.data.I,GD.role.data.J,pos.I,pos.J)
        //                 if(dis>skill.UseDis){
        //                     this.nearToTarget(target,skill.UseDis)//移动靠近后攻击
        //                 }else{
        //                     if(skill.SkillType==SkillType.Atk)this.state = UnitState.Atking
        //                     this._sendUseSkill(skill,Date.now(),target)
        //                 }
        //             }else{
        //                 UIMgr.I.showProsMsg('当前模式无法攻击目标',ct.red,true,true)
        //             }
        //         }
        //     }else{
        //         this.searchTarget(skill)
        //     }
        // }
    }
    isMyEnemy(target:Unit):boolean{
        if(target){
            let role = GD.role.data;
            const pkMode = role.PkMode;
            if(pkMode==PkMode.HePing){
                //和平模式下，只能攻击非宝宝类型的怪物、红名玩家
                if(target.unitType==UnitType.Player){
                    return (target as PlayerControl).data.RedPoint>=GD.configs.get(ConfigType.RedNameRedPointNum)
                }else{
                    return target.unitType==UnitType.Monster&&(target as MonsterControl).data.Type!=4;
                }
            }else if(pkMode==PkMode.Team){
                if(role.TeamId==0){
                    //除了自己的宝宝，其它都是敌人
                    if(target.unitType==UnitType.Monster){
                        let m=target as MonsterControl
                        if(m.data.Type==4&&m.data.Owner==role.Name){
                            return false
                        }
                    }
                    return true;
                }else{
                    //除了队友、自己和队友的宝宝，其它都是敌人
                    if(target.unitType==UnitType.Monster){
                        let m=target as MonsterControl
                        if(m.data.Type==4){
                            if(m.data.Owner==role.Name||GD.role.myTeam.Menbers.some((other:outer_pb.IRoleInfo)=>{return other.Name==m.data.Owner})){
                                return false
                            }
                        }
                    }else{
                        let other=(target as PlayerControl).data;
                        if(other.TeamId>0&&other.TeamId==role.TeamId){
                            return false
                        }
                    }
                    return true;
                }
            }else if(pkMode==PkMode.Team){
                //战盟模式
                if(role.Zm==''){
                    //除了自己的宝宝，其它都是敌人
                    if(target.unitType==UnitType.Monster){
                        let m=target as MonsterControl
                        if(m.data.Type==4&&m.data.Owner==role.Name){
                            return false
                        }
                    }
                    return true;
                }else{
                    //除了盟友、自己和盟友的宝宝，其它都是敌人
                    if(target.unitType==UnitType.Monster){
                        let m=target as MonsterControl
                        if(m.data.Type==4){
                            if(m.data.Owner==role.Name||GD.role.myZm.Menbers.some((other:outer_pb.IZmRoleInfo)=>{return other.Name==m.data.Owner})){
                                return false
                            }
                        }
                    }else{
                        let other=(target as PlayerControl).data;
                        if(other.Zm!=''&&other.Zm==role.Zm){
                            return false
                        }
                    }
                    return true;
                }
            }
        }else{
            return false
        }
    }
    searchTarget(skill:Skill){
        let target:Unit;
        let minDis:number=999;
        const type = skill.TargetType
        const data = GD.role.data
        if(type==TargetType.Enemy){
            if(data.PkMode==PkMode.HePing){
                //和平模式只找红名玩家
                const redP=GD.configs.get(ConfigType.RedNameRedPointNum);
                GD.curMap.otherList.forEach(other=>{
                    let other_data=other.data;
                    if(other_data.TeamId!=data.TeamId&&other_data.RedPoint>=redP){
                        let dis = Tools.get2dis(data.I,data.J,other_data.I,other_data.J)
                        if(dis<minDis){
                            minDis=dis;
                            target=other;
                        }
                    }
                })
            }else{
                GD.curMap.otherList.forEach(other=>{
                    let other_data=other.data;
                    if(other_data.TeamId!=data.TeamId){
                        let dis = Tools.get2dis(data.I,data.J,other_data.I,other_data.J)
                        if(dis<minDis){
                            minDis=dis;
                            target=other;
                        }
                    }
                })
            }
            if(target==null){
                //找怪物
                GD.curMap.monsterList.forEach((m,index)=>{
                    if(m.data.Type!=4){
                        let dis = Tools.get2dis(data.I,data.J,m.data.I,m.data.J)
                        if(dis<minDis){
                            minDis=dis;
                            target=m;
                        }
                    }
                })
            }
        }else if(type==TargetType.Self){
            target=this
        }else{
            //队友或自己
            GD.curMap.otherList.forEach((role,index)=>{
                if(role.data.TeamId>0&&role.data.TeamId==data.TeamId){
                    let dis = Tools.get2dis(data.I,data.J,role.data.I,role.data.J)
                    if(dis<minDis){
                        minDis=dis;
                        target=role;
                    }
                }
            })
            if(target==null){
                target=this
                minDis=0;
            }
        }
        if(target){
            this.changeTarget(target)
            if(minDis>skill.UseDis){
                this.nearToTarget(target,skill.UseDis)//移动靠近后攻击
            }else{
                if(type==TargetType.Enemy){
                    this.state = UnitState.Atking
                }
                // this.tryUseSkill(skill)
                //使用后置空，防止对自己释放增益技能后出现攻击逻辑混乱
                if(target==this){
                    this.selectedUnit=null;
                }
            }
        }else{
            UIMgr.I.showProsMsg(NoTargetAtNeiborStr,ct.red,true,true)
        }
    }
    changeTarget(target:Unit){
        this.selectedUnit&&this.selectedUnit.select(false)
        this.selectedUnit = target
        if(target){
            target.select(true)
            this.lookAtTarget(target.node)
        }
        UIMgr.I.updateTargetBox();
    }
    changeTargetByName(name:string){
        let target:PlayerControl
        GD.curMap.otherList.forEach(p=>{
            if(p.data.Name==name){
                target = p;
            }
        })
        if(target){
            GD.player.changeTarget(target)
            UIMgr.I.showProsMsg(`选中了【${name}】作为目标`,ct.brown)
        }
    }
    trySwitchTarget(unitType:UnitType){
        let minDis:number=99;
        let target:Unit;
        let list:Map<number,Unit>
        if(unitType==UnitType.Monster){
            list = GD.curMap.monsterList;
        }else{
            if(GD.role.data.PkMode==PkMode.Team){
                list = new Map()
                 GD.curMap.otherList.forEach(p=>{
                    if(p.data.TeamId!=GD.role.data.TeamId){
                        list.set(p.data.Id,p)
                    }
                 })
            }else{
                list = GD.curMap.otherList;
            }
        }
        list.forEach(unit=>{
            if(unit!=this.selectedUnit){
                let can=true
                if(unit.unitType==UnitType.Monster){
                    if((unit as MonsterControl).data.Type==4){
                        can=false
                    }
                }
                if(can){
                    let pos=unit.getCellPos();
                    let dis = Tools.get2dis(GD.role.data.I,GD.role.data.J,pos.I,pos.J)
                    if(dis<minDis){
                        minDis=dis;
                        target=unit;
                    }
                }
            }
        })
        if(target){
            this.changeTarget(target)
            GameManager.I.playClickSound();
        }else{
            UIMgr.I.showProsMsg(NoTargetAtNeiborStr,ct.red,true,true)
        }
    }
    private _sendUseSkill(skill:Skill,now:number,curTarget:Unit=null){
        if(curTarget){
            //需要指定一个目标的技能
            this.handAtkObj.Type=curTarget.unitType||0
            if(curTarget.unitType==UnitType.Monster){
                this.handAtkObj.Index=(curTarget as MonsterControl).data.Index||0;
            }else{
                this.handAtkObj.Id=(curTarget as PlayerControl).getRoleId()||0;
            }
        }
        UIMgr.I.resetCd(skill,now)
        this.handAtkObj.SkillId=skill.Id
        // console.log('sendUseSkill',this.handAtkObj.Type,this.handAtkObj.Id,this.handAtkObj.Index)
        let buff = outer_pb.UseSkill.encode(this.handAtkObj).finish();
        WS.send(MT.UseSkill,buff)
        this.handAtkObj.Index=0;
        this.handAtkObj.Id=0;
        //自动变手动
        if(GD.role.data.IsAuto) GD.role.changeAuto(false)
    }
    playAtkAni=()=>{
        let ani:string
        if(this.roleType==RoleType.GJS){
            ani=this.atkAni_gjs
        }else{
            ani=this.atkAni
        }
        this.ani.play(ani);
    }
    //攻击当前目标
    onRoleDmgUnit=(skill:Skill,curTarget:Unit,rsp:any,otherDmg:number,isKilled:boolean=false)=>{
        this.lookAtTarget(curTarget.node);
        if(skill==null){
            //skillId==0表示反伤
            Tools.showDmg(curTarget,this,rsp,otherDmg,isKilled)
        }else{
            if(skill.TargetNum==1){
                GameManager.I.playEffectSound('skill_'+skill.SoundId)
                this.playAtkAni();
                if(this.playerType == PlayerType.Me){
                    // console.log('reduceAg_me2',skill.NeedAg)
                    UIMgr.I.resetSkillSlotCd(skill,Date.now(),skill.Id==this.curSkill.Id);
                    if(skill.NeedMp>0)this.reduceMp(skill.NeedMp)
                    if(skill.NeedAg>0)this.reduceAg(skill.NeedAg)
                    if(skill.AddLj>0)this.addLjValue(skill.AddLj)
                }
                if(skill.FireType==FireType.BulletTo){
                    GD.curMap.fireBulletTo(this,curTarget,skill.Id,()=>{
                        Tools.showDmg(curTarget,this,rsp,otherDmg,isKilled)
                    })
                }else{
                    if(skill.FireType==FireType.OnTarget){
                        GD.curMap.fireSkillAniAroundUnit(curTarget,skill).then(()=>{
                            Tools.showDmg(curTarget,this,rsp,otherDmg,isKilled)
                        })
                    }else{
                        Tools.showDmg(curTarget,this,rsp,otherDmg,isKilled)
                    }
                }
            }else{
                Tools.showDmg(curTarget,this,rsp,otherDmg,isKilled)
            }
        }
    }
    playDeathSound(){
        let sound:string;
        if(this.roleType==RoleType.GJS||this.roleType==RoleType.ZHS){  //弓箭手
            sound='roleDie2'
        }else{
            sound='roleDie1'
        }
        GameManager.I.playTipSound(sound)
    }
    startHandAtk(){
        const now = Date.now();
        for(let i=0;i<GD.role.atkSkills.length;i++){
            let skill = GD.role.atkSkills[i]
            if(now>skill.NextUseTime){
                if(this.tryUseSkill(skill)){
                    break;
                }
            }
        }
    }
    select(isSelected:boolean){}
    changePosTo(i:number,j:number,isSuiJiChange:boolean=false){
        const data = GD.role.data
        data.I=i
        data.J=j
        let pos:Vec3 = this.node.position;
        let rotatePos = Tools.cellPosToPxPos_Rotate45(i,j)
        pos.x=rotatePos.x
        pos.y=rotatePos.y
        // console.log('changePosTo',i,j,pos)
        // pos.x = (j-(GD.curMap.mapWidth>>1))*MapCellWidth+MapCellWidth/2;
        // pos.y = ((GD.curMap.mapHeight>>1)-i)*MapCellWidth+MapCellWidth/2;

        // pos.x = ((i-(GD.curMap.mapWidth/2>>0))*MapCellWidth+MapCellWidth/2)>>0;
        // pos.y = ((j-(GD.curMap.mapHeight/2>>0))*MapCellWidth+MapCellWidth/2)>>0;
        this.node.setPosition(pos);
        this.lastSendPos.x = pos.x;
        this.lastSendPos.y = pos.y;
        this.lastSendMoveTime=0;
        if(this.playerType==PlayerType.Me){
            UIMgr.I.mapPosLabel.string=`(${i},${j})`;
        }
        CameraControl.I.node.position=this.node.position.clone();
        if(isSuiJiChange&&this.path.length>4){
            i = this.path[this.path.length-2]
            j = this.path[this.path.length-1]
            if(data.I!=i || data.J!=j){
                this.path=[]
                this.pathIndex=2;
                if(GD.curMap.astar.findPath(data.I,data.J,i,j,this.path)){
                    this.isNearToTarget=false
                    this.lastSendMoveTime=0
                    this.state=UnitState.Moving
                    WS.send(MT.StartMove,GD.EmptyRequestBuff)
                }
            }
        }else{
            this.path=[];
            this.state=UnitState.Idle;
        }
    }
    // changePixPosTo(x:number,y:number){
    //     // console.log('changePixPosTo')
    //     const point=Tools.pxPosToCellPos(x,y)
    //     const i = point.I
    //     const j = point.J
    //     // const i = (GD.curMap.mapHeight/2>>0)-(y/MapCellWidth>>0);
    //     // const j = (x/MapCellWidth>>0)+(GD.curMap.mapWidth/2>>0);

    //     // const i = Math.floor((x)/MapCellWidth)+(GD.curMap.mapWidth/2>>0);
    //     // const j = Math.floor((y)/MapCellWidth)+(GD.curMap.mapHeight/2>>0);
    //     GD.role.data.I=i
    //     GD.role.data.J=j
    //     let pos:Vec3 = this.node.position;
    //     pos.x=x
    //     pos.y=y
    //     this.node.setPosition(pos);
    //     if(this.playerType==PlayerType.Me){
    //         UIMgr.I.mapPosLabel.string=`(${i},${j})`;
    //     }
    // }
    startJoystickMove(){
        this.isJoystickMoving=true
        this.path=[]
        this.state=UnitState.Moving
        this.lastSendMoveTime=0
        WS.send(MT.StartMove,GD.EmptyRequestBuff)
    }
    stopJoystickMove(isCancelStick:boolean){
        if(isCancelStick){
            //如果是抬起摇杆取消的移动，则发送更新最后停止位置
            let movePbObj = outer_pb.HandMoveToPos.create()
            movePbObj.I=GD.role.data.I;
            movePbObj.J=GD.role.data.J;
            movePbObj.X=this.x>>0;
            movePbObj.Y=this.y>>0;
            movePbObj.IsEnd=true;
            let buff = outer_pb.HandMoveToPos.encode(movePbObj).finish();
            WS.send(MT.HandMoveToPos,buff)
            // WS.send(MT.EndMove,buff)
        }
        this.state=UnitState.Idle
        this.isJoystickMoving=false
    }
    refreshEffectUi(buffInfos:{[k: string]: outer_pb.IBuffInfo;},isMy:boolean=false){
        this.effectLayer.children.forEach(node=>{
            node.active = !!buffInfos[node.name]
        })
        if(isMy){
            GD.role.buffs=[]
            for(let id in buffInfos){
                let info = GD.allBuffs.get(parseInt(id))
                if(info){
                    info.curNum=buffInfos[id].Num
                    info.expireTime=buffInfos[id].Time
                    GD.role.buffs.push(info)
                }
            }
        }
    }
    setDeath=()=>{
        if(this.playerType==PlayerType.Other){
            this.data&&GD.curMap.deleteOther(this.data.Id,false)
        }else{
            if(GD.curMap.isPkModeMap){
                GD.curMap.recoverPlayer()
            }else{
                UIMgr.I.showDeathUI();
            }
        }
        this.playDeathSound();
        this.setMoveMotion(false)
        this.state=UnitState.Death;
    }
    setFullHp(){
        if(this.playerType==PlayerType.Other){
            this.changeOtherHp(this.data.MaxHp)
        }else{
            GD.role.basePros.CurHp = GD.role.lastMaxHp
            this.hpBar.progress = GD.role.basePros.CurHp/GD.role.lastMaxHp;
            UIMgr.I.refreshHpUI()
            UIMgr.I.updateTeamList()
        }
    }
    setFullMp(){
        if(this.playerType==PlayerType.Me){
            GD.role.basePros.CurMp = GD.role.lastMaxMp
            UIMgr.I.refreshMpUI()
        }
    }
    lvUp(rsp:outer_pb.LvUpInfo){
        GD.role.lvUp(rsp)
        this.resetMyAllUIBars()
        this.startScheduleCaculateExpPer();
    }
    //only for other
    changeOtherHp(cur:number,max:number=0){
        if(this.data){
            if(max>0)this.data.MaxHp = max;
            this.data.CurHp = cur;
            this.hpBar.progress = cur/this.data.MaxHp;
            if(GD.role.myTeam&&this.data.TeamId==GD.role.myTeam.TeamId)UIMgr.I.updateTeamList()
            if(GD.player.selectedUnit==this) UIMgr.I.updateTargetBox();
        }
    }
    otherGetHp(num:number){
        let cur = Math.min(num+this.data.CurHp,this.data.MaxHp)
        this.changeOtherHp(cur)
    }
    otherGetSd(num:number){
        let cur = Math.min(num+this.data.CurSd,this.data.MaxSd)
        this.changeOtherSd(cur)
    }
    //only for other
    changeOtherSd(cur:number,max:number=0){
        if(this.data){
            if(max>0)this.data.MaxSd = max;
            this.data.CurSd = cur;
            this.sdBar.progress = cur/this.data.MaxSd;
            if(cur<=0){
                this.playSdPo()
            }
        }
    }
    private playSdPo(){
        GameManager.I.playTipSound('sd0')
        this.sd_dun.active=true;
    }
    //only for my player
    resetMyAllUIBars(){
        const data = GD.role.basePros
        this.hpBar.progress = data.CurHp/GD.role.lastMaxHp;
        this.sdBar.progress = data.CurSd/GD.role.lastMaxSd;
        UIMgr.I.refreshHpUI()
    }
    beAtked=(curHp:number,curSd:number=0)=>{
        if(this.playerType==PlayerType.Me){
            const data = GD.role.basePros
            data.CurHp = curHp
            this.hpBar.progress = data.CurHp/GD.role.lastMaxHp;
            UIMgr.I.refreshHpUI()
            if(curSd){
                data.CurSd = curSd
                this.sdBar.progress = data.CurSd/GD.role.lastMaxSd;
                if(data.CurSd<=0){
                    this.playSdPo()
                }
                UIMgr.I.refreshSdUI()
            }
            UIMgr.I.updateTeamList()
        }else if(this.data){
            this.changeOtherHp(curHp)
            if(curSd>0){
                this.changeOtherSd(curSd)
            }
        }
    }
    // beAtked=(hpDmg:number,sdDmg:number=0)=>{
    //     if(this.playerType==PlayerType.Me){
    //         const data = GD.role.basePros
    //         data.CurHp-=hpDmg
    //         this.hpBar.progress = data.CurHp/GD.role.lastMaxHp;
    //         UIMgr.I.refreshHpUI()
    //         if(sdDmg){
    //             data.CurSd-=sdDmg
    //             this.sdBar.progress = data.CurSd/GD.role.lastMaxSd;
    //             if(data.CurSd<=0){
    //                 this.playSdPo()
    //             }
    //             UIMgr.I.refreshSdUI()
    //         }
    //         UIMgr.I.updateTeamList()
    //     }else if(this.data){
    //         let cur = Math.min(this.data.CurHp-hpDmg,this.data.MaxHp)
    //         this.changeOtherHp(cur)
    //         if(sdDmg>0){
    //             let cur = Math.min(this.data.CurSd-sdDmg,this.data.MaxSd)
    //             this.changeOtherSd(cur)
    //         }
    //     }
    // }
    addLjValue(num:number){
        const base = GD.role.basePros
        if(base.RoleTypeLv>=2){
            base.LjValue+=(num+base.GetLjNum)*(1+base.GetLjUp)>>0
            if(base.LjValue>5000)base.LjValue=5000;
            UIMgr.I.refreshLjBar()
        }
    }
    reduceMp(num:number){
        if(GD.curMap.mapId==777){
            num = num/2>>0;
        }
        GD.role.basePros.CurMp-=num
        UIMgr.I.refreshMpUI()
    }
    reduceAg(num:number){
        GD.role.basePros.CurAg-=num
        UIMgr.I.refreshAgUI()
    }
    reduceSd(num:number){
        const data = GD.role.basePros
        data.CurSd-=num
        this.sdBar.progress = data.CurSd/GD.role.lastMaxSd;
        UIMgr.I.refreshSdUI()
    }
    relife(){
        this.setMoveMotion(true)
        this.hpBar.progress=1;
        this.sdBar.progress=1;
        const data = GD.role.basePros
        data.CurHp=GD.role.lastMaxHp;
        data.CurMp=GD.role.lastMaxMp;
        data.CurAg=GD.role.lastMaxAg;
        data.CurSd=GD.role.lastMaxSd;
        this.state=UnitState.Idle;
        UIMgr.I.showDeathView.active=false;
        UIMgr.I.refreshHpMpSdAgUI();
    }
    
    public lookAtPos(px:number,py:number){
        // const dx:number = px - this.node.position.x;
        // const dy:number = py - this.node.position.y;

        // const moveAngle:number = Math.atan2(dy,dx);
        // const dire:number = Math.round((-moveAngle + Math.PI)/(Math.PI / 4));
        // this.direction = dire > 5 ? dire-6 : dire+2;
    }
    
    public lookAtTarget(target:Node){
        // const dx:number = target.position.x - this.node.position.x;
        // const dy:number = target.position.y - this.node.position.y;
        // const moveAngle:number = Math.atan2(dy,dx);
        // const dire:number = Math.round((-moveAngle + Math.PI)/(Math.PI / 4));
        // this.direction = dire > 5 ? dire-6 : dire+2;
    }
    
    // private playAnimate(name:string){
    //     if(this.ani.name == name && this.ani.isPlaying) return;
    //     this.ani = this.armatureDisplay.playAnimation(name,0);
    // }
    //================键盘控制角色移动=========================
    // private _keyCodeMap = {};
    // private speedMat: Vec2[][];
    // private isKeyMode:boolean=false;
    // onDestroy(){
    //     input.off(Input.EventType.KEY_DOWN,this.onKeyDown,this);
    //     input.off(Input.EventType.KEY_UP,this.onKeyUp,this);
    // }
    // private onKeyDown(e:EventKeyboard){
    //     this.isKeyMode=true;
    //     this._keyCodeMap[e.keyCode] = true;
    // }
    // private onKeyUp(e:EventKeyboard){
    //     this.isKeyMode=false;
    //     this._keyCodeMap[e.keyCode] = false;
    // }
    // updateByKey(dt:number){
    //     let h = 1,v = 1;
    //     if(this._keyCodeMap[KeyCode.KEY_A]){
    //         h -= 1;
    //     }
    //     if(this._keyCodeMap[KeyCode.KEY_D]){
    //         h += 1;
    //     }
    //     if(this._keyCodeMap[KeyCode.KEY_W]){
    //         v -= 1;
    //     }
    //     if(this._keyCodeMap[KeyCode.KEY_S]){
    //         v += 1;
    //     }
        
    //     let inputx = this.speedMat[v][h].x;
    //     let inputy = this.speedMat[v][h].y;

    //     const right = this.node.right.clone().multiplyScalar(inputx);
    //     const up = this.node.up.clone().multiplyScalar(inputy);
    //     const newInputXY = right.add(up).normalize();
        
    //     // const speed = this._keyCodeMap[KeyCode.SHIFT_LEFT] ? this.speed * 2 : this.speed;
    //     let x = this.node.position.x;
    //     let y = this.node.position.y;

    //     x += this.speed * dt * newInputXY.x;
    //     y += this.speed * dt * newInputXY.y;

    //     this.node.setPosition(x,y,0);

    //     if(v == 1 && h == 1 && this._state.isPlaying){
    //         this._state.stop();
    //     }else if(v > 1){
    //         this.playAnimate("down");
    //     }else if(v < 1){
    //         this.playAnimate("up");
    //     }else if(h > 1){
    //         this.playAnimate("right");
    //     }else if(h < 1){
    //         this.playAnimate("left");
    //     }
    // }
}