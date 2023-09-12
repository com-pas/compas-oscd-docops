import { expect, fixtureSync, html, waitUntil } from "@open-wc/testing";
import sinon from "sinon";

import "../src/helpers/foundation.js";
import { TextField } from "@material/mwc-textfield";
import { CompasLabelsFieldElement } from "@com-pas/compas-save-to-file";
import CompasSavePlugin from "../src/compas-save-plugin.js";

import "../src/compas-save-plugin.js";

import { addLabel } from "./test-support.js";

describe("compas-save-plugin", () => {
  if (customElements.get("compas-save-plugin") === undefined)
    customElements.define("compas-save-plugin", CompasSavePlugin);

  let element: CompasSavePlugin;
  let doc: Document;
  const docName = "station123.scd";
  const docId = "6a45ae97-5605-44f8-b4e6-25305bc6c036";

  beforeEach(async () => {
    doc = await fetch("/test/testfiles/save-compas.scd")
      .then((response) => response.text())
      .then((str) => new DOMParser().parseFromString(str, "application/xml"));
  });

  describe("still determining if document exists in CoMPAS", () => {
    beforeEach(async () => {
      element = fixtureSync(
        html`<compas-save-plugin
          .doc="${doc}"
          .docName="${docName}"
          .docId="${docId}"
        ></compas-save-plugin>`
      );

      sinon.stub(element, "checkIfExists").callsFake(async () => {
        // Do nothing so that it seems like loading from compas.
      });

      await element.updateComplete;
    });

    it("looks like the latest snapshot", async () => {
      await expect(element).shadowDom.to.equalSnapshot();
    });
  });

  describe("new document in compas", () => {
    beforeEach(async () => {
      element = fixtureSync(
        html`<compas-save-plugin
          .doc="${doc}"
          .docName="${docName}"
        ></compas-save-plugin>`
      );

      sinon.stub(element, "checkIfExists").callsFake(() => {
        element.existInCompas = false;
      });

      await element.updateComplete;
      await waitUntil(() => element.existInCompas !== undefined);
    });

    it("when the name textfield is rendered then the value will be the stripped filename", () => {
      const textField = <TextField>(
        element.shadowRoot!.querySelector("div#content > mwc-textfield#name")!
      );

      expect(textField.value).to.be.equal("station123");
    });

    it("when changing labels then SCL Document contains change", async () => {
      await validateChangingLabels();
    });

    it("looks like the latest snapshot", async () => {
      await expect(element).shadowDom.to.equalSnapshot();
    });
  });

  describe("when not allowed to save it to a local file", () => {
    beforeEach(async () => {
      element = fixtureSync(
        html`<compas-save-plugin
          .doc="${doc}"
          .docName="${docName}"
          .allowLocalFile="${false}"
        ></compas-save-plugin>`
      );

      sinon.stub(element, "checkIfExists").callsFake(() => {
        element.existInCompas = false;
      });

      await element.updateComplete;
      await waitUntil(() => element.existInCompas !== undefined);
    });

    it("looks like the latest snapshot", async () => {
      await expect(element).shadowDom.to.equalSnapshot();
    });
  });

  describe("existing document in compas", () => {
    beforeEach(async () => {
      element = fixtureSync(
        html`<compas-save-plugin
          .doc="${doc}"
          .docName="${docName}"
          .docId="${docId}"
        ></compas-save-plugin>`
      );

      sinon.stub(element, "checkIfExists").callsFake(() => {
        element.existInCompas = true;
      });

      await element.updateComplete;
      await waitUntil(() => element.existInCompas !== undefined);
    });

    it("when changing labels then SCL Document contains change", async () => {
      await validateChangingLabels();
    });

    it("looks like the latest snapshot", async () => {
      await expect(element).shadowDom.to.equalSnapshot();
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  async function validateChangingLabels(): Promise<void> {
    let labelElements = Array.from(
      element.doc.querySelectorAll(
        'SCL > Private[type="compas_scl"] > Labels > Label'
      )
    );
    expect(labelElements.length).to.be.equal(1);

    const labelsField = <CompasLabelsFieldElement>(
      element.shadowRoot!.querySelector("compas-labels-field")!
    );

    await addLabel(labelsField, "NewLabel");
    await element.updateComplete;

    element["updateLabels"]();

    labelElements = Array.from(
      element.doc.querySelectorAll(
        'SCL > Private[type="compas_scl"] > Labels > Label'
      )
    );
    expect(labelElements.length).to.be.equal(2);
  }
});
