import { fixture } from "@open-wc/testing";
import { html } from "lit";
import { visualDiff } from "@web/test-runner-visual-regression";

import "../src/CompasSave.js";
import type { CompasSaveElement } from "../src/CompasSave.js";

const factor = process.env.CI ? 2 : 1;

function timeout(ms: number) {
  return new Promise((res) => {
    setTimeout(res, ms * factor);
  });
}

mocha.timeout(2000 * factor);

describe("compas-save", () => {
  let element: CompasSaveElement;
  let doc: Document;
  const docName = "station123.scd";
  const docId = "6a45ae97-5605-44f8-b4e6-25305bc6c036";

  describe("with no document loaded", () => {
    beforeEach(async () => {
      element = await fixture<CompasSaveElement>(
        html`<compas-save></compas-save>`
      );
      document.body.prepend(element);
    });

    afterEach(() => element.remove());

    it("displays default compas-save element", async () => {
      await element.updateComplete;
      await timeout(500);
      await visualDiff(element, "compas-save-without-doc");
    });
  });
  describe("with document loaded", () => {
    beforeEach(async () => {
      doc = await fetch("/test/testfiles/compas/save-compas.scd")
        .then((response) => response.text())
        .then((str) => new DOMParser().parseFromString(str, "application/xml"));

      element = await fixture<CompasSaveElement>(
        html`<compas-save
          .doc="${doc}"
          .docName="${docName}"
          .docId="${docId}"
        ></compas-save>`
      );
      document.body.prepend(element);
    });
    afterEach(() => element.remove());
    it("displays default compas-save element", async () => {
      await element.updateComplete;
      await timeout(500);
      await visualDiff(element, "compas-save-with-doc");
    });
  });
});
