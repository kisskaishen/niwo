<template>
    <div class="pages_modelList" v-if="$route.name=='modelList'">
        <el-form :model="modelForm" status-icon :label-position="'left'" ref="modelForm"
                 class="modelForm mg_t_20">
            <div class="searchDiv">
                <el-form-item label="产品线" class="mg_r_20 productList" label-width="50px">
                    <el-select v-model="modelForm.appId" filterable placeholder="请选择" @change="getModelList"
                               size="small">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(item,index) in productList" :key="index" :label="item.productName"
                                   :value="item.appId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" class="mg_r_20 moldName" label-width="40px">
                    <el-input v-model.trim="modelForm.moldName" size="small" placeholder="请输入模型名称"
                              @keyup.native.enter="searchBtn" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="text" @click="showPlane =! showPlane">
                        更多筛选条件
                        <i class="el-icon-caret-bottom el-icon--right" v-if="!showPlane"></i>
                        <i class="el-icon-caret-top el-icon--right" v-else></i>
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-button class="mg_l_20" style="width: 80px;" type="primary" size="small" :disabled="btnDisabled"
                               @click="searchBtn">查询
                    </el-button>
                </el-form-item>
            </div>
            <div class="moreBtn">
                <el-form-item>
                    <el-button style="{margin-left: 40px}" size="small"
                               @click="$router.push('/risk/modelMg/modelList/modelAdd')"
                               plain>
                        +新增模型
                    </el-button>
                </el-form-item>
            </div>
        </el-form>
        <div class="plane" v-if="showPlane">
            <el-row>
                <el-col>
                    <label>模型状态：</label>
                    <el-radio-group v-model="moldStatus">
                        <el-radio label="">全部</el-radio>
                        <el-radio :label="2">已上线</el-radio>
                        <el-radio :label="1">未上线</el-radio>
                        <el-radio :label="3">已下线</el-radio>
                    </el-radio-group>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <label>统计时间：</label>
                    <el-date-picker
                        v-model="daterange" type="daterange" align="right" unlink-panels
                        format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false" size="medium"
                        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                        :picker-options="actPicker">
                    </el-date-picker>
                </el-col>
            </el-row>
        </div>
        <div class="ml_panel radius2 bg_fff">
            <!--<div class="ml_hd grayTitle">已创建的模型</div>-->
            <ul class="ml_ul overhide" v-if="!!modelList.length">
                <li class="ml_li fl" v-for="(item,index) in modelList" :id="'mold'+item.id">
                    <div class="ml_li_box">
                        <div class="model_hd overhide">
                            <div class="model_pic wh100">
                                <!-- 状态 -->
                                <div class="moldStatus">
                                    <img :src="notOnline" v-if="item.moldStatus==1" alt="未上线">
                                    <img :src="online" v-else-if="item.moldStatus==2" alt="已上线">
                                    <img :src="offline" v-else-if="item.moldStatus==3" alt="已下线">
                                    <img :src="notOnline" v-else alt="未上线">
                                </div>
                                <!-- 已上线类型 -->
                                <div class="moldType text-center" v-if="item.moldStatus==2">
                                    <img :src="fqz" v-if="item.moldType==1" alt="反欺诈">
                                    <img :src="sxzc" v-if="item.moldType==3" alt="授信">
                                    <img :src="xypf" v-if="item.moldType==4" alt="评分卡">
                                </div>
                                <div class="moldType text-center" v-else>
                                    <img :src="fqz_off" v-if="item.moldType==1" alt="反欺诈">
                                    <img :src="sxzc_off" v-if="item.moldType==3" alt="授信">
                                    <img :src="xypf_off" v-if="item.moldType==4" alt="评分卡">
                                </div>
                            </div>
                            <ul class="model_opr wh100"
                                :class="{'online':item.moldStatus==2,'scoreCard':item.moldType==4}">
                                <!-- <router-link class="opr_li text-center pointer" v-if="item.moldStatus!=2&&item.moldCheckStatus!=7&&item.moldType!=3" tag="li" to="/offline">测试</router-link> -->
                                <li class="opr_li text-center pointer"
                                    v-if="item.moldStatus!=2&&item.moldCheckStatus!=7&&item.moldType!=4"
                                    @click="moldOnline(item)">上线
                                </li>
                                <!-- 当模型状态为审核通过时，模型列表页中测试按钮变为上线按钮。 -->
                                <li class="opr_li text-center pointer"
                                    v-if="item.moldStatus!=2&&(item.moldCheckStatus==7||item.moldType==4)"
                                    @click="moldOnline(item)">上线
                                </li>
                                <li class="opr_li text-center pointer" v-if="item.moldStatus==2"
                                    @click="moldOffline(item)">下线
                                </li>
                                <li class="opr_li text-center pointer" @click="modelGramsList(item)"
                                    v-if="item.moldType!=4">参数列表
                                </li>
                                <li class="opr_li text-center pointer" @click="modelLook(item,'look')">查看</li>
                                <li class="opr_li text-center pointer" v-if="item.moldStatus!=2"
                                    @click="modelEdit(item)">编辑
                                </li>
                                <li class="opr_li text-center pointer" @click="modelCopy(item)">复制</li>
                                <li class="opr_li text-center pointer" @click="modelDel(item,index)"
                                    v-if="item.moldStatus!=2">删除
                                </li>
                            </ul>
                        </div>
                        <p class="ml_name mg_t_10 text-center overhide2">
                            {{item.productName}}-{{item.moldName}}-V{{versionString(item.moldVersion)}}</p>
                    </div>
                </li>
            </ul>
            <noData img="noData" p2="暂无数据" v-else/>
        </div>
        <div class="block pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="pagePara.currentPage" :page-sizes="[16, 24, 32]" :page-size="16"
                           layout="total, sizes, prev, pager, next, jumper" :total="pagePara.count">
            </el-pagination>
        </div>
    </div>
    <router-view v-else/>
</template>

<script>
    import noData from 'components/pc/noData/noData'
    import fqz from 'img/modelList/fqz.png'
    import fqz_off from 'img/modelList/fqz_off.png'
    import xypf from 'img/modelList/xypf.png'
    import xypf_off from 'img/modelList/xypf_off.png'
    import sxzc from 'img/modelList/sxzc.png'
    import sxzc_off from 'img/modelList/sxzc_off.png'
    import online from 'img/modelList/online.png'
    import offline from 'img/modelList/offline.png'
    import notOnline from 'img/modelList/notOnline.png'


    export default {
        name: 'pages_modelList',
        data() {
            return {
                btnDisabled: false,          // 防暴力点击
                pageName: 'pages_modelList',
                fqz, fqz_off, xypf, xypf_off, sxzc, sxzc_off, online, offline, notOnline,
                pagePara: {
                    currentPage: 1,
                    count: 0,
                    pageNo: 1,
                    pageSize: 16,
                },
                productList: [],
                modelList: [],

                moldStatus: '',         // 模型状态
                showPlane: false,        // 是否显示更多查询
                daterange: '',          // 筛选时间

                updateStartDate: '',// 更新开始时间  String  N   yyyy-MM-dd HH:mm:ss
                updateEndDate: '',// 更新结束时间  String  N   yyyy-MM-dd HH:mm:ss

                // moldStatusList: [{id: 1, name: '未上线'}, {id: 2, name: '已上线'}, {id: 3, name: '已下线'}],
                modelForm: {
                    appId: null,// 产品线 Number  N
                    moldName: '',// 模型名 String  N
                    moldVersion: '',// 模型版本    String  N   例如：1.00、1.01
                },
                actPicker: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            }
        },
        components: {
            noData,
        },
        // beforeRouteUpdate(to, from, next) {
        //     this.modelForm.appId = !!this.$route.query.appId ? this.$route.query.appId : '';
        //     this.getProductList();
        //     this.getModelList();
        //     next();
        // },

        mounted() {
            this.modelForm.appId = !!this.$route.query.appId ? this.$route.query.appId : '';
            this.getProductList();
            if (this.$route.meta.keepAlive==false) {
                this.getModelList();
            }
            // this.$bus.$on('reloadmodelList',val=>{
            //     this.modelForm = {appId:'',moldName:'',moldVersion:''}
            //     this.getModelList();
            //     this.getProductList();
            // })
        },
        methods: {

            moldOnline(item) {
                this.$msgbox.confirm('', {
                    title: '系统提示',
                    message: `<p class="f_333">确认要上线${item.moldName}模型？`,
                    dangerouslyUseHTMLString: true,
                    type: 'warning',
                }).then(() => {
                    this.$post('/mcs/mold/online', {
                        id: item.id
                    })
                        .then(res => {
                            this.$message.success('上线成功')
                            this.getModelList();
                        })
                }).catch(() => {

                });
            },
            moldOffline(item) {
                this.$msgbox.confirm('', {
                    title: '系统提示',
                    message: `<p class="f_333">确认要下线${item.moldName}模型？`,
                    dangerouslyUseHTMLString: true,
                    type: 'warning',
                }).then(() => {
                    this.$post('/mcs/mold/offline', {
                        id: item.id
                    })
                        .then(res => {
                            this.$message.success('下线成功')
                            this.getModelList();

                        })
                }).catch(() => {

                });
            },
            modelGramsList(item) {
                this.$router.push({
                    path: '/risk/modelMg/gramsList',
                    query: {appId: item.appId, moldType: item.moldType, type: 'gramsList', modelId: item.id}
                });
            },
            modelLook(item, type = 'look') {
                if (item.moldType == 4) {// 评分卡
                    this.$router.push({
                        path: type == 'edit' ? '/risk/modelMg/scoreCard' : '/risk/modelMg/scoreCardPreview',
                        query: {appId: item.appId, moldType: item.moldType, type: type, modelId: item.id}
                    });
                } else {
                    this.$router.push({
                        path: '/risk/modelMg/modelUml',
                        query: {appId: item.appId, moldType: item.moldType, type: type, modelId: item.id}
                    });
                }
            },
            modelCopy(item) {
                this.$router.push({
                    path: '/risk/modelMg/modelList/modelAdd',
                    query: {appId: item.appId, moldType: item.moldType, type: 'copy', modelId: item.id}
                });
            },
            modelDel(item, index) {// 删除模型
                this.$msgbox.confirm('', {
                    title: '系统提示',
                    message: `<p class="f_333">确认要删除${item.moldName}模型？`,
                    dangerouslyUseHTMLString: true,
                    type: 'warning',
                }).then(() => {
                    this.$post('/mcs/mold/delete', {
                        id: item.id
                    })
                        .then(res => {
                            this.$message.success('删除成功')
                            this.modelList.splice(index, 1)
                        })
                }).catch(() => {

                });
            },
            modelEdit(item) {
                if (item.moldCheckStatus == 2 || item.moldCheckStatus == 5) {// 测试中/审核状态中的模型不可编辑
                    this.$notify({// 通知提示
                        message: '该模型/正在测试或审核状态中，不可编辑。',
                        type: 'error',
                        duration: 1500,
                        customClass: 'center-center',
                        onClose: function () {

                        }
                    })
                } else if (item.moldCheckStatus == 4 || item.moldCheckStatus == 6) {// 测试不通过/审核不通过的模型可重新编辑。
                    this.modelLook(item, 'edit');
                } else {
                    this.modelLook(item, 'edit');
                }
            },
            getProductList() {
                this.$post('/mcs/product/list', {
                    productName: '',
                    pageNo: '-1'
                })
                    .then(res => {
                        this.productList = res.productList;
                    })
            },
            searchBtn() {
                this.btnDisabled = true
                this.pagePara.pageNo = 1;
                this.getModelList()
            },
            getModelList() {
                let data = {
                    appId: this.modelForm.appId,// 产品线 Number  N
                    moldName: this.modelForm.moldName,// 模型名 String  N
                    moldVersion: this.modelForm.moldVersion,// 模型版本    String  N   例如：1.00、1.01
                    moldStatus: this.moldStatus,// 模型状态    Number  N   1：未上线，2：已上线，3：已下线
                    updateStartTime: !!this.updateStartDate ? this.updateStartDate + " 00:00:00" : null,// 更新开始时间  String  N   yyyy-MM-dd HH:mm:ss
                    updateEndTime: !!this.updateEndDate ? this.updateEndDate + " 23:59:59" : null,// 更新结束时间  String  N   yyyy-MM-dd HH:mm:ss
                    pageNo: this.pagePara.pageNo,// 页码  Number  N
                    pageSize: this.pagePara.pageSize,// 页大小 Number  N
                }

                this.$post('/mcs/mold/list', data)
                    .then(res => {
                        this.modelList = res.moldList;
                        this.pagePara.count = res.count;
                        this.btnDisabled = false
                    })
            },
            handleSizeChange(val) {
                this.pagePara.pageSize = Number(val);
                this.getModelList();
            },
            handleCurrentChange(val) {
                this.pagePara.pageNo = Number(val);
                this.getModelList();
            },
            versionString(version) {
                return version.substring(0, 1) + "." + version.substring(1, 3);
            }
        },
        watch: {
            daterange(val) {
                if (val != null) {
                    this.updateStartDate = val[0]
                    this.updateEndDate = val[1]
                } else {
                    this.updateStartDate = ''
                    this.updateEndDate = ''
                }
                alert(1)
                this.getModelList();

            },
            moldStatus(val) {
                this.getModelList();
            },

        },
        // beforeRouteEnter(to,from,next) {
        //     to.meta.keepAlive = false
        //     next()
        // },
        beforeRouteLeave(to, from, next) {
            if (to.path == '/risk/modelMg/scoreCard' || to.path == '/risk/modelMg/scoreCardPreview'
                || to.path == '/risk/modelMg/modelUml' || to.path == '/risk/modelMg/gramsList'
                || to.path == '/risk/modelMg/modelList/modelAdd') {
                from.meta.keepAlive = true
                next();
            } else {
                from.meta.keepAlive = false
                // this.$destroy()
                next();
            }
        },
        activated() {
            let that = this
            if (this.$route.meta.keepAlive = true) {
                that.getModelList();
            }

        },
        // deactivated
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    .pages_modelList {
        .modelForm {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .searchDiv {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .el-button--text {
                    span {
                        text-decoration: underline;
                    }
                }
            }
            .productList, .moldStatus {
                .el-input {
                    width: 130px;
                }
            }
        }
        .plane {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: flex-start;
            height: 80px;
            margin-bottom: 20px;
            .el-row {
                display: block;
                width: 100%;
            }
        }
        .daterange {
            .el-form-item__content {
                width: 360px;
            }
        }
        .ml_panel {
            width: 100%;
            border: 1px solid #E4E7F2;
            .grayTitle {
                height: 42px;
                line-height: 42px;
                background: #EAEEF0;
                text-indent: 20px;
            }
            .ml_ul {
                background-color: rgb(242, 246, 248);
                .ml_li {
                    /*width: 20%;*/
                    .ml_li_box {
                        width: 162px;
                        margin: 28px 20px 6px;
                        .model_hd {
                            width: 100%;
                            height: 196px;
                            background-color: #fff;
                            box-shadow: 0 0 4px #ccc;
                            .model_pic {
                                transition: all 0.3s;
                                opacity: 1;
                                border: 1px solid #E4E7F2;
                                margin-top: 0;
                                .moldType {
                                    margin-top: -14px;
                                }
                            }
                            .model_opr {
                                transition: all 0.3s;
                                opacity: 0;
                                margin-top: 196px;
                            }
                            &:hover {
                                .model_pic {
                                    opacity: 0;
                                    margin-top: -196px;
                                }
                                .model_opr {
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: center;
                                    align-items: center;
                                    align-content: center;
                                    align-self: center;
                                    opacity: 1;
                                    margin-top: 0;
                                    .opr_li { // 测试、参数列表、查看、编辑、测试、复制、删除。
                                        flex: 1;
                                        width: 100%;
                                        color: #fff;
                                        background: #48BEEA;
                                        border-bottom: 1px solid #E4E7F2;
                                        line-height: 32px;
                                        &:hover {
                                            background: #45C9FB;
                                        }
                                        &:active {
                                            background: #36AEDB;
                                        }
                                    }
                                    &.online { // 查看、下线、参数列表、复制
                                        .opr_li {
                                            height: 49px;
                                            line-height: 49px;
                                        }
                                    }
                                    &.scoreCard { // 查看、编辑、上线、复制、删除。
                                        .opr_li {
                                            height: 39.2px;
                                            line-height: 39.2px;
                                        }
                                        &.online { // 查看、下线、复制。
                                            .opr_li {
                                                height: 65.33px;
                                                line-height: 65.33px;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        .ml_name {
                            height: 42px;
                        }
                    }
                }
            }
        }
    }
</style>
