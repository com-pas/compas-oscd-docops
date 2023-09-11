import { css, html, LitElement, TemplateResult } from "lit-element";
import { OscdTextfield } from "@openscd/oscd-textfield";

import "@openscd/oscd-textfield";

export class CompasCommentElement extends LitElement {
  private getCommentField(): OscdTextfield {
    return <OscdTextfield>(
      this.shadowRoot!.querySelector('oscd-textfield[id="comment"]')
    );
  }

  set value(value: string | null) {
    const commentField = this.getCommentField();
    commentField.maybeValue = value;
  }

  get value(): string | null {
    const commentField = this.getCommentField();
    return commentField.maybeValue;
  }

  valid(): boolean {
    return this.getCommentField().checkValidity();
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
