var jsClientScript = require('jsClientScript')
var MsgID = require('MsgID')
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
        btRegister: {
            default: null,
            type: cc.Button
        },
        btLogin: {
            default: null,
            type: cc.Button
        },
        inputName: {
            default: null,
            type: cc.EditBox
        },
        inputPassword: {
            default: null,
            type: cc.EditBox
        },
        errorTip: {
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

        jsClientScript.registerMsg(MsgID.registerAck, (msg) => {
            this.onRegisterAck(msg)
        })
        jsClientScript.registerMsg(MsgID.loginAck, (msg) => {
            this.onLoginAck(msg)
        })

        this.btRegister.node.on('click', function (e) {

            let nameStr = this.inputName.string
            let pwdStr = this.inputPassword.string
            if (nameStr.trim() == '' || pwdStr.trim() == '') {
                this.errorTip.string = '不能为空'
                return
            }
            var msg = {}
            msg.msg_id = MsgID.REGISTER
            msg.name = nameStr
            msg.password = pwdStr
            jsClientScript.send(JSON.stringify(msg))
        }, this);
        this.btLogin.node.on('click', function (e) {
            let nameStr = this.inputName.string
            let pwdStr = this.inputPassword.string
            if (nameStr.trim() == '' || pwdStr.trim() == '') {
                this.errorTip.string = '不能为空'
                return
            }
            var msg = {}
            msg.msg_id = MsgID.LOGIN
            msg.name = nameStr
            msg.password = pwdStr
            jsClientScript.send(JSON.stringify(msg))
        }, this);

        //常驻节点
        //cc.game.addPersistRootNode(this.node);
    },

    // update (dt) {},

    onRegisterAck: function (msg) {
        if (msg.error == null) {
            console.log('注册成功')
            this.errorTip.string = '注册成功'

            //发请求 登录
            let nameStr = this.inputName.string
            let pwdStr = this.inputPassword.string
            var msg = {}
            msg.msg_id = MsgID.LOGIN
            msg.name = nameStr
            msg.password = pwdStr
            jsClientScript.send(JSON.stringify(msg))
        }
        else {
            console.error('error:' + msg.error)
            this.errorTip.string = msg.error.code
        }
    },

    onLoginAck: function (msg) {
        let result = msg.results[0]
        this.errorTip.string = msg.tip
        if (msg.tip == 'login ok') {
            this.loadGameScene(result.name, JSON.parse(result.datas), result.coin, result.exp)
        }
        else {
            //login error
        }
    },

    loadGameScene: function (name, params, coin, exp) {
        global.roleName = name
        global.loginData = params
        global.loginData.coin = coin
        global.loginData.exp = exp
        console.log('loginData:', global.loginData)
        this.node.x = -10000
        //dungeon bigmap
        cc.director.loadScene("bigmap", () => {

        })
    },
});
