<template>
    <div class="pages_risk overhide">
        <vHeader/>
        <menu1/>
        <div class="fl pages_con">
            <breadcrumb/>
            <!--<breadcrumb v-if="$route.path.indexOf('modelUml')==-1"/>-->
            <router-view class="con_child"/>
        </div>
        <vFooter/>
    </div>
</template>

<script>
    import menu1 from "../../components/pc/menu/menu"
    import breadcrumb from '../../components/pc/breadcrumb/breadcrumb'
    import vHeader from '../../components/pc/hd/hd'
    import vFooter from '../../components/pc/ft/ft'

    export default {
        name: 'pages_risk',
        data() {
            return {
                pageName: 'pages_risk',
            }
        },
        components: {
            menu1, breadcrumb, vHeader, vFooter
        },
        created() {

        },
        methods: {}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    .pages_risk {
        position: relative;
        background: #fff;
        .pages_con {
            position: relative;
            width: calc(100% - 200px);
            margin-left: -14px;
            border-left: 1px solid #e6e6e6;
            box-shadow: 5px 5px 5px 0 #eaeaea inset;
            .con_child {
                position: relative;
                padding: 0 40px;
            }
            /*        .mg_tab{// 模型管理&&产品管理   // 改版后换成面包屑导航
                        width:100%;
                        border-bottom:1px solid #E4E7F2;
                        .tab_item{
                            width:112px;
                            height:38px;
                            line-height: 38px;
                            display: inline-block;
                            text-align: center;
                            color:#333;
                            border:1px solid #E4E7F2;
                            &:last-child{
                                margin-left:-5px;
                            };
                            &.active{
                                color:#fff;
                                background: #1785EC;
                            }
                        }
                    }*/
        }
    }
</style>
