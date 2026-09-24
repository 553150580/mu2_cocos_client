import { _decorator, Component,  Sprite, SpriteAtlas, SpriteFrame, Vec3 } from 'cc';
import GD from '../base/GameData';
const { ccclass, property } = _decorator;

@ccclass('AniController')
export class AniController extends Component {
    @property(Sprite)
    sprite:Sprite;

    speed:number=0.1

// 当前动画状态
    private currentMonsterId: number = 0;
    private _currentDirection: number = 4; // 默认朝上
    private _currentAction: number = 0; // 默认待机
    private currentFrameIndex: number = 0;
    private isPlaying: boolean = false;
    private frameInterval: any = 0;
    private autoPlayEnabled: boolean = true;
    
    // 动作类型常量
    public static readonly ACTION_IDLE = 0;    // 待机
    public static readonly ACTION_WALK = 1;    // 行走  
    public static readonly ACTION_ATTACK = 2;  // 攻击
    public static readonly ACTION_DEATH = 3;   // 死亡

        /**
     * 单位朝向某个点(1,2,3为7,6,5的反面，即scale.x=-1)
     *        4
     *      3   5
     *    2   *   6
     *      1   7
     *        0
     */
    directions: Array<number> = [4, 5, 6, 7, 0,1,2,3];
    actionTypes: Array<number> = [0, 1, 2, 3];
    
    // 获取当前方向
    get currentDirection(): number {
        return this._currentDirection;
    }
    
    // 设置当前方向（自动播放动画）
    set currentDirection(value: number) {
        if (this._currentDirection !== value) {
            this._currentDirection = value;
            if (this.autoPlayEnabled) {
                this.playCurrentAnimation();
            }
        }
    }
    
    // 获取当前动作
    get currentAction(): number {
        return this._currentAction;
    }
    
    // 设置当前动作（自动播放动画）
    set currentAction(value: number) {
        if (this._currentAction !== value) {
            this._currentAction = value;
            if (this.autoPlayEnabled) {
                this.playCurrentAnimation();
            }
        }
    }
    
    onEnable() {
        this.stopAnimation();
    }
    /**
     * 初始化怪物动画
     */
    initAni(monsterId: number) {
        return new Promise(resolve=>{
            this.currentMonsterId = monsterId;
            if (GD.allAnis.has(monsterId) == false) {
                GD.commonBundle.load("ui/monster1/m" + monsterId, SpriteAtlas, (err, res: SpriteAtlas) => {
                    if (res) {
                        let monster_anis = GD.allAnis.get(monsterId);
                        if (!monster_anis) {
                            monster_anis = new Map();
                            GD.allAnis.set(monsterId, monster_anis);
                        }
                        
                        this.directions.forEach(dirT => {
                            let dirT_anis = new Map();
                            monster_anis.set(dirT, dirT_anis);
                            //1，2，3方向对应7,6,5方向的贴图
                            if(dirT==1){
                                dirT=7
                            }else if(dirT==2){
                                dirT=6
                            }else if(dirT==3){
                                dirT=5
                            }
                            
                            // 帧图片的命名格式：id_方向_动作类型_帧
                            this.actionTypes.forEach(actT => {
                                let actT_anis = [];
                                dirT_anis.set(actT, actT_anis);
                                
                                // 每个动画固定都是6帧
                                for (let i = 0; i < 6; i++) {
                                    let path = `${monsterId}_${dirT}_${actT}_${i}`;
                                    let sp = res.getSpriteFrame(path);
                                    if (sp) {
                                        actT_anis.push(sp);
                                        // console.log('加载怪物动作图集成功：' + path);
                                    } else {
                                        console.log('加载怪物动作图集失败：' + path);
                                    }
                                }
                            });
                        });
                        
                        console.log(`怪物${monsterId}动画初始化完成`,monster_anis);
                        // 初始化完成后自动播放当前动画
                        if (this.autoPlayEnabled) {
                            this.playCurrentAnimation();
                        }
                        resolve(1)
                    } else {
                        console.log('加载怪物的图集失败：id=' + monsterId);
                    }
                });
            } else {
                console.log(`怪物${monsterId}动画已缓存`);
                // 如果动画已缓存，直接播放当前动画
                if (this.autoPlayEnabled) {
                    this.playCurrentAnimation();
                }
                resolve(1)
            }
        })
    }
    
    /**
     * 播放当前设置的动画（根据currentAction和currentDirection）
     */
    playCurrentAnimation(loop: boolean = true): boolean {
        return this.playAnimation(this._currentDirection, this._currentAction, loop);
    }
    
    /**
     * 播放指定方向、指定动作的动画
     */
    playAnimation(direction: number, action: number, loop: boolean = true): boolean {
        // 停止当前动画
        this.stopAnimation();
        
        // 检查动画数据是否存在
        const monsterAnis = GD.allAnis.get(this.currentMonsterId);
        if (!monsterAnis) {
            console.warn(`怪物${this.currentMonsterId}的动画数据未加载`);
            return false;
        }
        //设置精灵朝向：方向为1、2、3的时候水平翻转
        if(direction ==5||direction ==6||direction ==7){ 
            // if(direction==1){
            //     direction=7
            // }else if(direction==2){
            //     direction=6
            // }else if(direction==3){
            //     direction=5
            // }
            var scale:Vec3 = this.sprite.node.scale;
            scale.x = -1;
            this.sprite.node.scale = scale;
        }else{
            var scale:Vec3 = this.sprite.node.scale;
            scale.x = 1;
            this.sprite.node.scale = scale;
        }
        const directionAnis = monsterAnis.get(direction);
        if (!directionAnis) {
            console.warn(`方向${direction}的动画数据不存在`);
            return false;
        }
        
        const actionFrames = directionAnis.get(action);
        if (!actionFrames || actionFrames.length === 0) {
            console.warn(`动作${action}的帧数据为空`);
            return false;
        }
        
        // 设置当前动画状态
        this._currentDirection = direction;
        this._currentAction = action;
        this.currentFrameIndex = 0;
        this.isPlaying = true;
        
        // 显示第一帧
        this.sprite.spriteFrame = actionFrames[0];

        // 添加渲染调试
        // console.log('=== 渲染调试信息 ===');
        // console.log('Sprite组件:', this.sprite);
        // console.log('设置的SpriteFrame:', actionFrames[0]);
        // console.log('SpriteFrame是否有效:', actionFrames[0] !== null && actionFrames[0] !== undefined);
        // console.log('节点active:', this.node.active);
        // console.log('节点activeInHierarchy:', this.node.activeInHierarchy);
        // console.log('节点位置:', this.node.position);
        // console.log('节点缩放:', this.node.scale);
        // console.log('节点世界矩阵:', this.node.worldMatrix);
        // // console.log('Sprite大小:', this.sprite.size);
        // console.log('========================');
        
        //死亡动画只播放1次
        if(action==AniController.ACTION_DEATH) loop=false;
        // 开始播放动画
        this.startFrameAnimation(actionFrames, loop);
        
        // console.log(`播放动画: 怪物${this.currentMonsterId}, 方向${direction}, 动作${action}, 循环${loop}`);
        
        return true;
    }
    
    /**
     * 开始帧动画
     */
    private startFrameAnimation(frames: SpriteFrame[], loop: boolean) {
        this.frameInterval = setInterval(() => {
            if (!this.isPlaying) return;
            
            this.currentFrameIndex++;
            
            // 检查是否播放完毕
            if (this.currentFrameIndex >= frames.length) {
                if (loop) {
                    this.currentFrameIndex = 0; // 循环播放
                } else {
                    this.stopAnimation(); // 单次播放结束
                    // 单次播放结束后，如果是攻击或死亡动画，自动切换回待机
                    if (this._currentAction === AniController.ACTION_ATTACK || 
                        this._currentAction === AniController.ACTION_DEATH) {
                        this.scheduleOnce(() => {
                            if (this._currentAction !== AniController.ACTION_DEATH) { // 死亡后不再切换
                                this._currentAction = AniController.ACTION_IDLE;
                                this.playCurrentAnimation(true);
                            }
                        }, 0.1);
                    }
                    return;
                }
            }
            
            // 更新当前帧
            this.sprite.spriteFrame = frames[this.currentFrameIndex];
            
        }, this.speed * 1000); // 转换为毫秒
    }
    
    /**
     * 停止动画播放
     */
    stopAnimation() {
        this.isPlaying = false;
        if (this.frameInterval) {
            clearInterval(this.frameInterval);
            this.frameInterval = 0;
        }
        this.currentFrameIndex = 0;
    }
    
    /**
     * 暂停动画播放
     */
    pauseAnimation() {
        this.isPlaying = false;
    }
    
    /**
     * 恢复动画播放
     */
    resumeAnimation() {
        this.isPlaying = true;
    }
    
    /**
     * 设置动画播放速度
     */
    setAnimationSpeed(speed: number) {
        this.speed = speed;
        
        // 如果正在播放，重新启动动画以应用新速度
        if (this.isPlaying) {
            const monsterAnis = GD.allAnis.get(this.currentMonsterId);
            if (monsterAnis) {
                const directionAnis = monsterAnis.get(this._currentDirection);
                if (directionAnis) {
                    const actionFrames = directionAnis.get(this._currentAction);
                    if (actionFrames) {
                        const wasLooping = this.frameInterval !== 0;
                        this.stopAnimation();
                        this.startFrameAnimation(actionFrames, wasLooping);
                    }
                }
            }
        }
    }
    
    /**
     * 设置是否自动播放动画（当currentAction或currentDirection改变时）
     */
    setAutoPlay(enabled: boolean) {
        this.autoPlayEnabled = enabled;
    }
    
    /**
     * 直接设置动作和方向，不触发自动播放
     */
    setActionAndDirectionSilent(action: number, direction: number) {
        this._currentAction = action;
        this._currentDirection = direction;
    }
    
    /**
     * 便捷方法：设置待机状态
     */
    setIdle(direction?: number) {
        if (direction !== undefined) {
            this.currentDirection = direction;
        }
        this.currentAction = AniController.ACTION_IDLE;
    }
    
    /**
     * 便捷方法：设置行走状态
     */
    setWalk(direction?: number) {
        if (direction !== undefined) {
            this.currentDirection = direction;
        }
        this.currentAction = AniController.ACTION_WALK;
    }
    
    /**
     * 便捷方法：设置攻击状态
     */
    setAttack(direction?: number) {
        if (direction !== undefined) {
            this.currentDirection = direction;
        }
        this.currentAction = AniController.ACTION_ATTACK;
    }
    
    /**
     * 便捷方法：设置死亡状态
     */
    setDeath(direction?: number) {
        if (direction !== undefined) {
            this.currentDirection = direction;
        }
        this.currentAction = AniController.ACTION_DEATH;
    }
    
    /**
     * 获取当前动画状态
     */
    getCurrentAnimation(): { monsterId: number, direction: number, action: number, frameIndex: number } {
        return {
            monsterId: this.currentMonsterId,
            direction: this._currentDirection,
            action: this._currentAction,
            frameIndex: this.currentFrameIndex
        };
    }
    
    /**
     * 检查是否正在播放
     */
    isAnimationPlaying(): boolean {
        return this.isPlaying;
    }
}


