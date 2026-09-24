import { _decorator, Label, Node, ProgressBar, UITransform } from 'cc';
import { List } from '../UiComps/List';
import WS from '../base/net';
import { ConfigType, MT } from '../base/MT';
import GD from '../base/GameData';
import { UIMgr } from '../managers/UIMgr';
import { ct } from '../base/types';
import { BasePage } from './BasePage';
import { PopView } from './PopView';
import { LineHelpStr, PrivateLineKaInfo } from '../base/consts';
import Tools from '../base/tools';
const { ccclass, property } = _decorator;

// const LineNames:Array<string> = ['普通','黄金'];

@ccclass('LinePage')
export class LinePage extends BasePage {
    @property(Node)
    frame:Node
    @property(Label)
    head:Label
    @property(Node)
    helpBtn:Node
    @property(List)
    list:List
    onLoad() {
        super.onLoad();
        this.helpBtn.on(Node.EventType.TOUCH_END,(event:any)=>{
            GD.playClickSound();
            let info=LineHelpStr
            if(GD.role.data.IsYkMode==false){
                info+=PrivateLineKaInfo
            }
            UIMgr.I.PopView.showHelpBox(info)
            // this.helpBox.active=true;
        },this);
        // this.helpBox.on(Node.EventType.TOUCH_END,(event:any)=>{
        //     this.helpBox.active=false;
        // },this);
        this.list.array=[];
        this.list.selectedHandler = (node:Node,index:number)=>{
            if(GD.role.canChangPos()){
                let data:outer_pb.ILineInfo = this.list.array[index];
                if(data.LineId==GD.role.data.LineId){
                    UIMgr.I.tip('您已在该线路');
                    return;
                }
                const now = Date.now()/1000
                if(data.LineLv==3){
                    if(data.Time<now){
                        UIMgr.I.tip('无法进入，您的专属线路已过期');
                        return;
                    }
                    if(GD.role.hasBaseYk(false)==false){
                        UIMgr.I.tip('无法进入，进入专属线路需要特权月卡');
                        return;
                    }
                }else if(data.LineLv==2&&GD.role.hasGoldYk(false)==false){
                    UIMgr.I.tip('无法进入，黄金月卡已失效');
                    return;
                }
                let maxNum = GD.configs.get(ConfigType.MaxLineRoleNum)
                if(GD.curMap.mapData.FbType>0){
                    maxNum = GD.configs.get(ConfigType.MaxFbRoleNum)
                }else if(data.LineLv>1){
                    maxNum = maxNum+500 //野外地图的黄金线路、专属线路
                }
                if(data.LineLv!=3&&data.PlayerNum>=maxNum){
                    if(GD.role.hasBaseYk(false)==false){
                        UIMgr.I.tip('该地图线路已爆满，无法进入');
                        return;
                    }
                }
                let req = outer_pb.JoinLineAct.create();
                req.LineId=data.LineId;
                req.PointIndex=-1;//非换点位，服务端用于判断角色应该出生在哪里
                let buff = outer_pb.JoinLineAct.encode(req).finish();
                WS.send(MT.ChangeLine,buff)
            }
            UIMgr.I.hideCurPage();
        }
        this.list.cellRender = (node:Node,index:number)=>{
            let data:outer_pb.ILineInfo = this.list.array[index];
            let label1 = node.children[0].getComponent(Label);
            let str:string
            if(data.LineId=='99'){
                str='我的专属线路'
            }else{
                let id = parseInt(data.LineId)
                let lvStr='普通'
                if(data.LineLv==2){
                    lvStr='黄金'
                }
                str = `${id}线-【${lvStr}线路】`;
            }
            label1.string = str

            let maxNum = GD.configs.get(ConfigType.MaxLineRoleNum)
            if(GD.curMap.mapData.FbType>0){
                maxNum = GD.configs.get(ConfigType.MaxFbRoleNum)
            }else if(data.LineLv>1){
                maxNum = maxNum
            }
            const isFull = data.PlayerNum>=maxNum;
            let time = data.Time  as number;
            let label2 = node.children[1].getComponent(Label);
            let str2:string
            let color2:ct
            let color1:ct
            const now = Tools.getBeiJingSecond()
            if(data.LineLv==3){
                const delta = Math.floor(time-now)
                if(delta<=0){
                    str2 = '已到期'
                    color1=color2=ct.gray
                }else{
                    str2 = '可进入'+Tools.getYkTimeString(time)
                    color2=ct.green
                    color1=ct.purple
                }
            }else if(data.LineLv==2){
                const delta = Math.floor(GD.role.data.GoldYk-now)
                if(delta>0){
                    str2 = isFull?'爆满':'可进入'+Tools.getYkTimeString(GD.role.data.GoldYk)
                    color2=ct.green
                    color1=ct.yellow
                }else{
                    str2 = '进入条件不足'
                    color1=color2=ct.gray
                }
            }else{
                str2 = isFull?'爆满':'可进入'
                color2=ct.green
                color1=ct.white
            }
            label2.string = str2
            label2.color.fromHEX(color2);
            label1.color.fromHEX(color1);
            
            let bar =node.children[2].getComponent(ProgressBar);
            bar.progress = data.PlayerNum*5/(maxNum/3);
            node.children[3].active = data.LineId==GD.role.data.LineId;
        };
    }
    initData(d:any) {
        this.list.array=[]
        WS.send(MT.GetLineList,GD.EmptyRequestBuff,d=>{
            let rsp = outer_pb.GetLineList.decode(d);
            // console.log('GetLineList',rsp)
            let infos = rsp.LineInfo.sort((a,b)=>{
                let id1 = parseInt(a.LineId)
                let id2 = parseInt(b.LineId)
                return id1-id2
            })
            if(GD.LineIdLvs==null){
                GD.LineIdLvs = new Map();
            }
            infos.forEach(info=>{
                GD.LineIdLvs.set(info.LineId,info.LineLv)
            })
            this.list.row = infos.length;
            this.list.array=infos;
            this.frame.getComponent(UITransform).height = 30+infos.length*90;
            this.list.node.getComponent(UITransform).height = infos.length*90;
            let name = GD.curMap.mapName;
            this.head.color.fromHEX(GD.corlorMap1.get(GD.role.data.WorldLv));
            this.head.string=name;
        })
    }
}


