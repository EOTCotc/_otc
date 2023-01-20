const plugin = {
  begin: 0,
  clearHtml: new RegExp(/<[^>]+>/gim),
  install(Vue) {
    Vue.prototype.briefMyAddress = function (value) {
      let startMyAddress = value?.substr(0, 10);
      let midMyAddress = ".".repeat(3);
      let endMyAddress = value?.substr(-10, 10);
      return startMyAddress + midMyAddress + endMyAddress;
    };
    Vue.prototype.throttle = function (fn, delay) {
      let curTime = Date.now();
      if (curTime - plugin.begin > delay) {
        fn.call(this);
        plugin.begin = curTime;
      }
    };
    Vue.prototype.copyContent = function (message, tips) {
      this.$toast.clear();
      message = message
        .replace(plugin.clearHtml, "")
        .replace(/(\r|\n|\\s)+/g, "");
      this.$copyText(message).then(
        (e) => {
          this.$toast.success(tips, {
            position: "bottom-right",
            timeout: 800,
          });
        },
        (e) => {
          this.$toast.error("复制失败，请稍后重试");
        }
      );
    };
    Vue.prototype.ThousandSeparator = function (value) {
      if (!value) return "";
      return (
        value &&
        value
          .toString()
          .replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","))
      );
    };
    Vue.prototype.isBooler = function (time) {
      return time < 0 ? true : false;
    };
  },
};
export default plugin;
