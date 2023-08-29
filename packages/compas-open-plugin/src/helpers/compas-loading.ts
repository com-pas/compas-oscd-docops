import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  property,
} from "lit-element";
import "@material/mwc-list";
import "@material/mwc-list/mwc-list-item";

@customElement("compas-loading")
export class CompasLoadingElement extends LitElement {
  @property()
  message: string | undefined;

  render(): TemplateResult {
    return html`
      <mwc-list>
        <mwc-list-item><i>${this.message ?? "Loading..."}</i></mwc-list-item>
      </mwc-list>
    `;
  }
}
