const {
  defineConfig
} = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'count-down-text-color':"rgb(177,177,177)",
            hack: `true; @import "./src/style/vantLess-Cove.less"`,
          },
        },
      },
    },
  },
})