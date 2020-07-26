var itemConfig = require('itemConfig')
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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.hole1 = global.getChildByName(this.node, 'hole1')
        this.hole2 = global.getChildByName(this.node, 'hole2')
        this.hole3 = global.getChildByName(this.node, 'hole3')
        this.items = {}
        this._addItemToPos('', 1)
        this._addItemToPos('', 2)
        this._addItemToPos('', 3)
        this._refreshShow()

        this.hole1.on(cc.Node.EventType.TOUCH_START, function () {
            this._useItemByPos(1)
        }, this)
        this.hole2.on(cc.Node.EventType.TOUCH_START, function () {
            this._useItemByPos(2)
        }, this)
        this.hole3.on(cc.Node.EventType.TOUCH_START, function () {
            this._useItemByPos(3)
        }, this)
    },

    start() {

    },

    // update (dt) {},

    //返回值为丢弃的道具名字
    addItem: function (itemName) {
        //this._printCurItems()

        //添加到道具栏空闲格子
        var added = false
        let discardItemName = ''
        for (var i = 1; i <= 3; ++i) {
            if (this._getItemFromPos(i) == '') {
                //放进去
                this._addItemToPos(itemName, i)
                added = true
                break
            }
        }
        if (!added) {
            //没有格子 扔掉第三个 第二个放到第三个 第一个放到第二个 新的放到第一个
            discardItemName = this._discardItemByPos(3)
            this._addItemToPos(this._discardItemByPos(2), 3)
            this._addItemToPos(this._discardItemByPos(1), 2)
            this._addItemToPos(itemName, 1)
        }

        this._refreshShow()
        //this._printCurItems()

        console.log('discardItemName ' + discardItemName)
        return discardItemName
    },

    _addItemToPos: function (name, pos) {
        this.items[pos] = name

        //添加item属性
        let backScript = cc.find("Canvas/back").getComponent('backScript')
        if (backScript.role_)
            backScript.role_.addItemAttr(name)
    },

    _discardItemByPos: function (pos) {
        let oldName = this.items[pos]
        this.items[pos] = ''

        //删除item属性
        let backScript = cc.find("Canvas/back").getComponent('backScript')
        if (backScript.role_)
            backScript.role_.removeItemAttr(oldName)

        return oldName
    },

    _getItemFromPos: function (pos) {
        return this.items[pos]
    },

    _refreshShow: function () {
        this._showItemInInventory(this.hole1, this._getItemFromPos(1))
        this._showItemInInventory(this.hole2, this._getItemFromPos(2))
        this._showItemInInventory(this.hole3, this._getItemFromPos(3))
    },

    _showItemInInventory: function (posNode, itemName) {
        var url = ''
        if (itemName == '') {
            url = 'inventory_null_item'
        }
        else {
            let cfg = itemConfig[itemName]
            url = 'grid_item_icons/' + cfg['imgSrc']
        }
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            //console.log('new item img:'+url)
            posNode.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })
    },

    _printCurItems: function () {
        console.log(this._getItemFromPos(1) + ',' + this._getItemFromPos(2) + ',' + this._getItemFromPos(3))
    },

    _useItemByPos: function (pos) {
        let name = this._getItemFromPos(pos)
        console.log('use item:' + name)
        if (name == '')
            return
        //弹出提示框 展示物品信息
        let itemInfoDialog = cc.find("Canvas/itemInfoDialog").getComponent('itemInfoDialog')
        itemInfoDialog.openPanel({name, pos})
    },
});
