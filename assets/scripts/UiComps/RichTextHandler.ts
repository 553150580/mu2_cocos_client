import { _decorator, Component, EventTouch, randomRangeInt } from 'cc';
import { UIMgr } from '../managers/UIMgr';
import GD from '../base/GameData';
import Tools from '../base/tools';
import { ct, EquipType } from '../base/types';
const { ccclass, property } = _decorator;

@ccclass('RichTextHandler')
export class RichTextHandler extends Component {
    data:any;//outer_pb.ChatMsg
    onClick(eventTouch:EventTouch, param:string){
        // console.log("onClicked", param,'data',this.data)
        // if(GD.role.isLimited(false))return
        if(param.startsWith('p')){
            //点击坐标（显示'前往'按钮）
            if(GD.curMap){
                let map = GD.MapList.get(this.data.Position.RoomId)
                if(map.NeedTicket>0){
                    UIMgr.I.tip('该地图只能通过门票进入')
                    return
                }
                UIMgr.I.PopView.show(2,this.data.Position)
            }
        }else if(param.startsWith('n')){
            //点击名字（显示：查看信息、添加好友、邀请组队）
            let arr = param.slice(1).split('|')
            let obj={Id:arr[1],Name:arr[2]}
            this.data.Id=arr[1];
            UIMgr.I.PopView.show(1,obj)
            // UIMgr.I.PopView.show(1,param.slice(1))
        }else if(param.startsWith('i')){
            //点击道具（显示uid=param.slice(1)的道具信息）
            let uid = param.slice(1)
            let item = this.data.Items.find(d=>{ return d.Uid==uid})
            if(item){
                UIMgr.I.PopView.show(0,item)
            }
        }else if(param.startsWith('b')){
            //点击道具（显示uid=param.slice(1)的道具信息）
            let id = parseInt(param.slice(1))
            let base=GD.ItemBaseDatas.get(id)
            if(base){
                let item=outer_pb.DropItem.create()
                item.ItemType=0
                item.ItemId=id
                item.ItemNum=1
                UIMgr.I.PopView.show(0,item)
            }
        }else if(param.startsWith('z')){
            //点击战盟BOSS的其它掉落，根据index显示该boss的掉落说明
            let bossId = parseInt(param.split('|')[1])
            let ids:Array<number>
            // let bossId=0
            let usedEquip=''
            if(bossId==999){
                ids = GD.kfZmBossDropItems
                // bossId=999
                usedEquip='同一天、同一件装备只能由同一个角色用来挑战跨服战盟BOSS，次日重置'
            }else{
                ids = GD.zmBossDropItems.get(bossId);
                // bossId=id; //GD.BossIdList[id]
                usedEquip='同一件装备只能由同一个角色用来挑战同一只战盟BOSS，复活后重置'
            }
            let names=[]
            ids.forEach(id=>{
                let base=GD.ItemBaseDatas.get(id)
                names.push(`<color=${Tools.getItemColor(id)}>${base.Name}</>`)
            })
            let bossName=GD.monsterBaseDatas.get(bossId).Name
            UIMgr.I.PopView.showHelpBox(`击杀【<color=${ct.red}>${bossName}</>】掉落道具：<br/>(掉落道具放入战盟仓库，由盟主分配)<br/>    1.装备5件，其中至少有1件为<color=${ct.green}>卓越装备</>；掉落的装备等级由Boss等级决定<br/>    2.必掉1个随机宝石：${names.join('、')}<br/><br/>${usedEquip}`)
        }else if(param.startsWith('q')){
            UIMgr.I.PopView.show(0,this.data)
        }else if(param.startsWith('c')){
            //预览随机仙子宠物、奖励的自选首饰
            UIMgr.I.PopView.hide();
            let id = parseInt(param.slice(1))
            UIMgr.I.PopView.show(0,this.create1RandomEquip(id))
        }else if(param.startsWith('w')){
            //预览随机仙子宠物、奖励的自选首饰
            UIMgr.I.PopView.hide();
            let arr=param.slice(1).split('|')
            let wingId = parseInt(arr[0])
            let isZy = parseInt(arr[1])
            UIMgr.I.PopView.show(0,this.create1Wing(wingId,isZy))
        }
        // else if(param.startsWith('quest')){
        //     if(GD.curMap){
        //         UIMgr.I.unschedule(UIMgr.I.checkTaskPos)
        //         UIMgr.I.startMonitorTaskPos(this.data.task)
        //         UIMgr.I.PopView.data=this.data.pos;
        //         UIMgr.I.PopView.gotoPos(false) //此时为Position对象
        //     }
        // }
    }
    create1Wing(id:number,isZy:number):outer_pb.IDropItem{
        let item = outer_pb.DropItem.create();
        let equip = outer_pb.Equip.create();
        equip.Id=id
        equip.QhLv=0;
        equip.Uid='123456'
        equip.LuckyLv=3;
        equip.ZjLv=12;
        if(isZy){
            equip.ZyList=[9]
        }
        item.ItemType=1
        item.EquipData=equip
        return item
    }
    create1RandomEquip(id:number):outer_pb.IDropItem{
        let item = outer_pb.DropItem.create();
        let equip = outer_pb.Equip.create();
        equip.Id=id
        equip.Lv=0
        equip.Exp=0
        equip.Uid='123456'
        let type = id/10000>>0; 
        if(type == EquipType.Pet){
            equip.Grow=[
                this.getRandomValue(5000),
                this.getRandomValue(5000),
                this.getRandomValue(5000),
                this.getRandomValue(5000),
                this.getRandomValue(5000)
            ]
            equip.YsList=[randomRangeInt(1,9)]
            equip.ZyList=[randomRangeInt(0,9)]
        }else {
            equip.QhLv=0;
            if(type==EquipType.Ring){
                equip.LuckyLv=3;
                equip.ZjLv=15;
                equip.ZyList=[12]
            }else if(type==EquipType.Neck){
                equip.LuckyLv=3;
                equip.ZjLv=12;
                equip.ZyList=[12]
            }else if(type==EquipType.Weapon){
                equip.LuckyLv=1;
                equip.ZjLv=8;
                let base = GD.EquipBaseDatas.get(equip.Id)
                if(base)equip.SkillId=base.SkillId;
                equip.ZyList=[11]
            }
        }
        item.ItemType=1
        item.EquipData=equip
        return item
    }
    getRandomValue(maxV:number) :number {
        let rate = randomRangeInt(0,1000)
        let value =0
        if (rate < 500) {
            value = randomRangeInt(0,maxV * 0.2) 
        } else if (rate < 700) {
            value = randomRangeInt(maxV * 0.2,maxV*0.4)
        } else if (rate < 850) {
            value = randomRangeInt(maxV * 0.4,maxV*0.5)
        } else if (rate < 910) {
            value = randomRangeInt(maxV * 0.5,maxV*0.6)
        } else if (rate < 950) {
            value = randomRangeInt(maxV * 0.6,maxV*0.7)
        } else if (rate < 980) {
            value = randomRangeInt(maxV * 0.7,maxV*0.8)
        } else if (rate < 995) {
            value = randomRangeInt(maxV * 0.8,maxV*0.9)
        } else {
            value = randomRangeInt(maxV * 0.9,maxV)
        }
        return value
    }
}


