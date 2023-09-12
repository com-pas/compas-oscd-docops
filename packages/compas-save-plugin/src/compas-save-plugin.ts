import {
  css,
  html,
  LitElement,
  property,
  PropertyValues,
  query,
  state,
  TemplateResult,
} from "lit-element";
import { TextFieldBase } from "@material/mwc-textfield/mwc-textfield-base";
import "@material/mwc-button";
import "@material/mwc-dialog";
import "@com-pas/compas-loading";
import { Dialog } from "@material/mwc-dialog";
import {
  CompasSclDataService,
  getTypeFromDocName,
  updateDocumentInOpenSCD,
  stripExtensionFromName,
  getPrivate,
  createPrivate,
  COMPAS_SCL_PRIVATE_TYPE,
} from "@com-pas/compas-open-core";
import { checkExistInCompas } from "./helpers/foundation";
import { CompasChangeSetRadiogroup } from "./helpers/CompasChangeSetRadiogroup.js";
import { CompasSclTypeSelect } from "./helpers/CompasSclTypeSelect.js";
import { CompasCommentElement } from "./helpers/CompasComment.js";

import "./helpers/CompasChangeSetRadiogroup.js";
import "./helpers/CompasComment.js";
import "./helpers/CompasSclTypeSelect.js";

import { CompasSaveToFileElement, newSaveToFileEvent, CompasLabelsFieldElement } from "@com-pas/compas-save-to-file";
import "@com-pas/compas-save-to-file";


export interface PendingStateDetail {
  promise: Promise<void>;
}
export type PendingStateEvent = CustomEvent<PendingStateDetail>;
export function newPendingStateEvent(
  promise: Promise<void>,
  eventInitDict?: CustomEventInit<Partial<PendingStateDetail>>
): PendingStateEvent {
  return new CustomEvent<PendingStateDetail>("pending-state", {
    bubbles: true,
    composed: true,
    ...eventInitDict,
    detail: { promise, ...eventInitDict?.detail },
  });
}

export default class CompasSaveMenuPlugin extends LitElement {
  @property()
  doc!: XMLDocument;
  @property()
  docName!: string;
  @property()
  docId?: string;
  @property({ type: Number })
  editCount = -1;
  @state()
  existInCompas?: boolean;

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

  @query("mwc-dialog#compas-save-dlg")
  dialog!: Dialog;

  @query("compas-save-to-file")
  compasSaveToFileElement!: CompasSaveToFileElement;

  firstUpdated(): void {
    this.checkIfExists();
  }

  checkIfExists(): void {
    this.existInCompas = checkExistInCompas(this.docName, this.docId);
  }

  updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    if (_changedProperties.has("docId")) {
      this.existInCompas = undefined;
      this.checkIfExists();
    }

    // When the document is updated, we reset the selected IED.
    if (_changedProperties.has("doc")) {
      if (this.commentField) {
        this.commentField.value = null;
      }
    }
  }

  valid(existsInCompas: boolean): boolean {
    if (!existsInCompas) {
      return this.nameField.checkValidity() && this.sclTypeRadioGroup.valid();
    }
    return this.changeSetRadiogroup.valid();
  }

  private async addSclToCompas(doc: XMLDocument): Promise<void> {
    const name = stripExtensionFromName(this.nameFieldValue);
    const comment = this.commentFieldValue;
    const docType = this.docType ?? "";

    await CompasSclDataService()
      .addSclDocument(this, docType, {
        sclName: name,
        comment: comment,
        doc: doc,
      })
      .then((sclDocument: Document) => {
        this.processUpdatedDocument(sclDocument, "Project added to CoMPAS.");
      })
      .catch((reason) => console.error(reason));
  }

  private processUpdatedDocument(
    sclDocument: Document,
    messageKey: string
  ): void {
    updateDocumentInOpenSCD(this, sclDocument);
    console.log(messageKey);
    /*this.dispatchEvent(
      newLogEvent({
        kind: "info",
        title: messageKey,
      })
    );*/

    this.dispatchEvent(newSaveToFileEvent());
  }

  private async updateSclInCompas(
    docId: string,
    docName: string,
    doc: XMLDocument
  ): Promise<void> {
    const changeSet = this.docType;
    const comment = this.commentFieldValue;
    const docType = getTypeFromDocName(docName);

    await CompasSclDataService()
      .updateSclDocument(this, docType, docId, {
        changeSet: changeSet!,
        comment: comment,
        doc: doc,
      })
      .then((sclDocument) => {
        this.processUpdatedDocument(sclDocument, "Project updated in CoMPAS");
      })
      .catch((reason) => console.error(reason));
  }

  async saveToCompas(): Promise<void> {
    this.updateLabels();
    if (!this.docId || !this.existInCompas) {
      await this.addSclToCompas(this.doc);
    } else {
      await this.updateSclInCompas(this.docId, this.docName, this.doc);
    }
  }

  async run(): Promise<void> {
    await this.compasSaveToFileElement.requestUpdate();
    this.dialog.show();
  }

  private renderSaveCompasPart(): TemplateResult {
    if (!this.doc || !this.docName || this.existInCompas === undefined) {
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

  private getCleanFileName(): string {
    return stripExtensionFromName(this.docName);
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

  updateLabels() {
    const sclElement = this.doc.documentElement;
    const privateElement = getPrivate(sclElement, COMPAS_SCL_PRIVATE_TYPE);
    this.labelsField?.updateLabelsInPrivateElement(
      privateElement!
    );
  }

  render(): TemplateResult {
    return html`<mwc-dialog id="compas-save-dlg" heading="Save project">
      ${this.existInCompas === undefined
        ? html`<compas-loading></compas-loading>`
        : html`
            <compas-save-to-file
              .doc="${this.doc}"
              .docName="${this.docName}"
              @doc-saved=${() => {
                this.updateLabels();
                this.dialog.close();
              }}
            >
            </compas-save-to-file>
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
            <mwc-button
              slot="primaryAction"
              icon="save"
              trailingIcon
              label="Save"
              @click=${() => {
                if (this.valid(this.existInCompas!)) {
                  this.dispatchEvent(newPendingStateEvent(this.saveToCompas()));
                }
              }}
            ></mwc-button>
            <mwc-button
              slot="secondaryAction"
              icon=""
              label="Close"
              dialogAction="close"
              style="--mdc-theme-primary: var(--mdc-theme-error)"
            >
            </mwc-button>
          `}
    </mwc-dialog>`;
  }

  static styles = css`
    mwc-dialog {
      --mdc-dialog-min-width: 23vw;
      --mdc-dialog-max-width: 92vw;
    }

    h3 {
      color: var(--mdc-theme-on-surface);
    }
  `;
}
