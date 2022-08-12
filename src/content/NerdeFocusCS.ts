class NerdeFocusCS {
  private activeElement: Element | null;
  private animateHighlight: boolean;
  private captureFocus: boolean;
  private highlightColor: number[];
  private inFrame: boolean;
  private listeningFocus: boolean;
  private showHighlight: boolean;

  constructor() {
    this.activeElement = null;
    this.animateHighlight = true;
    this.captureFocus = false;
    this.highlightColor = [255, 0, 0];
    this.inFrame = false;
    this.listeningFocus = false;
    this.showHighlight = false;
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

  updateHighlightIndicator(): void {
    if (!this.showHighlight || !this.activeElement) {
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
    } = {
      ...this.activeElement.getBoundingClientRect(),
    };

    elementBox.width = Math.max(elementBox.width, 8);
    elementBox.height = Math.max(elementBox.height, 8);

    const indicator: HTMLElement | null = document.querySelector(
      "#nerdeFocusIndicator"
    );

    if (indicator) {
      Object.assign(indicator.style, elementBox);
    }
  }

  updateFocus(): void {
    if (!this.captureFocus) {
      return;
    }

    this.activeElement = document.activeElement;
    chrome.runtime.sendMessage(
      {
        action: "updateFocus",
        itemPath: "",
        itemTag: "",
        isVisuallyHidden: "",
        isInFrame: "",
      },
      () => {
        return null;
      }
    );
  }
}
export default NerdeFocusCS;
