<template>
    <div class="pages_coeList inlineBlock" :id="'feaIndex'+feaIndex">
        <!-- <img class="set pointer" :id="'feaIndex'+feaIndex" :src="icon.set" @click="$emit('showCoeList',frItem)" alt="设置"> -->
<!--         <ul class="coeList popover top" ref="coeList" v-if="frItem.coe.show">
            <li class="coeLi" :class="{'caretRight':!!coeItem.children}" v-for="(coeItem,coeIndex) in coe.list">
                {{coeItem.label}}
                <ul class="childList" v-if="!!coeItem.children">
                    <li class="childLi" v-for="(childItem,childIndex) in coeItem.children">{{childItem.label}}</li>
                </ul>
            </li>
            <i class="arrow"></i>
        </ul> -->
        <el-cascader class="setSel" expand-trigger="hover" :show-all-levels="false" popper-class="coeList" :options="coe.list" v-model="frItem.coe" @change="changeCoeList(frItem.coe)"></el-cascader>
    </div>
</template>

<script>
export default {
    name: 'pages_coeList',
    data () {
        return {
            pageName: 'pages_coeList',
            coe:{
                show:false,
                list:[
                    {
                        value: 'var',
                        label: '切换为变量',
                    },{
                        value: 'num',
                        label: '切换为数值',
                    },{
                        value: 'addOpr',
                        label: '新增操作符',
                        children: [{
                            value: 'plus',
                            label: '+',
                        },{
                            value: 'sub',
                            label: '-',
                        },{
                            value: 'mul',
                            label: 'x',
                        },{
                            value: 'div',
                            label: '/',
                        },{
                            value: 'bracket',
                            label: '( )',
                        }],
                    }
                ],
            },
        }
    },
    props:['frItem','feaIndex','icon'],
    created () {
        // 点击其他不在的区域触发事件
        // document.addEventListener('click', (e) => {
        //     console.log(this.$el.id,'|',e.target.id,this.$el.contains(e.target),this.$el.id==e.target.id);
        //     if (!this.$el.contains(e.target)&&(this.$el.id==e.target.id)){
        //         console.log('隐藏')
        //         this.$emit('hideCoeList');
        //     }  
        // })
    },
    methods:{
        changeCoeList(coe) {// 操作系数

        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.pages_coeList{
    position: relative;
    .coeList{// 系数操作：自写方案
        width: 110px;
        background: #fff;
        border: 1px solid #E4E7F2;
        position: absolute;
        top:-115px;
        right:-33px;
        z-index:100;
        &.popover.top>.arrow {
            border-top-color: #E4E7F2;
            &:after {
                border-top-color: #fff;
            }
        }
        .coeLi{
            position: relative;
            padding:0 10px;
            line-height: 36px;
            cursor:pointer;
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
                    }
                }
            }
        }
    }   
    .setSel.el-cascader{// Cascader 级联选择器
        width: 26px;
        height: 26px;
        line-height: 26px;
        display: inline-block;
        overflow: hidden;
        cursor: pointer;
        vertical-align: top;
        &:before{
            position:absolute;
            top:0;
            left: 0;
            width: 26px;
            height: 26px;
            content:url('../../../resource/img/icon/set.png');
        }
        &>*{display: none;}
    } 
}
.coeList.el-cascader-menus{// Cascader 级联选择器：下拉菜单
    border:0;
    .el-cascader-menu{
        padding: 0;
        min-width: 110px;
        &:last-child{
            min-width: 37px;
            text-align: center;
            &:hover{
                & + .el-cascader-menu{

                }
            }
        }
        .el-cascader-menu__item{
            height: 36px;
            line-height: 36px;
            padding: 0px 10px;
            color: #333;
            &.el-cascader-menu__item--extensible:after{
                content: "\E60E";
                right: 8px;
                color:#333;
            }
            &:hover{
                color: #fff;
                background: #40BDEC;
                &.el-cascader-menu__item--extensible:after{
                    color:#fff;
                }
            }
        }
    }
}
</style>
