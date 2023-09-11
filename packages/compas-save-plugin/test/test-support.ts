import { Button } from "@material/mwc-button";

import { OscdTextfield } from "@openscd/oscd-textfield";
import { CompasLabelsFieldElement } from "@com-pas/compas-save";

export async function addLabel(
  element: CompasLabelsFieldElement,
  value: string
): Promise<void> {
  const newLabelField = <OscdTextfield>(
    element.shadowRoot!.querySelector("oscd-textfield#newLabel")!
  );
  newLabelField.value = value;
  await element.updateComplete;

  const addButton = <Button>(
    element.shadowRoot!.querySelector('mwc-icon-button[icon="new_label"]')!
  );
  await addButton.click();
  await element.updateComplete;
}

export async function removeLabel(
  element: CompasLabelsFieldElement,
  value: string
): Promise<void> {
  const removeButton = <Button>Array.from(
    element.shadowRoot!.querySelectorAll("mwc-list > mwc-list-item")
  )
    .filter(
      (item) =>
        !!Array.from(item.querySelectorAll("span")).find((element) =>
          element.textContent!.includes(value)
        )
    )
    .map((item) => item.querySelector('mwc-icon-button[icon="delete"]'))[0];

  removeButton.click();
  await element.updateComplete;
}
