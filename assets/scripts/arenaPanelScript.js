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
        roomDatas: [],
        itemNodes: [],
        itemPrefab: {
            type: cc.Prefab,
            default: null,
        },
        curPage: 1,
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

        let create = global.getChildByName(this.node, "create")
        create.on(cc.Node.EventType.TOUCH_START,
            () => {
                let dialog = cc.find("Canvas/roomNameDialog").getComponent('roomNameDialog')
                dialog.openPanel((roomName) => {
                    var msg = {}
                    msg.msg_id = MsgID.CreateRoomReq
                    msg.roomName = roomName
                    msg.userName = global.roleName
                    jsClientScript.send(JSON.stringify(msg))
                })
            },
            this)

        let prev = global.getChildByName(this.node, "prev")
        prev.on(cc.Node.EventType.TOUCH_START,
            () => {
                this._gotoPrevPage()
            },
            this)
        let next = global.getChildByName(this.node, "next")
        next.on(cc.Node.EventType.TOUCH_START,
            () => {
                this._gotoNextPage()
            },
            this)

        jsClientScript.registerMsg(MsgID.AllRoomInfoNtf, (msg) => {
            this.onAllRoomInfoNtf(msg)
        })
        jsClientScript.registerMsg(MsgID.RoomInfoNtf, (msg) => {
            this.onRoomInfoNtf(msg)
        })
    },

    // update (dt) {},

    openPanel() {

        this.node.x = 0

        var msg = {}
        msg.msg_id = MsgID.AllRoomInfoReq
        jsClientScript.send(JSON.stringify(msg))
    },

    closePanel() {
        this.node.x = 10000
    },

    onAllRoomInfoNtf: function (msg) {
        this.roomDatas = []
        for (var i = 0; i < msg.infos.length; ++i) {
            let data = msg.infos[i]
            data.index = i + 1
            this.roomDatas.push(data)
        }

        this._cleanItemNodes()

        //收到数据 显示到第一页
        this._showPageN(1)
    },
    onRoomInfoNtf: function (msg) {
        /*
        msg.roomInfo = {name:xx,user1:xx,user2:xx,status:xx,}
        */
        for (var i = 0; i < this.roomDatas.length; ++i) {
            let data = this.roomDatas[i]
            if (data.id == msg.roomInfo.id) {
                data = msg.roomInfo
            }
        }

        for (var i = 0; i < this.itemNodes.length; ++i) {
            let n = this.itemNodes[i]
            let item = n.getComponent('arenaItemScript')
            if (item.room_id == msg.roomInfo.id) {

                item.setContent(msg.roomInfo)

                //如果自己在这个里面，而且状态是ongoing，那么就进入战斗吧
                if (global.roleName == msg.roomInfo.user1 || global.roleName == msg.roomInfo.user2) {
                    if (msg.roomInfo.status == 'ongoing') {

                        let arena1v1 = cc.find("Canvas/arena").getComponent('Arena1v1')
                        arena1v1.init(msg.roomInfo)
                        this.closePanel()
                    }
                }

                break
            }
        }
    },

    _gotoNextPage: function () {
        this._showPageN(this.curPage + 1)
    },

    _gotoPrevPage: function () {
        this._showPageN(this.curPage - 1)
    },


    _cleanItemNodes: function () {
        //clean itemNodes
        for (var i = 0; i < this.itemNodes.length; ++i) {
            let n = this.itemNodes[i]
            if (n != null) {
                n.destroy()
            }
        }
        this.itemNodes = []
    },

    _showPageN: function (p) {

        console.log('showpagae:' + p)
        let fromIndex = (p - 1) * 6
        let endIndex = p * 6

        if (fromIndex < 0 || fromIndex > this.roomDatas.length)
            return

        let haveData = false
        let y = 0
        for (var i = fromIndex; i < endIndex; ++i) {
            let data = this.roomDatas[i]
            if (data == null)
                continue

            //有数据则清理一次 否则什么也不做
            if (!haveData) {
                this._cleanItemNodes()
                haveData = true
                //设置当前page
                this.curPage = p
                //显示
                global.getChildByName(this.node, "page").getComponent(cc.Label).string = p + '/' + Math.ceil(this.roomDatas.length / 5)
            }

            let prefab = cc.instantiate(this.itemPrefab)
            this.node.addChild(prefab)
            let item = prefab.getComponent('arenaItemScript')
            prefab.setPosition(0, 233 - (y++) * 101)
            item.setContent(data)
            this.itemNodes.push(prefab)
        }
    },

});
