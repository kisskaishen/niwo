import Vue from 'vue'

export const ajax = {
    data() {
        return {
            ajax: {

                createNode: (nodeData) => {// 应用场景：创建节点——撤销——恢复
                    this.$post('/mcs/node/create', {
                        moldId: this.$route.query.flowId,// 模型ID    Number  Y
                        nodeName: nodeData.nodeName,// 节点名称    String  Y   不超过255
                        nodeType: nodeData.nodetype,// 节点类型    Number  Y   1：开始，2：结束，3：分类器，4：策略，5：评分卡，6：计算卡，7：AB测试，8：并行
                        positionLeft: nodeData.positionLeft.slice(0, -2),// 距离画布左位移 Number  Y
                        positionTop: nodeData.positionTop.slice(0, -2),// 距离画布上位移 Number  Y

                    })
                        .then(res => {
                            this.createNode(nodeData);
                            this.checkOnlyNode();// 检查唯一节点是否存在
                        })

                },
                updateNode: (nodeData) => {// 3.2.37模型配置—更新节点
                    this.$post('/mcs/node/update', {
                        id: nodeData.id.slice(4),// 节点id    Number  Y
                        nodeName: nodeData.nodeName,// 节点名称    String  Y   不超过255
                        positionLeft: nodeData.positionLeft.slice(0, -2),// 距离画布左位移 Number  Y
                        positionTop: nodeData.positionTop.slice(0, -2),// 距离画布上位移 Number  Y
                    })
                        .then(res => {
                            document.querySelector('#' + nodeData.id + '>.uml_title').innerText = nodeData.nodeName.replace(/[\n\s*\r]/g, "");// 节点名称    String  Y   不超过255
                            document.getElementById(nodeData.id).style.left = nodeData.positionLeft;
                            document.getElementById(nodeData.id).style.top = nodeData.positionTop;
                            this.checkOnlyNode();// 检查唯一节点是否存在
                            setTimeout(() => {
                                jsPlumb.repaintEverything()
                            }, 100);// 重绘
                        })
                },
                bindNode: (nodeData) => {
                    console.log(nodeData)
                    let data = JSON.parse(JSON.stringify(nodeData.formData));

                    data.nodeId = data.nodeId == undefined ? nodeData.id.slice(4) : (data.nodeId.indexOf('_') > -1 ? data.nodeId.slice(4) : data.nodeId);
                    data.bindMoldList = data.data ? data.data : data.bindMoldList
                    data.clear = nodeData.clear

                    console.log(data)
                    if (data.bindMoldList) {// 格式化数据
                        data.bindMoldList.map(pItem => {
                            pItem.id = ''
                            // pItem.ruleList.map(rItem => rItem.id = '')
                        })
                    }
                    // if (data.ruleList) {// 格式化数据
                    //     data.ruleList.map(rItem => rItem.id = '');
                    // }
                    console.log(data)

                    this.$post(this.dom.oprOpp[nodeData.nodetype], data)
                        .then(res => {
                            this.$message.success('更新成功')
                            this.updateNodeName(nodeData.formData, false);// 更新节点名称
                            this.checkOnlyNode();// 检查唯一节点是否存在
                        })
                },
                deleteNode: (nodeData) => {// 3.2.38模型配置—删除节点
                    this.$post('/mcs/node/delete', {
                        id: nodeData.id.slice(4),// 节点id    Number  Y
                    })
                        .then(res => {
                            jsPlumb.remove(nodeData.id)
                            this.checkOnlyNode();// 检查唯一节点是否存在
                        })

                },
                recoveryNode: (nodeData) => {// 3.2.40模型配置—恢复节点
                    this.$post('/mcs/node/recovery', {
                        nodeId: nodeData.id.slice(4),// 节点id    Number  Y
                        lineIdList: nodeData.lines.map(item => item.id),// 节点id    Number  Y
                    })
                        .then(res => {

                            this.createNode(nodeData);
                            this.checkOnlyNode();// 检查唯一节点是否存在
                            if (!!nodeData.lines.length) {// 有连线
                                nodeData.lines.map(item => {
                                    this.createConnection(item);
                                })
                            }
                        })
                },

                updateLine: (msg) => {// 3.2.40模型配置—连线
                    console.log('ajax更新连线中……', msg)
                    this.$post('/mcs/node/line/update', {
                        id: msg.lineId,// 连线ID    Number  Y
                        lineValue: msg.lineValue,// 连线绑定值   Number  Y
                        valueDescription: msg.valueDescription,// 值描述 Number  Y
                    })
                        .then(res => {
                            jsPlumb.getConnections().map((item, index) => {
                                if (item.id == msg.lineId) {
                                    this.updateNodeName(msg, false);
                                }
                            })
                        })
                },
                // updateLine2: (msg) => {  // 兼容修改分类器更新连线
                //     console.log(msg.canvas.dataset)
                //     console.log(msg.canvas.dataset.des)
                //     Vue.prototype.$post('/mcs/node/line/update', {
                //         id: msg.id,// 连线ID    Number  Y
                //         lineValue: msg.canvas.dataset.linevalue,// 连线绑定值   Number  Y
                //         valueDescription: msg.canvas.dataset.des,// 值描述 Number  Y
                //     })
                //         .then(res => {
                //             this.pushUpdate(this.tmp.initForm, msg);// 写入记录
                //             this.tmp.initForm = {};
                //         })
                // },
                deleteLine: (item) => {// 3.2.40模型配置—连线
                    console.log(item)
                    this.$post('/mcs/node/line/delete', {
                        id: item.id,// 连线ID    Number  Y
                    })
                        .then(res => {
                            jsPlumb.getConnections().map((info, index) => {
                                // console.log('删除',info)
                                if (item.id == info.id) {
                                    console.log('删除连线中……', info.endpoints, info)
                                    jsPlumb.deleteConnection(info);
                                }
                            })
                        })
                },
                recoveryLine: (item) => {// 3.2.44模型配置—恢复连线
                    this.$post('/mcs/node/line/recovery', {
                        id: item.id,// 连线ID    Number  Y
                    })
                        .then(res => {
                            this.createConnection(item);
                        })
                },
            },
            ajaxPush: {

                updateNode: (nodeData) => {// 3.2.37模型配置—更新节点
                    this.$post('/mcs/node/update', {
                        id: nodeData.id.slice(4),// 节点id    Number  Y
                        nodeName: nodeData.nodeName,// 节点名称    String  Y   不超过255
                        positionLeft: nodeData.positionLeft.slice(0, -2),// 距离画布左位移 Number  Y
                        positionTop: nodeData.positionTop.slice(0, -2),// 距离画布上位移 Number  Y
                    })
                        .then(res => {
                            this.pushUpdate(this.tmp.initForm, nodeData);// 写入记录
                            this.tmp.initForm = {};
                            setTimeout(() => {
                                jsPlumb.repaintEverything()
                            }, 50);// 重绘
                        })

                },

                deleteNode: (nodeData) => {// 3.2.38模型配置—删除节点
                    // alert(1)
                    console.log(nodeData.childNodes.length > 2 && nodeData.childNodes[2].className != undefined && nodeData.childNodes[2].className == 'iconKing')
                    if (nodeData.childNodes.length > 2 && nodeData.childNodes[2].className != undefined && nodeData.childNodes[2].className == 'iconKing') {
                        // nodeData = 'hasChallenger'
                        // alert(1)
                        nodeData.setAttribute('hasChallenger', 1)
                    }
                    this.$post('/mcs/node/delete', {
                        id: nodeData.id.slice(4),// 节点id    Number  Y
                    })
                        .then(res => {
                            this.pushNode(nodeData, 'delete');// 写入记录
                            this.checkOnlyNode();// 检查唯一节点是否存在
                            // location.reload()
                            jsPlumb.remove(nodeData.id);
                            // setTimeout(() => {
                            // }, 100)
                        })

                },
                createLine: (connection) => {// 3.2.40模型配置—连线
                    if (this.nodeDirect.indexOf(connection.endpoints[1].anchor.type) > -1) {
                        console.log('创建连线中……', connection.id, connection.canvas.dataset, connection.id.indexOf('con_') == -1)
                        this.$post('/mcs/node/line/create', {
                            moldId: this.$route.query.flowId,// 模型Id
                            startNodeId: connection.sourceId.slice(4),// 起始节点ID  Number  Y
                            startNodeDirect: this.nodeDirect.indexOf(connection.endpoints[0].anchor.type),// 起始节点方位  Number  Y   1：上，2：下，3：左，4：右，5左上，6右上，7左下，8右下
                            endNodeId: connection.targetId.slice(4),// 结束节点ID  Number  Y
                            endNodeDirect: this.nodeDirect.indexOf(connection.endpoints[1].anchor.type),// 结束节点访问  Number  Y   1：上，2：下，3：左，4：右，5左上，6右上，7左下，8右下
                        })
                            .then(res => {
                                connection.id = res.id;
                                console.log('ajaxPush.createLine', connection.id, res.id, connection.canvas.dataset)
                                this.pushLine(connection, 'create')
                            })
                    }
                },
                updateLine: (msg) => {// 3.2.40模型配置—连线
                    console.log('ajaxPush更新连线中……', msg)
                    this.$post('/mcs/node/line/update', {
                        id: msg.lineId,// 连线ID    Number  Y
                        lineValue: msg.lineValue,// 连线绑定值   Number  Y
                        valueDescription: msg.valueDescription,// 值描述 Number  Y
                    })
                        .then(res => {
                            this.pushUpdate(this.tmp.initForm, msg);// 写入记录
                            this.tmp.initForm = {};
                        })

                },
                updateLine2: (msg) => {  // 兼容修改分类器更新连线
                    console.log(msg)
                    console.log(msg.canvas.dataset)
                    console.log(msg.canvas.dataset.des)
                    Vue.prototype.$post('/mcs/node/line/update', {
                        id: msg.id,// 连线ID    Number  Y
                        lineValue: msg.canvas.dataset.linevalue,// 连线绑定值   Number  Y
                        valueDescription: msg.canvas.dataset.des,// 值描述 Number  Y
                    })
                        .then(res => {
                            this.pushUpdate(this.tmp.initForm, msg);// 写入记录
                            this.tmp.initForm = {};
                        })
                },
                deleteLine: (item) => {// 3.2.40模型配置—连线
                    this.$post('/mcs/node/line/delete', {
                        id: item.id,// 连线ID    Number  Y
                    })
                        .then(res => {
                            jsPlumb.getConnections().map((info, index) => {
                                // console.log('删除',info)
                                if (item.id == info.id) {
                                    this.pushLine(info, 'delete');// 写入记录
                                    console.log('ajaxPush.deleteLine:删除连线中……', info.endpoints, info)
                                    jsPlumb.deleteConnection(info);

                                }
                            })
                        })
                },
            },
        }
    },
    methods: {
        pushNode(curDom, oprType) {
            const nodeData = this.getNodeData(curDom, oprType, {});
            this.dom.push(oprType, nodeData, this)
        },
        pushLine(info, oprType) {
            const lineData = this.getLineData(info, oprType, {});
            this.dom.push(oprType, lineData, this)
        },
        pushBind(oldMsg, newMsg) {
            console.log(oldMsg)
            console.log(newMsg)
            newMsg = JSON.parse(JSON.stringify(newMsg));// 解耦
            let nodeData = this.getBindData(newMsg);
            console.log(nodeData)
            this.dom.multiPush('bind', oldMsg, nodeData, this);
        },
        pushUpdate(oldMsg, newMsg) {
            newMsg = JSON.parse(JSON.stringify(newMsg));// 解耦
            this.dom.multiPush('update', oldMsg, newMsg, this)
        },
        getNodeData(msg, oprtype = '', formData = {}) {
            return {
                id: msg.id,// 节点id    Number  Y
                nodeName: document.querySelector('#' + msg.id + '>.uml_title').innerText.replace(/[\n\s*\r]/g, ""),// 节点名称    String  Y   不超过255
                positionLeft: msg.style.left,// 距离画布左位移 Number  Y
                positionTop: msg.style.top,// 距离画布上位移 Number  Y
                // 撤销恢复
                nodetype: msg.dataset.nodetype,
                nodeType: msg.dataset.nodetype,// 首次渲染的createNode(nodeType)和恢复的createNode(nodetype)造成大小写兼容问题
                oprtype,
                formData,
                hasChallenger: msg.getAttribute('hasChallenger'),
                clear: !!msg.clear,// true:清空(res.data无数据&&要还原为初始数据),false:不清空
                // clear: !!msg.clear,// true:清空(res.data无数据&&要还原为初始数据),false:不清空
                lines: this.getNodeLines(msg),// 该节点所连线条
            }
        },
        getNodeLines(msg) {
            const curNodeLines = jsPlumb.getConnections().filter(item => item.sourceId == msg.id || item.targetId == msg.id);
            return curNodeLines.map(item => {
                return this.getLineData(item);
            })
        },
        getBindData(msg) {
            let node;
            if (this.selected.event.canvas) {// 连线
                node = this.selected.event.canvas;
            } else {// 元件
                node = this.selected.event.target;
            }
            return {
                id: msg.nodeId,// 节点id    Number  Y
                nodeName: msg.nodeName,// 节点名称    String  Y   不超过255
                positionLeft: !!node.style ? node.style.left : '',// 距离画布左位移 Number  Y
                positionTop: !!node.style ? node.style.top : '',// 距离画布上位移 Number  Y
                // 撤销恢复
                nodetype: node.dataset.nodetype,
                nodeType: node.dataset.nodetype,// 首次渲染的createNode(nodeType)和恢复的createNode(nodetype)造成大小写兼容问题
                oprtype: 'bind',
                formData: msg,
                clear: !!msg.clear,// true:清空(res.data无数据&&要还原为初始数据),false:不清空
            }
        },
        getLineData(msg, oprtype = '', formData = {}) {
            // console.log('getLineData',msg,oprtype,formData)
            return {
                id: msg.id,
                startNodeDirect: !!msg.canvas.dataset.startNodeDirect ? msg.canvas.dataset.startNodeDirect : '',
                startNodeId: msg.sourceId,
                endNodeDirect: !!msg.canvas.dataset.endNodeDirect ? msg.canvas.dataset.endNodeDirect : '',
                endNodeId: msg.targetId,
                lineValue: !!msg.canvas.dataset.linevalue ? msg.canvas.dataset.linevalue : '',
                valueDescription: !!msg.canvas.dataset.des ? msg.canvas.dataset.des : '',
                oprtype,
                formData,
                nodetype: 'line',
                nodeType: 'line',
                allowrevoke: msg.canvas.dataset.allowrevoke,// 提前注册
            }
        },
    }
}
