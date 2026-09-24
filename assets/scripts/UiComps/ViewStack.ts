import { _decorator, Component, Node, Sprite, SpriteFrame, Toggle, UITransform, Widget } from 'cc';
const { ccclass, property,executeInEditMode} = _decorator;

@ccclass('ViewStack')
@executeInEditMode(true)
export class ViewStack extends Component {
    @property
    get selectedIndex(){
        return this._selectedIndex;
    }
    set selectedIndex(index:number){
        if(index!=this.selectedIndex&&index<this.node.children.length){
            this._selectedIndex = index;
            this.node.children.forEach((node:Node,i:number)=>{
                node.active = i==index;
            })
        }
    }
    @property
    _selectedIndex:number=-1;
    // selectedHandler:(index:number)=>void; 
}
