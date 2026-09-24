import { randomRangeInt } from 'cc';
import * as CryptoEs from 'crypto-es';
import Tools from './tools';

export class MsgVerifier {
    public static key = "";
    private static sequence = 1;
    
    // 包装消息（添加签名）
    static wrapMessage(data: Uint8Array,id:number): Uint8Array {
        const timestamp = Tools.getBeijingTime().getTime() //Date.now();
        const sequence = randomRangeInt(1,4294967294)  //4294967295//this.sequence++;
        
        const signature = this.generateSignature(data, timestamp, sequence,id);
        
        const verifiedMsg = outer_pb.Msg.create({
            Data: data,
            Sign: this.hexToBytes(signature),
            Time: timestamp,
            Seq: sequence,
            Id:id
        });
        return outer_pb.Msg.encode(verifiedMsg).finish();
    }
    // 生成消息签名
    static generateSignature(data: Uint8Array, time: number, seq: number,id:number): string {
        // 组合签名数据：消息数据 + 时间戳 + 序列号
        const dataToSign = this.concatArrays(
            data,
            this.numberToBytes8(time),
            this.numberToBytes4(seq),
            this.numberToBytes4(id)
        );
        // 使用 HMAC-SHA256 生成签名
        const wordArray = CryptoEs.WordArray.create(dataToSign as any);
        const hmac = CryptoEs.HmacSHA256(wordArray, this.key);
        
        return hmac.toString(CryptoEs.Hex);
    }
    // 工具方法
    private static concatArrays(...arrays: Uint8Array[]): Uint8Array {
        const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        
        arrays.forEach(arr => {
            result.set(arr, offset);
            offset += arr.length;
        });
        
        return result;
    }
    
    // 8字节数字转换（用于时间戳）
    private static numberToBytes8(num: number): Uint8Array {
        const buffer = new ArrayBuffer(8);
        const view = new DataView(buffer);
        view.setBigUint64(0, BigInt(num), false); // 大端序
        return new Uint8Array(buffer);
    }
    
    // 4字节数字转换（用于序列号和消息ID）
    private static numberToBytes4(num: number): Uint8Array {
        const buffer = new ArrayBuffer(4);
        const view = new DataView(buffer);
        view.setUint32(0, num, false); // 大端序
        return new Uint8Array(buffer);
    }
    
    private static hexToBytes(hex: string): Uint8Array {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return bytes;
    }
    
    // private static bytesToHex(bytes: Uint8Array): string {
    //     return Array.from(bytes)
    //         .map(b => b.toString(16).padStart(2, '0'))
    //         .join('');
    // }
    // 验证消息签名
    // static verifySignature(
    //     data: Uint8Array, 
    //     sign: string, 
    //     time: number, 
    //     seq: number,
    //     id:number
    // ): boolean {
    //     const calculatedSignature = this.generateSignature(data, time, seq,id);
    //     return calculatedSignature === sign;
    // }
    // 解包并验证消息
    // static unwrapAndVerify(wrappedData: Uint8Array): Uint8Array | null {
    //     try {
    //         const msg = outer_pb.Msg.decode(wrappedData);
            
    //         // 验证时间戳（防止重放攻击）
    //         const now = Date.now();
    //         if (Math.abs(now - msg.Time) > 300000) { // 5分钟有效期
    //             console.error("消息已过期");
    //             return null;
    //         }
            
    //         // 验证签名
    //         const signatureValid = this.verifySignature(
    //             msg.Data,
    //             this.bytesToHex(msg.Sign),
    //             msg.Time,
    //             msg.Seq,
    //             msg.Id
    //         );
            
    //         if (!signatureValid) {
    //             console.error("消息签名验证失败");
    //             return null;
    //         }
            
    //         return msg.Data;
            
    //     } catch (error) {
    //         console.error("消息验证失败:", error);
    //         return null;
    //     }
    // }
}