import "./compas-save-to-file.js";
import { CompasSaveToFileElement, newSaveToFileEvent } from "./compas-save-to-file.js";
import { CompasLabelsFieldElement } from "./helpers/CompasLabelsField.js";

window.customElements.define("compas-save-to-file", CompasSaveToFileElement);

export { CompasSaveToFileElement, newSaveToFileEvent, CompasLabelsFieldElement };
