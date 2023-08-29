import { expect, fixtureSync, html } from "@open-wc/testing";

import { CompasOpenElement } from "../src/CompasOpen.js";
import "../src/CompasOpen.js";

describe("compas-open", () => {
  let element: CompasOpenElement;

  describe("When type needs to be selected", () => {
    beforeEach(async () => {
      element = fixtureSync(html`<compas-open></compas-open>`);
      await element;
    });

    it("looks like the latest snapshot", async () => {
      await expect(element).shadowDom.to.equalSnapshot();
    });
  });

  describe("When no local file can be selected", () => {
    beforeEach(async () => {
      element = fixtureSync(
        html`<compas-open .allowLocalFile="${false}"></compas-open>`
      );
      await element;
    });

    it("looks like the latest snapshot", async () => {
      await expect(element.shadowRoot?.querySelector("#scl-file")).to.be.null;
    });
  });
});
