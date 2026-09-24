
import { Component, _decorator, director, AudioSource, AudioClip } from "cc";
import { SoundType } from "../base/types";
import GD from "../base/GameData";
import WS, { ConnType } from "../base/net";
import { MiniMapControl } from "../battle/MiniMapControl";
const { ccclass,property} = _decorator;

 @ccclass('GameManager')
export default class GameManager extends Component {
    @property(AudioSource)
    bgmAS:AudioSource;
    @property(AudioSource)
    effectAS:AudioSource;
    @property(AudioSource)
    monsterAS:AudioSource;
    @property(AudioSource)
    tipAS:AudioSource;
    private static _i: GameManager;
    public static get I(): GameManager {
        return GameManager._i;
    }
    // public audioSource:AudioSource;
    //-----------------------------------------------------------------------------------------------------
    // private _playerMgr: PlayerManager = null;
    // public get playerMgr(): PlayerManager {
    //     if(this._playerMgr == null){
    //         this._playerMgr = this.getComponentInChildren(PlayerManager);
    //     }
    //     return this._playerMgr;
    // }

    onLoad () {
        if(this.soundValue==null)this.soundValue=1;
        if(!GameManager._i){
            GameManager._i = this;
            director.addPersistRootNode(this.node);
            // this.init();
        }else{
            this.node.destroy(); //场景里只能有一个GameManager,有多余的必须销毁
        }
    }
    setSoundValue=(v:number)=>{
        this.bgmAS.volume=v
        this.soundValue=v;
    }
    public set(sets:{ [k: string]: number; },save:boolean=true){
        this.soundValue = sets[1]==null?1:sets[1]/100;
        if(this.soundValue>1){
            this.soundValue=1
        }else if(this.soundValue<0){
            this.soundValue=0
        }
        this.isBgmOff = sets[4]==null?false:sets[4]==0
        this.isMonsterSoundOff = sets[5]==null?false:sets[5]==0
        this.isEffectSoundOff = sets[6]==null?false:sets[6]==0
        this.isTipSoundOff = sets[7]==null?false:sets[7]==0
        if(GD.role){
            if(this.isBgmOff){
                this.bgmAS.stop();
            }else{
                GD.curMap&&GD.isFocusIn&&WS.Type==ConnType.Gate&&this.playMusic('map'+GD.curMap.mapId);
            }
            GD.autoFocusOutTime = 60*5*(sets[3]==null?2:sets[3]+1);

            GD.role.showGetExp = sets[8]==null?true:sets[8]==1
            GD.needPlayCdAni= sets[9]==null?true:sets[9]==1
            MiniMapControl.I.setDraw(sets[10]==null?true:sets[10]==1)
            GD.playMoveMotion= sets[11]==null?true:sets[11]==1;

            GD.player&&GD.player.setMoveMotion(GD.playMoveMotion)
        }
        if(save){
            localStorage.setItem('sets',JSON.stringify(sets));
        }
    }
    effectSoundClips:Map<string,AudioClip>=new Map()
    isEffectSoundOff:boolean=false;
    playEffectSound(soundName: string) {
        if(this.isEffectSoundOff)return
        let url = 'sound/effect/'+soundName;
        let clip = this.effectSoundClips.get(url)
        if(clip){
            this.effectAS.playOneShot(clip, this.soundValue);
        }else{
            GD.commonBundle.load(url, (err, clip: AudioClip) => {
                if(clip){
                    this.effectAS.playOneShot(clip, this.soundValue);
                    this.effectSoundClips.set(url,clip);
                }
            });
        }
    }
    monsterSoundClips:Map<string,AudioClip>=new Map()
    isMonsterSoundOff:boolean=false;
    playMonsterSound(id: number,type:SoundType) {
        if(this.isMonsterSoundOff)return
        let url = `sound/monster/${id}_${type}`;
        let clip = this.monsterSoundClips.get(url)
        if(clip){
            this.monsterAS.playOneShot(clip, this.soundValue);
        }else{
            GD.commonBundle.load(url, (err, clip: AudioClip) => {
                if(clip){
                    this.monsterAS.playOneShot(clip, this.soundValue);
                    this.monsterSoundClips.set(url,clip);
                }
            });
        }
    }
    clickClip:AudioClip;
    isTipSoundOff:boolean=false;
    soundValue:number=1.0;
    playTipSound(soundName: string) {
        if(this.isTipSoundOff)return
        let url = 'sound/effect/'+soundName;
        let clip = this.effectSoundClips.get(url)
        if(clip){
            this.tipAS.playOneShot(clip, this.soundValue);
        }else{
            GD.commonBundle.load(url, (err, clip: AudioClip) => {
                if(clip){
                    this.tipAS.playOneShot(clip, this.soundValue);
                    this.effectSoundClips.set(url,clip);
                }
            });
        }
    }
    playClickSound(){
        if(this.isTipSoundOff)return
        if(this.clickClip){
            this.tipAS.playOneShot(this.clickClip, this.soundValue);
        }else{
            GD.commonBundle.load('sound/effect/click', (err, clip: AudioClip) => {
                if(err){
                    console.log(err);
                }else{
                    this.clickClip=clip
                    this.tipAS.playOneShot(clip, this.soundValue);
                }
            });
        }
    }
    errorClip:AudioClip;
    playErrorSound(){
        if(this.isTipSoundOff)return
        if(this.errorClip){
            this.tipAS.playOneShot(this.errorClip, this.soundValue);
        }else{
            GD.commonBundle.load('sound/effect/error', (err, clip: AudioClip) => {
                if(err){
                    console.log(err);
                }else{
                    this.errorClip=clip
                    this.tipAS.playOneShot(clip, this.soundValue);
                }
            });
        }
    }
    openPageClip:AudioClip;
    playOpenSound(){
        if(this.isTipSoundOff)return
        if(this.openPageClip){
            this.tipAS.playOneShot(this.openPageClip, this.soundValue);
        }else{
            GD.commonBundle.load('sound/effect/open', (err, clip: AudioClip) => {
                if(clip){
                    this.openPageClip=clip
                    this.tipAS.playOneShot(clip, this.soundValue);
                }
            });
        }
    }
    /**
     * 播放长音频，比如 背景音乐
     * @param musicName url for the sound
     * @param volume 
     */
    isBgmOff:boolean=false;
    playMusic(musicName:string) {
        if(this.isBgmOff)return
        if(this.bgmAS){
            GD.commonBundle.load('sound/music/'+musicName, (err, clip: AudioClip) => {
                this.bgmAS.pause();
                if (err) {
                    // console.log(err);
                }else {
                    this.bgmAS.clip = clip;
                    this.bgmAS.play();
                    this.bgmAS.volume = this.soundValue*0.6;
                }
            });
        }
    }
    // stop() {
    //     this.audioSource.stop();
    // }
    // pause() {
    //     this.audioSource.pause();
    // }
    // resume(){
    //     this.audioSource.play();
    // }
}
