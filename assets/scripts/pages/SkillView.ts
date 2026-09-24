import { _decorator, Component, EventTouch, Label, Node, NodeEventType, RichText, ScrollView, Sprite, SpriteFrame, UITransform } from 'cc';
import { List } from '../UiComps/List';
import { Tab } from '../UiComps/Tab';
import { ct, MaxAtkTypeString, RoleType, Skill, SkillType, SkillUpProTypeString, YsTypeString } from '../base/types';
import Tools from '../base/tools';
import GD from '../base/GameData';
import { UIMgr } from '../managers/UIMgr';
import { ShowItemType } from './PopView';
import WS from '../base/net';
import { ConfigType, Err, MT } from '../base/MT';
import { BaoBaoInfoStr, ResetSkillInfoStr, ResetSkillStr } from '../base/consts';
import { ViewStack } from '../UiComps/ViewStack';
const { ccclass, property } = _decorator;

@ccclass('SkillView')
export class SkillView extends Component {
    @property(List)
    skillList:List;
    @property(Tab)
    tab:Tab;
    @property(Node)
    resetBtn:Node;
    @property(Node)
    slots:Node;
    @property(ViewStack)
    view:ViewStack
    // @property(List)
    // setSkillList:List
    @property(Tab)
    skillModeTab:Tab;

    // selectedSlotIndex:number=-1;
    // hasChangeSkillSet:boolean=false;
    isShow:boolean=false;
    protected onLoad(): void {
        this.tab.selectedHandler =(node:Node,index:number)=>{
             if(this.isShow){
                GD.playClickSound();
            }else{
                this.isShow=true;
            }
            this.resetBtn.active = index==0||index==2;
            if(index==2){
                //大师天赋
                this.view.selectedIndex=1;
            }else{
                this.view.selectedIndex=0;
                let arr:Array<Skill> = []
                if(index==0){
                    //本职业职业技能
                    GD.allSkills.forEach(skill=>{
                        if(skill.LearnItemId>0&&skill.RoleType>0&&(GD.role.data.RoleType&skill.RoleType)>0){
                            let s=GD.role.skills.get(skill.Id)
                            if(s){
                                skill.canUse=s.canUse
                                skill.Lv=s.Lv
                            }else{
                                skill.canUse=false
                            }
                            arr.push(skill);
                        }
                    })
                }else if(index==1){
                    //本职业可用特殊技能（武器技能、闪电链、连击等）
                    GD.allSkills.forEach(skill=>{
                        if(skill.Id>4&&skill.LearnItemId==0&&(skill.RoleType==0||(skill.RoleType>=0&&GD.role.data.RoleType&skill.RoleType)>0)){
                            let s=GD.role.skills.get(skill.Id)
                            if(s){
                                skill.canUse=s.canUse
                                skill.Lv=s.Lv
                            }else{
                                skill.canUse=false
                            }
                            arr.push(skill);
                        }
                    })
                }
                arr.sort((a,b)=>{return a.DropLv-b.DropLv})
                this.scheduleOnce(()=>{
                    this.skillList.array = arr
                },0)
            }
        }
        this.skillList.cellRender = (node:Node,index:number)=>{
            let skill:Skill = this.skillList.array[index];
            let name = node.children[3].getComponent(RichText);
            let ys = skill.YsType>0?YsTypeString[skill.YsType]:'无'
            node.children[9].getComponent(Label).string=`(元素：${ys})`;
            let pro = GD.role.basePros
            let cd = skill.Cd-(GD.configs.get(ConfigType.DefaultAtkCd)-pro.AtkCd);
            if(cd<=0)cd=pro.AtkCd;
            let curTotalLv = skill.Lv+pro.AddSkillLv
            let needAg = ''
            if(skill.NeedAg>0){
                needAg = ` AG-<color=${ct.purple}>${skill.NeedAg}</>`
            }
            let addLj=''
            if(skill.AddLj>0){
                addLj = ` 连击值+<color=${ct.qing}>${skill.AddLj}</>`
            }
            let targetNum = ''
            if(skill.TargetNum>0){
                targetNum = ` 目标<color=${ct.green}>${skill.TargetNum}</>`
            }
            let nameColor=ct.blue
            if(skill.DropLv>=46){
                nameColor=ct.purple
            }
            name.string = `<color=${nameColor}>${skill.Name}</> Lv.${curTotalLv}<size=26>（MP-<color=${ct.blue}>${skill.NeedMp}</>${needAg}${addLj} CD<color=${ct.green}>${(cd*100>>0)/100}秒</> 范围<color=${ct.green}>${skill.UseDis}</>${targetNum}）</>`
            Tools.loadSpriteFrame("ui/skill_icon/" + skill.Id,GD.commonBundle).then(sp=>{
                node.children[2].getComponent(Sprite).spriteFrame = sp;
            })
            
            let nextLv = curTotalLv+1
            if(nextLv>10)nextLv=10
            let num = skill.Nums[0]
            let numStr:string='';
            if(num>0){
                const delta = skill.Nums[1] 
                //每级提升基数，每升一级，dmg增加lv倍的基数
                let upNum=0;
                let twoAtkRateStr=''
                if(skill.Repeat==2){
                    // twoAtkRateStr=`，100%对目标造成${skill.Repeat}次伤害`
                    let rate=0
                    let next=0
                    if (curTotalLv <= 10) {
                        rate= 0.2 + 0.0015 * curTotalLv * (curTotalLv + 1);
                        next=(curTotalLv + 1)*3/10
                    }else{
                        rate= 0.365 + (curTotalLv - 10) * 0.03;
                        next=3
                    }
                    twoAtkRateStr=`，<color=${ct.blue}>${(rate*10000>>0)/100}%</>概率2次伤害(下一级<color=${ct.green}>+${next}%</>)`
                }
                if(curTotalLv > 0){
                    for(let i = 1; i <= curTotalLv; i++) {
                        if(i>10){
                            upNum += delta * 10
                        }else{
                            upNum += delta * i
                        }
                    }
                }
                let upProNum=0
                let pros = ''
                if(skill.UpProTypes.length>0){
                    skill.UpProTypes.forEach((t:number,index:number)=>{
                        let step = skill.UpSteps[index]
                        upProNum += GD.role.getUpProNum(t)/step>>0
                        let upTypeStr = SkillUpProTypeString[t]
                        if(t==8){
                            if(skill.Id==67){
                                //把闪电链技能设置为最大攻击力的类型(其它技能保持配置不变)
                                const roleType = GD.role.data.RoleType;
                                const bp = GD.role.basePros;
                                if (roleType == RoleType.ZS || roleType == RoleType.GJS || roleType == RoleType.SDS) {
                                    skill.AtkType = 0 //物理攻击
                                } else if (roleType == RoleType.MJS) {
                                    if (bp.MaxMagicAtk > bp.MaxAtk) {
                                        skill.AtkType = 1 //魔法攻击
                                    } else {
                                        skill.AtkType = 0 //物理攻击
                                    }
                                } else if (roleType == RoleType.ZHS) {
                                    if (bp.MaxMagicAtk > bp.MaxZzAtk) {
                                        skill.AtkType = 1 //魔法攻击
                                    } else {
                                        skill.AtkType = 2 //诅咒攻击
                                    }
                                } else if (roleType == RoleType.FS ){
                                    skill.AtkType = 1 //魔法攻击
                                }
                            }
                            upTypeStr = MaxAtkTypeString[skill.AtkType];
                        }
                        pros+=`，每<color=${ct.green}>${step}</>点<color=${ct.blue}>${upTypeStr}</>+1`
                    })
                }
                numStr= `，<color=${ct.blue}>技能攻击力+${num+upNum+upProNum}</>（下一级<color=${ct.green}>+${delta*nextLv}</>${pros}）${twoAtkRateStr}`
            }
            let allBuffStr:string=''
            if(skill.BuffIds.length>0){
                skill.BuffIds.forEach(buffId=>{
                    let buff = GD.allBuffs.get(buffId)
                    if(buff){
                        let buffStr = `<br/><color=${ct.blue}>${buff.Info}`
                        if(buff.InstallNums.length==3){
                            let num = buff.InstallNums[0]
                            let upDelta = buff.InstallNums[1]
                            let upNum=0;
                            if(curTotalLv > 0){
                                for(let i = 1; i <= curTotalLv; i++) {
                                    if(i>10){
                                        upNum += upDelta * 10
                                    }else{
                                        upNum += upDelta * i
                                    }
                                }
                            }
                            let isNotPercent = buff.IsPer==0
                            let max = buff.InstallNums[2]
                            let maxStr = ''
                            if(max>0){
                                maxStr = isNotPercent?`，上限${max}`:`，上限${max*100}%`
                            }
                            let upProNum=0
                            let pros = ''
                            if(buff.InstallUpProTypes.length>0){
                                buff.InstallUpProTypes.forEach((t:number,i:number)=>{
                                    let step = buff.InstallUpSteps[i]
                                    let a = GD.role.getUpProNum(t)/step;
                                    upProNum += a
                                    if(isNotPercent){
                                        pros+=`，每<color=${ct.green}>${step}</>点<color=${ct.blue}>${SkillUpProTypeString[t]}</><color=${ct.green}>+1</>`
                                    }else{
                                        let delta = (1/step*1000000>>0)/1000000
                                        pros+=`，每1点<color=${ct.blue}>${SkillUpProTypeString[t]}</><color=${ct.green}>+${delta*100}%</>`
                                    }
                                })
                            }
                            let b = num+upNum+upProNum;
                            if(max>0&&b>max) b=max

                            let upPer=''
                            if(upDelta>0){
                                upPer = `，下一级<color=${ct.green}>+`
                                let a = upDelta*nextLv;
                                if(max>0&&b>=max) a=0
                                if(isNotPercent){
                                    upPer += (a*100>>0)/100+'</>'
                                }else{
                                    upPer += `${(a*100000>>0)/1000}%</>`
                                }
                            }
                            let numStr = isNotPercent?(b>>0)+'':`${((b*100000>>0)/1000)}%`
                            buffStr += `+${numStr}</>${upPer}${pros}${maxStr}`
                        }else{
                            if(buff.IntervalUpProTypes.length>0){
                                buff.IntervalUpProTypes.forEach((t,i)=>{
                                    let step = buff.IntervalUpSteps[i]
                                    buffStr+=`，每<color=${ct.green}>${step}</>点<color=${ct.blue}>${SkillUpProTypeString[t]}</><color=${ct.green}>+1</>`
                                })
                            }
                            buffStr+='</>'
                        }
                        if(buff.Duration.length>0){
                            let ms = buff.Duration[0]+buff.Duration[1]*curTotalLv
                            let addMs = buff.Duration[1];
                            let add = `(每级<color=${ct.green}>+${addMs}</>秒)`
                            buffStr+=`，持续时间<color=${ct.green}>${ms>=60?(ms/60>>0)+'分'+ms%60:ms}</>秒${addMs>0?add:''}`
                        }
                        const rate=buff.Rate[0]*100 + buff.Rate[1]*100*curTotalLv
                        if(rate<100){
                            buffStr += `，触发概率<color=${ct.green}>${rate}%</>（每级提升<color=${ct.green}>${buff.Rate[1]*100}%</>）`
                        }
                        allBuffStr += buffStr
                    }
                })
            }
            let info = skill.Info
            if(skill.SkillType==SkillType.BaoBao){
                info = `${skill.Name} ${BaoBaoInfoStr}`
            }
            let scrollView = node.children[4]
            let content = scrollView.children[0].children[0];
            let rich = content.children[0].getComponent(RichText);
            rich.string = `${info}${numStr}${allBuffStr}`
            const height = rich.node.getComponent(UITransform).height;
            content.getComponent(UITransform).height = height;
            let scrollViewCom = scrollView.getComponent(ScrollView)
            scrollViewCom.enabled = height>180;
            let resetBtn = node.children[8];
            let btn = node.children[5];
            let stateStr = node.children[6].getComponent(Label);
            resetBtn.off(Node.EventType.TOUCH_END);
            const skillMode = this.tab.selectedIndex
            let btn_y=-113
            let state_y=-160
            if(skillMode==0){
                let hasLearn:boolean=GD.role.skills.has(skill.Id);
                if(hasLearn){
                    resetBtn.on(NodeEventType.TOUCH_END,()=>{
                        this.showReset1(skill)
                    },this)
                }
                btn_y=-153    
                state_y=-200            
            }
            resetBtn.active=skillMode==0;
            stateStr.node.y=state_y;
            btn.y=btn_y;
            btn.off(Node.EventType.TOUCH_END);
            let btnStr = btn.children[0].getComponent(Label);
            if(skill.Lv<20){
                let cb = ()=>{this.showSkillInfo(skill);}
                if(skill.LearnItemId>0){
                    let hasLearn:boolean=GD.role.skills.has(skill.Id);
                    let color:ct = ct.red;
                    let infoStr = ''
                    if(hasLearn){
                        btnStr.string = '升级'
                        let base = GD.ItemBaseDatas.get(skill.LearnItemId)
                        let n = skill.Lv+1
                        if(skill.Lv>=10) n = 10
                        let neednum = Math.max(base.DropLv, 25)*n;
                        let hasNum = 0;
                        let item = GD.role.BagItems.find(item=>{return item.Id==4});
                        if(item){
                            hasNum = item.Num;
                        }
                        infoStr=`技能书页：${hasNum}/${neednum}`;
                        if(hasNum>=neednum){
                            color=ct.green;
                        }
                        // cb= ()=>{this.learnBtnHandler(skill);}
                    }else{
                        btnStr.string = '学习'
                        if(GD.role.canLearnSkill(skill)){
                            infoStr='可学习'
                            color=ct.green; 
                        }else{
                            infoStr='学习条件不足'
                        }
                    }
                    stateStr.string=infoStr
                    stateStr.color.fromHEX(color)
                }else{
                    btnStr.string = '查看'
                    stateStr.string=skill.canUse?'可用':'使用条件不足'
                    stateStr.color.fromHEX(skill.canUse?ct.green:ct.red)
                }
                btn.on(Node.EventType.TOUCH_END,cb)
            }else{
                stateStr.string='已满级'
                stateStr.color.fromHEX(ct.gray)
                btnStr.string = '已满级'
            }
            node.children[7].active = !skill.canUse;
        }
        // this.skillsFrame.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
        //     this.skillsFrame.active=false
        //     GameManager.I.playOpenSound();
        // },this);
        this.slots.children.forEach((node,index)=>{
            node.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{
                // this.selectedSlotIndex=index
                let nonSkill=new Skill()
                nonSkill.Id=0;//插入'取消图标'
                nonSkill.canUse=true;
                let sp = this.slots.children[index].children[0].getComponent(Sprite)
                UIMgr.I.PopView.showSkillBox({nonSkill:nonSkill,mode:this.skillModeTab.selectedIndex,index:index,sp:sp})
                // this.showSetSkillList(index);
                // this.skillsFrame.active=true
            },this);
        })
        // this.setSkillList.selectedHandler = (node:Node,index:number)=>{
        //     const skill:Skill = this.setSkillList.array[index];
        //     let path = `game/skill_icon/${skill.Id}`;
        //     Tools.loadSpriteFrame(path).then((sp:SpriteFrame)=>{
        //         let ids:Array<number>
        //         const mode = this.skillModeTab.selectedIndex
        //         if(mode==0){
        //             ids = GD.role.data.SkillSlots0
        //         }else if(mode==1){
        //             ids = GD.role.data.SkillSlots1
        //         }else{
        //             ids = GD.role.data.SkillSlots2
        //         }
        //         ids[this.selectedSlotIndex]=skill.Id
        //         if(skill.Id==0){
        //             sp=null
        //         }
        //         this.slots.children[this.selectedSlotIndex].children[0].getComponent(Sprite).spriteFrame = sp;
        //         UIMgr.I.setSkillSlotSkin(UIMgr.I.skillBtns.children[this.selectedSlotIndex],this.selectedSlotIndex,mode,sp);
        //         GD.role.resetAtkSkills();
        //         this.hasChangeSkillSet=true;
        //         this.skillsFrame.active=false
        //         GameManager.I.playClickSound();
        //     })
        // }
        // this.setSkillList.cellRender = (node:Node,index:number)=>{
        //     const skill:Skill = this.setSkillList.array[index];
        //     Tools.loadSpriteFrame(`game/skill_icon/${skill.Id}`).then((sp:SpriteFrame)=>{
        //         node.children[0].getComponent(Sprite).spriteFrame = sp;
        //     })
        // };
        this.skillModeTab.selectedHandler=this.refreshSlots
        this.resetBtn.on(NodeEventType.TOUCH_END,this.showResetAll,this)
    }
    showReset1(skill:Skill){
        let str:string=ResetSkillInfoStr
        let totalNum=0;
        if(skill&&skill.LearnItemId>0){
            let lv = skill.Lv
            let item = GD.ItemBaseDatas.get(skill.LearnItemId);
            let itemNum=1
            if(lv>0){
                const n = Math.max(item.DropLv, 25);
                for(let i = 1; i <= lv; i++){
                    if(i>10){
                        totalNum +=  n * 10
                        itemNum += 10
                    }else{
                        totalNum +=  n * i
                        itemNum += i
                    }
                }
            }
            str+=`<color=${ct.blue}>${item.Name}x${itemNum}</><br/>`
        }
        if(totalNum>0){
            str+=`<color=${ct.blue}>技能书页x${totalNum}</><br/><br/>`
        }
        str+=ResetSkillStr
        this.selectedSkill=skill;
        UIMgr.I.PopView.show(0,str,false,ShowItemType.Msg,'重置',this.sendReset1)
    }
    showResetAll(){
        let str:string=ResetSkillInfoStr
        let totalNum=0;
        for(let idstr in GD.role.data.SkillLvs){
            let id = parseInt(idstr)
            let skill = GD.allSkills.get(id)
            if(skill&&skill.LearnItemId>0){
                let lv = GD.role.data.SkillLvs[idstr]
                let item = GD.ItemBaseDatas.get(skill.LearnItemId);
                let itemNum=1
                if(lv>0){
                    const n = Math.max(item.DropLv, 25);
					for(let i = 1; i <= lv; i++){
                        if(i>10){
                            totalNum +=  n * 10
                            itemNum += 10
                        }else{
                            totalNum +=  n * i
                            itemNum += i
                        }
                    }
                }
                str+=`<color=${ct.blue}>${item.Name}x${itemNum}</><br/>`
            }
        }
        if(totalNum>0){
            str+=`<color=${ct.blue}>技能书页x${totalNum}</><br/><br/>`
        }
        str+=ResetSkillStr
        UIMgr.I.PopView.show(0,str,false,ShowItemType.Msg,'重置',this.sendResetAll)
    }
    selectedSkill:Skill
    sendReset1=(data:any)=>{
        if(this.selectedSkill){
            let skill = this.selectedSkill;
            let req = outer_pb.SkillAct.create()
            req.Id=skill.Id
            let buff = outer_pb.SkillAct.encode(req).finish();
            WS.send(MT.Reset1Skill,buff,(d:any)=>{
                let rsp = outer_pb.SkillAct.decode(d);
                if(rsp.ErrCode==Err.ErrCode_Success){
                    GD.role.data.SkillSlots0.forEach((v,i)=>{
                        if(v==skill.Id){GD.role.data.SkillSlots0[i]=0}
                    })
                    GD.role.data.SkillSlots1.forEach((v,i)=>{
                        if(v==skill.Id){GD.role.data.SkillSlots1[i]=0}
                    })
                    GD.role.data.SkillSlots2.forEach((v,i)=>{
                        if(v==skill.Id){GD.role.data.SkillSlots2[i]=0}
                    })
        
                    GD.role.data.SkillLvs = rsp.SkillLvs;
                    skill.canUse=false
                    skill.Lv=0
                    GD.role.skills.delete(skill.Id)
                    if(rsp.Items){
                        for(let i in rsp.Items){
                            let id = parseInt(i)
                            let num = rsp.Items[i]
                            GD.role.getItem(id,num,false)
                        }
                    }
                    // if(rsp.Num>0){
                    //     GD.role.getItem(4,rsp.Num,false)
                    // }
                    // if(rsp.GetIds){
                    //     rsp.GetIds.forEach(id=>{
                    //         GD.role.getItem(id,1,false)
                    //     })
                    // }
                    UIMgr.I.resetAllSkillSlotSkin();
                    this.skillModeTab.select(0);
                    UIMgr.I.tip('重置成功',ct.green)
                    this.skillList.refresh();
                }else{
                    UIMgr.I.tip('重置失败')
                }
            })
        }
    }
    sendResetAll=(data:any)=>{
        if(Object.keys(GD.role.data.SkillLvs).length > 0){
            WS.send(MT.ResetAllSkill,GD.EmptyRequestBuff,(d:any)=>{
                let rsp = outer_pb.SkillAct.decode(d);
                if(rsp.ErrCode==Err.ErrCode_Success){
                    GD.role.data.SkillSlots0=rsp.Slot0
                    GD.role.data.SkillSlots1=rsp.Slot1
                    GD.role.data.SkillSlots2=rsp.Slot2
        
                    GD.role.data.SkillLvs = rsp.SkillLvs;
                    GD.role.skills.forEach(skill=>{
                        if(skill.LearnItemId>0){
                            skill.canUse=false
                            skill.Lv=0
                            GD.role.skills.delete(skill.Id)
                        }
                    })
                    if(rsp.Items){
                        for(let i in rsp.Items){
                            let id = parseInt(i)
                            let num = rsp.Items[i]
                            GD.role.getItem(id,num,false)
                        }
                    }
                    // if(rsp.Num>0){
                    //     GD.role.getItem(4,rsp.Num,false)
                    // }
                    // if(rsp.GetIds){
                    //     rsp.GetIds.forEach(id=>{
                    //         GD.role.getItem(id,1,false)
                    //     })
                    // }
                    UIMgr.I.resetAllSkillSlotSkin();
                    this.skillModeTab.select(0);
                    UIMgr.I.tip('重置成功',ct.green)
                    this.skillList.refresh();
                }else{
                    UIMgr.I.tip('重置失败')
                }
            })
        }else{
            UIMgr.I.tip('您还没有学习任何技能')
        }
    }
    private refreshSlots=(node:Node,selectedIndex:number)=>{
        GD.playClickSound();
        this.slots.children.forEach((node,index)=>{
            UIMgr.I.setSkillSlotSkin(node,index,selectedIndex,null,false)
        })
    }
    showSkillInfo(skill:Skill){
        if(skill.Lv>=20){
            UIMgr.I.showProsMsg('已满级')
        }else{
            let btnStr = ''
            if(skill.LearnItemId>0){
                let hasLearn:boolean=GD.role.skills.has(skill.Id);
                btnStr=hasLearn?'升级':'学习'
            }
            UIMgr.I.PopView.show(0,skill,false,ShowItemType.Skill,btnStr,this.learnBtnHandler)
        }
    }
    learnBtnHandler=(skill:Skill)=>{
        // console.log('showSkillInfo',skill)
        let req = outer_pb.SkillAct.create();
        req.Id = skill.Id
        let buff = outer_pb.SkillAct.encode(req).finish();
        WS.send(MT.LearnSkill,buff,(d:any)=>{
            let rsp = outer_pb.SkillAct.decode(d);
            if(rsp.ErrCode==Err.ErrCode_SuccessLearnSkill){
                GD.role.data.SkillLvs[rsp.Id]=0;
                let skill = GD.allSkills.get(rsp.Id)
                if(skill){
                    skill.Lv = 0
                    GD.role.skills.set(skill.Id,skill)
                    skill.canUse=true;
                }
                GD.role.reduceItem(skill.LearnItemId,1)
                UIMgr.I.resetAllSkillSlotSkin();
                UIMgr.I.tip('学习成功',ct.green)
                this.tab.select(0)
            }else if(rsp.ErrCode==Err.ErrCode_SuccessUpSkillLv){
                GD.role.skills.get(rsp.Id).Lv++;
                GD.role.data.SkillLvs[rsp.Id]++;
                if(rsp.Items){
                    for(let i in rsp.Items){
                        let id = parseInt(i)
                        let num = rsp.Items[i]
                        GD.role.reduceItem(id,num)
                    }
                }
                UIMgr.I.tip('升级成功',ct.green)
                this.tab.select(0)
            }else{
                UIMgr.I.tip('操作失败，条件不满足')
            }
        })
    }
    // private showSetSkillList(index:number){
    //     let nonSkill=new Skill()
    //     nonSkill.Id=0;//插入'取消图标'
    //     nonSkill.canUse=true;
    //     let sp = this.slots.children[this.selectedSlotIndex].children[0].getComponent(Sprite)
    //     UIMgr.I.PopView.showSkillBox({nonSkill:nonSkill,mode:this.skillModeTab.selectedIndex,index:this.selectedSlotIndex,sp:sp})

    //     // let arr = [nonSkill];
    //     // let mode = this.skillModeTab.selectedIndex;
    //     // let slots:Array<number>=GD.role.skillSlots.get(mode);
    //     // if(tabIndex==0){
    //     //     slots=GD.role.data.SkillSlots0
    //     // }else if(tabIndex==1){
    //     //     slots=GD.role.data.SkillSlots1
    //     // }else if(tabIndex==2){
    //     //     slots=GD.role.data.SkillSlots2
    //     // }
    //     // GD.role.skills.forEach(skill=>{
    //     //     //不显示已设置的技能 和 不可用的技能
    //     //     if(skill.Id>4){
    //     //         if(slots.indexOf(skill.Id)==-1 && skill.canUse){
    //     //             arr.push(skill)
    //     //         }
    //     //     }
    //     // })
    //     // this.setSkillList.array = arr;
    //     // GameManager.I.playOpenSound();
    // }
    protected onEnable(): void {
        this.skillList.array=[];
        this.tab.select(0);
        // this.skillsFrame.active=false;
        // this.hasChangeSkillSet=false;
        this.skillModeTab.select(GD.role.data.SkillMode)
    }
    protected onDisable(): void {
        this.isShow=false;
        this.skillList.array=[];
        // if(this.hasChangeSkillSet){
        //     let req = outer_pb.SkillAct.create();
        //     req.Slot0=GD.role.data.SkillSlots0;
        //     req.Slot1=GD.role.data.SkillSlots1;
        //     req.Slot2=GD.role.data.SkillSlots2;
        //     let buff = outer_pb.SkillAct.encode(req).finish();
        //     WS.send(MT.SaveSkillSlots,buff);
        // }
    }
}


