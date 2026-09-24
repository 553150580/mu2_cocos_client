import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Data')
export class Data extends Component {
    data:any; //用于绑定数据的组件
}


