<template>
    <div class="pages_policyItem">
        <div class="classifyList mg_b_10" v-for="(item,index) in classifyForm.policyList" :id="'classifyList'+item.id"
             :key="index" v-if="!!classifyForm.policyList.length">
            <!-- 分类标题 -->
            <el-form-item class="classifyName mg_b_0" :label="index+1+'_'">
                <div class="classifyNameSpan pointer" style="line-height: 40px;"
                     @click.self="openClassifyCon(item,index)">
                    <span class="arrowRule" :class="{'bottom':item.policyShow}"
                          @click.stop="openClassifyCon(item,index)"></span>
                    <template v-if="$route.name=='stratVersion'">
                        <span class="bold">{{item.policyName}}{{'V'+item.policyVersion}}</span><span
                        class="createTime f_m f12">时间：{{item.createTime}} 操作人：{{item.createBy}}</span>
                    </template>

                    <span v-else-if="(!!item.policyName&&!item.policyShow)||$route.query.type=='look'">{{item.policyName}}</span>
                    <el-input class="w310" v-else-if="$route.name=='classifyForm'||$route.name=='FlowClassifyForm'" v-model="item.policyName"
                              style="margin-left: 12px"
                              :class="{'solid_red':(vLock&&!item.policyName)||repeatItems.includes(item.policyName)}"
                              placeholder="请输入分类名称" size="medium" clearable></el-input>
                    <el-select ref="policyName" class="w310" :class="{'solid_red':vLock&&!item.id}" v-else
                               v-model.number="item.id" filterable placeholder="请选择已有的策略模版" size="medium"
                               no-match-text="查询无结果" no-data-text="暂无数据"
                               :popper-class="policyListFilter.length?'stratList toNew hasData':'stratList toNew'"
                               @change="changePolicyName(item,index)">
                        <el-option v-for="(classifyTmpl,classifyIndex) in policyListFilter" :key="classifyIndex"
                                   :label="classifyTmpl.policyName" :value="classifyTmpl.id">
                            <div class="stratOption overhide" :title="classifyTmpl.policyName">
                                {{classifyTmpl.policyName}}
                            </div>
                        </el-option>
                        <div class="stratAdd f_blue pointer mg_l_20 toNewBtn" @click="stratAdd">+新建策略</div>
                    </el-select>
                </div>
                <!-- 分类添加删除排序按钮 -->
                <div class="classifyOpr fr" v-if="$route.query.type=='edit'">
                    <img class="plus pointer mg_r_10" :src="icon.plus" @click="$emit('classify_plus',index)" alt="添加分类">
                    <img class="remove pointer mg_r_10" :src="icon.remove" @click="classify_remove(item,index)"
                         alt="删除分类">
                    <img class="sort pointer" :src="icon.sort" alt="分类排序">
                </div>
            </el-form-item>
            <!-- 分类内容循环 -->
            <div class="classifyContent clear" :class="{'open':item.policyShow}" :id="'classifyContent'+item.id"
                 v-if="!!item.ruleList">
                <div class="classify_bd mg_t_20">
                    <el-form-item :label="$route.name=='classifyForm'||$route.name=='FlowClassifyForm'?'分类执行条件：':'策略执行条件：'" prop="logic"
                                  class="classifyLogic">
                        <el-radio-group v-model.number="item.logic" :class="{'solid_red':vLock&&!item.logic}">
                            <el-radio :label="2" v-if="$route.query.type=='look'?item.logic==2:true">满足任意条件</el-radio>
                            <el-radio :label="1" v-if="$route.query.type=='look'?item.logic==1:true">满足全部条件</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item class="stratForm_bd">
                        <!-- 规则循环 -->
                        <ruleItem ref="ruleItem" :icon="icon" :variableList="variableList"
                                  :ruleTmplListUml="ruleTmplList" :ruleList="item.ruleList" :show="show" :vLock="vLock"
                                  :policyIndex="index" @getVarType="getVarType"/>
                    </el-form-item>
                </div>
            </div>
        </div>
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
    import ruleItem from '../../../components/pc/policy/ruleItem'

    export default {
        name: 'pages_policyItem',
        data() {
            return {
                pageName: 'pages_policyItem', icon,
                show: {},
                /* 数据展示 */
                policyList: [],
                allEnmuList: [],             // 枚举值
                variableList: [],
                ruleTmplList: [],
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
                policyListFilter: [],
            }
        },
        computed: {
            policyNameArr() {
                return this.classifyForm.policyList.filter(item => !!item.policyName).map(item => item.policyName);
            },
            hasRepeat() {// 是否有重复项
                return Array.from(new Set(this.policyNameArr)).length != this.policyNameArr.length;
            },
            repeatItems() {// 返回所有重复项
                if (this.classifyForm.policyList.length) {
                    return this.classifyForm.policyList.map(item => {
                        // console.log(item.policyName)
                        if (this.policyNameArr.indexOf(item.policyName) != this.policyNameArr.lastIndexOf(item.policyName)) {// 首次出现位置!=末次出现位置
                            return item.policyName;
                        }
                    });
                } else {
                    return [];
                }
            },
        },
        props: ['classifyForm', 'vLock', 'variableListUml', 'ruleTmplListUml'],
        components: {ruleItem},
        created() {
            this.getOprList_enumList()

            this.variableList = this.variableListUml;
            this.ruleTmplList = this.ruleTmplListUml;
            !this.variableListUml.length && this.getVariableList();// 3.2.5查询变量列表
            this.getPolicyList();// 获取本产品线策略列表

        },
        methods: {
            stratAdd() {
                !!this.$refs.policyName && this.$refs.policyName.map(item => {// select失去焦点，隐藏下拉框
                    !!item && item.blur();
                })
                this.$emit('stratAdd');
            },
            changePolicyName(item, index) {// 要把policyName传给后台
                item.policyShow = true;
                this.getPolicyDetail(item, index, true);
                this.$nextTick(() => {
                    console.log(!this.$refs.policyName[0].filteredOptionsCount, this.$refs.policyName[0].selectedLabel, item.id)
                    if (!this.$refs.policyName[0].filteredOptionsCount) {// 没有搜索结果时
                        item.id = this.$refs.policyName[0].selectedLabel;
                    }
                    item.policyName = this.$refs.policyName[0].selectedLabel;
                })
            },
            /************************ policyItem专用的方法 ************************/
            openClassifyCon(item, index) {// 展开分类内容
                if (item.id!='') {
                    if (item.policyShow) {// 展开后，信息必须填写完整，才允许关闭
                        if (this.validateStrat(item)) {
                            item.policyShow = !item.policyShow;
                        } else {
                            this.$notify({// 通知提示
                                message: this.$route.name == 'classifyForm' ? '请输入分类名称' : '请选择策略模版',
                                type: 'warning',
                                customClass: 'pos-policyItem',
                            })
                        }
                    } else {
                        item.policyShow = !item.policyShow;
                        this.getPolicyDetail(item, index);
                    }
                }


            },
            getPolicyDetail(item, index, reqGet) {// 3.2.42模型配置—获取策略节点
                let _self = this;
                (reqGet ? reqGet : !item.ruleList.length) && item.policyShow &&
                this.$post('/mcs/policy/query', {
                    id: item.id// 策略模板ID  Number  Y
                })
                    .then(res => {
                        res.ruleList.map((ruleItem, ruleIndex) => {
                            ruleItem.ruleConShow = false;//  默认不展开
                            // ruleItem.ruleContent = [];// 预先注册ruleContent
                            ruleItem.ruleContent.map((ruleConItem, ruleConIndex) => {
                                console.log(ruleConItem, ruleConIndex)
                                ruleConItem.oprList = [];// 注册oprList操作符列表
                                this.getVarType(ruleConItem, ruleConIndex, ruleIndex);
                            })
                            if (!ruleItem.isTemplate) {// 非模板，id没在规则列表里，所以直接显示名称
                                ruleItem.id = ruleItem.ruleName;
                            }
                        })
                        res.ruleList.sort((a, b) => {
                            return a.sort - b.sort;
                        })
                        Object.assign(item, res)
                    })
            },
            /************************ policyItem表单验证&&表单保存&&表单重置 ************************/
            validateStrat(stratForm) {

                if (this.hasRepeat) {// 有重复项
                    setTimeout(() => {
                        this.$notify({// 通知提示
                            message: '分类名称不能重复',
                            type: 'warning'
                        })
                    }, 100)
                    throw new Error('分类名称不能重复');
                    return false;
                } else {

                    let ruleNum = stratForm.ruleList.filter((rule) => {
                        let ruleConNum = this.$refs.ruleItem[0].validateRule(rule);
                        console.log('完整ruleCon', ruleConNum, '所有ruleCon', rule.ruleContent.length, '所有rule', stratForm.ruleList.length)
                        if (this.$route.name == 'classifyForm'||this.$route.name == 'FlowClassifyForm') {// 分类器的分类的规则名称选填
                            return !!rule.logic && ruleConNum;
                        } else {
                            return (!!rule.ruleName || !!rule.id) && !!rule.logic && ruleConNum;
                        }
                    }).length;
                    console.log('完整rule', ruleNum, '所有rule', stratForm.ruleList.length)
                    if (stratForm.logic && ruleNum == stratForm.ruleList.length) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            /************************ classifyForm添加分类&&移除分类 ************************/
            classify_remove(item, index) {// 移除分类
                this.$emit('classify_remove', item, index);
            },
            /************************ policyItem自动运行获取数据 ************************/
            getPolicyList() {// 3.2.24查询策略模板列表
                let _self = this;
                this.$post('/mcs/policy/template/list', {
                    appId: _self.$route.query.appId,// 产品线ID   Number  Y
                    policyName: '',// 策略名称    String  Y
                    pageNo: '',// 页码  Number  N
                    pageSize: 999,// 每页大小    Number  N
                })
                    .then(res => {
                        this.policyList = res.policyList.filter(item => item.policyStatus == 1);
                        this.policyListFilter = res.policyList.filter(item => item.policyStatus == 1);

                    })
            },
            getVariableList(item) {// 3.2.5查询变量列表
                let _self = this;
                this.$post('/mcs/variable/config/list', {
                    appId: _self.$route.query.appId,//产品线ID   Number  N
                })
                    .then(res => {
                        this.variableList = res.variableList;
                    })
            },
            /************************ 与varItem公用的方法 ************************/
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
                        } else if (varItem.variableType == 5) {// 5：枚举(多选)，
                            // this.getOprList_enumList(item, ruleConIndex, index);// 获取变量枚举值列表
                            item.oprList = []
                            this.allEnmuList.map(cell => {
                                if (item.variableId == cell.variableId) {
                                    cell.id = cell.enumValue;
                                    cell.name = cell.enumName;
                                    item.oprList.push(cell)
                                }
                            })
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
            getOprList_enumList() {
                let _self = this;
                this.$post('/mcs/variable/enum/list', {
                })
                    .then(res => {
                        this.allEnmuList = res.enumList
                    })
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    .pages_policyItem {
        .classifyList {
            border: 1px solid #E4E7F2;
            border-bottom: 0;
            .el-form-item__content {
                .el-input {
                    .el-input__inner {
                        height: 34px;
                        line-height: 34px;
                    }
                }
            }
            .classifyName {
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
                /*top: 8px;*/
                /*left: 10px;*/
                /*font-size: 16px;*/
                /*transform: rotate(90deg) scaleY(0.6);*/
                /*}*/
                /*&.bottom {*/
                /*&:before {*/
                /*transform: rotate(180deg) scaleY(0.6);*/
                /*}*/
                /*}*/
                .classifyNameSpan {
                    /*width:520px;*/
                    height: 40px;
                    .createTime {
                        position: absolute;
                        right: 10px;
                    }
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
                .classifyOpr {
                    position: absolute;
                    top: 1px;
                    right: 20px;
                    display: none;
                }
                &:hover {
                    .classifyOpr {
                        display: block;
                    }
                }
            }
            .classifyContent {
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
                    .classify_bd {
                        .el-form-item:last-child {
                            margin-bottom: 0;
                        }
                        .classifyLogic { // 策略执行条件
                            padding-left: 50px;
                        }
                        .pages_ruleItem {
                            border-top: 1px solid #E4E7F2;
                            .ruleList {
                                .ruleName:before {
                                    content: initial;
                                }
                            }
                        }
                    }
                }
            }
        }
        .el-checkbox__input {
            .el-checkbox__inner {
                border-radius: 50%;
                width: 16px;
                height: 16px;
                &:after {
                    height: 8px;
                    left: 5px;
                    top: 2px;
                }
            }
        }
        .stratList { // 策略下拉列表
            width: 310px;
        }
        .el-select {
            .el-input__suffix { // 隐藏下拉箭头
                display: none;
            }
        }
        .stratFade { // enter-active-class="stratFade fadeInLeft" leave-active-class="stratFade fadeOutRight"
            background: #fff;
            padding: 0 20px;
            min-width: 700px;
            border-left: 1px solid #E4E7F2;
            position: absolute;
            top: 0px;
            right: 0;
            bottom: 0px;
            transition: all 0.3s ease;
            &.fadeInLeft {
                transform: translateX(0);
            }
            &.fadeOutRight {
                transform: translateX(100%);
            }
        }
    }
</style>
