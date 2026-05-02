import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("countdown-timestamp")
export class CountdownTimestamp extends LitElement {
  @property()
  current: number = 0;
  @property()
  target: number = 0;

  render() {
    const diff = this.current - this.target;

    return html`
      <div class="row highlight">${this.target}</div>
      <div class="row diff">${(diff <= 0 ? "" : "+") + diff}</div>
      <div class="row current">${this.current}</div>
    `;
  }

  static styles = css`
    .row {
      font-variant-numeric: tabular-nums;
    }

    .current,
    .diff {
      opacity: 0.5;
    }

    .highlight {
      color: var(--highlight-color);
    }

    :host {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
  `;
}
