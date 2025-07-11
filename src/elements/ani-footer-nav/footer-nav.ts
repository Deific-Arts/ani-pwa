import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './styles';
import sharedStyles from '../../shared/styles';

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
          <a title="Terms & Conditions" href="/legal/terms">
            <kemet-icon icon="paperclip" size="24"></kemet-icon>
          </a>
          &nbsp;&nbsp;
          <a title="Privacy Policy" href="/legal/privacy">
            <kemet-icon icon="lock" size="24"></kemet-icon>
          </a>
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
