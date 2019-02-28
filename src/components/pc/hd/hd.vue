<template>
    <div class="pages_hd">
        <div>
            <img class="hd_logo" :src="logo" alt="魔方系统Logo">
            <div class="hd_menu inlineBlock f16">
                <router-link class="menu_item" v-for="(item,index) in menuList" :key="index" :to="item.menuHref">
                    {{item.menuName}}
                </router-link>
                <!--<div class="menu_item" v-for="(item,index) in menuList" :key="index" @click="test(item,index)">-->
                <!--{{item.menuName}}-->
                <!--</div>-->
                <!--&lt;!&ndash;             <router-link class="menu_item" to="/risk">风控决策引擎</router-link>-->
                <!--<router-link class="menu_item" to="/control">监控预警</router-link>-->
                <!--<router-link class="menu_item" to="/offline">离线评估</router-link>-->
                <!--<router-link class="menu_item" to="/system">系统中心</router-link>-->
            </div>
        </div>
        <div class="hd_user noLogin f_fff" v-if="$getCookie('token')">
            <el-dropdown @command="showUser">
                <span class="el-dropdown-link user_signOut">
                    您好，{{decodeURI($getCookie('name'))}}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <i class="line"></i>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>个人信息</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <!--<span class="user_signOut">您好，{{decodeURI($getCookie('name'))}}</span>-->
            <span class="user_Separate">|</span>
            <span class="user_signOut pointer" @click="quist">退出</span>
            <!-- <span class="user_Separate">|</span>
            <span class="user_signOut pointer" @click="gotoAc">账户中心</span>
            <span class="user_Separate">|</span>
            <span class="user_signOut pointer" @click="gotoVar">变量服务</span> -->
        </div>
        <div class="hd_user hasLogin f_fff" v-else>
            <router-link class="user_login f_fff pointer" to="/login">登录</router-link>
            <!-- <span class="user_Separate">|</span>
            <router-link class="user_reg f_fff pointer" to="/reg">注册</router-link>
            <span class="user_Separate">|</span>
            <span class="user_signOut pointer" @click="gotoAc">账户中心</span>
            <span class="user_Separate">|</span>
            <span class="user_signOut pointer" @click="gotoVar">变量服务</span> -->
        </div>
        <div class="dialogDiV" v-if="isShowUser">
            <el-dialog title="个人信息" :visible.sync="isShowUser" width="412px" center>
                <el-form :model="userInfo" label-width="88px">
                    <el-form-item label="用户名：">
                        <span>{{userInfo.name}}</span>
                    </el-form-item>
                    <el-form-item label="邮箱：">
                        <span>{{userInfo.email}}</span>
                    </el-form-item>
                    <el-form-item label="手机号码：">
                        <span>{{userInfo.tel}}</span>
                    </el-form-item>
                    <el-form-item label="密码：">
                        <span>{{userInfo.pwd}}</span>
                        <el-button type="text" style="margin-left: 40px" @click="revisePwd">修改</el-button>
                    </el-form-item>
                    <el-form-item label="旧密码：" class="inputForm" v-if="showReviseForm">
                        <el-input type="password" v-model="userInfo.oldPwd" size="small"
                                  placeholder="请输入旧密码"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码：" class="inputForm" v-if="showReviseForm">
                        <el-tooltip class="item" effect="dark" placement="right-end">
                            <div slot="content"><b>密码满足以下要求：</b><br/>同时包含大写字母、小写字母和数字密码<br>长度为6-32位字符</div>
                            <el-input type="password" v-model="userInfo.newPwd" size="small"
                                      placeholder="请输入新密码"></el-input>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label="确认密码：" class="inputForm" v-if="showReviseForm">
                        <el-input type="password" v-model="userInfo.newAgainPwd" size="small"
                                  placeholder="请确认密码"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer" v-if="showReviseForm">
                    <el-button type="primary" @click="sureRevise">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import logo from 'img/hd/logo.png'

    export default {
        name: 'pages_hd',
        data() {
            return {
                pageName: 'pages_hd',
                logo,
                menuList: [],
                isShowUser: false,           // 是否显示个人信息弹框
                userInfo: {
                    name: '',
                    email: '',
                    tel: '',
                    pwd: '************ ',
                    oldPwd: '',
                    newPwd: '',
                    newAgainPwd: ''
                },
                showReviseForm: false,            // 修改密码form
            }
        },
        created() {
            this.menuList = this.$local.get('menuList')
            this.userInfo.name = decodeURI(this.$getCookie('name'))
            this.userInfo.email = decodeURI(this.$getCookie('email'))
            this.userInfo.tel = decodeURI(this.$getCookie('phone'))
        },
        methods: {
            gotoAc() {
                location.href = redirectAc;
            },
            gotoVar() {
                location.href = redirectVar;
            },
            quist() {
                this.$post('/mcs/logout')
                    .then(res => {
                        this.$message.success('退出成功')
                    })

                this.$clearCookie('token')
                this.$clearCookie('name')
                this.$local.delete('menuList')
                this.$session.delete('beforeUrl')

                location.href = location.href.split('#')[0]
                // delete this.$route.query.token;
                // location.href = redirectAc+'/login?clientUrl='+encodeURIComponent(location.href);
                //location.href = redirectAc+'/login?clientUrl=mcs';
            },

            // 显示个人信息弹框
            showUser() {
                this.isShowUser = true
            },

            // 点击修改密码
            revisePwd() {
                this.showReviseForm = true
            },
            // 确认修改密码
            sureRevise() {
                let checkPwd = /^(?:(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])).{6,32}$/
                if (this.userInfo.oldPwd == '' || this.userInfo.newPwd == '' || this.userInfo.newAgainPwd == '') {
                    this.$message.error('请填写必填项！')
                } else if (!checkPwd.test(this.userInfo.newPwd)) {
                    this.$message.error('密码同时包含大写字母、小写字母和数字,长度为6-32位字符')
                } else {
                    this.$post('/mcs/modify/password', {
                        oldPassword: this.userInfo.oldPwd,
                        newPassword: this.userInfo.newPwd,
                        confirmNewPassword: this.userInfo.newAgainPwd
                    })
                        .then(res => {
                            this.$message.success('修改成功')
                            this.isShowUser = false
                        })
                }

            }
        },
        watch: {
            isShowUser(val) {
                if (val == false) {
                    this.showReviseForm = false
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    .pages_hd {
        .dialogDiV {
            position: absolute;
            .el-dialog {
                margin-top: 245px !important;
                .el-form {
                    .el-form-item {
                        margin-bottom: 0;
                        .el-form-item__label, .el-form-item__content {
                            height: 32px;
                            line-height: 32px;
                        }
                    }
                    .inputForm {
                        margin-top: 16px;
                        .el-input {
                            width: 210px;
                            height: 34px;
                            line-height: 34px;
                            margin-left: 0;
                        }
                    }
                }
                .el-dialog__footer {
                    .el-button {
                        width: 80px;
                        height: 34px;
                        line-height: 34px;
                        padding: 0;
                        -webkit-border-radius: 4px;
                        -moz-border-radius: 4px;
                        border-radius: 4px;
                    }
                }
            }
        }

    }

    .el-dropdown {
        position: relative;
        .line {
            position: absolute;
            left: 0;
            right: 0;
            bottom: -4px;
            width: 100%;
            border-bottom: 1px solid #fff;
            opacity: 0;
        }
        &:hover {
            .line {
                opacity: 1;
            }
        }
    }

    .el-dropdown-menu {
        margin: 0;
        margin-top: 20px;
        padding: 0 !important;
        /*height: 46px;*/
        /*line-height: 46px;*/
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
        border-radius: 2px;
        .el-dropdown-menu__item {
            text-align: center;
            padding: 0 24px;
        }
    }

</style>
<style scoped lang='scss'>
    .pages_hd {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 0 20px;
        height: 80px;
        background: url(../../../resource/img/hd/hd_bg.png) no-repeat center top / 100% 100%;
        .hd_logo {
            margin-right: 80px;
        }
        .hd_menu {
            /*padding: 32px 0 0 100px;*/
            .menu_item {
                color: #fff;
                margin-right: 40px;
                padding-bottom: 8px;
                &.active {
                    border-bottom: 4px solid #fff;
                }
            }
        }
        .hd_user {
            text-align: right;
            .user_Separate {
                margin: 0 20px;
            }
            .user_signOut {
                color: #fff;
            }
        }

    }
</style>
