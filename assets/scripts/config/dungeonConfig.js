
var dungeonConfig = {
    '第一关':{
        //哪些格子有哪些怪物 道具 格子类型
        monsters:['兽人','兽人','兽人','兽人','野猪','蜥蜴人','僵尸'],
        items:['阔剑', '阔剑', '锁子甲', '治疗药膏'],
        gridTypes:['luoshi', 'luoshi', 'luoshi', 'chukou', 'dici', 'dici', 'dici', 'nu_canfire', 'nu_canfire'],
    },

    '第二关':{
        //哪些格子有哪些怪物 道具 格子类型
        monsters:['骷髅兵','烈火鸟','食人魔','泰山','路西法'],
        items:['斧头', '斧头'],
        gridTypes:['luoshi', 'luoshi', 'luoshi', 'chukou', 'dici', 'dici', 'dici'],
    },
    
}
module.exports = dungeonConfig
