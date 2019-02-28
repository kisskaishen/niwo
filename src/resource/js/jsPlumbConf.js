
let importDefaults = {
    Anchor:"Continuous",//在连接中跟踪另一个元素的锚，选择最接近的面。// 未生效
    Anchors:[],//多个锚点的位置声明
    ConnectionsDetachable:false,//连接是否可以使用鼠标分离/** Jim修改于2018-10-30 17:25:52 @true导致锚点覆盖端点，一个端点只能拉出一条线 */
    ConnectionOverlays:[//附加到每个连线的默认重叠
		['Arrow', { 
            id:'Arrow',
			width: 12, 
			length: 12, 
			location: 1,
			paintStyle:{
    			fill: '#40BDEC',
			},
		}],
	    [ "Label", { 
            id: "label",
	    	label: "", 
	    	cssClass: "lineLabel",
	    	events:{
	    		click:function(labelOverlay,originalEvent){
	    			console.log("lineLabel",labelOverlay,originalEvent);
	    		}
	    	}
	    }],
    ],
    Connector:"Flowchart",//要使用的默认连接器的类型：折线，流程等。有四种默认类型：Bezier（贝塞尔曲线），Straight（直线），Flowchart（流程图），State machine（状态机）
    Container:"uml_bd",//设置父级的元素，一个容器
    DoNotThrowErrors:false,//如果请求不存在的Anchor，Endpoint或Connector，是否会抛出
    DragOptions:{cursor: "crosshair"},//用于配置拖拽元素的参数
    DropOptions:{ },//用于配置元素的drop行为的参数
    Endpoint:'Rectangle',//端点（锚点）的样式声明（Dot）
    Endpoints:[ null, null ],//多个端点的样式声明（Dot）
    EndpointOverlays:[		
	    [ "Label", { 
	    	label: "", id: "label", cssClass: "EndpointLabel" ,
	    	events:{
	    		click:function(labelOverlay,originalEvent){
	    			console.log("EndpointLabel",labelOverlay,originalEvent);
	    		}
	    	}
	    }]
	],//端点的重叠
    EndpointStyle:{ 
        // stroke:"#f00",// 路径
        strokeWidth:2, // 路径宽度
        // fill: "white", // 填充绘图
        // outlineStroke:"#DCDFE6",// 换用CSS伪类实现范围大显示小的效果
        // outlineWidth: 2,// 外框宽度
        width: 0, 
        height: 0,
    },//端点的css样式声明
    EndpointHoverStyle:{//鼠标经过样式
    	// outlineStroke: '#409EFF',
    },
    EndpointStyles:[ null, null ],//同上
    EndpointHoverStyles:[ null, null ],//同上
    LabelStyle:{ color:"black" },//标签的默认样式。
    LogEnabled:false,//是否打开jsPlumb的内部日志记录
    Overlays:[],//重叠
  	MaxConnections:10,//最大连接数
    ReattachConnections:false,//是否重新连接使用鼠标分离的线
    RenderMode:"svg",//默认渲染模式
    Scope:"jsPlumb_DefaultScope",//范围，标识
    PaintStyle:{ // 连线样式
    	outlineStroke: '#40BDEC',
    	strokeWidth: 0.5,
    },
    HoverPaintStyle:{// 连线悬浮样式
    	outlineStroke: '#00b9ff',
    	strokeWidth: 1
    },
}
let endpoint = {
    style(nodetype,_self){
        if(_self.$route.query.type=='edit'){
            return {
                isSource: nodetype!=2,
                isTarget: nodetype!=1,
                // connector:
            }
        }else{
            return {
                isSource: false,
                isTarget: false,
                // connector:
            }

        }
    }
}

module.exports = {
	importDefaults,endpoint
}