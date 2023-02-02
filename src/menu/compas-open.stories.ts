import { html, TemplateResult } from 'lit-element';
import './compas-open-plugin.js';

export default {
  title: 'CompasOpen',
  component: 'compas-open-plugin',
  argTypes: {
    allowLocalFile: { control: 'boolean' },
    selectedType: { control: 'string' },
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
  selectedType = undefined,
  slot,
}: ArgTypes) => html`
  <compas-open-plugin
    .allowLocalFile=${allowLocalFile}
    .selectedType=${selectedType}
  >
    ${slot}
  </compas-open-plugin>
`;

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
