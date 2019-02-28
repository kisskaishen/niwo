/************************ 获取数据 ************************/
export const reqData = {
    methods: {
        getRuleModelList() {// 3.2.15查询规则模板列表
            this.$post('/mcs/rule/template/list', {
                appId: this.appId ? this.appId : this.$route.query.appId,// 产品线ID   Number  N
                ruleName: '',// 规则名称    String  N
                ruleStatus: '',// 规则状态    Number  N   1：有效，2：无效
                createStartDate: '',// 创建开始时间  String  N   yyyy-MM-dd HH:mm:ss
                createEndDate: '',// 创建结束时间  String  N   yyyy-MM-dd HH:mm:ss
                updateStartDate: '',// 更新开始时间  String  N   yyyy-MM-dd HH:mm:ss
                updateEndDate: '',// 更新结束时间  String  N   yyyy-MM-dd HH:mm:ss
                pageNo: -1,// 页码  Number  N
                pageSize: '',// 页大小 Number  N
            })
                .then(res => {
                    this.ruleTmplList = res.ruleList;

                })
        },
        getVariableList() {// 3.2.5查询变量列表
            let _self = this;
            this.$post('/mcs/variable/config/list', {
                appId: _self.$route.query.appId,//产品线ID   Number  N
            })
                .then(res => {
                    this.variableList = res.variableList;
                })

        },
        modelEdit() {// 模型编辑
            this.$post('/mcs/mold/edit', this.modelAdd)
                .then(res => {
                    this.$message.success('修改成功')
                    this.modelTitle.show = false;
                })
        },
        getContent() {// 3.2.35模型配置—获取模型配置内容
            this.$post('/mcs/mold/content', {
                id: this.$route.query.modelId
            })
                .then(res => {
                    this.content = res;
                    this.rendNodeList();
                    this.loading = false
                    {
                        /** Jim修改于2018-10-09 15:19:56 @初始化模型信息 */
                        this.modelAdd.moldName = res.moldName;
                        this.modelAdd.moldCode = res.moldCode;
                        this.modelAdd.remark = !!res.remark ? res.remark : '';
                        this.modelAdd.moldType = res.moldType;
                        this.modelAdd.moldVersion = res.moldVersion / 100;
                        this.modelAdd.moldStatus = res.moldStatus;
                    }
                })
        },
    }
}
/************************ 坐标矫正方法 ************************/
export const xyCorrect = {
    methods: {
        getUmlBdSize() {
            this.dragCur.bdWidth = document.getElementById('uml_bd').scrollWidth;
            this.dragCur.bdHeight = document.getElementById('uml_bd').scrollHeight + 100;
            // console.log(this.dragCur.bdWidth)
            // console.log(this.dragCur.bdHeight)
        },
        jsPlumb_correctX(e) {// 纠正拖动坐标
            if (e.x < (255)) {
                return 0;
            } else if (e.x > this.dragCur.bdWidth + 190) {// 反差
                return this.dragCur.bdWidth - 60;
            } else {
                return e.x - 200 - e.target.scrollWidth;
            }
        },
        jsPlumb_correctY(e) {// 纠正拖动坐标
            if (e.y < 96) {
                return 0;
            } else if (e.y <= 196) {
                return e.y - 100;
            } else if (e.y > this.dragCur.bdHeight + 120) {// 正差
                return this.dragCur.bdHeight + 20;
            } else {
                return e.y - 100;
            }
        },
    }
}
/************************ 原生拖拽方法 ************************/
export const h5Drag = {
    methods: {
        dragstart(e) {// 从工具栏开始拖动元素时
            // console.log("drag start", e)
            if (e.target.dataset.nodetype == undefined) {
                this.$message.warning('未选择有效的拖拽元件');
                return
            }
            this.dragCur.index++;
            let crt = e.target.cloneNode(true);
            crt.setAttribute('onclick', '_self.switchForm(event)');
            this.dragCur.id = crt.id = e.target.id + '_' + this.dragCur.index;
            crt.style.position = "absolute";
            document.getElementById('dragTmp').appendChild(crt);
            e.dataTransfer.effectAllowed = 'move';// 修改拖拽图标
            e.dataTransfer.setDragImage(document.getElementById('dragIcon'), 0, 0);// 修改拖拽图标
            {// 火狐兼容
                e.dataTransfer.setData('text', '')
            }
        },
        drag(e) {// 从工具栏拖动过程中
            // console.log('拖拽中', e.x, e.y)
            document.getElementById('dragTmp').style.display = 'block';
            document.getElementById('dragTmp').style.left = this.jsPlumb_correctX(e) + 20 + 'px';
            document.getElementById('dragTmp').style.top = this.jsPlumb_correctY(e) - 80 + 'px';
            // document.querySelector('#dragTmp .uml_title').innerText = e.x + ',' + e.y + ',' + this.jsPlumb_correctX(e) + this.jsPlumb_correctY(e);
        },
        dragend(e) {// 从工具栏拖放再画布时
            if (e.target.dataset.nodetype == undefined) {
                return
            }
            document.getElementById('dragTmp').style.left = this.jsPlumb_correctX(e) + 20 + 'px';
            document.getElementById('dragTmp').style.top = this.jsPlumb_correctY(e) - 140 + 'px';
            this.dragCur.x = e.x;
            this.dragCur.y = e.y;
            if (e.y < 256) {
                document.getElementById('dragTmp').style.top = 60 + 'px';
            }


            this.jsPlumbReady(document.getElementById('uml_bd'))
        },
        drop(e) {// 在拖动元素放置在目标区域时触发
            console.log('drop拖拽放下', e.x, e.y)
            e.preventDefault();
        },
        dragover(e) {// 拖动元素在放置目标上时触发
            e.preventDefault();
        },
    }
}
/************************ 页面交互方法 ************************/
export const pageOpr = {
    methods: {
        switchForm(e) {
            console.log("点击切换表单事件：", e)
            // 点击连线不在这边操作
            // e.preventDefault();
            this.returnModelUml();
            console.log("是否允许点击: ", this.allowClick);
            if (this.allowClick) {
                this.show.policyType = '';
                if (e.target.className == 'iconAdd') {// 点击+号
                    // console.log(e)
                    console.log(e.target.parentNode.parentNode)
                    this.setKingNodeSelect(e.target.parentNode.parentNode);// 选中元件

                    this.$route.query.nodeId = e.target.parentNode.parentNode.id;
                    let query = this.$route.query
                    if (this.$route.query.moldType == '3') {
                        query.needmoldtype = e.target.parentNode.parentNode.dataset.needmoldtype
                    }
                    this.$router.push({path: e.target.dataset.modal, query: query});
                    this.switchPath(e.target.dataset.modal);
                } else if (e.canvas && e.canvas.dataset.modal) {// 点击连线：分类器连线
                    this.setSelect(e);// 选中元件
                    this.$route.query.lineValue = e.canvas.dataset.linevalue;
                    this.$route.query.lineId = e.canvas.dataset.lineid;
                    this.$route.query.nodeId = e.canvas.dataset.sourceid;
                    this.$router.push({path: e.canvas.dataset.modal, query: this.$route.query});
                    this.switchPath(e.canvas.dataset.modal);
                } else if (e.target.dataset.modal) {// 点击元件：有弹窗
                    console.log(e)
                    this.setSelect(e);// 选中元件
                    this.$route.query.nodeId = e.target.id;
                    this.$route.query.needmoldtype = e.target.dataset.needmoldtype;
                    this.switchPath(e.target.dataset.modal);
                    if (e.target.lastElementChild.classList[0] == 'iconKing' || e.target.lastElementChild.childNodes[0].className == 'iconKing') {
                        this.setSelect(e);

                        if (this.$route.query.moldType == '1') {
                            this.$router.push({
                                path: e.target.dataset.modal.replace('/stratForm', '/kingForm'),
                                query: this.$route.query
                            });
                        } else if (this.$route.query.moldType == '3') {
                            let path = e.target.dataset.modal.replace('/scoreCardForm', '/kingForm')
                            let query = this.$route.query
                            query.needMoldType = e.target.dataset.needmoldtype
                            this.$router.push({
                                path: path,
                                query: query
                            });

                        }
                    } else {
                        this.$router.push({path: e.target.dataset.modal, query: this.$route.query});
                    }
                } else if (e.target.dataset.nodetype == 1 || e.target.dataset.nodetype == 2) {// 点击元件：开始结束
                    this.setSelect(e);// 选中元件
                } else {// 点击其他：无弹窗连线、空白
                    this.clearSelect();// 清除选中
                    this.returnModelUml();
                    this.switchPath('/risk/modelMg/modelUml');
                }
                jsPlumb.repaintEverything();// 重绘
            }
        },
        switchForm2(e) {
            e.preventDefault();
            console.log('switchForm2', e.target.dataset.modal)
            this.show.policyType = '';
            if (this.$route.name == 'modelUml') {// 关闭时打开
                this.$route.query.nodeId = e.target.id;
                this.$router.push({path: e.target.dataset.modal, query: this.$route.query});
                this.switchPath(e.target.dataset.modal);
            } else {// 打开时关闭
                this.returnModelUml();
            }
        },
        updateNodeName(msg, allowPush = true) {// 更新节点名称，并添加一条数据记录
            console.log('普通绑定后更新节点名称时的msg=', msg)
            //console.log(document.querySelector('#' + msg.nodeId + ' .uml_title'))
            //console.log(document.querySelector('#' + msg[0].nodeId + ' .uml_title'))
            console.log("是否可撤销的操作：", allowPush)

            if (msg.lineId) {// 修改连线文字
                // 如果有lineId修改连线名称
                //console.log('msg.lineId=' + msg.lineId)
                console.log('修改连线文字', jsPlumb.getConnections(), msg)
                jsPlumb.getConnections().map((item, index) => {
                    // console.log(item,item.id,msg.lineValue)
                    if (item.id == msg.lineId) {
                        item.getOverlay("label").setLabel(msg.valueDescription);
                        item.canvas.dataset.linevalue = msg.lineValue;// 连线绑定的分类ID
                        item.canvas.dataset.des = msg.valueDescription;// 连线绑定的分类名称
                        allowPush && this.ajaxPush.updateLine(msg);// 3.2.40模型配置—连线
                    }
                })
            } else if (msg.formType == 'policyKing') {
                console.log("策略添加冠军挑战这绑定 updateNodeName, 请求参数：", msg)

                if (msg.data.length == 1) {
                    document.querySelector('#' + msg.nodeId).title = msg.nodeName;// 修改节点名称
                    document.querySelector('#' + msg.nodeId + ' .uml_title').innerText = msg.data[0].policyName;// 修改节点名称
                    let deleteKingDiv = document.querySelector('#' + msg.nodeId).getElementsByClassName('iconKing')[0]
                    if (deleteKingDiv) {
                        this.switchKingDiv(msg.nodeId);
                    }
                } else {

                    let maxItem = msg.data[0];

                    if (msg.formType2 == 'scoreKing') {

                        msg.data.map(element => {
                            if (element.rate > maxItem.rate) {
                                maxItem = element;
                            }
                        });
                    } else {
                        msg.data.map(element => {
                            if (element.rate > maxItem.rate) {
                                maxItem = element;
                            }
                        });
                    }
                    let kingDiv = '';
                    kingDiv = `<i class="iconKing" data-modal='/risk/modelMg/modelUml/kingForm' onclick="_self.switchForm(event)"></i>`
                    let node = document.createElement('div');

                    node.innerHTML = kingDiv
                    console.log(document.querySelector('#' + msg.nodeId))
                    console.log(document.querySelector('#' + msg.nodeId).getElementsByClassName('kingDiv')[0])
                    console.log(document.querySelector('#' + msg.nodeId).childNodes[2].getAttribute('class') == 'kingDiv')
                    // console.log(document.querySelector('#' + msg.nodeId).lastChild.getAttribute('class') == 'kingDiv')


                    // let deleteKingDiv = document.querySelector('#' + msg.nodeId).lastChild.getAttribute('class') == 'kingDiv' ?
                    //     document.querySelector('#' + msg.nodeId).getElementsByClassName('kingDiv')[0] :
                    // document.querySelector('#' + msg.nodeId).lastChild
                    // document.querySelector('#' + msg.nodeId).childNodes.map((item,index)=>{
                    //     if (item.getAttribute('class')=='')
                    // })
                    // let deleteKingDiv = document.querySelector('#' + msg.nodeId).childNodes[2].getAttribute('class') == 'kingDiv' ?
                    //     document.querySelector('#' + msg.nodeId).childNodes[2]:
                    //     document.querySelector('#' + msg.nodeId).lastChild
                    let deleteKingDiv = document.querySelector('#' + msg.nodeId).getElementsByClassName('kingDiv')[0]
                    if (msg.clear) {
                        deleteKingDiv = document.querySelector('#' + msg.nodeId).getElementsByClassName('kingDiv')[0]
                    } else {
                        deleteKingDiv = document.querySelector('#' + msg.nodeId).lastChild
                    }

                    if (msg.formType2 == 'scoreKing') {
                        deleteKingDiv = document.querySelector('#' + msg.nodeId).lastChild

                    }
                    console.log("节点下的kingdiv：", deleteKingDiv, !deleteKingDiv);
                    // console.log(document.querySelector('#' + msg.nodeId))
                    // console.log(document.querySelector('#' + msg.nodeId).lastChild)
                    if (deleteKingDiv) {
                        document.querySelector('#' + msg.nodeId).removeChild(deleteKingDiv);
                        document.querySelector('#' + msg.nodeId).appendChild(node);
                    }

                    document.querySelector('#' + msg.nodeId).title = maxItem.policyName || maxItem.bindName;// 修改节点名称
                    document.querySelector('#' + msg.nodeId + ' .uml_title').innerText = maxItem.policyName || maxItem.bindName;// 修改节点名称
                    //
                    // msg.data.map((pItem, pIndex) => {
                    //     console.log(pItem)
                    //     // jsPlumb.getConnections().map(item => {
                    //     //     if (item.canvas.dataset.linevalue == pItem.id) {
                    //     //         item.getOverlay("label").setLabel(pItem.policyName);
                    //     //         // item.canvas.dataset.linevalue = msg.lineValue;// 连线绑定的分类ID
                    //     //         item.canvas.dataset.des = pItem.policyName;
                    //     //     }
                    //     // })
                    // })
                }
                console.log("用于撤销请求的请求参数：", this.tmp.initForm)
                console.log(msg)
                allowPush && this.pushBind(this.tmp.initForm, msg);// 记录一条绑定数据
                this.tmp.initForm = {};
                
            } else if (msg.formType == 'policy') {
                console.log("策略绑定 updateNodeName, 请求参数：", msg)
                document.querySelector('#' + msg.nodeDomId).title = msg.nodeName || msg.nodeName;// 修改节点名称
                document.querySelector('#' + msg.nodeDomId + ' .uml_title').innerText = msg.nodeName || msg.nodeName;// 修改节点名称
                // msg.policyList.map((pItem, pIndex) => {
                //     jsPlumb.getConnections().map(item => {
                //         if (item.canvas.dataset.linevalue == pItem.id) {
                //             item.getOverlay("label").setLabel(pItem.policyName);
                //             item.canvas.dataset.des = pItem.policyName;
                //         }
                //     })
                // })
                console.log("用于撤销请求的请求参数：", this.tmp.initForm)
                allowPush && this.pushBind(this.tmp.initForm, msg);// 记录一条绑定数据
                this.tmp.initForm = {};
            } else if (!!document.querySelector('#' + msg.nodeId + ' .uml_title')) {
                // 如果有msg.nodeId存在修改元件的名称
                console.log("存在msg.nodeId元件", document.querySelector('#' + msg.nodeId + ' .uml_title'))
                document.querySelector('#' + msg.nodeId).title = msg.nodeName;// 修改节点名称
                document.querySelector('#' + msg.nodeId + ' .uml_title').innerText = msg.nodeName;// 修改节点名称

                if (msg.policyList) {// 此处可能是分类器，也有可能是策略

                    // console.log('修改分类器连线文字', jsPlumb.getConnections(), msg)
                    console.log(msg);
                    console.log("msg.policyList不为空");
                    if (!allowPush) {
                        console.log('撤销操作')
                        let iconKing = document.querySelector('#' + msg.nodeId).getElementsByClassName('iconKing')[0]
                        let kingDiv = document.querySelector('#' + msg.nodeId).getElementsByClassName('kingDiv')[0]
                        if (msg.policyList.length > 1) {
                            if (!iconKing && kingDiv) {
                                this.switchIconKing(msg.nodeId)
                            }
                        } else if (msg.policyList.length === 1) {
                            if (iconKing && !kingDiv) {
                                this.switchKingDiv(msg.nodeId);
                            }
                        }
                    }
                    if (!!msg.categoryName) {
                        msg.policyList.map((pItem, pIndex) => {
                            jsPlumb.getConnections().map(item => {
                                if (item.canvas.dataset.linevalue == pItem.id) {
                                    item.getOverlay("label").setLabel(pItem.policyName);
                                    // item.canvas.dataset.linevalue = msg.lineValue;// 连线绑定的分类ID
                                    item.canvas.dataset.des = pItem.policyName;
                                }
                            })
                        })
                    }

                }
                if (msg.bindMoldList) {// 兼容模型中评分卡

                    // console.log('修改分类器连线文字', jsPlumb.getConnections(), msg)
                    console.log(msg);
                    console.log("msg.bindMoldList不为空");
                    if (!allowPush) {
                        console.log('撤销操作')
                        let iconKing = document.querySelector('#' + msg.nodeId).getElementsByClassName('iconKing')[0]
                        let kingDiv = document.querySelector('#' + msg.nodeId).getElementsByClassName('kingDiv')[0]
                        if (msg.bindMoldList.length > 1) {
                            if (!iconKing && kingDiv) {
                                this.switchIconKing(msg.nodeId)
                            }
                        } else if (msg.bindMoldList.length === 1) {
                            if (iconKing && !kingDiv) {
                                this.switchKingDiv(msg.nodeId);
                            }
                        }
                    }
                    if (!!msg.categoryName) {
                        msg.bindMoldList.map((pItem, pIndex) => {
                            jsPlumb.getConnections().map(item => {
                                if (item.canvas.dataset.linevalue == pItem.id) {
                                    item.getOverlay("label").setLabel(pItem.policyName);
                                    // item.canvas.dataset.linevalue = msg.lineValue;// 连线绑定的分类ID
                                    item.canvas.dataset.des = pItem.policyName;
                                }
                            })
                        })
                    }

                }
                // alert(allowPush)
                // if (allowPush) {
                console.log("用于撤销请求的请求参数：", this.tmp.initForm)
                allowPush && this.pushBind(this.tmp.initForm, msg);// 记录一条绑定数据
                this.tmp.initForm = {};
                // }

                if (msg.clear === true) {
                    console.log("撤销表单的首次绑定操作");
                    let deleteKingDiv = document.querySelector('#' + msg.nodeId).getElementsByClassName('iconKing')[0]
                    console.log("是否存在冠军挑战者:", deleteKingDiv);
                    if (deleteKingDiv) {
                        this.switchKingDiv(msg.nodeId);
                    }
                }
            } else {

            }
        },
        switchKingDiv(nodeId) {
            let deleteKingDiv = document.querySelector('#' + nodeId).getElementsByClassName('iconKing')[0]
            let kingDiv = `<i class="iconAdd" data-modal='/risk/modelMg/modelUml/kingForm' onclick="_self.switchForm(event)"></i>
                            <div class="kingFormAdd">添加冠军/挑战者</div>`
            let node = document.createElement('div');
            node.className = "kingDiv"
            node.innerHTML = kingDiv
            document.querySelector('#' + nodeId).removeChild(deleteKingDiv.parentNode);
            document.querySelector('#' + nodeId).appendChild(node);
        },
        switchIconKing(nodeId) {
            let kingDiv = `<i class="iconKing" data-modal='/risk/modelMg/modelUml/kingForm' onclick="_self.switchForm(event)"></i>`;
            let node = document.createElement('div');
            node.innerHTML = kingDiv
            let deleteKingDiv = document.querySelector('#' + nodeId).getElementsByClassName('kingDiv')[0]
            document.querySelector('#' + nodeId).removeChild(deleteKingDiv);
            document.querySelector('#' + nodeId).appendChild(node);
        },
        firstBindPush(msg) {
            msg = JSON.parse(JSON.stringify(msg));// 解耦
            console.log('firstBindPush初始版本', msg)
            this.tmp.initForm = this.getBindData(msg);
        },
        firstBindLine(msg) {
            msg = JSON.parse(JSON.stringify(msg));// 解耦
            console.log('firstBindLine初始版本', msg)
            this.tmp.initForm = msg;
        },
        // 保存请求数据，如果有formType，说明是冠军挑战者然后更新节点名称，否则正常更新节点名称
        saveForm(msg) {
            console.log('保存后的msg')
            console.log(msg)
            msg = JSON.parse(JSON.stringify(msg));// 解耦
            // console.log('绑定成功', msg, formType)
            this.updateNodeName(msg);// 更新节点名称
            jsPlumb.repaintEverything();// /** Jim修改于2018-10-25 15:50:32 @修复所有，重绘 */            
            this.returnModelUml();
            this.clearSelect();// 清除选中
        },
        returnModelUml() {// 返回画板页面
            // console.log('返回画板页面')
            this.$local.delete('scoreList')
            this.$local.delete('policyList')
            this.$local.delete('formIndex')
            this.$local.delete('scoreList')
            delete this.$route.query.lineId;
            delete this.$route.query.lineValue;
            delete this.$route.query.nodeId;
            delete this.$route.query.from;
            delete this.$route.query.policyId;
            delete this.$route.query.needmoldtype;
            this.$router.push({path: '/risk/modelMg/modelUml', query: this.$route.query});
        },
        closeForm(e) {
            e.preventDefault();
            if (this.clickLock === 0) {//点击
                // console.log('点击closeForm',e.target.dataset.modal)  
                this.switchForm(e);// 展开弹窗
            } else if (this.clickLock === 1) {//拖曳
                // console.log('拖拽closeForm',e.target.dataset.modal) 
            }
        },
        switchPath(path) {
            setTimeout(() => {
                switch (path) {
                    case '/risk/modelMg/modelUml/stratForm':
                        this.show.policyType = 1;
                        break;
                    case '/risk/modelMg/modelUml/classifyForm':
                        this.show.policyType = 2;
                        break;
                    case '/risk/modelMg/modelUml/parallelForm':
                        this.show.policyType = 3;
                        break;
                    default:
                        this.show.policyType = true;
                        break;
                }
            }, this.$route.name == 'modelUml' ? 0 : 300)
        },
        goBack(path) {
            // this.$emit('getListAgain',true)
            this.$router.push(path)
        },
    },

}
