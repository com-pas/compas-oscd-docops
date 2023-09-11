import {
  css,
  customElement,
  html,
  LitElement,
  TemplateResult,
  property,
} from "lit-element";

import "@material/mwc-list";
import "@material/mwc-list/mwc-list-item";
import "@material/mwc-select";

import { CompasSclDataService, SDS_NAMESPACE } from "@com-pas/compas-open-core";
import { Select } from "@material/mwc-select";
import { repeat } from "lit-html/directives/repeat";

@customElement("compas-scltype-select")
export class CompasSclTypeSelect extends LitElement {
  @property()
  value = "";

  @property()
  sclTypes?: Element[];

  firstUpdated(): void {
    this.fetchData();
  }

  fetchData(): void {
    CompasSclDataService()
      .listOrderedSclTypes()
      .then((types) => (this.sclTypes = types));
  }

  getSelectedValue(): string | null {
    return (
      (<Select>this.shadowRoot!.querySelector("mwc-select"))?.selected?.value ??
      null
    );
  }

  valid(): boolean {
    const newValue = this.getSelectedValue();
    return !!newValue;
  }

  render(): TemplateResult {
    if (!this.sclTypes) {
      return html` <compas-loading></compas-loading> `;
    }

    if (this.sclTypes.length <= 0) {
      return html` <mwc-list>
        <mwc-list-item><i>No types found in CoMPAS</i></mwc-list-item>
      </mwc-list>`;
    }
    return html` <mwc-select
      fixedMenuPosition
      naturalMenuWidth="true"
      label="SCL Type"
    >
      ${repeat(
        this.sclTypes,
        (type) =>
          type.getElementsByTagNameNS(SDS_NAMESPACE, "Code").item(0)!
            .textContent ?? "",
        (type) => {
          const code =
            type.getElementsByTagNameNS(SDS_NAMESPACE, "Code").item(0)!
              .textContent ?? "";
          const description =
            type.getElementsByTagNameNS(SDS_NAMESPACE, "Description").item(0)!
              .textContent ?? "";
          return html`<mwc-list-item
            value="${code}"
            ?selected="${code === this.value}"
          >
            <span>${description} (${code})</span>
          </mwc-list-item>`;
        }
      )}
    </mwc-select>`;
  }

  static styles = css`
    mwc-select {
      width: 100%;
    }
  `;
}
