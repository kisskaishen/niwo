<template>
    <div class="pages_modelMg">
<!--         <div class="mg_tab" v-if="$route.path.indexOf('modelUml')==-1">
            <router-link class="tab_item" to="/risk/modelMg/modelList">模型列表</router-link>
            <router-link class="tab_item" to="/risk/modelMg/modelList/modelAdd">{{modelAdd}}</router-link>
        </div> -->
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'pages_modelMg',
    data () {
        return {
            pageName: 'pages_modelMg',
        }
    },
    computed:{
        modelAdd() {
            switch(this.$route.query.type){
                case 'look':
                    return '查看模型';
                case 'copy':
                    return '复制模型';
                case 'edit':
                    return '编辑模型';
                default:
                    return '新增模型';
            }            
        },
    },
    created () {
    },
    methods:{

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.pages_modelMg{
  
}
</style>
