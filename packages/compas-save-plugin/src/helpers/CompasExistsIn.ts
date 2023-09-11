import { PropertyValues, property, state } from "lit-element";
import { LitElementConstructor, Mixin } from "./foundation";

import {
  getTypeFromDocName,
  CompasSclDataService,
  NOT_FOUND_ERROR,
} from "@com-pas/compas-open-core";

export type CompasExistsInElement = Mixin<typeof CompasExistsIn>;

export const CompasExistsIn = <TBase extends LitElementConstructor>(
  Base: TBase
) => {
  class CompasExistsInElement extends Base {
    @property()
    docName!: string;
    @property()
    docId?: string;

    @state()
    existInCompas?: boolean;

    firstUpdated(): void {
      this.checkExistInCompas();
    }

    protected updated(_changedProperties: PropertyValues): void {
      super.updated(_changedProperties);

      if (_changedProperties.has("docId")) {
        this.existInCompas = undefined;
        this.checkExistInCompas();
      }
    }

    callService(docType: string, docId: string): Promise<Document> {
      // Use the versions call to check if any exist, because then the document also exists
      // And it saves bandwidth not to retrieve the whole document.
      return CompasSclDataService().listSclVersions(docType, docId);
    }

    checkExistInCompas(): void {
      if (this.docId) {
        const docType = getTypeFromDocName(this.docName);
        this.callService(docType, this.docId)
          .then(() => (this.existInCompas = true))
          .catch((reason) => {
            if (reason.type === NOT_FOUND_ERROR) {
              this.existInCompas = false;
            }
          });
      } else {
        this.existInCompas = false;
      }
    }
  }

  return CompasExistsInElement as TBase;
};
