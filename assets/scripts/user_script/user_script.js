var global = require('global')
var rpc = require('rpc')

cc.Class({
    extends: cc.Component,

    properties: {

        bt_bigger: {
            type: cc.Button,
            default: null,
        },
        bt_smaller: {
            type: cc.Button,
            default: null,
        },
        bt_compute: {
            type: cc.Button,
            default: null,
        },

        back_camera: {
            type: cc.Camera,
            default: null,
        },

        bt_del: {
            type: cc.Button,
            default: null,
        },

        bt_jia: {
            type: cc.Button,
            default: null,
        },
        bt_jian: {
            type: cc.Button,
            default: null,
        },
        bt_cheng: {
            type: cc.Button,
            default: null,
        },
        bt_chu: {
            type: cc.Button,
            default: null,
        },

        bt_watch: {
            type: cc.Button,
            default: null,
        },

        bt_input: {
            type: cc.Button,
            default: null,
        },


        bt_relation_bigger: {
            type: cc.Button,
            default: null,
        },
        bt_relation_smaller: {
            type: cc.Button,
            default: null,
        },
        bt_relation_equal: {
            type: cc.Button,
            default: null,
        },

        bt_logic_yu: {
            type: cc.Button,
            default: null,
        },
        bt_logic_huo: {
            type: cc.Button,
            default: null,
        },
        bt_logic_fei: {
            type: cc.Button,
            default: null,
        },

        bt_var_def: {
            type: cc.Button,
            default: null,
        },

        bt_random: {
            type: cc.Button,
            default: null,
        },
        bt_for: {
            type: cc.Button,
            default: null,
        },
        bt_timer: {
            type: cc.Button,
            default: null,
        },
        bt_start: {
            type: cc.Button,
            default: null,
        },

        node_2_1_prefab: {
            type: cc.Prefab,
            default: null,
        },

        add_var_prefab: {
            type: cc.Prefab,
            default: null,
        },

        line_prefab: {
            type: cc.Prefab,
            default: null,
        },
        data_line_prefab: {
            type: cc.Prefab,
            default: null,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

        this.bt_bigger.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this.back_camera.zoomRatio += 0.2
            }, this)
        this.bt_smaller.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this.back_camera.zoomRatio -= 0.2
            }, this)
        this.bt_compute.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this._reset_all_nodes_input_output_value()
                this._compute()
            }, this)

        this.wait_del_ = false
        this.bt_del.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this.wait_del_ = true
            }, this)

        this.bt_jia.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this._create_2_1_node('+')
            }, this)
        this.bt_jian.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this._create_2_1_node('-')
            }, this)
        this.bt_cheng.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this._create_2_1_node('*')
            }, this)
        this.bt_chu.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this._create_2_1_node('/')
            }, this)

        this.bt_watch.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this._create_2_1_node('watch')
            }, this)
        this.bt_input.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this._create_2_1_node('input')
            }, this)


        this.bt_relation_bigger.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this._create_2_1_node('>')
            }, this)
        this.bt_relation_smaller.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this._create_2_1_node('<')
            }, this)
        this.bt_relation_equal.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this._create_2_1_node('==')
            }, this)

        this.bt_logic_yu.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this._create_2_1_node('&&')
            }, this)
        this.bt_logic_huo.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this._create_2_1_node('||')
            }, this)
        this.bt_logic_fei.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this._create_2_1_node('!')
            }, this)

        this.bt_var_def.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                //打开 panel
                let panel = cc.instantiate(this.add_var_prefab)
                let back = global.getChildByName(this.node, "back")
                back.addChild(panel)
                panel.getComponent('add_var_panel_script').setData(this.words, (words) => {
                    this._create_2_1_node('var_def', words)
                })
            }, this)

        this.bt_random.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this._create_2_1_node('random')
            }, this)

        this.bt_for.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this._create_2_1_node('for')
            }, this)

        this.bt_timer.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this._create_2_1_node('timer')
            }, this)
            this.bt_start.node.on(cc.Node.EventType.TOUCH_START,
                function (t) {
                    this._create_2_1_node('start')
                }, this)

        //返回大场景
        let gobackWorldBtn = global.getChildByName(this.node, 'gobackWorld')
        gobackWorldBtn.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                //跳转到编辑器场景
                cc.director.loadScene("bigmap", () => {

                })
            }, this)

        //保存到服务器
        let saveBtn = global.getChildByName(this.node, 'save')
        saveBtn.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this._save()
            }, this)

        this.nodes = []
        this.lines = []
        this.data_lines = []

        //rpc
        rpc.addRpcFunc('load_user_script_c', (args) => {
            let str = args[0]
            this._deserialize_str(str)
        })
        rpc._call('get_user_script_s', [global.roleName])
    },

    _add_node: function (n) {
        this.nodes.push(n)
    },
    _del_node: function (n) {
        let index = -1
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i] == n) {
                index = i
                break
            }
        }
        if (index == -1)
            return
        let del_node = this.nodes[index]

        {
            //删掉相关的line
            let ret = this._get_node_related_lines(del_node)
            for (let i = 0; i < ret.length; ++i) {
                this._del_line(ret[i])
            }
        }

        {
            //删掉相关的data line
            let ret = this._get_node_related_data_lines(del_node)
            for (let i = 0; i < ret.length; ++i) {
                this._del_data_line(ret[i])
            }
        }

        del_node.destroy()
        this.nodes.splice(index, 1)
    },

    _get_node_by_uuid: function (uuid) {
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].getComponent("node_2_1_script").get_node_uuid() == uuid) {
                return this.nodes[i]
            }
        }
        return null
    },

    _generate_node_uuid: function () {
        
        var timestamp = (new Date()).valueOf()
        return parseInt((timestamp - 1608638883586) / 100)
    },

    _create_2_1_node: function (nn, var_name = null, uuid = 0) {

        var prefab = cc.instantiate(this.node_2_1_prefab)
        prefab.on(cc.Node.EventType.TOUCH_START, function (t) {
            if (this.wait_del_) {
                this._del_node(prefab)
                this.wait_del_ = false
            }
        }, this)

        let back = global.getChildByName(this.node, "back")
        back.addChild(prefab)

        var node_2_1_sc = prefab.getComponent("node_2_1_script")
        node_2_1_sc.set_node_name(nn, var_name)
        node_2_1_sc.set_user_script(this)
        node_2_1_sc.set_node_uuid(uuid > 0 ? uuid : this._generate_node_uuid())

        //设置位置 屏幕正中间
        let windowSize = cc.view.getVisibleSize()
        let worldPoint = cc.v2(0, 0)
        this.back_camera.getScreenToWorldPoint(cc.v2(windowSize.width / 2, windowSize.height / 2), worldPoint)
        this._set_pos_in_back(prefab, worldPoint)

        this._add_node(prefab)

        if (nn == 'var_def' || nn == 'var_ref') {
            prefab.color = new cc.Color(255, 0, 0)
        }
        else {
            prefab.color = new cc.Color(255, 255, 0)
        }

        return prefab
    },

    _set_pos_in_back(prefab, x, y) {
        let back = global.getChildByName(this.node, "back")
        var locPos = back.convertToNodeSpaceAR(cc.v2(x, y))
        prefab.setPosition(locPos)
    },

    // update (dt) {},

    _redraw_line: function (prefab, from, to) {

        //console.log('_update_line_pos', from.x, from.y, to.x, to.y)
        let mid_x = (from.x + to.x) / 2
        let mid_y = (from.y + to.y) / 2

        let dis_x = to.x - from.x
        let dis_y = to.y - from.y
        let tan = dis_y / dis_x
        let rot = Math.atan(tan) / (Math.PI / 180)
        let len = Math.sqrt(Math.pow(dis_x, 2) + Math.pow(dis_y, 2))

        prefab.width = len
        prefab.height = 5
        prefab.angle = rot
        this._set_pos_in_back(prefab, mid_x, mid_y)
    },

    on_node_move(node) {

        //lines
        {
            let lines = this._get_node_related_lines(node)
            for (let i = 0; i < lines.length; ++i) {

                let data = this._get_line_data(lines[i])
                let node1 = data.node1
                let node2 = data.node2
                let node1_pin = data.is_son ? global.getChildByName(node1, "pin_son") : global.getChildByName(node1, "pin_2")
                let node2_pin = global.getChildByName(node2, "pin_1")
                let from = node1.convertToWorldSpaceAR(cc.v2(node1_pin.position.x, node1_pin.position.y))
                let to = node2.convertToWorldSpaceAR(cc.v2(node2_pin.position.x, node2_pin.position.y))

                this._redraw_line(lines[i], from, to)
            }
        }

        //data lines
        {
            let data_lines = this._get_node_related_data_lines(node)
            for (let i = 0; i < data_lines.length; ++i) {

                let nodes = this._get_data_line_related_nodes(data_lines[i])
                let node1 = nodes.node1
                let node2 = nodes.node2
                let in_node = nodes.in_node
                let node1_pin = global.getChildByName(node1, "out_node")
                let node2_pin = in_node
                let from = node1.convertToWorldSpaceAR(cc.v2(node1_pin.position.x, node1_pin.position.y))
                let to = node2.convertToWorldSpaceAR(cc.v2(node2_pin.position.x, node2_pin.position.y))

                this._redraw_line(data_lines[i], from, to)
            }
        }

    },

    /////////////////////////////////////////////////////////////顺序流模块/////////////////////////////////////////////////////////////
    //connect two nodes , add line, delete line
    connectNodeUsingLine: function (node1, node2, is_son = false) {

        if (!this._is_line_connected(node1, node2)) {

            var prefab = cc.instantiate(this.line_prefab)
            prefab.on(cc.Node.EventType.TOUCH_START, function (t) {
                if (this.wait_del_) {
                    this._del_line(prefab)
                    this.wait_del_ = false
                }
            }, this)
            let back = global.getChildByName(this.node, "back")
            back.addChild(prefab)

            this._add_line(prefab, node1, node2, is_son)

            let node1_pin = is_son ? global.getChildByName(node1, "pin_son") : global.getChildByName(node1, "pin_2")
            let node2_pin = global.getChildByName(node2, "pin_1")
            let from = node1.convertToWorldSpaceAR(cc.v2(node1_pin.position.x, node1_pin.position.y))
            let to = node2.convertToWorldSpaceAR(cc.v2(node2_pin.position.x, node2_pin.position.y))

            this._redraw_line(prefab, from, to)
        }
    },

    _add_line: function (l, node1, node2, is_son) {
        if (!this._is_line_connected(node1, node2))
            this.lines.push({ 'line': l, 'node1': node1, 'node2': node2, 'is_son': is_son })
    },
    _del_line: function (l) {
        let index = -1
        for (var i = 0; i < this.lines.length; i++) {
            if (this.lines[i].line == l) {
                index = i
                break
            }
        }
        if (index == -1)
            return
        let del_line = this.lines[index].line
        console.log(del_line)
        del_line.destroy()
        this.lines.splice(index, 1)
    },

    _get_node_related_lines: function (n) {
        let ret = []
        for (var i = 0; i < this.lines.length; i++) {
            if (this.lines[i].node1 == n || this.lines[i].node2 == n) {
                ret.push(this.lines[i].line)
            }
        }
        return ret
    },

    _get_line_data: function (l) {
        for (var i = 0; i < this.lines.length; i++) {
            if (this.lines[i].line == l) {
                return this.lines[i]
            }
        }
        return null
    },

    _is_line_connected: function (node1, node2) {
        for (var i = 0; i < this.lines.length; i++) {
            if (this.lines[i].node1 == node1 && this.lines[i].node2 == node2)
                return true
        }
        return false
    },










    /////////////////////////////////////////////////////////////数据流模块/////////////////////////////////////////////////////////////


    connectDataNodeUsingLine: function (node1, node2, index) {
        let input = node2.getComponent('node_2_1_script').get_in_node_by_index(index)
        if (!this._is_data_line_connected(node1, input)) {

            var prefab = cc.instantiate(this.data_line_prefab)
            prefab.on(cc.Node.EventType.TOUCH_START, function (t) {
                if (this.wait_del_) {
                    this._del_data_line(prefab)
                    this.wait_del_ = false
                }
            }, this)
            let back = global.getChildByName(this.node, "back")
            back.addChild(prefab)

            this._add_data_line(prefab, node1, node2, input)

            let node1_pin = global.getChildByName(node1, "out_node")
            let node2_pin = input
            let from = node1.convertToWorldSpaceAR(cc.v2(node1_pin.position.x, node1_pin.position.y))
            let to = node2.convertToWorldSpaceAR(cc.v2(node2_pin.position.x, node2_pin.position.y))

            this._redraw_line(prefab, from, to)
        }
    },


    _add_data_line: function (l, node1, node2, in_node) {
        if (!this._is_data_line_connected(node1, in_node))
            this.data_lines.push({ 'line': l, 'node1': node1, 'node2': node2, 'in_node': in_node })
    },
    _del_data_line: function (l) {
        let index = -1
        for (var i = 0; i < this.data_lines.length; i++) {
            if (this.data_lines[i].line == l) {
                index = i
                break
            }
        }
        if (index == -1)
            return
        let del_line = this.data_lines[index].line
        console.log(del_line)
        del_line.destroy()
        this.data_lines.splice(index, 1)
    },

    _get_node_related_data_lines: function (n) {
        let ret = []
        for (var i = 0; i < this.data_lines.length; i++) {
            if (this.data_lines[i].node1 == n || this.data_lines[i].node2 == n) {
                ret.push(this.data_lines[i].line)
            }
        }
        return ret
    },

    _get_data_line_related_nodes: function (l) {
        for (var i = 0; i < this.data_lines.length; i++) {
            if (this.data_lines[i].line == l) {
                return { 'node1': this.data_lines[i].node1, 'node2': this.data_lines[i].node2, 'in_node': this.data_lines[i].in_node }
            }
        }
        return null
    },

    _is_data_line_connected: function (node1, in_node) {
        for (var i = 0; i < this.data_lines.length; i++) {
            if (this.data_lines[i].node1 == node1 && this.data_lines[i].in_node == in_node)
                return true
        }
        return false
    },


    /////////////////////////////////////////////////////////////计算模块/////////////////////////////////////////////////////////////
    _get_next_procedure_node: function (n) {
        for (var i = 0; i < this.lines.length; i++) {
            if (this.lines[i].node1 == n && !this.lines[i].is_son) {
                return this.lines[i].node2
            }
        }
        return null
    },

    //得到 son procedure node
    _get_son_procedure_node: function (n) {
        for (var i = 0; i < this.lines.length; i++) {
            if (this.lines[i].node1 == n && this.lines[i].is_son) {
                return this.lines[i].node2
            }
        }
    },

    //起始节点
    _get_start_node: function () {
        for (var i = 0; i < this.nodes.length; i++) {
            let n = this.nodes[i]
            if (n.getComponent('node_2_1_script').get_node_name() == 'start')
                return n
        }
        return null
    },

    _compute: function () {
        let cur_node = this._get_start_node()
        while (cur_node) {
            console.log('cur_node:' + cur_node)
            this._compute_procedure_node(cur_node)
            cur_node = this._get_next_procedure_node(cur_node)
        }
    },

    _compute_procedure_node: function (n) {

        let n_name = n.getComponent('node_2_1_script').get_node_name()

        {
            //普通计算节点，有输入输出的，计算一下
            //得到这个next_node的所有叶子节点，然后开始计算
            let leafs_arr = this._get_node_leafs(n)
            leafs_arr = this.unique_array(leafs_arr)
            for (var j = 0; j < leafs_arr.length; ++j) {
                let leaf = leafs_arr[j]
                leaf.getComponent('node_2_1_script')._compute()
            }
        }

        let son_node = this._get_son_procedure_node(n)
        //条件节点，for循环, timer 有嵌套
        if (son_node) {
            if (n_name == '>' || n_name == '<' || n_name == '==') {
                //如果是条件节点，那么根据条件节点的值 判断是否要計算son procedure 
                let need_compute_son = n.getComponent('node_2_1_script').out_v == true
                if (need_compute_son) {
                    this._compute_procedure_node(son_node)
                }
            }
            else if (n_name == 'for') {
                //计算子节点10次
                for (let i = 0; i < 10; ++i) {
                    this._reset_all_nodes_input_output_value()
                    this._compute_procedure_node(son_node)
                }
            }
            else if (n_name == 'timer') {
                let node_script = n.getComponent('node_2_1_script')
                let times = Number(node_script.input_v_1) || 0
                let interval = Number(node_script.input_v_2) || 99999
                let son_node = this._get_son_procedure_node(n)
                this.setInterval(interval, times,
                    () => {
                        this._reset_all_nodes_input_output_value()
                        this._compute_procedure_node(son_node)
                    })
            }
        }

    },

    unique_array: function (arr) {
        var hash = [];
        for (var i = 0; i < arr.length; i++) {
            if (hash.indexOf(arr[i]) == -1) {
                hash.push(arr[i]);
            }
        }
        return hash;
    },

    //递归求的所有叶子节点
    _get_node_leafs: function (n) {
        let sons = this._get_next_output_node(n)

        let leafs = []
        if (sons.length > 0) {
            for (var i = 0; i < sons.length; ++i) {
                let son_leafs = this._get_node_leafs(sons[i])
                leafs = leafs.concat(son_leafs)
            }
        }
        else {
            leafs = leafs.concat([n])
        }
        return leafs


    },

    _reset_all_nodes_input_output_value: function () {
        for (var i = 0; i < this.nodes.length; i++) {
            let n = this.nodes[i]
            n.getComponent('node_2_1_script').input_v_1 = null
            n.getComponent('node_2_1_script').input_v_2 = null
            n.getComponent('node_2_1_script').out_v = null
        }
    },

    //得到他的pre 输入节点
    _get_prev_input_node: function (node, input_node) {
        for (var i = 0; i < this.data_lines.length; i++) {
            if (this.data_lines[i].node2 == node && this.data_lines[i].in_node == input_node) {
                return this.data_lines[i].node1
            }
        }
        return null
    },

    //得到他的next 输出节点
    _get_next_output_node: function (node) {
        let rets = []
        for (var i = 0; i < this.data_lines.length; i++) {
            if (this.data_lines[i].node1 == node) {
                rets.push(this.data_lines[i].node2)
            }
        }

        //console.log('_get_next_output_node:' + node.getComponent('node_2_1_script').get_node_name() + ' rets.length: ' + rets.length)

        return rets
    },




    ///////////////////////////////////////////////////////变量定义节点 和 引用节点///////////////////////////////////////////////////////
    _add_var_def: function (var_name) {
        if (this.all_vars == null)
            this.all_vars = {}
        this.all_vars[var_name] = ''
    },
    _remove_var_def: function (var_name) {
        if (this.all_vars == null)
            this.all_vars = {}
        this.all_vars[var_name] = null
    },
    _get_var_v: function (var_name) {
        if (this.all_vars == null)
            return null
        return this.all_vars[var_name]
    },
    _set_var_v: function (var_name, v) {
        this.all_vars[var_name] = v
    },


    /////////////////////////////////////////////////////////////////////定時器/////////////////////////////////////////////////////////////////////
    setInterval: function (interval/*秒*/, repeat, func) {
        var delay = 0
        this.schedule(function () {
            func()
        }, interval, repeat - 1, delay)
    },






    /////////////////////////////////////////////////////////////////////数据序列化/////////////////////////////////////////////////////////////////////

    _save: function () {
        let str = this._serialize_str()
        rpc._call('save_user_script_s', [global.roleName, str])
    },

    _serialize_str: function () {

        let nodes_data = []
        for (var i = 0; i < this.nodes.length; i++) {
            let n = this.nodes[i]
            let ns = n.getComponent("node_2_1_script")
            nodes_data.push(ns._serialize_str())
        }
        let lines_data = []
        for (var i = 0; i < this.lines.length; i++) {
            let n = this.lines[i]
            let data = { 'node1': n.node1.getComponent("node_2_1_script").get_node_uuid(), 'node2': n.node2.getComponent("node_2_1_script").get_node_uuid(), 'is_son': n.is_son }
            lines_data.push(data)
        }
        let data_lines_data = []
        for (var i = 0; i < this.data_lines.length; i++) {
            let n = this.data_lines[i]
            let data = { 'node1': n.node1.getComponent("node_2_1_script").get_node_uuid(), 'node2': n.node2.getComponent("node_2_1_script").get_node_uuid(), 'index': n.node2.getComponent("node_2_1_script").get_index_by_in_node(n.in_node) }
            data_lines_data.push(data)
        }

        let all_data = { 'nodes': nodes_data, 'lines': lines_data, 'data_lines': data_lines_data, }
        return JSON.stringify(all_data)
    },

    _deserialize_str: function (str) {
        console.log(str)
        if (str == '')
            return
        let all_data = JSON.parse(str)
        console.log(all_data)
        let nodes_data = all_data.nodes
        let lines_data = all_data.lines
        let data_lines_data = all_data.data_lines


        for (var i = 0; i < nodes_data.length; i++) {
            let n = nodes_data[i]

            let prefab = this._create_2_1_node(n.name, n.var_name, n.uuid)
            prefab.setPosition(n.pos)

            if (n.name == 'input') {
                prefab.getComponent("node_2_1_script")._set_edit_num(n.input)
            }
        }

        for (var i = 0; i < lines_data.length; i++) {
            let n = lines_data[i]
            let node1 = this._get_node_by_uuid(n.node1)
            let node2 = this._get_node_by_uuid(n.node2)
            this.connectNodeUsingLine(node1, node2, n.is_son)
        }

        for (var i = 0; i < data_lines_data.length; i++) {
            let n = data_lines_data[i]
            let node1 = this._get_node_by_uuid(n.node1)
            let node2 = this._get_node_by_uuid(n.node2)
            this.connectDataNodeUsingLine(node1, node2, n.index)
        }
    },


    //创建怪物
});
