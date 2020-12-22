var itemConfig = require('itemConfig')
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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        
    },

    start() {
        
        this.hole1 = global.getChildByName(this.node, 'hole1')
        this.hole2 = global.getChildByName(this.node, 'hole2')
        this.hole3 = global.getChildByName(this.node, 'hole3')
        this.items = {}
        this._addItemToPos({}, 1)
        this._addItemToPos({}, 2)
        this._addItemToPos({}, 3)
        this._refreshShow()

        this.hole1.on(cc.Node.EventType.TOUCH_START, function () {
            this._useItemByPos(1)
        }, this)
        this.hole2.on(cc.Node.EventType.TOUCH_START, function () {
            this._useItemByPos(2)
        }, this)
        this.hole3.on(cc.Node.EventType.TOUCH_START, function () {
            this._useItemByPos(3)
        }, this)

        cc.find("Canvas/UI").getComponent('UIRootScript').setInterval(0.1, 300000,
            () => {
                this._update100()
            })
    },

    _update100: function () {
        //更新 道具cd之类
        for (var i = 1; i <= 3; ++i) {
            let item = this._getItemFromPos(i)
            if (item == null)
                continue
            let hole = null
            if (i == 1)
                hole = this.hole1
            if (i == 2)
                hole = this.hole2
            if (i == 3)
                hole = this.hole3
            let cd_str = ''
            if (item.name != null) {
                let cfg = itemConfig[item.name]
                if (item.cd_time > 0) {
                    let cfg_seconds = cfg.cd_time
                    let cur_seconds = item.cd_time

                    item.cd_time -= 0.1
                    //显示转圈cd
                    cd_str = item.cd_time.toFixed(1)
                }
            }

            global.getChildByName(hole, 'cd').getComponent(cc.Label).string = cd_str
        }
    },

    // update (dt) {},

    //返回值为丢弃的道具名字
    addItem: function (entity) {
        //this._printCurItems()

        //添加到道具栏空闲格子
        var added = false
        let discardItem = {}
        for (var i = 1; i <= 3; ++i) {
            if (this._getItemFromPos(i).name == null) {
                //放进去
                this._addItemToPos(entity, i)
                added = true
                break
            }
        }
        if (!added) {
            //没有格子 扔掉第三个 第二个放到第三个 第一个放到第二个 新的放到第一个
            discardItem = this._discardItemByPos(3)
            this._addItemToPos(this._discardItemByPos(2), 3)
            this._addItemToPos(this._discardItemByPos(1), 2)
            this._addItemToPos(entity, 1)
        }

        this._refreshShow()
        //this._printCurItems()

        console.log('discardItem ' + discardItem)
        return discardItem
    },

    //是否有空闲格子
    isFull: function () {
        var full = true
        for (var i = 1; i <= 3; ++i) {
            if (this._getItemFromPos(i).name == null) {
                full = false
                break
            }
        }
        return full
    },

    clearAll: function () {
        this._discardItemByPos(1)
        this._discardItemByPos(2)
        this._discardItemByPos(3)
        this._refreshShow()
    },

    _addItemToPos: function (entity, pos) {
        //拷贝一下
        let newEntity = itemConfig.copyItemEntity(entity)
        this.items[pos] = newEntity

        //添加item属性
        global.role_.addItemAttr(newEntity)
    },

    _discardItemByPos: function (pos) {
        let oldEntity = itemConfig.copyItemEntity(this.items[pos])
        this.items[pos] = {}

        //删除item属性
        global.role_.removeItemAttr(oldEntity)

        return oldEntity
    },

    getRatioAttr: function (att) {
        if (att == 'gedang') {
            return this._getPriorityRateValue('gedang_rate', 'gedang_value')
        }
        if (att == 'crit') {
            return this._getPriorityRateValue('crit_rate', 'crit_multi')
        }
        if (att == 'avoid') {
            return this._getPriorityRateValue('avoid_rate', 'avoid_value')
        }
    },

    _getPriorityRateValue: function (rateAtt, valueAtt) {
        //整理所有道具格挡值
        var rate_values = []
        for (var i = 1; i <= 3; ++i) {
            let item = this._getItemFromPos(i)
            if (item.name != null) {
                let cfg = itemConfig[item.name]
                if (cfg.attrs[rateAtt] > 0) {
                    rate_values.push({ rate: cfg.attrs[rateAtt], value: cfg.attrs[valueAtt] })
                }
            }
        }

        //按 value 排序
        var max = {}
        for (var i = 0; i < rate_values.length; i++) {
            for (var j = i; j < rate_values.length; j++) {
                if (rate_values[i].value < rate_values[j].value) {

                    max.rate = rate_values[j].rate
                    max.value = rate_values[j].value

                    rate_values[j].rate = rate_values[i].rate
                    rate_values[j].value = rate_values[i].value

                    rate_values[i].rate = max.rate
                    rate_values[i].value = max.value
                }
            }
        }

        //rate_values 从前往后命中 计算
        for (var i = 0; i < rate_values.length; i++) {
            if (rate_values[i].rate > 0 && rate_values[i].rate >= global.random(0, 100)) {
                return rate_values[i].value
            }
        }
        return 0
    },

    _getItemFromPos: function (pos) {
        return this.items[pos]
    },

    _refreshShow: function () {
        this._showItemInInventory(this.hole1, this._getItemFromPos(1))
        this._showItemInInventory(this.hole2, this._getItemFromPos(2))
        this._showItemInInventory(this.hole3, this._getItemFromPos(3))
    },

    _showItemInInventory: function (posNode, entity) {
        let itemName = entity.name
        var url = ''
        if (itemName == '' || itemName == null) {
            url = 'inventory_null_item'
        }
        else {
            let cfg = itemConfig[itemName]
            console.log(itemName, cfg)
            url = 'grid_item_icons/' + cfg['imgSrc']
        }
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            //console.log('new item img:'+url)
            posNode.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })

        //显示cd转圈的遮罩
    },

    _printCurItems: function () {
        console.log(this._getItemFromPos(1) + ',' + this._getItemFromPos(2) + ',' + this._getItemFromPos(3))
    },

    getAllItems: function () {
        let ret = []
        ret.push(this._getItemFromPos(1))
        ret.push(this._getItemFromPos(2))
        ret.push(this._getItemFromPos(3))
        return ret
    },

    //是否存在某名字的道具
    getPosByItemName: function (name) {
        for (var i = 1; i <= 3; ++i) {
            let item = this._getItemFromPos(i)
            if (item.name == name) {
                return i
            }
        }

        return -1
    },

    _useItemByPos: function (pos) {
        // let entity = this._getItemFromPos(pos)
        // console.log('use item:' + entity)
        // if (entity.name == null)
        //     return
        // //弹出提示框 展示物品信息
        // let itemInfoDialog = cc.find("Canvas/UI/itemInfoDialog").getComponent('itemInfoDialog')
        // itemInfoDialog.openItemInfo(entity)
    },

    updateItemCDAndUseTimesByPos: function (pos, cd, ts) {
        //只变更 cd时间 使用次数
        this.items[pos].cd_time = cd
        this.items[pos].use_times = ts

        console.log('cd', cd, 'times', ts)
        if (ts == 0) {
            this._discardItemByPos(pos)
        }

        this._refreshShow()
    }
});
