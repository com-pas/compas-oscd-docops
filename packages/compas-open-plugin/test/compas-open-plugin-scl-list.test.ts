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
  BASIC_ITEM_LIST_RESPONSE,
  ITEM_ENTRY_ELEMENT_NAME,
  ITEM_LIST_WITH_LABELS_RESPONSE,
  stubFetchResponseFunction,
} from "./CompasSclDataServiceResponses.js";
import "@com-pas/compas-scl-list";

import CompasOpenMenuPlugin from "../src/compas-open-plugin.js";
import "../src/compas-open-plugin.js";

describe("compas-open-menu with compas-scl-list", () => {
  if (customElements.get("compas-open-plugin") === undefined)
    customElements.define("compas-open-plugin", CompasOpenMenuPlugin);

  let plugin: CompasOpenMenuPlugin;

  const FETCH_FUNCTION = "fetchList";
  let stub: SinonStub;

  describe("when list still needs to be loaded", () => {
    beforeEach(async () => {
      plugin = await fixture(html`<compas-open-plugin .selectedType=${"IID"}>
      </compas-open-plugin>`);
      stub = stubFetchResponseFunction(
        plugin,
        FETCH_FUNCTION,
        undefined,
        ITEM_ENTRY_ELEMENT_NAME,
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

  describe("when there are no items found in CoMPAS", () => {
    beforeEach(async () => {
      plugin = await fixtureSync<CompasOpenMenuPlugin>(
        html`<compas-open-plugin
          .selectedType=${"IID"}
          .items=${new Array(0)}
        ></compas-open-plugin>`
      );

      await plugin.updateComplete;
      await waitUntil(() => {
        return plugin["items"] !== undefined;
      });
    });

    afterEach(() => {
      sinon.restore();
    });

    it("looks like the latest snapshot", async () => {
      await expect(
        plugin.shadowRoot?.querySelector("compas-scl-list")
      ).shadowDom.to.equalSnapshot();
    });

    it("displays a message warning that there are no items", () => {
      expect(
        plugin.shadowRoot
          ?.querySelector("compas-scl-list")
          ?.shadowRoot?.querySelector("mwc-list-item")?.textContent
      ).to.equals("No projects found in CoMPAS");
    });
  });

  describe("when there are items without labels", () => {
    beforeEach(async () => {
      plugin = fixtureSync<CompasOpenMenuPlugin>(
        html`<compas-open-plugin .selectedType=${"IID"}></compas-open-plugin>`
      );

      stub = stubFetchResponseFunction(
        plugin,
        FETCH_FUNCTION,
        BASIC_ITEM_LIST_RESPONSE,
        ITEM_ENTRY_ELEMENT_NAME,
        (result: Element[]) => {
          plugin["items"] = result;
        }
      );

      await plugin.updateComplete;
      await waitUntil(() => plugin["items"] !== undefined);
    });

    afterEach(() => {
      sinon.restore();
    });

    it("has 2 item entries", () => {
      expect(
        plugin.shadowRoot
          ?.querySelector("compas-scl-list")
          ?.shadowRoot?.querySelectorAll("oscd-filtered-list > mwc-list-item")
      ).to.have.length(2);
    });

    it("filter button for labels is disabled", () => {
      expect(
        plugin.shadowRoot
          ?.querySelector("compas-scl-list")
          ?.shadowRoot?.querySelector("oscd-filter-button#labelsFilter")
      ).to.have.attribute("disabled");
    });

    it("selecting the first row will cause open scl method to be called", async () => {
      const eventSpy = sinon.spy();
      plugin.addEventListener("scl-selected", eventSpy);

      (<ListItem>(
        plugin.shadowRoot
          ?.querySelector("compas-scl-list")
          ?.shadowRoot?.querySelectorAll(
            "oscd-filtered-list > mwc-list-item"
          )[0]
      )).click();
      await plugin.updateComplete;

      sinon.assert.calledOnce(eventSpy);
    });

    it("looks like the latest snapshot", async () => {
      await expect(plugin).shadowDom.to.equalSnapshot();
      sinon.assert.calledOnce(stub);
    });
  });

  describe("when there are items with labels", () => {
    beforeEach(async () => {
      plugin = fixtureSync<CompasOpenMenuPlugin>(
        html`<compas-open-plugin .selectedType=${"IID"}></compas-open-plugin>`
      );

      stub = stubFetchResponseFunction(
        plugin,
        FETCH_FUNCTION,
        ITEM_LIST_WITH_LABELS_RESPONSE,
        ITEM_ENTRY_ELEMENT_NAME,
        (result: Element[]) => {
          plugin["items"] = result;

          const labels = Array.from(
            new Set(
              result
                .map((item) => Array.from(item.querySelectorAll("Label")))
                .flatMap((label) => label)
                .filter((label) => !!label)
                .map((label) => label!.textContent)
                .filter((labelValue) => !!labelValue)
                .sort((label1, label2) =>
                  label1!.localeCompare(label2!)
                ) as string[]
            )
          );
          if (labels) {
            plugin["labels"] = labels;
            plugin["selectedLabels"] = labels;
          }
        }
      );

      await plugin.updateComplete;
      await waitUntil(() => plugin["items"] !== undefined);
    });

    afterEach(() => {
      sinon.restore();
    });

    it("has 3 labels found", () => {
      expect(plugin["labels"]).to.have.length(3);
      expect(plugin["selectedLabels"]).to.have.length(3);
    });

    it("filter button for labels is enabled", () => {
      expect(
        plugin.shadowRoot
          ?.querySelector("compas-scl-list")
          ?.shadowRoot?.querySelector("oscd-filter-button#labelsFilter")
      ).shadowDom.to.have.not.attribute("disabled");
    });

    it("has 2 item entries", () => {
      expect(
        plugin.shadowRoot
          ?.querySelector("compas-scl-list")
          ?.shadowRoot?.querySelectorAll("oscd-filtered-list > mwc-list-item")
      ).to.have.length(2);
    });

    it("when filtering on labels only 1 item is shown", async () => {
      const filterButton = <HTMLElement>(
        plugin.shadowRoot
          ?.querySelector("compas-scl-list")
          ?.shadowRoot?.querySelector("oscd-filter-button#labelsFilter")
      );
      (<HTMLElement>(
        filterButton.shadowRoot!.querySelector("mwc-icon-button")
      )).click();
      await plugin.updateComplete;

      Array.from(filterButton.querySelectorAll("mwc-check-list-item"))
        .filter((plugin) => plugin.getAttribute("value") !== "Amsterdam")
        .forEach((plugin) => (<HTMLElement>plugin).click());
      (<HTMLElement>(
        filterButton.shadowRoot!.querySelector(
          'mwc-button[slot="primaryAction"]'
        )
      )).click();
      await plugin.updateComplete;

      expect(
        plugin.shadowRoot
          ?.querySelector("compas-scl-list")
          ?.shadowRoot?.querySelectorAll("oscd-filtered-list > mwc-list-item")
      ).to.have.length(1);
      await expect(plugin).shadowDom.to.equalSnapshot();
    });

    it("when filtering on labels and all items are hidden", async () => {
      const filterButton = <HTMLElement>(
        plugin.shadowRoot
          ?.querySelector("compas-scl-list")
          ?.shadowRoot?.querySelector("oscd-filter-button#labelsFilter")
      );
      (<HTMLElement>(
        filterButton.shadowRoot!.querySelector("mwc-icon-button")
      )).click();
      await plugin.updateComplete;

      Array.from(
        plugin.shadowRoot!.querySelectorAll(
          "oscd-filter-button#labelsFilter > mwc-check-list-item"
        )
      ).forEach((plugin) => (<HTMLElement>plugin).click());
      (<HTMLElement>(
        filterButton.shadowRoot!.querySelector(
          'mwc-button[slot="primaryAction"]'
        )
      )).click();
      await plugin.updateComplete;

      await expect(plugin).shadowDom.to.equalSnapshot();
    });

    it("looks like the latest snapshot", async () => {
      await expect(plugin).shadowDom.to.equalSnapshot();
      sinon.assert.calledOnce(stub);
    });
  });
});