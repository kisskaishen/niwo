<template>
    <div class="pages_stratList" v-if="$route.name=='stratList'">
        <el-form status-icon :label-position="'left'" ref="modelForm" class="modelForm inlineBlock mg_t_20"
                 style="width:100%;">
            <el-form-item label="产品线：" class="fl mg_r_20 productList" label-width="60px">
                <el-select v-model="modelForm.appId" filterable placeholder="请选择" size="small">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="(item,index) in productList" :key="index" :label="item.productName"
                               :value="item.appId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="策略名称：" class="fl mg_r_20 moldName" label-width="80px">
                <el-input v-model.trim="modelForm.policyName" size="small" placeholder="请输入关键字"
                          @keyup.native.enter="btnSearch" clearable></el-input>
                <el-button style="width: 80px;margin-left: 20px;"  type="primary" size="small" :disabled="btnDisabled" @click="btnSearch">查询</el-button>
            </el-form-item>
            <el-form-item label="" class="btn">
                <el-button size="small" plain @click="addStratTmp">+新增策略模板</el-button>
            </el-form-item>

        </el-form>
        <div class="container containerFlexStart">
        <!--<div :class="['container',policyList.length>5?'':'containerFlexStart']">-->
            <div class="list-item fl" v-for="item in policyList">
                <h2>
                    <span class="overhide inlineBlock w200 text-middle">{{item.policyName}}</span>
                    <b v-if="item.policyStatus == 1">生效</b>
                    <b class="invalid" v-else>失效</b>
                </h2>
                <p class="mg_t_30">产品线：{{item.productName}}</p>
                <p>创建人：{{item.createBy}}</p>
                <p>创建时间：{{item.createTime}}</p>
                <p>最后更新时间：{{item.updateTime}}</p>
                <p class="p-box">
                    <a href="javascript:;" @click="updatePolicyStatus(item)"
                       :class="{'stop-btn':item.policyStatus == 1}">{{item.policyStatus == 1 ? '禁用' : '启用'}}</a>
                    <a href="javascript:;" @click="editPolicyItem(item)">编辑</a>
                    <a href="javascript:;" @click="delPolicyItem(item)">删除</a>
                    <!--<a href="javascript:;" @click="stratVersion(item)">版本记录</a>-->
                </p>
            </div>
        </div>
        <noData img="noData" p2="暂无数据" v-if="policyList.length <= 0"/>
        <div class="block pagination" v-if="policyList.length">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="pagePara.pageNo" :page-sizes="[10, 15, 20]" :page-size="10"
                           layout="total, sizes, prev, pager, next, jumper" :total="pagePara.count">
            </el-pagination>
        </div>
    </div>
    <router-view :productList="productList" :policyList="policyList" v-else/>
</template>
<script>
    import noData from '../../../components/pc/noData/noData'

    export default {
        name: 'pages_stratList',
        data() {
            return {
                btnDisabled:false,          // 防暴力点击
                modelForm: {
                    appId: '',
                    policyName: ''
                },
                productList: [],
                policyList: [],
                pagePara: {
                    currentPage: 1,
                    count: 0,
                    pageNo: 1,
                    pageSize: 10,
                },
            }
        },
        beforeRouteUpdate(to, from, next) {
            this.getPolicyList();
            this.products();
            next();
        },
        created() {
            this.getPolicyList();
            this.products();
            // this.$bus.$on('reloadstratList',val=>{
            //     this.modelForm = {appId:'',policyName:''}
            //     this.getPolicyList();
            //     this.products();
            // })
        },
        methods: {
            handleSizeChange(val) {
                this.pagePara.pageSize = Number(val);
                this.getPolicyList();
                //console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.pagePara.pageNo = Number(val);
                this.getPolicyList();
                //console.log(`当前页: ${val}`);
            },
            updatePolicyStatus(policy) {
                let msg = policy.policyStatus == 1 ? '禁用成功' : '启用成功';
                this.$msgbox.confirm('', {
                    title: '系统提示',
                    message: `<p class="f_333">确认要${msg}${policy.policyName}模板？`,
                    dangerouslyUseHTMLString: true,
                    type: 'warning',
                }).then(() => {
                        axios({
                            url: '/mcs/policy/status/update',
                            data: {
                                id: policy.id
                            },
                            successMsg: msg
                        }, (res) => {
                            this.getPolicyList();
                        }, (err) => {

                        });
                })

            },
            delPolicyItem(policy) {
                this.$msgbox.confirm('', {
                    title: '系统提示',
                    message: `<p class="f_333">确认要删除${policy.policyName}模板？`,
                    dangerouslyUseHTMLString: true,
                    type: 'warning',
                }).then(() => {
                    this.$post('/mcs/policy/delete', {
                        id: policy.id
                    })
                        .then(res => {
                            this.$message.success('删除成功')
                            this.getPolicyList();
                        })
                })

            },
            stratVersion(policy) {
                this.$router.push({path: '/risk/stratMg/stratVersion', query: {policyTmpId: policy.id}})
            },
            getPolicyList() {
                let sessionData = this.$session.get('stratListData')

                let data =  {
                    appId: this.modelForm.appId,
                    policyName: this.modelForm.policyName,
                    pageNo: this.pagePara.pageNo,
                    pageSize: this.pagePara.pageSize
                }
                Object.values(data).map(item => {
                    Object.values(sessionData).map(sessionItem => {
                        if (item != sessionItem) {
                            item = sessionItem
                            // this.pagePara.pageNo = sessionData.pageNo
                        }
                    })
                })
                this.$post('/mcs/policy/template/list',data)
                    .then(res => {
                        this.policyList = res.policyList;
                        this.pagePara.count = res.count;
                        this.btnDisabled = false
                        this.$session.set('stratListData',data)
                    })
            },
            btnSearch() {
                this.btnDisabled = true
                this.pagePara.pageNo = 1;
                this.getPolicyList();
            },
            addStratTmp() {// 新增策略模板
                this.$router.push({path: '/risk/stratMg/stratList/stratAdd', query: {type: 'add'}});
            },
            editPolicyItem(item) {// 编辑策略模板
                this.$router.push({
                    path: '/risk/stratMg/stratList/stratEdit',
                    query: {type: 'edit', policyId: item.id, appId: item.appId}
                });
            },
            products() {
                this.$post('/mcs/product/list', {
                    pageNo: '-1'
                })
                    .then(res => {
                        this.productList = res.productList;
                    })
            }
        },
        components: {
            noData
        },
        // beforeDestroy() {
        //     this.$bus.$off('reloadstratList')
        // }
    }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' rel="stylesheet/scss" scoped>
    .container {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-flow: wrap;
        overflow: auto;
        /*_height: 1%;*/
        background-color: #f2f6f8;
        /*padding: 0 30px;*/
        .list-item {
            position: relative;
            width: 284px;
            height: 228px;
            background-color: #fff;
            margin: 20px 18px;
            /*margin-right: 30px;*/
            box-sizing: border-box;
            padding-left: 20px;
            box-shadow: 0 0 20px #e2e9eb;
            border-radius: 6px;
            transition: all .4s ease-in-out;
            /*&:nth-child(5n) {*/
                /*margin-right: 0;*/
            /*}*/
            &:hover {
                box-shadow: 0 0 20px #ccc;
                transform: scale(1.06);
            }
            h2 {
                padding-top: 30px;
                font-size: 18px;
                font-weight: normal;
                b {
                    display: inline-block;
                    font-size: 12px;
                    color: #fff;
                    width: 40px;
                    height: 15px;
                    line-height: 15px;
                    text-align: center;
                    background-color: #42cfc6;
                    border-radius: 20px;
                    &.invalid {
                        background-color: #d7dde0;
                        color: #778189;
                    }
                }
            }
            p {
                color: #55616a;
                font-size: 12px;
                &.p-box {
                    padding: 24px 0;
                    display: none;
                }
                a {
                    margin-left: 35px;
                    color: #3cb1dd;
                    font-size: 14px;
                    text-decoration: underline;
                    &:first-of-type {
                        margin-left: 0;
                    }
                    &.stop-btn {
                        color: #ff7a6f;
                    }
                }
            }
            &:hover .p-box {
                display: block;
            }
        }
    }
    .modelForm {
        .btn {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 0;
        }
    }

    /*.containerFlexStart {*/
        /*justify-content: flex-start;*/
        /*.list-item {*/
            /*margin-right: 30px;*/
            /*&:nth-child(5n) {*/
                /*margin-right: 0;*/
            /*}*/
        /*}*/

    /*}*/

</style>

