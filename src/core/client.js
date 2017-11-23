
(function main(factory) {
  console.log('this is music player client');
  factory(siteConfigs);
}(function factory(siteConfigs = {}) {  // eslint-disable-line
  const refs = {};
  const state = {
    isPause: false,
    get isPlay() {
      return !this.isPause;
    },
    set isPlay(v) {
      this.isPause = !v;
    },
  };

  function addListener(target, listener) {
    if (target.hasListener(listener)) return;
    target.addListener(listener);
  }

  function setOption({ site }) {
    const conf = siteConfigs[site];
    Object.keys(conf.actionSelectors).forEach((key) => {
      refs[key] = document.querySelector(conf.actionSelectors[key]);
    });
    if (conf.initState) conf.initState(state, document);
  }

  function doAction(actionName) {
    if (actionName === 'play/pause') {
      state.isPause = !state.isPause;
    }

    const el = refs[actionName];
    if (el) el.click();
  }

  function listenMsg(msg) {
    console.log('receive message:', msg);
    const type = msg.type;
    const val = msg.value;

    if (type === 'action') {
      doAction(val);
    } else if (type === 'option') {
      setOption(val);
    }
  }

  function listenConnect(port) {
    console.log('client connect.', port);
    addListener(port.onMessage, listenMsg);
  }

  addListener(browser.runtime.onConnect, listenConnect);
  addListener(browser.runtime.onMessage, listenMsg);
}));
