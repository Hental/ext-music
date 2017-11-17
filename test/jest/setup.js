const jsdom = require('jsdom');

if (typeof window !== 'undefined') {
  const templ = new jsdom.JSDOM();
  const documentHTML = '<!doctype html><html><body><div id="root"></div></body></html>';
  global.document = templ.serialize(documentHTML);
  global.window = document.parentWindow;

  global.window.resizeTo = (width, height) => {
    global.window.innerWidth = width || global.window.innerWidth;
    global.window.innerHeight = height || global.window.innerHeight;
    global.window.dispatchEvent(new Event('resize'));
  };
}

require('whatwg-fetch');
