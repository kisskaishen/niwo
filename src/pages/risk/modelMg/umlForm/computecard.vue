<template>
    <div class="pages_computecard pd_t_20">
    <!--<div class="pages_computecard pd_t_20" v-loading="loading">-->
        <el-form class="computecard" :model="computecard" status-icon ref="computecard">
            <el-form-item class="computeItem" label="常用公式：" prop="formula" v-if="$route.query.type=='edit'">
                <el-radio-group v-model="computecard.formula">
                    <el-radio :label="item.value" v-for="(item,index) in formulaList" :key="index" v-if="item.common">
                        {{item.text}}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item class="computeItem" label="更多公式：" prop="formula" v-if="$route.query.type=='edit'">
                <el-radio-group v-model="computecard.formula">
                    <el-radio :label="item.value" v-for="(item,index) in formulaList" :key="index" v-if="!item.common">
                        {{item.text}}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item class="computeItem" label="公式：" prop="formula" v-else>
                <el-radio-group v-model="computecard.formula">
                    <el-radio :label="item.value" v-for="(item,index) in formulaList" :key="index"
                              v-if="item.value==computecard.formula">{{item.text}}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item class="computeItem" label="计算内容：" prop="value" v-if="computecard.formula">
                <el-form-item label="" v-if="curType==1" class="pd_r_0">
                    <span class="value_pos w150 el-input el-input--medium text-middle">
                        <span>{{computecard.formulabel}}</span>
                        <span class="el-input__inner">前一个元件输出</span>
                    </span>
                    <!-- <el-input class="w150" v-model="computecard.value" placeholder="请输入自然数幂" size="medium" clearable></el-input> -->
                </el-form-item>
                <el-form-item label="" v-else>
                    <div class="value_pos inlineBlock" :class="computecard.computeType==1?'left':'right'">
                        {{computecard.formulabel}}

                        <el-input class="w150" :class="{'solid_red':vLock&&!value.text}" v-model="value.text"
                                  placeholder="数值/变量" size="medium" @input="valueInput"
                                  @keyup.native="value.text=value.text.replace(/[^\d./-]/g,'')"
                                  :disabled="$route.query.type=='look'" clearable></el-input>
                        <img class="icon_search pointer" :src="icon.search" @click="dialog.show=true" alt="搜索"
                             v-if="$route.query.type=='edit'">
                    </div>
                    <span class="comma">，</span>
                    <span class="value_pos w150 el-input el-input--medium text-middle"
                          :class="computecard.computeType==1?'right':'left'">
                        <span class="el-input__inner" :class="{'noBorder':$route.query.type=='look'}">前一个元件输出</span>
                    </span>
                    <img class="icon_refresh pointer" :src="icon.refresh" alt="转换计算方式" @click="changeType"
                         v-if="$route.query.type=='edit'">
                </el-form-item>
            </el-form-item>
            <div class="text-center">
                <el-button class="" type="primary" size="medium" @click="bindComputecard"
                           v-if="$route.query.type!='look'">保存
                </el-button>
            </div>
        </el-form>
        <!-- 弹窗区域 -->
        <el-dialog title="选择变量" :visible.sync="dialog.show" :modal-append-to-body="false" width="400px" center>
            <el-select :popper-append-to-body="true" class="w100" v-model="value.select" ref="changeStratVar" filterable
                       placeholder="请选择已有变量" size="medium" no-match-text="查询无结果" no-data-text="暂无数据"
                       popper-class="stratList">
                <el-option v-for="(item,index) in variableList" :key="index" :label="item.variableName"
                           :value="item.variableId">
                    <div class="stratOption overhide" :title="item.variableName">{{item.variableName}}</div>
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="dialog.show=false">取 消</el-button>
                <el-button type="primary" size="medium" @click="saveValVar">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    let icon = {
        refresh: require('img/icon/refresh.png'),
        search: require('img/icon/search.png'),
    }
    export default {
        name: 'pages_computecard',
        data() {
            return {
                loading:false,
                pageName: 'pages_computecard', icon,
                /**
                 * 运算公式初始化列表
                 * @param text 公式名。
                 * @param value 公式代表的值。
                 * @param type 公式类型。1：单目运算符，2：双目运算符
                 * @param swap 是否有序。对于双目运算符，可能会有操作数的顺序
                 * @param common 是否是常用公式
                 * */
                formulaList: [
                    {
                        text: '向上百位取整',
                        value: 1,
                        type: 1,
                        swap: false,
                        common: true
                    },
                    {
                        text: '向下百位取整',
                        value: 2,
                        type: 1,
                        swap: false,
                        common: true
                    },
                    {
                        text: 'min',
                        value: 3,
                        type: 2,
                        swap: false,
                        common: true
                    },
                    {
                        text: 'max',
                        value: 4,
                        type: 2,
                        swap: false,
                        common: true
                    },
                    {
                        text: '+',
                        value: 5,
                        type: 2,
                        swap: false,
                        common: true
                    },
                    {
                        text: '-',
                        value: 6,
                        type: 2,
                        swap: true,
                        common: true
                    },
                    {
                        text: '*',
                        value: 7,
                        type: 2,
                        swap: false,
                        common: true
                    },
                    {
                        text: '/',
                        value: 8,
                        type: 2,
                        swap: true,
                        common: true
                    },
                    {
                        text: 'ln',
                        value: 9,
                        type: 1,
                        swap: false,
                        common: false
                    },
                    {
                        text: 'lg',
                        value: 10,
                        type: 1,
                        swap: false,
                        common: false
                    },
                    {
                        text: 'log',
                        value: 11,
                        type: 2,
                        swap: false,
                        common: false
                    },
                    {
                        text: 'sin',
                        value: 12,
                        type: 1,
                        swap: false,
                        common: false
                    },
                    {
                        text: 'cos',
                        value: 13,
                        type: 1,
                        swap: false,
                        common: false
                    },
                    {
                        text: '自然数幂',
                        value: 14,
                        type: 1,
                        swap: false,
                        common: false
                    },
                    {
                        text: '幂数',
                        value: 15,
                        type: 2,
                        swap: true,
                        common: false
                    }
                ],
                variableList: [],// 量化型变量列表
                computecard: {
                    nodeId: '',// 节点ID    Number  Y
                    nodeName: '计算卡',
                    formulabel: '',      //汉字
                    formula: null,// 公式  Number  Y   根据计算引擎来
                    computeType: 1,// 计算方式    Number  Y   1：value为左值，2：value为右值
                    value: '',// 运算值 String  N   为空表示不需要填计算值
                    valueType: 0,// 值类型 Number  Y   0:无需value值，1：value为常量，2：value为变量ID
                },
                value: {
                    text: '',
                    select: '',
                },
                dialog: {
                    show: false,
                },
                vLock: false,
                isNewNode: true,// 是否是新节点
            }
        },
        props: ['variableListUml'],
        computed: {
            curType() {
                let curVal;
                this.formulaList.map((item, index) => {
                    if (item.value == this.computecard.formula) {
                        curVal = item.type;
                    }
                })
                return curVal;
            },
        },
        watch: {
            // curType(value,oldValue) {
            //     this.computecard.value = '';
            //     this.computecard.valueType = 1;
            //     this.value.text = '';
            // },
        },
        created() {
            this.variableList = this.variableListUml;
            !this.variableListUml.length && this.getVariableList();
            this.queryComputecard();
        },
        methods: {
            valueInput() {// 输入值
                this.computecard.valueType = 1;// 值类型：1常量
                this.computecard.value = this.value.text;// 修改输入框的值为变量名
            },
            saveValVar() {// 选择值：保存变量
                this.computecard.valueType = 2;// 值类型：2变量
                this.value.text = this.$refs.changeStratVar.query;// 修改输入框的值为变量名
                this.computecard.value = this.value.select;// 保存值为变量ID
                this.dialog.show = false;
            },
            changeType() {// 转换计算方式
                this.computecard.computeType = this.computecard.computeType == 1 ? 2 : 1;
            },
            getVariableList() {// 3.2.5查询变量列表
                let _self = this;
                this.$post('/mcs/variable/list', {
                    appId: _self.$route.query.appId,//产品线ID   Number  N
                })
                    .then(res => {
                        this.variableList = res.variableList;
                    })
                // axios({
                //     url:'/mcs/variable/list',
                //     data:{
                //         appId:_self.$route.query.appId,//产品线ID   Number  N
                //     },
                //     // debug:true,
                //     // ret:0,
                // },(res)=>{
                //     this.variableList = res.data.variableList;
                // },(err)=>{
                //
                // });
            },
            bindComputecard() {
                if (!this.computecard.formula) {
                    this.$notify({// 通知提示
                        message: '请选择公式',
                        type: 'warning'
                    })
                } else if (this.curType == 2 && this.computecard.value == '') {
                    this.vLock = true;
                    this.$notify({// 通知提示
                        message: '请填写幂数',
                        type: 'warning'
                    })
                } else {
                    let data = JSON.parse(JSON.stringify(this.computecard))
                    data.nodeId = this.$route.query.nodeId.slice(4);
                    this.$post('/mcs/node/computecard/bind', data)
                        .then(res => {
                            data.nodeName = '计算卡';
                            data.nodeId = this.$route.query.nodeId;
                            this.$emit('saveForm', data);// 关闭弹窗
                        })
                }
            },
            queryComputecard() {
                let _self = this;
                this.$post('/mcs/node/computecard/query', {
                    nodeId: this.$route.query.nodeId.slice(4),// 产品线ID   Number  Y
                })
                    .then(res => {
                        if (res) {
                            Object.assign(this.computecard, res);
                            if (res.valueType == 1) {
                                this.value.text = res.value;
                            } else if (res.valueType == 2) {
                                this.value.text = this.variableList.filter(item => item.variableId == res.value)[0].variableName
                            }
                        }
                        {// 撤销恢复：记录绑定的初始版本
                            let data = JSON.parse(JSON.stringify(this.computecard))
                            data.nodeName = '计算卡';
                            data.nodeId = this.$route.query.nodeId;
                            data.clear = !res;
                            this.$emit('firstBindPush', data)
                        }
                        this.loading = false
                    })
            },
        },
        watch: {
            'computecard.formula'(val) {
                this.formulaList.map(item => {
                    if (val == item.value) {
                        this.computecard.formulabel = item.text
                    }
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    .pages_computecard {
        width: 473px;
        .computecard {
            .computeItem {
                & > .el-form-item__label {
                    float: none;
                }
                .pd_r_0 {
                    .el-form-item__content {
                        padding-left: 0px;
                    }
                }
                .el-form-item__content {
                    padding-left: 30px;
                    .el-radio-group {
                        .el-radio {
                            line-height: 40px;
                            float: left;
                            width: 120px;
                            margin-right: 20px;
                            & + .el-radio {
                                margin-left: 0px;
                            }
                        }
                    }
                }
                .value_pos { // 计算内容位置
                    position: relative;
                    transition: all 0.3s ease;
                    &.left {
                        /*transform: translateX(-170px);*/
                        position: absolute;
                        top: 0;
                        left: 36px;
                    }
                    &.right {
                        /*transform: translateX(170px);*/
                        position: absolute;
                        top: 0;
                        right: 86px;
                    }
                    .icon_search {
                        position: absolute;
                        top: 10px;
                        left: 124px;
                    }
                    .el-input__inner {
                        padding-right: 45px;
                    }
                    .el-input__suffix {
                        right: 25px;
                    }
                }
                .icon_refresh {
                    position: absolute;
                    top: 9px;
                    right: 58px;
                    &:active {
                        transform: rotate(360deg);
                        transition: all 0.5s ease;
                    }
                }
                .comma {
                    position: absolute;
                    top: 8px;
                    left: 190px;
                }
            }
        }
        .stratList { // 策略下拉列表
            width: 310px;
        }
        .el-select {
            .el-input__suffix { // 隐藏下拉箭头
                display: none;
                cursor: text;
            }
        }
        .text-center {
            margin-top: 60px;
        }
    }
</style>
