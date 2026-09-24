import { _decorator, Label, Node, RichText, Toggle } from 'cc';
import { BasePage } from './BasePage';
import { List } from '../UiComps/List';
import { Tab } from '../UiComps/Tab';
import { ViewStack } from '../UiComps/ViewStack';
import GD from '../base/GameData';
import { ChengHao, ChenghaoColors, ct, ItemBase, ItemType } from '../base/types';
import Tools from '../base/tools';
import { UIMgr } from '../managers/UIMgr';
const { ccclass, property } = _decorator;

@ccclass('ChengHaoPage')
export class ChengHaoPage extends BasePage {
    @property(List)
    myList:List
    @property(List)
    allList:List
    @property(Tab)
    tab:Tab
    @property(ViewStack)
    view:ViewStack
    @property(Node)
    add:Node
    @property(Node)
    reduce:Node
    @property(Label)
    showLv:Label

    lv:number=1;
    checkToggle:Toggle;
    static I:ChengHaoPage;
    onLoad(): void {
        ChengHaoPage.I=this;
        super.onLoad();
        this.tab.selectedHandler=(node,index)=>{
            this.view.selectedIndex=index;
            if(index==0){
                this.myList.array=GD.role.ChengHao;
            }else{
                this.refreshAll()
            }
        }
        this.add.on(Node.EventType.TOUCH_END,()=>{
            if(this.lv<10){
                this.lv++
                this.refreshAll()
                GD.playClickSound()
            }else{
                UIMgr.I.tip('满级为10级')
            }
        })
        this.reduce.on(Node.EventType.TOUCH_END,()=>{
            if(this.lv>1){
                this.lv--
                this.refreshAll()
                GD.playClickSound()
            }
        })
        this.myList.array=[];
        // this.myList.selectedHandler = (node:Node,index:number)=>{
        //     let data:ChengHao = this.myList.array[index];
        //     UIMgr.I.PopView.show(1,data,false,ShowItemType.Item,'展示')
        // }
        this.myList.cellRender = (node:Node,index:number)=>{
            let ch:ChengHao = this.myList.array[index];
            let rich=node.children[1].getComponent(RichText)
            let data=GD.ItemBaseDatas.get(ch.Id)
            this.renderCh(rich,data,ch.Lv,ch.CurLvExp)
            let toggle=node.children[2].getComponent(Toggle)
            toggle.node.off('toggle')
            toggle.isChecked = GD.role.data.ChIdLv.length==2 && ch.Id==GD.role.data.ChIdLv[0]
            toggle.node.on('toggle',(t:Toggle)=>{
                if(GD.role.data.ChIdLv.length==0){
                    GD.role.data.ChIdLv=[0,0]
                }
                if(t.isChecked){
                    GD.role.data.ChIdLv[0]=ch.Id;
                    if(this.checkToggle)this.checkToggle.isChecked=false;
                    this.checkToggle=t;
                    GD.curMap.updatePlayerChengHaoUi()
                }else {
                    if(GD.role.data.ChIdLv[0]==ch.Id){
                        GD.role.data.ChIdLv[0]=0;
                        GD.curMap.updatePlayerChengHaoUi()
                    }
                    this.checkToggle=null;
                }
                this.myList.refresh();
            })
        }
        this.allList.cellRender = (node:Node,index:number)=>{
            let data:ItemBase = this.allList.array[index];
            let rich=node.children[1].getComponent(RichText)
            this.renderCh(rich,data,this.lv)
        }
        this.initAllList();
    }
    renderCh(rich:RichText,data:ItemBase,lv:number,exp:number=0){
        let lvExp:string;
        if(lv<10){
            lvExp=`经验值：${exp}/${Math.pow(2,lv)}`
        }else{
            lvExp='满级'
        }
        // let reward='';
        // if(isMyList==false){
        //     const chQuestId = ItemIdToChLv0Id[data.Id]
        //     let quest = GD.QuestDatas.get(chQuestId+lv-1)
        //     let obj={Items:[]}
        //     reward = `<br/><color=${ct.green}>【任务奖励】：</>${Tools.getRewardsStr(quest.RewardItems,obj,quest).join('、')}`;
        //     rich.getComponent(RichTextHandler).data=obj
        // }
        rich.string =`【<color=${ChenghaoColors[data.Id-100]}>${data.Name}</>】：Lv.${lv} (${lvExp})<br/>【称号属性】：<color=${ct.blue}>${Tools.getChengHaoPro(data.Id,lv)}</><br/>【获取途径】：${data.Info}`
    }
    refreshAll(){
        this.showLv.string=`${this.lv}级`
        this.allList.refresh()
    }
    initAllList(){
        let arr:Array<ItemBase>=[]
        GD.ItemBaseDatas.forEach((item:ItemBase)=>{
            if(item.ItemType==ItemType.ChengHao) arr.push(item)
        })
        this.allList.array=arr;
    }
    initData(data: any): void {
        this.tab.select(0)
    }
    onHide(){
        this.myList.array=[]
    }
}


