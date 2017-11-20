(function main(factory) {
  window.document.addEventListener('DOMContentLoaded', factory());
}(function factory() { // eslint-disable-line
  'use strict'; // eslint-disable-line

  const actions = [
    {
      name: '播放/暂停',
      action: 'play/pause',
      className: 'play_pause',
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
  let backgroundWindow;
  let urlPattern;

  const getBackgroundWindow = () => {
    browser.runtime.getBackgroundPage().then((v) => {
      backgroundWindow = v;
      urlPattern = v.location;
      backgroundWindow.postMessage('_init', urlPattern);
    });
  };

  const getActionListener = (msg) => () => { // eslint-disable-line
    backgroundWindow.postMessage(msg, urlPattern);
  };

  const renderAction = (data, ref) => {
    const li = document.createElement('li');
    const text = data.name;
    const textNode = document.createTextNode(text);

    li.appendChild(textNode);
    li.addEventListener('click', getActionListener(data.action));
    ref.appendChild(li);
  };

  getBackgroundWindow();
  actions.forEach(v => renderAction(v, refActions));
}));
