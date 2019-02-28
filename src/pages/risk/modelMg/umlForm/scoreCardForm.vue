<template>
    <div class="pages_scoreCardForm" >
    <!--<div class="pages_scoreCardForm" v-loading="loading">-->
        <el-form class="scoreCard" :model="scoreCard" status-icon ref="scoreCard">
            <el-form-item>
                <el-select :popper-append-to-body="true" class="w310"
                           :class="{'solid_red':vLock&&!scoreCard.scorecardId}" v-model.number="scoreCard.scorecardId"
                           filterable placeholder="请选择评分卡" size="medium" no-match-text="查询无结果" no-data-text="暂无数据"
                           popper-class="stratList" @change="changeSD" :disabled="$route.query.type=='look'">
                    <el-option v-for="(scoreCardTmpl,scoreCardIndex) in scoreCardlList" :key="scoreCardIndex"
                               :label="scoreCardTmpl.moldName" :value="scoreCardTmpl.id">
                        <div class="stratOption overhide" :title="scoreCardTmpl.moldName">
                            {{scoreCardTmpl.moldName}}V.{{scoreCardTmpl.moldVersion}}
                        </div>
                    </el-option>
                </el-select>
            </el-form-item>

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
                loading: false,
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
            }
        },
        created() {
            this.scoreCard.nodeId = this.$route.query.nodeId;
            this.getScorecardList();
        },
        methods: {
            // 模板列表
            getScorecardList() {
                this.$post('/mcs/mold/config/list', {
                    appId: this.$route.query.appId,
                    moldType: this.$route.query.needmoldtype,
                })
                    .then(res => {
                        this.scoreCardlList = res.moldList;

                        if (this.$local.get('scoreListId') && JSON.stringify(this.$local.get('scoreList')) != '{}') {
                            this.scoreCard.scorecardId = this.$local.get('scoreListId')
                            this.$local.get('scoreList').map((item, index) => {
                                if (item.id == this.scoreCard.scorecardId) {
                                    this.localIndex = index
                                }
                            })
                        }
                        this.getSelected();
                    })
            },

            getSelected() {
                this.$post('/mcs/node/mold/query', {
                    nodeId: this.$route.query.nodeId.slice(4)
                })
                    .then(res => {
                        console.log(res)
                        console.log(!!res.bindMoldList)
                        if (res.bindMoldList.length > 0) {
                            this.scoreCard.scorecardId = res.bindMoldList[this.$local.get('formIndex') - 1 || 0].bindId
                            this.scoreCard.scorecardName = res.bindMoldList[this.$local.get('formIndex') - 1 || 0].bindName
                        } else {
                            this.scoreCard.scorecardId = ''
                        }
                        this.scoreCard.id = this.scoreCard.scorecardId
                        this.scoreCardlList.map((item, index) => {
                            if (this.scoreCard.id == item.id) {
                                this.getVariableList(item.moldCode)
                            }
                        })
                        {// 撤销恢复：记录绑定的初始版本
                            let data = JSON.parse(JSON.stringify(res))
                            data.nodeName = this.scoreCard.scorecardName;
                            data.nodeId = this.$route.query.nodeId;
                            data.clear = !!res.bindMoldList;
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
                        this.creditInfo = res
                        this.loading = false
                    })
            },
            changeSD(val) {
                this.scoreCardlList.map((item, index) => {
                    if (item.id == val) {
                        this.scoreCard.scorecardName = item.moldName;
                        Object.assign(this.scoreCard, this.scoreCardlList[index])
                        this.getVariableList(item.moldCode)
                        console.log(this.scoreCard)
                    }
                })
            },
            bindscoreCard() {// 3.2.50模型配置--绑定AB测试节点
                if (this.$route.query.from == 'kingForm') {
                    let localArr = JSON.stringify(this.$local.get('scoreList')) != '{}' ? this.$local.get('scoreList') : []
                    if (this.$local.get('formIndex')) {
                        localArr[this.$local.get('formIndex') - 1] = this.scoreCard
                    } else {
                        localArr.push(this.scoreCard)
                    }
                    this.$local.set('scoreList', localArr)
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
                                    nodeDomId: this.$route.query.nodeId,
                                    nodeId: this.$route.query.nodeId.slice(4),
                                    nodeName: this.scoreCard.scorecardName,
                                    formType: 'policy',
                                    policyList: arr
                                });// 关闭弹窗
                            })
                    } else {
                        this.$notify({// 通知提示
                            message: '请选择评分卡',
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

    }
</style>
