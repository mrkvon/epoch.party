import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./countdown-timer.js";

@customElement("epoch-party")
export class EpochParty extends LitElement {
  render() {
    return html`
      <countdown-timer
        .timestamps=${[
          1_777_777_777,
          1_800_000_000,
          1_888_888_888,
          1_900_000_000,
          2_000_000_000,
          2_100_000_000,
          2 ** 31,
          2_200_000_000,
          2_222_222_222,
        ]}
      ></countdown-timer>
    `;
  }
}
