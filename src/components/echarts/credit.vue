<template>
    <div class="credit">
        <div class="countDiv">
            <p>最大值：{{creditData.maxScore}}</p>
            <p>最小值：{{creditData.minScore}}</p>
            <p>中间数：{{creditData.medianScore}}</p>
            <p>额度分段：
                <el-select v-model="rangle" size="mini" filterable>
                    <el-option v-for="item,index in scoreRangle"
                               :key="index" :label="item" :value="item"></el-option>
                </el-select>
            </p>
        </div>
        <div id="credit"></div>
    </div>
</template>

<script>
    export default {
        name: "credit",
        props: ['optionData','tipData'],
        data() {
            return {
                rangle: '2000',
                scoreRangle:[],
                myChart:null,
            }
        },
        created() {
            for (let i = 500; i <= 10000; i++) {
                if (i % 10 == 0) {
                    this.scoreRangle.push(i)
                }
            }
        },
        mounted() {
            this.drawBar()
        },
        computed: {
            creditData() {
                return this.tipData
            }
        },
        methods: {
            drawBar() {
                this.myChart = this.$echarts.init(document.getElementById('credit'))

                this.myChart.setOption(this.optionData)
                // window.addEventListener("resize", function () {
                //     this.myChart.resize();
                // });

            },

        },
        beforeDestroy() {
            if (!this.myChart) { return }
            this.myChart.dispose();
            this.myChart = null;
            this.$bus.$off('switchCredit',2000)
        },
        watch: {
            rangle(val) {
                this.$bus.$emit('switchCredit',val)
            }
        }
    }
</script>

<style scoped lang="scss">
    #credit {
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
