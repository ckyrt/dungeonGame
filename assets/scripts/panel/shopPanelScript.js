var global = require('global')
var itemConfig = require('itemConfig')

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
        bag_item_prefab: {
            type: cc.Prefab,
            default: null,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        let closeBtn = global.getChildByName(this.node, "closeBtn")
        closeBtn.on(cc.Node.EventType.TOUCH_START, this.closeShopPanel, this)
    },

    // update (dt) {},

    openShopPanel: function (itemNames) {
        let j = 0
        for (var n of itemNames) {
            
            let config = itemConfig[n]
            console.log('openShopPanel ' + n, config, itemConfig)
            var prefab = cc.instantiate(this.bag_item_prefab)
            this.node.addChild(prefab)
            prefab.setPosition(-250 + (j % 7) * 83, 80 - (Math.floor(j / 7)) * 83)

            var item = prefab.getComponent("bagItemScript")
            item.initBagItem(config)

            j++
        }
        this.node.x = 0
    },

    closeShopPanel: function () {
        this.node.x = 800
    },

    buyShopItemToBag: function (item) {
        //扣除金钱 添加道具到背包
        let cost = item.getAttr('coin')

        let ret = this.gs_.addBagCoin(-cost)
        if (ret == 'success')
            this.gs_.addBagItem(item.allAttrs)
    },

    setChooseItem: function(cfg)
    {
        let chooseName = global.getChildByName(this.node, "chooseName")
        closeBtn.on(cc.Node.EventType.TOUCH_START, this.closeShopPanel, this)

        let closeBtn = global.getChildByName(this.node, "closeBtn")
        closeBtn.on(cc.Node.EventType.TOUCH_START, this.closeShopPanel, this)
    },
});
