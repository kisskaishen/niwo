<template>
    <div class="inlineBlock" v-if="$route.query.type=='look'">
        <span >{{getVarName(ruleCon.variableId)}}</span>
    </div>
    <div v-else>
        <div class="pages_variableName" v-if="$route.name=='scoreCard'">
            <!-- 变量名 -->
            <el-select class="w310 mg_r_10 fl" :class="{'solid_red':vLock&&!ruleCon.variableId}" v-model="ruleCon.variableId" filterable placeholder="请输入已有变量名" size="medium" no-match-text="查询无结果" no-data-text="暂无数据" popper-class="stratList" @change="$emit('changeRuleCon',feaItem,frIndex,ruleCon,ruleConIndex)" :disabled="($route.query.type=='look')" @visible-change="dropdown">
                <el-option v-for="(varItem,varIndex) in variableListOne" :key="varItem.variableId" :label="varItem.variableName" :value="varItem.variableId"><div class="stratOption overhide" :title="varItem.variableName">{{varItem.variableName}}</div></el-option>
            </el-select>
            <!-- 变量添加删除排序按钮 -->
            <div class="ruleConOpr fr" v-if="($route.query.type=='edit'||$route.query.type=='add')">
                <!-- <img class="plus pointer mg_r_10" :src="icon.plus" @click="$emit('ruleCon_plus',feaItem,frItem)" alt="添加变量" :class="{'hidden':ruleConIndex!=0}"> -->
                <!-- <img class="remove pointer" :src="icon.remove" @click="$emit('ruleCon_remove',feaItem,ruleCon,ruleConIndex)" alt="删除变量"> -->
                <div class="icon_ plus pointer mg_r_10" @click="$emit('ruleCon_plus',feaItem,frItem)" alt="添加变量" :class="{'hidden':ruleConIndex!=0}"></div>
                <div class="icon_ remove pointer" @click="$emit('ruleCon_remove',feaItem,ruleCon,ruleConIndex)" alt="删除变量"></div>
            </div>
        </div>
        <div class="pages_variableName" v-else>
            <!-- 变量名 -->
            <el-select class="w310 mg_r_10 fl" :class="{'solid_red':vLock&&!ruleCon.variableId}" v-model="ruleCon.variableId" filterable placeholder="请输入已有变量名" size="medium" no-match-text="查询无结果" no-data-text="暂无数据" popper-class="stratList" @change="$emit('changeRuleCon',ruleCon,ruleConIndex,index)" :disabled="($route.query.type=='look')">
                <el-option v-for="(varItem,varIndex) in variableList" :key="varItem.variableId" :label="varItem.variableName" :value="varItem.variableId"><div class="stratOption overhide" :title="varItem.variableName">{{varItem.variableName}}</div></el-option>
            </el-select>
            <!-- 变量添加删除排序按钮 -->
            <div class="ruleConOpr fr" v-if="($route.query.type=='edit'||$route.query.type=='add')">
                <!-- <img class="plus pointer mg_r_10" :src="icon.plus" @click="$emit('ruleCon_plus',item,index)" alt="添加变量"> -->
                <!-- <img class="remove pointer" :src="icon.remove" @click="$emit('ruleCon_remove',item,ruleCon,ruleConIndex)" alt="删除变量"> -->
                <div class="icon_ plus pointer mg_r_10" @click="$emit('ruleCon_plus',item,index)" alt="添加变量"></div>
                <div class="icon_ remove pointer" @click="$emit('ruleCon_remove',item,ruleCon,ruleConIndex)" alt="删除变量"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'pages_variableName',
    data () {
        return {
            pageName: 'pages_variableName',
            dropdownOpen:false,
        }
    },
    computed:{
        variableListOne() {
            if(this.dropdownOpen){
                return this.variableList;
            }else{
                return this.variableList.filter(item=>item.variableId==this.ruleCon.variableId)
            }
        },
    },
    props:["variableList","icon","vLock","item","index",'feaItem','feaIndex','frItem','frIndex',"ruleCon","ruleConIndex"],
    created () {
        
    },
    methods:{  
        dropdown(msg) {
            this.dropdownOpen = msg;
        },
        getVarName(id) {
            let varName = '';
            this.variableList.map((varItem)=>{
                if(id==varItem.variableId){
                    console.log(id,varItem.variableName)
                    varName = varItem.variableName;
                }
            })
            return varName;
        },         
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.pages_variableName{
  
}
</style>
