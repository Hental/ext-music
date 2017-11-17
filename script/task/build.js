process.env.NODE_ENV = 'production';

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const config = require('../../config').production;
let webpackCfg = require('../build/webpack.config');

const outDirectoryPath = path.resolve(__dirname, '..', 'dist');

function cleanDirectory(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(fileName => {
      const p = path + '/' + fileName;
      if (fs.lstatSync(p).isDirectory()) {
        cleanDirectory(p);
      } else {
        fs.unlinkSync(p);
      }
    });
    fs.readdirSync(path);
  }
}

function end() {
}

function min() {
  let filename = webpackCfg.output.filename;
  let index = filename.lastIndexOf('.');
  let newFilename = filename.substr(0, index);
  newFilename += '.min';
  newFilename += filename.substr(index, filename.length);

  webpackCfg.output.filename = newFilename;
  webpackCfg.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        comparisons: false,
      },
      output: {
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        ascii_only: true,
      }
    })
  );
  webpack(webpackCfg, end);
}

function afterPack() {
  if (config.uglifyJs) min();
}

cleanDirectory(outDirectoryPath);
webpack(webpackCfg, afterPack);
