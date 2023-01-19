import { fixture } from '@open-wc/testing';
import { html } from 'lit';

import { visualDiff } from '@web/test-runner-visual-regression';

import './compas-open.js';
import type { CompasOpen } from './compas-open.js';

const factor = process.env.CI ? 2 : 1;

function timeout(ms: number) {
  return new Promise(res => {
    setTimeout(res, ms * factor);
  });
}

mocha.timeout(2000 * factor);

describe('compas-open', () => {
  let element: CompasOpen;

  beforeEach(async () => {
    element = await fixture(
      html`<compas-open title="Test Title" counter="41"></compas-open>`
    );
    document.body.prepend(element);
  });

  afterEach(() => element.remove());

  it('displays the title and counter', async () => {
    await visualDiff(element, 'compas-open');
  });

  it('increments the counter on button click', async () => {
    element.shadowRoot?.querySelector('button')?.click();
    await timeout(100);
    await visualDiff(element, 'compas-open-incremented');
  });
});
