import { _decorator, Component, EventTouch, Node } from 'cc';
import { UIMgr } from '../managers/UIMgr';
const { ccclass, property } = _decorator;

@ccclass('BasePage')
export class BasePage extends Component {
    @property(Node)
    bg:Node;
    // reShowPage:PageType=PageType.None
    onLoad(): void {
        if(this.bg){
            this.bg.on(Node.EventType.TOUCH_END,this.onBgClick,this);
        }
    }
    onBgClick(event:EventTouch){
        UIMgr.I.hideCurPage();
    }
    initData(data:any){}
    onHide(){}
}


