var global = require('global')

cc.Class({
    extends: cc.Component,

    properties: {

        shadowGridPrefab: {
            type: cc.Prefab,
            default: null,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        var url = 'shadow2'
        var self = this
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            self.shadow_sprite = spriteFrame
            self.restart()
        })
    },

    start() {

    },

    restart: function () {
        this._clearAll()
        this._initShadow()
    },

    _clearAll: function () {
        //记录格子阴影值
        this.gridShadowNumbers = {}
        this.gridShadowObjs = {}
        this.gridsStatus = {}

        this.node.removeAllChildren()
    },

    _initShadow: function () {

        //阴影层
        for (var i = -4; i <= 4; ++i) {
            for (var j = -3; j <= 4; ++j) {
                let prefab = cc.instantiate(this.shadowGridPrefab)
                this.node.addChild(prefab)

                prefab.setPosition(i * 100, j * 100)
                this._setShadowObj(i, j, prefab)
                this._setShadowNumber(i, j, 0)
            }
        }
    },

    _getShadowNumber: function (x, y) {
        return this.gridShadowNumbers[x * 10 + y]
    },

    _setShadowNumber: function (x, y, n) {
        if (isNaN(n))
            return
        this.gridShadowNumbers[x * 10 + y] = n

        let obj = this._getShadowObj(x, y)
        var sp = obj.getComponent(cc.Sprite)
        sp.spriteFrame = this._getShadowSpriteByNumber(n)
    },

    _getShadowObj: function (x, y) {
        return this.gridShadowObjs[x * 10 + y]
    },

    _setShadowObj: function (x, y, p) {
        this.gridShadowObjs[x * 10 + y] = p
    },

    _openGrid: function (x, y) {
        // 4   8    0
        //   *    *
        // 1   2    0

        // g3 g4
        // g1 g2
        let status = this._getGridStatus(x, y)
        if (status == 'open' || status == 'can_open')
            return

        let g1 = { x: x, y: y }
        let g2 = { x: x + 1, y: y }
        let g3 = { x: x, y: y + 1 }
        let g4 = { x: x + 1, y: y + 1 }


        this._setShadowNumber(g1.x, g1.y, this._getShadowNumber(g1.x, g1.y) + 1)
        this._setShadowNumber(g2.x, g2.y, this._getShadowNumber(g2.x, g2.y) + 2)
        this._setShadowNumber(g3.x, g3.y, this._getShadowNumber(g3.x, g3.y) + 4)
        this._setShadowNumber(g4.x, g4.y, this._getShadowNumber(g4.x, g4.y) + 8)
    },

    openZone: function (x, y, always = false) {

        if (this._getGridStatus(x, y) != 'can_open' && !always) {
            console.log('can not open')
            return
        }

        console.log('openZone', x, y)

        this._openGrid(x, y)
        this._setGridStatus(x, y, 'open')

        let backScript = cc.find("Canvas/back").getComponent('backScript')
        let mapGrid = backScript.getGridByXY(x, y)
        let thingNode = backScript.getMapThingInXY(x, y)
        let mapItemScript = thingNode == null ? null : thingNode.getComponent('mapItemScript')
        let monsterScript = thingNode == null ? null : thingNode.getComponent('monsterScript')
        if (monsterScript) {
            //格子有怪物
            this._addXtoMap(monsterScript, x - 1, y)
            this._addXtoMap(monsterScript, x + 1, y)
            this._addXtoMap(monsterScript, x, y - 1)
            this._addXtoMap(monsterScript, x, y + 1)

            this._addXtoMap(monsterScript, x - 1, y - 1)
            this._addXtoMap(monsterScript, x + 1, y + 1)
            this._addXtoMap(monsterScript, x - 1, y + 1)
            this._addXtoMap(monsterScript, x + 1, y - 1)
        }
        else {
            //格子上没怪物

            //格子不是落石
            if (mapGrid != null && mapGrid.getGridType() == 'luoshi')
                return
            if (mapGrid != null && mapGrid.getGridType() == '')
                mapGrid.setGridType('normal')

            this._setCanOpen(x - 1, y)
            this._setCanOpen(x + 1, y)
            this._setCanOpen(x, y - 1)
            this._setCanOpen(x, y + 1)


            //格子是地刺
            if (mapGrid != null && mapGrid.getGridType().indexOf('dici') != -1 ) {
                if(mapGrid.getGridType() == 'dici_1')
                    backScript._executeDamage(mapGrid, backScript.role_, 10, 'dici')
                if(mapGrid.getGridType() == 'dici_2')
                    backScript._executeDamage(mapGrid, backScript.role_, 30, 'dici')
                if(mapGrid.getGridType() == 'dici_3')
                    backScript._executeDamage(mapGrid, backScript.role_, 90, 'dici')
            }
        }

    },

    _setCanOpen: function (x, y) {
        if (this._getGridStatus(x, y) == 'close') {
            this._openGrid(x, y)
            this._setGridStatus(x, y, 'can_open')
        }
    },

    _addXtoMap: function (monsterScript, x, y) {
        if (this._getGridStatus(x, y) != 'open') {
            monsterScript.addXToMap(x, y)
        }
    },

    removeSuroundX: function (x, y) {
        let backScript = cc.find("Canvas/back").getComponent('backScript')
        let thingNode = backScript.getMapThingInXY(x, y)
        let monsterScript = thingNode == null ? null : thingNode.getComponent('monsterScript')

        monsterScript.removeXFromMap(x - 1, y)
        monsterScript.removeXFromMap(x + 1, y)
        monsterScript.removeXFromMap(x, y - 1)
        monsterScript.removeXFromMap(x, y + 1)

        monsterScript.removeXFromMap(x - 1, y - 1)
        monsterScript.removeXFromMap(x + 1, y + 1)
        monsterScript.removeXFromMap(x - 1, y + 1)
        monsterScript.removeXFromMap(x + 1, y - 1)


        //打开附近可探索
        this._setCanOpen(x - 1, y)
        this._setCanOpen(x + 1, y)
        this._setCanOpen(x, y - 1)
        this._setCanOpen(x, y + 1)
    },

    _closeGrid: function (x, y) {
    },

    _setGridStatus: function (x, y, status) {
        this.gridsStatus[x * 10 + y] = status

        if (status == 'can_open') {
            let backScript = cc.find("Canvas/back").getComponent('backScript')
            backScript.addCanOPenGrid(x, y)
        }
        if (status == 'open') {
            let backScript = cc.find("Canvas/back").getComponent('backScript')
            backScript.deleteCanOpenGrid(x, y)
        }
    },

    _getGridStatus: function (x, y) {
        if (this.gridsStatus[x * 10 + y] == null)
            return 'close'
        return this.gridsStatus[x * 10 + y]
    },

    _setGridShadow: function (x, y, shadowNum) {

    },

    // update (dt) {},

    _getShadowSpriteByNumber: function (k) {
        let j = k % 4
        let i = Math.floor(k / 4)
        return this._getSprite(i, j, this.shadow_sprite)
    },

    _getSprite: function (i, j, resource_sprite) {
        var sprite = resource_sprite.clone() // 克隆一张图片
        var width = sprite.getRect().width / 4
        var height = sprite.getRect().height / 4
        var x = sprite.getRect().x + i * width
        var y = sprite.getRect().y + j * height

        sprite.setRect(new cc.Rect(x, y, width, height))
        return sprite
    },
});
