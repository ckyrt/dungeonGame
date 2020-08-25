var global = require('global')
var dungeonConfig = require('dungeonConfig')
var itemConfig = require('itemConfig')
var npcConfig = require('npcConfig')
var jsClientScript = require('jsClientScript')
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

    setInterval: function (interval/*秒*/, repeat, func) {
        var delay = 0
        this.schedule(function () {
            func()
        }, interval, repeat - 1, delay)
    },

    start() {

        this.parseLoginData()

        //存档
        let saveBtn = cc.find("Canvas/saveBtn")
        saveBtn.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                this.saveDataToServer()
            }, this)
        //排行榜
        let rankBtn = cc.find("Canvas/rankBtn")
        rankBtn.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                let rankPanelScript = cc.find("Canvas/rankPanel").getComponent('rankPanelScript')
                rankPanelScript.openPanel()
            }, this)

        //竞技场
        let arenaBtn = cc.find("Canvas/arenaBtn")
        arenaBtn.on(cc.Node.EventType.TOUCH_START,
            function (t) {
                let arenaPanelScript = cc.find("Canvas/arenaPanel").getComponent('arenaPanelScript')
                arenaPanelScript.openPanel()
            }, this)

        this._initRole(global.loginData)
        this._initInventory(global.loginData == null ? [] : global.loginData.items)

        if (this.curDungeonName == null)
            this._initDungeon('第一关、奎尔丹纳斯岛')
        else
            this._initDungeon(this.curDungeonName)

        //监听 生物点击 事件
        this.node.on("clickCreatureSig", function (event) {
            let data = event.getUserData()
            let creature = data.creature

            console.log('点击了生物', data)

            if (creature.getAttr != null && creature.getAttr('hp') != null) {
                if (this.chooseTargetFunc != null) {
                    this._addTextInfo('选择了 ' + creature.getAttr('name'))
                    this.chooseTargetFunc(creature)
                    this.setChooseTargetFunc(null)
                }
                else {
                    if (creature.isRole == null) {

                        let musicScript = this.node.getComponent('musicScript')
                        musicScript.playEffect('hit')

                        this._computeDamage(this.role_, creature)
                        this._computeDamage(creature, this.role_)
                    }
                }
            }

        }, this)

        //三秒后给用户自动存一下
        this.setInterval(3, 1,
            () => {
                this.saveDataToServer()
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
        this._initRole()
        this._initInventory()
        this._initDungeon('第一关、奎尔丹纳斯岛')
    },

    jumpToNextDungeon: function () {
        let curCfg = dungeonConfig[this.curDungeonName]
        this.jumpToDungeon(curCfg.next)
    },

    jumpToDungeon: function (dungeonName) {
        this._clearScene()
        this._initDungeon(dungeonName)
    },

    _initInventory: function (items = []) {
        console.log(items)
        //清除inventory道具
        let inventoryScript = cc.find("Canvas/inventory").getComponent('inventoryScript')
        inventoryScript.clearAll()
        for (var i = 0; i < items.length; ++i) {
            inventoryScript._addItemToPos(items[i], i + 1)
        }
        inventoryScript._refreshShow()
    },

    _initRole: function (roleData = null) {
        this.role_ = cc.find("Canvas/role").getComponent('roleScript')
        this.role_.initConfig('尤涅若', roleData)
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

        this.curDungeonName = dungeonName
        cc.find("Canvas/title/dungeonName").getComponent(cc.Label).string = dungeonName

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
        this.setInterval(1, 1,
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

    _computeDamage: function (attacker, defender) {
        if (attacker == null || defender == null) {
            comnsole.log('one fighter is null')
            return
        }
        let damage = 0
        let damageType = 'normal'
        //闪避 命中

        //闪避
        let avoid = defender.getAttr('avoid_rate')// - attacker.getAttr('accurate_rate')
        if (avoid > 0 && avoid >= global.random(0, 100)) {
            //自身闪避
            damageType = 'avoid'
        }
        else {
            //道具闪避
            if (defender.isRole != null && defender.isRole() == true) {
                let inventoryScript = cc.find("Canvas/inventory").getComponent('inventoryScript')
                let isAvoid = inventoryScript.getRatioAttr('avoid')
                if (isAvoid > 0) {
                    damageType = 'avoid'
                }
            }
        }

        if (damageType == 'avoid') {
            damage = 0
        }
        else {
            //使用带装备的总属性

            //护甲减掉的伤害
            let defend = defender.getAttr('defend')

            let hujia_defend = 0
            if (defend >= 0)
                hujia_defend = defend * 0.06 / (1 + 0.06 * defend)
            else
                hujia_defend = Math.pow(0.94, -1 * defend) - 1
            damage = attacker.getAttr('attack') * (1 - hujia_defend)

            damage = Math.floor(damage)

            console.log('attack', attacker.getAttr('attack'))
            console.log('defend', defender.getAttr('defend'))

            if (damage < 1) {
                damage = 1
            }

            //自身暴击计算
            let critRate = attacker.getAttr('crit_rate')
            let critMulti = attacker.getAttr('crit_multi')
            if (critRate > 0 && critRate >= global.random(0, 100)) {
                damage = Math.ceil(damage * critMulti)
                damageType = 'crit'
            }
            else {
                //道具暴击计算
                //如果attacker是玩家 计算装备的暴击
                if (attacker.isRole != null && attacker.isRole() == true) {
                    let inventoryScript = cc.find("Canvas/inventory").getComponent('inventoryScript')
                    critMulti = inventoryScript.getRatioAttr('crit')
                    if (critMulti > 0) {
                        damage = Math.ceil(damage * critMulti)
                        damageType = 'crit'
                    }
                }
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

        let xy = unit.getSwyXY()
        this._playNumberJump(hp, xy.x, xy.y, new cc.color(255, 255, 255))
    },

    //执行伤害
    _executeDamage: function (attacker, unit, damage, reason) {
        let xy = unit.getSwyXY()
        let x = xy.x
        let y = xy.y
        let at_xy = attacker.getSwyXY()
        let attackX = at_xy.x
        let attackY = at_xy.y
        if (reason == 'dici') {
            this._addUnitHp(unit, -damage)
        }
        if (reason == 'normal') {
            //如果unit是玩家 计算一下伤害格挡
            if (unit.isRole != null && unit.isRole() == true) {
                let inventoryScript = cc.find("Canvas/inventory").getComponent('inventoryScript')
                let gedang_value = inventoryScript.getRatioAttr('gedang')
                damage -= gedang_value
                if (damage < 1)
                    damage = 1
            }
            this._addUnitHp(unit, -damage)
        }
        if (reason == 'mofa') {
            this._addUnitHp(unit, -damage)
        }
        if (reason == 'crit') {
            this._addUnitHp(unit, -damage)
            this._playNumberJump('暴击!', attackX, attackY, new cc.color(255, 255, 0))
        }
        if (reason == 'avoid') {
            this._playNumberJump('miss', attackX, attackY, new cc.color(0, 255, 255), 20)
        }
        if (reason == 'suck') {
            this._addUnitHp(attacker, damage)
            this._playNumberJump('吸血 ' + damage, attackX, attackY, new cc.color(0, 100, 0))
        }
        if (reason == 'fanshang') {
            this._addUnitHp(unit, -damage)
            this._playNumberJump('反伤', x, y, new cc.color(255, 0, 100))

            this._addUnitHp(attacker, -damage)
        }
    },
    //跳数字
    _playNumberJump: function (txt, x, y, color, fontSize = 40) {

        console.log('_playNumberJump', x, y)
        var numberJump = cc.instantiate(this.numberJump_prefab)
        let xLayer = cc.find("Canvas/effect")
        xLayer.addChild(numberJump)
        numberJump.setPosition(x, y)
        numberJump.getComponent('numberJumpScript').playJump(txt, color, fontSize)
    },

    _addTextInfo: function (str) {
        this.node.getComponent('info_control').add_tip_item(">" + str)
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

        let inventoryScript = cc.find("Canvas/inventory").getComponent('inventoryScript')
        let discardItem = inventoryScript.addItem(itemConfig.copyItemEntity(entity))
        if (discardItem.name != null) {
            //丢到地上
            this.addItemToMap(itemConfig.copyItemEntity(discardItem), pos.x, pos.y)
        }
    },

    saveDataToServer: function () {

        console.log('存数据', global.roleName, global.loginData)


        var msg = {}
        msg.msg_id = MsgID.SAVE_DATA
        //名字
        msg.name = global.roleName
        //第几关
        msg.guanka = this.curDungeonName
        //玩家等级
        msg.level = this.role_.getAttr('level')
        //玩家经验
        msg.exp = this.role_.getAttr('exp')
        //玩家道具
        msg.items = cc.find("Canvas/inventory").getComponent('inventoryScript').getAllItems()
        //玩家金钱
        msg.coin = this.role_.getAttr('coin')
        jsClientScript.send(JSON.stringify(msg))
    },

    parseLoginData: function () {
        if (global.loginData != null) {
            this.curDungeonName = global.loginData.guanka
            let level = global.loginData.level
            let exp = global.loginData.exp
            let items = global.loginData.items
            let coin = global.loginData.coin
        }

        console.log('loginData:', global.loginData)
    },

});
