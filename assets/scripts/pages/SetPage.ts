import { _decorator,  EditBox,  Label, Node, Slider, Toggle } from 'cc';
import { BasePage } from './BasePage';
import GD from '../base/GameData';
import { Tab } from '../UiComps/Tab';
import WS from '../base/net';
import { Err, MT } from '../base/MT';
import GameManager from '../managers/GameManager';
import { UIMgr } from '../managers/UIMgr';
import { ct } from '../base/types';
const { ccclass, property } = _decorator;

const accountPassRegex = /^\d{6}$/;
@ccclass('SetPage')
export class SetPage extends BasePage {
    @property(Node)
    accountBtn:Node;
    @property(Node)
    toggles:Node;
    @property(Tab)
    autoTgTab:Tab;
    @property(Toggle)
    autoAgree:Toggle
    @property(Slider)
    soundSlider:Slider;
    @property(Slider)
    hpSlider:Slider;
    @property(Label)
    hpPer:Label
    @property(EditBox)
    pass1:EditBox
    @property(EditBox)
    pass2:EditBox
    @property(Node)
    setBtn:Node
    @property(Tab)
    tab:Tab
    @property(Label)
    info:Label
    onLoad() {
        super.onLoad();
        this.soundSlider.node.on('slide',(slider:Slider)=>{
            GameManager.I.setSoundValue((slider.progress))
        })
        this.hpSlider.node.on('slide',(slider:Slider)=>{
            this.refreshHpPer((slider.progress*100>>0))
        })
        this.accountBtn.on(Node.EventType.TOUCH_END,this.copyUid,this);
        this.tab.selectedHandler=(node:Node,index:number)=>{
            let str=''
            let info=''
            let e1=''
            let e2=''
            if(index==0){
                if(GD.role.data.HasLockPass){
                    str='修改密码'
                    info='需要输入旧密码、新密码'
                    e1='旧密码'
                    e2='新密码'
                }else{
                    str='设置密码'
                    info='需要输入密码，两次输入需一致'
                    e1='密码'
                    e2='重复输入密码'
                }
            }else{
                str='清除密码'
                info='需要输入旧密码'
                e1='旧密码'
                e2='无需输入'
            }
            this.setBtn.children[0].getComponent(Label).string=str
            this.pass1.placeholder=e1
            this.pass2.placeholder=e2
            this.info.string=info;
        }
        this.setBtn.on(Node.EventType.TOUCH_END,()=>{
            if(this.tab.selectedIndex==0){
                this.setPass()  
            }else{
                this.clearPass()
            }
        },this);
    }
    copyUid(){
        UIMgr.I.PopView.showAccountBox()
        // this.copyToClipboard_web().then(() => {
        //     UIMgr.I.tip('复制成功',ct.green);
        // }).catch(err => {
        //     UIMgr.I.tip('复制失败'+err);
        //     UIMgr.I.PopView.showHelpBox(GD.sdkUserInfo.uid)
        // });
    }
    // copyToClipboard_web() {
    //     let text = GD.sdkUserInfo.uid;
    //     if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    //         return navigator.clipboard.writeText(text);
    //     }
    //     // 回退：临时 textarea + document.execCommand
    //     return new Promise((resolve, reject) => {
    //         try {
    //             const textarea = document.createElement('textarea');
    //             textarea.value = text;
    //             // 防止页面跳动
    //             textarea.style.position = 'fixed';
    //             textarea.style.left = '-9999px';
    //             document.body.appendChild(textarea);
    //             textarea.select();
    //             const ok = document.execCommand('copy');
    //             document.body.removeChild(textarea);
    //             if (ok) resolve(1);
    //             else reject(new Error('execCommand 复制失败'));
    //         } catch (e) {
    //             reject(e);
    //         }
    //     });
    // }
    setPass=()=>{
        let pass_1 = this.pass1.string
        let pass_2 = this.pass2.string
        if(accountPassRegex.test(pass_1)&&accountPassRegex.test(pass_2)){
            if(GD.role.data.HasLockPass==false){
                if(pass_1!=pass_2){
                    UIMgr.I.tip('两次密码输入不一致')
                    return
                }
            }
            let req = outer_pb.CommonAct.create()
            req.Pass=pass_1
            req.NewPass=pass_2
            let buff = outer_pb.CommonAct.encode(req).finish()
            WS.send(MT.SetLockPass,buff,(d:any)=>{
                let rsp = outer_pb.CommonAct.decode(d);
                if(rsp.ErrCode==Err.ErrCode_Success){
                    GD.role.data.HasLockPass=true;
                    UIMgr.I.tip('密码设置成功',ct.green)
                }else{
                    UIMgr.I.tip('密码设置失败')
                }
            })
        }else{
            UIMgr.I.tip('密码必须为6位数字')
        }
    }
    clearPass=()=>{
        let pass_1 = this.pass1.string
        if(accountPassRegex.test(pass_1)){
            if(GD.role.data.HasLockPass==false){
                UIMgr.I.tip('无密码，不需要清除')
                    return
            }
            let req = outer_pb.CommonAct.create()
            req.Pass=pass_1
            let buff = outer_pb.CommonAct.encode(req).finish()
            WS.send(MT.ClearLockPass,buff,(d:any)=>{
                let rsp = outer_pb.CommonAct.decode(d);
                if(rsp.ErrCode==Err.ErrCode_Success){
                    GD.role.data.HasLockPass=false;
                    UIMgr.I.tip('密码清除成功',ct.green)
                }else{
                    UIMgr.I.tip('密码清除失败')
                }
            })
        }else{
            UIMgr.I.tip('密码必须为6位数字')
        }
    }
    refreshHpPer(num:number){
        this.hpPer.string = `自动喝血瓶比例：${num}%`;
    }
    onHide(): void {
        let sets = GD.role.BagSet.Sets
        sets[0] = this.autoAgree.isChecked ? 1:0
        sets[1] = this.soundSlider.progress*100>>0;
        sets[2]=this.hpSlider.progress*100>>0;
        let i=this.autoTgTab.selectedIndex;
        sets[3]=i
        this.toggles.children.forEach((node:Node,index:number)=>{
            sets[index+4]=node.getComponent(Toggle).isChecked?1:0;
        })
        GameManager.I.set(sets);
        WS.send(MT.SaveBagSet,outer_pb.BagSet.encode(GD.role.BagSet).finish())
    }
    initData(data: any): void {
        let sets = GD.role.BagSet.Sets;
        if(sets[0]==null){
            sets[0]=1
        }
        this.autoAgree.isChecked = sets[0]==1;//自动同意组队邀请
        if(sets[1]==null){
            sets[1]=100
        }
        this.soundSlider.progress=sets[1]/100; //音量
        if(sets[2]==null){
            sets[2]=60
        }
        this.hpSlider.progress=sets[2]/100; //自动喝血比例
        this.refreshHpPer(sets[2]);
        if(sets[3]==null){
            sets[3]=1
        }
        this.autoTgTab.select(sets[3]);//自动待机

        this.toggles.children.forEach((node:Node,index:number)=>{
            const i = index+4
            if(sets[i]==null){
                sets[i]=1
            }
            node.getComponent(Toggle).isChecked=sets[i]==1;
        })
        this.tab.select(0)
    }
}