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

  getPath(node: Element) {
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
    let path = "";
    let currentNode: Element | null = node;

    while (currentNode) {
      const nodeTag = currentNode.localName.toLowerCase() || null;
      const nodeParent: Element | null = currentNode.parentElement;

      if (!nodeTag || !nodeParent) {
        break;
      }

      // Check to if we can use a unique id for selector
      if (
        currentNode.id &&
        /^[A-Za-z][\da-zA-Z_:.-]/.test(currentNode.id) &&
        document.querySelectorAll(`[id=${currentNode.id}]`).length === 1
      ) {
        path = `#${currentNode.id}${path ? ">" + path : ""}`;
        break;
      }

      // Check to if we can use a unique class name for selector
      Array.from(currentNode.classList).every((className) => {
        if (
          /^[\da-zA-Z_-]/.test(className) &&
          !commonNames.includes(className) &&
          document.querySelectorAll(`.${className}`).length === 1
        ) {
          path = `.${className}${path ? ">" + path : ""}`;
          return false;
        }
        return true;
      });

      // Try using a nth child selector
      const siblingNodes = Array.from(
        nodeParent.querySelectorAll(nodeTag).values()
      );

      if (siblingNodes.length > 1) {
        const nodeIndex = siblingNodes.indexOf(currentNode);
        if (nodeIndex > 1) {

        }
      }
      // var parent = node.parent();
      // var sameTagSiblings = parent.children(name);
      // if (sameTagSiblings.length > 1) {
      //   allSiblings = parent.children();
      //   var index = allSiblings.index(realNode) + 1;
      //   if (index > 1) {
      //     name += ':nth-child(' + index + ')';
      //   }
      // }
      // path = name + (path ? '>' + path : '');

      currentNode = nodeParent;
    }

    return path;
  }
}

export default NerdeFocusCS;
