import { _decorator, EventTouch, Label, Node, Toggle } from 'cc';
import { List } from '../UiComps/List';
import { BasePage } from './BasePage';
import { Tab } from '../UiComps/Tab';
import WS from '../base/net';
import { ConfigType, Err, MT } from '../base/MT';
import GD from '../base/GameData';
import { UIMgr } from '../managers/UIMgr';
import Tools from '../base/tools';
import { BoxMsg, ct, Item } from '../base/types';
import { CkHelpStr, EquipTypeStr, ItemTypeStr } from '../base/consts';
import { ShowItemType } from './PopView';
import GameManager from '../managers/GameManager';
const { ccclass, property } = _decorator;

class CkInfo{
    id:number;
    name:string;
    gold:number;
    dia:number;
    muPoint:number;
    equips:outer_pb.IEquip[];
    items:outer_pb.IItem[];
    cap:number=0;
}
@ccclass('CkPage')
export class CkPage extends BasePage {
    @property(List)
    roleList:List
    @property(List)
    itemList:List
    @property(Tab)
    tab:Tab
    @property(Toggle)
    bagTypeToggle:Toggle
    @property(Tab)
    bagItemTypeTab:Tab
    @property(Toggle)
    ckTypeToggle:Toggle
    @property(Tab)
    ckItemTypeTab:Tab
    @property(Node)
    cancel1:Node
    @property(Node)
    cancel2:Node
    @property(Node)
    cancelAll1:Node
    @property(Node)
    cancelAll2:Node

    @property(Toggle)
    ckManyToggle:Toggle;
    
    @property(Label)
    capLabel:Label
    @property(Label)
    goldLabel:Label
    @property(Label)
    diaLabel:Label
    @property(Label)
    pointLabel:Label
    @property(Node)
    pushGoldBtn:Node
    @property(Node)
    popGoldBtn:Node
    @property(Node)
    pushDiaBtn:Node
    @property(Node)
    popDiaBtn:Node
    @property(Node)
    pushPointBtn:Node
    @property(Node)
    popPointBtn:Node
    @property(Node)
    bagBox:Node;
    @property(Node)
    bagBg:Node
    @property(List)
    bagList:List;
    @property(Tab)
    bagTab:Tab;
    @property(Toggle)
    manyToggle:Toggle;
    @property(Node)
    pushBtn:Node;
    @property(Node)
    helpBtn:Node
    @property(Node)
    addCap:Node
    @property(Node)
    setDefaultBtn:Node

    ckMaps:Map<string,outer_pb.CkAct>=new Map();
    selectedCk:CkInfo;
    selectedItem:any;
    selectedRoleNode:Node;

    selectedEquipNode:Node
    selectedIndexList:number[]=[];
    isCkItem:boolean;//true表示仓库item，false表示背包item
    ye:string='余额不足'
    onLoad(): void {
        super.onLoad()
        this.node.on('refreshBag',this.refreshBag)
        this.node.on('cancelToggle',this.cancelBagToggle)
        this.bagTab.selectedHandler=(node:Node,index:number)=>{
            // this.manyToggle.isChecked=false;
            if(index==0){
                this.bagItemTypeTab.labels = EquipTypeStr;
                // this.manyToggle.node.active=true;
                this.bagList.array = GD.role.BagEquips.sort(Tools.sortBagEquip);
            }else{
                this.bagItemTypeTab.labels = ItemTypeStr;
                // this.manyToggle.node.active=false;
                this.bagList.array = GD.role.BagItems
            }
            this.bagItemTypeTab.select(0)
            this.manyToggle.isChecked=false
        }
        this.manyToggle.node.on('toggle',(toggle:Toggle)=>{
            this.bagList.isMultiple = toggle.isChecked;
            const type=this.bagTab.selectedIndex
            if(toggle.isChecked==false){
                if(this.selectedIndexList.length>0){
                    let curCk = this.selectedCk
                    if(type==0){
                        //批量存入装备
                        let uids:Array<string>=[];
                        this.selectedIndexList.forEach(i=>{
                            let equip = this.bagList.array[i]  as outer_pb.IEquip
                            uids.push(equip.Uid)
                        })
                        let req = outer_pb.CkAct.create();
                        req.UidList=uids;
                        req.Id=curCk.id;
                        let buff = outer_pb.CkAct.encode(req).finish();
                        WS.send(MT.MoveMyBagEquipIntoCk,buff,(d:any)=>{
                            let rsp = outer_pb.CkAct.decode(d);
                            if(rsp.ErrCode==Err.ErrCode_Success){
                                rsp.UidList.forEach(uid=>{
                                    let equip = GD.role.tryDeleteBagEquip(uid)
                                    if(equip){
                                        curCk.equips.push(equip);
                                    }
                                })
                                this.refreshBag();
                                this.ckItemTypeTab.select(0)
                                this.refreshCapLabel(curCk)
                                UIMgr.I.tip('存入成功',ct.green)
                            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughCap){
                                UIMgr.I.tip('仓库容量不足')
                            }else{
                                UIMgr.I.tip('操作失败')
                            }
                        })
                    }else{
                        //批量存入道具
                        let ids:Array<number>=[];
                        this.selectedIndexList.forEach(i=>{
                            let item = this.bagList.array[i]  as Item;
                            const id=item.Id
                            if(id!=5&&id!=6) ids.push(id);
                        })
                        if(ids.length>0){
                            let req = outer_pb.CkAct.create();
                            req.Ids = ids;
                            req.Id = curCk.id;
                            let buff = outer_pb.CkAct.encode(req).finish();
                            WS.send(MT.MoveMyManyBagItemsIntoCk,buff,(d:any)=>{
                                let rsp=outer_pb.CkAct.decode(d);
                                if(rsp.ErrCode==Err.ErrCode_Success){
                                    rsp.Ids.forEach(id=>{
                                        let item = GD.role.tryDeleteItem(id)
                                        if(item){
                                            curCk.items.push({Id:item.Id,Num:item.Num});
                                        }
                                    })
                                    this.refreshBag();
                                    this.itemList.refresh();
                                    UIMgr.I.tip('存入成功',ct.green)
                                }else{
                                    UIMgr.I.tip('存入失败')
                                }
                            })
                        }
                    }
                }
                this.setSelectedNull();
            }else if(type==1){
                this.selectedIndexList=[]
                //并过滤背包道具的选择
                this.bagList.array.forEach((item:Item,index:number)=>{
                    if(item.Id!=5&&item.Id!=6){
                        this.selectedIndexList.push(index);
                    }
                })
                this.bagList.refresh();
            }
        },this);
        this.bagList.cellRender = (node:Node,index:number)=>{
            this.renderList(this.bagTab,this.bagList,node,index)
        }
        this.bagList.selectedHandler = (node:Node,index:number)=>{
            this.listSelectedHander(this.bagTab,this.bagList,node,index,false);
        }
        this.cancelAll2.on(Node.EventType.TOUCH_END,()=>{this.setSelectedNull();this.refreshBag()},this)
        this.cancel2.on(Node.EventType.TOUCH_END,this.cancelBagToggle,this)
        this.cancel1.on(Node.EventType.TOUCH_END,this.cancelCkToggle,this)
        this.cancelAll1.on(Node.EventType.TOUCH_END,()=>{this.setSelectedNull();this.itemList.refresh();},this)
        this.ckManyToggle.node.on('toggle',(toggle:Toggle)=>{
            let type = this.tab.selectedIndex;
            if(toggle.isChecked==false){
                if(this.selectedIndexList.length>0){
                    let curCk = this.selectedCk
                    if(type==0){
                        //批量取出装备
                        let uids:Array<string>=[];
                        this.selectedIndexList.forEach(i=>{
                            let equip = this.itemList.array[i]  as outer_pb.IEquip
                            uids.push(equip.Uid)
                        })
                        let req = outer_pb.CkAct.create();
                        req.UidList=uids;
                        req.Id=curCk.id;
                        let buff = outer_pb.CkAct.encode(req).finish();
                        WS.send(MT.MoveCkEquipIntoMyBag,buff,(d:any)=>{
                            let rsp = outer_pb.CkAct.decode(d);
                            if(rsp.ErrCode==Err.ErrCode_Success){
                                rsp.UidList.forEach(uid=>{
                                    let i = curCk.equips.findIndex(e=>{return e.Uid==uid;})
                                    if(i>-1){
                                        let equip = curCk.equips.splice(i,1)[0];
                                        GD.role.getEquip(equip)
                                    }
                                })
                                if(this.ckItemTypeTab.selectedIndex>0){
                                    this.ckItemTypeTab.select(this.ckItemTypeTab.selectedIndex)
                                }else{
                                    this.itemList.refresh();
                                }
                                this.refreshCapLabel(curCk)
                                UIMgr.I.tip('取出成功',ct.green)
                            }else if(rsp.ErrCode==Err.ErrCode_NotEnoughCap){
                                UIMgr.I.tip('背包容量不足')
                            }else{
                                UIMgr.I.tip('操作失败')
                            }
                        })
                    }else{
                        //批量取出道具到背包
                        let ids:Array<number>=[];
                        this.selectedIndexList.forEach(i=>{
                            let item = this.itemList.array[i]  as Item;
                            const id=item.Id
                            ids.push(id);
                        })
                        if(ids.length>0){
                            let req = outer_pb.CkAct.create();
                            req.Ids = ids;
                            req.Id = curCk.id;
                            let buff = outer_pb.CkAct.encode(req).finish();
                            WS.send(MT.MoveManyCkItemsIntoMyBag,buff,(d:any)=>{
                                let rsp=outer_pb.CkAct.decode(d);
                                if(rsp.ErrCode==Err.ErrCode_Success){
                                    rsp.Ids.forEach(id=>{
                                        let i = curCk.items.findIndex(e=>{return e.Id==id;})
                                        if(i>-1){
                                            let item=curCk.items.splice(i,1)[0];
                                            GD.role.getBagItem(item.Id,item.Num,false)
                                        }
                                    })
                                    this.itemList.refresh();
                                    UIMgr.I.tip('取出成功',ct.green)
                                }else{
                                    UIMgr.I.tip('取出失败')
                                }
                            })
                        }
                    }
                }
                this.setSelectedNull();
            }else{
                this.selectedIndexList=[]
                if(type==1){
                    //并过滤背包道具的选择
                    this.itemList.array.forEach((item:Item,index:number)=>{
                        if(item.Id!=5&&item.Id!=6){
                            this.selectedIndexList.push(index);
                        }
                    })
                }
                this.itemList.refresh();
            }
            this.itemList.isMultiple = toggle.isChecked;
        },this);
        this.bagItemTypeTab.selectedHandler=(node:Node,index)=>{
            this.setSelectedNull();
            Tools.filterBagLit(this.bagTypeToggle,node,this.bagTab.selectedIndex,index,this.bagList,false)
            GD.playClickSound()
        }
        this.ckItemTypeTab.selectedHandler=(node:Node,index)=>{
            this.setSelectedNull();
            this.ckTypeToggle.isChecked=false;
            this.ckTypeToggle.node.children[1].getComponent(Label).string=node.children[1].getComponent(Label).string;
            if(this.tab.selectedIndex==0){
                if(index==0){
                    this.itemList.array=this.selectedCk.equips.sort(this.sortEquip);
                }else{
                    this.itemList.array = this.selectedCk.equips.filter(equip=>{
                        let itemType = equip.Id/10000>>0;
                        return itemType == index;
                    }).sort(this.sortEquip);
                }
            }else{
                if(index==0){
                    this.itemList.array=this.selectedCk.items
                }else{
                    this.itemList.array = this.selectedCk.items.filter(Item=>{
                        let itemType = GD.ItemBaseDatas.get(Item.Id).ItemType;
                        return itemType == index;
                    })
                }
            }
            GD.playClickSound()
        }
        this.tab.selectedHandler=(node:Node,index:number)=>{
            // this.ckManyToggle.isChecked=false;
            if(this.selectedCk){
                if(index==0){
                    this.ckItemTypeTab.labels = EquipTypeStr;
                    // this.ckManyToggle.node.active=true;
                    this.capLabel.node.parent.active=true
                    this.refreshCapLabel(this.selectedCk)
                    this.itemList.array = this.selectedCk.equips.sort(this.sortEquip);
                }else{
                    this.ckItemTypeTab.labels = ItemTypeStr;
                    // this.ckManyToggle.node.active=false;
                    this.capLabel.node.parent.active=false
                    this.itemList.array = this.selectedCk.items
                }
                this.ckItemTypeTab.select(0)
            }else{
                this.ckItemTypeTab.labels ='全部'
                this.itemList.array = []
                UIMgr.I.tip('请先选择一个角色仓库')
            }
            this.ckManyToggle.isChecked=false
        }
        this.roleList.array=[];
        this.roleList.selectedHandler = (node:Node,index:number)=>{
            let r:outer_pb.CkRole = this.roleList.array[index];
            this.selectedRoleNode&&(this.selectedRoleNode.children[0].active=false);
            this.selectedRoleNode=node
            node.children[0].active = true
            this.getRoleCk(r.Id)
            this.resetSetDefaultBtn(r.Id)
        }
        this.roleList.cellRender = (node:Node,index:number)=>{
            let r:outer_pb.CkRole = this.roleList.array[index];
            node.children[0].active = this.roleList.selectedIndex==index
            let label = node.children[1].getComponent(Label);
            if(r.Id==GD.role.data.Id){
                label.string='【我的仓库】';
            }else{
                label.string=r.Name;
            }
            node.children[2].active = r.Id==GD.role.data.DefaultCk
        };
        this.itemList.cellRender = (node:Node,index:number)=>{
            this.renderList(this.tab,this.itemList,node,index)
        }
        this.itemList.selectedHandler = (node:Node,index:number)=>{
            this.listSelectedHander(this.tab,this.itemList,node,index,true);
        }
        this.addCap.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            if(this.selectedCk){
                let msg = `每次可为<color=${ct.blue}>当前角色仓库</>永久增加<color=${ct.blue}>5格</>容量上限<br/><color=${ct.gray}>(最大容量上限为100)</><br/><br/>每次需要<color=${ct.brown}>${GD.configs.get(ConfigType.AddCkCapNeedMuPoint)}点</>（额外赠送<color=${ct.yellow}>100万金币</>)<br/>`
                UIMgr.I.PopView.showMsgBox([new BoxMsg(msg,ct.white)],'增加',this.doAddCap,'取消')
            }else{
                UIMgr.I.tip('请先选择一个角色仓库')
            }
        },this);
        this.pushBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            if(this.selectedCk){
                this.bagBox.active=true
                this.bagTab.select(0)
                GameManager.I.playOpenSound()
            }else{
                UIMgr.I.tip('请先选择一个角色仓库')
            }
        },this);
        this.bagBg.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            this.bagBox.active=false
            GameManager.I.playOpenSound()
        },this);
        this.pushGoldBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            if(!this.selectedCk)return;
            if(GD.role.data.Gold as number>0){
                this.showSliderBox(1,false)
            }else{
                UIMgr.I.tip(this.ye)
            }
        },this);
        this.popGoldBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            if(!this.selectedCk)return;
            if(this.selectedCk.gold>0){
                this.showSliderBox(1,true)
            }else{
                UIMgr.I.tip(this.ye)
            }
        },this);
        this.pushDiaBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            if(!this.selectedCk)return;
            if(GD.role.data.Dia as number>0){
                this.showSliderBox(2,false)
            }else{
                UIMgr.I.tip(this.ye)
            }
        },this);
        this.popDiaBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            if(!this.selectedCk)return;
            if(this.selectedCk.dia>0){
                this.showSliderBox(2,true)
            }else{
                UIMgr.I.tip(this.ye)
            }
        },this);
        this.pushPointBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            if(!this.selectedCk)return;
            if(GD.role.data.MuPoint as number>0){
                this.showSliderBox(3,false)
            }else{
                UIMgr.I.tip(this.ye)
            }
        },this);
        this.popPointBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            if(!this.selectedCk)return;
            if(this.selectedCk.muPoint>0){
                this.showSliderBox(3,true)
            }else{
                UIMgr.I.tip(this.ye)
            }
        },this);
        this.helpBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            GD.playClickSound();
            UIMgr.I.PopView.showHelpBox(CkHelpStr)
        },this);
        this.setDefaultBtn.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
            GD.playClickSound();
            if(GD.role.data.DefaultCk==this.selectedCk.id||GD.role.hasBaseYk()){
                let msg:string;
                if(this.selectedCk.id==GD.role.data.DefaultCk){
                    msg=`<br/>是否取消默认仓库功能？<br/><color=${ct.gray}>(取消后，在角色背包内点“存仓库”将存入当前角色仓库)</>`
                }else{
                    msg=`<br/>是否将【${this.selectedCk.name}】的仓库设为默认仓库？<br/><color=${ct.gray}>(设置后，在角色背包内点“存仓库”将存入该默认仓库)</>`
                }
                UIMgr.I.PopView.showMsgBox([new BoxMsg(msg,ct.white)],'确认',(pass:string)=>{
                    let req = outer_pb.CkAct.create();
                    req.Id=this.selectedCk.id;
                    let buff = outer_pb.CkAct.encode(req).finish();
                    WS.send(MT.SetDefaultCkId,buff,(d:any)=>{
                        let rsp = outer_pb.CkAct.decode(d);
                        if(rsp.ErrCode==Err.ErrCode_Success){
                            GD.role.data.DefaultCk=rsp.Id
                            this.resetSetDefaultBtn(this.selectedCk.id)
                            UIMgr.I.tip('设置成功!',ct.green)
                            this.roleList.refresh();
                        }else{
                            UIMgr.I.tip('设置失败，特权卡角色的仓库才能被设置为默认仓库')
                        }
                    })
                },'取消')
            }
        },this);
    }
    resetSetDefaultBtn=(id:number)=>{
        const show=id==GD.role.data.DefaultCk;
        let setStr='设为默认'
        let color=ct.brown
        if(show){
            color=ct.red
            setStr='取消默认'
        }
        let label=this.setDefaultBtn.children[0].getComponent(Label)
        label.string=setStr;
        label.color.fromHEX(color)
    }
    sortEquip=(equip1:outer_pb.IEquip,equip2:outer_pb.IEquip)=>{
        if(equip1.IsLock){
            return -1;
        }
        if(equip2.IsLock){
            return 1;
        }
        return equip1.Id-equip2.Id
    }
    doAddCap=()=>{
        if(this.selectedCk){
            if(this.selectedCk.cap<GD.configs.get(ConfigType.MaxAddCkCap)+GD.role.getMaxCkCap()){
                let req = outer_pb.CkAct.create();
                req.Id=this.selectedCk.id;
                let buff = outer_pb.CkAct.encode(req).finish();
                WS.send(MT.AddCkCap,buff,(d:any)=>{
                    let rsp = outer_pb.CkAct.decode(d);
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        if(rsp.Cost)GD.role.reduceMuPoint(rsp.Cost);
                        if(rsp.Gold)GD.role.addGold(rsp.Gold,true)
                        this.selectedCk.cap=rsp.Cap
                        this.refreshCapLabel(this.selectedCk)
                        UIMgr.I.tip('增加成功!',ct.green)
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughCap){
                        UIMgr.I.tip('已达容量上限!')
                    }else if(rsp.ErrCode==Err.ErrCode_RoleHasNotCache){
                        UIMgr.I.tip('该角色仓库未加载，请先登录一次该角色')
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughMuPoint){
                        UIMgr.I.tip('点数不足')
                    }else{
                        UIMgr.I.tip('无法增加')
                    }
                })
            }else{
                UIMgr.I.tip('已达容量上限')
            }
        }
    }
    refreshBag=()=>{
        if(this.bagBox.active){
            Tools.filterBagLit1(this.bagTab.selectedIndex,this.bagItemTypeTab.selectedIndex,this.bagList,false)
            // this.bagItemTypeTab.select(this.bagItemTypeTab.selectedIndex)
            // if(this.bagItemTypeTab.selectedIndex>0){
            //     this.bagItemTypeTab.select(this.bagItemTypeTab.selectedIndex)
            // }else{
            //     // this.bagList.refresh();
            //     if(this.bagTab.selectedIndex==0){
            //         this.bagList.array = GD.role.BagEquips
            //     }else{
            //         this.bagList.array = GD.role.BagItems
            //     }
            // }
        }
    }
    cancelCkToggle=()=>{
        this.selectedIndexList=[];
        this.ckManyToggle.isChecked=false;
    }
    cancelBagToggle=()=>{
        if(this.bagBox.active){
            this.selectedIndexList=[];
            this.manyToggle.isChecked=false;
        }
    }
    refreshCapLabel(ck:CkInfo){
        this.capLabel.string = `${ck.equips.length}/${ck.cap}`;
    }
    btnHandler=(item:Item)=>{
        if(item&&this.selectedCk){
            if(this.isCkItem){
                //取出仓库物品
                if(this.tab.selectedIndex==0){
                    let curCk = this.selectedCk
                    let equip = item as outer_pb.IEquip
                    let req = outer_pb.CkAct.create();
                    req.UidList=[equip.Uid];
                    req.Id=curCk.id;
                    let buff = outer_pb.CkAct.encode(req).finish();
                    WS.send(MT.MoveCkEquipIntoMyBag,buff,(d:any)=>{
                        let rsp = outer_pb.CkAct.decode(d);
                        if(rsp.ErrCode==Err.ErrCode_Success){
                            let i = curCk.equips.findIndex(e=>{return e.Uid==equip.Uid;})
                            if(i>-1){
                                curCk.equips.splice(i,1);
                            }
                            if(this.ckItemTypeTab.selectedIndex>0){
                                this.ckItemTypeTab.select(this.ckItemTypeTab.selectedIndex)
                            }else{
                                this.itemList.refresh();
                            }
                            GD.role.getEquip(equip,false)
                            this.refreshCapLabel(curCk)
                            UIMgr.I.tip('取出成功',ct.green)
                        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughCap){
                            UIMgr.I.tip('背包容量不足')
                        }else{
                            UIMgr.I.tip('暂时无法取出')
                        }
                    })
                    this.setSelectedNull();
                }
            }else{
                //把我背包物品存入仓库
                if(this.bagTab.selectedIndex==0){
                    let curCk = this.selectedCk
                    let equip = item as outer_pb.IEquip
                    let req = outer_pb.CkAct.create();
                    req.UidList=[equip.Uid];
                    req.Id=curCk.id;
                    let buff = outer_pb.CkAct.encode(req).finish();
                    WS.send(MT.MoveMyBagEquipIntoCk,buff,(d:any)=>{
                        let rsp = outer_pb.CkAct.decode(d);
                        if(rsp.ErrCode==Err.ErrCode_Success){
                            GD.role.tryDeleteBagEquip(equip.Uid)
                            this.refreshBag();
                            curCk.equips.push(equip);
                            this.ckItemTypeTab.select(0)
                            this.refreshCapLabel(curCk)
                            UIMgr.I.tip('存入成功',ct.green)
                        }else if(rsp.ErrCode==Err.ErrCode_NotEnoughCap){
                            UIMgr.I.tip('仓库容量不足')
                        }else{
                            UIMgr.I.tip('操作失败')
                        }
                    })
                    this.setSelectedNull();
                }
            }
        }else{
            UIMgr.I.tip('请先选择一个仓库')
        }
    }
    renderList(tab:Tab,list:List,node:Node,index:number){
        let item:any = list.array[index];
        Tools.renderBagItem(tab.selectedIndex,item,node)
        this.refreshCellSkin(node,index,list);
        node.children[4].active = tab.selectedIndex==0&&item.IsLock;
    }
    listSelectedHander(tab:Tab,list:List,node:Node,index:number,isCkItem:boolean){
        let item = list.array[index];
        // if(isCkItem==false){
        //     item=item.data;
        // }
        if(tab.selectedIndex==0){
            if(item.IsLock&&this.selectedCk.id!=GD.role.data.Id){
                UIMgr.I.tip('该装备已锁定，无法被存取至其它仓库或角色背包')
                return
            }
        }
        if(list.isMultiple){
            const i = this.selectedIndexList.indexOf(index);
            if(i==-1){
                this.selectedIndexList.push(index);
            }else{
                this.selectedIndexList.splice(i,1);
            }
            this.refreshCellSkin(node,index,list);
        }else{
            //单选
            let old = this.selectedEquipNode;
            this.selectedEquipNode=node;
            this.selectedItem=item;
            old&&this.refreshCellSkin(old,-1,list);
            this.isCkItem=isCkItem;

            let it = isCkItem?(this.tab.selectedIndex==0?ShowItemType.Equip:ShowItemType.Item):(this.bagTab.selectedIndex==0?ShowItemType.Equip:ShowItemType.Item);
            if(it==ShowItemType.Equip){
                UIMgr.I.PopView.show(0,this.selectedItem,false,it,isCkItem?'取出':'存入',this.btnHandler)
            }else{
                //取出或存入指定数量的道具
                this.showSliderBox(0,isCkItem)
            }
        }
        GD.playClickSound()
    }
    onSliderOk=(num:number)=>{
        if(this.curSliderType==0&&(this.selectedItem==null||this.selectedCk==null))return
        if(num>this.curMaxSliderValue){
            num=this.curMaxSliderValue
        }
        if(num<=0){
            UIMgr.I.tip('数量必须大于0')
        }else{
            let curCk = this.selectedCk;
            let req = outer_pb.CkAct.create();
            if(this.curSliderType==0){
                if(num>this.selectedItem.Num)return
                req.ItemId=this.selectedItem.Id;
            }
            req.Id = curCk.id;
            req.ActType=this.curSliderType;
            req.ActNum=num;
            let isGet=this.isGet
            let buff = outer_pb.CkAct.encode(req).finish();
            let msgType = isGet?MT.MoveCkItemsIntoMyBag:MT.MoveMyBagItemsIntoCk;
            WS.send(msgType,buff,(d:any)=>{
                let rsp = outer_pb.CkAct.decode(d);
                if(rsp.ErrCode==Err.ErrCode_Success){
                    if(rsp.ActType==0){
                        let ck_item = curCk.items.find(item=>{return item.Id==req.ItemId})
                        if(isGet){
                            //从仓库取出到背包
                            if(ck_item){
                                ck_item.Num -= req.ActNum //num<0
                                if(ck_item.Num<=0){
                                    let i = curCk.items.findIndex(item=>{return item.Id==req.ItemId})
                                    if(i>-1)curCk.items.splice(i,1)
                                    if(this.ckItemTypeTab.selectedIndex>0){
                                        this.ckItemTypeTab.select(this.ckItemTypeTab.selectedIndex)
                                    }else{
                                        this.itemList.refresh();
                                    }
                                }else{
                                    this.itemList.refresh();
                                }
                            }
                            GD.role.getItem(req.ItemId,req.ActNum,false)
                        }else{
                            //从背包存入到仓库
                            GD.role.reduceItem(req.ItemId,req.ActNum)
                            this.refreshBag();
                            if(ck_item){
                                ck_item.Num += req.ActNum;
                                this.itemList.refresh();
                            }else {
                                curCk.items.push({Id:req.ItemId,Num:req.ActNum})
                            }
                            this.ckItemTypeTab.select(0)
                        }
                        UIMgr.I.tip('操作成功',ct.green)
                    }else {
                        let num = isGet ? -req.ActNum : req.ActNum
                        if(rsp.ActType==1){
                            curCk.gold += num;
                            (GD.role.data.Gold as number) += -num;
                        }else if(rsp.ActType==2){
                            curCk.dia += num;
                            (GD.role.data.Dia as number) += -num;
                        }if(rsp.ActType==3){
                            curCk.muPoint += num;
                            (GD.role.data.MuPoint as number) += -num;
                        }
                        this.refreshLabel(curCk)
                        UIMgr.I.tip('操作成功',ct.green)
                    }
                }else{
                    UIMgr.I.tip('操作失败')
                }
            })
            this.setSelectedNull();
        }
    }
    refreshLabel(curCk:CkInfo){
        this.goldLabel.string = Tools.formatMoneyString(curCk.gold);
        UIMgr.I.refreshGoldUI()
        this.diaLabel.string = Tools.formatMoneyString(curCk.dia);
        UIMgr.I.refreshDiaUI()
        this.pointLabel.string = curCk.muPoint.toLocaleString()
        UIMgr.I.refreshMuPointUI()
    }
    curMaxSliderValue:number=1
    curSliderType:number //type: 0表示item，1金币，2钻石，3点数 
    isGet:boolean=false;//是否为取？否则为存
    showSliderBox(type:number,isGet:boolean){
        if(this.selectedCk){
            this.isGet=isGet;
            this.curMaxSliderValue=1;
            this.curSliderType=type;
            let str:string=''
            let color=ct.yellow;
            let curCk=this.selectedCk;
            if(type==0){
                let item = this.selectedItem as outer_pb.IItem
                let base = GD.ItemBaseDatas.get(item.Id);
                str = `${base.Name}x${item.Num.toLocaleString()}`
                this.curMaxSliderValue=item.Num;
                if(this.curMaxSliderValue>1000000){
                    this.curMaxSliderValue=1000000
                }
            }else{
                if(type==1){
                    if(isGet){
                        this.curMaxSliderValue=curCk.gold;
                    }else{
                        this.curMaxSliderValue=GD.role.data.Gold as number;
                    }
                    str = '金币'
                }else if(type==2){
                    color=ct.qing
                    if(isGet){
                        this.curMaxSliderValue=curCk.dia;
                    }else{
                        this.curMaxSliderValue=GD.role.data.Dia as number;
                    }
                    str = '钻石'
                }else if(type==3){
                    color=ct.brown
                    if(isGet){
                        this.curMaxSliderValue=curCk.muPoint;
                    }else{
                        this.curMaxSliderValue=GD.role.data.MuPoint as number;
                    }
                    str = '点数'
                }
                if(this.curMaxSliderValue>2000000000){
                    this.curMaxSliderValue=2000000000
                }
                str = `${str}x${Tools.formatMoneyString(this.curMaxSliderValue)}`
            }
            UIMgr.I.PopView.showSliderBox(str,color,this.curMaxSliderValue,isGet?'确定取出':'确定存入',this.onSliderOk)
        }
    }
    initData(d:any) {
        // this.hideInfoBox()
        this.setSelectedNull();
        this.selectedCk=null;
        this.goldLabel.string = ''
        this.diaLabel.string = ''
        this.pointLabel.string = ''
        this.bagBox.active=false;
        // this.ckManyToggle.node.active=false;
        this.capLabel.node.parent.active=false
        this.roleList.array = []
        WS.send(MT.GetCkRoleList,GD.EmptyRequestBuff,d=>{
            let rsp = outer_pb.CkAct.decode(d);
            GD.role.data.DefaultCk=rsp.Id;
            rsp.RoleList.sort((a,b)=>{return a.Id-b.Id})
            this.roleList.array = rsp.RoleList;
            this.itemList.array=[]
            this.scheduleOnce(()=>{
                const id=GD.role.data.DefaultCk
                const hasBaseYk = GD.role.hasBaseYk(false);
                let index = rsp.RoleList.findIndex(r=>{
                    if(hasBaseYk){
                        return r.Id==(id>0?id:GD.role.data.Id)
                    }else{
                        return r.Id==GD.role.data.Id
                    }
                })
                if(index>-1){
                    this.roleList.selectedIndex=index
                }else{
                    this.roleList.selectedIndex=-1;
                }
            },0)
            
        })
    }
    showBagBox(){
        this.bagBox.active=true;
        this.bagTab.select(0)
    }
    onHide(): void {
        this.setSelectedNull();
    }
    setSelectedNull(){
        this.bagList.selectedIndex=-1;
        this.itemList.selectedIndex=-1;
        // this.selectedIndex=-1;
        this.selectedEquipNode=null;
        this.selectedItem=null;
        this.selectedIndexList=[];
    }
    refreshCellSkin=(node:Node,index:number,list:List)=>{
        let isSelected = false;
        if(list.isMultiple){
            isSelected = this.selectedIndexList.indexOf(index)>-1;
        }else{
            isSelected = this.selectedEquipNode == node;
        }
        //可显示被选中模式下，才显示选中状态背景
        node.children[0].active = list.isMultiple ? isSelected : list.showCheckmark&&isSelected;
        //多选模式下，才显示选择标记
        const check_icon = node.children[3];
        check_icon.active = list.isMultiple;
        if(check_icon.active){
            check_icon.children[0].active = isSelected;
        }
    }
    getRoleCk=(id:number)=>{
        this.selectedCk = null
        this.itemList.array=[]
        let req = outer_pb.CkAct.create();
        req.Id = id;
        let buff = outer_pb.CkAct.encode(req).finish();
        WS.send(MT.GetRoleCk,buff,this.onGetRoleCk);
    }
    onGetRoleCk=(d:any)=>{
        let rsp = outer_pb.CkAct.decode(d);
        if(rsp.ErrCode==Err.ErrCode_Success){
            let equips:outer_pb.IEquip[] = []
            for(let uid in rsp.CkEquips){
                equips.push(rsp.CkEquips[uid])
            }
            equips.sort((a:outer_pb.IEquip,b:outer_pb.IEquip):number=>{return a.Id-b.Id})
            let items:outer_pb.IItem[] = []
            for(let id in rsp.CkItems){
                items.push({Id:parseInt(id),Num:rsp.CkItems[id]})
            }
            items.sort((a:outer_pb.IItem,b:outer_pb.IItem):number=>{return a.Id-b.Id})
            let ck=new CkInfo()
            ck.name=this.roleList.array.find(info=>{return info.Id==rsp.Id;}).Name;
            ck.id=rsp.Id;
            ck.cap=rsp.Cap;
            ck.equips=equips
            ck.items=items
            ck.gold=rsp.CkGold as number
            ck.dia=rsp.CkDia as number
            ck.muPoint=rsp.CkMuPoint as number
            this.selectedCk=ck;
            this.goldLabel.string = Tools.formatMoneyString(rsp.CkGold);
            this.diaLabel.string = Tools.formatMoneyString(rsp.CkDia);
            this.pointLabel.string = rsp.CkMuPoint.toLocaleString()
            this.tab.select(this.tab.selectedIndex==-1?0:this.tab.selectedIndex);
        }else{
            UIMgr.I.tip(`暂时无法读取该角色的仓库`)
            this.selectedCk = null
            this.itemList.array=[]
        }
    }
}


