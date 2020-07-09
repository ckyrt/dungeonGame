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
        this.item_node = global.getChildByName(this.node, 'item')
    },

    start() {

    },

    // update (dt) {},

    initConfig: function (itemName) {

        this.itemName = itemName
        let cfg = itemConfig[itemName]

        var url = 'grid_item_icons/' + cfg['imgSrc']
        let self = this
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            self.item_node.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })
    },

    setPos: function (x, y) {
        this.x = x
        this.y = y
        this.node.setPosition(100 * x, 100 * y)

        let backScript = cc.find("Canvas/back").getComponent('backScript')
        backScript.setMapThingInXY(x, y, this.node)
    },

    getPos: function () {
        return { x: this.x, y: this.y }
    },

    deleteFromMap:function()
    {
        this.node.destroy()
        let backScript = cc.find("Canvas/back").getComponent('backScript')
        backScript.setMapThingInXY(this.x, this.y, null)
    }
});
