import { Label, Node } from "cc";
import MovieClip from "../utils/MovieClip";

export class SdkUserInfo{
    uid:string;//用户id
    uname:string;//用户昵称
    sid:string;//session
    ts:number;//10位unix时间戳
    sign:string;//md5(uid+uname+time+login_key);备注：login_key为登录密钥，由我方提供,‘+’仅表示连接符，不参与加密
}
export class PayData{
    productId:string;
    productName:string;
    amount:number;
    serverId:string;
    serverName:string;
    roleId:string;
    roleName:string;
    roleLevel:number;
    extension:string;
    orderId:string;
    playerId:string;
    callback:(res)=>void;
}
export const enum SdkUpEventType{
    SelectedServer=1,
    CreateRole=2,
    JoinGame=3,
    LevelUp=4,
}
export class SdkRoleInfo{
    eventType: SdkUpEventType;
    serverId: string;
    serverName: string;
    roleId: string;
    roleName: string;
    roleLevel: number;
    roleCreateTime:number;
    playerId: string;
    callback:(res:any)=>void;
}
export class PayAmountObj{
    Amount:number;
    Point:number;
}
export class SdMyBossNeedPointObj{
    Id:number;
    Point:number;
}
export enum ZmJobType{
    Normal,
    JingYing,
    FuMengZhu,
    MengZhu,
}
export enum InviteMsgType{
    None,
    JoinTeam,
    JoinZM,
    Trade,
}
export class ProMsg{
    Text:string;
    Color:ct;
}
export const enum TaskType{
    Main = 0, //主线任务
	Day,     //每日任务
	Circle, //委托循环任务
    ChengJiu, //成就任务
} 
export const enum TaskTargetType{
    KillMonster     = 0,
	KillGoldenBoss  = 1,
	SubmitItem      = 2, //提交指定道具
	TalkToNPC       = 3, //和指定NPC对话
	Buy1NpcItem     = 4,
	EquipEnhance    = 5, //装备一件道具
	ReachLevel      = 6, //达到指定等级
	HasFriend       = 7, //拥有多少名好友
	JoinZm          = 8, //加入一个战盟
	AddPoint        = 9,
	ReachDsLevel  = 10,
	KillRedBoss     = 11,
    JoinTeam        = 12,
	PickUpOneEquip  = 13,
	RecoverOneEquip = 14,
    HasGold               = 15, //拥有多少金币
	GotoGoldLine          = 16,
	GetMuPointFromMarket  = 17,
	GotoMap               = 18, //前往指定地图历练
	PickupOneAnyDiamond   = 19, //拾取获得任意宝石
	PickupOneZyEquip      = 20, //拾取获得一件卓越装备
	KillAnyBoss           = 21, // 市场上架1件商品
    Complete1CircleQuest  = 22, //完成一次循环委托任务
	XuYuan                = 23, //完成任意一次许愿
	Complete1ZhuanSheng   = 24, //完成一次转生
    KillWorldBoss          = 25,
	RongLianEquipCanPian   = 26,
	HcPetNum               = 27, //合成指定稀有道具（勋章、坐骑、恶魔、天使）
	AddRoleTypeLv          = 28, //转职，职业进阶到指定lv
	SysUsedGold            = 29, //累计系统消耗金币
	SysUsedDia             = 30, //累计系统消耗钻石
	SysUsedMuPoint         = 31, //累计系统消耗点数
}
export class MiniRoleInfo{
    Id:number;
    Name:string;
    Sort:number;//第几名
}
export class JfReward{
    Jf:number;//剩余充值积分
    Rewards:Array<Array<number>>;
}
export class JiLabelReward{
    Needs:Array<number>;
    Rewards:Array<number>;
}
export class ShiTuReward{
    NeedLv:number;
    Rewards:Array<Array<number>>;
}
export class RandPkReward{
    Sort:number;//排名阶段
    Day:Array<Array<number>>;
    Season:Array<Array<number>>;
    KfDay:Array<Array<number>>;
    KfSeason:Array<Array<number>>;
}
export class FailedAddRate{
    Name:string
    Type:number
    Add:number
    Mode:number
}
//冲级奖励
export class FirstReward{
    Id:number;
    Rewards:Array<Array<Array<number>>>;
    RoleName:string;
    RoleId:number;
}
export class RewordNameObj{
    items:Array<string>
    color:ct
    idList:Array<number> //可选道具id列表
    zyType:number;//可选的卓越属性类型，0表示不需要选，1表示防御卓越属性类型，2表示攻击卓越属性类型
}
export class CircleQuestLvReward {  
    [key: string]: {  
      [key: string]: number[][];  
    };  
  }
export class QuestData{
    TaskId:number;
    TaskName:string;
    TaskType:number;
    CanDayTask:number;
    NeedLv:number;
    TargetType:number;
    TargetId:number;
    TargetNum:number;
    IsHas:number;
    RewardItems:Array<Array<number>>;
    NextTaskID:number;
    Pos:Array<number>;
    EquipPros:Array<number>;
}
// export class MainQuest{
//     TaskId:number;
//     Num:number;
//     State:number;
//     constructor(data:outer_pb.IMainQuest){
//         this.TaskId=data.TaskId
//         this.Num=data.Num
//         this.State=data.State
//     }
// }
// export class CircleQuest{
//     TaskId:number;
//     Num:number;
//     State:number;
//     QuestLv:string;
//     Step:number;
// }
// export class DayQuest{
//     TaskId:number;
//     Num:number;
//     State:number;
//     ResetDay:number;
// }
export class AtkEquipBase{
	Id           :number
	Name         :string
	EquipLv      :number
	// EquipType    :number
	RoleType     :number
    RoleTypeLv   :number
	HandType     :number
	MinAtk       :number
	MaxAtk       :number
	MagicAtkUp   :number
	NeedLL       :number
	NeedMJ       :number
	MinZyAtk     :number
	MaxZyAtk     :number
	ZyMagicAtkUp :number
	ZyNeedLL     :number
	ZyNeedMJ     :number
	LLStep       :number
	MJStep       :number
	DropLv       :number
	AddSpeed     :number
	NeedLv       :number
	SkillId      :number
	// AtkType      :number      //武器的攻击类型，魔法攻击1，物理攻击0
}
export class DefEquipBase{
    Id:number
    Name:string
    EquipLv:number
    // EquipType:number
    RoleType:number	
    RoleTypeLv:number
    Def:number
    NeedLL:number
    NeedMJ:number
    ZyDef:number
    ZyNeedLL:number	
    ZyNeedMJ:number
    LLStep:number
    MJStep:number
    DropLv:number
    NeedLv:number
    AddSpeed:number
}
export class DunPaiBase {
	Id        :number
	Name      :string
	EquipLv   :number  //装备阶数
	// EquipType :number
	RoleType  :number
    RoleTypeLv:number
	Def       :number
	DefRate   :number
	NeedLL    :number
	NeedMJ    :number
	ZyDef     :number
	ZyDefRate :number
	ZyNeedLL  :number
	ZyNeedMJ  :number
	LLStep    :number
	MJStep    :number
	DropLv    :number
	NeedLv    :number
    SkillId   :number
}
export class RingNeckBase {
	Id        :number
	Name      :string
	EquipLv   :number  //装备阶数
	YsType    :number
	DropLv    :number
	NeedLv    :number 
}
export class ItemDropLvObj {
	Id        :number
	Name      :string
    DropLv    :number
}
export class PetBase {
	Id        :number
	Name      :string
    Price:number
}
export const ChengHaoTypes:Array<string>=[
    '杀死怪物获得金币提升',
    '杀死怪物掉落物品概率',
    '矿洞产量提升',
    '幸运一击概率提升',
    '获得泡点经验值、杀死怪物获得经验提升',
    '获得泡点经验值、杀死怪物获得经验提升',
    '击杀精英、个人、世界boss获得随机宝石概率提升',
    '矿洞掠夺获得对方库存比例提升',
    '最大生命值提升',
    '最大护盾值提升',
    '矿洞被掠夺损失库存比例减少',
    '对Boss伤害提升',
    '受到反射伤害值减少',
    '矿洞产量提升',
    '对玩家伤害提升',
    '防御成功率增加',
    '连击伤害提升'
]
export const WingZyPros=[
    '魔法值增加',//0 qhLv*5+(1代50、2代100、3代150、4代200)
    '生命值增加',//1 qhLv*5+(1代50、2代100、3代150、4代200)
    '攻击速度增加', //2   7、9、11
    '卓越一击几率增加 +5%', //3  都是5%
    '双倍伤害几率增加 +5%', //4  都是5%
    '反弹攻击力几率提高 +5%',//5  都是5%
    '魔法值完全恢复几率提高 +5%',//6  都是5%
    '完全恢复生命的概率增加 +5%',//7  都是5%
    '无视敌人防御力的概率增加 +5%',//8  都是5%
    '自选一条卓越属性'
]
export class WingBase {
	Id        :number
	Name      :string
    RoleType  :number
    RoleTypeLv   :number
    EquipLv   :number //几代
    NeedLv    :number 
    DmgUp	:number
    Reduce	:number
    Def:number
    Price:number
}
export const enum EquipType {
    None = 0,
    Head = 1, //头盔
    Body = 2,//铠甲
    Leg = 3,//护腿
    Hand = 4,//护手
    Foot = 5,//鞋子

    Ring = 6,//戒指
    Neck = 7,//项链
    Weapon = 8,//武器
    Shield = 9, //盾牌
    JianTong = 10, //箭筒
    ZHBook = 11,//召唤的书
    // BaoZhu = 12,//宝珠

    Wing = 20,//翅膀
    Pet = 21,//宠物
    XunZhang = 22,//勋章
    Horse = 23, //坐骑
    Em          = 24,//恶魔
	TianShi     = 25,//天使
}
/**
 * @description: colorType
 */
export const enum ct {
    gray_dark = "#444444",
    gray = "#888888",
    light_gray = "#aaa",
    white = "#ace",
    blue = "#0099ff",
    green = "#00ff00",
    darkGreen = "#009900",
    qing = "#00ffff",//无视
    brown = "#FF9900",
    purple = "#ff0fff",//发射伤害
    yellow = "#ffff00",//双倍
    red = "#ff3333",//受伤 
    darkBlue = "#00eaff",//荧光宝石
    purple0 = "#fd4ffd", //
    black = "#000000",
    other = "#96D3D8",
    me = "#B0F6FC",
    ys = '#B250FF',//元素伤害
    sd = '#aa7c06', //护盾伤害
    // other_dmg='#97A7DB',
    tsDmg_pink = '#FF70E3',//天使一击
    ftDmg = "#ff00a3",//反弹
}
//0是miss灰色，1普通伤害土黄色，2幸运蓝色，3卓越绿色，4双倍黄金色，5反伤紫色，6无视红色，7连击青色，8毒浅绿色，9白色天罚+宠物+真实伤害，10元素属性伤害紫蓝色，11暗土黄SD伤害，12宠物伤害白，13天使一击粉，14反弹黑
export enum DmgType{
    Miss,
    Normal,
    Lucky,
    Green,
    Double,
    Fs,
    RedWs,
    Qing,
    DuGreen,
    White,
    Ys,
    Sd,
    BaoBao,
    TianShiAtk,
    FanTan_Black,
    SecKill,
}
export const DmgColor = [
    ct.light_gray,
    ct.brown,
    ct.blue,
    ct.green,
    ct.yellow,
    ct.purple,
    ct.red,
    ct.qing,
    ct.darkGreen,
    ct.white,
    ct.ys,
    ct.sd,
    ct.white,
    ct.tsDmg_pink,
    ct.ftDmg,
    ct.red
]
export class BoxMsg{
    msg:string
    color:ct
    constructor(msg:string,color:ct){
        this.msg=msg
        this.color=color
    }
}
export class MyBoss{
    Id:number;
    Num:number;
    NeedLv:number;
    CanSd:boolean;
}
export const BossNamePre = ['','黄金-','精英-','世界-','','','','','','跨服世界-','']
export const ChengHaoLvExp = [1, 3, 7, 15, 31, 63, 127, 255, 511, 1023]
export class ChengHao{
    Id:number;
    Exp:number;
    CurLvExp:number;
    Lv:number=0;
    constructor(id:number,exp:number){
        this.Id=id;
        this.Lv=0;
        this.resetExp(exp)
    }
    //返回值表示是否升级了
    resetExp(exp:number):boolean{
        let oldLv=this.Lv
        this.Exp=exp
        let e:number=0;
        this.Lv=0;
        for(let i=0;i<10;i++){
            e=ChengHaoLvExp[i]
            if(exp>=e){
                this.Lv=i+1
            }else{
                break;
            }
        }
        this.CurLvExp = 0
        if(this.Lv>0){
            this.CurLvExp = exp-ChengHaoLvExp[this.Lv-1]
        }
        return this.Lv!=oldLv
    }
    //返回值表示是否升级了
    getExp(exp):boolean{
        this.Exp+=exp
        return this.resetExp(this.Exp)
    }
}

export var MonsterColorTypes:Array<ct> = [
    ct.brown,//普通小怪
    ct.yellow,//黄金BOSS
    ct.purple,//精英BOSS
    ct.red,//世界BOSS
    ct.blue, //宝宝
    ct.red,//个人BOSS
    ct.red,//血色BOSS
    ct.red,//火龙王
    ct.red,//无尽之塔BOSS
    ct.red,//跨服世界BOSS
    ct.red,
    ct.red,
    ct.red,
]
// export var BaoBaoLvColor:Array<string> = [
//     ct.white,//0
//     '#8BBDF0',//1
//     '#6EB0F3',//2
//     '#489CF1', //3
//     '#298EF5', //4
//     '#007EFF', //5
//     '#0049CA', //6
//     '#F500FF', //7
//     '#E600A6', //8
//     '#E6006E',//9
//     '#E6006E',//10
//     '#E6006E',//11
//     ct.red, //12
//     ct.red,
//     ct.red,
//     ct.red,
//     ct.red,
//     ct.red,
//     ct.red,
//     ct.red,
//     ct.red
// ]
export const enum FbType{
    Normal,
    FbEm,
    FbXs,
    FbYs,
}
export var ItemTypeColor:Array<ct> = [
    ct.white,
    ct.yellow, //宝石
	ct.blue, //技能书
	ct.blue, //材料
    ct.qing, //货币
    ct.yellow, //箱子（可打开）
    ct.blue, //其它（可使用）
]
export const enum ItemType {
    None       = 0,
    Diamond    = 1, //宝石
	SkillItem  = 2, //技能书
	Material   = 3, //材料
    Monney     = 4, //货币
    Box        = 5, //箱子（可打开）
    CanUse  = 6, //其它（可使用）
    ChengHao = 7,//称号
}

export const enum BodyType{
    None        = 0,
    Head        = 1,
	Body        = 2,
	Leg         = 3,
	Hand        = 4,
	Foot        = 5,
	RightHand   = 6,
	Left_Ring   = 7,
	Right_Ring  = 8,
	LeftHand    = 9,
	Neck        = 10,
	Wing        = 11,
	XunZhang    = 12,
	Horse       = 13,
	Em          = 14,
	TianShi     = 15,
    Pet         = 16
}
//根据道具的Id/100000得到的值
// export const enum ItemIdType{
//     DefEquip  = 1, //防具(头铠腿手鞋，不含盾牌)
// 	AtkEquip  = 2,    //武器、箭筒
// 	Ring      = 3,    //戒指
// 	Neck      = 4,    //项链
// 	Wing      = 5,    //翅膀
// 	XunZhang  = 6,    //勋章
// 	Horse     = 7,    //坐骑
// 	DunPai    = 8,    //盾牌
// 	Pet       = 9,    //宠物
//     Em        = 10,
//     TianShi   = 11,

	//不可强化物品 >=20
	// Diamond    = 20, //宝石
	// SkillItem  = 21, //技能书
	// Material   = 22, //材料
	// OtherItem  = 23, //其它
	// CanUse     = 24, //可使用物品
// }
export class SkillItem{
    Id:number;
    Name:string;
    ItemType:number;
    RoleType:number;
    DropLv:number;
    IconId:number;
    DropWay:string;
}
export class HasFjPriceItem{
    Id:number;
    Price1:number;//较低分解价格
    Price2:number;
    PriceType:number;
}
export class ItemBase{
    Id:number;
    Name:string;
    ItemType:number;
    Info:string;
    IconId:number;
    DropWay:string='';
}
export class MaterialItem{
    Id:number;
    Name:string;
    ItemType:number;
    DropLv:number;
    Info:string;
    IconId:number;
    DropWay:string='怪物掉落';
}
export class Item{
    IsNew:boolean=false;
    Id:number;
    Num:number;
    // data:CountItem
    constructor(id:number,num:number,isNew:boolean){
        this.Id=id
        this.Num=num;
        this.IsNew=isNew;
    }
}
// export class CountItem{
//     Id:number;
//     Num:number;
//     constructor(id:number,num:number){
//         this.Id=id
//         this.Num=num;
//     }
// }
// export class Equip{
//     // isNew:boolean=false;
//     data:outer_pb.IEquip;
//     constructor(equip:outer_pb.IEquip,isNew:boolean=false){
//         this.data=equip;
//         this.data.IsNew=isNew;
//     }
// }
export class HelpData{
    Name:string;
    Msg:string;
    Color:string;
}
export class HcData{
    Id:number
    Name:string
    Needs:Array<Array<number>>
    Gold:number;
    BHPrice:number	
    Max1:number	
    Max2:number	
    MaxRate:number	
    Msg:string		
    Info1:string		
    Info2:string	
}
export class Point{
    I:number
    J:number
    constructor(i:number,j:number){
        this.I=i;
        this.J=j;
    }
}
export class MapNpc{
    Id:number;
    List:Array<number>;
}
//地图房间
export class MapData{
    //从数据表读取的
    Id:number;
    Name:string;
    PointNames:Array<string>;
    Points:Array<Array<number>>;
    NeedLvs:Array<number>;
    NeedLv:number;
    NeedGold:Array<number>;
    NeedTicket:number;
    FbType:number;
    LvNum:number;

    //用MapCreaterControl生成的
    MonsterPoints:Array<MonsterPoints>=[]; //怪物刷新点
    BossPoints:Array<MonsterPoints>=[]; //BOSS刷新点
    Doors:Array<Door>=[];
    MapCells:Array<Array<number>>; //地图寻路数据
    
    // NeedZs:number;//需要的最低转生次数
    PkMode:number;//
    SpawnPoint:Point; //角色出生点
    IsKf:number;
    DayNum:number;
}
export const enum MapPkMode{
    None,
    Free,//自由模式，会红名
    JJ,//竞技模式，不红名
}
export class Door{
    Id:number;
    NeedLv:number;
    TargetId:number;
    TargetName:string;
    TargetPos:Array<number>;
    AtI:number;
    AtJ:number;
}

export class MonsterPoints{
    I:number
    J:number
    Ids:Array<number>//怪物id
    constructor(i:number,j:number,ids:Array<number>){
        this.I=i;
        this.J=j;
        this.Ids=ids;
    }
}
//技能释放类型：是丢子弹类型还是直接作用到目标身上的类型
export enum FireType{
    AroundSelf=0,
    BulletTo=1,
    OnTarget=2,
    ZhaoBaoBao=3,
}
//作用到目标类型
export enum TargetType{
    Self              = 0,
	TeamMenberAndSelf = 1,
	Enemy             = 2,
}
//释放点
export enum CenterType{
    Self              = 0,
	Target = 1,
}
export enum YsType{
    None = 0,    //无属性
    Bing = 1,    //冰
    Feng = 2,    //风
    Du   = 3,    //毒
    Lei  = 4,    //雷
    Di   = 5,    //地
    Huo  = 6,    //火
    Shui = 7,    //水
    An   = 8,    //暗
}
export class KillMonsterInfo{
    Id:number
    Num:number;
    type:number;
    // GoldNum:number;
    // RedNum:number;
    constructor(id:number,num:number,type:number){
        this.Id=id;
        this.Num=num;
        this.type=type;
        // this.GoldNum=num;
        // this.RedNum=getNum;
    }
}
export class WorldBossKilledObj{
    data:MonsterBaseData;
    killerName:string;
    killerId:number;
    constructor(data:MonsterBaseData){
        this.data=data;
    }
}
export class OtherHole{
    // Name:string
    Sid:string
    GoldHole:outer_pb.IHole;
    DiaHole:outer_pb.IHole;
    ItemHole:outer_pb.IHole;
    Reduce:number;
    Up:number;
    Grids:Array<number>;
    OpenNum:number;
    IsLooting:boolean=false;//是否处于被我掠夺状态
    getGold:number=0;
    getDia:number=0;
    getItem:number=0;
}
export class RecoverPrice{
    priceType:number;//回收价格类型，0金币，1钻石
    priceStr:string;
}
export const YsTypeString:Array<string>=[
    '随机类型元素值',
    '冰',
    '风',
    '毒',
    '雷',
    '地',
    '火',
    '水',
    '暗'
]
export const YsColors:Array<ct>=[
    ct.black,
    ct.qing,
    ct.white,
    ct.darkGreen,
    ct.purple,
    ct.brown,
    ct.red,
    ct.blue,
    ct.gray
]
export const ChenghaoColors:Array<ct>=[
    ct.yellow,//100
    ct.qing,
    ct.brown,
    ct.blue,
    ct.purple,
    ct.green,
    ct.red,
    ct.sd,//107
    ct.yellow,
    ct.qing,
    ct.brown,
    ct.blue,
    ct.purple,
    ct.green,
    ct.red,
    ct.sd,
    ct.purple,//116
]
//称号Item的id对应1级的称号任务id
export const ItemIdToChLv0Id={
    100:2002,
    101:2024,
    102:2041,
    103:2060,
    104:2084,
    105:2100,//105
    106:2120,//106
    107:2140,
    108:2160,
    109:2180,
    110:2200,
    111:2220,
    112:2240,
    113:2260,
    114:2280,
    115:2300,
    116:2320
}
export enum ZmCellState{
    Boss,//活着的可被攻击的Boss
    Empty,//空
    Seized,//被某个战盟占领
}
export enum KfGcStepType{
    None,    //未开启
	SignUp,  //报名阶段
	Prepare, //准备阶段，升级护盾
	Choice,  //选位置阶段
	Atk      //进攻阶段
}
export enum SkillUpProTypeString {
    '无',
	'力量',
	'敏捷',
	'体力',
	'智力',
	'统帅',
	'最大生命值',
	'防御力',
	'最大攻击力',
    '宠物总成长值'
}
export enum MaxAtkTypeString {
    '最大物理攻击力',
    '最大魔法攻击力',
    '最大诅咒力',
}
export const PointTypeString = [
	'力量',
	'敏捷',
	'体力',
	'智力',
	'统帅',
    '随机类型属性点'
]
export enum SkillUpProType{
    None,
    LL,
    MJ,
    TL,
    ZL,
    TS,
    MaxHp,
    Def,
    MaxAtk,
    PetGrowth,
}
export enum NeedType {
	None,
	LL,
	MJ,
	TL,
	ZL,
	TS,
	Lv,
	Weapon,     //需要装备具有对应技能的武器
	RoleTypeLv, //转职为第几个级别的职业（如弓箭手0、圣射手1、神射手2）
    Horse,      //闪电链技能，需要装备指定等级炎狼神兽
	TianShi,    //天使降临技能，需要装备指定等级天使
	XunZhang,   //战神降临技能，需要装备指定等级勋章
}
export enum NeedTypeStr {
	'无',
	'力量',
	'敏捷',
	'体力',
	'智力',
	'统帅',
	'角色等级',
	'装备武器',     //需要装备具有对应技能的武器
	'职业', //转职为第几个级别的职业（如弓箭手0、圣射手1、神射手2）
}
export enum UnitType{
    Player,
    Monster,
}
export class GetHpMpObj{
    num:number;
    type:number;
}
export interface Unit{
    unitType:UnitType;
    node:Node;
    height:number;
    select(isSelected:boolean);
    data:any;
    beAtked(dmg:number,sdDmg:number)
    setDeath();
    skillLayer:Node;
    getCellPos():Point;
    skillNodePool:Map<number,Node>;
    beAtkedEffect:MovieClip;
    needAddDmgLabels:Array<DmgLabel>
    // halfSkinHeight:number;
}
export class OtherIdName{
    Id:number;
    Name:string;
}
export const enum PopViewType{
    ItemInfo,
    MenuBtns,
    GotoBtns,
    BodyBox,
    SliderBox,
    BagBox,
    MsgBox,
    HelpBox,
    SkillBox,
    TzSetBox,
    KaLvBox,
    KdBtns,//矿洞的设置格子按钮
    TeamActBox,
    TeamInfoBox,
    TeamRolesForPos,
    SelectBox,
    PayBox,
    AccountBox,
    DropBox,
    MarketTypeBox,
    HideSidSetBox,
}
export enum SoundType{
    Idle='i',
    Atk='a',
    Death='d'
}
export class MonsterBaseData {
    Id:number;
    Name:string;
    SoundId:number;
    Lv:number;
    Hp:number;
    Skin:number;
    MaxDropLv:number;
}
export class BossHunData {
    Id:number;
    Name:string;
    BaseNum:number;
    Lv:number;
    ItemId:number;
}
export enum SkillType{
    Atk,
    Buff,
    AlwaysCheck,//加血等
    BaoBao,
}
export class Skill{
    Id:number;
    Name:string;
    SoundId:number;
    Repeat:number;
    SkillType:number; //atk=0、buff=1
    RoleType:number;//可用职业，0表示通用
    LearnNeed:Array<Array<number>>;
    LearnItemId:number;//LearnItemId=0表示不可升级，不需要激活
    UseDis:number;//攻击范围
    NeedTarget:number; //是否需要一个目标才能释放，0不需要，1需要
    CenterType:CenterType;//以自身为中心=0，以目标为中心=1
    Radius:number;//距离中心点的作用范围
    YsType:number;
    Nums:Array<number>;//[值,每级提升]
    UpSteps:Array<number>;//[值,多少点提升+1]
    UpProTypes:Array<number>;//提升依据属性类型
    AtkType:number;//物理技能=0、魔法技能=1
    TargetType:TargetType;//目标类型：自己0、队伍1、敌人2
    TargetNum:number;//目标数量
    AddLj:number;//连击值
    NeedMp:number;
    NeedAg:number;
    Cd:number;
    BuffIds:Array<number>;
    FireType:FireType;//技能释放类型：是丢子弹类型还是直接作用到目标身上的类型 
    Info:string;

    Lv:number=0;
    NextUseTime:number=0;//下一次可用时间戳
    DropLv:number;
    canUse:boolean=false;
}
export class Buff{
    Id:number;
    Name:string;
    Rate:Array<number>;	
    Duration:Array<number>;	
    InstallNums:Array<number>;	
    IsPer:number;
    InstallUpSteps:Array<number>;	
    InstallUpProTypes:Array<number>;	
    Interval:Array<number>;	
    IntervalNum	:Array<number>;
    IntervalUpSteps	:Array<number>;
    IntervalUpProTypes:Array<number>;	
    Cd	:number
    CanLvUp:number
    MaxLv:number
    Info:string;
    Sign:string;
    color:ct;
    curNum:number;
    expireTime:number;
}
export enum UnitState{
    Idle=0,
    Moving=1,
    Atking=2,
    Death=3,
}
export enum PkMode{
    HePing,
    Team,
    ZhanMeng,
    LianMeng,
    All,
}
export enum SkillMode{
    GuaJi,
    Boss,
    Pk,
}
export enum UseSkillResult{
    Success,
    NoTarget,
    CdNotOk,
    NotEnoughItem,
}
export enum ResetPosType{
	SuiJi,
	BackHome,
	Relife,
	BackToOldPos,
    ChangePoint,
}
export class Npc{
    Id:number;
    Name:string;
    Info:string;
    SellItems:Array<number>;
    Msg:Array<string>;
    PageType:number;//是：商店界面7、跳转到指定类型界面(如合成界面、仓库界面等)
}
export class DmgLabel{
    label:Label;
    dmgType:number;
    DeathUnit:boolean;
    target:Unit;
}
export class ShopItem{
    Id:number;
    Price:number;
    PriceYk:number;
    PriceType:number;
    name:string;
    iconId:number;
}
export class HdHcPhReward{
    Name:string;
    HcType:number;//合成类型
    Num:number;//奖励基数
}
export class GemShopItem{
    Id:number;
    Price:number;
    Step:number;
    Num:number;
    name:string;
    iconId:number;
}
export const enum ChatChannelType {
    System,
    World,
    MapLine,
    Neighbor,
    Team,
    ZhanMeng,
    LianMeng,
    KuaFu,
    Private,
    All,
}
export const PriceTypeColor = [ct.white,ct.yellow,ct.qing,ct.brown]
export const ChatChannelNames = ['[系统]','[世界]','[地图]','[附近]','[队伍]','[战盟]','[联盟]','[跨服]','[私聊]']
export const ChatChannelColors = [ct.red,ct.yellow,ct.blue,ct.white,ct.green,ct.qing,ct.darkBlue,ct.purple,ct.brown]
export const enum RoleType {
    ZS=1,
    FS=2,
    GJS=4,
    MJS=8,
    SDS=16,
    ZHS=32,
    GDJ=64,
    GHQS=128
}
export const enum LightType {
    none,
    blue,
    green,
    purple,
    yellow,
    red,
    qing,
}
export const enum DzType{
    ZfQh,
    LhQh,
    YjQh9,
    AddZj,
    AddXy,
    AddZs,
    AddJh,
    AddPvP,
}
//吞噬类型
export const enum TsType{
    ShouHu,
    RingNeck,
    XunZhang,
    Horse
}
export var ItemTypeLightType:Array<LightType> = [
    LightType.none,
    LightType.yellow, //宝石
	LightType.blue, //技能书
	LightType.blue, //材料
    LightType.qing, //货币
    LightType.yellow, //箱子（可打开）
    LightType.blue, //其它（可使用）
]
export const RoleTypeLvStr:Array<Array<string>>=[
    ['见习剑士','剑士','骑士','神骑士'],
    ['见习魔法师','魔法师','魔导师','神导师'],
    ['见习弓箭手','弓箭手','圣射手','神射手'],
    ['见习魔剑士','魔剑士','魔骑士','剑圣'],
    ['见习圣导师','圣导师','圣骑士','祭师'],
    ['见习召唤术士','召唤术士','召唤术师','巫师'],
    // ['见习格斗家','格斗家','格斗专家','格斗大师'],
    // ['见习梦幻骑士','梦幻骑士','光辉骑士','魅影骑士'],
]
export const RoleTypeStr:Array<string>=['战士','法师','弓箭手','魔剑士','圣导师','召唤术士']
export const MiniRoleTypeStr:Array<string>=['战','法','弓','魔','圣','召']
export const ZyTypeString:Array<string>=[
    '伤害减少 +4%',//0
    '伤害反射 +5%',//1
    '最大生命值 +4%',//2
    '最大魔法值 +4%',//3
    '防御成功率 +10%',//4
    '击杀怪物获得金币 +40%',//5
    '攻击速度 +10',//6
    '卓越一击概率 +10%',//7
    '最大攻击力增加 +2%',//8
    '最大攻击力增加 +等级/20',//9
    '击杀怪物恢复生命 +(生命值/8)',//10
    '击杀怪物恢复魔法 +(魔法值/8)',//11
    '自选一条卓越属性'
]
export var DefZyTypes:Array<number>=[0,1,2,3,4,5];
export var AtkZyTypes:Array<number>=[6,7,8,9,10,11];
export var WingZyTypes:Array<number>=[0,1,2,3,4,5,6,7,8];
export var FuMoTypeStr:Array<string>=[
    //附魔属性列表
    '力量',     //0
    '敏捷',     //1
    '体力',     //2
    '智力',     //3
    '统帅',     //4
    '冰攻击力',//5
    '风攻击力',//6
    '毒攻击力',//7
    '雷攻击力',//8
    '地攻击力',//9
    '火攻击力',//10
    '水攻击力',//11
    '暗攻击力',//12

    '冰防御力',//13
    '风防御力',//14
    '毒防御力',//15
    '雷防御力',//16
    '地防御力',//17
    '火防御力',//18
    '水防御力',//19
    '暗防御力',//20

    '装备需求力量降低',//21
    '装备需求敏捷降低',//22
    '装备需求等级降低',//23
    '装备基础属性提升',//24
    '击杀怪物获得金币提升',//25

    //稀有属性（重置时有概率出现）
    '击杀怪物掉落道具为装备概率',//26
    '对Boss伤害提升',//27
    '矿洞掠夺获得对方库存比例提升',//28
    '对玩家伤害提升',//29
    '受到玩家伤害减少'//30
]
export var DefTzTypeString:Array<string>=[
    //基础属性0-9，都是数值
    '力量',     //0
    '敏捷',     //1
    '体力',     //2
    '智力',     //3
    '统帅',     //4
    '防御力',   //5
    '最大技能值',//6
    '最大生命值',//7
    '最大护盾值',//8
    '防御成功率', //9
    //高级属性10-19，都是百分比
    '伤害减少',   //10
    '伤害反射',     //11
    '防御成功率',   //12
    '防御力提升',   //13
    '最大生命值',   //14
    '最大技能值',   //15
    '抵抗幸运一击概率', //16
    '抵抗卓越一击概率', //17
    '抵抗双倍伤害概率', //18
    '抵抗无视一击概率' //19
]
export var AtkTzTypeString:Array<string>=[
    //基础属性0-6，都是数值
    '攻击速度',     //0
    '最大攻击力',   //1
    '技能攻击力',   //2
    '攻击成功率',   //3
    '卓越一击伤害', //4
    '幸运一击伤害', //5
    '反射怪物伤害增加', //6
    //高级属性7-13，都是百分比
    '伤害提升',     //7
    '攻击成功率',   //8
    '双倍伤害概率', //9
    '卓越一击概率', //10
    '致命一击概率', //11
    '技能攻击力提升',//12
    '反射伤害值提升',//13
]
export var AtkDtTzTypeString:Array<string>=[
    '连击命中率',
    '毒伤害提升',
    '连击伤害提升',
    '所有技能等级',
    '天使一击概率',
    '所有元素攻击力',
    '连击值恢复量',
    '无视目标防御力概率',
    '无视目标元素防御力概率',
]
export var DefDtTzTypeString:Array<string>=[
    '反弹伤害概率',
    '最终伤害减免',
    '所有技能等级',
    '所有元素防御力',
    '最终元素伤害减免',
    '抵抗致命一击概率',
    '闪避连击伤害概率',
    '连击值恢复量提升',
    '受到连击伤害减少',
]
export const enum ShopItemStatus{
    StatusUnlisted=0,   // 已下架
	StatusPending=1,    // 公示竞拍中
	StatusAvailable=2,  // 可直接购买
}
export const enum ZSType {
    None,
    //===========武器===============
    //物理武器
    minAtk,//最小攻击力提高
    maxAtk,//最大攻击力提高
    atk,//攻击力提高
    JZAtk,//加重攻击力 +30
    skillAtk,//技能攻击力 +22
    wsSDRate,//攻击无视 SD 机率提高
    reduceSDRate,//SD 减少率提高
    //法术武器（杖）
    minMagicAtk,
    maxMagicAtk,
    magicAtk,//魔法攻击力提高
    JZAtk_magic,//加重攻击力 +30
    skillAtk_magic,//技能攻击力 +22
    wsSDRate_magic,//攻击无视 SD 机率提高
    reduceSDRate_magic,//SD 减少率提高
    //召唤的诅咒书
	MinZuZhouAtk, //最小诅咒力提高
	MaxZuZhouAtk, //最大诅咒力提高
	ZuZhouAtk,    //诅咒力提高
    //共有
    atkPvPAtkRate,//攻击成功率提高(PVP)

    //===========防具==============
    maxAG,//最大 AG 提高
    maxHP,//最大 HP 提高
    autoAddHp,//生命值自动增加量提高
    autoAddMp,//魔法值自动增加量提高
    defPkRate,//防御成功率提高(PVP)
    reduceZSDmg,//伤害减少量提高
    addSDRate,//SD比例提高
    addDef //防御力提高
}
export var ZSPros = [
	[2, 3, 4, 5, 6, 7, 9, 11, 12, 14, 15, 16, 17, 20, 22, 25],       //最小攻击力提高
	[3, 4, 5, 6, 7, 8, 10, 12, 14, 17, 20, 23, 26, 29, 32, 36],      //最大攻击力提高
	[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 14, 16, 19, 22, 25],         //攻击力提高
	[1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 30, 36, 45],     //加重攻击力(物理)
	[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 22, 26, 32],        //技能攻击力(物理)
	[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 10, 12, 15],   //攻击无视 SD 机率提高
	[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 10, 12, 15],   //降低敌人SD接受伤害比例

	[3, 4, 5, 6, 7, 8, 10, 12, 14, 17, 20, 23, 26, 29, 32, 36],      //最小魔法攻击力提高
	[8, 10, 12, 14, 16, 17, 18, 19, 21, 23, 25, 27, 31, 35, 40, 45], //最大魔法攻击力提高
	[6, 8, 10, 12, 14, 16, 17, 18, 19, 21, 23, 25, 27, 31, 35, 40],  //魔法攻击力提高
	[3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20, 22, 28, 34, 42],      //加重攻击力(魔法)
	[1, 2, 3, 4, 5, 6, 7, 10, 13, 16, 19, 22, 25, 30, 35, 43],       //技能攻击力(魔法)
	[0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 9, 10, 12, 14, 16, 18],     //攻击无视 SD 机率提高
	[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 8, 10, 13, 16, 20],  //降低敌人SD接受伤害比例

	[3, 4, 5, 6, 7, 8, 10, 12, 14, 17, 20, 23, 26, 29, 32, 36],      //最小诅咒力提高
	[8, 10, 12, 14, 16, 17, 18, 19, 21, 23, 25, 27, 31, 35, 40, 45], //最大诅咒力提高
	[6, 8, 10, 12, 14, 16, 17, 18, 19, 21, 23, 25, 27, 31, 35, 40],  //诅咒力提高

	[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 17, 21],         //攻击成功率提高(PVP)

	//======防具=====                                                ======防具=====
	[1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32],      //最大 AG 提高
	[1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 30, 35, 42],     //最大 HP 提高
	[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],         //生命值自动回复量提高
	[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],         //魔法值自动回复量提高
	[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 7, 8, 10, 13],  //防御成功率提高(PVP)
	[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],         //伤害减少量提高
	[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],         //提升自身SD接受伤害比例
	[3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 33],      //防御力提高
]
export class ServerInfo{
    id:string;
    openTime:number|Long;//openTime
    name:string;//name
    GateId:number;
    // s:number;//state
    constructor(info:outer_pb.IServer){
        this.id=info.ServerId;
        this.name=info.Name;
        this.openTime=info.OpenTime;
        this.GateId=info.GateId
    }
}