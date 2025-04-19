import './index.less';
import './components/toolbar';
import NerdeFocusCS from '../content/NerdeFocusCS';

export interface ContentScriptState {
  color: string;
  visible: boolean;
  animate: boolean;
  recording: boolean;
}

export interface FocusState {
  itemPath: string;
  itemTag: string;
  isVisuallyHidden: boolean;
  isInFrame: boolean;
}

export interface PanelIntercom {
  command: 'getState' | 'setState' | 'updateFocus';
  payload: ContentScriptState;
}

class NerdeFocusPanel {
  private state: ContentScriptState;
  private readonly wrapper: HTMLElement | null;
  private readonly recordToggle: HTMLInputElement | null;
  private readonly clearButton: HTMLButtonElement | null;
  private readonly indicatorToggle: HTMLInputElement | null;
  private readonly animationToggle: HTMLInputElement | null;
  private readonly indicatorColorPicker: HTMLInputElement | null;
  private readonly aboutButton: HTMLButtonElement | null;
  private readonly theme: 'dark' | 'light';

  constructor() {
    this.wrapper = document.getElementById('wrapper');
    this.recordToggle = document.getElementById(
      'recordToggle'
    ) as HTMLInputElement;
    this.clearButton = document.getElementById(
      'clearButton'
    ) as HTMLButtonElement;
    this.indicatorToggle = document.getElementById(
      'indicatorToggle'
    ) as HTMLInputElement;
    this.animationToggle = document.getElementById(
      'animationToggle'
    ) as HTMLInputElement;
    this.indicatorColorPicker = document.getElementById(
      'indicatorColorPicker'
    ) as HTMLInputElement;
    this.aboutButton = document.getElementById(
      'aboutButton'
    ) as HTMLButtonElement;
    this.theme =
      chrome?.devtools?.panels?.themeName === 'dark' ? 'dark' : 'light';
    this.state = {
      color: '#FF0000',
      visible: false,
      animate: false,
      recording: false,
    };
    this.init();
  }

  startListener(): void {
    chrome?.runtime?.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.command) {
        case 'toggleIndicator':
          sendResponse({ farewell: 'goodbye' });
          break;
        default:
          break;
      }
    });
  }

  setStateFromPage(): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs
        .sendMessage(<number>tabs[0].id, {
          command: 'getState',
        } as PanelIntercom)
        .then((response) => {
          this.state = response;
          this.updateUI();
        });
    });
  }

  updateUI(): void {
    if (
      !this.recordToggle ||
      !this.indicatorToggle ||
      !this.animationToggle ||
      !this.indicatorColorPicker
    ) {
      return;
    }
    this.recordToggle.checked = this.state.recording;
    this.indicatorToggle.checked = this.state.visible;
    this.animationToggle.checked = this.state.animate;
    this.indicatorColorPicker.value = this.state.color;

    this.indicatorColorPicker.disabled = !this.state.visible;
    this.animationToggle.disabled = !this.state.visible;
  }

  init(): void {
    if (!this.wrapper) {
      return;
    }

    this.wrapper.className = this.theme;
    this.startListener();
    this.setStateFromPage();
  }
}

const nerdeFocusPanel = new NerdeFocusPanel();
nerdeFocusPanel.init();
