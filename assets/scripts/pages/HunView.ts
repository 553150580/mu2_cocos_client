import { _decorator, Component, Label, Node, resources, RichText, Sprite, SpriteFrame } from 'cc';
import { List } from '../UiComps/List';
import WS from '../base/net';
import { Err, MT } from '../base/MT';
import GD from '../base/GameData';
import Tools from '../base/tools';
import { BossHunData, BoxMsg, ct, PopViewType } from '../base/types';
import { UIMgr } from '../managers/UIMgr';
import { ShowItemType } from './PopView';
import { hunHelpInfo } from '../base/consts';
const { ccclass, property } = _decorator;

export class HunShou{
    data:BossHunData;
    star:number;//星级
    num:number;//数量
}

@ccclass('HunView')
export class HunView extends Component {
    @property(RichText)
    proRich:RichText;
    @property(Node)
    equipCell:Node;
    @property(List)
    hunTypeList:List;
    @property(List)
    hunList:List;
    @property(Node)
    hc1Btn:Node;
    @property(Node)
    hc10Btn:Node;
    @property(Label)
    hunNum:Label;
    @property(Node)
    helpBtn:Node;

    equipHun:HunShou=null;
    selectedCell:Node;
    protected onLoad(): void {
        this.hunTypeList.cellRender=(node,index)=>{
            let data:BossHunData = this.hunTypeList.array[index]
            node.children[1].getComponent(Label).string='【魂兽】'+data.Name
            node.children[0].active=node==this.selectedCell;

            let ht =this.huTiHun
            let show:boolean = true
            if(ht&&this.allHunList.length>0){
                show = this.allHunList.some(hun=>{
                    if(hun.data.Id==data.Id){
                        let rate = ht.data.BaseNum*Math.pow(2,ht.star-1)
                        let curRate = hun.data.BaseNum*Math.pow(2,hun.star-1)
                        return curRate>rate;
                    }else{
                        return false
                    }
                })
            }
            node.children[2].active=show
        }
        this.hunTypeList.selectedHandler=(node,index)=>{
            let data:BossHunData = this.hunTypeList.array[index]
            this.hunList.array=this.allHunList.filter(hs=>{
                return hs.data.Id==data.Id;
            })
            if(this.selectedCell)this.selectedCell.children[0].active=false;
            this.selectedCell=node;
            node.children[0].active=true;
            GD.playClickSound()
        }
        this.hunList.cellRender=(node,index)=>{
            let hun:HunShou = this.hunList.array[index]
            this.renderHun(node,hun.data.Id,hun.num,hun.star)
            
        }
        this.hunList.selectedHandler=(node,index)=>{
            let hun:HunShou = this.hunList.array[index];
            this.selectedHun=hun;
            UIMgr.I.PopView.showHunShowInfo(hun,this.doFuTi,this.doUpStar,this.doFjHun)
        }
        this.hc1Btn.on(Node.EventType.TOUCH_END,()=>{
            //合成1个
            this.doHeCheng(1);
        })
        this.hc10Btn.on(Node.EventType.TOUCH_END,()=>{
            //合成10个
            this.doHeCheng(10);
        })
        this.helpBtn.on(Node.EventType.TOUCH_END,()=>{
            UIMgr.I.PopView.showHelpBox(hunHelpInfo)
        })
    }
    doHeCheng=(num:number)=>{
        if(this.hunSpNum>=num*20){
            let req=outer_pb.HunAct.create()
            req.Num=num;
            let buf=outer_pb.HunAct.encode(req).finish()
            WS.send(MT.HeChengHun,buf,(d:any)=>{
                let rsp=outer_pb.HunAct.decode(d)
                if(rsp.ErrCode==Err.ErrCode_Success){
                    this.refreshHunSpNum(rsp.Num)
                    this.onGetHunList(rsp)
                    if(rsp.NewItems){
                        let msglist:Array<BoxMsg>=[]
                        msglist.push(new BoxMsg('合成魂兽碎片获得<br/>',ct.white))
                        for(let i in rsp.NewItems){
                            let id = parseInt(i)
                            let num = rsp.NewItems[i]
                            msglist.push(GD.role.getItem(id,num,true,true,'',true))
                        }
                        UIMgr.I.PopView.showMsgBox(msglist,'继续合成',(d:string)=>{this.doHeCheng(num)})
                        UIMgr.I.tip('合成成功',ct.green)
                    }
                }else{
                    UIMgr.I.tip('魂兽碎片不足')
                }
            })
        }else{
            UIMgr.I.tip(`需要：魂兽碎片x${num*20}`)
        }
    }
    selectedHun:HunShou;
    hunSpNum:number=0;
    refreshHunSpNum=(num:number)=>{
        this.hunSpNum = num;
        this.hunNum.string=num+''
    }
    doFjHun=(num:number)=>{
        // console.log('doFjHun',hun)
        let hun=this.selectedHun;
        if(hun&&num<=hun.num){
            let req=outer_pb.HunAct.create()
            req.Id=hun.data.Id;
            req.Lv=hun.star;
            req.Num=num;
            let buf=outer_pb.HunAct.encode(req).finish()
            WS.send(MT.FjHun,buf,(d:any)=>{
                let rsp=outer_pb.HunAct.decode(d)
                if(rsp.ErrCode==Err.ErrCode_Success){
                    this.refreshHunSpNum(rsp.Num)
                    this.renderFuTiHun(rsp.Id,rsp.Lv)
                    this.onGetHunList(rsp)
                    if(rsp.BasePros){
                        UIMgr.I.resetRoleBasePros(rsp.BasePros)
                    }
                    UIMgr.I.PopView.showMsgBox([new BoxMsg('分解魂兽获得<br/>',ct.white),new BoxMsg(`魂兽碎片x${rsp.GetSpNum}`,ct.purple),])
                    UIMgr.I.tip('分解成功',ct.green)
                }else{
                    UIMgr.I.tip('分解失败，魂兽不存在')
                }
            })
        }
    }
    doFuTi=(hun:HunShou)=>{
        // console.log('doFuTi',hun)
        let req=outer_pb.HunAct.create()
        req.Id=hun.data.Id;
        req.Lv=hun.star;
        let buf=outer_pb.HunAct.encode(req).finish()
        WS.send(MT.FuTiHun,buf,(d:any)=>{
            let rsp=outer_pb.HunAct.decode(d)
            if(rsp.ErrCode==Err.ErrCode_Success){
                this.renderFuTiHun(rsp.Id,rsp.Lv)
                UIMgr.I.resetRoleBasePros(rsp.BasePros)
                this.hunTypeList.refresh();
                this.hunList.refresh();
                UIMgr.I.tip('附体成功',ct.green)
            }else{
                UIMgr.I.tip('附体失败，魂兽不存在')
            }
        })
    }
    doUpStar=(hun:HunShou)=>{
        if(hun.num>=5){
            let req=outer_pb.HunAct.create()
            req.Id=hun.data.Id;
            req.Lv=hun.star;
            let buf=outer_pb.HunAct.encode(req).finish()
            WS.send(MT.UpHunLv,buf,(d:any)=>{
                let rsp=outer_pb.HunAct.decode(d)
                if(rsp.ErrCode==Err.ErrCode_Success){
                    if(rsp.Lv>0){
                        this.renderFuTiHun(rsp.Id,rsp.Lv)
                    }
                    if(rsp.BasePros){
                        UIMgr.I.resetRoleBasePros(rsp.BasePros)
                    }
                    this.onGetHunList(rsp)
                    UIMgr.I.tip('升星成功',ct.green)
                }else{
                    UIMgr.I.tip('升星失败，魂兽数量不足')
                }
            })
        }else{
            UIMgr.I.tip(`升星需要${hun.star+1}星【魂兽】${hun.data.Name}x5`)
        }
    }
    renderHun=(node:Node,id:number,num:number,star:number)=>{
        let icon = node.children[0].getComponent(Sprite)
        let starBox=node.children[2];
        starBox.active=id>0;
        if(id>0){
            let base = GD.monsterBaseDatas.get(id);
            Tools.loadSpriteFrame("ui/monster/" + base.Skin,GD.commonBundle).then(sp=>{
                if(sp)icon.spriteFrame=sp
            })
            starBox.children.forEach((n,i)=>{
                let sp=this.grayStarSp
                if(i<star)sp=this.yellowStarSp
                n.getComponent(Sprite).spriteFrame=sp
            })
        }else{
            icon.spriteFrame=null
        }
        let numLabel=node.children[1].getComponent(Label);
        let str=''
        if(num>0){
            str='x'+num
            let ht =this.huTiHun
            let show:boolean = true
            if(ht){
                let rate = ht.data.BaseNum*Math.pow(2,ht.star-1)
                let curRate = GD.bossHunDatas.get(id).BaseNum*Math.pow(2,star-1)
                show = curRate>rate;
            }
            node.children[3].active=show
        }else{
            if(id==0){
                str='未附体魂兽'
            }
        }
        numLabel.string=str
    }
    huTiHun:HunShou;
    renderFuTiHun=(id:number,lv:number)=>{
        this.renderHun(this.equipCell,id,0,lv)
        if(id>0){
            let hun = new HunShou()
            hun.data = GD.bossHunDatas.get(id);
            hun.star = lv
            this.proRich.string=Tools.getHunShouPros(hun,false)
            this.huTiHun=hun
        }else{
            this.proRich.string='未附体魂兽'
            this.huTiHun=null;
        }
    }
    yellowStarSp:SpriteFrame;
    grayStarSp:SpriteFrame;
    allHunList:Array<HunShou>=[]
    protected onEnable(): void {
        this.hunList.array=[]
        this.hunTypeList.array=[]
        this.hunTypeList.selectedIndex=-1;
        if(this.yellowStarSp==null){
            Tools.loadSpriteFrame('muui/star0',resources).then(sp=>{
                if(sp)this.yellowStarSp=sp;
            })
        }
        if(this.grayStarSp==null){
            Tools.loadSpriteFrame('muui/star1',resources).then(sp=>{
                if(sp)this.grayStarSp=sp;
            })            
        }
        WS.send(MT.GetMyHunList,GD.EmptyRequestBuff,(d:any)=>{
            let rsp=outer_pb.HunAct.decode(d)
            // console.log('getMyHunList',rsp)
            this.refreshHunSpNum(rsp.Num)
            this.renderFuTiHun(rsp.Id,rsp.Lv)
            this.onGetHunList(rsp)
        })
    }
    onGetHunList=(rsp:outer_pb.HunAct)=>{
        this.allHunList=[]
        let types:Map<number,BossHunData>=new Map()
        for(let key in rsp.HunList){
            let arr=key.split('_')
            let hun = new HunShou()
            let id = parseInt(arr[0])
            hun.star = parseInt(arr[1])
            hun.num = rsp.HunList[key]
            let data = GD.bossHunDatas.get(id);
            hun.data=data;
            this.allHunList.push(hun)
            types.set(id,data)
        }
        if(types.size>0){
            this.allHunList.sort((a,b)=>{
                const a_id = a.data.Id
                const b_id = b.data.Id
                if(a_id==b_id){
                    return a.star-b.star
                }else{
                    return a.data.Lv-b.data.Lv
                }
            })
            this.hunTypeList.array=Array.from(types.values()).sort((a,b)=>{return a.Lv-b.Lv})
            const i=this.hunTypeList.selectedIndex
            this.hunTypeList.selectedIndex=i==-1?0:i;
            this.hunTypeList.scrollToTop();
        }
        
    }
    protected onDisable(): void {
        this.hunTypeList.selectedIndex=-1;
        this.proRich.string=''
        this.hunList.array=[]
        this.hunTypeList.array=[]
        this.allHunList=[]
        this.equipHun=null;
        this.selectedHun=null;
        this.huTiHun=null;
        this.refreshHunSpNum(0);
        if(this.selectedCell){
            this.selectedCell.children[0].active=false;
            this.selectedCell=null;
        }
    }
}


