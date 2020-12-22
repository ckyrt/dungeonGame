var itemConfig = require('itemConfig')
var global = require('global')
var rpc = require('rpc')

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
        this.bag_size_ = 35
        this.items = {}

        for (var i = 1; i <= this.bag_size_; ++i) {
            this._addItemToPos({}, i)
        }

        this._refreshShow()

        let closeBt = global.getChildByName(this.node, "closeBt")
        closeBt.on(cc.Node.EventType.TOUCH_START, this.closeBag, this)

        for (var i = 1; i <= this.bag_size_; ++i) {
            let _ = this._getGridFromPos(i)
            let pos = i
            _.on(cc.Node.EventType.TOUCH_START, () => {
                this._clickItemByPos(pos)
            }, this)
        }
    },

    start() {
    },

    // update (dt) {},

    openBag: function () {
        console.log('openBag', this.initial)
        if (this.initial == null) {
            rpc._call('getAllBagItems_s', [global.roleName])
            this.initial = true
        }
        this.node.x = 0
        this.node.zIndex = global.getBigZIndex()
    },

    closeBag: function () {
        this.node.x = 10000
        this.node.zIndex = 0
    },

    addItem: function (entity) {
        this._printCurItems()

        //添加到道具栏空闲格子
        console.log('addItem', entity)
        let itemName = entity.name
        let cfg = itemConfig[itemName]
        //如果可堆叠 那么找到然后数目加1
        var added = false
        for (var i = 1; i <= this.bag_size_; ++i) {
            let curItem = this._getItemFromPos(i)
            if (curItem.name == null) {
                //放进去
                this._addItemToPos(entity, i)
                added = true
                console.log('added', entity)
                break
            }
            if (cfg.stackable && curItem.name != null && curItem.name == itemName) {
                //可堆叠
                curItem.count += 1
                break
            }
        }

        console.log('addItem xx', entity)
        this._refreshShow()
    },

    //是否有空闲格子
    isFull: function () {
        var full = true
        for (var i = 1; i <= this.bag_size_; ++i) {
            if (this._getItemFromPos(i).name == null) {
                full = false
                break
            }
        }
        return full
    },

    clearAll: function () {
        for (var i = 1; i <= this.bag_size_; ++i) {
            if (this._getItemFromPos(i).name != null) {
                this._discardItemByPos(i)
            }
        }
        this._refreshShow()
    },

    _addItemToPos: function (entity, pos) {
        //拷贝一下
        let newEntity = itemConfig.copyItemEntity(entity)
        this.items[pos] = newEntity
    },

    _discardItemByPos: function (pos) {
        let oldEntity = itemConfig.copyItemEntity(this.items[pos])
        this.items[pos] = {}

        return oldEntity
    },

    _discardItemByUUid: function (uuid) {
        let pos = this._getItemPosByUUid(uuid)
        if (pos > 0)
            return this._discardItemByPos(pos)
        return null
    },

    //扣除指定数目的道具
    _deductItemNumByPos: function (pos, num) {
        let item = this.items[pos]
        if (item.count == num) {
            this._discardItemByPos(pos)
            return true
        }
        if (item.count > num) {
            item.count -= num
            return true
        }
        return false
    },

    //强化
    strengthenItemByUUid: function (uuid) {
        let pos = this._getItemPosByUUid(uuid)
        if (pos < 0)
            return

        let item = this._getItemFromPos(pos)
        let cfg = itemConfig[item.name]
        if (cfg.part == null)
            return
        //强化石是否够
        let stone_pos = this.getPosByItemName('强化石')
        if (stone_pos < 1 || !this._deductItemNumByPos(stone_pos, 1)) {
            let backScript = cc.find("Canvas/back").getComponent('backScript')
            cc.find("Canvas/UI").getComponent('UIRootScript')._addTextInfo('强化石不够')
            return
        }
        //强化
        let old_stren_lv = item.stren_lv
        item.stren_lv = old_stren_lv + 1

        this._refreshShow()
    },

    _deductItemNumByUUid: function (uuid, num) {
        let pos = this._getItemPosByUUid(uuid)
        if (pos > 0)
            return this._deductItemNumByPos(pos, num)
        return false
    },

    _getItemPosByUUid: function (uuid) {
        let pos = -1
        for (var i = 1; i <= this.bag_size_; ++i) {
            if (this._getItemFromPos(i).uuid == uuid) {
                pos = i
                break
            }
        }
        return pos
    },

    _getItemFromPos: function (pos) {
        return this.items[pos]
    },

    _getGridFromPos: function (pos) {
        let gridName = 'hole' + (Math.floor((pos - 1) / 5) + 1) + '_' + (((pos - 1) % 5) + 1)
        //console.log('gridName', gridName)
        return global.getChildByName(this.node, gridName)
    },

    _refreshShow: function () {
        //重新渲染items节点
        for (var i = 1; i <= this.bag_size_; ++i) {
            this._showItemInGrid(i, this._getGridFromPos(i), this._getItemFromPos(i))
        }
    },

    _showItemInGrid: function (i, posNode, entity) {
        let itemName = entity.name
        var url = ''
        if (itemName == '' || itemName == null) {
            url = 'inventory_null_item'
        }
        else {
            let cfg = itemConfig[itemName]
            console.log(i, itemName, cfg, itemName)
            url = 'grid_item_icons/' + cfg['imgSrc']
        }
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            //console.log('new item img:' + url)
            posNode.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })

        //显示cd转圈的遮罩

        //显示数目
        let count_node = global.getChildByName(posNode, 'count')
        count_node.getComponent(cc.Label).string = entity.count > 1 ? entity.count : ''
    },

    _printCurItems: function () {
        console.log(this._getItemFromPos(1) + ',' + this._getItemFromPos(2) + ',' + this._getItemFromPos(3))
    },

    getAllItems: function () {
        let ret = []
        for (var i = 1; i <= this.bag_size_; ++i) {
            ret.push(this._getItemFromPos(i))
        }
        return ret
    },

    //是否存在某名字的道具
    getPosByItemName: function (name) {
        for (var i = 1; i <= this.bag_size_; ++i) {
            let item = this._getItemFromPos(i)
            if (item.name == name) {
                return i
            }
        }

        return -1
    },

    _clickItemByPos: function (pos) {
        let entity = this._getItemFromPos(pos)
        console.log('click item:' + entity, pos)
        if (entity.name == null)
            return
        //弹出提示框 展示物品信息
        let itemInfoDialog = cc.find("Canvas/UI/itemInfoDialog").getComponent('itemInfoDialog')
        itemInfoDialog.openItemInfo(entity, true, false, true, true)
    },

    setCoin: function (v) {
        let coin_node = global.getChildByName(this.node, 'coin')
        coin_node.getComponent(cc.Label).string = v
    }
});
