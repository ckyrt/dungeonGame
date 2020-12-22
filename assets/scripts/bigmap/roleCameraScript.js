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

    // onLoad () {},

    start () {
    },

    update (dt) {
        let ownRole = cc.find("Canvas/mapNode").getComponent('bigmapScript')._get_role(global.roleName)
        if(ownRole == null)
            return
        this.node.x = ownRole.node.x
        this.node.y = ownRole.node.y

        //console.log('role x y: '+ownRole.node.x+', '+ownRole.node.y)
    },
});
