import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';

import './compas-open.js';
import type { OscdComponent } from './compas-open.js';

describe('OscdComponent', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el = await fixture<OscdComponent>(html`<compas-open></compas-open>`);

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el = await fixture<OscdComponent>(html`<compas-open></compas-open>`);
    el.shadowRoot!.querySelector('button')!.click();

    expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el = await fixture<OscdComponent>(
      html`<compas-open title="attribute title"></compas-open>`
    );

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<OscdComponent>(html`<compas-open></compas-open>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
