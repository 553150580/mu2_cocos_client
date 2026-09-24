import { _decorator, Component, Node, Label, Asset, sys, game, ProgressBar, native, director } from 'cc';
const { ccclass, property } = _decorator;

import HotUpdate from "./HotUpdate";
import GD from '../base/GameData';
import WS, { Http } from '../base/net';
import Loading from '../Loading';

@ccclass('HotUpdateView')
export default class HotUpdateView extends Component {
    @property({ type: Asset })
    manifestUrl: Asset
    @property({ type: ProgressBar })
    bar: ProgressBar
    @property(Node)
    btnStart: Node
    @property(Node)
    btnReStart: Node
    @property(Node)
    btnUpdate: Node
    @property(Node)
    btnClear: Node
    @property(Node)
    verInfo: Node
    @property(Label)
    msgInfo: Label;
    @property(Label)
    per: Label;
    @property(Label)
    size: Label;
    @property(Label)
    num: Label;

    private updateCtr: HotUpdate = null
    private curDownloadPer: number = 0
    private isOk=false;

    onLoad() {
        this.bar.progress=0;
        this.per.string=''
        this.num.string=''
        this.size.string=''
        this.btnUpdate.active=this.btnUpdate.active=this.btnStart.active=this.btnReStart.active=false;
        this.btnClear.active=sys.isNative;
        // 热更仅能用于 native build
        if (!sys.isNative) {
            return
        }
        // LogUtil.superLog("HotUpdateView init")
        this.btnUpdate.on(Node.EventType.TOUCH_END,this.onClickUpdate,this);
        this.btnClear.on(Node.EventType.TOUCH_END,this.onClickClear,this);
        this.btnStart.on(Node.EventType.TOUCH_END,()=>{
            //配置完启动参数后，跳转到登陆界面 
            GD.initGameSet().then(v=>{
                Loading.loadScene("Login");
            })
        },this);
        this.btnReStart.on(Node.EventType.TOUCH_END,()=>{
            this.restartGame()
        },this);
        // this.updateCtr = new HotUpdate(this)
        this.initVersion()
    }
    start() {
        // this.setVersion(GD.showVersion)
        this.requestVersionInfo()
    }
    onClickUpdate() {
        this.btnUpdate.active=false
        this.msgInfo.string = ""
        //请求版本热更文件.txt 
        this.requestVersionInfo()
    }
    onClickClear() {
        this.updateCtr&&this.updateCtr.onDestroy();
        native.fileUtils.purgeCachedEntries()
        let ok = native.fileUtils.removeDirectory(GD.getHotUpdateDir())
        if(ok){
            this.initVersion()

            this.num.string=''
            this.size.string=''
            this.per.string=''
            this.bar.progress=0
            this.curDownloadPer=0
            this.msgInfo.string = "清空缓存成功，您可重新更新" 
            // this.setVersion(GD.showVersion)
            this.btnUpdate.active=true
            this.btnStart.active=this.btnReStart.active=false;
        }else{
            this.msgInfo.string = "清空缓存失败" 
        }
    }
    initVersion() {
        let storagePath = GD.getHotUpdateDir()
        let url = this.manifestUrl.nativeUrl;
        // LogUtil.superLog("HotUpdate native端资源储存路径: " + storagePath + ", nativeUrl:" + this.manifestUrl.nativeUrl);
        // if (loader.md5Pipe) {
        //     url = loader.md5Pipe.transformURL(url);
        // }
        let am = new native.AssetsManager(url, storagePath)
        let version = am.getLocalManifest().getVersion()
        let ver = this.parseVersion(version)
        GD.mainVersion = ver.mainVersion
        GD.subVersion = Number(ver.subVersion)
        GD.showVersion = GD.mainVersion + "." + GD.subVersion
        // LogUtil.superLog("hotupdate initVersion:" + GD.showVersion)
        this.verInfo.getComponent(Label).string = `v${GD.showVersion}`
    }
    //请求版本信息
    public requestVersionInfo() {
        this.msgInfo.string = '开始检查更新...'
        let url = `${WS.update_url}/${GD.mainVersion}/version.txt` //版本文件
        // LogUtil.superLog("requestVersionInfo UpdateInfo url:", url)
        Http.request(url, null, null, (res: any, success: boolean, status: number) => {
            if (success) {
                let jsonData: any = null
                try {
                    jsonData = JSON.parse(res)
                } catch {
                    console.error("can't parse version file")
                }
                if (jsonData) { //拉到文件
                    // LogUtil.dump(jsonData, "requestVersionInfo UpdateInfo")
                    let mainVersion = jsonData.MainVersion
                    let subVersion = jsonData.SubVersion
                    if (mainVersion == GD.mainVersion && subVersion > GD.subVersion) {   //存在热更
                        let temData: any = {
                            MainVersion: mainVersion,
                            SubVersion: subVersion,
                            Url: jsonData.Url,
                        }
                        this.handleHotUpdate(temData)
                        //监听事件
                        director.once("CHECK_HOTUPDATE_RESULT", (isNew: boolean) => {
                            if (!isNew) {   //没有新版本
                                this.btnStart.active=true;
                                // this.btnClear.active = this.btnUpdate.active=false;
                            }
                        })
                    } else {    //无需热更,最新版本
                        // LogUtil.superLog("无需热更,最新版本")
                        this.msgInfo.string = "无需更新，已是最新版本"
                        this.btnStart.active=true;
                        this.scheduleOnce(()=>{
                            this.btnClear.active=false;
                        },1.0)
                    }
                } else {
                    console.error("requestVersionInfo UpdateInfo jsonData is null:")
                    this.msgInfo.string = "requestVersionInfo UpdateInfo jsonData is null:"
                }
            } else {
                console.error("requestVersionInfoUpdateInfo error:", status)
                this.msgInfo.string = "请求版本信息失败:" + status
            }
        })
    }
    private parseVersion(version: string): any {
        let ver: any = {}
        let versions = version.split(".")
        let mainVersion = ""
        let subVersion = ""
        for (let i = 0; i < versions.length; i++) {
            if (i == versions.length - 1) {
                subVersion = versions[i]
            } else {
                mainVersion += versions[i]
                if (i != versions.length - 2) {
                    mainVersion += "."
                }
            }
        }
        ver.mainVersion = mainVersion
        ver.subVersion = subVersion
        return ver
    }
    //进行热更新
    public handleHotUpdate=(data?: any)=> {
        // console.log("handleHotUpdate:" + data)
        this.isOk=false;
        this.updateCtr = new HotUpdate(this)
        // // 覆盖掉本地的url，如有
        if (data.Url != null && data.Url != "") {   //更新热更的地址
            let newUrl = `${data.Url}${data.MainVersion}/${data.SubVersion}/`
            this.updateCtr.modifyUrlForManifestFile(newUrl, this.manifestUrl.nativeUrl)
        }
        this.updateCtr.setRemoteVersion(data.MainVersion, data.SubVersion)
        this.updateCtr.createAssetsManager(this.manifestUrl)
        this.updateCtr.initAssetsManager(10)
        this.updateCtr.setCheckResultCallback(this.checkResultCallback, this)
        this.updateCtr.setUpdateCallback(this.progressCallback, this.finishCallback, this)

        //检查更新
        this.updateCtr.checkHotUpdate()
    }
    //检查结果回调
    private checkResultCallback=(error, checkResult)=> {
        if (error) {
            // LogUtil.superLog("error info :" + error.info)
            this.msgInfo.string = "版本校验失败" + error.code
            this.handleError(error.info)
        } else {
            // LogUtil.dump(checkResult, "checkResult")
            if (checkResult.isNewVersion) {
                this.msgInfo.string = "开始更新...\n(卡住不动时，等待1分钟左右退出重启app即可)"
                this.updateCtr.hotUpdate();
            } else {    //最新版本
                this.msgInfo.string = "目前是最新版本"
                this.btnClear.active=false;
            }
            director.emit("CHECK_HOTUPDATE_RESULT", checkResult.isNewVersion)
        }
    }
    //更新完成回调
    private finishCallback=(error)=> {
        if (error) {
            // LogUtil.superLog("error info :" + error.info)
            this.msgInfo.string = "更新失败！" + error.code
            if (error.canRetry == true) {
                //弹窗允许继续尝试更新
                this.showRetryPopu()
            } else {    //其他错误
                this.handleError(error.info)
            }
        } else {    //重新启动游戏
            //进度为满状态
            this.setOk();
        }
    }
    setOk=()=>{
        this.isOk=true;//设置为已完成，防止多线程下载时进度被覆盖导致显示条不更新卡在半中间
        this.curDownloadPer =1
        this.per.string='100%'
        this.num.string=''
        this.size.string=''
        this.bar.progress = 1
        this.msgInfo.string = "更新完成！"
        this.btnReStart.active=true;
        this.initVersion();
        // this.setVersion(GD.showVersion)
        // this.restartGame()
    }
    //重启游戏
    private restartGame() {
        this.scheduleOnce(() => { //延迟0.5秒重新启动游戏
            game.restart();
        }, 0.5)
    }
    //退出游戏
    private exitGame() {
        game.end()
    }
    //弹窗允许继续尝试更新
    private showRetryPopu() {
    }
    //处理错误
    private handleError(error: any) {
        if (error == null) {
            return
        }
        // LogUtil.superLog("更新错误, code:" + error.code + ", info:" + error.info)
    }
    //进度回调
    private progressCallback=(error, progressData)=> {
        // LogUtil.superLog(progressData.downloadedFiles + ' / ' + progressData.totalFiles);
        // LogUtil.superLog(progressData.downloadedBytes + ' / ' + progressData.totalBytes);
        // LogUtil.superLog("progressCallback", (typeof progressData.percent === 'number'), !Number.isNaN(progressData.percent), progressData.percent >= 0)
        // LogUtil.dump(progressData, "progressData")
        if(this.isOk){
            this.setOk()
        // }else if(progressData.percent != null && typeof progressData.percent === 'number' && progressData.percent >= 0) {
        }else {
            this.curDownloadPer = progressData.percent

            this.bar.progress = progressData.percent
            this.per.string= `${progressData.percent*100>>0}%` 

            this.num.string=`文件数量：${progressData.downloadedFiles} / ${progressData.totalFiles}`
            let downloadedBytes = progressData.downloadedBytes
            let after1=' B'
            if(downloadedBytes>1024*1024){
                downloadedBytes = ((downloadedBytes/(1024*1024))>>0)
                after1=' MB'
            }else if(downloadedBytes>1024){
                downloadedBytes = ((downloadedBytes/1024)>>0)
                after1=' KB'
            }
            let totalBytes = progressData.totalBytes
            let after2=' B'
            if(totalBytes>1024*1024){
                totalBytes = ((totalBytes/(1024*1024))>>0)
                after2=' MB'
            }else if(totalBytes>1024){
                totalBytes = ((totalBytes/1024)>>0)
                after2=' KB'
            }
            this.size.string=`文件大小：${downloadedBytes}${after1} / ${totalBytes}${after2}`
            // LogUtil.dump(progressData, "progressData")
        }
    }
    // update(dt) {
    //     let nextPer = this.bar.progress + dt
    //     if (nextPer >= 1) {
    //         this.bar.progress = 1
    //         this.per.string='100%'
    //     } else if (nextPer < this.curDownloadPer) {
    //         this.bar.progress = nextPer
    //         this.per.string= `${nextPer*100>>0}%`
    //     }
    // }
    onDestroy() {
        if (this.updateCtr != null) {
            this.updateCtr.onDestroy()
        }
    }
}
