import { css, html, LitElement, query, TemplateResult } from 'lit-element';
import { translate } from 'lit-translate';
import { Dialog } from '@material/mwc-dialog';
import { newOpenEvent } from '@openscd/open-scd-core';
import {
  CompasSclDataService,
  SDS_NAMESPACE,
} from '../service/CompasSclDataService.js';

import { DocRetrievedEvent } from '../compas-ui/compas-open.js';
import '../compas-ui/compas-open.js';
import '@material/mwc-button';
import { buildDocName } from '../to-be-made-a-dependency/foundation.js';
import { SclSelectedEvent } from '../compas-ui/compas-scl-list.js';

export default class CompasOpenMenuPlugin extends LitElement {
  @query('mwc-dialog#compas-open-dlg')
  dialog!: Dialog;
  selectedType: string | undefined;
  sclTypes!: Element[];
  items!: Element[];
  labels: string[] = [];
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
    ></compas-scltype-list>`;
  }

  renderSclList(): TemplateResult {
    return html`
      <p>
        ${translate('compas.open.listScls', {
          type: this.selectedType ?? '',
        })}
      </p>
      <compas-scl-list
        slot="sclList"
        .type=${this.selectedType}
        .items=${this.items}
        namespace="${SDS_NAMESPACE}"
        @scl-selected=${(evt: SclSelectedEvent) =>
          this.getSclDocument(evt.detail.docId)}
      >
      </compas-scl-list>
      <mwc-button
        id="reselect-type"
        label="${translate('compas.open.otherTypeButton')}"
        icon="arrow_back"
        @click=${() => {
          this.selectedType = undefined;
        }}
      >
      </mwc-button>
    `;
  }

  render(): TemplateResult {
    return html`<mwc-dialog
      id="compas-open-dlg"
      heading="${translate('compas.open.title')}"
    >
      <compas-open
        @doc-retrieved=${(event: DocRetrievedEvent) => {
          this.dispatchEvent(
            newOpenEvent(event.detail.doc, event.detail.docName!)
          );
        }}
      >
        ${this.selectedType ? this.renderSclTypeList() : this.renderSclList()}
      </compas-open>
      <mwc-button
        slot="secondaryAction"
        icon=""
        label="${translate('close')}"
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
