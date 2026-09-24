import { _decorator, Component, EventTouch, Game, game, instantiate, Label,  Node, ProgressBar, RichText, Sprite, SpriteFrame, sys, Toggle, Tween, tween, UIOpacity, UITransform, Vec3, view, Widget } from 'cc';
import { BasePage } from '../pages/BasePage';
import GD from '../base/GameData';
import WS, { ConnType } from '../base/net';
import { ConfigType, Err, MT } from '../base/MT';
import { BoxMsg, Buff, ChatChannelType, ct,  GetHpMpObj, InviteMsgType, MonsterColorTypes, PopViewType, QuestData, SdkRoleInfo, SdkUpEventType, Skill, SkillType, TargetType, TaskTargetType, TaskType, Unit, UnitState, UnitType, YsColors, YsTypeString, ZmJobType } from '../base/types';
import Pools from '../base/Pools';
import { List } from '../UiComps/List';
import { BattleManager } from '../battle/BattleManager';
import { BaseComponent } from '../base/BaseComponent';
import { Tab } from '../UiComps/Tab';
import { BagFullInfo, PKModeStr, SkillModeStr, TooManyRedPointInfo, TuoGuanStr, ZmJobStr } from '../base/consts';
import { Data } from '../UiComps/Data';
import Tools from '../base/tools';
import { ChatPage } from '../pages/ChatPage';
import { RichTextHandler } from '../UiComps/RichTextHandler';
import { PopView } from '../pages/PopView';
import { RolePage } from '../pages/RolePage';
import { EquipView } from '../pages/EquipView';
import { ZmPage } from '../pages/ZmPage';
import { TeamPage } from '../pages/TeamPage';
import GameManager from './GameManager';
import { PlayerControl } from '../battle/PlayerControl';
import { MonsterControl } from '../battle/MonsterControl';
import { QuestPage } from '../pages/QuestPage';
import { Menu } from '../pages/MenuPage';
import { SDK } from '../base/SDK';
import { MsgVerifier } from '../base/MsgVerifier';
const { ccclass, property} = _decorator;

//BoxMsgPage消息的类型
export const enum MsgType{
    Info,
    OffLine,
    Death,
    FocusOut,
}
export const enum  PageType{
    //mainSecene中有实例
    None,
    BoxMsgPage,
    MapPage,
    LinePage,
    RolePage,
    ChatPage,
    BagPage,
    NpcShopPage,
    PhPage,
    TeamPage,
    MarketPage,
    SetPage,
    QuestPage,
    MenuPage,
    RoomPage,
    CkPage,
    FriendPage,
    SwitchRolePage,
    ZmPage,
    BossPage,
    NpcTalkPage,
    HcPage,
    NpcListPage,
    ChengHaoPage,
    HolePage,
    FuLiPage,
    HelpPage,
    MailPage,
    DiaMarketPage,
    DiaBuffPage,
    RankPkPage,
    TgCodePage,
    ShiTuPage,
    TowerPage,
    JrHuoDongPage,
    GemShopPage,
    TradePage,
    GuessPage,
    JiLabelPage,
}
@ccclass('UIMgr')
export class UIMgr extends Component {
    @property(Sprite)
    headIcon:Sprite;
    @property(Node)
    msgInfoBox:Node;
    @property(Node)
    topMsgInfoBox:Node;
    @property(Node)
    tipMsgBox:Node;
    @property(Label)
    expPer:Label;
    @property(Node)
    resetExpPer:Node;
    @property(Label)
    expRate:Label;
    @property(Label)
    fbTime:Label;
    @property(ProgressBar)
    ljBar:ProgressBar;
    @property(Label)
    ljNum:Label;
    @property(Toggle)
    ggToggle:Toggle;
    @property(Node)
    mailBtn:Node;
    @property(Node)
    openHelpBtn:Node;
    @property(Node)
    openDayDo:Node;
    @property(Node)
    huoDongBtn:Node;
    @property(Node)
    jrHuoDong:Node;
    @property(Label)
    ggMsg:Label;
    @property(Node)
    teamActBtn:Node
    @property(Label)
    rtt:Label;
    @property(Label)
    time:Label;
    @property(Label)
    cardTime:Label;
    @property(Label)
    pkTime:Label;
    @property(Label)
    buffTime:Label;
    @property(Node)
    exitPkBtn:Node
    // @property(Node)
    // pkBox:Node
    @property(Label)
    towerLv:Label
    @property(RichText)
    kfBuffRich:RichText
    
    //各种界面TowerPage
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    JiLabelPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    GuessPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    TradePage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    GemShopPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    JrHuoDongPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    TowerPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    ShiTuPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    TgCodePage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    DiaMarketPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    FuLiPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    HolePage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    ChengHaoPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    HcPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    NpcListPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    NpcTalkPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    BoxMsgPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    MapPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    LinePage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    SwitchRolePage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    RolePage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    ChatPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    NpcShopPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    TeamPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    ZmPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    MarketPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    SetPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    QuestPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    MenuPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    RoomPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    CkPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    FriendPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    BossPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    MailPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: PopView })
    PopView:PopView;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    HelpPage:Node;
    @property({ group: { name: 'Pages' ,id:'0'}, type: Node })
    RankPkPage:Node;
    
    @property({ group: { name: 'Buttons' ,id:'1'}, type: UITransform })
    mainQuestFrame:UITransform;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    mainQuestOkBtn:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Label })
    mainQuestName:Label;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: RichText })
    mainQuestJL:RichText;
    // @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    // openQuestBtn:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    backBox:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    backPosBtn:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    exitBackBtn:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    backHomeBtn:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    relifeAtPlace:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Label })
    relifeNeed:Label;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    showDeathView:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: RichText })
    showDeathMsg:RichText;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: ProgressBar })
    bloodBar:ProgressBar;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: ProgressBar })
    manaBar:ProgressBar;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: ProgressBar })
    sdBar:ProgressBar;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: ProgressBar })
    agBar:ProgressBar;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    openRolePageBtn:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    openTeamPageBtn:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    openMarketPageBtn:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    openMenuPageBtn:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Label })
    ZmLabel:Label;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Label })
    roleNameLabel:Label;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Label })
    goldLabel:Label;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Label })
    diaLabel:Label;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Label })
    muPointLabel:Label;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Label })
    mapNameLabel:Label;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Label })
    mapPosLabel:Label;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    miniMap:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    openLinePageBtn:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    openRoomPageBtn:Node;
    // @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    // openSwitchRolePageBtn:Node;
    // @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    // openCkPageBtn:Node;
    // @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    // openBossPageBtn:Node;
    // @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    // startTuoGuanBtn:Node;
    // @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    // openChatPageBtn:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: ProgressBar })
    expBar:ProgressBar;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Label })
    lvLabel:Label;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Label })
    expLabel:Label;
    // @property({ group: { name: 'Buttons' ,id:'1'}, type: UITransform })
    // expBg:UITransform;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    getHpBox:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    getMpBox:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Label })
    hpNum:Label;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Label })
    mpNum:Label;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Label })
    agNum:Label;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Label })
    sdNum:Label;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    atkBtn:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    teamBox:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: List })
    teamList:List;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    inviteBox:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    agreeBtn:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    refuseBtn:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: RichText })
    inviteMsg:RichText;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: List })
    chatList:List;
    
    // @property({ group: { name: 'Buttons' ,id:'1'}, type: Toggle })
    // showSkillListToggle:Toggle;
    // @property({ group: { name: 'Buttons' ,id:'1'}, type: Toggle })
    // isAutoToggle:Toggle;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    switchMonsterBtn:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    switchRoleBtn:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    pickUpBtn:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    targetInfoBox:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    targetYsList:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Label })
    targetNameL:Label;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Label })
    targetHpL:Label;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: ProgressBar })
    targetHpBar:ProgressBar;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: ProgressBar })
    targetSdBar:ProgressBar;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    cancelTargetBtn:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    switchBossOwner:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    deleteBoss:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    souHunBtn:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Toggle })
    switchPkModeToggle:Toggle;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Tab })
    pkModeTab:Tab;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Toggle })
    switchSkillModeToggle:Toggle;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Tab })
    skillModeTab:Tab;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    skillBtns:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    itemBtns:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: ProgressBar })
    atkCdProgress:ProgressBar;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: UIOpacity })
    controlBox:UIOpacity; 
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    autoBtn:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    buffBox:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    buffInfoBox:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: List })
    buffList:List;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    menuBox:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    chatMsgBox:Node;
    @property({ group: { name: 'Buttons' ,id:'1'}, type: Node })
    mainMenu:Node;
    
    curPage:Node;
    curPageType:PageType=PageType.None;
    pageMap:Map<PageType,Node>=new Map();
    tempBuffNode:Node;

    menus:Array<Menu>=[
        new Menu('托管',ct.green,()=>{
            UIMgr.I.sendFocusChange(false)
        }),
        new Menu('换号',ct.brown,()=>{UIMgr.I.show(PageType.SwitchRolePage,null,true)}),
        new Menu('仓库',ct.blue,()=>{UIMgr.I.show(PageType.CkPage,null,true)}),
        new Menu('Boss',ct.yellow,()=>{UIMgr.I.show(PageType.BossPage,null,true)}),
        new Menu('任务',ct.blue,()=>{
            UIMgr.I.show(PageType.QuestPage,null,true)
        }),
        new Menu('NPC',ct.white,()=>{UIMgr.I.show(PageType.NpcListPage,null,true)}),
        new Menu('福利',ct.green,()=>{UIMgr.I.show(PageType.FuLiPage,0,true)}),
        new Menu('聊天',ct.green,()=>{UIMgr.I.show(PageType.ChatPage,null,true)}),
    ]

    static I:UIMgr;
    onLoad() {
        UIMgr.I=this;
        this.menus.forEach((menu,index)=>{
            let node = this.menuBox.children[index]
            if(node){
                let label = node.children[0].getComponent(Label)
                label.string=menu.name
                label.color.fromHEX(menu.color)
                node.on(Node.EventType.TOUCH_END,()=>{
                    // if(menu.needCheckLimited){
                    //     if(GD.role.isLimited()) return
                    // }
                    menu.cb()
                },this);
            }
        })
        this.pageMap.set(PageType.JiLabelPage,this.JiLabelPage);
        this.pageMap.set(PageType.GuessPage,this.GuessPage);
        this.pageMap.set(PageType.TradePage,this.TradePage);
        this.pageMap.set(PageType.GemShopPage,this.GemShopPage);
        this.pageMap.set(PageType.JrHuoDongPage,this.JrHuoDongPage);
        this.pageMap.set(PageType.TowerPage,this.TowerPage);
        this.pageMap.set(PageType.ShiTuPage,this.ShiTuPage);
        this.pageMap.set(PageType.TgCodePage,this.TgCodePage);
        this.pageMap.set(PageType.DiaMarketPage,this.DiaMarketPage);
        this.pageMap.set(PageType.FuLiPage,this.FuLiPage);
        this.pageMap.set(PageType.HolePage,this.HolePage);
        this.pageMap.set(PageType.ChengHaoPage,this.ChengHaoPage);
        this.pageMap.set(PageType.HcPage,this.HcPage);
        this.pageMap.set(PageType.NpcListPage,this.NpcListPage);
        this.pageMap.set(PageType.NpcTalkPage,this.NpcTalkPage);
        this.pageMap.set(PageType.BoxMsgPage,this.BoxMsgPage);
        this.pageMap.set(PageType.MapPage,this.MapPage);
        this.pageMap.set(PageType.LinePage,this.LinePage);
        this.pageMap.set(PageType.SwitchRolePage,this.SwitchRolePage);
        this.pageMap.set(PageType.RolePage,this.RolePage);
        this.pageMap.set(PageType.ChatPage,this.ChatPage);
        this.pageMap.set(PageType.NpcShopPage,this.NpcShopPage);
        this.pageMap.set(PageType.TeamPage,this.TeamPage);
        this.pageMap.set(PageType.ZmPage,this.ZmPage);
        this.pageMap.set(PageType.MarketPage,this.MarketPage);
        this.pageMap.set(PageType.SetPage,this.SetPage);
        this.pageMap.set(PageType.QuestPage,this.QuestPage);
        this.pageMap.set(PageType.MenuPage,this.MenuPage);
        this.pageMap.set(PageType.RoomPage,this.RoomPage);
        this.pageMap.set(PageType.CkPage,this.CkPage);
        this.pageMap.set(PageType.FriendPage,this.FriendPage);
        this.pageMap.set(PageType.BossPage,this.BossPage);
        this.pageMap.set(PageType.MailPage,this.MailPage);
        this.pageMap.set(PageType.HelpPage,this.HelpPage);
        this.pageMap.set(PageType.RankPkPage,this.RankPkPage);
        this.chatList.array=[];
        this.chatList.cellRender = (node:Node,index:number)=>{
            let data:outer_pb.ChatMsg = this.chatList.array[index];
            let text = node.getComponent(RichText)
            node.getComponent(RichTextHandler).data=data;
            Tools.renderChatListCell(data,text)
        };
        this.tempBuffNode = this.buffBox.children[0];
        this.buffBox.removeAllChildren();
        this.buffInfoBox.active=false;
        this.buffBox.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.buffInfoBox.active=true;
            this.buffList.array=GD.role.buffs;
            GameManager.I.playClickSound();
        },this);
        this.buffInfoBox.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.buffInfoBox.active=false;
            GameManager.I.playClickSound();
        },this);
        this.buffList.cellRender = (node:Node,index:number)=>{
            let buff:Buff = this.buffList.array[index];
            let t = node.children[0].getComponent(Label)
            t.color.fromHEX(buff.color)
            let numStr = ''
            if(buff.curNum>0){
                if(buff.InstallNums.length>0&&Tools.isDecimal(buff.InstallNums[0])){
                    numStr = '+'+(buff.curNum*1000/10>>0)+'%'
                }else{
                    numStr = '+'+(buff.curNum>>0)
                }
            }
            t.string=`${buff.Name}(${buff.Sign})：${buff.Info}${numStr} (剩余：${Tools.getRemainTimeString1(buff.expireTime)})`
        };
        this.backHomeBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            //立即回城
            WS.send(MT.RelifeAtHome,GD.EmptyRequestBuff);
        },this);
        this.relifeAtPlace.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            //立即原地复活
            let need=GD.configs.get(ConfigType.HandRelifeAtPlaceNeedDia)
            if(GD.role.hasGoldYk(false)){
                need=0
            }
            if(need==0||GD.role.hasEnoughDia(need)){
                WS.send(MT.RelifeAtPlace,GD.EmptyRequestBuff,(d:any)=>{
                    let rsp=outer_pb.NpcShopAct.decode(d)
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        GD.role.reduceDia(rsp.Cost)
                        this.tip('原地复活成功',ct.green)
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughDia){
                        this.tip('钻石不足')
                    }else{
                        this.tip('复活失败')
                    }
                });
            }
        },this);
        // this.hidePk.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
        //     //挑战无尽之塔时，托管自动挑战战斗
        //     this.hidePk.active=false;
        //     WS.send(MT.HidePk,GD.EmptyRequestBuff)
        // },this);
        this.exitPkBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            //放弃认输
            this.exitPkBtn.active=false;
            WS.send(MT.ExitPk,GD.EmptyRequestBuff)
        },this);
        // this.openDiaMarketBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
        //     // if(GD.role.isLimited())return
        //     this.show(PageType.DiaMarketPage)
        // },this);
        this.teamActBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            //召唤队友界面
            // if(GD.role.isLimited())return
            this.PopView.showTeamActBox(0)
        },this);
        this.openLinePageBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            // if(GD.role.isLimited())return
            this.show(PageType.LinePage)
        },this);
        this.mailBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            // if(GD.role.isLimited())return
            this.show(PageType.MailPage)
        },this);
        this.openDayDo.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            // if(GD.role.isLimited())return
            this.show(PageType.QuestPage,3)
        },this);
        this.openHelpBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.show(PageType.HelpPage)
        },this);
        this.openRoomPageBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            // if(GD.role.isLimited())return
            this.show(PageType.RoomPage)
        },this);
        this.huoDongBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.show(PageType.MenuPage,1)
        },this);
        this.jrHuoDong.active=false;
        this.jrHuoDong.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            WS.send(MT.GetHuoDongData,GD.EmptyRequestBuff,(d:any)=>{
                let rsp = outer_pb.HuoDongAct.decode(d)
                if(rsp.ErrCode==Err.ErrCode_Success){
                    this.show(PageType.JrHuoDongPage,rsp)
                }else{
                    this.jrHuoDong.active=false;
                    this.tip('节日活动已过期')
                }
            })
        },this);
        this.mainQuestOkBtn.on(Node.EventType.TOUCH_END,this.checkMainQuest,this);
        this.openRolePageBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            // if(GD.role.isLimited())return
            this.show(PageType.RolePage)
        },this);
        this.openTeamPageBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            // if(GD.role.isLimited())return
            this.show(PageType.TeamPage)
        },this);
        this.openMarketPageBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            // if(GD.role.isLimited())return
            this.PopView.show(PopViewType.MarketTypeBox,null)
            // this.show(PageType.MarketPage)
        },this);
        this.atkBtn.on(Node.EventType.TOUCH_END,this.onAtkBtnClick,this);
        this.miniMap.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            // if(GD.role.isLimited())return
            if(GD.curMap.mapId==777)return;
            this.show(PageType.MapPage)
        },this);
        this.openMenuPageBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.show(PageType.MenuPage,0)
        },this);
        this.autoBtn.on(Node.EventType.TOUCH_END,this.onAutoBtnClick,this);
        this.pkModeTab.selectedIndex=GD.role.data.PkMode;
        this.pkModeTab.selectedHandler=(node:Node,index)=>{
            // this.switchPkModeToggle.isChecked=false;
            this.onPkModeChange();
            GD.playClickSound();
        }
        this.switchMonsterBtn.on(Node.EventType.TOUCH_END,()=>{
            GD.player.trySwitchTarget(UnitType.Monster)
        },this);
        this.switchRoleBtn.on(Node.EventType.TOUCH_END,()=>{
            GD.player.trySwitchTarget(UnitType.Player)
        },this);
        this.pickUpBtn.on(Node.EventType.TOUCH_END,()=>{
            GD.curMap.pickUpItem()
        },this);
        this.cancelTargetBtn.on(Node.EventType.TOUCH_END,()=>{
            GD.player.lostTarget();
            this.targetInfoBox.active=false;
        },this);
        this.switchBossOwner.on(Node.EventType.TOUCH_END,()=>{
            //先显示队友选择界面，然后再提示界面
            this.PopView.showTeamActBox(1)
        },this);
        this.deleteBoss.on(Node.EventType.TOUCH_END,()=>{
            //驱逐BOSS
            this.PopView.showMsgBox([new BoxMsg('驱逐BOSS后，系统将回收该BOSS，您也将无法获得奖励',ct.brown)],'驱逐',this.doDeleteBoss,'取消')
        },this);
        this.souHunBtn.on(Node.EventType.TOUCH_END,this.doSouHunBoss,this);
        this.switchPkModeToggle.node.children[1].getComponent(Label).string=PKModeStr[GD.role.data.PkMode]
        this.skillModeTab.selectedIndex=GD.role.data.SkillMode;
        this.skillModeTab.selectedHandler=this.onSkillModeChange;
        this.switchSkillModeToggle.node.children[1].getComponent(Label).string=SkillModeStr[GD.role.data.SkillMode]
        this.controlBox.opacity=0;
        view.on('canvas-resize',()=>{
            this.onResize()
        })
        view.on('window-resize',()=>{
            this.onResize()
        })
        this.agreeBtn.on(Node.EventType.TOUCH_END,this.onAgreeBtnClick,this);
        this.refuseBtn.on(Node.EventType.TOUCH_END,this.onRefuseBtnClick,this);
        this.teamList.selectedHandler = (node:Node,index:number)=>{
            //队伍成员的RoleInfo的id为空，所以无法用id，只能用name
            let role:outer_pb.IRoleInfo = this.teamList.array[index];
            node.off(Node.EventType.TOUCH_END)
            let other = GD.role.neighborOthers.get(role.Id)
            if(other){
                node.on(Node.EventType.TOUCH_END,()=>{
                    //重新获取，防止切换地图后对象变了
                    UIMgr.I.PopView.show(1,role)
                })
            }
        }
        this.teamList.cellRender = (node:Node,index:number)=>{
            let role:outer_pb.IRoleInfo = this.teamList.array[index];
            let nameLabel = node.children[0].getComponent(Label);
            nameLabel.color.fromHEX(role.Name==GD.role.data.Name?ct.green:ct.white)
            nameLabel.string = role.Name;
            let bar = node.children[1].getComponent(ProgressBar)
            
            let opacity = node.getComponent(UIOpacity);
            if(role.Name==GD.role.data.Name){
                opacity.opacity=255
                bar.progress = GD.role.basePros.CurHp/GD.role.lastMaxHp;
            }else{
                let other = GD.role.neighborOthers.get(role.Id);
                if(other){
                    opacity.opacity=255
                    bar.progress = other.CurHp/other.MaxHp;
                }else{
                    opacity.opacity=130
                    bar.progress = 0;
                }
            }
        }
        this.resetExpPer.on(Node.EventType.TOUCH_END,this.recaculateExpPer,this);
        this.backBox.active=false;
        this.backPosBtn.on(Node.EventType.TOUCH_END,this.backPos,this);
        this.exitBackBtn.on(Node.EventType.TOUCH_END,()=>{
            this.backBox.active=false;
            GameManager.I.playClickSound();
        },this);
        this.skillBtns.children.forEach((node,index)=>{
            node.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
                // if(GD.role.isLimited())return
                this.onSkillBtnClick(index,this.skillBtns)
            },this);
        })
        this.itemBtns.children.forEach((node,index)=>{
            node.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
                // if(GD.role.isLimited())return
                this.onSkillBtnClick(index,this.itemBtns)
            },this);
        })
        
        WS.cbs.set(MT.GetNewQuest,this.onGetNewQuest)
        WS.cbs.set(MT.UpdateQuest,this.onUpdateQuest)
        WS.cbs.set(MT.GetInviteMsg,this.onGetInviteMsg)
        WS.cbs.set(MT.OnJoinTeam,this.onOnJoinTeam)
        WS.cbs.set(MT.OnBeHitOutTeam,this.OnBeHitOutTeam)
        WS.cbs.set(MT.OnOtherBeHitOutTeam,this.OnOtherBeHitOutTeam)
        WS.cbs.set(MT.OnTeamOwnerChanged,this.OnTeamOwnerChanged)
        WS.cbs.set(MT.OnOtherExitTeam,this.OnOtherExitTeam)
        WS.cbs.set(MT.GetChatMsg,this.onGetChatMsg)
        WS.cbs.set(MT.FocusChange,this.onFocusChange)
        WS.cbs.set(MT.AgreeBeInvitedJoinTeam,this.onAgreeBeInvitedJoinTeam)
        WS.cbs.set(MT.AutoRecoverEquips,this.onAutoRecoverEquips)

        WS.cbs.set(MT.OnOtherJoinZm,this.onOnOtherJoinZm)
        WS.cbs.set(MT.AgreeBeInvitedJoinZm,this.onAgreeBeInvitedJoinZm)
        WS.cbs.set(MT.OnBeHitOutZm,this.OnBeHitOutZm)
        WS.cbs.set(MT.OnOtherBeHitOutZm,this.OnOtherBeHitOutZm)
        WS.cbs.set(MT.OnOtherExitZm,this.OnOtherExitZm)
        WS.cbs.set(MT.OnZmOwnerChanged,this.OnZmOwnerChanged)
        WS.cbs.set(MT.OnZmMenberJobChanged,this.OnZmMenberJobChanged)
        WS.cbs.set(MT.FbIsStart,this.OnFbIsStart)
        WS.cbs.set(MT.GetQuestData,this.onGetQuestData)
        WS.cbs.set(MT.GetNewSysGG,this.onGetNewSysGG)
        // WS.cbs.set(MT.GetNewVersion,this.onGetNewVersion)
        WS.cbs.set(MT.SwitchAuto,this.onSwitchAuto)
        WS.cbs.set(MT.OtherSwitchMyBossOwner,this.onOtherSwitchMyBossOwner)
        WS.cbs.set(MT.SwitchSkillMode,this.onSwitchSkillMode)
        WS.cbs.set(MT.ClientHeartBeat,this.onClientHeartBeat)
        WS.cbs.set(MT.PkOver,this.onPkOver)
        WS.cbs.set(MT.StartSeizeBattle,this.onStartSeizeBattle)
        WS.cbs.set(MT.GetNewEmail,this.onGetNewEmail)
        WS.cbs.set(MT.OnRMBBuyCard,this.OnRMBBuyCard)
        WS.cbs.set(MT.DiaBuffChanged,this.onDiaBuffChanged)
        WS.cbs.set(MT.RankPkOver,this.onRankPkOver)
        WS.cbs.set(MT.SuccessTowerLv,this.onSuccessTowerLv)
        WS.cbs.set(MT.GetNewHuoDong,this.onGetNewHuoDong)
        WS.cbs.set(MT.BagIsFull,(d:any)=>{this.showProsMsg(BagFullInfo)})
        WS.cbs.set(MT.StartTrade,this.onStartTrade)
        // if(GD.chatMsgs.get(ChatChannelType.Private).length>0){
        //     this.openChatPageBtn.children[1].active=true;
        // }
        this.renderChatList();
        if(sys.isNative){
            game.on(Game.EVENT_HIDE, () => {
                // 监听应用进入后台
                GD.isFocusIn&&this.sendFocusChange(false)
            })
            game.on(Game.EVENT_SHOW, () => {
                // 监听应用回到前台
                this.sendFocusChange(true)
            });
        }else{
            document.addEventListener('visibilitychange', this.onVisibilityChange.bind(this));
        }
        this.schedule(this.scheduleAddHpMpLabel,0.15);
        //更新每日数据
        // this.scheduleOnce(this.startScheduleResetDay,10);//延迟10秒开始每秒尝试更新每日数据
        this.ysSpPrefab=this.targetYsList.children[0]
        this.targetYsList.removeAllChildren()
        this.refreshExpRateUI();
        this.startHeartBeat();
        this.updateBuffTime();
        this.schedule(this.updateBuffTime,1)
    }
    onDiaBuffChanged=(d:any)=>{
        let rsp = outer_pb.BasePros.decode(d)
        this.resetRoleBasePros(rsp)
    }
    OnRMBBuyCard=(d:any)=>{
        // alert('充值成功');
        // this.hideCurPage()
        // this.tip('充值成功，点数已发到您的【账号】上',ct.green)
        let rsp = outer_pb.NpcShopAct.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            this.hideCurPage()
            if(rsp.Items){
                GD.role.getItems(rsp.Items,true,true)
            }
            this.tip('购买成功',ct.green)
        }else{
            this.tip(`购买失败：${rsp.ErrCode}，请联系客服处理`);
        } 
    }
    heartBeatObj:outer_pb.HandMoveToPos;
    startHeartBeat=()=>{
        this.heartBeatObj = outer_pb.HandMoveToPos.create();
        this.heartBeat();
        this.schedule(this.heartBeat,20)
    }
    buffTypes:Array<string>=['青铜增益(攻)','青铜增益(防)','白银增益','首席增益'];
    defaultBuffInfo='80级后失效'
    defaultBuffInfo1='【幻影导师增益】：已过期'
    updateBuffTime=()=>{
        const bp=GD.role.basePros
        if(GD.role.hasEnoughLv(80,false)){
            bp.Time--;
        }
        const t=bp.Time;
        let info=this.defaultBuffInfo1;
        if(t>0){
            
            if(bp.IsDia){
                info=`【${this.buffTypes[bp.Type]}】剩余：${Tools.getDeltaTimeString(bp.Time)}`
            }else{
                info=`【${this.buffTypes[bp.Type]}】：${this.defaultBuffInfo}`
            }
        }
        this.buffTime.string=info;
        this.buffTime.node.active=t>0||GD.role.data.Lv>2;
    }
    reStartHeartBeat=()=>{
        this.updateBuffTime();
        this.unschedule(this.lost)
        this.heartBeat();
        this.schedule(this.heartBeat,20)
    }
    heartBeat=()=>{
        const lastSyncTime = Date.now()
        this.heartBeatObj.TimeC = lastSyncTime
        const buf=outer_pb.HandMoveToPos.encode(this.heartBeatObj).finish()
        WS.send(MT.ClientHeartBeat,buf)
        //延迟60秒后执行断线（25内未收到心跳回复）
        this.scheduleOnce(this.lost,60)
    }
    onClientHeartBeat=(d:any)=>{
        let rsp = outer_pb.HandMoveToPos.decode(d)
        const rtt = (Date.now()-rsp.TimeC)>>0;
        if(GD.subVersion<rsp.Version){
            this.showGG(outer_pb.SysGG.create({Msg:`有新版本V${rsp.Version}，您的版本V${GD.subVersion}，请重启更新`}),false)
        }
        let color=ct.green
        if(rtt>800){
            color=ct.red
        }else if(rtt>300){
            color=ct.brown
        }
        this.rtt.string = `延时：${rtt}ms`
        this.rtt.color.fromHEX(color);
        this.time.string = Tools.formatNowTime(rsp.TimeC)
        let card=''
        let gdColor=ct.red
        if(GD.role.hasBaseYk(false)){
            if(GD.role.hasGoldYk(false)){
                const now = Date.now()/1000>>0
                card =`黄金卡:${((GD.role.data.GoldYk-now)/86400)>>0}天`
                gdColor=ct.yellow
            }else{
                card ='黄金卡已过期'
            }
        }
        this.cardTime.string=card
        this.cardTime.color.fromHEX(gdColor)
        this.unschedule(this.lost)
    }
    lost(){
        console.log('断开连接')
        WS.DoClose()
    }
    // roleBasePros:outer_pb.IBasePros;
    curLjValue:number=0
    needUpdateLjValue:boolean=false;
    protected update(dt: number): void {
        if(this.needUpdateLjValue){
            const value = GD.role.basePros.LjValue>>0;
            if(this.curLjValue<value){
                this.curLjValue+=50
                if(this.curLjValue>=value){
                    this.curLjValue=value
                    this.needUpdateLjValue=false;
                }
                this.ljBar.progress = this.curLjValue/5000;
                this.ljNum.string = `${this.curLjValue}/5000`
            }
        }
    }
    // onGetNewVersion=(d:any)=>{
    //     this.PopView.showMsgBox([new BoxMsg('有新的版本，请更新后再继续游戏',ct.green)],'重启更新',this.restartGame)
    // }
    restartGame=()=>{
        if(sys.isNative){
            game.restart()
        }else{
            location.href=`${WS.home_url}?${Date.now()}`
        }
    }
    onGetNewSysGG=(d:any)=>{
        let rsp=outer_pb.SysGG.decode(d)
        this.showGG(rsp,false)
    }
    onGetNewEmail=(d:any)=>{
        let rsp=outer_pb.MailAct.decode(d)
        GD.role.getMail(rsp.Uid,rsp.Mail)
        this.mailBtn.children[1].active=true;
    }
    switchMailRedPoint=()=>{
        this.mailBtn.children[1].active=GD.role.Mails.length>0
    }
    showGG(rsp:outer_pb.ISysGG,hide:boolean=true){
        GD.sysGG = rsp;
        this.ggMsg.string=rsp.Msg;
        this.ggToggle.isChecked=true;
        hide&&this.scheduleOnce(()=>{
            this.ggToggle.isChecked=false;
        },5);
    }
    resetLjValue=()=>{
        this.curLjValue=0
        this.needUpdateLjValue=true
    }
    showDeathUI=()=>{
        let str:string;
        const time = GD.configs.get(ConfigType.PlayerAutoRelifeCd)
        if(GD.role.hasGoldYk(false)){
            str = `您的角色阵亡了，${(time/2*100>>0)/100}秒后自动 <color=${ct.green}>原地复活</>...`;
        }else{
            str = `您的角色阵亡了，${time}秒后自动 <color=${ct.blue}>回城复活</>...`
        }
        this.showDeathMsg.string=str;
        let need=''
        let color=ct.qing
        if(GD.role.hasGoldYk(false)){
            need = '（黄金卡 免费）'
            color = ct.green
        }else{
            need=`需要：${GD.configs.get(ConfigType.HandRelifeAtPlaceNeedDia)}钻石\n（黄金卡 免费）`
        }
        this.relifeNeed.string=need
        this.relifeNeed.color.fromHEX(color)
        this.showDeathView.active=true;
    }
    doSwitchBossOwner=(otherId:number)=>{
        let need=GD.configs.get(ConfigType.SwitchMyBossOwnerNeedDia)
        if(GD.role.hasGoldYk(false)){
            need=0
        }
        if(need==0||GD.role.hasEnoughDia(need)){
            let unit = GD.player.selectedUnit
            if(unit&&unit.unitType==UnitType.Monster&&unit.data.Owner==GD.role.data.Name){
                let m = unit.data as outer_pb.MonsterInfo
                let req = outer_pb.SwitchBossOwner.create()
                req.Index = m.Index
                req.NewId = otherId
                let buf = outer_pb.SwitchBossOwner.encode(req).finish()
                WS.send(MT.SwitchMyBossOwner,buf,(d:any)=>{
                    let rsp = outer_pb.SwitchBossOwner.decode(d)
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        m.Owner=rsp.Owner
                        if(rsp.Cost>0) GD.role.reduceDia(rsp.Cost);
                        let base = GD.monsterBaseDatas.get(m.Id)
                        if(base){
                            this.targetNameL.string=`[${m.Owner}]${base.Name}`;
                        }
                        let mc=GD.curMap.monsterList.get(m.Index)
                        if(mc) mc.refreshNameLabel()
                        this.tip('转让成功',ct.green)
                    }else{
                        this.tip('转让失败'+rsp.ErrCode);
                    }
                })
            }
        }
    }
    onPkOver=(d:any)=>{
        let rsp = outer_pb.HoleAct.decode(d)
        if(rsp.ErrCode==Err.ErrCode_Success){
            this.tip("挑战成功！",ct.green)
        }else{
            this.tip("挑战失败！")
        }
        this.stopUpdatePkTime();
    }
    onRankPkOver=(d:any)=>{
        let rsp = outer_pb.PkAct.decode(d)
        if(rsp.ErrCode==Err.ErrCode_Success){
            //基础分+连胜分
            let ls = ''
            if(rsp.PkNum>0){
                ls =`（连胜+${rsp.PkNum}）`
            }
            this.tip(`挑战成功！竞技积分+${rsp.OldJf}${ls}`,ct.green)
        }else{
            this.tip(`挑战失败！竞技积分+${rsp.OldJf}`)
        }
        this.stopUpdatePkTime();
    }
    onSuccessTowerLv=(d:any)=>{
        let rsp = outer_pb.PkAct.decode(d)
        if(rsp.ErrCode==Err.ErrCode_Success){
            if(rsp.Items){
                GD.role.getItems(rsp.Items,true,true,'首次通关')
            }
            // this.tip(`挑战成功！`,ct.green)
        }else{
            this.tip('挑战失败！')
        }
        this.stopUpdatePkTime();
    }
    onOtherSwitchMyBossOwner=(d:any)=>{
        let rsp = outer_pb.SwitchBossOwner.decode(d)
        if(rsp.ErrCode==Err.ErrCode_Success){
            let m = GD.curMap.monsterList.get(rsp.Index)
            if(m){
                m.data.Owner=rsp.Owner
                m.refreshNameLabel()
                // let base = GD.monsterBaseDatas.get(m.data.Id)
                // if(base){
                //     this.targetNameL.string=`[${rsp.Owner}]${base.Name}`;
                // }
            }
        }
    }
    refreshLjBar=()=>{
        this.needUpdateLjValue=true
    }
    private OnFbIsStart=(d:any)=>{
        this.fbRemainTime=899;
        this.fbTime.node.active=true;
        this.schedule(this.updateFbTime,1)
    }
    fbRemainTime:number=0;
    private updateFbTime(){
        this.fbRemainTime--
        if(this.fbRemainTime<0)this.fbRemainTime=0;
        const m = this.fbRemainTime/60>>0
        const s = this.fbRemainTime%60
        this.fbTime.string=`副本剩余时间：${m}分${s}秒`
    }
    stopUpdateFbTime=()=>{
        this.fbTime.string=''
        this.fbTime.node.active=false;
        this.unschedule(this.updateFbTime)
    }
    startUpdateKfTime=()=>{
        this.fbTime.node.active=true;
        this.schedule(this.updateKfTime,1)
    }
    stopUpdateKfTime=()=>{
        this.fbTime.string=''
        this.fbTime.node.active=false;
        this.unschedule(this.updateKfTime)
    }
    private updateKfTime(){
        if(GD.role.hasGoldYk(false)){
            this.fbTime.string=''
        }else{
            if(GD.role.kfTime>0){
                GD.role.kfTime--
                const m = GD.role.kfTime/60>>0
                const s = GD.role.kfTime%60
                this.fbTime.string=`今日剩余跨服时间：${m}分${s}秒`
            }
        }
    }
    //===============
    private onStartSeizeBattle=(d:any)=>{
        this.fbRemainTime=59;
        this.pkTime.node.active=true;
        this.schedule(this.updatePkTime,1)
        this.exitPkBtn.active=true
        this.showProsMsg("战斗开始！",ct.green)
    }
    updatePkTime(){
        this.fbRemainTime--
        if(this.fbRemainTime<0)this.fbRemainTime=0;
        const s = this.fbRemainTime%60
        this.pkTime.string=`剩余时间：${s}秒`
    }
    stopUpdatePkTime=()=>{
        this.pkTime.string=''
        this.pkTime.node.active=false;
        this.unschedule(this.updatePkTime)
    }
    // startScheduleResetDay=()=>{
    //     console.debug('开始尝试更新每日数据')
    //     this.schedule(this.tryResetDay,1);
    // }
    // tryResetDay(){
    //     let today = ((Date.now()/1000/60 + 480) / 1440)>>0
    //     if(GD.role.ResetDayData==null||today!=GD.role.ResetDayData.ResetDay){
    //         WS.send(MT.ResetDay,GD.EmptyRequestBuff,this.onResetDay)
    //         console.debug('发送：尝试更新每日数据')
    //     }
    // }
    // onResetDay=(d:any)=>{
    //     GD.role.onGetQuestData(d)
    // }
    onGetQuestData=(d:any)=>{
        let rsp = outer_pb.ResetData.decode(d);
        console.log('收到：更新每日数据',rsp)
        rsp.DayQuests.sort((q1,q2)=>{return q1.TaskId-q2.TaskId})
        GD.role.ResetDayData = rsp
        this.updateQuestPage(0,true)
    }
    recaculateExpPer(){
        if(GD.player){
            this.expPer.string='---'
            GD.player.startScheduleCaculateExpPer();
            this.tip('重置成功',ct.green)
        }
    }
    updateExpPerUI=(expPer:number,dmgPer:number)=>{
        this.expPer.string=`经验:${expPer}/m  伤害:${dmgPer}/m`
    }
    onResize(){
        this.resetExpBarLen()
        this.refreshExpUI()
        this.msgInfoBox.getComponent(Widget).setDirty();
        this.topMsgInfoBox.getComponent(Widget).setDirty();
    }
    onVisibilityChange() {  
        if (document.visibilityState === 'visible') {  
            // 在这里处理窗口显示时的逻辑
            UIMgr.I.sendFocusChange(true)
        } else {  
            // 在这里处理窗口隐藏时的逻辑 
            GD.isFocusIn&&UIMgr.I.sendFocusChange(false)
        }  
    }
    backPos(){
        GameManager.I.playClickSound();
        this.backBox.active=false;
        if(GD.role.canChangPos()){
            GD.player.setMoveMotion(false)
            WS.send(MT.BackToPos,GD.EmptyRequestBuff,(d:any)=>{
                let rsp = outer_pb.CommonResponse.decode(d);
                if(rsp.ErrCode==Err.ErrCode_Success){
                    this.tip('返回原地成功',ct.green)
                    GD.player.setMoveMotion(true)
                }else if(rsp.ErrCode==Err.ErrCode_TooManyRedPoint){
                    UIMgr.I.tip(TooManyRedPointInfo)
                }else{
                    this.tip('返回失败，原地址已失效')
                }
            })
        }
    }
    doDeleteBoss=()=>{
        //驱逐BOSS
        let unit=GD.player.selectedUnit
        if(unit&&unit.unitType==UnitType.Monster){
            let req=outer_pb.SwitchBossOwner.create()
            req.Index= (unit as MonsterControl).data.Index
            let buf = outer_pb.SwitchBossOwner.encode(req).finish()
            WS.send(MT.DeleteMyBoss,buf,(d:any)=>{
                let rsp=outer_pb.SwitchBossOwner.decode(d);
                if(rsp.ErrCode==Err.ErrCode_Success){
                    UIMgr.I.tip('驱逐成功',ct.green)
                }else{
                    UIMgr.I.tip('驱逐失败')
                }
            })
        }
    }
    doSouHunBoss=()=>{
        //搜魂BOSS
        let unit=GD.player.selectedUnit
        if(unit&&unit.unitType==UnitType.Monster){
            let m = unit as MonsterControl
            if(m.data.Type==3){
                let req=outer_pb.UseItemAct.create()
                req.Index= m.data.Index
                let buf = outer_pb.UseItemAct.encode(req).finish()
                WS.send(MT.SouHun,buf,(d:any)=>{
                    let rsp=outer_pb.UseItemAct.decode(d);
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        // console.log('hunId=',rsp.HunIds)
                        this.getAndShowResultBox(rsp,'搜魂收益')
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughLv){
                        UIMgr.I.tip('等级不足')
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughNum){
                        UIMgr.I.tip('已搜魂')
                    }else{
                        UIMgr.I.tip('搜魂失败')
                    }
                })
            }
        }
    }
    onAutoRecoverEquips=(d:any)=>{
        let rsp = outer_pb.RecoverEquips.decode(d);
        rsp.UidList.forEach(uid=>{
            GD.role.tryDeleteBagEquip(uid)
        })
        if(this.curPageType==PageType.RolePage){
            let tab = this.RolePage.getComponent(RolePage).tab
            if(tab.selectedIndex==0){
                tab.select(0)
            }
        }
        // if(rsp.GetNum>0){
        //     GD.role.getItem(47,rsp.GetNum,true,true,'分解装备')
        // }
        // if(rsp.GetGolds){
        //     GD.role.addGold(rsp.GetGolds,true,'分解装备')
        // }
        // if(rsp.GetDias){
        //     GD.role.addDia(rsp.GetDias,true,'分解装备')
        // }
        for(let i in rsp.Items){
            const id = parseInt(i)
            GD.role.getItem(id,rsp.Items[i],true,true,'分解装备')
        }
        this.refreshBag(true)
    }
    refreshBag(needCancelToggle:boolean=false){
        if(this.curPageType==PageType.RolePage){
            if(EquipView.I&&EquipView.I.node.active==true){
                EquipView.I.node.emit('refreshBag');
                needCancelToggle&&EquipView.I.node.emit('cancelToggle');
            }
        }else if(this.curPageType==PageType.MarketPage){
            this.MarketPage.emit('refreshBag');
        }else if(this.curPageType==PageType.CkPage){
            this.CkPage.emit('refreshBag');
            needCancelToggle&&this.CkPage.emit('cancelToggle');
        }
        if(this.PopView.node.active)this.PopView.node.emit('refreshBag');
    }
    isLoadingMap:boolean=false;
    sendFocusChange=(isIn:boolean)=>{
        if(this.isLoadingMap==false){
            let req = outer_pb.FocusAct.create();
            req.IsFocus=isIn;
            if(isIn){
                req.LastSysGGT = GD.sysGG==null?0:GD.sysGG.Time;
            }
            let buff = outer_pb.FocusAct.encode(req).finish();
            WS.send(MT.FocusChange,buff);
        }
    }
    resetMainUI(): void {
        this.resetExpBarLen()
        this.refreshUI()
        this.resetAllSkillSlotSkin()
        this.setItemSlot();
        if(GD.role.data.TeamId>0){
            WS.send(MT.GetMyTeam,GD.EmptyRequestBuff,this.onGetMyTeam);
        }else{
            GD.role.myTeam=null;
            this.resetTeamBox();
        }
    }
    updateBuffsUIAndBasePros(rsp:outer_pb.UpdateBuffs){
        this.updateMyBuffsUI(rsp.Buffs)
        rsp.BasePros&&this.resetRoleBasePros(rsp.BasePros)
    }
    updateMyBuffsUI=(buffs:{[k: string]: outer_pb.IBuffInfo;})=>{
        this.buffBox.removeAllChildren();
        let n=0
        for(let id in buffs){
            if(n<12){
                //最多显示12个字，多于的不显示
                let info = GD.allBuffs.get(parseInt(id))
                if(info){
                    let node = instantiate(this.tempBuffNode);
                    let label = node.children[0].getComponent(Label)
                    label.color.fromHEX(info.color)
                    label.string = info.Sign
                    node.active=true;
                    node.parent=this.buffBox;
                    n++
                }
            }
        }
        if(this.buffInfoBox.active)this.buffList.array=GD.role.buffs;
    }
    refreshKfPkBuffRich=(rsp:outer_pb.JoinLineAct)=>{
        // console.log('tryShowPkBox:'+rsp.Day)
        let buff=''
        let color=ct.blue
        if(rsp.Day){
            buff+=`与对方s${rsp.Sid}服开服天数相差${rsp.Day}天，跨服额外加成：<br/>`
            let who='我方'
            let day = rsp.Day
            if(day<0){
                day = -day
                color=ct.red
                who='对方'
            }
            let a = day/2
            a = Math.min(90,day/2>>0)
            buff+=`  ${who} 伤害提升 ${day/2>>0}%<br/>`
            buff+=`  ${who} 受到伤害减少 ${a}%<br/>`
            buff+=`  ${who} 受到反伤减少 ${day}<br/>`
            buff+=`  ${who} 元素攻击力增加 +${day}<br/>`
            buff+=`  ${who} 元素防御力增加 +${day/2>>0}`
            // if(rsp.Day>0){
            // }else{
            //     a = Math.max(-90,rsp.Day/2)
            //     color=ct.red
            //     buff+=`  伤害降低 ${rsp.Day/2}%<br/>`
            //     buff+=`  受到伤害增加 ${a}%<br/>`
            //     buff+=`  受到反伤增加 ${rsp.Day}<br/>`
            //     buff+=`  元素攻击力减少 ${rsp.Day/2}<br/>`
            //     buff+=`  元素防御力减少 ${rsp.Day}`
            // }
        }
        this.kfBuffRich.string=`<color=${color}>${buff}</>`
    }
    onGetNewHuoDong=(d:any)=>{
        let rsp = outer_pb.HuoDongAct.decode(d);
        this.showHdUi(rsp)
    }
    //是否有节日活动
    showHdUi=(rsp:any)=>{
        if(rsp.HdStopTime>Tools.getBeiJingSecond()){
            this.jrHuoDong.active=true
            this.jrHuoDong.children[0].getComponent(Label).string=rsp.HdName
        }else{
            this.jrHuoDong.active=false
        }
    }
    onFocusChange=(d:any)=>{
        let rsp = outer_pb.FocusAct.decode(d);
        this.onRoleDataLoaded(rsp,false)
    }
    onPkRoleDataLoaded=(rsp:outer_pb.FocusAct)=>{
        this.openDayDo.active=false
        GD.isFocusIn=true
        let data = GD.role.data;
        let basePro=GD.role.basePros;
        data.I=rsp.I;
        data.J=rsp.J;
        data.IsAuto=true;
        basePro.CurHp=rsp.CurHp>>0;
        GD.role.lastMaxHp=rsp.MaxHp>>0;
        basePro.CurMp=rsp.CurMp>>0;
        GD.role.lastMaxMp=rsp.MaxMp>>0;
        basePro.CurAg=rsp.Ag>>0;
        GD.role.lastMaxAg=rsp.MaxAg>>0
        basePro.CurSd=rsp.Sd>>0
        GD.role.lastMaxSd=rsp.MaxSd>>0;

        basePro.LjValue = rsp.LjValue>>0;
        this.resetLjValue();

        data.Lv=rsp.Lv
        data.DsLv=rsp.DsLv
        data.ZsNum=rsp.ZsNum
        data.TeamId=rsp.TeamId
        GD.curMap.onFocusIn(rsp);
        this.resetMainUI();
        this.hideCurPage(false,true);
        this.mainMenu.active=this.chatMsgBox.active=this.menuBox.active=this.controlBox.node.active=false;
        this.exitPkBtn.active=false
        // let show=false
        let lvStr=''
        if(rsp.TowerLv>0){
            // show=true
            lvStr=`第${rsp.TowerLv}层`
        }
        // this.hidePk.active=show
        this.towerLv.string=lvStr;
        this.tip(`准备开始战斗！`,ct.green);
    }
    onRoleDataLoaded=(rsp:outer_pb.FocusAct,isReloadMap:boolean,welcome:string='',openPkPageType:number=0)=>{
        GD.isFocusIn=rsp.IsFocus;
        this.mainMenu.active=this.chatMsgBox.active=this.menuBox.active=this.controlBox.node.active=rsp.IsFocus;
        this.exitPkBtn.active=false
        if(rsp.IsFocus){
            if(rsp.SysGG){
                if(GD.sysGG==null||rsp.SysGG.Time!=GD.sysGG.Time){
                    this.showGG(rsp.SysGG)
                }
            }
            //先更新位置
            let data = GD.role.data;
            let basePro=GD.role.basePros;
            data.I=rsp.I;
            data.J=rsp.J;
            data.IsAuto=true;
            basePro.FreePoint = rsp.FreePoint;
            basePro.CurHp=rsp.CurHp>>0;
            GD.role.lastMaxHp=rsp.MaxHp>>0;
            basePro.CurMp=rsp.CurMp>>0;
            GD.role.lastMaxMp=rsp.MaxMp>>0;
            basePro.CurAg=rsp.Ag>>0;
            GD.role.lastMaxAg=rsp.MaxAg>>0
            basePro.CurSd=rsp.Sd>>0
            GD.role.lastMaxSd=rsp.MaxSd>>0;

            basePro.LjValue = rsp.LjValue>>0;
            this.resetLjValue();

            data.Dia=rsp.Dia;
            data.MuPoint=rsp.MuPoint
            data.Gold=rsp.Gold
            data.Lv=rsp.Lv
            data.DsLv=rsp.DsLv
            data.ZsNum=rsp.ZsNum
            data.Exp=rsp.Exp
            data.MaxExp=rsp.MaxExp
            data.TeamId=rsp.TeamId
            if(rsp.ResetData){
                rsp.ResetData.DayQuests.sort((q1,q2)=>{return q1.TaskId-q2.TaskId})
                GD.role.ResetDayData = rsp.ResetData
            }
            if(rsp.Emails){
                for(let uid in rsp.Emails){
                    GD.role.getMail(uid,rsp.Emails[uid])
                }
            }
            this.switchMailRedPoint();
            GD.role.kfTime = rsp.KfTime;
            if(GD.curMap.mapData.IsKf==1){
                this.startUpdateKfTime();
            }
            //更新日常清单
            this.openDayDo.active = true
            //是否有节日活动
            this.showHdUi(rsp)
            GD.expRate = rsp.ExpRate;
            this.refreshExpRateUI()
            if(rsp.LoadQuest){
                GD.role.LianTiPros = rsp.LianTiPros;
                GD.role.XqPros = rsp.XqPros;
                
                this.refreshMainQuestUI();
                if(rsp.TgTime>0){
                    let msgs:Array<BoxMsg>=[]
                    msgs.push(new BoxMsg(`托管统计`,ct.brown)) //
                    msgs.push(new BoxMsg(`<size=22>(若期间服务器重启，则只统计重启后的托管数据)</>`,ct.gray))
                    msgs.push(new BoxMsg(`本次托管时长：${Tools.getDeltaTimeString(rsp.TgTime)}<br/>`,ct.white))
                    msgs.push(new BoxMsg(`死亡次数：${rsp.DeathNum.toLocaleString()}`,ct.brown))
                    msgs.push(new BoxMsg(`损失经验：${rsp.ReduceExp.toLocaleString()}<br/>`,ct.brown))
                    msgs.push(new BoxMsg(`装备残片：${rsp.GotCp}`,ct.yellow))
                    msgs.push(new BoxMsg(`金币：${rsp.GotGold.toLocaleString()}`,ct.yellow))
                    msgs.push(new BoxMsg(`经验值：${rsp.GotExp.toLocaleString()} (${(rsp.GotExp/rsp.TgTime*10>>0)/10}/秒)<br/>`,ct.blue))
                    msgs.push(new BoxMsg(`普通装备：${rsp.GotEquipNum}`,ct.white))
                    msgs.push(new BoxMsg(`卓越装备：${rsp.GotZyNum}`,ct.green))
                    if(rsp.GotItems){
                        let other:number=0
                        for(let id in rsp.GotItems){
                            const itemId = parseInt(id)
                            if(itemId>=2000&&itemId<3000){
                                other+=rsp.GotItems[id]
                            }else{
                                let base = GD.ItemBaseDatas.get(itemId)
                                if(base){
                                    msgs.push(new BoxMsg(`${base.Name}x${rsp.GotItems[id]}`,Tools.getItemColor(itemId)))
                                }
                            }
                        }
                        if(other>0){
                            msgs.push(new BoxMsg(`副本材料x${other}`,ct.blue))
                        }
                    }
                    this.PopView.showMsgBox(msgs,'关闭')
                    GameManager.I.playTipSound('getMail')
                }
            }else{
                this.tip(`欢迎来到：${welcome}`,ct.green);
            }
            if(isReloadMap){
                this.switchControlBox(true)
            }else{
                //focus时重新获取到背包
                GD.role.updateBag(rsp.BagEquips,rsp.BagItems)
            }
            GD.curMap.onFocusIn(rsp);
            this.resetMainUI();
            //根据 GD.lastWorldMsgTime获取最新世界聊天消息
            let has=false
            if(rsp.PrivateMsgs.length>0){
                let arr = GD.chatMsgs.get(ChatChannelType.Private)
                rsp.PrivateMsgs.forEach(data=>{
                    arr.push(data);
                    if(arr.length>50){
                        arr.splice(0,1)
                    }
                })
                has=true
            }
            if(rsp.Msgs.length>0){
                let wordMsg:Array<outer_pb.IChatMsg>=[]
                let teamMsg:Array<outer_pb.IChatMsg>=[]
                let zmMsg:Array<outer_pb.IChatMsg>=[]
                // console.log('focus',rsp.Msgs)
                rsp.Msgs.forEach(msg=>{
                    if(msg.Chanel==ChatChannelType.World){
                        wordMsg.push(msg)
                    }else if(msg.Chanel==ChatChannelType.Team){
                        teamMsg.push(msg)
                    }else if(msg.Chanel==ChatChannelType.ZhanMeng){
                        zmMsg.push(msg)
                    }
                })
                let len = wordMsg.length;
                if(len>0){
                    // GD.role.lastWorldMsgTime = wordMsg[len-1].Time as number;
                    let arr = GD.chatMsgs.get(ChatChannelType.World);
                    wordMsg.forEach((data,i)=>{
                        arr.push(data)
                        if(arr.length>50){
                            arr.splice(0,1)
                        }
                    })
                    has=true
                }
                len = teamMsg.length;
                if(len>0){
                    // GD.role.lastTeamMsgTime = teamMsg[len-1].Time as number;
                    let arr = GD.chatMsgs.get(ChatChannelType.Team);
                    teamMsg.forEach((data,i)=>{
                        arr.push(data)
                        if(arr.length>50){
                            arr.splice(0,1)
                        }
                    })
                    has=true
                }
                len = zmMsg.length;
                if(len>0){
                    // GD.role.lastZmMsgTime = zmMsg[len-1].Time as number;
                    let arr = GD.chatMsgs.get(ChatChannelType.ZhanMeng);
                    zmMsg.forEach((data,i)=>{
                        arr.push(data)
                        if(arr.length>50){
                            arr.splice(0,1)
                        }
                    })
                    has=true
                }
            }
            has&&this.renderChatList();
            if(openPkPageType==1){
                //表示需要打开竞技场界面
                this.show(PageType.RankPkPage,false,true)
            }else if(openPkPageType==2){
                //表示需要打开战盟界面
                this.show(PageType.ZmPage,3,true)
            }else{
                this.hideCurPage(false,true);
            }
            if(rsp.State==3){
                //3为死亡状态
                this.showDeathUI();
            }else{
                this.showDeathView.active=false;
            }
        }else{
            // console.log('onFocusOut')
            GD.curMap.onFocusOut()
            this.showBoxMsgPage(MsgType.FocusOut,TuoGuanStr,'取消托管')
        }
    }
    getAndShowResultBox=(rsp:outer_pb.UseItemAct,head:string)=>{
        let msglist:Array<BoxMsg>=[]
        msglist.push(new BoxMsg(`${head}<br/>`,ct.white))
        // if(rsp.Exp>0){
        //     msglist.push(GD.role.getItem(13,rsp.Exp,true,false,'',true))
        // }
        if(rsp.Items){
            let other:number=0
            let hasDing=false;
            for(let i in rsp.Items){
                const id = parseInt(i)
                let msg = GD.role.getItem(id,rsp.Items[i],true,false,'',true)
                if(id>=2000&&id<3000){
                    other+=rsp.Items[i]
                }else{
                    msglist.push(msg)
                    if(id>=600) hasDing=true
                }
            }
            if(other>0){
                msglist.push(new BoxMsg(`副本材料x${other}`,ct.blue))
            }
            if(hasDing)GameManager.I.playTipSound('ding')
        }
        if(rsp.Equips.length>0){
            let zys = rsp.Equips.filter((e1)=>{return e1.ZyList.length>0})
            zys.forEach(equip=>{
                msglist.push(GD.role.getEquip(equip,true,true,false))
            })
            let other:number=0
            rsp.Equips.forEach(equip=>{
                if (equip.ZyList.length==0){
                    let msg = GD.role.getEquip(equip,true,true,false);
                    if (msglist.length<27){
                        msglist.push(msg)
                    }else{
                        other++;
                    }
                }
            })
            if(other>0){
                msglist.push(new BoxMsg('......',ct.blue))
            }
        }
        if(msglist.length>0){
            UIMgr.I.PopView.showMsgBox(msglist,'关闭')
        }
        UIMgr.I.refreshBag();
        // UIMgr.I.tip(tip,ct.green)
        GameManager.I.playTipSound('getItem')
    }
    renderChatList(){
        let msgs:Array<outer_pb.IChatMsg> = []
        GD.chatMsgs.forEach(ms=>{
            msgs.push(...ms)
        })
        // msgs = msgs.sort((a,b)=>{return b.Time-a.Time});
        const n=msgs.length;
        let i = n-5
        if(i<0) i=0;
        this.chatList.array=msgs.slice(i);
    }
    onGetChatMsg=(d:any)=>{
        let rsp = outer_pb.ChatMsg.decode(d);
        // console.log('onGetChatMsg',rsp)
        if(rsp.ErrCode==Err.ErrCode_Success){
            // if(rsp.Chanel==ChatChannelType.World){
            //     GD.role.lastWorldMsgTime=rsp.Time as number;
            // }else if(rsp.Chanel==ChatChannelType.Team){
            //     GD.role.lastTeamMsgTime=rsp.Time as number;
            // }else if(rsp.Chanel==ChatChannelType.ZhanMeng){
            //     GD.role.lastZmMsgTime=rsp.Time as number;
            // }
            let arr = GD.chatMsgs.get(rsp.Chanel)
            arr.push(rsp);
            if(arr.length>20){
                arr.splice(0,1)
            }
            let all_arr = this.chatList.array;
            all_arr.push(rsp)
            if(all_arr.length>5){
                all_arr.splice(0,1)
            }
            this.chatList.array=all_arr
    
            if(this.curPageType==PageType.ChatPage){
                this.ChatPage.getComponent(ChatPage).refreshList(rsp.Chanel)
            }
            if(rsp.IsSay&&rsp.Name==GD.role.data.Name){
                // GD.role.reduceDia(GD.configs.get(ConfigType.MarketSayNeedDia))
                UIMgr.I.tip('喊话成功',ct.green)
            }
            // else if(rsp.Chanel==ChatChannelType.Private){
            //     this.openChatPageBtn.children[1].active=true;
            // }
        }else if(rsp.ErrCode==Err.ErrCode_MsgInvalid){
            UIMgr.I.tip('发送失败，消息内容不合法')
        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughLv){
            UIMgr.I.tip(`发送失败，该频道聊天需要${rsp.Num}级`)
        }else if(rsp.ErrCode==Err.ErrCode_ChatForbidden){
            UIMgr.I.tip(`发送失败，您处于被禁言中，剩余${(Date.now()/1000-rsp.Num)/60>>0}分钟`)
        }else if(rsp.ErrCode==Err.ErrCode_ChatTimeTooShort){
            UIMgr.I.tip('发送太频繁')
        }else{
            UIMgr.I.tip('发送失败')
        }
    }
    onGetMyTeam=(d:any)=>{
        let rsp=outer_pb.TeamAct.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            GD.role.myTeam=rsp.TeamInfo;
            GD.role.data.TeamId=rsp.TeamInfo.TeamId;
        }else{
            GD.role.myTeam=null
            GD.role.data.TeamId=0;
        }
        this.resetTeamBox();
    }
    private curInviteMsg:outer_pb.GetInviteMsg;
    onGetInviteMsg=(d:any)=>{
        let rsp=outer_pb.GetInviteMsg.decode(d);
        this.curInviteMsg=rsp;
        let who=`<color=${ct.blue}>${rsp.Name}</>`
        if(rsp.MsgType==InviteMsgType.JoinTeam){
            this.inviteMsg.string=`${who} 邀请您加入他的队伍`
        }else if(rsp.MsgType==InviteMsgType.JoinZM){
            this.inviteMsg.string=`${who} 邀请您加入他的战盟`
        }else if(rsp.MsgType==InviteMsgType.Trade){
            this.inviteMsg.string=`${who} 向您申请交易`
        }
        this.inviteBox.active=true;
    }
    OnTeamOwnerChanged=(d:any)=>{
        let rsp=outer_pb.TeamAct.decode(d);
        if(GD.role.myTeam){
            GD.role.myTeam.OwnerN=rsp.Who
            GD.role.myTeam.OwnerId=rsp.Id
            if(this.curPageType==PageType.TeamPage){
                this.TeamPage.getComponent(TeamPage).myTeamList.refresh()
            }
            if(rsp.Who==GD.role.data.Name){
                this.tip('您晋升为队长',ct.green)
            }else{
                this.tip(`${rsp.Who} 晋升为队长`,ct.green)
            }
        }
    }
    onOnOtherJoinZm=(d:any)=>{
        let rsp=outer_pb.ZmAct.decode(d);
        this.curInviteMsg=null
        // GD.role.myZm=rsp.ZmInfo
        // if(this.curPageType==PageType.ZmPage){
        //     this.ZmPage.getComponent(ZmPage).resetMyZmUI()
        // }
        if(rsp.Who==GD.role.data.Name){
            this.tip('成功加入战盟',ct.green)
            GD.role.data.Zm=rsp.Name
            BattleManager.I.refreshPlayerNameLabel()
        }else{
            this.tip(`${rsp.Who} 加入您的战盟`,ct.green)
            BattleManager.I.refreshOtherNameLabel(rsp.Who,rsp.Name)
        }
    }
    onAgreeBeInvitedJoinZm=(d:any)=>{
        let rsp=outer_pb.ZmAct.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            // GD.role.myZm=rsp.ZmInfo
            GD.role.data.Zm=rsp.Name
            this.tip('成功加入战盟',ct.green)
            BattleManager.I.refreshPlayerNameLabel()
        }else if(rsp.ErrCode==Err.ErrCode_TeamNotExsit){
            this.tip('该战盟已解散')
        }else if(rsp.ErrCode==Err.ErrCode_TeamFull){
            this.tip('该战盟已满员')
        }else{
            this.tip('加入失败')
        }
    }
    OnBeHitOutZm=(d:any)=>{
        this.curInviteMsg=null
        GD.role.myZm=null
        GD.role.data.Zm='';
        if(this.curPageType==PageType.ZmPage){
            this.hideCurPage()
        }
        BattleManager.I.refreshPlayerNameLabel()
        this.tip('您被踢出战盟了')
    }
    OnOtherBeHitOutZm=(d:any)=>{
        let rsp=outer_pb.ZmAct.decode(d);
        // GD.role.myZm=rsp.ZmInfo
        // if(this.curPageType==PageType.ZmPage){
        //     this.ZmPage.getComponent(ZmPage).resetMyZmUI()
        // }
        BattleManager.I.refreshOtherNameLabel(rsp.Who,'')
        this.tip(`${rsp.Who} 被踢出战盟了`,ct.green)
    }
    OnZmMenberJobChanged=(d:any)=>{
        let rsp=outer_pb.ZmAct.decode(d);
        if(GD.role.myZm){
            let menber = GD.role.myZm.Menbers.find(info=>{return info.Id==rsp.Id})
            if(menber){
                menber.Job=rsp.NewJob
            }
            // if(this.curPageType==PageType.ZmPage){
            //     this.ZmPage.getComponent(ZmPage).memberList.refresh()
            // }
            if(menber.Name==GD.role.data.Name){
                this.tip(`您的职位变更为${ZmJobStr[rsp.NewJob]}`,ct.green)
            }else{
                this.tip(`${menber.Name} 的职位变更为${ZmJobStr[rsp.NewJob]}`,ct.green)
            }
        }
    }
    OnZmOwnerChanged=(d:any)=>{
        let rsp=outer_pb.ZmAct.decode(d);
        if(GD.role.myZm){
            let owner = GD.role.myZm.Menbers.find(info=>{return info.Id==rsp.Id})
            if(owner){
                owner.Job=ZmJobType.MengZhu;
                GD.role.myZm.Owner=owner.Name
            }
            let menber1 = GD.role.myZm.Menbers.find(info=>{return info.Name==rsp.Who})
            if(menber1){
                menber1.Job=rsp.NewJob;
            }
            // if(this.curPageType==PageType.ZmPage){
            //     this.ZmPage.getComponent(ZmPage).resetMyZmUI()
            // }
            if(owner.Name==GD.role.data.Name){
                this.tip('您晋升为盟主',ct.green)
            }else{
                this.tip(`${owner.Name} 晋升为盟主`,ct.green)
            }
        }
    }
    OnOtherExitZm=(d:any)=>{
        let rsp=outer_pb.ZmAct.decode(d);
        // GD.role.myZm=rsp.ZmInfo
        // if(this.curPageType==PageType.ZmPage){
        //     this.ZmPage.getComponent(ZmPage).resetMyZmUI()
        // }
        BattleManager.I.refreshOtherNameLabel(rsp.Who,'')
        this.tip(`${rsp.Who} 离开战盟了`)
    }
    onOnJoinTeam=(d:any)=>{
        let rsp=outer_pb.TeamAct.decode(d);
        this.curInviteMsg=null
        GD.role.myTeam=rsp.TeamInfo
        if(this.curPageType==PageType.TeamPage){
            this.TeamPage.getComponent(TeamPage).myTeamList.refresh()
        }
        this.resetTeamBox();
        if(rsp.Who==GD.role.data.Name){
            this.tip('成功加入队伍',ct.green)
            GD.role.data.TeamId=rsp.TeamInfo.TeamId
        }else{
            this.tip(`${rsp.Who} 加入您队伍`,ct.green)
        }
    }
    OnBeHitOutTeam=(d:any)=>{
        this.curInviteMsg=null
        GD.role.myTeam=null
        GD.role.data.TeamId=0;
        if(this.curPageType==PageType.TeamPage){
            this.hideCurPage()
        }
        this.resetTeamBox();
        this.tip('您被踢出队伍了')
    }
    OnOtherExitTeam=(d:any)=>{
        let rsp=outer_pb.TeamAct.decode(d);
        GD.role.myTeam=rsp.TeamInfo
        if(this.curPageType==PageType.TeamPage){
            this.TeamPage.getComponent(TeamPage).myTeamList.refresh()
        }
        this.resetTeamBox();
        this.tip(`${rsp.Who} 离开队伍了`)
    }
    OnOtherBeHitOutTeam=(d:any)=>{
        let rsp=outer_pb.TeamAct.decode(d);
        GD.role.myTeam=rsp.TeamInfo
        if(this.curPageType==PageType.TeamPage){
            this.TeamPage.getComponent(TeamPage).myTeamList.refresh()
        }
        this.resetTeamBox();
        this.tip(`${rsp.Who} 被踢出队伍了`,ct.green)
    }
    onAgreeBtnClick(event:EventTouch){
        GameManager.I.playClickSound();
        if(this.curInviteMsg){
            if(this.curInviteMsg.MsgType==InviteMsgType.JoinTeam){
                if(GD.role.myTeam){
                    this.tip('您已加入队伍')
                }else{
                    let req = outer_pb.TeamAct.create();
                    req.TeamId=this.curInviteMsg.TeamId;
                    let buff = outer_pb.TeamAct.encode(req).finish();
                    WS.send(MT.AgreeBeInvitedJoinTeam,buff)
                }
            }else if(this.curInviteMsg.MsgType==InviteMsgType.JoinZM){
                if(GD.role.myZm){
                    this.tip('您已加入战盟')
                }else{
                    let req = outer_pb.ZmAct.create();
                    req.Name=this.curInviteMsg.ZmName;
                    let buff = outer_pb.ZmAct.encode(req).finish();
                    WS.send(MT.AgreeBeInvitedJoinZm,buff)
                }
            }else if(this.curInviteMsg.MsgType==InviteMsgType.Trade){
                if(GD.role.isTrading){
                    this.tip('您已处于交易状态中')
                }else{
                    let req = outer_pb.TradeAct.create();
                    req.Id=this.curInviteMsg.Id;
                    let buff = outer_pb.TradeAct.encode(req).finish();
                    WS.send(MT.AgreeBeInvitedTrade,buff,(d:any)=>{
                        let rsp=outer_pb.TradeAct.decode(d);
                        if(rsp.ErrCode==Err.ErrCode_Success){
                            //显示交易窗口
                            UIMgr.I.show(PageType.TradePage,rsp)
                            UIMgr.I.tip('开始交易',ct.green)
                        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughLineTime){
                            UIMgr.I.tip('对方不在线')
                        }else{
                            UIMgr.I.tip('对方暂时无法交易')
                        }
                    })
                }
            }
            this.curInviteMsg=null;
        }
        this.inviteBox.active=false;
    }
    onStartTrade=(d:any)=>{
        let rsp=outer_pb.TradeAct.decode(d);
        UIMgr.I.show(PageType.TradePage,rsp)
        UIMgr.I.tip('开始交易',ct.green)
    }
    onAgreeBeInvitedJoinTeam=(d:any)=>{
        let rsp=outer_pb.TeamAct.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            GD.role.myTeam=rsp.TeamInfo
            GD.role.data.TeamId=rsp.TeamInfo.TeamId
            this.tip('成功加入队伍',ct.green)
        }else if(rsp.ErrCode==Err.ErrCode_TeamNotExsit){
            this.tip('该队伍已解散')
        }else if(rsp.ErrCode==Err.ErrCode_TeamFull){
            this.tip('该队伍已满员')
        }else{
            this.tip('加入失败')
        }
        this.resetTeamBox();
    }
    onRefuseBtnClick(event:EventTouch){
        this.curInviteMsg=null;
        this.inviteBox.active=false;
        GameManager.I.playClickSound();
    }
    updateTeamList(){
        if(GD.role.myTeam){
            this.teamList.refresh();
        }
    }
    target:Unit;
    ysSpPrefab:Node;
    updateTargetBox(){
        if(GD.player&&GD.player.selectedUnit&&GD.player.selectedUnit!=GD.player){
            this.targetInfoBox.active=true
            let unit = GD.player.selectedUnit
            let isAnotherTarget = unit!=this.target;
            this.target = unit;
            let curHp:number=0;
            let maxHp:number=0;
            let name:string='';
            let color:ct=ct.brown;
            let showSwitch:boolean=false
            if(unit.unitType==UnitType.Monster){
                this.targetSdBar.node.active=false;
                let m = unit as MonsterControl
                let data = m.data
                showSwitch = data.Type!=4&&data.Owner==GD.role.data.Name;
                curHp=data.CurHp;
                maxHp=data.MaxHp;
                if(isAnotherTarget){
                    this.targetYsList.removeAllChildren()
                    data.YsTypes.forEach((type:number,index:number)=>{
                        let node = instantiate(this.ysSpPrefab)
                        node.x=12+index*18;
                        node.y=0;
                        node.parent=this.targetYsList;
                        let label = node.children[0].getComponent(Label)
                        label.string=YsTypeString[type]
                        label.color.fromHEX(YsColors[type])
                    })
                    let base = GD.monsterBaseDatas.get(data.Id)
                    if(base){
                        if(data.Owner!=''){
                            name=`[${data.Owner}]${base.Name}`;
                        }else{
                            name=base.Name;
                        }
                    }
                    if(data.Type<0){
                        color=ct.brown
                    }else{
                        color = MonsterColorTypes[data.Type]
                    }
                }
                this.souHunBtn.active=data.Type==3&&m.state==UnitState.Death;
            }else{
                this.souHunBtn.active=false
                this.targetSdBar.node.active=true;
                let data = (unit as PlayerControl).data
                curHp = data.CurHp;
                maxHp = data.MaxHp;
                this.targetSdBar.progress = data.CurSd/data.MaxSd;
                if(isAnotherTarget){
                    this.targetYsList.removeAllChildren()
                    if(data.TeamId>0&&data.TeamId==GD.role.data.TeamId){
                        color=ct.qing;
                    }
                    name = data.Name;
                }
            }
            this.deleteBoss.active=this.switchBossOwner.active=showSwitch;
            if(isAnotherTarget){
                this.targetNameL.string = name;
                this.targetNameL.color.fromHEX(color);
            }
            this.targetHpBar.progress = curHp/maxHp;
            this.targetHpL.string = `${curHp.toLocaleString()}/${maxHp.toLocaleString()}`
        }else{
            this.targetInfoBox.active=false
            this.target = null;
        }
    }
    resetTeamBox(){
        if(GD.role.myTeam){
            this.teamBox.active=true;
            this.teamList.array=GD.role.myTeam.Menbers
            let height = GD.role.myTeam.Menbers.length*42;
            this.teamBox.getComponent(UITransform).height=height
            this.teamBox.children[0].getComponent(UITransform).height=height
            this.teamBox.children[0].children[0].getComponent(UITransform).height=height
            this.teamActBtn.getComponent(Widget).setDirty()
        }else{
            this.teamBox.active=false;
            this.teamList.array=[]
        }
    }
    resetExpBarLen(){
        this.expBar.totalLength = this.expBar.node.getComponent(UITransform).width-8;
    }
    switchControlBox(isShow:boolean){
        if(isShow){
            tween(this.controlBox).to(0.5,{opacity:255}).start();
        }else{
            tween(this.controlBox).to(0.5,{opacity:0}).start();
        }
    }
    refreshUI(){
        this.ljBar.node.active = GD.role.basePros.RoleTypeLv>=2;
        this.autoBtn.children[1].active = GD.role.data.IsAuto;
        this.ZmLabel.string = GD.role.data.Zm==''?'无战盟':GD.role.data.Zm;
        this.roleNameLabel.string = GD.role.data.Name
        Tools.loadSpriteFrame('ui/head/head'+GD.role.data.RoleType,GD.commonBundle).then(sp=>{
            if(sp)this.headIcon.spriteFrame=sp;
        })
        this.refreshGoldUI();
        this.refreshDiaUI();
        this.refreshMuPointUI();
        this.refreshLvUI();
        this.refreshHpMpSdAgUI();
        this.resetSkillModeUi();
    }
    refreshGoldUI(){
        this.goldLabel.string = Tools.formatMoneyString(GD.role.data.Gold);
    }
    refreshDiaUI(){
        this.diaLabel.string = Tools.formatMoneyString(GD.role.data.Dia);
    }
    refreshMuPointUI(){
        this.muPointLabel.string = GD.role.data.MuPoint.toLocaleString();
    }
    refreshExpUI(){
        this.expLabel.string = GD.role.data.Exp.toLocaleString()+' / '+GD.role.data.MaxExp.toLocaleString();
        this.expBar.progress = (GD.role.data.Exp as number)/ (GD.role.data.MaxExp as number);
    }
    refreshHpMpSdAgUI(){
        this.refreshHpUI();
        this.refreshMpUI();
        this.refreshAgUI();
        this.refreshSdUI();
        this.refreshExpUI();
    }
    refreshHpUI(){
        this.bloodBar.progress=GD.role.basePros.CurHp/GD.role.lastMaxHp
        this.hpNum.string=`${GD.role.basePros.CurHp>>0}/${GD.role.lastMaxHp}`;
    }
    refreshMpUI(){
        this.manaBar.progress=GD.role.basePros.CurMp/GD.role.lastMaxMp
        this.mpNum.string=`${GD.role.basePros.CurMp>>0}/${GD.role.lastMaxMp}`;
    }
    refreshAgUI(){
        this.agBar.progress=GD.role.basePros.CurAg/GD.role.lastMaxAg
        this.agNum.string=`${GD.role.basePros.CurAg>>0}/${GD.role.lastMaxAg}`;
    }
    refreshSdUI(){
        this.sdBar.progress=GD.role.basePros.CurSd/GD.role.lastMaxSd
        this.sdNum.string=`${GD.role.basePros.CurSd>>0}/${GD.role.lastMaxSd}`;
    }
    refreshAgMpUI(){
        this.refreshAgUI();
        this.refreshMpUI();
    }
    refreshLvUI(){
        this.lvLabel.string = `等级：${Tools.getLvStr(GD.role.data)}`
    }
    refreshExpRateUI(){
        this.expRate.string=`经验：${Math.round((GD.expRate*(1+GD.role.basePros.ExpUp))*100)/100}倍`
    }
    resetRoleBasePros(rsp:outer_pb.IBasePros){
        let old = GD.role.basePros;
        GD.role.basePros = rsp;
        GD.role.tempPros = outer_pb.BasePros.create(rsp)
        let oldSpeed = old.AllSpeed //GD.role.speed;
        GD.role.caculateAddPro(rsp);//计算addPros和新的speed
        if(oldSpeed!=null){
            let oldCd = Tools.calAtkCd(oldSpeed)
            let newCd = Tools.calAtkCd(rsp.AllSpeed)  //GD.role.speed
            let deltaSpeed = rsp.AllSpeed-oldSpeed;
            if(deltaSpeed!=0) {
                let interval = ((oldCd-newCd)*10000>>0)/10000;
                let str = deltaSpeed>0?"+":"";
                this.showProsMsg(`攻击速度${str}${(deltaSpeed*100>>0)/100} 技能CD${str}${interval}`,deltaSpeed>0?ct.green:ct.red);
            }
        }
        let lastMaxAg = Math.round(rsp.MaxAg*(1+rsp.MaxAgUp));
        let lastMaxSd = Math.round(rsp.MaxSd*(1+rsp.MaxSdUp));
        let lastMaxHp = Math.round(rsp.MaxHp*(1+rsp.MaxHpUp));
        let lastMaxMp = Math.round(rsp.MaxMp*(1+rsp.MaxMpUp));

        let delta = lastMaxAg-GD.role.lastMaxAg
        if(delta!=0) this.showProsMsg(`最大技能值 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
        delta = lastMaxSd-GD.role.lastMaxSd
        if(delta!=0) this.showProsMsg(`最大护盾值 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
        delta = lastMaxHp-GD.role.lastMaxHp
        if(delta!=0) this.showProsMsg(`最大生命值 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
        delta = lastMaxMp-GD.role.lastMaxMp
        if(delta!=0) this.showProsMsg(`最大魔法值 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
        delta=rsp.AllLL-old.AllLL
        if(delta!=0)this.showProsMsg(`力量 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
        delta=rsp.AllMJ-old.AllMJ
        if(delta!=0)this.showProsMsg(`敏捷 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
        delta=rsp.AllTL-old.AllTL
        if(delta!=0)this.showProsMsg(`体力 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
        delta=rsp.AllZL-old.AllZL
        if(delta!=0)this.showProsMsg(`智力 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
        delta=rsp.AllTS-old.AllTS
        if(delta!=0)this.showProsMsg(`统帅 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
        delta = (rsp.MinZzAtk-old.MinZzAtk)>>0
        if(delta!=0) this.showProsMsg(`最小诅咒力 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
        delta = (rsp.MaxZzAtk*(1+rsp.MaxAtkUp)-old.MaxZzAtk*(1+old.MaxAtkUp))>>0
        if(delta!=0) this.showProsMsg(`最大诅咒力 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
        delta = (rsp.MinAtk-old.MinAtk)>>0
        if(delta!=0) this.showProsMsg(`最小物理攻击力 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
        delta = (rsp.MaxAtk*(1+rsp.MaxAtkUp)-old.MaxAtk*(1+old.MaxAtkUp))>>0
        if(delta!=0) this.showProsMsg(`最大物理攻击力 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
        delta = ((rsp.MinMagicAtk+rsp.MaxMagicAtk*rsp.MinMagicAtkUp)-(old.MinMagicAtk+old.MaxMagicAtk*old.MinMagicAtkUp))>>0
        if(delta!=0) this.showProsMsg(`最小魔法攻击力 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
        delta = (rsp.MaxMagicAtk*(1+rsp.MaxAtkUp)-old.MaxMagicAtk*(1+old.MaxAtkUp))>>0;
        if(delta!=0) this.showProsMsg(`最大魔法攻击力 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
        delta = (rsp.AtkRate*(1+rsp.AtkRateUp)-old.AtkRate*(1+old.AtkRateUp))>>0
        if(delta!=0) this.showProsMsg(`攻击成功率 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
        delta = (rsp.AddPvPAtk-old.AddPvPAtk)>>0
        if(delta!=0) this.showProsMsg(`PvP攻击力 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
        delta = (rsp.AddPvPAtkRate*(1+rsp.AtkRateUp)-old.AddPvPAtkRate*(1+old.AtkRateUp))>>0
        if(delta!=0) this.showProsMsg(`PvP攻击成功率 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
        delta = ((rsp.Def+rsp.TaoDef)*(1+rsp.DefUp)-(old.Def+old.TaoDef)*(1+old.DefUp))>>0;
        if(delta!=0) this.showProsMsg(`防御力 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
        delta = ((rsp.DefRate+rsp.TaoDefRate)*(1+rsp.DefRateUp)-(old.DefRate+old.TaoDefRate)*(1+old.DefRateUp))>>0;
        if(delta!=0) this.showProsMsg(`防御成功率 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
        delta = (rsp.AddPvPDef*(1+rsp.DefUp)-old.AddPvPDef*(1+old.DefUp))>>0
        if(delta!=0) this.showProsMsg(`PvP防御力 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
        delta = (rsp.AddPvPDefRate*(1+rsp.DefRateUp)-old.AddPvPDefRate*(1+old.DefRateUp))>>0
        if(delta!=0) this.showProsMsg(`PvP防御成功率 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
        delta = (rsp.AtkUp-old.AtkUp)>>0
        if(delta!=0) this.showProsMsg(`物理攻击力提升 ${delta>0?"+":""}${(delta*1000>>0)/10}%`,delta>0?ct.green:ct.red);
        delta = (rsp.ZzAtkUp-old.ZzAtkUp)>>0
        if(delta!=0) this.showProsMsg(`诅咒力提升 ${delta>0?"+":""}${(delta*1000>>0)/10}%`,delta>0?ct.green:ct.red);
        delta = (rsp.MagicAtkUp-old.MagicAtkUp)>>0
        if(delta!=0) this.showProsMsg(`魔法攻击力提升 ${delta>0?"+":""}${(delta*1000>>0)/10}%`,delta>0?ct.green:ct.red);
        YsTypeString.forEach((s,i)=>{
            if(i>0){
                delta = (rsp.YsPros[i]?rsp.YsPros[i]:0)-(old.YsPros[i]?old.YsPros[i]:0)
                if(delta!=0) this.showProsMsg(`${s}元素 ${delta>0?"+":""}${delta}`,delta>0?ct.green:ct.red);
                delta = (rsp.YsAtks[i]?rsp.YsAtks[i]:0)-(old.YsAtks[i]?old.YsAtks[i]:0)
                if(delta!=0) this.showProsMsg(`${s}元素攻击力 ${delta>0?"+":""}${delta>>0}`,delta>0?ct.green:ct.red);
                delta = (rsp.YsDefs[i]?rsp.YsDefs[i]:0)-(old.YsDefs[i]?old.YsDefs[i]:0)
                if(delta!=0) this.showProsMsg(`${s}元素防御力 ${delta>0?"+":""}${delta>>0}`,delta>0?ct.green:ct.red);
            }
        })
        GD.role.lastMaxAg = lastMaxAg
        GD.role.lastMaxSd = lastMaxSd
        GD.role.lastMaxHp = lastMaxHp
        GD.role.lastMaxMp = lastMaxMp

        // old.CurAg = rsp.CurAg//Math.min(data.Ag,data.MaxAg)
        // old.CurSd = rsp.CurSd//Math.min(data.Sd,data.MaxSd)
        // old.CurHp = rsp.CurHp//Math.min(data.Hp,data.MaxHp)
        // old.CurMp = rsp.CurMp//Math.min(data.Mp,data.MaxMp)
        // old.AtkCd = rsp.AtkCd;
        this.refreshHpMpSdAgUI();
        this.refreshExpRateUI();
        GD.curMap.updateAllOtherPlayerEnemySign();
        //重置所有技能
        GD.role.resetAllSkills();
        UIMgr.I.resetAllSkillSlotSkin();
    }
    resetAllSkillSlotSkin(){
        this.skillBtns.children.forEach((node,index)=>{
            this.setSkillSlotSkin(node,index,GD.role.data.SkillMode)
        })
    }
    setItemSlot(){
        this.itemBtns.children.forEach((node,index)=>{
            let com = node.getComponent(Data)
            com.data=GD.allSkills.get(index+1);//1,2,3,4 血瓶、蓝瓶、随机、回城
        })
        this.updateItemSlotNums();
    }
    updateItemSlotNums=()=>{
        this.itemBtns.children.forEach((node,index)=>{
            const skill:Skill = node.getComponent(Data).data;
            if(skill&&(skill.Id<=4)){
                //血瓶1、蓝瓶2、随机3、回城4
                const numL=node.children[1].getComponent(Label)
                const item = GD.role.BagItems.find(item=>{return item.Id==GD.defaultSkillNeedItem.get(skill.Id)});
                let num=0
                if(item){
                    num=item.Num;
                }
                numL.string=`x${num}`;
            }
        })
    }
    resetEatBloodCd(){
        const node = this.itemBtns.children[0];
        const skill:Skill = node.getComponent(Data).data;
        if(skill&&(skill.Id==1)){
            //血瓶,重置CD
            const progress = node.children[0].getComponent(ProgressBar);
            // const atkCd=GD.configs.DefaultAtkCd-GD.role.basePros.AtkCd*0.4;
            const atkCd=GD.role.basePros.AtkCd;
            skill.NextUseTime = Date.now()+atkCd*1000;
            let t = this.skillTweens.get(skill.Id)
            if(t){
                t.stop();
            }
            progress.progress=1;
            t=tween(progress).to(atkCd,{progress:0}).start();
            this.skillTweens.set(skill.Id,t)
        }
    }
    setSkillSlotSkin(node:Node,index:number,mode:number,sp:SpriteFrame=null,isMainUi:boolean=true){
        const data = node.getComponent(Data)
        const id = GD.role.skillSlots.get(mode)[index];
        const skill = GD.role.skills.get(id);
        data.data = skill
        let sprite = node.children[0].getComponent(Sprite)
        let show=false;
        let showLv=false
        if(skill){
            showLv=true
            if(sp){
                sprite.spriteFrame = sp;
            }else{
                const path:string = "ui/skill_icon/" + id;
                Tools.loadSpriteFrame(path,GD.commonBundle).then((sp:SpriteFrame)=>{
                    sprite.spriteFrame = sp;
                })
            }
            show=!skill.canUse;
            if(isMainUi&&skill.canUse){
                let lvLabel = node.children[3].getComponent(Label)
                lvLabel.string=`Lv.${skill.Lv+GD.role.basePros.AddSkillLv}`
            }
        }else{
            sprite.spriteFrame = null;
        }
        node.children[2].active = show;
        if(isMainUi){
            node.children[3].active = showLv;
        }
    }
    onAutoBtnClick=()=>{
        GameManager.I.playClickSound();
        if(GD.player.state==UnitState.Moving){
            UIMgr.I.tip('角色移动中，无法切换')
            return
        }
        GD.role.changeAuto(!GD.role.data.IsAuto)
    }
    switchAuto=(auto:boolean)=>{
        GD.role.changeAuto(auto)
    }
    onSwitchAuto=(d:any)=>{
        let rsp=outer_pb.SwitchAuto.decode(d);
        GD.role.data.IsAuto = rsp.IsAuto
        this.autoBtn.children[1].active = rsp.IsAuto;
        if(rsp.IsAuto){
            //自动模式下，本地客户端的player不需要执行atking
            GD.player.lostTarget()
            this.showProsMsg('开始自动定点挂机...',ct.green,false)
        }
    }
    setAuto=(isAuto:boolean)=>{
        GD.role.data.IsAuto = isAuto
        this.autoBtn.children[1].active = isAuto;
        if(isAuto) GD.player.lostTarget()
    }
    setAtkBtnSkillSkin(skill:Skill){
        const path:string = "ui/skill_icon/" + skill.Id;
        Tools.loadSpriteFrame(path,GD.commonBundle).then((sp:SpriteFrame)=>{
            this.atkBtn.children[0].getComponent(Sprite).spriteFrame = sp;
        })
        this.atkBtn.children[2].active = !skill.canUse;
    }
    private onAtkBtnClick(){
        GD.player.startAtk();
        if(GD.role.data.IsAuto){
            this.switchAuto(false)
        }
    }
    private onSkillBtnClick(index:number,btnsBox:Node){
        const node=btnsBox.children[index]
        const data = node.getComponent(Data)
        if(data&&data.data){
            let p = GD.player;
            let skill:Skill = data.data;
            if(skill.Id>4&&skill.SkillType==SkillType.Atk){
                if(skill.TargetType==TargetType.Enemy) p.state=UnitState.Atking;
                p.curSkill=skill;
                this.atkBtn.children[0].getComponent(Sprite).spriteFrame=node.children[0].getComponent(Sprite).spriteFrame;
                if(GD.role.data.IsAuto){
                    this.switchAuto(false)
                }
            }
            p.tryUseSkill(skill);
        }else{
            // this.showProsMsg('空栏',ct.red,true,true)
            UIMgr.I.PopView.showSkillBox({nonSkill:null,mode:GD.role.data.SkillMode,index:index,sp:null})
        }
    }
    skillTweens:Map<number,Tween>=new Map();
    atkCdTween:Tween;
    curSkillTween:Tween;
    
    resetSkillSlotCd(skill:Skill,now:number,resetCurSkillSkin:boolean){
        if(skill.Id>4){
            let atkCd=GD.role.basePros.AtkCd;
            GD.role.nextAtkTime = now+atkCd*1000;
            let cd = skill.Cd-(GD.configs.get(ConfigType.DefaultAtkCd)-atkCd);
            if(cd<=0) cd=atkCd  //cd=GD.role.data.AtkCd;

            if(GD.needPlayCdAni){
                if(this.atkCdTween){
                    this.atkCdTween.stop();
                }
                this.atkCdProgress.progress=1;
                this.atkCdTween = tween(this.atkCdProgress).to(atkCd,{progress:0}).start();
                if(cd>0){
                    skill.NextUseTime = now+cd*1000;
                    // console.log('resetSkillSlotCd',atkCd,GD.role.data.AtkCd)
                    for(let i=this.skillBtns.children.length-1;i>=0;i--){
                        let node = this.skillBtns.children[i]
                        let data = node.getComponent(Data)
                        if(data&&data.data&&data.data.Id==skill.Id){
                            let t = this.skillTweens.get(skill.Id)
                            if(t){
                                t.stop();
                            }
                            let progress = node.children[0].getComponent(ProgressBar);
                            progress.progress=1;
                            t=tween(progress).to(cd,{progress:0}).start();
                            this.skillTweens.set(skill.Id,t)
                            break;
                        }
                    }
                    if(resetCurSkillSkin){
                        if(this.curSkillTween){
                            this.curSkillTween.stop();
                        }
                        let progress = this.atkBtn.children[0].getComponent(ProgressBar);
                        progress.progress=1;
                        this.curSkillTween=tween(progress).to(cd,{progress:0}).start();
                    }
                }else{
                    skill.NextUseTime = now
                }
            }else{
                if(cd>0){
                    skill.NextUseTime = now+cd*1000;
                }else{
                    skill.NextUseTime = now
                }
            }
        }
    }
    resetCd(skill:Skill,now:number){
        let atkCd=GD.role.basePros.AtkCd;
        if(skill.Id>4){
            GD.role.nextAtkTime = now+atkCd*1000;
            let cd = skill.Cd-(GD.configs.get(ConfigType.DefaultAtkCd)-atkCd);
            if(cd>0){
                // console.log(skill.Cd,GD.configs.get(ConfigType.DefaultAtkCd),atkCd,cd)
                skill.NextUseTime = now+cd*1000;
            }else{
                skill.NextUseTime = now
            }
        }else if(skill.Id==1){
            //喝血瓶
            skill.NextUseTime = Date.now()+atkCd*1000;
        }
    }
    private onPkModeChange(){
        const index = this.pkModeTab.selectedIndex
        if(index!=GD.role.data.PkMode){
            let req = outer_pb.SkillAct.create();
            req.Mode=index
            let buff = outer_pb.SkillAct.encode(req).finish();
            WS.send(MT.SwitchPkMode,buff,(d:any)=>{
                this.changePkMode(index)
            });
        }
    }
    changePkMode=(mode:number)=>{
        GD.role.data.PkMode=mode;
        let label=this.switchPkModeToggle.node.children[1].getComponent(Label);
        label.string=PKModeStr[GD.role.data.PkMode]
        if(GD.role.data.PkMode==0){
            label.color.fromHEX(ct.green)
        }else{
            label.color.fromHEX(ct.red)
        }
        // console.log('onPkModeChange')
    }
    private onSkillModeChange=(node:Node,index:number)=>{
        GD.playClickSound();
        // this.switchSkillModeToggle.isChecked=false;
        if(index!=GD.role.data.SkillMode){
            let req = outer_pb.SkillAct.create();
            req.Mode=index
            let buff = outer_pb.SkillAct.encode(req).finish();
            WS.send(MT.SwitchSkillMode,buff);
        }
    }
    onSwitchSkillMode=(d:any)=>{
        let rsp = outer_pb.SkillAct.decode(d)
        GD.role.data.SkillMode=rsp.Mode;
        this.resetSkillModeUi();
        // console.log('onSkillModeChange')
    }
    resetSkillModeUi=()=>{
        GD.role.resetAtkSkills();
        let label=this.switchSkillModeToggle.node.children[1].getComponent(Label);
        label.string=SkillModeStr[GD.role.data.SkillMode]
        this.resetAllSkillSlotSkin()
    }
    //====================
    pageStack:Array<PageType>=[]
    show(type:PageType,data:any=null,pushStack:boolean=false){
        BattleManager.I.lastClickTime=Date.now()/1000;
        let page = this.pageMap.get(type);
        if(page){
            if(this.curPage==null){
                GameManager.I.playOpenSound();
            }else{
                pushStack&&this.pageStack.push(this.curPageType)
                this.hideCurPage(false);
            }
            page.active=true;
            let ctl = page.getComponent(BasePage);
            ctl&&ctl.initData(data);
            // ctl.reShowPage=reShowPage;
            this.curPage=page;
            this.curPageType=type;
        }else{
            console.log('page不存在，type=',type);
        }
    }
    //隐藏旧页面
    hideCurPage=(popStack:boolean=true,clearStack:boolean=false)=>{
        BattleManager.I.lastClickTime=Date.now()/1000;
        if(this.curPage){
            let ctl = this.curPage.getComponent(BasePage);
            ctl&&ctl.onHide();
            this.curPage.active=false;
            this.curPage=null;
            this.curPageType=PageType.None;
            if(popStack && this.pageStack.length>0){
                this.show(this.pageStack.pop())
            }else{
                clearStack&&(this.pageStack=[])
                GameManager.I.playOpenSound();
            }
        }
    }
    resumCurPage=()=>{
        BattleManager.I.lastClickTime=Date.now()/1000;
        if(this.curPage){
            this.curPage.active=true
        }
    }
    //临时关闭当前页面
    pauseHideCurPage=()=>{
        BattleManager.I.lastClickTime=Date.now()/1000;
        if(this.curPage){
            // this.pageStack.push(this.curPageType)
            // let ctl = this.curPage.getComponent(BasePage);
            // ctl&&ctl.onHide();
            this.curPage.active=false;
        }
    }
    showBoxMsgPage=(t:MsgType,msg:string,btnStr1:string="确 定",btnStr2:string=null)=>{
        this.show(PageType.BoxMsgPage,{t:t,msg:msg,s1:btnStr1,s2:btnStr2})
    }
    startAutoReConnect=()=>{
        this.schedule(this.reConnect,5*60)
    }
    reloginRoleName:string;
    reloginSid:string;
    // curAccount:string;
    // curPass:string;
    reConnect=()=>{
        this.unschedule(this.reConnect);
        if(WS.c.readyState === WebSocket.OPEN && WS.Type==ConnType.Gate){
            WS.DoClose()
            return
        }
        WS.connectWS(WS.login_url,ConnType.Login).then(v=>{
            this.sendRelogin()
        }).catch(err=>{
            this.tip('服务器维护中，请稍后重试');
            //执行自动重连
            this.startAutoReConnect()
            this.showBoxMsgPage(MsgType.OffLine,'<color=#FF4700>您掉线了，请重新连接</color><br/><color=#C3C3C3>(5分钟后自动重新连接)</color>')
        })
    }
    sendRelogin=()=>{
        let info=GD.sdkUserInfo;
        let req = outer_pb.CommonAct.create({
            Account:info.uid,
            Uname:info.uname,
            Time:info.ts,
            Sign:info.sign,
            Name:this.reloginRoleName,
            ServerId:this.reloginSid,
            Version:GD.subVersion,
        });
        // req.Name=this.reloginRoleName;
        // req.Account=GD.sdkUserInfo.uid;
        // req.Pass=GD.pass;
        // req.ServerId=this.reloginSid;
        let buff = outer_pb.CommonAct.encode(req).finish();
        // this.tip(`测试提示：切换到[${req.Account}]下的[${req.Name}]`,ct.green)
        WS.send(MT.ReStarGame,buff,d=>{
            let isSwitchRole=GD.isSwitchRole;
            GD.isSwitchRole=false;
            let rsp = outer_pb.CommonResponse.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                MsgVerifier.key=rsp.K;
                // this.sm('连接中.....',ct.green);
                WS.DoClose().then(()=>{
                    // GD.gate_address=WS.ProtocolHead+rsp.Address;
                    let port = rsp.Address.split(':')[1];
                    GD.gate_address=`${WS.GameHomeUrl}:${port}`;
                    // GD.token=rsp.Token;
                    // console.log("get token",GD.gate_address,GD.token);
                    WS.connectWS(GD.gate_address,ConnType.Gate).then(v=>{
                        // this.sm('开始登陆角色.....',ct.green);
                        this.reLoginGate(rsp.Token,isSwitchRole);
                    })
                });
            }else{
                if(rsp.ErrCode==Err.ErrCode_AccountNotLogin){
                    this.tip('账号未登录');
                }else if(rsp.ErrCode==Err.ErrCode_ServerIsStoped){
                    this.tip('服务器未开放');
                }else if(rsp.ErrCode==Err.ErrCode_RoleNotExsit){
                    this.tip('角色不存在');
                }else if(rsp.ErrCode==Err.ErrCode_BadIp){
                    this.tip('Ip已被封停');
                }else if(rsp.ErrCode==Err.ErrCode_RoleIsFreezed||rsp.ErrCode==Err.ErrCode_AccountIsFreezed){
                    this.tip('角色或账号已被封停');
                }else if(rsp.ErrCode==Err.ErrCode_AccountNotExsited){
                    this.tip('账号不存在');
                }else if(rsp.ErrCode==Err.ErrCode_AccountWrongPass){
                    this.tip('密码错误');
                }else if(rsp.ErrCode==Err.ErrCode_ServerIdIsWrong){
                    this.tip('区服id错误');
                }else if(rsp.ErrCode==Err.ErrCode_HasNewVersion){
                    this.tip('客户端有新版本，即将重载游戏更新...');
                    this.scheduleOnce(()=>{
                        if(sys.isNative){
                            game.restart()
                        }else{
                            location.href=WS.home_url
                        }
                    },3)
                }else{
                    this.tip('服务器维护中');
                }
                WS.DoClose()
            }
        })
    }
    reLoginGate=(token:string,isSwitchRole:boolean)=>{
        let req = outer_pb.LoginGateRequest.create();
        req.Token=token;
        req.Name=this.reloginRoleName;
        req.isRelogin=true;
        // req.NeedLoadMDatas = GD.monsterMiniDatas.size==0
        let buff = outer_pb.LoginGateRequest.encode(req).finish();
        WS.send(MT.LoginGate,buff,d=>{
            let rsp = outer_pb.LoginGateResponse.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                MsgVerifier.key=rsp.K;
                // console.log('重新连接成功,rsp=',rsp)
                // this.sm('重新连接成功',ct.green);
                GD.init(rsp,true).then(()=>{
                    this.backBox.active=false;
                    this.resetMainUI();
                    Pools.resetPools();
                    BattleManager.I.joinLine(GD.role.data.WorldLv,GD.role.data.RoomId,-1,GD.role.data.LineId,null,false,false,true)
                    this.hideCurPage();
                    this.renderChatList();
                    GD.lastServer.id=this.reloginSid;
                    GD.friendList=null;
                    GameManager.I.set(GD.role.BagSet.Sets)
                    this.reStartHeartBeat();
                    //上报SDK平台，进入游戏
                    let role = rsp.RoleData
                    let date = new SdkRoleInfo();
                    date.eventType=SdkUpEventType.JoinGame;
                    date.serverId=GD.lastServer.id;
                    date.serverName=GD.lastServer.id+'服';
                    date.roleId=role.Id+'';
                    date.roleName=role.Name;
                    date.roleLevel=role.Lv;
                    SDK.uploadPlayerInfo(date).catch(reason=>{
                        //上报错误，重新上报一次
                        // SDK.uploadPlayerInfo(date);
                        console.log(reason)
                    })
                });
            }else{
                if(rsp.ErrCode==Err.ErrCode_RoleIsFreezed){
                    this.tip('角色被封停中..');
                }else if(rsp.ErrCode==Err.ErrCode_RoleIsOnline){
                    this.tip('该角色已在线，重新登录旧角色');
                }else if(rsp.ErrCode==Err.ErrCode_RoleNotExsit){
                    this.tip('角色不存在');
                }else{
                    this.tip('服务器维护中');
                }
                WS.DoClose();
            } 
        })
    }
    private onGetNewQuest=(d:any)=>{
        let rsp=outer_pb.QuestAct.decode(d);
        if(rsp.TaskType==TaskType.Main){
            let quest = GD.role.ResetDayData.MainQuest
            quest.TaskId=rsp.TaskId
            quest.Num=rsp.Num
            quest.State=rsp.State
            this.refreshMainQuestUI()
        }else if(rsp.TaskType==TaskType.Circle){
            let quest = GD.role.ResetDayData.CircleQuest
            if(quest==null){
                quest = outer_pb.CircleQuest.create()
                GD.role.ResetDayData.CircleQuest=quest
            }
            quest.QuestLv=rsp.QuestLv
            quest.TaskId=rsp.TaskId
            quest.Num=rsp.Num
            quest.State=rsp.State
            quest.Step=rsp.Step
            quest.Count=rsp.Count
            quest.JF=rsp.JF
        }else if(rsp.TaskType==TaskType.ChengJiu){
            let quest = outer_pb.MainQuest.create()
            quest.Num=rsp.Num
            quest.State=rsp.State
            quest.TaskId=rsp.TaskId
            GD.role.ResetDayData.CjQuests.push(quest)
        }else{
            let quest = outer_pb.DayQuest.create()
            quest.Num=rsp.Num
            quest.ResetDay=((Date.now()/1000/60 + 480) / 1440)>>0
            quest.State=rsp.State
            quest.TaskId=rsp.TaskId
            GD.role.ResetDayData.DayQuests.push(quest)
        }
        if(this.curPage&&this.curPageType==PageType.QuestPage){
            this.QuestPage.getComponent(QuestPage).refresh();
        }
    }
    private onUpdateQuest=(d:any)=>{
        let rsp=outer_pb.QuestAct.decode(d);
        // console.log('onUpdateQuest',rsp)
        if(rsp.TaskType==TaskType.Main){
            let quest = GD.role.ResetDayData.MainQuest
            quest.State=rsp.State
            quest.Num=rsp.Num
            this.refreshMainQuestUI()
        }else if(rsp.TaskType==TaskType.Circle){
            let quest = GD.role.ResetDayData.CircleQuest
            quest.State=rsp.State
            quest.Num=rsp.Num
            this.updateQuestPage(1)
        }else if(rsp.TaskType==TaskType.ChengJiu){
            let quest = GD.role.ResetDayData.CjQuests.find(q=>{return q.TaskId==rsp.TaskId})
            if(quest){
                quest.State=rsp.State
                quest.Num=rsp.Num
                this.updateQuestPage(1)
            }
        }else if(rsp.TaskType==TaskType.Day){
            let quest = GD.role.ResetDayData.DayQuests.find(q=>{return q.TaskId==rsp.TaskId})
            if(quest){
                quest.State=rsp.State
                quest.Num=rsp.Num
                this.updateQuestPage(0)
            }
        }
    }
    public updateQuestPage(type:number,justShow:boolean=false){
        if(this.curPage&&this.curPageType==PageType.QuestPage){
            let page = this.QuestPage.getComponent(QuestPage);
            if(justShow){
                page.show()
            }else{
                if(page.tab.selectedIndex==type) page.refresh();
            }
        }
    }
    private checkMainQuest(){
        // if(GD.role.isLimited(false))return
        let quest=GD.role.ResetDayData.MainQuest
        if(quest.State==1){
            this.tryCompleteQuest(quest.TaskId,TaskType.Main,null)
        }else{
            let base:QuestData = GD.QuestDatas.get(quest.TaskId)
            if(base&&base.Pos.length>0){
                let pos = outer_pb.Position.create()
                pos.WorldLv=base.Pos[0]
                pos.RoomId=base.Pos[1]
                pos.LineId=base.Pos[2]+''
                pos.I=base.Pos[3]
                pos.J=base.Pos[4]
                this.PopView.data=pos;
                this.PopView.gotoPos(false)
                // this.schedule(this.checkMainTaskPos,0.2)
            }
        }
    }
    tryCompleteQuest(taskId:number,taskType:TaskType,uid:string){
        let req = outer_pb.QuestAct.create()
        req.TaskId=taskId
        req.TaskType=taskType
        req.Uid=uid;
        let buff = outer_pb.QuestAct.encode(req).finish();
        WS.send(MT.CompleteQuest,buff,(d:any)=>{
            this.onCompleteQuest(d)
        })
    }
    private onCompleteQuest=(d:any)=>{
        let rsp = outer_pb.QuestAct.decode(d);
        // console.log('onCompleteQuest',rsp)
        const code = rsp.ErrCode
        if(code==Err.ErrCode_Success){
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
            // if(rsp.TgYk){
            //     GD.role.data.TgYk=rsp.TgYk;
            //     this.show(PageType.FuLiPage)
            // }
            if(rsp.ExpUp>0){//称号带来的提升
                GD.role.basePros.ExpUp = rsp.ExpUp
                this.refreshExpRateUI()
            }
            if(rsp.Equips.length>0){
                rsp.Equips.forEach(equip=>{
                    msglist.push(GD.role.getEquip(equip,true,true))
                })
            }
            if(rsp.TaskType==TaskType.Day){
                let quest = GD.role.ResetDayData.DayQuests.find(q=>{return q.TaskId==rsp.TaskId})
                if(quest){
                    quest.State=2;
                    this.updateQuestPage(0);
                }
            }else if(rsp.TaskType==TaskType.Circle){
                if(rsp.Uid!=''){
                    GD.role.tryDeleteBagEquip(rsp.Uid)
                }else{
                    let base:QuestData = GD.QuestDatas.get(rsp.TaskId)
                    if(base&&base.TargetType==TaskTargetType.SubmitItem&&base.TargetId>0){
                        GD.role.reduceItem(base.TargetId,base.TargetNum)
                    }
                }
                if(rsp.IsOver){
                    GD.role.ResetDayData.CircleQuest.TaskId=-1
                    this.updateQuestPage(2)
                }
            }else if(rsp.TaskType==TaskType.ChengJiu){
                let i = GD.role.ResetDayData.CjQuests.findIndex(q=>{return q.TaskId==rsp.TaskId})
                if(i>-1){
                    GD.role.ResetDayData.CjQuests.splice(i,1)
                    this.updateQuestPage(1);
                }
            }
            if(msglist.length>0){
                // let okStr=''
                // let cancel=''
                // if(cb){
                //     okStr='继续'
                //     cancel='取消'
                // }
                this.PopView.showMsgBox(msglist) //,okStr,cb,cancel
            }
            this.tip('成功完成任务',ct.green)
        }else if(code==Err.ErrCode_EquipNotFound){
            this.tip('需求装备不存在')
        }else if(code==Err.ErrCode_TaskNotAchieved){
            this.tip('任务未达成目标')
        }else if(code==Err.ErrCode_TaskNotFound){
            this.tip('未知任务')
        }else if(code==Err.ErrCode_TaskHasCompleted){
            this.tip('任务已完成并领取过奖励了')
        }else if(code==Err.ErrCode_TaskNotAchieved){
            this.tip('任务未达成目标')
        }
    }
    refreshMainQuestUI(){
        let quest=GD.role.ResetDayData.MainQuest
        let color=ct.blue;
        let btnLabel = this.mainQuestOkBtn.children[0].getComponent(Label);
        let base:QuestData = GD.QuestDatas.get(quest.TaskId)
        let showBtn:boolean=false;
        if(quest.State==1){
            color=ct.green
            showBtn = true;
            btnLabel.string='领取'
            quest.Num=base.TargetNum
        }else{
            if(base.Pos.length>0){
                showBtn = true;
                btnLabel.string='前往'
            }else{
                showBtn = false;
            }
        }
        let data = base.RewardItems[0]
        let color1:ct;
        let id = data[0]
        let num = data[1]
        let item = outer_pb.DropItem.create()
        item.Uid=''
        item.ItemId=id
        let name:string
        let n_s=''
        if(id<10000){
            let d=GD.role.data
            let up=0;
            if ((d.Lv + d.ZsNum*400) > 10) {
			    up = d.Lv - 10 + d.DsLv
			    if (d.ZsNum > 0) {
                    up = 400 - 10 + d.DsLv
                }
            }
            if(id==13){
                //经验值
                if(GD.role.data.IsYkMode){
                    num += up*100
                }else{
                    num += up*200
                }
            }else if(id==14){
                //金币
                if(GD.role.data.IsYkMode){
                    num = num/GD.role.data.DiaRate>>0
                    num += up*100
                }else{
                    num += up*200
                }
            }else if(id==15){
                //钻石
                num += up/10>>0
                if(num>1){
                    num=num/GD.role.data.DiaRate>>0;
                }
            }
            if((id==13||id==14||id==15)&&GD.role.hasGoldYk(false)){
                n_s=`x${num}<color=${ct.brown}>x3</>`
                num*=3
            }else{
                n_s=`x${num}`
            }
            name = GD.ItemBaseDatas.get(id).Name
            color1 = Tools.getItemColor(id)
            item.ItemType=2
        }else{
            let equip = data as outer_pb.IEquip
            equip.Id=id
            item.EquipData=equip
            item.ItemType=1
            name = GD.EquipBaseDatas.get(id).Name
            equip.QhLv = base.EquipPros[0]
            equip.ZjLv = base.EquipPros[1]
            equip.LuckyLv = base.EquipPros[2]
            equip.ZyList=[];
            equip.Lv=1;
            equip.TzLv=0;
            equip.Exp=0;
            if(equip.ZjLv>0||equip.LuckyLv>0){
                color1=ct.blue
            }
            n_s='x1'
        }
        item.ItemNum=num
        this.mainQuestJL.getComponent(RichTextHandler).data=item
        this.mainQuestJL.string=`奖励：<u><color=${color1} click="onClick" param="q">${name}</></u>${n_s}`
        this.mainQuestName.string=`${base.TaskName} (${quest.Num}/${base.TargetNum})`
        this.mainQuestName.color.fromHEX(color)
        this.mainQuestOkBtn.active = showBtn
        btnLabel.color.fromHEX(color)
        this.mainQuestFrame.width=Math.max((this.mainQuestName.string.length-6)*16+56,180);
        // console.log('len=',this.mainQuestJL.node.getComponent(UITransform).width+5,(this.mainQuestName.string.length-6)*18+56)
        this.mainQuestOkBtn.getComponent(Widget).setDirty();
    }
    // checkMainTaskPos(){
    //     let base:QuestData = GD.QuestDatas.get(GD.role.MainQuest.TaskId)
    //     let dis = Tools.get2dis(base.Pos[3],base.Pos[4],GD.role.data.I,GD.role.data.J)
    //     if(dis<=3){
    //         if(base.TargetType==TaskTargetType.TalkToNPC){
    //             GD.role.MainQuest.State=1;
    //             this.refreshMainQuestUI()
    //         }
    //         this.unschedule(this.checkMainTaskPos)
    //     }
    // }
    /**showInfoMsg */
    // msgNum:number=0; 
    tip(text:string,color:ct=ct.red,isMix:boolean=false){
        if(text=='')return;
        let b:Node;
        if(Pools.tipMsgPool.length===0){
            b = instantiate(GD.infoMsgPfb);
        }else{
            b = Pools.tipMsgPool.pop();
        }
        let t = b.children[0].getComponent(RichText);
        t.string = `<outline color=#000000><b><color=${color}>${text}</></></>`;
        // t.string = `<b><color=${color}>${text}</></>`;
        // t.color.fromHEX(color);
        let com = b.getComponent(BaseComponent)
        com.width = text.length*23+40;
        this.tipMsgBox.addChild(b);
        b.setSiblingIndex(0)
        this.tipMsgBox.children.forEach((node,index)=>{
            let pos:Vec3 = node.position
            pos.y = 100+index*50;
            node.position=pos;
        })
        this.scheduleOnce(()=>{
            // let y = pos.y+300
            tween(com).to(1.5,{opacity:0},{easing:'quartOut'}).call(()=>{
                b.removeFromParent();
                Pools.tipMsgPool.push(b);
                com.opacity=255;
            }).start()
        },1.5);
        if(color==ct.red){
            GameManager.I.playErrorSound();
        }else if(isMix){
            GameManager.I.playTipSound('eMix');
        }else{
            GameManager.I.playTipSound('good');
        }
    }
    showProsMsg(msg:string,color:ct=ct.red,isTop:boolean=true,isError:boolean=false){
        if(msg=='')return;
        let b:Node;
        if(Pools.proMsgPool.length===0){
            b = instantiate(GD.prosMsgPfb);
        }else{
            b = Pools.proMsgPool.pop();
        }
        let t = b.children[0].getComponent(Label);
        t.string = msg;
        t.color.fromHEX(color);
        let com = b.getComponent(BaseComponent)
        com.width = msg.length*24+5;
        com.widget.left=0;

        if(isTop){
            this.topMsgInfoBox.addChild(b);
            b.setSiblingIndex(0)
            this.topMsgInfoBox.children.forEach((node,index)=>{
                let pos:Vec3 = node.position
                pos.y = -238+index*24;
                node.position=pos;
            })
        }else{
            this.msgInfoBox.addChild(b);
            b.setSiblingIndex(0)
            this.msgInfoBox.children.forEach((node,index)=>{
                let pos:Vec3 = node.position
                pos.y = -238+index*24;
                node.position=pos;
            })
        }
        this.scheduleOnce(()=>{
            // let com = b.getComponent(BaseComponent)
            // let y = pos.y+250
            tween(com).to(1.5,{opacity:0},{easing:'quartOut'}).call(()=>{
                b.removeFromParent();
                Pools.proMsgPool.push(b);
                com.opacity=255;
            }).start()
        },1.5);
        if(isError)GameManager.I.playErrorSound();
    }
    private needAddLabels:Array<GetHpMpObj>=[]
    addGetHpMpLabel(num:number,type:number){
        this.needAddLabels.push({num:Math.round(num),type:type})
    }
    private scheduleAddHpMpLabel(){
        if(this.needAddLabels.length>0){
            let obj = this.needAddLabels.pop()
            let label:Label;
            if(Pools.getHpMpPool.length==0){
                label = instantiate(GD.dmgLabelPrefab).getComponent(Label);
                label.node.layer = this.node.layer;
            }else{
                label = Pools.getHpMpPool.pop().getComponent(Label);
            }
            let color = ct.green;
            if(obj.type==0){
                label.node.parent=this.getHpBox;
            }else{
                label.node.parent=this.getMpBox;
                color=ct.qing
            }
            label.string = '+'+obj.num;
            label.color.fromHEX(color);
            let com = label.getComponent(BaseComponent)
            com.opacity=255;
            com.y=-30;
            tween(com).to(1,{y:70,opacity:0}).call(()=>{
                label.node.removeFromParent();
                Pools.getHpMpPool.push(label.node)
            }).start()
        }
    }
}


