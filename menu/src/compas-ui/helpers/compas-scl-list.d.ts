import { LitElement, TemplateResult } from 'lit-element';
import '@material/mwc-icon';
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import '../../to-be-made-a-dependency/filtered-list.js';
import '../../to-be-made-a-dependency/oscd-filter-button.js';
export interface SclSelectedDetail {
    docId: string;
}
export type SclSelectedEvent = CustomEvent<SclSelectedDetail>;
export declare function newSclSelectedEvent(docId: string): SclSelectedEvent;
export declare class CompasSclList extends LitElement {
    type?: string;
    nameSpace: string;
    private items?;
    private labels;
    private selectedLabels;
    private get filteredItems();
    render(): TemplateResult;
    static styles: import("lit-element").CSSResult;
}
