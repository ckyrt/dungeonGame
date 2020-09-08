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


        let startBt = global.getChildByName(this.node, "start")
        startBt.on(cc.Node.EventType.TOUCH_START,
            () => {
                var msg = {}
                msg.msg_id = MsgID.StartRoomReq
                msg.userName = global.roleName
                jsClientScript.send(JSON.stringify(msg))
            },
            this)

        let joinOrExit = global.getChildByName(this.node, "joinOrExit")
        joinOrExit.on(cc.Node.EventType.TOUCH_START,
            () => {
                var msg = {}
                var labelNode = global.getChildByName(joinOrExit, "Label")
                var btStr = labelNode.getComponent(cc.Label).string
                msg.msg_id = btStr == '加入' ? MsgID.JoinRoomReq : MsgID.ExitRoomReq

                msg.room_id = this.room_id
                msg.userName = global.roleName
                jsClientScript.send(JSON.stringify(msg))
            },
            this)
    },

    // update (dt) {},

    setContent: function (c) {
        this.room_id = c.id
        let roomName = global.getChildByName(this.node, "roomName")
        let user1 = global.getChildByName(this.node, "user1")
        let user2 = global.getChildByName(this.node, "user2")
        let status = global.getChildByName(this.node, "status")

        let startBt = global.getChildByName(this.node, "start")
        let joinOrExit = global.getChildByName(this.node, "joinOrExit")

        var joinOrExitLabel = global.getChildByName(joinOrExit, "Label")

        roomName.getComponent(cc.Label).string = c.name
        user1.getComponent(cc.Label).string = c.user1 == '' ? 'nobody' : c.user1
        user2.getComponent(cc.Label).string = c.user2 == '' ? 'nobody' : c.user2
        status.getComponent(cc.Label).string = c.status == 'waiting' ? '准备中' : '战斗中'

        let notIn = c.user1 != global.roleName && c.user2 != global.roleName
        let full = c.user1 != '' && c.user2 != ''

        if (c.status == 'ongoing') {
            startBt.active = false
            if(notIn)
            {
                joinOrExit.active = false
            }
            else
            {
                joinOrExit.active = true
                joinOrExitLabel.getComponent(cc.Label).string = '退出'
            }
            
            return
        }

        
        if (notIn) {
            startBt.active = false
            joinOrExit.active = !full
            joinOrExitLabel.getComponent(cc.Label).string = '加入'
        }
        else {
            startBt.active = full
            joinOrExit.active = true
            joinOrExitLabel.getComponent(cc.Label).string = '退出'
        }
    }
});
