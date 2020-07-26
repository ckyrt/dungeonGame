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
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) 　　　　{
            if (err) {
                cc.error(err.message || err);
                return;
            }

            var sp = global.getChildByName(self.node, "icon").getComponent(cc.Sprite);
            sp.spriteFrame = spriteFrame//更改图片

            console.log('bagItem init load res')
        　　　　})
    },

    clickFunc: function (t) {
        console.log('click', this.cfg_)
    },
});
