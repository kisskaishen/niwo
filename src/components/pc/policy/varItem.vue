<template>
    <div class="pages_varItem">
        <div class="ruleConItem overhide" v-for="(ruleCon,ruleConIndex) in item.ruleContent" :key="ruleConIndex">
            <!-- 变量名 -->
            <variableName ref="variableName" :variableList="variableList" :ruleCon="ruleCon"
                          :ruleConIndex="ruleConIndex" :icon="icon" :vLock="vLock" :item="item" :index="index"
                          @changeRuleCon="changeRuleCon" @ruleCon_plus="ruleCon_plus" @ruleCon_remove="ruleCon_remove"/>
            <!-- 变量内容循环 -->
            <variableCon ref="variableCon" :ruleCon="ruleCon" :ruleConIndex="ruleConIndex" :icon="icon" :vLock="vLock"
                         :item="item" :index="index" @ruleConOpr_plus="ruleConOpr_plus"/>
        </div>
    </div>
</template>

<script>
    import variableName from './variableName'
    import variableCon from './variableCon'

    export default {
        name: 'pages_varItem',
        data() {
            return {
                pageName: 'pages_varItem',
            }
        },
        props: ['icon', 'variableList', 'item', 'index', 'vLock'],
        components: {
            variableName, variableCon,
        },
        created() {

        },
        methods: {
            validateVar(item) {
                let contentNum = item.content.filter((opr) => {
                    if (item.variableType == 5 && item.operationArray) {// 枚举类型
                        // console.log('枚举变量数组长度',item.operationArray.length)
                        return !!item.operationArray.length;
                    } else if (item.variableType == 6) {// 布尔类型
                        // console.log('枚举变量数组长度',item.operationArray.length)
                        return !!opr.operation;
                    } else if (item.variableType == 1 && opr.operation == 3) {// 字符串is null没有操作值
                        return opr.operation;
                    } else {
                        // console.log('普通变量',opr.operation,opr.operationValue)
                        return opr.operation && opr.operationValue;
                    }
                }).length;
                // console.log('【contentNum】', contentNum, item.content.length)
                return contentNum == item.content.length;
            },
            /************************ 与variableName交互的方法 ************************/
            changeRuleCon(ruleCon) {// 改变规则内容之变量
                // console.table(Object.entries(ruleCon))
                let contentEmpty = [{// 规则内容    List    Y
                    operation: '',// 操作符 Number  Y   不超过255
                    operationValue: '',// 操作值 String  Y   不超过255
                    valueDescription: '',// 操作值描述   Numbrt  Y   1：与，2：或
                    sort: '',// 顺序  Number  N
                }]
                this.$nextTick(() => {// 解决operation已有值情况下，修改variableType=5时，导致operationArray已注册，但operation残留的问题
                    this.$emit('getVarType', ruleCon)
                })
                ruleCon.operationArray = [];
                ruleCon.content = contentEmpty;
            },
            ruleCon_plus(item, index) {// 添加变量
                if (true) {
                    let ruleConEmpty = {// 空条件    List    Y
                        variableId: '',// 变量ID    Number  Y   不超过255
                        variableName: '',// 变量名 String  Y   不超过255
                        variableType: '',// 变量类型 Number  N   1：字符串，2：整型，3：浮点型，4：日期型，5：枚举，6：布尔型
                        logic: '',// 逻辑操作    Numbrt  Y   1：与，2：或
                        oprList: [],// 注册oprList操作符列表
                        content: [],// 注册操作符数组
                    }
                    item.ruleContent.splice(index + 1, 0, ruleConEmpty)
                } else {
                    this.$notify({// 通知提示
                        message: '添加过多',
                        type: 'warning'
                    })
                }
            },
            ruleCon_remove(item, ruleCon, ruleConIndex) {// 添加规条目
                if (item.ruleContent.length == 0) {
                    this.$notify({// 通知提示
                        message: '不能再删了',
                        type: 'warning'
                    })
                } else {
                    item.ruleContent.splice(ruleConIndex, 1);
                    if (item.ruleContent.length < 1) {
                        this.ruleCon_plus(item)
                    }
                }
            },
            /************************ 与variableCon交互的方法 ************************/
            ruleConOpr_plus(ruleCon) {// 添加操作符及操作值
                // console.log(ruleCon)
                if (ruleCon.content.length > 1) {// 有两个操作符
                    ruleCon.content.pop();
                } else {// 小于两个操作符
                    ruleCon.operationArray = [];
                    ruleCon.content.push({
                        operation: '',// 操作符 Number  Y   不超过255
                        operationValue: '',// 操作值 String  Y   不超过255
                        valueDescription: '',// 操作值描述   Numbrt  Y   1：与，2：或
                        sort: '',// 顺序  Number  N
                    })
                }
            },

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    .pages_varItem {
        .ruleConItem {
            padding: 10px 0;
            border-bottom: 1px dashed #ececec

        }

    }
</style>
