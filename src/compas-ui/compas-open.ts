import {
  customElement,
  html,
  LitElement,
  property,
  query,
  TemplateResult,
} from 'lit-element';
import { translate } from 'lit-translate';

import '@material/mwc-button';
import { nothing } from 'lit-html';

/* Event that will be used when an SCL Document is retrieved. */
export interface DocRetrievedDetail {
  localFile: boolean;
  doc: Document;
  docName: string;
  docId?: string;
}
export type DocRetrievedEvent = CustomEvent<DocRetrievedDetail>;
export function newDocRetrievedEvent(
  localFile: boolean,
  doc: Document,
  docName: string,
  docId?: string
): DocRetrievedEvent {
  return new CustomEvent<DocRetrievedDetail>('doc-retrieved', {
    bubbles: true,
    composed: true,
    detail: { localFile, doc, docName, docId },
  });
}

@customElement('compas-open')
export class CompasOpenElement extends LitElement {
  @property()
  allowLocalFile = true;

  @query('#scl-file')
  private sclFileUI!: HTMLInputElement;

  /* private async getSclDocument(docId?: string): Promise<void> {
    const doc = await CompasSclDataService()
      .getSclDocument(this, this.selectedType ?? '', docId ?? '')
      .catch(reason => createLogEvent(this, reason));

    if (doc instanceof Document) {
      const docName = buildDocName(doc.documentElement);
      this.dispatchEvent(newDocRetrievedEvent(false, doc, docName, docId));
    }
  } */

  private async getSclFile(fileObj: {
    isLocal: boolean;
    evt: Event;
    docId?: string;
  }): Promise<void> {
    const file =
      (<HTMLInputElement | null>fileObj.evt.target)?.files?.item(0) ?? false;
    if (!file) return;
    const text = await file.text();
    const docName = file.name;
    const doc = new DOMParser().parseFromString(text, 'application/xml');
    this.dispatchEvent(newDocRetrievedEvent(true, doc, docName));
  }

  private renderFileSelect(): TemplateResult {
    return html`
      <input
        id="scl-file"
        accept=".sed,.scd,.ssd,.isd,.iid,.cid,.icd"
        type="file"
        hidden
        required
        @change=${(evt: Event) => this.getSclFile({ isLocal: true, evt })}
      />

      <mwc-button
        label="${translate('compas.open.selectFileButton')}"
        @click=${() => {
          this.sclFileUI.value = '';
          this.sclFileUI.click();
        }}
      >
      </mwc-button>
    `;
  }

  render(): TemplateResult {
    return html`
      ${this.allowLocalFile
        ? html`<wizard-divider></wizard-divider>
            <section>
              <h3>${translate('compas.open.localTitle')}</h3>
              ${this.renderFileSelect()}
            </section>`
        : nothing}
      <wizard-divider></wizard-divider>
      <section>
        <h3>${translate('compas.open.compasTitle')}</h3>
        <slot name="sclTypes"></slot>
        <slot name="sclList"></slot>
      </section>
    `;
  }
}
