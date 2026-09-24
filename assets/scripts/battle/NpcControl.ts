import { _decorator, CCInteger, Collider2D, Component, Contact2DType, Label, Node, resources, sp, Sprite, Texture2D } from 'cc';
import MovieClip from '../utils/MovieClip';
import Tools from '../base/tools';
import GD from '../base/GameData';
import { Npc } from '../base/types';
import GameManager from '../managers/GameManager';
const { ccclass, property } = _decorator;

@ccclass('NpcControl')
export class NpcControl extends Component {
    @property(Label)
    nameLabel:Label=null
    @property(Sprite)
    skin:Sprite=null
    // @property(MovieClip)
    // movieClip:MovieClip
    @property(CCInteger)
    id:number;
    @property(Collider2D)
    collider2D:Collider2D = null;

    data:Npc
    protected onLoad(): void {
        this.collider2D.on(Contact2DType.BEGIN_CONTACT,this.onCollisionEnter2D,this);
        // let path = `game/npc/${this.id}/texture`
        // resources.load(path, Texture2D,(error:Error,tex:Texture2D)=>{
        //     if(error != null){
        //         console.error(`加载Texture2D资源失败 filePath：${path},err=${error}`)
        //         return
        //     }
        //     this.movieClip.init(tex,1,6)
        // })
        Tools.loadSpriteFrame(`ui/npc/${this.id}`,GD.commonBundle).then(sp=>{
            this.skin.spriteFrame=sp
        })
        this.data = GD.npc_list.get(this.id)
        this.nameLabel.string = this.data.Name;
    }
    private onCollisionEnter2D(self:Collider2D, other:Collider2D){   
        if(other.tag == 99){ //99代表玩家主角色
            GameManager.I.playEffectSound('npc_'+this.id)
        }
    }
}


