const externals = {
  //
};

module.exports = {
  externals,
  publicPath: '/static/',
  uglifyJs: true,  // 是否压缩 js
  analyz: false,  // 是否分析打包和的文件
  style: {
    extract: true,
    module: false,
    cssFileName: '',
  },
}
