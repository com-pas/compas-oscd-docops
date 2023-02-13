export declare const SDS_NAMESPACE = "https://www.lfenergy.org/compas/SclDataService/v1";
export declare enum ChangeSet {
    MAJOR = "MAJOR",
    MINOR = "MINOR",
    PATCH = "PATCH"
}
export interface CreateRequestBody {
    sclName: string;
    comment: string | null;
    doc: Document;
}
export interface UpdateRequestBody {
    changeSet: ChangeSet;
    comment: string | null;
    doc: Document;
}
export declare function CompasSclDataService(): {
    listOrderedSclTypes(): Promise<Element[]>;
    listScls(type: string): Promise<Document>;
    listSclVersions(type: string, id: string): Promise<Document>;
    getSclDocument(element: Element, type: string, id: string): Promise<Document>;
    getSclDocumentVersion(element: Element, type: string, id: string, version: string): Promise<Document>;
    deleteSclDocumentVersion(type: string, id: string, version: string): Promise<string>;
    deleteSclDocument(type: string, id: string): Promise<string>;
    addSclDocument(element: Element, type: string, body: CreateRequestBody): Promise<Document>;
    updateSclDocument(element: Element, type: string, id: string, body: UpdateRequestBody): Promise<Document>;
};
