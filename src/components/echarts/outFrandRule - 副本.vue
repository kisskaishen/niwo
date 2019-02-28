<template>
    <div class="outFraudRuleEchart">
        <div id="outFraudRule"></div>
    </div>
</template>

<script>
    export default {
        name: "outFraudRule",
        props: ['optionData'],
        data() {
            return {
                typeData: '1',
            }
        },
        mounted() {
            this.drawBar()
        },
        methods: {
            drawBar() {
                let myChart = this.$echarts.init(document.getElementById('outFraudRule'))
                myChart.setOption(this.optionData)

            },
            typeDataChange(val) {
                console.log(val)
            }
        },
        beforeDestroy() {
            console.log('注销Rule')
        },
        watch: {
            data:{
                handler(newVal,oldVal) {
                    this.drawBar()
                },
                deep:true
            }
        }
    }
</script>

<style scoped lang="scss">
    #outFraudRule {
        width: 100%;
        min-height: 502px;
        padding: 30px 20px;
        border: 1px solid #E4E7F2;
    }


</style>
