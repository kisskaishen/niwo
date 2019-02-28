<template>
    <div class="pages_proList mg_t_20" v-if="$route.name=='proList'">
        <div class="productList_hd">
            <el-input v-model.trim="searchText" size="small" placeholder="请输入查询关键字" @keyup.native="searchProductList"
                      @keyup.native.enter="getProductList" clearable></el-input>
            <el-button class="mg_l_10" size="small" type="primary" style="width: 80px" :disabled="btnDisabled" @click="getProductList">查询</el-button>
            <!-- <el-button class="mg_l_10" size="medium" :type="!searchText?'info':'primary'" :disabled="!searchText" @click="searchProductList">查询</el-button> -->
            <!-- <router-link class="el-button mg_r_10 fr el-button--primary el-button--medium mg_r_10 fr" tag="button" to="/risk/proMg/proList/proAdd">新增产品</router-link> -->
        </div>
        <div class="productList_bd relative">
            <el-table :data="productList" class="productListTable mg_t_20" border v-if="!!productList.length"
                      :header-row-class-name="'table_hd'" :header-cell-class-name="'table_th'"
                      :row-class-name="'table_tr'" :cell-class-name="'table_td'" @cell-click="tdEditOpen">
                <el-table-column prop="appId" label="产品ID" align="center"></el-table-column>
                <el-table-column label="产品名称" align="center">
                    <div slot-scope="scope" :appId="'pro_'+scope.row.appId">
                        <div v-if="!scope.row.editeFlag">{{scope.row.productName}}</div>
                        <div v-else>
                            <el-input :value="scope.row.productName" size="medium" placeholder="请输入产品名称"
                                      @input="inputProName($event,scope.row,scope.column)"
                                      @keyup.native="editBlur($event,scope.row)"
                                      @change="updateProName(scope.row,scope.column)" clearable></el-input>
                        </div>
                    </div>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="createBy" label="创建人" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="proDetail(scope.row)">
                            <!-- <i class="el-icon-view f16 oprIcon"></i> -->
                            查看
                        </el-button>
                        <!-- <el-button type="text" @click="proEdit(scope.row)"><i class="el-icon-edit-outline f16 oprIcon"></i></el-button> -->
                        <!-- <el-button type="text" @click="proDel(scope.row)"><i class="el-icon-delete f16 oprIcon"></i></el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <noData img="noData" p2="暂无数据" v-else/>
            <!--<div class="block pagination" v-if="!!productList.length&&pagePara.count > 10">-->
            <div class="block pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="pagePara.currentPage" :page-sizes="[10, 15, 20]" :page-size="10"
                               layout="total, sizes, prev, pager, next, jumper" :total="pagePara.count">
                </el-pagination>
            </div>
        </div>
        <!-- 添加产品 -->
        <el-dialog class="addProDialog" :visible.sync="$route.path.indexOf('/proAdd')>-1" wappIdth="412px" center
                   top="28vh" title="新增产品" :close-on-click-modal="false" :before-close="addProClose">
            请输入产品名称：
            <el-input v-model.trim="addProForm.productName" size="medium" placeholder="请输入产品名称" @keyup.native="addPro"
                      clearable></el-input>
            <span slot="footer" class="dialog-footer">
                <!-- <router-link tag="button" class="el-button el-button--default el-button--medium is-plain" to="proList">取消</router-link> -->
                <el-button size="medium" plain @click="addProClose">取消</el-button>
                <el-button size="medium" :type="!addProForm.productName?'info':'primary'"
                           :disabled="!addProForm.productName" @click="addPro">确定 </el-button>
            </span>
        </el-dialog>
    </div>
    <router-view v-else/>
</template>


<script>
    import noData from 'components/pc/noData/noData'

    export default {
        name: 'pages_proList',
        data() {
            return {
                btnDisabled:false,          // 防暴力点击

                pageName: 'pages_proList',
                searchText: '',
                productList: [],
                pagePara: {
                    currentPage: 1,
                    count: 0,
                    pageNo: 1,
                    pageSize: 10,
                },
                tmp: {
                    td: {},
                },
                show: {
                    proAdd: false,
                },
                addProForm: {
                    productName: '',
                },
            }
        },
        components: {
            noData,
        },
        created() {
            this.getProductList();
            // this.$bus.$on('reloadproList',val=>{
            //     this.searchText = ''
            //     this.getProductList();
            // })

        },
        beforeRouteUpdate(to, from, next) {
            this.getProductList();
            next();
        },
        beforeRouteLeave(to, from, next) {
            if (to.name == 'risk') {
                next('/risk/proMg/proList')
            } else {
                next();
            }
        },
        methods: {
            proDetail(row) {
                this.$router.push({path: '/risk/modelMg/modelList', query: {appId: row.appId}})
            },
            proEdit(row) {

            },
            proDel(row) {
                this.$msgbox.confirm('', {
                    title: '系统提示',
                    message: '<p class="f_333">确认要删除该产品线？</p><p class="f_666 f12">如确认，产品线下模型都将被删除</p>',
                    dangerouslyUseHTMLString: true,
                    type: 'warning',
                }).then(() => {
                    this.$post('/mcs/product/delete',{
                        appId: row.appId
                    })
                        .then(res=>{
                            this.$message.success('删除成功')
                            this.getProductList();

                        })
                }).catch(() => {

                });
            },
            addProClose(done) {
                this.$router.push('proList');
            },
            addPro() {
                let _self = this;
                this.btnDisabled = true
                !!_self.addProForm.productName && axios({
                    url: '/mcs/product/create',
                    data: {
                        productName: _self.addProForm.productName,
                        pageNo: _self.pagePara.pageNo,// 页码  Number  N
                        pageSize: _self.pagePara.pageSize,// 页大小 Number  N
                    },
                    loadingDom: '.addProDialog .el-dialog',
                    // debug:true,
                    ret: 0,
                    successMsg: '添加成功',
                }, (res) => {
                    this.$router.push('proList')
                    this.addProForm.productName = '';
                    this.getProductList();
                    this.btnDisabled = false

                }, (err) => {

                });
            },
            searchProductList() {
                // this.searchText&&this.getProductList();
            },
            // 获取产品列表
            getProductList() {
                this.$post('/mcs/product/list', {
                    productName: this.searchText,
                    pageSize: this.pagePara.pageSize,
                    pageNo: this.pagePara.pageNo
                })
                    .then(res=>{
                        this.productList = res.productList
                        this.pagePara.count = res.count
                    })
            },
            inputProName(val, row, column) {
                if (val) {
                    this.tmp.td[column.appId] = row.productName;// 保存旧值用于对比
                    row.productName = val;
                }
            },
            tdEditOpen(row, column, cell, e) {/** Jim修改于2018-06-08 14:03:08 @功能转移至账户中心 */
                // console.log(1,row.productName,this.tmp.td[column.appId],column.appId,Object.keys(this.tmp.td)[Object.keys(this.tmp.td).length-1])
                // console.table(Object.entries(row))
                // console.table(Object.entries(column))
                // if(!!row.productName){// 输入的值不为空
                //     if(column.label=='产品名称'){//点击产品名称单元格
                //         this.tmp.td[column.appId] = row.productName;// 防止清空时失去焦点触发change→updateProName
                //         row.editeFlag = true;
                //     }else if(e.target.className.indexOf('el-icon-edit-outline')>-1){// 点击编辑按钮
                //         row.editeFlag = true;
                //     }else{// 点击当前行产品名称之外的单元格
                //         row.editeFlag = false;
                //     }
                // }
            },
            editBlur(e, row) {
                e.target.blur();// 回车→失去焦点→change事件
                row.editeFlag = false;
            },
            updateProName(row, column) {
                let _self = this;
                if (!!this.tmp.td[column.appId] && row.productName != this.tmp.td[column.appId]) {// 修改过并且本次已修改
                    this.$post('/mcs/product/update',{
                        appId: row.appId,
                        name: row.productName,
                    })
                        .then(res=>{
                            this.$message.success('修改成功')
                            row.editeFlag = false;
                        })
                }
            },
            handleSizeChange(val) {
                let _self = this;
                _self.pagePara.pageSize = Number(val);
                _self.getProductList();
                //console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                let _self = this;
                _self.pagePara.pageNo = Number(val);
                _self.getProductList();
                //console.log(`当前页: ${val}`);
            },
        },
        // beforeDestroy() {
        //     this.$bus.$off('reloadproList')
        // }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  scoped lang='scss'>
    .pages_proList {
        .productList_hd {
            .el-input {
                width: 320px;
                height: 38px;
            }
        }
        .el-button--text {
            span {
                text-decoration: underline;
            }
        }
    }
</style>
