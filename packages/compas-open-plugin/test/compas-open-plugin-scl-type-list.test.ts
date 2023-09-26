import {
  expect,
  fixtureSync,
  fixture,
  html,
  waitUntil,
} from "@open-wc/testing";

import sinon, { SinonStub } from "sinon";
import { ListItem } from "@material/mwc-list/mwc-list-item.js";
import {
  BASIC_TYPE_LIST_RESPONSE,
  stubFetchResponseFunction,
  TYPE_ENTRY_ELEMENT_NAME,
} from "./CompasSclDataServiceResponses.js";
import "@com-pas/compas-scl-type-list";
import CompasOpenMenuPlugin from "../src/compas-open-plugin.js";
import "../src/compas-open-plugin.js";

describe("compas-scltype-list", () => {
  if (customElements.get("compas-open-plugin") === undefined)
    customElements.define("compas-open-plugin", CompasOpenMenuPlugin);

  let plugin: CompasOpenMenuPlugin;
  let stub: SinonStub;
  const FETCH_FUNCTION = "fetchTypeList";

  describe("show-loading", () => {
    beforeEach(async () => {
      plugin = await fixture(html`<compas-open-plugin></compas-open-plugin>`);

      stub = stubFetchResponseFunction(
        plugin,
        FETCH_FUNCTION,
        undefined,
        TYPE_ENTRY_ELEMENT_NAME,
        () => {
          // Do nothing, so loading... will be displayed.
        }
      );

      await plugin.updateComplete;
    });

    afterEach(() => {
      sinon.restore();
    });

    it("looks like the latest snapshot", async () => {
      await expect(plugin).shadowDom.to.equalSnapshot();
    });
  });

  describe("no-items-in-list", () => {
    beforeEach(async () => {
      plugin = fixtureSync<CompasOpenMenuPlugin>(
        html`<compas-open-plugin></compas-open-plugin>`
      );

      stub = stubFetchResponseFunction(
        plugin,
        FETCH_FUNCTION,
        undefined,
        TYPE_ENTRY_ELEMENT_NAME,
        (result: Element[]) => {
          plugin.sclTypes = result;
        }
      );

      await plugin.updateComplete;
      await waitUntil(() => plugin.sclTypes !== undefined);
    });

    afterEach(() => {
      sinon.restore();
    });

    it("looks like the latest snapshot", async () => {
      await expect(
        plugin.shadowRoot?.querySelector("compas-scltype-list")
      ).shadowDom.to.equalSnapshot();
      sinon.assert.calledOnce(stub);
    });
  });

  describe("after-list-loaded", () => {
    beforeEach(async () => {
      plugin = fixtureSync<CompasOpenMenuPlugin>(
        html`<compas-open-plugin></compas-open-plugin>`
      );

      stub = stubFetchResponseFunction(
        plugin,
        FETCH_FUNCTION,
        BASIC_TYPE_LIST_RESPONSE,
        TYPE_ENTRY_ELEMENT_NAME,
        (result: Element[]) => {
          plugin.sclTypes = result;
        }
      );

      await plugin.updateComplete;
      await waitUntil(() => plugin.sclTypes !== undefined);
    });

    afterEach(() => {
      sinon.restore();
    });

    it("has 2 item entries", () => {
      expect(
        plugin.shadowRoot
          ?.querySelector("compas-scltype-list")
          ?.shadowRoot?.querySelectorAll("mwc-list > mwc-list-item")
      ).to.have.length(2);
    });

    it("selecting the first row will cause list scl method to be called", async () => {
      const eventSpy = sinon.spy();
      plugin.addEventListener("typeSelected", eventSpy);

      (<ListItem>(
        plugin.shadowRoot
          ?.querySelector("compas-scltype-list")
          ?.shadowRoot?.querySelectorAll("mwc-list > mwc-list-item")[0]
      )).click();
      await plugin.updateComplete;

      sinon.assert.calledOnce(eventSpy);
    });

    it("looks like the latest snapshot", async () => {
      await expect(plugin).shadowDom.to.equalSnapshot();
      sinon.assert.calledOnce(stub);
    });
  });
});