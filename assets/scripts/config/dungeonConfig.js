
var dungeonConfig = {
    '第一关':{
        //哪些格子有哪些怪物 道具 格子类型
        monsters:['野猫','蛤蟆','狐狸','狂牛'],
        items:['斧头', '树叶', '野草', '血'],
        gridTypes:['luoshi', 'luoshi', 'luoshi', 'chukou', 'dici', 'dici', 'dici', 'nu_canfire', 'nu_canfire'],
    },

    '第二关':{
        //哪些格子有哪些怪物 道具 格子类型
        monsters:['野猪','野猪','野猪','野猪'],
        items:['斧头', '斧头'],
        gridTypes:['luoshi', 'luoshi', 'luoshi', 'chukou', 'dici', 'dici', 'dici'],
    },
    
}
module.exports = dungeonConfig
