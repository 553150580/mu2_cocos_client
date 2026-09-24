import { _decorator, CCString, Component, Node, UIOpacity, UITransform, Vec3, Widget } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseComponent')
export class BaseComponent extends Component {
    data:any;
    private _uiTransform:UITransform = null;
    public get uiTransform():UITransform{
        if(!this._uiTransform){
            this._uiTransform = this.node.getComponent(UITransform);
        }
        return this._uiTransform;
    }
    private _widget:Widget = null;
    public get widget():Widget{
        if(!this._widget){
            this._widget = this.node.getComponent(Widget);
        }
        return this._widget;
    }
    // public get left(): number {
    //     return this.widget.left;
    // }
    // public set left(value: number) {
    //     this.widget.left = value;
    // }
    public get width(): number {
        return this.uiTransform.width;
    }
    public set width(value: number) {
        this.uiTransform.width = value;
    }
    public get height(): number {
        return this.uiTransform.height;
    }
    public set height(value: number) {
        this.uiTransform.height = value;
    }
    private _uiOpacity: UIOpacity = null;
    public get uiOpacity(): UIOpacity {
        if(!this._uiOpacity){
            this._uiOpacity = this.node.getComponent(UIOpacity);
        }
        return this._uiOpacity;
    }
    public get opacity(): number {
        return this.uiOpacity.opacity;
    }
    /**opacity值的范围是 0-255 */
    public set opacity(value: number) {
        this.uiOpacity.opacity = value;
    }
    public get scaleX(): number {
        return this.node.scale.x;
    }
    public set scaleX(value: number) {
        let scale:Vec3 = this.node.scale;
        scale.x = value
        this.node.scale=scale
    }
    public get scallY(): number {
        return this.node.scale.y;
    }
    public set scallY(value: number) {
        let scale:Vec3 = this.node.scale;
        scale.y = value
        this.node.scale=scale
    }
    // private _alpha: number = 1;
    // public get alpha(): number {
    //     return this._alpha;
    // }
    // /**alpha值的范围是 0-1 */
    // public set alpha(value: number) {
    //     this._alpha = value;
    //     this.uiOpacity.opacity = 255 * (this._alpha / 1);
    // }
    public get position(): Vec3 {
        return this.node.position;
    }
    public set position(pos: Vec3) {
        this.node.position = pos;
    }
    public get x(): number {
        return this.node.position.x;
    }
    public set x(value: number) {
        var pos:Vec3 = this.node.position;
        pos.x = value;
        this.node.position = pos;
    }
    public get y(): number {
        return this.node.position.y;
    }
    public set y(value: number) {
        var pos:Vec3 = this.node.position;
        pos.y = value;
        this.node.position = pos;
    }
    public get z(): number {
        return this.node.position.z;
    }
    public set z(value: number) {
        var pos:Vec3 = this.node.position;
        pos.z = value;
        this.node.position = pos;
    }

    public setPos(x:number,y:number) {
        var pos:Vec3 = this.node.position;
        pos.x = x;
        pos.y = y;
        this.node.position = pos;
    }
}


