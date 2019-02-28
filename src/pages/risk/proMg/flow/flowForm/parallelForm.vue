<template>
    <div class="pages_parallelForm">
        <el-form class="parallelForm pd_t_20" :model="parallelForm" status-icon ref="parallelForm"
                 v-show="$route.name=='parallelForm'">
            <el-form-item label="">
                <div class="w300 overhide" v-if="$route.query.type=='look'">
                    {{parallelForm.parallelName}}
                </div>
                <el-input v-else class="w310" :class="{'solid_red':vLock&&!parallelForm.parallelName}"
                          v-model="parallelForm.parallelName" placeholder="请输入并行名称" size="medium" clearable></el-input>
                <!-- <span class="stratAdd f_blue pointer mg_l_20" @click="stratAdd" v-if="$route.query.type!='look'">+新建策略</span> -->
            </el-form-item>
            <!-- 决策意见：选择现有策略才显示，新建不显示 -->
            <div class="parallelForm_sug">
                <p class="sug_title">决策意见：<span class="f12 f_999" v-if="$route.query.type=='edit'">位置可拖拽移动</span></p>
                <el-form-item class="" label-width="0px" v-for="(item,index) in parallelForm.decisions" :key="index">
                    <el-select :popper-append-to-body="true" class="w150" v-model.number="item.result" placeholder="请选择"
                               size="medium"
                               no-match-text="查询无结果" no-data-text="暂无数据" popper-class="stratList conResult"
                               :disabled="$route.query.type=='look'"
                               v-if="isNewNode?item.sort==3:(item.condition==1&&item.result!=-1)">
                        <el-option v-for="(conResIitem,conResIndex) in conResultList" :key="conResIndex"
                                   :label="conResIitem.name" :value="conResIitem.id"></el-option>
                    </el-select>
                    <span class="w150 inlineBlock text-right" v-else>
                		{{item.condition==0?'任意':'全部'}}策略{{item.result==0?'未命中':(item.result==1?'命中':'异常')}}：
                	</span>
                    <el-select :popper-append-to-body="true" class="w150" v-model.number="item.decision"
                               placeholder="请选择" size="medium"
                               :disabled="$route.query.type=='look'"
                               no-match-text="查询无结果" no-data-text="暂无数据" popper-class="stratList decision">
                        <el-option v-for="(decIitem,decIndex) in decisionList" :key="decIndex" :label="decIitem.name"
                                   :value="decIitem.id"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div class="parallelForm_bd mg_t_20">
                <policyItem ref="policyItem" :classifyForm="parallelForm" :variableListUml="variableList"
                            :ruleTmplListUml="[]" :vLock="vLock" @classify_plus="classify_plus"
                            @classify_remove="classify_remove" @stratAdd="stratAdd"/>
            </div>
            <div class="text-center mg_t_20">
                <el-button class="" type="primary" size="medium" @click="bindParallel()"
                           v-if="$route.query.type!='look'">保存
                </el-button>
            </div>

        </el-form>
        <router-view @createStratSuccess="pushStrat" @createRuleSuccess="pushRule" @getVarType="getVarType"
                     :variableListUml="variableList" :variableList="variableList" :icon="icon"/>
    </div>
</template>

<script>
    let icon = {
        warn: require('img/icon/warn_gray.png'),
        sort: require('img/icon/sort.png'),
        arrowLeft: require('img/icon/arrowLeft.png'),
    }
    import policyItem from '../../../../../components/pc/policy/policyItem'

    export default {
        name: 'pages_parallelForm',
        data() {
            return {
                pageName: 'pages_parallelForm', icon,
                show: {},
                parallelForm: {
                    nodeId: '',// 节点ID	Number	Y
                    nodeName: '',
                    parallelName: '并行',// 并行节点名	String	Y
                    decisions: [// 决策建议	List	Y
                        {condition: 1, result: 1, decision: 0, sort: 1},
                        {condition: 1, result: 0, decision: 0, sort: 2},
                        {condition: 0, result: 1, decision: 0, sort: 3},
                        {condition: 1, result: -1, decision: 0, sort: 4},
                        {condition: 0, result: 1, decision: 0, sort: 5},
                    ],
                    policyList: [],// 并行计算的策略	List	Y
                },
                decisionList: [{id: 0, name: '通过'}, {id: 1, name: '拒绝'}, {id: 2, name: '人工审核'}, {id: 3, name: '继续执行'}],
                conResultList: [{id: 1, name: '任意策略命中'}, {id: 0, name: '任意策略未命中'}],
                vLock: false,
                isNewNode: true,
                /************************ 后台直接返回ruleList：自动获取oprList ************************/
                variableList: [],// 变量列表
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
        props: ['variableListUml'],
        components: {policyItem},
        created() {
            this.variableList = this.variableListUml;
            if (this.variableListUml.length) {
                this.getParallelNode();// 老节点则获取节点数据
            } else {
                this.getVariableList();// 3.2.5查询变量列表
            }
        },
        methods: {
            /************************ parallelForm添加分类&&移除分类 ************************/
            classify_plus() {// 添加分类
                if (true) {
                    let polifyEmpty = {// 空分类    List    Y   
                        appId: '',// 产品线ID
                        id: '',// 策略名称   String  Y
                        policyName: '',// 策略名称   String  Y
                        logic: '',// 逻辑操纵    Number  Y
                        policyShow: true,//  默认不展开
                        ruleList: [{// 规则分类    List    Y
                            id: '',// 规则ID    Number  Y
                            ruleName: '',// 规则名称    String  Y   不超过255
                            decisionCode: '',// 规则编码    String  Y   不超过255
                            logic: '',// 逻辑操作    Numbrt  Y   1：与，2：或
                            ruleConShow: false,// 是否展开
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
                    };
                    this.parallelForm.policyList.push(polifyEmpty)
                } else {
                    this.$notify({// 通知提示
                        message: '添加过多',
                        type: 'warning'
                    })
                }
            },
            classify_remove(item, index) {// 移除分类
                this.parallelForm.policyList.splice(index, 1);
                if (this.parallelForm.policyList.length < 1) {
                    this.classify_plus(item, index)
                    !item.policyName && this.$notify({// 通知提示
                        message: '不能再删了',
                        type: 'warning'
                    })
                }
            },
            /************************ parallelForm表单验证&&表单保存&&表单重置 ************************/
            validateParallelForm() {
                this.vLock = true;// 开启验证提示
                let classifyNum = this.parallelForm.policyList.filter((classify) => {
                    let classifyOpen = classify.policyShow ? this.$refs.policyItem.validateStrat(classify) : true;
                    console.log(888, this.$refs.policyItem.validateStrat(classify))
                    return classify.id && classifyOpen;
                }).length;
                console.log('完整Classify', classifyNum, '所有Classify', this.parallelForm.policyList.length)
                return !!this.parallelForm.parallelName && (classifyNum == this.parallelForm.policyList.length)
            },
            bindParallel() {// 绑定分类器
                let _self = this;
                if (this.validateParallelForm()) {
                    let _self = this;
                    let data = JSON.parse(JSON.stringify(this.parallelForm))
                    data.nodeId = this.$route.query.nodeId.slice(4);
                    data.policyList.map((pItem, pIndex) => {
                        pItem.id = '';
                        pItem.ruleList.map((rItem, rIndex) => {
                            rItem.id = '';
                        })
                    })
                    this.$post('/mcs/node/parallel/bind', data)
                        .then(res => {
                            this.$message.success('绑定成功')
                            data.nodeName = this.parallelForm.parallelName;
                            data.nodeId = this.$route.query.nodeId;
                            this.$emit('saveForm', data);// 关闭弹窗

                            this.resetParallelForm();// 重置stratForm
                        })

                } else {
                    this.$notify({// 通知提示
                        message: '并行信息不完整',
                        type: 'warning',
                        customClass: 'pos-parallelForm',
                    })
                }
            },
            resetParallelForm() {// 重置stratForm
                this.parallelForm = {// 空分类
                    parallelName: '',// 并行节点名	String	Y
                    decisions: [// 决策建议	List	Y
                        {condition: 1, result: 1, decision: 0, sort: 1},
                        {condition: 1, result: 0, decision: 0, sort: 2},
                        {condition: 0, result: 1, decision: 0, sort: 3},
                        {condition: 1, result: -1, decision: 0, sort: 4},
                        {condition: 0, result: 1, decision: 0, sort: 5},
                    ],
                    policyList: [],// 并行计算的策略	List	Y
                }
                this.classify_plus();
                this.vLock = false;// 关闭验证提示
            },
            /************************ parallelForm自动运行获取数据 ************************/
            getParallelNode(item, index) {// 3.2.48模型配置—获取并行节点内容
                let _self = this;
                this.$post('/mcs/node/parallel/query', {
                    nodeId: this.$route.query.nodeId.slice(4),// 策略模板ID  Number  Y
                })
                    .then(res => {
                        if (!!res) {// 没有名称为新节点
                            if (res.policyList) {
                                res.policyList.sort((a, b) => {
                                    return a.sort - b.sort;
                                })
                                res.decisions.sort((a, b) => {
                                    return a.sort - b.sort;
                                })
                                res.policyList.map((item) => {
                                    item.policyShow = false;//  默认不展开
                                    // item.ruleList = [];// 预先注册ruleContent
                                    item.id = item.policyName;
                                    item.ruleList.map((ruleItem, ruleIndex) => {
                                        ruleItem.ruleConShow = false;
                                        ruleItem.ruleContent.map((ruleConItem, ruleConIndex) => {
                                            ruleConItem.operationArray = ruleConItem.content.map(conItem => conItem.operationValue);// 渲染枚举型
                                            ruleConItem.variableType = '';// 注册oprList操作符列表
                                            ruleConItem.oprList = [];// 注册oprList操作符列表
                                            this.getVarType(ruleConItem, ruleConIndex, ruleIndex);
                                        })
                                        if (!ruleItem.isTemplate) {// 非模板，id没在规则列表里，所以直接显示名称
                                            ruleItem.id = ruleItem.ruleName;
                                        }
                                    })
                                })
                                Object.assign(this.parallelForm, res)
                            } else {
                                this.classify_plus();// 添加一条空的
                            }
                        } else {
                            this.classify_plus();// 新节点则添加一条新分类
                        }
                        {// 撤销恢复：记录绑定的初始版本
                            let data = JSON.parse(JSON.stringify(this.parallelForm))
                            data.nodeName = this.parallelForm.parallelName;
                            data.nodeId = this.$route.query.nodeId;
                            data.clear = !res;
                            this.$emit('firstBindPush', data)
                        }
                    })
            },
            /************************ stratForm：新建策略&&插入策略 ************************/
            stratAdd() {// 新建策略
                let query = this.$route.query;
                query.policyType = 3;
                this.$router.push({path: '/risk/proMg/businessList/editFlow/parallelForm/stratForm', query: query});
            },
            pushStrat(stratForm) {
                this.parallelForm.policyList = this.parallelForm.policyList.filter((item) => {// 清除未完成的规则操作
                    return !!item.policyName;
                })
                stratForm.id = stratForm.policyName;
                this.parallelForm.policyList.push(stratForm);// 保存进策略规则列表
                this.$router.push({path: '/risk/proMg/businessList/editFlow/parallelForm', query: this.$route.query});
            },
            pushRule(ruleForm) {
                console.log("并行中策略中新增规则：未完成", this.$route.query.policyIndex);
                this.parallelForm.policyList.map((item, index) => {
                    if (index == this.$route.query.policyIndex) {
                        item.ruleList = item.ruleList.filter((item) => {// 清除未完成的规则操作
                            return !!item.ruleName;
                        })
                        console.log("保存规则到策略模板", this.$route.query, this.$refs);
                        ruleForm.id = ruleForm.ruleName;
                        this.$refs.policyItem.$refs.ruleItem.map((ruleItem, ruleIndex) => {
                            ruleItem.ruleTmplList.push(ruleForm);// 新建的规则，插入ruleTmplList，才能正常显示标题
                        })
                        item.ruleList.push(ruleForm);// 保存进策略规则列表
                        delete this.$route.query.policyIndex;
                        this.$router.push({query: this.$route.query});
                        this.$router.go(-1);
                    }
                })
            },
            /************************ 后台直接返回ruleList：自动获取oprList ************************/
            getVariableList(item) {// 3.2.5查询变量列表
                let _self = this;
                this.$post('/mcs/variable/config/list', {
                    appId: _self.$route.query.appId,//产品线ID   Number  N
                })
                    .then(res => {
                        this.variableList = res.variableList;
                        this.getParallelNode();// 老节点则获取节点数据
                    })

            },
            getVarType(item, ruleConIndex, index) {
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
                            this.getOprList_enumList(item, ruleConIndex, index);// 获取变量枚举值列表
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
            getOprList_enumList(item, ruleConIndex, index) {// 3.2.12获取变量枚举值列表
                // console.table(Object.entries(item))
                let _self = this;
                this.$post('/mcs/variable/enums', {
                    variableId: item.variableId,// 变量ID  Number  Y
                })
                    .then(res => {
                        res.enumList.map((cell) => {
                            cell.id = cell.enumValue;
                            cell.name = cell.enumName;
                        })
                        item.oprList = res.enumList;
                    })

            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    .pages_parallelForm {
        min-width: 700px;
        .parallelForm_sug { // 决策意见
            background: #ebf5fe;
            padding: 20px 10px;
            .sug_title {
                margin-bottom: 10px;
            }
        }
    }
</style>
