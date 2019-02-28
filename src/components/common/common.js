import Vue from 'vue'
// import self from '../../main'
let msgBox = function (content, title, type) {
    return Vue.prototype.$msgbox.confirm(content, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: type
    })
    // .then(() => {
    //     Vue.prototype.$message({
    //         type: 'success',
    //         message: thenMsg,
    //         duration: 1600
    //     })
    // })
    // .catch(() => {
    //     Vue.prototype.$message({
    //         type: 'info',
    //         message: catchMsg,
    //         duration: 1600
    //     })
    // })
}

let message = function (type, msg, duration = 1600) {
    Vue.prototype.$message({
        type: type,
        message: msg,
        duration: duration
    })
}


export default {msgBox,message}
