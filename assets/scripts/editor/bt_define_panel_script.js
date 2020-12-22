var global = require('global')

cc.Class({
    extends: cc.Component,

    properties: {
        edit_words: {
            type: cc.EditBox,
            default: null,
        },
        edit_action: {
            type: cc.EditBox,
            default: null,
        },
        bt_cancel: {
            type: cc.Button,
            default: null,
        },
        bt_ok: {
            type: cc.Button,
            default: null,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.bt_cancel.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                //关闭
                this.node.destroy()
            }, this)

        this.bt_ok.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                //保存 关闭
                this.save_func(this.edit_words.string, this.edit_action.string)
                this.node.destroy()
            }, this)

        this.edit_words.string = this.words || ''
        this.edit_action.string = this.action || ''

        this.node.zIndex = global.getBigZIndex()
    },

    // update (dt) {},
    setData: function (words, action, save_func) {
        //文字
        //行为
        this.words = words
        this.action = action
        this.save_func = save_func
        console.log('bt_define_panel_script setData', words, action)
    },
});
