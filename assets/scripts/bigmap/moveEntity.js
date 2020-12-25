var global = require('global')
var jsClientScript = require('jsClientScript')
var MsgID = require('MsgID')
var rpc = require('rpc')

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
        entityType: 0,   //0:role
        x: 0,
        y: 0,
        uid: 0,
        speed: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },

    start() {

        // ----->
        //endPos------->startPos
        //路径点序列
        this.pathPoints = []

        //图片切换时间间隔
        this.spriteChangeTime_ = 0

        // 图片
        // var url = 'move_entity/001-Fighter01'
        // var self = this
        // cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
        //     if (err) {
        //         cc.error(err.message || err);
        //         return;
        //     }
        //     self.resource_sprite = spriteFrame

        //     //图片切换帧序号
        //     self.frameNumber_ = 0

        //     var sp = self.node.getComponent(cc.Sprite);//获取组件
        //     sp.spriteFrame = global._getWalkSprite(global.DIR_D, self);//更改图片

        //     //self.node.width = self.getAttr('spriteWidth')
        //     //self.node.height = self.getAttr('spriteHeight')
        //     console.log('role init load res')
        // })

        let head = global.getChildByName(this.node, 'role_name').getComponent(cc.Label)
        head.string = this.uid

        var anim_node = this.node.getChildByName("anim");
        this.anim_com_ = anim_node.getComponent(cc.Animation);
        this.moving_ = false

        let new_monster_script = this.node.getComponent('newMonsterScript')
        if (new_monster_script)
            new_monster_script._move_entity_init_over()
    },

    update(dt) {

        if (this.dead_)
            return
        if (this.node.getComponent('creature').getAttr('hp') <= 0 && !this.dead_) {
            this.node.getComponent('moveEntity').play_death_anim()
            this.dead_ = true
            return
        }

        let n = this.getNextPoint()
        //global.updateWalAnim(this, dt)

        if (n == null) {
            let p = this.pathPoints.pop()
            if (p == null) {
                //移动变为静止
                if (this.moving_) {
                    this._change_move_anim(false, this.dir_)
                    this.moving_ = false

                    //到达 执行 回调callback
                    if (this.arrive_call_back_) {
                        this.arrive_call_back_()
                    }
                }
                return
            }
            if (this.isPointEqualCurrent(p)) {
                this.setNextPoint(null)
                return
            }
            this.setNextPoint(p)
            n = this.getNextPoint()
            if (this.uid == global.roleName) {
                //通知服务器
                var msg = {}
                msg.msg_id = MsgID.CM_MOVE
                msg.role_id = global.roleName
                msg.map_id = 0
                msg.x = this.x
                msg.y = this.y
                msg.to_x = n.x
                msg.to_y = n.y
                jsClientScript.send(JSON.stringify(msg))
            }

            //移动改变方向
            var dir = global._getDir(n.x, n.y, this)
            if (dir != this.dir_) {
                this.dir_ = dir
                this._change_move_anim(true, dir)
            }
            //静止变为移动
            if (!this.moving_) {
                this._change_move_anim(true, dir)
                this.moving_ = true
            }
            //console.log('move to:', n)
            let realPos = global.getRealMapPos(n.x, n.y)
            var action = cc.moveTo(0.5, realPos);
            this.node.stopAllActions()
            this.node.runAction(action)
            this.node.runAction(cc.sequence(action, cc.callFunc(
                () => {
                    this.set_grid(n)
                    //console.log('arrived', n)
                }
            )))
        }
    },

    getAstarSearch: function () {
        let bigmap = cc.find("Canvas/mapNode")
        return bigmap.getComponent('AstarSearch')
    },

    getNextPoint: function () {
        return this.nextPoint
    },

    setNextPoint: function (p) {
        //console.log('setNextPoint', p)
        this.nextPoint = p
    },

    isPointEqualCurrent: function (n) {
        if (n == null)
            return false
        if (n.x == this.x && n.y == this.y)
            return true
        return false
    },

    _move_to_pos: function (x, y, callback = null) {
        let points = global._findPath(this, x, y)
        if (points == null) {
            console.log('_move_to_pos target can not arrived')
            return
        }
        //等待到达然后接到后面
        if (this.pathPoints.length > 0) {
            points.concat(this.pathPoints)
        }
        this.pathPoints = points
        this.arrive_call_back_ = callback
    },

    set_grid(pos) {

        //console.log('role x y:' + pos)

        if (pos.x == this.x && pos.y == this.y)
            return
        this.x = pos.x
        this.y = pos.y

        this.setNextPoint(null)

        let realPos = global.getRealMapPos(pos.x, pos.y)
        this.node.setPosition(realPos.x, realPos.y)

        //如果当前为遮挡 则改变透明度
        let bIsShadow = this.getAstarSearch().isGridShadow(this.x, this.y)
        this.node.opacity = bIsShadow ? 90 : 999

        if (this.uid == global.roleName) {
            //如果是trap 则触发
            let bigmap = cc.find("Canvas/mapNode").getComponent('bigmapScript')
            let trap = bigmap.getTrap(this.x, this.y)
            bigmap.triggerTrap(trap)

            //更新坐标显示
            let rolePos = cc.find("Canvas/UI/others/rolePos").getComponent(cc.Label)
            rolePos.string = '[' + this.x + ',' + this.y + ']'
        }
    },


    _change_move_anim: function (moving, dir) {
        //播放动画
        if (!moving) {
            //stand
            switch (dir) {
                case global.DIR_L:
                    this.anim_com_.play('left_stand');
                    break;
                case global.DIR_U:
                    this.anim_com_.play('up_stand');
                    break;
                case global.DIR_R:
                    this.anim_com_.play('right_stand');
                    break;
                case global.DIR_D:
                    this.anim_com_.play('down_stand');
                    break;
                default:
            }
        }
        else {
            //run
            //stand
            switch (dir) {
                case global.DIR_L:
                    this.anim_com_.play('left_run');
                    break;
                case global.DIR_U:
                    this.anim_com_.play('up_run');
                    break;
                case global.DIR_R:
                    this.anim_com_.play('right_run');
                    break;
                case global.DIR_D:
                    this.anim_com_.play('down_run');
                    break;
                default:
            }
        }
    },

    play_attack_anim: function () {
        switch (this.dir_) {
            case global.DIR_L:
                this.anim_com_.play('left_attack');
                break;
            case global.DIR_U:
                this.anim_com_.play('up_attack');
                break;
            case global.DIR_R:
                this.anim_com_.play('right_attack');
                break;
            case global.DIR_D:
                this.anim_com_.play('down_attack');
                break;
            default:
        }
    },

    play_death_anim: function () {
        console.log('play_death_anim', this.uid)
        switch (this.dir_) {
            case global.DIR_L:
                this.anim_com_.play('left_death');
                break;
            case global.DIR_U:
                this.anim_com_.play('up_death');
                break;
            case global.DIR_R:
                this.anim_com_.play('right_death');
                break;
            case global.DIR_D:
                this.anim_com_.play('down_death');
                break;
            default:
                this.anim_com_.play('down_death');
        }
    },
});
