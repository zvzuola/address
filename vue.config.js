module.exports = {
  chainWebpack: (config) => {
    // config.publicPath = '/xcly/';

    const svgRule = config.module.rule('svg');
    // 清除已有的所有 loader。
    // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    svgRule.uses.clear();
    // 添加要替换的 loader
    svgRule
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      });
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        data: '@import "@/assets/variables.scss";'
      }
    }
  },
  publicPath: '/',
  productionSourceMap: false
};
