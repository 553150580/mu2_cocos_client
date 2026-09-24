import { _decorator, Label, Node, randomRange, RichText, Toggle, ToggleContainer, UITransform, Widget } from 'cc';
import { ViewStack } from '../UiComps/ViewStack';
import { Tab } from '../UiComps/Tab';
import { BasePage } from './BasePage';
import Tools from '../base/tools';
import GD from '../base/GameData';
import { BaseYkInfo, BaseYkInfoYkMode, GoldYkInfo, PrivateLineKaInfo, xuYuanAdvanceInfo, xuYuanNormalInfo } from '../base/consts';
import { AtkZyTypes, BoxMsg, ct, DefZyTypes, JfReward, MiniRoleInfo, PopViewType, RewordNameObj, WingZyTypes, WorldBossKilledObj } from '../base/types';
import { UIMgr } from '../managers/UIMgr';
import WS from '../base/net';
import { ConfigType, Err, MT } from '../base/MT';
import { List } from '../UiComps/List';
import { ShowItemType } from './PopView';
import { SDK } from '../base/SDK';
const { ccclass, property } = _decorator;

@ccclass('FuLiPage')
export class FuLiPage extends BasePage {
    @property(ViewStack)
    viewStack:ViewStack;
    @property(Tab)
    tab:Tab;

    @property(Tab)
    xyTab:Tab;
    @property(Tab)
    xyNumTab:Tab;
    @property(Label)
    xyName:Label;
    @property(RichText)
    xyInfoRich:RichText;
    @property(RichText)
    xyOldRich:RichText;
    @property(RichText)
    xyDiaRich:RichText;
    @property(List)
    xyHisList:List;
    @property(RichText)
    xyNum:RichText;
    @property(Node)
    xyBtn:Node;
    @property(Node)
    xyBiXyBtn:Node;
    @property(Label)
    xyNeed:Label;

    @property(Tab)
    ykTab:Tab;
    @property(Label)
    ykName:Label;
    @property(RichText)
    ykTime:RichText;
    @property(RichText)
    ykRich:RichText;
    @property(Node)
    buyYkBtn:Node;
    // @property(Label)
    // priceBase:Label;
    // @property(Label)
    // ykPrice0:Label;
    // @property(Label)
    // ykPrice1:Label;
    @property(Tab)
    priceTab:Tab;
    // @property(Toggle)
    // priceToggle0:Toggle;
    // @property(Toggle)
    // priceToggle1:Toggle;
    @property(List)
    ljList:List;
    @property(Node)
    ljLabel:Node;
    @property(List)
    bossList:List;

    @property(Tab)
    phTab:Tab;
    @property(ViewStack)
    phViewStack:ViewStack;
    @property(Tab)
    roleTypeTab:Tab;
    @property(List)
    lvList:List;
    @property(Tab)
    cjTypeTab:Tab;
    @property(List)
    cjList:List;
    @property(Node)
    prePage:Node;
    @property(Node)
    nextPage:Node;
    @property(Label)
    page:Label;
    @property(Label)
    info1:Label;

    pageNum:number=1;
    totalPageNum:number=1;
    lvPhStepStr1:string='入榜即可领取奖励'
    lvPhStepStr0:string='入榜即可领取奖励\n(每个账号只能入榜1个角色)\n(队伍成员均为同账号时经验+5%)'
    lvPhStepStr2:string='仅排名，无奖励\n每隔5分钟重排名次'
    curCjPhDatas:Array<MiniRoleInfo>=[];//冲级排行每页10个
    ykPrice0:string
    ykPrice1:string
    ykPrice2:string

    static I:FuLiPage
    onLoad(): void {
        FuLiPage.I=this;
        super.onLoad();
        this.tab.selectedHandler=(node:Node,index:number)=>{
            this.viewStack.selectedIndex=index;
            if(index==0){
                this.xyTab.select(0)
            }else if(index==1){
                let labels:string
                if(GD.role.data.IsYkMode){
                    labels='永久特权卡,黄金卡'
                }else{
                    if(GD.role.hasBaseYk(false)){
                        labels='特权卡,黄金卡,专属线路'
                    }else{
                        labels='特权卡,黄金卡'
                    }
                }
                this.ykTab.labels=labels;
                this.ykTab.select(0)
            }else if(index==2){
                if(GD.role.data.IsYkMode){
                    this.ljLabel.active=true
                    this.ljList.array=[]
                }else{
                    this.ljLabel.active=false
                    this.ljList.array=GD.JfRewardList
                }
                GD.playClickSound()
            }else if(index==3){
                this.getKillList();
                GD.playClickSound()
            }else if(index==4){
                this.lvList.array=[];
                this.pageNum=1;
                this.page.string='1/1'
                this.phTab.select(0)
            }
        }
        this.xyBtn.on(Node.EventType.TOUCH_END,()=>{
            this.tryXy(this.xyTab.selectedIndex)
        })
        this.xyBiXyBtn.on(Node.EventType.TOUCH_END,()=>{
            this.tryXy(2) //许愿币许愿
        })
        this.xyTab.selectedHandler=(node:Node,index:number)=>{
            let need='免费'
            let name='普通许愿'
            let info=''
            let x=0
            this.xyNumTab.node.active=index==1;
            if(index==0){
                info=xuYuanNormalInfo
            }else {
                this.xyNumTab.select(0)
                info=xuYuanAdvanceInfo
                need='每次需要：钻石x100'
                name='高级许愿'
                x=120
            }
            this.xyBtn.x=x;
            this.xyBiXyBtn.active=index==1;
            this.xyInfoRich.string=info;
            this.xyName.string=name;
            this.xyNeed.string=need;
            this.xyOldRich.string=''
            this.xyHisList.array=[]
            this.getXyData(index)
            GD.playClickSound()
        }
        this.xyHisList.cellRender=(node:Node,index:number)=>{
            let his:string = this.xyHisList.array[index]
            node.children[0].getComponent(RichText).string=his;
        }
        this.ykTab.selectedHandler=(node:Node,index:number)=>{
            // this.priceTab.node.active=index>0;
            // this.priceBase.string=''
            if(index==0){
                this.renderBaseYk();
            }else if(index==1){
                this.renderGoldYk();
            }else if(index==2){
                this.renderLineYk();
            }
            GD.playClickSound()
        }
        this.buyYkBtn.on(Node.EventType.TOUCH_END,()=>{
            let ykType = this.ykTab.selectedIndex
            let time:string
            let t=this.priceTab.selectedIndex;
            if(ykType==0){
                // time = this.priceBase.string;
                if(t==0){
                    time=this.ykPrice0
                }else if(t==1){
                    time=this.ykPrice1
                }
            }else{
                if(GD.role.hasBaseYk()){
                    if(t==0){
                        time=this.ykPrice0
                    }else if(t==1){
                        time=this.ykPrice1
                    }else if(t==2){
                        time=this.ykPrice2
                    }
                }else{
                    return
                }
            }
            UIMgr.I.PopView.showMsgBox([new BoxMsg(`\n购买：${this.ykNameList[ykType]}\n${time}`,ct.brown)],'购买',FuLiPage.I.buyYk,'取消')
        },this);
        this.ljList.cellRender=(node:Node,index:number)=>{
            let reward:JfReward = this.ljList.array[index]
            let btn = node.children[3];
            btn.off(Node.EventType.TOUCH_END)
            let str:string
            let showBtn:boolean=false;
            let color:ct
            let myJf = GD.role.Jf;
            let myGotIndex = GD.role.gotJfIndex;
            if(myJf>=reward.Jf){
                if(index==myGotIndex){
                    showBtn=true;
                    str='领取'
                    color=ct.green
                    btn.on(Node.EventType.TOUCH_END,(event:any)=>{
                        const hasSelectBox=reward.Rewards.some(v=>{
                            const id = v[0];
                            return id>=57&&id<=68
                        })
                        if(hasSelectBox){
                            let obj:RewordNameObj;
                            reward.Rewards.forEach(v=>{
                                const id = v[0];
                                if(id>=57&&id<=68){
                                    obj=Tools.getRewordsSelectBoxItemNames(id,false)
                                }
                            })
                            if(obj){
                                UIMgr.I.PopView.showSelectBox(obj,(index:number,zyTypeIndex:number)=>{
                                    //zyTypeIndex：1表示防御卓越属性类型，2表示攻击卓越属性类型
                                    let zyType:number=0 
                                    if(obj.zyType>0){
                                        if(obj.zyType==1){
                                            zyType = DefZyTypes[zyTypeIndex]
                                        }else{
                                            zyType = AtkZyTypes[zyTypeIndex]
                                        }
                                    }
                                    this.getJfReward(obj.idList[index],zyType)
                                });
                            }
                        }else{
                            this.getJfReward(0,0)
                        }
                    },this);
                }else if(index>myGotIndex){
                    str='已达成'
                    color=ct.brown
                    showBtn=true
                }
            }else{
                str='未达成'
                color=ct.gray
                showBtn=true
            }
            if(showBtn){
                let btnLabel = btn.children[0].getComponent(Label)
                btnLabel.string=str
                btnLabel.color.fromHEX(color)
            }
            btn.active=showBtn;
            let rich = node.children[1].getComponent(RichText);
            rich.string = `累计充值积分<color=${ct.brown}>满${reward.Jf}</>奖励（<color=${ct.green}>${GD.role.Jf}</>/<color=${ct.brown}>${reward.Jf}</>）：`
            let itemList = node.children[2].getComponent(List);
            let items=[]
            const len = reward.Rewards.length
            if(len>0){
                reward.Rewards.forEach(v=>{
                    const id = v[0]
                    const num = v[1]
                    const item = outer_pb.MailItem.create()
                    let equip:outer_pb.IEquip;
                    if(id<10000){
                        item.Type=1
                        color=Tools.getItemColor(id)
                    }else{
                        equip = outer_pb.Equip.create()
                        equip.Id=id
                        equip.Lv=0
                        equip.Exp=0
                        if(id==220000){
                            equip.YsList=[5,0] //勋章：随机属性类型、元素类型
                        }
                        item.Type=0
                        color=ct.purple
                    }
                    item.Id=id
                    item.Num=num
                    item.Equip=equip;
                    items.push(item)
                })
            }
            itemList.cellRender=(node:Node,index:number)=>{
                const item:outer_pb.MailItem = itemList.array[index];
                if(item.Type==0){
                    Tools.renderBagItem(0,item.Equip,node)
                }else{
                    Tools.renderBagItem(1,item,node)
                }
            };
            itemList.selectedHandler=(node:Node,index:number)=>{
                const item:outer_pb.MailItem = itemList.array[index];
                if(item.Type==0){
                    UIMgr.I.PopView.show(0,item.Equip,false,ShowItemType.Equip)
                }else{
                    UIMgr.I.PopView.show(0,item,false,ShowItemType.Item)
                }
            }
            itemList.array=items;
            itemList.node.getComponent(UITransform).width=len*70+(len-1)*5;
        }
        this.bossList.cellRender = (node:Node,index:number)=>{
            let boss:WorldBossKilledObj = this.bossList.array[index];
            let name = node.children[0].getComponent(Label)
            let nameStr = `Lv.${boss.data.Lv} 史诗 ${boss.data.Name}`;
            let nameColor=ct.red;
            let state = node.children[1].getComponent(Label)
            let stateStr='未被击杀'
            let stateColor=ct.brown;
            if(boss.killerId>0){
                nameColor=ct.gray
                stateColor=ct.gray;
                stateStr=`首杀【${boss.killerName}】`
            }
            state.string=stateStr;
            state.color.fromHEX(stateColor);
            name.string=''
            name.string=nameStr;
            name.color.fromHEX(nameColor);
            //已击杀且未领取时，才显示“可领取”
            let has=GD.role.MyWorldBossKillDatas.get(boss.data.Id);
            node.children[2].active = has===false;
        }
        this.bossList.selectedHandler = (node:Node,index:number)=>{
            let boss:WorldBossKilledObj = this.bossList.array[index];
            //首杀归属奖励：祝福宝石xN+灵魂宝石xN（N=BOSS等级/10，小数部分不计）
            //其它名次奖励：钻石xBOSS等级
            const base = boss.data;
            let num=base.Lv/10>>0;
            if(GD.role.data.IsYkMode){
                num-=2
            }
            let msg=`<color=${ct.red}>史诗 ${base.Name}</><br/><br/>=======全服首杀归属奖励=======<br/><color=${ct.yellow}>祝福宝石x${num}、灵魂宝石x${num}</><br/><br/>=======其它名次个人首杀奖励=======<br/><color=${ct.qing}>钻石x${base.Lv/GD.role.data.DiaRate>>0}</>`
            let okBtnStr='';
            let cb:()=>void
            //判断是否已击杀且未领取
            if(GD.role.MyWorldBossKillDatas.has(boss.data.Id)){
                if(GD.role.MyWorldBossKillDatas.get(boss.data.Id)){
                    okBtnStr='已领取'
                }else{
                    okBtnStr='领取'
                    cb=()=>{
                        this.tryGetFirstKillReward(boss.data.Id)
                    }
                }
            }else{
                okBtnStr='您未击杀'
            }
            UIMgr.I.PopView.showMsgBox([new BoxMsg(msg,ct.white)],okBtnStr,cb,'返回')
        }
        this.bossList.array=GD.WorldBossKillerDatas;
        //===========排行==========
        for(let i=0;i<10;i++){
            this.curCjPhDatas.push({Name:'',Id:0,Sort:i})
        }
        this.phTab.selectedHandler=(node:Node,index:number)=>{
            let str=''
            if(index==0){
                this.cjTypeTab.select(0)
                this.phViewStack.selectedIndex=0;
                if(GD.role.data.IsByAccount){
                    str=this.lvPhStepStr0;
                }else{
                    str=this.lvPhStepStr1
                }
            }else {
                this.phViewStack.selectedIndex=1;
                str=this.lvPhStepStr2;
                if(GD.role.hasEnoughLv(220)){
                    this.roleTypeTab.select(0)
                }else{
                    this.lvList.array=[];
                }
            }
            this.info1.string=str
        }
        this.prePage.on(Node.EventType.TOUCH_END,()=>{
            if(this.pageNum>1){
                this.pageNum--
                this.getLvPh()
            }
            GD.playClickSound()
        })
            this.nextPage.on(Node.EventType.TOUCH_END,()=>{
            if(this.pageNum<this.totalPageNum){
                this.pageNum++
                this.getLvPh()
            }
            GD.playClickSound()
        })
        this.roleTypeTab.selectedHandler=(node,index)=>{
            this.pageNum=1
            if(this.phTab.selectedIndex==0||GD.role.hasEnoughLv(220)){
                this.getLvPh()
            }
            GD.playClickSound()
        }
        this.cjTypeTab.selectedHandler=(node,index)=>{
            this.pageNum=1
            this.getLvPh()
            GD.playClickSound()
        }
        this.lvList.cellRender=(node,index)=>{
            let info:outer_pb.ILvPhInfo=this.lvList.array[index]
            let sortLabel=node.children[0].getComponent(Label);
            sortLabel.string=`第${info.Sort+1}名`
            let zm=''
            if (info.Zm !=''){
                zm = `[${info.Zm}] `
            }
            let nameLabel = node.children[1].getComponent(Label);
            nameLabel.string=`${zm}${info.Name}`
            let lv:string
            if(this.phTab.selectedIndex==1){
                if(info.ZsNum>0){
                    lv=`${info.ZsNum}转${info.Lv}级`
                }else{
                    lv=`${info.Lv}级`
                }
            }else{
                lv=`大师${info.DsLv}级`
            }
            let lvLabel=node.children[2].getComponent(Label)
            lvLabel.string=''
            lvLabel.string=lv
            let color=ct.white
            if(info.Sort==0){
                color=ct.red
            }else if(info.Sort==1){
                color=ct.yellow
            }else if(info.Sort==2){
                color=ct.green
            }else if(info.Sort<10){
                color=ct.blue
            }
            nameLabel.color.fromHEX(color)
            sortLabel.color.fromHEX(color) 
            lvLabel.color.fromHEX(color)
        }
        this.lvList.selectedHandler=(node:Node,index:number)=>{
            let info=this.lvList.array[index]
            UIMgr.I.PopView.show(1,info,false)
        } 
    }
    getKillList=()=>{
        WS.send(MT.GetFirstKillWorldBoss,GD.EmptyRequestBuff,(d:any)=>{
            let rsp = outer_pb.WorldBossFirstKill.decode(d)
            // for(let idStr in rsp.List){
            //     const id = parseInt(idStr)
            //     let obj = GD.WorldBossKillerDatas.find(o=>{return o.data.Id==id;})
            //     if(obj){
            //         let d=rsp.List[idStr]
            //         obj.killerId=d.Id
            //         obj.killerName=d.Name
            //     }else{
            //         obj.killerId=0
            //         obj.killerName=""
            //     }
            // }
            GD.WorldBossKillerDatas.forEach(obj=>{
                let data=rsp.List[obj.data.Id]
                if(data){
                    obj.killerId=data.Id
                    obj.killerName=data.Name
                }else{
                    obj.killerId=0
                    obj.killerName=""
                }
            })
            for(let idStr in rsp.MyList){
                const id = parseInt(idStr)
                GD.role.MyWorldBossKillDatas.set(id,rsp.MyList[idStr])
            }
            this.bossList.refresh();
        })
    }
    tryGetFirstKillReward=(id:number)=>{
        let req = outer_pb.MailAct.create();
        req.Id=id;
        let buff = outer_pb.MailAct.encode(req).finish();
        WS.send(MT.GetFirstKillWorldBossReword,buff,(d:any)=>{
            let rsp = outer_pb.MailAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                
                if(rsp.Items){
                    GD.role.getItems(rsp.Items,true,false,'领取奖励')
                    // for(let idStr in rsp.Items){
                    //     let id = parseInt(idStr)
                    //     let num = rsp.Items[idStr]
                    //     GD.role.getItem(id,num,true,false,'领取奖励')
                    // }
                }
                if(rsp.Equips.length>0){
                    rsp.Equips.forEach(equip=>{
                        GD.role.getEquip(equip,true)
                    })
                }
                GD.role.MyWorldBossKillDatas.set(id,true)
                this.bossList.refresh();
                UIMgr.I.tip('领取成功',ct.green)
            }else{
                UIMgr.I.tip('获取失败')
            }
        })
    }
    getJfReward=(id:number,zyType:number)=>{
        let req = outer_pb.JfAct.create();
        req.Id=id;//选择的自选道具的id（如果有）
        req.Type=zyType;
        let buff = outer_pb.JfAct.encode(req).finish();
        WS.send(MT.GetMyJfReword,buff,(d:any)=>{
            let rsp = outer_pb.JfAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                let msglist:Array<BoxMsg>=[]
                msglist.push(new BoxMsg('获得累计奖励<br/>',ct.white))
                if(rsp.Items){
                    for(let i in rsp.Items){
                        let id = parseInt(i)
                        let num = rsp.Items[i]
                        msglist.push(GD.role.getItem(id,num,true,false,'',true))
                    }
                }
                if(rsp.Equips.length>0){
                    rsp.Equips.forEach(equip=>{
                        msglist.push(GD.role.getEquip(equip,true,true))
                    })
                }
                if(msglist.length>0){
                    UIMgr.I.PopView.showMsgBox(msglist)
                }
                if(rsp.GotJf>0)GD.role.data.GotJf=rsp.GotJf;
                GD.role.Jf=rsp.Jf
                GD.role.gotJfIndex=rsp.GotIndex
                this.ljList.refresh();
                UIMgr.I.tip('领取成功',ct.green)
            }else{
                UIMgr.I.tip('积分不足')
            }
        })
    }
   
    ykNameList:Array<string>=['【特权卡】','【黄金卡】','【专属线路卡】']
    buyYk=()=>{
        let ykType = this.ykTab.selectedIndex
        // let ykLong = this.priceToggle0.isChecked ? 0:1;
        let timeType = this.priceTab.selectedIndex
        let id=0;
        if(ykType==0){
            //特权卡
            if(timeType==0){
                id=55 //1月
            }else{
                if(GD.role.data.IsYkMode){
                    id=87 //永久
                }else{
                    id=9 //1年
                }
            }
        }else if(ykType==1){
            //黄金卡
            if(timeType==0){
                id=10 //1月
            }else{
                id=48 //1年
            }
        }else if(ykType==2){
            //专属线路卡
            if(timeType==0){
                id=11 //1周
            }else if(timeType==1){
                id=12 //1月
            }else{
                id=86 //1年
            }
        }
        let price=0
        let ka=GD.shopItems.get(id)
        if(GD.role.data.IsYkMode){
            price = ka.PriceYk
        }else{
            price = ka.Price
        }
        if(GD.role.hasEnoughMuPoint(price)==false){
            this.scheduleOnce(()=>{
                UIMgr.I.PopView.show(PopViewType.PayBox,null,false,0,'',SDK.doTryPay)
            },0)
            return
        }
        let req = outer_pb.NpcShopAct.create();
        req.Id = id
        req.Num=1;
        let buff = outer_pb.NpcShopAct.encode(req).finish();
        WS.send(MT.BuyYk,buff,(d:any)=>{
            let rsp = outer_pb.NpcShopAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success&&rsp.Id>0){
                if(rsp.BasePros){
                    UIMgr.I.resetRoleBasePros(rsp.BasePros)
                }
                GD.role.reduceMuPoint(rsp.Cost);
                if(rsp.Items){
                    GD.role.getItems(rsp.Items,true,true)
                }
                GD.role.addVipTime(rsp.Id,rsp.BaseYk,rsp.GoldYk)
                UIMgr.I.tip('购买成功',ct.green)
                this.ykTab.select(this.ykTab.selectedIndex)
            }else{
                UIMgr.I.tip('购买失败')
            }
        })
    }
    getXyData=(index:number)=>{
        let req = outer_pb.XuYuanAct.create();
        req.Type=index;
        let buff = outer_pb.XuYuanAct.encode(req).finish();
        WS.send(MT.GetXuYuanData,buff,(d:any)=>{
            let rsp = outer_pb.XuYuanAct.decode(d);
            let n = 10
            if(index==1){
                n=20
            }
            this.xyOldRich.string=`昨日幸运儿(一等奖)：<color=${ct.blue}>${rsp.OldName}</> 中奖钻石：<color=${ct.qing}>${rsp.OldDia}</><br/>昨日幸运儿(二等奖)：<color=${ct.blue}>${rsp.OldName1}</> 奖励：许愿币x${n}</><br/>昨日幸运儿(三等奖)：<color=${ct.blue}>${rsp.OldName2}</> 奖励：许愿币x${n/2}</>`
            this.xyDiaRich.string=`当前奖池钻石：<color=${ct.qing}>${rsp.CurDia}</>`
            this.xyHisList.array=rsp.History;
            this.xyHisList.list.scrollToBottom();
            if(req.Type==0){
                this.xyNum.string=`剩余许愿次数：${rsp.Num}<br/><color=${ct.gray}>(黄金卡每日次数=${GD.configs.get(ConfigType.GoldYkNormalXuYuanDayNum)})</>`
                GD.role.NormalXyNum=rsp.Num
            }else{
                this.xyNum.string=`今日已许愿${rsp.Num}次（预计中幸运儿奖概率：${(rsp.Rate*1000>>0)/10}%）<br/>再许愿${300-rsp.GetPetNum}次必得宠物`
                // this.xyNum.string=`今日已许愿${rsp.Num}次`
            }
        })
    }
    tryXy=(type:number)=>{
        if(GD.role.canPlay()==false)return
        if(GD.role.hasEnoughLv(GD.configs.get(ConfigType.ActiveLv_Hole))==false)return;
        if(type==0&&GD.role.NormalXyNum==0){
            UIMgr.I.tip('剩余许愿次数不足')
            return;
        }
        const n=this.xyNumTab.selectedIndex;
        let num=1;
        if(n==0||type==0){
            num=1
        }else if(n==1){
            num=10
        }else if(n==2){
            num=50
        }
        if(type==1&&GD.role.hasEnoughDia(100*num)==false)return;
        if(type==2&&GD.role.hasEnoughItem(56,num)==false)return;
        let req = outer_pb.XuYuanAct.create();
        req.Type=type;
        req.Num=num;
        let buff = outer_pb.XuYuanAct.encode(req).finish();
        WS.send(MT.TryXuYuan,buff,(d:any)=>{
            let rsp = outer_pb.XuYuanAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                this.xyDiaRich.string=`当前奖池钻石：<color=${ct.qing}>${rsp.CurDia}</>`
                this.xyHisList.array=rsp.History;
                this.xyHisList.list.scrollToBottom();
                if(req.Type==0){
                    this.xyNum.string=`剩余许愿次数：${rsp.Num}`
                    GD.role.NormalXyNum=rsp.Num
                }else{
                    this.xyNum.string=`今日已许愿${rsp.Num}次（预计中幸运儿一等奖概率：${(rsp.Rate*1000>>0)/10}%）<br/>再许愿${300-rsp.GetPetNum}次必得宠物`
                    // this.xyNum.string=`今日已许愿${rsp.Num+1}次`
                }
                GD.role.getItems(rsp.Items,true,false,'许愿')
                for(let uid in rsp.Equips){
                    let equip = rsp.Equips[uid]
                    GD.role.getEquip(equip,true)
                }
                // if(rsp.Item) GD.role.getItem(rsp.Item.Id,rsp.Item.Num,true,true);
                // if(rsp.Equips) GD.role.getEquip(rsp.Equip,true)
                
                if(rsp.DelItem){
                    GD.role.reduceItem(rsp.DelItem.Id,rsp.DelItem.Num)
                }
            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughDia){
                UIMgr.I.tip('钻石不足')
            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughItem){
                UIMgr.I.tip('许愿币不足')
            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughLv){
                UIMgr.I.tip('等级不足')
            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughNum){
                UIMgr.I.tip('剩余次数不足')
            }else{
                UIMgr.I.tip('许愿失败')
            }
        })
    }
    renderBaseYk=()=>{
        this.buyYkBtn.active=GD.role.data.BaseYk<Tools.getBeiJingSecond()+60*60*24*365*50
        this.ykName.string=this.ykNameList[0]
        this.ykName.color.fromHEX(ct.brown)
        this.ykTime.string=Tools.getYkTimeString(GD.role.data.BaseYk,true)
        let price=0
        let ka=GD.shopItems.get(55)
        let info=''
        let wid=this.priceTab.getComponent(Widget)
        wid.top=800
        if(GD.role.data.IsYkMode){
            price = ka.PriceYk
            info = BaseYkInfoYkMode
            wid.left=80
        }else{
            wid.left=180
            price = ka.Price
            info = BaseYkInfo
        }
        this.ykRich.string = info
        this.ykPrice0 = `价格:${price}点/月`
        if(GD.role.data.IsYkMode){
            this.ykPrice1 = `特价:${GD.shopItems.get(87).PriceYk}点/永久（购买后永久生效）`
        }else{
            this.ykPrice1 = `特价:${GD.shopItems.get(9).Price}点/年`
        }
        this.priceTab.labels=`${this.ykPrice0},${this.ykPrice1}`
        let i=this.priceTab.selectedIndex;
        this.priceTab.select(i<0?0:i)
    }
    renderGoldYk=()=>{
        this.buyYkBtn.active=true
        this.ykName.string=this.ykNameList[1]
        this.ykName.color.fromHEX(ct.brown)
        this.ykTime.string=Tools.getYkTimeString(GD.role.data.GoldYk,true)
        let price=0
        let ka=GD.shopItems.get(10)
        if(GD.role.data.IsYkMode){
            price = ka.PriceYk
        }else{
            price = ka.Price
        }
        this.ykRich.string = `${GoldYkInfo}<br/><color=${ct.red}>黄金卡性价高，适合懒得玩多个小号的玩家</><br/><color=${ct.blue}>黄金卡价格以当前价格为准</>`
        this.ykPrice0 = `特价:${price}点/月，送许愿币x${price}`
        ka=GD.shopItems.get(48)
        if(GD.role.data.IsYkMode){
            price = ka.PriceYk
        }else{
            price = ka.Price
        }
        this.ykPrice1 = `特价:${price}点/年，送许愿币x${price}`
        this.priceTab.labels=`${this.ykPrice0},${this.ykPrice1}`
        let i=this.priceTab.selectedIndex;
        this.priceTab.select(i<0?0:i)
        let wid=this.priceTab.getComponent(Widget)
        wid.top=830
        wid.left=100
    }
    renderLineYk=()=>{
        this.buyYkBtn.active=true
        this.ykName.string=this.ykNameList[2]
        this.ykName.color.fromHEX(ct.purple)
        this.ykTime.string=`<color=${ct.gray}>在线路界面查看到期时间</>`
        // this.ykTime.string=Tools.getYkTimeString(GD.role.data.GoldYk,true)
        this.ykRich.string = `${PrivateLineKaInfo}<br/><color=${ct.red}>小号越多，专属线路的性价比越高</><br/><color=${ct.blue}>点数可通过在钻石交易行出售钻石来赚取</>`
        let price=0
        let ka=GD.shopItems.get(11)
        if(GD.role.data.IsYkMode){
            price = ka.PriceYk
        }else{
            price = ka.Price
        }
        this.ykPrice0 = `价格：${price}点/周（按7天计，送许愿币x${price})`
        ka=GD.shopItems.get(12)
        if(GD.role.data.IsYkMode){
            price = ka.PriceYk
        }else{
            price = ka.Price
        }
        this.ykPrice1 = `特价：${price}点/月（按30天计，送许愿币x${price})`
        ka=GD.shopItems.get(86)
        if(GD.role.data.IsYkMode){
            price = ka.PriceYk
        }else{
            price = ka.Price
        }
        this.ykPrice2 = `特价：${price}点/年（按365天计，送许愿币x${price})`
        this.priceTab.labels=`${this.ykPrice0},${this.ykPrice1},${this.ykPrice2}`
        let i=this.priceTab.selectedIndex;
        this.priceTab.select(i<0?0:i)
        let wid=this.priceTab.getComponent(Widget)
        wid.top=780
        wid.left=20
    }
    initData(data: any=0): void {
        this.ljList.array=[]
        WS.send(MT.GetMyJf,GD.EmptyRequestBuff,(d:any)=>{
            let rsp = outer_pb.JfAct.decode(d)
            GD.role.Jf=rsp.Jf
            GD.role.gotJfIndex=rsp.GotIndex
            GD.role.data.BaseYk=rsp.BaseYk
            GD.role.data.GoldYk=rsp.GoldYk
            this.tab.select(data)
        })
    }
    //=========排行=====
    getCjReward=(id:number,zyType:number)=>{
        let req = outer_pb.JfAct.create();
        req.Id=id;//选择的自选道具的id（如果有）
        req.Type=zyType;
        req.GotIndex=this.cjTypeTab.selectedIndex;//哪个等级的排行奖励
        let buff = outer_pb.JfAct.encode(req).finish();
        WS.send(MT.GetMyFirstLvReword,buff,(d:any)=>{
            let rsp = outer_pb.JfAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                let msglist:Array<BoxMsg>=[]
                msglist.push(new BoxMsg('获得冲级排行奖励<br/>',ct.white))
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
                if(rsp.Equips.length>0){
                    rsp.Equips.forEach(equip=>{
                        msglist.push(GD.role.getEquip(equip,true,true))
                    })
                }
                if(msglist.length>0){
                    UIMgr.I.PopView.showMsgBox(msglist)
                }
                this.hasGotCurLvCjRewargd=true
                this.cjList.refresh();
                UIMgr.I.tip('领取成功',ct.green)
            }else{
                UIMgr.I.tip('领取失败')
            }
        })
    }
    getLvPh=()=>{
        let req=outer_pb.GetPhAct.create()
        req.Type=this.phTab.selectedIndex
        if(req.Type==0){
            //冲级等级阶段排行
            req.RoleType=this.cjTypeTab.selectedIndex
        }else{
            //职业排行
            req.RoleType=Math.pow(2,this.roleTypeTab.selectedIndex)
        }
        req.Page=this.pageNum;
        let buff = outer_pb.GetPhAct.encode(req).finish()
        WS.send(MT.GetPh,buff,this.onGetPh)
    }
    hasGotCurLvCjRewargd:boolean=false;
    onGetPh=(d:any)=>{
        let rsp = outer_pb.GetPhAct.decode(d)
        if(rsp.ErrCode==Err.ErrCode_Success){
            if(rsp.Type==0){
                this.hasGotCurLvCjRewargd=rsp.HasGot;
                let list = rsp.CjPhList.sort((a,b)=>{return a.Time-b.Time});
                const n=list.length;
                this.curCjPhDatas.forEach((data,index)=>{
                    if(index<n){
                        let info = list[index]
                        data.Name=info.Name;
                        data.Id=info.Id;
                        data.Sort=info.Sort;
                    }else{
                        data.Name=''
                        data.Id=0
                        data.Sort=(this.pageNum-1)*10+index
                    }
                })
                this.cjList.cellRender=this.cjListCellRender;
                this.cjList.array=this.curCjPhDatas;
                this.totalPageNum=5;
            }else{
                this.lvList.array=rsp.LvPhList
                this.totalPageNum=rsp.TotalPage;
            }
            this.pageNum=rsp.Page;
            this.page.string=`${this.pageNum}/${this.totalPageNum}`
        }else{
            UIMgr.I.tip('获取数据失败')
            this.pageNum=1;
        }
    }
    cjListCellRender=(node,index)=>{
        let info:MiniRoleInfo=this.cjList.array[index]
        let sortLabel=node.children[0].getComponent(Label);
        // const sortIndex = (this.pageNum-1)*10+index
        const sort = info.Sort
        sortLabel.string=`第${sort+1}名`

        let nameLabel = node.children[1].getComponent(Label);
        let nameColor=ct.gray;
        let color=ct.white
        if(sort==0){
            color=ct.red
        }else if(sort==1){
            color=ct.yellow
        }else if(sort==2){
            color=ct.brown
        }else if(sort<10){
            color=ct.green
        }else if(sort<30){
            color=ct.blue
        }else {
            color=ct.white
        }
        if(info.Id>0){
            nameColor=color
            nameLabel.string=info.Name
        }else{
            nameColor=ct.gray
            nameLabel.string='虚位以待'
        }
        nameLabel.color.fromHEX(nameColor)
        sortLabel.color.fromHEX(color) 

        let items=[]
        let data = GD.FirstRewardList[sort];
        // console.log('sort',sort,data);
        let rewards=data.Rewards[this.cjTypeTab.selectedIndex];
        const len = rewards.length
        if(len>0){
            rewards.forEach(v=>{
                const id = v[0]
                const num = v[1]
                // let name:string
                const item = outer_pb.MailItem.create()
                let equip:outer_pb.IEquip;
                // let color:ct
                if(id<10000){
                    // name = GD.ItemBaseDatas.get(id).Name
                    item.Type=1
                    // color=Tools.getItemColor(id)
                }else{
                    // name = GD.EquipBaseDatas.get(id).Name
                    equip = outer_pb.Equip.create()
                    equip.Id=id
                    equip.Lv=0
                    equip.Exp=0
                    if(id==220000){
                        equip.YsList=[5,0] //勋章：随机属性类型、元素类型
                    }
                    item.Type=0
                    // color=ct.purple
                }
                item.Id=id
                item.Num=num
                item.Equip=equip;
                items.push(item)
            })
        }
        let itemList = node.children[2].getComponent(List);
        itemList.cellRender=(node:Node,index:number)=>{
            const item:outer_pb.MailItem = itemList.array[index];
            if(item.Type==0){
                Tools.renderBagItem(0,item.Equip,node)
            }else{
                Tools.renderBagItem(1,item,node)
            }
        };
        itemList.selectedHandler=(node:Node,index:number)=>{
            const item:outer_pb.MailItem = itemList.array[index];
            if(item.Type==0){
                UIMgr.I.PopView.show(0,item.Equip,false,ShowItemType.Equip)
            }else{
                UIMgr.I.PopView.show(0,item,false,ShowItemType.Item)
            }
        }
        itemList.array=items;
        let getBtn = node.children[3];
        getBtn.off(Node.EventType.TOUCH_END)
        let str:string
        let showBtn:boolean=false;
        let btnColor:ct=ct.gray;
        if(info.Id==GD.role.data.Id){
            showBtn=true;
            if(this.hasGotCurLvCjRewargd){
                str='已领取'
                btnColor=ct.gray
            }else{
                str='领取'
                btnColor=ct.green
                getBtn.on(Node.EventType.TOUCH_END,(event:any)=>{
                    const hasSelectBox=rewards.some(v=>{
                        const id = v[0];
                        return id>=57&&id<=68
                    })
                    if(hasSelectBox){
                        let obj:RewordNameObj;
                        rewards.forEach(v=>{
                            const id = v[0];
                            if(id>=57&&id<=68){
                                obj=Tools.getRewordsSelectBoxItemNames(id,false)
                            }
                        })
                        if(obj){
                            UIMgr.I.PopView.showSelectBox(obj,(index:number,zyTypeIndex:number)=>{
                                //zyTypeIndex：1表示防御卓越属性类型，2表示攻击卓越属性类型
                                let zyType:number=0 
                                if(obj.zyType>0){
                                    if(obj.zyType==1){
                                        zyType = DefZyTypes[zyTypeIndex]
                                    }else if(obj.zyType==2){
                                        zyType = AtkZyTypes[zyTypeIndex]
                                    }else if(obj.zyType==3){
                                        zyType = WingZyTypes[zyTypeIndex]
                                    }
                                }
                                this.getCjReward(obj.idList[index],zyType)
                            });
                        }
                    }else{
                        this.getCjReward(0,0)
                    }
                },this);
            }
        }
        if(showBtn){
            let btnLabel = getBtn.children[0].getComponent(Label);
            btnLabel.string=str
            btnLabel.color.fromHEX(btnColor)
        }
        getBtn.active=showBtn;
    }
    onHide(): void {
        this.lvList.array=[];
    }
    // cc=(lv:number)=> {
    //     let a=0
    //     for(let i=1;i<=lv;i++){
    //         let n=((i-1)/10>>0);
    //         a+=10+(Math.pow(2,n)-1)*5
    //     }
    //     return a
    // }
}


