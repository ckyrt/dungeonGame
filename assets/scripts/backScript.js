var global = require('global')
var dungeonConfig = require('dungeonConfig')
var itemConfig = require('itemConfig')
var npcConfig = require('npcConfig')

var MsgID = require('MsgID')

cc.Class({
    extends: cc.Component,

    properties: {

        gridPrefab: {
            type: cc.Prefab,
            default: null,
        },
        monsterPrefab: {
            type: cc.Prefab,
            default: null,
        },
        npcPrefab: {
            type: cc.Prefab,
            default: null,
        },
        mapItemPrefab: {
            type: cc.Prefab,
            default: null,
        },
        mapXPrefab: {
            type: cc.Prefab,
            default: null,
        },
        numberJump_prefab: {
            type: cc.Prefab,
            default: null,
        },
        ui_root_prefab: {
            type: cc.Prefab,
            default: null,
        },
        allGrids: {
            default: [],
        },

        canOpenGrids: {
            default: [],
        },

        gridThings: {
            default: {},
        },

        //等待选择目标
        chooseTargetFunc: null,
    },

    setChooseTargetFunc: function (func) {
        this.chooseTargetFunc = func
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {
    // },

    start() {

        //ui
        var prefab = cc.instantiate(this.ui_root_prefab)
        cc.find("Canvas").addChild(prefab)

        cc.find("Canvas/UI").getComponent('UIRootScript').setInterval(2, 1,
            () => {

                let dungeonName = cc.find("Canvas/UI").getComponent('UIRootScript').curDungeonName
                if (dungeonName == null)
                    this._initDungeon('第一关、奎尔丹纳斯岛')
                else
                    this._initDungeon(dungeonName)
            })

        //监听 生物点击 事件
        this.node.on("clickCreatureSig", (event) => {
            let data = event.getUserData()
            let creature = data.creature

            console.log('点击了生物', data)

            let dungeonName = cc.find("Canvas/UI").getComponent('UIRootScript').curDungeonName
            if (dungeonName == '1v1竞技场') {
                //发给服务器
                let arena1v1 = global.getChildByName(this.node, 'arena').getComponent('Arena1v1')
                arena1v1.sendUserCmd('attack', creature.getAttr('name'))
                return
            }

            if (creature.getAttr != null && creature.getAttr('hp') != null) {
                if (this.chooseTargetFunc != null) {
                    cc.find("Canvas/UI").getComponent('UIRootScript')._addTextInfo('选择了 ' + creature.getAttr('name'))
                    this.chooseTargetFunc(creature)
                    this.setChooseTargetFunc(null)
                }
                else {
                    if (creature.isRole == null) {

                        let musicScript = this.node.getComponent('musicScript')
                        musicScript.playEffect('hit')

                        this._computeDamage(global.role_, creature)
                        this._computeDamage(creature, global.role_)
                    }
                }
            }

        })
    },
    // update (dt) {},

    //清除所有
    _clearScene: function () {
        for (var i = 0; i < this.allGrids.length; ++i) {
            let g = this.allGrids[i]
            g.node.destroy()
        }
        this.allGrids = []

        for (var i = 0; i < this.canOpenGrids.length; ++i) {
            let g = this.canOpenGrids[i]
            g.node.destroy()
        }
        this.canOpenGrids = []
        this.gridThings = {}

        //shadow层 clear
        let shadowScript = cc.find("Canvas/shadowRoot").getComponent('shadowScript')
        shadowScript.restart()

        //xLayer层 clear
        let xLayer = cc.find("Canvas/xLayer")
        xLayer.removeAllChildren()
    },

    restart: function () {

        this._clearScene()
        cc.find("Canvas/UI").getComponent('UIRootScript')._initRole()
        //this._initInventory()
        this._initDungeon('第一关、奎尔丹纳斯岛')
    },

    jumpToNextDungeon: function () {
        let dungeonName = cc.find("Canvas/UI").getComponent('UIRootScript').curDungeonName
        let curCfg = dungeonConfig[dungeonName]
        this.jumpToDungeon(curCfg.next)
    },

    jumpToDungeon: function (dungeonName) {
        this._clearScene()
        this._initDungeon(dungeonName)
    },

    _initInventory: function (items = []) {
        console.log(items)
        //清除inventory道具
        let inventoryScript = cc.find("Canvas/UI/inventory").getComponent('inventoryScript')
        inventoryScript.clearAll()
        for (var i = 0; i < items.length; ++i) {
            inventoryScript._addItemToPos(items[i], i + 1)
        }
        inventoryScript._refreshShow()
    },

    _initDungeon: function (dungeonName) {
        for (var i = -3; i < 4; ++i) {
            for (var j = -3; j < 4; ++j) {
                let prefab = cc.instantiate(this.gridPrefab)
                this.node.addChild(prefab)
                //prefab.parent = this.node
                let grid = prefab.getComponent('mapGridScript')
                grid.setXY(i, j)
                this.allGrids.push(grid)
            }
        }

        cc.find("Canvas/UI").getComponent('UIRootScript').curDungeonName = dungeonName
        cc.find("Canvas/UI/title/dungeonName").getComponent(cc.Label).string = dungeonName

        let cfg = dungeonConfig[dungeonName]
        for (var m of cfg.monsters) {
            let grid = this.getRandomEmptyGrid()
            this.addMonsterToMap(m, grid.x, grid.y)
        }
        for (var m of cfg.npcs) {
            let grid = this.getRandomEmptyGrid()
            this.addNpcToMap(m, grid.x, grid.y)
        }

        for (var m of cfg.items) {
            let grid = this.getRandomEmptyGrid()
            this.addItemToMap(itemConfig.createItemEntity(m), grid.x, grid.y)
        }
        for (var m of cfg.gridTypes) {
            let grid = this.getRandomEmptyGrid()
            grid.setGridType(m)
        }

        //随机open一个位置
        cc.find("Canvas/UI").getComponent('UIRootScript').setInterval(1, 1,
            () => {
                let shadowScript = cc.find("Canvas/shadowRoot").getComponent('shadowScript')
                let grid = this.getRandomEmptyGrid()
                shadowScript.openZone(grid.x, grid.y, true)
            })

        this.getComponent('musicScript').onEnterNewDungeon()
    },

    _getCanOpenGrid: function (x, y) {
        var getit = this.canOpenGrids.find(function (ele) {
            return ele.x == x && ele.y == y
        })

        if (getit == null)
            return null
        return getit
    },

    addCanOPenGrid: function (x, y) {
        if (x < -3 || x >= 4 || y < -3 || y >= 4)
            return
        let getit = this._getCanOpenGrid(x, y)
        //已存在
        if (getit != null)
            return

        let prefab = cc.instantiate(this.gridPrefab)
        this.node.addChild(prefab)
        let grid = prefab.getComponent('mapGridScript')
        grid.setXY(x, y)
        grid.setGridType('can_explore')
        this.canOpenGrids.push(grid)
    },

    deleteCanOpenGrid: function (x, y) {

        let getit = this._getCanOpenGrid(x, y)
        if (getit == null)
            return

        var index = this.canOpenGrids.indexOf(getit)
        this.canOpenGrids.splice(index, 1)
        getit.node.destroy()
    },

    addMonsterToMap: function (name, i, j) {
        let grid = this.getGridByXY(i, j)
        if (null == grid)
            return


        var prefab = cc.instantiate(this.monsterPrefab)
        this.node.addChild(prefab)
        let monsterScript = prefab.getComponent('monsterScript')
        monsterScript.initConfig(name)
        monsterScript.setPos(i, j)
        return monsterScript
    },

    addNpcToMap: function (name, i, j) {
        let grid = this.getGridByXY(i, j)
        if (null == grid)
            return


        var prefab = cc.instantiate(this.npcPrefab)
        this.node.addChild(prefab)
        let npcScript = prefab.getComponent('npcScript')
        npcScript.initConfig(name)
        npcScript.setPos(i, j)
    },

    addItemToMap: function (entityItem, i, j) {
        let name = entityItem.name
        let grid = this.getGridByXY(i, j)
        if (null == grid)
            return

        var prefab = cc.instantiate(this.mapItemPrefab)
        this.node.addChild(prefab)
        let mapItemScript = prefab.getComponent('mapItemScript')
        mapItemScript.initMapItem(itemConfig.copyItemEntity(entityItem))
        mapItemScript.setPos(i, j)
    },

    getRandomGrid: function () {
        let i = global.random(0, this.allGrids.length - 1)
        return this.allGrids[i]
    },

    getRandomEmptyGrid: function (gridType = '') {
        //''        表示未开发的空的格子
        //'normal'  表示已开发的空的格子
        let emttyGrids = []
        for (var i = 0; i < this.allGrids.length; ++i) {
            let grid = this.allGrids[i]

            let thingNode = this.getMapThingInXY(grid.x, grid.y)
            let mapItemScript = thingNode == null ? null : thingNode.getComponent('mapItemScript')
            let monsterScript = thingNode == null ? null : thingNode.getComponent('monsterScript')
            let npcScript = thingNode == null ? null : thingNode.getComponent('npcScript')

            if (grid.getGridType() == gridType && mapItemScript == null && monsterScript == null && npcScript == null) {
                emttyGrids.push(grid)
            }
        }
        if (emttyGrids.length < 1) {
            console.log('not found an empty grid')
            return null
        }
        let k = global.random(0, emttyGrids.length - 1)
        return emttyGrids[k]
    },

    getGridByXY: function (x, y) {
        var it = this.allGrids.find(function (ele) {
            let xy = ele.getXY()
            return xy.x == x && xy.y == y
        })
        return it
    },

    setMapThingInXY: function (x, y, thingNode) {
        //console.log('setMapThingInXY:', x, y, thingNode)
        this.gridThings[x * 10 + y] = thingNode
    },

    getMapThingInXY: function (x, y) {
        return this.gridThings[x * 10 + y]
    },

    _addMapItemToRole: function (role, mapItemScript) {

        let pos = mapItemScript.getPos()
        let entity = mapItemScript.entity
        console.log('click map item x:' + pos.x)
        console.log('click map item y:' + pos.y)

        //从地图删掉
        mapItemScript.deleteFromMap()

        // let inventoryScript = cc.find("Canvas/UI/inventory").getComponent('inventoryScript')
        // let discardItem = inventoryScript.addItem(itemConfig.copyItemEntity(entity))
        // if (discardItem.name != null) {
        //     //丢到地上
        //     this.addItemToMap(itemConfig.copyItemEntity(discardItem), pos.x, pos.y)
        // }
        let bagScript = cc.find("Canvas/UI/bag").getComponent('bagScript')
        bagScript.addItem(itemConfig.copyItemEntity(entity))
        cc.find("Canvas/UI").getComponent('UIRootScript')._addTextInfo('获得 ' + entity.name)
    },

});
