<template>
    <div class="detailIndex">
        <div class="menuDiv">
            <div class="formDiv">
                <div class="selectDiv">
                    <el-select v-model="projectType" placeholder="产品名称" size="small">
                        <el-option v-for="item,index in typeList"
                                   :key="index"
                                   :label="item.productName"
                                   :value="item.appId"></el-option>
                    </el-select>
                    <el-select v-model="projectId" placeholder="请选择名称" size="small" filterable class="name">
                        <el-option v-for="item,index in projectList"
                                   :key="index"
                                   :label="item.moldName"
                                   :value="item.moldCode"></el-option>
                    </el-select>
                </div>

                <div class="timeDiv">
                    <span>统计时间：</span>
                    <el-date-picker
                        v-model="rangeDate"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        size="small">
                    </el-date-picker>
                </div>
                <div class="timeRangeDiv">
                    <p v-for="item,index in dateRangeList" :class="index==dateCurrent?'hover':''"
                       @click="dateRangeClick(item,index)">
                        {{item.name}}
                    </p>
                </div>
                <div class="btnDiv">
                    <el-button type="primary" size="small" @click="searchBtn">查询</el-button>
                </div>
            </div>
            <div class="outBtnDiv">
                <el-button size="small" icon="el-icon-upload2" @click="outExcel">导出数据</el-button>
            </div>
        </div>
        <div class="mainDiv">
            <outFraud ref="outFrand" v-if="projectName=='1'" :outfraud="outFraudData" :ruleData="outFraudRuleData"
                      @listenRule="getRuleData"></outFraud>

            <score v-if="projectName=='4'" :score="scoreData"></score>
            <credit v-if="projectName=='3'" :credit="creditData"></credit>
            <!--<noData img="noData" class="noData" p2="请选择产品"/>-->

        </div>
    </div>
</template>

<script>
    import outFraud from '../../../components/pc/control/outFraud'
    import credit from '../../../components/pc/control/credit'
    import score from '../../../components/pc/control/score'
    import {formatDate, formatDay} from "../../../config/format";
    import noData from '../../../components/pc/noData/noData'


    export default {
        name: "detailIndex",
        data() {
            return {
                typeList: [],
                projectType: '',         // 产品类型
                projectList: [],
                projectName: '',         // 产品名称
                projectId: '',         // 产品id
                rangeDate: '',           // 统计时间
                dateRangeList: [
                    {name: '今天', value: '0'},
                    {name: '昨天', value: '1'},
                    {name: '最近7天', value: '6'},
                    {name: '最近30天', value: '30'}
                ],
                dateCurrent: '',
                startDate: '',           // 初始时间
                endDate: '',           // 初始时间


                creditData: {},          // 授信的对象
                outFraudData: {},          // 反欺诈业务的对象
                outFraudRuleData: {},          // 反欺诈规则的对象
                scoreData: {},               // 评分卡对象
                ruleType: '1',       // 用来记录规则数据中的type值
            }
        },
        components: {outFraud, credit, score, noData},
        created() {
            // 评分卡选择评分分段
            this.$bus.$on('switchScore', val => {
                this.getScord(val)
            })
            this.$bus.$on('switchCredit', val => {
                this.getCredit(val)
            })
            this.$bus.$on('outCsv', val => {
                this.getScordDetail(val)
            })
        },
        mounted() {
            this.startDate = `${formatDate(new Date(new Date().getTime()), 'yyyy-MM-dd')} 00:00:00`
            this.endDate = formatDate(new Date(new Date().getTime()), 'yyyy-MM-dd hh:mm:ss')
            this.getProList()
            this.searchBtn()
        },
        computed: {
            startEnd() {
                return new Date(this.endDate).getTime() - new Date(this.startDate).getTime() > 432000000 ? this.$local.set('dateEq', 1) : this.$local.set('dateEq', -1)
            }
        },
        methods: {
            // 查询
            searchBtn() {
                this.getData()
            },
            // 获取产品线列表
            getProList() {
                this.$post('/mcs/product/list', {
                    pageNo: -1
                })
                    .then(res => {
                        // this.projectType = res.productList[0].appId
                        this.typeList = res.productList
                    })
            },
            // 获取模型列表，根据产品线列表中产品线id=》appId
            getModelList() {
                this.$post('/mcs/mold/code/list', {
                    appId: this.projectType,
                    pageNo: -1
                })
                    .then(res => {
                        this.projectList = res.moldList
                        // this.projectName = this.projectList[0].moldType
                        // this.projectId = this.projectList[0].moldCode
                        // this.getData()
                    })
            },
            // 反欺诈
            //业务数据
            getBusinessData() {
                this.$post('/mcs/monitor/statistic/af/model/result', {
                    partnerId: this.$getCookie('businessCode'),
                    appId: this.projectType,
                    modelId: this.projectId,
                    startTime: this.startDate,
                    endTime: this.endDate
                })
                    .then(res => {
                        this.outFraudData = res
                    })
            },
            // 规则数据
            getRuleData(val) {
                this.ruleType = val
                let url = '/mcs/monitor/statistic/rule/result/by/name'
                switch (this.ruleType) {
                    case 1:
                        url = '/mcs/monitor/statistic/rule/result/by/name'
                        break;
                    case 2:
                        url = '/mcs/monitor/statistic/policy/result'
                        break;
                    case 3:
                        url = '/mcs/monitor/statistic/rule/result/by/code'
                        break;
                }
                this.$post(url, {
                    partnerId: this.$getCookie('businessCode'),
                    appId: this.projectType,
                    modelId: this.projectId,
                    startTime: this.startDate,
                    endTime: this.endDate
                })
                    .then(res => {
                        this.outFraudRuleData = res
                    })
            },
            // 评分卡
            // 评分卡概览
            getScord(segment) {
                this.$post('/mcs/monitor/statistic/card/model/result', {
                    partnerId: this.$getCookie('businessCode'),
                    appId: this.projectType,
                    modelId: this.projectId,
                    startTime: this.startDate,
                    endTime: this.endDate,
                    segment: segment == '' ? '50' : segment
                })
                    .then(res => {
                        this.scoreData = res
                    })
            },
            // 评分卡详情生成导出列表
            getScordDetail(segment) {
                this.$post('/mcs/monitor/statistic/card/model/result/detail', {
                    partnerId: this.$getCookie('businessCode'),
                    appId: this.projectType,
                    modelId: this.projectId,
                    startTime: this.startDate,
                    endTime: this.endDate,
                    segment: segment == '' ? '50' : segment
                })
                    .then(res => {
                        let sortData = Object.keys(res[0]).sort()
                        this.$exportCSV(res, sortData)
                    })
            },

            // 授信
            getCredit(segment) {
                this.$post('/mcs/monitor/statistic/credit/model/result', {
                    partnerId: this.$getCookie('businessCode'),
                    appId: this.projectType,
                    modelId: this.projectId,
                    startTime: this.startDate,
                    endTime: this.endDate,
                    segment: segment == '' ? '2000' : segment
                })
                    .then(res => {
                        this.creditData = res
                    })
            },

            // 日期范围查询
            dateRangeClick(val, index) {
                this.rangeDate = ''
                this.dateCurrent = index
                this.startDate = `${ formatDate(new Date(new Date().getTime() - 3600 * 24 * 1000 * val.value), 'yyyy-MM-dd')} 00:00:00`
                this.endDate = val.value == '1' ? `${formatDate(new Date(new Date().getTime()), 'yyyy-MM-dd')} 00:00:00` : formatDate(new Date(new Date().getTime()), 'yyyy-MM-dd hh:mm:ss')
                this.getData()
            },

            // 根绝projectName请求数据
            getData() {
                switch (this.projectName) {
                    case 1:
                        switch (this.ruleType) {
                            case 1:
                                this.getRuleData(this.ruleType)
                                break;
                            case 2:
                                this.getRuleData(this.ruleType)
                                break;
                            case 3:
                                this.getRuleData(this.ruleType)
                                break;
                        }
                        this.getBusinessData()
                        break;
                    case 3:
                        this.getCredit(2000)
                        break;
                    case 4:
                        this.getScord(50)
                        break;
                }

            },

            // getOutData(url) {
            //     this.$post('',{})
            // },

            outExcel() {
                console.log('导出数据')
                switch (this.projectName) {
                    case 1:
                        if (this.$refs['outFrand'].activeName=='1') {
                            this.$post('/mcs/monitor/statistic/af/model/result/export', {
                                partnerId: this.$getCookie('businessCode'),
                                appId: this.projectType,
                                modelId: this.projectId,
                                startTime: this.startDate,
                                endTime: this.endDate
                            })
                                .then(res => {
                                    this.$exportCSV(res)

                                })
                        } else if (this.$refs['outFrand'].activeName=='2') {
                            let url = '/mcs/monitor/statistic/rule/result/by/name'
                            switch (this.ruleType) {
                                case 1:
                                    url = '/mcs/monitor/statistic/rule/result/by/name/export'
                                    break;
                                case 2:
                                    url = '/mcs/monitor/statistic/policy/result/export'
                                    break;
                                case 3:
                                    url = '/mcs/monitor/statistic/rule/result/by/code/export'
                                    break;
                            }
                            this.$post(url, {
                                partnerId: this.$getCookie('businessCode'),
                                appId: this.projectType,
                                modelId: this.projectId,
                                startTime: this.startDate,
                                endTime: this.endDate
                            })
                                .then(res => {
                                    this.$exportCSV(res)
                                })
                        }

                        break;
                    case 3:
                        this.$post('/mcs/monitor/statistic/credit/model/result/export', {
                            partnerId: this.$getCookie('businessCode'),
                            appId: this.projectType,
                            modelId: this.projectId,
                            startTime: this.startDate,
                            endTime: this.endDate,
                            segment: segment == '' ? '2000' : segment
                        })
                            .then(res => {
                                this.$exportCSV(res)

                            })
                        break;
                    case 4:
                        this.$post('/mcs/monitor/statistic/card/model/result/export', {
                            partnerId: this.$getCookie('businessCode'),
                            appId: this.projectType,
                            modelId: this.projectId,
                            startTime: this.startDate,
                            endTime: this.endDate,
                            segment: segment == '' ? '50' : segment
                        })
                            .then(res => {
                                this.$exportCSV(res)
                            })
                        break;
                }
            },
        },
        watch: {
            rangeDate(val) {
                if (val == '') {

                } else {
                    this.startDate = val[0]
                    this.endDate = val[1]
                    this.dateCurrent = -1
                    this.getData()
                }

            },
            projectType(val) {
                this.projectId = ''
                this.getModelList()
            },
            projectId(val) {
                this.projectList.map((item, index) => {
                    if (item.moldCode == val) {
                        this.projectName = this.projectList[index].moldType
                    }
                })
                this.dateRangeClick({value: 0}, 0)
            },
            startEnd(val) {
            }
        },
        // beforeDestroy(){
        //     this.$bus.$off('getScoreListData')
        // }
    }
</script>

<style lang="scss">
    .detailIndex {
        .timeDiv {
            .el-date-editor {
                width: 400px;
                .el-range-separator {
                    padding: 0 !important;
                }
            }
        }
    }

    .el-input.is-disabled .el-input__inner {
        background-color: transparent !important;
    }

    .el-time-spinner__item {
        &:hover {
            background-color: #eee !important;
        }
    }
</style>
<style scoped lang="scss">
    @import "../../../resource/style/base/var";

    .detailIndex {
        background-color: $fff;
        position: relative;
        border-left: 1px solid #e6e6e6;
        box-shadow: 4px 0px 5px 0 #eaeaea inset;

    }

    .noData {
        padding: 186px 0;
    }

    .menuDiv {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30px 40px 14px;
    }

    .formDiv {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        > div {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-right: 20px;
        }
        .selectDiv {
            .el-select {
                width: 130px;
                margin-right: 20px;
            }
            .name {
                width: 200px;
            }
        }

        .timeDiv {
            .el-date-editor {
                width: 400px;
            }
        }
        .timeRangeDiv {
            p {
                cursor: pointer;
                padding: 2px 10px;
                margin-right: 10px;
                &:hover {
                    background-color: $blue_hov;
                    color: $fff;
                    -webkit-border-radius: 4px;
                    -moz-border-radius: 4px;
                    border-radius: 4px;
                }
            }
            .hover {
                background-color: $blue;
                color: $fff;
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
            }
        }
        .btnDiv {
            .el-button {
                width: 80px;
            }
        }
    }

    .mainDiv {
        padding: 0 40px;
    }
</style>
