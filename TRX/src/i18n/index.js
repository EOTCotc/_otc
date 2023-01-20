import Vue from "vue"
import Vuei18n from 'vue-i18n'


import zh from "./lang/zh"
import en from "./lang/en"


Vue.use(Vuei18n )



const i18n = new Vuei18n({
    locale : localStorage.getItem('lang') || 'zh', // 语言
    messages: {  // 文案
    zh, // 文案的中文版
    en // 文案的英文版
    }
  })


export default i18n