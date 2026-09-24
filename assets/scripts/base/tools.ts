import { AssetManager, director, gfx, instantiate, JsonAsset, Label, Node, Prefab, randomRange, resources, RichText, Sprite, SpriteFrame, sys, Texture2D, Toggle, UITransform, Vec2, Vec3 } from "cc";
import GD from "./GameData";
import { AtkDtTzTypeString, AtkEquipBase, AtkTzTypeString, BodyType, BossNamePre, BoxMsg, ChatChannelColors, ChatChannelNames, ChengHaoTypes, ct, DefDtTzTypeString, DefEquipBase, DefTzTypeString, DefZyTypes as DefZyTypes, DmgType, EquipType, FuMoTypeStr, Item, ItemType, ItemTypeColor, ItemTypeLightType, LightType, NeedType, PetBase, Point, PointTypeString, PopViewType, PriceTypeColor, QuestData, RewordNameObj, RingNeckBase, RoleType, RoleTypeLvStr, ShopItem, ShopItemStatus, Skill, SkillItem,  TaskType,  Unit, UnitState, UnitType, WingBase, WingZyPros, YsTypeString, ZSPros, ZSType, ZyTypeString } from "./types";
import WS from "./net";
import { ConfigType, Err, MT } from "./MT";
import { UIMgr } from "../managers/UIMgr";
import { PlayerControl, PlayerType } from "../battle/PlayerControl";
import {  CanPianRlInfo, ChengZhuBox, CosRad, CosRad1, DaTianShiBox, FbMaterialInfoStr, GrowthProNames, HoleItemRandomInfo, HuiKuiBox as HuiKuiBoxInfo, ItemFramePath, KfJfRandomInfo, PriceTypeStr, PrivateLineKaInfo, ShenQiBox, SinRad, SinRad1, TowerItemInfo, UnlistedStr } from "./consts";
import { List } from "../UiComps/List";
import { ShowItemType } from "../pages/PopView";
import { MapCellWidth, MapCellWidth_Half } from "../battle/BattleManager";
import { MapControl } from "../battle/MapControl";
import Pools from "./Pools";
import { Mail } from "../pages/MailPage";
import { EquipmentSlot } from "../UiComps/EquipmentSlot";
import { RoleUIControl } from "../battle/RoleUIControl";
import { HunShou } from "../pages/HunView";
import GameManager from "../managers/GameManager";

export default class Tools{
    // static formatTimestampToLocale(timestamp) {
    //     const date = new Date(timestamp * 1000); // 转为毫秒
    //     // 转换为北京时间字符串
    //     const beijingTime = date.toLocaleString('zh-CN', {
    //         timeZone: 'Asia/Shanghai',
    //         year: 'numeric',
    //         month: '2-digit',
    //         day: '2-digit',
    //         hour: '2-digit',
    //         minute: '2-digit',
    //         second: '2-digit',
    //         hour12: false
    //     });
    //     // console.log(beijingTime); // 输出结果
    // }
    //返回当前的北京时间的时间戳（秒）
    static getBeiJingSecond():number{
        return Tools.getBeijingTime().getTime()/1000>>0
    }
    static getBeijingTime() {
        // 获取当前时间与 UTC 的偏移（分钟）
        const date=new Date()
        const utcOffset = date.getTimezoneOffset(); // 例如纽约是 +240（即 UTC-4）
        
        // 北京时间是 UTC+8 → 偏移为 -480 分钟
        const beijingOffset = -480;

        // 计算差值（单位：分钟）
        const diffMinutes = beijingOffset - utcOffset;

        // 创建新时间：原始时间 + 差值（转换为北京时间对应的本地时间表示）
        const beijingDate = new Date(date.getTime() + diffMinutes * 60 * 1000);

        return beijingDate;
    }
    //判断一个数是否是小数 
    static isDecimal(num: number): boolean {  
        return num % 1 !== 0;  
    }
    public static get2dis_pix(i1:number,j1:number,i2:number,j2:number):number{
        let a=i1-i2;
        let b=j1-j2;
        return Math.floor(Math.sqrt(a*a+b*b))
    }
    public static get2dis(i1:number,j1:number,i2:number,j2:number):number{
        return Math.max(Math.abs(i1-i2),Math.abs(j1-j2))
    }
    //判断一个值是否为在范围内的2的N次方，[min,max]
    public static isPowOfTwo(num:number,min:number,max:number):boolean {
        return num>=min && num<=max && (num&(num-1))===0;
    }
    public static getNowTime():number|Long{
        let now = Tools.getBeijingTime()
	    return now.getFullYear()*10000000000 + (now.getMonth()+1)*100000000 + now.getDate()*1000000 + now.getHours()*10000 + now.getMinutes()*100 + now.getSeconds()
    }
    public static getTimeString(num:number|Long):string{
        let str = num+'';
	    return str.slice(0,4)+'年' + str.slice(4,6)+'月' + str.slice(6,8)+'日' + str.slice(8,10)+'点';
    }
    public static formatTimestamp(timestamp: number): string {  
        const date = new Date(timestamp * 1000); // 将秒转换为毫秒  
        let month = date.getMonth() + 1
        let day = date.getDate();
        let hour = date.getHours();
        let min = date.getMinutes();
        let sec =date.getSeconds();
        //${date.getFullYear()}-
        return `${month<10?'0'+month:month}-${day<10?'0'+day:day} ${hour<10?'0'+hour:hour}:${min<10?'0'+min:min}:${sec<10?'0'+sec:sec}`;  
    }
    public static getShopItemPendingTime(item: outer_pb.IShopItem): any {  
        // let delta = (Date.now()/1000>>0)-item.EndTime
        // const pendtime = GD.configs.get(ConfigType.PendTime)
        // const UnlistTime = GD.configs.get(ConfigType.UnlistTime)
        // if(delta<=pendtime){
        //     let seconds = pendtime-delta;
        //     return `竞购：${this.getDeltaTimeString(seconds)}`
        //     // const hours = seconds/3600>>0; // 计算小时  
        //     // const minutes = (seconds%3600)/60>>0; // 计算分钟  
        //     // const s = seconds%60; // 计算剩余秒数
        //     // return `竞购：${hours<10?'0'+hours:hours}:${minutes<10?'0'+minutes:minutes}:${s<10?'0'+s:s}`
        // }else if(delta<=UnlistTime){
        //     let seconds = UnlistTime-delta;
        //     return `下架：${this.getDeltaTimeString(seconds)}`
        //     // const hours = seconds/3600>>0; // 计算小时  
        //     // const minutes = (seconds%3600)/60>>0; // 计算分钟  
        //     // const s = seconds%60; // 计算剩余秒数
        //     // return `下架：${hours<10?'0'+hours:hours}:${minutes<10?'0'+minutes:minutes}:${s<10?'0'+s:s}`
        // }else{
        //     return UnlistedStr
        // }
        let obj:any={}
        // let delta = item.EndTime-(Date.now()/1000>>0)
        let delta = item.EndTime-Tools.getBeiJingSecond()
        if(item.Status==ShopItemStatus.StatusPending){
            obj.str = `竞购：${this.getDeltaTimeString(delta)}`
            obj.color = ct.red
        }else if(item.Status==ShopItemStatus.StatusAvailable){
            obj.str =  `下架：${this.getDeltaTimeString(delta)}`
            obj.color = ct.blue
        }else{
            obj.str =  UnlistedStr
            obj.color = ct.brown
        }
        return obj;
    }
    static formatNowTime(timestamp: number): string {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();

        // 补齐两位数，比如 7 => "07"
        const hoursStr = hours.toString().padStart(2, '0');
        const minutesStr = minutes.toString().padStart(2, '0');

        return `时间：${hoursStr}:${minutesStr}`;
    }
    static getDeltaTimeString(seconds:number):string{
        const hours = seconds/3600>>0; // 计算小时  
        const minutes = (seconds%3600)/60>>0; // 计算分钟  
        const s = seconds%60; // 计算剩余秒数
        return `${hours<10?'0'+hours:hours}:${minutes<10?'0'+minutes:minutes}:${s<10?'0'+s:s}`
    }
    static getRemainTimeString1(time:number):string{
        let remain = time - Tools.getBeiJingSecond()//(Date.now()/1000>>0)
        if(remain<0)remain=0
        // const hours = ((remain % (24 * 3600)) / 3600)>>0;
        const minutes = ((remain % 3600) / 60)>>0;
        const s = remain % 60;
        return `${minutes<10?'0'+minutes:minutes}:${s<10?'0'+s:s}` //:${s<10?'0'+s:s}
    }
    static getRemainTimeString(time:number):string{
        let remain = time - Tools.getBeiJingSecond()//(Date.now()/1000>>0)
        if(remain<0)remain=0
        let day=''
        //const day=? //如何计算剩余天数
        // const hours = remain/3600>>0; // 计算小时  
        // const minutes = (remain%3600)/60>>0; // 计算分钟  
        // const s = remain%60; // 计算剩余秒数

        const days = (remain / (24 * 3600))>>0;        // 1天 = 86400秒
        if(days>0){
            day=`${days}天`
        }
        const hours = ((remain % (24 * 3600)) / 3600)>>0;
        const minutes = ((remain % 3600) / 60)>>0;
        // const s = remain % 60;
        return `${day}${hours<10?'0'+hours:hours}:${minutes<10?'0'+minutes:minutes}` //:${s<10?'0'+s:s}
    }
    static sortBagEquip(item1:outer_pb.IEquip,item2:outer_pb.IEquip){
        if(item1.IsLock){
            return -1;
        }
        if(item2.IsLock){
            return 1;
        }
        return item1.Id-item2.Id
    }
    static calAtkCd(speed:number):number {
        const max = GD.configs.get(ConfigType.DefaultAtkCd);
        if (speed >= 500) {
            return GD.configs.get(ConfigType.PlayerMinAtkCd) //0.2;
        }
        if (speed <= 0) {
            return max //1.8;
        }
        if (speed <= 100) {
            return max - 0.0064*speed;
        } else if (speed <= 200) {
            return max - 0.0064*100 - 0.0041*(speed-100);
        } else if (speed <= 300) {
            return max - 0.0064*100 - 0.0041*100 - 0.0027*(speed-200);
        } else if (speed <= 400) {
            return max - 0.0064*100 - 0.0041*100 - 0.0027*100 - 0.0017*(speed-300);
        } else {
            return max - 0.0064*100 - 0.0041*100 - 0.0027*100 - 0.0017*100 - 0.0011*(speed-400);
        }
        // if (speed <= 150) {
        //     return max - 0.005*speed;
        // } else if (speed <= 300) {
        //     return max - 0.005*150 - 0.003*(speed-150);
        // } else {
        //     return max - 0.005*150 - 0.003*150 - 0.002*(speed-300);
        // }
    }
    public static saveToJsonFileForBrowser(data: any, fileName: string) {
        if (sys.isBrowser) {
            var content = JSON.stringify(data)
            // console.log(content)
            let textFileAsBlob = new Blob([content], { type: 'application/json' });
            let downloadLink = document.createElement("a");
            downloadLink.download = fileName;
            downloadLink.innerHTML = "Download File";
            if (window.webkitURL != null) {
                downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
            }
            downloadLink.click();
        }
    }
    public static loadSpriteFrame(path:string,boundle:AssetManager.Bundle):Promise<SpriteFrame>{
        return new Promise((resolve,reject)=>{
            boundle.load(path+ "/spriteFrame", SpriteFrame,(error:Error,sp:SpriteFrame)=>{
                // if(error != null){
                //     console.error(`加载SpriteFrame资源失败 filePath：${path},err=${error}`)
                //     reject(null)
                //     return
                // }
                resolve(sp) 
            })
        })
    }
    public static async loadTexture2D(path:string,boundle:AssetManager.Bundle):Promise<Texture2D>{
        return new Promise((resolve,reject)=>{
            boundle.load(path + "/texture", Texture2D,(error:Error,sp:Texture2D)=>{
                // if(error != null){
                //     console.error(`加载Texture2D资源失败 filePath：${path},err=${error}`)
                //     reject(null)
                //     return
                // }
                resolve(sp) 
            })
        })
    }
    // public static async loadTexture2Ds(path:Array<string>):Promise<[Texture2D]>{
    //     return new Promise((resolve,reject)=>{
    //         boundle.load(path, Texture2D,(error:Error,sp:[Texture2D])=>{
    //             if(error != null){
    //                 console.error(`加载Texture2Ds资源失败 filePath：${path},err=${error}`)
    //                 reject(null)
    //                 return
    //             }
    //             resolve(sp) 
    //         })
    //     })
    // }
    public static loadPrefab(path:string,boundle:AssetManager.Bundle):Promise<Prefab|string>{
        return new Promise((resolve,reject)=>{
            boundle.load(path, Prefab,(error:Error,prefab:Prefab)=>{
                // if(error != null){
                //     console.error(`加载Prefab资源失败 filePath：${path},err=${error}`)
                //     reject(null)
                //     return
                // }
                resolve(prefab) 
            })
        })
    }
    public static async loadJsonAsset(path:string,boundle:AssetManager.Bundle):Promise<JsonAsset|string>{
        return new Promise((resolve,reject)=>{
            boundle.load(path, JsonAsset,(error:Error,res:JsonAsset)=>{
                // if(error != null){
                //     console.error(`加载JsonAsset资源失败 filePath：${path},err=${error}`)
                //     reject(null)
                //     return
                // }
                resolve(res) 
            })
        })
    }
    public static getPlayer(roleType:number,old:PlayerControl=null){
        return new Promise(resolve=>{
            if(old){
                resolve(old)
            }else{
                var player:PlayerControl;
                // let pool = Pools.otherPool.get(roleType);
                // if(!pool){
                //     pool = []
                //     Pools.otherPool.set(roleType,pool)
                // }
                if(Pools.RolePool.length==0){
                    // Tools.loadPrefab(`prefabs/roles/role${roleType}`,GD.commonBundle).then((pf:Prefab)=>{
                    Tools.loadPrefab(`prefabs/roles/role`,GD.commonBundle).then((pf:Prefab)=>{
                        player = instantiate(pf).getComponent(PlayerControl);
                        player.roleType = roleType;
                        player.node.active = true;
                        resolve(player)
                    })
                }else{
                    player = Pools.RolePool.pop().getComponent(PlayerControl);
                    // console.log('getPlayer from pool',player)
                    player.roleType = roleType;
                    player.node.active = true;
                    resolve(player)
                }
            }
        })
    }
    static get_UI_Role(role:any,parent:Node,isOther:boolean){
        return new Promise(resovle=>{
            let player:RoleUIControl;
            if(parent.children.length>0){
                player = parent.children[0].getComponent(RoleUIControl)
                player.initData(role,isOther)
                resovle(player)
            }else{
                if(Pools.otherUIPool.length==0){
                    Tools.loadPrefab(`prefabs/roles/role_ui`,GD.commonBundle).then((pf:Prefab)=>{
                        player = instantiate(pf).getComponent(RoleUIControl);
                        player.initData(role,isOther)
                        parent.addChild(player.node)
                        resovle(player)
                    })
                }else{
                    player = Pools.otherUIPool.pop().getComponent(RoleUIControl);
                    player.initData(role,isOther)
                    parent.addChild(player.node)
                    resovle(player)
                }
            }
        })
    }
    // public static getPlayerUI(roleType:number,layer:number,old:PlayerControl=null){
    //     return new Promise(resolve=>{
    //         if(old){
    //             resolve(old)
    //         }else{
    //             var player:PlayerControl;
    //             // let pool = Pools.otherUIPool.get(roleType);
    //             // if(!pool){
    //             //     pool = []
    //             //     Pools.otherUIPool.set(roleType,pool)
    //             // }
    //             if(Pools.otherUIPool.length==0){
    //                 // Tools.loadPrefab(`prefabs/roles/role${roleType}`,GD.commonBundle).then((pf:Prefab)=>{
    //                 Tools.loadPrefab(`prefabs/roles/role`,GD.commonBundle).then((pf:Prefab)=>{
    //                     player = instantiate(pf).getComponent(PlayerControl);
    //                     player.roleType = roleType;
    //                     player.node.active = true;

    //                     player.node.setRotationFromEuler(Vec3.ZERO);
    //                     player.hpBar.node.active=false;
    //                     player.sdBar.node.active=false;
    //                     // role.direction=0;
    //                     player.node.position=new Vec3()
    //                     player.node.layer = layer;
    //                     player.node.children.forEach(node=>{
    //                         node.layer=layer;
    //                         node.children.forEach(n=>{
    //                             n.layer=layer;
    //                             n.children.forEach(n=>{
    //                                 n.layer=layer;
    //                             })
    //                         })
    //                     })
    //                     player.state = UnitState.Idle;
    //                     player.node.getComponent(MotionStreak).enabled=false;
    //                     resolve(player)
    //                 })
    //             }else{
    //                 player = Pools.otherUIPool.pop().getComponent(PlayerControl);
    //                 player.roleType = roleType;
    //                 player.node.active = true;
    //                 resolve(player)
    //             }
    //         }
    //     })
    // }
    public static readPixels(texture: gfx.Texture): Uint8Array {
        let { width, height } = texture
        let arrayBuffer = new Uint8Array(width * height * 4)
        const bufferViews: ArrayBufferView[] = [];
        bufferViews.push(arrayBuffer)
        let region = new gfx.BufferTextureCopy();
        region.texOffset.x = 0;
        region.texOffset.y = 0;
        region.texExtent.width = width;
        region.texExtent.height = height;
        director.root.device.copyTextureToBuffers(texture, bufferViews, [region]);
        return new Uint8Array(arrayBuffer);
    }
    public static drawPathTexture(targetSp:Sprite,cells:Array<Array<number>>){
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
                    g = 50
                }else{
                    //障碍：黑色
                    r=g=b=0
                }
                buffer[idx]=r
                buffer[idx+1]=g
                buffer[idx+2]=b
                buffer[idx+3]=255
            }
        }
        let dstTexture = new Texture2D();
        dstTexture.reset({
            width: 256,
            height: 256,
            format: Texture2D.PixelFormat.RGBA8888
        });
        dstTexture.uploadData(buffer);
        let sp = new SpriteFrame();
        sp.texture = dstTexture;
        targetSp.spriteFrame = sp;
    }
    public static formatMoneyString(num:number):string{
        let str=''
        if(num>=100000000){
            str=`${((num/100000000*100)>>0)/100}亿`
        }else{
            str=num.toLocaleString()
        }
        return str
    }
    public static pxPosToCellPos(x:number,y:number):Point{
        let m = GD.curMap;
        const i = Math.floor(m.mapHeight/2-y/MapCellWidth);//只能用Math.floor，因为负数的>>与正数表现不一致
        const j = Math.floor(x/MapCellWidth+m.mapWidth/2);
        return new Point(i,j)
    }
    public static pxPosToCellPos_Rotate45(x:number,y:number,m:MapControl=GD.curMap):Point{
        // let m = GD.curMap;
        //把坐标旋转45度
        const origX = x * CosRad - y * SinRad;
        const origY = x * SinRad + y * CosRad;
        //算出i,j
        const i = Math.floor(m.mapHeight/2-origY/MapCellWidth);//只能用Math.floor，因为负数的>>与正数表现不一致
        const j = Math.floor(origX/MapCellWidth+m.mapWidth/2);
        return new Point(i,j)
    }
    public static cellPosToPxPos_Rotate45(i:number,j:number):Vec2{
        let m = GD.curMap;
        //先计算出未旋转45之前的坐标
        const x = (j-m.mapWidth/2)*MapCellWidth + MapCellWidth_Half;
        const y = (m.mapHeight/2-i)*MapCellWidth - MapCellWidth_Half;
        //然后把该坐标旋转45度
        const rx = x*CosRad1+y*SinRad1
        const ry = -x*SinRad1+y*CosRad1
        return new Vec2(rx,ry)
    }
    public static getPvPString(t:EquipType,lv:number):string{
        switch(t){
            case EquipType.JianTong:
            case EquipType.ZHBook:
            case EquipType.Weapon:
            case EquipType.Wing:
            case EquipType.Neck:
                let dmg=50
                if(GD.role.data.IsYkMode){
                    dmg=10
                }
                return `PvP${lv}级：PVP攻击力+${dmg*lv}  PVP攻击成功率+${20*lv}`
            case EquipType.Head:
            case EquipType.Body:
                return `PvP${lv}级：SD恢复量增加+${100*lv}  PVP防御成功率+${20*lv}`
            case EquipType.Leg:
                let def=50
                if(GD.role.data.IsYkMode){
                    def=30
                }
                return `PvP${lv}级：PVP防御力+${def*lv}  PVP防御成功率+${20*lv}`
            case EquipType.Hand:
            case EquipType.Ring:
                let hp=100
                if(GD.role.data.IsYkMode){
                    hp=20
                }
                return `PvP${lv}级：最大生命值+${hp*lv}  PVP防御成功率+${20*lv}`
            case EquipType.Foot:
            case EquipType.Shield:
                return `PvP${lv}级：最大SD值+${500*lv}  PVP防御成功率+${20*lv}`
        }
    }
    public static getZsProString(t:ZSType,lv:number):string{
        let n = ZSPros[t-1][lv];
        let text = `再生${lv}级：`
        switch(t){
            case ZSType.JZAtk:
                return text+='物理技能加重伤害上升 +'+n
            case ZSType.JZAtk_magic:
                //加重攻击力（致命：幸运、卓越、双倍一击时附加该伤害，如果同时出现幸运、卓越、双倍，则相当于+3次jzAtk）
                return text+='魔法技能加重伤害上升 +'+n
            case ZSType.atk:
                return text+='物理攻击力上升 +'+n
            case ZSType.atkPvPAtkRate:
                return text+='攻击成功率上升(PVP) +'+n
            case ZSType.addSDRate:
                return text+='SD比例提高 +'+n
            case ZSType.autoAddHp:
                return text+='生命值自动回复量提高 +'+n
            case ZSType.autoAddMp:
                return text+='魔法值自动回复量提高 +'+n;
            case ZSType.addDef:
                return text+='防御力提高 +'+n;
            case ZSType.defPkRate:
                return text+='防御成功率提高(PVP) +'+n;
            case ZSType.minMagicAtk:
                return text+='最小魔法攻击力提高 +'+n;
            case ZSType.maxMagicAtk:
                return text+='最大魔法攻击力提高 +'+n;
            case ZSType.magicAtk:
                return text+='魔法攻击力提高 +'+n;
            case ZSType.MinZuZhouAtk:
                return text+='最小诅咒力提高 +'+n;
            case ZSType.MaxZuZhouAtk:
                return text+='最大诅咒力提高 +'+n;
            case ZSType.ZuZhouAtk:
                return text+='诅咒力提高 +'+n;
            case ZSType.maxAG:
                return text+='最大AG提高 +'+n;
            case ZSType.minAtk:
                return text+='最小物理攻击力提高 +'+n;
            case ZSType.maxAtk:
                return text+='最大物理攻击力提高 +'+n;
            case ZSType.maxHP:
                return text+='最大HP提高 +'+n;
            case ZSType.reduceZSDmg:
                return text+='伤害减少量提高 +'+n;
            case ZSType.reduceSDRate:
            case ZSType.reduceSDRate_magic:
                return text+='SD减少率提高 +'+n;
            case ZSType.skillAtk:
                return text+='物理技能攻击力 +'+n;
            case ZSType.skillAtk_magic:
                return text+='魔法技能攻击力 +'+n;
            case ZSType.wsSDRate:
                return text+='物理攻击无视SD机率提高 +'+n;
            case ZSType.wsSDRate_magic:
                return text+='魔法攻击无视SD机率提高 +'+n;
        }
    }
    static getBodyType(equip:outer_pb.IEquip):BodyType{
        let bodyType:BodyType
        let equipType:EquipType = equip.Id/10000>>0;
        switch (equipType){
            case EquipType.Shield:
                return BodyType.RightHand
            case EquipType.Head:
            case EquipType.Body:
            case EquipType.Leg:
            case EquipType.Hand:
            case EquipType.Foot:
                return equipType as number;//防具的EquipType==BodyType（头铠腿手鞋）
            case EquipType.Neck:
                return BodyType.Neck;
            case EquipType.Ring:
                let Left_Ring = GD.role.BodyEquips[BodyType.Left_Ring]
                if(Left_Ring==null){
                    //左手为空时优先比较左手
                    return BodyType.Left_Ring
                }else{
                    return BodyType.Right_Ring
                }
            case EquipType.Weapon:
            case EquipType.JianTong:
                let base:AtkEquipBase = GD.EquipBaseDatas.get(equip.Id);
                if(base.HandType==0){//单手武器
                    if(equipType==EquipType.JianTong){//箭筒
                        if(GD.role.data.RoleType==4) bodyType=BodyType.RightHand;
                    }else{
                        //单手武器，只有战士1、魔剑士8、弓箭手4可在右手装备武器
                        if((GD.role.data.RoleType&(1+4+8))>0){
                            //左手为空时优先装备左手
                            let leftHand = GD.role.BodyEquips[BodyType.LeftHand]
                            if(leftHand==null){
                                //左手为空时优先装备左手
                                return BodyType.LeftHand
                            }else{
                                let rightHand = GD.role.BodyEquips[BodyType.RightHand];
                                if(rightHand==null){
                                    //右手为空时，检查左手是否是双手武器
                                    let leftBase = GD.EquipBaseDatas.get(leftHand.Id);
                                    if(leftBase.HandType==1){
                                        return null
                                    }else{
                                        return BodyType.RightHand;
                                    }
                                }else{
                                    //左右手都不为空时，替换掉左手
                                    return BodyType.LeftHand
                                }
                            }
                        }else{
                            //只能装备在左手
                            bodyType=BodyType.LeftHand;
                        }
                    }
                }else{//双手武器
                    bodyType=BodyType.LeftHand
                }
                return bodyType;
            case EquipType.Pet:
                return BodyType.Pet;
            case EquipType.Em:
                return BodyType.Em;
            case EquipType.TianShi:
                return BodyType.TianShi;
            case EquipType.XunZhang:
                return BodyType.XunZhang;
            case EquipType.Em:
                return BodyType.Em;
            case EquipType.Horse:
                return BodyType.Horse;
            case EquipType.Wing:
                return BodyType.Wing;
        }
        return null
    }
    static getMapName(pos:outer_pb.IPosition,addPos:boolean=true):string{
        let room = GD.MapList.get(pos.RoomId)
        if(room){
            let lineN = pos.LineId=="99"?"专":pos.LineId
            let posstr = ''
            if(addPos){
                posstr=`:${pos.I},${pos.J}`
            }
            return `[${`${room.Name}-${lineN}线${posstr}`}]`
            // return `[${`${room.Name}-${GD.lvStr[pos.WorldLv]}-${lineN}线${posstr}`}]`
        }
        // let regions = GD.worldMap[pos.WorldLv].MapRegions
        // for(let i=0;i<regions.length;i++){
        //     let map = regions[i].MapDataList.find(m=>{return m.Id==pos.RoomId})
        //     if(map){
        //         let lineN = pos.LineId=="99"?"专":pos.LineId
        //         let posstr = ''
        //         if(addPos){
        //             posstr=`:${pos.I},${pos.J}`
        //         }
        //         return `[${`${map.Name}-${GD.lvStr[pos.WorldLv]}-${lineN}线${posstr}`}]`
        //     }
        // }
    }
    static getRewardsStr(list:number[][],obj:{Items:Array<any>},base:QuestData,addByLv:boolean=true):Array<string>{
        let names:Array<string>=[]
        if(list.length>0){
            list.forEach(data=>{
                let id = data[0]
                let num = data[1]
               
                let name:string
                if(id<10000){
                    name = GD.ItemBaseDatas.get(id).Name
                    let d=GD.role.data
                    let up=0
                    if(addByLv){
                        up = d.Lv-10;//+d.DsLv;
                        if(d.ZsNum>0){
                            up = 400-10;//+d.DsLv
                        }
                    }
                    const isVip = GD.role.hasGoldYk(false);
                    let n=1
                    if(id==13){
                        //经验值
                        if(GD.role.data.IsYkMode){
                            if(base&&base.TaskType!=TaskType.Main){
                                num=num/GD.role.data.DiaRate>>0
                            }
                            num += up*100
                        }else{
                            num += up*200
                        }
                        if(isVip)n=3
                    }else if(id==14){
                        //金币
                        if(GD.role.data.IsYkMode){
                            if(base&&base.TaskType!=TaskType.Main){
                                num=num/GD.role.data.DiaRate>>0
                            }
                            num += up*100
                        }else{
                            num += up*200
                        }
                        if(isVip)n=3
                    }else if(id==15){
                        //钻石
                        if(base&&base.TaskType!=TaskType.ChengJiu){
                            //成就奖励的钻石不随等级提升
                            num += up/10>>0
                        }
                        if(num>1){
                            num = num/GD.role.data.DiaRate>>0
                        }
                        if(num==0)num=1
                        if(isVip)n=3
                    }else if(base&&base.TaskType==TaskType.ChengJiu && num > 1 && GD.role.data.IsYkMode && (id == 624 || id == 627)){
                        //新大区成就任务奖励附魔宝石、勋章碎片数量减半
                        num = num/2>>0
                    }
                    let num1:string
                    let n_s=''
                    if(n>1){
                        n_s=`<color=${ct.brown}>x${n}</>`
                    }
                    if(num>=10000){
                        num1 = `${(num/10000*10>>0)/10}万${n_s}`
                    }else{
                        num1=`${num}${n_s}`
                    }
                    // names.push(`<color=${Tools.getItemColor(id)}>${name}</>x${num}`)
                    let item = outer_pb.DropItem.create()
                    item.Uid=randomRange(1,99999)+''
                    item.ItemId=id
                    item.ItemNum=num
                    item.ItemType=2
                    obj.Items.push(item)
                    names.push(`<u><color=${Tools.getItemColor(id)} click="onClick" param="i${item.Uid}">${name}</></u>x${num1}`)
                }else if(base){
                    name = GD.EquipBaseDatas.get(id).Name
                    if(base.EquipPros.length>0){
                        let qh = base.EquipPros[0]
                        let zj = base.EquipPros[1]
                        let xy = base.EquipPros[2]
                        name+=`+${qh}z${zj}xy${xy}`
                    }
                    names.push(`<color=${ct.blue}>${name}</>`)
                }
            })
        }
        return names
    }
    static newGetEquipMsg(equip:outer_pb.IEquip,needReturnBoxMsg:boolean=false,playSound:boolean=true):BoxMsg{
        let base = GD.EquipBaseDatas.get(equip.Id)
        if(base){
            let msg:string=base.Name
            let color:ct=ct.white;
            let et=equip.Id/10000>>0
            if(et>=EquipType.Pet){
                color=ct.purple
            }else{
                if(equip.QhLv>0){
                    msg +=`+${equip.QhLv}`
                }
                if(equip.ZjLv>0){
                    msg+='+属性'
                    color=ct.blue
                }
                if(equip.YsList.length>0){
                    msg+='+附魔'
                    color=ct.blue
                }
                if(equip.LuckyLv>0){
                    msg+='+幸运'
                    color=ct.blue
                }
                if(equip.QhLv>=7){
                    color=ct.yellow
                }
                if(equip.ZyList.length>0){
                    msg = `卓越的 ${msg}`
                    color=ct.green
                }
                if(equip.TzLv>0){
                    msg = `[套装]卓越的 ${msg}`
                    color=ct.red
                }
            }
            if(needReturnBoxMsg){
                return new BoxMsg(msg,color)
            }else{
                UIMgr.I.showProsMsg(msg,color,true)
                playSound&&GameManager.I.playTipSound('getItem')
                return null
            }
        }
    }
    static renderChatListCell(rsp:outer_pb.ChatMsg,text:RichText){
        text.maxWidth = text.node.parent.getComponent(UITransform).width
        let color = ChatChannelColors[rsp.Chanel]
        text.fontColor.fromHEX(color);
        let chanel=ChatChannelNames[rsp.Chanel]
        let name=''
        if(rsp.Chanel>0){
            if(rsp.Chanel==7){
                //跨服聊天
                name = `<color=${ct.me}>S${rsp.FromSid}-${rsp.Name}</>`
            }else if(rsp.Chanel==8){
                if(rsp.Name==GD.role.data.Name){
                    name = `我 对 <u><color=${ct.other} click="onClick" param="n|${rsp.OtherId}|${rsp.OtherName}">${rsp.OtherName}</></u>`
                }else{
                    name = `<u><color=${ct.other} click="onClick" param="n|${rsp.Id}|${rsp.Name}">${rsp.Name}</></u> 对 我`
                }
            }else{
                if(rsp.Name==GD.role.data.Name){
                    name = `<color=${ct.me}>${rsp.Name}</>`
                }else{
                    name = `<u><color=${ct.other} click="onClick" param="n|${rsp.Id}|${rsp.Name}">${rsp.Name}</></u>`
                }
            }
        }
        let msg = rsp.msg;
        if(rsp.Position){
            // let pos = `${rsp.Position.RoomId},${rsp.Position.LineId},${rsp.Position.I},${rsp.Position.J}`
            let name = this.getMapName(rsp.Position,false)
            let color = ct.blue
            const lineId = rsp.Position.LineId;
            if(lineId=='1'){
                color=ct.blue
            }else if(lineId=='99'){
                color=ct.purple
                name='[专属线路]'
            }else{
                color=ct.yellow
            }
            msg = msg.replace('{p}',`<u><color=${color}  click="onClick" param="p">${name}</></u>`)
        }
        if(rsp.MonsterId>0){
            let base = GD.monsterBaseDatas.get(rsp.MonsterId)
            msg = msg.replace('{m}',`<color=${rsp.MonsterType==1?ct.yellow:ct.red}>[${BossNamePre[rsp.MonsterType]}${base.Name}]</>`)
        }
        if(rsp.Id>0){
            if(rsp.Name==GD.role.data.Name){
                msg = msg.replace('{n}',`<color=${ct.me}>[${rsp.Name}]</>`)
            }else{
                msg = msg.replace('{n}',`<u><color=${ct.white} click="onClick" param="n|${rsp.Id}|${rsp.Name}">[${rsp.Name}]</></u>`)
            }
        }
        if(rsp.Items.length>0){
            let arr = []
            rsp.Items.forEach(item=>{
                let name:string;
                let base:any;
                let color = ct.white;
                if(item.ItemType==1){
                    //装备
                    item.Uid=item.EquipData.Uid;
                    base = GD.EquipBaseDatas.get(item.EquipData.Id)
                }else{
                    //道具
                    base = GD.ItemBaseDatas.get(item.ItemId)
                    color=ct.yellow
                }
                if(base){
                    name=base.Name;
                    if(item.ItemType==1){
                        let equip = item.EquipData
                        if(equip.QhLv>0){
                            name+=`+${equip.QhLv}`
                        }
                        if(equip.ZjLv>0){
                            color=ct.blue
                            name+='+属性'
                        }
                        if(equip.LuckyLv>0){
                            color=ct.blue
                            name+='+幸运'
                        }
                        if(equip.ZyList.length>0){
                            color=ct.green
                        }
                    }else{
                        name += 'x'+item.ItemNum
                    }
                    name = `<u><color=${color}  click="onClick" param="i${item.Uid}">[${name}]</></u> `
                    arr.push(name)
                }
            })
            let index = 0;
            msg = msg.replace(/{i}/g, () => {  
                return index < arr.length ? arr[index++] : '{i}'; // 替换并增加索引  
            })
        }
        const date = new Date(rsp.Time as number * 1000); // 将秒转换为毫秒
        let hour = date.getHours();
        let min = date.getMinutes();
        let t =`<color=${ct.light_gray}>${hour<10?'0'+hour:hour}:${min<10?'0'+min:min}</>`;
        msg = `${chanel}${name}：${msg} ${t}`
        text.string=msg;
    }
    static renderMailRich(rich:RichText,mail:Mail){
        const date = new Date(mail.mail.Time as number * 1000); // 将秒转换为毫秒
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDate();
        let hour = date.getHours();
        let min = date.getMinutes();
        rich.string =`<color=${ct.brown}>${year}年${month}月${day}日${hour<10?'0'+hour:hour}:${min<10?'0'+min:min}</> ${mail.mail.Msg}`;
    }
    static showSkill(skill:Skill,richText:RichText){
        let n = skill.LearnNeed.length
        let needStrs:string='';
        if(n>0){
            for(let i=0;i<n;i++){
                let obj:any = {}
                let need = skill.LearnNeed[i]
                let needType = need[0]
                let needNum = need[1]
                switch(needType){
                    case NeedType.ZL:
                        obj.info = `需要：智力${needNum}点`
                        obj.color = GD.role.basePros.AllZL>=needNum ? ct.green : ct.red;
                        break;
                    case NeedType.Lv:
                        obj.color = GD.role.hasEnoughLv(needNum,false) ? ct.green : ct.red;
                        obj.info = `需要：角色等级${needNum}级`
                        break;
                    case NeedType.LL:
                        obj.info = `需要：力量${needNum}点`
                        obj.color = GD.role.basePros.AllLL>=needNum ? ct.green : ct.red;
                        break;
                    case NeedType.MJ:
                        obj.info = `需要：敏捷${needNum}点`
                        obj.color = GD.role.basePros.AllMJ>=needNum ? ct.green : ct.red;
                        break;
                    case NeedType.TL:
                        obj.info = `需要：体力${needNum}点`
                        obj.color = GD.role.basePros.AllTL>=needNum ? ct.green : ct.red;
                        break;
                    case NeedType.TS:
                        obj.info = `需要：统帅${needNum}点`
                        obj.color = GD.role.basePros.AllTS>=needNum ? ct.green : ct.red;
                        break;
                    case NeedType.RoleTypeLv:
                        let t = Math.log2(GD.role.data.RoleType)
                        obj.info = `需要职业：${RoleTypeLvStr[t][needNum]}`
                        obj.color = GD.role.basePros.RoleTypeLv>=needNum ? ct.green : ct.red;
                        break;
                    case NeedType.Horse:
                        obj.info = `需要装备带[${skill.Name}]技能的炎狼神兽`
                        obj.color = skill.canUse ? ct.green : ct.red;
                        // obj.color = ct.red;
                        // let equip = GD.role.BodyEquips[BodyType.Horse]
                        // if(equip){
                        //     if(skill.Id==67&&equip.Lv>=5){
                        //         obj.color=ct.green
                        //     }else if(skill.Id==68&&equip.Lv>=50){
                        //         obj.color=ct.green
                        //     }
                        // }
                        break;
                    case NeedType.TianShi:
                        obj.info = `需要装备带[${skill.Name}]技能的强化天使`
                        obj.color = skill.canUse ? ct.green : ct.red;
                        break;
                    case NeedType.XunZhang:
                        obj.info = `需要装备带[${skill.Name}]技能的纪念勋章`
                        obj.color = skill.canUse ? ct.green : ct.red;
                        break;
                    case NeedType.Weapon:
                        //TODO 检查装备是否带该技能
                        obj.info = `需要装备带[${skill.Name}]技能的装备`
                        obj.color = skill.canUse ? ct.green : ct.red;
                        // obj.color = ct.red;
                        // let LeftHand = GD.role.BodyEquips[BodyType.LeftHand]
                        // if(LeftHand){
                        //     if(LeftHand.SkillId==skill.Id){
                        //         obj.color = ct.green
                        //     }
                        // }else{
                        //     let RightHand = GD.role.BodyEquips[BodyType.RightHand]
                        //     if(RightHand){
                        //         if(RightHand.SkillId==skill.Id){
                        //             obj.color = ct.green
                        //         }
                        //     }
                        // }
                        break;
                }
                // obj.color = skill.canUse ? ct.green : ct.red;
                needStrs += `<size=24><color=${obj.color}>${obj.info}</></size><br/><br/>`;
            }
        }
        let neednum = 0
        let skill_item:SkillItem = GD.ItemBaseDatas.get(skill.LearnItemId)
        if(skill_item){
            let hasLearn:boolean=GD.role.skills.has(skill.Id);
            if(hasLearn){
                let needItemNum = skill.Lv+1
                if(skill.Lv>=10){
                    needItemNum=10
                }
                neednum = Math.max(skill_item.DropLv, 25)*needItemNum;
                let hasNum = 0;
                let item = GD.role.BagItems.find(item=>{return item.Id==4});
                if(item){
                    hasNum = item.Num;
                }
                let hasNumStr = ''
                if(hasNum<neednum){
                    hasNumStr = ` (${hasNum-neednum})`
                }
                let hasItemNum = 0;
                item = GD.role.BagItems.find(item=>{return item.Id==skill.LearnItemId});
                if(item){
                    hasItemNum = item.Num;
                }
                let hasItemNumStr = ''
                if(hasItemNum<needItemNum){
                    hasItemNumStr = ` (${hasItemNum-needItemNum})`
                }
                needStrs += `<size=24>升级需要：<br/><color=${hasItemNum>=needItemNum?ct.green:ct.red}>${skill_item.Name}x${needItemNum}${hasItemNumStr}</><br/><color=${hasNum>=neednum?ct.green:ct.red}>技能书页x${neednum}${hasNumStr}</></size><br/><br/>`;
            }else{
                let item = GD.role.BagItems.find(item=>{return item.Id==skill.LearnItemId});
                needStrs += `<size=24><color=${item&&item.Num>0?ct.green:ct.red}>学习需要：${skill_item.Name}x1</></size><br/><br/>`;
            }
        }else{
            //普通初始技能、武器技能，不可升级，只能由特殊装备提升
            needStrs += `<size=24><color=${ct.gray}>(无法升级，只能由特殊装备提升)</></size><br/><br/>`;
        }
        richText.string=`<size=26><color=${ct.brown}>${skill.Name}</></size><br/><br/>${needStrs}<br/>`;
    }
    static getEquipRecoverPrice(equip:outer_pb.IEquip):string{
        // let obj = new RecoverPrice()
        let str='回收可得：无'
        let base = GD.EquipBaseDatas.get(equip.Id)
        if(base){
            let canPianNum = ''
            let numStr=''
            let equipType:EquipType = equip.Id/10000>>0;
            // obj.priceStr='回收可得：无'
            if(equipType<EquipType.Wing){
                if(equip.ZyList.length>0&&(equipType==EquipType.Neck||equipType==EquipType.Ring)){
                    let ns='戒指'
                    if(equipType==EquipType.Neck){
                        ns='项链'
                    }
                    numStr=`<color=${ct.blue}>卓越${ns}碎片x1</>`
                }else{
                    let dropLv=base.DropLv;
                    if(dropLv>900)dropLv=90 //玛雅武器、多彩、大天使武器
                    // obj.priceType=1;
                    
                    let rate=1;
                    if(equip.ZyList.length>0){
                        rate=2
                        dropLv +=25
                        numStr=`<color=${ct.blue}>卓越碎片x${dropLv/25>>0}</>`
                    }else{
                        numStr=`<color=${ct.yellow}>金币x${dropLv*(1+(equip.QhLv+equip.LuckyLv)*0.1+equip.ZjLv*0.05)>>0}</>`;
                    }
                    if(equip.IsNpc==false){
                        canPianNum = `<color=${ct.yellow}>装备残片x${((dropLv/25+1)>>0)*rate}</> 或 `
                    }
                }
            }else {
                let n=0
                if (equipType==EquipType.Pet) {
                    n = equip.Exp + 1
                    if (equip.Lv > 0) {
                        for(let i = 1; i <= equip.Lv; i++){
                            n += i * (i + 1)
                        }
                    }
                } else {
                    n = equip.Lv + 1
                }
                let dia=base.Price*n
                if(dia>1){
                    dia=dia/GD.role.data.DiaRate>>0;
                }
                numStr = `<color=${ct.qing}>钻石x${dia}</>`
            }
            str = `回收可得<br/>${canPianNum}${numStr}`
        }
        return str
    }
    static resetInfoFrameHeight(rich:RichText,frame:Node,addH:number=60){
        let height = rich.node.getComponent(UITransform).height
        let scale:Vec3 = rich.node.scale
        if(height>1400){
            scale.x=0.9
            scale.y=0.9
            if(addH==0){
                addH=-120
            }else{
                addH=-50
            }
        }else{
            scale.x=1
            scale.y=1
        }
        rich.node.scale=scale;
        frame.getComponent(UITransform).height = height+addH;
    }
    static getHunShouPros(hun:HunShou,showNum:boolean):string{
        let pro=`<size=26><color=${ct.yellow}>${hun.star}星</><color=${ct.purple}>【魂兽】${hun.data.Name}</></size><br/><br/>`
        let rate = hun.data.BaseNum*Math.pow(2,hun.star-1);
        if(showNum){
            pro +=`<color=${ct.white}>拥有数量：${hun.num}</><br/><br/>`
            pro +=`<color=${ct.gray}>====附体后提升角色属性====</><br/>`
        }
        pro +=`<color=${ct.blue}>防御力+${rate/5>>0}</><br/>`
        pro +=`<color=${ct.blue}>最大生命值+${rate}</><br/>`
        pro +=`<color=${ct.blue}>最大魔法值+${rate}</><br/>`
        pro +=`<color=${ct.purple}>所有元素攻击力+${rate}</><br/>`
        pro +=`<color=${ct.purple}>所有元素防御力+${rate/2>>0}</><br/>`
        pro +=`<color=${ct.qing}>连击伤害+${rate*10>>0}</><br/>`
        pro +=`<color=${ct.qing}>连击命中率+${rate>>0}</><br/>`
        pro +=`<color=${ct.qing}>连击值恢复量+${rate/5>>0}</><br/><br/>`
        return pro
    }
    static showEquip(equip:outer_pb.IEquip,richText:RichText,headLabel:Label,shopItem:ShopItem=null,owner:string=null){
        let equipType:EquipType = equip.Id/10000>>0;
        switch (equipType){
            case EquipType.Head:
            case EquipType.Body:
            case EquipType.Leg:
            case EquipType.Hand:
            case EquipType.Foot:
            case EquipType.Weapon:
            case EquipType.JianTong:
            case EquipType.ZHBook:
            case EquipType.Shield:
                this.showAtkOrDefEquip(equip,false,equipType,richText,headLabel,shopItem,owner)
                break;
            case EquipType.Ring:
            case EquipType.Neck:
                this.showRingNeck(equip,false,equipType,richText,headLabel,shopItem,owner)
                break;
            case EquipType.Pet:
                this.showPet(equip,false,equipType,richText,headLabel,shopItem,owner)
                break;
            case EquipType.XunZhang:
                this.showXunZhang(equip,false,equipType,richText,headLabel,shopItem,owner)
                break;
            case EquipType.Horse:
                this.showHorse(equip,false,equipType,richText,headLabel,shopItem,owner)
                break;
            case EquipType.Em:
                this.showEm(equip,false,equipType,richText,headLabel,shopItem,owner)
                break;
            case EquipType.TianShi:
                this.showTianShi(equip,false,equipType,richText,headLabel,shopItem,owner)
                break;
            case EquipType.Wing:
                this.showWing(equip,false,equipType,richText,headLabel,shopItem,owner)
                break;
        }
    }
    static showWing(equip:outer_pb.IEquip,isTuJian:boolean,equipType:EquipType,richText:RichText,headLabel:Label,shopItem:ShopItem,owner:string=null){
        let base:WingBase = GD.EquipBaseDatas.get(equip.Id)
        let addBaseRate=1
        let reduceNeedLvRate=1
        if(equip.YsList&&equip.YsList.length>0){
            equip.YsList.forEach(v=>{
                const lv=(v/100>>0)-100
                const t=v%100
                const rate = lv*lv/500+0.02 //满10级20%，即0.2
                if(t==23){
                    //需求等级降低
                    reduceNeedLvRate -= rate
                }else if(t==24){
                    //基础属性提升
                    addBaseRate += rate
                }
            })
        }

        let headColor = ct.white
        let head:string=base.Name
        if(equip.QhLv>0){
            head += `+${equip.QhLv}`
        }else{
            equip.QhLv=0
        }
        let zjStr=''
        if(equip.ZjLv>0){
            head += '+属性'
            headColor = ct.blue
            zjStr=`<color=${ct.blue}>追加最大攻击力 +${equip.ZjLv}<br/>`
        }
        let luckStr=''
        if(equip.LuckyLv>0){
            head += '+幸运'
            headColor = ct.blue
            let failedNum=equip.Data[0]
            let ln=''
            if(failedNum){
                ln=`（第${failedNum}次)`
            }
            luckStr = `<color=${ct.blue}>幸运 +${equip.LuckyLv}${ln}<br/>幸运（灵魂宝石之成功率+${equip.LuckyLv*5}%）<br/>幸运（会心一击率+${equip.LuckyLv}%）</><br/>`
        }
        let a=0
        if (equip.QhLv > 9) {
            a = (equip.QhLv % 9) * ((equip.QhLv % 9) + 1) / 2
        }
        let def = `<color=${ct.blue}>防御力+${(base.Def+equip.QhLv*3+a)*addBaseRate>>0}</><br/>`
        let dmgUp = `<color=${ct.blue}>伤害提升+${base.DmgUp+equip.QhLv*2}%</><br/>`
        let reduce = `<color=${ct.blue}>伤害吸收+${base.Reduce+equip.QhLv*2}%</><br/>`

        let zyPros=''
        if(equip.ZyList.length>0){
            zyPros='<br/>'
            equip.ZyList.forEach(t=>{
                let num = ''
                if(t<2){
                    //+生命值、魔法值
                    num=` +${equip.QhLv*5+base.EquipLv*50}`
                }else if(t==2){
                    //+攻击速度
                    num=` +${5+base.EquipLv*2}`
                }
                zyPros+=`<color=${ct.green}>${WingZyPros[t]}${num}</><br/>`
            })
        }
        let needLv = base.NeedLv>=400?base.NeedLv:base.NeedLv+equip.QhLv*4
        needLv = Math.ceil(needLv*reduceNeedLvRate)
        let needLvStr = `<color=${(GD.role.data.Lv+GD.role.data.ZsNum*400)>=needLv?ct.white:ct.red}>需要等级：${needLv}</><br/>`;
        let needRoleTypes:String=''
        if(base.RoleType>0){
            RoleTypeLvStr.forEach((names,index)=>{
                let t = Math.pow(2,index)
                if((t&base.RoleType)>0){
                    needRoleTypes+=`<color=${GD.role.data.RoleType==t&&GD.role.basePros.RoleTypeLv>=base.RoleTypeLv?ct.white:ct.red}>${names[base.RoleTypeLv]} 可用</><br/>`
                }
            })
        }
        let zsAndPvpStr=''
        if(equip.ZsType>ZSType.None){
            zsAndPvpStr = `<color=${ct.yellow}>${Tools.getZsProString(equip.ZsType,equip.ZsLv)}</><br/>`
        }
        if(equip.PvpLv>0){
            zsAndPvpStr += `<color=${ct.purple}>${Tools.getPvPString(base.Id/10000>>0,equip.PvpLv)}</><br/><br/>`
        }else if(equip.ZsType>ZSType.None){
            zsAndPvpStr += '<br/>'
        }
        let name:string=''
        if(headLabel){
            headLabel.string = head
            headLabel.color.fromHEX(headColor)
        }else{
            name=`<size=26><color=${headColor}>${head}</></size><br/><br/>`
        }
        let fmPros=''
        if(equip.YsList&&equip.YsList.length>0){
            fmPros=`<br/><color=${ct.blue}>`
            //复制并排序
            // let list = equip.YsList.slice().sort((a,b)=>{
            //     return a%100-b%100
            // })
            equip.YsList.forEach((v,index)=>{
                const type = v%100
                const lv = (v/100-100)>>0
                let failedNum=equip.Data[index+1]
                let ln=''
                if(failedNum){
                    ln=`（第${failedNum}次)`
                }
                fmPros+=`${FuMoTypeStr[type]}+${Tools.getFuMoProValue(type,lv)}${type>=21?'%':''}${ln}<br/>`
            })
            fmPros+='<br/></>'
        }
        let ownName = owner?`<br/><color=${ct.brown}>出售者：${owner}</>`:'';
        richText.string=`${name}${def}${dmgUp}${reduce}${needLvStr}${fmPros}${needRoleTypes}<br/>${zsAndPvpStr}${luckStr}${zjStr}${zyPros}<br/>${ownName}`;
    }
    static showTianShi(equip:outer_pb.IEquip,isTuJian:boolean,equipType:EquipType,richText:RichText,headLabel:Label,shopItem:ShopItem,owner:string=null){
        let base:PetBase = GD.EquipBaseDatas.get(equip.Id)
        let headColor = ct.purple
        let head:string='[守护] '+base.Name
        const lv=equip.Lv
        if(lv>0){
            head += `+${lv}`
        }
        let info = `<color=${ct.white}>以大爱之心坚守自己得主人，得天使者可得天下</><br/><br/>`
        let exp = `<color=${ct.brown}>等级：${lv}</><br/>`//this.getHorseCanDressLvStr(lv)
        let name:string=''
        if(headLabel){
            headLabel.string = head 
            headLabel.color.fromHEX(headColor)
        }else{
            name=`<size=26><color=${headColor}>${head}</></size><br/><br/>`
        }
        let pros=''
        pros+=`<color=${ct.gray}>====(随等级提升)====</><br/>`
        let rate=1
        if(GD.role.data.IsYkMode){
            rate=2
        }Math.round(lv*0.5/rate*10)/10
        pros+=`<color=${ct.blue}>伤害吸收+${10 + Math.round(lv*0.5/rate*10)/10}%</><br/>`
        pros+=`<color=${ct.blue}>最大生命值+${50 + Math.round(lv*5/rate*10)/10}</><br/>`
        pros+=`<color=${ct.blue}>生命自动恢复+${10 + Math.round(lv*2/rate*10)/10}</><br/><br/>`
        let color = ct.gray
        let color1 = ct.gray
        if(lv>=5){
            color=ct.brown
            color1=ct.white
        }
        pros+=`<color=${color1}>[5级激活]</><br/><color=${color}>生命药水及受到的治疗效果+20%</><br/><br/>`
        color1=color = ct.gray
        if(lv>=10){
            color=ct.brown
            color1=ct.white
        }
        pros+=`<color=${color1}>[10级激活](每级+0.05%)</><br/><color=${color}>完全恢复生命值概率+${5*lv/100}%</><br/><br/>`
        color1=color = ct.gray
        if(lv>=20){
            color=ct.brown
            color1=ct.white
        }
        pros+=`<color=${color1}>[20级激活](每级+0.05%)</><br/><color=${color}>反弹伤害概率+${5*lv/100}%</><br/><br/>`
        color1=color = ct.gray
        if(lv>=50){
            color=ct.brown
            color1=ct.white
        }
        pros+=`<color=${color1}>[50级激活]</><br/><color=${color}>特技【天使降临】</><br/><br/>`
        color1=color = ct.gray
        if(lv>=100){
            color=ct.brown
            color1=ct.white
        }
        pros+=`<color=${color1}>[100级激活]</><br/><color=${color}>特技【天使降临】冷却时间时间减半</><br/>`
        let ownName = owner?`<br/><color=${ct.brown}>出售者：${owner}</>`:''
        richText.string=`${name}${info}${exp}${pros}<br/>${ownName}`;
        // console.log('showPet',equip)
    }
    // static getHorseCanDressLvStr(lv:number):string{
    //     let needZsNum = (lv-1)/10>>0;
    //     let zsColor=ct.blue
    //     if(GD.role.data.ZsNum<needZsNum){
    //         zsColor=ct.red
    //     }
    //     return `<color=${ct.brown}>等级：${lv}</><br/><color=${zsColor}>可穿戴等级：${needZsNum}转0级</><br/><br/>`
    // }
    static showEm(equip:outer_pb.IEquip,isTuJian:boolean,equipType:EquipType,richText:RichText,headLabel:Label,shopItem:ShopItem,owner:string=null){
        let base:PetBase = GD.EquipBaseDatas.get(equip.Id)
        let headColor = ct.purple
        let head:string='[守护] '+base.Name
        const lv=equip.Lv
        if(lv>0){
            head += `+${lv}`
        }
        let info = `<color=${ct.white}>异常贪婪的生物，还会越来越强，且不死不灭</><br/><br/>`
        let exp = `<color=${ct.brown}>等级：${lv}</><br/>`//this.getHorseCanDressLvStr(lv)
        let name:string=''
        if(headLabel){
            headLabel.string = head 
            headLabel.color.fromHEX(headColor)
        }else{
            name=`<size=26><color=${headColor}>${head}</></size><br/><br/>`
        }
        let pros=''
        pros+=`<color=${ct.gray}>====(随等级提升)====</><br/>`
        let rate=1
        if(GD.role.data.IsYkMode){
            rate=2
        }
        pros+=`<color=${ct.purple}>攻击速度+${10+Math.round(lv/rate*10)/10}</><br/>`
        pros+=`<color=${ct.blue}>伤害提升+${10+Math.round(lv/rate*10)/10}%</><br/>`
        pros+=`<color=${ct.blue}>最大攻击力+${30+Math.round(lv*2/rate*10)/10}</><br/><br/>`
        let color = ct.gray
        let color1 = ct.gray
        if(lv>=5){
            color=ct.brown
            color1=ct.white
        }
        pros+=`<color=${color1}>[5级激活]</><br/><color=${color}>杀死怪物恢复生命值+8</><br/><br/>`
        color1 = color = ct.gray
        if(lv>=10){
            color=ct.brown
            color1=ct.white
        }
        pros+=`<color=${color1}>[10级激活]</><br/><color=${color}>杀死怪物恢复魔法值+8</><br/><br/>`
        color1 =color = ct.gray
        if(lv>=20){
            color=ct.brown
            color1=ct.white
        }
        pros+=`<color=${color1}>[20级激活](每级+0.05%)</><br/><color=${color}>三倍伤害概率+${lv*5/100}%（该伤害无法被反伤）</><br/><br/>`
        color1 =color = ct.gray
        if(lv>=50){
            color=ct.brown
            color1=ct.white
        }
        pros+=`<color=${color1}>[50级激活](每级+0.05%)</><br/><color=${color}>目标为普通怪物时，${lv*5/100}%概率直接秒杀</><br/><br/>`
        color1 =color = ct.gray
        if(lv>=100){
            color=ct.brown
            color1=ct.white
        }
        pros+=`<color=${color1}>[100级激活]</><br/><color=${color}>连击伤害提升100%</><br/>`
        let ownName = owner?`<br/><color=${ct.brown}>出售者：${owner}</>`:''
        richText.string=`${name}${info}${exp}${pros}<br/>${ownName}`;
        // console.log('showPet',equip)
    }
    static showHorse(equip:outer_pb.IEquip,isTuJian:boolean,equipType:EquipType,richText:RichText,headLabel:Label,shopItem:ShopItem,owner:string=null){
        let base:PetBase = GD.EquipBaseDatas.get(equip.Id)
        let headColor = ct.yellow
        let head:string='[坐骑] '+base.Name
        const lv=equip.Lv
        if(lv>0){
            head += `+${lv}`
        }
        let name:string=''
        if(headLabel){
            headLabel.string = head 
            headLabel.color.fromHEX(headColor)
        }else{
            name=`<size=26><color=${headColor}>${head}</></size><br/><br/>`
        }
        let info = `<color=${ct.white}>世间罕有的物种，唯有强者才能收服</><br/><br/>`
        let exp = `<color=${ct.brown}>等级：${lv}</><br/>`//this.getHorseCanDressLvStr(lv)
        let pros=''
        
        pros+=`<color=${ct.gray}>====(每10级+1)====</><br/>`
        pros+=`<color=${ct.brown}>所有技能等级+${1+(lv/10>>0)}</><br/><br/>`
        pros+=`<color=${ct.gray}>====(随等级提升)====</><br/>`
        let rate=1
        if(GD.role.data.IsYkMode){
            rate=2
        }
        let addExp=20+lv*2/rate
        pros+=`<color=${ct.brown}>对玩家伤害提升+${10+Math.round((lv/rate*10))/10}%</><br/>`
        pros+=`<color=${ct.brown}>受到玩家伤害减少+${((10+0.6*lv)*10>>0)/10}%</><br/>`
        pros+=`<color=${ct.blue}>杀死怪物获得金币提升+${40+Math.round((lv*5/rate*10))/10}%</><br/>`
        pros+=`<color=${ct.blue}>自动获得泡点经验提升+${addExp}%</><br/>`
        pros+=`<color=${ct.blue}>所有任务奖励经验提升+${addExp}%</><br/>`
        pros+=`<color=${ct.blue}>杀死怪物获得经验提升+${addExp}%</><br/><br/>`
        let color = ct.gray
        let color1 = ct.gray
        if(lv>=5){
            color=ct.brown
            color1=ct.white
        }
        pros+=`<color=${color1}>[5级激活]</><br/><color=${color}>特技【闪电链】</><br/><br/>`
        color1=color = ct.gray
        if(lv>=10){
            color=ct.brown
            color1=ct.white
        }
        pros+=`<color=${color1}>[10级激活](每级+5)</><br/><color=${color}>SD自动恢复量增加+${lv*5}</><br/><br/>`
        color1=color = ct.gray
        if(lv>=20){
            color=ct.brown
            color1=ct.white
        }
        pros+=`<color=${color1}>[20级激活](每级+0.05%)</><br/><color=${color}>无视护盾SD概率+${5*lv/100}%</><br/><br/>`
        color1=color = ct.gray
        if(lv>=50){
            color=ct.brown
            color1=ct.white
        }
        pros+=`<color=${color1}>[50级激活]</><br/><color=${color}>特技【天神之怒】</><br/><br/>`
        color1=color = ct.gray
        if(lv>=100){
            color=ct.brown
            color1=ct.white
        }
        pros+=`<color=${color1}>[100级激活]</><br/><color=${color}>特技【闪电链】、【天神之怒】冷却时间减半</><br/>`
        let ownName = owner?`<br/><color=${ct.brown}>出售者：${owner}</>`:''
        richText.string=`${name}${info}${exp}${pros}<br/>${ownName}`;
    }
    static showXunZhang(equip:outer_pb.IEquip,isTuJian:boolean,equipType:EquipType,richText:RichText,headLabel:Label,shopItem:ShopItem,owner:string=null){
        let base:PetBase = GD.EquipBaseDatas.get(equip.Id)
        let headColor = ct.yellow
        let head:string=base.Name
        const lv = equip.Lv
        if(lv>0){
            head += `+${lv}`
        }
        let info = `<color=${ct.white}>战神陨落时，遗留于世的唯一信物</><br/><br/>`
        let exp = `<color=${ct.brown}>等级：${lv}</><br/>`//this.getHorseCanDressLvStr(lv)
        let name:string=''
        if(headLabel){
            headLabel.string = head 
            headLabel.color.fromHEX(headColor)
        }else{
            name=`<size=26><color=${headColor}>${head}</></size><br/><br/>`
        }
        let pros=''
        const twoDmg=3+0.25*lv
        const wsDmg=1+0.1*lv
        pros+=`<color=${ct.gray}>====随机属性类型(可重置)====</><br/>`
        let n=10
        if(GD.role.data.IsYkMode){
            n=5
        }
        pros+=`<color=${ct.blue}>${PointTypeString[equip.YsList[0]]}+${(n+lv*n)}</><br/>`
        pros+=`<color=${ct.purple}>${YsTypeString[equip.YsList[1]]}元素+${1+lv}</><br/><br/>`

        pros+=`<color=${ct.gray}>====固定属性(随等级提升)====</><br/>`
        pros+=`<color=${ct.brown}>双倍伤害概率+${((twoDmg)*10>>0)/10}%</><br/>`
        pros+=`<color=${ct.red}>无视防御概率+${((wsDmg)*100>>0)/100}%</><br/>`
        pros+=`<color=${ct.purple}>双倍元素伤害概率+${((twoDmg)*10>>0)/10}%</><br/>`
        pros+=`<color=${ct.purple}>无视元素防御概率+${((wsDmg)*10>>0)/10}%</><br/>`
        pros+=`<color=${ct.purple}>受到任意类型的反伤减少+${((5+0.8*lv)*10>>0)/10}%</><br/><br/>`

        let color = ct.gray
        let color1 = ct.gray
        if(lv>=5){
            color=ct.brown
            color1=ct.white
        }
        pros+=`<color=${color1}>[5级激活]</><br/><color=${color}>受到任意反伤时，吸收伤害的10%恢复生命值</><br/><br/>`
        color1 = color = ct.gray
        if(lv>=10){
            color=ct.brown
            color1=ct.white
        }
        pros+=`<color=${color1}>[10级激活]</><br/><color=${color}>特技【战神降临】</><br/><br/>`
        color1=color = ct.gray
        if(lv>=20){
            color=ct.brown
            color1=ct.white
        }
        pros+=`<color=${color1}>[20级激活](每20级+1倍)</><br/><color=${color}>被反伤致死时，${lv/20>>0}倍概率触发完全恢复生命值</><br/><br/>`
        color1=color = ct.gray
        if(lv>=50){
            color=ct.brown
            color1=ct.white
        }
        pros+=`<color=${color1}>[50级激活](每1级+0.2%)</><br/><color=${color}>杀死怪物掉落物品数量翻倍概率+${lv*2/10}%</><br/><br/>`
        color1=color = ct.gray
        if(lv>=100){
            color=ct.brown
            color1=ct.white
        }
        pros+=`<color=${color1}>[100级激活]</><br/><color=${color}>特技【战神降临】冷却时间时间减半</><br/>`
        // let ownName = owner?`<br/><color=${ct.brown}>出售者：${owner}</>`:''
        // richText.string=`${name}${info}${exp}${pros}<br/>${ownName}`;
        richText.string=`${name}${info}${exp}${pros}<br/>`;
        // console.log('showPet',equip)
    }
    static showPet(equip:outer_pb.IEquip,isTuJian:boolean,equipType:EquipType,richText:RichText,headLabel:Label,shopItem:ShopItem,owner:string=null){
        let base:PetBase = GD.EquipBaseDatas.get(equip.Id)
        let headColor = ct.purple
        let head:string='[宠物] '+base.Name
        const lv = equip.Lv
        if(lv>0){
            head += `+${lv}`
        }
        let mainYsType = YsTypeString[equip.YsList[0]]
        let mainYsStr=`<color=${ct.purple}>主元素属性：${mainYsType}</><br/><color=${ct.gray}>(主人攻击时，对敌人附加主元素伤害)</><br/>`
        let fuYsStr =`<color=${ct.purple0}>副元素属性：无</><br/>`
        let ysListStr=mainYsType
        if(equip.YsList.length>1){
            let ysTypes = []
            equip.YsList.slice(1).forEach(type=>{
                ysTypes.push(YsTypeString[type])
            })
            ysListStr = ysTypes.join(' ')
            fuYsStr=`<color=${ct.purple0}>副元素属性：${ysListStr}</><br/>`
            ysListStr = mainYsType+' '+ysListStr;
        }
        fuYsStr += `<color=${ct.gray}>(每个副元素属性可提升10%主元素伤害)</><br/>`
        let exp = `<color=${ct.brown}>等级：${lv}<br/>经验值：${equip.Exp}/${lv<20?(lv+1)*(lv+2):"-"}</><br/><br/>`
        let name:string=''
        if(headLabel){
            headLabel.string = head
            headLabel.color.fromHEX(headColor)
        }else{
            name=`<size=26><color=${headColor}>${head}</></size><br/><br/>`
        }
        let pros = ''
        let addGrowthPer=(1.52+(lv+1)*(lv+2)/25)/100
        let addDef:number=0
        let addHp:number=0
        let addAtk:number=0
        let addYsAtk:number=0
        let addYsDef:number=0
        // let isYingHua=equip.Id==210001
        equip.ZyList.forEach(type=>{
            if(type==4){
                addDef=addGrowthPer
            }else if(type==5){
                addHp=addGrowthPer
            }else if(type==6){
                addAtk=addGrowthPer
            }else if(type==7){
                addYsAtk=addGrowthPer
            }else if(type==8){
                addYsDef=addGrowthPer
            }
        })
        let allGrow=0
        GrowthProNames.forEach((str,i)=>{
            let value = equip.Grow[i];
            let color:ct
            if(value<500){
                color = ct.gray
            }else if(value<2000){
                color = ct.white
            }else if(value<4000){
                color = ct.blue
            }else if(value<6000){
                color = ct.green
            }else if(value<8000){
                color = ct.brown
            }else if(value<9000){
                color = ct.purple
            }else{
                color = ct.red
            }
            let addRate:number=0
            if(i==0){
                addRate=addDef
            }else if(i==1){
                addRate=addHp
            }else if(i==2){
                addRate=addAtk
            }else if(i==3){
                addRate=addYsAtk
            }else if(i==4){
                addRate=addYsDef
            }
            let addStr=''
            let add=value*addRate>>0
            if(add>0){
                addStr = ` (+${add})`
            }
            allGrow+=value+add
            pros+= `${str}：<color=${color}>${value}${addStr}</><br/>`
        })
        let rate=1
        if(GD.role.data.IsYkMode){
            rate=4
        }
        let def=((lv+1)*2*(1+equip.Grow[0]*(1+addDef)/1000)>>0)/rate>>0
        let maxDef = `<color=${ct.blue}>防御力 +${def+10}</><br/>`
        let hp=((lv+1)*4*(1+equip.Grow[1]*(1+addHp)/1000)>>0)/rate>>0
        let maxHp = `<color=${ct.blue}>最大生命值 +${hp+20}</><br/>`
        let atk=((lv+1)*(1+equip.Grow[2]*(1+addAtk)/500)>>0)/rate>>0
        let maxAtk = `<color=${ct.blue}>最大攻击力 +${atk+20}</><br/>`
        let atk_ys=((lv+1)*8*(1+equip.Grow[3]*(1+addYsAtk)/500)>>0)/rate>>0
        let ysAtk = `<color=${ct.purple}>(${mainYsType})元素攻击力 +${atk_ys+50}</><br/>`
        let def_ys=((lv+1)*8*(1+equip.Grow[4]*(1+addYsDef)/1000)>>0)/rate>>0
        let ysDef = `<color=${ct.purple}>(${ysListStr})元素防御力 +${def_ys}</><br/>`
        let ljAtk = `<color=${ct.qing}>连击伤害 +(${(allGrow/10>>0)} +${lv*lv*20})</><br/>`
        let addLj = `<color=${ct.qing}>连击值恢复量 +(${(allGrow/500>>0)} +${lv*5})</><br/>`
    
        let zyStr=''
        if(equip.ZyList.length>0){
            let cb:(type:number,lv:number)=>string;
            if(equip.Id==210001){
                cb=this.getYingHuaZyStr
            }else{
                cb=this.getNanGuaZyStr
            }
            equip.ZyList.forEach(type=>{
                zyStr += `<color=${ct.green}>${cb(type,lv)}</><br/>`
            })
            zyStr+='<br/>'
        }
        // let info = `<color=${ct.white}>仙子越强，附加给主人的能力越强</><br/><br/>`
        //计算公式：基础值x(1+成长值/1000)x(等级+1)
        let info = `<color=${ct.white}>仙子越强，附加给主人的能力越强<br/>宠物成长值还可提升主人的连击伤害</><br/><br/>`
        let info1 = `<color=${ct.gray}>====(随成长值、宠物等级提升)====</><br/>` //(随成长值、宠物等级提升)
        let info2 = `<color=${ct.gray}>====(卓越属性值随宠物等级提升)====</><br/>`
        let ownName = owner?`<br/><color=${ct.brown}>出售者：${owner}</>`:''
        richText.string=`${name}${info}${exp}${mainYsStr}${fuYsStr}<br/>${pros}<br/>${info1}${maxDef}${maxHp}${maxAtk}${ysAtk}${ysDef}${ljAtk}${addLj}<br/>${info2}${zyStr}${ownName}`;
        // console.log('showPet',equip)
    }
    static getNanGuaZyStr(type:number,lv:number):string{
        const a = (lv+1)*(lv+2)
        switch(type){
            case 0:
                return `伤害减少+${((0.4+a/70)*100>>0)/100}%`; //满20+7%
            case 1:
                return `伤害反射+${((0.4+a/70)*100>>0)/100}%` //满20+7%
            case 2:
                return `最大生命值+${((0.4+a/70)*100>>0)/100}%` //满20+7%
            case 3:
                return `防御成功率+${((0.8+a/35)*100>>0)/100}%` //满20+14%
            case 4:
                return `防御成长值+${((1.52+a/25)*100>>0)/100}%`//满20级+20%
            case 5:
                return `生命成长值+${((1.52+a/25)*100>>0)/100}%`//满20级+20%
            case 6:
                return `攻击成长值+${((1.52+a/25)*100>>0)/100}%`//满20级+20%
            case 7:
                return `元素攻击力成长值+${((1.52+a/25)*100>>0)/100}%`//满20级+20%
            case 8:
                return `元素防御力成长值+${((1.52+a/25)*100>>0)/100}%`//满20级+20%
        }
    }
    static getYingHuaZyStr(type:number,lv:number):string{
        const a = (lv+1)*(lv+2)
        switch(type){
            case 0:
                return `攻击速度+${(1+a/6)>>0}`;//满20级+78
            case 1:
                return `攻击成功率+${((0.8+a/35)*100>>0)/100}%`//满20级+14%
            case 2:
                return `幸运一击概率+${((0.3+a/60)*100>>0)/100}%` //满20级+8%
            case 3:
                return `卓越一击概率+${((0.3+a/60)*100>>0)/100}%` //满20级+8%
            case 4:
                return `防御成长值+${((1.52+a/25)*100>>0)/100}%`//满20级+20%
            case 5:
                return `生命成长值+${((1.52+a/25)*100>>0)/100}%`//满20级+20%
            case 6:
                return `攻击成长值+${((1.52+a/25)*100>>0)/100}%`//满20级+20%
            case 7:
                return `元素攻击力成长值+${((1.52+a/25)*100>>0)/100}%`//满20级+20%
            case 8:
                return `元素防御力成长值+${((1.52+a/25)*100>>0)/100}%`//满20级+20%
        }
    }
    static showRingNeck(equip:outer_pb.IEquip,isTuJian:boolean,equipType:EquipType,richText:RichText,headLabel:Label,shopItem:ShopItem,owner:string=null){
        let base:RingNeckBase = GD.EquipBaseDatas.get(equip.Id)

        let addBaseRate=1
        let reduceNeedLvRate=1
        if(equip.YsList&&equip.YsList.length>0){
            equip.YsList.forEach(v=>{
                const lv=(v/100>>0)-100
                const t=v%100
                const rate = lv*lv/500+0.02 //满10级20%，即0.2
                if(t==23){
                    //需求等级降低
                    reduceNeedLvRate -= rate
                }else if(t==24){
                    //基础属性提升
                    addBaseRate += rate
                }
            })
        }

        let headColor = ct.white
        let head:string=base.Name
        if(equip.QhLv>0){
            head += `+${equip.QhLv}`
        }else{
            equip.QhLv=0
        }
        let zjStr=''
        if(equip.ZjLv>0){
            head += '+属性'
            headColor = ct.blue
            if(equipType==EquipType.Neck){
                zjStr=`<color=${ct.blue}>追加最大攻击力 +${equip.ZjLv}</><br/>`;
            }else{
                zjStr=`<color=${ct.blue}>追加最大生命值 +${equip.ZjLv}</><br/>`
            }
        }
        let luckStr=''
        if(equip.LuckyLv>0){
            head += '+幸运'
            headColor = ct.blue
            let failedNum=equip.Data[0]
            let ln=''
            if(failedNum){
                ln=`（第${failedNum}次)`
            }
            luckStr = `<color=${ct.blue}>幸运 +${equip.LuckyLv}${ln}<br/>幸运（灵魂宝石之成功率+${equip.LuckyLv*5}%）<br/>幸运（会心一击率+${equip.LuckyLv}%）</><br/>`
        }
        let zyStr=''
        if(equip.ZyList.length>0){
            headColor = ct.green
            head = '卓越的 '+head
            equip.ZyList.forEach(type=>{
                zyStr += `<color=${ct.green}>${ZyTypeString[type]}</><br/>`
            })
            zyStr+='<br/>'
        }
        let tzStr:string=''
        let headPre=''
        if(equip.TzLv>0){
            headPre = '[攻击套装] '
            headColor=ct.red
            let tzSet=GD.role.data.TzSet
            if(tzSet.length==0||tzSet.length<=10){
                //索引0~4为防御套装类型，5~9为攻击套装类型，10~13大天防御套，14~17大天攻击套
                GD.role.data.TzSet=[5,7,10,11,12, 0,1,2,7,9, 0,1,2,3, 0,1,2,3];
                tzSet=GD.role.data.TzSet
            }
            tzSet = tzSet.slice(5,10)
            let myMinTzLv:number=GD.role.atkTzLv
            if(myMinTzLv==0)myMinTzLv=1
            tzStr = `本套装等级：${equip.TzLv}级<br/>体力 +${equip.TzTL}<br/><color=${ct.gray}>【攻击套装最低生效等级 Lv.${myMinTzLv}】</><br/>`
            tzSet.forEach((t,index)=>{
                let n = GD.role.atkTzNum-(Math.min(3,index)+2);
                let color = ct.blue
                let taoNum=index+2
                if(taoNum>5)taoNum=5
                let taoNumStr=''
                if(n<0){
                    color=ct.gray
                    taoNumStr=`[${taoNum}件激活] `
                }else if(index>2){
                    color=ct.brown
                }
                tzStr += `<color=${color}>${taoNumStr}${this.getAtkTzProNum(t,myMinTzLv)}</><br/>`
            })
        }
        let dtTzStr=''
        if(equip.DtTzLv>0){
            headColor=ct.yellow
            headPre = '[大天使攻击套装] '
            let myMinTzLv:number=GD.role.atkDtTzLv
            if(myMinTzLv==0)myMinTzLv=1
            dtTzStr = `<br/><color=${ct.purple}>本大天使套装等级：${equip.DtTzLv}级</><br/><color=${ct.gray}>【大天使攻击套装最低生效等级 Lv.${myMinTzLv}】</><br/>`
            let tzSet=GD.role.data.TzSet.slice(14) //大天使攻击套设置
            tzSet.forEach((t,index)=>{
                let n = GD.role.atkDtTzNum-(Math.min(3,index)+2);
                let color = ct.purple
                let taoNum=index+2
                let taoNumStr=''
                if(n<0){
                    color=ct.gray
                    taoNumStr=`[${taoNum}件激活] `
                }
                dtTzStr += `<color=${color}>${taoNumStr}${this.getAtkDtTzProNum(t,myMinTzLv)}</><br/>`
            })
        }
        head = headPre+head
        let numStr:string
        let a=0
        if (equip.QhLv > 9) {
            a = (equip.QhLv % 9) * ((equip.QhLv % 9) + 1) / 2
        }
        const lv = equip.Lv
        if(equip.ZyList.length==0){
            if(equipType==EquipType.Ring){
                let qhNum = equip.QhLv*5+a;
                numStr = `最大生命值：${(10+lv*(lv+1)+qhNum)*addBaseRate>>0}<br/>`
            }else{
                let v = (lv*(lv+1)/2+equip.QhLv*3+a+5)*addBaseRate>>0;
                numStr = `最大攻击力：${v}<br/>`
            }
        }else {
            if(equipType==EquipType.Ring){
                let qhNum = equip.QhLv*5+a;
                numStr = `最大生命值：${(20+lv*(lv+1)*2+qhNum)*addBaseRate>>0}<br/>`
            }else{
                let v = (lv*(lv+1)+equip.QhLv*3+a+10)*addBaseRate>>0;
                numStr = `最大攻击力：${v}<br/>`
            }
        }
        //每级加攻击力：lv*(lv+1) //满10级+110 //2、6、12、20、30、42、56、72、90、110
        //每级加生命值：lv*(lv+1)*2 //满10级+220
        //升级需要个数：(lv+1)*(lv+2)*2 //满10级880
        //卓越：加元素值=1+Lv*(Lv+1)： 0级到10级：  1、3、7、13、21、31、43、57、73、91、111
        //普通：加元素值=1+Lv*(Lv+1)/2： 0级到10级：1、1、3、6、10、15、21、28、36、45、55
        //每点元素提升0.5%对应类型元素、技能伤害
        let ys= 1+lv*(lv+1)
        let addYs = `<color=${ct.purple}>${YsTypeString[base.YsType]}：${equip.ZyList.length>0?ys:(ys/2>>0)+1}</><br/>`
        let lvStr = `<color=${ct.brown}>首饰等级：${lv}<br/>经验值：${equip.Exp}/${lv<10?(lv+1)*(lv+2)*2:'-'}</><br/>`
        let needLv0 = Math.ceil(base.NeedLv*reduceNeedLvRate)
        let needLv = needLv0>0 ? `<color=${(GD.role.data.Lv+GD.role.data.ZsNum*400)>=needLv0?ct.white:ct.red}>需要等级：${needLv0}</><br/><br/>` : '';
        let dropLv = isTuJian ? `<color=${ct.green}>掉落怪物等级：${base.DropLv}</><br/><br/>`:'';
        let zsAndPvpStr=''
        if(equip.ZsType>ZSType.None){
            zsAndPvpStr = `<color=${ct.yellow}>${Tools.getZsProString(equip.ZsType,equip.ZsLv)}</><br/>`
        }
        if(equip.PvpLv>0){
            zsAndPvpStr += `<color=${ct.purple}>${Tools.getPvPString(base.Id/10000>>0,equip.PvpLv)}</><br/><br/>`
        }else if(equip.ZsType>ZSType.None){
            zsAndPvpStr += '<br/>'
        }
        let priceStr:string=shopItem?`<color=${PriceTypeColor[shopItem.PriceType]}>需要：${PriceTypeStr[shopItem.PriceType]}x${shopItem.Price.toLocaleString()}</><br/><br/>`:''
        let name:string=''
        if(headLabel){
            headLabel.string = head
            headLabel.color.fromHEX(headColor)
        }else{
            name=`<size=26><color=${headColor}>${head}</></size><br/><br/>`
        }
        let fmPros=''
        if(equip.YsList&&equip.YsList.length>0){
            fmPros=`<color=${ct.blue}>`
            //复制并排序
            // let list = equip.YsList.slice().sort((a,b)=>{
            //     return a%100-b%100
            // })
            equip.YsList.forEach((v,index)=>{
                const type = v%100
                const lv = (v/100-100)>>0
                let failedNum=equip.Data[index+1]
                let ln=''
                if(failedNum){
                    ln=`（第${failedNum}次)`
                }
                fmPros+=`${FuMoTypeStr[type]}+${Tools.getFuMoProValue(type,lv)}${type>=21?'%':''}${ln}<br/>`
            })
            fmPros+='<br/></>'
        }
        let ownName = owner?`<br/><color=${ct.brown}>出售者：${owner}</>`:''
        richText.string=`${name}<color=${ct.blue}>${numStr}</>${addYs}${lvStr}`+
        `${needLv}${fmPros}${dropLv}${zsAndPvpStr}${luckStr}${zjStr}<br/>${zyStr}${tzStr}${dtTzStr}<br/>${priceStr}${ownName}`;
    }
    static showAtkOrDefEquip(equip:outer_pb.IEquip,isTuJian:boolean,equipType:EquipType,richText:RichText,headLabel:Label,shopItem:ShopItem,owner:string=null){
        // console.log(equip)
        let roleData=GD.role.data
        let base:any = GD.EquipBaseDatas.get(equip.Id)
        let addBaseRate=1
        let reduceNeedLLRate=1
        let reduceNeedMJRate=1
        let reduceNeedLvRate=1
        if(equip.YsList&&equip.YsList.length>0){
            equip.YsList.forEach(v=>{
                const lv=(v/100>>0)-100
                const t=v%100
                const rate = lv*lv/500+0.02 //满10级22%，即0.22
                if(t==23){
                    //需求等级降低
                    reduceNeedLvRate -= rate
                }else if(t==22){
                    //需求敏捷降低
                    reduceNeedMJRate -= rate
                }else if(t==21){
                    //需求力量降低
                    reduceNeedLLRate -= rate
                }else if(t==24){
                    //基础属性提升
                    addBaseRate += rate
                }
            })
        }

        let headColor = ct.white
        let head:string=base.Name
        if(equip.QhLv>0){
            head += `+${equip.QhLv}`
        }else{
            equip.QhLv=0
        }
        let zjStr=''
        if(equip.ZjLv>0){
            head += '+属性'
            headColor = ct.blue
            if(equipType==EquipType.Weapon||equipType==EquipType.JianTong||equipType==EquipType.ZHBook){
                zjStr=`<color=${ct.blue}>追加最大攻击力 +${equip.ZjLv}</>`
                // if(base.MagicAtkUp>0){
                //     if(base.RoleType==RoleType.MJS){
                //         zjStr=`<color=${ct.blue}>追加物理攻击力 +${equip.ZjLv}<br/>追加魔法攻击力 +${equip.ZjLv}</>`
                //     }else{
                //         if(equipType==EquipType.ZHBook){
                //             zjStr=`<color=${ct.blue}>追加诅咒力 +${equip.ZjLv}</>`
                //         }else{
                //             zjStr=`<color=${ct.blue}>追加魔法攻击力 +${equip.ZjLv}</>`
                //         }
                //     }
                // }else{
                //     zjStr=`<color=${ct.blue}>追加物理攻击力 +${equip.ZjLv}</>`
                // }
            }else if(equipType==EquipType.Shield){
                zjStr=`<color=${ct.blue}>追加防御成功率 +${equip.ZjLv}</>`
            }else{
                zjStr=`<color=${ct.blue}>追加防御力 +${equip.ZjLv}</>`
            }
            zjStr+='<br/>'
        }
        let luckStr=''
        if(equip.LuckyLv>0){
            head += '+幸运'
            headColor = ct.blue
            let failedNum=equip.Data[0]
            let ln=''
            if(failedNum){
                ln=`（第${failedNum}次)`
            }
            luckStr = `<color=${ct.blue}>幸运 +${equip.LuckyLv}${ln}<br/>幸运（灵魂宝石之成功率+${equip.LuckyLv*5}%）<br/>幸运（会心一击率+${equip.LuckyLv}%）</><br/>`
        }
        let needLL=0
        let needMJ=0
        let zyStr=''
        if(equip.ZyList.length>0){
            headColor = ct.green
            head = '卓越的 '+head
            needLL = Math.ceil((base.ZyNeedLL+equip.QhLv*base.LLStep)*reduceNeedLLRate)
            needMJ = Math.ceil((base.ZyNeedMJ+equip.QhLv*base.MJStep)*reduceNeedMJRate)
            equip.ZyList.forEach(type=>{
                zyStr += `<color=${ct.green}>${ZyTypeString[type]}</><br/>`
            })
            zyStr+='<br/>'
        }else{
            needLL = Math.ceil((base.NeedLL+equip.QhLv*base.LLStep)*reduceNeedLLRate)
            needMJ = Math.ceil((base.NeedMJ+equip.QhLv*base.MJStep)*reduceNeedMJRate)
        }
        let tzStr:string=''
        let headPre=''
        let headType=''
        if(equip.TzLv>0){
            headColor=ct.red
            let tzSet=roleData.TzSet
            if(tzSet.length==0||tzSet.length<=10){
                //索引0~4为防御套装类型，5~9为攻击套装类型，10~13大天防御套，14~17大天攻击套
                roleData.TzSet=[5,7,9,10,12, 0,1,2,7,9, 0,1,2,3, 0,1,2,3];
                tzSet=roleData.TzSet
            }
            let myMinTzLv:number;
            let cb:(t:number,lv:number)=>string
            let tzNum:number;
            if(equipType<=EquipType.Foot){
                //防御套
                headType = '防御'
                tzSet = tzSet.slice(0,5)
                myMinTzLv=GD.role.defTzLv
                cb=this.getDefTzProNum
                tzNum=GD.role.defTzNum
            }else{
                //攻击套
                headType = '攻击'
                tzSet = tzSet.slice(5,10)
                myMinTzLv=GD.role.atkTzLv
                cb=this.getAtkTzProNum
                tzNum=GD.role.atkTzNum
            }
            headPre = `[${headType}套装] `
            if(myMinTzLv==0)myMinTzLv=1
            tzStr = `本套装等级：${equip.TzLv}级<br/>体力+${equip.TzTL}<br/><color=${ct.gray}>【${headType}套装生效等级 Lv.${myMinTzLv}】</><br/>`
            tzSet.forEach((t,index)=>{
                let n = tzNum-(Math.min(3,index)+2);
                let color = ct.blue
                let taoNum=index+2
                if(taoNum>5)taoNum=5
                let taoNumStr=''
                if(n<0){
                    color=ct.gray
                    taoNumStr=`[${taoNum}件激活] `
                }else if(index>2){
                    color=ct.brown
                }
                tzStr += `<color=${color}>${taoNumStr}${cb(t,myMinTzLv)}</><br/>`
            })
        }
        let dtTzStr=''
        if(equip.DtTzLv>0){
            headColor=ct.yellow
            headPre = `[大天使${headType}套装] `
            let myMinTzLv:number;
            let cb:(t:number,lv:number)=>string
            let tzNum:number;
            let tzSet=roleData.TzSet
            if(equipType<=EquipType.Foot){
                //防御套
                tzSet = tzSet.slice(10,14)
                myMinTzLv=GD.role.defDtTzLv
                cb=this.getDefDtTzProNum
                tzNum=GD.role.defDtTzNum
            }else{
                //攻击套
                tzSet = tzSet.slice(14)
                myMinTzLv=GD.role.atkDtTzLv
                cb=this.getAtkDtTzProNum
                tzNum=GD.role.atkDtTzNum
            }
            if(myMinTzLv==0)myMinTzLv=1
            dtTzStr = `<br/><color=${ct.purple}>本大天使套装等级：${equip.DtTzLv}级</><br/><color=${ct.gray}>【大天使${headType}套装生效等级 Lv.${myMinTzLv}】</><br/>`
            tzSet.forEach((t,index)=>{
                let n = tzNum-(Math.min(3,index)+2);
                let color = ct.purple
                let taoNum=index+2
                let taoNumStr=''
                if(n<0){
                    color=ct.gray
                    taoNumStr=`[${taoNum}件激活] `
                }
                dtTzStr += `<color=${color}>${taoNumStr}${cb(t,myMinTzLv)}</><br/>`
            })
        }
        head = headPre+head
        let deltaLL = GD.role.basePros.LL-needLL>=0 ? '': `(${GD.role.basePros.LL-needLL})`
        let deltaMJ = GD.role.basePros.MJ-needMJ>=0 ? '': `(${GD.role.basePros.MJ-needMJ})`
        let needLLStr=''
        if(needLL>0){
            needLLStr = `<color=${GD.role.basePros.LL>=needLL ? ct.white:ct.red}>需要力量：${needLL}${deltaLL}</><br/>`
        }
        let needMjStr=''
        if(needMJ>0){
            needMjStr = `<color=${GD.role.basePros.MJ>=needMJ ? ct.white:ct.red}>需要敏捷：${needMJ}${deltaMJ}</><br/>`
        }
        let numStr:string
        let defRate:string=''
        
        let a=0
        if (equip.QhLv > 9) {
            a = (equip.QhLv % 9) * ((equip.QhLv % 9) + 1) / 2
        }
        let maxQhNum = equip.QhLv*3+a;
        let qhDef = maxQhNum
        if(equipType==EquipType.Shield){
            qhDef = equip.QhLv
        }
        let magicAtkUp=''
        if(equip.ZyList.length==0){
            if(equipType==EquipType.Weapon||equipType==EquipType.JianTong||equipType==EquipType.ZHBook){
                let minAtk = (base.MinAtk+maxQhNum)*addBaseRate>>0;
                let maxAtk = (base.MaxAtk+maxQhNum)*addBaseRate>>0;
                let mjsStr=''
                if(base.HandType==0){
                    if(base.MagicAtkUp>0){
                        if(equipType==EquipType.ZHBook){
                            numStr = '【单手】诅咒力：'
                        }else{
                            if(base.RoleType==RoleType.SDS){
                                numStr = '【单手】物理攻击力：'
                            }else{
                                numStr = '【单手】魔法攻击力：'
                            }
                        }
                        if(base.RoleType==RoleType.MJS){
                            mjsStr = `【单手】物理攻击力：${minAtk}~${maxAtk}<br/>`
                        }
                    }else{
                        numStr = '【单手】物理攻击力：'
                    }
                }else{
                    if(base.MagicAtkUp>0){
                        numStr = '【双手】魔法攻击力：'
                        if(base.RoleType==RoleType.MJS){
                            mjsStr = `【双手】物理攻击力：${minAtk}~${maxAtk}<br/>`
                        }
                    }else{
                        numStr = '【双手】物理攻击力：'
                    }
                }
                numStr = `${mjsStr}${numStr}${minAtk}~${maxAtk}<br/>`
                if(base.MagicAtkUp>0){
                    let s:string
                    if(equipType==EquipType.ZHBook){
                        s='诅咒技能攻击力提升'
                    }else if(base.RoleType==RoleType.SDS){
                        //圣导师的权杖
                        s='天鹰攻击力提升'
                    }else{
                        s='魔法技能攻击力提升'
                    }
                    magicAtkUp=`<color=${ct.blue}>${s}${(((base.MagicAtkUp+equip.QhLv*3.5+a)*addBaseRate*100)>>0)/100}%</><br/><br/>`
                }
            }else{
                numStr = `防御力：${(base.Def+qhDef)*addBaseRate>>0}<br/>`
                if(equipType==EquipType.Shield){
                    defRate = `防御成功率：${(base.DefRate+maxQhNum)*addBaseRate>>0}<br/>`
                }
            }
        }else {
            if(equipType==EquipType.Weapon||equipType==EquipType.JianTong||equipType==EquipType.ZHBook){
                let mjsStr=''
                let minAtk = (base.MinZyAtk+maxQhNum)*addBaseRate>>0;
                let maxAtk = (base.MaxZyAtk+maxQhNum)*addBaseRate>>0;
                if(base.HandType==0){
                    if(base.ZyMagicAtkUp>0){
                        if(equipType==EquipType.ZHBook){
                            numStr = '【单手】诅咒力：'
                        }else {
                            if(base.RoleType==RoleType.SDS){
                                numStr = '【单手】物理攻击力：'
                            }else{
                                numStr = '【单手】魔法攻击力：'
                            }
                        }
                        if(base.RoleType==RoleType.MJS){
                            mjsStr = `【单手】物理攻击力：${minAtk}~${maxAtk}<br/>`
                        }
                    }else{
                        numStr = '【单手】物理攻击力：'
                    }
                }else{
                    if(base.MagicAtkUp>0){
                        numStr = '【双手】魔法攻击力：'
                        if(base.RoleType==RoleType.MJS){
                            mjsStr = `【双手】物理攻击力：${minAtk}~${maxAtk}<br/>`
                        }
                    }else{
                        numStr = '【双手】物理攻击力：'
                    }
                }
                numStr = `${mjsStr}${numStr}${minAtk}~${maxAtk}<br/>`
                if(base.ZyMagicAtkUp>0){
                    let s:string
                    if(equipType==EquipType.ZHBook){
                        s='诅咒技能攻击力提升'
                    }else if(base.RoleType==RoleType.SDS){
                        //圣导师的权杖
                        s='天鹰攻击力提升'
                    }else{
                        s='魔法技能攻击力提升'
                    }
                    magicAtkUp=`<color=${ct.blue}>${s}${(((base.ZyMagicAtkUp+equip.QhLv*3.5+a)*addBaseRate*100)>>0)/100}%</><br/><br/>`
                }
            }else{
                numStr = `防御力：${(base.ZyDef+qhDef)*addBaseRate>>0}<br/>`
                if(equipType==EquipType.Shield){
                    defRate = `防御成功率：${(base.ZyDefRate+maxQhNum)*addBaseRate>>0}<br/>`
                }
            }
        }
        let needLv0 = Math.ceil(base.NeedLv*reduceNeedLvRate)
        let needLv = needLv0>0 ? `<color=${(roleData.Lv+roleData.ZsNum*400)>=needLv0?ct.white:ct.red}>需要等级：${needLv0}</><br/>` : '';
        let dropLv = isTuJian ? `<color=${ct.green}>掉落怪物等级：${base.DropLv}</><br/>`:'';
        let needRoleTypes:String=''
        if(base.RoleType>0){
            RoleTypeLvStr.forEach((names,index)=>{
                let t = Math.pow(2,index)
                if((t&base.RoleType)>0){
                    needRoleTypes+=`<color=${roleData.RoleType==t&&GD.role.basePros.RoleTypeLv>=base.RoleTypeLv?ct.white:ct.red}>${names[base.RoleTypeLv]} 可用</><br/>`
                }
            })
        }
        let zsAndPvpStr=''
        if(equip.ZsType>ZSType.None){
            zsAndPvpStr = `<color=${ct.yellow}>${Tools.getZsProString(equip.ZsType,equip.ZsLv)}</><br/>`
        }
        if(equip.PvpLv>0){
            zsAndPvpStr += `<color=${ct.purple}>${Tools.getPvPString(base.Id/10000>>0,equip.PvpLv)}</><br/><br/>`
        }else if(equip.ZsType>ZSType.None){
            zsAndPvpStr += '<br/>'
        }
        let speed:string=''
        if(base.AddSpeed>0){
            speed = `<color=${ct.purple}>攻击速度：${base.AddSpeed*addBaseRate>>0}</><br/>`
        }
        let skillStr=''
        if(equip.SkillId>0){
            let lv=0
            if(equip.Data){
                lv = equip.Data[5]||0
            }
            skillStr = `<color=${ct.blue}>${GD.allSkills.get(equip.SkillId).Name} Lv.${lv}（+${GD.role.basePros.AddSkillLv})</><br/><br/>`
        }
        let priceStr:string=shopItem?`<color=${PriceTypeColor[shopItem.PriceType]}>需要：${PriceTypeStr[shopItem.PriceType]}x${shopItem.Price.toLocaleString()}</><br/><br/>`:''
        let name:string=''
        if(headLabel){
            headLabel.string = head
            headLabel.color.fromHEX(headColor)
        }else{
            name=`<size=26><color=${headColor}>${head}</></size><br/><br/>`
        }
        let fmPros=''
        if(equip.YsList&&equip.YsList.length>0){
            fmPros=`<br/><color=${ct.blue}>`
            //复制并排序
            // let list = equip.YsList.slice().sort((a,b)=>{
            //     return a%100-b%100
            // })
            equip.YsList.forEach((v,index)=>{
                const type = v%100
                const lv = (v/100-100)>>0
                let failedNum=equip.Data[index+1]
                let ln=''
                if(failedNum){
                    ln=`（第${failedNum}次)`
                }
                fmPros+=`${FuMoTypeStr[type]}+${Tools.getFuMoProValue(type,lv)}${type>=21?'%':''}${ln}<br/>`
            })
            fmPros+='<br/></>'
        }
        let canZhuanYi = '' //是否能转移，爆竹开出来的装备无法转移强化等级
        if(equip.IsBZ){
            canZhuanYi = `<color=${ct.red}>(该装备为爆竹装备，无法转移强化等级)</><br/>`
        }
        let ownName = owner?`<br/><color=${ct.brown}>出售者：${owner}</>`:''
        richText.string=`${name}${canZhuanYi}<color=${ct.blue}>${numStr}${defRate}</>`+
        `${speed}${needLLStr}${needMjStr}${needLv}${fmPros}${dropLv}`+
        `${needRoleTypes}<br/>${skillStr}${magicAtkUp}${zsAndPvpStr}${luckStr}${zjStr}<br/>${zyStr}${tzStr}${dtTzStr}<br/>${priceStr}${ownName}`;
    }
    // static itemInfoCache:Map<number,string>=new Map()
    static showItem(id:number,num:number,infoText:RichText,headLabel:Label,shopItem:ShopItem=null,owner:string=null){
        let base = GD.ItemBaseDatas.get(id);
        let info:string
        if(id>=1000&&id<2000){
            //技能书
            info = `<color=${ct.white}>可用于激活对应技能</><br/>`
            if(base.DropLv>=46){
                info+=`<color=${ct.gray}>回收可获得：</>技能书页x1<br/>`
            }else{
                info+=`<br/><color=${ct.gray}>回收可得：<color=${ct.yellow}>金币x${base.DropLv*5}</><br/>(黄金月卡有效期内翻倍)</><br/>`
            }
            base.DropWay=`${base.DropLv}级以上怪物掉落`
        }else if(id>=501&&id<=510){
            //黄金宝箱
            const lv = id%500
            const rate = lv/5
            info=`<color=#aaccee>打开后可获得随机1件道具<br/><br/><color=${ct.gray}>20%概率随机宝石(玛雅、祝福、灵魂)<br/>${rate}%概率恶魔精血、天使之泪、炼体神石、仙兽晶核<br/>${80-rate}%概率随机装备(其中20%概率为卓越装备)</><br/>`
        }else{
            if(id==500){
                //爆竹
                info = `<color=#aaccee>${base.Info}</><br/><color=${ct.gray}>18%概率获得大量金币<br/>2%概率获得随机宝石(玛雅、祝福、灵魂)<br/>80%概率获得+3~+9初期装备</><br/>`
            }else {
                if(id>=2000&&id<3000){
                    //副本材料
                    info = FbMaterialInfoStr
                    base.DropWay=`${base.DropLv}级以上怪物掉落`
                }else if(id>=540&&id<570){
                    //血色透明披风
                    info=`<color=#aaccee>凭此披风可进入血色城堡第${id%539}层</><br/>`
                }else if(id>=570&&id<600){
                    //血色透明披风
                    info=`<color=#aaccee>凭此券可进入恶魔广场第${id%569}层</><br/>`
                }else{
                    info =`<color=#aaccee>${base.Info}</><br/>`
                }
                if(id>=711&&id<=765){
                    //荧光宝石
                    info +=`<br/><color=${ct.gray}>(可转换为其它类型，每次转换需要：<color=${ct.qing}>${GD.configs.get(ConfigType.SwitchYgTypeNeedDia)}钻石</>/个)</><br/>`
                }else if(id==614){
                    info +=`<color=${ct.gray}>(10个可合成1个高级进化石，成功率100%)</><br/>`
                }else if(id==608||id==609){
                    info +=`<color=${ct.gray}>(50个可合成1个神鹰火种，成功率100%)</><br/>`
                }else if(id==11||id==12){
                    // info +=PrivateLineKaInfo
                }else if(id==5||id==6){
                    info +=`<color=${ct.gray}>(初始价格30金币，每50级+20金币)<br/>默认恢复20%，每20级额外恢复1%<br/>当恢复量小于30时，按30计算</><br/>`
                }else if(id==47){
                    //残片
                    info +=CanPianRlInfo
                }else if(id==81){
                    //跨服积分商店随机道具
                    info +=KfJfRandomInfo
                }else if(id==21){
                    //保护盾
                    info +=`<br/><color=${ct.gray}>(竞技场内无效)<br/>(主动攻击其它玩家、离开队伍后失效)</><br/>`
                }else if(id==603){
                    info +=`<br/><color=${ct.gray}>追加4成功率：100%<br/>追加8成功率：(40+幸运值)%，失败时有50%概率降级<br/>追加12成功率：(30+幸运值)%，失败时有50%概率降级<br/><br/>追加16成功率：(30+幸运值)%，失败时退回追12<br/>追加20成功率：(20+幸运值)%，失败时退回追12<br/>追加24成功率：(10+幸运值)%，失败时退回追12</><br/>`
                }else if(id==621){
                    info +=`<br/><color=${ct.gray}>幸运3以下成功率：100%<br/>幸运3升4成功率：30%，失败掉回幸运3<br/>幸运4升5成功率：30%，失败掉回幸运3<br/>幸运5升6成功率：20%，失败掉回幸运3<br/><br/>幸运6升7成功率：20%，失败掉回幸运6<br/>幸运7升8成功率：10%，失败掉回幸运6<br/>幸运8升9成功率：10%，失败掉回幸运6<br/></><br/>`
                }else if(id==53){
                    //宝石原矿
                    info +=HoleItemRandomInfo
                }else if(id==75){
                    //宝石碎片
                    info +=TowerItemInfo
                }else if(id==70){
                    //回馈宝箱
                    info +=HuiKuiBoxInfo
                }else if(id==71){
                    //大天使宝箱
                    info +=DaTianShiBox
                }else if(id==72){
                    //神器宝箱
                    info +=ShenQiBox
                }else if(id==88){
                    //城主宝箱
                    info +=ChengZhuBox
                }else if(id>=403&&id<=406){
                    //旧的：回收爆竹装备碎片+6~9
                    info +=`<br/><color=${ct.gray}>回收可得：爆竹装备碎片x${id-401}</><br/>`
                }else if(id>=57&&id<=68){
                    //自选道具
                    let obj:RewordNameObj=this.getRewordsSelectBoxItemNames(id,true)
                    info +=`<color=${obj.color}>${obj.items.join('<br/>')}</>`
                }else if(id>=100&&id<=116){
                    //称号
                    const str = ChengHaoTypes[id-100];
                    info =`<br/><color=${ct.gray}>======称号属性类型======</><br/>${str}<br/>`
                }else if(id==612){
                    info +=`<color=${ct.gray}>(30个可合成1个天钢石，成功率100%)</><br/>`
                }
                let item = GD.HasFjPriceItems.get(id)
                if(item){
                    let num = item.Price2;
                    if(GD.role.data.IsYkMode){
                        num = item.Price1; //较低回收价格
                    }
                    if(item.PriceType==2&&num>1){
                        num = num/GD.role.data.DiaRate>>0
                    }
                    info +=`<br/><color=${ct.gray}>回收可得：<color=${item.PriceType==1?ct.yellow:ct.qing}>${item.PriceType==1?'金币':'钻石'}x${num}</><br/>(黄金月卡有效期内翻倍)</><br/>`
                }
            }
        }
        let dropWay=''
        if(base.DropWay&&base.DropWay!=''){
            dropWay = `<color=${ct.gray}>获取途径：${base.DropWay}</><br/>`
        }
        let priceStr:string=''
        if(shopItem&&shopItem.PriceType){
            let price = shopItem.Price
            if (id == 5 || id == 6) {
                price = this.getHpMpItemPrice()
                shopItem.Price=price
            }
            priceStr=`<br/><color=${PriceTypeColor[shopItem.PriceType]}>需要：${PriceTypeStr[shopItem.PriceType]}x${price.toLocaleString()}</><br/>`
        }
        let ownName = owner?`<br/><color=${ct.brown}>出售者：${owner}</>`:''
        if(headLabel){
            headLabel.string = `${base.Name} x${num}`
            headLabel.color.fromHEX(this.getItemColor(id))
            infoText.string=`<size=24>${info}</size><br/>${dropWay}${priceStr}${ownName}<br/>`;
        }else{
            infoText.string=`<size=26><color=${this.getItemColor(id)}>${base.Name} x${num}</size></><br/><br/>`+
            `<size=24>${info}</size><br/>${dropWay}${priceStr}${ownName}<br/>`;
        }
    }
    //选的卓越属性类型，0表示不需要选，1表示防御卓越属性类型，2表示攻击卓越属性类型，3表示翅膀的卓越属性
    static getRewordsSelectBoxItemNames(id:number,isRichText:boolean):RewordNameObj{
        let itemNames:Array<string>=[]
        let color:ct=ct.green;
        let idLit:Array<number>=[];
        let zyType:number=0;
        if(id==57){
            //自选宠物
            if(isRichText){
                itemNames=[
                    `<br/><u><color=${ct.purple} click="onClick" param="c${210001}">【宠物】樱花仙子(属性随机) </></u><br/><color=${ct.gray}>点击可预览随机属性仙子<br/>（预览的仙子属性并非最终获得属性，领取时的属性随机）</><br/>`,
                    `<u><color=${ct.purple} click="onClick" param="c${210002}">【宠物】南瓜仙子(属性随机) </></u><br/><color=${ct.gray}>点击可预览随机属性仙子<br/>（预览的仙子属性并非最终获得属性，领取时的属性随机）</>`
                ]
            }else{
                itemNames=['【宠物】樱花仙子(属性随机) ','【宠物】南瓜仙子(属性随机)']
            }
            
            color=ct.purple
            idLit=[210001,210002]
        }else if(id==58){
            //自选中级技能
            GD.SkillItemBases.forEach(item=>{
                if(item.DropLv<70&&item.DropLv>=46){
                    itemNames.push(item.Name);
                    idLit.push(item.Id)
                }
            })
            color=ct.purple
        }else if(id==59){
            //自选高级技能
            GD.SkillItemBases.forEach(item=>{
                if(item.DropLv>=70) {
                    itemNames.push(item.Name);
                    idLit.push(item.Id)
                }
            })
            color=ct.purple
        }else if(id==60){
            //自选卓越项链
            GD.RingNeckBase.forEach(item=>{
                if((item.Id/10000>>0) ==EquipType.Neck){
                    let name = `卓越的 ${item.Name}+幸运3追12`
                    if(isRichText){
                        name = `<u><color=${ct.green} click="onClick" param="c${item.Id}">${name}</></u>`
                    }
                    itemNames.push(name);
                    idLit.push(item.Id)
                }
            })
            zyType=2
        }else if(id==61){
            //自选卓越戒指
            GD.RingNeckBase.forEach(item=>{
                if((item.Id/10000>>0) ==EquipType.Ring) {
                    let name = `卓越的 ${item.Name}+幸运3追15`
                    if(isRichText){
                        name = `<u><color=${ct.green} click="onClick" param="c${item.Id}">${name}</></u>`
                    }
                    itemNames.push(name);
                    idLit.push(item.Id)
                }
            })
            zyType=1
        }else if(id==62){
            //自选卓越新手武器
            idLit=[80001,80104,80207]
            idLit.forEach(id=>{
                let item = GD.EquipBaseDatas.get(id)
                let name = `卓越的 ${item.Name}+幸运1追8（回蓝）`
                if(isRichText){
                    name = `<u><color=${ct.green} click="onClick" param="c${id}">${name}</></u>`
                }
                itemNames.push(name);
            })
        }else if(id==63){
            //自选1代翅膀+0追12幸运3
            idLit=[200001,200002,200003,200004]
            idLit.forEach(wingId=>{
                let item = GD.EquipBaseDatas.get(wingId)
                let isZy = 0
                let name = `${item.Name}+0追12幸运3`
                if(isRichText){
                    name = `<u><color=${ct.blue} click="onClick" param="w${wingId}|${isZy}">${name}</></u>`
                }
                itemNames.push(name);
            })
            color=ct.blue
        }else if(id==64){
            //自选卓越1属性1代翅膀+0追12幸运3
            idLit=[200001,200002,200003,200004]
            idLit.forEach(wingId=>{
                let isZy = 1
                let item = GD.EquipBaseDatas.get(wingId)
                let name = `${item.Name}+0追12幸运3`
                if(isRichText){
                    name = `<u><color=${ct.green} click="onClick" param="w${wingId}|${isZy}">${name}</></u>`
                }
                itemNames.push(name);
            })
            zyType=3
        }else if(id==65){
            //自选2代翅膀+0追12幸运3
            idLit=[200101,200102,200103,200104,200105,200106]
            idLit.forEach(wingId=>{
                let isZy = 0
                let item = GD.EquipBaseDatas.get(wingId)
                let name = `${item.Name}+0追12幸运3`
                if(isRichText){
                    name = `<u><color=${ct.blue} click="onClick" param="w${wingId}|${isZy}">${name}</></u>`
                }
                itemNames.push(name);
                // itemNames.push(`${item.Name}+0追12幸运1`);
            })
            color=ct.blue
        }else if(id==66){
            //自选卓越1属性2代翅膀+0追12幸运3
            idLit=[200101,200102,200103,200104,200105,200106]
            idLit.forEach(wingId=>{
                let isZy = 1
                let item = GD.EquipBaseDatas.get(wingId)
                let name = `${item.Name}+0追12幸运3`
                if(isRichText){
                    name = `<u><color=${ct.green} click="onClick" param="w${wingId}|${isZy}">${name}</></u>`
                }
                itemNames.push(name);
                // itemNames.push(`${item.Name}+0追12幸运3`);
            })
            zyType=3
        }else if(id==67){
            //自选3代翅膀+0追12幸运3
            idLit=[200201,200202,200203,200204,200205,200206]
            idLit.forEach(wingId=>{
                let isZy = 0
                let item = GD.EquipBaseDatas.get(wingId)
                let name = `${item.Name}+0追12幸运3`
                if(isRichText){
                    name = `<u><color=${ct.blue} click="onClick" param="w${wingId}|${isZy}">${name}</></u>`
                }
                itemNames.push(name);
            })
            color=ct.blue
        }else if(id==68){
            //自选卓越1属性3代翅膀+0追12幸运3
            idLit=[200201,200202,200203,200204,200205,200206]
            idLit.forEach(wingId=>{
                let isZy = 1
                let item = GD.EquipBaseDatas.get(wingId)
                let name = `${item.Name}+0追12幸运3`
                if(isRichText){
                    name = `<u><color=${ct.green} click="onClick" param="w${wingId}|${isZy}">${name}</></u>`
                }
                itemNames.push(name);
                // itemNames.push(`${item.Name}+0追12幸运3`);
            })
            zyType=3
        }
        return {items: itemNames,color:color,idList:idLit,zyType: zyType}
    }
    static getHpMpItemPrice():number{
        //药水阶梯价格(前提：不能放仓库)：20+lv/50*10
        //0~49：20，50~99：30，100~149：40，150~199：50，200~249：60，250~299：70，300~349：80，350~399：90，400：100
        let lv = GD.role.data.Lv
        if (GD.role.data.ZsNum > 0) {
            lv = 400
        }
        return 20 + (lv/50>>0)*10
    }
    static getNumStr=(num:number):string=>{
        let str:string
        if(num>=10000){
            str = `${(num/10000*10>>0)/10}万`
        }else{
            str = num+''
        }
        return str
    }
    static getYkTimeString(timestamp:number,setColor:boolean=false):string{
        const now = Tools.getBeiJingSecond()//Date.now()/1000>>0
        const delta = timestamp-now;
        if(delta>0){
            if(delta>86400*365*30){
                return `<br/><color=${ct.green}>终身有效</>`
            }else{
                let str:string = Tools.getDayDeltaTimeString(delta);
                if(setColor){
                    return `<br/><color=${ct.green}>${str}后到期</>`
                }else{
                    return str+'后到期'
                }
            }
        }else{
            if(setColor){
                return `<br/><color=${ct.red}>已到期</>`
            }else{
                return '已到期'
            }
        }
    }
    static getDayDeltaTimeString(delta:number):string{
        let str:string = '';
        if(delta>86400){
            str+=`${Math.floor(delta/86400)}天${Math.floor(delta%86400/3600)}小时${Math.floor(delta%86400%3600/60)}分`
        }else if(delta>3600){
            str+=`${Math.floor(delta/3600)}小时${Math.floor(delta%3600/60)}分`
        }else if(delta>60){
            str+=`${Math.floor(delta/60)}分${delta%60}秒`
        }else{
            str+=`${delta}秒`
        }
        return str
    }
    static getFuMoProValue(type:number,lv:number):number{
        if(type<=4){
            return lv
        }else if(type<=20){
            return lv*lv
        }else if(type<=25){
            return lv*lv*2/10+2
        }else if(type==28){
            return lv*lv/100
        }else if(type>=26){
            return lv*lv*2/100
        }
    }
    static getLvStr(data:any):string{
        if(data.Lv>=400){
            return data.ZsNum>0?`${data.ZsNum}转400级(大师${data.DsLv}级)`:`400级(大师${data.DsLv}级)`
        }else{
            let ds = ''
            if(data.DsLv>0){
                ds = `(大师${data.DsLv}级)`
            }
            return data.ZsNum>0?`${data.ZsNum}转${data.Lv}级${ds}`:`${data.Lv}级`
        }
    }
    static getMiniLvStr(data:any):string{
        if(data.Lv>=400){
            return data.ZsNum>0?`${data.ZsNum}转400级`:`400级`
        }else{
            return data.ZsNum>0?`${data.ZsNum}转${data.Lv}级`:`${data.Lv}级`
        }
    }
    static inviteOtherJoinMyTeam(id:number,cb:(id:number)=>void=null){
        let req = outer_pb.TeamAct.create();
        req.Id=id;
        let buff = outer_pb.TeamAct.encode(req).finish();
        WS.send(MT.InviteOtherJoinMyTeam,buff,(d:any)=>{
            let rsp=outer_pb.TeamAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                UIMgr.I.tip('成功发送邀请',ct.green)
            }else if(rsp.ErrCode==Err.ErrCode_RoleIsNotOnline){
                UIMgr.I.tip('对方不在线，且未开启自动同意')
            }else if(rsp.ErrCode==Err.ErrCode_RoleHasAlreadyInTeam){
                UIMgr.I.tip('对方已在队伍中')
            }else if(rsp.ErrCode==Err.ErrCode_TeamNotExsit){
                UIMgr.I.tip('您的队伍已解散')
            }else if(rsp.ErrCode==Err.ErrCode_TeamFull){
                UIMgr.I.tip('您的队伍已满员')
            }else{
                UIMgr.I.tip('对方已有队伍')
            }
            cb&&cb(rsp.Id);
        })
    }
    static tryGetOtherRoleInfo(id:number,type:ShowItemType=ShowItemType.None){
        let req = outer_pb.GetOther.create();
        req.Id=id;
        const needLv=GD.configs.get(ConfigType.ActiveLvKfRankPk);
        req.CanKf=true//GD.role.hasEnoughLv(needLv,false);
        let buff = outer_pb.GetOther.encode(req).finish();
        WS.send(MT.GetOtherRoleInfo,buff,(d:any)=>{
            let rsp=outer_pb.GetOther.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                UIMgr.I.PopView.show(PopViewType.BodyBox,rsp.RoleInfo,false,type)
            }else{
                UIMgr.I.tip(`需要${needLv}级才能查看该玩家信息`)
            }
        })
    }
    static sendUseItemAct(id:number,num:number,needCheck:boolean,isAll:boolean=false){
        if(needCheck){
            let info='<br/>确定？'
            let btns='确定'
            if(isAll&&id==500){
                btns='打开'
                info=`全部打开所有爆竹会自动回收所有得到的装备<br/>返回所有应得的：金币、宝石、爆竹装备碎片<br/><color=${ct.red}>确定一次性打开全部爆竹？</>`
            }
            UIMgr.I.PopView.showMsgBox([new BoxMsg(info,ct.brown)],btns,(pass:string)=>{
                this.doSendUseItemAct(id,num,isAll)
            },'取消')
        }else{
            this.doSendUseItemAct(id,num)
        }
    }
    static doSendUseItemAct(id:number,num:number,isAll:boolean=false){
        let req = outer_pb.UseItemAct.create();
        req.Id=id
        req.Num=num
        req.IsDia=isAll
        let buff = outer_pb.UseItemAct.encode(req).finish();
        WS.send(MT.UseItem,buff)
    }
    static _refreshBodySlotNode(node:Node,equip:outer_pb.IEquip,isMyBody:boolean,can:boolean=true){
        if(isMyBody){
            if(node.children.length>3){
                node.children[3].active=!can;
            }
            node.children[2].active= equip&&equip.IsLock
        }
        let skin = node.children[0].getComponent(Sprite);
        let label = skin.node.parent.children[1].getComponent(Label);
        let labelColor=ct.white
        let frame = node.getComponent(Sprite);
        let path:string=ItemFramePath.Gray;
        if(equip){
            skin.node.children[0].active=false
            Tools.loadSpriteFrame("ui/equip/" + equip.Id,GD.commonBundle).then(sp=>{
                skin.spriteFrame = sp;
            })
            let equipType = equip.Id/10000>>0
            if(equipType >= EquipType.Pet){
                label.string = `Lv.${equip.Lv}`
                path = ItemFramePath.Purple
            }else{
                label.string = `+${equip.QhLv}z${equip.ZjLv}xy${equip.LuckyLv}`;
                if(equip.LuckyLv>0||equip.ZjLv>0){
                    path = ItemFramePath.Blue
                }
                if(equip.QhLv>=7){
                    labelColor=ct.yellow
                }
                if(equip.ZyList.length>0){
                    path = ItemFramePath.Green
                }
                if(equip.TzLv>0){
                    path = ItemFramePath.Red
                }
                if(equip.DtTzLv>0){
                    path = ItemFramePath.Yellow
                }
            }
            label.color.fromHEX(labelColor)
        }else{
            skin.spriteFrame = null;
            skin.node.children[0].active=true
            label.string = ''
        }
        Tools.loadSpriteFrame("muui/" + path,resources).then(sp=>{
            frame.spriteFrame = sp;
        })
    }
    static renderRoleList(parent:Node,state:Node,info:outer_pb.IRoleInfo,chIdLv:Array<number>=null){
        if(info){
            if(state){
                this.setRoleStateString(state.getComponent(Label),info)
            }
            //显示装备UI
            this.get_UI_Role(info,parent,true).then((role:RoleUIControl)=>{
                if(info.BodyEquipIds){
                    for(let type=BodyType.Head;type<BodyType.Pet;type++){
                        let id = info.BodyEquipIds[type]
                        role.updateEquipUI(id,type,info.RoleType)
                    }
                }
                if(chIdLv){
                    role.refreshChengHaoUI()
                }
            });
            // this.getOtherUIBox(info.Name,info.Lv,info.DsLv,info.ZsNum,info.RoleType,parent,chIdLv).then((role:PlayerControl)=>{
            //     for(let type=BodyType.Head;type<BodyType.Pet;type++){
            //         let id = info.BodyEquipIds[type]
            //         role.updateEquipUI(id,type,info.RoleType)
            //     }
            // });
        }
    };
    static setRoleStateString(label:Label,info:outer_pb.IRoleInfo){
        let str = '离线'
        let color=ct.gray;
        if(info.State==2){
            str='在线'
            color=ct.green;
        }else {
            // let delta = (Date.now()/1000>>0)-(info.TgTime as number)
            let delta = Tools.getBeiJingSecond()-(info.TgTime as number)
            if(info.State==1&&delta>0){
                // let seconds = Math.max(0,GD.MaxTgTime-delta);
                const hours = delta/3600>>0; // 计算小时  
                const minutes = (delta%3600)/60>>0; // 计算分钟  
                const s = delta%60; // 计算剩余秒数
                // console.log(info.Name,info.TgTime,delta,GD.configs.MaxTgTime,seconds,hours,minutes,s)
                str=`已托管(${hours<10?'0'+hours:hours}:${minutes<10?'0'+minutes:minutes}:${s<10?'0'+s:s})`
                color=ct.brown;
            }
        }
        label.string =str;
        label.color.fromHEX(color);
    }
    static refreshRoleEquipUI(skin:Sprite,equipId:number,bodyType:BodyType,roleType:RoleType,suffix:string='',qhLv:number=0){
        let qhStep=(equipId/1000>>0) % 10
        if(qhLv==0){
            equipId = equipId-qhStep*1000            
        }else{
            if(qhLv<5){
                qhStep=0
            }else{
                qhStep=((qhLv-5)/2>>0)+1
            }
        }
        let path;
        // let flowEffect = skin.getComponent(FlowEffect);
        if(equipId){
            if((equipId/10000>>0)==EquipType.JianTong){
                equipId=100001 //所有箭筒都显示一样
            }
            path = `ui/body/${equipId}${suffix}`;
        }else{
            //身体部位显示默认外观，其它装备部位显示为空
            if(bodyType<=BodyType.Foot){
                path = `ui/body/${roleType}_${bodyType}${suffix}`
            }
        }
        if(path){
            Tools.loadSpriteFrame(path,GD.commonBundle).then(sp=>{
                skin.spriteFrame = sp;
                let slot=skin.node.getComponent(EquipmentSlot);
                if(slot){
                    slot.setQhLevelEffect(qhStep)
                }
            })
        }else{
            skin.spriteFrame = null
        }
    }
    static checkCanDress(equip:outer_pb.IEquip):BodyType{
        let equipType:EquipType = equip.Id/10000>>0;
        let base:any = GD.EquipBaseDatas.get(equip.Id);
        switch (equipType){
            case EquipType.Head:
            case EquipType.Body:
            case EquipType.Leg:
            case EquipType.Hand:
            case EquipType.Foot:
                base = base as DefEquipBase
                //首先查看是否满足装备条件
                if(this.hasEnoughPro(equip.YsList,base,equip.QhLv,equip.ZyList.length>0,base.NeedLv)){
                    return equipType as number;//防具的EquipType==BodyType（头铠腿手鞋）
                }else{
                    return null
                }
            // case EquipType.Shield:
            //     base = base as DunPaiBase
            //     //首先查看是否满足装备条件
            //     if(this.hasEnoughPro(base,equip.QhLv,equip.ZyList.length>0)){
            //         //改为：即使左手拿双手武器，也能拿盾牌
            //         // let LeftHand = GD.role.BodyEquips[BodyType.LeftHand]
            //         // if(LeftHand){
            //         //     let leftBase = GD.EquipBaseDatas.get(LeftHand.Id)
            //         //     if(leftBase.HandType==1){
            //         //         return null; //如果左手不为空，则当左手为双手武器时，无法装备
            //         //     }
            //         // }
            //         return BodyType.RightHand;
            //     }
            //     break;
            case EquipType.Ring:
                if (this.hasEnoughPro(equip.YsList,base,equip.QhLv,equip.ZyList.length>0,base.NeedLv)){
                    let Left_Ring = GD.role.BodyEquips[BodyType.Left_Ring]
                    if(Left_Ring==null){
                        //左手为空时优先装备左手
                        return BodyType.Left_Ring
                    }else{
                        return BodyType.Right_Ring
                    }
                }else{
                    return null
                }
            case EquipType.Neck:
                if (this.hasEnoughPro(equip.YsList,base,equip.QhLv,equip.ZyList.length>0,base.NeedLv)){
                    return BodyType.Neck;
                }else{
                    return null
                }
            case EquipType.Shield:
            case EquipType.ZHBook:
            // case EquipType.BaoZhu:
            case EquipType.JianTong:
                if(this.hasEnoughPro(equip.YsList,base as AtkEquipBase,equip.QhLv,equip.ZyList.length>0,base.NeedLv)){
                    let leftHand = GD.role.BodyEquips[BodyType.LeftHand]
                    if(leftHand!=null){
                        let leftHand_base:any = GD.EquipBaseDatas.get(leftHand.Id);
                        if(leftHand_base.HandType==1 && equipType==EquipType.Shield){
                            return null; //如果左手为双手，则右手不能装备盾牌
                        }
                    }
                    return BodyType.RightHand;
                }else{
                    return null
                }
            case EquipType.Weapon:
                base = base as AtkEquipBase
                //首先查看是否满足装备条件
                if(this.hasEnoughPro(equip.YsList,base,equip.QhLv,equip.ZyList.length>0,base.NeedLv)){
                    if(base.HandType==0){
                        //单手武器
                        //左手为空时优先装备左手
                        let leftHand = GD.role.BodyEquips[BodyType.LeftHand]
                        if(leftHand==null){
                            //左手为空时优先装备左手
                            return BodyType.LeftHand
                        }else{
                            //左手不为空时
                            let rightHand = GD.role.BodyEquips[BodyType.RightHand];
                            if(rightHand==null){
                                //右手为空时，检查左手是否是双手武器，只有战士1、魔剑士8可在右手装备单手武器（非箭筒、召唤书）
                                if((GD.role.data.RoleType&(1+8))>0){
                                    let leftBase = GD.EquipBaseDatas.get(leftHand.Id);
                                    if(leftBase.HandType==1){
                                        //右手无法装备，替换掉左手
                                        return BodyType.LeftHand
                                    }else{
                                        return BodyType.RightHand;
                                    }
                                }else{
                                    //替换掉左手
                                    return BodyType.LeftHand
                                }
                            }else{
                                //左右手都不为空时，替换掉左手
                                return BodyType.LeftHand
                            }
                        }
                    }else{
                        let rightHand = GD.role.BodyEquips[BodyType.RightHand]
                        if(rightHand){
                            let rightHandEquipType:EquipType = rightHand.Id/10000>>0;
                            if(rightHandEquipType==EquipType.Weapon||rightHandEquipType==EquipType.Shield){
                                return null; //如果右手不为空，则当右手装备武器、盾牌时(非箭筒、召唤书等)，无法装备
                            }
                            // if(base.RoleType==RoleType.GJS && rightHandEquipType==EquipType.Shield){
                            //     return null; //如果右手为盾牌，则左手不能装备弓箭
                            // }
                            /// if(rightHandEquipType!=EquipType.JianTong){
                            //     return null; //如果右手不为空，则当右手不是箭筒时，无法装备
                            // }
                        }
                        //双手武器，只能装备在左手
                        return BodyType.LeftHand
                    }
                }
                break;
            case EquipType.Pet:
                return BodyType.Pet
            case EquipType.XunZhang:
                return BodyType.XunZhang
                // if(GD.role.data.ZsNum>=((equip.Lv-1)/10>>0)){
                //     return BodyType.XunZhang
                // }
            case EquipType.Em:
                return BodyType.Em
                // if(GD.role.data.ZsNum>=((equip.Lv-1)/10>>0)){
                //     return BodyType.Em
                // }
            case EquipType.TianShi:
                return BodyType.TianShi
                // if(GD.role.data.ZsNum>=((equip.Lv-1)/10>>0)){
                //     return BodyType.TianShi
                // }
            case EquipType.Horse:
                return BodyType.Horse
                // if(GD.role.data.ZsNum>=((equip.Lv-1)/10>>0)){
                //     return BodyType.Horse
                // }
            case EquipType.Wing:
                //判断等级
                let needLv = base.NeedLv>=400?base.NeedLv:base.NeedLv+equip.QhLv*4;
                if(this.hasEnoughPro(equip.YsList,base,equip.QhLv,equip.ZyList.length>0,needLv)){
                    return BodyType.Wing
                }
                break;
        }
        return null
    }
    static hasEnoughPro=(ysList:Array<number>,base:any,qhLv:number,isZy:boolean,needLv:number):boolean=>{
        if(ysList&&base){
            if(((!base.RoleType)||((base.RoleType&GD.role.data.RoleType)>0)&&GD.role.basePros.RoleTypeLv>=base.RoleTypeLv)){
                // let addBaseRate=1
                let reduceNeedLLRate=1
                let reduceNeedMJRate=1
                if(ysList.length>0){
                    ysList.forEach(v=>{
                        const lv=(v/100>>0)-100
                        const t=v%100
                        const rate = lv*lv/500+0.02 //满10级22%，即0.22
                        if(t==23){
                            //需求等级降低
                            needLv = needLv*(1-rate)>>0
                        }else if(t==22){
                            //需求敏捷降低
                            reduceNeedMJRate -= rate
                        }else if(t==21){
                            //需求力量降低
                            reduceNeedLLRate -= rate
                        }
                        // else if(t==24){
                        //     //基础属性提升
                        //     addBaseRate += rate
                        // }
                    })
                }
                if((GD.role.data.Lv+GD.role.data.ZsNum*400)>=needLv){
                    const et = base.Id/10000>>0
                    if(et == EquipType.Ring||et==EquipType.Neck||et==EquipType.Wing) return true;
                    if(isZy){
                        if(GD.role.basePros.LL>=(base.ZyNeedLL+qhLv*base.LLStep)*reduceNeedLLRate>>0&& GD.role.basePros.MJ>=(base.ZyNeedMJ+qhLv*base.MJStep)*reduceNeedMJRate>>0){
                            return true
                        }
                    }else if(GD.role.basePros.LL>=(base.NeedLL+qhLv*base.LLStep)*reduceNeedLLRate>>0&& GD.role.basePros.MJ>=(base.NeedMJ+qhLv*base.MJStep)*reduceNeedMJRate>>0){
                        return true
                    }
                }
            }
        }
        return false
    }
    static showDmg=(target:Unit,from:PlayerControl,rsp:any,otherDmg:number,isKilled:boolean)=>{
        const isMonster = target.unitType==UnitType.Monster
        const isMe = from.playerType == PlayerType.Me
        if(isMe){
            GD.curMap.addDmgFont(target,rsp.Dmg,rsp.DmgType,false,isKilled)
            if(rsp.YsDmg){
                GD.curMap.addDmgFont(target,rsp.YsDmg,DmgType.Ys,false,isKilled)
            }
            GD.role.tjDmg+=rsp.Dmg+rsp.YsDmg
            if(isMonster){
                //我对怪物的伤害
                target.beAtked(rsp.Dmg+rsp.YsDmg,0)
            }else{
                //我对别人的伤害
                (target as PlayerControl).changeOtherHp(rsp.CurHp)
                if(rsp.SdDmg){
                    GD.curMap.addDmgFont(target,rsp.SdDmg,DmgType.Sd,false,isKilled);
                    (target as PlayerControl).changeOtherSd(rsp.CurSd)
                }
            }
        }else{
            if(isMonster){
                //别人对怪物的伤害
                if(GD.curMap.isPkModeMap&&from.data){
                    //竞技场显示别人的伤害数字
                    if(rsp.dmg>0||rsp.DmgType==DmgType.Miss){
                        GD.curMap.addDmgFont(target,rsp.Dmg,from.data.TeamId==GD.role.data.TeamId?rsp.DmgType:DmgType.RedWs)
                    }
                    if(rsp.YsDmg>=1) GD.curMap.addDmgFont(target,rsp.YsDmg,DmgType.Ys)
                    if(rsp.SdDmg>=1) GD.curMap.addDmgFont(target,rsp.SdDmg,DmgType.Sd)
                }
                target.beAtked(otherDmg,0)
                isKilled && target.setDeath()
            }else{
                let targetRole = target as PlayerControl
                if(targetRole.playerType==PlayerType.Me){
                    //别人对我的伤害
                    GD.curMap.addDmgFont(GD.player,rsp.Dmg,DmgType.RedWs);
                    if(rsp.YsDmg>=1) GD.curMap.addDmgFont(GD.player,rsp.YsDmg,DmgType.Ys)
                    if(rsp.SdDmg>=1) GD.curMap.addDmgFont(GD.player,rsp.SdDmg,DmgType.Sd)
                    targetRole.beAtked(rsp.CurHp,rsp.CurSd)
                }else{
                    //别人对别人的伤害
                    if(GD.curMap.isPkModeMap&&from.data){
                        //竞技场显示别人的伤害数字
                        if(rsp.dmg>0||rsp.DmgType==DmgType.Miss){
                            GD.curMap.addDmgFont(target,rsp.Dmg,from.data.TeamId==GD.role.data.TeamId?rsp.DmgType:DmgType.RedWs)
                        }
                        if(rsp.YsDmg>=1) GD.curMap.addDmgFont(target,rsp.YsDmg,DmgType.Ys)
                        if(rsp.SdDmg>=1) GD.curMap.addDmgFont(target,rsp.SdDmg,DmgType.Sd)
                    }
                    targetRole.beAtked(rsp.CurHp,rsp.CurSd);
                }
                isKilled && target.setDeath()
            }
        }
        if(isKilled){
            //获取经验
            if(isMonster){
                if(rsp.GetExp>0){
                    GD.role.getExp(rsp.GetExp,rsp.CurExp,false,true)
                }
            }else{
                const role = target as PlayerControl
                if(isMe){
                    UIMgr.I.showProsMsg(`成功击败【${role.data.Name}】`,ct.green)
                }else{
                    if(role.playerType==PlayerType.Me){
                        UIMgr.I.showProsMsg(`您被【${from.data.Name}】击败了`,ct.brown)
                    }
                }
            }
        }
    }
    // static getOtherUIBox(name:string,lv:number,dsLv:number,zsNum:number,roleType:RoleType,parent:Node,ChIdLv:Array<number>=null){
    //     // parent.children.length>1&&parent.children[1].removeFromParent();
    //     let old:PlayerControl;
    //     if(parent.children.length>0){
    //         old = parent.children[0].getComponent(PlayerControl)
    //         if(old.roleType!=roleType){
    //             old.data=null;
    //             // let pool=Pools.otherUIPool.get(old.roleType);
    //             // if(pool==null){
    //             //     pool=[]
    //             //     Pools.otherUIPool.set(old.roleType,pool)
    //             // }
    //             Pools.otherUIPool.push(old.node);
    //             old=null;
    //         }
    //     }
    //     parent.removeAllChildren()

    //     return new Promise(resovle=>{
    //         Tools.getPlayerUI(roleType,parent.layer,old).then((role:PlayerControl)=>{
    //             // role.node.setRotationFromEuler(Vec3.ZERO);
    //             // role.hpBar.node.active=false;
    //             // role.sdBar.node.active=false;
    //             // // role.direction=0;
    //             // role.node.position=new Vec3()
    //             // role.node.layer = parent.layer;
    //             // role.node.children.forEach(node=>{
    //             //     node.layer=parent.layer;
    //             //     node.children.forEach(n=>{
    //             //         n.layer=parent.layer;
    //             //         n.children.forEach(n=>{
    //             //             n.layer=parent.layer;
    //             //         })
    //             //     })
    //             // })
    //             // role.playerType=PlayerType.Other
    //             // role.node.active=true
    //             // role.state = UnitState.Idle;
    //             // role.node.getComponent(MotionStreak).enabled=false;

    //             let namestr = ''
    //             let line='<br/>'
    //             // if(oneLine){
    //             //     line=' '
    //             // } 
    //             role.refreshChengHaoUI(ChIdLv)
    //             if(name){
    //                 namestr=`<outline color=black width=1><size=20><color=${ct.brown}>${this.getLvStr({Lv:lv,ZsNum:zsNum,DsLv:dsLv})}</></></><outline color=black width=2>${line}${name}</>`
    //                 // namestr=`Lv.${lv>500?`${lv/500>>0}转${lv%500}`:`${lv}`} ${name}`;
    //             }
    //             role.nameLabel.string=namestr;
    //             role.playerType=PlayerType.Other;
    //             // role.node.parent=parent
    //             parent.addChild(role.node)
    //             resovle(role)
    //         });
    //     })
    // }
    static renderBagItem(tabIndex:number,item:any,node:Node){
        let info:string
        let infoColor=ct.white
        let path:string=ItemFramePath.Gray;
        let frame = node.getComponent(Sprite);
        let iconId = item.Id
        let itemPath=''
        if(tabIndex==0){
            let equipType = iconId/10000>>0
            if(equipType >= EquipType.Pet){
                info = `Lv.${item.Lv}`
                path = ItemFramePath.Purple
            }else{
                info = `+${item.QhLv}z${item.ZjLv}`;
                if(item.LuckyLv>0){
                    info+=`xy${item.LuckyLv}`
                    path = ItemFramePath.Blue
                }
                if(item.ZjLv>0||item.YsList.length>0){
                    path = ItemFramePath.Blue
                }
                if(item.QhLv>=7){
                    infoColor=ct.yellow
                }
                if(item.ZyList.length>0){
                    path = ItemFramePath.Green
                }
                if(item.TzLv>0){
                    path = ItemFramePath.Red
                }
                if(item.DtTzLv>0){
                    path = ItemFramePath.Yellow
                }
            }
            itemPath='ui/equip/'
        }else{
            info = 'x'+item.Num;
            // path = ItemFramePath.Yellow
            let base = GD.ItemBaseDatas.get(item.Id)
            if(base) iconId = base.IconId
            itemPath='ui/item/'
        }
        Tools.loadSpriteFrame("muui/" + path,resources).then(sp=>{
            frame.spriteFrame = sp;
        })
        let label=node.children[2].getComponent(Label)
        label.string = info;
        label.color.fromHEX(infoColor)
        
        Tools.loadSpriteFrame(itemPath+iconId,GD.commonBundle).then(sp=>{
            node.children[1].getComponent(Sprite).spriteFrame = sp;
        })
    }
    //clickShowType: 0表示不显示，1表示按钮组，2表示直接显示角色信息
    static renderTeamRoles(parent:Node,ownerId:number,menbers:Array<outer_pb.IRoleInfo>,clickShowType:number=1,btnCb:()=>void=null){
        const len = menbers.length;
        parent.children.forEach((node:Node,index:number)=>{
            let isOwnerLabel = node.children[4];
            let defaultPan = node.children[5];
            let state = node.children[3];
            node.off(Node.EventType.TOUCH_END)
            if(index<len){
                defaultPan.active=false;
                state.active=true;
                let role = menbers[index] as outer_pb.RoleInfo;
                isOwnerLabel.active = role.Id==ownerId;
                Tools.renderRoleList(node.children[2],state,role);
                
                if(clickShowType>0){
                    if(clickShowType==1){
                        if(role.Id!=GD.role.data.Id){
                            node.on(Node.EventType.TOUCH_END,()=>{
                                UIMgr.I.PopView.show(1,role)
                            },this);
                        }
                    }else{
                        node.on(Node.EventType.TOUCH_END,()=>{
                            UIMgr.I.PopView.pushInStack(PopViewType.TeamInfoBox);
                            this.tryGetOtherRoleInfo(role.Id,ShowItemType.None)
                        },this);
                    }
                }
            }else{
                node.children[2].removeAllChildren();
                isOwnerLabel.active=state.active=false;
                defaultPan.active=true;
            }
        })
    }
    // static getRoleBagBodyData(cb:()=>void=null){
    //     WS.send(MT.GetBag,GD.EmptyRequestBuff,(d:any)=>{
    //         let rsp=outer_pb.GetBag.decode(d);
    //         console.log('getRoleBagData',rsp)
    //         GD.role.hasGetBagData=true;
    //         GD.role.BagEquips = []
    //         for(let uid in rsp.BagEquips){
    //             GD.role.BagEquips.push(new Equip(rsp.BagEquips[uid],false))
    //         }
    //         GD.role.BagEquips.sort((a:Equip,b:Equip):number=>{return a.data.Id-b.data.Id})
    //         GD.role.BagItems = []
    //         for(let id in rsp.BagItems){
    //             GD.role.BagItems.push(new Item(parseInt(id),rsp.BagItems[id],false))
    //         }
    //         GD.role.BagItems.sort((a:Item,b:Item):number=>{return a.data.Id-b.data.Id})
    //         GD.role.BodyEquips = rsp.BodyEquips;
    //         GD.role.BagSet = rsp.BagSet||outer_pb.BagSet.create();
    //         cb&&cb();
    //     })
    // }
    static getItemLightType(id:number):LightType{
        let type = LightType.none;
        if(id<10000){
            //道具
            if(id==2||id==15){
                type=LightType.qing
            }else if(id==1||id==14){
                type=LightType.yellow
            }else if(id==3){
                type=LightType.yellow
            }else if(id==621){
                type=LightType.blue
            }else if(id==16||(id>=9&&id<=12)){
                type=LightType.purple
            }else{
                let it = GD.ItemBaseDatas.get(id).ItemType
                type = ItemTypeLightType[it]
            }
        }else{
            //装备
            type = LightType.blue;
        }
        return type;
    }
    static getItemColor(id:number):ct{
        let color = ct.white;
        if(id<10000){
            //道具
            if(id==2||id==15){
                color=ct.qing
            }else if(id==1||id==14||id==47){
                color=ct.yellow //金币、残片
            }else if(id==3){
                color=ct.brown
            }else if(id==621){
                color=ct.blue
            }else if(id==16||id==54||id==48||id==74||(id>=9&&id<=12)||(id>=100&&id<=116)||(id>=200&&id<=215)){
                color=ct.purple
            }else{
                let item =GD.ItemBaseDatas.get(id)
                let it = item.ItemType
                if(it==ItemType.SkillItem&&item.DropLv>=46){
                    color=ct.purple
                }else{
                    color = ItemTypeColor[it]
                }
            }
        }else{
            //装备
            color = ct.blue;
        }
        return color;
    }
    static filterBagLit(toggle:Toggle,node:Node,tabIndex:number,typeIndex:number,list:List,showHpMp:boolean=true){
        toggle.isChecked=false;
        toggle.node.children[1].getComponent(Label).string=node.children[1].getComponent(Label).string;
        this.filterBagLit1(tabIndex,typeIndex,list,showHpMp)
    }
    static filterBagLit1(tabIndex:number,typeIndex:number,list:List,showHpMp:boolean=true){
        if(tabIndex==0){
            if(typeIndex==0){
                list.array=GD.role.BagEquips;
            }else{
                list.array = GD.role.BagEquips.filter(equip=>{
                    let itemType = equip.Id/10000>>0;
                    return itemType == typeIndex;
                })
            }
        }else{
            if(typeIndex==0){
                let arr = GD.role.BagItems;
                if(showHpMp==false){
                    arr = arr.filter(item=>{ return item.Id!=5&&item.Id!=6})
                }
                list.array=arr;
            }else{
                list.array = GD.role.BagItems.filter(Item=>{
                    const id = Item.Id
                    if(showHpMp==false&&(id==5||id==6))return false
                    let itemType = GD.ItemBaseDatas.get(id).ItemType;
                    return itemType == typeIndex;
                }).sort((a,b)=>{return a.Id-b.Id});
            }
        }
    }

    static getChengHaoPro(id:number,lv:number):string{
        const percent10 = lv*(lv+10)*5/100;
        const pre = ChengHaoTypes[id-100];
        switch(id){
            case 100:
                return `${pre}+${percent10*10}%`
            case 101:
                return `${pre}+${percent10}%`
            case 102:
                return `${pre}+${percent10*10}%`
            case 103:
                return `${pre}+${percent10}%`
            case 104:
                return `${pre}+${percent10*2}%`
            case 105:
                return `${pre}+${percent10*2}%`
            case 106:
                return `${pre}+${percent10}%`
            case 107:
                return `${pre}+${percent10}%`
            case 108:
                return `${pre}+${percent10}%`
            case 109:
                return `${pre}+${percent10*10}%`
            case 110:
                return `${pre}+${percent10}%`
            case 111:
                return `${pre}+${percent10*2}%`
            case 112:
                return `${pre}+${lv*(lv+10)*2}`
            case 113:
                return `${pre}+${percent10*5}%`
            case 114:
                return `${pre}+${percent10}%`
            case 115:
                return `${pre}+${lv*(lv+10)*3}`
            case 116:
                return `${pre}+${percent10*5}%`
        }
    }
    static getDefTzProNum(type:number,lv:number):string{
        switch(type){
            case 0:
                return `${DefTzTypeString[type]} +${2*lv}`//力量
            case 1:
                return `${DefTzTypeString[type]} +${2*lv}`//敏捷
            case 2:
                return `${DefTzTypeString[type]} +${2*lv}`//体力
            case 3:
                return `${DefTzTypeString[type]} +${2*lv}`//智力
            case 4:
                return `${DefTzTypeString[type]} +${2*lv}`//统帅
            case 5:
                return `${DefTzTypeString[type]} +${20*lv}`//防御力
            case 6:
                return `${DefTzTypeString[type]} +${10*lv}`//最大技能值
            case 7:
                return `${DefTzTypeString[type]} +${40*lv}`//最大生命值
            case 8:
                return `${DefTzTypeString[type]} +${100*lv}`//最大护盾值
            case 9:
                return `${DefTzTypeString[type]} +${15*lv}`//防御成功率
            case 10:
                return `${DefTzTypeString[type]} +${1*lv+2}%`//伤害减少%
            case 11:
                return `${DefTzTypeString[type]} +${5*lv/10+1}%`//伤害反射%
            case 12:
                return `${DefTzTypeString[type]} +${1*lv+2}%`//防御成功率%
            case 13:
                return `${DefTzTypeString[type]} +${2*lv+2}%`//防御力提升%
            case 14:
                return `${DefTzTypeString[type]} +${1*lv+2}%`//最大生命值%
            case 15:
                return `${DefTzTypeString[type]} +${1*lv+2}%`//最大技能值%
            case 16:
                return `${DefTzTypeString[type]} +${3*lv+5}%`//抵抗幸运一击%
            case 17:
                return `${DefTzTypeString[type]} +${2*lv+3}%`//抵抗卓越一击%
            case 18:
                return `${DefTzTypeString[type]} +${1*lv+2}%`//抵抗双倍伤害%
            case 19:
                return `${DefTzTypeString[type]} +${5*lv/10+1}%`//抵抗无视一击%
        }
    }
    static getAtkTzProNum(type:number,lv:number):string{
        switch(type){
            case 0:
                return `${AtkTzTypeString[type]} +${2*lv}`//攻击速度
            case 1:
                return `${AtkTzTypeString[type]} +${10*lv}`//最大攻击力
            case 2:
                return `${AtkTzTypeString[type]} +${5*lv}`//技能攻击力
            case 3:
                return `${AtkTzTypeString[type]} +${10*lv}`//攻击成功率
            case 4:
                return `${AtkTzTypeString[type]} +${20*lv}`//卓越伤害提升
            case 5:
                return `${AtkTzTypeString[type]} +${20*lv}`//幸运伤害提升
            case 6:
                return `${AtkTzTypeString[type]} +${20*lv}`//反射怪物伤害提升
            case 7:
                return `${AtkTzTypeString[type]} +${8*lv/10+3}%`//伤害提升%
            case 8:
                return `${AtkTzTypeString[type]} +${1*lv+3}%`//攻击成功率提升%
            case 9:
                return `${AtkTzTypeString[type]} +${5*lv/10+1}%`//双倍伤害概率%
            case 10:
                return `${AtkTzTypeString[type]} +${lv+2}%`//卓越一击概率%
            case 11:
                return `${AtkTzTypeString[type]} +${5*lv/10}%`//致命一击概率%
            case 12:
                return `${AtkTzTypeString[type]} +${7*lv/10+2}%`//技能攻击力提升%
            case 13:
                return `${AtkTzTypeString[type]} +${2*lv+5}%`//反射伤害提升%
        }
    }
    static getAtkDtTzProNum(type:number,lv:number):string{
        switch(type){
            case 0:
                return `${AtkDtTzTypeString[type]} +${100*lv+500}`//连击命中率
            case 1:
                return `${AtkDtTzTypeString[type]} +${2*lv}%`//中毒伤害提升
            case 2:
                return `${AtkDtTzTypeString[type]} +${2*lv}%`//连击伤害提升
            case 3:
                return `${AtkDtTzTypeString[type]} +${(lv/5>>0)+1}`//所有技能等级
            case 4:
                return `${AtkDtTzTypeString[type]} +${25*lv/100+1}%`//天使一击概率
            case 5:
                return `${AtkDtTzTypeString[type]} +${50*lv}`//所有元素攻击力
            case 6:
                return `${AtkDtTzTypeString[type]} +${lv*10}`//连击值恢复量
            case 7:
                return `${AtkDtTzTypeString[type]} +${25*lv/100+1}%`//无视目标防御力概率
            case 8:
                return `${AtkDtTzTypeString[type]} +${25*lv/100+1}%`//无视目标元素防御力概率
        }
    }
    static getDefDtTzProNum(type:number,lv:number):string{
        switch(type){
            case 0:
                return `${DefDtTzTypeString[type]} +${2*lv/10+1}%`//反弹伤害概率
            case 1:
                return `${DefDtTzTypeString[type]} +${1*lv+5}%`//最终伤害减免
            case 2:
                return `${DefDtTzTypeString[type]} +${(lv/5>>0)+1}`//所有技能等级
            case 3:
                return `${DefDtTzTypeString[type]} +${50*lv}`//所有元素防御力
            case 4:
                return `${DefDtTzTypeString[type]} +${1*lv+5}%`//最终元素伤害减免
            case 5:
                return `${DefDtTzTypeString[type]} +${2*lv}%`//抵抗致命一击概率
            case 6:
                return `${DefDtTzTypeString[type]} +${100*lv+500}`//闪避连击伤害概率
            case 7:
                return `${DefDtTzTypeString[type]} +${lv*2+5}%`//连击值恢复量提升
            case 8:
                return `${DefDtTzTypeString[type]} +${4*lv+5}%`//受到连击伤害减少
        }
    }
    static xqNeedNums = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55]
    static getXqProInfo(ygType:number,proLv:number):string{
        let cur:number
        let next:number
        let info:string=''
        let after:string=''
        let n = this.xqNeedNums[proLv-1]
        let n1 = n
        if(proLv<10){
            n1 = this.xqNeedNums[proLv]
        }
        switch (ygType) {
            case 711:
                //每20等级基础攻击力增加（满10级+2,角色500级+50）
                cur = n*(2/55) //proLv*(proLv+1)/55
                next = n1*(2/55) //(proLv+1)*(proLv+2)/55
                info = '每20等级最大攻击力增加'
                break;
            case 712:
                //攻击速度增加（满10级+21）
                cur = n*(20/55) + 1 //proLv*(proLv+1)/5+1
                next = n1*(20/55) + 1 //(proLv+1)*(proLv+2)/5+1
                info = '攻击速度增加'
                break;
            case 713:
                //最小攻击力（满10级+55）
                cur = n //proLv*(proLv+1) / 2
                next = n1 //(proLv+1)*(proLv+2) / 2
                info = '最小攻击力增加'
                break;
            case 714:
                //最大攻击力（满10级+55）
                cur = n //proLv*(proLv+1) / 2
                next = n1 //(proLv+1)*(proLv+2) / 2
                info = '最大攻击力增加'
                break;
            case 715:
                //攻击力（满10级+55）
                cur = n //proLv*(proLv+1) / 2
                next = n1 //(proLv+1)*(proLv+2) / 2
                info = '攻击力增加'
                break;
            case 716:
                //AG消耗量减少%（满10级+21%）
                cur = n*(20/55) + 1 //proLv*(proLv+1)/5 + 1
                next = n1*(20/55) + 1 //(proLv+1)*(proLv+2)/5 + 1
                info = 'AG消耗量减少'
                after='%'
                break;
            case 721:
                //卓越一击伤害增加（满10级+110）
                cur = n*2 //proLv*(proLv+1)
                next = n1*2 //(proLv+1)*(proLv+2)
                info = '卓越一击伤害增加'
                break;
            case 722:
                //卓越一击伤害概率增加%（满10级+11%）
                cur = n*(10/55) + 1 //proLv * (proLv + 1) /5 + 1
                next = n1*(10/55) + 1 //(proLv + 1) * (proLv + 2) /5 + 1
                info = '卓越一击伤害概率增加'
                after='%'
                break;
            case 723:
                //幸运一击伤害增加（满10级+110）
                cur = n*2 //proLv*(proLv+1)
                next = n1*2 //(proLv+1)*(proLv+2)
                info = '幸运一击伤害增加'
                break;
            case 724:
                //幸运一击伤害概率增加%（满10级+11%）
                cur = n*(10/55) + 1 //proLv * (proLv + 1) / 10+1
                next = n1*(10/55) + 1 //(proLv + 1) * (proLv + 2) / 10+1
                info = '幸运一击伤害概率增加'
                after='%'
                break;
            case 731:
                //技能攻击力增加（满10级+55）
                cur = n //proLv*(proLv+1)/2
                next = n1 //(proLv+1)*(proLv+2)/2
                info = '技能攻击力增加'
                break;
            case 732:
                //攻击成功率增加（满10级+220）
                cur = n*4 //proLv*(proLv+1)*2
                next = n1*4 //(proLv+1)*(proLv+2)*2
                info = '攻击成功率增加'
                break;
            case 733:
                //杀死怪物恢复生命值（满10级+55）
                cur = n //proLv*(proLv+1)/2
                next = n1 //(proLv+1)*(proLv+2)/2
                info = '杀死怪物恢复生命值'
                break;
            case 734:
                //杀死怪物恢复魔法值（满10级+55）
                cur = n //proLv*(proLv+1)/2
                next = n1 //(proLv+1)*(proLv+2)/2
                info = '杀死怪物恢复魔法值'
                break;
            case 741:
                //防御成功率增加（满10级+55）
                cur = n //proLv * (proLv + 1) /2
                next = n1 //(proLv + 1) * (proLv + 2) /2
                info = '防御成功率增加'
                break;
            case 742:
                //防御力增加（满10级+55）
                cur = n //proLv*(proLv+1)/2
                next = n1 //(proLv+1)*(proLv+2)/2
                info = '防御力增加'
                break;
            case 743:
                //伤害减少%（满10级+5%）
                cur = n*(4.5/55) + 0.5 //proLv * (proLv + 1) /20 + 0.5
                next = n1*(4.5/55) + 0.5 //(proLv + 1) * (proLv + 2) /20 + 0.5
                info = '伤害减少'
                after='%'
                break;
            case 744:
                //伤害反射%（满10级+5%）
                cur = n*(4.5/55) + 0.5 //proLv * (proLv + 1) /25 + 0.6
                next = n1*(4.5/55) + 0.5 //(proLv + 1) * (proLv + 2) /25 + 0.6
                info = '伤害反射'
                after='%'
                break;
            case 745:
                //所有属性防御力增加（满10级+55）
                cur = n //proLv*(proLv+1)/2
                next = n1 //(proLv+1)*(proLv+2)/2
                info = '所有元素防御力增加'
                break;
            case 751:
                //生命自动恢复增加（满10级+12）
                cur = n*(11/55) + 1 //proLv*(proLv+1)/10+1
                next = n1*(11/55) + 1 //(proLv+1)*(proLv+2)/10+1
                info = '生命自动恢复增加'
                break;
            case 752:
                //最大生命值（满10级+110）
                cur = n*2 //proLv*(proLv+1)
                next = n1*2 //(proLv+1)*(proLv+2)
                info = '最大生命值增加'
                break;
            case 753:
                //最大魔法值（满10级+110）
                cur = n*2 //proLv*(proLv+1)
                next = n1*2 //(proLv+1)*(proLv+2)
                info = '最大魔法值增加'
                break;
            case 754:
                //魔法自动恢复增加（满10级+12）
                cur = n*(11/55) + 1 //proLv*(proLv+1)/10+1
                next = n1*(11/55) + 1 //(proLv+1)*(proLv+2)/10+1
                info = '魔法自动恢复增加'
                break;
            case 755:
                //最大AG值增加（满10级+55）
                cur = n //proLv*(proLv+1)/2
                next = n1 //(proLv+1)*(proLv+2)/2
                info = '最大AG值增加'
                break;
            case 756:
                //AG恢复量增加（满10级+12）
                cur = n*(11/55) + 1 //proLv*(proLv+1)/10+1
                next = n1*(11/55) + 1 //(proLv+1)*(proLv+2)/10+1
                info = 'AG恢复量增加'
                break;
            case 761:
                //体力增加（满10级+20）
                cur = n*(19/55) + 1 //proLv*(proLv+1)/5+1
                next = n1*(19/55) + 1 //(proLv+1)*(proLv+2)/5+1
                info = '体力增加'
                break;
            case 762:
                //力量增加（满10级+20）
                cur = n*(19/55) + 1 //proLv*(proLv+1)/5+1
                next = n1*(19/55) + 1 //(proLv+1)*(proLv+2)/5+1
                info = '力量增加'
                break;
            case 763:
                //敏捷增加（满10级+20）
                cur = n*(19/55) + 1 //proLv*(proLv+1)/5+1
                next = n1*(19/55) + 1 //(proLv+1)*(proLv+2)/5+1
                info = '敏捷增加'
                break;
            case 764:
                //智力增加（满10级+20）
                cur = n*(19/55) + 1 //proLv*(proLv+1)/5+1
                next = n1*(19/55) + 1 //(proLv+1)*(proLv+2)/5+1
                info = '智力增加'
                break;
            case 765:
                //统帅增加（满10级+20）
                cur = n*(19/55) + 1 //proLv*(proLv+1)/5+1
                next = n1*(19/55) + 1 //(proLv+1)*(proLv+2)/5+1
                info = '统帅增加'
                break;
        }
        let nextStr:string
        if(proLv<10){
            nextStr = `<color=${ct.green}>+${((next-cur)*1000>>0)/1000}${after}</>`
        }else{
            nextStr = `<color=${ct.brown}>已满级</>`
        }
        return `${info} ${(cur*1000>>0)/1000}${after}（${nextStr}）`
    }
}
// 正则表达式：只允许数字、大小写字母和汉字  regex.test(input)
export const ValidNameRegex = /^[0-9a-zA-Z\u4e00-\u9fa5]{2,6}$/;
export const ValidAccontPassRegex = /^[0-9a-zA-Z]{1,20}$/;