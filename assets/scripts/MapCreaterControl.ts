import { _decorator, AssetManager, assetManager, Component, EditBox, instantiate, JsonAsset, Label, Node, Prefab, Sprite, SpriteFrame, Texture2D, UITransform, Vec3 } from 'cc';
import { MapControl } from './battle/MapControl';
import { MapCellWidth } from './battle/BattleManager';
import { DoorControl } from './battle/DoorControl';
import Tools from './base/tools';
import GD from './base/GameData';
import { Door, MapData, MonsterPoints, Point } from './base/types';
import { CosRad1, SinRad1 } from './base/consts';
import { MaterialPool } from './base/Pools';
import { EquipmentSlot } from './UiComps/EquipmentSlot';
const { ccclass, property } = _decorator;

//区域
// export class MapRegion{
//     name:string;
//     needLv:number;
//     needZs:number;//需要的最低转生次数
//     mapDataList:Array<MapData>;
// }

@ccclass('MapCreaterControl')
export class MapCreaterControl extends Component {
    @property(Node)
    downBtn:Node;
    @property(Node)
    showBtn:Node;
    @property(Label)
    msg:Label;
    // @property(Node)
    // downPathSp:Node;
    @property(EditBox)
    showId:EditBox;
    @property(Sprite)
    path:Sprite
    @property(Node)
    qh0:Node;
    @property(Node)
    qhBtns:Node;
    @property(Node)
    wing:Node;
    @property(Node)
    leftHand:Node;
    @property(Node)
    leftWeapon:Node;
    @property(Node)
    leg:Node;
    @property(Node)
    foot:Node;
    @property(Node)
    body:Node;
    @property(Node)
    rightWeapon:Node;
    @property(Node)
    rightHand:Node;
    @property(Node)
    shield:Node;
    @property(Node)
    head:Node;

    doorList:Map<number,Door>=new Map();
    mapCells:Map<number,Array<Array<number>>>=new Map()
    mapDataList:Array<MapData>
    terrainBundle:AssetManager.Bundle;
    equipsQhLv:Array<number>=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    equips:Array<EquipmentSlot>;
    equipNames:Array<string>=["翅膀",'左手','左手武器','护腿','鞋子','铠甲','右手武器','右手','盾牌','头盔']
    static I:MapCreaterControl
    protected onLoad(): void {
        MapCreaterControl.I=this;
        this.equips = [
            this.wing.getComponent(EquipmentSlot),
            this.leftHand.getComponent(EquipmentSlot),
            this.leftWeapon.getComponent(EquipmentSlot),
            this.leg.getComponent(EquipmentSlot),
            this.foot.getComponent(EquipmentSlot),
            this.body.getComponent(EquipmentSlot),
            this.rightWeapon.getComponent(EquipmentSlot),
            this.rightHand.getComponent(EquipmentSlot),
            this.shield.getComponent(EquipmentSlot),
            this.head.getComponent(EquipmentSlot),
        ]
        // this.equips.forEach((slot,index)=>{
        //     slot.node.getComponent(Sprite).priority=128-index;
        // })
        this.qhBtns.children.forEach((node,index)=>{
            node.children[0].getComponent(Label).string=this.equipNames[index]
            node.on(Node.EventType.TOUCH_END,()=>{
                let equipSlot=this.equips[index]
                this.equipsQhLv[index]++;
                equipSlot.setQhLevelEffect(this.equipsQhLv[index])
                if(this.equipsQhLv[index]>=6){
                    this.equipsQhLv[index]=0
                }
            },this)
        })
        assetManager.loadBundle('common',(err,bundle)=>{
            if(bundle){
                console.log('common bundle loaded!',bundle);
                GD.commonBundle=bundle;
                MaterialPool.initialize();
                GD.loadAssets(GD.commonBundle).then(v=>{
                    assetManager.loadBundle('terrains',(err,bundle)=>{
                        console.log('terrains bundle loaded!',bundle);
                        MapCreaterControl.I.terrainBundle = bundle;
                        bundle.load('MapList', JsonAsset,(error:Error,res:JsonAsset)=>{
                            if(error != null){
                                console.error(`加载JsonAsset资源失败 filePath：MapList,err=${error}`)
                            }else{
                                let list = (res as JsonAsset).json as Array<MapData>
                                list.forEach(d=>{
                                    GD.MapList.set(d.Id,d)
                                })
                                console.log('load MapList ok')
                                this.msg.string = 'load MapList ok'
                            }
                        })
                        bundle.load('Doors', JsonAsset,(error:Error,res:JsonAsset)=>{
                            if(error != null){
                                console.error(`加载JsonAsset资源失败 filePath：Doors,err=${error}`)
                            }else{
                                let list = (res as JsonAsset).json as Array<Door>
                                list.forEach(d=>{
                                    this.doorList.set(d.Id,d)
                                })
                                console.log('load Doors ok')
                                this.msg.string = 'load Doors ok'
                            }
                        })
                    })
                    this.downBtn.on(Node.EventType.TOUCH_END,this.downloadCurMapData,this)
                    this.showBtn.on(Node.EventType.TOUCH_END,this.showPath,this)
                    // this.downPathSp.on(Node.EventType.TOUCH_END,this.downPathSprite,this)
                    this.showId.string='101'
                });
            }
        })
    }
    curMapPathSpBuff:Uint8Array
    curMapCells:Array<Array<number>>;
    curMapId:number
    async showPath(){
        if(this.mapDataList==null){
            await this.loadMapPrefabs()
        }
        let id = parseInt(this.showId.string.trim())
        let cells = this.mapCells.get(id)
        if(cells){
            const needSize = 4 * 256 * 256;
            let buffer = new Uint8Array(needSize);
            for(let i=0;i<256;i++){
                for(let j=0;j<256;j++){
                    const t = cells[i][j]
                    const idx = (i*256+j)*4
                    let r:number,g:number,b:number;
                    if(t==0){
                        //可通行：灰色
                        r = g = b = 125 
                    }else if(t==1){
                        //安全区：绿色
                        r = b = 0
                        g = 150
                    }else{
                        //障碍：灰色色
                        r=g=b=0
                    }
                    buffer[idx]=r
                    buffer[idx+1]=g
                    buffer[idx+2]=b
                    buffer[idx+3]=255
                }
            }
            this.curMapPathSpBuff=buffer
            this.curMapCells=cells;
            this.curMapId=id;

            let dstTexture = new Texture2D();
            dstTexture.reset({
                width: 256,
                height: 256,
                format: Texture2D.PixelFormat.RGBA8888
            });
            dstTexture.uploadData(buffer);
            let sp = new SpriteFrame();
            sp.texture = dstTexture;
            this.path.spriteFrame = sp;
            // console.log('show path:',id,cells)
        }else{
            console.log('show path id的cells不存在:',id)
        }
    }
    // downPathSprite=()=>{
    //     this.downloadFromPixelData(this.curMapPathSpBuff,`path${this.curMapId}.png`)
    // }
    // downloadFromPixelData(pixelData: Uint8Array, fileName = 'preview.png') {
    //     const canvas = document.createElement('canvas');
    //     canvas.width = 256;
    //     canvas.height = 256;
    //     const ctx = canvas.getContext('2d')!;
        
    //     // Uint8Array 转 Uint8ClampedArray，创建 ImageData
    //     const imageData = new ImageData(new Uint8ClampedArray(pixelData.buffer), 256, 256);
    //     ctx.putImageData(imageData, 0, 0);
        
    //     canvas.toBlob(blob => {
    //         if (!blob) return;
    //         const a = document.createElement('a');
    //         a.href = URL.createObjectURL(blob);
    //         a.download = fileName;
    //         a.click();
    //         URL.revokeObjectURL(a.href);
    //     }, 'image/png');
    // }
    async initMapCell(id:number){
        return new Promise((resolve,reject)=>{
            let pathId = id
            if(id>509&&id<=515){
                pathId=509;//卡利玛1-7
            }else if(id>601&&id<=610){
                pathId=601;//恶魔1-10
            }else if(id>651&&id<=660){
                pathId=651;//血色1-10
            }else if(id>701&&id<=707){
                pathId=701;//远古战场
            }else if(id>801&&id<=807){
                pathId=801;//秘境
            }
            let path = `path${pathId}/spriteFrame`
            MapCreaterControl.I.terrainBundle.load(path, SpriteFrame,(error:Error,sp:SpriteFrame)=>{
                if(error != null){
                    console.error(`加载SpriteFrame资源失败 filePath：${path},err=${error}`)
                }else{
                    let tex = sp.texture;
                    let pixs = Tools.readPixels(tex.getGFXTexture())
                    let cells:Array<Array<number>>=[]
                    for(let i=0;i<256;i++){
                        cells[i]=[]
                        for(let j=0;j<256;j++){
                            const x = j * 32+16;
                            const y = i * 32+16;
                            const idx = (y * 8192 + x) * 4;
                            const r = pixs[idx]
                            const g = pixs[idx+1]
                            const b = pixs[idx+2]
                            const a = pixs[idx+3]
                            let v = 0
                            if(r==0&&g==0&&b==0){
                                v=2
                            }else if(a>0&&r==255&&g==255&&b==255){
                                v=1
                                // console.log(r,g,b)
                            }
                            cells[i][j]=v
                        }
                    }
                    MapCreaterControl.I.mapCells.set(id,cells)
                }
                resolve(1)
            })
        })
    }
    async loadMapPrefabs(){
        return new Promise(resolve=>{
            MapCreaterControl.I.mapDataList = []
            GD.commonBundle.loadDir('prefabs/maps',Prefab,async (err,prefabs:Prefab[])=>{
                if(prefabs){
                    console.log('map prefab loaded,prefabs=',prefabs)
                    for(let i=0;i<prefabs.length;i++){
                        await MapCreaterControl.I.init1Map(prefabs[i])
                    }
                    resolve(1)
                }
            })
        })
    }
    async init1Map(prefab:Prefab){
        let mapNode = instantiate(prefab);
        let curMap = mapNode.getComponent(MapControl)
        let bgTran = curMap.floorNode.getComponent(UITransform)
        curMap.mapWidth = bgTran.width/MapCellWidth>>0
        curMap.mapHeight = bgTran.height/MapCellWidth>>0
        await MapCreaterControl.I.initMapCell(curMap.mapId);
        let cells = MapCreaterControl.I.mapCells.get(curMap.mapId)
        if(cells){
            let mapData = GD.MapList.get(curMap.mapId)
            mapData.MapCells=cells;
            let spawnPos=curMap.spawnPointNode.getPosition();
            let i = (curMap.mapHeight/2>>0)-Math.floor(spawnPos.y/MapCellWidth);
            let j = Math.floor(spawnPos.x/MapCellWidth)+(curMap.mapWidth/2>>0);
            mapData.SpawnPoint=new Point(i,j);
            //根据地图中放置的建筑类障碍，填充障碍数据
            mapData.Doors=[]
            curMap.entityLayer.children.forEach((n)=>{
                //需要旋转45度
                let pos:Vec3 = n.getPosition();
                const origX = pos.x * CosRad1 - pos.y * SinRad1;
                const origY = pos.x * SinRad1 + pos.y * CosRad1;
                //算出i,j
                const i = Math.floor(curMap.mapHeight/2-origY/MapCellWidth);//只能用Math.floor，因为负数的>>与正数表现不一致
                const j = Math.floor(origX/MapCellWidth+curMap.mapWidth/2);
                if(n.name.startsWith('door')){
                    let ctl = n.getComponent(DoorControl);
                    let door:Door = MapCreaterControl.I.doorList.get(ctl.doorId)
                    if(door){
                        door.AtI = i
                        door.AtJ = j
                        mapData.Doors.push(door);
                    }
                }else{
                    cells[i][j]=2;
                }
            });
            //刷怪点
            mapData.MonsterPoints=[]
            curMap.monsterPoints.children.forEach((n)=>{
                //不需要旋转45度
                let pos = n.getPosition();
                let i = -Math.floor(pos.y/MapCellWidth)+(curMap.mapHeight/2>>0);
                let j = Math.floor(pos.x/MapCellWidth)+(curMap.mapWidth/2>>0);
                let idLabel = n.getComponent(Label);
                if(idLabel){
                    let strArr = idLabel.string.trim().split(',');
                    let ids = []
                    strArr.forEach(v=>{
                        ids.push(parseInt(v))
                    })
                    mapData.MonsterPoints.push(new MonsterPoints(i,j,ids));
                }
            });
            mapData.BossPoints=[]
            curMap.bossPoints.children.forEach((n)=>{
                //不需要旋转45度
                let pos = n.getPosition();
                let i = -Math.floor(pos.y/MapCellWidth)+(curMap.mapHeight/2>>0);
                let j = Math.floor(pos.x/MapCellWidth)+(curMap.mapWidth/2>>0);
                let idLabel = n.getComponent(Label);
                if(idLabel){
                    let strArr = idLabel.string.trim().split(',');
                    strArr.forEach(v=>{
                        mapData.BossPoints.push(new MonsterPoints(i,j,[parseInt(v)]));
                    })
                }
            });
            MapCreaterControl.I.mapDataList.push(mapData);
            console.log(curMap.mapId,'mapData=',mapData)
            this.msg.string = `${curMap.mapId} mapData inited ok`
        }else{
            console.log('map id 对应的path图不存在',curMap.mapId)
            this.msg.string = `${curMap.mapId} 对应的path图不存在`
        }
    }
    async downloadCurMapData(){
        if(this.mapDataList==null){
            this.loadMapPrefabs().then(v=>{
                //保存当前地图完整数据为json文件(该文件用于服务器，客户端不需要)
                Tools.saveToJsonFileForBrowser(this.mapDataList,'maps.json');
            })
        }else{
            //保存当前地图完整数据为json文件(该文件用于服务器，客户端不需要)
            Tools.saveToJsonFileForBrowser(this.mapDataList,'maps.json');
        }
    }
    // initMaps(){
    //     this.mapDataList = []
    //     GD.MapList.forEach(m=>{
    //         const id = m.Id
    //         Tools.loadPrefab(`prefabs/maps/${id}`,resources).then(pf=>{
    //             if(pf){
    //                 let mapNode = instantiate(pf as Prefab);
    //                 let curMap = mapNode.getComponent(MapControl)
    //                 let bgTran = curMap.floorNode.getComponent(UITransform)
    //                 curMap.mapWidth = bgTran.width/MapCellWidth>>0
    //                 curMap.mapHeight = bgTran.height/MapCellWidth>>0
    //                 this.initMapCell(curMap.mapId).then(v=>{
    //                     let cells = this.mapCells.get(curMap.mapId)
    //                     if(cells){
    //                         let mapData = GD.MapList.get(curMap.mapId)
    //                         mapData.MinNeedLv=mapData.NeedLvs[0];
    //                         mapData.CanPk=curMap.canPk;
    //                         mapData.MapCells=cells;
    //                         let spawnPos=curMap.spawnPointNode.getPosition();
    //                         let i = (curMap.mapHeight/2>>0)-Math.floor(spawnPos.y/MapCellWidth);
    //                         let j = Math.floor(spawnPos.x/MapCellWidth)+(curMap.mapWidth/2>>0);
    //                         mapData.SpawnPoint=new Point(i,j);
    //                         //根据地图中放置的建筑类障碍，填充障碍数据
    //                         mapData.Doors=[]
    //                         curMap.entityLayer.children.forEach((n)=>{
    //                             //需要旋转45度
    //                             let pos:Vec3 = n.getPosition();
    //                             const origX = pos.x * CosRad1 - pos.y * SinRad1;
    //                             const origY = pos.x * SinRad1 + pos.y * CosRad1;
    //                             //算出i,j
    //                             const i = Math.floor(curMap.mapHeight/2-origY/MapCellWidth);//只能用Math.floor，因为负数的>>与正数表现不一致
    //                             const j = Math.floor(origX/MapCellWidth+curMap.mapWidth/2);
    //                             if(n.name.startsWith('door')){
    //                                 let ctl = n.getComponent(DoorControl);
    //                                 let door:Door = this.doorList.get(ctl.doorId)
    //                                 if(door){
    //                                     door.AtI = i
    //                                     door.AtJ = j
    //                                     mapData.Doors.push(door);
    //                                 }
    //                             }else{
    //                                 cells[i][j]=2;
    //                             }
    //                         });
    //                         //刷怪点
    //                         mapData.MonsterPoints=[]
    //                         curMap.monsterPoints.children.forEach((n)=>{
    //                             //不需要旋转45度
    //                             let pos = n.getPosition();
    //                             let i = -Math.floor(pos.y/MapCellWidth)+(curMap.mapHeight/2>>0);
    //                             let j = Math.floor(pos.x/MapCellWidth)+(curMap.mapWidth/2>>0);
    //                             let idLabel = n.getComponent(Label);
    //                             if(idLabel){
    //                                 let strArr = idLabel.string.trim().split(',');
    //                                 strArr.forEach(v=>{
    //                                     mapData.MonsterPoints.push(new MonsterPoints(i,j,parseInt(v)));
    //                                 })
    //                             }
    //                         });
    //                         mapData.BossPoints=[]
    //                         curMap.bossPoints.children.forEach((n)=>{
    //                             //不需要旋转45度
    //                             let pos = n.getPosition();
    //                             let i = -Math.floor(pos.y/MapCellWidth)+(curMap.mapHeight/2>>0);
    //                             let j = Math.floor(pos.x/MapCellWidth)+(curMap.mapWidth/2>>0);
    //                             let idLabel = n.getComponent(Label);
    //                             if(idLabel){
    //                                 let strArr = idLabel.string.trim().split(',');
    //                                 strArr.forEach(v=>{
    //                                     mapData.BossPoints.push(new MonsterPoints(i,j,parseInt(v)));
    //                                 })
    //                             }
    //                         });
    //                         this.mapDataList.push(mapData);
    //                         console.log(curMap.mapId,'mapData=',mapData)
    //                     }else{
    //                         console.log('map id 对应的path图不存在',curMap.mapId)
    //                     }
    //                 })
    //             }else{
    //                 console.log('map id 对应的prefab不存在',id)
    //             }
    //         })
    //     })
    // }
}

