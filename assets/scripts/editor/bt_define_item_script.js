// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        label_words: {
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
                console.log('open panel', this.words, this.action)
                panel.getComponent('bt_define_panel_script').setData(this.words, this.action, (words, actions) => {
                    this.save_func(this.data_id, { words: words, actions: actions, id: this.data_id })
                })
            }, this)

        this.bt_delete.node.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                //删除此项
                this.save_func(this.data_id, null)
                this.node.destroy()
            }, this)

        this.label_words.string = this.words || 'ok'
    },

    // update (dt) {},

    setData: function (data, save_f) {
        //文字
        //行为
        this.data_id = data.id
        this.words = data.words
        this.action = data.actions
        this.save_func = save_f
        console.log('bt_define_item_script setData', data)
    },
});
