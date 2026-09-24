import { _decorator, Component, Label, Node, RichText, Sprite, Toggle } from 'cc';
import { BasePage } from './BasePage';
import WS from '../base/net';
import { ConfigType, Err, MT } from '../base/MT';
import GD from '../base/GameData';
import Tools from '../base/tools';
import { UIMgr } from '../managers/UIMgr';
import { BodyType, ct } from '../base/types';
import { TowerInfo } from '../base/consts';
import { Tab } from '../UiComps/Tab';
import { List } from '../UiComps/List';
import { ViewStack } from '../UiComps/ViewStack';
const { ccclass, property } = _decorator;

@ccclass('TowerPage')
export class TowerPage extends BasePage {
    @property(Node)
    reduce:Node;
    @property(Node)
    add:Node;
    @property(RichText)
    num:RichText;
    @property(Node)
    tryNextBtn:Node;
    @property(Label)
    lv:Label;
    @property(Label)
    bossName:Label;
    @property(Sprite)
    skin:Sprite;
    @property(RichText)
    info:RichText;
    @property(Toggle)
    isAuto:Toggle;
    @property(Tab)
    tab:Tab;
    @property(List)
    list:List;
    @property(ViewStack)
    view:ViewStack;

    onLoad(): void {
        super.onLoad()
        this.tab.selectedHandler=((node,index)=>{
            this.view.selectedIndex=index
            if(index==0){
                this.getCurLvTowerData()
            }else{
                this.getTowerRankList()
            }
            GD.playClickSound();
        })
        this.list.cellRender=(node,index)=>{
            let data:outer_pb.RoleMiniInfo = this.list.array[index]
            let name = `第${data.Num}层     ${data.Sid}服【${data.Name}】`
            let label=node.children[0].getComponent(Label);
            label.string=name
            let color=ct.white
            let show=true
            if(GD.role.data.Id==data.Id){
                color=ct.green
                show=false
            }
            label.color.fromHEX(color)
            let seeBtn=node.children[1]
            seeBtn.off(Node.EventType.TOUCH_END)
            seeBtn.active=show
            if(show){
                seeBtn.on(Node.EventType.TOUCH_END,()=>{
                    if(GD.role.hasEnoughLv(320)){
                        Tools.tryGetOtherRoleInfo(data.Id)
                    }
                })
            }
        }
        this.add.on(Node.EventType.TOUCH_END,()=>{
            if(this.selectedLv<170){
                this.selectedLv++
                this.refreshNum()
                GD.playClickSound()
            }
        })
        this.reduce.on(Node.EventType.TOUCH_END,()=>{
            if(this.selectedLv>1){
                this.selectedLv--
                this.refreshNum()
                GD.playClickSound()
            }
        })
        this.tryNextBtn.on(Node.EventType.TOUCH_END,()=>{
            if(GD.role.hasEnoughLv(GD.configs.get(ConfigType.ActiveLv_Tower))){
                let req = outer_pb.PkAct.create();
                req.IsKf=this.isAuto.isChecked;
                let buff = outer_pb.PkAct.encode(req).finish();
                WS.send(MT.TryNextTowerLv,buff,(d:any)=>{
                    let rsp = outer_pb.PkAct.decode(d);
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        UIMgr.I.tip('开始挑战！',ct.green)
                    }else{
                        let equipName=''
                        if(rsp.Who){
                            for(let type=BodyType.Head;type<BodyType.Pet;type++){
                                let equip:outer_pb.IEquip = GD.role.BodyEquips[type]
                                if(equip&&equip.Uid==rsp.Who){
                                    let base = GD.EquipBaseDatas.get(equip.Id)
                                    equipName=`装备【${base.Name}】在本赛季已被其它角色使用过了`
                                }
                            }
                        }
                        UIMgr.I.tip(`${equipName}`)
                    }
                })
            }
        },this);
        this.info.string=TowerInfo
    }
    initData(data: any): void {
        this.tab.select(0)
    }
    onHide(): void {
        this.list.array=[]
    }
    getCurLvTowerData=()=>{
        WS.send(MT.GetCurLvTowerData,GD.EmptyRequestBuff,(d:any)=>{
            let rsp = outer_pb.PkAct.decode(d);
            this.refresh(rsp)
        })
    }
    getTowerRankList=()=>{
        this.list.array=[]
        WS.send(MT.GetTowerRankList,GD.EmptyRequestBuff,(d:any)=>{
            let rsp = outer_pb.RoleMiniList.decode(d);
            this.list.array=rsp.List;
        })
    }
    selectedLv:number=1
    refresh=(rsp:outer_pb.PkAct)=>{
        GD.role.towerLv=rsp.CurSort
        this.selectedLv=rsp.CurSort;
        this.refreshNum()
        this.lv.string=`当前第${rsp.CurSort}层（历史最高${rsp.Sort1}层）`
        let base = GD.monsterBaseDatas.get(rsp.Id);
        this.bossName.string=`变异的【${base.Name}】`
        const filePath:string = "ui/monster/" + base.Skin;
        Tools.loadSpriteFrame(filePath,GD.commonBundle).then(sp=>{
            if(sp){
                this.skin.spriteFrame=sp
            }
        })
    }
    refreshNum=()=>{
        let a=0
        for(let i=1;i<=this.selectedLv;i++){
            let n=((i-1)/10>>0);
            let r=1
            if(n>9){
                n=9
                r=10+n
            }else{
                r=10+n*5
            }
            let x=10+(Math.pow(2,n)-1)*r
            a+=x
        }
        this.num.string=`<color=${ct.green}>第${this.selectedLv}层</>赛季可得奖励<br/><color=${ct.yellow}>宝石碎片x${a}</>`
    }
}


