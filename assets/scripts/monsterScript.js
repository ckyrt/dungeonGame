
var monsterConfig = require('monsterConfig')
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

        
        allXNodes: {
            default: {},
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.name_node = global.getChildByName(this.node, 'monster_name')
        this.attack_node = global.getChildByName(this.node, 'attack')
        this.defend_node = global.getChildByName(this.node, 'defend')
        this.hp_node = global.getChildByName(this.node, 'hp')

        this.allAttrs = {}
    },

    start() {
        
    },

    // update (dt) {},

    initConfig: function (monsterName) {
        let monsterAttr = monsterConfig[monsterName]

        this.setAttr('name', monsterAttr.name)
        this.setAttr('attack', monsterAttr.attack)
        this.setAttr('defend', monsterAttr.defend)
        this.setAttr('hp', monsterAttr.hp)

        let url = 'monster/'+ monsterAttr.imgSrc
        let self = this
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            global.getChildByName(self.node, 'head').getComponent(cc.Sprite).spriteFrame = spriteFrame
        })
        
        
    },


    setAttr: function(att, v)
    {
        let v1 = this.getAttr(att)
        if(v == v1)
            return
        
        
        if(att == 'name')
        {
            this.name_node.getComponent(cc.Label).string = v
        }
        if(att == 'attack')
        {
            this.attack_node.getComponent(cc.Label).string = v
        }
        if(att == 'defend')
        {
            this.defend_node.getComponent(cc.Label).string = v
        }
        if(att == 'hp')
        {
            this.hp_node.getComponent(cc.Label).string = v
            if(v <= 0)
            {
                this.beforeDie()
            }
        }
        this.allAttrs[att] = v
    },

    getAttr: function(att)
    {
        if(!this.allAttrs)
            return null
        if(!this.allAttrs.hasOwnProperty(att))
            return null
        return this.allAttrs[att]
    },

    setPos: function (x, y) {
        this.x = x
        this.y = y
        this.node.setPosition(100 * x, 100 * y)

        let backScript = cc.find("Canvas/back").getComponent('backScript')
        backScript.setMapThingInXY(x, y, this.node)
    },

    getPos: function () {
        return { x: this.x, y: this.y }
    },

    deleteFromMap:function()
    {
        this.node.destroy()
        let backScript = cc.find("Canvas/back").getComponent('backScript')
        backScript.setMapThingInXY(this.x, this.y, null)
    },

    beforeDie:function()
    {
        let cfg = monsterConfig[this.getAttr('name')]

        //給玩家经验
        let backScript = cc.find("Canvas/back").getComponent('backScript')
        backScript.role_.addExp(cfg.exp)

        //给玩家加金币
        backScript.role_.addCoin(cfg.coin)

        //去掉X
        let shadowScript = cc.find("Canvas/shadowRoot").getComponent('shadowScript')
        shadowScript.removeSuroundX(this.x, this.y)

        //原地格子类型为尸骨
        let grid = backScript.getGridByXY(this.x, this.y)
        grid.setGridType('shigu')

        this.deleteFromMap()
    },





    addXToMap: function (i, j) {

        if (i < -3 || i >= 4 || j < -3 || j >= 4)
            return

        let backScript = cc.find("Canvas/back").getComponent('backScript')

        //添加到xLayer层
        let xLayer = cc.find("Canvas/xLayer")
        var prefab = cc.instantiate(backScript.mapXPrefab)
        xLayer.addChild(prefab)
        prefab.setPosition(100 * i, 100 * j)
        prefab.on(cc.Node.EventType.TOUCH_START, function (event) {

        }, this)

        this.allXNodes[i * 10 + j] = prefab
    },

    removeXFromMap: function (x, y) {

        let n = this.allXNodes[x * 10 + y]
        if (n != null) {
            n.destroy()
            this.allXNodes[x * 10 + y] = null
        }
    },

    clearXFromMap:function()
    {
        for (var i = 0; i < this.allXNodes.length; ++i) {
            let g = this.allXNodes[i]
            g.node.destroy()
        }
        this.allXNodes = {}
    },
});
