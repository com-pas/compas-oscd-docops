import type { DocRetrievedEvent } from "./compas-open.js";
import { CompasOpenElement } from "./compas-open.js";

window.customElements.define("compas-open", CompasOpenElement);
export { CompasOpenElement, DocRetrievedEvent };