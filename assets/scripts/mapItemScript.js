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

    initMapItem: function (entity) {

        let itemName = entity.name
        this.entity = entity
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

    //rpg新用
    _update1000: function () {
        //到达检测 拾取掉落物
        let pickJs = cc.find("Canvas/UI/others/pickIcon").getComponent('pickScript')
        let bigmap = cc.find("Canvas/mapNode").getComponent('bigmapScript')
        let ownRole = bigmap._get_role(global.roleName)
        if (ownRole && ownRole.getNextPoint() == null) {
            //说明停下来了 检测
            let itemPos = this.getPos2()
            if (itemPos.x == ownRole.x && ownRole.y == itemPos.y) {
                //此掉落物在主角脚下
                pickJs.showPickIconf(this.item_uuid)
            }
        }
    },

    //rpg新用
    initMapItem2: function (name, uid) {
        let cfg = itemConfig[name]
        var url = 'grid_item_icons/' + cfg['imgSrc']
        let self = this
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            self.item_node.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })
        this.item_uuid = uid
    },

    //rpg新用
    setPos2: function (x, y) {
        this.x2 = x
        this.y2 = y
        let realPos = global.getRealMapPos(x, y)
        this.node.setPosition(realPos.x, realPos.y)
    },
    //rpg新用
    getPos2: function () {
        return { x: this.x2, y: this.y2 }
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

    deleteFromMap: function () {
        this.node.destroy()
        let backScript = cc.find("Canvas/back").getComponent('backScript')
        backScript.setMapThingInXY(this.x, this.y, null)
    }
});
