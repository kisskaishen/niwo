
    /******************************************** 线上调试：获取客户端IP *************************************************/
    setTimeout(()=>{
        let clientIp = '';
        if(window.returnCitySN){clientIp = returnCitySN.cip?returnCitySN.cip:'';}
        let isMine = clientIp=="120.234.2.106";
        let isLocal = location.hostname=='localhost'||location.hostname.indexOf('172.20')>-1;
        if(!(isMine||isLocal)){
            Object.keys(console).map((item)=>{
                // console[item] = function () {
                //     return false;/** Jim修改于2018-05-28 17:37:10 @多人调试，临时关闭 */
                // }   
            })      
        }
    },10)
    /******************************************** 判断浏览器类型及版本 *************************************************/
	let is_IE = function(version) {
        var b = document.createElement('b')
        b.innerHTML = '<!--[if IE ' + version + ']><i></i><![endif]-->'
        return b.getElementsByTagName('i').length === 1
    }
    let mobile = (/mmp|symbian|smartphone|midp|wap|phone|xoom|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
    let isWechat = function(){
        let ua = window.navigator.userAgent.toLowerCase(); 
        if (ua.match(/MicroMessenger/i) == 'micromessenger') { 
            return true; 
        } else { 
            return false; 
        }   
    }
    /******************************************** 浏览器缓存相关 *************************************************/
    let setLS = function(key,val,id=''){// 设置localStorage
        if(key.indexOf('.')>-1){
            let tmp = JSON.parse(localStorage[key.split('.')[0]+id]);
            tmp[key.split('.')[1]] = val;
            localStorage[key.split('.')[0]+id] = JSON.stringify(tmp);       
        }else{ 
            localStorage[key+id] = JSON.stringify(val);         
        }
    }
    let getLS = function(key,id=''){// 设置localStorage及$root
        if(key.indexOf('.')>-1){
            let tmp = JSON.parse(localStorage[key.split('.')[0]+id]);
            return tmp[key.split('.')[1]];      
        }else{
            let tmp = !!localStorage[key+id]?JSON.parse(localStorage[key+id]):'';
            return tmp;       
        }
    }
    let setCookie = function(cname,cvalue,exdays){// 设置 cookie 值的函数：cookie名、cookie值、cookie过期时间(天)
        var d = new Date();
        d.setTime(d.getTime()+(exdays*24*60*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    let getCookie = function(cname){// 获取 cookie 值的函数
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) 
        {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "";
    }
    let checkCookie = function(){// 检测 cookie 值的函数
        var username=getCookie("username");
        if (username!="")
        {
            alert("Welcome again " + username);
        }
        else 
        {
            username = prompt("Please enter your name:","");
            if (username!="" && username!=null)
            {
                setCookie("username",username,365);
            }
        }
    }
    /******************************************** 敏感信息脱敏 *************************************************/
    let phoneEncrypt = function(phone){            
        phone = phone.toString();
        return phone.slice(0,3)+'******'+phone.slice(-2);
    }
    let emailEncrypt = function(email){            
        email = email.toString();
        return email.slice(0,3)+'******@'+email.split('@')[1];
    }
    /******************************************** 其他 *************************************************/
    let addScript = function(url){
    	var layoutScript = document.createElement('script');
		layoutScript.type = 'text/javascript';
		layoutScript.charset = 'UTF-8';
		layoutScript.src = url;
		document.getElementsByTagName("head")[0].appendChild(layoutScript);	        	
    }
    let closeWeb = function(){
        if (navigator.userAgent.indexOf("MSIE") > 0) {
            if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                window.opener = null;
                window.close();
            } else {
                window.open('', '_top');
                window.top.close();
            }
        }else if (navigator.userAgent.indexOf("Firefox") > 0) {
            window.location.href = 'about:blank ';
        }else {
            window.opener = null;
            window.open('', '_self', '');
            window.close();
        }
    };
    
    /******************************************** URL相关 *************************************************/
	// 获取url中的参数
	let getParam = function(name){
		let reg = new RegExp("(^|\\?|&)"+ name +"=([^&]*)(\\s|&|$)", "i");
	　　if (reg.test(location.href)){
			window["url_"+name] = unescape(RegExp.$2.replace(/\+/g, " ")).split("#")[0];
			return unescape(RegExp.$2.replace(/\+/g, " "));
		}else{
			return "";
		}
	}
    let urlDelParam =function(name){
        var baseUrl = location.origin + location.pathname + "?";        
        var query = '';
        if(location.href.indexOf('#')<location.href.indexOf(name)){// #在name之前
            query = location.hash;
        }else{
            query = location.search.substr(1);
        }
        if (query.indexOf(name)>-1) {
            var obj = {}
            var arr = query.split("&");
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].split("=");
                obj[arr[i][0]] = arr[i][1];
            };
            delete obj[name];
            var url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g,"").replace(/\:/g,"=").replace(/\,/g,"&");
            return url
        }else{
            return query;
        }
    }
    // 转码解码
    let deCode = function(cnText){
        return decodeURI(escape(cnText));// 编码方式解码 → URI解码
    }
	let toJson = function(data){
		return JSON.parse(data.slice(1,-1))
	}
	let isError = function(ele){
		return !ele || ele == 'undefined' || ele == 'null' || ele == 'NaN'
	}
    //生成随机数
    let getRandom = function(min, max){
        var r = Math.random() * (max - min);
        var re = Math.round(r + min);
        re = Math.max(Math.min(re, max), min)

        return re;
    }
    //获取当前年月日20160601
    let getFullDateYMD = function(){
        var nowDate = new Date();
        var year = nowDate.getFullYear();
        var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
        var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
        return year +  month +  day;
    }
    //生成随机字母数字串
    let randomString = function(len){
        len = len || 32;
        var $chars = 'abcdefhijkmnprstwxyz0123456789';
        var maxPos = $chars.length;
        var pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }
    //字符转换表情图标
	let emoticonChange = function(str){
		var str = str;
	    var reg = new RegExp('\\【em(.+?)\\】',"g");
		//reg = /\[em(.+?)\]/g
		//console.log(str.replace(reg,'$1'))
		//var texts =  str.replace(reg,'<img src="'+ staticUrl  +'images/emoticon/$1.png">');
		var texts =  str.replace(reg,function(match, capture) {
			var captureNum = parseInt(capture);
			if(capture[0] == '0'){
				return match;
			}
			if(captureNum<86 && captureNum>0){
				return match.replace(reg,'<img src="'+ staticUrl  +'images/emoticon/'+ captureNum +'.png">');
				//return match.replace(reg,'<img src="'+ staticUrl  +'images/emoticon/$1.png">');
			}else{
				return match;
			}
					 		
		});
		return texts;
	}
    let countDown = function(time=60,fn) {// 倒计时
        let sendTime = time;
        let verifyText = '重新获取'+sendTime+'s';
        let timer = setInterval(function(){
            if(sendTime>0){
                sendTime--;
                verifyText = '重新获取'+sendTime+'s';
                if(sendTime == 0){
                    clearInterval(timer);
                    verifyText = '获取验证码';
                }
            }
            fn(verifyText);
        },1000);
    }
    /******************************************** 循环处理 *************************************************/
    let infiniteLoop = {
        arr(arr){
            if(comApi.typeis.arr(arr)){
                arr.some((item)=>{
                    if(comApi.typeis.arr(item)){
                        infiniteLoop.arr(item)
                    }else if(comApi.typeis.obj(item)){
                        infiniteLoop.obj(item)
                    }else{
                        arr.some(item=>!!item)
                    }
                })
            }else if(comApi.typeis.obj(arr)){
                infiniteLoop.obj(arr)
            }else{
                console.log('不是数组也不是对象')
            }
        },
        obj(obj){
            if(comApi.typeis.obj(obj)){
                Object.keys(obj).some((item)=>{
                    if(comApi.typeis.obj(obj[item])){
                        infiniteLoop.obj(obj[item])
                    }else if(comApi.typeis.arr(obj[item])){
                        infiniteLoop.arr(obj[item])
                    }else{
                        Object.keys(obj).some(item=>!!obj[item])
                    }
                })
            }else if(comApi.typeis.arr(obj)){
                infiniteLoop.arr(obj)
            }else{
                console.log('不是对象也不是数组')
            }
        },
    }
    /******************************************** 深度拷贝 *************************************************/
    let deepCopy = function(...objs) {
        let result = {}
        objs.forEach(item => {
            if (typeof item === 'object' && item !== null) {
                Object.keys(item).forEach(key => {
                    let value = item[key]
                    if (typeof value === 'object' && item !== null) {
                        if (Array.isArray(value)) {
                            result[key] = JSON.parse(JSON.stringify(value))
                        } else {
                            result[key] = deepCopy(result[key], value)
                        }
                    } else {
                        result[key] = value
                    }
                })
            }
        })
        return result
    }
    /******************************************** 基本类型：typeof *************************************************/
    let isFunction = function(fn) {
        return typeof(fn) == 'function';
    }
    let isNumber = function(val) {
        return typeof(val) == 'number';
    }
    let isString = function(val) {
        return typeof(val) == 'string';
    }
    let isUndefined = function(val) {
        return typeof(val) == 'undefined';
    }
    /******************************************** 数组类型：Instanceof *************************************************/
    let isArray = function(arr) {
        return arr instanceof Array;
    }
    /******************************************** 判断未知对象的类型：constructor构造函数 *************************************************/
    let isArrayPlus = function(obj) {
        return typeof obj == 'object' && obj.constructor == Array;
    }
    /******************************************** 不同的框架iframe中，创建的数组是不会相互共享其prototype属性 *************************************************/
    let isArrayEnd = function(obj) {
        return Object.prototype.toString.call(obj) == '[object Array]';
    }
    let typeis = {
        num: num => Object.prototype.toString.call(num) == '[object Number]',
        str: str => Object.prototype.toString.call(str) == '[object String]',
        und: und => Object.prototype.toString.call(und) == '[object Undefined]',
        bl: bl => Object.prototype.toString.call(bl) == '[object Boolean]',
        obj: obj => Object.prototype.toString.call(obj) == '[object Object]',
        arr: arr => Object.prototype.toString.call(arr) == '[object Array]',
        fn: fn => Object.prototype.toString.call(fn) == '[object Function]',
    }
    /******************************************** 其他 *************************************************/
// 返回在vue模板中的调用接口
export default {
    is_IE,mobile,isWechat,// 判断浏览器版本
    closeWeb,// 窗口相关
    addScript,// 标签相关
    toJson,getRandom,urlDelParam,getFullDateYMD,randomString,isError,emoticonChange,getParam,phoneEncrypt,emailEncrypt,deCode,deepCopy,// 转换方法
    countDown,infiniteLoop,// 业务相关方法
    setLS,getLS,setCookie,getCookie,checkCookie,// 浏览器缓存相关方法
    isFunction,isFunction,isNumber,isString,isUndefined,isArray,isArrayPlus,isArrayEnd,typeis,// 判断数据类型
}