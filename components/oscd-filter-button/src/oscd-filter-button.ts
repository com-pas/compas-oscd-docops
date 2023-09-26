import {
    css,
    html,
    TemplateResult,
    query,
    property,
    unsafeCSS,
  } from "lit-element";
  
  import "@material/mwc-icon-button";
  import "@material/mwc-dialog";
  
  import "@openscd/oscd-filtered-list";
  import { OscdFilteredList } from "@openscd/oscd-filtered-list";
  import { Dialog } from "@material/mwc-dialog";
  
  export interface SelectedItemsChangedDetail {
    selectedItems: string[];
  }
  export type SelectedItemsChangedEvent = CustomEvent<SelectedItemsChangedDetail>;
  function newSelectedItemsChangedEvent(
    selectedItems: string[],
    eventInitDict?: CustomEventInit<SelectedItemsChangedDetail>
  ): SelectedItemsChangedEvent {
    return new CustomEvent<SelectedItemsChangedDetail>("selected-items-changed", {
      bubbles: true,
      composed: true,
      ...eventInitDict,
      detail: { selectedItems, ...eventInitDict?.detail },
    });
  }
  
  /**
   * A mwc-list with mwc-textfield that filters the list items for given or separated terms
   */
  export class OscdFilterButton extends OscdFilteredList {
    @property()
    header!: TemplateResult | string;
    @property()
    icon!: string;
    @property({ type: Boolean })
    disabled = false;
  
    @query("#filterDialog")
    private filterDialog!: Dialog;
  
    private toggleList(): void {
      this.filterDialog.show();
    }
  
    private onClosing(): void {
      const selectedItems: string[] = [];
      if (this.selected) {
        if (this.selected instanceof Array) {
          this.selected.forEach((item) => selectedItems.push(item.value));
        } else {
          selectedItems.push(this.selected.value);
        }
        this.dispatchEvent(newSelectedItemsChangedEvent(selectedItems));
      }
    }
  
    render(): TemplateResult {
      return html`
        <mwc-icon-button
          icon="${this.icon}"
          @click="${this.toggleList}"
          ?disabled="${this.disabled}"
        >
          <slot name="icon"></slot>
        </mwc-icon-button>
        <mwc-dialog
          id="filterDialog"
          heading="${this.header ? this.header : "Filter"}
          scrimClickAction=""
          @closing="${() => this.onClosing()}"
        >
        ${super.render()}
          <mwc-button slot="primaryAction" dialogAction="close">
            CLOSE
          </mwc-button>
        </mwc-dialog>
      `;
    }
  
    static styles = css`
      ${unsafeCSS(OscdFilteredList.styles)}
  
      mwc-icon-button {
        color: var(--mdc-theme-on-surface);
      }
  
      mwc-dialog {
        --mdc-dialog-max-height: calc(100vh - 150px);
      }
    `;
  }
  
  declare global {
    interface ElementEventMap {
      ["selected-items-changed"]: SelectedItemsChangedEvent;
    }
  }