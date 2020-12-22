var global = require('global')

cc.Class({
    extends: cc.Component,

    properties: {
        edit_name: {
            type: cc.EditBox,
            default: null,
        },
        edit_img: {
            type: cc.EditBox,
            default: null,
        },
        edit_map: {
            type: cc.EditBox,
            default: null,
        },
        edit_x: {
            type: cc.EditBox,
            default: null,
        },
        edit_y: {
            type: cc.EditBox,
            default: null,
        },
        bt_add: {
            type: cc.Button,
            default: null,
        },
        bt_ok: {
            type: cc.Button,
            default: null,
        },
        bt_cancel: {
            type: cc.Button,
            default: null,
        },
        logic_define_item_prefab: {
            type: cc.Prefab,
            default: null,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.bt_add.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                //添加一个logic
                let logic = { id: this.logics.length }
                this._add_logic(logic)
            }, this)
        this.bt_ok.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                //保存
                // this.save_func(
                //     this.edit_name.string,
                //     this.edit_img.string,
                //     this.edit_map.string,
                //     this.edit_x.string,
                //     this.edit_y.string,
                //     this.logics
                // )

                let save_data = {
                    name: this.edit_name.string,
                    img: this.edit_img.string,
                    map: this.edit_map.string,
                    x: this.edit_x.string,
                    y: this.edit_y.string,
                    logics: this.logics
                }
                console.log('save_data', save_data)
                //关掉
                this.node.destroy()

                //创建一个npc在这个位置 test
                let bigmap = cc.find("Canvas/mapNode").getComponent('bigmapScript')
                bigmap._add_npc_pos(1, save_data.x, save_data.y, save_data)

            }, this)
        this.bt_cancel.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                //关掉
                this.node.destroy()
            }, this)

        this.logics_nodes = []
        this._refreshShow()

        this.node.zIndex = global.getBigZIndex()
    },

    // update (dt) {},

    setData: function (name, img, map_id, x, y, logics, save_f) {
        this.npc_name = name
        this.img = img
        this.map_id = map_id
        this.map_x = x
        this.map_y = y
        this.logics = logics || []

        this.save_func = save_f
    },

    _refreshShow: function () {
        this.edit_name.string = this.npc_name || ''
        this.edit_img.tring = this.img || ''
        this.edit_map.string = this.map_id || ''
        this.edit_x.string = this.map_x || ''
        this.edit_y.string = this.map_y || ''

        this._refresh_logics()
    },

    _refresh_logics: function () {
        //clear logics_nodes
        for (let i = 0; i < this.logics_nodes.length; ++i) {
            this.logics_nodes[i].destroy()
        }
        this.logics_nodes = []

        for (let i = 0; i < this.logics.length; ++i) {
            let logic = this.logics[i]
            if (!logic)
                continue
            let logic_item = cc.instantiate(this.logic_define_item_prefab)
            logic_item.parent = this.node
            logic_item.setPosition(0, (-3 - i) * 50)
            logic_item.getComponent('talk_logic_define_item_script').setData(logic, (id, l) => {
                this._update_logic(id, l)
            })
            this.logics_nodes.push(logic_item)
        }
    },

    _add_logic: function (logic) {
        console.log('_add_logic')
        this.logics.push(logic)
        this._refresh_logics()
    },

    _update_logic: function (id, l) {
        for (let i = 0; i < this.logics.length; ++i) {
            let logic = this.logics[i]
            if (parseInt(id) == parseInt(logic.id)) {

                console.log('update logic', id, l)
                this.logics[i] = l
                break
            }
        }
        this._refresh_logics()
    }
});
