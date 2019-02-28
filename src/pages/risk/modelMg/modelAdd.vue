<template>
    <div class="pages_modelAdd">
        <div class="mA_panel radius2 bg_fff mg_t_20">
            <!--<div class="mA_hd grayTitle">已创建模型</div>            -->
            <el-form :model="modelAdd" status-icon :rules="rules" ref="modelAdd" label-width="120px"
                     class="modelAddForm">
                <el-form-item label="选择产品线：" class="productList" prop="appId">
                    <el-select v-model="modelAdd.appId" filterable placeholder="请选择" size="medium"
                               @change="getModelList" :disabled="typeCopy">
                        <el-option v-for="(item,index) in productList" :key="index" :label="item.productName"
                                   :value="item.appId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选 择 模 版：" prop="moldType">
                    <el-radio-group v-model.number="modelAdd.moldType" @change="getModelList"
                                    :disabled="!modelAdd.appId">
                        <el-radio :label="1" border v-if="typeCopy?modelAdd.moldType==1:true"
                                  :class="modelAdd.moldType==1?'shadow':''">
                            <img class="modelType_pic" :src="modelAdd.moldType==1?fqz:fqz_off" alt="决策流模型">
                            <p class="modelType_text">决策流模型</p>
                        </el-radio>
                        <el-radio :label="3" border v-if="typeCopy?modelAdd.moldType==3:true"
                                  :class="modelAdd.moldType==3?'shadow':''">
                            <img class="modelType_pic" :src="modelAdd.moldType==3?sxzc:sxzc_off" alt="风险定价模型">
                            <p class="modelType_text">风险定价模型</p>
                        </el-radio>
                        <el-radio :label="4" border v-if="typeCopy?modelAdd.moldType==4:true"
                                  :class="modelAdd.moldType==4?'shadow':''">
                            <img class="modelType_pic" :src="modelAdd.moldType==4?xypf:xypf_off" alt="评分卡模型">
                            <p class="modelType_text">评分卡模型</p>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="请输入名称：" class="modelList">
                    <el-select class="mg_r_20" v-model="modelAdd.referMoldId" filterable placeholder="添加新的模型名称"
                               size="medium" @change="setMoldVersion(modelAdd.referMoldId)">
                        <!--<el-option :key="''" :label="'添加新的模型名称'" :value="''"></el-option>-->
                        <el-option v-for="(item,index) in modelList"
                                   :key="index" :label="item.moldName"
                                   :value="item.id"></el-option>
                    </el-select>
                    <el-input v-if="modelAdd.referMoldId!=''&&modelAdd.referMoldId==0" v-model.trim="modelAdd.moldName"
                              size="medium"
                              placeholder="请输入模型名称：" clearable></el-input>
                    <span v-else-if="modelAdd.referMoldId!=0&&modelAdd.referMoldId!=''" class="moldVersion">当前版本：V{{moldVersion}}</span>
                    <span v-else class="moldVersion"></span>
                </el-form-item>
                <el-form-item v-if="modelAdd.referMoldId==0" label="请输入编码：" class="moldCode">
                    <el-input v-model.trim="modelAdd.moldCode"
                              @keyup.native="modelAdd.moldCode=modelAdd.moldCode.replace(/[^\d]/g,'')" size="medium"
                              placeholder="模型编码" clearable></el-input>
                </el-form-item>
                <el-form-item label="备 注 信 息：" class="moldRemark" :class="{'is-error':modelAdd.remark.length==255}">
                    <el-input type="textarea" :maxlength="255" :autosize="{ minRows: 3, maxRows: 6}"
                              placeholder="请输入备注信息" v-model="modelAdd.remark"></el-input>
                    <div class="counter f12 lh15" v-if="modelAdd.remark"
                         :class="modelAdd.remark.length>=255?'f_red':'f_ccc'">{{modelAdd.remark.length}}/255
                    </div>
                </el-form-item>
                <el-form-item class="modelAdd_submite">
                    <el-button :type="!allowNext?'info':'primary'" :disabled="!allowNext"
                               @click="validateForm('modelAdd',false)">保存
                    </el-button>
                    <!-- <el-button @click="resetForm('modelAdd')">重置</el-button> -->
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import fqz from 'img/modelList/fqz.png'
    import fqz_off from 'img/modelList/fqz_off.png'
    import xypf from 'img/modelList/xypf.png'
    import xypf_off from 'img/modelList/xypf_off.png'
    import sxzc from 'img/modelList/sxzc.png'
    import sxzc_off from 'img/modelList/sxzc_off.png'
    import regular from 'js/regular'// 正则库
    export default {
        name: 'pages_modelAdd',
        data() {
            return {
                pageName: 'pages_modelAdd',
                fqz, xypf, sxzc, fqz_off, xypf_off, sxzc_off,
                productList: [],
                modelList: [],
                modelValue: '',
                moldVersion: '',
                modelAdd: {
                    appId: '',
                    moldType: 1,
                    originMoldId: '',
                    referMoldId: '',
                    moldName: '',
                    moldCode: '',
                    remark: '',
                },
                rules: {
                    // 企业信息
                    appId: [
                        {required: true, message: '选择产品线', trigger: 'blur,change'}
                    ],
                    moldType: [
                        {required: true, message: '选 择 模 版', trigger: 'blur,change'}
                    ],
                    tempId: [
                        {required: true, message: '请选择模型', trigger: 'blur,change'}
                    ],
                    moldName: [
                        {required: true, message: '请输入模型名称', trigger: 'blur,change'}
                    ],
                    referMoldId: [
                        {required: true, message: '请输入编码', trigger: 'blur,change'}
                    ],
                    remark: [
                        {required: false, message: '请输入备注信息', trigger: 'blur,change'}
                    ],
                },
            }
        },
        computed: {
            typeAdd() {
                return this.$route.query.type == 'add';
            },
            typeCopy() {
                return this.$route.query.type == 'copy';
            },
            allowNext() {
                return !!this.modelAdd.appId && !!this.modelAdd.moldType && (!!this.modelAdd.referMoldId || (!!this.modelAdd.moldName && !!this.modelAdd.moldCode));
            },
        },
        beforeCreate() {
            if (this.$route.query.type == 'look') {
                this.$route.meta.title = '查看模型';
            } else if (this.$route.query.type == 'copy') {
                this.$route.meta.title = '复制模型';
            } else {
                this.$route.meta.title = '新增模型';
            }
            document.title = this.$route.meta.title;
        },
        mounted() {
            this.getProductList();
        },
        methods: {
            setMoldVersion(id) {
                this.modelList.map((item) => {
                    if (item.id == id) {
                        this.moldVersion = item.moldVersion;
                    }
                })
                this.modelAdd.moldCode = '';
                this.modelAdd.moldName = '';
            },
            validateForm(formName, hideWarn = false) {
                !!this.$refs[formName] && this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.$route.query.type == 'look') {

                        } else if (this.$route.query.type == 'copy') {
                            (!hideWarn) && this.modelCopy();
                        } else {
                            (!hideWarn) && this.modelCreate();
                        }
                    } else {
                        return false;
                    }
                });
                // hideWarn && this.$refs[formName].clearValidate(); // 提交按钮置灰实时验证，隐藏提示信息
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            modelCreate() {// 创建
                let _self = this;
                if (_self.modelAdd.referMoldId == '0') {
                    _self.modelAdd.referMoldId = ''
                }
                this.$post('/mcs/mold/create', this.modelAdd)
                    .then(res => {
                        this.$message.success('添加成功')
                        this.gotoConf(res.id);// 进入配置页面
                    })
            },
            modelCopy() {// 创建+复制
                let _self = this;
                if (_self.modelAdd.referMoldId == '0') {
                    _self.modelAdd.referMoldId = ''
                }
                this.$post('/mcs/mold/copy', _self.modelAdd)
                    .then(res=>{
                        this.$message.success('添加成功')
                        this.gotoConf(res.id);// 进入配置页面
                    })
            },
            gotoConf(id) {
                if (this.modelAdd.moldType == 4) {// 评分卡
                    this.$router.push({
                        path: '/risk/modelMg/scoreCard',
                        query: {appId: this.modelAdd.appId, moldType: this.modelAdd.moldType, type: 'edit', modelId: id}
                    });
                } else {
                    this.$router.push({
                        path: '/risk/modelMg/modelUml',
                        query: {appId: this.modelAdd.appId, moldType: this.modelAdd.moldType, type: 'edit', modelId: id}
                    });
                }
            },
            // 产品线列表
            getProductList() {
                this.$post('/mcs/product/list', {
                    productName: '',
                    pageNo: '-1'
                })
                    .then(res => {
                        if (this.$route.query.type == 'copy') {
                            this.modelAdd.appId = this.$route.query.appId;
                            this.modelAdd.moldType = this.$route.query.moldType * 1;
                            this.getModelList();
                            this.modelAdd.originMoldId = this.$route.query.modelId * 1;
                        } else if (!!this.$route.query.type) {
                            this.modelAdd.appId = this.$route.query.appId;
                            this.modelAdd.moldType = this.$route.query.moldType * 1;
                            this.getModelList();
                            this.modelAdd.referMoldId = this.$route.query.modelId * 1;
                        } else {

                        }
                        this.productList = res.productList;
                    })
            },
            // 模板名称列表
            getModelList(val) {
                this.modelAdd.referMoldId = '';
                this.$post('/mcs/mold/code/list', {
                    appId: this.modelAdd.appId,// 产品线 Number  N
                    moldType: this.modelAdd.moldType,// 模型类型    Number  Y   1：反欺诈，2：授信，3：评分卡
                })
                    .then(res => {
                        this.modelList = []
                        let arr = [{id: '0', moldName: '添加新的模型名称', moldVersion: '', nodeId: ''}]
                        this.modelList = [...arr, ...res.moldList];
                        if (!!this.$route.query.type) {
                            this.setMoldVersion(this.$route.query.modelId * 1)
                        } else {

                        }
                    })
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    .pages_modelAdd {
        .el-radio {
            width: 120px;
            height: 160px;
            border-radius: 2px;
            padding: 0;
            border-color: #E4E7F2;
            .el-radio__input {
                display: none;
            }
            .el-radio__label {
                display: block;
                width: 100%;
                text-align: center;
                padding: 0;
                .modelType_pic {
                    width: 80px;
                    margin-top: 24px;
                }
                .modelType_text {
                    margin-top: 24px;
                }
            }
            &.is-checked, &.is-checked.is-disabled {
                .modelType_text {
                    color: #1785EC;
                }
            }
        }

    }
</style>
<style scoped lang='scss'>
    .pages_modelAdd {
        .mA_panel {
            width: 100%;
            border: 1px solid #E4E7F2;
            .el-form-item {
                margin-bottom: 22px;
            }
            .grayTitle {
                height: 42px;
                line-height: 42px;
                background: #EAEEF0;
                text-indent: 20px;
            }
            .modelAddForm {
                padding: 20px 30px;
                .el-input {
                    width: 200px;
                }
                .el-textarea {
                    width: 420px;
                }
                .modelList {
                    .moldVersion {

                    }
                }
                .el-radio {
                    width: 120px;
                    height: 160px;
                    border-radius: 2px;
                    padding: 0;
                    border-color: #E4E7F2;
                    .el-radio__input {
                        display: none;
                    }
                    .el-radio__label {
                        display: block;
                        width: 100%;
                        text-align: center;
                        padding: 0;
                        .modelType_pic {
                            width: 80px;
                            margin-top: 24px;
                        }
                        .modelType_text {
                            margin-top: 24px;
                        }
                    }
                    &.is-checked, &.is-checked.is-disabled {
                        .modelType_text {
                            color: #1785EC;
                        }
                    }
                }
                .shadow {
                    box-shadow: 0 0 6px #ccc;
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
        }

    }
</style>
