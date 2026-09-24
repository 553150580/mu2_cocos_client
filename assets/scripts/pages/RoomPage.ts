import { _decorator,  instantiate,  Label, Node, Prefab, Sprite, Vec3 } from 'cc';
import { List } from '../UiComps/List';
import { BasePage } from './BasePage';
import GD from '../base/GameData';
import {  UIMgr } from '../managers/UIMgr';
import { ct, MapData } from '../base/types';
import { BattleManager, MapCellWidth, MapCellWidth_Half } from '../battle/BattleManager';
import WS from '../base/net';
import {  MT } from '../base/MT';
import { ViewStack } from '../UiComps/ViewStack';
import Tools from '../base/tools';
const { ccclass, property } = _decorator;

@ccclass('RoomPage')
export class RoomPage extends BasePage {
    @property(ViewStack)
    view:ViewStack
    @property(Label)
    head:Label
    @property(Node)
    world:Node
    @property(Sprite)
    map:Sprite
    @property(Prefab)
    pointBtnPfb:Prefab;
    @property(Label)
    info:Label

    home:string='奇迹大陆-世界地图'
    msg:string='在地图中，点击您想前往的区域'
    noPointMsg:string='当前区域不可直接传送进入，需通过NPC或传送门进入'
    mapData:MapData;
    btnPool:Array<Node>=[]
    onLoad(): void {
        super.onLoad();
        this.world.children.forEach(node=>{
            node.on(Node.EventType.TOUCH_END,()=>{
                let id = parseInt(node.name)
                this.onBtnClick(id)
            })
        })
    }
    onBtnClick=(id:number)=>{
        let data = GD.MapList.get(id)
        if(data){
            if(data.IsKf==1){
                UIMgr.I.PopView.showKaLvBox(id);
            }else{
                if(this.mapData==null||this.mapData.Id!=id){
                    this.map.node.children.forEach(nd=>{
                        this.btnPool.push(nd);
                    })
                    this.map.node.removeAllChildren();
                    this.map.spriteFrame=null;
                    Tools.loadSpriteFrame(`map/bg_mini/${id}_mini`,GD.commonBundle).then(sp=>{
                        if(sp){
                            this.map.spriteFrame=sp;
                            let data = GD.MapList.get(id)
                            this.mapData=data;
                            this.head.string=data.Name;
                            if(data&&data.Points.length>0){
                                this.info.string=this.msg;
                                data.Points.forEach((p,index)=>{
                                    let btn:Node
                                    if(this.btnPool.length==0){
                                        btn = instantiate(this.pointBtnPfb)
                                    }else{
                                        btn = this.btnPool.pop();
                                    }
                                    let m = GD.curMap;
                                    //先计算出未旋转45之前的坐标
                                    const x = (p[1]-m.mapWidth/2)*MapCellWidth + MapCellWidth_Half;
                                    const y = (m.mapHeight/2-p[0])*MapCellWidth - MapCellWidth_Half;
                                    let pos:Vec3 = btn.position
                                    pos.x=x/64
                                    pos.y=y/64
                                    btn.setPosition(pos)
                                    btn.children[0].getComponent(Label).string=data.PointNames[index];

                                    let needLvLabel = btn.children[1].getComponent(Label);
                                    let needLv = data.NeedLvs[index];
                                    needLvLabel.string=`(需要：${needLv}级)`
                                    needLvLabel.color.fromHEX(GD.role.hasEnoughLv(needLv,false)?ct.blue:ct.red)

                                    let needGoldLabel = btn.children[2].getComponent(Label);
                                    let needGold = data.NeedGold[index];
                                    needGoldLabel.string=`(金币：${needGold})`
                                    needGoldLabel.color.fromHEX(GD.role.data.Gold>=needGold?ct.yellow:ct.red)

                                    btn.setParent(this.map.node);
                                    btn.off(Node.EventType.TOUCH_END)
                                    btn.on(Node.EventType.TOUCH_END,()=>{
                                        this.onPointClick(data,index)
                                    })
                                })
                            }else{
                                this.info.string=this.noPointMsg;
                            }
                        }
                    })
                    GD.playClickSound()
                }
                this.view.selectedIndex=1;
            }
        }
    }
    onPointClick=(data:MapData,index:number)=>{
        if(GD.role.canChangPos()){
            let d = GD.role.data;
            if(d.Gold<data.NeedGold[index]){
                UIMgr.I.tip('金币不足')
                return;
            }
            if(GD.role.hasEnoughLv(data.NeedLvs[index])==false){
                return;
            }
            if(data.Id==GD.role.data.RoomId){
                //本地图
                GD.player.setMoveMotion(false)
                let req = outer_pb.JoinLineAct.create();
                req.PointIndex=index
                let buff = outer_pb.JoinLineAct.encode(req).finish();
                WS.send(MT.GoToMapPoint,buff)
            }else{
                BattleManager.I.joinLine(GD.role.data.WorldLv,data.Id,index,GD.role.data.LineId)
            }
        }
    }
    initData(data: any): void {
        if(this.mapData&&GD.curMap.mapId==this.mapData.Id){
            this.onBtnClick(this.mapData.Id)
        }else{
            this.showSign()
            this.view.selectedIndex=0;
        }
    }
    showSign(){
        this.head.string=this.home;
        this.info.string=this.msg;
        this.world.children.forEach(node=>{
            let id = parseInt(node.name)
            node.children[1].active = GD.role.data.RoomId == id
        })
    }
    onBgClick(event:any){
        if(this.view.selectedIndex==1){
            this.showSign()
            this.view.selectedIndex=0
            GD.playClickSound()
        }else{
            UIMgr.I.hideCurPage();
        }
    }
}
// @ccclass('RoomPage')
// export class RoomPage extends BasePage {
//     @property(List)
//     leftList:List
//     @property(List)
//     rightList:List
//     // @property(Tab)
//     // tab:Tab
//     // @property(Label)
//     // head:Label

//     // mapLvStr:string;
//     mapLvColor:ct;
//     selectedLeftNode:Node;
//     selectedMap:MapData;

//     mapList:Array<MapData>;
//     onLoad(): void {
//         super.onLoad();
//         // this.tab.selectedHandler=(node:Node,index:number)=>{
//         //     this.mapLvStr = this.tab.labels.split(',')[index];
//         //     this.mapLvColor = GD.corlorMap1.get(index)
//         //     this.head.string=this.mapLvStr
//         //     this.head.color.fromHEX(this.mapLvColor)
//         //     if(index<GD.worldMap.length){
//         //         let regions = GD.worldMap[index].MapRegions
//         //         this.leftList.array=regions
//         //         let i = regions.findIndex(r=>{return r.MapDataList.findIndex(m=>{return m.Id==GD.role.data.RoomId})>-1})
//         //         this.leftList.selectedIndex=i;
//         //     }
//         // }
//         this.mapList=[]//Array.from(GD.MapList.values());
//         GD.MapList.forEach(m=>{
//             if(m.PointNames.length>0) this.mapList.push(m)
//         })
//         this.mapList.sort((a,b)=>{return a.Id-b.Id;})
//         this.leftList.array=[]
//         this.leftList.selectedHandler = (node:Node,index:number)=>{
//             this.selectedLeftNode&&(this.selectedLeftNode.children[0].active=false)
//             this.selectedLeftNode=node;
//             node.children[0].active=true
//             let data:MapData = this.leftList.array[index];
//             this.selectedMap = data;
//             this.rightList.array = data.PointNames;
//         }
//         this.leftList.cellRender = (node:Node,index:number)=>{
//             this.renderList(true,this.leftList,node,index)
//         };
//         this.rightList.array=[];
//         this.rightList.selectedHandler = (node:Node,pointIndex:number)=>{
//             let needLv:number = this.selectedMap.NeedLvs[pointIndex];
//             if((GD.role.data.Lv+GD.role.data.ZsNum*400)<needLv){
//                 UIMgr.I.tip('等级不足')
//             }else{
//                 if(this.selectedMap.Id==GD.role.data.RoomId){
//                     //本地图
//                     GD.player.setMoveMotion(false)
//                     let req = outer_pb.JoinLineAct.create();
//                     req.PointIndex=pointIndex
//                     let buff = outer_pb.JoinLineAct.encode(req).finish();
//                     WS.send(MT.GoToMapPoint,buff)
//                 }else{
//                     BattleManager.I.joinLine(GD.role.data.WorldLv,this.selectedMap.Id,pointIndex,GD.role.data.LineId)
//                 }
//             }
//         }
//         this.rightList.cellRender = (node:Node,index:number)=>{
//             this.renderList(false,this.rightList,node,index)
//         };
//     }
//     renderList(isLeft:boolean,list:List,node:Node,index:number){
//         let data:any = list.array[index];
//         let label0 = node.children[1].getComponent(Label);
//         let label1 = node.children[2].getComponent(Label);
//         let minLv = isLeft?data.NeedLvs[0]:this.selectedMap.NeedLvs[index];
//         let roleLv = GD.role.data.Lv+GD.role.data.ZsNum*400
//         if(roleLv>=minLv){
//             label1.string='(可进入)'
//             label1.color.fromHEX(ct.green)
//         }else{
//             label1.string=minLv>400?`(需要：${minLv/400>>0}转${minLv%400}级)`:`(需要：${minLv}级)`
//             label1.color.fromHEX(ct.gray)
//         }
//         let color = roleLv<minLv ? ct.gray :ct.white;
//         label0.color.fromHEX(color)
//         label0.string=isLeft?data.Name:data;

//         let mark = node.children[0]
//         let icon = node.children[3].getComponent(Sprite);
//         if(isLeft){
//             icon.node.active=GD.role.data.RoomId==data.Id
//             mark.active = this.selectedLeftNode==node;
//         }else{
//             icon.node.active=false;
//         }
//     };
//     // onBgClick(event:EventTouch){
//     //     UIMgr.I.hideCurPage();
//     // }
//     initData(d:any) {
//         this.leftList.array=this.mapList;
//         this.leftList.selectedIndex=this.mapList.findIndex(m=>{return m.Id==GD.role.data.RoomId})
//         // this.tab.node.children.forEach((node,index)=>{
//         //     node.children[1].getComponent(Label).color.fromHEX(GD.corlorMap1.get(index))
//         // })
//         // if(GD.worldMap){
//         //     this.tab.select(0)
//         // }
//     }
// }


