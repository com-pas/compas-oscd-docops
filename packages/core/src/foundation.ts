import { newOpenEvent } from "@openscd/open-scd-core";
import {
  COMPAS_SCL_PRIVATE_TYPE,
  getCompasSclFileType,
  getCompasSclName,
  getPrivate,
} from "./compas-private.js";

const FILE_EXTENSION_LENGTH = 3;

export function getTypeFromDocName(docName: string): string {
  if (
    docName.lastIndexOf(".") ==
    docName.length - (FILE_EXTENSION_LENGTH + 1)
  ) {
    return docName.substring(docName.lastIndexOf(".") + 1).toUpperCase();
  }
  throw new Error("compas type error");
}

export function stripExtensionFromName(docName: string): string {
  let name = docName;
  // Check if the name includes a file extension, if the case remove it.
  if (
    name.length > FILE_EXTENSION_LENGTH &&
    name.lastIndexOf(".") == name.length - (FILE_EXTENSION_LENGTH + 1)
  ) {
    name = name.substring(0, name.lastIndexOf("."));
  }
  return name;
}

export function buildDocName(sclElement: Element): string {
  const headerElement = sclElement.querySelector(":scope > Header");
  const privateElement = getPrivate(sclElement, COMPAS_SCL_PRIVATE_TYPE);

  const version = headerElement?.getAttribute("version") ?? "";
  const name = getCompasSclName(privateElement)?.textContent ?? "";
  const type = getCompasSclFileType(privateElement)?.textContent ?? "SCD";

  let docName = name;
  if (docName === "") {
    docName = headerElement?.getAttribute("id") ?? "";
  }
  docName += `-${version}.${type?.toLowerCase()}`;
  return docName;
}

export function updateDocumentInOpenSCD(
  element: Element,
  doc: Document,
  docName?: string
): void {
  const headerElement = doc.querySelector(":root > Header");
  const id = headerElement?.getAttribute("id") ?? "";

  // element.dispatchEvent(newLogEvent({ kind: 'reset' })); // TODO: figure out logging
  element.dispatchEvent(
    newOpenEvent(doc, docName ? docName : buildDocName(doc.documentElement))
  );
}