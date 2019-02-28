import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// state访问状态对象
const state={
    count:1,
    userInfo:null,
}
// Mutations修改状态
const mutations={
    add(state,n){
        state.count+=n;
    },
    reduce(state){
        state.count--;
    },
    saveUser(state,msg){
        state.userInfo=msg;
    },
}
// getters计算过滤操作
const getters = {
    count(state){
        return state.count += 100;
    }
}
//actions异步修改状态
const actions = {
    addAction(context){// context：上下文对象，这里可以理解称store本身。
        context.commit('add',10)
    },
    reduceAction({commit}){// {commit}：直接把commit对象传递过来，可以让方法体逻辑和代码更清晰明了
        commit('reduce')
    }
}

export default new Vuex.Store({
    state,mutations,getters,actions
})