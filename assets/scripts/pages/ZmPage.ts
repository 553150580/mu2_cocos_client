import { _decorator, EditBox, EventTouch, instantiate, Label, Node, Prefab, ProgressBar, resources, RichText, ScrollView, sp, Sprite, SpriteFrame, Toggle, UITransform, Vec2, Vec3, Widget } from 'cc';
import { BasePage } from './BasePage';
import { ViewStack } from '../UiComps/ViewStack';
import { Tab } from '../UiComps/Tab';
import { List } from '../UiComps/List';
import WS from '../base/net';
import { ConfigType, Err, MT } from '../base/MT';
import GD from '../base/GameData';
import { BodyType, BoxMsg, ct, EquipType, Item, KfGcStepType, PopViewType, UnitState, ZmCellState } from '../base/types';
import {  PageType, UIMgr } from '../managers/UIMgr';
import Tools from '../base/tools';
import { ShowItemType } from './PopView';
import { GcHelpInfo, ItemFramePath, ZmJobColor, ZmJobStr } from '../base/consts';
import { BattleManager } from '../battle/BattleManager';
import { RoleUIControl } from '../battle/RoleUIControl';
import GameManager from '../managers/GameManager';
const { ccclass, property } = _decorator;

const ZmCellWidth=13

@ccclass('ZmPage')
export class ZmPage extends BasePage {
    @property(Prefab)
    zmCellPrefab:Prefab;
    @property(Node)
    zmMap:Node;
    @property(Node)
    gcHelp:Node;
    @property(Node)
    lastGcPh:Node;
    @property(ScrollView)
    scrollView:ScrollView;
    @property(Label)
    signInfo:Label;
    @property(Label)
    noGcInfo:Label;
    @property(Label)
    myZmJf:Label;
    @property(ViewStack)
    gcView:ViewStack;
    @property(Node)
    signUpBtn:Node;
    @property(Node)
    addHdExpBtn:Node;
    @property(RichText)
    hdLvRich:RichText;

    @property(Node)
    openQd:Node;
    @property(Node)
    qdBox:Node;
    @property(RichText)
    freeQdRich:RichText;
    @property(Node)
    freeQdBtn:Node;
    @property(RichText)
    diaQdRich:RichText;
    @property(Node)
    diaQdBtn:Node;
    @property(ViewStack)
    viewStack:ViewStack;
    @property(Tab)
    tab:Tab;
    @property(Label)
    head:Label;
    @property(Node)
    requestListBtn:Node;
    @property(Node)
    top:Node;
    @property(Label)
    zmOwner:Label;
    @property(Label)
    allGx:Label;
    @property(Label)
    dia:Label;
    @property(Label)
    point:Label;
    @property(Label)
    biao:Label;
    @property(Label)
    bzSp:Label;
    @property(Label)
    zySp:Label;
    @property(Label)
    goldNum:Label;
    @property(Label)
    gpNum:Label;
    @property(RichText)
    allOutput:RichText;
    @property(Node)
    buyGpBtn:Node;
    @property(Node)
    buyGpBox:Node;
    @property(Node)
    doBuyGpBtn:Node;
    @property(List)
    buyGpList:List;
    @property(Label)
    myGx:Label;
    @property(Node)
    zmDt:Node;
    @property(Node)
    zmShop:Node;
    @property(Node)
    zmCk:Node;
    @property(Node)
    zmJt:Node;
    @property(Node)
    zmTower:Node;
    @property(Node)
    openJuan:Node;
    @property(Node)
    hunters:Node;
    @property(Node)
    zmSetBtn:Node;
    @property(Node)
    creatBtn:Node;
    @property(Node)
    creatOkBtn:Node;
    @property(Node)
    creatBox:Node;
    @property(Label)
    creatNeed:Label;
    @property(EditBox)
    newZmName:EditBox;
    @property(Node)
    exitBtn:Node;
    @property(Node)
    saveSetBtn:Node;
    @property(Node)
    clearListBtn:Node;
    @property(Node)
    juanBox:Node;
    @property(List)
    juanList:List;
    @property(Node)
    doJuan:Node

    @property(Node)
    ckbox:Node;
    @property(Tab)
    ckTab:Tab;
    @property(List)
    ckList:List;
    @property(List)
    ckHisList:List;
    @property(Label)
    ckCap:Label;
    @property(Node)
    allToMeBtn:Node;
    @property(Node)
    getAllMyBtn:Node;
    @property(ViewStack)
    ckView:ViewStack;

    @property(Node)
    openMemberBox:Node;
    @property(Node)
    memberBox:Node;
    @property(List)
    setMemberList:List;
    // @property(Node)
    // setToBtn:Node;

    @property(Node)
    jtBox:Node;
    @property(List)
    jtBuffList:List;

    @property(Node)
    towerBox:Node;
    @property(Label)
    towerInfo:Label;
    @property(Tab)
    towerTab:Tab;
    @property(ViewStack)
    towerView:ViewStack;
    @property(ProgressBar)
    hpBar:ProgressBar;
    @property(Sprite)
    bossSkin:Sprite;
    @property(Label)
    bossName:Label;
    @property(RichText)
    reliveNum:RichText;
    @property(Label)
    bossHp:Label;
    @property(Node)
    dmgPhBtn:Node;
    @property(Node)
    atkBtn:Node;
    @property(Node)
    sdBossBtn:Node;
    @property(Node)
    jsBtn:Node;
    @property(Node)
    atkerPh:Node;
    @property(RichText)
    bossRich:RichText;
    @property(List)
    bossList:List;
    @property(List)
    dmgPhList:List;

    @property(Node)
    dtBox:Node;
    @property(RichText)
    dtInfoRich:RichText
    @property(Node)
    dtUpBtn:Node;
    @property(Label)
    gcBuffInfo:Label;
    @property(Node)
    dtSpeedUp:Node;
    @property(Node)
    addCapBtn:Node;
    @property(ProgressBar)
    dtDiaBar:ProgressBar
    @property(ProgressBar)
    dtGxBar:ProgressBar
    @property(List)
    dtBuffList:List
    // @property(List)
    // memberList:List;

    @property(Node)
    hunterBox:Node;
    @property(RichText)
    hunterRich:RichText
    @property(Node)
    hunterUpBtn:Node;
    @property(Node)
    hunterSpeedUp:Node;
    @property(ProgressBar)
    bzSpBar:ProgressBar
    @property(ProgressBar)
    zySpBar:ProgressBar

    @property(List)
    allZmList:List;
    @property(List)
    noZmList:List;
    @property(List)
    requestList:List;
    @property(EditBox)
    needZs:EditBox;
    @property(EditBox)
    needLv:EditBox;
    @property(Toggle)
    autoAgree:Toggle;
    @property(Toggle)
    isSj:Toggle;
    @property(Node)
    backBtn1:Node;
    @property(Node)
    backBtn2:Node;
    @property(Node)
    info1:Node;
    @property(Label)
    info2:Label;

    @property(Node)
    prePage:Node;
    @property(Node)
    nextPage:Node;
    @property(Label)
    page:Label;
    @property(Node)
    prePage1:Node;
    @property(Node)
    nextPage1:Node;
    @property(Label)
    page1:Label;

    @property(Node)
    set_prePage:Node;
    @property(Node)
    set_nextPage:Node;
    @property(Node)
    set_lastPage:Node;
    @property(Node)
    set_firstPage:Node;
    @property(Label)
    set_page:Label;

    pageNum:number=1;
    totalPageNum:number=1;

    memberBoxMode:number=0;
    selectedItem:outer_pb.ZmCkItem;
    selectedJuanNode:Node

    juanTypes = [
        [402,1,ct.yellow,10000000],//爆竹装备碎片
        [407,2,ct.green,10000000],//卓越碎片
        [2,50,ct.qing,10000],//1小袋钻石(100钻)
        [3,350,ct.brown,10000],//点数
        [617,20,ct.yellow,10000000],//城标
        [400,20,ct.yellow,10000]//1大袋金币(100W)
    ]
    buyGpTypes=[
        `<color=${ct.qing}>战盟钻石x100</> = <color=${ct.purple0}>贡品x1</>`,
        `<color=${ct.brown}>战盟点数x1 = <color=${ct.purple0}>贡品x10`
    ]
    myZmBossInfo:string='复活出来的BOSS，在被击杀时可进行手动结算，结算奖励贡献，而掉落道具将存入战盟仓库，由盟主分配，结算后原BOSS消失，并可重新复活（战盟Boss免疫毒伤害，且随开服天数逐渐增强）'
    kfZmBossInfo:string='跨服战盟Boss被击杀后结算，按伤害值分配贡献、贡品奖励，掉落归属于伤害最高的战盟\n每人每日最多可挑战或扫荡200次\n（跨服战盟Boss免疫毒伤害，且随开服天数逐渐增强）'
    initData(data: any): void {
        this.dtBox.active=this.hunterBox.active=this.towerBox.active=this.qdBox.active=this.ckbox.active=false;
        this.selectedItem=null;
        if(!data)data=0;
        this.tab.select(data)
        // this.selectedMemberIndex=-1
    }
    onLoad() {
        super.onLoad();
        this.set_firstPage.on(Node.EventType.TOUCH_END,()=>{
            if(this.pageNum>1){
                this.pageNum=1
                this.getMembers()
                GD.playClickSound()
            }
        })
        this.set_lastPage.on(Node.EventType.TOUCH_END,()=>{
            if(this.pageNum!=this.totalPageNum){
                this.pageNum=this.totalPageNum
                this.getMembers()
                GD.playClickSound()
            }
        })
        this.set_prePage.on(Node.EventType.TOUCH_END,()=>{
            if(this.pageNum>1){
                this.pageNum--
                this.getMembers()
                GD.playClickSound()
            }
        })
        this.set_nextPage.on(Node.EventType.TOUCH_END,()=>{
            if(this.pageNum<this.totalPageNum){
                this.pageNum++
                this.getMembers()
                GD.playClickSound()
            }
        })
        this.prePage.on(Node.EventType.TOUCH_END,()=>{
            if(this.pageNum>1){
                this.pageNum--
                this.getZmList()
                GD.playClickSound()
            }
        })
        this.nextPage.on(Node.EventType.TOUCH_END,()=>{
            if(this.pageNum<this.totalPageNum){
                this.pageNum++
                this.getZmList()
                GD.playClickSound()
            }
        })
        this.prePage1.on(Node.EventType.TOUCH_END,()=>{
            if(this.pageNum>1){
                this.pageNum--
                this.getNoZmList()
                GD.playClickSound()
            }
        })
        this.nextPage1.on(Node.EventType.TOUCH_END,()=>{
            if(this.pageNum<this.totalPageNum){
                this.pageNum++
                this.getNoZmList()
                GD.playClickSound()
            }
        })
        this.tab.selectedHandler=(node:Node,index:number)=>{
            this.viewStack.selectedIndex=index;
            if(index==0){
                this.getMyZm();
            }else if(index==1){
                this.pageNum=1
                this.getZmList()
                this.head.string='可加入战盟列表'
            }else if(index==2){
                this.pageNum=1
                this.getNoZmList()
                this.head.string='邀请玩家'
            }else if(index==3){
                this.head.string='跨服攻城'
                this.gcView.selectedIndex=0
                // this.noGcInfo.string='【跨服攻城】正在开发中，尽情期待'
                let zm=GD.role.myZm
                if(zm&&zm.HomeBuild.Lv>=3){
                    this.getGcData()
                }else{
                    this.noGcInfo.string=`战盟【议政大厅】等级>=3级时，可报名跨服攻城\n报名费：战盟内城主标识200个`
                }
            }
            GD.playClickSound()
        }
        this.creatBox.active=false;
        this.creatBox.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.creatBox.active=false;
        },this);
        this.creatOkBtn.on(Node.EventType.TOUCH_END,this.tryCreateZm,this);
        this.requestListBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.getRequestList()
            this.head.string='申请列表'
            this.viewStack.selectedIndex=4;
            this.tab.select(-1)
            GD.playClickSound()
        },this);
        this.backBtn2.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.tab.select(0)
        },this);
        this.backBtn1.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.tab.select(0)
        },this);
        this.zmSetBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.setMyZmSet()
            this.head.string='战盟设置'
            this.viewStack.selectedIndex=5;
            this.tab.select(-1)
            GD.playClickSound()
        },this);
        this.saveSetBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            let zs = parseInt(this.needZs.string)
            let lv = parseInt(this.needLv.string)
            if(zs!==null&&lv!==null){
                const minLv=GD.configs.get(ConfigType.ZmMinJoinZmNeedLv)
                if(lv<minLv&&zs==0){
                    UIMgr.I.tip(`最小等级限制必须大于0转${minLv}级`)
                    return
                }
                this.tab.select(0)
                let req = outer_pb.ZmAct.create();
                req.NeedLv=lv;
                req.NeedZs=zs;
                req.IsAgree = this.autoAgree.isChecked;
                req.IsSj = this.isSj.isChecked;
                let buff = outer_pb.ZmAct.encode(req).finish();
                WS.send(MT.SaveZmSet,buff,(d:any)=>{
                    let rsp=outer_pb.ZmAct.decode(d);
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        GD.role.myZm.NeedLv=rsp.NeedLv
                        GD.role.myZm.IsAutoAgree=rsp.IsAgree
                        GD.role.myZm.IsSj=rsp.IsSj
                        UIMgr.I.tip('保存成功',ct.green)
                    }else{
                        UIMgr.I.tip('保存失败')
                    }
                })
            }
        },this);
        this.clearListBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.tab.select(0)
            WS.send(MT.ClearZmRequestList,GD.EmptyRequestBuff,(d:any)=>{
                this.requestList.array=[];
            })
        },this);
        this.exitBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            UIMgr.I.PopView.show(0,`<color=${ct.red}>您确定要退出战盟吗？</><br/><br/><color=${ct.gray}>退出后重新加入需要等${GD.configs.get(ConfigType.ExitZmCdTime)/3600>>0}小时</><br/><br/>`,false,ShowItemType.Msg,'退出',this.exitZm)
        },this);
        this.creatBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            if(GD.role.myZm==null&&GD.role.hasBaseYk()){
                const needDia=GD.configs.get(ConfigType.CreateZmNeedDia);
                if(GD.role.hasEnoughLv(100)==false){
                    return;
                }
                if(GD.role.hasEnoughDia(needDia)==false){
                    return;
                }
                this.creatNeed.string=`创建战盟需要：${needDia}钻石`
                this.creatBox.active=true;
            }
        },this);
        let juanStr = []
        this.juanTypes.forEach((v)=>{
            const id=v[0] as number
            const num=v[1]
            const color=v[2] as ct
            let base = GD.ItemBaseDatas.get(id)
            if(base){
                juanStr.push(`<color=${color}>${base.Name}</> = <color=${ct.blue}>${num}贡献</>`)
            }
        })
        this.juanList.cellRender=(node,index)=>{
            let str=this.juanList.array[index];
            node.children[2].getComponent(RichText).string=str;
            node.children[1].children[0].active = node==this.selectedJuanNode;
        }
        this.juanList.selectedHandler=(node,index)=>{
            if(this.selectedJuanNode){
                this.selectedJuanNode.children[1].children[0].active = false;
            }
            this.selectedJuanNode=node
            node.children[1].children[0].active = true
            GD.playClickSound();
        }
        this.doJuan.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.canPlay()){
                const type=this.juanList.selectedIndex
                if(type<0)return
                const juanItem=this.juanTypes[type];
                let max = juanItem[3] as number
                const id = (juanItem[0] as number)
                if(id==3||id==2||id==400){
                    if(id==3){
                        max = Math.min(max,GD.role.data.MuPoint)
                    }else if(id==2){
                        max = Math.min(max,GD.role.data.Dia/100) //每袋100钻石
                    }else if(id==400){
                        max = Math.min(max,GD.role.data.Gold/1000000) //每袋100W金币
                    }
                    if(max==0){
                        UIMgr.I.tip('剩余数量不足')
                        return
                    }
                }else{
                    let item = GD.role.BagItems.find(i=>{return i.Id==id})
                    if(item&&item.Num>0){
                        max=Math.min(max,item.Num)
                    }else{
                        UIMgr.I.tip('道具不足')
                        return
                    }
                }
                UIMgr.I.PopView.showSliderBox(`${juanStr[type]}<br/>您要捐多少？`,ct.white,max>>0,'捐赠',this.doJuanItem)
            }
        },this);
        this.freeQdBtn.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.hasBaseYk()){
                this.tryQd(0)
                GD.playClickSound();
            }
        },this);
        this.diaQdBtn.on(Node.EventType.TOUCH_END,()=>{
            const needDia=GD.configs.get(ConfigType.ZmDiaCheckInNeedDia)
            if(GD.role.hasEnoughDia(needDia)){
                this.tryQd(1)
                GD.playClickSound();
            }
        },this);
        this.openQd.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.hasBaseYk()){
                this.qdBox.active=true;
                this.renderQdBox()
                GameManager.I.playOpenSound()
            }
        },this);
        this.qdBox.on(Node.EventType.TOUCH_END,()=>{
            this.qdBox.active=false;
            GameManager.I.playOpenSound()
        },this);
        this.openJuan.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.hasBaseYk()){
                this.juanBox.active=true;
                this.juanList.array=juanStr;
                GameManager.I.playOpenSound()
            }
        },this);
        this.juanBox.on(Node.EventType.TOUCH_END,()=>{
            this.juanBox.active=false;
            GameManager.I.playOpenSound()
        },this);
        this.zmShop.on(Node.EventType.TOUCH_END,()=>{
            UIMgr.I.show(PageType.NpcShopPage,GD.npc_list.get(44),true)
        },this);
        this.buyGpBtn.on(Node.EventType.TOUCH_END,()=>{
            this.buyGpBox.active=true;
            this.buyGpList.array=this.buyGpTypes;
            GameManager.I.playOpenSound()
        },this);
        this.buyGpBox.on(Node.EventType.TOUCH_END,()=>{
            this.buyGpBox.active=false;
            GameManager.I.playOpenSound()
        },this);
        this.buyGpList.cellRender=(node,index)=>{
            let str=this.buyGpList.array[index];
            node.children[2].getComponent(RichText).string=str;
            node.children[1].children[0].active = node==this.selectedJuanNode;
        }
        this.buyGpList.selectedHandler=(node,index)=>{
            if(this.selectedJuanNode){
                this.selectedJuanNode.children[1].children[0].active = false;
            }
            this.selectedJuanNode=node
            node.children[1].children[0].active = true
            GD.playClickSound();
        }
        this.doBuyGpBtn.on(Node.EventType.TOUCH_END,()=>{
            const type=this.buyGpList.selectedIndex
            if(type<0)return
            let zm=GD.role.myZm
            let max=0
            if(type==0){
                //100钻石 兑换 1贡品
                max = zm.DiaNum/100>>0
                if(max==0){
                    UIMgr.I.tip('战盟剩余钻石不足')
                    return
                }
            }else{
                max = zm.PointNum
                if(max==0){
                    UIMgr.I.tip('战盟剩余点数不足')
                    return
                }
            }
            UIMgr.I.PopView.showSliderBox(`${this.buyGpTypes[type]}<br/>您要兑换多少？`,ct.white,max>>0,'兑换',this.doBuyGp)
        },this);
        this.dmgPhBtn.on(Node.EventType.TOUCH_END,this.getBossDmgPh)
        this.atkBtn.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.hasBaseYk()){
                this.tryAtkBoss(false)
            }
        })
        this.sdBossBtn.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.hasBaseYk()){
                this.tryAtkBoss(true)
            }
        })
        this.jsBtn.on(Node.EventType.TOUCH_END,()=>{
            let zm=GD.role.myZm
            if(zm.BossState==UnitState.Death){
                this.doJs()
                // UIMgr.I.PopView.showMsgBox([new BoxMsg(`<br/>该BOSS未被击杀，此时结算无法获得击杀奖励<br/>确定结算？`,ct.brown)],'结算',()=>{
                //     this.doJs()
                // },'取消')
            }
        })
        this.zmJt.on(Node.EventType.TOUCH_END,()=>{
            this.jtBox.active=true;
            this.jtBuffList.array=GD.role.myZm.JTBuffs
            GameManager.I.playOpenSound()
        },this);
        this.jtBox.on(Node.EventType.TOUCH_END,()=>{
            this.jtBox.active=false;
            this.jtBuffList.array=[]
            this.resetMyZmUI(GD.role.myZm)
            GameManager.I.playOpenSound()
        },this);
        this.jtBuffList.cellRender=(node,index)=>{
            let buff:outer_pb.Build=this.jtBuffList.array[index];
            let info=node.children[0].children[0].getComponent(RichText)
            let needRich=node.children[1].getComponent(RichText)
            let btn=node.children[2];
            let btnStr=btn.children[0].getComponent(Label);
            let buffStr=''
            let n=0
            const lv=buff.Lv
            for(let i=1;i<=lv;i++){
                n+=i
            }
            let needDia:number=0;
            let color=ct.yellow
            if(lv==0) color=ct.gray
            let next = lv>=13?'':`<br/><color=${ct.gray}>(下一级+${(lv+1)*2}%)</>`
            if(index==0){
                needDia=GD.configs.get(ConfigType.ZmJTBuff1UpNeedDia)*(lv+1)
                buffStr=`<color=${ct.purple0}>【产量提升 Lv.${lv}】</><br/><color=${color}>战盟所有狩猎场产量提升+${n*2}%</>${next}`
            }else if(index==1){
                needDia=GD.configs.get(ConfigType.ZmJTBuff2UpNeedDia)*(lv+1)
                buffStr=`<color=${ct.blue}>【生命增强 Lv.${lv}】</><br/><color=${color}>所有战盟成员在攻城中最大生命值提升+${n*2}%</>${next}`
            }else if(index==2){
                needDia=GD.configs.get(ConfigType.ZmJTBuff3UpNeedDia)*(lv+1)
                next = lv>=13?'':`<br/><color=${ct.gray}>(下一级+${(lv+1)*0.5}%)</>`
                buffStr=`<color=${ct.green}>【伤害减少 Lv.${lv}】</><br/><color=${color}>所有战盟成员在攻城中受到伤害减少+${n*0.5}%</>${next}`
            }
            info.string=buffStr
            
            btn.off(Node.EventType.TOUCH_END)
            let btnColor=ct.gray
            let needStr='已满级'
            if(buff.IsBuilding){
                needStr=`升级中，还需<color=${ct.brown}>${Tools.getRemainTimeString(buff.Time)}</>`
                btnStr.string='加速'
                btnColor=ct.brown
                btn.on(Node.EventType.TOUCH_END,()=>{
                    this.trySpeedUpTime(1,index)
                })
            }else if(lv<13){
                let zm=GD.role.myZm
                if(zm.DiaNum>=needDia&&lv<zm.HomeBuild.Lv) btnColor=ct.green
                needStr=`升级需要：<color=${ct.qing}>钻石x${needDia}</>、<color=${ct.yellow}>议政大厅</>达到${lv+1}级`
                btnStr.string='升级'
                btn.on(Node.EventType.TOUCH_END,()=>{
                    if(lv>=zm.HomeBuild.Lv){
                        UIMgr.I.tip('议政大厅等级不足')
                        return
                    }
                    if(zm.DiaNum>=needDia){
                        this.tryUpBuildLv(1,index)
                    }else{
                        UIMgr.I.tip('战盟剩余钻石不足')
                    }
                })
            }
            btnStr.color.fromHEX(btnColor)
            needRich.string=needStr
        }
        this.zmDt.on(Node.EventType.TOUCH_END,()=>{
            this.dtBox.active=true;
            this.showDt()
            GameManager.I.playOpenSound()
        },this);
        this.dtBox.on(Node.EventType.TOUCH_END,()=>{
            this.dtBox.active=false;
            this.resetMyZmUI(GD.role.myZm)
            GameManager.I.playOpenSound()
        },this);
        this.hunterBox.on(Node.EventType.TOUCH_END,()=>{
            this.hunterBox.active=false;
            this.resetMyZmUI(GD.role.myZm)
            GameManager.I.playOpenSound()
        },this);
        this.dmgPhList.cellRender = (node:Node,index:number)=>{
            let obj = this.dmgPhList.array[index];
            node.children[0].getComponent(Label).string=obj.name
            node.children[1].getComponent(Label).string=obj.dmg.toLocaleString()
        }
        let stateStr=['离线','托管','在线']
        this.setMemberList.cellRender = (node:Node,index:number)=>{
            let menber:outer_pb.IZmRoleInfo = this.setMemberList.array[index];
            node.children[0].active = menber.Name==GD.role.data.Name
            let jobColor = ZmJobColor[menber.Job]
            let name = node.children[1].getComponent(Label);
            name.string=menber.Name;
            name.color.fromHEX(jobColor)
            let job = node.children[2].getComponent(Label);
            job.string=ZmJobStr[menber.Job];
            job.color.fromHEX(jobColor)
            node.children[3].getComponent(Label).string=menber.Gx+'';
            let qdStr=''
            let qdColor=ct.green
            let qdLabel=node.children[4].getComponent(Label)
            if(menber.QdDay==this.today){
                qdStr=`已签到+${menber.QdNum}`
            }else{
                qdStr=`${Math.min(7,this.today-menber.QdDay)}天前`
                qdColor=ct.gray
            }
            qdLabel.string=qdStr
            qdLabel.color.fromHEX(qdColor)
            let state=node.children[5].getComponent(Label);
            state.string=stateStr[menber.State]
            let color=ct.gray
            if(menber.State==2){
                color=ct.green
            }else if(menber.State==1){
                color=ct.brown
            }
            state.color.fromHEX(color)
        }
        this.allZmList.selectedHandler = (node:Node,index:number)=>{
            let zm:outer_pb.IZmMiniInfo = this.allZmList.array[index];
            let data:any={}
            data.str=`<size=26><color=${ct.blue}>${zm.Name}</></size><br/><br/>战盟等级：${zm.Lv}<br/>战盟人数：${zm.Num}/${zm.Lv*5+20+zm.AddCap}<br/>可申请等级：${zm.NeedZs}转${zm.NeedLv}级<br/><br/><br/>`
            data.name=zm.Name;
            let cb=null; 
            let btnStr='无法加入'
            let role=GD.role;
            if(role.myZm==null&&role.data.Zm==''&&role.data.Lv>=zm.NeedLv&&role.data.ZsNum>=zm.NeedZs){
                cb=this.requestJoinZm
                btnStr='申请加入'
            }
            UIMgr.I.PopView.show(0,data,false,ShowItemType.RequestJoinZm,btnStr,cb);
        }
        this.allZmList.cellRender = (node:Node,index:number)=>{
            let zm:outer_pb.IZmMiniInfo = this.allZmList.array[index];
            node.children[0].active = (GD.role.myZm && zm.Name==GD.role.myZm.Name);
            node.children[1].getComponent(Label).string=`${zm.Name} Lv.${zm.Lv} (${zm.Num}/${zm.Lv*5+20+zm.AddCap})`;
        }
        // this.noZmList.selectedHandler = (node:Node,index:number)=>{
        //     let info:outer_pb.RoleInfo = this.noZmList.array[index];
        //     UIMgr.I.PopView.show(1,info,false)
        // }
        this.noZmList.cellRender = (node:Node,index:number)=>{
            let info:outer_pb.RoleInfo = this.noZmList.array[index];
            let roleBox = node.children[0]
            Tools.get_UI_Role(info,roleBox,true).then((role:RoleUIControl)=>{
                if(info.BodyEquipIds){
                    for(let type=BodyType.Head;type<BodyType.Pet;type++){
                        let id = info.BodyEquipIds[type]
                        role.updateEquipUI(id,type,info.RoleType)
                    }
                }
            });
            // Tools.getOtherUIBox(info.Name,info.Lv,info.DsLv,info.ZsNum,info.RoleType,roleBox).then((role:PlayerControl)=>{
            //     for(let type=BodyType.Head;type<BodyType.Pet;type++){
            //         let id = info.BodyEquipIds[type]
            //         role.updateEquipUI(id,type,info.RoleType)
            //     }
            // });
            roleBox.off(Node.EventType.TOUCH_END)
            roleBox.on(Node.EventType.TOUCH_END,()=>{
                UIMgr.I.PopView.show(1,info,false)
            },this);
            let inviteBtn = node.children[1]
            inviteBtn.off(Node.EventType.TOUCH_END)
            inviteBtn.on(Node.EventType.TOUCH_END,()=>{
                const minLv=GD.configs.get(ConfigType.ZmMinJoinZmNeedLv)
                if(info.Lv>=minLv||info.ZsNum>0){
                    this.inviteOtherJoinMyZm(info.Id)
                }
            },this);
        }
        // this.requestList.selectedHandler = (node:Node,index:number)=>{
        //     let info:outer_pb.RoleInfo = this.requestList.array[index];
        //     UIMgr.I.PopView.show(1,info,false)
        // }
        this.requestList.cellRender = (node:Node,index:number)=>{
            let info:outer_pb.RoleInfo = this.requestList.array[index];
            let roleBox = node.children[0]
            Tools.get_UI_Role(info,roleBox,true).then((role:RoleUIControl)=>{
                if(info.BodyEquipIds){
                    for(let type=BodyType.Head;type<BodyType.Pet;type++){
                        let id = info.BodyEquipIds[type]
                        role.updateEquipUI(id,type,info.RoleType)
                    }
                }
            });
            // Tools.getOtherUIBox(info.Name,info.Lv,info.DsLv,info.ZsNum,info.RoleType,roleBox).then((role:PlayerControl)=>{
            //     for(let type=BodyType.Head;type<BodyType.Pet;type++){
            //         let id = info.BodyEquipIds[type]
            //         role.updateEquipUI(id,type,info.RoleType)
            //     }
            // });
            roleBox.off(Node.EventType.TOUCH_END)
            roleBox.on(Node.EventType.TOUCH_END,()=>{
                UIMgr.I.PopView.show(1,info,false)
            },this);
            let agreeBtn = node.children[1]
            agreeBtn.off(Node.EventType.TOUCH_END)
            agreeBtn.on(Node.EventType.TOUCH_END,()=>{
                this.agreeRequesterJoinMyZm(info.Id,true)
            },this); 
            let disAgreeBtn = node.children[2]
            disAgreeBtn.off(Node.EventType.TOUCH_END)
            disAgreeBtn.on(Node.EventType.TOUCH_END,()=>{
                this.agreeRequesterJoinMyZm(info.Id,false)
            },this); 
        }
        this.addCapBtn.on(Node.EventType.TOUCH_END,()=>{
            const needPoint = GD.configs.get(ConfigType.ZmAddMemberCapNeedPoint)
            let zm=GD.role.myZm;
            let max=Math.min(485-zm.AddCapNum,zm.PointNum/needPoint>>0)
            UIMgr.I.PopView.showSliderBox(`扩容大厅人数上限，需要：${needPoint}点/人<br/><color=${ct.red}>您要扩容几个名额？</><br/><color=${ct.gray}>(从战盟点数中扣除点数)</>`,ct.brown,max,'扩容',(num:number)=>{
                if(zm.PointNum>=needPoint*num){
                    let req = outer_pb.ZmAct.create()
                    req.Num=num
                    let buff=outer_pb.ZmAct.encode(req).finish()
                    WS.send(MT.ZmBuyZmMemberCap,buff,(d:any)=>{
                        let rsp = outer_pb.ZmAct.decode(d)
                        if(rsp.ErrCode==Err.ErrCode_Success){
                            zm.PointNum=rsp.PointNum
                            zm.AddCapNum=rsp.AddCapNum
                            this.showDt()
                            UIMgr.I.tip('扩容成功',ct.green)
                        }else{
                            UIMgr.I.tip('扩容失败')
                        }
                    })
                }else{
                    UIMgr.I.tip('战盟剩余点数不足')
                }
            })
        },this);
        this.dtSpeedUp.on(Node.EventType.TOUCH_END,()=>{
            this.trySpeedUpTime(0)
        },this);
        this.zmCk.on(Node.EventType.TOUCH_END,()=>{
            WS.send(MT.ZmGetCk,GD.EmptyRequestBuff,(d:any)=>{
                let rsp=outer_pb.ZmAct.decode(d)
                if(rsp.ErrCode==Err.ErrCode_Success){
                    GD.role.myZm.Ck=rsp.Ck
                    this.ckbox.active=true
                    this.ckTab.select(0)
                    GameManager.I.playOpenSound()
                }
            })
        },this);
        this.ckbox.on(Node.EventType.TOUCH_END,()=>{
            this.ckbox.active=false
            GameManager.I.playOpenSound()
        },this);
        this.allToMeBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.ckTab.selectedIndex==0){
                if(this.ckList.array.length>0){
                    UIMgr.I.PopView.showMsgBox([new BoxMsg(`<br/>确定将所有未分配的道具全部分配给自己？`,ct.brown)],'确定',()=>{
                        WS.send(MT.ZmAllToMe,GD.EmptyRequestBuff,(d:any)=>{
                            let rsp=outer_pb.ZmAct.decode(d)
                            if(rsp.ErrCode==Err.ErrCode_Success){
                                GD.role.myZm.Ck=rsp.Ck
                                this.ckTab.select(1)
                            }
                        })
                    },'取消')
                }else{
                    UIMgr.I.tip('无未分配道具')
                }
            }
        },this);
        this.getAllMyBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.ckTab.selectedIndex==1){
                if(this.ckList.array.some((item:outer_pb.ZmCkItem)=>{return item.OwnerId==GD.role.data.Id})){
                    UIMgr.I.PopView.showMsgBox([new BoxMsg(`<br/>确定将所有属于我的道具全部取出？`,ct.brown)],'取出',()=>{
                        WS.send(MT.ZmGetAllMyItem,GD.EmptyRequestBuff,(d:any)=>{
                            let rsp=outer_pb.ZmAct.decode(d)
                            if(rsp.ErrCode==Err.ErrCode_Success){
                                GD.role.myZm.Ck=rsp.Ck
                                UIMgr.I.getAndShowResultBox(rsp as any,'从战盟仓库中取出获得')
                                this.ckTab.select(1)
                            }
                        })
                    },'取消')
                }else{
                    UIMgr.I.tip('仓库内没有属于您的道具')
                }
            }
        },this);
        this.openMemberBox.on(Node.EventType.TOUCH_END,()=>{
            this.doOpenMemberBox(0)
        })
        this.memberBox.on(Node.EventType.TOUCH_END,()=>{
            this.memberBox.active=false
            GameManager.I.playOpenSound()
        })
        this.ckTab.selectedHandler=(node:Node,index:number)=>{
            let zm=GD.role.myZm
            this.allToMeBtn.active=index==0
            this.getAllMyBtn.active=index==1
            this.ckCap.node.active=index!=2
            let i=0
            if(index==2){
                i=1
                this.getNewCkHis()
            }else{
                let items=[]
                if(zm.Ck){
                    for(let uid in zm.Ck){
                        items.push(zm.Ck[uid])
                    }
                }
                this.ckCap.string=`${items.length}/30`
                let arr:Array<outer_pb.ZmCkItem>=[]
                if(index==0){
                    arr=items.filter((item:outer_pb.ZmCkItem)=>{return item.OwnerId==0})
                }else{
                    arr=items.filter((item:outer_pb.ZmCkItem)=>{return item.OwnerId>0})
                }
                this.ckList.array=arr
            }
            this.ckView.selectedIndex=i
            GD.playClickSound()
        }
        this.ckHisList.cellRender=(node:Node,index:number)=>{
            node.children[0].getComponent(RichText).string=this.ckHisList.array[index].Msg;
        }
        this.ckList.selectedHandler=(node:Node,index:number)=>{
            let item:outer_pb.ZmCkItem =this.ckList.array[index]
            let actStr=''
            if(GD.role.myZm.Owner==GD.role.data.Name){
                if(this.ckTab.selectedIndex==0){
                    actStr='分配'
                }else{
                    actStr='重新分配'
                }
            }
            this.selectedItem=item;
            if(item.Equip){
                UIMgr.I.PopView.show(PopViewType.ItemInfo,item.Equip,false,ShowItemType.Equip,actStr,this.tryShowSetMemberBox)
            }else{
                let obj=new Item(item.Id,1,false)
                UIMgr.I.PopView.show(PopViewType.ItemInfo,obj,false,ShowItemType.Item,actStr,this.tryShowSetMemberBox)
            }
        }
        this.ckList.cellRender=(node:Node,index:number)=>{
            let item:outer_pb.ZmCkItem =this.ckList.array[index]
            let skin=node.children[0].getComponent(Sprite)
            let num=node.children[1].getComponent(Label)
            let ownerLabel=node.children[2].getComponent(Label)
            let owner:string=''
            if(item.OwnerId>0){
                let c=item.OwnerId==GD.role.data.Id?ct.green:ct.gray
                owner=item.Owner
                ownerLabel.color.fromHEX(c)
            }
            ownerLabel.string=owner
            let info:string
            let infoColor=ct.white
            let path:string=ItemFramePath.Gray;
            let iconId = item.Id
            let itemPath=''
            if(item.Equip){
                let equip=item.Equip
                iconId = equip.Id
                let equipType = iconId/10000>>0
                if(equipType >= EquipType.Pet){
                    info = `Lv.${equip.Lv}`
                    path = ItemFramePath.Purple
                }else{
                    info = `+${equip.QhLv}z${equip.ZjLv}`;
                    if(equip.LuckyLv>0){
                        info+=`xy${equip.LuckyLv}`
                        path = ItemFramePath.Blue
                    }
                    if(equip.ZjLv>0||equip.YsList.length>0){
                        path = ItemFramePath.Blue
                    }
                    if(equip.QhLv>=7){
                        infoColor=ct.yellow
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
                itemPath='ui/equip/'
            }else{
                info = 'x1'//+item.Num;
                // path = ItemFramePath.Yellow
                let base = GD.ItemBaseDatas.get(item.Id)
                if(base) iconId = base.IconId
                itemPath='ui/item/'
            }
            let frame = node.getComponent(Sprite);
            Tools.loadSpriteFrame("muui/" + path,resources).then(sp=>{
                frame.spriteFrame = sp;
            })
            num.string = info;
            num.color.fromHEX(infoColor)
            
            Tools.loadSpriteFrame(itemPath+iconId,GD.commonBundle).then(sp=>{
                skin.spriteFrame = sp;
            })
        }
        this.zmTower.on(Node.EventType.TOUCH_END,()=>{
            this.towerBox.active=true
            this.lastNeedDia=0
            this.towerTab.select(0)
        },this);
        this.towerBox.on(Node.EventType.TOUCH_END,()=>{
            this.towerBox.active=false
            this.resetMyZmUI(GD.role.myZm)
            GameManager.I.playOpenSound()
        },this);
        this.towerTab.selectedHandler=(node:Node,index:number)=>{
            let i=index
            this.lastNeedDia=0
            if(index==0||index==2){
                i=0
                if(index==2&&GD.role.hasEnoughLv(320)==false){
                    this.towerTab.select(0)
                    return
                }
                this.getZmBoss(index)
            }else if(index==1){
                let n=this.reliveFreeNum-GD.role.myZm.ReliveNum
                if(n<0)n=0
                this.reliveNum.string=`今日剩余免费复活Boss次数：${n}次`
                this.bossList.array=GD.BossIdList
                this.bossList.cellRender=this.bossListCellRender
            }else if(index==3){
                i=2
            }
            if(index!=3){
                this.towerInfo.string=index==2?this.kfZmBossInfo:this.myZmBossInfo
            }
            this.towerView.selectedIndex=i;
            GD.playClickSound()
        }
        this.gcHelp.on(Node.EventType.TOUCH_END,()=>{
            UIMgr.I.PopView.showHelpBox(GcHelpInfo)
        })
        this.lastGcPh.on(Node.EventType.TOUCH_END,()=>{
            WS.send(MT.KfGcGetLastGcPh,GD.EmptyRequestBuff,(d:any)=>{
                let rsp = outer_pb.KfGcAct.decode(d)
                if(rsp.PhList.length>0){
                    let phStr='【上周攻城积分排名】：<br/>'
                    rsp.PhList.forEach((z,i)=>{
                        phStr+=`第${i+1}名：${z.Name}  ${z.Jf}积分<br/>`
                    })
                    UIMgr.I.PopView.showHelpBox(phStr)
                }else{
                    UIMgr.I.tip('暂无历史排行数据')
                }
            })
        })
        this.signUpBtn.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.kfGcData.HasSignUp){
                UIMgr.I.tip('已报名')
                return
            }
            if(this.isMengZhu()){
                WS.send(MT.KfGcSignUp,GD.EmptyRequestBuff,(d:any)=>{
                    let rsp=outer_pb.KfGcAct.decode(d)
                    if(GD.role.kfGcData){
                        GD.role.kfGcData.HasSignUp=rsp.HasSignUp
                        GD.role.kfGcData.Num=rsp.Num
                        this.renderGcView()
                    }
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        UIMgr.I.tip('报名成功',ct.green)
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughLv){
                        UIMgr.I.tip('报名失败，大厅等级不足3级，或战盟内城主标识不足200个')
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughNum){
                        UIMgr.I.tip('报名失败，你所在服务器未开放跨服攻城')
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughFbNum){
                        UIMgr.I.tip('报名失败，名额已满')
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughCap){
                        UIMgr.I.tip('报名失败，战盟仓库满了，请先清理仓库')
                    }else{
                        UIMgr.I.tip('报名失败')
                    }
                })
            }
        },this);
        this.addHdExpBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.isMengZhu()){
                let max=GD.role.myZm.PagGold
                if(max>16000)max=16000
                UIMgr.I.PopView.showSliderBox('使用战盟内库存的金币(袋)进行升级护盾',ct.yellow,max,'确定',(num:number)=>{
                    let req = outer_pb.KfGcAct.create()
                    req.Num=num
                    let buff=outer_pb.KfGcAct.encode(req).finish()
                    WS.send(MT.KfGcAddHuDunExp,buff,(d:any)=>{
                        let rsp=outer_pb.KfGcAct.decode(d)
                        if(GD.role.kfGcData){
                            GD.role.kfGcData.HasSignUp=rsp.HasSignUp
                            GD.role.kfGcData.Exp=rsp.Exp
                            this.renderGcView()
                        }
                        if(rsp.ErrCode==Err.ErrCode_Success){
                            UIMgr.I.tip('操作成功',ct.green)
                        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughNum){
                            UIMgr.I.tip('操作失败，战盟内剩余金币袋不足')
                        }else{
                            UIMgr.I.tip('操作失败')
                        }
                    })
                })
            }
        },this);
    }
    onlyOwnerCanDo:string='只有盟主才能操作'
    protected onEnable(): void {
        this.reliveFreeNum=GD.configs.get(ConfigType.ZmReliveBossFreeNum)
        // this.tab.select(0)
    }
    lastRefreshTime:number=0
    getGcData=()=>{
        let now=Tools.getBeiJingSecond();
        if(now-this.lastRefreshTime>3){
            this.lastRefreshTime=now;
            WS.send(MT.KfGcGetData,GD.EmptyRequestBuff,(d:any)=>{
                let rsp=outer_pb.KfGcAct.decode(d)
                GD.role.kfGcData=rsp
                this.renderGcView()
                UIMgr.I.tip('成功加载攻城数据',ct.green)
            })
        }else{
            const data = GD.role.kfGcData
            if(data)this.gcView.selectedIndex=data.Step>=3?3:data.Step
            UIMgr.I.tip('刷新太快了')
        }

    }
    renderGcView=()=>{
        const data = GD.role.kfGcData
        this.gcView.selectedIndex=data.Step>=3?3:data.Step
        //跨服攻城阶段：0未开启，1报名阶段，2准备阶段，3选位置阶段，4进攻阶段
        if(data.Step==KfGcStepType.None){
            //未开启
            this.noGcInfo.string='本期【跨服攻城】暂未开启' 
        }else if(data.Step==KfGcStepType.SignUp){ //1报名阶段
            let str='报名'
            let color=ct.green
            if(data.HasSignUp){
                str='已报名'
                color=ct.gray
            }
            this.signInfo.string=`当前为报名阶段\n已报名不同服战盟数：${data.Num}\n大厅等级>=3级可报名\n报名费：战盟内城主标识200个\n（攻城成功开启时扣除200个城主标识）`
            let signBtnLabel=this.signUpBtn.children[0].getComponent(Label)
            signBtnLabel.string=str
            signBtnLabel.color.fromHEX(color)
        }else if(data.Step==KfGcStepType.Prepare){ //2准备阶段
            this.addHdExpBtn.active=data.HasSignUp
            let info=''
            if(data.HasSignUp){
                let lv=0
                const exp=data.Exp
                let nextLvExp=0
                let curLvExp=0
                if(exp>=15500){
                    lv=5
                    nextLvExp=0
                }else if(exp>=7500){
                    lv=4
                    nextLvExp=8000
                    curLvExp=exp-7500
                }else if(exp>=3500){
                    lv=3
                    nextLvExp=4000
                    curLvExp=exp-3500
                }else if(exp>=1500){
                    lv=2
                    nextLvExp=2000
                    curLvExp=exp-1500
                }else if(exp>=500){
                    lv=1
                    nextLvExp=1000
                    curLvExp=exp-500
                }else{
                    nextLvExp=500
                    curLvExp=exp
                }
                info=`<color=${ct.gray}>您的战盟在本期跨服攻城中的护盾星级：<br/>最终星级=加成星级+升级星级<br/>加成星级=(开服天数-60)/15<br/>(星级可消耗敌人对我方的破城次数)</><br/><br/>你的加成星级：<color=${ct.blue}>${data.Cell.HuDunLv}星</><br/><color=${ct.gray}>(最高5星，每15天减1星)</><br/><br/>当前升级星级：<color=${ct.blue}>${lv}星（${curLvExp}/${nextLvExp}）</><br/><color=${ct.gray}>(可用战盟金币进行升级，每袋金币+1经验)</><color=${ct.gray}><br/>(最高可升至5星)</>`
            }else{
                info='您的战盟未参加本期跨服攻城'
            }
            this.hdLvRich.string=info
        }else if(data.Step>=KfGcStepType.Choice){
            this.scrollView.node.active=data.HasSignUp
            if(data.HasSignUp){
                this.renderGcBox(true)
            }
        }
    }
    tryQd=(type:number)=>{
        let zm=GD.role.myZm
        let today = ((Date.now() / 1000 / 60 + 480) / 1440)>>0;
        if(type==0){
            if(zm.QdDay==today){
                UIMgr.I.tip('今日已签到')
                return
            }
        }else {
            if(zm.QdDay!=today){
                UIMgr.I.tip('请先免费签到')
                return
            }
            if(zm.QdNum>=GD.configs.get(ConfigType.ZmDiaCheckInDayNum)){
                UIMgr.I.tip('今日剩余钻石签到次数不足')
                return
            }
        }
        let req = outer_pb.ZmAct.create()
        req.Type=type
        let buff=outer_pb.ZmAct.encode(req).finish()
        WS.send(MT.ZmCheckIn,buff,(d:any)=>{
            let rsp=outer_pb.ZmAct.decode(d)
            if(rsp.ErrCode==Err.ErrCode_Success){
                let zm=GD.role.myZm
                zm.Gx=rsp.Gx
                GD.role.data.ZmGx=rsp.MyGx
                zm.QdNum=rsp.QdNum
                zm.QdDay=rsp.QdDay
                zm.DiaNum=rsp.DiaNum
                if(req.Type>0){
                    const needDia=GD.configs.get(ConfigType.ZmDiaCheckInNeedDia)
                    GD.role.reduceDia(needDia)
                }
                this.renderQdBox()
                this.resetMyZmUI(zm)
                UIMgr.I.tip(`签到成功，<color=${ct.green}>贡献+${rsp.Num}、战盟贡献+${rsp.Num}</>、<color=${ct.qing}>战盟钻石+${rsp.Num}</>`,ct.green)
            }else{
                UIMgr.I.tip('签到失败')
            }
        })
    }
    // zmCells:Array<Array<outer_pb.ZmCell>>;
    //51, 31, 42, 50, 58, 64, 65, 79, 73, 112, 95, 100, 134, 106, 190, 125
    //戈登、魔王巴拉克、海默
    // zmCellBossIds:Array<number>=[0, 58, 73, 134, 190, 106, 125]
    cellJfList:Array<number>=[0,2,6,18,54,108,324]
    jfColors:Array<ct>=[ct.gray,ct.white,ct.blue,ct.brown,ct.purple,ct.yellow,ct.red]
    onHide(): void {
        // this.cellPool=[];
        this.zmMap.removeAllChildren();
    }
    // cellPool:Array<Node>=[]
    renderGcBox=(resetPos:boolean,cells:outer_pb.IZmCell[]=null)=>{
        const data=GD.role.kfGcData
        if(cells&&cells.length>0){
            data.Cells=cells
        }
        const trans=this.scrollView.content.getComponent(UITransform)
        if(this.zmMap.children.length==0){
            const scale=0.7
            const halfBlockWidth=(280/2+30)*scale
            const halfBolckHeight=(144/2+15)*scale
            trans.width=4600*scale
            trans.height=2400*scale
            this.zmMap.getComponent(Widget).setDirty()
            // this.zmMap.children.forEach(node=>{
            //     this.cellPool.push(node)
            // })
            // this.zmMap.removeAllChildren();
            const halfMapHeight=ZmCellWidth*halfBolckHeight
            for(let i=0;i<ZmCellWidth;i++){
                for(let j=0;j<ZmCellWidth;j++){
                    // 计算x和y坐标，考虑中心为原点
                    let x = (j-i)*halfBlockWidth
                    let y = halfMapHeight-(j + i)*halfBolckHeight-50
                    let node:Node=instantiate(this.zmCellPrefab)
                    // if(this.cellPool.length>0){
                    //     node=this.cellPool.pop()
                    // }else{
                    //     node=instantiate(this.zmCellPrefab)
                    // }
                    let pos:Vec3=node.position
                    pos.x=x
                    pos.y=y
                    node.setPosition(pos)
                    node.parent=this.zmMap
                    const cellId=i*ZmCellWidth+j
                    node.name=cellId+'';

                    
                }
            }
        }
        let myCellNode:Node;
        let zm=GD.role.myZm.Name
        this.zmMap.children.forEach((node,cellId)=>{
            let cell=this.renderCell(cellId,node)
            if(cell&&cell.Lv==0&&cell.Owner==zm){
                myCellNode=node;
            }
        })
        if(resetPos&&myCellNode){
            let aX=0.5+myCellNode.x/trans.width
            let aY=0.5+myCellNode.y/trans.height
            this.scrollView.scrollTo(new Vec2(aX,aY),0.1);
            // this.scrollView.scrollTo(new Vec2(0.5,0.8),0.1);
        }
        if(data.Step==KfGcStepType.Atk){
            let myJf=0
            data.Cells.forEach(cell=>{
                if(cell.Owner==zm&&cell.Lv>0){
                    myJf+=this.cellJfList[cell.Lv]
                }
            })
            this.myZmJf.string=`我的战盟总积分：${myJf}积分   今日剩余可挑战据点：${3-data.AtkCells.length}个`
        }
    }
    renderCell=(cellId:number,node:Node=null):outer_pb.IZmCell=>{
        if(!node){
            node=this.zmMap.getChildByName(cellId+'')
        }
        if(!node){
            alert('zmgc renderCell node=null')
        }
        let zm=GD.role.myZm.Name
        let skinNode=node.children[1]
        let skin=skinNode.getComponent(Sprite)
        let lv=0
        const data=GD.role.kfGcData
        let cell1=data.Cells.find(c=>{return c.Id==cellId})
        if(cell1){
            if(cell1.Owner==zm){
                lv=1
            }else if(cell1.Lv>0){
                if(this.isInMyZmSeeDis(cellId)){
                    lv=2
                }else{
                    lv=3
                }
            }
        }else if(data.Step==KfGcStepType.Choice){
            lv=3
        }
        let plan=node.children[0].getComponent(Sprite)
        Tools.loadSpriteFrame("ui/build/cell" + lv,GD.commonBundle).then(sp=>{
            plan.spriteFrame = sp;
        })
        node.off(Node.EventType.TOUCH_END)
        let name=''
        let path=''
        let color=ct.red
        let jf=0
        let defender=''
        let showCzBox=false
        if(cell1){
            if(data.Step==KfGcStepType.Choice){
                if(cell1.Lv==0){
                    if(cell1.Owner!=''){
                        path='ui/build/zm_hunter'
                        if(cell1.Owner==zm){
                            name=cell1.Owner
                            color=ct.green
                        }else{
                            name='?????'
                        }
                    }else{
                        path='ui/build/zm_hunter0'
                    }                
                }
            }else { 
                //只显示自己的、范围内的据点
                // if(cell1.Owner == zm||(this.isInMyZmSeeDis(cellId)&&cell1.Lv>0)){ //||(cell1.State==ZmCellState.Boss&&cell1.BossId==1005)
                    if(cell1.State==ZmCellState.Boss){
                        // const bossId=this.zmCellBossIds[cell1.Lv]
                        let base=GD.monsterBaseDatas.get(cell1.BossId)
                        let skin=base.Skin
                        path="ui/monster/" + skin
                        showCzBox=cell1.BossId==1005;
                    }else{
                        if(cell1.Owner!=''){
                            path='ui/build/zm_hunter'
                            name=`${cell1.Owner} ${cell1.HuDunLv}星`
                            if(cell1.Owner==zm){
                                color=ct.green
                            }
                        }else{
                            path='ui/build/zm_hunter0'
                        }
                        defender=cell1.DeferName
                    }
                    jf=this.cellJfList[cell1.Lv]
                // }
            }
        }
        if(path!=''){
            node.on(Node.EventType.TOUCH_END,()=>{this.onZmCellClick(cell1,cellId)})
            Tools.loadSpriteFrame(path,GD.commonBundle).then(sp=>{
                skin.spriteFrame = sp;
            })
        }else{
            skin.spriteFrame = null
        }
        let info=skinNode.children[0].getComponent(Label)
        info.string=name
        info.color.fromHEX(color)
        let jfLabel=skinNode.children[2].getComponent(Label)
        if(jf>0){
            jfLabel.string=`${cellId}号:${jf}积分`
            jfLabel.color.fromHEX(this.jfColors[cell1.Lv])
        }else{
            jfLabel.string=''
        }
        skinNode.children[1].getComponent(Label).string=defender
        skinNode.children[3].active=data.AtkCells.indexOf(cellId)>=0;
        skinNode.children[4].active=cell1&&cell1.IsBusy
        skinNode.children[5].active=showCzBox;//城主宝箱
        return cell1
    }
    selectedZmCellId:number=0
    onZmCellClick=(cell:outer_pb.IZmCell,cellId:number)=>{
        const data=GD.role.kfGcData
        let info=''
        if(data.Step==KfGcStepType.Choice){
            if(cell.Lv>0||cell.Owner!='')return
            if(this.isMengZhu()==false)return
            info=`<br/>是否将战盟的初始位置移到此处？<br/>需要：<color=${ct.qing}>战盟钻石x1000</>`
            UIMgr.I.PopView.showMsgBox([new BoxMsg(info,ct.blue)],'确定',(d:string)=>{
                this.switchCell(cellId)
            },'取消')
        }else{
            if(cell.Lv==0){
                //最外一圈格子无法操作它；
                return
            }
            this.getCellData(cellId)
        }

    }
    getCellData=(cellId:number)=>{
        let req = outer_pb.KfGcAct.create()
        req.CellId=cellId
        let buff=outer_pb.KfGcAct.encode(req).finish()
        WS.send(MT.KfGcGetCellData,buff,(d:any)=>{
            let rsp=outer_pb.KfGcAct.decode(d)
            if(rsp.ErrCode==Err.ErrCode_Success){
                let cell = rsp.Cell
                let index=GD.role.kfGcData.Cells.findIndex(c=>{return c.Id==cellId})
                if(index>-1){
                    GD.role.kfGcData.Cells[index]=cell
                }
                this.renderCell(cellId)
                let info=''
                let okBtnStr=''
                if(cell.IsBusy){
                    //处于被攻击中时无法操作它
                    UIMgr.I.tip('该目标正在被挑战中....')
                    return
                }else if(cell.State==ZmCellState.Boss){
                    let cancel=''
                    // const bossId=this.zmCellBossIds[cell.Lv]
                    let base=GD.monsterBaseDatas.get(cell.BossId)
                    info=`<br/><color=${ct.red}>${base.Name}<br/>血量：${cell.Hp.toLocaleString()} / ${cell.MaxHp.toLocaleString()}</><br/><br/>剩余免费挑战次数：${(3-rsp.Num)<0?0:3-rsp.Num}次`
                    info+=`<br/><br/>我的单次伤害：${rsp.Dmg.toLocaleString()}<br/>我的累计伤害：${rsp.TotalDmg.toLocaleString()}<br/><br/><color=${ct.brown}>我的战盟总伤害：${rsp.ZmTotalDmg.toLocaleString()} (${(rsp.ZmTotalDmg/cell.MaxHp*1000>>0)/10}%)<br/><br/>被击杀后我可得钻石：<color=${ct.qing}>${rsp.TotalDmg/cell.MaxHp*this.cellJfList[cell.Lv]*100>>0}</>`
                    let needDia=0
                    if(rsp.Num>=0){
                        if(rsp.Num<3){
                            okBtnStr='挑战'
                        }else{
                            okBtnStr='无法挑战'
                            if(rsp.Dmg>0){
                                needDia=rsp.Cost
                                info+=`<br/><br/>继续扫荡需要：<color=${ct.qing}>${rsp.Cost}钻石</>`
                            }
                        }
                        if(rsp.Dmg>0){
                            cancel='扫荡'
                        }
                    }
                    UIMgr.I.PopView.showMsgBox2([new BoxMsg(info,ct.blue)],okBtnStr,()=>{
                        this.atkCell(cellId,false)
                    },cancel,()=>{
                        if(needDia==0||GD.role.hasEnoughDia(needDia)){
                            this.atkCell(cellId,true)
                        }
                    },true)
                }else{
                    info=`<br/>归属战盟：${cell.Owner} ${cell.HuDunLv}星<br/>驻守者：${cell.DeferName}`
                    if(cell.Owner!=GD.role.myZm.Name){
                        info+=`<br/><br/>剩余挑战次数：${3-rsp.Num}次`
                        if(rsp.Num>=0&&rsp.Num<3){
                            okBtnStr='挑战'
                        }
                        UIMgr.I.PopView.showMsgBox2([new BoxMsg(info,ct.blue)],okBtnStr,()=>{
                            this.atkCell(cellId,false)
                        },'',null,true)
                    }else{
                        //更换、派遣驻守者
                        if(GD.role.data.Name==GD.role.myZm.Owner){
                            if(cell.DeferId>0){
                                okBtnStr='换驻守'
                            }else{
                                okBtnStr='派遣'
                            }
                            this.selectedZmCellId=cellId
                        }
                        UIMgr.I.PopView.showMsgBox2([new BoxMsg(info,ct.blue)],okBtnStr,()=>{
                            this.doOpenMemberBox(2)
                        },'',null,true)
                    }
                }
            }else{
                UIMgr.I.tip('该目标不在可进攻范围内'+rsp.ErrCode)
                return
            }
        })
    }
    switchCell=(cellId:number)=>{
        let req = outer_pb.KfGcAct.create()
        req.CellId=cellId
        let buff=outer_pb.KfGcAct.encode(req).finish()
        WS.send(MT.KfGcSwitchCellId,buff,(d:any)=>{
            let rsp=outer_pb.KfGcAct.decode(d)
            if(rsp.Cells.length>0){
                this.renderGcBox(false,rsp.Cells)
            }
            if(rsp.ErrCode==Err.ErrCode_Success){
                // let me=data.Cells[rsp.CellId]
                // data.Cells[rsp.CellId]=data.Cells[cellId]
                // data.Cells[cellId]=me
                // this.renderCell(cellId)
                // this.renderCell(rsp.CellId)
                UIMgr.I.tip('操作成功',ct.green)
            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughDia){
                UIMgr.I.tip('战盟钻石不足')
            }else if(rsp.ErrCode==Err.ErrCode_CanNotAtkTarget){
                // if(rsp.Cell){
                //     data.Cells[cellId]=rsp.Cell
                //     this.renderCell(cellId)
                // }
                UIMgr.I.tip('该位置已被人占据')
            }else{
                UIMgr.I.tip('无法操作'+rsp.ErrCode)
            }
        })
    }
    err3:string='无法挑战，今日已挑战据点个数已满3个'
    atkCell=(cellId:number,isSd:boolean)=>{
        if(isSd==false){
            let myCells=GD.role.kfGcData.AtkCells
            if(myCells.length>=3&&myCells.indexOf(cellId)<0){
                UIMgr.I.tip(this.err3)
                return
            }
        }
        let req = outer_pb.KfGcAct.create()
        req.CellId=cellId
        req.HasSignUp=isSd;//是否是扫荡模式
        let buff=outer_pb.KfGcAct.encode(req).finish()
        WS.send(MT.KfGcAtkCell,buff,(d:any)=>{
            let rsp=outer_pb.KfGcAct.decode(d)
            if(rsp.AtkCells.length>0){
                GD.role.kfGcData.AtkCells=rsp.AtkCells;
            }
            if(rsp.Cells.length>0){
                this.renderGcBox(false,rsp.Cells)
            }
            if(rsp.ErrCode==Err.ErrCode_Success){
                // let data=GD.role.kfGcData
                // data.Cells[cellId]=rsp.Cell;
                // if(rsp.OldCellId>0){
                //     data.Cells[rsp.OldCellId]=rsp.OldCell;
                // }
                if(rsp.Cost>0)GD.role.reduceDia(rsp.Cost)
                // this.renderGcBox(false)
                UIMgr.I.tip('挑战成功',ct.green)
            }else if(rsp.ErrCode==Err.ErrCode_CanNotAtkTarget){
                UIMgr.I.tip('无法挑战，目标被挑战中...')
            }else if(rsp.ErrCode==Err.ErrCode_CannotUseItem){
                UIMgr.I.tip('无法挑战，身上装备已被其它角色使用过')
            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughNum){
                UIMgr.I.tip('无法挑战，今日对该据点挑战次数已满3次')
            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughItem){
                UIMgr.I.tip(this.err3)
            }
        })
    }
    // 检查指定格子，是否与我战盟势力范围相邻
    isInMyZmSeeDis=(cellId:number):boolean=>{
        const idx = cellId/ZmCellWidth>>0
        const idy = cellId%ZmCellWidth
        	// 添加周围8个格子（不含自身，不含最边上的Cell）
        const maxNum = ZmCellWidth - 1
        const data =GD.role.kfGcData
        const zm=GD.role.myZm.Name
        for (let i = idx - 1; i <= idx+1; i++) {
            if (i < 0 || i > maxNum ){
                continue
            }
            for (let j = idy - 1; j <= idy+1; j++ ){
                if (j < 0 || j > maxNum) {
                    continue
                }
                // 跳过自身
                if (i == idx && j == idy) {
                    continue
                }
                const neighborID = i*ZmCellWidth + j
                const cell = data.Cells.find(c=>{return c.Id==neighborID})
                if (cell&&cell.Owner == zm) {
                    return true
                }
            }
        }
        return false
    }
    renderQdBox=()=>{
        let zm=GD.role.myZm
        let num=GD.configs.get(ConfigType.ZmQdGx)
        let gold=`<br/><color=${ct.gray}>(黄金卡有效期内奖励翻倍)</>`
        this.freeQdRich.string=`免费签到奖励：<br/><color=${ct.green}>个人贡献+${num}、战盟贡献+${num}</>、<color=${ct.qing}>战盟钻石+${num}</>${gold}`
        num=GD.configs.get(ConfigType.ZmDiaCheckInGx)
        const dayNum=GD.configs.get(ConfigType.ZmDiaCheckInDayNum)
        this.diaQdRich.string=`每次钻石签到奖励：<br/><color=${ct.green}>个人贡献+${num}、战盟贡献+${num}</>、<color=${ct.qing}>战盟钻石+${num}</>${gold}<br/>今日剩余钻石签到次数：<color=${ct.qing}>${dayNum-zm.QdNum}</>次<br/><color=${ct.gray}>(每日最多可签到${dayNum}次)</><br/><color=${ct.brown}>钻石签到需要：<color=${ct.qing}>钻石x${GD.configs.get(ConfigType.ZmDiaCheckInNeedDia)}</>/次</>`
        let freeColor=ct.green
        let free='已签到'
        let today = ((Date.now() / 1000 / 60 + 480) / 1440)>>0;
        let freeLabel= this.freeQdBtn.children[0].getComponent(Label)
        if(zm.QdDay!=today){
            free='免费签到'
        }else{
            freeColor=ct.gray
        }
        freeLabel.string=free
        freeLabel.color.fromHEX(freeColor)
    }
    today:number=1
    getMembers=()=>{
        this.today = ((Date.now() / 1000 / 60 + 480) / 1440)>>0;
        let req = outer_pb.ZmAct.create()
        req.Page=this.pageNum
        let buff=outer_pb.ZmAct.encode(req).finish()
        WS.send(MT.ZmGetMembers,buff,(d:any)=>{
            let rsp=outer_pb.ZmAct.decode(d)
            let arr=[]
            if(rsp.ErrCode==Err.ErrCode_Success){
                arr=rsp.Menbers;
            }
            GD.role.myZm.Menbers=arr;
            this.setMemberList.array=arr
            this.pageNum=rsp.Page;
            this.totalPageNum=rsp.TotalPage;
            this.set_page.string=`${this.pageNum}/${this.totalPageNum}`
            let cb:any
            if(this.memberBoxMode==0){
                //大厅的列表
                cb=this.memberListSelectedHandler
                // this.dt_page.string=numStr
            }else if(this.memberBoxMode==1){
                //分配列表
                cb=this.setMemberListSelectedHandler
                // this.set_page.string=numStr
            }else if(this.memberBoxMode==2){
                //派遣
                cb=this.setDefenderSelectedHandler
            }
            this.setMemberList.selectedHandler=cb
        })
    }
    memberListSelectedHandler = (node:Node,index:number)=>{
        let menber:outer_pb.IZmRoleInfo = this.setMemberList.array[index];
        if(menber.Id!=GD.role.data.Id){
            UIMgr.I.PopView.show(1,menber,false,ShowItemType.ZmMenber)
        }
        // if(menber.Id!=GD.role.data.Id){
        //     this.tryRigistGetRoleEvent(node,menber,ShowItemType.ZmMenber)
        // }
    }
    setMemberListSelectedHandler = (node:Node,index:number)=>{
        let info:outer_pb.IZmRoleInfo = this.setMemberList.array[index];
        UIMgr.I.PopView.showMsgBox([new BoxMsg(`<br/>确定将该道具分配给【<color=${ct.blue}>${info.Name}</>】？`,ct.brown)],'确定',(d:any)=>{
            this.memberBox.active=false
            let req = outer_pb.ZmAct.create()
            req.Id=info.Id
            req.Name=this.selectedItem.Uid
            let buff=outer_pb.ZmAct.encode(req).finish()
            WS.send(MT.ZmSetItemToOther,buff,(d:any)=>{
                let rsp = outer_pb.ZmAct.decode(d)
                if(rsp.ErrCode==Err.ErrCode_Success){
                    this.selectedItem.Owner=info.Name
                    this.selectedItem.OwnerId=info.Id
                    this.ckTab.select(this.ckTab.selectedIndex)
                    UIMgr.I.tip('分配成功',ct.green)
                }else{
                    UIMgr.I.tip('分配失败')
                }
            })
        },'取消')
    }
    //派遣
    setDefenderSelectedHandler = (node:Node,index:number)=>{
        let info:outer_pb.IZmRoleInfo = this.setMemberList.array[index];
        if(info.State==0){
            UIMgr.I.tip('无法派遣离线成员')
            return
        }
        UIMgr.I.PopView.showMsgBox([new BoxMsg(`<br/>确定将【<color=${ct.blue}>${info.Name}</>】派遣到此据点？`,ct.brown)],'确定',(d:any)=>{
            this.memberBox.active=false
            let req = outer_pb.KfGcAct.create()
            req.Id=info.Id
            req.CellId=this.selectedZmCellId
            let buff=outer_pb.KfGcAct.encode(req).finish()
            WS.send(MT.KfGcSetDefender,buff,(d:any)=>{
                let rsp = outer_pb.KfGcAct.decode(d)
                if(rsp.Cells.length>0){
                    this.renderGcBox(false,rsp.Cells)
                }
                if(rsp.ErrCode==Err.ErrCode_Success){
                    // GD.role.kfGcData.Cells[rsp.CellId]=rsp.Cell;
                    // this.renderCell(rsp.CellId)
                    // if(rsp.OldCellId>0){
                    //     GD.role.kfGcData.Cells[rsp.OldCellId]=rsp.OldCell;
                    //     this.renderCell(rsp.OldCellId)
                    // }
                    UIMgr.I.tip('派遣成功',ct.green)
                }else{
                    UIMgr.I.tip('派遣失败')
                }
            })
        },'取消')
    }
    getNewCkHis=()=>{
        let zm=GD.role.myZm
        let req = outer_pb.ZmAct.create()
        req.ExitTime=zm.CkHis&&zm.CkHis.length>0?zm.CkHis[0].Time:0
        let buff=outer_pb.ZmAct.encode(req).finish()
        WS.send(MT.ZmGetNewCkActHis,buff,(d:any)=>{
            let rsp=outer_pb.ZmAct.decode(d)
            if(rsp.ErrCode==Err.ErrCode_Success){
                if(!zm.CkHis)zm.CkHis=[]
                if(rsp.CkHis.length>0){
                    zm.CkHis.push(...rsp.CkHis)
                }
                this.ckHisList.array=zm.CkHis.sort((a,b)=>{return b.Time-a.Time});
            }
        })
    }
    tryShowSetMemberBox=(d:any)=>{
        this.doOpenMemberBox(1)
    }
    doOpenMemberBox=(mode:number)=>{
        this.memberBoxMode=mode
        this.memberBox.active=true
        this.pageNum=1
        this.getMembers()
        GameManager.I.playOpenSound()
    }
    tryAtkBoss=(isSd:boolean)=>{
        let type = this.towerTab.selectedIndex==0?0:1
        let zm=GD.role.myZm
        if(zm.BossId==0||zm.BossState==UnitState.Death){
            UIMgr.I.tip('当前Boss已被击杀')
            return
        }
        if(isSd&&GD.role.atkCurZmBossDmg==0){
            UIMgr.I.tip('暂无伤害记录')
            return
        }
        const atkNum = GD.role.atkCurZmBossNum
        if(atkNum>=GD.configs.get(ConfigType.ZmSdKfBossMaxNum)){
            UIMgr.I.tip('剩余可挑战次数不足')
            return
        }
        let needDia=0
        if(this.getRemainAtkBossNum(atkNum)<=0){
            needDia=GD.configs.get(ConfigType.ZmSdBossNeedDia)
            if(type!=0){
                //除了免费次数，初始需要needDia，然后每10次递增20
                needDia = needDia+((atkNum-1)/10>>0)*20
            }
        }
        if(needDia>0){
            if(GD.role.hasEnoughDia(needDia)){
                if(this.lastNeedDia!=needDia){
                    this.lastNeedDia=needDia
                    let t = isSd?'扫荡':'挑战'
                    UIMgr.I.PopView.showMsgBox([new BoxMsg(`<br/>继续${t}该BOSS需要：<color=${ct.qing}>钻石x${needDia}</><br/>确定${t}？`,ct.brown)],t,()=>{
                        this.doAtkBoss(type,isSd)
                    },'取消')
                }else{
                    this.doAtkBoss(type,isSd)
                }
            }
        }else{
            this.doAtkBoss(type,isSd)
        }
    }
    lastNeedDia:number=0
    doJs=()=>{
        WS.send(MT.ZmJsBoss,GD.EmptyRequestBuff,(d:any)=>{
            let rsp=outer_pb.ZmAct.decode(d)
            if(rsp.ErrCode==Err.ErrCode_Success){
                let zm=GD.role.myZm
                zm.BossId=0
                zm.BossHp=0
                zm.BossState=0
                GD.role.atkCurZmBossDmg=0
                GD.role.atkCurZmBossNum=0
                GD.role.atkCurZmBossTotalDmg=0
                zm.Gx=rsp.Gx
                zm.DiaNum=rsp.DiaNum
                GD.role.data.ZmGx=rsp.MyGx
                this.setBossUi(0)
                let msgs:Array<BoxMsg>=[]
                msgs.push(new BoxMsg('结算奖励：<br/>',ct.white))
                msgs.push(new BoxMsg(`我的贡献+${rsp.Num}<br/>`,ct.blue))
                msgs.push(new BoxMsg(`战盟总贡献+${rsp.Len}`,ct.blue))
                msgs.push(new BoxMsg(`战盟钻石+${rsp.Len}`,ct.qing))
                msgs.push(new BoxMsg('所有参与成员获得应得贡献值<br/>',ct.blue))
                msgs.push(new BoxMsg('掉落物品：已放入战盟仓库',ct.gray))
                if(rsp.Items){
                    for(let idStr in rsp.Items){
                        let id=parseInt(idStr)
                        let base=GD.ItemBaseDatas.get(id)
                        msgs.push(new BoxMsg(`${base.Name}x${rsp.Items[idStr]}`,Tools.getItemColor(id)))
                    }
                }
                if(rsp.Equips.length>0){
                    rsp.Equips.forEach(equip=>{
                        msgs.push(Tools.newGetEquipMsg(equip,true,false))
                    })
                }
                UIMgr.I.PopView.showMsgBox(msgs,'关闭')
                GameManager.I.playTipSound('ding')
                GameManager.I.playTipSound('getItem')
            }else{
                UIMgr.I.tip('结算失败')
            }
        })
    }
    doAtkBoss=(type:number,isSd:boolean)=>{
        let req = outer_pb.ZmAct.create()
        req.Type=type
        req.IsSj=isSd //是否是扫荡
        let buff=outer_pb.ZmAct.encode(req).finish()
        WS.send(MT.ZmAtkBoss,buff,(d:any)=>{
            let rsp=outer_pb.ZmAct.decode(d)
            if(rsp.ErrCode==Err.ErrCode_Success){
                let zm=GD.role.myZm
                zm.BossHp=rsp.BossHp
                zm.BossState=rsp.BossState
                GD.role.atkCurZmBossDmg=rsp.Dmg
                GD.role.atkCurZmBossNum=rsp.Num
                GD.role.atkCurZmBossTotalDmg=rsp.TotalDmg
                if(type!=0){
                    this.curKfBossTotalDmg=rsp.ExitTime
                }
                if(rsp.DiaNum>0)GD.role.reduceDia(rsp.DiaNum)
                this.setBossUi(type)
                UIMgr.I.tip('扫荡成功',ct.green)
            }else if(rsp.ErrCode==Err.ErrCode_StartSeizeBuffHole){
                if(rsp.DiaNum>0)GD.role.reduceDia(rsp.DiaNum)
                UIMgr.I.tip('开始挑战...',ct.green)
                UIMgr.I.hideCurPage();
            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughItem){
                UIMgr.I.tip('无法挑战当前BOSS，身上装备已被其它角色使用过')
            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughCap){
                UIMgr.I.tip('无法挑战，战盟仓库满了，请先清理')
            }else{
                UIMgr.I.tip('无法挑战')
            }
        })
    }
    getBossDmgPh=()=>{
        let req = outer_pb.ZmAct.create()
        req.Type=this.towerTab.selectedIndex==0?0:1
        let buff=outer_pb.ZmAct.encode(req).finish()
        WS.send(MT.ZmGetDmgPh,buff,(d:any)=>{
            let rsp=outer_pb.ZmAct.decode(d)
            if(rsp.ErrCode==Err.ErrCode_Success){
                let list=[]
                for(let name in rsp.DmgPh){
                    list.push({name:name,dmg:rsp.DmgPh[name]})
                }
                list.sort((a,b)=>{return b.dmg-a.dmg});
                this.dmgPhList.array=list
                this.towerTab.select(3)
            }else{
                UIMgr.I.tip('获取失败')
            }
        })
    }
    activeBossNeedHomeBuildLv=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 13, 13, 13]
    bossListCellRender=(node:Node,index:number)=>{
        let id=this.bossList.array[index]
        let m=GD.monsterBaseDatas.get(id)
        // if(!m)return
        let zm = GD.role.myZm
        let color=ct.gray
        let btnStr:string
        let btnColor=ct.brown
        let showBtn=true
        // let need=''
        let needGp=0
        if(index==zm.ZmBossIndex){
            //未激活
            btnStr='激活'
            needGp=GD.configs.get(ConfigType.ZmActiveBossNeedGp)*Math.pow(2,index)
        }else if(index>zm.ZmBossIndex){
            //不可激活
            btnStr=''
            showBtn=false
        }else{
            //已激活
            btnStr='复活'
            btnColor=ct.green
            color=ct.red
        }
        let btn = node.children[1]
        btn.active=showBtn
        btn.off(Node.EventType.TOUCH_END)
        if(showBtn){
            let btnLabel = btn.children[0].getComponent(Label)
            btnLabel.string=btnStr
            btnLabel.color.fromHEX(btnColor)
            if(index==zm.ZmBossIndex){
                //注册激活方法
                btn.on(Node.EventType.TOUCH_END,()=>{
                    if(this.isMengZhu()){
                        UIMgr.I.PopView.showMsgBox([new BoxMsg(`<br/>激活该BOSS需要：<br/><color=${ct.purple0}>贡品x${needGp}、议政大厅 Lv.${index+1}</><br/>确定激活该BOSS？`,ct.brown)],'激活',()=>{
                            if(zm.HomeBuild.Lv>=index+1){
                                if(zm.GpNum>=needGp){
                                    WS.send(MT.ZmUpZmBossTypeLv,GD.EmptyRequestBuff,(d:any)=>{
                                        let rsp=outer_pb.ZmAct.decode(d)
                                        if(rsp.ErrCode==Err.ErrCode_Success){
                                            zm.ZmBossIndex=rsp.ZmBossIndex
                                            zm.GpNum=rsp.GpNum
                                            this.bossList.refresh()
                                            UIMgr.I.tip('激活成功',ct.green)
                                        }else{
                                            UIMgr.I.tip('激活失败')
                                        }
                                    })
                                }else{
                                    UIMgr.I.tip('战盟剩余贡品不足')
                                }
                            }else{
                                UIMgr.I.tip('议政大厅等级不足'+(index+1))
                            }
                        },'取消')
                    }
                })
            }else{
                //注册复活方法
                btn.on(Node.EventType.TOUCH_END,()=>{
                    this.reliveBoss(index)
                })
            }
        }
        let name=node.children[0].children[0].getComponent(RichText)
        let gx=0
        for(let i=0;i<=index;i++){
            gx+=(i+1)*50
        }
        name.string=`<color=${color}>Lv.${m.Lv} ${m.Name}<br/><color=${ct.gray}>（掉落：贡献x${gx}、<u><color=${ct.gray} click="onClick" param="z|${id}">其它物品</></u>)</></>`;
    }
    curKfBossTotalDmg:number=0 //我的战盟总伤害
    getZmBoss=(type:number)=>{
        let req=outer_pb.ZmAct.create()
        req.Type=type //0我的战盟boss、大于0表示跨服战盟boss
        let buff=outer_pb.ZmAct.encode(req).finish()
        WS.send(MT.ZmGetBoss,buff,(d:any)=>{
            let zm=GD.role.myZm
            let rsp=outer_pb.ZmAct.decode(d)
            if(rsp.ErrCode==Err.ErrCode_Success){
                zm.BossId=rsp.BossId
                zm.BossHp=rsp.BossHp
                if(type==0){
                    zm.ReliveNum=rsp.ReliveNum
                    zm.IsSj=rsp.IsSj
                }else{
                    this.curKfBossTotalDmg=rsp.ExitTime
                }
                zm.BossState=rsp.BossState
                GD.role.atkCurZmBossDmg=rsp.Dmg
                GD.role.atkCurZmBossNum=rsp.Num
                GD.role.atkCurZmBossTotalDmg=rsp.TotalDmg
            }else{
                zm.BossId=0
                UIMgr.I.tip('获取BOSS数据失败')
            }
            this.setBossUi(type)
        })
    }
    setBossUi=(type:number)=>{
        let zm=GD.role.myZm
        let bossId=zm.BossId
        let num=''
        let sj=''
        let gx=0
        let zmGet=''
        if(type==0){
            let n=this.reliveFreeNum-zm.ReliveNum
            if(n<0)n=0
            num=`今日剩余免费复活Boss次数：${n}次`
        }
        this.bossName.node.parent.active=bossId>0
        this.reliveNum.string=num
        if(bossId>0){
            let zm=GD.role.myZm
            let base = GD.monsterBaseDatas.get(zm.BossId);
            this.bossName.string=`Lv.${base.Lv} 冷血的【${base.Name}】`
            const filePath:string = "ui/monster/" + base.Skin;
            Tools.loadSpriteFrame(filePath,GD.commonBundle).then(sp=>{
                if(sp){
                    this.bossSkin.spriteFrame=sp
                }
            })
            let hpRate=GD.configs.get(ConfigType.ZmBossMaxHpRate)
            if(GD.role.data.IsYkMode){
                hpRate=hpRate/2
            }
            if(bossId==999)hpRate=hpRate*2 //跨服2倍
            const hp = base.Hp*hpRate
            if(type==0){
                sj=zm.IsSj?'随机':'手动'
                sj = `<br/>当前Boss分配方式：<color=${ct.red}>${sj}</><br/><br/><u><color=${ct.gray} click="onClick" param="z|${zm.BossId}">战盟Boss掉落说明</></u>`
                let index=GD.BossIdList.findIndex(v=>{return v==bossId})
                for(let i=0;i<=index;i++){
                    gx+=(i+1)*50
                }
                let getGx=(hp-zm.BossHp)/hp*gx>>0
                zmGet = `<br/>战盟可得：<color=${ct.blue}>贡献x${getGx}</>、<color=${ct.qing}>钻石x${getGx}</>`
            }else{
                //跨服战盟boss
                gx = 100000
                let getGx=(this.curKfBossTotalDmg/hp)*100000>>0
                zmGet = `<br/>战盟总伤害：<color=${ct.brown}>${this.curKfBossTotalDmg.toLocaleString()}</>（${(this.curKfBossTotalDmg/hp*1000>>0)/10}%）`
                zmGet += `<br/>战盟可得：<color=${ct.blue}>贡献x${getGx}</>、<color=${ct.qing}>钻石x${getGx}</>、<color=${ct.purple0}>贡品x${getGx/10>>0}</>`
                sj=`<br/><u><color=${ct.gray} click="onClick" param="z|${999}">跨服战盟Boss掉落说明</></u>`
            }
            this.hpBar.progress = zm.BossHp/hp;
            this.bossHp.string=`${zm.BossHp.toLocaleString()} / ${hp.toLocaleString()}`
            let nameColor=ct.red
            let showJsBtn=false
            let showAtkBtn=true
            if(zm.BossState==UnitState.Death){
                nameColor=ct.gray
                showJsBtn = type==0&&GD.role.data.Name==zm.Owner
                showAtkBtn=false
            }
            this.bossSkin.grayscale=!showAtkBtn
            this.jsBtn.active=showJsBtn;
            this.atkBtn.active=this.sdBossBtn.active=showAtkBtn
            this.bossName.color.fromHEX(nameColor)
            gx = (gx*GD.role.atkCurZmBossTotalDmg/hp)>>0
            let myPer= (GD.role.atkCurZmBossTotalDmg/hp*1000>>0)/10

            let needDiaStr=''
            const atkNum = GD.role.atkCurZmBossNum
            const remainFreeNum=this.getRemainAtkBossNum(atkNum)
            if(remainFreeNum<=0){
                let needDia=GD.configs.get(ConfigType.ZmSdBossNeedDia)
                if(type!=0){
                    //除了免费次数，初始需要needDia，然后每10次递增20
                    needDia = needDia+((atkNum-1)/10>>0)*20
                }
                needDiaStr=`<br/>下一次挑战或扫荡需要：<color=${ct.qing}>钻石x${needDia}</>（剩${GD.configs.get(ConfigType.ZmSdKfBossMaxNum)-atkNum}次）`
            }
            this.bossRich.string=`您对当前Boss剩余可免费挑战次数：<color=${ct.green}>${remainFreeNum}次</><br/>最近1次伤害：<color=${ct.brown}>${GD.role.atkCurZmBossDmg.toLocaleString()}</>（第${atkNum}次）<br/>您的总伤害：<color=${ct.brown}>${GD.role.atkCurZmBossTotalDmg.toLocaleString()}</>（${myPer}%）<br/>您可分得：<color=${ct.blue}>贡献x${gx}</>${needDiaStr}<br/><color=${ct.gray}>${zmGet}<br/>(按总伤害百分比分配奖励数量)${sj}</>`
        }
    }
    getRemainAtkBossNum=(num:number):number=>{
        let maxNum = GD.configs.get(ConfigType.ZmFreeAtkBossNum)
        if(GD.role.hasGoldYk(false)) {
            maxNum = GD.configs.get(ConfigType.ZmFreeAtkBossNumGoldYk)
        }
        let freeNum = maxNum-num
        if(freeNum<0){
            freeNum=0
        }
        return freeNum
    }
    reliveFreeNum:number=0
    reliveBoss=(index:number)=>{
        let zm=GD.role.myZm
        if(this.isMengZhu()){
            if(zm.BossId==0){
                let needGp=0
                if(zm.ReliveNum>=this.reliveFreeNum){
                    let bossId=GD.BossIdList[index]
                    let base = GD.monsterBaseDatas.get(bossId);
                    needGp=base.Lv*GD.configs.get(ConfigType.ZmReliveBossNeedGpNum)
                }
                UIMgr.I.PopView.showMsgBox([new BoxMsg(`<br/>复活该BOSS需要：<color=${ct.purple0}>贡品x${needGp}</><br/>确定复活该BOSS？`,ct.brown)],'复活',()=>{
                    if(zm.GpNum>=needGp){
                        let req=outer_pb.ZmAct.create()
                        req.Num=index
                        let buff=outer_pb.ZmAct.encode(req).finish()
                        WS.send(MT.ZmReliveZmBoss,buff,(d:any)=>{
                            let rsp=outer_pb.ZmAct.decode(d)
                            if(rsp.ErrCode==Err.ErrCode_Success){
                                zm.GpNum=rsp.GpNum
                                this.towerTab.select(0)
                                UIMgr.I.tip('复活成功',ct.green)
                            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughCap){
                                UIMgr.I.tip('战盟仓库剩余容量不足，请先取出物品')
                            }else{
                                UIMgr.I.tip('无法复活')
                            }
                        })
                    }else{
                        UIMgr.I.tip('战盟剩余贡品不足')
                    }
                },'取消')
            }else{
                UIMgr.I.tip('当前已存在BOSS，请先击杀并结算')
            }
        }
    }
    trySpeedUpTime=(type:number,index:number=0)=>{
        if(this.isMengZhu()){
            const perPoint = GD.configs.get(ConfigType.ZmSpeedUpBuildNeedPoint)
            let zm=GD.role.myZm;
            let time=0
            if(type==0){
                time=zm.HomeBuild.Time
            }else if(type==1){
                time=zm.JTBuffs[index].Time
            }else if(type==2){
                time=zm.Hunters[index].Time
            }
            let remainHour = ((time-Tools.getBeiJingSecond())/3600+1)>>0
            if(remainHour>0){
                let max=Math.min(zm.PointNum/perPoint>>0,remainHour)
                UIMgr.I.PopView.showSliderBox(`加速建造需要：${perPoint}点/小时<br/><color=${ct.red}>您要加速几小时？</><br/><color=${ct.gray}>(从战盟点数中扣除点数)</>`,ct.brown,max,'加速',(num:number)=>{
                    if(num>0&&zm.PointNum>=perPoint*num){
                        let req = outer_pb.ZmAct.create()
                        req.Num=num
                        req.Type=type
                        req.Page=index
                        let buff=outer_pb.ZmAct.encode(req).finish()
                        WS.send(MT.ZmSpeedUpBuildTime,buff,(d:any)=>{
                            let rsp = outer_pb.ZmAct.decode(d)
                            if(rsp.ErrCode==Err.ErrCode_Success){
                                zm.PointNum=rsp.PointNum
                                if(type==0){
                                    zm.HomeBuild=rsp.HomeBuild
                                    this.showDt()
                                }else if(type==1){
                                    zm.JTBuffs=rsp.JTBuffs
                                    this.jtBuffList.array=zm.JTBuffs
                                }else if(type==2){
                                    zm.Hunters=rsp.Hunters
                                    this.showHunter(index)
                                }
                                UIMgr.I.tip('加速成功',ct.green)
                                UIMgr.I.showProsMsg(`战盟点数-${rsp.Num}`,ct.brown)
                            }else{
                                UIMgr.I.tip('加速失败')
                            }
                        })
                    }else{
                        UIMgr.I.tip('战盟剩余点数不足')
                    }
                })
            }
        }
    }
    tryUpBuildLv=(type:number,index:number)=>{
        if(this.isMengZhu()){
            UIMgr.I.PopView.showMsgBox([new BoxMsg('<br/>确定开始升级该建筑？',ct.brown)],'升级',(d:string)=>{
                let req = outer_pb.ZmAct.create()
                req.Type=type
                req.Num=index
                let buff=outer_pb.ZmAct.encode(req).finish()
                WS.send(MT.ZmUpBuildLv,buff,(d:any)=>{
                    let rsp = outer_pb.ZmAct.decode(d)
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        let zm=GD.role.myZm
                        zm.BzSpNum=rsp.BzSpNum
                        zm.ZySpNum=rsp.ZySpNum
                        zm.DiaNum=rsp.DiaNum
                        zm.Gx=rsp.Gx
                        zm.UsedGx=rsp.UsedGx
                        if(rsp.Type==0){
                            zm.HomeBuild=rsp.HomeBuild
                            this.showDt()
                        }else if(rsp.Type==1){
                            zm.JTBuffs=rsp.JTBuffs
                            this.jtBuffList.array=zm.JTBuffs
                        }else if(rsp.Type==2){
                            zm.Hunters=rsp.Hunters
                            this.showHunter(index)
                        }
                        UIMgr.I.tip('开始升级....',ct.green)
                    }else{
                        UIMgr.I.tip('无法升级')
                    }
                })
            },'取消')
        }
    }
    showHunter=(index:number)=>{
        let zm = GD.role.myZm
        let hunter = zm.Hunters[index]
        this.hunterBox.active=true
        const lv=hunter.Lv
        let build = ''
        let infoStr=''
        let showUpBtn=false
        let showSpeed=false
        this.hunterUpBtn.off(Node.EventType.TOUCH_END)
        this.hunterSpeedUp.off(Node.EventType.TOUCH_END)
        const outPut=this.hunterOutput[hunter.Lv];
        if(hunter.IsBuilding){
            showSpeed=true
            build = `升级中，还需<color=${ct.brown}>${Tools.getRemainTimeString(hunter.Time)}</>`
            this.hunterSpeedUp.on(Node.EventType.TOUCH_END,()=>{this.trySpeedUpTime(2,index)},this);
        }else if(lv<13){
            showUpBtn=true
            this.bzSpBar.node.active=this.zySpBar.node.active=true;
            let needBz = GD.configs.get(ConfigType.ZmHunterUpNeedBzSpNum) * Math.pow(2, lv)
            let needZy = GD.configs.get(ConfigType.ZmHunterUpNeedZySpNum) * Math.pow(2, lv)
            build = `<color=${ct.gray}>下一级产量+${this.hunterOutput[hunter.Lv+1]-outPut}，升到下一级需要：</><br/><color=${zm.HomeBuild.Lv>lv?ct.yellow:ct.gray}>议政大厅 Lv.${lv+1}级</>`
            let color=ct.gray
            if(zm.BzSpNum>=needBz&&zm.ZySpNum>=needZy&&zm.HomeBuild.Lv>lv){
                color=ct.green
            }
            this.hunterUpBtn.on(Node.EventType.TOUCH_END,()=>{
                if(zm.BzSpNum<needBz){
                    UIMgr.I.tip('战盟剩余【爆竹装备碎片】不足')
                    return
                }
                if(zm.ZySpNum<needZy){
                    UIMgr.I.tip('战盟剩余【卓越碎片】不足')
                    return
                }
                if(lv>=zm.HomeBuild.Lv){
                    UIMgr.I.tip('议政大厅等级不足')
                    return
                }
                this.tryUpBuildLv(2,index)
            })
            this.hunterUpBtn.children[0].getComponent(Label).color.fromHEX(color);
            this.bzSpBar.progress=zm.BzSpNum/needBz
            this.bzSpBar.node.children[1].getComponent(Label).string=`爆竹装备碎片：${zm.BzSpNum.toLocaleString()} / ${needBz.toLocaleString()}`
            this.zySpBar.progress=zm.ZySpNum/needZy
            this.zySpBar.node.children[1].getComponent(Label).string=`卓越碎片：${zm.ZySpNum.toLocaleString()} / ${needZy.toLocaleString()}`
        }else{
            build = '已满级'
        }
        this.hunterSpeedUp.active=showSpeed
        this.hunterUpBtn.active=this.bzSpBar.node.active=this.zySpBar.node.active=showUpBtn;
        infoStr=`<color=${ct.yellow}>狩猎场 Lv.${lv}</><br/>产量：<color=${ct.purple0}>贡品x${outPut}/每小时</><br/>${build}`
        this.hunterRich.string=infoStr
        GameManager.I.playOpenSound()
    }
    showDt=()=>{
        let zm = GD.role.myZm
        this.addCapBtn.active=zm.Owner==GD.role.data.Name
        let buffs=[]
        let infoStr=''
        this.dtUpBtn.off(Node.EventType.TOUCH_END)
        if(zm){
            const lv=zm.HomeBuild.Lv
            let build = ''
            let showUpBtn=false
            let showSpeed=false
            if(zm.HomeBuild.IsBuilding){
                showSpeed=true
                build = `升级中，还需<color=${ct.brown}>${Tools.getRemainTimeString(zm.HomeBuild.Time)}</>`
            }else if(lv<13){
                showUpBtn=true
                this.dtDiaBar.node.active=this.dtGxBar.node.active=true;
                let needDia = GD.configs.get(ConfigType.ZmHomeBuildUpNeedDia) * Math.pow(2, lv)
				let needGx = GD.configs.get(ConfigType.ZmHomeBuildUpNeedGx) * Math.pow(2, lv)
                build = `升到下一级需要：<br/>`
                let color=ct.gray
                if(zm.DiaNum>=needDia&&zm.Gx>=needGx){
                    color=ct.green
                }
                this.dtUpBtn.on(Node.EventType.TOUCH_END,()=>{
                    if(zm.DiaNum<needDia){
                        UIMgr.I.tip('战盟剩余【钻石】不足')
                        return
                    }
                    if(zm.Gx<needGx){
                        UIMgr.I.tip('战盟剩余【贡献】不足')
                        return
                    }
                    this.tryUpBuildLv(0,0)
                })
                this.dtUpBtn.children[0].getComponent(Label).color.fromHEX(color);
                this.dtDiaBar.progress=zm.DiaNum/needDia
                this.dtDiaBar.node.children[1].getComponent(Label).string=`钻石：${zm.DiaNum.toLocaleString()} / ${needDia.toLocaleString()}`
                this.dtGxBar.progress=zm.Gx/needGx
                this.dtGxBar.node.children[1].getComponent(Label).string=`贡献：${zm.Gx.toLocaleString()} / ${needGx.toLocaleString()}`
            }else{
                build = '已满级'
            }
            this.dtSpeedUp.active=showSpeed
            this.dtUpBtn.active=this.dtDiaBar.node.active=this.dtGxBar.node.active=showUpBtn;
            this.gcBuffInfo.string=`攻城奖励Buff效果提升百分比：${zm.UpBuffNum}%`
            let upRate=1+zm.UpBuffNum/100
            infoStr=`<color=${ct.yellow}>议政大厅 Lv.${lv}</><br/><color=${ct.blue}>人数</><color=${ct.brown}>/上限</>：${zm.Len} / <color=${ct.brown}>${lv*5+20}(+${zm.AddCapNum})</><br/>${build}`
            buffs=[
                `<color=${lv>=1?ct.yellow:ct.gray}>杀怪获得金币提升+${lv<1?'(10xLv)':10*lv*upRate>>0}%</>`,
                `<color=${lv>=2?ct.green:ct.gray}>最大生命值+${lv<2?'(10xLv)':10*lv*upRate>>0}</>`,
                `<color=${lv>=3?ct.blue:ct.gray}>防御力+${lv<3?'(5xLv)':5*lv*upRate>>0}</>`,
                `<color=${lv>=4?ct.blue:ct.gray}>抵抗幸运一击概率+${lv<4?'(Lv)':lv*upRate>>0}%</>`,
                `<color=${lv>=5?ct.green:ct.gray}>抵抗卓越一击概率+${lv<5?'(Lv)':(lv/2*10*upRate>>0)/10}%</>`,
                `<color=${lv>=6?ct.qing:ct.gray}>抵抗双倍打击概率+${lv<6?'(Lv/2.5)':(lv/2.5*10*upRate>>0)/10}%</>`,
                `<color=${lv>=7?ct.purple:ct.gray}>抵抗无视一击概率+${lv<7?'(Lv/3)':(lv/3*10*upRate>>0)/10}%</>`,
                `<color=${lv>=8?ct.brown:ct.gray}>最大攻击力+${lv<8?'(5xLv)':5*lv*upRate>>0}</>`,
                `<color=${lv>=9?ct.blue:ct.gray}>杀怪泡点任务奖励经验提升+${lv<9?'(2xLv)':2*lv*upRate>>0}%</>`,
                `<color=${lv>=10?ct.purple:ct.gray}>所有元素防御力+${lv<10?'(10xLv)':10*lv*upRate>>0}</>`,
                `<color=${lv>=11?ct.brown:ct.gray}>伤害提升+${lv<11?'(2xLv)':2*lv*upRate>>0}%</>`,
                `<color=${lv>=12?ct.purple:ct.gray}>对BOSS伤害提升+${lv<12?'(2xLv)':3*lv*upRate>>0}%</>`,
                `<color=${lv>=13?ct.purple:ct.gray}>所有技能等级+${5*upRate>>0}</>`,
            ]
        }
        this.dtBuffList.cellRender=this.renderBuffList;
        this.dtBuffList.array=buffs
        this.dtInfoRich.string=infoStr
    }
    renderBuffList=(node:Node,index:number)=>{
        let buff=this.dtBuffList.array[index];
        const lv=GD.role.myZm.HomeBuild.Lv
        let pre=''
        if(index>=lv){
            pre=`大厅${index+1}级激活：`
        }
        node.children[0].getComponent(RichText).string=`${pre}${buff}`;
    }
    doBuyGp=(num:number)=>{
        num=num>>0
        let req = outer_pb.ZmAct.create();
        req.Num=num;
        req.Type = this.buyGpList.selectedIndex;
        let buff = outer_pb.ZmAct.encode(req).finish();
        WS.send(MT.ZmBuyGp,buff,(d:any)=>{
            let rsp=outer_pb.ZmAct.decode(d)
            if(rsp.ErrCode==Err.ErrCode_Success){
                const zm=GD.role.myZm
                zm.GpNum=rsp.GpNum
                rsp.DiaNum&&(zm.DiaNum=rsp.DiaNum)
                rsp.PointNum&&(zm.PointNum=rsp.PointNum)
                this.resetMyZmUI(zm)
                UIMgr.I.tip(`兑换成功`,ct.green)
            }else{
                UIMgr.I.tip('兑换失败'+rsp.ErrCode)
            }
            this.buyGpBox.active=false;
        })        
    }
    doJuanItem=(num:number)=>{
        num=num>>0
        let req = outer_pb.ZmAct.create();
        req.Num=num;
        req.Type = this.juanList.selectedIndex;
        let buff = outer_pb.ZmAct.encode(req).finish();
        WS.send(MT.ZmJuanZhu,buff,(d:any)=>{
            let rsp=outer_pb.ZmAct.decode(d)
            if(rsp.ErrCode==Err.ErrCode_Success){
                const zm=GD.role.myZm
                zm.Gx=rsp.Gx
                rsp.BzSpNum&&(zm.BzSpNum=rsp.BzSpNum)
                rsp.ZySpNum&&(zm.ZySpNum=rsp.ZySpNum)
                rsp.DiaNum&&(zm.DiaNum=rsp.DiaNum)
                rsp.PointNum&&(zm.PointNum=rsp.PointNum)
                rsp.BiaoNum&&(zm.BiaoNum=rsp.BiaoNum)
                GD.role.data.ZmGx=rsp.MyGx
                this.resetMyZmUI(zm)
                const juanItem=this.juanTypes[rsp.Type];
                const id = juanItem[0] as number
                GD.role.reduceItem(id,num)
                UIMgr.I.tip(`捐赠成功，贡献+${rsp.Num}，战盟资源增加`,ct.green)
            }else{
                UIMgr.I.tip('捐赠失败'+rsp.ErrCode)
            }
            this.juanBox.active=false;
        })
    }
    isMengZhu=():boolean=>{
        const is= GD.role.myZm.Owner==GD.role.data.Name
        if(is){
            return true
        }
        UIMgr.I.tip(this.onlyOwnerCanDo)
        return false
    }
    exitZm=(d:any)=>{
        WS.send(MT.ExitFromMyZm,GD.EmptyRequestBuff,(d:any)=>{
            let rsp=outer_pb.ZmAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                GD.role.myZm=null;
                GD.role.data.Zm=''
                this.resetMyZmUI(null)
                UIMgr.I.hideCurPage();
                BattleManager.I.refreshPlayerNameLabel()
                UIMgr.I.tip('成功退出战盟',ct.green)
            }else{
                UIMgr.I.tip('退出失败')
            }
        })
    }
    inviteOtherJoinMyZm(id:number){
        let req = outer_pb.ZmAct.create();
        req.Id=id;
        let buff = outer_pb.ZmAct.encode(req).finish();
        WS.send(MT.InviteOtherJoinMyZm,buff,(d:any)=>{
            let rsp=outer_pb.ZmAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                UIMgr.I.tip('成功发送邀请',ct.green)
            }else if(rsp.ErrCode==Err.ErrCode_RoleIsNotOnline){
                UIMgr.I.tip('对方不在线')
            }else if(rsp.ErrCode==Err.ErrCode_RoleHasAlreadyInTeam){
                UIMgr.I.tip('对方已有战盟')
            }else if(rsp.ErrCode==Err.ErrCode_TeamNotExsit){
                UIMgr.I.tip('您的战盟已解散')
            }else if(rsp.ErrCode==Err.ErrCode_TeamFull){
                UIMgr.I.tip('您的战盟已满员')
            }else if(rsp.ErrCode==Err.ErrCode_ExitTimeNotLongEnough){
                UIMgr.I.tip('对方退出战盟冷却时间未到')
            }else{
                UIMgr.I.tip('对方已有战盟')
            }
            let i = this.noZmList.array.findIndex((info:outer_pb.RoleInfo)=>{return info.Id==id})
            if(i>-1){
                this.noZmList.array.splice(i,1)
                this.noZmList.refresh();
            }
        })
    }
    agreeRequesterJoinMyZm(id:number,isAgree:boolean){
        let req = outer_pb.ZmAct.create();
        req.Id=id;
        req.IsAgree=isAgree;
        let buff = outer_pb.ZmAct.encode(req).finish();
        WS.send(MT.AgreeRequesterJoinMyZm,buff,this.onAgreeRequesterJoinMyZm)
    }
    onAgreeRequesterJoinMyZm=(d:any)=>{
        let rsp=outer_pb.ZmAct.decode(d);
        let i = this.requestList.array.findIndex((info:outer_pb.RoleInfo)=>{return info.Id==rsp.Id})
        if(i>-1){
            this.requestList.array.splice(i,1)
            this.requestList.refresh();
        }
        if(rsp.IsAgree){
            if(rsp.ErrCode==Err.ErrCode_Success){
                UIMgr.I.tip(`${rsp.Who} 加入您的战盟`,ct.green)
                BattleManager.I.refreshOtherNameLabel(rsp.Who,rsp.Name)
            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughLv){
                UIMgr.I.tip('对方不满足加入条件')
            }else if(rsp.ErrCode==Err.ErrCode_TeamNotExsit){
                UIMgr.I.tip('您的战盟已解散')
            }else if(rsp.ErrCode==Err.ErrCode_TeamFull){
                UIMgr.I.tip('您的战盟已满员')
            }else if(rsp.ErrCode==Err.ErrCode_ExitTimeNotLongEnough){
                UIMgr.I.tip('对方退出战盟冷却时间未到')
            }else{
                UIMgr.I.tip('对方已有战盟')
            }
        }else{
            UIMgr.I.tip('拒绝成功',ct.green);
        }
    }
    requestJoinZm=(d:any)=>{
        const minLv=GD.configs.get(ConfigType.ZmMinJoinZmNeedLv)
        if(GD.role.hasEnoughLv(minLv)){
            let name = d.name;
            let req = outer_pb.ZmAct.create();
            req.Name=name;
            let buff = outer_pb.ZmAct.encode(req).finish();
            WS.send(MT.RequestJoinZm,buff,this.onRequestJoinZm)
        }
    }
    onRequestJoinZm=(d:any)=>{
        let rsp=outer_pb.ZmAct.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            UIMgr.I.tip('成功发送申请',ct.green)
            let i = this.allZmList.array.findIndex((info:outer_pb.IZmMiniInfo)=>{return info.Name==rsp.Name})
            if(i>-1){
                this.allZmList.array.splice(i,1)
                this.allZmList.refresh();
            }
        }else if(rsp.ErrCode==Err.ErrCode_TeamFull){
            UIMgr.I.tip('该战盟已满员')
        }else if(rsp.ErrCode==Err.ErrCode_RequestBuffFull){
            UIMgr.I.tip('申请列表已满')
        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughLv){
            UIMgr.I.tip('等级不足')
        }else if(rsp.ErrCode==Err.ErrCode_ExitTimeNotLongEnough){
            let seconds = GD.configs.get(ConfigType.ExitZmCdTime)-(rsp.ExitTime as number);
            const hours = seconds/3600>>0; // 计算小时  
            const minutes = (seconds%3600)/60>>0; // 计算分钟  
            UIMgr.I.tip(`退出战盟冷却时间未到，还需：${hours}小时${minutes}分钟`)
        }else if(rsp.ErrCode==Err.ErrCode_TeamNotExsit){
            UIMgr.I.tip('该战盟不存在')
        }else{
            UIMgr.I.tip('申请失败')
        }
    }
    tryCreateZm=(d:any)=>{
        if(GD.role.hasBaseYk()){
            let name = this.newZmName.string;
            if(name.length>=2&&name.length<=6){
                if(GD.role.hasEnoughLv(100)){
                    let req = outer_pb.ZmAct.create();
                    req.Name=name;
                    let buff = outer_pb.ZmAct.encode(req).finish();
                    WS.send(MT.CreateZm,buff,this.onCreateZm)
                }
            }else{
                UIMgr.I.tip('战盟名字长度必须为2-6个字符')
            }
        }
    }
    onCreateZm=(d:any)=>{
        let rsp=outer_pb.ZmAct.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            this.resetMyZmUI(rsp)
            UIMgr.I.tip('创建战盟成功',ct.green);
            BattleManager.I.refreshPlayerNameLabel()
        }else {
            this.resetMyZmUI(null)
            if(rsp.ErrCode==Err.ErrCode_NotEnoughDia){
                UIMgr.I.tip('钻石不足');
            }else if(rsp.ErrCode==Err.ErrCode_RoleNameHasExsited){
                UIMgr.I.tip('创建失败，战盟名字已存在');
            }else if(rsp.ErrCode==Err.ErrCode_HasBadWords){
                UIMgr.I.tip('创建失败，战盟名字不合法');
            }else{
                UIMgr.I.tip('创建失败')
            }
        }
        this.creatBox.active=false;
    }
    getMyZm(){
        if(GD.role.hasBaseYk(false)){
            this.zmSetBtn.active=this.requestListBtn.active=this.top.active=false;
            WS.send(MT.GetMyZm,GD.EmptyRequestBuff,this.onGetMyZm)
        }
    }
    onGetMyZm=(d:any)=>{
        let rsp=outer_pb.ZmAct.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            GD.role.data.ZmGx=rsp.MyGx;
            this.resetMyZmUI(rsp)
            this.requestListBtn.children[1].active=rsp.Num>0;
        }else{
            this.resetMyZmUI(null)
        }
        
    }
    setMyZmSet(){
        let zm=GD.role.myZm
        this.needZs.string = zm.NeedZs+''// ? `${zm.NeedZs}` :'0';
        this.needLv.string = zm.NeedLv+''// ? `${zm.NeedLv}` :'0';
        this.autoAgree.isChecked=zm.IsAutoAgree;
        this.isSj.isChecked=zm.IsSj;
    }
    resetMyZmUI(rsp:outer_pb.ZmAct){
        GD.role.myZm=rsp
        if(rsp==null){
            GD.role.myZm=null
            this.zmSetBtn.active=this.exitBtn.active=this.requestListBtn.active=false;
            this.creatBtn.active=true
            GD.role.data.Zm='';
            this.top.active=false;
            this.head.string=''
        }else{
            GD.role.myZm=rsp
            rsp.Menbers=[];//防止为undefind
            let zm = rsp;
            GD.role.data.Zm=zm.Name;
            this.requestListBtn.active = this.exitBtn.active=true
            this.creatBtn.active=false
            this.zmSetBtn.active = GD.role.data.Name==zm.Owner;//只有盟主才能设置
            this.top.active=true;
            this.zmOwner.string=`盟主：${zm.Owner}`
            this.allGx.string=zm.Gx.toLocaleString()
            this.dia.string=zm.DiaNum.toLocaleString()
            this.point.string=zm.PointNum.toLocaleString()
            this.biao.string=zm.BiaoNum.toLocaleString()
            this.bzSp.string=zm.BzSpNum.toLocaleString()
            this.zySp.string=zm.ZySpNum.toLocaleString()
            this.gpNum.string=zm.GpNum.toLocaleString()
            this.goldNum.string=zm.PagGold.toLocaleString()
            let all=0
            zm.Hunters.forEach(h=>{
                all+=this.hunterOutput[h.Lv]
            })
            let n=0
            const lv=zm.JTBuffs[0].Lv
            for(let i=1;i<=lv;i++){
                n+=i*2
            }
            const up=zm.UpBuffNum+n
            this.allOutput.string=`总产量：<color=${ct.purple0}>${all}</>/小时（加成<color=${ct.green}>${up}</>%） = <color=${ct.purple0}>${all*(100+up)/100>>0}</>/小时`
            this.myGx.string=GD.role.data.ZmGx.toLocaleString()
            this.head.string=`战盟【${zm.Name}】`;

            //签到按钮颜色
            let today = ((Date.now() / 1000 / 60 + 480) / 1440)>>0;
            let qdStr='签 到'
            let color=ct.green
            if(zm.QdDay==today){
                color=ct.gray
                qdStr=`已签到+${zm.QdNum}`
            }
            let qdLabel=this.openQd.children[0].getComponent(Label)
            qdLabel.string=qdStr
            qdLabel.color.fromHEX(color)

            //设置捐各种物资获得贡献的数量
            rsp.JuanConf.forEach((num,type)=>{
                this.juanTypes[type][1]=num
            })

            const home=zm.HomeBuild
            this.zmDt.children[0].getComponent(Label).string=`【议政大厅 Lv.${home.Lv}】`
            let bg=this.zmDt.children[1]
            bg.active=home.IsBuilding
            if(home.IsBuilding){
                bg.children[0].getComponent(Label).string=Tools.getRemainTimeString(home.Time)
            }
            this.zmDt.children[2].getComponent(Label).string=`人数：${zm.Len}/${home.Lv*5+20+zm.AddCapNum}`

            this.hunters.children.forEach((node,index)=>{
                let skin=node.children[1].getComponent(Sprite)
                let bg=node.children[2]
                let time=bg.children[0].getComponent(Label)
                let lvLabel=node.children[3].getComponent(Label)
                let lvColor=ct.gray
                let outPutLabel=node.children[4].getComponent(Label)
                let outPutColor=ct.gray
                let btn=node.children[5]
                btn.active=false
                const num=zm.Hunters.length
                let lv=0
                let path='zm_hunter'
                bg.active=false
                btn.off(Node.EventType.TOUCH_END)
                skin.node.off(Node.EventType.TOUCH_END)

                //强制刷新
                lvLabel.string='``'
                lvLabel.color.fromHEX(lvColor)
                outPutLabel.string=''
                outPutLabel.color.fromHEX(outPutColor)

                if(index<num){
                    //已激活
                    let build=zm.Hunters[index]
                    if(build.IsBuilding){
                        bg.active=true
                        time.string=Tools.getRemainTimeString(build.Time)
                    }else{
                        time.string=''
                    }
                    skin.node.on(Node.EventType.TOUCH_END,()=>{
                        this.showHunter(index)
                    },this); 
                    lv=build.Lv;
                    outPutColor=ct.green
                    lvColor=ct.white
                }else{
                    //未激活
                    path='zm_hunter0'
                    if(index==num){
                        btn.active=true
                        btn.on(Node.EventType.TOUCH_END,()=>{
                            this.tryAddOneHunter(index)
                        },this); 
                    }
                }
                lvLabel.string=`狩猎场 Lv.${lv}`
                lvLabel.color.fromHEX(lvColor)
                outPutLabel.string=`产量:${this.hunterOutput[lv]}/小时`
                outPutLabel.color.fromHEX(outPutColor)
                Tools.loadSpriteFrame('ui/build/'+path,GD.commonBundle).then((sp)=>{
                    if(sp)skin.spriteFrame=sp;
                })
            })
        }
    }
    hunterOutput = [
        10, 15, 22, 33, 49, 73, 109, //0~6级
        163, 244, 366, 549, 823, 1234, 1851, //7~13级
    ]
    zmAddHunterNeed = [
        [0, 1000],   //0第一个
        [0, 30000],  //1
        [0, 100000],  //2
        [0, 200000], //3
        [0, 300000], //4
        [1, 328], //5
        [1, 328],    //6
        [1, 328],    //7
        [1, 328],    //8
        [1, 328],    //9
        [1, 328],    //10
        [1, 328],    //11
    ]
    tryAddOneHunter=(index:number)=>{
        if(this.isMengZhu()){
            let needObj=this.zmAddHunterNeed[index]
            const needNum=needObj[1]
            let zm=GD.role.myZm
            if(needObj[0]==0){
                let msgList=[
                    new BoxMsg(`<br/>激活第${index+1}个狩猎场`,ct.green),
                    new BoxMsg(`需要：钻石x${needNum}`,ct.qing),
                    new BoxMsg('(从战盟剩余钻石中扣除)',ct.gray)
                ]
                UIMgr.I.PopView.showMsgBox(msgList,'激活',(d:string)=>{
                    if(zm.DiaNum>=needNum){
                        this.sendAddHunter()
                    }else{
                        UIMgr.I.tip('战盟剩余钻石不足')
                    }
                },'取消')
            }else{
                let msgList=[
                    new BoxMsg(`<br/>激活第${index+1}个狩猎场`,ct.green),
                    new BoxMsg(`需要：点数x${needNum}`,ct.brown),
                    new BoxMsg('(从战盟剩余点数中扣除)',ct.gray)
                ]
                UIMgr.I.PopView.showMsgBox(msgList,'激活',(d:string)=>{
                    if(zm.PointNum>=needNum){
                        this.sendAddHunter()
                    }else{
                        UIMgr.I.tip('战盟剩余点数不足')
                    }
                },'取消')
            }
        }
    }
    sendAddHunter=()=>{
        WS.send(MT.ZmAddOneHunter,GD.EmptyRequestBuff,(d:any)=>{
            let rsp=outer_pb.ZmAct.decode(d)
            if(rsp.ErrCode==Err.ErrCode_Success){
                let zm = GD.role.myZm
                zm.Hunters=rsp.Hunters
                zm.DiaNum=rsp.DiaNum
                zm.PointNum=rsp.PointNum
                this.resetMyZmUI(zm)
                UIMgr.I.tip('激活成功',ct.green)
            }else{
                UIMgr.I.tip('激活失败')
            }
        })
    }
    // renderHunter=(type:number,node:Node,build:outer_pb.IBuild)=>{
    //     node.children[0].getComponent(Label).string=`【狩猎场 Lv.${build.Lv}】`
    //     let bg=node.children[1]
    //     bg.active=build.IsBuilding
    //     if(build.IsBuilding){
    //         bg.children[0].getComponent(Label).string=Tools.getRemainTimeString(build.Time)
    //     }
    // }
    getZmList(){
        this.info1.active=false
        this.allZmList.array=[]
        let req = outer_pb.ZmAct.create();
        req.Page=this.pageNum
        let buff = outer_pb.ZmAct.encode(req).finish();
        WS.send(MT.GetZmList,buff,this.onGetZmList)
    }
    onGetZmList=(d:any)=>{
        let rsp=outer_pb.ZmAct.decode(d);
        this.allZmList.array=rsp.ZmList.sort((a,b)=>{return a.Num-b.Num});
        this.info1.active = rsp.ZmList.length==0
        this.pageNum=rsp.Page;
        this.totalPageNum=rsp.TotalPage;
        this.page.string=`${this.pageNum}/${this.totalPageNum}`
    }
    getNoZmList(){
        this.info2.string=''
        this.noZmList.array=[]
        if(GD.role.myZm){
            let req = outer_pb.ZmAct.create();
            req.Page=this.pageNum
            let buff = outer_pb.ZmAct.encode(req).finish();
            WS.send(MT.GetNoZmList,buff,this.onGetNoZmList)
        }else{
            this.info2.string='加入战盟后，才能获取无战盟玩家列表'
        }
    }
    onGetNoZmList=(d:any)=>{
        let rsp=outer_pb.ZmAct.decode(d);
        this.noZmList.array=rsp.RoleList;
        if(rsp.RoleList.length==0){
            this.info2.string='暂时没有可加入您战盟的在线玩家\n(可修改战盟设置，放宽条件，以邀请更多玩家)'
        }else{
            this.info2.string=''
        }
        this.pageNum=rsp.Page;
        this.totalPageNum=rsp.TotalPage;
        this.page1.string=`${this.pageNum}/${this.totalPageNum}`
    }
    getRequestList(){
        this.requestList.array=[]
        WS.send(MT.GetRequestJoinZmList,GD.EmptyRequestBuff,(d:any)=>{
            let rsp=outer_pb.CommonResponse.decode(d);
            this.requestList.array=rsp.RoleList;
        })
    }
}


