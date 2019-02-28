<template>
    <div class="scoreDiv">
        <el-tabs v-model="scoreActive" v-if="isList!=''">
            <el-tab-pane label="概览" name="1">
                <ul class="pandectDiv">
                    <li>
                        <p>
                            <label>{{scoreData.totalCount || 0}}</label>
                        </p>
                        <span>调用量</span>
                        <i></i>
                    </li>
                    <li>
                        <p>
                            <label>{{scoreData.avgScore || 0}}</label>
                        </p>
                        <span>评分均值</span>
                        <i></i>
                    </li>
                    <li>
                        <p>
                            <label>{{scoreData.avgCostTime || 0}}ms</label>
                        </p>
                        <span>平均响应时长</span>
                    </li>
                </ul>
            </el-tab-pane>
            <el-tab-pane label="详情" name="2">

            </el-tab-pane>
        </el-tabs>
        <scoreEchart :optionData="optionScore" :tipData="scoreData"
                     v-if="scoreActive=='1'&&isList!=''"></scoreEchart>
        <noData img="noData" class="noData" p2="暂无数据" v-if="isList==''"/>

        <scoreTable v-else-if="scoreActive=='2'&&isList!=''"></scoreTable>
    </div>
</template>

<script>
    import scoreEchart from '../../echarts/score'
    import scoreTable from '../../echarts/scoreTable'
    import noData from '../../../components/pc/noData/noData'

    export default {
        name: "score",
        props: ['score'],
        data() {

            return {
                scoreActive: '1',
                myChart: null,
                isList:'',

                optionScore: {
                    title: {
                        text: '评分分布',
                        textStyle: {
                            color: '#292E32',
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontSize: 14
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        axisPointer: {
                            type: 'none'
                        },
                        // formatter:'{b}<br/>{a}:{c}人:{d}'
                        formatter: function (params) {
                            return params.data.dateRange + '<br/>' + '区间：' + params.data.name + '<br/>' + params.data.seriesName + ':' + params.data.value + '(' + (params.data.value / params.data.total).toFixed(4) * 1000000 / 10000 + '%)'
                        },
                        textStyle: {
                            fontSize: 12
                        }

                    },
                    grid: {
                        left: '40',
                        top: '88'
                    },

                    xAxis: {
                        name: '额度',
                        type: 'category',
                        // inverse: true,
                        splitLine: {show: true},
                        // axisLabel:{
                        //     interval:0,//横轴信息全部显示
                        // },

                        data: [],

                    },
                    yAxis: {
                        name: '用户数',
                        type: 'value',
                        splitLine: {show: true}
                    },
                    series: [
                        {
                            name: '用户数',
                            type: 'bar',
                            data: [
                                {name: 'name', seriesName: '用户数', value: 0, total: 1, dateRange: ''}
                            ],
                            barMaxWidth: 40,
                            // barWidth: 40,
                            // show: true,
                            // 柱状图颜色
                            itemStyle: {
                                normal: {
                                    color: '#FF9966'
                                }
                            },
                        }
                    ],
                }

            }
        },
        mounted() {
        },
        computed: {
            scoreData() {
                return this.score
            }
        },
        components: {scoreEchart, scoreTable, noData},
        methods: {
            // 业务数据/规则数据切换
            handleClick(tab, event) {
                // console.log(tab, event);
            },
            // 概览
            drawBar() {
                this.myChart = this.$echarts.init(document.getElementById('score'))
                this.myChart.setOption(this.optionScore)
            },
        },
        watch: {
            score(val) {
                let xValue = []
                let yValue = []
                val.detailList.map(item => {
                    xValue.push(`[${item.minScore},${item.maxScore})`)
                    // yValue.unshift(item.totalCount)
                    yValue.unshift({
                        name: `[${item.minScore},${item.maxScore})`, seriesName: '用户数', value: item.totalCount,
                        total: val.totalCount, dateRange: `${val.startTime}-${val.endTime}`
                    })
                })
                this.optionScore.xAxis.data = xValue

                this.optionScore.series[0].data = yValue

                this.isList = val.detailList
                this.drawBar()
            }

        }
    }
</script>

<style lang="scss">
    .outFraud {
        .el-tabs__item.is-active {
            color: #333 !important;
            font-size: 18px !important;
        }
    }
</style>

<style scoped lang="scss">
    .outFraud {
        padding-bottom: 40px;
    }

    .noData {
        padding: 188px 0;
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
        }
    }

    .ruleType {
        margin: 10px 0 14px;
    }

    #score {
        position: relative;
        /*width: 100%;*/
        height: 450px;
        padding: 30px 20px;
        overflow: scroll;
        border: 1px solid #E4E7F2;
    }

</style>
