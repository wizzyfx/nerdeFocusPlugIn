import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('nf-history')
export class History extends LitElement {
    render() {
        return html`
          <ol id="history">
            <li>
              <span class="tag">DIV</span>
              <span class="info reset" title="Focus was reset and returned to BODY"></span>
              <span class="info hidden" title="May be visually hidden or out of viewport"></span>
              <span class="info frame" title="Currently focused item is inside a frame"></span>
              fff
            </li>
            <li class="url">Page Loaded rrr</li>
          </ol>
        `;
    }
}