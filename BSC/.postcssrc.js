module.exports = {
  plugins: {
    // 'autoprefixer': {
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    'postcss-pxtorem': {
      rootValue: function(obj){
        return obj.file.indexOf('vant') !== -1 ? 37.5 :75
      },
      // 配置要转换的css 属性
      propList: ['*'],
      // 排除要转换的 css 文件
      exclude:"github-markdown"
    }
  }
}
