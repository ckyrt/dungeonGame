var global = require('global')

cc.Class({
    extends: cc.Component,

    properties: {
        edit_condition: {
            type: cc.EditBox,
            default: null,
        },
        edit_talk: {
            type: cc.EditBox,
            default: null,
        },
        bt_add_bt: {
            type: cc.Button,
            default: null,
        },
        bt_cancel: {
            type: cc.Button,
            default: null,
        },
        bt_ok: {
            type: cc.Button,
            default: null,
        },
        bt_item_prefab: {
            type: cc.Prefab,
            default: null,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.bt_add_bt.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                //添加一个按钮
                let bt = { id: this.buttons.length }
                this._add_button(bt)
            }, this)
        this.bt_cancel.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                //关闭
                this.node.destroy()
            }, this)
        this.bt_ok.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                //保存
                this.save_func(this.logic_id, this._getData())
                //关闭
                this.node.destroy()
            }, this)
        this.buttons_nodes = []
        this._updateShow()

        this.node.zIndex = global.getBigZIndex()
    },

    // update (dt) {},

    setData: function (logic, save_f) {
        //文字
        //行为
        this.logic_id = logic.id
        this.condition = logic.condition
        this.talk = logic.talk
        this.buttons = logic.buttons || []

        this.save_func = save_f// id, logic
        console.log('talk_logic_define_panel_script setData', logic)
    },

    _getData: function () {
        return {
            id: this.logic_id,
            condition: this.edit_condition.string,
            talk: this.edit_talk.string,
            buttons: this.buttons,
        }
    },

    _updateShow: function () {
        this.edit_condition.string = this.condition || ''
        this.edit_talk.string = this.talk || ''

        this._updateButtons()
    },

    _updateButtons: function () {
        //clear buttons_nodes
        for (let i = 0; i < this.buttons_nodes.length; ++i) {
            let bt_node = this.buttons_nodes[i]
            bt_node.destroy()
        }
        this.buttons_nodes = []

        for (let i = 0; i < this.buttons.length; ++i) {
            let data = this.buttons[i]
            let bt_item = cc.instantiate(this.bt_item_prefab)
            bt_item.parent = this.node
            bt_item.setPosition(0, (-3 - i) * 50)
            bt_item.getComponent('bt_define_item_script').setData(data, (id, l) => {
                this._update_button(id, l)
            })
            this.buttons_nodes.push(bt_item)
        }
    },

    _add_button: function (bt) {
        console.log('_add_button')
        this.buttons.push(bt)
        this._updateButtons()
    },

    _update_button: function (id, l) {
        for (let i = 0; i < this.buttons.length; ++i) {
            let bt = this.buttons[i]
            if (parseInt(id) == parseInt(bt.id)) {
                console.log('update button', id, l)
                this.buttons[i] = l
                break
            }
        }
        this._updateButtons()
    }
});
