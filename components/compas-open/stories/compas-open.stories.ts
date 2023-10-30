import { html, TemplateResult } from "lit-element";
import { CompasOpenElement } from "../src/compas-open.js";
import "../src/compas-open.js";
import { parseXml } from "@com-pas/compas-open-core";
import "@material/mwc-list";
import "@material/mwc-list/mwc-list-item";
import {
  BASIC_ITEM_LIST_RESPONSE,
  BASIC_TYPE_LIST_RESPONSE,
} from "../test/CompasSclDataServiceResponses.js";

export default {
  title: "CompasOpen",
  component: "compas-open",
  argTypes: {
    allowLocalFile: { control: "boolean" },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  allowLocalFile?: boolean;
  slot?: TemplateResult;
}

const Template: Story<ArgTypes> = ({
  allowLocalFile = true,
  slot,
}: ArgTypes) => {
  if (customElements.get("compas-open") === undefined)
    customElements.define("compas-open", CompasOpenElement);

  return html` <compas-open .allowLocalFile=${allowLocalFile}>
    ${slot}
  </compas-open>`;
};

export const DefaultComponent = Template.bind({});

export const NoLocalFileAllowed = Template.bind({});
NoLocalFileAllowed.args = {
  allowLocalFile: false,
};

export const WithTypeListSlot = Template.bind({});
const typeResponse = await parseXml(BASIC_TYPE_LIST_RESPONSE);
const namespaceTypeList =
  typeResponse.querySelector("TypeListResponse")?.getAttribute("xmlns") || "";
WithTypeListSlot.args = {
  allowLocalFile: true,
  slot: html`<section slot="sclTypes">
    <mwc-list>
      ${Array.from(typeResponse.querySelectorAll("Type") ?? []).map((type) => {
        const code =
          type.getElementsByTagNameNS(namespaceTypeList, "Code").item(0)
            ?.textContent ?? "";
        const description =
          type.getElementsByTagNameNS(namespaceTypeList, "Description").item(0)
            ?.textContent ?? "";
        return html`<mwc-list-item tabindex="0">
          <span>${description} (${code})</span>
        </mwc-list-item>`;
      })}
    </mwc-list>
  </section>`,
};

export const WithFileListSlot = Template.bind({});
const itemResponse = await parseXml(BASIC_ITEM_LIST_RESPONSE);
const namespaceItemList =
  itemResponse.querySelector("ListResponse")?.getAttribute("xmlns") || "";

WithFileListSlot.args = {
  allowLocalFile: true,
  slot: html`<section slot="sclList">
    <mwc-list>
      ${Array.from(itemResponse.querySelectorAll("Item") ?? []).map((item) => {
        const id =
          item.getElementsByTagNameNS(namespaceItemList, "Id").item(0)
            ?.textContent ?? "";
        let name =
          item.getElementsByTagNameNS(namespaceItemList, "Name").item(0)
            ?.textContent ?? "";
        if (name === "") {
          name = id;
        }
        const version =
          item.getElementsByTagNameNS(namespaceItemList, "Version").item(0)
            ?.textContent ?? "";
        return html`<mwc-list-item tabindex="0">
          <span> ${name} (${version}))</span>
        </mwc-list-item>`;
      })}
    </mwc-list>
  </section>`,
};
