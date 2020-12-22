
var MsgID = require('MsgID')

var rpc = {

    //rpc
    rpcFuncs: [],
    addRpcFunc: function (f_name, f) {
        this.rpcFuncs[f_name] = f
    },
    _onRpcCall: function (f_name, args) {
        console.log('rpc:', f_name, args)
        let f = this.rpcFuncs[f_name]
        if (f)
            f(args)
    },

    //远程调用服务器方法
    _call: function (f_name, args) {
        var msg = {}
        msg.msg_id = MsgID.CM_RPC_CALL
        msg.f_name = f_name
        msg.args = args
        var jsClientScript = require('jsClientScript')
        jsClientScript.send(JSON.stringify(msg))
        console.log('rpc._call', msg)
    },


}

module.exports = rpc;