<template>
    <div class="pages_ruleList" v-if="$route.name=='ruleList'">
        <el-form status-icon :label-position="'left'" ref="modelForm" class="modelForm inlineBlock mg_t_20">
            <el-form-item label="产品线：" class="fl mg_r_20 productList" label-width="60px">
                <el-select v-model="modelForm.appId" filterable placeholder="请选择" size="small">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="(item,index) in productList" :key="index" :label="item.productName"
                               :value="item.appId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="规则名称：" class="fl mg_r_20 moldName" label-width="80px">
                <el-input v-model.trim="modelForm.ruleName" size="small" placeholder="请输入关键字"
                          @keyup.native.enter="btnSearch" clearable></el-input>
            </el-form-item>
            <el-button class="fl" style="width: 80px" type="primary" size="small" :disabled="btnDisabled" @click="btnSearch">查询</el-button>
            <el-button class="fl" type="text" size="small" @click="showPlane =! showPlane">
                更多筛选条件
                <i class="el-icon-caret-bottom el-icon--right" v-if="!showPlane"></i>
                <i class="el-icon-caret-top el-icon--right" v-else></i>
            </el-button>
            <el-button class="fr" size="small" @click="addRuleTmpAdd" plain>+新增规则模板</el-button>
        </el-form>
        <div class="plane" v-if="showPlane">
            <el-form status-icon label-position="left">
                <el-form-item label="状态：" class="mg_r_20 moldName" label-width="100px">
                    <el-radio-group v-model="modelForm.ruleStatus">
                        <el-radio label="0">全部</el-radio>
                        <el-radio label="1">有效</el-radio>
                        <el-radio label="2">无效</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="创建时间：" class="mg_r_20 moldName" label-width="100px">
                    <el-radio-group v-model="modelForm.createTimeStatus">
                        <el-radio label="0">全部</el-radio>
                        <el-radio :label="1">今天</el-radio>
                        <el-radio :label="2">一周内</el-radio>
                        <el-radio :label="3">三个月内</el-radio>
                        <el-radio :label="4">自定义</el-radio>
                    </el-radio-group>
                    <el-date-picker v-if="modelForm.createTimeStatus == 4" v-model="modelForm.createStartTime"
                                    value-format="timestamp" class="mg_l_10" type="datetime"
                                    :picker-options="pickerOptions1" placeholder="请输入开始日期">
                    </el-date-picker>
                    <span v-if="modelForm.createTimeStatus == 4">-</span>
                    <el-date-picker v-if="modelForm.createTimeStatus == 4" v-model="modelForm.createEndTime"
                                    value-format="timestamp" type="datetime" :picker-options="pickerOptions1"
                                    placeholder="请输入结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="最后更新时间：" class="mg_r_20 moldName" label-width="100px">
                    <el-radio-group v-model="modelForm.updateTimeStatus">
                        <el-radio label="0">全部</el-radio>
                        <el-radio :label="1">今天</el-radio>
                        <el-radio :label="2">一周内</el-radio>
                        <el-radio :label="3">三个月内</el-radio>
                        <el-radio :label="4">自定义</el-radio>
                    </el-radio-group>
                    <el-date-picker class="mg_l_10" v-if="modelForm.updateTimeStatus == 4"
                                    v-model="modelForm.updateStartTime" value-format="timestamp" type="datetime"
                                    :picker-options="pickerOptions1" placeholder="请输入开始日期">
                    </el-date-picker>
                    <span v-if="modelForm.updateTimeStatus == 4">-</span>
                    <el-date-picker v-if="modelForm.updateTimeStatus == 4" v-model="modelForm.updateEndTime"
                                    value-format="timestamp" type="datetime" :picker-options="pickerOptions1"
                                    placeholder="请输入结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </div>
        <el-table v-if="ruleList.length" :data="ruleList" class="productListTable mg_t_20" border
                  :header-row-class-name="'table_hd'" :header-cell-class-name="'table_th'" :row-class-name="'table_tr'"
                  :cell-class-name="'table_td'">
            <el-table-column prop="decisionCode" label="决策代码" width="180px" align="center"></el-table-column>
            <el-table-column label="规则名称" prop="ruleName" align="center"></el-table-column>
            <el-table-column prop="productName" label="产品线" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建日期"  align="center"></el-table-column>
            <el-table-column prop="updateTime" label="最后变更日期" align="center"></el-table-column>
            <el-table-column prop="createBy" label="管理人" width="180px" align="center"></el-table-column>
            <el-table-column label="操作" width="160px" align="center">
                <template slot-scope="scope">
                    <div class="buts">
                        <a href="javascript:;" :class="{'color-ff7a6f':scope.row.ruleStatus == 1}"
                           @click="updateVariableStatus(scope.row)">{{scope.row.ruleStatus == 1
                            ? '禁用' : '启用'}}</a>
                        <a href="javascript:;" @click="editDictItem(scope.row)">编辑</a>
                        <a href="javascript:;" @click="delVariableItem(scope.row)">删除</a>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <noData img="noData" p2="暂无数据" v-else/>
        <div class="block pagination" v-if="ruleList.length">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="pagePara.currentPage" :page-sizes="[10, 15, 20]" :page-size="10"
                           layout="total, sizes, prev, pager, next, jumper" :total="pagePara.count">
            </el-pagination>
        </div>
    </div>
    <router-view v-else/>
</template>
<script>
    import noData from 'components/pc/noData/noData'
    import '../../../resource/js/dateFormat'

    export default {
        name: 'pages_ruleList',
        data() {
            return {
                btnDisabled: false,      // 防暴力点击
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                },
                modelForm: {
                    appId: '',
                    ruleName: '',
                    ruleStatus: '0',
                    createTimeStatus: '0',
                    updateTimeStatus: '0',
                    createStartTime: '',
                    createEndTime: '',
                    updateStartTime: '',
                    updateEndTime: ''
                },
                showPlane: false,
                productList: [],
                ruleList: [],
                pagePara: {
                    currentPage: 1,
                    count: 0,
                    pageNo: 1,
                    pageSize: 10,
                },
            }
        },
        components: {
            noData,
        },
        /*watch: {
         'modelForm.appId' (){
         console.log(this.modelForm.appId)
         }
         },*/
        beforeRouteUpdate(to, from, next) {
            this.postData();
            this.products();
            next();
        },
        mounted() {
            this.postData();
            this.products();
        },

        methods: {
            getTimeDate(status, type) {
                let startDate = '';
                let endDate = '';
                switch (status) {
                    case 1:
                        startDate = new Date().Format('yyyy-MM-dd') + ' 00:00:00';
                        endDate = new Date().Format('yyyy-MM-dd') + ' 23:59:59';
                        break;
                    case 2:
                        startDate = new Date(Date.now() - (7 * 86400000)).Format('yyyy-MM-dd hh:mm:ss');
                        endDate = new Date(Date.now()).Format('yyyy-MM-dd hh:mm:ss');
                        break;
                    case 3:
                        startDate = new Date(Date.now() - (90 * 86400000)).Format('yyyy-MM-dd hh:mm:ss');
                        endDate = new Date(Date.now()).Format('yyyy-MM-dd hh:mm:ss');
                        break;
                    case 4:
                        console.log(888, type, this.modelForm.updateStartTime, new Date(this.modelForm.updateStartTime).Format('yyyy-MM-dd hh:mm:ss'))
                        startDate = new Date(type == 1 ? this.modelForm.createStartTime : this.modelForm.updateStartTime).Format('yyyy-MM-dd hh:mm:ss');
                        endDate = new Date(type == 1 ? this.modelForm.createEndTime : this.modelForm.updateEndTime).Format('yyyy-MM-dd hh:mm:ss');
                        break;
                    default:
                        break;
                }
                return {
                    startDate: startDate,
                    endDate: endDate
                }
            }
            ,
            btnSearch() {
                this.pagePara.pageNo = 1;
                this.postData();
            },
            postData() {
                let createTimeObj = this.getTimeDate(this.modelForm.createTimeStatus, 1);
                let updateTimeObj = this.getTimeDate(this.modelForm.updateTimeStatus, 2);
                if (this.modelForm.createStartTime && this.modelForm.createEndTime && this.modelForm.createStartTime >= this.modelForm.createEndTime) {
                    this.$notify({
                        message: '开始时间不能大于结束时间',
                        type: 'warning'
                    });
                    return false;
                } else if (this.modelForm.updateStartTime && this.modelForm.updateStartTime && this.modelForm.updateStartTime >= this.modelForm.updateEndTime) {
                    this.$notify({
                        message: '开始时间不能大于结束时间',
                        type: 'warning'
                    });
                    return false;
                }
                let sessionData = this.$session.get('ruleListData')

                let data = {
                    appId: this.modelForm.appId,
                    ruleName: this.modelForm.ruleName,
                    ruleStatus: this.modelForm.ruleStatus,
                    createStartTime: createTimeObj.startDate,
                    createEndTime: createTimeObj.endDate,
                    updateStartTime: updateTimeObj.startDate,
                    updateEndTime: updateTimeObj.endDate,
                    pageNo: this.pagePara.pageNo,
                    pageSize: this.pagePara.pageSize
                }
                Object.values(data).map(item => {
                    Object.values(sessionData).map(sessionItem => {
                        if (item != sessionItem) {
                            item = sessionItem
                            this.pagePara.currentPage = sessionData.pageNo
                        }
                    })
                })
                this.$post('/mcs/rule/template/list', data)
                    .then(res => {
                        this.ruleList = res.ruleList;
                        this.pagePara.count = res.count;
                        this.btnDisabled = false
                        // this.$session.set('ruleListData',data)
                    })
            },

            addRuleTmpAdd() {
                this.$router.push({path: '/risk/stratMg/ruleList/ruleTmpAdd', query: {type: 'add'}});
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
                    pageNo: '-1'
                })
                    .then(res => {
                        this.productList = res.productList;
                    })

            },
            delVariableItem(row) {
                this.$msgbox.confirm('', {
                    title: '系统提示',
                    message: `<p class="f_333">确认要删除${row.ruleName}的规则？`,
                    dangerouslyUseHTMLString: true,
                    type: 'warning',
                }).then(() => {
                    this.$post('/mcs/rule/delete', {
                        id: row.id,
                    })
                        .then(res => {
                            this.$message.success('删除成功')
                            this.postData();

                        })
                }).catch(() => {

                });
            },
            updateVariableStatus(val) {
                let msg = val.ruleStatus == 1 ? `确定禁用${val.ruleName}规则？` : `确定启用${val.ruleName}规则？`;

                this.$msgbox.confirm('', {
                    title: '系统提示',
                    message: `<p class="f_333">${msg}</p>`,
                    dangerouslyUseHTMLString: true,
                    type: 'warning',
                }).then(() => {
                    let msg = val.ruleStatus == 1 ? '禁用成功' : '启用成功';
                    this.$post('/mcs/rule/status/update', {
                        id: val.id,
                    })
                        .then(res => {
                            this.$message.success(msg)
                            this.postData();

                        })
                })
            },
            editDictItem(item) {
                this.$router.push({path:'/risk/stratMg/ruleList/ruleTmpEdit',query:{type:'edit',ruleId:item.id,appId:item.appId}});
            }

        }
    }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
    .el-form {
        .el-form-item__content {
            line-height: 34px;
        }
    }
</style>
<style lang='scss' rel="stylesheet/scss" scoped>
    .pages_ruleList {
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
            padding: 6px 20px;
            border: solid 1px #e4e7f2;
        }
    }

</style>
