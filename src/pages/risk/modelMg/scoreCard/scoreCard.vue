<template>
    <div class="pages_scoreCard relative" id="pages_scoreCard" ref="pages_scoreCard">
        <div class="uml_hd">
            <div class="titleDiv" v-if="$route.query.type=='edit'">
                <p>模型名称：
                    <el-input v-model="modelAdd.moldName" size="small"
                              @blur="modelNameChange(modelAdd.moldName)"></el-input>
                </p>

                <p>模型编码：{{modelAdd.moldCode}}</p>
                <el-popover
                    placement="right-start"
                    title="备注"
                    width="300"
                    trigger="hover"
                    v-model="visible">
                    <!--:content="(content.remark)">-->
                    <el-input type="textarea" v-model="modelAdd.remark"
                              style="width: 280px;white-space: normal;word-break: break-all"></el-input>
                    <div class="btnDiv"
                         style="display: flex;justify-content: center;align-items: center;margin-top: 16px">
                        <el-button size="small" @click="visible=false">取消</el-button>
                        <el-button type="primary" size="small" @click="modelNameChange(modelAdd.remark)">保存</el-button>
                    </div>
                    <span slot="reference">备注信息：<i></i></span>
                </el-popover>
            </div>
            <div class="titleDiv" v-if="$route.query.type=='look'">
                <p>模型名称：{{modelAdd.moldName}}</p>

                <p>模型编码：{{modelAdd.moldCode}}</p>
                <el-popover
                    placement="right-start"
                    title="备注"
                    width="300"
                    trigger="hover">
                    <!--:content="(content.remark)">-->
                    <p style="max-width: 280px;white-space: normal;word-break: break-word;">{{modelAdd.remark}}</p>
                    <span slot="reference">备注信息：<i></i></span>
                </el-popover>
            </div>
            <div class="initScore">
                <span>初始评分：</span>
                <el-input v-model="initScore" size="small" style="width: 140px;margin-bottom: 20px;"
                          placeholder="默认0"></el-input>
            </div>
        </div>

        <el-form :model="sCForm" st atus-icon ref="sCForm" v-loading="loading" class="sCForm"
                 v-if="$route.query.type=='edit'?true:!!featureList.length" label-position="left">
            <el-table ref="table" :data="featureList" class="scoreCardTable" border :header-row-class-name="'table_hd'"
                      :header-cell-class-name="'table_th'" :row-class-name="'table_tr'" :cell-class-name="'table_td'"
                      width="100%" :fit="true">
                <el-table-column label="特征" align="left" :width="$route.query.type=='edit'?'450px':'auto'"
                                 :min-width="$route.query.type=='edit'?'none':'200px'" class-name="table_column">
                    <template slot-scope="scope">
                        <!-- /** Jim修改于2018-10-12 10:54:33 @hidden：v-if掉让特征垂直居中 */  -->
                        <div class="fea" :class="{'absolute':scope.row.trHeight>scrollHeight}"
                             :style="feaStyle(scope.row)" :data-trHeight="scope.row.trHeight">
                            <div class="foldIcon fl mg_l_10" :class="{'bottom':scope.row.fold}"
                                 @click="openFea(scope.row)"></div>
                            <div class="fl varDiv">
                                <div class="varNameItem" v-for="(frItem,frIndex) in scope.row.featureRuleList"
                                     v-if="frIndex==0" :class="{'hidden':frIndex!=0}">
                                    <div class="varName" v-for="(ruleCon,ruleConIndex) in frItem.rule.ruleContent"
                                         v-if="scope.row.fold?true:ruleConIndex<2">
                                        <!-- 变量名 -->
                                        <variableName class="" ref="variableName" :title="ruleCon.variableName"
                                                      :variableList="variableList" :icon="icon" :vLock="vLock"
                                                      :feaItem="scope.row" :feaIndex="scope.$index" :frItem="frItem"
                                                      :frIndex="frIndex" :ruleCon="ruleCon" :ruleConIndex="ruleConIndex"
                                                      @changeRuleCon="changeRuleCon" @ruleCon_plus="ruleCon_plus"
                                                      @ruleCon_remove="ruleCon_remove" @feature_plus="feature_plus"
                                                      @feature_remove="feature_remove"/>
                                    </div>
                                </div>
                                <div class="featureWeight varNameItem" v-if="scope.row.fold">
                                    <!-- <div>窗口高度：{{scrollHeight}},变量高度：{{scope.row.varHeight}}</div> -->
                                    <!-- <div>trTop：{{scope.row.trTop}},trHeight：{{scope.row.trHeight}}</div> -->
                                    <el-form-item label="权重：" label-width="120px">
                                        <el-input v-if="$route.query.type=='edit'" class="w150"
                                                  :class="{'solid_red':vLock&&!scope.row.featureWeight}"
                                                  v-model="scope.row.featureWeight" placeholder="权重" size="medium"
                                                  @keyup.native="scope.row.featureWeight=scope.row.featureWeight.replace(/[^\d.]/g,'')"
                                                  clearable></el-input>
                                        <span v-else>{{scope.row.featureWeight}}</span>
                                    </el-form-item>
                                </div>
                                <div class="special">
                                    <div class="missScore varNameItem" v-if="scope.row.fold">
                                        <el-form-item label="其他时系数值：" label-width="120px">
                                            <el-input v-if="$route.query.type=='edit'" class="w150 inlineBlock"
                                                      :class="{'solid_red':vLock&&!scope.row.missScore}"
                                                      v-model="scope.row.missScore" placeholder="默认0" size="medium"
                                                      @keyup.native="scope.row.missScore=scope.row.missScore.replace(/[^\d.-]/g,'')"
                                                      clearable></el-input>
                                            <span v-else>{{scope.row.missScore}}</span>
                                        </el-form-item>
                                    </div>
                                    <div class="exceptionScore varNameItem" v-if="scope.row.fold">
                                        <el-form-item label="异常时系数值：" label-width="120px">
                                            <el-input v-if="$route.query.type=='edit'" class="w150 inlineBlock"
                                                      :class="{'solid_red':vLock&&!scope.row.exceptionScore}"
                                                      v-model="scope.row.exceptionScore" placeholder="默认0" size="medium"
                                                      resize="horizontal"
                                                      @keyup.native="scope.row.exceptionScore=scope.row.exceptionScore.replace(/[^\d.-]/g,'')"
                                                      clearable></el-input>
                                            <span v-else>{{scope.row.exceptionScore}}</span>
                                        </el-form-item>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="1?'条件':('条件'+hasAnyOpen+coeListWidth)" class-name="pd_b_0 td_term"
                                 :width="$route.query.type=='edit'?(hasAnyOpen?'730px':'350px'):'auto'"
                                 :min-width="$route.query.type=='edit'?'none':'200px'">
                    <template slot-scope="scope">
                        <div class="frItem" v-for="(frItem,frIndex) in scope.row.featureRuleList" :frIndex="frIndex"
                             v-if="scope.row.fold?true:frIndex==0">
                            <div class="ruleConItem" :class="{'areaLine':frItem.rule.ruleContent.length>1}"
                                 v-for="(ruleCon,ruleConIndex) in frItem.rule.ruleContent" :ruleConIndex="ruleConIndex"
                                 v-if="scope.row.fold?true:ruleConIndex<2">
                                <!-- 变量内容循环 -->
                                <template>
                                    <variableCon class="" ref="variableCon" :icon="icon" :vLock="vLock"
                                                 :feaItem="scope.row" :feaIndex="scope.$index" :frItem="frItem"
                                                 :frIndex="frIndex" :ruleCon="ruleCon" :ruleConIndex="ruleConIndex"
                                                 :hasAnyOpen="hasAnyOpen" @featureRule_plus="featureRule_plus"
                                                 @featureRule_remove="featureRule_remove"
                                                 @ruleConOpr_plus="ruleConOpr_plus"/>
                                    <!-- <el-select class="w90 fr mg_r_20 ruleConLogic" :class="{'solid_red':vLock&&!frItem.rule.logic,'mg_t-20':frItem.rule.ruleContent.length%2==0}" v-model.number="frItem.rule.logic" placeholder="逻辑关系" size="medium" no-match-text="查询无结果" no-data-text="暂无数据" popper-class="stratList" v-if="frItem.rule.ruleContent.length>1&&ruleConIndex==(frItem.rule.ruleContent.length%2==1?((frItem.rule.ruleContent.length/2).toFixed()-1):(frItem.rule.ruleContent.length/2))">
                                        <el-option v-for="(varLogicItem,varLogicIndex) in varLogicList" :key="varLogicItem.id" :label="varLogicItem.name" :value="varLogicItem.id"><div class="stratOption overhide" :title="varLogicItem.name">{{varLogicItem.name}}</div></el-option>
                                    </el-select> -->
                                </template>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="系数" :min-width="$route.query.type=='edit'?coeListWidth:'200px'"
                                 class-name="pd_b_0 overhide0">
                    <template slot-scope="scope">
                        <div class="frItem" v-for="(frItem,frIndex) in scope.row.featureRuleList"
                             v-if="scope.row.fold?true:frIndex==0">
                            <!-- /** Jim修改于2018-10-12 10:54:33 @hidden：v-if掉让特征垂直居中 */  -->
                            <div class="ruleConItem" v-for="(ruleConItem,ruleConIndex) in frItem.rule.ruleContent"
                                 :key="ruleConIndex"
                                 :class="{'hidden':scope.row.fold?(ruleConIndex!=(frItem.rule.ruleContent.length%2==1?((frItem.rule.ruleContent.length/2).toFixed()-1):(frItem.rule.ruleContent.length/2))):false,'mg_t-20':scope.row.fold?(frItem.rule.ruleContent.length%2==0&&ruleConIndex==(frItem.rule.ruleContent.length%2==1?((frItem.rule.ruleContent.length/2).toFixed()-1):(frItem.rule.ruleContent.length/2))):false}"
                                 v-if="scope.row.fold?(ruleConIndex==(frItem.rule.ruleContent.length%2==1?((frItem.rule.ruleContent.length/2).toFixed()-1):(frItem.rule.ruleContent.length/2))):ruleConIndex==0"
                            >
                                <template v-if="$route.query.type=='edit'">
                                    <template v-for="(coeItem,coeIndex) in frItem.coefficientObject">
                                        <!-- 常量 -->
                                        <el-input v-if="coeItem.type==1" class="w90"
                                                  :class="{'solid_red':vLock&&!coeItem.value}" v-model="coeItem.value"
                                                  placeholder="数值" size="medium"
                                                  @keyup.native="coeItem.value=coeItem.value.replace(/[^\d.-]/g,'')"
                                                  clearable></el-input>
                                        <!-- 变量名 -->
                                        <el-select v-if="coeItem.type==2" class="w90"
                                                   :class="{'solid_red':vLock&&!coeItem.value}" v-model="coeItem.value"
                                                   filterable placeholder="已有变量名" size="medium" no-match-text="查询无结果"
                                                   no-data-text="暂无数据" popper-class="stratList"
                                                   :title="getVarName(coeItem.value)">
                                            <el-option v-for="(varItem,varIndex) in variableList" :key="varIndex"
                                                       :label="varItem.variableName" :value="varItem.variableId">
                                                <div class="stratOption overhide" :title="varItem.variableName">
                                                    {{varItem.variableName}}
                                                </div>
                                            </el-option>
                                        </el-select>
                                        <el-popover placement="top" v-model="coeItem.showSet" popper-class="showSet"
                                                    v-if="coeIndex>0">
                                            <coeMenu class="coeMenu" :id="'setImg_'+scope.$index+'_'+frIndex"
                                                     :preType="frItem.coefficientObject[coeIndex-1].type"
                                                     :preValue="frItem.coefficientObject[coeIndex-1].value"
                                                     :curIndex="coeIndex" :frItem="frItem" @coeOprFn="coeOprFn"/>
                                            <div slot="reference" v-if="coeItem.value==')'"
                                                 class="icon_ set pointer setImg"
                                                 :id="'setImg_'+scope.$index+'_'+frIndex+'_'+coeIndex" alt="设置1"></div>
                                        </el-popover>
                                        <!-- 符号 -->
                                        <div v-if="coeItem.type==3" class="inlineBlock w20 text-center">
                                            {{coeItem.value}}
                                        </div>
                                    </template>
                                    <el-popover placement="top" v-model="frItem.showSet" popper-class="showSet">
                                        <coeMenu class="coeMenu" :id="'setImg_'+scope.$index+'_'+frIndex"
                                                 :preType="frItem.coefficientObject[frItem.coefficientObject.length-1].type"
                                                 :preValue="frItem.coefficientObject[frItem.coefficientObject.length-1].value"
                                                 :curIndex="frItem.coefficientObject.length" :frItem="frItem"
                                                 @coeOprFn="coeOprFn"/>
                                        <div slot="reference" class="icon_ set pointer setImg"
                                             :id="'setImg_'+scope.$index+'_'+frIndex" alt="设置2"></div>
                                    </el-popover>
                                    <!-- <div class="icon_ set pointer setImg" :id="'setImg_'+scope.$index+'_'+frIndex" alt="设置2"></div> -->
                                    <!-- <img class="back pointer" :src="icon.back" @click="recoverCoe(frItem)" alt="撤销">  -->
                                    <div class="icon_ back pointer" @click="recoverCoe(frItem)" alt="撤销"></div>
                                </template>
                                <template v-else>
                                    <template v-for="(coeItem,coeIndex) in frItem.coefficientObject">
                                        <div class="inlineBlock" v-if="coeItem.type==2">{{getVarName(coeItem.value)}}
                                        </div>
                                        <div class="inlineBlock" v-else>{{coeItem.value}}</div>
                                    </template>
                                </template>
                            </div>
                            <div class="ruleConItem" v-else-if="scope.row.fold"></div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-form-item class="text-center mg_t_20">
                <el-button class="" type="primary" size="medium" @click="createFeature">保存</el-button>
            </el-form-item>
        </el-form>
        <noData img="noData" v-loading="loading" p2="暂无数据" v-else/>
    </div>
</template>

<script>
    let icon = {
        plus: require('img/icon/plus.png'),
        remove: require('img/icon/remove.png'),
        sort: require('img/icon/sort.png'),
        ruleConOpen: require('img/icon/ruleConOpen.png'),
        set: require('img/icon/set.png'),
        back: require('img/icon/back.png'),
    }
    import noData from '../../../../components/pc/noData/noData'
    import variableName from '../../../../components/pc/policy/variableName'
    import variableCon from '../../../../components/pc/policy/variableCon'
    import coeMenu from '../../../../components/pc/coeList/coeMenu'

    export default {
        name: 'pages_scoreCard',
        data() {
            return {
                pageName: 'pages_scoreCard', icon,
                loading: true,
                /************************ 与variableName交互的数据 ************************/
                variableList: [],// 变量列表
                allEnmuList: [],     // 所有的枚举变量值
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
                varLogicList: [{id: 1, name: 'AND'}, {id: 2, name: 'OR'}],// 变量间逻辑关系
                /************************ scoreCard专用的数据 ************************/
                sCForm: {
                    featureWeight: false,
                    weightLock: true,
                },
                coe: {
                    list: [//type:1常量、type:2变量、type:3符号
                        {
                            type: 2,
                            label: '新增变量',
                        }, {
                            type: 1,
                            label: '新增数值',
                        }, {
                            type: 'menu',
                            label: '新增操作符',
                            children: [{
                                type: 3,
                                label: '+',
                            }, {
                                type: 3,
                                label: '-',
                            }, {
                                type: 3,
                                label: '*',
                            }, {
                                type: 3,
                                label: '/',
                            }, {
                                type: 3,
                                label: '( )',
                            }],
                        }
                    ],
                },

                initScore: '',           // 初始评分
                featureList: [],
                create: {
                    moldId: this.$route.query.modelId,// 模型ID    Number  Y
                    featureList: [],
                    // featureRuleList:[],// 特征规则列表  List    Y
                },
                vLock: false,// 是否开启验证提示
                isNewNode: false,// 是否是新节点
                scrollTop: 0,// 滚动距离
                scrollHeight: 0,// 滚动窗口高度
                modelTitle: {
                    show: false,
                },
                modelAdd: {
                    id: this.$route.query.modelId,
                    moldName: '',
                    moldCode: '',
                    remark: '',
                    moldType: '',
                    moldVersion: '',// 模型版本    String  N   例如：1.00、1.01
                    moldStatus: '',// 模型状态    Number  N   1：未上线，2：已上线，3：已下线
                },
                visible: false,          // 备注信息隐藏显示
            }
        },
        computed: {
            hasWeight() {
                return this.featureList.some((feaItem, feaIndex) => {
                    return !!feaItem.featureWeight;
                })
            },
            hasAnyOpen() {// 整个table是否有条件展开
                return this.featureList.some((feaItem, feaIndex) => {
                    return feaItem.featureRuleList.some((frItem, frIndex) => {
                        return frItem.rule.ruleContent.some((rcItem, rcIndex) => {
                            // console.log(2,rcIndex,rcItem.content.length,rcItem);
                            if (rcItem.variableType == 5) {// 枚举类型
                                return false;
                            } else {
                                return rcItem.content && rcItem.content.length > 1;
                            }
                        })
                    })
                })
            },
            coeListWidth() {// 计算系数单元格的总宽度
                let widthSum = 206;
                let widthArr = [];
                this.featureList.map((feaItem, feaIndex) => {
                    feaItem.featureRuleList.map((frItem, frIndex) => {
                        let frWidth = 0;
                        frItem.coefficientObject.map((coeItem, coeIndex) => {
                            if (coeItem.type == 1 || coeItem.type == 2) {
                                frWidth += 90;
                            } else if (coeItem.value == ')') {
                                frWidth += 66;
                            } else {
                                frWidth += 20;
                            }
                        })
                        widthArr.push(frWidth);
                    })
                })
                let maxInwidthArr = Math.max.apply(Math, widthArr);
                // console.log('widthArr',widthArr,'maxInwidthArr',maxInwidthArr)
                widthSum += maxInwidthArr;
                return widthSum;
            },
            draggable() {
                return this.$route.query.type == 'edit';
            },
            allowNext() {
                return !!this.modelAdd.moldName && !!this.modelAdd.moldCode;
            },
        },
        components: {
            noData, variableName, variableCon, coeMenu,
        },
        created() {
            console.time('mounted')
            this.getVariableList();// 获取本产品线变量列表
            // this.getFeatureList();
        },
        mounted() {
            console.timeEnd('mounted')
            // console.time('updated')
            this.getOprList_enumList();// 获取变量枚举值列表

            document.querySelector('.pages_modelMg').addEventListener('scroll', this.onScroll);
        },
        updated() {
            // console.timeEnd('updated')
        },
        methods: {

            getVarName(id) {
                let varName = '';
                this.variableList.map((varItem) => {
                    if (id == varItem.variableId) {
                        console.log(id, varItem.variableName)
                        varName = varItem.variableName;
                    }
                })
                return varName;
            },
            feaStyle(fea) {
                return {
                    top: this.scrollTop > (fea.trTop - fea.varHeight - 200) ?
                        (fea.trHeight - fea.varHeight - 100 + 'px') :
                        ((this.scrollTop - fea.trTop + fea.trHeight) < 0 ? (100 + 'px') : (this.scrollTop - fea.trTop + fea.trHeight + 100 + 'px')),
                }
            },
            initHeight() {
                this.$nextTick(() => {
                    let trTops = [];
                    document.querySelectorAll('.table_tr').forEach((trItem, trIndex) => {
                        this.scrollHeight = document.querySelector('.pages_modelMg').clientHeight;
                        this.featureList[trIndex].trHeight = trItem.scrollHeight;
                        trTops.push(trItem.scrollHeight);
                        this.featureList[trIndex].varHeight = document.querySelectorAll('.table_tr .varDiv')[trIndex].scrollHeight;
                        // console.log('滚动',trIndex,this.scrollTop,this.featureList[trIndex].trTop)
                    })
                    let trTopSum = trTops.reduce((sum, item, index, arr) => {
                        // console.log('reduce',sum,item,index,arr)
                        this.featureList[index - 1].trTop = sum;
                        return sum += item;
                    })
                    this.featureList[this.featureList.length - 1].trTop = trTopSum;
                    this.loading = false;
                })
            },
            openFea(fea) {
                fea.fold = !fea.fold;
                this.initHeight();
            },
            onScroll() {// 监听滚动
                this.scrollTop = document.querySelector('.pages_modelMg').scrollTop;
            },
            addWeight() {
                if (this.sCForm.weightLock) {
                    this.featureList.map((feaItem, feaIndex) => {
                        feaItem.featureWeight = 1;
                    })
                }
                this.sCForm.featureWeight = !this.sCForm.featureWeight
            },
            /************************ scoreCardForm表单验证&&表单保存&&表单重置 ************************/
            createFeature() {
                // console.log(888,this.create,comApi.infiniteLoop.obj(this.create))
                this.create.featureList = this.featureList;
                this.create.initialRate = this.initScore == '' ? 0 : this.initScore;
                /*comApi.infiniteLoop.obj(this.create)&&*/
                this.$post('/mcs/scorecard/feature/create', this.create)
                    .then(res => {
                        this.$message.success('提交成功')
                        this.$router.push('/risk/modelMg/modelList');
                    })
            },
            scrollToLeft(frItem, width) {/** Jim修改于2018-06-25 16:48:21 @自动滚动到最左侧 */
                if (document.querySelector('.pages_scoreCard')) {
                    document.querySelector('.pages_scoreCard').style.width = this.$refs.table.$refs.bodyWrapper.scrollWidth + width + 'px';
                }
                this.$refs.table.$el.style.width = this.$refs.table.$refs.bodyWrapper.scrollWidth + width + 'px';
                this.$nextTick(() => {
                    document.querySelector('.pages_modelMg').scrollLeft = 999999;
                })
            },
            coeList(e, frItem, coeItem, coeIndex) {
                let curIndex = !!coeIndex ? coeIndex : frItem.coefficientObject.length;
                let preIndex = curIndex - 1;
                let preValue = frItem.coefficientObject[preIndex].value;
                let preType = frItem.coefficientObject[preIndex].type;
                console.log(frItem, '现', coeItem, coeIndex, '前', preType, preValue, preIndex)
                // console.log(111,this.$refs.pages_scoreCard.scrollHeight,this.$refs.pages_scoreCard.scrollTop,document.documentElement.scrollTop,e)
                let scrollTop = document.documentElement.scrollTop;
                let scrollLeft = this.$refs.pages_scoreCard.scrollWidth;
                if (!document.getElementById('cascader_' + e.target.id)) {// 当前弹窗不存在时再打开
                    let _self = this;
                    let coeData = {
                        id: e.target.id,
                        style: {
                            top: !!preType && preType != 3 ? (e.y - 212 + scrollTop + 'px') : (e.y - 250 + scrollTop + 'px'),
                            left: scrollLeft + e.screenX - 40 + 'px'
                        },
                        preType,
                        preValue,
                    }
                    this.$cascader(coeData, (item) => {
                        if (!!item) {
                            console.table(Object.entries(item))
                            this.coeOprFn(item, curIndex, frItem, preType, preIndex);
                        }
                    })
                }
            },
            coeOprFn(item, curIndex, frItem, preType) {
                console.log(item, curIndex, frItem, preType)
                frItem.coeHistory.push(JSON.parse(JSON.stringify(frItem.coefficientObject)));// 保存系数操作历史记录
                switch (item.type) {//type:1常量、type:2变量、type:3符号
                    case 3:
                        switch (item.label) {// 选择符号
                            case '( )':// 选择()
                                console.log('选择()')
                                frItem.coefficientObject.splice(curIndex, 0, {
                                    type: item.type,
                                    value: '(',
                                    showSet: false
                                }, {type: item.type, value: ')', showSet: false})
                                this.scrollToLeft(frItem, 66);
                                frItem.history_width.push(66);// 系数  Float   N
                                break;
                            default:// 选择+-*/
                                console.log('选择+-*/')
                                frItem.coefficientObject.splice(curIndex, 0, {
                                    type: item.type,
                                    value: item.label,
                                    showSet: false
                                })
                                this.scrollToLeft(frItem, 20);
                                frItem.history_width.push(20);// 系数  Float   N
                                break;
                        }
                        ;
                        break;
                    case 'menu':
                        break;
                    default :// 选择变量常量
                        switch (preType) {
                            case 3:// 前一位是符号：新增
                                console.log('前一位是符号：新增')
                                frItem.coefficientObject.splice(curIndex, 0, {
                                    type: item.type,
                                    value: '',
                                    showSet: false
                                })
                                this.scrollToLeft(frItem, 90);
                                frItem.history_width.push(90);// 系数  Float   N
                                break;
                            default:// 前一位是变量常量：转换
                                console.log('前一位是变量常量：转换')
                                frItem.coefficientObject[frItem.coefficientObject.length - 1].type = item.type;
                                frItem.coefficientObject[frItem.coefficientObject.length - 1].value = '';
                                frItem.coefficientObject[frItem.coefficientObject.length - 1].showSet = false;
                                break;
                        }
                        this.scrollToLeft();
                        break;
                }
                this.resetShowSet(frItem);
            },
            recoverCoe(frItem) {// 操作系数
                this.resetShowSet(frItem);
                if (!!frItem.coeHistory.length) {
                    frItem.coefficientObject = frItem.coeHistory[frItem.coeHistory.length - 1];
                    frItem.coeHistory.pop();// 删除系数操作最后一次历史记录
                    this.scrollToLeft(frItem, -frItem.history_width[frItem.history_width.length - 1]);
                    frItem.history_width.pop();
                } else {
                    this.$notify({// 通知提示
                        message: '没有历史记录了',
                        type: 'warning'
                    })
                    // frItem.coefficientObject = [{type:1,value:''}];
                }
            },
            resetShowSet(frItem) {
                frItem.showSet = false;
                frItem.coefficientObject.map(item => {
                    item.showSet = false
                })
            },
            changeRuleCon(feaItem, frIndex, rCItem, rCIndex) {// 改变规则内容之变量
                // console.table(Object.entries(rCItem))
                feaItem.featureRuleList.map((frCell, fri) => {
                    frCell.rule.ruleContent.map((ruleConItem, ruleConIndex) => {
                        if (ruleConIndex == rCIndex) {
                            this.$nextTick(() => {// 解决operation已有值情况下，修改variableType=5时，导致operationArray已注册，但operation残留的问题
                                this.initRuleConItem(ruleConItem, rCItem, ruleConIndex, 0, fri);
                                this.setScroll();
                            })
                        }
                    })
                })
            },
            initRuleConItem(ruleConItem, rCItem, ruleConIndex, index, fri) {
                Object.keys(rCItem).map((varItem, varIndex) => {
                    ruleConItem[varItem] = rCItem[varItem]
                })
                this.getVarType(ruleConItem, ruleConIndex, 0, fri);
                ruleConItem.operationArray = [];// 操作符 Array Y多选
                ruleConItem.addMenu = false;
                ruleConItem.delMenu = false;
                if (ruleConItem.variableType == 5 || ruleConItem.variableType == 6) {
                    this.$refs.variableCon.map(vcItem => {// 从已有内容的字符串变量切换到枚举型时，字符串残留问题。
                        this.$nextTick(() => {
                            // console.log('【】【】【】',vcItem.$refs,vcItem.$refs.operationArray)
                            vcItem.$refs.operationArray.map(oprItem => {
                                oprItem.selectedLabel = '';
                            })
                        })
                    })
                    ruleConItem.logic = 2;
                    ruleConItem.content = [{// 规则内容    List    Y
                        operation: '',// 操作符 Number  Y   1: 等于, 2: 不等于, 3: is null, 4: 大于, 5: 大于或等于, 6: 小于, 7: 小于或等于,8:以...开始,9包含
                        operationValue: '',// 操作值 String  Y   不超过255
                        valueDescription: '',// 操作值描述   Numbrt  Y   1：与，2：或
                        sort: '',// 顺序  Number  N
                    }];
                } else {
                    ruleConItem.logic = 1;
                    ruleConItem.content = [{// 规则内容    List    Y
                        operation: '',// 操作符 Number  Y   1: 等于, 2: 不等于, 3: is null, 4: 大于, 5: 大于或等于, 6: 小于, 7: 小于或等于,8:以...开始,9包含
                        operationValue: '',// 操作值 String  Y   不超过255
                        valueDescription: '',// 操作值描述   Numbrt  Y   1：与，2：或
                        sort: '',// 顺序  Number  N
                    }, {// 规则内容    List    Y
                        operation: '',// 操作符 Number  Y   1: 等于, 2: 不等于, 3: is null, 4: 大于, 5: 大于或等于, 6: 小于, 7: 小于或等于,8:以...开始,9包含
                        operationValue: '',// 操作值 String  Y   不超过255
                        valueDescription: '',// 操作值描述   Numbrt  Y   1：与，2：或
                        sort: '',// 顺序  Number  N
                    }];
                }
                console.log('pages_scoreCard：initRuleConItem：', ruleConItem.variableType, ruleConItem)
            },
            ruleCon_plus(feaItem, ruleCon, ruleConIndex) {// 添加变量
                feaItem.fold = true;// 展开
                ruleCon.addMenu = false;// 关闭添加菜单
                ruleCon.delMenu = false;// 关闭添加菜单
                feaItem.featureRuleList.map((fr) => {
                    let ruleConEmpty = {// 特征规则列表  List    Y
                        variableId: '',// 变量ID    Number  Y   不超过255
                        variableName: '',// 变量名 String  Y   不超过255
                        variableType: '',//变量类型    Number  N   1：字符串(==、!=、is null、startsWith、contains)，2：整型，3：浮点型，4：日期型(排除is nll+startsWith+contains)，5：枚举(多选)，6：布尔型(是否)
                        oprList: [],// 注册oprList操作符列表
                        logic: '',// 逻辑操作    Numbrt  Y   1：与，2：或
                        operationArray: [],// 操作符 Array Y多选
                        addMenu: false,
                        delMenu: false,
                        content: [{// 规则内容    List    Y
                            operation: '',// 操作符 Number  Y   1: 等于, 2: 不等于, 3: is null, 4: 大于, 5: 大于或等于, 6: 小于, 7: 小于或等于,8:以...开始,9包含
                            operationValue: '',// 操作值 String  Y   不超过255
                            valueDescription: '',// 操作值描述   Numbrt  Y   1：与，2：或
                            sort: '',// 顺序  Number  N
                        }]
                    }
                    fr.rule.ruleContent.splice(ruleConIndex + 1, 0, ruleConEmpty);
                })
                this.initHeight();// 重新计算单元格高度
            },
            ruleCon_remove(feaItem, feaIndex, frItem, frIndex, ruleCon, ruleConIndex) {// 添加规条目
                ruleCon.addMenu = false;// 关闭添加菜单
                ruleCon.delMenu = false;// 关闭添加菜单
                feaItem.featureRuleList.map((fr, frIndex) => {
                    // console.log(feaIndex,ruleConIndex)
                    fr.rule.ruleContent.splice(ruleConIndex, 1);
                    if (fr.rule.ruleContent.length < 1) {// 变量小于1个时处理
                        if (feaIndex == 0) {// 第一条特征
                            if (feaItem.featureRuleList.length < 1) {// 特征总数小于1条时
                                let ruleConEmpty = {// 空条件    List    Y
                                    variableId: '',// 变量ID    Number  Y   不超过255
                                    variableName: '',// 变量名 String  Y   不超过255
                                    variableType: '',// 变量类型 Number  N   1：字符串，2：整型，3：浮点型，4：日期型，5：枚举，6：布尔型
                                    logic: 1,// 逻辑操作    Numbrt  Y   1：与，2：或
                                    oprList: [],// 注册oprList操作符列表
                                    operationArray: [],// 操作符 Array Y多选
                                    addMenu: false,
                                    delMenu: false,
                                    content: [{// 规则内容    List    Y
                                        operation: '',// 操作符 Number  Y   不超过255
                                        operationValue: '',// 操作值 String  Y   不超过255
                                        valueDescription: '',// 操作值描述   Numbrt  Y   1：与，2：或
                                        sort: '',// 顺序  Number  N
                                    }],// 注册操作符数组
                                }
                                fr.rule.ruleContent.push(ruleConEmpty);
                                !fr.rule.ruleContent[0].variableName && this.$notify({// 通知提示
                                    message: '不能再删了',
                                    type: 'warning'
                                })
                            } else {
                                this.feature_remove(feaItem, feaIndex)
                                /** Jim修改于2018-10-17 17:34:15 @如果变量删完了，直接删特征 */
                            }
                        } else {
                            this.feature_remove(feaItem, feaIndex)
                            /** Jim修改于2018-10-17 17:34:15 @如果变量删完了，直接删特征 */
                        }
                    }
                })
                this.initHeight();// 重新计算单元格高度
            },
            /************************ 与variableCon交互的方法 ************************/
            featureRule_plus(feaItem, frItem, frIndex) {// 添加条件
                const ruleConTmpl = frItem.rule.ruleContent[0];
                let frEmpty = {// 特征规则列表  List    Y
                    coe: {show: false},// 系数操作
                    coefficientObject: [{type: 1, value: '', showSet: false}],// 系数  Float   N
                    showSet: false,
                    coeHistory: [],// 系数  Float   N
                    history_width: [],// 系数  Float   N
                    sort: '',// 顺序  Number  N
                    rule: {// 规则内容    List    Y
                        logic: 1,// 逻辑操作    Numbrt  Y   1：与，2：或
                        ruleContent: []
                    }
                }
                frItem.rule.ruleContent.map((ruleConItem, ruleConIndex) => {
                    let ruleConEmpty
                    if (ruleConItem.variableType != 5 && ruleConItem.variableType != 6) {
                        ruleConEmpty = {// 空条件    List    Y
                            variableId: '',// 变量ID    Number  Y   不超过255
                            variableName: '',// 变量名 String  Y   不超过255
                            variableType: '',// 变量类型 Number  N   1：字符串，2：整型，3：浮点型，4：日期型，5：枚举，6：布尔型
                            logic: '',// 逻辑操作    Numbrt  Y   1：与，2：或
                            oprList: [],// 注册oprList操作符列表
                            operationArray: [],// 操作符 Array Y多选
                            addMenu: false,
                            delMenu: false,
                            content: [{// 规则内容    List    Y
                                operation: '',// 操作符 Number  Y   不超过255
                                operationValue: '',// 操作值 String  Y   不超过255
                                valueDescription: '',// 操作值描述   Numbrt  Y   1：与，2：或
                                sort: '',// 顺序  Number  N
                            }, {// 规则内容    List    Y
                                operation: '',// 操作符 Number  Y   不超过255
                                operationValue: '',// 操作值 String  Y   不超过255
                                valueDescription: '',// 操作值描述   Numbrt  Y   1：与，2：或
                                sort: '',// 顺序  Number  N
                            }],// 注册操作符数组
                        }
                    } else {
                        ruleConEmpty = {// 空条件    List    Y
                            variableId: '',// 变量ID    Number  Y   不超过255
                            variableName: '',// 变量名 String  Y   不超过255
                            variableType: '',// 变量类型 Number  N   1：字符串，2：整型，3：浮点型，4：日期型，5：枚举，6：布尔型
                            logic: '',// 逻辑操作    Numbrt  Y   1：与，2：或
                            oprList: [],// 注册oprList操作符列表
                            operationArray: [],// 操作符 Array Y多选
                            addMenu: false,
                            delMenu: false,
                            content: [{// 规则内容    List    Y
                                operation: '',// 操作符 Number  Y   不超过255
                                operationValue: '',// 操作值 String  Y   不超过255
                                valueDescription: '',// 操作值描述   Numbrt  Y   1：与，2：或
                                sort: '',// 顺序  Number  N
                            }],// 注册操作符数组
                        }
                    }
                    Object.keys(ruleConItem).map((varItem, varIndex) => {/** Jim修改于2018-11-07 14:17:40 @新需求：除枚举和布尔外，其他类型要复制操作值 */
                        if (varItem == 'content') {// 操作符、操作值……
                            if (varItem.variableType != 5 && varItem.variableType != 6)
                                ruleConEmpty.content.map((oprItem, oprIndex) => {
                                    oprItem.operation = !!ruleConItem.content[oprIndex] ? ruleConItem.content[oprIndex].operation : '';
                                })
                        } else if (varItem == 'operationArray') {// 枚举选项

                        } else {// 复制其他项的值
                            ruleConEmpty[varItem] = ruleConItem[varItem]
                        }
                    })
                    frEmpty.rule.ruleContent.push(ruleConEmpty);
                })
                feaItem.featureRuleList.splice(frIndex + 1, 0, frEmpty);
                feaItem.fold = true;
                this.initHeight();// 重新计算单元格高度
            },
            featureRule_remove(feaItem, frItem, frIndex) {// 删除条件
                feaItem.featureRuleList.splice(frIndex, 1);
                if (feaItem.featureRuleList.length < 1) {
                    this.featureRule_plus(feaItem, frItem)
                    !feaItem.sort && this.$notify({// 通知提示
                        message: '不能再删了',
                        type: 'warning'
                    })
                }
                this.initHeight();// 重新计算单元格高度
            },
            ruleConOpr_plus(ruleCon) {// 添加操作符及操作值
                if (ruleCon.content.length > 1) {// 有两个操作符
                    ruleCon.content.pop();
                } else {// 小于两个操作符
                    ruleCon.operationArray = [];// 操作符 Array Y多选
                    ruleCon.addMenu = false;
                    ruleCon.delMenu = false;
                    ruleCon.logic = 1;
                    ruleCon.content.push({
                        operation: '',// 操作符 Number  Y   不超过255
                        operationValue: '',// 操作值 String  Y   不超过255
                        valueDescription: '',// 操作值描述   Numbrt  Y   1：与，2：或
                        sort: '',// 顺序  Number  N
                    })
                }
                setTimeout(() => {
                    console.log('【展开】', this.$refs.table.$refs.bodyWrapper.scrollWidth)
                    document.querySelector('.pages_scoreCard').style.width = this.$refs.table.$refs.bodyWrapper.scrollWidth + 'px';
                    this.$refs.table.$el.style.width = this.$refs.table.$refs.bodyWrapper.scrollWidth + 'px';
                }, 300)
            },
            feature_plus(feaItem = {}, feaIndex = 0, ruleCon = {addMenu: false, delMenu: false}) {// 添加特征
                feaItem.fold = false;// 收起
                ruleCon.addMenu = false;// 关闭添加菜单
                ruleCon.delMenu = false;// 关闭添加菜单
                let feaEmpty = {
                    fold: false,// 收起
                    // featureName:'',// 特征名称    String  Y
                    featureWeight: 1,// 特征权重    Float   N
                    exceptionScore: '',// 异常时系数   Float   N
                    missScore: '',// 其他情况系统  Float   N
                    featureRuleList: [{// 特征规则列表  List    Y
                        coe: {show: false},// 系数操作
                        coefficientObject: [{type: 1, value: '', showSet: false}],// 系数  Float   N
                        showSet: false,
                        coeHistory: [],// 系数  Float   N
                        history_width: [],// 系数  Float   N
                        sort: '',// 顺序  Number  N
                        'rule': {// 规则内容    List    Y
                            logic: 1,// 逻辑操作    Numbrt  Y   1：与，2：或
                            ruleContent: [{// 特征规则列表  List    Y
                                variableId: '',// 变量ID    Number  Y   不超过255
                                variableName: '',// 变量名 String  Y   不超过255
                                variableType: '',//变量类型    Number  N   1：字符串(==、!=、is null、startsWith、contains)，2：整型，3：浮点型，4：日期型(排除is nll+startsWith+contains)，5：枚举(多选)，6：布尔型(是否)
                                oprList: [],// 注册oprList操作符列表
                                logic: 1,// 逻辑操作    Numbrt  Y   1：与，2：或
                                operationArray: [],// 操作符 Array Y多选
                                addMenu: false,
                                delMenu: false,
                                content: [{// 规则内容    List    Y
                                    operation: '',// 操作符 Number  Y   1: 等于, 2: 不等于, 3: is null, 4: 大于, 5: 大于或等于, 6: 小于, 7: 小于或等于,8:以...开始,9包含
                                    operationValue: '',// 操作值 String  Y   不超过255
                                    valueDescription: '',// 操作值描述   Numbrt  Y   1：与，2：或
                                    sort: '',// 顺序  Number  N
                                }],
                            }],
                        },
                    }],
                }
                this.featureList.splice(feaIndex + 1, 0, feaEmpty)
                this.initHeight();// 重新计算单元格高度
            },
            feature_remove(feaItem, feaIndex, ruleCon = {addMenu: false, delMenu: false}) {// 移除特征
                ruleCon.addMenu = false;// 关闭添加菜单
                ruleCon.delMenu = false;// 关闭添加菜单
                this.featureList.splice(feaIndex, 1);
                if (this.featureList.length < 1) {
                    console.log(this.featureList, !this.featureList)
                    !this.featureList.length && this.$notify({// 通知提示
                        message: '不能再删了',
                        type: 'warning'
                    })
                    this.feature_plus()
                }
                this.initHeight();// 重新计算单元格高度
            },
            getFeatureList() {
                let _self = this;
                this.$post('/mcs/scorecard/content', {
                    moldId: _self.create.moldId
                })
                    .then(res => {
                        this.setScroll();
                        this.modelAdd.moldName = res.moldName;
                        this.modelAdd.moldCode = res.moldCode;
                        this.modelAdd.remark = !!res.remark ? res.remark : '';
                        this.modelAdd.moldType = res.moldType;
                        this.modelAdd.moldVersion = res.moldVersion;
                        this.modelAdd.moldStatus = res.moldStatus;
                        this.initScore = res.initialRate
                        if (!!res.featureList.length) {
                            res.featureList.map((feaItem, feaIndex) => {
                                feaItem.fold = false;
                                feaItem.trHeight = 0;
                                feaItem.trTop = 0;
                                feaItem.varHeight = 0;
                                feaItem.featureRuleList.map((frItem, frIndex) => {
                                    frItem.coeHistory = [];// 系数操作历史记录
                                    frItem.history_width = [];// 系数  Float   N
                                    frItem.coefficientObject.map(item => {
                                        item.showSet = false;
                                    })
                                    frItem.showSet = false;
                                    frItem.rule.ruleContent.map(async (ruleConItem, ruleConIndex) => {
                                        ruleConItem.sort = ruleConIndex;
                                        if (ruleConItem.variableType == 5 || ruleConItem.variableType == 6) {
                                            ruleConItem.operationArray = ruleConItem.content.map(conItem => conItem.operationValue);// 渲染枚举型
                                        } else {
                                            ruleConItem.operationArray = [];
                                        }
                                        ruleConItem.addMenu = false;
                                        ruleConItem.delMenu = false;
                                        ruleConItem.oprList = [];// 注册oprList操作符列表
                                        this.getVarType(ruleConItem, ruleConIndex, 0, frIndex)
                                    })
                                })
                            })

                            const hasWeight = res.featureList.some((feaItem, feaIndex) => {
                                // console.log(feaIndex,feaItem.featureWeight)
                                return !!feaItem.featureWeight;
                            })
                            if (hasWeight) {// 如果有任何一个权重值
                                this.sCForm.weightLock = false;// 关闭权重锁
                            }
                            this.featureList = res.featureList;
                            localStorage.setItem('fea_' + this.create.moldId, JSON.stringify(res.featureList));// 临时测试
                        } else {
                            this.feature_plus()
                        }
                        console.timeEnd('getFeatureList')
                    })
            },
            setScroll() {
                this.$nextTick(() => {
                    this.$refs.table.$refs.bodyWrapper.style.overflow = 'initial';
                })
                setTimeout(() => {
                    console.log('【table】2', this.$refs.table.$refs.bodyWrapper.scrollWidth)
                    document.querySelector('html').style.overflow = 'hidden';
                    document.querySelector('.pages_modelMg').style.height = window.innerHeight - document.querySelector('.pages_hd').scrollHeight - document.querySelector('.pages_ft').scrollHeight - document.querySelector('.pages_breadcrumb').scrollHeight + 'px';
                    document.querySelector('.pages_modelMg').style.overflow = 'auto';
                    document.querySelector('.pages_scoreCard').style.width = this.$refs.table.$refs.bodyWrapper.scrollWidth + 'px';
                    this.$refs.table.$el.style.width = this.$refs.table.$refs.bodyWrapper.scrollWidth + 'px';
                    this.initHeight();
                }, 300)
                window.vm = this;
            },
            modelEdit() {
                this.$post('/mcs/mold/edit', this.modelAdd)
                    .then(res => {
                        this.$message.success('修改成功')
                    })

            },
            /************************ variableName需要的数据 ************************/
            getVariableList(item) {// 3.2.5查询变量列表
                let _self = this;
                this.$post('/mcs/variable/config/list', {
                    appId: _self.$route.query.appId,//产品线ID   Number  N
                })
                    .then(res => {
                        this.variableList = res.variableList;
                        !this.isNewNode && this.getFeatureList();// getFeatureList依赖variableList
                    })
            },
            /************************ 与variableName交互的方法 ************************/
            getVarType(ruleConItem, ruleConIndex, index, frIndex) {
                // console.log(this.pageName+'：【getVarType】：',frIndex,ruleConItem.variableType,'ruleConItem',ruleConItem.variableId)
                this.variableList.map((varItem) => {
                    // console.log(this.pageName+'：【5】：',frIndex,'ruleConItem',ruleConItem.variableId,'varItem',varItem.variableId)
                    if (ruleConItem.variableId == varItem.variableId) {
                        ruleConItem.variableName = varItem.variableName;
                        ruleConItem.variableType = varItem.variableType;
                        // console.table(Object.entries(varItem))
                        if (varItem.variableType == 1) {// 1：字符串(==、!=、is null、startsWith、contains)
                            ruleConItem.oprList = this.oprList_str;
                        } else if (varItem.variableType == 2 || varItem.variableType == 3 || varItem.variableType == 4) {// 2：整型，3：浮点型，4：日期型(排除is nll+startsWith+contains)
                            ruleConItem.oprList = this.oprList_num;
                        } else if (varItem.variableType == 5) {// 5：枚举(多选)，
                            // if(ruleConItem.some((rcItem,rcIndex)=>rcItem.variableType==5&&rcIndex<ruleConIndex)){// 如果本特征中当前变量之前有枚举型的话
                            // frIndex==0&&this.getOprList_enumList(ruleConItem,ruleConIndex,index,frIndex);// 获取变量枚举值列表
                            // }else{
                            // }
                            ruleConItem.oprList = []
                            this.allEnmuList.map(cell => {
                                if (ruleConItem.variableId == cell.variableId) {
                                    cell.id = cell.enumValue;
                                    cell.name = cell.enumName;
                                    ruleConItem.oprList.push(cell)
                                }
                            })
                        } else if (varItem.variableType == 6) {// 6：布尔型(是否)
                            ruleConItem.oprList = this.oprList_bl;
                        } else {
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
                this.variableList.map((varItem) => {
                    if (id == varItem.variableId) {
                        console.log(id, varItem.variableName)
                        varName = varItem.variableName;
                    }
                })
                return varName;
            },
            // getOprList_enumList(ruleConItem, ruleConIndex, index, frIndex) {// 3.2.12获取变量枚举值列表
            //     // console.table(Object.entries(ruleConItem))
            //     this.$post('/mcs/variable/enums', {
            //         variableId: ruleConItem.variableId,// 变量ID  Number  Y
            //     })
            //         .then(res => {
            //             ruleConItem.oprList = res.enumList.map((cell) => {
            //                 cell.id = cell.enumValue;
            //                 cell.name = cell.enumName;
            //                 return cell;
            //             })
            //         })
            // },
            getOprList_enumList() {// 3.2.12获取变量枚举值列表
                // console.table(Object.entries(item))
                let _self = this;
                this.$post('/mcs/variable/enum/list', {
                    // variableId: item.variableId,// 变量ID  Number  Y
                })
                    .then(res => {
                        this.allEnmuList = res.enumList
                        // console.log(res.enumList)
                        // res.enumList.map((cell) => {
                        //     cell.id = cell.enumValue;
                        //     cell.name = cell.enumName;
                        // })
                        // item.oprList = res.enumList;
                    })
            },
            // 修改模型名称和备注信息
            modelNameChange(val) {
                this.modelEdit()
                this.visible = false
            },
        },
        beforeDestroy() {
            console.log('销毁前')
            document.querySelector('html').style.overflow = '';
            document.querySelector('.pages_modelMg').style.height = '';
            document.querySelector('.pages_modelMg').style.overflow = '';
        },
        // beforeRouteLeave(to,from,next) {
        //     if (to.path == '/risk/modelMg/modelList') {
        //         to.meta.keepAlive = true
        //         next();
        //     }
        // },
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    .pages_scoreCard {
        margin: 0 0px -40px -40px;
        padding: 20px 0 40px 40px;
        .uml_hd {
            width: 100%;
            .titleDiv {
                /*width: 100%;*/
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin-bottom: 20px;
                p {
                    margin-right: 60px;
                    .el-input {
                        width: 140px;
                        .el-input__inner {
                            height: 30px !important;
                            line-height: 30px !important;
                        }
                    }
                }
                .el-popover__title {
                    text-align: center !important;
                }
                .el-popover__reference {
                    cursor: pointer;
                    &:hover {
                        i {
                            background: url("../../../../resource/img/icon/icon-remark-hover.png") no-repeat center /100%;
                        }

                    }
                    i {
                        display: inline-block;
                        width: 14px;
                        height: 16px;
                        background: url("../../../../resource/img/icon/icon-remark.png") no-repeat center /100%;
                        vertical-align: middle;

                    }
                }
                .el-popover {
                    .el-button {
                        text-align: center;
                    }
                }

            }
        }
        .scoreCardTable.el-table {
            /*width: fit-content;*/
            width: 100%;
            max-width: none;
            .table_hd {
                /*th{padding:8px 0;}*/
            }
            .table_td {
                padding-top: 12px;
                .cell {
                    padding: 0;
                }
                &.overhide0 {
                    .cell {
                        overflow: initial;
                    }
                }
                .foldIcon {
                    cursor: pointer;
                    margin-top: 5px;
                    width: 0;
                    height: 0;
                    border-top: 10px solid transparent;
                    border-left: 15px solid #ddd;
                    border-bottom: 10px solid transparent;
                    transition: all 0.3s ease;
                    &.bottom {
                        border-left: 15px solid #36AEDB;
                        transform: rotate(90deg);
                    }
                }
                .fea {
                    /*transition: all 0.01s ease;*/
                }
            }

        }
        .stratList { // 策略下拉列表
            width: 310px;
        }
        .pages_variableName {
            /*overflow: hidden;*/
            /*padding-bottom: 12px;*/
        }
        .frItem {
            border-bottom: 1px solid #ededed;
            margin-bottom: 10px;
            text-align: left;
            &:last-child {
                border-bottom: 0;
                margin-bottom: 0;
            }
        }
        .varNameItem {
            padding: 0 10px;
            .varName {
                height: 40px;
            }
            .el-form-item {
                margin-bottom: 0;
            }
        }
        .ruleConItem {
            position: relative;
            /*overflow: hidden;*/
            // 为了显示条件范围虚线
            height: 40px;
            padding: 0 10px;
            &.mg_t-20 {
                margin-top: -19px;
                margin-bottom: 19px;
                /*&:before{// 参考线
                    content:'';
                    position:absolute;
                    top:14px;
                    left:-500px;
                    width: 1000px;
                    height: 1px;
                    background: #ccc;
                }*/
            }
            .ruleConItemCell {
                position: relative;
                float: left;
                margin-top: 0;
                .operationArray { // 枚举类型超出隐藏
                    .el-tag {
                        .el-select__tags-text {
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            /*max-width: 85px;*/
                            vertical-align: bottom;
                            display: inline-block;
                        }
                    }
                }
                .ruleConOpen { // 展开所有变量操作符及操作值的图标
                    line-height: 30px;
                    margin-right: 10px;
                    transform: rotate(-90deg);
                    img.bottom {
                        transform: rotate(180deg);
                    }
                }
            }
            .ruleConOpr {
                line-height: 30px;
            }
            .set, .back {
                margin: 5px;
            }
            &.areaLine { // 多个条件
                &:before { /** Jim修改于2018-10-16 18:31:01 @评分卡改版 */
                    content: none;
                    height: 1px;
                    border-top: 1px dashed #E4E7F2;
                    position: absolute;
                    top: 16px;
                    left: 10px;
                    right: 190px;
                }
                .ruleConLogic {
                    &:before { /** Jim修改于2018-10-16 18:31:01 @评分卡改版 */
                        content: none; /** Jim修改于2018-09-28 18:20:28 @.ruleConOpr垂直居中后，不需要了 */
                        width: 20px;
                        height: 1px;
                        border-top: 1px dashed #E4E7F2;
                        position: absolute;
                        left: -20px;
                        top: 16px;
                    }
                }
                .ruleConOpr {
                    /*margin-top: 20px;*/
                }
            }
        }

        .table_tr { // 为了显示条件范围虚线
            .td_term {
                .frItem {
                    position: relative;
                    &:before { // 纵向虚线/** Jim修改于2018-10-16 18:31:01 @评分卡改版 */
                        content: none;
                        width: 1px;
                        border-left: 1px dashed #E4E7F2;
                        position: absolute;
                        top: 18px;
                        bottom: 25px;
                        right: 188px;
                    }
                }
            }
            .ruleConItemCell {
                background: #fff;
                transition: all 0.3s ease;
            }
            &:hover { // 悬停背景颜色附和表格
                .ruleConItemCell {
                    background: #F0FAFF;
                }
            }
        }
        /** Jim修改于2018-09-28 18:10:33 @组件样式冲突 */
        .pages_variableCon .ruleConItemCell:first-child {
            margin-left: 0;
            margin-top: 0;
        }
        .rotate0 {
            transition: all 0.3s ease;
            transform: rotate(0deg);
        }
        .rotate180 {
            transition: all 0.3s ease;
            transform: rotate(180deg);
        }
        .el-table {
            /*border: 1px solid #ccc;*/
            .table_th {
                /*border-bottom: 1px solid #ccc;*/
            }
            .table_tr {
                .table_td {
                    border-bottom: 1px solid #ccc;
                }
            }
        }
    }

    .uml_modelAddForm {
        padding: 10px;
        &.item_b_0 {
            .el-form-item {
                margin-bottom: 0;
            }
        }
        .mg_b_0 {
            margin-bottom: 0;
        }
        .moldRemark {
            .el-form-item__content {
                .el-textarea__inner {
                    padding-bottom: 16px;
                }
                .counter {
                    line-height: 20px;
                    position: absolute;
                    right: 15px;
                    bottom: 0;
                }
            }
            &.look {
                .el-form-item__content {
                    padding: 12px 0 0 15px;
                    line-height: 1.5;
                }
            }
        }
        /* 表格里面输入框查看状态 */
        .el-input, .el-textarea {
            &.is-disabled {
                &, * {
                    border: 0;
                    background: #fff;
                    color: #333;
                    cursor: auto;
                    .el-input__suffix {
                        display: none;
                    }
                }
            }
        }
    }
</style>
