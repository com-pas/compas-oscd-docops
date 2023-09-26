import {
  buildDocName,
  getTypeFromDocName,
  stripExtensionFromName,
  updateDocumentInOpenSCD,
} from "./foundation";
import {
  COMPAS_SCL_PRIVATE_TYPE,
  createPrivate,
  getPrivate,
  COMPAS_LABELS_MAXIMUM,
  COMPAS_NAMESPACE,
  createLabel,
  createLabels,
  getLabels,
} from "./compas-private.js";
import {
  CompasSclDataService,
  SDS_NAMESPACE,
  ChangeSet,
} from "./service/CompasSclDataService";
import { parseXml, NOT_FOUND_ERROR } from "./service/helpers/foundation";
import { saveDocumentToFile } from "./service/helpers/file";

export {
  buildDocName,
  getTypeFromDocName,
  stripExtensionFromName,
  updateDocumentInOpenSCD,
  COMPAS_SCL_PRIVATE_TYPE,
  createPrivate,
  getPrivate,
  COMPAS_LABELS_MAXIMUM,
  COMPAS_NAMESPACE,
  createLabel,
  createLabels,
  getLabels,
  ChangeSet,
  CompasSclDataService,
  SDS_NAMESPACE,
  parseXml,
  NOT_FOUND_ERROR,
  saveDocumentToFile,
};
