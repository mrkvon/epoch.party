import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('countdown-timer')
export class CountdownTimer extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 2rem;
      gap: 1rem;
    }

    .highlight {
      color: #ff0055;
    }
  `;

  @property({ type: Number }) timestamp = 0;

  @state() private remaining = 0;
  private intervalId: number | null = null;

  @state() private current = Date.now();

  connectedCallback() {
    super.connectedCallback();
    this.startTimer();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.intervalId) clearInterval(this.intervalId);
  }

  startTimer() {
    this.updateRemaining();
    this.updateCurrent();
    this.intervalId = window.setInterval(() => {
      this.updateRemaining();
      this.updateCurrent();
    }, 50);
  }

  updateRemaining() {
    const now = Math.floor(Date.now() / 1000);
    this.remaining = Math.max(0, this.timestamp - now);

    if (this.remaining === 0 && this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  updateCurrent() {
    this.current = Math.floor(Date.now() / 1000);
  }

  render() {
    let countdown = html``;
    if (this.remaining === 0) {
      countdown = html`<div>🎉 PARTY TIME! 🎉</div>`;
    } else {
      const days = Math.floor(this.remaining / (3600 * 24));
      const hours = Math.floor((this.remaining % (3600 * 24)) / 3600);
      const minutes = Math.floor((this.remaining % 3600) / 60);
      const seconds = Math.floor(this.remaining % 60);

      countdown = html`
        <div>in</div>
        <div class="highlight">${days}d ${hours}h ${minutes}m ${seconds}s</div>
      `;
    }

    return html`
      <div class="highlight">${this.timestamp}</div>
      ${countdown}
      <!-- <div class="highlight">
        ${new Date(this.timestamp * 1000).toLocaleString()}
      </div>
      <div class="highlight">${this.current}</div> -->
    `;
  }
}
