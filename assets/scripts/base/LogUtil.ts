
import { log, sys } from "cc";

/**
 * 工具类
 */
export default class LogUtil {
    /**
     * 
     * @param data 打印的数据
     * @param desc 表的名称
     * @param deepCount 深度
     */
    public static dump(data: any, desc: string = "data", deepCount: number = 5) {
        let curDeep: number = 0
        let tab = ""
        let printStr = ""
        let _dump = (obj: any, objKey: string) => {
            let objType = Object.prototype.toString.call(obj)
            if (objType == "[object Object]" || objType == "[object Array]") {
                let kuoHao1: string = "{"
                let kuoHao2: string = "}"
                if (objType == "[object Array]") {
                    kuoHao1 = "["
                    kuoHao2 = "]"
                }
                let objTab = "" //获得tab
                for (let i = 0; i < curDeep; i++) {
                    objTab += "\t"
                }
                if (curDeep == 0) {
                    printStr += objKey + " = " + kuoHao1
                } else {
                    printStr += "\n" + objTab + objKey + " = " + kuoHao1
                }
                curDeep++
                if (curDeep <= deepCount) {
                    tab += "\t"
                    for (let key in obj) { //循环
                        if (key == "$type") continue  //这个忽略
                        _dump(obj[key], key)
                    }
                    tab = ""
                    for (let i = curDeep - 1; i > 0; i--) {
                        tab += "\t"
                    }
                    curDeep -= 1
                    printStr += "\n" + tab + kuoHao2
                } else {
                    printStr += "\n" + objTab + "[more data...]"
                    return
                }
            } else if (objType == "[object String]") {
                printStr += "\n" + tab + objKey + " = \"" + obj + "\""
            } else if (objType == "[object Boolean]" || objType == "[object Number]") {
                printStr += "\n" + tab + objKey + " = " + obj
            }
        }

        _dump(data, desc)
        this.superLog(printStr)
    }

    /**
     * 增加时间的log
     * @param str 
     */
    public static superLog(message?: any, ...optionalParams: any[]) {
        let date = new Date()
        let dateStr = `${date.toLocaleString()}:`
        if(!sys.isNative) { //原生打印本来就带日期
            if(optionalParams.length > 0) {
                log(dateStr + message, ...optionalParams)
                // console.log(dateStr + message, ...optionalParams)
            } else {
                log(dateStr + message)
                // console.log(dateStr + message)
            }
        } else {    
            if(optionalParams.length > 0) {
                log(message, ...optionalParams)
                // console.log(message, ...optionalParams)
            } else {
                log(message)
                // console.log(message)
            }
        }
    }
}
