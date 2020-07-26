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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.itemPos = 0
        this.itemCfg = null
        let closeButton = global.getChildByName(this.node, "closeButton")
        closeButton.on(cc.Node.EventType.TOUCH_START, () => {
            this.closePanel()
        }, this)
        let sellButton = global.getChildByName(this.node, "sellButton")
        sellButton.on(cc.Node.EventType.TOUCH_START, () => {

            let backScript = cc.find("Canvas/back").getComponent('backScript')
            backScript.role_.addAttr('coin', Math.ceil(this.itemCfg.price / 2))
            this.closePanel()
            this.deleteItemFromInventory(this.itemPos)
        }, this)
    },

    // update (dt) {},

    openPanel: function ({name, pos}) {
        let cfg = itemConfig[name]
        let itemName = global.getChildByName(this.node, "itemName")
        let itemImage = global.getChildByName(this.node, "itemImage")
        let description = global.getChildByName(this.node, "description")
        let price = global.getChildByName(this.node, "price")

        itemName.getComponent(cc.Label).string = cfg.name
        description.getComponent(cc.Label).string = cfg.descript
        price.getComponent(cc.Label).string = cfg.price

        var url = 'grid_item_icons/' + cfg.imgSrc
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            itemImage.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })

        this.node.x = 0
        this.setUseFunc(cfg)
        this.itemPos = pos
    },

    closePanel: function (t) {
        this.node.x = 800

        let useword = global.getChildByName(this.node, "useword")
        useword.off(cc.Node.EventType.TOUCH_START, this.execClickFunc, this)
    },

    setUseFunc: function (cfg) {
        this.itemCfg = cfg

        let str = '关闭'
        if (cfg.use_func != null) {
            str = '使用'
        }
        let useword = global.getChildByName(this.node, "useword")
        useword.getComponent(cc.Label).string = str
        useword.on(cc.Node.EventType.TOUCH_START, this.execClickFunc, this)
    },

    execClickFunc: function () {
        if (this.itemCfg.use_func != null) {
            let backScript = cc.find("Canvas/back").getComponent('backScript')
            this.itemCfg.use_func(backScript.role_)

            //一次性
            if(this.itemCfg.use_type == 'one_time')
                this.deleteItemFromInventory()
        }

        this.closePanel()
    },

    deleteItemFromInventory:function()
    {
        let inventoryScript = cc.find("Canvas/inventory").getComponent('inventoryScript')
        inventoryScript._discardItemByPos(this.itemPos)
        inventoryScript._refreshShow()
    }
});
