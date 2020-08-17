
var npcConfig = require('npcConfig')
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
        this.name_node = global.getChildByName(this.node, 'name')

        this.allAttrs = {}
    },

    start() {
    },

    initConfig: function (name) {
        let cfg = npcConfig[name]

        this.name_node.getComponent(cc.Label).string = name

        let url = 'npc/' + cfg.imgSrc
        let self = this
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            global.getChildByName(self.node, 'head').getComponent(cc.Sprite).spriteFrame = spriteFrame
        })

        this.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {

                let cfg = npcConfig[name]

                let shop = cc.find("Canvas/shop")
                shop.getComponent('shopPanelScript').openShopPanel(cfg.items, name, cfg.words, url)
            }, this)

    },

    setPos: function (x, y) {
        this.x = x
        this.y = y
        this.node.setPosition(100 * x, 100 * y)

        let backScript = cc.find("Canvas/back").getComponent('backScript')
        backScript.setMapThingInXY(x, y, this.node)
    },

});
