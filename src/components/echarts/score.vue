<template>
    <div class="score">
        <div class="countDiv">
            <p>最大值：{{scoreData.maxScore}}</p>
            <p>最小值：{{scoreData.minScore}}</p>
            <p>平均数：{{scoreData.avgScore}}</p>
            <p>中间数：{{scoreData.medianScore}}</p>
            <p>方差：{{scoreData.maxScore}}</p>
            <p>评分分段：
                <el-select v-model="rangle" size="mini" filterable>
                    <el-option v-for="item,index in scoreRangle"
                               :key="index" :label="item" :value="item"></el-option>
                </el-select>
            </p>
        </div>
        <div id="score"></div>
    </div>
</template>

<script>
    export default {
        name: "score",
        props: ['optionData', 'tipData'],
        data() {
            return {
                rangle: '50',
                scoreRangle: [],
                myChart: null,
            }
        },
        created() {
            for (let i = 50; i <= 1000; i++) {
                if (i % 10 == 0) {
                    this.scoreRangle.push(i)
                }
            }
        },
        mounted() {
            this.drawBar()
        },
        computed: {
            scoreData() {
                return this.tipData
            }
        },
        methods: {
            drawBar() {
                let myChart = this.$echarts.init(document.getElementById('score'))
                myChart.setOption(this.optionData)
            },

        },
        beforeDestroy() {
            if (!this.myChart) {
                return
            }
            this.myChart.dispose();
            this.myChart = null;
            this.$bus.$off('switchScore', 50)
        },
        watch: {
            rangle(val) {
                // $('#score').width(this.optionData.xAxis.data.length * 80)

                this.$bus.$emit('switchScore', val)
            }
        }
    }
</script>

<style scoped lang="scss">
    #score {
        position: relative;
        width: 100%;
        height: 450px;
        padding: 30px 20px;
        border: 1px solid #E4E7F2;
    }

    .countDiv {
        position: absolute;
        left: 200px;
        top: 348px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        z-index: 9;
        p {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 0 20px;
            color: #55616A;
            font-size: 12px;
            border-right: 1px solid #eee;
            .el-input {
                width: 100px;
            }
            &:last-child {
                border: none;
            }
        }
    }


</style>
