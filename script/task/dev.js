process.env.NODE_ENV = 'development';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const Server = require('webpack-dev-server');
const opn = require('opn');
const webpackCfg = require('../build/webpack.config');
const config = require('../../config').development;
const htmlPath = config.htmlPath;

const rewrites = fs.readdirSync(utils.resolve(htmlPath)).map(filename => {
  if (/.html$/.test(filename)) {
    return {
      from: filename.substr(0, filename.lastIndexOf('.html')),
      to: `/${htmlPath}/${filename}`
    }
  }
}).filter(v => v !== undefined);

rewrites.push({
  from: '',
  to: '/test/page/index.html',
});

new Server(webpack(webpackCfg), {
  contentBase: path.join(__dirname, '../../'),
  publicPath: webpackCfg.output.publicPath,
  hot: config.hot,
  noInfo: true,
  quiet: true,
  clientLogLevel: 'warning',  // 'error' 'warning'  'info' 'none'
  historyApiFallback: {
	  rewrites,
  },
}).listen(config.port, function(err, result) {
  if (err) console.log(err);

  console.log(`
    app is start, you can visit
      http://127.0.0.1:${config.port}
      http://localhost:${config.port}
  `);
  opn(`http://127.0.0.1:${config.port}`, { app: config.browser || 'google chrome' })
});
