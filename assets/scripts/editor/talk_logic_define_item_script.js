// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        label_logic: {
            type: cc.Label,
            default: null,
        },
        bt_edit: {
            type: cc.Button,
            default: null,
        },
        bt_delete: {
            type: cc.Button,
            default: null,
        },
        panel_prefab: {
            type: cc.Prefab,
            default: null,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.bt_edit.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                //打开 panel
                let panel = cc.instantiate(this.panel_prefab)
                panel.parent = cc.find("Canvas/UI")
                panel.getComponent('talk_logic_define_panel_script').setData(this.logic, this.save_func)
            }, this)

        this.bt_delete.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                //删除此项
                let id = this.logic.id
                this.save_func(id, null)
                this.node.destroy()
            }, this)

        this.label_logic.string = 'logic'
    },

    // update (dt) {},

    setData: function (logic, save_func) {
        this.logic = logic
        this.save_func = save_func
    },
});
