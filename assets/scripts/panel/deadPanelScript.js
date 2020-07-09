var global = require('global')

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let playAgain = global.getChildByName(this.node, "playAgain")
        playAgain.on(cc.Node.EventType.TOUCH_START,
            ()=>{
                this.closeDeadPanel()
                let backScript = cc.find("Canvas/back").getComponent('backScript')
                backScript.restart()
            },
            this)
    },

    // update (dt) {},

    openDeadPanel:function()
    {
        this.node.x = 0
    },

    closeDeadPanel:function(t)
    {
        this.node.x = -2000
    },
});
