<template>
    <div class="pages_template">
        <h1>{{ pageName }}</h1>
    </div>
</template>

<script>
import store from 'config/store'
import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'
export default {
    metaInfo () {
        return {
            title: this.pageName,            
            meta: [{
                name: 'keywords',
                content: '【关键词】关键词,关键词,关键词,关键词,关键词,关键词'
            },{
                name: 'description',
                content: '【描述】,描述内容,描述内容,描述内容,描述内容,描述内容,描述内容,描述内容,描述内容,描述内容,描述内容,描述内容,描述内容,描述内容'
            }]
        }
    },
    name: 'pages_template',
    data () {
        return {
            pageName: 'pages_template'
        }
    },
    store,
    computed:{
        ...mapState(["count"]),
        ...mapGetters(["count"]),
    },
    created () {
        // this.postData();
    },
    methods:{
        ...mapMutations(['add','reduce']),
        ...mapActions(['addAction','reduceAction']),
        getData () {
            axios({
                method:'post',
                url:'',
                params:{                    
                    hash:''
                },
                timeout: 5000, 
                responseType: 'jsonp',
                // debug:true,
            })           
            .then((res) => {
                console.log('res',res);
            })
            .catch((error) => { 
                console.log('error',error);
            })
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.pages_template{
  
}
</style>
