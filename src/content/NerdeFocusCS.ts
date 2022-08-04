class NerdeFocusCS {
  private captureFocus: boolean;
  private showHighlight: boolean;
  private animateHighlight: boolean;
  private highlightColor: number[];
  private listeningFocus: boolean;
  private activeElem: string;
  private inFrame: boolean;

  constructor() {
    this.captureFocus = false;
    this.showHighlight = false;
    this.animateHighlight = true;
    this.highlightColor = [255, 0, 0];
    this.listeningFocus = false;
    this.activeElem = "";
    this.inFrame = false;
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
}
export default NerdeFocusCS;
