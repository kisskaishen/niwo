<template>
    <div class="pages_stratVersion">
        <el-form class="classifyForm" :model="classifyForm" status-icon>
            <div class="f20 text-center pd_30">版本记录</div>
            <div class="classifyForm_bd">
                <policyItem ref="policyItem" :classifyForm="classifyForm" :vLock="vLock"/>
            </div>
        </el-form>
    </div>
</template>

<script>
    import policyItem from 'components/pc/policy/policyItem'

    export default {
        name: 'pages_stratVersion',
        data() {
            return {
                pageName: 'pages_stratVersion',
                /* 数据提交 */
                classifyForm: {
                    policyList: [/*{//分类器分类列表 List  //【【不注释：表单验证是name为空。注释了，新建时，没有初始化项】】
                    appId:'',// 产品线ID
                    id:'',// 策略名称   String  Y   
                    policyName:'',// 策略名称   String  Y   
                    logic:'',// 逻辑操纵    Number  Y   
                    policyShow:false,
                    ruleList:[{// 规则分类    List    Y   
                        id:'',// 规则ID    Number  Y   
                        ruleName:'',// 规则名称    String  Y   不超过255
                        decisionCode:'',// 规则编码    String  Y   不超过255
                        logic:'',// 逻辑操作    Numbrt  Y   1：与，2：或   
                        ruleConShow:false,// 是否展开
                        ruleContent:[{// 规则内容    List    Y   
                            variableId:'',// 变量ID    Number  Y   不超过255
                            variableName:'',// 变量名 String  Y   不超过255
                            variableType:'',// 变量类型 Number  N   1：字符串，2：整型，3：浮点型，4：日期型，5：枚举，6：布尔型
                            logic:1,// 逻辑操作    Numbrt  Y   1：与，2：或
                            oprList:[],// 注册oprList操作符列表
                            operationArray:[],// 操作符 Array Y多选
                            content:[{// 规则内容    List    Y   
                                operation:'',// 操作符 Number  Y   不超过255
                                operationValue:'',// 操作值 String  Y   不超过255
                                valueDescription:'',// 操作值描述   Numbrt  Y   1：与，2：或
                                sort:'',// 顺序  Number  N   
                            }],
                        }],                 
                    }],                    
                }*/],
                },
                vLock: false,// 是否开启验证提示
            }
        },
        components: {policyItem},
        created() {
            this.getStratVersionList();
        },
        methods: {
            /************************ stratVersion自动运行获取数据 ************************/
            getStratVersionList() {// 3.2.26查询策略模板版本记录列表
                this.$post('/mcs/policy/template/version/list', {
                    id: this.$route.query.policyTmpId,// 策略模板ID    Number  Y
                })
                    .then(res => {
                        this.isNewNode = false;
                        res.policyList.map((item) => {
                            item.policyShow = false;//  默认不展开
                            item.ruleList = [];// 预先注册ruleContent
                        })
                        Object.assign(this.classifyForm, res)
                    })
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
    .pages_stratVersion {
        padding-right: 40px;
        .pd_30 {
            padding: 30px 0;
        }
        .classifyList {
            margin-bottom: -1px;
            .classifyContent {
                border-bottom: 1px solid #E4E7F2;
                &.open {
                    padding: 0 50px 40px;
                    .classify_bd {
                        .stratForm_bd {
                            border-left: 1px solid #E4E7F2;
                            border-right: 1px solid #E4E7F2;
                        }
                    }
                }
            }
        }
    }
</style>
