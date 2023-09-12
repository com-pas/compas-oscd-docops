import { expect, fixture, html } from "@open-wc/testing";
import "../src/CompasSave.js";
import { CompasSaveToFileElement } from "../src/CompasSave.js";

describe("compas-save-to-file", () => {
  let component: CompasSaveToFileElement;
  let doc: Document;
  const docName = "station123.scd";
  const docId = "6a45ae97-5605-44f8-b4e6-25305bc6c036";

  describe("with no document loaded", () => {
    beforeEach(async () => {
      component = await fixture(html`<compas-save-to-file></compas-save-to-file>`);
      await component.updateComplete;
    });

    it("looks like the latest snapshot", async () => {
      await expect(component).to.equalSnapshot();
    });
  });

  describe("with document loaded", () => {
    beforeEach(async () => {
      doc = await fetch("/test/testfiles/compas/save-compas.scd")
        .then((response) => response.text())
        .then((str) => new DOMParser().parseFromString(str, "application/xml"));

      component = await fixture(
        html`<compas-save-to-file
          .doc="${doc}"
          .docName="${docName}"
          .docId="${docId}"
        ></compas-save-to-file>`
      );
      await component.updateComplete;
    });

    it("looks like the latest snapshot", async () => {
      await expect(component).to.equalSnapshot();
    });
  });
});
