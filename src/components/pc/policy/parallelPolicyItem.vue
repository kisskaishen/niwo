<template>
    <div class="pages_ruleItem">
        <div class="ruleList" v-for="(item,index) in ruleList" :id="'ruleList'+item.id" :key="index"
             v-if="!!ruleList.length">
            <!-- 规则标题 -->
            <el-form-item class="ruleName mg_b_0 pointer"
                          :label="($route.name=='classifyForm'||$route.name=='parallelForm')?(A_Z[index]+'_'):(index+1+'_')">
                <div class="ruleNameSpan " @click.self="openRuleCon(item,index)">
                    <span class="arrowRule" :class="{'bottom':item.ruleConShow}"
                          @click.stop="openRuleCon(item,index)"></span>
                    <span v-if="$route.query.type=='look'">{{item.ruleName}} </span>
                    <el-input class="w310" v-else-if="$route.name=='classifyForm'" v-model="item.ruleName"
                              style="margin-left: 12px"
                              placeholder="请输入规则名称（选填）"
                              size="medium" :disabled="($route.query.type=='look')" clearable></el-input>
                    <!--这里是规则名称-->
                    <el-select v-else ref="ruleName" :popper-append-to-body="true" class="w310"
                               style="margin-left: 12px"
                               :class="{'solid_red':vLock&&!item.id}" v-model="item.id" filterable
                               placeholder="请输入已有规则名称" size="medium" no-match-text="查询无结果" no-data-text="暂无数据"
                               :popper-class="ruleTmplListFilter.length?'stratList toNew hasData':'stratList toNew'"
                               @change="changeRuleName(item,index)">
                        <el-option v-for="(ruleTmpl,ruleIndex) in ruleTmplListFilter" :key="ruleIndex"
                                   :label="ruleTmpl.ruleName" :value="ruleTmpl.id" :disabled="ruleTmpl.ruleStatus==2">
                            <div class="stratOption overhide" :title="ruleTmpl.ruleName">{{ruleTmpl.ruleName}}</div>
                        </el-option>
                        <div class="ruleAdd f_blue pointer mg_l_20 toNewBtn" @click="ruleAdd">+新建规则</div>
                    </el-select>
                </div>
                <!-- 规则添加删除排序按钮 -->
                <div class="ruleOpr fr" v-if="($route.query.type=='edit'||$route.query.type=='add')">
                    <img class="plus pointer mg_r_10" :src="icon.plus" @click="rule_plus(index)" alt="添加规则">
                    <img class="remove pointer mg_r_10" :src="icon.remove" @click="rule_remove(item,index)" alt="删除规则">
                    <img class="sort pointer" :src="icon.sort" alt="排序">
                </div>
            </el-form-item>
            <!-- 规则内容循环 -->
            <div class="ruleContent clear" :class="{'open':item.ruleConShow}" :id="'ruleContent'+index"
                 v-if="!!item.ruleContent.length">
                <ruleConItem ref="ruleConItem" :icon="icon" :variableList="variableList" :item="item" :index="index"
                             :vLock="vLock" @getVarType="getVarType"/>
            </div>
        </div>
        <div class="noResult mg_b_20" v-else>查询无结果，去<span class="f_blue pointer" @click="show.ruleForm=true">新建规则</span>
        </div>
    </div>
</template>

<script>
    import ruleConItem from './ruleConItem'

    export default {
        name: 'pages_ruleItem',
        props: ['icon', 'variableList', 'ruleTmplListUml', 'ruleList', 'show', 'vLock', 'appId', 'policyIndex'],

        data() {
            return {
                pageName: 'pages_ruleItem',
                ruleTmplList: [],// 查询规则模板列表
                A_Z: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
                ruleTmplListFilter: [],
            }
        },
        computed: {
            ruleNameArr() {
                return this.ruleList.filter(item => !!item.ruleName).map(item => item.ruleName);
            },
            hasRepeat() {// 是否有重复项
                return Array.from(new Set(this.ruleNameArr)).length != this.ruleNameArr.length;
            },
            repeatItems() {// 返回所有重复项
                if (this.ruleList.length) {
                    return this.ruleList.map(item => {
                        // console.log(item.ruleName)
                        if (item.ruleName && this.ruleNameArr.indexOf(item.ruleName) != this.ruleNameArr.lastIndexOf(item.ruleName)) {// 首次出现位置!=末次出现位置
                            return item.ruleName;
                        }
                    });
                } else {
                    return [];
                }
            },
        },
        watch: {
            appId(value, oldValue) {
                console.log('appId变化', value, oldValue)
                this.getRuleModelList();// 获取本产品线规则模板列表
            },
        },
        components: {ruleConItem},
        created() {
            this.ruleTmplListFilter = this.ruleTmplList = this.ruleTmplListUml;
            // console.log('ruleItem:getRuleModelList',this.ruleTmplList.length)
        },
        methods: {
            validateRule(rule) {
                if (this.hasRepeat) {// 有重复项
                    return true;
                } else {
                    let ruleConNum = rule.ruleContent.filter((item) => {
                        // 变量名称&&（变量内容数据大于1个时逻辑关系必选）&&已填的变量内容数据==变量内容总数量
                        console.log('【ruleConNum】', item.variableName, (item.content.length > 1 ? item.logic : true), this.$refs.ruleConItem[0].$refs.varItem.validateVar(item))
                        return !!item.variableName && (item.content.length > 1 ? item.logic : true) && this.$refs.ruleConItem[0].$refs.varItem.validateVar(item);
                    }).length;
                    return ruleConNum == rule.ruleContent.length;
                }
            },
            changeRuleName(item, index) {
                item.ruleConShow = true;
                this.getRuleDetail(item, index, true);
                this.$nextTick(() => {
                    this.$refs.ruleName.map((rnItem, rnIndex) => {
                        console.log(rnIndex, this.$refs.ruleName, !rnItem.filteredOptionsCount, rnItem.selectedLabel, item.id)
                        if (!rnItem.filteredOptionsCount) {// 没有搜索结果时
                            item.id = rnItem.selectedLabel;
                        }
                        item.ruleName = rnItem.selectedLabel;
                    })
                })

            },
            openRuleCon(item, index) {// 展开规则内容
                console.log('开关', item, index)
                if (item.id != '') {
                    if (item.ruleConShow) {// 展开后，信息必须填写完整，才允许关闭
                        if (this.validateRule(item)) {
                            item.ruleConShow = !item.ruleConShow;
                        } else {
                            this.$notify({// 通知提示
                                message: '规则信息不完整',
                                type: 'warning',
                                customClass: 'pos-ruleItem',
                            })
                        }
                    } else {
                        item.ruleConShow = !item.ruleConShow;
                        // this.getRuleDetail(item, index);
                    }
                }
            },
            getRuleDetail(item, index, type = false) {// 3.2.20获取规则详情
                let _self = this;
                // (type ? true : !item.ruleContent.length) && item.ruleConShow &&
                this.$post('/mcs/rule/query', {
                    id: item.id,// 规则模板ID  Number  Y
                })
                    .then(res => {
                        res.ruleContent.map((ruleItem, ruleConIndex) => {
                            ruleItem.operationArray = ruleItem.content.map(item => item.operationValue);// 注册oprList操作符列表
                            console.log(ruleItem.operationArray)
                            // ruleItem.oprList = [];// 注册oprList操作符列表
                            this.$emit('getVarType', ruleItem, ruleConIndex, index)// 获取变量类型及相应的操作符列表
                        })
                        Object.assign(item, res)
                    })
            },
            rule_plus(index) {// 添加规则条目
                if (true) {
                    let ruleEmpty = {// 规则分类    List    Y
                        id: '',// 规则ID    Number  Y
                        ruleName: '',// 规则名称    String  Y   不超过255
                        decisionCode: '',// 规则编码    String  Y   不超过255
                        logic: '',// 逻辑操作    Numbrt  Y   1：与，2：或
                        ruleConShow: true,// 是否展开
                        ruleContent: [{// 规则内容    List    Y
                            variableId: '',// 变量ID    Number  Y   不超过255
                            variableName: '',// 变量名 String  Y   不超过255
                            variableType: '',// 变量类型 Number  N   1：字符串，2：整型，3：浮点型，4：日期型，5：枚举，6：布尔型
                            logic: 1,// 逻辑操作    Numbrt  Y   1：与，2：或
                            oprList: [],// 注册oprList操作符列表
                            operationArray: [],// 操作符 Array Y多选
                            content: [{// 规则内容    List    Y
                                operation: '',// 操作符 Number  Y   不超过255
                                operationValue: '',// 操作值 String  Y   不超过255
                                valueDescription: '',// 操作值描述   Numbrt  Y   1：与，2：或
                                sort: '',// 顺序  Number  N
                            }],
                        }],
                    }
                    this.ruleList.splice(index + 1, 0, ruleEmpty)
                    !this.ruleTmplList.length && this.getRuleModelList();// 获取本产品线规则模板列表

                } else {
                    this.$notify({// 通知提示
                        message: '添加过多',
                        type: 'warning'
                    })
                }
            },
            rule_remove(item, index) {// 移除规则条目
                this.ruleList.splice(index, 1);
                if (this.ruleList.length < 1) {
                    this.rule_plus(item, index);
                    !item.ruleName && this.$notify({// 通知提示
                        message: '不能再删了',
                        type: 'warning'
                    })
                }
            },
            getRuleModelList(item) {// 3.2.15查询规则模板列表
                this.$post('/mcs/rule/template/list', {
                    appId: this.appId ? this.appId : this.$route.query.appId,// 产品线ID   Number  N
                    ruleName: '',// 规则名称    String  N
                    ruleStatus: '',// 规则状态    Number  N   1：有效，2：无效
                    createStartDate: '',// 创建开始时间  String  N   yyyy-MM-dd HH:mm:ss
                    createEndDate: '',// 创建结束时间  String  N   yyyy-MM-dd HH:mm:ss
                    updateStartDate: '',// 更新开始时间  String  N   yyyy-MM-dd HH:mm:ss
                    updateEndDate: '',// 更新结束时间  String  N   yyyy-MM-dd HH:mm:ss
                    pageNo: -1,// 页码  Number  N
                    pageSize: '',// 页大小 Number  N
                    statusOrder: 2,//1：列表排序，2：状态排序
                })
                    .then(res => {
                        this.ruleTmplList = res.ruleList;
                        this.ruleTmplListFilter = res.ruleList;
                        // console.log(this.ruleTmplListFilter)
                    })
            },
            getVarType(ruleCon) {// 调用父级组件ruleItem的getVarType
                this.$emit('getVarType', ruleCon)
            },
            ruleAdd() {// 新建规则
                !!this.$refs.ruleName && this.$refs.ruleName.map(item => {// select失去焦点，隐藏下拉框
                    !!item && item.blur();
                })
                this.$route.query.policyIndex = this.policyIndex;

                if (this.$route.path == '/risk/modelMg/modelUml/parallelForm') {
                    this.$router.push({path: this.$route.path + '/ruleForm2', query: this.$route.query});
                } else {
                    this.$router.push({path: this.$route.path + '/ruleForm', query: this.$route.query});
                }
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    .pages_ruleItem {
        .ruleList {
            .el-form-item__content {
                .el-input {
                    .el-input__inner {
                        height: 30px;
                        line-height: 30px;
                    }
                }
            }
            .ruleName {
                height: 40px;
                background-color: #F9FAFA;
                border-bottom: 1px solid #E4E7F2;
                padding-left: 40px;
                position: relative;
                box-sizing: content-box;
                .el-form-item__label {
                    padding: 0;
                }
                /*&:before {*/
                /*content: '▲';*/
                /*position: absolute;*/
                /*top: 0px;*/
                /*left: 10px;*/
                /*font-size: 16px;*/
                /*transform: rotate(90deg) scaleY(0.6);*/
                /*}*/
                /*&.bottom {*/
                /*&:before {*/
                /*transform: rotate(180deg) scaleY(0.6);*/
                /*}*/
                /*}*/
                .ruleNameSpan {
                    /*width:520px;*/
                    height: 40px;
                }
                .arrowRule {
                    display: block;
                    position: absolute;
                    top: 10px;
                    left: -24px;
                    border-left: 8px solid #424242;
                    border-top: 10px solid transparent;
                    border-bottom: 10px solid transparent;
                    font-size: 16px;
                    transform: scaleY(0.6);
                    &.bottom {
                        transform: rotate(90deg) scaleY(0.6);
                    }
                }
                .ruleOpr {
                    position: absolute;
                    top: 1px;
                    right: 20px;
                    display: none;
                }
                &:hover {
                    .ruleOpr {
                        display: block;
                    }
                }
            }
            .ruleContent {
                height: 0;
                opacity: 0;
                transition: all 0.3s;
                overflow: hidden;
                position: relative;
                &.open {
                    overflow: initial;
                    min-height: 57px;
                    height: auto;
                    opacity: 1;
                    border-bottom: 1px solid #E4E7F2;
                }
            }
        }
        .noResult {
            padding-left: 50px;
            height: 84px;
            line-height: 84px;
            border: 1px solid #E4E7F2;
            text-align: left;
        }
    }
</style>
