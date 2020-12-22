
var global = require('global')

cc.Class({
    extends: cc.Component,

    properties: {
    },

    update: function (dt) {
        // var roles = this.gs_.getRolesInRadius(this.x, this.y, this, 2)
        // if(roles.length > 0)
        // {
        //     if(this.oldRole == null)
        //     {
        //         //roles[0] enter
        //         this.onRoleCloseTo(roles[0])
        //         this.oldRole = roles[0]
        //     }
        // }
        // else
        // {
        //     if(this.oldRole != null)
        //     {
        //         //oldRole leave
        //         this.onRoleLeave(this.oldRole)
        //         this.oldRole = null
        //     }
        // }
    },


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                cc.find("Canvas/UI").getComponent('UIRootScript').createNpcTalk('ssssssssssssss', {})
            }, this)
    },

    setData(datas) {

        this.node.getChildByName('npc_name').getComponent(cc.Label).string = datas.name

        //加载图片
        let url = 'npc/' + '021-Hunter02'//datas.img
        var self = this
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            self.resource_sprite = spriteFrame

            //图片切换帧序号
            self.frameNumber_ = 0

            var sp = self.node.getComponent(cc.Sprite);//获取组件
            sp.spriteFrame = global._getWalkSprite(global.DIR_D, self)

            console.log('npc init load res')
        })
    },

    setPos2: function (x, y) {
        this.x2 = x
        this.y2 = y
        let realPos = global.getRealMapPos(x, y)
        this.node.setPosition(realPos.x, realPos.y)
    },
});
