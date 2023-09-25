import { html, LitElement, TemplateResult } from "lit-element";
import { ListItemBase } from "@material/mwc-list/mwc-list-item-base";

import "@material/mwc-list";
import "@material/mwc-list/mwc-radio-list-item";

import { ChangeSet } from "@com-pas/compas-open-core";

type ChangeSetDetail = {
  translationKey: string;
};
const changeSetDetails = new Map<ChangeSet, ChangeSetDetail>([
  [ChangeSet.MAJOR, { translationKey: "Major change" }],
  [ChangeSet.MINOR, { translationKey: "Minor change" }],
  [ChangeSet.PATCH, { translationKey: "Patch change" }],
]);

export class CompasChangeSetRadiogroup extends LitElement {
  private getSelectedListItem(): ListItemBase | null {
    return <ListItemBase>this.shadowRoot!.querySelector("mwc-list")!.selected;
  }

  getSelectedValue(): ChangeSet | null {
    const changeSet = this.getSelectedListItem();
    if (changeSet) {
      return <ChangeSet>changeSet.value;
    }
    return null;
  }

  valid(): boolean {
    return this.getSelectedListItem() !== null;
  }

  render(): TemplateResult {
    return html`
      <mwc-list activatable>
        ${Object.values(ChangeSet).map(
          (key) =>
            html`<mwc-radio-list-item value="${key}" left>
              ${changeSetDetails.get(key)!.translationKey}
            </mwc-radio-list-item>`
        )}
      </mwc-list>
    `;
  }
}
