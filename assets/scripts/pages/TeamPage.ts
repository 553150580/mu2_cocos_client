import { _decorator, EditBox, EventTouch, Label, Node, RichText, Sprite, SpriteFrame, Toggle } from 'cc';
import { BasePage } from './BasePage';
import { ViewStack } from '../UiComps/ViewStack';
import { Tab } from '../UiComps/Tab';
import { UIMgr } from '../managers/UIMgr';
import { List } from '../UiComps/List';
import GD from '../base/GameData';
import WS from '../base/net';
import { Err, MT } from '../base/MT';
import { BoxMsg, ct, PopViewType } from '../base/types';
import Tools from '../base/tools';
import { ShowItemType } from './PopView';
import { RichTextHandler } from '../UiComps/RichTextHandler';
import { po } from 'gettext-parser';
const { ccclass, property } = _decorator;

@ccclass('TeamPage')
export class TeamPage extends BasePage {
    @property(ViewStack)
    viewStack:ViewStack;
    @property(Tab)
    tab:Tab;
    @property(EditBox)
    teamIdEdit:EditBox;
    // @property(Node)
    // dropSetToggles:Node;
    @property(Label)
    dropInfo:Label; 
    @property(Label)
    teamIdLabel:Label; 
    @property(Node)
    requestListBtn:Node;
    @property(Node)
    teamSetBtn:Node;
    @property(Node)
    exitTeamBtn:Node;
    @property(Node)
    createTeamBtn:Node;
    @property(Node)
    saveSetBtn:Node;
    @property(Node)
    clearListBtn:Node;
    @property(List)
    myTeamList:List;
    @property(List)
    otherTeamList:List;
    @property(List)
    noTeamList:List;
    @property(List)
    requestList:List;
    @property(EditBox)
    needZs:EditBox;
    @property(EditBox)
    needLv:EditBox;
    @property(Node)
    needRoleTypes:Node;
    @property(Toggle)
    autoAgree:Toggle;
    @property(Node)
    backBtn:Node;
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
    @property(Node)
    lastPage:Node;
    @property(Node)
    firstPage:Node;
    @property(Label)
    page:Label;
    @property(Node)
    prePage1:Node;
    @property(Node)
    nextPage1:Node;
    @property(Label)
    page1:Label;
    @property(Node)
    posBox:Node;

    pageNum:number=1;
    totalPageNum:number=1;

    // dropStr:Array<string>=['分配方式：随机','分配方式：最高伤害']

    onLoad() {
        super.onLoad();
        this.prePage.on(Node.EventType.TOUCH_END,()=>{
            if(this.pageNum>1){
                this.pageNum--
                this.getOtherTeams()
                GD.playClickSound()
            }
        })
        this.nextPage.on(Node.EventType.TOUCH_END,()=>{
            if(this.pageNum<this.totalPageNum){
                this.pageNum++
                this.getOtherTeams()
                GD.playClickSound()
            }
        })
        this.firstPage.on(Node.EventType.TOUCH_END,()=>{
            if(this.pageNum>1){
                this.pageNum=1
                this.getOtherTeams()
                GD.playClickSound()
            }
        })
        this.lastPage.on(Node.EventType.TOUCH_END,()=>{
            if(this.pageNum!=this.totalPageNum){
                this.pageNum=this.totalPageNum
                this.getOtherTeams()
                GD.playClickSound()
            }
        })
        this.prePage1.on(Node.EventType.TOUCH_END,()=>{
            if(this.pageNum>1){
                this.pageNum--
                this.getNoTeamList()
                GD.playClickSound()
            }
        })
        this.nextPage1.on(Node.EventType.TOUCH_END,()=>{
            if(this.pageNum<this.totalPageNum){
                this.pageNum++
                this.getNoTeamList()
                GD.playClickSound()
            }
        })
        this.tab.selectedHandler=(node:Node,index:number)=>{
            this.viewStack.selectedIndex=index;
            this.pageNum=1
            if(index==0){
                this.getMyTeam();
            }else if(index==1){
                this.page.string='0/0'
                this.getOtherTeams()
            }else if(index==2){
                this.page1.string='0/0'
                this.getNoTeamList()
            }else if(index==3){
                this.getRequestList()
            }
            GD.playClickSound()
        }
        this.requestListBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.tab.select(3)
        },this);
        this.backBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.tab.select(0)
        },this);
        this.backBtn2.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.tab.select(0)
        },this);
        this.teamSetBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.setMyTeamSet()
            this.tab.select(4)
        },this);
        this.saveSetBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.tab.select(0)
            let zs = parseInt(this.needZs.string)
            let lv = parseInt(this.needLv.string)
            if(zs!==null&&lv!==null){
                let NeedLv = zs*400+lv;
                let roleType=0;
                this.needRoleTypes.children.forEach((node:Node,index:number)=>{
                    if(node.getComponent(Toggle).isChecked){
                        roleType += Math.pow(2,index);
                    }
                })
                let req = outer_pb.TeamAct.create();
                req.NeedLv=NeedLv;
                req.NeedRoleType=roleType
                req.IsAgree = this.autoAgree.isChecked;
                req.PkPos={}
                this.posIdList.forEach((r,index)=>{
                    if(r) req.PkPos[r.Id]=index
                })
                let buff = outer_pb.TeamAct.encode(req).finish();
                WS.send(MT.SaveTeamSet,buff,(d:any)=>{
                    let rsp=outer_pb.TeamAct.decode(d);
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        GD.role.myTeam.NeedLv=rsp.NeedLv
                        GD.role.myTeam.NeedRoleType=rsp.NeedRoleType
                        GD.role.myTeam.IsAutoAgree=rsp.IsAgree
                        GD.role.myTeam.DropSet=rsp.DropSet
                        UIMgr.I.tip('保存成功',ct.green)
                    }else{
                        UIMgr.I.tip('保存失败')
                    }
                })
            }
        },this);
        this.clearListBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.tab.select(0)
            WS.send(MT.ClearMyTeamRequestList,GD.EmptyRequestBuff,(d:any)=>{
                this.requestList.array=[];
            })
        },this);
        this.exitTeamBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            UIMgr.I.PopView.showMsgBox([new BoxMsg('<br/>退出队伍后，将清空当前队伍的竞技场积分',ct.brown)],'退出',()=>{
                WS.send(MT.ExitFromMyTeam,GD.EmptyRequestBuff,(d:any)=>{
                    let rsp=outer_pb.TeamAct.decode(d);
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        GD.role.myTeam=null;
                        this.resetMyTeamBtns()
                        UIMgr.I.resetTeamBox();
                        UIMgr.I.tip('成功退出队伍',ct.green)
                    }else{
                        UIMgr.I.tip('退出队伍失败')
                    }
                })
            },'取消')
        },this);
        this.createTeamBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            let idStr = this.teamIdEdit.string
            if(idStr.length>0&&idStr.length<10){
                let id = parseInt(idStr)
                if(GD.role.myTeam==null){
                    let req = outer_pb.TeamAct.create();
                    let type=0
                    // this.dropSetToggles.children.forEach((node,i)=>{
                    //     if(node.getComponent(Toggle).isChecked){
                    //         type=i;
                    //     }
                    // })
                    req.TeamId=id;
                    req.DropSet = type
                    let buff = outer_pb.TeamAct.encode(req).finish();
                    WS.send(MT.CreateTeam,buff,this.onCreateTeam)
                }else{
                    UIMgr.I.tip('已有队伍')
                }
            }else{
                UIMgr.I.tip('队伍ID不能为空')
            }
        },this);
        this.myTeamList.cellRender = (node:Node,index:number)=>{
            let info = this.myTeamList.array[index] as outer_pb.RoleInfo;
            node.children[1].active = info.Name==GD.role.data.Name;
            let roleBox = node.children[2];
            roleBox.off(Node.EventType.TOUCH_END)
            if(info.Id!=GD.role.data.Id){
                roleBox.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
                    UIMgr.I.PopView.show(1,info)
                },this);
            }
            Tools.renderRoleList(roleBox,node.children[4],info,info.ChIdLv);
            node.children[5].active = info.Name==GD.role.myTeam.OwnerN
            let switchBtn = node.children[6]
            let hitOutBtn = node.children[7]
            switchBtn.off(Node.EventType.TOUCH_END)
            hitOutBtn.off(Node.EventType.TOUCH_END)
            if(GD.role.data.Name == GD.role.myTeam.OwnerN && info.Name!=GD.role.data.Name){
                //注册事件
                switchBtn.active=hitOutBtn.active=true
                switchBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
                    this.switchOwner(info.Id)
                },this);
                hitOutBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
                    UIMgr.I.PopView.showMsgBox([new BoxMsg('<br/>踢出后，将清空当前队伍的竞技场积分',ct.brown)],'踢出',()=>{
                        this.hitOut(info.Id)
                    },'取消')
                },this);
            }else{
                switchBtn.active=hitOutBtn.active=false
            }
            let msg=''
            let posRich=node.children[8]
            if(this.curTeamPosList){
                let pos = this.curTeamPosList[info.Id+''];
                if(pos){
                    let name = Tools.getMapName(pos,false)
                    let color = ct.blue
                    const lineId = pos.LineId;
                    if(lineId=='1'){
                        color=ct.blue
                    }else if(lineId=='99'){
                        color=ct.purple
                    }else{
                        color=ct.yellow
                    }
                    msg = `<u><color=${color}  click="onClick" param="p">${name}</></u>`
                    posRich.getComponent(RichTextHandler).data={Position:pos}
                }
            }
            posRich.getComponent(RichText).string=msg;
        }
        this.otherTeamList.cellRender = (cell:Node,index:number)=>{
            let team:outer_pb.ITeamInfo = this.otherTeamList.array[index];
            let need = `<color=${ct.brown}>需要等级：${team.NeedLv/400>>0}转${team.NeedLv%400}级</>  <color=${ct.blue}>需要职业：`;
            let types = []
            GD.roleTypeNums.forEach((type:number,index:number)=>{
                if(team.NeedRoleType==0||(type&team.NeedRoleType)>0){
                    types.push(`${GD.roleTypeStrs[index]}`)
                }
            })
            let color=ct.brown
            if(team.DropSet==0){
                color=ct.green
            }
            let dropStr = '分配方式：随机' //this.dropStr[team.DropSet]
            cell.children[2].getComponent(RichText).string = `${need}${types.join(',')}</>  <color=${color}>${dropStr}</>`
            let requestBtn = cell.children[3]
            requestBtn.off(Node.EventType.TOUCH_END)
            if(GD.role.myTeam){
                requestBtn.active=false
            }else{
                requestBtn.active=true
                requestBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
                    this.requestJoinTeam(team.TeamId)
                },this);
            }
            Tools.renderTeamRoles(cell.children[0],team.OwnerId,team.Menbers)
        }
        this.noTeamList.cellRender = (node:Node,index:number)=>{
            let info = this.noTeamList.array[index] as outer_pb.RoleInfo;
            let roleBox = node.children[2]
            roleBox.off(Node.EventType.TOUCH_END)
            roleBox.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
                UIMgr.I.PopView.show(1,info)
            },this);
            Tools.renderRoleList(roleBox,node.children[3],info);
            
            let inviteBtn = node.children[4]
            inviteBtn.off(Node.EventType.TOUCH_END)
            inviteBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
                Tools.inviteOtherJoinMyTeam(info.Id,this.onInviteOtherJoinMyTeam)
            },this);
        }
        this.requestList.cellRender = (node:Node,index:number)=>{
            let role:outer_pb.RoleInfo = this.requestList.array[index];
            let roleBox = node.children[2]
            roleBox.off(Node.EventType.TOUCH_END)
            roleBox.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
                UIMgr.I.PopView.show(1,role)
            },this);
            Tools.renderRoleList(roleBox,node.children[3],role);
            let agreeBtn = node.children[4]
            agreeBtn.off(Node.EventType.TOUCH_END)
            agreeBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
                this.agreeRequesterJoinMyTeam(role.Id,true)
            },this); 
            let disAgreeBtn = node.children[5]
            disAgreeBtn.off(Node.EventType.TOUCH_END)
            disAgreeBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
                this.agreeRequesterJoinMyTeam(role.Id,false)
            },this);
        }
        this.posBox.children.forEach((node,index)=>{
            node.on(Node.EventType.TOUCH_END,()=>{
                this.clickedPosIndex=index;
                UIMgr.I.PopView.show(PopViewType.TeamRolesForPos,null,false,ShowItemType.None,null,this.setPos)
            },this);
        })
    }
    clickedPosIndex:number=-1;
    setPos=(index:number)=>{
        if(this.clickedPosIndex>=0){
            let member = GD.role.myTeam.Menbers[index] as outer_pb.RoleInfo
            let i = this.posIdList.findIndex(r=>{return r&&r.Id==member.Id})
            if(i>-1){
                let old = this.posIdList[this.clickedPosIndex];
                this.posIdList[i]=old
                if(old){
                    GD.role.myTeam.PkPos[old.Id]=i
                }
            }
            GD.role.myTeam.PkPos[member.Id]=this.clickedPosIndex;
            this.posIdList[this.clickedPosIndex] = member
            this.renderPosBox()
        }
    }
    posIdList:Array<outer_pb.RoleInfo>=[
        null,null,null,null,null,
        null,null,null,null,null,
        null,null,null,null,null,
    ]
    renderPosBox=()=>{
        const myTeam = GD.role.myTeam
        this.posBox.children.forEach((node,index)=>{
            const role = this.posIdList[index]
            let isOwnerLabel = node.children[4];
            let defaultPan = node.children[5];
            let state = node.children[3];
            if(role){
                defaultPan.active=false;
                state.active=true;
                isOwnerLabel.active = role.Id==myTeam.OwnerId;
                Tools.renderRoleList(node.children[2],state,role);
            }else{
                node.children[2].removeAllChildren();
                isOwnerLabel.active=state.active=false;
                defaultPan.active=true;
            }
        })
    }
    setMyTeamSet(){
        let myTeam = GD.role.myTeam;
        this.needZs.string = myTeam.NeedLv ? `${myTeam.NeedLv/400>>0}` :'0';
        this.needLv.string = myTeam.NeedLv ? `${myTeam.NeedLv%400}` :'0';
        this.needRoleTypes.children.forEach((node:Node,index:number)=>{
            node.getComponent(Toggle).isChecked = myTeam.NeedRoleType==0 || (Math.pow(2,index)&myTeam.NeedRoleType)>0
        })
        this.autoAgree.isChecked=myTeam.IsAutoAgree;
        for(let i=0;i<15;i++){
            this.posIdList[i]=null;
        }
        for(let idStr in myTeam.PkPos){
            const id = parseInt(idStr)
            const index = myTeam.PkPos[idStr]
            this.posIdList[index]=myTeam.Menbers.find(r=>{return r.Id==id;}) as outer_pb.RoleInfo
        }
        this.renderPosBox();
    }
    // protected onEnable(): void {
    //     this.tab.select(0)
    // }
    initData(data: any): void {
        this.tab.select(0)
    }
    onInviteOtherJoinMyTeam=(id:number)=>{
        let i = this.noTeamList.array.findIndex((info:outer_pb.RoleInfo)=>{return info.Id==id})
        if(i>-1){
            this.noTeamList.array.splice(i,1)
            this.noTeamList.refresh();
        }
    }
    agreeRequesterJoinMyTeam(id:number,isAgree:boolean){
        let req = outer_pb.TeamAct.create();
        req.Id=id;
        req.IsAgree=isAgree;
        let buff = outer_pb.TeamAct.encode(req).finish();
        WS.send(MT.AgreeRequesterJoinMyTeam,buff,this.onAgreeRequesterJoinMyTeam)
    }
    onAgreeRequesterJoinMyTeam=(d:any)=>{
        let rsp=outer_pb.TeamAct.decode(d);
        let i = this.requestList.array.findIndex((info:outer_pb.RoleInfo)=>{return info.Id==rsp.Id})
        if(i>-1){
            this.requestList.array.splice(i,1)
            this.requestList.refresh();
        }
        if(rsp.IsAgree){
            if(rsp.ErrCode==Err.ErrCode_Success){
                GD.role.myTeam = rsp.TeamInfo
                UIMgr.I.tip(`${rsp.Who} 加入您的队伍`,ct.green)
                UIMgr.I.resetTeamBox()
            }else if(rsp.ErrCode==Err.ErrCode_RoleCanNotJoinTeam){
                UIMgr.I.tip('对方不满足加入条件')
            }else if(rsp.ErrCode==Err.ErrCode_TeamNotExsit){
                UIMgr.I.tip('您的队伍已解散')
            }else if(rsp.ErrCode==Err.ErrCode_TeamFull){
                UIMgr.I.tip('您的队伍已满员')
            }else{
                UIMgr.I.tip('对方已有队伍')
            }
        }else{
            UIMgr.I.tip('拒绝成功',ct.green);
        }
    }
    requestJoinTeam(num:number){
        let req = outer_pb.TeamAct.create();
        req.TeamId=num;
        let buff = outer_pb.TeamAct.encode(req).finish();
        WS.send(MT.RequestJoinTeam,buff,this.onRequestJoinTeam)
    }
    onRequestJoinTeam=(d:any)=>{
        let rsp=outer_pb.TeamAct.decode(d);
        let i = this.otherTeamList.array.findIndex((info:outer_pb.TeamInfo)=>{return info.TeamId==rsp.TeamId})
        if(i>-1){
            this.otherTeamList.array.splice(i,1)
            this.otherTeamList.refresh();
        }
        if(rsp.ErrCode==Err.ErrCode_Success){
            UIMgr.I.tip('成功发送申请',ct.green)
        }else if(rsp.ErrCode==Err.ErrCode_RequestBuffFull){
            UIMgr.I.tip('申请列表已满')
        }else{
            UIMgr.I.tip('该队伍已满员')
        }
    }
    onCreateTeam=(d:any)=>{
        let rsp=outer_pb.TeamAct.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            GD.role.myTeam=rsp.TeamInfo
            GD.role.data.TeamId=rsp.TeamInfo.TeamId
            this.myTeamList.array=rsp.TeamInfo.Menbers;
            UIMgr.I.tip('创建队伍成功',ct.green)
            UIMgr.I.resetTeamBox()
        }else{
            UIMgr.I.tip('队伍ID已存在')
        }
        this.resetMyTeamBtns()
    }
    getMyTeam(){
        this.myTeamList.array=[];
        this.curTeamPosList =null;
        WS.send(MT.GetMyTeam,GD.EmptyRequestBuff,this.onGetMyTeam)
    }
    curTeamPosList:{[k: string]: outer_pb.IPosition;}
    onGetMyTeam=(d:any)=>{
        let rsp=outer_pb.TeamAct.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            GD.role.myTeam=rsp.TeamInfo
            GD.role.data.TeamId=rsp.TeamInfo.TeamId
            this.myTeamList.array=rsp.TeamInfo.Menbers;
            this.curTeamPosList = rsp.PosList;
            this.requestListBtn.children[1].active = rsp.ReqNum>0;
        }else{
            GD.role.data.TeamId=0;
            GD.role.myTeam=null;
        }
        UIMgr.I.resetTeamBox()
        this.resetMyTeamBtns()
    }
    resetMyTeamBtns(){
        let t=GD.role.myTeam
        if(t){
            this.requestListBtn.active = this.exitTeamBtn.active=true
            this.createTeamBtn.active=false
            //只有队长才能设置
            this.teamSetBtn.active = GD.role.data.Name==t.OwnerN
            let color=ct.brown
            if(t.DropSet==0){
                color=ct.green
            }
            this.dropInfo.string = '分配方式：随机'//this.dropStr[t.DropSet]
            this.dropInfo.color.fromHEX(color)
            this.teamIdLabel.string=`队伍ID：${t.TeamId}`
        }else{
            this.teamSetBtn.active=this.exitTeamBtn.active=this.requestListBtn.active=false;
            this.createTeamBtn.active=true
            GD.role.data.TeamId=0;
            this.myTeamList.array=[]
            this.dropInfo.string =''
            this.teamIdLabel.string=''
        }
    }
    getOtherTeams(){
        this.info1.active=false
        this.otherTeamList.array=[]
        let req=outer_pb.TeamAct.create()
        req.Page=this.pageNum;
        let buff = outer_pb.TeamAct.encode(req).finish()
        WS.send(MT.GetOtherTeams,buff,this.onGetOtherTeams)
    }
    onGetOtherTeams=(d:any)=>{
        let rsp=outer_pb.TeamAct.decode(d);
        this.otherTeamList.array=rsp.TeamList;
        this.info1.active = rsp.TeamList.length==0
        this.pageNum=rsp.Page;
        this.totalPageNum=rsp.TotalPage;
        this.page.string=`${this.pageNum}/${this.totalPageNum}`
    }
    getNoTeamList(){
        this.info2.string=''
        this.noTeamList.array=[]
        if(GD.role.myTeam){
            let req=outer_pb.TeamAct.create()
            req.Page=this.pageNum;
            let buff = outer_pb.TeamAct.encode(req).finish()
            WS.send(MT.GetNoTeamList,buff,this.onGetNoTeamList)
        }else{
            this.info2.string='加入队伍后，才能获取无队伍玩家列表'
            // UIMgr.I.sm('加入队伍后，才能获取无队伍玩家列表')
        }
    }
    onGetNoTeamList=(d:any)=>{
        let rsp=outer_pb.TeamAct.decode(d);
        this.noTeamList.array=rsp.RoleList;
        if(rsp.RoleList.length==0){
            this.info2.string='暂时没有可加入您队伍的在线玩家\n(可修改队伍设置，放宽条件，以邀请更多玩家)'
        }else{
            this.info2.string=''
        }
        this.pageNum=rsp.Page;
        this.totalPageNum=rsp.TotalPage;
        this.page1.string=`${this.pageNum}/${this.totalPageNum}`
    }
    getRequestList(){
        this.requestList.array=[]
        WS.send(MT.GetRequestList,GD.EmptyRequestBuff,this.onGetRequestList)
    }
    onGetRequestList=(d:any)=>{
        let rsp=outer_pb.CommonResponse.decode(d);
        this.requestList.array=rsp.RoleList;
    }
    switchOwner=(id:number)=>{
        let req = outer_pb.TeamAct.create();
        req.Id=id;
        let buff = outer_pb.TeamAct.encode(req).finish();
        WS.send(MT.SwitchTeamOwner,buff,(d:any)=>{
            let rsp=outer_pb.TeamAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                GD.role.myTeam.OwnerN = rsp.Who
                GD.role.myTeam.OwnerId = rsp.Id
                this.myTeamList.array=GD.role.myTeam.Menbers
                this.resetMyTeamBtns()
                UIMgr.I.tip('转让成功',ct.green)
            }else{
                UIMgr.I.tip('转让失败')
            }
        })
    }
    hitOut=(id:number)=>{
        let req = outer_pb.TeamAct.create();
        req.Id=id;
        let buff = outer_pb.TeamAct.encode(req).finish();
        WS.send(MT.HitOutFromMyTeam,buff,(d:any)=>{
            let rsp=outer_pb.TeamAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                GD.role.myTeam=rsp.TeamInfo
                this.myTeamList.array=rsp.TeamInfo.Menbers
                UIMgr.I.resetTeamBox()
                UIMgr.I.tip('踢出成功',ct.green)
            }else{
                UIMgr.I.tip('踢出失败')
            }
        })
    }
}


