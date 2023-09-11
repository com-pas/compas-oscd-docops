import { html, LitElement, TemplateResult } from "lit";
import { query, property } from "lit/decorators.js";
import "@material/mwc-button";
import { nothing } from "lit-html";

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
  return new CustomEvent<DocRetrievedDetail>("doc-retrieved", {
    bubbles: true,
    composed: true,
    detail: { localFile, doc, docName, docId },
  });
}

export class CompasOpenElement extends LitElement {
  @property()
  allowLocalFile = true;

  @query("#scl-file")
  private sclFileUI!: HTMLInputElement;

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
    const doc = new DOMParser().parseFromString(text, "application/xml");
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
        label="OPEN FILE...."
        @click=${() => {
          this.sclFileUI.value = "";
          this.sclFileUI.click();
        }}
      >
      </mwc-button>
    `;
  }

  //TODO: add wizard-devider
  render(): TemplateResult {
    return html`
      ${this.allowLocalFile
        ? html`<wizard-divider></wizard-divider>
            <section>
              <h3>Local</h3>
              ${this.renderFileSelect()}
            </section>`
        : nothing}
      <wizard-divider></wizard-divider>
      <section>
        <h3>CoMPAS</h3>
        <slot name="sclTypes"></slot>
        <slot name="sclList"></slot>
        <slot />
      </section>
    `;
  }
}
