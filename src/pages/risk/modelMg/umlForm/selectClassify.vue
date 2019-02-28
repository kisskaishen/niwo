<template>
    <div class="pages_selectClassify pd_t_20">
        <el-form class="selectClassify" :model="selectClassify" status-icon ref="selectClassify" v-if="!!selectClassify.policyList.length">            
            <el-form-item class="classifyItem" :label="$route.query.type=='look'?'分类：':'请选择分类：'" prop="lineValue">
                <el-radio-group v-model.number="selectClassify.lineValue">
                    <el-radio v-for="(item,index) in selectClassify.policyList" @change="changeRadio(item,index)"  @click.native="clearRadio(item,index)" :key="index" :label="item.id" v-if="$route.query.type=='look'?(selectClassify.lineValue==item.id):true">{{item.policyName}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <div class="text-center" v-if="$route.query.type!='look'">
                <el-button class="" type="primary" size="medium" @click="saveSelectClassify">保存</el-button>
            </div>
        </el-form>        
        <noData img="noData" p2="暂无配置分类" v-else/>
    </div>
</template>

<script>
import noData from 'components/pc/noData/noData'
import Vue from 'vue'
import { Form, FormItem, Button, Radio, RadioGroup, Select, Option } from 'element-ui'
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Select)
Vue.use(Option)
export default {
    name: 'pages_selectClassify',
    data () {
        return {
            pageName: 'pages_selectClassify',
            selectClassify:{
                nodeId:'',// 连线所连分类器节点ID
                lineId:'',// 连线ID
                lineValue:'',// 连线绑定值ID：分类ID  Number  Y   
                valueDescription:'',// 值描述：分类名称    Number  Y
                categoryName:'',   
                policyList:[],
                nodetype:'line',// 用于撤销恢复
            },
        }
    },
    components:{
        noData,
    },
    created () {
        this.selectClassify.nodeId = this.$route.query.nodeId;
        this.selectClassify.lineId = this.$route.query.lineId;
        this.getClassifyNode();// 获取分类列表     
    },
    methods:{
        initLineForm() {     
            if(!!this.$route.query.lineValue&&this.$route.query.lineValue!='undefined'){
                this.selectClassify.lineValue = this.$route.query.lineValue*1;   
                const selectedVal = this.selectClassify.policyList.filter(item=>this.$route.query.lineValue==item.id)[0].policyName;
                this.selectClassify.valueDescription = selectedVal;                 
            }
        },
        hasRepeatClassify(data) {
            let curNodeLiens = [];
            jsPlumb.getConnections().map(item=>{
                if(item.sourceId.slice(4)==this.$route.query.nodeId){
                    curNodeLiens.push(item);
                }
            })
            console.log('当前节点的连线',curNodeLiens,'所有分类',data.policyList)
            curNodeLiens.map((cell,j)=>{
                console.log('点击线',this.$route.query.lineValue,'线'+j+'：'+cell.canvas.dataset.linevalue)
                if(!!cell.canvas.dataset.linevalue&&this.$route.query.lineValue!=cell.canvas.dataset.linevalue){
                    data.policyList = data.policyList.filter(item=>item.id!=cell.canvas.dataset.linevalue)
                }
            })
        },
        updateLineValue (oldData,newData) {
            // console.log(11111111,oldData.policyList,newData.policyList)
            if(oldData){
                newData.policyList.map((item,index)=>{
                    if(oldData.policyList[index]){
                        item.oldId = oldData.policyList[index].id;
                    }
                })
                jsPlumb.getConnections().map(cell=>{                  
                    newData.policyList.map((item,index)=>{
                        // console.log(index,cell.canvas.dataset.linevalue,item.oldId)
                        if(cell.canvas.dataset.linevalue==item.oldId){
                            // console.log('【更新线条ID】','现:',cell.canvas.dataset.linevalue,'缓存:',item.oldId,'新:',item.id)
                            cell.canvas.dataset.linevalue=item.id;
                            this.ajaxPush.updateLine(cell);// 3.2.40模型配置—连线
                        }                        
                    })
                    if(cell.canvas.dataset.selected=="1"){
                        this.$route.query.lineValue = cell.canvas.dataset.linevalue;// 更新没有显示在url中
                    }   
                })                   
            }
        },
        getClassifyNode () {// 3.2.40模型配置—查看分类器节点
            let _self = this;
            this.$post('/mcs/node/category/query',{
                nodeId:this.selectClassify.nodeId,// 节点ID    Number  Y
            })
                .then(res=>{
                    if(!!res){// 老节点
                        res.policyList.map((item)=>{
                            item.policyShow = false;//  默认不展开
                            item.ruleList = [];// 预先注册ruleContent
                        });
                        res.policyList.push({id:-1,policyName:'其他'})
                        Object.assign(this.selectClassify,res)
                        // this.updateLineValue(this.selectClassify,res.data);/** Jim修改于2018-11-02 18:50:35 @导致删除连线，再连线选择分类，ID更新错误 */
                        this.initLineForm();
                        this.hasRepeatClassify(this.selectClassify);
                    }
                    {// 撤销恢复：记录绑定的初始版本
                        this.selectClassify.clear = !res;
                        let data = JSON.parse(JSON.stringify(this.selectClassify))
                        this.$emit('firstBindLine',data)
                    }
                })
            // axios({
            //     url:'/mcs/node/category/query',
            //     data:{
            //         nodeId:this.selectClassify.nodeId,// 节点ID    Number  Y
            //     },
            //     loadingDom:'.classifyItem',
            //     // debug:true,
            //     // ret:0,
            // },(res)=>{
            //     if(!!res.data){// 老节点
            //         res.data.policyList.map((item)=>{
            //             item.policyShow = false;//  默认不展开
            //             item.ruleList = [];// 预先注册ruleContent
            //         });
            //         res.data.policyList.push({id:-1,policyName:'其他'})
            //         Object.assign(this.selectClassify,res.data)
            //         // this.updateLineValue(this.selectClassify,res.data);/** Jim修改于2018-11-02 18:50:35 @导致删除连线，再连线选择分类，ID更新错误 */
            //         this.initLineForm();
            //         this.hasRepeatClassify(this.selectClassify);
            //     }
            //     {// 撤销恢复：记录绑定的初始版本
            //         this.selectClassify.clear = !res.data;
            //         let data = JSON.parse(JSON.stringify(this.selectClassify))
            //         this.$emit('firstBindLine',data)
            //     }
            // });
        },
        clearRadio(item,index,e) {
            if(this.selectClassify.lineValue==item.id){
                console.log('清除选中',item,index);
                this.selectClassify.lineValue='';
                this.selectClassify.valueDescription = '';
            }
        },
        changeRadio(item,index) {
            if(!!item){
                console.log('选择分类',item,index+1)
                this.selectClassify.valueDescription = item.policyName;
            }else{
                console.log('选择其他')
                this.selectClassify.valueDescription = '其他';  
            }
        },
        saveSelectClassify () {
            let data = JSON.parse(JSON.stringify(this.selectClassify))
            this.$emit('saveForm',data);// 关闭弹窗 
        },
        saveSelectClassify0 () {/** Jim修改于2018-11-19 10:40:55 @saveForm在记录动作时，会请求该接口，所以本处请求暂停使用 */
        this.$post('/mcs/node/line/update',{
            id:this.selectClassify.lineId,// 连线ID    Number  Y
            lineValue:this.selectClassify.lineValue,// 连线绑定值   Number  Y
            valueDescription:this.selectClassify.valueDescription,// 值描述 Number  Y
        })
            .then(res=>{
                this.$emit('saveForm',this.selectClassify);// 关闭弹窗
            })
            // axios({
            //     url:'/mcs/node/line/update',
            //     data:{
            //         id:this.selectClassify.lineId,// 连线ID    Number  Y
            //         lineValue:this.selectClassify.lineValue,// 连线绑定值   Number  Y
            //         valueDescription:this.selectClassify.valueDescription,// 值描述 Number  Y
            //     },
            //     // loadingDom:'.uml_bd',
            //     loadingText:'修改连线中……',
            //     debug:true,
            //     // ret:0,
            // },(res)=>{
            //     this.$emit('saveForm',this.selectClassify);// 关闭弹窗
            // })
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.pages_selectClassify{
    min-width:453px;
    .selectClassify{
        .classifyItem{
            .el-form-item__label{
                float:none;
            }
            .el-form-item__content{
                padding-left:30px;
                .el-radio-group{
                    .el-radio{
                        display: table-row;
                        line-height: 40px;
                    }
                }
            }
        }
    }
  
}
</style>
