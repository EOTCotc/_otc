import Vue from "vue"
import Vuex from "vuex"

import {getItem,setItem } from "@/utils/storage"

import { baseUrl } from "@/utils/request"

Vue.use(Vuex)


const state = {
    url:baseUrl,
    merchantInfoMap:{},
    userUid:getItem("uid")
}
const actions = {

}

const mutations = {
    setMerchantInfoMap(state,data){
        state.merchantInfoMap[data.it.odid] = data
    },
}

const getters = {

}

export default new Vuex.Store({
    state,
    actions,
    mutations,
    getters,
    strict: true
})