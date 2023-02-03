import {
  expect,
  fixtureSync,
  fixture,
  html,
  waitUntil,
} from '@open-wc/testing';
import sinon, { SinonStub } from 'sinon';
import { ListItem } from '@material/mwc-list/mwc-list-item';

import {
  BASIC_ITEM_LIST_RESPONSE,
  ITEM_ENTRY_ELEMENT_NAME,
  ITEM_LIST_WITH_LABELS_RESPONSE,
  stubFetchResponseFunction,
} from './CompasSclDataServiceResponses.js';
import { CompasSclList } from '../../src/compas-ui/compas-scl-list.js';

import '../../src/compas-ui/compas-scl-list.js';

import CompasOpenMenuPlugin from '../../src/menu/compas-open-plugin.js';
import '../../src/menu/compas-open-plugin.js';

describe('compas-open-menu with compas-scl-list', () => {
  if (customElements.get('compas-open-plugin') === undefined)
    customElements.define('compas-open-plugin', CompasOpenMenuPlugin);

  let plugin: CompasOpenMenuPlugin;

  const FETCH_FUNCTION = 'fetchList';
  let stub: SinonStub;

  describe('when list still needs to be loaded', () => {
    beforeEach(async () => {
      plugin = await fixture(html`<compas-open-plugin .selectedType=${'IID'}>
      </compas-open-plugin>`);
      stub = stubFetchResponseFunction(
        plugin,
        FETCH_FUNCTION,
        undefined,
        ITEM_ENTRY_ELEMENT_NAME,
        () => {
          // Do nothing, so loading... will be displayed.
        }
      );
      await plugin.updateComplete;
    });
    afterEach(() => {
      sinon.restore();
    });
    it('looks like the latest snapshot', async () => {
      await expect(plugin).shadowDom.to.equalSnapshot();
    });
  });

  describe('when there are no items found in CoMPAS', () => {
    beforeEach(async () => {
      plugin = await fixtureSync<CompasOpenMenuPlugin>(
        html`<compas-open-plugin
          .selectedType=${'IID'}
          .items=${new Array(0)}
        ></compas-open-plugin>`
      );

      console.log('plugin.items', plugin['items']);
      await plugin.updateComplete;
      await waitUntil(() => {
        console.log(plugin);
        return plugin['items'] !== undefined;
      });
    });

    afterEach(() => {
      sinon.restore();
    });

    it('looks like the latest snapshot', async () => {
      await expect(
        plugin.shadowRoot?.querySelector('compas-scl-list')
      ).shadowDom.to.equalSnapshot();
    });

    it('displays a message warning that there are no items', () => {
      expect(
        plugin.shadowRoot
          ?.querySelector('compas-scl-list')
          ?.shadowRoot?.querySelector('mwc-list-item')?.textContent
      ).to.equals('No projects found in CoMPAS');
    });
  });
  // describe('when there are items with labels', () => {
  //   beforeEach(async () => {
  //     plugin = fixtureSync(
  //       html`<compas-open-plugin .selectedType="IID"></compas-open-plugin>`
  //     );

  //     stub = stubFetchResponseFunction(
  //       plugin,
  //       FETCH_FUNCTION,
  //       ITEM_LIST_WITH_LABELS_RESPONSE,
  //       ITEM_ENTRY_ELEMENT_NAME,
  //       (result: Element[]) => {
  //         plugin['items'] = result;

  //         const labels = Array.from(
  //           new Set(
  //             result
  //               .map(item => Array.from(item.querySelectorAll('Label')))
  //               .flatMap(label => label)
  //               .filter(label => !!label)
  //               .map(label => label!.textContent)
  //               .filter(labelValue => !!labelValue)
  //               .sort((label1, label2) =>
  //                 label1!.localeCompare(label2!)
  //               ) as string[]
  //           )
  //         );
  //         if (labels) {
  //           plugin['labels'] = labels;
  //           plugin['selectedLabels'] = labels;
  //         }
  //       }
  //     );

  //     await element;
  //     await waitUntil(() => element['items'] !== undefined);
  //   });

  //   afterEach(() => {
  //     sinon.restore();
  //   });

  //   it('has 3 labels found', () => {
  //     expect(element['labels']).to.have.length(3);
  //     expect(element['selectedLabels']).to.have.length(3);
  //   });

  //   it('filter button for labels is enabled', () => {
  //     expect(
  //       element.shadowRoot!.querySelector('oscd-filter-button#labelsFilter')
  //     ).to.have.not.attribute('disabled');
  //   });

  //   it('has 2 item entries', () => {
  //     expect(
  //       element.shadowRoot!.querySelectorAll('filtered-list > mwc-list-item')
  //     ).to.have.length(2);
  //   });

  //   it('when filtering on labels only 1 item is shown', async () => {
  //     const filterButton = <HTMLElement>(
  //       element.shadowRoot!.querySelector('oscd-filter-button#labelsFilter')
  //     );
  //     (<HTMLElement>(
  //       filterButton.shadowRoot!.querySelector('mwc-icon-button')
  //     )).click();
  //     await element.updateComplete;

  //     Array.from(
  //       element.shadowRoot!.querySelectorAll(
  //         'oscd-filter-button#labelsFilter > mwc-check-list-item'
  //       )
  //     )
  //       .filter(element => element.getAttribute('value') !== 'Amsterdam')
  //       .forEach(element => (<HTMLElement>element).click());
  //     (<HTMLElement>(
  //       filterButton.shadowRoot!.querySelector(
  //         'mwc-button[slot="primaryAction"]'
  //       )
  //     )).click();
  //     await element.updateComplete;

  //     expect(
  //       element.shadowRoot!.querySelectorAll('filtered-list > mwc-list-item')
  //     ).to.have.length(1);
  //     await expect(element).shadowDom.to.equalSnapshot();
  //   });

  //   it('when filtering on labels and all items are hidden', async () => {
  //     const filterButton = <HTMLElement>(
  //       element.shadowRoot!.querySelector('oscd-filter-button#labelsFilter')
  //     );
  //     (<HTMLElement>(
  //       filterButton.shadowRoot!.querySelector('mwc-icon-button')
  //     )).click();
  //     await element.updateComplete;

  //     Array.from(
  //       element.shadowRoot!.querySelectorAll(
  //         'oscd-filter-button#labelsFilter > mwc-check-list-item'
  //       )
  //     ).forEach(element => (<HTMLElement>element).click());
  //     (<HTMLElement>(
  //       filterButton.shadowRoot!.querySelector(
  //         'mwc-button[slot="primaryAction"]'
  //       )
  //     )).click();
  //     await element.updateComplete;

  //     await expect(element).shadowDom.to.equalSnapshot();
  //   });

  //   it('looks like the latest snapshot', async () => {
  //     await expect(element).shadowDom.to.equalSnapshot();
  //     sinon.assert.calledOnce(stub);
  //   });
  // });
});
