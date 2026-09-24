// import { IAssembler, Sprite, DynamicAtlasManager, UITransform, IRenderData, RenderData, Color } from 'cc';

// interface IWaterRippleAssembler extends IAssembler {
//     updateRippleParams(sprite: any): void;
//     updateVertexData(sprite: Sprite): void;
//     updateWorldVerts(sprite: Sprite, chunk: any): void;
// }

// export const waterRippleAssembler: IWaterRippleAssembler = {
//     createData(sprite: Sprite) {
//         const renderData = sprite.requestRenderData();
        
//         // 确保chunk被正确初始化
//         if (renderData && !renderData.chunk) {
//             renderData.initRenderDrawInfo(sprite, 0); // 初始化chunk
//         }
        
//         return renderData;
//     },

//     updateUVs(sprite: Sprite) {
//         if (!sprite.spriteFrame) return;
//         const renderData = sprite.renderData;
        
//         // 添加null检查
//         if (!renderData || !renderData.chunk || !renderData.chunk.vb) {
//             return;
//         }
        
//         const vData = renderData.chunk.vb;
//         const uv = sprite.spriteFrame.uv;
        
//         let offset = 3; // 跳过position(3个float)
//         for (let i = 0; i < 4; i++, offset += renderData.floatStride) {
//             if (offset + 1 < vData.length) {
//                 vData[offset] = uv[i * 2];
//                 vData[offset + 1] = uv[i * 2 + 1];
//             }
//         }
//     },

//     updateColor(sprite: Sprite) {
//         const renderData = sprite.renderData;
        
//         // 添加null检查
//         if (!renderData || !renderData.chunk || !renderData.chunk.vb) {
//             return;
//         }
        
//         const vData = renderData.chunk.vb;
//         const color = sprite.color;
//         let offset = 5; // position(3) + texCoord(2)
        
//         for (let i = 0; i < 4; i++, offset += renderData.floatStride) {
//             if (offset + 3 < vData.length) {
//                 vData[offset] = color.r / 255;
//                 vData[offset + 1] = color.g / 255;
//                 vData[offset + 2] = color.b / 255;
//                 vData[offset + 3] = color.a / 255;
//             }
//         }
//     },

//     updateRippleParams(sprite: any) {
//         const renderData = sprite.renderData;
        
//         // 添加null检查
//         if (!renderData || !renderData.chunk || !renderData.chunk.vb) {
//             return;
//         }
        
//         const vData = renderData.chunk.vb;
//         const color = sprite.rippleColor;
        
//         for (let i = 0; i < 4; i++) {
//             const offset = 9 + i * renderData.floatStride;
            
//             // 检查数组边界
//             if (offset + 7 < vData.length) {
//                 vData[offset] = sprite.rippleDensity;
//                 vData[offset + 1] = sprite.rippleIntensity;
//                 vData[offset + 2] = sprite.baseBrightness;
//                 vData[offset + 3] = sprite.highlightBrightness;
//                 vData[offset + 4] = color.r / 255;
//                 vData[offset + 5] = color.g / 255;
//                 vData[offset + 6] = color.b / 255;
//                 vData[offset + 7] = color.a / 255;
//             }
//         }
//     },

//     updateVertexData(sprite: Sprite) {
//         const renderData = sprite.renderData;
//         if (!renderData || !sprite.spriteFrame) return;
        
//         const uiTrans = sprite.node.getComponent(UITransform);
//         if (!uiTrans) return;
        
//         const dataList: IRenderData[] = renderData.data;
//         const cw = uiTrans.width;
//         const ch = uiTrans.height;
//         const appX = uiTrans.anchorX * cw;
//         const appY = uiTrans.anchorY * ch;
        
//         let l = 0, b = 0, r = 0, t = 0;
        
//         if (sprite.trim) {
//             l = -appX;
//             b = -appY;
//             r = cw - appX;
//             t = ch - appY;
//         } else {
//             const frame = sprite.spriteFrame;
//             const originSize = frame.originalSize;
//             const ow = originSize.width;
//             const oh = originSize.height;
//             const scaleX = cw / ow;
//             const scaleY = ch / oh;
//             const trimmedBorder = frame.trimmedBorder;
//             l = trimmedBorder.x * scaleX - appX;
//             b = trimmedBorder.z * scaleY - appY;
//             r = cw + trimmedBorder.y * scaleX - appX;
//             t = ch + trimmedBorder.w * scaleY - appY;
//         }

//         // 确保dataList有足够的元素
//         while (dataList.length < 4) {
//             dataList.push({ x: 0, y: 0, z: 0, u: 0, v: 0, color: Color.BLACK });
//         }

//         dataList[0].x = l; dataList[0].y = b;
//         dataList[1].x = r; dataList[1].y = b;
//         dataList[2].x = l; dataList[2].y = t;
//         dataList[3].x = r; dataList[3].y = t;

//         renderData.vertDirty = true;
//     },

//     updateWorldVerts(sprite: Sprite, chunk: any) {
//         if (!sprite || !chunk || !chunk.vb) return;
        
//         const renderData = sprite.renderData;
//         if (!renderData) return;
        
//         const vData = chunk.vb;
//         const dataList: IRenderData[] = renderData.data;
//         const node = sprite.node;
//         const m = node.worldMatrix;

//         const m00 = m.m00; const m01 = m.m01; const m02 = m.m02; const m03 = m.m03;
//         const m04 = m.m04; const m05 = m.m05; const m06 = m.m06; const m07 = m.m07;
//         const m12 = m.m12; const m13 = m.m13; const m14 = m.m14; const m15 = m.m15;

//         const stride = renderData.floatStride;
//         let offset = 0;
//         const length = Math.min(dataList.length, 4); // 确保不超过4个顶点
        
//         for (let i = 0; i < length; ++i) {
//             const curData = dataList[i];
//             const x = curData.x;
//             const y = curData.y;
//             let rhw = m03 * x + m07 * y + m15;
//             rhw = rhw ? 1 / rhw : 1;

//             offset = i * stride;
//             if (offset + 2 < vData.length) {
//                 vData[offset + 0] = (m00 * x + m04 * y + m12) * rhw;
//                 vData[offset + 1] = (m01 * x + m05 * y + m13) * rhw;
//                 vData[offset + 2] = (m02 * x + m06 * y + m14) * rhw;
//             }
//         }
//     },

//     updateRenderData(sprite: Sprite) {
//         const frame = sprite.spriteFrame;
//         if (frame) {
//             DynamicAtlasManager.instance.packToDynamicAtlas(sprite, frame);
//         }
        
//         // 确保renderData存在
//         if (!sprite.renderData) {
//             this.createData(sprite);
//         }
        
//         this.updateUVs(sprite);
        
//         const renderData = sprite.renderData;
//         if (renderData && frame) {
//             if (renderData.vertDirty) {
//                 this.updateVertexData(sprite);
//                 this.updateRippleParams(sprite);
//             }
//             // 调用renderData的更新方法
//             if (renderData.updateRenderData) {
//                 renderData.updateRenderData(sprite, frame);
//             }
//         }
//     },

//     fillBuffers(sprite: Sprite, renderer: any) {
//         if (!sprite) return;
        
//         const renderData = sprite.renderData;
//         if (!renderData || !renderData.chunk || !renderData.chunk.vb) {
//             return;
//         }
        
//         const chunk = renderData.chunk;
        
//         if (sprite.node.hasChangedFlags || renderData.vertDirty) {
//             this.updateWorldVerts(sprite, chunk);
//             this.updateRippleParams(sprite);
//             renderData.vertDirty = false;
//         }
        
//         const vid = chunk.vertexOffset;
//         const meshBuffer = chunk.meshBuffer;
//         const ib = meshBuffer.iData;
//         let indexOffset = meshBuffer.indexOffset;

//         // 填充索引数据
//         ib[indexOffset++] = vid;
//         ib[indexOffset++] = vid + 1;
//         ib[indexOffset++] = vid + 2;
//         ib[indexOffset++] = vid + 1;
//         ib[indexOffset++] = vid + 3;
//         ib[indexOffset++] = vid + 2;

//         meshBuffer.indexOffset += 6;
//     }
// };