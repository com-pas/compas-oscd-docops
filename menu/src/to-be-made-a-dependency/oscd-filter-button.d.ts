import { TemplateResult } from 'lit-element';
import '@material/mwc-icon-button';
import '@material/mwc-dialog';
import './filtered-list.js';
import { FilteredList } from './filtered-list.js';
/**
 * A mwc-list with mwc-textfield that filters the list items for given or separated terms
 */
export declare class FilterButton extends FilteredList {
    header: TemplateResult | string;
    icon: string;
    disabled: boolean;
    private filterDialog;
    private toggleList;
    private onClosing;
    render(): TemplateResult;
    static styles: import("lit-element").CSSResult;
}
export interface SelectedItemsChangedDetail {
    selectedItems: string[];
}
export type SelectedItemsChangedEvent = CustomEvent<SelectedItemsChangedDetail>;
declare global {
    interface ElementEventMap {
        ['selected-items-changed']: SelectedItemsChangedEvent;
    }
}
