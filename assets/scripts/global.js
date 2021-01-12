var global = {
    X_OFFSET: 16,
    Y_OFFSET: 16,
    GRID_WIDTH: 32,
    GRID_HEIGHT: 32,
    spacing: 0,

    DIR_NONE: 0,
    DIR_L: 1,
    DIR_U: 2,
    DIR_R: 3,
    DIR_D: 4,


    connectStatus: 'connected',
    startX: 1,
    startY: 1,
    zIndex: 0,

    getChildByName: function (ele, name) {
        if (ele.name === name) {
            // 先访问根节点, 若找到则返回该节点
            return ele;
        }

        // 否则按从左到右的顺序遍历根节点的每一棵子树
        for (let i = 0; i < ele.children.length; i++) {
            if (this.getChildByName(ele.children[i], name)) {
                // 若找到则返回该节点
                return this.getChildByName(ele.children[i], name);
            };
        }

        // 找不到返回 null
        return null;
    },

    //随机数
    random: function (lower, upper) {
        return Math.round(Math.random() * (upper - lower) + lower)
    },

    getNowTimeStamp: function () {
        var testDate = new Date()
        return testDate.getTime()
    },

    generateUUID: function () {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },

    getBigZIndex: function () {
        return this.zIndex++
    },

    getRealMapPos: function (x, y) {
        return { x: global.X_OFFSET + (global.GRID_WIDTH + global.spacing) * x, y: global.Y_OFFSET + (global.GRID_HEIGHT + global.spacing) * y }
    },

    _findPath: function (item, targetX, targetY) {

        let points = []
        let astar = item.getAstarSearch()
        //a* 寻路

        //如果正在移动 就以下一点为起点
        //否则以当前点为起点
        let starPoint = null
        let nextP = item.getNextPoint()
        if (nextP != null) {
            starPoint = { x: nextP.x, y: nextP.y }
        }
        else {
            starPoint = { x: item.x, y: item.y }
        }

        var endNode = astar.findPath(starPoint.x, starPoint.y, targetX, targetY)
        if (!endNode) {
            console.log("can not find path")
            return null
        }

        while (endNode) {
            points.push({ x: endNode.col, y: endNode.row })
            endNode = endNode.parent
        }
        //points.pop()
        return points
    },

    _checkArrivedX: function (x, item) {
        var pixX = global.X_OFFSET + (global.GRID_WIDTH + global.spacing) * x //- this.gs_.node.x
        if (Math.abs(item.node.x - pixX) < 5) {
            return true
        }
        return false
    },

    _checkArrivedY: function (y, item) {
        var pixY = global.Y_OFFSET + (global.GRID_HEIGHT + global.spacing) * y //- this.gs_.node.y
        if (Math.abs(item.node.y - pixY) < 5) {
            return true
        }
        return false
    },

    _checkArrived: function ({ x, y }, item) {

        //console.log('gs node xy '+this.gs_.node.x+','+this.gs_.node.y)

        if (item.x != x)
            return this._checkArrivedX(x, item)
        if (item.y != y)
            return this._checkArrivedY(y, item)
        return true
    },

    //更新移动动画
    updateWalAnim: function (item, dt) {
        let nextP = item.getNextPoint()
        if (nextP == null)
            return
        var dir = global._getDir(nextP.x, nextP.y, item)
        item.spriteChangeTime_ += dt
        if (item.spriteChangeTime_ > 0.3) {
            var sp = item.node.getComponent(cc.Sprite);//获取组件
            var ws = global._getWalkSprite(dir, item)
            if (ws != null)
                sp.spriteFrame = ws;//更改图片
            item.spriteChangeTime_ = 0
        }
    },

    //实施移动
    _execMove: function (dt, targetX, targetY, item) {
        var dir = global._getDir(targetX, targetY, item)

        //console.log('cur:', item.x, item.y, 'next:', targetX, targetY, 'end:', item.endPosX, item.endPosY, 'dir:', dir)
        //console.log('item.spriteChangeTime_:' + item.spriteChangeTime_)
        item.spriteChangeTime_ += dt
        if (item.spriteChangeTime_ > 0.3) {
            var sp = item.node.getComponent(cc.Sprite);//获取组件
            var ws = global._getWalkSprite(dir, item)
            if (ws != null)
                sp.spriteFrame = ws;//更改图片
            item.spriteChangeTime_ = 0
        }
        var distX = item.speed * dt
        var distY = distX //* this.GRID_HEIGHT / this.GRID_WIDTH

        let moveNode = item.node

        switch (dir) {
            case global.DIR_L:
                moveNode.x -= distX
                break;
            case global.DIR_U:
                moveNode.y += distY
                break;
            case global.DIR_R:
                moveNode.x += distX
                break;
            case global.DIR_D:
                moveNode.y -= distY
                break;
            default:
        }

    },

    _getDir: function (targetX, targetY, item) {
        if (targetX > item.x) {
            return this.DIR_R
        }
        if (targetY > item.y) {
            return this.DIR_U
        }
        if (targetY < item.y) {
            return this.DIR_D
        }
        if (targetX < item.x) {
            return this.DIR_L
        }
    },

    _getWalkSprite: function (dir, item) {
        item.frameNumber_ += 1
        if (item.frameNumber_ > 3)
            item.frameNumber_ = 0

        var sprite
        if (dir == global.DIR_D) {
            sprite = this._getSprite(item.frameNumber_, 0, item)
        }
        else if (dir == global.DIR_L) {
            sprite = this._getSprite(item.frameNumber_, 1, item)
        }
        else if (dir == global.DIR_R) {
            sprite = this._getSprite(item.frameNumber_, 2, item)
        }
        else if (dir == global.DIR_U) {
            sprite = this._getSprite(item.frameNumber_, 3, item)
        }
        return sprite
    },

    //获取移动贴图
    _getSprite: function (i, j, item) {
        if (item.resource_sprite == null)
            return
        var sprite = item.resource_sprite.clone(); // 克隆一张图片
        var width = sprite.getRect().width / 4;
        var height = sprite.getRect().height / 4;
        var x = sprite.getRect().x + i * width;
        var y = sprite.getRect().y + j * height;

        sprite.setRect(new cc.Rect(x, y, width, height));
        return sprite
    },


    //客户端 服务器 装备部位转换
    partToInt: function (part) {
        if (part == 'head')
            return 1001
        if (part == 'l_hand')
            return 1002
        if (part == 'r_hand')
            return 1003
        if (part == 'cloth')
            return 1004
        if (part == 'shoes')
            return 1005
        if (part == 'weapon')
            return 1006
        if (part == 'shield')
            return 1007
    },

    intToPart: function (part) {
        if (part == 1001)
            return 'head'
        if (part == 1002)
            return 'l_hand'
        if (part == 1003)
            return 'r_hand'
        if (part == 1004)
            return 'cloth'
        if (part == 1005)
            return 'shoes'
        if (part == 1006)
            return 'weapon'
        if (part == 1007)
            return 'shield'
    },

    mapIdToScene: function (id) {
        if (id == 1001)
            return 'test2'
        if (id == 1002)
            return 'indoor'
        return id
    },
}

module.exports = global;