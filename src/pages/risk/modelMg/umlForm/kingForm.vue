<template>
    <div class="pages_kingForm">
        <!--<div class="pages_kingForm" v-loading="loading">-->
        <h2>{{ pageName }}</h2>
        <el-table :data="kingData" :header-row-class-name="'table_hd'" :header-cell-class-name="'table_th'"
                  :row-class-name="'table_tr'" :cell-class-name="'table_td'" v-if="$route.query.moldType == '1'">
            <el-table-column prop="text" label="策略">
                <template slot-scope="scope">
                    <p @click="newCeLue(scope)" class="name primaryColor">{{scope.row.policyName}}</p>
                    <div class="iconDiv" v-if="$route.query.type=='edit'">
                        <i class="el-icon-circle-plus-outline" @click="addCeLue(scope)"></i>
                        <i class="el-icon-delete" v-if="kingData.length>1" @click="deleteCeLue(scope)"></i>
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
        <el-table :data="scoreKingData" :header-row-class-name="'table_hd'" :header-cell-class-name="'table_th'"
                  :row-class-name="'table_tr'" :cell-class-name="'table_td'" v-if="$route.query.moldType == '3'">
            <el-table-column prop="text" label="评分卡">
                <template slot-scope="scope">
                    <p @click="newCeLue(scope)" class="name primaryColor">
                        {{scope.row.scorecardName||scope.row.bindName}}</p>
                    <div class="iconDiv" v-if="$route.query.type=='edit'">
                        <i class="el-icon-circle-plus-outline" @click="addCeLue(scope)"></i>
                        <i class="el-icon-delete" v-if="scoreKingData.length>1" @click="deleteCeLue(scope)"></i>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="number" label="流量">
                <template slot-scope="scope">
                    <p v-if="$route.query.type=='look'">{{scope.row.rate}}</p>
                    <el-input v-model.number="scope.row.rate" v-else maxLength="4" size="mini"
                              placeholder="支持两位小数"></el-input>
                </template>
            </el-table-column>
        </el-table>
        <p style="margin-bottom: 40px;color:#ccc;" v-if="$route.query.moldType=='1'">
            注：当仅含1个策略元件且流量=1，即代表该策略无挑战者</p>
        <p style="margin-bottom: 40px;color:#ccc;" v-if="$route.query.moldType=='3'">
            注：当仅含1个评分卡元件且流量=1，即代表该评分卡无挑战者</p>
        <el-button type="primary" @click="saveBtn" v-if="$route.query.type=='edit'">保存</el-button>
    </div>
</template>

<script>
    export default {
        name: 'pages_kingForm',
        data() {
            return {
                loading: false,
                pageName: '添加冠军/挑战者',
                kingData: [],
                scoreKingData: [],
            }
        },
        created() {

        },
        mounted() {
            if (this.$route.query.moldType == '1') {
                // 这里是策略

                if (JSON.stringify(this.$local.get('policyList')) != '{}') {
                    // 如果本地的policyList有数据，则复制给kingData，展现数据
                    this.kingData = this.$local.get('policyList')
                    console.log(this.kingData)
                } else {

                    // 否则是初始空数据
                    this.kingData.push({policyName: '新建策略', rate: ''})
                    this.getList()

                }
            } else if (this.$route.query.moldType == '3') {
                // 这里是评分卡
                if (JSON.stringify(this.$local.get('scoreList')) != '{}') {
                    this.scoreKingData = this.$local.get('scoreList')
                } else {
                    // this.scoreKingData.push({scorecardName: '评分卡模型', rate: ''})
                    this.getList()
                }

            }
        },
        methods: {
            // 获取冠军/挑战者列表，已经绑定情况下
            getList() {
                let url = ''
                if (this.$route.query.moldType == '1') {
                    url = '/mcs/node/policy/query'
                } else if (this.$route.query.moldType == '3') {
                    url = '/mcs/node/mold/query'
                }
                this.$post(url, {
                    nodeId: this.$route.query.nodeId.slice(4),// 产品线ID   Number  Y
                })
                    .then(res => {
                        if (res != null) {
                            if (this.$route.query.moldType == '1') {
                                // 获取到冠军挑战者列表，并赋值给本地的policyList
                                this.kingData = res.policyList ? res.policyList : []
                                this.$local.set('policyList', res.policyList)
                                {// 撤销恢复：记录绑定的初始版本
                                    let maxItem = res.policyList[0];
                                    res.policyList.map(item => {
                                        if (item.rate > maxItem.rate) {
                                            maxItem = item;
                                        }
                                    });
                                    let data = {}

                                    data.nodeName = maxItem.policyName;
                                    data.nodeId = this.$route.query.nodeId;
                                    data.clear = res.policyList.length > 0 ? false : true;
                                    if (res.policyList) {
                                        data.policyList = res.policyList;
                                    } else {
                                        data.policyList = [];
                                    }
                                    this.$emit('firstBindPush', data)
                                }

                            } else {
                                if (res.bindMoldList.length > 0) {
                                    this.scoreKingData = res.bindMoldList
                                    this.$local.set('scoreList', res.bindMoldList)

                                    // Object.assign(this.scoreKingData, res.bindMoldList)
                                    // console.log(Object.assign(this.scoreKingData, res.bindMoldList))
                                    // console.log(this.scoreKingData)
                                } else {
                                    this.scoreKingData = [{
                                        scorecardName: '评分卡模型',
                                        rate: ''
                                    }]
                                }
                                {// 撤销恢复：记录绑定的初始版本

                                    console.log(res)
                                    let maxItem = res.bindMoldList[0];
                                    res.bindMoldList.map(item => {
                                        if (item.rate > maxItem.rate) {
                                            maxItem = item;
                                        }
                                    });
                                    let data = {}

                                    data.nodeName = maxItem.bindName;
                                    data.nodeId = this.$route.query.nodeId;
                                    data.clear = res.bindMoldList.length > 0 ? false : true;

                                    if (res.bindMoldList) {
                                        data.bindMoldList = res.bindMoldList;
                                    } else {
                                        data.bindMoldList = [];
                                    }
                                    this.$emit('firstBindPush', data)
                                }
                            }
                        }
                        this.loading = false

                    })
            },

            // 新增策略
            addCeLue() {
                if (this.$route.query.moldType == '1') {
                    this.kingData.push({policyName: '新建策略', rate: ''})

                } else if (this.$route.query.moldType == '3') {
                    this.scoreKingData.push({scorecardName: '评分卡模型', rate: ''})

                }
            },
            // 删除策略
            deleteCeLue(val) {
                if (this.$route.query.moldType == '1') {
                    this.kingData.splice(val.$index, 1)
                    this.$local.set('policyList', this.kingData)

                } else if (this.$route.query.moldType == '3') {
                    this.scoreKingData.splice(val.$index, 1)
                    this.$local.set('scoreList', this.scoreKingData)

                }

            },
            // 点击名称
            newCeLue(val) {
                // 点击已读取的模型名称，挑战到stratForm，已经选择的模型的详情页，
                // 这里有一个疑问就是确定val的信息，如果有信息，policyId，有的话路由上请求上去=>确认了有policyId
                switch (parseInt(this.$route.query.moldType)) {
                    case 1:
                        this.$router.push({
                            path: this.$route.fullPath.replace('/kingForm', '/stratForm'),
                            query: {
                                from: 'kingForm',
                                policyId: val.row.policyId
                            }
                        })
                        this.$local.set('formIndex', val.$index + 1)
                        break;
                    case 3:
                        this.$router.push({
                            path: this.$route.fullPath.replace('/kingForm', '/scoreCardForm'),
                            query: {
                                from: 'kingForm'
                            }
                        })
                        val.row.id == undefined ? this.$local.delete('scoreListId') : this.$local.set('scoreListId', val.row.id)
                        this.$local.set('formIndex', val.$index + 1)
                        break;
                }

            },
            // 保存
            saveBtn() {
                if (this.$route.query.moldType == '1') {
                    this.kingData.map((item, value, array) => {
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
                    })
                    // 绑定冠军挑战者接口
                    this.$post('/mcs/node/policy/bind', {
                        nodeId: this.$route.query.nodeId.slice(4),
                        policyList: this.kingData,
                    })
                        .then(res => {
                            // this.$bus.$emit('getContent', res)

                            // 添加成功后，请求modelUml里面的getContent接口，重新请求数据
                            this.$message.success('添加成功')
                            // 并将页面kingForm页面隐藏，路由上去掉&from=kingForm标志吗，返回到modelUml页面
                            // let path = this.$route.fullPath.replace('&from=kingForm', '').replace('/kingForm', '')
                            // this.$router.push(path)
                            // 并删除policyList
                            this.$local.delete('policyList')
                            // setTimeout(() => {
                            //     location.reload()
                            // }, 300)
                            console.log('冠军挑战者绑定成功,调用saveForm', this.kingData);
                            this.$emit('saveForm', {
                                nodeId: this.$route.query.nodeId,
                                data: this.kingData,
                                formType: 'policyKing'
                            })
                        })
                } else {
                    console.log(this.scoreKingData)
                    this.scoreKingData.map((item, value, array) => {
                        if (!item.bindId) {
                            item.bindId = item.id
                            item.bindName = item.moldName
                        }

                        if (item.scorecardName == '' || (item.rate == '' && item.rate != 0)) {
                            this.$message.error('保存失败，配置内容不全')
                            return
                        } else if (item.rate <= 0) {
                            this.$message.error('流量值必须大于0')
                            return
                        }
                    })
                    this.$post('/mcs/node/mold/bind', {
                        nodeId: this.$route.query.nodeId.slice(4),
                        bindMoldList: this.scoreKingData,
                        // clear:
                    })
                        .then(res => {
                            this.$message.success('添加成功')
                            // let path = this.$route.fullPath.replace('&from=kingForm', '').replace('/kingForm', '')
                            // this.$router.push(path)
                            this.$local.delete('scoreList')
                            console.log('冠军挑战者绑定成功,调用saveForm', this.kingData);
                            this.$emit('saveForm', {
                                nodeId: this.$route.query.nodeId,
                                data: this.scoreKingData,
                                formType: 'policyKing',
                                formType2: 'scoreKing',
                            })
                            // setTimeout(() => {
                            //     location.reload()
                            // }, 300)
                        })
                }

            },
        },
        beforeRouteUpdate(to, from, next) {
            const newId = to.query.nodeId;
            const oldId = from.query.nodeId;
            console.log(newId, oldId);    //345,123
            next();
        },
        beforeDestroy() {
            this.$bus.$off('getContent')
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    @import "../../../../resource/style/base/var";

    .pages_kingForm {
        padding-top: 20px;
        width: 100%;
        padding-bottom: 40px;
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
        }
        .primaryColor {
            color: $blue;
        }

    }
</style>
