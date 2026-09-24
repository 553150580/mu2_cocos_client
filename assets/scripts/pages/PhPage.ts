// import { _decorator, Label, Node } from 'cc';
// import { Tab } from '../UiComps/Tab';
// import { ViewStack } from '../UiComps/ViewStack';
// import { List } from '../UiComps/List';
// import { BasePage } from './BasePage';
// import WS from '../base/net';
// import { Err, MT } from '../base/MT';
// import { UIMgr } from '../managers/UIMgr';
// import Tools from '../base/tools';
// import GD from '../base/GameData';
// import { AtkZyTypes, BoxMsg, ct, DefZyTypes, MiniRoleInfo, RewordNameObj, WingZyPros, WingZyTypes } from '../base/types';
// import { ShowItemType } from './PopView';
// const { ccclass, property } = _decorator;

// @ccclass('PhPage')
// export class PhPage extends BasePage {
//     @property(Tab)
//     tab:Tab;
//     @property(ViewStack)
//     viewStack:ViewStack;
//     @property(Tab)
//     roleTypeTab:Tab;
//     @property(List)
//     lvList:List;
//     @property(Tab)
//     cjTypeTab:Tab;
//     @property(List)
//     cjList:List;
//     @property(Node)
//     prePage:Node;
//     @property(Node)
//     nextPage:Node;
//     @property(Label)
//     page:Label;
//     @property(Label)
//     info1:Label;

//     pageNum:number=1;
//     totalPageNum:number=1;
//     lvPhStepStr:string='每隔5分钟重排名次'
//     curCjPhDatas:Array<MiniRoleInfo>=[];//冲级排行每页10个
//     onLoad(): void {
//         super.onLoad()
//         for(let i=0;i<10;i++){
//             this.curCjPhDatas.push({Name:'',Id:0,Sort:i})
//         }
//         // this.cjTypeTab.select(0)
//         // this.cjList.array=this.curCjPhDatas
//         this.tab.selectedHandler=(node:Node,index:number)=>{
//             if(index==0){
//                 this.cjTypeTab.select(0)
//                 this.viewStack.selectedIndex=0;
//                 this.info1.string=''
//             }else {
//                 this.viewStack.selectedIndex=1;
//                 this.info1.string=this.lvPhStepStr;
//                 if(GD.role.hasEnoughLv(220)){
//                     this.roleTypeTab.select(0)
//                 }else{
//                     this.lvList.array=[];
//                 }
//             }
//         }
//         this.prePage.on(Node.EventType.TOUCH_END,()=>{
//             if(this.pageNum>1){
//                 this.pageNum--
//                 this.getLvPh()
//             }
//             GD.playClickSound()
//         })
//          this.nextPage.on(Node.EventType.TOUCH_END,()=>{
//             if(this.pageNum<this.totalPageNum){
//                 this.pageNum++
//                 this.getLvPh()
//             }
//             GD.playClickSound()
//         })
//         this.roleTypeTab.selectedHandler=(node,index)=>{
//             this.pageNum=1
//             if(this.tab.selectedIndex==0||GD.role.hasEnoughLv(220)){
//                 this.getLvPh()
//             }
//             GD.playClickSound()
//         }
//         this.cjTypeTab.selectedHandler=(node,index)=>{
//             this.pageNum=1
//             this.getLvPh()
//             GD.playClickSound()
//         }
//         this.lvList.cellRender=(node,index)=>{
//             let info:outer_pb.ILvPhInfo=this.lvList.array[index]
//             let sortLabel=node.children[0].getComponent(Label);
//             sortLabel.string=`第${info.Sort+1}名`
//             let zm=''
//             if (info.Zm !=''){
//                 zm = `[${info.Zm}] `
//             }
//             let nameLabel = node.children[1].getComponent(Label);
//             nameLabel.string=`${zm}${info.Name}`
//             let lv:string
//             if(this.tab.selectedIndex==1){
//                 if(info.ZsNum>0){
//                     lv=`${info.ZsNum}转${info.Lv}级`
//                 }else{
//                     lv=`${info.Lv}级`
//                 }
//             }else{
//                 lv=`大师${info.DsLv}级`
//             }
//             let lvLabel=node.children[2].getComponent(Label)
//             lvLabel.string=''
//             lvLabel.string=lv
//             let color=ct.white
//             if(info.Sort==0){
//                 color=ct.red
//             }else if(info.Sort==1){
//                 color=ct.yellow
//             }else if(info.Sort==2){
//                 color=ct.green
//             }else if(info.Sort<10){
//                 color=ct.blue
//             }
//             nameLabel.color.fromHEX(color)
//             sortLabel.color.fromHEX(color) 
//             lvLabel.color.fromHEX(color)
//         }
//         this.lvList.selectedHandler=(node:Node,index:number)=>{
//             let info=this.lvList.array[index]
//             UIMgr.I.PopView.show(1,info,false)
//         } 
//     }
//     getCjReward=(id:number,zyType:number)=>{
//         let req = outer_pb.JfAct.create();
//         req.Id=id;//选择的自选道具的id（如果有）
//         req.Type=zyType;
//         req.GotIndex=this.cjTypeTab.selectedIndex;//哪个等级的排行奖励
//         let buff = outer_pb.JfAct.encode(req).finish();
//         WS.send(MT.GetMyFirstLvReword,buff,(d:any)=>{
//             let rsp = outer_pb.JfAct.decode(d);
//             if(rsp.ErrCode==Err.ErrCode_Success){
//                 let msglist:Array<BoxMsg>=[]
//                 msglist.push(new BoxMsg('获得冲级排行奖励<br/>',ct.white))
//                 if(rsp.Items.length>0){
//                     rsp.Items.forEach(item=>{
//                         msglist.push(GD.role.getItem(item.Id,item.Num,true,false,'',true))
//                     })
//                 }
//                 if(rsp.Equips.length>0){
//                     rsp.Equips.forEach(equip=>{
//                         msglist.push(GD.role.getEquip(equip,true,true))
//                     })
//                 }
//                 if(msglist.length>0){
//                     UIMgr.I.PopView.showMsgBox(msglist)
//                 }
//                 this.hasGotCurLvCjRewargd=true
//                 this.cjList.refresh();
//                 UIMgr.I.tip('领取成功',ct.green)
//             }else{
//                 UIMgr.I.tip('领取失败')
//             }
//         })
//     }
//     getLvPh=()=>{
//         let req=outer_pb.GetPhAct.create()
//         req.Type=this.tab.selectedIndex
//         if(req.Type==0){
//             //冲级等级阶段排行
//             req.RoleType=this.cjTypeTab.selectedIndex
//         }else{
//             //职业排行
//             req.RoleType=Math.pow(2,this.roleTypeTab.selectedIndex)
//         }
//         req.Page=this.pageNum;
//         let buff = outer_pb.GetPhAct.encode(req).finish()
//         WS.send(MT.GetPh,buff,this.onGetPh)
//     }
//     hasGotCurLvCjRewargd:boolean=false;
//     onGetPh=(d:any)=>{
//         let rsp = outer_pb.GetPhAct.decode(d)
//         if(rsp.ErrCode==Err.ErrCode_Success){
//             if(rsp.Type==0){
//                 this.hasGotCurLvCjRewargd=rsp.HasGot;
//                 let list = rsp.CjPhList.sort((a,b)=>{return a.Time-b.Time});
//                 const n=list.length;
//                 this.curCjPhDatas.forEach((data,index)=>{
//                     if(index<n){
//                         let info = list[index]
//                         data.Name=info.Name;
//                         data.Id=info.Id;
//                         data.Sort=info.Sort;
//                     }else{
//                         data.Name=''
//                         data.Id=0
//                         data.Sort=(this.pageNum-1)*10+index
//                     }
//                 })
//                 this.cjList.cellRender=this.cjListCellRender;
//                 this.cjList.array=this.curCjPhDatas;
//                 this.totalPageNum=5;
//             }else{
//                 this.lvList.array=rsp.LvPhList
//                 this.totalPageNum=rsp.TotalPage;
//             }
//             this.pageNum=rsp.Page;
//             this.page.string=`${this.pageNum}/${this.totalPageNum}`
//         }else{
//             UIMgr.I.tip('获取数据失败')
//             this.pageNum=1;
//         }
//     }
//     cjListCellRender=(node,index)=>{
//         let info:MiniRoleInfo=this.cjList.array[index]
//         let sortLabel=node.children[0].getComponent(Label);
//         // const sortIndex = (this.pageNum-1)*10+index
//         const sort = info.Sort
//         sortLabel.string=`第${sort+1}名`

//         let nameLabel = node.children[1].getComponent(Label);
//         let nameColor=ct.gray;
//         let color=ct.white
//         if(sort==0){
//             color=ct.red
//         }else if(sort==1){
//             color=ct.yellow
//         }else if(sort==2){
//             color=ct.brown
//         }else if(sort<10){
//             color=ct.green
//         }else if(sort<30){
//             color=ct.blue
//         }else {
//             color=ct.white
//         }
//         if(info.Id>0){
//             nameColor=color
//             nameLabel.string=info.Name
//         }else{
//             nameColor=ct.gray
//             nameLabel.string='虚位以待'
//         }
//         nameLabel.color.fromHEX(nameColor)
//         sortLabel.color.fromHEX(color) 

//         let items=[]
//         let data = GD.FirstRewardList[sort];
//         // console.log('sort',sort,data);
//         let rewards=data.Rewards[this.cjTypeTab.selectedIndex];
//         const len = rewards.length
//         if(len>0){
//             rewards.forEach(v=>{
//                 const id = v[0]
//                 const num = v[1]
//                 let name:string
//                 const item = outer_pb.MailItem.create()
//                 let equip:outer_pb.IEquip;
//                 let color:ct
//                 if(id<10000){
//                     name = GD.ItemBaseDatas.get(id).Name
//                     item.Type=1
//                     color=Tools.getItemColor(id)
//                 }else{
//                     name = GD.EquipBaseDatas.get(id).Name
//                     equip = outer_pb.Equip.create()
//                     equip.Id=id
//                     equip.Lv=0
//                     equip.Exp=0
//                     if(id==220000){
//                         equip.YsList=[5,0] //勋章：随机属性类型、元素类型
//                     }
//                     item.Type=0
//                     color=ct.purple
//                 }
//                 item.Id=id
//                 item.Num=num
//                 item.Equip=equip;
//                 items.push(item)
//             })
//         }
//         let itemList = node.children[2].getComponent(List);
//         itemList.cellRender=(node:Node,index:number)=>{
//             const item:outer_pb.MailItem = itemList.array[index];
//             if(item.Type==0){
//                 Tools.renderBagItem(0,item.Equip,node)
//             }else{
//                 Tools.renderBagItem(1,item,node)
//             }
//         };
//         itemList.selectedHandler=(node:Node,index:number)=>{
//             const item:outer_pb.MailItem = itemList.array[index];
//             if(item.Type==0){
//                 UIMgr.I.PopView.show(0,item.Equip,false,ShowItemType.Equip)
//             }else{
//                 UIMgr.I.PopView.show(0,item,false,ShowItemType.Item)
//             }
//         }
//         itemList.array=items;
//         let getBtn = node.children[3];
//         getBtn.off(Node.EventType.TOUCH_END)
//         let str:string
//         let showBtn:boolean=false;
//         let btnColor:ct=ct.gray;
//         if(info.Id==GD.role.data.Id && this.hasGotCurLvCjRewargd==false){
//             showBtn=true;
//             if(this.hasGotCurLvCjRewargd){
//                 str='已领取'
//                 btnColor=ct.gray
//             }else{
//                 str='领取'
//                 btnColor=ct.green
//                 getBtn.on(Node.EventType.TOUCH_END,(event:any)=>{
//                     const hasSelectBox=rewards.some(v=>{
//                         const id = v[0];
//                         return id>=57&&id<=68
//                     })
//                     if(hasSelectBox){
//                         let obj:RewordNameObj;
//                         rewards.forEach(v=>{
//                             const id = v[0];
//                             if(id>=57&&id<=68){
//                                 obj=Tools.getRewordsSelectBoxItemNames(id)
//                             }
//                         })
//                         if(obj){
//                             UIMgr.I.PopView.showSelectBox(obj,(index:number,zyTypeIndex:number)=>{
//                                 //zyTypeIndex：1表示防御卓越属性类型，2表示攻击卓越属性类型
//                                 let zyType:number=0 
//                                 if(obj.zyType>0){
//                                     if(obj.zyType==1){
//                                         zyType = DefZyTypes[zyTypeIndex]
//                                     }else if(obj.zyType==2){
//                                         zyType = AtkZyTypes[zyTypeIndex]
//                                     }else if(obj.zyType==3){
//                                         zyType = WingZyTypes[zyTypeIndex]
//                                     }
//                                 }
//                                 this.getCjReward(obj.idList[index],zyType)
//                             });
//                         }
//                     }else{
//                         this.getCjReward(0,0)
//                     }
//                 },this);
//             }
//         }
        
//         if(showBtn){
//             let btnLabel = getBtn.children[0].getComponent(Label);
//             btnLabel.string=str
//             btnLabel.color.fromHEX(btnColor)
//         }
//         getBtn.active=showBtn;
//     }
//     initData(data: any): void {
//         this.lvList.array=[];
//         this.pageNum=1;
//         this.page.string='1/1'
//         this.tab.select(0)
//     }
//     onHide(): void {
//         this.lvList.array=[];
//     }
// }


