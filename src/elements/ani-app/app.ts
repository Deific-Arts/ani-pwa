import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import styles from './styles';

@customElement('ani-app')
export class AniApp extends LitElement {
  static styles = [styles];

  firstUpdated() {
    this.fetchTemp();
  }

  render() {
    return html`
      <h1>Hello</h1>
    `;
  }

  fetchTemp() {
    fetch('/api/temp')
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-app': AniApp
  }
}
