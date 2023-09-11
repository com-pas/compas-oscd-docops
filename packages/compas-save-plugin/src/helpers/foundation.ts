import { LitElement } from "lit-element";
import {
  getTypeFromDocName,
  CompasSclDataService,
  NOT_FOUND_ERROR,
} from "@com-pas/compas-open-core";

/** Constructor type for defining `LitElement` mixins. */
export type LitElementConstructor = new (...args: any[]) => LitElement;

/** The type returned by `MyMixin(...)` is `Mixin<typeof MyMixin>`. */
export type Mixin<T extends (...args: any[]) => any> = InstanceType<
  ReturnType<T>
>;

export function callService(docType: string, docId: string): Promise<Document> {
  // Use the versions call to check if any exist, because then the document also exists
  // And it saves bandwidth not to retrieve the whole document.
  return CompasSclDataService().listSclVersions(docType, docId);
}
/*
export function checkExistInCompas(
  docName: string,
  docId?: string
): Promise<boolean> {
  return new Promise((resolve) => {
    if (docId) {
      const docType = getTypeFromDocName(docName);
      callService(docType, docId)
        .then(() => resolve(true))
        .catch((reason) => {
          if (reason.type === NOT_FOUND_ERROR) {
            resolve(false);
          }
        });
    } else {
      resolve(false);
    }
  });
}
*/

export function checkExistInCompas(docName: string, docId?: string): boolean {
  let exists = false;
  if (docId) {
    const docType = getTypeFromDocName(docName);
    callService(docType, docId)
      .then(() => (exists = true))
      .catch((reason) => {
        if (reason.type === NOT_FOUND_ERROR) {
          exists = false;
        }
      });
  } else {
    exists = false;
  }
  return exists;
}
