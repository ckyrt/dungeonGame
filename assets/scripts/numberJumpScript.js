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
        //this.isPlay = false
    },

    update (dt) {
        // if(!this.isPlay)
        //     return
        if(this.node.y - this.startY < 20)
        {
            this.node.y +=2
            //this.node.scale += 0.05
        }
    },

    playJump(txt, color)
    {
        this.node.color = color//new cc.color(255,0,0)
        this.node.getComponent(cc.Label).string = txt
        this.startY = this.node.y

        var interval = 1
        // 重复次数
        var repeat = 1
        this.schedule(function() {
            this.node.destroy()
        }, interval, repeat, 0)
        this.isPlay = true
    },
});
