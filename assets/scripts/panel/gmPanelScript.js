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

    start() {
        let close = global.getChildByName(this.node, "close")
        close.on(cc.Node.EventType.TOUCH_START,
            () => {
                this.closePanel()
            },
            this)
    },

    // update (dt) {},

    openPanel() {

        this.node.x = 0
        this.node.zIndex = global.getBigZIndex()
    },

    closePanel() {
        this.node.x = 10000
        this.node.zIndex = 0
    },
});
