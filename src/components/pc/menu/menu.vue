<template>
    <div class="pages_menu fl overhide">
        <div class="menu_panel">
            <el-menu :default-active="menuActive()" class="el-menu-vertical-demo" @open="handleOpen"
                     @close="handleClose" :unique-opened="true" :router="true">
                　　　　
                <template v-for="(item,index) in childrenList" >
                    <!--<el-menu-item :index="item.menuHref" :route="item.menuHref" v-if="!item.childrenList.length"-->
                                  <!--:key="index" :id="item.id">-->
                        <!--<i class="menuIcon" :class="item.menuIcon"></i>-->
                        <!--<span>{{item.menuName}}</span>-->
                    <!--</el-menu-item>-->
                    <el-submenu :index="item.menuHref" :route="item.menuHref"
                                :key="index" :id="item.id">
                        <div slot="title">
                            <i class="menuIcon" :class="item.menuIcon"></i>
                            <span>{{item.menuName}}</span>
                            <i class="el-submenu__icon-arrow el-icon-caret-bottom"></i>
                        </div>
                        <el-menu-item-group>
                            <el-menu-item v-for="(ele,i) in item.childrenList" :index="ele.menuHref" v-if="ele.isShow==1"
                                          :route="ele.menuHref"
                                          :key="index+'-'+i" :id="ele.id" @click="menuItem(ele,i)">{{ele.menuName}}
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    　　　　
                </template>
            </el-menu>
        </div>
    </div>
</template>

<script>


    export default {
        name: 'pages_menu',
        data() {
            return {
                pageName: 'pages_menu',
            }
        },
        computed: {
            menuList() {// 菜单排序
                return this.$local.get('menuList')
                // return JSON.stringify(this.$local.get('menuList'))
                // return JSON.parse(localStorage.userInfo).menuList && JSON.parse(localStorage.userInfo).menuList.sort((a, b) => {
                //     return a.sort - b.sort;
                // })
            },
            childrenList() {
                let result = [];
                this.menuList.map((item, index) => {
                    if (item.menuHref.indexOf(this.$route.path.split('/')[1]) > -1) {
                        result = item.childrenList;
                    }
                })
                return result;
            },
        },
        created() {
        },
        methods: {
            handleOpen(key, keyPath) {
                if (this.$route.redirectedFrom == key) {
                    location.reload()
                    // this.$bus.$emit(`reload${key.split('/')[key.split('/').length-1]}`,true)
                } else {
                    this.$router.push(key)
                }
            },
            handleClose(key, keyPath) {
                if (this.$route.redirectedFrom == key) {
                    // location.reload()
                    // this.$bus.$emit(`reload${key.split('/')[key.split('/').length-1]}`,true)
                } else {
                    this.$router.push(key)
                }
            },
            menuItem(val,index) {
                if (val.menuHref == this.$route.path) {
                    // console.log(val.menuHref)
                    this.$router.go({path:val.menuHref})

                    location.reload()
                    // this.$bus.$emit(`reload${val.menuHref.split('/')[val.menuHref.split('/').length-1]}`,true)

                }
            },
            menuActive() {
                sessionStorage.clear();
                if (this.$route.path.indexOf('proAdd') > -1) {
                    return '/risk/proMg/proList';
                } else if (this.$route.path.indexOf('modelAdd') > -1) {
                    return '/risk/modelMg/modelList';
                    /** Jim修改于2018-09-26 10:46:20 @新增模型改为模型列表右上角的按钮 */
                } else if (this.$route.path.indexOf('modelMg') > -1) {
                    return '/risk/modelMg/modelList';
                } else if (this.$route.path.indexOf('ruleTmpAdd') > -1 || this.$route.path.indexOf('ruleTmpEdit') > -1) {
                    return '/risk/stratMg/ruleList';
                } else if (this.$route.path.indexOf('stratAdd') > -1 || this.$route.path.indexOf('stratEdit') > -1 || this.$route.path.indexOf('stratVersion') > -1) {
                    return '/risk/stratMg/stratList';
                } else if (this.$route.path.indexOf('dictAdd') > -1 || this.$route.path.indexOf('dictEdit') > -1) {
                    return '/risk/dictMg/dictList';
                } else if (this.$route.path.indexOf('dictCustomAdd') > -1) {
                    return '/risk/dictMg/dictCustom';
                } else {
                    return this.$route.path.slice(-1) == '/' ? this.$route.path.slice(0, -1) : this.$route.path;
                }
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    .pages_menu {
        margin-top: 0;
        width: 214px;
        .menu_panel {
            width: 200px;
            box-shadow: 5px 0 5px 0 #eaeaea;
            height: calc(100vh - 130px);
            background: #fff;
            ul.el-menu {
                border-right: 0;
                & > li.el-submenu { // 一级菜单：可下拉
                    &.is-active {
                        & > div {
                            color: #333;
                            background: #fff;
                        }
                    }
                    & > .el-submenu__title {
                        height: 47px;
                        line-height: 47px;
                        padding-left: 35px !important;
                        font-size: 16px;
                        color: #888;
                        /*border-bottom: 1px solid #ededed;*/
                        .el-submenu__icon-arrow {
                            color: #212E4D;
                            opacity: .2;
                        }
                    }
                    & > .el-menu { // 二级菜单
                        /*padding: 7px 0;*/
                        border-bottom: 1px solid #ededed;
                        & > .el-menu-item-group {
                            .el-menu-item-group__title { // 分组标题
                                display: none;
                            }
                            & > ul {
                                & > li.el-menu-item {
                                    height: 45px;
                                    line-height: 45px;
                                    color: #666;
                                    font-size: 14px;
                                    padding-left: 75px !important;
                                    &.is-active { // 二级菜单高亮
                                        color: #333;
                                        background: #d8ecfe;
                                        /*                                    &:before{
                                                                                content:'';
                                                                                position:absolute;
                                                                                top:11px;
                                                                                right:-2px;
                                                                                width:4px;
                                                                                height: 28px;
                                                                                background: #3EA1FC;
                                                                            }*/
                                    }
                                }
                            }
                        }
                    }
                    &.is-opened { // 展开的菜单

                    }
                }
                & > li.el-menu-item { // 一级菜单：不可下拉
                    height: 45px;
                    line-height: 45px;
                    padding-left: 35px !important;
                    color: #222;
                    font-size: 16px;
                    border-bottom: 1px solid #ededed;
                    &.is-active {
                        background: #fff;
                        color: #333;
                        font-size: 16px;
                    }
                }
                & > li.el-menu-item,
                & > li.el-submenu {
                    &, & > .el-submenu__title {
                        & > div > i.menuIcon {
                            display: inline-block;
                            width: 20px;
                            height: 20px;
                            margin-right: 8px;
                            background-size: auto 20px;
                            background-repeat: no-repeat;
                            background-position: center center;
                            background-origin: 0 0;
                            background-image: url('../../../resource/img/404/404.png');
                            &.proMg {
                                background-image: url('../../../resource/img/menu/proMg.png');
                            }
                            &.modelMg {
                                background-image: url('../../../resource/img/menu/modelMg.png');
                            }
                            &.dictMg {
                                background-image: url('../../../resource/img/menu/dictMg.png');
                            }
                            &.stratMg {
                                background-image: url('../../../resource/img/menu/stratMg.png');
                            }
                            &.control {
                                background-image: url('../../../resource/img/menu/control.png');
                            }
                        }
                    }
                    &.is-active {
                        &, & > .el-submenu__title {
                            & > div > i.menuIcon {
                                &.proMg {
                                    background-image: url('../../../resource/img/menu/proMg_active.png');
                                }
                                &.modelMg {
                                    background-image: url('../../../resource/img/menu/modelMg_active.png');
                                }
                                &.dictMg {
                                    background-image: url('../../../resource/img/menu/dictMg_active.png');
                                }
                                &.stratMg {
                                    background-image: url('../../../resource/img/menu/stratMg_active.png');
                                }
                                &.control {
                                    background-image: url('../../../resource/img/menu/control_active.png');
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
