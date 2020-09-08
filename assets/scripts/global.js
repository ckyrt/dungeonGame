var itemConfig = require('itemConfig')
var global = {

    connectStatus:'connected',
    startX:1,
    startY:1,

    getChildByName: function(ele, name) {
        if (ele.name === name) {
            // 先访问根节点, 若找到则返回该节点
            return ele;
        }
 
        // 否则按从左到右的顺序遍历根节点的每一棵子树
        for (let i = 0; i < ele.children.length; i++) {
            if(this.getChildByName(ele.children[i], name)) {
                // 若找到则返回该节点
                return this.getChildByName(ele.children[i], name);
            };
        }
 
        // 找不到返回 null
        return null;
    },

    //随机数
    random:function(lower, upper) 
    {
        return Math.round(Math.random()*(upper-lower)+lower)         
    },

    getNowTimeStamp:function()
    {
        var testDate = new Date()
        return testDate.getTime()
    },
    
}

module.exports = global;