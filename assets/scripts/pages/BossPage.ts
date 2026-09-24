import { _decorator, EventTouch, Label, Node, Toggle} from 'cc';
import { Tab } from '../UiComps/Tab';
import { List } from '../UiComps/List';
import { BasePage } from './BasePage';
import GD from '../base/GameData';
import { BoxMsg, ct,  KillMonsterInfo,    MyBoss } from '../base/types';
import Tools from '../base/tools';
import { UIMgr } from '../managers/UIMgr';
import WS from '../base/net';
import { ConfigType, Err, MT } from '../base/MT';
import {  ShowItemType } from './PopView';
import { BossHelpStr, CallOkInfo, CallRedOrMyBossDropInfo, MyBossOwnerInfo, OwnerInfo, RedBossDropItems, WorldBossDropInfo, WorldBossDropItems, WorldBossDropItemsLv100 } from '../base/consts';

const { ccclass, property } = _decorator;

const BossInfo0:string = '只显示当前地图的击杀数量，切换地图才能查看其它地图的击杀数量'
// const BossInfo1:string = '每个地图线路的野外BOSS最多累计20只'
const MyBossInfo:string = '个人Boss每天0点重置次数（首次击杀后，黄金卡可一键扫荡该Boss）'
const KfBossInfo:string = '跨服Boss在跨服地图内刷新，此处无法查看'
@ccclass('BossPage')
export class BossPage extends BasePage {
    @property(Tab)
    mainTab:Tab
    @property(List)
    list:List
    @property(Label)
    head:Label
    @property(Node)
    infoBtn:Node
    @property(Tab)
    lineTab:Tab
    @property(Label)
    info:Label
    @property(Node)
    sdBtn:Node
    @property(Label)
    dia2Info:Label
    @property(Toggle)
    showMax:Toggle
    @property(Node)
    yjSouHun:Node

    err_msg:string='同时召唤数量已达上限，请先击杀后再召唤'
    err_msg1:string='已存在精英、个人BOSS，请先击杀后再召唤'
    killMonsters:Array<KillMonsterInfo>=[]
    YwBossMsgList:Array<outer_pb.IYwBossData>=[]
    onLoad() {
        super.onLoad();
        this.infoBtn.on(Node.EventType.TOUCH_END,(event:any)=>{
            GD.playClickSound();
            // this.infoBox.active=true;
            UIMgr.I.PopView.showHelpBox(BossHelpStr)
        },this);
        this.showMax.node.on('toggle',(toggle:Toggle)=>{
            this.lineTab.select(this.lineTab.selectedIndex)
        })
        this.sdBtn.on(Node.EventType.TOUCH_END,()=>{
            const type = this.mainTab.selectedIndex
            const line = this.lineTab.selectedIndex;
            if(type==0){
                 this.tryYjSdXsBoss()
            }else if(type==1){
                if(line==2){
                    this.tryYjKillAllMyYwBoss()
                }
            }else if(type==2){
                this.trySdAllMyBoss()
            }else if(type==3&&line==2){
                this.tryYjKillAllMyWorldBoss()
            }
        },this);
        this.yjSouHun.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.hasGoldYk(false)){
                const lineLv = this.lineTab.selectedIndex+1;
                let req=outer_pb.UseItemAct.create()
                req.LineLv= lineLv
                let buf = outer_pb.UseItemAct.encode(req).finish()
                WS.send(MT.YjSouHun,buf,(d:any)=>{
                    let rsp=outer_pb.UseItemAct.decode(d);
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        UIMgr.I.getAndShowResultBox(rsp,'一键搜魂收益')
                    }else{
                        UIMgr.I.tip('暂无亡魂可被搜魂')
                    }
                })
            }else{
                UIMgr.I.tip('一键搜魂需要黄金卡，请前往Boss亡魂所在地手动搜魂')
            }
        },this);
        this.lineTab.selectedHandler=(node:Node,index:number)=>{
            const type = this.mainTab.selectedIndex
            this.sdBtn.active = index==2;
            let x=0
            if(type==1){
                this.list.array=this.YwBossMsgList.filter(this.filterMaxBoss)
                this.list.scrollToTop();
            }else if(type==3){
                let req = outer_pb.GetWorldBossList.create()
                req.IsPrivate = index==2;
                let buff = outer_pb.GetWorldBossList.encode(req).finish();
                WS.send(MT.GetWorldBossList,buff,this.onGetWorldBoss)
            }
            if(index==2){
                x=-150
                this.sdBtn.children[0].getComponent(Label).string='一键击杀'
            }
            this.yjSouHun.x=x;
            GD.playClickSound();
        }
        this.mainTab.selectedHandler=(node:Node,index:number)=>{
            this.list.scrollToTop();
            this.list.array=[]
            this.selectedBoss=null
            this.head.string=this.mainTab.labels.split(',')[index];
            this.showMax.node.active = this.lineTab.node.active = index==3||index==1;
            this.sdBtn.active = index==2||index==0;
            this.yjSouHun.active = index==3;
            let info=''
            let x=0
            if(index==3){
                info=''
                const i = this.lineTab.selectedIndex
                this.lineTab.select(i>=0?i:0)
                x=150
            }else{
                if(index==0){
                    // info=''
                    WS.send(MT.GetKillNums,GD.EmptyRequestBuff,this.onGetCurMapKillNums)
                    this.sdBtn.children[0].getComponent(Label).string='一键击杀'
                    GD.playClickSound();
                }else if(index==1){
                    info=''
                    WS.send(MT.GetBossList,GD.EmptyRequestBuff,this.onGetYwBoss)
                }else if(index==2){
                    info=MyBossInfo
                    this.sdBtn.children[0].getComponent(Label).string='一键扫荡+搜魂'
                    let req = outer_pb.MyBossList.create()
                    req.LoadAll = GD.AllMyBossList==null;
                    let buff = outer_pb.MyBossList.encode(req).finish();
                    WS.send(MT.GetMyBossList,buff,this.onGetMyBoss)
                    GD.playClickSound();
                }else if(index==4){
                    info=KfBossInfo
                    GD.playClickSound();
                }
            }
            this.sdBtn.x=x;
            let show=index==0||index==2
            this.dia2Info.node.active=show
            if(show){
                let s='黄金卡可一键击杀'
                if(index==2){
                    s=`黄金卡可一键扫荡，且所有BOSS每日次数=${GD.configs.get(ConfigType.GoldYkMyBossDayNum)}次`
                }
                this.dia2Info.string=s
            }
            this.info.string=info;
        }
    }
    yjKillXsNum:number=0;
    tryYjSdXsBoss=()=>{
        //一键扫荡悬赏boss
        if(GD.role.hasGoldYk()){
            WS.send(MT.YjKillXsBoss,GD.EmptyRequestBuff,this.onYjKillXsBoss)
            // const need1 = GD.configs.get(ConfigType.CallGoldMonsterNeedNum)
            // const need2 = GD.configs.get(ConfigType.CallRedMonsterNeedNum)
            // let can = this.killMonsters.some(info=>{
            //     if(info.type==0){
            //         return info.Num>need1
            //     }else{
            //         return info.Num>need2
            //     }
            // })
            // if(can){
            //     WS.send(MT.YjKillXsBoss,GD.EmptyRequestBuff,this.onYjKillXsBoss)
            // }else{
            //     UIMgr.I.tip('当前地图暂时可击杀悬赏BOSS')
            // }
        }
    }
    onYjKillXsBoss=(d:any)=>{
        let rsp = outer_pb.YjKillWorldBoss.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            this.yjKillXsNum=rsp.Num;
            this.resetKillMonsters(rsp.KillNums)
            this.refreshInfoStr()
            UIMgr.I.getAndShowResultBox(rsp as any,'一键击杀【悬赏BOSS】收益')
        }else{
            UIMgr.I.tip('今日剩余可一键击杀悬赏BOSS次数不足')
        }
    }
    tryYjKillAllMyYwBoss=()=>{
        if(this.YwBossMsgList.length>0){
            WS.send(MT.YjKillPrivateYwBoss,GD.EmptyRequestBuff,this.onYjKillMyYwBoss)
        }
    }
    onYjKillMyYwBoss=(d:any)=>{
        let rsp = outer_pb.YjKillWorldBoss.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            UIMgr.I.getAndShowResultBox(rsp as any,'一键击杀所有【野外BOSS】收益')
            if(rsp.Boss){
                for(let key in rsp.Boss){
                    let index = parseInt(key)
                    let i=this.YwBossMsgList.findIndex(b=>{return b.Index==index;})
                    this.YwBossMsgList.splice(i,1)
                }
            }
            this.lineTab.select(this.lineTab.selectedIndex)
        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughLineTime){
            UIMgr.I.tip('请在专属线路内操作')
        }else{
            UIMgr.I.tip('剩余野外Boss需要进入一次该地图后，才能一键击杀')
        }
    }
    tryYjKillAllMyWorldBoss=()=>{
        let has= this.worldBossList.some(boss=>{return boss.State!=3})
        if(has){
            WS.send(MT.YjKillPrivateWorldBoss,GD.EmptyRequestBuff,this.onYjKillMyWorldBoss)
        }
    }
    onYjKillMyWorldBoss=(d:any)=>{
        let rsp = outer_pb.YjKillWorldBoss.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            UIMgr.I.getAndShowResultBox(rsp as any,'一键击杀所有【世界BOSS】收益')
            if(rsp.Boss){
                for(let key in rsp.Boss){
                    let id = parseInt(key)
                    this.worldBossList.forEach(b=>{
                        if(b.Id==id){
                            b.State=3;
                        }
                    })
                }
            }
            this.list.refresh()
        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughLineTime){
            UIMgr.I.tip('请在专属线路内操作')
        }else{
            UIMgr.I.tip('剩余世界Boss暂时无法一键击杀')
        }
    }
    trySdAllMyBoss=()=>{
        if(GD.role.hasGoldYk(false)){
            if(this.myBossList.some(boss=>{return boss.CanSd&&boss.Num>0&&GD.role.hasEnoughLv(boss.NeedLv,false)})){
                WS.send(MT.YjSdMyBoss,GD.EmptyRequestBuff,this.onYjSdMyBoss)
            }else{
                UIMgr.I.tip('暂无可扫荡个人BOSS')
            }
        }else{
            UIMgr.I.tip('一键扫荡所有个人BOSS，需要开通黄金月卡')
        }
    }
    onYjSdMyBoss=(d:any)=>{
        let rsp = outer_pb.UseItemAct.decode(d);
        // console.log('onYjSdMyBoss',rsp)
        if(rsp.ErrCode==Err.ErrCode_Success){
            UIMgr.I.getAndShowResultBox(rsp,'一键扫荡+搜魂所有个人BOSS收益')
            this.setMyBossList(rsp.MyBoss)
        }else{
            UIMgr.I.tip('无可扫荡个人BOSS')
        }
    }
    worldBossSelectedHandler = (node:Node,index:number)=>{
        let boss:outer_pb.IWorldBossInfo = this.list.array[index];
        let base = GD.monsterBaseDatas.get(boss.Id)
        // let dia=base.Lv/GD.role.data.DiaRate>>0;
        // if(dia==0){
        //     dia = 1
        // }
        let msg=`<color=${ct.qing}>击杀后必掉：钻石x${base.Lv}</><br/><color=${ct.white}>1.击杀后有${((base.Lv/5+10)*10>>0)/10}%概率掉落1个随机宝石:<br/>${base.Lv<100?WorldBossDropItems:WorldBossDropItemsLv100}<br/></>${WorldBossDropInfo}被击杀后，可被搜魂，搜魂有概率获得魂兽`
        UIMgr.I.PopView.showBossInfo(2,boss.Pos,msg)
    }
    renderWorldBossList = (node:Node,index:number)=>{
        let boss:outer_pb.IWorldBossInfo = this.list.array[index];
        let base = GD.monsterBaseDatas.get(boss.Id)
        let name = node.children[0].getComponent(Label)
        let nameStr = `Lv.${base.Lv} 史诗 ${base.Name}`;
        // if(this.lineTab.selectedIndex==0){
        //     //前后加空格，防止列表项文字一样时不刷新
        //     // nameStr = ` Lv.${base.Lv} 史诗 ${base.Name} `;
        //     posStr = ` ${Tools.getMapName(boss.Pos,false)} `
        // }
        let posColor = ct.blue
        let resultColor = ct.red
        if(boss.State==3){
            resultColor = ct.gray
            posColor = ct.gray
        }else{
            const lineId = boss.Pos.LineId;
            if(lineId=='1'){
                posColor=ct.blue
            }else if(lineId=='99'){
                posColor=ct.purple0
            }else{
                posColor=ct.yellow
            }
        }
        let posStr:string
        let lv = GD.role.getMyMaxDropLv(true)
        if(lv>=base.MaxDropLv+50&&this.lineTab.selectedIndex!=2){
            posColor=resultColor=ct.gray
            posStr=`超过怪物最大掉落等级(${base.MaxDropLv+50}级)`
        }else{
            posStr=Tools.getMapName(boss.Pos,false);
        }
        name.string=''
        name.string = nameStr
        name.color.fromHEX(resultColor)
        let posLabel = node.children[1].getComponent(Label);

        posLabel.string=''
        posLabel.string=posStr;
        posLabel.color.fromHEX(posColor)
        node.children[2].active=false;
    }
    renderYwBossList = (node:Node,index:number)=>{
        let boss:outer_pb.YwBossData = this.list.array[index];
        let base = GD.monsterBaseDatas.get(boss.Id)
        let color=ct.yellow
        let pre = '黄金'
        if(boss.Type==2){
            color=ct.purple
            pre='精英'
        }
        let pos:string
        let posLabel = node.children[1].getComponent(Label);
        let color1 = ct.blue
        const lineLv = GD.LineIdLvs.get(boss.Pos.LineId)
        if(lineLv==1){
            color1=ct.blue
        }else if(lineLv==3){
            color1=ct.purple0
        }else{
            color1=ct.yellow
        }
        let max = base.MaxDropLv
        if(boss.Type>1){
            //红色BOSS+50级上限
            max+=50
        }
        let lv = GD.role.getMyMaxDropLv(true)
        if(lv>=max&&this.lineTab.selectedIndex!=2){
            color1=color=ct.gray
            pos=`超过怪物最大掉落等级(${max}级)`
        }else{
            pos = Tools.getMapName(boss.Pos,false);
        }
        posLabel.string=pos;
        posLabel.color.fromHEX(color1)
        node.children[2].active=false;
        let name = node.children[0].getComponent(Label)
        name.string=''
        name.string = `Lv.${base.Lv} ${pre}${base.Name}`;
        name.color.fromHEX(color)
    }
    ywBossSelectedHandler = (node:Node,index:number)=>{
        let boss:outer_pb.YwBossData = this.list.array[index];
        let base = GD.monsterBaseDatas.get(boss.Id)
       UIMgr.I.PopView.showBossInfo(2,boss.Pos,this.getYwBossDropInfo(boss.Type-1,base.Lv))
    }
    selectedBoss:any=null;
    onGetCurMapKillNums=(d:any)=>{
        let rsp=outer_pb.YjKillWorldBoss.decode(d);
        this.yjKillXsNum=rsp.Num;
        this.resetKillMonsters(rsp.KillNums)
        this.refreshInfoStr()
    }
    refreshInfoStr=()=>{
        const dayNum = GD.configs.get(ConfigType.YjKillXsBossDayNum)
        this.info.string=`${BossInfo0}\n黄金卡今日剩余可一键击杀BOSS个数：${this.yjKillXsNum}个（每日${dayNum}个）`;
    }
    resetKillMonsters=(rsp:outer_pb.IKillNums)=>{
        this.killMonsters=[]
        for(let idstr in rsp.Infos){
            let id = parseInt(idstr)
            let info = rsp.Infos[idstr]
            if(info==null){
                this.killMonsters.push(new KillMonsterInfo(id,0,0))
                this.killMonsters.push(new KillMonsterInfo(id,0,1))
            }else{
                this.killMonsters.push(new KillMonsterInfo(id,info.GoldNum,0))
                this.killMonsters.push(new KillMonsterInfo(id,info.RedNum,1))
            }
        }
        this.list.cellRender=this.renderKillList
        this.list.selectedHandler=this.killListSelectHandler
        
        this.list.array=this.killMonsters
        this.list.scrollToTop();
    }
    callMonster=(d:any)=>{
        let data=this.selectedBoss
        if(data){
            if(GD.curMap.mapCells[GD.role.data.I][GD.role.data.J]==1){
                UIMgr.I.tip('安全区内无法召唤')
                return;
            }
            if(GD.curMap.mapData.FbType>0){
                UIMgr.I.tip('副本内无法召唤')
                return
            }
            let needNum = GD.configs.get(ConfigType.CallGoldMonsterNeedNum);
            if(data.type==1){
                needNum = GD.configs.get(ConfigType.CallRedMonsterNeedNum)
            }
            let num = data.Num/needNum>>0;
            if(num>0){
                let req = outer_pb.CallMonster.create();
                req.Id=data.Id
                req.Type=data.type;
                let buff = outer_pb.CallMonster.encode(req).finish();
                WS.send(MT.CallGoldMonster,buff,(d:any)=>{
                    let rsp=outer_pb.CallMonster.decode(d);
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        let info:KillMonsterInfo = this.list.array.find((info:KillMonsterInfo)=>{return info.Id==rsp.Id&&info.type==rsp.Type});
                        if(info){
                            if(rsp.Type==0){
                                info.Num=rsp.GoldNum
                            }else{
                                info.Num=rsp.RedNum
                            }
                        }
                        this.list.refresh();
                        UIMgr.I.tip(CallOkInfo,ct.green);
                    }else if(rsp.ErrCode==Err.ErrCode_HasTooManyCallBoss){
                        UIMgr.I.tip(this.err_msg);
                    }else if(rsp.ErrCode==Err.ErrCode_HasTooManyCallRedBoss){
                        UIMgr.I.tip(this.err_msg1);
                    }else{
                        UIMgr.I.tip('召唤失败');
                    }
                })
            }else{
                UIMgr.I.tip('击杀数量不足')
            }
        }
    }
    killListSelectHandler=(node:Node,index:number)=>{
        let data:KillMonsterInfo = this.list.array[index];
        let base = GD.monsterBaseDatas.get(data.Id)
        let str:string=''
        if(data.type<2){
            let t0:string=`<color=${ct.brown}>${base.Name}</>`
            let t:string=''
            let needNum = 0;
            if(data.type==0){
                t = `<color=${ct.yellow}>黄金 ${base.Name}</>`
                needNum = GD.configs.get(ConfigType.CallGoldMonsterNeedNum);
                
            }else if(data.type==1){
                t0 = `<color=${ct.yellow}>黄金 ${base.Name}</>`;
                t = `<color=${ct.purple}>精英 ${base.Name}</>`
                needNum = GD.configs.get(ConfigType.CallRedMonsterNeedNum)
            }
            let num = data.Num/needNum>>0;
            this.selectedBoss = data
            str=`<size=26>${t}</size><br/><br/>`
            str+=`${this.getYwBossDropInfo(data.type,base.Lv)}<br/>${OwnerInfo}`
            str+=`<color=${ct.gray}>(每击杀${needNum}只${t0}可召唤1只${t})</><br/><br/>当前可召唤${num}只<br/><color=${ct.gray}>(每次召唤1只，可连续召唤)</><br/><br/>`
        }
        UIMgr.I.PopView.show(0,str,false,ShowItemType.Msg,'召唤',this.callMonster,null,false)
    }
    getYwBossDropInfo=(type:number,lv:number):string=>{
        let info=''
        if(type==0){
            let id=501
            if (lv < 25) {
                id = 501 //+1黄金宝箱
            } else if (lv < 40) {
                id = 502 //+2黄金宝箱
            } else if (lv < 55) {
                id = 503 //+3黄金宝箱
            } else if (lv < 70) {
                id = 504 //+4黄金宝箱
            } else if (lv < 85) {
                id = 505 //+5黄金宝箱
            } else if (lv < 100) {
                id = 506 //+6黄金宝箱
            } else if (lv < 115) {
                id = 507 //+7黄金宝箱
            } else {
                id = 508 //+8黄金宝箱
            }
            let item = GD.ItemBaseDatas.get(id)
            info = `<color=${ct.white}>击杀后100%掉落1个<color=${ct.yellow}>${item.Name}</><br/>`
        }else{
            let dia=lv/3>>0
            if(dia>1){
                dia=dia/GD.role.data.DiaRate>>0;
            }
            if(dia==0){
                dia = 1
            }
            if(type==2){
                //myBoss
                info = `<color=${ct.qing}>击杀后必掉：钻石x${dia}</><br/><color=${ct.white}>1.击杀后有${(lv/20*100>>0)/100}%概率掉落1个随机宝石:<br/>${lv<100?RedBossDropItems:WorldBossDropItems}<br/></>${CallRedOrMyBossDropInfo}(装备有2%概率为<color=${ct.green}>卓越装备</>)<br/></>`
            }else{
                info = `<color=${ct.qing}>击杀后必掉：钻石x${dia}</><br/><color=${ct.white}>1.击杀后有${(lv/20*100>>0)/100}%概率掉落1个随机宝石:<br/>${RedBossDropItems}<br/></>${CallRedOrMyBossDropInfo}(装备有5%概率为<color=${ct.green}>卓越装备</>)<br/></>`
            }
        }
        return info
    }
    renderKillList=(node:Node,index:number)=>{
        // let isGold=this.tab1.selectedIndex==0;
        // let data:KillMonsterInfo = isGold?this.killList1.array[index]:this.killList2.array[index];
        let data:KillMonsterInfo = this.list.array[index];
        let base = GD.monsterBaseDatas.get(data.Id);
        let label0 = node.children[0].getComponent(Label);
        let label1 = node.children[1].getComponent(Label);
        let color = ct.yellow;
        let name = ''
        if(data.type==0){
            const need1 = GD.configs.get(ConfigType.CallGoldMonsterNeedNum)
            label1.string = `(${data.Num}/${need1})`
            node.children[2].active=data.Num>=need1
            name=`Lv.${base.Lv} 黄金 ${base.Name}`
            label1.color.fromHEX(data.Num>=need1?ct.blue:ct.gray)
        }else{
            color=ct.purple;
            const need2 = GD.configs.get(ConfigType.CallRedMonsterNeedNum)
            label1.string = `(${data.Num}/${need2})`
            node.children[2].active=data.Num>=need2
            name=`Lv.${base.Lv} 精英 ${base.Name}`
            label1.color.fromHEX(data.Num>=need2?ct.blue:ct.gray)
        }
        label0.color.fromHEX(color)
        label0.string=name;
    };
    renderMyBossList=(node:Node,index:number)=>{
        let data:MyBoss = this.list.array[index];
        let base = GD.monsterBaseDatas.get(data.Id);
        let label0 = node.children[0].getComponent(Label);
        let label1 = node.children[1].getComponent(Label);
        let color0 = ct.gray;
        let color1 = ct.gray;
        let info = ''
        if(GD.role.hasEnoughLv(data.NeedLv,false)){
            if(data.Num>0){
                color0=ct.red
                color1=ct.green
                if(data.CanSd){
                    info = `可扫荡`
                }else{
                    info = '可召唤击杀'
                }
                info+=`(剩余${data.Num}次)`
            }else{
                info='剩余次数不足'
                if(GD.role.data.IsYkMode){
                    info+='(可钻石扫荡)'
                }
            }
        }else{
            info = `需要${data.NeedLv}级`
        }
        label1.string=''
        label1.string=info
        label1.color.fromHEX(color1)

        label0.string=''
        label0.string=`Lv.${base.Lv} 史诗 ${base.Name}`;
        label0.color.fromHEX(color0)
        node.children[2].active=false;
    };
    myBossListSelectHandler=(node:Node,index:number)=>{
        let data:MyBoss = this.list.array[index];
        this.selectedBoss = data
        let base = GD.monsterBaseDatas.get(data.Id)
        let str:string=`<color=${ct.red}><size=26>Lv.${base.Lv} 史诗 ${base.Name}</size></><br/><br/>`;
        let btnStr = '召唤击杀'
        if(data.Num<=0){
            str+=`<color=${ct.green}>钻石扫荡时，掉落设置与同名世界BOSS相同</><br/><br/>`
            str+=`<color=${ct.qing}>击杀后必掉：钻石x${base.Lv}</><br/><color=${ct.white}>1.击杀后有${((base.Lv/5+10)*10>>0)/10}%概率掉落1个随机宝石:</><br/>${base.Lv<100?WorldBossDropItems:WorldBossDropItemsLv100}<br/>${WorldBossDropInfo}扫荡时会同时进行搜魂，有概率获得魂兽<br/><br/>${MyBossOwnerInfo}`
            if(data.Num>-10){
                btnStr= '钻石扫荡'
            }else{
                btnStr=''
            }
            let point=GD.SdMyBossNeedPoint.get(data.Id)
            let dia=point*(10000/this.curPrice>>0) 
            str += `<color=${ct.gray}>(扫荡该BOSS每次需要：<color=${ct.qing}>${dia}钻石</>)<br/>(需求钻石数量为${point}点等价钻石)<br/></>`
            str += `<color=${ct.gray}>(该BOSS今日剩余次数：<color=${ct.blue}>${10-Math.abs(data.Num)}次</>)</><br/><br/>`
        }else{
            str+=`${this.getYwBossDropInfo(2,base.Lv)}<br/><br/>${MyBossOwnerInfo}<br/>`
        }
        UIMgr.I.PopView.show(0,str,false,ShowItemType.Msg,btnStr,this.callMyMonster,null,true)
    }
    callMyMonster=(d:any)=>{
        let data:MyBoss=this.selectedBoss
        if(data){
            if(GD.role.hasEnoughLv(data.NeedLv)){
                if(data.Num>0){
                    if(GD.curMap.mapCells[GD.role.data.I][GD.role.data.J]==1){
                        UIMgr.I.tip('安全区内无法召唤')
                        return;
                    }
                    if(GD.curMap.mapData.FbType>0){
                        UIMgr.I.tip('副本内无法召唤')
                        return
                    }
                    let req = outer_pb.CallMonster.create();
                    req.Id=data.Id
                    let buff = outer_pb.CallMonster.encode(req).finish();
                    WS.send(MT.Call1MyBoss,buff,(d:any)=>{
                        let rsp=outer_pb.CallMonster.decode(d);
                        if(rsp.ErrCode==Err.ErrCode_Success){
                            let info:MyBoss = this.list.array.find((info:MyBoss)=>{return info.Id==rsp.Id});
                            if(info){
                                info.Num=rsp.RedNum
                            }
                            this.list.refresh();
                            if(rsp.NewItems){
                                let msglist:Array<BoxMsg>=[]
                                msglist.push(new BoxMsg('召唤个人BOSS【搜魂】获得<br/>',ct.white))
                                for(let i in rsp.NewItems){
                                    let id = parseInt(i)
                                    let num = rsp.NewItems[i]
                                    msglist.push(GD.role.getItem(id,num,true,true,'',true))
                                }
                                UIMgr.I.PopView.showMsgBox(msglist)
                            }
                            UIMgr.I.tip(CallOkInfo,ct.green);
                        }else if(rsp.ErrCode==Err.ErrCode_HasTooManyCallBoss){
                            UIMgr.I.tip(this.err_msg);
                        }else if(rsp.ErrCode==Err.ErrCode_HasTooManyCallRedBoss){
                            UIMgr.I.tip(this.err_msg1);
                        }else{
                            UIMgr.I.tip('召唤失败');
                        }
                    })
                }else if(data.Num>-10){
                    let needDia=GD.SdMyBossNeedPoint.get(data.Id)*(10000/this.curPrice>>0)
                    if(GD.role.hasEnoughDia(needDia)){
                        let req = outer_pb.UseItemAct.create();
                        req.Id=data.Id
                        let buff = outer_pb.UseItemAct.encode(req).finish();
                        WS.send(MT.SdOneMyBoss,buff,(d:any)=>{
                            let rsp = outer_pb.UseItemAct.decode(d);
                            // console.log('onSdOneMyBoss',rsp)
                            if(rsp.ErrCode==Err.ErrCode_Success){
                                if(rsp.CostDia>0){
                                    GD.role.reduceDia(rsp.CostDia) //扣除钻石
                                }
                                UIMgr.I.getAndShowResultBox(rsp,'扫荡+搜魂个人BOSS收益')
                                this.setMyBossList(rsp.MyBoss)
                            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughDia){
                                UIMgr.I.tip('剩余钻石不足')
                            }else{
                                UIMgr.I.tip('剩余次数不足')
                            }
                        })
                    }
                }else{
                    UIMgr.I.tip('剩余次数不足')
                }
            }
        }
    }
    initData(data: any): void {
        let labels='普通线路,黄金线路,专属线路'
        if(GD.role.data.IsYkMode){
            labels='普通线路,黄金线路'
        }
        this.lineTab.labels=labels;
        if(data!==null&&data>=0){
            this.mainTab.select(data)
        }else{
            this.list.array=[]
            let i = this.mainTab.selectedIndex;
            if(GD.LineIdLvs==null){
                this.getLineList();
                i=0;
            }
            this.mainTab.select(i>=0?i:0)
        }
    }
    onBgClick(event: EventTouch): void {
        this.list.array=[];
        this.myBossList=[];
        this.worldBossList=[];
        this.YwBossMsgList=[]
        this.killMonsters=[]
        UIMgr.I.hideCurPage();
    }
    onGetYwBoss=(d:any)=>{
        let rsp = outer_pb.YwBossList.decode(d);
        this.YwBossMsgList=[]
        rsp.List.forEach(data=>{
            for(let k in data.List){
                this.YwBossMsgList.push(data.List[k])
            }
        })
        this.YwBossMsgList.sort(this.sortBoss)
        this.list.cellRender=this.renderYwBossList
        this.list.selectedHandler=this.ywBossSelectedHandler
        const i = this.lineTab.selectedIndex
        this.lineTab.select(i>=0?i:0)
    }
    myBossList:Array<MyBoss>=[]
    curPrice:number=100;
    onGetMyBoss=(d:any)=>{
        let rsp = outer_pb.MyBossList.decode(d);
        // console.log('onGetMyBoss',rsp)
        if(rsp.All[31]){ //存在时表示有数据
            GD.AllMyBossList=rsp.All
        }
        this.curPrice=rsp.CurPrice
        this.list.cellRender=this.renderMyBossList
        this.list.selectedHandler=this.myBossListSelectHandler
        this.setMyBossList(rsp.List);
    }
    setMyBossList=(data:{[k: string]: outer_pb.IMyBoss;})=>{
         this.myBossList=[]
        for(let id in GD.AllMyBossList){
            let myBoss=data[id]
            let has = myBoss!=null
            this.myBossList.push({Id:parseInt(id),Num:has?myBoss.Num:0,NeedLv:GD.AllMyBossList[id],CanSd:has?myBoss.CanSd:false})
        }
        this.myBossList=this.myBossList.sort(this.sortBoss)
        this.list.array=this.myBossList;
    }
    worldBossList:Array<outer_pb.IWorldBossInfo>
    onGetWorldBoss=(d:any)=>{
        let rsp = outer_pb.GetWorldBossList.decode(d);
        // console.log('onGetWorldBoss',rsp)
        this.worldBossList=rsp.List.sort(this.sortBoss)
        this.list.cellRender=this.renderWorldBossList;
        this.list.selectedHandler=this.worldBossSelectedHandler;
        this.list.array=this.worldBossList.filter(this.filterMaxBoss);
    }
    filterMaxBoss=(boss:outer_pb.YwBossData)=>{
        let lineLv=0
        if(boss.LineLv==0){
            lineLv=GD.LineIdLvs.get(boss.Pos.LineId)-1
        }else{
            lineLv=boss.LineLv-1
        }
        // if(GD.LineIdLvs.get(boss.Pos.LineId)-1 == this.lineTab.selectedIndex){
        if(lineLv == this.lineTab.selectedIndex){
            if(this.lineTab.selectedIndex==2)return true //专属线路，全部显示
            let base = GD.monsterBaseDatas.get(boss.Id)
            let max = base.MaxDropLv
            if(boss.Type==null||boss.Type>1){
                max+=50
            }
            let lv = GD.role.getMyMaxDropLv(true)
            if(base&&lv>=max){
                return !this.showMax.isChecked
            }
            return true
        }else{
            return false
        }
    }
    sortBoss=(b1,b2)=>{ 
        let base1 = GD.monsterBaseDatas.get(b1.Id)
        let base2 = GD.monsterBaseDatas.get(b2.Id)
        if(base1&&base2){
            return base1.Lv-base2.Lv
        }
    }
    getLineList(){
        WS.send(MT.GetLineList,GD.EmptyRequestBuff,d=>{
            let rsp = outer_pb.GetLineList.decode(d);
            GD.LineIdLvs=new Map();
            rsp.LineInfo.forEach(info=>{
                GD.LineIdLvs.set(info.LineId,info.LineLv)
            })
        })
    }
}


