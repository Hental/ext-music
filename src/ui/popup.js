console.log('this is in popup');

(function main(factory) {
  // window.document.addEventListener('DOMContentLoaded', factory(window, document));
  window.onload = () => {
    factory();
  };
}(function factory() { // eslint-disable-line
  'use strict'; // eslint-disable-line

  const option = {
    name: '网易云音乐',
    url: 'https://music.163.com/',
    urlPattern: '*://music.163.com/*',
    tabOption: {

    },
  };

  const state = {
    tab: null,
    get tabId() {
      return this.tab.id;
    },
    msgPort: null,
    isPlay: true,
    get isPause() {
      return !this.isPlay;
    },
    set isPause(v) {
      this.isPlay = !v;
    },
  };

  const actions = [
    {
      name: '暂停',
      action: 'pause',
      className: 'pause',
    },
    {
      name: '继续',
      action: 'play',
      className: 'play',
    },
    {
      name: '下一首',
      action: 'next',
      className: 'next',
    },
    {
      name: '添加到播放列表',
      action: 'add-playlist',
      className: 'add-playlist',
    },
    {
      name: '喜欢',
      action: 'like',
      className: 'like',
    },
  ];

  const refActions = document.querySelector('#actions');

  const action = (opt) => {
    console.log(opt);
    // state.msgPort.postMessage(opt);
    browser.tabs.sendMessage(state.tabId, opt);
  };

  const renderAction = (data) => {
    const li = document.createElement('li');
    const text = document.createTextNode(data.name);
    const click = function click() {
      action(data);
    };

    li.appendChild(text);
    li.addEventListener('click', click);
    refActions.appendChild(li);
  };

  function createNewTab() {
    const opt = Object.assign({}, {
      url: option.url,
      index: 0,
      active: false,
    }, option.tabOption);

    return browser.tabs.create(opt);
  }

  function checkTabIsExist() {
    const error = new Error('multi tab');
    browser.tabs.query({
      url: option.urlPattern,
    })
      .then((tabs) => {
        if (tabs.length === 0) {
          return createNewTab();
        } else if (tabs.length === 1) {
          return tabs[0];
        }

        error.message = 'multi tab';
        error.tabs = tabs;
        throw error;
      })
      .then((tab) => {
        state.tab = tab;
        console.log(tab);
        return tab;
      })
      .then((tab) => {
        if (tab.$isExecuteScript) {
          return tab;
        }

        tab.$isExecuteScript = true;
        return browser.tabs.executeScript(tab.id, {
          file: '/core/client.js',
        }).then(() => tab);
      })
      // .then((tab) => {
      //   state.msgPort = browser.tabs.connect(state.tabId);
      //   return tab;
      // })
      .then(() => {
        actions.forEach(renderAction);
      })
      .catch((e) => {
        console.error('check tab error:', e);
      });
  }

  function initEvent() {
    document.addEventListener('click', (e) => {
      const className = e.target.className;
      for (let i = 0; i < actions.length; i += 1) {
        const act = actions[i];
        if (act.className === className) {
          action(act);
          break;
        }
      }
    });
  }

  function main() {
    checkTabIsExist();
    // initEvent();
  }

  main();
}));
