import './index.less';
import './components/toolbar';

export interface ContentScriptState {
  color: string;
  visible: boolean;
  animate: boolean;
  recording: boolean;
}

const appTheme =
  chrome?.devtools?.panels?.themeName === 'dark' ? 'dark' : 'light';

chrome?.runtime?.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.command) {
    case 'toggleIndicator':
      sendResponse({ farewell: 'goodbye' });
      break;
    default:
      break;
  }
});
