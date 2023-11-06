import { html, LitElement, property, TemplateResult } from "lit-element";
import "@material/mwc-list";
import "@material/mwc-list/mwc-list-item";
import "@com-pas/compas-loading";

/* Event that will be used when a SCL Type is selected from a list of types. */
export interface TypeSelectedDetail {
  type: string;
}
export type TypeSelectedEvent = CustomEvent<TypeSelectedDetail>;
export function newTypeSelectedEvent(type: string): TypeSelectedEvent {
  return new CustomEvent<TypeSelectedDetail>("typeSelected", {
    bubbles: true,
    composed: true,
    detail: { type },
  });
}

/**
 * @prop {Element[]} sclTypes - The list of SCL types.
 * @prop {string} nameSpace - The namespace of the SCL types.
 * @example <compas-scl-type-list></compas-scl-type-list>
 * @summary Displays a list of SCL types.
 * @tagname compas-scl-type-list
 */
export class CompasSclTypeList extends LitElement {
  /** the list of SCL types. */
  @property({ type: Array })
  sclTypes: Element[] | undefined;
  /** the namespace of the SCL types. */
  @property({ type: String })
  nameSpace = "";

  private renderLoading(): TemplateResult {
    return html` <compas-loading message="Loading types..."></compas-loading> `;
  }

  private renderNoTypes(): TemplateResult {
    return html` <mwc-list>
      <mwc-list-item><i>No types found in CoMPAS</i></mwc-list-item>
    </mwc-list>`;
  }

  private renderTypes(): TemplateResult {
    return html` <mwc-list>
      ${this.sclTypes!.map((type) => {
        const code =
          type.getElementsByTagNameNS(this.nameSpace, "Code").item(0)!
            .textContent ?? "";
        const description =
          type.getElementsByTagNameNS(this.nameSpace, "Description").item(0)!
            .textContent ?? "";
        return html`<mwc-list-item
          tabindex="0"
          @click=${() => this.dispatchEvent(newTypeSelectedEvent(code))}
        >
          <span>${description} (${code})</span>
        </mwc-list-item>`;
      })}
    </mwc-list>`;
  }

  render(): TemplateResult {
    return !this.sclTypes
      ? this.renderLoading()
      : this.sclTypes.length <= 0
      ? this.renderNoTypes()
      : this.renderTypes();
  }
}
