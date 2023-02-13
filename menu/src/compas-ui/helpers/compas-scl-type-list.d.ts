import { LitElement, TemplateResult } from 'lit-element';
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
export interface TypeSelectedDetail {
    type: string;
}
export type TypeSelectedEvent = CustomEvent<TypeSelectedDetail>;
export declare function newTypeSelectedEvent(type: string): TypeSelectedEvent;
export declare class CompasSclTypeList extends LitElement {
    sclTypes: Element[] | undefined;
    nameSpace: string;
    render(): TemplateResult;
}
