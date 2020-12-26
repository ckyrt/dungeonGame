var global = require('global')

var State_Patrol = 0        //巡逻
var State_Enemy_Found = 1   //找到敌人
var State_Attack = 2        //战斗
var State_Dead = 3          //死亡
var State_BackBornPos = 4   //返回出生点

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

    // _move_entity_init_over: function () {

    //     this.move_entity_ = this.node.getComponent('moveEntity')  //moveEntity
    //     this.cur_state_ = State_Patrol
    //     this.born_pos_ = { x: this.move_entity_.x, y: this.move_entity_.y }
    //     this.act_radius_ = 10
    //     this.eye_distance_ = 5
    //     this.attack_distance_ = 1

    //     this.aggressive_ = true
    // },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        // this.enemy_uid_ = 0
        // this.bigmap_script_ = cc.find("Canvas/mapNode").getComponent('bigmapScript')

        // cc.find("Canvas/UI").getComponent('UIRootScript').setInterval(1, 300000,
        //     () => {
        //         this._update1000()
        //     })
    },

    // _check_enemy_valid: function () {
    //     let enemy = this.enemy_uid_ ? this.bigmap_script_._get_entity_by_uid(this.enemy_uid_) : null
    //     let valid = enemy && this._is_enemy_alive(enemy)
    //     return valid ? enemy : null
    // },

    // _is_enemy_alive: function (creature) {
    //     return creature ? creature.getComponent('creature').getAttr('hp') > 0 : false
    // },

    // _update1000: function () {

    //     if (this.node.getComponent('creature').getAttr('hp') <= 0 && this.cur_state_ != State_Dead) {
    //         this._change_state(State_Dead)
    //     }

    //     let enemy = this._check_enemy_valid()
    //     if (!enemy && this.cur_state_ != State_Patrol && this.cur_state_ != State_Dead) {
    //         this._change_state(State_Patrol)
    //     }

    //     if (this._check_out_activity_radius() && this.cur_state_ != State_Dead) {
    //         this._change_state(State_BackBornPos)
    //     }

    //     console.log('_update1000', 'state:' + this.cur_state_)

    //     if (this.cur_state_ == State_Patrol) {
    //         //巡逻
    //         if (enemy) {
    //             this._change_state(State_Enemy_Found)
    //         }
    //         else {
    //             this._search_enemy()
    //             enemy = this._check_enemy_valid()
    //             if (!enemy) {
    //                 //还没有 那就游荡
    //                 console.log('_hang_out', this.is_hangout_)
    //                 if (!this.is_hangout_) {
    //                     this._hang_out()
    //                     this.is_hangout_ = true
    //                 }
    //             }
    //         }
    //     }
    //     else if (this.cur_state_ == State_Enemy_Found) {

    //         let dist = this.bigmap_script_._distance(this.move_entity_.x, this.move_entity_.y, enemy.x, enemy.y)
    //         console.log('dist: ' + dist)
    //         if (dist <= this.attack_distance_) {
    //             this._change_state(State_Attack)
    //         }
    //         else {
    //             //寻路过去
    //             this.is_moving_toward_enemy_ = true
    //             this.move_entity_._move_to_pos(enemy.x, enemy.y, () => {
    //                 this.is_moving_toward_enemy_ = false
    //                 this._change_state(State_Attack)
    //             })
    //         }
    //     }
    //     else if (this.cur_state_ == State_Attack) {
    //         if (this.bigmap_script_._distance(this.move_entity_.x, this.move_entity_.y, enemy.x, enemy.y) <= this.attack_distance_) {
    //             this.node.getComponent('creature').cast_skill()

    //             if (enemy.node.getComponent('creature').getAttr('hp') <= 0) {
    //                 //敌人死了
    //                 this._change_state(State_Patrol)
    //             }
    //         }
    //         else {
    //             //寻路过去
    //             this._change_state(State_Enemy_Found)
    //         }
    //     }
    //     else if (this.cur_state_ == State_Dead) {
    //         cc.find("Canvas/UI").getComponent('UIRootScript').setInterval(3, 1, () => {
    //             //3 秒后 重生
    //             this.node.getComponent('creature').setAttr('hp', 100)
    //             this._change_state(State_Patrol)
    //         })
    //     }
    //     else if (this.cur_state_ == State_BackBornPos) {
    //         this.enemy_uid_ = null
    //         this.aggressive_ = false
    //         this.move_entity_._move_to_pos(this.born_pos_.x, this.born_pos_.y, () => {
    //             this.aggressive_ = true
    //             this._change_state(State_Patrol)
    //         })
    //     }
    // },

    // _change_state: function (s) {
    //     if (s != State_Patrol) {
    //         //切换到其他状态 就不是巡逻了
    //         this.is_hangout_ = false
    //     }
    //     this.cur_state_ = s
    // },

    // // update(dt) {
    // // },

    // //游荡
    // _hang_out: function () {
    //     let rest_time = parseInt(Math.random() * 4000 + 3000)
    //     cc.find("Canvas/UI").getComponent('UIRootScript').setInterval(rest_time / 1000, 1, () => {
    //         //超过出生半径 就走回去
    //         let pos = null
    //         if (this._check_out_activity_radius()) {
    //             pos = this.born_pos_
    //         }
    //         else {
    //             pos = this._get_random_target_pos()
    //         }
    //         this.move_entity_._move_to_pos(pos.x, pos.y, () => {
    //             this._hang_out()
    //         })
    //     })
    // },

    // _check_out_activity_radius: function () {
    //     return this.bigmap_script_._distance(this.move_entity_.x, this.move_entity_.y, this.born_pos_.x, this.born_pos_.y) > this.act_radius_
    // },

    // _get_random_target_pos: function () {

    //     let rets = []
    //     for (var i = -3; i <= 3; ++i) {
    //         for (var j = -3; j <= 3; ++j) {
    //             if (i == 0 && j == 0)
    //                 continue
    //             let x = this.move_entity_.x + j
    //             let y = this.move_entity_.y + i
    //             if (this.move_entity_.getAstarSearch()._canNotPass(x, y))
    //                 continue
    //             rets.push({ x, y })
    //         }
    //     }

    //     let len = rets.length
    //     let index = parseInt(Math.random() * len)
    //     let target_pos = rets[index]

    //     //出生距离确定后 所有可行走格子
    //     // if (!this.can_walk_poses_) {
    //     //     this.can_walk_poses_ = this.move_entity_.getAstarSearch().getPosesInRadius(
    //     //         this.born_pos_.x,
    //     //         this.born_pos_.y,
    //     //         this.act_radius_)
    //     // }


    //     // let len = this.can_walk_poses_.length
    //     // let index = parseInt(Math.random() * len)
    //     // let target_pos = this.can_walk_poses_[index]
    //     return target_pos
    // },

    // _search_enemy: function () {
    //     if (!this.aggressive_) {
    //         //被动怪
    //         return
    //     }
    //     let enemies = this.bigmap_script_._get_pos_radius_entities(
    //         this.move_entity_.x,
    //         this.move_entity_.y,
    //         this.eye_distance_,
    //         (ent) => {
    //             let creature = ent.node.getComponent('creature')
    //             return creature.getAttr('camp') == 1 && creature.getAttr('hp') > 0
    //         }
    //     )
    //     console.log('_search_enemy', enemies)
    //     if (enemies.length > 0) {
    //         this.enemy_uid_ = enemies[0]
    //     }
    //     else {
    //         this.enemy_uid_ = null
    //     }
    // },
});
