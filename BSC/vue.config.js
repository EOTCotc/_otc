const {
  defineConfig
} = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  css: {
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          modifyVars: {
            // 直接覆盖变量
            // 'nav-bar-background-color': '#1B2945',
            'count-down-text-color':"rgb(177,177,177)",
            hack: `true; @import "./src/style/vantLess-Cove.less"`,
            // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
          },
        },
      },
    },
  },
})