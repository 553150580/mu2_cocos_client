import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MonsterPointControl')
export class MonsterPointControl extends Component {
    @property(Label)
    idLabel:Label;
    idList:Array<number>=[];
    protected onLoad(): void {
        let strArr = this.idLabel.string.trim().split(',');
        strArr.forEach(v=>{
            this.idList.push(parseInt(v))
        })
    }
}


