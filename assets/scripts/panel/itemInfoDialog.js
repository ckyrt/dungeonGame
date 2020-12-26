var global = require('global')
var itemConfig = require('itemConfig')
var rpc = require('rpc')

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
        this.itemEntity = null
        let closeButton = global.getChildByName(this.node, "closeButton")
        closeButton.on(cc.Node.EventType.TOUCH_START, () => {
            this.closePanel()
        }, this)
        let sellButton = global.getChildByName(this.node, "sellButton")
        sellButton.on(cc.Node.EventType.TOUCH_START, () => {

            // let backScript = cc.find("Canvas/back").getComponent('backScript')
            // let price = Math.ceil(itemConfig[this.itemEntity.name].price * this.itemEntity.count / 2)

            // cc.find("Canvas/UI").getComponent('UIRootScript')._addTextInfo('获得 ' + price + '金币')
            // cc.find("Canvas/UI").getComponent('UIRootScript')._addTextInfo('扣除 ' + this.itemEntity.name)

            // global.role_.addAttr('coin', price)

            // let bagScript = cc.find("Canvas/UI/bag").getComponent('bagScript')
            // bagScript._discardItemByUUid(this.itemEntity.uuid)
            // bagScript._refreshShow()

            rpc._call('sellItem_s', [global.roleName, this.entity_.uuid])

            this.closePanel()
        }, this)

        let discardButton = global.getChildByName(this.node, "discardButton")
        discardButton.on(cc.Node.EventType.TOUCH_START, () => {

            // let backScript = cc.find("Canvas/back").getComponent('backScript')
            // let bagScript = cc.find("Canvas/UI/bag").getComponent('bagScript')
            // //随机一个空地
            // let grid = backScript.getRandomEmptyGrid('normal')
            // if (grid == null) {
            //     //没地方
            //     console.log('no place to throw')
            //     return
            // }
            // //丢到地上
            // let discardItem = bagScript._discardItemByUUid(this.itemUUid)
            // bagScript._refreshShow()
            // backScript.addItemToMap(itemConfig.copyItemEntity(discardItem), grid.x, grid.y)

            //新版rpg丢弃
            rpc._call('discardItem_s', [global.roleName, this.entity_.uuid])

            this.closePanel()
        }, this)

        let wearButton = global.getChildByName(this.node, "wearButton")
        wearButton.on(cc.Node.EventType.TOUCH_START, () => {

            // let bagScript = cc.find("Canvas/UI/bag").getComponent('bagScript')
            // let pos = bagScript._getItemPosByUUid(this.itemUUid)
            // let item = bagScript._getItemFromPos(pos)

            let cfg = itemConfig[this.entity_.name]
            if (cfg.part == null)
                return
            // let roleEquipScript = cc.find("Canvas/UI/roleEquipInfo").getComponent('RoleEquipScript')
            // if (cfg.part != null)
            //     roleEquipScript.wearEquipItemFromBag(cfg.part, item)

            //新版rpg穿装备
            rpc._call('wearEquip_s', [global.roleName, this.entity_.uuid, global.partToInt(cfg.part)])
            this.closePanel()
        }, this)

        let takeoffButton = global.getChildByName(this.node, "takeoffButton")
        takeoffButton.on(cc.Node.EventType.TOUCH_START, () => {

            // let roleEquipScript = cc.find("Canvas/UI/roleEquipInfo").getComponent('RoleEquipScript')
            // let item = roleEquipScript.getItemByUUid(this.itemUUid)
            // let cfg = itemConfig[item.name]
            // if (cfg.part == null)
            //     return

            // if (cfg.part != null)
            //     roleEquipScript.takeoffEquipItemToBag(cfg.part)

            //新版rpg脱装备
            rpc._call('takeoffEquip_s', [global.roleName, this.entity_.uuid])
            this.closePanel()
        }, this)

        let strenButton = global.getChildByName(this.node, "strenButton")
        strenButton.on(cc.Node.EventType.TOUCH_START, () => {

            let bagScript = cc.find("Canvas/UI/bag").getComponent('bagScript')
            bagScript.strengthenItemByUUid(this.itemUUid)

            let pos = bagScript._getItemPosByUUid(this.itemUUid)
            let item = bagScript._getItemFromPos(pos)

            //更新显示
            let stren_lv = global.getChildByName(this.node, "stren_lv")
            stren_lv.getComponent(cc.Label).string = item.stren_lv > 0 ? '+' + item.stren_lv : ''
        }, this)

    },

    // update (dt) {},

    //wear takeoff discard sell

    openItemInfo: function (entity, wear = true, takeoff = true, discard = true, sell = true, stren = true) {
        let cfg = itemConfig[entity.name]
        this.entity_ = entity
        let itemName = global.getChildByName(this.node, "itemName")
        let itemImage = global.getChildByName(this.node, "itemImage")
        let description = global.getChildByName(this.node, "description")
        let price = global.getChildByName(this.node, "price")
        let stren_lv = global.getChildByName(this.node, "stren_lv")

        itemName.getComponent(cc.Label).string = cfg.name
        description.getComponent(cc.Label).string = cfg.descript
        price.getComponent(cc.Label).string = cfg.price
        stren_lv.getComponent(cc.Label).string = entity.stren_lv > 0 ? '+' + entity.stren_lv : ''

        var url = 'grid_item_icons/' + cfg.imgSrc
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            itemImage.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })

        this.node.x = 0
        this.node.zIndex = global.getBigZIndex()
        this.setUseFunc(entity)

        //选择性显示按钮
        let sellButton = global.getChildByName(this.node, "sellButton")
        sellButton.opacity = sell ? 255 : 0
        let wearButton = global.getChildByName(this.node, "wearButton")
        wearButton.opacity = wear ? 255 : 0
        let takeoffButton = global.getChildByName(this.node, "takeoffButton")
        takeoffButton.opacity = takeoff ? 255 : 0
        let discardButton = global.getChildByName(this.node, "discardButton")
        discardButton.opacity = discard ? 255 : 0
        let strenButton = global.getChildByName(this.node, "strenButton")
        strenButton.opacity = stren ? 255 : 0

        if (cfg.part == null) {
            //不可穿戴
            wearButton.opacity = 0
            takeoffButton.opacity = 0
            strenButton.opacity = 0
        }
    },

    closePanel: function (t) {
        this.node.x = 10000
        this.node.zIndex = 0

        let useword = global.getChildByName(this.node, "useword")
        useword.off(cc.Node.EventType.TOUCH_START, this.execClickFunc, this)
    },

    setUseFunc: function (entity) {
        this.itemEntity = itemConfig.copyItemEntity(entity)
        this.itemUUid = entity.uuid
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
        //let backScript = cc.find("Canvas/back").getComponent('backScript')
        if (cd > 0) {
            //还没有冷却好
            cc.find("Canvas/UI").getComponent('UIRootScript')._addTextInfo('冷却中: ' + cd.toFixed(1) + 's')
            return
        }

        console.log('useItem_s', global.roleName, this.itemEntity.uuid)
        rpc._call('useItem_s', [global.roleName, this.itemEntity.uuid])
        this.closePanel()
        // if (itemCfg.use_func != null) {
        //     if (itemCfg.has_target == true) {
        //         //有目标，需要再点击一下目标
        //         cc.find("Canvas/UI").getComponent('UIRootScript')._addTextInfo('请选择目标单位')
        //         backScript.setChooseTargetFunc(
        //             (target) => {
        //                 this.useItemOver(target)
        //             })
        //     }
        //     else {
        //         this.useItemOver()
        //     }
        // }
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

        //let inventoryScript = cc.find("Canvas/UI/inventory").getComponent('inventoryScript')
        //inventoryScript.updateItemCDAndUseTimesByPos(this.itemPos, this.itemEntity.cd_time, this.itemEntity.use_times)
    },

});
