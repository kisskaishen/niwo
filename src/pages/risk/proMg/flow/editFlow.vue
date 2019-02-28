<template>
    <div class="pages_editFlow" v-loading="loading">
        <!--<breadcrumb></breadcrumb>-->
        <div class="uml_hd">
            <div class="titleDiv" v-if="$route.query.type=='edit'">
                <p>产品线：{{modelAdd.productName}}</p>
                <p>流程名称：
                    <el-input v-model="modelAdd.moldName" maxLength="15"
                              @blur="modelNameChange(modelAdd.moldName)"></el-input>
                </p>
                <p>版本号：V{{modelAdd.moldVersion}}</p>
                <p>流程编码：{{modelAdd.moldCode}}</p>
                <el-popover
                    placement="right-start"
                    title="备注"
                    width="300"
                    trigger="hover"
                    v-model="visible">
                    <!--:content="(content.remark)">-->
                    <el-input type="textarea" v-model="modelAdd.remark"
                              style="width: 280px;white-space: normal;word-break: break-all"></el-input>
                    <div class="btnDiv"
                         style="display: flex;justify-content: center;align-items: center;margin-top: 16px">
                        <el-button size="small" @click="visible=false">取消</el-button>
                        <el-button type="primary" size="small" @click="modelNameChange(modelAdd.remark)">保存</el-button>
                    </div>
                    <span slot="reference">备注信息：<i></i></span>
                </el-popover>

                <p>修改时间：{{content.updateTime}}</p>
                <p>修改人：{{content.updateBy}}</p>
            </div>
            <div class="titleDiv" v-if="$route.query.type=='look'">
                <p>产品线：{{modelAdd.productName}}</p>
                <p>流程名称：{{modelAdd.moldName}}</p>
                <p>版本号：V{{modelAdd.moldVersion}}</p>
                <p>流程编码：{{modelAdd.moldCode}}</p>


                <el-popover
                    placement="right-start"
                    title="备注"
                    width="300"
                    trigger="hover"
                    v-model="visible">
                    <p style="width: 280px;white-space: normal;word-break: break-all">{{modelAdd.remark}}</p>
                    <span slot="reference">备注信息：<i></i></span>
                </el-popover>

                <p>修改时间：{{content.updateTime}}</p>
                <p>修改人：{{content.updateBy}}</p>
            </div>
            <div class="menuDiv">
                <div class="uml_back" id="uml_back" @click="goBack('/risk/proMg/businessList')">
                    <div class="uml_icon" alt="返回"></div>
                    <p class="uml_title">返回</p>
                </div>
                <div class="leftRight">
                    <div class="uml_revoke" id="uml_revoke" @click="revoke">
                        <div class="uml_icon" alt="撤销"></div>
                        <p class="uml_title">撤销</p>
                    </div>
                    <div class="uml_recovery" id="uml_recovery" @click="recovery">
                        <div class="uml_icon" alt="恢复"></div>
                        <p class="uml_title">恢复</p>
                    </div>
                </div>
                <div class="uml uml_start" id="uml_start" data-nodetype="1" :draggable="draggable&&!hasNode.start"
                     @dragstart="dragstart($event)" @drag="drag($event)" @dragend="dragend($event)">
                    <div class="uml_icon" alt="开始"></div>
                    <p class="uml_title">开始</p>
                </div>
                <div class="uml uml_classify" id="uml_classify" data-nodetype="3" :draggable="draggable"
                     @dragstart="dragstart($event)" @drag="drag($event)" @dragend="dragend($event)"
                     data-modal='/risk/proMg/editFlow/classifyForm'>
                    <div class="uml_icon" alt="分类器"></div>
                    <p class="uml_title">分类器</p>
                </div>
                <!--isking=='1'说明已经添加了冠军挑战者：就是原来的-->
                <div class="uml uml_strat" id="uml_strat" data-nodetype="4" :draggable="draggable"
                     @dragstart="dragstart($event)" @drag="drag($event)" @dragend="dragend($event)"
                     data-modal='/risk/proMg/editFlow/stratForm' v-if="$route.query.moldType==1">
                    <div class="uml_icon" alt="策略"></div>
                    <p class="uml_title">策略</p>
                    <!--<i class="iconKing" v-if="isKing"></i>-->

                    <div class="kingDiv" v-if="$route.query.type=='edit'">
                        <i class="iconAdd" data-modal='/risk/proMg/businessList/editFlow/kingForm'
                           onclick="_self.switchForm(event)"></i>
                        <div class="kingFormAdd">添加冠军/挑战者</div>
                    </div>
                </div>

                <div class="uml uml_parallel" id="uml_parallel" data-nodetype="7" :draggable="draggable"
                     @dragstart="dragstart($event)" @drag="drag($event)" @dragend="dragend($event)"
                     data-modal='/risk/proMg/editFlow/parallelForm' v-if="$route.query.moldType==1">
                    <div class="uml_icon" alt="并行"></div>
                    <p class="uml_title">并行</p>
                </div>
                <div class="uml uml_outFrand" id="uml_outFrand" data-needmoldtype="1" data-nodetype="8"
                     :draggable="draggable"
                     @dragstart="dragstart($event)" @drag="drag($event)" @dragend="dragend($event)"
                     data-modal='/risk/proMg/businessList/editFlow/outFrandForm' v-if="$route.query.moldType==5">
                    <div class="uml_icon" alt="决策流"></div>
                    <p class="uml_title">决策流</p>
                    <div class="kingDiv" v-if="$route.query.type=='edit'">
                        <i class="iconAdd" data-modal='/risk/proMg/businessList/editFlow/kingForm'
                           onclick="_self.switchForm(event)"></i>
                        <div class="kingFormAdd">添加冠军/挑战者</div>
                    </div>
                </div>
                <div class="uml uml_credit" id="uml_credit" data-needmoldtype="3" data-nodetype="9"
                     :draggable="draggable"
                     @dragstart="dragstart($event)" @drag="drag($event)" @dragend="dragend($event)"
                     data-modal='/risk/proMg/businessList/editFlow/creditForm' v-if="$route.query.moldType==5">
                    <div class="uml_icon" alt="风险定价"></div>
                    <p class="uml_title">风险定价</p>
                    <div class="kingDiv" v-if="$route.query.type=='edit'">
                        <i class="iconAdd" data-modal='/risk/proMg/businessList/editFlow/kingForm'
                           onclick="_self.switchForm(event)"></i>
                        <div class="kingFormAdd">添加冠军/挑战者</div>
                    </div>
                </div>

                <div class="uml uml_scoreCard" id="uml_scoreCard" data-needmoldtype="4" data-nodetype="5"
                     :draggable="draggable"
                     @dragstart="dragstart($event)" @drag="drag($event)" @dragend="dragend($event)"
                     data-modal='/risk/proMg/businessList/editFlow/scoreCardForm'
                     v-if="$route.query.moldType==3||$route.query.moldType==5">
                    <div class="uml_icon" alt="评分卡"></div>
                    <p class="uml_title">评分卡</p>

                    <div class="kingDiv" v-if="$route.query.type=='edit'">
                        <i class="iconAdd" data-modal='/risk/proMg/businessList/editFlow/kingForm'
                           onclick="_self.switchForm(event)"></i>
                        <div class="kingFormAdd">添加冠军/挑战者</div>
                    </div>
                </div>

                <div class="uml uml_calculator" id="uml_calculator" data-nodetype="6" :draggable="draggable"
                     @dragstart="dragstart($event)" @drag="drag($event)" @dragend="dragend($event)"
                     data-modal='/risk/proMg/editFlow/computecard' v-if="$route.query.moldType==3">
                    <div class="uml_icon" alt="计算卡"></div>
                    <p class="uml_title">计算卡</p>
                </div>
                <div class="uml uml_end" id="uml_end" data-nodetype="2" :draggable="draggable&&!hasNode.end"
                     @dragstart="dragstart($event)" @drag="drag($event)" @dragend="dragend($event)">
                    <div class="uml_icon" alt="结束"></div>
                    <p class="uml_title">结束</p>
                </div>
            </div>
        </div>
        <div class="modelUmlDiv">
            <!-- <div class="uml_bd wh100" id="uml_bd" @mousedown="clickLock=0" @mousemove="clickLock=1" @mouseup="closeForm($event)" @drop="drop($event)" @dragover="dragover($event)"></div> -->
            <div class="uml_bd wh100" id="uml_bd" @click="switchForm($event)" v-if="$route.query.type=='look'"></div>
            <!-- 使用jsPlumb.draggable来捕捉click -->
            <div class="uml_bd wh100" id="uml_bd" @click.self="switchForm($event)" v-else></div>
        </div>
        <!-- 使用jsPlumb.draggable来捕捉click -->
        <span class="dragTmp" id="dragTmp"></span><!-- 放大拖拽图标，但被原生图标覆盖 -->
        <span class="dragIcon" id="dragIcon"></span>
        <transition name="slide-fade">
            <div class="uml_form bg_fff pd_l_20 pd_r_20 scrollY" v-if="show.policyType&&$route.name!='editFlow'">
                <router-view :policyType="show.policyType" :variableListUml="variableList"
                             :ruleTmplListUml="ruleTmplList" @firstBindPush="firstBindPush"
                             @firstBindLine="firstBindLine" @saveForm="saveForm"/>
            </div>
        </transition>
    </div>
</template>

<script>
    window._self = '';// 用于在原生DOM里面调用Vue方法
    import {importDefaults, endpoint} from '../../../../resource/js/jsPlumbConf'

    let jsPlumb = require('jsplumb').jsPlumb;
    import {reqData, xyCorrect, h5Drag, pageOpr} from './flowMixin/initFn'
    import {revoke} from './flowMixin/revoke'
    import {oprDom, umlDomFn, selectFn} from './flowMixin/oprDom'
    import {ajax, ajaxPush} from './flowMixin/ajax'

    export default {
        data() {
            return {
                loading: true,
                pageName: 'pages_editFlow',
                show: {
                    policyType: '',
                },
                nodeDirect: ["TopRight", "TopLeft", "BottomLeft", "BottomRight", "TopCenter", "BottomCenter", "LeftMiddle", "RightMiddle"],
                dragCur: {
                    id: '',
                    x: 0,
                    y: 0,
                    index: 0,
                    bdWidth: 0,
                    bdHeight: 0,
                },
                selected: {
                    umlId: '',
                    event: '',
                },
                clickLock: 0,
                content: {},
                hasNode: {
                    start: false,
                    end: false,
                    abTest: false,
                },
                modelTitle: {
                    show: false,
                },
                modelAdd: {
                    id: this.$route.query.flowId,
                    productName: '',
                    moldName: '',
                    moldCode: '',
                    remark: '',
                    moldType: '',
                    moldVersion: '',// 模型版本    String  N   例如：1.00、1.01
                    moldStatus: '',// 模型状态    Number  N   1：未上线，2：已上线，3：已下线
                },
                rules: {
                    // 模型编辑
                    moldName: [
                        {required: true, message: '请输入模型名称', trigger: 'blur,change'}
                    ],
                    referMoldId: [
                        {required: true, message: '请输入模型编码', trigger: 'blur,change'}
                    ],
                    remark: [
                        {required: false, message: '请输入备注信息', trigger: 'blur,change'}
                    ],
                },
                variableList: [],
                ruleTmplList: [],
                visible: false,
                allowClick: true,// 是否允许点击


                // isKing: false,            // 显示king，else显示add
            }
        },
        computed: {
            draggable() {
                return this.$route.query.type == 'edit';
            },
            allowNext() {
                return !!this.modelAdd.moldName && !!this.modelAdd.moldCode;
            },
        },
        beforeCreate() {
            if (this.$route.query.type == 'look') {
                this.$route.meta.title = '查看流程'
            } else if (this.$route.query.type == 'edit') {
                this.$route.meta.title = '编辑流程'
            }
        },
        created() {
            this.getRuleModelList();// 所有表单公用的变量列表
            this.returnEditFlow();
            this.getContent();
            this.getVariableList();// 所有表单公用的变量列表

            // this.$bus.$on('content', val => {
            //     this.getContent();
            // })
        },
        mounted() {
            // jsPlumb.fire("jsPlumbDemoLoaded", jsPlumb);
            this.getUmlBdSize();// 控制画布区域
            window.onresize = () => {
                this.getUmlBdSize()
            };// 控制画布区域
            this.keydown();
            _self = this;
        },
        beforeRouteLeave(to, from, next) {
            console.log('【】【】【】【销毁】【】【】【】')
            this.his = [];// 初始化历史记录
            jsPlumb.reset();
            next();
        },
        mixins: [reqData, xyCorrect, h5Drag, pageOpr, umlDomFn, selectFn, ajax, oprDom, revoke],
        methods: {
            revoke() {// 撤销
                if (this.$route.query.type == 'edit') {
                    console.log('撤销', this.pointer)
                    if (this.pointer >= 0 && this.his.length) {
                        this.his[this.pointer].revoke(this);
                        this.pointer--;
                    } else {
                        this.$notify({// 通知提示
                            message: '不能再撤销',
                            type: 'warning'
                        })
                    }
                }
            },
            recovery() {// 恢复
                if (this.$route.query.type == 'edit') {
                    if (this.pointer < this.his.length - 1) {
                        this.pointer++;
                        this.his[this.pointer].recovery(this);
                    } else {
                        this.$notify({// 通知提示
                            message: '不能再恢复',
                            type: 'warning'
                        })
                    }
                }
            },
            /************************ 老节点：渲染收据 ************************/
            // 通过接口mcs/mold/content，获取
            rendNodeList() {
                {// 实例化
                    jsPlumb = jsPlumb.importDefaults(importDefaults);
                    this.lineFn();// 连线事件
                }
                let arrHeight = []
                this.content.nodeList.map((item, index) => {// 渲染节点
                    item.positionTop = item.positionTop + 'px';
                    item.positionLeft = item.positionLeft + 'px';
                    item.id = 'uml_' + item.id;
                    this.createNode(item)
                    arrHeight.push(item.positionTop.split('px')[0])
                })
                console.log(Math.max(...arrHeight))
                document.getElementById('uml_bd').style.height = Math.max(...arrHeight) + 100 + 'px'

                // // 渲染节点，并根据数据布局
                // this.content.nodeList.map((item, index) => {// 渲染节点
                //     item.positionTop = item.positionTop + 'px';
                //     item.positionLeft = item.positionLeft + 'px';
                //     item.id = 'uml_' + item.id;
                //     this.createNode(item)
                // })
                this.content.lineList.map((item, index) => {// 连线
                    this.createConnection(item, this)
                    {// 保存所有连线的初始位置
                        this.lineInitArr.push(item);
                    }
                })
                if (this.$route.query.type == 'look') {// 隐藏端点，禁止拖动现有连线
                    document.querySelectorAll('.jtk-endpoint').forEach((item, index) => {
                        item.style.display = 'none';
                    })
                }
                this.checkOnlyNode();// 检查唯一节点是否存在
            },
            /************************ 新节点：jsPlumb方法 ************************/
            jsPlumbReady(target) {
                let curDom = document.getElementById(this.dragCur.id);
                curDom.style.top = document.getElementById('dragTmp').style.top.split('px')[0] - 60 + 'px';
                curDom.style.left = document.getElementById('dragTmp').style.left;
                target.appendChild(curDom);
                this.checkOnlyNode();// 检查唯一节点是否存在
                this.$post('/mcs/node/create', {
                    moldId: this.$route.query.flowId,// 模型ID    Number  Y
                    nodeName: curDom.innerText.replace(/[\n\s*\r]/g, ""),// 节点名称    String  Y   不超过255
                    nodeType: curDom.dataset.nodetype,// 节点类型    Number  Y   1：开始，2：结束，3：分类器，4：策略，5：评分卡，6：计算卡，7：AB测试，8：并行
                    positionLeft: curDom.style.left.slice(0, -2),// 距离画布左位移 Number  Y
                    positionTop: curDom.style.top.slice(0, -2),// 距离画布上位移 Number  Y
                })
                    .then(res => {
                        this.dragCur.id = curDom.id = 'new_' + res.id;
                        this.pushNode(curDom, 'create')
                        jsPlumb.ready(() => {
                            this.jsPlumb_addEndpoint(this.dragCur.id);// 增加锚点
                            this.jsPlumb_draggable(document.getElementById(this.dragCur.id), 'new');// 监听拖拽钩子
                            this.umlHover();// 操作画布内已存在的元素
                        });
                        document.getElementById('dragTmp').style.display = 'none';
                    })
            },
            jsPlumb_draggable(node, isNew) {// 监听拖拽钩子
                if (this.$route.query.type == 'edit') {
                    jsPlumb.draggable(node, {// 添加拖拽事件
                        containment: 'parent',// 设定拖动范围
                        // grid: [10, 10],// 节点网格对齐
                        beforeStart: (info) => {// bug:点击也会触发：在start里面push进beforeStart时的Dom信息
                            // console.log('【beforeStart】_' + isNew, info)
                            this.tmp.initForm = this.getNodeData(info.el, 'update');
                        },
                        start: (info) => {
                            // console.log('【start】_' + isNew, info)
                            info.el["beginPos"] = [info.el.offsetLeft, info.el.offsetTop]
                            info.el["beginTime"] = new Date().getTime()
                        },
                        drag: (info) => {
                            let arrHeight = []
                            this.content.nodeList.map((item, index) => {// 渲染节点
                                arrHeight.push(item.positionTop.split('px')[0])
                            })
                            // console.log('arrHeight:' + Math.max(...arrHeight))
                            // console.log('top:' + info.el.style.top.split('px')[0])
                            if (Math.max(...arrHeight) > info.el.style.top.split('px')[0]) {
                                document.getElementById('uml_bd').style.height = Math.max(...arrHeight) + 'px'
                            } else if (info.el.style.top.split('px')[0] > 630 && Math.max(...arrHeight) < info.el.style.top.split('px')[0]) {
                                document.getElementById('uml_bd').style.height = parseInt(info.el.style.top.split('px')[0]) + 200 + 'px'
                            } else if (info.el.style.top.split('px')[0] > 630 && info.el.style.top.split('px')[0] < 680 && Math.max(...arrHeight) < info.el.style.top.split('px')[0]) {
                                document.getElementById('uml_bd').style.height = 630 + 'px'
                            } else {
                                info.el.style.top = info.el.style.top;
                            }

                            if (info.el.style.left.split('px')[0] > 1640) {
                                info.el.style.left = 1640 + 'px';
                            } else {
                                info.el.style.left = info.el.style.left;
                            }
                        },
                        stop: (info) => {// 保存节点位置
                            if (info.el.beginPos[0] == info.el.offsetLeft && info.el.beginPos[1] == info.el.offsetTop &&
                                new Date().getTime() - info.el.beginTime <= 200) {
                                return
                            }
                            this.allowClick = false;// jsplumb的拖拽会触发点击事件，所以设置点击开关
                            setTimeout(() => {
                                this.allowClick = true;
                            }, 100)
                            // console.log('【stop】_' + isNew, info)
                            const nodeData = this.getNodeData(info.el, 'update');
                            this.ajaxPush.updateNode(nodeData);// 更新节点
                        },
                    })
                }
            },
            jsPlumb_addEndpoint(id) {// 添加端点
                if (this.$route.query.type == 'edit') {// 编辑模式，才添加锚点
                    this.nodeDirect.map((item, index) => {
                        // console.log('节点',document.getElementById(id))
                        let endpointNode = jsPlumb.addEndpoint(id, {
                            anchor: item,
                            cssClass: item + ' ' + id + '_endpoint ' + (id + '_' + item),
                            hoverClass: item + '_hover',
                        }, endpoint.style(document.getElementById(id).dataset.nodetype, this));
                        // doc:https://jsplumbtoolkit.com/community/doc/events.html#evt-endpoint-click
                        endpointNode.bind('click', (endpoint, originalEvent) => {
                            // console.log('click',endpoint,originalEvent)
                        })
                        endpointNode.bind('dblclick', (endpoint, originalEvent) => {
                            // console.log('dblclick',endpoint,originalEvent)
                        })
                        endpointNode.bind('contextmenu', (endpoint, originalEvent) => {// 右键点击
                            // console.log('contextmenu',endpoint,originalEvent)
                        })
                        endpointNode.bind('mouseover', (endpoint, originalEvent) => {
                            // console.log('mouseover',endpoint,originalEvent)
                        })
                        endpointNode.bind('mouseout', (endpoint, originalEvent) => {
                            // console.log('mouseout',endpoint,originalEvent)
                        })
                        endpointNode.bind('mousedown', (endpoint, originalEvent) => {
                            // console.log('mousedown',endpoint,originalEvent)
                        })
                        endpointNode.bind('mouseup', (endpoint, originalEvent) => {
                            // console.log('mouseup',endpoint,originalEvent)
                        })
                        endpointNode.bind('maxConnections', (info, originalEvent) => {// 超出最大连接时
                            // console.log('maxConnections',info,originalEvent)
                        })
                        // console.log('端点',document.querySelectorAll('.'+id+'_endpoint'))
                    })
                }
                if (this.$route.query.type != 'edit') {
                    $('.kingDiv').hide()
                }
            },
            /************************ 修改模型 ************************/
            modelNameChange(val) {
                this.modelEdit()
                this.visible = false
            }
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    .pages_editFlow {
        position: relative;
        margin: 0 -40px;
        * {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        .uml_title {
            max-width: 90px;
            overflow: hidden;
            white-space: normal;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        .uml_hd {
            width: 100%;
            background: #FAFAFA;
            box-shadow: 5px 0px 5px 0 #eaeaea inset;
            .titleDiv {
                /*width: 100%;*/
                padding: 10px 40px;
                border-bottom: 1px solid #EAEDF5;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                p {
                    margin-right: 40px;
                    .el-input {
                        width: 160px;
                        .el-input__inner {
                            height: 30px !important;
                            line-height: 30px !important;
                        }
                    }
                }
                .el-popover__title {
                    text-align: center !important;
                }
                .el-popover__reference {
                    cursor: pointer;
                    margin-right: 40px;
                    &:hover {
                        i {
                            background: url("../../../../resource/img/icon/icon-remark-hover.png") no-repeat center /100%;
                        }

                    }
                    i {
                        display: inline-block;
                        width: 14px;
                        height: 16px;
                        background: url("../../../../resource/img/icon/icon-remark.png") no-repeat center /100%;
                        vertical-align: middle;

                    }
                }
                .el-popover {
                    .el-button {
                        text-align: center;
                    }
                }

            }
            /*.btnDiv {*/
            /*width: 100%;*/
            /*display: flex;*/
            /*justify-content: space-around;*/
            /*align-items: center;*/
            /*}*/
            .menuDiv, .leftRight {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                text-align: center;
                cursor: pointer;
                padding: 10px 0;
                .uml_title {
                    font-size: 12px;
                }
            }
            .uml_back {
                padding: 0 22px;
                border-right: 1px solid #CED1DB;
            }
            .uml_revoke, .uml_start {
                padding-left: 22px;
            }
            .uml_recovery {
                padding-right: 22px;
                border-right: 1px solid #CED1DB;
            }
            .uml_top {
                width: 100px;
                line-height: 30px;
                position: absolute;
                top: 0;
                left: 50%;
                margin-left: -50px;
            }
        }
        .modelUmlDiv {
            position: absolute;
            left: 0;
            top: 134px;
            width: 100%;
            height: 700px;
            overflow-y: scroll;

        }
        .uml_bd {
            position: relative;
            min-height: 700px !important;
            .kingDiv {
                .kingFormAdd {

                }
            }
        }
        .uml {
            position: relative;
        }
        .uml_form {
            max-width: 760px;
            border-left: 1px solid #E4E7F2;
            position: absolute;
            top: 136px;
            right: 0px;
            bottom: 0;
            height: 700px;
            z-index: 9;
            margin-right: 40px !important;
        }
        .dragTmp {
            position: absolute;
            display: none;
        }
        .uml_back .uml_icon {
            background-image: url(../../../../resource/img/uml/opr/back.png)
        }
        .uml_revoke .uml_icon {
            background-image: url(../../../../resource/img/uml/opr/revoke.png)
        }
        .uml_recovery .uml_icon {
            background-image: url(../../../../resource/img/uml/opr/recovery.png)
        }
        .uml_start .uml_icon {
            background-image: url(../../../../resource/img/uml/opr/start.png)
        }
        .uml_classify .uml_icon {
            background-image: url(../../../../resource/img/uml/opr/classify.png)
        }
        .uml_strat .uml_icon {
            background-image: url(../../../../resource/img/uml/opr/strat.png)
        }
        .uml_parallel .uml_icon {
            background-image: url(../../../../resource/img/uml/opr/parallel.png)
        }
        .uml_outFrand .uml_icon {
            background-image: url(../../../../resource/img/uml/opr/outFrand.png);
            background-position: center 0;
        }
        .uml_credit .uml_icon {
            background-image: url(../../../../resource/img/uml/opr/credit.png);
            background-position: center 0;

        }
        /*.uml_parallelStrat .uml_icon{background-image:url(../../../../resource/img/uml/opr/parallelStrat.png)}*/
        /*.uml_together .uml_icon{background-image:url(../../../../resource/img/uml/opr/together.png)}*/
        .uml_test .uml_icon {
            background-image: url(../../../../resource/img/uml/opr/test.png)
        }
        .uml_end .uml_icon {
            background-image: url(../../../../resource/img/uml/opr/end.png)
        }

        .uml_scoreCard .uml_icon {
            background-image: url(../../../../resource/img/uml/opr/scoreCard.png)
        }
        .uml_calculator .uml_icon {
            background-image: url(../../../../resource/img/uml/opr/calculator.png)
        }
        .uml_icon {
            width: 54px;
            height: 26px;
            margin-bottom: 4px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 24px auto;
            margin: 0 auto;
        }
        .uml_bd, .dragTmp {
            .uml {
                position: relative;
                padding: 6px 0px 2px 0px;
                text-align: center;
                cursor: pointer;
                transition: all 0.01s ease;
                &:before {
                    content: '';
                    position: absolute;
                    top: -10px;
                    left: -10px;
                    bottom: -10px;
                    right: -10px;
                }
                .uml_icon {
                    height: 40px;
                    margin-bottom: 4px;
                    background-size: 40px auto;
                }
                .uml_title {
                    width: 90px;
                    font-size: 14px;
                    position: absolute;
                    top: 101%;
                    left: 50%;
                    margin-left: -45px;
                }
                &.selected, &[data-selected='1'] {
                    border: 1px solid #40BDEC;
                    box-shadow: 0px 0px 5px 0 #40BDEC;
                    border-radius: 10px;
                }
            }
            .jtk-endpoint { // 连线两端的端点，遮盖八方端点，防止一个端点拖出多条线
                z-index: 2;
                cursor: pointer;
                display: none; // 隐藏锚点
                opacity: 0.1;
                /*padding:12px;*/
                /*background: #0f0;*/
                /*border: 1px solid #ff000059;*/
                /*&.jtk-drag-active{
                    opacity: 1;// 拖拽连线时，显示端点
                }*/
                &:before {
                    content: '';
                    width: 8px;
                    height: 8px;
                    border: 1px solid #DCDFE6;
                    position: absolute;
                    top: 4px;
                    left: 4px;
                    z-index: 2;
                }
                &:hover {
                    opacity: 1;
                    &:before {
                        border: 1px solid #409EFF;
                    }
                }
                &.TopRight, &.TopLeft, &.BottomLeft, &.BottomRight, &.TopCenter, &.BottomCenter, &.LeftMiddle, &.RightMiddle { // 八方端点
                    display: block; // 显示端点
                }
            }
            .jtk-connector { // 连线
                z-index: 1;
                cursor: pointer;
                &.selected, &[data-selected="1"] { // 选中连线/** Jim修改于2018-10-30 16:33:20 @换用API实现 */
                    .jtk-connector-outline {
                        stroke: #00b9ff;
                        stroke-width: 4;
                    }
                }
                &[data-bdcolor="red"] { // 飘红连线
                    .jtk-connector-outline {
                        stroke: #F56C6C;
                        stroke-width: 4;
                    }
                    path:last-child { // 箭头
                        fill: #F56C6C;
                    }
                }
            }
            .jtk-overlay { // 覆蓋层
                &.lineLabel {
                    cursor: pointer;
                    color: #5F5D5D;
                    transform: translate(-50%, -100%) !important;
                    z-index: 2;
                }
            }
        }
        .uml_hd, .dragTmp {
            .uml {
                .kingDiv {
                    display: none;
                }
            }
        }
        .uml_bd { // 添加皇冠
            .uml {
                position: relative;
                .iconKing {
                    position: absolute;
                    top: -4px;
                    right: 2px;
                    display: block;
                    width: 20px;
                    height: 20px;
                    background: url("../../../../resource/img/icon/model-king.png") no-repeat center / 100%;
                    z-index: 9;
                }
                .iconKing {
                    display: block;
                    width: 20px;
                    height: 20px;
                    background: url("../../../../resource/img/icon/model-king.png") no-repeat center / 100%;
                }
                .kingDiv {
                    display: none;
                    position: absolute;
                    left: 26px;
                    top: -20px;
                    padding: 10px;
                    .iconAdd {
                        display: block;
                        width: 10px;
                        height: 10px;
                        background: url("../../../../resource/img/icon/model-add.png") no-repeat center / 10px;
                    }

                    .kingFormAdd {
                        display: none;
                        position: absolute;
                        left: 22px;
                        top: -15px;
                        background: #fff;
                        border: 1px solid #ccc;
                        padding: 2px 4px;
                        border-radius: 3px;
                    }
                }
                &:hover {
                    .kingDiv {
                        display: block;
                        &:hover {
                            .kingFormAdd {
                                display: block;
                            }
                        }
                    }
                }
            }
        }
    }

    .uml_modelAddForm {
        padding: 10px;
        &.item_b_0 {
            .el-form-item {
                margin-bottom: 0;
            }
        }
        .mg_b_0 {
            margin-bottom: 0;
        }
        .moldRemark {
            .el-form-item__content {
                .el-textarea__inner {
                    padding-bottom: 16px;
                }
                .counter {
                    line-height: 20px;
                    position: absolute;
                    right: 15px;
                    bottom: 0;
                }
            }
            &.look {
                .el-form-item__content {
                    padding: 12px 0 0 15px;
                    line-height: 1.5;
                }
            }
        }
        /* 表格里面输入框查看状态 */
        .el-input, .el-textarea {
            &.is-disabled {
                &, * {
                    border: 0;
                    background: #fff;
                    color: #333;
                    cursor: auto;
                    .el-input__suffix {
                        display: none;
                    }
                }
            }
        }
    }
</style>

