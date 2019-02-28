<template>
    <div class="pages_variableCon" :class="{'inlineBlock':$route.query.type=='look'}">
        <!-- 变量内容循环 -->
        <div class="ruleConItemCell overhide0" :class="{'mg_t_10':varConIndex>0&&$route.query.type!='look','inlineBlock text-top':$route.query.type=='look'}" v-for="(varCon,varConIndex) in ruleCon.content" :key="varConIndex" v-if="(ruleCon.variableType==5||ruleCon.variableType==6)?(varConIndex==0):true">            
            <template v-if="$route.query.type=='look'">
                <span v-if="ruleCon.variableType!=5&&varConIndex==1" class="mg_l_10 mg_r_10">{{ruleCon.logic==1?'AND':'OR'}}</span>
                <span v-if="ruleCon.variableType==5&&varConIndex==0">
                    <span v-for="item in getOprNameList(varCon.operation,ruleCon.oprList)">{{item}}</span>
                </span>
                <span v-else>{{getOprName(varCon.operation,ruleCon.oprList)}}</span>
                <span>{{varCon.operationValue}}</span>
            </template>
            <template v-else>
                <!-- 变量内容：间逻辑关系【1：与，2：或】(varConIndex==1第二行才显示) -->
                <el-select :popper-append-to-body="true" class="w110 mg_r_10 fl" :class="{'solid_red':vLock&&!ruleCon.logic}" v-model.number="ruleCon.logic" placeholder="逻辑关系" size="medium" no-match-text="查询无结果" nS-data-text="暂无数据" popper-class="stratList" v-if="ruleCon.variableType!=5&&varConIndex==1" @change="changeOpr" :disabled="($route.query.type=='look')">
                    <el-option v-for="(varLogicItem,varLogicIndex) in varLogicList" :key="varLogicItem.id" :label="varLogicItem.name" :value="varLogicItem.id"><div class="stratOption overhide0" :title="varLogicItem.name">{{varLogicItem.name}}</div></el-option>
                </el-select>
                <!-- 变量内容：操作符[枚举] -->
                <el-select :popper-append-to-body="true" class="w200 mg_r_10 fl operationArray" :class="vLock&&!ruleCon.operationArray.length?('solid_red operation_'+ruleCon.variableId):'operation_'+ruleCon.variableId" :data-id="'operation_'+ruleCon.variableId" v-model="ruleCon.operationArray" :data-index="varConIndex" placeholder="操作符" size="medium" no-match-text="查询无结果" no-data-text="暂无数据" popper-class="stratList" multiple collapse-tags v-if="ruleCon.variableType==5&&varConIndex==0" @change="changeOpr" :disabled="($route.query.type=='look')">
                    <!-- multiple/collapse-tags枚举多选 -->
                    <el-option v-for="(oprItem,oprIndex) in ruleCon.oprList" :key="oprItem.id" :label="oprItem.name" :value="oprItem.id"><div class="stratOption overhide0" :title="oprItem.name">{{oprItem.name}}</div></el-option>
                </el-select>

               <el-select class="w110 mg_r_10 fl overhide" :class="{'solid_red':vLock&&!varCon.operation}" :id="'operation_'+ruleCon.variableId" v-model.number="varCon.operation" placeholder="操作符" size="medium" no-match-text="查询无结果" no-data-text="暂无数据" popper-class="stratList" @change="changeOpr" :disabled="($route.query.type=='look')" v-else-if="ruleCon.variableType==6">
                    <el-option v-for="(oprItem,oprIndex) in ruleCon.oprList" :key="oprItem.id" :label="oprItem.name" :value="oprItem.id"><div class="stratOption overhide" :title="oprItem.name">{{oprItem.name}}</div></el-option>
                </el-select>

                <!-- 变量内容：操作符[普通](初始内容显示id是因为模拟数据提供的id不能超出筛选庵后的oprList) -->   
                <el-select :popper-append-to-body="true" class="w110 mg_r_10 fl overhide0" :class="{'solid_red':vLock&&!varCon.operation}" :id="'operation_'+ruleCon.variableId" v-model.number="varCon.operation" placeholder="操作符" size="medium" no-match-text="查询无结果" no-data-text="暂无数据" popper-class="stratList" @change="changeOpr" :disabled="($route.query.type=='look')" v-else>
                    <!-- multiple/collapse-tags枚举多选 -->
                    <el-option v-for="(oprItem,oprIndex) in ruleCon.oprList" :key="oprItem.id" :label="oprItem.name" :value="oprItem.id"><div class="stratOption overhide0" :title="oprItem.name">{{oprItem.name}}</div></el-option>
                </el-select>
                <!-- 变量内容：操作值 -->
                <!-- 1：字符串，2：整型，3：浮点型，4：日期型，5：枚举，6：布尔型 -->
                <el-input class="w110 mg_r_10 fl" :class="{'solid_red':vLock&&!varCon.operationValue}" v-model="varCon.operationValue" placeholder="操作值" size="medium" v-if="ruleCon.variableType==1&&varCon.operation!=3" :disabled="($route.query.type=='look')" clearable></el-input>
                <el-input class="w110 mg_r_10 fl" :class="{'solid_red':vLock&&!varCon.operationValue}" v-model="varCon.operationValue" placeholder="整数" size="medium" v-else-if="ruleCon.variableType==2" @keyup.native="varCon.operationValue=varCon.operationValue.replace(/[^\d]/g,'')" :disabled="($route.query.type=='look')" clearable></el-input>
                <el-input class="w110 mg_r_10 fl" :class="{'solid_red':vLock&&!varCon.operationValue}" v-model="varCon.operationValue" placeholder="数字" size="medium" v-else-if="ruleCon.variableType==3" @keyup.native="varCon.operationValue=varCon.operationValue.replace(/[^\d.]/g,'')" :disabled="($route.query.type=='look')" clearable></el-input>
                <el-date-picker class="w150 mg_r_10 fl" :class="{'solid_red':vLock&&!varCon.operationValue}" v-model="varCon.operationValue" placeholder="日期" size="medium" v-else-if="ruleCon.variableType==4" type="date" :editable="false" format="yyyy-MM-dd" value-format="timestamp" :disabled="($route.query.type=='look')" clearable></el-date-picker>
                <!-- <el-input class="w110 mg_r_10 fl flf5" :class="{'solid_red':vLock&&!varCon.operationValue}" v-model="varCon.operationValue" placeholder="操作值" size="medium" v-else-if="ruleCon.variableType!=5" :disabled="($route.query.type=='look')" clearable></el-input> -->
                <!-- 展开所有变量操作符及操作值(分类策略规则：位置中间) -->
                <div class="inlineBlock ruleConOpen" @click="$emit('ruleConOpr_plus',ruleCon)" v-if="(ruleCon.variableType!=5&&ruleCon.variableType!=6)&&varConIndex==0&&$route.name!='scoreCard'&&($route.query.type=='edit'||$route.query.type=='add')">
                    <!-- <img class="pointer" :class="{'bottom':ruleCon.content.length>1}" :src="icon.ruleConOpen" alt="展开"> -->
                    <div class="icon_ arrow pointer" :class="{'bottom':ruleCon.content.length>1}" alt="展开1"></div>
                </div>
                <!-- 展开所有变量操作符及操作值(评分卡：位置最后) -->
                <div class="inlineBlock ruleConOpen" @click="$emit('ruleConOpr_plus',ruleCon)" v-if="(ruleCon.variableType!=5&&ruleCon.variableType!=6)&&varConIndex==(ruleCon.content.length-1)&&$route.name=='scoreCard'&&($route.query.type=='edit'||$route.query.type=='add')">
                    <!-- <img class="pointer" :class="{'bottom':ruleCon.content.length>1}" :src="icon.ruleConOpen" alt="展开"> -->
                    <div class="icon_ arrow pointer" :class="{'bottom':ruleCon.content.length>1}" alt="展开2"></div>
                </div>
            </template>
        </div>
        <!-- 变量添加删除排序按钮 -->
        <div class="ruleConOpr fr" v-if="$route.name=='scoreCard'&&($route.query.type=='edit'||$route.query.type=='add')" :class="{'hidden':ruleConIndex!=0}">
            <!-- <img class="plus pointer mg_r_10" :src="icon.plus" @click="$emit('featureRule_plus',feaItem,frItem,frIndex)" alt="添加条件"> -->
            <!-- <img class="remove pointer" :src="icon.remove" @click="$emit('featureRule_remove',feaItem,frItem,frIndex)" alt="删除条件"> -->
            <div class="icon_ plus pointer mg_r_10" @click="$emit('featureRule_plus',feaItem,frItem,frIndex)" alt="添加条件"></div>
            <div class="icon_ remove pointer" @click="$emit('featureRule_remove',feaItem,frItem,frIndex)" alt="删除条件"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'pages_variableCon',
    data () {
        return {
            pageName: 'pages_variableCon',
            varLogicList:[{id:1,name:'AND'},{id:2,name:'OR'}],// 变量间逻辑关系
        }
    },
    props:["icon","vLock",'feaItem','feaIndex','frItem','frIndex',"ruleCon","ruleConIndex"],
    created () {

    },
    methods:{    
        getOprName(id,oprList) {
            let varName = '';
            oprList.map((varItem)=>{
                if(id==varItem.id){
                    console.log(id,varItem.name)
                    varName = varItem.name;
                }
            })
            return varName;
        }, 
        getOprNameList(id,oprList) {
            let varName = [];
            oprList.map((varItem)=>{
                if(id==varItem.id){
                    console.log(id,varItem.name)
                    varName.push(varItem.name);
                }
            })
            return varName;
        },
        changeOpr(oprId) {// 修改操作符/** Jim修改于2018-10-09 18:34:00 @bug:新增条件，选择后vue不能同步数据，做其他操作后，新增条件的数据才能同步上，怀疑是因为属性注册相关问题引起的 */
            if(this.ruleCon.variableType==5){// 枚举
                if(this.ruleCon.operationArray.length){
                    this.ruleCon.logic = 2;
                    this.ruleCon.content = [];
                    this.ruleCon.operationArray.map((item,index)=>{
                        console.log(index,this.ruleCon.oprList[index].name)
                        let contentEmpty = {// 规则内容    List    Y   
                            operation:1,// 操作符 Number  Y   不超过255
                            operationValue:'',// 操作值 String  Y   不超过255
                            valueDescription:'',// 操作值描述   Numbrt  Y   1：与，2：或
                            sort:'',// 顺序  Number  N   
                        }
                        contentEmpty.operationValue = item;
                        contentEmpty.valueDescription = this.ruleCon.oprList[item].name;
                        contentEmpty.sort = index;
                        this.ruleCon.content.push(contentEmpty)
                    }) 
                }else{
                    let contentEmpty = {// 规则内容    List    Y   
                        operation:1,// 操作符 Number  Y   不超过255
                        operationValue:'',// 操作值 String  Y   不超过255
                        valueDescription:'',// 操作值描述   Numbrt  Y   1：与，2：或
                        sort:'',// 顺序  Number  N   
                    }
                    this.ruleCon.content.push(contentEmpty)
                }
                console.log('枚举操作符',this.ruleCon.content) 
            }else{
                this.ruleCon.content[0].valueDescription = this.$children[0].selectedLabel;
                console.log('普通操作符',oprId,this.ruleCon)
            }
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.pages_variableCon{
    .ruleConItemCell {
        height:40px;
        &:first-child {
            margin-left: 323px;
            margin-top: -40px;
        } 
    }     
}
</style>
