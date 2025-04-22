import './index.less';
import './components/toolbar';

export interface ContentScriptState {
  color: string;
  visible: boolean;
  animate: boolean;
  recording: boolean;
}

export interface FocusState {
  itemPath: string;
  itemTag: string;
  itemFrame: number;
  isVisuallyHidden: boolean;
  isInFrame: boolean;
}

export interface FrameInfo {
  frameId: number;
}

export interface PanelIntercom {
  command:
    | 'getState'
    | 'setState'
    | 'updateFocus'
    | 'inspectElement'
    | 'registerFrame';
  payload?: ContentScriptState | FocusState;
}

class NerdeFocusPanel {
  private readonly state: ContentScriptState;
  private readonly wrapper: HTMLElement | null;
  private readonly recordToggle: HTMLInputElement | null;
  private readonly clearButton: HTMLButtonElement | null;
  private readonly indicatorToggle: HTMLInputElement | null;
  private readonly animationToggle: HTMLInputElement | null;
  private readonly indicatorColorPicker: HTMLInputElement | null;
  private readonly aboutButton: HTMLButtonElement | null;
  private readonly theme: 'dark' | 'light';
  private readonly reducedMotion: boolean;

  constructor() {
    this.wrapper = document.getElementById('wrapper');
    this.reducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches || false;
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
      animate: !this.reducedMotion,
      recording: true,
    };
  }

  startListener(): void {
    chrome?.runtime?.onMessage.addListener(
      (request: PanelIntercom, sender, sendResponse) => {
        switch (request.command) {
          case 'updateFocus':
            console.log(request.payload);
            break;
          default:
            break;
        }
      }
    );
  }

  sendState(): void {
    chrome?.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      chrome?.tabs?.sendMessage(<number>tabs[0].id, {
        command: 'setState',
        payload: this.state,
      } as PanelIntercom);
    });
  }

  handleIndicatorToggle(): void {
    if (!this.indicatorToggle) {
      return;
    }
    this.state.visible = this.indicatorToggle.checked;
    this.updateUI();
  }

  handleAnimationToggle(): void {
    if (!this.animationToggle) {
      return;
    }
    this.state.animate = this.animationToggle.checked;
    this.updateUI();
  }

  handleIndicatorColorPicker(): void {
    if (!this.indicatorColorPicker) {
      return;
    }
    this.state.color = this.indicatorColorPicker.value;
    this.sendState();
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

    if (this.state.visible) {
      this.indicatorColorPicker.removeAttribute('disabled');
      this.animationToggle.removeAttribute('disabled');
    } else {
      this.indicatorColorPicker.setAttribute('disabled', 'disabled');
      this.animationToggle.setAttribute('disabled', 'disabled');
    }

    this.sendState();
  }

  init(): void {
    if (
      !this.wrapper ||
      !this.indicatorToggle ||
      !this.animationToggle ||
      !this.indicatorColorPicker ||
      !this.aboutButton
    ) {
      return;
    }
    this.wrapper.className = this.theme;
    this.indicatorToggle.addEventListener('change', () =>
      this.handleIndicatorToggle()
    );
    this.animationToggle.addEventListener('change', () =>
      this.handleAnimationToggle()
    );
    this.indicatorColorPicker.addEventListener('input', () =>
      this.handleIndicatorColorPicker()
    );
    this.startListener();
    this.updateUI();
  }
}

const nerdeFocusPanel = new NerdeFocusPanel();
nerdeFocusPanel.init();
