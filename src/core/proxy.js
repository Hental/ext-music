(function main(factory) {
  factory(siteConfigs);
}(function factory(siteConfigs) { // eslint-disable-line
  'use strict'; // eslint-disable-line

  const state = {
    tab: null,
    get tabId() {
      return this.tab.id;
    },

    isExecuteScript: false,
    isSendClientConfig: false,
  };

  const option = {
    site: 'music.163',
  };

  const siteConfig = siteConfigs[option.site];

  const error = info => (err) => {
    console.error(info, err);
  };

  const sendMessage = type => value => (
    browser.tabs.sendMessage(state.tabId, {
      type,
      value,
    })
  );

  const sendAction = sendMessage('action');
  const sendOption = sendMessage('option');

  function resetTabState() {
    state.tab = null;
    state.isExecuteScript = false;
    state.isSendClientConfig = false;
  }

  function createNewTab(url, tabOpt = {}) {
    resetTabState();
    return browser.tabs.create(Object.assign({}, {
      url,
      index: 0,
      active: false,
    }, tabOpt)).then((tab) => {
      state.tab = tab;
      return tab;
    });
  }

  function findAllTabs(url) {
    return browser.tabs.query({ url });
  }

  function findTab(url) {
    return findAllTabs(url).then(tabs => tabs[0]);
  }

  function executeScript() {
    state.isExecuteScript = true;
    return browser.tabs.executeScript(state.tabId, {
      file: '/core/data.js',
      runAt: 'document_start',
    }).then(() => (
      browser.tabs.executeScript(state.tabId, {
        file: '/core/client.js',
        runAt: 'document_end',
      })
    ));
  }

  function sendClientConfig() {
    state.isSendClientConfig = true;
    return sendOption(option);
  }

  function initNewTab() {
    return createNewTab(siteConfig.url, siteConfig.tabOption)
      .then(() => executeScript())
      .then(() => sendClientConfig())
      .catch(error('[init new tab error]:'));
  }

  const runIfNot = (name, fn) => () => (
    new Promise((res, rej) => {
      if (!state[name]) {
        fn().then(res).catch(rej);
      } else {
        res(state[name]);
      }
    })
  );

  function checkTabIsExist() {
    return new Promise((res, rej) => {
      if (!state.tab) {
        res(false);
      } else {
        findAllTabs(siteConfig.urlPattern)
          .then(tabs => tabs.filter(tab => tab.id === state.tabId))
          .then(tabs => res(tabs.length > 0))
          .catch(rej);
      }
    });
  }

  function getTab() {
    return findTab(siteConfig.urlPattern)
      .then(tab => tab || createNewTab(siteConfig.url, siteConfig.tabOption));
  }

  function checkTab() {
    return checkTabIsExist().then((exist) => {
      if (!exist) {
        return getTab().then((tab) => {
          state.tab = tab;
          return tab;
        });
      }
      return state.tab;
    });
  }

  function initEvents() {
    const tabRemoveListener = (tabId) => {
      if (state.tabId === tabId) {
        state.tab = null;
      }
    };

    browser.tabs.onRemoved.addListener(tabRemoveListener);
  }

  function check() {
    return checkTab()
      .then(runIfNot('isExecuteScript', executeScript))
      .then(runIfNot('isSendClientConfig', sendClientConfig))
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
  initEvents();
}));
