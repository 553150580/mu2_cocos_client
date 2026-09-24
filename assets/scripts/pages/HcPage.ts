import { _decorator,  EventTouch,  Label, Node, randomRange, RichText, Toggle } from 'cc';
import { List } from '../UiComps/List';
import { BasePage } from './BasePage';
import {  BodyType, ct,   EquipType,  HcData } from '../base/types';
import GD from '../base/GameData';
import Tools from '../base/tools';
import { UIMgr } from '../managers/UIMgr';
import { ShowItemType } from './PopView';
import WS from '../base/net';
import { Err, MT } from '../base/MT';
import { ViewStack } from '../UiComps/ViewStack';
import { Tab } from '../UiComps/Tab';
import GameManager from '../managers/GameManager';
import { RichTextHandler } from '../UiComps/RichTextHandler';
const { ccclass, property } = _decorator;
 
@ccclass('HcPage')
export class HcPage extends BasePage {
    @property(Node)
    openHis:Node
    @property(List)
    hisList:List
    @property(Label)
    npcName:Label
    @property(Label)
    msgLabel:Label
    @property(List)
    menuList:List
    @property(ViewStack)
    view:ViewStack
    @property(RichText)
    need1:RichText
    @property(List)
    need1List:List
    @property(Node)
    add1Btn:Node
    @property(Label)
    need2:Label
    @property(List)
    need2List:List
    @property(Node)
    add2Btn:Node
    @property(Node)
    yjAdd2Btn:Node
    @property(List)
    need3List:List
    @property(Node)
    addLuckBtn:Node
    @property(Node)
    reduceLuckBtn:Node
    @property(Label)
    luckNum:Label
    @property(Node)
    hcBtn:Node
    @property(Label)
    hcRate:Label
    @property(Label)
    luckInfo2:Label
    @property(Toggle)
    baoHuToggle:Toggle
    @property(Tab)
    baoHuTab:Tab
    // @property(Toggle)
    // autoAddZyToggle:Toggle
    @property(Label)
    baoHuPrice:Label
    @property(Tab)
    numTab:Tab
    @property(Node)
    fbTypeBtns:Node
    @property(Toggle)
    xsToggle:Toggle
    @property(Tab)
    xsLvTab:Tab
    @property(Toggle)
    emToggle:Toggle
    @property(Tab)
    emLvTab:Tab

    hcColorType:Array<ct>=[ct.white,ct.blue,ct.blue,ct.blue,ct.blue,ct.purple,ct.blue,ct.yellow,
        ct.purple,ct.purple,ct.purple,ct.purple,ct.green,ct.purple,ct.red,ct.red,ct.red,ct.qing,ct.qing,ct.green,ct.green,ct.purple
    ]
    nums=[1,10,50,100]
    addLuckNum:number=0;
    hcType:number;
    static I:HcPage
    onLoad(): void {
        HcPage.I=this;
        super.onLoad();
        this.menuList.cellRender = (node:Node,index:number)=>{
            let menu:HcData = this.menuList.array[index]
            let label=node.children[0].getComponent(Label)
            label.string=menu.Name
            label.color.fromHEX(this.hcColorType[index])
        }
        this.menuList.selectedHandler = this.selectHcType
        this.menuList.array=GD.hcDatas;
        this.addLuckBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.addLuckNum<10&&this.curRate+this.addLuckNum<100){
                let has:boolean=true
                let bagItem = GD.role.BagItems.find(i=>{return i.Id==616})
                if(bagItem){
                    let rate=1
                    if(this.numTab.node.active){
                        rate=this.nums[this.numTab.selectedIndex]
                    }
                    if(bagItem.Num<(this.addLuckNum+1)*rate){
                        has=false
                    }
                }else{
                    has=false
                }
                if(has==false){
                    UIMgr.I.tip('数量不足')
                    return
                }
                this.addLuckNum++
                this.refreshLunckNum()
                this.refreshHcRate()
                GD.playClickSound();
            }
        },this);
        this.reduceLuckBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.addLuckNum>0){
                this.addLuckNum--
                this.refreshLunckNum()
                this.refreshHcRate()
                GD.playClickSound();
            }
        },this);
        this.hisList.cellRender = (node:Node,index:number)=>{
            let info:string = this.hisList.array[index]
            let color=ct.green
            if(info.includes("失败")){
                color=ct.red
            }
            let rich=node.children[0].getComponent(RichText)
            rich.string=`<color=${color}>${info}</>`
        }
        this.openHis.on(Node.EventType.TOUCH_END,()=>{
            //获取合成记录
            WS.send(MT.GetHcHisList,GD.EmptyRequestBuff,(d:any)=>{
                let rsp=outer_pb.HcAct.decode(d)
                if(rsp.ErrCode=Err.ErrCode_Success){
                    this.view.selectedIndex=2
                    this.hisList.array=rsp.DelUids.reverse();
                }
            })
        },this);
        this.add1Btn.on(Node.EventType.TOUCH_END,()=>{
            if(this.need1List.array.length<GD.hcDatas[this.hcType].Max1){
                UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler1,this.bagEquipFilter1)
            }
        },this);
        this.add2Btn.on(Node.EventType.TOUCH_END,()=>{
            let hcData=GD.hcDatas[this.hcType]
            if(hcData.Max1>0&&this.need1List.array.length==0){
                UIMgr.I.tip('请先添加主装备')
                return
            }
            if(this.need2List.array.length<hcData.Max2){
                UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler2,this.bagEquipFilter2)
            }
        },this);
        this.yjAdd2Btn.on(Node.EventType.TOUCH_END,this.onYjAdd2)
        this.hcBtn.on(Node.EventType.TOUCH_END,this.doHc,this);
        this.need1List.cellRender= (node:Node,index:number)=>{
            this.renderCell(node,index,this.need1List)
        }
        this.need1List.selectedHandler = (node:Node,index:number)=>{
            let data = this.need1List.array[index]
            let t = this.hcType==0?ShowItemType.Item:ShowItemType.Equip
            UIMgr.I.PopView.show(0,data,false,t,'取消',(d:outer_pb.IEquip)=>{
                this.need1List.deleteOne(index)
                this.switchBtn1Show()
                this.changeHcRateAndNeeds()
                GD.playGetItemSound()
            })
        }
        this.need2List.cellRender= (node:Node,index:number)=>{
            this.renderCell(node,index,this.need2List)
        }
        this.need2List.selectedHandler = (node:Node,index:number)=>{
            let data = this.need2List.array[index]
            UIMgr.I.PopView.show(0,data,false,ShowItemType.Equip,'取消',(d:outer_pb.IEquip)=>{
                this.need2List.deleteOne(index)
                this.switchBtn2Show()
                this.changeHcRateAndNeeds()
                GD.playGetItemSound()
            })
        }
        this.need3List.cellRender= (node:Node,index:number)=>{
            let label=node.children[0].getComponent(Label)
            let item:Array<number>=this.need3List.array[index]
            let id = item[0]
            let num = item[1]
            let base = GD.ItemBaseDatas.get(id)
            let rate = 1
            if(this.numTab.node.active){
                rate=this.nums[this.numTab.selectedIndex]
            }
            num*=rate;
            let color = Tools.getItemColor(id)
            let hasNum=''
            if(GD.role.hasEnoughItem(id,num,false)==false){
                hasNum='（不足）'
                color=ct.red
            }
            label.string=`${base.Name} x${num}${hasNum}`
            label.color.fromHEX(color)
        }
        this.xsLvTab.selectedHandler=(node:Node,index:number)=>{
            this.resetXsLvToggle(index)
            this.resetEmLvToggle(-1)
            this.fbLv=index+1
            this.fbType=0
            this.changeHcRateAndNeeds()
            GD.playClickSound();
        }
        this.emLvTab.selectedHandler=(node:Node,index:number)=>{
            this.resetEmLvToggle(index)
            this.resetXsLvToggle(-1)
            this.fbLv=index+1
            this.fbType=1
            this.changeHcRateAndNeeds()
            GD.playClickSound();
        }
        this.baoHuToggle.node.on('toggle',(toggle:Toggle)=>{
            if(toggle.isChecked){
                if(this.canHc()==false){
                    toggle.isChecked=false
                    UIMgr.I.tip('道具不足')
                }else{
                    this.baoHuTab.select(0)
                    this.changeHcRateAndNeeds()
                }
            }
            this.refreshHcRate()
        })
        this.baoHuTab.selectedHandler=(node,index)=>{
            this.changeHcRateAndNeeds()
            GD.playClickSound();
        }
        this.numTab.selectedHandler=this.onNumTabSelected
        this.numTab.selectedIndex=0
    }
    onNumTabSelected=(node:Node,index:number)=>{
        this.need3List.refresh()
        if(this.addLuckNum>0){
            let rate=this.nums[this.numTab.selectedIndex]
            if(GD.role.hasEnoughItem(616,this.addLuckNum*rate)==false){
                this.addLuckNum=0
                UIMgr.I.tip('幸运符不足，重置为0')
            }
            this.refreshHcRate();
            this.refreshLunckNum();
        }
        GD.playClickSound();
    }
    canHc():boolean{
        let n=this.need3List.array.length;
        if(n==0){
            return false
        }else{
            for(let i=0;i<n;i++){
                let value=this.need3List.array[i]
                let id = value[0]
                let num = value[1]
                let rate = 1
                if(this.numTab.node.active){
                    rate=this.nums[this.numTab.selectedIndex]
                }
                if(GD.role.hasEnoughItem(id,num*rate,false)==false){
                    return false
                }
            }
        }
        let type=this.hcType
        let hcData = GD.hcDatas[type]
        if(this.need1List.array.length<hcData.Max1) return false
        //合成玛雅武器、卓越叠加、套装进阶、翅膀叠加、武器技能升级需要至少1件材料装备
        if((type==1||type==12||type==15||type==21)&&this.need2List.array.length==0) return false 
        return true
    }
    fbType:number=-1
    fbLv:number=1
    doHc(){
        if(this.canHc()){
            let req=outer_pb.HcAct.create()
            req.Type = this.hcType
            req.FbLv=this.fbLv;
            if(this.need1List.array.length>0){
                this.need1List.array.forEach(e=>{
                    req.Uids1.push(e.Uid)
                })
            }
            if(this.need2List.array.length>0){
                this.need2List.array.forEach(e=>{
                    req.Uids2.push(e.Uid)
                })
            }
            if(req.Type==0||req.Type==13||req.Type==17||req.Type==18||req.Type==19||req.Type==20){
                req.HcNum=this.nums[this.numTab.selectedIndex]
            }
            const bhType=this.baoHuTab.selectedIndex
            req.BaoHuType=this.baoHuToggle.isChecked?(bhType>=0?bhType+1:0):0;
            req.FbType=this.fbType;
            req.LuckNum=this.addLuckNum;
            if(this.bodyType) req.BodyType=this.bodyType;
            let buf=outer_pb.HcAct.encode(req).finish()
            WS.send(MT.DoHc,buf,this.onDoHc)
        }else{
            UIMgr.I.tip('道具不足')
        }
    }
    onDoHc=(d:any)=>{
        let rsp=outer_pb.HcAct.decode(d)
        if(rsp.ErrCode==Err.ErrCode_NotEnoughItem){
            UIMgr.I.tip('所需道具不足')
        }else if(rsp.ErrCode==Err.ErrCode_CanNotHeCheng){
            UIMgr.I.tip('无法合成')
        }else{
            if(rsp.DelItems){
                for(let i in rsp.DelItems){
                    let id = parseInt(i)
                    let num = rsp.DelItems[i]
                    GD.role.reduceItem(id,num)
                }
            }
            if(rsp.DelUids.length>0){
                rsp.DelUids.forEach(uid=>{
                    GD.role.tryDeleteBagEquip(uid)
                })
                if(rsp.BodyType>BodyType.None){
                    let equip=GD.role.BodyEquips[rsp.BodyType]
                    if(equip&&rsp.DelUids.findIndex(uid=>{return uid==equip.Uid})>-1){
                        GD.role.BodyEquips[rsp.BodyType]=null
                        // if(equip.TzLv>0)GD.role.resetTzPros()
                    }
                }
            }
            if(rsp.NewItems){
                GD.role.getItems(rsp.NewItems,true)
            }
            
            if(rsp.NewEquip){
                if(rsp.BodyType>BodyType.None){
                    GD.role.BodyEquips[rsp.BodyType]=rsp.NewEquip
                    if(rsp.NewEquip.TzLv>0)GD.role.resetTzPros()
                }else{
                    if(GD.role.tryDeleteBagEquip(rsp.NewEquip.Uid)){
                        //更新了旧装备的属性，用新的替换旧的
                        GD.role.BagEquips.push(rsp.NewEquip)
                    }else{
                        //合成出一件新的装备
                        GD.role.getEquip(rsp.NewEquip,true)
                    }
                }
            }
            if(rsp.BasePros){
                UIMgr.I.resetRoleBasePros(rsp.BasePros)
            }
            if(rsp.Type==0||rsp.Type==13||rsp.Type==17||rsp.Type==18){
                //门票、果实
               this.onNumTabSelected(null,0)
            }else{
                let equip1:outer_pb.IEquip;
                let equip2:outer_pb.IEquip;
                let bodyType=BodyType.None;
                if(rsp.BaoHuType>0){
                    if(rsp.ErrCode==Err.ErrCode_Failed){
                        if(rsp.Type==2||rsp.Type==3||rsp.Type==4||rsp.Type==5||rsp.Type==7||rsp.Type==12||rsp.Type==14||rsp.Type==16){
                            if(rsp.NewEquip){
                                //强化+10-15失败时，装备强化等级退回+9了，需要更新
                                equip1=rsp.NewEquip
                            }else{
                                equip1=this.need1List.array[0]
                            }
                            bodyType=rsp.BodyType
                        }
                        if(rsp.Type==12){
                            //叠加失败时，开启了保护，则保留equip2
                            equip2=this.need2List.array[0]
                        }
                    }else{
                        if(rsp.Type==7||rsp.Type==12){
                            //成功时，强化、叠加才继续显示equip1
                            if(rsp.NewEquip){
                                //强化+10-15失败时，装备强化等级退回+9了，需要更新
                                equip1=rsp.NewEquip
                            }else{
                                equip1=this.need1List.array[0]
                            }
                            bodyType=rsp.BodyType
                        }
                    }
                }else if(rsp.Type==12||rsp.Type==14||rsp.Type==15||rsp.Type==16||rsp.Type==19||rsp.Type==20){
                    //叠加、套装合成、套装进阶、大天使套装合成进阶时，无论成功与否，主道具都继续保留
                    if(rsp.NewEquip){
                        //强化+10-15失败时，装备强化等级退回+9了，需要更新 
                        equip1=rsp.NewEquip
                    }else{
                        equip1=this.need1List.array[0]
                    }
                    bodyType=rsp.BodyType
                }
                //刷新重置所有
                this.showHcView(equip1,equip2,bodyType,rsp.BaoHuType,rsp.LuckNum) 
            }
            if(rsp.ErrCode==Err.ErrCode_Success){
                UIMgr.I.tip('合成成功',ct.green,true)
            }else{
                UIMgr.I.tip('合成失败')
            }
            // if(this.autoAddZyToggle.isChecked){
            //     let equip:outer_pb.IEquip
            //     if(rsp.Type==18){
            //         //自动添加+4以上卓越装备，用于抽取荧光宝石
            //         equip=GD.role.BagEquips.find(equip=>{
            //             let et = equip.Id/10000>>0
            //             return et<EquipType.Wing&&equip.ZyList.length>0&&equip.IsLock==false&&et!=EquipType.Ring&&et!=EquipType.Neck&&equip.QhLv>=4&&equip.TzLv==0
            //         })
            //     }
            //     if(equip){
            //         this.addOneNeed1Equip(equip)
            //     }
            // }
        }
    }
    curRate:number=0
    refreshHcRate(){
        let r=1
        let baoHuAddRate=0
        //开启保护时，幸运符加成概率从1%变成2%
        if(this.baoHuToggle.isChecked){
            r=2
            if(this.baoHuTab.selectedIndex==0){
                baoHuAddRate=10
            }else{
                baoHuAddRate=15
            }
        }
        this.luckInfo2.string=`最多10个，每个加${r}%成功率`
        this.hcRate.string=`成功率：${this.curRate + baoHuAddRate + this.addLuckNum*r}%`
    }
    changeHcRateAndNeeds=()=>{
        let hcData = GD.hcDatas[this.hcType];
        const type=this.hcType
        let rate=0
        let items:Array<Array<number>>=[];
        let needGold:number=0
        let hcLv:number=1;
        if(type==0){
            //门票
            if(this.fbType>=0){
                needGold=this.fbLv*hcData.Gold
                if(this.fbType==0){
                    items=[[600,1],[2000+this.fbLv,1],[2100+this.fbLv,1]]
                }else{
                    items=[[600,1],[2200+this.fbLv,1],[2300+this.fbLv,1]]
                }
                rate = 100-10*(this.fbLv-1)
            }
        }else if(type==7){
            //强化+10~15
            if(this.need1List.array.length>0){
                let equip=this.need1List.array[0]
                //40、35、30、25、20、15
                rate = 40-(equip.QhLv-9)*5 + equip.LuckyLv*5
                hcLv = equip.QhLv-8
                items = [[600,1],[601,hcLv],[602,hcLv]]
                needGold=hcLv*hcData.Gold
            }
        }else{
            items = Array.from(hcData.Needs)
            needGold = hcData.Gold
            if(type==8||type==9||type==10||type==11||type==13){
                //勋章、恶魔、天使、炎狼、果实合成
                rate=20
            }else if(type==1||type==2){
                //玛雅武器、1代翅膀合成
                this.need2List.array.forEach(equip=>{
                    let base = GD.EquipBaseDatas.get(equip.Id)
                    const zj = equip.ZjLv/4>>0
                    rate += equip.QhLv*((Math.min(147,base.DropLv)/10+1)/2) + zj*zj
                })
                if(type==2&&this.need1List.array.length==1){
                    let maya=this.need1List.array[0]
                    const zj = maya.ZjLv/4>>0
                    rate += maya.QhLv*maya.QhLv + zj*zj + maya.LuckyLv*5
                }
                rate = Math.min(100,rate)
                needGold = (rate>>0)*hcData.Gold
            }else if(type==3||type==4){
                //2代翅膀合成
                if(this.need1List.array.length>0){
                    let wing=this.need1List.array[0]
                    const zj = wing.ZjLv/4>>0
                    rate += 10 + wing.QhLv*wing.QhLv/2 + zj*zj + wing.LuckyLv*5
                }
                if(this.need2List.array.length==1){
                    let equip=this.need2List.array[0]
                    let base = GD.EquipBaseDatas.get(equip.Id)
                    const zj = equip.ZjLv/4>>0
                    rate += equip.QhLv*((Math.min(147,base.DropLv)/10+1)/2) + zj*zj
                }
                rate = Math.min(hcData.MaxRate,rate)
                needGold = (rate>>0)*hcData.Gold
            }else if(type==5){
                //神鹰之羽合成
                if(this.need1List.array.length>0){
                    let wing=this.need1List.array[0]
                    let n = wing.QhLv-8
                    const zj = wing.ZjLv/4>>0
                    rate = 10 + n*n + zj*zj + wing.LuckyLv*5
                }
            }else if(type==6){
                //3代合成
                rate = 10
                this.need2List.array.forEach(equip=>{
                    const zj = equip.ZjLv/4>>0
                    let base = GD.EquipBaseDatas.get(equip.Id)
                    rate += (equip.QhLv-8)*((Math.min(147,base.DropLv)/10+1)/2) + zj*zj
                })
            }else if(type==12){
                //卓越叠加、翅膀叠加
                if(this.need1List.array.length>0){
                    let equip:outer_pb.IEquip=this.need1List.array[0]
                    rate = 5 + equip.LuckyLv
                    //保护价格
                    hcLv=3 //武器、项链需要30点
                    const et = equip.Id/10000>>0;
                    if(et==EquipType.Pet){
                        hcLv=5 //宠物需要50点
                    }else if(et == EquipType.Wing){
                        let base = GD.EquipBaseDatas.get(equip.Id)
                        if(base){
                            hcLv=base.EquipLv*2
                        }
                    }
                }
            }else if(type==14||type==16){
                //套装合成、大天使套装合成
                if(this.need1List.array.length>0){
                    let equip:outer_pb.IEquip=this.need1List.array[0]
                    rate = 10 + equip.LuckyLv*3
                }
            }else if(type==15){
                rate = 100
            }else if(type==17){
                rate = 10
                // if(this.need1List.array.length>0){
                //     let equip:outer_pb.IEquip=this.need1List.array[0]
                //     const zj = equip.ZjLv/4>>0
                //     let base = GD.EquipBaseDatas.get(equip.Id)
                //     rate = 10 + (base.DropLv/25>>0) + equip.QhLv + zj + equip.LuckyLv
                // }
            }else if(type==18){
                rate = 20
                // if(this.need1List.array.length>0){
                //     let equip:outer_pb.IEquip=this.need1List.array[0]
                //     const zj = equip.ZjLv/4>>0
                //     const n = equip.QhLv-4
                //     let base = GD.EquipBaseDatas.get(equip.Id)
                //     rate = 10 + base.DropLv*2/10 + n*n + zj*zj + equip.LuckyLv*2
                // }
            }else if(type==19||type==20){
                rate = 100
            }else if(type==21){
                let equip:outer_pb.IEquip=this.need1List.array[0]
                if(equip){
                    let lv=0
                    if(equip.Data){
                        lv=equip.Data[5]||0
                    }
                    rate = Math.max(10,100-lv*10)+ equip.LuckyLv
                }
            }
        }
        if(needGold>0){
            items.push([14,needGold])
        }
        this.need3List.array=items
        rate = Math.min(hcData.MaxRate,rate)
        this.curRate=(rate*10>>0)/10
        this.refreshHcRate()
        //updateBaoHuPrice
        let priceStr=''
        let priceColor=ct.qing;
        if(hcData.BHPrice>0){
            let price=0
            if(this.hcType==7||this.hcType==12){
                if(this.need1List.array.length==0){
                    price=0
                }else{
                    price=hcData.BHPrice*hcLv
                }
            }else{
                price=hcData.BHPrice
            }
            if(this.baoHuTab.selectedIndex==0){
                //钻石保护
                priceStr = `（需要：钻石x${price*(10000/this.diaPrice>>0)}）`
            }else{
                priceStr = `（需要：点数x${price}）`
                priceColor=ct.brown
            }
        }
        this.baoHuPrice.string= priceStr
        this.baoHuPrice.color.fromHEX(priceColor)
        
        this.baoHuToggle.node.active=hcData.BHPrice>0
        // this.autoAddZyToggle.node.active = type==18; //type==17||type==18
    }
    refreshLunckNum=()=>{
        let rate = 1
        if(this.numTab.node.active){
            rate=this.nums[this.numTab.selectedIndex]
        }
        this.luckNum.string=`添加幸运符：${this.addLuckNum*rate}个`
    }
    resetXsLvToggle(index:number){
        let s='血色城堡'
        let color=ct.white
        if(index>=0){
            s=`血色${index+1}层`
            color=ct.green
        }
        let label=this.xsToggle.node.children[1].getComponent(Label)
        label.string=s
        label.color.fromHEX(color)
        this.xsToggle.isChecked=false;
    }
    resetEmLvToggle(index:number){
        let s='恶魔广场'
        let color=ct.white
        if(index>=0){
            s=`恶魔${index+1}层`
            color=ct.green
        }
        let label=this.emToggle.node.children[1].getComponent(Label)
        label.string=s
        label.color.fromHEX(color)
        this.emToggle.isChecked=false;
    }
    switchBtn1Show=()=>{
        let max1=GD.hcDatas[this.hcType].Max1
        this.add1Btn.active=max1>0&&this.need1List.array.length<max1
    }
    bagEquipSelectedHandler1 = (node:Node,index:number,self:any)=>{
        self.hide()
        let data:outer_pb.IEquip =self.bagList.array[index]
        UIMgr.I.PopView.show(0,data,false,ShowItemType.Equip,'选择',this.addOneNeed1Equip,()=>{
            UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler1,this.bagEquipFilter1)
        })
    }
    addOneNeed1Equip=(equip:outer_pb.IEquip)=>{
        this.need1List.addOne(equip)
        this.switchBtn1Show()
        this.changeHcRateAndNeeds()
        this.bodyType = BodyType.None
        GD.playGetItemSound()
    }
    //从锻造按钮组中直接进入合成界面，设置是否为身体上的装备还是背包装备
    bodyType:BodyType=BodyType.None
    
    bagEquipSelectedHandler2 = (node:Node,index:number,self:any)=>{
        self.hide()
        let data:outer_pb.IEquip =self.bagList.array[index]
        UIMgr.I.PopView.show(0,data,false,ShowItemType.Equip,'选择',this.onSelected2Equip,()=>{
            UIMgr.I.PopView.showBagEquipByFilter(this.bagEquipSelectedHandler2,this.bagEquipFilter2)
        })
    }
    bagEquipFilter1 = (eq:outer_pb.IEquip)=>{
        const type=this.hcType;
        if(type==21){
            let lv=0
            if(eq.Data){
                lv=eq.Data[5]||0
            }
            return eq.SkillId>0&&eq.QhLv>=9&&lv<20
        }
        if(eq.IsLock)return false //排除锁定的装备、套装
        if(type==14){
            if(eq.TzLv>0)return false //合成套装时，必须非套装
        }
        if((type==15||type==16)&&eq.TzLv==0){
            return false //套装进阶时，必须为套装
        }
        if(this.need1List.array.findIndex(e=>{return e.Uid==eq.Uid})>-1)return false
        let hcData=GD.hcDatas[type]
        if(hcData.Max2>0&&this.need2List.array.findIndex(e=>{return e.Uid==eq.Uid})>-1)return false
        let et = eq.Id/10000>>0
        if(type>1){
            if(type==2){
                //+4追4玛雅武器（1代翅膀合成）
                return (eq.Id==80008||eq.Id==80114||eq.Id==80243)&&eq.QhLv>=4&&eq.ZjLv>=4
            }else if(type==3||type==4){
                //1代翅膀（2代翅膀合成）
                return et==EquipType.Wing&&eq.Id<200100;
            }else if(type==5){
                //+9追4 2代翅膀（神鹰之羽合成）
                return et==EquipType.Wing&&eq.QhLv>=9&&eq.ZjLv>=4&&eq.Id>=200101&&eq.Id<200200;
            }else if(type==7){
                //+9以上装备（强化+10~15）
                return et<EquipType.Pet&&eq.QhLv>=9&&eq.QhLv<15
            }else if(type==12){
                //+9追4装备卓越武器、项链、宠物（卓越属性叠加）
                if(et==EquipType.Pet){
                    return eq.ZyList.length<9; //宠物
                }else if(et==EquipType.Wing){
                    return eq.QhLv>=9&&eq.ZjLv>=4&&eq.Id>=200001&&eq.ZyList.length<9
                }else if(eq.ZyList.length>0&&eq.ZyList.length<6&&eq.QhLv>=9&&eq.ZjLv>=4){
                    return et==EquipType.Weapon||et==EquipType.JianTong||et==EquipType.Neck||et==EquipType.ZHBook
                }else{
                    return false
                }
            }else if(type==14){
                //套装合成：需要+15追4以上卓越装备
                return et<EquipType.Wing&&eq.QhLv>=15&&eq.ZjLv>=4&&eq.ZyList.length>0&&eq.TzLv==0
            }else if(type==15||type==16){
                //套装进阶、大天使套装属性合成：需要套装
                return eq.TzLv>0
            }else if(type==17){
                //冶炼进化石
                return et<EquipType.Wing&&eq.ZyList.length>0&&eq.TzLv==0&&eq.Lv==0
            }else if(type==19){
                return et==EquipType.Ring&&eq.ZyList.length>0&&eq.QhLv>=9&&eq.Lv<10
            }else if(type==20){
                return et==EquipType.Neck&&eq.ZyList.length>0&&eq.QhLv>=9&&eq.Lv<10
            }
            // else if(type==18){
            //     //抽取荧光宝石
            //     return et<EquipType.Wing&&eq.ZyList.length>0&&eq.QhLv>=4&&eq.TzLv==0&&eq.Lv==0
            // }
        }
        return false
    }
    mayaWeaponIds=[80008, 80114, 80243]
    bagEquipFilter2 = (eq2:outer_pb.IEquip)=>{
        const type=this.hcType;
        if(eq2.IsLock||(type!=15&&type!=16&&(eq2.TzLv>0||eq2.Lv>0)))return false //排除锁定的装备、套装
        let hcData=GD.hcDatas[type]
        if(hcData.Max1>0){
            if(this.need1List.array.length==0||this.need1List.array.findIndex(e=>{return e.Uid==eq2.Uid})>-1)return false
        }
        if(this.need2List.array.findIndex(e=>{return e.Uid==eq2.Uid})>-1)return false
        let et2 = eq2.Id/10000>>0
        if(type==1||type==2){
            //+4追4普通装备（玛雅武器合成、1代翅膀合成）
            if(this.mayaWeaponIds.indexOf(eq2.Id)>-1)return false //排除玛雅武器
            return et2<EquipType.Wing&&et2!=EquipType.Ring&&et2!=EquipType.Neck&&eq2.ZyList.length==0&&eq2.QhLv>=4&&eq2.ZjLv>=4
        }else if(type==3||type==4){
            //+4z4卓越（2代翅膀合成）
            return eq2.ZyList.length>0&&et2<EquipType.Wing&&et2!=EquipType.Ring&&et2!=EquipType.Neck&&eq2.QhLv>=4&&eq2.ZjLv>=4
        }else if(type==6){
            //+9追4装备（3代翅膀合成）
            return eq2.ZyList.length>0&&et2<EquipType.Wing&&et2!=EquipType.Ring&&et2!=EquipType.Neck&&eq2.QhLv>=9&&eq2.ZjLv>=4
        }else if(type==12){
            //+9追4装备卓越武器、项链（卓越属性叠加）
            //+9追4 有特殊属性的翅膀（翅膀叠加）
            let eq1:outer_pb.IEquip = this.need1List.array[0]
            let et1 = eq1.Id/10000>>0
            if(et1!=et2)return false
            if(et1==EquipType.Wing){
                let base1 = GD.EquipBaseDatas.get(eq1.Id)
                let base2 = GD.EquipBaseDatas.get(eq2.Id)
                if(!base1 || !base2 || base1.EquipLv!=base2.EquipLv) return false
                return et2==EquipType.Wing&&eq2.ZyList.length>0&&eq2.QhLv>=9&&eq2.ZjLv>=4
            }
            if(et1!=EquipType.Neck&&eq2.Id!=eq1.Id){
                return false
            }
            //判断材料装备上的属性是否与主装备完全重复，完全重复时不允许叠加
            let can=false;
            eq2.ZyList.forEach(v=>{
                //必须要有一条不一样的，才允许叠加
                if(eq1.ZyList.findIndex(v1=>{return v1==v})==-1){
                    can=true;
                }
            })
            if(can==false)return false;
            if(et1==EquipType.Pet)return true;
            return eq2.ZyList.length>0&&eq2.QhLv>=9&&eq2.ZjLv>=4
        }else if(type==15){
            //套装进阶：需要同类型装备的套装
            if(eq2.TzLv==0)return false
            let eq1:outer_pb.IEquip = this.need1List.array[0]
            let et1 = eq1.Id/10000>>0
            if((et1 == EquipType.Weapon || et1 == EquipType.JianTong || et1 == EquipType.ZHBook)){
                et1=EquipType.Weapon
            }
            if((et2 == EquipType.Weapon || et2 == EquipType.JianTong || et2 == EquipType.ZHBook)){
                et2=EquipType.Weapon
            }
            return et2==et1
        }else if(type==21){
            if(eq2.SkillId==0)return false
            let eq1:outer_pb.IEquip = this.need1List.array[0]
            if(eq1&&eq1.SkillId==eq2.SkillId){
                if(eq1.ZyList.length==0||eq2.ZyList.length>0)return true
            }
        }
        return false
    }
    onYjAdd2=()=>{
        const type=this.hcType;
        let hcData=GD.hcDatas[type]
        if(hcData.Max1>0&&this.need1List.array.length==0){
            UIMgr.I.tip('请先添加主装备')
            return
        }
        if(type==1||type==2||type==6){
            let n = GD.hcDatas[type].Max2-this.need2List.array.length
            for(let i=0;i<n;i++){
                let equip=GD.role.BagEquips.find(this.bagEquipFilter2)
                if(equip){
                    this.onSelected2Equip(equip)
                }
            }
            // GD.playGetItemSound()
        }
    }
    onSelected2Equip=(equip:outer_pb.IEquip)=>{
        this.need2List.addOne(equip)
        this.switchBtn2Show()
        this.changeHcRateAndNeeds()
        GD.playGetItemSound()
    }
    switchBtn2Show=()=>{
        let max2=GD.hcDatas[this.hcType].Max2
        let show=max2>0&&this.need2List.array.length<max2
        this.add2Btn.active=show
        this.yjAdd2Btn.active=show&&(this.hcType==1||this.hcType==2||this.hcType==6);
    }
    renderCell=(node:Node,index:number,list:List)=>{
        let label=node.children[0].getComponent(Label)
        let equip = list.array[index] as outer_pb.Equip
        let base = GD.EquipBaseDatas.get(equip.Id)
        let color=ct.blue
        if(equip.QhLv>=7){
            color=ct.yellow
        }
        if(equip.ZyList.length>0){
            color=ct.green
        }
        if(equip.TzLv>0){
            color=ct.red
        }
        label.string=`${base.Name}+${equip.QhLv}${equip.ZjLv>0?'追'+equip.ZjLv:''}${equip.LuckyLv>0?'幸运'+equip.LuckyLv:''}`
        label.color.fromHEX(color)
    }
    diaPrice:number=2;
    selectHcType=(node:Node,index:number)=>{
        this.hcType=index
        let hcData = GD.hcDatas[index];
        if(hcData.BHPrice>0){
            //加载保护价格
            WS.send(MT.GetDiaPrice,GD.EmptyRequestBuff,(d:any)=>{
                let rsp = outer_pb.DiaMarketAct.decode(d)
                this.diaPrice=rsp.CurPrice;
                    this.showHcView()
            })
        }else{
            this.showHcView()
        }
        GameManager.I.playOpenSound()
    }
    dzSelectHcType=(node:Node,index:number,equip:outer_pb.IEquip,bodyType:BodyType)=>{
        this.hcType=index
        let hcData = GD.hcDatas[index];
        if(hcData.BHPrice>0){
            //加载保护价格
            WS.send(MT.GetDiaPrice,GD.EmptyRequestBuff,(d:any)=>{
                let rsp = outer_pb.DiaMarketAct.decode(d)
                this.diaPrice=rsp.CurPrice;
                    this.addOneNeed1Equip(equip)
                    this.showHcView(equip,null,bodyType)
            })
        }else{
            this.addOneNeed1Equip(equip)
            this.showHcView(equip,null,bodyType)
        }
        GameManager.I.playOpenSound()
    }
    // private addOneNeed1Equip_fromEquipView=(equip:outer_pb.IEquip,bodyType:BodyType)=>{
    //     this.addOneNeed1Equip(equip)
    //     this.bodyType = bodyType
    // }
    showHcView(equip1:outer_pb.IEquip=null,equip2:outer_pb.IEquip=null,bodyType:BodyType=BodyType.None,baoHuTye:number=0,luckNum:number=0){
        this.bodyType = bodyType
        if(equip1){
            this.need1List.array=[equip1]
        }else{
            this.need1List.array=[]
        }
        if(equip2){
            this.need2List.array=[equip2]
        }else{
            this.need2List.array=[]
        }
        this.fbType=-1
        this.view.selectedIndex = 1
        this.baoHuToggle.isChecked=baoHuTye>0
        this.baoHuTab.select(baoHuTye-1)
        let hcData = GD.hcDatas[this.hcType];
        this.npcName.string=hcData.Name
        let msg=''
        if(hcData.MaxRate<100){
            msg=`${hcData.Msg}；最大成功率：${hcData.MaxRate}%(不含幸运符加成)`
        }else{
            msg=hcData.Msg
        }
        if(hcData.BHPrice>0){
            msg+='\n【开启保护时：幸运符加成翻倍、额外加成功率(钻石保护+10%、点数保护+15%)】'
        }
        this.msgLabel.string=msg
        let info1=hcData.Info1
        if(hcData.Id>=8&&hcData.Id<=11){
            //四件套合成，显示预览
            let obj={Items:[]}
            let id=0
            if(hcData.Id==8){
                id=220000
            }else if(hcData.Id==9){
                id=240000
            }else if(hcData.Id==10){
                id=250000
            }else if(hcData.Id==11){
                id=230000
            }
            let name = GD.EquipBaseDatas.get(id).Name
            let item = outer_pb.DropItem.create()
            item.Uid=randomRange(1,99999)+''
            item.ItemId=id
            item.ItemNum=1
            item.ItemType=1
            let equip=outer_pb.Equip.create()
            equip.Id=id
            equip.Lv=0
            equip.Exp=0
            if(id==220000){
                equip.YsList=[5,0] //勋章：随机属性类型、元素类型
            }
            item.EquipData=equip
            obj.Items.push(item)
            info1 = `点击可预览属性：<u><color=${ct.purple} click="onClick" param="i${item.Uid}">${name}</></u>`
            this.need1.getComponent(RichTextHandler).data=obj
        }
        this.need1.string=info1
        this.need2.string=hcData.Info2
        const isMenPiao = this.hcType==0
        this.baoHuToggle.node.active=false
        this.fbTypeBtns.active=isMenPiao
        this.addLuckNum=luckNum;
        this.refreshLunckNum()
        this.changeHcRateAndNeeds()
        if(isMenPiao||this.hcType==13||this.hcType==17||this.hcType==18||this.hcType==19||this.hcType==20){
            //门票、冶炼、果实合成、首饰吞噬、抽荧光，可以批量合成
            this.numTab.node.active=true
            this.numTab.select(this.numTab.selectedIndex)
            if(isMenPiao){
                this.resetXsLvToggle(-1)
                this.resetEmLvToggle(-1)
            }
        }else{
            this.numTab.node.active=false
        }
        this.switchBtn1Show()
        this.switchBtn2Show()
        // this.add1Btn.active=hcData.Max1>0||this.need1List.array.length<hcData.Max1;
        // this.add2Btn.active=hcData.Max2>0||this.need2List.array.length<hcData.Max2;
        // this.yjAdd2Btn.active=this.hcType==1||this.hcType==2||this.hcType==6 //玛雅武器、1代、3代
    }
    onBgClick(event:EventTouch){
        if(this.view.selectedIndex==0){
            UIMgr.I.hideCurPage();
        }else{
            this.showMenus()
            GameManager.I.playOpenSound();
        }
    }
    initData(data: any): void {
        this.showMenus()
    }
    showMenus(){
        let npc=GD.npc_list.get(8);
        this.npcName.string = npc.Name;
        this.msgLabel.string = npc.Msg[0];
        this.view.selectedIndex=0;
    }
    // onHide(): void {
    // }
}


