var global = require('global')
//var mapConfig = require('mapConfig')

cc.Class({
    extends: cc.Component,
    editor: {
        // executeInEditMode: true,
    },
    properties: {
        //grid: cc.Node,
        //map: cc.Node,
        // startPos:cc.v2(0,0)
    },

    onLoad: function () {
        //this.gridWidth = 32//this.grid.width;   //节点宽度
        //this.gridHeight = 32//this.grid.height; //节点高度
        //邻居节点pos
        this.neighborPos = [
            { row: 0, col: 1 },
            { row: 0, col: -1 },
            { row: 1, col: 0 },
            { row: -1, col: 0 },

            //{ row: -1, col: -1 },
            //{ row: -1, col: 1 },
            //{ row: 1, col: -1 },
            //{ row: 1, col: 1 },
        ]

        //节点类型
        this.NodeType = {
            road: 0,
            wall: 1,
            start: 2,
            target: 3,
        }
    },

    start() {

    },

    initMap(gridData) {

        //this.map.removeAllChildren();
        //用于存储界面的节点
        this.nodeMap = {};
        //地图 阻挡
        this._map = gridData.reverse()

        //let color;
        for (var row = 0; row < this._map.length; ++row) {
            for (var col = 0; col < this._map[row].length; ++col) {
                let e = this._map[row][col]
                if (e == this.NodeType.wall) { //墙
                    //let grid = cc.instantiate(this.grid);
                    //grid.parent = this.map;
                    //grid.setPosition(col * (this.gridWidth + global.spacing), row * (this.gridHeight + global.spacing));
                    //color = new cc.Color(0, 255, 0);
                    //grid.color = color;
                } else if (e == this.NodeType.start) { //起点
                    //color = new cc.Color(123, 123, 123);
                    //this.startNode = { row, col }
                } else if (e == this.NodeType.target) { //终点
                    //color = new cc.Color(123, 0, 123);
                    //this.targetNode = { row, col }
                } else {
                    //color = new cc.Color(22, 22, 24);
                }


                //存储界面节点
                //this.nodeMap[row + "_" + col] = grid;
            }
        }
    },

    findPath(curX, curY, targetX, targetY) {

        if (targetX < 0 || targetX >= 40)
            return
        if (targetY < 0 || targetY >= 30)
            return
        // if (this.targetNode == null) {
        //     return console.log("没有目标节点")
        // }
        let row = curY
        let col = curX
        this.startNode = { row, col }
        //this._map[row][col] = this.NodeType.start
        //let grid = this.nodeMap[row + "_" + col]

        row = targetY
        col = targetX
        this.targetNode = { row, col }
        //this._map[row][col] = this.NodeType.target
        //grid = this.nodeMap[row + "_" + col]
        //终点涂色
        //grid.color = new cc.Color(123, 0, 123)


        //console.time("time:")
        let currentNode = this.startSearch();
        //console.timeEnd("time:")
        return currentNode
    },

    _printPath: function (currentNode) {
        //打印路径：
        while (currentNode) {
            console.log(currentNode);
            this.setColor(currentNode, new cc.Color(255, 125, 125));
            currentNode = currentNode.parent;
        }
    },

    //开始搜索路径
    startSearch() {
        this.GridLists = [];            //待访问列表
        this.visitedGridLists = [];    //已经访问过的节点
        this.startNode.stepCount = 0; //记步
        this.computeWeight(this.startNode);//计算开始位置权重
        this.GridLists[0] = this.startNode;
        while (this.GridLists.length > 0) {
            //查找最小权重的节点
            let currentGrid = this.findMinWeight();
            // this.setColor(currentGrid,new cc.Color(125,125,125));
            //查找并且添加邻居节点到待访问列表
            this.findAndAddNeighborNode(currentGrid);
            //把当前节点添加到已访问列表
            this.addNodeToList(this.visitedGridLists, currentGrid);
            //判断是否是目标
            if (this.isTarget(currentGrid)) {
                return currentGrid
            }
        }
        return null;
    },

    addNodeToList(list, node) {
        if (!list[node.row]) {
            list[node.row] = [];
        }
        list[node.row][node.col] = node;
    },


    //查找并且添加邻居节点到待访问列表
    findAndAddNeighborNode(node) {
        for (var i = 0, len = this.neighborPos.length; i < len; i++) {
            const element = this.neighborPos[i];
            let row = node.row + element.row;
            let col = node.col + element.col;
            //边界处理
            if (row < this._map.length && row >= 0 && col < this._map[0].length && col >= 0) {
                let neighborNode = { row, col };
                // if (this._map[row][col] == 0) {
                //     continue;
                // }
                if (this._canNotPass(col, row)) {
                    continue;
                }
                //如果未访问就添加到带访问列表
                if ((!this.visitedGridLists[row] || !this.visitedGridLists[row][col]) && !this.isExistList(this.GridLists, neighborNode)) {
                    //设置父节点，为了存储最终路径
                    neighborNode.parent = node;
                    //计算权重
                    let sum = element.row + element.col
                    let w = (sum == 2 || sum == -2 || sum == 0) ? 1.4 : 1

                    neighborNode.stepCount = node.stepCount + w;
                    this.computeWeight(neighborNode);
                    this.GridLists.push(neighborNode);
                    // this.addNodeToList(this.GridLists,neighborNode)
                }
            }
        }
    },

    isTarget(currentGrid) {
        if (currentGrid.row == this.targetNode.row && currentGrid.col == this.targetNode.col) {
            return true;
        }
        return false
    },

    //查找最小权重的节点
    findMinWeight() {
        let minWeightNode = this.GridLists[0];
        let minIndex = 0;
        for (var i = 0, len = this.GridLists.length; i < len; i++) {
            for (var j = 0, _len = this.GridLists[i].length; j < _len; j++) {
                const node = this.GridLists[i][j];
                if (minWeightNode.weight > node.weight) {
                    minWeightNode = node
                    minIndex = index
                }
            }
        }
        this.GridLists.splice(minIndex, 1);
        if (!minWeightNode) {
            debugger;
        }
        return minWeightNode;
    },


    /**计算权重
     * 公式：
     * 
     * F = G + H
     * G: 从起点到当前格子的成本，也就是步数
     * H: 从当前格子到目标的距离（不考虑障碍的情况下）。
     * 
     * F 值越小，就越接近目标，优先考虑最小的。 
     */
    computeWeight(node) {
        let horizontalPathLength = Math.abs(this.targetNode.col - node.col);
        let verticalPathLength = Math.abs(this.targetNode.row - node.row);
        let H = horizontalPathLength + verticalPathLength;
        //F = H + G
        node.weight = H + node.stepCount;
        // node.weight = H ;
        return node.weight;
    },

    isExistList(list, node) {
        for (var i = 0, len = list.length; i < len; i++) {
            const element = list[i];
            if (element.row == node.row && element.col == node.col) {
                return true;
            }
        }
        return false;
    },


    setColor(node, color) {
        // let gridNode = this.nodeMap[node.row + "_" + node.col]
        // if (gridNode) {
        //     gridNode.color = color;
        // }
    },

    //得到位置的阻挡数据 1 2 3
    getGridDataByXY: function (x, y) {
        return this._map[y][x]
    },

    _canNotPass: function (x, y) {
        let v = this._map[y][x]
        return (v & 2) > 0 || (v & 1) == 0
    },

    isGridShadow: function (x, y) {
        let v = this._map[y][x]
        return (v & 4) > 0
    },

    //得到半径内的所有可行走点
    getPosesInRadius: function (center_x, center_y, r) {
        let ret = []
        for (var row = 0; row < this._map.length; ++row) {
            for (var col = 0; col < this._map[row].length; ++col) {
                let dis = Math.abs(center_x - col) + Math.abs(center_y - row)
                if (dis <= r && !this._canNotPass(col, row)) {
                    ret.push({ 'x': col, 'y': row })
                }
            }
        }
        return ret
    },
});
