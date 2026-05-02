import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { randomInRange } from "./countdown-timer.js";

@customElement("epoch-party-time")
export class EpochPartyTime extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    this.party();
  }

  async party() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const particlesConfetti = await import("@tsparticles/confetti");

    const confetti = particlesConfetti.confetti;
    await Promise.all(
      [100 / 3, 200 / 3].map((x) =>
        confetti({
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          particleCount: randomInRange(50, 100),
          position: { y: 50, x },
        }),
      ),
    );
  }

  render() {
    return html`<button
      class="party"
      aria-label="Trigger party confetti"
      @click=${this.party}
    >
      🎉 PARTY TIME! 🎉
    </button> `;
  }

  static styles = css`
    .party {
      all: unset;
    }

    .party:focus {
      outline: revert;
    }
  `;
}
