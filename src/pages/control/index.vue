<template>
    <div class="page_control">
        <vHeader/>
        <menu1/>
        <div class="fl pages_con">
            <breadcrumb/>
            <router-view class="con_child"/>
        </div>
        <vFooter/>
    </div>
</template>

<script>
    import vHeader from "../../components/pc/hd/hd"
    import menu1 from "../../components/pc/menu/menu"
    import breadcrumb from "../../components/pc/breadcrumb/breadcrumb"
    import vFooter from "../../components/pc/ft/ft"

    export default {
        name: "controlIndex",
        components:{vHeader,menu1,breadcrumb,vFooter}
    }
</script>

<style scoped lang="scss">
    .page_control {
        position: relative;
        background: #fff;
        .pages_con {
            position: relative;
            width: calc(100% - 200px);
            margin-left: -14px;
            border-left: 1px solid #e6e6e6;
            box-shadow: 5px 5px 5px 0 #eaeaea inset;
        }
    }


</style>
