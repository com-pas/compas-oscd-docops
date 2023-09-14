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

export function checkExistInCompas(
  docName: string,
  docId?: string
): Promise<boolean> {
  return new Promise((resolve) => {
    if (docId) {
      const docType = getTypeFromDocName(docName);
      CompasSclDataService()
        .listSclVersions(docType, docId)
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
