var global = require('global')
var roleConfig = require('roleConfig')
var expConfig = require('expConfig')
var itemConfig = require('itemConfig')

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

    onLoad() {

        this.allAttrs = {}
    },

    start() {

        let backScript = cc.find("Canvas/back").getComponent('backScript')
        backScript.setInterval(0.1, 300000,
            () => {
                this._update100()
            })

        let head = global.getChildByName(this.node, 'job')
        head.on(cc.Node.EventType.TOUCH_START, (t) => {
            console.log('role clicked')
            let clickCreatureEvent = new cc.Event.EventCustom("clickCreatureSig", true)
            clickCreatureEvent.setUserData({ creature: this })
            backScript.node.dispatchEvent(clickCreatureEvent)
        }, this)
    },

    getSwyXY: function () {
        let head = global.getChildByName(this.node, 'job')
        console.log('rolepos', head.x, head.y)
        return { x: head.x, y: head.y }
    },

    initConfig: function (job, roleData) {
        this.cfg_ = roleConfig[job]
        let roleAttr = roleConfig[job]

        this.setAttr('job', job)
        this.setAttr('name', global.roleName)
        this.setAttr('min_attack', roleAttr.min_attack)
        this.setAttr('max_attack', roleAttr.max_attack)
        this.setAttr('defend', roleAttr.defend)

        this.setAttr('max_hp', roleAttr.max_hp)
        this.setAttr('hp', roleAttr.hp)
        this.setAttr('max_mp', roleAttr.max_mp)
        this.setAttr('mp', roleAttr.mp)
        this.setAttr('max_energy', roleAttr.max_energy)
        this.setAttr('energy', roleAttr.energy)

        let level = roleData != null ? roleData.level : 1
        let exp = roleData != null ? roleData.exp : 0
        let coin = roleData != null ? roleData.coin : 10000
        this.setAttr('level', level)
        this.setAttr('exp', exp)
        this.setAttr('coin', coin)
    },

    isRole: function () {
        return true
    },

    update(dt) {
    },

    _update100: function () {
        let num = this.getAttr('hp_recover')
        if (num != null && num != 0) {
            if (this.getAttr('hp') < this.getAttr('max_hp'))
                this.addAttr('hp', num / 10)
        }
    },

    setAttr: function (att, v) {
        let v1 = this.getAttr(att)
        if (v == v1)
            return

        this.allAttrs[att] = v

        if (att == 'job') {
            let job_node = global.getChildByName(this.node, 'job')

            let roleAttr = roleConfig[v]
            let url = 'hero/' + roleAttr['imgSrc']
            cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    cc.error(err.message || err);
                    return;
                }

                job_node.getComponent(cc.Sprite).spriteFrame = spriteFrame
            })
        }
        if (att == 'min_attack') {
            let max_attack = this.getAttr('max_attack') == null ? 0 : this.getAttr('max_attack')
            let attack_node = global.getChildByName(this.node, 'base_attack')
            attack_node.getComponent(cc.Label).string = Math.floor(v) + '-' + max_attack
        }
        if (att == 'max_attack') {
            let min_attack = this.getAttr('min_attack') == null ? 0 : this.getAttr('min_attack')
            let attack_node = global.getChildByName(this.node, 'base_attack')
            attack_node.getComponent(cc.Label).string = min_attack + '-' + Math.floor(v)
        }
        if (att == 'add_attack') {
            let add_node = global.getChildByName(this.node, 'add_attack')
            if (v == 0)
                add_node.getComponent(cc.Label).string = ''
            else
                add_node.getComponent(cc.Label).string = ' +' + Math.floor(v)
        }
        if (att == 'defend') {
            let defend_node = global.getChildByName(this.node, 'defend')
            defend_node.getComponent(cc.Label).string = Math.floor(v)
        }
        if (att == 'add_defend') {
            let add_node = global.getChildByName(this.node, 'add_defend')
            if (v == 0)
                add_node.getComponent(cc.Label).string = ''
            else
                add_node.getComponent(cc.Label).string = ' +' + Math.floor(v)
        }
        if (att == 'coin') {
            let coin_node = global.getChildByName(this.node, 'coin')
            coin_node.getComponent(cc.Label).string = v
        }
        if (att == 'level') {
            let level_node = global.getChildByName(this.node, 'level')
            level_node.getComponent(cc.Label).string = v

            this.onLevelUp(v)
        }

        if (att == 'hp') {
            if (v <= 0) {
                this.onRoleDead()
                return
            }
            if (v >= this.getAttr('max_hp')) {
                v = this.getAttr('max_hp')
                this.allAttrs[att] = v
            }


            global.getChildByName(this.node, 'hp').getChildByName('cur').getComponent(cc.Sprite).fillRange = v / this.getAttr('max_hp')
            global.getChildByName(this.node, 'hpNum').getComponent(cc.Label).string = Math.floor(v)
        }
        if (att == 'max_hp') {
            if (v < v1) {
                //血量上限变小 把血也变小
                this.setAttr('hp', v)
            }
            global.getChildByName(this.node, 'hp').getChildByName('cur').getComponent(cc.Sprite).fillRange = this.getAttr('hp') / v
        }
        if (att == 'mp') {
            global.getChildByName(this.node, 'mp').getChildByName('cur').getComponent(cc.Sprite).fillRange = v / this.getAttr('max_mp')
            global.getChildByName(this.node, 'mpNum').getComponent(cc.Label).string = Math.floor(v)
        }
        if (att == 'energy') {
            global.getChildByName(this.node, 'energy').getChildByName('cur').getComponent(cc.Sprite).fillRange = v / this.getAttr('max_energy')
            global.getChildByName(this.node, 'energyNum').getComponent(cc.Label).string = Math.floor(v)
        }
        if (att == 'exp') {
            let maxExp = expConfig.getLevelExp(this.getAttr('level'))
            global.getChildByName(this.node, 'exp').getComponent(cc.Sprite).fillRange = v / maxExp
        }
    },

    getAttr: function (att) {
        if (!this.allAttrs)
            return null
        if (att == 'attack') {
            let min_attack = this.getAttr('min_attack')
            let max_attack = this.getAttr('max_attack')
            let add_attack = this.getAttr('add_attack')
            return global.random(min_attack, max_attack) + (add_attack == null ? 0 : add_attack)
        }
        if (att == 'defend') {
            let defend = this.allAttrs['defend']
            let add_defend = this.getAttr('add_defend')
            return defend + (add_defend == null ? 0 : add_defend)
        }
        if (!this.allAttrs.hasOwnProperty(att))
            return null
        return this.allAttrs[att]
    },


    addExp: function (add) {
        let curExp = this.getAttr('exp')
        let curLv = this.getAttr('level')
        let maxExp = expConfig.getLevelExp(curLv)
        curExp += add
        if (curExp > maxExp) {
            curExp -= maxExp
            curLv += 1
            this.setAttr('level', curLv)
        }
        this.setAttr('exp', curExp)
    },

    addAttr: function (att, val) {
        console.log(att, val)
        let curNum = this.getAttr(att)
        let newV = curNum + val
        newV = Math.floor(newV * 100) / 100
        this.setAttr(att, newV)
    },

    _printAttr: function (att) {
        console.log(att + ':' + this.getAttr(att))
    },

    onRoleDead: function () {
        let deadPanel = cc.find("Canvas/deadPanel")
        deadPanel.getComponent('deadPanelScript').openDeadPanel()
    },

    onLevelUp: function (lv) {
        console.log('levelUp!!!!!!!!!!!!!!!!!', lv)
        this.updateAttackShow()
    },

    updateAttackShow: function () {

        let min_attack = this.getAttr('min_attack')
        let max_attack = this.getAttr('max_attack')
        let main_attr_attack = this._getGrowAttack()

        console.log('main_attr_attack', main_attr_attack)
        console.log('min_attack', min_attack)
        console.log('max_attack', max_attack)

        min_attack += Math.floor(main_attr_attack)
        max_attack += Math.floor(main_attr_attack)

        let attack_node = global.getChildByName(this.node, 'base_attack')
        attack_node.getComponent(cc.Label).string = min_attack + '-' + max_attack
    },

    _getGrowAttack:function()
    {
        let main_attr_attack = 0
        if (this.cfg_.main_attr == 'str') {
            main_attr_attack = this.cfg_.str_lv * (this.getAttr('level') - 1)
        }
        else if (this.cfg_.main_attr == 'int') {
            main_attr_attack = this.cfg_.int_lv * (this.getAttr('level') - 1)
        }
        else if (this.cfg_.main_attr == 'agi') {
            main_attr_attack = this.cfg_.agi_lv * (this.getAttr('level') - 1)
        }
        return main_attr_attack
    },

    //添加item属性
    addItemAttr: function (entity) {

        let itemName = entity.name
        let cfg = itemConfig[itemName]
        if (cfg == null)
            return

        for (let k in cfg.attrs) {
            if (k == 'gedang_rate' || k == 'gedang_value'
                || k == 'crit_rate' || k == 'crit_multi')
                continue
            this.addAttr(k, cfg.attrs[k])
        }

    },

    //删除item属性
    removeItemAttr: function (entity) {

        let itemName = entity.name
        let cfg = itemConfig[itemName]
        if (cfg == null)
            return

        for (let k in cfg.attrs) {
            if (k == 'gedang_rate' || k == 'gedang_value'
                || k == 'crit_rate' || k == 'crit_multi')
                continue
            this.addAttr(k, -1 * cfg.attrs[k])
        }

    },
});
