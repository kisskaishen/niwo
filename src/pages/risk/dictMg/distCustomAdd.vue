<template>
    <div class="pages_dictCustomAdd">
        <el-form status-icon :label-position="'left'" ref="modelForm" class="modelForm inlineBlock mg_t_20">
            <el-form-item label="请选择产品线：" class="fl mg_r_20 productList" label-width="110px">
                <el-select v-model="modelForm.appId" filterable placeholder="请选择" size="medium"
                           :class="{'solid_red':vLock&&!modelForm.appId}" :disabled="$route.query.type=='view'">
                    <!-- <el-option label="全部" value=""></el-option> -->
                    <el-option v-for="(item,index) in products" :key="item.appId" :label="item.productName"
                               :value="item.appId"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-table :data="tabList" class="productListTable mg_t_20" border :header-row-class-name="'table_hd'"
                  :header-cell-class-name="'table_th'" :row-class-name="'table_tr'" :fit="true"
                  :cell-class-name="'table_td'">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column label="自定义列表名称(中文)" prop="variableNameEn">
                <template slot-scope="scope">
                    <div v-if="type == 'edit' || type == 'add'">
                        <el-input v-model="scope.row.setName"
                                  :class="{'solid_red':(vLock&&!scope.row.setName)||scope.row.isRepeat}"
                                  @blur="checkRepeat(scope.row)" style="width:200px;display:inline-block"></el-input>
                        <a href="javascript:;" class="mg_l_20" @click="addTabItem"><i class="icon icon-add"
                                                                                      v-if="type == 'add'"></i></a>
                        <a href="javascript:;" class="mg_l_10" @click="removeTabItem(scope.$index)"
                           v-if="type == 'add'"><i class="icon icon-del"></i></a>
                    </div>
                    <div v-else>
                        {{scope.row.setName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="数据类型" prop="variableName">
                <template slot-scope="scope">
                    string
                </template>
            </el-table-column>
            <el-table-column label="条件" prop="remark">
                <template slot-scope="scope">
                    <div v-if="type == 'edit' || type == 'add'">
                        <div v-for="(item,idx) in scope.row.data" class="condition-item">
                            <el-input :class="{'solid_red':vLock&&!item.key}" v-model="item.key"
                                      style="width:200px;display:inline-block"></el-input>
                            <a href="javascript:;" class="mg_l_20" @click="addConditionItem(scope.$index)"><i
                                class="icon icon-add"></i></a>
                            <a href="javascript:;" class="mg_l_10" @click="removeConditionItem(scope.$index,idx)"><i
                                class="icon icon-del"></i></a>
                        </div>
                    </div>
                    <div v-else>
                        <div v-for="(item,idx) in scope.row.data" class="condition-item">
                            {{item.key}}
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark">
                <template slot-scope="scope">
                    <div v-if="type == 'edit' || type == 'add'">
                        <el-input v-model="scope.row.remark"></el-input>
                    </div>
                    <div v-else>
                        {{scope.row.remark}}
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-button type="primary" size="medium" class="mg_t_20" @click="addDistCustom"
                   v-if="type == 'edit' || type == 'add'">保存
        </el-button>
    </div>
</template>
<script>
    export default {
        name: 'pages_dictCustomAdd',
        data() {
            return {
                modelForm: {
                    appId: ''
                },
                tabList: [{
                    setName: '',
                    isRepeat: false,
                    data: [{
                        key: ''
                    }]
                }],
                products: [],
                scorecards: [],
                type: this.$route.query.type || 'add',
                id: this.$route.query.id,
                vLock: false,
            }
        },

        mounted() {
            if (this.type != 'add') {
                this.getSetQuery();
            }
            this.productList();
        },
        methods: {
            checkRepeat(item) {
                // this.tabList.map((listName,listIndex)=>{
                //     console.log(item.setName,listName.setName)
                //     if(!!item.setName&&item.setName==listName.setName){
                //         item.isRepeat = true;
                //     }else{
                //         item.isRepeat = false;
                //     }
                // })
            },
            getSetQuery() {
                this.$post('/mcs/set/query', {
                    id: this.id
                })
                    .then(res => {
                        this.modelForm.appId = res.data.appId;
                        let db = res;
                        let arr = [];
                        db.data.map(value => {
                            arr.push({key: value});
                        })
                        db.data = arr;
                        if (this.type == 'view' || this.type == 'edit') {
                            this.tabList = [db];
                        }
                    })
            },
            productList() {
                this.$post('/mcs/product/list', {})
                    .then(res => {
                        this.products = res.productList;
                    })
            },
            addTabItem() {
                this.tabList.push({
                    setName: '',
                    isRepeat: false,
                    data: [{
                        key: ''
                    }]
                })
            },
            removeTabItem(index) {
                if (this.tabList.length > 1) {
                    this.$msgbox.confirm('', {
                        title: '系统提示',
                        message: '<p class="f_333">确认要删除该列表？',
                        dangerouslyUseHTMLString: true,
                        type: 'warning',
                    }).then(() => {
                        this.tabList.splice(index, 1);
                    })
                }
            },
            addConditionItem(index) {
                this.tabList[index].data.push({
                    key: ''
                })
            },
            removeConditionItem(index, idx) {
                this.$msgbox.confirm('', {
                    title: '系统提示',
                    message: '<p class="f_333">确认要删除该条件？',
                    dangerouslyUseHTMLString: true,
                    type: 'warning',
                }).then(() => {
                    this.tabList[index].data.splice(idx, 1);
                })

            },
            validate() {
                this.vLock = true;
                return !!this.modelForm.appId && this.tabList.every((listName, listIndex) => {
                    return !!listName.setName && listName.data.every((termItem, termIndex) => {
                        return !!termItem.key;
                    })
                })
            },
            addDistCustom() {
                if (this.validate()) {
                    let params = [];
                    for (let i = 0; i < this.tabList.length; i++) {
                        let obj = {
                            setName: this.tabList[i].setName,
                            remark: this.tabList[i].remark,
                            appId: this.modelForm.appId
                        };
                        if (this.tabList[i].id) {
                            obj.id = this.tabList[i].id;
                        }
                        let arr = [];
                        for (let j = 0; j < this.tabList[i].data.length; j++) {
                            arr.push(this.tabList[i].data[j].key);
                        }
                        obj.data = arr;
                        params.push(obj)
                    }
                    let url = this.type == 'add' ? '/mcs/set/create' : '/mcs/set/update';
                    if (this.type == 'edit') {
                        params = params[0];
                    }
                    this.$post(url, params)
                        .then(res => {
                            this.type == 'add' ? '新增成功' : '修改成功'
                            this.$message.success(this.type)
                            this.$router.push('/risk/dictMg/dictCustom');

                        })
                }
            }
        }
    }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' rel="stylesheet/scss" scoped>
    .pages_dictCustomAdd {

        .condition-item {
            padding: 10px 0;
            border-bottom: solid 1px #e4e7f2;

            &:last-of-type {
                border: none;
            }
        }
        .icon-add,
        .icon-del {
            display: inline-block;
            width: 16px;
            height: 16px;
            background: url("../../../resource/img/icon/plus.png") no-repeat;
        }
        .icon-del {
            background: url("../../../resource/img/icon/remove.png") no-repeat;
        }
    }

</style>
