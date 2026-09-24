import { _decorator, game, Label, Node, sys, Toggle } from 'cc';
import { List } from '../UiComps/List';
import { BasePage } from './BasePage';
import GD from '../base/GameData';
import { UIMgr } from '../managers/UIMgr';
import WS from '../base/net';
import { Err, MT } from '../base/MT';
import Tools from '../base/tools';
import { ViewStack } from '../UiComps/ViewStack';
import { ct, MiniRoleTypeStr } from '../base/types';
const { ccclass, property } = _decorator;

@ccclass('SwitchRolePage')
export class SwitchRolePage extends BasePage {
    @property(List)
    leftList:List
    @property(List)
    rightList:List
    @property(List)
    rightList_mini:List
    @property(Toggle)
    toggle:Toggle
    @property(Node)
    okBtn:Node
    @property(Node)
    backLogin:Node
    @property(Node)
    exitGame:Node
    @property(ViewStack)
    view:ViewStack
    @property(Node)
    refreshBtn:Node

    @property(Node)
    pageBox:Node;
    @property(Node)
    prePage:Node;
    @property(Node)
    nextPage:Node;
    @property(Label)
    page:Label;
    // @property(Node)
    // showSetBtn:Node;

    selectedLeftNode:Node;
    selectedSid:string;

    selectedRightNode:Node
    selectedRole:outer_pb.RoleInfo
    dataList:Array<outer_pb.IRoleInfo>=[];
    lastRefreshTime:number=0;
    onLoad(): void {
        super.onLoad()
        this.leftList.array=[]
        this.rightList.array=[]
        this.rightList_mini.array=[]
        this.rightList.selectedIndex=-1;
        this.rightList_mini.selectedIndex=-1;

        this.refreshBtn.on(Node.EventType.TOUCH_END,()=>{
            const now=Date.now()/1000>>0
            if(now-this.lastRefreshTime<=3){
                UIMgr.I.tip('刷新太频繁了')
                return
            }
            this.lastRefreshTime=now
            this.getSidRoleList(this.selectedSid)
        },this);
        // this.showSetBtn.on(Node.EventType.TOUCH_END,()=>{
        //     UIMgr.I.PopView.showHideSidBox(this.hideSidList,this.saveHideSidList)
        // },this);
        this.okBtn.on(Node.EventType.TOUCH_END,this.trySwitchRole,this);
        this.backLogin.on(Node.EventType.TOUCH_END,()=>{
            if(sys.isNative){
                game.restart()
            }else{
                location.href=WS.home_url //`${WS.home_url}?${Date.now()}`
                // WS.Type=ConnType.Login; 
                // Loading.loadScene('Launch')
                // WS.DoClose();
            }
        },this);
        this.exitGame.on(Node.EventType.TOUCH_END,()=>{
            if(sys.isNative){
                game.end()
            }else{
                location.href=WS.home_url
                // WS.Type=ConnType.Login; 
                // Loading.loadScene('Launch')
                // WS.DoClose();
            }
        },this);
        let show = localStorage.getItem('show')
        let isShowSkin = true
        if(show){
            let a = parseInt(show)
            isShowSkin = a?true:false;
        }
        this.toggle.isChecked=isShowSkin
        this.pageBox.active=isShowSkin
        this.toggle.node.on('toggle',()=>{
            let b =this.toggle.isChecked
            localStorage.setItem('show',b?'1':'0')
            this.pageBox.active=!b
            if(b){
                this.view.selectedIndex=0
                this.rightList.array = this.dataList;
                this.rightList_mini.array=[];
                this.rightList.scrollToTop()
            }else{
                this.view.selectedIndex=1
                this.rightList.array=[]
                this.setMiniList();
                this.rightList_mini.scrollToTop()
            }
        })
        this.prePage.on(Node.EventType.TOUCH_END,()=>{
            if(this.curPage>1){
                this.curPage--;
                this.setMiniList();
            }
        },this);
        this.nextPage.on(Node.EventType.TOUCH_END,()=>{
            if(this.curPage<this.maxPageNum){
                this.curPage++;
                this.setMiniList();
            }
        },this);
        this.rightList.selectedHandler = this.rightListSelectHandler;
        this.rightList.cellRender = this.rightListCellRender
        this.rightList_mini.selectedHandler = this.rightListSelectHandler;
        this.rightList_mini.cellRender = (node:Node,index:number)=>{
            node.children[0].active = node==this.selectedRightNode;
            let info = this.rightList_mini.array[index] as outer_pb.RoleInfo;
            const isMe=info.Name==GD.role.data.Name
            node.children[2].active = isMe;
            if(isMe){
                this.lastLoginRole = info
                info.State=2
            }
            // const lv=info.Lv;
            node.children[4].getComponent(Label).string = `${Tools.getMiniLvStr(info)} ${MiniRoleTypeStr[Math.log2(info.RoleType)]}`
            Tools.setRoleStateString(node.children[3].getComponent(Label),info);

            let nameLabel=node.children[1].getComponent(Label);
            nameLabel.string = info.Name;
            let nameColor=ct.white;
            let now=Date.now()/1000>>0
            if(info.GoldYk>now){
                if(info.GoldYk-now<60*60*24*3){
                    nameColor=ct.gray
                }else{
                    nameColor=ct.yellow
                }
            }
            nameLabel.color.fromHEX(nameColor)
        };
        this.leftList.cellRender = (node:Node,index:number)=>{
            node.children[0].active = node==this.selectedLeftNode;
            let data = this.leftList.array[index];
            node.children[1].getComponent(Label).string = `${data.sid}服`;
        };
        this.leftList.selectedHandler = this.leftListSelectedHandler
    }
    rightListCellRender = (node:Node,index:number)=>{
        node.children[0].active = node==this.selectedRightNode;
        let info = this.rightList.array[index] as outer_pb.RoleInfo;
        const isMe=info.Name==GD.role.data.Name;
        node.children[3].active = isMe
        if(isMe){
            this.lastLoginRole = info
            info.State=2
        }
        Tools.renderRoleList(node.children[1],node.children[2],info);
    };
    leftListSelectedHandler= (node:Node,index:number)=>{
        this.selectedLeftNode&&(this.selectedLeftNode.children[0].active = false);
        this.selectedLeftNode=node;
        this.selectedRightNode&&(this.selectedRightNode.children[0].active = false);
        this.selectedRightNode=null
        this.selectedRole = null;
        node.children[0].active = true;
        const b=this.toggle.isChecked
        if(index>-1){
            let sid = this.leftList.array[index].sid;
            this.selectedSid=sid;
            this.dataList=this.roleList.get(sid)
            if(this.dataList){
                if(b){
                    this.rightList.array = this.dataList;
                    this.rightList_mini.array=[];
                }else{
                    this.rightList.array=[]
                    this.curPage=1
                    this.maxPageNum = Math.ceil(this.dataList.length/80)
                    this.setMiniList();
                }
            }else{
                this.getSidRoleList(sid)
            }
        }else{
            this.selectedSid = null;
            this.rightList.array=[];
            this.rightList_mini.array=[];
        }
        // this.pageBox.active=!b
    }
    curPage:number=1;
    maxPageNum:number=1;
    setMiniList=()=>{
        this.page.string=`${this.curPage}/${this.maxPageNum}`;
        let list = this.dataList;
        if(this.maxPageNum>1){
            list = this.dataList.slice((this.curPage-1)*80,this.curPage*80)
        }
        this.rightList_mini.array = list
    }
    rightListSelectHandler = (node:Node,index:number)=>{
        this.selectedRightNode&&(this.selectedRightNode.children[0].active = false);
        this.selectedRightNode=node;
        node&&(node.children[0].active = true);
        if(index>-1){
            let list:List;
            if(this.toggle.isChecked){
                list=this.rightList
            }else{
                list=this.rightList_mini
            }
            this.selectedRole = list.array[index];
        }else{
            this.selectedRole = null;
        }
    }
    trySwitchRole(){
        if(this.selectedRole){
            if(this.selectedRole.State!=2){
                if(this.selectedRole.Name!=GD.role.data.Name){
                    if(this.lastLoginRole){
                        this.lastLoginRole.State=1
                        this.lastLoginRole.TgTime=Tools.getBeiJingSecond()
                    }
                    //执行切换角色逻辑(相当于断线重连)
                    GD.isSwitchRole=true;
                    UIMgr.I.reloginRoleName=this.selectedRole.Name;
                    UIMgr.I.reloginSid=this.selectedSid
                    WS.DoClose();
                    // if(this.selectedRole.State!=2){
                    //     //执行切换角色逻辑(相当于断线重连)
                    //     GD.isSwitchRole=true;
                    //     UIMgr.I.reloginRoleName=this.selectedRole.Name;
                    //     UIMgr.I.reloginSid=this.selectedSid
                    //     WS.DoClose();
                    // }else{
                    //     UIMgr.I.tip('该角色已在线，无法切换')
                    // }
                }else{
                    UIMgr.I.tip('该角色为当前登录角色')
                }
            }else{
                UIMgr.I.tip('该角色已在线，无法切换')
            }
        }else{
            UIMgr.I.tip('未选择角色')
        }
    }
    roleList:Map<string,Array<outer_pb.IRoleInfo>>=new Map()
    sidList:Array<any>
    lastLoginRole:outer_pb.RoleInfo;
    initData(data: any): void {
        //获取角色列表
        this.view.selectedIndex=-1
        let sid=GD.lastServer.id
        let list = this.roleList.get(sid)
        if(list){
            this.selectedSid=sid
            this.setRoleList()
        }else{
            this.getSidRoleList(sid)
        }
    }
    getSidRoleList=(sid:string)=>{
        let req = outer_pb.AllRoleList.create();
        req.Sid = sid
        req.LoadSidList = !this.sidList
        let buff = outer_pb.AllRoleList.encode(req).finish();
        WS.send(MT.GetMyRoleList,buff,this.onGetMyRoleList)
    }
    onGetMyRoleList=(d:any)=>{
        let rsp=outer_pb.AllRoleList.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            if(rsp.LoadSidList){
                this.sidList=[]
                for(let sid in rsp.SidList){
                    let openTime=rsp.SidList[sid]
                    this.sidList.push({sid,openTime})
                }
                this.sidList.sort((a,b)=>{
                    return a.openTime-b.openTime;
                })
                this.leftList.array=this.sidList;
            }
            this.selectedSid=rsp.Sid
            rsp.List.sort((a,b)=>{
                if(a.TeamId==b.TeamId){
                    return a.Id-b.Id
                }else{
                    return a.TeamId-b.TeamId
                }
            })
            this.roleList.set(rsp.Sid,rsp.List)
            this.setRoleList()
        }else{
            UIMgr.I.tip('获取角色列表失败'+rsp.ErrCode)
        }
    }
    setRoleList=()=>{
        let i = this.sidList.findIndex(data=>{return data.sid==this.selectedSid});
        if(i>=0){
            const b=this.toggle.isChecked
            if(b){
                this.view.selectedIndex=0
            }else{
                this.view.selectedIndex=1
            }
            this.pageBox.active=!b
            this.curPage=1
            //延迟执行，防止无效（this.leftList.array=sidlist赋值到现在，列表未生成）
            this.scheduleOnce(()=>{
                this.leftList.selectedIndex=i
            })
        }
    }
    // onHide(): void {
    //     this.curPage=1;
    //     this.maxPageNum=1;
    //     this.leftList.array=[]
    //     this.rightList.array=[]
    //     this.rightList_mini.array=[]
    //     this.rightList.selectedIndex=-1;
    //     this.rightList_mini.selectedIndex=-1;
    //     this.selectedRole = null;
    //     this.selectedRightNode=null;
    // }
}


