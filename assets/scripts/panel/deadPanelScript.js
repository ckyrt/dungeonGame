var global = require('global')
var rpc = require('rpc')

cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let playAgain = global.getChildByName(this.node, "playAgain")
        playAgain.on(cc.Node.EventType.TOUCH_START,
            ()=>{
                this.closeDeadPanel()
                rpc._call('revive_s', [global.roleName])
            },
            this)
    },

    // update (dt) {},

    openDeadPanel:function()
    {
        this.node.x = 0
    },

    closeDeadPanel:function(t)
    {
        this.node.x = -10000
    },
});
