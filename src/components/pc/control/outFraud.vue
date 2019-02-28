<template>
    <div class="outFraud">
        <el-tabs v-model="activeName" @tab-click="handleClick" v-if="isList!=''">
            <el-tab-pane label="业务数据" name="1">
                <ul class="pandectDiv">
                    <li>
                        <p>
                            <label>{{outFrautBusinessData.totalCount || 0}}</label>
                        </p>
                        <span>调用量</span>
                        <i></i>
                    </li>
                    <li>
                        <p>
                            <label>{{parseInt(outFrautBusinessData.refusePercent * 100|| 0) }}%</label>
                            <span>{{parseInt(outFrautBusinessData.refuseCount || 0) }}件</span>
                        </p>
                        <span>拒绝</span>
                        <i></i>
                    </li>
                    <li>
                        <p>
                            <label>{{parseInt(outFrautBusinessData.reviewPercent * 100 || 0)}}%</label>
                            <span>{{parseInt(outFrautBusinessData.reviewCount || 0)}}件</span>
                        </p>
                        <span>人工</span>
                        <i></i>
                    </li>
                    <li>
                        <p>
                            <label>{{parseInt(outFrautBusinessData.acceptPercent*100 || 0)}}%</label>
                            <span>{{parseInt(outFrautBusinessData.acceptCount || 0)}}件</span>
                        </p>
                        <span>通过</span>
                        <i></i>
                    </li>
                    <li>
                        <p>
                            <label>{{outFrautBusinessData.avgCostTime || 0}}ms</label>
                        </p>
                        <span>平均响应时长</span>
                    </li>
                </ul>

            </el-tab-pane>
            <el-tab-pane label="规则数据" name="2">
                <el-radio-group v-model="typeData" size="mini" class="ruleType">
                    <el-radio-button :label="1">规则名称</el-radio-button>
                    <el-radio-button :label="2">策略名称</el-radio-button>
                    <el-radio-button :label="3">决策代码</el-radio-button>
                </el-radio-group>
            </el-tab-pane>
            <!--{{optionRule.series[0].data}}-->
        </el-tabs>
        <noData img="noData" class="noData" p2="暂无数据" v-if="activeName=='1'&&isList==''"/>
        <noData img="noData" class="noData" p2="暂无数据" v-if="activeName=='2'&&outFrautRuleData.detailList==''"/>

        <outFraud-businessEchart :optionData="optionBusiness"
                                 v-else-if="activeName=='1'&&isList!=''"></outFraud-businessEchart>
        <outFrand-ruleEchart :optionData="optionRule" :typeDataVal="typeData"
                             v-else-if="activeName=='2'&&outFrautRuleData.detailList!=''"></outFrand-ruleEchart>
        <!--<div id="outFraudBusiness" v-if="activeName=='1'"></div>-->
        <!--<div id="outFraudRule" v-if="activeName=='2'"></div>-->

        <!--<noData img="noData" p2="暂无数据" v-if="ruleData.detailList==''"/>-->


    </div>
</template>

<script>
    import outFraudBusinessEchart from '../../echarts/outFraudBusiness'
    import outFrandRuleEchart from '../../echarts/outFrandRule'
    import noData from '../../../components/pc/noData/noData'

    export default {
        props: ['outfraud', 'ruleData'],
        name: "outFraud",
        data() {
            return {
                activeName: '1',
                typeData: '1',
                isList:'',
                businessChart: null,
                ruleChart: null,
                fullscreenLoading:true,
                // 业务数据配置
                optionBusiness: {
                    title: {
                        text: '模型结果数据',
                        textStyle: {
                            color: '#292E32',
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontSize: 14
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            let res = ''
                            // console.log(params)
                            // params.map(item=>{
                            //     console.log(item.value)
                            // })
                            let totalNum = params.reduce((sum, itemchild, index, arr) => {
                                sum += parseInt(itemchild.value)
                                if (sum == 0) {
                                    return 0.00000000001;
                                } else {
                                    return sum;
                                }
                            }, 0)
                            res = params[0].name + '<br/>'
                            params.map((item, index) => {
                                res += item.seriesName + ':' + item.value + '(' + (item.value / totalNum).toFixed(4) * 10000 / 100 + '%)<br/>'
                            })
                            return res;
                        }
                        // formatter:'{a}:{b}:{c}:{d}'
                    },
                    grid: {
                        left: '40',
                        top: '88'
                    },
                    legend: {
                        icon: 'stack',
                        x: 'left',
                        left: '154',
                        itemWidth: 22,//图例的高度
                        itemHeight: 4,//图例的高度
                        data: ['拒绝数', '通过数', '人工审核数']
                    },

                    xAxis: {
                        name: '时间',
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#E4E7F2',
                            }

                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#6C7380'
                            }
                        },
                        data: []
                    },
                    yAxis: {
                        name: '次数',
                        type: 'value',
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#E4E7F2',
                            }

                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#6C7380'
                            }
                        },
                    },
                    series: [
                        {
                            name: '拒绝数',
                            type: 'line',
                            // stack: '总量',
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        color: '#FF7A6F'
                                    },
                                    color: '#FF7A6F'
                                }
                            },
                            data: []
                        },
                        {
                            name: '通过数',
                            type: 'line',
                            // stack: '总量',
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        color: '#40BDEC'
                                    },
                                    color: '#40BDEC'
                                }
                            },
                            data: []
                        },
                        {
                            name: '人工审核数',
                            type: 'line',
                            // stack: '总量',
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        color: '#42CFC6'
                                    },
                                    color: '#42CFC6'
                                }
                            },
                            data: []
                        }
                    ],
                },
                // 规则数据配置
                optionRule: {
                    title: {
                        text: '概况统计：规则名称',
                        textStyle: {
                            color: '#292E32',
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontSize: 14
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        // formatter:function (val) {
                        //     console.log(val)
                        // }
                        // formatter:'{b}:{c}:{d}'
                        formatter: function (params, ticket, callback) {
                            var res = ''
                            let totalNum = params.reduce((sum, itemchild, index, arr) => {
                                sum += parseInt(itemchild.data)
                                return arr[2].data
                            }, 0)
                            params.map((item, index) => {
                                let result0 = (parseInt(params[0].data) / parseInt(totalNum)).toFixed(4) * 1000000 / 10000;
                                let result1 = (parseInt(params[1].data) / parseInt(totalNum)).toFixed(4) * 1000000 / 10000;
                                if (item.seriesName == '异常') {
                                    res += '异常:' + item.data + '次(' + result1 + '%)' + '<br/>';
                                } else if (item.seriesName == '命中') {
                                    res += '命中:' + item.data + '次(' + result0 + '%)' + '<br/>';
                                } else {
                                    res += '总计：' + totalNum + '次'
                                }

                            })
                            return res;
                        }
                    },

                    legend: {
                        icon: 'stack',
                        x: 'left',
                        left: '154',
                        data: ['命中', '异常']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },

                    xAxis: {
                        type: 'value',
                        show: false,
                        // 坐标轴线
                        axisLine: {
                            lineStyle: {
                                width: '0'
                            }
                        },

                        // 刻度线
                        axisTick: {
                            show: false,
                            alignWithLabel: true
                        },
                        // formatter:'{a}:{b}:{c}:{d}',
                        axisLabel: {},
                        splitLine: {show: false}
                    },

                    yAxis: {
                        type: 'category',
                        inverse: true,
                        axisLine: {
                            lineStyle: {
                                width: '0'
                            }
                        },
                        axisLabel: {
                            interval: 0,
                        },
                        axisTick: {
                            show: false
                        },
                        data: [],
                    },
                    series: [
                        {
                            name: '命中',
                            type: 'bar',
                            stack: '总量',
                            data: [],
                            barWidth: 30,
                            // barGap: 40,
                            // barCategoryGap: 40,
                            show: true,
                            label: {
                                normal: {
                                    show: false,            //显示数字
                                    position: 'insideRight',        //这里可以自己选择位置
                                },


                            },
                            // 柱状图颜色
                            itemStyle: {
                                normal: {
                                    color: '#FFD052',
                                    label: {
                                        show: true,
                                    },
                                },

                            },
                        },
                        {
                            name: '异常',
                            type: 'bar',
                            data: [],
                            barWidth: 30,
                            // barGap: 40,
                            // barCategoryGap: 40,

                            stack: '总量',
                            show: true,
                            label: {
                                normal: {
                                    show: false,            //显示数字
                                    position: 'insideRight',        //这里可以自己选择位置
                                },

                            },
                            // 柱状图颜色
                            itemStyle: {
                                normal: {
                                    color: '#fd7c28',
                                    label: {
                                        show: true,
                                    },
                                },
                            },
                        },
                        {
                            name: '总计',
                            type: 'bar',
                            data: [],
                            barWidth: 30,
                            // barGap: 40,
                            // barCategoryGap: 40,

                            stack: '总量',
                            show: true,
                            label: {
                                normal: {
                                    show: true,            //显示数字
                                    position: 'insideLeft',        //这里可以自己选择位置
                                    textStyle: {color: '#000'},
                                    formatter: function (val) {
                                        return '总计：' + val.value + '次'
                                    }
                                }
                            },
                            // 柱状图颜色
                            itemStyle: {
                                normal: {
                                    color: 'rgba(128, 128, 128, 0)'
                                }
                            },
                        }
                    ]
                },
            }
        },
        mounted() {
            this.drawLine();
        },
        computed: {
            outFrautBusinessData() {
                return this.outfraud
            },
            outFrautRuleData() {
                return this.ruleData
            }
        },
        components: {outFraudBusinessEchart, outFrandRuleEchart, noData},
        methods: {
            // 业务数据/规则数据切换
            handleClick(tab, event) {
                if (tab.name == '1') {
                    this.drawLine()
                } else if (tab.name == '2') {
                    this.typeData = '1'
                    this.$emit('listenRule', 1)
                    this.drawRule()
                }
            },

            // 业务数据
            drawLine() {
                this.businessChart = this.$echarts.init(document.getElementById('outFraudBusiness'))
                this.businessChart.setOption(this.optionBusiness)

            },
            // 规则数据
            drawRule() {
                this.ruleChart = this.$echarts.init(document.getElementById('outFraudRule'))
                let autoHeight = this.optionRule.series[0].data.length * 40 + 100
                this.ruleChart.resize({height: autoHeight});
                this.ruleChart.setOption(this.optionRule)
            }


        },
        watch: {
            // 业务数据
            outFrautBusinessData(val) {
                let acceptArr = []
                let refuseArr = []
                let reviewArr = []
                let xValue = []
                val.detailList.map((item, index) => {
                    acceptArr.push(item.acceptCount)
                    refuseArr.push(item.refuseCount)
                    reviewArr.push(item.reviewCount)
                    // item.endTime = `${item.endTime.substring(11,16)}${item.endTime.substring(0,10)}`
                    if (this.$local.get('dateEq') == '1') {
                        xValue.push(`${item.startTime.substring(0, 10)}`)
                    } else {
                        xValue.push(`${item.endTime.substring(11, 16)}\n${item.endTime.substring(0, 10)}`)
                    }
                    // xValue.push(`${item.endTime.substring(0,16)}`)
                    // xValue.push(`${item.startTime.substring(0,16)}-${item.endTime.substring(0,16)}`)
                })
                this.optionBusiness.series[0].data = refuseArr
                this.optionBusiness.series[1].data = acceptArr
                this.optionBusiness.series[2].data = reviewArr
                this.optionBusiness.xAxis.data = xValue
                this.isList = val.detailList
                this.drawLine()
            },

            // 规则数据
            outFrautRuleData(val) {
                let dataValue = []
                let dataValue1 = []
                let dataValuetotal = []
                let yValue = []

                val.detailList.map((item, index) => {
                    dataValue.push(`${item.hitCount}`)
                    dataValue1.push(`${item.exceptionCount}`)
                    // dataValue.push(item)
                    // dataValue1.push(item)
                    dataValuetotal.push(item.hitCount + item.exceptionCount)

                    yValue.push(item.label || item.policyName)
                })


                this.optionRule.yAxis.data = yValue
                this.optionRule.series[0].data = dataValue
                this.optionRule.series[1].data = dataValue1
                this.optionRule.series[2].data = dataValuetotal
                this.drawRule()


                switch (this.typeData) {
                    case 1:
                        this.optionRule.title.text = '概况统计：规则名称'
                        this.drawRule()

                        break;
                    case 2:
                        this.optionRule.title.text = '概况统计：策略名称'
                        this.drawRule()

                        break;
                    case 3:
                        this.optionRule.title.text = '概况统计：决策代码'
                        this.drawRule()

                        break;
                }
            },
            // 规则数据里面的切换
            typeData(val) {
                this.ruleChart = null;
                this.$emit('listenRule', val)
            },

        }
    }
</script>

<style lang="scss">
    .outFraud {
        .el-tabs__item.is-active {
            color: #333 !important;
            font-size: 18px !important;
        }
        .ruleType {
            .el-radio-button__orig-radio:checked + .el-radio-button__inner {
                background-color: #fff;
                color: #3EA1FC;
                border: 1px solid #3EA1FC;
                box-shadow: 0px 0 0 0 #40bdec;
            }
            .el-radio-button__inner {
                -webkit-border-radius: 2px;
                -moz-border-radius: 2px;
                border-radius: 2px;
                &:hover {
                    color: #3EA1FC;
                }
            }

        }

    }
</style>

<style scoped lang="scss">
    .outFraud {
        padding-bottom: 40px;
    }

    .noData {
        padding: 164px 0;
    }

    .pandectDiv {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin: 36px 0 50px;
        li {
            position: relative;
            width: 286px;
            p {
                display: flex;
                justify-content: flex-start;
                align-items: baseline;
                margin-bottom: 14px;
                height: 26px;
                line-height: 26px;
                color: #333;
                label {
                    font-size: 32px;
                }
                span {
                    font-size: 18px;
                    margin-left: 20px;
                }
            }
            > span {
                font-size: 14px;
            }
            > i {
                display: block;
                position: absolute;
                right: 60px;
                top: 50%;
                margin-top: -10px;
                width: 1px;
                height: 20px;
                background-color: #E4E7F2;
            }
            &:nth-child(2) {
                p {
                    color: #FF7A6F;
                }
            }
            &:nth-child(3) {
                p {
                    color: #3FC5BC;
                }
            }
            &:nth-child(4) {
                p {
                    color: #40BDEC;
                }
            }
        }
    }

    .ruleType {
        margin: 10px 0 14px;

    }

    #outFraudBusiness {
        width: 100%;
        min-height: 450px;
        padding: 30px 20px;
        border: 1px solid #E4E7F2;
    }

    #outFraudRule {
        width: 100%;
        min-height: 502px;
        padding: 30px 20px;
        border: 1px solid #E4E7F2;
    }

</style>
