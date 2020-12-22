var global = require('global')

cc.Class({
    extends: cc.Component,

    properties: {

        uid: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        //this.cfg_ = null
        this.node.on(cc.Node.EventType.TOUCH_START, this.clickFunc, this)
    },

    // update (dt) {},

    initBagItem(cfg) {
        this.cfg_ = cfg
        //加载图片
        var url = 'grid_item_icons/' + cfg.imgSrc
        var self = this
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            var sp = global.getChildByName(self.node, "icon").getComponent(cc.Sprite)
            sp.spriteFrame = spriteFrame//更改图片

            console.log('bagItem init load res')
        })

        this.node.on("chooseItemSig", function (event) {
            let data = event.getUserData()
            let cfg = data.cfg

            var edge = global.getChildByName(this.node, "choose_edge")
            if (cfg.name == this.cfg_.name) {
                //自己被选中
                edge.opacity = 255
            }
            else {
                edge.opacity = 0
            }
        }, this)
    },

    clickFunc: function (t) {
        if(this.cfg_ == null)
            return
        let shop = cc.find("Canvas/UI/shop")
        shop.getComponent('shopPanelScript').setChooseItem(this.cfg_)
    },
});
