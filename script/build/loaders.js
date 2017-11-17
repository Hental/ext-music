const ExtractPlugin = require('extract-text-webpack-plugin');
const utils = require('./utils');
const baseWebpackCfg = require('./webpack.config');

const ENV = process.env.NODE_ENV;
const isDevelopment = ENV === 'development';
const isProduction = ENV === 'production';

const config = require('../../config')[ENV];
const { resolve } = utils;

/**
 * loader: 用于处理不同后缀名的文件
 */

const babelLoaderOptions = () =>  {
  return {
    cacheDirectory: true,
  };
}

const styleLoaders = (opt = {}, pre = false, preLoaderOpt = {}) => {
  const { extract = false, module:cssModule = false } = opt;
  const cssModuleOpt = {
    modules: !!pre,  // true 则 css 类名会按照下面进行修改
    camelCase : true,
    localIdentName : isDevelopment  // [local]: 原始名字  [path]: 路径  [name]: 文件名  [hash]: hash值
      ? '[local]__[path][name]___[hash:base64:5]'
      : '[local][hash:base64:5]',
  };
  let cssLoader = {
		loader: 'css-loader',
		options: Object.assign({}, {
      import: true,
      url: true,  // url('./img') => require('./img') 打包过程中直接加载图片
      importLoaders: pre ? 2 : 1,  // 加载 css-loader 之前的 loader 数量
      // minimize: isProduction,
		}, cssModule ? cssModuleOpt : {}),
  };
  let postcssLoader = {
    loader: 'postcss-loader',
    options: {
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        require('autoprefixer')({
          browsers: [
            '>1%',
            'last 5 versions',
            'Firefox ESR',
            'ie 9',
          ],
          flexbox: 'no-2009',
        }),
      ],
    }
  }

  let styleLoaders = ['style-loader', cssLoader, postcssLoader];
  if (pre) styleLoaders.push({
    loader: pre + '-loader',
    options: preLoaderOpt
  });

  if (extract) {
    styleLoaders = ExtractPlugin.extract({
      use: styleLoaders.slice(1, styleLoaders.length),
    });
  }

	return styleLoaders;
}

// 处理图片和字体
const urlLoaderOptions = (type) => {
	return {
		limit: isDevelopment ? 1 : 10000, // 限制,超过则修改路径为 /[publicPath]/[name], 文件移动到 [webpackConfig.output.output]/[name]
		publicPath: config.publicPath,
		name: type + (isDevelopment ? '/[path][name].[ext]' : '/[name].[hash:8].[ext]')
	}
}

module.exports = [
  {
    test: /\.(js|jsx)$/,
    loader: 'eslint-loader',
    enforce: "pre",
    include: [resolve('src')],
    options: {
      fix: false,
      formatter: require('eslint-friendly-formatter')
    }
  },
  {
    test: /\.(js|jsx)$/,
    include: [resolve('src'), resolve('test')],
    loader: 'babel-loader',
    options: babelLoaderOptions(),
  },
  {
    test: /\.css$/,
    use: styleLoaders(config.style),
  },
  {
    test: /\.scss$/,
    use: styleLoaders(config.style, 'sass'),
  },
  {
    test: /\.(jpe?g|png|gif|bmp)$/,
    loader: 'url-loader',
    options: urlLoaderOptions('images'),
  },
  {
    test: /\.(woff|ttf|otf|eot|svg|woff2)$/,
    loader: 'url-loader',
    options: urlLoaderOptions('fonts'),
  },
]
