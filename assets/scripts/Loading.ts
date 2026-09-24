import { _decorator, Component, director, Label, Node, random, randomRangeInt, Sprite } from 'cc';
import WS from './base/net';

const { ccclass, property } = _decorator;
/**
 * 加载状态
 */
export enum LoadingStatus
{
    none = 0, //没有进行加载
    prepareLoading = 1,  //准备加载
    loading = 2,  //加载中
    complete = 3, //加载完毕
}
const InfoStrs:Array<string>=[
    '首次进入游戏需要加载资源，速度较慢，请耐心等待...',
    '同账号且同一个服务器下的所有角色可共享使用仓库，无手续费',
    '游戏内可通过多种方式获取钻石',
    '交易行可自由上架各种道具，甚至金币、点数，钻石可购买一切',
    '游戏初期难度大，请多点耐心，喜欢一刀999的请绕道',
    '移动角色可通过摇杆移动，也可点击地面移动',
    '点击地图上的玩家、聊天栏内玩家名字，均可弹出操作菜单',
    '游戏可自动离线托管，即使退出游戏，也会自动在服务器继续托管挂机，最长持续24小时',
    '除了奇迹点数，其它所有道具、货币都可在游戏内打到',
    '可在聊天栏内添加坐标位置、道具，分享给其它玩家'
]
/**
 * 加载游戏组件
 */
@ccclass('Loading')
export default class Loading extends Component {
    public static status:LoadingStatus = LoadingStatus.none;
    public static sceneName:string = null;

    @property(Sprite)
    bar: Sprite;
    @property(Label)
    BarLabel: Label;
    @property(Label)
    info: Label

    public currentLoad:number = 0;
    public alreadyLoad:number = 0;
    private loadScale:number = 1;
    private totalLoad:number = 100;

    private _progress: number = 0;
    public get progress(): number {
        return this._progress;
    }
    public set progress(value: number) {
        if(this._progress == value)return;
        this._progress = value;
        this.bar.fillRange = this._progress;
        this.BarLabel.string = Math.floor(this._progress * 100) + "%";
    }
    /**
     * 加载场景
     * @param sceneName 
     */
    public static loadScene(sceneName){
        if(this.status == LoadingStatus.loading) return;
        this.sceneName = sceneName;
        this.status = LoadingStatus.loading;
        director.loadScene("Loading");//打开加载过程场景
    }
    /**
     * 重新加载当前场景
     */
    public static reloadScene(){
        this.status = LoadingStatus.none;
        this.loadScene(this.sceneName);
    }
    start(){
        let server = localStorage.getItem('lastServer')
        if(server==null){
            this.info.string=InfoStrs[0];
        }else{
            this.info.string=InfoStrs[randomRangeInt(0,InfoStrs.length)];
        }
        this.bar.fillRange = 0;
        this.currentLoad = 0;
        this.alreadyLoad = 5;
        if(Loading.sceneName){
            Loading.status = LoadingStatus.loading;
            this.loadSceneRes(()=>{
                Loading.status = LoadingStatus.complete;
                this.alreadyLoad = this.totalLoad;
                this.loadScale = 2.5;
            });
        }
        this.scheduleOnce(()=>{
            if(Loading.status == LoadingStatus.loading || Loading.status == LoadingStatus.complete){
                console.error("场景加载超时！");
                Loading.reloadScene(); //重新加载
            }
        },18); //设置一定时间内判断是否加载完成，如果没加载完成则重新加载，预防资源加载卡死
    }
    //update里的逻辑是对加载进度做平滑处理
    update (dt) {
        if(this.currentLoad < this.alreadyLoad){
            this.currentLoad += dt * (50 * (this.alreadyLoad - this.currentLoad) / this.totalLoad + 50) * this.loadScale;
            if(this.currentLoad >= this.alreadyLoad){
                this.currentLoad = this.alreadyLoad;
                var limitLoad = this.totalLoad * 0.8;
                if(this.alreadyLoad < limitLoad){
                    this.alreadyLoad = this.alreadyLoad + (limitLoad - this.alreadyLoad) * (Math.random() * 0.005);              
                    if(this.alreadyLoad > limitLoad){
                        this.alreadyLoad = limitLoad;
                    }
                }             
            }
            this.progress = this.currentLoad / this.totalLoad;
            if(this.currentLoad >= this.totalLoad){
                this.scheduleOnce(this.loadSceneComp,0.1);
            }
        }
    }
    /**
     * 预加载场景
     * @param success 
     */
    private loadSceneRes(success:Function){
        // var loadingNextStep:number = 0;
        director.preloadScene(Loading.sceneName,
            null,
            // (completedCount:number, totalCount:number, item:any)=>{
            //     let curpro = Number((completedCount / totalCount).toFixed(10))
            //     if (curpro > loadingNextStep) {
            //         loadingNextStep = curpro;
            //         //this.Progress.progress = this._loadingNextStep
            //     }
            // },
            (error:Error)=>{
                if(error){
                    console.log("场景加载异常：sceneName",Loading.sceneName," error ",error);
                    Loading.reloadScene(); //重新加载
                }else{
                    console.log("加载完成");
                    success();
                }
            }
        );
    }
    private loadSceneComp(){
        //log("场景预加载完成，开始载入场景");
        director.loadScene(Loading.sceneName,()=>{
            console.log("场景" + Loading.sceneName + "加载完成");
            Loading.status = LoadingStatus.none;
            WS.curScene=Loading.sceneName
        });
    }
}


