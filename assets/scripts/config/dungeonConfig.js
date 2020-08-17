
var dungeonConfig = {
    '第一关、奎尔丹纳斯岛':{
        
        npcs:['阿尔萨斯·米奈希尔'],
        monsters:['兽人','野猪','兽人','野猪','兽人','野猪','兽人'],
        items:['攻击之爪', '阔剑', '锁子甲', '治疗药膏'],
        gridTypes:['luoshi', 'luoshi', 'luoshi', 'chukou', 'dici_1', 'dici_1', 'dici_1', 'nu_canfire', 'nu_canfire'],
        next:'第二关、永歌森林',
    },

    '第二关、永歌森林':{
        
        npcs:['提里奥·弗丁'],
        monsters:['野猪','蜥蜴人','野猪','蜥蜴人','野猪','蜥蜴人','野猪'],
        items:['攻击之爪', '阔剑', '锁子甲', '治疗药膏'],
        gridTypes:['luoshi', 'luoshi', 'luoshi', 'chukou', 'dici_1', 'dici_1', 'dici_1'],
        next:'第三关、幽魂之地',
    },

    '第三关、幽魂之地':{
        
        npcs:['雷克萨'],
        monsters:['蜥蜴人','僵尸','蜥蜴人','僵尸','蜥蜴人','僵尸','蜥蜴人'],
        items:['攻击之爪', '阔剑', '锁子甲', '治疗药膏'],
        gridTypes:['luoshi', 'luoshi', 'luoshi', 'chukou', 'dici_1', 'dici_2', 'dici_1'],
        next:'第四关、东瘟疫之地',
    },

    '第四关、东瘟疫之地':{
        
        npcs:['萨尔'],
        monsters:['骷髅兵','僵尸','骷髅兵','僵尸','骷髅兵','僵尸','骷髅兵'],
        items:['攻击之爪', '阔剑', '锁子甲', '治疗药膏'],
        gridTypes:['luoshi', 'luoshi', 'luoshi', 'chukou', 'dici_1', 'dici_2', 'dici_2'],
        next:'第五关、西瘟疫之地',
    },

    '第五关、西瘟疫之地':{
        
        npcs:['玛法里奥·怒风'],
        monsters:['骷髅兵','烈火鸟','骷髅兵','烈火鸟','骷髅兵','烈火鸟','骷髅兵'],
        items:['攻击之爪', '阔剑', '锁子甲', '治疗药膏'],
        gridTypes:['luoshi', 'luoshi', 'luoshi', 'chukou', 'dici_2', 'dici_2', 'dici_2'],
        next:'第六关、辛特兰',
    },

    '第六关、辛特兰':{

        npcs:['耐奥祖'],
        monsters:['食人魔','烈火鸟','食人魔','烈火鸟','食人魔','烈火鸟','食人魔'],
        items:['攻击之爪', '阔剑', '锁子甲', '治疗药膏'],
        gridTypes:['luoshi', 'luoshi', 'luoshi', 'chukou', 'dici_2', 'dici_2', 'dici_3'],
        next:'第七关、费伍德森林',
    },

    '第七关、费伍德森林':{

        npcs:['奥格瑞姆'],
        monsters:['食人魔','泰山','食人魔','泰山','食人魔','泰山','食人魔'],
        items:['攻击之爪', '阔剑', '锁子甲', '治疗药膏'],
        gridTypes:['luoshi', 'luoshi', 'luoshi', 'chukou', 'dici_2', 'dici_2', 'dici_3'],
        next:'第九关、凄凉之地',
    },

    '第九关、凄凉之地':{

        npcs:['泰兰德'],
        monsters:['路西法','泰山','路西法','泰山','路西法','泰山','路西法'],
        items:['阔剑', '阔剑', '锁子甲', '治疗药膏'],
        gridTypes:['luoshi', 'luoshi', 'luoshi', 'chukou', 'dici_2', 'dici_3', 'dici_3'],
        next:'第十关、黑海岸',
    },

    '第十关、黑海岸':{

        npcs:['欺诈者基尔加丹'],
        monsters:['路西法','路西法','路西法','路西法','路西法','路西法','路西法'],
        items:['阔剑', '阔剑', '锁子甲', '治疗药膏'],
        gridTypes:['luoshi', 'luoshi', 'luoshi', 'chukou', 'dici_3', 'dici_3', 'dici_3'],
    },
    
}
module.exports = dungeonConfig