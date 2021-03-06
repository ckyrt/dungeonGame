var global = require('global')
var MsgID = require('MsgID')

let SERVER_ADDRESS = '139.155.80.3:8001'

var jsClientScript = {

    msgFuncs: {},
    ws_: new WebSocket('ws://' + SERVER_ADDRESS),

    start() {

        let rpc = require('rpc')
        let ws = this.ws_
        let that = this
        ws.onopen = function (e) {
            console.log('连接服务器成功')
        }
        ws.onclose = function (e) {
            console.log('服务器关闭')
            global.connectStatus = 'closed'
        }
        ws.onerror = function () {
            console.log('连接出错')
            global.connectStatus = 'closed'
        }

        ws.onmessage = function (e) {
            //console.log('got message: ' + e.data)
            var msg = JSON.parse(e.data);
            if (MsgID.SM_RPC_CALL == msg.msg_id) {
                rpc._onRpcCall(msg.f_name, msg.args)
            }
            else {
                let func = that.msgFuncs[msg.msg_id]
                if (func)
                    func(msg)
                else
                    console.log('msg not register: ', msg.msg_id)
            }
        }
    },

    send: function (str) {
        //console.log('send ' + str)
        this.ws_.send(str)
    },

    registerMsg: function (msg_id, func) {
        this.msgFuncs[msg_id] = func
    },
}

jsClientScript.start()

module.exports = jsClientScript;
