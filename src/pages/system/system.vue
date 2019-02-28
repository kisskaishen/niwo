<template>
    <div class="pages_system">
        <menu1/>
        <div class="fl pages_con">
            {{ pageName }}
        </div>
    </div>
</template>

<script>
import menu1 from "components/pc/menu/menu"
export default {
    name: 'pages_system',
    data () {
        return {
            pageName: 'pages_system'
        }
    },
    components:{
        menu1,
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
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.pages_system{
    .pages_con{
        padding:10px 14px 0 0;
    }
  
}
</style>
