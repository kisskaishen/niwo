<template>
    <div class="pages_stratForm" v-loading="stratLoading">
        <div v-show="$route.name.indexOf('_ruleForm')==-1">
            <el-form :model="stratForm" status-icon ref="stratName" class="stratName"
                     v-if="show.stratName">
                <el-form-item label="">
                    <el-select class="w310" ref="policyName" v-model.number="stratForm.policyId" filterable
                               placeholder="请选择已有的策略模版" size="medium" no-match-text="查询无结果" no-data-text="暂无数据"
                               :popper-class="policyListFilter.length?'stratList toNew hasData':'stratList toNew'"
                               @change="changeStratName">
                        <el-option v-for="(item,index) in policyListFilter" :key="index" :label="item.policyName"
                                   :value="item.id" :disabled="item.policyStatus=='2'">
                            <div class="stratOption overhide" :title="item.policyName">{{item.policyName}}</div>
                        </el-option>
                        <div class="stratAdd f_blue pointer mg_l_20 toNewBtn" @click="stratAdd">+新建策略</div>
                    </el-select>
                    <!-- <span class="stratAdd f_blue pointer mg_l_20" @click="stratAdd" v-if="$route.query.type!='look'">+新建策略</span> -->
                </el-form-item>
            </el-form>
            <el-form class="stratForm" :model="stratForm" status-icon ref="stratForm" v-else>
                <img class="backTostratName pointer" :src="icon.arrowLeft" alt="返回策略名称" @click="arrowLeft"
                     v-if="$route.name!='stratAdd'&&(!!$route.query.moldType?true:$route.name!='stratEdit')">
                <el-form-item label="">
                    <div class="w300 overhide" v-if="$route.query.type=='look'">
                        {{stratForm.policyName}}
                    </div>
                    <el-input v-else class="w310" :class="{'solid_red':vLock&&!stratForm.policyName}"
                              v-model="stratForm.policyName" placeholder="请输入策略名称" size="medium" clearable></el-input>
                    <!-- <span class="stratAdd f_blue pointer mg_l_20" v-if="!!stratForm.policyId && $route.query.type!='look'" @click="stratAdd2">+新建策略</span> -->
                    <!-- <span class="ruleAdd f_blue pointer mg_l_20" v-if="$route.query.type!='look'" @click="ruleAdd">+新建规则</span> -->
                </el-form-item>
                <!-- 决策意见：只有在策略节点和并行节点显示 -->
                <div class="stratForm_sug"
                     v-if="($route.name=='stratForm'||$route.name=='parallelForm_stratForm')&&!!stratForm.policyId">
                    <p class="sug_title">决策意见：</p>
                    <el-form-item label="策略未命中" class="inlineBlock missThen" label-width="80px">
                        <el-select class="w150" :class="{'solid_red':vLock&&stratForm.missThen===''}"
                                   :disabled="$route.query.type=='look'" v-model.number="stratForm.missThen"
                                   placeholder="请选择" size="medium" no-match-text="查询无结果" no-data-text="暂无数据"
                                   popper-class="hitList">
                            <el-option v-for="(item,index) in hitList" :key="index" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="策略命中" class="inlineBlock hitThen" label-width="95px">
                        <el-select class="w150" :class="{'solid_red':vLock&&stratForm.hitThen===''}"
                                   :disabled="$route.query.type=='look'" v-model.number="stratForm.hitThen"
                                   placeholder="请选择" size="medium" no-match-text="查询无结果" no-data-text="暂无数据"
                                   popper-class="hitList">
                            <el-option v-for="(item,index) in hitList" :key="index" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="异常" class="inlineBlock exceptionThen" label-width="66px">
                        <el-select class="w150" :class="{'solid_red':vLock&&stratForm.exceptionThen===''}"
                                   :disabled="$route.query.type=='look'" v-model.number="stratForm.exceptionThen"
                                   placeholder="请选择" size="medium" no-match-text="查询无结果" no-data-text="暂无数据"
                                   popper-class="hitList">
                            <el-option v-for="(item,index) in hitList" :key="index" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="stratForm_rule mg_t_20">
                    <el-form-item label="策略执行条件：" prop="logic">
                        <el-radio-group v-model.number="stratForm.logic" :class="{'solid_red':vLock&&!stratForm.logic}">
                            <el-radio :label="2" v-if="$route.query.type=='look'?stratForm.logic==2:true">满足任意条件
                            </el-radio>
                            <el-radio :label="1" v-if="$route.query.type=='look'?stratForm.logic==1:true">满足全部条件
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item class="stratForm_bd">
                        <!-- 规则循环 -->
                        <ruleItem ref="ruleItem" :icon="icon" :variableList="variableList" :ruleTmplListUml="[]"
                                  :ruleList="stratForm.ruleList" :show="show" :vLock="vLock" :appId="appId"
                                  @getVarType="getVarType"/>
                    </el-form-item>
                    <el-form-item class="policyType" label=""
                                  v-if="($route.name!='stratAdd'&&$route.name!='stratEdit')?!stratForm.policyId:false">
                        <el-checkbox v-model="stratForm.policyType" true-label="0" false-label="1">保存为策略模板</el-checkbox>
                    </el-form-item>
                </div>
                <div class="text-center" v-if="!!stratForm.policyId && $route.query.type!='look'">
                    <el-button class="" type="primary" size="medium"
                               @click="saveStrat($route.query.type=='edit'?stratForm.id:stratForm.appId)">保存
                    </el-button>
                    <!-- <el-button class="" type="primary" size="medium" @click="saveStrat($route.query.type=='edit'?stratForm.id:stratForm.appId,1)" v-if="$route.query.type!='add'">保存为新版本</el-button> -->
                </div>
                <div class="text-center" v-else-if="$route.query.type!='look'">
                    <el-button class="" type="primary" size="medium" @click="saveStrat()">保存</el-button>
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
    import ruleItem from '../../../../../components/pc/policy/ruleItem'

    export default {
        name: 'pages_stratForm',
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

                isDisabled: false
            }
        },
        props: ['policyType', 'appId', 'variableListUml', 'policyListUml'],
        components: {ruleItem},
        created() {
            // 没有策略模板的时候的操作
            // 进入页面请求的顺序
            // this.getPolicyList() 获取到已有策略模板列表policyList和policyListFilter，根据appId请求
            // this.initData(),根据不同的情况去请求不同的方法
            // this.getPolicyNode()获取策略节点,请求成功，但是此时此刻什么都没有，返回null，后面就没有任何东西，于是开始选择策略模板
            // this.changeStratName() 选择策略模板，获取到此模板名称,也获取到了this.stratForm.policyId
            // this.getPolicyDetail() 根据this.stratForm.policyId，请求对应的模板详情
            // 点击保存如果policyId存在=>this.bindStrat()

            // 已经绑定策略
            // this.getPolicyList() 获取到已有策略模板列表policyList和policyListFilter，根据appId请求
            // this.initData(),根据不同的情况去请求不同的方法
            // this.getPolicyNode()获取策略节点,请求成功,赋值给相应的值


            this.variableList = this.variableListUml;
            this.policyListFilter = this.policyList = !!this.policyListUml ? this.policyListUml : [];
            if (!!this.variableListUml.length && this.policyList.length) {
                this.initData();
            } else if (this.variableListUml.length) {
                this.getPolicyList();// 获取本产品线策略列表
            } else {
                this.getVariableList(!!this.policyList.length);
            }

            this.stratForm.appId = this.$route.query.appId;

            if (this.$route.query.type == "edit") {
                this.stratForm.policyId = this.$route.query.policyId;
            }
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
            // 获取策略节点信息
            getPolicyNode() {// 3.2.42模型配置—
                this.$post('/mcs/node/policy/query', {
                    nodeId: this.$route.query.nodeId.slice(4),// 产品线ID   Number  Y
                })
                    .then(res => {
                        if (res) {
                            this.isNewNode = !res.policyList[0].policyName;
                            this.stratForm.policyId = res.policyList[0].policyId;

                            if (!!res.policyList[0].policyName) {
                                this.show.stratName = false;
                            }
                            res.policyList[0].ruleList.map((ruleItem, ruleIndex) => {
                                ruleItem.ruleConShow = false;//  默认不展开
                                // ruleItem.ruleContent = [];// 预先注册ruleContent
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
                            res.policyList[0].ruleList.sort((a, b) => {
                                return a.sort - b.sort;
                            })
                            Object.assign(this.stratForm, res.policyList[0])
                            {/** Jim修改于2018-06-15 14:26:04 @因数据先后问题，从created迁移 */
                                if (this.$route.name == 'stratForm') {// 模型配置-策略配置
                                    this.isNewNode && this.stratAdd();// 新节点则添加一条新分类
                                }
                            }

                        }
                        {// 撤销恢复：记录绑定的初始版本
                            let data = JSON.parse(JSON.stringify(this.stratForm))
                            data.nodeName = this.stratForm.policyName;
                            data.nodeId = this.$route.query.nodeId;
                            data.clear = !res;
                            // this.$emit('firstBindPush', data)
                        }
                    })
            },
            /************************ stratForm专用的方法 ************************/
            stratAdd() {// 新建策略
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


                console.log('完整rule', ruleNum, '所有rule', this.stratForm.ruleList.length, stratForm_sug())
                return !!this.stratForm.policyName && this.stratForm.logic && (ruleNum == this.stratForm.ruleList.length) && stratForm_sug();
            },
            saveStrat(id, isNewV) {// 保存策略
                let _self = this;
                console.log("保存策略按钮>>》", id, isNewV, this.$route.query, this.stratForm, this.$route.name);
                console.log(this.validateStrat())
                if (this.validateStrat()) {
                    if (this.$route.name.indexOf('_stratForm') > -1) {// 模型配置-分类器配置-新建策略
                        this.$emit('createStratSuccess', this.stratForm)
                    } else if (this.$route.name == 'stratAdd' || this.$route.name == 'stratEdit') {// 策略管理-添加策略
                        if (!!id) {
                            this.updatePolicy(id);// 修改
                        } else {
                            this.createPolicy();
                        }
                    } else if (this.$route.name == 'stratForm') {// 模型配置-策略配置
                        if (!!isNewV) {// 保存为新版本
                            this.updatePolicy(id, isNewV)// 修改策略节点
                        } else {
                            if (!!this.stratForm.policyId) {
                                // 如果已经存在policyId，也就是在上面编辑(添加/删除规则)的时候请求
                                this.bindStrat();// 绑定或修改策略节点
                            } else {
                                if (!!this.isNewNode) {// 新节点-创建
                                    console.log("创建新的策略， type:", this.stratForm.policyType);
                                    this.stratForm.policyId = true;
                                    if (this.stratForm.policyType == 0) {
                                        console.log("创建新的策略模板");
                                        console.log('创建新的策略模板')

                                        this.createPolicy();
                                    }
                                } else {// 老节点-绑定
                                    alert(33)

                                    console.log('老节点-绑定')

                                    this.bindStrat();// 绑定或修改策略节点
                                }
                            }
                        }
                    }
                } else {
                    let msg = ''
                    if (this.stratForm.policyName == '') {
                        msg = '请输入策略名称'
                    } else if (this.stratForm.logic == '') {
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
                this.stratForm.policyType = this.stratForm.policyType ? 0 : this.policyType;// 0：模板，1：一般策略，2：分类策略,3:并行计算策略。默认为1
                this.stratForm.appId = this.appId ? this.appId : this.$route.query.appId;
                let data = JSON.parse(JSON.stringify(this.stratForm));
                data.ruleList.map(item => {
                    item.id = ''
                });
                this.$post('/mcs/policy/create', data)
                    .then(res => {
                        this.$message.success('创建成功')
                        if (this.$route.name == 'stratAdd' || this.$route.name == 'stratEdit') {
                            this.$router.push('/risk/stratMg/stratList');// 策略管理——新增策略模板
                        } else {
                            this.stratForm.policyId = true;
                        }
                    })
            },
            updatePolicy(id, isNewV) {
                const data = JSON.parse(JSON.stringify(this.stratForm))
                data.policyId = id;// 策略ID有值:保存，无值:保存为新版本
                data.newVersion = !!isNewV ? isNewV : 0;
                data.ruleList.map((ruleItem, ruleIndex) => {
                    ruleItem.id = ruleItem.id_back;
                })
                delete data.appId;
                delete data.policyType;
                let _self = this;
                this.$post('/mcs/policy/update', data)
                    .then(res => {
                        this.$message.success('修改成功')
                        if (this.$route.name == 'stratAdd' || this.$route.name == 'stratEdit') {
                            this.$router.push('/risk/stratMg/stratList');// 策略管理——新增策略模板
                        } else {
                            data.nodeName = data.policyName;
                            this.$emit('saveForm', data);// 关闭弹窗

                            this.resetStratForm();// 重置stratForm
                            this.show.stratName = true;
                        }
                    })
            },
            bindStrat() {// 绑定策略
                this.stratForm.policyType = this.stratForm.policyType ? 0 : this.policyType;// 0：模板，1：一般策略，2：分类策略,3:并行计算策略。默认为1
                let _self = this;
                if (this.validateStrat()) {
                    let _self = this;
                    let data = JSON.parse(JSON.stringify(this.stratForm))
                    data.nodeId = this.$route.query.nodeId.slice(4);
                    data.ruleList.map((rItem, rIndex) => {
                        rItem.id = '';
                    })
                    let arr = []
                    arr.push(data)
                    if (this.$route.query.from == 'kingForm') {
                        let localArr = JSON.stringify(this.$local.get('policyList'))!='{}'?this.$local.get('policyList'):[]
                        localArr.push(data)
                        console.log(localArr)
                        this.$local.set('policyList', localArr)
                        this.$router.push(this.$route.fullPath.replace('/stratForm', '/kingForm'))
                    } else {
                        // // qwk 根据文档3.2.47修改为3.2.64
                        this.$post('/mcs/node/policy/bind', {
                            nodeId: this.$route.query.nodeId.slice(4),
                            policyList: arr,
                        })
                            .then(res => {
                                this.$message.success('绑定成功')
                                data.nodeName = this.stratForm.policyName;
                                data.nodeId = this.$route.query.nodeId;
                                this.$emit('saveForm', data);// 关闭弹窗

                                this.resetStratForm();// 重置stratForm
                                this.show.stratName = true;
                            })
                    }

                } else {
                    this.$notify({// 通知提示
                        message: '策略信息不完整',
                        type: 'warning',
                        customClass: 'pos-stratForm2',
                    })
                }
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
            /************************ 自动运行获取数据 ************************/
            getVariableList(type = true) {// 3.2.5查询变量列表
                let _self = this;
                this.$post('/mcs/variable/config/list', {
                    appId: _self.$route.query.appId,//产品线ID   Number  N
                })
                    .then(res => {
                        this.variableList = res.variableList;
                        {
                            /** Jim修改于2018-06-15 14:26:04 @因数据先后问题，从created迁移 */
                            type && this.getPolicyList(false);// 获取本产品线策略列表
                            this.initData();
                        }
                    })
            },


            getPolicyDetail() {// 3.2.42模型配置—获取策略节点 // 策略配置不需要
                this.show.stratName = false;
                this.$post('/mcs/policy/query', {
                    id: this.stratForm.policyId// 策略模板ID  Number  Y
                })
                    .then(res => {
                        console.log(res)

                        res.ruleList.map((ruleItem, ruleIndex) => {
                            ruleItem.ruleConShow = false;//  默认不展开
                            // ruleItem.ruleContent = [];// 预先注册ruleContent
                            ruleItem.ruleContent.map((ruleConItem, ruleConIndex) => {
                                ruleConItem.sort = ruleConIndex;
                                ruleConItem.operationArray = ruleConItem.content.map(conItem => conItem.operationValue);// 渲染枚举型
                                ruleConItem.oprList = [];// 注册oprList操作符列表
                                this.getVarType(ruleConItem, ruleConIndex, 0)// 获取变量类型及相应的操作符列表
                            })
                            // if (!ruleItem.isTemplate) {// 非模板，id没在规则列表里，所以直接显示名称
                            //     ruleItem.id_back = ruleItem.id;
                            //     ruleItem.id = ruleItem.ruleName;
                            // }
                        })
                        // 自动冒泡排序
                        res.ruleList.sort((a, b) => {
                            return a.sort - b.sort;
                        })
                        console.log(res)

                        delete res.appId;
                        Object.assign(this.stratForm, res)
                    })

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
                ruleForm.id = ruleForm.ruleName;
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
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    .pages_stratForm {
        min-width: 700px;
        .stratName, .stratForm {
            margin-top: 32px;
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
