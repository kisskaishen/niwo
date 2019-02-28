// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'// 85kb
import App from './App'
import router from './config/router'
import $ from 'jquery'
import {
    Form, FormItem, Input, Select, Option, Button, Dialog, Checkbox,
    DatePicker, Pagination, Table, TableColumn, Radio, RadioGroup, RadioButton, Row, Col,
    Menu, Submenu, MenuItem, MenuItemGroup, Popover, Breadcrumb, BreadcrumbItem,
    Tabs, TabPane, Dropdown, DropdownMenu, DropdownItem,Tooltip,Collapse,CollapseItem,
    Loading, MessageBox, Notification, Message
} from 'element-ui';

Vue.use(Button)
Vue.use(Select)
Vue.use(Option)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(DatePicker)
Vue.use(Pagination)
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton)
Vue.use(Row);
Vue.use(Col);
Vue.use(Checkbox);
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Popover)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Tooltip);
Vue.use(Collapse);
Vue.use(CollapseItem);

Vue.use(Loading)

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

Vue.prototype.$bus = new Vue();

import echarts from 'echarts'

Vue.prototype.$echarts = echarts

import './config/toFixed'

import {get, post, baseUrl} from './config/api'
import {setCookie, getCookie, clearCookie} from './config/util'
import Util from './config/util'

Vue.use(Util)

Vue.prototype.$setCookie = setCookie
Vue.prototype.$getCookie = getCookie
Vue.prototype.$clearCookie = clearCookie

Vue.prototype.$baseUrl = baseUrl
Vue.prototype.$post = post
Vue.prototype.$get = get

/* **************************************** ES6及axios兼容 **************************************** */
require("babel-polyfill"); // 100kb+：解决PC及安卓低版本浏览器兼容问题

/* **************************************** CSS基础样式 **************************************** */
require('normalize.css');

//导出功能
// require('script-loader!file-saver'); //保存文件用
// require('script-loader!config/Blob'); //转二进制用
// require('script-loader!xlsx/dist/xlsx.core.min'); //xlsx核心

/* **************************************** 自定义API **************************************** */
// import axios2 from './config/axios'// 13kb:axios配置
// window.axios = axios2;

// import mockApi from './config/mockApi'// 虚拟接口
// window.mockApi = mockApi;// 虚拟接口

// import comApi from './config/comApi'// 公共接口
// window.comApi = comApi;// 公共接口
let img404 = require('img/404/404.png')

import Csv from './config/cvs'
Vue.use(Csv)
// import FileSaver from 'file-saver';
// const Json2csvParser = require('json2csv').Parser;
// const datetime = Date.now();
// const exportCSV = (data, filename=`${datetime}.csv`) => {
//     const parser = new Json2csvParser();
//     const csvData = parser.parse(data);
//     const blob = new Blob(['\uFEFF' + csvData], {type: 'text/plain;charset=utf-8;'});
//     FileSaver.saveAs(blob, filename);
// }

/* **************************************** VUE **************************************** */
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    data() {
        return {
            userInfo: localStorage.userInfo ? JSON.parse(localStorage.userInfo) : '',
        }
    },
    router,
    components: {App},
    created() {
        // this.autoFontSize();// 移动端自适应
    },
    methods: {
        autoFontSize() {
            let width_ = document.body.scrollWidth;
            document.documentElement.style.fontSize = (width_ <= 750) ? (width_ / 7.5 + 'px') : '100px';
        },
        imgError(e) {// 图片载入失败
            e.target.src = img404;
        },
    },
    template: '<App/>'
})
