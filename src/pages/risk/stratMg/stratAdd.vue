<template>
    <div class="pages_stratAdd">
        <el-form :model="stratAddForm" status-icon :rules="rules" ref="stratAddForm" class="stratAddForm">
            <el-form-item :label="$route.query.type=='edit'?'产品线：':'选择产品线：'" class="productList">
                <el-select v-model="stratAddForm.appId" filterable placeholder="请选择" size="medium" :disabled="$route.query.type=='edit'">
                    <el-option v-for="(item,index) in productList" :key="item.appId" :label="item.productName" :value="item.appId"></el-option>
                </el-select>
            </el-form-item>
            <div class="stratAddForm_bd">
                <!-- 新建规则 -->
                <stratForm ref="stratForm" :policyType="0" :appId="stratAddForm.appId" :variableListUml="variableList" :policyListUml="policyList"/>
            </div>
        </el-form>
    </div>
</template>

<script>
import stratForm from '../modelMg/umlForm/stratForm'
export default {
    name: 'pages_stratAdd',
    data () {
        return {
            pageName: 'pages_stratAdd',
            variableList:[],// 变量列表
            stratAddForm:{
                appId:'',                
            },
            rules:{},
        }
    },
    props:['productList','policyList'],
    components:{ stratForm },
    created () {
        if(this.$route.query.type=='edit'){
            this.stratAddForm.appId = this.$route.query.appId;
        }        
    },
    methods:{

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
.pages_stratAdd{
    .stratAddForm{
        padding-top:30px;  
        padding-right: 30px;
        margin-bottom: 22px !important;
        .stratAddForm_bd{
            padding:0 40px 40px;
            border:1px solid #E4E7F2;
        }      
    }
}
#app .el-input.is-disabled, #app .el-input.is-disabled *{
    background: #fff;
}
</style>
