import {
  css,
  html,
  LitElement,
  property,
  PropertyValues,
  query,
  TemplateResult,
} from "lit-element";
import { TextFieldBase } from "@material/mwc-textfield/mwc-textfield-base";

import "@material/mwc-textfield";
import "@material/mwc-button";

//import "../WizardDivider.js"; TODO

import { CompasChangeSetRadiogroup } from "./helpers/CompasChangeSetRadiogroup.js";
import { CompasSclTypeSelect } from "./helpers/CompasSclTypeSelect.js";
import { CompasCommentElement } from "./helpers/CompasComment.js";
import { CompasLabelsFieldElement } from "./helpers/CompasLabelsField.js";

import {
  COMPAS_SCL_PRIVATE_TYPE,
  createPrivate,
  getPrivate,
  getTypeFromDocName,
  stripExtensionFromName,
  saveDocumentToFile,
} from "@com-pas/compas-open-core";

import "./helpers/CompasChangeSetRadiogroup.js";
import "./helpers/CompasComment.js";
import "./helpers/CompasLabelsField.js";
import "@com-pas/compas-loading";
import "./helpers/CompasSclTypeSelect.js";
import { nothing } from "lit-html";

/* Event that will be used when an SCL Document is saved. */
export type SaveToFileEvent = CustomEvent<void>;
export function newSaveToFileEvent(): SaveToFileEvent {
  return new CustomEvent<void>("doc-saved", {
    bubbles: true,
    composed: true,
  });
}

export class CompasSaveElement extends LitElement {
  @property()
  doc!: XMLDocument;
  @property()
  docName!: string;
  @property()
  allowLocalFile = true;
  @property()
  existInCompas = false;

  @query("mwc-textfield#name")
  private nameField!: TextFieldBase;

  @query("compas-scltype-select")
  private sclTypeRadioGroup!: CompasSclTypeSelect;

  @query("compas-changeset-radiogroup")
  private changeSetRadiogroup!: CompasChangeSetRadiogroup;

  @query("compas-comment")
  private commentField!: CompasCommentElement;

  @query("compas-labels-field")
  private labelsField!: CompasLabelsFieldElement;

  get docType() {
    return this.changeSetRadiogroup.getSelectedValue();
  }

  get commentFieldValue() {
    return this.commentField.value;
  }

  get nameFieldValue() {
    return this.nameField.value;
  }

  protected updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    // When the document is updated, we reset the selected IED.
    if (_changedProperties.has("doc")) {
      if (this.commentField) {
        this.commentField.value = null;
      }
    }
  }

  valid(): boolean {
    if (!this.existInCompas) {
      return this.nameField.checkValidity() && this.sclTypeRadioGroup.valid();
    }
    return this.changeSetRadiogroup.valid();
  }

  private getCleanFileName(): string {
    return stripExtensionFromName(this.docName);
  }

  updateLabels() {
    const sclElement = this.doc.documentElement;
    const privateElement = getPrivate(sclElement, COMPAS_SCL_PRIVATE_TYPE);
    this.labelsField.updateLabelsInPrivateElement(privateElement!);
  }

  private renderSaveFilePart(): TemplateResult {
    return html`
      <mwc-button
        label="Save to file..."
        @click=${() => {
          this.updateLabels();
          saveDocumentToFile(this.doc, this.docName);

          this.dispatchEvent(newSaveToFileEvent());
        }}
      >
      </mwc-button>
    `;
  }

  private renderSaveCompasPart(): TemplateResult {
    if (this.existInCompas === undefined) {
      return html` <compas-loading></compas-loading> `;
    }

    if (!this.existInCompas) {
      return html`
        <div id="content">
          <mwc-textfield
            dialogInitialFocus
            id="name"
            label="Name"
            value="${this.getCleanFileName()}"
            required
          >
          </mwc-textfield>

          <compas-scltype-select
            .value="${getTypeFromDocName(this.docName)}"
          ></compas-scltype-select>
          <compas-comment></compas-comment>
        </div>
      `;
    }
    return html`
      <div id="content">
        <compas-changeset-radiogroup></compas-changeset-radiogroup>
        <compas-comment></compas-comment>
      </div>
    `;
  }

  private renderLabelsPart(): TemplateResult {
    const sclElement = this.doc.documentElement;
    let privateElement = getPrivate(sclElement, COMPAS_SCL_PRIVATE_TYPE);
    if (!privateElement) {
      privateElement = createPrivate(sclElement, COMPAS_SCL_PRIVATE_TYPE);
      sclElement.prepend(privateElement);
    }

    return html`<compas-labels-field
      .privateElement="${privateElement}"
    ></compas-labels-field>`;
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
      <wizard-divider></wizard-divider>
      <section>
        <h3>CoMPAS</h3>
        ${this.renderSaveCompasPart()}
      </section>
      <wizard-divider></wizard-divider>
      <section>
        <h3>CoMPAS Labels</h3>
        ${this.renderLabelsPart()}
      </section>
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
