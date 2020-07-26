// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        HIGH:80,   //每一项的高度
        PAGE_NUM:8,  //每一页8个项
        item_prefab:{  //项的资源预制体
            type:cc.Prefab,
            default:null,
        },
        scroll_view:{ //获取scrollview组件
            type:cc.ScrollView,
            default:null,
        },
    },

    add_tip_item(str)
    {
        var item = cc.instantiate(this.item_prefab)
        item.getChildByName('context').getComponent(cc.Label).string = str
        
        //this.opt_item_set.push(item);
        //this.value_set.push(str)

        this.content.addChild(item)
        
        this.scroll_view.scrollToBottom(0.1)
        
        //console.log(item.y)
        //this.update_show()
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this.value_set=[]
        this.opt_item_set = []
        this.content = this.scroll_view.content
        /*
         for(var i=1;i<=100;i++)
         {
             this.value_set.push(i);
         }
         
         //每次加载3页
         for(var i=0;i<this.PAGE_NUM*3;i++)
         {
             var item = cc.instantiate(this.item_prefab);
             this.content.addChild(item);
             this.opt_item_set.push(item);
         }
         this.scroll_view.node.on("scroll-ended",this.on_scroll_ended.bind(this),this);//监听scrollview事件
         */
    },

    start () {
        /*this.start_y = this.content.y;//初始化起始y坐标
        this.start_index = 0; //100项数据里面的起始数据记录索引
        this.load_recode(this.start_index);
        */


    },

    update (dt) {
        //this.load_scroll_recode();

    },

    load_recode:function(start_index){
        this.start_index=start_index;
         for(var i = 0;i<this.PAGE_NUM*3;i++){
           var label = this.opt_item_set[i].getChildByName("Label").getComponent(cc.Label);
            //显示记录
           label.string = this.value_set[this.start_index+i];
       }
    },

    load_scroll_recode:function(){
        //向下加载数据
        //当开始位置比value_set的长度小则代表没加载完
         if(this.start_index + this.PAGE_NUM * 3 < this.value_set.length &&
          this.content.y >= this.start_y + this.PAGE_NUM * 2 * this.HIGH)//content超过2个PAGE的高度
        {
            //_autoScrolling在引擎源码中负责处理scrollview的滚动动作
            if(this.scroll_view._autoScrolling){ //等自动滚动结束后再加载防止滚动过快，直接跳到非常后的位置
                this.scroll_view.elastic = false; //关闭回弹效果 美观
                return;
            }
            var down_loaded = this.PAGE_NUM; 
            this.start_index += down_loaded;

            if(this.start_index + this.PAGE_NUM * 3>this.value_set.length)
            {
                //超过数据范围的长度
                var out_len = this.start_index + this.PAGE_NUM * 3 - this.value_set.length;
                down_loaded -= out_len;
                this.start_index -= out_len;
            }
            this.load_recode(this.start_index);
            this.content.y -= down_loaded * this.HIGH;
            return;
        }
        //向上加载
        if(this.start_index>0 && this.content.y<=this.start_y)
        {
            if(this.scroll_view._autoScrolling){ 
                this.scroll_view.elastic = false;
                return;
             }
            var up_loaded = this.PAGE_NUM;
            this.start_index -= up_loaded;
            if(this.start_index<0){
                up_loaded +=this.start_index;
                this.start_index=0;
            }
            this.load_recode(this.start_index);
            this.content.y += up_loaded * this.HIGH;
        }
    },
     on_scroll_ended:function(){
        /*this.load_scroll_recode();
        this.scroll_view.elastic = true; //加载结束后自动滚动回弹开启
        */
    },

});
