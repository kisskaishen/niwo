<template>
    <div class="pages_variableCon" :class="{'fr':$route.query.type=='look'}">
        <template v-if="$route.query.type=='look'">
            <span class="ruleConItemCell" :class="{'mg_t_10':varConIndex>0&&$route.query.type!='look'}"
                  v-for="(varCon,varConIndex) in ruleCon.content"
                  v-if="((ruleCon.variableType==5||ruleCon.variableType==6)?(varConIndex==0):true)">
                <span v-if="ruleCon.variableType!=5&&varConIndex==1" class="mg_l_10 mg_r_10">{{ruleCon.logic==1?'AND':'OR'}}</span>
                <div class="variableType5 w300" v-if="ruleCon.variableType==5&&varConIndex==0">
                    <span v-for="(item,index) in ruleCon.content">{{item.valueDescription}}
                        <template v-if="index<ruleCon.content.length-1">、</template>
                    </span>
                </div>
                <span v-else>{{varCon.valueDescription}}</span>
                <span v-if="ruleCon.variableType!=5&&ruleCon.variableType!=6">{{varCon.operationValue}}</span>
            </span>
        </template>
        <!-- 变量内容循环 -->
        <template v-else>
            <div class="ruleConItemCell overhide0" :class="{'mg_t_10':varConIndex>0&&$route.query.type!='look'}"
                 v-for="(varCon,varConIndex) in ruleCon.content"
                 v-if="((ruleCon.variableType==5||ruleCon.variableType==6)?(varConIndex==0):true)">

                <!-- 变量内容：间逻辑关系【1：与，2：或】(varConIndex==1第二行才显示) -->
                <el-select class="w110 mg_r_10 fl" :class="{'solid_red':vLock&&!ruleCon.logic}"
                           v-model.number="ruleCon.logic" placeholder="逻辑关系" size="small" no-match-text="查询无结果"
                           nS-data-text="暂无数据" popper-class="stratList" v-if="ruleCon.variableType!=5&&varConIndex==1"
                           @change="changeOpr(varCon,varConIndex)" :disabled="($route.query.type=='look')">
                    <el-option v-for="(varLogicItem,varLogicIndex) in varLogicList" :key="varLogicItem.id"
                               :label="varLogicItem.name" :value="varLogicItem.id">
                        <div class="stratOption overhide0" :title="varLogicItem.name">{{varLogicItem.name}}</div>
                    </el-option>
                </el-select>
                <!-- 变量内容：操作符[枚举]可多选 -->
                <el-select class="mg_r_10 fl operationArray" ref="operationArray"
                           v-model="ruleCon.operationArray" multiple
                           v-if="ruleCon.variableType==5&&varConIndex==0" @change="changeOpr(varCon,varConIndex)"
                           :style="{width:hasAnyOpen?'620px':'220px'}">
                    <!-- multiple/collapse-tags枚举多选 -->
                    <el-option v-for="(oprItem,oprIndex) in ruleCon.oprList" :key="oprItem.id" :label="oprItem.name"
                               :value="oprItem.id">
                        <div class="stratOption overhide0" :title="oprItem.name">{{oprItem.name}}</div>
                    </el-option>
                </el-select>
                <!--<el-select class="mg_r_10 fl operationArray" ref="operationArray"-->
                <!--:class="vLock&&ruleCon.operationArray.length>0?('solid_red operation_'+ruleCon.variableId+'_'+frIndex):'operation_'+ruleCon.variableId+'_'+frIndex"-->
                <!--v-model="ruleCon.operationArray" :data-index="varConIndex" placeholder="枚举值" size="small"-->
                <!--no-match-text="查询无结果" no-data-text="暂无数据" popper-class="stratList" multiple-->
                <!--v-if="ruleCon.variableType==5&&varConIndex==0" @change="changeOpr(varCon,varConIndex)"-->
                <!--:disabled="($route.query.type=='look')" :style="{width:hasAnyOpen?'620px':'220px'}">-->
                <!--&lt;!&ndash; multiple/collapse-tags枚举多选 &ndash;&gt;-->
                <!--<el-option v-for="(oprItem,oprIndex) in ruleCon.oprList" :key="oprItem.id" :label="oprItem.name"-->
                <!--:value="oprItem.id">-->
                <!--<div class="stratOption overhide0" :title="oprItem.name">{{oprItem.name}}</div>-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!-- 变量内容：操作符[布尔] -->
                <el-select class="w110 mg_r_10 fl overhide" :class="{'solid_red':vLock&&!varCon.operationValue}"
                           v-model="varCon.operationValue" placeholder="布尔值" size="small" no-match-text="查询无结果"
                           no-data-text="暂无数据" popper-class="stratList" @change="changeOpr(varCon,varConIndex)"
                           :disabled="($route.query.type=='look')" v-else-if="ruleCon.variableType==6">
                    <el-option v-for="(oprItem,oprIndex) in ruleCon.oprList" :key="oprItem.id" :label="oprItem.name"
                               :value="oprItem.id">
                        <div class="stratOption overhide" :title="oprItem.name">{{oprItem.name}}</div>
                    </el-option>
                </el-select>

                <!-- 变量内容：操作符[普通](初始内容显示id是因为模拟数据提供的id不能超出筛选庵后的oprList) -->
                <el-select class="w110 mg_r_10 fl overhide0" :class="{'solid_red':vLock&&!varCon.operation}"
                           v-model.number="varCon.operation" placeholder="操作符" size="small" no-match-text="查询无结果"
                           no-data-text="暂无数据" popper-class="stratList" @change="changeOpr(varCon,varConIndex)"
                           :disabled="($route.query.type=='look')" v-else>
                    <!-- multiple/collapse-tags枚举多选 -->
                    <el-option v-for="(oprItem,oprIndex) in ruleCon.oprList" :key="oprItem.id" :label="oprItem.name"
                               :value="oprItem.id">
                        <div class="stratOption overhide0" :title="oprItem.name">{{oprItem.name}}</div>
                    </el-option>
                </el-select>
                <!-- 变量内容：操作值 -->
                <!-- 1：字符串，2：整型，3：浮点型，4：日期型，5：枚举，6：布尔型 -->
                <el-input class="w110 mg_r_10 fl" :class="{'solid_red':vLock&&!varCon.operationValue}"
                          v-model="varCon.operationValue" placeholder="操作值" size="small"
                          v-if="ruleCon.variableType==1&&varCon.operation!=3" :disabled="($route.query.type=='look')"
                          clearable></el-input>
                <el-input class="w110 mg_r_10 fl" :class="{'solid_red':vLock&&!varCon.operationValue}"
                          v-model="varCon.operationValue" placeholder="整数" size="small"
                          v-else-if="ruleCon.variableType==2"
                          @keyup.native="varCon.operationValue=varCon.operationValue.replace(/[^-\d]/g,'')"
                          :disabled="($route.query.type=='look')" clearable></el-input>
                <el-input class="w110 mg_r_10 fl" :class="{'solid_red':vLock&&!varCon.operationValue}"
                          v-model="varCon.operationValue" placeholder="数字" size="small"
                          v-else-if="ruleCon.variableType==3"
                          @keyup.native="varCon.operationValue=varCon.operationValue.replace(/[^-\d.]/g,'')"
                          :disabled="($route.query.type=='look')" clearable></el-input>
                <el-date-picker class="w150 mg_r_10 fl" :class="{'solid_red':vLock&&!varCon.operationValue}"
                                v-model="varCon.operationValue" placeholder="日期" size="small"
                                v-else-if="ruleCon.variableType==4" type="date" :editable="false" format="yyyy-MM-dd"
                                value-format="timestamp" :disabled="($route.query.type=='look')"
                                clearable></el-date-picker>
                <!-- <el-input class="w110 mg_r_10 fl flf5" :class="{'solid_red':vLock&&!varCon.operationValue}" v-model="varCon.operationValue" placeholder="操作值" size="small" v-else-if="ruleCon.variableType!=5" :disabled="($route.query.type=='look')" clearable></el-input> -->
                <!-- 展开所有变量操作符及操作值(分类策略规则：位置中间) -->
                <div class="ruleConOpen fl" @click="$emit('ruleConOpr_plus',ruleCon)"
                     v-if="(ruleCon.variableType!=5&&ruleCon.variableType!=6)&&varConIndex==0&&$route.name!='scoreCard'&&($route.query.type=='edit'||$route.query.type=='add')">
                    <!-- <img class="pointer" :class="{'bottom':ruleCon.content.length>1}" :src="icon.ruleConOpen" alt="展开"> -->
                    <div class="icon_ arrow pointer" :class="{'bottom':ruleCon.content.length>1}" alt="展开1"></div>
                </div>
                <!-- 展开所有变量操作符及操作值(评分卡：位置最后) -->
                <div class="ruleConOpen fl" @click="$emit('ruleConOpr_plus',ruleCon)"
                     v-if="(ruleCon.variableType!=5&&ruleCon.variableType!=6)&&varConIndex==(ruleCon.content.length-1)&&$route.name=='scoreCard'&&($route.query.type=='edit'||$route.query.type=='add')">
                    <!-- <img class="pointer" :class="{'bottom':ruleCon.content.length>1}" :src="icon.ruleConOpen" alt="展开"> -->
                    <div class="icon_ arrow pointer" :class="{'bottom':ruleCon.content.length>1}" alt="展开2"></div>
                </div>
            </div>
            <!-- 变量添加删除排序按钮 -->
            <div class="ruleConOpr fr"
                 v-if="$route.name=='scoreCard'&&($route.query.type=='edit'||$route.query.type=='add')">
                <!-- <img class="plus pointer mg_r_10" :src="icon.plus" @click="$emit('featureRule_plus',feaItem,frItem,frIndex)" alt="添加条件"> -->
                <!-- <img class="remove pointer" :src="icon.remove" @click="$emit('featureRule_remove',feaItem,frItem,frIndex)" alt="删除条件"> -->
                <div class="icon_ plus pointer mg_r_10" @click="$emit('featureRule_plus',feaItem,frItem,frIndex)"
                     title="评分卡添加条件"></div>
                <div class="icon_ remove pointer" @click="$emit('featureRule_remove',feaItem,frItem,frIndex)"
                     title="评分卡删除条件"></div>
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        name: 'pages_variableCon',
        data() {
            return {
                pageName: 'pages_variableCon',
                varLogicList: [{id: 1, name: 'AND'}, {id: 2, name: 'OR'}],// 变量间逻辑关系
            }
        },
        computed: {
            curRuleCon() {
                return this.ruleCon;
                // return this.$route.name=='scoreCard'?this.feaItem.featureRuleList[0].rule.ruleContent[0]:this.ruleCon;
            },
        },
        props: ["icon", "vLock", 'feaItem', 'feaIndex', 'frItem', 'frIndex', "ruleCon", "ruleConIndex", "hasAnyOpen"],
        created() {

        },
        methods: {
            getOprName(id, oprList) {
                let varName = '';
                oprList.map((varItem) => {
                    if (id == varItem.id) {
                        // console.log(id, varItem.name)
                        varName = varItem.name;
                    }
                })
                return varName;
            },
            getOprNameList(id, oprList) {
                // console.log(888, id, oprList)
                let varName = [];
                oprList.map((varItem) => {
                    if (id == varItem.id) {
                        // console.log(id, varItem.name)
                        varName.push(varItem.name);
                    }
                })
                return varName;
            },
            changeOpr(varCon, varConIndex) {// 修改操作符/** Jim修改于2018-10-09 18:34:00 @bug:新增条件，选择后vue不能同步数据，做其他操作后，新增条件的数据才能同步上，怀疑是因为属性注册相关问题引起的 */
                this.$nextTick(() => {
                    // console.log(this.ruleCon.operationArray.length)
                    if (this.ruleCon.variableType == 5) {// 枚举
                        if (this.ruleCon.operationArray.length) {
                            this.ruleCon.logic = 2;
                            this.ruleCon.content = [];
                            this.ruleCon.operationArray.map((item, index) => {
                                const oprName = this.ruleCon.oprList.filter(opr => opr.id == item)[0].name;
                                // console.log('【已选枚举id数组】', index, oprName, item)
                                let contentEmpty = {// 规则内容    List    Y
                                    operation: 1,// 操作符 Number  Y   不超过255
                                    operationValue: '',// 操作值 String  Y   不超过255
                                    valueDescription: '',// 操作值描述   Numbrt  Y   1：与，2：或
                                    sort: '',// 顺序  Number  N
                                }
                                contentEmpty.operationValue = item;
                                contentEmpty.valueDescription = oprName;
                                contentEmpty.sort = index;
                                this.ruleCon.content.push(contentEmpty)
                            })
                        } else {
                            let contentEmpty = {// 规则内容    List    Y
                                operation: 1,// 操作符 Number  Y   不超过255
                                operationValue: '',// 操作值 String  Y   不超过255
                                valueDescription: '',// 操作值描述   Numbrt  Y   1：与，2：或
                                sort: '',// 顺序  Number  N
                            }
                            this.ruleCon.content.push(contentEmpty)
                        }
                        // console.log('枚举操作符', this.ruleCon, varConIndex)
                        // console.table(Object.entries(varCon))
                    } else if (this.ruleCon.variableType == 6) {        // 布尔型
                        this.ruleCon.operationArray = [];
                        varCon.operation = 1;
                        varCon.valueDescription = this.ruleCon.oprList.filter(item => item.id == varCon.operationValue)[0].name;
                        // console.log('布尔操作符', this.ruleCon, varConIndex)
                        // console.table(Object.entries(varCon))
                    } else {
                        if (varCon.operation == 3) {
                            varCon.operationValue = '';
                        }
                        // console.log(this.ruleCon)
                        // console.log(this.ruleCon.oprList)
                        this.ruleCon.operationArray = [];
                        varCon.valueDescription = this.ruleCon.oprList.filter(item =>
                            item.id == varCon.operation)[0].name;
                        // console.log('普通操作符', this.ruleCon, varConIndex)
                        // console.table(Object.entries(varCon))
                    }
                })
            },
        },
        watch: {
            curRuleCon(val) {
                console.log(val)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    .pages_variableCon {
        &.fr { /** Jim修改于2018-10-23 16:22:44 @用于查看模式 */
            margin-top: -40px;
        }
        .ruleConItemCell {
            min-height: 40px;
            /*line-height: 46px;*/
            &:first-child {
                margin-left: 323px;
                /*margin-top: -40px;*/
            }
            .operationArray {
                /*line-height: 40px;*/
                min-height: 40px;

            }
        }
        .mg_t-20 {
            margin-top: -19px;
        }
        .variableType5 {
            position: absolute;
            top: -10px;
            right: 0;
            overflow-x: auto;
            overflow-y: hidden;
            height: 40px;
            &::-webkit-scrollbar {
                width: 20px;
                height: 6px;
            }
            &::-webkit-scrollbar-thumb { /* 滑块颜色 */
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 5px;
                &:hover { // 滑块悬浮
                    background-color: rgba(0, 0, 0, 0.5);
                }
            }
        }
    }
</style>
