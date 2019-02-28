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
                     v-if="$route.name!='stratAdd'&&(!!$route.query.moldType?true:$route.name!='stratEdit')&&$route.query.type!='look'">
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
                     v-if="($route.name=='stratForm'||$route.name=='parallelForm_stratForm')&&canShow">
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
                    <el-form-item label="策略命中" class="inlineBlock hitThen" label-width="88px">
                        <el-select class="w150" :class="{'solid_red':vLock&&stratForm.hitThen===''}"
                                   :disabled="$route.query.type=='look'" v-model.number="stratForm.hitThen"
                                   placeholder="请选择" size="medium" no-match-text="查询无结果" no-data-text="暂无数据"
                                   popper-class="hitList">
                            <el-option v-for="(item,index) in hitList" :key="index" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="异常" class="inlineBlock exceptionThen" label-width="50px">
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
                        <el-checkbox v-model="stratForm.policyType">保存为策略模板</el-checkbox>
                    </el-form-item>
                </div>

                <!--这里专门对于策略模板编辑时候-->
                <div v-if="$route.path.indexOf('/stratMg/stratList/stratEdit')>0">
                    <el-button class="" type="primary" size="medium" @click="saveStrat('stratEditBtn')">保存</el-button>
                </div>
                <!--这里是model情况下-->
                <div class="modelBtn" v-else>
                    <!--仅限新增冠军/挑战者的时候存在,所以只要kingForm、edit和canShow为真情况显示就可以了-->
                    <div
                        v-if="$route.query.type=='edit'&&$route.query.from=='kingForm'&&canShow">
                        <el-button class="" type="primary" size="medium"
                                   @click="saveStrat('isChooseBtn')">保存
                        </el-button>
                        <!--<el-button class="" type="primary" size="medium"-->
                        <!--@click="saveStrat($route.query.type=='edit'?stratForm.id:stratForm.appId)">保存到冠军/挑战者-->
                        <!--</el-button>-->
                        <!-- <el-button class="" type="primary" size="medium" @click="saveStrat($route.query.type=='edit'?stratForm.id:stratForm.appId,1)" v-if="$route.query.type!='add'">保存为新版本</el-button> -->
                    </div>
                    <!--这里是普通策略绑定,就是说没有from、edit、canShow为真就好了,如果是假的话,显示保存策略的按钮-->
                    <!--class="text-center"-->
                    <div
                        v-else-if="($route.query.type=='edit'&&!$route.query.from&&canShow)||($route.path.indexOf('stratAdd')&&$route.query.type=='add')">
                        <el-button class="" type="primary" size="medium"
                                   @click="saveStrat('newCelueBtn')">保存
                        </el-button>
                        <!--<el-button class="" type="primary" size="medium"-->
                        <!--@click="saveStrat($route.query.type=='edit'?stratForm.id:stratForm.appId)">保存到冠军/挑战者-->
                        <!--</el-button>-->
                        <!-- <el-button class="" type="primary" size="medium" @click="saveStrat($route.query.type=='edit'?stratForm.id:stratForm.appId,1)" v-if="$route.query.type!='add'">保存为新版本</el-button> -->
                    </div>
                    <!--这里是无论是冠军挑战者还是普通绑定都要存在，但是必须是添加的，也就是决策意见隐藏的是显示也就是canShow为假、edit-->
                    <div v-if="$route.query.type=='edit'&&!canShow">
                        <el-button class="" type="primary" size="medium" @click="saveStrat('isAddBtn')">保存</el-button>
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
                    policyType: 'true',
                    nodeId: '',
                    appId: '',
                    policyName: '策略',
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


                canShow: true,          // 用于策略的决策意见显示隐藏
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

            this.canShow = true


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

            // 如果是编辑，且路由上有policyId，直接根据策略id，policyId请求相应的策略模板信息
            if (this.$route.query.type == "edit" && this.$route.query.policyId) {
                // console.log('如果有policyId,直接请求策略详情')
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
            // 获取策略节点信息
            getPolicyNode() {// 3.2.42模型配置—
                this.$post('/mcs/node/policy/query', {
                    nodeId: this.$route.query.nodeId.slice(4),// 产品线ID   Number  Y
                })
                    .then(res => {
                        if (res) {
                            // this.isNewNode = !res.policyList[0].policyName;
                            this.stratForm.policyId = this.$route.query.policyId || res.policyList[0].policyId;
                            // console.log('this.stratForm.policyId=' + this.stratForm.policyId)
                            if (!!res.policyList[0].policyName) {
                                this.show.stratName = false;
                            }
                            res.policyList.map((item, index) => {
                                if (this.stratForm.policyId == item.policyId) {
                                    res.policyList[index].ruleList.map((ruleItem, ruleIndex) => {
                                        ruleItem.ruleConShow = false;//  默认不展开
                                        // ruleItem.ruleContent = [];// 预先注册ruleContent
                                        ruleItem.ruleContent.map((ruleConItem, ruleConIndex) => {
                                            ruleConItem.sort = ruleConIndex;
                                            ruleConItem.operationArray = ruleConItem.content.map(conItem => conItem.operationValue);// 渲染枚举型
                                            ruleConItem.oprList = [];// 注册oprList操作符列表
                                            this.getVarType(ruleConItem, ruleConIndex, 0)// 获取变量类型及相应的操作符列表
                                        })
                                        if (!ruleItem.isTemplate) {// 非模板，id没在规则列表里，所以直接显示名称
                                            // ruleItem.selectedId = ruleItem.ruleName;
                                            ruleItem.id = ruleItem.ruleName;
                                        }
                                    })
                                    res.policyList[index].ruleList.sort((a, b) => {
                                        return a.sort - b.sort;
                                    })
                                    Object.assign(this.stratForm, res.policyList[index])
                                }
                            })

                            // console.log(this.stratForm)
                            // {/** Jim修改于2018-06-15 14:26:04 @因数据先后问题，从created迁移 */
                            //     if (this.$route.name == 'stratForm') {// 模型配置-策略配置
                            //         this.isNewNode && this.stratAdd();// 新节点则添加一条新分类
                            //     }
                            // }

                        }
                        {// 撤销恢复：记录绑定的初始版本
                            let data = JSON.parse(JSON.stringify(this.stratForm))
                            data.nodeName = this.stratForm.policyName;
                            data.nodeId = this.$route.query.nodeId;
                            data.clear = !res;
                            if(res){
                                data.policyList = res.policyList;
                            }else{
                                data.policyList = [];
                            }
                            this.$emit('firstBindPush', data)
                        }
                    })
            },
            /************************ stratForm专用的方法 ************************/
            stratAdd() {// 新建策略
                this.canShow = false
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
                this.canShow = true

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


                // console.log('完整rule', ruleNum, '所有rule', this.stratForm.ruleList.length, stratForm_sug())
                return !!this.stratForm.policyName && this.stratForm.logic && (ruleNum == this.stratForm.ruleList.length) && stratForm_sug();
            },
            saveStrat(val) {// 保存策略
                // saveStrat(id, isNewV) {// 保存策略
                let _self = this;
                if (this.validateStrat()) {
                    this.canShow = false

                    // console.log('验证通过')
                    // 这里走的是新增策略，无论是冠军挑战者还是普通绑定
                    // 如果是点击了保存，临时保存到本地
                    if (val == 'isAddBtn') {
                        // 无论是不是冠军挑战者，还是普通策略模板，点击完成后都要显示决策意见的那个页面，
                        // 相应的按钮也要变成“新增策略的保存”，然后点击新增策略的保存请求val==‘newCelueBtn’的里面方法

                        this.canShow = true // 显示决策意见，isAddBtn的按钮就隐藏了

                        this.stratForm.appId = this.appId ? this.appId : this.$route.query.appId;
                        let data = JSON.parse(JSON.stringify(this.stratForm));
                        data.ruleList.map(item => {
                            item.id = ''
                        });
                        // console.log(data)

                        // 如果是冠军挑战者，无论是否要保存策略模板，先把这个数据保存到本地isAddBtnData，等到绑定完成后删除

                        // 如果是选择保存为策略模板，直接创建新的模板
                        // 和后端商量，暂时无论是否勾选，均创建
                        this.createPolicy();

                        if (this.$route.query.from == 'kingForm') {
                            this.$local.set('isAddBtnData', data)


                            if (this.stratForm.policyType == true) {
                            } else {
                                // 这里要做的操作先返回到选择决策意见（3个）的页面,显示决策意见的条件是什么呢，
                                // canShow，上面已经操作过了，不需要重复操作了
                                // alert('这里要做的操作先返回到选择决策意见（3个）的页面')
                                // 这里获取到临时保存的数据，然后没有操作，坐等操作保存isChooseBtn的按钮，所以要不要无所谓了
                                this.$local.get('isAddBtnData')
                            }
                        } else {
                            // 这里要走的是普通绑定的时候的操作，因为上面canShow已经为真，所以也会返回选择决策意见（3个）的页面，
                            // 并且此时的按钮根据相关的条件操作，也是显示的是val==newCelueBtn的按钮
                        }
                        // this.stratForm.policyType = this.stratForm.policyType ? 0 : this.policyType;// 0：模板，1：一般策略，2：分类策略,3:并行计算策略。默认为1


                        // 下面两个走的都是选择或者通过isAddBtn后的操作
                    } else if (val == 'isChooseBtn') {
                        // 当val==isChooseBtn的时候说明一定是kingForm的情况，不需要在判断了，点击保存要返回到添加冠军/挑战者页面
                        // 这个是保存冠军挑战者得按钮
                        // console.log(this.stratForm)
                        let data = JSON.parse(JSON.stringify(this.stratForm))
                        data.nodeId = this.$route.query.nodeId.slice(4);
                        data.ruleList.map((rItem, rIndex) => {
                            rItem.id = '';
                        })

                        let localArr = []
                        // 如果本地policyList有数据
                        // this.$local.get('policyList')从哪里来的？
                        // 第一是点击完val == 'isChooseBtn'的保存按钮后this.$local.set('policyList', localArr)
                        // 第二是从kingForm里面this.getList()赋值的
                        if (JSON.stringify(this.$local.get('policyList')) != '{}') {
                            // 如果本地policyList不为空，赋值给localArr
                            localArr = this.$local.get('policyList')
                            // console.log(this.$local.get('isAddBtnData'))
                            // console.log(!this.$local.get('isAddBtnData'))
                            if (!this.$local.get('isAddBtnData')) {
                                localArr.push(this.$local.get('isAddBtnData'))
                                this.$local.delete('isAddBtnData')
                            } else {
                                // 如果存在formIndex，说明是编辑某一个策略信息
                                if (this.$local.get('formIndex')) {
                                    localArr[this.$local.get('formIndex') - 1] = this.stratForm
                                } else {
                                    localArr.push(data)
                                }
                            }
                            // 这个主要用于修改本地内容
                            if (this.$route.query.policyId) {
                                localArr.map((item, index) => {
                                    if (item.policyId == this.$route.query.policyId) {
                                        localArr[index] = data
                                    }
                                })
                            }
                            // console.log(localArr)
                            this.$local.set('policyList', localArr)
                            // console.log(this.$local.get('policyList'))
                        } else {
                            // 如果本地是空的话，往localArr数组里面添加数据，然后保存在本地
                            localArr.push(data)
                            this.$local.set('policyList', localArr)
                        }

                        // 点击完成后，跳转回到kingForm列表页面
                        this.$router.push(this.$route.fullPath.replace('/stratForm', '/kingForm'))
                        // 到这里这样的操作已经结束了，然后在kingForm里面在点击保存按钮请求绑定的接口
                    } else if (val == 'newCelueBtn') {
                        // 当val==newCelueBtn的时候说明一定是普通绑定的情况，不需要在判断了，直接绑定就好了

                        // 如果是策略模板中添加模板，路由/risk/stratMg/stratList/stratAdd?type=add
                        // 这里是添加模板
                        // console.log(this.$route.name)
                        if (this.$route.name == 'stratAdd' || this.$route.name == 'stratEdit') {
                            if (this.$route.query.policyId) {
                                this.updatePolicy(this.$route.query.policyId);// 修改
                            } else {
                                this.createPolicy()
                            }
                        } else {
                            // 普通绑定
                            let data = JSON.parse(JSON.stringify(this.stratForm))
                            data.nodeId = this.$route.query.nodeId.slice(4);
                            data.ruleList.map((rItem, rIndex) => {
                                rItem.id = '';
                            })
                            data.policyId = ''
                            this.bindStrat(data)
                        }
                    } else if (val == 'stratEditBtn') {
                        // 这里只适用于策略管理中的策略模板的编辑
                        if (this.$route.query.policyId) {
                            this.updatePolicy(this.$route.query.policyId);// 修改
                        }
                    }
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
            bindStrat(data) {// 绑定策略
                this.stratForm.policyType = this.stratForm.policyType ? 0 : this.stratForm.policyType;// 0：模板，1：一般策略，2：分类策略,3:并行计算策略。默认为1
                let _self = this;
                if (this.validateStrat()) {
                    // 验证通过了
                    this.canShow = false

                    let arr = []
                    arr.push(data)
                    // 无论是冠军挑战者还是普通的都需要请求绑定接口
                    this.$post('/mcs/node/policy/bind', {
                        nodeId: this.$route.query.nodeId.slice(4),
                        policyList: arr,
                    })
                        .then(res => {
                            this.$message.success('绑定成功')
                            //data.nodeName = this.stratForm.policyName;
                            //data.nodeId = this.$route.query.nodeId;
                            // arr[0].nodeName = this.stratForm.policyName
                            // arr[0].nodeId = this.stratForm.nodeId
                            this.$emit('saveForm', {
                                nodeDomId: this.$route.query.nodeId,
                                nodeId: this.$route.query.nodeId.slice(4),
                                nodeName: this.stratForm.policyName,
                                formType: 'policy',
                                policyList: arr
                            });// 关闭弹窗

                            this.resetStratForm();// 重置stratForm
                            this.show.stratName = true;
                        })
                } else {
                    this.$notify({// 通知提示
                        message: '策略信息不完整',
                        type: 'warning',
                        customClass: 'pos-stratForm2',
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
                        if (this.$route.name == 'stratAdd' || this.$route.name == 'stratEdit') {
                            this.$router.push('/risk/stratMg/stratList');// 策略管理——新增策略模板
                        } else {
                            this.stratForm.policyId = '';
                        }
                    })
            },
            updatePolicy(policyId) {
                const data = JSON.parse(JSON.stringify(this.stratForm))
                data.policyId = policyId;// 策略ID有值:保存，无值:保存为新版本
                data.nodeId = this.$route.query.nodeId ? this.$route.query.nodeId.slice(4) : ''
                // data.newVersion = 1
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

                        res.ruleList.map((ruleItem, ruleIndex) => {
                            ruleItem.ruleConShow = false;//  默认不展开
                            // ruleItem.ruleContent = [];// 预先注册ruleContent
                            ruleItem.ruleContent.map((ruleConItem, ruleConIndex) => {
                                ruleConItem.sort = ruleConIndex;
                                ruleConItem.operationArray = ruleConItem.content.map(conItem => conItem.operationValue);// 渲染枚举型
                                ruleConItem.oprList = [];// 注册oprList操作符列表
                                this.getVarType(ruleConItem, ruleConIndex, 0)// 获取变量类型及相应的操作符列表
                            })
                            if (!ruleItem.isTemplate) {// 非模板，id没在规则列表里，所以直接显示名称
                                ruleItem.id_back = ruleItem.id;
                                ruleItem.id = ruleItem.ruleName;
                            }
                        })
                        // 自动冒泡排序
                        res.ruleList.sort((a, b) => {
                            return a.sort - b.sort;
                        })


                        delete res.appId;
                        // 进页面请求得到this.stratForm
                        Object.assign(this.stratForm, res)

                    })

            }
            ,
            /************************ 与ruleForm交互的方法：新建规则&&插入规则 ************************/
            ruleAdd() {// 新建规则
                this.$router.push({path: this.$route.path + '/ruleForm', query: this.$route.query});
            },
            pushRule(ruleForm) {
                // console.log("策略中新增规则");
                this.stratForm.ruleList = this.stratForm.ruleList.filter((item) => {// 清除未完成的规则操作
                    return !!item.ruleName;
                })
                // console.log("保存规则到策略模板", this.$route.query);
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
        watch: {
            'stratForm.policyType':

                function (val) {
                    // console.log(val)
                }
        }
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
