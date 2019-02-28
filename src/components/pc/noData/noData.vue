<template>
    <div class="pages_noData">
		<div class="noData text-center">
			<img :src="noImg" alt="暂无数据" />
			<p class="f16" v-if="!!p1" v-html="p1"></p>
			<p class="f14 f_666" v-if="!!p2" v-html="p2"></p>
			<el-button class="go_pro_look el-button el-button--primary" @click="goPro()" v-if="noImg=='noData'">去产品商店看看</el-button>
		</div>
    </div>
</template>

<script>
let noData = require("img/404/noData.png")
let noAuth = require("img/404/noAuth.png")
let noOrder = require("img/404/noOrder.svg")
let noResult = require("img/404/noResult.svg")
export default {
    name: 'pages_noData',
    data () {
        return {
            pageName: 'pages_noData',
            noData,noAuth,noOrder,noResult
        }
    },
    props:['img','p1','p2'],
    computed:{
    	noImg() {
    		switch(this.img){
    			case 'noData':
    				return this.noData;
    			case 'noAuth':
    				return this.noAuth;
    			case 'noOrder':
    				return this.noOrder;
    			case 'noResult':
    				return this.noResult;
    			default:
    				return this.noData;
    		}
    	},
    },
    created () {
        
    },
    methods:{
		goPro() {
			this.$router.push("/productStore")
		},
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.pages_noData{
	.noData {
		margin: 80px 0 100px;
		img {
			width: 120px;
			margin-bottom: 30px;
		}
		p {
			line-height: 24px;
		}
		.go_pro_look {
			margin-top: 60px;
			font-size: 14px;
			width: 180px;
		}
	}
  
}
</style>
