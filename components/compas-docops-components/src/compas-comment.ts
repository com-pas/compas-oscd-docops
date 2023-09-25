import {
  css,
  html,
  customElement,
  query,
  LitElement,
  TemplateResult,
} from "lit-element";
import { OscdTextfield } from "@openscd/oscd-textfield";

import "@openscd/oscd-textfield";

export class CompasCommentElement extends LitElement {
  @query("oscd-textfield#comment")
  private commentField!: OscdTextfield;

  set value(value: string | null) {
    this.commentField.maybeValue = value;
  }

  get value(): string | null {
    return this.commentField.maybeValue;
  }

  valid(): boolean {
    return this.commentField?.checkValidity();
  }

  render(): TemplateResult {
    return html`
      <h4>test</h4>
      <oscd-textfield id="comment" label="Comment" .maybeValue=${null} nullable>
      </oscd-textfield>
    `;
  }

  static styles = css`
    oscd-textfield {
      width: 100%;
    }
  `;
}
