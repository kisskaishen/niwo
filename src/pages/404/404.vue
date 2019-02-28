<template>
	<div class="error_404 text-center">
		<img :src="error_404" alt="">
	</div>
</template>

<script>
import error_404 from 'img/404/404.png'
export default {
	name: 'error_404',
	data () {
		return {
			msg: 'error_404 ',
            error_404:error_404,
		}
	},
    created () {
        
    },
    beforeRouteLeave: (to, from, next) => {
        next();
        // console.log("不许离开",to,from);
        // WeixinJSBridge.call('closeWindow');//关闭微信窗口
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.error_404{
    padding:10% 20%;
    img{
        width:38.2%;
    }
}
</style>
