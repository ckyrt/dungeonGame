var global = require('global')
var jsClientScript = require('jsClientScript')
var MsgID = require('MsgID')
var itemConfig = require('itemConfig')
var npcConfig = require('npcConfig')


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
        npc_define_panel_prefab: {
            type: cc.Prefab,
            default: null,
        },
        talk_panel_prefab: {
            type: cc.Prefab,
            default: null,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.parseLoginData()
    },

    start() {

        this._initRole(global.loginData)

        //attack test
        let attackBtn = global.getChildByName(this.node, 'attackBtn')
        attackBtn.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                let bigmap = cc.find("Canvas/mapNode").getComponent('bigmapScript')
                let ownRole = bigmap._get_role(global.roleName)
                ownRole.play_attack_anim()
            }, this)

        //death test
        let deathBtn = global.getChildByName(this.node, 'deathBtn')
        deathBtn.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                let bigmap = cc.find("Canvas/mapNode").getComponent('bigmapScript')
                let ownRole = bigmap._get_role(global.roleName)
                ownRole.play_death_anim()
            }, this)

        //创建npc
        let makeNpcBtn = global.getChildByName(this.node, 'makeNpcBtn')
        makeNpcBtn.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                let panel = cc.instantiate(this.npc_define_panel_prefab)
                panel.parent = this.node
                panel.getComponent('npc_define_panel_script').setData(null)
            }, this)

        //编辑器
        let editorBtn = global.getChildByName(this.node, 'editorBtn')
        editorBtn.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                //跳转到编辑器场景
                cc.director.loadScene("user_script", () => {

                })
            }, this)

        //存档
        let saveBtn = global.getChildByName(this.node, 'saveBtn')
        saveBtn.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this.saveDataToServer()
            }, this)
        //排行榜
        let rankBtn = global.getChildByName(this.node, 'rankBtn')
        rankBtn.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                let rankPanelScript = global.getChildByName(this.node, 'rankPanel').getComponent('rankPanelScript')
                rankPanelScript.openPanel()
            }, this)

        //竞技场
        let arenaBtn = global.getChildByName(this.node, 'arenaBtn')
        arenaBtn.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                let arenaPanelScript = global.getChildByName(this.node, 'arenaPanel').getComponent('arenaPanelScript')
                arenaPanelScript.openPanel()
            }, this)
        //vip商店
        let vipShopBtn = global.getChildByName(this.node, 'vipShopBtn')
        vipShopBtn.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                let name = 'VIP商店'
                let cfg = npcConfig[name]
                let url = 'npc/' + cfg.imgSrc
                let shop = global.getChildByName(this.node, 'shop')
                shop.getComponent('shopPanelScript').openShopPanel(cfg.items, name, cfg.words, url)
            }, this)

        //装备
        let equipBtn = cc.find("Canvas/UI/equipBtn")
        equipBtn.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                let RoleEquipScript = global.getChildByName(this.node, 'roleEquipInfo').getComponent('RoleEquipScript')
                RoleEquipScript.openRoleEquip()
            }, this)

        //背包
        let bagBtn = global.getChildByName(this.node, 'bagBtn')
        bagBtn.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                let bagScript = global.getChildByName(this.node, 'bag').getComponent('bagScript')
                bagScript.openBag()
            }, this)

        //this._initInventory(global.loginData == null ? [] : global.loginData.items)
        this._initBag(global.loginData == null ? [] : global.loginData.items)
        //init equips
        this._initEquips(global.loginData == null ? [] : global.loginData.equips)

        //三秒后给用户自动存一下
        this.setInterval(3, 1,
            () => {
                this.saveDataToServer()
            })

        jsClientScript.registerMsg(MsgID.SAVE_DATA_ACK, (msg) => {
            this.onSaveDataAck(msg)
        })

        //检测连接状况
        this.setInterval(3, 9999,
            () => {
                if (global.connectStatus != 'connected') {
                    this._addTextInfo('与服务器断开连接..请刷新')
                }
            })
    },

    // update (dt) {},
    setInterval: function (interval/*秒*/, repeat, func) {
        var delay = 0
        this.schedule(function () {
            func()
        }, interval, repeat - 1, delay)
    },

    _addTextInfo: function (str, color = new cc.color(171, 157, 226)) {
        this.node.getComponent('info_control').add_tip_item(">" + str, color)
    },

    _initRole: function (roleData = null) {
        global.role_ = global.getChildByName(this.node, 'role').getComponent('roleScript')
        global.role_.initConfig(roleData)
    },

    _initBag: function (items = []) {
        //清除bag道具
        // let bagScript = global.getChildByName(this.node, 'bag').getComponent('bagScript')
        // bagScript.clearAll()
        // for (var i = 0; i < items.length; ++i) {
        //     console.log('bag items:' + items[i])
        //     bagScript._addItemToPos(items[i], i + 1)
        // }
        // bagScript._refreshShow()
    },

    _initEquips: function (items = []) {
        console.log('equips:' + items)
        let equipScript = global.getChildByName(this.node, 'roleEquipInfo').getComponent('RoleEquipScript')
        for (var i = 0; i < items.length; ++i) {
            equipScript._addItemToPart(items[i].part, itemConfig.copyItemEntity(items[i].item))
        }
    },

    saveDataToServer: function () {
        var msg = {}
        msg.msg_id = MsgID.SAVE_DATA
        //名字
        msg.name = global.roleName
        //第几关
        msg.guanka = this.curDungeonName
        //玩家道具
        //msg.items = cc.find("Canvas/UI/inventory").getComponent('inventoryScript').getAllItems()
        //msg.items = global.getChildByName(this.node, 'bag').getComponent('bagScript').getAllItems()

        //玩家装备栏
        //msg.equips = global.getChildByName(this.node, 'roleEquipInfo').getComponent('RoleEquipScript').getAllEquipItems()

        global.role_.getRoleSaveData(msg)
        jsClientScript.send(JSON.stringify(msg))

        console.log('存数据', msg)
    },

    parseLoginData: function () {
        if (global.loginData != null) {
            this.curDungeonName = global.loginData.guanka
            let level = global.loginData.level
            let exp = global.loginData.exp
            let items = global.loginData.items
            let equips = global.loginData.equips
            let coin = global.loginData.coin
        }

        console.log('loginData:', global.loginData)
    },

    onSaveDataAck: function (msg) {
        if (msg.error_code == 0) {
            this._addTextInfo('保存数据成功')
        }
    },

    createNpcTalk: function (words, buttons) {

        let panel = cc.instantiate(this.talk_panel_prefab)
        panel.parent = this.node
        panel.getComponent('talk_panel_script').setData(words, buttons)
    },
});
