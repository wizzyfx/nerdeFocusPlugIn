import './index.less';
import './components/toolbar';

export interface ContentScriptState {
  color: string;
  visible: boolean;
  animate: boolean;
  recording: boolean;
}

/**
 * Initializes and starts a listener for incoming messages from a Chrome extension runtime.
 */
const startListener = () => {
  chrome?.runtime?.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.command) {
      case 'toggleIndicator':
        sendResponse({ farewell: 'goodbye' });
        break;
      default:
        break;
    }
  });
};

/**
 * Updates the theme of the application by changing the class name of the
 * element with the ID 'wrapper'
 */
const setTheme = () => {
  const wrapper = document.getElementById('wrapper');
  if (wrapper) {
    wrapper.className =
      chrome?.devtools?.panels?.themeName === 'dark' ? 'dark' : 'light';
  }
};

const init = () => {
  setTheme();
  startListener();
};

init();
