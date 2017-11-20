console.log('music player is loading!');

;(function main(factory) { // eslint-disable-line
  window.addEventListener('load', () => {
    factory();
  });
}(function factory() { // eslint-disable-line
  'use strict'; // eslint-disable-line

  const option = {
    name: '网易云音乐',
    url: 'http://music.163.com/',
    url: 'http://douban.fm/',
    control: {
      play: '.player-wrapper .buttons label[title="播放"] svg',
      pause: '.player-wrapper .buttons label[title="暂停"] svg',
    },
  };
  const state = {
    isPlay: true,
    get isPause() {
      return !this.isPlay;
    },
    set isPause(v) {
      this.isPlay = !v;
    },
  };
  const refIframe = document.querySelector('#app');
  let contentWindow;
  let contentDocument;

  function action(actionName) {
    const btn = contentWindow.document.querySelector(option.control[actionName]);
    switch (actionName) {
      case 'pasue':
        state.isPause = true;
        break;
      case 'play':
        state.isPlay = true;
        break;
      default:
        break;
    }
  }

  function loadend() {
    contentWindow = refIframe.contentWindow.window;
    contentDocument = contentWindow.document;
    console.log(contentWindow);
    console.log(contentWindow.document);
    console.log(contentWindow.document.querySelector(option.control.pause));
  }

  function init(data) {
    refIframe.setAttribute('src', data.url);
    refIframe.addEventListener('load', loadend);
  }

  init(option);
}));
