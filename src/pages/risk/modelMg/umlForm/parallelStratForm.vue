<template>
    <div class="pages_stratForm">
        <div v-show="$route.name.indexOf('_ruleForm')==-1">

            <el-form class="stratForm" :model="stratForm" status-icon ref="stratForm">
                <img class="backTostratName pointer" :src="icon.arrowLeft" alt="返回策略名称" @click="arrowLeft"
                     v-if="$route.name!='stratAdd'&&(!!$route.query.moldType?true:$route.name!='stratEdit')">
                <el-form-item label="">
                    <div class="w300 overhide" v-if="$route.query.type=='look'">
                        {{stratForm.policyName}}
                    </div>
                    <el-input v-else class="w310" :class="{'solid_red':vLock&&!stratForm.policyName}"
                              v-model="stratForm.policyName" placeholder="请输入策略名称" size="medium" clearable></el-input>
                </el-form-item>

                <div class="stratForm_rule mg_t_20">
                    <el-form-item label="策略执行条件：" prop="logic">
                        <el-radio-group v-model.number="stratForm.logic" :class="{'solid_red':vLock&&!stratForm.logic}">
                            <el-radio :label="2">满足任意条件</el-radio>
                            <el-radio :label="1">满足全部条件</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item class="stratForm_bd">
                        <!-- 规则循环 -->
                        <ruleItem ref="ruleItem" :icon="icon" :variableList="variableList" :ruleTmplListUml="[]"
                                  :ruleList="stratForm.ruleList" :show="show" :vLock="vLock" :appId="appId"
                                  @getVarType="getVarType"/>
                    </el-form-item>
                    <el-form-item class="policyType" label="">
                        <el-checkbox v-model="stratForm.policyType">保存为策略模板</el-checkbox>
                    </el-form-item>
                </div>

                <!--这里是model情况下-->
                <div class="modelBtn">
                    <!--这里是无论是冠军挑战者还是普通绑定都要存在，但是必须是添加的，也就是决策意见隐藏的是显示也就是canShow为假、edit-->
                    <div v-if="$route.query.type=='edit'">
                        <el-button class="" type="primary" size="medium" @click="saveStrat()">保存</el-button>
                    </div>
                </div>

            </el-form>
        </div>
        <router-view :icon="icon" :variableList="variableList" :appId="appId" @createRuleSuccess="pushRule"
                     @getVarType="getVarType"/>
    </div>
</template>

<script>
    let icon = {
        plus: require('img/icon/plus.png'),
        remove: require('img/icon/remove.png'),
        sort: require('img/icon/sort.png'),
        ruleConOpen: require('img/icon/ruleConOpen.png'),
        arrowLeft: require('img/icon/arrowLeft.png'),
    }
    import ruleItem from '../../../../components/pc/policy/ruleItem'

    export default {
        name: 'parallelForm_stratForm',
        data() {
            return {
                pageName: 'pages_stratForm', icon,
                show: {
                    stratName: true,
                    ruleForm: false,
                },
                /* 数据展示 */
                policyList: [],// 策略模板列表
                variableList: [],// 变量列表
                allEnmuList: [],     // 所有的枚举变量值
                oprList: [
                    {id: 1, name: '='},
                    {id: 2, name: '!='},
                    {id: 3, name: 'is null'},
                    {id: 4, name: '>'},
                    {id: 5, name: '>='},
                    {id: 6, name: '<'},
                    {id: 7, name: '<='},
                    {id: 8, name: 'startsWith'},
                    {id: 9, name: 'contains'}
                ],
                oprList_str: [
                    {id: 1, name: '='},
                    {id: 2, name: '!='},
                    {id: 3, name: 'is null'},
                    {id: 8, name: 'startsWith'},
                    {id: 9, name: 'contains'}
                ],
                oprList_num: [
                    {id: 1, name: '='},
                    {id: 2, name: '!='},
                    {id: 4, name: '>'},
                    {id: 5, name: '>='},
                    {id: 6, name: '<'},
                    {id: 7, name: '<='}
                ],
                oprList_bl: [
                    {id: '1', name: '是'},
                    {id: '0', name: '否'}
                ],
                hitList: [
                    {id: 0, name: '通过'},
                    {id: 1, name: '拒绝'},
                    {id: 2, name: '人工审核'},
                    {id: 3, name: '继续执行'}
                ],
                stratForm: {// 提交策略
                    policyType: false,
                    nodeId: '',
                    appId: '',
                    policyName: '',
                    rate: '',                // 流量比例，正常情况下是空的
                    policyId: '',
                    logic: '',
                    missThen: '',
                    hitThen: '',
                    exceptionThen: '',
                    ruleList: '',
                },

                vLock: false,// 是否开启验证提示
                isNewNode: true,// 是否是新节点
                stratLoading: true,

                policyListFilter: [],

                isDisabled: false,


                // canShow: true,          // 用于策略的决策意见显示隐藏
            }
        },
        props: ['policyType', 'appId', 'variableListUml', 'policyListUml'],
        components: {ruleItem},
        created() {
            this.variableList = this.variableListUml;           // 已有变量名列表
            this.policyListFilter = this.policyList = !!this.policyListUml ? this.policyListUml : [];
            this.getPolicyList();// 获取本产品线策略列表


            this.stratForm.appId = this.$route.query.appId;

            // 如果是编辑，且路由上有policyId，直接根据策略id，policyId请求相应的策略模板信息
            if (this.$route.query.type == "edit" && this.$route.query.policyId) {
                console.log('如果有policyId,直接请求策略详情')
                this.stratForm.policyId = this.$route.query.policyId;
                this.getPolicyDetail()
            }

            this.getOprList_enumList();// 获取变量枚举值列表

        },
        methods: {

            // 获取策略列表
            getPolicyList(type = true) {// 3.2.24查询策略模板列表
                let _self = this;
                this.$post('/mcs/policy/template/list', {
                    appId: _self.$route.query.appId,// 产品线ID   Number  Y
                    policyName: '',// 策略名称    String  Y
                    pageNo: '',// 页码  Number  N
                    pageSize: 999,// 每页大小    Number  N
                    statusOrder: 2,//1：列表排序，2：状态排序

                })
                    .then(res => {
                        this.policyList = res.policyList;
                        this.policyListFilter = res.policyList;
                        this.initData();
                    })
            },

            // 根据不同的情况请求
            initData() {
                if (this.$route.name.indexOf('_stratForm') > -1) {// 分类器——新建策略
                    this.stratForm.policyId = this.$route.query.policyId;
                    this.stratAdd2();
                } else if (this.$route.name == 'stratAdd') {// 策略管理——新增策略模板
                    this.stratAdd();
                } else if (this.$route.name == 'stratEdit') {
                    this.getPolicyDetail();
                } else {
                    this.getPolicyNode();// 3.2.46模型配置—获取策略节点
                }
                this.stratLoading = false;
            },
            /************************ stratForm专用的方法 ************************/
            stratAdd() {// 新建策略
                // this.canShow = false
                this.$refs.policyName.blur();// select失去焦点，隐藏下拉框
                this.show.stratName = false;
                this.resetStratForm();// 重置stratForm
                this.$nextTick(() => {
                    this.$refs.ruleItem.rule_plus();// 添加一条空规则
                })
            },
            stratAdd2() {// 选择策略后-新建策略
                this.$route.query.policyId = this.stratForm.policyId;
                this.show.stratName = false;
                this.resetStratForm();// 重置stratForm
                this.$nextTick(() => {
                    this.$refs.ruleItem.rule_plus();// 添加一条空规则
                });
                if (!!this.$route.query.policyType) {
                    this.stratForm.policyType = this.$route.query.policyType;
                }
            },
            arrowLeft() {// 返回
                if (this.$route.name.indexOf('_stratForm') > -1) {// 返回分类器
                    this.$router.push({query: this.$route.query});
                    this.$router.go(-1);
                } else {
                    this.show.stratName = true
                    if (!!this.$route.query.policyId) {
                        this.stratForm.policyId = this.$route.query.policyId;
                        this.changeStratName(this.$route.query.policyId)
                        delete this.$route.query.policyId;
                    } else {
                        this.stratForm.policyId = '';// 返回则清空策略选择
                    }
                }
            },
            changeStratName(val) {// 选择策略
                // this.canShow = true

                this.policyList.map((item) => {
                    if (item.id == val) {
                        this.stratForm.policyName = item.policyName;// 初始化已选策略
                    }
                })
                this.getPolicyDetail();
                this.$nextTick(() => {
                    this.show.stratName = false;
                })
            },
            /************************ stratForm表单验证&&表单保存&&表单重置 ************************/
            validateStrat() {
                this.vLock = true;// 开启验证提示
                let ruleNum = this.stratForm.ruleList.filter((rule) => {
                    let ruleConNum = this.$refs.ruleItem.validateRule(rule);

                    return !!rule.ruleName && !!rule.logic && ruleConNum;
                }).length;

                let stratForm_sug = () => {// 策略节点和并行节点要判断决策意见
                    if ((this.$route.name == 'stratForm' || this.$route.name == 'parallelForm_stratForm') && !!this.stratForm.policyId) {
                        return (this.stratForm.missThen !== '') && (this.stratForm.hitThen !== '') && (this.stratForm.exceptionThen !== '')
                    } else {
                        return true;
                    }
                }

                return !!this.stratForm.policyName && this.stratForm.logic && (ruleNum == this.stratForm.ruleList.length) && stratForm_sug();
            },
            saveStrat(val) {// 保存策略
                // saveStrat(id, isNewV) {// 保存策略
                let _self = this;
                if (this.validateStrat()) {
                    // this.canShow = false

                    console.log('验证通过')
                    // 如果点击了保存为策略模板
                    console.log(this.stratForm)
                    if (this.stratForm.policyType) {
                        this.createPolicy()
                        this.policyList.push(this.stratForm)
                        console.log(this.policyList)

                    } else {
                        console.log(123)
                    }
                    // this.stratForm.appId = this.appId ? this.appId : this.$route.query.appId;
                    // let data = JSON.parse(JSON.stringify(this.stratForm));
                    // data.ruleList.map(item => {
                    //     item.id = ''
                    // });
                } else {
                    let msg = ''
                    if (this.stratForm.policyName == ''
                    ) {
                        msg = '请输入策略名称'
                    }
                    else if (this.stratForm.logic == '') {
                        msg = '请选择策略执行条件'
                    } else {
                        msg = '请填写相关必填项'
                    }
                    this.$notify({// 通知提示
                        message: msg,
                        type: 'warning',
                        customClass: 'pos-stratForm1',
                    })
                }
            },

            createPolicy() {
                // this.stratForm.policyType = this.stratForm.policyType ? 0 : this.stratForm.policyType;// 0：模板，1：一般策略，2：分类策略,3:并行计算策略。默认为1
                this.stratForm.appId = this.appId ? this.appId : this.$route.query.appId;
                let data = JSON.parse(JSON.stringify(this.stratForm));
                data.ruleList.map(item => {
                    item.id = ''
                });
                data.policyType = data.policyType == true ? '0' : '1'
                if (this.$route.name == 'stratAdd') {
                    data.policyType = 0
                }

                this.$post('/mcs/policy/create', data)
                    .then(res => {
                        this.$message.success('创建成功')
                        this.$router.push({
                            path: '/risk/modelMg/modelUml/parallelForm',
                            query: this.$route.query
                        });
                        this.$emit('createCelueSuccess', data, this.policyList);

                    })
            },


            resetStratForm() {// 重置stratForm
                this.stratForm = {// 空策略
                    appId: this.$route.query.appId,
                    policyName: '',// 策略名称   String  Y
                    policyId: '',// 策略名称   String  Y
                    logic: '',// 逻辑操纵    Number  Y
                    missThen: '',// 未命中时操作  Number  Y   0：通过，1：拒绝，2：人工审核，3：继续执行
                    hitThen: '',// 命中时操作   Number  Y   0：通过，1：拒绝，2：人工审核，3：继续执行
                    exceptionThen: '',// 异常时操作   Number  Y   0：通过，1：拒绝，2：人工审核，3：继续执行
                    ruleList: [],// 规则分类    List    Y
                    policyType: false,
                    policyShow: true,// 分类器专用：是否展开策略
                }
                this.vLock = false;// 关闭验证提示
            },


            /************************ 与ruleForm交互的方法：新建规则&&插入规则 ************************/
            ruleAdd() {// 新建规则
                this.$router.push({path: this.$route.path + '/ruleForm', query: this.$route.query});
            },
            pushRule(ruleForm) {
                console.log("策略中新增规则");
                this.stratForm.ruleList = this.stratForm.ruleList.filter((item) => {// 清除未完成的规则操作
                    return !!item.ruleName;
                })
                console.log("保存规则到策略模板", this.$route.query);
                // ruleForm.id = ruleForm.ruleName;//这里于禅道33983原因注释，不知道会影响哪里，希望不会影响其他地方的，2019-01-14，qwk
                this.$refs.ruleItem.ruleTmplList.push(ruleForm);// 新建的规则，插入ruleTmplList，才能正常显示标题
                this.stratForm.ruleList.push(ruleForm);// 保存进策略规则列表
                this.$router.push({query: this.$route.query});
                this.$router.go(-1);
            },
            /************************ 与ruleItem&&ruleForm公用的方法 ************************/
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
                            // this.getOprList_enumList(item, ruleConIndex, index);// 获取变量枚举值列表
                            item.oprList = []
                            this.allEnmuList.map(cell => {
                                if (item.variableId == cell.variableId) {
                                    cell.id = cell.enumValue;
                                    cell.name = cell.enumName;
                                    item.oprList.push(cell)
                                    console.log(item.oprList)
                                }
                            })
                            // item.oprList = this.allEnmuList
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
            getOprList_enumList() {// 3.2.12获取变量枚举值列表
                this.$post('/mcs/variable/enum/list', {})
                    .then(res => {
                        this.allEnmuList = res.enumList
                    })
            },

            operation(val) {// 操作符 /** Jim修改于2018-04-23 10:13:39 @oprList动态获取时使用，目前oprList为静态数据 */
                switch (val) {
                    case 1:
                        return '=';
                    case 2:
                        return '!=';
                    case 3:
                        return 'is null';
                    case 4:
                        return '>';
                    case 5:
                        return '>=';
                    case 6:
                        return '<';
                    case 7:
                        return '<=';
                    case 8:
                        return 'startsWith';
                    case 9:
                        return 'contains';
                }
            }
            ,
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
    .pages_stratForm {
        /*width: 700px;*/
        .stratName, .stratForm {
            margin-top: 32px;
            padding-bottom: 40px;
        }
        .stratForm {
            .stratForm_sug { // 决策意见
                height: 104px;
                background: #ebf5fe;
                padding: 20px 10px;
                .sug_title {
                    margin-bottom: 10px;
                }
            }
            .stratForm_rule {
                .stratForm_bd {
                    border: 1px solid #E4E7F2;
                    border-bottom: 0;
                }
            }
        }
        .el-checkbox__input {
            .el-checkbox__inner {
                border-radius: 50%;
                width: 16px;
                height: 16px;
                &:after {
                    height: 8px;
                    left: 5px;
                    top: 2px;
                }
            }
        }
        .stratList { // 策略下拉列表
            width: 310px;
        }
        .el-select {
            .el-input__suffix { // 隐藏下拉箭头
                display: none;
            }
        }
        .backTostratName { // 返回箭头
            width: 20px;
            margin-top: -40px;
            padding-bottom: 6px;
        }
    }
</style>
