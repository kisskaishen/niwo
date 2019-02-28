<template>
    <div class="pages_breadcrumb">
        <el-breadcrumb separator=">">
            <el-breadcrumb-item v-for="(item,index) in breakList"
                                :to="{path:item.path}" :key="index">{{item.meta.title}}
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
    export default {
        name: 'pages_breadcrumb',
        data() {
            return {
                pageName: 'pages_breadcrumb',
                breakList: [],
            }
        },
        created() {
        },
        mounted() {
            if (this.$route.path == '/risk/modelMg/modelUml') {
                switch (this.$route.query.type) {
                    case 'look':
                        this.$route.meta.title = '查看模型'
                        break;
                    case 'edit':
                        this.$route.meta.title = '编辑模型'
                        break;
                }
            }
            if (this.$route.path == '/risk/modelMg/scoreCard') {
                switch (this.$route.query.type) {
                    case 'look':
                        this.$route.meta.title = '查看评分卡'
                        break;
                    case 'edit':
                        this.$route.meta.title = '编辑评分卡'
                        break;
                }
            }

            if (this.$route.path == '/risk/modelMg/scoreCard'
                || this.$route.path.indexOf('/risk/modelMg/modelUml') != '-1'
                || this.$route.path.indexOf('/risk/modelMg/gramsList') != '-1'
                || this.$route.path.indexOf('/risk/modelMg/scoreCardPreview') != '-1'
                || this.$route.path.indexOf('/risk/proMg/businessList') != '-1'
                || this.$route.path == '/risk/proMg/businessAdd') {
                this.breakList = this.$route.matched.slice(1)
                if (this.$route.path == '/risk/proMg/businessList/editFlow'|| this.$route.path == '/risk/proMg/businessAdd') {
                    let meta0 = [{meta:{title:'业务流程列表'},path:'/risk/proMg/businessList'}]
                    this.breakList = [...meta0,...this.$route.matched.slice(1)];
                }
            } else {
                this.breakList = this.$route.matched.slice(2)
            }
        },
        methods: {},
        watch: {
            $route(val) {
                if (val.path == '/risk/modelMg/scoreCard'
                    || val.path.indexOf('/risk/modelMg/modelUml') != '-1'
                    || val.path.indexOf('/risk/modelMg/gramsList') != '-1'
                    || val.path.indexOf('/risk/modelMg/scoreCardPreview') != '-1'
                    || val.path.indexOf('/risk/proMg/businessList') != '-1'
                    || this.$route.path == '/risk/proMg/businessAdd') {
                    this.breakList = this.$route.matched.slice(1)
                    if (this.$route.path == '/risk/proMg/businessList/editFlow'|| this.$route.path == '/risk/proMg/businessAdd') {
                        let meta0 = [{meta:{title:'业务流程列表'},path:'/risk/proMg/businessList'}]
                        this.breakList = [...meta0,...this.$route.matched.slice(1)];
                    }
                } else {
                    this.breakList = this.$route.matched.slice(2)
                }
                if (val.path.indexOf('/risk/modelMg/modelUml')>-1) {
                    this.breakList = this.$route.matched.slice(1,3)
                }
                if (this.$route.path == '/risk/modelMg/modelUml') {
                    switch (this.$route.query.type) {
                        case 'look':
                            this.$route.meta.title = '查看模型'
                            break;
                        case 'edit':
                            this.$route.meta.title = '编辑模型'
                            break;
                    }
                }

                if (val.path == '/risk/modelMg/modelUml/kingForm') {
                    this.breakList = this.$route.matched.slice(1, 3)
                }
                if (val.path == '/risk/proMg/businessList/editFlow/kingForm') {
                    this.breakList = this.$route.matched.slice(1, 2)
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    .pages_breadcrumb {
        padding: 0 20px;
        background: #FAFAFA;
        border-bottom: 1px solid #EAEDF5;
        .el-breadcrumb {
            line-height: 40px;
            .el-breadcrumb__item {
                .el-breadcrumb__inner {
                    font-size: 12px;
                    color: #808080;
                }
                .el-breadcrumb__separator {
                    font-weight: normal;
                }
            }
        }
    }
</style>
