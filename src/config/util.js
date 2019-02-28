/**
 Vue插件，用来获取和设置localStorage存储
 */
let local = {
    set(key, value) {
        if (typeof value === 'object') {
            value = JSON.stringify(value)
        }
        localStorage.setItem(key, value)
    },
    get(key) {
        return JSON.parse(localStorage.getItem(key)) || {}
    },
    delete(key) {
        return localStorage.removeItem(key)
    }
}

let session = {
    set(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value))
    },
    get(key) {
        return JSON.parse(sessionStorage.getItem(key)) || {}
    },
    delete(key) {
        return sessionStorage.removeItem(key)
    }
}
export {local, session}
export default {
    install: function (vm) {
        vm.prototype.$local = local
        vm.prototype.$session = session
    }
}


export const setCookie = (cname, content, days = 7) => {
    let d = new Date()
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000))
    let expires = 'expires=' + d.toUTCString()
    document.cookie = cname + '=' + encodeURI(content) + ';' + expires + ';path=/'
}
export const getCookie = (cname) => {
    let name = cname + '=';
    let ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim()
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return '';
}
export const clearCookie = (cname) => {
    setCookie(cname, "", -1);
}
