
var dungeonConfig = {
    '第一关、奎尔丹纳斯岛': {

        npcs: ['阿尔萨斯·米奈希尔'],
        monsters: ['野猫', '野猫', '野猫', '野猫', '蛤蟆', '蛤蟆', '蛤蟆', '蛤蟆'],
        items: ['攻击之爪', '钥匙', '锁子甲', '治疗药膏'],
        gridTypes: ['luoshi', 'luoshi', 'luoshi', 'locked_door', 'dici_1', 'dici_1', 'dici_1',],
        next: '第二关、永歌森林',
    },

    '第二关、永歌森林': {

        npcs: ['提里奥·弗丁'],
        monsters: ['狐狸', '狐狸', '狐狸', '狐狸', '狂牛', '狂牛', '狂牛', '狂牛'],
        items: ['攻击之爪', '阔剑', '锁子甲', '治疗药膏'],
        gridTypes: ['luoshi', 'luoshi', 'luoshi', 'chukou', 'dici_1', 'dici_1', 'dici_1'],
        next: '第三关、幽魂之地',
    },

    '第三关、幽魂之地': {

        npcs: ['雷克萨'],
        monsters: ['狂牛', '狂牛', '狂牛', '狂牛', '野猪', '野猪', '野猪', '野猪'],
        items: ['攻击之爪', '钥匙', '锁子甲', '治疗药膏'],
        gridTypes: ['luoshi', 'luoshi', 'luoshi', 'locked_door', 'dici_1', 'dici_2', 'dici_1'],
        next: '第四关、东瘟疫之地',
    },

    '第四关、东瘟疫之地': {

        npcs: ['萨尔'],
        monsters: ['灰狼', '灰狼', '灰狼', '灰狼', '熊', '熊', '熊', '熊'],
        items: ['攻击之爪', '阔剑', '锁子甲', '治疗药膏'],
        gridTypes: ['luoshi', 'luoshi', 'luoshi', 'chukou', 'dici_1', 'dici_2', 'dici_2'],
        next: '第五关、西瘟疫之地',
    },

    '第五关、西瘟疫之地': {

        npcs: ['玛法里奥·怒风'],
        monsters: ['熊', '熊', '熊', '熊', '灰狼王', '灰狼王', '灰狼王'],
        items: ['攻击之爪', '钥匙', '锁子甲', '治疗药膏'],
        gridTypes: ['luoshi', 'luoshi', 'luoshi', 'locked_door', 'dici_2', 'dici_2', 'dici_2'],
        next: '第六关、辛特兰',
    },

    '第六关、辛特兰': {

        npcs: ['耐奥祖'],
        monsters: ['伐木工', '伐木工', '伐木工', '伐木工', '三尾狐', '三尾狐', '三尾狐', '伐木工头'],
        items: ['攻击之爪', '阔剑', '锁子甲', '治疗药膏'],
        gridTypes: ['luoshi', 'luoshi', 'luoshi', 'chukou', 'dici_2', 'dici_2', 'dici_3'],
        next: '第七关、费伍德森林',
    },

    '第七关、费伍德森林': {

        npcs: ['奥格瑞姆'],
        monsters: ['血狼', '血狼', '血狼', '血狼', '花熊', '花熊', '花熊', '花熊'],
        items: ['攻击之爪', '钥匙', '锁子甲', '治疗药膏'],
        gridTypes: ['luoshi', 'luoshi', 'luoshi', 'locked_door', 'dici_2', 'dici_2', 'dici_3'],
        next: '第九关、凄凉之地',
    },

    '第九关、凄凉之地': {

        npcs: ['泰兰德'],
        monsters: ['血狼王', '血狼王', '血狼王', '血狼王', '大猿', '大猿', '大猿'],
        items: ['阔剑', '阔剑', '锁子甲', '治疗药膏'],
        gridTypes: ['luoshi', 'luoshi', 'luoshi', 'chukou', 'dici_2', 'dici_3', 'dici_3'],
        next: '第十关、黑海岸',
    },

    '第十关、黑海岸': {

        npcs: ['欺诈者基尔加丹'],
        monsters: ['小僵尸', '小僵尸', '小僵尸', '小僵尸', '小蓝鬼', '小蓝鬼', '小蓝鬼', '小蓝鬼'],
        items: ['阔剑', '阔剑', '锁子甲', '治疗药膏'],
        gridTypes: ['luoshi', 'luoshi', 'luoshi', 'locked_door', 'dici_3', 'dici_3', 'dici_3'],
        next: '第十一关、荒废的寺庙',
    },

    '第十一关、荒废的寺庙': {
        npcs: ['欺诈者基尔加丹'],
        monsters: ['舞女', '舞女', '舞女', '舞女', '破解僧', '破解僧', '破解僧', '破解僧'],
        gridTypes: ['luoshi', 'luoshi', 'luoshi', 'locked_door', 'dici_3', 'dici_3', 'dici_3'],
        next: '第十一关、山贼营寨',
    },

    '第十二关、山贼营寨': {
        npcs: ['欺诈者基尔加丹'],
        monsters: ['大块头山贼', '大块头山贼', '大块头山贼', '大块头山贼', '巨斧山贼', '巨斧山贼', '巨斧山贼', '巨斧山贼'],
        gridTypes: ['luoshi', 'luoshi', 'luoshi', 'locked_door', 'dici_3', 'dici_3', 'dici_3'],
    },


    '1v1竞技场': {

        npcs: [],
        monsters: [],
        items: [],
        gridTypes: [],
    },
}
module.exports = dungeonConfig
