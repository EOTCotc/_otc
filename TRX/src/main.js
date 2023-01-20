import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import echarts from "echarts";

import Vant from "vant";

import VueClipboard from "vue-clipboard2";

import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

import { time2 } from "@/api/autoRequest"

import i18n from "@/i18n";

import "./utils/Dayjs";

import "vant/lib/index.less";
import "amfe-flexible";

import plugin from "@/plugin";

import "./style/index.css";
import "./style/buysell-icons/iconfont.css"
import VueCanvasPoster from "vue-canvas-poster";

import all from "@/js/all";
import { Lazyload } from "vant";

Vue.use(Lazyload);

Vue.use(all); 

Vue.use(VueClipboard);

Vue.use(Vant);
Vue.use(plugin);
Vue.use(Toast, {
  position: POSITION.TOP_CENTER,
  timeout: 2000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.8,
  showCloseButtonOnHover: false, // 仅在悬停时显示关闭按钮
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
  rtl: false,
  maxToasts: 3,
});
Vue.use(VueCanvasPoster);

Vue.config.productionTip = false;

Vue.prototype.$echarts=echarts


Vue.config.errorHandler = function (err, vm, info) {
  // router.replace({
  //   name: "index",
  // });
};

new Vue({
  render: (h) => h(App),
  router,
  store,
  i18n,
  beforeCreate() {
    Vue.prototype.$bus = this;
  },
}).$mount("#app");
