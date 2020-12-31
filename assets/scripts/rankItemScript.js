var global = require('global')
var expConfig = require('expConfig')

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

    start () {

    },

    // update (dt) {},

    setContent:function(c)
    {
        let index = global.getChildByName(this.node, "index")
        let name = global.getChildByName(this.node, "name")
        let level = global.getChildByName(this.node, "level")
        let exp = global.getChildByName(this.node, "exp")
        let coin = global.getChildByName(this.node, "coin")

        let l_e = expConfig.getExpAndLevelFromAllExp(c.exp)
        index.getComponent(cc.Label).string = c.index
        name.getComponent(cc.Label).string = c.name
        level.getComponent(cc.Label).string =  l_e.level //c.level 计算得到等级
        exp.getComponent(cc.Label).string = l_e.exp
        coin.getComponent(cc.Label).string = c.coin
    }
});
