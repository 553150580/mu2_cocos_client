import { _decorator, Animation, Component, Label, math, Node, resources, RichText, Sprite, Toggle } from 'cc';
import { Tab } from '../UiComps/Tab';
import { ViewStack } from '../UiComps/ViewStack';
import GD from '../base/GameData';
import WS from '../base/net';
import { ConfigType, Err, MT } from '../base/MT';
import { List } from '../UiComps/List';
import { UIMgr } from '../managers/UIMgr';
import Tools from '../base/tools';
import { ct, OtherHole, PopViewType } from '../base/types';
import { HoleOpenNumOverInfo, KdHelp } from '../base/consts';
import { ShowItemType } from './PopView';
import { BasePage } from './BasePage';
import GameManager from '../managers/GameManager';
const { ccclass, property } = _decorator;

@ccclass('HolePage')
export class HolePage extends BasePage {
    @property(Label)
    npcName:Label;
    @property(Label)
    msgLabel:Label;
    @property(Tab)
    tab:Tab;
    @property(ViewStack)
    view:ViewStack;
    @property(Tab)
    serverTab:Tab;
    @property(Node)
    buffContent:Node;
    @property(Label)
    buffInfo:Label;
    @property(List)
    hisList:List;
    @property(Node)
    getHisBtn:Node;
    @property(RichText)
    rateRich:RichText;
    @property(Label)
    time:Label;
    @property(Node)
    goldKd:Node;
    @property(Node)
    diaKd:Node;
    @property(Node)
    itemKd:Node;
    @property(Node)
    gridBox:Node;
    @property(Node)
    helpBtn:Node;  
    @property(Node)
    getBtn:Node;
    @property(Label)
    getNum:Label;
    @property(Toggle)
    toggle:Toggle;

    @property(RichText)
    otherRich:RichText;
    @property(Node)
    getOtherBtn:Node;
    @property(Node)
    openAll:Node;
    @property(Node)
    otherBox:Node;
    @property(Node)
    ldBtn:Node;
    @property(Label)
    ldNum:Label;
    @property(Node)
    nextBtn:Node;
    @property(Node)
    autoNextBtn:Node;
    @property(Node)
    otherGoldKd:Node;
    @property(Node)
    otherdiaKd:Node;
    @property(Node)
    otherItemKd:Node;
    @property(Node)
    otherGridBox:Node;
    @property(Label)
    openNum:Label;

    @property(Node)
    registBtn:Node;
    @property(Label)
    needLv:Label;
    
    hisInfo1 = `您<color=${ct.green}>收取</>了矿洞库存，获得了：<br/>`

    goldHolePers = [500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000, 256000, 512000]
    diaHolePers = [1, 3, 6, 10, 15, 20, 28, 36, 45, 55, 66]
    itemHolePers = [20, 24, 23, 26, 30, 35, 41, 48, 56, 65, 75]

    goldHolePers2 = [1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000, 256000, 512000, 1024000]
    diaHolePers2 = [2, 6, 12, 20, 30, 40, 56, 72, 90, 110, 132]
    itemHolePers2 = [40, 42, 46, 52, 60, 70, 82, 96, 112, 130, 150]
    
    onLoad(): void {
        super.onLoad()
        WS.cbs.set(MT.UseAllHoleOpenNum,this.onOpenedGrids)
        this.tab.selectedHandler=(node:Node,index:number)=>{
            this.view.selectedIndex=index
            this.getHisBtn.active=index==2;
            if(index==0){
                this.getMyHole()
                GD.playClickSound();
            }else if(index==1){
                if(GD.role.MyHole){
                    this.showOtherHole(false)
                }else{
                    WS.send(MT.GetMyHole,GD.EmptyRequestBuff,(d:any)=>{
                        let rsp = outer_pb.HoleAct.decode(d)
                        if(rsp.ErrCode==Err.ErrCode_Success){
                            GD.role.MyHole = rsp.MyHole;
                            GD.role.HoleDayNum = rsp.HoleDayNum;
                            this.showOtherHole(false)
                        }else{
                            this.getHisBtn.active=this.tab.node.active = false
                            this.view.selectedIndex = 4
                        }
                    })
                }
                GD.playClickSound();
            }else if(index==2){
                this.showHis()
                GD.playClickSound();
            }else if(index==3){
                this.serverTab.select(0)
            }
        }
        this.serverTab.selectedHandler=(node:Node,index:number)=>{
            let needLv = 401
            if(index==0){
                needLv = GD.configs.get(ConfigType.ActiveLvBuffHole)
            }else{
                needLv = GD.configs.get(ConfigType.ActiveLvKfBuffHole)
            }
            this.buffContent.active=false;
            if(GD.role.hasEnoughLv(needLv)){
                this.getBuffHoleList(index)
                GD.playClickSound();
            }else{
                this.buffHoleList = []
            }
        }
        this.needLv.string=`矿洞玩法开放等级：${GD.configs.get(ConfigType.ActiveLv_Hole)}级`
        this.helpBtn.on(Node.EventType.TOUCH_END,()=>{
            UIMgr.I.PopView.showHelpBox(KdHelp)
        },this);
        this.getBtn.on(Node.EventType.TOUCH_END,this.collectMyHole,this);
        this.getOtherBtn.on(Node.EventType.TOUCH_END,()=>{
            this.getOther(0)
        },this);
        this.nextBtn.on(Node.EventType.TOUCH_END,()=>{
            this.getOther(0)
        },this);
        this.autoNextBtn.on(Node.EventType.TOUCH_END,()=>{
            this.getOther(1)
        },this);
        this.registBtn.on(Node.EventType.TOUCH_END,this.tryRegistHole,this);
        this.getHisBtn.on(Node.EventType.TOUCH_END,this.getHis,this);
        this.ldBtn.on(Node.EventType.TOUCH_END,this.startLootOtherHole,this);
        this.openAll.on(Node.EventType.TOUCH_END,this.useAllHoleOpenNum,this);
        this.goldKd.children[2].on(Node.EventType.TOUCH_END,()=>{
            this.showSliderBox(0,49,GD.role.MyHole.GoldHole,'金矿',ct.yellow)
        },this);
        this.diaKd.children[2].on(Node.EventType.TOUCH_END,()=>{
            this.showSliderBox(1,50,GD.role.MyHole.DiaHole,'钻石矿',ct.qing)
        },this);
        this.itemKd.children[2].on(Node.EventType.TOUCH_END,()=>{
            this.showSliderBox(2,51,GD.role.MyHole.ItemHole,'宝石矿',ct.green)
        },this);
        this.hisList.cellRender=(node,index)=>{
            let his:outer_pb.IHoleHistory = this.hisList.array[index];
            let rich = node.children[0].getComponent(RichText)
            let time = `<color=${ct.gray}>[${Tools.formatTimestamp(his.Time as number)}]：</>`
            let info:string
            if(his.Type==1){
                info = `${time} ${this.hisInfo1}`
            }else if(his.Type==2){
                info = `${time} 您的矿洞启用了一次<color=${ct.blue}>随机存储点</>，扣除：`
            }else{
                info = `${time} 您的矿洞被【<color=${ct.brown}>${his.Name}</>】<color=${ct.red}>掠夺</>，损失了：`
            }
            let gold=''
            let has:boolean=false;
            if(his.Gold>0){
                gold = `<color=${ct.yellow}>金币x${his.Gold.toLocaleString()}</>   `
                has=true
            }
            let dia=''
            if(his.Dia>0){
                dia = `<color=${ct.qing}>钻石x${his.Dia.toLocaleString()}</>   `
                has=true
            }
            let item=''
            if(his.Item>0){
                item = `<color=${ct.green}>宝石原矿x${his.Item.toLocaleString()}</>`
                has=true
            }
            if(has){
                info += `${gold}${dia}${item}`
            }else{
                info += `<color=${ct.gray}>无</>`
            }
            rich.string = info
        }
        this.gridBox.children.forEach((cell,index)=>{
            cell.on(Node.EventType.TOUCH_END,()=>{
                if(GD.role.MyHole.Grids[index]) return
                if(this.toggle.isChecked){
                    UIMgr.I.tip('已开启随机重置模式，不需要设置')
                    return
                }
                this.clickedGridIndex=index;
                UIMgr.I.PopView.show(PopViewType.KdBtns,null,false,ShowItemType.None,null,this.setMyGrid)
            },this);
        })
        this.otherGridBox.children.forEach((cell,index)=>{
            cell.on(Node.EventType.TOUCH_END,()=>{
                this.openOtherGrid(index)
            },this);
        })
        this.buffContent.active=false;
        this.buffContent.children.forEach((node,index)=>{
            node.on(Node.EventType.TOUCH_END,()=>{
                let hole = this.buffHoleList[index]
                if(hole.TeamId>0&&hole.TeamId==GD.role.data.TeamId)return;
                const type = this.serverTab.selectedIndex;
                const needLv = GD.configs.get(type==0?ConfigType.ActiveLvBuffHole:ConfigType.ActiveLvKfBuffHole);
                if(GD.role.hasEnoughLv(needLv)){
                    let req = outer_pb.HoleAct.create()
                    req.Index=index
                    req.Type=type;
                    let buff = outer_pb.HoleAct.encode(req).finish()
                    WS.send(MT.GetBuffHoleTeam,buff,(d:any)=>{
                        let rsp=outer_pb.HoleAct.decode(d);
                        if(rsp.ErrCode==Err.ErrCode_Success){
                            UIMgr.I.PopView.showTeamInfoBox(GD.role.hasEnoughLv(220,false),rsp.Id,rsp.RoleList,()=>{
                                if(GD.role.data.TeamId==0){
                                    UIMgr.I.tip('抢占需要先加入队伍')
                                    return
                                }
                                UIMgr.I.PopView.hide();
                                let req = outer_pb.HoleAct.create()
                                req.Type=rsp.Type;
                                req.Index=rsp.Index;
                                let buff = outer_pb.HoleAct.encode(req).finish()
                                WS.send(MT.SeizeBuffHole,buff,(d:any)=>{
                                    let rsp=outer_pb.HoleAct.decode(d);
                                    if(rsp.ErrCode==Err.ErrCode_Success){
                                        this.buffHoleList[rsp.Index]=rsp.BuffHole
                                        if(rsp.OldId>0){
                                            let oldHole = this.buffHoleList[rsp.OldId-1]
                                            oldHole.Owner=''
                                            oldHole.State=0
                                            oldHole.TeamId=0
                                        }
                                        GD.role.HoleDayNum[3+type]--;
                                        this.renderBuffHole(this.buffHoleList)
                                        this.refreshSeizeNum(type)
                                        UIMgr.I.tip('抢占成功',ct.green)
                                    }else if(rsp.ErrCode==Err.ErrCode_BuffHoleIsFighting){
                                        let hole = this.buffHoleList[rsp.Index]
                                        hole.State=1
                                        this.renderBuffHole(this.buffHoleList)
                                        UIMgr.I.tip('该富矿正在被抢占中...请稍后')
                                    }else if(rsp.ErrCode==Err.ErrCode_StartSeizeBuffHole){
                                        UIMgr.I.tip('开始抢占',ct.green)
                                        GD.role.HoleDayNum[3]--;
                                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughLv){
                                        UIMgr.I.tip('等级不足')
                                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughNum){
                                        UIMgr.I.tip(`[${rsp.Name}] 剩余次数不足`)
                                    }else{
                                        UIMgr.I.tip('抢占失败'+rsp.ErrCode)
                                    }
                                })
                            })
                        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughLv){
                            UIMgr.I.tip('等级不足')
                        }else{
                            UIMgr.I.tip(`获取${index+1}号富矿信息失败`)
                        }
                    })
                }
            })
        })
    }
    refreshSeizeNum=(index:number)=>{
        let str:string
        let color=ct.white
        if(index==0){
            str=`剩余抢占本服富矿次数：${GD.role.HoleDayNum[3]}`
        }else{
            str=`剩余抢占跨服富矿次数：${GD.role.HoleDayNum[4]}`
            color=ct.brown
        }
        this.buffInfo.string=str
        this.buffInfo.color.fromHEX(color)
    }
    buffHoleList:Array<outer_pb.IBuffHole>=[];
    getBuffHoleList=(type:number)=>{
        let req = outer_pb.HoleAct.create()
        req.Type=type
        let buff = outer_pb.HoleAct.encode(req).finish()
        WS.send(MT.GetBuffHoles,buff,(d:any)=>{
            let rsp=outer_pb.HoleAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                GD.role.HoleDayNum=rsp.HoleDayNum;
                if(rsp.BuffHoles.length>0){
                    this.renderBuffHole(rsp.BuffHoles)
                    this.buffHoleList=rsp.BuffHoles;
                    this.buffContent.active=true;
                }
                this.refreshSeizeNum(type)
            }else{
                UIMgr.I.tip('获取富矿失败')
            }
        })
    }
    renderBuffHole=(buffHoles:Array<outer_pb.IBuffHole>)=>{
        this.buffContent.children.forEach((node,index)=>{
            let hole = buffHoles[index];
            let name=''
            let color=ct.gray
            if(hole.TeamId>0){
                if(GD.role.data.TeamId==hole.TeamId){
                    name = '我的队伍'
                    color = ct.green
                }else{
                    name=hole.Owner
                    color = ct.red
                }
            }else{
                name = '-'
                color = ct.gray
            }
            let label = node.children[3].getComponent(Label)
            label.string=name
            label.color.fromHEX(color)
            node.children[5].active = hole.State==1;
        })
    }
    showNeedGold=()=>{
        let need=`需要：金币x${this.getNeed(0)}`
        this.getOtherBtn.children[1].getComponent(Label).string=need;
        this.nextBtn.children[1].getComponent(Label).string=need;
        let num = this.getNeed(1)
        if(num==0){
            need=`黄金卡免费`
        }else{
            need=`需要：金币x${num}\n(黄金卡免费)`
        }
        this.autoNextBtn.children[1].getComponent(Label).string=need;
    }
    onToggle=(toggle:Toggle)=>{
        let req = outer_pb.HoleAct.create()
        req.Type=toggle.isChecked?1:0
        let buff = outer_pb.HoleAct.encode(req).finish()
        WS.send(MT.SwitchHoleRandomMode,buff,(d:any)=>{
            let rsp=outer_pb.HoleAct.decode(d);
            GD.role.MyHole.IsRandom = rsp.Type==1?true:false;
            UIMgr.I.tip('更改成功',ct.green)
        })
    }
    lvExp = [8, 24, 56, 120, 248, 504, 1016, 2040, 4088, 8184]
    showSliderBox=(type:number,id:number,hole:outer_pb.IHole,name:string,color:ct)=>{
        this.clickedHoleType=type;
        this.gaoId=id
        const gao = GD.role.BagItems.find(item=>{return item.Id==id})
        let max=0
        if(gao){
            max=gao.Num;
        }
        const lv=hole.Lv;
        let curLvExp = hole.Exp
        if(lv>0){
            curLvExp = hole.Exp-this.lvExp[lv-1]
        }
        let lvExp:string;
        const lvMax = Math.pow(2,lv+3)
        const need = lvMax-curLvExp
        if(lv<10){
            let base = GD.ItemBaseDatas.get(id)
            lvExp=`${base.Name}：${curLvExp}/${lvMax}`
        }else{
            lvExp='满级'
        }
        if(need<max)max=need;
        let msg=`${name} Lv.${lv}<br/>(${lvExp})`
        UIMgr.I.PopView.showSliderBox(msg,color,max,'扩产',this.myKdGetExp)
    }
    clickedHoleType:number=0;
    gaoId:number=0;
    myKdGetExp=(num:number)=>{
        if(GD.role.hasEnoughItem(this.gaoId,num)){
            let req = outer_pb.HoleAct.create()
            req.Type=this.clickedHoleType;
            req.OpenNum=num;
            let buff = outer_pb.HoleAct.encode(req).finish()
            WS.send(MT.MyHoleGetExp,buff,(d:any)=>{
                let rsp = outer_pb.HoleAct.decode(d)
                if(rsp.ErrCode==Err.ErrCode_Success){
                    GD.role.MyHole=rsp.MyHole
                    GD.role.reduceItem(rsp.Item,rsp.OpenNum)
                    this.showMyHole();
                    UIMgr.I.tip('扩产成功',ct.green)
                }else{
                    UIMgr.I.tip('道具不足')
                }
            });
        }
    }
    collectMyHole=()=>{
        if(GD.role.data.IsYkMode==false||GD.role.hasBaseYk()){
            if(GD.role.HoleDayNum[0]>0){
                WS.send(MT.CollectMyHoleRemainInventory,GD.EmptyRequestBuff,(d:any)=>{
                    let rsp = outer_pb.HoleAct.decode(d)
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        GD.role.HoleDayNum=rsp.HoleDayNum
                        GD.role.MyHole=rsp.MyHole
                        if(rsp.Gold>0){
                            GD.role.addGold(rsp.Gold,true,'收取金矿')
                        }
                        if(rsp.Dia>0){
                            GD.role.addDia(rsp.Dia,true,'收取钻石矿')
                        }
                        if(rsp.Item>0){
                            GD.role.getItem(53,rsp.Item,true,true,'收取宝石矿')
                        }
                        this.showMyHole()
                        UIMgr.I.tip('收取成功',ct.green)
                    }else{
                        UIMgr.I.tip('收取失败')
                    }
                });
            }else{
                UIMgr.I.tip('今日剩余收取次数为0')
            }
        }
    }
    startLootOtherHole=()=>{
        if(GD.role.otherHole){
            WS.send(MT.StartLootOtherHole,GD.EmptyRequestBuff,(d:any)=>{
                let rsp = outer_pb.HoleAct.decode(d)
                if(rsp.ErrCode==Err.ErrCode_Success){
                    GD.role.otherHole.OpenNum=rsp.OpenNum
                    GD.role.HoleDayNum=rsp.HoleDayNum
                    GD.role.otherHole.IsLooting=true;
                    if(rsp.Item>0){
                        //钻石矿的库存改变了
                        let hole = GD.role.otherHole
                        hole.DiaHole.Num=rsp.Item;
                        this.renderKd(this.otherdiaKd,hole.DiaHole,hole.Up,1,true)
                    }
                    this.renfreshOpenNum(GD.role.otherHole)
                    UIMgr.I.tip('发起掠夺成功',ct.green)
                }else{
                    UIMgr.I.tip('发起掠夺失败')
                }
            });
        }
    }
    onStartLootOtherHole=(rsp:outer_pb.HoleAct)=>{
        GD.role.otherHole.OpenNum=rsp.OpenNum
        GD.role.HoleDayNum=rsp.HoleDayNum
        GD.role.otherHole.IsLooting=true;
        if(rsp.Item>0){
            //钻石矿的库存改变了
            let hole = GD.role.otherHole
            hole.DiaHole.Num=rsp.Item;
            this.renderKd(this.otherdiaKd,hole.DiaHole,hole.Up,1,true)
        }
        this.renfreshOpenNum(GD.role.otherHole)
    }
    useAllHoleOpenNum=()=>{
        if(GD.role.otherHole&&GD.role.hasGoldYk()){
            if(GD.role.otherHole.OpenNum==0){
                UIMgr.I.tip(HoleOpenNumOverInfo)
                return
            }
            //一键开完，随机
            WS.send(MT.UseAllHoleOpenNum,GD.EmptyRequestBuff,this.onOpenedGrids);
        }
    }
    onOpenedGrids=(d:any)=>{
        let rsp = outer_pb.HoleAct.decode(d)
        // console.log('onOpenedGrids',rsp)
        if(rsp.ErrCode==Err.ErrCode_Success||rsp.ErrCode==Err.ErrCode_ThisHoleGridIsOpenOver){
            let hole = GD.role.otherHole
            hole.Grids[rsp.Index]=rsp.Type
            hole.OpenNum=rsp.OpenNum
            rsp.GoldHole&&(hole.GoldHole=rsp.GoldHole)
            rsp.DiaHole&&(hole.DiaHole=rsp.DiaHole)
            rsp.ItemHole&&(hole.ItemHole=rsp.ItemHole)
            rsp.Reduce&&(hole.Reduce=rsp.Reduce)
            
            let has:boolean=false
            if(rsp.Gold>0){
                has=true
                GD.role.addGold(rsp.Gold,true,'找到了金矿存储点，')
                hole.getGold=rsp.Gold
            }
            if(rsp.Dia>0){
                has=true
                GD.role.addDia(rsp.Dia,true,'找到了钻石矿存储点，')
                hole.getDia=rsp.Dia
            }
            if(rsp.Item>0){
                has=true
                GD.role.getItem(53,rsp.Item,true,true,'找到了宝石矿存储点，')
                hole.getItem=rsp.Item
            }
            let hasXj:boolean=false;
            if(rsp.OpenedGrids){
                for(let k in rsp.OpenedGrids){
                    let i = parseInt(k)
                    this.openedGrids.set(i,1)
                    const t = rsp.OpenedGrids[k]
                    hole.Grids[i]=t
                    if(t==4)hasXj=true
                }
            }
            if(rsp.Type==4||hasXj){
                //踩到陷阱，提前结束
                UIMgr.I.tip('你踩到了陷阱，受到了严重伤害，无法继续开了')
                GameManager.I.playTipSound('sd0')
            }else if(has==false){
                UIMgr.I.tip('很遗憾没有开到存储点')
            }
            
            if(rsp.ErrCode==Err.ErrCode_ThisHoleGridIsOpenOver){
                hole.Grids.forEach((v,i)=>{
                    if(this.openedGrids.has(i)==false){
                        hole.Grids[i]=rsp.Grids[i]
                    }
                })
                hole.OpenNum=0
                this.openAll.active=false;
                // console.log('本次掠夺结束！',rsp.Grids)
                UIMgr.I.tip("本次掠夺结束！")
            }
            this.showOtherHole(false)
        }else{
            UIMgr.I.tip('打开失败'+rsp.ErrCode)
        }
    }
    openedGrids:Map<number,number>=new Map();
    openOtherGrid=(index:number)=>{
        if(GD.role.otherHole.Grids[index]!=9) return //表示已经开过了
        if(GD.role.otherHole.IsLooting){
            if(GD.role.otherHole.OpenNum==0){
                UIMgr.I.tip(HoleOpenNumOverInfo)
                return
            }
            this.openedGrids.set(index,1)
            let req = outer_pb.HoleAct.create()
            req.Index=index
            let buff = outer_pb.HoleAct.encode(req).finish()
            WS.send(MT.TryOpenOtherHoleGrid,buff,this.onOpenedGrids);
        }else{
            UIMgr.I.tip("请先发起掠夺")
        }
    }
    clickedGridIndex:number=-1;
    setMyGrid=(type:number)=>{
        if(this.clickedGridIndex>=0){
            let req = outer_pb.HoleAct.create()
            req.Index=this.clickedGridIndex
            req.Type=type
            let buff = outer_pb.HoleAct.encode(req).finish()
            WS.send(MT.ChangeMyHoleGrid,buff,(d:any)=>{
                let rsp = outer_pb.HoleAct.decode(d)
                // console.log('ChangeMyHoleGrid',rsp)
                if(rsp.ErrCode==Err.ErrCode_Success){
                    GD.role.MyHole.Grids=rsp.Grids
                    this.rendGrids(this.gridBox,rsp.Grids)
                    UIMgr.I.tip('更改成功',ct.green)
                }else{
                    UIMgr.I.tip('更改失败')
                }
            });
        }
    }
    getNeed=(type:number):number=>{
        let need=0
        if(type==0){
            need=GD.role.HoleDayNum[2]*GD.configs.get(ConfigType.GetRandomOtherHoleNeedGold)
        }else{
            if(GD.role.hasGoldYk(false)){
                need=0
            }else{
                need=10000
            }
        }
        return need
    }
    getOther=(type:number)=>{
        if(GD.role.MyHole){
            if(GD.role.otherHole&&GD.role.otherHole.OpenNum>0){
                UIMgr.I.tip('当前矿洞未掠夺完成')
                return;
            }
            if(GD.role.HoleDayNum[1]<=0){
                UIMgr.I.tip('今日剩余掠夺次数为0')
                return;
            }
            let need=this.getNeed(type)
            if(GD.role.hasEnoughGold(need)){
                let req = outer_pb.HoleAct.create()
                req.Type = type //是否是一键自动匹配（type==1）
                let buff = outer_pb.HoleAct.encode(req).finish()
                WS.send(MT.GetRandomOtherHole,buff,(d:any)=>{
                    let rsp = outer_pb.HoleAct.decode(d)
                    // console.log('GetRandomOtherHole',rsp)
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        this.openedGrids.clear()
                        const data = new OtherHole()
                        data.Sid=rsp.Sid
                        // data.Name=rsp.Name
                        data.Reduce=rsp.Reduce
                        data.Up=rsp.Up
                        data.GoldHole=rsp.GoldHole
                        data.DiaHole=rsp.DiaHole
                        data.ItemHole=rsp.ItemHole
                        data.OpenNum=rsp.OpenNum;
                        data.IsLooting=false;
                        data.Grids=[
                            9,9,9,9,9,//9代表未打开的格子，0、1、2、3表示打开过的明确知道的格子
                            9,9,9,9,9,
                            9,9,9,9,9,
                            9,9,9,9,9,
                            9,9,9,9,9,
                        ]
                        GD.role.otherHole=data;
                        GD.role.HoleDayNum=rsp.HoleDayNum;
                        rsp.Gold>0&&GD.role.reduceGold(rsp.Gold);
                        this.showOtherHole(true)
                        if(rsp.Type==2){
                            this.onStartLootOtherHole(rsp)
                        }else{
                            UIMgr.I.tip('发现新的矿洞',ct.green)
                        }
                    }else{
                        UIMgr.I.tip('获取矿洞失败')
                    }
                })
            }
        }
    }
    showMyHole=()=>{
        const hole=GD.role.MyHole;
        // console.log('showMyHole',hole)
        let up = hole.Up+hole.BuffUp+hole.KfBuffUp
        if(hole.GoldYk>Date.now()/1000){
            up+=0.5
        }
        this.rateRich.string=`产量提升<color=${ct.green}>${Math.round(up*10000)/100}%</>，被掠夺比例减少<color=${ct.red}>${Math.round(hole.Reduce*10000)/100}%</>`
        this.renderKd(this.goldKd,hole.GoldHole,up,0,false)
        this.renderKd(this.diaKd,hole.DiaHole,up,1,false)
        this.renderKd(this.itemKd,hole.ItemHole,up,2,false)
        this.rendGrids(this.gridBox,hole.Grids)
        this.toggle.isChecked = hole.IsRandom;
        this.toggle.node.on('toggle',this.onToggle)
        let delta = (Date.now()/1000>>0)-hole.LastGetTime
        if(delta>=86400){
            //60*60*24
            delta=86400
        }
        this.time.string=`距离上次收取：${Tools.getDeltaTimeString(delta)}`
        this.getNum.string=`今日剩余收取次数：${GD.role.HoleDayNum[0]}`
    }
    showOtherHole=(clear:boolean)=>{
        if(GD.role.otherHole){
            this.getOtherBtn.active=false;
            this.otherBox.active=true;
            const hole=GD.role.otherHole;
            let name:string=''
            let color=ct.brown
            if(hole.Sid!=''){
                name=`s${hole.Sid}-???`
            }else{
                name='系统野生矿'
                color=ct.red
            }
            this.otherRich.string=`矿主：<color=${color}>${name}</>，被掠夺比例减少<color=${ct.red}>${(hole.Reduce*10000>>0)/100}%</>`
            this.renderKd(this.otherGoldKd,hole.GoldHole,hole.Up,0,true,clear)
            this.renderKd(this.otherdiaKd,hole.DiaHole,hole.Up,1,true,clear)
            this.renderKd(this.otherItemKd,hole.ItemHole,hole.Up,2,true,clear)
            this.rendGrids(this.otherGridBox,hole.Grids,true)
            this.renfreshOpenNum(hole)
        }else{
            this.getOtherBtn.active=true;
            this.otherBox.active=false;
        }
        this.showNeedGold();
    }
    renfreshOpenNum=(hole:OtherHole)=>{
        if(hole.IsLooting){
            this.openAll.active=this.openNum.node.active=true
            this.ldNum.node.active=this.ldBtn.active=false;
            this.openNum.string=`点击格子尝试找到库存存放点，剩余打开次数：${hole.OpenNum}`
        }else{
            this.openAll.active=this.openNum.node.active=false;
            this.ldBtn.active=this.ldNum.node.active=true;
            this.ldNum.string=`今日剩余掠夺次数：${GD.role.HoleDayNum[1]}`
        }
    }
    rendGrids=(node:Node,grids:Array<number>,isOther:boolean=false)=>{
        node.children.forEach((cell,index)=>{
            let n = grids[index]
            let skin = cell.children[0].getComponent(Sprite)
            if(n==0){
                skin.spriteFrame=null
            }else{
                let id:number
                if(n==1){
                    id=1
                }else if(n==2){
                    id=2
                }else if(n==3){
                    id=52
                }else if(n==4){
                    //陷阱
                    id=0
                }else{
                    id=501
                }
                Tools.loadSpriteFrame(`ui/item/${id}`,GD.commonBundle).then(sp=>{
                    if(sp) skin.spriteFrame=sp;
                })
            }
            if(isOther){
                let bg='item_gray'
                if(this.openedGrids.has(index)){
                    bg='item_blue'
                }
                Tools.loadSpriteFrame(`muui/${bg}`,resources).then(sp=>{
                    if(sp) cell.getComponent(Sprite).spriteFrame=sp;
                })
            }
        })
    }
    renderKd=(noe:Node,hole:outer_pb.IHole,up:number,type:number,isOther:boolean,clear:boolean=false)=>{
        let nameLabel = noe.children[0].getComponent(Label)
        let perLabel = noe.children[1].getComponent(Label)
        let numLabel = noe.children[3].getComponent(Label)
        const lv = hole.Lv
        let name:string
        let list:Array<number>;
        if(type==0){
            name=`【金矿 Lv.${lv}】`
            list=this.goldHolePers2
            if(GD.role.data.IsYkMode){
                list=this.goldHolePers
            }
        }else if(type==1){
            name=`【钻石矿 Lv.${lv}】`
            list=this.diaHolePers2
            if(GD.role.data.IsYkMode){
                list=this.diaHolePers
            }
        }else{
            name=`【宝石矿 Lv.${lv}】`
            list=this.itemHolePers2
            if(GD.role.data.IsYkMode){
                list=this.itemHolePers
            }
        }
        nameLabel.string=name

        let a = list[lv]*(1+up)>>0;
        let after=''
        if(a>=10000){
            a=(a/100>>0)/100
            after='万'
        }
        perLabel.string = `产量：${a}${after}/小时`

        a = hole.Num
        after=''
        if(a>=10000){
            a=(a/100>>0)/100
            after='万'
        }
        numLabel.string = `库存：${a}${after}`
        if(isOther){
            numLabel = noe.children[4].getComponent(Label)
            let str=''
            if(clear==false){
                let getNum=0
                let hole = GD.role.otherHole
                if(type==0){
                    getNum=hole.getGold
                }else if(type==1){
                    getNum=hole.getDia
                }else{
                    getNum=hole.getItem
                }
                if(getNum>=10000){
                    str=`夺得：${(getNum/100>>0)/100}万`
                }else if(getNum>0){
                    str=`夺得：${getNum}`
                }
            }
            numLabel.string=str
        }
    }
    showHis=()=>{
        let arr=[]
        if(GD.role.MyHole){
            arr = GD.role.MyHole.History
        }
        this.hisList.array=arr
    }
    tryRegistHole=()=>{
        if(GD.role.MyHole==null){
            if(GD.role.canPlay()){
                if(GD.role.hasEnoughLv(GD.configs.get(ConfigType.ActiveLv_Hole))){
                    WS.send(MT.RegisterHole,GD.EmptyRequestBuff,(d:any)=>{
                        let rsp = outer_pb.HoleAct.decode(d)
                        // console.log('tryRegistHole',rsp)
                        if(rsp.ErrCode==Err.ErrCode_Success){
                            GD.role.MyHole=rsp.MyHole
                            GD.role.HoleDayNum=rsp.HoleDayNum
                            this.tab.node.active=true;
                            this.tab.select(0)
                            UIMgr.I.tip('注册成功',ct.green)
                        }else{
                            UIMgr.I.tip('注册失败')
                        }
                    })
                }
            }
        }
    }
    getHis=()=>{
        if(GD.role.MyHole){
            WS.send(MT.GetHoleHis,GD.EmptyRequestBuff,(d:any)=>{
                let rsp = outer_pb.HoleAct.decode(d)
                // console.log('getHis',rsp)
                if(rsp.ErrCode==Err.ErrCode_Success){
                    this.hisList.array = rsp.History
                }else{
                    UIMgr.I.tip('获取记录失败')
                }
            })
        }
        GD.playClickSound()
    }
    getMyHole=()=>{
        WS.send(MT.GetMyHole,GD.EmptyRequestBuff,(d:any)=>{
            let rsp = outer_pb.HoleAct.decode(d)
            // console.log('getMyHole',rsp)
            if(rsp.ErrCode==Err.ErrCode_Success){
                GD.role.MyHole = rsp.MyHole;
                GD.role.HoleDayNum = rsp.HoleDayNum;
                this.showMyHole();
            }else{
                this.getHisBtn.active=this.tab.node.active = false
                this.view.selectedIndex = 4
            }
        })
    }
    initData(data: any): void {
        let npc=GD.npc_list.get(41);
        this.npcName.string = npc.Name;
        this.msgLabel.string = npc.Msg[0];

        let index=0
        if(data!==null&&data>=0){
            index=data
        }
        this.tab.select(index)
        // console.log('holePage.initData',GD.role.MyHole)
        // if(GD.role.MyHole){
        //     let index=0
        //     if(data!==null&&data>=0){
        //         index=data
        //     }
        //     this.tab.select(index)
        // }else{
        //     this.view.node.active=this.getHisBtn.active=this.tab.node.active = false
        //     WS.send(MT.GetMyHole,GD.EmptyRequestBuff,(d:any)=>{
        //         let rsp = outer_pb.HoleAct.decode(d)
        //         // console.log('onEnable GetMyHole',rsp)
        //         this.view.node.active=true
        //         if(rsp.ErrCode==Err.ErrCode_Success){
        //             //先设置tab，防止多发一次GetMyHole请求
        //             this.tab.node.active = true
        //             let index=0
        //             if(data!==null&&data>=0){
        //                 index=data
        //             }
        //             this.tab.select(index)

        //             GD.role.MyHole = rsp.MyHole;
        //             GD.role.HoleDayNum = rsp.HoleDayNum;
        //             this.showMyHole();
        //         }else{
        //             this.view.selectedIndex = 4
        //         }
        //     })
        // }
        // WS.cbs.set(MT.UseAllHoleOpenNum,this.onOpenedGrids)
    }
    onHide(): void {
        this.toggle.node.off('toggle')
    }
}


