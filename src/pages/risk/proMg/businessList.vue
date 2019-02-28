<template>
    <div class="pages_proList mg_t_20" v-loading="loading">
        <div class="productList_hd">
            <div class="searchDiv">
                <el-select v-model="searchPro" placeholder="请输入产品名称" filterable clearable size="small">
                    <el-option v-for="item,index in proSelectList" :key="index" :label="item.productName"
                               :value="item.appId"></el-option>
                </el-select>
                <el-input v-model="searchFlow" placeholder="请输入流程名称" size="small" clearable></el-input>
                <span style="margin-left: 20px;">状态：</span>
                <el-select v-model="status" class="status" size="small">
                    <el-option v-for="item,index in statuses" :key="index" :label="item.label"
                               :value="item.value"></el-option>
                </el-select>

                <el-button class="mg_l_10" size="small" type="primary"  :disabled="btnDisabled" @click="getList">
                    查询
                </el-button>
            </div>
            <div class="btnDiv">
                <el-button size="small" icon="el-icon-plus"  @click="addFlow">新增流程</el-button>
            </div>
            <!-- <el-button class="mg_l_10" size="medium" :type="!searchText?'info':'primary'" :disabled="!searchText" @click="searchProductList">查询</el-button> -->
            <!-- <router-link class="el-button mg_r_10 fr el-button--primary el-button--medium mg_r_10 fr" tag="button" to="/risk/proMg/proList/proAdd">新增产品</router-link> -->
        </div>
        <div class="productList_bd relative">
            <ul v-if="flowList.length>0" class="ml_ul overhide">
                <li v-for="item,index in flowList" >
                    <div class="flowStatus">
                        <img src="../../../resource/img/flow/online.png" v-if="item.moldStatus=='2'" alt="上线">
                        <img src="../../../resource/img/flow/offline.png"
                             v-if="item.moldStatus=='3'||item.moldStatus=='1'" alt="下线">
                        <!--<img src="../../../resource/img/modelList/notOnline.png" v-if="item.moldStatus=='1'" alt="未上线">-->
                    </div>
                    <div class="proLi">
                        <img src="../../../resource/img/flow/icon-flow.png" alt="" v-if="item.moldStatus=='2'">
                        <img src="../../../resource/img/flow/icon-flow-gray.png" alt=""
                             v-if="item.moldStatus=='3'||item.moldStatus=='1'">
                        <p>{{item.moldName}}-V{{item.moldVersion%100==0?(item.moldVersion/100).toFixed(2):item.moldVersion/100}}</p>
                    </div>
                    <div class="operateLi">
                        <p @click="lookFlow(item,index)">查看流程</p>
                        <p @click="editFlow(item,index)" v-if="item.moldStatus!='2'">编辑流程</p>
                        <p @click="copyFlow(item,index)">复制流程</p>
                        <p @click="upOnline(item,index)" v-if="item.moldStatus!='2'">上线</p>
                        <p @click="upDownLine(item,index)" v-if="item.moldStatus=='2'">下线</p>
                        <p @click="deleteLine(item,index)" v-if="item.moldStatus!='2'">删除</p>
                    </div>
                    <p class="proName">{{item.productName}}</p>
                </li>
            </ul>


            <noData v-else img="noData" p2="暂无数据"/>
        </div>
        <div class="block pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="pagePara.currentPage" :page-sizes="[12, 18, 24]"
                           :page-size="pagePara.pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="pagePara.count">
            </el-pagination>
        </div>

    </div>
    <!--<router-view v-else/>-->
</template>

<script>
    import noData from 'components/pc/noData/noData'
    import common from '../../../components/common/common'

    export default {
        name: 'pages_proList',
        data() {
            return {
                loading:true,
                btnDisabled: false,          // 防暴力点击
                proSelectList: [],
                searchPro: '',                  // 产品名称
                searchFlow: '',              // 流程名称
                status: '',                  // 状态
                statuses: [
                    {label: '全部', value: ''},
                    {label: '上线', value: '2'},
                    {label: '下线', value: '3'}
                ],

                flowList: [],
                pagePara: {
                    currentPage: 1,
                    pageNo:1,
                    count: 0,
                    pageSize: 12
                }
            }
        },
        components: {
            noData,
        },
        mounted() {
            // 获取产品列表
            this.getProList()
            if (this.$route.meta.keepAlive==false) {
                this.getList();
            }
        },
        beforeRouteUpdate(to, from, next) {
            this.getProductList();
            next();
        },
        // beforeRouteLeave(to, from, next) {
        //     if (to.name == 'risk') {
        //         next('/risk/proMg/proList')
        //     } else {
        //         next();
        //     }
        // },
        methods: {
            // 产品线列表
            getProList() {
                this.$post('/mcs/product/list', {
                    pageNo: "-1",
                    productName: ""
                })
                    .then(res => {
                        let arr = [{productName: '全部', appId: ''}]
                        this.proSelectList = [...arr, ...res.productList]
                    })
            },
            // 业务流程列表
            getList() {
                let data = {
                    appId: this.searchPro,
                    moldName: this.searchFlow,
                    moldStatus: '',
                    pageNo: this.pagePara.pageNo,
                    pageSize: this.pagePara.pageSize
                }

                if (this.status == '1') {
                    data.moldStatus = '1'
                    this.$post('/mcs/mold/process/list', data)
                        .then(res => {
                            this.flowList = res.moldList.filter(item => {
                                if(item.moldStatus != '2') {
                                    return item;
                                }
                            })
                            this.pagePara.count = res.moldList.filter(item => {
                                if(item.moldStatus != '2') {
                                    return item;
                                }
                            }).length
                            this.$session.set('businessListData', data)
                        })
                } else {
                    data.moldStatus = this.status
                    this.$post('/mcs/mold/process/list', data)
                        .then(res => {
                            this.flowList = res.moldList
                            this.pagePara.count = res.count
                            this.$session.set('businessListData', data)
                        })
                }
                this.loading = false
            },
            // 添加流程
            addFlow() {
                this.$router.push('/risk/proMg/businessAdd')
            },
            // 上线
            upOnline(val, index) {
                common.msgBox(`确认上线${val.productName}的${val.moldName}？`, '系统提示', '')
                    .then(res => {
                        this.$post('/mcs/mold/process/online', {
                            id: val.id
                        })
                            .then(res => {
                                common.message('success', '上线成功')
                                this.getList()
                            })
                    })
                    .catch(err => {
                        common.message('error', '取消上线')
                    })
            },
            // 下线
            upDownLine(val, index) {
                common.msgBox(`确认下线${val.productName}的${val.moldName}？`, '系统提示', '')
                    .then(res => {
                        this.$post('/mcs/mold/process/offline', {
                            id: val.id
                        })
                            .then(res => {
                                common.message('success', '下线成功')
                                this.getList()
                            })
                    })
                    .catch(err => {
                        common.message('error', '取消下线')
                    })
            },
            // 删除
            deleteLine(val, index) {
                common.msgBox(`确认删除${val.productName}的${val.moldName}？`, '系统提示', '')
                    .then(res => {
                        this.$post('/mcs/mold/process/delete', {
                            id: val.id
                        })
                            .then(res => {
                                common.message('success', '删除成功')
                                this.getList()
                            })
                    })
                    .catch(err => {
                        common.message('error', '取消删除')
                    })
            },
            // 查看流程
            lookFlow(val, index) {
                this.$router.push(`/risk/proMg/businessList/editFlow?type=look&modelId=${val.id}&flowId=${val.id}&moldType=${val.moldType}&appId=${val.appId}&productName=${val.productName}`)
            },
            // 编辑流程
            editFlow(val, index) {
                console.log(val)
                this.$router.push(`/risk/proMg/businessList/editFlow?type=edit&modelId=${val.id}&flowId=${val.id}&moldType=${val.moldType}&appId=${val.appId}&productName=${val.productName}`)
                // this.$router.push('/risk/proMg/businessList/editFlow')
            },
            // 复制流程=>类比模型管理，点击复制流程，跳转到类似于添加流程页面
            copyFlow(val, index) {
                this.$router.push(`/risk/proMg/businessAdd?type=copy&flowId=${val.id}&modelId=${val.id}&appId=${val.appId}&productName=${val.productName}`)
            },


            // addPro() {
            //     let _self = this;
            //     this.btnDisabled = true
            //     !!_self.addProForm.productName && axios({
            //         url: '/mcs/product/create',
            //         data: {
            //             productName: _self.addProForm.productName,
            //             pageNo: _self.pagePara.pageNo,// 页码  Number  N
            //             pageSize: _self.pagePara.pageSize,// 页大小 Number  N
            //         },
            //         loadingDom: '.addProDialog .el-dialog',
            //         // debug:true,
            //         ret: 0,
            //         successMsg: '添加成功',
            //     }, (res) => {
            //         this.$router.push('proList')
            //         this.addProForm.productName = '';
            //         this.getProductList();
            //         this.btnDisabled = false
            //
            //     }, (err) => {
            //
            //     });
            // },

            inputProName(val, row, column) {
                if (val) {
                    this.tmp.td[column.appId] = row.productName;// 保存旧值用于对比
                    row.productName = val;
                }
            },

            handleSizeChange(val) {
                let _self = this;
                _self.pagePara.pageSize = Number(val);
                _self.getList();
                //console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                let _self = this;
                _self.pagePara.pageNo = Number(val);
                _self.getList();
                //console.log(`当前页: ${val}`);
            },
        },
        beforeRouteLeave(to, from, next) {
            if (to.path == '/risk/proMg/businessAdd'||to.path == '/risk/proMg/businessList/editFlow') {
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
                that.getList();
            }

        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
    @import "../../../resource/style/base/var";
    @import "../../../resource/style/base/mixin";

    .pages_proList {
        .productList_hd {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .searchDiv {
                .el-select, .el-input {
                    width: 200px;
                    height: 34px;
                }
                .status {
                    width: 100px !important;
                }
                .mg_l_10.el-button {
                    width: 80px;
                }
            }
            .btnDiv {
                .el-button {
                    width: 100px;
                }
            }

        }
        .productList_bd {
            margin-top: 30px;
            padding: 20px;
            background-color: #F2F6F8;
            ul {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-flow: wrap;
                li {
                    position: relative;
                    text-align: center;
                    font-size: 14px;
                    margin:20px 40px 0 60px;
                    cursor: pointer;
                    .flowStatus {
                        position: absolute;
                        left: 0;
                        right: 0;
                        img {
                            display: block;
                            width: 64px;
                            height: 64px;
                        }
                    }
                    .proLi {
                        width: 160px;
                        height: 196px;
                        border: 1px solid #E4E7F2;
                        box-shadow: 0px 2px 8px 0px #E4E7F2;
                        background-color: $fff;
                        img {
                            display: block;
                            width: 60px;
                            height: 60px;
                            margin: 50px auto 24px;
                        }
                        p {
                            @include overhidemore(110px, 32px, 12px, 16px, 2);
                            margin: 0 auto;
                            color: #55616A;
                        }
                    }
                    .operateLi {
                        position: absolute;
                        right: -40px;
                        top: 14px;
                        width: 116px;
                        height: 170px;
                        z-index: 9;
                        opacity: 0;
                        -webkit-border-radius: 4px;
                        -moz-border-radius: 4px;
                        border-radius: 4px;
                        p {
                            color: $fff;
                            height: 34px;
                            line-height: 34px;
                            border-bottom: 1px solid #e4e7f2;
                            background-color: $blue;
                            cursor: pointer;
                            &:hover {
                                background-color: $blue_hov;
                            }
                            &:active {
                                background-color: $blue_act;
                            }
                        }
                    }
                    &:hover {
                        .proLi {
                            p {
                                @include overhidemore(110px, 64px, 12px, 16px, 4);
                                margin: 0 auto;
                            }
                        }
                        .operateLi {
                            transition: all 1s;
                            right: -100px;
                            opacity: 1;
                        }
                    }
                    .proName {
                        margin-top: 14px;
                    }
                }
            }
        }
        .el-button--text {
            span {
                text-decoration: underline;
            }
        }
    }
</style>
