import { _decorator, Label, Node, RichText } from 'cc';
import { BasePage } from './BasePage';
import { Tab } from '../UiComps/Tab';
import { ViewStack } from '../UiComps/ViewStack';
import { List } from '../UiComps/List';
import Tools from '../base/tools';
import { PageType, UIMgr } from '../managers/UIMgr';
import { BoxMsg, ct, ShiTuReward } from '../base/types';
import WS from '../base/net';
import { ConfigType, Err, MT } from '../base/MT';
import GD from '../base/GameData';
import { RichTextHandler } from '../UiComps/RichTextHandler';
const { ccclass, property } = _decorator;

@ccclass('ShiTuPage')
export class ShiTuPage extends BasePage {
    @property(Tab)
    tab:Tab
    @property(ViewStack)
    view:ViewStack
    @property(List)
    shifuList:List
    @property(List)
    rewardList:List
    @property(Node)
    shouTuBtn:Node
    @property(Node)
    sendMsgBtn:Node
    @property(Node)
    hitOutBtn:Node
    @property(Tab)
    tudiTab:Tab
    @property(RichText)
    infoRich:RichText
    @property(Node)
    role:Node
    @property(Label)
    tuDiNum:Label
    @property(Node)
    refreshBtn:Node

    shiFuId:number;
    shiFuSid:string;
    shiFuInfo:outer_pb.IRoleInfo;
    curTuDiStep:number=-1;
    curTuDiLv:number=0
    tuDiArr:Array<outer_pb.ITuDiInfo>;
    curTuDiInfo:outer_pb.ITuDiInfo;
    baiShiNeedLv:number;
    shouTuNeedLv:number;
    noShiFuInfo:string;
    onLoad(): void {
        super.onLoad();
        this.baiShiNeedLv=GD.configs.get(ConfigType.BaiShiLv)
        this.shouTuNeedLv=GD.configs.get(ConfigType.ShouTuLv)
        this.noShiFuInfo=`<color=${ct.brown}>您暂无师傅</><br/><br/>等级小于${this.baiShiNeedLv}级可拜师<br/>等级>=${this.shouTuNeedLv}级可收徒<br/>拜师后，师傅和徒弟均可领取大量奖励`
        this.shouTuBtn.on(Node.EventType.TOUCH_END,this.shouTu,this);
        this.refreshBtn.on(Node.EventType.TOUCH_END,this.getShiFuList,this);
        this.tab.selectedHandler=(node:Node,index:number)=>{
            this.view.selectedIndex=index
            if(index==0){
                this.getMyShiTuData();
            }else{
                this.getShiFuList()
            }
        }
        this.shifuList.cellRender=(node,index)=>{
            let data:outer_pb.RoleMiniInfo = this.shifuList.array[index]
            let name = `${data.Sid}服【${data.Name}】`
            let label=node.children[0].getComponent(Label);
            label.string=name
            let color=ct.white
            let show=true
            if(GD.role.data.Id==data.Id){
                color=ct.green
                show=false
            }
            label.color.fromHEX(color)
            let seeBtn=node.children[1]
            seeBtn.off(Node.EventType.TOUCH_END)

            let baiBtn=node.children[2]
            baiBtn.off(Node.EventType.TOUCH_END)

            seeBtn.active=baiBtn.active=show
            if(show){
                seeBtn.on(Node.EventType.TOUCH_END,()=>{
                    if(GD.role.hasEnoughLv(320)){
                        Tools.tryGetOtherRoleInfo(data.Id)
                    }
                })
                baiBtn.on(Node.EventType.TOUCH_END,()=>{
                    if(this.shiFuId>0){
                        UIMgr.I.tip('您已经有师傅了')
                        return
                    }
                    if(GD.role.hasEnoughLv(this.baiShiNeedLv,false)==false){
                        if(GD.role.hasBaseYk()){
                            UIMgr.I.PopView.showMsgBox([new BoxMsg(`<br/>确定拜【${name}】为师？`,ct.brown)],'拜师',(d)=>{
                                let req = outer_pb.ShiTuAct.create();
                                req.RoleId=data.Id
                                let buff = outer_pb.ShiTuAct.encode(req).finish();
                                WS.send(MT.BaiShi,buff,(d:any)=>{
                                    let rsp=outer_pb.ShiTuAct.decode(d);
                                    if(rsp.ErrCode==Err.ErrCode_Success){
                                        this.tab.select(0)
                                        UIMgr.I.tip('拜师成功',ct.green)
                                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughNum){
                                        UIMgr.I.tip('对方已收满徒弟了')
                                    }else{
                                        UIMgr.I.tip('拜师失败，无法拜自己为师')
                                    }
                                })
                            },'取消')
                        }
                    }else{
                        UIMgr.I.tip(`您的等级>=${this.baiShiNeedLv}级，无法拜师`)
                    }
                })
            }
        }
        this.tudiTab.selectedHandler=(node,index)=>{
            let tudi=this.tuDiArr[index]
            this.curTuDiInfo=tudi
            Tools.renderRoleList(this.role.children[1],this.role.children[2],tudi.Info);
            this.infoRich.string=`我的徒弟：S${tudi.Sid}-${tudi.Info.Name}`
            this.setRewardList(tudi.Info.Lv,tudi.Step)
        }
        this.rewardList.array=GD.ShiTuRewardList
        this.rewardList.cellRender=(node,index)=>{
            let data:ShiTuReward = this.rewardList.array[index]
            let rich = node.children[1].getComponent(RichText)
            let obj={Items:[]}
            rich.getComponent(RichTextHandler).data=obj
            let names = Tools.getRewardsStr(data.Rewards,obj,null,false)
            let pre=''
            if(index==0){
                pre='拜师奖励：'
            }else if(index==GD.ShiTuRewardList.length-1){
                pre=`${data.NeedLv}级出师奖励：`
            }else{
                pre=`${data.NeedLv}级奖励：`
            }
            rich.string=`${pre}${names.join('  ')}`

            let showBtn=false
            if(this.shiFuId>0){
                showBtn=true
            }else if(this.curTuDiInfo){
                showBtn=true
            }
            showBtn = showBtn && index<=this.curTuDiStep && this.curTuDiLv>=data.NeedLv;
            let btn = node.children[2]
            btn.active=showBtn
            btn.off(Node.EventType.TOUCH_END)
            if(showBtn){
                let str='领取'
                let color=ct.green
                if(index<this.curTuDiStep){
                    str='已领取'
                    color=ct.gray
                }
                let label=btn.children[0].getComponent(Label);
                label.string=str
                label.color.fromHEX(color)
                if(index==this.curTuDiStep){
                    btn.on(Node.EventType.TOUCH_END,()=>{
                        if(GD.role.hasBaseYk()){
                            let type=this.shiFuId>0?MT.GetTuDiReward:MT.GetShiFuReward
                            let buff=GD.EmptyRequestBuff;
                            if(this.shiFuId==0&&this.curTuDiInfo){
                                let req = outer_pb.ShiTuAct.create();
                                req.RoleId=this.curTuDiInfo.Info.Id;
                                buff = outer_pb.ShiTuAct.encode(req).finish();
                            }
                            WS.send(type,buff,(d:any)=>{
                                let rsp=outer_pb.ShiTuAct.decode(d);
                                if(rsp.ErrCode==Err.ErrCode_Success){
                                    GD.role.getItems(rsp.Items,true,true,'领取师徒奖励')
                                    let msg='领取成功'
                                    this.curTuDiStep=rsp.Step
                                    if(type==MT.GetTuDiReward){
                                        this.shiFuId=rsp.RoleId
                                        if(rsp.RoleId==0){
                                            //我出师了
                                            msg='恭喜您成功出师！'
                                        }
                                    }else{
                                        if(rsp.Step>=GD.ShiTuRewardList.length){
                                            //徒弟出师了
                                            let i=this.tuDiArr.findIndex(info=>{return info.Info.Id==this.curTuDiInfo.Info.Id})
                                            if(i>-1){
                                                this.tuDiArr.splice(i,1)
                                            }
                                            msg='恭喜您的徒弟成功出师！'
                                        }else{
                                            this.curTuDiInfo.Step=rsp.Step
                                        }
                                    }
                                    this.refreshShiTuView();
                                    UIMgr.I.tip(msg,ct.green)
                                }else if(rsp.ErrCode==Err.ErrCode_NotEnoughNum){
                                    UIMgr.I.tip('对方已收满徒弟了')
                                }else{
                                    UIMgr.I.tip('领取失败')
                                }
                            })
                        }
                    })
                }
            }
        }
        this.hitOutBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.shiFuId==0&&this.curTuDiInfo&&GD.role.hasBaseYk()){
                let req = outer_pb.ShiTuAct.create();
                req.RoleId=this.curTuDiInfo.Info.Id;
                let buff = outer_pb.ShiTuAct.encode(req).finish();
                WS.send(MT.HitOutTuDi,buff,(d:any)=>{
                    let rsp=outer_pb.ShiTuAct.decode(d);
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        this.curTuDiInfo=null
                        let i=this.tuDiArr.findIndex(info=>{return info.Info.Id==rsp.RoleId})
                        if(i>-1){
                            this.tuDiArr.splice(i,1)
                        }
                        this.refreshShiTuView()
                        UIMgr.I.tip('逐出成功',ct.green)
                    }else{
                        UIMgr.I.tip('逐出失败，离线超过7天的徒弟才能逐出师门')
                    }
                })
            }
        },this);
        //发送消息（私聊、邮件）
        this.sendMsgBtn.on(Node.EventType.TOUCH_END,()=>{
            let info = this.shiFuInfo;
            if(this.curTuDiInfo){
                info=this.curTuDiInfo.Info
            }
            if(info){
                UIMgr.I.show(PageType.ChatPage,info)
            }
        },this);
    }
    shouTu=()=>{
        if(GD.role.hasEnoughLv(this.shouTuNeedLv)&&GD.role.hasBaseYk()){
            if(this.tuDiArr.length>=3){
                UIMgr.I.tip('最多只能同时收3名徒弟')
                return;
            }
            WS.send(MT.ShouTu,GD.EmptyRequestBuff,(d:any)=>{
                let rsp=outer_pb.ShiTuAct.decode(d);
                if(rsp.ErrCode==Err.ErrCode_Success){
                    let arr=[]
                    for(let k in rsp.List){
                        arr.push(rsp.List[k])
                    }
                    this.shifuList.array=arr;
                    UIMgr.I.tip('发布收徒信息成功',ct.green)
                }else if(rsp.ErrCode==Err.ErrCode_AccountHasExsited){
                    UIMgr.I.tip('已发布过了')
                }else if(rsp.ErrCode==Err.ErrCode_NotEnoughNum){
                    UIMgr.I.tip('剩余可收徒数量不足')
                }else{
                    UIMgr.I.tip('发布收徒信息失败')
                }
            })
        }
    }
    initData(data: any): void {
        this.onHide();
        this.tab.select(0)
    }
    onHide(): void {
        this.shiFuId=0
        this.shiFuInfo=null;
        this.shiFuSid='';
        this.curTuDiStep=-1;
        this.curTuDiLv=0
        this.tuDiArr=[];
        this.curTuDiInfo=null;
        this.role.children[1].removeAllChildren()
    }
    getMyShiTuData=()=>{
        WS.send(MT.GetMyShiTuData,GD.EmptyRequestBuff,(d:any)=>{
            let rsp=outer_pb.ShiTuAct.decode(d);
            this.onGetShiTuData(rsp)
        })
    }
    onGetShiTuData=(rsp:outer_pb.ShiTuAct)=>{
        this.shiFuId=rsp.RoleId
        this.curTuDiStep=rsp.Step;
        this.shiFuInfo=rsp.RoleInfo;
        this.shiFuSid=rsp.Sid;
        this.tuDiArr=rsp.TuDiList.sort((a,b)=>{return a.Info.Id-b.Info.Id});
        this.refreshShiTuView()
    }
    refreshShiTuView=()=>{
        const canShouTu = GD.role.hasEnoughLv(this.shouTuNeedLv,false);
        this.tuDiNum.string = this.shiFuId==0&&canShouTu ? `徒弟数量：${this.tuDiArr.length}/3`:'';
        this.hitOutBtn.active=this.tudiTab.node.active=this.shiFuId==0&&this.tuDiArr.length>0
        this.sendMsgBtn.active=this.shiFuId>0||this.tuDiArr.length>0
        if(this.shiFuId>0){
            //有师傅，则为徒弟身份
            this.infoRich.string=`我的师傅：S${this.shiFuSid}-${this.shiFuInfo.Name}`
            Tools.renderRoleList(this.role.children[1],this.role.children[2],this.shiFuInfo);
            this.setRewardList(GD.role.data.Lv,this.curTuDiStep)
        }else if(canShouTu){
            //无师傅，且达到320级了，则可收徒，也可能有徒弟了
            if(this.tuDiArr.length==0){
                this.infoRich.string=`<color=${ct.green}>您的等级>=${this.shouTuNeedLv}级，可收徒</>`
                if(this.curTuDiInfo){
                    this.setRewardList(this.curTuDiInfo.Info.Lv,this.curTuDiInfo.Step)
                }else{
                    this.setRewardList(0,0)
                }
            }else{
                let labels=[]
                this.tuDiArr.forEach((info,index)=>{
                    labels.push(`徒弟${index+1}`)
                })
                this.tudiTab.labels=labels.join(',')
                let i=this.tudiTab.selectedIndex
                if(i<0||i>=labels.length){
                    i=0
                }
                this.tudiTab.select(i)
            }
        }else{
            //小于320级，且无师傅
            this.infoRich.string=this.noShiFuInfo
            this.setRewardList(0,0)
        }
    }
    setRewardList=(lv:number,step:number)=>{
        this.curTuDiLv=lv
        this.curTuDiStep=step
        this.rewardList.refresh()
    }
    getShiFuList=()=>{
        WS.send(MT.GetShouTuList,GD.EmptyRequestBuff,(d:any)=>{
            let rsp=outer_pb.ShiTuAct.decode(d);
            let arr=[]
            for(let k in rsp.List){
                arr.push(rsp.List[k])
            }
            this.shifuList.array=arr;
            if(arr.length==0){
                UIMgr.I.tip('暂无师傅')
            }
            // if(rsp.ErrCode==Err.ErrCode_Success){
            //     let arr=[]
            //     for(let k in rsp.List){
            //         arr.push(rsp.List[k])
            //     }
            //     this.shifuList.array=arr;
            // }else{
            //     UIMgr.I.tip('获取收徒信息失败')
            // }
        })
    }
}


