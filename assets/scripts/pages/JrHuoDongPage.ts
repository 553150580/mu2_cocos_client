import { _decorator, Label, Node, RichText, UITransform } from 'cc';
import { BasePage } from './BasePage';
import { List } from '../UiComps/List';
import GD from '../base/GameData';
import Tools from '../base/tools';
import { AtkZyTypes, BoxMsg, ct, DefZyTypes, HdHcPhReward, Item, JfReward, RewordNameObj, ShopItem } from '../base/types';
import { UIMgr } from '../managers/UIMgr';
import WS from '../base/net';
import { Err, MT } from '../base/MT';
import { ViewStack } from '../UiComps/ViewStack';
import { Tab } from '../UiComps/Tab';
import { ShowItemType } from './PopView';
const { ccclass, property } = _decorator;

@ccclass('JrHuoDongPage')
export class JrHuoDongPage extends BasePage {
    @property(Label)
    hdName:Label;
    @property(Label)
    stopTime:Label;
    @property(RichText)
    info:RichText;
    @property(List)
    hisList:List;
    @property(Label)
    num:Label;
    @property(Node)
    btn:Node;
    @property(List)
    rewardsList:List;
    @property(ViewStack)
    view:ViewStack;
    @property(Tab)
    tab:Tab;
    @property(Tab)
    hcTab:Tab;
    @property(List)
    hcList:List;

    curPhDatas:Array<outer_pb.HcPhInfo>=[]
    hdNames:Array<string>=["【累计充值】", "【点数消耗】", "【钻石消耗】"]
    onLoad() {
        super.onLoad();
        this.btn.on(Node.EventType.TOUCH_END,this.tryChouJiang,this);
        this.hisList.cellRender=(node:Node,index:number)=>{
            let his = this.hisList.array[index]
            node.children[0].getComponent(RichText).string=his;
        }
        this.tab.selectedHandler=(node:Node,index:number)=>{
            this.getHdData(index).then(hdData=>{
                this.hdData=hdData as outer_pb.HuoDongAct
                this.hdName.string=`【${this.hdData.HdName}】`
                this.stopTime.string=`活动结束时间：${Tools.formatTimestamp(this.hdData.HdStopTime)}`
                this.view.selectedIndex=index>=2?2:index;
                let str=''
                if(index==0){
                    this.hisList.array=this.hdData.History
                    GD.role.hdCjNum = this.hdData.Num;
                    this.num.string=`今日剩余抽奖次数：${this.hdData.Num}`
                    str=`【活动内容】<br/>  • 活动期间杀怪、泡点、任务奖励经验值提升<color=${ct.green}>${Math.round(this.hdData.ExpRate*100)}%</><br/>  • <color=${ct.green}>免费抽奖</>：特权卡角色每日可抽1次（<color=${ct.yellow}>黄金卡</>可抽2次，更高概率获得大奖，且奖励数量翻倍）<br/><color=${ct.gray}>(抽奖可获得随机数量许愿币：1~50个不等，奖励数量越多概率越低)</>`
                    GD.playClickSound();
                }else if(index==1){
                    str=`【活动内容】活动期间内，以下各种合成成功的前10名合成者可入榜领奖励，排名按入榜时间（活动结束后未领取的奖励视为放弃)`
                    this.hcList.array=[]
                    let type = this.hcTab.selectedIndex
                    if(type<0)type=0
                    this.hcList.array=[0,0,0,0,0,0,0,0,0,0] //固定10名
                    this.hcTab.select(type)
                }else{
                    let list:Array<JfReward>=[]
                    let hdName:string=this.hdNames[index-2]
                    if(this.hdData.Has){
                        if(index==2){
                            list=GD.hdPayRewardList
                        }else if(index==3){
                            list=GD.hdUsedPointRewards
                        }else if(index==4){
                            list=GD.hdUsedDiaRewards
                        }
                        str=`【活动内容】活动期间的${hdName}达到指定数额后可领取奖励（<color=${ct.green}>每个角色独立累计</>；活动结束后，未领取的奖励视为放弃)`
                    }else{
                        str=`<color=${ct.red}>本服当前无法参与${hdName}活动</>`
                    }
                    this.rewardsList.array=list
                    GD.playClickSound();
                }
                this.info.string=str                
            })
        }
        let labels=[]
        GD.hdHcPhRewards.forEach(obj=>{
            labels.push(obj.Name)
        })
        this.hcTab.labels=labels.join(',')
        //'强化15,追加24,幸运+9,1代翅膀,2代翅膀,3代翅膀,套装,大天套装,纪念勋章,强化恶魔,强化天使,炎狼神兽'
        this.hcTab.selectedHandler=this.getHdHcPh;
        this.hcList.cellRender=(node:Node,index:number)=>{
            const typeIndex:number = this.hcTab.selectedIndex;
            const obj=GD.hdHcPhRewards[typeIndex];
            const num:number=obj.Num
            node.children[0].getComponent(Label).string=`第${index+1}名`
            const rewardNum=num*(10-index)
            node.children[4].getComponent(Label).string=`x${rewardNum}`
            let nameLabel=node.children[1].getComponent(Label)
            let name='虚位以待'
            let color=ct.gray;
            let data:outer_pb.HcPhInfo;
            let showBtn:boolean=false;
            let itemBtn = node.children[2];
            itemBtn.off(Node.EventType.TOUCH_END)
            itemBtn.on(Node.EventType.TOUCH_END,(event:any)=>{
                let coinItem=new Item(56,rewardNum,false)
                UIMgr.I.PopView.show(0,coinItem,false,ShowItemType.Item)
            },this);
            let getBtn = node.children[5];
            getBtn.off(Node.EventType.TOUCH_END)
            let str:string
            let btnColor:ct=ct.gray;
            if(index<this.curPhDatas.length){
                data=this.curPhDatas[index]
                color=ct.brown
                name=data.Name
                if(data.Id==GD.role.data.Id){
                    showBtn=true;
                    if(data.HasGot){
                        str='已领取'
                        btnColor=ct.gray
                    }else{
                        str='领取'
                        btnColor=ct.green
                        getBtn.on(Node.EventType.TOUCH_END,(event:any)=>{
                            this.getHcPhReward(obj.HcType,index)
                        },this);
                    }
                }
            }
            nameLabel.string=name
            nameLabel.color.fromHEX(color)
            if(showBtn){
                let btnLabel = getBtn.children[0].getComponent(Label);
                btnLabel.string=str
                btnLabel.color.fromHEX(btnColor)
            }
            getBtn.active=showBtn;
        }
        this.rewardsList.cellRender=(node:Node,index:number)=>{
            let reward:JfReward = this.rewardsList.array[index]
            let btn = node.children[3];
            btn.off(Node.EventType.TOUCH_END)
            let str:string
            let showBtn:boolean=false;
            let color:ct
            let myJf = this.hdData.Jf;
            let myGotIndex = this.hdData.Index;
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
            let hdName:string=this.hdNames[this.tab.selectedIndex-2];
            rich.string = `${hdName}<color=${ct.brown}>满${Tools.getNumStr(reward.Jf)}</>奖励（<color=${ct.green}>${Tools.getNumStr(this.hdData.Jf)}</>/<color=${ct.brown}>${Tools.getNumStr(reward.Jf)}</>）：`
            let itemList = node.children[2].getComponent(List);
            let items=[]
            const len = reward.Rewards.length
            if(len>0){
                reward.Rewards.forEach(v=>{
                    const id = v[0]
                    const num = v[1]
                    // let name:string
                    const item = outer_pb.MailItem.create()
                    let equip:outer_pb.IEquip;
                    let color:ct
                    if(id<10000){
                        // name = GD.ItemBaseDatas.get(id).Name
                        item.Type=1
                        color=Tools.getItemColor(id)
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
    }
    getHcPhReward=(hcType:number,index:number)=>{
        let req = outer_pb.HuoDongAct.create();
        req.Type=hcType;
        req.Index=index;
        let buff = outer_pb.HuoDongAct.encode(req).finish();
        WS.send(MT.GetHuoDongHcPhRewards,buff,(d:any)=>{
            let rsp = outer_pb.HuoDongAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                let arr=[]
                if(rsp.HcPh.length>0){
                    arr=rsp.HcPh.sort((a,b)=>{return a.Time-b.Time})
                }
                this.curPhDatas=arr
                this.hcList.refresh()
                GD.role.getItem(56,rsp.Num,true,true)
                UIMgr.I.tip('领取成功',ct.green)
            }else{
                UIMgr.I.tip('领取失败')
            }
        })        
    }
    getHdData=(index:number)=>{
        return new Promise((resolve,reject)=>{
            let req = outer_pb.HuoDongAct.create();
            req.Type=index;
            let buff = outer_pb.HuoDongAct.encode(req).finish();
            WS.send(MT.GetHuoDongData,buff,(d:any)=>{
                let rsp = outer_pb.HuoDongAct.decode(d);
                if(rsp.ErrCode==Err.ErrCode_Success){
                    resolve(rsp)
                }else{
                    UIMgr.I.tip('获取活动信息失败')
                    reject(2)
                }
            })
        })
    }
    getHdHcPh=(node:Node,index:number)=>{
        let req = outer_pb.HuoDongAct.create();
        req.Type=GD.hdHcPhRewards[index].HcType;
        let buff = outer_pb.HuoDongAct.encode(req).finish();
        WS.send(MT.GetHuoDongHcPh,buff,(d:any)=>{
            let rsp = outer_pb.HuoDongAct.decode(d);
            // console.log(rsp)
            if(rsp.ErrCode==Err.ErrCode_Success){
                let arr=[]
                if(rsp.HcPh.length>0){
                    arr=rsp.HcPh.sort((a,b)=>{return a.Time-b.Time})
                }
                this.curPhDatas=arr;
                this.hcList.refresh()
            }else{
                UIMgr.I.tip('获取排行信息失败')
            }
        })
        GD.playClickSound();
    }
    getJfReward=(id:number,zyType:number)=>{
        let req = outer_pb.JfAct.create();
        req.Id=id;//选择的自选道具的id（如果有）
        req.Type=zyType;
        req.HdType=this.tab.selectedIndex-2
        let buff = outer_pb.JfAct.encode(req).finish();
        WS.send(MT.GetHuoDongRewards,buff,(d:any)=>{
            let rsp = outer_pb.JfAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                let msglist:Array<BoxMsg>=[]
                msglist.push(new BoxMsg('获得活动奖励<br/>',ct.white))
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
                if(rsp.BaseYk>0)GD.role.data.BaseYk=rsp.BaseYk;
                if(rsp.GoldYk>0)GD.role.data.GoldYk=rsp.GoldYk;
                this.hdData.Jf=rsp.Jf
                this.hdData.Index=rsp.Index
                this.rewardsList.refresh();
                UIMgr.I.tip('领取成功',ct.green)
            }else{
                UIMgr.I.tip('累计充值不足')
            }
        })
    }
    tryChouJiang=()=>{
        if(GD.role.hasBaseYk()){
            if(GD.role.hdCjNum>0){
                WS.send(MT.HuoDongChouJiang,GD.EmptyRequestBuff,(d:any)=>{
                    let rsp = outer_pb.HuoDongAct.decode(d)
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        if(rsp.Items){
                            GD.role.getItems(rsp.Items,true,true,'活动抽奖')
                        }
                        this.hisList.array=rsp.History
                        this.num.string=`今日剩余抽奖次数：${rsp.Num}`
                        UIMgr.I.tip('抽奖成功！',ct.green)
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughNum){
                        UIMgr.I.tip('今日剩余次数不足')
                    }else{
                        UIMgr.I.tip('节日活动已过期')
                    }
                })
            }else{
                UIMgr.I.tip('今日剩余次数不足')
            }
        }
    }
    hdData:outer_pb.HuoDongAct
    initData(data: any): void {
        this.tab.select(0)
    }
}


