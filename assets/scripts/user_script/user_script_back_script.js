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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, function (t) {
            console.log("触摸开始");
        }, this)
        //监听
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.on_touch_move, this);
        //触摸抬起
        this.node.on(cc.Node.EventType.TOUCH_ENDED, function (t) {
            console.log("触摸内结束");
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (t) {
            console.log("触摸外开始");
        }, this);
    },

    on_touch_move(t) {
        //定义一个n_pos变量存储当前触摸点的位置
        var n_pos = t.getLocation();
        //console.log(n_pos, n_pos.x, n_pos.y);

        var delta = t.getDelta();

        this.node.x += delta.x;
        this.node.y += delta.y;

    },

    // update (dt) {},
});
