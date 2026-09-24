import { _decorator, CCInteger, Component, Enum, instantiate, Node, ScrollView, UITransform, Vec3, CCBoolean, ToggleContainer, director, Director, Toggle, Prefab, NodeEventType, EventTarget, EventMouse, EventTouch, Widget, CCString } from 'cc';
const { ccclass, property,executeInEditMode,playOnFocus} = _decorator;

export enum DirectionType{
    Vertical,
    Horizontal,
}
Enum(DirectionType);

@ccclass('List')
@executeInEditMode(true)
// @playOnFocus(true)
export class List extends Component { 
    @property(CCString)
    labels:string='';
    @property(CCInteger)
    max_pool_len:number=10;

    @property({type:DirectionType})
    get directionType(){
        return this._directionType;
    }
    set directionType(value:DirectionType){
        this._directionType = value;
        this._isDirty=true;
    }
    @property
    _directionType:DirectionType=DirectionType.Vertical;

    @property(CCInteger)
    get row(){
        return this._row;
    }
    set row(value:number){
        this._row = value;
        this._isDirty=true;
    }
    @property(CCInteger)
    _row:number;

    @property(CCInteger)
    get col(){
        return this._col;
    }
    set col(value:number){
        this._col = value;
        this._isDirty=true;
    }
    @property(CCInteger)
    _col:number;

    @property(CCInteger)
    get spaceX(){
        return this._spaceX;
    }
    set spaceX(value:number){
        this._spaceX = value;
        this._isDirty=true;
    }
    @property(CCInteger)
    _spaceX:number=10;

    @property(CCInteger)
    get spaceY(){
        return this._spaceY;
    }
    set spaceY(value:number){
        this._spaceY = value;
        this._isDirty=true;
    }
    @property(CCInteger)
    _spaceY:number=10;

    @property(CCInteger)
    get cell_width(){
        return this._cell_width;
    }
    set cell_width(value:number){
        this._cell_width = value;
        this._isDirty=true;
    }
    @property(CCInteger)
    _cell_width:number=120; 

    @property(CCInteger)
    get cell_height(){
        return this._cell_height;
    }
    set cell_height(value:number){
        this._cell_height = value;
        this._isDirty=true;
    }
    @property(CCInteger)
    _cell_height:number=120;


    @property(CCBoolean)
    get isMultiple(){
        return this._isMultiple;
    }
    set isMultiple(value:boolean){
        this._isMultiple = value;
        this._isDirty=true;
    }
    @property(CCBoolean)
    _isMultiple:boolean=false;

    @property(CCBoolean)
    showCheckmark:boolean=true;//是否显示被选中状态

    @property(CCBoolean)
    isReverseY:boolean=false;//是否反向排列
    @property(CCBoolean)
    isChatList:boolean=false;//是否是聊天信息列表(单列、Cell高度不固定)

    get array(){
        return this._array;
    }
    set array(datas:Array<any>){
        if(datas){
            this._array = datas;
            //延迟渲染
            this._isDirty=true;
        }
    }
    private _array:Array<any>=[1];

    get selectedIndex(){
        return this._selectedIndex;
    }
    set selectedIndex(index:number){
        this._selectedIndex = index;
        // if(index>-1 && index<this.array.length && this.selectedHandler){
        //     this.selectedHandler(this.list.content.children[index],index);
        // }
        if(index>-1 && index<this.list.content.children.length && this.selectedHandler){
            this.selectedHandler(this.list.content.children[index],index);
        }
    }
    private _selectedIndex:number=-1;

    private _item_temp:Node;
    private _pool:Array<Node>=[];
    private _list_trans:UITransform;
    private _content_trans:UITransform;
    private _isDirty:boolean=false;
    // item_trans:UITransform; 
    cellRender:(node:Node,index:number)=>void;
    selectedHandler:(node:Node,index:number)=>void;

    list:ScrollView;
    onLoad() {
        this.list = this.getComponent(ScrollView);
        this._content_trans = this.list.content.getComponent(UITransform); 
        this._list_trans = this.getComponent(UITransform);
        this._item_temp = this.list.content.children[0];
        const item_trans = this._item_temp.getComponent(UITransform);
        item_trans.width = this._cell_width; 
        item_trans.height = this._cell_height;
        if(this._directionType==DirectionType.Vertical){
            this.list.vertical=true;
            this.list.horizontal=false;
            this._content_trans.width = this._cell_width*this._col+this._spaceX*(this._col-1);
        }else {
            this.list.vertical=false;
            this.list.horizontal=true;
            this._content_trans.height = this._cell_height*this._row+this._spaceX*(this._row-1);
        }
        if(this.labels&&this.labels.length>0){
            this.array = this.labels.split(',');
        }
    }
    protected onEnable(): void {
        director.on(Director.EVENT_BEFORE_DRAW, this.updateLayout, this);
    }
    updateLayout(){
        if(this._isDirty){
            this._isDirty=false;
            if(this.isChatList){
                this._refreshAll_chatList()
            }else{
                this._refreshAll(); 
            }
        }
    }
    onSelected(event: EventTouch){
        let node = event.currentTarget as Node;
        const index = this.list.content.children.indexOf(node);
        this._selectedIndex = index;
        this.selectedHandler&&this.selectedHandler(node,index);
    }
    private _refreshAll(){
        const data_len = this._array.length;
        const node_len = this.list.content.children.length;
        const need_num = data_len-node_len;
        if(need_num>=0){
            //添加不足的node
            for(let i=0;i<need_num;i++){
                let node:Node;
                if(this._pool.length>0){
                    node = this._pool.pop();
                }else{
                    node = instantiate(this._item_temp);
                }
                this.list.content.addChild(node);
            }
        }else{
            //删除回收多余的node
            for(let i=0;i<-need_num;i++){
                let node = this.list.content.children[this.list.content.children.length-1];//每次循环都是删除最后一个
                node.removeFromParent();
                this._pool.push(node);
                node.off(NodeEventType.TOUCH_END,this.onSelected,this);
            }
        }
        //计算容器 
        if(this._directionType==DirectionType.Vertical){
            this._content_trans.height = (this._cell_height+this._spaceY)*Math.ceil(data_len/this._col);
            this.list.vertical = this._content_trans.height>this._list_trans.height;
            if(this.isReverseY){
                this.list.content.getComponent(Widget).top = this._list_trans.height-this._content_trans.height+this._spaceY;
            }
        }else {
            this._col = Math.ceil(data_len/this._row);
            this._content_trans.width = this._cell_width*Math.ceil(data_len/this._row);
            this.list.horizontal = this._content_trans.width>this._list_trans.width;
        }
        if(data_len==0)return;
        //布局所有node并渲染数据
        for(let index=0;index<data_len;index++){
            let node = this.list.content.children[index];
            let trans = node.getComponent(UITransform);
            trans.width=this._cell_width;
            trans.height=this._cell_height;
            node.on(NodeEventType.TOUCH_END,this.onSelected,this);
            const i = index%this._col;
            const x = i*this._cell_width+i*this._spaceX;
            let j = (index/this._col>>0);
            if(this.isReverseY){
                j = data_len-1-j;
            }
            const y = j*this._cell_height+j*this._spaceY;
            node.setPosition(new Vec3(x,-y,0));
            this.cellRender&&this.cellRender(node,index);
        }
    }
    private _refreshAll_chatList(){
        const data_len = this._array.length;
        const node_len = this.list.content.children.length;
        const need_num = data_len-node_len;
        if(data_len>0&&need_num>=0){
            //添加不足的node
            for(let i=0;i<need_num;i++){
                let node:Node;
                if(this._pool.length>0){
                    node = this._pool.pop();
                }else{
                    node = instantiate(this._item_temp);
                }
                this.list.content.addChild(node);
            }
        }else{
            //删除回收多余的node
            for(let i=0;i<-need_num;i++){
                let node = this.list.content.children[this.list.content.children.length-1];//每次循环都是删除最后一个
                node.removeFromParent();
                this._pool.push(node);
                // node.off(NodeEventType.TOUCH_END,this.onSelected,this);
            }
        }
        //布局所有node并渲染数据
        let curY:number=0
        let h:number=0;
        for(let index=0;index<data_len;index++){
            let node = this.list.content.children[index];
            this.cellRender&&this.cellRender(node,index);
            let trans = node.getComponent(UITransform);
            let y = trans.height+index*this._spaceY;
            let pos:Vec3=node.position
            pos.y=-curY
            node.position=pos
            curY += y;
            h += y
        }
        //计算容器 
        this._content_trans.height = h;
        let is = h>this._list_trans.height;
        this.list.vertical = is
        if(is){
            this._content_trans.node.getComponent(Widget).top=this._list_trans.height-h;
        }
    }
    // getItem(index:number):Node{
    //     if(index>-1&&index<this.list.content.children.length){
    //         return this.list.content.children[index];
    //     }
    // }
    addOne(item:any){
        if(item){
            this._array.push(item);
            this._isDirty=true;
        }
    }
    addMany(items:any[]){
        if(items&&items.length){
            items.forEach(i=>{this._array.push(i);})
            this._isDirty=true;
        }
    }
    deleteOne(index:number){
        if(index>-1){
            this._array.splice(index,1);
            this._isDirty=true;
        }
    }
    deleteAll(){
        this._array.splice(0);
        this._isDirty=true;
    }
    deleteMany(index_list:number[]){
        if(index_list.length>0){
            //排好序，保证从后往前删
            index_list.sort((a, b) => b - a);
            index_list.forEach(i=>{
                this._array.splice(i,1);
            })
            this._isDirty=true;
        }
    }
    sortBy(cb:(a:any,b:any)=>number){
        this._array.sort(cb);
        this._isDirty=true;
    }
    refresh(){
        this._isDirty=true;
    }
    scrollToTop=()=>{
        this.list.stopAutoScroll();
        this.list.scrollToTop();
        this._content_trans.node.getComponent(Widget).top=0;
    }
    clearPool(){
        this._pool=[]
    }
}


