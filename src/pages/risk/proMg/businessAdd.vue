<template>
    <div class="businessAdd">
        <el-form :model="addData" :rules="addRules" ref="addForm" label-width="120px">
            <el-form-item label="选择产品线：" prop="proLine">
                <el-select v-model="addData.proLine" placeholder="请选择产品线" v-if="$route.query.type!='copy'">
                    <el-option v-for="item,index in proSelectList"
                               :key="index" :label="item.productName" :value="item.appId"></el-option>
                </el-select>
                <span v-else>{{$route.query.productName}}</span>
            </el-form-item>
            <el-form-item label="选择流程：" prop="proFlow">
                <el-select v-model="addData.proFlow" placeholder="请选择流程">
                    <el-option v-for="item,index in proFlowList"
                               :key="index" :label="item.moldName" :value="item.id"></el-option>
                </el-select>
                <el-input v-model="newVerson" placeholder="请添加新的流程名称" maxLength="15"
                          v-if="addData.proFlow=='-1'"></el-input>
                <span v-else-if="addData.proFlow!='-1'&&addData.proFlow"
                      style="margin-left: 20px;">版本号：V{{getVerson}}</span>
            </el-form-item>
            <el-form-item label="流程编码：" prop="flowCode" v-if="!addData.proFlow||addData.proFlow=='-1'">
                <el-input v-model="addData.flowCode" placeholder="请填写流程编码,支持6-10位数字"></el-input>
            </el-form-item>
            <el-form-item label="备注信息："  class="moldRemark">
                <el-input type="textarea" :rows="5" maxlength='255' v-model="addData.remark"
                          :autosize="{ minRows: 3, maxRows: 6}"
                          placeholder="请填写备注信息" :class="{'is-error':addData.remark.length==255}"></el-input>
                <div class="counter f12 lh15" v-if="addData.remark"
                     :class="addData.remark.length>=255?'f_red':'f_ccc'">{{addData.remark.length}}/255
                </div>
            </el-form-item>
            <el-form-item label="" class="modelAdd_submite">
                <!--<el-button @click="resetForm('addForm')">取消</el-button>-->
                <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
    import common from "../../../components/common/common";

    export default {
        name: "businessAdd",
        data() {
            let sixTenNum = /^\d{6,10}$/
            let flowCheck = (rule, value, callback) => {
                console.log(value)
                console.log(value > 99999)
                if (!value) {
                    return callback(new Error('请填写流程编码'))
                } else if (!sixTenNum.test(value)) {
                    return callback(new Error('流程编码必须是6-10位数字'))
                } else if (value < 100000) {
                    return callback(new Error('流程编码首位不能为0'))
                } else {
                    callback()
                }
            }
            return {
                addData: {
                    proLine: '',
                    proFlow: '',
                    flowCode: '',
                    remark: ''
                },
                newVerson: '',               // 新的流程名称
                getVerson: '',               // 已选择的版本
                proSelectList: [],         // 产品线列表
                proFlowList: [],         // 流程列表

                addRules: {                   // 表单规则验证
                    proLine: [{required: true, message: '请选择产品线', trigger: 'change'}],
                    proFlow: [{required: true, message: '请选择流程', trigger: 'change'}],
                    flowCode: [{required: true, validator: flowCheck, trigger: 'blur'}],
                    // remark: [{required: true, message: '请填写备注信息', trigger: 'blur'}]
                }
            }
        },
        beforeCreate() {
            if (this.$route.query.type == 'look') {
                this.$route.meta.title = '查看流程';
            } else if (this.$route.query.type == 'copy') {
                this.$route.meta.title = '复制流程';
            } else {
                this.$route.meta.title = '新增流程';
            }
            document.title = this.$route.meta.title;
        },
        mounted() {
            this.getProList()
            if (this.$route.query.type == 'copy') {
                this.addData.proLine = this.$route.query.appId
                this.getFlowList()
            }
        },
        methods: {
            // 产品线列表
            getProList() {
                this.$post('/mcs/product/list', {
                    pageNo: "-1",
                    productName: ""
                })
                    .then(res => {
                        this.proSelectList = res.productList
                    })
            },
            // 流程列表
            getFlowList() {
                this.$post('/mcs/mold/process/code/list', {
                    appId: this.addData.proLine,
                })
                    .then(res => {
                        let firstArr = [{
                            id: '-1',
                            moldCode: '',
                            moldName: '添加新的流程名称',
                            moldType: '',
                            moldVersion: '',
                            nodeId: null
                        }]
                        this.proFlowList = [...firstArr, ...res.moldList]
                    })
            },
            // 提交
            submitForm(data) {
                this.$refs[data].validate(valid => {
                    if (valid) {
                        console.log(valid)
                        if (this.$route.query.type == 'copy') {
                            this.$post('/mcs/mold/process/copy', {
                                originMoldId: this.$route.query.flowId,
                                referMoldId: this.addData.proFlow == '-1' ? '' : this.addData.proFlow,
                                moldName: this.addData.proFlow == '-1' ? this.newVerson : '',
                                moldCode: this.addData.proFlow == '-1' ? this.addData.flowCode : '',
                                remark: this.addData.remark,
                            })
                                .then(res => {
                                    common.message('success', '复制成功~')
                                    this.$router.push({
                                        path: '/risk/proMg/businessList/editFlow',
                                        query: {
                                            appId: res.appId,
                                            type: 'edit',
                                            moldType: res.moldType,
                                            flowId: res.id,
                                            referMoldId: res.referMoldId         // referMoldId是干嘛的
                                        }
                                    })
                                })

                        } else {
                            this.$post('/mcs/mold/process/create', {
                                appId: this.addData.proLine,
                                moldName: this.newVerson,
                                referMoldId: this.addData.proFlow == '-1' ? '' : this.addData.proFlow,
                                moldCode: this.addData.flowCode,
                                remark: this.addData.remark,
                            })
                                .then(res => {
                                    common.message('success', '添加成功~')
                                    this.$router.push({
                                        path: '/risk/proMg/businessList/editFlow',
                                        query: {
                                            appId: res.appId,
                                            type: 'edit',
                                            moldType: res.moldType,
                                            flowId: res.id,
                                            referMoldId: res.referMoldId         // referMoldId是干嘛的
                                        }
                                    })
                                })
                        }


                    } else {
                        common.message('error', '请填写必填项！')
                    }
                })
            },
            // 取消？重置？
            resetForm(data) {
                this.$refs[data].resetFields()
            }
        },
        watch: {
            'addData.proLine': function (val) {
                if (val != '') {
                    this.getFlowList()
                }
            },
            'addData.proFlow': function (val) {
                this.proFlowList.map(item => {
                    if (item.id == val) {
                        this.getVerson = item.moldVersion
                    }
                })
            }
        }

    }
</script>

<style scoped lang="scss">
    .businessAdd {
        .el-form {
            margin-top: 30px;
            .el-form-item {
                margin-bottom: 22px;
                .el-select, .el-input, .el-textarea {
                    width: 300px;
                }
                .el-textarea {
                    /*height: 118px;*/
                }
            }
        }
        .moldRemark {
            .el-form-item__content {
                width: 420px;
                .el-textarea__inner {
                    padding-bottom: 16px;
                }
                .counter {
                    position: absolute;
                    right: 15px;
                    bottom: 0;
                }
            }
        }
    }
</style>
