import { _decorator, EventTouch, Node } from 'cc';
import { BasePage } from './BasePage';
import { ViewStack } from '../UiComps/ViewStack';
import { Tab } from '../UiComps/Tab';
import { UIMgr } from '../managers/UIMgr';
import GD from '../base/GameData';
const { ccclass, property } = _decorator;

@ccclass('RolePage')
export class RolePage extends BasePage {
    @property(ViewStack)
    viewStack:ViewStack;
    @property(Tab)
    tab:Tab;
    @property(Tab)
    advanceTab:Tab;
    @property(ViewStack)
    advanceView:ViewStack;
    isShow:boolean=false;
    onLoad() {
        super.onLoad();
        this.tab.selectedHandler=(node:Node,index:number)=>{
            if(this.isShow){
                if(index==1||index==4)GD.playClickSound();
            }else{
                this.isShow=true;
            }
            if(index==5){
                this.advanceTab.select(0)
            }
            this.viewStack.selectedIndex=index;
        }
        this.advanceTab.selectedHandler=(node:Node,index:number)=>{
            this.advanceView.selectedIndex=index;
            GD.playClickSound();
        }
    }
    protected onEnable(): void {
        this.tab.select(0)
    }
    onBgClick(event:EventTouch){
        this.isShow=false;
        this.viewStack.selectedIndex=-1;
        UIMgr.I.hideCurPage();
    }
}


