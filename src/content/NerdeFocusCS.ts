import { DOMElement } from "react";

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
    while (node.parentNode) {

    }
    return path;
  }
}

export default NerdeFocusCS;
