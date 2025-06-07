import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './styles';
import sharedStyles from '../../shared/styles';
import { switchRoute } from '../../shared/utilities';

@customElement('ani-footer-nav')
export class AniFooterNav extends LitElement {
  static styles = [sharedStyles, styles];

  @property() year: number = new Date().getFullYear();

  render() {
    return html`
      <nav>
        <div>
          © ${this.year} <a href="https://deificarts.com" target="_blank">Deific Arts LLC</a>, all rights reserved.
        </div>
        <div>
          <button title="Terms & Conditions" @click=${() =>switchRoute('/legal/terms')}>
            <kemet-icon icon="paperclip" size="24"></kemet-icon>
          </button>
          &nbsp;&nbsp;
          <button title="Privacy Policy" @click=${() => switchRoute('/legal/privacy')}>
            <kemet-icon icon="lock" size="24"></kemet-icon>
          </button>
        </div>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-footer-nav': AniFooterNav;
  }
}
