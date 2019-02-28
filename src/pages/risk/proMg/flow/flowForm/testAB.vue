<template>
    <div class="pages_testAb">
        <el-form class="testAb" :model="testAb" status-icon ref="testAb"> 
            <el-form-item label="B模型流量比率：">  
                <el-input class="w150" v-model="testAb.bValue" placeholder="小于1的两位小数" size="medium" @keyup.native="inputBValeu" clearable></el-input>
            </el-form-item>
            <el-form-item label="A模型流量比率： 1-B"></el-form-item>
            <div class="text-center" v-if="$route.query.type!='look'">
                <el-button class="" type="primary" size="medium" @click="bindTestAB">保存</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'pages_testAb',
    data () {
        return {
            pageName: 'pages_testAb',
            testAb:{
                nodeId:'',// 节点ID    Number  Y   
                nodeName:'',
                name:'',// ab测试节点名 String  Y   
                bValue:'',// B模型流量比率 Float   Y   小于1的浮点数，只需要保留小数点后两位
            },
            isNewNode:true,// 是否是新节点
        }
    },
    created () {
        this.queryTestAB();
    },
    methods:{
        inputBValeu() {            
            this.testAb.bValue=this.testAb.bValue.replace(/[^\d.]/g,'')
            if(this.testAb.bValue>1){
                this.testAb.bValue = 1;
            }
        },
        bindTestAB () {// 3.2.50模型配置--绑定AB测试节点  
            let _self = this;       
            let data = JSON.parse(JSON.stringify(this.testAb))
            data.nodeId = this.$route.query.nodeId.slice(4);   
            axios({
                url:'/mcs/node/tester/bind',
                data,
                debug:true,
                loadingDom:'.testAb',
                // ret:0,
            },(res)=>{
                data.nodeName = 'A/B测试';
                data.nodeId = this.$route.query.nodeId;
                this.$emit('saveForm',data);// 关闭弹窗
            },(err)=>{

            });
        }, 
        queryTestAB () {// 3.2.51模型配置—获取AB测试节点内容  
            let _self = this;        
            axios({
                url:'/mcs/node/tester/query',
                data:{
                    nodeId:this.$route.query.nodeId.slice(4),// 产品线ID   Number  Y   
                },
                loadingDom:'.testAb',
                // ret:0,
            },(res)=>{
                Object.assign(this.testAb,res.data)    
                {// 撤销恢复：记录绑定的初始版本
                    this.testAb.nodeName = 'A/B测试';
                    let data = JSON.parse(JSON.stringify(this.testAb))
                    data.clear = !res.data;
                    this.$emit('firstBindPush',data)
                }            
            },(err)=>{

            });
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.pages_testAb{
    min-width: 313px;
    padding-top:30px;
}
</style>
