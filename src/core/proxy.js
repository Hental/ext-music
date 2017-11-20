(function main(factory) {
  factory(siteConfigs);
}(function factory(siteConfigs) { // eslint-disable-line
  'use strict'; // eslint-disable-line

  const option = {
    site: 'music.163',
  };

  const state = {
    tab: null,
    get tabId() {
      return this.tab.id;
    },

    isExecuteScript: false,
    isSendClientConfig: false,

    isPlay: true,
    get isPause() {
      return !this.isPlay;
    },
    set isPause(v) {
      this.isPlay = !v;
    },
  };

  const siteConfig = siteConfigs[option.site];

  const error = (info) => (err) => {
    console.error(info, err);
  };

  const sendMessage = type => value => {
    return browser.tabs.sendMessage(state.tabId, {
      type,
      value,
    });
  };

  const sendAction = sendMessage('action');

  function createNewTab(url, tabOpt) {
    return browser.tabs.create(Object.assign({}, {
      url,
      index: 0,
      active: false,
    }, tabOpt)).then((tab) => {
      state.tab = tab;
    });
  }

  function executeScript() {
    state.isExecuteScript = true;
    return browser.tabs.executeScript(state.tabId, {
      file: '/core/client.js',
    });
  }

  function connectTab(tabId) {
    state.isSendClientConfig = true;
    return browser.tabs.connect(tabId, {});
  }

  function sendClientConfig() {
    state.isSendClientConfig = true;
    return sendMessage('config')(siteConfig);
  }

  function resetClientState() {
    state.tab = null;
    state.isExecuteScript = false;
    state.isSendClientConfig = false;
  }

  function initNewTab() {
    resetClientState();
    return createNewTab(siteConfig.url, siteConfig.tabOption)
      .then((tab) => {
        state.tab = tab;
        return executeScript(tab.id);
      })
      .then(() => {
        state.isExecuteScript = true;
        sendClientConfig();
      })
      .then(() => {
        state.isSendClientConfig = true;
      })
      .catch(error('[init new tab error]:'));
  }

  function checkTabIsExist() {
    return new Promise((res, rej) => {
      if (!state.tab) {
        browser.tabs.query({ url: siteConfig.urlPattern }).then((tabs) => {
          if (tabs.length === 0) {
            resetClientState();
            createNewTab(siteConfig.url, siteConfig.tabOption).then(res);
          } else {
            state.tab = tabs[0];
            res(tabs[0]);
          }
        });
      } else {
        res(state.tab);
      }
    });
  }

  function checkExecuteScript() {
    return new Promise((res, rej) => {
      if (!state.isExecuteScript) {
        executeScript().then(res);
      }
      res();
    });
  }

  function checkClientConfig() {
    return new Promise((res, rej) => {
      if (!state.isSendClientConfig) {
        sendClientConfig().then(res);
      }
      res();
    });
  }

  function check() {
    return checkTabIsExist()
      .then(() => checkExecuteScript())
      .then(() => checkClientConfig())
      .catch(error('[check tab] error:'));
  }

  function runAction(actionName) {
    check()
      .then(() => sendAction(actionName));
  }

  function listenMessage() {
    window.addEventListener('message', (e) => {
      const data = e.data;
      if (data === '_init') {
        check();
      } else {
        runAction(data);
      }
    });
  }

  listenMessage();
}));
