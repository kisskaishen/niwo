<template>
    <div class="pages_scoreCardForm">
    <!--<div class="pages_scoreCardForm" v-loading="loading">-->
        <el-form class="scoreCard" :model="scoreCard" status-icon ref="scoreCard">
            <el-form-item>
                <el-select :popper-append-to-body="true" class="w310"
                           :class="{'solid_red':vLock&&!scoreCard.scorecardId}" v-model.number="scoreCard.scorecardId"
                           filterable placeholder="请选择评分卡模型" size="medium" no-match-text="查询无结果" no-data-text="暂无数据"
                           popper-class="stratList" @change="changeSD" :disabled="$route.query.type=='look'">
                    <el-option v-for="(scoreCardTmpl,scoreCardIndex) in scoreCardlList" :key="scoreCardIndex"
                               :label="scoreCardTmpl.moldName" :value="scoreCardTmpl.id">
                        <div class="stratOption overhide" :title="scoreCardTmpl.moldName">
                            {{scoreCardTmpl.moldName}}V.{{scoreCardTmpl.moldVersion}}
                        </div>
                    </el-option>
                </el-select>
            </el-form-item>
            <div class="creditInfoDiv" v-if="!!scoreCard.scorecardId">
                <p>风险定价模型过程变量：</p>
                <ul>
                    <li>
                        <p>变量名称（中文）</p>
                        <p>类型</p>
                        <p>映射</p>
                        <p>备注</p>
                    </li>
                    <li>
                        <p>{{creditInfo.variableName}}</p>
                        <p>
                            {{creditInfo.variableType=='1'?'字符串':creditInfo.variableType=='2'?'整型':
                            creditInfo.variableType=='3'?'浮点型':creditInfo.variableType=='4'?'日期型':
                            creditInfo.variableType=='5'?'枚举型':creditInfo.variableType=='6'?'布尔型':''}}</p>
                        <p>评分总和</p>
                        <p>{{creditInfo.remark}}</p>
                    </li>
                </ul>
            </div>
            <div class="text-center" v-if="$route.query.type!='look'">
                <el-button class="" type="primary" size="medium" @click="bindscoreCard">保存</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: 'pages_scoreCardForm',
        data() {
            return {
                loading:true,
                pageName: 'pages_scoreCardForm',
                scoreCard: {
                    nodeId: '',// 节点ID    Number  Y
                    nodeName: '评分卡',
                    scorecardId: '',// 评分卡ID   Number  Y
                    scorecardName: '评分卡',
                },
                scoreCardlList: [],
                isNewNode: true,// 是否是新节点
                vLock: false,

                localIndex: '-1',
                creditInfo: {}

            }
        },
        created() {
            this.scoreCard.nodeId = this.$route.query.nodeId;
            this.getScorecardList();
        },
        methods: {
            getScorecardList() {// 3.2.51模型配置—获取AB测试节点内容
                this.$post('/mcs/mold/config/list', {
                    appId: this.$route.query.appId,
                    moldType: this.$route.query.needMoldType,
                })
                    .then(res => {
                        this.scoreCardlList = res.moldList;
                        console.log(this.scoreCardlList)

                        if (this.$local.get('scoreListId') && JSON.stringify(this.$local.get('scoreList')) != '{}') {
                            this.scoreCard.scorecardId = this.$local.get('scoreListId')
                            this.$local.get('scoreList').map((item, index) => {
                                if (item.id == this.scoreCard.scorecardId) {
                                    this.localIndex = index
                                }
                            })
                        }
                        this.getSelected();
                        this.loading = false

                    })
            },

            getSelected() {
                this.$post('/mcs/node/mold/query', {
                    nodeId: this.$route.query.nodeId.slice(4)
                })
                    .then(res => {
                        console.log(!res.bindMoldList)
                        if (res.bindMoldList.length>0) {
                            this.scoreCard.scorecardId = res.bindMoldList[this.$local.get('formIndex')-1||0].bindId
                            this.scoreCard.scorecardName = res.bindMoldList[this.$local.get('formIndex')-1||0].bindName
                        } else {
                            this.scoreCard.scorecardId =''
                        }
                        this.scoreCard.id = this.scoreCard.scorecardId
                        this.scoreCardlList.map((item,index)=>{
                            if (this.scoreCard.id==item.id) {
                                this.getVariableList(item.moldCode)
                            }
                        })
                        {// 撤销恢复：记录绑定的初始版本
                            let data = JSON.parse(JSON.stringify(res))
                            data.nodeName = this.scoreCard.scorecardName;
                            data.nodeId = this.$route.query.nodeId;
                            data.clear = res.bindMoldList.length > 0 ? false : true;

                            if(res){
                                data.bindMoldList = res.bindMoldList;
                            }else{
                                data.bindMoldList = [];
                            }
                            this.$emit('firstBindPush', data)
                        }

                    })
            },

            // 获取变量信息
            getVariableList(modeCode) {
                this.$post('/mcs/mold/variable/query', {
                    moldCode: modeCode,
                    appId: this.$route.query.appId
                })
                    .then(res => {
                        console.log(res)
                        this.creditInfo = res
                    })
            },
            changeSD(val) {
                this.scoreCardlList.map((item, index) => {
                    if (item.id == val) {
                        this.scoreCard.scorecardName = item.moldName;
                        Object.assign(this.scoreCard, this.scoreCardlList[index])
                        this.getVariableList(item.moldCode)
                    }
                })
            },
            bindscoreCard() {// 3.2.50模型配置--绑定AB测试节点
                if (this.$route.query.from == 'kingForm') {
                    let localArr = JSON.stringify(this.$local.get('formList')) != '{}' ? this.$local.get('formList') : []
                    console.log(this.$local.get('formIndex'))
                    if (this.$local.get('formIndex')) {
                        localArr[this.$local.get('formIndex')-1] = this.scoreCard
                    } else {
                        localArr.push(this.scoreCard)
                    }
                    console.log(localArr)
                    this.$local.set('formList', localArr)
                    this.$router.push(this.$route.fullPath.replace('/scoreCardForm', '/kingForm'))
                } else {
                    let data = JSON.parse(JSON.stringify(this.scoreCard))
                    data.bindId = data.bindId || data.id || data.scorecardId
                    data.bindName = data.scorecardName
                    let arr = []
                    arr.push(data)
                    console.log(data)
                    if (data.scorecardId) {
                        this.$post('/mcs/node/mold/bind', {
                            nodeId: this.$route.query.nodeId.slice(4),
                            bindMoldList: arr,
                        })
                            .then(res => {
                                this.$message.success('绑定成功')
                                data.nodeName = this.scoreCard.scorecardName;
                                data.nodeId = this.$route.query.nodeId;
                                this.$emit('saveForm', {
                                    bindMoldList:arr,
                                    formType: 'policy',
                                    nodeId:this.$route.query.nodeId,
                                    nodeName:this.scoreCard.scorecardName
                                });// 关闭弹窗
                            })
                    } else {
                        this.$notify({// 通知提示
                            message: '请选择评分卡模型',
                            type: 'warning',
                            customClass: 'pos-bindscoreCard',
                        })
                    }
                }
            },


        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    .pages_scoreCardForm {
        min-width: 313px;
        padding-top: 30px;
        .creditInfoDiv {
            margin-bottom: 20px;
            ul {
                display: flex;
                flex-direction: column;
                align-content: center;
                border: 1px solid #ccc;
                li {
                    display: flex;
                    justify-content: space-between;
                    align-content: center;
                    border-bottom: 1px solid #ccc;
                    p {
                        width: 120px;
                        word-break: break-word;
                        white-space:normal;
                        padding: 6px 0;
                        text-align: center;
                        border-right:1px solid #ccc ;
                    }
                }
            }
        }
    }
</style>
