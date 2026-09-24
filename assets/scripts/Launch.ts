import { _decorator, CCString, Component, director, Enum, Node, profiler, sys } from 'cc';
import Loading from './Loading';
import GD from './base/GameData';
const { ccclass, property } = _decorator;
/**
 * 平台类型枚举
 */
export enum PlatformType 
{
    none,
    pc,
    wx,
    tt,
    qq,
    oppo,
    vivo,
}
/**
 * 游戏平台配置
 */
@ccclass('PlatformConfig')
export default class PlatformConfig {
    /**
     * 平台类型
     */
    @property({type:Enum(PlatformType),displayName:"平台类型"})
    public type:PlatformType = PlatformType.none;
    /**
     * 游戏appid
     */
     @property({displayName:"游戏appid"})
    public appId:string = "";
    /**
     * 游戏密匙
     */
     @property({displayName:"游戏密匙"})
    public secret:string = "";
    /**
     * 视频广告
     */
    @property({type:CCString,displayName:"视频广告"})
    public videoAd_unitIds:string[] = ["","","","",""];
    /**
     * 横幅广告
     */
     @property({type:CCString,displayName:"横幅广告"})
    public bannerAd_unitIds:string[] = ["","","","",""];
}
@ccclass('Launch')
export class Launch extends Component {
    @property({type:Enum(PlatformType),displayName:"选择平台"})
    public type:PlatformType = PlatformType.pc;
    @property({type:[PlatformConfig],displayName:"各个平台的配置"})
    public platformConfigs:PlatformConfig[]=[];
    // protected onLoad(): void {
    //     profiler.hideStats(); //关闭fps信息
    // }
    start() {
        //初始化配置
        let platformConfig:PlatformConfig;
        for(var i = 0 ; i < this.platformConfigs.length ; i++){
            if(this.platformConfigs[i].type == this.type){
                platformConfig = this.platformConfigs[i];
            }
        }
        console.log("当前选择的游戏平台为 ",PlatformType[this.type]);
        //TODO 根据配置初始化

        if(sys.isNative){
            //加载热更新场景
            director.loadScene("Update");
        }else{
            //配置完启动参数后，跳转到登陆界面 
            GD.initGameSet().then(v=>{
                Loading.loadScene("Login");
            })
        }
    }
}


