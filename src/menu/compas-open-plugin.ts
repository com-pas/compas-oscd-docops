import {
  css,
  html,
  LitElement,
  query,
  TemplateResult,
  property,
  state,
} from 'lit-element';
import { Dialog } from '@material/mwc-dialog';
import { newOpenEvent } from '@openscd/open-scd-core';
import {
  CompasSclDataService,
  SDS_NAMESPACE,
} from '../service/CompasSclDataService.js';

import { DocRetrievedEvent } from '../compas-ui/compas-open.js';
import '../compas-ui/compas-open.js';
import '../compas-ui/helpers/compas-scl-list.js';
import '../compas-ui/helpers/compas-scl-type-list.js';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import '@material/mwc-icon';
import '@material/mwc-dialog';
import { buildDocName } from '../to-be-made-a-dependency/foundation.js';
import { SclSelectedEvent } from '../compas-ui/helpers/compas-scl-list.js';
import { TypeSelectedEvent } from '../compas-ui/helpers/compas-scl-type-list.js';
export default class CompasOpenMenuPlugin extends LitElement {
  @query('mwc-dialog#compas-open-dlg')
  dialog!: Dialog;
  @property()
  allowLocalFile = true;

  @property()
  selectedType: string | undefined;
  @property()
  sclTypes!: Element[];
  @state()
  items!: Element[];
  @state()
  labels: string[] = [];
  @state()
  selectedLabels: string[] = [];

  async run(): Promise<void> {
    this.dialog.show();
  }

  firstUpdated(): void {
    this.fetchTypeList();
    this.fetchList();
  }

  fetchTypeList(): void {
    CompasSclDataService()
      .listOrderedSclTypes()
      .then(types => {
        this.sclTypes = types;
      });
  }

  fetchList(): void {
    if (this.selectedType) {
      CompasSclDataService()
        .listScls(this.selectedType)
        .then(xmlResponse => {
          this.items = Array.from(xmlResponse.querySelectorAll('Item') ?? []);
          this.labels = Array.from(
            new Set(
              Array.from(xmlResponse.querySelectorAll('Label') ?? [])
                .map(element => element.textContent)
                .filter(label => !!label)
                .sort((label1, label2) => label1!.localeCompare(label2!))
            )
          ) as string[];
          this.selectedLabels = this.labels;
        });
    }
  }

  private async getSclDocument(docId?: string): Promise<void> {
    const doc = await CompasSclDataService()
      .getSclDocument(this, this.selectedType ?? '', docId ?? '')
      .catch(reason => console.log(this, reason));

    if (doc instanceof Document) {
      const docName = buildDocName(doc.documentElement);
      this.dispatchEvent(newOpenEvent(doc, docName!));
      this.dialog.close();
    }
  }

  private async openDoc(event: DocRetrievedEvent): Promise<void> {
    if (event.detail.localFile) {
      // this.dispatchEvent(newLogEvent({ kind: 'reset' }));
      this.dispatchEvent(newOpenEvent(event.detail.doc, event.detail.docName!));
    } else {
      // updateDocumentInOpenSCD(this, event.detail.doc, event.detail.docName);
    }
    this.dialog.close();
  }

  renderSclTypeList(): TemplateResult {
    return html` <compas-scltype-list
      slot="sclTypes"
      .sclTypes=${this.sclTypes}
      namespace="${SDS_NAMESPACE}"
      @typeSelected=${(evt: TypeSelectedEvent) =>
        (this.selectedType = evt.detail.type)}
    ></compas-scltype-list>`;
  }

  renderSclList(): TemplateResult {
    return html`
      <p>Select project ${this.selectedType ?? ''}</p>
      <compas-scl-list
        slot="sclList"
        .type=${this.selectedType}
        .items=${this.items}
        .labels=${this.labels}
        .selectedLabels=${this.selectedLabels}
        namespace="${SDS_NAMESPACE}"
        @scl-selected=${(evt: SclSelectedEvent) =>
          this.getSclDocument(evt.detail.docId)}
      >
      </compas-scl-list>
      <mwc-button
        id="reselect-type"
        label="Other type..."
        icon="arrow_back"
        @click=${() => {
          this.selectedType = undefined;
        }}
      >
      </mwc-button>
    `;
  }

  render(): TemplateResult {
    return html`<mwc-dialog id="compas-open-dlg" heading="Open project">
      <compas-open
        .allowLocalFile=${this.allowLocalFile}
        @doc-retrieved=${(event: DocRetrievedEvent) => {
          this.dispatchEvent(
            newOpenEvent(event.detail.doc, event.detail.docName!)
          );
          this.dialog.close();
        }}
      >
        ${this.selectedType ? this.renderSclList() : this.renderSclTypeList()}
      </compas-open>
      <mwc-button
        slot="secondaryAction"
        icon=""
        label="Close"
        dialogAction="close"
        style="--mdc-theme-primary: var(--mdc-theme-error)"
      >
      </mwc-button>
    </mwc-dialog>`;
  }

  static styles = css`
    mwc-dialog {
      --mdc-dialog-min-width: 23vw;
      --mdc-dialog-max-width: 92vw;
    }
  `;
}
