<template>
    <div class="outFraudRuleEchart">
        <div id="outFraudRule"></div>
    </div>
</template>

<script>
    export default {
        name: "outFraudRule",
        props: ['optionData','typeDataVal'],
        data() {
            return {
                typeData: '1',
            }
        },
        mounted() {
            // this.drawBar()
        },
        methods: {
//             drawBar() {
//                 let myChart = this.$echarts.init(document.getElementById('outFraudRule'))
//                 let autoHeight = this.optionData.series[0].data.length * 40 + 100
//                 // myChart.getDom().style.height = autoHeight + 'px'
//                 // myChart.getDom().childNodes[0].style.height = autoHeight + "px";
//                 // myChart.getDom().childNodes[0].childNodes[0].setAttribute("height",autoHeight);
//                 // myChart.getDom().childNodes[0].childNodes[0].style.height = autoHeight + "px";
// console.log(autoHeight)
// console.log(myChart.getHeight())
//                 myChart.resize({height:autoHeight});
//                 myChart.setOption(this.optionData)
//
//             },
            typeDataChange(val) {
                console.log(val)
            }
        },
        computed:{
            typeVal() {
                return this.typeDataVal;
            }
        },
        beforeDestroy() {
            console.log('注销Rule')
        },
        watch: {
            // data: {
            //     handler(newVal, oldVal) {
            //         this.drawBar()
            //     },
            //     deep: true
            // },
            // typeVal(val) {
            //     console.log(val)
            // }
        }
    }
</script>

<style scoped lang="scss">
    #outFraudRule {
        width: 100%;
        min-height: 520px;
        padding: 30px 20px;
        border: 1px solid #E4E7F2;
    }


</style>
