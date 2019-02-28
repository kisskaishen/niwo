export const oprDom = {
    methods:{
        createNode(item) {
            // console.log(item.allowrevoke?'恢复老数据节点':'老数据节点',item)
            let node = document.createElement('div');
            let text = document.createTextNode(item.nodeName);
            node.style.position = 'absolute';
            node.style.top = item.positionTop;
            node.style.left = item.positionLeft;
            node.id = item.id;
            node.dataset.nodetype = item.nodeType;

            node.setAttribute('onclick','_self.switchForm(event)');
            // let iconDiv = `<div class="uml_icon" alt="${item.nodeType}"></div><p class="uml_title">【${item.id.slice(4)}】</p>`// 测试循环连线使用
            let kingDiv = '';
            if(node.dataset.nodetype==5||node.dataset.nodetype==8||node.dataset.nodetype==9){
                if (item.hasChallenger=='0'||item.hasChallenger==null) {
                    kingDiv = `<div class="kingDiv">
								<i class="iconAdd" data-modal='/risk/proMg/businessList/editFlow/kingForm' onclick="_self.switchForm(event)"></i>
								<div class="kingFormAdd">添加冠军/挑战者</div>
							</div>`
                } else if(item.hasChallenger=='1'){
                    kingDiv = `<i class="iconKing" data-modal='/risk/proMg/businessList/editFlow/kingForm' onclick="_self.switchForm(event)"></i>
`
                }


            }
            let iconDiv = `<div class="uml_icon" alt="${item.nodeType}"></div><p class="uml_title">${item.nodeName}</p>${kingDiv}`
            node.innerHTML = iconDiv;
            switch(item.nodeType*1||item.nodetype*1){// 1：开始，2：结束，3：分类器，4：策略，5：评分卡，6：计算卡，7：并行，8:决策流 ,9：风险定价
                case 1:
                    node.className = 'uml uml_start';
                    node.dataset.modal = '';
                    break;
                case 2:
                    node.className = 'uml uml_end';
                    node.dataset.modal = '';
                    break;
                case 3:
                    node.className = 'uml uml_classify';
                    node.dataset.modal = '/risk/proMg/businessList/editFlow/classifyForm';
                    break;
                case 4:
                    node.className = 'uml uml_strat';
                    node.dataset.modal = '/risk/proMg/businessList/editFlow/stratForm';
                    break;
                case 5:
                    node.className = 'uml uml_scoreCard';
                    node.dataset.modal = '/risk/proMg/businessList/editFlow/scoreCardForm';
                    node.dataset.needmoldtype = '4';
                    break;
                case 6:
                    node.className = 'uml uml_calculator';
                    node.dataset.modal = '/risk/proMg/businessList/editFlow/computecard';
                    break;
                case 7:
                    node.className = 'uml uml_parallel';
                    node.dataset.modal = '/risk/proMg/businessList/editFlow/parallelForm';
                    break;
                case 8:
                    // 决策流
                    node.className = 'uml uml_outFrand';
                    node.dataset.modal = '/risk/proMg/businessList/editFlow/outFrandForm';
                    node.dataset.needmoldtype = '1';

                    break;
                case 9:
                    // 风险定价
                    node.className = 'uml uml_credit';
                    node.dataset.modal = '/risk/proMg/businessList/editFlow/creditForm';
                    node.dataset.needmoldtype = '3';
                    break;
            }
            document.getElementById('uml_bd').appendChild(node);
            this.jsPlumb_addEndpoint(node.id);// 增加锚点
            this.jsPlumb_draggable(node,'old');// 监听拖拽钩子
            this.umlHover();// 操作画布内已存在的元素
        },
        createConnection(item) {
            // console.log('老数据线',item,this.nodeDirect[item.startNodeDirect],this.nodeDirect[item.endNodeDirect])
            let connection = jsPlumb.connect({
                source: typeof(item.startNodeId)=='number'?('uml_'+item.startNodeId):item.startNodeId,
                target: typeof(item.endNodeId)=='number'?('uml_'+item.endNodeId):item.endNodeId,
                anchors: [this.nodeDirect[item.startNodeDirect],this.nodeDirect[item.endNodeDirect]],/** Jim修改于2018-11-17 15:15:54 @anchor导致起止点位置无序 */
            });
            connection.canvas.dataset.startNodeDirect = item.startNodeDirect;// 连线描述
            connection.canvas.dataset.endNodeDirect = item.endNodeDirect;// 连线描述
            // console.log('老数据线',item.id,connection)
            if(!!item.valueDescription){
                connection.getOverlay("label").setLabel(item.valueDescription);
                connection.canvas.dataset.des = item.valueDescription;// 连线描述
            }

            if(!!item.lineValue){
                connection.canvas.dataset.linevalue = item.lineValue;// 连线描述
            }

            connection.canvas.dataset.newtype = 'old';// 连线描述
            connection.id = item.id;

            // doc:https://jsplumbtoolkit.com/community/doc/events.html#connectionEvents
        },
    }
}
export const umlDomFn = {
    methods:{
        umlHover() {// 悬停画布内已存在的元素
            // console.log('endpointLock',this.endpointLock)
            document.querySelectorAll('.uml_bd .uml').forEach((item)=>{
                item.onmouseover = (e)=>{
                    e.preventDefault();
                    // console.log('悬停uml',item.id,this.endpointLock)
                    // $(".kingDiv").css('opacity',1)
                    this.endpointLock&&document.querySelectorAll('.'+item.id+'_endpoint').forEach((endpointItem)=>{
                        endpointItem.style.opacity = '1';
                    })
                }
                item.onmouseleave = (e)=>{
                    e.preventDefault();
                    // $('.uml_bd .kingDiv').css('opacity',0)
                    // console.log('离开uml',item.id,this.endpointLock)
                    this.endpointLock&&document.querySelectorAll('.'+item.id+'_endpoint').forEach((endpointItem)=>{
                        endpointItem.style.opacity = '0';
                    })
                    document.querySelectorAll('.'+item.id+'_endpoint').forEach((endpointItem)=>{
                        endpointItem.onmouseover = ()=>{
                            this.endpointLock&&document.querySelectorAll('.'+item.id+'_endpoint').forEach((cell)=>{
                                cell.style.opacity = '1';
                            })
                        }
                        endpointItem.onmouseleave = ()=>{
                            this.endpointLock&&document.querySelectorAll('.'+item.id+'_endpoint').forEach((cell)=>{
                                cell.style.opacity = '0';
                            })
                        }
                    })
                }
            })
        },
        delSelecteUml(){
            if(!!document.querySelector('.uml[data-selected="1"]')){
                let nodeData = document.querySelector('.uml[data-selected="1"]');
                console.log('删除节点',nodeData)
                console.log(this)
                this.ajaxPush.deleteNode(nodeData)// 3.2.38删除节点
            }
            delete this.$route.query.nodeId;    //删除nodeId参数，避免删除节点后，还会调用query接口
            this.$router.push({path:'/risk/proMg/businessList/editFlow',query:this.$route.query});
        },
        checkOnlyNode(){
            setTimeout(()=>{
                let nodeList = document.querySelectorAll('.uml_bd>.uml');
                // console.log('nodeList',Array.from([...nodeList]))
                this.hasNode.start = Array.from([...nodeList]).some((item,index)=>{
                    // console.log('开始',item.dataset.nodetype)
                    return item.dataset.nodetype==1;
                })
                this.hasNode.end = Array.from([...nodeList]).some((item,index)=>{
                    // console.log('结束',item.dataset.nodetype)
                    return item.dataset.nodetype==2;
                })
                this.hasNode.abTest = Array.from([...nodeList]).some((item,index)=>{
                    // console.log('A/B测试',item.dataset.nodetype)
                    return item.dataset.nodetype==7;
                })
            },300)
        },
        delSelectedLine(){
            jsPlumb.getConnections().map(item=>{
                // console.log('删除连线1',item.canvas.dataset)
                if(item.canvas.dataset.selected == '1'){
                    console.log('删除连线2',item)
                    this.ajaxPush.deleteLine(item);// 提交数据
                    this.endpointFade(item,0);// 自动隐藏端点
                }
            })
        },
        endpointFade(info,opacity) {
            this.endpointLock&&document.querySelectorAll('.'+info.source.id+'_endpoint').forEach((cell)=>{
                cell.style.opacity = opacity;
            })
            this.endpointLock&&document.querySelectorAll('.'+info.target.id+'_endpoint').forEach((cell)=>{
                cell.style.opacity = opacity;
            })
        },
        keydown(){
            document.onkeyup = (e) => {
                console.log('_______________：keyup')
                var currKey = 0;
                //在FireFox或Opera中，隐藏的变量e是存在的，那么e||event返回e，如果在IE中，隐藏变量e是不存在，则返回event。
                var e = e || event;
                //IE中，只有keyCode属性，而FireFox中有which和charCode属性，Opera中有keyCode和which属性
                var currKey = e.keyCode || e.which || e.charCode;
                if (currKey == 46 && this.$route.query.type != 'look') {// delete
                    this.delSelecteUml();
                    this.delSelectedLine();
                }
            };
        },
        //这里面封装的是一些连线的方法，初次进入页面用不到
        lineFn() { // 连线相关方法
            jsPlumb.bind("click",(info,event)=>{
                console.log(info)
                console.log(event)
                event.preventDefault();
                console.log('点击连接器',info,event);
                if(info.source.dataset.nodetype==3){// 点击分类器的线
                    info.canvas.dataset.lineid = info.id;
                    info.canvas.dataset.linevalue = info.canvas.dataset.linevalue;
                    info.canvas.dataset.sourceid = info.source.id.slice(4);
                    info.canvas.dataset.modal = '/risk/proMg/businessList/editFlow/selectClassify';
                    this.switchForm(info);
                }else{
                    this.setSelect(info);
                    this.returnEditFlow();
                    this.switchPath('/risk/proMg/businessList/editFlow');
                }
            });
            jsPlumb.bind("mouseover",(info,event)=>{
                // console.log('mouseover',info,event);
                if(info.canvas.tagName=="svg"){
                    this.endpointFade(info,1)
                }
            });
            jsPlumb.bind("mouseout",(info,event)=>{
                // console.log('mouseout',info,event);
                if(info.canvas.tagName=="svg"){
                    this.endpointFade(info,0)
                }
            });
            jsPlumb.bind("connectionDrag",(connection)=> {// 连线拖拽
                // console.log("连线Drag",connection);
                this.endpointLock = false;
                jsPlumb.selectEndpoints().getPaintStyle().map(item=>{// 获取所有端点样式
                    item[1].canvas.style.opacity = 1;
                    // item[0].outlineStroke = '#f00';
                })
            });
            jsPlumb.bind("connectionMoved",(connection)=> {// 连线被移动：移除不触发
                console.log("连线Moved",connection);
                // history2.isLineUpdate = true;// 判断是否是update
                {// 首次修改，获取初始位置
                    // let hasInit = history2.leftList.some((item,index)=>{
                    //     return (item.id == connection.connection.id)&&(item.oprtype == 'update');
                    // })
                    // if(!hasInit){// 首次移动
                    //     console.log('【首次记录】连线',connection.connection.id)
                    //     history2.lineInitArr.map((item,index)=>{
                    //         if(connection.connection.id = item.id){
                    //             item.startNodeId = 'uml_'+item.startNodeId;
                    //             item.endNodeId = 'uml_'+item.endNodeId;
                    //             item.oprtype = 'update';
                    //             item.formData = {};
                    //             item.nodetype = 'line';
                    //             item.nodeType = 'line';
                    //             item.allowrevoke = false;
                    //             // tmp.beforeStartInfo = item;
                    //         }
                    //     })
                    // }else{
                    //     // tmp.beforeStartInfo = {};
                    // }
                }
            });
            jsPlumb.bind("connectionAborted", (connection)=> {// 连线中止：未触发
                // console.log("连线Aborted",connection);
            });
            jsPlumb.bind("connection",(info,event)=>{
                // console.log('连线',info,event);
                info.connection.canvas.dataset.nodetype = 'line';// 节点类型
                info.connection.canvas.dataset.allowrevoke = '';// 是否允许撤销
                info.connection.canvas.dataset.startNodeDirect = this.nodeDirect.indexOf(info.connection.endpoints[0].anchor.type)
                info.connection.canvas.dataset.endNodeDirect = this.nodeDirect.indexOf(info.connection.endpoints[1].anchor.type)
                this.startOnlyOne(info);// 开始节点只能拉出一条线
            });
            jsPlumb.bind("connectionDetached",(info,event)=>{
                // console.log('断开',info,event);
                this.startOnlyOne(info,true);// 开始节点只能拉出一条线
            });
            jsPlumb.bind("connectionDragStop",(info)=> {// 连线结束
                // console.log("连线DragStop",info);
                this.endpointLock = true;
                jsPlumb.selectEndpoints().getPaintStyle().map(item=>{// 获取所有端点样式,隐藏所有端点
                    item[1].canvas.style.opacity = 0;
                    // item[0].outlineStroke = '#f00';
                })
                // 检测反向线
                const hasReverseLine = jsPlumb.getConnections().length&&jsPlumb.getConnections().some(item=>item.sourceId==info.targetId&&item.targetId==info.sourceId);
                // console.log('连线条件：',info.sourceId,info.targetId,hasReverseLine)
                if(info.sourceId==info.targetId||hasReverseLine){// 起点终点为同一个元件
                    jsPlumb.deleteConnection(info)
                }else{
                    this.ajaxPush.createLine(info);// 3.2.40模型配置—连线
                }
                // console.log("连线DragStop",info.id,info.canvas.dataset,info,info.getAttachedElements());
            });
        },
        startOnlyOne(info,type=false) {// 开始、策略、计算卡、评分卡元件只能拉出一条线
            // console.log('【开关】',info.source.dataset.nodetype,info.source)
            if(info.source.dataset.nodetype==1||info.source.dataset.nodetype==4||info.source.dataset.nodetype==5||info.source.dataset.nodetype==6){
                jsPlumb.getEndpoints(info.source.id).map(item=>{item.isSource = type})
            }else{

            }
        },
        checkLoop() {     // 检测循环线
            /*遍历所有的线，
                判断每一条线的起点是否等于终点，
                    如果相等则结束：该条线首尾相接。
                    如果不相等，则把已经判断过的这个终点1存进一个hasCheckedTarget数组，同时把这条线1的起点1当做下一条线2的终点2。
                        再遍历以终点2为终点的所有线2，判断所有的线3的起点是否包含在hasCheckedTarget数组里，
                            如果包含，则表示出现两个节点间的直接循环。
                            如果不包含，则把已经判断过的这个终点2(也就是起点1)也存进hasCheckedTarget数组，同时把这组线2的起点2当做下一组线3的终点3。
                                再遍历…………
             */
            const sourceArr = jsPlumb.getConnections().map(item=>item.sourceId);
            const targetArr = jsPlumb.getConnections().map(item=>item.targetId);
            console.log('所有起点',sourceArr,'所有终点',targetArr)
            let allLine = jsPlumb.getConnections();
            let hasLoopLine = (item,index)=>{
                let hasCheckedTarget = [];
                allLine.map((item,index)=>{
                    console.log('起点',item.sourceId.slice(4),'终点',item.targetId.slice(4))
                    if(item.sourceId==item.targetId){// 找出所有起点为本终点的线
                        console.log('循环线',item)
                        return false;
                    }else{
                        hasCheckedTarget.push(item.targetId);
                        console.log('没有循环线')
                        hasLoopLine(item,index);
                    }
                })
            }
        },
    }
}
export const selectFn = {
    methods:{
        selectLine(e) {
            e.canvas.dataset.selected = '1';// 选中连线：用于删除的标记
            e.getOverlay("Arrow").width = 15;
            e.getOverlay("Arrow").length = 15;
            e.setPaintStyle({
                outlineStroke: '#00b9ff',
                strokeWidth: 1
            })
        },
        resetLine(item) {
            item.canvas.dataset.bdcolor='';
            item.canvas.dataset.selected='0';
            item.getOverlay("Arrow").width = 12;
            item.getOverlay("Arrow").length = 12;
            item.setPaintStyle({
                outlineStroke: '#40BDEC',
                strokeWidth: 0.5
            })
        },
        setSelect(e) {
            this.clearSelect();
            if(e.canvas){
                this.selectLine(e);
            }else{
                e.target.dataset.selected = '1';// 选中连线
            }
            this.selected.event = e;
        },
        setKingNodeSelect(e){
            this.clearSelect();
            e.setAttribute("data-selected", "1")
            this.selected.event = {}
            this.selected.event.target = e;
        },
        clearSelect() {
            document.querySelectorAll('.uml_bd>.uml').forEach((cell)=>{
                cell.setAttribute('data-selected',0)
            })
            jsPlumb.getConnections().map(item=>{// 清除所有连线选中状态
                this.resetLine(item);
            })
            this.selected.event = '';
        },
    }
}
