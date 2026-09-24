import { _decorator, JsonAsset, Label, Node } from 'cc';
import { List } from '../UiComps/List';
import { BasePage } from './BasePage';
import { Menu } from './MenuPage';
import { ct, HelpData } from '../base/types';
import { UIMgr } from '../managers/UIMgr';
import Tools from '../base/tools';
import GD from '../base/GameData';
import { VersionInfo, VersionInfoYk } from '../base/consts';
const { ccclass, property } = _decorator;

@ccclass('HelpPage')
export class HelpPage extends BasePage {
    @property(List)
    list:List;

    menus:Array<Menu>;
    onLoad() {
        super.onLoad();
        this.list.array=[]
        this.list.selectedHandler=(node:Node,index:number)=>{
            let menu = this.menus[index]
            menu.cb()
        }
    }
    cellRender=(node:Node,index:number)=>{
        let menu = this.menus[index]
        let label = node.children[0].getComponent(Label)
        label.string = menu.name
        label.color.fromHEX(menu.color)
    }
    versionInfo:Menu
    moreInfo:Menu
    helpMenus:Array<Menu>
    initData(data: any): void {
        let info=VersionInfo
        let qq=336741513
        let wx=''
        if(GD.role.data.IsYkMode){
            info=VersionInfoYk
            // qq=398126021
            wx=',也可通过该群加入官方微信群'
        }
        let more=`攻略、交易、担保，请加官方交流Q群<br/>群号【<color=#FF9900>${qq}</>】，进群领礼包码！${wx}`
        this.moreInfo=new Menu("更多攻略..",ct.blue,()=>{UIMgr.I.PopView.showHelpBox(more)})
        this.versionInfo=new Menu("版本设置",ct.green,()=>{UIMgr.I.PopView.showHelpBox(info)})
        if(this.helpMenus==null){
            this.helpMenus=[]
            Tools.loadJsonAsset('json/Helps',GD.commonBundle).then(res=>{
                if(res){
                    let arr = (res as JsonAsset).json as Array<HelpData>
                    arr.forEach(d=>{
                        this.helpMenus.push(new Menu(d.Name,d.Color as ct,()=>{UIMgr.I.PopView.showHelpBox(d.Msg)}),)
                    })
                    this.setMenus()
                }
            })
        }else{
            this.setMenus()
        }
    }
    setMenus=()=>{
        this.menus=[this.versionInfo]
        this.list.cellRender=this.cellRender;
        this.helpMenus.forEach(m=>{
            this.menus.push(m)
        })
        this.menus.push(this.moreInfo)
        this.list.array=this.menus
    }
}


