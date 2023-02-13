import { LitElement, TemplateResult } from 'lit-element';
import '@material/mwc-button';
export interface DocRetrievedDetail {
    localFile: boolean;
    doc: Document;
    docName: string;
    docId?: string;
}
export type DocRetrievedEvent = CustomEvent<DocRetrievedDetail>;
export declare function newDocRetrievedEvent(localFile: boolean, doc: Document, docName: string, docId?: string): DocRetrievedEvent;
export declare class CompasOpenElement extends LitElement {
    allowLocalFile: boolean;
    private sclFileUI;
    private getSclFile;
    private renderFileSelect;
    render(): TemplateResult;
}
