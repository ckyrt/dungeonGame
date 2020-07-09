var global = require('global')
var dungeonConfig = require('dungeonConfig')

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
        allGrids: {
            default: [],
        },

        canOpenGrids: {
            default: [],
        },

        gridThings: {
            default: {},
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {
    // },

    start() {
        this._initAll()
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
        this._initAll()
    },

    jumpToDungeon:function(dungeonName)
    {
        this._clearScene()
        this._initGrids()
        this._initDungeon(dungeonName)
    },

    _initAll: function () {

        this._initRole()

        this._initGrids()

        this._initDungeon('第一关')
    },

    _initGrids:function()
    {
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
    },

    _initRole:function()
    {
        this.role_ = cc.find("Canvas/role").getComponent('roleScript')
        this.role_.initConfig('战士')
    },

    _initDungeon:function(dungeonName)
    {
        let cfg = dungeonConfig[dungeonName]
        for (var m of cfg.monsters) { 
            let grid = this.getRandomEmptyGrid()
            this.addMonsterToMap(m, grid.x, grid.y)
        }
        for (var m of cfg.items) {
            let grid = this.getRandomEmptyGrid()
            this.addItemToMap(m, grid.x, grid.y)
        }
        for (var m of cfg.gridTypes) {
            let grid = this.getRandomEmptyGrid()
            grid.setGridType(m)
        }
    },

    _getCanOpenGrid:function(x, y)
    {
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
        if(getit != null)
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
        if(getit == null)
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
    },

    addItemToMap: function (name, i, j) {
        let grid = this.getGridByXY(i, j)
        if (null == grid)
            return

        var prefab = cc.instantiate(this.mapItemPrefab)
        this.node.addChild(prefab)
        let mapItemScript = prefab.getComponent('mapItemScript')
        mapItemScript.initConfig(name)
        mapItemScript.setPos(i, j)
    },

    getRandomGrid: function () {
        let i = Math.floor(Math.random() * this.allGrids.length)
        console.log(i, this.allGrids.length, this.allGrids[i])
        return this.allGrids[i]
    },

    getRandomEmptyGrid: function () {
        while (true) {
            let grid = this.getRandomGrid()
            let thingNode = this.getMapThingInXY(grid.x, grid.y)
            let mapItemScript = thingNode == null ? null : thingNode.getComponent('mapItemScript')
            let monsterScript = thingNode == null ? null : thingNode.getComponent('monsterScript')

            if (grid.getGridType() == '' && mapItemScript == null && monsterScript == null)
                return grid
        }
    },

    getGridByXY: function (x, y) {
        var it = this.allGrids.find(function (ele) {
            return ele.getXY().x == x && ele.getXY().y == y
        })
        return it
    },

    _computeDamage: function (attacker, defender) {
        let damage = 0
        let damageType = 'normal'
        //闪避 命中
        let avoid = defender.getAttr('avoid_rate') - attacker.getAttr('accurate_rate')
        if (avoid > 0 && avoid >= global.random(0, 100)) {
            //闪避
            damage = 0
            damageType = 'avoid'
        }
        else {
            //使用带装备的总属性
            damage = attacker.getAttr('attack') - defender.getAttr('defend')
            if (damage < 1) {
                damage = 1
            }

            let critRate = attacker.getAttr('crit_rate')
            let critMulti = attacker.getAttr('crit_multi')
            //是否暴击
            if (critRate > 0 && critRate >= global.random(0, 100)) {
                //暴击
                damage = Math.ceil(damage * (100 + critMulti) / 100)
                damageType = 'crit'
            }

            //吸血计算
            let suck_rate = attacker.getAttr('suck_rate')
            let suck_percent = attacker.getAttr('suck_percent')
            if (suck_rate > 0 && suck_rate >= global.random(0, 100)) {
                //吸血
                let blood = Math.ceil(damage * suck_percent / 100)
                if (blood < 1)
                    blood = 1
                this._executeDamage(attacker, defender, blood, 'suck')
                this._addTextInfo(attacker.getAttr('name') + ' 吸血 ' + blood + ' 点')
            }

            //反伤计算
            let fanshang_rate = defender.getAttr('fanshang_rate')
            if (fanshang_rate > 0 && fanshang_rate >= global.random(0, 100)) {
                //反伤
                damageType = 'fanshang'
            }
        }

        this._executeDamage(attacker, defender, damage, damageType)
        this._addTextInfo(attacker.getAttr('name') + ' 对 ' + defender.getAttr('name') + ' 造成 ' + damage + ' 点伤害')
    },

    _addUnitHp: function (unit, hp) {
        let curHp = unit.getAttr('hp')
        curHp += hp
        unit.setAttr('hp', curHp)
    },

    //执行伤害
    _executeDamage: function (attacker, unit, damage, reason) {
        let x = unit.node.x
        let y = unit.node.y + unit.node.height
        let attackX = attacker.node.x
        let attackY = attacker.node.y + attacker.node.height
        if (reason == 'normal') {
            this._addUnitHp(unit, -damage)
            this._playNumberJump(-damage, x, y, new cc.color(255, 0, 0))
        }
        if (reason == 'crit') {
            this._addUnitHp(unit, -damage)
            this._playNumberJump(-damage, x, y, new cc.color(255, 0, 0))
            this._playNumberJump('暴击', attackX, attackY, new cc.color(255, 255, 0))
        }
        if (reason == 'avoid') {
            this._playNumberJump('闪避', x, y, new cc.color(0, 255, 255))
        }
        if (reason == 'suck') {
            this._addUnitHp(attacker, damage)
            this._playNumberJump('吸血 ' + damage, attackX, attackY, new cc.color(0, 100, 0))
        }
        if (reason == 'fanshang') {
            this._addUnitHp(unit, -damage)
            this._playNumberJump('反伤', x, y, new cc.color(255, 0, 100))

            this._addUnitHp(attacker, -damage)
            this._playNumberJump(-damage, attackX, attackY, new cc.color(255, 0, 0))
        }
    },
    //跳数字
    _playNumberJump: function (txt, x, y, color) {
        var numberJump = cc.instantiate(this.numberJump_prefab)
        this.node.addChild(numberJump)
        numberJump.setPosition(x, y)
        numberJump.getComponent('numberJumpScript').playJump(txt, color)
    },

    _addTextInfo: function (str) {
        this.node.getComponent('info_control').add_tip_item(">" + str)
    },

    setMapThingInXY: function (x, y, thingNode) {
        console.log('setMapThingInXY:', x, y, thingNode)
        this.gridThings[x * 10 + y] = thingNode
    },

    getMapThingInXY: function (x, y) {
        return this.gridThings[x * 10 + y]
    },

    _addMapItemToRole: function (role, mapItemScript) {

        let pos = mapItemScript.getPos()
        let itemName = mapItemScript.itemName
        console.log('click map item x:' + pos.x)
        console.log('click map item y:' + pos.y)

        //从地图删掉
        mapItemScript.deleteFromMap()

        let inventoryScript = cc.find("Canvas/inventory").getComponent('inventoryScript')
        let discardName = inventoryScript.addItem(itemName)
        if (discardName != '') {
            //丢到地上
            this.addItemToMap(discardName, pos.x, pos.y)
        }
    },
});
