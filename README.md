## 开发代码
>    http://192.168.18.14/svn/niiwoo/TianChengSystem/code/14_ModelConfigSystem/tc-mcs-h5

## 接口文档
>    http://192.168.18.14/svn/niiwoo/TianChengSystem/doc/各系统文档/魔方风控决策系统/设计文档/V3.0.0

## 产品原型
>    http://192.168.18.14/svn/niiwoo/TianChengSystem/doc/各系统文档/风控决策引擎/V3.0.0/产品设计

## 转测地址
>    http://192.168.18.14/svn/niiwoo/TianChengSystem/doc/各系统文档/测试组/提测文档/转测文件/魔方风控决策引擎/V3.0.0/package

## 访问地址：
- >    测试服：http://192.168.18.86:5800
- >    正式：

## 拖拽插件：jsplumb
- >    官网：https://jsplumbtoolkit.com
- >    版本：Community Edition
- >    API Documentation：https://jsplumbtoolkit.com/community/apidocs/classes/jsPlumb.html
- >    基础教程：https://wdd.js.org/jsplumb-chinese-tutorial/#/
- >    参考文献：https://www.cnblogs.com/leomYili/p/6346526.html
- >    参考文献：https://www.cnblogs.com/leomYili/p/7145445.html
- >    基础教程：https://wdd.js.org/jsplumb-chinese-tutorial/#/


## 进度说明：
###     一、所有原型现有页面已经开发联调完，所有的业务流程已经跑通。
###     二、待解决问题：
####    1、模型配置(jsplumb)
>           撤销恢复、浏览器兼容
####    2、页面样式界面优化(vue && element-UI)
>           禅道20个左右


## 工程目录文件说明

###    一、项目基础框架
``` 
"vue": "^2.5.2",
"vue-router": "^3.0.1",
"axios": "^0.17.1",
"element-ui": "^2.2.2",
"jsplumb": "^2.7.3",
``` 

###    二、项目页面结构
``` 
src/
├── App.vue
├── components/     /*************** 公共组件
│   ├── pc/
│   │   ├── breadcrumb/     /*************** 面包屑导航
│   │   │   └── breadcrumb.vue
│   │   ├── ft/     /*************** 页头
│   │   │   └── ft.vue
│   │   ├── hd/     /*************** 页尾
│   │   │   └── hd.vue
│   │   ├── menu/     /*************** 页面左侧菜单
│   │   │   └── menu.vue
│   │   ├── noData/     /*************** 暂无数据组件
│   │   │   └── noData.vue
│   │   ├── policy/     /*************** 业务公共组件
│   │   │   ├── policyItem.vue     /*************** 策略||分类
│   │   │   ├── ruleConItem.vue     /*************** 规则内容：变量
│   │   │   ├── ruleItem.vue     /*************** 规则组件
│   │   │   ├── variableCon_1.vue
│   │   │   ├── variableCon.vue     /*************** 变量内容：操作符+操作值
│   │   │   ├── variableName_1.vue
│   │   │   ├── variableName.vue     /*************** 变量名称
│   │   │   └── varItem.vue     /*************** 变量组件：变量名称+变量内容
│   │   └── result/
│   │       └── success.vue
│   ├── seo_vuex.vue
│   └── template.vue
├── config/
│   ├── axios.js     /*************** Axios配置
│   ├── bus.js
│   ├── comApi.js     /*************** 公共方法
│   ├── forage.js
│   ├── jweixin-1.2.0.js
│   ├── mockApi.js     /*************** Mock配置
│   ├── router.js     /*************** 路由配置
│   └── store.js     /*************** vuex配置（暂无使用）
├── main.js
├── pages/
│   ├── 404/     /*************** 404页面
│   │   └── 404.vue
│   ├── index/
│   │   └── index.vue
│   ├── login/     /*************** 登录
│   │   └── login.vue
│   ├── offline/     /*************** 离线评估（停止使用）
│   │   └── offline.vue
│   ├── risk/     /*************** 【风控决策引擎】
│   │   ├── dictMg/     /*************** 字典管理
│   │   │   ├── dictAdd.vue     /*************** 新增字典
│   │   │   ├── dictCustom.vue     /*************** 自定义列表
│   │   │   ├── dictEdit.vue     /*************** 编辑字典
│   │   │   ├── dictList.vue     /*************** 字典列表
│   │   │   ├── dictMg.vue     /*************** 字典管理
│   │   │   └── distCustomAdd.vue     /*************** 新增自定义列表
│   │   ├── modelMg/     /*************** 模型管理
│   │   │   ├── modelAdd.vue     /*************** 新增模型
│   │   │   ├── modelDetail/     /*************** 模型详情
│   │   │   │   └── gramsList.vue     /*************** 参数列表
│   │   │   ├── modelList.vue     /*************** 模型列表
│   │   │   ├── modelMg.vue     /*************** 模型管理
│   │   │   ├── modelUml_mousemove.vue
│   │   │   ├── modelUml.vue     /*************** 【模型配置页面】jsplumb
│   │   │   ├── scoreCard/     /*************** 评分卡
│   │   │   │   ├── scoreCard_1.vue
│   │   │   │   ├── scoreCard.vue     /*************** 评分卡编辑
│   │   │   │   ├── scoreCardPreview.vue     /*************** 评分卡预览
│   │   │   └── umlForm/     /*************** 模型配置元件弹窗
│   │   │       ├── classifyForm.vue     /*************** 配置分类器的表单
│   │   │       ├── computecard.vue     /***************  配置计算卡的表单
│   │   │       ├── parallelForm.vue     /***************  配置并行的表单
│   │   │       ├── ruleForm.vue     /***************  配置规则的表单
│   │   │       ├── scoreCardForm.vue     /***************  配置评分卡的表单
│   │   │       ├── selectClassify.vue     /***************  配置选择分类的表单
│   │   │       ├── stratForm.vue     /***************  配置策略的表单
│   │   │       └── testAB.vue     /***************  配置AB测试的表单
│   │   ├── proMg/     /*************** 产品管理
│   │   │   ├── proList.vue     /*************** 产品列表
│   │   │   └── proMg.vue     /*************** 产品管理
│   │   ├── risk.vue     /*************** 风控决策引擎
│   │   └── stratMg/     /*************** 策略管理
│   │       ├── ruleList.vue     /*************** 
│   │       ├── ruleTmpAdd.vue     /*************** 新增/编辑规则模板
│   │       ├── stratAdd.vue     /*************** 新增/编辑策略模版
│   │       ├── stratList.vue     /*************** 策略模板
│   │       ├── stratMg.vue     /*************** 策略管理
│   │       └── stratVersion.vue     /*************** 版本记录
│   ├── system/     /*************** 系统中心（暂无使用）
│   │   └── system.vue     /*************** 
│   └── template.vue     /*************** 
└── resource/     /*************** 资源
    ├── img/     /*************** 图片
    ├── js/     /*************** 工具库
    │   ├── bankCard.js     /*************** 银行卡
    │   ├── browser.js     /*************** 浏览器
    │   ├── dateFormat.js     /*************** 日期格式化
    │   ├── http.js     /*************** 网络
    │   ├── ie9PrevImg.js     /*************** 图片预览
    │   ├── img2base64.js     /*************** 图片转化
    │   ├── isType.js     /*************** 判断类型
    │   ├── jsPlumbConf.js     /*************** jsplumb全局配置文件
    │   ├── main.js
    │   ├── pages/     /*************** 页面工具
    │   │   └── modelUml.js     /*************** 模型配置jsplumb自定义方法
    │   └── regular.js     /*************** 
    └── style/     /*************** 公共样式Scss
        ├── base/     /*************** 基础样式
        │   ├── _animation.scss     /*************** 动画
        │   ├── _media.scss     /*************** 媒体查询
        │   ├── _mixin.scss     /*************** scss混入
        │   └── _var.scss     /*************** 公共变量
        ├── common/     /*************** 公共样式
        │   ├── _color.scss     /*************** 颜色
        │   ├── _font_m.scss     /*************** 移动端字体
        │   ├── _font_pc.scss     /*************** PC端字体
        │   ├── _reset.scss     /*************** 覆盖样式
        │   └── _simple.scss     /*************** 简化样式
        ├── pages/     /*************** 页面样式
        │   ├── _index.scss     /*************** 
        │   └── _ruleConItem.scss     /*************** 规则内容页样式
        ├── style.scss     /*************** 入口
        └── theme/     /*************** 主题
            └── _elementVariables.scss     /*************** 覆盖element-UI主题样式
```
