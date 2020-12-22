// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        bt_prev: {
            type: cc.Button,
            default: null,
        },
        bt_next: {
            type: cc.Button,
            default: null,
        },
        bt_close: {
            type: cc.Button,
            default: null,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.bt_prev.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {

            }, this)
        this.bt_next.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {

            }, this)
        this.bt_close.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                //关掉
                this.node.destroy()
            }, this)
        this.node.zIndex = global.getBigZIndex()
    },

    // update (dt) {},

    setData: function (words, buttons) {

    },
});
