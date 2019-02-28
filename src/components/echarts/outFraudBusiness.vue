<template>
    <div class="outFraudBusinessEchart">
        <div id="outFraudBusiness" ref="outFraudBusiness"></div>
    </div>
</template>

<script>
    export default {
        name: "outFraudEchart",
        props: ['optionData'],
        data() {
            return {
                myChart: null
            }
        },
        mounted() {
            this.drawLine()
        },

        methods: {
            drawLine() {
                this.myChart = this.$echarts.init(document.getElementById('outFraudBusiness'))
                this.myChart.setOption(this.optionData)
                // window.addEventListener("resize", function () {
                //     this.myChart.resize();
                // });
            }
        },
        beforeDestroy() {
            if (!this.myChart) {
                return
            }
            this.myChart.dispose()
            this.myChart = null
        },
        watch: {
            optionData(val) {
                console.log(val)
            }
        }
    }
</script>

<style scoped lang="scss">
    #outFraudBusiness {
        width: 100%;
        min-height: 450px;
        padding: 30px 20px;
        border: 1px solid #E4E7F2;
    }
</style>
