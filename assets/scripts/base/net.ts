import { BattleManager } from "../battle/BattleManager";
import { Login } from "../Login";
import { MsgType, UIMgr } from "../managers/UIMgr";
import GD from "./GameData";
import { MsgVerifier } from "./MsgVerifier";
import { MT } from "./MT";

export enum ConnType{
    Login,
    Gate,
}
//解决的是“设备有 BigInt，但没有 DataView.setBigUint64”的情况
//兼容部分IOS设备
export function installDataViewBigIntPolyfill() {
    const proto = DataView.prototype as any;

    if (typeof proto.setBigUint64 === "function") {
      return;
    }

    if (typeof BigInt !== "function") {
      return;
    }

    const SHIFT32 = BigInt(32);
    const MASK32 = BigInt("0xffffffff");
    const MASK64 = BigInt("0xffffffffffffffff");

    proto.setBigUint64 = function (
      byteOffset: number,
      value: any,
      littleEndian: boolean = false
    ) {
      const v = BigInt(value) & MASK64;
      const hi = Number((v >> SHIFT32) & MASK32);
      const lo = Number(v & MASK32);

      if (littleEndian) {
        this.setUint32(byteOffset, lo, true);
        this.setUint32(byteOffset + 4, hi, true);
      } else {
        this.setUint32(byteOffset, hi, false);
        this.setUint32(byteOffset + 4, lo, false);
      }
    };
  }
export default class WS{
    static c:WebSocket;
    static GameHomeUrl:string = 'wss://mu.nbmu.online';//远程游戏服（固定地址了，后期应该改为动态从登录服配置中获取）
    static login_url:string = 'wss://mu.nbmu.online:448'; //远程服务器地址
    // static GameHomeUrl:string = 'ws://127.0.0.1';//本地测试游戏服地址
    // static login_url:string = 'ws://127.0.0.1:448'; //本地测试服务器


    static update_url:string = 'http://mu2.nbmu.online/Hotupdate/' //app更新地址
    // static home_url:string = 'http://mu2.nbmu.online/webMu2/' //游戏首页地址
    // static home_url:string = 'https://mu.nbmu.online/nbmu2_h5/' //游戏首页地址
    static home_url:string = 'https://mu.nbmu.online/nbmu2_release/' //游戏首页地址

    static Type:ConnType = ConnType.Login;
    static curScene:string='';

    static cbs:Map<MT,(result:any)=>void> = new Map();//wsCallBacks

    static onClose(){
        if(WS.curScene=='Main'&&UIMgr&&UIMgr.I){
            UIMgr.I.unschedule(UIMgr.I.heartBeat)
            WS.Type=ConnType.Login; 
            BattleManager.I.loadInfoLabel.node.parent.active = false;
            if(GD.isSwitchRole==false){
                UIMgr.I.reloginRoleName=GD.role.data.Name;
                UIMgr.I.reloginSid=GD.lastServer.id;
                UIMgr.I.showBoxMsgPage(MsgType.OffLine,'<color=#FF4700>您掉线了，请重新连接</color><br/><color=#C3C3C3>(5分钟后自动重新连接)</color>')
                //启动自动重连
                UIMgr.I.startAutoReConnect()
            }else{
                // UIMgr.I.reConnect();
                UIMgr.I.showBoxMsgPage(MsgType.OffLine,'<color=#00ff00>原角色已成功托管，点击登录到新角色</color><br/>','登录')
            }
        }else if(Login&&Login.I){
            Login.I.showLost()
        }
    }
    //主动关闭
    static DoClose(){
        return new Promise((resolve,reject)=>{
            if(WS.Type==ConnType.Login){
                //重置onclose，不执行WS.onClose()
                WS.c.onclose = evt=> {
                    resolve(evt);
                };
                WS.c.onerror = err=> {
                    resolve(err);
                };
            }
            this.c.close();
        })
    }
    // static connectWS(url: string, type: ConnType) {
    //     return new Promise<WebSocket>((resolve, reject) => {
    //         WS.c = new WebSocket(url);
    //         WS.c.binaryType = "arraybuffer";

    //         let settled = false;

    //         const doneResolve = (evt) => {
    //             if (settled) return;
    //             settled = true;
    //             WS.Type = type;
    //             resolve(evt);
    //         };

    //         const doneReject = (err: any) => {
    //             if (settled) return;
    //             settled = true;
    //             reject(err);
    //         };

    //         WS.c.onopen = (evt) => doneResolve(evt);
    //         WS.c.onerror = (err) => doneReject(err);
    //         WS.c.onclose = (evt) => {
    //             if (!settled) doneReject(evt);
    //         };

    //         WS.c.onmessage = async (evt) => {
    //             const buffer =
    //             evt.data instanceof ArrayBuffer
    //                 ? evt.data
    //                 : await evt.data.arrayBuffer();

    //             const view = new DataView(buffer);
    //             let offset = 0;

    //             while (offset < buffer.byteLength) {
    //                 const msg_len = view.getUint16(offset, true);
    //                 const msg_id = view.getUint16(offset + 2, true);
    //                 const msg_buf = new Uint8Array(buffer, offset + 4, msg_len - 2);
    //                 offset += msg_len + 2;

    //                 const cb = WS.cbs.get(msg_id);
    //                 cb && cb(msg_buf);
    //             }
    //         };
    //     });
    // }
    // static totalLen:number=0
    /**connectWS */
    static connectWS(url:string,type:ConnType){
        return new Promise((resolve,reject)=>{
            WS.c = new WebSocket(url);
            
            WS.c.onclose = evt=> {
                WS.onClose()
                reject(evt)
            };
            WS.c.onerror = err=> {
                WS.onClose()
                reject(err)
            };
            WS.c.onopen = evt=> {
                WS.Type=type;
                resolve(evt);
            };
            WS.c.onmessage = evt=>{
                const buffer = evt.data;  
                if (buffer instanceof ArrayBuffer) {  
                    //安卓+win环境
                    const view = new DataView(buffer);  
                    let offset = 0;  
                    // let ids=[];
                    while (offset < buffer.byteLength) {  
                        const msg_len = view.getUint16(offset, true); // 2byte  
                        const msg_id = view.getUint16(offset + 2, true); // 2byte  
                        const msg_buf = new Uint8Array(buffer, offset + 4, msg_len - 2);  
                        offset += msg_len + 2;  

                        let cb = WS.cbs.get(msg_id)
                        cb&&cb(msg_buf);
                        // ids.push(msg_id)
                    }
                    // console.log('get_a',ids)
                }else{
                    //浏览器环境： 使用Blob的arrayBuffer方法  
                    buffer.arrayBuffer().then((buffer:any) => {  
                        const view = new DataView(buffer);  
                        let offset = 0;  
                        // console.log('len=',buffer.byteLength)
                        // let num=0;
                        while (offset < buffer.byteLength) {  
                            const msg_len = view.getUint16(offset, true); // 2byte  
                            const msg_id = view.getUint16(offset + 2, true); // 2byte  
                            const msg_buf = new Uint8Array(buffer, offset + 4, msg_len - 2);  
                            offset += msg_len + 2;  

                            let cb = WS.cbs.get(msg_id)
                            cb&&cb(msg_buf);
                            // num++
                        }
                        // this.totalLen+=buffer.byteLength
                        // console.log('get num=',num,'len=',buffer.byteLength)
                    })
                }
            }
        })
    }
    static send(id:number,data:Uint8Array,cb:(res:any)=>void=null){
        if(this.c.readyState === WebSocket.OPEN){
            // const len = data.length+2;
            // if(len>65535)return;
            // const buff = new ArrayBuffer(len);
            // const view = new DataView(buff);
            // view.setUint16(0,id,true); //true表示小端序
            // const msgData = new Uint8Array(buff);
            // msgData.set(data,2);
            let msgData = MsgVerifier.wrapMessage(data,id)
            this.c.send(msgData as any);
            if(cb){
                WS.cbs.set(id,cb);
            }
        }else{
            //会导致在关闭窗口时发送数据的死循环
            ///// WS.onClose()
        }
    }
    // static send(id:number,data:Uint8Array,cb:(res:any)=>void=null){
    //     if(this.c.readyState === WebSocket.OPEN){
    //         const len = data.length+2;
    //         if(len>65535)return;
    //         const buff = new ArrayBuffer(len);
    //         const view = new DataView(buff);
    //         view.setUint16(0,id,true); //true表示小端序
    //         const msgData = new Uint8Array(buff);
    //         msgData.set(data,2);
    //         this.c.send(msgData);
    //         if(cb){
    //             WS.cbs.set(id,cb);
    //         }
    //     }else{
    //         //会导致在关闭窗口时发送数据的死循环
    //         ///// WS.onClose()
    //     }
    // }
}
export class Http{
    /**
     * @desc 请求url连接
     * @param url url连接
     * @param data 数据，一个表
     * @param method GET POST
     * @param callback 回调函数
     */
    public static request(url: string, data: any, method?: string, callback?: Function) {
        let xhr = new XMLHttpRequest()
        if (method == undefined) {
            method = "GET"
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                // console.log("receive data from request Url：" + xhr.status + ", :" + xhr.responseText)
                if (xhr.status >= 200 && xhr.status <= 207) {
                    var response = xhr.responseText;
                    // console.log("request Url: receive data from request Url", response)
                    console.log("response:" + response)
                    // LogUtil.dump(xhr, "xhr")
                    if (response != null && response.length > 0) {
                        if (callback) {
                            callback.call(this, response, true, xhr.status)
                        }
                    } else {
                        if (callback) {
                            callback.call(this, null, false, xhr.status)
                        }
                        console.log("request Url:返回数据不存在, url:" + url);
                    }
                } else {
                    if (xhr.status == 500) {
                        console.log("request Url:服务器报错了500:" + xhr.responseText);
                    } else {
                        console.log("request Url:其他错误:" + xhr.responseText);
                    }
                    if (callback) {
                        callback.call(this, null, false, xhr.status)
                    }
                }
            }
        };
        data = data ? data : {};
        if (method == "GET") {
            let count: number = 1
            for (let item in data) {
                if (count == 1) {
                    url += "?";
                }
                count++
                url += item + "=" + data[item] + "&";
            }
            xhr.open(method, url, true);
            console.log("request Url:HTTP GET:", url);
            xhr.send();
        } else {
            xhr.open(method, url);
            // xhr.withCredentials = true;
            xhr.setRequestHeader("Content-Type", "application/json");
            let temData = JSON.stringify(data)
            console.log("request Url:HTTP POST:", url, data, method, temData);
            xhr.send(temData);
        }
    }
}