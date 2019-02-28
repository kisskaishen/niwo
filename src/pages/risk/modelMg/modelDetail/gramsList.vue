<template>
    <div class="pages_gramsList relative">
        <div class="gramsList_bd">
            <el-table :data="gramsList" class="gramsListTable" border v-if="!!gramsList.length"
                      :header-row-class-name="'table_hd'" :header-cell-class-name="'table_th'"
                      :row-class-name="'table_tr'" :cell-class-name="'table_td'">
                <el-table-column label="序号" width="50px">
                    <template slot-scope="scope">{{scope.$index+1}}</template>
                </el-table-column>
                <el-table-column prop="variableNameEn" label="字段名(英文)" width="200px"></el-table-column>
                <el-table-column prop="variableName" label="变量名(中文)" width="200px"></el-table-column>
                <el-table-column label="变量类型" width="150px">
                    <template slot-scope="scope">
                        {{variableTypeText(scope.row.variableType)}}
                    </template>
                </el-table-column>
                <el-table-column prop="isRequire" label="是否必填" width="100px">
                    <template slot-scope="scope">非必填</template>
                </el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
            </el-table>
            <noData img="noData" p2="暂无数据" v-else/>
            <div class="block pagination" v-if="!!gramsList.length&&pagePara.count > 10">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="pagePara.currentPage" :page-sizes="[10, 15, 20]" :page-size="10"
                               layout="total, sizes, prev, pager, next, jumper" :total="pagePara.count">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import noData from 'components/pc/noData/noData'

    export default {
        name: 'pages_gramsList',
        data() {
            return {
                pageName: 'pages_gramsList',
                gramsList: [],
                pagePara: {
                    currentPage: 1,
                    count: 0,
                    pageNo: 1,
                    pageSize: 6,
                },
            }
        },
        components: {
            noData,
        },
        mounted() {
            // appId=1000510&moldType=1&type=gramsList&modelId=165
            // appId=>'产品线id'
            // moldType=>''
            // type=>''
            // modelId=>'模型id'
            this.getGramsList();
        },
        methods: {
            variableTypeText(val) {
                switch (val) {
                    case 1:
                        return 'string(字符串)';
                    case 2:
                        return 'int(整型)';
                    case 3:
                        return 'float(浮点型)';
                    case 4:
                        return 'date(日期型)';
                    case 5:
                        return 'enum(枚举型)';
                    case 6:
                        return 'boolean(布尔型)';
                }
            },
            getGramsList() {
                this.$post('/mcs/mold/variables', {
                    id: this.$route.query.modelId,
                })
                    .then(res => {
                        this.gramsList = res.variableList;
                        this.pagePara.count = res.count;

                    })
            },
            handleSizeChange(val) {
                this.pagePara.pageSize = Number(val);
                this.getGramsList();
            },
            handleCurrentChange(val) {
                this.pagePara.pageNo = Number(val);
                this.getGramsList();
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
    .pages_gramsList {
        padding-top: 40px;
    }
</style>
