import Vue from 'vue'
import Router from 'vue-router'
import {getCookie} from "../config/util";
// import axios from './axios'// 13kb:axios配置
// import comApi from './comApi'// 公共接口
// 404
const Error404 = r => require.ensure([], () => r(require('@/pages/404/404')), 'Error404')
// 登录
const LoginLogin = r => require.ensure([], () => r(require('@/pages/login/login')), 'LoginLogin')

// 首页
const IndexIndex = r => require.ensure([], () => r(require('@/pages/index/index')), 'IndexIndex')


/* 风控决策引擎 */

// 产品管理
const RiskRisk = r => require.ensure([], () => r(require('@/pages/risk/risk')), 'RiskRisk')

// 产品管理
const proMg = r => require.ensure([], () => r(require('@/pages/risk/proMg/proMg')), 'proMg')
const proList = r => require.ensure([], () => r(require('@/pages/risk/proMg/proList')), 'proList')
const BusinessList = r => require.ensure([], () => r(require('@/pages/risk/proMg/BusinessList')), 'BusinessList')
const BusinessAdd = r => require.ensure([], () => r(require('@/pages/risk/proMg/businessAdd')), 'BusinessAdd')
const EditFlow = r => require.ensure([], () => r(require('@/pages/risk/proMg/flow/editFlow')), 'EditFlow')
// 评分卡
const FlowScoreCardForm = r => require.ensure([], () => r(require('@/pages/risk/proMg/flow/flowForm/scoreCardForm')), 'FlowScoreCardForm')
// 策略
const FlowClassifyForm = r => require.ensure([], () => r(require('@/pages/risk/proMg/flow/flowForm/classifyForm')), 'FlowClassifyForm')

// 策略
const FlowStratForm = r => require.ensure([], () => r(require('@/pages/risk/proMg/flow/flowForm/stratForm')), 'FlowStratForm')
// 规则
const FlowRuleForm = r => require.ensure([], () => r(require('@/pages/risk/proMg/flow/flowForm/ruleForm')), 'FlowRuleForm')
// 分类
const FlowSelectClassify = r => require.ensure([], () => r(require('@/pages/risk/proMg/flow/flowForm/selectClassify')), 'FlowSelectClassify')
// 计算卡
const FlowComputecard = r => require.ensure([], () => r(require('@/pages/risk/proMg/flow/flowForm/computecard')), 'FlowComputecard')
// 并行
const FlowParallelForm = r => require.ensure([], () => r(require('@/pages/risk/proMg/flow/flowForm/parallelForm')), 'FlowParallelForm')
// 风险定价
const FlowCreditForm = r => require.ensure([], () => r(require('@/pages/risk/proMg/flow/flowForm/creditForm')), 'FlowCreditForm')
// 决策流
const FlowOutFrandForm = r => require.ensure([], () => r(require('@/pages/risk/proMg/flow/flowForm/outFrandForm')), 'FlowOutFrandForm')
// 冠军表单
const FlowKingForm = r => require.ensure([], () => r(require('@/pages/risk/proMg/flow/flowForm/kingForm')), 'FlowKingForm')


// 模型管理
const modelMg = r => require.ensure([], () => r(require('@/pages/risk/modelMg/modelMg')), 'modelMg')
const modelList = r => require.ensure([], () => r(require('@/pages/risk/modelMg/modelList')), 'modelList')
const modelAdd = r => require.ensure([], () => r(require('@/pages/risk/modelMg/modelAdd')), 'modelAdd')
const scoreCard = r => require.ensure([], () => r(require('@/pages/risk/modelMg/scoreCard/scoreCard')), 'scoreCard')
const scoreCardPreview = r => require.ensure([], () => r(require('@/pages/risk/modelMg/scoreCard/scoreCardPreview')), 'scoreCardPreview')

// import scoreCard_1 from 'pages/risk/modelMg/scoreCard/scoreCard_1'

const modelUml = r => require.ensure([], () => r(require('@/pages/risk/modelMg/modelUml')), 'modelUml')
const classifyForm = r => require.ensure([], () => r(require('@/pages/risk/modelMg/umlForm/classifyForm')), 'classifyForm')
const scoreCardForm = r => require.ensure([], () => r(require('@/pages/risk/modelMg/umlForm/scoreCardForm')), 'scoreCardForm')
// 策略
const stratForm = r => require.ensure([], () => r(require('@/pages/risk/modelMg/umlForm/stratForm')), 'stratForm')
const parallelStratForm = r => require.ensure([], () => r(require('@/pages/risk/modelMg/umlForm/parallelstratForm')), 'parallelStratForm')
// 规则
const ruleForm = r => require.ensure([], () => r(require('@/pages/risk/modelMg/umlForm/ruleForm')), 'ruleForm')
const ruleForm2 = r => require.ensure([], () => r(require('@/pages/risk/modelMg/umlForm/ruleForm2')), 'ruleForm')
// 分类
const selectClassify = r => require.ensure([], () => r(require('@/pages/risk/modelMg/umlForm/selectClassify')), 'selectClassify')
// 计算卡
const computecard = r => require.ensure([], () => r(require('@/pages/risk/modelMg/umlForm/computecard')), 'computecard')
// 计算卡
const testAB = r => require.ensure([], () => r(require('@/pages/risk/modelMg/umlForm/testAB')), 'testAB')
// 并行
const parallelForm = r => require.ensure([], () => r(require('@/pages/risk/modelMg/umlForm/parallelForm')), 'parallelForm')
// 并行
const gramsList = r => require.ensure([], () => r(require('@/pages/risk/modelMg/modelDetail/gramsList')), 'gramsList')
// 冠军表单
const kingForm = r => require.ensure([], () => r(require('@/pages/risk/modelMg/umlForm/kingForm')), 'kingForm')

// 策略管理
const stratMg = r => require.ensure([], () => r(require('@/pages/risk/stratMg/stratMg')), 'stratMg')
const stratList = r => require.ensure([], () => r(require('@/pages/risk/stratMg/stratList')), 'stratList')
const stratAdd = r => require.ensure([], () => r(require('@/pages/risk/stratMg/stratAdd')), 'stratAdd')
const stratVersion = r => require.ensure([], () => r(require('@/pages/risk/stratMg/stratVersion')), 'stratVersion')
const ruleList = r => require.ensure([], () => r(require('@/pages/risk/stratMg/ruleList')), 'ruleList')
const ruleTmpAdd = r => require.ensure([], () => r(require('@/pages/risk/stratMg/ruleTmpAdd')), 'ruleTmpAdd')

// 字典管理
const dictMg = r => require.ensure([], () => r(require('@/pages/risk/dictMg/dictMg')), 'dictMg')
const dictList = r => require.ensure([], () => r(require('@/pages/risk/dictMg/dictList')), 'dictList')
const dictAdd = r => require.ensure([], () => r(require('@/pages/risk/dictMg/dictAdd')), 'dictAdd')
const dictEdit = r => require.ensure([], () => r(require('@/pages/risk/dictMg/dictEdit')), 'dictEdit')
const dictCustom = r => require.ensure([], () => r(require('@/pages/risk/dictMg/dictCustom')), 'dictCustom')
const dictCustomAdd = r => require.ensure([], () => r(require('@/pages/risk/dictMg/distCustomAdd')), 'dictCustomAdd')

// 监控预警
const controlIndex = r => require.ensure([], () => r(require('@/pages/control/index')), 'controlIndex')
const controlDetailIndex = r => require.ensure([], () => r(require('@/pages/control/detail/index')), 'controlDetailIndex')

// 离线评估
const offline = r => require.ensure([], () => r(require('@/pages/offline/offline')), 'offline')
// 系统中心
const system = r => require.ensure([], () => r(require('@/pages/system/system')), 'system')

Vue.use(Router)

const VueRouter = new Router({
    // mode:'history',
    linkActiveClass: 'active',
    linkExactActiveClass: 'exact',
    routes: [
        {
            path: '*',
            alias: '/404',
            name: 'error404',
            component: Error404,
            meta: {requiresAuth: false, title: '404页面'},
        },
        {
            path: '/login',
            name: 'login',
            component: LoginLogin,
            meta: {requiresAuth: false, title: '登录'},
        },
        {
            path: '/',
            alias: '/index',
            name: 'index',
            component: IndexIndex,
            meta: {requiresAuth: true, title: '首页'},
        },
        {
            path: '/risk',
            redirect: '/risk/proMg/businessList',
            name: 'risk1',
            component: RiskRisk,
            meta: {requiresAuth: true, title: '模型', keepAlive: false},
            children: [
                // 产品管理
                {
                    path: 'proMg',
                    redirect: '/risk/proMg/businessList',
                    name: 'proMg',
                    component: proMg,
                    meta: {requiresAuth: true, title: '产品管理'},
                    // children: [
                    //     {
                    //         path: 'proList',
                    //         name: 'proList',
                    //         component: proList,
                    //         meta: {requiresAuth: true, title: '产品列表', keepAlive: true},
                    //         children: [/** Jim修改于2018-09-27 10:46:24 @将添加编辑页置于列表页子级 */
                    //             {
                    //                 path: 'proAdd',
                    //                 name: 'proAdd',
                    //                 component: proList,
                    //                 meta: {requiresAuth: true, title: '新增产品'}
                    //             },
                    //         ]
                    //     },
                    // ]
                },
                {
                    path: 'proMg',
                    redirect: '/risk/proMg/businessList',
                    name: 'risk',
                    component: RiskRisk,
                    meta: {requiresAuth: true, title: '模型', keepAlive: false},
                },
                // 业务列表
                {
                    path: '/risk/proMg/businessList',
                    component: BusinessList,
                    meta: {requiresAuth: true, title: '业务流程列表', keepAlive: false},
                },
                // 新建流程
                {
                    path: '/risk/proMg/businessAdd',
                    component: BusinessAdd,
                    meta: {requiresAuth: true, title: '新增业务流程'},
                },
                // 编辑流程
                {
                    path: '/risk/proMg/businessList/editFlow',
                    component: EditFlow,
                    meta: {requiresAuth: true, title: '编辑流程'},
                    children: [
                        {
                            path: 'scoreCardForm',
                            component: FlowScoreCardForm,
                            meta: {requiresAuth: true, title: '评分卡'},
                        },
                        {
                            path: 'classifyForm',
                            name: 'FlowClassifyForm',
                            component: FlowClassifyForm,
                            meta: {requiresAuth: true, title: '分类器'},
                        },
                        {
                            path: 'stratForm',
                            component: FlowStratForm,
                            meta: {requiresAuth: true, title: '编辑流程'},
                        },
                        {
                            path: 'flowRuleForm',
                            component: FlowRuleForm,
                            meta: {requiresAuth: true, title: '规则'},
                        },
                        {
                            path: 'selectClassify',
                            component: FlowSelectClassify,
                            meta: {requiresAuth: true, title: '分类'},
                        },
                        {
                            path: 'computecard',
                            component: FlowComputecard,
                            meta: {requiresAuth: true, title: '计算卡'},
                        },
                        {
                            path: 'parallelForm',
                            component: FlowParallelForm,
                            meta: {requiresAuth: true, title: '并行'},
                        },
                        {
                            path: 'creditForm',
                            component: FlowCreditForm,
                            meta: {requiresAuth: true, title: '风险定价'},
                        },
                        {
                            path: 'outFrandForm',
                            component: FlowOutFrandForm,
                            meta: {requiresAuth: true, title: '决策流'},
                        },
                        {
                            path: 'kingForm',
                            component: FlowKingForm,
                            meta: {requiresAuth: true, title: '冠军/挑战者'},
                        },

                    ]
                },
                // 模型管理
                {
                    path: 'modelMg',
                    redirect: '/risk/modelMg/modelList',
                    name: 'modelMg',
                    component: modelMg,
                    meta: {requiresAuth: true, title: '模型列表'},
                    children: [
                        {
                            path: 'modelList',
                            name: 'modelList',
                            component: modelList,
                            meta: {requiresAuth: true, title: '模型列表', keepAlive: false},
                            children: [/** Jim修改于2018-09-27 10:46:24 @将添加编辑页置于列表页子级 */
                                {
                                    path: 'modelAdd',
                                    name: 'modelAdd',
                                    component: modelAdd,
                                    meta: {requiresAuth: true, title: '新增模型'}
                                },
                            ],
                        },
                        {
                            path: 'scoreCard',
                            name: 'scoreCard',
                            component: scoreCard,
                            meta: {requiresAuth: true, title: '评分卡'}
                        },
                        {
                            path: 'scoreCardPreview',
                            name: 'scoreCardPreview',
                            component: scoreCardPreview,
                            meta: {requiresAuth: true, title: '查看评分卡'}
                        },
                        // { path: 'scoreCard_1', name: 'scoreCard', component: scoreCard_1, meta: { requiresAuth: true, title: '评分卡_V0.1' } },
                        {
                            path: 'gramsList',
                            name: 'gramsList',
                            component: gramsList,
                            meta: {requiresAuth: true, title: '参数列表'}
                        },
                        {
                            path: 'modelUml',
                            name: 'modelUml',
                            component: modelUml,
                            meta: {requiresAuth: true, title: '模型配置'},
                            children: [{
                                path: 'classifyForm',
                                name: 'classifyForm',
                                component: classifyForm,
                                meta: {requiresAuth: true, title: '配置分类器'},
                                children: [{
                                    path: 'stratForm',
                                    name: 'classifyForm_stratForm',
                                    component: stratForm,
                                    meta: {requiresAuth: true, title: '配置分类器-策略'},
                                    children: [
                                        {
                                            path: 'ruleForm',
                                            name: 'classifyForm_stratForm_ruleForm',
                                            component: ruleForm,
                                            meta: {requiresAuth: true, title: '配置分类器-策略-规则'}
                                        },
                                    ],
                                },]
                            },
                                {
                                    path: 'stratForm',
                                    name: 'stratForm',
                                    component: stratForm,
                                    meta: {requiresAuth: true, title: '配置策略'},
                                    children: [
                                        {
                                            path: 'ruleForm',
                                            name: 'strat_ruleForm',
                                            component: ruleForm,
                                            meta: {requiresAuth: true, title: '配置策略-规则'}
                                        },
                                    ],
                                },
                                {
                                    path: 'scoreCardForm',
                                    name: 'scoreCardForm',
                                    component: scoreCardForm,
                                    meta: {requiresAuth: true, title: '配置评分卡'}
                                },
                                {
                                    path: 'selectClassify',
                                    name: 'selectClassify',
                                    component: selectClassify,
                                    meta: {requiresAuth: true, title: '选择分类'}
                                },
                                {
                                    path: 'computecard',
                                    name: 'computecard',
                                    component: computecard,
                                    meta: {requiresAuth: true, title: '配置计算卡'}
                                },
                                {
                                    path: 'testAB',
                                    name: 'testAB',
                                    component: testAB,
                                    meta: {requiresAuth: true, title: '配置A/B测试'}
                                },
                                {
                                    path: 'parallelForm',
                                    name: 'parallelForm',
                                    component: parallelForm,
                                    meta: {requiresAuth: true, title: '配置并行'},
                                    children: [
                                        {
                                            path: 'ruleForm2',
                                            name: 'parallelForm_stratForm_ruleForm2',
                                            component: ruleForm2,
                                            meta: {requiresAuth: true, title: '配置并行-策略-规则'}
                                        },
                                        {
                                            path: 'parallelStratForm',
                                            name: 'parallelForm_stratForm',
                                            component: parallelStratForm,
                                            meta: {requiresAuth: true, title: '配置并行-策略'}
                                        },
                                    ],
                                    // children: [{
                                    //     path: 'stratForm',
                                    //     name: 'parallelForm_stratForm',
                                    //     component: stratForm,
                                    //     meta: {requiresAuth: true, title: '配置并行-策略'},
                                    //     children: [
                                    //         {
                                    //             path: 'ruleForm',
                                    //             name: 'parallelForm_stratForm_ruleForm',
                                    //             component: ruleForm,
                                    //             meta: {requiresAuth: true, title: '配置并行-策略-规则'}
                                    //         },
                                    //     ],
                                    // },]
                                },
                                {
                                    path: 'kingForm',
                                    name: 'kingForm',
                                    component: kingForm,
                                    meta: {requiresAuth: true, title: '冠军表单'}
                                },
                            ]
                        },
                    ]
                },
                // 策略管理
                {
                    path: 'stratMg',
                    redirect: '/risk/stratMg/ruleList',
                    name: 'stratMg',
                    component: stratMg,
                    meta: {requiresAuth: true, title: '策略管理'},
                    children: [
                        {
                            path: 'stratList',
                            name: 'stratList',
                            component: stratList,
                            meta: {requiresAuth: true, title: '策略模板'},
                            children: [/** Jim修改于2018-09-27 10:46:24 @将添加编辑页置于列表页子级 */
                                {
                                    path: 'stratAdd',
                                    name: 'stratAdd',
                                    component: stratAdd,
                                    meta: {requiresAuth: true, title: '新增策略模板'},
                                    children: [
                                        {
                                            path: 'ruleForm',
                                            name: 'stratAdd_ruleForm',
                                            component: ruleForm,
                                            meta: {requiresAuth: true, title: '新建规则'}
                                        },
                                    ]
                                },
                                {
                                    path: 'stratEdit',
                                    name: 'stratEdit',
                                    component: stratAdd,
                                    meta: {requiresAuth: true, title: '编辑策略模版'},
                                    children: [
                                        {
                                            path: 'ruleForm',
                                            name: 'stratEdit_ruleForm',
                                            component: ruleForm,
                                            meta: {requiresAuth: true, title: '新建规则'}
                                        },
                                    ]
                                }
                            ],
                        },
                        {
                            path: 'stratVersion',
                            name: 'stratVersion',
                            component: stratVersion,
                            meta: {requiresAuth: true, title: '版本记录'}
                        },
                        {
                            path: 'ruleList',
                            name: 'ruleList',
                            component: ruleList,
                            meta: {requiresAuth: true, title: '规则模板'},
                            children: [/** Jim修改于2018-09-27 10:46:24 @将添加编辑页置于列表页子级 */
                                {
                                    path: 'ruleTmpAdd',
                                    name: 'ruleTmpAdd',
                                    component: ruleTmpAdd,
                                    meta: {requiresAuth: true, title: '新增规则模板'}
                                },
                                {
                                    path: 'ruleTmpEdit',
                                    name: 'ruleTmpEdit',
                                    component: ruleTmpAdd,
                                    meta: {requiresAuth: true, title: '编辑规则模板'}
                                },
                            ]
                        },
                    ]
                },
                // 字典管理
                {
                    path: 'dictMg',
                    redirect: '/risk/dictMg/dictList',
                    name: 'dictMg',
                    component: dictMg,
                    meta: {requiresAuth: true, title: '字典管理'},
                    children: [
                        {
                            path: 'dictList',
                            name: 'dictList',
                            component: dictList,
                            meta: {requiresAuth: true, title: '字典列表', keepAlive: false},
                            children: [/** Jim修改于2018-09-27 10:46:24 @将添加编辑页置于列表页子级 */
                                {
                                    path: 'dictAdd',
                                    name: 'dictAdd',
                                    component: dictAdd,
                                    meta: {requiresAuth: true, title: '新增字典'}
                                },
                                {
                                    path: 'dictEdit',
                                    name: 'dictEdit',
                                    component: dictEdit,
                                    meta: {requiresAuth: true, title: '编辑字典'}
                                },
                            ],
                        },
                        {
                            path: 'dictCustom',
                            name: 'dictCustom',
                            component: dictCustom,
                            meta: {requiresAuth: true, title: '自定义列表'},
                            children: [/** Jim修改于2018-09-27 10:46:24 @将添加编辑页置于列表页子级 */
                                {
                                    path: 'dictCustomAdd',
                                    name: 'dictCustomAdd',
                                    component: dictCustomAdd,
                                    meta: {requiresAuth: true, title: '新增自定义列表'}
                                },
                            ],
                        },
                    ]
                },
            ]
        },
        {
            path: '/control',
            redirect: '/control/detail/index',
            component: controlIndex,
            meta: {requiresAuth: true, title: '监控预警'},
            children: [
                {
                    path: 'detail',
                    redirect: '/control/detail/index',
                    component: controlDetailIndex,
                    meta: {requiresAuth: true, title: '监控预警'},
                    children: [
                        {
                            path: 'index',
                            component: controlDetailIndex,
                            meta: {requiresAuth: true, title: '监控预警'},
                        }
                    ]
                }
            ]
        },
        {
            path: '/offline',
            name: 'offline',
            component: offline,
            meta: {requiresAuth: true, title: '离线状态'},
        },
        {
            path: '/system',
            name: 'system',
            component: system,
            meta: {requiresAuth: true, title: '系统中心'},
        },
    ]
})

let routeList = [];
VueRouter.beforeEach((to, from, next) => {
    to.meta.routeList = to; // 面包屑导航使用
    document.title = to.meta.title;
    // 检查是否需要登录访问
    let token = getCookie('token');
    // console.log(1, !!userInfo, to.matched, to.matched.some(record => record.meta.requiresAuth))
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (!token) {
            //loginFn();
            next("/login")
        } else {
            next()
        }
    } else {
        if (to.name == 'login' && !!token) {
            /** Jim修改于2018-09-25 15:58:17 @登录后进入登录页 */
            next(!!to.query.redirect ? to.query.redirect : '/')
        } else {
            next()
        }
    }
})

VueRouter.afterEach(route => {
    // console.log("全局进入后",route,window.history);
    // 做一个隐藏的面包屑导航来解决返回的问题。
})

export default VueRouter
