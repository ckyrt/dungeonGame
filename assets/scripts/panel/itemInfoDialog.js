var global = require('global')
var itemConfig = require('itemConfig')

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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.itemPos = 0
        this.itemEntity = null
        let closeButton = global.getChildByName(this.node, "closeButton")
        closeButton.on(cc.Node.EventType.TOUCH_START, () => {
            this.closePanel()
        }, this)
        let sellButton = global.getChildByName(this.node, "sellButton")
        sellButton.on(cc.Node.EventType.TOUCH_START, () => {

            let backScript = cc.find("Canvas/back").getComponent('backScript')
            backScript.role_.addAttr('coin', Math.ceil(itemConfig[this.itemEntity.name].price / 2))
            this.closePanel()

            let inventoryScript = cc.find("Canvas/inventory").getComponent('inventoryScript')
            inventoryScript._discardItemByPos(this.itemPos)
            inventoryScript._refreshShow()
        }, this)

        let discardButton = global.getChildByName(this.node, "discardButton")
        discardButton.on(cc.Node.EventType.TOUCH_START, () => {

            let backScript = cc.find("Canvas/back").getComponent('backScript')
            let inventoryScript = cc.find("Canvas/inventory").getComponent('inventoryScript')
            //随机一个空地
            let grid = backScript.getRandomEmptyGrid('normal')
            if (grid == null) {
                //没地方
                console.log('no place to throw')
                return
            }
            //丢到地上
            let discardItem = inventoryScript._discardItemByPos(this.itemPos)
            inventoryScript._refreshShow()
            backScript.addItemToMap(itemConfig.copyItemEntity(discardItem), grid.x, grid.y)

            this.closePanel()
        }, this)
    },

    // update (dt) {},

    openPanel: function ({ entity, pos }) {
        let cfg = itemConfig[entity.name]
        let itemName = global.getChildByName(this.node, "itemName")
        let itemImage = global.getChildByName(this.node, "itemImage")
        let description = global.getChildByName(this.node, "description")
        let price = global.getChildByName(this.node, "price")

        itemName.getComponent(cc.Label).string = cfg.name
        description.getComponent(cc.Label).string = cfg.descript
        price.getComponent(cc.Label).string = cfg.price

        var url = 'grid_item_icons/' + cfg.imgSrc
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            itemImage.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })

        this.node.x = 0
        this.itemPos = pos
        this.setUseFunc(entity)
    },

    closePanel: function (t) {
        this.node.x = 10000

        let useword = global.getChildByName(this.node, "useword")
        useword.off(cc.Node.EventType.TOUCH_START, this.execClickFunc, this)
    },

    setUseFunc: function (entity) {
        this.itemEntity = itemConfig.copyItemEntity(entity)
        let cfg = itemConfig[entity.name]
        let str = '关闭'
        if (cfg.use_func != null) {
            str = '使用'
        }
        let useword = global.getChildByName(this.node, "useword")
        useword.getComponent(cc.Label).string = str
        useword.on(cc.Node.EventType.TOUCH_START, this.execClickFunc, this)
    },

    execClickFunc: function () {

        let itemCfg = itemConfig[this.itemEntity.name]
        let times = this.itemEntity.use_times
        let cd = this.itemEntity.cd_time
        let backScript = cc.find("Canvas/back").getComponent('backScript')
        if (cd > 0) {
            //还没有冷却好
            backScript._addTextInfo('冷却中: ' + cd.toFixed(1) + 's')
            return
        }

        if (itemCfg.use_func != null) {
            if (itemCfg.has_target == true) {
                //有目标，需要再点击一下目标
                backScript._addTextInfo('请选择目标单位')
                backScript.setChooseTargetFunc(
                    (target) => {
                        this.useItemOver(target)
                    })
            }
        }

        this.closePanel()
    },

    useItemOver: function (target) {
        console.log('this.itemEntity', this.itemEntity)
        let itemCfg = itemConfig[this.itemEntity.name]
        itemCfg.use_func(target)

        if (this.itemEntity.use_times > 0) {
            //有限次
            this.itemEntity.use_times -= 1
        }
        //计算下次cd
        this.itemEntity.cd_time = itemCfg.cd_time

        let inventoryScript = cc.find("Canvas/inventory").getComponent('inventoryScript')
        inventoryScript.updateItemCDAndUseTimesByPos(this.itemPos, this.itemEntity.cd_time, this.itemEntity.use_times)
    },

});
