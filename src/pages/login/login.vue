<template>
    <div class="pages_login">
        <div class="login_left" id="login_page">
            <div class="login_circle">
                <div class="circle5 circle5Hover"></div>
                <div class="circle4"></div>
                <div class="circle3"></div>
                <div class="circle2"></div>
                <div class="circle1"></div>
            </div>
            <div class="login_cube">
                <div class="big_top"></div>
                <div class="big_right"></div>
                <div class="big_bottom"></div>
                <div class="big_left"></div>
                <div class="small_top"></div>
                <div class="small_right"></div>
                <div class="small_bottom"></div>
                <div class="small_left_solid"></div>
                <div class="small_left_empty"></div>
            </div>
            <div class="login_star"></div>
            <canvas id="canvas">您的浏览器不支持canvas.</canvas>
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0px" class="login_form bg_fff">
            <div class="login_logo"></div>
            <!--<el-form-item label="" prop="code" class="item_userName">-->
                <!--&lt;!&ndash;<el-input type="text" v-model="loginForm.userName" placeholder="请输入您的用户名" clearable></el-input>&ndash;&gt;-->
                <!--<i></i>-->
                <!--<input type="text" v-model="loginForm.code" placeholder="请输入您的商家编码">-->
            <!--</el-form-item>-->
            <el-form-item label="" prop="userName" class="item_userName">
                <!--<el-input type="text" v-model="loginForm.userName" placeholder="请输入您的用户名" clearable></el-input>-->
                <i></i>
                <input type="text" v-model="loginForm.userName" placeholder="请输入您的用户">
            </el-form-item>
            <el-form-item label="" prop="pass" class="item_pwd">
                <i></i>
                <input type="password" v-model="loginForm.password" @keyup.enter="login" placeholder="请输入登录密码">
            </el-form-item>
            <!--<el-form-item label="" prop="pass" class="item_captcha">-->
            <!--<input type="text" v-model="loginForm.captcha" @keydown.enter.native="login" placeholder="请输入验证码">-->
            <!--<img src="../../resource/img/login/icon-login-bg.png" alt="">-->
            <!--</el-form-item>-->

            <div class="login_check">
                <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
            </div>
            <el-form-item class="login_btn">
                <el-button @click="login" type="primary">
                    登录
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>


<script>

    import rotate from '../../resource/js/pages/rotate'
    import loginJs from '../../resource/js/pages/login'
    import regular from 'js/regular'
    import JSEncrypt from "jsencrypt"

    // import {message} from '../../components/common/common'
    import common from '../../components/common/common'

    export default {
        name: 'pages_login',
        data() {
            return {
                pageName: 'pages_login',
                disabled: {},
                loginForm: {
                    code: '',
                    username: '',
                    password: '',
                    // captcha: '',
                    rememberMe: true,
                },
                rules: {
                    // code: [
                    //     {required: true, message: '请输入您的商家编号', trigger: 'blur,change'},
                    // ],
                    userName: [
                        {required: true, message: '请输入您的用户名', trigger: 'blur,change'},
                    ],
                    password: [
                        {required: true, message: '请输入登录密码', trigger: 'blur,change'},
                    ],
                    // captcha: [
                    //     {required: true, message: '请输入验证码', trigger: 'blur,change'},
                    // ],
                    // rememberMe: [
                    //     {required: true, message: '请输入登录密码', trigger: 'blur,change'},
                    // ],
                },
            }
        },
        created() {
        },
        methods: {
            login() {
                if (this.loginForm.userName == '') {
                    common.message('error', '请输入您的用户名')
                } else if (this.loginForm.password == '') {
                    common.message('error', '请输入登录密码')
                } else {
                    this.$post('/mcs/login', {
                        // businessCode: this.loginForm.code,// 用户名
                        username: this.loginForm.userName,// 用户名
                        password: this.loginForm.password,// 密码
                    })
                        .then(res => {
                            this.$local.set('menuList', res.menuList)
                            this.$setCookie('name', res.name)
                            this.$setCookie('token', res.token)
                            this.$setCookie('phone', res.phone)
                            this.$setCookie('email', res.email)
                            this.$setCookie('businessCode', res.businessCode)
                            if (!!this.$session.get('beforeUrl')) {
                                this.$router.push(JSON.stringify(this.$session.get('beforeUrl'))!='{}'
                                    ?this.$session.get('beforeUrl'):'/risk')
                            } else {
                                this.$router.push('/risk')
                            }

                        })
                }
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    @import '../../resource/style/pages/login.css';

    .pages_login {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        /*width: 100%;*/
        /*height: 100%;*/
        background: url(../../resource/img/login/icon-login-bg.png) no-repeat left top / 1920px 1080px;
        .login_form {
            position: absolute;
            top: 50%;
            right: 228px;
            margin-top: -224px;
            width: 400px;
            min-height: 448px;
            border-radius: 4px;
            padding: 36px 30px 40px;
            background: rgba(23, 133, 236, .2);
            border: 1px solid #3b65ff;
            .login_logo {
                width: 248px;
                height: 66px;
                margin: 0 auto 44px;
                background: url(../../resource/img/login/icon-logo.png) no-repeat 0 0 /100%;
            }

            .el-form-item {
                width: 100%;
                padding: 5px 0;
                margin-bottom: 20px;
                -webkit-border-radius: 8px;
                -moz-border-radius: 8px;
                border-radius: 8px;
                background: rgba(21, 67, 114, .6);
                i {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    margin: 0 10px 0 20px;
                    vertical-align: middle;
                }
                input {
                    width: 270px;
                    height: 40px;
                    background: transparent;
                    border: none;
                    color: #fff;
                    outline: none;
                    text-indent: 10px;
                    -webkit-border-radius: 4px;
                    -moz-border-radius: 4px;
                    border-radius: 4px;
                    &::-webkit-input-placeholder {
                        color: #91a3c0;
                    }
                }
                input:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, .6) inset !important;
                }
                .el-button {
                    width: 100%;
                    height: 60px;
                    font-size: 16px;
                    margin-top: 40px;
                }
            }
            .item_userName {
                i {
                    background: url(../../resource/img/login/icon-user.png) no-repeat 0 0 /100%;
                }
            }
            .item_pwd {
                i {
                    background: url(../../resource/img/login/icon-pwd.png) no-repeat 0 0 /100%;
                }
            }
            .item_captcha {
                display: flex;
                justify-content: space-between;
                align-items: center;
                input {
                    width: 160px;
                    margin-right: 20px;
                }
                img {
                    width: 140px;
                    height: 50px;
                }
            }
            .login_check {
                .el-checkbox__label {
                    color: #fff !important;
                }
            }
            .login_btn {
                background: none;
            }
        }
    }
</style>
