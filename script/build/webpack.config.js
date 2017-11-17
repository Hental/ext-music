const path = require('path');
const webpack = require('webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const loaders = require('./loaders');
const utils = require('./utils');
const paths = require('./paths');
const configs = require('../../config');

const { resolve } = utils;

const ENV = process.env.NODE_ENV;
const config = configs[ENV] || {};
const isDevelopment = ENV === 'development';
const isProduction = ENV === 'production';

const entry = paths.appEntry;
const alignMap = {
};
const plugins = [];

if (isDevelopment) {
  Object.keys(entry).forEach((key) => {
    const v = entry[key];
    entry[key] = [
        'webpack-dev-server/client?http://127.0.0.1:3000',
        'webpack/hot/only-dev-server',
        v,
    ];
  })
}

plugins.push(new webpack.NoEmitOnErrorsPlugin());
plugins.push(new FriendlyErrorsPlugin());
plugins.push(new webpack.DefinePlugin({ 'process.env.NODE_ENV': `"${ENV}"` }));
plugins.push(new StyleLintPlugin({
  syntax: 'scss',
  failOnError: false,
  files: ['src/**/*.scss', 'src/**/*.css'],
}));
if (isDevelopment) {
  plugins.push(new CaseSensitivePathsPlugin());
  // TODO html-plugin
  // plugins.push(new HtmlPlugin({
  //   inject: true,
  //   template: paths.appHtml,
  // }));
  if (config.hot) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new webpack.NamedModulesPlugin());
  }
}
if (isProduction) {
  plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
  plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
  // plugins.push(new ManifestPlugin({ fileName: 'asset-manifest.json' }))
  if (config.style.extract) {
    plugins.push(new ExtractTextPlugin({
      filename: config.style.cssFileName || 'style.css',
    }))
  }
  if (config.analyz) {
    plugins.push(new BundleAnalyzerPlugin());
  }
}

module.exports = {
  entry,
  context: path.join(__dirname, ".."),
  devtool: isDevelopment ? 'cheap-module-source-map' : false,
  externals: isProduction ? config.externals : {},
  output: {
    path: resolve('dist'),
    publicPath: config.publicPath || '/static/',
    filename: `[name].js`
  },
  resolve: {
    extensions: ['.js', '.json', '.css', '.scss'],
    alias: alignMap
  },
  module: {
    strictExportPresence: true,
    rules: loaders,
  },
  plugins,
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  performance: {
    hints: isDevelopment ? false : 'error',
  },
};
