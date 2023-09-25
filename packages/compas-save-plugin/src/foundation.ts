import {
  getTypeFromDocName,
  CompasSclDataService,
  NOT_FOUND_ERROR,
} from "@com-pas/compas-open-core";

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
