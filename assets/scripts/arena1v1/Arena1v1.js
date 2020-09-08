var roleConfig = require('roleConfig')
var global = require('global')
var jsClientScript = require('jsClientScript')
var MsgID = require('MsgID')

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        jsClientScript.registerMsg(MsgID.RoomUserCmdNtf, (msg) => {
            this.onUserCmdNtf(msg)
        })

        jsClientScript.registerMsg(MsgID.GetRoleDataNtf, (msg) => {
            this.onGetRoleDataNtf(msg)
        })

        this.roles = {}
    },

    // update (dt) {},

    init: function (roomInfo) {
        //roomInfo = {id: 0, name: "test", user1: "swy2", user2: "swy1", status: "ongoing"}
        this.roomInfo = roomInfo
        let backScript = cc.find("Canvas/back").getComponent('backScript')
        backScript.jumpToDungeon('1v1竞技场')

        //进入竞技场
        console.log('roominfo', this.roomInfo)

        //拉取玩家数据
        {
            var msg = {}
            msg.msg_id = MsgID.GetRoleDataReq
            msg.name = this.roomInfo.user1
            jsClientScript.send(JSON.stringify(msg))
        }
        {
            var msg = {}
            msg.msg_id = MsgID.GetRoleDataReq
            msg.name = this.roomInfo.user2
            jsClientScript.send(JSON.stringify(msg))
        }
    },

    sendUserCmd: function (cmd, cmdValue) {
        console.log('cmdValue', cmdValue)
        //给服务器发送指令
        var msg = {}
        msg.msg_id = MsgID.RoomUserCmdReq
        msg.room_id = this.roomInfo.id
        msg.userName = global.roleName
        msg.cmd = cmd
        msg.cmdValue = cmdValue
        jsClientScript.send(JSON.stringify(msg))
    },

    onUserCmdNtf: function (msg) {
        //收到服务器的指令
        console.log('onUserCmdNtf:', msg)

        //执行操作
    },

    onGetRoleDataNtf: function (msg) {
        //双方数据
        let name = msg.role_name
        let cfg = JSON.parse(msg.datas)
        this.roles[name] = cfg
        let backScript = cc.find("Canvas/back").getComponent('backScript')

        if (name == global.roleName) {
            //自己的数据
            backScript._initRole(cfg)
        }
        else {
            console.log(cfg.job, roleConfig[cfg.job])

            let enemy = {
                name: name,
                attack: cfg.min_attack,
                defend: cfg.defend,
                hp: cfg.hp,
                imgSrc: roleConfig[cfg.job].imgSrc,
            }

            //玩家构造成怪物
            let fakeMonster = backScript.addMonsterToMap('食人魔', 0, 3)
            fakeMonster.setConfig(enemy)
        }

        //阴影全部打开
    },

});
