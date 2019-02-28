<template>
    <div class="pages_dictList" v-if="$route.name=='dictList'">
        <el-form status-icon :label-position="'left'" ref="modelForm" class="modelForm inlineBlock mg_t_20">
            <el-form-item label="产品线：" class="fl mg_r_20 productList" label-width="60px">
                <el-select v-model="modelForm.appId" filterable placeholder="请选择" size="small">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="(item,index) in productList" :key="index" :label="item.productName"
                               :value="item.appId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="变量名称：" class="fl mg_r_20 moldName" label-width="80px">
                <el-input v-model.trim="modelForm.keyword" size="small" placeholder="请输入关键字"
                          @keyup.native.enter="btnSearch" clearable></el-input>
            </el-form-item>
            <el-button class="fl" style="width: 80px" type="primary" size="small" :disabled="btnDisabled"
                       @click="btnSearch">查询
            </el-button>
            <el-button class="fl" type="text" @click="showPlane =! showPlane">
                更多筛选条件
                <i class="el-icon-caret-bottom el-icon--right" v-if="!showPlane"></i>
                <i class="el-icon-caret-top el-icon--right" v-else></i>
            </el-button>
            <el-button class="fr" @click="addVariableItem" size="small" plain>+新增变量</el-button>
        </el-form>
        <div class="plane" v-if="showPlane">
            <el-form status-icon label-position="left">
                <el-form-item label="变量类型：" class="mg_r_20 moldName" label-width="100px">
                    <el-radio-group v-model="modelForm.variableType">
                        <el-radio label="">全部</el-radio>
                        <el-radio :label="1">字符串</el-radio>
                        <el-radio :label="2">整型</el-radio>
                        <el-radio :label="3">浮点型</el-radio>
                        <el-radio :label="4">日期型</el-radio>
                        <el-radio :label="5">枚举</el-radio>
                        <el-radio :label="6">布尔型</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!--<el-form-item label="数据来源：" class="mg_r_20 moldName" label-width="100px">
                    <el-radio-group v-model="modelForm.source">
                        <el-radio label="">全部</el-radio>
                        <el-radio label="1">变量服务</el-radio>
                        <el-radio label="2">计算引擎</el-radio>
                    </el-radio-group>
                </el-form-item>-->
            </el-form>
        </div>
        <div class="tableBd" v-loading="loading">
            <el-table v-if="variableList.length" :data="variableList" class="productListTable mg_t_20" border
                      :header-row-class-name="'table_hd'" :header-cell-class-name="'table_th'"
                      :row-class-name="'table_tr'" :cell-class-name="'table_td'">
                <el-table-column prop="variableId" label="变量ID" width="120px" align="center"></el-table-column>
                <el-table-column label="变量名" prop="variableName" align="center"></el-table-column>
                <el-table-column prop="productName" label="产品线" width="140px" align="center"></el-table-column>
                <el-table-column prop="variableType" label="变量类型" width="120px" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.variableType == 1">字符串</span>
                        <span v-if="scope.row.variableType == 2">整型</span>
                        <span v-if="scope.row.variableType == 3">浮点型</span>
                        <span v-if="scope.row.variableType == 4">日期型</span>
                        <span v-if="scope.row.variableType == 5">枚举</span>
                        <span v-if="scope.row.variableType == 6">布尔型</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注信息" width="320px" align="center"></el-table-column>
                <el-table-column prop="active" label="状态" width="80px" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.active == 1">可用</span>
                        <span v-if="scope.row.active == 0" style="color:#ffa49d">不可用</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160px" align="center">
                    <template slot-scope="scope">
                        <div class="buts">
                            <a href="javascript:;" :class="{'color-ff7a6f':scope.row.active == 1}"
                               @click="updateVariableStatus(scope.row,scope.row.active)">{{scope.row.active
                                == 1
                                ? '禁用' : '启用'}}</a>
                            <a href="javascript:;" @click="editDictItem(scope.row)">编辑</a>
                            <a href="javascript:;" @click="delVariableItem(scope.row)">删除</a>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <noData img="noData" p2="暂无数据" v-else-if="!loading"/>
            <div class="block pagination" v-if="variableList.length">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="pagePara.pageNo" :page-sizes="[10, 15, 20]" :page-size="10"
                               layout="total, sizes, prev, pager, next, jumper" :total="pagePara.count">
                </el-pagination>
            </div>
        </div>
    </div>
    <router-view v-else/>
</template>
<script>
    import noData from '../../../components/pc/noData/noData'

    export default {
        name: 'pages_dictList',
        data() {
            return {
                btnDisabled: false,  ///防暴力点击事件
                modelForm: {
                    appId: '',
                    keyword: '',
                    variableType: '',
                    source: ''
                },
                showPlane: false,
                productList: [],
                variableList: [],
                pagePara: {
                    currentPage: 1,
                    count: 0,
                    pageNo: 1,
                    pageSize: 10,
                },
                loading: true,
            }
        },
        components: {
            noData,
        },
        watch: {
            'modelForm.appId'() {
                console.log(this.modelForm.appId)
            }
        },
        beforeRouteUpdate(to, from, next) {
            this.postData();
            this.products();
            next();
        },
        mounted() {
            this.products();
            if (this.$route.meta.keepAlive == false) {
                this.postData();
            }
        },
        methods: {
            // getProductList() {
            //     this.$post('/mcs/product/list', {
            //         productName: '',
            //         pageNo: '-1'
            //     })
            //         .then(res => {
            //             res.productList.map((item) => {
            //                 this.variableList.map((varItem, varIndex) => {
            //                     if (varItem.appId == item.appId) {
            //                         varItem.productName = item.productName;
            //                     }
            //                 })
            //             })
            //         })
            // },
            btnSearch() {
                this.btnDisabled = true
                this.pagePara.pageNo = 1
                this.postData();
            },
            postData() {
                this.loading = true;
                let sessionData = this.$session.get('dictListData')
                let data = {
                    appId: this.modelForm.appId,
                    keyword: this.modelForm.keyword,
                    variableType: this.modelForm.variableType,
                    source: this.modelForm.source,
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
                this.$post('/mcs/variable/list', data)
                    .then(res => {
                        this.loading = false;
                        this.variableList = res.variableList;
                        this.pagePara.count = res.count;
                        // this.getProductList();
                        this.$session.set('dictListData', data)
                        this.btnDisabled = false
                    })
            },
            addVariableItem() {
                this.$router.push('/risk/dictMg/dictList/dictAdd');
            },
            handleSizeChange(val) {
                this.pagePara.pageSize = Number(val);
                this.postData();
                //console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.pagePara.pageNo = Number(val);
                this.postData();
                //console.log(`当前页: ${val}`);
            },
            products() {
                this.$post('/mcs/product/list', {
                    productName: this.modelForm.keyword
                })
                    .then(res => {
                        this.productList = res.productList;
                    })
            },
            delVariableItem(row) {
                this.$msgbox.confirm('', {
                    title: '系统提示',
                    message: `<p class="f_333">确认要删除${row.variableName}变量？`,
                    dangerouslyUseHTMLString: true,
                    type: 'warning',
                }).then(() => {
                    this.$post('/mcs/variable/delete', {
                        variableId: row.variableId,
                        appId: row.appId
                    })
                        .then(res => {
                            this.$message.success('删除成功')
                            this.postData();
                        })
                }).catch(() => {

                });
            },
            updateVariableStatus(val) {
                let msg = val.active == 1 ? `确定禁用${val.variableName}变量？` : `确定启用${val.variableName}变量？`;
                this.$msgbox.confirm('', {
                    title: '系统提示',
                    message: `<p class="f_333">${msg}</p>`,
                    dangerouslyUseHTMLString: true,
                    type: 'warning',
                }).then(() => {
                    let msg = val.active == 1 ? '禁用成功' : '启用成功';
                    this.$post('/mcs/variable/status/update', {
                        variableId: val.variableId,
                    })
                        .then(res => {
                            this.$message.success(msg)
                            this.postData();

                        })
                })
            },
            editDictItem(item) {
                this.$router.push({
                    path: '/risk/dictMg/dictList/dictEdit',
                    query: {
                        variableId: item.variableId,
                        source: item.source
                    }
                })
            }
        },
        beforeRouteLeave(to, from, next) {
            if (to.path == '/risk/dictMg/dictList/dictAdd' || to.path == '/risk/dictMg/dictList/dictEdit') {
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
            if (this.$route.meta.keepAlive == true) {
                that.postData();
            }

        },

    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' rel="stylesheet/scss" scoped>
    .pages_dictList {

        .modelForm {
            width: 100%;
            .el-form-item {
                margin-bottom: 0;
            }
        }
        .buts {
            a {
                margin-left: 20px;
                text-decoration: underline;
                color: #3cb1dd;
                &:first-of-type {
                    margin-left: 0;
                }

                &.color-ff7a6f {
                    color: #ff7a6f;
                }
            }
        }
        .plane {
            background-color: #f2f6f8;
            padding: 20px 20px 0;
            border: solid 1px #e4e7f2;
        }
        .tableBd {
            min-height: 500px;
        }
    }

</style>
