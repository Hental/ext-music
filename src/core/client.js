
(function main(factory) {
  console.log('this is music player client');
  factory();
}(function factory() {  // eslint-disable-line
  const refs = {};
  const state = {
    isPause: false,
  };

  function addListener(target, listener) {
    if (target.hasListener(listener)) return;
    target.addListener(listener);
  }

  function setConfig(conf) {
    Object.keys(conf.actionSelectors).forEach((key) => {
      refs[key] = document.querySelector(conf.actionSelectors[key]);
    });
    state.isPause = conf.checkIsPaste(document);
  }

  function doAction(actionName) {
    if (actionName === 'play/pause') {
      state.isPause = !state.isPause;
      refs['play/pause'].click();
    } else {
      const el = refs[actionName];
      if (el) el.click();
    }
  }

  function listenMsg(msg) {
    console.log('receive message:', msg);
    const type = msg.type;
    const val = msg.value;

    if (type === 'action') {
      doAction(val);
    } else if (type === 'config') {
      setConfig(val);
    }
  }

  function listenConnect(port) {
    console.log('client connect.');
    addListener(port.onMessage, listenMsg);
  }

  addListener(browser.runtime.onConnect, listenConnect);
  addListener(browser.runtime.onMessage, listenMsg);
}));
