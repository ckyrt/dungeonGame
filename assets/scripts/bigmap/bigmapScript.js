var global = require('global')
var jsClientScript = require('jsClientScript')
var MsgID = require('MsgID')
var rpc = require('rpc')
var itemConfig = require('itemConfig')

var Skill = require('Skill')

cc.Class({
    extends: cc.Component,

    properties: {
        ui_root_prefab: {
            type: cc.Prefab,
            default: null,
        },

        role_prefab: {
            type: cc.Prefab,
            default: null,
        },

        mapItemPrefab: {
            type: cc.Prefab,
            default: null,
        },

        npc_prefab: {
            type: cc.Prefab,
            default: null,
        },
        monster_prefab: {
            type: cc.Prefab,
            default: null,
        },

        numberJump_prefab: {
            type: cc.Prefab,
            default: null,
        },

        grid: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        //let mapBack = global.getChildByName(this.node, 'test2')
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEventEnd, this)

        this.roles = {}
        this.items = {}
        this.npcs = {}
        this.monsters = {}

        this.node.zIndex = 1
    },

    start() {

        jsClientScript.registerMsg(MsgID.SM_MOVE_NTF, (msg) => {
            this.onMove(msg)
        })
        jsClientScript.registerMsg(MsgID.SM_APPEAR_NTF, (msg) => {
            this.onAppear(msg)
        })
        jsClientScript.registerMsg(MsgID.SM_DISAPPEAR_NTF, (msg) => {
            this.onDisAppear(msg)
        })
        jsClientScript.registerMsg(MsgID.SM_DROP_ITEM_APPEAR_NTF, (msg) => {
            this.onDropItemAppear(msg)
        })
        jsClientScript.registerMsg(MsgID.SM_DROP_ITEM_DISAPPEAR_NTF, (msg) => {
            this.onDropItemDisAppear(msg)
        })

        //ui
        var prefab = cc.instantiate(this.ui_root_prefab)
        cc.find("Canvas").addChild(prefab)
        prefab.zIndex = 100

        this._initDefaultMap()
        //this.setCurScene('test2')

        //定时器相关
        cc.find("Canvas/UI").getComponent('UIRootScript').setInterval(1, 300000,
            () => {
                this._update1000()
            })
        cc.find("Canvas/UI").getComponent('UIRootScript').setInterval(0.3, 300000,
            () => {
                this._update300()
            })


        //进地图
        var msg = {}
        msg.msg_id = MsgID.CM_GET_AOI
        msg.role_id = global.roleName
        jsClientScript.send(JSON.stringify(msg))
        //rpc._call('login_enterMap_s', [global.roleName, global.map_id, global.pos_x, global.pos_y])


        //所有注册的让服务器远程调用的消息
        rpc.addRpcFunc('addBagItem_c', (args) => {
            let item = args[0]
            let itemName = item.name
            let bagScript = cc.find("Canvas/UI/bag").getComponent('bagScript')
            //itemConfig.createItemEntity(itemName)
            //bagScript.addItem(item)
            bagScript._addItemToPos(item, item.pos)
            bagScript._refreshShow()
            //cc.find("Canvas/UI").getComponent('UIRootScript')._addTextInfo('获得 ' + itemName)
        })
        rpc.addRpcFunc('removeBagItem_c', (args) => {
            let item = args[0]
            let item_name = item.name
            let item_uuid = item.uuid
            let bagScript = cc.find("Canvas/UI/bag").getComponent('bagScript')
            bagScript._discardItemByUUid(item_uuid)
            bagScript._refreshShow()
            //cc.find("Canvas/UI").getComponent('UIRootScript')._addTextInfo('失去 ' + item_name)
        })

        rpc.addRpcFunc('listAllBagItems_c', (args) => {
            let bagScript = cc.find("Canvas/UI/bag").getComponent('bagScript')
            let items = args[0]
            console.log('items:', items)
            for (var k in items) {
                let item = items[k]
                console.log('additem..:' + k)
                if (item.pos > 1000) {

                }
                else {
                    bagScript._addItemToPos(item, item.pos)
                }
            }
            bagScript._refreshShow()
        })

        rpc.addRpcFunc('listAllEquipItems_c', (args) => {
            let roleEquipScript = cc.find("Canvas/UI/roleEquipInfo").getComponent('RoleEquipScript')
            let items = args[0]
            console.log('items:', items)
            for (var k in items) {
                let item = items[k]
                console.log('additem..:' + item.pos)
                if (item.pos > 1000) {
                    //身上
                    roleEquipScript._addItemToPart(global.intToPart(item.pos), item)
                }
            }
        })

        rpc.addRpcFunc('wearEquip_c', (args) => {
            console.log('wearEquip_c')
            let item = args[0]
            let part = global.intToPart(args[1])
            let roleEquipScript = cc.find("Canvas/UI/roleEquipInfo").getComponent('RoleEquipScript')
            roleEquipScript._addItemToPart(part, item)
        })
        rpc.addRpcFunc('takeoffEquip_c', (args) => {
            let part = global.intToPart(args[0])
            let roleEquipScript = cc.find("Canvas/UI/roleEquipInfo").getComponent('RoleEquipScript')
            roleEquipScript.takeoffEquipItemToBag(part)
        })

        rpc.addRpcFunc('getAOI_c', (args) => {
            let map_id = args[0]
            let scene = global.mapIdToScene(map_id)
            this.setCurScene(scene)
        })

        //技能
        rpc.addRpcFunc('cast_skill', (args) => {
            let role_id = args[0]
            let role = this._get_role(role_id)
            if(role)
            {
                role.node.getComponent('creature').cast_skill()
            }
        })

        Skill.bigmap_script = cc.find("Canvas/mapNode").getComponent('bigmapScript')
    },

    setCurScene: function (scene_name) {
        this._initDefaultMap()
        //tiled
        var url = 'tmx/' + scene_name
        var self = this
        cc.loader.loadRes(url, function (err, map) {
            self.tiledMap = self.node.getComponent(cc.TiledMap)
            self.tiledMap.tmxAsset = map


            //根据图层名获取图层
            let layer1 = self.tiledMap.getLayer('layer1')    //行走
            let layer2 = self.tiledMap.getLayer('layer2')    //阻挡
            let layer3 = self.tiledMap.getLayer('layer3')    //遮挡

            //获取图层的行列数
            let layerSize = layer2.getLayerSize()
            let width = layerSize.width
            let height = layerSize.height
            console.log(layerSize);  // size(width:40, height:30)
            //获取图层的gid
            let mapData = [];
            for (let i = 0; i < height; i++) {
                mapData[i] = [];
                for (let j = 0; j < width; j++) {
                    let n1 = layer1.getTileGIDAt(new cc.Vec2(j, i)) > 0 ? 1 : 0
                    let n2 = layer2.getTileGIDAt(new cc.Vec2(j, i)) > 0 ? 1 << 1 : 0
                    let n3 = layer3.getTileGIDAt(new cc.Vec2(j, i)) > 0 ? 1 << 2 : 0

                    mapData[i][j] = n1 | n2 | n3
                }
            }
            console.log(mapData)

            self.node.getComponent('AstarSearch').initMap(mapData)

            // test monster
            self._add_monster_pos('土匪1', 2, 2)
        });

        this.getComponent('musicScript').onEnterNewDungeon()
    },

    _initDefaultMap: function () {
        let mapData = [];
        for (let i = 0; i < 80; i++) {
            mapData[i] = [];
            for (let j = 0; j < 80; j++) {
                mapData[i][j] = 1
            }
        }
        this.node.getComponent('AstarSearch').initMap(mapData)
    },

    //if is trap
    getTrap: function (x, y) {
        if (!this.tiledMap)
            return
        let traps = this.tiledMap.getObjectGroup("traps").getObjects()    //traps
        for (var i = 0; i < traps.length; ++i) {
            let trap = traps[i]
            let trap_x = Math.floor(trap.x / (global.GRID_WIDTH + global.spacing))
            let trap_y = Math.floor(trap.y / (global.GRID_WIDTH + global.spacing))
            //console.log(trap, trap_x, trap_y)
            if (x == trap_x && y == trap_y) {
                return trap
            }
        }
        return null
    },

    //get trap's target map
    triggerTrap: function (trap) {
        if (!trap)
            return
        console.log('trap', trap)
        rpc._call('jumpMap_s', [global.roleName, trap.target_map, trap.target_x, trap.target_y])
    },

    // update (dt) {},

    //地图上掉落物每秒检测
    _update1000: function () {
        this.visit_drop_items((mapItemScript) => {
            mapItemScript._update1000()
        })
    },

    _update300: function () {
        let now = (new Date()).valueOf()
        Skill._update_skills(now)
    },

    onTouchEventEnd: function (t) {
        let RoleCamera = cc.find("Canvas/RoleCamera").getComponent(cc.Camera)

        let screenPoint = t.getLocation()
        let worldPoint = cc.v2(0, 0)
        RoleCamera.getScreenToWorldPoint(screenPoint, worldPoint);
        var mapPos = this.node.convertToNodeSpaceAR(worldPoint)
        let x = Math.floor(mapPos.x / (global.GRID_WIDTH + global.spacing))
        let y = Math.floor(mapPos.y / (global.GRID_WIDTH + global.spacing))

        let ownRole = this._get_role(global.roleName)
        this._removeTargetGrid()
        this._addTargetGrid(x, y)
        ownRole._move_to_pos(x, y)

        //清除一些ui
        {
            //去掉拾取按钮
            let pickJs = cc.find("Canvas/UI/others/pickIcon").getComponent('pickScript')
            pickJs.hidePickIcon()
        }
    },

    _addTargetGrid: function (x, y) {
        this.targetGrid = cc.instantiate(this.grid);
        this.targetGrid.parent = this.node;
        let realPos = global.getRealMapPos(x, y)
        this.targetGrid.setPosition(realPos.x, realPos.y)
    },

    _removeTargetGrid: function () {
        let grid = this.targetGrid
        if (grid) {
            grid.destroy()
        }
    },

    _add_role_pos(uid, x, y) {
        var prefab = cc.instantiate(this.role_prefab)
        cc.find("Canvas").addChild(prefab)
        prefab.zIndex = 1
        var moveEntity = prefab.getComponent("moveEntity")
        moveEntity.set_grid({ x, y })
        moveEntity.uid = uid
        prefab.getComponent('creature').initAttr()
        prefab.getComponent('creature').setAttr('camp', 1)

        this.roles[uid] = moveEntity

        return moveEntity
    },

    _remove_role: function (uid) {
        this.roles[uid].node.destroy()
        this.roles[uid] = null
        delete (this.roles[uid])
    },

    _get_role: function (uid) {
        return this.roles[uid]
    },



    //来自服务器的消息
    //移动
    onMove: function (ntf) {
        ntf.role_id
        ntf.map_id
        ntf.x
        ntf.y
        ntf.to_x
        ntf.to_y

        let role = this._get_role(ntf.role_id)
        if (role == null) {
            console.error(ntf.role_id + ' not found for move')
            return
        }
        role.pathPoints.unshift({ x: ntf.to_x, y: ntf.to_y })
    },
    //出现
    onAppear: function (ntf) {
        ntf.role_id
        ntf.map_id
        ntf.x
        ntf.y
        console.log('role appear:' + ntf.role_id, ntf.x, ntf.y)
        this._add_role_pos(ntf.role_id, ntf.x, ntf.y)
    },
    //消失
    onDisAppear: function (ntf) {
        ntf.role_id
        ntf.map_id

        console.log('disappear')
        this._remove_role(ntf.role_id)
    },

    ///////////////////////////////////////////////////////////////////掉落物
    _add_drop_item_pos(uid, name, x, y) {
        console.log('_add_drop_item_pos', uid, name)
        var prefab = cc.instantiate(this.mapItemPrefab)
        this.node.addChild(prefab)
        let mapItem = prefab.getComponent('mapItemScript')
        mapItem.initMapItem2(name, uid)
        mapItem.setPos2(x, y)

        this.items[uid] = mapItem

        return mapItem
    },

    _remove_drop_item: function (uid) {
        console.log('_remove_drop_item', uid, name)
        this.items[uid].node.destroy()
        this.items[uid] = null
        delete (this.items[uid])
    },

    _get_drop_item: function (uid) {
        return this.items[uid]
    },

    visit_drop_items: function (f) {
        //console.error('visit_drop_items：' + this.items)
        for (var k in this.items) {
            f(this.items[k])
        }
    },

    //掉落物出现
    onDropItemAppear: function (ntf) {
        ntf.uuid
        ntf.name
        ntf.map_id
        ntf.x
        ntf.y
        this._add_drop_item_pos(ntf.uuid, ntf.name, ntf.x, ntf.y)
    },
    //掉落物消失
    onDropItemDisAppear: function (ntf) {
        ntf.uuid
        ntf.map_id
        this._remove_drop_item(ntf.uuid)
    },


    //npc
    _add_npc_pos(uid, x, y, data) {
        var prefab = cc.instantiate(this.npc_prefab)
        this.node.addChild(prefab)
        var npc = prefab.getComponent("newNpcScript")
        npc.setData(data)
        npc.setPos2(x, y)
        npc.uid = uid

        this.npcs[uid] = npc

        return npc
    },

    _remove_npc: function (uid) {
        this.npcs[uid].node.destroy()
        this.npcs[uid] = null
        delete (this.npcs[uid])
    },

    _get_npc: function (uid) {
        return this.npcs[uid]
    },


    //monster
    _add_monster_pos(uid, x, y) {
        var prefab = cc.instantiate(this.monster_prefab)
        cc.find("Canvas").addChild(prefab)
        prefab.zIndex = 1
        var moveEntity = prefab.getComponent("moveEntity")
        moveEntity.set_grid({ x, y })
        moveEntity.uid = uid
        prefab.getComponent('creature').initAttr()
        prefab.getComponent('creature').setAttr('camp', 2)

        this.monsters[uid] = moveEntity

        return moveEntity
    },

    _remove_monster: function (uid) {
        this.monsters[uid].node.destroy()
        this.monsters[uid] = null
        delete (this.monsters[uid])
    },

    _get_monster: function (uid) {
        return this.monsters[uid]
    },

    //得到role 或者 monster 的entity
    _get_entity_by_uid: function (uid) {
        let ent = this._get_role(uid)
        if (!ent)
            ent = this._get_monster(uid)
        return ent
    },

    _is_same_line: function (x1, y1, x2, y2) {
        return x1 == x2 || y1 == y2
    },

    _distance: function (x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2)
    },

    //访问生物
    _get_pos_radius_entities: function (x, y, r, filter = null) {
        //console.log('_get_pos_radius_entities', x, y, r, filter)
        let rets = []
        for (var k in this.monsters) {
            let ent = this.monsters[k]
            if (/*this._is_same_line(x, y, ent.x, ent.y) &&*/ this._distance(x, y, ent.x, ent.y) <= r) {
                if (filter && filter(ent) || !filter)
                    rets.push(k)
            }
        }
        for (var k in this.roles) {
            let ent = this.roles[k]
            if (/*this._is_same_line(x, y, ent.x, ent.y) &&*/ this._distance(x, y, ent.x, ent.y) <= r) {
                if (filter && filter(ent) || !filter)
                    rets.push(k)
            }
        }
        return rets
    },


    //跳数字
    _playNumberJump: function (txt, x, y, color, fontSize = 40) {
        var numberJump = cc.instantiate(this.numberJump_prefab)


        //世界坐标 转换为 RoleCamera 屏幕位置
        let screenPos = cc.v2(0, 0)
        let role_camera = cc.find("Canvas/RoleCamera").getComponent(cc.Camera)
        role_camera.getWorldToScreenPoint(cc.v2(x, y), screenPos)

        //屏幕位置 转换为 mainCamera 世界坐标
        let worldPos = cc.v2(0, 0)
        let main_camera = cc.find("Canvas/Main Camera").getComponent(cc.Camera)
        main_camera.getScreenToWorldPoint(screenPos, worldPos);

        //转为 父节点的 局部坐标
        let effect = cc.find("Canvas/UI/effect")
        var locPos = effect.convertToNodeSpaceAR(cc.v2(worldPos.x, worldPos.y))
        effect.addChild(numberJump)
        numberJump.setPosition(locPos.x, locPos.y)
        numberJump.getComponent('numberJumpScript').playJump(txt, color, fontSize)
    },
});
