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

import "@material/mwc-button";
import "@material/mwc-dialog";
import { Dialog } from "@material/mwc-dialog";
import {
  CompasSclDataService,
  getTypeFromDocName,
  updateDocumentInOpenSCD,
  stripExtensionFromName,
} from "@com-pas/compas-open-core";
import { checkExistInCompas } from "./helpers/foundation";

import { CompasSaveElement, newSaveToFileEvent } from "@com-pas/compas-save";
import "@com-pas/compas-save";

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

  @query("mwc-dialog#compas-save-dlg")
  dialog!: Dialog;

  @query("compas-save")
  compasSaveElement!: CompasSaveElement;

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
      this.existInCompas = checkExistInCompas(this.docName, this.docId);
    }
  }

  private async addSclToCompas(doc: XMLDocument): Promise<void> {
    const name = stripExtensionFromName(this.compasSaveElement.nameFieldValue);
    const comment = this.compasSaveElement.commentFieldValue;
    const docType = this.compasSaveElement.docType ?? "";

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
    const changeSet = this.compasSaveElement.docType;
    const comment = this.compasSaveElement.commentFieldValue;
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
    this.compasSaveElement.updateLabels();
    if (!this.docId || !this.existInCompas) {
      await this.addSclToCompas(this.doc);
    } else {
      await this.updateSclInCompas(this.docId, this.docName, this.doc);
    }
  }

  async run(): Promise<void> {
    await this.compasSaveElement.requestUpdate();
    this.dialog.show();
  }

  render(): TemplateResult {
    return html`<mwc-dialog id="compas-save-dlg" heading="Save project">
      ${!this.doc || !this.docName
        ? html`<compas-loading></compas-loading>`
        : html`
            <compas-save
              .doc="${this.doc}"
              .docName="${this.docName}"
              .docId="${this.docId}"
              .editCount=${this.editCount}
              ?existInCompas=${this.existInCompas}
              @doc-saved=${() => {
                this.dialog.close();
              }}
            >
            </compas-save>
            <mwc-button
              slot="primaryAction"
              icon="save"
              trailingIcon
              label="Save"
              @click=${() => {
                if (this.compasSaveElement.valid()) {
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
  `;
}
