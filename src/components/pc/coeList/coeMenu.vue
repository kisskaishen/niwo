<template>
	<transition name="fade">
		<ul class="jim_cascader popover top" :id="'cascader_'+id" ref="jim_cascader" :style="style" v-if="show">
            <li class="cascaderLi" :class="{'caretRight':!!cascaderItem.children}" v-for="(cascaderItem,cascaderIndex) in cascaderList">
                <label class="cascaderLable" :class="{'pointer':cascaderItem.type!='menu'}" @click="$emit('coeOprFn',cascaderItem,curIndex,frItem,preType)">{{cascaderItem.label}}</label>
                <ul class="childList" v-if="!!cascaderItem.children">
                    <li class="childLi" v-for="(childItem,childIndex) in cascaderItem.children">
                    	<label class="childlabel pointer" @click="$emit('coeOprFn',childItem,curIndex,frItem,preType)">{{childItem.label}}</label>
                    </li>
                </ul>
            </li>
            <!-- <i class="arrow"></i> -->
        </ul>
	</transition>
</template>

<script type="text/javascript">
	export default {
		name: 'jim_cascader',
		data () {
			return {
				show:true,
				style:{}
			}
		},
		props:['id','curIndex','frItem','preType','preValue'],
		computed:{
			cascaderList(){
				switch(this.preType){//type:1常量、type:2变量、type:3符号
					case 3:switch(this.preValue){//type:1常量、type:2变量、type:3符号
						case ')':return [
		                    {
		                        type: 2,
		                        label: '新增变量',
		                    },{
		                        type: 1,
		                        label: '新增数值',
		                    },{
		                        type: 'menu',
		                        label: '新增操作符',
		                        children: [{
			                            type: 3,
			                            label: '+',
			                        },{
			                            type: 3,
			                            label: '-',
			                        },{
			                            type: 3,
			                            label: '*',
			                        },{
			                            type: 3,
			                            label: '/',
			                        }],
		                    }
		                ]
						default :return [
		                    {
		                        type: 2,
		                        label: '新增变量',
		                    },{
		                        type: 1,
		                        label: '新增数值',
		                    },{
		                        type: 'menu',
		                        label: '新增操作符',
		                        children: [{
		                            type: 3,
		                            label: '( )',
	                        	}],
		                    }
		                ];
					};
					case 1:return [
	                    {
	                        type: 2,
	                        label: '切换为变量',
	                    },{
	                        type: 'menu',
	                        label: '新增操作符',
	                        children: [{
		                            type: 3,
		                            label: '+',
		                        },{
		                            type: 3,
		                            label: '-',
		                        },{
		                            type: 3,
		                            label: '*',
		                        },{
		                            type: 3,
		                            label: '/',
		                    }],
	                    }
	                ];
					case 2:return [
	                    {
	                        type: 1,
	                        label: '切换为常量',
	                    },{
	                        type: 'menu',
	                        label: '新增操作符',
	                        children: [{
		                            type: 3,
		                            label: '+',
		                        },{
		                            type: 3,
		                            label: '-',
		                        },{
		                            type: 3,
		                            label: '*',
		                        },{
		                            type: 3,
		                            label: '/',
		                    }],
	                    }
	                ];
				}
			}
		},
		mounted () {

		},
		methods: {

		}
	}
</script>

<style lang='scss'>
	.showSet{
	    background: rgba(0,0,0,0);
	    border: 0;
	    box-shadow: none;
	    padding-bottom: 0;    
	}
	.jim_cascader {// 系数操作：自写方案
        width: 110px;
        background: #fff;
        border: 1px solid #E4E7F2;
        z-index:100;        
    	margin-top: 12px;
        &.popover.top>.arrow {
            border-top-color: #E4E7F2;
            &:after {
                border-top-color: #fff;
            }
        }
        .cascaderLi{
            position: relative;
            color: #333;
            &.caretRight:before{// 三角形
                content: " ";
                position: absolute;
                top: 13px;
                right: 10px;
                width: 0;
                height: 0;
                border-top: 5px solid transparent;
                border-left: 6px solid #333;
                border-bottom: 5px solid transparent;
            }
            .cascaderLable{
            	cursor: pointer;
	            padding:0 10px;
	            line-height: 36px; 
	            display: block;           	
            }
            .childList{
                display: none;
            }
            &:hover{
                color:#fff;
                background: #40BDEC;
                &.caretRight:before{
                    border-left: 6px solid #fff;
                }
                .childList{
                    color:#333;
                    background: #fff;
                    display: block;
                    position: absolute;
                    top:0;
                    left:108px;
                    width: 37px;
                    text-align: center;
                    border: 1px solid #E4E7F2;
                    .childLi{
                        line-height: 36px;
                        &:hover{
                            color:#fff;
                            background: #40BDEC;                            
                        }
                        .childlabel{
            				cursor: pointer;
				            line-height: 36px; 
				            display: block; 
                        }
                    }
                }
            }
        }  
	}
	.fade-enter-active, .fade-leave-active {
		transition: opacity .3s
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
		opacity: 0
	}
</style>
