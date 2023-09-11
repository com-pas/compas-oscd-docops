import "./compas-save.js";
import { CompasSaveElement, newSaveToFileEvent } from "./compas-save.js";
import { CompasLabelsFieldElement } from "./helpers/CompasLabelsField.js";

window.customElements.define("compas-save", CompasSaveElement);

export { CompasSaveElement, newSaveToFileEvent, CompasLabelsFieldElement };
