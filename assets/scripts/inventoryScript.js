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

    onLoad () {
        this.hole1 = global.getChildByName(this.node, 'hole1')
        this.hole2 = global.getChildByName(this.node, 'hole2')
        this.hole3 = global.getChildByName(this.node, 'hole3')
        this.items = {}
        this.items[1] = ''
        this.items[2] = ''
        this.items[3] = ''
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
    },

    start () {

    },

    // update (dt) {},

    //返回值为丢弃的道具名字
    addItem:function(itemName)
    {
        //this._printCurItems()

        //添加到道具栏空闲格子
        var added = false
        let discardItemName = ''
        for(var i=1;i<=3;++i)
        {
            if(this.items[i] == '')
            {
                //放进去
                this.items[i] = itemName
                added = true
                break
            }
        }
        if(!added)
        {
            //没有格子 扔掉第三个 第二个放到第三个 第一个放到第二个 新的放到第一个
            discardItemName = this._discardItemByPos(3)
            this._addItemToPos(this.items[2], 3)
            this._addItemToPos(this.items[1], 2)
            this._addItemToPos(itemName, 1)
        }        

        this._refreshShow()
        //this._printCurItems()

        console.log('discardItemName '+discardItemName)
        return discardItemName
    },

    _addItemToPos:function(name, pos)
    {
        this.items[pos] = name
    },

    _discardItemByPos:function(pos)
    {
        let oldName = this.items[pos]
        this.items[pos] = ''
        return oldName
    },

    _refreshShow:function()
    {
        this._showItemInInventory(this.hole1, this.items[1])
        this._showItemInInventory(this.hole2, this.items[2])
        this._showItemInInventory(this.hole3, this.items[3])
    },

    _showItemInInventory:function(posNode, itemName)
    {
        var url = ''
        if(itemName == '')
        {
            url = 'inventory_null_item'
        }
        else
        {
            let cfg = itemConfig[itemName]
            url = 'grid_item_icons/' + cfg['imgSrc']
        }
        cc.loader.loadRes(url, cc.SpriteFrame, function(err,spriteFrame)
　　　　{
            if (err) {
                cc.error(err.message || err);
                return;
            }

            //console.log('new item img:'+url)
            posNode.getComponent(cc.Sprite).spriteFrame = spriteFrame
　　　　})
    },

    _printCurItems:function()
    {
        console.log(this.items[1]+','+this.items[2]+','+this.items[3])
    },

    _useItemByPos:function(pos)
    {
        console.log('use item:'+pos)
    },
});
