var global = require('global')
var Skill = require('Skill')

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},

    initAttr: function () {
        this.allAttrs = {
            'hp': 100,
            'max_hp': 100,
            'attack': 18,
            'defend': 5,
            'name': 'xx',
            'exp': 10,
            'coin': 10,
            'camp': 1,

            'crit_rate': 10,
            'crit_multi': 10,
            'fanshang_rate': 10,
            'avoid_rate': 10,
            'accurate_rate': 10,
            'suck_rate': 10,
            'suck_percent': 10,
        }

        this.setAttr('name', this.node.getComponent('moveEntity').uid)
        this.setAttr('max_hp', 100)
        this.setAttr('hp', 100)
    },


    //生物 保存 所有战斗属性
    setAttr: function (att, v) {
        let v1 = this.getAttr(att)
        if (v == v1)
            return
        if (att == 'hp') {

            global.getChildByName(this.node, 'hp').getChildByName('cur').getComponent(cc.Sprite).fillRange = v / this.getAttr('max_hp')

            if (v <= 0) {
                this.beforeDie()
            }
        }
        this.allAttrs[att] = v
    },

    getAttr: function (att) {
        if (!this.allAttrs)
            return null
        if (!this.allAttrs.hasOwnProperty(att))
            return null
        return this.allAttrs[att]
    },

    addAttr: function (att, val) {
        console.log(att, val)
        let curNum = this.getAttr(att)
        let newV = curNum + val
        newV = Math.floor(newV * 100) / 100
        this.setAttr(att, newV)
    },

    beforeDie: function () {
        //复活
        if (this.node.getComponent('moveEntity').uid == global.roleName) {
            let deadPanel = cc.find("Canvas/UI/deadPanel")
            deadPanel.getComponent('deadPanelScript').openDeadPanel()
        }
    },

    cast_skill: function () {
        this.node.getComponent('moveEntity').play_attack_anim()
        let musicScript = cc.find("Canvas/mapNode").getComponent('musicScript')
        musicScript.playEffect('hit')
    },
});
