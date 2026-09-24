import { _decorator, Component, Node, RichText, Sprite,Animation } from 'cc';
import { BodyType, ct, EquipType, RoleType } from '../base/types';
import Tools from '../base/tools';
import GD from '../base/GameData';
const { ccclass, property } = _decorator;

@ccclass('RoleUIControl')
export class RoleUIControl extends Component {
    @property(Sprite)
    chengHao:Sprite
    @property(Node)
    dian:Node
    @property(Sprite)
    chengHaoLv:Sprite
    @property(RichText)
    nameLabel:RichText
    @property(Sprite)
    wing:Sprite
    @property(Sprite)
    leftHand:Sprite
    @property(Sprite)
    left_weapon:Sprite
    @property(Sprite)
    leg:Sprite
    @property(Sprite)
    foot:Sprite
    @property(Sprite)
    body:Sprite
    @property(Sprite)
    rightHand:Sprite
    @property(Sprite)
    right_weapon:Sprite
    @property(Sprite)
    head:Sprite
    @property(Sprite)
    shield:Sprite
    @property(Sprite)
    jianTong:Sprite

    role:any;
    // ani:Animation;
    // roleType:RoleType //角色职业类型0,1,2,3,4,5,6
    isOther:boolean=false;
    // protected onLoad(): void {
    //     this.ani = this.node.getComponent(Animation);
    // }
    initData(roleData:any,isOther:boolean){
        this.isOther = isOther
        this.role=roleData;
        let nameColor=ct.white;
        
        // if(roleData.GoldYk>Date.now()/1000>>0){
        if(roleData.GoldYk>Tools.getBeiJingSecond()){
            nameColor=ct.yellow
        }
        let namestr = ''
        let line='<br/>'
        if(roleData.Name){
            namestr=`<outline color=black width=1><size=20><color=${ct.brown}>${Tools.getLvStr({Lv:roleData.Lv,ZsNum:roleData.ZsNum,DsLv:roleData.DsLv})}</></></><outline color=black width=2>${line}<color=${nameColor}>${roleData.Name}</></>`;
        }
        this.nameLabel.string=namestr;
        // this.refreshChengHaoUI();
    }
    refreshChengHaoUI(){
        let idLv = this.role.ChIdLv
        if(idLv==null||idLv.length!=2||idLv[0]==0){
            this.chengHao.spriteFrame = null;
            this.chengHaoLv.spriteFrame = null;
            this.dian.active=false
        }else{
            this.dian.active=true
            Tools.loadSpriteFrame(`ui/chengHao/${idLv[0]}`,GD.commonBundle).then(sp=>{
                if(sp)this.chengHao.spriteFrame = sp;
            })
            Tools.loadSpriteFrame(`ui/chengHao/lv${idLv[1]}`,GD.commonBundle).then(sp=>{
                if(sp)this.chengHaoLv.spriteFrame = sp;
            })
        }
    }
    updateAllEquipUI(bodyEquips:any,roleType:RoleType,isOther:boolean){
        for(let type=BodyType.Head;type<BodyType.Pet;type++){
            let equip:outer_pb.Equip = bodyEquips[type]
            let id:number
            let qhLv:number=0
            if(equip){
                if(isOther||Tools.checkCanDress(equip)){
                    qhLv=equip.QhLv;
                    id = equip.Id
                }
            }
            this.updateEquipUI(id,type,roleType,qhLv)
        }
    }
    updateEquipUI(equipId:number,bodyType:BodyType,roleType:RoleType,qhLv:number=0){
        switch(bodyType){
            case BodyType.Foot:
                Tools.refreshRoleEquipUI(this.foot,equipId,bodyType,roleType,'',qhLv)
                break;
            case BodyType.Hand://护手
                Tools.refreshRoleEquipUI(this.leftHand,equipId,bodyType,roleType,'_1',qhLv)
                Tools.refreshRoleEquipUI(this.rightHand,equipId,bodyType,roleType,'_2',qhLv)
                break;
            case BodyType.LeftHand: //weapon
                Tools.refreshRoleEquipUI(this.left_weapon,equipId,bodyType,roleType,'',qhLv)
                break;
            case BodyType.Leg:
                Tools.refreshRoleEquipUI(this.leg,equipId,bodyType,roleType,'',qhLv)
                break;
            case BodyType.Body:
                Tools.refreshRoleEquipUI(this.body,equipId,bodyType,roleType,'',qhLv)
                break;
            case BodyType.Head:
                Tools.refreshRoleEquipUI(this.head,equipId,bodyType,roleType,'',qhLv)
                break;
            case BodyType.RightHand://盾牌、箭筒、武器
                if(equipId){
                    let equipType = equipId/10000>>0
                    if(equipType==EquipType.Shield){
                        Tools.refreshRoleEquipUI(this.shield,equipId,bodyType,roleType,'',qhLv)
                        Tools.refreshRoleEquipUI(this.right_weapon,null,bodyType,roleType,'',qhLv)
                        Tools.refreshRoleEquipUI(this.jianTong,null,bodyType,roleType,'',qhLv)
                    }else if(equipType==EquipType.JianTong){
                        Tools.refreshRoleEquipUI(this.jianTong,equipId,bodyType,roleType,'',qhLv)
                        Tools.refreshRoleEquipUI(this.right_weapon,null,bodyType,roleType,'',qhLv)
                        Tools.refreshRoleEquipUI(this.shield,null,bodyType,roleType,'',qhLv)
                    }else{
                        Tools.refreshRoleEquipUI(this.right_weapon,equipId,bodyType,roleType,'',qhLv)
                        Tools.refreshRoleEquipUI(this.shield,null,bodyType,roleType,'',qhLv)
                        Tools.refreshRoleEquipUI(this.jianTong,null,bodyType,roleType,'',qhLv)
                    }
                }else{
                    Tools.refreshRoleEquipUI(this.right_weapon,equipId,bodyType,roleType,'',qhLv)
                    Tools.refreshRoleEquipUI(this.shield,equipId,bodyType,roleType,'',qhLv)
                    Tools.refreshRoleEquipUI(this.jianTong,equipId,bodyType,roleType,'',qhLv)
                }
                break;
            case BodyType.Wing:
                Tools.refreshRoleEquipUI(this.wing,equipId,bodyType,roleType,'',qhLv)
                break;
            default:
                break;
        }
    }
}


