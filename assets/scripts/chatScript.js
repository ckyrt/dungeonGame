var global = require('global')
var jsClientScript = require('jsClientScript')
var MsgID = require('MsgID')

cc.Class({
    extends: cc.Component,

    properties: {
        chat_bt: {
            default: null,
            type: cc.Button
        },

        chat_input: {
            default: null,
            type: cc.EditBox
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

        jsClientScript.registerMsg(MsgID.ChatNtf, (msg) => {
            this.onChatNtf(msg)
        })


        this.chat_bt.node.on('click', function (e) {
            var str = this.chat_input.string
            if (str.trim() == '')
                return
            str = str.trim()

            str = str.slice(0, 20)
            var msg = {}
            msg.msg_id = MsgID.ChatReq
            msg.text = str
            msg.sender = global.roleName
            jsClientScript.send(JSON.stringify(msg))
            this.chat_input.string = ''
        }, this)


        //获取最新10个历史聊天
        var msg = {}
        msg.msg_id = MsgID.GetLast10ChatReq
        jsClientScript.send(JSON.stringify(msg))
    },

    // update (dt) {},

    onChatNtf: function (msg) {
        cc.find("Canvas/UI").getComponent('UIRootScript')._addTextInfo(msg.sender + ':' + msg.text, new cc.color(0, 255, 0))
    },
});
