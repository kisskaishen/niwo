<template>
    <div class="pages_index">

    </div>
</template>

<script>

export default {
    name: 'pages_index',
    data () {
        return {
            pageName: 'pages_index'
        }
    },

    created () {
        this.$router.push('/risk/proMg/businessList');// 默认跳转产品列表页
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
        getData () {
            axios({
                url:'',
                method:'get',
                params:{},
            },(res)=>{

            },(err)=>{

            });
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.pages_index{
  
}
</style>
