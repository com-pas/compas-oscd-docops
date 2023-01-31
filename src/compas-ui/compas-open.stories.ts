import { html, TemplateResult } from 'lit-element';

import './compas-open.js';

export default {
  title: 'CompasOpen',
  component: 'compas-open',
  argTypes: {
    allowLocalFile: { control: 'boolean' },
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
}: ArgTypes) => html`
  <compas-open .allowLocalFile=${allowLocalFile}> ${slot} </compas-open>
`;

export const Regular = Template.bind({});

// export const CustomTitle = Template.bind({});
// CustomTitle.args = {
//   title: 'My title',
// };

// export const CustomCounter = Template.bind({});
// CustomCounter.args = {
//   counter: 123456,
// };
