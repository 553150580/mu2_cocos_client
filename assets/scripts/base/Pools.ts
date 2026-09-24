import { Color, EffectAsset, Material, Node, Vec4 } from "cc";
import { DmgLabel, GetHpMpObj } from "./types";
import GD from "./GameData";

export default class Pools{
    public static tipMsgPool:Node[]=[];
    public static proMsgPool:Node[]=[];
    public static monsterPool:Node[]=[];
    public static dropItemPool:Node[]=[];
    // public static otherPool:Map<number,Array<Node>>=new Map();//地图上显示的玩家池
    public static RolePool:Array<Node>=[];//地图上显示的玩家池
    public static otherUIPool:Array<Node>=[];//UI界面显示的玩家池，与RolePool的layer不同
    public static getHpMpObj:Array<GetHpMpObj>=[];
    public static getHpMpPool:Array<Node>=[];
    public static dmgLabelPool:Array<DmgLabel>=[];
    public static skillEffectPool:Map<number,Array<Node>>=new Map();
    public static mapBlockPool:Array<Node>=[];
    public static cachedMapDataCells:Map<number,Array<Array<number>>>=new Map();

    //在重新连接后执行（防止pool里面的资源失效不可用）
    static resetPools(){
        this.tipMsgPool =[]
        this.proMsgPool=[]
        this.monsterPool=[]
        this.dropItemPool=[]
        this.RolePool=[]
        this.otherUIPool=[]
        // this.otherPool.clear();
        // this.otherUIPool.clear();
        this.dmgLabelPool=[]
        this.skillEffectPool.clear();
    }
}
// 强化等级配置接口
interface EnhancementConfig {
    rippleDensity: number;      // 波纹密度
    rippleIntensity: number;    // 波纹强度  
    baseBrightness: number;     // 基础亮度
    highlightBrightness: number;// 高亮亮度
    rippleColor: Color;         // 水波颜色
}
export class MaterialPool {
    static I: MaterialPool = new MaterialPool();
    private materialCache: Map<number, Material> = new Map();
    baseMaterial: Material | null = null;

    static async initialize(): Promise<boolean> {
        return new Promise((resolve) => {
            GD.commonBundle.load<Material>('materials/equip-effect', (err, material) => {
                if (!err) {
                    MaterialPool.I.baseMaterial = material;
                    // 预加载常用等级的材质
                    ENHANCEMENT_CONFIGS.forEach((config,level)=>{
                        MaterialPool.I._createMaterial(level);
                    })
                    resolve(true);
                } else {
                    console.error('加载基础材质失败:', err);
                    resolve(false);
                }
            });
        });
    }

    // 根据强化等级获取材质
    getMaterialForLevel(level: number): Material {
        if (!this.materialCache.has(level)) {
            this._createMaterial(level);
        }
        return this.materialCache.get(level)!;
    }
    // 创建新材质
    private _createMaterial(level: number) {
        if (!this.baseMaterial) {
            console.error('基础材质未初始化');
            return;
        }
        const config = ENHANCEMENT_CONFIGS.get(level);
        if(config){
            const material = new Material();
            material.initialize({
                effectAsset: this.baseMaterial.effectAsset,
                defines: {}
            });

            // 设置材质参数
            material.setProperty('rippleDensity', config.rippleDensity);
            material.setProperty('rippleIntensity', config.rippleIntensity);
            material.setProperty('baseBrightness', config.baseBrightness);
            material.setProperty('highlightBrightness', config.highlightBrightness);
            material.setProperty('rippleColor', config.rippleColor);
            // material.passes.forEach(pass => pass.update()); // 强制更新

            this.materialCache.set(level, material);           
        }else{
            console.error('装备材质不存在的levle:'+level)
        }
    }
    // 清理未使用的材质
    // cleanupUnusedMaterials(usedLevels: number[]) {
    //     const usedKeys = new Set(usedLevels.map(level => level));
    //     for (const [key, material] of this.materialCache) {
    //         if (!usedKeys.has(key)) {
    //             material.destroy();
    //             this.materialCache.delete(key);
    //         }
    //     }
    // }
}
// 强化等级配置
export const ENHANCEMENT_CONFIGS: Map<number, EnhancementConfig> = new Map([
    [0, {  // +0强化
        rippleDensity: 10.0,
        rippleIntensity: 0.1,  
        baseBrightness: 1, //正常亮度
        highlightBrightness: 0.5,
        rippleColor: new Color(255, 255, 255, 0)// 水波颜色（淡蓝色）
    }],
    [1, {  // +5强化
        rippleDensity: 30.0,
        rippleIntensity: 0.3,  
        baseBrightness: 0.6, //变暗
        highlightBrightness: 0.5,
        rippleColor: new Color(160, 255, 255, 125)// 水波颜色（淡蓝色）
    }],
    [2, {  // +7强化
        rippleDensity: 60.0, //波纹密度
        rippleIntensity: 0.6, //波纹强度
        baseBrightness: 1.2, //装备亮度
        highlightBrightness: 0.5, //波纹高亮区域亮度
        rippleColor: new Color(160, 230, 255, 125)  // 水波颜色（淡蓝色）
    }],
    [3, {  // +9强化
        rippleDensity: 80.0,
        rippleIntensity: 0.8,
        baseBrightness: 1.4,
        highlightBrightness: 0.5,
        rippleColor: new Color(255, 220, 200, 125)  // 浅等金色
    }],
    [4, { // +11强化
        rippleDensity: 100.0,
        rippleIntensity: 0.8,
        baseBrightness: 1.6,
        highlightBrightness: 0.5,
        rippleColor: new Color(255, 220, 150, 190)  // 浅金色
    }],
    [5, { // +13强化
        rippleDensity: 120.0,
        rippleIntensity: 0.8,
        baseBrightness: 1.8,
        highlightBrightness: 0.5,
        rippleColor: new Color(255, 200, 100, 255)  // 中金色
    }],
    [6, { // +15强化
        rippleDensity: 150.0,
        rippleIntensity: 0.8,
        baseBrightness: 2.0,
        highlightBrightness: 0.5,
        rippleColor: new Color(255, 200, 1, 255)  // 深金色
    }]
]);
