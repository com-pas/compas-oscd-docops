import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  property,
} from 'lit-element';
import { translate } from 'lit-translate';

import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';

@customElement('compas-loading')
export class CompasLoadingElement extends LitElement {
  @property()
  message: string | undefined;

  render(): TemplateResult {
    return html`
      <mwc-list>
        <mwc-list-item
          ><i
            >${this.message ?? translate('compas.loading.default')}</i
          ></mwc-list-item
        >
      </mwc-list>
    `;
  }
}
