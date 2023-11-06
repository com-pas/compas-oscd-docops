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
   * @prop {string} header - The header of the dialog.
   * @prop {string} icon - The icon of the button.
   * @prop {boolean} disabled - If true, the button is disabled.
   * @slot - The default slot.
   * @example <oscd-filter-button></oscd-filter-button>
   * @summary Displays a button that opens a dialog with a list filterable by given search terms
   * @tagname oscd-filter-button
   * @cssprop --mdc-theme-on-surface - The color of the icon.
   */
  export class OscdFilterButton extends OscdFilteredList {
    /** the header of the dialog. */
    @property()
    header!: TemplateResult | string;
    /** the icon of the button. */
    @property()
    icon!: string;
    /** if true, the button is disabled. */
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
          heading="${this.header ? this.header : "Filter"}"
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