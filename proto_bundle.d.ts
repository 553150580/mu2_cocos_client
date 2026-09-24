type Long = protobuf.Long;
// DO NOT EDIT! This is a generated file. Edit the JSDoc in src/*.js instead and run 'npm run types'.

/** Namespace outer_pb. */
declare namespace outer_pb {

    /** Properties of a Msg. */
    interface IMsg {

        /** Msg Data */
        Data?: (Uint8Array|null);

        /** Msg Sign */
        Sign?: (Uint8Array|null);

        /** Msg Time */
        Time?: (number|Long|null);

        /** Msg Seq */
        Seq?: (number|null);

        /** Msg Id */
        Id?: (number|null);
    }

    /** Represents a Msg. */
    class Msg implements IMsg {

        /**
         * Constructs a new Msg.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IMsg);

        /** Msg Data. */
        public Data: Uint8Array;

        /** Msg Sign. */
        public Sign: Uint8Array;

        /** Msg Time. */
        public Time: (number|Long);

        /** Msg Seq. */
        public Seq: number;

        /** Msg Id. */
        public Id: number;

        /**
         * Creates a new Msg instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Msg instance
         */
        public static create(properties?: outer_pb.IMsg): outer_pb.Msg;

        /**
         * Encodes the specified Msg message. Does not implicitly {@link outer_pb.Msg.verify|verify} messages.
         * @param message Msg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IMsg, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a Msg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Msg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.Msg;
    }

    /** Properties of a PayAct. */
    interface IPayAct {

        /** PayAct MuPoint */
        MuPoint?: (number|null);

        /** PayAct Jf */
        Jf?: (number|null);
    }

    /** Represents a PayAct. */
    class PayAct implements IPayAct {

        /**
         * Constructs a new PayAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IPayAct);

        /** PayAct MuPoint. */
        public MuPoint: number;

        /** PayAct Jf. */
        public Jf: number;

        /**
         * Creates a new PayAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PayAct instance
         */
        public static create(properties?: outer_pb.IPayAct): outer_pb.PayAct;

        /**
         * Encodes the specified PayAct message. Does not implicitly {@link outer_pb.PayAct.verify|verify} messages.
         * @param message PayAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IPayAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a PayAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PayAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.PayAct;
    }

    /** Properties of a GmActOut. */
    interface IGmActOut {

        /** GmActOut ErrCode */
        ErrCode?: (number|null);

        /** GmActOut Account */
        Account?: (string|null);

        /** GmActOut Pass */
        Pass?: (string|null);

        /** GmActOut Msg */
        Msg?: (string|null);

        /** GmActOut Hour */
        Hour?: (number|null);

        /** GmActOut Minute */
        Minute?: (number|null);

        /** GmActOut RoleNums */
        RoleNums?: ({ [k: string]: number }|null);

        /** GmActOut Num */
        Num?: (number|null);

        /** GmActOut Type */
        Type?: (number|null);

        /** GmActOut LastTime */
        LastTime?: (number|Long|null);

        /** GmActOut LastIp */
        LastIp?: (string|null);

        /** GmActOut AccountType */
        AccountType?: (number|null);

        /** GmActOut AllLc */
        AllLc?: (number|null);

        /** GmActOut MuPoint */
        MuPoint?: (number|null);

        /** GmActOut RoleList */
        RoleList?: ({ [k: string]: outer_pb.IRoleList }|null);

        /** GmActOut RegisterTime */
        RegisterTime?: (number|Long|null);

        /** GmActOut Jf */
        Jf?: (number|null);

        /** GmActOut RoleId */
        RoleId?: (number|Long|null);

        /** GmActOut Sid */
        Sid?: (string|null);

        /** GmActOut Wx */
        Wx?: (string|null);

        /** GmActOut Item */
        Item?: (outer_pb.IMailItem|null);

        /** GmActOut K */
        K?: (string|null);

        /** GmActOut Year */
        Year?: (number|null);

        /** GmActOut Month */
        Month?: (number|null);

        /** GmActOut Day */
        Day?: (number|null);

        /** GmActOut RoleMoneys */
        RoleMoneys?: ({ [k: string]: (number|Long) }|null);

        /** GmActOut LcDatas */
        LcDatas?: ({ [k: string]: outer_pb.ILcData }|null);
    }

    /** Represents a GmActOut. */
    class GmActOut implements IGmActOut {

        /**
         * Constructs a new GmActOut.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IGmActOut);

        /** GmActOut ErrCode. */
        public ErrCode: number;

        /** GmActOut Account. */
        public Account: string;

        /** GmActOut Pass. */
        public Pass: string;

        /** GmActOut Msg. */
        public Msg: string;

        /** GmActOut Hour. */
        public Hour: number;

        /** GmActOut Minute. */
        public Minute: number;

        /** GmActOut RoleNums. */
        public RoleNums: { [k: string]: number };

        /** GmActOut Num. */
        public Num: number;

        /** GmActOut Type. */
        public Type: number;

        /** GmActOut LastTime. */
        public LastTime: (number|Long);

        /** GmActOut LastIp. */
        public LastIp: string;

        /** GmActOut AccountType. */
        public AccountType: number;

        /** GmActOut AllLc. */
        public AllLc: number;

        /** GmActOut MuPoint. */
        public MuPoint: number;

        /** GmActOut RoleList. */
        public RoleList: { [k: string]: outer_pb.IRoleList };

        /** GmActOut RegisterTime. */
        public RegisterTime: (number|Long);

        /** GmActOut Jf. */
        public Jf: number;

        /** GmActOut RoleId. */
        public RoleId: (number|Long);

        /** GmActOut Sid. */
        public Sid: string;

        /** GmActOut Wx. */
        public Wx: string;

        /** GmActOut Item. */
        public Item?: (outer_pb.IMailItem|null);

        /** GmActOut K. */
        public K: string;

        /** GmActOut Year. */
        public Year: number;

        /** GmActOut Month. */
        public Month: number;

        /** GmActOut Day. */
        public Day: number;

        /** GmActOut RoleMoneys. */
        public RoleMoneys: { [k: string]: (number|Long) };

        /** GmActOut LcDatas. */
        public LcDatas: { [k: string]: outer_pb.ILcData };

        /**
         * Creates a new GmActOut instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GmActOut instance
         */
        public static create(properties?: outer_pb.IGmActOut): outer_pb.GmActOut;

        /**
         * Encodes the specified GmActOut message. Does not implicitly {@link outer_pb.GmActOut.verify|verify} messages.
         * @param message GmActOut message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IGmActOut, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a GmActOut message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GmActOut
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.GmActOut;
    }

    /** Properties of a LcData. */
    interface ILcData {

        /** LcData AllLc */
        AllLc?: (number|null);

        /** LcData MuPoint */
        MuPoint?: (number|null);

        /** LcData Jf */
        Jf?: (number|null);
    }

    /** Represents a LcData. */
    class LcData implements ILcData {

        /**
         * Constructs a new LcData.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ILcData);

        /** LcData AllLc. */
        public AllLc: number;

        /** LcData MuPoint. */
        public MuPoint: number;

        /** LcData Jf. */
        public Jf: number;

        /**
         * Creates a new LcData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LcData instance
         */
        public static create(properties?: outer_pb.ILcData): outer_pb.LcData;

        /**
         * Encodes the specified LcData message. Does not implicitly {@link outer_pb.LcData.verify|verify} messages.
         * @param message LcData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ILcData, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a LcData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LcData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.LcData;
    }

    /** Properties of a Server. */
    interface IServer {

        /** Server ServerId */
        ServerId?: (string|null);

        /** Server Name */
        Name?: (string|null);

        /** Server OpenTime */
        OpenTime?: (number|Long|null);

        /** Server GateId */
        GateId?: (number|null);
    }

    /** Represents a Server. */
    class Server implements IServer {

        /**
         * Constructs a new Server.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IServer);

        /** Server ServerId. */
        public ServerId: string;

        /** Server Name. */
        public Name: string;

        /** Server OpenTime. */
        public OpenTime: (number|Long);

        /** Server GateId. */
        public GateId: number;

        /**
         * Creates a new Server instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Server instance
         */
        public static create(properties?: outer_pb.IServer): outer_pb.Server;

        /**
         * Encodes the specified Server message. Does not implicitly {@link outer_pb.Server.verify|verify} messages.
         * @param message Server message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IServer, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a Server message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Server
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.Server;
    }

    /** Properties of a GetOther. */
    interface IGetOther {

        /** GetOther ErrCode */
        ErrCode?: (number|null);

        /** GetOther Id */
        Id?: (number|Long|null);

        /** GetOther RoleInfo */
        RoleInfo?: (outer_pb.IRoleInfo|null);

        /** GetOther CanKf */
        CanKf?: (boolean|null);
    }

    /** Represents a GetOther. */
    class GetOther implements IGetOther {

        /**
         * Constructs a new GetOther.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IGetOther);

        /** GetOther ErrCode. */
        public ErrCode: number;

        /** GetOther Id. */
        public Id: (number|Long);

        /** GetOther RoleInfo. */
        public RoleInfo?: (outer_pb.IRoleInfo|null);

        /** GetOther CanKf. */
        public CanKf: boolean;

        /**
         * Creates a new GetOther instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetOther instance
         */
        public static create(properties?: outer_pb.IGetOther): outer_pb.GetOther;

        /**
         * Encodes the specified GetOther message. Does not implicitly {@link outer_pb.GetOther.verify|verify} messages.
         * @param message GetOther message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IGetOther, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a GetOther message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetOther
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.GetOther;
    }

    /** Properties of a ShiTuAct. */
    interface IShiTuAct {

        /** ShiTuAct ErrCode */
        ErrCode?: (number|null);

        /** ShiTuAct RoleId */
        RoleId?: (number|Long|null);

        /** ShiTuAct RoleId1 */
        RoleId1?: (number|Long|null);

        /** ShiTuAct TuDiList */
        TuDiList?: (outer_pb.ITuDiInfo[]|null);

        /** ShiTuAct RoleInfo */
        RoleInfo?: (outer_pb.IRoleInfo|null);

        /** ShiTuAct Account */
        Account?: (string|null);

        /** ShiTuAct Sid */
        Sid?: (string|null);

        /** ShiTuAct List */
        List?: ({ [k: string]: outer_pb.IRoleMiniInfo }|null);

        /** ShiTuAct Step */
        Step?: (number|null);

        /** ShiTuAct Items */
        Items?: ({ [k: string]: number }|null);

        /** ShiTuAct Equip */
        Equip?: (outer_pb.IEquip|null);
    }

    /** Represents a ShiTuAct. */
    class ShiTuAct implements IShiTuAct {

        /**
         * Constructs a new ShiTuAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IShiTuAct);

        /** ShiTuAct ErrCode. */
        public ErrCode: number;

        /** ShiTuAct RoleId. */
        public RoleId: (number|Long);

        /** ShiTuAct RoleId1. */
        public RoleId1: (number|Long);

        /** ShiTuAct TuDiList. */
        public TuDiList: outer_pb.ITuDiInfo[];

        /** ShiTuAct RoleInfo. */
        public RoleInfo?: (outer_pb.IRoleInfo|null);

        /** ShiTuAct Account. */
        public Account: string;

        /** ShiTuAct Sid. */
        public Sid: string;

        /** ShiTuAct List. */
        public List: { [k: string]: outer_pb.IRoleMiniInfo };

        /** ShiTuAct Step. */
        public Step: number;

        /** ShiTuAct Items. */
        public Items: { [k: string]: number };

        /** ShiTuAct Equip. */
        public Equip?: (outer_pb.IEquip|null);

        /**
         * Creates a new ShiTuAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ShiTuAct instance
         */
        public static create(properties?: outer_pb.IShiTuAct): outer_pb.ShiTuAct;

        /**
         * Encodes the specified ShiTuAct message. Does not implicitly {@link outer_pb.ShiTuAct.verify|verify} messages.
         * @param message ShiTuAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IShiTuAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a ShiTuAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ShiTuAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.ShiTuAct;
    }

    /** Properties of a RoleMiniInfo. */
    interface IRoleMiniInfo {

        /** RoleMiniInfo Id */
        Id?: (number|Long|null);

        /** RoleMiniInfo Name */
        Name?: (string|null);

        /** RoleMiniInfo Sid */
        Sid?: (string|null);

        /** RoleMiniInfo Num */
        Num?: (number|null);
    }

    /** Represents a RoleMiniInfo. */
    class RoleMiniInfo implements IRoleMiniInfo {

        /**
         * Constructs a new RoleMiniInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IRoleMiniInfo);

        /** RoleMiniInfo Id. */
        public Id: (number|Long);

        /** RoleMiniInfo Name. */
        public Name: string;

        /** RoleMiniInfo Sid. */
        public Sid: string;

        /** RoleMiniInfo Num. */
        public Num: number;

        /**
         * Creates a new RoleMiniInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoleMiniInfo instance
         */
        public static create(properties?: outer_pb.IRoleMiniInfo): outer_pb.RoleMiniInfo;

        /**
         * Encodes the specified RoleMiniInfo message. Does not implicitly {@link outer_pb.RoleMiniInfo.verify|verify} messages.
         * @param message RoleMiniInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IRoleMiniInfo, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a RoleMiniInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoleMiniInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.RoleMiniInfo;
    }

    /** Properties of a RoleMiniList. */
    interface IRoleMiniList {

        /** RoleMiniList List */
        List?: (outer_pb.IRoleMiniInfo[]|null);
    }

    /** Represents a RoleMiniList. */
    class RoleMiniList implements IRoleMiniList {

        /**
         * Constructs a new RoleMiniList.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IRoleMiniList);

        /** RoleMiniList List. */
        public List: outer_pb.IRoleMiniInfo[];

        /**
         * Creates a new RoleMiniList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoleMiniList instance
         */
        public static create(properties?: outer_pb.IRoleMiniList): outer_pb.RoleMiniList;

        /**
         * Encodes the specified RoleMiniList message. Does not implicitly {@link outer_pb.RoleMiniList.verify|verify} messages.
         * @param message RoleMiniList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IRoleMiniList, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a RoleMiniList message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoleMiniList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.RoleMiniList;
    }

    /** Properties of a TuDiInfo. */
    interface ITuDiInfo {

        /** TuDiInfo Step */
        Step?: (number|null);

        /** TuDiInfo Sid */
        Sid?: (string|null);

        /** TuDiInfo Info */
        Info?: (outer_pb.IRoleInfo|null);
    }

    /** Represents a TuDiInfo. */
    class TuDiInfo implements ITuDiInfo {

        /**
         * Constructs a new TuDiInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ITuDiInfo);

        /** TuDiInfo Step. */
        public Step: number;

        /** TuDiInfo Sid. */
        public Sid: string;

        /** TuDiInfo Info. */
        public Info?: (outer_pb.IRoleInfo|null);

        /**
         * Creates a new TuDiInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TuDiInfo instance
         */
        public static create(properties?: outer_pb.ITuDiInfo): outer_pb.TuDiInfo;

        /**
         * Encodes the specified TuDiInfo message. Does not implicitly {@link outer_pb.TuDiInfo.verify|verify} messages.
         * @param message TuDiInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ITuDiInfo, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a TuDiInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TuDiInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.TuDiInfo;
    }

    /** Properties of a RoleInfo. */
    interface IRoleInfo {

        /** RoleInfo Name */
        Name?: (string|null);

        /** RoleInfo Lv */
        Lv?: (number|null);

        /** RoleInfo ZhanMeng */
        ZhanMeng?: (string|null);

        /** RoleInfo Id */
        Id?: (number|Long|null);

        /** RoleInfo RoleType */
        RoleType?: (number|null);

        /** RoleInfo BodyEquips */
        BodyEquips?: ({ [k: string]: outer_pb.IEquip }|null);

        /** RoleInfo State */
        State?: (number|null);

        /** RoleInfo TgTime */
        TgTime?: (number|Long|null);

        /** RoleInfo BodyEquipIds */
        BodyEquipIds?: ({ [k: string]: number }|null);

        /** RoleInfo UsedMuPoint */
        UsedMuPoint?: (number|Long|null);

        /** RoleInfo DsLv */
        DsLv?: (number|null);

        /** RoleInfo ZsNum */
        ZsNum?: (number|null);

        /** RoleInfo ChangeNameTime */
        ChangeNameTime?: (number|null);

        /** RoleInfo ChIdLv */
        ChIdLv?: (number[]|null);

        /** RoleInfo TeamId */
        TeamId?: (number|null);

        /** RoleInfo GoldYk */
        GoldYk?: (number|Long|null);

        /** RoleInfo BaseYk */
        BaseYk?: (number|Long|null);
    }

    /** Represents a RoleInfo. */
    class RoleInfo implements IRoleInfo {

        /**
         * Constructs a new RoleInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IRoleInfo);

        /** RoleInfo Name. */
        public Name: string;

        /** RoleInfo Lv. */
        public Lv: number;

        /** RoleInfo ZhanMeng. */
        public ZhanMeng: string;

        /** RoleInfo Id. */
        public Id: (number|Long);

        /** RoleInfo RoleType. */
        public RoleType: number;

        /** RoleInfo BodyEquips. */
        public BodyEquips: { [k: string]: outer_pb.IEquip };

        /** RoleInfo State. */
        public State: number;

        /** RoleInfo TgTime. */
        public TgTime: (number|Long);

        /** RoleInfo BodyEquipIds. */
        public BodyEquipIds: { [k: string]: number };

        /** RoleInfo UsedMuPoint. */
        public UsedMuPoint: (number|Long);

        /** RoleInfo DsLv. */
        public DsLv: number;

        /** RoleInfo ZsNum. */
        public ZsNum: number;

        /** RoleInfo ChangeNameTime. */
        public ChangeNameTime: number;

        /** RoleInfo ChIdLv. */
        public ChIdLv: number[];

        /** RoleInfo TeamId. */
        public TeamId: number;

        /** RoleInfo GoldYk. */
        public GoldYk: (number|Long);

        /** RoleInfo BaseYk. */
        public BaseYk: (number|Long);

        /**
         * Creates a new RoleInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoleInfo instance
         */
        public static create(properties?: outer_pb.IRoleInfo): outer_pb.RoleInfo;

        /**
         * Encodes the specified RoleInfo message. Does not implicitly {@link outer_pb.RoleInfo.verify|verify} messages.
         * @param message RoleInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IRoleInfo, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a RoleInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoleInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.RoleInfo;
    }

    /** Properties of a CommonResponse. */
    interface ICommonResponse {

        /** CommonResponse ErrCode */
        ErrCode?: (number|null);

        /** CommonResponse ServerList */
        ServerList?: (outer_pb.IServer[]|null);

        /** CommonResponse Address */
        Address?: (string|null);

        /** CommonResponse Token */
        Token?: (string|null);

        /** CommonResponse NeedMuPoint */
        NeedMuPoint?: (number|Long|null);

        /** CommonResponse RoleList */
        RoleList?: (outer_pb.IRoleInfo[]|null);

        /** CommonResponse MaxTgTime */
        MaxTgTime?: (number|null);

        /** CommonResponse UsedMuPoint */
        UsedMuPoint?: (number|Long|null);

        /** CommonResponse MuPoint */
        MuPoint?: (number|Long|null);

        /** CommonResponse CreateNeedPoint */
        CreateNeedPoint?: (number|null);

        /** CommonResponse SwitchNeedPoint */
        SwitchNeedPoint?: ({ [k: string]: number }|null);

        /** CommonResponse ChangeNameNeed */
        ChangeNameNeed?: (number|null);

        /** CommonResponse ActiveRoles */
        ActiveRoles?: ({ [k: string]: number }|null);

        /** CommonResponse Jf */
        Jf?: (number|null);

        /** CommonResponse FreeActiveLv */
        FreeActiveLv?: (number|null);

        /** CommonResponse RoleId */
        RoleId?: (number|Long|null);

        /** CommonResponse K */
        K?: (string|null);

        /** CommonResponse GateMode */
        GateMode?: ({ [k: string]: boolean }|null);
    }

    /** Represents a CommonResponse. */
    class CommonResponse implements ICommonResponse {

        /**
         * Constructs a new CommonResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ICommonResponse);

        /** CommonResponse ErrCode. */
        public ErrCode: number;

        /** CommonResponse ServerList. */
        public ServerList: outer_pb.IServer[];

        /** CommonResponse Address. */
        public Address: string;

        /** CommonResponse Token. */
        public Token: string;

        /** CommonResponse NeedMuPoint. */
        public NeedMuPoint: (number|Long);

        /** CommonResponse RoleList. */
        public RoleList: outer_pb.IRoleInfo[];

        /** CommonResponse MaxTgTime. */
        public MaxTgTime: number;

        /** CommonResponse UsedMuPoint. */
        public UsedMuPoint: (number|Long);

        /** CommonResponse MuPoint. */
        public MuPoint: (number|Long);

        /** CommonResponse CreateNeedPoint. */
        public CreateNeedPoint: number;

        /** CommonResponse SwitchNeedPoint. */
        public SwitchNeedPoint: { [k: string]: number };

        /** CommonResponse ChangeNameNeed. */
        public ChangeNameNeed: number;

        /** CommonResponse ActiveRoles. */
        public ActiveRoles: { [k: string]: number };

        /** CommonResponse Jf. */
        public Jf: number;

        /** CommonResponse FreeActiveLv. */
        public FreeActiveLv: number;

        /** CommonResponse RoleId. */
        public RoleId: (number|Long);

        /** CommonResponse K. */
        public K: string;

        /** CommonResponse GateMode. */
        public GateMode: { [k: string]: boolean };

        /**
         * Creates a new CommonResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CommonResponse instance
         */
        public static create(properties?: outer_pb.ICommonResponse): outer_pb.CommonResponse;

        /**
         * Encodes the specified CommonResponse message. Does not implicitly {@link outer_pb.CommonResponse.verify|verify} messages.
         * @param message CommonResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ICommonResponse, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a CommonResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CommonResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.CommonResponse;
    }

    /** Properties of an AllRoleList. */
    interface IAllRoleList {

        /** AllRoleList ErrCode */
        ErrCode?: (number|null);

        /** AllRoleList Sid */
        Sid?: (string|null);

        /** AllRoleList SidList */
        SidList?: ({ [k: string]: (number|Long) }|null);

        /** AllRoleList List */
        List?: (outer_pb.IRoleInfo[]|null);

        /** AllRoleList LoadSidList */
        LoadSidList?: (boolean|null);
    }

    /** Represents an AllRoleList. */
    class AllRoleList implements IAllRoleList {

        /**
         * Constructs a new AllRoleList.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IAllRoleList);

        /** AllRoleList ErrCode. */
        public ErrCode: number;

        /** AllRoleList Sid. */
        public Sid: string;

        /** AllRoleList SidList. */
        public SidList: { [k: string]: (number|Long) };

        /** AllRoleList List. */
        public List: outer_pb.IRoleInfo[];

        /** AllRoleList LoadSidList. */
        public LoadSidList: boolean;

        /**
         * Creates a new AllRoleList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AllRoleList instance
         */
        public static create(properties?: outer_pb.IAllRoleList): outer_pb.AllRoleList;

        /**
         * Encodes the specified AllRoleList message. Does not implicitly {@link outer_pb.AllRoleList.verify|verify} messages.
         * @param message AllRoleList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IAllRoleList, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes an AllRoleList message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AllRoleList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.AllRoleList;
    }

    /** Properties of a GuessAct. */
    interface IGuessAct {

        /** GuessAct ErrCode */
        ErrCode?: (number|null);

        /** GuessAct Word */
        Word?: (string|null);

        /** GuessAct Num */
        Num?: (number|null);

        /** GuessAct MyHisList */
        MyHisList?: (outer_pb.IMatchResult[]|null);

        /** GuessAct GuessPh */
        GuessPh?: (outer_pb.IGuessResult[]|null);

        /** GuessAct IsFinished */
        IsFinished?: (boolean|null);

        /** GuessAct Answer */
        Answer?: (string|null);

        /** GuessAct Winner */
        Winner?: (string|null);

        /** GuessAct RoleInfo */
        RoleInfo?: (outer_pb.IRoleInfo|null);

        /** GuessAct ItemId */
        ItemId?: (number|null);

        /** GuessAct ItemNum */
        ItemNum?: (number|null);
    }

    /** Represents a GuessAct. */
    class GuessAct implements IGuessAct {

        /**
         * Constructs a new GuessAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IGuessAct);

        /** GuessAct ErrCode. */
        public ErrCode: number;

        /** GuessAct Word. */
        public Word: string;

        /** GuessAct Num. */
        public Num: number;

        /** GuessAct MyHisList. */
        public MyHisList: outer_pb.IMatchResult[];

        /** GuessAct GuessPh. */
        public GuessPh: outer_pb.IGuessResult[];

        /** GuessAct IsFinished. */
        public IsFinished: boolean;

        /** GuessAct Answer. */
        public Answer: string;

        /** GuessAct Winner. */
        public Winner: string;

        /** GuessAct RoleInfo. */
        public RoleInfo?: (outer_pb.IRoleInfo|null);

        /** GuessAct ItemId. */
        public ItemId: number;

        /** GuessAct ItemNum. */
        public ItemNum: number;

        /**
         * Creates a new GuessAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GuessAct instance
         */
        public static create(properties?: outer_pb.IGuessAct): outer_pb.GuessAct;

        /**
         * Encodes the specified GuessAct message. Does not implicitly {@link outer_pb.GuessAct.verify|verify} messages.
         * @param message GuessAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IGuessAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a GuessAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GuessAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.GuessAct;
    }

    /** Properties of a GuessResult. */
    interface IGuessResult {

        /** GuessResult Name */
        Name?: (string|null);

        /** GuessResult Score */
        Score?: (number|null);
    }

    /** Represents a GuessResult. */
    class GuessResult implements IGuessResult {

        /**
         * Constructs a new GuessResult.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IGuessResult);

        /** GuessResult Name. */
        public Name: string;

        /** GuessResult Score. */
        public Score: number;

        /**
         * Creates a new GuessResult instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GuessResult instance
         */
        public static create(properties?: outer_pb.IGuessResult): outer_pb.GuessResult;

        /**
         * Encodes the specified GuessResult message. Does not implicitly {@link outer_pb.GuessResult.verify|verify} messages.
         * @param message GuessResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IGuessResult, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a GuessResult message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GuessResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.GuessResult;
    }

    /** Properties of a MatchResult. */
    interface IMatchResult {

        /** MatchResult Score */
        Score?: (number|null);

        /** MatchResult CharMatches */
        CharMatches?: (number|null);

        /** MatchResult TotalChars */
        TotalChars?: (number|null);

        /** MatchResult IsCorrect */
        IsCorrect?: (boolean|null);

        /** MatchResult Word */
        Word?: (string|null);

        /** MatchResult Details */
        Details?: (number[]|null);

        /** MatchResult Category */
        Category?: (string|null);
    }

    /** Represents a MatchResult. */
    class MatchResult implements IMatchResult {

        /**
         * Constructs a new MatchResult.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IMatchResult);

        /** MatchResult Score. */
        public Score: number;

        /** MatchResult CharMatches. */
        public CharMatches: number;

        /** MatchResult TotalChars. */
        public TotalChars: number;

        /** MatchResult IsCorrect. */
        public IsCorrect: boolean;

        /** MatchResult Word. */
        public Word: string;

        /** MatchResult Details. */
        public Details: number[];

        /** MatchResult Category. */
        public Category: string;

        /**
         * Creates a new MatchResult instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MatchResult instance
         */
        public static create(properties?: outer_pb.IMatchResult): outer_pb.MatchResult;

        /**
         * Encodes the specified MatchResult message. Does not implicitly {@link outer_pb.MatchResult.verify|verify} messages.
         * @param message MatchResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IMatchResult, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a MatchResult message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MatchResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.MatchResult;
    }

    /** Properties of a PlayerGuess. */
    interface IPlayerGuess {

        /** PlayerGuess Word */
        Word?: (string|null);

        /** PlayerGuess Time */
        Time?: (number|Long|null);

        /** PlayerGuess Result */
        Result?: (outer_pb.IMatchResult|null);
    }

    /** Represents a PlayerGuess. */
    class PlayerGuess implements IPlayerGuess {

        /**
         * Constructs a new PlayerGuess.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IPlayerGuess);

        /** PlayerGuess Word. */
        public Word: string;

        /** PlayerGuess Time. */
        public Time: (number|Long);

        /** PlayerGuess Result. */
        public Result?: (outer_pb.IMatchResult|null);

        /**
         * Creates a new PlayerGuess instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PlayerGuess instance
         */
        public static create(properties?: outer_pb.IPlayerGuess): outer_pb.PlayerGuess;

        /**
         * Encodes the specified PlayerGuess message. Does not implicitly {@link outer_pb.PlayerGuess.verify|verify} messages.
         * @param message PlayerGuess message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IPlayerGuess, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a PlayerGuess message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PlayerGuess
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.PlayerGuess;
    }

    /** Properties of a PlayerRecord. */
    interface IPlayerRecord {

        /** PlayerRecord Name */
        Name?: (string|null);

        /** PlayerRecord BestScore */
        BestScore?: (number|null);

        /** PlayerRecord Guesses */
        Guesses?: (outer_pb.IPlayerGuess[]|null);
    }

    /** Represents a PlayerRecord. */
    class PlayerRecord implements IPlayerRecord {

        /**
         * Constructs a new PlayerRecord.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IPlayerRecord);

        /** PlayerRecord Name. */
        public Name: string;

        /** PlayerRecord BestScore. */
        public BestScore: number;

        /** PlayerRecord Guesses. */
        public Guesses: outer_pb.IPlayerGuess[];

        /**
         * Creates a new PlayerRecord instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PlayerRecord instance
         */
        public static create(properties?: outer_pb.IPlayerRecord): outer_pb.PlayerRecord;

        /**
         * Encodes the specified PlayerRecord message. Does not implicitly {@link outer_pb.PlayerRecord.verify|verify} messages.
         * @param message PlayerRecord message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IPlayerRecord, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a PlayerRecord message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PlayerRecord
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.PlayerRecord;
    }

    /** Properties of a TradeAct. */
    interface ITradeAct {

        /** TradeAct ErrCode */
        ErrCode?: (number|null);

        /** TradeAct Id */
        Id?: (number|Long|null);

        /** TradeAct IsHeOk */
        IsHeOk?: (boolean|null);

        /** TradeAct Uid */
        Uid?: (string|null);

        /** TradeAct ItemId */
        ItemId?: (number|null);

        /** TradeAct Num */
        Num?: (number|null);

        /** TradeAct Items */
        Items?: ({ [k: string]: outer_pb.ITradeObj }|null);

        /** TradeAct MuPoint */
        MuPoint?: (number|Long|null);

        /** TradeAct ChangeMuPoints */
        ChangeMuPoints?: ({ [k: string]: (number|Long) }|null);
    }

    /** Represents a TradeAct. */
    class TradeAct implements ITradeAct {

        /**
         * Constructs a new TradeAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ITradeAct);

        /** TradeAct ErrCode. */
        public ErrCode: number;

        /** TradeAct Id. */
        public Id: (number|Long);

        /** TradeAct IsHeOk. */
        public IsHeOk: boolean;

        /** TradeAct Uid. */
        public Uid: string;

        /** TradeAct ItemId. */
        public ItemId: number;

        /** TradeAct Num. */
        public Num: number;

        /** TradeAct Items. */
        public Items: { [k: string]: outer_pb.ITradeObj };

        /** TradeAct MuPoint. */
        public MuPoint: (number|Long);

        /** TradeAct ChangeMuPoints. */
        public ChangeMuPoints: { [k: string]: (number|Long) };

        /**
         * Creates a new TradeAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TradeAct instance
         */
        public static create(properties?: outer_pb.ITradeAct): outer_pb.TradeAct;

        /**
         * Encodes the specified TradeAct message. Does not implicitly {@link outer_pb.TradeAct.verify|verify} messages.
         * @param message TradeAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ITradeAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a TradeAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TradeAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.TradeAct;
    }

    /** Properties of a TradeObj. */
    interface ITradeObj {

        /** TradeObj OtherId */
        OtherId?: (number|Long|null);

        /** TradeObj IsMeOk */
        IsMeOk?: (boolean|null);

        /** TradeObj OtherName */
        OtherName?: (string|null);

        /** TradeObj Items */
        Items?: ({ [k: string]: outer_pb.ITradeItem }|null);

        /** TradeObj MuPoint */
        MuPoint?: (number|Long|null);
    }

    /** Represents a TradeObj. */
    class TradeObj implements ITradeObj {

        /**
         * Constructs a new TradeObj.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ITradeObj);

        /** TradeObj OtherId. */
        public OtherId: (number|Long);

        /** TradeObj IsMeOk. */
        public IsMeOk: boolean;

        /** TradeObj OtherName. */
        public OtherName: string;

        /** TradeObj Items. */
        public Items: { [k: string]: outer_pb.ITradeItem };

        /** TradeObj MuPoint. */
        public MuPoint: (number|Long);

        /**
         * Creates a new TradeObj instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TradeObj instance
         */
        public static create(properties?: outer_pb.ITradeObj): outer_pb.TradeObj;

        /**
         * Encodes the specified TradeObj message. Does not implicitly {@link outer_pb.TradeObj.verify|verify} messages.
         * @param message TradeObj message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ITradeObj, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a TradeObj message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TradeObj
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.TradeObj;
    }

    /** Properties of a TradeItem. */
    interface ITradeItem {

        /** TradeItem Uid */
        Uid?: (string|null);

        /** TradeItem Id */
        Id?: (number|null);

        /** TradeItem Num */
        Num?: (number|null);

        /** TradeItem Equip */
        Equip?: (outer_pb.IEquip|null);

        /** TradeItem Time */
        Time?: (number|Long|null);
    }

    /** Represents a TradeItem. */
    class TradeItem implements ITradeItem {

        /**
         * Constructs a new TradeItem.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ITradeItem);

        /** TradeItem Uid. */
        public Uid: string;

        /** TradeItem Id. */
        public Id: number;

        /** TradeItem Num. */
        public Num: number;

        /** TradeItem Equip. */
        public Equip?: (outer_pb.IEquip|null);

        /** TradeItem Time. */
        public Time: (number|Long);

        /**
         * Creates a new TradeItem instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TradeItem instance
         */
        public static create(properties?: outer_pb.ITradeItem): outer_pb.TradeItem;

        /**
         * Encodes the specified TradeItem message. Does not implicitly {@link outer_pb.TradeItem.verify|verify} messages.
         * @param message TradeItem message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ITradeItem, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a TradeItem message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TradeItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.TradeItem;
    }

    /** Properties of a RoleList. */
    interface IRoleList {

        /** RoleList List */
        List?: (outer_pb.IRoleInfo[]|null);
    }

    /** Represents a RoleList. */
    class RoleList implements IRoleList {

        /**
         * Constructs a new RoleList.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IRoleList);

        /** RoleList List. */
        public List: outer_pb.IRoleInfo[];

        /**
         * Creates a new RoleList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoleList instance
         */
        public static create(properties?: outer_pb.IRoleList): outer_pb.RoleList;

        /**
         * Encodes the specified RoleList message. Does not implicitly {@link outer_pb.RoleList.verify|verify} messages.
         * @param message RoleList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IRoleList, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a RoleList message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoleList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.RoleList;
    }

    /** Properties of a CommonAct. */
    interface ICommonAct {

        /** CommonAct ErrCode */
        ErrCode?: (number|null);

        /** CommonAct Account */
        Account?: (string|null);

        /** CommonAct Pass */
        Pass?: (string|null);

        /** CommonAct NewPass */
        NewPass?: (string|null);

        /** CommonAct ServerId */
        ServerId?: (string|null);

        /** CommonAct Name */
        Name?: (string|null);

        /** CommonAct NewName */
        NewName?: (string|null);

        /** CommonAct RoleType */
        RoleType?: (number|null);

        /** CommonAct Num */
        Num?: (number|null);

        /** CommonAct Uname */
        Uname?: (string|null);

        /** CommonAct Time */
        Time?: (number|Long|null);

        /** CommonAct Sign */
        Sign?: (string|null);

        /** CommonAct Wx */
        Wx?: (string|null);

        /** CommonAct Version */
        Version?: (number|null);

        /** CommonAct AllLc */
        AllLc?: (number|null);
    }

    /** Represents a CommonAct. */
    class CommonAct implements ICommonAct {

        /**
         * Constructs a new CommonAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ICommonAct);

        /** CommonAct ErrCode. */
        public ErrCode: number;

        /** CommonAct Account. */
        public Account: string;

        /** CommonAct Pass. */
        public Pass: string;

        /** CommonAct NewPass. */
        public NewPass: string;

        /** CommonAct ServerId. */
        public ServerId: string;

        /** CommonAct Name. */
        public Name: string;

        /** CommonAct NewName. */
        public NewName: string;

        /** CommonAct RoleType. */
        public RoleType: number;

        /** CommonAct Num. */
        public Num: number;

        /** CommonAct Uname. */
        public Uname: string;

        /** CommonAct Time. */
        public Time: (number|Long);

        /** CommonAct Sign. */
        public Sign: string;

        /** CommonAct Wx. */
        public Wx: string;

        /** CommonAct Version. */
        public Version: number;

        /** CommonAct AllLc. */
        public AllLc: number;

        /**
         * Creates a new CommonAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CommonAct instance
         */
        public static create(properties?: outer_pb.ICommonAct): outer_pb.CommonAct;

        /**
         * Encodes the specified CommonAct message. Does not implicitly {@link outer_pb.CommonAct.verify|verify} messages.
         * @param message CommonAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ICommonAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a CommonAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CommonAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.CommonAct;
    }

    /** Properties of a SysGG. */
    interface ISysGG {

        /** SysGG Msg */
        Msg?: (string|null);

        /** SysGG Time */
        Time?: (number|Long|null);
    }

    /** Represents a SysGG. */
    class SysGG implements ISysGG {

        /**
         * Constructs a new SysGG.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ISysGG);

        /** SysGG Msg. */
        public Msg: string;

        /** SysGG Time. */
        public Time: (number|Long);

        /**
         * Creates a new SysGG instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SysGG instance
         */
        public static create(properties?: outer_pb.ISysGG): outer_pb.SysGG;

        /**
         * Encodes the specified SysGG message. Does not implicitly {@link outer_pb.SysGG.verify|verify} messages.
         * @param message SysGG message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ISysGG, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a SysGG message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SysGG
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.SysGG;
    }

    /** Properties of a LoginGateRequest. */
    interface ILoginGateRequest {

        /** LoginGateRequest Token */
        Token?: (string|null);

        /** LoginGateRequest isRelogin */
        isRelogin?: (boolean|null);

        /** LoginGateRequest Name */
        Name?: (string|null);
    }

    /** Represents a LoginGateRequest. */
    class LoginGateRequest implements ILoginGateRequest {

        /**
         * Constructs a new LoginGateRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ILoginGateRequest);

        /** LoginGateRequest Token. */
        public Token: string;

        /** LoginGateRequest isRelogin. */
        public isRelogin: boolean;

        /** LoginGateRequest Name. */
        public Name: string;

        /**
         * Creates a new LoginGateRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoginGateRequest instance
         */
        public static create(properties?: outer_pb.ILoginGateRequest): outer_pb.LoginGateRequest;

        /**
         * Encodes the specified LoginGateRequest message. Does not implicitly {@link outer_pb.LoginGateRequest.verify|verify} messages.
         * @param message LoginGateRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ILoginGateRequest, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a LoginGateRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoginGateRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.LoginGateRequest;
    }

    /** Properties of a LoginGateResponse. */
    interface ILoginGateResponse {

        /** LoginGateResponse ErrCode */
        ErrCode?: (number|null);

        /** LoginGateResponse FreezedTime */
        FreezedTime?: (number|Long|null);

        /** LoginGateResponse RoleData */
        RoleData?: (outer_pb.IRole_proto|null);

        /** LoginGateResponse Config */
        Config?: ({ [k: string]: number }|null);

        /** LoginGateResponse BasePros */
        BasePros?: (outer_pb.IBasePros|null);

        /** LoginGateResponse BagItems */
        BagItems?: ({ [k: string]: number }|null);

        /** LoginGateResponse IsJieGuan */
        IsJieGuan?: (boolean|null);

        /** LoginGateResponse BagSet */
        BagSet?: (outer_pb.IBagSet|null);

        /** LoginGateResponse BagEquips */
        BagEquips?: ({ [k: string]: outer_pb.IEquip }|null);

        /** LoginGateResponse BodyEquips */
        BodyEquips?: ({ [k: string]: outer_pb.IEquip }|null);

        /** LoginGateResponse K */
        K?: (string|null);
    }

    /** Represents a LoginGateResponse. */
    class LoginGateResponse implements ILoginGateResponse {

        /**
         * Constructs a new LoginGateResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ILoginGateResponse);

        /** LoginGateResponse ErrCode. */
        public ErrCode: number;

        /** LoginGateResponse FreezedTime. */
        public FreezedTime: (number|Long);

        /** LoginGateResponse RoleData. */
        public RoleData?: (outer_pb.IRole_proto|null);

        /** LoginGateResponse Config. */
        public Config: { [k: string]: number };

        /** LoginGateResponse BasePros. */
        public BasePros?: (outer_pb.IBasePros|null);

        /** LoginGateResponse BagItems. */
        public BagItems: { [k: string]: number };

        /** LoginGateResponse IsJieGuan. */
        public IsJieGuan: boolean;

        /** LoginGateResponse BagSet. */
        public BagSet?: (outer_pb.IBagSet|null);

        /** LoginGateResponse BagEquips. */
        public BagEquips: { [k: string]: outer_pb.IEquip };

        /** LoginGateResponse BodyEquips. */
        public BodyEquips: { [k: string]: outer_pb.IEquip };

        /** LoginGateResponse K. */
        public K: string;

        /**
         * Creates a new LoginGateResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoginGateResponse instance
         */
        public static create(properties?: outer_pb.ILoginGateResponse): outer_pb.LoginGateResponse;

        /**
         * Encodes the specified LoginGateResponse message. Does not implicitly {@link outer_pb.LoginGateResponse.verify|verify} messages.
         * @param message LoginGateResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ILoginGateResponse, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a LoginGateResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoginGateResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.LoginGateResponse;
    }

    /** Properties of a Role_proto. */
    interface IRole_proto {

        /** Role_proto Name */
        Name?: (string|null);

        /** Role_proto RoomId */
        RoomId?: (number|null);

        /** Role_proto LineId */
        LineId?: (string|null);

        /** Role_proto Lv */
        Lv?: (number|null);

        /** Role_proto Zm */
        Zm?: (string|null);

        /** Role_proto BaseYk */
        BaseYk?: (number|Long|null);

        /** Role_proto GoldYk */
        GoldYk?: (number|Long|null);

        /** Role_proto Gold */
        Gold?: (number|Long|null);

        /** Role_proto Dia */
        Dia?: (number|Long|null);

        /** Role_proto I */
        I?: (number|null);

        /** Role_proto J */
        J?: (number|null);

        /** Role_proto TeamId */
        TeamId?: (number|null);

        /** Role_proto Exp */
        Exp?: (number|Long|null);

        /** Role_proto MaxExp */
        MaxExp?: (number|Long|null);

        /** Role_proto IsAuto */
        IsAuto?: (boolean|null);

        /** Role_proto RoleType */
        RoleType?: (number|null);

        /** Role_proto SkillLvs */
        SkillLvs?: ({ [k: string]: number }|null);

        /** Role_proto SkillSlots0 */
        SkillSlots0?: (number[]|null);

        /** Role_proto SkillSlots1 */
        SkillSlots1?: (number[]|null);

        /** Role_proto SkillSlots2 */
        SkillSlots2?: (number[]|null);

        /** Role_proto SkillMode */
        SkillMode?: (number|null);

        /** Role_proto PkMode */
        PkMode?: (number|null);

        /** Role_proto ZmGx */
        ZmGx?: (number|null);

        /** Role_proto WorldLv */
        WorldLv?: (number|null);

        /** Role_proto NormalAtkSkillId */
        NormalAtkSkillId?: (number|null);

        /** Role_proto MuPoint */
        MuPoint?: (number|Long|null);

        /** Role_proto DsLv */
        DsLv?: (number|null);

        /** Role_proto MoveInterval */
        MoveInterval?: (number|null);

        /** Role_proto Id */
        Id?: (number|Long|null);

        /** Role_proto ZsNum */
        ZsNum?: (number|null);

        /** Role_proto TzSet */
        TzSet?: (number[]|null);

        /** Role_proto HasLockPass */
        HasLockPass?: (boolean|null);

        /** Role_proto ChengHao */
        ChengHao?: ({ [k: string]: number }|null);

        /** Role_proto ChIdLv */
        ChIdLv?: (number[]|null);

        /** Role_proto CreateTime */
        CreateTime?: (number|Long|null);

        /** Role_proto LtVip */
        LtVip?: (boolean|null);

        /** Role_proto DefaultCk */
        DefaultCk?: (number|Long|null);

        /** Role_proto Sid */
        Sid?: (string|null);

        /** Role_proto GotJf */
        GotJf?: (number|null);

        /** Role_proto IsByAccount */
        IsByAccount?: (boolean|null);

        /** Role_proto DiaRate */
        DiaRate?: (number|null);

        /** Role_proto IsYkMode */
        IsYkMode?: (boolean|null);

        /** Role_proto OpenDayNum */
        OpenDayNum?: (number|null);
    }

    /** Represents a Role_proto. */
    class Role_proto implements IRole_proto {

        /**
         * Constructs a new Role_proto.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IRole_proto);

        /** Role_proto Name. */
        public Name: string;

        /** Role_proto RoomId. */
        public RoomId: number;

        /** Role_proto LineId. */
        public LineId: string;

        /** Role_proto Lv. */
        public Lv: number;

        /** Role_proto Zm. */
        public Zm: string;

        /** Role_proto BaseYk. */
        public BaseYk: (number|Long);

        /** Role_proto GoldYk. */
        public GoldYk: (number|Long);

        /** Role_proto Gold. */
        public Gold: (number|Long);

        /** Role_proto Dia. */
        public Dia: (number|Long);

        /** Role_proto I. */
        public I: number;

        /** Role_proto J. */
        public J: number;

        /** Role_proto TeamId. */
        public TeamId: number;

        /** Role_proto Exp. */
        public Exp: (number|Long);

        /** Role_proto MaxExp. */
        public MaxExp: (number|Long);

        /** Role_proto IsAuto. */
        public IsAuto: boolean;

        /** Role_proto RoleType. */
        public RoleType: number;

        /** Role_proto SkillLvs. */
        public SkillLvs: { [k: string]: number };

        /** Role_proto SkillSlots0. */
        public SkillSlots0: number[];

        /** Role_proto SkillSlots1. */
        public SkillSlots1: number[];

        /** Role_proto SkillSlots2. */
        public SkillSlots2: number[];

        /** Role_proto SkillMode. */
        public SkillMode: number;

        /** Role_proto PkMode. */
        public PkMode: number;

        /** Role_proto ZmGx. */
        public ZmGx: number;

        /** Role_proto WorldLv. */
        public WorldLv: number;

        /** Role_proto NormalAtkSkillId. */
        public NormalAtkSkillId: number;

        /** Role_proto MuPoint. */
        public MuPoint: (number|Long);

        /** Role_proto DsLv. */
        public DsLv: number;

        /** Role_proto MoveInterval. */
        public MoveInterval: number;

        /** Role_proto Id. */
        public Id: (number|Long);

        /** Role_proto ZsNum. */
        public ZsNum: number;

        /** Role_proto TzSet. */
        public TzSet: number[];

        /** Role_proto HasLockPass. */
        public HasLockPass: boolean;

        /** Role_proto ChengHao. */
        public ChengHao: { [k: string]: number };

        /** Role_proto ChIdLv. */
        public ChIdLv: number[];

        /** Role_proto CreateTime. */
        public CreateTime: (number|Long);

        /** Role_proto LtVip. */
        public LtVip: boolean;

        /** Role_proto DefaultCk. */
        public DefaultCk: (number|Long);

        /** Role_proto Sid. */
        public Sid: string;

        /** Role_proto GotJf. */
        public GotJf: number;

        /** Role_proto IsByAccount. */
        public IsByAccount: boolean;

        /** Role_proto DiaRate. */
        public DiaRate: number;

        /** Role_proto IsYkMode. */
        public IsYkMode: boolean;

        /** Role_proto OpenDayNum. */
        public OpenDayNum: number;

        /**
         * Creates a new Role_proto instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Role_proto instance
         */
        public static create(properties?: outer_pb.IRole_proto): outer_pb.Role_proto;

        /**
         * Encodes the specified Role_proto message. Does not implicitly {@link outer_pb.Role_proto.verify|verify} messages.
         * @param message Role_proto message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IRole_proto, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a Role_proto message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Role_proto
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.Role_proto;
    }

    /** Properties of a FbHistory. */
    interface IFbHistory {

        /** FbHistory Exp */
        Exp?: (number|Long|null);

        /** FbHistory Nums */
        Nums?: ({ [k: string]: number }|null);

        /** FbHistory Lv */
        Lv?: (number|null);

        /** FbHistory Boss */
        Boss?: (number[]|null);

        /** FbHistory LineLv */
        LineLv?: (number|null);
    }

    /** Represents a FbHistory. */
    class FbHistory implements IFbHistory {

        /**
         * Constructs a new FbHistory.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IFbHistory);

        /** FbHistory Exp. */
        public Exp: (number|Long);

        /** FbHistory Nums. */
        public Nums: { [k: string]: number };

        /** FbHistory Lv. */
        public Lv: number;

        /** FbHistory Boss. */
        public Boss: number[];

        /** FbHistory LineLv. */
        public LineLv: number;

        /**
         * Creates a new FbHistory instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FbHistory instance
         */
        public static create(properties?: outer_pb.IFbHistory): outer_pb.FbHistory;

        /**
         * Encodes the specified FbHistory message. Does not implicitly {@link outer_pb.FbHistory.verify|verify} messages.
         * @param message FbHistory message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IFbHistory, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a FbHistory message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FbHistory
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.FbHistory;
    }

    /** Properties of an AddPoint. */
    interface IAddPoint {

        /** AddPoint AddLL */
        AddLL?: (number|null);

        /** AddPoint AddMJ */
        AddMJ?: (number|null);

        /** AddPoint AddTL */
        AddTL?: (number|null);

        /** AddPoint AddZL */
        AddZL?: (number|null);

        /** AddPoint AddTS */
        AddTS?: (number|null);

        /** AddPoint ErrCode */
        ErrCode?: (number|null);

        /** AddPoint BasePros */
        BasePros?: (outer_pb.IBasePros|null);

        /** AddPoint Dia */
        Dia?: (number|null);
    }

    /** Represents an AddPoint. */
    class AddPoint implements IAddPoint {

        /**
         * Constructs a new AddPoint.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IAddPoint);

        /** AddPoint AddLL. */
        public AddLL: number;

        /** AddPoint AddMJ. */
        public AddMJ: number;

        /** AddPoint AddTL. */
        public AddTL: number;

        /** AddPoint AddZL. */
        public AddZL: number;

        /** AddPoint AddTS. */
        public AddTS: number;

        /** AddPoint ErrCode. */
        public ErrCode: number;

        /** AddPoint BasePros. */
        public BasePros?: (outer_pb.IBasePros|null);

        /** AddPoint Dia. */
        public Dia: number;

        /**
         * Creates a new AddPoint instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AddPoint instance
         */
        public static create(properties?: outer_pb.IAddPoint): outer_pb.AddPoint;

        /**
         * Encodes the specified AddPoint message. Does not implicitly {@link outer_pb.AddPoint.verify|verify} messages.
         * @param message AddPoint message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IAddPoint, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes an AddPoint message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AddPoint
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.AddPoint;
    }

    /** Properties of a BasePros. */
    interface IBasePros {

        /** BasePros FreePoint */
        FreePoint?: (number|null);

        /** BasePros MinAtk */
        MinAtk?: (number|null);

        /** BasePros MaxAtk */
        MaxAtk?: (number|null);

        /** BasePros AtkUp */
        AtkUp?: (number|null);

        /** BasePros MinZzAtk */
        MinZzAtk?: (number|null);

        /** BasePros MaxZzAtk */
        MaxZzAtk?: (number|null);

        /** BasePros ZzAtkUp */
        ZzAtkUp?: (number|null);

        /** BasePros MinMagicAtk */
        MinMagicAtk?: (number|null);

        /** BasePros MaxMagicAtk */
        MaxMagicAtk?: (number|null);

        /** BasePros MagicAtkUp */
        MagicAtkUp?: (number|null);

        /** BasePros AtkRate */
        AtkRate?: (number|null);

        /** BasePros Def */
        Def?: (number|null);

        /** BasePros DefRate */
        DefRate?: (number|null);

        /** BasePros AddPvPDef */
        AddPvPDef?: (number|null);

        /** BasePros AddPvPDefRate */
        AddPvPDefRate?: (number|null);

        /** BasePros AddPvPAtk */
        AddPvPAtk?: (number|null);

        /** BasePros AddPvPAtkRate */
        AddPvPAtkRate?: (number|null);

        /** BasePros MaxHp */
        MaxHp?: (number|null);

        /** BasePros MaxMp */
        MaxMp?: (number|null);

        /** BasePros MaxAg */
        MaxAg?: (number|null);

        /** BasePros MaxSd */
        MaxSd?: (number|null);

        /** BasePros AllSpeed */
        AllSpeed?: (number|null);

        /** BasePros AtkCd */
        AtkCd?: (number|null);

        /** BasePros CurHp */
        CurHp?: (number|null);

        /** BasePros CurMp */
        CurMp?: (number|null);

        /** BasePros CurAg */
        CurAg?: (number|null);

        /** BasePros CurSd */
        CurSd?: (number|null);

        /** BasePros MaxHpUp */
        MaxHpUp?: (number|null);

        /** BasePros MaxMpUp */
        MaxMpUp?: (number|null);

        /** BasePros MaxAgUp */
        MaxAgUp?: (number|null);

        /** BasePros MaxSdUp */
        MaxSdUp?: (number|null);

        /** BasePros MaxAtkUp */
        MaxAtkUp?: (number|null);

        /** BasePros AtkRateUp */
        AtkRateUp?: (number|null);

        /** BasePros MinMagicAtkUp */
        MinMagicAtkUp?: (number|null);

        /** BasePros DefUp */
        DefUp?: (number|null);

        /** BasePros DefRateUp */
        DefRateUp?: (number|null);

        /** BasePros SkillDmgUp */
        SkillDmgUp?: (number|null);

        /** BasePros YsPros */
        YsPros?: ({ [k: string]: number }|null);

        /** BasePros YsAtks */
        YsAtks?: ({ [k: string]: number }|null);

        /** BasePros YsDefs */
        YsDefs?: ({ [k: string]: number }|null);

        /** BasePros GsPoint */
        GsPoint?: (number|null);

        /** BasePros LL */
        LL?: (number|null);

        /** BasePros MJ */
        MJ?: (number|null);

        /** BasePros TL */
        TL?: (number|null);

        /** BasePros ZL */
        ZL?: (number|null);

        /** BasePros TS */
        TS?: (number|null);

        /** BasePros RoleTypeLv */
        RoleTypeLv?: (number|null);

        /** BasePros AddSkillLv */
        AddSkillLv?: (number|null);

        /** BasePros AllLL */
        AllLL?: (number|null);

        /** BasePros AllMJ */
        AllMJ?: (number|null);

        /** BasePros AllTL */
        AllTL?: (number|null);

        /** BasePros AllZL */
        AllZL?: (number|null);

        /** BasePros AllTS */
        AllTS?: (number|null);

        /** BasePros RedPoint */
        RedPoint?: (number|null);

        /** BasePros EnemyList */
        EnemyList?: ({ [k: string]: (number|Long) }|null);

        /** BasePros HuDunTime */
        HuDunTime?: (number|Long|null);

        /** BasePros ExpUp */
        ExpUp?: (number|null);

        /** BasePros GetLjNum */
        GetLjNum?: (number|null);

        /** BasePros GetLjUp */
        GetLjUp?: (number|null);

        /** BasePros LjValue */
        LjValue?: (number|null);

        /** BasePros Skills */
        Skills?: ({ [k: string]: number }|null);

        /** BasePros TaoDef */
        TaoDef?: (number|null);

        /** BasePros TaoDefRate */
        TaoDefRate?: (number|null);

        /** BasePros Type */
        Type?: (number|null);

        /** BasePros IsDia */
        IsDia?: (boolean|null);

        /** BasePros Time */
        Time?: (number|Long|null);
    }

    /** Represents a BasePros. */
    class BasePros implements IBasePros {

        /**
         * Constructs a new BasePros.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IBasePros);

        /** BasePros FreePoint. */
        public FreePoint: number;

        /** BasePros MinAtk. */
        public MinAtk: number;

        /** BasePros MaxAtk. */
        public MaxAtk: number;

        /** BasePros AtkUp. */
        public AtkUp: number;

        /** BasePros MinZzAtk. */
        public MinZzAtk: number;

        /** BasePros MaxZzAtk. */
        public MaxZzAtk: number;

        /** BasePros ZzAtkUp. */
        public ZzAtkUp: number;

        /** BasePros MinMagicAtk. */
        public MinMagicAtk: number;

        /** BasePros MaxMagicAtk. */
        public MaxMagicAtk: number;

        /** BasePros MagicAtkUp. */
        public MagicAtkUp: number;

        /** BasePros AtkRate. */
        public AtkRate: number;

        /** BasePros Def. */
        public Def: number;

        /** BasePros DefRate. */
        public DefRate: number;

        /** BasePros AddPvPDef. */
        public AddPvPDef: number;

        /** BasePros AddPvPDefRate. */
        public AddPvPDefRate: number;

        /** BasePros AddPvPAtk. */
        public AddPvPAtk: number;

        /** BasePros AddPvPAtkRate. */
        public AddPvPAtkRate: number;

        /** BasePros MaxHp. */
        public MaxHp: number;

        /** BasePros MaxMp. */
        public MaxMp: number;

        /** BasePros MaxAg. */
        public MaxAg: number;

        /** BasePros MaxSd. */
        public MaxSd: number;

        /** BasePros AllSpeed. */
        public AllSpeed: number;

        /** BasePros AtkCd. */
        public AtkCd: number;

        /** BasePros CurHp. */
        public CurHp: number;

        /** BasePros CurMp. */
        public CurMp: number;

        /** BasePros CurAg. */
        public CurAg: number;

        /** BasePros CurSd. */
        public CurSd: number;

        /** BasePros MaxHpUp. */
        public MaxHpUp: number;

        /** BasePros MaxMpUp. */
        public MaxMpUp: number;

        /** BasePros MaxAgUp. */
        public MaxAgUp: number;

        /** BasePros MaxSdUp. */
        public MaxSdUp: number;

        /** BasePros MaxAtkUp. */
        public MaxAtkUp: number;

        /** BasePros AtkRateUp. */
        public AtkRateUp: number;

        /** BasePros MinMagicAtkUp. */
        public MinMagicAtkUp: number;

        /** BasePros DefUp. */
        public DefUp: number;

        /** BasePros DefRateUp. */
        public DefRateUp: number;

        /** BasePros SkillDmgUp. */
        public SkillDmgUp: number;

        /** BasePros YsPros. */
        public YsPros: { [k: string]: number };

        /** BasePros YsAtks. */
        public YsAtks: { [k: string]: number };

        /** BasePros YsDefs. */
        public YsDefs: { [k: string]: number };

        /** BasePros GsPoint. */
        public GsPoint: number;

        /** BasePros LL. */
        public LL: number;

        /** BasePros MJ. */
        public MJ: number;

        /** BasePros TL. */
        public TL: number;

        /** BasePros ZL. */
        public ZL: number;

        /** BasePros TS. */
        public TS: number;

        /** BasePros RoleTypeLv. */
        public RoleTypeLv: number;

        /** BasePros AddSkillLv. */
        public AddSkillLv: number;

        /** BasePros AllLL. */
        public AllLL: number;

        /** BasePros AllMJ. */
        public AllMJ: number;

        /** BasePros AllTL. */
        public AllTL: number;

        /** BasePros AllZL. */
        public AllZL: number;

        /** BasePros AllTS. */
        public AllTS: number;

        /** BasePros RedPoint. */
        public RedPoint: number;

        /** BasePros EnemyList. */
        public EnemyList: { [k: string]: (number|Long) };

        /** BasePros HuDunTime. */
        public HuDunTime: (number|Long);

        /** BasePros ExpUp. */
        public ExpUp: number;

        /** BasePros GetLjNum. */
        public GetLjNum: number;

        /** BasePros GetLjUp. */
        public GetLjUp: number;

        /** BasePros LjValue. */
        public LjValue: number;

        /** BasePros Skills. */
        public Skills: { [k: string]: number };

        /** BasePros TaoDef. */
        public TaoDef: number;

        /** BasePros TaoDefRate. */
        public TaoDefRate: number;

        /** BasePros Type. */
        public Type: number;

        /** BasePros IsDia. */
        public IsDia: boolean;

        /** BasePros Time. */
        public Time: (number|Long);

        /**
         * Creates a new BasePros instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BasePros instance
         */
        public static create(properties?: outer_pb.IBasePros): outer_pb.BasePros;

        /**
         * Encodes the specified BasePros message. Does not implicitly {@link outer_pb.BasePros.verify|verify} messages.
         * @param message BasePros message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IBasePros, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a BasePros message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BasePros
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.BasePros;
    }

    /** Properties of a SkillInfo. */
    interface ISkillInfo {

        /** SkillInfo Id */
        Id?: (number|null);

        /** SkillInfo Lv */
        Lv?: (number|null);
    }

    /** Represents a SkillInfo. */
    class SkillInfo implements ISkillInfo {

        /**
         * Constructs a new SkillInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ISkillInfo);

        /** SkillInfo Id. */
        public Id: number;

        /** SkillInfo Lv. */
        public Lv: number;

        /**
         * Creates a new SkillInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SkillInfo instance
         */
        public static create(properties?: outer_pb.ISkillInfo): outer_pb.SkillInfo;

        /**
         * Encodes the specified SkillInfo message. Does not implicitly {@link outer_pb.SkillInfo.verify|verify} messages.
         * @param message SkillInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ISkillInfo, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a SkillInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SkillInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.SkillInfo;
    }

    /** Properties of a SkillAct. */
    interface ISkillAct {

        /** SkillAct ErrCode */
        ErrCode?: (number|null);

        /** SkillAct Id */
        Id?: (number|null);

        /** SkillAct Lv */
        Lv?: (number|null);

        /** SkillAct Mode */
        Mode?: (number|null);

        /** SkillAct Slot0 */
        Slot0?: (number[]|null);

        /** SkillAct Slot1 */
        Slot1?: (number[]|null);

        /** SkillAct Slot2 */
        Slot2?: (number[]|null);

        /** SkillAct SkillLvs */
        SkillLvs?: ({ [k: string]: number }|null);

        /** SkillAct Items */
        Items?: ({ [k: string]: number }|null);
    }

    /** Represents a SkillAct. */
    class SkillAct implements ISkillAct {

        /**
         * Constructs a new SkillAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ISkillAct);

        /** SkillAct ErrCode. */
        public ErrCode: number;

        /** SkillAct Id. */
        public Id: number;

        /** SkillAct Lv. */
        public Lv: number;

        /** SkillAct Mode. */
        public Mode: number;

        /** SkillAct Slot0. */
        public Slot0: number[];

        /** SkillAct Slot1. */
        public Slot1: number[];

        /** SkillAct Slot2. */
        public Slot2: number[];

        /** SkillAct SkillLvs. */
        public SkillLvs: { [k: string]: number };

        /** SkillAct Items. */
        public Items: { [k: string]: number };

        /**
         * Creates a new SkillAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SkillAct instance
         */
        public static create(properties?: outer_pb.ISkillAct): outer_pb.SkillAct;

        /**
         * Encodes the specified SkillAct message. Does not implicitly {@link outer_pb.SkillAct.verify|verify} messages.
         * @param message SkillAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ISkillAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a SkillAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SkillAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.SkillAct;
    }

    /** Properties of a FocusAct. */
    interface IFocusAct {

        /** FocusAct IsFocus */
        IsFocus?: (boolean|null);

        /** FocusAct Shops */
        Shops?: (outer_pb.IOtherRoleInfo[]|null);

        /** FocusAct CurHp */
        CurHp?: (number|null);

        /** FocusAct CurMp */
        CurMp?: (number|null);

        /** FocusAct MaxHp */
        MaxHp?: (number|null);

        /** FocusAct MaxMp */
        MaxMp?: (number|null);

        /** FocusAct Ag */
        Ag?: (number|null);

        /** FocusAct MaxAg */
        MaxAg?: (number|null);

        /** FocusAct Sd */
        Sd?: (number|null);

        /** FocusAct MaxSd */
        MaxSd?: (number|null);

        /** FocusAct Gold */
        Gold?: (number|Long|null);

        /** FocusAct Lv */
        Lv?: (number|null);

        /** FocusAct Exp */
        Exp?: (number|Long|null);

        /** FocusAct MaxExp */
        MaxExp?: (number|Long|null);

        /** FocusAct OtherList */
        OtherList?: (outer_pb.IOtherRoleInfo[]|null);

        /** FocusAct MonsterList */
        MonsterList?: (outer_pb.IMonsterInfo[]|null);

        /** FocusAct DropItemList */
        DropItemList?: (outer_pb.IDropItem[]|null);

        /** FocusAct I */
        I?: (number|null);

        /** FocusAct J */
        J?: (number|null);

        /** FocusAct TeamId */
        TeamId?: (number|null);

        /** FocusAct PrivateMsgs */
        PrivateMsgs?: (outer_pb.IChatMsg[]|null);

        /** FocusAct Msgs */
        Msgs?: (outer_pb.IChatMsg[]|null);

        /** FocusAct Buffs */
        Buffs?: ({ [k: string]: outer_pb.IBuffInfo }|null);

        /** FocusAct Dia */
        Dia?: (number|Long|null);

        /** FocusAct MuPoint */
        MuPoint?: (number|Long|null);

        /** FocusAct State */
        State?: (number|null);

        /** FocusAct BagEquips */
        BagEquips?: ({ [k: string]: outer_pb.IEquip }|null);

        /** FocusAct BagItems */
        BagItems?: ({ [k: string]: number }|null);

        /** FocusAct PkMode */
        PkMode?: (number|null);

        /** FocusAct LoadQuest */
        LoadQuest?: (boolean|null);

        /** FocusAct ResetData */
        ResetData?: (outer_pb.IResetData|null);

        /** FocusAct GotExp */
        GotExp?: (number|Long|null);

        /** FocusAct GotGold */
        GotGold?: (number|null);

        /** FocusAct GotCp */
        GotCp?: (number|null);

        /** FocusAct GotEquipNum */
        GotEquipNum?: (number|null);

        /** FocusAct GotZyNum */
        GotZyNum?: (number|null);

        /** FocusAct GotItems */
        GotItems?: ({ [k: string]: number }|null);

        /** FocusAct TgTime */
        TgTime?: (number|null);

        /** FocusAct LianTiPros */
        LianTiPros?: (number[]|null);

        /** FocusAct XqPros */
        XqPros?: ({ [k: string]: outer_pb.IXqPros }|null);

        /** FocusAct DsLv */
        DsLv?: (number|null);

        /** FocusAct ZsNum */
        ZsNum?: (number|null);

        /** FocusAct HasBoss */
        HasBoss?: (boolean|null);

        /** FocusAct LjValue */
        LjValue?: (number|null);

        /** FocusAct ExpRate */
        ExpRate?: (number|null);

        /** FocusAct SysGG */
        SysGG?: (outer_pb.ISysGG|null);

        /** FocusAct FreePoint */
        FreePoint?: (number|null);

        /** FocusAct DeathNum */
        DeathNum?: (number|null);

        /** FocusAct ReduceExp */
        ReduceExp?: (number|Long|null);

        /** FocusAct LineLv */
        LineLv?: (number|null);

        /** FocusAct LastSysGGT */
        LastSysGGT?: (number|Long|null);

        /** FocusAct IsPk */
        IsPk?: (boolean|null);

        /** FocusAct Emails */
        Emails?: ({ [k: string]: outer_pb.IEmail }|null);

        /** FocusAct TowerLv */
        TowerLv?: (number|null);

        /** FocusAct KfTime */
        KfTime?: (number|null);

        /** FocusAct HdName */
        HdName?: (string|null);

        /** FocusAct HdStopTime */
        HdStopTime?: (number|Long|null);
    }

    /** Represents a FocusAct. */
    class FocusAct implements IFocusAct {

        /**
         * Constructs a new FocusAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IFocusAct);

        /** FocusAct IsFocus. */
        public IsFocus: boolean;

        /** FocusAct Shops. */
        public Shops: outer_pb.IOtherRoleInfo[];

        /** FocusAct CurHp. */
        public CurHp: number;

        /** FocusAct CurMp. */
        public CurMp: number;

        /** FocusAct MaxHp. */
        public MaxHp: number;

        /** FocusAct MaxMp. */
        public MaxMp: number;

        /** FocusAct Ag. */
        public Ag: number;

        /** FocusAct MaxAg. */
        public MaxAg: number;

        /** FocusAct Sd. */
        public Sd: number;

        /** FocusAct MaxSd. */
        public MaxSd: number;

        /** FocusAct Gold. */
        public Gold: (number|Long);

        /** FocusAct Lv. */
        public Lv: number;

        /** FocusAct Exp. */
        public Exp: (number|Long);

        /** FocusAct MaxExp. */
        public MaxExp: (number|Long);

        /** FocusAct OtherList. */
        public OtherList: outer_pb.IOtherRoleInfo[];

        /** FocusAct MonsterList. */
        public MonsterList: outer_pb.IMonsterInfo[];

        /** FocusAct DropItemList. */
        public DropItemList: outer_pb.IDropItem[];

        /** FocusAct I. */
        public I: number;

        /** FocusAct J. */
        public J: number;

        /** FocusAct TeamId. */
        public TeamId: number;

        /** FocusAct PrivateMsgs. */
        public PrivateMsgs: outer_pb.IChatMsg[];

        /** FocusAct Msgs. */
        public Msgs: outer_pb.IChatMsg[];

        /** FocusAct Buffs. */
        public Buffs: { [k: string]: outer_pb.IBuffInfo };

        /** FocusAct Dia. */
        public Dia: (number|Long);

        /** FocusAct MuPoint. */
        public MuPoint: (number|Long);

        /** FocusAct State. */
        public State: number;

        /** FocusAct BagEquips. */
        public BagEquips: { [k: string]: outer_pb.IEquip };

        /** FocusAct BagItems. */
        public BagItems: { [k: string]: number };

        /** FocusAct PkMode. */
        public PkMode: number;

        /** FocusAct LoadQuest. */
        public LoadQuest: boolean;

        /** FocusAct ResetData. */
        public ResetData?: (outer_pb.IResetData|null);

        /** FocusAct GotExp. */
        public GotExp: (number|Long);

        /** FocusAct GotGold. */
        public GotGold: number;

        /** FocusAct GotCp. */
        public GotCp: number;

        /** FocusAct GotEquipNum. */
        public GotEquipNum: number;

        /** FocusAct GotZyNum. */
        public GotZyNum: number;

        /** FocusAct GotItems. */
        public GotItems: { [k: string]: number };

        /** FocusAct TgTime. */
        public TgTime: number;

        /** FocusAct LianTiPros. */
        public LianTiPros: number[];

        /** FocusAct XqPros. */
        public XqPros: { [k: string]: outer_pb.IXqPros };

        /** FocusAct DsLv. */
        public DsLv: number;

        /** FocusAct ZsNum. */
        public ZsNum: number;

        /** FocusAct HasBoss. */
        public HasBoss: boolean;

        /** FocusAct LjValue. */
        public LjValue: number;

        /** FocusAct ExpRate. */
        public ExpRate: number;

        /** FocusAct SysGG. */
        public SysGG?: (outer_pb.ISysGG|null);

        /** FocusAct FreePoint. */
        public FreePoint: number;

        /** FocusAct DeathNum. */
        public DeathNum: number;

        /** FocusAct ReduceExp. */
        public ReduceExp: (number|Long);

        /** FocusAct LineLv. */
        public LineLv: number;

        /** FocusAct LastSysGGT. */
        public LastSysGGT: (number|Long);

        /** FocusAct IsPk. */
        public IsPk: boolean;

        /** FocusAct Emails. */
        public Emails: { [k: string]: outer_pb.IEmail };

        /** FocusAct TowerLv. */
        public TowerLv: number;

        /** FocusAct KfTime. */
        public KfTime: number;

        /** FocusAct HdName. */
        public HdName: string;

        /** FocusAct HdStopTime. */
        public HdStopTime: (number|Long);

        /**
         * Creates a new FocusAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FocusAct instance
         */
        public static create(properties?: outer_pb.IFocusAct): outer_pb.FocusAct;

        /**
         * Encodes the specified FocusAct message. Does not implicitly {@link outer_pb.FocusAct.verify|verify} messages.
         * @param message FocusAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IFocusAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a FocusAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FocusAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.FocusAct;
    }

    /** Properties of a HuoDongAct. */
    interface IHuoDongAct {

        /** HuoDongAct ErrCode */
        ErrCode?: (number|null);

        /** HuoDongAct HdName */
        HdName?: (string|null);

        /** HuoDongAct HdStopTime */
        HdStopTime?: (number|Long|null);

        /** HuoDongAct History */
        History?: (string[]|null);

        /** HuoDongAct Items */
        Items?: ({ [k: string]: number }|null);

        /** HuoDongAct Num */
        Num?: (number|null);

        /** HuoDongAct ExpRate */
        ExpRate?: (number|null);

        /** HuoDongAct Jf */
        Jf?: (number|null);

        /** HuoDongAct Index */
        Index?: (number|null);

        /** HuoDongAct Type */
        Type?: (number|null);

        /** HuoDongAct HcPh */
        HcPh?: (outer_pb.IHcPhInfo[]|null);

        /** HuoDongAct Has */
        Has?: (boolean|null);
    }

    /** Represents a HuoDongAct. */
    class HuoDongAct implements IHuoDongAct {

        /**
         * Constructs a new HuoDongAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IHuoDongAct);

        /** HuoDongAct ErrCode. */
        public ErrCode: number;

        /** HuoDongAct HdName. */
        public HdName: string;

        /** HuoDongAct HdStopTime. */
        public HdStopTime: (number|Long);

        /** HuoDongAct History. */
        public History: string[];

        /** HuoDongAct Items. */
        public Items: { [k: string]: number };

        /** HuoDongAct Num. */
        public Num: number;

        /** HuoDongAct ExpRate. */
        public ExpRate: number;

        /** HuoDongAct Jf. */
        public Jf: number;

        /** HuoDongAct Index. */
        public Index: number;

        /** HuoDongAct Type. */
        public Type: number;

        /** HuoDongAct HcPh. */
        public HcPh: outer_pb.IHcPhInfo[];

        /** HuoDongAct Has. */
        public Has: boolean;

        /**
         * Creates a new HuoDongAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HuoDongAct instance
         */
        public static create(properties?: outer_pb.IHuoDongAct): outer_pb.HuoDongAct;

        /**
         * Encodes the specified HuoDongAct message. Does not implicitly {@link outer_pb.HuoDongAct.verify|verify} messages.
         * @param message HuoDongAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IHuoDongAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a HuoDongAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HuoDongAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.HuoDongAct;
    }

    /** Properties of a HcPhInfo. */
    interface IHcPhInfo {

        /** HcPhInfo Name */
        Name?: (string|null);

        /** HcPhInfo Time */
        Time?: (number|Long|null);

        /** HcPhInfo Id */
        Id?: (number|Long|null);

        /** HcPhInfo HasGot */
        HasGot?: (boolean|null);
    }

    /** Represents a HcPhInfo. */
    class HcPhInfo implements IHcPhInfo {

        /**
         * Constructs a new HcPhInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IHcPhInfo);

        /** HcPhInfo Name. */
        public Name: string;

        /** HcPhInfo Time. */
        public Time: (number|Long);

        /** HcPhInfo Id. */
        public Id: (number|Long);

        /** HcPhInfo HasGot. */
        public HasGot: boolean;

        /**
         * Creates a new HcPhInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HcPhInfo instance
         */
        public static create(properties?: outer_pb.IHcPhInfo): outer_pb.HcPhInfo;

        /**
         * Encodes the specified HcPhInfo message. Does not implicitly {@link outer_pb.HcPhInfo.verify|verify} messages.
         * @param message HcPhInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IHcPhInfo, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a HcPhInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HcPhInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.HcPhInfo;
    }

    /** Properties of a ResetData. */
    interface IResetData {

        /** ResetData MainQuest */
        MainQuest?: (outer_pb.IMainQuest|null);

        /** ResetData CircleQuest */
        CircleQuest?: (outer_pb.ICircleQuest|null);

        /** ResetData DayQuests */
        DayQuests?: (outer_pb.IDayQuest[]|null);

        /** ResetData DayQuestJF */
        DayQuestJF?: (number|null);

        /** ResetData ResetDay */
        ResetDay?: (number|null);

        /** ResetData Fb_em */
        Fb_em?: (outer_pb.IFbHistory|null);

        /** ResetData Fb_xs */
        Fb_xs?: (outer_pb.IFbHistory|null);

        /** ResetData FbNums */
        FbNums?: (number[]|null);

        /** ResetData CjQuests */
        CjQuests?: (outer_pb.IMainQuest[]|null);
    }

    /** Represents a ResetData. */
    class ResetData implements IResetData {

        /**
         * Constructs a new ResetData.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IResetData);

        /** ResetData MainQuest. */
        public MainQuest?: (outer_pb.IMainQuest|null);

        /** ResetData CircleQuest. */
        public CircleQuest?: (outer_pb.ICircleQuest|null);

        /** ResetData DayQuests. */
        public DayQuests: outer_pb.IDayQuest[];

        /** ResetData DayQuestJF. */
        public DayQuestJF: number;

        /** ResetData ResetDay. */
        public ResetDay: number;

        /** ResetData Fb_em. */
        public Fb_em?: (outer_pb.IFbHistory|null);

        /** ResetData Fb_xs. */
        public Fb_xs?: (outer_pb.IFbHistory|null);

        /** ResetData FbNums. */
        public FbNums: number[];

        /** ResetData CjQuests. */
        public CjQuests: outer_pb.IMainQuest[];

        /**
         * Creates a new ResetData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ResetData instance
         */
        public static create(properties?: outer_pb.IResetData): outer_pb.ResetData;

        /**
         * Encodes the specified ResetData message. Does not implicitly {@link outer_pb.ResetData.verify|verify} messages.
         * @param message ResetData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IResetData, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a ResetData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ResetData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.ResetData;
    }

    /** Properties of a MainQuest. */
    interface IMainQuest {

        /** MainQuest TaskId */
        TaskId?: (number|null);

        /** MainQuest Num */
        Num?: (number|null);

        /** MainQuest State */
        State?: (number|null);
    }

    /** Represents a MainQuest. */
    class MainQuest implements IMainQuest {

        /**
         * Constructs a new MainQuest.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IMainQuest);

        /** MainQuest TaskId. */
        public TaskId: number;

        /** MainQuest Num. */
        public Num: number;

        /** MainQuest State. */
        public State: number;

        /**
         * Creates a new MainQuest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MainQuest instance
         */
        public static create(properties?: outer_pb.IMainQuest): outer_pb.MainQuest;

        /**
         * Encodes the specified MainQuest message. Does not implicitly {@link outer_pb.MainQuest.verify|verify} messages.
         * @param message MainQuest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IMainQuest, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a MainQuest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MainQuest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.MainQuest;
    }

    /** Properties of a DayQuest. */
    interface IDayQuest {

        /** DayQuest TaskId */
        TaskId?: (number|null);

        /** DayQuest Num */
        Num?: (number|null);

        /** DayQuest State */
        State?: (number|null);

        /** DayQuest ResetDay */
        ResetDay?: (number|null);
    }

    /** Represents a DayQuest. */
    class DayQuest implements IDayQuest {

        /**
         * Constructs a new DayQuest.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IDayQuest);

        /** DayQuest TaskId. */
        public TaskId: number;

        /** DayQuest Num. */
        public Num: number;

        /** DayQuest State. */
        public State: number;

        /** DayQuest ResetDay. */
        public ResetDay: number;

        /**
         * Creates a new DayQuest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DayQuest instance
         */
        public static create(properties?: outer_pb.IDayQuest): outer_pb.DayQuest;

        /**
         * Encodes the specified DayQuest message. Does not implicitly {@link outer_pb.DayQuest.verify|verify} messages.
         * @param message DayQuest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IDayQuest, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a DayQuest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DayQuest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.DayQuest;
    }

    /** Properties of a CircleQuest. */
    interface ICircleQuest {

        /** CircleQuest TaskId */
        TaskId?: (number|null);

        /** CircleQuest Num */
        Num?: (number|null);

        /** CircleQuest State */
        State?: (number|null);

        /** CircleQuest Step */
        Step?: (number|null);

        /** CircleQuest QuestLv */
        QuestLv?: (string|null);

        /** CircleQuest Count */
        Count?: (number|null);

        /** CircleQuest JF */
        JF?: (number|null);
    }

    /** Represents a CircleQuest. */
    class CircleQuest implements ICircleQuest {

        /**
         * Constructs a new CircleQuest.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ICircleQuest);

        /** CircleQuest TaskId. */
        public TaskId: number;

        /** CircleQuest Num. */
        public Num: number;

        /** CircleQuest State. */
        public State: number;

        /** CircleQuest Step. */
        public Step: number;

        /** CircleQuest QuestLv. */
        public QuestLv: string;

        /** CircleQuest Count. */
        public Count: number;

        /** CircleQuest JF. */
        public JF: number;

        /**
         * Creates a new CircleQuest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CircleQuest instance
         */
        public static create(properties?: outer_pb.ICircleQuest): outer_pb.CircleQuest;

        /**
         * Encodes the specified CircleQuest message. Does not implicitly {@link outer_pb.CircleQuest.verify|verify} messages.
         * @param message CircleQuest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ICircleQuest, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a CircleQuest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CircleQuest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.CircleQuest;
    }

    /** Properties of a UseItemAct. */
    interface IUseItemAct {

        /** UseItemAct ErrCode */
        ErrCode?: (number|null);

        /** UseItemAct Id */
        Id?: (number|null);

        /** UseItemAct Num */
        Num?: (number|null);

        /** UseItemAct AddHp */
        AddHp?: (number|null);

        /** UseItemAct AddMp */
        AddMp?: (number|null);

        /** UseItemAct Index */
        Index?: (number|null);

        /** UseItemAct LineLv */
        LineLv?: (number|null);

        /** UseItemAct Equips */
        Equips?: (outer_pb.IEquip[]|null);

        /** UseItemAct Items */
        Items?: ({ [k: string]: number }|null);

        /** UseItemAct Who */
        Who?: (number|Long|null);

        /** UseItemAct BasePros */
        BasePros?: (outer_pb.IBasePros|null);

        /** UseItemAct Msg */
        Msg?: (string|null);

        /** UseItemAct MyBoss */
        MyBoss?: ({ [k: string]: outer_pb.IMyBoss }|null);

        /** UseItemAct MonsterLv */
        MonsterLv?: (number|null);

        /** UseItemAct IsDia */
        IsDia?: (boolean|null);

        /** UseItemAct FbNums */
        FbNums?: (number[]|null);

        /** UseItemAct CostDia */
        CostDia?: (number|null);

        /** UseItemAct ChIdLv */
        ChIdLv?: (number[]|null);

        /** UseItemAct CurHp */
        CurHp?: (number|null);

        /** UseItemAct Type */
        Type?: (number|null);

        /** UseItemAct Time */
        Time?: (number|Long|null);
    }

    /** Represents a UseItemAct. */
    class UseItemAct implements IUseItemAct {

        /**
         * Constructs a new UseItemAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IUseItemAct);

        /** UseItemAct ErrCode. */
        public ErrCode: number;

        /** UseItemAct Id. */
        public Id: number;

        /** UseItemAct Num. */
        public Num: number;

        /** UseItemAct AddHp. */
        public AddHp: number;

        /** UseItemAct AddMp. */
        public AddMp: number;

        /** UseItemAct Index. */
        public Index: number;

        /** UseItemAct LineLv. */
        public LineLv: number;

        /** UseItemAct Equips. */
        public Equips: outer_pb.IEquip[];

        /** UseItemAct Items. */
        public Items: { [k: string]: number };

        /** UseItemAct Who. */
        public Who: (number|Long);

        /** UseItemAct BasePros. */
        public BasePros?: (outer_pb.IBasePros|null);

        /** UseItemAct Msg. */
        public Msg: string;

        /** UseItemAct MyBoss. */
        public MyBoss: { [k: string]: outer_pb.IMyBoss };

        /** UseItemAct MonsterLv. */
        public MonsterLv: number;

        /** UseItemAct IsDia. */
        public IsDia: boolean;

        /** UseItemAct FbNums. */
        public FbNums: number[];

        /** UseItemAct CostDia. */
        public CostDia: number;

        /** UseItemAct ChIdLv. */
        public ChIdLv: number[];

        /** UseItemAct CurHp. */
        public CurHp: number;

        /** UseItemAct Type. */
        public Type: number;

        /** UseItemAct Time. */
        public Time: (number|Long);

        /**
         * Creates a new UseItemAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UseItemAct instance
         */
        public static create(properties?: outer_pb.IUseItemAct): outer_pb.UseItemAct;

        /**
         * Encodes the specified UseItemAct message. Does not implicitly {@link outer_pb.UseItemAct.verify|verify} messages.
         * @param message UseItemAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IUseItemAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a UseItemAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UseItemAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.UseItemAct;
    }

    /** Properties of a YjKillWorldBoss. */
    interface IYjKillWorldBoss {

        /** YjKillWorldBoss ErrCode */
        ErrCode?: (number|null);

        /** YjKillWorldBoss Equips */
        Equips?: (outer_pb.IEquip[]|null);

        /** YjKillWorldBoss Items */
        Items?: ({ [k: string]: number }|null);

        /** YjKillWorldBoss Num */
        Num?: (number|null);

        /** YjKillWorldBoss Boss */
        Boss?: ({ [k: string]: number }|null);

        /** YjKillWorldBoss KillNums */
        KillNums?: (outer_pb.IKillNums|null);
    }

    /** Represents a YjKillWorldBoss. */
    class YjKillWorldBoss implements IYjKillWorldBoss {

        /**
         * Constructs a new YjKillWorldBoss.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IYjKillWorldBoss);

        /** YjKillWorldBoss ErrCode. */
        public ErrCode: number;

        /** YjKillWorldBoss Equips. */
        public Equips: outer_pb.IEquip[];

        /** YjKillWorldBoss Items. */
        public Items: { [k: string]: number };

        /** YjKillWorldBoss Num. */
        public Num: number;

        /** YjKillWorldBoss Boss. */
        public Boss: { [k: string]: number };

        /** YjKillWorldBoss KillNums. */
        public KillNums?: (outer_pb.IKillNums|null);

        /**
         * Creates a new YjKillWorldBoss instance using the specified properties.
         * @param [properties] Properties to set
         * @returns YjKillWorldBoss instance
         */
        public static create(properties?: outer_pb.IYjKillWorldBoss): outer_pb.YjKillWorldBoss;

        /**
         * Encodes the specified YjKillWorldBoss message. Does not implicitly {@link outer_pb.YjKillWorldBoss.verify|verify} messages.
         * @param message YjKillWorldBoss message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IYjKillWorldBoss, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a YjKillWorldBoss message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns YjKillWorldBoss
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.YjKillWorldBoss;
    }

    /** Properties of a JoinLineAct. */
    interface IJoinLineAct {

        /** JoinLineAct ErrCode */
        ErrCode?: (number|null);

        /** JoinLineAct RoomId */
        RoomId?: (number|null);

        /** JoinLineAct PointIndex */
        PointIndex?: (number|null);

        /** JoinLineAct LineId */
        LineId?: (string|null);

        /** JoinLineAct EndPos */
        EndPos?: (number[]|null);

        /** JoinLineAct LineLv */
        LineLv?: (number|null);

        /** JoinLineAct IsImmediate */
        IsImmediate?: (boolean|null);

        /** JoinLineAct IsJieGuan */
        IsJieGuan?: (boolean|null);

        /** JoinLineAct IsByDoor */
        IsByDoor?: (boolean|null);

        /** JoinLineAct WorldLv */
        WorldLv?: (number|null);

        /** JoinLineAct NeedDia */
        NeedDia?: (number|null);

        /** JoinLineAct DoorId */
        DoorId?: (number|null);

        /** JoinLineAct NeedId */
        NeedId?: (number|null);

        /** JoinLineAct NeedGold */
        NeedGold?: (number|null);

        /** JoinLineAct IdList */
        IdList?: ((number|Long)[]|null);

        /** JoinLineAct Cost */
        Cost?: (number|null);

        /** JoinLineAct IsByCall */
        IsByCall?: (boolean|null);

        /** JoinLineAct Shops */
        Shops?: (outer_pb.IOtherRoleInfo[]|null);

        /** JoinLineAct Mode */
        Mode?: (number|null);

        /** JoinLineAct Day */
        Day?: (number|null);

        /** JoinLineAct Sid */
        Sid?: (string|null);

        /** JoinLineAct Type */
        Type?: (number|null);
    }

    /** Represents a JoinLineAct. */
    class JoinLineAct implements IJoinLineAct {

        /**
         * Constructs a new JoinLineAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IJoinLineAct);

        /** JoinLineAct ErrCode. */
        public ErrCode: number;

        /** JoinLineAct RoomId. */
        public RoomId: number;

        /** JoinLineAct PointIndex. */
        public PointIndex: number;

        /** JoinLineAct LineId. */
        public LineId: string;

        /** JoinLineAct EndPos. */
        public EndPos: number[];

        /** JoinLineAct LineLv. */
        public LineLv: number;

        /** JoinLineAct IsImmediate. */
        public IsImmediate: boolean;

        /** JoinLineAct IsJieGuan. */
        public IsJieGuan: boolean;

        /** JoinLineAct IsByDoor. */
        public IsByDoor: boolean;

        /** JoinLineAct WorldLv. */
        public WorldLv: number;

        /** JoinLineAct NeedDia. */
        public NeedDia: number;

        /** JoinLineAct DoorId. */
        public DoorId: number;

        /** JoinLineAct NeedId. */
        public NeedId: number;

        /** JoinLineAct NeedGold. */
        public NeedGold: number;

        /** JoinLineAct IdList. */
        public IdList: (number|Long)[];

        /** JoinLineAct Cost. */
        public Cost: number;

        /** JoinLineAct IsByCall. */
        public IsByCall: boolean;

        /** JoinLineAct Shops. */
        public Shops: outer_pb.IOtherRoleInfo[];

        /** JoinLineAct Mode. */
        public Mode: number;

        /** JoinLineAct Day. */
        public Day: number;

        /** JoinLineAct Sid. */
        public Sid: string;

        /** JoinLineAct Type. */
        public Type: number;

        /**
         * Creates a new JoinLineAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns JoinLineAct instance
         */
        public static create(properties?: outer_pb.IJoinLineAct): outer_pb.JoinLineAct;

        /**
         * Encodes the specified JoinLineAct message. Does not implicitly {@link outer_pb.JoinLineAct.verify|verify} messages.
         * @param message JoinLineAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IJoinLineAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a JoinLineAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns JoinLineAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.JoinLineAct;
    }

    /** Properties of an UpdatePkEnemyList. */
    interface IUpdatePkEnemyList {

        /** UpdatePkEnemyList List */
        List?: ({ [k: string]: (number|Long) }|null);
    }

    /** Represents an UpdatePkEnemyList. */
    class UpdatePkEnemyList implements IUpdatePkEnemyList {

        /**
         * Constructs a new UpdatePkEnemyList.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IUpdatePkEnemyList);

        /** UpdatePkEnemyList List. */
        public List: { [k: string]: (number|Long) };

        /**
         * Creates a new UpdatePkEnemyList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UpdatePkEnemyList instance
         */
        public static create(properties?: outer_pb.IUpdatePkEnemyList): outer_pb.UpdatePkEnemyList;

        /**
         * Encodes the specified UpdatePkEnemyList message. Does not implicitly {@link outer_pb.UpdatePkEnemyList.verify|verify} messages.
         * @param message UpdatePkEnemyList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IUpdatePkEnemyList, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes an UpdatePkEnemyList message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UpdatePkEnemyList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.UpdatePkEnemyList;
    }

    /** Properties of an OtherRoleInfo. */
    interface IOtherRoleInfo {

        /** OtherRoleInfo Id */
        Id?: (number|Long|null);

        /** OtherRoleInfo Lv */
        Lv?: (number|null);

        /** OtherRoleInfo DsLv */
        DsLv?: (number|null);

        /** OtherRoleInfo Name */
        Name?: (string|null);

        /** OtherRoleInfo RoleType */
        RoleType?: (number|null);

        /** OtherRoleInfo I */
        I?: (number|null);

        /** OtherRoleInfo J */
        J?: (number|null);

        /** OtherRoleInfo CurHp */
        CurHp?: (number|null);

        /** OtherRoleInfo MaxHp */
        MaxHp?: (number|null);

        /** OtherRoleInfo MoveInterval */
        MoveInterval?: (number|null);

        /** OtherRoleInfo TeamId */
        TeamId?: (number|null);

        /** OtherRoleInfo Buffs */
        Buffs?: ({ [k: string]: outer_pb.IBuffInfo }|null);

        /** OtherRoleInfo CurSd */
        CurSd?: (number|null);

        /** OtherRoleInfo MaxSd */
        MaxSd?: (number|null);

        /** OtherRoleInfo BodyEquips */
        BodyEquips?: ({ [k: string]: outer_pb.IEquip }|null);

        /** OtherRoleInfo Zm */
        Zm?: (string|null);

        /** OtherRoleInfo ZsNum */
        ZsNum?: (number|null);

        /** OtherRoleInfo RedPoint */
        RedPoint?: (number|null);

        /** OtherRoleInfo HuDunTime */
        HuDunTime?: (number|Long|null);

        /** OtherRoleInfo ChIdLv */
        ChIdLv?: (number[]|null);

        /** OtherRoleInfo Sid */
        Sid?: (string|null);
    }

    /** Represents an OtherRoleInfo. */
    class OtherRoleInfo implements IOtherRoleInfo {

        /**
         * Constructs a new OtherRoleInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IOtherRoleInfo);

        /** OtherRoleInfo Id. */
        public Id: (number|Long);

        /** OtherRoleInfo Lv. */
        public Lv: number;

        /** OtherRoleInfo DsLv. */
        public DsLv: number;

        /** OtherRoleInfo Name. */
        public Name: string;

        /** OtherRoleInfo RoleType. */
        public RoleType: number;

        /** OtherRoleInfo I. */
        public I: number;

        /** OtherRoleInfo J. */
        public J: number;

        /** OtherRoleInfo CurHp. */
        public CurHp: number;

        /** OtherRoleInfo MaxHp. */
        public MaxHp: number;

        /** OtherRoleInfo MoveInterval. */
        public MoveInterval: number;

        /** OtherRoleInfo TeamId. */
        public TeamId: number;

        /** OtherRoleInfo Buffs. */
        public Buffs: { [k: string]: outer_pb.IBuffInfo };

        /** OtherRoleInfo CurSd. */
        public CurSd: number;

        /** OtherRoleInfo MaxSd. */
        public MaxSd: number;

        /** OtherRoleInfo BodyEquips. */
        public BodyEquips: { [k: string]: outer_pb.IEquip };

        /** OtherRoleInfo Zm. */
        public Zm: string;

        /** OtherRoleInfo ZsNum. */
        public ZsNum: number;

        /** OtherRoleInfo RedPoint. */
        public RedPoint: number;

        /** OtherRoleInfo HuDunTime. */
        public HuDunTime: (number|Long);

        /** OtherRoleInfo ChIdLv. */
        public ChIdLv: number[];

        /** OtherRoleInfo Sid. */
        public Sid: string;

        /**
         * Creates a new OtherRoleInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OtherRoleInfo instance
         */
        public static create(properties?: outer_pb.IOtherRoleInfo): outer_pb.OtherRoleInfo;

        /**
         * Encodes the specified OtherRoleInfo message. Does not implicitly {@link outer_pb.OtherRoleInfo.verify|verify} messages.
         * @param message OtherRoleInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IOtherRoleInfo, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes an OtherRoleInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OtherRoleInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.OtherRoleInfo;
    }

    /** Properties of a MonsterInfo. */
    interface IMonsterInfo {

        /** MonsterInfo Index */
        Index?: (number|null);

        /** MonsterInfo Id */
        Id?: (number|null);

        /** MonsterInfo I */
        I?: (number|null);

        /** MonsterInfo J */
        J?: (number|null);

        /** MonsterInfo CurHp */
        CurHp?: (number|null);

        /** MonsterInfo MaxHp */
        MaxHp?: (number|null);

        /** MonsterInfo Owner */
        Owner?: (string|null);

        /** MonsterInfo Type */
        Type?: (number|null);

        /** MonsterInfo Buffs */
        Buffs?: ({ [k: string]: outer_pb.IBuffInfo }|null);

        /** MonsterInfo Lv */
        Lv?: (number|null);

        /** MonsterInfo YsTypes */
        YsTypes?: (number[]|null);
    }

    /** Represents a MonsterInfo. */
    class MonsterInfo implements IMonsterInfo {

        /**
         * Constructs a new MonsterInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IMonsterInfo);

        /** MonsterInfo Index. */
        public Index: number;

        /** MonsterInfo Id. */
        public Id: number;

        /** MonsterInfo I. */
        public I: number;

        /** MonsterInfo J. */
        public J: number;

        /** MonsterInfo CurHp. */
        public CurHp: number;

        /** MonsterInfo MaxHp. */
        public MaxHp: number;

        /** MonsterInfo Owner. */
        public Owner: string;

        /** MonsterInfo Type. */
        public Type: number;

        /** MonsterInfo Buffs. */
        public Buffs: { [k: string]: outer_pb.IBuffInfo };

        /** MonsterInfo Lv. */
        public Lv: number;

        /** MonsterInfo YsTypes. */
        public YsTypes: number[];

        /**
         * Creates a new MonsterInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MonsterInfo instance
         */
        public static create(properties?: outer_pb.IMonsterInfo): outer_pb.MonsterInfo;

        /**
         * Encodes the specified MonsterInfo message. Does not implicitly {@link outer_pb.MonsterInfo.verify|verify} messages.
         * @param message MonsterInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IMonsterInfo, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a MonsterInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MonsterInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.MonsterInfo;
    }

    /** Properties of a MoveToPos. */
    interface IMoveToPos {

        /** MoveToPos DeleteOtherList */
        DeleteOtherList?: ((number|Long)[]|null);

        /** MoveToPos DeleteMonsterList */
        DeleteMonsterList?: (number[]|null);

        /** MoveToPos DeleteDropItems */
        DeleteDropItems?: (string[]|null);

        /** MoveToPos NewOtherList */
        NewOtherList?: (outer_pb.IOtherRoleInfo[]|null);

        /** MoveToPos NewMonsterList */
        NewMonsterList?: (outer_pb.IMonsterInfo[]|null);

        /** MoveToPos NewDropItemList */
        NewDropItemList?: (outer_pb.IDropItem[]|null);

        /** MoveToPos Pos */
        Pos?: (outer_pb.IPos|null);

        /** MoveToPos DeleteShops */
        DeleteShops?: ((number|Long)[]|null);

        /** MoveToPos NewShops */
        NewShops?: (outer_pb.IOtherRoleInfo[]|null);
    }

    /** Represents a MoveToPos. */
    class MoveToPos implements IMoveToPos {

        /**
         * Constructs a new MoveToPos.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IMoveToPos);

        /** MoveToPos DeleteOtherList. */
        public DeleteOtherList: (number|Long)[];

        /** MoveToPos DeleteMonsterList. */
        public DeleteMonsterList: number[];

        /** MoveToPos DeleteDropItems. */
        public DeleteDropItems: string[];

        /** MoveToPos NewOtherList. */
        public NewOtherList: outer_pb.IOtherRoleInfo[];

        /** MoveToPos NewMonsterList. */
        public NewMonsterList: outer_pb.IMonsterInfo[];

        /** MoveToPos NewDropItemList. */
        public NewDropItemList: outer_pb.IDropItem[];

        /** MoveToPos Pos. */
        public Pos?: (outer_pb.IPos|null);

        /** MoveToPos DeleteShops. */
        public DeleteShops: (number|Long)[];

        /** MoveToPos NewShops. */
        public NewShops: outer_pb.IOtherRoleInfo[];

        /**
         * Creates a new MoveToPos instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MoveToPos instance
         */
        public static create(properties?: outer_pb.IMoveToPos): outer_pb.MoveToPos;

        /**
         * Encodes the specified MoveToPos message. Does not implicitly {@link outer_pb.MoveToPos.verify|verify} messages.
         * @param message MoveToPos message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IMoveToPos, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a MoveToPos message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MoveToPos
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.MoveToPos;
    }

    /** Properties of a Pos. */
    interface IPos {

        /** Pos I */
        I?: (number|null);

        /** Pos J */
        J?: (number|null);

        /** Pos X */
        X?: (number|null);

        /** Pos Y */
        Y?: (number|null);
    }

    /** Represents a Pos. */
    class Pos implements IPos {

        /**
         * Constructs a new Pos.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IPos);

        /** Pos I. */
        public I: number;

        /** Pos J. */
        public J: number;

        /** Pos X. */
        public X: number;

        /** Pos Y. */
        public Y: number;

        /**
         * Creates a new Pos instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Pos instance
         */
        public static create(properties?: outer_pb.IPos): outer_pb.Pos;

        /**
         * Encodes the specified Pos message. Does not implicitly {@link outer_pb.Pos.verify|verify} messages.
         * @param message Pos message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IPos, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a Pos message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Pos
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.Pos;
    }

    /** Properties of a ResetPos. */
    interface IResetPos {

        /** ResetPos OtherList */
        OtherList?: (outer_pb.IOtherRoleInfo[]|null);

        /** ResetPos MonsterList */
        MonsterList?: (outer_pb.IMonsterInfo[]|null);

        /** ResetPos DropItemList */
        DropItemList?: (outer_pb.IDropItem[]|null);

        /** ResetPos I */
        I?: (number|null);

        /** ResetPos J */
        J?: (number|null);

        /** ResetPos ResetType */
        ResetType?: (number|null);

        /** ResetPos Exp */
        Exp?: (number|Long|null);

        /** ResetPos MaxHp */
        MaxHp?: (number|null);

        /** ResetPos PointIndex */
        PointIndex?: (number|null);

        /** ResetPos DoorId */
        DoorId?: (number|null);

        /** ResetPos NeedGold */
        NeedGold?: (number|null);

        /** ResetPos Shops */
        Shops?: (outer_pb.IOtherRoleInfo[]|null);
    }

    /** Represents a ResetPos. */
    class ResetPos implements IResetPos {

        /**
         * Constructs a new ResetPos.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IResetPos);

        /** ResetPos OtherList. */
        public OtherList: outer_pb.IOtherRoleInfo[];

        /** ResetPos MonsterList. */
        public MonsterList: outer_pb.IMonsterInfo[];

        /** ResetPos DropItemList. */
        public DropItemList: outer_pb.IDropItem[];

        /** ResetPos I. */
        public I: number;

        /** ResetPos J. */
        public J: number;

        /** ResetPos ResetType. */
        public ResetType: number;

        /** ResetPos Exp. */
        public Exp: (number|Long);

        /** ResetPos MaxHp. */
        public MaxHp: number;

        /** ResetPos PointIndex. */
        public PointIndex: number;

        /** ResetPos DoorId. */
        public DoorId: number;

        /** ResetPos NeedGold. */
        public NeedGold: number;

        /** ResetPos Shops. */
        public Shops: outer_pb.IOtherRoleInfo[];

        /**
         * Creates a new ResetPos instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ResetPos instance
         */
        public static create(properties?: outer_pb.IResetPos): outer_pb.ResetPos;

        /**
         * Encodes the specified ResetPos message. Does not implicitly {@link outer_pb.ResetPos.verify|verify} messages.
         * @param message ResetPos message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IResetPos, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a ResetPos message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ResetPos
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.ResetPos;
    }

    /** Properties of a ChangePosFailed. */
    interface IChangePosFailed {

        /** ChangePosFailed X */
        X?: (number|null);

        /** ChangePosFailed Y */
        Y?: (number|null);
    }

    /** Represents a ChangePosFailed. */
    class ChangePosFailed implements IChangePosFailed {

        /**
         * Constructs a new ChangePosFailed.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IChangePosFailed);

        /** ChangePosFailed X. */
        public X: number;

        /** ChangePosFailed Y. */
        public Y: number;

        /**
         * Creates a new ChangePosFailed instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChangePosFailed instance
         */
        public static create(properties?: outer_pb.IChangePosFailed): outer_pb.ChangePosFailed;

        /**
         * Encodes the specified ChangePosFailed message. Does not implicitly {@link outer_pb.ChangePosFailed.verify|verify} messages.
         * @param message ChangePosFailed message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IChangePosFailed, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a ChangePosFailed message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChangePosFailed
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.ChangePosFailed;
    }

    /** Properties of an OtherStartMoveTo. */
    interface IOtherStartMoveTo {

        /** OtherStartMoveTo Id */
        Id?: (number|Long|null);

        /** OtherStartMoveTo I */
        I?: (number|null);

        /** OtherStartMoveTo J */
        J?: (number|null);

        /** OtherStartMoveTo X */
        X?: (number|null);

        /** OtherStartMoveTo Y */
        Y?: (number|null);
    }

    /** Represents an OtherStartMoveTo. */
    class OtherStartMoveTo implements IOtherStartMoveTo {

        /**
         * Constructs a new OtherStartMoveTo.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IOtherStartMoveTo);

        /** OtherStartMoveTo Id. */
        public Id: (number|Long);

        /** OtherStartMoveTo I. */
        public I: number;

        /** OtherStartMoveTo J. */
        public J: number;

        /** OtherStartMoveTo X. */
        public X: number;

        /** OtherStartMoveTo Y. */
        public Y: number;

        /**
         * Creates a new OtherStartMoveTo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OtherStartMoveTo instance
         */
        public static create(properties?: outer_pb.IOtherStartMoveTo): outer_pb.OtherStartMoveTo;

        /**
         * Encodes the specified OtherStartMoveTo message. Does not implicitly {@link outer_pb.OtherStartMoveTo.verify|verify} messages.
         * @param message OtherStartMoveTo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IOtherStartMoveTo, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes an OtherStartMoveTo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OtherStartMoveTo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.OtherStartMoveTo;
    }

    /** Properties of a DeleteEntity. */
    interface IDeleteEntity {

        /** DeleteEntity Uid */
        Uid?: (string|null);

        /** DeleteEntity Index */
        Index?: (number|null);

        /** DeleteEntity Id */
        Id?: (number|Long|null);
    }

    /** Represents a DeleteEntity. */
    class DeleteEntity implements IDeleteEntity {

        /**
         * Constructs a new DeleteEntity.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IDeleteEntity);

        /** DeleteEntity Uid. */
        public Uid: string;

        /** DeleteEntity Index. */
        public Index: number;

        /** DeleteEntity Id. */
        public Id: (number|Long);

        /**
         * Creates a new DeleteEntity instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeleteEntity instance
         */
        public static create(properties?: outer_pb.IDeleteEntity): outer_pb.DeleteEntity;

        /**
         * Encodes the specified DeleteEntity message. Does not implicitly {@link outer_pb.DeleteEntity.verify|verify} messages.
         * @param message DeleteEntity message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IDeleteEntity, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a DeleteEntity message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeleteEntity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.DeleteEntity;
    }

    /** Properties of a RecoverEquips. */
    interface IRecoverEquips {

        /** RecoverEquips UidList */
        UidList?: (string[]|null);

        /** RecoverEquips Pass */
        Pass?: (string|null);

        /** RecoverEquips ErrCode */
        ErrCode?: (number|null);

        /** RecoverEquips Items */
        Items?: ({ [k: string]: number }|null);
    }

    /** Represents a RecoverEquips. */
    class RecoverEquips implements IRecoverEquips {

        /**
         * Constructs a new RecoverEquips.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IRecoverEquips);

        /** RecoverEquips UidList. */
        public UidList: string[];

        /** RecoverEquips Pass. */
        public Pass: string;

        /** RecoverEquips ErrCode. */
        public ErrCode: number;

        /** RecoverEquips Items. */
        public Items: { [k: string]: number };

        /**
         * Creates a new RecoverEquips instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RecoverEquips instance
         */
        public static create(properties?: outer_pb.IRecoverEquips): outer_pb.RecoverEquips;

        /**
         * Encodes the specified RecoverEquips message. Does not implicitly {@link outer_pb.RecoverEquips.verify|verify} messages.
         * @param message RecoverEquips message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IRecoverEquips, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a RecoverEquips message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RecoverEquips
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.RecoverEquips;
    }

    /** Properties of a DressEquip. */
    interface IDressEquip {

        /** DressEquip DressUid */
        DressUid?: (string|null);

        /** DressEquip UnDressUid */
        UnDressUid?: (string|null);

        /** DressEquip BodyType */
        BodyType?: (number|null);

        /** DressEquip BasePros */
        BasePros?: (outer_pb.IBasePros|null);
    }

    /** Represents a DressEquip. */
    class DressEquip implements IDressEquip {

        /**
         * Constructs a new DressEquip.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IDressEquip);

        /** DressEquip DressUid. */
        public DressUid: string;

        /** DressEquip UnDressUid. */
        public UnDressUid: string;

        /** DressEquip BodyType. */
        public BodyType: number;

        /** DressEquip BasePros. */
        public BasePros?: (outer_pb.IBasePros|null);

        /**
         * Creates a new DressEquip instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DressEquip instance
         */
        public static create(properties?: outer_pb.IDressEquip): outer_pb.DressEquip;

        /**
         * Encodes the specified DressEquip message. Does not implicitly {@link outer_pb.DressEquip.verify|verify} messages.
         * @param message DressEquip message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IDressEquip, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a DressEquip message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DressEquip
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.DressEquip;
    }

    /** Properties of a DzAct. */
    interface IDzAct {

        /** DzAct Uid */
        Uid?: (string|null);

        /** DzAct BodyType */
        BodyType?: (number|null);

        /** DzAct DzType */
        DzType?: (number|null);

        /** DzAct Equip */
        Equip?: (outer_pb.IEquip|null);

        /** DzAct Items */
        Items?: (outer_pb.IItem[]|null);

        /** DzAct BasePros */
        BasePros?: (outer_pb.IBasePros|null);

        /** DzAct ErrCode */
        ErrCode?: (number|null);

        /** DzAct LockIndexs */
        LockIndexs?: (number[]|null);

        /** DzAct Index */
        Index?: (number|null);

        /** DzAct pass */
        pass?: (string|null);
    }

    /** Represents a DzAct. */
    class DzAct implements IDzAct {

        /**
         * Constructs a new DzAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IDzAct);

        /** DzAct Uid. */
        public Uid: string;

        /** DzAct BodyType. */
        public BodyType: number;

        /** DzAct DzType. */
        public DzType: number;

        /** DzAct Equip. */
        public Equip?: (outer_pb.IEquip|null);

        /** DzAct Items. */
        public Items: outer_pb.IItem[];

        /** DzAct BasePros. */
        public BasePros?: (outer_pb.IBasePros|null);

        /** DzAct ErrCode. */
        public ErrCode: number;

        /** DzAct LockIndexs. */
        public LockIndexs: number[];

        /** DzAct Index. */
        public Index: number;

        /** DzAct pass. */
        public pass: string;

        /**
         * Creates a new DzAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DzAct instance
         */
        public static create(properties?: outer_pb.IDzAct): outer_pb.DzAct;

        /**
         * Encodes the specified DzAct message. Does not implicitly {@link outer_pb.DzAct.verify|verify} messages.
         * @param message DzAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IDzAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a DzAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DzAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.DzAct;
    }

    /** Properties of a MonsterStartMoveTo. */
    interface IMonsterStartMoveTo {

        /** MonsterStartMoveTo Index */
        Index?: (number|null);

        /** MonsterStartMoveTo I */
        I?: (number|null);

        /** MonsterStartMoveTo J */
        J?: (number|null);

        /** MonsterStartMoveTo IsResetPos */
        IsResetPos?: (boolean|null);
    }

    /** Represents a MonsterStartMoveTo. */
    class MonsterStartMoveTo implements IMonsterStartMoveTo {

        /**
         * Constructs a new MonsterStartMoveTo.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IMonsterStartMoveTo);

        /** MonsterStartMoveTo Index. */
        public Index: number;

        /** MonsterStartMoveTo I. */
        public I: number;

        /** MonsterStartMoveTo J. */
        public J: number;

        /** MonsterStartMoveTo IsResetPos. */
        public IsResetPos: boolean;

        /**
         * Creates a new MonsterStartMoveTo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MonsterStartMoveTo instance
         */
        public static create(properties?: outer_pb.IMonsterStartMoveTo): outer_pb.MonsterStartMoveTo;

        /**
         * Encodes the specified MonsterStartMoveTo message. Does not implicitly {@link outer_pb.MonsterStartMoveTo.verify|verify} messages.
         * @param message MonsterStartMoveTo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IMonsterStartMoveTo, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a MonsterStartMoveTo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MonsterStartMoveTo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.MonsterStartMoveTo;
    }

    /** Properties of a PlayerBeAtkByMonster. */
    interface IPlayerBeAtkByMonster {

        /** PlayerBeAtkByMonster Index */
        Index?: (number|null);

        /** PlayerBeAtkByMonster Dmg */
        Dmg?: (number|null);

        /** PlayerBeAtkByMonster YsDmg */
        YsDmg?: (number|null);

        /** PlayerBeAtkByMonster Result */
        Result?: (number|null);

        /** PlayerBeAtkByMonster SkillId */
        SkillId?: (number|null);

        /** PlayerBeAtkByMonster Id */
        Id?: (number|Long|null);

        /** PlayerBeAtkByMonster GetHp */
        GetHp?: (number|null);

        /** PlayerBeAtkByMonster CurHp */
        CurHp?: (number|null);

        /** PlayerBeAtkByMonster CurSd */
        CurSd?: (number|null);
    }

    /** Represents a PlayerBeAtkByMonster. */
    class PlayerBeAtkByMonster implements IPlayerBeAtkByMonster {

        /**
         * Constructs a new PlayerBeAtkByMonster.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IPlayerBeAtkByMonster);

        /** PlayerBeAtkByMonster Index. */
        public Index: number;

        /** PlayerBeAtkByMonster Dmg. */
        public Dmg: number;

        /** PlayerBeAtkByMonster YsDmg. */
        public YsDmg: number;

        /** PlayerBeAtkByMonster Result. */
        public Result: number;

        /** PlayerBeAtkByMonster SkillId. */
        public SkillId: number;

        /** PlayerBeAtkByMonster Id. */
        public Id: (number|Long);

        /** PlayerBeAtkByMonster GetHp. */
        public GetHp: number;

        /** PlayerBeAtkByMonster CurHp. */
        public CurHp: number;

        /** PlayerBeAtkByMonster CurSd. */
        public CurSd: number;

        /**
         * Creates a new PlayerBeAtkByMonster instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PlayerBeAtkByMonster instance
         */
        public static create(properties?: outer_pb.IPlayerBeAtkByMonster): outer_pb.PlayerBeAtkByMonster;

        /**
         * Encodes the specified PlayerBeAtkByMonster message. Does not implicitly {@link outer_pb.PlayerBeAtkByMonster.verify|verify} messages.
         * @param message PlayerBeAtkByMonster message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IPlayerBeAtkByMonster, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a PlayerBeAtkByMonster message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PlayerBeAtkByMonster
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.PlayerBeAtkByMonster;
    }

    /** Properties of a RoleAtkRole. */
    interface IRoleAtkRole {

        /** RoleAtkRole FromId */
        FromId?: (number|Long|null);

        /** RoleAtkRole ToId */
        ToId?: (number|Long|null);

        /** RoleAtkRole SkillId */
        SkillId?: (number|null);

        /** RoleAtkRole SdDmg */
        SdDmg?: (number|null);

        /** RoleAtkRole Dmg */
        Dmg?: (number|null);

        /** RoleAtkRole YsDmg */
        YsDmg?: (number|null);

        /** RoleAtkRole Result */
        Result?: (number|null);

        /** RoleAtkRole DmgType */
        DmgType?: (number|null);

        /** RoleAtkRole CurHp */
        CurHp?: (number|null);

        /** RoleAtkRole CurSd */
        CurSd?: (number|null);

        /** RoleAtkRole GetHp */
        GetHp?: (number|null);

        /** RoleAtkRole KfJf */
        KfJf?: (number|null);
    }

    /** Represents a RoleAtkRole. */
    class RoleAtkRole implements IRoleAtkRole {

        /**
         * Constructs a new RoleAtkRole.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IRoleAtkRole);

        /** RoleAtkRole FromId. */
        public FromId: (number|Long);

        /** RoleAtkRole ToId. */
        public ToId: (number|Long);

        /** RoleAtkRole SkillId. */
        public SkillId: number;

        /** RoleAtkRole SdDmg. */
        public SdDmg: number;

        /** RoleAtkRole Dmg. */
        public Dmg: number;

        /** RoleAtkRole YsDmg. */
        public YsDmg: number;

        /** RoleAtkRole Result. */
        public Result: number;

        /** RoleAtkRole DmgType. */
        public DmgType: number;

        /** RoleAtkRole CurHp. */
        public CurHp: number;

        /** RoleAtkRole CurSd. */
        public CurSd: number;

        /** RoleAtkRole GetHp. */
        public GetHp: number;

        /** RoleAtkRole KfJf. */
        public KfJf: number;

        /**
         * Creates a new RoleAtkRole instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoleAtkRole instance
         */
        public static create(properties?: outer_pb.IRoleAtkRole): outer_pb.RoleAtkRole;

        /**
         * Encodes the specified RoleAtkRole message. Does not implicitly {@link outer_pb.RoleAtkRole.verify|verify} messages.
         * @param message RoleAtkRole message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IRoleAtkRole, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a RoleAtkRole message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoleAtkRole
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.RoleAtkRole;
    }

    /** Properties of a RoleBeHealedByRole. */
    interface IRoleBeHealedByRole {

        /** RoleBeHealedByRole SkillId */
        SkillId?: (number|null);

        /** RoleBeHealedByRole FromId */
        FromId?: (number|Long|null);

        /** RoleBeHealedByRole ToId */
        ToId?: (number|Long|null);

        /** RoleBeHealedByRole GetHp */
        GetHp?: (number|null);

        /** RoleBeHealedByRole GetSd */
        GetSd?: (number|null);

        /** RoleBeHealedByRole CurHp */
        CurHp?: (number|null);
    }

    /** Represents a RoleBeHealedByRole. */
    class RoleBeHealedByRole implements IRoleBeHealedByRole {

        /**
         * Constructs a new RoleBeHealedByRole.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IRoleBeHealedByRole);

        /** RoleBeHealedByRole SkillId. */
        public SkillId: number;

        /** RoleBeHealedByRole FromId. */
        public FromId: (number|Long);

        /** RoleBeHealedByRole ToId. */
        public ToId: (number|Long);

        /** RoleBeHealedByRole GetHp. */
        public GetHp: number;

        /** RoleBeHealedByRole GetSd. */
        public GetSd: number;

        /** RoleBeHealedByRole CurHp. */
        public CurHp: number;

        /**
         * Creates a new RoleBeHealedByRole instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoleBeHealedByRole instance
         */
        public static create(properties?: outer_pb.IRoleBeHealedByRole): outer_pb.RoleBeHealedByRole;

        /**
         * Encodes the specified RoleBeHealedByRole message. Does not implicitly {@link outer_pb.RoleBeHealedByRole.verify|verify} messages.
         * @param message RoleBeHealedByRole message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IRoleBeHealedByRole, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a RoleBeHealedByRole message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoleBeHealedByRole
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.RoleBeHealedByRole;
    }

    /** Properties of a MonsterBeHealed. */
    interface IMonsterBeHealed {

        /** MonsterBeHealed SkillId */
        SkillId?: (number|null);

        /** MonsterBeHealed Index */
        Index?: (number|null);

        /** MonsterBeHealed GetHp */
        GetHp?: (number|null);

        /** MonsterBeHealed FromIndex */
        FromIndex?: (number|null);

        /** MonsterBeHealed FromId */
        FromId?: (number|Long|null);
    }

    /** Represents a MonsterBeHealed. */
    class MonsterBeHealed implements IMonsterBeHealed {

        /**
         * Constructs a new MonsterBeHealed.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IMonsterBeHealed);

        /** MonsterBeHealed SkillId. */
        public SkillId: number;

        /** MonsterBeHealed Index. */
        public Index: number;

        /** MonsterBeHealed GetHp. */
        public GetHp: number;

        /** MonsterBeHealed FromIndex. */
        public FromIndex: number;

        /** MonsterBeHealed FromId. */
        public FromId: (number|Long);

        /**
         * Creates a new MonsterBeHealed instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MonsterBeHealed instance
         */
        public static create(properties?: outer_pb.IMonsterBeHealed): outer_pb.MonsterBeHealed;

        /**
         * Encodes the specified MonsterBeHealed message. Does not implicitly {@link outer_pb.MonsterBeHealed.verify|verify} messages.
         * @param message MonsterBeHealed message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IMonsterBeHealed, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a MonsterBeHealed message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MonsterBeHealed
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.MonsterBeHealed;
    }

    /** Properties of a GetBuffDmg. */
    interface IGetBuffDmg {

        /** GetBuffDmg ToId */
        ToId?: (number|Long|null);

        /** GetBuffDmg Dmg */
        Dmg?: (number|null);

        /** GetBuffDmg BuffId */
        BuffId?: (number|null);

        /** GetBuffDmg FromId */
        FromId?: (number|Long|null);

        /** GetBuffDmg Index */
        Index?: (number|null);

        /** GetBuffDmg CurHp */
        CurHp?: (number|null);
    }

    /** Represents a GetBuffDmg. */
    class GetBuffDmg implements IGetBuffDmg {

        /**
         * Constructs a new GetBuffDmg.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IGetBuffDmg);

        /** GetBuffDmg ToId. */
        public ToId: (number|Long);

        /** GetBuffDmg Dmg. */
        public Dmg: number;

        /** GetBuffDmg BuffId. */
        public BuffId: number;

        /** GetBuffDmg FromId. */
        public FromId: (number|Long);

        /** GetBuffDmg Index. */
        public Index: number;

        /** GetBuffDmg CurHp. */
        public CurHp: number;

        /**
         * Creates a new GetBuffDmg instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetBuffDmg instance
         */
        public static create(properties?: outer_pb.IGetBuffDmg): outer_pb.GetBuffDmg;

        /**
         * Encodes the specified GetBuffDmg message. Does not implicitly {@link outer_pb.GetBuffDmg.verify|verify} messages.
         * @param message GetBuffDmg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IGetBuffDmg, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a GetBuffDmg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetBuffDmg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.GetBuffDmg;
    }

    /** Properties of a MonsterBeKilled. */
    interface IMonsterBeKilled {

        /** MonsterBeKilled Index */
        Index?: (number|null);

        /** MonsterBeKilled Dmg */
        Dmg?: (number|null);

        /** MonsterBeKilled DmgType */
        DmgType?: (number|null);

        /** MonsterBeKilled YsDmg */
        YsDmg?: (number|null);

        /** MonsterBeKilled YsDmgType */
        YsDmgType?: (number|null);

        /** MonsterBeKilled SkillId */
        SkillId?: (number|null);

        /** MonsterBeKilled DropItems */
        DropItems?: (outer_pb.IDropItem[]|null);

        /** MonsterBeKilled FromId */
        FromId?: (number|Long|null);

        /** MonsterBeKilled GetExp */
        GetExp?: (number|Long|null);

        /** MonsterBeKilled OwnerTeamId */
        OwnerTeamId?: (number|null);

        /** MonsterBeKilled OwnerId */
        OwnerId?: (number|Long|null);

        /** MonsterBeKilled GetHp */
        GetHp?: (number|null);

        /** MonsterBeKilled GetMp */
        GetMp?: (number|null);

        /** MonsterBeKilled FromIndex */
        FromIndex?: (number|null);

        /** MonsterBeKilled Result */
        Result?: (number|null);

        /** MonsterBeKilled CurExp */
        CurExp?: (number|Long|null);

        /** MonsterBeKilled CurHp */
        CurHp?: (number|null);

        /** MonsterBeKilled KfJf */
        KfJf?: (number|null);
    }

    /** Represents a MonsterBeKilled. */
    class MonsterBeKilled implements IMonsterBeKilled {

        /**
         * Constructs a new MonsterBeKilled.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IMonsterBeKilled);

        /** MonsterBeKilled Index. */
        public Index: number;

        /** MonsterBeKilled Dmg. */
        public Dmg: number;

        /** MonsterBeKilled DmgType. */
        public DmgType: number;

        /** MonsterBeKilled YsDmg. */
        public YsDmg: number;

        /** MonsterBeKilled YsDmgType. */
        public YsDmgType: number;

        /** MonsterBeKilled SkillId. */
        public SkillId: number;

        /** MonsterBeKilled DropItems. */
        public DropItems: outer_pb.IDropItem[];

        /** MonsterBeKilled FromId. */
        public FromId: (number|Long);

        /** MonsterBeKilled GetExp. */
        public GetExp: (number|Long);

        /** MonsterBeKilled OwnerTeamId. */
        public OwnerTeamId: number;

        /** MonsterBeKilled OwnerId. */
        public OwnerId: (number|Long);

        /** MonsterBeKilled GetHp. */
        public GetHp: number;

        /** MonsterBeKilled GetMp. */
        public GetMp: number;

        /** MonsterBeKilled FromIndex. */
        public FromIndex: number;

        /** MonsterBeKilled Result. */
        public Result: number;

        /** MonsterBeKilled CurExp. */
        public CurExp: (number|Long);

        /** MonsterBeKilled CurHp. */
        public CurHp: number;

        /** MonsterBeKilled KfJf. */
        public KfJf: number;

        /**
         * Creates a new MonsterBeKilled instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MonsterBeKilled instance
         */
        public static create(properties?: outer_pb.IMonsterBeKilled): outer_pb.MonsterBeKilled;

        /**
         * Encodes the specified MonsterBeKilled message. Does not implicitly {@link outer_pb.MonsterBeKilled.verify|verify} messages.
         * @param message MonsterBeKilled message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IMonsterBeKilled, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a MonsterBeKilled message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MonsterBeKilled
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.MonsterBeKilled;
    }

    /** Properties of a LvUpInfo. */
    interface ILvUpInfo {

        /** LvUpInfo Lv */
        Lv?: (number|null);

        /** LvUpInfo DsLv */
        DsLv?: (number|null);

        /** LvUpInfo CurExp */
        CurExp?: (number|Long|null);

        /** LvUpInfo CurLvMaxExp */
        CurLvMaxExp?: (number|Long|null);

        /** LvUpInfo BasePro */
        BasePro?: (outer_pb.IBasePros|null);

        /** LvUpInfo CjQuests */
        CjQuests?: (outer_pb.IMainQuest[]|null);

        /** LvUpInfo IsLvUp */
        IsLvUp?: (boolean|null);
    }

    /** Represents a LvUpInfo. */
    class LvUpInfo implements ILvUpInfo {

        /**
         * Constructs a new LvUpInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ILvUpInfo);

        /** LvUpInfo Lv. */
        public Lv: number;

        /** LvUpInfo DsLv. */
        public DsLv: number;

        /** LvUpInfo CurExp. */
        public CurExp: (number|Long);

        /** LvUpInfo CurLvMaxExp. */
        public CurLvMaxExp: (number|Long);

        /** LvUpInfo BasePro. */
        public BasePro?: (outer_pb.IBasePros|null);

        /** LvUpInfo CjQuests. */
        public CjQuests: outer_pb.IMainQuest[];

        /** LvUpInfo IsLvUp. */
        public IsLvUp: boolean;

        /**
         * Creates a new LvUpInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LvUpInfo instance
         */
        public static create(properties?: outer_pb.ILvUpInfo): outer_pb.LvUpInfo;

        /**
         * Encodes the specified LvUpInfo message. Does not implicitly {@link outer_pb.LvUpInfo.verify|verify} messages.
         * @param message LvUpInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ILvUpInfo, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a LvUpInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LvUpInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.LvUpInfo;
    }

    /** Properties of a DropItem. */
    interface IDropItem {

        /** DropItem Uid */
        Uid?: (string|null);

        /** DropItem I */
        I?: (number|null);

        /** DropItem J */
        J?: (number|null);

        /** DropItem ItemType */
        ItemType?: (number|null);

        /** DropItem DropTime */
        DropTime?: (number|Long|null);

        /** DropItem Owner */
        Owner?: (number|Long|null);

        /** DropItem OwnerTeamId */
        OwnerTeamId?: (number|null);

        /** DropItem EquipData */
        EquipData?: (outer_pb.IEquip|null);

        /** DropItem ItemId */
        ItemId?: (number|null);

        /** DropItem ItemNum */
        ItemNum?: (number|null);

        /** DropItem NeedHand */
        NeedHand?: (boolean|null);
    }

    /** Represents a DropItem. */
    class DropItem implements IDropItem {

        /**
         * Constructs a new DropItem.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IDropItem);

        /** DropItem Uid. */
        public Uid: string;

        /** DropItem I. */
        public I: number;

        /** DropItem J. */
        public J: number;

        /** DropItem ItemType. */
        public ItemType: number;

        /** DropItem DropTime. */
        public DropTime: (number|Long);

        /** DropItem Owner. */
        public Owner: (number|Long);

        /** DropItem OwnerTeamId. */
        public OwnerTeamId: number;

        /** DropItem EquipData. */
        public EquipData?: (outer_pb.IEquip|null);

        /** DropItem ItemId. */
        public ItemId: number;

        /** DropItem ItemNum. */
        public ItemNum: number;

        /** DropItem NeedHand. */
        public NeedHand: boolean;

        /**
         * Creates a new DropItem instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DropItem instance
         */
        public static create(properties?: outer_pb.IDropItem): outer_pb.DropItem;

        /**
         * Encodes the specified DropItem message. Does not implicitly {@link outer_pb.DropItem.verify|verify} messages.
         * @param message DropItem message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IDropItem, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a DropItem message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DropItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.DropItem;
    }

    /** Properties of an Equip. */
    interface IEquip {

        /** Equip Id */
        Id?: (number|null);

        /** Equip Uid */
        Uid?: (string|null);

        /** Equip QhLv */
        QhLv?: (number|null);

        /** Equip ZjLv */
        ZjLv?: (number|null);

        /** Equip LuckyLv */
        LuckyLv?: (number|null);

        /** Equip ZyList */
        ZyList?: (number[]|null);

        /** Equip TzLv */
        TzLv?: (number|null);

        /** Equip TzTL */
        TzTL?: (number|null);

        /** Equip PvpLv */
        PvpLv?: (number|null);

        /** Equip ZsType */
        ZsType?: (number|null);

        /** Equip ZsLv */
        ZsLv?: (number|null);

        /** Equip SkillId */
        SkillId?: (number|null);

        /** Equip Lv */
        Lv?: (number|null);

        /** Equip Exp */
        Exp?: (number|null);

        /** Equip IsLock */
        IsLock?: (boolean|null);

        /** Equip Grow */
        Grow?: (number[]|null);

        /** Equip YsList */
        YsList?: (number[]|null);

        /** Equip DtTzLv */
        DtTzLv?: (number|null);

        /** Equip IsNpc */
        IsNpc?: (boolean|null);

        /** Equip Data */
        Data?: ({ [k: string]: number }|null);

        /** Equip IsBZ */
        IsBZ?: (boolean|null);

        /** Equip IsNew */
        IsNew?: (boolean|null);
    }

    /** Represents an Equip. */
    class Equip implements IEquip {

        /**
         * Constructs a new Equip.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IEquip);

        /** Equip Id. */
        public Id: number;

        /** Equip Uid. */
        public Uid: string;

        /** Equip QhLv. */
        public QhLv: number;

        /** Equip ZjLv. */
        public ZjLv: number;

        /** Equip LuckyLv. */
        public LuckyLv: number;

        /** Equip ZyList. */
        public ZyList: number[];

        /** Equip TzLv. */
        public TzLv: number;

        /** Equip TzTL. */
        public TzTL: number;

        /** Equip PvpLv. */
        public PvpLv: number;

        /** Equip ZsType. */
        public ZsType: number;

        /** Equip ZsLv. */
        public ZsLv: number;

        /** Equip SkillId. */
        public SkillId: number;

        /** Equip Lv. */
        public Lv: number;

        /** Equip Exp. */
        public Exp: number;

        /** Equip IsLock. */
        public IsLock: boolean;

        /** Equip Grow. */
        public Grow: number[];

        /** Equip YsList. */
        public YsList: number[];

        /** Equip DtTzLv. */
        public DtTzLv: number;

        /** Equip IsNpc. */
        public IsNpc: boolean;

        /** Equip Data. */
        public Data: { [k: string]: number };

        /** Equip IsBZ. */
        public IsBZ: boolean;

        /** Equip IsNew. */
        public IsNew: boolean;

        /**
         * Creates a new Equip instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Equip instance
         */
        public static create(properties?: outer_pb.IEquip): outer_pb.Equip;

        /**
         * Encodes the specified Equip message. Does not implicitly {@link outer_pb.Equip.verify|verify} messages.
         * @param message Equip message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IEquip, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes an Equip message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Equip
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.Equip;
    }

    /** Properties of an Int32Array. */
    interface IInt32Array {

        /** Int32Array Values */
        Values?: (number[]|null);
    }

    /** Represents an Int32Array. */
    class Int32Array implements IInt32Array {

        /**
         * Constructs a new Int32Array.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IInt32Array);

        /** Int32Array Values. */
        public Values: number[];

        /**
         * Creates a new Int32Array instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Int32Array instance
         */
        public static create(properties?: outer_pb.IInt32Array): outer_pb.Int32Array;

        /**
         * Encodes the specified Int32Array message. Does not implicitly {@link outer_pb.Int32Array.verify|verify} messages.
         * @param message Int32Array message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IInt32Array, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes an Int32Array message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Int32Array
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.Int32Array;
    }

    /** Properties of a PickUpOneDropItem. */
    interface IPickUpOneDropItem {

        /** PickUpOneDropItem Who */
        Who?: (number|Long|null);

        /** PickUpOneDropItem Uid */
        Uid?: (string|null);

        /** PickUpOneDropItem IsJust */
        IsJust?: (boolean|null);
    }

    /** Represents a PickUpOneDropItem. */
    class PickUpOneDropItem implements IPickUpOneDropItem {

        /**
         * Constructs a new PickUpOneDropItem.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IPickUpOneDropItem);

        /** PickUpOneDropItem Who. */
        public Who: (number|Long);

        /** PickUpOneDropItem Uid. */
        public Uid: string;

        /** PickUpOneDropItem IsJust. */
        public IsJust: boolean;

        /**
         * Creates a new PickUpOneDropItem instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PickUpOneDropItem instance
         */
        public static create(properties?: outer_pb.IPickUpOneDropItem): outer_pb.PickUpOneDropItem;

        /**
         * Encodes the specified PickUpOneDropItem message. Does not implicitly {@link outer_pb.PickUpOneDropItem.verify|verify} messages.
         * @param message PickUpOneDropItem message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IPickUpOneDropItem, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a PickUpOneDropItem message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PickUpOneDropItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.PickUpOneDropItem;
    }

    /** Properties of a UseSkill. */
    interface IUseSkill {

        /** UseSkill Id */
        Id?: (number|Long|null);

        /** UseSkill SkillId */
        SkillId?: (number|null);

        /** UseSkill Index */
        Index?: (number|null);

        /** UseSkill Type */
        Type?: (number|null);

        /** UseSkill TargetsR */
        TargetsR?: ((number|Long)[]|null);

        /** UseSkill TargetsM */
        TargetsM?: (number[]|null);

        /** UseSkill ErrCode */
        ErrCode?: (number|null);
    }

    /** Represents a UseSkill. */
    class UseSkill implements IUseSkill {

        /**
         * Constructs a new UseSkill.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IUseSkill);

        /** UseSkill Id. */
        public Id: (number|Long);

        /** UseSkill SkillId. */
        public SkillId: number;

        /** UseSkill Index. */
        public Index: number;

        /** UseSkill Type. */
        public Type: number;

        /** UseSkill TargetsR. */
        public TargetsR: (number|Long)[];

        /** UseSkill TargetsM. */
        public TargetsM: number[];

        /** UseSkill ErrCode. */
        public ErrCode: number;

        /**
         * Creates a new UseSkill instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UseSkill instance
         */
        public static create(properties?: outer_pb.IUseSkill): outer_pb.UseSkill;

        /**
         * Encodes the specified UseSkill message. Does not implicitly {@link outer_pb.UseSkill.verify|verify} messages.
         * @param message UseSkill message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IUseSkill, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a UseSkill message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UseSkill
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.UseSkill;
    }

    /** Properties of a MonsterBeAtkedByPlayer. */
    interface IMonsterBeAtkedByPlayer {

        /** MonsterBeAtkedByPlayer Index */
        Index?: (number|null);

        /** MonsterBeAtkedByPlayer Dmg */
        Dmg?: (number|null);

        /** MonsterBeAtkedByPlayer DmgType */
        DmgType?: (number|null);

        /** MonsterBeAtkedByPlayer YsDmg */
        YsDmg?: (number|null);

        /** MonsterBeAtkedByPlayer YsDmgType */
        YsDmgType?: (number|null);

        /** MonsterBeAtkedByPlayer SkillId */
        SkillId?: (number|null);

        /** MonsterBeAtkedByPlayer FromId */
        FromId?: (number|Long|null);
    }

    /** Represents a MonsterBeAtkedByPlayer. */
    class MonsterBeAtkedByPlayer implements IMonsterBeAtkedByPlayer {

        /**
         * Constructs a new MonsterBeAtkedByPlayer.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IMonsterBeAtkedByPlayer);

        /** MonsterBeAtkedByPlayer Index. */
        public Index: number;

        /** MonsterBeAtkedByPlayer Dmg. */
        public Dmg: number;

        /** MonsterBeAtkedByPlayer DmgType. */
        public DmgType: number;

        /** MonsterBeAtkedByPlayer YsDmg. */
        public YsDmg: number;

        /** MonsterBeAtkedByPlayer YsDmgType. */
        public YsDmgType: number;

        /** MonsterBeAtkedByPlayer SkillId. */
        public SkillId: number;

        /** MonsterBeAtkedByPlayer FromId. */
        public FromId: (number|Long);

        /**
         * Creates a new MonsterBeAtkedByPlayer instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MonsterBeAtkedByPlayer instance
         */
        public static create(properties?: outer_pb.IMonsterBeAtkedByPlayer): outer_pb.MonsterBeAtkedByPlayer;

        /**
         * Encodes the specified MonsterBeAtkedByPlayer message. Does not implicitly {@link outer_pb.MonsterBeAtkedByPlayer.verify|verify} messages.
         * @param message MonsterBeAtkedByPlayer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IMonsterBeAtkedByPlayer, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a MonsterBeAtkedByPlayer message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MonsterBeAtkedByPlayer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.MonsterBeAtkedByPlayer;
    }

    /** Properties of a MonsterBeAtkedByMonster. */
    interface IMonsterBeAtkedByMonster {

        /** MonsterBeAtkedByMonster Index */
        Index?: (number|null);

        /** MonsterBeAtkedByMonster Dmg */
        Dmg?: (number|null);

        /** MonsterBeAtkedByMonster YsDmg */
        YsDmg?: (number|null);

        /** MonsterBeAtkedByMonster FromIndex */
        FromIndex?: (number|null);

        /** MonsterBeAtkedByMonster IsFs */
        IsFs?: (boolean|null);

        /** MonsterBeAtkedByMonster SkillId */
        SkillId?: (number|null);

        /** MonsterBeAtkedByMonster OwnerId */
        OwnerId?: (number|Long|null);

        /** MonsterBeAtkedByMonster FromId */
        FromId?: (number|Long|null);
    }

    /** Represents a MonsterBeAtkedByMonster. */
    class MonsterBeAtkedByMonster implements IMonsterBeAtkedByMonster {

        /**
         * Constructs a new MonsterBeAtkedByMonster.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IMonsterBeAtkedByMonster);

        /** MonsterBeAtkedByMonster Index. */
        public Index: number;

        /** MonsterBeAtkedByMonster Dmg. */
        public Dmg: number;

        /** MonsterBeAtkedByMonster YsDmg. */
        public YsDmg: number;

        /** MonsterBeAtkedByMonster FromIndex. */
        public FromIndex: number;

        /** MonsterBeAtkedByMonster IsFs. */
        public IsFs: boolean;

        /** MonsterBeAtkedByMonster SkillId. */
        public SkillId: number;

        /** MonsterBeAtkedByMonster OwnerId. */
        public OwnerId: (number|Long);

        /** MonsterBeAtkedByMonster FromId. */
        public FromId: (number|Long);

        /**
         * Creates a new MonsterBeAtkedByMonster instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MonsterBeAtkedByMonster instance
         */
        public static create(properties?: outer_pb.IMonsterBeAtkedByMonster): outer_pb.MonsterBeAtkedByMonster;

        /**
         * Encodes the specified MonsterBeAtkedByMonster message. Does not implicitly {@link outer_pb.MonsterBeAtkedByMonster.verify|verify} messages.
         * @param message MonsterBeAtkedByMonster message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IMonsterBeAtkedByMonster, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a MonsterBeAtkedByMonster message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MonsterBeAtkedByMonster
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.MonsterBeAtkedByMonster;
    }

    /** Properties of a PlayerGetHpMpBySlot. */
    interface IPlayerGetHpMpBySlot {

        /** PlayerGetHpMpBySlot GetHp */
        GetHp?: (number|null);

        /** PlayerGetHpMpBySlot GetMp */
        GetMp?: (number|null);
    }

    /** Represents a PlayerGetHpMpBySlot. */
    class PlayerGetHpMpBySlot implements IPlayerGetHpMpBySlot {

        /**
         * Constructs a new PlayerGetHpMpBySlot.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IPlayerGetHpMpBySlot);

        /** PlayerGetHpMpBySlot GetHp. */
        public GetHp: number;

        /** PlayerGetHpMpBySlot GetMp. */
        public GetMp: number;

        /**
         * Creates a new PlayerGetHpMpBySlot instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PlayerGetHpMpBySlot instance
         */
        public static create(properties?: outer_pb.IPlayerGetHpMpBySlot): outer_pb.PlayerGetHpMpBySlot;

        /**
         * Encodes the specified PlayerGetHpMpBySlot message. Does not implicitly {@link outer_pb.PlayerGetHpMpBySlot.verify|verify} messages.
         * @param message PlayerGetHpMpBySlot message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IPlayerGetHpMpBySlot, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a PlayerGetHpMpBySlot message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PlayerGetHpMpBySlot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.PlayerGetHpMpBySlot;
    }

    /** Properties of an OtherGetHpBySlot. */
    interface IOtherGetHpBySlot {

        /** OtherGetHpBySlot CurHpPer */
        CurHpPer?: (number|null);

        /** OtherGetHpBySlot Id */
        Id?: (number|Long|null);
    }

    /** Represents an OtherGetHpBySlot. */
    class OtherGetHpBySlot implements IOtherGetHpBySlot {

        /**
         * Constructs a new OtherGetHpBySlot.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IOtherGetHpBySlot);

        /** OtherGetHpBySlot CurHpPer. */
        public CurHpPer: number;

        /** OtherGetHpBySlot Id. */
        public Id: (number|Long);

        /**
         * Creates a new OtherGetHpBySlot instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OtherGetHpBySlot instance
         */
        public static create(properties?: outer_pb.IOtherGetHpBySlot): outer_pb.OtherGetHpBySlot;

        /**
         * Encodes the specified OtherGetHpBySlot message. Does not implicitly {@link outer_pb.OtherGetHpBySlot.verify|verify} messages.
         * @param message OtherGetHpBySlot message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IOtherGetHpBySlot, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes an OtherGetHpBySlot message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OtherGetHpBySlot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.OtherGetHpBySlot;
    }

    /** Properties of a SwitchAuto. */
    interface ISwitchAuto {

        /** SwitchAuto IsAuto */
        IsAuto?: (boolean|null);
    }

    /** Represents a SwitchAuto. */
    class SwitchAuto implements ISwitchAuto {

        /**
         * Constructs a new SwitchAuto.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ISwitchAuto);

        /** SwitchAuto IsAuto. */
        public IsAuto: boolean;

        /**
         * Creates a new SwitchAuto instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SwitchAuto instance
         */
        public static create(properties?: outer_pb.ISwitchAuto): outer_pb.SwitchAuto;

        /**
         * Encodes the specified SwitchAuto message. Does not implicitly {@link outer_pb.SwitchAuto.verify|verify} messages.
         * @param message SwitchAuto message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ISwitchAuto, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a SwitchAuto message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SwitchAuto
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.SwitchAuto;
    }

    /** Properties of a RelifeAtPlace. */
    interface IRelifeAtPlace {

        /** RelifeAtPlace Id */
        Id?: (number|Long|null);
    }

    /** Represents a RelifeAtPlace. */
    class RelifeAtPlace implements IRelifeAtPlace {

        /**
         * Constructs a new RelifeAtPlace.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IRelifeAtPlace);

        /** RelifeAtPlace Id. */
        public Id: (number|Long);

        /**
         * Creates a new RelifeAtPlace instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RelifeAtPlace instance
         */
        public static create(properties?: outer_pb.IRelifeAtPlace): outer_pb.RelifeAtPlace;

        /**
         * Encodes the specified RelifeAtPlace message. Does not implicitly {@link outer_pb.RelifeAtPlace.verify|verify} messages.
         * @param message RelifeAtPlace message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IRelifeAtPlace, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a RelifeAtPlace message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RelifeAtPlace
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.RelifeAtPlace;
    }

    /** Properties of an EmptyRequest. */
    interface IEmptyRequest {

        /** EmptyRequest ErrCode */
        ErrCode?: (number|null);
    }

    /** Represents an EmptyRequest. */
    class EmptyRequest implements IEmptyRequest {

        /**
         * Constructs a new EmptyRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IEmptyRequest);

        /** EmptyRequest ErrCode. */
        public ErrCode: number;

        /**
         * Creates a new EmptyRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EmptyRequest instance
         */
        public static create(properties?: outer_pb.IEmptyRequest): outer_pb.EmptyRequest;

        /**
         * Encodes the specified EmptyRequest message. Does not implicitly {@link outer_pb.EmptyRequest.verify|verify} messages.
         * @param message EmptyRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IEmptyRequest, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes an EmptyRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EmptyRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.EmptyRequest;
    }

    /** Properties of a GetLineList. */
    interface IGetLineList {

        /** GetLineList LineInfo */
        LineInfo?: (outer_pb.ILineInfo[]|null);
    }

    /** Represents a GetLineList. */
    class GetLineList implements IGetLineList {

        /**
         * Constructs a new GetLineList.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IGetLineList);

        /** GetLineList LineInfo. */
        public LineInfo: outer_pb.ILineInfo[];

        /**
         * Creates a new GetLineList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetLineList instance
         */
        public static create(properties?: outer_pb.IGetLineList): outer_pb.GetLineList;

        /**
         * Encodes the specified GetLineList message. Does not implicitly {@link outer_pb.GetLineList.verify|verify} messages.
         * @param message GetLineList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IGetLineList, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a GetLineList message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetLineList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.GetLineList;
    }

    /** Properties of a LineInfo. */
    interface ILineInfo {

        /** LineInfo LineLv */
        LineLv?: (number|null);

        /** LineInfo PlayerNum */
        PlayerNum?: (number|null);

        /** LineInfo LineId */
        LineId?: (string|null);

        /** LineInfo Time */
        Time?: (number|Long|null);
    }

    /** Represents a LineInfo. */
    class LineInfo implements ILineInfo {

        /**
         * Constructs a new LineInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ILineInfo);

        /** LineInfo LineLv. */
        public LineLv: number;

        /** LineInfo PlayerNum. */
        public PlayerNum: number;

        /** LineInfo LineId. */
        public LineId: string;

        /** LineInfo Time. */
        public Time: (number|Long);

        /**
         * Creates a new LineInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LineInfo instance
         */
        public static create(properties?: outer_pb.ILineInfo): outer_pb.LineInfo;

        /**
         * Encodes the specified LineInfo message. Does not implicitly {@link outer_pb.LineInfo.verify|verify} messages.
         * @param message LineInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ILineInfo, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a LineInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LineInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.LineInfo;
    }

    /** Properties of an AutoGetHpMpAgSd. */
    interface IAutoGetHpMpAgSd {

        /** AutoGetHpMpAgSd Hp */
        Hp?: (number|null);

        /** AutoGetHpMpAgSd Mp */
        Mp?: (number|null);

        /** AutoGetHpMpAgSd Ag */
        Ag?: (number|null);

        /** AutoGetHpMpAgSd Sd */
        Sd?: (number|null);

        /** AutoGetHpMpAgSd Who */
        Who?: (number|Long|null);

        /** AutoGetHpMpAgSd GetExp */
        GetExp?: (number|Long|null);

        /** AutoGetHpMpAgSd RedPoint */
        RedPoint?: (number|null);

        /** AutoGetHpMpAgSd HuDunTime */
        HuDunTime?: (number|Long|null);

        /** AutoGetHpMpAgSd CurExp */
        CurExp?: (number|Long|null);

        /** AutoGetHpMpAgSd CurHp */
        CurHp?: (number|null);
    }

    /** Represents an AutoGetHpMpAgSd. */
    class AutoGetHpMpAgSd implements IAutoGetHpMpAgSd {

        /**
         * Constructs a new AutoGetHpMpAgSd.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IAutoGetHpMpAgSd);

        /** AutoGetHpMpAgSd Hp. */
        public Hp: number;

        /** AutoGetHpMpAgSd Mp. */
        public Mp: number;

        /** AutoGetHpMpAgSd Ag. */
        public Ag: number;

        /** AutoGetHpMpAgSd Sd. */
        public Sd: number;

        /** AutoGetHpMpAgSd Who. */
        public Who: (number|Long);

        /** AutoGetHpMpAgSd GetExp. */
        public GetExp: (number|Long);

        /** AutoGetHpMpAgSd RedPoint. */
        public RedPoint: number;

        /** AutoGetHpMpAgSd HuDunTime. */
        public HuDunTime: (number|Long);

        /** AutoGetHpMpAgSd CurExp. */
        public CurExp: (number|Long);

        /** AutoGetHpMpAgSd CurHp. */
        public CurHp: number;

        /**
         * Creates a new AutoGetHpMpAgSd instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AutoGetHpMpAgSd instance
         */
        public static create(properties?: outer_pb.IAutoGetHpMpAgSd): outer_pb.AutoGetHpMpAgSd;

        /**
         * Encodes the specified AutoGetHpMpAgSd message. Does not implicitly {@link outer_pb.AutoGetHpMpAgSd.verify|verify} messages.
         * @param message AutoGetHpMpAgSd message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IAutoGetHpMpAgSd, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes an AutoGetHpMpAgSd message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AutoGetHpMpAgSd
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.AutoGetHpMpAgSd;
    }

    /** Properties of a RoleDropEquip. */
    interface IRoleDropEquip {

        /** RoleDropEquip Who */
        Who?: (number|Long|null);

        /** RoleDropEquip BodyType */
        BodyType?: (number|null);

        /** RoleDropEquip IsBody */
        IsBody?: (boolean|null);

        /** RoleDropEquip DropItem */
        DropItem?: (outer_pb.IDropItem|null);

        /** RoleDropEquip BasePros */
        BasePros?: (outer_pb.IBasePros|null);
    }

    /** Represents a RoleDropEquip. */
    class RoleDropEquip implements IRoleDropEquip {

        /**
         * Constructs a new RoleDropEquip.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IRoleDropEquip);

        /** RoleDropEquip Who. */
        public Who: (number|Long);

        /** RoleDropEquip BodyType. */
        public BodyType: number;

        /** RoleDropEquip IsBody. */
        public IsBody: boolean;

        /** RoleDropEquip DropItem. */
        public DropItem?: (outer_pb.IDropItem|null);

        /** RoleDropEquip BasePros. */
        public BasePros?: (outer_pb.IBasePros|null);

        /**
         * Creates a new RoleDropEquip instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoleDropEquip instance
         */
        public static create(properties?: outer_pb.IRoleDropEquip): outer_pb.RoleDropEquip;

        /**
         * Encodes the specified RoleDropEquip message. Does not implicitly {@link outer_pb.RoleDropEquip.verify|verify} messages.
         * @param message RoleDropEquip message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IRoleDropEquip, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a RoleDropEquip message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoleDropEquip
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.RoleDropEquip;
    }

    /** Properties of a ChatMsg. */
    interface IChatMsg {

        /** ChatMsg msg */
        msg?: (string|null);

        /** ChatMsg Chanel */
        Chanel?: (number|null);

        /** ChatMsg Name */
        Name?: (string|null);

        /** ChatMsg Position */
        Position?: (outer_pb.IPosition|null);

        /** ChatMsg Items */
        Items?: (outer_pb.IDropItem[]|null);

        /** ChatMsg FaceIcon */
        FaceIcon?: (number|null);

        /** ChatMsg OtherName */
        OtherName?: (string|null);

        /** ChatMsg HasRead */
        HasRead?: (boolean|null);

        /** ChatMsg FromSid */
        FromSid?: (string|null);

        /** ChatMsg Time */
        Time?: (number|Long|null);

        /** ChatMsg MonsterId */
        MonsterId?: (number|null);

        /** ChatMsg MonsterType */
        MonsterType?: (number|null);

        /** ChatMsg ErrCode */
        ErrCode?: (number|null);

        /** ChatMsg Num */
        Num?: (number|Long|null);

        /** ChatMsg IsSay */
        IsSay?: (boolean|null);

        /** ChatMsg Id */
        Id?: (number|Long|null);

        /** ChatMsg OtherId */
        OtherId?: (number|Long|null);
    }

    /** Represents a ChatMsg. */
    class ChatMsg implements IChatMsg {

        /**
         * Constructs a new ChatMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IChatMsg);

        /** ChatMsg msg. */
        public msg: string;

        /** ChatMsg Chanel. */
        public Chanel: number;

        /** ChatMsg Name. */
        public Name: string;

        /** ChatMsg Position. */
        public Position?: (outer_pb.IPosition|null);

        /** ChatMsg Items. */
        public Items: outer_pb.IDropItem[];

        /** ChatMsg FaceIcon. */
        public FaceIcon: number;

        /** ChatMsg OtherName. */
        public OtherName: string;

        /** ChatMsg HasRead. */
        public HasRead: boolean;

        /** ChatMsg FromSid. */
        public FromSid: string;

        /** ChatMsg Time. */
        public Time: (number|Long);

        /** ChatMsg MonsterId. */
        public MonsterId: number;

        /** ChatMsg MonsterType. */
        public MonsterType: number;

        /** ChatMsg ErrCode. */
        public ErrCode: number;

        /** ChatMsg Num. */
        public Num: (number|Long);

        /** ChatMsg IsSay. */
        public IsSay: boolean;

        /** ChatMsg Id. */
        public Id: (number|Long);

        /** ChatMsg OtherId. */
        public OtherId: (number|Long);

        /**
         * Creates a new ChatMsg instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChatMsg instance
         */
        public static create(properties?: outer_pb.IChatMsg): outer_pb.ChatMsg;

        /**
         * Encodes the specified ChatMsg message. Does not implicitly {@link outer_pb.ChatMsg.verify|verify} messages.
         * @param message ChatMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IChatMsg, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a ChatMsg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChatMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.ChatMsg;
    }

    /** Properties of a YwBossList. */
    interface IYwBossList {

        /** YwBossList List */
        List?: (outer_pb.IYwBossDatas[]|null);
    }

    /** Represents a YwBossList. */
    class YwBossList implements IYwBossList {

        /**
         * Constructs a new YwBossList.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IYwBossList);

        /** YwBossList List. */
        public List: outer_pb.IYwBossDatas[];

        /**
         * Creates a new YwBossList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns YwBossList instance
         */
        public static create(properties?: outer_pb.IYwBossList): outer_pb.YwBossList;

        /**
         * Encodes the specified YwBossList message. Does not implicitly {@link outer_pb.YwBossList.verify|verify} messages.
         * @param message YwBossList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IYwBossList, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a YwBossList message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns YwBossList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.YwBossList;
    }

    /** Properties of a YwBossDatas. */
    interface IYwBossDatas {

        /** YwBossDatas List */
        List?: ({ [k: string]: outer_pb.IYwBossData }|null);
    }

    /** Represents a YwBossDatas. */
    class YwBossDatas implements IYwBossDatas {

        /**
         * Constructs a new YwBossDatas.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IYwBossDatas);

        /** YwBossDatas List. */
        public List: { [k: string]: outer_pb.IYwBossData };

        /**
         * Creates a new YwBossDatas instance using the specified properties.
         * @param [properties] Properties to set
         * @returns YwBossDatas instance
         */
        public static create(properties?: outer_pb.IYwBossDatas): outer_pb.YwBossDatas;

        /**
         * Encodes the specified YwBossDatas message. Does not implicitly {@link outer_pb.YwBossDatas.verify|verify} messages.
         * @param message YwBossDatas message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IYwBossDatas, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a YwBossDatas message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns YwBossDatas
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.YwBossDatas;
    }

    /** Properties of a YwBossData. */
    interface IYwBossData {

        /** YwBossData Pos */
        Pos?: (outer_pb.IPosition|null);

        /** YwBossData Id */
        Id?: (number|null);

        /** YwBossData Type */
        Type?: (number|null);

        /** YwBossData Index */
        Index?: (number|null);

        /** YwBossData LineLv */
        LineLv?: (number|null);
    }

    /** Represents a YwBossData. */
    class YwBossData implements IYwBossData {

        /**
         * Constructs a new YwBossData.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IYwBossData);

        /** YwBossData Pos. */
        public Pos?: (outer_pb.IPosition|null);

        /** YwBossData Id. */
        public Id: number;

        /** YwBossData Type. */
        public Type: number;

        /** YwBossData Index. */
        public Index: number;

        /** YwBossData LineLv. */
        public LineLv: number;

        /**
         * Creates a new YwBossData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns YwBossData instance
         */
        public static create(properties?: outer_pb.IYwBossData): outer_pb.YwBossData;

        /**
         * Encodes the specified YwBossData message. Does not implicitly {@link outer_pb.YwBossData.verify|verify} messages.
         * @param message YwBossData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IYwBossData, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a YwBossData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns YwBossData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.YwBossData;
    }

    /** Properties of a Position. */
    interface IPosition {

        /** Position RoomId */
        RoomId?: (number|null);

        /** Position LineId */
        LineId?: (string|null);

        /** Position I */
        I?: (number|null);

        /** Position J */
        J?: (number|null);

        /** Position WorldLv */
        WorldLv?: (number|null);
    }

    /** Represents a Position. */
    class Position implements IPosition {

        /**
         * Constructs a new Position.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IPosition);

        /** Position RoomId. */
        public RoomId: number;

        /** Position LineId. */
        public LineId: string;

        /** Position I. */
        public I: number;

        /** Position J. */
        public J: number;

        /** Position WorldLv. */
        public WorldLv: number;

        /**
         * Creates a new Position instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Position instance
         */
        public static create(properties?: outer_pb.IPosition): outer_pb.Position;

        /**
         * Encodes the specified Position message. Does not implicitly {@link outer_pb.Position.verify|verify} messages.
         * @param message Position message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IPosition, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a Position message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Position
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.Position;
    }

    /** Properties of a WorldBossInfo. */
    interface IWorldBossInfo {

        /** WorldBossInfo Id */
        Id?: (number|null);

        /** WorldBossInfo Pos */
        Pos?: (outer_pb.IPosition|null);

        /** WorldBossInfo State */
        State?: (number|null);

        /** WorldBossInfo Index */
        Index?: (number|null);

        /** WorldBossInfo LineLv */
        LineLv?: (number|null);
    }

    /** Represents a WorldBossInfo. */
    class WorldBossInfo implements IWorldBossInfo {

        /**
         * Constructs a new WorldBossInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IWorldBossInfo);

        /** WorldBossInfo Id. */
        public Id: number;

        /** WorldBossInfo Pos. */
        public Pos?: (outer_pb.IPosition|null);

        /** WorldBossInfo State. */
        public State: number;

        /** WorldBossInfo Index. */
        public Index: number;

        /** WorldBossInfo LineLv. */
        public LineLv: number;

        /**
         * Creates a new WorldBossInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WorldBossInfo instance
         */
        public static create(properties?: outer_pb.IWorldBossInfo): outer_pb.WorldBossInfo;

        /**
         * Encodes the specified WorldBossInfo message. Does not implicitly {@link outer_pb.WorldBossInfo.verify|verify} messages.
         * @param message WorldBossInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IWorldBossInfo, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a WorldBossInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WorldBossInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.WorldBossInfo;
    }

    /** Properties of a GetWorldBossList. */
    interface IGetWorldBossList {

        /** GetWorldBossList IsPrivate */
        IsPrivate?: (boolean|null);

        /** GetWorldBossList List */
        List?: (outer_pb.IWorldBossInfo[]|null);
    }

    /** Represents a GetWorldBossList. */
    class GetWorldBossList implements IGetWorldBossList {

        /**
         * Constructs a new GetWorldBossList.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IGetWorldBossList);

        /** GetWorldBossList IsPrivate. */
        public IsPrivate: boolean;

        /** GetWorldBossList List. */
        public List: outer_pb.IWorldBossInfo[];

        /**
         * Creates a new GetWorldBossList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetWorldBossList instance
         */
        public static create(properties?: outer_pb.IGetWorldBossList): outer_pb.GetWorldBossList;

        /**
         * Encodes the specified GetWorldBossList message. Does not implicitly {@link outer_pb.GetWorldBossList.verify|verify} messages.
         * @param message GetWorldBossList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IGetWorldBossList, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a GetWorldBossList message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetWorldBossList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.GetWorldBossList;
    }

    /** Properties of an Item. */
    interface IItem {

        /** Item Id */
        Id?: (number|null);

        /** Item Num */
        Num?: (number|null);
    }

    /** Represents an Item. */
    class Item implements IItem {

        /**
         * Constructs a new Item.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IItem);

        /** Item Id. */
        public Id: number;

        /** Item Num. */
        public Num: number;

        /**
         * Creates a new Item instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Item instance
         */
        public static create(properties?: outer_pb.IItem): outer_pb.Item;

        /**
         * Encodes the specified Item message. Does not implicitly {@link outer_pb.Item.verify|verify} messages.
         * @param message Item message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IItem, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes an Item message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.Item;
    }

    /** Properties of a HandMoveToPos. */
    interface IHandMoveToPos {

        /** HandMoveToPos I */
        I?: (number|null);

        /** HandMoveToPos J */
        J?: (number|null);

        /** HandMoveToPos X */
        X?: (number|null);

        /** HandMoveToPos Y */
        Y?: (number|null);

        /** HandMoveToPos Version */
        Version?: (number|null);

        /** HandMoveToPos IsEnd */
        IsEnd?: (boolean|null);

        /** HandMoveToPos TimeC */
        TimeC?: (number|Long|null);
    }

    /** Represents a HandMoveToPos. */
    class HandMoveToPos implements IHandMoveToPos {

        /**
         * Constructs a new HandMoveToPos.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IHandMoveToPos);

        /** HandMoveToPos I. */
        public I: number;

        /** HandMoveToPos J. */
        public J: number;

        /** HandMoveToPos X. */
        public X: number;

        /** HandMoveToPos Y. */
        public Y: number;

        /** HandMoveToPos Version. */
        public Version: number;

        /** HandMoveToPos IsEnd. */
        public IsEnd: boolean;

        /** HandMoveToPos TimeC. */
        public TimeC: (number|Long);

        /**
         * Creates a new HandMoveToPos instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HandMoveToPos instance
         */
        public static create(properties?: outer_pb.IHandMoveToPos): outer_pb.HandMoveToPos;

        /**
         * Encodes the specified HandMoveToPos message. Does not implicitly {@link outer_pb.HandMoveToPos.verify|verify} messages.
         * @param message HandMoveToPos message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IHandMoveToPos, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a HandMoveToPos message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HandMoveToPos
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.HandMoveToPos;
    }

    /** Properties of a PkAct. */
    interface IPkAct {

        /** PkAct ErrCode */
        ErrCode?: (number|null);

        /** PkAct Type */
        Type?: (number|null);

        /** PkAct Who */
        Who?: (string|null);

        /** PkAct List */
        List?: (outer_pb.ITeamInfo[]|null);

        /** PkAct CurSort */
        CurSort?: (number|null);

        /** PkAct MyTeam */
        MyTeam?: (outer_pb.ITeamInfo|null);

        /** PkAct Page */
        Page?: (number|null);

        /** PkAct SeasonT */
        SeasonT?: (number|Long|null);

        /** PkAct Sort1 */
        Sort1?: (number|null);

        /** PkAct HasGot1 */
        HasGot1?: (boolean|null);

        /** PkAct OldSort */
        OldSort?: (number|null);

        /** PkAct OldJf */
        OldJf?: (number|null);

        /** PkAct HasGotOld */
        HasGotOld?: (boolean|null);

        /** PkAct PkNum */
        PkNum?: (number|null);

        /** PkAct TotalPage */
        TotalPage?: (number|null);

        /** PkAct IsKf */
        IsKf?: (boolean|null);

        /** PkAct Items */
        Items?: ({ [k: string]: number }|null);

        /** PkAct Equips */
        Equips?: (outer_pb.IEquip[]|null);

        /** PkAct Id */
        Id?: (number|null);

        /** PkAct Jf1 */
        Jf1?: (number|null);

        /** PkAct PkHis */
        PkHis?: (outer_pb.ICkHis[]|null);
    }

    /** Represents a PkAct. */
    class PkAct implements IPkAct {

        /**
         * Constructs a new PkAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IPkAct);

        /** PkAct ErrCode. */
        public ErrCode: number;

        /** PkAct Type. */
        public Type: number;

        /** PkAct Who. */
        public Who: string;

        /** PkAct List. */
        public List: outer_pb.ITeamInfo[];

        /** PkAct CurSort. */
        public CurSort: number;

        /** PkAct MyTeam. */
        public MyTeam?: (outer_pb.ITeamInfo|null);

        /** PkAct Page. */
        public Page: number;

        /** PkAct SeasonT. */
        public SeasonT: (number|Long);

        /** PkAct Sort1. */
        public Sort1: number;

        /** PkAct HasGot1. */
        public HasGot1: boolean;

        /** PkAct OldSort. */
        public OldSort: number;

        /** PkAct OldJf. */
        public OldJf: number;

        /** PkAct HasGotOld. */
        public HasGotOld: boolean;

        /** PkAct PkNum. */
        public PkNum: number;

        /** PkAct TotalPage. */
        public TotalPage: number;

        /** PkAct IsKf. */
        public IsKf: boolean;

        /** PkAct Items. */
        public Items: { [k: string]: number };

        /** PkAct Equips. */
        public Equips: outer_pb.IEquip[];

        /** PkAct Id. */
        public Id: number;

        /** PkAct Jf1. */
        public Jf1: number;

        /** PkAct PkHis. */
        public PkHis: outer_pb.ICkHis[];

        /**
         * Creates a new PkAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PkAct instance
         */
        public static create(properties?: outer_pb.IPkAct): outer_pb.PkAct;

        /**
         * Encodes the specified PkAct message. Does not implicitly {@link outer_pb.PkAct.verify|verify} messages.
         * @param message PkAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IPkAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a PkAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PkAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.PkAct;
    }

    /** Properties of a PkRankInfo. */
    interface IPkRankInfo {

        /** PkRankInfo Sort */
        Sort?: (number|null);

        /** PkRankInfo HasGot */
        HasGot?: (boolean|null);

        /** PkRankInfo Jf */
        Jf?: (number|null);
    }

    /** Represents a PkRankInfo. */
    class PkRankInfo implements IPkRankInfo {

        /**
         * Constructs a new PkRankInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IPkRankInfo);

        /** PkRankInfo Sort. */
        public Sort: number;

        /** PkRankInfo HasGot. */
        public HasGot: boolean;

        /** PkRankInfo Jf. */
        public Jf: number;

        /**
         * Creates a new PkRankInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PkRankInfo instance
         */
        public static create(properties?: outer_pb.IPkRankInfo): outer_pb.PkRankInfo;

        /**
         * Encodes the specified PkRankInfo message. Does not implicitly {@link outer_pb.PkRankInfo.verify|verify} messages.
         * @param message PkRankInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IPkRankInfo, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a PkRankInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PkRankInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.PkRankInfo;
    }

    /** Properties of a TeamInfo. */
    interface ITeamInfo {

        /** TeamInfo TeamId */
        TeamId?: (number|null);

        /** TeamInfo OwnerN */
        OwnerN?: (string|null);

        /** TeamInfo Menbers */
        Menbers?: (outer_pb.IRoleInfo[]|null);

        /** TeamInfo NeedLv */
        NeedLv?: (number|null);

        /** TeamInfo NeedRoleType */
        NeedRoleType?: (number|null);

        /** TeamInfo IsAutoAgree */
        IsAutoAgree?: (boolean|null);

        /** TeamInfo DropSet */
        DropSet?: (number|null);

        /** TeamInfo OwnerId */
        OwnerId?: (number|Long|null);

        /** TeamInfo CreatTime */
        CreatTime?: (number|Long|null);

        /** TeamInfo PkPos */
        PkPos?: ({ [k: string]: number }|null);

        /** TeamInfo BuffHoleId */
        BuffHoleId?: (number|null);

        /** TeamInfo KfBuffHoleId */
        KfBuffHoleId?: (number|null);

        /** TeamInfo PkJf */
        PkJf?: (number|null);

        /** TeamInfo WinNum */
        WinNum?: (number|null);

        /** TeamInfo PkTime */
        PkTime?: (number|Long|null);

        /** TeamInfo KfPkJf */
        KfPkJf?: (number|null);

        /** TeamInfo KfWinNum */
        KfWinNum?: (number|null);

        /** TeamInfo KfPkTime */
        KfPkTime?: (number|Long|null);

        /** TeamInfo Sid */
        Sid?: (string|null);
    }

    /** Represents a TeamInfo. */
    class TeamInfo implements ITeamInfo {

        /**
         * Constructs a new TeamInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ITeamInfo);

        /** TeamInfo TeamId. */
        public TeamId: number;

        /** TeamInfo OwnerN. */
        public OwnerN: string;

        /** TeamInfo Menbers. */
        public Menbers: outer_pb.IRoleInfo[];

        /** TeamInfo NeedLv. */
        public NeedLv: number;

        /** TeamInfo NeedRoleType. */
        public NeedRoleType: number;

        /** TeamInfo IsAutoAgree. */
        public IsAutoAgree: boolean;

        /** TeamInfo DropSet. */
        public DropSet: number;

        /** TeamInfo OwnerId. */
        public OwnerId: (number|Long);

        /** TeamInfo CreatTime. */
        public CreatTime: (number|Long);

        /** TeamInfo PkPos. */
        public PkPos: { [k: string]: number };

        /** TeamInfo BuffHoleId. */
        public BuffHoleId: number;

        /** TeamInfo KfBuffHoleId. */
        public KfBuffHoleId: number;

        /** TeamInfo PkJf. */
        public PkJf: number;

        /** TeamInfo WinNum. */
        public WinNum: number;

        /** TeamInfo PkTime. */
        public PkTime: (number|Long);

        /** TeamInfo KfPkJf. */
        public KfPkJf: number;

        /** TeamInfo KfWinNum. */
        public KfWinNum: number;

        /** TeamInfo KfPkTime. */
        public KfPkTime: (number|Long);

        /** TeamInfo Sid. */
        public Sid: string;

        /**
         * Creates a new TeamInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TeamInfo instance
         */
        public static create(properties?: outer_pb.ITeamInfo): outer_pb.TeamInfo;

        /**
         * Encodes the specified TeamInfo message. Does not implicitly {@link outer_pb.TeamInfo.verify|verify} messages.
         * @param message TeamInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ITeamInfo, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a TeamInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TeamInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.TeamInfo;
    }

    /** Properties of a RequestJoinTeam. */
    interface IRequestJoinTeam {

        /** RequestJoinTeam TeamId */
        TeamId?: (number|null);
    }

    /** Represents a RequestJoinTeam. */
    class RequestJoinTeam implements IRequestJoinTeam {

        /**
         * Constructs a new RequestJoinTeam.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IRequestJoinTeam);

        /** RequestJoinTeam TeamId. */
        public TeamId: number;

        /**
         * Creates a new RequestJoinTeam instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RequestJoinTeam instance
         */
        public static create(properties?: outer_pb.IRequestJoinTeam): outer_pb.RequestJoinTeam;

        /**
         * Encodes the specified RequestJoinTeam message. Does not implicitly {@link outer_pb.RequestJoinTeam.verify|verify} messages.
         * @param message RequestJoinTeam message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IRequestJoinTeam, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a RequestJoinTeam message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RequestJoinTeam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.RequestJoinTeam;
    }

    /** Properties of a TeamAct. */
    interface ITeamAct {

        /** TeamAct Who */
        Who?: (string|null);

        /** TeamAct TeamId */
        TeamId?: (number|null);

        /** TeamAct TeamInfo */
        TeamInfo?: (outer_pb.ITeamInfo|null);

        /** TeamAct ErrCode */
        ErrCode?: (number|null);

        /** TeamAct NeedLv */
        NeedLv?: (number|null);

        /** TeamAct NeedRoleType */
        NeedRoleType?: (number|null);

        /** TeamAct IsAgree */
        IsAgree?: (boolean|null);

        /** TeamAct ReqNum */
        ReqNum?: (number|null);

        /** TeamAct Id */
        Id?: (number|Long|null);

        /** TeamAct TeamList */
        TeamList?: (outer_pb.ITeamInfo[]|null);

        /** TeamAct Page */
        Page?: (number|null);

        /** TeamAct TotalPage */
        TotalPage?: (number|null);

        /** TeamAct RoleList */
        RoleList?: (outer_pb.IRoleInfo[]|null);

        /** TeamAct DropSet */
        DropSet?: (number|null);

        /** TeamAct PkPos */
        PkPos?: ({ [k: string]: number }|null);

        /** TeamAct PosList */
        PosList?: ({ [k: string]: outer_pb.IPosition }|null);
    }

    /** Represents a TeamAct. */
    class TeamAct implements ITeamAct {

        /**
         * Constructs a new TeamAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ITeamAct);

        /** TeamAct Who. */
        public Who: string;

        /** TeamAct TeamId. */
        public TeamId: number;

        /** TeamAct TeamInfo. */
        public TeamInfo?: (outer_pb.ITeamInfo|null);

        /** TeamAct ErrCode. */
        public ErrCode: number;

        /** TeamAct NeedLv. */
        public NeedLv: number;

        /** TeamAct NeedRoleType. */
        public NeedRoleType: number;

        /** TeamAct IsAgree. */
        public IsAgree: boolean;

        /** TeamAct ReqNum. */
        public ReqNum: number;

        /** TeamAct Id. */
        public Id: (number|Long);

        /** TeamAct TeamList. */
        public TeamList: outer_pb.ITeamInfo[];

        /** TeamAct Page. */
        public Page: number;

        /** TeamAct TotalPage. */
        public TotalPage: number;

        /** TeamAct RoleList. */
        public RoleList: outer_pb.IRoleInfo[];

        /** TeamAct DropSet. */
        public DropSet: number;

        /** TeamAct PkPos. */
        public PkPos: { [k: string]: number };

        /** TeamAct PosList. */
        public PosList: { [k: string]: outer_pb.IPosition };

        /**
         * Creates a new TeamAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TeamAct instance
         */
        public static create(properties?: outer_pb.ITeamAct): outer_pb.TeamAct;

        /**
         * Encodes the specified TeamAct message. Does not implicitly {@link outer_pb.TeamAct.verify|verify} messages.
         * @param message TeamAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ITeamAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a TeamAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TeamAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.TeamAct;
    }

    /** Properties of a ZmAct. */
    interface IZmAct {

        /** ZmAct ErrCode */
        ErrCode?: (number|null);

        /** ZmAct MyGx */
        MyGx?: (number|null);

        /** ZmAct Id */
        Id?: (number|Long|null);

        /** ZmAct ZmList */
        ZmList?: (outer_pb.IZmMiniInfo[]|null);

        /** ZmAct NewJob */
        NewJob?: (number|null);

        /** ZmAct Who */
        Who?: (string|null);

        /** ZmAct QdDay */
        QdDay?: (number|null);

        /** ZmAct ExitTime */
        ExitTime?: (number|Long|null);

        /** ZmAct Num */
        Num?: (number|null);

        /** ZmAct Type */
        Type?: (number|null);

        /** ZmAct Page */
        Page?: (number|null);

        /** ZmAct TotalPage */
        TotalPage?: (number|null);

        /** ZmAct IsAgree */
        IsAgree?: (boolean|null);

        /** ZmAct Name */
        Name?: (string|null);

        /** ZmAct Owner */
        Owner?: (string|null);

        /** ZmAct PagGold */
        PagGold?: (number|null);

        /** ZmAct UpBuffNum */
        UpBuffNum?: (number|null);

        /** ZmAct AddCapNum */
        AddCapNum?: (number|null);

        /** ZmAct HomeBuild */
        HomeBuild?: (outer_pb.IBuild|null);

        /** ZmAct JTBuffs */
        JTBuffs?: (outer_pb.IBuild[]|null);

        /** ZmAct Hunters */
        Hunters?: (outer_pb.IBuild[]|null);

        /** ZmAct Gx */
        Gx?: (number|Long|null);

        /** ZmAct UsedGx */
        UsedGx?: (number|Long|null);

        /** ZmAct ZySpNum */
        ZySpNum?: (number|null);

        /** ZmAct BzSpNum */
        BzSpNum?: (number|null);

        /** ZmAct DiaNum */
        DiaNum?: (number|Long|null);

        /** ZmAct PointNum */
        PointNum?: (number|null);

        /** ZmAct BiaoNum */
        BiaoNum?: (number|null);

        /** ZmAct GpNum */
        GpNum?: (number|null);

        /** ZmAct Equips */
        Equips?: (outer_pb.IEquip[]|null);

        /** ZmAct Items */
        Items?: ({ [k: string]: number }|null);

        /** ZmAct Menbers */
        Menbers?: (outer_pb.IZmRoleInfo[]|null);

        /** ZmAct ZmBossIndex */
        ZmBossIndex?: (number|null);

        /** ZmAct NeedLv */
        NeedLv?: (number|null);

        /** ZmAct NeedZs */
        NeedZs?: (number|null);

        /** ZmAct IsAutoAgree */
        IsAutoAgree?: (boolean|null);

        /** ZmAct BossId */
        BossId?: (number|null);

        /** ZmAct BossHp */
        BossHp?: (number|Long|null);

        /** ZmAct BossState */
        BossState?: (number|null);

        /** ZmAct RoleList */
        RoleList?: (outer_pb.IRoleInfo[]|null);

        /** ZmAct Len */
        Len?: (number|null);

        /** ZmAct JuanConf */
        JuanConf?: (number[]|null);

        /** ZmAct Dmg */
        Dmg?: (number|Long|null);

        /** ZmAct DmgPh */
        DmgPh?: ({ [k: string]: number }|null);

        /** ZmAct ReliveNum */
        ReliveNum?: (number|null);

        /** ZmAct TotalDmg */
        TotalDmg?: (number|Long|null);

        /** ZmAct CkHis */
        CkHis?: (outer_pb.ICkHis[]|null);

        /** ZmAct Ck */
        Ck?: ({ [k: string]: outer_pb.IZmCkItem }|null);

        /** ZmAct IsSj */
        IsSj?: (boolean|null);

        /** ZmAct QdNum */
        QdNum?: (number|null);
    }

    /** Represents a ZmAct. */
    class ZmAct implements IZmAct {

        /**
         * Constructs a new ZmAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IZmAct);

        /** ZmAct ErrCode. */
        public ErrCode: number;

        /** ZmAct MyGx. */
        public MyGx: number;

        /** ZmAct Id. */
        public Id: (number|Long);

        /** ZmAct ZmList. */
        public ZmList: outer_pb.IZmMiniInfo[];

        /** ZmAct NewJob. */
        public NewJob: number;

        /** ZmAct Who. */
        public Who: string;

        /** ZmAct QdDay. */
        public QdDay: number;

        /** ZmAct ExitTime. */
        public ExitTime: (number|Long);

        /** ZmAct Num. */
        public Num: number;

        /** ZmAct Type. */
        public Type: number;

        /** ZmAct Page. */
        public Page: number;

        /** ZmAct TotalPage. */
        public TotalPage: number;

        /** ZmAct IsAgree. */
        public IsAgree: boolean;

        /** ZmAct Name. */
        public Name: string;

        /** ZmAct Owner. */
        public Owner: string;

        /** ZmAct PagGold. */
        public PagGold: number;

        /** ZmAct UpBuffNum. */
        public UpBuffNum: number;

        /** ZmAct AddCapNum. */
        public AddCapNum: number;

        /** ZmAct HomeBuild. */
        public HomeBuild?: (outer_pb.IBuild|null);

        /** ZmAct JTBuffs. */
        public JTBuffs: outer_pb.IBuild[];

        /** ZmAct Hunters. */
        public Hunters: outer_pb.IBuild[];

        /** ZmAct Gx. */
        public Gx: (number|Long);

        /** ZmAct UsedGx. */
        public UsedGx: (number|Long);

        /** ZmAct ZySpNum. */
        public ZySpNum: number;

        /** ZmAct BzSpNum. */
        public BzSpNum: number;

        /** ZmAct DiaNum. */
        public DiaNum: (number|Long);

        /** ZmAct PointNum. */
        public PointNum: number;

        /** ZmAct BiaoNum. */
        public BiaoNum: number;

        /** ZmAct GpNum. */
        public GpNum: number;

        /** ZmAct Equips. */
        public Equips: outer_pb.IEquip[];

        /** ZmAct Items. */
        public Items: { [k: string]: number };

        /** ZmAct Menbers. */
        public Menbers: outer_pb.IZmRoleInfo[];

        /** ZmAct ZmBossIndex. */
        public ZmBossIndex: number;

        /** ZmAct NeedLv. */
        public NeedLv: number;

        /** ZmAct NeedZs. */
        public NeedZs: number;

        /** ZmAct IsAutoAgree. */
        public IsAutoAgree: boolean;

        /** ZmAct BossId. */
        public BossId: number;

        /** ZmAct BossHp. */
        public BossHp: (number|Long);

        /** ZmAct BossState. */
        public BossState: number;

        /** ZmAct RoleList. */
        public RoleList: outer_pb.IRoleInfo[];

        /** ZmAct Len. */
        public Len: number;

        /** ZmAct JuanConf. */
        public JuanConf: number[];

        /** ZmAct Dmg. */
        public Dmg: (number|Long);

        /** ZmAct DmgPh. */
        public DmgPh: { [k: string]: number };

        /** ZmAct ReliveNum. */
        public ReliveNum: number;

        /** ZmAct TotalDmg. */
        public TotalDmg: (number|Long);

        /** ZmAct CkHis. */
        public CkHis: outer_pb.ICkHis[];

        /** ZmAct Ck. */
        public Ck: { [k: string]: outer_pb.IZmCkItem };

        /** ZmAct IsSj. */
        public IsSj: boolean;

        /** ZmAct QdNum. */
        public QdNum: number;

        /**
         * Creates a new ZmAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ZmAct instance
         */
        public static create(properties?: outer_pb.IZmAct): outer_pb.ZmAct;

        /**
         * Encodes the specified ZmAct message. Does not implicitly {@link outer_pb.ZmAct.verify|verify} messages.
         * @param message ZmAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IZmAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a ZmAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ZmAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.ZmAct;
    }

    /** Properties of a ZmMiniInfo. */
    interface IZmMiniInfo {

        /** ZmMiniInfo Name */
        Name?: (string|null);

        /** ZmMiniInfo Owner */
        Owner?: (string|null);

        /** ZmMiniInfo Lv */
        Lv?: (number|null);

        /** ZmMiniInfo NeedLv */
        NeedLv?: (number|null);

        /** ZmMiniInfo Num */
        Num?: (number|null);

        /** ZmMiniInfo NeedZs */
        NeedZs?: (number|null);

        /** ZmMiniInfo AddCap */
        AddCap?: (number|null);
    }

    /** Represents a ZmMiniInfo. */
    class ZmMiniInfo implements IZmMiniInfo {

        /**
         * Constructs a new ZmMiniInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IZmMiniInfo);

        /** ZmMiniInfo Name. */
        public Name: string;

        /** ZmMiniInfo Owner. */
        public Owner: string;

        /** ZmMiniInfo Lv. */
        public Lv: number;

        /** ZmMiniInfo NeedLv. */
        public NeedLv: number;

        /** ZmMiniInfo Num. */
        public Num: number;

        /** ZmMiniInfo NeedZs. */
        public NeedZs: number;

        /** ZmMiniInfo AddCap. */
        public AddCap: number;

        /**
         * Creates a new ZmMiniInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ZmMiniInfo instance
         */
        public static create(properties?: outer_pb.IZmMiniInfo): outer_pb.ZmMiniInfo;

        /**
         * Encodes the specified ZmMiniInfo message. Does not implicitly {@link outer_pb.ZmMiniInfo.verify|verify} messages.
         * @param message ZmMiniInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IZmMiniInfo, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a ZmMiniInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ZmMiniInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.ZmMiniInfo;
    }

    /** Properties of a ZmCkItem. */
    interface IZmCkItem {

        /** ZmCkItem Uid */
        Uid?: (string|null);

        /** ZmCkItem OwnerId */
        OwnerId?: (number|Long|null);

        /** ZmCkItem Owner */
        Owner?: (string|null);

        /** ZmCkItem Equip */
        Equip?: (outer_pb.IEquip|null);

        /** ZmCkItem Id */
        Id?: (number|null);
    }

    /** Represents a ZmCkItem. */
    class ZmCkItem implements IZmCkItem {

        /**
         * Constructs a new ZmCkItem.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IZmCkItem);

        /** ZmCkItem Uid. */
        public Uid: string;

        /** ZmCkItem OwnerId. */
        public OwnerId: (number|Long);

        /** ZmCkItem Owner. */
        public Owner: string;

        /** ZmCkItem Equip. */
        public Equip?: (outer_pb.IEquip|null);

        /** ZmCkItem Id. */
        public Id: number;

        /**
         * Creates a new ZmCkItem instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ZmCkItem instance
         */
        public static create(properties?: outer_pb.IZmCkItem): outer_pb.ZmCkItem;

        /**
         * Encodes the specified ZmCkItem message. Does not implicitly {@link outer_pb.ZmCkItem.verify|verify} messages.
         * @param message ZmCkItem message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IZmCkItem, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a ZmCkItem message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ZmCkItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.ZmCkItem;
    }

    /** Properties of a CkHis. */
    interface ICkHis {

        /** CkHis Msg */
        Msg?: (string|null);

        /** CkHis Time */
        Time?: (number|Long|null);
    }

    /** Represents a CkHis. */
    class CkHis implements ICkHis {

        /**
         * Constructs a new CkHis.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ICkHis);

        /** CkHis Msg. */
        public Msg: string;

        /** CkHis Time. */
        public Time: (number|Long);

        /**
         * Creates a new CkHis instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CkHis instance
         */
        public static create(properties?: outer_pb.ICkHis): outer_pb.CkHis;

        /**
         * Encodes the specified CkHis message. Does not implicitly {@link outer_pb.CkHis.verify|verify} messages.
         * @param message CkHis message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ICkHis, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a CkHis message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CkHis
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.CkHis;
    }

    /** Properties of a KfCkItem. */
    interface IKfCkItem {

        /** KfCkItem Uid */
        Uid?: (string|null);

        /** KfCkItem Id */
        Id?: (number|null);

        /** KfCkItem Num */
        Num?: (number|null);

        /** KfCkItem Equip */
        Equip?: (outer_pb.IEquip|null);
    }

    /** Represents a KfCkItem. */
    class KfCkItem implements IKfCkItem {

        /**
         * Constructs a new KfCkItem.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IKfCkItem);

        /** KfCkItem Uid. */
        public Uid: string;

        /** KfCkItem Id. */
        public Id: number;

        /** KfCkItem Num. */
        public Num: number;

        /** KfCkItem Equip. */
        public Equip?: (outer_pb.IEquip|null);

        /**
         * Creates a new KfCkItem instance using the specified properties.
         * @param [properties] Properties to set
         * @returns KfCkItem instance
         */
        public static create(properties?: outer_pb.IKfCkItem): outer_pb.KfCkItem;

        /**
         * Encodes the specified KfCkItem message. Does not implicitly {@link outer_pb.KfCkItem.verify|verify} messages.
         * @param message KfCkItem message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IKfCkItem, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a KfCkItem message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns KfCkItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.KfCkItem;
    }

    /** Properties of a KfCkAct. */
    interface IKfCkAct {

        /** KfCkAct ErrCode */
        ErrCode?: (number|null);

        /** KfCkAct Id */
        Id?: (number|null);

        /** KfCkAct Num */
        Num?: (number|null);

        /** KfCkAct Uid */
        Uid?: (string|null);

        /** KfCkAct Items */
        Items?: ({ [k: string]: outer_pb.IKfCkItem }|null);
    }

    /** Represents a KfCkAct. */
    class KfCkAct implements IKfCkAct {

        /**
         * Constructs a new KfCkAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IKfCkAct);

        /** KfCkAct ErrCode. */
        public ErrCode: number;

        /** KfCkAct Id. */
        public Id: number;

        /** KfCkAct Num. */
        public Num: number;

        /** KfCkAct Uid. */
        public Uid: string;

        /** KfCkAct Items. */
        public Items: { [k: string]: outer_pb.IKfCkItem };

        /**
         * Creates a new KfCkAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns KfCkAct instance
         */
        public static create(properties?: outer_pb.IKfCkAct): outer_pb.KfCkAct;

        /**
         * Encodes the specified KfCkAct message. Does not implicitly {@link outer_pb.KfCkAct.verify|verify} messages.
         * @param message KfCkAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IKfCkAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a KfCkAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns KfCkAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.KfCkAct;
    }

    /** Properties of a KfGcAct. */
    interface IKfGcAct {

        /** KfGcAct ErrCode */
        ErrCode?: (number|null);

        /** KfGcAct Step */
        Step?: (number|null);

        /** KfGcAct Num */
        Num?: (number|null);

        /** KfGcAct Exp */
        Exp?: (number|null);

        /** KfGcAct CellId */
        CellId?: (number|null);

        /** KfGcAct OldCellId */
        OldCellId?: (number|null);

        /** KfGcAct Cost */
        Cost?: (number|null);

        /** KfGcAct Dmg */
        Dmg?: (number|Long|null);

        /** KfGcAct TotalDmg */
        TotalDmg?: (number|Long|null);

        /** KfGcAct ZmTotalDmg */
        ZmTotalDmg?: (number|Long|null);

        /** KfGcAct Id */
        Id?: (number|Long|null);

        /** KfGcAct HasSignUp */
        HasSignUp?: (boolean|null);

        /** KfGcAct Cells */
        Cells?: (outer_pb.IZmCell[]|null);

        /** KfGcAct Cell */
        Cell?: (outer_pb.IZmCell|null);

        /** KfGcAct OldCell */
        OldCell?: (outer_pb.IZmCell|null);

        /** KfGcAct AtkCells */
        AtkCells?: (number[]|null);

        /** KfGcAct PhList */
        PhList?: (outer_pb.IZmGcJf[]|null);
    }

    /** Represents a KfGcAct. */
    class KfGcAct implements IKfGcAct {

        /**
         * Constructs a new KfGcAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IKfGcAct);

        /** KfGcAct ErrCode. */
        public ErrCode: number;

        /** KfGcAct Step. */
        public Step: number;

        /** KfGcAct Num. */
        public Num: number;

        /** KfGcAct Exp. */
        public Exp: number;

        /** KfGcAct CellId. */
        public CellId: number;

        /** KfGcAct OldCellId. */
        public OldCellId: number;

        /** KfGcAct Cost. */
        public Cost: number;

        /** KfGcAct Dmg. */
        public Dmg: (number|Long);

        /** KfGcAct TotalDmg. */
        public TotalDmg: (number|Long);

        /** KfGcAct ZmTotalDmg. */
        public ZmTotalDmg: (number|Long);

        /** KfGcAct Id. */
        public Id: (number|Long);

        /** KfGcAct HasSignUp. */
        public HasSignUp: boolean;

        /** KfGcAct Cells. */
        public Cells: outer_pb.IZmCell[];

        /** KfGcAct Cell. */
        public Cell?: (outer_pb.IZmCell|null);

        /** KfGcAct OldCell. */
        public OldCell?: (outer_pb.IZmCell|null);

        /** KfGcAct AtkCells. */
        public AtkCells: number[];

        /** KfGcAct PhList. */
        public PhList: outer_pb.IZmGcJf[];

        /**
         * Creates a new KfGcAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns KfGcAct instance
         */
        public static create(properties?: outer_pb.IKfGcAct): outer_pb.KfGcAct;

        /**
         * Encodes the specified KfGcAct message. Does not implicitly {@link outer_pb.KfGcAct.verify|verify} messages.
         * @param message KfGcAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IKfGcAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a KfGcAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns KfGcAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.KfGcAct;
    }

    /** Properties of a ZmGcJf. */
    interface IZmGcJf {

        /** ZmGcJf Name */
        Name?: (string|null);

        /** ZmGcJf Jf */
        Jf?: (number|null);
    }

    /** Represents a ZmGcJf. */
    class ZmGcJf implements IZmGcJf {

        /**
         * Constructs a new ZmGcJf.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IZmGcJf);

        /** ZmGcJf Name. */
        public Name: string;

        /** ZmGcJf Jf. */
        public Jf: number;

        /**
         * Creates a new ZmGcJf instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ZmGcJf instance
         */
        public static create(properties?: outer_pb.IZmGcJf): outer_pb.ZmGcJf;

        /**
         * Encodes the specified ZmGcJf message. Does not implicitly {@link outer_pb.ZmGcJf.verify|verify} messages.
         * @param message ZmGcJf message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IZmGcJf, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a ZmGcJf message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ZmGcJf
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.ZmGcJf;
    }

    /** Properties of a ZmCell. */
    interface IZmCell {

        /** ZmCell Lv */
        Lv?: (number|null);

        /** ZmCell State */
        State?: (number|null);

        /** ZmCell HuDunLv */
        HuDunLv?: (number|null);

        /** ZmCell HuDunExp */
        HuDunExp?: (number|null);

        /** ZmCell DeferId */
        DeferId?: (number|Long|null);

        /** ZmCell Hp */
        Hp?: (number|Long|null);

        /** ZmCell MaxHp */
        MaxHp?: (number|Long|null);

        /** ZmCell DeferName */
        DeferName?: (string|null);

        /** ZmCell Owner */
        Owner?: (string|null);

        /** ZmCell Sid */
        Sid?: (string|null);

        /** ZmCell IsBusy */
        IsBusy?: (boolean|null);

        /** ZmCell OpenDayNum */
        OpenDayNum?: (number|null);

        /** ZmCell BossId */
        BossId?: (number|null);

        /** ZmCell Id */
        Id?: (number|null);
    }

    /** Represents a ZmCell. */
    class ZmCell implements IZmCell {

        /**
         * Constructs a new ZmCell.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IZmCell);

        /** ZmCell Lv. */
        public Lv: number;

        /** ZmCell State. */
        public State: number;

        /** ZmCell HuDunLv. */
        public HuDunLv: number;

        /** ZmCell HuDunExp. */
        public HuDunExp: number;

        /** ZmCell DeferId. */
        public DeferId: (number|Long);

        /** ZmCell Hp. */
        public Hp: (number|Long);

        /** ZmCell MaxHp. */
        public MaxHp: (number|Long);

        /** ZmCell DeferName. */
        public DeferName: string;

        /** ZmCell Owner. */
        public Owner: string;

        /** ZmCell Sid. */
        public Sid: string;

        /** ZmCell IsBusy. */
        public IsBusy: boolean;

        /** ZmCell OpenDayNum. */
        public OpenDayNum: number;

        /** ZmCell BossId. */
        public BossId: number;

        /** ZmCell Id. */
        public Id: number;

        /**
         * Creates a new ZmCell instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ZmCell instance
         */
        public static create(properties?: outer_pb.IZmCell): outer_pb.ZmCell;

        /**
         * Encodes the specified ZmCell message. Does not implicitly {@link outer_pb.ZmCell.verify|verify} messages.
         * @param message ZmCell message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IZmCell, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a ZmCell message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ZmCell
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.ZmCell;
    }

    /** Properties of a Build. */
    interface IBuild {

        /** Build Lv */
        Lv?: (number|null);

        /** Build IsBuilding */
        IsBuilding?: (boolean|null);

        /** Build Time */
        Time?: (number|Long|null);
    }

    /** Represents a Build. */
    class Build implements IBuild {

        /**
         * Constructs a new Build.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IBuild);

        /** Build Lv. */
        public Lv: number;

        /** Build IsBuilding. */
        public IsBuilding: boolean;

        /** Build Time. */
        public Time: (number|Long);

        /**
         * Creates a new Build instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Build instance
         */
        public static create(properties?: outer_pb.IBuild): outer_pb.Build;

        /**
         * Encodes the specified Build message. Does not implicitly {@link outer_pb.Build.verify|verify} messages.
         * @param message Build message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IBuild, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a Build message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Build
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.Build;
    }

    /** Properties of a ZmRoleInfo. */
    interface IZmRoleInfo {

        /** ZmRoleInfo Name */
        Name?: (string|null);

        /** ZmRoleInfo Job */
        Job?: (number|null);

        /** ZmRoleInfo Gx */
        Gx?: (number|Long|null);

        /** ZmRoleInfo QdDay */
        QdDay?: (number|null);

        /** ZmRoleInfo State */
        State?: (number|null);

        /** ZmRoleInfo Id */
        Id?: (number|Long|null);

        /** ZmRoleInfo QdNum */
        QdNum?: (number|null);
    }

    /** Represents a ZmRoleInfo. */
    class ZmRoleInfo implements IZmRoleInfo {

        /**
         * Constructs a new ZmRoleInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IZmRoleInfo);

        /** ZmRoleInfo Name. */
        public Name: string;

        /** ZmRoleInfo Job. */
        public Job: number;

        /** ZmRoleInfo Gx. */
        public Gx: (number|Long);

        /** ZmRoleInfo QdDay. */
        public QdDay: number;

        /** ZmRoleInfo State. */
        public State: number;

        /** ZmRoleInfo Id. */
        public Id: (number|Long);

        /** ZmRoleInfo QdNum. */
        public QdNum: number;

        /**
         * Creates a new ZmRoleInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ZmRoleInfo instance
         */
        public static create(properties?: outer_pb.IZmRoleInfo): outer_pb.ZmRoleInfo;

        /**
         * Encodes the specified ZmRoleInfo message. Does not implicitly {@link outer_pb.ZmRoleInfo.verify|verify} messages.
         * @param message ZmRoleInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IZmRoleInfo, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a ZmRoleInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ZmRoleInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.ZmRoleInfo;
    }

    /** Properties of a CkAct. */
    interface ICkAct {

        /** CkAct ErrCode */
        ErrCode?: (number|null);

        /** CkAct Uid */
        Uid?: (string|null);

        /** CkAct Id */
        Id?: (number|Long|null);

        /** CkAct ItemId */
        ItemId?: (number|null);

        /** CkAct CkEquips */
        CkEquips?: ({ [k: string]: outer_pb.IEquip }|null);

        /** CkAct CkItems */
        CkItems?: ({ [k: string]: number }|null);

        /** CkAct CkGold */
        CkGold?: (number|Long|null);

        /** CkAct CkDia */
        CkDia?: (number|Long|null);

        /** CkAct CkMuPoint */
        CkMuPoint?: (number|Long|null);

        /** CkAct RoleList */
        RoleList?: (outer_pb.ICkRole[]|null);

        /** CkAct UidList */
        UidList?: (string[]|null);

        /** CkAct ActType */
        ActType?: (number|null);

        /** CkAct ActNum */
        ActNum?: (number|null);

        /** CkAct Cap */
        Cap?: (number|null);

        /** CkAct Gold */
        Gold?: (number|Long|null);

        /** CkAct Cost */
        Cost?: (number|null);

        /** CkAct Ids */
        Ids?: (number[]|null);
    }

    /** Represents a CkAct. */
    class CkAct implements ICkAct {

        /**
         * Constructs a new CkAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ICkAct);

        /** CkAct ErrCode. */
        public ErrCode: number;

        /** CkAct Uid. */
        public Uid: string;

        /** CkAct Id. */
        public Id: (number|Long);

        /** CkAct ItemId. */
        public ItemId: number;

        /** CkAct CkEquips. */
        public CkEquips: { [k: string]: outer_pb.IEquip };

        /** CkAct CkItems. */
        public CkItems: { [k: string]: number };

        /** CkAct CkGold. */
        public CkGold: (number|Long);

        /** CkAct CkDia. */
        public CkDia: (number|Long);

        /** CkAct CkMuPoint. */
        public CkMuPoint: (number|Long);

        /** CkAct RoleList. */
        public RoleList: outer_pb.ICkRole[];

        /** CkAct UidList. */
        public UidList: string[];

        /** CkAct ActType. */
        public ActType: number;

        /** CkAct ActNum. */
        public ActNum: number;

        /** CkAct Cap. */
        public Cap: number;

        /** CkAct Gold. */
        public Gold: (number|Long);

        /** CkAct Cost. */
        public Cost: number;

        /** CkAct Ids. */
        public Ids: number[];

        /**
         * Creates a new CkAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CkAct instance
         */
        public static create(properties?: outer_pb.ICkAct): outer_pb.CkAct;

        /**
         * Encodes the specified CkAct message. Does not implicitly {@link outer_pb.CkAct.verify|verify} messages.
         * @param message CkAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ICkAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a CkAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CkAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.CkAct;
    }

    /** Properties of a CkRole. */
    interface ICkRole {

        /** CkRole Id */
        Id?: (number|Long|null);

        /** CkRole Name */
        Name?: (string|null);
    }

    /** Represents a CkRole. */
    class CkRole implements ICkRole {

        /**
         * Constructs a new CkRole.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ICkRole);

        /** CkRole Id. */
        public Id: (number|Long);

        /** CkRole Name. */
        public Name: string;

        /**
         * Creates a new CkRole instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CkRole instance
         */
        public static create(properties?: outer_pb.ICkRole): outer_pb.CkRole;

        /**
         * Encodes the specified CkRole message. Does not implicitly {@link outer_pb.CkRole.verify|verify} messages.
         * @param message CkRole message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ICkRole, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a CkRole message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CkRole
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.CkRole;
    }

    /** Properties of a FriendAct. */
    interface IFriendAct {

        /** FriendAct ErrCode */
        ErrCode?: (number|null);

        /** FriendAct Id */
        Id?: (number|Long|null);

        /** FriendAct Friends */
        Friends?: (outer_pb.IFriend[]|null);

        /** FriendAct NewFriend */
        NewFriend?: (outer_pb.IFriend|null);
    }

    /** Represents a FriendAct. */
    class FriendAct implements IFriendAct {

        /**
         * Constructs a new FriendAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IFriendAct);

        /** FriendAct ErrCode. */
        public ErrCode: number;

        /** FriendAct Id. */
        public Id: (number|Long);

        /** FriendAct Friends. */
        public Friends: outer_pb.IFriend[];

        /** FriendAct NewFriend. */
        public NewFriend?: (outer_pb.IFriend|null);

        /**
         * Creates a new FriendAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FriendAct instance
         */
        public static create(properties?: outer_pb.IFriendAct): outer_pb.FriendAct;

        /**
         * Encodes the specified FriendAct message. Does not implicitly {@link outer_pb.FriendAct.verify|verify} messages.
         * @param message FriendAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IFriendAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a FriendAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FriendAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.FriendAct;
    }

    /** Properties of a Friend. */
    interface IFriend {

        /** Friend Name */
        Name?: (string|null);

        /** Friend Value */
        Value?: (number|null);

        /** Friend State */
        State?: (number|null);

        /** Friend LastTime */
        LastTime?: (number|Long|null);

        /** Friend Id */
        Id?: (number|Long|null);
    }

    /** Represents a Friend. */
    class Friend implements IFriend {

        /**
         * Constructs a new Friend.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IFriend);

        /** Friend Name. */
        public Name: string;

        /** Friend Value. */
        public Value: number;

        /** Friend State. */
        public State: number;

        /** Friend LastTime. */
        public LastTime: (number|Long);

        /** Friend Id. */
        public Id: (number|Long);

        /**
         * Creates a new Friend instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Friend instance
         */
        public static create(properties?: outer_pb.IFriend): outer_pb.Friend;

        /**
         * Encodes the specified Friend message. Does not implicitly {@link outer_pb.Friend.verify|verify} messages.
         * @param message Friend message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IFriend, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a Friend message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Friend
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.Friend;
    }

    /** Properties of a GetInviteMsg. */
    interface IGetInviteMsg {

        /** GetInviteMsg Name */
        Name?: (string|null);

        /** GetInviteMsg MsgType */
        MsgType?: (number|null);

        /** GetInviteMsg TeamId */
        TeamId?: (number|null);

        /** GetInviteMsg ZmName */
        ZmName?: (string|null);

        /** GetInviteMsg Id */
        Id?: (number|Long|null);
    }

    /** Represents a GetInviteMsg. */
    class GetInviteMsg implements IGetInviteMsg {

        /**
         * Constructs a new GetInviteMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IGetInviteMsg);

        /** GetInviteMsg Name. */
        public Name: string;

        /** GetInviteMsg MsgType. */
        public MsgType: number;

        /** GetInviteMsg TeamId. */
        public TeamId: number;

        /** GetInviteMsg ZmName. */
        public ZmName: string;

        /** GetInviteMsg Id. */
        public Id: (number|Long);

        /**
         * Creates a new GetInviteMsg instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetInviteMsg instance
         */
        public static create(properties?: outer_pb.IGetInviteMsg): outer_pb.GetInviteMsg;

        /**
         * Encodes the specified GetInviteMsg message. Does not implicitly {@link outer_pb.GetInviteMsg.verify|verify} messages.
         * @param message GetInviteMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IGetInviteMsg, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a GetInviteMsg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetInviteMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.GetInviteMsg;
    }

    /** Properties of a MarketAct. */
    interface IMarketAct {

        /** MarketAct ErrCode */
        ErrCode?: (number|null);

        /** MarketAct ShopItems */
        ShopItems?: (outer_pb.IShopItem[]|null);

        /** MarketAct ShopItem */
        ShopItem?: (outer_pb.IShopItem|null);

        /** MarketAct Uid */
        Uid?: (string|null);

        /** MarketAct MainType */
        MainType?: (number|null);

        /** MarketAct SortType */
        SortType?: (number|null);

        /** MarketAct MinItemType */
        MinItemType?: (number|null);

        /** MarketAct RoleType */
        RoleType?: (number|null);

        /** MarketAct SearchId */
        SearchId?: (number|null);

        /** MarketAct History */
        History?: (outer_pb.IShopHistory[]|null);

        /** MarketAct Num */
        Num?: (number|null);

        /** MarketAct Price */
        Price?: (number|Long|null);

        /** MarketAct PreOrderNum */
        PreOrderNum?: (number|null);

        /** MarketAct BuyType */
        BuyType?: (number|null);

        /** MarketAct Page */
        Page?: (number|null);

        /** MarketAct TotalPages */
        TotalPages?: (number|null);

        /** MarketAct MyShop */
        MyShop?: (outer_pb.IShop|null);

        /** MarketAct EquipLv */
        EquipLv?: (number|null);

        /** MarketAct PinZiLv */
        PinZiLv?: (number|null);

        /** MarketAct RoleId */
        RoleId?: (number|Long|null);

        /** MarketAct IsKf */
        IsKf?: (boolean|null);
    }

    /** Represents a MarketAct. */
    class MarketAct implements IMarketAct {

        /**
         * Constructs a new MarketAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IMarketAct);

        /** MarketAct ErrCode. */
        public ErrCode: number;

        /** MarketAct ShopItems. */
        public ShopItems: outer_pb.IShopItem[];

        /** MarketAct ShopItem. */
        public ShopItem?: (outer_pb.IShopItem|null);

        /** MarketAct Uid. */
        public Uid: string;

        /** MarketAct MainType. */
        public MainType: number;

        /** MarketAct SortType. */
        public SortType: number;

        /** MarketAct MinItemType. */
        public MinItemType: number;

        /** MarketAct RoleType. */
        public RoleType: number;

        /** MarketAct SearchId. */
        public SearchId: number;

        /** MarketAct History. */
        public History: outer_pb.IShopHistory[];

        /** MarketAct Num. */
        public Num: number;

        /** MarketAct Price. */
        public Price: (number|Long);

        /** MarketAct PreOrderNum. */
        public PreOrderNum: number;

        /** MarketAct BuyType. */
        public BuyType: number;

        /** MarketAct Page. */
        public Page: number;

        /** MarketAct TotalPages. */
        public TotalPages: number;

        /** MarketAct MyShop. */
        public MyShop?: (outer_pb.IShop|null);

        /** MarketAct EquipLv. */
        public EquipLv: number;

        /** MarketAct PinZiLv. */
        public PinZiLv: number;

        /** MarketAct RoleId. */
        public RoleId: (number|Long);

        /** MarketAct IsKf. */
        public IsKf: boolean;

        /**
         * Creates a new MarketAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MarketAct instance
         */
        public static create(properties?: outer_pb.IMarketAct): outer_pb.MarketAct;

        /**
         * Encodes the specified MarketAct message. Does not implicitly {@link outer_pb.MarketAct.verify|verify} messages.
         * @param message MarketAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IMarketAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a MarketAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MarketAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.MarketAct;
    }

    /** Properties of a Shop. */
    interface IShop {

        /** Shop Dia */
        Dia?: (number|Long|null);

        /** Shop ShopItems */
        ShopItems?: (outer_pb.IShopItem[]|null);

        /** Shop ShopCk */
        ShopCk?: (outer_pb.IShopItem[]|null);

        /** Shop MuPoint */
        MuPoint?: (number|Long|null);
    }

    /** Represents a Shop. */
    class Shop implements IShop {

        /**
         * Constructs a new Shop.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IShop);

        /** Shop Dia. */
        public Dia: (number|Long);

        /** Shop ShopItems. */
        public ShopItems: outer_pb.IShopItem[];

        /** Shop ShopCk. */
        public ShopCk: outer_pb.IShopItem[];

        /** Shop MuPoint. */
        public MuPoint: (number|Long);

        /**
         * Creates a new Shop instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Shop instance
         */
        public static create(properties?: outer_pb.IShop): outer_pb.Shop;

        /**
         * Encodes the specified Shop message. Does not implicitly {@link outer_pb.Shop.verify|verify} messages.
         * @param message Shop message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IShop, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a Shop message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Shop
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.Shop;
    }

    /** Properties of a ShopHistory. */
    interface IShopHistory {

        /** ShopHistory Name */
        Name?: (string|null);

        /** ShopHistory Time */
        Time?: (number|Long|null);

        /** ShopHistory Type */
        Type?: (number|null);

        /** ShopHistory Price */
        Price?: (number|Long|null);

        /** ShopHistory Color */
        Color?: (number|null);

        /** ShopHistory PriceType */
        PriceType?: (number|null);
    }

    /** Represents a ShopHistory. */
    class ShopHistory implements IShopHistory {

        /**
         * Constructs a new ShopHistory.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IShopHistory);

        /** ShopHistory Name. */
        public Name: string;

        /** ShopHistory Time. */
        public Time: (number|Long);

        /** ShopHistory Type. */
        public Type: number;

        /** ShopHistory Price. */
        public Price: (number|Long);

        /** ShopHistory Color. */
        public Color: number;

        /** ShopHistory PriceType. */
        public PriceType: number;

        /**
         * Creates a new ShopHistory instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ShopHistory instance
         */
        public static create(properties?: outer_pb.IShopHistory): outer_pb.ShopHistory;

        /**
         * Encodes the specified ShopHistory message. Does not implicitly {@link outer_pb.ShopHistory.verify|verify} messages.
         * @param message ShopHistory message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IShopHistory, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a ShopHistory message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ShopHistory
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.ShopHistory;
    }

    /** Properties of a ShopItem. */
    interface IShopItem {

        /** ShopItem Uid */
        Uid?: (string|null);

        /** ShopItem EndTime */
        EndTime?: (number|Long|null);

        /** ShopItem ItemType */
        ItemType?: (number|null);

        /** ShopItem EquipData */
        EquipData?: (outer_pb.IEquip|null);

        /** ShopItem ItemId */
        ItemId?: (number|null);

        /** ShopItem ItemNum */
        ItemNum?: (number|null);

        /** ShopItem StartTime */
        StartTime?: (number|Long|null);

        /** ShopItem CurPrice */
        CurPrice?: (number|Long|null);

        /** ShopItem PreOrders */
        PreOrders?: ((number|Long)[]|null);

        /** ShopItem Owner */
        Owner?: (number|Long|null);

        /** ShopItem Status */
        Status?: (number|null);

        /** ShopItem PriceType */
        PriceType?: (number|null);
    }

    /** Represents a ShopItem. */
    class ShopItem implements IShopItem {

        /**
         * Constructs a new ShopItem.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IShopItem);

        /** ShopItem Uid. */
        public Uid: string;

        /** ShopItem EndTime. */
        public EndTime: (number|Long);

        /** ShopItem ItemType. */
        public ItemType: number;

        /** ShopItem EquipData. */
        public EquipData?: (outer_pb.IEquip|null);

        /** ShopItem ItemId. */
        public ItemId: number;

        /** ShopItem ItemNum. */
        public ItemNum: number;

        /** ShopItem StartTime. */
        public StartTime: (number|Long);

        /** ShopItem CurPrice. */
        public CurPrice: (number|Long);

        /** ShopItem PreOrders. */
        public PreOrders: (number|Long)[];

        /** ShopItem Owner. */
        public Owner: (number|Long);

        /** ShopItem Status. */
        public Status: number;

        /** ShopItem PriceType. */
        public PriceType: number;

        /**
         * Creates a new ShopItem instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ShopItem instance
         */
        public static create(properties?: outer_pb.IShopItem): outer_pb.ShopItem;

        /**
         * Encodes the specified ShopItem message. Does not implicitly {@link outer_pb.ShopItem.verify|verify} messages.
         * @param message ShopItem message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IShopItem, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a ShopItem message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ShopItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.ShopItem;
    }

    /** Properties of a MoneyAct. */
    interface IMoneyAct {

        /** MoneyAct ErrCode */
        ErrCode?: (number|null);

        /** MoneyAct Num */
        Num?: (number|Long|null);

        /** MoneyAct Id */
        Id?: (number|null);

        /** MoneyAct IsKf */
        IsKf?: (boolean|null);
    }

    /** Represents a MoneyAct. */
    class MoneyAct implements IMoneyAct {

        /**
         * Constructs a new MoneyAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IMoneyAct);

        /** MoneyAct ErrCode. */
        public ErrCode: number;

        /** MoneyAct Num. */
        public Num: (number|Long);

        /** MoneyAct Id. */
        public Id: number;

        /** MoneyAct IsKf. */
        public IsKf: boolean;

        /**
         * Creates a new MoneyAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MoneyAct instance
         */
        public static create(properties?: outer_pb.IMoneyAct): outer_pb.MoneyAct;

        /**
         * Encodes the specified MoneyAct message. Does not implicitly {@link outer_pb.MoneyAct.verify|verify} messages.
         * @param message MoneyAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IMoneyAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a MoneyAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MoneyAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.MoneyAct;
    }

    /** Properties of a DiaMarketAct. */
    interface IDiaMarketAct {

        /** DiaMarketAct ErrCode */
        ErrCode?: (number|null);

        /** DiaMarketAct Price */
        Price?: (number|null);

        /** DiaMarketAct Num */
        Num?: (number|null);

        /** DiaMarketAct Type */
        Type?: (number|null);

        /** DiaMarketAct OrderId */
        OrderId?: (string|null);

        /** DiaMarketAct SellOrders */
        SellOrders?: ({ [k: string]: number }|null);

        /** DiaMarketAct BuyOrders */
        BuyOrders?: ({ [k: string]: number }|null);

        /** DiaMarketAct BagNum */
        BagNum?: (number|null);

        /** DiaMarketAct Point10 */
        Point10?: (number|null);

        /** DiaMarketAct MyOrders */
        MyOrders?: (outer_pb.IOrder[]|null);

        /** DiaMarketAct HisList */
        HisList?: (outer_pb.IGetHis[]|null);

        /** DiaMarketAct CurPrice */
        CurPrice?: (number|null);
    }

    /** Represents a DiaMarketAct. */
    class DiaMarketAct implements IDiaMarketAct {

        /**
         * Constructs a new DiaMarketAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IDiaMarketAct);

        /** DiaMarketAct ErrCode. */
        public ErrCode: number;

        /** DiaMarketAct Price. */
        public Price: number;

        /** DiaMarketAct Num. */
        public Num: number;

        /** DiaMarketAct Type. */
        public Type: number;

        /** DiaMarketAct OrderId. */
        public OrderId: string;

        /** DiaMarketAct SellOrders. */
        public SellOrders: { [k: string]: number };

        /** DiaMarketAct BuyOrders. */
        public BuyOrders: { [k: string]: number };

        /** DiaMarketAct BagNum. */
        public BagNum: number;

        /** DiaMarketAct Point10. */
        public Point10: number;

        /** DiaMarketAct MyOrders. */
        public MyOrders: outer_pb.IOrder[];

        /** DiaMarketAct HisList. */
        public HisList: outer_pb.IGetHis[];

        /** DiaMarketAct CurPrice. */
        public CurPrice: number;

        /**
         * Creates a new DiaMarketAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DiaMarketAct instance
         */
        public static create(properties?: outer_pb.IDiaMarketAct): outer_pb.DiaMarketAct;

        /**
         * Encodes the specified DiaMarketAct message. Does not implicitly {@link outer_pb.DiaMarketAct.verify|verify} messages.
         * @param message DiaMarketAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IDiaMarketAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a DiaMarketAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DiaMarketAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.DiaMarketAct;
    }

    /** Properties of an Order. */
    interface IOrder {

        /** Order ID */
        ID?: (string|null);

        /** Order UserID */
        UserID?: (number|Long|null);

        /** Order CreateTime */
        CreateTime?: (number|Long|null);

        /** Order UpdateTime */
        UpdateTime?: (number|Long|null);

        /** Order Type */
        Type?: (number|null);

        /** Order Price */
        Price?: (number|null);

        /** Order Num */
        Num?: (number|null);

        /** Order DealNum */
        DealNum?: (number|null);
    }

    /** Represents an Order. */
    class Order implements IOrder {

        /**
         * Constructs a new Order.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IOrder);

        /** Order ID. */
        public ID: string;

        /** Order UserID. */
        public UserID: (number|Long);

        /** Order CreateTime. */
        public CreateTime: (number|Long);

        /** Order UpdateTime. */
        public UpdateTime: (number|Long);

        /** Order Type. */
        public Type: number;

        /** Order Price. */
        public Price: number;

        /** Order Num. */
        public Num: number;

        /** Order DealNum. */
        public DealNum: number;

        /**
         * Creates a new Order instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Order instance
         */
        public static create(properties?: outer_pb.IOrder): outer_pb.Order;

        /**
         * Encodes the specified Order message. Does not implicitly {@link outer_pb.Order.verify|verify} messages.
         * @param message Order message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IOrder, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes an Order message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Order
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.Order;
    }

    /** Properties of a GetHis. */
    interface IGetHis {

        /** GetHis Time */
        Time?: (number|Long|null);

        /** GetHis Dia */
        Dia?: (number|null);

        /** GetHis Point */
        Point?: (number|null);
    }

    /** Represents a GetHis. */
    class GetHis implements IGetHis {

        /**
         * Constructs a new GetHis.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IGetHis);

        /** GetHis Time. */
        public Time: (number|Long);

        /** GetHis Dia. */
        public Dia: number;

        /** GetHis Point. */
        public Point: number;

        /**
         * Creates a new GetHis instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetHis instance
         */
        public static create(properties?: outer_pb.IGetHis): outer_pb.GetHis;

        /**
         * Encodes the specified GetHis message. Does not implicitly {@link outer_pb.GetHis.verify|verify} messages.
         * @param message GetHis message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IGetHis, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a GetHis message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetHis
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.GetHis;
    }

    /** Properties of a BagSet. */
    interface IBagSet {

        /** BagSet QhLv */
        QhLv?: (number|null);

        /** BagSet ZjLv */
        ZjLv?: (number|null);

        /** BagSet XyLv */
        XyLv?: (number|null);

        /** BagSet Zys */
        Zys?: (number[]|null);

        /** BagSet Sets */
        Sets?: ({ [k: string]: number }|null);
    }

    /** Represents a BagSet. */
    class BagSet implements IBagSet {

        /**
         * Constructs a new BagSet.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IBagSet);

        /** BagSet QhLv. */
        public QhLv: number;

        /** BagSet ZjLv. */
        public ZjLv: number;

        /** BagSet XyLv. */
        public XyLv: number;

        /** BagSet Zys. */
        public Zys: number[];

        /** BagSet Sets. */
        public Sets: { [k: string]: number };

        /**
         * Creates a new BagSet instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BagSet instance
         */
        public static create(properties?: outer_pb.IBagSet): outer_pb.BagSet;

        /**
         * Encodes the specified BagSet message. Does not implicitly {@link outer_pb.BagSet.verify|verify} messages.
         * @param message BagSet message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IBagSet, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a BagSet message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BagSet
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.BagSet;
    }

    /** Properties of a NpcShopAct. */
    interface INpcShopAct {

        /** NpcShopAct ErrCode */
        ErrCode?: (number|null);

        /** NpcShopAct Num */
        Num?: (number|null);

        /** NpcShopAct Id */
        Id?: (number|null);

        /** NpcShopAct EquipData */
        EquipData?: (outer_pb.IEquip|null);

        /** NpcShopAct Cost */
        Cost?: (number|Long|null);

        /** NpcShopAct BaseYk */
        BaseYk?: (number|Long|null);

        /** NpcShopAct GoldYk */
        GoldYk?: (number|Long|null);

        /** NpcShopAct BasePros */
        BasePros?: (outer_pb.IBasePros|null);

        /** NpcShopAct Equips */
        Equips?: (outer_pb.IEquip[]|null);

        /** NpcShopAct Items */
        Items?: ({ [k: string]: number }|null);

        /** NpcShopAct NpcId */
        NpcId?: (number|null);

        /** NpcShopAct Price */
        Price?: (number|null);

        /** NpcShopAct GemMarket */
        GemMarket?: ({ [k: string]: outer_pb.IGemShopObj }|null);

        /** NpcShopAct IsKf */
        IsKf?: (boolean|null);
    }

    /** Represents a NpcShopAct. */
    class NpcShopAct implements INpcShopAct {

        /**
         * Constructs a new NpcShopAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.INpcShopAct);

        /** NpcShopAct ErrCode. */
        public ErrCode: number;

        /** NpcShopAct Num. */
        public Num: number;

        /** NpcShopAct Id. */
        public Id: number;

        /** NpcShopAct EquipData. */
        public EquipData?: (outer_pb.IEquip|null);

        /** NpcShopAct Cost. */
        public Cost: (number|Long);

        /** NpcShopAct BaseYk. */
        public BaseYk: (number|Long);

        /** NpcShopAct GoldYk. */
        public GoldYk: (number|Long);

        /** NpcShopAct BasePros. */
        public BasePros?: (outer_pb.IBasePros|null);

        /** NpcShopAct Equips. */
        public Equips: outer_pb.IEquip[];

        /** NpcShopAct Items. */
        public Items: { [k: string]: number };

        /** NpcShopAct NpcId. */
        public NpcId: number;

        /** NpcShopAct Price. */
        public Price: number;

        /** NpcShopAct GemMarket. */
        public GemMarket: { [k: string]: outer_pb.IGemShopObj };

        /** NpcShopAct IsKf. */
        public IsKf: boolean;

        /**
         * Creates a new NpcShopAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NpcShopAct instance
         */
        public static create(properties?: outer_pb.INpcShopAct): outer_pb.NpcShopAct;

        /**
         * Encodes the specified NpcShopAct message. Does not implicitly {@link outer_pb.NpcShopAct.verify|verify} messages.
         * @param message NpcShopAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.INpcShopAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a NpcShopAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NpcShopAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.NpcShopAct;
    }

    /** Properties of a GemShopObj. */
    interface IGemShopObj {

        /** GemShopObj Price */
        Price?: (number|null);

        /** GemShopObj Num */
        Num?: (number|null);
    }

    /** Represents a GemShopObj. */
    class GemShopObj implements IGemShopObj {

        /**
         * Constructs a new GemShopObj.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IGemShopObj);

        /** GemShopObj Price. */
        public Price: number;

        /** GemShopObj Num. */
        public Num: number;

        /**
         * Creates a new GemShopObj instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GemShopObj instance
         */
        public static create(properties?: outer_pb.IGemShopObj): outer_pb.GemShopObj;

        /**
         * Encodes the specified GemShopObj message. Does not implicitly {@link outer_pb.GemShopObj.verify|verify} messages.
         * @param message GemShopObj message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IGemShopObj, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a GemShopObj message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GemShopObj
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.GemShopObj;
    }

    /** Properties of an UpdateBuffs. */
    interface IUpdateBuffs {

        /** UpdateBuffs Buffs */
        Buffs?: ({ [k: string]: outer_pb.IBuffInfo }|null);

        /** UpdateBuffs BasePros */
        BasePros?: (outer_pb.IBasePros|null);

        /** UpdateBuffs Id */
        Id?: (number|Long|null);

        /** UpdateBuffs CurHp */
        CurHp?: (number|null);

        /** UpdateBuffs MaxHp */
        MaxHp?: (number|null);

        /** UpdateBuffs Index */
        Index?: (number|null);
    }

    /** Represents an UpdateBuffs. */
    class UpdateBuffs implements IUpdateBuffs {

        /**
         * Constructs a new UpdateBuffs.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IUpdateBuffs);

        /** UpdateBuffs Buffs. */
        public Buffs: { [k: string]: outer_pb.IBuffInfo };

        /** UpdateBuffs BasePros. */
        public BasePros?: (outer_pb.IBasePros|null);

        /** UpdateBuffs Id. */
        public Id: (number|Long);

        /** UpdateBuffs CurHp. */
        public CurHp: number;

        /** UpdateBuffs MaxHp. */
        public MaxHp: number;

        /** UpdateBuffs Index. */
        public Index: number;

        /**
         * Creates a new UpdateBuffs instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UpdateBuffs instance
         */
        public static create(properties?: outer_pb.IUpdateBuffs): outer_pb.UpdateBuffs;

        /**
         * Encodes the specified UpdateBuffs message. Does not implicitly {@link outer_pb.UpdateBuffs.verify|verify} messages.
         * @param message UpdateBuffs message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IUpdateBuffs, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes an UpdateBuffs message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UpdateBuffs
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.UpdateBuffs;
    }

    /** Properties of a BuffInfo. */
    interface IBuffInfo {

        /** BuffInfo Num */
        Num?: (number|null);

        /** BuffInfo Time */
        Time?: (number|Long|null);
    }

    /** Represents a BuffInfo. */
    class BuffInfo implements IBuffInfo {

        /**
         * Constructs a new BuffInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IBuffInfo);

        /** BuffInfo Num. */
        public Num: number;

        /** BuffInfo Time. */
        public Time: (number|Long);

        /**
         * Creates a new BuffInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BuffInfo instance
         */
        public static create(properties?: outer_pb.IBuffInfo): outer_pb.BuffInfo;

        /**
         * Encodes the specified BuffInfo message. Does not implicitly {@link outer_pb.BuffInfo.verify|verify} messages.
         * @param message BuffInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IBuffInfo, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a BuffInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BuffInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.BuffInfo;
    }

    /** Properties of a FireBuffSkill. */
    interface IFireBuffSkill {

        /** FireBuffSkill SkillId */
        SkillId?: (number|null);

        /** FireBuffSkill FromId */
        FromId?: (number|Long|null);

        /** FireBuffSkill ToId */
        ToId?: (number|Long|null);

        /** FireBuffSkill ToIndex */
        ToIndex?: (number|null);

        /** FireBuffSkill FromIndex */
        FromIndex?: (number|null);
    }

    /** Represents a FireBuffSkill. */
    class FireBuffSkill implements IFireBuffSkill {

        /**
         * Constructs a new FireBuffSkill.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IFireBuffSkill);

        /** FireBuffSkill SkillId. */
        public SkillId: number;

        /** FireBuffSkill FromId. */
        public FromId: (number|Long);

        /** FireBuffSkill ToId. */
        public ToId: (number|Long);

        /** FireBuffSkill ToIndex. */
        public ToIndex: number;

        /** FireBuffSkill FromIndex. */
        public FromIndex: number;

        /**
         * Creates a new FireBuffSkill instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FireBuffSkill instance
         */
        public static create(properties?: outer_pb.IFireBuffSkill): outer_pb.FireBuffSkill;

        /**
         * Encodes the specified FireBuffSkill message. Does not implicitly {@link outer_pb.FireBuffSkill.verify|verify} messages.
         * @param message FireBuffSkill message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IFireBuffSkill, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a FireBuffSkill message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FireBuffSkill
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.FireBuffSkill;
    }

    /** Properties of a KillNums. */
    interface IKillNums {

        /** KillNums Infos */
        Infos?: ({ [k: string]: outer_pb.IKillInfo }|null);
    }

    /** Represents a KillNums. */
    class KillNums implements IKillNums {

        /**
         * Constructs a new KillNums.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IKillNums);

        /** KillNums Infos. */
        public Infos: { [k: string]: outer_pb.IKillInfo };

        /**
         * Creates a new KillNums instance using the specified properties.
         * @param [properties] Properties to set
         * @returns KillNums instance
         */
        public static create(properties?: outer_pb.IKillNums): outer_pb.KillNums;

        /**
         * Encodes the specified KillNums message. Does not implicitly {@link outer_pb.KillNums.verify|verify} messages.
         * @param message KillNums message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IKillNums, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a KillNums message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns KillNums
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.KillNums;
    }

    /** Properties of a KillInfo. */
    interface IKillInfo {

        /** KillInfo GoldNum */
        GoldNum?: (number|null);

        /** KillInfo RedNum */
        RedNum?: (number|null);
    }

    /** Represents a KillInfo. */
    class KillInfo implements IKillInfo {

        /**
         * Constructs a new KillInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IKillInfo);

        /** KillInfo GoldNum. */
        public GoldNum: number;

        /** KillInfo RedNum. */
        public RedNum: number;

        /**
         * Creates a new KillInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns KillInfo instance
         */
        public static create(properties?: outer_pb.IKillInfo): outer_pb.KillInfo;

        /**
         * Encodes the specified KillInfo message. Does not implicitly {@link outer_pb.KillInfo.verify|verify} messages.
         * @param message KillInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IKillInfo, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a KillInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns KillInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.KillInfo;
    }

    /** Properties of a CallMonster. */
    interface ICallMonster {

        /** CallMonster ErrCode */
        ErrCode?: (number|null);

        /** CallMonster Id */
        Id?: (number|null);

        /** CallMonster Type */
        Type?: (number|null);

        /** CallMonster GoldNum */
        GoldNum?: (number|null);

        /** CallMonster RedNum */
        RedNum?: (number|null);

        /** CallMonster NewItems */
        NewItems?: ({ [k: string]: number }|null);
    }

    /** Represents a CallMonster. */
    class CallMonster implements ICallMonster {

        /**
         * Constructs a new CallMonster.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ICallMonster);

        /** CallMonster ErrCode. */
        public ErrCode: number;

        /** CallMonster Id. */
        public Id: number;

        /** CallMonster Type. */
        public Type: number;

        /** CallMonster GoldNum. */
        public GoldNum: number;

        /** CallMonster RedNum. */
        public RedNum: number;

        /** CallMonster NewItems. */
        public NewItems: { [k: string]: number };

        /**
         * Creates a new CallMonster instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CallMonster instance
         */
        public static create(properties?: outer_pb.ICallMonster): outer_pb.CallMonster;

        /**
         * Encodes the specified CallMonster message. Does not implicitly {@link outer_pb.CallMonster.verify|verify} messages.
         * @param message CallMonster message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ICallMonster, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a CallMonster message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CallMonster
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.CallMonster;
    }

    /** Properties of a QuestAct. */
    interface IQuestAct {

        /** QuestAct ErrCode */
        ErrCode?: (number|null);

        /** QuestAct TaskId */
        TaskId?: (number|null);

        /** QuestAct TaskType */
        TaskType?: (number|null);

        /** QuestAct Uid */
        Uid?: (string|null);

        /** QuestAct Equips */
        Equips?: (outer_pb.IEquip[]|null);

        /** QuestAct Items */
        Items?: ({ [k: string]: number }|null);

        /** QuestAct Num */
        Num?: (number|null);

        /** QuestAct State */
        State?: (number|null);

        /** QuestAct Step */
        Step?: (number|null);

        /** QuestAct ExpUp */
        ExpUp?: (number|null);

        /** QuestAct Count */
        Count?: (number|null);

        /** QuestAct JF */
        JF?: (number|null);

        /** QuestAct IsOver */
        IsOver?: (boolean|null);

        /** QuestAct QuestLv */
        QuestLv?: (string|null);

        /** QuestAct TaskIds */
        TaskIds?: (number[]|null);
    }

    /** Represents a QuestAct. */
    class QuestAct implements IQuestAct {

        /**
         * Constructs a new QuestAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IQuestAct);

        /** QuestAct ErrCode. */
        public ErrCode: number;

        /** QuestAct TaskId. */
        public TaskId: number;

        /** QuestAct TaskType. */
        public TaskType: number;

        /** QuestAct Uid. */
        public Uid: string;

        /** QuestAct Equips. */
        public Equips: outer_pb.IEquip[];

        /** QuestAct Items. */
        public Items: { [k: string]: number };

        /** QuestAct Num. */
        public Num: number;

        /** QuestAct State. */
        public State: number;

        /** QuestAct Step. */
        public Step: number;

        /** QuestAct ExpUp. */
        public ExpUp: number;

        /** QuestAct Count. */
        public Count: number;

        /** QuestAct JF. */
        public JF: number;

        /** QuestAct IsOver. */
        public IsOver: boolean;

        /** QuestAct QuestLv. */
        public QuestLv: string;

        /** QuestAct TaskIds. */
        public TaskIds: number[];

        /**
         * Creates a new QuestAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns QuestAct instance
         */
        public static create(properties?: outer_pb.IQuestAct): outer_pb.QuestAct;

        /**
         * Encodes the specified QuestAct message. Does not implicitly {@link outer_pb.QuestAct.verify|verify} messages.
         * @param message QuestAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IQuestAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a QuestAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns QuestAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.QuestAct;
    }

    /** Properties of a LianTiAct. */
    interface ILianTiAct {

        /** LianTiAct ErrCode */
        ErrCode?: (number|null);

        /** LianTiAct Type */
        Type?: (number|null);

        /** LianTiAct LTPros */
        LTPros?: (number[]|null);

        /** LianTiAct Id */
        Id?: (number|null);

        /** LianTiAct Num */
        Num?: (number|Long|null);

        /** LianTiAct BasePros */
        BasePros?: (outer_pb.IBasePros|null);

        /** LianTiAct UpType */
        UpType?: (number|null);
    }

    /** Represents a LianTiAct. */
    class LianTiAct implements ILianTiAct {

        /**
         * Constructs a new LianTiAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ILianTiAct);

        /** LianTiAct ErrCode. */
        public ErrCode: number;

        /** LianTiAct Type. */
        public Type: number;

        /** LianTiAct LTPros. */
        public LTPros: number[];

        /** LianTiAct Id. */
        public Id: number;

        /** LianTiAct Num. */
        public Num: (number|Long);

        /** LianTiAct BasePros. */
        public BasePros?: (outer_pb.IBasePros|null);

        /** LianTiAct UpType. */
        public UpType: number;

        /**
         * Creates a new LianTiAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LianTiAct instance
         */
        public static create(properties?: outer_pb.ILianTiAct): outer_pb.LianTiAct;

        /**
         * Encodes the specified LianTiAct message. Does not implicitly {@link outer_pb.LianTiAct.verify|verify} messages.
         * @param message LianTiAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ILianTiAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a LianTiAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LianTiAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.LianTiAct;
    }

    /** Properties of a DiaBuffAct. */
    interface IDiaBuffAct {

        /** DiaBuffAct ErrCode */
        ErrCode?: (number|null);

        /** DiaBuffAct Type */
        Type?: (number|null);

        /** DiaBuffAct IsDia */
        IsDia?: (boolean|null);

        /** DiaBuffAct Time */
        Time?: (number|Long|null);

        /** DiaBuffAct Num */
        Num?: (number|null);

        /** DiaBuffAct NeedDia */
        NeedDia?: (number|null);

        /** DiaBuffAct BasePros */
        BasePros?: (outer_pb.IBasePros|null);
    }

    /** Represents a DiaBuffAct. */
    class DiaBuffAct implements IDiaBuffAct {

        /**
         * Constructs a new DiaBuffAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IDiaBuffAct);

        /** DiaBuffAct ErrCode. */
        public ErrCode: number;

        /** DiaBuffAct Type. */
        public Type: number;

        /** DiaBuffAct IsDia. */
        public IsDia: boolean;

        /** DiaBuffAct Time. */
        public Time: (number|Long);

        /** DiaBuffAct Num. */
        public Num: number;

        /** DiaBuffAct NeedDia. */
        public NeedDia: number;

        /** DiaBuffAct BasePros. */
        public BasePros?: (outer_pb.IBasePros|null);

        /**
         * Creates a new DiaBuffAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DiaBuffAct instance
         */
        public static create(properties?: outer_pb.IDiaBuffAct): outer_pb.DiaBuffAct;

        /**
         * Encodes the specified DiaBuffAct message. Does not implicitly {@link outer_pb.DiaBuffAct.verify|verify} messages.
         * @param message DiaBuffAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IDiaBuffAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a DiaBuffAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DiaBuffAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.DiaBuffAct;
    }

    /** Properties of a PetAct. */
    interface IPetAct {

        /** PetAct ErrCode */
        ErrCode?: (number|null);

        /** PetAct Uid1 */
        Uid1?: (string|null);

        /** PetAct Uid2 */
        Uid2?: (string|null);

        /** PetAct ActType */
        ActType?: (number|null);

        /** PetAct Index */
        Index?: (number|null);

        /** PetAct Pet */
        Pet?: (outer_pb.IEquip|null);

        /** PetAct Id */
        Id?: (number|null);

        /** PetAct Num */
        Num?: (number|null);

        /** PetAct Value */
        Value?: (number|null);

        /** PetAct BodyType */
        BodyType?: (number|null);

        /** PetAct BasePros */
        BasePros?: (outer_pb.IBasePros|null);

        /** PetAct Equip2 */
        Equip2?: (outer_pb.IEquip|null);

        /** PetAct ExpOnly */
        ExpOnly?: (boolean|null);

        /** PetAct Items */
        Items?: ({ [k: string]: (number|Long) }|null);
    }

    /** Represents a PetAct. */
    class PetAct implements IPetAct {

        /**
         * Constructs a new PetAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IPetAct);

        /** PetAct ErrCode. */
        public ErrCode: number;

        /** PetAct Uid1. */
        public Uid1: string;

        /** PetAct Uid2. */
        public Uid2: string;

        /** PetAct ActType. */
        public ActType: number;

        /** PetAct Index. */
        public Index: number;

        /** PetAct Pet. */
        public Pet?: (outer_pb.IEquip|null);

        /** PetAct Id. */
        public Id: number;

        /** PetAct Num. */
        public Num: number;

        /** PetAct Value. */
        public Value: number;

        /** PetAct BodyType. */
        public BodyType: number;

        /** PetAct BasePros. */
        public BasePros?: (outer_pb.IBasePros|null);

        /** PetAct Equip2. */
        public Equip2?: (outer_pb.IEquip|null);

        /** PetAct ExpOnly. */
        public ExpOnly: boolean;

        /** PetAct Items. */
        public Items: { [k: string]: (number|Long) };

        /**
         * Creates a new PetAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PetAct instance
         */
        public static create(properties?: outer_pb.IPetAct): outer_pb.PetAct;

        /**
         * Encodes the specified PetAct message. Does not implicitly {@link outer_pb.PetAct.verify|verify} messages.
         * @param message PetAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IPetAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a PetAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PetAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.PetAct;
    }

    /** Properties of a HcAct. */
    interface IHcAct {

        /** HcAct ErrCode */
        ErrCode?: (number|null);

        /** HcAct Uids1 */
        Uids1?: (string[]|null);

        /** HcAct Uids2 */
        Uids2?: (string[]|null);

        /** HcAct FbType */
        FbType?: (number|null);

        /** HcAct FbLv */
        FbLv?: (number|null);

        /** HcAct Type */
        Type?: (number|null);

        /** HcAct LuckNum */
        LuckNum?: (number|null);

        /** HcAct BaoHuType */
        BaoHuType?: (number|null);

        /** HcAct HcNum */
        HcNum?: (number|null);

        /** HcAct NewEquip */
        NewEquip?: (outer_pb.IEquip|null);

        /** HcAct DelItems */
        DelItems?: ({ [k: string]: number }|null);

        /** HcAct NewItems */
        NewItems?: ({ [k: string]: number }|null);

        /** HcAct DelUids */
        DelUids?: (string[]|null);

        /** HcAct BodyType */
        BodyType?: (number|null);

        /** HcAct BasePros */
        BasePros?: (outer_pb.IBasePros|null);
    }

    /** Represents a HcAct. */
    class HcAct implements IHcAct {

        /**
         * Constructs a new HcAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IHcAct);

        /** HcAct ErrCode. */
        public ErrCode: number;

        /** HcAct Uids1. */
        public Uids1: string[];

        /** HcAct Uids2. */
        public Uids2: string[];

        /** HcAct FbType. */
        public FbType: number;

        /** HcAct FbLv. */
        public FbLv: number;

        /** HcAct Type. */
        public Type: number;

        /** HcAct LuckNum. */
        public LuckNum: number;

        /** HcAct BaoHuType. */
        public BaoHuType: number;

        /** HcAct HcNum. */
        public HcNum: number;

        /** HcAct NewEquip. */
        public NewEquip?: (outer_pb.IEquip|null);

        /** HcAct DelItems. */
        public DelItems: { [k: string]: number };

        /** HcAct NewItems. */
        public NewItems: { [k: string]: number };

        /** HcAct DelUids. */
        public DelUids: string[];

        /** HcAct BodyType. */
        public BodyType: number;

        /** HcAct BasePros. */
        public BasePros?: (outer_pb.IBasePros|null);

        /**
         * Creates a new HcAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HcAct instance
         */
        public static create(properties?: outer_pb.IHcAct): outer_pb.HcAct;

        /**
         * Encodes the specified HcAct message. Does not implicitly {@link outer_pb.HcAct.verify|verify} messages.
         * @param message HcAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IHcAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a HcAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HcAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.HcAct;
    }

    /** Properties of a XqAct. */
    interface IXqAct {

        /** XqAct ErrCode */
        ErrCode?: (number|null);

        /** XqAct BodyType */
        BodyType?: (number|null);

        /** XqAct XqIndex */
        XqIndex?: (number|null);

        /** XqAct XqPros */
        XqPros?: ({ [k: string]: outer_pb.IXqPros }|null);

        /** XqAct Id */
        Id?: (number|null);

        /** XqAct Num */
        Num?: (number|null);

        /** XqAct BasePros */
        BasePros?: (outer_pb.IBasePros|null);

        /** XqAct Pass */
        Pass?: (string|null);
    }

    /** Represents a XqAct. */
    class XqAct implements IXqAct {

        /**
         * Constructs a new XqAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IXqAct);

        /** XqAct ErrCode. */
        public ErrCode: number;

        /** XqAct BodyType. */
        public BodyType: number;

        /** XqAct XqIndex. */
        public XqIndex: number;

        /** XqAct XqPros. */
        public XqPros: { [k: string]: outer_pb.IXqPros };

        /** XqAct Id. */
        public Id: number;

        /** XqAct Num. */
        public Num: number;

        /** XqAct BasePros. */
        public BasePros?: (outer_pb.IBasePros|null);

        /** XqAct Pass. */
        public Pass: string;

        /**
         * Creates a new XqAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns XqAct instance
         */
        public static create(properties?: outer_pb.IXqAct): outer_pb.XqAct;

        /**
         * Encodes the specified XqAct message. Does not implicitly {@link outer_pb.XqAct.verify|verify} messages.
         * @param message XqAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IXqAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a XqAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns XqAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.XqAct;
    }

    /** Properties of a MyBossList. */
    interface IMyBossList {

        /** MyBossList List */
        List?: ({ [k: string]: outer_pb.IMyBoss }|null);

        /** MyBossList All */
        All?: ({ [k: string]: number }|null);

        /** MyBossList LoadAll */
        LoadAll?: (boolean|null);

        /** MyBossList CurPrice */
        CurPrice?: (number|null);
    }

    /** Represents a MyBossList. */
    class MyBossList implements IMyBossList {

        /**
         * Constructs a new MyBossList.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IMyBossList);

        /** MyBossList List. */
        public List: { [k: string]: outer_pb.IMyBoss };

        /** MyBossList All. */
        public All: { [k: string]: number };

        /** MyBossList LoadAll. */
        public LoadAll: boolean;

        /** MyBossList CurPrice. */
        public CurPrice: number;

        /**
         * Creates a new MyBossList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MyBossList instance
         */
        public static create(properties?: outer_pb.IMyBossList): outer_pb.MyBossList;

        /**
         * Encodes the specified MyBossList message. Does not implicitly {@link outer_pb.MyBossList.verify|verify} messages.
         * @param message MyBossList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IMyBossList, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a MyBossList message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MyBossList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.MyBossList;
    }

    /** Properties of a MyBoss. */
    interface IMyBoss {

        /** MyBoss Num */
        Num?: (number|null);

        /** MyBoss CanSd */
        CanSd?: (boolean|null);
    }

    /** Represents a MyBoss. */
    class MyBoss implements IMyBoss {

        /**
         * Constructs a new MyBoss.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IMyBoss);

        /** MyBoss Num. */
        public Num: number;

        /** MyBoss CanSd. */
        public CanSd: boolean;

        /**
         * Creates a new MyBoss instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MyBoss instance
         */
        public static create(properties?: outer_pb.IMyBoss): outer_pb.MyBoss;

        /**
         * Encodes the specified MyBoss message. Does not implicitly {@link outer_pb.MyBoss.verify|verify} messages.
         * @param message MyBoss message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IMyBoss, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a MyBoss message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MyBoss
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.MyBoss;
    }

    /** Properties of a XqPros. */
    interface IXqPros {

        /** XqPros XqPros */
        XqPros?: ({ [k: string]: outer_pb.IXqPro }|null);
    }

    /** Represents a XqPros. */
    class XqPros implements IXqPros {

        /**
         * Constructs a new XqPros.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IXqPros);

        /** XqPros XqPros. */
        public XqPros: { [k: string]: outer_pb.IXqPro };

        /**
         * Creates a new XqPros instance using the specified properties.
         * @param [properties] Properties to set
         * @returns XqPros instance
         */
        public static create(properties?: outer_pb.IXqPros): outer_pb.XqPros;

        /**
         * Encodes the specified XqPros message. Does not implicitly {@link outer_pb.XqPros.verify|verify} messages.
         * @param message XqPros message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IXqPros, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a XqPros message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns XqPros
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.XqPros;
    }

    /** Properties of a XqPro. */
    interface IXqPro {

        /** XqPro YgType */
        YgType?: (number|null);

        /** XqPro Lv */
        Lv?: (number|null);
    }

    /** Represents a XqPro. */
    class XqPro implements IXqPro {

        /**
         * Constructs a new XqPro.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IXqPro);

        /** XqPro YgType. */
        public YgType: number;

        /** XqPro Lv. */
        public Lv: number;

        /**
         * Creates a new XqPro instance using the specified properties.
         * @param [properties] Properties to set
         * @returns XqPro instance
         */
        public static create(properties?: outer_pb.IXqPro): outer_pb.XqPro;

        /**
         * Encodes the specified XqPro message. Does not implicitly {@link outer_pb.XqPro.verify|verify} messages.
         * @param message XqPro message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IXqPro, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a XqPro message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns XqPro
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.XqPro;
    }

    /** Properties of a FbAct. */
    interface IFbAct {

        /** FbAct ErrCode */
        ErrCode?: (number|null);

        /** FbAct Type */
        Type?: (number|null);

        /** FbAct Data */
        Data?: (outer_pb.IFbHistory|null);
    }

    /** Represents a FbAct. */
    class FbAct implements IFbAct {

        /**
         * Constructs a new FbAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IFbAct);

        /** FbAct ErrCode. */
        public ErrCode: number;

        /** FbAct Type. */
        public Type: number;

        /** FbAct Data. */
        public Data?: (outer_pb.IFbHistory|null);

        /**
         * Creates a new FbAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FbAct instance
         */
        public static create(properties?: outer_pb.IFbAct): outer_pb.FbAct;

        /**
         * Encodes the specified FbAct message. Does not implicitly {@link outer_pb.FbAct.verify|verify} messages.
         * @param message FbAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IFbAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a FbAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FbAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.FbAct;
    }

    /** Properties of a MineHole. */
    interface IMineHole {

        /** MineHole GoldHole */
        GoldHole?: (outer_pb.IHole|null);

        /** MineHole DiaHole */
        DiaHole?: (outer_pb.IHole|null);

        /** MineHole ItemHole */
        ItemHole?: (outer_pb.IHole|null);

        /** MineHole Grids */
        Grids?: (number[]|null);

        /** MineHole History */
        History?: (outer_pb.IHoleHistory[]|null);

        /** MineHole Up */
        Up?: (number|null);

        /** MineHole Reduce */
        Reduce?: (number|null);

        /** MineHole Add */
        Add?: (number|null);

        /** MineHole GoldYk */
        GoldYk?: (number|Long|null);

        /** MineHole IsRandom */
        IsRandom?: (boolean|null);

        /** MineHole LastGetTime */
        LastGetTime?: (number|Long|null);

        /** MineHole BuffUp */
        BuffUp?: (number|null);

        /** MineHole KfBuffUp */
        KfBuffUp?: (number|null);
    }

    /** Represents a MineHole. */
    class MineHole implements IMineHole {

        /**
         * Constructs a new MineHole.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IMineHole);

        /** MineHole GoldHole. */
        public GoldHole?: (outer_pb.IHole|null);

        /** MineHole DiaHole. */
        public DiaHole?: (outer_pb.IHole|null);

        /** MineHole ItemHole. */
        public ItemHole?: (outer_pb.IHole|null);

        /** MineHole Grids. */
        public Grids: number[];

        /** MineHole History. */
        public History: outer_pb.IHoleHistory[];

        /** MineHole Up. */
        public Up: number;

        /** MineHole Reduce. */
        public Reduce: number;

        /** MineHole Add. */
        public Add: number;

        /** MineHole GoldYk. */
        public GoldYk: (number|Long);

        /** MineHole IsRandom. */
        public IsRandom: boolean;

        /** MineHole LastGetTime. */
        public LastGetTime: (number|Long);

        /** MineHole BuffUp. */
        public BuffUp: number;

        /** MineHole KfBuffUp. */
        public KfBuffUp: number;

        /**
         * Creates a new MineHole instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MineHole instance
         */
        public static create(properties?: outer_pb.IMineHole): outer_pb.MineHole;

        /**
         * Encodes the specified MineHole message. Does not implicitly {@link outer_pb.MineHole.verify|verify} messages.
         * @param message MineHole message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IMineHole, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a MineHole message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MineHole
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.MineHole;
    }

    /** Properties of a HoleHistory. */
    interface IHoleHistory {

        /** HoleHistory Name */
        Name?: (string|null);

        /** HoleHistory Time */
        Time?: (number|Long|null);

        /** HoleHistory Type */
        Type?: (number|null);

        /** HoleHistory Gold */
        Gold?: (number|null);

        /** HoleHistory Dia */
        Dia?: (number|null);

        /** HoleHistory Item */
        Item?: (number|null);
    }

    /** Represents a HoleHistory. */
    class HoleHistory implements IHoleHistory {

        /**
         * Constructs a new HoleHistory.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IHoleHistory);

        /** HoleHistory Name. */
        public Name: string;

        /** HoleHistory Time. */
        public Time: (number|Long);

        /** HoleHistory Type. */
        public Type: number;

        /** HoleHistory Gold. */
        public Gold: number;

        /** HoleHistory Dia. */
        public Dia: number;

        /** HoleHistory Item. */
        public Item: number;

        /**
         * Creates a new HoleHistory instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HoleHistory instance
         */
        public static create(properties?: outer_pb.IHoleHistory): outer_pb.HoleHistory;

        /**
         * Encodes the specified HoleHistory message. Does not implicitly {@link outer_pb.HoleHistory.verify|verify} messages.
         * @param message HoleHistory message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IHoleHistory, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a HoleHistory message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HoleHistory
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.HoleHistory;
    }

    /** Properties of a Hole. */
    interface IHole {

        /** Hole Exp */
        Exp?: (number|null);

        /** Hole Lv */
        Lv?: (number|null);

        /** Hole Num */
        Num?: (number|null);
    }

    /** Represents a Hole. */
    class Hole implements IHole {

        /**
         * Constructs a new Hole.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IHole);

        /** Hole Exp. */
        public Exp: number;

        /** Hole Lv. */
        public Lv: number;

        /** Hole Num. */
        public Num: number;

        /**
         * Creates a new Hole instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Hole instance
         */
        public static create(properties?: outer_pb.IHole): outer_pb.Hole;

        /**
         * Encodes the specified Hole message. Does not implicitly {@link outer_pb.Hole.verify|verify} messages.
         * @param message Hole message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IHole, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a Hole message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Hole
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.Hole;
    }

    /** Properties of a HoleAct. */
    interface IHoleAct {

        /** HoleAct ErrCode */
        ErrCode?: (number|null);

        /** HoleAct Gold */
        Gold?: (number|null);

        /** HoleAct Dia */
        Dia?: (number|null);

        /** HoleAct Item */
        Item?: (number|null);

        /** HoleAct MyHole */
        MyHole?: (outer_pb.IMineHole|null);

        /** HoleAct Name */
        Name?: (string|null);

        /** HoleAct Id */
        Id?: (number|Long|null);

        /** HoleAct Up */
        Up?: (number|null);

        /** HoleAct Add */
        Add?: (number|null);

        /** HoleAct Reduce */
        Reduce?: (number|null);

        /** HoleAct Type */
        Type?: (number|null);

        /** HoleAct GoldHole */
        GoldHole?: (outer_pb.IHole|null);

        /** HoleAct DiaHole */
        DiaHole?: (outer_pb.IHole|null);

        /** HoleAct ItemHole */
        ItemHole?: (outer_pb.IHole|null);

        /** HoleAct GetRate */
        GetRate?: (number|null);

        /** HoleAct Sid */
        Sid?: (string|null);

        /** HoleAct Index */
        Index?: (number|null);

        /** HoleAct GoldYk */
        GoldYk?: (number|Long|null);

        /** HoleAct HoleDayNum */
        HoleDayNum?: (number[]|null);

        /** HoleAct OpenNum */
        OpenNum?: (number|null);

        /** HoleAct History */
        History?: (outer_pb.IHoleHistory[]|null);

        /** HoleAct Grids */
        Grids?: (number[]|null);

        /** HoleAct OpenedGrids */
        OpenedGrids?: ({ [k: string]: number }|null);

        /** HoleAct BuffHoles */
        BuffHoles?: (outer_pb.IBuffHole[]|null);

        /** HoleAct TeamId */
        TeamId?: (number|null);

        /** HoleAct RoleList */
        RoleList?: (outer_pb.IRoleInfo[]|null);

        /** HoleAct BuffHole */
        BuffHole?: (outer_pb.IBuffHole|null);

        /** HoleAct OldId */
        OldId?: (number|null);
    }

    /** Represents a HoleAct. */
    class HoleAct implements IHoleAct {

        /**
         * Constructs a new HoleAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IHoleAct);

        /** HoleAct ErrCode. */
        public ErrCode: number;

        /** HoleAct Gold. */
        public Gold: number;

        /** HoleAct Dia. */
        public Dia: number;

        /** HoleAct Item. */
        public Item: number;

        /** HoleAct MyHole. */
        public MyHole?: (outer_pb.IMineHole|null);

        /** HoleAct Name. */
        public Name: string;

        /** HoleAct Id. */
        public Id: (number|Long);

        /** HoleAct Up. */
        public Up: number;

        /** HoleAct Add. */
        public Add: number;

        /** HoleAct Reduce. */
        public Reduce: number;

        /** HoleAct Type. */
        public Type: number;

        /** HoleAct GoldHole. */
        public GoldHole?: (outer_pb.IHole|null);

        /** HoleAct DiaHole. */
        public DiaHole?: (outer_pb.IHole|null);

        /** HoleAct ItemHole. */
        public ItemHole?: (outer_pb.IHole|null);

        /** HoleAct GetRate. */
        public GetRate: number;

        /** HoleAct Sid. */
        public Sid: string;

        /** HoleAct Index. */
        public Index: number;

        /** HoleAct GoldYk. */
        public GoldYk: (number|Long);

        /** HoleAct HoleDayNum. */
        public HoleDayNum: number[];

        /** HoleAct OpenNum. */
        public OpenNum: number;

        /** HoleAct History. */
        public History: outer_pb.IHoleHistory[];

        /** HoleAct Grids. */
        public Grids: number[];

        /** HoleAct OpenedGrids. */
        public OpenedGrids: { [k: string]: number };

        /** HoleAct BuffHoles. */
        public BuffHoles: outer_pb.IBuffHole[];

        /** HoleAct TeamId. */
        public TeamId: number;

        /** HoleAct RoleList. */
        public RoleList: outer_pb.IRoleInfo[];

        /** HoleAct BuffHole. */
        public BuffHole?: (outer_pb.IBuffHole|null);

        /** HoleAct OldId. */
        public OldId: number;

        /**
         * Creates a new HoleAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HoleAct instance
         */
        public static create(properties?: outer_pb.IHoleAct): outer_pb.HoleAct;

        /**
         * Encodes the specified HoleAct message. Does not implicitly {@link outer_pb.HoleAct.verify|verify} messages.
         * @param message HoleAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IHoleAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a HoleAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HoleAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.HoleAct;
    }

    /** Properties of a BuffHole. */
    interface IBuffHole {

        /** BuffHole TeamId */
        TeamId?: (number|null);

        /** BuffHole Owner */
        Owner?: (string|null);

        /** BuffHole Sid */
        Sid?: (string|null);

        /** BuffHole State */
        State?: (number|null);
    }

    /** Represents a BuffHole. */
    class BuffHole implements IBuffHole {

        /**
         * Constructs a new BuffHole.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IBuffHole);

        /** BuffHole TeamId. */
        public TeamId: number;

        /** BuffHole Owner. */
        public Owner: string;

        /** BuffHole Sid. */
        public Sid: string;

        /** BuffHole State. */
        public State: number;

        /**
         * Creates a new BuffHole instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BuffHole instance
         */
        public static create(properties?: outer_pb.IBuffHole): outer_pb.BuffHole;

        /**
         * Encodes the specified BuffHole message. Does not implicitly {@link outer_pb.BuffHole.verify|verify} messages.
         * @param message BuffHole message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IBuffHole, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a BuffHole message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BuffHole
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.BuffHole;
    }

    /** Properties of a MailAct. */
    interface IMailAct {

        /** MailAct ErrCode */
        ErrCode?: (number|null);

        /** MailAct Uid */
        Uid?: (string|null);

        /** MailAct Items */
        Items?: ({ [k: string]: number }|null);

        /** MailAct Equips */
        Equips?: (outer_pb.IEquip[]|null);

        /** MailAct Mail */
        Mail?: (outer_pb.IEmail|null);

        /** MailAct Id */
        Id?: (number|null);
    }

    /** Represents a MailAct. */
    class MailAct implements IMailAct {

        /**
         * Constructs a new MailAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IMailAct);

        /** MailAct ErrCode. */
        public ErrCode: number;

        /** MailAct Uid. */
        public Uid: string;

        /** MailAct Items. */
        public Items: { [k: string]: number };

        /** MailAct Equips. */
        public Equips: outer_pb.IEquip[];

        /** MailAct Mail. */
        public Mail?: (outer_pb.IEmail|null);

        /** MailAct Id. */
        public Id: number;

        /**
         * Creates a new MailAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MailAct instance
         */
        public static create(properties?: outer_pb.IMailAct): outer_pb.MailAct;

        /**
         * Encodes the specified MailAct message. Does not implicitly {@link outer_pb.MailAct.verify|verify} messages.
         * @param message MailAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IMailAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a MailAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MailAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.MailAct;
    }

    /** Properties of a WorldBossFirstKill. */
    interface IWorldBossFirstKill {

        /** WorldBossFirstKill List */
        List?: ({ [k: string]: outer_pb.IRoleMini }|null);

        /** WorldBossFirstKill MyList */
        MyList?: ({ [k: string]: boolean }|null);
    }

    /** Represents a WorldBossFirstKill. */
    class WorldBossFirstKill implements IWorldBossFirstKill {

        /**
         * Constructs a new WorldBossFirstKill.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IWorldBossFirstKill);

        /** WorldBossFirstKill List. */
        public List: { [k: string]: outer_pb.IRoleMini };

        /** WorldBossFirstKill MyList. */
        public MyList: { [k: string]: boolean };

        /**
         * Creates a new WorldBossFirstKill instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WorldBossFirstKill instance
         */
        public static create(properties?: outer_pb.IWorldBossFirstKill): outer_pb.WorldBossFirstKill;

        /**
         * Encodes the specified WorldBossFirstKill message. Does not implicitly {@link outer_pb.WorldBossFirstKill.verify|verify} messages.
         * @param message WorldBossFirstKill message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IWorldBossFirstKill, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a WorldBossFirstKill message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WorldBossFirstKill
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.WorldBossFirstKill;
    }

    /** Properties of an Email. */
    interface IEmail {

        /** Email Time */
        Time?: (number|Long|null);

        /** Email Msg */
        Msg?: (string|null);

        /** Email Items */
        Items?: (outer_pb.IMailItem[]|null);
    }

    /** Represents an Email. */
    class Email implements IEmail {

        /**
         * Constructs a new Email.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IEmail);

        /** Email Time. */
        public Time: (number|Long);

        /** Email Msg. */
        public Msg: string;

        /** Email Items. */
        public Items: outer_pb.IMailItem[];

        /**
         * Creates a new Email instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Email instance
         */
        public static create(properties?: outer_pb.IEmail): outer_pb.Email;

        /**
         * Encodes the specified Email message. Does not implicitly {@link outer_pb.Email.verify|verify} messages.
         * @param message Email message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IEmail, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes an Email message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Email
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.Email;
    }

    /** Properties of a MailItem. */
    interface IMailItem {

        /** MailItem Type */
        Type?: (number|null);

        /** MailItem Id */
        Id?: (number|null);

        /** MailItem Num */
        Num?: (number|null);

        /** MailItem Equip */
        Equip?: (outer_pb.IEquip|null);
    }

    /** Represents a MailItem. */
    class MailItem implements IMailItem {

        /**
         * Constructs a new MailItem.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IMailItem);

        /** MailItem Type. */
        public Type: number;

        /** MailItem Id. */
        public Id: number;

        /** MailItem Num. */
        public Num: number;

        /** MailItem Equip. */
        public Equip?: (outer_pb.IEquip|null);

        /**
         * Creates a new MailItem instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MailItem instance
         */
        public static create(properties?: outer_pb.IMailItem): outer_pb.MailItem;

        /**
         * Encodes the specified MailItem message. Does not implicitly {@link outer_pb.MailItem.verify|verify} messages.
         * @param message MailItem message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IMailItem, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a MailItem message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MailItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.MailItem;
    }

    /** Properties of a GetPhAct. */
    interface IGetPhAct {

        /** GetPhAct ErrCode */
        ErrCode?: (number|null);

        /** GetPhAct Type */
        Type?: (number|null);

        /** GetPhAct RoleType */
        RoleType?: (number|null);

        /** GetPhAct LvPhList */
        LvPhList?: (outer_pb.ILvPhInfo[]|null);

        /** GetPhAct CjPhList */
        CjPhList?: (outer_pb.ICjPhInfo[]|null);

        /** GetPhAct Page */
        Page?: (number|null);

        /** GetPhAct TotalPage */
        TotalPage?: (number|null);

        /** GetPhAct HasGot */
        HasGot?: (boolean|null);
    }

    /** Represents a GetPhAct. */
    class GetPhAct implements IGetPhAct {

        /**
         * Constructs a new GetPhAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IGetPhAct);

        /** GetPhAct ErrCode. */
        public ErrCode: number;

        /** GetPhAct Type. */
        public Type: number;

        /** GetPhAct RoleType. */
        public RoleType: number;

        /** GetPhAct LvPhList. */
        public LvPhList: outer_pb.ILvPhInfo[];

        /** GetPhAct CjPhList. */
        public CjPhList: outer_pb.ICjPhInfo[];

        /** GetPhAct Page. */
        public Page: number;

        /** GetPhAct TotalPage. */
        public TotalPage: number;

        /** GetPhAct HasGot. */
        public HasGot: boolean;

        /**
         * Creates a new GetPhAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetPhAct instance
         */
        public static create(properties?: outer_pb.IGetPhAct): outer_pb.GetPhAct;

        /**
         * Encodes the specified GetPhAct message. Does not implicitly {@link outer_pb.GetPhAct.verify|verify} messages.
         * @param message GetPhAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IGetPhAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a GetPhAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetPhAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.GetPhAct;
    }

    /** Properties of a CjPhInfo. */
    interface ICjPhInfo {

        /** CjPhInfo Name */
        Name?: (string|null);

        /** CjPhInfo Time */
        Time?: (number|Long|null);

        /** CjPhInfo Id */
        Id?: (number|Long|null);

        /** CjPhInfo Sort */
        Sort?: (number|null);
    }

    /** Represents a CjPhInfo. */
    class CjPhInfo implements ICjPhInfo {

        /**
         * Constructs a new CjPhInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ICjPhInfo);

        /** CjPhInfo Name. */
        public Name: string;

        /** CjPhInfo Time. */
        public Time: (number|Long);

        /** CjPhInfo Id. */
        public Id: (number|Long);

        /** CjPhInfo Sort. */
        public Sort: number;

        /**
         * Creates a new CjPhInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CjPhInfo instance
         */
        public static create(properties?: outer_pb.ICjPhInfo): outer_pb.CjPhInfo;

        /**
         * Encodes the specified CjPhInfo message. Does not implicitly {@link outer_pb.CjPhInfo.verify|verify} messages.
         * @param message CjPhInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ICjPhInfo, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a CjPhInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CjPhInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.CjPhInfo;
    }

    /** Properties of a RoleMini. */
    interface IRoleMini {

        /** RoleMini Id */
        Id?: (number|Long|null);

        /** RoleMini Name */
        Name?: (string|null);
    }

    /** Represents a RoleMini. */
    class RoleMini implements IRoleMini {

        /**
         * Constructs a new RoleMini.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IRoleMini);

        /** RoleMini Id. */
        public Id: (number|Long);

        /** RoleMini Name. */
        public Name: string;

        /**
         * Creates a new RoleMini instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoleMini instance
         */
        public static create(properties?: outer_pb.IRoleMini): outer_pb.RoleMini;

        /**
         * Encodes the specified RoleMini message. Does not implicitly {@link outer_pb.RoleMini.verify|verify} messages.
         * @param message RoleMini message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IRoleMini, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a RoleMini message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoleMini
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.RoleMini;
    }

    /** Properties of a LvPhInfo. */
    interface ILvPhInfo {

        /** LvPhInfo Id */
        Id?: (number|Long|null);

        /** LvPhInfo Name */
        Name?: (string|null);

        /** LvPhInfo Zm */
        Zm?: (string|null);

        /** LvPhInfo Lv */
        Lv?: (number|null);

        /** LvPhInfo ZsNum */
        ZsNum?: (number|null);

        /** LvPhInfo DsLv */
        DsLv?: (number|null);

        /** LvPhInfo Sort */
        Sort?: (number|null);
    }

    /** Represents a LvPhInfo. */
    class LvPhInfo implements ILvPhInfo {

        /**
         * Constructs a new LvPhInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ILvPhInfo);

        /** LvPhInfo Id. */
        public Id: (number|Long);

        /** LvPhInfo Name. */
        public Name: string;

        /** LvPhInfo Zm. */
        public Zm: string;

        /** LvPhInfo Lv. */
        public Lv: number;

        /** LvPhInfo ZsNum. */
        public ZsNum: number;

        /** LvPhInfo DsLv. */
        public DsLv: number;

        /** LvPhInfo Sort. */
        public Sort: number;

        /**
         * Creates a new LvPhInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LvPhInfo instance
         */
        public static create(properties?: outer_pb.ILvPhInfo): outer_pb.LvPhInfo;

        /**
         * Encodes the specified LvPhInfo message. Does not implicitly {@link outer_pb.LvPhInfo.verify|verify} messages.
         * @param message LvPhInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ILvPhInfo, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a LvPhInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LvPhInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.LvPhInfo;
    }

    /** Properties of a SwitchBossOwner. */
    interface ISwitchBossOwner {

        /** SwitchBossOwner ErrCode */
        ErrCode?: (number|null);

        /** SwitchBossOwner Index */
        Index?: (number|null);

        /** SwitchBossOwner Owner */
        Owner?: (string|null);

        /** SwitchBossOwner NewId */
        NewId?: (number|Long|null);

        /** SwitchBossOwner Cost */
        Cost?: (number|null);
    }

    /** Represents a SwitchBossOwner. */
    class SwitchBossOwner implements ISwitchBossOwner {

        /**
         * Constructs a new SwitchBossOwner.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.ISwitchBossOwner);

        /** SwitchBossOwner ErrCode. */
        public ErrCode: number;

        /** SwitchBossOwner Index. */
        public Index: number;

        /** SwitchBossOwner Owner. */
        public Owner: string;

        /** SwitchBossOwner NewId. */
        public NewId: (number|Long);

        /** SwitchBossOwner Cost. */
        public Cost: number;

        /**
         * Creates a new SwitchBossOwner instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SwitchBossOwner instance
         */
        public static create(properties?: outer_pb.ISwitchBossOwner): outer_pb.SwitchBossOwner;

        /**
         * Encodes the specified SwitchBossOwner message. Does not implicitly {@link outer_pb.SwitchBossOwner.verify|verify} messages.
         * @param message SwitchBossOwner message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.ISwitchBossOwner, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a SwitchBossOwner message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SwitchBossOwner
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.SwitchBossOwner;
    }

    /** Properties of a HunAct. */
    interface IHunAct {

        /** HunAct ErrCode */
        ErrCode?: (number|null);

        /** HunAct Id */
        Id?: (number|null);

        /** HunAct Lv */
        Lv?: (number|null);

        /** HunAct Num */
        Num?: (number|null);

        /** HunAct HunList */
        HunList?: ({ [k: string]: number }|null);

        /** HunAct BasePros */
        BasePros?: (outer_pb.IBasePros|null);

        /** HunAct NewItems */
        NewItems?: ({ [k: string]: number }|null);

        /** HunAct GetSpNum */
        GetSpNum?: (number|null);
    }

    /** Represents a HunAct. */
    class HunAct implements IHunAct {

        /**
         * Constructs a new HunAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IHunAct);

        /** HunAct ErrCode. */
        public ErrCode: number;

        /** HunAct Id. */
        public Id: number;

        /** HunAct Lv. */
        public Lv: number;

        /** HunAct Num. */
        public Num: number;

        /** HunAct HunList. */
        public HunList: { [k: string]: number };

        /** HunAct BasePros. */
        public BasePros?: (outer_pb.IBasePros|null);

        /** HunAct NewItems. */
        public NewItems: { [k: string]: number };

        /** HunAct GetSpNum. */
        public GetSpNum: number;

        /**
         * Creates a new HunAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HunAct instance
         */
        public static create(properties?: outer_pb.IHunAct): outer_pb.HunAct;

        /**
         * Encodes the specified HunAct message. Does not implicitly {@link outer_pb.HunAct.verify|verify} messages.
         * @param message HunAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IHunAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a HunAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HunAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.HunAct;
    }

    /** Properties of a JfAct. */
    interface IJfAct {

        /** JfAct ErrCode */
        ErrCode?: (number|null);

        /** JfAct Jf */
        Jf?: (number|null);

        /** JfAct GotIndex */
        GotIndex?: (number|null);

        /** JfAct Index */
        Index?: (number|null);

        /** JfAct Id */
        Id?: (number|null);

        /** JfAct Type */
        Type?: (number|null);

        /** JfAct Equips */
        Equips?: (outer_pb.IEquip[]|null);

        /** JfAct Items */
        Items?: ({ [k: string]: number }|null);

        /** JfAct BaseYk */
        BaseYk?: (number|Long|null);

        /** JfAct GoldYk */
        GoldYk?: (number|Long|null);

        /** JfAct GotJf */
        GotJf?: (number|null);

        /** JfAct HdType */
        HdType?: (number|null);
    }

    /** Represents a JfAct. */
    class JfAct implements IJfAct {

        /**
         * Constructs a new JfAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IJfAct);

        /** JfAct ErrCode. */
        public ErrCode: number;

        /** JfAct Jf. */
        public Jf: number;

        /** JfAct GotIndex. */
        public GotIndex: number;

        /** JfAct Index. */
        public Index: number;

        /** JfAct Id. */
        public Id: number;

        /** JfAct Type. */
        public Type: number;

        /** JfAct Equips. */
        public Equips: outer_pb.IEquip[];

        /** JfAct Items. */
        public Items: { [k: string]: number };

        /** JfAct BaseYk. */
        public BaseYk: (number|Long);

        /** JfAct GoldYk. */
        public GoldYk: (number|Long);

        /** JfAct GotJf. */
        public GotJf: number;

        /** JfAct HdType. */
        public HdType: number;

        /**
         * Creates a new JfAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns JfAct instance
         */
        public static create(properties?: outer_pb.IJfAct): outer_pb.JfAct;

        /**
         * Encodes the specified JfAct message. Does not implicitly {@link outer_pb.JfAct.verify|verify} messages.
         * @param message JfAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IJfAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a JfAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns JfAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.JfAct;
    }

    /** Properties of a XuYuanAct. */
    interface IXuYuanAct {

        /** XuYuanAct ErrCode */
        ErrCode?: (number|null);

        /** XuYuanAct Type */
        Type?: (number|null);

        /** XuYuanAct CurDia */
        CurDia?: (number|null);

        /** XuYuanAct OldDia */
        OldDia?: (number|null);

        /** XuYuanAct OldName */
        OldName?: (string|null);

        /** XuYuanAct History */
        History?: (string[]|null);

        /** XuYuanAct Num */
        Num?: (number|null);

        /** XuYuanAct Equips */
        Equips?: ({ [k: string]: outer_pb.IEquip }|null);

        /** XuYuanAct Items */
        Items?: ({ [k: string]: number }|null);

        /** XuYuanAct Rate */
        Rate?: (number|null);

        /** XuYuanAct DelItem */
        DelItem?: (outer_pb.IItem|null);

        /** XuYuanAct OldName1 */
        OldName1?: (string|null);

        /** XuYuanAct OldName2 */
        OldName2?: (string|null);

        /** XuYuanAct GetPetNum */
        GetPetNum?: (number|null);
    }

    /** Represents a XuYuanAct. */
    class XuYuanAct implements IXuYuanAct {

        /**
         * Constructs a new XuYuanAct.
         * @param [properties] Properties to set
         */
        constructor(properties?: outer_pb.IXuYuanAct);

        /** XuYuanAct ErrCode. */
        public ErrCode: number;

        /** XuYuanAct Type. */
        public Type: number;

        /** XuYuanAct CurDia. */
        public CurDia: number;

        /** XuYuanAct OldDia. */
        public OldDia: number;

        /** XuYuanAct OldName. */
        public OldName: string;

        /** XuYuanAct History. */
        public History: string[];

        /** XuYuanAct Num. */
        public Num: number;

        /** XuYuanAct Equips. */
        public Equips: { [k: string]: outer_pb.IEquip };

        /** XuYuanAct Items. */
        public Items: { [k: string]: number };

        /** XuYuanAct Rate. */
        public Rate: number;

        /** XuYuanAct DelItem. */
        public DelItem?: (outer_pb.IItem|null);

        /** XuYuanAct OldName1. */
        public OldName1: string;

        /** XuYuanAct OldName2. */
        public OldName2: string;

        /** XuYuanAct GetPetNum. */
        public GetPetNum: number;

        /**
         * Creates a new XuYuanAct instance using the specified properties.
         * @param [properties] Properties to set
         * @returns XuYuanAct instance
         */
        public static create(properties?: outer_pb.IXuYuanAct): outer_pb.XuYuanAct;

        /**
         * Encodes the specified XuYuanAct message. Does not implicitly {@link outer_pb.XuYuanAct.verify|verify} messages.
         * @param message XuYuanAct message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: outer_pb.IXuYuanAct, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a XuYuanAct message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns XuYuanAct
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): outer_pb.XuYuanAct;
    }
}
