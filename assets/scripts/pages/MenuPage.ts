import { _decorator,  Label,  Node } from 'cc';
import { BasePage } from './BasePage';
import { PageType, UIMgr } from '../managers/UIMgr';
import { BoxMsg, ct,  PopViewType } from '../base/types';
import GD from '../base/GameData';
import WS from '../base/net';
import { ConfigType, Err, MT } from '../base/MT';
import { List } from '../UiComps/List';
import { SDK } from '../base/SDK';
import { HuoDongInfo, KfBuffInfo, KfMapInfo } from '../base/consts';
const { ccclass, property } = _decorator;

export class Menu{
    name:string;
    // needCheckLimited:boolean;//是否需要确认特权卡有效（只有点数转入不需要确认，其它都要）
    cb:()=>void;
    color:ct;
    constructor(name:string,color:ct=null,cb:()=>void=null){
        this.name=name;
        if(color){
            this.color=color
        }else{
            this.color=ct.gray
        }
        if(cb){
            this.cb=cb;
        }else{
            this.cb= ()=>{ UIMgr.I.tip('该功能排队开发中，尽情期待！')}
        }
        // this.needCheckLimited=needCheckLimited;
    }
}
@ccclass('MenuPage')
export class MenuPage extends BasePage {
    @property(List)
    list:List;
    @property(Label)
    head:Label;

    onLoad() {
        super.onLoad();
        this.list.cellRender=(node:Node,index:number)=>{
            let menu = this.list.array[index]
            let label = node.children[0].getComponent(Label)
            label.string = menu.name
            label.color.fromHEX(menu.color)
        }
        this.list.selectedHandler=(node:Node,index:number)=>{
            let menu = this.list.array[index]
            // if(menu.needCheckLimited){
            //     if(GD.role.isLimited()) return
            // }
            menu.cb()
        }
    }
    initData(data: any): void {
        if(data==0){
            let jfAct=new Menu('转入积分',ct.purple,this.getMyAccountJf)
            let list=[]
            this.menus0.forEach(m=>{list.push(m)})
            if(GD.role.data.IsYkMode==false)list.push(jfAct)
            this.list.array=list;
            this.head.string='功能列表'
        }else if(data==1){
            this.list.array=this.menus1
            this.head.string='活动列表'
        }
    }
    tryUpMuPointToMyAccount=()=>{
        UIMgr.I.PopView.showSliderBox(`当前角色剩余点数：<color=${ct.brown}>${GD.role.data.MuPoint}点</><br/><color=${ct.red}>(注意：点数转出到您的账号上需要扣除10%手续费)</>`,ct.white,GD.role.data.MuPoint,'转出',(num:number)=>{
            if(GD.role.data.MuPoint>0){
                this.upMuPointToMyAccount(num)
            }else{
                UIMgr.I.tip('当前角色点数为0')
            }
        },null,true)
    }
    getMyAccountMuPoint=()=>{
        WS.send(MT.GetMyAccountMuPoint,GD.EmptyRequestBuff,(d:any)=>{
            let rsp = outer_pb.CommonAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                UIMgr.I.PopView.showSliderBox(`当前账号剩余点数：<color=${ct.brown}>${rsp.Num}点</><br/><color=${ct.green}>(点数转入到角色上免手续费，也可随时转出到账号上)</><br/><color=${ct.gray}>(注意：转出到账号上时将收取10%手续费)</>`,ct.brown,rsp.Num,'转入',(num:number)=>{
                    if(rsp.Num>0&&num<=rsp.Num){
                        this.downMuPointFromMyAccount(num);
                    }else{
                        UIMgr.I.tip('您账号上剩余的点数为0')
                    }
                })
            }else{
                UIMgr.I.tip(`暂时无法获取您账号上的点数${rsp.ErrCode}`)
            }
        })
    }
    getMyAccountJf=()=>{
        WS.send(MT.GetMyAccountJf,GD.EmptyRequestBuff,(d:any)=>{
            let rsp = outer_pb.CommonAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                UIMgr.I.PopView.showSliderBox(`当前账号剩余累计充值积分：<color=#B3FF77>${rsp.Num} 积分</><br/><color=${ct.gray}>(转入积分免手续费，但只能转入，不可转出)<br/>(积分只能用于角色领取累充奖励)</>`,ct.brown,rsp.Num,'转入',(num:number)=>{
                    if(rsp.Num>0&&num<=rsp.Num){
                        this.downJfFromMyAccount(num);
                    }else{
                        UIMgr.I.tip('您账号上剩余的充值积分为0')
                    }
                })
            }else{
                UIMgr.I.tip(`暂时无法获取您账号上的积分${rsp.ErrCode}`)
            }
        })
    }
    getMyAccountLcBox=()=>{
        WS.send(MT.GetMyAccountGotLcBox,GD.EmptyRequestBuff,(d:any)=>{
            let rsp = outer_pb.CommonAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_Success){
                UIMgr.I.PopView.showSliderBox(`当前账号剩余可领取：<color=${ct.brown}>回馈宝箱x${rsp.Num}</><br/><color=${ct.gray}>(每充值满100元可领取1个回馈宝箱)</>`,ct.brown,rsp.Num,'领取',(num:number)=>{
                    if(rsp.Num>0&&num<=rsp.Num){
                        this.gotLcBoxFromMyAccount(num);
                    }else{
                        UIMgr.I.tip('剩余可领取回馈宝箱数量不足')
                    }
                })
            }else{
                UIMgr.I.tip(`暂时无法获取回馈宝箱数量信息${rsp.ErrCode}`)
            }
        })
    }
    upMuPointToMyAccount=(num:number)=>{
        if(num>0&&num<=GD.role.data.MuPoint){
            let req = outer_pb.CommonAct.create();
            req.Num=num
            let buff = outer_pb.CommonAct.encode(req).finish();
            WS.send(MT.UpMuPointToMyAccount,buff,(d:any)=>{
                let rsp = outer_pb.CommonAct.decode(d);
                if(rsp.ErrCode==Err.ErrCode_Success){
                    GD.role.reduceMuPoint(rsp.Num)
                    UIMgr.I.tip('转出成功',ct.green)
                }else{
                    UIMgr.I.tip(`转出失败${rsp.ErrCode}`)
                }
            })
        }
    }
    downMuPointFromMyAccount=(num:number)=>{
        if(num>0){
            let req = outer_pb.CommonAct.create();
            req.Num=num
            let buff = outer_pb.CommonAct.encode(req).finish();
            WS.send(MT.DownMuPointFromMyAccount,buff,(d:any)=>{
                let rsp = outer_pb.CommonAct.decode(d);
                if(rsp.ErrCode==Err.ErrCode_Success){
                    GD.role.addMuPoint(rsp.Num,true,'转入成功，')
                }else{
                    UIMgr.I.tip(`转入失败${rsp.ErrCode}`)
                }
            })
        }
    }
    downJfFromMyAccount=(num:number)=>{
        if(num>0){
            let req = outer_pb.CommonAct.create();
            req.Num=num
            let buff = outer_pb.CommonAct.encode(req).finish();
            WS.send(MT.DownJfFromMyAccount,buff,(d:any)=>{
                let rsp = outer_pb.CommonAct.decode(d);
                if(rsp.ErrCode==Err.ErrCode_Success){
                    UIMgr.I.tip(`转入成功，当前角色积分：+${rsp.Num}`,ct.green)
                }else{
                    UIMgr.I.tip(`转入失败${rsp.ErrCode}`)
                }
            })
        }
    }
    gotLcBoxFromMyAccount=(num:number)=>{
        if(num>0){
            let req = outer_pb.CommonAct.create();
            req.Num=num
            let buff = outer_pb.CommonAct.encode(req).finish();
            WS.send(MT.GotLcBoxFromMyAccount,buff,(d:any)=>{
                let rsp = outer_pb.CommonAct.decode(d);
                if(rsp.ErrCode==Err.ErrCode_Success){
                    GD.role.getItem(70,rsp.Num,true,true)
                    UIMgr.I.tip('领取成功',ct.green)
                }else{
                    UIMgr.I.tip(`领取失败${rsp.ErrCode}`)
                }
            })
        }
    }
    tryPay=(index:number)=>{
        //发起支付
        // console.log('tryPay',index)
        let obj = GD.PayMoneyNums[index]
        let info = `main:${GD.role.data.Id}:${GD.role.data.Name}:0`
        SDK.tryPay(obj.Amount,GD.role.data.Name,GD.role.data.Lv+GD.role.data.ZsNum*400,GD.role.data.Id,info)
    }
    menus1:Array<Menu>=[
        new Menu('拜师收徒',ct.blue,()=>{
            UIMgr.I.show(PageType.ShiTuPage,null,true)
        }),
        new Menu('矿洞',ct.blue,()=>{
            UIMgr.I.show(PageType.HolePage,null,true)
        }),
        new Menu('战盟',ct.blue,()=>{
            if(GD.role.hasEnoughLv(GD.configs.get(ConfigType.ZmMinJoinZmNeedLv))){
                UIMgr.I.show(PageType.ZmPage,0,true)
            }
        }),
        new Menu('火龙王袭击',ct.red,()=>{
            WS.send(MT.GetRemainHlwNums,GD.EmptyRequestBuff,(d:any)=>{
                let msg=`${HuoDongInfo}【当前剩余火龙王数量】：<br/>`
                let rsp = outer_pb.RecoverEquips.decode(d);
                rsp.UidList.forEach(k=>{
                    msg+=`    ${k}<br/>`
                })
                UIMgr.I.PopView.showHelpBox(msg)
            })
        }),
        new Menu('无尽之塔',ct.green,()=>{
            if(GD.role.hasEnoughLv(GD.configs.get(ConfigType.ActiveLv_Tower))){
                UIMgr.I.show(PageType.TowerPage,null,true)     
            }
        }),
        new Menu('竞技场',ct.purple,()=>{
            if(GD.role.hasEnoughLv(GD.configs.get(ConfigType.ActiveLvRankPk))){
                UIMgr.I.show(PageType.RankPkPage,false,true)
            }
        }),
        new Menu('恶魔广场',ct.blue,()=>{
            let npc = GD.npc_list.get(10);
            UIMgr.I.show(npc.PageType,npc,true);
        }),
        new Menu('血色城堡',ct.blue,()=>{
            let npc = GD.npc_list.get(20);
            UIMgr.I.show(npc.PageType,npc,true);
        }),
        new Menu('跨服地图',ct.red,()=>{
            UIMgr.I.PopView.showHelpBox(KfMapInfo)
        }),
        new Menu('许愿',ct.blue,()=>{
            UIMgr.I.show(PageType.FuLiPage,0,true)
        }),
        new Menu('首杀奖励',ct.red,()=>{
            UIMgr.I.show(PageType.FuLiPage,3,true)
        }),
        new Menu('冲级奖励',ct.red,()=>{
            UIMgr.I.show(PageType.FuLiPage,4,true)
        }),
        new Menu('猜字活动',ct.yellow,()=>{
            UIMgr.I.show(PageType.GuessPage,0,true)
        }),
        new Menu('集字活动',ct.blue,()=>{
            UIMgr.I.show(PageType.JiLabelPage,0,true)
        }),
    ]
    menus0:Array<Menu>=[
        new Menu('怪物掉落',ct.white,()=>{UIMgr.I.PopView.showDropBox()}),
        new Menu('礼包码',ct.white,()=>{
            let msg=null
            if(GD.role.data.IsYkMode){
                msg=[new BoxMsg(`<br/><br/>礼包奖励为非绑定道具<br/>为防止刷资源，领取礼包需要开通特权卡`,ct.brown)]
            }
            UIMgr.I.PopView.showMsgBox(msg,'确定',this.tryUseCdKey,'取消',true,'请输入礼包码')}),
        new Menu('好友',ct.blue,()=>{UIMgr.I.show(PageType.FriendPage,null,true)}),
        new Menu('称号',ct.purple,()=>{UIMgr.I.show(PageType.ChengHaoPage,null,true)}),

        new Menu('设置',ct.white,()=>{UIMgr.I.show(PageType.SetPage,null,true)}),
        new Menu('系统商城',ct.yellow,()=>{UIMgr.I.show(PageType.NpcShopPage,GD.npc_list.get(30),true);}),
        new Menu('领取回馈宝箱',ct.green,this.getMyAccountLcBox),
        new Menu('购买点数',ct.red,()=>{UIMgr.I.PopView.show(PopViewType.PayBox,null,false,0,'',SDK.doTryPay)}),

        new Menu('推广码',ct.white,()=>{
            UIMgr.I.show(PageType.TgCodePage,null,true)
        }),
        new Menu('概率加成',ct.blue,()=>{
            WS.send(MT.GetFailedAddRates,GD.EmptyRequestBuff,(d:any)=>{
                let msg=`当前角色在各种强化、合成失败后，下次进行同样的强化、合成时额外的概率加成（成功后重置为0）<br/><br/>`
                let rsp=outer_pb.LoginGateResponse.decode(d)
                GD.FailedAddRates.forEach((info,i)=>{
                    let num = rsp.Config[info.Type]
                    if(num==null){
                        num=0
                    }
                    let after='（上次成功率的10%)'
                    if(info.Mode==1){
                        after=`（失败次数*${info.Add*100}%)`
                    }
                    msg+=`${info.Name}：下次成功率 <color=${ct.blue}>+${num*info.Add*100>>0}%</>${after}<br/>`
                })
                UIMgr.I.PopView.showHelpBox(msg)
            })
        }),
        new Menu('跨服加成',ct.blue,()=>{UIMgr.I.PopView.showHelpBox(KfBuffInfo)}),
        new Menu('转出点数',ct.brown, this.tryUpMuPointToMyAccount),
        new Menu('转入点数',ct.brown,this.getMyAccountMuPoint),
        // new Menu('转入积分',ct.purple,this.getMyAccountJf),
        // new Menu('自由竞技场'),
        // new Menu('组队天梯赛'),
        // new Menu('深渊挑战'),
        // new Menu('守护要塞'),
        // new Menu('押镖'),
        // new Menu('许愿'),
        // new Menu('今晚吃鸡'),
        // new Menu('组队塔防'),
        // new Menu('团队副本'),
        // new Menu('小游戏'),
        // new Menu('...'),
        // new Menu('GM测试商店',ct.yellow,()=>{UIMgr.I.show(PageType.NpcShopPage,GD.npc_list.get(999),true)}),
    ]
    tryUseCdKey=(key:string)=>{
        //nbmu777
        if(GD.role.data.IsYkMode==false||GD.role.hasBaseYk()){
            if(key.length==7){
                let req = outer_pb.MailAct.create();
                req.Uid=key
                let buff = outer_pb.MailAct.encode(req).finish();
                WS.send(MT.TryUseCdKey,buff,(d:any)=>{
                    let rsp = outer_pb.MailAct.decode(d);
                    if(rsp.ErrCode==Err.ErrCode_Success){
                        if(rsp.Items){
                            GD.role.getItems(rsp.Items,true,false,'使用礼包码')
                            // for(let idStr in rsp.Items){
                            //     let id = parseInt(idStr)
                            //     let num = rsp.Items[idStr]
                            //     GD.role.getItem(id,num,true,false,'使用礼包码')
                            // }
                        }
                        // if(rsp.Equips.length>0){
                        //     rsp.Equips.forEach(equip=>{
                        //         GD.role.getEquip(equip,true)
                        //     })
                        // }
                        UIMgr.I.tip('使用礼包码成功',ct.green)
                    }else if(rsp.ErrCode==Err.ErrCode_NotEnoughNum){
                        UIMgr.I.tip(`您已使用过该礼包码`)
                    }else{
                        UIMgr.I.tip(`礼包码错误${rsp.ErrCode}`)
                    }
                })
            }else{
                UIMgr.I.tip('礼包码错误')
            }
        }
    }
}


