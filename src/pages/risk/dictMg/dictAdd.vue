<template>
    <div class="pages_distAdd">
        <el-form status-icon :label-position="'left'" ref="modelForm" class="modelForm inlineBlock mg_t_20">
            <el-form-item label="请选择产品线：" class="fl mg_r_20 productList" label-width="110px">
                <el-select v-model="modelForm.appId" filterable placeholder="请选择" size="medium" @change="productChange">
                    <el-option v-for="(item,index) in products" :key="item.appId" :label="item.productName"
                               :value="item.appId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="请选择变量类型：" class="fl mg_r_20 moldName" label-width="120px">
                <el-select v-model="modelForm.source" filterable placeholder="请选择" size="medium" @change="vLock=false">
                    <el-option label="输入变量" value="2"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <!--<p v-if="modelForm.source == 1">评分卡变量列表：</p>-->
        <!--<el-table :data="tabList" class="productListTable mg_t_20" border v-if="modelForm.source == 1"-->
                  <!--:header-row-class-name="'table_hd'" :header-cell-class-name="'table_th'" :row-class-name="'table_tr'"-->
                  <!--:cell-class-name="'table_td'">-->
            <!--<el-table-column type="index" label="序号" width="50"></el-table-column>-->
            <!--<el-table-column label="请选择评分卡" prop="scorecardList" width="270">-->
                <!--<template slot-scope="scope">-->
                    <!--<el-select v-model="scope.row.scorecardId" :class="{'solid_red':vLock&&!scope.row.scorecardId}"-->
                               <!--style="width:150px;">-->
                        <!--<el-option v-for="item in scope.row.scorecardList" :key="item.id" :value="item.id"-->
                                   <!--:label="item.moldName"></el-option>-->
                    <!--</el-select>-->
                    <!--<a href="javascript:;" class="mg_l_20" @click="addTabItem"><i class="icon icon-add"></i></a>-->
                    <!--<a href="javascript:;" class="mg_l_10" @click="removeTabItem(scope.$index)"><i-->
                        <!--class="icon icon-del"></i></a>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="请输入字段名(英文)" prop="variableNameEn">-->
                <!--<template slot-scope="scope">-->
                    <!--<el-input v-model="scope.row.variableNameEn"-->
                              <!--:class="{'solid_red':vLock&&!scope.row.variableNameEn}"></el-input>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="请输入变量名(中文)" prop="variableName">-->
                <!--<template slot-scope="scope">-->
                    <!--<el-input v-model="scope.row.variableName"-->
                              <!--:class="{'solid_red':vLock&&!scope.row.variableName}"></el-input>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="备注" prop="remark">-->
                <!--<template slot-scope="scope">-->
                    <!--<el-input v-model="scope.row.remark"></el-input>-->
                <!--</template>-->
            <!--</el-table-column>-->
        <!--</el-table>-->
        <!--<p v-if="modelForm.source == 2">请求参数变量列表：</p>-->
        <el-table :data="tabList" class="productListTable mg_t_20" border v-if="modelForm.source == 2"
                  :header-row-class-name="'table_hd'" :header-cell-class-name="'table_th'" :row-class-name="'table_tr'"
                  :cell-class-name="'table_td'">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column label="变量名(中文)" prop="variableName" width="270" >
                <template slot-scope="scope">
                    <el-input v-model="scope.row.variableName" :class="{'solid_red':vLock&&!scope.row.variableNameEn}"
                              style="width:150px;"></el-input>
                    <a href="javascript:;" class="mg_l_20" @click="addTabItem"><i class="icon icon-add"></i></a>
                    <a href="javascript:;" class="mg_l_10" @click="removeTabItem(scope.$index)"><i
                        class="icon icon-del"></i></a>
                </template>
            </el-table-column>
            <el-table-column label="字段名(英文)" prop="variableNameEn">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.variableNameEn"
                              :class="{'solid_red':vLock&&!scope.row.variableName}"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="变量类型" prop="variableType">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.variableType" :class="{'solid_red':vLock&&!scope.row.variableType}"
                               style="width:100%;">
                        <!--<el-option value="0" label="全部"></el-option>春江要求去掉的2018.12.19-->
                        <el-option value="1" label="字符串"></el-option>
                        <el-option value="2" label="整型"></el-option>
                        <el-option value="3" label="浮点型"></el-option>
                        <el-option value="4" label="日期型"></el-option>
                        <!-- <el-option value="5" label="枚举"></el-option> -->
                        <el-option value="6" label="布尔型"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="是否必填">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.necessary" style="width:100%;">
                        <el-option :value="1" label="必填"></el-option>
                        <el-option :value="0" label="非必填"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="备注">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.remark"></el-input>
                </template>
            </el-table-column>
        </el-table>
        <el-button type="primary" size="medium" class="mg_t_20" @click="addDictItem">保存</el-button>
    </div>
</template>
<script>
    export default {
        name: 'pages_distAdd',
        data() {
            return {
                modelForm: {
                    appId: '',
                    source: '2'
                },
                tabList: [{
                    scorecardId: '',
                    variableNameEn: '',
                    variableName: '',
                    remark: '',
                    scorecardList: [],
                    variableType: '',
                    necessary: 1
                }],
                products: [],
                scorecards: [],
                vLock: false,
            }
        },
        watch: {
            'modelForm.source'() {
                let obj = {
                    scorecardId: '',
                    variableNameEn: '',
                    variableName: '',
                    remark: '',
                    scorecardList: [],
                    variableType: '',
                    necessary: 1
                }
                this.tabList = [obj];
            }
        },
        mounted() {
            this.productList();
        },
        methods: {
            productChange(appId) {
                this.vLock = false;
                this.modelForm.appId = appId;
                let obj = {
                    scorecardId: '',
                    variableNameEn: '',
                    variableName: '',
                    remark: '',
                    scorecardList: [],
                    variableType: '',
                    necessary: 1
                }
                this.tabList = [obj];
                // this.scorecardList();
            },
            productList() {
                this.$post('/mcs/product/list', {
                    pageNo: '-1'
                })
                    .then(res => {
                        this.products = res.productList;
                        this.modelForm.appId = res.productList[0].appId;
                        // this.scorecardList();
                    })
            },
            scorecardList() {
                this.$post('/mcs/scorecard/list', {
                    appId: this.modelForm.appId
                })
                    .then(res => {
                        this.tabList.map(item => {
                            item.scorecardList = res.scorecardList;
                            return item;
                        })
                        this.scorecards = res.scorecardList;
                    })
            },
            addTabItem() {
                this.tabList.push({
                    scorecardId: '',
                    variableNameEn: '',
                    variableName: '',
                    remark: '',
                    scorecardList: this.scorecards,
                    variableType: '',
                    necessary: 1
                })
            },
            removeTabItem(index) {
                if (this.tabList.length > 1) {
                    this.tabList.splice(index, 1);
                }
            },
            validateFrom() {
                if (this.modelForm.source == 1) {// 评分卡变量
                    return this.tabList.every(item => !!item.scorecardId && !!item.variableName && !!item.variableNameEn);
                } else if (this.modelForm.source == 2) {// 请求参数变量
                    return this.tabList.every(item => !!item.variableName && !!item.variableNameEn && !!item.variableType);
                }
            },
            //新增变量
            addDictItem() {
                if (this.validateFrom()) {
                    let variableList = [];
                    this.tabList.forEach(item => {
                        variableList.push({
                            scorecardId: item.scorecardId,
                            variableNameEn: item.variableNameEn,
                            variableName: item.variableName,
                            remark: item.remark,
                            variableType: item.variableType,
                            necessary: item.necessary
                        });
                    })
                    this.$post('/mcs/variable/create', {
                        appId: this.modelForm.appId,
                        source: this.modelForm.source,
                        variableList: variableList
                    })
                        .then(res => {
                            this.$message.success('保存成功')
                            this.$router.push('/risk/dictMg/dictList');
                        })

                } else {
                    this.vLock = true;
                    let msg = ''
                    this.tabList.map((val, index, array) => {
                        if (val.variableNameEn == '') {
                            msg = '请输入字段名(英文)'
                        } else if (val.variableName == '') {
                            msg = '请输入变量名(中文)'
                        } else if (val.variableType=='') {
                            msg = '请选择变量类型'
                        }
                    })
                    this.$message({// 通知提示
                        message: msg,
                        type: 'warning'
                    })
                }
            }
        }
    }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
    .pages_distAdd {
        .el-form-item {
            margin-bottom: 0;
        }
        .icon-add,
        .icon-del {
            opacity: 0;
            display: inline-block;
            width: 16px;
            height: 16px;
            background: url("../../../resource/img/icon/plus.png") no-repeat;
        }
        .icon-del {
            background: url("../../../resource/img/icon/remove.png") no-repeat;
        }
        & > .el-button {
            margin-top: 40px;
        }
        .el-table {
            tr {
                &:hover {
                    .icon-add,
                    .icon-del {
                        opacity: 1;
                    }
                }
            }

        }
    }

</style>
