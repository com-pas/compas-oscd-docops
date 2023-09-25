import { CompasChangeSetRadiogroup } from "./compas-change-set-radiogroup.js";
import { CompasCommentElement } from "./compas-comment.js";
import { CompasLabelsFieldElement } from "./compas-labels-field";
import { CompasSclTypeSelect } from "./compas-scltype-select.js";

window.customElements.define("compas-comment", CompasCommentElement);
window.customElements.define(
  "compas-changeset-radiogroup",
  CompasChangeSetRadiogroup
);
window.customElements.define("compas-labels-field", CompasLabelsFieldElement);
window.customElements.define("compas-scltype-select", CompasSclTypeSelect);

export {
  CompasCommentElement,
  CompasChangeSetRadiogroup,
  CompasLabelsFieldElement,
  CompasSclTypeSelect,
};
