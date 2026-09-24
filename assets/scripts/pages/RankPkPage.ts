import { _decorator, Label, Node, RichText } from 'cc';
import { List } from '../UiComps/List';
import { Tab } from '../UiComps/Tab';
import { ViewStack } from '../UiComps/ViewStack';
import { BasePage } from './BasePage';
import WS from '../base/net';
import { ConfigType, Err, MT } from '../base/MT';
import GD from '../base/GameData';
import { UIMgr } from '../managers/UIMgr';
import { BoxMsg, ct, RewordNameObj } from '../base/types';
import Tools from '../base/tools';
import { rankPkInfo } from '../base/consts';
const { ccclass, property } = _decorator;

@ccclass('RankPkPage')
export class RankPkPage extends BasePage {
    @property(Tab)
    tab0:Tab;
    @property(Tab)
    tab1:Tab;
    @property(Label)
    info:Label;
    @property(Node)
    myTeam:Node;
    @property(Label)
    season:Label;
    @property(Label)
    nowS:Label;
    @property(Label)
    num:Label;
    @property(Node)
    allFailed:Node;
    @property(Node)
    pkBtn:Node;
    @property(Label)
    sort1:Label;
    @property(Node)
    getBtn1:Node;
    @property(Label)
    oldS:Label;
    @property(Node)
    getBtn2:Node;
    @property(Node)
    rewardBtn:Node;

    @property(ViewStack)
    view:ViewStack;
    @property(List)
    phList:List;
    @property(List)
    hisList:List;
    @property(Node)
    firstPage:Node;
    @property(Node)
    prePage:Node;
    @property(Label)
    page:Label;
    @property(Node)
    nextPage:Node;
    @property(Node)
    lastPage:Node;

    pageNum:number=1;
    totalPageNum:number=1;
    isKf:boolean=false;//
    needLv:number=220;
    onLoad() {
        super.onLoad();
        this.pkBtn.on(Node.EventType.TOUCH_END,this.tryRankPk)
        this.allFailed.on(Node.EventType.TOUCH_END,this.tryAllFailedRankPk)
        this.rewardBtn.on(Node.EventType.TOUCH_END,this.showRewards)
        this.getBtn1.on(Node.EventType.TOUCH_END,()=>{
            //获取昨日排名奖励0
            this.onGetBtnClick(0)
        })
        this.getBtn2.on(Node.EventType.TOUCH_END,()=>{
            //获取上个赛季排名奖励1
            this.onGetBtnClick(1)
        })
        this.prePage.on(Node.EventType.TOUCH_END,()=>{
            if(this.pageNum>1){
                this.pageNum--
                this.getRankPh()
            }
        })
        this.nextPage.on(Node.EventType.TOUCH_END,()=>{
            if(this.pageNum<this.totalPageNum){
                this.pageNum++
                this.getRankPh()
            }
        })
        this.firstPage.on(Node.EventType.TOUCH_END,()=>{
            if(this.pageNum>1){
                this.pageNum=1
                this.getRankPh()
            }
        })
        this.lastPage.on(Node.EventType.TOUCH_END,()=>{
            if(this.pageNum!=this.totalPageNum){
                this.pageNum=this.totalPageNum
                this.getRankPh()
            }
        })
        this.tab0.selectedHandler=(node:Node,index:number)=>{
            this.isKf=index==1;
            let can=true
            if(this.isKf){
                this.needLv = GD.configs.get(ConfigType.ActiveLvKfRankPk)
                can = GD.role.hasEnoughLv(this.needLv)
            }else{
                this.needLv = GD.configs.get(ConfigType.ActiveLvRankPk)
            }
            if(can){
                this.tab1.select(0)
            }else{
                this.tab0.select(0)
            }
        }
        this.tab1.selectedHandler=(node:Node,index:number)=>{
            let i=0
            this.pageNum=1
            if(index==0){
                this.getMyRankData();
                GD.playClickSound()
            }else if(index==1||index==2){
                this.getRankPh()
                i=1
            }else if(index==3){
                this.getHis()
                i=2
            }else {
                i=3
            }
            this.view.selectedIndex=i
        }
        this.hisList.cellRender=(node:Node,index:number)=>{
            node.children[0].getComponent(RichText).string=this.hisList.array[index].Msg;
        }
        this.phList.cellRender=(node,index)=>{
            let team:outer_pb.ITeamInfo = this.phList.array[index];
            if(!team){
                //防止为空
                team=outer_pb.TeamInfo.create()
            }
            node.children[1].children[0].getComponent(Label).string = `第${index+1+(this.pageNum-1)*5}名`
            Tools.renderTeamRoles(node.children[0],team.OwnerId,team.Menbers)
        }
        this.phList.array=[]
    }
    tryAllFailedRankPk=()=>{
        if(GD.role.hasGoldYk()){
            let myTeam=GD.role.myTeam;
            if(myTeam&&myTeam.Menbers.length==5){
                let totalLv=0
                myTeam.Menbers.forEach(info=>{
                    if(info.ZsNum>0){
                        totalLv+=400
                    }else{
                        totalLv+=info.Lv
                    }
                })
                if((totalLv/5>>0)>=this.needLv){
                    if(GD.role.myPkData&&GD.role.myPkData.PkNum>0){
                        let req=outer_pb.PkAct.create()
                        req.IsKf = this.isKf;
                        let buff = outer_pb.PkAct.encode(req).finish()
                        WS.send(MT.AllFailedRankPk,buff,(d:any)=>{
                            let rsp=outer_pb.PkAct.decode(d);
                            if(rsp.ErrCode==Err.ErrCode_Success){
                                GD.role.myPkData.PkNum = rsp.PkNum
                                GD.role.myPkData.CurSort = rsp.CurSort
                                GD.role.myPkData.MyTeam = rsp.MyTeam
                                this.renderMyRankData();
                                UIMgr.I.tip(`全部认输成功，竞技积分+${rsp.OldJf}`,ct.green)
                            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughNum){
                                UIMgr.I.tip(`队伍成员【${rsp.Who}】剩余挑战次数不足`)
                            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughLv){
                                UIMgr.I.tip(`等级不足`)
                            }else{
                                UIMgr.I.tip('全部认输失败'+rsp.ErrCode)
                            }
                        })
                    }else{
                        UIMgr.I.tip('剩余挑战次数不足')
                    }
                }else{
                    UIMgr.I.tip('您的队伍平均等级不足')
                }
            }else{
                UIMgr.I.tip('您的队伍人数不足5人')
            }
        }
    }
    dayRewardInfo='一、【每日排名奖励】：每日0点根据积分排名，前50名除了排名奖励，还额外奖励等额积分的钻石(黄金卡有效期内钻石奖励翻倍)<br/>'
    seasonRewardInfo='二、【赛季额外奖励】：根据上个赛季结束时的积分排名<br/>'
    showRewards=()=>{
        let str=''
        let gold=''
        let seasonGold=''
        if(this.isKf){
            str = `【跨服竞技奖励】：<br/>`
            gold='100W'
            seasonGold='20Wx积分'
        }else{
            str = `【本服竞技奖励】：<br/>`
            gold='50W'
            seasonGold='10Wx积分'
        }
        let dayR=this.dayRewardInfo
        let seasonR=this.seasonRewardInfo
        GD.RandPkRewardList.forEach(reward=>{
            let sort = reward.Sort
            let pre=''
            if(sort==6){
                pre='第6~10名：'
            }else if(sort==7){
                pre='第11~20名：'
            }else if(sort==8){
                pre='第21~50名：'
            }else{
                pre=`第${sort}名：`
            }
            let day = reward.Day
            let season = reward.Season
            if(this.isKf){
                day=reward.KfDay
                season=reward.KfSeason
            }
            let dayV=day[0]
            let id = dayV[0]
            let num = dayV[1]
            let base = GD.ItemBaseDatas.get(id)
            dayR+=`${pre}<u><color=${ct.yellow} click="onClick" param="b${id}">${base.Name}x${num}</></u><br/>`
            let sV=season[0]
            id = sV[0]
            num = sV[1]
            base = GD.ItemBaseDatas.get(id)
            seasonR+=`${pre}<u><color=${ct.yellow} click="onClick" param="b${id}">${base.Name}x${num}</></u><br/>`
        })
        str += `${dayR}第51~N名：金币x${gold}<br/><br/>${seasonR}第51~N名：金币x${seasonGold}`
        UIMgr.I.PopView.showHelpBox(str)
    }
    tryRankPk=()=>{
        let myTeam=GD.role.myTeam;
        if(myTeam&&myTeam.Menbers.length==5){
            let totalLv=0
            myTeam.Menbers.forEach(info=>{
                if(info.ZsNum>0){
                    totalLv+=400
                }else{
                    totalLv+=info.Lv
                }
            })
            if((totalLv/5>>0)>=this.needLv){
                if(GD.role.myPkData&&GD.role.myPkData.PkNum>0){
                    let req=outer_pb.PkAct.create()
                    req.IsKf = this.isKf;
                    let buff = outer_pb.PkAct.encode(req).finish()
                    WS.send(MT.TryRankPk,buff,(d:any)=>{
                        let rsp=outer_pb.PkAct.decode(d);
                        if(rsp.ErrCode==Err.ErrCode_Success){
                            UIMgr.I.tip('匹配成功')
                        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughNum){
                            UIMgr.I.tip(`队伍成员【${rsp.Who}】剩余挑战次数不足`)
                        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughLv){
                            UIMgr.I.tip(`等级不足`)
                        }else{
                            UIMgr.I.tip('暂时匹配不到敌人')
                        }
                    })
                }else{
                    UIMgr.I.tip('剩余挑战次数不足')
                }
            }else{
                UIMgr.I.tip('您的队伍平均等级不足')
            }
        }else{
            UIMgr.I.tip('您的队伍人数不足5人')
        }
    }
    onGetBtnClick=(type:number)=>{
        let data = GD.role.myPkData
        let sort=data.Sort1
        let hasGot=data.HasGot1
        if(type==1){
            sort=data.OldSort
            hasGot=data.HasGotOld
        }
        if(hasGot){
            return
        }
        if(sort>0){
            if(sort>=6&&sort<=10){
                sort=6
            }else if(sort>=11&&sort<=20){
                sort=7
            }else if(sort>=21&&sort<=50){
                sort=8
            }
            let reward = GD.RandPkRewardList.find(reward=>{
                return reward.Sort==sort;
            })
            if(reward){
                let items:number[][]=[[]]
                if(this.isKf){
                    if(type==0){
                        items=reward.KfDay
                    }else{
                        items = reward.KfSeason
                    }
                }else{
                    if(type==0){
                        items=reward.Day
                    }else{
                        items = reward.Season
                    }
                }
                const hasSelectBox=items.some(v=>{
                    const id = v[0];
                    return id>=57&&id<=68
                })
                if(hasSelectBox){
                    let obj:RewordNameObj;
                    items.forEach(v=>{
                        const id = v[0];
                        if(id>=57&&id<=68){
                            obj=Tools.getRewordsSelectBoxItemNames(id,false)
                        }
                    })
                    if(obj){
                        UIMgr.I.PopView.showSelectBox(obj,(index:number,zyTypeIndex:number)=>{
                            this.getRankPkPhReward(type,obj.idList[index])
                        });
                    }
                }else{
                    this.getRankPkPhReward(type,0)
                }
            }else{
                this.getRankPkPhReward(type,0)
            }
            // else{
            //     UIMgr.I.tip('配置数据错误')
            // }
        }else{
            UIMgr.I.tip('暂无排名')
        }
    }
    getRankPkPhReward=(type:number,id:number)=>{
        let req=outer_pb.PkAct.create()
        req.IsKf=this.isKf;
        req.Type=type;
        req.Id=id;
        let buff = outer_pb.PkAct.encode(req).finish()
        WS.send(MT.GetRankPkPhReward,buff,(d:any)=>{
            let rsp=outer_pb.PkAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                let msglist:Array<BoxMsg>=[]
                let kf='本服'
                if(this.isKf) kf='跨服'
                msglist.push(new BoxMsg(`获得【第${rsp.Sort1}名】${kf}竞技排名奖励<br/>`,ct.white))
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
                if(rsp.Type==0){
                    GD.role.myPkData.HasGot1=true
                }else{
                    GD.role.myPkData.HasGotOld=true
                }
                this.renderMyRankData()
                UIMgr.I.tip('领取成功',ct.green)
            }else{
                UIMgr.I.tip('获取奖励失败'+rsp.ErrCode)
            }
        })
    }
    getMyRankData=()=>{
        let req=outer_pb.PkAct.create()
        req.IsKf=this.isKf;
        let buff = outer_pb.PkAct.encode(req).finish()
        WS.send(MT.GetMyRankPkData,buff,(d:any)=>{
            let rsp=outer_pb.PkAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                GD.role.myPkData = rsp;
                this.renderMyRankData()
            }else{
                this.view.selectedIndex=2
                if(rsp.ErrCode==Err.ErrCode_NotEnoughLv){
                    UIMgr.I.tip('等级不足')
                }else{
                    UIMgr.I.tip('获取竞技数据失败')
                }
            }
        })
    }
    renderMyRankData=()=>{
        let data=GD.role.myPkData;
        if(data&&data.SeasonT>0){
            let kfInfo = '【本服竞技】'
            let color = ct.white
            let pkjf = data.MyTeam.PkJf
            let winNum = data.MyTeam.WinNum
            if(this.isKf){
                color=ct.brown
                pkjf = data.MyTeam.KfPkJf
                winNum = data.MyTeam.KfWinNum
                kfInfo='【跨服竞技】'
            }
            this.info.string=`1.队伍满5人，且所有队员等级满${this.needLv}级可参与；${rankPkInfo}`
            this.season.string=`${kfInfo}当前赛季将于【${Tools.getDayDeltaTimeString(data.SeasonT)}】后结束`
            this.season.color.fromHEX(color)
            this.nowS.string=`${kfInfo}当前赛季积分：${pkjf}分     当前排名：${data.CurSort}`
            this.nowS.color.fromHEX(color)
            this.num.string=`今日剩余挑战次数：${data.PkNum}次    当前连胜：${winNum}场`
            this.sort1.string=`${kfInfo}我的昨日积分：${data.Jf1}     我的排名：${data.Sort1}`
            this.sort1.color.fromHEX(color)
            let getStr1='领取奖励'
            let color1=ct.white
            if(data.HasGot1){
                getStr1='已领取'
                color1=ct.gray
            }
            let get1Label = this.getBtn1.children[0].getComponent(Label);
            get1Label.string=getStr1
            get1Label.color.fromHEX(color1)
            this.oldS.string=`${kfInfo}我的上赛季积分：${data.OldJf}     我的排名：${data.OldSort}`
            this.oldS.color.fromHEX(color)
            getStr1='领取奖励'
            color1=ct.white
            if(data.HasGotOld){
                getStr1='已领取'
                color1=ct.gray
            }
            let getOldLabel = this.getBtn2.children[0].getComponent(Label);
            getOldLabel.string=getStr1
            getOldLabel.color.fromHEX(color1)
            Tools.renderTeamRoles(this.myTeam,data.MyTeam.OwnerId,data.MyTeam.Menbers)
        }else{
            this.view.selectedIndex=2
        }
    }
    getRankPh=()=>{
        this.page.string='1/1'
        this.phList.array=[]
        let type=this.tab1.selectedIndex
        let req=outer_pb.PkAct.create()
        req.IsKf=this.isKf;
        req.Type=type;
        req.Page=this.pageNum;
        let buff = outer_pb.PkAct.encode(req).finish()
        WS.send(MT.GetRankPkPh,buff,(d:any)=>{
            let rsp=outer_pb.PkAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                this.phList.array=rsp.List
                this.totalPageNum=rsp.TotalPage
                this.page.string=`${this.pageNum}/${rsp.TotalPage}`
            }
        })
        GD.playClickSound()
    }
    getHis=()=>{
        this.hisList.array=[]
        WS.send(MT.GetNewTeamPkHis,GD.EmptyRequestBuff,(d:any)=>{
            let rsp=outer_pb.PkAct.decode(d);
            this.hisList.array=rsp.PkHis.sort((a,b)=>{return b.Time-a.Time});
        })
        GD.playClickSound()
    }
    initData(data: any): void {
        let i=0;
        if(data!==null&&data>=0){
            i=data
        }else{
            i=this.tab0.selectedIndex;
        }
        this.tab0.select(i)
    }
    onHide(): void {
        GD.role.myPkData = null;
        this.phList.array=[]
    }
}


