var global = require('global')
var roleConfig = require('roleConfig')
var expConfig = require('expConfig')

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

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
        this.allAttrs = {}
    },

    start () {

    },

    initConfig: function (job) {
        let roleAttr = roleConfig[job]

        this.setAttr('name', roleAttr.job)
        this.setAttr('attack', roleAttr.attack)
        this.setAttr('defend', roleAttr.defend)

        this.setAttr('hp', roleAttr.hp)
        this.setAttr('max_mp', roleAttr.mp)
        this.setAttr('mp', 0)
        this.setAttr('max_energy', roleAttr.energy)
        this.setAttr('energy', 0)
        
        this.setAttr('level', 1)
        this.setAttr('exp', 0)
        this.setAttr('coin', 0)
    },

    // update (dt) {},

    setAttr: function(att, v)
    {
        let v1 = this.getAttr(att)
        if(v == v1)
            return
        
        
        if(att == 'name')
        {
            let job_node = global.getChildByName(this.node, 'job')
            
            let roleAttr = roleConfig[v]
            let url = 'head/'+ roleAttr['imgSrc']
            cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    cc.error(err.message || err);
                    return;
                }

                job_node.getComponent(cc.Sprite).spriteFrame = spriteFrame
            })
        }
        if(att == 'attack')
        {
            let attack_node = global.getChildByName(this.node, 'attack')
            attack_node.getComponent(cc.Label).string = v
        }
        if(att == 'defend')
        {
            let defend_node = global.getChildByName(this.node, 'defend')
            defend_node.getComponent(cc.Label).string = v
        }
        if(att == 'coin')
        {
            let coin_node = global.getChildByName(this.node, 'coin')
            coin_node.getComponent(cc.Label).string = v
        }
        if(att == 'level')
        {
            let level_node = global.getChildByName(this.node, 'level')
            level_node.getComponent(cc.Label).string = v
        }

        if(att == 'hp')
        {
            if(v <= 0 )
            {
                this.onRoleDead()
                return
            }

            if(v > v1 || v1 == null)
            {
                this.setAttr('max_hp', v)
            }
            global.getChildByName(this.node, 'hp').getChildByName('cur').getComponent( cc.Sprite ).fillRange = v / this.getAttr('max_hp')
            global.getChildByName(this.node, 'hpNum').getComponent(cc.Label).string = v
        }
        if(att == 'mp')
        {
            global.getChildByName(this.node, 'mp').getChildByName('cur').getComponent( cc.Sprite ).fillRange = v / this.getAttr('max_mp')
            global.getChildByName(this.node, 'mpNum').getComponent(cc.Label).string = v
        }
        if(att == 'energy')
        {
            global.getChildByName(this.node, 'energy').getChildByName('cur').getComponent( cc.Sprite ).fillRange = v / this.getAttr('max_energy')
            global.getChildByName(this.node, 'energyNum').getComponent(cc.Label).string = v
        }
        if(att == 'exp')
        {
            let maxExp = expConfig.getLevelExp(this.getAttr('level'))
            global.getChildByName(this.node, 'exp').getComponent( cc.Sprite ).fillRange = v / maxExp
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


    addExp: function(add)
    {
        let curExp = this.getAttr('exp')
        let curLv = this.getAttr('level')
        let maxExp = expConfig.getLevelExp(curLv)
        curExp += add
        if(curExp > maxExp)
        {
            curExp -= maxExp
            curLv += 1
            this.setAttr('level', curLv)
        }
        this.setAttr('exp', curExp)
    },

    addCoin:function(add)
    {
        let curCoin = this.getAttr('coin')
        this.setAttr('coin', curCoin + add)
    },

    addEnergy:function(add)
    {
        let curNum = this.getAttr('energy')
        this.setAttr('energy', curNum + add)
    },

    addHp:function(add)
    {
        let curNum = this.getAttr('hp')
        this.setAttr('hp', curNum + add)
    },

    onRoleDead: function()
    {
        let deadPanel = cc.find("Canvas/deadPanel")
        deadPanel.getComponent('deadPanelScript').openDeadPanel()
    }
});
