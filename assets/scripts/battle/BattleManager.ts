import { _decorator, Camera, Component, EventTouch, geometry, input, Input, instantiate, Label, Node, PhysicsSystem, Prefab, resources, tween, UITransform, Vec3 } from 'cc';
import { MapControl } from './MapControl';
import {PageType, UIMgr } from '../managers/UIMgr';
import { PlayerControl, PlayerType } from './PlayerControl';
import { ct, MapPkMode, QuestData, Skill, TaskTargetType, UnitState, UseSkillResult } from '../base/types';
import { MonsterControl } from './MonsterControl';
import GD from '../base/GameData';
import { CameraControl } from './CameraControl';
import { BaseComponent } from '../base/BaseComponent';
import WS from '../base/net';
import { ConfigType, Err, MT } from '../base/MT';
import { NpcControl } from './NpcControl';
import Tools from '../base/tools';
import GameManager from '../managers/GameManager';
import { LineIsFullInfo, NotEnoughLineTimeInfo, TooManyRedPointInfo } from '../base/consts';
const { ccclass, property } = _decorator;
export const MapCellWidth:number=64;
export const MapCellWidth_Half:number=32;

export enum MapLoadStates{
    none,
    loading,
    loaded,
}
@ccclass('BattleManager')
export class BattleManager extends Component {
    @property(Prefab)
    mapBlockPrefab:Prefab
    // monsterPrefab:Prefab
    // dropItemPrefab:Prefab
    // dmgLabelPrefab:Prefab
    @property(Label)
    loadInfoLabel:Label;
    @property(Node)
    cameraNode:Node
    @property(Node)
    camera:Node
    
    skillCallBacks:Map<number,(player:PlayerControl,skill:Skill,now:number)=>UseSkillResult>=new Map();

    curMap:MapControl=null;
    loadState:MapLoadStates=MapLoadStates.none;
    lastClickTime:number=Date.now()/1000

    static I:BattleManager;
    protected onLoad(): void {
        BattleManager.I=this;
        input.on(Input.EventType.TOUCH_END,this.onClick,this)
        this.registSkillCallBacks();
        this.schedule(this.tryFocusOut,30)
    }
    private tryFocusOut() {
        if(GD.isFocusIn&&UIMgr.I.curPage==null&&UIMgr.I.PopView.node.active==false&&(Date.now()/1000-this.lastClickTime > GD.autoFocusOutTime)){
            //如果当前正在击杀BOSS，则不托管
            if(GD.curMap){
                let hasBoss=false
                GD.curMap.monsterList.forEach(m=>{
                    if(m.data.Type>0&&m.data.Type!=4) hasBoss=true;
                })
                if(hasBoss)return;
            }
            UIMgr.I.sendFocusChange(false)
        }
    }
    private _ray: geometry.Ray = new geometry.Ray();
    onClick(event:EventTouch){
        this.lastClickTime=Date.now()/1000;
        // if(GD.role.isLimited())return
        if(UIMgr.I.curPage)return;//有打开窗口时，不处理全局点击射线检测
        if(GD.curMap&&GD.curMap.mapId==777)return;//竞技场内，静止点击
        if(GD.curMap&&GD.player){
            const touch = event.getLocation();
            CameraControl.I.camera.screenPointToRay(touch.x, touch.y, this._ray);
            if (PhysicsSystem.instance.raycastClosest(this._ray) == true) {
                // 获取射线最短的检测结果
                var res = PhysicsSystem.instance.raycastClosestResult;
                // 获取名字  
                let name = res.collider.name;
                if(name.startsWith('floor')||name.startsWith('door')){
                    let p =res.collider.node.getComponent(UITransform).convertToNodeSpaceAR(res.hitPoint)
                    GD.player.clickMoveTo(p,true)
                }else if(name.startsWith('monster')){
                    let m = res.collider.node.getComponent(MonsterControl)
                    GD.player.changeTarget(m)
                }else if(name.startsWith('role')){
                    let role = res.collider.node.getComponent(PlayerControl)
                    if(role.playerType==PlayerType.Other){
                        UIMgr.I.PopView.show(1,role.data)
                    }
                }else if(name.startsWith('npc')){
                    let npc = res.collider.node.getComponent(NpcControl);
                    GD.player.lookAtTarget(npc.node);
                    let base:QuestData = GD.QuestDatas.get(GD.role.ResetDayData.MainQuest.TaskId)
                    if(base.TargetType==TaskTargetType.TalkToNPC&&base.TargetId==npc.id){
                        UIMgr.I.show(PageType.NpcTalkPage,npc.id);
                    }else{
                        UIMgr.I.show(npc.data.PageType,npc.data);
                    }
                }
            }
        }
    }
    joinLine=(worldLv:number,roomId:number,pointIndex:number,lineId:string,endPos:Array<number>=null,IsImmediate:boolean=false,isByDoor:boolean=false,isFirstJoin:boolean=false)=>{
        // if(isNotFirst&&worldLv==GD.role.data.WorldLv&&GD.role.data.RoomId===roomId&&GD.role.data.LineId==lineId){
        //     UIMgr.I.tip('您已经在该地图'); 
        //     return
        // }
        UIMgr.I.hideCurPage(false);
        let room = GD.MapList.get(roomId)
        if(room){
            let can=false
            let zsNum = GD.role.data.ZsNum
            if(worldLv==0){
                can=true
            }else if(worldLv==1){
                if(zsNum>=1&&zsNum<10){
                    can=true
                }
            }else if(zsNum>=(worldLv-1)*10){
                can=true
            }
            let needLv = pointIndex>=0?room.NeedLvs[pointIndex]:room.NeedLv
            if(can &&(isByDoor||GD.isJieGuan||isFirstJoin||GD.role.hasEnoughLv(needLv,false))){
                let req = outer_pb.JoinLineAct.create();
                if(GD.isJieGuan){
                    req.IsJieGuan = true;
                    GD.isJieGuan=false;
                }else if(isFirstJoin){
                    req.WorldLv=worldLv||0;
                }else{
                    req.RoomId= roomId||101; //`${GD.role.data.WorldLv}_${roomId}`;
                    if(lineId==''||lineId==null){
                        lineId='1'
                    }
                    req.LineId=lineId;
                    req.PointIndex=pointIndex;
                    req.IsImmediate=IsImmediate
                    req.WorldLv=worldLv||0;
                    if(endPos)req.EndPos=endPos;
                    if(isByDoor)req.IsByDoor=isByDoor;
                }
                // console.log('joinLine',req)
                let buff = outer_pb.JoinLineAct.encode(req).finish();
                WS.send(MT.JoinLine,buff,this.onJoinLine)
            }else{
                UIMgr.I.tip('等级不足，无法进入')
            }
        }
    }
    onJoinLine=(d:any)=>{
        let rsp = outer_pb.JoinLineAct.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            UIMgr.I.stopUpdateFbTime();
            UIMgr.I.stopUpdateKfTime();
            UIMgr.I.stopUpdatePkTime();
            UIMgr.I.showDeathView.active=false;
            let room = GD.MapList.get(rsp.RoomId)
            if(room){
                if(rsp.NeedGold>0){
                    //这里的rsp.NeedDia表示切换地图点位时需要的金币数量
                    GD.role.reduceGold(rsp.NeedGold)
                }
                if(rsp.NeedId){
                    //进入地图需要的门票 或者 在没有安全区的地图回城时将执行回到勇者大陆，如果不是死亡复活，则需要回城卷轴x1
                    GD.role.reduceItem(rsp.NeedId,1)
                }
                if(room.FbType>0&&GD.role.ResetDayData){
                    GD.role.ResetDayData.FbNums[room.FbType-1]--;
                }
                GD.role.data.WorldLv=rsp.WorldLv
                GD.role.data.RoomId=rsp.RoomId;
                GD.role.data.LineId=rsp.LineId;
                GD.curLineLv=rsp.LineLv;
                this.loadMap(room.Id,rsp)
            }
        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughLv){
            UIMgr.I.tip('等级不足')
        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughItem){
            UIMgr.I.tip('门票不足')
        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughGold){
            UIMgr.I.tip('金币不足')
        }else if(rsp.ErrCode==Err.ErrCode_FbIsClosed){
            UIMgr.I.tip('副本入口已关闭')
        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughFbNum){
            UIMgr.I.tip('剩余副本次数不足1')
        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughLineTime){
            UIMgr.I.tip(NotEnoughLineTimeInfo)
        }else if(rsp.ErrCode==Err.ErrCode_TooManyRedPoint){
            UIMgr.I.tip(TooManyRedPointInfo)
        }else if(rsp.ErrCode==Err.ErrCode_LineIsFull){
            UIMgr.I.tip(LineIsFullInfo)
        }else{
            UIMgr.I.tip('进入失败，请不要频繁换线'+rsp.ErrCode)
        }
    }
    loadMap(mapId:number,rsp:outer_pb.JoinLineAct){
        UIMgr.I.isLoadingMap=true;
        if(this.curMap != null){
            UIMgr.I.switchControlBox(false)
            this.curMap.recover();
            this.curMap.unscheduleAllCallbacks();
            this.curMap.node.removeFromParent();//从节点树上移除
            this.curMap.node.destroy(); //销毁上一个地图
            this.curMap = null;
            GameManager.I.monsterSoundClips.clear();//清空上一个地图的怪物音效
        }
        this.loadInfoLabel.string='努力加载地图中，请稍等....'
        this.loadInfoLabel.node.parent.active = true;
        if(this.loadState == MapLoadStates.loading){
            return; //如果正在加载地图，拒绝加载
        }
        this.loadState = MapLoadStates.loading;
        let pathId = mapId
        if(mapId>601&&mapId<650){
            pathId=601
        }else if(mapId>651&&mapId<700){
            pathId=651
        }
        var mapBgPath:string = `prefabs/maps/${pathId}`;
        GD.commonBundle.load(mapBgPath,Prefab,(error:Error,prefab:Prefab)=>{
            if(error != null){
                this.loadInfoLabel.string="地图加载失败 mapBgPath = " + mapBgPath, error;
            }else{
                //开始根据joinLine返回的rsp初始化
                this.curMap = instantiate(prefab).getComponent(MapControl);
                GD.curMap=this.curMap;
                this.curMap.mapId=mapId;
                this.curMap.floorNode.active=false;
                this.curMap.entityLayer.active=false;
                this.curMap.node.parent = this.node;
                this.curMap.node.active = true;
                this.curMap.node.position = new Vec3(0,0,0);
                this.loadState = MapLoadStates.loaded;
                this.curMap.init().then(d=>{
                    const isPk = this.curMap.mapData.PkMode==MapPkMode.JJ
                    this.curMap.isPkModeMap = isPk
                    this.camera.y=isPk?50:-100;
                    let lineN = GD.role.data.LineId=="99"?"专":GD.role.data.LineId
                    let mapName = `${this.curMap.mapName}-${lineN}线`;
                    UIMgr.I.mapNameLabel.color.fromHEX(GD.corlorMap1.get(GD.role.data.WorldLv));
                    UIMgr.I.mapNameLabel.string=mapName;
                    UIMgr.I.refreshKfPkBuffRich(rsp)
                    let req = outer_pb.FocusAct.create();
                    req.IsPk = this.curMap.isPkModeMap;
                    req.LoadQuest = GD.role.ResetDayData==null; //标志者是否是刚上线、解除托管
                    req.LastSysGGT = GD.sysGG==null?0:GD.sysGG.Time;
                    let buff = outer_pb.FocusAct.encode(req).finish();
                    WS.send(MT.ReLoadMapOk,buff,(d:any)=>{
                        UIMgr.I.isLoadingMap=false;
                        let data = outer_pb.FocusAct.decode(d);
                        // console.log('ReLoadMapOk',data)
                        this.curMap.lineLv = data.LineLv;
                        this.curMap.hasBoss = data.HasBoss;
                        this.curMap.floorNode.active=true;
                        this.curMap.entityLayer.active=true;
                        this.loadInfoLabel.node.parent.active = false;
                        if(data.IsPk){
                            UIMgr.I.onPkRoleDataLoaded(data)
                            GD.player.refreshChengHaoUI(null)
                        }else{
                            UIMgr.I.onRoleDataLoaded(data,true,mapName,rsp.Type);//rsp.Type==1表示需要打开竞技场界面
                            if(rsp.EndPos.length>0&&rsp.IsImmediate==false){
                                GD.player.clickMoveTo(new Vec3(rsp.EndPos[0],rsp.EndPos[1]),false)
                            }
                        }
                        // console.debug('onReLoadMapOk')
                    })
                });
            }
        });
    }
    registSkillCallBacks(){
        this.skillCallBacks.set(1,this.playerUseHpSlot)
        this.skillCallBacks.set(2,this.playerUseMpSlot)
        this.skillCallBacks.set(3,this.playerUseSuiJiJuanZhou)
        this.skillCallBacks.set(4,this.playerUseBackHomeJuanZhou)
        //普适型的不需要注册
    }
    refreshPlayerNameLabel(){
        if(GD.curMap)GD.player.refreshNameLabel(GD.role.data)
    }
    refreshOtherNameLabel(name:string,zm:string){
        if(GD.curMap)GD.curMap.tryRefreshOtherZm(name,zm)
    }
    playerUseHpSlot=(player:PlayerControl,skill:Skill,now:number):UseSkillResult=>{
        if(this.hasEnoughSkillNeed(skill)){
            Tools.sendUseItemAct(5,1,false)
            return UseSkillResult.Success
        }else{
            return UseSkillResult.NotEnoughItem
        }
    }
    playerUseMpSlot=(player:PlayerControl,skill:Skill,now:number):UseSkillResult=>{
        if(this.hasEnoughSkillNeed(skill)){
            Tools.sendUseItemAct(6,1,false)
            return UseSkillResult.Success
        }else{
            return UseSkillResult.NotEnoughItem
        }
    }
    playerUseSuiJiJuanZhou=(player:PlayerControl,skill:Skill,now:number):UseSkillResult=>{
        if(GD.role.canChangPos()){
            if(this.hasEnoughSkillNeed(skill)){ 
                player.state=UnitState.Idle
                player.setMoveMotion(false)
                if(UIMgr.I.curPageType==PageType.MapPage){
                    WS.send(MT.ToRandomPosition,GD.EmptyRequestBuff)
                }else{
                    let bc = player.node.getComponent(BaseComponent)
                    this.curMap.fireEffectOnTarget(player,3)
                    tween(bc).to(0.6,{opacity:0}).call(()=>{
                        WS.send(MT.ToRandomPosition,GD.EmptyRequestBuff)
                    }).start()
                }
                GameManager.I.playEffectSound('resetPos')
                return UseSkillResult.Success
            }else{
                return UseSkillResult.NotEnoughItem
            }            
        }
    }
    playerUseBackHomeJuanZhou=(player:PlayerControl,skill:Skill):UseSkillResult=>{
        if(GD.role.canChangPos()){
            if(this.hasEnoughSkillNeed(skill)){
                player.state=UnitState.Idle
                player.setMoveMotion(false)
                if(UIMgr.I.curPageType==PageType.MapPage){
                    WS.send(MT.BackHome,GD.EmptyRequestBuff)
                }else{
                    let bc = player.node.getComponent(BaseComponent)
                    this.curMap.fireEffectOnTarget(player,3);
                    tween(bc).to(0.6,{opacity:0}).call(()=>{
                        WS.send(MT.BackHome,GD.EmptyRequestBuff)
                    }).start()
                }
                GameManager.I.playEffectSound('resetPos')
                return UseSkillResult.Success
            }else{
                return UseSkillResult.NotEnoughItem
            }
        }
    }
    hasEnoughSkillNeed(skill:Skill):boolean{
        let item = GD.role.BagItems.find(item=>{return item.Id==GD.defaultSkillNeedItem.get(skill.Id)});
        if(item&&item.Num>0){
            return true
        }else{
            UIMgr.I.showProsMsg('道具不足',ct.red,true,true)
            return false
        }
    }
}


