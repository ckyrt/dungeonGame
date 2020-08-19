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
        let close = global.getChildByName(this.node, "close")
        close.on(cc.Node.EventType.TOUCH_START,
            () => {
                this.closePanel()
            },
            this)

        jsClientScript.registerMsg(MsgID.RankDataAck, (msg) => {
            this.onRankDataAck(msg)
        })
    },

    // update (dt) {},

    openPanel() {
        this.node.x = 0

        var msg = {}
        msg.msg_id = MsgID.GET_RANK_DATA
        jsClientScript.send(JSON.stringify(msg))
    },

    closePanel() {
        this.node.x = 2000
    },

    onRankDataAck: function (msg) {
        let datas = msg.results
        let str = ''
        for (var i = 0; i < datas.length; ++i) {

            let data = datas[i]
            str += data.name + '  ' + data.level + '  ' + data.exp + '  ' + data.coin + '\n'
        }

        global.getChildByName(this.node, "datas").getComponent(cc.Label).string = str
    },
});
