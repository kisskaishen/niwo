<template>
    <div class="pages_ruleConItem">
        <!-- v-show因为ruleCon_plus需要调用此组件里面的方法 -->
        <varItem ref="varItem" :icon="icon" :variableList="variableList" :item="item" :index="index" :vLock="vLock"
                 @getVarType="getVarType"></varItem>
        <el-form-item class="ruleConItem mg_b_0" label="规则执行条件：" prop="logic" v-if="!!item.ruleContent.length">
            <el-radio-group v-model.number="item.logic" :class="{'solid_red':vLock&&!item.logic}">
                <el-radio :label="2" v-if="($route.query.type=='look')?item.logic==2:true">满足任意条件</el-radio>
                <el-radio :label="1" v-if="($route.query.type=='look')?item.logic==1:true">满足全部条件</el-radio>
            </el-radio-group>
        </el-form-item>
        <div class="noResult" v-else>竟然删空了，去<span class="f_blue pointer" @click="ruleCon_plus(item,index)">添加变量</span>
        </div>
    </div>
</template>

<script>
    import varItem from './varItem'

    export default {
        name: 'pages_ruleConItem',
        data() {
            return {
                pageName: 'pages_ruleConItem',
            }
        },
        props: ['icon', 'variableList', 'item', 'index', 'vLock'],
        components: {varItem},
        created() {

        },
        methods: {
            ruleCon_plus(item, index) {
                this.$refs.varItem.$refs.variableName.ruleCon_plus(item, index);
            },
            getVarType(ruleCon) {// 调用父级组件ruleItem的getVarType
                this.$emit('getVarType', ruleCon)
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
    .pages_ruleConItem {
        padding: 0 20px;
        @import '../../../resource/style/pages/ruleConItem';
    }
</style>
