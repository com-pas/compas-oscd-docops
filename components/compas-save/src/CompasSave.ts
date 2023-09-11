import { CompasSaveElement, newSaveToFileEvent } from "./compas-save.js";
import { CompasLabelsFieldElement } from "./helpers/CompasLabelsField.js";
import { CompasCommentElement } from "./helpers/CompasComment.js";

window.customElements.define("compas-save", CompasSaveElement);
window.customElements.define("compas-comment", CompasCommentElement);

export { CompasSaveElement, newSaveToFileEvent, CompasLabelsFieldElement };
