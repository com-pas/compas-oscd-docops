import { fixture, html } from '@open-wc/testing';

import { visualDiff } from '@web/test-runner-visual-regression';

import '../../src/compas-ui/compas-open.js';
import { CompasOpenElement } from '../../src/compas-ui/compas-open.js';

const factor = process.env.CI ? 2 : 1;

function timeout(ms: number) {
  return new Promise(res => {
    setTimeout(res, ms * factor);
  });
}

mocha.timeout(2000 * factor);

describe('compas-open', () => {
  let element: CompasOpenElement;

  beforeEach(async () => {
    element = await fixture<CompasOpenElement>(
      html`<compas-open></compas-open>`
    );
    document.body.prepend(element);
  });

  afterEach(() => element.remove());

  it('displays the dialog with an input element and a compasTitle', async () => {
    await visualDiff(element, 'compas-open');
  });

  // it('increments the counter on button click', async () => {
  //   element.shadowRoot?.querySelector('button')?.click();
  //   await timeout(100);
  //   await visualDiff(element, 'compas-open-incremented');
  // });
});
