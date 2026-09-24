
import { AssetManager, assetManager, JsonAsset, native, Prefab, SpriteFrame, sys } from "cc";
import { ServerInfo, ct, Skill, SkillMode, Buff, AtkEquipBase, ItemBase, DefEquipBase, DunPaiBase, ChatChannelType, RingNeckBase, SkillItem, Npc, ShopItem, MonsterBaseData, QuestData, CircleQuestLvReward, MaterialItem, EquipType, PetBase, WingBase, HcData, HasFjPriceItem, MapData, Door, MapNpc, ChengHao, JfReward, WorldBossKilledObj, FirstReward, SdkUserInfo, PayAmountObj, ItemDropLvObj, BossHunData, RandPkReward, ShiTuReward, FailedAddRate, GemShopItem, HdHcPhReward, SdMyBossNeedPointObj, JiLabelReward } from "./types";
import Tools from "./tools";
import { PlayerControl } from "../battle/PlayerControl";
import { MapControl } from "../battle/MapControl";
import GameManager from "../managers/GameManager";
import { Role } from "./Role";
import { MaterialPool } from "./Pools";

/**GameData */
export default class GD  {
    //热更新配置文件
    static subVersion: number = 140                //热更版本（每次发布新版本后，需要手动写上最新的版本号，用于浏览器提示更新）
    static mainVersion: string = "1.0"           //主版本
    static showVersion: string = this.mainVersion + "." + this.subVersion;  //版本号
    //热更新目录
    static getHotUpdateDir() {
        if(sys.isNative) {
            return native.fileUtils.getWritablePath() + "HotUpdate"
        } else {
            return "/HotUpdate"
        }
    }
    static DISK_HOTUPDATE_PATH = "HotUpdatePath"               //存储热更路径，应该将该路径置为优先级最高的资源搜索路径
    static DISK_HOTUPDATE_VERSION = "HotUpdateVersion"         //存储热更的版本号，方便覆盖安装时候对比本地进行删除操作
        //================
    // static tex_bundle:AssetManager.Bundle;
    static player:PlayerControl;//缓存的玩家自己的对象
    static curMap:MapControl;//缓存的当前地图对象
    // static curRoleName:string;
    // static curSid:string;
    static lastServer:ServerInfo;
    static sdkUserInfo:SdkUserInfo;
    // static account:string='';
    // static pass:string='';
    static gate_address:string
    static token:string
    static role:Role;
    static hcDatas:Array<HcData>=[];
    static npc_list:Map<number,Npc>=new Map();
    static shopItems:Map<number,ShopItem>=new Map();
    static kfShopItems:Map<number,ShopItem>=new Map();
    static zmShopItems:Map<number,ShopItem>=new Map();
    static gemShopItems:Map<number,GemShopItem>=new Map();
    static shopEquips:Map<number,outer_pb.Equip>=new Map();
    static hdHcPhRewards:Array<HdHcPhReward>;
    static hdPayRewardList:Array<JfReward>;
    static hdUsedPointRewards:Array<JfReward>;
    static JiLabelRewards:Array<JiLabelReward>;
    static hdUsedDiaRewards:Array<JfReward>;
    // static hdHcPhRewardsMap:Map<number,number>=new Map();
    static QuestDatas:Map<number,QuestData>=new Map();
    static FailedAddRates:Array<FailedAddRate>;
    static CircleQuestLvRewards:Map<string,Map<string,Array<Array<number>>>>=new Map();
    static JfRewardList:Array<JfReward>;
    static RandPkRewardList:Array<RandPkReward>;
    static ShiTuRewardList:Array<ShiTuReward>;
    static FirstRewardList:Array<FirstReward>;
    static curMapData:any;
    static curLineLv=0;
    static allSkills:Map<number,Skill>=new Map();
    static allBuffs:Map<number,Buff>=new Map();
    static EmptyRequestBuff:Uint8Array;
    static EquipBaseDatas:Map<number,any>=new Map();
    static ItemBaseDatas:Map<number,any>=new Map();
    static SkillItemBases:Array<SkillItem>;
    static RingNeckBase:Array<RingNeckBase>;
    static ItemDropLvObj:Array<ItemDropLvObj>;
    static AtkEquipBase:Array<AtkEquipBase>;
    static DefEquipBase:Array<any>=[];
    static MapList:Map<number,MapData>=new Map();
    static MapNpcList:Array<MapNpc>;
    static HasFjPriceItems:Map<number,HasFjPriceItem>=new Map();
    static chatMsgs:Map<number,Array<outer_pb.IChatMsg>>=new Map();
    static configs:Map<number,number>=new Map();
    static expRate:number=1;//当前登录服务器的经验倍率
    static MaxTgTime:number;//最长托管时间
    static monsterBaseDatas:Map<number,MonsterBaseData>=new Map()
    static bossHunDatas:Map<number,BossHunData>=new Map()
    static BossIdList:Array<number>=[51, 31, 42, 50, 58, 64, 65, 79, 73, 112, 95, 100, 134, 106, 190, 125];
    static WorldBossKillerDatas:Array<WorldBossKilledObj>=[];
    static PayMoneyNums:Array<PayAmountObj>;
    static AmountTypeStrs:Array<string>;
    // static worldMap:Array<outer_pb.IWorldMaps>;//地图数据
    //全局：key0为怪物id，key1为方向，key2为动作类型
    static allAnis:Map<number,Map<number,Map<number,Array<SpriteFrame>>>>=new Map()
    static corlorMap1:Map<number,ct>=new Map()
    static roleTypeStrs:Array<string>=['战','法','弓','魔','圣','召']
    static roleTypeNums:Array<number>=[1,2,4,8,16,32]
    // static lvStr = ['简单','困难','噩梦','地狱','史诗']
    static endPos:Array<number>=[];
    static allChatMsgs:Array<outer_pb.IChatMsg>=[]
    static chatCellY=0;
    static friendList:Array<outer_pb.IFriend>;
    // static NeedRoleTypeStrs:Map<RoleType,Array<string>>=new Map();
    static defaultSkillNeedItem:Map<number,number>=new Map()
    static isJieGuan:boolean=false;
    static isFocusIn:boolean=true;
    static isSwitchRole:boolean=false;
    static ChatChanelNeedLv:Map<number,number>=new Map()
    static SdMyBossNeedPoint:Map<number,number>=new Map()
    static ChatChanelInterval:Map<number,number>=new Map()
    static ChatChanelNextTime:Map<number,number>=new Map()
    static autoFocusOutTime:number=60*10
    static needPlayCdAni:boolean=true;
    static playMoveMotion:boolean=true;
    static commonBundle:AssetManager.Bundle;
    static webBundle:AssetManager.Bundle;
    static monsterPrefab:Prefab;
    static dropItemPrefab:Prefab;
    static dmgLabelPrefab:Prefab;
    static infoMsgPfb:Prefab;//单行的消息提示信息条
    static prosMsgPfb:Prefab;
    static AllMyBossList:{[k: string]: number;};//个人BOSS的配置表（从服务器拉取获得）
    static LineIdLvs:Map<string,number>;
    static sysGG:outer_pb.ISysGG;
    static kfZmBossDropItems=[601, 602, 603, 604, 605, 607, 608, 609, 612, 613, 618, 619, 620, 621, 622, 623, 628];
    static zmBossDropItems:Map<number,Array<number>> = new Map()

    // static dropLvMaps:Map<number,Array<string>>=new Map()
    static buffColors = [ct.white,
        ct.blue,ct.blue,ct.red,ct.red,ct.blue,
        ct.purple,ct.green,ct.qing,ct.qing,ct.blue,
        ct.blue,ct.darkGreen,ct.darkGreen,ct.white,ct.blue,
        ct.green,ct.red,ct.purple,ct.blue,ct.green,
        ct.blue,ct.red,ct.yellow,ct.brown,ct.qing,
        ct.brown,ct.purple,ct.red,ct.red,ct.red,
        ct.red,ct.blue,ct.blue,ct.qing,ct.qing,
        ct.qing,ct.red
    ]

    static playClickSound(){
        GameManager.I.playClickSound()
    }
    static playGetItemSound(){
        GameManager.I.playTipSound('getItem')
    }
    static initGameSet(){
        return new Promise(resolve=>{
            assetManager.loadBundle('common',(err,bundle)=>{
                if(bundle){
                    this.commonBundle=bundle;
                    MaterialPool.initialize().then(v=>{
                        if(v){
                            assetManager.loadBundle('web',(err,webBundle)=>{
                                if(webBundle){
                                    this.webBundle=webBundle;
                                    // console.debug('成功加载commonBundle')
                                    this.loadAssets(bundle);
                                    this.defaultSkillNeedItem.set(1,5)
                                    this.defaultSkillNeedItem.set(2,6)
                                    this.defaultSkillNeedItem.set(3,7)
                                    this.defaultSkillNeedItem.set(4,8)
                                    
                                    this.initColorMap();
                                    this.initZmBossDrops();

                                    this.ChatChanelNeedLv.set(0,99999)
                                    this.ChatChanelNeedLv.set(1,10)
                                    this.ChatChanelNeedLv.set(2,5)
                                    this.ChatChanelNeedLv.set(3,0)
                                    this.ChatChanelNeedLv.set(4,0)
                                    this.ChatChanelNeedLv.set(5,0)
                                    this.ChatChanelNeedLv.set(6,300)
                                    this.ChatChanelNeedLv.set(7,400)
                                    this.ChatChanelNeedLv.set(8,100)

                                    this.ChatChanelInterval.set(0,99999)
                                    this.ChatChanelInterval.set(1,5)
                                    this.ChatChanelInterval.set(2,2)
                                    this.ChatChanelInterval.set(3,2)
                                    this.ChatChanelInterval.set(4,2)
                                    this.ChatChanelInterval.set(5,2)
                                    this.ChatChanelInterval.set(6,5)
                                    this.ChatChanelInterval.set(7,5)
                                    this.ChatChanelInterval.set(8,2)
                                    resolve(1)
                                }else{
                                    console.error('加载webBundle失败')
                                }
                            })
                        }
                    });
                }else{
                    console.error('加载commonBundle失败')
                }
            })
        })
    }
    // static initBuffInfos(){
    //     this.allBuffs.get(1).color=ct.blue
    //     this.allBuffs.get(2).color=ct.blue
    //     this.allBuffs.get(3).color=ct.red
    //     this.allBuffs.get(4).color=ct.red
    //     this.allBuffs.get(5).color=ct.blue
    //     this.allBuffs.get(6).color=ct.purple
    //     this.allBuffs.get(7).color=ct.green
    //     this.allBuffs.get(8).color=ct.qing
    //     this.allBuffs.get(9).color=ct.qing
    //     this.allBuffs.get(10).color=ct.blue
    //     this.allBuffs.get(11).color=ct.blue
    //     this.allBuffs.get(12).color=ct.darkGreen
    //     this.allBuffs.get(13).color=ct.darkGreen 
    //     this.allBuffs.get(14).color=ct.white //樱花花瓣
    //     this.allBuffs.get(15).color=ct.blue //樱花酒
    //     this.allBuffs.get(16).color=ct.green //樱花饼
    //     this.allBuffs.get(17).color=ct.red //南瓜灯的祝福
    //     this.allBuffs.get(18).color=ct.purple //南瓜灯的愤怒
    //     this.allBuffs.get(19).color=ct.blue //南瓜灯的呐喊
    //     this.allBuffs.get(20).color=ct.green //南瓜灯的食物
    //     this.allBuffs.get(21).color=ct.blue //南瓜灯的饮料
    //     this.allBuffs.get(22).color=ct.red //伤害提升50%
    //     this.allBuffs.get(23).color=ct.yellow //无敌
    //     this.allBuffs.get(24).color=ct.brown //免疫反伤
    //     this.allBuffs.get(25).color=ct.qing //圣盾
    //     this.allBuffs.get(26).color=ct.brown //无敌保护
    // }
    static initZmBossDrops(){
        this.zmBossDropItems.set(51,[600, 601, 602])//骷髅王51
        this.zmBossDropItems.set(31,[600, 601, 602])//冰后31
        this.zmBossDropItems.set(42,[600, 601, 602])//魔鬼戈登42
        this.zmBossDropItems.set(50,[600, 601, 602])//魔王巴拉克50
        this.zmBossDropItems.set(58,[600, 601, 602])//海默58
        this.zmBossDropItems.set(64,[600, 601, 602, 603, 604])//魔王札坎64
        this.zmBossDropItems.set(65,[600, 601, 602, 603, 604])//炽焰魔65
        this.zmBossDropItems.set(79,[600, 601, 602, 603, 604])//丛林召唤者79
        this.zmBossDropItems.set(73,[600, 601, 602, 603, 604])//天魔73
        this.zmBossDropItems.set(112,[601, 602, 603, 604, 605, 607])//炼狱魔王112
        this.zmBossDropItems.set(95,[601, 602, 603, 604, 605, 607])//刽子手95
        this.zmBossDropItems.set(100,[601, 602, 603, 604, 605, 607, 608, 609])//咒怨魔王100
        this.zmBossDropItems.set(134,[601, 602, 603, 604, 605, 607, 608, 609])//暗黑指挥官134
        this.zmBossDropItems.set(106,[601, 602, 603, 604, 605, 607, 608, 609, 612])//冰霜巨蛛106
        this.zmBossDropItems.set(190,[601, 602, 603, 604, 605, 607, 608, 609, 612])//昆顿190
        this.zmBossDropItems.set(125,[601, 602, 603, 604, 605, 607, 608, 609, 612, 613, 621])//美杜莎125
        // let a =[
        //     [600, 601, 602],                                         //骷髅王 Lv45
        //     [600, 601, 602],                                         //冰后 Lv52
        //     [600, 601, 602],                                         //魔鬼戈登 Lv55
        //     [600, 601, 602],                                         //魔王巴拉克 Lv67
        //     [600, 601, 602],                                         //海默 Lv74
        //     [600, 601, 602, 603, 604],                               //魔王札坎 Lv90
        //     [600, 601, 602, 603, 604],                               //炽焰魔 Lv93
        //     [600, 601, 602, 603, 604],                               //丛林召唤者 Lv98
        //     [601, 602, 603, 604, 605],                               //天魔 Lv108
        //     [601, 602, 603, 604, 605, 607],                          //炼狱魔王 Lv128
        //     [601, 602, 603, 604, 605, 607],                          //刽子手 Lv129
        //     [601, 602, 603, 604, 605, 607, 608, 609],                //咒怨魔王 Lv135
        //     [601, 602, 603, 604, 605, 607, 608, 609],                //暗黑指挥官 Lv135
        //     [601, 602, 603, 604, 605, 607, 608, 609, 612],           //冰霜巨蛛 Lv145
        //     [601, 602, 603, 604, 605, 607, 608, 609, 612],           //昆顿 Lv147
        //     [601, 602, 603, 604, 605, 607, 608, 609, 612, 613, 621], //美杜莎 Lv175
        // ]
    }
    static initColorMap(){
        this.corlorMap1.set(0,ct.white)//简单
        this.corlorMap1.set(1,ct.blue)//困难
        this.corlorMap1.set(2,ct.green)//噩梦
        this.corlorMap1.set(3,ct.purple)//地狱
        this.corlorMap1.set(4,ct.red)//史诗
    }
    static init(rsp:outer_pb.LoginGateResponse,isRelogin:boolean=false){
        // console.log('init',rsp)
        return new Promise(resolve=>{
            for(let t in rsp.Config){
                const type = parseInt(t)
                this.configs.set(type,rsp.Config[t])
            }
            // console.log('init=',rsp)
            this.allSkills.forEach(skill=>{
                skill.canUse=false
                skill.Lv=0;
            })
            this.isSwitchRole=false;
            this.initPlayer(rsp.RoleData,rsp.BasePros);

            this.role.updateBag(rsp.BagEquips,rsp.BagItems)
            this.role.BodyEquips = rsp.BodyEquips;
            this.role.resetTzPros();
            this.role.BagSet = rsp.BagSet;

            this.isJieGuan = rsp.IsJieGuan;
            if(isRelogin==false){
                // this.worldMap = rsp.WorldMaps.sort((m1,m2)=>{return m1.WorldLv-m2.WorldLv});
                // this.initColorMap();
                // this.initBuffInfos();

                let req = outer_pb.EmptyRequest.create();
                this.EmptyRequestBuff = outer_pb.EmptyRequest.encode(req).finish();
            }
            for(let i=ChatChannelType.System;i<=ChatChannelType.Private;i++){
                this.chatMsgs.set(i,[])
            }
            // if(rsp.WorldMsgBuffs.length>0){
            //     let len = rsp.WorldMsgBuffs.length;
            //     this.lastWorldMsgTime = rsp.WorldMsgBuffs[len-1].Time as number;
            //     rsp.WorldMsgBuffs.forEach(data=>{
            //         this.chatMsgs.get(data.Chanel).push(data)
            //     })
            // }
            resolve("ok");
        })
    }
    static initPlayer(data:outer_pb.IRole_proto,basePros:outer_pb.IBasePros){
        this.role = new Role();
        this.role.data=data;
        this.role.basePros=basePros;
        this.role.caculateAddPro(basePros);
        let len = data.SkillSlots0.length;
        if(data.SkillSlots0[len-1]==0){
            data.SkillSlots0[len-1]=data.NormalAtkSkillId
        }
        if(data.SkillSlots1[len-1]==0){
            data.SkillSlots1[len-1]=data.NormalAtkSkillId
        }
        if(data.SkillSlots2[len-1]==0){
            data.SkillSlots2[len-1]=data.NormalAtkSkillId
        }
        this.role.skillSlots.set(SkillMode.GuaJi, data.SkillSlots0);
        this.role.skillSlots.set(SkillMode.Boss, data.SkillSlots1);
        this.role.skillSlots.set(SkillMode.Pk, data.SkillSlots2);
        //初始化技能
        this.role.resetAllSkills();
        //初始化称号
        if(data.ChengHao){
            GD.role.ChengHao=[]
            for(let key in data.ChengHao){
                let id = parseInt(key)
                let exp = data.ChengHao[key]
                GD.role.ChengHao.push(new ChengHao(id,exp))
            }
        }
    }
    /**加载json文件 */
    static async loadAssets(boundle:AssetManager.Bundle){
        let res = await Tools.loadJsonAsset('json/monster',boundle);
        if(res){
            let list = (res as JsonAsset).json as Array<MonsterBaseData>
            list.forEach(m=>{
                m.MaxDropLv = (m.Lv*(1-m.Lv/300)*6.5)>>0
                this.monsterBaseDatas.set(m.Id,m)
            })
            this.BossIdList.forEach(id=>{
                let data = this.monsterBaseDatas.get(id)
                this.WorldBossKillerDatas.push(new WorldBossKilledObj(data));
            })
        }
        res = await Tools.loadJsonAsset('json/mapNpcList',boundle);
        if(res){
            this.MapNpcList = (res as JsonAsset).json as Array<MapNpc>;
        }
        res = await Tools.loadJsonAsset('json/buffs',boundle);
        if(res){
            let buffs = (res as JsonAsset).json as Array<Buff>
            buffs.forEach(b=>{
                this.allBuffs.set(b.Id,b);
                b.color = this.buffColors[b.Id]
            })
            // this.initBuffInfos()
        }
        res = await Tools.loadJsonAsset('json/atkEquips',boundle);
        if(res){
            this.AtkEquipBase = (res as JsonAsset).json as Array<AtkEquipBase>
            this.AtkEquipBase.forEach(w=>{
                this.EquipBaseDatas.set(w.Id,w);
            })
        }
        res = await Tools.loadJsonAsset('json/defEquips',boundle);
        if(res){
            let defs = (res as JsonAsset).json as Array<DefEquipBase>
            defs.forEach(def=>{
                this.EquipBaseDatas.set(def.Id,def);
                this.DefEquipBase.push(def)
            })
        }
        res = await Tools.loadJsonAsset('json/dunPai',boundle);
        if(res){
            let defs = (res as JsonAsset).json as Array<DunPaiBase>
            defs.forEach(def=>{
                this.EquipBaseDatas.set(def.Id,def);
                this.DefEquipBase.push(def)
            })
        }
        res = await Tools.loadJsonAsset('json/ringNeck',boundle);
        if(res){
            this.RingNeckBase = (res as JsonAsset).json as Array<RingNeckBase>
            this.RingNeckBase.forEach(r=>{
                this.EquipBaseDatas.set(r.Id,r);
            })
        }
        res = await Tools.loadJsonAsset('json/itemDropLv',boundle);
        if(res){
            this.ItemDropLvObj = (res as JsonAsset).json as Array<ItemDropLvObj>
        }
        res = await Tools.loadJsonAsset('json/pet',boundle);
        if(res){
            let rn = (res as JsonAsset).json as Array<PetBase>
            rn.forEach(r=>{
                this.EquipBaseDatas.set(r.Id,r);
            })
        }
        res = await Tools.loadJsonAsset('json/wing',boundle);
        if(res){
            let rn = (res as JsonAsset).json as Array<WingBase>
            rn.forEach(r=>{
                this.EquipBaseDatas.set(r.Id,r);
            })
        }
        res = await Tools.loadJsonAsset('json/items',boundle);
        if(res){
            let items = (res as JsonAsset).json as Array<ItemBase>
            items.forEach(item=>{
                this.ItemBaseDatas.set(item.Id,item);
            })
        }
        res = await Tools.loadJsonAsset('json/skillItems',boundle);
        if(res){
            this.SkillItemBases = (res as JsonAsset).json as Array<SkillItem>
            this.SkillItemBases.forEach(item=>{
                this.ItemBaseDatas.set(item.Id,item);
            })
            
        }
        res = await Tools.loadJsonAsset('json/material',boundle);
        if(res){
            let items = (res as JsonAsset).json as Array<MaterialItem>
            items.forEach(item=>{
                this.ItemBaseDatas.set(item.Id,item);
            })
        }
        res = await Tools.loadJsonAsset('json/npc',boundle);
        if(res){
            let npcs = (res as JsonAsset).json as Array<Npc>
            npcs.forEach(npc=>{
                this.npc_list.set(npc.Id,npc)
            })
        }
        res = await Tools.loadJsonAsset('json/hcData',boundle);
        if(res){
            this.hcDatas = (res as JsonAsset).json as Array<HcData>
        }
        res = await Tools.loadJsonAsset('json/BossHun',boundle);
        if(res){
            let arr = (res as JsonAsset).json as Array<BossHunData>
            arr.forEach(w=>{
                this.bossHunDatas.set(w.Id,w);
            })
        }
        res = await Tools.loadJsonAsset('json/shopItems',boundle);
        if(res){
            let list = (res as JsonAsset).json as Array<ShopItem>
            list.forEach(obj=>{
                if(obj.Id<10000){
                    let item = this.ItemBaseDatas.get(obj.Id);
                    obj.name = item.Name;
                    if(item.IconId){
                        obj.iconId = item.IconId;
                    }else{
                        obj.iconId = obj.Id
                    }
                }else{
                    obj.name = this.EquipBaseDatas.get(obj.Id).Name;
                    obj.iconId = obj.Id
                }
                this.shopItems.set(obj.Id,obj)
            })
        }
        res = await Tools.loadJsonAsset('json/kfShopItems',boundle);
        if(res){
            let list = (res as JsonAsset).json as Array<ShopItem>
            list.forEach(obj=>{
                if(obj.Id<10000){
                    let item = this.ItemBaseDatas.get(obj.Id);
                    obj.name = item.Name;
                    if(item.IconId){
                        obj.iconId = item.IconId;
                    }else{
                        obj.iconId = obj.Id
                    }
                }else{
                    obj.name = this.EquipBaseDatas.get(obj.Id).Name;
                    obj.iconId = obj.Id
                }
                this.kfShopItems.set(obj.Id,obj)
            })
        }
        res = await Tools.loadJsonAsset('json/zmShopItems',boundle);
        if(res){
            let list = (res as JsonAsset).json as Array<ShopItem>
            list.forEach(obj=>{
                if(obj.Id<10000){
                    let item = this.ItemBaseDatas.get(obj.Id);
                    obj.name = item.Name;
                    if(item.IconId){
                        obj.iconId = item.IconId;
                    }else{
                        obj.iconId = obj.Id
                    }
                }else{
                    obj.name = this.EquipBaseDatas.get(obj.Id).Name;
                    obj.iconId = obj.Id
                }
                this.zmShopItems.set(obj.Id,obj)
            })
        }
        res = await Tools.loadJsonAsset('json/gemShopItems',boundle);
        if(res){
            let list = (res as JsonAsset).json as Array<GemShopItem>
            list.forEach(obj=>{
                if(obj.Id<10000){
                    let item = this.ItemBaseDatas.get(obj.Id);
                    obj.name = item.Name;
                    if(item.IconId){
                        obj.iconId = item.IconId;
                    }else{
                        obj.iconId = obj.Id
                    }
                }else{
                    obj.name = this.EquipBaseDatas.get(obj.Id).Name;
                    obj.iconId = obj.Id
                }
                this.gemShopItems.set(obj.Id,obj)
            })
        }
        res = await Tools.loadJsonAsset('json/hdHcPh',boundle);
        if(res){
            let list = (res as JsonAsset).json as Array<HdHcPhReward>
            // list.forEach(obj=>{
            //     this.hdHcPhRewardsMap.set(obj.HcType,obj.Num)
            // })
            this.hdHcPhRewards=list
        }
        res = await Tools.loadJsonAsset('json/hdUsedPointReward',boundle);
        if(res){
            let list = (res as JsonAsset).json as Array<JfReward>
            this.hdUsedPointRewards=list
        }
        res = await Tools.loadJsonAsset('json/JiLabelRewards',boundle);
        if(res){
            let list = (res as JsonAsset).json as Array<JiLabelReward>
            this.JiLabelRewards=list
        }
        res = await Tools.loadJsonAsset('json/hdUsedDiaReward',boundle);
        if(res){
            let list = (res as JsonAsset).json as Array<JfReward>
            this.hdUsedDiaRewards=list
        }
        res = await Tools.loadJsonAsset('json/shopEquips',boundle);
        if(res){
            let list = (res as JsonAsset).json as Array<outer_pb.Equip>
            list.forEach(equip=>{
                let base = this.EquipBaseDatas.get(equip.Id);
                if(base){
                    equip.SkillId = base.SkillId;
                    equip.Data={}
                }
                this.shopEquips.set(equip.Id,equip)
            })
        }
        res = await Tools.loadJsonAsset('json/QuestDatas',boundle);
        if(res){
            let list = (res as JsonAsset).json as Array<QuestData>
            list.forEach(d=>{
                this.QuestDatas.set(d.TaskId,d)
            })
        }
        res = await Tools.loadJsonAsset('json/CircleQuestLvReward',boundle);
        if(res){
            let d = (res as JsonAsset).json as CircleQuestLvReward
            for(let key in d){
                let m=new Map()
                for(let key1 in d[key]){
                    m.set(key1,d[key][key1])
                }
                this.CircleQuestLvRewards.set(key,m)
            }
        }
        res = await Tools.loadJsonAsset('json/jfRewards',boundle);
        if(res){
            this.JfRewardList = (res as JsonAsset).json as Array<JfReward>
        }
        res = await Tools.loadJsonAsset('json/hdPayRewards',boundle);
        if(res){
            this.hdPayRewardList = (res as JsonAsset).json as Array<JfReward>
        }
        res = await Tools.loadJsonAsset('json/rankPkRewards',boundle);
        if(res){
            this.RandPkRewardList = (res as JsonAsset).json as Array<RandPkReward>
        }
        res = await Tools.loadJsonAsset('json/FailedAddRates',boundle);
        if(res){
            this.FailedAddRates = (res as JsonAsset).json as Array<FailedAddRate>
        }
        res = await Tools.loadJsonAsset('json/ShiTuRewards',boundle);
        if(res){
            this.ShiTuRewardList = (res as JsonAsset).json as Array<ShiTuReward>
        }
        res = await Tools.loadJsonAsset('json/firstRewards',boundle);
        if(res){
            this.FirstRewardList = (res as JsonAsset).json as Array<FirstReward>
        }
        res = await Tools.loadJsonAsset('json/payNums',boundle);
        if(res){
            this.PayMoneyNums = (res as JsonAsset).json as Array<PayAmountObj>;
        }
        res = await Tools.loadJsonAsset('json/skills',boundle);
        if(res){
            let skills = (res as JsonAsset).json as Array<Skill>
            skills.forEach(s=>{
                s.Lv=0;
                let item:SkillItem = this.ItemBaseDatas.get(s.LearnItemId);
                if(item){
                    s.DropLv = item.DropLv;
                }else{
                    s.DropLv = 0;
                }
                s.NextUseTime=0;
                this.allSkills.set(s.Id,s);
            })
        }
        res = await Tools.loadJsonAsset('json/sdMyBossNeedPoint',boundle);
        if(res){
            let list = (res as JsonAsset).json as Array<SdMyBossNeedPointObj>
            list.forEach(d=>{
                this.SdMyBossNeedPoint.set(d.Id,d.Point)
            })
        }
        res = await Tools.loadJsonAsset('json/FjPriceItem',boundle);
        if(res){
            let list = (res as JsonAsset).json as Array<HasFjPriceItem>
            list.forEach(d=>{
                this.HasFjPriceItems.set(d.Id,d)
            })
        }
        res = await Tools.loadJsonAsset('json/maps',boundle);
        if(res){
            let list = (res as JsonAsset).json as Array<MapData>
            list.forEach(d=>{
                if(d.LvNum>0){
                    let name = d.Name
                    for(let i=0;i<d.LvNum;i++){
                        if(i==0){
                            d.Name = `${name}1层`
                            d.NeedLv = d.NeedLvs[0]
                            this.MapList.set(d.Id,d)
                        }else{
                            let data=new MapData()
                            data.Id=d.Id+i
                            data.Name=`${name}${i+1}层`
                            data.PointNames=d.PointNames
                            data.Points=d.Points
                            data.NeedLvs=d.NeedLvs
                            data.NeedLv=d.NeedLvs[i]
                            data.NeedGold=d.NeedGold
                            data.NeedTicket=d.NeedTicket+i
                            data.FbType=d.FbType
                            data.LvNum=d.LvNum
                            data.MonsterPoints=d.MonsterPoints
                            data.BossPoints=d.BossPoints
                            data.Doors=d.Doors
                            data.MapCells=d.MapCells
                            data.PkMode=d.PkMode
                            data.SpawnPoint=d.SpawnPoint
                            data.IsKf=d.IsKf
                            data.DayNum=d.DayNum
                            this.MapList.set(data.Id,data)
                        }
                    }
                }else{
                    this.MapList.set(d.Id,d)
                }
            })
        }
        let pfb:any = await Tools.loadPrefab('prefabs/other/monster',boundle)
        if(pfb){
            this.monsterPrefab = pfb
        }
        pfb = await Tools.loadPrefab('prefabs/other/dropItem',boundle)
        if(pfb){
            this.dropItemPrefab = pfb
        }
        pfb = await Tools.loadPrefab('prefabs/other/dmgLabel',boundle)
        if(pfb){
            this.dmgLabelPrefab = pfb
        }
        pfb = await Tools.loadPrefab('prefabs/other/infoMsg',boundle)
        if(pfb){
            this.infoMsgPfb = pfb
        }
        pfb = await Tools.loadPrefab('prefabs/other/prosMsg',boundle)
        if(pfb){
            this.prosMsgPfb = pfb
        }
        // res = await Tools.loadJsonAsset('json/Doors');
        // if(res){
        //     let list = (res as JsonAsset).json as Array<Door>
        //     list.forEach(d=>{
        //         this.DoorList.set(d.Id,d)
        //     })
        // }
    }
    // static loadBoudle(name:string){
    //     assetManager.loadBundle(name,(err,bundle)=>{
    //         console.log('bundle loaded!',bundle);
    //         this.tex_bundle = bundle;
    //     })
    // }
}