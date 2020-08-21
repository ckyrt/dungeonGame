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
        rankDatas: [],
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
        this.node.x = 10000
    },

    onRankDataAck: function (msg) {
        this.rankDatas = []
        for (var i = 0; i < msg.results.length; ++i) {
            let data = msg.results[i]
            data.index = i + 1
            this.rankDatas.push(data)
        }

        //收到数据 显示到第一页
        this._showPageN(1)
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
        let fromIndex = (p - 1) * 10
        let endIndex = p * 10

        if (fromIndex < 0 || fromIndex > this.rankDatas.length)
            return

        let haveData = false
        let y = 0
        for (var i = fromIndex; i < endIndex; ++i) {
            let data = this.rankDatas[i]
            if (data == null)
                continue

            //有数据则清理一次 否则什么也不做
            if (!haveData) {
                this._cleanItemNodes()
                haveData = true
                //设置当前page
                this.curPage = p
                //显示
                global.getChildByName(this.node, "page").getComponent(cc.Label).string = p + '/' + Math.ceil(this.rankDatas.length / 10)
            }

            let prefab = cc.instantiate(this.itemPrefab)
            this.node.addChild(prefab)
            let item = prefab.getComponent('rankItemScript')
            prefab.setPosition(0, 233 - (y++) * 51)
            item.setContent(data)
            this.itemNodes.push(prefab)
        }
    },

});
