import { _decorator, CCInteger, Color, Component, Node, Sprite } from 'cc';
import { MaterialPool } from '../base/Pools';
const { ccclass, property } = _decorator;

@ccclass('EquipmentSlot')
export class EquipmentSlot extends Component {
    sprite: Sprite;
    currentQhStep:number=0;
    private originalColor: Color = new Color(255, 255, 255, 255); // 保存原始颜色

    protected onLoad(): void {
        this.sprite = this.node.getComponent(Sprite)
    }
    protected onEnable(): void {
        if (this.sprite) {
            this.setQhLevelEffect(this.currentQhStep,false)
        }
    }
    // 设置强化等级
    setQhLevelEffect=(qhStep: number,notReFresh:boolean=true)=> {
        if (notReFresh&&this.currentQhStep === qhStep) return;
        this.currentQhStep = qhStep;
        const material = MaterialPool.I.getMaterialForLevel(qhStep);
        if (this.sprite && material) {
            this.sprite.customMaterial = material;
            this.sprite.color = this.originalColor;
        }
    }
}


