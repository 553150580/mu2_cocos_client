import { _decorator, Component } from 'cc';
import { BattleManager } from './battle/BattleManager';
import GD from './base/GameData';
import GameManager from './managers/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    // @property(Label)
    // drawCall:Label;
    // @property(Label)
    // fps:Label;
    // @property(Label)
    // triangle:Label;
    // @property(Label)
    // render:Label;
    // onLoad () {
    //     profiler.hideStats(); //关闭fps信息 
    // }
    start() {
        this.init();
    }

    private init(){
        GameManager.I.set(GD.role.BagSet.Sets);
        BattleManager.I.joinLine(GD.role.data.WorldLv,GD.role.data.RoomId,-1,GD.role.data.LineId,null,false,false,true)
        // console.log('警告：盗图必究')
    }
    // lateUpdate(dt:number){
    //     let state = null;
    //     if(cclegacy.profiler.stats){
    //         state = cclegacy.profiler.stats;
    //     }else{
    //         state = cclegacy.profiler._stats;
    //     }

    //     let dc = state.draws.counter._value;
    //     let tris = state.tricount.counter._value;
    //     let fps =  state.fps.counter._averageValue;
    //     let render =  state.render.counter._averageValue;
       
    //     //director.root!.device.numDrawCalls;
    //     this.drawCall.string = "dc: " + dc + " DC: " + director.root!.device.numDrawCalls;
    //     this.fps.string = 'fps: '+fps.toFixed(2);
    //     this.triangle.string = "triangles: "+tris;
    //     this.render.string = 'render: '+render.toFixed(2);
    // }
}


