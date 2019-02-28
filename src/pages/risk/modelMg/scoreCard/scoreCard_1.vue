 <template>
    <div class="pages_scoreCard relative" id="pages_scoreCard" ref="pages_scoreCard">
        <div class="featureWeight_add f_blue_res pointer pd_t_10 pd_b_10 noSelect inlineBlock" @click="addWeight" v-if="!!featureList.length && $route.query.type=='edit' && (sCForm.weightLock?true:!hasWeight) ">{{sCForm.featureWeight?'取消权重':'+添加权重'}}</div>
        <div class="scoreCard_bd">
            <el-form :model="sCForm" status-icon ref="sCForm" v-loading="loading" class="sCForm" v-if="$route.query.type=='edit'?true:!!featureList.length">
                <el-table ref="table" :data="featureList" class="scoreCardTable" border :header-row-class-name="'table_hd'" :header-cell-class-name="'table_th'" :row-class-name="'table_tr'" :cell-class-name="'table_td'" width="100%" :fit="true">
                    <el-table-column label="操作特征" width="80px" v-if="$route.query.type=='edit'">
                        <template slot-scope="scope">
                            <!-- <img class="plus pointer mg_r_20" :src="icon.plus" @click="feature_plus" alt="添加分类"> -->
                            <!-- <img class="remove pointer" :src="icon.remove" @click="feature_remove(scope.row,scope.$index)" alt="删除分类"> -->
                            <div class="icon_ plus pointer mg_r_20" @click="feature_plus" alt="添加分类"></div>
                            <div class="icon_ remove pointer" @click="feature_remove(scope.row,scope.$index)" alt="删除分类"></div>
                         </template>
                    </el-table-column>
                    <el-table-column label="权重" :width="$route.query.type=='edit'?'111px':'auto'" v-if="hasWeight?hasWeight:sCForm.featureWeight">
                        <template slot-scope="scope">
                            <el-input v-if="$route.query.type=='edit'" class="w90" :class="{'solid_red':vLock&&!scope.row.featureWeight}" v-model="scope.row.featureWeight" placeholder="权重" size="medium"  @keyup.native="scope.row.featureWeight=scope.row.featureWeight.replace(/[^\d.]/g,'')" clearable></el-input>
                            <span v-else>{{scope.row.featureWeight}}</span> 
                        </template>
                    </el-table-column> 
                    <el-table-column label="特征" :width="$route.query.type=='edit'?'411px':'auto'" :min-width="$route.query.type=='edit'?'none':'200px'" class-name="pd_b_0">
                        <template slot-scope="scope"> 
                            <!-- /** Jim修改于2018-10-12 10:54:33 @hidden：v-if掉让特征垂直居中 */  -->
                            <div class="frItem noBorder" v-for="(frItem,frIndex) in scope.row.featureRuleList" v-if="frIndex==0" :class="{'hidden':frIndex!=0}"> 
                                <div class="ruleConItem noBorder" v-for="(ruleCon,ruleConIndex) in frItem.rule.ruleContent">
                                    <!-- 变量名 -->
                                    <variableName class="" ref="variableName" :variableList="variableList" :icon="icon" :vLock="vLock" :feaItem="scope.row" :feaIndex="scope.$index" :frItem="frItem" :frIndex="frIndex" :ruleCon="ruleCon" :ruleConIndex="ruleConIndex" @changeRuleCon="changeRuleCon" @ruleCon_plus="ruleCon_plus" @ruleCon_remove="ruleCon_remove"/>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="特殊情况" :width="$route.query.type=='edit'?'180px':'130px'" :min-width="$route.query.type=='edit'?'310px':'60px'" class-name="text-top0">
                        <template slot-scope="scope">
                            <div class="exceptionScore mg_b_10">
                                异常：<el-input v-if="$route.query.type=='edit'" class="w120 inlineBlock" :class="{'solid_red':vLock&&!scope.row.exceptionScore}" v-model="scope.row.exceptionScore" placeholder="默认0" size="medium" resize="horizontal"  @keyup.native="scope.row.exceptionScore=scope.row.exceptionScore.replace(/[^\d.-]/g,'')" clearable></el-input>
                                <span v-else>{{scope.row.exceptionScore}}</span>
                            </div>
                            <div class="missScore">
                                其他：<el-input v-if="$route.query.type=='edit'" class="w120 inlineBlock" :class="{'solid_red':vLock&&!scope.row.missScore}" v-model="scope.row.missScore" placeholder="默认0" size="medium"  @keyup.native="scope.row.missScore=scope.row.missScore.replace(/[^\d.-]/g,'')" clearable></el-input>
                                <span v-else>{{scope.row.missScore}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="1?'条件':('条件'+hasAnyOpen+coeListWidth)" class-name="pd_b_0 td_term" :width="$route.query.type=='edit'?(hasAnyOpen?'930px':'550px'):'auto'" :min-width="$route.query.type=='edit'?'none':'200px'">
                        <template slot-scope="scope">
                            <div class="frItem" v-for="(frItem,frIndex) in scope.row.featureRuleList" :frIndex="frIndex">   
                                <div class="ruleConItem" :class="{'areaLine':frItem.rule.ruleContent.length>1}" v-for="(ruleCon,ruleConIndex) in frItem.rule.ruleContent" :ruleConIndex="ruleConIndex">   
                                    <template  v-if="$route.query.type=='look'">
                                        
                                    </template>
                                    <!-- 变量内容循环 -->
                                    <template>
                                        <variableCon class="" ref="variableCon" :icon="icon" :vLock="vLock" :feaItem="scope.row" :feaIndex="scope.$index" :frItem="frItem" :frIndex="frIndex" :ruleCon="ruleCon" :ruleConIndex="ruleConIndex" @featureRule_plus="featureRule_plus" @featureRule_remove="featureRule_remove" @ruleConOpr_plus="ruleConOpr_plus"/>
                                        <el-select class="w90 fr mg_r_20 ruleConLogic" :class="{'solid_red':vLock&&!frItem.rule.logic,'mg_t-20':frItem.rule.ruleContent.length%2==0}" v-model.number="frItem.rule.logic" placeholder="逻辑关系" size="medium" no-match-text="查询无结果" no-data-text="暂无数据" popper-class="stratList" v-if="frItem.rule.ruleContent.length>1&&ruleConIndex==(frItem.rule.ruleContent.length%2==1?((frItem.rule.ruleContent.length/2).toFixed()-1):(frItem.rule.ruleContent.length/2))">
                                            <el-option v-for="(varLogicItem,varLogicIndex) in varLogicList" :key="varLogicItem.id" :label="varLogicItem.name" :value="varLogicItem.id"><div class="stratOption overhide" :title="varLogicItem.name">{{varLogicItem.name}}</div></el-option>
                                        </el-select>
                                    </template>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="系数" :min-width="$route.query.type=='edit'?coeListWidth:'200px'" class-name="pd_b_0">
                        <template slot-scope="scope"> 
                            <div class="frItem" v-for="(frItem,frIndex) in scope.row.featureRuleList">
                                <!-- /** Jim修改于2018-10-12 10:54:33 @hidden：v-if掉让特征垂直居中 */  -->
                                <div class="ruleConItem" v-for="(ruleConItem,ruleConIndex) in frItem.rule.ruleContent" v-if="ruleConIndex==0" :class="{'hidden':ruleConIndex!=0}">
                                    <template v-if="$route.query.type=='edit'">
                                        <template v-for="(coeItem,coeIndex) in frItem.coefficientObject">
                                            <!-- 常量 -->
                                            <el-input v-if="coeItem.type==1" class="w90" :class="{'solid_red':vLock&&!coeItem.value}" v-model="coeItem.value" placeholder="数值" size="medium"  @keyup.native="coeItem.value=coeItem.value.replace(/[^\d.-]/g,'')" clearable></el-input>
                                            <!-- 变量名 -->
                                            <el-select v-if="coeItem.type==2" class="w90" :class="{'solid_red':vLock&&!coeItem.value}" v-model="coeItem.value" filterable placeholder="已有变量名" size="medium" no-match-text="查询无结果" no-data-text="暂无数据" popper-class="stratList">
                                                <el-option v-for="(varItem,varIndex) in variableList" :key="varIndex" :label="varItem.variableName" :value="varItem.variableId"><div class="stratOption overhide" :title="varItem.variableName">{{varItem.variableId}}{{varItem.variableName}}{{varItem.variableType}}</div></el-option>
                                            </el-select>
                                            <el-popover placement="top" v-model="coeItem.showSet" v-if="coeIndex>0">
                                                <coeMenu class="coeMenu" :id="'setImg_'+scope.$index+'_'+frIndex" :preType="frItem.coefficientObject[coeIndex-1].type" :preValue="frItem.coefficientObject[coeIndex-1].value" :curIndex="coeIndex" :frItem="frItem" @coeOprFn="coeOprFn"/>
                                                <div slot="reference" v-if="coeItem.value==')'" class="icon_ set pointer setImg" :id="'setImg_'+scope.$index+'_'+frIndex+'_'+coeIndex" alt="设置1"></div>
                                            </el-popover>
                                            <!-- 符号 -->
                                            <div v-if="coeItem.type==3" class="inlineBlock w20 text-center">{{coeItem.value}}</div>
                                        </template>
                                        <el-popover placement="top" v-model="frItem.showSet">
                                            <coeMenu class="coeMenu" :id="'setImg_'+scope.$index+'_'+frIndex" :preType="frItem.coefficientObject[frItem.coefficientObject.length-1].type" :preValue="frItem.coefficientObject[frItem.coefficientObject.length-1].value" :curIndex="frItem.coefficientObject.length" :frItem="frItem" @coeOprFn="coeOprFn"/>
                                            <div slot="reference" class="icon_ set pointer setImg" :id="'setImg_'+scope.$index+'_'+frIndex" alt="设置2"></div>
                                        </el-popover>
                                        <!-- <div class="icon_ set pointer setImg" :id="'setImg_'+scope.$index+'_'+frIndex" alt="设置2"></div> -->
                                        <!-- <img class="back pointer" :src="icon.back" @click="recoverCoe(frItem)" alt="撤销">  -->
                                        <div class="icon_ back pointer" @click="recoverCoe(frItem)" alt="撤销"></div>
                                    </template>
                                    <template v-else>
                                        <template v-for="(coeItem,coeIndex) in frItem.coefficientObject">
                                            <div class="inlineBlock" v-if="coeItem.type==2">{{getVarName(coeItem.value)}}</div>
                                            <div class="inlineBlock" v-else>{{coeItem.value}}</div>
                                        </template>
                                    </template>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-form-item class="text-center mg_t_20">
                    <el-button class="" type="primary" size="medium" @click="createFeature">保存</el-button>
                </el-form-item>
            </el-form>
            <noData img="noData" p2="暂无数据" v-else/>
        </div>
    </div>
</template>

<script>
let icon = {
    plus:require('img/icon/plus.png'),
    remove:require('img/icon/remove.png'),
    sort:require('img/icon/sort.png'),
    ruleConOpen:require('img/icon/ruleConOpen.png'),
    set:require('img/icon/set.png'),
    back:require('img/icon/back.png'),
}
import noData from 'components/pc/noData/noData'
import variableName from 'components/pc/policy/variableName_1'
import variableCon from 'components/pc/policy/variableCon_1'
import coeMenu from 'components/pc/coeList/coeMenu'
import Vue from 'vue'
import { Input, Button, Table, TableColumn, Form, FormItem, Select, Option, Cascader, Popover } from 'element-ui'
Vue.use(Input)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Popover)
export default {
    name: 'pages_scoreCard',
    data () {
        return {
            pageName: 'pages_scoreCard',icon,
            loading:true,
            /************************ 与variableName交互的数据 ************************/ 
            variableList:[],// 变量列表
            oprList:[{id:1,name:'='},{id:2,name:'!='},{id:3,name:'is null'},{id:4,name:'>'},{id:5,name:'>='},{id:6,name:'<'},{id:7,name:'<='},{id:8,name:'startsWith'},{id:9,name:'contains'}],
            oprList_str:[{id:1,name:'='},{id:2,name:'!='},{id:3,name:'is null'},{id:8,name:'startsWith'},{id:9,name:'contains'}],
            oprList_num:[{id:1,name:'='},{id:2,name:'!='},{id:4,name:'>'},{id:5,name:'>='},{id:6,name:'<'},{id:7,name:'<='}],
            oprList_bl:[{id:'1',name:'是'},{id:'0',name:'否'}],
            varLogicList:[{id:1,name:'AND'},{id:2,name:'OR'}],// 变量间逻辑关系
            /************************ scoreCard专用的数据 ************************/ 
            sCForm:{
                featureWeight:false,
                weightLock:true,
            },
            coe:{
                list:[//type:1常量、type:2变量、type:3符号
                    {
                        type: 2,
                        label: '新增变量',
                    },{
                        type: 1,
                        label: '新增数值',
                    },{
                        type: 'menu',
                        label: '新增操作符',
                        children: [{
                            type: 3,
                            label: '+',
                        },{
                            type: 3,
                            label: '-',
                        },{
                            type: 3,
                            label: 'x',
                        },{
                            type: 3,
                            label: '/',
                        },{
                            type: 3,
                            label: '( )',
                        }],
                    }
                ],
            },
            featureList:[],
            create:{
                moldId:this.$route.query.modelId,// 模型ID    Number  Y   
                featureList:[],
                // featureRuleList:[],// 特征规则列表  List    Y   
            },
            vLock:false,// 是否开启验证提示
            isNewNode:false,// 是否是新节点
        }
    },
    computed:{
        hasWeight() {
            return this.featureList.some((feaItem,feaIndex)=>{
                return !!feaItem.featureWeight;
            })
        },
        hasAnyOpen() {// 整个table是否有条件展开
            return this.featureList.some((feaItem,feaIndex)=>{
                return feaItem.featureRuleList.some((frItem,frIndex)=>{
                    return frItem.rule.ruleContent.some((rcItem,rcIndex)=>{
                        // console.log(2,rcIndex,rcItem.content.length,rcItem);
                        if(rcItem.variableType==5){// 枚举类型
                            return false;
                        }else{                            
                            return rcItem.content&&rcItem.content.length>1;
                        }
                    })
                })
            })
        },
        coeListWidth() {// 计算系数单元格的总宽度
            let widthSum = 206;
            let widthArr = [];
            this.featureList.map((feaItem,feaIndex)=>{
                feaItem.featureRuleList.map((frItem,frIndex)=>{
                    let frWidth = 0;
                    frItem.coefficientObject.map((coeItem,coeIndex)=>{
                        if(coeItem.type==1||coeItem.type==2){
                            frWidth += 90;
                        }else if(coeItem.value==')'){
                            frWidth += 66;
                        }else{
                            frWidth += 20;                            
                        }
                    })
                    widthArr.push(frWidth);
                })
            })
            let maxInwidthArr = Math.max.apply(Math, widthArr);
            console.log('widthArr',widthArr,'maxInwidthArr',maxInwidthArr)
            widthSum += maxInwidthArr;
            return widthSum;
        },
    },
    components:{
        noData,variableName,variableCon,coeMenu,
    },
    created () {
        console.time('mounted')
        this.getVariableList();// 获取本产品线变量列表
    },
    mounted() {
        console.timeEnd('mounted')
        console.time('updated')     
    },
    updated() {
        console.timeEnd('updated')
    },
    methods:{
        addWeight() {
            if(this.sCForm.weightLock){
                this.featureList.map((feaItem,feaIndex)=>{
                    feaItem.featureWeight = 1;
                })
            }
            this.sCForm.featureWeight=!this.sCForm.featureWeight
        },
        /************************ scoreCardForm表单验证&&表单保存&&表单重置 ************************/ 
        createFeature() {        
            // console.log(888,this.create,comApi.infiniteLoop.obj(this.create))
            this.create.featureList = this.featureList;
            /*comApi.infiniteLoop.obj(this.create)&&*/axios({
                url:'/mcs/scorecard/feature/create',
                timeout:60000,
                data:this.create,
                successMsg:'提交成功',
                loadingDom:'.scoreCard_bd',
                loadingText:'评分卡提交中……',
                // debug:true,
                // ret:0,
            },()=>{
                this.$router.push('/risk/modelMg/modelList');
            })
        },
        scrollToLeft() {/** Jim修改于2018-06-25 16:48:21 @自动滚动到最左侧 */  
                document.querySelector('.pages_scoreCard').style.width = this.$refs.table.$refs.bodyWrapper.scrollWidth+200+'px';   
                this.$refs.table.$el.style.width = this.$refs.table.$refs.bodyWrapper.scrollWidth+200+'px';      
            setTimeout(()=>{       
                document.getElementById('pages_scoreCard').scrollLeft = document.getElementById('pages_scoreCard').scrollWidth - document.getElementById('pages_scoreCard').clientWidth;
                console.log(document.getElementById('pages_scoreCard').scrollLeft,document.getElementById('pages_scoreCard').scrollWidth,document.getElementById('pages_scoreCard').clientWidth)
            },100)    
        },
        coeList(e,frItem,coeItem,coeIndex) {
            let curIndex = !!coeIndex?coeIndex:frItem.coefficientObject.length;
            let preIndex = curIndex-1;
            let preValue = frItem.coefficientObject[preIndex].value;
            let preType = frItem.coefficientObject[preIndex].type;
            console.log(frItem,'现',coeItem,coeIndex,'前',preType,preValue,preIndex)
            // console.log(111,this.$refs.pages_scoreCard.scrollHeight,this.$refs.pages_scoreCard.scrollTop,document.documentElement.scrollTop,e)
            let scrollTop = document.documentElement.scrollTop;
            let scrollLeft = this.$refs.pages_scoreCard.scrollWidth;
            if(!document.getElementById('cascader_'+e.target.id)){// 当前弹窗不存在时再打开
                let _self = this;
                let coeData = {
                    id:e.target.id,
                    style:{top:!!preType&&preType!=3?(e.y-212+scrollTop+'px'):(e.y-250+scrollTop+'px'),left:scrollLeft+e.screenX-40+'px'},
                    preType,
                    preValue,
                }
                this.$cascader(coeData,(item)=>{
                    if(!!item){
                        console.table(Object.entries(item))
                        this.coeOprFn(item,curIndex,frItem,preType,preIndex);                 
                    }
                })                  
            }         
        },
        coeOprFn(item,curIndex,frItem,preType) {
            console.log(item,curIndex,frItem,preType)
            frItem.coeHistory.push(JSON.parse(JSON.stringify(frItem.coefficientObject)));// 保存系数操作历史记录
            switch(item.type){//type:1常量、type:2变量、type:3符号
                case 3:switch(item.label){// 选择符号
                        case '( )':// 选择()
                            console.log('选择()')
                            frItem.coefficientObject.splice(curIndex,0,{type:item.type,value:'(',showSet:false},{type:item.type,value:')',showSet:false})
                            break;
                        default:// 选择+-*/
                            console.log('选择+-*/')
                            frItem.coefficientObject.splice(curIndex,0,{type:item.type,value:item.label,showSet:false})
                            break;
                        };
                    this.scrollToLeft();  
                    break;
                case 'menu':
                    break;
                default :// 选择变量常量
                    switch(preType){
                        case 3:// 前一位是符号：新增
                            console.log('前一位是符号：新增')
                            frItem.coefficientObject.splice(curIndex,0,{type:item.type,value:'',showSet:false})
                            break;
                        default:// 前一位是变量常量：转换
                            console.log('前一位是变量常量：转换')
                            frItem.coefficientObject[frItem.coefficientObject.length-1].type = item.type;
                            frItem.coefficientObject[frItem.coefficientObject.length-1].value = '';
                            frItem.coefficientObject[frItem.coefficientObject.length-1].showSet = false;
                            break;
                    }
                    this.scrollToLeft();  
                    break;
            }
            this.resetShowSet(frItem);
        },
        recoverCoe(frItem) {// 操作系数
            this.resetShowSet();
            if(!!frItem.coeHistory.length){
                frItem.coefficientObject = frItem.coeHistory[frItem.coeHistory.length-1];  
                frItem.coeHistory.pop();// 删除系数操作最后一次历史记录              
            }else{
                this.$notify({// 通知提示
                    message: '没有历史记录了',
                    type: 'warning'
                })  
                // frItem.coefficientObject = [{type:1,value:''}];
            }
        },
        resetShowSet(frItem) {
            frItem.showSet = false;
            frItem.coefficientObject.map(item=>{item.showSet = false})            
        },
        changeRuleCon(feaItem,frIndex,rCItem,rCIndex) {// 改变规则内容之变量            
            // console.table(Object.entries(ruleCon))
            feaItem.featureRuleList.map((frCell,fri)=>{
                frCell.rule.ruleContent.map((ruleConItem,ruleConIndex)=>{
                    if(ruleConIndex==rCIndex){
                        console.log('pages_scoreCard：changeRuleCon：',ruleConIndex,rCIndex,'|',ruleConItem.variableType)
                        Object.keys(rCItem).map((varItem,varIndex)=>{
                            ruleConItem[varItem] = rCItem[varItem]
                        })
                        ruleConItem.operationArray = [];// 操作符 Array Y多选
                        ruleConItem.logic = '';
                        ruleConItem.content = [{// 规则内容    List    Y   
                            operation:'',// 操作符 Number  Y   1: 等于, 2: 不等于, 3: is null, 4: 大于, 5: 大于或等于, 6: 小于, 7: 小于或等于,8:以...开始,9包含
                            operationValue:'',// 操作值 String  Y   不超过255
                            valueDescription:'',// 操作值描述   Numbrt  Y   1：与，2：或
                            sort:'',// 顺序  Number  N   
                        }];  
                        this.$nextTick(()=>{// 解决operation已有值情况下，修改variableType=5时，导致operationArray已注册，但operation残留的问题
                            this.getVarType(ruleConItem,ruleConIndex,0);
                        })                         
                    }         
                })
            })
        }, 
        ruleCon_plus(feaItem,frItem) {// 添加变量  
            feaItem.featureRuleList.map((fr)=>{
                let ruleConEmpty = {// 特征规则列表  List    Y      
                    variableId:'',// 变量ID    Number  Y   不超过255
                    variableName:'',// 变量名 String  Y   不超过255
                    variableType:'',//变量类型    Number  N   1：字符串(==、!=、is null、startsWith、contains)，2：整型，3：浮点型，4：日期型(排除is nll+startsWith+contains)，5：枚举(多选)，6：布尔型(是否)
                    oprList:[],// 注册oprList操作符列表
                    logic:'',// 逻辑操作    Numbrt  Y   1：与，2：或
                    operationArray:[],// 操作符 Array Y多选
                    content:[{// 规则内容    List    Y   
                        operation:'',// 操作符 Number  Y   1: 等于, 2: 不等于, 3: is null, 4: 大于, 5: 大于或等于, 6: 小于, 7: 小于或等于,8:以...开始,9包含
                        operationValue:'',// 操作值 String  Y   不超过255
                        valueDescription:'',// 操作值描述   Numbrt  Y   1：与，2：或
                        sort:'',// 顺序  Number  N   
                    }]
                } 
                fr.rule.ruleContent.push(ruleConEmpty);                
            })
        },
        ruleCon_remove(feaItem,ruleCon,ruleConIndex) {// 添加规条目
            feaItem.featureRuleList.map((fr,frIndex)=>{
                console.log(fr,frIndex,ruleConIndex)
                fr.rule.ruleContent.splice(ruleConIndex,1);
                if(fr.rule.ruleContent.length<1){
                    let ruleConEmpty = {// 空条件    List    Y   
                        variableId:'',// 变量ID    Number  Y   不超过255
                        variableName:'',// 变量名 String  Y   不超过255
                        variableType:'',// 变量类型 Number  N   1：字符串，2：整型，3：浮点型，4：日期型，5：枚举，6：布尔型
                        logic:1,// 逻辑操作    Numbrt  Y   1：与，2：或
                        oprList:[],// 注册oprList操作符列表
                        operationArray:[],// 操作符 Array Y多选
                        content:[{// 规则内容    List    Y   
                            operation:'',// 操作符 Number  Y   不超过255
                            operationValue:'',// 操作值 String  Y   不超过255
                            valueDescription:'',// 操作值描述   Numbrt  Y   1：与，2：或
                            sort:'',// 顺序  Number  N   
                        }],// 注册操作符数组
                    }
                    fr.rule.ruleContent.push(ruleConEmpty);  
                    !fr.rule.ruleContent[0].variableName&&this.$notify({// 通知提示
                        message: '不能再删了',
                        type: 'warning'
                    })  
                }
            })
        }, 
        /************************ 与variableCon交互的方法 ************************/ 
        featureRule_plus(feaItem,frItem,frIndex){// 添加条件
            const ruleConTmpl = frItem.rule.ruleContent[0];
            let frEmpty = {// 特征规则列表  List    Y  
                coe:{show:false},// 系数操作      
                coefficientObject:[{type:1,value:'',showSet:false}],// 系数  Float   N   
                showSet:false,
                coeHistory:[],// 系数  Float   N   
                sort:'',// 顺序  Number  N   
                rule:{// 规则内容    List    Y   
                    logic:1,// 逻辑操作    Numbrt  Y   1：与，2：或
                    ruleContent:[]
                }
            }
            frItem.rule.ruleContent.map((ruleConItem,ruleConIndex)=>{
                let ruleConEmpty = {// 空条件    List    Y   
                    variableId:'',// 变量ID    Number  Y   不超过255
                    variableName:'',// 变量名 String  Y   不超过255
                    variableType:'',// 变量类型 Number  N   1：字符串，2：整型，3：浮点型，4：日期型，5：枚举，6：布尔型
                    logic:'',// 逻辑操作    Numbrt  Y   1：与，2：或
                    oprList:[],// 注册oprList操作符列表
                    operationArray:[],// 操作符 Array Y多选
                    content:[{// 规则内容    List    Y   
                        operation:'',// 操作符 Number  Y   不超过255
                        operationValue:'',// 操作值 String  Y   不超过255
                        valueDescription:'',// 操作值描述   Numbrt  Y   1：与，2：或
                        sort:'',// 顺序  Number  N   
                    }],// 注册操作符数组
                }
                Object.keys(ruleConItem).map((varItem,varIndex)=>{
                    if(varItem!='operationArray'&&varItem!='content'){/** Jim修改于2018-10-10 11:03:14 @解决了ruleCon的错配问题，及添加新项的插入位置问题 */
                        ruleConEmpty[varItem] = ruleConItem[varItem]
                    }
                })
                frEmpty.rule.ruleContent.push(ruleConEmpty);
            })
            feaItem.featureRuleList.push(frEmpty);
        },
        featureRule_remove(feaItem,frItem,frIndex){// 删除条件
            feaItem.featureRuleList.splice(frIndex,1);
            if(feaItem.featureRuleList.length<1){
                this.featureRule_plus(feaItem,frItem)    
                !feaItem.sort&&this.$notify({// 通知提示
                    message: '不能再删了',
                    type: 'warning'
                })  
            }            
        },
        ruleConOpr_plus(ruleCon){// 添加操作符及操作值
            if(ruleCon.content.length>1){// 有两个操作符
                ruleCon.content.pop();
            }else{// 小于两个操作符
                ruleCon.operationArray = [];// 操作符 Array Y多选
                ruleCon.content.push({
                    operation:'',// 操作符 Number  Y   不超过255
                    operationValue:'',// 操作值 String  Y   不超过255
                    valueDescription:'',// 操作值描述   Numbrt  Y   1：与，2：或
                    sort:'',// 顺序  Number  N   
                })
            }
            setTimeout(()=>{
                console.log('【展开】',this.$refs.table.$refs.bodyWrapper.scrollWidth)  
                document.querySelector('.pages_scoreCard').style.width = this.$refs.table.$refs.bodyWrapper.scrollWidth+'px';   
                this.$refs.table.$el.style.width = this.$refs.table.$refs.bodyWrapper.scrollWidth+'px';                 
            },300)
        },
        feature_plus(){// 添加特征
            let feaEmpty = {   
                // featureName:'',// 特征名称    String  Y   
                featureWeight:'',// 特征权重    Float   N   
                exceptionScore:'',// 异常时系数   Float   N   
                missScore:'',// 其他情况系统  Float   N   
                featureRuleList:[{// 特征规则列表  List    Y     
                    coe:{show:false},// 系数操作       
                    coefficientObject:[{type:1,value:'',showSet:false}],// 系数  Float   N  
                    showSet:false,
                    coeHistory:[],// 系数  Float   N   
                    sort:'',// 顺序  Number  N   
                    'rule':{// 规则内容    List    Y   
                        logic:1,// 逻辑操作    Numbrt  Y   1：与，2：或
                        ruleContent:[{// 特征规则列表  List    Y  
                            variableId:'',// 变量ID    Number  Y   不超过255
                            variableName:'',// 变量名 String  Y   不超过255
                            variableType:'',//变量类型    Number  N   1：字符串(==、!=、is null、startsWith、contains)，2：整型，3：浮点型，4：日期型(排除is nll+startsWith+contains)，5：枚举(多选)，6：布尔型(是否)
                            oprList:[],// 注册oprList操作符列表
                            logic:1,// 逻辑操作    Numbrt  Y   1：与，2：或
                            operationArray:[],// 操作符 Array Y多选
                            content:[{// 规则内容    List    Y   
                                operation:'',// 操作符 Number  Y   1: 等于, 2: 不等于, 3: is null, 4: 大于, 5: 大于或等于, 6: 小于, 7: 小于或等于,8:以...开始,9包含
                                operationValue:'',// 操作值 String  Y   不超过255
                                valueDescription:'',// 操作值描述   Numbrt  Y   1：与，2：或
                                sort:'',// 顺序  Number  N   
                            }],
                        }],
                    }, 
                }], 
            }
            this.featureList.push(feaEmpty)
        },
        feature_remove(item,index){// 移除特征
            this.featureList.splice(index,1);
            if(this.featureList.length<1){
                console.log(this.featureList,!this.featureList)
                !this.featureList.length&&this.$notify({// 通知提示
                    message: '不能再删了',
                    type: 'warning'
                })     
                this.feature_plus() 
            }
        },
        getFeatureList(){
            let  _self = this;
            axios({
                url:'/mcs/scorecard/feature/list',
                data:{
                    moldId:_self.create.moldId
                },
                loadingDom:'.scoreCard_bd',
                loadingText:'特征列表加载中……',
                // debug:true,
                // ret:0,
            },res=>{
                console.time('getFeatureList')
                this.setScroll();
                if(!!res.data.featureList.length){
                    res.data.featureList.map((feaItem,feaIndex)=>{
                        feaItem.featureRuleList.map((frItem,frIndex)=>{
                            frItem.coeHistory = [];// 系数操作历史记录
                            frItem.coefficientObject.map(item=>{
                                item.showSet = false;
                            })
                            frItem.showSet = false;
                            frItem.rule.ruleContent.map(async (ruleConItem,ruleConIndex)=>{
                                ruleConItem.sort = ruleConIndex;
                                ruleConItem.operationArray = ruleConItem.content.map(conItem=>conItem.operationValue);// 渲染枚举型
                                ruleConItem.oprList = [];// 注册oprList操作符列表
                                this.getVarType(ruleConItem,ruleConIndex,0,frItem,frIndex,(oprList)=>{// 获取变量类型及相应的操作符列表 
                                    // console.log(111,oprList)
                                    ruleConItem.oprList = oprList;
                                })
                            })                        
                        })
                    })
                    const hasWeight = res.data.featureList.some((feaItem,feaIndex)=>{
                        // console.log(feaIndex,feaItem.featureWeight)
                        return !!feaItem.featureWeight;
                    })
                    if(hasWeight){// 如果有任何一个权重值
                        this.sCForm.weightLock = false;// 关闭权重锁
                    }
                    this.featureList = res.data.featureList;
                }else{
                    this.feature_plus()
                }
                this.loading = false;
                console.timeEnd('getFeatureList')
            },err=>{

            })
        },
        setScroll() {         
            this.$nextTick(()=>{                        
                this.$refs.table.$refs.bodyWrapper.style.overflow = 'initial';
            })   
            setTimeout(()=>{
                console.log('【table】2',this.$refs.table.$refs.bodyWrapper.scrollWidth)      
                document.querySelector('html').style.overflow = 'hidden';                
                document.querySelector('.pages_modelMg').style.height = window.innerHeight-document.querySelector('.pages_hd').scrollHeight-document.querySelector('.pages_ft').scrollHeight-document.querySelector('.pages_breadcrumb').scrollHeight+'px';     
                document.querySelector('.pages_modelMg').style.overflow = 'auto';
                document.querySelector('.pages_scoreCard').style.width = this.$refs.table.$refs.bodyWrapper.scrollWidth+'px';   
                this.$refs.table.$el.style.width = this.$refs.table.$refs.bodyWrapper.scrollWidth+'px';                       
            },300)
            window.vm = this;
        },
        /************************ variableName需要的数据 ************************/ 
        getVariableList (item) {// 3.2.5查询变量列表
            let _self = this;
            axios({
                url:'/mcs/variable/config/list',
                data:{
                    appId:_self.$route.query.appId,//产品线ID   Number  N    
                },
                // debug:true,
                // ret:0,
            },(res)=>{        
                this.variableList = res.data.variableList;
                !this.isNewNode&&this.getFeatureList();// getFeatureList依赖variableList
            },(err)=>{

            });
        }, 
        /************************ 与variableName交互的方法 ************************/       
        getVarType(ruleConItem,ruleConIndex,index,frItem,frIndex,callBack) {            
            // console.log(this.pageName+'：getVarType：',ruleConItem)
            this.variableList.map((varItem)=>{
                if(ruleConItem.variableId==varItem.variableId){
                    ruleConItem.variableName = varItem.variableName;
                    ruleConItem.variableType = varItem.variableType;
                    // console.table(Object.entries(varItem))
                    if(varItem.variableType==1){// 1：字符串(==、!=、is null、startsWith、contains)
                        ruleConItem.oprList = this.oprList_str;
                    }else if(varItem.variableType==2||varItem.variableType==3||varItem.variableType==4){// 2：整型，3：浮点型，4：日期型(排除is nll+startsWith+contains)
                        ruleConItem.oprList = this.oprList_num;                        
                    }else if(varItem.variableType==5){// 5：枚举(多选)，
                        /*frIndex==0&&*/this.getOprList_enumList(ruleConItem,ruleConIndex,index,frItem,frIndex,callBack);// 获取变量枚举值列表
                    }else if(varItem.variableType==6){// 6：布尔型(是否)
                        ruleConItem.oprList = this.oprList_bl;
                    }else{                 
                        this.$notify({// 通知提示
                            message: '未知变量',
                            type: 'warning'
                        })                        
                    }
                }
            })
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
        getOprList_enumList(ruleConItem,ruleConIndex,index,frItem,frIndex,callBack) {// 3.2.12获取变量枚举值列表
            // console.table(Object.entries(ruleConItem))
            axios({
                url:'/mcs/variable/enums',
                data:{
                    variableId:ruleConItem.variableId,// 变量ID  Number  Y   
                },
                loadingDom:'.operation_'+ruleConItem.variableId,//  如果varItem.variableType==5枚举(多选)，则需要多loading一次/** Jim修改于2018-10-09 18:47:36 @bug:如果一个特征，多个条件，loading只能第一个，并且无法消失 */
                loadingText:'枚举列表加载中……',
                // debug:true,
                // ret:0,
            },(res)=>{
                ruleConItem.oprList = res.data.enumList.map((cell)=>{
                    cell.id = cell.enumValue;
                    cell.name = cell.enumName;
                    return cell;
                })
                callBack(ruleConItem.oprList);
                // console.log(this.pageName+'： getOprList_enumList ：',ruleConItem.oprList)
            },(err)=>{

            });         
        },
    },
    beforeDestroy() {
        console.log('销毁前')
        document.querySelector('html').style.overflow = '';                
        document.querySelector('.pages_modelMg').style.height = '';     
        document.querySelector('.pages_modelMg').style.overflow = '';
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.pages_scoreCard_1{
    margin:0 0px -40px -40px;
    padding:20px 0 40px 40px;
/*    *{
        transition: all 0.2s ease;
    }*/
    .scoreCardTable.el-table{
        /*width: fit-content;*/
        width:100%;
        max-width: none;
        .table_hd{
            th{padding:8px 0;}
        }
        .table_td{
            padding-top:12px;
            .cell{padding:0;}
        }

    }
    .stratList{// 策略下拉列表
        width:310px;
    }
    .pages_variableName{
        overflow: hidden;
        padding-bottom: 12px;        
    }
    .frItem{
        border-bottom:1px solid #ededed;
        margin-bottom: 12px;
        text-align: left;
        &:last-child{
            border-bottom:0;
            margin-bottom: 0;
        }
    }
    .ruleConItem{ 
        position: relative;
        /*overflow: hidden;*/// 为了显示条件范围虚线
        height:40px;
        padding: 0 10px;
        .ruleConItemCell{
            position: relative;
            float: left;
            margin-top: 0;
            .operationArray{// 枚举类型超出隐藏
                .el-tag{
                    .el-select__tags-text{
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        max-width: 85px;
                        vertical-align: bottom;
                        display: inline-block;                                                   
                    }
                }
            }
            .ruleConOpen{// 展开所有变量操作符及操作值的图标
                line-height: 30px;
                margin-right:10px;
                transform: rotate(-90deg);
                img.bottom{
                    transform: rotate(180deg);
                }
            }
        }
        .ruleConOpr{
            line-height: 30px;
        }
        .set,.back{
            margin:5px;
        }
        &.areaLine{// 多个条件
            &:before{
                content:"";
                height:1px;
                border-top:1px dashed #E4E7F2;
                position: absolute;
                top:16px;
                left:10px;
                right:190px;
            }
            .ruleConLogic{
                &.mg_t-20{
                    margin-top: -19px;
                }   
                &:before{                    
                    content: "";/** Jim修改于2018-09-28 18:20:28 @.ruleConOpr垂直居中后，不需要了 */
                    width: 20px;
                    height: 1px;
                    border-top: 1px dashed #E4E7F2;
                    position: absolute;
                    left: -20px;
                    top: 16px;
                }                
            }      
            .ruleConOpr{
                /*margin-top: 20px;*/
            }   
        }
    }
    
    .table_tr{// 为了显示条件范围虚线
        .td_term{
            .frItem{
                position: relative;
                &:before{// 纵向虚线
                    content:"";
                    width: 1px;
                    border-left:1px dashed #E4E7F2;
                    position: absolute;
                    top:18px;
                    bottom:25px;
                    right:188px;                  
                }            
            }            
        }
        .ruleConItemCell{
            background:#fff;
            transition: all 0.3s ease;
        }  
        &:hover{// 悬停背景颜色附和表格
            .ruleConItemCell{
                background:#F0FAFF;
            }            
        }
    }  
    /** Jim修改于2018-09-28 18:10:33 @组件样式冲突 */
    .pages_variableCon .ruleConItemCell:first-child{
        margin-left: 0;
        margin-top: 0; 
    }
}
</style>
