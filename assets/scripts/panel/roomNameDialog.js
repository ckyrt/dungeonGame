var global = require('global')
cc.Class({
    extends: cc.Component,

    properties: {

        inputName: {
            default: null,
            type: cc.EditBox
        },
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

        let create = global.getChildByName(this.node, "create")
        create.on(cc.Node.EventType.TOUCH_START,
            () => {
                if (this.inputName.string != '') {
                    this.func(this.inputName.string)
                    this.closePanel()
                }
            },
            this)
    },

    // update (dt) {},

    openPanel(func) {
        this.node.x = 0
        this.func = func
    },

    closePanel() {
        this.node.x = 10000
    },
});
