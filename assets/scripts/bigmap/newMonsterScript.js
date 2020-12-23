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

    _move_entity_init_over: function () {

        this.move_entity_ = this.node.getComponent('moveEntity')  //moveEntity
        this.cur_state_ = 0
        this.born_pos_ = { x: this.move_entity_.x, y: this.move_entity_.y }
        this.act_radius_ = 10

        this._hang_out()
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
    },

    update(dt) {

    },

    // 出生点出生

    // 巡逻

    // 搜索发现敌人 攻击

    // 距离敌人距离小于 攻击距离 攻击

    // 血量小于0 死亡

    //游荡
    _hang_out: function () {
        let rest_time = parseInt(Math.random() * 4000 + 3000)
        cc.find("Canvas/UI").getComponent('UIRootScript').setInterval(rest_time / 1000, 1, () => {
            //出生点 半径r 范围 找一个格子，走过去
            let pos = this._get_random_target_pos()
            console.log('_hang_out target', pos.x, pos.y)
            this.move_entity_._move_to_pos(pos.x, pos.y, () => {
                this._hang_out()
            })
        })
    },

    _get_random_target_pos: function () {

        //出生距离确定后 所有可行走格子
        if (!this.can_walk_poses_) {
            this.can_walk_poses_ = this.move_entity_.getAstarSearch().getPosesInRadius(
                this.born_pos_.x,
                this.born_pos_.y,
                this.act_radius_)
        }


        let len = this.can_walk_poses_.length
        let index = parseInt(Math.random() * len)
        let target_pos = this.can_walk_poses_[index]
        return target_pos
    }
});
