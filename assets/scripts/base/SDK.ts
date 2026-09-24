import GD from "./GameData";
import Tools from "./tools";
import { PayData, SdkRoleInfo, SdkUserInfo} from "./types";

export namespace SDK {
    // 1. 初始化
    export function init() {
        if (typeof window === 'undefined') {  // 非 H5 直接返回
            return;
        }
        // 假设渠道 SDK 暴露全局对象 DFIssuerSDK
        const sdk = (window as any).DFIssuerSDK;
        if (!sdk) {
            console.error('[DFIssuerSDK] 未加载');
            return;
        }
    }
    // 2. 登录
    export function login(): Promise<{data:any}> {
        return new Promise((resolve, reject) => {
            //========测试代码===============
            // let info:any=new SdkUserInfo()
            // // info.uid= 'SY21_500261514'//东风5c
            // // info.uid= 'SY21_500277164';//风在起时
            // // info.uid= 'SY21_500250762';//我的
            // // info.uid= 'SY21_500250672';//我的
            // // info.uid= 'SY21_500250552';//古怪
            // // info.uid='SY21_500253049'//四喜丸子
            // // info.uid='SY21_500250496'//'妖姬花'
            // // info.uid='SY21_500250481'//'老汤'
            // info.uid= 'SY21_500250492';//紫月的 
            // // info.uid= 'SY21_500250768';//玄天的 
            // // info.uid= 'SY21_500250515';//无忧无虑的
            // info.uid= 'SY21_500250475';//静的
            // // info.uid= 'SY21_500261514';//LZ1
            // // info.uid= 'SY21_500329769';
            // // info.uid= 'SY21_500293221';//Jy的
            // // info.uid= 'SY21_500280673';//三季人
            // // info.uid= 'SY21_500251261';//世界的
            // // info.uid= 'SY21_500250487';//欢喜哥的
            // // info.uid= 'SY21_500254780';//准时熬夜的 
            // // info.uid= 'SY21_500250491' //疯狂的驴子
            // // info.uid= 'SY21_500269866';//咸鱼的
            // // info.uid= 'SY21_500251107'//兜兜1
            // // info.uid= 'SY21_500253049';//酸菜肉丝
            // // info.uid= 'SY21_500250483';//酸菜肉丝
            // // info.uid = 'SY21_500287643'; //老邓
            // info.uname='500250492'
            // info.sid='1'
            // info.ts=Date.now()/1000>>0
            // info.sign=''
            // resolve(info)

            //========正式上线代码============
            if (window.DFIssuerSDK){
                const sdk = (window as any).DFIssuerSDK; 
                sdk.getLoginInfo({callback:(res: any) => {
                    if (res.code === 0) {
                        resolve(res.data);
                    } else {
                        reject(res.msg);
                    }
                }});
            }else {
                reject('window.DFIssuerSDK不存在');
            }
            //================================
        });
    }
    // 3. 支付
    export function pay(order: PayData) {
        const sdk = (window as any).DFIssuerSDK;
        //==============
        sdk.pay(order);
        // UIMgr.I.tip("充值暂未开通，请等正式开服！")
        //==============
    }
    // 4. 事件上报
    export function uploadPlayerInfo(data: SdkRoleInfo) {
        return new Promise((resolve, reject) => {
            if (window.DFIssuerSDK){
                const sdk = (window as any).DFIssuerSDK;
                sdk.uploadPlayerInfo({
                    eventType:data.eventType,
                    serverId:data.serverId,
                    serverName:data.serverName,
                    roleId:data.roleId,
                    roleName:data.roleName,
                    roleLevel:data.roleLevel,
                    roleCreateTime:data.roleCreateTime,
                    playerId:data.playerId,
                    callback:(res: any) => {
                        if (res.code === 0) {
                            resolve(res.data);
                        } else {
                            reject(res.msg);
                        }
                    }
                });
            }else {
                reject('window.DFIssuerSDK不存在');
            }
        });
    }
    // 5. 登出
    export function logout(order: any) {
        const sdk = (window as any).DFIssuerSDK;
        sdk.logout({callback:(res:any)=>{
            console.log('logout ok')
        }});
    }
    //获取在线协议
    export function getAgreement(): Promise<{data:any}> {
        return new Promise((resolve, reject) => {
            if (window.DFIssuerSDK){
                const sdk = (window as any).DFIssuerSDK;
                sdk.getAgreement({callback:(result: any) => {
                    if (result.code === 0) {
                        if (result.data && result.data.user_agreement) {
                            // 需要处理返回的用户协议
                        }
                        if (result.data && result.data.privacy_agreement) {
                            // 需要处理返回的隐私协议
                        }
                        if (result.data && result.data.public_info) {
                            // 需要处理返回的版号信息
                        }
                        resolve(result.data);
                    }else{
                        reject(result.msg);
                    }
                }});
            }else {
                reject('window.DFIssuerSDK不存在');
            }
        });
    }
    export function doTryPay(index:number){
        //发起支付
        let obj = GD.PayMoneyNums[index]
        let data=GD.role.data
        let info = `main:${data.Id}:${data.Name}:0`
        SDK.tryPay(obj.Amount,data.Name,data.Lv+data.ZsNum*400,data.Id,info)
    }
    export function tryPay(amount:number,roleName:string,lv:number,roleId:number,extension:string){
        //发起支付
        let payData=new PayData()
        payData.amount=amount*100;//上传的单位是分
        // payData.orderId=Date.now().toString()
        payData.orderId=Tools.getBeijingTime().getTime().toString()
        payData.playerId=GD.sdkUserInfo.uname;
        payData.productId='1'
        payData.productName='点数'
        payData.roleId=roleId+''
        payData.roleLevel=lv
        payData.roleName=roleName
        payData.serverId=GD.lastServer.id;
        payData.serverName=GD.lastServer.id;
        payData.extension=extension;
        // payData.callback=cb;
        // console.log('tryPay',obj,payData)
        SDK.pay(payData)
    }
}