// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

        pin_1: {
            type: cc.Sprite,
            default: null,
        },
        pin_2: {
            type: cc.Sprite,
            default: null,
        },
        pin_son: {
            type: cc.Sprite,
            default: null,
        },

        in_node_1: {
            type: cc.Sprite,
            default: null,
        },
        in_node_2: {
            type: cc.Sprite,
            default: null,
        },
        out_node: {
            type: cc.Sprite,
            default: null,
        },

        node_name: {
            type: cc.Label,
            default: null,
        },

        watch: {
            type: cc.Label,
            default: null,
        },

        input: {
            type: cc.EditBox,
            default: null,
        },


        ref_bt: {
            type: cc.Sprite,
            default: null,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    get_in_node_by_index: function (index) {
        if (index == 1)
            return this.in_node_1.node
        if (index == 2)
            return this.in_node_2.node
    },

    get_index_by_in_node: function (in_node) {
        if (in_node == this.in_node_1.node)
            return 1
        if (in_node == this.in_node_2.node)
            return 2
    },

    start() {

        //监听
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.on_touch_move, this);
        //触摸抬起
        this.node.on(cc.Node.EventType.TOUCH_ENDED, function (t) {
            //console.log("触摸内结束");
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (t) {
            //console.log("触摸外开始");
        }, this)

        //输入输出 连接
        this.in_node_1.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                if (this.user_script_.tmp_data_start_node != null) {
                    this.user_script_.connectDataNodeUsingLine(this.user_script_.tmp_data_start_node, this.node, 1)
                    this.user_script_.tmp_data_start_node = null
                }
            }, this)

        this.in_node_2.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                if (this.user_script_.tmp_data_start_node != null) {
                    this.user_script_.connectDataNodeUsingLine(this.user_script_.tmp_data_start_node, this.node, 2)
                    this.user_script_.tmp_data_start_node = null
                }
            }, this)
        this.out_node.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this.user_script_.tmp_data_start_node = this.node
            }, this)

        //管脚 连接
        this.pin_1.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                if (this.user_script_.tmp_start_node != null) {
                    this.user_script_.connectNodeUsingLine(this.user_script_.tmp_start_node, this.node, this.user_script_.tmp_start_is_son)
                    this.user_script_.tmp_start_node = null
                }
            }, this)
        this.pin_2.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this.user_script_.tmp_start_node = this.node
                this.user_script_.tmp_start_is_son = false
            }, this)

        this.pin_son.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this.user_script_.tmp_start_node = this.node
                this.user_script_.tmp_start_is_son = true
            }, this)

        this.ref_bt.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                //create ref var
                let var_name = this.node_name.getComponent(cc.Label).string
                this.user_script_._create_2_1_node('var_ref', var_name)
            }, this)

        //增加变量
        if (this.node_name_ == 'var_def') {
            let var_name = this.node_name.getComponent(cc.Label).string
            this.user_script_._add_var_def(var_name)
        }
    },

    onDestroy: function () {
        // //去掉变量
        // if (this.node_name_ == 'var_def') {
        //     let var_name = this.node_name.getComponent(cc.Label).string
        //     this.user_script_._remove_var_def(var_name)
        // }
    },

    on_touch_move(t) {
        //定义一个n_pos变量存储当前触摸点的位置
        var n_pos = t.getLocation();
        //console.log(n_pos, n_pos.x, n_pos.y);

        var delta = t.getDelta();

        this.node.x += delta.x;
        this.node.y += delta.y;

        this.user_script_.on_node_move(this.node)
    },

    // update (dt) {},

    set_node_name: function (nn, var_name) {
        this.node_name_ = nn
        this.node_name.getComponent(cc.Label).string = var_name ? var_name : nn

        this.ref_bt.node.active = false
        if (nn == 'watch') {
            this.watch.node.active = true
            this.input.node.active = false

            this.pin_1.node.active = false
            this.pin_2.node.active = false
            this.pin_son.node.active = false

            this.out_node.node.active = false
            this.in_node_2.node.active = false
            this.node_name.node.active = false
        }
        else if (nn == 'input') {
            this.input.node.active = true
            this.watch.node.active = false

            this.pin_1.node.active = false
            this.pin_2.node.active = false
            this.pin_son.node.active = false

            this.in_node_1.node.active = false
            this.in_node_2.node.active = false
        }
        else if (nn == 'start') {
            this.pin_1.node.active = false
            this.pin_son.node.active = false

            this.watch.node.active = false
            this.input.node.active = false

            this.in_node_1.node.active = false
            this.in_node_2.node.active = false
            this.out_node.node.active = false
        }
        else if (nn == '>' || nn == '<' || nn == '==') {
            this.watch.node.active = false
            this.input.node.active = false
            this.out_node.node.active = false
        }
        else if (nn == '&&' || nn == '||' || nn == '!') {
            this.watch.node.active = false
            this.input.node.active = false
            this.pin_1.node.active = false
            this.pin_2.node.active = false
            this.pin_son.node.active = false
            if (nn == '!') {
                this.in_node_2.node.active = false
            }
        }
        else if (nn == 'var_def' || nn == 'var_ref') {
            this.watch.node.active = false

            if (nn == 'var_def') {
                this.in_node_1.node.active = false
                this.out_node.node.active = false

                this.pin_1.node.active = false
                this.pin_2.node.active = false
                this.ref_bt.node.active = true
            }
            this.pin_son.node.active = false

            this.in_node_2.node.active = false
            this.input.node.active = false
        }
        else if (nn == 'random') {
            this.pin_1.node.active = false
            this.pin_2.node.active = false
            this.pin_son.node.active = false

            this.watch.node.active = false
            this.input.node.active = false

            this.in_node_1.node.active = false
            this.in_node_2.node.active = false
        }
        else if (nn == 'for') {
            this.watch.node.active = false
            this.input.node.active = false

            this.in_node_1.node.active = false
            this.in_node_2.node.active = false
            this.out_node.node.active = false
        }
        else if (nn == 'timer') {
            this.watch.node.active = false
            this.input.node.active = false
            this.out_node.node.active = false
        }
        else {
            this.watch.node.active = false
            this.input.node.active = false
            this.pin_son.node.active = false
        }
    },

    get_node_name: function () {
        return this.node_name_
    },

    set_user_script: function (us) {
        this.user_script_ = us
    },

    set_node_uuid: function (uuid) {
        this.node_uuid_ = uuid
    },
    get_node_uuid: function (uuid) {
        return this.node_uuid_
    },

    _compute: function () {
        let nn = this.get_node_name()

        //////////////////////////////////// check if need look back ////////////////////////////////////
        if (nn == '+' || nn == '-' || nn == '*' || nn == '/' || nn == '>' || nn == '<' || nn == '==' || nn == '&&' || nn == '||'
            || nn == 'timer') {
            //从两个输入节点取值
            if (this.input_v_1 == null) {
                //console.log(nn + ' input_v_1 is null')
                let pre_node = this.user_script_._get_prev_input_node(this.node, this.in_node_1.node)
                if (pre_node) {
                    let pre = pre_node.getComponent('node_2_1_script')
                    if (pre.out_v == null)
                        pre._compute()
                    this.input_v_1 = pre.out_v
                }
            }

            if (this.input_v_2 == null) {
                //console.log(nn + ' input_v_2 is null')
                let pre_node = this.user_script_._get_prev_input_node(this.node, this.in_node_2.node)
                if (pre_node) {
                    let pre = pre_node.getComponent('node_2_1_script')
                    if (pre.out_v == null)
                        pre._compute()
                    this.input_v_2 = pre.out_v
                }
            }
        }

        if (nn == 'watch' || nn == '!' || nn == 'var_ref') {
            if (this.input_v_1 == null) {
                //console.log(nn + ' input_v_1 is null')
                let pre_node = this.user_script_._get_prev_input_node(this.node, this.in_node_1.node)
                if (pre_node) {
                    let pre = pre_node.getComponent('node_2_1_script')
                    if (pre.out_v == null)
                        pre._compute()
                    this.input_v_1 = pre.out_v
                }
            }
        }


        //////////////////////////////////// compute ////////////////////////////////////
        if (nn == '+') {
            this.out_v = (Number(this.input_v_1) || 0) + (Number(this.input_v_2) || 0)

            console.log('+++++ input_v_1:' + this.input_v_1 + 'input_v_2:' + this.input_v_2 + ' ,out_v: ' + this.out_v)
        }
        else if (nn == '-') {
            this.out_v = this.input_v_1 - this.input_v_2
        }
        else if (nn == '*') {
            this.out_v = this.input_v_1 * this.input_v_2
        }
        else if (nn == '/') {
            this.out_v = this.input_v_1 / this.input_v_2
        }
        else if (nn == '>') {
            this.out_v = this.input_v_1 > this.input_v_2
        }
        else if (nn == '<') {
            this.out_v = this.input_v_1 < this.input_v_2
        }
        else if (nn == '==') {
            this.out_v = this.input_v_1 == this.input_v_2
        }
        else if (nn == '&&') {
            this.out_v = this.input_v_1 && this.input_v_2
        }
        else if (nn == '||') {
            this.out_v = this.input_v_1 || this.input_v_2
        }
        else if (nn == '!') {
            this.out_v = !this.input_v_1
        }
        else if (nn == 'watch') {
            this.watch.getComponent(cc.Label).string = this.input_v_1
        }
        else if (nn == 'input') {
            this.out_v = this.input.getComponent(cc.EditBox).string
        }
        else if (nn == 'var_ref') {
            let var_name = this.input.getComponent(cc.EditBox).string
            if (this.input_v_1) {
                this.user_script_._set_var_v(var_name, this.input_v_1)
            }
            this.out_v = this.user_script_._get_var_v(var_name)
            console.log('input_v_1:' + this.input_v_1 + ' ,out_v: ' + this.out_v)
        }
        else if (nn == 'random') {
            this.out_v = Math.random()
        }
    },


    //_serialize_str
    _serialize_str: function () {
        let nn = this.get_node_name()
        let data = { 'name': nn, 'pos': { 'x': parseInt(this.node.position.x), 'y': parseInt(this.node.position.y), 'z': parseInt(this.node.position.z) }, 'uuid': this.get_node_uuid() }

        if (nn == 'input') {
            data.input = this.input.getComponent(cc.EditBox).string
        }
        else if (nn == 'var_ref' || nn == 'var_def') {
            data.var_name = this.node_name.getComponent(cc.Label).string
        }
        return data
    },

    _set_edit_num: function (v) {
        this.input.getComponent(cc.EditBox).string = v
    },
});
