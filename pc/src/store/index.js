import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        userMsg:{
            name:'',
            photo:''
        }
    },
    mutations: {
        getMsg(state,value){
            Object.assign(state.userMsg,value)
        }
    }
})

export default store