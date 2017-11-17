const { resolve } = require('./utils');

module.exports = {
  appEntry: {
    'app': resolve('src/index.js'),
  },
  appHtml: resolve('test/page/index.html'),
}
