import { expect, fixture, html } from '@open-wc/testing';

import '../../src/compas-ui/compas-open.js';
import type { CompasOpenElement } from '../../src/compas-ui/compas-open.js';

describe('CompasOpen', () => {
  it('has a default allowLocalFile value', async () => {
    const el = await fixture<CompasOpenElement>(
      html`<compas-open></compas-open>`
    );

    expect(el.allowLocalFile).to.equal(true);
  });
});
