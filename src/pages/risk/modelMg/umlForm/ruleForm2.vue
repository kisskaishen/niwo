<template>
    <div class="pages_ruleForm">
        <el-form class="stratForm ruleForm" :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
            <img class="backTostratName pointer" :src="icon.arrowLeft" alt="返回策略名称" @click="arrowLeft"
                 v-if="$route.name!='ruleTmpAdd'&&$route.name!='ruleTmpEdit'">
            <!-- 规则标题 -->
            <el-form-item class="ruleName" label="">
                <el-input class="w310" :class="{'solid_red':vLock&&!ruleForm.ruleName}" v-model="ruleForm.ruleName"
                          placeholder="请输入规则名称" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item class="ruleConItem noBorder pd_0" label="规则执行条件：" prop="logic">
                <el-radio-group v-model.number="ruleForm.logic" :class="{'solid_red':vLock&&!ruleForm.logic}">
                    <el-radio :label="2" v-if="($route.query.type=='look')?item.logic==2:true">满足任意条件</el-radio>
                    <el-radio :label="1" v-if="($route.query.type=='look')?item.logic==1:true">满足全部条件</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item class="ruleName" label="决策代码">
                <el-input class="w310" :class="{'solid_red':vLock&&!ruleForm.decisionCode}"
                          v-model="ruleForm.decisionCode" placeholder="请输入决策代码" size="medium" clearable></el-input>
            </el-form-item>
            <div class="stratForm_rule">
                <el-form-item class="stratForm_bd">
                    <div class="ruleList">
                        <!-- 规则内容循环 -->
                        <div class="ruleContent clear open" v-if="!!ruleForm.ruleContent.length">
                            <varItem class="ruleConItem overhide" ref="varItem" :icon="icon"
                                     :variableList="variableList" :item="ruleForm" :index="''" :vLock="vLock"
                                     @getVarType="getVarType"></varItem>
                        </div>
                        <div class="noResult bd_t_0 bd_l_0 bd_r_0" v-else>竟然删空了，去<span class="f_blue pointer"
                                                                                       @click="ruleCon_plus(ruleForm)">添加变量</span>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item class="isTemplate" label=""
                              v-if="$route.name!='ruleTmpAdd' && $route.name!='ruleTmpEdit'">
                    <el-checkbox v-model="ruleForm.isTemplate" true-label="0" false-label="1">保存为规则模板</el-checkbox>
                </el-form-item>
            </div>
            <div style="margin-top: 40px">
                <el-button class="" type="primary" size="medium" @click="saveRule" v-if="$route.query.type!='look'">保存
                </el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import varItem from '../../../../components/pc/policy/varItem'

    export default {
        name: 'pages_ruleForm',
        data() {
            return {
                pageName: 'pages_ruleForm',
                rules: {},// 表单验证规则
                varLogicList: [{id: 1, name: 'AND'}, {id: 2, name: 'OR'}],// 变量间逻辑关系
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
                ruleForm: {// 新建规则    List    Y
                    appId: '',
                    id: '',// 规则ID    Number  Y
                    ruleName: '',// 规则名称    String  Y   不超过255
                    decisionCode: '',// 规则编码    String  Y   不超过255
                    logic: '',// 逻辑操作    Numbrt  Y   1：与，2：或
                    ruleConShow: true,// 是否展开:添加成功默认展开
                    ruleContent: [{// 规则内容    List    Y
                        variableId: '',// 变量ID    Number  Y   不超过255
                        variableName: '',// 变量名 String  Y   不超过255
                        variableType: '',// 变量类型 Number  N   1：字符串，2：整型，3：浮点型，4：日期型，5：枚举，6：布尔型
                        logic: 1,// 逻辑操作    Numbrt  Y   1：与，2：或
                        oprList: [],// 注册oprList操作符列表
                        content: [],// 注册操作符数组
                    }],
                    isTemplate: 1,// 是否保存为模板 Number  Y   0：是，1：否
                },
                vLock: false,// 是否开启验证提示
            }
        },
        props: ['icon', 'variableList', 'appId'],
        components: {varItem},
        created() {
            if (!!this.$route.query.appId) {
                this.ruleForm.appId = this.$route.query.appId;
            } else if (this.appId) {
                this.ruleForm.appId = this.appId;
            }
        },
        methods: {
            getRuleDetail() {// 3.2.20获取规则详情/** Jim修改于2018-09-27 16:18:02 @因先后顺序问题，调用放在ruleTmpEdit页面getVariableList里面 */
                this.$post('/mcs/rule/query', {
                    id: this.$route.query.ruleId,// 规则模板ID  Number  Y
                })
                    .then(res => {
                        res.ruleContent.map((ruleConItem, ruleConIndex) => {
                            ruleConItem.sort = ruleConIndex;
                            ruleConItem.operationArray = ruleConItem.content.map(conItem => conItem.operationValue);// 渲染枚举型
                            ruleConItem.oprList = [];// 注册oprList操作符列表
                            this.$emit('getVarType', ruleConItem, ruleConIndex, 0)// 获取变量类型及相应的操作符列表
                        })
                        Object.assign(this.ruleForm, res)
                    })
            },
            /************************ ruleForm专用的方法 ************************/
            arrowLeft() {// 返回
                this.$router.push({path: '/risk/modelMg/modelUml/parallelForm', query: this.$route.query});
            },
            saveRule() {// 保存规则
                if (this.validateRule(this.ruleForm)) {// 新建规则验证
                    console.log("规则保存》》》", this.$route.name, this.ruleForm.isTemplate);
                    if (this.$route.name == 'ruleTmpAdd' || this.$route.name == 'ruleTmpEdit'
                        || this.$route.name.indexOf('_ruleForm') > -1) {// 新增规则模板调用
                        if (this.ruleForm.isTemplate === "0") {
                            this.createRule();
                        } else {
                            this.$emit('createRuleSuccess', this.ruleForm);
                        }
                    } else {
                        this.createRule();
                    }
                } else {
                    let msg = ''
                    if (this.ruleForm.ruleName == '') {
                        msg = '请输入规则名称'
                    } else if (this.ruleForm.logic == '') {
                        msg = '请选择规则执行条件'
                    } else if (this.ruleForm.decisionCode == '') {
                        msg = '请输入决策代码'
                    } else if (this.ruleForm.decisionCode == '') {
                        msg = '请输入决策代码'
                    } else {
                        msg = '请填写完全决策信息'
                    }
                    this.$notify({// 通知提示
                        message: msg,
                        type: 'warning'
                    })
                }
            },
            validateRule(rule) {// 新建规则验证
                this.vLock = true;
                let ruleConNum = rule.ruleContent.filter((item) => {
                    console.log('【ruleConNum】', item.variableName, (item.content.length > 1 ? item.logic : true), this.$refs.varItem.validateVar(item))
                    return !!item.variableName && (item.content.length > 1 ? item.logic : true) && this.$refs.varItem.validateVar(item);
                }).length;
                return !!this.ruleForm.ruleName && this.ruleForm.logic && this.ruleForm.decisionCode && (ruleConNum == rule.ruleContent.length);
            },
            createRule() {
                console.log("创建规则");
                this.$post('/mcs/rule/create', this.ruleForm)
                    .then(res => {
                        this.ruleForm.id = res.id;
                        this.$emit('createRuleSuccess', this.ruleForm)
                        this.resetRuleForm();// 重置ruleForm
                    })
            },
            resetRuleForm(appId = '') {// 重置ruleForm
                this.ruleForm = {// 清空ruleForm
                    appId,
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
                        content: [],// 注册操作符数组
                    }],
                    isTemplate: 1,
                }
                this.vLock = false;// 关闭验证提示
            },
            ruleCon_plus(item, index) {
                this.$refs.varItem.$refs.variableName.ruleCon_plus(item, index);
            },
            getVarType(ruleCon) {// 调用父级组件stratForm的getVarType
                console.log('请求类型')
                console.log(ruleCon)
                console.log(this)
                this.$emit('getVarType', ruleCon)
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
    .pages_ruleForm {
        min-width: 720px;
        padding-bottom: 40px;

        @import '../../../../resource/style/pages/ruleConItem';
        .backTostratName { // 返回箭头
            width: 20px;
            margin-top: -40px;
            padding-bottom: 6px;
        }
        .ruleForm { // 新建规则
            margin-top: 32px;
            .stratForm_rule {
                .stratForm_bd {
                    .ruleList {
                        .ruleContent {
                            height: 0;
                            opacity: 0;
                            transition: all 0.3s;
                            overflow: hidden;
                            position: relative;
                            &.open {
                                min-height: 57px;
                                height: auto;
                                opacity: 1;
                                /*border-bottom: 1px solid #eee;*/
                                .ruleConItem {
                                    padding-left: 20px;
                                    /*margin-bottom: 22px;*/
                                    border-bottom: 1px dashed #ececec;
                                }
                            }

                        }

                    }

                }

            }
        }
        .ruleFade {
            background: #fff;
            padding: 0 20px;
            min-width: 700px;
            border-left: 1px solid #E4E7F2;
            position: absolute;
            top: 0px;
            right: 0;
            bottom: 0px;
            transition: all 0.3s ease;
            &.fadeInLeft {
                transform: translateX(0);
            }
            &.fadeOutRight {
                transform: translateX(100%);
            }
        }
    }
</style>
