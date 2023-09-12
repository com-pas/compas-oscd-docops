import {
  css,
  html,
  LitElement,
  property,
  query,
  TemplateResult,
} from "lit-element";
import "@material/mwc-textfield";
import "@material/mwc-button";

//import "../WizardDivider.js"; TODO


import {
  COMPAS_SCL_PRIVATE_TYPE,
  getPrivate,
  saveDocumentToFile,
} from "@com-pas/compas-open-core";
import "./helpers/CompasLabelsField.js";

import { nothing } from "lit-html";

/* Event that will be used when an SCL Document is saved. */
export type SaveToFileEvent = CustomEvent<void>;
export function newSaveToFileEvent(): SaveToFileEvent {
  return new CustomEvent<void>("doc-saved", {
    bubbles: true,
    composed: true,
  });
}

export class CompasSaveToFileElement extends LitElement {
  @property()
  doc!: XMLDocument;
  @property()
  docName!: string;
  @property()
  allowLocalFile = true;

  private renderSaveFilePart(): TemplateResult {
    return html`
      <mwc-button
        label="Save to file..."
        @click=${() => {
          saveDocumentToFile(this.doc, this.docName);

          this.dispatchEvent(newSaveToFileEvent());
        }}
      >
      </mwc-button>
    `;
  }

  render(): TemplateResult {
    return html`
      ${this.allowLocalFile
        ? html` <wizard-divider></wizard-divider>
            <section>
              <h3>Local</h3>
              ${this.renderSaveFilePart()}
            </section>`
        : nothing}
    `;
  }

  static styles = css`
    #content > * {
      display: block;
      margin-top: 16px;
    }

    h3 {
      color: var(--mdc-theme-on-surface);
    }
  `;
}
