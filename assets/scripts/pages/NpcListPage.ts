import { _decorator, Label, Node } from 'cc';
import { List } from '../UiComps/List';
import { BasePage } from './BasePage';
import GD from '../base/GameData';
import { UIMgr } from '../managers/UIMgr';
import {ct, MapNpc } from '../base/types';
const { ccclass, property } = _decorator;

@ccclass('NpcListPage')
export class NpcListPage extends BasePage {
    @property(List)
    leftList:List;
    @property(List)
    rightList:List;
    selectedNode:Node=null;
    onLoad() {
        super.onLoad();
        this.leftList.cellRender=(node:Node,index:number)=>{
            node.children[0].active = node==this.selectedNode;
            let map:MapNpc = this.leftList.array[index]
            node.children[1].getComponent(Label).string=GD.MapList.get(map.Id).Name
        }
        this.leftList.selectedHandler=(node:Node,index:number)=>{
            let map:MapNpc = this.leftList.array[index]
            this.selectedNode&&(this.selectedNode.children[0].active = false);
            this.selectedNode=node;
            node&&(node.children[0].active = true);
            this.rightList.array = map.List;
            GD.playClickSound();
        }
        this.rightList.cellRender=(node:Node,index:number)=>{
            let npcId = this.rightList.array[index]
            let npc = GD.npc_list.get(npcId);
            let nameLabel=node.children[0].getComponent(Label);
            nameLabel.string=npc.Name
            let color=ct.blue
            if(npcId==30){
                color=ct.yellow
            }
            nameLabel.color.fromHEX(color)
            node.children[1].getComponent(Label).string=`(${npc.Info})`
        }
        this.rightList.selectedHandler=(node:Node,index:number)=>{
            let npcId = this.rightList.array[index]
            let npc = GD.npc_list.get(npcId);
            UIMgr.I.show(npc.PageType,npc,true);
            // if(GD.role.hasBaseYk(false)){
            //     let npcId = this.rightList.array[index]
            //     let npc = GD.npc_list.get(npcId);
            //     UIMgr.I.show(npc.PageType,npc,true);
            // }else{
            //     UIMgr.I.tip('需要：特权卡，才能远程访问NPC功能')
            // }
        }
    }
    initData(data: any): void {
        this.leftList.array=GD.MapNpcList
        let i = this.leftList.selectedIndex;
        this.leftList.selectedIndex=i>-1?i:0;
    }
}
