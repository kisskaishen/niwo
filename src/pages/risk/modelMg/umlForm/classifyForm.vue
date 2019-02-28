<template>
    <div class="pages_classifyForm">
        <!--<div class="pages_classifyForm" v-loading="loading">-->
        <el-form class="classifyForm" :model="classifyForm" status-icon :rules="rules"
                 v-show="$route.name=='classifyForm'">
            <el-form-item label="">
                <div class="w300 overhide" v-if="$route.query.type=='look'">
                    {{classifyForm.categoryName}}
                </div>
                <el-input v-else class="w310" v-model="classifyForm.categoryName"
                          :class="{'solid_red':vLock&&!classifyForm.categoryName}" placeholder="请输入分类器名称" size="medium"
                          clearable></el-input>
                <!-- <span class="stratAdd f_blue pointer mg_l_20" @click="stratAdd" v-if="$route.query.type!='look'">+新建分类</span> -->
            </el-form-item>
            <div class="defaultClassify mg_b_20">默认分类：其他</div>
            <div class="classifyForm_bd">
                <policyItem ref="policyItem" :classifyForm="classifyForm" :vLock="vLock" :variableListUml="variableList"
                            :ruleTmplListUml="ruleTmplList" @classify_plus="classify_plus"
                            @classify_remove="classify_remove"/>
            </div>
            <div class="mg_t_20">
                <el-button class="" type="primary" size="medium" @click="bindCategory()"
                           v-if="$route.query.type!='look'">保存
                </el-button>
            </div>
        </el-form>
        <router-view :variableListUml="variableList" :ruleTmplListUml="ruleTmplList" @createStratSuccess="pushStrat"/>
    </div>
</template>

<script>
    import {ajax} from '../umlMixin/ajax'
    import policyItem from '../../../../components/pc/policy/policyItem'

    export default {
        name: 'pages_classifyForm',
        data() {
            return {
                loading: true,
                pageName: 'pages_classifyForm',
                show: {},
                rules: {},// 表单验证规则
                /* 数据提交 */
                classifyForm: {
                    nodeId: '',// 节点ID    Number  Y
                    nodeName: '',// 节点名称    String
                    categoryName: '分类器',//分类器名称   String
                    policyList: [/*{//分类器分类列表 List  //【【不注释：表单验证是name为空。注释了，新建时，没有初始化项】】
                    appId:'',// 产品线ID
                    id:'',// 策略名称   String  Y   
                    policyName:'',// 策略名称   String  Y   
                    logic:'',// 逻辑操纵    Number  Y   
                    policyShow:false,
                    ruleList:[{// 规则分类    List    Y   
                        id:'',// 规则ID    Number  Y   
                        ruleName:'',// 规则名称    String  Y   不超过255
                        decisionCode:'',// 规则编码    String  Y   不超过255
                        logic:'',// 逻辑操作    Numbrt  Y   1：与，2：或   
                        ruleConShow:false,// 是否展开
                        ruleContent:[{// 规则内容    List    Y   
                            variableId:'',// 变量ID    Number  Y   不超过255
                            variableName:'',// 变量名 String  Y   不超过255
                            variableType:'',// 变量类型 Number  N   1：字符串，2：整型，3：浮点型，4：日期型，5：枚举，6：布尔型
                            logic:1,// 逻辑操作    Numbrt  Y   1：与，2：或
                            oprList:[],// 注册oprList操作符列表
                            operationArray:[],// 操作符 Array Y多选
                            content:[{// 规则内容    List    Y   
                                operation:'',// 操作符 Number  Y   不超过255
                                operationValue:'',// 操作值 String  Y   不超过255
                                valueDescription:'',// 操作值描述   Numbrt  Y   1：与，2：或
                                sort:'',// 顺序  Number  N   
                            }],
                        }],                 
                    }],                    
                }*/],
                },
                vLock: false,// 是否开启验证提示
                isNewNode: true,// 是否是新节点
                variableList: [],
                ruleTmplList: [],
                allEnmuList: [],
                oprList: [{id: 1, name: '='}, {id: 2, name: '!='}, {id: 3, name: 'is null'}, {id: 4, name: '>'}, {
                    id: 5,
                    name: '>='
                }, {id: 6, name: '<'}, {id: 7, name: '<='}, {id: 8, name: 'startsWith'}, {id: 9, name: 'contains'}],
                oprList_str: [{id: 1, name: '='}, {id: 2, name: '!='}, {id: 3, name: 'is null'}, {
                    id: 8,
                    name: 'startsWith'
                }, {id: 9, name: 'contains'}],
                oprList_num: [{id: 1, name: '='}, {id: 2, name: '!='}, {id: 4, name: '>'}, {id: 5, name: '>='}, {
                    id: 6,
                    name: '<'
                }, {id: 7, name: '<='}],
                oprList_bl: [{id: '1', name: '是'}, {id: '0', name: '否'}],
            }
        },
        props: ['variableListUml', 'ruleTmplListUml'],
        components: {policyItem},
        created() {
            this.variableList = this.variableListUml;
            this.ruleTmplList = this.ruleTmplListUml;
            this.getClassifyNode();// 老节点则获取节点数据
            // this.getOprList_enumList()
        },
        methods: {
            /************************ classifyForm添加分类&&移除分类 ************************/
            classify_plus(index) {// 添加分类
                if (true) {
                    let polifyEmpty = {// 空分类    List    Y
                        appId: '',// 产品线ID
                        id: '',// 策略名称   String  Y
                        policyName: '',// 策略名称   String  Y
                        logic: '',// 逻辑操纵    Number  Y
                        ruleList: [{// 规则分类    List    Y
                            id: '',// 规则ID    Number  Y
                            ruleName: '',// 规则名称    String  Y   不超过255
                            decisionCode: '',// 规则编码    String  Y   不超过255
                            logic: '',// 逻辑操作    Numbrt  Y   1：与，2：或
                            ruleConShow: true,// 是否展开
                            ruleContent: [{// 规则内容    List    Y
                                variableId: '',// 变量ID    Number  Y   不超过255
                                variableName: '',// 变量名 String  Y   不超过255
                                variableType: '',// 变量类型 Number  N   1：字符串，2：整型，3：浮点型，4：日期型，5：枚举，6：布尔型
                                logic: 1,// 逻辑操作    Numbrt  Y   1：与，2：或
                                oprList: [],// 注册oprList操作符列表
                                operationArray: [],// 操作符 Array Y多选
                                content: [{// 规则内容    List    Y
                                    operation: '',// 操作符 Number  Y   不超过255
                                    operationValue: '',// 操作值 String  Y   不超过255
                                    valueDescription: '',// 操作值描述   Numbrt  Y   1：与，2：或
                                    sort: '',// 顺序  Number  N
                                }],
                            }],
                        }],// 规则分类    List    Y
                        policyShow: true,// 是否展开
                    };
                    this.classifyForm.policyList.splice(index + 1, 0, polifyEmpty)
                } else {
                    this.$notify({// 通知提示
                        message: '添加过多',
                        type: 'warning'
                    })
                }
            },
            classify_remove(item, index) {// 移除分类
                let hasBind = jsPlumb.getConnections().length && jsPlumb.getConnections().some(cell => {
                    jsPlumb.getConnections().map(item => {
                        item.canvas.dataset.bdcolor = '';
                    })// 清除所有连线飘红状态
                    const hasBindLine = cell.canvas.dataset.linevalue && cell.canvas.dataset.linevalue == item.id;
                    if (hasBindLine) {
                        cell.canvas.dataset.bdcolor = 'red';
                    }
                    return hasBindLine;
                })
                // console.log('移除分类',hasBind,jsPlumb.getConnections()[0].canvas.dataset.linevalue==item.id)
                if (hasBind) {
                    this.$notify({// 通知提示
                        message: '删除失败，请先删除分类线条。',
                        type: 'warning'
                    })
                } else {
                    this.classifyForm.policyList.splice(index, 1);
                    if (this.classifyForm.policyList.length < 1) {
                        this.classify_plus(item, index)
                        !item.policyName && this.$notify({// 通知提示
                            message: '不能再删了',
                            type: 'warning'
                        })
                    }
                }
            },
            /************************ classifyForm表单验证&&表单保存&&表单重置 ************************/
            validateClassifyForm() {
                this.vLock = true;// 开启验证提示
                let classifyNum = this.classifyForm.policyList.filter((classify) => {
                    let classifyOpen = classify.policyShow ? this.$refs.policyItem.validateStrat(classify) : true;
                    return classify.policyName && classifyOpen;
                }).length;
                console.log('完整Classify', classifyNum, '所有Classify', this.classifyForm.policyList.length)
                return !!this.classifyForm.categoryName && (classifyNum == this.classifyForm.policyList.length);
            },
            reNameLineLable(pItem) {
                jsPlumb.getConnections().map(item => {
                    if (item.canvas.dataset.linevalue == pItem.id) {
                        item.canvas.dataset.des = pItem.policyName;
                        item.getOverlay("label").setLabel(pItem.policyName);
                    }
                })
            },
            bindCategory() {// 绑定分类器
                let _self = this;
                let data = JSON.parse(JSON.stringify(this.classifyForm))
                console.log(data)
                data.nodeId = this.$route.query.nodeId.slice(4);
                data.policyList.map((pItem, pIndex) => {
                    pItem.ruleList.map((rItem, rIndex) => {
                        rItem.id = '';
                    })
                })
                if (this.validateClassifyForm()) {
                    let _self = this;
                    this.$post('/mcs/node/category/bind', data)
                        .then(res => {
                            this.$message.success('绑定成功')
                            data.nodeName = this.classifyForm.categoryName;
                            data.nodeId = this.$route.query.nodeId;
                            data.formtype='classifyForm'
                            this.updateLineValue(data)
                            console.log(data)
                            this.$emit('saveForm', data);// 关闭弹窗

                            this.resetClassifyForm();// 重置stratForm
                        })
                } else {
                    let msg = ''
                    data.policyList.map(item => {
                        if (item.policyName == '') {
                            msg = '已有变量名'
                        } else if (item.logic == '') {
                            msg = '逻辑运算符'
                        } else {
                            msg = '信息'
                        }
                    })


                    this.$notify({// 通知提示
                        message: `分类器${msg}必填`,
                        type: 'warning',
                        customClass: 'pos-classifyForm',
                    })
                }
            },
            resetClassifyForm() {// 重置stratForm
                this.classifyForm = {// 空分类
                    categoryName: '',// 分类器名称   String
                    policyList: [],// 分类器分类列表 List
                }
                this.classify_plus();
                this.vLock = false;// 关闭验证提示
            },
            /************************ classifyForm自动运行获取数据 ************************/
            // updateLineValue(oldData, newData) {
            updateLineValue(oldData) {
                // console.log(11111111,oldData.policyList,newData.policyList)
                if (oldData) {
                    console.log(oldData)
                    oldData.policyList.map((item, index) => {
                        if (oldData.policyList[index]) {
                            item.oldId = oldData.policyList[index].id;
                            item.policyName = oldData.policyList[index].policyName;
                        }
                    })
                    jsPlumb.getConnections().map(cell => {
                        oldData.policyList.map((item, index) => {
                            console.log(cell.canvas.dataset)
                            console.log(index, cell.canvas.dataset.linevalue, item.oldId)
                            if (cell.canvas.dataset.linevalue == item.oldId) {
                                console.log('【更新线条ID】', '现:', cell.canvas.dataset.linevalue, '缓存:', item.oldId, '新:', item.id)
                                cell.canvas.dataset.linevalue = item.id;
                                cell.canvas.dataset.des = item.policyName;
                                console.log(cell)
                                ajax.data().ajaxPush.updateLine2(cell)
                            }
                        })

                        if (cell.canvas.dataset.selected == "1") {
                            this.$route.query.lineValue = cell.canvas.dataset.linevalue;// 更新没有显示在url中
                        }
                    })
                }
            },
            getClassifyNode() {// 3.2.40模型配置—查看分类器节点
                let _self = this;
                this.$post('/mcs/node/category/query', {
                    nodeId: this.$route.query.nodeId.slice(4),// 节点ID    Number  Y
                })
                    .then(res => {
                        if (!!res) {// 老节点
                            if (res.policyList) {
                                res.policyList.map((item) => {
                                    item.policyShow = false;//  默认不展开
                                    // item.ruleList = [];// 预先注册ruleContent
                                    item.ruleList.map((ruleItem, ruleIndex) => {
                                        ruleItem.ruleConShow = false;
                                        ruleItem.ruleContent.map((ruleConItem, ruleConIndex) => {
                                            ruleConItem.sort = ruleConIndex;
                                            ruleConItem.operationArray = ruleConItem.content.map(conItem => conItem.operationValue);// 渲染枚举型
                                            ruleConItem.oprList = [];// 注册oprList操作符列表
                                            this.getVarType(ruleConItem, ruleConIndex, 0)// 获取变量类型及相应的操作符列表
                                        })
                                        if (!ruleItem.isTemplate) {// 非模板，id没在规则列表里，所以直接显示名称
                                            ruleItem.id = ruleItem.ruleName;
                                        }
                                    })
                                })
                                Object.assign(this.classifyForm, res);
                            } else {
                                this.classify_plus();// 添加一条空的
                            }
                        } else {// 新节点
                            this.classify_plus()
                        }
                        {// 撤销恢复：记录绑定的初始版本
                            let data = JSON.parse(JSON.stringify(this.classifyForm))
                            data.nodeName = this.classifyForm.categoryName;
                            data.nodeId = this.$route.query.nodeId;
                            data.clear = !res;
                            this.$emit('firstBindPush', data)
                        }
                        this.loading = false
                    })
            },
            /************************ stratForm：新建策略&&插入策略 ************************/
            stratAdd() {// 新建策略
                let query = this.$route.query;
                query.policyType = 2;
                this.$router.push({path: '/risk/modelMg/modelUml/classifyForm/stratForm', query: query});
            },
            pushStrat(stratForm) {
                this.classifyForm.policyList = this.classifyForm.policyList.filter((item) => {// 清除未完成的规则操作
                    return !!item.policyName;
                })
                this.classifyForm.policyList.push(stratForm);// 保存进策略规则列表
                this.$router.push({path: '/risk/modelMg/modelUml/classifyForm', query: this.$route.query});
            },
            /************************ 与varItem公用的方法 ************************/
            getVarType(item, ruleConIndex, index) {
                this.allEnmuList = this.$refs['policyItem'].allEnmuList

                this.variableList.map((varItem) => {
                    if (item.variableId == varItem.variableId) {
                        item.variableName = varItem.variableName;
                        item.variableType = varItem.variableType;
                        // console.table(Object.entries(varItem))
                        if (varItem.variableType == 1) {// 1：字符串(==、!=、is null、startsWith、contains)
                            item.oprList = this.oprList_str;
                        } else if (varItem.variableType == 2 || varItem.variableType == 3 || varItem.variableType == 4) {// 2：整型，3：浮点型，4：日期型(排除is nll+startsWith+contains)
                            item.oprList = this.oprList_num;
                        } else if (varItem.variableType == 5) {// 5：枚举(多选)，
                            item.oprList = []
                            this.allEnmuList.map(cell => {
                                if (item.variableId == cell.variableId) {
                                    cell.id = cell.enumValue;
                                    cell.name = cell.enumName;
                                    item.oprList.push(cell)
                                }
                            })
                            // this.getOprList_enumList(item, ruleConIndex, index);// 获取变量枚举值列表
                        } else if (varItem.variableType == 6) {// 6：布尔型(是否)
                            item.oprList = this.oprList_bl;
                        } else {
                            this.$notify({// 通知提示
                                message: '未知变量',
                                type: 'warning'
                            })
                        }
                    }
                })
            },
            // getOprList_enumList(item, ruleConIndex, index) {// 3.2.12获取变量枚举值列表
            //     // console.table(Object.entries(item))
            //     let _self = this;
            //     this.$post('/mcs/variable/enums',{
            //         variableId: item.variableId,// 变量ID  Number  Y
            //     })
            //         .then(res=>{
            //             res.enumList.map((cell) => {
            //                 cell.id = cell.enumValue;
            //                 cell.name = cell.enumName;
            //             })
            //             item.oprList = res.enumList;
            //         })
            // },
            getOprList_enumList() {// 3.2.12获取变量枚举值列表
                // console.table(Object.entries(item))
                let _self = this;
                this.$post('/mcs/variable/enum/list', {
                    // variableId: item.variableId,// 变量ID  Number  Y
                })
                    .then(res => {
                        this.allEnmuList = res.enumList
                    })
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    .pages_classifyForm {
        min-width: 720px;
        padding-bottom: 40px;
        .classifyForm {
            margin-top: 32px;
            .classifyForm_bd {

            }
        }
    }
</style>
