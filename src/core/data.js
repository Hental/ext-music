const siteConfigs = {
  'music.163': {
    url: 'http://music.163.com',
    urlPattern: '*://music.163.com/*',
    tabOption: {},
    actionSelectors: {
      'play/pause': '#g_player .btns a:nth-of-type(2)',
      prev: '#g_player .btns a[data-action="prev"]',
      next: '#g_player .btns a[data-action="next"]',
    },
    initState(state, doc) {
      state.isPaste = !!doc.querySelector('#g_player a[data-action="pause"]');
    },
  },
};
