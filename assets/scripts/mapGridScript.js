var global = require('global')

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        x: 0,
        y: 0,
        gridType: '',
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            let shadowScript = cc.find("Canvas/shadowRoot").getComponent('shadowScript')
            let backScript = cc.find("Canvas/back").getComponent('backScript')
            let thingNode = backScript.getMapThingInXY(this.x, this.y)
            let mapItemScript = thingNode == null ? null : thingNode.getComponent('mapItemScript')
            let monsterScript = thingNode == null ? null : thingNode.getComponent('monsterScript')

            if (shadowScript._getGridStatus(this.x, this.y) == 'open') {
                //有道具
                if (mapItemScript) {
                    backScript._addMapItemToRole(backScript.role_, mapItemScript)
                    return
                }
                //有怪物
                if (monsterScript) {

                    let clickCreatureEvent = new cc.Event.EventCustom("clickCreatureSig", true)
                    clickCreatureEvent.setUserData({ creature: monsterScript })
                    backScript.node.dispatchEvent(clickCreatureEvent)
                    return
                }

                if (this.getGridType() == 'chukou') {
                    backScript.jumpToNextDungeon()
                }
                if (this.getGridType() == 'locked_door') {
                    

                    let inventoryScript = cc.find("Canvas/inventory").getComponent('inventoryScript')
                    let pos = inventoryScript.getPosByItemName('钥匙')
                    if(pos > 0)
                    {
                        //如果有 扣掉钥匙 进入下一层
                        inventoryScript._discardItemByPos(pos)
                        inventoryScript._refreshShow()

                        backScript.jumpToNextDungeon()
                    }
                    else
                    {
                        //如果没有钥匙 则提示
                        backScript._addTextInfo('你没有钥匙，无法打开此门')
                    }
                }
            }
            else {
                //event.getLocation()
                shadowScript.openZone(this.x, this.y)

                //增加能量点
                backScript.role_.addAttr('energy', 1)

                //播放音效
                let musicScript = cc.find("Canvas/back").getComponent('musicScript')
                musicScript.playEffect('seek')
            }
        }, this)
    },

    start() {

    },

    // update (dt) {},

    setXY: function (x, y) {
        this.node.setPosition(x * 100, y * 100)
        this.x = x
        this.y = y
    },

    getXY: function () {
        let x = this.x
        let y = this.y
        return { x, y }
    },

    getSwyXY: function () {
        return { x: this.x * 100, y: this.y * 100 }
    },

    setGridType: function (t) {
        //需要钥匙的门
        //落石
        //地刺
        //出口

        //可以发射的弩
        //废弃的弩
        var url = ''
        if (t == 'chukou') {
            url = 'grid_type/chukou'
            console.log('------------------------------------------', this.x, this.y)
        }
        else if (t == 'locked_door') {
            url = 'grid_type/locked_door'
        }
        else if (t == 'dici_1') {
            url = 'grid_type/dici_1'
        }
        else if (t == 'dici_2') {
            url = 'grid_type/dici_2'
        }
        else if (t == 'dici_3') {
            url = 'grid_type/dici_3'
        }
        else if (t == 'luoshi') {
            url = 'grid_type/luoshi'
        }
        else if (t == 'nu_canfire') {
            url = 'grid_type/nu_canfire'
        }
        else if (t == 'nu_fired') {
            url = 'grid_type/nu_fired'
        }
        else if (t == 'can_explore') {
            url = 'grid_type/can_explore'
        }
        else if (t == 'shigu') {
            url = 'grid_type/shigu'
        }
        else {
            let i = Math.random() * 6
            url = 'grid_type/normal_' + Math.floor(i)
        }

        var self = this
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            var sp = global.getChildByName(self.node, 'inner').getComponent(cc.Sprite)
            sp.spriteFrame = spriteFrame

            console.log(self.x, self.y, t)
        })

        if (this.gridType != '') {
            console.log('want to override the grid type..', this.gridType, t)
        }
        this.gridType = t
    },

    getGridType: function () {
        return this.gridType
    },
});
