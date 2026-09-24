import { Component, native, sys } from "cc";
import GD from "../base/GameData";

export default class HotUpdate {
    private _assetsMgr: native.AssetsManager = null;
    private _storagePath: string = '';
    private _manifest = null;
    private _remoteVersion: string = ""  //远程版本号
    private _remoteMainVersion: string = ""    //主版本号
    private _remoteSubVersion: number = 0     //热更版本号

    // 检查结果回调
    private _checkResultCallback = null;
    // 下载进度回调
    private _progressCallback = null;
    // 下载完成回调
    private _finishCallback = null;

    // 检查状态 -1:未检查 0:正在检查 1:检查完毕 
    private _checkState = -1;
    // 更新状态 -1:不可更新 0:可以更新 1:正在更新 2 更新完毕
    private _updateState = -1;
    // 可以重新尝试下载
    private _canRetry = false;

    private view: Component = null

    constructor(view: Component) {
        this.view = view
    }

    setRemoteVersion(mainVersion: string, subVersion: number) {
        this._remoteMainVersion = mainVersion
        this._remoteSubVersion = subVersion
        this._remoteVersion = mainVersion + "." + subVersion
    }

    createAssetsManager(manifest) {
        // 热更仅能用于 native build
        if (!sys.isNative) {
            return
        }
        this._storagePath = GD.getHotUpdateDir()

        this._manifest = manifest;
        let url = this._manifest.nativeUrl;
        // LogUtil.superLog("HotUpdate native端资源储存路径: " + this._storagePath + ", nativeUrl:" + this._manifest.nativeUrl);
        // if (loader.md5Pipe) {
        //     url = loader.md5Pipe.transformURL(url);
        // }
        this._assetsMgr = new native.AssetsManager(url, this._storagePath)
    }

    /**
     * 初始化管理器
     * @param {*} maxTask 
     */
    initAssetsManager(maxTask) {
        maxTask = maxTask || 1;
        if (sys.os === sys.OS.ANDROID) {  //android多线程
            this._assetsMgr.setMaxConcurrentTask(maxTask);
        }
        this._assetsMgr.setVersionCompareHandle(this._versionCompareHandle)
        this._assetsMgr.setVerifyCallback(this._verifyCallback);
    }

    /**
     * 检查更新 检查是否有更新
     */
    checkHotUpdate() {
        // 正在检查
        if (this._checkState === 0) {
            return;
        }
        // 判断 本地manifest是否加载
        if (this._assetsMgr && (!this._assetsMgr.getLocalManifest() || !this._assetsMgr.getLocalManifest().isLoaded())) {
            if (this._checkResultCallback) {
                let error = { code: 0, info: "hotupdate.updateFailed" };
                let checkResult = null;
                this._checkResultCallback.call(this._checkResultCallback.target, error, checkResult);
            }
            return;
        }
        this._assetsMgr.setEventCallback(this._checkEventCallback.bind(this));
        this._assetsMgr.checkUpdate();
        this._checkState = 0;  // 正在检查
    }

    /**
     * 进行热更新
     */
    hotUpdate() {
        // LogUtil.superLog("hotupdate " + this._checkState + " " + this._updateState);
        if (this._checkState === 1 && this._updateState === 0) {
            if (this._assetsMgr) {
                this._assetsMgr.setEventCallback(this._updateEventCallback.bind(this));
                this._assetsMgr.update();
                this._updateState = 1;
            }
        }
    }

    /**
     * 重新尝试更新
     */
    retryUpdate() {
        if (this._checkState === 1 && this._updateState === 2 && this._canRetry) {
            if (this._assetsMgr) {
                this._assetsMgr.downloadFailedAssets();
                this._updateState = 1;
                this._canRetry = false;
            }
        }
    }

    getMainVersion() {
        return GD.mainVersion
    }

    getSubVersion() {
        return GD.subVersion
    }

    /**
     * 设置检查更新结果的回调
     * @param {更新结果信息} callback(error,checkResult)  
     * @param {*} target 
     */
    setCheckResultCallback(callback, target) {
        this._checkResultCallback = callback;
        this._checkResultCallback.target = target;
    }

    /**
     * 设置更新回调
     * @param {更新进度} progressCallback(error,progressData) 
     * @param {更新完成} finishCallback(error)
     * @param {*} target 
     */
    setUpdateCallback(progressCallback, finishCallback, target) {
        this._progressCallback = progressCallback;
        this._progressCallback.target = target;
        this._finishCallback = finishCallback;
        this._finishCallback.target = target;
    }


    /**
     * 校验的回调函数
     * @param {*} path 
     * @param {*} asset 
     */
    _verifyCallback(path, asset) {
        // 当 asset被压缩的时候，我们不需要md5校验,因为zip文件已经被删除
        var compressed = asset.compressed;  // 是否被压缩
        var expectedMD5 = asset.md5;        // 
        var relativePath = asset.path;
        // var size = asset.size;
        if (compressed) {
            // LogUtil.superLog("校验 : " + relativePath);
            return true;
        } else {
            // LogUtil.superLog("Verification passed : " + relativePath + ' (' + expectedMD5 + ')' + ", abspath:" + path);
            // let str = native.fileUtils.getStringFromFile(path)
            // let fileData:ArrayBuffer = native.fileUtils.getDataFromFile(path)
            // let resMD5 = crypto.createHash('md5').update().digest('hex');
            // let resMD5 = CryptoJS.MD5(str)
            // var resMD5 = md5.update(native.fileUtils.getDataFromFile(path)).hex()
            // LogUtil.superLog("verify  aseet.md5:" + asset.md5 + ' resMD5:' + resMD5 + ' is equal:' + (asset.md5 == resMD5));
            // return asset.md5 == resMD5;
            return true
        }
    }

    /**
     * 版本比较
     * @param {版本a} localVersion 
     * @param {版本b} remoteVersion 
     */
    _versionCompareHandle(localVersion, remoteVersion) {
        // LogUtil.superLog("JS Custom Version Compare: version A is " + localVersion + ', version B is ' + remoteVersion);
        var vA = localVersion.split('.');
        var vB = remoteVersion.split('.');

        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || '0');
            if (a === b) {
                continue;
            } else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        } else {
            return 0;
        }
    }

    /**
     * 检查更新回调
     */
    _checkEventCallback(event: native.EventAssetsManager) {
        // LogUtil.superLog("_checkEventCallback _checkEventCallback ", event.getEventCode() + ", event:" + event)
        switch (event.getEventCode()) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST: // 本地manifest没有被发现
                this._checkState = 1; // 检查完毕
                this._updateState = -1; // 不可以更新
                this._assetsMgr.setEventCallback(null);
                if (this._checkResultCallback) {
                    let error = { code: event.getEventCode(), info: "hotupdate.updateFailed" };
                    let checkResult = null;
                    this._checkResultCallback.call(this._checkResultCallback.target, error, checkResult);
                }
                break;
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST: // 下载清单错误
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:  // 解析manifest出错 
                this._checkState = 1; // 检查完毕
                this._updateState = -1; // 不可以更新
                this._assetsMgr.setEventCallback(null);
                if (this._checkResultCallback) {
                    let error = { code: event.getEventCode(), info: "hotupdate.updateFailed" };
                    let checkResult = null;
                    this._checkResultCallback.call(this._checkResultCallback.target, error, checkResult);
                }
                break;
            case native.EventAssetsManager.NEW_VERSION_FOUND:     //新版本被发现
                this._checkState = 1; // 检查完毕
                this._updateState = 0; // 可以更新
                this._assetsMgr.setEventCallback(null);
                if (this._checkResultCallback) {
                    let error = null;
                    let checkResult = { isNewVersion: true };
                    this._checkResultCallback.call(this._checkResultCallback.target, error, checkResult);
                }
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:    //已经更新到最新版本
                this._checkState = 1; // 检查完毕
                this._updateState = -1; // 不可以更新
                this._assetsMgr.setEventCallback(null);
                if (this._checkResultCallback) {
                    let error = null;
                    let checkResult = { isNewVersion: false };
                    this._checkResultCallback.call(this._checkResultCallback.target, error, checkResult);
                }
                break;
            default:
                break;
        }
    }

    // native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST = 0;
    // native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST = 1;
    // native.EventAssetsManager.ERROR_PARSE_MANIFEST = 2;
    // native.EventAssetsManager.NEW_VERSION_FOUND = 3;
    // native.EventAssetsManager.ALREADY_UP_TO_DATE = 4;
    // native.EventAssetsManager.UPDATE_PROGRESSION = 5;
    // native.EventAssetsManager.ASSET_UPDATED = 6;
    // native.EventAssetsManager.ERROR_UPDATING = 7;
    // native.EventAssetsManager.UPDATE_FINISHED = 8;
    // native.EventAssetsManager.UPDATE_FAILED = 9;
    // native.EventAssetsManager.ERROR_DECOMPRESS = 10;
    /**
     * 更新回调
     */
    _updateEventCallback(event: native.EventAssetsManager) {
        // LogUtil.superLog("_updateEventCallback _updateEventCallback: " + event.getEventCode() + ", assetId:" + event.getAssetId() +
        //     ", msg:" + event.getMessage())
        switch (event.getEventCode()) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST: // 本地manifest没有被发现
                this._updateState = 2;  // 更新完毕
                if (this._finishCallback) {
                    let error = { code: event.getEventCode(), info: "hotupdate.updateFailed" };
                    this._finishCallback.call(this._finishCallback.target, error);
                }
                break;
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST: // 下载清单错误
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:  // 解析manifest出错 
                this._updateState = 2;  // 更新完毕
                if (this._finishCallback) {
                    let error = { code: event.getEventCode(), info: "hotupdate.updateFailed" };
                    this._finishCallback.call(this._finishCallback.target, error);
                }
                break;
            case native.EventAssetsManager.NEW_VERSION_FOUND:     //新版本被发现
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:    //已经更新到最新版本
                break;
            case native.EventAssetsManager.UPDATE_PROGRESSION:    //持续更新
                if (this._progressCallback) {
                    let error = null;
                    let progressData: any = {};
                    progressData.percent = event.getPercent();
                    progressData.percentByFile = event.getPercentByFile();
                    progressData.downloadedBytes = event.getDownloadedBytes();
                    progressData.totalBytes = event.getTotalBytes();
                    progressData.downloadedFiles = event.getDownloadedFiles();
                    progressData.totalFiles = event.getTotalFiles();
                    this._progressCallback.call(this._progressCallback.target, error, progressData);
                }
                break;
            case native.EventAssetsManager.ASSET_UPDATED:         //资源被更新
                break;
            case native.EventAssetsManager.ERROR_UPDATING:        //更新中出错
            case native.EventAssetsManager.UPDATE_FAILED:         //更新失败
            case native.EventAssetsManager.ERROR_DECOMPRESS:      //解压出错
                this._updateState = 2;  // 更新完毕
                this._canRetry = true;  // 可以尝试重新下载
                if (this._finishCallback) {
                    let error = { code: event.getEventCode(), info: "hotupdate.updateFailed", canRetry: true };
                    this._finishCallback.call(this._finishCallback.target, error);
                }
                break;
            case native.EventAssetsManager.UPDATE_FINISHED:       //更新完成
                //存储当前版本的热更
                sys.localStorage.setItem(GD.DISK_HOTUPDATE_VERSION, JSON.stringify({ version: this._remoteVersion, mainVersion: this._remoteMainVersion, subVersion: this._remoteSubVersion }));
                // LogUtil.superLog("写进去的版本号 ", this._remoteVersion)

                // 在下载资源完毕后，加入资源搜索路径
                let hotupdatePath = GD.getHotUpdateDir()
                native.fileUtils.addSearchPath(hotupdatePath, true)
                sys.localStorage.setItem(GD.DISK_HOTUPDATE_PATH, hotupdatePath);
                this._updateState = 2;  // 更新完毕
                // LogUtil.superLog("更新完毕");
                if (this._finishCallback) {
                    let error = null;
                    this._finishCallback.call(this._finishCallback.target, error);
                }
                break;
        }
    }

    /**
     * 
     * @param newUrl 新的热更路径
     * @param localManifestPath 本地的路径
     */
    modifyUrlForManifestFile(newUrl: string, localManifestPath: string) {
        // LogUtil.superLog("modifyUrlForManifestFile", newUrl, localManifestPath)
        if (native.fileUtils.isFileExist(`${GD.getHotUpdateDir()}/project.manifest`)) {
            // LogUtil.superLog("有下载的manifest文件")
            let storagePath = GD.getHotUpdateDir()
            // LogUtil.superLog("StoragePath for remote asset : ", storagePath)
            let loadManifest = native.fileUtils.getStringFromFile(`${storagePath}/project.manifest`)
            let manifestObject = JSON.parse(loadManifest)
            manifestObject.packageUrl = newUrl
            manifestObject.remoteManifestUrl = `${newUrl}project.manifest`
            manifestObject.remoteVersionUrl = `${newUrl}version.manifest`

            let afterString = JSON.stringify(manifestObject)
            let isWritten = native.fileUtils.writeStringToFile(afterString, `${storagePath}/project.manifest`)
            // LogUtil.superLog("HotUpdate 写入新的url是否成功 ", isWritten)
        } else {
            //修改原始manifest文件，因为原始的不让修改，所以创建一个出来
            let initializedManifestPath = GD.getHotUpdateDir()
            if (!native.fileUtils.isDirectoryExist(initializedManifestPath)) {
                native.fileUtils.createDirectory(initializedManifestPath)
            }
            // LogUtil.superLog("storagePath==", initializedManifestPath)
            // LogUtil.superLog("没有下载的manifest文件", newUrl)
            let originManifestPath = localManifestPath
            let originManifest = native.fileUtils.getStringFromFile(originManifestPath)
            let originManifestObject = JSON.parse(originManifest)
            originManifestObject.packageUrl = newUrl
            originManifestObject.remoteManifestUrl = `${newUrl}project.manifest`
            originManifestObject.remoteVersionUrl = `${newUrl}version.manifest`
            let afterString = JSON.stringify(originManifestObject)
            let isWritten = native.fileUtils.writeStringToFile(afterString, `${initializedManifestPath}/project.manifest`)
            // LogUtil.superLog("HotUpdate 写入新的url到原始manifest是否成功 ", isWritten)
        }
    }
    onDestroy() {
        if (this._assetsMgr) {
            this._assetsMgr.setEventCallback(null)
        }
    }
}

