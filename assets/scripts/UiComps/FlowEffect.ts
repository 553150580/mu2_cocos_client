import { _decorator, Color, Component, math, Node, Sprite, Tween, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FlowEffect')
export class FlowEffect extends Component {
    sprite: Sprite = null!;
    private isEnhanced: boolean = false;
    private originalColor:Readonly<math.Color>
    onLoad() {
        this.sprite=this.getComponent(Sprite)
        // 保存原始颜色
        this.originalColor = this.sprite.color.clone();
        this.enableEnhanceEffect();
    }
    
    // 启用强化效果
    enableEnhanceEffect() {
        if (this.isEnhanced) return;
        
        this.isEnhanced = true;
        
        // 使用Tween创建流光效果
        tween(this.sprite)
            .to(1, { color: new Color(500, 500, 500) }) // 变亮
            .to(1, { color: new Color(150, 150, 150) }) // 恢复正常
            .union()
            .repeatForever()
            .start();
    }
    
    // 禁用强化效果
    disableEnhanceEffect() {
        if (!this.isEnhanced) return;
        
        this.isEnhanced = false;
        
        // 停止所有Tween
        Tween.stopAllByTarget(this.sprite);
        
        // 恢复原始颜色
        this.sprite.color = this.originalColor;
    }
}


