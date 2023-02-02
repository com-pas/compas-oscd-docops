import { expect, fixture, fixtureSync, html } from '@open-wc/testing';

import CompasOpenMenuPlugin from '../../src/menu/compas-open-plugin.js';
import '../../src/menu/compas-open-plugin.js';
import { Button } from '@material/mwc-button';

describe('compas-open-menu', () => {
  if (customElements.get('compas-open-plugin') === undefined)
    customElements.define('compas-open-plugin', CompasOpenMenuPlugin);

  let plugin: CompasOpenMenuPlugin;

  beforeEach(async () => {
    plugin = await fixture(html`<compas-open-plugin></compas-open-plugin>`);
    await plugin.updateComplete;
  });

  it('looks like the latest snapshot', async () => {
    await expect(plugin).shadowDom.to.equalSnapshot();
  });
  describe('When type needs to be selected', () => {
    it('looks like the latest snapshot', async () => {
      await expect(plugin).shadowDom.to.equalSnapshot();
    });
  });

  describe('When project needs to be selected', () => {
    beforeEach(async () => {
      plugin = await fixture(
        html`<compas-open-plugin .selectedType=${'SCL'}></compas-open-plugin>`
      );
      await plugin;
    });

    it('when other type selected then selectedType set to undefined', async () => {
      const button = <Button>(
        plugin.shadowRoot!.querySelector('mwc-button[id="reselect-type"]')
      );
      button.click();
      await plugin;

      expect(plugin.selectedType).to.be.undefined;
    });

    it('looks like the latest snapshot', async () => {
      await expect(plugin).shadowDom.to.equalSnapshot();
    });
  });
});
