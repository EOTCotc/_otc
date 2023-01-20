import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import echarts from "echarts";

import Vant from "vant";

// 复制粘贴
import VueClipboard from "vue-clipboard2";

// toast弹窗
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

// import { time2 } from "@/api/autoRequest"

// 语言国际化
import i18n from "@/i18n";

// 日期时间格式化
import "./utils/Dayjs";

import "vant/lib/index.less";
import "amfe-flexible";

import plugin from "@/plugin";

//全局引入阿里图标
import "./style/index.css";
import "./style/buysell-icons/iconfont.css"
// 导入组件库
import VueCanvasPoster from "vue-canvas-poster";

import all from "@/js/all";
//图片懒加载
import { Lazyload } from "vant";

Vue.use(Lazyload);

Vue.use(all); //将全局函数当做插件来进行注册

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
// 注册组件库
Vue.use(VueCanvasPoster);

Vue.config.productionTip = false;

Vue.prototype.$echarts=echarts

// Vue.config.errorHandler = function (err, vm, info) {
//   console.log(err);
//   console.log(vm);
//   Vue.$toast.error(err.message, {
//     timeout: 3000,
//   });
//   Vue.$toast.warning(info, {
//     timeout: 3000,
//   });
//   router.replace({
//     name: "error",
//   });
// };

new Vue({
  render: (h) => h(App),
  router,
  store,
  i18n,
  beforeCreate() {
    Vue.prototype.$bus = this;
    // Vue.prototype.bug = time2
  },
}).$mount("#app");
