// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
        
        ui_root_prefab: {
            type: cc.Prefab,
            default: null,
        },

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        //ui
        var prefab = cc.instantiate(this.ui_root_prefab)
        //cc.find("Canvas").addChild(prefab)
        this.node.addChild(prefab)
    },

    // update (dt) {},
});
