import { _decorator, Label, Node, randomRange, RichText, Sprite, SpriteFrame } from 'cc';
import { Tab } from '../UiComps/Tab';
import { List } from '../UiComps/List';
import { ViewStack } from '../UiComps/ViewStack';
import GD from '../base/GameData';
import { BoxMsg, ct, EquipType, QuestData, TaskTargetType, TaskType } from '../base/types';
import { RichTextHandler } from '../UiComps/RichTextHandler';
import Tools from '../base/tools';
import WS from '../base/net';
import { Err, MT } from '../base/MT';
import { BasePage } from './BasePage';
import { PageType, UIMgr } from '../managers/UIMgr';
import {  QuestHelpStr } from '../base/consts';
import {  ShowItemType } from './PopView';
const { ccclass, property } = _decorator;

@ccclass('QuestPage')
export class QuestPage extends BasePage {
    @property(Tab)
    tab:Tab
    @property(ViewStack)
    view:ViewStack
    @property(List)
    dayList:List
    @property(List)
    cjList:List
    @property(Node)
    noCj:Node
    @property(List)
    doList:List
    @property(Node)
    noDayQ:Node
    @property(Node)
    noQuestBox:Node
    @property(Sprite)
    circleNeedFrame:Sprite
    @property(RichText)
    hasNeedLabel:RichText
    @property(RichText)
    circleRich:RichText
    @property(Node)
    circleOkBtn:Node
    @property(Node)
    startCircleBtn:Node
    @property(Node)
    helpBtn:Node
    @property(Node)
    getAllDayBtn:Node

    defaultSp:SpriteFrame
    curSubmitEquipUid:string;
    //0日常、1收矿、2掠夺矿、3委托、4战盟签到、5个人BOSS、6竞技场、7跨服竞技场、8血色、9恶魔、10许愿
    doListData:Array<any>=[
        {info:'各种日常任务',t:PageType.QuestPage,data:0,lv:10},
        {info:'矿洞收取',t:PageType.HolePage,data:0,lv:50},
        {info:'掠夺矿洞',t:PageType.HolePage,data:1,lv:50},
        {info:'委托任务',t:PageType.QuestPage,data:2,lv:100},
        {info:'战盟签到',t:PageType.ZmPage,data:0,lv:100},
        {info:'个人Boss',t:PageType.BossPage,data:2,lv:50},
        {info:'本服竞技场',t:PageType.RankPkPage,data:0,lv:220},
        {info:'跨服竞技场',t:PageType.RankPkPage,data:1,lv:380},
        {info:'血色城堡',t:PageType.NpcShopPage,data:GD.npc_list.get(20),lv:50},
        {info:'恶魔广场',t:PageType.NpcShopPage,data:GD.npc_list.get(10),lv:50},
        {info:'许愿',t:PageType.FuLiPage,data:0,lv:50},
    ]
    static I:QuestPage
    onLoad(): void {
        QuestPage.I=this;
        super.onLoad();
        this.helpBtn.on(Node.EventType.TOUCH_END,(event:any)=>{
            GD.playClickSound();
            UIMgr.I.PopView.showHelpBox(QuestHelpStr)
        },this);
        this.getAllDayBtn.on(Node.EventType.TOUCH_END,(event:any)=>{
            if(GD.role.ResetDayData.DayQuests.some(q=>{return q.State!=2})){
                this.tryCompleteAllQuest()
            }else{
                UIMgr.I.tip('已完成所有任务')
            }
        },this);
        this.defaultSp=this.circleNeedFrame.spriteFrame;
        this.circleNeedFrame.node.on(Node.EventType.TOUCH_END,(event:any)=>{
            GD.playClickSound()
            UIMgr.I.PopView.showBagEquipByFilter(this.bagItemselectedHandler,(equip:outer_pb.IEquip)=>{
                let base:QuestData = GD.QuestDatas.get(GD.role.ResetDayData.CircleQuest.TaskId)
                if(base){
                    let pros=base.EquipPros;
                    let data=equip
                    return data.IsLock==false&&data.QhLv>=pros[0]&&data.ZyList.length>=pros[3]
                    // return data.IsLock==false&&data.QhLv>=pros[0]&&data.ZjLv>=pros[1]&&data.LuckyLv>=pros[2]&&data.ZyList.length>=pros[3]
                }else{
                    return false
                }
            })
        })
        this.startCircleBtn.on(Node.EventType.TOUCH_END,(event:any)=>{
            if(GD.role.hasEnoughLv(100)){
                WS.send(MT.TryStartCircleQuest,GD.EmptyRequestBuff,(d:any)=>{
                    let rsp = outer_pb.QuestAct.decode(d);
                    if(rsp.ErrCode==Err.ErrCode_NotEnoughNum){
                        UIMgr.I.tip('接受失败，剩余次数不足')
                    }else{
                        UIMgr.I.tip('接受失败')
                    }
                })
            }
        })
        this.circleOkBtn.on(Node.EventType.TOUCH_END,this.tryCompleteCircle,this);
        this.doList.array=this.doListData;
        this.tab.selectedHandler=(node:Node,index:number)=>{
            GD.playClickSound();
            this.refresh()
        }
        this.dayList.cellRender=(node:Node,index:number)=>{
            let quest:outer_pb.IDayQuest = this.dayList.array[index]
            let btn = node.children[2];
            btn.off(Node.EventType.TOUCH_END)
            let btnLabel = btn.children[0].getComponent(Label)
            let str:string
            let color:ct
            if(quest.State>0){
                if(quest.State==1){
                    str='领取'
                    color=ct.green
                    btn.on(Node.EventType.TOUCH_END,(event:any)=>{
                        UIMgr.I.tryCompleteQuest(quest.TaskId,TaskType.Day,null)
                    },this);
                }else{
                    str='已完成'
                    color=ct.gray
                }
            }else{
                str='未完成'
                color=ct.brown
            }
            btnLabel.string=str
            btnLabel.color.fromHEX(color)
            let rich = node.children[1].getComponent(RichText);
            this.renderRichText(rich,quest,TaskType.Day)
        }
        this.cjList.cellRender=(node:Node,index:number)=>{
            let quest:outer_pb.IMainQuest = this.cjList.array[index]
            let btn = node.children[2];
            btn.off(Node.EventType.TOUCH_END)
            let btnLabel = btn.children[0].getComponent(Label)
            let str:string
            let color:ct
            if(quest.State>0){
                if(quest.State==1){
                    str='领取'
                    color=ct.green
                    btn.on(Node.EventType.TOUCH_END,(event:any)=>{
                        if(GD.role.canPlay(false)){
                            UIMgr.I.tryCompleteQuest(quest.TaskId,TaskType.ChengJiu,null)
                        }else{
                            UIMgr.I.tip('成就奖励为非绑定道具，为防止刷资源，请先激活特权卡')
                        }
                    },this);
                }else{
                    str='已完成'
                    color=ct.gray
                }
            }else{
                str='未完成'
                color=ct.brown
            }
            btnLabel.string=str
            btnLabel.color.fromHEX(color)
            let rich = node.children[1].getComponent(RichText);
            this.renderRichText(rich,quest,TaskType.ChengJiu)
        }
        this.doList.cellRender=(node:Node,index:number)=>{
            let obj:any = this.doList.array[index]
            let btn = node.children[2];
            btn.off(Node.EventType.TOUCH_END)
            let label=btn.children[0].getComponent(Label)
            let color=ct.gray
            let needColor=ct.red
            if(GD.role.hasEnoughLv(obj.lv,false)){
                color=ct.green
                needColor=ct.blue
            }
            label.string=''
            label.string='前往'
            label.color.fromHEX(color)
            btn.on(Node.EventType.TOUCH_END,()=>{
                if(GD.role.hasEnoughLv(obj.lv)){
                    if(obj.t==PageType.QuestPage){
                        this.tab.select(obj.data)
                    }else{
                        UIMgr.I.show(obj.t,obj.data,true)
                    }                
                }
            },this)
            let str=`<color=${ct.gray}>（未完成)</>`
            if(GD.role.dayDoData){
                let num = GD.role.dayDoData[index]
                if(num){
                    str=`<color=${ct.green}>（已完成 ${num})</>`
                }
            }
            node.children[1].getComponent(RichText).string=`<color=${ct.brown}>${obj.info}</>  <color=${needColor}>需要${obj.lv}级</> ${str}`
        }
    }
    tryCompleteCircle=()=>{
        let base:QuestData = GD.QuestDatas.get(GD.role.ResetDayData.CircleQuest.TaskId)
        if(base&&base.TargetType==TaskTargetType.SubmitItem){
            if(GD.role.hasEnoughItem(base.TargetId,base.TargetNum)==false){
                return
            }
            // if(base.EquipPros.length>0){
            //     if(this.curSubmitEquipUid==null){
            //         UIMgr.I.tip('未提交需求道具')
            //         return
            //     }
            // }else if(GD.role.hasEnoughItem(base.TargetId,base.TargetNum)==false){
            //     return
            // }
            UIMgr.I.tryCompleteQuest(base.TaskId,TaskType.Circle,this.curSubmitEquipUid)
        }
    }
    tryCompleteAllQuest(){
        if(GD.role.hasGoldYk()){
            WS.send(MT.CompleteAllDayQuest,GD.EmptyRequestBuff,(d:any)=>{
                let rsp = outer_pb.QuestAct.decode(d);
                if(rsp.TaskIds.length>0){
                    let msglist:Array<BoxMsg>=[]
                    msglist.push(new BoxMsg('获得任务奖励<br/>',ct.white))
                    // if(rsp.Items.length>0){
                    //     rsp.Items.forEach(item=>{
                    //         msglist.push(GD.role.getItem(item.Id,item.Num,true,false,'',true))
                    //     })
                    // }
                    if(rsp.Items){
                        for(let i in rsp.Items){
                            let id = parseInt(i)
                            let num = rsp.Items[i]
                            msglist.push(GD.role.getItem(id,num,true,false,'',true))
                        }
                    }
                    if(rsp.ExpUp>0){//称号带来的提升
                        GD.role.basePros.ExpUp = rsp.ExpUp
                        UIMgr.I.refreshExpRateUI()
                    }
                    if(rsp.Equips.length>0){
                        rsp.Equips.forEach(equip=>{
                            msglist.push(GD.role.getEquip(equip,true,true))
                        })
                    }
                    rsp.TaskIds.forEach(id=>{
                        let quest = GD.role.ResetDayData.DayQuests.find(q=>{return q.TaskId==id})
                        if(quest){
                            quest.State=2;
                        }
                    })
                    this.dayList.array = GD.role.ResetDayData.DayQuests;
                    if(msglist.length>0){
                        UIMgr.I.PopView.showMsgBox(msglist)
                    }
                    UIMgr.I.tip('成功完成所有任务',ct.green)
                }else{
                    UIMgr.I.tip('已完成所有任务')
                }
            })
        }
    }
    bagItemselectedHandler = (node:Node,index:number,self:any)=>{
        self.hide()
        GD.playClickSound()
        let equip:outer_pb.IEquip =self.bagList.array[index]
        if(equip.ZyList.length>0){
            //卓越装备（先显示卓越属性）
            UIMgr.I.PopView.show(0,equip,false,ShowItemType.Equip,'确定',this.onSelected)
        }else{
            this.onSelected(equip)
        }
    }
    onSelected=(equip:outer_pb.IEquip)=>{
        Tools.renderBagItem(0,equip,this.circleNeedFrame.node)
        this.curSubmitEquipUid=equip.Uid;
        this.circleNeedFrame.node.children[0].active=false;
    }
    //委托需要装备时，自动选择背包装备
    autoSelect=()=>{
        let base:QuestData = GD.QuestDatas.get(GD.role.ResetDayData.CircleQuest.TaskId)
        if(base){
            let pros=base.EquipPros;
            const isZy = pros[3]>0;
            let needQhLv=pros[0];
            let equip = GD.role.BagEquips.find((equip:outer_pb.IEquip)=>{
                let et = equip.Id/10000>>0
                if(isZy){
                    return equip.IsLock==false&&(et<EquipType.Ring||et==EquipType.Shield)&&equip.ZyList.length==1&&equip.QhLv<4&&equip.LuckyLv==0&&equip.ZjLv<12
                }else{
                    return equip.IsLock==false&&et<EquipType.ZHBook&&equip.QhLv==needQhLv&&equip.ZjLv==0&&equip.ZyList.length==0
                }
            })
            if(equip==null&&isZy==false){
                while(equip==null&&needQhLv<9){
                    needQhLv++
                    equip = GD.role.BagEquips.find((equip:outer_pb.IEquip)=>{
                        let et = equip.Id/10000>>0
                        return equip.IsLock==false&&et<EquipType.ZHBook&&equip.QhLv==needQhLv&&equip.ZjLv==0&&equip.ZyList.length==0
                    })
                }
            }
            if(equip){
                this.onSelected(equip)
            }
        }
    }
    refresh(){
        this.scheduleOnce(()=>{
            const index=this.tab.selectedIndex
            this.view.selectedIndex=index
            const data = GD.role.ResetDayData;
            this.getAllDayBtn.active=index==0;
            if(index==0){
                // this.countLabel.string='任务数量、任务奖励会随着等级提升'
                let arr=data.DayQuests; 
                this.dayList.array = arr
                this.noDayQ.active = arr.length==0
            }else if(index==1){
                this.cjList.array=data.CjQuests.sort((a,b)=>{return a.TaskId-b.TaskId;});
                this.noCj.active = data.CjQuests.length==0
            }else if(index==2){
                this.updateCircleQuest()
            }else if(index==3){
                WS.send(MT.GetDayDoList,GD.EmptyRequestBuff,(d:any)=>{
                    let rsp = outer_pb.HuoDongAct.decode(d)
                    GD.role.dayDoData=rsp.Items
                    this.doList.refresh()
                })
            }
        },0)
    }
    renderRichText(rich:RichText,quest:any,taskType:TaskType){
        let base:QuestData = GD.QuestDatas.get(quest.TaskId)
        let needStr=base.TaskName
        let obj={Items:[]}
        if(base.TargetType!=TaskTargetType.TalkToNPC){
            let id = base.TargetId
            if(id>0){
                let name = GD.ItemBaseDatas.get(id).Name
                let item = outer_pb.DropItem.create()
                item.Uid=randomRange(1,99999)+''
                item.ItemId=id
                item.ItemNum=base.TargetNum
                item.ItemType=2
                obj.Items.push(item)
                needStr = `<u><color=${Tools.getItemColor(id)} click="onClick" param="i${item.Uid}">${name}</></u>`
            }
            if(taskType==TaskType.Day||taskType==TaskType.ChengJiu){
                let after1=''
                let after2=''
                let n1 = quest.Num;
                let n1Str:string=''+n1
                let n2 = base.TargetNum;
                let n2Str:string=''+n2
                if(base.TargetType==TaskTargetType.SysUsedGold){
                    if(n1>=1000){
                        after1='千万'
                        n1 = (n1/100>>0)/10
                    }else{
                        after1='万'
                    }
                    if(n2>=1000){
                        after2='千万'
                        n2 = n2/1000
                    }else{
                        after2='万'
                    }
                    n1Str = `${n1.toLocaleString()}`
                    n2Str = `${n2.toLocaleString()}`
                }else if(base.TargetType==TaskTargetType.SysUsedDia){
                    if(n1>=10000){
                        after1='万钻'
                        n1 = (n1/1000>>0)/10
                    }else{
                        after1='钻'
                    }
                    if(n2>=10000){
                        after2='万钻'
                        n2 = n2/10000
                    }else{
                        after2='钻'
                    }
                    n1Str = `${n1.toLocaleString()}`
                    n2Str = `${n2.toLocaleString()}`
                }else if(base.TargetType==TaskTargetType.SysUsedMuPoint){
                    if(n1>=10000){
                        after1='万点'
                        n1 = (n1/1000>>0)/10
                    }else{
                        after1='点'
                    }
                    if(n2>=10000){
                        after2='万点'
                        n2 = n2/10000
                    }else{
                        after2='点'
                    }
                    n1Str = `${n1.toLocaleString()}`
                    n2Str = `${n2.toLocaleString()}`
                }else if(base.TargetType==TaskTargetType.HcPetNum){
                    after1=after2='件'
                }else if(base.TargetType==TaskTargetType.ReachLevel||base.TargetType==TaskTargetType.ReachDsLevel){
                    if(n1>400){
                        n1Str = `${n1-400}转`
                    }else{
                        n1Str = `${n1}级`
                    }
                    if(n2>400){
                        n2Str = `${n2-400}转`
                    }else{
                        n2Str = `${n2}级`
                    }
                }
                needStr += ` (${n1Str}${after1}/${n2Str}${after2})`
            }else{
                needStr += `x${base.TargetNum}`
            }
        }
        rich.getComponent(RichTextHandler).data=obj
        let names = Tools.getRewardsStr(base.RewardItems,obj,base)
        let sj=''
        if(names.length>1){
            if(taskType==TaskType.ChengJiu){
                //
            }else if(GD.role.hasGoldYk(false)){
                sj=`<color=${ct.light_gray}>以下随机1种(25%,25%,25%,25%)</><br/>  `
            }else{
                sj=`<color=${ct.light_gray}>以下随机1种(40%,30%,20%,10%)</><br/>  `
            }
        }
        let submit=''
        if(taskType==TaskType.Circle){
            submit='提交 '
        }
        let reward = `<color=${ct.green}>【任务奖励】</>${sj}${names.join(' ')}`
        let targetStr = `<color=${ct.blue}>【任务需求】</>${submit}${needStr}<br/>${reward}`
        if(taskType==TaskType.Day||taskType==TaskType.ChengJiu){
            rich.string = targetStr
        }else{
            let lastReward = GD.CircleQuestLvRewards.get(quest.QuestLv);
            let lastStrs=[]
            lastReward.forEach((list,rate)=>{
                lastStrs.push(`   <color=${ct.brown}>${rate}%概率：</>${Tools.getRewardsStr(list,obj,base).join('、')}`)
            })
            lastStrs.sort()
            rich.string = `<color=${ct.brown}>当前第${quest.JF+1}轮第${quest.Step+1}次委托任务（任务难度级别：${quest.QuestLv}）累积剩余${quest.Count}次</><br/>${targetStr}<br/><br/><color=${ct.brown}><br/><br/><br/><br/><br/><br/><br/>==============【完成本轮额外奖励】==============<br/></>一、黄金月卡专属额外奖励：<br/>   <color=${ct.brown}>10%概率：</><color=${ct.blue}>幸运宝石x1</><br/>   <color=${ct.brown}>90%概率：</><color=${ct.blue}>技能书页x1</><br/>二、随机奖励：以下所有奖励中的1种道具<br/>${lastStrs.join('<br/>')}`
        }
    }
    initData(data: any): void {
        if(data!==null&&data>=0){
            this.tab.select(data)
        }else{
            let today = ((Date.now()/1000/60 + 480) / 1440)>>0
            if(GD.role.ResetDayData==null||GD.role.ResetDayData.DayQuests.some(q=>{return q.ResetDay!=today})){
                WS.send(MT.GetQuestData,GD.EmptyRequestBuff)
            }else{
                this.show()
            }
        }
    }
    show(){
        let i = this.tab.selectedIndex;
        this.tab.select(i>=0?i:0)
    }
    updateCircleQuest(){
        this.curSubmitEquipUid=null
        let show:boolean=false
        let quest=GD.role.ResetDayData.CircleQuest
        if(quest){
            if(quest.TaskId!=-1){
                show=true
                this.renderRichText(this.circleRich,quest,TaskType.Circle)
                let base:QuestData = GD.QuestDatas.get(GD.role.ResetDayData.CircleQuest.TaskId)
                if(base){
                    let isNeedItem = base.EquipPros.length==0
                    this.circleNeedFrame.node.active= !isNeedItem;
                    this.hasNeedLabel.node.active=isNeedItem;
                    if(isNeedItem){
                        let id=base.TargetId
                        let name = GD.ItemBaseDatas.get(id).Name
                        let item = GD.role.BagItems.find(item1=>{return item1.Id==id})
                        let can = false
                        let num = 0
                        if(item){
                            can = item.Num>=base.TargetNum
                            num = item.Num;
                        }
                        this.hasNeedLabel.string=`背包：<color=${Tools.getItemColor(id)}>${name}</>x${num} (<color=${can?ct.green:ct.red}>${can?'可完成':'道具不足'}</color>)`
                    }else{
                        this.circleNeedFrame.node.children[0].active=true;
                        this.circleNeedFrame.node.children[1].getComponent(Sprite).spriteFrame =null
                        this.circleNeedFrame.node.children[2].getComponent(Label).string=''
                        this.circleNeedFrame.spriteFrame = this.defaultSp;
                        this.autoSelect();
                    }
                }
            }
            // this.countLabel.node.active=true
            // this.countLabel.string=`累积剩余${quest.Count}次`
        }
        // else{
        //     this.countLabel.string='委托任务100级开放'
        // }
        this.circleRich.node.parent.active=show;
        this.noQuestBox.active=!show;
        this.startCircleBtn.active=GD.role.hasEnoughLv(100,false);
    }
    onHide(): void {
        this.circleRich.string=''
    }
}


