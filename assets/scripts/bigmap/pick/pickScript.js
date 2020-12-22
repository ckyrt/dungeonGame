var global = require('global')
var jsClientScript = require('jsClientScript')
var MsgID = require('MsgID')

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
        this.shown = false
        this.node.on(cc.Node.EventType.TOUCH_START,
            () => {
                this._applyPickToServer()
            },
            this)
    },

    // update (dt) {},

    showPickIconf: function (uuid) {
        if (this.item_uuid != null)
            return
        this.item_uuid = uuid
        this.node.x = 100
        this.node.zIndex = global.getBigZIndex()
        console.log('showPickIconf:' + uuid)
    },

    hidePickIcon: function () {
        if (!this.item_uuid)
            return
        this.node.x = 10000
        this.node.zIndex = 0
        this.item_uuid = null
        console.log('hidePickIcon')
    },

    _applyPickToServer: function () {
        //send to server pick the item uui
        var msg = {}
        msg.msg_id = MsgID.CM_PICK_ITEM
        msg.role_id = global.roleName
        msg.uuid = this.item_uuid
        jsClientScript.send(JSON.stringify(msg))
    },
});
