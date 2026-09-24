import { _decorator, Button, Component, EditBox, EventTouch, game, Label, math, Node, RichText, ScrollView, Sprite, SpriteFrame, sys, Toggle, tween, Vec2, Vec3 } from 'cc';
import Loading from './Loading';
import { List } from './UiComps/List';
import { Tab } from './UiComps/Tab';
import { ViewStack } from './UiComps/ViewStack';
import WS, { ConnType, installDataViewBigIntPolyfill } from './base/net';
import {  BodyType, ct, RoleTypeLvStr, RoleTypeStr, SdkRoleInfo, SdkUpEventType, SdkUserInfo, ServerInfo } from './base/types';
import { Err, MT } from './base/MT';
import GD from './base/GameData';
import Tools, { ValidAccontPassRegex, ValidNameRegex } from './base/tools';
import GameManager from './managers/GameManager';
import { PlayerControl } from './battle/PlayerControl';
import { SDK } from './base/SDK';
import { RoleUIControl } from './battle/RoleUIControl';
import { MaterialPool } from './base/Pools';
import { MsgVerifier } from './base/MsgVerifier';
const { ccclass, property } = _decorator;

// class RoleInfo{
//     n:string;
//     lv:number;
//     zm:string;
//     t:number;
//     skin:number;
//     constructor(info:outer_pb.IRoleInfo){
//         this.n=info.Name;
//         this.lv=info.Lv;
//         this.zm=info.ZhanMeng||"";
//         this.t=info.RoleType;
//         this.skin=info.Skin;
//     }
// }
class BaseRoleData{
    LL:number;
    MJ:number;
    TL:number;
    ZL:number;
    TS:number;
    info:string;
}

// var SwitchTypeNeed:Array<number>=[200,200,200,280,320,200,320,320];
var RoleBaseDatas:Array<BaseRoleData>=[
    {LL:28,MJ:20,TL:25,ZL:10,TS:0,info:'近战型职业，每级5点属性点，高攻击、高防御、高生命值，生存能力强，前期升级慢，后期很强大，可当输出、肉盾，职业特殊技能：生命之光，可临时提升自身和队友的最大生命值'},
    {LL:18,MJ:18,TL:15,ZL:30,TS:0,info:'远程输出职业，每级5点属性点，高群体伤害，防御和生命值较低，前期生存能力弱，后期很强大，职业特殊技能：守护之魂，可为自身和队友附加吸收伤害的护盾'},
    {LL:22,MJ:25,TL:20,ZL:15,TS:0,info:'远程输出职业，每级5点属性点，敏捷型弓箭手是输出能手，擅长独闯天涯，而智力型弓箭手则为辅助职业，有治疗能力，还可为自身和队友附加强大的Buff'},
    {LL:26,MJ:26,TL:26,ZL:26,TS:0,info:'全能型职业，每级7点属性点，升级最快的职业，可像战士一样仗剑天涯，也可像法师那样摧枯拉朽'},
    {LL:26,MJ:20,TL:20,ZL:15,TS:25,info:'异常强大的职业，每级7点属性点，后期可骑黑王马，可召唤宠物天鹰为自己战斗'},
    {LL:21,MJ:21,TL:18,ZL:23,TS:0,info:'非常特殊的职业，每级7点属性点，具有魔法的天赋，并且拥有着与界域互动的神秘能力，因为他们可以通过异界之书召唤和操控异界的猛兽'},
]
@ccclass('Login')
export class Login extends Component {
    @property({ group: { name: 'loginView' ,id:'0'}, type: Node })
    loginBtn:Node;
    @property({ group: { name: 'loginView' ,id:'0'}, type: Node })
    bhBox:Node;
    // @property({ group: { name: 'loginView',id:'0'}, type: Node })
    // loginPage:Node;
    // @property({ group: { name: 'loginView' ,id:'0'}, type: Tab })
    // loginTab: Tab = null;
    // @property({ group: { name: 'loginView' ,id:'0'}, type: ViewStack })
    // loginViewStack: ViewStack = null;
    // @property({ group: { name: 'loginView' ,id:'0'}, type: Button })
    // loginOkBtn: Button = null;

    @property({ group: { name: 'serverListView' ,id:'1'}, type: Node })
    serverListPage:Node;
    @property({ group: { name: 'serverListView' ,id:'1'}, type: Tab })
    myQuTab:Tab;
    @property({ group: { name: 'serverListView' ,id:'1'}, type: List })
    quList:List;
    @property({ group: { name: 'serverListView' ,id:'1'}, type: List })
    fuList:List;
    @property({ group: { name: 'serverListView' ,id:'1'}, type: Button })
    serverOkBtn:Button;
    @property({ group: { name: 'serverListView' ,id:'1'}, type: Button })
    reloginBtn:Button;
    @property({ group: { name: 'serverListView' ,id:'1'}, type: Node })
    helpBtn:Node;
    @property({ group: { name: 'serverListView' ,id:'1'}, type: Node })
    helpBox:Node;

    @property({ group: { name: 'lostPage' ,id:'2'}, type: Node })
    lostPage:Node;
    @property({ group: { name: 'lostPage' ,id:'2'}, type: Button })
    reconnectBtn:Button;

    @property({ group: { name: 'defaultServerPage' ,id:'3'}, type: Node })
    defaultServerPage:Node;
    @property({ group: { name: 'defaultServerPage' ,id:'3'}, type: Button })
    loginDefaultServerBtn:Button;
    @property({ group: { name: 'defaultServerPage' ,id:'3'}, type: Button })
    switchServerBtn:Button;

    @property({ group: { name: 'roleListPage' ,id:'4'}, type: Node })
    roleListPage:Node;
    @property({ group: { name: 'roleListPage' ,id:'4'}, type: Button })
    openCreateRoleBoxBtn:Button;
    @property({ group: { name: 'roleListPage' ,id:'4'}, type: Button })
    backToServerBtn:Button;
    @property({ group: { name: 'roleListPage' ,id:'4'}, type: List })
    roleList:List;
    @property({ group: { name: 'roleListPage' ,id:'4'}, type: List })
    roleList_mini:List;
    @property({ group: { name: 'roleListPage' ,id:'4'}, type: Toggle })
    showSkinToggle:Toggle;
    @property({ group: { name: 'roleListPage' ,id:'4'}, type: Label })
    roleListHeadT:Label;

    @property({ group: { name: 'roleInfoPage' ,id:'5'}, type: Node })
    roleInfoPage:Node;
    @property({ group: { name: 'roleInfoPage' ,id:'5'}, type: Button })
    joinGameBtn:Button;
    @property({ group: { name: 'roleInfoPage' ,id:'5'}, type: Node })
    cloaseRoleInfoBg:Node;
    @property({ group: { name: 'roleInfoPage' ,id:'5'}, type: Node })
    selectedRoleBox:Node;
    // @property({ group: { name: 'roleInfoPage' ,id:'5'}, type: RichText })
    // roleName:RichText;
    // @property({ group: { name: 'roleInfoPage' ,id:'5'}, type: Label })
    // roleLv:Label;
    @property({ group: { name: 'roleInfoPage' ,id:'5'}, type: Node })
    changeNameBtn:Node;
     @property({ group: { name: 'roleInfoPage' ,id:'5'}, type: RichText })
    changeNameInfo:RichText;
    @property({ group: { name: 'roleInfoPage' ,id:'5'}, type: Node })
    switchRoleTypeBtn:Node;
    @property({ group: { name: 'roleInfoPage' ,id:'5'}, type: Node })
    sellRoleBtn:Node;
    @property({ group: { name: 'roleInfoPage' ,id:'5'}, type: Node })
    deleteRoleBtn:Node;

    @property({ group: { name: 'createRolePag' ,id:'6'}, type: Node })
    createRolePage:Node;
    @property({ group: { name: 'createRolePag' ,id:'6'}, type: Tab })
    roleTypeTab:Tab;
    @property({ group: { name: 'createRolePag' ,id:'6'}, type: Tab })
    sexTypeTab:Tab;
    @property({ group: { name: 'roleListPage' ,id:'4'}, type: Label })
    creatNeed:Label;
    @property({ group: { name: 'createRolePag' ,id:'6'}, type: Node })
    randomBtn:Node;
    @property({ group: { name: 'createRolePag' ,id:'6'}, type: EditBox })
    roleNameInput:EditBox;
    @property({ group: { name: 'createRolePag' ,id:'6'}, type: Node })
    exitCreateRoleBtn:Node;
    @property({ group: { name: 'createRolePag' ,id:'6'}, type: Node })
    createRoleBtn:Node;
    @property({ group: { name: 'createRolePag' ,id:'6'}, type: Node })
    activeRoleBtn:Node;
    @property({ group: { name: 'createRolePag' ,id:'6'}, type: Node })
    checkBox:Node;
    @property({ group: { name: 'createRolePag' ,id:'6'}, type: Node })
    okBtn:Node;
    @property({ group: { name: 'createRolePag' ,id:'6'}, type: Node })
    cancelBtn:Node;
    @property({ group: { name: 'createRolePag' ,id:'6'}, type: RichText })
    okInfo:RichText;
    @property({ group: { name: 'createRolePag' ,id:'6'}, type: Node })
    createRoleBox:Node;
    @property({ group: { name: 'createRolePag' ,id:'6'}, type: Label })
    roleTypeName:Label;
    @property({ group: { name: 'createRolePag' ,id:'6'}, type: Label })
    rolePoints:Label;
    // @property({ group: { name: 'createRolePag' ,id:'6'}, type: Label })
    // canCreateInfo:Label;
    @property({ group: { name: 'createRolePag' ,id:'6'}, type: Label })
    roleInfoMsg:Label;

    @property({ group: { name: 'changeNamePage' ,id:'7'}, type: Node })
    changeNamePage:Node;
    @property({ group: { name: 'changeNamePage' ,id:'7'}, type: Node })
    exitChangeNameBtn:Node;
    @property({ group: { name: 'changeNamePage' ,id:'7'}, type: Node })
    changeNameOkBtn:Node;
    @property({ group: { name: 'changeNamePage' ,id:'7'}, type: EditBox })
    newNameInput:EditBox;

    @property({ group: { name: 'deleteRolePage' ,id:'8'}, type: Node })
    deleteRolePage:Node;
    @property({ group: { name: 'deleteRolePage' ,id:'8'}, type: Node })
    exitdeleteRoleBtn:Node;
    @property({ group: { name: 'deleteRolePage' ,id:'8'}, type: Node })
    deleteRoleOkBtn:Node;
    @property({ group: { name: 'deleteRolePage' ,id:'8'}, type: EditBox })
    deletePassInput:EditBox;
    @property({ group: { name: 'deleteRolePage' ,id:'8'}, type: RichText })
    deleteRoleInfo:RichText;

    @property({ group: { name: 'sellRolePage' ,id:'9'}, type: Node })
    sellRolePage:Node;
    @property({ group: { name: 'sellRolePage' ,id:'9'}, type: Node })
    exitSellRoleBtn:Node;
    @property({ group: { name: 'sellRolePage' ,id:'9'}, type: Node })
    sellRoleOkBtn:Node;
    @property({ group: { name: 'sellRolePage' ,id:'9'}, type: EditBox })
    sellPassInput:EditBox;
    @property({ group: { name: 'sellRolePage' ,id:'9'}, type: EditBox })
    otherAccountInput:EditBox;
    @property({ group: { name: 'sellRolePage' ,id:'9'}, type: RichText })
    sellRoleInfo:RichText;

    @property({ group: { name: 'switchTypePage' ,id:'10'}, type: Node })
    switchTypePage:Node;
    @property({ group: { name: 'switchTypePage' ,id:'10'}, type: Node })
    exitSwitchTypeBtn:Node;
    @property({ group: { name: 'switchTypePage' ,id:'10'}, type: Node })
    switchTypeOkBtn:Node;
    @property({ group: { name: 'switchTypePage' ,id:'10'}, type: Node })
    switchRoleBox:Node;
    @property({ group: { name: 'switchTypePage' ,id:'10'}, type: Label })
    switchTypeName:Label;
    @property({ group: { name: 'switchTypePage' ,id:'10'}, type: Label })
    switchTypePoints:Label;
    @property({ group: { name: 'switchTypePage' ,id:'10'}, type: RichText })
    switchNeedInfo:RichText;
    @property({ group: { name: 'switchTypePage' ,id:'10'}, type: Label })
    switchTypeInfoMsg:Label;
    @property({ group: { name: 'switchTypePage' ,id:'10'}, type: Tab })
    switchTypeTab:Tab;

    // @property({ group: { name: 'payPage' ,id:'11'}, type: Node })
    // payPage:Node;
    // @property({ group: { name: 'payPage' ,id:'11'}, type: Node })
    // payBtn:Node;
    // @property({ group: { name: 'payPage' ,id:'11'}, type: Node })
    // exitPayBtn:Node;
    // @property({ group: { name: 'payPage' ,id:'11'}, type: Tab })
    // payTypeTab:Tab;
    // @property({ group: { name: 'payPage' ,id:'11'}, type: Node })
    // showPayBtn:Node;
    @property({ group: { name: 'payPage' ,id:'11'}, type: Label })
    jfLabel:Label;
    @property({ group: { name: 'payPage' ,id:'11'}, type: Label })
    pointLabel:Label;
    @property(Label)
    infoT:Label;

    quTypes:Array<string>=['爽玩','原味']
    quModes:Map<number,boolean>//大区模式（是否为月卡区）
    maxOpenRoleTypeIndex:number=5;//已开放职业的最大索引（战士0、法师1、弓箭手2、魔剑士3、圣导师4、召唤师5、6、7....）
    serverData:Map<number,Array<ServerInfo>>=new Map();
    // myServerList:Map<number,Array<ServerInfo>>=new Map();
    myServerList:ServerInfo[]=[];
    selectedQuNode:Node;
    curQuIsYkMode:boolean;
    selectedFuNode:Node;
    btn_str:string[]=['注 册','登 录','修 改'];
    curShowPage:Node;
    selectedRole:outer_pb.RoleInfo;
    selectedFu:ServerInfo;
    static I:Login;

    start() {
        installDataViewBigIntPolyfill()
        Login.I=this;
        // this.curShowPage=this.loginPage;
        let set = localStorage.getItem('sets')
        if(set){
            let set1 = JSON.parse(set);
            GameManager.I.set(set1,false)
        }
        let server = localStorage.getItem('lastServer')
        if(server){
            GD.lastServer = JSON.parse(server);
        }
        let listObj = localStorage.getItem('myList');
        if(listObj){
            this.myServerList = JSON.parse(listObj);
        }
        this.fuList.array=[];
        this.myQuTab.selectedHandler = (node:Node,index:number)=>{
            if(index==0){
                if(this.quList.selectedIndex>-1){
                    this.fuList.array=this.serverData.get(this.quList.array[this.quList.selectedIndex])
                }else{
                    this.fuList.array=[];
                }
            }else{
                if(this.quList.selectedIndex>-1){
                    // this.fuList.array=this.myServerList.get(this.quList.array[this.quList.selectedIndex])||[];
                    this.fuList.array=this.myServerList;
                }else{
                    this.fuList.array=[];
                }
            }
            this.switchSelectedFu(null,-1);
        }
        this.quList.cellRender = (node:Node,index:number)=>{
            node.children[0].active = node==this.selectedQuNode;
            let mode="爽玩"
            let color=ct.white
            let showNew=false
            let gateId=this.quList.array[index];
            if(this.quModes.get(gateId)){
                mode="养老"
                color=ct.green
                showNew=true
            }
            node.children[2].active=showNew
            let label=node.children[1].getComponent(Label)
            label.string = `${gateId}区(${mode}版)`;
            label.color.fromHEX(color)
        };
        this.quList.selectedHandler = (node:Node,index:number)=>{
            // GameManager.I.playClick();
            // if(this.quList.selectedIndex==index)return;
            let gateId=this.quList.array[index];
            this.curQuIsYkMode=this.quModes.get(gateId)
            this.switchSelectedQu(node,index);
            this.switchSelectedFu(null,-1);
            this.myQuTab.select(0);
            this.fuList.array=this.serverData.get(this.quList.array[index]);
            // if(this.myQuTab.selectedIndex===0){
            //     this.fuList.array=this.serverData.get(this.quList.array[index]);
            // }
            // else{
                // this.fuList.array=this.myServerList.get(this.quList.array[index]);
                // this.fuList.array=this.myServerList;
            // }
        };
        this.quList.array=[];
        this.fuList.cellRender = (node:Node,index:number)=>{
            node.children[0].active = node==this.selectedFuNode;
            let mode="爽玩"
            let color=ct.white
            let gateId=this.quList.array[this.quList.selectedIndex];
            if(this.quModes.get(gateId)){
                mode="养老"
                color=ct.green
            }
            let label=node.children[1].getComponent(Label)
            label.string = `${mode}${this.fuList.array[index].name}`;
            label.color.fromHEX(color)
        };
        this.fuList.selectedHandler = this.switchSelectedFu;
        let show = localStorage.getItem('show')
        let isShowSkin = true
        if(show){
            let a = parseInt(show)
            isShowSkin = a?true:false;
        }
        this.showSkinToggle.isChecked=isShowSkin
        this.showSkinToggle.node.on('toggle',()=>{
            let b =this.showSkinToggle.isChecked
            localStorage.setItem('show',b?'1':'0')
            this.roleList.node.active = b;
            this.roleList_mini.node.active = !b;
            if(b){
                this.roleList.array = this.roleDataList;
            }else{
                this.roleList_mini.array = this.roleDataList;
            }
        })
        this.roleList.cellRender = (node:Node,index:number)=>{
            let info = this.roleList.array[index] as outer_pb.RoleInfo;
            Tools.renderRoleList(node.children[2],node.children[3],info);
        };
        this.roleList.selectedHandler = this.roleListselectedHandler
        this.roleList_mini.cellRender = (node:Node,index:number)=>{
            let info = this.roleList_mini.array[index] as outer_pb.RoleInfo;
            Tools.setRoleStateString(node.children[1].getComponent(Label),info);
            // const lv=info.Lv;
            node.children[2].getComponent(Label).string = RoleTypeStr[Math.log2(info.RoleType)]
            let color=ct.white;
            let now=Date.now()/1000>>0
            if(info.GoldYk>now){
                if(info.GoldYk-now<60*60*24*3){
                    color=ct.gray
                }else{
                    color=ct.yellow
                }
            }
            let lvStr=info.ZsNum>0?`${info.ZsNum}+${info.Lv}+${info.DsLv}`:`${info.Lv}级`
            node.children[0].getComponent(RichText).string=`<color=${ct.brown}>${lvStr}</> <color=${color}>${info.Name}</>`;
        };
        this.roleList_mini.selectedHandler = this.roleListselectedHandler
        this.roleList.array = []
        this.roleList_mini.array = []

        this.cloaseRoleInfoBg.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.showPage(this.roleListPage);
        },this);
        this.joinGameBtn.node.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            GameManager.I.playClickSound();
            this.joinGame();
        },this);
        //=============create role============
        this.exitCreateRoleBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.showPage(this.roleListPage);
        },this);
        this.createRoleBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            GameManager.I.playClickSound();
            let name = this.roleNameInput.string;
            if(ValidNameRegex.test(name)){
                // let type = Math.pow(2,this.roleTypeTab.selectedIndex);
                // if(Tools.isPowOfTwo(type,1,4)){ //判断是否在范围内，且是2的N次方
                const index = this.roleTypeTab.selectedIndex;
                if(index<=this.maxOpenRoleTypeIndex){
                    let type = Math.pow(2,index);
                    let need=0
                    if(this.roleDataList.length>=5){
                        need=this.createNeedPoint
                    }
                    if(need==0){
                        this.createRole(name,type);
                    }else{
                        this.showCheckBox(`创建需要：${need}点</><br/><br/>确定要创建？`,()=>{this.createRole(name,type);})
                    }
                }else{
                    this.showInfoT('无法创建',ct.red);
                }
            }else{
                this.showInfoT('昵称不合规',ct.red);
            }
        },this);
        this.randomBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            GameManager.I.playClickSound();
            this.roleNameInput.string=this.getRanName(this.sexTypeTab.selectedIndex);
        },this);
        
        this.roleTypeTab.selectedHandler = (node:Node,index:number)=>{
            GD.playClickSound();
            this.roleTypeName.string = `职业：${RoleTypeLvStr[index][1]}`;
            if(index<=this.maxOpenRoleTypeIndex){
                let data:BaseRoleData = RoleBaseDatas[index];
                this.rolePoints.string = `力量：${data.LL}  敏捷：${data.MJ}  体力：${data.TL}  智力：${data.ZL}  统帅：${data.TS}`;
                this.roleInfoMsg.string = data.info;
            }else{
                // this.createRoleBox.children[0].removeAllChildren();
                this.rolePoints.string = '';
                this.roleInfoMsg.string = '该职业暂未开放，尽情期待...';
            }
            this.showRoleUI(this.createRoleBox.children[0],index)
            let showActive = false;
            let showCreatBtn = false;
            if(index<=2 || this.activeRoles[Math.pow(2,index)]){
                showCreatBtn = index<=this.maxOpenRoleTypeIndex;
                // this.showRoleUI(this.createRoleBox.children[0],index)
            }else{
                // this.createRoleBox.children[0].removeAllChildren();
                showActive = true;
                let needStr=''
                const free = this.roleDataList.length>0&&this.roleDataList.some(r=>{return r.Lv>320||r.ZsNum>0});
                if(free){
                    needStr='可免费激活'
                }else{
                    needStr=`需要：${this.switchRoleTypeNeedMuPoints[Math.pow(2,index)]}点数\n任意角色等级>=320可免费激活`
                }
                this.activeRoleBtn.children[1].getComponent(Label).string=`激活后可创建\n${needStr}`
            }
            this.createRoleBtn.active = showCreatBtn;
            this.activeRoleBtn.parent.active = this.activeRoleBtn.active = showActive;
        }
        this.cancelBtn.on(Node.EventType.TOUCH_END,()=>{this.checkBox.active=false})
        this.activeRoleBtn.on(Node.EventType.TOUCH_END,()=>{
            let index=this.roleTypeTab.selectedIndex
            let need=this.switchRoleTypeNeedMuPoints[Math.pow(2,index)];
            const free = this.roleDataList.length>0&&this.roleDataList.some(r=>{return r.Lv>=320||r.ZsNum>0});
            if(free){
                this.activeRoleType(index)
            }else if(this.myMuPoint>=need){
                this.showCheckBox(`激活需要：${need}点</><br/><br/>确定要激活？`,()=>{this.activeRoleType(index)})
            }else{
                this.showInfoT('剩余点数不足');
            }
        })
        //=============switchRoleType============
        this.switchRoleTypeBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.showPage(this.switchTypePage);
            this.switchTypeTab.select(0);
        },this);
        this.exitSwitchTypeBtn.on(Node.EventType.TOUCH_END,this.showRoleInfoPage,this);
        this.switchTypeOkBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            GameManager.I.playClickSound();
            let index = this.switchTypeTab.selectedIndex;
            if(index>=0){
                // if(Tools.isPowOfTwo(type,1,64)){ //判断是否在范围内，且是2的N次方
                let role:outer_pb.RoleInfo = this.selectedRole;
                let need=0
                if(role.Lv>=200 || role.ZsNum>0 || (index>2&&(this.activeRoles[Math.pow(2,index)]==null))){
                    need = this.switchRoleTypeNeedMuPoints[Math.pow(2,index)]
                }
                if(need==0){
                    this.switchRoleType(Math.pow(2,index));
                }else{
                    this.showCheckBox(`转换需要：${need}点</><br/><br/>确定要转换？`,()=>{this.switchRoleType(Math.pow(2,index));})
                }
            }else{
                this.showInfoT('暂未开放');
            }
        },this);
        this.switchTypeTab.selectedHandler = (node:Node,index:number)=>{
            GD.playClickSound();
            this.showRoleUI(this.switchRoleBox.children[0],index)
            this.switchTypeName.string = `职业：${RoleTypeLvStr[index][1]}`;
            let role:outer_pb.RoleInfo = this.selectedRole;
            let can = index<=this.maxOpenRoleTypeIndex  && Math.log2(role.RoleType) != index;
            this.switchTypeOkBtn.active = can;
            if(index<=this.maxOpenRoleTypeIndex){
                let data:BaseRoleData = RoleBaseDatas[index];
                this.switchTypePoints.string = `力量：${data.LL}  敏捷：${data.MJ}  体力：${data.TL}  智力：${data.ZL}  统帅：${data.TS}`;
                this.switchTypeInfoMsg.string = data.info;
                if(Math.log2(role.RoleType) == index){
                    this.switchNeedInfo.string = '职业未改变';
                }else{
                    // let hasActived = this.activeRoles[Math.pow(2,index)]
                    let s = `【${RoleTypeLvStr[Math.log2(role.RoleType)][1]}】转【${RoleTypeLvStr[index][1]}】，转换需要`;
                    if(role.Lv>=200 || role.ZsNum>0 || (index>2&&(this.activeRoles[Math.pow(2,index)]==null))){
                        s += `<color=#ff6600>${this.switchRoleTypeNeedMuPoints[Math.pow(2,index)]}点数</>(从账号上扣)`
                    }else{
                        s += `<color=#00ff00>免费</>`
                    }
                    this.switchNeedInfo.string = s;
                }
            }else{
                this.switchTypePoints.string = ''
                this.switchTypeInfoMsg.string = '暂未开放，尽情期待...'
                this.switchNeedInfo.string = ''
            }
        }
        //================changeNamePage====================
        this.changeNameBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            let need = this.selectedRole.ChangeNameTime>0?`需要<color=${ct.brown}>${this.changeNameNeed}点</>`:`<color=${ct.green}>免费</>`
            this.changeNameInfo.string = `当前角色【<color=${ct.brown}>${this.selectedRole.Name}</>】第<color=${ct.brown}>${this.selectedRole.ChangeNameTime+1}</>次改名，${need}`
            this.showPage(this.changeNamePage);
        },this);
        this.changeNameOkBtn.on(Node.EventType.TOUCH_END,this.changeName,this);
        this.exitChangeNameBtn.on(Node.EventType.TOUCH_END,this.showRoleInfoPage,this);
        //=================deleteRolePage=======================
        // this.deleteRoleBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
        //     if(this.selectedRole.Lv>=30||this.selectedRole.ZsNum>0){
        //         this.showInfoT('该角色等级>=30级，无法删除')
        //     }else{
        //         this.showPage(this.deleteRolePage);
        //         this.deleteRoleInfo.string = `即将删除角色：<color=#FF8500>${this.selectedRole.Name}</>`
        //     }
        // },this);
        // this.deleteRoleOkBtn.on(Node.EventType.TOUCH_END,this.deleteRole,this);
        // this.exitdeleteRoleBtn.on(Node.EventType.TOUCH_END,this.showRoleInfoPage,this);
        //==================sellRolePage======================
        this.sellRoleBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            if(this.selectedRole.UsedMuPoint<30){
                this.showInfoT('该角色累计点数消耗未满30，无法转让')
            }else{
                let req = outer_pb.CommonAct.create()
                req.Name=this.selectedRole.Name
                let buff = outer_pb.CommonAct.encode(req).finish()
                WS.send(MT.GetSellRoleNeedMuPoint,buff,(d:any)=>{
                    let rsp=outer_pb.CommonResponse.decode(d)
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        this.showPage(this.sellRolePage);
                        this.sellRoleInfo.string = `<color=#f00>（该操作只能由GM进行，请联系GM）</><br/>转让角色：<color=#FF8500>${this.selectedRole.Name}</><br/>该角色转让手续费：<color=#FF8500>${rsp.NeedMuPoint}点</>`
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughMuPoint){
                        this.showInfoT('对方账号剩余点数不足'+rsp.NeedMuPoint)
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughCap){
                        this.showInfoT('无法转让给对方，对方账号已达角色数量上限');
                    }else{
                        this.showInfoT('该角色无法转让'+rsp.ErrCode)
                    }
                })
            }
        },this);
        this.sellRoleOkBtn.on(Node.EventType.TOUCH_END,this.sellRole,this);
        this.exitSellRoleBtn.on(Node.EventType.TOUCH_END,this.showRoleInfoPage,this);
        //========================================
        this.loginBtn.on(Node.EventType.TOUCH_END,(bt:Button)=>{
            // console.log('try_login')
            SDK.login().then((data:any)=>{
                // console.log('sdk login ok',data)
                this.login(data);
            })
        },this);
        // this.loginTab.selectedHandler = (node:Node,index:number)=>{
        //     GD.playClickSound();
        //     this.loginViewStack.selectedIndex = index;
        //     this.loginOkBtn.node.getComponentInChildren(Label).string = this.btn_str[index];
        // }
        // GD.account = localStorage.getItem('id');
        // GD.pass = localStorage.getItem('pass');
        // if(GD.account!=null&&GD.pass!=null){
        //     let node = this.loginViewStack.node.children[1].children[0];
        //     node.children[0].getComponent(EditBox).string=GD.account;
        //     node.children[1].getComponent(EditBox).string=GD.pass;
        //     this.loginTab.select(1);
        // }else{
        //     this.loginTab.select(0);
        // }
        // this.loginOkBtn.node.on(Node.EventType.TOUCH_END,(bt:Button)=>{
        //     const i = this.loginTab.selectedIndex;
        //     if(i==0){
        //         this.doAccount(0);//regist
        //     }else if(i==1){
        //         this.login();
        //     }else{
        //         this.doAccount(2);//changePass
        //     }
        // },this);
        this.backToServerBtn.node.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.showPage(this.serverListPage);
            // this.quList.selectedIndex=0;
            this.myQuTab.select(0);
        },this);
        this.openCreateRoleBoxBtn.node.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            const len=this.roleDataList.length;
            if(this.curQuIsYkMode&&len>0){
                if(this.roleDataList.some(info=>{return info.BaseYk<Tools.getBeiJingSecond()})){
                    this.creatNeed.string=`无法创建`
                    this.showInfoT('当前为搬砖版本，继续创建角色需要已创建的所有角色都已激活[永久特权卡]，才能继续创建')
                    return
                }
            }
            let need:string=''
            if(len>=5){
                need=`需要：${this.createNeedPoint}点`
                this.showPage(this.createRolePage);
                this.roleTypeTab.select(0)
                // if(this.myMuPoint>=this.createNeedPoint){
                //     need=`需要：${this.createNeedPoint}点`
                //     this.showPage(this.createRolePage);
                //     this.roleTypeTab.select(0)
                // }else{
                //     this.showInfoT(`创建第5个以上新角色需要${this.createNeedPoint}点/个，您的账号剩余点数不足`,ct.red);
                // }
            }else{
                this.showPage(this.createRolePage);
                this.roleTypeTab.select(0)
            }
            this.creatNeed.string=need
        },this);
        this.reconnectBtn.node.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            // this.showPage(this.loginPage);
            this.hideCurPage();
            this.loginBtn.active=true;
            this.loginSdk()
        },this);
        this.switchServerBtn.node.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.showPage(this.serverListPage);
            this.quList.selectedIndex=this.quList.array.length-1;
            this.myQuTab.select(0);
        },this);
        this.bhBox.active=true;
        this.loginDefaultServerBtn.node.on(Node.EventType.TOUCH_END,this.loginServer,this);
        this.serverOkBtn.node.on(Node.EventType.TOUCH_END,this.loginServer,this);
        this.reloginBtn.node.on(Node.EventType.TOUCH_END,()=>{
            if(sys.isNative){
                game.restart()
            }else{
                location.href=WS.home_url //`${WS.home_url}?${Date.now()}`
                // WS.Type=ConnType.Login; 
                // Loading.loadScene('Launch')
                // WS.DoClose();
            }
        },this);
        this.sexTypeTab.select(0);
        this.helpBtn.on(Node.EventType.TOUCH_END,()=>{
            this.helpBox.active=true;
            GameManager.I.playOpenSound()
        },this);
        this.helpBox.on(Node.EventType.TOUCH_END,()=>{
            this.helpBox.active=false;
            GameManager.I.playOpenSound()
        },this);
        // this.payTypeTab.select(0)
        // this.payTypeTab.labels=GD.AmountTypeStrs;
        // this.showPayBtn.on(Node.EventType.TOUCH_END,()=>{
        //     this.showPage(this.payPage);
        //     // this.payTypeTab.select(0)
        // },this);
        // this.showPayBtn.active=false
        // this.payBtn.on(Node.EventType.TOUCH_END,()=>{
        //     if(this.roleDataList.length>0){
        //         let role = this.roleDataList[0]
        //         let info = `login:${role.Id}:${role.Name}`
        //         SDK.tryPay(this.payTypeTab.selectedIndex,role.Name,role.Lv+role.ZsNum*400,role.Id,info)
        //     }
        // },this);
        // this.exitPayBtn.on(Node.EventType.TOUCH_END,()=>{
        //     this.showPage(this.roleListPage);
        //     // let req = outer_pb.EmptyRequest.create();
        //     // let buff= outer_pb.EmptyRequest.encode(req).finish();
        //     // WS.send(MT.GetMyAccountPointJf,buff,(d:any)=>{
        //     //     let rsp = outer_pb.CommonResponse.decode(d);
        //     //     this.showPage(this.roleListPage);
        //     //     let addPoint = rsp.MuPoint-this.myMuPoint;
        //     //     let addJf = rsp.Jf-this.myJf;
        //     //     this.updateMyMuPoint(rsp.MuPoint,rsp.Jf);
        //     //     if(addPoint>0||addJf>0){
        //     //         this.showInfoT(`点数+${addPoint}，积分+${addJf}`)
        //     //     }
        //     // })
        // },this);
        GameManager.I.playMusic('login_theme')
        // WS.cbs.set(MT.PaySuccess,this.onPaySuccess)
        this.loginSdk()
    }
    showRoleUI(parent:Node,index:number){
        if(index<=this.maxOpenRoleTypeIndex){
            let info = outer_pb.RoleInfo.create() //创建角色时显示UI
            let roletype=Math.pow(2,index);

            // Tools.getOtherUIBox(info.Name,info.Lv,info.DsLv,info.ZsNum,roletype,parent).then((role:PlayerControl)=>{
            //     for(let type=BodyType.Head;type<BodyType.Pet;type++){
            //         role.updateEquipUI(null,type,roletype)
            //     }
            // })

            info.RoleType=roletype
            Tools.get_UI_Role(info,parent,true).then((role:RoleUIControl)=>{
                for(let type=BodyType.Head;type<BodyType.Pet;type++){
                    role.updateEquipUI(null,type,roletype)
                }
            })
        }
    }
    activeRoleType(index:number){
        if(index<=2)return;
        let req = outer_pb.CommonAct.create();
        req.RoleType=Math.pow(2,index);
        req.ServerId=this.selectedFu.id;
        let buff = outer_pb.CommonAct.encode(req).finish();
        WS.send(MT.ActiveRoleType,buff,d=>{
            let rsp = outer_pb.CommonResponse.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                this.activeRoles = rsp.ActiveRoles;
                this.roleTypeTab.select(index);
                this.updateMyMuPoint(rsp.MuPoint,rsp.Jf)
                this.showInfoT('激活成功',ct.green);
                this.checkBox.active=false;
            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughMuPoint){
                this.updateMyMuPoint(rsp.MuPoint,rsp.Jf)
                this.showInfoT('您的账号剩余点数不足');
            }else{
                this.showInfoT('激活失败'+rsp.ErrCode);
            }
        })
    }
    switchRoleType(type:number){
        if(this.selectedRole){
            if(type==this.selectedRole.RoleType)return;
            let req = outer_pb.CommonAct.create();
            req.Name=this.selectedRole.Name;
            req.RoleType=type;
            let buff = outer_pb.CommonAct.encode(req).finish();
            // this.hideCurPage();
            WS.send(MT.SwitchRoleType,buff,d=>{
                let rsp = outer_pb.CommonResponse.decode(d);
                if(rsp.ErrCode==Err.ErrCode_Success){
                    this.selectedRole.RoleType = type;
                    this.selectedRole.BodyEquipIds={}
                    if(rsp.ActiveRoles)this.activeRoles=rsp.ActiveRoles;
                    this.getRoleList().refresh();
                    this.updateMyMuPoint(rsp.MuPoint,rsp.Jf)
                    this.showPage(this.roleListPage);
                    this.showInfoT('转换成功',ct.green);
                    this.checkBox.active=false;
                }else {
                    // this.showPage(this.roleInfoPage);
                    // if(rsp.ErrCode==Err.ErrCode_HasBodyEquip){
                    //     this.showInfoT('转换失败，角色身上装备未卸完');
                    // }else 
                    if(rsp.ErrCode==Err.ErrCode_NotEnoughMuPoint){
                        this.updateMyMuPoint(rsp.MuPoint,rsp.Jf)
                        this.showInfoT('您的账号剩余点数不足');
                    }else if(rsp.ErrCode==Err.ErrCode_RoleHasNotCache){
                        this.showInfoT('转换失败，该角色近期未登录过，请先登录一次');
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughNum){
                        this.showInfoT('转换失败，需要做主线任务到“达到指定等级2”');
                    }else{
                        this.showInfoT(`转换失败，请先登录，并将等级提升至>=1级`);
                    }
                }
            })
        }
    }
    showCheckBox=(msg:string,cb:()=>void)=>{
        this.checkBox.active=true
        this.okInfo.string=msg
        this.okBtn.off(Node.EventType.TOUCH_END)
        this.okBtn.on(Node.EventType.TOUCH_END,cb,this);
    }
    getRoleList=():List=>{
        if(this.showSkinToggle.isChecked){
            // if(this.roleList.array)
            return this.roleList
        }else{
            return this.roleList_mini
        }
    }
    roleListselectedHandler = (node:Node,index:number)=>{
        GameManager.I.playClickSound();
        this.showPage(this.roleInfoPage);
        let list=this.getRoleList();
        const info:outer_pb.RoleInfo = list.array[index];
        let parent = this.selectedRoleBox;

        Tools.get_UI_Role(info,parent,true).then((role:RoleUIControl)=>{
            if(info.BodyEquipIds){
                for(let type=BodyType.Head;type<BodyType.Pet;type++){
                    let id = info.BodyEquipIds[type]
                    role.updateEquipUI(id,type,info.RoleType)
                }
            }
            this.selectedRole=info;
        })
        // Tools.getOtherUIBox(info.Name,info.Lv,info.DsLv,info.ZsNum,info.RoleType,parent).then((role:PlayerControl)=>{
        //     for(let type=BodyType.Head;type<BodyType.Pet;type++){
        //         let id = info.BodyEquipIds[type]
        //         role.updateEquipUI(id,type,info.RoleType)
        //     }
        //     this.selectedRole=info;
        // });
    };
    showRoleInfoPage=(event:EventTouch)=>{
        this.showPage(this.roleInfoPage);
    }
    // deleteRole=(event:EventTouch)=>{
    //     GameManager.I.playClickSound();
    //     if(this.selectedRole){
    //         if(this.selectedRole.Lv>=30||this.selectedRole.ZsNum>0){
    //             this.showInfoT('无法删除等级>=30级的角色');
    //             return;
    //         }
    //         // let pass = this.deletePassInput.string;
    //         // if(ValidAccontPassRegex.test(pass)){
    //             this.hideCurPage();
    //             let req = outer_pb.CommonAct.create();
    //             req.Name=this.selectedRole.Name;
    //             // req.Pass=pass;
    //             let buff = outer_pb.CommonAct.encode(req).finish();
    //             WS.send(MT.DeleteRole,buff,d=>{
    //                 let rsp = outer_pb.CommonResponse.decode(d);
    //                 if(rsp.ErrCode==Err.ErrCode_Success){
    //                     let list = this.getRoleList();
    //                     let i = list.array.findIndex((r:outer_pb.RoleInfo)=> {return r.Name==this.selectedRole.Name;});
    //                     if(i>=0) list.deleteOne(i);
    //                     this.showPage(this.roleListPage);
    //                     this.showInfoT('删除成功',ct.green);
    //                     this.getRoleList().selectedIndex=-1
    //                     this.selectedRole=null;
    //                 }else {
    //                     this.showPage(this.deleteRolePage);
    //                     if(rsp.ErrCode==Err.ErrCode_AccountNotLogin){
    //                         this.showInfoT('账号未登录');
    //                     }else{
    //                         this.showInfoT('删除失败'+rsp.ErrCode);
    //                     }
    //                     // else if(rsp.ErrCode==Err.ErrCode_AccountWrongPass){
    //                     //     this.showInfoT('密码错误');
    //                 }
    //             })
    //         // }else{
    //         //     this.showInfoT('请输入正确的6~12位密码');
    //         // }
    //     }
    // }
    sellRole=(event:EventTouch)=>{
        GameManager.I.playClickSound();
        if(this.selectedRole){
            let pass = this.sellPassInput.string;
            let id = this.otherAccountInput.string;
            // if(ValidAccontPassRegex.test(id)&&ValidAccontPassRegex.test(pass)){
            if(id.length>6&&pass.length>1){
                this.hideCurPage();
                let req = outer_pb.CommonAct.create();
                req.Name=this.selectedRole.Name;
                req.Wx=pass;
                req.Account=id;
                let buff = outer_pb.CommonAct.encode(req).finish();
                WS.send(MT.SellRole,buff,d=>{
                    let rsp = outer_pb.CommonResponse.decode(d);
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        let list = this.getRoleList()
                        let i = list.array.findIndex((r:outer_pb.RoleInfo)=> {return r.Name==this.selectedRole.Name;});
                        if(i>=0) list.deleteOne(i);
                        list.selectedIndex=-1
                        this.selectedRole=null;
                        this.showPage(this.roleListPage);
                        this.showInfoT('转让成功',ct.green);
                    }else {
                        this.showPage(this.sellRolePage);
                        if(rsp.ErrCode==Err.ErrCode_NotEnoughMuPoint){
                            this.showInfoT('对方账号剩余点数不足'+rsp.NeedMuPoint)
                        }else if(rsp.ErrCode==Err.ErrCode_AccountNotLogin){
                            this.showInfoT('账号未登录');
                        }else if(rsp.ErrCode==Err.ErrCode_AccountWrongPass){
                            this.showInfoT('密码错误');
                        }else if(rsp.ErrCode==Err.ErrCode_RoleTypeHasNotActive){
                            this.showInfoT('无法转让，对方未激活该职业');
                        }else{
                            this.showInfoT('转让失败'+rsp.ErrCode);
                        }
                    }
                })
            }else{
                this.showInfoT('请输入正确的6~12位密码、对方账号');
            }
        }
    }
    changeName=(event:EventTouch)=>{
        GameManager.I.playClickSound();
        if(this.selectedRole){
            let need = this.selectedRole.ChangeNameTime>0?this.changeNameNeed:0;
            if(this.myMuPoint>=need){
                let name = this.newNameInput.string;
                if(ValidNameRegex.test(name)){
                    if(this.selectedRole.Name == name){
                        this.showInfoT('新旧昵称相同');
                    }else {
                        this.hideCurPage()
                        this.newNameInput.string=''
                        let req = outer_pb.CommonAct.create();
                        req.Name=this.selectedRole.Name;
                        req.NewName=name;
                        let buff = outer_pb.CommonAct.encode(req).finish();
                        WS.send(MT.ChangeName,buff,d=>{
                            let rsp = outer_pb.CommonResponse.decode(d);
                            if(rsp.ErrCode==Err.ErrCode_Success){
                                this.selectedRole.Name = req.NewName;
                                this.getRoleList().refresh();
                                this.showPage(this.roleListPage);
                                this.updateMyMuPoint(rsp.MuPoint,rsp.Jf)
                                this.showInfoT('改名成功',ct.green);
                            }else{
                                this.showPage(this.changeNamePage);
                                if(rsp.ErrCode==Err.ErrCode_NotEnoughMuPoint){
                                    this.updateMyMuPoint(rsp.MuPoint,rsp.Jf)
                                    this.showInfoT('您的账号剩余点数不足');
                                }else{
                                    this.showInfoT('改名失败'+rsp.ErrCode);
                                }
                            } 
                        })
                    }
                }else{
                    this.showInfoT('昵称不合规',ct.red);
                }
            }else{
                this.showInfoT('您的账号剩余点数不足');
            }
        }
    }
    createRole(name:string,type:number){
        this.roleNameInput.string=''
        // this.hideCurPage();
        let req = outer_pb.CommonAct.create();
        req.Name=name;
        req.RoleType=type;
        let buff = outer_pb.CommonAct.encode(req).finish();
        WS.send(MT.CreateRole,buff,d=>{
            let rsp = outer_pb.CommonResponse.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                let role:outer_pb.RoleInfo = outer_pb.RoleInfo.create()// {Name:name,Lv:0,RoleType:type,ZhanMeng:"",Skin:0,State:0};
                role.Name=name
                role.Id=rsp.RoleId
                role.Lv=0
                role.ZsNum=0
                role.DsLv=0
                role.RoleType=type
                role.ZhanMeng=''
                // role.Skin=0
                role.State=0
                role.BodyEquipIds={}
                role.BodyEquips={}
                let date = new SdkRoleInfo();
                date.eventType=SdkUpEventType.CreateRole;
                date.serverId=GD.lastServer.id;
                date.serverName=GD.lastServer.id+'服';
                date.roleId=rsp.RoleId+'';
                date.roleName=role.Name;
                date.roleLevel=role.Lv;
                SDK.uploadPlayerInfo(date).catch(reason=>{
                    //上报错误，重新上报一次
                    // SDK.uploadPlayerInfo(date);
                    console.log(reason)
                })
                this.updateMyMuPoint(rsp.MuPoint,rsp.Jf)
                this.getRoleList().addOne(role);
                this.showPage(this.roleListPage);
                this.showInfoT('创建成功',ct.green);
                this.checkBox.active=false;
            }else{
                this.showPage(this.createRolePage);
                if(rsp.ErrCode==Err.ErrCode_AccountNotLogin){
                    this.showInfoT('账号未登录');
                    WS.DoClose();
                }else if(rsp.ErrCode==Err.ErrCode_RoleNameHasExsited){
                    this.showInfoT('角色昵称已存在');
                }else if(rsp.ErrCode==Err.ErrCode_NotEnoughMuPoint){
                    this.updateMyMuPoint(rsp.MuPoint,rsp.Jf)
                    this.showInfoT('您的账号剩余点数不足');
                }else if(rsp.ErrCode==Err.ErrCode_RoleNameEnValidate){
                    this.showInfoT('角色昵称不合法');
                }else{
                    this.creatNeed.string=`无法创建`
                    if(rsp.ErrCode==Err.ErrCode_NotEnoughCap){
                        this.showInfoT('已达可创建上限');
                    }else{
                        this.showInfoT('当前为搬砖版本，继续创建角色需要已创建的所有角色都已激活[永久特权卡]，才能继续创建');
                    }
                }
            }
        })
    }
    switchSelectedFu=(node:Node,index:number)=>{
        this.selectedFuNode&&(this.selectedFuNode.children[0].active = false);
        this.selectedFuNode=node;
        node&&(node.children[0].active = true);
        if(index>-1){
            GameManager.I.playClickSound();
            this.selectedFu = this.fuList.array[index];
        }else{
            this.selectedFu = null;
        }
    }
    switchSelectedQu(node:Node,index:number){
        this.selectedQuNode&&(this.selectedQuNode.children[0].active = false);
        this.selectedQuNode=node;
        node&&(node.children[0].active = true);
    }
    // regist(id:string,pass:string){
    //     let req = outer_pb.CommonAct.create();
    //     req.Account = id;
    //     req.Pass = pass;
    //     let buff = outer_pb.CommonAct.encode(req).finish();
    //     WS.send(MT.RegistAccount,buff,d=>{
    //         let rsp = outer_pb.CommonResponse.decode(d);
    //         if(rsp.ErrCode==Err.ErrCode_Success){
    //             this.showInfoT('注册并登录成功',ct.green);
    //             this.showServerListPage(id,pass,rsp.ServerList)
    //         }else {
    //             this.showPage(this.loginPage);
    //             if(rsp.ErrCode==Err.ErrCode_AccountHasExsited){
    //                 this.showInfoT('账号已存在');
    //             }else if(rsp.ErrCode==Err.ErrCode_AccountInvalid){
    //                 this.showInfoT('账号密码格式错误');
    //             }else if(rsp.ErrCode==Err.ErrCode_BadIp){
    //                 this.showInfoT('该IP已被封停');
    //             }else{
    //                 this.showInfoT('注册失败');
    //             }
    //         }
    //     })
    // }
    // changePass(id:string,pass1:string,pass2:string){
    //     let req = outer_pb.CommonAct.create();
    //     req.Account = id;
    //     req.Pass = pass1;
    //     req.NewPass = pass2;
    //     let buff = outer_pb.CommonAct.encode(req).finish();
    //     WS.send(MT.ChangePass,buff,d=>{
    //         let rsp = outer_pb.CommonResponse.decode(d);
    //         if(rsp.ErrCode==Err.ErrCode_Success){
    //             this.showInfoT('修改密码成功',ct.green);
    //             this.showServerListPage(id,pass2,rsp.ServerList)
    //         }else {
    //             this.showPage(this.loginPage);
    //             if(rsp.ErrCode==Err.ErrCode_AccountNotExsited){
    //                 this.showInfoT('账号不存在');
    //             }else if(rsp.ErrCode==Err.ErrCode_AccountInvalid){
    //                 this.showInfoT('账号密码格式错误');
    //             }else if(rsp.ErrCode==Err.ErrCode_AccountWrongPass){
    //                 this.showInfoT('旧密码错误');
    //             }else if(rsp.ErrCode==Err.ErrCode_BadIp){
    //                 this.showInfoT('该IP已被封停');
    //             }else if(rsp.ErrCode==Err.ErrCode_AccountIsFreezed){
    //                 this.showInfoT('该账号已被封停');
    //             }else{
    //                 this.showInfoT('修改失败');
    //             }
    //         }
    //     })
    // }
    // doAccount(index:number){
    //     let node = this.loginViewStack.node.children[index].children[0];
    //     let id = node.children[0].getComponent(EditBox).string;
    //     let pass1 = node.children[1].getComponent(EditBox).string;
    //     let pass2 = node.children[2].getComponent(EditBox).string;
    //     if(pass1!=pass2){
    //         this.showInfoT('两次密码输入不一致');
    //     }else{
    //         if(ValidAccontPassRegex.test(id)&&ValidAccontPassRegex.test(pass1)&&ValidAccontPassRegex.test(pass2)){
    //             this.hideCurPage();
    //             if(WS.c&&WS.c.readyState === WebSocket.OPEN){
    //                 if(index==0){
    //                     this.regist(id,pass2);
    //                 }else{
    //                     this.changePass(id,pass1,pass2);
    //                 }
    //             }else{
    //                 this.showInfoT('连接服务器中...',ct.white)
    //                 WS.connectWS(WS.login_url,ConnType.Login).then(v=>{
    //                     if(index==0){
    //                         this.regist(id,pass2);
    //                     }else{
    //                         this.changePass(id,pass1,pass2);
    //                     }
    //                 }).catch(err=>{
    //                     this.showPage(this.loginPage);
    //                     this.showInfoT('连接服务器失败，请稍后重试');
    //                 })
    //             }
    //         }else{
    //             this.showInfoT('账号、密码必须为6~12位的字母、数字');
    //         }
    //     }
    // }
    // onPaySuccess=(d:any)=>{
    //     alert('充值成功');
    //     let rsp = outer_pb.PayAct.decode(d);
    //     this.showPage(this.roleListPage);
    //     let addPoint = rsp.MuPoint-this.myMuPoint;
    //     let addJf = rsp.Jf-this.myJf;
    //     this.updateMyMuPoint(rsp.MuPoint,rsp.Jf);
    //     if(addPoint>0||addJf>0){
    //         this.showInfoT(`充值成功：点数+${addPoint}，积分+${addJf}`)
    //     }
    //     // if(rsp.ErrCode==Err.ErrCode_Success){
    //     //     this.showPage(this.roleListPage);
    //     //     this.updateMyMuPoint(rsp.MuPoint,rsp.Jf)
    //     //     // this.showInfoT('充值成功',ct.green)
    //     //     alert('充值成功')
    //     // }else{
    //     //     alert(`充值失败：${rsp.ErrCode}，请联系在线客服处理`);
    //     // } 
    // }
    loginSdk(){
        SDK.login().then((data:any)=>{
            // console.log('sdk login ok',data)
            this.login(data);
        })
    }
    // login=(info:SdkUserInfo)=>{
    //     this.loginBtn.active=false;
    //     if(WS.c&&WS.c.readyState === WebSocket.OPEN){
    //         this._login(info);
    //     }else{
    //         this.showInfoT('连接服务器中...',ct.white)
    //         WS.connectWS(WS.login_url,ConnType.Login).then(v=>{
    //             this._login(info);
    //         }).catch(err=>{
    //             this.loginBtn.active=true;
    //             this.showInfoT('连接服务器失败:'+err);
    //         })
    //     }
    // }
    login = async (info: SdkUserInfo) => {
        this.loginBtn.active = false;
        try {
            if (!(WS.c && WS.c.readyState === WebSocket.OPEN)) {
                this.showInfoT("连接服务器中...", ct.white);
                await WS.connectWS(WS.login_url, ConnType.Login);
            }
        } catch (err) {
            this.loginBtn.active = true;
            this.showInfoT("WebSocket连接失败: " + String(err));
            return;
        }
        try {
            this._login(info);
        } catch (err) {
            this.loginBtn.active = true;
            this.showInfoT("登录请求编码失败: " + String(err));
            // console.error("login encode error", err, info);
        }
    }
    _login=(info:SdkUserInfo)=>{
        let req = outer_pb.CommonAct.create({
            Account:info.uid,
            Uname:info.uname,
            Time:info.ts,
            Sign:info.sign,
            Version:GD.subVersion,
        });
        // console.log('LoginAccount',req)
        let buff = outer_pb.CommonAct.encode(req).finish();
        WS.send(MT.LoginAccount,buff,d=>{
            let rsp = outer_pb.CommonResponse.decode(d);
            // console.log('onLoginAccount',rsp)
            if(rsp.ErrCode==Err.ErrCode_Success){
                this.quModes=new Map()
                for(let gateId in rsp.GateMode){
                    let quId=parseInt(gateId)
                    this.quModes.set(quId,rsp.GateMode[gateId])
                }
                MsgVerifier.key=rsp.K;
                GD.sdkUserInfo=info;
                // localStorage.setItem('user',JSON.stringify(info));
                this.showInfoT('登录成功',ct.green);
                this.showServerListPage(rsp.ServerList)
            }else {
                this.loginBtn.active=true;
                if(rsp.ErrCode==Err.ErrCode_AccountNotExsited){
                    this.showInfoT('游戏账号不存在');
                }else if(rsp.ErrCode==Err.ErrCode_BadIp){
                    this.showInfoT('该IP已被封停');
                }else if(rsp.ErrCode==Err.ErrCode_AccountIsFreezed){
                    this.showInfoT('账号已被封停');
                }else if(rsp.ErrCode==Err.ErrCode_HasNewVersion){
                    this.showInfoT('客户端有新版本，请重启游戏更新');
                }else{
                    this.showInfoT('登录失败');
                }
            }
        })
    }
    showServerListPage=(server_list:Array<outer_pb.IServer>)=>{
        this.serverData=new Map();
        server_list.forEach(v=>{
            if(this.serverData.has(v.GateId)==false){
                this.serverData.set(v.GateId,[]);
            }
            this.serverData.get(v.GateId).push(new ServerInfo(v));
        })
        this.serverData.forEach(infos=>{
            infos = infos.sort((a:any,b:any)=>{
                return a.openTime-b.openTime;
            })
        })
        //先显示，来初始化服务器列表
        this.showPage(this.serverListPage);
        this.quList.array = Array.from(this.serverData.keys()).sort((a:number,b:number)=>{
            return a-b;
        });
        if(GD.lastServer){
            if(GD.lastServer.GateId&&this.quModes.get(GD.lastServer.GateId)){
                this.curQuIsYkMode=this.quModes.get(GD.lastServer.GateId)
                this.quList.selectedIndex=this.quList.array.findIndex(v=>{return v==GD.lastServer.GateId})
            }
            let has=false;
            this.serverData.forEach(infos=>{
                if(infos.findIndex(v=>{return v.id==GD.lastServer.id;})>-1){
                    has=true;
                }
            })
            if(has){
                this.showPage(this.defaultServerPage);
                this.selectedFu = GD.lastServer;
                this.switchServerBtn.node.getComponentInChildren(Label).string = GD.lastServer.name;
            }
        }else{
            this.quList.selectedIndex=this.quList.array.length-1
        }
    }
    // login(){
    //     let node = this.loginViewStack.node.children[1].children[0];
    //     let id = node.children[0].getComponent(EditBox).string;
    //     let pass = node.children[1].getComponent(EditBox).string;
    //     if(ValidAccontPassRegex.test(id)&&ValidAccontPassRegex.test(pass)){
    //         this.hideCurPage();
    //         if(WS.c&&WS.c.readyState === WebSocket.OPEN){
    //             this._login(id,pass);
    //         }else{
    //             this.showInfoT('连接服务器中...',ct.white)
    //             WS.connectWS(WS.login_url,ConnType.Login).then(v=>{
    //                 this._login(id,pass);
    //             }).catch(err=>{
    //                 this.showPage(this.loginPage)
    //                 this.showInfoT('连接服务器失败，请稍后重试');
    //             })
    //         }
    //     }else{
    //         this.showInfoT('账号、密码必须为6~12位的字母、数字');
    //     }
    // }
    // _login=(id:string,pass:string)=>{
    //     let req = outer_pb.CommonAct.create();
    //     req.Account = id;
    //     req.Pass = pass;
    //     let buff = outer_pb.CommonAct.encode(req).finish();
    //     WS.send(MT.LoginAccount,buff,d=>{
    //         let rsp = outer_pb.CommonResponse.decode(d);
    //         if(rsp.ErrCode==Err.ErrCode_Success){
    //             this.showInfoT('登录成功',ct.green);
    //             this.showServerListPage(id,pass,rsp.ServerList)
    //         }else {
    //             this.showPage(this.loginPage);
    //             if(rsp.ErrCode==Err.ErrCode_AccountNotExsited){
    //                 this.showInfoT('账号不存在');
    //             }else if(rsp.ErrCode==Err.ErrCode_AccountInvalid){
    //                 this.showInfoT('账号密码格式错误');
    //             }else if(rsp.ErrCode==Err.ErrCode_BadIp){
    //                 this.showInfoT('该IP已被封停');
    //             }else if(rsp.ErrCode==Err.ErrCode_AccountWrongPass){
    //                 this.showInfoT('密码错误');
    //             }else if(rsp.ErrCode==Err.ErrCode_AccountIsFreezed){
    //                 this.showInfoT('账号已被封停');
    //             }else{
    //                 this.showInfoT('登录失败');
    //             }
    //         }
    //     })
    // }
    // showServerListPage=(id:string,sign:string,server_list:Array<outer_pb.IServer>)=>{
    //     GD.account=id;
    //     GD.pass=sign;
    //     localStorage.setItem('id',id);
    //     localStorage.setItem('pass',sign);
        
    //     // if(this.serverData==null)this.serverData=new Map();
    //     server_list.forEach(v=>{
    //         if(this.serverData.has(v.GateId)==false){
    //             this.serverData.set(v.GateId,[]);
    //         }
    //         this.serverData.get(v.GateId).push(new ServerInfo(v));
    //     })
    //     this.serverData.forEach(infos=>{
    //         infos = infos.sort((a:any,b:any)=>{
    //             return a.openTime-b.openTime;
    //         })
    //     })
    //     //先显示，来初始化服务器列表
    //     this.showPage(this.serverListPage);
    //     this.quList.array = Array.from(this.serverData.keys()).sort((a:number,b:number)=>{
    //         return a-b;
    //     });
    //     this.quList.selectedIndex=0;
    //     if(GD.lastServer){
    //         let has=false;
    //         this.serverData.forEach(infos=>{
    //             if(infos.findIndex(v=>{return v.id==GD.lastServer.id})>-1){
    //                 has=true;
    //             }
    //         })
    //         if(has){
    //             this.showPage(this.defaultServerPage);
    //             this.selectedFu = GD.lastServer;
    //             this.switchServerBtn.node.getComponentInChildren(Label).string = GD.lastServer.name;
    //         }
    //     }
    // }
    roleDataList:Array<outer_pb.IRoleInfo>=[]
    activeRoles:{[k: string]: number;};
    myMuPoint:number=0;
    myJf:number=0;
    createNeedPoint:number=0;
    changeNameNeed:number=0;
    switchRoleTypeNeedMuPoints:{[k: string]: number;};
    updateMyMuPoint=(p:number,jf:number)=>{
        this.myMuPoint=p;
        this.myJf=jf;
        this.pointLabel.string=p+''
        if(this.curQuIsYkMode){
            this.jfLabel.string='0'
        }else{
            this.jfLabel.string=jf+''
        }
    }
    loginServer(event:EventTouch){
        GameManager.I.playClickSound();
        if(this.selectedFu){
            //=============================
            if(this.selectedFu.id=='200'&&GD.sdkUserInfo.uid!='SY21_500250672'){
                this.showInfoT('GM测试服，不对外开放')
                return
            }
            //=============================
            if(this.selectedFu.openTime>Tools.getNowTime()){
                this.showInfoT('该服务器未开放，开放时间：'+Tools.getTimeString(this.selectedFu.openTime));
                return;
            }
            this.bhBox.active=false;
            this.hideCurPage();
            let req = outer_pb.CommonAct.create();
            req.ServerId = this.selectedFu.id
            let buff = outer_pb.CommonAct.encode(req).finish();
            WS.send(MT.SelectedServer,buff,d=>{
                let rsp = outer_pb.CommonResponse.decode(d);
                if(rsp.ErrCode==Err.ErrCode_Success){
                    this.roleListHeadT.string =`角色列表（${this.selectedFu.name}）`
                    GD.MaxTgTime = rsp.MaxTgTime;
                    this.updateMyMuPoint(rsp.MuPoint,rsp.Jf)
                    this.activeRoles=rsp.ActiveRoles;
                    this.createNeedPoint = rsp.CreateNeedPoint;
                    this.changeNameNeed = rsp.ChangeNameNeed;
                    this.switchRoleTypeNeedMuPoints=rsp.SwitchNeedPoint;
                    // console.log('config=',GD.configs)
                    let list = this.getRoleList()
                    // if(rsp.RoleList.length==0){
                    //     list.array = [];
                    //     this.showPage(this.createRolePage);
                    //     this.roleTypeTab.select(0)
                    //     this.creatNeed.string=''
                    //     this.roleDataList = []
                    // }else{
                        let b=this.showSkinToggle.isChecked;
                        this.roleList.node.active = b;
                        this.roleList_mini.node.active = !b;
                        this.showPage(this.roleListPage);
                        this.showInfoT('请选择或创建一个角色',ct.white);
                        // rsp.RoleList.sort((a:outer_pb.RoleInfo,b:outer_pb.RoleInfo)=>{
                        //     return a.Id-b.Id;
                        //     // return (b.Lv+b.ZsNum*400+b.DsLv)-(a.Lv+a.ZsNum*400+a.DsLv);
                        // })
                        rsp.RoleList.sort((a,b)=>{
                            if(a.TeamId==b.TeamId){
                                return a.Id-b.Id;
                            }else{
                                return a.TeamId-b.TeamId;
                            }
                        })
                        list.array = rsp.RoleList;
                        this.roleDataList = rsp.RoleList;
                        // let firstRole=rsp.RoleList[0];
                        // this.showPayBtn.active = firstRole.Lv>30||firstRole.ZsNum>0;
                    // }
                    if(this.myServerList.length==0){
                        this.myServerList.push(this.selectedFu)
                    }else if(this.myServerList[0].id != this.selectedFu.id){
                        this.myServerList = this.myServerList.filter(v=>v.id!=this.selectedFu.id);
                        this.myServerList.unshift(this.selectedFu);
                        if(this.myServerList.length>=10){
                            this.myServerList = this.myServerList.slice(0,10)
                        }
                    }
                    localStorage.setItem('myList',JSON.stringify(this.myServerList));
                    localStorage.setItem('lastServer',JSON.stringify(this.selectedFu));
                    GD.lastServer = this.selectedFu;
                    // GD.curSid = this.selectedFu.id;
                }else if(rsp.ErrCode==Err.ErrCode_ServerIsStoped){
                    this.showInfoT('该服务器还未开放');
                }else{
                    this.showInfoT('未知错误');
                }
            })
        }else{
            this.showInfoT('请选择一个服务器');
        }
    }
    joinGame(){
        if(this.selectedFu){
            if(this.selectedRole){
                this.hideCurPage();
                let req = outer_pb.CommonAct.create();
                req.Name=this.selectedRole.Name
                let buff = outer_pb.CommonAct.encode(req).finish();
                if(WS.Type==ConnType.Gate){
                    WS.DoClose()
                }else{
                    WS.send(MT.StarGame,buff,d=>{
                        let rsp = outer_pb.CommonResponse.decode(d);
                        if(rsp.ErrCode==Err.ErrCode_Success){
                            // this.showInfoT('进入游戏中.....',ct.green); 
                            WS.DoClose().then(()=>{
                                let port = rsp.Address.split(':')[1];
                                GD.gate_address=`${WS.GameHomeUrl}:${port}`;
                                // GD.token=rsp.Token;
                                // console.log("get token",GD.gate_address,GD.token);
                                WS.connectWS(GD.gate_address,ConnType.Gate).then(v=>{
                                    // this.showInfoT('开始进入游戏.....',ct.green);
                                    this.loginGate(rsp.Token);
                                })
                            });
                        }else{
                            this.showPage(this.roleListPage);
                            if(rsp.ErrCode==Err.ErrCode_AccountNotLogin){
                                this.showInfoT('账号未登录');
                            }else if(rsp.ErrCode==Err.ErrCode_ServerIsStoped){
                                this.showInfoT('服务器未开放');
                            }else{
                                this.showInfoT('该角色所在服务器维护中');
                            }
                        }
                    })
                }
            }else{
                this.showInfoT('请选择一个角色');
            }
        }else{
            this.showInfoT('未知服务器');
        }
    }
    loginGate=(token:string)=>{
        let req = outer_pb.LoginGateRequest.create();
        req.Token=token;
        req.Name=this.selectedRole.Name;
        // req.NeedLoadMDatas = GD.monsterMiniDatas.size==0
        let buff = outer_pb.LoginGateRequest.encode(req).finish();
        WS.send(MT.LoginGate,buff,d=>{
            let rsp = outer_pb.LoginGateResponse.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                MsgVerifier.key=rsp.K;
                // this.showInfoT('登录成功，开始加载主场景',ct.green);
                GD.init(rsp).then(()=>{
                    Loading.loadScene("Main");
                    // console.log('main start,rsp=',rsp);
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
                this.showPage(this.roleListPage);
                if(rsp.ErrCode==Err.ErrCode_RoleIsFreezed){
                    this.showInfoT('角色被封停中..');
                }else if(rsp.ErrCode==Err.ErrCode_RoleNotExsit){
                    this.showInfoT('角色不存在');
                }else{
                    this.showInfoT('登录游戏失败:'+rsp.ErrCode);
                }
            } 
        })
    }
    hideCurPage(){
        if(this.curShowPage){
            this.curShowPage.active=false
            this.curShowPage=null;
        }
    }
    showPage=(page:Node)=>{
        this.curShowPage&&(this.curShowPage.active=false);
        page.active=true;
        this.curShowPage=page;
        this.infoT.string='';
        GameManager.I.playOpenSound()
    }
    showInfoT(msg:string,color:ct=ct.brown){
        this.infoT.string=msg;
        // this.infoT.color=color;
        this.infoT.color.fromHEX(color);
        let after = tween(this.infoT.node).to(0.1,{scale:new Vec3(1.0,1.0)});
        tween(this.infoT.node).to(0.1,{scale:new Vec3(1.3,1.3)}).then(after).start();
    }
    showLost(){ 
        this.showPage(this.lostPage);
    }
    getRanName(type:number):string{
        let x = this.xings[Math.random()*this.xings.length>>0];
        let m = type==0?this.ming_m:this.ming_w;
        let mz = m[Math.random()*m.length>>0];
        return x+mz;
    }
    xings=[
        "赵",
        "孙",
        "李",
        "周",
        "吴",
        "郑",
        "王",
        "陈",
        "褚",
        "卫",
        "韩",
        "杨",
        "朱",
        "秦",
        "许",
        "吕",
        "张",
        "孔",
        "曹",
        "华",
        "金",
        "魏",
        "姜",
        "谢",
        "喻",
        "水",
        "云",
        "苏",
        "马",
        "任",
        "袁",
        "柳",
        "唐",
        "殷",
        "安",
        "乐",
        "于",
        "齐",
        "黄",
        "萧",
        "邵",
        "狄",
        "明",
        "宋",
        "纪",
        "舒",
        "项",
        "祝",
        "董",
        "蓝",
        "贾",
        "颜",
        "林",
        "徐",
        "邱",
        "高",
        "夏",
        "凌",
        "虞",
        "管",
        "卢",
        "莫",
        "荣",
        "甄",
        "曲",
        "段",
        "伊",
        "宁",
        "甘",
        "刘",
        "景",
        "叶",
        "韶",
        "白",
        "池",
        "苍",
        "姬",
        "冉",
        "桑",
        "温",
        "晏",
        "连",
        "鱼",
        "容",
        "庚",
        "步",
        "文",
        "聂",
        "晁",
        "冷",
        "关",
        "游",
        "司马",
        "上官",
        "欧阳",
        "夏侯",
        "诸葛",
        "闻人",
        "东方",
        "赫连",
        "皇甫",
        "尉迟",
        "澹台",
        "公冶",
        "公输",
        "淳于",
        "单于",
        "申屠",
        "公孙",
        "仲孙",
        "轩辕",
        "令狐",
        "钟离",
        "宇文",
        "长孙",
        "慕容",
        "鲜于",
        "闾丘",
        "司徒",
        "司空",
        "屠苏",
        "端木",
        "乐正",
        "拓跋",
        "夹谷",
        "谷梁",
        "楚",
        "百里",
        "南门",
        "呼延",
        "归海",
        "岳",
        "帅",
        "琴",
        "梁丘",
        "左丘",
        "西门",
        "商",
        "南宫",
        "第五"
    ];
    ming_m=[
        "夷",
        "洛",
        "乐",
        "锋",
        "冷",
        "亦",
        "羽",
        "帆",
        "向",
        "安",
        "宇",
        "远",
        "璧",
        "君",
        "俊",
        "漠",
        "骏",
        "定",
        "磐",
        "武",
        "坤",
        "炜",
        "赋",
        "泊",
        "维",
        "颐",
        "墨",
        "震",
        "扬",
        "欧",
        "复",
        "搏",
        "文",
        "霄",
        "济",
        "影",
        "逸",
        "冲",
        "奥",
        "傲",
        "雍",
        "鹰",
        "游",
        "卫",
        "兴",
        "鹏",
        "勉",
        "幽",
        "璇",
        "真",
        "楼",
        "天",
        "佩",
        "协",
        "弦",
        "坦",
        "奉",
        "咏",
        "过",
        "非",
        "霸",
        "炎",
        "禹",
        "勇",
        "飞",
        "明",
        "威",
        "轲",
        "异",
        "义",
        "备",
        "涯",
        "砚",
        "誉",
        "寒",
        "傅",
        "竹",
        "斐",
        "越",
        "为",
        "雄",
        "博",
        "云",
        "候",
        "也",
        "益",
        "佑",
        "辰",
        "均",
        "延",
        "帷",
        "辨",
        "宏",
        "遥",
        "敖",
        "炳",
        "斌",
        "敏",
        "伟",
        "翌",
        "诩",
        "野",
        "邦",
        "寅",
        "彪",
        "靖",
        "霍",
        "阳",
        "诚",
        "澈",
        "烈",
        "之",
        "淳",
        "潇",
        "寰",
        "默",
        "融",
        "萧",
        "翰",
        "勋",
        "涛",
        "刀",
        "尚",
        "少",
        "叔",
        "伯",
        "子",
        "季",
        "白"
    ];
    ming_w=[
        "妃",
        "羽",
        "青",
        "月",
        "明",
        "霜",
        "遥",
        "瑶",
        "仙",
        "翩",
        "依",
        "雨",
        "盈",
        "香",
        "盼",
        "虹",
        "纱",
        "姬",
        "鸾",
        "七",
        "音",
        "霖",
        "涓",
        "霏",
        "雪",
        "紫",
        "朱",
        "倩",
        "茜",
        "露",
        "妍",
        "媚",
        "伊",
        "邀",
        "馥",
        "心",
        "袅",
        "怜",
        "珊",
        "兰",
        "灵",
        "棠",
        "媛",
        "芸",
        "碧",
        "琳",
        "文",
        "雯",
        "唯",
        "珠",
        "涵",
        "灵",
        "玲",
        "爱",
        "白",
        "燕",
        "嫣",
        "纹",
        "朱",
        "真",
        "莺",
        "娜",
        "冰",
        "影",
        "清",
        "晴",
        "容",
        "蓉",
        "淑",
        "甜",
        "恬",
        "婷",
        "婉",
        "湘",
        "馨",
        "秀",
        "雅",
        "英",
        "珍",
        "贞",
        "姬",
        "晶",
        "茹",
        "媗",
        "仙",
        "小",
        "晓",
        "乐",
        "咏",
        "菲",
        "敏",
        "环",
        "瑄",
        "琴",
        "琼",
        "瑛",
        "琉",
        "璃",
        "伶",
        "俪",
        "郦",
        "翎",
        "然",
        "婉",
        "芙",
        "莎",
        "萝",
        "巧",
        "弥",
        "宁",
        "宓",
        "宜",
        "娉",
        "素",
        "衣",
        "桐",
        "芷",
        "若",
        "昭",
        "九"
    ];
}


