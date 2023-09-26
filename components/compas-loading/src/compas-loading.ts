import { html, LitElement, TemplateResult, property } from "lit-element";
import "@material/mwc-list";
import "@material/mwc-list/mwc-list-item";

export class CompasLoadingElement extends LitElement {
  @property({ type: String }) message?: string;

  render(): TemplateResult {
    return html`
      <mwc-list>
        <mwc-list-item><i>${this.message ?? "Loading..."}</i></mwc-list-item>
      </mwc-list>
    `;
  }
}
