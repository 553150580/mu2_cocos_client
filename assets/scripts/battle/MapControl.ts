
import { _decorator, Animation, AssetManager, assetManager, CCBoolean, CCInteger, Component, director, instantiate, Label, Node, Prefab, Quat,  resources,  Sprite, SpriteFrame, sys, tween, UITransform, Vec3 } from 'cc';
import { PlayerControl, PlayerType } from './PlayerControl';
import { CameraControl } from './CameraControl';
import GameManager from '../managers/GameManager';
import GD from '../base/GameData';
import JoystickControl from './JoystickControl';
import { MiniMapControl } from './MiniMapControl';
import { BattleManager, MapCellWidth } from './BattleManager';
import { MonsterControl } from './MonsterControl';
import Pools from '../base/Pools';
import AStar from '../base/AStar';
import { BoxMsg, ct, DmgColor, DmgLabel, DmgType, FbType, FireType, LightType, MapData, ResetPosType, Skill, SoundType, Unit, UnitState, UnitType } from '../base/types';
import { BaseComponent } from '../base/BaseComponent';
import { PageType, UIMgr } from '../managers/UIMgr';
import Tools from '../base/tools';
import MovieClip from '../utils/MovieClip';
import WS from '../base/net';
import { ConfigType, Err, MT } from '../base/MT';
import { DropItemControl } from './DropItemControl';
import { CosRad1, SinRad1, TooManyRedPointInfo } from '../base/consts';
import { ChengHaoPage } from '../pages/ChengHaoPage';

const { ccclass, property } = _decorator;

@ccclass('MapControl')
export class MapControl extends Component {
    @property(CCInteger)
    mapId:number;
    @property(Node)
    floorNode:Node;
    @property(Node)
    floorBg:Node;
    // @property(Node)
    // badArea:Node;
    // @property(Node)
    // safeArea:Node;
    @property(Node)
    monsterPoints:Node;
    // @property(Node)
    // doors:Node;
    @property(Node)
    bossPoints:Node;
    @property(Node)
    spawnPointNode:Node;
    @property(Node)
    skillEffectLayer:Node
    @property(Node)
    dmgLabelLayer:Node
    @property(Node)
    entityLayer:Node;

    hasBoss:boolean=false;
    lineLv:number=1;
    mapName:string='';
    isPkModeMap:boolean=false;
    astar:AStar
    //附近怪物
    monsterList:Map<number,MonsterControl>=new Map();
    //附近其它玩家
    otherList:Map<number|Long|null,PlayerControl>=new Map();
    //附近摊位
    otherShops:Map<number,PlayerControl>=new Map();
    //附近地板上的物品
    dropItemList:Map<string,DropItemControl>=new Map();
    
    player:PlayerControl = null;
    // spawnPoint:Point;
    mapData:MapData;
    mapCells:Array<Array<number>>;
    mapWidth:number;
    mapHeight:number;
    mapBgPathId:number;
    // floorBgColor:string;
    bigMapSpriteFrame:{sp:SpriteFrame,path:string};
    // mapBgBundle:AssetManager.Bundle;
    bgTrans:UITransform;
    // protected onLoad(): void {
    //     this.floorBgColor = this.floorBg.getComponent(Sprite).color.toHEX();
    //     this.bgTrans = this.floorNode.getComponent(UITransform)
    //     this.mapWidth = this.bgTrans.width/MapCellWidth>>0;
    //     this.mapHeight = this.bgTrans.height/MapCellWidth>>0;
    // }
    init():Promise<any>{
        // this.floorBgColor = this.floorBg.getComponent(Sprite).color.toHEX();
        this.bgTrans = this.floorNode.getComponent(UITransform)
        this.mapWidth = this.bgTrans.width/MapCellWidth>>0;
        this.mapHeight = this.bgTrans.height/MapCellWidth>>0;
        return new Promise((resolve,reject)=>{
            this.mapData = GD.MapList.get(this.mapId)
            //初始化网格数据，如果已经初始化过了，则不需要再初始化
            if(this.mapData){
                this.mapName = this.mapData.Name;
                this.mapCells=this.mapData.MapCells;
                // this.monsterPoints.removeFromParent()
                this.initStep2(resolve)
            }else{
                reject('mapControl.init err this.mapId='+this.mapId)
            }
        })
    }
    initStep2=(resolve:any)=>{
        //让所有实体朝向镜头
        this.entityLayer.children.forEach((v)=>{
            let pos:Vec3 = v.getPosition();
            const origX = pos.x * CosRad1 - pos.y * SinRad1;
            const origY = pos.x * SinRad1 + pos.y * CosRad1;
            //算出i,j
            const i = Math.floor(this.mapHeight/2-origY/MapCellWidth);//只能用Math.floor，因为负数的>>与正数表现不一致
            const j = Math.floor(origX/MapCellWidth+this.mapWidth/2);
            if(this.mapCells[i][j]==2){
                //把该实体放在对应格子中间
                let p = Tools.cellPosToPxPos_Rotate45(i,j)
                pos.x=p.x
                pos.y=p.y
                v.setPosition(pos)
            }
            if(v.name.startsWith('door')){
                //只让传送门的光柱、提示文字朝向镜头
                v.children[1].setRotationFromEuler(BattleManager.I.cameraNode.eulerAngles);
                // v.children[1].children[0].setRotationFromEuler(BattleManager.I.cameraNode.eulerAngles);
            }else{
                v.setRotationFromEuler(BattleManager.I.cameraNode.eulerAngles);
            }
        });
        //让传送门的光柱、提示文字朝向镜头
        // this.doors.children.forEach((v)=>{
        //     v.children[1].setRotationFromEuler(this.cameraNode.eulerAngles);
        // });
        //初始化A*寻路
        this.astar = new AStar()
        this.astar.outFilter = (i,j):boolean=>{
            if(i<0||j<0||i>=this.mapHeight||j>=this.mapWidth||this.mapCells[i][j]>1){
                return false
            }else{
                return true
            }
        }
        // const platform = sys.platform;
        // // 判断是否在 Android 原生应用中
        // if (platform === sys.Platform.ANDROID) {
        //     console.log("Android 原生应用");
        // }
        // // 判断是否在 iOS 原生应用中
        // else if (platform === sys.Platform.IOS) {
        //     console.log("iOS 原生应用");
        // }
        // // 判断是否在手机浏览器中
        // else if (sys.isMobile && platform === sys.Platform.BROWSER) {
        //     console.log("手机浏览器环境");
        // }
        // let bundlePath=''
        // //判断是否在非手机浏览器中，非手机浏览器中直接使用大图（手机浏览器使用地图切片）
        // if(sys.platform==sys.Platform.MOBILE_BROWSER){
        //     bundlePath='web'
        // }else{
        //     //加载高清floor地图
        //     bundlePath='big'
        // }
        let id = this.mapId
        let pathId = this.mapId
        if(id>509&&id<=515){
            pathId=509;//卡利玛1-7
        }else if(id>601&&id<=650){
            pathId=601;//恶魔1-10
        }else if(id>651&&id<700){
            pathId=651;//血色1-10
        }else if(id>701&&id<=707){
            pathId=701;//远古战场
        }else if(id>801&&id<807){
            pathId=801;//秘境
        }
        GameManager.I.playMusic('map'+pathId);
        this.mapBgPathId=pathId;
        const url = `map/bg_mini/${pathId}_mini/spriteFrame`;
        GD.commonBundle.load(url, SpriteFrame, (err, sp) => {
            if(err){return;}
            this.floorBg.getComponent(Sprite).spriteFrame=sp;
            let path=this.mapId+'';
            this.bigMapSpriteFrame={sp,path};
            if(GD.player){
                this.player = GD.player;
                this.onInit();
                resolve(1)
            }else{
                Tools.loadPrefab(`prefabs/roles/role`,GD.commonBundle).then((pf:Prefab)=>{
                    this.player = instantiate(pf).getComponent(PlayerControl);
                    GD.player = this.player;
                    this.onInit();
                    resolve(1)
                })
            }
        });
    }
    onInit=()=>{
        // GD.player=this.player;
        this.player.roleType = GD.role.data.RoleType;
        this.player.init(GD.role.data,PlayerType.Me);
        let node = this.player.node;
        node.parent = this.entityLayer;
        this.player.tryStopSdAni();
        node.setRotationFromEuler(BattleManager.I.cameraNode.eulerAngles);
        JoystickControl.I.bindPlayer(this.player)
        CameraControl.I.bindPlayer(this.player)
        MiniMapControl.I.bindPlayer(this.player,this)
        this.registNetCallBacks();
    }
    // bigMapBgBundle:AssetManager.Bundle;
    // loadBigMapBg():Promise<any>{
    //     return new Promise(resolve=>{
    //         assetManager.loadBundle('web',(err,bundle)=>{
    //             this.bigMapBgBundle=bundle;
    //             let id = this.mapId
    //             let pathId = this.mapId
    //             if(id>509&&id<=515){
    //                 pathId=509;//卡利玛1-7
    //             }else if(id>601&&id<=650){
    //                 pathId=601;//恶魔1-10
    //             }else if(id>651&&id<700){
    //                 pathId=651;//血色1-10
    //             }
    //             bundle.load(`mapBg/${pathId}/spriteFrame`, SpriteFrame,(error:Error,sp:SpriteFrame)=>{
    //                 if(error != null){
    //                     console.error(`加载SpriteFrame资源失败 filePath：${pathId},err=${error}`)
    //                 }else{
    //                     this.floorBg.getComponent(Sprite).spriteFrame=sp;
    //                     let path=this.mapId+'';
    //                     this.bigMapSpriteFrame={sp,path};
    //                     if(GD.player){
    //                         this.player = GD.player;
    //                         this.onInit();
    //                         resolve(1)
    //                     }else{
    //                         Tools.loadPrefab(`prefabs/roles/role`,GD.commonBundle).then((pf:Prefab)=>{
    //                             this.player = instantiate(pf).getComponent(PlayerControl);
    //                             GD.player = this.player;
    //                             this.onInit();
    //                             resolve(1)
    //                         })
    //                     }
    //                 }
    //             })
    //         })
    //     })
    // }
    //==================加载地图切片（手机浏览器）=========================
    private loadedTiles: Map<string, Node> = new Map(); // 已加载图块
    private lastCenterX: number=0.001;//初始值为特殊的非整数，防止首次加载时跳过加载
    private lastCenterY: number=0.001;
    // 配置参数
    private readonly TILE_SIZE = 1024;      // 单图块像素尺寸
    private readonly LOAD_RADIUS = 1;       // 加载半径（周围n圈9宫格） 
    private loadQueue: Array<{ tileX: number, tileY: number }> = [];
    //根据玩家位置更新图块
    updateMapTiles=()=> {
        if(this.bgTrans){
            // console.log('updateMapTiles')
            // 计算当前所在中心图块坐标
            // 使用 worldPosition 更稳健（避免父节点坐标系差异）
            const worldPos = this.player.node.worldPosition;
            // 将玩家世界坐标转换到 floorBg 的本地坐标系（floorBg 已旋转）
            const local = this.bgTrans.convertToNodeSpaceAR(worldPos);
            // let pos = this.player.node.position;
            const centerY = Math.floor((local.x+this.bgTrans.width/2) / this.TILE_SIZE)+1;
            const centerX = 16-Math.floor((-local.y+this.bgTrans.height/2) / this.TILE_SIZE);
            // 如果玩家未离开当前图块，则跳过
            if(centerX == this.lastCenterX && centerY == this.lastCenterY){
                // console.log(`无需加载图块:[${centerX},${centerY}]-[${this.lastCenterX},${this.lastCenterY}]`)
            }else{
                // console.log(`更新地图块：[${centerX},${centerY}]`)
                this.lastCenterX = centerX;
                this.lastCenterY = centerY;
                this.loadSurroundingTiles(centerX, centerY);
                this.unloadDistantTiles(centerX, centerY);
            }
        }
    }
    private loadSurroundingTiles=(centerX: number, centerY: number)=> {
        for (let dx = -this.LOAD_RADIUS; dx <= this.LOAD_RADIUS; dx++) {
          for (let dy = -this.LOAD_RADIUS; dy <= this.LOAD_RADIUS; dy++) {
            const tileX = centerX + dx;
            const tileY = centerY + dy;
            if(tileX<1||tileX>16||tileY<1||tileY>16)continue
            this.loadQueue.push({tileX,tileY})
          }
        }
    }
    protected update(dt: number): void {
        this.processLoadQueue();
    }
    //每帧加载一张
    private processLoadQueue(){
        if (this.loadQueue.length === 0) return;
        const { tileX, tileY } = this.loadQueue.shift()!;
        const sliceName = `${tileX}_${tileY}`;
        // 如果未加载则发起加载
        let key = this.mapBgPathId+'_'+sliceName
        if (!this.loadedTiles.has(key)) {
            // console.log(`添加地图块：[${tileX},${tileY}]`)
            const url = `map/bg_slice/${this.mapBgPathId}/slices/${sliceName}/spriteFrame`;
            GD.webBundle.load(url, SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    // console.error(`Failed to load ${url}`, err);
                    return;
                }
                // 创建图块节点
                let tileNode:Node;
                if(Pools.mapBlockPool.length>0){
                    tileNode = Pools.mapBlockPool.pop()
                }else{
                    tileNode = instantiate(BattleManager.I.mapBlockPrefab);
                }
                let sp=tileNode.getComponent(Sprite)
                sp.spriteFrame = spriteFrame;
                // sp.color.fromHEX(this.floorBgColor);
                // 设置位置（根据图块坐标计算）
                const x = (tileY-1) * this.TILE_SIZE + this.TILE_SIZE/2-this.bgTrans.width/2;
                const y = ((tileX-1) * this.TILE_SIZE + this.TILE_SIZE/2)-this.bgTrans.height/2;
                tileNode.setPosition(x,y);
                this.floorBg.addChild(tileNode);
                this.loadedTiles.set(key, tileNode); 
                // 下一帧继续处理
                // this.scheduleOnce(() => this.processLoadQueue());
            });
        }
    }
    //卸载远处图块
    private unloadDistantTiles=(currentX: number, currentY: number) =>{
        this.loadedTiles.forEach((tileNode, tileKey) => {
            // 解析图块坐标
            const coords = tileKey.split('_');
            if (!coords) return;
            const tileX = parseInt(coords[1]);
            const tileY = parseInt(coords[2]);
            // 计算与当前位置的距离
            const distance = Tools.get2dis(tileX,tileY,currentX,currentY)
            // 超出加载半径则卸载
            if (distance > this.LOAD_RADIUS) {
                tileNode.removeFromParent();
                //卸载资源(切换地图时再卸载？)
                // tileNode.getComponent(Sprite).spriteFrame.decRef()
                // resources.release(tileKey);
                Pools.mapBlockPool.push(tileNode)
                // if(Pools.mapBlockPool.length<10){
                //     Pools.mapBlockPool.push(tileNode)
                // }else{
                //     tileNode.destroy();
                // }
                this.loadedTiles.delete(tileKey);
            }
        });
    }
    //==============curMap net callbacks==================
    registNetCallBacks(){
        WS.cbs.set(MT.RoleAtkRole,this.onRoleAtkRole)
        WS.cbs.set(MT.NewOtherIntoMySeeDis,this.onNewOtherIntoMySeeDis)
        WS.cbs.set(MT.OtherMoveTo,this.onOtherMoveTo)
        WS.cbs.set(MT.DeleteOther,this.onDeleOtherPlayer)
        WS.cbs.set(MT.OtherChangeTeamId,this.onOtherChangeTeamId)
        WS.cbs.set(MT.OtherLvUp,this.onOtherLvUp)
        
        WS.cbs.set(MT.MoveToPos,this.onMoveToPos)
        WS.cbs.set(MT.ResetPos,this.onResetPos)
        WS.cbs.set(MT.PlayerLvUp,this.onPlayerLvUp)
        WS.cbs.set(MT.DeleteDropItem,this.onDelete1DropItem)
        WS.cbs.set(MT.ChangePosFailed,this.onChangePosFailed)
        WS.cbs.set(MT.TryPickUpOneDropItem,this.onTryPickUpOneDropItem)

        WS.cbs.set(MT.DeleteMonster,this.onDelete1Monster)
        WS.cbs.set(MT.MonsterStartMoveTo,this.onMonsterStartMoveTo)
        WS.cbs.set(MT.NewMonsterIntoMySeeDis,this.onNewMonsterIntoMySeeDis)
        WS.cbs.set(MT.PlayerBeAtkByMonster,this.onPlayerBeAtkByMonster)
        WS.cbs.set(MT.MonsterBeKilled,this.onMonsterBeKilled)

        WS.cbs.set(MT.MonsterGetBuffDmg,this.onMonsterGetBuffDmg)
        WS.cbs.set(MT.PlayerGetBuffDmg,this.onPlayerGetBuffDmg)
       
        WS.cbs.set(MT.MonsterBeAtkedByPlayer,this.onMonsterBeAtkedByPlayer)
        WS.cbs.set(MT.MonsterBeHealed,this.onMonsterBeHealed)
        WS.cbs.set(MT.MonsterBeAtkedByMonster,this.onMonsterBeAtkedByMonster)
        
        WS.cbs.set(MT.AutoGetHpMpAgSd,this.onAutoGetHpMpAgSd)
        WS.cbs.set(MT.RoleBeHealedByRole,this.onRoleBeHealedByRole)
        WS.cbs.set(MT.FireBuffSkill,this.onFireOneTargetBuffSkill)
        WS.cbs.set(MT.UpdateBuffs,this.onUpdateBuffs)
        WS.cbs.set(MT.GoToPosImmediate,this.onGoToPosImmediate)
        WS.cbs.set(MT.UseItem,this.onUseItem)
        WS.cbs.set(MT.UseSkill,this.onUseSkill)
        WS.cbs.set(MT.GoToMapPoint,this.onGoToMapPoint)
        WS.cbs.set(MT.UpdatePkEnemyList,this.onUpdatePkEnemyList)
        WS.cbs.set(MT.BackHome,this.onBackHome)
        WS.cbs.set(MT.FbIsOver,this.OnFbIsOver)
        WS.cbs.set(MT.ChangeChengHaoId,this.onChengHaoChanged)
        WS.cbs.set(MT.WorldBossIsRelive,this.onWorldBossIsRelive)
        WS.cbs.set(MT.SetWorldBossDeath,this.onSetWorldBossDeath)
        WS.cbs.set(MT.RoleDrop1EquipAfterBeKilled,this.onRoleDrop1EquipAfterBeKilled)
        // WS.cbs.set(MT.ClientHeartBeat,this.onClientHeartBeat)
        // WS.cbs.set(MT.ResendMoveAct,this.onResendMove)
        // WS.cbs.set(MT.EndMove,this.onEndMove)
    }
    
    private OnFbIsOver=(d:any)=>{
        UIMgr.I.stopUpdateFbTime();
        let rsp=outer_pb.FbAct.decode(d);
        let name=''
        if(rsp.Type==FbType.FbEm){
            GD.role.ResetDayData.Fb_em=rsp.Data
            name=`恶魔广场${rsp.Data.Lv}层 挑战统计<br/>`
        }else if(rsp.Type==FbType.FbXs){
            GD.role.ResetDayData.Fb_xs=rsp.Data
            name=`血色城堡${rsp.Data.Lv}层 挑战统计<br/>`
        }
        this.recoverAllMonster(true)
        let msgs:Array<BoxMsg>=[]
        msgs.push(new BoxMsg(name,ct.brown)) //
        msgs.push(new BoxMsg(`获得总经验：${rsp.Data.Exp}`,ct.blue))
        let num=0
        for(let k in rsp.Data.Nums){
            num+=rsp.Data.Nums[k]
        }
        msgs.push(new BoxMsg(`获得归属怪物次数：${num}`,ct.blue))
        msgs.push(new BoxMsg(`获得归属Boss次数：${rsp.Data.Boss.length}`,ct.blue))
        UIMgr.I.PopView.showMsgBox(msgs,'关闭')
    }
    onBackHome=(d:any)=>{
        let rsp = outer_pb.UseItemAct.decode(d);
        if(rsp.ErrCode==Err.ErrCode_TooManyRedPoint){
            this.player.opacity=255;
            UIMgr.I.tip(TooManyRedPointInfo)
        }
    }
    // onMonsterLvUp=(d:any)=>{
    //     //宝宝升级
    //     let rsp = outer_pb.MonsterInfo.decode(d);
    //     let m = this.monsterList.get(rsp.Index)
    //     if(m){
    //         m.data=rsp
    //         m.changeHp(rsp.CurHp,rsp.MaxHp)
    //         m.refreshNameLabel()
    //         if(rsp.Owner==GD.role.data.Name) UIMgr.I.showTip(`您的【${m.base.Name}】升级了`,ct.green)
    //     }
    // }
    onGoToMapPoint=(d:any)=>{
        let rsp = outer_pb.JoinLineAct.decode(d);
        if(rsp.ErrCode==Err.ErrCode_NotEnoughGold){
            UIMgr.I.tip('金币不足')
        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughLv){
            UIMgr.I.tip('等级不足')
        }else if(rsp.ErrCode==Err.ErrCode_TooManyRedPoint){
            UIMgr.I.tip(TooManyRedPointInfo)
        }else{
            UIMgr.I.tip('无法移动')
        }
    }
    onUseSkill=(d:any)=>{
        //只有群体技能才会发此消息
        let rsp = outer_pb.UseSkill.decode(d);
        if(rsp.ErrCode==Err.ErrCode_CanNotAtkTarget){
            UIMgr.I.showProsMsg('目标无法被攻击',ct.red,true,true)
            GameManager.I.playErrorSound();
        }else if(rsp.ErrCode==Err.ErrCode_CannotUseItem){
            UIMgr.I.showProsMsg('技能未冷却',ct.red,true,true)
            // GameManager.I.playErrorSound();
        }else{
            let skill = GD.allSkills.get(rsp.SkillId)
            if(skill){
                GameManager.I.playEffectSound('skill_'+skill.SoundId)
                if(rsp.Type==0){
                    //角色使用技能
                    if(rsp.Id==GD.role.data.Id){
                        //玩家自己释放技能
                        this.player.playAtkAni();
                        UIMgr.I.resetSkillSlotCd(skill,Date.now(),skill.Id==this.player.curSkill.Id);
                        if(skill.NeedMp>0)this.player.reduceMp(skill.NeedMp)
                        if(skill.NeedAg>0)this.player.reduceAg(skill.NeedAg)
                        if(skill.AddLj>0)this.player.addLjValue(skill.AddLj)
                        if(skill.Id==72){
                            GD.role.basePros.LjValue=0;
                            UIMgr.I.resetLjValue();
                        }
                        this.unitUseSkill(this.player,skill,rsp)
                    }else {
                        //其它玩家释放技能
                        let other = this.otherList.get(rsp.Id as number)
                        if(other){
                            other.playAtkAni();
                            this.unitUseSkill(other,skill,rsp)
                        }
                    }
                }else{
                    //怪物释放技能
                    if(rsp.Id==GD.role.data.Id){
                        //我的宝宝释放群体技能，消耗我的蓝
                        // console.log('reduceAg1',skill.NeedAg)
                        if(skill.NeedMp>0)this.player.reduceMp(skill.NeedMp)
                        if(skill.NeedAg>0)this.player.reduceAg(skill.NeedAg)
                    }
                    let m = this.monsterList.get(rsp.Index)
                    if(m){
                        GameManager.I.playMonsterSound(m.base.SoundId,SoundType.Atk)
                        this.unitUseSkill(m,skill,rsp)
                    }
                }
            }
        }
    }
    unitUseSkill=(from:Unit,skill:Skill,rsp:outer_pb.UseSkill)=>{
        if(skill.FireType==FireType.AroundSelf){
            this.fireSkillAniAroundUnit(from,skill,skill.Id==42)
        }else {
            if(rsp.TargetsM.length>0){
                rsp.TargetsM.forEach(index=>{
                    let m = this.monsterList.get(index as number)
                    if(m){
                        if(skill.FireType==FireType.BulletTo){
                            this.fireBulletTo(from,m,skill.Id)
                        }else if(skill.FireType==FireType.OnTarget){
                            this.fireSkillAniAroundUnit(m,skill)
                        }
                    }
                })
            }
            if(rsp.TargetsR.length>0){
                rsp.TargetsR.forEach(id=>{
                    let to:Unit;
                    if(id==GD.role.data.Id){
                        to=this.player;
                    }else{
                        to=this.otherList.get(id as number)
                    }
                    if(to){
                        if(skill.FireType==FireType.BulletTo){
                            this.fireBulletTo(from,to,skill.Id)
                        }else if(skill.FireType==FireType.OnTarget){
                            this.fireSkillAniAroundUnit(to,skill)
                        }
                    }
                })
            }
        }
    }
    onUseItem=(d:any)=>{
        let rsp = outer_pb.UseItemAct.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            if(rsp.Id==5&&rsp.Who!=GD.role.data.Id){
                let other = this.otherList.get(rsp.Who)
                if(other){
                    // other.otherGetHp(rsp.AddHp)
                    other.changeOtherHp(rsp.CurHp)
                }
            }else{
                GD.role.reduceItem(rsp.Id,rsp.Num);
                //血瓶、蓝瓶、樱花酒、樱花花瓣、樱花饼
                if(rsp.Id==5||rsp.Id==6||rsp.Id==27||rsp.Id==28||rsp.Id==29){
                    //只有喝血瓶才有CD，喝蓝瓶不需要CD
                    if(rsp.Id==5) UIMgr.I.resetEatBloodCd();
                    GameManager.I.playTipSound('drink')
                }
                if(rsp.Items){
                    GD.role.getItems(rsp.Items,true)
                    // for(let i in rsp.NewItems){
                    //     let id = parseInt(i)
                    //     let num = rsp.NewItems[i]
                    //     GD.role.getItem(id,num,true)
                    // }
                }
                if(rsp.Equips.length>0){
                    rsp.Equips.forEach(equip=>{
                        GD.role.getEquip(equip,true,false,false)
                    })
                    GameManager.I.playTipSound('getItem')
                }
                if(rsp.AddHp) this.changePlayerHp(rsp.CurHp,rsp.AddHp)
                if(rsp.AddMp) this.addPlayerMp(rsp.AddMp)
                // if(rsp.AddGold) GD.role.addGold(rsp.AddGold,false)
                // if(rsp.AddDia) GD.role.addDia(rsp.AddDia,false)
                UIMgr.I.refreshBag();
                if(rsp.Msg)UIMgr.I.tip(rsp.Msg,ct.green);
                if(rsp.BasePros)UIMgr.I.resetRoleBasePros(rsp.BasePros)
                if(rsp.Time>0){
                    //使用了首席增益卡
                    GD.role.basePros.Type=rsp.Type;
                    GD.role.basePros.Time=rsp.Time;
                    GD.role.basePros.IsDia=rsp.IsDia;
                }
                if(rsp.CostDia>0) GD.role.reduceDia(rsp.CostDia)
            }
        }else if(rsp.ErrCode==Err.ErrCode_AtkCdNotOk){
            UIMgr.I.showProsMsg('冷却时间未到');
        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughCap){
            UIMgr.I.showProsMsg('背包满了');
        }else if(rsp.ErrCode==Err.ErrCode_UseItemFailed){
            GD.role.reduceItem(rsp.Id,rsp.Num);
            UIMgr.I.refreshBag();
            UIMgr.I.showProsMsg('使用失败');
        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughDia){
            UIMgr.I.showProsMsg('钻石不足');
        }else if(rsp.ErrCode==Err.ErrCode_CannotUseItem){
            UIMgr.I.showProsMsg('无法使用');
        }else{
            let base = GD.ItemBaseDatas.get(rsp.Id)
            if(base){
                UIMgr.I.showProsMsg(`${base.Name} 不足`);
            }
        }
    }
    changePlayerHp(curHp:number,num:number,inMap:boolean=true){
        if(GD.role.basePros.CurHp>=GD.role.lastMaxHp)return
        GD.role.basePros.CurHp=curHp
        if(GD.role.basePros.CurHp>=GD.role.lastMaxHp)GD.role.basePros.CurHp=GD.role.lastMaxHp;
        this.player.hpBar.progress = GD.role.basePros.CurHp/GD.role.lastMaxHp;
        UIMgr.I.refreshHpUI()
        UIMgr.I.updateTeamList()
        if(inMap){
            this.addDmgFont(this.player,num,DmgType.Green,true)
        }else{
            UIMgr.I.addGetHpMpLabel(num,0)
        }
    }
    addPlayerMp(num:number){
        if(GD.role.basePros.CurMp>=GD.role.lastMaxMp)return
        GD.role.basePros.CurMp+=num
        if(GD.role.basePros.CurMp>=GD.role.lastMaxMp)GD.role.basePros.CurMp=GD.role.lastMaxMp;
        UIMgr.I.refreshMpUI()
        UIMgr.I.addGetHpMpLabel(num,1)
        // let pos = this.player.node.position.clone()
        // pos.y+=50
        // this.addDmgFont(pos,num,2,true)
    }
    onGoToPosImmediate=(d:any)=>{
        let rsp = outer_pb.JoinLineAct.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            if(rsp.NeedDia>0) GD.role.reduceDia(rsp.NeedDia)
            UIMgr.I.backBox.active=true;
            UIMgr.I.tip('执行瞬间到达成功',ct.green);
        }else if(rsp.ErrCode==Err.ErrCode_TooManyRedPoint){
            UIMgr.I.tip(TooManyRedPointInfo)
        }else{
            UIMgr.I.tip('执行瞬间到达失败，钻石不足');
        }
    }
    onUpdateBuffs=(d:any)=>{
        let rsp = outer_pb.UpdateBuffs.decode(d);
        // console.log('onUpdateBuffs',rsp)
        if(rsp.Id>0){
            if(rsp.Id==GD.role.data.Id){
                //发给我自己的
                this.player.refreshEffectUi(rsp.Buffs,true)
                UIMgr.I.updateBuffsUIAndBasePros(rsp)
            }else{
                //别人的
                let other = this.otherList.get(rsp.Id);
                if(other){
                    other.refreshEffectUi(rsp.Buffs)
                    if(rsp.CurHp>0){
                        other.changeOtherHp(rsp.CurHp,rsp.MaxHp)
                    }
                }
            }
        }else if(rsp.Index<0){
            //宝宝的、怪物的
            let m = this.monsterList.get(rsp.Index);
            if(m){
                m.refreshEffectUi(rsp.Buffs)
                if(rsp.CurHp>0){
                    m.changeHp(rsp.CurHp,rsp.MaxHp)
                }
            }
        }
    }
    //根据地图节点数据，生成地图数据
    // createAndCacheMapCells(resolve:any){
    //     Tools.loadSpriteFrame('map/path/path'+this.mapId).then(sp=>{
    //         let tex = sp.texture;
    //         let pixs = Tools.readPixels(tex.getGFXTexture())
    //         this.mapCells=[];
    //         for(let i=0;i<256;i++){
    //             this.mapCells[i]=[]
    //             for(let j=0;j<256;j++){
    //                 const idx = (i * 256 + j) * 4;
    //                 const r = pixs[idx]
    //                 const g = pixs[idx+1]
    //                 const b = pixs[idx+2]
    //                 let v = 0 //0表示可通行
    //                 if(r==0&&g==0&&b==0){
    //                     //黑色为障碍2
    //                     v=2
    //                 }else if(r==255&&g==255&&b==255){
    //                     //白色为安全区1
    //                     v=1
    //                     // console.log(r,g,b)
    //                 }
    //                 this.mapCells[i][j]=v
    //             }
    //         }
    //         Pools.cachedMapDataCells.set(this.mapId,this.mapCells)
    //         this.initStep2(resolve)
    //     })
        // this.mapCells=[];
        // for(let i=0;i<this.mapWidth;i++){
        //     this.mapCells[i]=[]
        //     for(let j=0;j<this.mapHeight;j++){
        //         this.mapCells[i][j]=0
        //     }
        // }
        //地板障碍区
        // this.badArea.children.forEach(child=>{
        //     let area = child.getComponent(UITransform)
        //     let leftI = Math.floor((child.position.x-area.width/2+5)/MapCellWidth)+(this.mapWidth/2>>0);
        //     let rightI = Math.floor((child.position.x+area.width/2-5)/MapCellWidth)+(this.mapWidth/2>>0);
        //     let bottomJ = Math.floor((child.position.y-area.height/2+5)/MapCellWidth)+(this.mapHeight/2>>0);
        //     let topJ = Math.floor((child.position.y+area.height/2-5)/MapCellWidth)+(this.mapHeight/2>>0);
        //     for(let i=leftI;i<=rightI;i++){
        //         for(let j=bottomJ;j<=topJ;j++){
        //             this.mapCells[i][j]=2;
        //         }
        //     }
        // })
        ////安全区(会覆盖地板障碍区)
        // this.safeArea.children.forEach(child=>{
        //     let area = child.getComponent(UITransform)
        //     let leftI = -Math.floor((child.position.y-area.width/2+5)/MapCellWidth)+(this.mapWidth/2>>0);
        //     let rightI = -Math.floor((child.position.y+area.width/2-5)/MapCellWidth)+(this.mapWidth/2>>0);
        //     let bottomJ = Math.floor((child.position.x-area.height/2+5)/MapCellWidth)+(this.mapHeight/2>>0);
        //     let topJ = Math.floor((child.position.x+area.height/2-5)/MapCellWidth)+(this.mapHeight/2>>0);
        //     for(let i=leftI;i<=rightI;i++){
        //         for(let j=bottomJ;j<=topJ;j++){
        //             this.mapCells[i][j]=1;
        //         }
        //     }
        // })
        // //建筑类障碍（始终朝向摄像头）
        // this.entityLayer.children.forEach((n)=>{
        //     let pos:Vec3 = n.getPosition();
        //     let i = -Math.floor(pos.y/MapCellWidth)+(this.mapWidth/2>>0);
        //     let j = Math.floor(pos.x/MapCellWidth)+(this.mapHeight/2>>0);
        //     // pos.x = ((i-(this.mapWidth/2>>0))*MapCellWidth+MapCellWidth/2)>>0;
        //     // pos.y = ((j-(this.mapHeight/2>>0))*MapCellWidth+MapCellWidth/2)>>0;
        //     // n.position = pos
        //     this.mapCells[i][j]=3;
        // });
        // //边界障碍
        // let tex = this.floorBg.getComponent(Sprite).spriteFrame.texture;
        // let pixs = Tools.readPixels(tex.getGFXTexture())
        // for(let i=0;i<256;i++){
        //     for(let j=0;j<256;j++){
        //         const x = j * 32;
        //         const y = i * 32;
        //         const idx = (y * 8192 + x) * 4;
        //         // const idx = (i*256+j)*4*32;
        //         const r = pixs[idx]
        //         const g = pixs[idx+1]
        //         const b = pixs[idx+2]
        //         let v = 0
        //         if((r<10&&g<10&&b<10)||r<20&&g<70&&b<70){
        //             v=2
        //         }
        //         this.mapCells[i][j]=v
        //     }
        // }
        // Pools.cachedMapDataCells.set(this.mapId,this.mapCells)
    // }
    
    private sortZindex(){
        //遮挡排序（不支持旋转镜头）
        const nodes = this.entityLayer.children
        nodes.sort((a, b) => b.y - a.y);
        for (let i = nodes.length-1; i >=0; i--) {
            nodes[i].setSiblingIndex(i);
        }
        //遮挡排序（支持旋转镜头）
        // const worldPosition = this.camera.node.worldPosition;
        // this.entities.children.sort((a,b)=>{
        //     Vec3.subtract(this.d1,a.worldPosition,worldPosition);
        //     Vec3.subtract(this.d2,b.worldPosition,worldPosition);
        //     return this.d2.length() - this.d1.length();
        // })
    }
    updatePlayerChengHaoUi=()=>{
        let req=outer_pb.UseItemAct.create()
        req.Id=GD.role.data.ChIdLv[0]||0
        let buff = outer_pb.UseItemAct.encode(req).finish()
        WS.send(MT.ChangeChengHaoId,buff)
    }
    onChengHaoChanged=(d:any)=>{
        let rsp=outer_pb.UseItemAct.decode(d);
        let role:PlayerControl
        if(rsp.Who==GD.role.data.Id){
            role=this.player;
            GD.role.data.ChIdLv=rsp.ChIdLv
            if(rsp.ErrCode=Err.ErrCode_Success){
                let msg=''
                if(rsp.Id==0){
                    msg='隐藏成功'
                }else{
                    msg='展示成功'
                }
                if(UIMgr.I.curPageType==PageType.ChengHaoPage){
                    UIMgr.I.ChengHaoPage.getComponent(ChengHaoPage).myList.refresh();
                }
                UIMgr.I.tip(msg,ct.green)
            }else{
                UIMgr.I.tip('称号不存在')
            }
        }else{
            role=this.otherList.get(rsp.Who)
        }
        if(role){
            role.refreshChengHaoUI(rsp.ChIdLv)
        }
    }
    //====other==========
    onRoleAtkRole=(d:any)=>{
        let rsp=outer_pb.RoleAtkRole.decode(d);
        // console.log('onRoleAtkRole',rsp)
        const myId = GD.role.data.Id
        let from:PlayerControl
        let to:PlayerControl
        const isKilled=rsp.Result==1
        if(rsp.FromId==myId){
            //我打别人
            from = GD.player
            to = this.otherList.get(rsp.ToId);
            if(isKilled&&to){
                if(rsp.KfJf>0){
                    UIMgr.I.showProsMsg(`成功击败【${to.data.Name}】，获得积分：${rsp.KfJf}`,ct.green)
                }else{
                    UIMgr.I.showProsMsg(`成功击败【${to.data.Name}】`,ct.green)
                }
                to.playDeathSound()
            }
        }else if(rsp.ToId==myId){
            //别人打我
            from = this.otherList.get(rsp.FromId);
            to = GD.player
            if(isKilled&&from){
                if(rsp.KfJf>0){
                    UIMgr.I.showProsMsg(`您被【${from.data.Name}】击败了 ，损失积分：${rsp.KfJf}`,ct.brown)
                }else{
                    UIMgr.I.showProsMsg(`您被【${from.data.Name}】击败了`,ct.brown)
                }
            }
        }else{
            //别人打别人
            from = this.otherList.get(rsp.FromId);
            to = this.otherList.get(rsp.ToId);
            if(isKilled&&to){
                to.playDeathSound()
            }
        }
        let skill = GD.allSkills.get(rsp.SkillId)
        if(skill&&from&&to){
            from.onRoleDmgUnit(skill,to,rsp,0,isKilled)
            if(rsp.Result==2){
                to.setFullHp()
            }else if(rsp.Result==3){
                to.setFullMp()
            }
            //反伤回血
            if(rsp.GetHp>0){
                to.beAtked(rsp.CurHp)
                // to.beAtked(-rsp.GetHp)
                this.addDmgFont(to,rsp.GetHp,DmgType.Green,true)
            }
        }
    }
    addOthers=(others:outer_pb.IOtherRoleInfo[],isShop:boolean=false)=>{
        others.forEach(other=>{
            this.addOther(other,isShop)
        })
    }
    onNewOtherIntoMySeeDis=(d:any)=>{
        let rsp=outer_pb.OtherRoleInfo.decode(d);
        this.addOther(rsp,false)
    }
    addOther(info:outer_pb.IOtherRoleInfo,isShop:boolean){
        // console.log('addOther',info)
        if(isShop==false){
            GD.role.neighborOthers.set(info.Id,info)
            if(GD.role.myTeam&&info.TeamId==GD.role.myTeam.TeamId) UIMgr.I.updateTeamList();
        }
        Tools.getPlayer(info.RoleType).then((other:PlayerControl)=>{
            other.isShop=isShop;
            other.beAtkedEffect.node.active=false;
            other.node.setRotationFromEuler(BattleManager.I.cameraNode.eulerAngles)
            other.init(info,PlayerType.Other);
            let com = other.node.getComponent(BaseComponent)
            com.opacity=0;
            other.node.parent = this.entityLayer;
            if(isShop){
                this.otherShops.set(info.Id,other);
            }else{
                this.otherList.set(info.Id,other);
                other.refreshEffectUi(info.Buffs);
                other.startScheduleDmgLabels()
            }
            tween(com).to(0.5,{opacity:255}).start();
            other.tryStopSdAni();
        });
    }
    onOtherChangeTeamId=(d:any)=>{
        let rsp=outer_pb.OtherRoleInfo.decode(d);
        // console.log('onOtherChangeTeamId',rsp)
        let other = this.otherList.get(rsp.Id);
        if(other){
            other.data = rsp
        }
    }
    onOtherMoveTo=(d:any)=>{
        let rsp=outer_pb.OtherStartMoveTo.decode(d);
        // console.log('onOtherMoveTo',rsp)
        let other = this.otherList.get(rsp.Id);
        if(other){
            other.otherMoveTo(rsp.I,rsp.J,rsp.X,rsp.Y)
        }
    }
    onDeleOtherPlayer=(d:any)=>{
        let rsp=outer_pb.DeleteEntity.decode(d);
        // console.log('onDeleOtherPlayer',rsp)
        this.deleteOther(rsp.Id,false)
    }
    deleteOther=(id:number|Long|null,isShop)=>{
        let list = this.otherList;
        if(isShop){
            list = this.otherShops;
        }
        let other = list.get(id);
        if(other){
            if(isShop==false){
                other.stopScheduleDmgLabels();
                other.unscheduleAllCallbacks();
                if(this.player.selectedUnit==other){
                    this.player.changeTarget(null)
                }
                GD.role.neighborOthers.delete(other.data.Id)
                if(GD.role.myTeam&&other.data.TeamId==GD.role.myTeam.TeamId) UIMgr.I.updateTeamList();
            }
            list.delete(id)
            let com = other.node.getComponent(BaseComponent)
            tween(com).to(0.5,{opacity:0}).call(()=>{
                //call的时候可能已经销毁了地图，该node已经回收
                if(other.node.parent){
                    other.node.removeFromParent()
                    other.data=null;
                    Pools.RolePool.push(other.node);
                    // Pools.otherPool.get(other.roleType).push(other.node);
                }
            }).start();
        }
    }
    onOtherLvUp=(d:any)=>{
        let rsp=outer_pb.OtherRoleInfo.decode(d);
        let other = this.otherList.get(rsp.Id);
        if(other){
            if(other.data.Lv<rsp.Lv||other.data.DsLv<rsp.DsLv){
                GameManager.I.playTipSound('lvUp')
            }
            other.data.Lv=rsp.Lv
            other.data.DsLv=rsp.DsLv
            other.changeOtherHp(rsp.CurHp,rsp.MaxHp)
            other.changeOtherSd(rsp.CurSd,rsp.MaxSd)
        }
    }
    onMonsterBeAtkedByMonster=(d:any)=>{
        let rsp=outer_pb.MonsterBeAtkedByMonster.decode(d);
        // console.log('onMonsterBeAtkedByMonster',rsp)
        let m = this.monsterList.get(rsp.Index);
        if(m){
            let otherM = this.monsterList.get(rsp.FromIndex);
            if(otherM&&rsp.IsFs==false){
                otherM.atkTarget(m,rsp);
            }else{
                //other不在我的视野内时，直接扣血
                m.beAtked(rsp.Dmg)
            }
        }
    }
    onPlayerGetBuffDmg=(d:any)=>{
        let rsp=outer_pb.GetBuffDmg.decode(d);
        let role:PlayerControl
        if(rsp.ToId==GD.role.data.Id){
            role=this.player
        }else{
            role = this.otherList.get(rsp.ToId);
        }
        if(role){
            role.beAtked(rsp.CurHp)
            // role.beAtked(rsp.Dmg)
            if(rsp.FromId==GD.role.data.Id){
                //我造成的，显示伤害数字
                this.addDmgFont(role,rsp.Dmg,8)
            }
        }
    }
    onMonsterGetBuffDmg=(d:any)=>{
        let rsp=outer_pb.GetBuffDmg.decode(d);
        // console.log('onMonsterGetBuffDmg',rsp)
        let m = this.monsterList.get(rsp.Index);
        if(m){
            if(rsp.FromId==GD.role.data.Id){
                //显示伤害数字
                let colorType = 8
                //TODO 根据效果类型，显示不同的颜色，如中毒绿色、燃烧红色
                // if(rsp.BuffId==12||rsp.BuffId==13){
                //     colorType =8
                // }
                this.addDmgFont(m,rsp.Dmg,colorType)
                m.beAtked(rsp.Dmg)
                GD.role.tjDmg+=rsp.Dmg
            }else{
                //直接扣血
                m.beAtked(rsp.Dmg)
            }
        }
    }
    onMonsterBeHealed=(d:any)=>{
        let rsp=outer_pb.MonsterBeHealed.decode(d);
        // console.log('onOtherAtkMonster',rsp)
        let m = this.monsterList.get(rsp.Index);
        if(m){
            let from:Unit
            if(rsp.FromIndex<0){
                from=this.monsterList.get(rsp.FromIndex);
            }else if(rsp.FromId>0){
                if(rsp.FromId==GD.role.data.Id){
                    from=this.player
                    //被我加血
                    //+hp
                    this.addDmgFont(m,rsp.GetHp,DmgType.Green,true)
                }else{
                    from=this.otherList.get(rsp.FromId)
                }
            }
            if(from){
                this.fireBulletTo(from,m,rsp.SkillId,()=>{
                    m.beAtked(-rsp.GetHp)
                })
            }else{
                //other不在我的视野内时，直接回血
                m.beAtked(-rsp.GetHp)
            }
        }
    }
    //====dropItem=======
    seeDis = GD.configs.get(ConfigType.PlayerSeeDis)
    //角色移动时，删除超出视野范围的实体
    // recoverOutOffSeeDisEntity=()=>{
    //     this.dropItemList.forEach(item=>{
    //         const dis=Tools.get2dis(GD.role.data.I,GD.role.data.J,item.data.I,item.data.J)
    //         if(dis>this.seeDis){
    //             item.node.removeFromParent()
    //             Pools.dropItemPool.push(item.node);
    //         }
    //     })
    //     this.monsterList.forEach(m=>{
    //         const dis=Tools.get2dis(GD.role.data.I,GD.role.data.J,m.data.I,m.data.J)
    //         if(dis>this.seeDis){
    //             this.recover1Monster(m)
    //         }
    //     })
    // }
    addDropItems=(items:Array<outer_pb.IDropItem>)=>{
        items.forEach(it=>{
            const dis=Tools.get2dis(GD.role.data.I,GD.role.data.J,it.I,it.J)
            if(dis<=this.seeDis)this.add1DropItem(it)
        })
    }
    onRoleDrop1EquipAfterBeKilled=(d:any)=>{
        let rsp=outer_pb.RoleDropEquip.decode(d);
        if(rsp.DropItem){
            if(rsp.Who==GD.role.data.Id){
                //我掉落的，则删除我的装备
                if(rsp.IsBody){
                    GD.role.BodyEquips[rsp.BodyType]=null
                    GD.player.updateEquipUI(null,rsp.BodyType,GD.role.data.RoleType) //场景的role
                    UIMgr.I.resetRoleBasePros(rsp.BasePros)
                    UIMgr.I.showProsMsg('您掉落了1件装备',ct.red)
                    GameManager.I.playTipSound('getItem');
                }else{
                    GD.role.tryDeleteBagEquip(rsp.DropItem.EquipData.Uid)
                }
            }
            this.add1DropItem(rsp.DropItem)
        }
    }
    add1DropItem=(item:outer_pb.IDropItem)=>{
        // console.log('add1DropItem',item.Uid,item.Owner,item.OwnerTeamId,item)
        let node:Node;
        if(Pools.dropItemPool.length==0){
            node = instantiate(GD.dropItemPrefab);
            node.setRotationFromEuler(BattleManager.I.cameraNode.eulerAngles)
        }else{
            node = Pools.dropItemPool.pop();
        }
        if(node==null)return
        let com = node.getComponent(BaseComponent);
        com.opacity=0;
        // let opacity = node.getComponent(UIOpacity)
        // opacity.opacity=0;
        let ctl = node.getComponent(DropItemControl);
        ctl.data = item;
        let name:string
        let id:number=1
        let iconPath:string='ui/item/'
        let color:ct = ct.white;
        let lightType:LightType=LightType.none;
        let sound:string='getGold';
        if(!item.ItemType){
            //金币
            name=`金币x${item.ItemNum}`;
            color=ct.yellow;
            id=14;
        }else if(item.ItemType==1){
            //装备
            iconPath='ui/equip/'
            sound = 'dropItem'
            let base = GD.EquipBaseDatas.get(item.EquipData.Id);
            name = base.Name
            id = item.EquipData.Id
            if(item.EquipData.QhLv>0){
                name += `+${item.EquipData.QhLv}`
            }
            if(item.EquipData.ZjLv>0){
                name += '+属性'
                color=ct.blue;
                lightType=LightType.blue
            }
            if(item.EquipData.LuckyLv>0){
                name += '+幸运';
                color=ct.blue;
                lightType=LightType.blue
            }
            if(item.EquipData.ZyList.length>0){
                color=ct.green;
                lightType=LightType.green
            }
            if(item.EquipData.TzLv>0){
                color=ct.red;
                lightType=LightType.red
            }
        }else if(item.ItemType==2){
            //道具
            let base = GD.ItemBaseDatas.get(item.ItemId);
            if(base.ItemType==1){
                //宝石
                sound = 'ding'
            }else{
                //材料、技能
                sound = 'dropItem'
            }
            name = base.Name
            id = base.IconId
            color=Tools.getItemColor(item.ItemId);
            lightType=Tools.getItemLightType(item.ItemId)
        }
        if(lightType>LightType.none){
            Tools.loadSpriteFrame("ui/other/light" + lightType,GD.commonBundle).then(sp=>{
                ctl.light.spriteFrame = sp;
                ctl.light.node.active=true;
            })
        }else{
            ctl.light.node.active=false;
        }
        ctl.nameLabel.string = name;
        ctl.nameLabel.color.fromHEX(color);
        ctl.nameLabel.node.parent.getComponent(UITransform).width=name.length*12; 
        this.dropItemList.set(item.Uid,ctl);//先加进去，不然有delete消息时无法及时删除，导致出现卡物品
        let pos:Vec3 = node.position
        let rotatePos = Tools.cellPosToPxPos_Rotate45(item.I,item.J)
        pos.x=rotatePos.x
        pos.y=rotatePos.y
        // pos.x = (item.J-(GD.curMap.mapWidth>>1))*MapCellWidth+MapCellWidth/2;
        // pos.y = ((GD.curMap.mapHeight>>1)-item.I)*MapCellWidth+MapCellWidth/2;

        // pos.x = (item.I-(GD.curMap.mapWidth/2>>0))*MapCellWidth+MapCellWidth/2;
        // pos.y = (item.J-(GD.curMap.mapHeight/2>>0))*MapCellWidth+MapCellWidth/2;
        node.setPosition(pos);

        Tools.loadSpriteFrame(iconPath+id,GD.commonBundle).then(sp=>{
            ctl.icon.spriteFrame = sp;
            node.parent = this.entityLayer;
            if(Date.now()/1000-(item.DropTime as number)<2){
                //刚掉落的道具
                // let com = node.getComponent(BaseComponent)
                let y = pos.y+100
                tween(com).to(0.1,{y:y,opacity:255}).to(0.3,{y:pos.y}).call(ctl.startCollider).start();
                GameManager.I.playTipSound(sound)
            }else{
                //之前就在地板上的道具
                ctl.startCollider();
                tween(com).to(0.5,{opacity:255}).start();
            }
        })
    }
    onDelete1DropItem=(d:any)=>{
        let rsp=outer_pb.DeleteEntity.decode(d);
        let item = this.dropItemList.get(rsp.Uid);
        if(item){
            this.delete1DropItem(item)
        }
    }
    delete1DropItem=(item:DropItemControl)=>{
        // console.log('delete1DropItem',item)
        this.dropItemList.delete(item.data.Uid);
        let com = item.node.getComponent(BaseComponent)
        tween(com).to(0.5,{opacity:0}).call(()=>{
            //call的时候可能已经销毁了地图，该node已经回收
            if(item.node.parent){
                item.node.removeFromParent()
                Pools.dropItemPool.push(item.node);
            }
        }).start();
    }
    onTryPickUpOneDropItem=(d:any)=>{
        let rsp=outer_pb.PickUpOneDropItem.decode(d);
        // console.log('onTryPickUpOneDropItem',rsp.Uid,rsp.Who)
        let item = this.dropItemList.get(rsp.Uid);
        if(item){
            let data = item.data;
            let role:PlayerControl;
            let itemInfo:string
            let color:ct = ct.white;
            let sound:string='getGold'
            const num = data.ItemNum
            if(rsp.Who==GD.role.data.Id){
                //我获得
                role=this.player
                // if(!data.ItemType){
                //     //金币
                //     itemInfo=`金币+${num}`;
                //     color = ct.yellow
                //     GD.role.data.Gold = (GD.role.data.Gold as number) +num;
                //     UIMgr.I.refreshGoldUI();
                // }else 
                if(data.ItemType==1){
                    //装备
                    sound = 'getItem'
                    let equip = data.EquipData
                    let base = GD.EquipBaseDatas.get(equip.Id);
                    itemInfo = `${base.Name}${equip.QhLv>0?' +'+equip.QhLv:''}`
                    GD.role.getBagEquip(equip,true)
                    if(equip.ZjLv>0||equip.YsList.length>0){
                        color = ct.blue
                        itemInfo += `+属性`
                    }
                    if(equip.LuckyLv>0){
                        color = ct.blue
                        itemInfo += `+幸运`
                    }
                    if(equip.ZyList.length>0){
                        color = ct.green
                    }
                    if(equip.TzLv>0){
                        color = ct.red
                    }
                    UIMgr.I.refreshBag();
                }else if(data.ItemType==2){
                    //道具
                    const id = data.ItemId
                    if(id==14){
                        itemInfo=`金币+${num}`;
                        color = ct.yellow
                        GD.role.data.Gold = (GD.role.data.Gold as number) +num;
                        UIMgr.I.refreshGoldUI();
                    }else if(id==15){
                        itemInfo=`钻石+${num}`;
                        color = ct.qing
                        GD.role.data.Dia = (GD.role.data.Dia as number) +num;
                        UIMgr.I.refreshDiaUI();
                        sound = 'ding'
                    }else{
                        let base = GD.ItemBaseDatas.get(id);
                        itemInfo = base.Name
                        if(base.ItemType==1){
                            //宝石
                            sound = 'ding'
                        }else{
                            //材料、技能
                            sound = 'getItem'
                        }
                        GD.role.getBagItem(id,num,true);
                        color = Tools.getItemColor(id)
                        UIMgr.I.refreshBag();
                    }
                }
            }else{
                //其他玩家获得
                role = this.otherList.get(rsp.Who)
            }
            item.stopCollider();
            if(rsp.IsJust){
                //立即删除
                this.delete1DropItem(item)
                if(role==this.player){
                    UIMgr.I.showProsMsg('获得：'+itemInfo,color,false);
                    GameManager.I.playTipSound(sound)
                }
            }else if(role){
                //让道具飞向role
                this.dropItemList.delete(item.data.Uid);
                this.scheduleOnce(()=>{
                    let comp = item.getComponent(BaseComponent)
                    let toPos:Vec3 = role.position;
                    tween(comp).to(0.3,{position:toPos,opacity:0}).call(()=>{
                        //call的时候可能已经销毁了地图，该node已经回收
                        if(item.node.parent){
                            item.node.removeFromParent()
                            Pools.dropItemPool.push(item.node);
                        }
                        if(role==this.player){
                            UIMgr.I.showProsMsg('获得：'+itemInfo,color,false);
                            GameManager.I.playTipSound(sound)
                        }
                    }).start();
                },0.5)
            }else{
                this.delete1DropItem(item)
            }
        }
    }
    tryRefreshOtherZm=(name:string,zm:string)=>{
        let other:PlayerControl; //this.otherList.get(id);
        this.otherList.forEach(role=>{
            if(role.data.Name==name){
                other = role
            }
        })
        if(other){
            other.data.Zm=zm;
            other.refreshNameLabel(other.data)
        }
    }
    //====Monster========
    onNewMonsterIntoMySeeDis=(d:any)=>{
        let rsp=outer_pb.MonsterInfo.decode(d);
        // console.log('onNewMonsterIntoMySeeDis',rsp)
        this.add1Monster(rsp)
    }
    addMonsters=(ms:Array<outer_pb.IMonsterInfo>)=>{
        ms.forEach(m=>{
            this.add1Monster(m)
        })
    }
    add1Monster=(m:outer_pb.IMonsterInfo)=>{
        // this.mapCells[m.I][m.J]=2;
        if(m.Type==9&&m.CurHp<=0)return;//死亡状态的跨服BOSS，不显示
        let node:Node;
        if(Pools.monsterPool.length==0){
            node = instantiate(GD.monsterPrefab);
            node.setRotationFromEuler(BattleManager.I.cameraNode.eulerAngles)
        }else{
            node = Pools.monsterPool.pop();
        }
        let com = node.getComponent(BaseComponent)
        com.opacity=0;
        let ctl = node.getComponent(MonsterControl);
        let isSame=false;
        if(ctl.data&&ctl.data.Id==m.Id){
            isSame=true;
        }
        ctl.beAtkedEffect.node.active=false;
        ctl.data = m;
        ctl.state = m.CurHp>0 ? UnitState.Idle:UnitState.Death;
        ctl.refreshEffectUi(m.Buffs)
        let base = GD.monsterBaseDatas.get(m.Id);
        ctl.base=base;
        ctl.refreshNameLabel()
        if(ctl.moveTween){
            ctl.moveTween.stop()
        }
        this.monsterList.set(m.Index,ctl);//先加进去，不然有delete消息时无法及时删除，导致出现卡怪
        let pos:Vec3 = node.position
        let rotatePos = Tools.cellPosToPxPos_Rotate45(m.I,m.J)
        pos.x=rotatePos.x
        pos.y=rotatePos.y+30
        ctl.hpBar.progress = m.CurHp/m.MaxHp;
        ctl.select(false)
        node.setPosition(pos);
        if(isSame){
            node.parent = this.entityLayer;
            tween(com).to(0.3,{opacity:255}).start();
        }else{
            //新版本图集动画
            // ctl.AniController.initAni(m.Id).then(v=>{
            //     node.parent = this.entityLayer;
            //     tween(com).to(0.3,{opacity:255}).start();
            // })
            //单张贴图
            const filePath:string = "ui/monster/" + base.Skin;
            Tools.loadSpriteFrame(filePath,GD.commonBundle).then(sp=>{
                ctl.skin.spriteFrame=sp;
                ctl.hpWidget.setDirty();
                node.parent = this.entityLayer;
                tween(com).to(0.3,{opacity:255}).start();
            })
            //使用老版本序列帧动画
            // const filePath:string = "ui/m/m_" + base.Skin;
            // let tex = await Tools.loadTexture2D(filePath,GD.commonBundle)
            // if(tex){
            //     ctl.movieClip.init(tex,3,6);
            //     ctl.state = m.CurHp>0 ? UnitState.Idle:UnitState.Death;
            //     node.parent = this.entityLayer;
            //     tween(com).to(0.3,{opacity:255}).start();
            // }
        }
        GameManager.I.playMonsterSound(base.SoundId,SoundType.Idle)
    }
    onWorldBossIsRelive=(d:any)=>{
        let rsp=outer_pb.MonsterInfo.decode(d);
        // console.log('onWorldBossIsRelive',rsp)
        let m = this.monsterList.get(rsp.Index);
        if(m){
            m.data=rsp
            m.hpBar.progress = rsp.CurHp/rsp.MaxHp;
            m.state = UnitState.Idle
            m.refreshEffectUi(rsp.Buffs)
            m.refreshNameLabel()
            GameManager.I.playMonsterSound(m.base.SoundId,SoundType.Idle)
        }
    }
    onSetWorldBossDeath=(d:any)=>{
        let rsp=outer_pb.MonsterBeKilled.decode(d);
        let m = this.monsterList.get(rsp.Index);
        if(m){
            m.setToDeathState()
            // let com = m.node.getComponent(BaseComponent)
            // com.opacity=125;
        }
    }
    onDelete1Monster=(d:any)=>{
        let rsp=outer_pb.DeleteEntity.decode(d);
        // console.log('onDelete1Monster',rsp)
        this.delete1MonsterByIndex(rsp.Index)
    }
    delete1MonsterByIndex=(index:number)=>{
        let m = this.monsterList.get(index);
        if(m){
            this.delete1Monster(m)
        }
    }
    delete1Monster=(m:MonsterControl)=>{
        m.skillLayer.children.forEach(n=>{n.active=false})
        m.beAtkedEffect.node.active=false;
        m.unscheduleAllCallbacks();
        this.monsterList.delete(m.data.Index)
        // this.mapCells[m.data.I][m.data.J]=0
        if(this.player.selectedUnit==m){
            this.player.changeTarget(null)
        }else{
            m.select(false)
        }
        m.refreshEffectUi(null)
        let com = m.node.getComponent(BaseComponent)
        tween(com).to(0.5,{opacity:0}).call(()=>{
            //call的时候可能已经销毁了地图，该node已经回收
            if(m.node.parent&&this.monsterList.has(m.data.Index)==false){
                m.node.removeFromParent()
                Pools.monsterPool.push(m.node);
            }
        }).start();
    }
    onMonsterStartMoveTo=(d:any)=>{
        let rsp=outer_pb.MonsterStartMoveTo.decode(d);
        // console.log('onMonsterStartMoveTo',rsp)
        let m = this.monsterList.get(rsp.Index);
        if(m){
            // this.mapCells[m.data.I][m.data.J]=0;
            // this.mapCells[rsp.I][rsp.J]=2;

            m.moveToPos(rsp.I,rsp.J)
            // if(rsp.IsResetPos){
            //     m.resetPosAt(rsp.I,rsp.J)
            // }else{
            //     m.moveToPos(rsp.I,rsp.J)
            // }
        }
    }
    //怪物或宝宝被杀死
    onMonsterBeKilled=(d:any)=>{
        let rsp=outer_pb.MonsterBeKilled.decode(d);
        // console.log('onMonsterBeKilled',rsp)
        let m = this.monsterList.get(rsp.Index);
        if(m){
            rsp.Result=1 //标记为杀死
            GameManager.I.playMonsterSound(m.base.SoundId,SoundType.Death)
            let skill = GD.allSkills.get(rsp.SkillId)
            if(rsp.DropItems.length>0){
                this.addDropItems(rsp.DropItems)
            }
            if(rsp.KfJf>0){
                UIMgr.I.showProsMsg(`跨服积分+${Math.round(rsp.KfJf*100)/100}`,ct.blue,false)
            }
            if(rsp.FromIndex<0){
                //被怪物或宝宝杀死
                let from = this.monsterList.get(rsp.FromIndex);
                if(from){
                    GameManager.I.playMonsterSound(from.base.SoundId,SoundType.Atk)
                    // from.lookAtPos(m.x,m.y)
                    from.atkTarget(m,rsp)
                }else{
                    m.setDeath()
                }
                //被我宝宝击杀，也会杀怪回血、回蓝
                if(rsp.FromId==GD.role.data.Id){
                    if(rsp.GetHp>0){
                        this.changePlayerHp(rsp.CurHp,rsp.GetHp,false)
                    }
                    if(rsp.GetMp){
                        this.addPlayerMp(rsp.GetMp)
                    }
                }
            }else{
                if(rsp.FromId==GD.role.data.Id){
                    //被我击杀
                    this.player.onRoleDmgUnit(skill,m,rsp,0,true)
                    //杀怪回血
                    if(rsp.GetHp>0){
                        this.changePlayerHp(rsp.CurHp,rsp.GetHp,false)
                    }
                    if(rsp.GetMp){
                        this.addPlayerMp(rsp.GetMp)
                    }
                }else{
                    //被其它玩家击杀，显示技能动画
                    let other = this.otherList.get(rsp.FromId);
                    if(other){
                        other.onRoleDmgUnit(skill,m,rsp,rsp.Dmg+rsp.YsDmg,true);
                        //杀怪回血 
                        if(rsp.GetHp>0){
                            other.changeOtherHp(rsp.CurHp)
                        }
                    }else{
                        m.setDeath()
                    }
                }
            }
        }
    }
    //玩家攻击怪物后，显示伤害效果
    onMonsterBeAtkedByPlayer=(d:any)=>{
        let rsp=outer_pb.MonsterBeAtkedByPlayer.decode(d);
        // console.log('onMonsterBeAtkedByPlayer',rsp)
        let m = this.monsterList.get(rsp.Index);
        if(m){
            if(rsp.FromId==GD.role.data.Id){
                let skill = GD.allSkills.get(rsp.SkillId)
                this.player.onRoleDmgUnit(skill,m,rsp,0)
                UIMgr.I.refreshAgMpUI();
            }else{
                let other = this.otherList.get(rsp.FromId);
                if(other){
                    let skill = GD.allSkills.get(rsp.SkillId)
                    other.onRoleDmgUnit(skill,m,rsp,rsp.Dmg+rsp.YsDmg);
                    skill&&GameManager.I.playEffectSound('skill_'+skill.SoundId)
                }else{
                    //other不在我的视野内时，直接扣血
                    m.beAtked(rsp.Dmg+rsp.YsDmg)
                }
            }
        }
    }
    //==============Player=========
    updateAllOtherPlayerEnemySign=()=>{
        this.otherList.forEach(other=>{
            other.refreshEnemySign()
        })
    }
    onUpdatePkEnemyList=(d:any)=>{
        let rsp = outer_pb.UpdatePkEnemyList.decode(d);
        GD.role.basePros.EnemyList = rsp.List;
        this.updateAllOtherPlayerEnemySign()
    }
    onAutoGetHpMpAgSd=(d:any)=>{
        let rsp = outer_pb.AutoGetHpMpAgSd.decode(d);
        // console.log('onAutoGetHpMpAgSd',rsp)
        if(rsp.Who == GD.role.data.Id){
            //我
            rsp.Hp&&this.changePlayerHp(rsp.CurHp,rsp.Hp,false)
            rsp.Mp&&this.addPlayerMp(rsp.Mp)
            rsp.Ag&&this.player.reduceAg(-rsp.Ag)
            rsp.Sd&&this.player.reduceSd(-rsp.Sd)
            rsp.GetExp&&GD.role.getExp(rsp.GetExp,rsp.CurExp,false,true,'泡点')
            if(rsp.RedPoint){
                GD.role.basePros.RedPoint = rsp.RedPoint
                GD.player.refreshNameLabel(GD.role.data)
            }
            if(rsp.HuDunTime){
                GD.role.basePros.HuDunTime = rsp.HuDunTime
                this.player.refreshHudun()
            }
        }else{
            //附近玩家
            let other = this.otherList.get(rsp.Who)
            if(other){
                if(rsp.Hp>0){
                    other.changeOtherHp(rsp.CurHp)
                }
                if(rsp.Sd>0){
                    other.otherGetSd(rsp.Sd)
                }
                if(rsp.RedPoint){
                    other.data.RedPoint=rsp.RedPoint
                    other.refreshNameLabel(other.data)
                }
                if(rsp.HuDunTime){
                    other.data.HuDunTime = rsp.HuDunTime
                    other.refreshHudun()
                }
            }
        }
    }
    onPlayerBeAtkByMonster=(d:any)=>{
        let rsp = outer_pb.PlayerBeAtkByMonster.decode(d);
        // console.log('onPlayerBeAtkByMonster',rsp) 
        let m = this.monsterList.get(rsp.Index)
        if(m){
            let role:PlayerControl;
            if(rsp.Id==GD.role.data.Id){
                role=this.player
            }else{
                role = this.otherList.get(rsp.Id);
            }
            if(role){
                m.atkTarget(role,rsp)
                if(rsp.Result==2){
                    role.setFullHp()
                }else if(rsp.Result==3){
                    role.setFullMp()
                }
                //反伤回血
                if(rsp.GetHp>0){
                    role.beAtked(rsp.CurHp)
                    // role.beAtked(-rsp.GetHp)
                    this.addDmgFont(role,rsp.GetHp,DmgType.Green,true)
                }
            }
        }
    }
    onRoleBeHealedByRole=(d:any)=>{
        let rsp = outer_pb.RoleBeHealedByRole.decode(d);
        // console.log('onPlayerBeHealedByOther',rsp)
        let skill = GD.allSkills.get(rsp.SkillId)
        if(skill){
            GameManager.I.playEffectSound('skill_'+skill.SoundId)
        }
        let showDmg:boolean=false
        let fromRole:PlayerControl;
        let targetRole:PlayerControl;
        if(rsp.FromId==GD.role.data.Id){
            //我释放的
            if(skill){
                // console.log('reduceAg_me3',skill.NeedAg)
                UIMgr.I.resetSkillSlotCd(skill,Date.now(),skill.Id==this.player.curSkill.Id)
                if(skill.NeedMp>0)this.player.reduceMp(skill.NeedMp)
                if(skill.NeedAg>0)this.player.reduceAg(skill.NeedAg)
                if(skill.AddLj>0)this.player.addLjValue(skill.AddLj)
            }
            showDmg=true
            fromRole=this.player
        }else{
            fromRole=this.otherList.get(rsp.FromId);
        }
        if(rsp.ToId==GD.role.data.Id){
            //对我释放
            showDmg=true
            targetRole=this.player
            if(rsp.GetHp>0){
                GD.role.basePros.CurHp=rsp.CurHp
                this.player.hpBar.progress = GD.role.basePros.CurHp/GD.role.lastMaxHp;
                UIMgr.I.refreshHpUI()
                UIMgr.I.updateTeamList()
                // this.player.beAtked(-rsp.GetHp)
            }else{
                this.player.reduceSd(-rsp.GetSd)
            }
        }else{
            targetRole=this.otherList.get(rsp.ToId);
            if(targetRole){
                if(rsp.GetHp>0){
                    targetRole.changeOtherHp(rsp.CurHp)
                }else{
                    targetRole.otherGetSd(rsp.GetSd)
                }
            }
        }
        if(targetRole){
            this.fireBulletTo(fromRole,targetRole,rsp.SkillId,()=>{
                if(showDmg||(GD.curMap.isPkModeMap && targetRole.data && targetRole.data.TeamId==GD.role.data.TeamId)){
                    if(rsp.GetHp>0){
                        //+hp
                        this.addDmgFont(targetRole,rsp.GetHp,DmgType.Green,true)
                    }else{
                        //+sd
                        this.addDmgFont(targetRole,rsp.GetSd,DmgType.Normal,true)
                    }
                }
            })
        }
    }
    onFireOneTargetBuffSkill=(d:any)=>{
        let rsp = outer_pb.FireBuffSkill.decode(d);
        let skill = GD.allSkills.get(rsp.SkillId)
        if(skill){
            GameManager.I.playEffectSound('skill_'+skill.SoundId)
            let fromUnit:Unit;
            let toUnit:Unit;
            if(rsp.FromIndex<0){
                //怪物、宝宝使用buffSkill
                fromUnit = this.monsterList.get(rsp.FromIndex)
            }else{
                //角色使用buffSkill
                if(rsp.FromId==GD.role.data.Id){
                    // console.log('reduceAg_me4',skill.NeedAg)
                    //我使用
                    fromUnit=this.player;
                    UIMgr.I.resetSkillSlotCd(skill,Date.now(),skill.Id==this.player.curSkill.Id)
                    if(skill.NeedMp>0)this.player.reduceMp(skill.NeedMp)
                    if(skill.NeedAg>0)this.player.reduceAg(skill.NeedAg)
                    if(skill.AddLj>0)this.player.addLjValue(skill.AddLj)
                }else{
                    fromUnit = this.otherList.get(rsp.FromId)
                }
            }
            if(rsp.ToIndex<0){
                toUnit = this.monsterList.get(rsp.ToIndex)
            }else{
                if(rsp.ToId==GD.role.data.Id){
                    toUnit=this.player
                }else{
                    toUnit=this.otherList.get(rsp.ToId)
                }
            }
            if(fromUnit&&toUnit){
                if(!(rsp.ToId==rsp.FromId==GD.role.data.Id)){
                    this.fireBulletTo(fromUnit,toUnit,rsp.SkillId)
                }
            }
        }
    }
    onMoveToPos=(d:any)=>{
        let rsp = outer_pb.MoveToPos.decode(d);
        rsp.DeleteOtherList.forEach(id=>{
            this.deleteOther(id,false)
        })
        rsp.DeleteMonsterList.forEach(index=>{
            let m = this.monsterList.get(index);
            if(m){
                this.delete1Monster(m)
            }
        })
        rsp.DeleteDropItems.forEach(uid=>{
            let item = this.dropItemList.get(uid);
            if(item){
                this.delete1DropItem(item)
            }
        })
        if(rsp.Pos){
            const pos=rsp.Pos
            this.player.otherMoveTo(pos.I,pos.J,pos.X,pos.Y)
            UIMgr.I.mapPosLabel.string=`(${pos.I},${pos.J})`;
        }
        rsp.DeleteShops.forEach(id=>{
            this.deleteOther(id,true)
        })
        // this.recoverOutOffSeeDisEntity() //删除漏网的超出视野的实体
        this.addOthers(rsp.NewShops,true);
        this.addOthers(rsp.NewOtherList);
        this.addMonsters(rsp.NewMonsterList);
        this.addDropItems(rsp.NewDropItemList);
        this.updateMapTiles()
    }
    onPlayerLvUp=(d:any)=>{
        let rsp = outer_pb.LvUpInfo.decode(d);
        if(rsp.BasePro)UIMgr.I.resetRoleBasePros(rsp.BasePro)
        // let oldLv = GD.role.data.Lv;
        this.player.lvUp(rsp)
        
        UIMgr.I.refreshLvUI()
        UIMgr.I.refreshHpMpSdAgUI()

        if(rsp.CjQuests.length>0){
            GD.role.ResetDayData.CjQuests=rsp.CjQuests;
            UIMgr.I.updateQuestPage(1);
        }
    }
    onChangePosFailed=(d:any)=>{
        let rsp = outer_pb.ResetPos.decode(d);
        // console.log('onChangePosFailed:',rsp)
        this.player.state=UnitState.Idle;
        this.player.changePosTo(rsp.I,rsp.J)
        UIMgr.I.setAuto(true)
        // this.clearAllTimerWhenStopMove();
        // this.player.changePixPosTo(rsp.X,rsp.Y);
        UIMgr.I.showProsMsg('网络延时导致移动失败，重置位置')
        GameManager.I.playErrorSound()
    }
    onResetPos=(d:any)=>{
        let rsp = outer_pb.ResetPos.decode(d);
        // console.log('onResetPos:',rsp)
        this.recoverEntities();
        this.addDropItems(rsp.DropItemList);
        this.addOthers(rsp.OtherList);
        this.addOthers(rsp.Shops,true);
        this.addMonsters(rsp.MonsterList);
        this.player.lostTarget();
        this.player.changePosTo(rsp.I,rsp.J,rsp.ResetType==ResetPosType.SuiJi);
        this.player.setMoveMotion(true)
        let bc = this.player.node.getComponent(BaseComponent)
        if(rsp.ResetType==ResetPosType.Relife){
            GD.role.data.Exp = rsp.Exp
            GD.role.lastMaxHp=rsp.MaxHp
            this.player.relife();
        }else if(rsp.ResetType==ResetPosType.ChangePoint){
            // console.log(rsp.I,rsp.J,rsp.PointIndex,GD.MapList.get(this.mapId).Points[rsp.PointIndex])
            UIMgr.I.hideCurPage();
            let name = ''
            let map = this.mapData//GD.MapList.get(this.mapId)
            if(rsp.DoorId>0){
                let door = map.Doors.find(d=>{return d.Id==rsp.DoorId})
                if(door) name = door.TargetName
            }else{
                name = map.PointNames[rsp.PointIndex]
            }
            if(rsp.NeedGold>0)GD.role.reduceGold(rsp.NeedGold)
            UIMgr.I.tip(`成功移动到 ${name}`,ct.green)
        }else{
            if(rsp.ResetType==ResetPosType.BackHome){
                //扣除回城卷轴
                GD.role.reduceItem(8,1)
            }else if(rsp.ResetType==ResetPosType.SuiJi){
                //扣除随机卷轴
                GD.role.reduceItem(7,1)
            }
            GameManager.I.playEffectSound('resetPos')
            //播放随机到达动画
            this.fireEffectOnTarget(this.player,3,true)
        }
        tween(bc).to(0.6,{opacity:255}).start()
        this.updateMapTiles()
        this.player.startScheduleCaculateExpPer();
    }
    onFocusOut=()=>{
        this.player.setMoveMotion(false)
        this.recoverEntities();
        // this.unschedule(this.sortZindex);
        this.unscheduleAllCallbacks();
        this.player.stopCaculateExp();
        this.player.stopScheduleDmgLabels()
        //继续发心跳，否则会掉线
        // console.log('onFocusOut')
        // this.startHeartBeat()
    }
    isPkMap:boolean=false //竞技场内不显示称号
    onFocusIn=(rsp:outer_pb.FocusAct)=>{
        // this.startHeartBeat()
        this.isPkMap=rsp.IsPk;
        this.schedule(this.sortZindex,0.017)
        this.player.startScheduleDmgLabels()
        this.addDropItems(rsp.DropItemList);
        this.addOthers(rsp.OtherList);
        rsp.Shops&&this.addOthers(rsp.Shops,true);
        this.addMonsters(rsp.MonsterList);
        this.player.changePosTo(rsp.I,rsp.J,false);
        this.player.lostTarget();
        this.player.refreshEffectUi(rsp.Buffs,true)
        this.player.resetMyAllUIBars(); 
        UIMgr.I.updateMyBuffsUI(rsp.Buffs)
        this.player.setMoveMotion(true)
        UIMgr.I.updateExpPerUI(0,0);
        UIMgr.I.changePkMode(rsp.PkMode);
        this.player.startScheduleCaculateExpPer();
        this.updateMapTiles()
    }
    recover=(): void=> {
        this.recoverEntities();
        this.recoverDmgLabels();
        JoystickControl.I.lostPlayer()
        CameraControl.I.lostPlayer()
        MiniMapControl.I.lostPlayer()
        // this.unschedule(this.sortZindex)
        this.unscheduleAllCallbacks();
        this.recoverPlayer();
        //回收地图块
        this.loadedTiles.forEach((node, key) => {
            node.removeFromParent();
            // 清理所有地图图块资源
            node.getComponent(Sprite).spriteFrame.decRef()
            resources.release(key);
            if(Pools.mapBlockPool.length<10){
                Pools.mapBlockPool.push(node)
            }else{
                node.destroy();
            }
        })
        this.loadedTiles.clear();
        //卸载大地图资源
        // if(this.bigMapSpriteFrame){
        //     this.bigMapSpriteFrame.sp.decRef()
        //     this.mapBgBundle.release(this.bigMapSpriteFrame.path);
        //     // resources.release(this.bigMapSpriteFrame.path);
        // }
    }
    recoverPlayer=()=>{
        if(this.player){
            this.player.unscheduleAllCallbacks();
            this.player.node.removeFromParent();
        }
    }
    recoverAllMonster=(isFbOver:boolean=false)=>{
        this.monsterList.forEach(m=>{
            if(isFbOver){
                this.delete1Monster(m)
            }else{
                this.recover1Monster(m)
            }
        })
        this.monsterList.clear()
    }
     recover1Monster=(m:MonsterControl)=>{
        m.unscheduleAllCallbacks();
        m.refreshEffectUi(null)
        // m.skillLayer.children.forEach(n=>{n.removeFromParent()})
        // m.skillNodePool.clear();
        m.beAtkedEffect.node.active=false;
        m.node.removeFromParent()
        Pools.monsterPool.push(m.node);
        // this.mapCells[m.data.I][m.data.J]=0;
    }
    recoverEntities=()=>{
        //清理怪物
        this.recoverAllMonster()
        //清理摊位
        this.otherShops.forEach(other=>{
            other.node.removeFromParent()
            other.data=null;
            Pools.RolePool.push(other.node);
        })
        this.otherShops.clear();
        //清理其它玩家
        this.otherList.forEach(other=>{
            other.unscheduleAllCallbacks();
            other.beAtkedEffect.node.active=false;
            GD.role.neighborOthers.delete(other.data.Id);
            if(GD.role.myTeam&&other.data.TeamId==GD.role.myTeam.TeamId) UIMgr.I.updateTeamList();
            other.node.removeFromParent()
            other.data=null;
            Pools.RolePool.push(other.node);
            // let pool = Pools.otherPool.get(other.roleType);
            // if(pool){
            //     pool.push(other.node);
            // }
        })
        this.otherList.clear()
        //清理掉落物品
        this.dropItemList.forEach(item=>{
            item.node.removeFromParent()
            Pools.dropItemPool.push(item.node);
        })
        this.dropItemList.clear()
        //清理子弹、法术
        this.skillEffectLayer.children.forEach(n=>{
            n.removeFromParent();
            let comp = n.getComponent(BaseComponent)
            let pool=Pools.skillEffectPool.get(comp.data);
            if(pool){
                pool.push(n)
            }
        })
    }
    //释放技能（直接在目标身上显示技能特效，播放完毕后，再显示伤害）
    // async fireEffectOnTarget(pos:Vec3,id:number,isReverse:boolean=false){
    //     // return new Promise(async (resolve,reject)=>{
            
    //     // })
    //     let bullet:Node;
    //     let pool = Pools.skillEffectPool.get(id);
    //     if(!pool){
    //         pool = []
    //         Pools.skillEffectPool.set(id,pool)
    //     }
    //     if(pool.length==0){
    //         let pf = await Tools.loadPrefab(`prefabs/skills/skill${id}`)
    //         if(pf){
    //             bullet = instantiate(pf as Prefab);
    //             let clip = bullet.getComponent(MovieClip)
    //             if(clip){
    //                 clip.completeCb = ()=>{
    //                     //播放完成动画后执行
    //                     bullet.removeFromParent();
    //                     pool.push(bullet)
    //                 }
    //             }
    //         }else{
    //             return
    //         }
    //     }else{
    //         bullet = pool.pop();
    //     }
    //     let comp = bullet.getComponent(BaseComponent)
    //     comp.data=id;//用id做标记，便于换地图时回收
    //     comp.setPos(pos.x,pos.y);
    //     bullet.setRotationFromEuler(this.cameraNode.eulerAngles);//朝向摄像机
    //     bullet.parent = this.skillEffectLayer;
        
    //     let clip = bullet.getComponent(MovieClip)
    //     if(isReverse){
    //         clip.reversePlay()
    //     }else{
    //         clip.replay();
    //     }
    //     // resolve(1)
    //     // this.scheduleOnce(()=>{resolve(1)},(clip.totalFrame-2)*clip.interval)
    // }
    //释放技能（直接在目标身上显示技能特效，播放完毕后，再显示伤害）
    fireEffectOnTarget=(target:Unit,id:number,isReverse:boolean=false)=>{
        let effect:Node=target.skillNodePool.get(id);
        if(effect==null){
            Tools.loadPrefab(`prefabs/skills/skill${id}`,GD.commonBundle).then(pf=>{
                if(pf){
                    effect = instantiate(pf as Prefab);
                    effect.y=60;
                    effect.parent = target.skillLayer;
                    target.skillNodePool.set(id,effect);
                    effect.setRotationFromEuler(BattleManager.I.cameraNode.eulerAngles);//朝向摄像机
                    this.playEffectOnTarget(effect,isReverse)
                }
            })
        }else{
            this.playEffectOnTarget(effect,isReverse)
        }
    }
    private playEffectOnTarget=(effect:Node,isReverse:boolean=false)=>{
        // let comp = effect.getComponent(BaseComponent)
        // comp.data=id;//用id做标记，便于换地图时回收
        // comp.setPos(0,0);
        effect.active=true;
        let clip = effect.getComponent(MovieClip)
        if(isReverse){
            clip.reversePlay()
        }else{
            clip.replay();
        }
        //播放完成动画后执行
        clip.completeCb = ()=>{
            effect.active=false;
        }
    }
    //释放技能(围绕自身的技能特效)
    fireSkillAniAroundUnit=(target:Unit,skill:Skill,rotateToCamera:boolean=true)=>{
        return new Promise(resolve=>{
            let aniNode:Node=target.skillNodePool.get(skill.Id);
            if(aniNode==null){
                Tools.loadPrefab(`prefabs/skills/skill${skill.Id}`,GD.commonBundle).then(pf=>{
                    if(pf){
                        aniNode = instantiate(pf as Prefab);
                        // aniNode.setRotationFromEuler(BattleManager.I.cameraNode.eulerAngles);//朝向摄像机
                        rotateToCamera && aniNode.setRotationFromEuler(BattleManager.I.cameraNode.eulerAngles);//朝向摄像机
                        aniNode.parent = target.skillLayer;
                        target.skillNodePool.set(skill.Id,aniNode);
                        this.playSkillAniAroundUnit(target,skill.Id,aniNode,resolve)
                    }
                })
            }else{
                this.playSkillAniAroundUnit(target,skill.Id,aniNode,resolve)
            }
        })
    }
    private playSkillAniAroundUnit=(target:Unit,id:number,aniNode:Node,resolve:(v:any)=>void)=>{
        if(id==24){
            //霹雳回旋斩
            let sp:SpriteFrame;
            if(target.unitType==UnitType.Player){
                let role = target as PlayerControl;
                sp = role.left_weapon.spriteFrame;
                if(sp==null)sp = role.right_weapon.spriteFrame;
                aniNode.children.forEach(node=>{
                    node.children[0].getComponent(Sprite).spriteFrame=sp;
                })
            }else{
                Tools.loadSpriteFrame('ui/skill/skill10',GD.commonBundle).then(sp1=>{
                    sp=sp1
                    aniNode.children.forEach(node=>{
                        node.children[0].getComponent(Sprite).spriteFrame=sp;
                    })
                })
            }
        }
        aniNode.active=true;
        let ani:Animation = aniNode.getComponent(Animation);
        if(ani){
            ani.play();
            ani.once(Animation.EventType.FINISHED, ()=>{
                aniNode.active=false;
                resolve(1)
            }, this);
        }
    }
    //释放技能(围绕自身的技能特效)
    // async fireSkillAniAroundUnit(target:Unit,id:number,rotateToCamera:boolean=false,cb:()=>void=null){
    //     let aniNode:Node;
    //     let pool = Pools.skillEffectPool.get(id);
    //     if(!pool){
    //         pool = []
    //         Pools.skillEffectPool.set(id,pool)
    //     }
    //     if(pool.length==0){
    //         let pf = await Tools.loadPrefab(`prefabs/skills/skill${id}`)
    //         if(pf){
    //             aniNode = instantiate(pf as Prefab);
    //             // console.log('create bullet '+id)
    //             // let ani:Animation = aniNode.getComponent(Animation);
    //             // if(ani){
    //             //     ani.off(Animation.EventType.FINISHED)
    //             //     ani.on(Animation.EventType.FINISHED, (type: Animation.EventType, state: AnimationState)=> {
    //             //         cb&&cb();
    //             //         // dataCom.data && dataCom.data();
    //             //         aniNode.removeFromParent();
    //             //         pool.push(aniNode)
    //             //         // console.log('ani finished '+id)
    //             //     }, this);
    //             // }
    //         }else{
    //             return
    //         }
    //     }else{
    //         aniNode = pool.pop();
    //     }
    //     if(id==24){
    //         //霹雳回旋斩
    //         let sp:SpriteFrame;
    //         if(target.unitType==UnitType.Player){
    //             let role = target as PlayerControl;
    //             sp = role.left_weapon.spriteFrame;
    //             if(sp==null)sp = role.right_weapon.spriteFrame;
    //         }else{
    //             sp = await Tools.loadSpriteFrame('game/skill/skill10')
    //         }
    //         aniNode.children.forEach(node=>{
    //             node.children[0].getComponent(Sprite).spriteFrame=sp;
    //         })
    //     }
    //     rotateToCamera && aniNode.setRotationFromEuler(this.cameraNode.eulerAngles);//朝向摄像机
    //     aniNode.parent = target.skillLayer;
    //     let ani:Animation = aniNode.getComponent(Animation);
    //     if(ani){
    //         ani.play();
    //         ani.off(Animation.EventType.FINISHED)
    //         ani.on(Animation.EventType.FINISHED, (type: Animation.EventType, state: AnimationState)=> {
    //             // dataCom.data && dataCom.data();
    //             ani.stop();
    //             aniNode.removeFromParent();
    //             pool.push(aniNode)
    //             cb&&cb();
    //             // console.log('ani finished A '+id)
    //         }, this);
    //     }
    // }
    //effectId为中弹后的效果id
    async fireBulletTo(fromUnit:Unit,target:Unit,id:number,cb:()=>void=null,effectId:number=997){
        if(fromUnit&&target){
            let to = target.node.getPosition();
            let from = fromUnit.node.position;
            let bullet:Node;
            let pool = Pools.skillEffectPool.get(id);
            if(!pool){
                pool = []
                Pools.skillEffectPool.set(id,pool)
            }
            if(pool.length==0){
                let pf = await Tools.loadPrefab(`prefabs/skills/skill${id}`,GD.commonBundle)
                if(pf){
                    bullet = instantiate(pf as Prefab);
                }else{
                    return
                }
            }else{
                bullet = pool.pop();
            }
            let comp = bullet.getComponent(BaseComponent)
            comp.data=id;//用id做标记，便于换地图时回收
            // comp.opacity=255
            
            let dx: number = to.x- from.x;
            let dy: number = to.y- from.y;
            const z = Math.atan2(dy, dx) * 180 / Math.PI-90
            // bullet.setRotationFromEuler(new Vec3(15,0,0));//x轴稍微朝向摄像机
            bullet.setRotationFromEuler(BattleManager.I.cameraNode.eulerAngles);//x轴稍微朝向摄像机
            let quat = new Quat()
            Quat.fromAngleZ(quat,z)
            bullet.rotate(quat)

            let deltaY = 50
            if(fromUnit.unitType==UnitType.Player){
                deltaY=90
            }
            if(target.unitType==UnitType.Player){
                to.y+=90
            }else{
                to.y+=50
            }
            comp.setPos(from.x,from.y+deltaY);
            // comp.position = from;
            bullet.parent = GD.curMap.skillEffectLayer;
            let dis = Tools.get2dis_pix(from.x,from.y+deltaY,to.x,to.y)
            tween(comp).to(dis/1000,{position:to,opacity:255}).to(0.3,{opacity:0}).call(()=>{
                //call的时候可能已经销毁了地图，该node已经回收
                if(bullet.parent){
                    bullet.removeFromParent();
                    pool.push(bullet)
                    // resolve(1);
                    cb&&cb();
                }
            }).start();
        }
    }
    lastItem:DropItemControl;
    pickUpItem=()=>{
        // if(GD.role.clickPickUpNum>Math.random()*50+30){ //3000+1800
        //     //跳验证码
        //     WS.send(MT.CreateCheckCode,GD.EmptyRequestBuff,(d:any)=>{
        //         //UIMgr.I.showProsMsg('请不要频繁点击拾取',ct.red)
        //         let msg=''//题目
        //         UIMgr.I.PopView.showMsgBox([new BoxMsg('<br/><br/>msg',ct.yellow)],'确认',(str:string)=>{
        //             //
        //         },'',true,'请输入答案')
        //     })
        //     return
        // }else{
        //     GD.role.clickPickUpNum++
        // }
        let minDis=99;
        let item:DropItemControl;
        let p = GD.role.data
        this.dropItemList.forEach(d=>{
            if(d!=this.lastItem&&(d.data.Owner as number==0||d.data.Owner==GD.role.data.Id)){
                let dis=Tools.get2dis(p.I,p.J,d.data.I,d.data.J)
                if(dis<minDis){
                    minDis=dis;
                    item=d;
                    this.lastItem=d;
                }
            }
        })
        if(item){
            this.player.tryNaveToCell(item.data.I,item.data.J);
            this.lastItem=null
        }else{
            UIMgr.I.showProsMsg('未发现属于您的道具',ct.red,true,true)
        }
    }
    recoverDmgLabels=()=>{
        this.dmgLabelLayer.children.forEach(n=>{
            // if(n.active){
            //     Pools.dmgLabelPool.push(n)
            // }
            // Pools.dmgLabelPool.push(n)
            //直接丢弃，不回收
            n.removeFromParent();
        })
    }
    // private needAddDmgLabels:Array<DmgLabel>=[]
    // private scheduleAddDmgLabels(){
    //     if(this.needAddDmgLabels.length>0){
    //         let label = this.needAddDmgLabels.pop()
    //         //开始显示数字后，是否需要删除目标
    //         if(label.DeathUnit){
    //             label.DeathUnit.setDeath()
    //             label.DeathUnit=null;
    //         }
    //         let node = label.label.node
    //         node.parent=this.dmgLabelLayer;
    //         let com = node.getComponent(BaseComponent)
    //         let y = node.position.y+200;
    //         if(label.dmgType>1){
    //             //特殊类型伤害，放大特效
    //             tween(com).to(0.1,{scaleX:2,scallY:2}).to(0.2,{scaleX:1,scallY:1}).to(1,{y:y}).call(()=>{
    //                 //call的时候可能已经销毁了地图，该node已经回收
    //                 if(node.parent){
    //                     node.removeFromParent();
    //                     Pools.dmgLabelPool.push(label)
    //                 }
    //             }).start()
    //         }else{
    //             tween(com).to(1.3,{y:y}).call(()=>{
    //                 //call的时候可能已经销毁了地图，该node已经回收
    //                 if(node.parent){
    //                     node.removeFromParent();
    //                     Pools.dmgLabelPool.push(label)
    //                 }
    //             }).start()
    //         }
    //     }
    // }
    //0是miss灰色，1普通伤害土黄色，2幸运蓝色，3卓越绿色，4双倍黄金色，5反伤-紫色，6无视/自身被攻击-红色，7连击-青色，8毒-浅绿色
    //9白色-天罚+真实伤害，10元素属性伤害-紫蓝色，11暗土黄-SD伤害，12宠物-伤害白，13天使一击粉色
    addDmgFont=(atTarget:Unit,dmg:number,dmgType:number,isAddHpSd:boolean=false,isKilled:boolean=false)=>{
        if(atTarget&&atTarget.node){
            let pos:Vec3 = atTarget.node.getPosition();
            if(atTarget.unitType==UnitType.Player){
                pos.y+=50
            }else{
                pos.y+=30
            }
            let dmgLabel:DmgLabel;
            if(Pools.dmgLabelPool.length==0){
                dmgLabel = new DmgLabel()
                dmgLabel.label = instantiate(GD.dmgLabelPrefab).getComponent(Label);
                dmgLabel.label.node.setRotationFromEuler(BattleManager.I.cameraNode.eulerAngles)
            }else{
                dmgLabel = Pools.dmgLabelPool.pop();
            }
            dmgLabel.dmgType=dmgType
            dmgLabel.DeathUnit=isKilled
            // label.node.parent=this.dmgLabelLayer;
            let color = DmgColor[dmgType];
            if(isAddHpSd){
                dmgLabel.label.string = '+'+dmg;
            }else{
                if(dmgType==DmgType.Miss||dmg==0){
                    dmgLabel.label.string = 'miss';
                    color = ct.light_gray;
                }else{
                    let str = '-'+dmg;
                    if(dmgType==DmgType.SecKill){
                        str = '秒杀！';
                    }
                    dmgLabel.label.string = str;
                    // GD.curMap.fireEffectOnTarget(atTarget,997);
                    atTarget.beAtkedEffect.node.active=true;
                    atTarget.beAtkedEffect.replay();
                    atTarget.beAtkedEffect.completeCb = ()=>{
                        atTarget.beAtkedEffect.node.active=false;
                    }
                }
            }
            dmgLabel.label.color.fromHEX(color);
            dmgLabel.label.node.position = pos;
            atTarget.needAddDmgLabels.push(dmgLabel);
            // let label = this._createDmgFont(pos,dmg,dmgType,isAddHp)
            // let com = label.getComponent(BaseComponent)
            // // com.opacity=255;
            // let y = pos.y+200;
            // if(dmgType>1){
            //     //特殊类型伤害，放大特效
            //     tween(com).to(0.1,{scaleX:2,scallY:2}).to(0.2,{scaleX:1,scallY:1}).to(1,{y:y}).call(()=>{
            //         //call的时候可能已经销毁了地图，该node已经回收
            //         if(label.node.parent){
            //             label.node.removeFromParent();
            //             Pools.dmgLabelPool.push(label.node)
            //         }
            //     }).start()
            // }else{
            //     tween(com).to(1.3,{y:y}).call(()=>{
            //         //call的时候可能已经销毁了地图，该node已经回收
            //         if(label.node.parent){
            //             label.node.removeFromParent();
            //             Pools.dmgLabelPool.push(label.node)
            //         }
            //     }).start()
            // }
        }
    }
    //0是miss灰色，1普攻土黄色，2幸运蓝色，3卓越绿色，4双倍黄金色，5无视紫色+反伤，6红色，7青色，8毒浅绿色，9白色天罚+宠物+真实伤害
    // private _createDmgFont(pos:Vec3,dmg:number,dmgType:number,isAddHp:boolean=false):DmgLabel{
    //     let dmgLabel:DmgLabel;
    //     if(Pools.dmgLabelPool.length==0){
    //         dmgLabel = new DmgLabel()
    //         dmgLabel.label = instantiate(BattleManager.I.dmgLabelPrefab).getComponent(Label);
    //         dmgLabel.label.node.setRotationFromEuler(this.cameraNode.eulerAngles)
    //     }else{
    //         dmgLabel = Pools.dmgLabelPool.pop();
    //     }
    //     dmgLabel.dmgType=dmgType
    //     // label.node.parent=this.dmgLabelLayer;
    //     let color = DmgColor[dmgType];
    //     if(isAddHp){
    //         dmgLabel.label.string = '+'+dmg;
    //     }else{
    //         if(dmgType==DmgType.Miss||dmg==0){
    //             dmgLabel.label.string = 'miss';
    //             color = ct.light_gray;
    //         }else{
    //             dmgLabel.label.string = '-'+dmg;
    //         }
    //     }
    //     dmgLabel.label.color.fromHEX(color);
    //     dmgLabel.label.node.position = pos;
    //     return dmgLabel;
    // }
}
