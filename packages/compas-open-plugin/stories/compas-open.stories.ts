import { html, TemplateResult } from "lit-element";
import CompasOpenMenuPlugin from "../src/compas-open-plugin.js";
import "../src/compas-open-plugin.js";
import { parseXml } from "@com-pas/compas-open-core";
import {
  BASIC_ITEM_LIST_RESPONSE,
  BASIC_TYPE_LIST_RESPONSE,
  ITEM_LIST_WITH_LABELS_RESPONSE,
} from "../test/CompasSclDataServiceResponses.js";

const typesArray = ["IID", "SCD", "FOO", "BAR"];
const typeArray: Element[] = [];
const fileArray: Element[] = [];
const labelArray: string[] = [];
const selectedLabelArray: string[] = [];
export default {
  title: "CompasOpen",
  component: "compas-open-plugin",
  argTypes: {
    allowLocalFile: { control: "boolean" },
    selectedType: { control: "select", options: typesArray },
    sclTypes: { control: "array", options: typeArray },
    items: { control: "array", options: fileArray },
    labels: { control: "array", option: labelArray },
    selectedLabels: { control: "array", option: selectedLabelArray },
  },
};

class SBCompasOpenMenuPlugin extends CompasOpenMenuPlugin {
  firstUpdated() {
    super.run();
    super.firstUpdated();
  }
}

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  allowLocalFile?: boolean;
  selectedType?: string;
  sclTypes?: Element[];
  items?: Element[];
  labels?: string[];
  selectedLabels?: string[];
  slot?: TemplateResult;
}

const Template: Story<ArgTypes> = ({
  allowLocalFile = true,
  selectedType,
  sclTypes,
  items,
  labels,
  selectedLabels,
  slot,
}: ArgTypes) => {
  if (customElements.get("sb-compas-open-plugin") === undefined)
    customElements.define("sb-compas-open-plugin", SBCompasOpenMenuPlugin);

  return html` <sb-compas-open-plugin
    .allowLocalFile=${allowLocalFile}
    .selectedType=${selectedType}
    .sclTypes=${sclTypes}
    .items=${items}
    .labels=${labels}
    .selectedLabels=${selectedLabels}
  >
    ${slot}
  </sb-compas-open-plugin>`;
};

export const LoadingTypesList = Template.bind({});

export const WithTypesList = Template.bind({});
const typeResponse = await parseXml(BASIC_TYPE_LIST_RESPONSE);
WithTypesList.args = {
  allowLocalFile: true,
  labels: [],
  selectedLabels: [],
  selectedType: undefined,
  sclTypes: Array.from(typeResponse.querySelectorAll("Type") ?? []),
  items: [],
};

export const SelectedTypeLoadingFileList = Template.bind({});
SelectedTypeLoadingFileList.args = {
  allowLocalFile: true,
  selectedType: "SCD",
};

export const EmptyFileList = Template.bind({});
EmptyFileList.args = {
  allowLocalFile: true,
  selectedType: "SCD",
  items: [],
};

export const WithFileListAndNoLabels = Template.bind({});
const itemResponse = await parseXml(BASIC_ITEM_LIST_RESPONSE);

WithFileListAndNoLabels.args = {
  allowLocalFile: true,
  labels: [],
  selectedLabels: [],
  selectedType: "SCD",
  sclTypes: Array.from(typeResponse.querySelectorAll("Type") ?? []),
  items: Array.from(itemResponse.querySelectorAll("Item") ?? []),
};

export const WithFileListAndLabels = Template.bind({});
const itemWithLabelsResponse = await parseXml(ITEM_LIST_WITH_LABELS_RESPONSE);
const foundLabels = [
  ...new Set(
    Array.from(
      itemWithLabelsResponse.querySelectorAll("Item > Label") ?? []
    ).map((label) => label.textContent || "")
  ),
];
WithFileListAndLabels.args = {
  allowLocalFile: true,
  selectedType: "SCD",
  sclTypes: Array.from(typeResponse.querySelectorAll("Type") ?? []),
  items: Array.from(itemWithLabelsResponse.querySelectorAll("Item") ?? []),
  labels: foundLabels,
  selectedLabels: foundLabels,
};

export const WithFileListAndLabelSelected = Template.bind({});
WithFileListAndLabelSelected.args = {
  allowLocalFile: true,
  selectedType: "SCD",
  sclTypes: Array.from(typeResponse.querySelectorAll("Type") ?? []),
  items: Array.from(itemWithLabelsResponse.querySelectorAll("Item") ?? []),
  labels: foundLabels,
  selectedLabels: [foundLabels[1]],
};
