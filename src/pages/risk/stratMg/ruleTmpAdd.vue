<template>
    <div class="pages_ruleTmpAdd">
        <el-form :model="ruleTmpForm" status-icon :rules="rules" ref="ruleTmpForm" class="ruleTmpForm">
            <el-form-item :label="$route.query.type=='edit'?'产品线：':'选择产品线：'" class="productList">
                <el-select v-model="ruleTmpForm.appId" filterable placeholder="请选择" size="small"
                           :class="{'solid_red':vLock&&!ruleTmpForm.appId}" :disabled="$route.query.type=='edit'"
                           @change="getVariableList">
                    <el-option v-for="(item,index) in productList" :key="item.appId" :label="item.productName"
                               :value="item.appId"></el-option>
                </el-select>
            </el-form-item>
            <div class="ruleTmpForm_bd" v-loading="ruleTmpForm_bd">
                <!-- 新建规则 -->
                <ruleForm ref="ruleForm" :icon="icon" :variableList="variableList" @createRuleSuccess="pushRule"
                          @getVarType="getVarType"/>
            </div>
        </el-form>
    </div>
</template>

<script>
    let icon = {
        plus: require('img/icon/plus.png'),
        remove: require('img/icon/remove.png'),
        sort: require('img/icon/sort.png'),
        ruleConOpen: require('img/icon/ruleConOpen.png'),
        arrowLeft: require('img/icon/arrowLeft.png'),
    }
    import ruleForm from '../modelMg/umlForm/ruleForm'

    export default {
        name: 'pages_ruleTmpAdd',
        data() {
            return {
                pageName: 'pages_ruleTmpAdd', icon,
                show: {
                    stratName: false,
                    ruleForm: false,
                },
                productList: [],
                variableList: [],// 变量列表
                allEnmuList:[],     //变量所有的列表
                oprList: [{id: 1, name: '='}, {id: 2, name: '!='}, {id: 3, name: 'is null'}, {id: 4, name: '>'}, {
                    id: 5,
                    name: '>='
                }, {id: 6, name: '<'}, {id: 7, name: '<='}, {id: 8, name: 'startsWith'}, {id: 9, name: 'contains'}],
                oprList_str: [{id: 1, name: '='}, {id: 2, name: '!='}, {id: 3, name: 'is null'}, {
                    id: 8,
                    name: 'startsWith'
                }, {id: 9, name: 'contains'}],
                oprList_num: [{id: 1, name: '='}, {id: 2, name: '!='}, {id: 4, name: '>'}, {id: 5, name: '>='}, {
                    id: 6,
                    name: '<'
                }, {id: 7, name: '<='}],
                oprList_bl: [{id: '1', name: '是'}, {id: '0', name: '否'}],
                ruleTmpForm: {
                    appId: '',
                    id: '',
                },
                rules: {},
                vLock: false,
                ruleTmpForm_bd: false,
            }
        },
        computed: {},
        components: {ruleForm},
        created() {
            this.getProductList();
            this.getOprList_enumList()
            if (this.$route.query.type == 'edit') {
                this.ruleTmpForm.appId = this.$route.query.appId;
                this.ruleTmpForm.id = this.$route.query.ruleId * 1;
                this.getVariableList();// 获取本产品线变量列表
            }
        },
        mounted() {

        },
        methods: {
            pushRule(ruleForm) {// 保存规则模板
                ruleForm.isTemplate = 0;
                Object.assign(this.ruleTmpForm, ruleForm)
                this.vLock = true;
                !this.ruleTmpForm.id && this.createRule();
                !!this.ruleTmpForm.id && this.updateRule();
            },
            createRule() {
                this.$post('/mcs/rule/create', this.ruleTmpForm)
                    .then(res => {
                        this.$message.success('保存成功')
                        this.$router.push('/risk/stratMg/ruleList');
                    })
            },
            updateRule() {
                this.$post('/mcs/rule/update', this.ruleTmpForm)
                    .then(res => {
                        this.$message.success('保存成功')
                        this.$router.push('/risk/stratMg/ruleList');
                    })
            },
            /************************ ruleTmpForm自动运行获取数据 ************************/
            getProductList() {
                let _self = this;
                this.$post('/mcs/product/list', {
                    productName: '',
                    pageNo: '-1'
                })
                    .then(res => {
                        this.productList = res.productList;

                    })
            },
            getVariableList(item) {// 3.2.5查询变量列表
                this.ruleTmpForm_bd = true;
                this.$post('/mcs/variable/config/list', {
                    appId: this.ruleTmpForm.appId,//产品线ID   Number  N
                })
                    .then(res => {
                        this.ruleTmpForm_bd = false;
                        this.variableList = res.variableList;
                        this.$nextTick(() => {
                            /** Jim修改于2018-09-27 16:20:00 @拿到变量列表后再获取规则详情 */
                            this.$refs.ruleForm.resetRuleForm(this.ruleTmpForm.appId);// 修改产品后重置变量
                            if (this.$route.name == 'ruleTmpEdit' && this.$route.query.ruleId) {
                                this.$refs.ruleForm.getRuleDetail();// 修改产品后重置变量
                            }
                        })
                    })
            },
            /************************ 与ruleForm&&ruleForm公用的方法 ************************/
            getVarType(item, ruleConIndex, index) {
                this.variableList.map((varItem) => {
                    if (item.variableId == varItem.variableId) {
                        item.variableName = varItem.variableName;
                        item.variableType = varItem.variableType;
                        // console.table(Object.entries(varItem))
                        if (varItem.variableType == 1) {// 1：字符串(==、!=、is null、startsWith、contains)
                            item.oprList = this.oprList_str;
                        } else if (varItem.variableType == 2 || varItem.variableType == 3 || varItem.variableType == 4) {// 2：整型，3：浮点型，4：日期型(排除is nll+startsWith+contains)
                            item.oprList = this.oprList_num;
                        } else if (varItem.variableType == 5) {// 5：枚举(多选)
                            item.oprList = []
                            this.allEnmuList.map(cell => {
                                if (item.variableId == cell.variableId) {
                                    cell.id = cell.enumValue;
                                    cell.name = cell.enumName;
                                    item.oprList.push(cell)
                                }
                            })
                            // this.getOprList_enumList(item, ruleConIndex, index);// 获取变量枚举值列表
                        } else if (varItem.variableType == 6) {// 6：布尔型(是否)
                            item.oprList = this.oprList_bl;
                        } else {
                            this.$notify({// 通知提示
                                message: '未知变量',
                                type: 'warning'
                            })
                        }
                    }
                })
            },
            // getOprList_enumList(item, ruleConIndex, index) {// 3.2.12获取变量枚举值列表
            //     // console.table(Object.entries(item))
            //     let _self = this;
            //     this.$post('/mcs/variable/enums', {
            //         variableId: item.variableId,// 变量ID  Number  Y
            //     })
            //         .then(res => {
            //             res.enumList.map((cell) => {
            //                 cell.id = cell.enumValue;
            //                 cell.name = cell.enumName;
            //             })
            //             item.oprList = res.enumList;
            //         })
            // },
            getOprList_enumList() {// 3.2.12获取变量枚举值列表
                // console.table(Object.entries(item))
                let _self = this;
                this.$post('/mcs/variable/enum/list', {
                    // variableId: item.variableId,// 变量ID  Number  Y
                })
                    .then(res => {
                        this.allEnmuList = res.enumList
                        // console.log(res.enumList)
                        // res.enumList.map((cell) => {
                        //     cell.id = cell.enumValue;
                        //     cell.name = cell.enumName;
                        // })
                        // item.oprList = res.enumList;
                    })
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
    .pages_ruleTmpAdd {
        .ruleTmpForm {
            padding-top: 30px;
            padding-right: 30px;
            .el-form-item {
                /*margin-bottom: 22px;*/
            }
            .ruleTmpForm_bd {
                padding: 0 40px 40px;
                border: 1px solid #E4E7F2;
            }
            .stratForm_bd {
                border: 1px solid #E4E7F2;
                border-bottom: 0;
            }
        }
    }

    #app .el-input.is-disabled, #app .el-input.is-disabled * {
        background: #fff;
    }
</style>
