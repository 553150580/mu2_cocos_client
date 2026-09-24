// import { _decorator, Sprite,  Color, CCFloat, RenderData, gfx,  __private } from 'cc';
// const { ccclass, property } = _decorator;

// // 注意：这里需要正确导入assembler
// import { waterRippleAssembler } from './WaterRippleAssembler';

// @ccclass('WaterRippleSprite')
// export class WaterRippleSprite extends Sprite {
//     @property({ type: CCFloat })
//     private _rippleDensity: number = 30.0; //波纹密度
    
//     @property({ type: CCFloat })
//     private _rippleIntensity: number = 0.3;//波纹强度
    
//     @property({ type: CCFloat })
//     private _baseBrightness: number = 1.2;//装备基础亮度
    
//     @property({ type: CCFloat })
//     private _highlightBrightness: number = 2.0;//波纹高亮区域亮度
    
//     @property({ type: Color })
//     private _rippleColor: Color = new Color(255, 229, 127, 127); //水波颜色+速度（第4个表示速度）

//     // Getters and setters
//     @property({ type: CCFloat })
//     public get rippleDensity(): number { return this._rippleDensity; }
//     public set rippleDensity(value: number) {
//         if (this._rippleDensity === value) return;
//         this._rippleDensity = value;
//         this._updateRippleParams();
//     }

//     @property({ type: CCFloat })
//     public get rippleIntensity(): number { return this._rippleIntensity; }
//     public set rippleIntensity(value: number) {
//         if (this._rippleIntensity === value) return;
//         this._rippleIntensity = value;
//         this._updateRippleParams();
//     }

//     @property({ type: CCFloat })
//     public get baseBrightness(): number { return this._baseBrightness; }
//     public set baseBrightness(value: number) {
//         if (this._baseBrightness === value) return;
//         this._baseBrightness = value;
//         this._updateRippleParams();
//     }

//     @property({ type: CCFloat })
//     public get highlightBrightness(): number { return this._highlightBrightness; }
//     public set highlightBrightness(value: number) {
//         if (this._highlightBrightness === value) return;
//         this._highlightBrightness = value;
//         this._updateRippleParams();
//     }

//     @property({ type: Color })
//     public get rippleColor(): Color { return this._rippleColor; }
//     public set rippleColor(value: Color) {
//         if (this._rippleColor.equals(value)) return;
//         this._rippleColor.set(value);
//         this._updateRippleParams();
//     }
//     // 重写requestRenderData方法，定义自定义顶点格式
//     public requestRenderData(drawInfoType:__private._cocos_2d_renderer_render_draw_info__RenderDrawInfoType): RenderData {
//         const data = RenderData.add([
//             new gfx.Attribute(gfx.AttributeName.ATTR_POSITION, gfx.Format.RGB32F),
//             new gfx.Attribute(gfx.AttributeName.ATTR_TEX_COORD, gfx.Format.RG32F),
//             new gfx.Attribute(gfx.AttributeName.ATTR_COLOR, gfx.Format.RGBA32F),
//             new gfx.Attribute("a_rippleDensity", gfx.Format.R32F),
//             new gfx.Attribute("a_rippleIntensity", gfx.Format.R32F),
//             new gfx.Attribute("a_baseBrightness", gfx.Format.R32F),
//             new gfx.Attribute("a_highlightBrightness", gfx.Format.R32F),
//             new gfx.Attribute("a_rippleColor", gfx.Format.RGBA32F),
//         ]);
        
//         data.initRenderDrawInfo(this,drawInfoType);
//         this._renderData = data;
//         return data;
//     }

//     // 更新方法
//     private _updateRippleParams() {
//         if (this._assembler && (this._assembler as any).updateRippleParams) {
//             (this._assembler as any).updateRippleParams(this);
//             this.markForUpdateRenderData();
//         }
//     }
//     // 修改_flushAssembler方法
//     protected _flushAssembler() {
//         const assembler = waterRippleAssembler as any;

//         if (this._assembler !== assembler) {
//             this.destroyRenderData();
//             this._assembler = assembler;
//         }

//         if (!this._renderData) {
//             if (this._assembler && this._assembler.createData) {
//                 // 创建renderData
//                 this._renderData = this._assembler.createData(this) as RenderData;
                
//                 // 设置材质
//                 if (this._renderData) {
//                     this._renderData.material = this.getRenderMaterial(0);
//                     this.markForUpdateRenderData();
                    
//                     // 延迟更新，确保所有资源已加载
//                     this.scheduleOnce(() => {
//                         if (this.spriteFrame && this._assembler) {
//                             if (this._assembler.updateUVs) {
//                                 this._assembler.updateUVs(this);
//                             }
//                             this._updateColor();
//                             this._updateRippleParams();
//                         }
//                     }, 0);
//                 }
//             }
//         }
//     }
//     // public start(): void {
//     //     this.scheduleOnce(() => {
//     //         this._updateRippleParams();
//     //     }, 0);
//     // }
//     // 添加必要的生命周期方法
//     // onEnable(): void {
//     //     super.onEnable();
//     //     this.scheduleOnce(() => {
//     //         this._updateRippleParams();
//     //     }, 0);
//     // }
//     // protected update(dt: number): void {
//     //     super.update(dt)
//     //     this._updateRippleParams();
//     // }

//     // 可选：添加材质检查
//     protected _updateMaterial(): void {
//         super._updateBuiltinMaterial();
//         // 确保材质使用正确的水波纹effect
//         const mat = this.getRenderMaterial(0);
//         if (mat) {
//             // 可以在这里设置材质的初始参数
//         }
//     }
// }