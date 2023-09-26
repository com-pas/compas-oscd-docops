import {
    css,
    html,
    LitElement,
    query,
    TemplateResult,
    property,
  } from "lit-element";
  import { Dialog } from "@material/mwc-dialog";
  import { newOpenEvent } from "@openscd/open-scd-core";
  import "@com-pas/compas-open";
  import type { DocRetrievedEvent } from "@com-pas/compas-open";
  
  import "@material/mwc-button";
  import "@material/mwc-icon-button";
  import "@material/mwc-icon";
  import "@material/mwc-dialog";
  
  import "@com-pas/compas-open-core/service";
  import {
    CompasSclDataService,
    SDS_NAMESPACE,
    buildDocName,
  } from "@com-pas/compas-open-core";
  import "@com-pas/compas-scl-list";
  import "@com-pas/compas-scl-type-list";
  import type { SclSelectedEvent } from "@com-pas/compas-scl-list";
  import type { TypeSelectedEvent } from "@com-pas/compas-scl-type-list";
  
  /**
   * A plugin that opens a dialog to select a SCL document from a list of SCL documents.
   * @param allowLocalFile - If true, the user can select a local file to open.
   * @param selectedType - The selected SCL type.
   * @param sclTypes - The list of SCL types.
   * @param items - The list of SCL documents.
   * @param labels - The list of labels.
   * @param selectedLabels - The list of selected labels.
   * @param locale - The locale to use for translations.
   */
  export default class CompasOpenMenuPlugin extends LitElement {
    @query("mwc-dialog#compas-open-dlg")
    dialog!: Dialog;
    @property({ type: Boolean })
    allowLocalFile = true;
  
    @property({ type: String })
    selectedType: string | undefined;
    @property({ type: Array })
    sclTypes!: Element[];
    @property({ type: Array })
    items: Element[] | undefined;
    @property({ type: Array })
    labels: string[] = [];
    @property({ type: Array })
    selectedLabels: string[] = [];
    @property({ type: String })
    locale = "en";
  
    async run(): Promise<void> {
      this.dialog.show();
    }
  
    firstUpdated(): void {
      this.fetchTypeList();
      this.dialog.addEventListener("closed", this.resetProperties.bind(this));
    }
  
    update(changedProperties: Map<string, unknown>) {
      if (changedProperties.has("selectedType")) {
        this.fetchList();
      }
      super.update(changedProperties);
    }
  
    resetProperties(): void {
      this.selectedType = undefined;
      this.items = undefined;
    }
  
    fetchTypeList(): void {
      CompasSclDataService()
        .listOrderedSclTypes()
        .then((types) => {
          this.sclTypes = types;
        });
    }
  
    fetchList(): void {
      if (this.selectedType) {
        CompasSclDataService()
          .listScls(this.selectedType)
          .then((xmlResponse) => {
            this.items = Array.from(xmlResponse.querySelectorAll("Item") ?? []);
            this.labels = Array.from(
              new Set(
                Array.from(xmlResponse.querySelectorAll("Label") ?? [])
                  .map((element) => element.textContent)
                  .filter((label) => !!label)
                  .sort((label1, label2) => label1!.localeCompare(label2!))
              )
            ) as string[];
            this.selectedLabels = this.labels;
          });
      }
    }
  
    private async getSclDocument(docId?: string): Promise<void> {
      const doc = await CompasSclDataService()
        .getSclDocument(this, this.selectedType ?? "", docId ?? "")
        .catch((reason) => console.error(this, reason));
  
      if (doc instanceof Document) {
        const docName = buildDocName(doc.documentElement);
        this.dispatchEvent(newOpenEvent(doc, docName!));
        this.dialog.close();
      }
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
        <section slot="sclList">
          <p>Select project ${this.selectedType ?? ""}</p>
          <compas-scl-list
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
            label="OTHER TYPE..."
            icon="arrow_back"
            @click=${() => {
              this.selectedType = undefined;
            }}
          >
          </mwc-button>
        </section>
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
          label="CLOSE"
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