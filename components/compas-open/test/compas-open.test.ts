import { fixture } from "@open-wc/testing";
import { html } from "lit";
import { visualDiff } from "@web/test-runner-visual-regression";

import "../src/CompasOpen.js";
import type { CompasOpenElement } from "../src/CompasOpen.js";

const factor = process.env.CI ? 2 : 1;

function timeout(ms: number) {
  return new Promise((res) => {
    setTimeout(res, ms * factor);
  });
}

mocha.timeout(2000 * factor);

describe("compas-open", () => {
  let element: CompasOpenElement;

  beforeEach(async () => {
    element = await fixture<CompasOpenElement>(
      html`<compas-open></compas-open>`
    );
    document.body.prepend(element);
  });

  afterEach(() => element.remove());

  it("displays the dialog with an input element and a compasTitle", async () => {
    await element.updateComplete;
    await timeout(500);
    await visualDiff(element, "compas-open");
  });
});
