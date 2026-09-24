import GameManager from "../managers/GameManager";
import { PageType, UIMgr } from "../managers/UIMgr";
import { AtkEquipBase, BodyType, BoxMsg, Buff, ChengHao, ct, EquipType, Item, NeedType, OtherHole, RoleType, Skill, SkillMode, SkillType, SkillUpProType } from "./types";
import GD from "./GameData";
import WS from "./net";
import { ConfigType, MT } from "./MT";
import Tools from "./tools";
import { TooManyRedPointInfo } from "./consts";
import { Mail } from "../pages/MailPage";

export class Role {
    skillSlots:Map<SkillMode,Array<number>>=new Map()//[0,0,0,0,0,0,0,0,0];
    data:outer_pb.IRole_proto;
    clickPickUpNum:number=0;
    // speed:number;
    addSpeed:number;//除了点数，其它道具附加的速度
    tempSpeed:number;//缓存,用于加点显示比较
    basePros:outer_pb.IBasePros;
    lastMaxHp:number;
    lastMaxMp:number;
    lastMaxAg:number;
    lastMaxSd:number;
    atkCurZmBossNum:number=0
    atkCurZmBossDmg:number=0
    atkCurZmBossTotalDmg:number=0
    tempPros:outer_pb.IBasePros;//缓存,用于加点显示比较
    BodyEquips:{ [k: string]: outer_pb.IEquip; };
    MyWorldBossKillDatas:Map<number,boolean>=new Map();
    BagEquips:Array<outer_pb.IEquip>=[];
    BagItems:Array<Item>=[];
    Mails:Array<Mail>=[];
    BagSet:outer_pb.IBagSet;
    skills:Map<number,Skill>;
    Jf:number;
    gotJfIndex:number;
    // freePoint:number=0;
    isTrading:boolean=false;//是否在交易中
    myTeam:outer_pb.ITeamInfo;
    myZm:outer_pb.ZmAct;
    neighborOthers:Map<number,outer_pb.IOtherRoleInfo>=new Map();
    buffs:Array<Buff>=[]
    nextAtkTime:number=0;//最小攻击间隔0.2秒
    atkSkills:Array<Skill>;
    ResetDayData:outer_pb.IResetData;
    myPkData:outer_pb.PkAct;
    MyHole:outer_pb.IMineHole;
    otherHole:OtherHole;
    HoleDayNum:Array<number>;
    NormalXyNum:number=0;
    hdCjNum:number=0;
    ChengHao:Array<ChengHao>=[];
    diaShopBagDiaNum:number=0;
    diaShop10PointNum:number=0;
    towerLv:number=0;
    kfTime:number=1;//剩余跨服地图时间
    kfJf:number=0;//跨服积分
    dayDoData:{ [k: string]:number}=null
    kfGcData:outer_pb.KfGcAct;

    LianTiPros:Array<number>;
    XqPros:{ [k: string]:outer_pb.IXqPros}
    // curTaskTargetId:number;
    // curTaskTargetType:number;
    defTzLv:number=0;
    defTzNum:number=0;
    atkTzLv:number=0;
    atkTzNum:number=0;
    defDtTzLv:number=0;
    defDtTzNum:number=0;
    atkDtTzLv:number=0;
    atkDtTzNum:number=0;
    canPlay=(showMsg:boolean=true):boolean=>{
        return (this.data.IsYkMode==false||this.hasBaseYk(showMsg))
    }
    getMaxBagCap=():number=>{
        let max=GD.configs.get(ConfigType.MaxBagCap)
        if(this.data.IsYkMode==false||this.data.BaseYk>Tools.getBeiJingSecond()){
            return max+25
        }else{
            return max
        }
    }
    getMaxCkCap=():number=>{
        let max=GD.configs.get(ConfigType.MaxCkCap)
        if(this.data.IsYkMode==false||this.data.BaseYk>Tools.getBeiJingSecond()){
            return max+15
        }else{
            return max
        }
    }
    getMaxShopCap=():number=>{
        let max=GD.configs.get(ConfigType.MaxShopCkCap)
        if(this.data.IsYkMode==false||this.data.BaseYk>Tools.getBeiJingSecond()){
            return max+15
        }else{
            return max
        }
    }
    getMail=(uid:string,mail:outer_pb.IEmail)=>{
        if(this.Mails.findIndex(m=>{return m.uid==uid})==-1){
            this.Mails.push(new Mail(uid,mail))
        }
    }
    getMyMaxDropLv=(isBoss:boolean=false):number=>{
        let lv = this.data.Lv;
        if(isBoss){
            const zsNum = this.data.ZsNum;
            if(zsNum>0){
                //是BOSS，每多转一次，加10级，上限400
                lv+=10*zsNum
                if(lv>400) lv=400
            }
        }
        return lv
    }
    resetAllSkills=()=>{
        this.skills=new Map();
        const data = this.data;
        //加入已学习的技能
        for(let idstr in data.SkillLvs){
            let id = parseInt(idstr)
            let skill = GD.allSkills.get(id)
            if(skill&&(skill.RoleType==0||(data.RoleType&skill.RoleType)>0)){
                skill.Lv = data.SkillLvs[idstr]
                skill.canUse=false;
                this.skills.set(skill.Id,skill)
            }
        }
        //加入默认技能
        let defaultSkill = [1,2,3,4,data.NormalAtkSkillId] //血瓶技能、蓝瓶技能、随机卷轴技能、回城卷轴技能、普通攻击技能
        defaultSkill.forEach(id=>{
            let skill = GD.allSkills.get(id)
            if(!skill){
                skill = new Skill() //3,4
                skill.Id=id;
                skill.Cd=1;//3,4
            }
            skill.canUse=true;
            skill.Lv=0;
            this.skills.set(id,skill)
        })
        //this.basePros.Skills为当前可用技能，设置技能的可用性
        for(let idstr in this.basePros.Skills){
            let id = parseInt(idstr)
            let skill = GD.allSkills.get(id)
            if(skill){
                skill.canUse=true;
                if(this.skills.has(id)==false){
                    skill.Lv=this.basePros.Skills[idstr]
                    this.skills.set(id,skill)//添加武器技能（不需要学的技能）
                }
            }
        }
        this.resetAtkSkills();
    }
    resetTzPros=()=>{
        this.defTzLv=0;
        this.defTzNum=0;
        this.atkTzLv=0;
        this.atkTzNum=0;
        let minDefTzLv=99;
        let minAtkTzLv=99;

        this.defDtTzLv=0;
        this.defDtTzNum=0;
        this.atkDtTzLv=0;
        this.atkDtTzNum=0;
        let minDtDefTzLv=99;
        let minDtAtkTzLv=99;
        for(let t in this.BodyEquips){
            let equip = this.BodyEquips[t]
            if(equip){
                if(equip.TzLv>0){
                    if((equip.Id/10000>>0)<=EquipType.Foot){
                        this.defTzNum++
                        if(equip.TzLv<minDefTzLv){
                            minDefTzLv=equip.TzLv
                        }
                        if(equip.DtTzLv>0){
                            this.defDtTzNum++
                            if(equip.DtTzLv<minDtDefTzLv){
                                minDtDefTzLv=equip.DtTzLv
                            }
                        }
                    }else{
                        const bodyType=parseInt(t)
                        if(bodyType==BodyType.LeftHand){
                            let base:AtkEquipBase=GD.EquipBaseDatas.get(equip.Id)
                            if(base&&base.HandType==1&&base.RoleType!=4){
                                this.atkTzNum++ //双手武器给空的右手也加上套装效果
                                if(equip.DtTzLv>0){
                                    this.atkDtTzNum++
                                }
                            }
                        }
                        this.atkTzNum++
                        if(equip.TzLv<minAtkTzLv){
                            minAtkTzLv=equip.TzLv
                        }
                        if(equip.DtTzLv>0){
                            this.atkDtTzNum++
                            if(equip.DtTzLv<minDtAtkTzLv){
                                minDtAtkTzLv=equip.DtTzLv
                            }
                        }
                    }
                }
            }
        }
        if(minDefTzLv<99)this.defTzLv=minDefTzLv;
        if(minAtkTzLv<99)this.atkTzLv=minAtkTzLv;
        if(minDtDefTzLv<99)this.defDtTzLv=minDtDefTzLv;
        if(minDtAtkTzLv<99)this.atkDtTzLv=minDtAtkTzLv;
    }

    resetAtkSkills=()=>{
        let ids = this.skillSlots.get(this.data.SkillMode);
        this.atkSkills=[]
        ids.forEach(id=>{
            let skill=this.skills.get(id);
            if(skill&&skill.SkillType==SkillType.Atk){
                this.atkSkills.push(skill);
            }
        })
    }
    //根据等级计算经验衰减（>=400级且完成3转，获得经验固定按400级来计算衰减）
    // caculateExp(exp:number,monsterLv:number):number{
    //     let rate = (this.data.Lv-monsterLv*(1+monsterLv/60))/200
    //     if(rate<0){
    //         rate = -rate
    //     }
    //     if(rate>=1) rate = 0.8
    //     exp=exp*(1-rate)
    //     if(exp<monsterLv){
    //         return monsterLv
    //     }else{
    //         return exp
    //     }
    // }
    tjDmg:number=0;
    expFromMonster:number=0;
    showGetExp:boolean=true
    //monsterLv>0表示需要计算衰减
    getExp=(getExp:number,curExp:number,topShow:boolean,isFromMonster:boolean,pre:string='',show:boolean=true)=>{
        // let can:boolean=false;
        let expStr = '经验值'
        if(this.data.Lv<400){
            // can=true
        }else if(this.basePros.RoleTypeLv>=3){
            //>=400级且完成3转
            expStr = '大师经验值'
        }
        isFromMonster&&(this.expFromMonster+=getExp)
        this.data.Exp=curExp;
        UIMgr.I.refreshExpUI()
        if(this.showGetExp&&show){
            const msg = `${pre}获得：${expStr}+${getExp}`
            UIMgr.I.showProsMsg(msg,ct.blue,topShow)
        }
    }
    addGold=(num:number,topShow:boolean,pre:string='',show:boolean=true)=>{
        this.data.Gold = (this.data.Gold as number) +num;
        UIMgr.I.refreshGoldUI();
        if(show){
            const msg = `${pre}获得：金币x${num}`
            if(topShow){
                UIMgr.I.tip(msg,ct.yellow)
            }else{
                UIMgr.I.showProsMsg(msg,ct.yellow,true)
            }
        }
        GameManager.I.playTipSound('getGold')
    }
    reduceGold=(num:number)=>{
        this.data.Gold = (this.data.Gold as number) -num;
        UIMgr.I.refreshGoldUI();
        UIMgr.I.showProsMsg(`金币-${num}`,ct.red,true)
    }
    reduceZmGx=(num:number)=>{
        this.data.ZmGx-=num;
        UIMgr.I.showProsMsg(`战盟贡献-${num}`,ct.red,true)
    }
    reduceKfJf=(num:number)=>{
        this.kfJf-=num;
        UIMgr.I.showProsMsg(`跨服积分-${num}`,ct.red,true)
    }
    addKfJf=(num:number,topShow:boolean,pre:string=''):string=>{
        this.kfJf+=num;
        const msg = `${pre}获得：跨服积分x${num}`
        if(topShow){
            UIMgr.I.tip(msg,ct.qing)
        }else{
            UIMgr.I.showProsMsg(msg,ct.qing,true)
        }
        GameManager.I.playTipSound('ding')
        return msg
    }
    addDia=(num:number,topShow:boolean,pre:string=''):string=>{
        this.data.Dia = (this.data.Dia as number) +num;
        UIMgr.I.refreshDiaUI();
        const msg = `${pre}获得：钻石x${num}`
        if(topShow){
            UIMgr.I.tip(msg,ct.qing)
        }else{
            UIMgr.I.showProsMsg(msg,ct.qing,true)
        }
        GameManager.I.playTipSound('ding')
        return msg
    }
    reduceDia=(num:number)=>{
        this.data.Dia = (this.data.Dia as number) -num;
        UIMgr.I.refreshDiaUI();
        UIMgr.I.showProsMsg(`钻石-${num}`,ct.red,true)
    }
    addMuPoint=(num:number,topShow:boolean,pre:string=''):string=>{
        this.data.MuPoint = (this.data.MuPoint as number) +num;
        UIMgr.I.refreshMuPointUI();
        const msg = `${pre}获得：点数x${num}`
        if(topShow){
            UIMgr.I.tip(msg,ct.brown)
        }else{
            UIMgr.I.showProsMsg(msg,ct.brown,true)
        }
        GameManager.I.playTipSound('getItem')
        return msg
    }
    reduceMuPoint=(num:number)=>{
        this.data.MuPoint = (this.data.MuPoint as number) -num;
        UIMgr.I.refreshMuPointUI();
        UIMgr.I.showProsMsg(`点数-${num}`,ct.red,true)
    }
    addVipTime=(id:number,baseYk:number,goldYk:number)=>{
        if(baseYk>0)this.data.BaseYk=baseYk;
        if(goldYk>0)this.data.GoldYk=goldYk;
        // if(tgYk>0)this.data.TgYk=tgYk;
        let msg:string='';
        if(id==9){
            msg = '【特权卡】有效期 +365天';
        }else if(id==55){
            msg = '【特权卡】有效期 +30天';
        }else if(id==10){
            msg = '【黄金卡】有效期 +30天';
        }else if(id==11){
            msg = '【专属线路】有效期 +7天';
        }else if(id==12){
            msg = '【专属线路】有效期 +30天';
        }else if(id==48){
            msg = '【黄金卡】有效期 +365天';
        }else if(id==16){
            msg = '【黄金卡】有效期 +7天';
        }
        UIMgr.I.showProsMsg(msg,ct.purple,true)
        GameManager.I.playTipSound('getItem')
    }
    updateBag=(bagEquips:{[k: string]: outer_pb.IEquip;},bagItems:{[k: string]: number;})=>{
        this.BagEquips = []
        for(let uid in bagEquips){
            // this.BagEquips.push(new Equip(bagEquips[uid],false))
            this.BagEquips.push(bagEquips[uid])
        }
        this.BagEquips.sort((a:outer_pb.IEquip,b:outer_pb.IEquip):number=>{return a.Id-b.Id})
        this.BagItems = []
        for(let id in bagItems){
            this.BagItems.push(new Item(parseInt(id),bagItems[id],false))
        }
        this.BagItems.sort((a:Item,b:Item):number=>{return a.Id-b.Id})
    }
    changeAuto=(isAuto:boolean)=>{
        let req = outer_pb.SwitchAuto.create()
        req.IsAuto = isAuto
        let buff = outer_pb.SwitchAuto.encode(req).finish();
        WS.send(MT.SwitchAuto,buff);
    }
    // changeAuto(isAuto:boolean):Promise<boolean>{
    //     return new Promise(resoleve=>{
    //         let req = outer_pb.SwitchAuto.create()
    //         req.IsAuto = isAuto
    //         let buff = outer_pb.SwitchAuto.encode(req).finish();
    //         WS.send(MT.SwitchAuto,buff,(d:any)=>{
    //             let rsp=outer_pb.SwitchAuto.decode(d);
    //             this.data.IsAuto = rsp.IsAuto
    //             resoleve(rsp.IsAuto)
    //         });
    //     })
    // }
    getBagItem=(id:number,num:number,isNew:boolean)=>{
        let item = this.BagItems.find(item=>{return item.Id==id})
        if(item){
            item.Num+=num;
        }else{
            this.BagItems.push(new Item(id,num,isNew))
        }
        if(id>=5&&id<=8){
            //血瓶、蓝瓶、随机、回城
            UIMgr.I.updateItemSlotNums()
        }
    }
    getBagEquip=(data:outer_pb.IEquip,isNew:boolean=false)=>{
        data.IsNew=isNew;
        this.BagEquips.push(data)
        // this.BagEquips.push(new Equip(data,isNew))
    }
    reduceItem=(id:number,num:number)=>{
        if(id == 1){
            //1袋金币(10w)
            num=num*100000
            this.reduceGold(num)
        }else if(id == 2){
            //1小袋钻石(100个)
            this.reduceDia(num*100)
        }else if(id == 401){
            //1大袋钻石(1000个)
            this.reduceDia(num*1000)
        }else if(id == 3){
            //点数
            this.reduceMuPoint(num)
        }else if(id == 14){
            //金币(1个)
            this.reduceGold(num)
        }else if(id == 15){
            //钻石(1个)
            this.reduceDia(num)
        }else if(id == 400){
            //1袋金币(100w)
            this.reduceGold(num*1000000)
        }else{
            let i = this.BagItems.findIndex(item1=>{return item1.Id==id})
            if(i>-1){
                let bi = this.BagItems[i]
                bi.Num-=num
                if(bi.Num<=0) this.BagItems.splice(i,1)
                if(id>=5&&id<=8){
                    UIMgr.I.updateItemSlotNums()
                }else{
                    let base = GD.ItemBaseDatas.get(id)
                    if(base){
                        UIMgr.I.showProsMsg(`${base.Name} -${num}`)
                    }
                }
            }
        }
    }
    hasBaseYk=(showMsg:boolean=true):boolean=>{
        if(this.data.BaseYk<=Tools.getBeiJingSecond()){
            showMsg&&UIMgr.I.tip('需要特权卡')
            return false
        }else{
            return true
        }
    }
     hasGoldYk=(showMsg:boolean=true):boolean=>{
        if(this.data.GoldYk<=Tools.getBeiJingSecond()){
            showMsg&&UIMgr.I.tip('需要黄金卡')
            return false
        }else{
            return true
        }
    }
    hasEnoughLv=(needLv:number,showTip:boolean=true):boolean=>{
        let needZsNum=0
        if(needLv>400){
            needZsNum = needLv-400
            needLv=0;
        }
        //如果转生次数大于需求，则忽略等级，直接返回true
        let data = this.data
        if (data.ZsNum > needZsNum) {
            return true
        }
        if(data.Lv>=needLv&&data.ZsNum>=needZsNum){
            return true
        }else{
            if(showTip){
                UIMgr.I.tip(`等级不足，需要：${needZsNum}转${needLv}级`)
            }
            return false
        }
    }
    hasEnoughDia=(num:number,showTip:boolean=true):boolean=>{
        if(this.data.Dia>=num){
            return true
        }else{
            if(showTip){
                UIMgr.I.tip(`钻石 不足${num}`)
            }
            return false
        }
    }
     hasEnoughMuPoint=(num:number,showTip:boolean=true):boolean=>{
        if(this.data.MuPoint>=num){
            return true
        }else{
            if(showTip){
                UIMgr.I.tip(`当前角色剩余点数 不足${num}`)
            }
            return false
        }
    }
    hasEnoughGold=(num:number,showTip:boolean=true):boolean=>{
        if(this.data.Gold>=num){
            return true
        }else{
            if(showTip){
                UIMgr.I.tip(`金币 不足${num}`)
            }
            return false
        }
    }
    hasEnoughItem=(id:number,num:number,showTip:boolean=true):boolean=>{
        let has:boolean=false
        let name = GD.ItemBaseDatas.get(id).Name
        if(id==14){
            has=this.data.Gold>=num
        }else{
            let item = this.BagItems.find(item1=>{return item1.Id==id})
            if(item){
                has = item.Num>=num
            }
        }
        if(showTip&&has==false){
            UIMgr.I.tip(`${name} 不足${num}个`)
        }
        return has
    }
    // isLimited(showMsg:boolean=true):boolean{
    //     if((this.data.Lv>=GD.configs.get(ConfigType.MaxFreePlayLv)||this.data.ZsNum>0)&&this.hasBaseYk(false)==false){
    //         if(showMsg){
    //             UIMgr.I.tip('继续正常游戏需要激活特权卡')
    //         }
    //         UIMgr.I.show(PageType.FuLiPage)
    //         return true
    //     }else{
    //         return false
    //     }
    // }
    //是否能切换位置(红名时、特权卡过期时无法切换)
    canChangPos=()=>{
        if(this.basePros.RedPoint>=GD.configs.get(ConfigType.RedNameRedPointNum)){
            UIMgr.I.tip(TooManyRedPointInfo)
            return false
        }else{
            return true
        }
    }
    getItems=(items:{[k: string]: number;},isNew:boolean,topShow:boolean=false,pre:string='',needReturnBoxMsg:boolean=false)=>{
        if(items){
            for(let i in items){
                let id = parseInt(i)
                let num = items[i]
                GD.role.getItem(id,num,isNew,topShow,pre,needReturnBoxMsg)
            }
        }
    }
    getItem=(id:number,num:number,isNew:boolean,topShow:boolean=false,pre:string='',needReturnBoxMsg:boolean=false):BoxMsg=>{
        let msg = ''
        let color:ct=Tools.getItemColor(id)
        if(id == 14){
            //金币(1个)
            this.addGold(num,topShow,pre,!needReturnBoxMsg)
            msg = `获得：金币x${num}`
        }else if(id == 2){
            //1小袋钻石(100个)
            msg = this.addDia(num*100,topShow,pre)
        }else if(id == 3){
            //点数
            msg = this.addMuPoint(num,topShow)
        }else if(id == 13){
            //经验值
            /// this.getExp(num,0,topShow,false,pre,!needReturnBoxMsg)
            msg = `获得：经验值x${num}`
        }else if(id == 1){
            //1袋金币(10w)
            num=num*100000
            this.addGold(num,topShow,pre,!needReturnBoxMsg)
            msg = `获得：金币x${num}`
        }else if(id == 400){
            //1大袋金币(100w)
            num=num*1000000
            this.addGold(num,topShow,pre,!needReturnBoxMsg)
            msg = `获得：金币x${num}`
        }else if(id == 401){
            //1大袋钻石(1000个)
            msg = this.addDia(num*1000,topShow,pre)
        }else if(id == 15){
            //钻石(1个)
            msg = this.addDia(num,topShow,pre)
        }else if(id==9){
            msg = '【特权卡】有效期 +365天';
        }else if(id==55){
            msg = '【特权卡】有效期 +30天';
        }else if(id==10){
            msg = '【黄金卡】有效期 +30天';
        }else if(id==11){
            msg = '【专属线路】有效期 +7天';
        }else if(id==12){
            msg = '【专属线路】有效期 +30天';
        }else if(id==48){
            msg = '【黄金卡】有效期 +365天';
        }else if(id==16){
            msg = '【黄金卡】有效期 +7天';
        }else if(id==86){
            msg = '【专属线路】有效期 +365天';
        }else if(id==87){
            msg = '成功激活【永久特权卡】';
        }else if(id == 54){
            //跨服积分
            msg = this.addKfJf(num,topShow,pre)
        }else {
            if(id == 17){
                //自由分配属性点（服务端加，客户端不需要加，打开界面时加载）
                msg = `获得：属性点x${num}`
                this.basePros.FreePoint+=num;
            }else { //魂兽碎片74无实体
                //道具
                let base = GD.ItemBaseDatas.get(id)
                if(base){
                    if(id==74||(id>=200&&id<=215)){
                        //魂兽碎片、魂兽（不放入背包，无实体）
                        msg = `${pre}获得：${base.Name}x${num}`
                    }else if(id>=100&&id<=116){
                        //称号
                        let base = GD.ItemBaseDatas.get(id)
                        if(base){
                            msg = `${pre}称号【${base.Name}】经验值+${num}`
                            let ch = this.ChengHao.find(c=>{return c.Id==id})
                            if(ch){
                                ch.getExp(num)
                            }else{
                                this.ChengHao.push(new ChengHao(id,num))
                            }
                            GD.curMap.updatePlayerChengHaoUi();
                        }
                    }else{
                        //可放入背包的道具
                        this.getBagItem(id,num,isNew)
                        msg = `${pre}获得：${base.Name}x${num}`
                    }
                    if(base.ItemType==1||id==47||id==612){
                        GameManager.I.playTipSound('ding')
                    }else{
                        GameManager.I.playTipSound('getItem')
                    }
                }
            }
            if(needReturnBoxMsg==false){
                if(topShow){
                    UIMgr.I.tip(msg,color)
                }else{
                    UIMgr.I.showProsMsg(msg,color,true)
                }
            }
        }
        if(needReturnBoxMsg){
            return new BoxMsg(msg,color)
        }else{
            return null
        }
    }
    tryDeleteBagEquip=(uid:string):outer_pb.IEquip=>{
        let i = this.BagEquips.findIndex(e=>{return e.Uid==uid;})
        if(i>-1){
            let equip = this.BagEquips.splice(i,1)[0];
            return equip
        }else{
            return null
        }
    }
    tryDeleteItem=(id:number):Item=>{
        let i = this.BagItems.findIndex(e=>{return e.Id==id;})
        if(i>-1){
            let item = this.BagItems.splice(i,1)[0];
            return item
        }else{
            return null
        }
    }
    getEquip=(equip:outer_pb.IEquip,isNew:boolean=false,needReturnBoxMsg:boolean=false,playSound:boolean=true):BoxMsg=>{
        this.getBagEquip(equip,isNew)
        return Tools.newGetEquipMsg(equip,needReturnBoxMsg,playSound)
    }

    // canUseSkill1(id:number){
    //     let skill = this.skills.get(id)
    //     return this.canUseSkill(skill)
    // }
    getUpProNum=(upSkillProType):number=>{
        let bp = this.basePros;
        switch(upSkillProType){
            case SkillUpProType.LL:
                return bp.AllLL;
            case SkillUpProType.MJ:
                return bp.MJ;
            case SkillUpProType.TL:
                return bp.AllTL;
            case SkillUpProType.ZL:
                return bp.AllZL;
            case SkillUpProType.TS:
                return bp.AllTS;
            case SkillUpProType.MaxHp:
                return this.lastMaxHp;
            case SkillUpProType.Def:
                return bp.Def;
            case SkillUpProType.MaxAtk:
                let maxAtk = bp.MaxAtk
                if(bp.MaxMagicAtk>maxAtk){
                    maxAtk = bp.MaxMagicAtk
                }
                if(bp.MaxZzAtk>maxAtk){
                    maxAtk = bp.MaxZzAtk
                }
                return maxAtk;   
            case SkillUpProType.PetGrowth:
                let growth = 0
                let pet = this.BodyEquips[BodyType.Pet]
                if(pet){
                    pet.Grow.forEach(v=>{
                        growth+=v
                    })
                }
                return growth;  
        }
    }
    canLearnSkill=(skill:Skill):boolean=>{
        if(skill){
            let n = skill.LearnNeed.length
            if(n>0){
                let canLearn = true
                for(let i=0;i<n;i++){
                    let need = skill.LearnNeed[i]
                    let needType = need[0]
                    let needNum = need[1]
                    switch(needType){
                        case NeedType.ZL:
                            canLearn = this.basePros.AllZL>=needNum
                            break;
                        case NeedType.Lv:
                            canLearn = this.data.Lv>=needNum||this.data.ZsNum>0
                            break;
                        case NeedType.LL:
                            canLearn = this.basePros.AllLL>=needNum
                            break;
                        case NeedType.MJ:
                            canLearn = this.basePros.AllMJ>=needNum
                            break;
                        case NeedType.TL:
                            canLearn = this.basePros.AllTL>=needNum
                            break;
                        case NeedType.TS:
                            canLearn = this.basePros.AllTS>=needNum
                            break;
                        case NeedType.RoleTypeLv:
                            canLearn = this.basePros.RoleTypeLv>=needNum
                            break;
                        case NeedType.Weapon:
                        case NeedType.Horse:
                        case NeedType.TianShi:
                        case NeedType.XunZhang:
                            canLearn = true
                            break;
                    }
                    if(!canLearn)break;
                }
                if(canLearn){
                    return this.BagItems.findIndex(item=>{return item.Id==skill.LearnItemId;})>-1
                }
                return canLearn;
            }else{
                return true
            }
        }
    }
    lvUp=(info:outer_pb.LvUpInfo)=>{
        if(info.IsLvUp){
            GameManager.I.playTipSound('lvUp')
            this.basePros.CurHp=this.lastMaxHp
            this.basePros.CurMp=this.lastMaxMp
            this.basePros.CurAg=this.lastMaxAg
            this.basePros.CurSd=this.lastMaxSd
        }
        this.data.Exp=info.CurExp as number
        this.data.MaxExp=info.CurLvMaxExp as number
        this.data.Lv=info.Lv
        this.data.DsLv=info.DsLv
    }
    private addMinAtk:number=0;
    private addMaxAtk:number=0;
    private addAtkRate:number=0;
    private addDef:number=0;
    private addDefRate:number=0;
    private addMaxHp:number=0;
    private addMaxMp:number=0;
    private addMinMagicAtk:number=0;
    private addMaxMagicAtk:number=0;
    private addMinZzAtk:number=0;
    private addMaxZzAtk:number=0;
    private addAg:number=0;
    private addSd:number=0;
    private addAtkUp:number=0;
    caculateAddPro=(pro:outer_pb.IBasePros)=>{
        let LL=this.basePros.AllLL
        let MJ=this.basePros.AllMJ
        let TL=this.basePros.AllTL
        let ZL=this.basePros.AllZL
        let TS=this.basePros.AllTS
        let lv = this.data.ZsNum>0?400+this.data.DsLv:this.data.Lv+this.data.DsLv
        switch (this.data.RoleType) {
            case RoleType.ZS:
                //最小攻击力
                this.addMinAtk =  pro.MinAtk - (3 + (LL / 6 >> 0) + (MJ / 8 >> 0))
                //最大攻击力
                this.addMaxAtk =  pro.MaxAtk - (6 + (LL / 4 >> 0) + (MJ / 6 >> 0))
                //atkRate
                this.addAtkRate = pro.AtkRate - ((lv + MJ*2 + LL*2 + ZL*2) >> 0);
                //def
                this.addDef =  pro.Def - (MJ / 3 >> 0);
                //defRate防御率
                this.addDefRate =  pro.DefRate- (MJ / 3 >> 0);
                //hp
                this.addMaxHp =  pro.MaxHp -(35 + TL * 3 + lv* 2);
                //mp
                this.addMaxMp = pro.MaxMp-((10 + ZL + lv/ 2) >> 0);
                //最小魔法攻击力、最大魔法攻击力
                this.addMinMagicAtk = this.addMaxMagicAtk = 0;
                //技能攻击力
                if(ZL<3000){
                    this.addAtkUp = pro.AtkUp-((200 + ZL / 10) >> 0)/100;
                }else{
                    this.addAtkUp = pro.AtkUp-((500 + (ZL-3000) / 20) >> 0)/100;
                }
                //ag
                this.addAg=  pro.MaxAg - ((LL*0.15 + MJ*0.2 + TL*0.3 + ZL*1)>>0)
                this.addSpeed = pro.AllSpeed - (MJ/14>>0);
                break;
            case RoleType.FS:
                //最小攻击力
                this.addMinAtk =  pro.MinAtk-(3 + (LL / 10 >> 0))
                //最大攻击力
                this.addMaxAtk =  pro.MaxAtk-(6 + (LL / 4 >> 0))
                //atkRate
                this.addAtkRate =  pro.AtkRate-((lv + MJ*2 + LL*2 + ZL*2) >> 0);
                //def
                this.addDef =  pro.Def-(MJ / 4 >> 0);
                //defRate防御率
                this.addDefRate=  pro.DefRate - (MJ / 3 >> 0);
                //hp
                this.addMaxHp =  pro.MaxHp-(45 + TL + lv);
                //mp
                this.addMaxMp = pro.MaxMp-((ZL*2 + lv*2) >> 0);
                //最小魔法攻击力、最大魔法攻击力
                this.addMinMagicAtk =  pro.MinMagicAtk-((15+ZL/7) >> 0);
                this.addMaxMagicAtk = pro.MaxMagicAtk-((25+ZL/4) >> 0);
                //技能攻击力
                this.addAtkUp=0;
                //ag
                this.addAg =  pro.MaxAg - ((LL*0.2 + MJ*0.4 + TL*0.3 + ZL*0.2)>>0)
                this.addSpeed = pro.AllSpeed - (MJ/10>>0);
                break;
            case RoleType.GJS:
                //最小攻击力
                this.addMinAtk =  pro.MinAtk-(3 + ((MJ+LL)/10>>0))
                //最大攻击力
                this.addMaxAtk =  pro.MaxAtk-(6 + ((MJ+LL)/4>>0))
                //atkRate
                this.addAtkRate =  pro.AtkRate-((lv + MJ*2 + LL + ZL) >> 0);
                //def
                this.addDef =  pro.Def-(MJ / 10 >> 0);
                //defRate防御率
                this.addDefRate =  pro.DefRate- (MJ / 4 >> 0);
                //hp
                this.addMaxHp =  pro.MaxHp-(40 + TL * 2 + lv);
                //mp
                this.addMaxMp = pro.MaxMp-((ZL*1.5 + lv*1.5) >> 0);
                //最小魔法攻击力、最大魔法攻击力
                this.addMinMagicAtk = this.addMaxMagicAtk = 0;
                //技能攻击力固定200%
                this.addAtkUp =  pro.AtkUp - 2;
                //技能攻击力
                // if(ZL<3000){
                //     this.addAtkUp = pro.AtkUp-((200 + ZL / 10) >> 0)/100;
                // }else{
                //     this.addAtkUp = pro.AtkUp-((500 + (ZL-3000) / 20) >> 0)/100;
                // }
                //ag
                this.addAg =  pro.MaxAg- ((LL*0.3 + MJ*0.2 + TL*0.3 + ZL*0.2)>>0)
                this.addSpeed = pro.AllSpeed - (MJ/23>>0);
                break;
            case RoleType.MJS:
                //最小攻击力
                this.addMinAtk =  pro.MinAtk-((3 + LL/8 + ZL/16) >> 0)
                //最大攻击力
                this.addMaxAtk =  pro.MaxAtk-((6 + LL/4 + ZL/8)>> 0)
                //atkRate
                this.addAtkRate =  pro.AtkRate-((lv + MJ*2 + LL*2 + ZL*2) >> 0);
                //def
                this.addDef=  pro.Def -(MJ / 5 >> 0);
                //defRate防御率
                this.addDefRate =  pro.DefRate- (MJ / 3 >> 0);
                //hp
                this.addMaxHp =  pro.MaxHp-(58 + TL * 2 + lv);
                //mp
                this.addMaxMp= pro.MaxMp -((8 + ZL*2 + lv) >> 0);
                //最小魔法攻击力、最大魔法攻击力
                this.addMinMagicAtk =  pro.MinMagicAtk -((3+ZL / 9) >> 0);
                this.addMaxMagicAtk = pro.MaxMagicAtk-((6+ZL / 4) >> 0);
                //技能攻击力固定200%
                this.addAtkUp =  pro.AtkUp - 2;
                // if(ZL<5000){
                //     this.addAtkUp =  pro.AtkUp -((200 + ZL / 10) >> 0)/100;
                // }else{
                //     this.addAtkUp = pro.AtkUp-((700 + (ZL-5000) / 20) >> 0)/100;
                // }
                //ag
                this.addAg =  pro.MaxAg- ((LL*0.2 + MJ*0.25 + TL*0.3 + ZL*0.15)>>0)
                this.addSpeed = pro.AllSpeed - (MJ/15>>0);
                break;
            case RoleType.SDS:
                //最小攻击力
                this.addMinAtk =  pro.MinAtk-((3 + LL/8 + ZL/16) >> 0)
                //最大攻击力
                this.addMaxAtk =  pro.MaxAtk-((6 + LL/4 + ZL/10 + TS/10) >> 0)
                //atkRate
                this.addAtkRate =  pro.AtkRate-((lv + MJ*2 + LL*2 + ZL*2 + TS*2) >> 0);
                //def
                this.addDef =  pro.Def-(MJ / 7 >> 0);
                //defRate防御率
                this.addDefRate =  pro.DefRate- (MJ / 7 >> 0);
                //hp
                this.addMaxHp =  pro.MaxHp-((50 + TL * 2 + lv* 1.5)>>0);
                //mp
                this.addMaxMp = pro.MaxMp-((18 + ZL*1.5 + lv) >> 0);
                //最小魔法攻击力、最大魔法攻击力
                this.addMinMagicAtk = this.addMaxMagicAtk = 0;
                //技能攻击力
                this.addAtkUp = pro.AtkUp-((200 + ZL / 20 + TS/20) >> 0)/100;
                // if(ZL<3000){
                //     this.addAtkUp = pro.AtkUp-((200 + ZL / 10) >> 0)/100;
                // }else{
                //     this.addAtkUp = pro.AtkUp-((500 + (ZL-3000) / 20) >> 0)/100;
                // }
                //ag
                this.addAg =  pro.MaxAg- ((LL/3 + MJ/5 + TL/10 + ZL*0.15 + TS/3)>>0)
                this.addSpeed = pro.AllSpeed - (MJ/10>>0);
                break;
            case RoleType.ZHS:
                //最小攻击力
                this.addMinAtk =  pro.MinAtk-((3 + LL/10 + ZL/20) >> 0)
                //最大攻击力
                this.addMaxAtk =  pro.MaxAtk-((6 + LL/5 + ZL/10) >> 0)
                //atkRate
                this.addAtkRate =  pro.AtkRate-((lv + MJ*2 + LL + ZL) >> 0);
                //def
                this.addDef =  pro.Def-(MJ / 4 >> 0);
                //defRate防御率
                this.addDefRate =  pro.DefRate- (MJ / 4 >> 0);
                //hp
                this.addMaxHp =  pro.MaxHp-((45 + TL*2 + lv)>>0);
                //mp
                this.addMaxMp = pro.MaxMp-((ZL*2 + lv*2) >> 0);
                //最小魔法攻击力、最大魔法攻击力
                this.addMinMagicAtk =  pro.MinMagicAtk-((3+ZL/10) >> 0);
                this.addMaxMagicAtk = pro.MaxMagicAtk-((6+ZL/4) >> 0);
                this.addMinZzAtk = pro.MinZzAtk-((3+ZL/10) >> 0);
                this.addMaxZzAtk = pro.MaxZzAtk-((6+ZL/4) >> 0);
                //技能攻击力
                this.addAtkUp =0
                //ag
                this.addAg =  pro.MaxAg- ((LL*0.2 + MJ/3 + TL/3 + ZL*0.15)>>0)
                this.addSpeed = pro.AllSpeed - (MJ/15>>0);
                break;
        }
        this.addSd = pro.MaxSd - ((pro.Def/2 + (LL+MJ+ZL+TL+TS)*1.2 + lv)>>0)
        this.tempSpeed=pro.AllSpeed//this.speed;
    }
    recaculateTempPros=(addLL:number,addMJ:number,addTL:number,addZL:number,addTS:number)=>{
        let LL=this.basePros.AllLL+addLL
        let MJ=this.basePros.AllMJ+addMJ
        let TL=this.basePros.AllTL+addTL
        let ZL=this.basePros.AllZL+addZL
        let TS=this.basePros.AllTS+addTS
        let lv = this.data.ZsNum>0?400+this.data.DsLv:this.data.Lv+this.data.DsLv
        let pro = this.tempPros
        switch (this.data.RoleType) {
            case RoleType.ZS:
                //最小攻击力
                pro.MinAtk = this.addMinAtk+(3 + (LL / 6 >> 0) + (MJ / 8 >> 0))
                //最大攻击力
                pro.MaxAtk = this.addMaxAtk+(6 + (LL / 4 >> 0) + (MJ / 6 >> 0))
                //atkRate
                pro.AtkRate = this.addAtkRate+((lv + MJ*2 + LL*2 +ZL*2) >> 0);
                //def
                pro.Def = this.addDef+(MJ / 3 >> 0);
                //defRate防御率
                pro.DefRate =  this.addDefRate +(MJ / 3 >> 0);
                //hp
                pro.MaxHp = this.addMaxHp+(35 + TL * 3 + lv* 2);
                //mp
                pro.MaxMp = this.addMaxMp+((10 + ZL + lv/ 2) >> 0);
                //最小魔法攻击力、最大魔法攻击力
                pro.MinMagicAtk = pro.MaxMagicAtk = 0;
                //技能攻击力
                if(ZL<3000){
                    pro.AtkUp = this.addAtkUp+((200 + ZL / 10) >> 0)/100;
                }else{
                    pro.AtkUp = this.addAtkUp+((500 + (ZL-3000) / 20) >> 0)/100;
                }
                //ag
                pro.MaxAg =  this.addAg+ ((LL*0.15 + MJ*0.2 + TL*0.3 + ZL*1)>>0)
                this.tempSpeed = this.addSpeed + (MJ/14>>0);
                break;
            case RoleType.FS:
                //最小攻击力
                pro.MinAtk = this.addMinAtk +(3 + (LL / 10 >> 0))
                //最大攻击力
                pro.MaxAtk = this.addMaxAtk+(6 + (LL / 4 >> 0))
                //atkRate
                pro.AtkRate = this.addAtkRate +((lv + MJ*2 + LL*2 + ZL*2) >> 0);
                //def
                pro.Def = this.addDef +(MJ / 4 >> 0);
                //defRate防御率
                pro.DefRate = this.addDefRate + (MJ / 3 >> 0);
                //hp
                pro.MaxHp = this.addMaxHp +(45 + TL + lv);
                //mp
                pro.MaxMp = this.addMaxMp+((ZL*2 + lv*2) >> 0);
                //最小魔法攻击力、最大魔法攻击力
                pro.MinMagicAtk = this.addMinMagicAtk +((15+ZL/7) >> 0);
                pro.MaxMagicAtk =this.addMaxMagicAtk +((25+ZL/4) >> 0);
                //技能攻击力
                pro.AtkUp=0;
                //ag
                pro.MaxAg =  this.addAg+ ((LL*0.2 + MJ*0.4 + TL*0.3 + ZL*0.2)>>0)
                this.tempSpeed = this.addSpeed + (MJ/10>>0);
                break;
            case RoleType.GJS:
                //最小攻击力
                pro.MinAtk = this.addMinAtk +(3 + ((MJ+LL)/10>>0))
                //最大攻击力
                pro.MaxAtk =  this.addMaxAtk+(6 + ((MJ+LL)/4>>0))
                //atkRate
                pro.AtkRate = this.addAtkRate +((lv + MJ*2 + LL + ZL) >> 0);
                //def
                pro.Def = this.addDef +(MJ / 10 >> 0);
                //defRate防御率
                pro.DefRate = this.addDefRate + (MJ / 4 >> 0);
                //hp
                pro.MaxHp = this.addMaxHp +(40 + TL * 2 + lv);
                //mp
                pro.MaxMp = this.addMaxMp+((ZL*1.5 + lv*1.5) >> 0);
                //最小魔法攻击力、最大魔法攻击力
                pro.MinMagicAtk = pro.MaxMagicAtk = 0;
                //技能攻击力固定200%
                pro.AtkUp = this.addAtkUp+2
                //技能攻击力
                // if(ZL<3000){
                //     pro.AtkUp = this.addAtkUp+((200 + ZL / 10) >> 0)/100;
                // }else{
                //     pro.AtkUp = this.addAtkUp+((500 + (ZL-3000) / 20) >> 0)/100;
                // }
                //ag
                pro.MaxAg =  this.addAg+ ((LL*0.3 + MJ*0.2 + TL*0.3 + ZL*0.2)>>0)
                this.tempSpeed = this.addSpeed + (MJ/23>>0);
                break;
            case RoleType.MJS:
                //最小攻击力
                pro.MinAtk = this.addMinAtk +((3 + LL/8 + ZL/16) >> 0)
                //最大攻击力
                pro.MaxAtk =  this.addMaxAtk+((6 + LL/4 + ZL/8)>> 0)
                //atkRate
                pro.AtkRate = this.addAtkRate +((lv + MJ*2 + LL*2 + ZL*2) >> 0);
                //def
                pro.Def = this.addDef +(MJ / 5 >> 0);
                //defRate防御率
                pro.DefRate = this.addDefRate + (MJ / 3 >> 0);
                //hp
                pro.MaxHp = this.addMaxHp +(58 + TL * 2 + lv);
                //mp
                pro.MaxMp = this.addMaxMp+((8 + ZL*2 + lv) >> 0);
                //最小魔法攻击力、最大魔法攻击力
                pro.MinMagicAtk = this.addMinMagicAtk +((3+ZL/9) >> 0);
                pro.MaxMagicAtk =this.addMaxMagicAtk +((6+ZL/4) >> 0);
                //技能攻击力固定200%
                pro.AtkUp = this.addAtkUp+2
                //ag
                pro.MaxAg =  this.addAg+ ((LL*0.2 + MJ*0.25 + TL*0.3 + ZL*0.15)>>0)
                this.tempSpeed = this.addSpeed + (MJ/15>>0);
                break;
            case RoleType.SDS:
                //最小攻击力
                pro.MinAtk = this.addMinAtk +((3 + LL/8 + ZL/16) >> 0)
                //最大攻击力
                pro.MaxAtk =  this.addMaxAtk+((6 + LL/4 + ZL/10 + TS/10) >> 0)
                //atkRate
                pro.AtkRate = this.addAtkRate +((lv + MJ*2 + LL + ZL*2 + TS*2) >> 0);
                //def
                pro.Def = this.addDef +(MJ / 7 >> 0);
                //defRate防御率
                pro.DefRate = this.addDefRate + (MJ / 7 >> 0);
                //hp
                pro.MaxHp = this.addMaxHp +((50 + TL * 2 + lv* 1.5)>>0);
                //mp
                pro.MaxMp = this.addMaxMp+((18 + ZL*1.5 + lv) >> 0);
                //最小魔法攻击力、最大魔法攻击力
                pro.MinMagicAtk = pro.MaxMagicAtk = 0;
                //技能攻击力
                pro.AtkUp = this.addAtkUp+((200 + ZL/20 + TS/20) >> 0)/100;
                // if(ZL<3000){
                //     pro.AtkUp = this.addAtkUp+((200 + ZL / 10) >> 0)/100;
                // }else{
                //     pro.AtkUp = this.addAtkUp+((500 + (ZL-3000) / 20) >> 0)/100;
                // }
                //ag
                pro.MaxAg =  this.addAg+ ((LL/3 + MJ/5 + TL/10 + ZL*0.15 + TS/3)>>0)
                this.tempSpeed = this.addSpeed + (MJ/10>>0);
                break;
            case RoleType.ZHS:
                //最小攻击力
                pro.MinAtk = this.addMinAtk +(3 + (LL / 10 >> 0))
                //最大攻击力
                pro.MaxAtk = this.addMaxAtk+(6 + (LL / 4 >> 0))
                //atkRate
                pro.AtkRate = this.addAtkRate +((lv + MJ*2 + LL + ZL) >> 0);
                //def
                pro.Def = this.addDef +(MJ / 4 >> 0);
                //defRate防御率
                pro.DefRate = this.addDefRate + (MJ / 4 >> 0);
                //hp
                pro.MaxHp = this.addMaxHp +(45 + TL*2 + lv);
                //mp
                pro.MaxMp = this.addMaxMp+((ZL*2 + lv*2) >> 0);
                //最小魔法攻击力、最大魔法攻击力
                pro.MinMagicAtk = this.addMinMagicAtk +((3+ZL/10) >> 0);
                pro.MaxMagicAtk =this.addMaxMagicAtk +((6+ZL/4) >> 0);
                pro.MinZzAtk = this.addMinZzAtk +((3+ZL/10) >> 0);
                pro.MaxZzAtk =this.addMaxZzAtk +((6+ZL/4) >> 0);
                //技能攻击力
                pro.AtkUp=0;
                //ag
                pro.MaxAg =  this.addAg+ ((LL*0.2 + MJ/3 + TL/3 + ZL*0.15)>>0)
                this.tempSpeed = this.addSpeed + (MJ/15>>0);
                break;
        }
        pro.MaxSd = this.addSd + ((pro.Def/2 + (LL+MJ+ZL+TL+TS)*1.2 + lv)>>0)
    }
}