
var roleConfig = {

    '战士': {
        'job': '战士',
        'imgSrc': 'zhanshi',
        'attack': 100,
        'defend': 3,

        'hp': 3000,
        'energy': 80,
        'mp': 10,

        'crit_rate': 1,
        'crit_multi': 1,
        'fanshang_rate': 1,
        'avoid_rate': 1,
        'accurate_rate': 1,
        'suck_rate': 1,
        'suck_percent': 1,
    },
    '法师': {
        'job': '法师',
        'imgSrc': '054-Undead04',
        'attack': 220,
        'defend': 130,

        'hp': 100,
        'energy': 80,
        'mp': 10,

        'crit_rate': 1,
        'crit_multi': 1,
        'fanshang_rate': 1,
        'avoid_rate': 1,
        'accurate_rate': 1,
        'suck_rate': 1,
        'suck_percent': 1,
    },
    '道士': {
        'job': '道士',
        'imgSrc': '055-Snake01',
        'attack': 220,
        'defend': 130,

        'hp': 100,
        'energy': 80,
        'mp': 10,

        'crit_rate': 1,
        'crit_multi': 1,
        'fanshang_rate': 1,
        'avoid_rate': 1,
        'accurate_rate': 1,
        'suck_rate': 1,
        'suck_percent': 1,
    },
    '盗贼': {
        'job': '盗贼',
        'imgSrc': '055-Snake01',
        'attack': 220,
        'defend': 130,

        'hp': 100,
        'energy': 80,
        'mp': 10,

        'crit_rate': 1,
        'crit_multi': 1,
        'fanshang_rate': 1,
        'avoid_rate': 1,
        'accurate_rate': 1,
        'suck_rate': 1,
        'suck_percent': 1,
    },

    '大地之灵': {
        'job': '大地之灵',
        'imgSrc': 'tumao',

        main_attr: 'str',

        hp: 549,
        mp: 234,

        str: 21,
        int: 18,
        agi: 17,

        str_lv: 2.9,
        int_lv: 2.1,
        agi_lv: 1.5,

        min_attack: 46,
        max_attack: 56,

        defend: 3.38,

        hp_recover: 0,   //每秒的生命恢复
        mp_recover: 0,
        attack_sp_ratio: 0,//增加x%攻击速度
        mp_recover_ratio: 0, //x% 法力恢复


        'hp': 100,
        'energy': 80,
        'mp': 10,

        'crit_rate': 1,
        'crit_multi': 1,
        'fanshang_rate': 1,
        'avoid_rate': 1,
        'accurate_rate': 1,
        'suck_rate': 1,
        'suck_percent': 1,
    },
}
module.exports = roleConfig
