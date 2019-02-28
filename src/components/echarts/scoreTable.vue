<template>
    <div class="tableDiv">
        <div class="tipDiv">
            <p>下图为参考样图，具体数据详情请点击右方“导出数据”按钮</p>
            <el-button @click="outBtn" size="small" type="primary">导出数据</el-button>
        </div>

        <div>
            <!--<p>yyyy-mm-dd至yyyy-mm-dd【产品线-模型名称】变量详情分布</p>-->
            <!--<el-table-->
            <!--:data="tableData"-->
            <!--border-->
            <!--style="width: 100%">-->
            <!--<el-table-column prop="date" label="日期"></el-table-column>-->
            <!--<el-table-column prop="date" label="身份证"></el-table-column>-->
            <!--<el-table-column prop="date" label="标ID"></el-table-column>-->
            <!--<el-table-column prop="date" label="变量（系数值）"></el-table-column>-->
            <!--<el-table-column prop="date" label="变量（系数值）"></el-table-column>-->
            <!--<el-table-column prop="date" label="变量（系数值）"></el-table-column>-->
            <!--<el-table-column prop="date" label="变量（系数值）"></el-table-column>-->

            <!--</el-table>-->
            <img src="../../resource/img/control/table.png"alt="">
            <br>
            <br>
            <!--<out></out>-->
        </div>
    </div>
</template>

<script>
    import out from '../out/outCsv'
    export default {
        // name: "scoreTable",
        props: ['tipData'],
        data() {
            return {
                tableData: []
            }
        },
        components:{out},
        // computed: {
        //     tableRes() {
        //         return this.tipData.detailList
        //     }
        // },
        methods: {
            outBtn() {
                this.$bus.$emit('outCsv',50)
            }
        }
    }
</script>

<style scoped lang="scss">
    .tableDiv {
        width: 100%;
        border: 1px solid #eee;
        .tipDiv {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px dashed #ececec;
            > p {
                color: #55616A;
                font-size: 12px;
                text-align: center;
            }
        }

        > div {
            padding: 28px 32px;

        }
    }
</style>
