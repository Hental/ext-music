
(function main(factory) {
  console.log('this is client');
  factory();
}(function factory() {  // eslint-disable-line
  const option = {

  };
  const refs = {
    pause: document.querySelector('#g_player a[data-action="play"]'),
    play: document.querySelector('#g_player a[data-action="play"]'),
    next: document.querySelector('#g_player a[data-action="next"]'),
  };

  function addListener(target, listener) {
    if (target.hasListener(listener)) return;
    target.addListener(listener);
  }

  function listenMsg(msg) {
    console.log('receive action:', msg);
    const el = refs[msg.action];
    if (el) el.click();
  }

  function listenConnect(port) {
    console.log('connect extension');
    addListener(port.onMessage, listenMsg);
  }

  addListener(browser.runtime.onConnect, listenConnect);
  addListener(browser.runtime.onMessage, listenMsg);
}));
