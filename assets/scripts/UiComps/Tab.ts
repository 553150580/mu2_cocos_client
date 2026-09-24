import { _decorator, Component, instantiate, Label, Node, Vec3, UITransform, EventTouch, Widget, BlockInputEvents } from 'cc';
import { DirectionType } from './List';
// import GameManager from '../managers/GameManager';
const { ccclass, property,executeInEditMode } = _decorator;

@ccclass('Tab')
@executeInEditMode(true)
// @playOnFocus(true)
export class Tab extends Component {
    @property({type:DirectionType})
    get directionType(){
        return this._directionType;
    }
    set directionType(value:DirectionType){
        this._directionType = value;
        this._reset_trans();
    }
    @property
    _directionType:DirectionType=DirectionType.Horizontal;
    
    @property
    get labels(){
        return this._labels;
    }
    set labels(value:string){
        this._labels = value;
        this.item_temp = this.node.children[0];
        this.bind_datas(value);
        this.refreshNode();
    }
    @property
    _labels:string='1';

    @property
    get spaceX(){
        return this._spaceX;
    }
    set spaceX(value:number){
        this._spaceX = value;
        this._reset_trans();
    }
    @property
    _spaceX:number=0;

    @property
    get spaceY(){
        return this._spaceY;
    }
    set spaceY(value:number){
        this._spaceY = value;
        this._reset_trans();
    }
    @property
    _spaceY:number=0;

    @property
    get cellWidth(){
        return this._cellWidth;
    }
    set cellWidth(value:number){
        this._cellWidth = value;
        this._reset_trans();
    }
    @property
    _cellWidth:number=100;

    @property
    get cellHeight(){
        return this._cellHeight;
    }
    set cellHeight(value:number){
        this._cellHeight = value;
        this._reset_trans();
    }
    @property
    _cellHeight:number=50;

    item_temp:Node; 
    selectedHandler:(node:Node,index:number)=>void;
    // needReset:boolean=true;//用于弹出菜单点击，隐藏后重置为-1

    get selectedIndex(){
        return this._selectedIndex;
    }
    set selectedIndex(value:number){
        this._selectedIndex=value
        this.refreshNode()
    }
    private _selectedIndex:number=-1;
    selectedNode:Node;

    onLoad() {
        this.item_temp = this.node.children[0];
        this.bind_datas(this._labels);
        this.selectedNode = this.node.children[this.selectedIndex]
        this.refreshNode()
    }
    private refreshNode(){
        this.node.children.forEach((node,i)=>{
            node.children[0].active= i==this._selectedIndex;
        })
    }
    bind_datas(labels:string){
        if(labels.length>0){
            let array = labels.trim().split(',');
            if(array.length>0){
                this.node.removeAllChildren(); 
                const len = array.length;
                const isH = this._directionType==DirectionType.Horizontal;
                for(let i=0;i<len;i++){
                    const node = i==0 ? this.item_temp : instantiate(this.item_temp);
                    node.children[1].getComponent(Label).string = array[i];
                    const x = isH ? (this._cellWidth+this._spaceX)*i : 0;
                    const y = isH ? 0 : -(this._cellHeight+this._spaceY)*i;
                    node.setPosition(new Vec3(x,y,0));
                    // node.on('toggle',this.onSelected,this);
                    node.on(Node.EventType.TOUCH_START,this.onSelected)
                    this.node.addChild(node);
                }
                const trans = this.node.getComponent(UITransform); 
                trans.width = isH ? (this._cellWidth+this._spaceX)*len-this._spaceX : this._cellWidth;
                trans.height = isH ? this._cellHeight : (this._cellHeight+this._spaceY)*len-this._spaceY;
                this.node.getComponent(Widget).setDirty();
                // let block = this.node.getComponent(BlockInputEvents)
                // if(block){
                //     block.enabled=true;
                // }
            }
        }
    }
    _reset_trans(){
        const len = this.node.children.length;
        const isH = this._directionType==DirectionType.Horizontal;
        for(let i=0;i<len;i++){
            const node = this.node.children[i];
            const x = isH ? (this._cellWidth+this._spaceX)*i : 0;
            const y = isH ? 0 : -(this._cellHeight+this._spaceY)*i;
            node.setPosition(new Vec3(x,y,0));
            let trans = node.getComponent(UITransform);
            trans.width = this.cellWidth;
            trans.height = this.cellHeight;
        }
        let trans = this.node.getComponent(UITransform); 
        trans.width = isH ? (this._cellWidth+this._spaceX)*len-this._spaceX : this._cellWidth;
        trans.height = isH ? this._cellHeight : (this._cellHeight+this._spaceY)*len-this._spaceY;
    }
    onSelected=(target: EventTouch)=>{
        let node = target.currentTarget as Node
        const index = this.node.children.indexOf(node);
        // this.select(index)
        this.selectedNode&&(this.selectedNode.children[0].active=false)
        this._selectedIndex=index;
        this.selectedNode=node;
        node.children[0].active=true;
        if(this.selectedHandler){
            this.selectedHandler(node,index);
        }
    }
    select(index:number,call:boolean=true){
        this._selectedIndex=index;
        if(index>=0){
            // this._selectedIndex=index;
            this.selectedNode=this.node.children[index];
            this.refreshNode()
            if(call&&this.selectedHandler){
                this.selectedHandler(this.selectedNode,index);
            }
        }else{
            this.selectedNode=null;
            this.refreshNode()
        }
    }
    // protected onDisable(): void {
    //     if(this.needReset){
    //         this.selectedIndex=-1
    //     }
    // }
    // onSelected(toggle: Toggle){
    //     if(toggle.isChecked){
    //         const index = this.node.children.indexOf(toggle.node);
    //         this._selectedIndex=index;
    //         this.selectedNode=toggle.node;
    //         this.selectedHandler&&this.selectedHandler(toggle.node,index);
    //     }
    // }
    // select(index:number){
    //     if(index<this.node.children.length){
    //         let node = this.node.children[index]
            
    //         this._selectedIndex=index;
    //         let toggle = node.getComponent(Toggle);
    //         if(toggle.isChecked){
    //             this.selectedHandler&&this.selectedHandler(node,index);
    //         }else{
    //             toggle.isChecked=true;
    //         }
    //         this.selectedNode=node;
    //     }
    // }
}


