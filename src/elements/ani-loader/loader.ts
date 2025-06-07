import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './styles';

@customElement('ani-loader')
export default class aniLoader extends LitElement {
  static styles = [styles];

  @property({ type: Boolean, reflect: true })
  loading: boolean = false;

  render() {
    return html`
      <div class="lds-ripple">
        <div></div>
        <div></div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-loader': aniLoader
  }
}
