<template>
    <div class="pages_template">
        <h1>{{ pageName }}</h1>
    </div>
</template>

<script>
export default {
    name: 'pages_template',
    data () {
        return {
            pageName: 'pages_template'
        }
    },
    created () {
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
.pages_template{
  
}
</style>
