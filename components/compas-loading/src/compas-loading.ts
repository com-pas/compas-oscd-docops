import { html, LitElement, TemplateResult, property } from "lit-element";
import "@material/mwc-list";
import "@material/mwc-list/mwc-list-item";

/**
 * @prop {string} message - The message to display.
 * @example <compas-loading message="Custom Loading Message..."></compas-loading>
 * @summary Displays a loading message.
 * @tagname compas-loading
 */
export class CompasLoadingElement extends LitElement {
  /** the message to display. */
  @property({ type: String }) message?: string;

  render(): TemplateResult {
    return html`
      <mwc-list>
        <mwc-list-item><i>${this.message ?? "Loading..."}</i></mwc-list-item>
      </mwc-list>
    `;
  }
}