<template>
    <div class="pages_ft text-right bg_fff pd_r_20">
        <div class="f14">涵数决策引擎 | 你我金融出品</div>
    </div>
</template>

<script>
    export default {
        name: 'pages_ft',
        data() {
            return {
                pageName: 'pages_ft'
            }
        },
        created() {

        },
        methods: {}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
    .pages_ft {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 50px;
        line-height: 50px;
        border-top: 1px solid #E4E7F2;
        color: #A1A7B2;
        z-index: 99;
    }
</style>
