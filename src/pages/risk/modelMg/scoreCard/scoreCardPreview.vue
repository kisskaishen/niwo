<template>
    <!--<div class="pages_scoreCardPreview relative" id="pages_scoreCardPreview" ref="pages_scoreCardPreview"-->
    <!--v-loading="loading">-->
    <div class="pages_scoreCardPreview relative" id="pages_scoreCardPreview" ref="pages_scoreCardPreview">
        <div class="titleDiv">
            <p>模型名称：{{modelAdd.moldName}}</p>

            <p>模型编码：{{modelAdd.moldCode}}</p>
            <el-popover
                placement="right-start"
                title="备注"
                width="300"
                trigger="hover">
                <!--:content="(content.remark)">-->
                <p style="max-width: 280px;white-space: normal;word-break: break-word;">{{modelAdd.remark}}</p>
                <span slot="reference">备注信息：<i></i></span>
            </el-popover>
        </div>
        <div class="initScore">
            <span>初始评分：</span>
            <span style="display:inline-block;width: 140px;margin-bottom: 20px;">{{initScore}}</span>
        </div>
        <el-table ref="table" :data="featureList" class="scoreCardPreviewTable" border
                  :header-row-class-name="'table_hd'" :header-cell-class-name="'table_th'" :row-class-name="'table_tr'"
                  :cell-class-name="'table_td'" width="100%" :fit="true">
            <el-table-column label="特征" align="left">
                <template slot-scope="scope">
                    <div class="varNameItem overhide" v-for="(frItem,frIndex) in scope.row.featureRuleList"
                         v-if="frIndex==0" :class="{'hidden':frIndex!=0}">
                        <div class="varName" v-for="(ruleCon,ruleConIndex) in frItem.rule.ruleContent"
                             :title="ruleCon.variableName">
                            <!-- 变量名 -->
                            <div class="fl overhide">{{ruleCon.variableName}}</div>
                            <div class="ruleConOpr fr mg_r_5" :class="{'mg_t-20':frItem.rule.ruleContent.length%2==0}"
                                 v-if="frItem.rule.ruleContent.length>1&&ruleConIndex==(frItem.rule.ruleContent.length%2==1?((frItem.rule.ruleContent.length/2).toFixed()-1):(frItem.rule.ruleContent.length/2))">
                                {{frItem.rule.logic==1?'AND':'OR'}}
                            </div>
                        </div>
                    </div>
                    <div class="featureWeight varNameItem mg_t_10">
                        权重：{{scope.row.featureWeight}}
                    </div>
                    <div class="special">
                        <div class="missScore varNameItem">
                            其他时系数值：{{scope.row.missScore}}
                        </div>
                        <div class="exceptionScore varNameItem">
                            异常时系数值：{{scope.row.exceptionScore}}
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="条件" align="left">
                <template slot-scope="scope">
                    <div class="frItem" v-for="(frItem,frIndex) in scope.row.featureRuleList" :frIndex="frIndex">
                        <div class="ruleConItem" :class="{'areaLine':frItem.rule.ruleContent.length>1}"
                             v-for="(ruleCon,ruleConIndex) in frItem.rule.ruleContent" :ruleConIndex="ruleConIndex">
                            <!-- 变量内容循环 -->
                            <!--1：字符串，2：整型，3：浮点型，4：日期型，5：枚举，6：布尔型-->
                            <template>
                                <div class="ruleConItemCell overhide0"
                                     :class="{'mg_t_10':varConIndex>0&&$route.query.type!='look','inlineBlock text-top':$route.query.type=='look'}"
                                     v-for="(varCon,varConIndex) in ruleCon.content" :key="varConIndex"
                                     v-if="(ruleCon.variableType==5||ruleCon.variableType==6)?(varConIndex==0):true">
                                    <span v-if="ruleCon.variableType!=5&&varConIndex==1" class="mg_l_10 mg_r_10">{{ruleCon.logic==1?'AND':'OR'}}</span>
                                    <span v-if="ruleCon.variableType==5&&varConIndex==0">
                                        <span
                                            v-for="(item,index) in ruleCon.content.map(item=>item.valueDescription)">{{item}}
                                            <template v-if="index<ruleCon.content.length-1">、</template>
                                        </span>
                                    </span>
                                    <span v-else-if="ruleCon.variableType==6">{{varCon.valueDescription}}</span>
                                    <span v-else>{{varCon.operation|operationVal}} {{varCon.operationValue}}</span>
                                </div>
                            </template>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="系数" align="left">
                <template slot-scope="scope">
                    <div class="frItem" v-for="(frItem,frIndex) in scope.row.featureRuleList">
                        <!-- /** Jim修改于2018-10-12 10:54:33 @hidden：v-if掉让特征垂直居中 */  -->
                        <div class="ruleConItem" v-for="(ruleConItem,ruleConIndex) in frItem.rule.ruleContent"
                             :class="{'hidden':ruleConIndex!=(frItem.rule.ruleContent.length%2==1?((frItem.rule.ruleContent.length/2).toFixed()-1):(frItem.rule.ruleContent.length/2))}"
                             v-if="ruleConIndex==(frItem.rule.ruleContent.length%2==1?((frItem.rule.ruleContent.length/2).toFixed()-1):(frItem.rule.ruleContent.length/2))"
                        >
                            <template v-for="(coeItem,coeIndex) in frItem.coefficientObject">
                                <div class="inlineBlock" v-if="coeItem.type==2">{{getVarName(coeItem.value)}}</div>
                                <div class="inlineBlock" v-else>{{coeItem.value}}</div>
                            </template>
                        </div>
                        <div class="ruleConItem" v-else></div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- <noData img="noData" v-loading="loading" p2="暂无数据" v-else/> -->
    </div>
</template>

<script>
    export default {
        name: 'pages_scoreCardPreview',
        data() {
            return {
                variableList: [],
                featureList: [],
                modelAdd: {},
                loading: true,
                initScore: ''
            }
        },
        created() {
            console.time('mounted')
            this.getVariableList();// 获取本产品线变量列表
            this.getFeatureList();
            // this.getContent();
        },
        mounted() {
            console.timeEnd('mounted')
            console.time('updated')
        },
        updated() {
            console.timeEnd('updated')
        },
        // 过滤器==针对operation值进行校验
        // 1: 等于, 2: 不等于, 3: is null, 4: 大于, 5: 大于或等于, 6: 小于, 7: 小于或等于,8:以…开始,9包含
        filters: {
            operationVal(val) {
                switch (val) {
                    case 1:
                        return '=';
                        break;
                    case 2:
                        return '!=';
                        break;
                    case 3:
                        return 'is null';
                        break;
                    case 4:
                        return '>';
                        break;
                    case 5:
                        return '>=';
                        break;
                    case 6:
                        return '<';
                        break;
                    case 7:
                        return '<=';
                        break;
                    case 8:
                        return 'startWith';
                        break;
                    case 9:
                        return 'contains';
                        break;

                }
            }
        },
        methods: {
            getFeatureList() {
                this.$post('/mcs/scorecard/content', {
                    moldId: this.$route.query.modelId
                })
                    .then(res => {
                        console.time('getFeatureList')
                        this.featureList = res.featureList;
                        this.loading = false;
                        this.initScore = res.initialRate
                        {
                            this.modelAdd.moldName = res.moldName;
                            this.modelAdd.moldCode = res.moldCode;
                            this.modelAdd.remark = !!res.remark ? res.remark : '';
                            this.modelAdd.moldType = res.moldType;
                            this.modelAdd.moldVersion = res.moldVersion;
                            this.modelAdd.moldStatus = res.moldStatus;
                        }
                    })

            },
            /************************ variableName需要的数据 ************************/
            getVariableList(item) {// 3.2.5查询变量列表
                let _self = this;
                this.$post('/mcs/variable/config/list', {
                    appId: _self.$route.query.appId,//产品线ID   Number  N
                })
                    .then(res => {
                        this.variableList = res.variableList;
                    })
            },
            getVarName(id) {
                let varName = '';
                this.variableList.map((varItem) => {
                    if (id == varItem.variableId) {
                        console.log(id, varItem.variableName)
                        varName = varItem.variableName;
                    }
                })
                return varName;
            },

        },
        // beforeRouteLeave(to, from, next) {
        //     console.log(to.meta.keepAlive)
        //     if (to.path == '/risk/modelMg/modelList') {
        //         to.meta.keepAlive = true
        //         next();
        //     }
        // },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    .pages_scoreCardPreview {
        padding: 20px 20px 80px;
        .varNameItem {
            .varName {
                & > .overhide {
                    width: 400px;
                }
            }
        }
        .mg_t-20 {
            margin-top: -19px;
        }
        .ruleConOpr {
            line-height: 30px;
        }
        .el-table {
            /*border: 1px solid #ccc;*/
            .table_th {
                /*border-bottom: 1px solid #ccc;*/
            }
            .table_tr {
                .table_td {
                    border-bottom: 1px solid #ccc;
                }
            }
        }
        .titleDiv {
            /*width: 100%;*/
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 20px;
            p {
                margin-right: 60px;
                .el-input {
                    width: 140px;
                    .el-input__inner {
                        height: 30px !important;
                        line-height: 30px !important;
                    }
                }
            }
            .el-popover__title {
                text-align: center !important;
            }
            .el-popover__reference {
                cursor: pointer;
                &:hover {
                    i {
                        background: url("../../../../resource/img/icon/icon-remark-hover.png") no-repeat center /100%;
                    }

                }
                i {
                    display: inline-block;
                    width: 14px;
                    height: 16px;
                    background: url("../../../../resource/img/icon/icon-remark.png") no-repeat center /100%;
                    vertical-align: middle;

                }
            }
            .el-popover {
                .el-button {
                    text-align: center;
                }
            }

        }
    }
</style>
