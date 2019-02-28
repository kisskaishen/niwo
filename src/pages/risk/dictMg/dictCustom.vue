<template>
    <div class="pages_dictCustom" v-if="$route.name=='dictCustom'">
        <el-form status-icon :label-position="'left'" ref="modelForm" class="modelForm inlineBlock mg_t_20">
            <el-form-item label="产品线：" class="fl mg_r_20 productList" label-width="50px">
                <el-select v-model="modelForm.appId" filterable placeholder="请选择" size="medium">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="(item,index) in productList" :key="item.appId" :label="item.productName" :value="item.appId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="列表名称：" class="fl mg_r_20 moldName" label-width="100px">
                <el-input v-model.trim="modelForm.setName" size="medium" placeholder="请输入关键字" clearable></el-input>
            </el-form-item>
            <el-button class="fl" type="primary" size="medium" @click="btnSearch">查询</el-button>
            <el-button class="fr" @click="addCustomItem" plain>+新增自定义列表</el-button>
        </el-form>
        <el-table :data="list" class="productListTable mg_t_20" border v-if="list.length" :header-row-class-name="'table_hd'" :header-cell-class-name="'table_th'" :row-class-name="'table_tr'" :cell-class-name="'table_td'">
            <el-table-column prop="id" label="列表ID"></el-table-column>
            <el-table-column prop="setName" label="列表名称"></el-table-column>
            <el-table-column prop="productName" label="产品线"></el-table-column>
            <el-table-column prop="createTime" label="创建日期"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column prop="remark" label="操作">
                <template slot-scope="scope">
                    <div class="btns">
                        <a href="javascript:;" @click="viewCustomItem(scope.row.id)">查看</a>
                        <a href="javascript:;" @click="editCustomItem(scope.row.id)">编辑</a>
                        <a href="javascript:;" @click="removeCustomItem(scope.row.id)">删除</a>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <noData img="noData" p2="暂无数据" v-else/>
        <div class="block pagination" v-if="list.length&&pagePara.count > 10">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagePara.currentPage" :page-sizes="[10, 15, 20]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="pagePara.count">
            </el-pagination>
        </div>
    </div>
    <router-view v-else/>
</template>
<script>
import noData from 'components/pc/noData/noData'


export default {
    name: 'pages_dictCustom',
    data() {
        return {
            modelForm: {
                appId: '',
                setName: ''
            },
            productList: [],
            list: [],
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
    mounted() {
        this.getSetList();
        this.products();
    },
    methods: {
        getSetList() {
            this.$post('/mcs/set/list',{
                appId: this.modelForm.appId,
                setName: this.modelForm.setName,
                pageNo: this.pagePara.pageNo,
                pageSize: this.pagePara.pageSize
            })
                .then(res=>{
                    this.list = res.setList;
                    this.pagePara.count = res.count;
                })
        },
        products() {
            this.$post('/mcs/product/list',{})
                .then(res=>{
                    this.productList = res.productList;
                })
        },
        handleSizeChange(val) {
            this.pagePara.pageSize = Number(val);
            this.getSetList();
        },
        handleCurrentChange(val) {
            this.pagePara.pageNo = Number(val);
            this.getSetList();
        },
        btnSearch() {
            this.pagePara.pageNo = 1;
            this.getSetList();
        },
        addCustomItem() {
            this.$router.push({
                path: '/risk/dictMg/dictCustom/dictCustomAdd',
                query: { type: 'add' }
            })
        },
        //查看
        viewCustomItem(id) {
            this.$router.push({
                path: '/risk/dictMg/dictCustom/dictCustomAdd',
                query: { type: 'view', id: id }
            })
        },
        //编辑
        editCustomItem(id) {
            this.$router.push({
                path: '/risk/dictMg/dictCustom/dictCustomAdd',
                query: { type: 'edit', id: id }
            })
        },
        //删除
        removeCustomItem(id) {
            this.$msgbox.confirm('', {
                title: '系统提示',
                message: '<p class="f_333">确认要删除该变量？',
                dangerouslyUseHTMLString: true,
                type: 'warning',
            }).then(() => {
                this.$post('/mcs/set/delete',{
                    id: id
                })
                    .then(res=>{
                        this.$message.success('删除成功')
                        this.getSetList();
                    })
            })

        }
    }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' rel="stylesheet/scss" scoped>
.pages_dictCustom {
    .modelForm {
        width: 100%;
    }
    .btns {
        a {
            margin-left: 20px;
            text-decoration: underline;
            color: #3cb1dd;
            &:first-of-type {
                margin-left: 0;
            }
        }
    }
    .plane {
        background-color: #f2f6f8;
        padding: 20px 20px 0;
        border: solid 1px #e4e7f2;
    }
}

</style>
