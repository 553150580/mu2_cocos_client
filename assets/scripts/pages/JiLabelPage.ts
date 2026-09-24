import { _decorator, Label, Node, RichText } from 'cc';
import { BasePage } from './BasePage';
import { List } from '../UiComps/List';
import { ct, JiLabelReward } from '../base/types';
import GD from '../base/GameData';
import Tools from '../base/tools';
import WS from '../base/net';
import { Err, MT } from '../base/MT';
import { UIMgr } from '../managers/UIMgr';
const { ccclass, property } = _decorator;

@ccclass('JiLabelPage')
export class JiLabelPage extends BasePage {
    @property(List)
    doList:List;
    @property(RichText)
    have:RichText;
    all=[90,91,92,93,94,95,96]
    // "奇、迹"单个字可兑换500钻石，
    // "真、好、玩"单个字可兑换500万金币，
    // “奶爸奇迹真好玩”可兑换黄金卡7天
    // doListData:Array<Obj>=[
    //     {need:[90],reward:[15,1000]}, // "奶"单个字可兑换1000钻石，
    //     {need:[91],reward:[15,1000]}, // "爸"单个字可兑换1000钻石，
    //     {need:[92],reward:[15,500]}, // "奇"单个字可兑换500钻石，
    //     {need:[93],reward:[15,500]}, // "迹"单个字可兑换500钻石，
    //     {need:[94],reward:[14,5000000]}, // "真"单个字可兑换500万金币，
    //     {need:[95],reward:[14,5000000]}, // "好"单个字可兑换500万金币，
    //     {need:[96],reward:[14,5000000]}, // "玩"单个字可兑换500万金币，
    //     {need:[90,91,92,93],reward:[15,10000]}, // "奶爸奇迹"可兑换1万钻石，
    //     {need:[94,95,96],reward:[14,100000000]}, // "真好玩"可兑换1亿金币，
    //     {need:[90,91,92,93,94,95,96],reward:[16,1]}, // “奶爸奇迹真好玩”可兑换黄金卡7天
    // ]
    onLoad() {
        super.onLoad();
        this.doList.array=GD.JiLabelRewards
        this.doList.cellRender=(node:Node,index:number)=>{
            let obj:JiLabelReward = this.doList.array[index]
            let btn = node.children[2];
            btn.off(Node.EventType.TOUCH_END)
            let label=btn.children[0].getComponent(Label)
            let color=ct.gray
            let ok=obj.Needs.every(id=>{return GD.role.hasEnoughItem(id,1,false)})
            let doStr='不足'
            if(ok){
                doStr='兑换'
                color=ct.green
                btn.on(Node.EventType.TOUCH_END,()=>{
                    let req = outer_pb.JfAct.create()
                    req.Index=index;
                    let buff=outer_pb.JfAct.encode(req).finish()
                    WS.send(MT.GetJiLabelReward,buff,(d:any)=>{
                        let rsp=outer_pb.JfAct.decode(d)
                        if(rsp.ErrCode==Err.ErrCode_Success){
                            if(rsp.Items){
                                for(let i in rsp.Items){
                                    let id = parseInt(i)
                                    let num = rsp.Items[i]
                                    GD.role.getItem(id,num,true,false)
                                }
                            }
                            obj.Needs.forEach(id=>{
                                GD.role.reduceItem(id,1)
                            })
                            this.refreshHaveLabel()
                            this.doList.refresh()
                            UIMgr.I.tip('兑换成功！',ct.green)
                        }else{
                            UIMgr.I.tip('兑换失败，数量不足')
                        }
                    })
                },this)
            }
            label.string=''
            label.string=doStr
            label.color.fromHEX(color)
            let names=[]
            obj.Needs.forEach(id=>{
                let c=ct.gray
                if(GD.role.hasEnoughItem(id,1,false))c=ct.green;
                names.push(`<color=${ct.blue}>${GD.ItemBaseDatas.get(id).Name}</>x<color=${c}>1</>`)
            })
            let rewardId=obj.Rewards[0]
            let itemName=GD.ItemBaseDatas.get(rewardId).Name
            let num=obj.Rewards[1].toLocaleString();
            node.children[1].getComponent(RichText).string=`集齐：${names.join('+')}<br/>可兑换：<color=${Tools.getItemColor(rewardId)}>${itemName}x${num}</>`
        }
    }
    refreshHaveLabel=()=>{
        let names=[]
        this.all.forEach(id=>{
            let item = GD.role.BagItems.find(item=>{return item.Id==id})
            let num=0
            if(item&&item.Num>0){
                num=item.Num
            }
            names.push(`<color=${ct.blue}>${GD.ItemBaseDatas.get(id).Name}</>x${num}`)
        })
        this.have.string=`我的字：${names.join(' ')}`
    }
    initData(data:any){
        this.refreshHaveLabel()
    }
}


