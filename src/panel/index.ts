import './index.less';

const appTheme = chrome.devtools.panels.themeName === 'dark' ? 'dark' : 'light';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.command) {
    case 'toggleIndicator':
      sendResponse({ farewell: 'goodbye' });
      break;
    default:
      break;
  }
});
