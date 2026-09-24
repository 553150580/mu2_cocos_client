import { _decorator, Component, EditBox, EventTouch, Label, Node, RichText, Slider, Sprite, SpriteFrame, Toggle, UITransform, Vec3, Widget } from 'cc';
import { AtkDtTzTypeString, AtkTzTypeString, BoxMsg, ct, DefDtTzTypeString, DefTzTypeString, Item, PopViewType, PriceTypeColor, RewordNameObj, ShopItem, Skill, WingZyPros, ZmJobType, ZyTypeString } from '../base/types';
import Tools from '../base/tools';
import GD from '../base/GameData';
import { BattleManager } from '../battle/BattleManager';
import { PageType, UIMgr } from '../managers/UIMgr';
import WS from '../base/net';
import { ConfigType, Err, MT } from '../base/MT';
import { FriendPage } from './FriendPage';
import { EquipTypeStr, ItemTypeStr, payInfo, PriceTypeStr, TeamActStr0, TeamActStr1 } from '../base/consts';
import { Tab } from '../UiComps/Tab';
import { ZmPage } from './ZmPage';
import GameManager from '../managers/GameManager';
import { List } from '../UiComps/List';
import { ViewStack } from '../UiComps/ViewStack';
import { RoleUIControl } from '../battle/RoleUIControl';
import { HunShou } from './HunView';
import { RichTextHandler } from '../UiComps/RichTextHandler';
const { ccclass, property } = _decorator;

// export enum ItemDataType{
//     ChatItem,
//     CkBagItem,
//     CkItem,
//     Skill,
//     NpcShopItem,
//     Msg,
//     // MarketItem,
//     // MyShopItem,
//     // MyShopBagItem,
// }
export enum ShowItemType{
    None,
    Equip,
    Item,
    Skill,
    NpcShopEquip,
    NpcShopItem,
    Msg,
    ZmMenber,
    RequestJoinZm,
    HunShou,
    TradeEquip,
    TradeItem,
}
@ccclass('PopView')
export class PopView extends Component {
    @property(Node)
    showGemShopBtn:Node;
    @property(Node)
    showDiaMarketBtn:Node;
    @property(Node)
    showBfMarketBtn:Node;
    @property(Node)
    showKfMarketBtn:Node;
    @property(EditBox)
    passEdit:EditBox;
    @property(Node)
    bg:Node;
    @property(Node)
    minBtn:Node;
    @property(Node)
    maxBtn:Node;
    @property(ViewStack)
    views:ViewStack;
    @property(RichText)
    richText:RichText
    @property(RichText)
    bossRich:RichText
    @property(Node)
    nameBtns:Node;
    @property(Label)
    addFriendLabel:Label;
    @property(Node)
    gotoBtn1:Node;
    @property(Node)
    gotoBtn2:Node;
    @property(Label)
    info:Label;
    @property(Node)
    bodyBox:Node;
    @property(Node)
    bodyNodes:Node;
    @property(Node)
    zmBtns:Node;
    @property(Node)
    switchOwnerBtn:Node;
    @property(Node)
    hitOutBtn:Node;
    @property(Toggle)
    changeJobToggle:Toggle;
    @property(Node)
    tanHeMzBtn:Node;
    @property(Tab)
    changeJobTab:Tab;
    @property(Node)
    roleBox:Node;
    @property(Node)
    itemInfoBox:Node;
    @property(Node)
    leftActBtn:Node;
    @property(Node)
    infoActBtn:Node;
    @property(Node)
    rightActBtn:Node;
    @property(Node)
    itemInfoFram:Node;
    @property(Node)
    sliderBox:Node
    @property(Slider)
    slider:Slider
    @property(RichText)
    sliderInfo:RichText
    @property(EditBox)
    sliderNumInput:EditBox
    @property(Node)
    sliderOkBtn:Node
    @property(Node)
    reduceBtn:Node
    @property(Node)
    addBtn:Node
    @property(Label)
    price:Label

    @property(Node)
    bagBox:Node
    @property(List)
    bagList:List
    @property(Tab)
    bagTab:Tab
    @property(Toggle)
    bagTypeToggle:Toggle
    @property(Tab)
    bagItemTypeTab:Tab

    @property(Node)
    msgBox:Node
    @property(Node)
    cancelMsgBtn:Node
    @property(Node)
    okMsgBtn:Node
    @property(Node)
    okMsgBg:Node
    @property(RichText)
    msgRich:RichText

    @property(Node)
    helpBox:Node
    @property(RichText)
    helpRich:RichText
    @property(Node)
    closeLabel:Node

    @property(Node)
    skillsBox:Node;
    @property(List)
    skillList:List;

    @property(Node)
    tzProsBox:Node;
    @property(List)
    tzProsList:List;

    @property(Node)
    kaLvList:Node;
    @property(Label)
    dayLabel:Label

    @property(List)
    jhList:List;
    @property(Node)
    zrBtn:Node;
    @property(Label)
    zrNeed:Label;
    @property(Node)
    jhBtn:Node;
    @property(Node)
    skillModeTab:Node;
    @property(Node)
    jsBtn:Node;
    @property(Node)
    backSaveBtn:Node;
    @property(Node)
    savePosBtn:Node;
    @property(Label)
    jhNeed:Label;
    @property(RichText)
    teamActInfo:RichText;
    @property(Node)
    teamInfoActBtn:Node;
    @property(Node)
    teamMenberList:Node;
    @property(Node)
    TeamPosBox:Node;

    @property(Node)
    selectBox:Node;
    @property(Node)
    selectOkBtn:Node;
    @property(Tab)
    selectTab:Tab;
    @property(Tab)
    selectZyTab:Tab;
    // @property(Tab)
    // payTab:Tab;
    @property(List)
    payTypesList:List
    @property(Node)
    payBtn:Node;
    @property(RichText)
    payInfoRich:RichText

    @property(EditBox)
    accountInput:EditBox;

    @property(Tab)
    dropTab:Tab;
    @property(List)
    dropList:List;

    // @property(Node)
    // saveHideBtn:Node;
    // @property(List)
    // hideSetList:List;
    
    

    // itemInfoFramTrans:UITransform;
    data:any;
    infoMode:number=0;//1表示已打开显示role的装备窗口

    selectedIdList:Array<number>=[]
    selectedNode:Node;
    showStack:Array<PopViewType>=[]
    selectedPayNode:Node;
    // static I:PopView;
    onLoad(): void {
        // PopView.I=this;
        // this.node.active=false;
        // this.itemInfoFramTrans = this.itemInfoFram.getComponent(UITransform)
        this.bg.on(Node.EventType.TOUCH_END,()=>{
            this.hide()
            if(this.afterClickHideCb){
                this.afterClickHideCb()
                this.afterClickHideCb=null;
            }
        },this);
        this.payTypesList.array=[];
        this.payTypesList.cellRender=(node,index)=>{
            let str=this.payTypesList.array[index];
            node.children[2].getComponent(RichText).string=str;
            node.children[1].children[0].active = node==this.selectedPayNode;
        }
        this.payTypesList.selectedHandler=(node,index)=>{
            if(this.selectedPayNode){
                this.selectedPayNode.children[1].children[0].active = false;
            }
            this.selectedPayNode=node
            node.children[1].children[0].active = true
            GD.playClickSound();
        }
        this.showGemShopBtn.on(Node.EventType.TOUCH_END,()=>{
            UIMgr.I.show(PageType.GemShopPage)
            this.hide()
        },this);
        this.showDiaMarketBtn.on(Node.EventType.TOUCH_END,()=>{
            UIMgr.I.show(PageType.DiaMarketPage)
            this.hide()
        },this);
        this.showBfMarketBtn.on(Node.EventType.TOUCH_END,()=>{
            UIMgr.I.show(PageType.MarketPage,false)
            this.hide()
        },this);
        this.showKfMarketBtn.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.hasEnoughLv(380,false)){
                UIMgr.I.show(PageType.MarketPage,true)
                this.hide()
            }else if(GD.role.hasEnoughLv(320,false)){
                if(GD.role.data.OpenDayNum>=GD.configs.get(ConfigType.OpenKfDayNum)){
                    UIMgr.I.show(PageType.MarketPage,true)
                    this.hide()
                }else{
                    UIMgr.I.tip('您的参与条件不足')
                }
                //320级以上，检查是否开服满60天
                // WS.send(MT.GetServerOpenDayNum,GD.EmptyRequestBuff,(d:any)=>{
                //     let rsp=outer_pb.MarketAct.decode(d);
                //     if(rsp.ErrCode==Err.ErrCode_Success){
                //         UIMgr.I.show(PageType.MarketPage,true)
                //         this.hide()
                //     }else{
                //         UIMgr.I.tip('您的参与条件不足')
                //     }
                // })
            }else{
                UIMgr.I.tip('您的参与条件不足')
            }
        },this);
        this.gotoBtn1.on(Node.EventType.TOUCH_END,()=>{
            this.gotoPos(true)
        },this);
        this.gotoBtn2.on(Node.EventType.TOUCH_END,()=>{
            this.gotoPos(false)
        },this);
        this.zrBtn.on(Node.EventType.TOUCH_END,this.doZr,this);
        this.jsBtn.on(Node.EventType.TOUCH_END,this.doJieShan,this);
        this.backSaveBtn.on(Node.EventType.TOUCH_END,this.doBackSave,this);
        this.savePosBtn.on(Node.EventType.TOUCH_END,()=>{
            if(GD.curMap.mapData.IsKf==1){
                UIMgr.I.tip('跨服地图内无法保存')
                return
            }
            WS.send(MT.SaveMemberPos,GD.EmptyRequestBuff,(d:any)=>{
                UIMgr.I.tip('保存成功',ct.green)
            })
        },this);
        this.jhBtn.on(Node.EventType.TOUCH_END,()=>{
            this.skillModeTab.parent.active=!this.skillModeTab.parent.active;
        },this);
        this.skillModeTab.children.forEach((node,index)=>{
            node.on(Node.EventType.TOUCH_END,()=>{
                this.doJiHe(index)
            },this);
        })
        this.nameBtns.children.forEach((node,index)=>{
            if(index==0){
                //查看信息
                node.on(Node.EventType.TOUCH_END,()=>{
                    Tools.tryGetOtherRoleInfo(this.data.Id,this.curShowItemType)
                },this);
            }else if(index==1){
                //查看摊位
                node.on(Node.EventType.TOUCH_END,()=>{
                    if(GD.curMap.mapData.IsKf==1){
                        UIMgr.I.tip('跨服地图内无法查看摊位')
                        return
                    }
                    UIMgr.I.show(PageType.MarketPage,this.data)
                    this.hide();
                },this);
            }else if(index==2){
                //添加、删除好友
                node.on(Node.EventType.TOUCH_END,this.tryAddOrDeleteFriend,this);
            }else if(index==3){
                //邀请组队、申请入队
                node.on(Node.EventType.TOUCH_END,()=>{
                    if(GD.curMap.mapData.IsKf==1){
                        UIMgr.I.tip('跨服地图内无法组队操作')
                        return
                    }
                    if(GD.role.data.TeamId==0){
                        if(this.data.TeamId>0){
                            this.requestJoinTeam(this.data.TeamId)
                        }else{
                            UIMgr.I.tip('请先创建队伍')
                            return;
                        }
                    }else if(this.data.TeamId==0){
                        this.inviteOtherJoinTeam()
                    }else{
                        UIMgr.I.tip('对方已有队伍')
                        return
                    }
                },this);
            }else if(index==4){
                //发送消息（私聊、邮件）
                node.on(Node.EventType.TOUCH_END,()=>{
                    UIMgr.I.show(PageType.ChatPage,this.data)
                    this.hide();
                },this);
            }else if(index==5){
                //作为目标
                node.on(Node.EventType.TOUCH_END,()=>{
                    GD.player.changeTargetByName(this.data.Name)
                    this.hide();
                },this);
            }else if(index==6){
                //申请交易（需要双方都有黄金卡）
                node.on(Node.EventType.TOUCH_END,()=>{
                    if(GD.role.isTrading){
                        UIMgr.I.tip('您已处于交易状态中')
                        return
                    }
                    if(GD.role.data.IsYkMode==false){
                        UIMgr.I.tip('爽玩区不开放面对面交易')
                        return
                    }
                    if(GD.role.hasBaseYk(false)){
                        let other=this.data as outer_pb.OtherRoleInfo
                        let req = outer_pb.TradeAct.create();
                        req.Id=other.Id;
                        let buff = outer_pb.TradeAct.encode(req).finish();
                        WS.send(MT.TryRequestTradeToOther,buff,(d:any)=>{
                            let rsp=outer_pb.TradeAct.decode(d);
                            if(rsp.ErrCode==Err.ErrCode_Success){
                                UIMgr.I.tip('成功发送交易邀请，等待对方同意',ct.green)
                            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughLineTime){
                                UIMgr.I.tip('对方不在线')
                            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughNum){
                                UIMgr.I.tip('对方无特权卡，无法面对面交易')
                            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughLv){
                                UIMgr.I.tip('跨服面对面交易需求等级不足')
                            }else{
                                UIMgr.I.tip('对方暂时无法交易')
                            }
                        })
                    }else{
                        UIMgr.I.tip('面对面交易需要特权卡（无特权卡请在交易行交易）')
                    }
                    this.hide();
                },this);
            }
        })
        this.bodyNodes.children.forEach((node,index)=>{
            if(index>0){
                node.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
                    if(this.data.Id!=GD.role.data.Id){
                        UIMgr.I.tip('禁止偷窥')
                        return
                    }
                    let equip = this.data.BodyEquips[index]
                    if(equip){
                        // this.bodyBox.active=false;
                        // this.itemInfoBox.active=true;
                        this.infoMode=1;
                        this.showAndHideInStack(PopViewType.ItemInfo,PopViewType.BodyBox)
                        this.infoActBtn.active=false;
                        this.infoActBtn.off(Node.EventType.TOUCH_END)
                        Tools.showEquip(equip,this.richText,null)
                        Tools.resetInfoFrameHeight(this.richText,this.itemInfoFram,0);
                        // this.itemInfoFramTrans.height = this.richText.node.getComponent(UITransform).height+40;
                    }
                },this);
            }
        })
        this.slider.node.on('slide',(slider:Slider)=>{
            this.curSliderValue = ((this.curMaxSliderValue-1)*slider.progress>>0)+1
            this.refreshSliderInfo()
        })
        this.reduceBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.curSliderValue>1){
                this.curSliderValue--
                this.updateSlider()
                this.refreshSliderInfo()
                GD.playClickSound()
            }
        },this);
        this.addBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.curSliderValue<this.curMaxSliderValue){
                this.curSliderValue++
                this.updateSlider()
                this.refreshSliderInfo()
                GD.playClickSound()
            }
        },this);
        this.minBtn.on(Node.EventType.TOUCH_END,()=>{
            this.curSliderValue=1
            this.updateSlider()
            this.refreshSliderInfo()
            GD.playClickSound()
        },this);
        this.maxBtn.on(Node.EventType.TOUCH_END,()=>{
            this.curSliderValue=this.curMaxSliderValue
            this.updateSlider()
            this.refreshSliderInfo()
            GD.playClickSound()
        },this);
        this.sliderNumInput.node.on('editing-did-ended', (eb:EditBox)=>{
            let num = parseInt(this.sliderNumInput.string)
            if(num>this.curMaxSliderValue){
                UIMgr.I.tip('超过最大值，已重置为最大值')
                num=this.curMaxSliderValue
            }else if(num<=0){
                num=1
            }
            this.curSliderValue=num
            this.updateSlider()
            this.refreshSliderInfo()
        }, this)
        this.bagTab.selectedHandler=(node:Node,index:number)=>{
            GD.playClickSound();
            if(index==0){
                this.bagItemTypeTab.labels = EquipTypeStr;
                this.bagList.array = GD.role.BagEquips
            }else{
                this.bagItemTypeTab.labels = ItemTypeStr;
                //item.Id>17排除药水、金币、点数、随机回城卷轴等，item.Id==4为技能书页
                this.bagList.array = GD.role.BagItems;//.filter(item=>{return item.Id>17||item.Id==4})
            }
            this.bagItemTypeTab.select(0)
        }
        this.bagItemTypeTab.selectedHandler=(node:Node,index)=>{
            GD.playClickSound();
            Tools.filterBagLit(this.bagTypeToggle,node,this.bagTab.selectedIndex,index,this.bagList)
        }
        this.bagList.cellRender = (node:Node,index:number)=>{
            let item:any = this.bagList.array[index];
            Tools.renderBagItem(this.bagTab.selectedIndex,item,node)
        }
        this.node.on('refreshBag',this.refreshBag)
        // this.cancelMsgBtn.on(Node.EventType.TOUCH_END,()=>{
        //     this.hide()
        // })
        this.jhList.cellRender = (node:Node,index:number)=>{
            const other:outer_pb.RoleInfo = this.jhList.array[index];
            node.children[2].getComponent(Label).string=other.Name;
            let isSelected=false
            if(this.jhList.isMultiple){
                isSelected=this.selectedIdList.findIndex(id=>{return id==other.Id})>-1;
            }else{
                isSelected = node==this.selectedNode;
            }
            node.children[1].children[0].active = isSelected
        };
        this.jhList.selectedHandler = (node:Node,index:number)=>{
            const other:outer_pb.RoleInfo = this.jhList.array[index];
            let isSelected=false
            if(this.jhList.isMultiple){
                const i = this.selectedIdList.findIndex(id=>{return id==other.Id});
                if(i==-1){
                    if(GD.role.data.IsYkMode==false||other.BaseYk>0){
                        isSelected=true
                        this.selectedIdList.push(other.Id);
                    }else{
                        UIMgr.I.tip('该队友未激活特权卡，无法被操作')
                    }
                }else{
                    this.selectedIdList.splice(i,1);
                }
                let info=''
                let color:ct=ct.qing
                if(GD.role.hasGoldYk(false)){
                    info='黄金卡 免钻石'
                    color=ct.green
                }else{
                    const needDia = GD.configs.get(ConfigType.GotoPosNeedDia)*this.selectedIdList.length;
                    info=`需要：${needDia}钻石`
                }
                this.jhNeed.string=info;
                this.jhNeed.color.fromHEX(color);
            }else{
                this.selectedIdList[0]=other.Id;
                isSelected=true;
                if(this.selectedNode){
                    this.selectedNode.children[1].children[0].active = false;
                }
                this.selectedNode=node
            }
            node.children[1].children[0].active = isSelected
            GameManager.I.playClickSound();
        };
        // this.hideSetList.cellRender = (node:Node,index:number)=>{
        //     const sid:string = this.hideSetList.array[index];
        //     node.children[2].getComponent(Label).string=`${sid}服`;
        //     node.children[1].children[0].active = this.selectedHideSidList[sid];
        // };
        // this.hideSetList.selectedHandler = (node:Node,index:number)=>{
        //     const sid:string = this.hideSetList.array[index];
        //     let isShow=!this.selectedHideSidList[sid]
        //     this.selectedHideSidList[sid] = isShow
        //     node.children[1].children[0].active = isShow
        //     GameManager.I.playClickSound();
        // };
        this.skillList.selectedHandler = (node:Node,index:number)=>{
            const skill:Skill = this.skillList.array[index];
            let path = `ui/skill_icon/${skill.Id}`;
            Tools.loadSpriteFrame(path,GD.commonBundle).then((sp:SpriteFrame)=>{
                const mode = this.data.mode
                let ids:Array<number>=GD.role.skillSlots.get(mode)
                ids[this.data.index]=skill.Id
                if(skill.Id==0){
                    sp=null
                }
                if(this.data.sp)this.data.sp.spriteFrame = sp;
                UIMgr.I.setSkillSlotSkin(UIMgr.I.skillBtns.children[this.data.index],this.data.index,mode,sp);
                GD.role.resetAtkSkills();
                //发送
                let req = outer_pb.SkillAct.create();
                req.Slot0=GD.role.data.SkillSlots0;
                req.Slot1=GD.role.data.SkillSlots1;
                req.Slot2=GD.role.data.SkillSlots2;
                let buff = outer_pb.SkillAct.encode(req).finish();
                WS.send(MT.SaveSkillSlots,buff);
                GameManager.I.playClickSound();
                this.hide();
            })
        }
        this.skillList.cellRender = (node:Node,index:number)=>{
            const skill:Skill = this.skillList.array[index];
            Tools.loadSpriteFrame(`ui/skill_icon/${skill.Id}`,GD.commonBundle).then((sp:SpriteFrame)=>{
                node.children[0].getComponent(Sprite).spriteFrame = sp;
            })
        };
        this.tzProsList.selectedHandler = (node:Node,index:number)=>{
            const pro:any = this.tzProsList.array[index];
            if(this.oldTzProList.findIndex(v=>{return v==pro.index})==-1){
                this.selectTzProCb&&this.selectTzProCb(pro.index)
                let proIndex:number;
                //索引0~4为防御套装类型，5~9为攻击套装类型，10~13大天防御套，14~17大天攻击套
                if(this.defOrAtkTz==0){
                    //防御套
                    if(this.tzType==0){
                        //普通防御套：0、1、2、3、4
                        proIndex = this.selectTzCellIndex;
                    }else{
                        //大天防御套：10、11、12、13
                        proIndex = this.selectTzCellIndex+10;
                    }
                }else{
                    //攻击套
                    if(this.tzType==0){
                        //普通攻击套：5、6、7、8、9
                        proIndex = this.selectTzCellIndex+5;
                    }else{
                        //大天攻击套：14、15、16、17
                        proIndex = this.selectTzCellIndex+14;
                    }
                }
                GD.role.data.TzSet[proIndex]=pro.index;
                GameManager.I.playClickSound();
                this.hide();
            }
        }
        this.tzProsList.cellRender = (node:Node,index:number)=>{
            const pro:any = this.tzProsList.array[index];
            let label = node.children[0].getComponent(Label);
            let info = pro.info;
            let color=ct.gray
            if(this.oldTzProList.findIndex(v=>{return v==pro.index})==-1){
                if(this.tzType==0){
                    if(this.selectTzCellIndex<=2){
                        //基础
                        color=ct.blue
                    }else{
                        //高级
                        color=ct.brown
                        info+='%'
                    }
                }else{
                    color=ct.purple
                }
            }
            label.string=info;
            label.color.fromHEX(color)
        };
        this.dropTab.selectedHandler=(node,index)=>{
            let list:Array<any>
            if(index==0){
                list = GD.SkillItemBases
            }else if(index==1){
                list = GD.AtkEquipBase
            }else if(index==2){
                list = GD.DefEquipBase
            }else if(index==3){
                list = GD.RingNeckBase
            }else if(index==4){
                list = GD.ItemDropLvObj
            }else if(index==5){
                list = [40, 41, 42, 626, 612] //高级掉落：仙兽晶核、恶魔、天使、狼号角、套装石
            }
            this.dropList.array = list;
        }
        this.dropList.cellRender = (node,index)=>{
            let item = this.dropList.array[index];
            let name = ''
            let dropStr:string=''
            let color:ct=ct.blue;
            if(this.dropTab.selectedIndex==5){
                //高级掉落
                let base=GD.ItemBaseDatas.get(item)
                if(base){
                    name=base.Name
                    dropStr=base.DropWay
                    color=ct.purple
                }
            }else{
                name=item.Name;
                if(item.DropLv>900){
                    dropStr='只能通过合成等获得'
                    color=ct.red
                }else{
                    let index = this.dropTab.selectedIndex;
                    if(index==0||index==4){
                        dropStr=`掉落等级>=${item.DropLv}级`
                        if(index==0){
                            if(item.DropLv>=46){
                                color=ct.purple
                            }
                        }else{
                            color=ct.yellow
                        }
                    }else{
                        dropStr=`掉落等级>=${item.DropLv}级(卓越+25级)`
                    }
                }
            }
            let nameLabel=node.children[0].getComponent(Label);
            nameLabel.string=name;
            nameLabel.color.fromHEX(color)
            node.children[1].getComponent(Label).string=dropStr
        }
        // this.dropList.selectedHandler = (node,index)=>{
        //     let item = this.dropList.array[index];
        //     let type = this.dropTab.selectedIndex;
        //     if(type==0||type==4){
        //         Tools.showItem(item.Id,item.Num,this.richText,null)
        //     }else{
        //         let equip = outer_pb.Equip.create({
        //             Id:item.Id,
        //             QhLv:0,
        //             ZjLv:0,
        //             LuckyLv:0,
        //             Lv:0,
        //             Exp:0,
        //             YsList:[],
        //             ZyList:[],
        //         })
        //         // this.show(PopViewType.ItemInfo)
        //         Tools.showEquip(equip,this.richText,null);
        //     }
        // }
    }
    showDropBox(){
        this.node.active=true;
        this.views.selectedIndex=PopViewType.DropBox;
        this.dropList.array = []
        this.dropTab.select(0);
    }
    pushInStack(type:PopViewType){
        this.showStack.push(type)
    }
    showAndHideInStack(showType:PopViewType,hideInStackType:PopViewType){
        this.views.selectedIndex = showType
        this.showStack.push(hideInStackType)
    }
    showAccountBox(){
        this.node.active=true;
        this.views.selectedIndex=PopViewType.AccountBox;
        this.accountInput.string=GD.sdkUserInfo.uid;
    }
    showSelectBox(obj:RewordNameObj,btnCb:(index:number,zyType:number)=>void){
        this.node.active=true;
        this.views.selectedIndex=PopViewType.SelectBox
        this.selectTab.labels=obj.items.join(',')
        this.selectTab.node.children.forEach(node=>{
            node.children[1].getComponent(Label).color.fromHEX(obj.color)
        })
        this.selectTab.select(-1);
        const n1 = obj.items.length;
        const height1 = n1*this.selectTab.cellHeight+(n1-1)*5;

        this.selectZyTab.node.active=obj.zyType>0;
        let zyHeight=0;
        if(obj.zyType>0){
            let zyArr:Array<string>
            if(obj.zyType==1){
                zyArr=ZyTypeString.slice(0,6)
            }else if(obj.zyType==2){
                zyArr=ZyTypeString.slice(6,12)
            }else if(obj.zyType==3){
                zyArr=WingZyPros.slice(0,9)
            }
            this.selectZyTab.labels=zyArr.join(',')
            const n2=zyArr.length;
            zyHeight = n2*this.selectZyTab.cellHeight+(n2-1)*5;
            this.selectZyTab.node.getComponent(Widget).top = height1+130;
            this.selectZyTab.select(-1);
        }
        
        this.selectBox.children[0].getComponent(UITransform).height = height1+zyHeight+200;
        this.selectOkBtn.off(Node.EventType.TOUCH_END);
        this.selectOkBtn.on(Node.EventType.TOUCH_END,()=>{
            let itemIndex = this.selectTab.selectedIndex
            if(itemIndex==-1){
                UIMgr.I.tip('请选择一个道具')
                return;
            }
            let zyT=this.selectZyTab.selectedIndex;
            if(obj.zyType>0&&zyT==-1){
                UIMgr.I.tip('请指定道具的卓越属性')
                return;
            }
            btnCb(itemIndex,zyT);
            this.hide();
        })
    }
    updateSlider(){
        if(this.curMaxSliderValue==1){
            this.slider.progress = 0
        }else{
            this.slider.progress=(this.curSliderValue-1)/(this.curMaxSliderValue-1)
        }
    }
    protected onEnable(): void {
        this.closeLabel.active=true;
    }
    refreshBag=()=>{
        if(this.bagBox.active){
            if(this.bagItemTypeTab.selectedIndex>0){
                this.bagItemTypeTab.select(this.bagItemTypeTab.selectedIndex)
            }else{
                this.bagList.refresh();
            }
        }
    }
    showBag(itemSelectedHandler:(node:Node,index,self:any)=>void,showAll:boolean=true){
        this.node.active=true;
        this.views.selectedIndex=PopViewType.BagBox
        this.bagList.selectedHandler=(node:Node,index)=>{
            itemSelectedHandler(node,index,this);
        }
        showAll&&this.bagTab.select(0)
        this.bagTab.node.active  = this.bagTypeToggle.node.active = showAll;
        GameManager.I.playOpenSound()
    }
    showBagEquipByFilter(itemSelectedHandler:(node:Node,index,self:any)=>void,filter:(equip:outer_pb.IEquip)=>void){
        this.afterClickHideCb=null
        this.bagTab.selectedIndex=0;
        this.bagItemTypeTab.selectedIndex=0;
        this.bagList.array = GD.role.BagEquips.filter(filter)
        this.showBag(itemSelectedHandler,false)
        // this.bagTab.node.active  = this.bagTypeToggle.node.active = false;
        // GameManager.I.playOpenSound()
    }
    showBagItemByFilter(itemSelectedHandler:(node:Node,index,self:any)=>void,filter:(item:Item)=>void){
        this.afterClickHideCb=null
        this.bagTab.selectedIndex=1;
        this.bagItemTypeTab.selectedIndex=0;
        this.bagList.array = GD.role.BagItems.filter(filter)
        this.showBag(itemSelectedHandler,false)
        // this.bagTab.node.active  = this.bagTypeToggle.node.active = false;
        GameManager.I.playOpenSound()
    }
    showHelpBox(msg:string){
        this.node.active=true;
        this.views.selectedIndex=PopViewType.HelpBox
        this.helpRich.string=msg;
        this.helpRich.node.parent.getComponent(UITransform).height=20+this.helpRich.node.getComponent(UITransform).height;
        GameManager.I.playOpenSound()
    }
    // selectedHideSidList:{[k: string]: boolean}
    // showHideSidBox(sidList:{[k: string]: boolean},cb:(hideList:{[k: string]: boolean})=>void){
    //     this.node.active=true;
    //     this.views.selectedIndex=PopViewType.HideSidSetBox;
    //     this.selectedHideSidList=sidList
    //     this.hideSetList.isMultiple=true
    //     let arr=[]
    //     for(let sid in sidList){
    //         arr.push(sid)
    //     }
    //     this.hideSetList.array=arr
    //     this.saveHideBtn.off(Node.EventType.TOUCH_END)
    //     this.saveHideBtn.on(Node.EventType.TOUCH_END,()=>{
    //         cb(this.selectedHideSidList)
    //         this.hide();
    //     })
    // }
    teamActType:number=0
    showTeamActBox(type:number){
        this.teamActType=type;
        this.node.active=true;
        this.selectedNode=null;
        this.views.selectedIndex=PopViewType.TeamActBox;
        let arr:Array<outer_pb.IRoleInfo>=[]
        this.selectedIdList=[]
        // let btnStr:string='集 合'
        let actInfo:string=TeamActStr0
        // this.jhToggle.isChecked=false;
        // this.skillModeTab.node.active=false;
        this.skillModeTab.parent.active=false;
        this.jsBtn.active = this.jhBtn.active = this.backSaveBtn.active = this.savePosBtn.active = type!=1;
        this.zrBtn.active = type==1;
        let needDia:number=0;
        // let x=90
        // let y=-290
        if(type==0){
            //召唤队友
            this.jhList.isMultiple=true
            arr = GD.role.myTeam.Menbers.filter(info=>{return info.Id!=GD.role.data.Id});
            GD.role.myTeam.Menbers.forEach(info=>{
                //月卡模式下，特权卡用户才能被召唤
                if(info.Id!=GD.role.data.Id&&(GD.role.data.IsYkMode==false||info.BaseYk>0))this.selectedIdList.push(info.Id)
            })
            needDia = GD.configs.get(ConfigType.GotoPosNeedDia)*arr.length
        }else if(type==1){
            //在附近的队友
            actInfo=TeamActStr1
            // btnStr='转 让'
            this.jhList.isMultiple=false
            // x=0
            // y=-230
            const teamId = GD.role.data.TeamId;
            if(teamId==0)return;
            arr = GD.role.myTeam.Menbers.filter(info=>{
                return info.Id!=GD.role.data.Id && GD.curMap.otherList.has(info.Id)
            });
            // GD.curMap.otherList.forEach(other=>{
            //     if(other.data.TeamId==teamId) arr.push(other.data)
            // })
            // needDia=ConfigType.SwitchMyBossOwnerNeedDia
            needDia = GD.configs.get(ConfigType.SwitchMyBossOwnerNeedDia)
        }
        // this.jhBtn.x=x;
        // this.jhBtn.y=y;
        this.teamActInfo.string=actInfo;
        this.jhList.array=arr;
        // this.jhBtn.children[0].getComponent(Label).string=btnStr;
        let info:string
        let color=ct.qing;
        if(GD.role.hasGoldYk(false)){
            info='黄金卡 免钻石'
            color=ct.green
        }else{
            info=`需要：${needDia}钻石`
        }
        if(type==0){
            this.jhNeed.string=info;
            this.jhNeed.color.fromHEX(color);
        }else{
            this.zrNeed.string=info;
            this.zrNeed.color.fromHEX(color);
        }
        GameManager.I.playOpenSound()
    }
    showTeamInfoBox(canSeeEquip:boolean,ownerId:number,menbers:Array<outer_pb.IRoleInfo>,btnCb:()=>void){
        this.node.active=true;
        this.views.selectedIndex=PopViewType.TeamInfoBox;
        let btnStr:string='抢 占'
        // if(type==0){
        //     //抢占
        //     //
        // }else if(type==1){
        //     //
        // }
        Tools.renderTeamRoles(this.teamMenberList,ownerId,menbers,canSeeEquip?2:0,btnCb)
        this.teamInfoActBtn.off(Node.EventType.TOUCH_END)
        this.teamInfoActBtn.on(Node.EventType.TOUCH_END,btnCb)
        this.teamInfoActBtn.children[0].getComponent(Label).string=btnStr;
        GameManager.I.playOpenSound()
    }
    doZr=()=>{
        let needDia:number=GD.configs.get(ConfigType.SwitchMyBossOwnerNeedDia)
        if(GD.role.hasGoldYk(false)){
            needDia=0;
        }
        if(GD.role.hasEnoughDia(needDia)){
            if(this.selectedIdList.length>0){
                //转让BOSS
                UIMgr.I.doSwitchBossOwner(this.selectedIdList[0]);
            }
            this.hide()
        }
    }
    doJiHe=(skillMode:number)=>{
        let needDia:number=GD.configs.get(ConfigType.GotoPosNeedDia)*this.selectedIdList.length
        if(GD.role.hasGoldYk(false)){
            needDia=0;
        }
        if(GD.role.hasEnoughDia(needDia)){
            if(this.selectedIdList.length>0){
                let req=outer_pb.JoinLineAct.create()
                req.IdList=this.selectedIdList
                req.Mode=skillMode;
                let buff = outer_pb.JoinLineAct.encode(req).finish()
                WS.send(MT.CallOthersToHere,buff,(d:any)=>{
                    let rsp=outer_pb.JoinLineAct.decode(d)
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        GD.role.reduceDia(rsp.Cost)
                        let noArr=[]
                        let msg='召唤完成'
                        if(rsp.IdList.length>0){
                            rsp.IdList.forEach(id=>{
                                let p=GD.role.myTeam.Menbers.find(info=>{return info.Id==id})
                                if(p){
                                    noArr.push(p.Name)
                                }
                            })
                            msg+=`，但【${noArr.join(',')}】暂时无法过来`
                        }
                        UIMgr.I.tip(msg,ct.green)
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughDia){
                        UIMgr.I.tip('召唤失败，钻石不足')
                    }else{
                        UIMgr.I.tip('召唤失败，队友暂时无法过来')
                    }
                    this.hide()
                })
            }else{
                UIMgr.I.tip('未选择队友')
            }
        }
    }
    doJieShan=()=>{
        if(this.selectedIdList.length>0){
            let req=outer_pb.JoinLineAct.create()
            req.IdList=this.selectedIdList
            // console.log('doJieShan',req)
            let buff = outer_pb.JoinLineAct.encode(req).finish()
            WS.send(MT.LetOthersBack,buff,(d:any)=>{
                UIMgr.I.tip('发送成功',ct.green)
            })
        }else{
            UIMgr.I.tip('未选择队友')
        }
        this.hide()
    }
    doBackSave=()=>{
        let req=outer_pb.JoinLineAct.create()
        req.IdList=this.selectedIdList
        // console.log('doJieShan',req)
        let buff = outer_pb.JoinLineAct.encode(req).finish()
        WS.send(MT.LetOthersBackToSavedPos,buff,(d:any)=>{
            UIMgr.I.tip('发送成功',ct.green)
        })
        this.hide()
    }
    showKaLvBox(id:number){
        this.node.active=true;
        this.views.selectedIndex=PopViewType.KaLvBox;
        let dayStr=''
        let data = GD.MapList.get(id)
        if(data&&data.DayNum>0){
            dayStr=`本服当前已开服${GD.role.data.OpenDayNum}天`
        }
        this.dayLabel.string=dayStr;
        this.kaLvList.children.forEach((node,index)=>{
            const roomId = id+index; //卡利玛id=509,远古战场701
            let room = GD.MapList.get(roomId)
            let label0=node.children[0].getComponent(Label)
            let label1=node.children[1].getComponent(Label)
            let color=ct.gray
            node.off(Node.EventType.TOUCH_END)
            if(room){
                const needLv = room.NeedLv;
                const needGold = room.NeedGold[0]||0;
                let day=''
                let dayNum=room.DayNum
                //远古战场701：1层90天、2层120天内可进入
                if(dayNum>0){
                    day=`，开服${dayNum}天内`
                }
                if(GD.role.hasEnoughLv(needLv,false)&&(needGold==0||GD.role.hasEnoughGold(needGold,false)&&(dayNum==0||GD.role.data.OpenDayNum<dayNum))){
                    color=ct.green
                }
                let needStr = needLv>400?`${needLv-400}转0`:`${needLv}`
                label0.string=`${room.Name}层`
                label1.string=`(需要：${needStr}级，金币x${Tools.getNumStr(needGold)}${day})`
                label1.color.fromHEX(color)
                node.on(Node.EventType.TOUCH_END,()=>{
                    if(dayNum==0||GD.role.data.OpenDayNum<dayNum){
                        if(GD.role.hasEnoughLv(needLv)&&(needGold==0||GD.role.hasEnoughGold(needGold))){
                            let lineId = GD.role.data.LineId
                            if(room.IsKf) lineId='1';
                            BattleManager.I.joinLine(0,roomId,-1,lineId);
                            this.hide();
                        }
                    }else{
                        UIMgr.I.tip('无法进入，已超过开服天数')
                    }
                })
            }else{
                label0.string='暂未开放'
                label1.string='-'
            }
        })
        GameManager.I.playOpenSound()
    }
    showSkillBox(data:any){
        this.data=data;
        this.node.active=true;
        this.views.selectedIndex=PopViewType.SkillBox
        let slots:Array<number>=GD.role.skillSlots.get(data.mode);
        let arr:Array<Skill>=[]
        if(data.nonSkill){
            arr.push(data.nonSkill)
        }
        GD.role.skills.forEach(skill=>{
            //不显示已设置的技能 和 不可用的技能、不可设置的连击技能72
            if(skill.Id>4&&skill.Id!=72){
                if(slots.indexOf(skill.Id)==-1 && skill.canUse){
                    arr.push(skill)
                }
            }
        })
        this.skillList.array=arr
        GameManager.I.playOpenSound()
    }
    selectTzProCb:(index:number)=>void
    oldTzProList:Array<number>
    tzType:number;//普通套装0，还是大天使套装1
    selectTzCellIndex:number;
    defOrAtkTz:number;
    showTzProsBox(tzType:number,defOrAtk:number,selectIndex:number,oldTzProList:Array<number>,selectTzProCb:(index:number)=>void){
        this.node.active=true;
        this.views.selectedIndex=PopViewType.TzSetBox;
        this.selectTzProCb=selectTzProCb;
        this.oldTzProList=oldTzProList;
        this.tzType=tzType;
        this.defOrAtkTz=defOrAtk;
        this.selectTzCellIndex=selectIndex;
        if(tzType==0){
            //普通套装
            let arr = defOrAtk==0?DefTzTypeString:AtkTzTypeString;
            let list=[]
            let delta = defOrAtk==0?10:7
            if(selectIndex<=2){
                //基础属性类型
                arr = arr.slice(0,delta)
                arr.forEach((v:string,index:number)=>{
                    list.push({info:v,index:index})
                })
            }else{
                //高级属性类型
                arr = arr.slice(delta)
                arr.forEach((v:string,index:number)=>{
                    list.push({info:v,index:index+delta})
                })
            }
            this.tzProsList.array=list;
        }else{
            //大天使套装
            let arr = defOrAtk==0?DefDtTzTypeString:AtkDtTzTypeString
            let list=[]
            arr.forEach((v:string,index:number)=>{
                list.push({info:v,index:index})
            })
            this.tzProsList.array = list
        }
        GameManager.I.playOpenSound()
    }
    showMsgBox(msg:Array<BoxMsg>,okStr:string=null,okCb:(d:string)=>void=null,cancelStr:string=null,showPassEdit:boolean=false,inputHolder:string='请输入解锁密码',clickHide:boolean=true){
        this.node.active=true;
        this.closeLabel.active=false;
        this.views.selectedIndex=PopViewType.MsgBox
        this.passEdit.node.active=showPassEdit;
        if(showPassEdit){
            this.passEdit.string=''
            this.passEdit.placeholder=inputHolder
        }
        let strs = []
        msg&&msg.forEach(m=>{
            strs.push(`<color=${m.color}>${m.msg}</>`)
        })
        this.msgRich.string=strs.join('<br/>')
        let pos:Vec3=this.okMsgBtn.position
        this.cancelMsgBtn.off(Node.EventType.TOUCH_END)
        if(cancelStr){
            this.cancelMsgBtn.active=true
            this.cancelMsgBtn.children[0].getComponent(Label).string=cancelStr
            this.cancelMsgBtn.on(Node.EventType.TOUCH_END,this.hide)
            pos.x=100
        }else{
            pos.x=0
            this.cancelMsgBtn.active=false
        }
        this.okMsgBtn.off(Node.EventType.TOUCH_END)
        if(okStr){
            this.okMsgBtn.active=true
            this.okMsgBtn.position=pos
            this.okMsgBtn.children[0].getComponent(Label).string=okStr
            this.okMsgBtn.on(Node.EventType.TOUCH_END,()=>{
                if(okCb){
                    okCb(this.passEdit.string);
                    this.hide();
                }else{
                    this.hide();
                }
            })
        }else{
            this.okMsgBtn.active=false
        }
        if(okStr==''||clickHide){
            this.okMsgBg.off(Node.EventType.TOUCH_END)
            this.okMsgBg.on(Node.EventType.TOUCH_END,this.hide)
        }
        this.msgBox.children[1].getComponent(UITransform).height=Math.max(250,120+this.msgRich.node.getComponent(UITransform).height);
        GameManager.I.playOpenSound()
    }
    showMsgBox2(msg:Array<BoxMsg>,okStr:string=null,okCb:()=>void=null,cancelStr:string=null,cancelCb:()=>void=null,clickHide:boolean=false){
        this.node.active=true;
        this.closeLabel.active=false;
        this.views.selectedIndex=PopViewType.MsgBox
        this.passEdit.node.active=false;
        let strs = []
        msg&&msg.forEach(m=>{
            strs.push(`<color=${m.color}>${m.msg}</>`)
        })
        this.msgRich.string=strs.join('<br/>')
        let pos:Vec3=this.okMsgBtn.position
        this.cancelMsgBtn.off(Node.EventType.TOUCH_END)
        if(cancelStr){
            pos.x=100
            this.cancelMsgBtn.active=true
            this.cancelMsgBtn.children[0].getComponent(Label).string=cancelStr
            this.cancelMsgBtn.on(Node.EventType.TOUCH_END,()=>{
                if(cancelCb){
                    cancelCb();
                }
                this.hide();
            })
        }else{
            pos.x=0
            this.cancelMsgBtn.active=false
        }
        this.okMsgBtn.off(Node.EventType.TOUCH_END)
        if(okStr){
            this.okMsgBtn.active=true
            this.okMsgBtn.position=pos
            this.okMsgBtn.children[0].getComponent(Label).string=okStr
            this.okMsgBtn.on(Node.EventType.TOUCH_END,()=>{
                if(okCb){
                    okCb();
                }
                this.hide();
            })
        }else{
            this.okMsgBtn.active=false
        }
        if(okStr==''||clickHide){
            this.okMsgBg.off(Node.EventType.TOUCH_END)
            this.okMsgBg.on(Node.EventType.TOUCH_END,this.hide)
        }
        this.msgBox.children[1].getComponent(UITransform).height=Math.max(250,120+this.msgRich.node.getComponent(UITransform).height);
        GameManager.I.playOpenSound()
    }
    refreshSliderInfo(){
        this.sliderNumInput.string=this.curSliderValue+''
        if(this.shopItem){
            this.price.string=`需要：${PriceTypeStr[this.shopItem.PriceType]}x${(this.shopItem.Price*this.curSliderValue).toLocaleString()}`
            this.price.color.fromHEX(PriceTypeColor[this.shopItem.PriceType])
        }else if(this.isMuPoint){
            this.price.string=`转出到账：${this.curSliderValue*0.9>>0}点`
        }
    }
    curMaxSliderValue:number=0;
    shopItem:ShopItem=null;
    curSliderValue:number=1;
    isMuPoint:boolean=false;
    showSliderBox(info:string,infoColor:ct,maxValue:number,btnStr:string,btnHandler:(num:number)=>void,shopItem:ShopItem=null,isMuPoint:boolean=false,clickHide:boolean=true,afterClickHideCb:()=>void=null){
        // maxValue = Math.min(maxValue,100000000);//最大值为1亿
        this.shopItem=shopItem;
        this.isMuPoint=isMuPoint;
        this.price.string=''
        this.node.active=true;
        this.infoMode=0;
        this.views.selectedIndex=PopViewType.SliderBox
        this.sliderNumInput.node.children[0].getComponent(Label).color.fromHEX(infoColor)
        this.sliderNumInput.string='1'
        this.curSliderValue=1;
        this.slider.progress=1/maxValue;
        this.refreshSliderInfo()
        this.curMaxSliderValue = maxValue;
        this.sliderOkBtn.off(Node.EventType.TOUCH_END)
        this.sliderOkBtn.children[0].getComponent(Label).string=btnStr
        if(btnHandler){
            this.sliderOkBtn.on(Node.EventType.TOUCH_END,()=>{
                this.curSliderValue>0 && btnHandler(this.curSliderValue);
                clickHide&&this.hide();
            })
        }
        this.info.string=''
        this.sliderInfo.string =`<color=${infoColor}>${info}</>`
        // this.sliderInfo.color.fromHEX(infoColor);
        // GameManager.I.playOpenSound()
    }
    getFriends(){
        WS.send(MT.GetFriends,GD.EmptyRequestBuff,(d:any)=>{
            let data = outer_pb.FriendAct.decode(d)
            GD.friendList=data.Friends;
            this.setFriendBtnLabel();
        })
    }
    isMyFriend:boolean=false;
    setFriendBtnLabel=()=>{
        if(GD.friendList.findIndex(friend=>{return friend.Id==this.data.Id})>-1){
            this.addFriendLabel.string='删除好友'
            this.isMyFriend=true
        }else{
            this.addFriendLabel.string='添加好友'
            this.isMyFriend=false
        }
    }
    tryAddOrDeleteFriend(){
        if(GD.curMap.mapData.IsKf==1){
            UIMgr.I.tip('跨服地图内无法操作')
            return
        }
        if(this.isMyFriend==false&&GD.friendList.length>=30){
            UIMgr.I.tip('好友数量已达上限');
            return;
        }
        let req = outer_pb.FriendAct.create();
        req.Id=this.data.Id;
        let buff = outer_pb.FriendAct.encode(req).finish();
        let type = this.isMyFriend?MT.DeleteFriend:MT.AddFriend;
        WS.send(type,buff,(d:any)=>{
            let rsp=outer_pb.FriendAct.decode(d);
            let str = `${this.isMyFriend?'删除':'添加'}`
            if(rsp.ErrCode==Err.ErrCode_Success){
                UIMgr.I.tip(`${str}成功`,ct.green);
                if(this.isMyFriend){
                    let i = GD.friendList.findIndex(f=>{return f.Id==rsp.Id});
                    if(i>-1) GD.friendList.splice(i,1);
                    if(UIMgr.I.curPageType==PageType.FriendPage){
                        FriendPage.I.refreshList();
                    }
                }else{
                    GD.friendList.push(rsp.NewFriend);
                }
            }else{
                UIMgr.I.tip(`${str}失败`)
            }
        })
        this.hide();
    }
    inviteOtherJoinTeam(){
        let id = this.data.Id as number
        Tools.inviteOtherJoinMyTeam(id)
        this.hide()
    }
    requestJoinTeam(num:number){
        let req = outer_pb.TeamAct.create();
        req.TeamId=num;
        let buff = outer_pb.TeamAct.encode(req).finish();
        WS.send(MT.RequestJoinTeam,buff,this.onRequestJoinTeam)
        this.hide()
    }
    onRequestJoinTeam=(d:any)=>{
        let rsp=outer_pb.TeamAct.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            UIMgr.I.tip('成功发送申请',ct.green)
        }else if(rsp.ErrCode==Err.ErrCode_RequestBuffFull){
            UIMgr.I.tip('申请列表已满')
        }else{
            UIMgr.I.tip('该队伍已满员')
        }
    }
    //isResetPos:是否是瞬间前往到目标位置
    gotoPos(IsImmediate:boolean){
        if(this.data&&GD.role.canChangPos()){
            UIMgr.I.hideCurPage()
            const isVip = GD.role.hasGoldYk(false)
            // console.log(isVip,GD.role.data.GoldYk,Date.now()/1000>>0)
            if(!isVip){
                if(IsImmediate){
                    if(GD.role.hasEnoughDia(GD.configs.get(ConfigType.GotoPosNeedDia))==false) return
                }
            }
            let pos = this.data as outer_pb.IPosition;
            let room = GD.MapList.get(pos.RoomId)
            if(room){
                if(room.NeedTicket>0){
                    UIMgr.I.tip('无法直接传送前往该地点')
                    return
                }
            }
            if(pos.RoomId==GD.role.data.RoomId && pos.WorldLv==GD.role.data.WorldLv){
                if(pos.LineId==GD.role.data.LineId){
                    //本线路
                    if(IsImmediate){
                        GD.player.setMoveMotion(false)
                        let req = outer_pb.JoinLineAct.create();
                        req.EndPos=[pos.I,pos.J]
                        let buff = outer_pb.JoinLineAct.encode(req).finish();
                        WS.send(MT.GoToPosImmediate,buff)
                    }else{
                        GD.player.tryNaveToCell(pos.I,pos.J);
                    }
                }else{
                    //换线前往
                    let req = outer_pb.JoinLineAct.create();
                    req.LineId=pos.LineId;
                    req.EndPos=[pos.I,pos.J]
                    req.IsImmediate=IsImmediate
                    let buff = outer_pb.JoinLineAct.encode(req).finish();
                    WS.send(MT.ChangeLine,buff)
                }
            }else{
                if(isVip&&IsImmediate==false){
                    let room = GD.MapList.get(pos.RoomId)
                    if(room){
                        if(GD.role.hasEnoughGold(room.NeedGold[0])==false) return
                    }
                }
                //pointIndex=-1表示到该地图的默认出生点
                BattleManager.I.joinLine(pos.WorldLv,pos.RoomId,-1,pos.LineId,[pos.I,pos.J],IsImmediate)
            }
        }
        this.hide();
    }
    hide=()=>{
        if(this.showStack.length>0){
            this.views.selectedIndex = this.showStack.pop()
            // this.showStack.pop().active=true
        }else{
            this.data=null;
            this.node.active=false;
            this.info.string=''
            this.roleBox.removeAllChildren();
            UIMgr.I.resumCurPage()
        }
        this.richText.string=''
        this.shopItem=null;
        BattleManager.I.lastClickTime=Date.now()/1000;
        this.bossRich.string=''
    }
    showBossInfo(index:number,data:any,msg:string){
        this.bossRich.string=msg
        this.show(index,data)
    }
    showHunShowInfo(data:HunShou,fuTiCb:(data:HunShou)=>void,upStarCb:(data:HunShou)=>void,fjHun:(num:number)=>void){
        this.node.active=true;
        this.views.selectedIndex=PopViewType.ItemInfo;
        this.data=data;
        this.info.string=''
        this.infoActBtn.off(Node.EventType.TOUCH_END)
        this.leftActBtn.off(Node.EventType.TOUCH_END)
        this.rightActBtn.off(Node.EventType.TOUCH_END)
        this.infoActBtn.active=this.leftActBtn.active=this.rightActBtn.active=true;
        let label=this.infoActBtn.children[0].getComponent(Label)
        this.infoActBtn.on(Node.EventType.TOUCH_END,()=>{
            //附体
            fuTiCb(data);
            this.hide();
        })
        this.leftActBtn.on(Node.EventType.TOUCH_END,()=>{
            //分解
            const max = Math.min(data.num,99999)
            this.showSliderBox(`确定分解<color=${ct.purple}>${data.star}星【魂兽】${data.data.Name}</>？<br/><color=${ct.gray}>分解后可得：魂兽碎片x${data.data.BaseNum*Math.pow(5,data.star-1)}/只</>`,ct.red,max,'分解',fjHun)
        })
        this.rightActBtn.on(Node.EventType.TOUCH_END,()=>{
            //升星
            upStarCb(data);
            this.hide();
        })
        label.string='附体'
        this.richText.string=Tools.getHunShouPros(data,true);
        Tools.resetInfoFrameHeight(this.richText,this.itemInfoFram,0);
    }
    afterClickHideCb:()=>void
    curShowItemType:ShowItemType=0;
    show(index:number,data:any,isChatItem:boolean=true,itemType:ShowItemType=0,btnStr:string='',btnHandler:(data:any)=>void=null,afterClickHideCb:()=>void=null,clickHide:boolean=true){
        this.afterClickHideCb=afterClickHideCb;
        GameManager.I.playOpenSound();
        this.node.active=true;
        this.infoMode=0;
        // let pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(touchPos.x,touchPos.y))
        this.views.selectedIndex=index
        this.data=data;
        this.info.string=''
        if(index==PopViewType.ItemInfo){
            this.leftActBtn.active=this.rightActBtn.active=false;
            this.leftActBtn.off(Node.EventType.TOUCH_END)
            this.rightActBtn.off(Node.EventType.TOUCH_END)
            this.infoActBtn.off(Node.EventType.TOUCH_END)
            if(isChatItem){
                //点击聊天信息链接，显示道具信息
                this.infoActBtn.active=false
                let item = data as outer_pb.IDropItem;
                if(item.ItemType==1){
                    //装备
                    let equip = item.EquipData;
                    Tools.showEquip(equip,this.richText,null)
                }else{
                    //道具
                    Tools.showItem(item.ItemId,item.ItemNum,this.richText,null)
                }
            }else{
                if(btnStr!=''){
                    this.infoActBtn.active=true;
                    let label=this.infoActBtn.children[0].getComponent(Label)
                    if(btnHandler){
                        this.infoActBtn.on(Node.EventType.TOUCH_END,()=>{
                            clickHide&&this.hide();
                            btnHandler(data);
                        })
                    }
                    label.string=btnStr
                }else{
                    this.infoActBtn.active=false;
                }
                if(itemType==ShowItemType.Skill){
                    Tools.showSkill(data,this.richText)
                }else if(itemType==ShowItemType.Equip){
                    Tools.showEquip(data,this.richText,null)
                }else if(itemType==ShowItemType.Item){
                    Tools.showItem(data.Id,data.Num,this.richText,null)
                }else if(itemType==ShowItemType.NpcShopEquip){
                    let item=data as ShopItem;
                    let equip = GD.shopEquips.get(item.Id)
                    Tools.showEquip(equip,this.richText,null,item)
                }else if(itemType==ShowItemType.NpcShopItem){
                    let item=data as ShopItem;
                    Tools.showItem(item.Id,1,this.richText,null,item)
                }else if(itemType==ShowItemType.Msg){
                    this.richText.string = data;
                }else if(itemType==ShowItemType.RequestJoinZm){
                    this.richText.string = data.str;
                }else if(itemType==ShowItemType.TradeEquip){
                    Tools.showEquip(data.Equip,this.richText,null)
                }else if(itemType==ShowItemType.TradeItem){
                    Tools.showItem(data.Id,data.Num,this.richText,null)
                }
            }
            Tools.resetInfoFrameHeight(this.richText,this.itemInfoFram,0);
            // this.itemInfoFramTrans.height = this.richText.node.getComponent(UITransform).height+40;
        }else if(index==PopViewType.MenuBtns){
            //点击名字，显示操作名字的按钮组
            this.curShowItemType=itemType
            this.info.string=data.Name
            if(GD.friendList){
                this.setFriendBtnLabel();
            }else{
                this.getFriends();
            }
        }else if(index==PopViewType.PayBox){
            //购买点数页面
            let arr=[]
            GD.PayMoneyNums.forEach(obj=>{
                let jf=''
                if(GD.role.data.IsYkMode==false){
                    jf=` + <color=#B3FF77>${obj.Amount}积分</>`
                }
                arr.push(`<color=${ct.yellow}>${obj.Amount}元</> = ${obj.Point}点${jf}`)
            })
            let AmountTypeStrs=arr;
            this.payTypesList.array = AmountTypeStrs;
            this.payTypesList.selectedIndex=0
            this.payBtn.off(Node.EventType.TOUCH_END)
            this.payBtn.on(Node.EventType.TOUCH_END,()=>{
                btnHandler(this.payTypesList.selectedIndex);
                this.hide();
            })
            this.payInfoRich.string=payInfo
            let obj={
                "Items":[
                    outer_pb.DropItem.create({
                        Uid:'777',
                        ItemId:70,
                        ItemNum:1,
                        ItemType:2,
                    })
                ]
            }
            this.payInfoRich.node.getComponent(RichTextHandler).data=obj
        }else if(index==PopViewType.KdBtns){
            //点击矿洞格子，显示设置类型按钮组
            this.views.node.children[PopViewType.KdBtns].children.forEach((btn,index)=>{
                btn.off(Node.EventType.TOUCH_END)
                btn.on(Node.EventType.TOUCH_END,()=>{
                    this.hide();
                    btnHandler(index+1);
                })
            })
        }else if(index==PopViewType.TeamRolesForPos){
            //点击队伍阵型设置，显示队伍成员列表
            const myTeam = GD.role.myTeam
            Tools.renderTeamRoles(this.TeamPosBox,myTeam.OwnerId,myTeam.Menbers)
            this.TeamPosBox.children.forEach((node,index)=>{
                node.off(Node.EventType.TOUCH_END)
                if(index<myTeam.Menbers.length){
                    node.on(Node.EventType.TOUCH_END,()=>{
                        this.hide();
                        btnHandler(index);
                    })
                }
            })
        }else if(index==PopViewType.GotoBtns){
            //点击坐标，显示“前往”按钮 
            this.info.string=`${Tools.getMapName(data)}`
            this.gotoBtn1.active = GD.role.hasEnoughLv(10,false);
            let str1=''
            let str2=''
            let color1=ct.qing
            let color2=ct.yellow
            let room = GD.MapList.get(data.RoomId)
            if(room){
                if(room.NeedTicket>0){
                    str2=str1='(无法传送进入)'
                    color1=ct.red
                }else{
                    if(GD.role.hasGoldYk(false)){
                        str1='(免费)'
                        color1=ct.green
                    }else{
                        str1=`(钻石x${GD.configs.get(ConfigType.GotoPosNeedDia)})`
                    }
                    if(data.RoomId!=GD.role.data.RoomId){
                        str2=`(金币x${room.NeedGold[0]})`
                    }else{
                        str2='(免费)'
                        color2=ct.green
                    }
                }
            }
            
            let label=this.gotoBtn1.children[0].getComponent(Label)
            label.string=str1
            label.color.fromHEX(color1)
            label=this.gotoBtn2.children[0].getComponent(Label)
            label.string=str2
            label.color.fromHEX(color2)
        }else if(index==PopViewType.BodyBox){
            UIMgr.I.pauseHideCurPage();
            //显示other的装备消息
            Tools.get_UI_Role(data,this.roleBox,true).then((role:RoleUIControl)=>{
                role.updateAllEquipUI(data.BodyEquips,data.RoleType,true);
                this.bodyNodes.children.forEach((node,index)=>{
                    if(index>0){
                        let equip = data.BodyEquips[index]
                        Tools._refreshBodySlotNode(node,equip,false)
                    }
                })
            });
            // Tools.getOtherUIBox(data.Name,data.Lv,data.DsLv,data.ZsNum,data.RoleType,this.roleBox,data.ChIdLv).then((role:PlayerControl)=>{
            //     role.updateAllEquipUI(data.BodyEquips,data.RoleType,true);
            //     this.bodyNodes.children.forEach((node,index)=>{
            //         if(index>0){
            //             let equip = data.BodyEquips[index]
            //             Tools._refreshBodySlotNode(node,equip,false)
            //         }
            //     })
            //     role.effectLayer.children.forEach(node=>{
            //         node.active = false;
            //     })
            // });
            this.tanHeMzBtn.active=this.zmBtns.active = false
            this.switchOwnerBtn.off(Node.EventType.TOUCH_END)
            this.hitOutBtn.off(Node.EventType.TOUCH_END)
            this.tanHeMzBtn.off(Node.EventType.TOUCH_END)
            if(itemType==ShowItemType.ZmMenber){
                //盟主操作成员按钮
                if(GD.role.myZm.Owner==GD.role.data.Name){
                    this.zmBtns.active=true;
                    this.changeJobToggle.isChecked=false;
                    let id = data.Id;
                    this.switchOwnerBtn.on(Node.EventType.TOUCH_END,()=>{
                        UIMgr.I.PopView.showMsgBox([new BoxMsg(`<br/>确定将盟主转让给【${data.Name}】？`,ct.brown)],'转让',(d:string)=>{
                            let req = outer_pb.ZmAct.create();
                            req.Id=id;
                            let buff = outer_pb.ZmAct.encode(req).finish();
                            WS.send(MT.SwitchZmOwner,buff,(d:any)=>{
                                let rsp=outer_pb.ZmAct.decode(d);
                                if(rsp.ErrCode==Err.ErrCode_Success){
                                    UIMgr.I.tip('转让成功',ct.green)
                                    let info = GD.role.myZm.Menbers.find(info=>{return info.Id==GD.role.data.Id})
                                    if(info){
                                        info.Job=rsp.NewJob;
                                    }
                                    info = GD.role.myZm.Menbers.find(info=>{return info.Id==rsp.Id})
                                    if(info){
                                        info.Job=ZmJobType.MengZhu;
                                        GD.role.myZm.Owner=info.Name
                                    }
                                    UIMgr.I.ZmPage.getComponent(ZmPage).setMemberList.array=GD.role.myZm.Menbers;
                                    // UIMgr.I.ZmPage.getComponent(ZmPage).resetMyZmUI(GD.role.myZm)
                                }else{
                                    UIMgr.I.tip('转让失败')
                                }
                            })
                            this.hide()
                        },'取消')
                    })
                    this.hitOutBtn.on(Node.EventType.TOUCH_END,()=>{
                        UIMgr.I.PopView.showMsgBox([new BoxMsg(`<br/>确定将【${data.Name}】踢出战盟？`,ct.brown)],'踢出',(d:string)=>{
                            let req = outer_pb.ZmAct.create();
                            req.Id=id;
                            let buff = outer_pb.ZmAct.encode(req).finish();
                            WS.send(MT.HitOutFromMyZm,buff,(d:any)=>{
                                let rsp=outer_pb.ZmAct.decode(d);
                                if(rsp.ErrCode==Err.ErrCode_Success){
                                    UIMgr.I.tip('踢出成功',ct.green)
                                    let i=GD.role.myZm.Menbers.findIndex(m=>{return m.Id==rsp.Id})
                                    GD.role.myZm.Menbers.splice(i,1)
                                    UIMgr.I.ZmPage.getComponent(ZmPage).setMemberList.array=GD.role.myZm.Menbers;
                                    // UIMgr.I.ZmPage.getComponent(ZmPage).resetMyZmUI(GD.role.myZm)
                                    BattleManager.I.refreshOtherNameLabel(rsp.Who,'')
                                }else{
                                    UIMgr.I.tip('踢出失败')
                                }
                            })
                            this.hide()
                        },'取消')
                    })
                    this.changeJobTab.selectedHandler=(node,index)=>{
                        let req = outer_pb.ZmAct.create();
                        req.Id=id;
                        req.NewJob=index;
                        let buff = outer_pb.ZmAct.encode(req).finish();
                        WS.send(MT.ChangeZmMenberJob,buff,(d:any)=>{
                            let rsp=outer_pb.ZmAct.decode(d);
                            if(rsp.ErrCode==Err.ErrCode_Success){
                                UIMgr.I.tip('任命成功',ct.green)
                                let info = GD.role.myZm.Menbers.find(info=>{return info.Id==rsp.Id})
                                if(info){
                                    info.Job=rsp.NewJob;
                                }
                                UIMgr.I.ZmPage.getComponent(ZmPage).setMemberList.array=GD.role.myZm.Menbers;
                            }else{
                                UIMgr.I.tip('任命失败')
                            }
                        })
                        this.hide()
                    }
                }else if(data.Name==GD.role.myZm.Owner){
                    let mz = GD.role.myZm.Menbers.find(info=>{return info.Name==GD.role.myZm.Owner});
                    let today = (Date.now()/60000+480)/1440>>0;
                    // console.log(data.Name,today,mz.QdDay)
                    if(mz&&today-mz.QdDay>=7){
                        this.tanHeMzBtn.active=true
                        this.tanHeMzBtn.on(Node.EventType.TOUCH_END,()=>{
                            UIMgr.I.PopView.showMsgBox([new BoxMsg(`<br/>确定弹劾盟主【${data.Name}】？<br/>弹劾成功后，贡献最多的成员成为新的盟主`,ct.brown)],'弹劾',(d:string)=>{
                                WS.send(MT.TanHeMz,GD.EmptyRequestBuff,(d:any)=>{
                                    let rsp=outer_pb.ZmAct.decode(d);
                                    if(rsp.ErrCode==Err.ErrCode_Success){
                                        GD.role.myZm.Owner=rsp.Owner
                                        mz.Job=ZmJobType.Normal;
                                        UIMgr.I.ZmPage.getComponent(ZmPage).setMemberList.array=GD.role.myZm.Menbers;
                                        // UIMgr.I.ZmPage.getComponent(ZmPage).resetMyZmUI(GD.role.myZm)
                                        UIMgr.I.tip(`弹劾成功，贡献最多的[${rsp.Owner}]成为新的盟主`,ct.green)
                                    }else{
                                        UIMgr.I.tip('弹劾失败')
                                    }
                                })
                                this.hide()
                            },'取消')
                        })
                    }
                }
            }
        }
    }
    setPos(touchPos:Vec3,node:Node){
        let pos:Vec3 = node.position
        pos.x=touchPos.x
        pos.y=touchPos.y
        node.position=pos;
    }
}


