<template>
    <div class="pages_offline">
        <menu1/>
        <div class="fl pages_con">
            {{ pageName }}
        </div>
    </div>
</template>

<script>
import menu1 from "components/pc/menu/menu"
export default {
    name: 'pages_offline',
    data () {
        return {
            pageName: 'pages_offline'
        }
    },
    components:{
        menu1,
    },
    created () {

    },
    methods:{
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.pages_offline{
    .pages_con{
        padding:10px 14px 0 0;
    }
  
}
</style>
