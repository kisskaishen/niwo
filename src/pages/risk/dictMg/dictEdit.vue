<template>
    <div class="pages_dictEdit">
        <div class="table-box mg_t_20">
            <div class="table-row">
                <div class="table-cell cell-label fl">
                    产品线
                </div>
                <div class="table-cell cell-content fl">
                    {{variableInfo.productName}}
                </div>
            </div>
            <!--<div class="table-row">
                <div class="table-cell cell-label fl">
                  所在数据库
                </div>
                <div class="table-cell cell-content fl">
                  考拉学历
                </div>
              </div>
              <div class="table-row">
                <div class="table-cell cell-label fl">
                  所在数据表
                </div>
                <div class="table-cell cell-content fl">
                  评分卡变量
                </div>
            </div>-->
            <div class="table-row">
                <div class="table-cell cell-label fl">
                    字段名
                </div>
                <div class="table-cell cell-content fl">
                    {{variableInfo.variableNameEn}}
                </div>
            </div>
            <div class="table-row">
                <div class="table-cell cell-label fl">
                    变量ID
                </div>
                <div class="table-cell cell-content fl">
                    {{variableInfo.variableId}}
                </div>
            </div>
            <div class="table-row">
                <div class="table-cell cell-label fl">
                    变量名
                </div>
                <div class="table-cell cell-content fl">
                    <el-input v-model="variableInfo.variableName"></el-input>
                    <em>支持中英文及数字，不可重复</em>
                </div>
            </div>
            <div class="table-row">
                <div class="table-cell cell-label fl">
                    变量类型
                </div>
                <div class="table-cell cell-content fl">
                    <span v-if="variableInfo.variableType == 1">字符串</span>
                    <span v-if="variableInfo.variableType == 2">整型</span>
                    <span v-if="variableInfo.variableType == 3">浮点型</span>
                    <span v-if="variableInfo.variableType == 4">日期型</span>
                    <!-- <span v-if="variableInfo.variableType == 5">枚举</span> -->
                    <span v-if="variableInfo.variableType == 6">布尔型</span>
                </div>
            </div>
            <div class="table-row">
                <div class="table-cell cell-label fl">
                    添加备注信息
                </div>
                <div class="table-cell cell-content fl" style="width:80%;box-sizing: border-box;">
                    <el-input v-model="variableInfo.remark" placeholder="备注信息" style="width:100%"></el-input>
                </div>
            </div>
            <div class="table-row">
                <div class="table-cell cell-label fl">
                    选择变量来源
                </div>
                <div class="table-cell cell-content fl">
                    {{variableInfo.source}}
                </div>
            </div>
            <div class="table-row">
                <div class="table-cell cell-label fl">
                    是否必填
                </div>
                <div class="table-cell cell-content fl">
                    {{variableInfo.necessary == 1 ? '必填' : '非必填'}}
                </div>
            </div>
        </div>
        <el-button class="mg_t_20" type="primary" size="medium" @click="submit">确定</el-button>
    </div>
</template>
<style lang='scss' rel="stylesheet/scss" scoped>
    /*清除浮动代码*/
    .table-box {
        border: solid 1px #e4e7f2;
        .table-row {
            zoom: 1;
            line-height: 52px;
            border-bottom: solid 1px #e4e7f2;
            &:last-of-type {
                border: none;
            }
            &:after {
                display: block;
                clear: both;
                content: "";
                visibility: hidden;
                height: 0
            }
            .table-cell {
                &.cell-label {
                    height: 52px;
                    width: 126px;
                    padding-right: 30px;
                    background-color: #f2f6f8;
                    text-align: right;
                    border-right: solid 1px #e4e7f2;
                    font-weight: bold;
                }
                &.cell-content {
                    padding-left: 40px;

                    em {
                        font-style: normal;
                        margin-left: 10px;
                        color: #a8aeb8;
                    }
                }
            }
        }
    }

    .pages_dictEdit {
        & > .el-button {
            margin-top: 40px;
        }
    }
</style>
<script>
    export default {
        name: 'pages_dictEdit',
        data() {
            return {
                variableId: this.$route.query.variableId,
                source: this.$route.query.source,
                variableInfo: {
                    appId: '',// 产品线ID   String  Y
                    productName: '',// 产品线名称   String  Y
                    variableId: '',// 变量ID    Number  Y
                    variableName: '',// 变量名 String  Y
                    variableNameEn: '',// 字段名 String  Y
                    variableType: '',// 变量类型    Number  Y
                    source: '',// 数据来源    Number  Y   1：变量服务，2：计算引擎
                    necessary: '',// 是否必填    Number  N   1：必填，0非必填。如果此字段未返回，则相应的内容不展示
                    remark: '',// 备注  String  Y
                }
            }
        },
        created() {
            this.variableQuery();
        },
        methods: {
            variableQuery() {
                this.$post('/mcs/variable/query', {
                    variableId: this.variableId,
                    source: this.source
                })
                    .then(res => {
                        Object.assign(this.variableInfo, res)
                        this.getProductList();
                    })
            },
            submit() {
                this.$post('/mcs/variable/update', {
                    variableId: this.variableId,
                    variableName: this.variableInfo.variableName,
                    remark: this.variableInfo.remark
                })
                    .then(res => {
                        this.$message.success('保存成功')
                        this.$router.push('/risk/dictMg/dictList');
                    })
            },
            getProductList() {
                this.$post('/mcs/product/list', {
                    productName: ''
                })
                    .then(res => {
                        res.productList.map((item) => {
                            if (this.variableInfo.appId == item.appId) {
                                this.variableInfo.productName = item.productName;
                            }
                        })
                    })
            },
        }
    }

</script>
