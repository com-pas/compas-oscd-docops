import { html, TemplateResult } from 'lit-element';
import CompasOpenMenuPlugin from './compas-open-plugin';
import './compas-open-plugin.js';

const typesArray = ['IID', 'SCD', 'FOO', 'BAR'];
export default {
  title: 'CompasOpen',
  component: 'compas-open-plugin',
  argTypes: {
    allowLocalFile: { control: 'boolean' },
    selectedType: { control: 'select', options: typesArray },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  allowLocalFile?: boolean;
  selectedType?: string;
  slot?: TemplateResult;
}

const Template: Story<ArgTypes> = ({
  allowLocalFile = true,
  selectedType,
  slot,
}: ArgTypes) => {
  if (customElements.get('compas-open-plugin') === undefined)
    customElements.define('compas-open-plugin', CompasOpenMenuPlugin);

  return html` <compas-open-plugin
    .allowLocalFile=${allowLocalFile}
    .selectedType=${selectedType}
  >
    ${slot}
  </compas-open-plugin>`;
};

export const Regular = Template.bind({});

export const SelectedType = Template.bind({});
SelectedType.args = {
  allowLocalFile: true,
  selectedType: 'SCD_Test',
};

// export const CustomCounter = Template.bind({});
// CustomCounter.args = {
//   counter: 123456,
// };
