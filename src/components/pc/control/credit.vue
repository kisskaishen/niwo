<template>
    <div class="credit">
        <el-tabs v-model="activeName">
            <el-tab-pane label="授信" name="1" :activeName="activeName" v-if="isList!=''">
                <ul class="pandectDiv">
                    <li>
                        <p>
                            <label>{{creditData.totalCount || 0}}</label>
                            <!--<span>{{item.number}}</span>-->
                        </p>
                        <span>调用量</span>
                        <i></i>
                    </li>
                    <li>
                        <p>
                            <label>{{creditData.avgScore || 0}}</label>
                            <!--<span>{{item.number}}</span>-->
                        </p>
                        <span>件均</span>
                        <i></i>
                    </li>
                    <li>
                        <p>
                            <label>{{creditData.avgCostTime || 0}}ms</label>
                            <!--<span>{{item.number}}</span>-->
                        </p>
                        <span>平均响应时长</span>
                    </li>
                </ul>
            </el-tab-pane>
        </el-tabs>
        <creditEchart :optionData="optionCredit" :tipData="creditData" v-if="isList!=''"></creditEchart>
        <noData img="noData" p2="暂无数据" class="noData" v-if="isList==''"/>

    </div>
</template>

<script>
    import creditEchart from '../../echarts/credit'
    import noData from '../../../components/pc/noData/noData'

    export default {
        props: ['credit'],
        name: "outFraud",
        data() {
            return {
                activeName: '1',
                xValue: [],
                yValue: [],
                totalNum: 0,
                isList:'',
                creditChart: null,
                optionCredit: {
                    title: {
                        text: '额度分布',
                        textStyle: {
                            color: '#292E32',
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontSize: 14
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            return params.data.dateRange + '<br/>' + '区间：' + params.data.name + '<br/>' + params.data.seriesName + ':' + params.data.value + '(' + (params.data.value / params.data.total).toFixed(4) * 1000000 / 10000 + '%)'
                        },
                        textStyle: {
                            fontSize: 12
                        }
                    },

                    grid: {
                        left: '80',
                        top: '88',
                    },
                    xAxis: {
                        name: '额度',
                        type: 'category',
                        inverse: true,
                        // splitLine: {show: true},
                        // axisLabel:{
                        //     interval:0,//横轴信息全部显示
                        // },
                        data: []

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
                            show: true,
                            // 柱状图颜色
                            itemStyle: {
                                normal: {
                                    color: '#42CFC6',
                                }
                            },
                        }
                    ]
                },

            }
        },
        mounted() {

        },
        components: {creditEchart, noData},
        computed: {
            creditData() {
                return this.credit
            }
        },
        methods: {
            // 授信
            drawBar() {
                this.creditChart = this.$echarts.init(document.getElementById('credit'))
                this.creditChart.setOption(this.optionCredit)
            },
        },
        watch: {
            credit(val) {
                let that = this
                let xValue = []
                let yValue = []
                that.totalNum = val.totalCount

                val.detailList.map(item => {
                    xValue.unshift(`[${item.minScore},${item.maxScore})`)
                    yValue.unshift({
                        name: `[${item.minScore},${item.maxScore})`, seriesName: '用户数', value: item.totalCount,
                        total: val.totalCount, dateRange: `${val.startTime}-${val.endTime}`
                    })
                })
                this.optionCredit.xAxis.data = xValue
                this.optionCredit.series[0].data = yValue
                this.isList = val.detailList

                this.drawBar()
            }
        }
    }
</script>

<style lang="scss">
    .credit {
        .el-tabs__item.is-active {
            color: #333 !important;
            font-size: 18px !important;
        }
    }
</style>

<style scoped lang="scss">
    .credit {
        padding-bottom: 40px;
    }
    .noData {
        padding: 158px 0;
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
                    color: #3FC5BC;
                }
            }
        }
    }


</style>
