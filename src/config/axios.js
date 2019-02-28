import axios from 'axios'
import comApi from './comApi'// 公共接口
import Vue from 'vue'
import { Notification, Loading } from 'element-ui';// 通知提示
let notify = function(opt){// 修改提示时长默认值
    opt.duration = 3000;
    Notification(opt);
}
import '../../static/conf/config'
// var apiUrl = "http://192.168.21.22:8090";// 测试
// var redirectAc = "http://172.20.4.233:9290/tc-ac-web/a";
// var redirectVar = "http://172.20.4.233:9380/tc-var-web/a";

Vue.prototype.$notify = notify;
Vue.prototype.$loading = Loading.service;
Vue.use(Loading.directive);//  v-loading="loading"指令用于数据加载完之前的noData控制
let log = {
    reqConfig:function(config){// 请求报错
        console.group('请求')
            console.log('请求url',config.url);
            console.log('请求headers',config.headers);
            config.params&&console.log('请求params',config.params);
            config.data&&console.log('请求data',config.data);
            console.log('请求config',config);
        console.groupEnd();
    },
    reqError:function(error){// 请求报错
        console.group('请求错误',error.message)
            console.log('请求url',error.config.url);
            config.params&&console.log('请求params',error.config.params);
            config.data&&console.log('请求data',error.config.data);
            console.log('请求error',error);
        console.groupEnd();
    },
    resRes:function(res){
        console.group('响应数据')
            console.log('data',res.data);
        console.groupEnd();
    },
    resConfig:function(error){// 响应报错
        console.group('错误信息',error.message)
            console.error('响应url',error.config.url);
            console.error('err>res',error.response.data);
            console.error('status',error.response.status);
            console.error('headers',error.response.headers);
        console.groupEnd();
    },
    error:function(error){
        console.group('error四大员',error.message);
            console.error('config:',"%o",error.config);
            console.error('code:',"%o",error.code);
            console.error('request:',"%o",error.request);
            console.error('response:',"%o",error.response);
        console.groupEnd();
    },
    each:function(error){
        console.error('遍历error',Object.keys(error),Object.values(error));
        console.table(Object.entries(error))
    },
}
let loading = {};
let openLoading = function(config){// 备注：config.loadingDom节点要加[position:relative;]才生效,如果此节点有v-if，则loadingDom须指向起父级层
    if(document.querySelector(config.loadingDom)&&config.loadingDom){// DOM节点存在时开启loading
        let loadTag = config.loadingDom.replace(/[#.\s\.]/g,'')
        // console.log('开启loading',loadTag);
        console.time(loadTag);
        loading[loadTag] = Loading.service({target:config.loadingDom,text:config.loadingText});
    }
}
let closeLoading = function(config){
    if(config&&config.loadingDom){// 开启loading
        let loadTag = config.loadingDom.replace(/[#.\s\.]/g,'')
        // console.log('关闭Loading',loadTag);
        loading[loadTag]&&console.timeEnd(loadTag)
        loading[loadTag]&&loading[loadTag].close();// 关闭Loading
    }else{// config未定义
        Object.keys(loading).map((item)=>{
            loading[item]&&loading[item].close();// 关闭所有Loading
        })
    }
}
axios.defaults.timeout = 60000;
axios.defaults.headers.post['Content-Type'] = 'application/json';
// 添加请求拦截器
axios.interceptors.request.use(config => {
    // 在发送请求之前
    if(config.debug){
        log.reqConfig(config);
    }
    // config.data = JSON.stringify(config.data);// 参数转成字符串类型
    openLoading(config);// 开启loading
    return config;
}, error => {
    closeLoading(config);// 关闭Loading
    // 对请求错误
    log.reqError(error);
    notify({// 通知提示
        title: '温馨提示',
        message: '请求失败',
        type: 'warning'
    })
    uploadErr();// 上报错误日志
    return Promise.reject(error);
})
// 添加响应拦截器
axios.interceptors.response.use(res => {
    closeLoading(res.config);// 关闭Loading:响应错误
    if(res.config.responseType=='jsonp'){
        res.data = nwApi.json(res.data);
    }
    {/** Jim修改于2018-04-02 14:16:26 @接口协议规范：\天秤解决方案\架构设计\接口协议\天秤内部系统接口协议文档.docx */
        if(!!res.data.responseCode){
            if(res.data.responseCode=='E0000000'){
                res.data.ret = '0';
            }else{
                res.data.ret = res.data.responseCode;// 响应码
            }
        }
        res.data.data = !!res.data.responseBody?res.data.responseBody:res.data.data;// 响应消息体
    }
    // 对响应数据
    if(res.data.ret=='0'){
        if(res.config.debug){log.resRes(res)};
        if(!!res.data.data&&!!res.data.data.errorcode?(res.data.data.errorcode==0):true){// 业务级：正确：是否要提示
            !!res.config.successMsg&&notify({
	            title: '温馨提示',
	            message: res.config.successMsg,// 响应成功提示语
	            type: 'success',
	            position:'bottom-right',
            })
        }else{// 业务级：错误：是否要提示
            console.log("errorcode!=0",res.data);
            !!res.config.webErrTip&&notify({
                title: '温馨提示',
	            message: res.data.data.errorMsg?res.data.data.errorMsg:'程序出了点小错误',
	            type: 'warn',
	            position:'bottom-right',
            })
            uploadErr();// 上报错误日志
        }
        return res.data;
    }else{
        console.log("ret!=0",res.data);
        if(res.data.ret=='10002'){// 登陆失效，请重新登录
            localStorage.removeItem('userInfo');
            console.log('删除token',comApi.urlDelParam('token'))
            console.log('重定向地址location.has',location.hash)
            location.hash = '#/login?redirect='+unescape(location.hash.split(location.hash.includes('login?redirect')?'#/login?redirect=':'#')[1]);/** Jim修改于2018-09-25 14:57:17 @重新登录后返回redirect */
        }
        !!res.config.retErrTip&&notify({// 系统级：错误：是否要提示
                title: '温馨提示',
                message: res.data.message?res.data.message:'服务器开小差了',
                type: 'error',
                duration: 500,
                position:'bottom-right',
                // customClass:'center-center',
                onClose:function(){

            }
        })
        uploadErr();// 上报错误日志
        return Promise.reject(res.data);// 系统级：错误：进入页面catch
    }
}, error => {
    closeLoading();// 关闭Loading:响应错误
    // 响应错误
    if (error.response) {
        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
        console.log('响应错误err>res',error.response)
        notify({title: '错误',message: '未知错误',type: 'error'})
    } else if (error.request) {
        console.log('请求错误err>req',error.request)
        notify({title: '错误',message: '请求失败',type: 'error'})
        if(error.request.readyState == 4 && error.request.status == 0){
            // 请求超时，在这里可以发起重新请求
        }else{

        }
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('err>msg', error.message);
        notify({title: '错误',message: '未知错误',type: 'error'})
    }
    uploadErr();// 上报错误日志
    // return;// 网关级的错误：只提示，不丢给页面
    return Promise.reject(error);// 网关级的错误
})

let axios2 = function(args,callback=function(){},errFn=function(){}){
    args.ret!=undefined&&mockApi[args.url.split('/')[args.url.split('/').length-2]][args.url.split('/')[args.url.split('/').length-1]](args);/** Jim修改于2018-03-02 13:02:18 @全局模拟数据 */

    let userInfo = localStorage.getItem("userInfo");
    let token = '';
    if(args.headers&&args.headers.token){/** Jim修改于2018-04-08 14:09:59 @传参token */
        token = args.headers.token;
    }else if(userInfo){/** Jim修改于2018-04-08 14:10:13 @用户登录后 */
        token = JSON.parse(userInfo).token;
    }else if(comApi.getParam('token')){
        token = comApi.getParam('token').split('#')[0];
    }
    axios({
        url:apiUrl+args.url,
        method:args.method?args.method:'post',
        data:!!args.data?args.data:{},
        params:args.params,
        timeout:args.timeout?args.timeout:axios.defaults.timeout,
        responseType:args.responseType,
        headers: {"token": token},// 跨域凭证，默认：为空
        successMsg:args.successMsg,// ret==0，自定义成功提示语，String，默认：不提示
        httpErrTip:args.httpErrTip?args.httpErrTip:true,// catch，网关级错误是否开启全局提示，boolean，默认：开启(直接提示)
        retErrTip:args.retErrTip?args.retErrTip:true,// ret!=0，系统级错误是否开启全局提示，boolean，默认：开启(直接提示)
        webErrTip:args.webErrTip?args.webErrTip:true,// errorCode!=0，业务级错误是否开启全局提示，boolean，默认：开启(前端判断分别处理)
        debug:args.debug,// 是否开启debug，boolean，默认：不开启
        loadingDom:args.loadingDom,// 本次请求是否开启loading，，PC:querySelector，Mobile:boolean，默认：不开启
        loadingText:args.loadingText,
        // ret:0,// 启用模拟数据，Number，默认：不开启
    })
    .then((res) => {
        callback(res);
    })
    .catch((err) => {
        // console.log('error',err);
        errFn(err);
    })
}
let uploadErr = function(){
    return;
    let navigator2 = {
        appCodeName:navigator.appCodeName,// 返回浏览器的代码名
        appName:navigator.appName,// 返回浏览器的名称
        appVersion:navigator.appVersion,// 返回浏览器的平台和版本信息
        cookieEnabled:navigator.cookieEnabled,// 返回指明浏览器中是否启用 cookie 的布尔值
        platform:navigator.platform,// 返回运行浏览器的操作系统平台
        userAgent:navigator.userAgent,// 返回由客户机发送服务器的user-agent 头部的值
    }
    let screen2 = {
        availHeight:screen.availHeight,// 返回屏幕的高度（不包括Windows任务栏）
        availWidth:screen.availWidth,// 返回屏幕的宽度（不包括Windows任务栏）
        colorDepth:screen.colorDepth,// 返回目标设备或缓冲器上的调色板的比特深度
        height:screen.height,// 返回屏幕的总高度
        pixelDepth:screen.pixelDepth,// 返回屏幕的颜色分辨率（每象素的位数）
        width:screen.width,// 返回屏幕的总宽度
    }
    axios2({
        url:'/mcs/error/upload',
        data:{
            navigator:navigator2,// 浏览器的信息  String  Y
            screen:screen2,// 客户端显示屏幕 String  Y
            location:JSON.stringify(location),// 窗口或框架信息 String  Y
            localStorage:JSON.stringify(localStorage),// localStorage    String  Y
            sessionStorage:JSON.stringify(sessionStorage),// sessionStorage  String  Y
            cookie:document.cookie,// cookie  String  Y
        },
        httpErrTip:false,
        retErrTip:false,
        webErrTip:false,
        debug:true,
    },(res)=>{
        console.log('错误日志上报成功')
    },(err)=>{
        console.log('错误日志失败')
    })
}

export default axios2
