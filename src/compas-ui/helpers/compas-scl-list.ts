import {
  css,
  customElement,
  html,
  LitElement,
  property,
  PropertyValues,
  state,
  TemplateResult,
} from 'lit-element';

import '@material/mwc-icon';
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';

import { SelectedItemsChangedEvent } from '../../to-be-made-a-dependency/oscd-filter-button.js';
import '../../to-be-made-a-dependency/filtered-list.js';
import '../../to-be-made-a-dependency/oscd-filter-button.js';

/* Event that will be used when a SCL is selected from a list of SCL Documents. */
export interface SclSelectedDetail {
  docId: string;
}
export type SclSelectedEvent = CustomEvent<SclSelectedDetail>;
export function newSclSelectedEvent(docId: string): SclSelectedEvent {
  return new CustomEvent<SclSelectedDetail>('scl-selected', {
    bubbles: true,
    composed: true,
    detail: { docId },
  });
}

@customElement('compas-scl-list')
export class CompasSclList extends LitElement {
  @property()
  type?: string;
  @property()
  nameSpace = '';

  @state()
  private items: Element[] | undefined;

  @state()
  private labels: string[] = [];

  @state()
  private selectedLabels: string[] = [];

  @state()
  private get filteredItems(): Element[] | undefined {
    // If items are still being retrieved, return undefined.
    if (!this.items) {
      return undefined;
    }

    // If all labels are selected, show all items, including the ones not having a Label.
    if (this.labels.length === this.selectedLabels.length) {
      return this.items;
    }

    return this.items.filter(item => {
      const labels = Array.from(item.querySelectorAll('Label') ?? [])
        .map(element => element.textContent)
        .filter(value => !!value) as string[];
      return (
        labels.filter(label => this.selectedLabels.includes(label)).length > 0
      );
    });
  }

  render(): TemplateResult {
    if (!this.items) {
      return html` <compas-loading></compas-loading> `;
    }
    if (this.items?.length <= 0) {
      return html` <mwc-list>
        <mwc-list-item><i>No projects found in CoMPAS</i></mwc-list-item>
      </mwc-list>`;
    }
    const { filteredItems } = this;
    return html`
      <div class="filters">
        <span>Filter on:</span>
        <oscd-filter-button
          .icon=${this.labels.length != this.selectedLabels.length
            ? 'label'
            : 'label_off'}
          id="labelsFilter"
          multi="true"
          ?disabled="${this.labels.length <= 0}"
          .header="Select labels to be shown"
          @selected-items-changed="${(e: SelectedItemsChangedEvent) => {
            this.selectedLabels = e.detail.selectedItems;
            this.requestUpdate('items');
            this.requestUpdate('filteredItems');
            this.requestUpdate('selectedLabels');
          }}"
        >
          ${this.labels.map(label => {
            return html` <mwc-check-list-item
              value="${label}"
              ?selected="${this.selectedLabels.includes(label)}"
            >
              ${label}
            </mwc-check-list-item>`;
          })}
        </oscd-filter-button>
      </div>
      ${filteredItems && filteredItems.length > 0
        ? html` <filtered-list>
            ${filteredItems.map(item => {
              const id =
                item.getElementsByTagNameNS(this.nameSpace, 'Id').item(0)!
                  .textContent ?? '';
              let name =
                item.getElementsByTagNameNS(this.nameSpace, 'Name').item(0)!
                  .textContent ?? '';
              if (name === '') {
                name = id;
              }
              const version =
                item.getElementsByTagNameNS(this.nameSpace, 'Version').item(0)!
                  .textContent ?? '';
              return html` <mwc-list-item
                tabindex="0"
                @click=${() => this.dispatchEvent(newSclSelectedEvent(id))}
              >
                ${name} (${version})
              </mwc-list-item>`;
            })}
          </filtered-list>`
        : html` <mwc-list>
            <mwc-list-item>
              <i>No projects found matching the filter(s)</i>
            </mwc-list-item>
          </mwc-list>`}
    `;
  }

  static styles = css`
    .filters {
      padding-left: var(--mdc-list-side-padding, 16px);
      display: flex;
    }

    .filters > span {
      line-height: 48px;
    }
  `;
}
