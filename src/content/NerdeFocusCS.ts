import { ContentScriptState, PanelIntercom, FocusState } from '../panel';

interface indicatorStyle {
  height: number;
  width: number;
  left: number;
  top: number;
  outline: string;
  position: string;
  boxShadow: string;
  borderRadius: string;
  zIndex: string;
  outlineOffset: string;
  pointerEvents: string;
  transition: string;
}

class NerdeFocusCS {
  private activeElement: Element | null;
  private animateIndicator: boolean;
  private captureFocus: boolean;
  private indicatorColor: string;
  private inFrame: boolean;
  private listeningFocus: boolean;
  private showIndicator: boolean;
  private readonly borderWidth: number;
  private readonly borderOffset: number;
  private readonly indicatorStyle: indicatorStyle;
  private readonly boundUpdateFocus: () => void;
  private readonly boundUpdateIndicator: () => void;
  private readonly intersectionObserver: IntersectionObserver;
  private readonly resizeObserver: ResizeObserver;

  constructor() {
    this.animateIndicator =
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches || false;
    this.showIndicator = false;
    this.indicatorColor = '#FF0000';
    this.captureFocus = false;
    this.activeElement = null;
    this.inFrame = false;
    this.listeningFocus = false;
    this.borderWidth = 3;
    this.borderOffset = 2;
    this.indicatorStyle = {
      height: 0,
      width: 0,
      left: 0,
      top: 0,
      zIndex: '2147483647',
      pointerEvents: 'none',
      transition: 'all 0.2s ease-in-out',
      outline: `${this.borderWidth}px solid ${this.indicatorColor}`,
      position: 'fixed',
      boxShadow: `0 0 0 ${(this.borderOffset + this.borderOffset) * 2}px #fff`,
      borderRadius: `${this.borderOffset}px`,
      outlineOffset: `${this.borderOffset}px`,
    };
    this.boundUpdateFocus = this.updateFocus.bind(this);
    this.boundUpdateIndicator = this.updateIndicator.bind(this);
    this.intersectionObserver = new IntersectionObserver(
      this.boundUpdateIndicator,
      { root: this.getIndicator(), rootMargin: '0px', threshold: 1.0 }
    );
    this.resizeObserver = new ResizeObserver(this.boundUpdateIndicator);
  }

  /**
   * Calculates a simple CSS path for a given element in DOM
   * Based on https://github.com/yamadapc/jquery-getpath
   * Based on https://github.com/dequelabs/axe-core/blob/develop/lib/core/utils/get-selector.js
   */
  getPath(node: HTMLElement | null): string {
    const commonNames = [
      'selected',
      'active',
      'focus',
      'hover',
      'enable',
      'hidden',
      'visible',
      'valid',
      'disable',
      'col-',
    ];
    const path: Array<string> = [];
    let currentNode: Element | null = node;

    while (currentNode) {
      const nodeTag = currentNode.localName.toLowerCase() || null;
      const nodeParent: Element | null = currentNode.parentElement;

      if (!nodeTag || !nodeParent) {
        break;
      }

      let nodeName = nodeTag;

      // Check if we can use a unique id for selector
      if (
        currentNode.id &&
        /^[A-Za-z][\da-zA-Z_:.-]/.test(currentNode.id) &&
        document.querySelectorAll(`#${currentNode.id}`).length === 1
      ) {
        nodeName = `#${currentNode.id}`;
      }

      // Check if we can use a unique class name for selector
      Array.from(currentNode.classList).every((className) => {
        if (
          /^[\da-zA-Z_-]/.test(className) &&
          !commonNames.includes(className) &&
          document.querySelectorAll(`.${className}`).length === 1
        ) {
          nodeName = `${nodeName}.${className}`;
          return false;
        }
        return true;
      });

      // If we have a unique result, return it
      if (nodeName !== nodeTag) {
        path.push(nodeName);
        break;
      }

      // Try using a nth child selector if no unique matches are found
      const siblingNodes = Array.from(
        nodeParent.querySelectorAll(nodeTag).values()
      );

      if (siblingNodes.length > 1) {
        const nodeIndex = siblingNodes.indexOf(currentNode);
        if (nodeIndex > 1) {
          nodeName = `${nodeName}:nth-child(${nodeIndex + 1})`;
        }
      }

      path.push(nodeName);
      currentNode = nodeParent;
    }

    return path.reverse().join('>');
  }

  isVisuallyHidden(node: HTMLElement | null): boolean {
    let currentNode: HTMLElement | null = node;

    while (currentNode) {
      const nodeParent: HTMLElement | null = currentNode.parentElement;
      if (!nodeParent) {
        break;
      }

      const nodeStyle = window.getComputedStyle(currentNode);

      if (
        (currentNode.offsetHeight <= 8 || currentNode.offsetWidth <= 8) &&
        (nodeStyle.overflow === 'hidden' ||
          nodeStyle.overflowX === 'hidden' ||
          nodeStyle.overflowY === 'hidden' ||
          nodeStyle.clipPath === 'rect(0px, 0px, 0px, 0px)')
      ) {
        return true;
      }
      currentNode = nodeParent;
    }
    return false;
  }

  updateFocus(): void {
    if (!this.showIndicator && !this.captureFocus) {
      return;
    }

    this.activeElement = document.activeElement;

    if (this.captureFocus) {
      chrome.runtime.sendMessage(
        {
          action: 'updateFocus',
          itemPath: '',
          itemTag: '',
          isVisuallyHidden: '',
          isInFrame: '',
        },
        () => {
          return null;
        }
      );
    }

    if (this.showIndicator) {
      this.updateIndicator();
      this.resizeObserver.disconnect();
      this.resizeObserver.observe(this.activeElement as HTMLElement);
      this.intersectionObserver.disconnect();
      this.intersectionObserver.observe(this.activeElement as HTMLElement);
    }
  }

  getIndicator(): HTMLElement | null {
    return document.querySelector('#nerdeFocusIndicator');
  }

  getBoundingRect(): indicatorStyle {
    if (!this.activeElement) {
      return this.indicatorStyle;
    }

    const rect = this.activeElement.getBoundingClientRect();
    return Object.assign(this.indicatorStyle, {
      height: rect.height,
      left: rect.left,
      top: rect.top,
      width: rect.width,
    });
  }

  insertIndicator(): void {
    const indicatorTemplate = `<div id="nerdeFocusIndicator"></div>`;
    this.removeIndicator();
    const body: HTMLElement | null = document.querySelector('body');
    if (body) {
      body.insertAdjacentHTML('beforeend', indicatorTemplate);
    }
    this.updateIndicator();
  }

  updateIndicator(): void {
    if (!this.showIndicator || !this.activeElement) {
      return;
    }

    const elementBox = this.getBoundingRect();
    const { clientWidth, clientHeight } = window.document.documentElement;
    const borderOffset = this.borderWidth + this.borderOffset;

    elementBox.width = Math.max(elementBox.width, this.borderWidth * 3);
    elementBox.width = Math.min(
      elementBox.width,
      clientWidth - borderOffset * 2
    );

    elementBox.height = Math.max(elementBox.height, this.borderWidth * 3);
    elementBox.height = Math.min(
      elementBox.height,
      clientHeight - borderOffset * 2
    );

    elementBox.left = Math.max(elementBox.left, borderOffset);
    elementBox.top = Math.max(elementBox.top, borderOffset);

    const indicator = this.getIndicator();
    if (!indicator) {
      return;
    }

    Object.assign(
      indicator.style,
      Object.fromEntries(
        Object.entries(elementBox).map(([key, value]) => [
          key,
          typeof value === 'number' ? `${value}px` : value,
        ])
      )
    );
  }

  removeIndicator(): void {
    const indicator = this.getIndicator();
    if (indicator) {
      indicator.remove();
    }
  }

  setState(state: ContentScriptState): void {
    this.indicatorColor = state.color;
    this.animateIndicator = state.animate;
    this.captureFocus = state.recording;
    if (!this.showIndicator && state.visible) {
      this.showIndicator = state.visible;
      this.updateFocus();
      this.insertIndicator();
    } else if (this.showIndicator && !state.visible) {
      this.showIndicator = state.visible;
      this.removeIndicator();
    }
  }

  getState(): ContentScriptState {
    return {
      color: this.indicatorColor,
      visible: this.showIndicator,
      animate: this.animateIndicator,
      recording: this.captureFocus,
    };
  }

  init(): void {
    chrome?.runtime?.onMessage.addListener(
      (request: PanelIntercom, sender, sendResponse) => {
        switch (request.command) {
          case 'getState':
            sendResponse(this.getState());
            break;
          case 'setState':
            this.setState(request.payload);
            break;
          default:
            break;
        }
      }
    );

    window.addEventListener('focusin', this.boundUpdateFocus, true);
    window.addEventListener('focusout', this.boundUpdateFocus, true);
    window.addEventListener('scroll', this.boundUpdateIndicator, true);
    window.addEventListener('resize', this.boundUpdateIndicator, true);
  }
}
export default NerdeFocusCS;
