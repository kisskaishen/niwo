<template>
    <div id="app">
        <!--<hd/>-->
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>

        <!--<ft/>-->
    </div>
</template>

<script>
    // import hd from "components/pc/hd/hd"
    // import ft from "components/pc/ft/ft"

    export default {
        name: 'App',
        data() {
            return {
                hash: location.hash.slice(1),
            }
        },
        // components: {
        //     hd, ft,
        // },
        created() {
            let _self = this;
            window.addEventListener("hashchange", _self.hashchange, false)
        },
        mounted() {

        },
        methods: {
            hashchange() {
                this.hash = location.hash.slice(1);
            }
        }
    }
</script>

<style lang="scss">
    @import './resource/style/style';

    #app {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        max-width: 1920px;
        margin: 0 auto;
    }
    .disable-click {
        user-select: none;
    }
</style>
