var global = require('global')


cc.Class({
    extends: cc.Component,

    properties: {

        audio1: {
            default: null,
            type: cc.AudioClip
        },
        audio2: {
            default: null,
            type: cc.AudioClip
        },
        audio3: {
            default: null,
            type: cc.AudioClip
        },
        audio4: {
            default: null,
            type: cc.AudioClip
        },
        audio5: {
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {


    },

    // update (dt) {},

    onEnterNewDungeon: function () {

        cc.audioEngine.stopMusic()

        let n = global.random(1, 6)
        let music_name = ''
        if (n == 1)
            music_name = 'ArthasTheme'
        if (n == 2)
            music_name = 'BloodElfTheme'
        if (n == 3)
            music_name = 'HumanX1'
        if (n == 4)
            music_name = 'IllidansTheme'
        if (n == 5)
            music_name = 'LichKingTheme'
        if (n == 6)
            music_name = 'UndeadX1'

        var url = "sounds/music_back/" + music_name
        //cc.audioEngine.playMusic(cc.url.raw(url), true)
        cc.loader.loadRes(url, cc.AudioClip, null, function (err, clip) {
            if (err) {
                cc.error(err.message || err)
                return
            }
            var audioID = cc.audioEngine.playMusic(clip, false)
            cc.audioEngine.setMusicVolume(0.3)
        })
    },

    playEffect: function (effect_name) {

        cc.audioEngine.stopAllEffects()

        var url = "sounds/music_effect/" + effect_name

        cc.loader.loadRes(url, cc.AudioClip, null, function (err, clip) {
            if (err) {
                cc.error(err.message || err)
                return
            }
            cc.audioEngine.playEffect(clip, false)
            cc.audioEngine.setEffectsVolume(1)
        })
    },
});
