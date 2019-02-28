<template>
    <div class="pages_kingForm">
        <h2>{{ pageName }}</h2>
        <el-table :data="scoreKingData" :header-row-class-name="'table_hd'" :header-cell-class-name="'table_th'"
                  :row-class-name="'table_tr'" :cell-class-name="'table_td'" v-if="$route.query.moldType == '5'">
            <el-table-column prop="text" label="模型名称">
                <template slot-scope="scope">
                    <p @click="newCeLue(scope)" class="name primaryColor">
                        {{scope.row.scorecardName||scope.row.bindName||scope.row.moldName}}</p>
                    <div class="iconDiv" v-if="$route.query.type=='edit'">
                        <i class="el-icon-circle-plus-outline" @click="addCeLue(scope)"></i>
                        <i class="el-icon-delete" v-if="scoreKingData.length>1" @click="deleteCeLue(scope)"></i>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="number" label="流量">
                <template slot-scope="scope">
                    <p v-if="$route.query.type=='look'">{{scope.row.rate}}</p>
                    <el-input v-model.number="scope.row.rate" maxLength="4" v-else size="mini"
                              placeholder="支持两位小数"></el-input>
                </template>
            </el-table-column>
        </el-table>
        <p style="margin-bottom: 40px;color:#ccc;">注：当仅含1个模型元件且流量=1，即代表该模型无挑战者</p>
        <el-button type="primary" @click="saveBtn">保存</el-button>
    </div>
</template>
<script>
    export default {
        name: 'pages_kingForm',
        data() {
            return {
                pageName: '添加冠军/挑战者',
                kingData: [],
                scoreKingData: [],
            }
        },
        created() {

        },
        mounted() {
            if (this.$route.query.moldType == '5') {
                if (JSON.stringify(this.$local.get('formList')) != '{}') {
                    this.scoreKingData = this.$local.get('formList')
                } else {
                    this.getList()
                }

            }
        },
        methods: {
            // 获取冠军/挑战者列表
            getList() {
                this.$post('/mcs/node/mold/query', {
                    nodeId: this.$route.query.nodeId.slice(4),// 产品线ID   Number  Y
                })
                    .then(res => {
                        if (this.$route.query.moldType == '5') {
                            if (res.bindMoldList.length > 0) {
                                this.scoreKingData = res.bindMoldList
                                this.$local.set('formList', res.bindMoldList)
                            } else {
                                this.scoreKingData = [{
                                    scorecardName: '选择模型',
                                    rate: ''
                                }]
                            }
                        }
                        console.log(this.scoreKingData)
                        {// 撤销恢复：记录绑定的初始版本

                            let maxItem = res.bindMoldList[0];
                            console.log(maxItem)
                            res.bindMoldList.map(item => {
                                if (item.rate > maxItem.rate) {
                                    maxItem = item;
                                }
                            });
                            let data = JSON.parse(JSON.stringify(res))
                            data.nodeName = maxItem.bindName||maxItem.scorecardName;
                            data.nodeId = this.$route.query.nodeId;
                            data.clear = res.bindMoldList.length > 0 ? false : true;
                            console.log(data)
                            if (res) {
                                data.bindMoldList = res.bindMoldList;
                            } else {
                                data.bindMoldList = [];
                            }
                            this.$emit('firstBindPush', data)
                        }
                    })
            },

            // 新增策略
            addCeLue() {
                this.scoreKingData.push({scorecardName: '选择模型', rate: ''})
            },
            // 删除策略
            deleteCeLue(val) {
                this.scoreKingData.splice(val.$index, 1)
                this.$local.set('formList', this.scoreKingData)
            },
            // 点击策略名称
            newCeLue(val) {
                switch (this.$route.query.needMoldType) {
                    case '1':
                        this.$router.push({
                            path: this.$route.fullPath.replace('/kingForm', '/outFrandForm'),
                            query: {
                                from: 'kingForm'
                            }
                        })
                        break;
                    case '3':
                        this.$router.push({
                            path: this.$route.fullPath.replace('/kingForm', '/creditForm'),
                            query: {
                                from: 'kingForm'
                            }
                        })
                        break;
                    case '4':
                        this.$router.push({
                            path: this.$route.fullPath.replace('/kingForm', '/scoreCardForm'),
                            query: {
                                from: 'kingForm'
                            }
                        })
                        break;
                }

                val.row.id == undefined ? this.$local.delete('formId') : this.$local.set('creditFormId', val.row.id)
                // if (val.$index>this.scoreKingData.length)
                // if (val.row.scorecardName!='选择模型') {
                this.$local.set('formIndex', val.$index + 1)
                // }

            },
            // 保存
            saveBtn() {
                this.scoreKingData.map((item, value, array) => {
                    if (item.policyName == '' || item.rate == '' || item.rate == null) {
                        this.$message.error('保存失败，配置内容不全')
                        return;
                    } else if (item.rate <= 0) {
                        this.$message.error('流量值必须大于0')
                        return;
                    } else if (item.rate > 1) {
                        this.$message.error('流量值不能大于1')
                        return;
                    }
                    if (!item.bindId) {
                        item.bindId = item.id
                        item.bindName = item.moldName
                    }
                })

                this.$post('/mcs/node/mold/bind', {
                    nodeId: this.$route.query.nodeId.slice(4),
                    bindMoldList: this.scoreKingData,
                    // clear:
                })
                    .then(res => {
                        this.$message.success('添加成功')
                        let path = this.$route.fullPath.replace('&from=kingForm', '').replace('/kingForm', '')
                        this.$router.push(path)
                        this.$local.delete('formList')

                        // this.$emit('saveForm', {
                        //     nodeId: this.$route.query.nodeId,
                        //     data: this.scoreKingData
                        // }, 'policyKing')
                        this.$emit('saveForm', {
                            nodeId: this.$route.query.nodeId,
                            data: this.scoreKingData,
                            formType: 'policyKing'
                        })
                    })

            },
        },
        beforeDestroy() {
            // this.$bus.$off('getContent')
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    .pages_kingForm {
        @import "../../../../../resource/style/base/var";

        padding-top: 20px;
        padding-bottom: 40px;
        width: 380px;
        .el-table {
            margin: 20px 0 10px;
            th {
                .cell {
                    color: #666 !important;
                }
            }
            i {
                cursor: pointer;
            }
            .cell {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            tbody {
                tr {
                    .iconDiv {
                        opacity: 0;
                    }
                    &:hover {
                        .iconDiv {
                            opacity: 1;
                        }
                    }
                    .name {
                        cursor: pointer;
                        &:hover {
                            -webkit-transform: scale(1.1);
                            -moz-transform: scale(1.1);
                            -ms-transform: scale(1.1);
                            -o-transform: scale(1.1);
                            transform: scale(1.1);
                        }
                    }
                }
            }
            .primaryColor {
                color: $blue;
            }

        }
    }
</style>
