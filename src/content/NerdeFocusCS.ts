import { ContentScriptState } from "../panel/store/store";

class NerdeFocusCS {
  private activeElement: Element | null;
  private animateIndicator: boolean;
  private captureFocus: boolean;
  private indicatorColor: string;
  private inFrame: boolean;
  private listeningFocus: boolean;
  private showIndicator: boolean;
  private readonly boundUpdateFocus: () => void;

  constructor() {
    this.animateIndicator = true;
    this.showIndicator = false;
    this.indicatorColor = "#f00";
    this.captureFocus = false;
    this.activeElement = null;
    this.inFrame = false;
    this.listeningFocus = false;
    this.boundUpdateFocus = this.updateFocus.bind(this);
  }

  /**
   * Calculates a simple CSS path for a given element in DOM
   * Based on https://github.com/yamadapc/jquery-getpath
   * Based on https://github.com/dequelabs/axe-core/blob/develop/lib/core/utils/get-selector.js
   */
  getPath(node: HTMLElement | null): string {
    const commonNames = [
      "selected",
      "active",
      "focus",
      "hover",
      "enable",
      "hidden",
      "visible",
      "valid",
      "disable",
      "col-",
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

      // Check to if we can use a unique id for selector
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

    return path.reverse().join(">");
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
        (nodeStyle.overflow === "hidden" ||
          nodeStyle.overflowX === "hidden" ||
          nodeStyle.overflowY === "hidden" ||
          nodeStyle.clip === "rect(0px, 0px, 0px, 0px)")
      ) {
        return true;
      }
      currentNode = nodeParent;
    }
    return false;
  }

  updateFocus(): void {
    if (!this.captureFocus) {
      //return;
    }

    this.activeElement = document.activeElement;
    // chrome.runtime.sendMessage(
    //   {
    //     action: "updateFocus",
    //     itemPath: "",
    //     itemTag: "",
    //     isVisuallyHidden: "",
    //     isInFrame: "",
    //   },
    //   () => {
    //     return null;
    //   }
    // );
    this.updateIndicator();
  }

  getIndicator(): HTMLElement | null {
    return document.querySelector("#nerdeFocusIndicator");
  }

  getBoundingClientRect(element: Element | null): any {
    if (!element) {
      return {};
    }
    const rect = element.getBoundingClientRect();
    return {
      bottom: rect.bottom,
      height: rect.height,
      left: rect.left,
      right: rect.right,
      top: rect.top,
      width: rect.width,
      x: rect.x,
      y: rect.y,
    };
  }

  insertIndicator(): void {
    const indicatorTemplate = `<div id="nerdeFocusIndicator"></div>`;
    this.removeIndicator();
    const body: HTMLElement | null = document.querySelector("body");
    if (body) {
      body.insertAdjacentHTML("beforeend", indicatorTemplate);
    }
    this.updateIndicator();
  }

  updateIndicator(): void {
    if (!this.showIndicator || !this.activeElement) {
      return;
    }

    const elementBox: {
      height: number;
      width: number;
      x: number;
      y: number;
      bottom: number;
      left: number;
      right: number;
      top: number;
      outline: string;
      position: string;
    } = {
      ...this.getBoundingClientRect(this.activeElement),
      outline: "1px solid #f00",
      position: "fixed",
      zIndex: 9999,
    };

    elementBox.width = Math.max(elementBox.width, 8);
    elementBox.height = Math.max(elementBox.height, 8);

    const indicator = this.getIndicator();
    if (indicator) {
      indicator.style.width = `${elementBox.width}px`;
      indicator.style.height = `${elementBox.height}px`;
      indicator.style.left = `${elementBox.x}px`;
      indicator.style.top = `${elementBox.y}px`;
      indicator.style.outline = elementBox.outline;
      indicator.style.position = elementBox.position;
    }
  }

  removeIndicator(): void {
    const indicator = this.getIndicator();
    if (indicator) {
      indicator.remove();
    }
  }

  init(): void {
    chrome.runtime.onMessage.addListener(
      (indicatorState: ContentScriptState) => {
        console.log(indicatorState);
        this.showIndicator = indicatorState.visible;
        this.indicatorColor = indicatorState.color;
        this.animateIndicator = indicatorState.animate;
        this.captureFocus = indicatorState.recording;
        this.insertIndicator();
      }
    );
    document.addEventListener("focus", this.boundUpdateFocus, true);
  }
}
export default NerdeFocusCS;
