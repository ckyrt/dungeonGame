var global = require('global')
var Skill = null

// var temp = {
//     create_skill: function () {
//         return {
//             uid: 0,
//             x: 0,
//             y: 0,
//             radius: 3,
//             caster: null,
//             targets: null,
//             cast_time: 0,
//             life_time: 1000,
//             state: 0,// 0 收集目标 1 执行伤害 2可销毁

//             update: function (now) {
//                 if (this.state == 0) {
//                     //搜集目标
//                     this._collect_targets()
//                     this._change_state(1)
//                 }
//                 else if (this.state == 1) {
//                     //执行伤害
//                     this._execute()
//                     this._change_state(2)
//                 }

//             },

//             canDestroy: function (now) {
//                 if (now - this.cast_time > this.life_time || this._get_state() == 2)
//                     return true
//                 return false
//             },

//             _collect_targets: function () {
//                 this.targets = Skill.bigmap_script._get_pos_radius_entities(this.x, this.y, this.radius, (ent) => { return ent.uid != this.caster.node.getComponent('moveEntity').uid })
//             },

//             _execute: function () {
//                 let defender = null
//                 for (var i = 0; i < this.targets.length; ++i) {
//                     let ent = Skill.bigmap_script._get_entity_by_uid(this.targets[i])
//                     if (ent) {
//                         defender = ent.node.getComponent('creature')
//                         Skill._computeDamage(this.caster, defender)
//                     }
//                 }
//             },

//             _change_state: function (s) {
//                 this.state = s
//             },

//             _get_state: function () {
//                 return this.state
//             }
//         }
//     }
// }

Skill = {

    // skills_: {},
    // bigmap_script: null,

    // generate_skill: function (center_x, center_y, caster) {
    //     let sk = temp.create_skill()
    //     sk.uid = this._generate_skill_uid()
    //     sk.cast_time = (new Date()).valueOf()
    //     sk.x = center_x
    //     sk.y = center_y
    //     sk.caster = caster
    //     this._add_skill(sk)
    //     return sk
    // },

    // _generate_skill_uid: function () {
    //     if (this.skill_uid_)
    //         this.skill_uid_ = 0
    //     return this.skill_uid_++
    // },

    // ////////////////////////////////////////////////// 技能管理 //////////////////////////////////////////////////

    // //skill
    // _add_skill(skill) {
    //     this.skills_[skill.uid] = skill
    //     return skill
    // },

    // _remove_skill: function (uid) {
    //     this.skills_[uid] = null
    //     delete (this.skills_[uid])
    // },

    // _get_skill: function (uid) {
    //     return this.skills_[uid]
    // },

    // _update_skills: function (now) {
    //     let need_deletes = []
    //     for (var k in this.skills_) {
    //         let s = this.skills_[k]
    //         s.update(now)
    //         if (s.canDestroy(now)) {
    //             need_deletes.push(s)
    //         }
    //     }
    //     for (var i = 0; i < need_deletes.length; ++i) {
    //         this._remove_skill(need_deletes[i].uid)
    //     }
    // },

    // /////////////////////////////////////////////////////伤害计算相关/////////////////////////////////////////////////////
    // _computeDamage: function (attacker, defender) {
    //     if (attacker == null || defender == null) {
    //         console.log('one fighter is null')
    //         return
    //     }
    //     if (attacker.getAttr('hp') < 1 || defender.getAttr('hp') < 1) {
    //         console.log('one fighter hp less than 1')
    //         return
    //     }

    //     let damage = 0
    //     let damageType = 'normal'
    //     //闪避 命中

    //     //闪避
    //     let avoid = defender.getAttr('avoid_rate')// - attacker.getAttr('accurate_rate')
    //     if (avoid > 0 && avoid >= global.random(0, 100)) {
    //         //自身闪避
    //         damageType = 'avoid'
    //     }
    //     else {
    //         //道具闪避
    //         if (defender.isRole != null && defender.isRole() == true) {
    //             let inventoryScript = cc.find("Canvas/UI/inventory").getComponent('inventoryScript')
    //             let isAvoid = inventoryScript.getRatioAttr('avoid')
    //             if (isAvoid > 0) {
    //                 damageType = 'avoid'
    //             }
    //         }
    //     }

    //     if (damageType == 'avoid') {
    //         damage = 0
    //     }
    //     else {
    //         //使用带装备的总属性

    //         //护甲减掉的伤害
    //         let defend = defender.getAttr('defend')

    //         // DOTA 计算
    //         // let hujia_defend = 0
    //         // if (defend >= 0)
    //         //     hujia_defend = defend * 0.06 / (1 + 0.06 * defend)
    //         // else
    //         //     hujia_defend = Math.pow(0.94, -1 * defend) - 1
    //         // damage = attacker.getAttr('attack') * (1 - hujia_defend)

    //         //普通 计算
    //         damage = attacker.getAttr('attack') - defender.getAttr('defend')

    //         damage = Math.floor(damage)

    //         //console.log('attack', attacker.getAttr('attack'))
    //         //console.log('defend', defender.getAttr('defend'))

    //         if (damage < 1) {
    //             damage = 1
    //         }

    //         //自身暴击计算
    //         let critRate = attacker.getAttr('crit_rate')
    //         let critMulti = attacker.getAttr('crit_multi')
    //         if (critRate > 0 && critRate >= global.random(0, 100)) {
    //             damage = Math.ceil(damage * critMulti)
    //             damageType = 'crit'
    //         }
    //         else {
    //             //道具暴击计算
    //             //如果attacker是玩家 计算装备的暴击
    //             if (attacker.isRole != null && attacker.isRole() == true) {
    //                 let inventoryScript = cc.find("Canvas/UI/inventory").getComponent('inventoryScript')
    //                 critMulti = inventoryScript.getRatioAttr('crit')
    //                 if (critMulti > 0) {
    //                     damage = Math.ceil(damage * critMulti)
    //                     damageType = 'crit'
    //                 }
    //             }
    //         }


    //         //吸血计算
    //         let suck_rate = attacker.getAttr('suck_rate')
    //         let suck_percent = attacker.getAttr('suck_percent')
    //         if (suck_rate > 0 && suck_rate >= global.random(0, 100)) {
    //             //吸血
    //             let blood = Math.ceil(damage * suck_percent / 100)
    //             if (blood < 1)
    //                 blood = 1
    //             this._executeDamage(attacker, defender, blood, 'suck')
    //             cc.find("Canvas/UI").getComponent('UIRootScript')._addTextInfo(attacker.getAttr('name') + ' 吸血 ' + blood + ' 点')
    //         }

    //         //反伤计算
    //         let fanshang_rate = defender.getAttr('fanshang_rate')
    //         if (fanshang_rate > 0 && fanshang_rate >= global.random(0, 100)) {
    //             //反伤
    //             damageType = 'fanshang'
    //         }
    //     }

    //     cc.find("Canvas/UI").getComponent('UIRootScript')._addTextInfo(attacker.getAttr('name') + ' 对 ' + defender.getAttr('name') + ' 造成 ' + damage + ' 点伤害')
    //     this._executeDamage(attacker, defender, damage, damageType)
    // },

    // _addUnitHp: function (unit, hp) {
    //     let curHp = unit.getAttr('hp')
    //     curHp += hp
    //     unit.setAttr('hp', curHp)
    //     this._playNumberJump(hp, unit, new cc.color(255, 0, 0))
    // },

    // //执行伤害
    // _executeDamage: function (attacker, unit, damage, reason) {
    //     if (reason == 'dici') {
    //         this._addUnitHp(unit, -damage)
    //     }
    //     if (reason == 'normal') {
    //         //如果unit是玩家 计算一下伤害格挡
    //         if (unit.isRole != null && unit.isRole() == true) {
    //             let inventoryScript = cc.find("Canvas/UI/inventory").getComponent('inventoryScript')
    //             let gedang_value = inventoryScript.getRatioAttr('gedang')
    //             damage -= gedang_value
    //             if (damage < 1)
    //                 damage = 1
    //         }
    //         this._addUnitHp(unit, -damage)
    //     }
    //     if (reason == 'mofa') {
    //         this._addUnitHp(unit, -damage)
    //     }
    //     if (reason == 'crit') {
    //         this._addUnitHp(unit, -damage)
    //         this._playNumberJump('暴击', attacker, new cc.color(255, 255, 0), 20)
    //     }
    //     if (reason == 'avoid') {
    //         this._playNumberJump('miss', attacker, new cc.color(100, 110, 110), 20)
    //     }
    //     if (reason == 'suck') {
    //         this._addUnitHp(attacker, damage)
    //         this._playNumberJump('吸血', attacker, new cc.color(0, 0, 255), 20)
    //     }
    //     if (reason == 'fanshang') {
    //         this._addUnitHp(unit, -damage)
    //         this._playNumberJump('反伤', unit, new cc.color(0, 110, 110), 20)

    //         this._addUnitHp(attacker, -damage)
    //     }
    // },
    // //跳数字
    // _playNumberJump: function (txt, creature, color, fontSize = 40) {

    //     let local_pos = creature.node.position
    //     //相对位置 转为 绝对位置
    //     var absolutePos = cc.find("Canvas").convertToWorldSpaceAR(cc.v2(local_pos.x, local_pos.y + 40))
    //     this.bigmap_script._playNumberJump(txt, absolutePos.x, absolutePos.y, color, fontSize)
    // },
}

module.exports = Skill;