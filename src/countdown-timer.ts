import { LitElement, css, html, type PropertyValueMap } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./countdown-timestamp.js";
import "./epoch-party-time.js";

/**
 * Party happens PARTY_LENGTH seconds after the timestamp.
 * After that, next party is advertised.
 *
 */

const PARTY_LENGTH = 3600;
const WAIT_FOR_NEXT_ANNOUNCEMENT = 600;

@customElement("countdown-timer")
export class CountdownTimer extends LitElement {
  @property({ type: Array }) timestamps = [];
  private intervalId: number | null = null;

  @state() private current = Date.now();

  connectedCallback() {
    super.connectedCallback();
    this.startTimer();
  }

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>,
  ): void {
    this.setMetaDescription();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.intervalId) clearInterval(this.intervalId);
  }

  startTimer() {
    this.updateCurrent();
    this.intervalId = window.setInterval(() => {
      this.updateCurrent();
    }, 50);
  }

  updateCurrent() {
    this.current = Math.floor(Date.now() / 1000);
  }

  private setMetaDescription(): void {
    const [previous, next] = findBounds(this.timestamps, this.current);

    const isParty = previous && this.current - previous <= PARTY_LENGTH;

    const timestamp = isParty ? previous : next;
    if (!timestamp) return;
    const content = `Celebrate UNIX timestamp ${timestamp}! 🎉`;

    let meta = document.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta["name"] = "description";
      document.head.appendChild(meta);
    }
    meta["content"] = content;
  }

  render() {
    const [previous, next] = findBounds(this.timestamps, this.current);

    const isParty = previous && this.current - previous <= PARTY_LENGTH;

    let countdown = html``;
    if (isParty) {
      const announceNext =
        next && this.current - previous > WAIT_FOR_NEXT_ANNOUNCEMENT;
      countdown = html`<epoch-party-time></epoch-party-time>
        ${next && announceNext
          ? html`<div class="next">
              Next party<br />
              ${next}
              <br />
              ${new Date(next * 1000).toLocaleString()}
            </div>`
          : null} `;
    } else if (!next) {
      return html`<div>No more parties. 😭</div>`;
    } else {
      const remaining = next - this.current;
      const days = Math.floor(remaining / (3600 * 24));
      const hours = Math.floor((remaining % (3600 * 24)) / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = Math.floor(remaining % 60);

      countdown = html`
        <div>in</div>
        <div title=${new Date(next * 1000).toLocaleString()} class="highlight">
          ${days}d ${hours}h ${minutes}m ${seconds}s
        </div>
      `;
    }

    return html`
      <countdown-timestamp
        .current=${this.current}
        target=${isParty ? previous : next}
      ></countdown-timestamp>
      ${countdown}
    `;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 2rem;
      gap: 1rem;
    }

    .highlight {
      color: var(--highlight-color);
    }

    .next {
      margin-top: 2rem;
      font-size: 1rem;
      text-align: center;
      opacity: 0.5;
    }
  `;
}

export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// by LUMO.proton.me
function findBounds(
  numbers: number[],
  target: number,
): [number | null, number | null] {
  /**
   * Given an array of numbers and a target value, returns:
   * - The nearest number <= target (floor)
   * - The nearest number >= target (ceiling)
   *
   * Returns [null, null] if no such numbers exist.
   */
  if (!numbers || numbers.length === 0) {
    return [null, null];
  }

  let floorVal: number | null = null;
  let ceilVal: number | null = null;

  for (const num of numbers) {
    if (num <= target) {
      if (floorVal === null || num > floorVal) {
        floorVal = num;
      }
    }
    if (num > target) {
      if (ceilVal === null || num < ceilVal) {
        ceilVal = num;
      }
    }
  }

  return [floorVal, ceilVal];
}
