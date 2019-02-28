import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import {getCookie, clearCookie, local, session} from './util'
import router from './router'
import {Loading} from 'element-ui';
Vue.use(Loading)
// Vue.prototype.$loading = Loading.service;


import '../../static/conf/config'

axios.defaults.timeout = 30000;                        //响应时间
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;'; 		// 请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'; 		// 请求头
// axios.defaults.withCredentials = true
// const apiUrl = "http://192.168.21.22:8090";// 测试
// const redirectAc = "http://172.20.4.233:9290/tc-ac-web/a";
// const redirectVar = "http://172.20.4.233:9380/tc-var-web/a";
axios.defaults.baseURL = apiUrl

// 请求拦截器
axios.interceptors.request.use((config) => {
        let token = getCookie('token')
        if (token) {
            config.headers.common['token'] = token;
        }
        return config
    }, (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
axios.interceptors.response.use((response) => {
        return response
    }, (error) => {
        return Promise.reject(error)
    }
)

// 封装axios
export let baseUrl = axios.defaults.baseURL

// get
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {params: params})
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
    })
}

// post
export function post(url, data) {
    let loadingOption = {
        customClass: 'disable-click'
    }
    let loading = Loading.service(loadingOption)
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then((response) => {
                if (response.data.ret == '0') {
                    resolve(response.data.data)
                } else if (response.data.ret == '10002') {
                    clearCookie('token')
                    clearCookie('name')
                    session.set('beforeUrl', router.app.$route.fullPath.indexOf('/login') > -1 ? '/risk' : router.app.$route.fullPath)
                    this.$router.push('/login')
                    this.$message.error(response.data.message)
                } else {
                    this.$message.error(response.data.message)
                }
                loading.close()
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// // upload
// export function upload(url, data) {
//     return new Promise((resolve, reject) => {
//         axios.post(url, data)
//             .then((response) => {
//                 if (response.data.code == '200') {
//                     resolve(response.data.data.result)
//                 }
//             })
//             .catch((error) => {
//                 Toast({
//                     message: '请求失败，请重试',
//                 })
//                 reject(error)
//             })
//     })
// }
