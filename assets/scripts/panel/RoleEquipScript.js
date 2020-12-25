var global = require('global')
var itemConfig = require('itemConfig')
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

        //道具
        equip_item_prefab: {
            type: cc.Prefab,
            default: null,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.allItems = {}
        this.allItemsNodes = {}
    },

    start() {

        let closeBt = global.getChildByName(this.node, "closeBt")
        closeBt.on(cc.Node.EventType.TOUCH_START, this.closeRoleEquip, this)

        let head = global.getChildByName(this.node, "head")
        let l_hand = global.getChildByName(this.node, "l_hand")
        let r_hand = global.getChildByName(this.node, "r_hand")
        let cloth = global.getChildByName(this.node, "cloth")
        let shoes = global.getChildByName(this.node, "shoes")
        let weapon = global.getChildByName(this.node, "weapon")
        let shield = global.getChildByName(this.node, "shield")
    },

    // update (dt) {},

    openRoleEquip: function () {
        console.log('openRoleEquip', this.initial)
        if (this.initial == null) {
            rpc._call('getAllEquipItems_s', [global.roleName])
            this.initial = true
        }
        this.node.x = 0
        this.node.zIndex = global.getBigZIndex()
    },

    closeRoleEquip: function (t) {
        this.node.x = -2000
        this.node.zIndex = 0
    },

    wearEquipItemFromBag: function (part, bagItem) {
        console.log('wearEquipItemFromBag rolequip')

        //如果已存在那麽先卸下
        if (this.allItems[part] != null) {
            this.takeoffEquipItemToBag(part)
        }

        //穿上新的
        this._addItemToPart(part, bagItem)

        //从背包移除
        let bagScript = cc.find("Canvas/UI/bag").getComponent('bagScript')
        bagScript._discardItemByUUid(bagItem.uuid)
        bagScript._refreshShow()

        return 1
    },

    _addItemToPart: function (part, bagItem) {
        console.log(part, bagItem)
        var itemPreb = cc.instantiate(this.equip_item_prefab)
        this.node.addChild(itemPreb)

        //设定位置
        let partNode = global.getChildByName(this.node, part)
        itemPreb.setPosition(partNode.x, partNode.y)

        //点击事件
        itemPreb.on(cc.Node.EventType.TOUCH_START, () => {
            let itemInfoDialog = cc.find("Canvas/UI/itemInfoDialog").getComponent('itemInfoDialog')
            itemInfoDialog.openItemInfo(this.allItems[part], false, true, false, false, false)
        }, this)

        //图片
        let itemName = bagItem.name
        var url = ''
        if (itemName == '' || itemName == null) {
            url = 'inventory_null_item'
        }
        else {
            let cfg = itemConfig[itemName]
            console.log(itemName, cfg)
            url = 'grid_item_icons/' + cfg['imgSrc']
        }
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            //console.log('new item img:'+url)
            var sp = global.getChildByName(itemPreb, "icon").getComponent(cc.Sprite)
            sp.spriteFrame = spriteFrame
        })

        this.allItems[part] = itemConfig.copyItemEntity(bagItem)
        this.allItemsNodes[part] = itemPreb

        //添加item属性
        global.role_.addItemAttr(bagItem)
    },

    takeoffEquipItemToBag: function (part) {
        let equipItem = this.allItems[part]
        if (equipItem == null) {
            //不存在
            return 0
        }
        console.log('takeoffEquipItemToBag', part, equipItem)
        //背包创建一个
        // let bagScript = cc.find("Canvas/UI/bag").getComponent('bagScript')
        // bagScript.addItem(itemConfig.copyItemEntity(equipItem))
        // bagScript._refreshShow()

        //身上把它移除
        let equipItemNode = this.allItemsNodes[part]
        equipItemNode.destroy()
        this.allItems[part] = null
        this.allItemsNodes[part] = null

        //删除item属性
        global.role_.removeItemAttr(equipItem)
        return 1
    },

    getEquipAttr: function (attr_name) {

    },

    getItemByUUid: function (uuid) {
        for (var part in this.allItems) {
            let item = this.allItems[part]
            if (item != null && item.uuid == uuid)
                return item
        }
        return null
    },


    getAllEquipItems: function () {
        let ret = []

        for (var part in this.allItems) {
            //part, this.allItems[part]
            ret.push({ part, item: this.allItems[part] })
        }
        return ret
    },

});
