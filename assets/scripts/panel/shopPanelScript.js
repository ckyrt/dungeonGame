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

        let buyButton = global.getChildByName(this.node, "buyButton")
        buyButton.on(cc.Node.EventType.TOUCH_START, this.buyShopItem, this)

        this.itemAllNodes = []
    },

    // update (dt) {},

    _init: function (itemNames) {
        //清除商品节点
        for (let j = 0, len = this.itemAllNodes.length; j < len; j++) {
            this.itemAllNodes[j].destroy()
        }
        this.itemAllNodes = []

        //新商品节点
        for (var n of itemNames) {
            this._addSellItem(itemConfig[n])
        }

        //默认选中第一个
        this.setChooseItem(itemConfig[itemNames[0]])
    },

    _addSellItem: function (config) {
        let len = this.itemAllNodes.length
        var prefab = cc.instantiate(this.bag_item_prefab)
        this.node.addChild(prefab)
        prefab.setPosition(-297 + (len % 4) * 83, 156 - (Math.floor(len / 4)) * 83)

        var item = prefab.getComponent("bagItemScript")
        item.initBagItem(config)

        this.itemAllNodes.push(prefab)
    },

    openShopPanel: function (itemNames, npcName, helloWords, headImg) {

        global.getChildByName(this.node, "npcName").getComponent(cc.Label).string = npcName
        global.getChildByName(this.node, "helloWords").getComponent(cc.Label).string = helloWords
        let self = this
        cc.loader.loadRes(headImg, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            global.getChildByName(self.node, 'head').getComponent(cc.Sprite).spriteFrame = spriteFrame
        })

        this._init(itemNames)

        this.node.x = 0
        this.node.zIndex = global.getBigZIndex()
    },

    closeShopPanel: function () {
        this.node.x = 10000
        this.node.zIndex = 0
    },

    buyShopItemToBag: function (item) {
        //扣除金钱 添加道具到背包
        let cost = item.getAttr('coin')

        let ret = this.gs_.addBagCoin(-cost)
        if (ret == 'success')
            this.gs_.addBagItem(item.allAttrs)
    },

    setChooseItem: function (cfg) {
        let chooseName = global.getChildByName(this.node, "chooseName")
        let chooseDesc = global.getChildByName(this.node, "chooseDesc")
        let price = global.getChildByName(this.node, "price")

        chooseName.getComponent(cc.Label).string = cfg.name
        chooseDesc.getComponent(cc.Label).string = cfg.descript
        price.getComponent(cc.Label).string = cfg.price

        this.curCfg_ = cfg

        console.log('释放选中事件', cfg.name)
        let chooseEvent = new cc.Event.EventCustom("chooseItemSig", true)
        chooseEvent.setUserData({ cfg })
        for (var n of this.itemAllNodes) {
            n.dispatchEvent(chooseEvent)
        }

    },

    buyShopItem: function () {
        if (this.curCfg_) {

            let backScript = cc.find("Canvas/back").getComponent('backScript')
            let hasCoin = global.role_.getAttr('coin')

            let bagScript = cc.find("Canvas/UI/bag").getComponent('bagScript')
            if (hasCoin < this.curCfg_.price) {
                cc.find("Canvas/UI").getComponent('UIRootScript')._addTextInfo('金币不够')
                return
            }
            if (bagScript.isFull()) {
                cc.find("Canvas/UI").getComponent('UIRootScript')._addTextInfo('背包已满')
                return
            }
            //enouth money and inventory is not full
            global.role_.setAttr('coin', hasCoin - this.curCfg_.price)
            bagScript.addItem(itemConfig.createItemEntity(this.curCfg_.name))

            cc.find("Canvas/UI").getComponent('UIRootScript')._addTextInfo('扣除 ' + this.curCfg_.price + '金币')
            cc.find("Canvas/UI").getComponent('UIRootScript')._addTextInfo('获得 ' + this.curCfg_.name)
        }
    },
});
