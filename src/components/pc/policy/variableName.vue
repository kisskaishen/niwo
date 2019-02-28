<template>
    <div class="pages_variableName w300 overhide" v-if="$route.query.type=='look'"
         :title="getVarName(ruleCon.variableId)">
        {{getVarName(ruleCon.variableId)}}
    </div>
    <div v-else>
        <div class="pages_variableName" v-if="$route.name=='scoreCard'">
            <!-- 变量名 -->
            <el-select class="w270 mg_r_10 fl" :class="{'solid_red':vLock&&!ruleCon.variableId}"
                       :title="ruleCon.variableName" v-model="ruleCon.variableId" filterable placeholder="请输入已有变量名"
                       size="medium" no-match-text="查询无结果" no-data-text="暂无数据" popper-class="stratList"
                       @change="$emit('changeRuleCon',feaItem,frIndex,ruleCon,ruleConIndex)"
                       :disabled="($route.query.type=='look')" @visible-change="dropdown">
                <el-option v-for="(varItem,varIndex) in variableListOne" :key="varItem.variableId"
                           :label="varItem.variableName" :value="varItem.variableId">
                    <div class="stratOption overhide" :title="varItem.variableName">{{varItem.variableName}}</div>
                </el-option>
            </el-select>

            <!-- 变量添加删除排序按钮 -->
            <div class="ruleConOpr fr" v-if="($route.query.type=='edit'||$route.query.type=='add')">
                <div class="fl mg_r_10"
                     :class="{'mg_t-20':feaItem.fold?(frItem.rule.ruleContent.length%2==0):frItem.rule.ruleContent.length>1}"
                     v-if="frItem.rule.ruleContent.length>1&&ruleConIndex==(frItem.rule.ruleContent.length%2==1?((frItem.rule.ruleContent.length/2).toFixed()-1):(frItem.rule.ruleContent.length/2))">
                    {{frItem.rule.logic==1?'AND':'OR'}}
                    <div class="icon_ refresh pointer mg_l_5" :class="frItem.rule.logic==1?'rotate0':'rotate180'"
                         @click="feaRefresh"></div>
                </div>
                <!-- <img class="plus pointer mg_r_10" :src="icon.plus" @click="$emit('ruleCon_plus',feaItem,frItem)" alt="添加变量" :class="{'hidden':ruleConIndex!=0}"> -->
                <!-- <img class="remove pointer" :src="icon.remove" @click="$emit('ruleCon_remove',feaItem,ruleCon,ruleConIndex)" alt="删除变量"> -->
                <el-popover placement="right" v-model="ruleCon.addMenu" popper-class="addMenu" trigger="hover">
                    <ul class="addMenuList">
                        <li class="addMenuLi" @click="$emit('feature_plus',feaItem,feaIndex,ruleCon)">特征</li>
                        <li class="addMenuLi" @click="$emit('ruleCon_plus',feaItem,ruleCon,ruleConIndex)">变量</li>
                    </ul>
                    <div slot="reference" class="icon_ plus pointer mg_r_10" alt="添加变量2"></div>
                </el-popover>
                <!-- <el-popover placement="right" v-model="ruleCon.delMenu" popper-class="addMenu" trigger="hover">
                    <ul class="addMenuList">
                        <li class="addMenuLi" @click="$emit('feature_remove',feaItem,feaIndex,ruleCon)">删除特征</li>
                        <li class="addMenuLi" @click="$emit('ruleCon_remove',feaItem,ruleCon,ruleConIndex)">删除变量</li>
                    </ul>
                    <div slot="reference" class="icon_ remove pointer" alt="删除变量"></div>
                </el-popover> -->
                <!-- <div class="icon_ plus pointer mg_r_10" @click="$emit('ruleCon_plus',feaItem,frItem)" alt="添加变量1"  v-if="ruleConIndex!=0"></div> -->
                <div class="icon_ remove pointer"
                     @click="$emit('ruleCon_remove',feaItem,feaIndex,frItem,frIndex,ruleCon,ruleConIndex)"
                     alt="删除变量"></div>
            </div>
        </div>
        <div class="pages_variableName" v-else>
            <!-- 变量名 -->
            <el-select class="w310 mg_r_10 fl" :class="{'solid_red':vLock&&!ruleCon.variableId}"
                       :title="ruleCon.variableName" v-model="ruleCon.variableId" filterable placeholder="请输入已有变量名"
                       size="medium" no-match-text="查询无结果" no-data-text="暂无数据" popper-class="stratList"
                       @change="$emit('changeRuleCon',ruleCon,ruleConIndex,index)"
                       :disabled="($route.query.type=='look')">
                <el-option v-for="(varItem,varIndex) in variableList" :key="varItem.variableId"
                           :label="varItem.variableName" :value="varItem.variableId">
                    <div class="stratOption overhide" :title="varItem.variableName">{{varItem.variableName}}</div>
                </el-option>
            </el-select>
            <!-- 变量添加删除排序按钮 -->
            <div class="ruleConOpr fr" v-if="($route.query.type=='edit'||$route.query.type=='add')">
                <!-- <img class="plus pointer mg_r_10" :src="icon.plus" @click="$emit('ruleCon_plus',item,index)" alt="添加变量"> -->
                <!-- <img class="remove pointer" :src="icon.remove" @click="$emit('ruleCon_remove',item,ruleCon,ruleConIndex)" alt="删除变量"> -->
                <div class="icon_ plus pointer mg_r_10" @click="$emit('ruleCon_plus',item,ruleConIndex)"
                     alt="添加变量"></div>
                <div class="icon_ remove pointer" @click="$emit('ruleCon_remove',item,ruleCon,ruleConIndex)"
                     alt="删除变量"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'pages_variableName',
        data() {
            return {
                pageName: 'pages_variableName',
                dropdownOpen: false,
            }
        },
        computed: {
            variableListOne() {
                if (this.dropdownOpen) {
                    return this.variableList;
                } else {
                    return this.variableList.filter(item => item.variableId == this.ruleCon.variableId)
                }
            },
        },
        props: ["variableList", "icon", "vLock", "item", "index", 'feaItem', 'feaIndex', 'frItem', 'frIndex', "ruleCon", "ruleConIndex"],
        created() {

        },
        methods: {
            dropdown(msg) {
                this.dropdownOpen = msg;
            },
            getVarName(id) {
                let varName = '';
                this.variableList.map((varItem) => {
                    if (id == varItem.variableId) {
                        // console.log(id, varItem.variableName)
                        varName = varItem.variableName;
                    }
                })
                return varName;
            },
            feaRefresh() {
                // this.feaItem.featureRuleList.map((frItem,frIndex)=>{/** Jim修改于2018-10-29 11:21:49 @不兼容老数据 */
                // frItem.rule.logic=frItem.rule.logic==1?2:1;
                // })
                if (this.feaItem.featureRuleList[0].rule.logic == 1) {
                    this.feaItem.featureRuleList.map((frItem, frIndex) => {
                        frItem.rule.logic = 2;
                    })
                } else {
                    this.feaItem.featureRuleList.map((frItem, frIndex) => {
                        frItem.rule.logic = 1;
                    })
                }
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    .el-popover.addMenu {
        padding: 0;
        border-radius: 0;
        min-width: 100px;
        .addMenuList {
            text-align: center;
            .addMenuLi {
                cursor: pointer;
                line-height: 36px;
                &:hover {
                    color: #fff;
                    background: #40BDEC;
                }
            }
        }
    }

    .pages_variableName {
        z-index: 9;
        .mg_t-20 {
            margin-top: -19px;
        }
        .ruleConOpr {
            line-height: 30px;
            z-index: 99;
        }
    }
</style>
