import { PanelIntercom, FrameInfo } from '../panel';

chrome?.runtime?.onMessage.addListener(
  (request: PanelIntercom, sender, sendResponse) => {
    switch (request.command) {
      case 'registerFrame':
        sendResponse({ frameId: sender.frameId } as FrameInfo);
        break;
      default:
        break;
    }
  }
);
