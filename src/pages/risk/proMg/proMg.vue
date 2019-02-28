<template>
    <div class="pages_proMg">
<!--         <div class="mg_tab">
            <router-link class="tab_item" to="/risk/proMg/proList">产品列表</router-link>
            <router-link class="tab_item" to="/risk/proMg/proList/proAdd">新增产品</router-link>
        </div> -->
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'pages_proMg',
    data () {
        return {
            pageName: 'pages_proMg'
        }
    },
    created () {
        this.$router.push('/risk/proMg/proList');// 默认跳转产品列表页
        // this.postData();        
    },
    methods:{
        postData () {            
            axios({
                url:'',
                data:{},
            },(res)=>{

            },(err)=>{

            });
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.pages_proMg{
  
}
</style>
