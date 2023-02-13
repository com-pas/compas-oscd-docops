import { LitElement, TemplateResult } from 'lit-element';
import { Dialog } from '@material/mwc-dialog';
import '../compas-ui/compas-open.js';
import '../compas-ui/helpers/compas-scl-list.js';
import '../compas-ui/helpers/compas-scl-type-list.js';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import '@material/mwc-icon';
import '@material/mwc-dialog';
export default class CompasOpenMenuPlugin extends LitElement {
    dialog: Dialog;
    allowLocalFile: boolean;
    selectedType: string | undefined;
    sclTypes: Element[];
    items: Element[];
    labels: string[];
    selectedLabels: string[];
    run(): Promise<void>;
    firstUpdated(): void;
    fetchTypeList(): void;
    fetchList(): void;
    private getSclDocument;
    private openDoc;
    renderSclTypeList(): TemplateResult;
    renderSclList(): TemplateResult;
    render(): TemplateResult;
    static styles: import("lit-element").CSSResult;
}
