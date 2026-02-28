import { LitElement, html } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import alertStore, { type IAlertStore } from '../../store/alert';

import styles from './styles';
import sharedStyles from '../../shared/styles';


@customElement('ani-login-callback')
export class AniLoginCallback extends LitElement {
  static styles = [sharedStyles, styles];

  @state()
  alertState: IAlertStore = alertStore.getInitialState();

  firstUpdated() {
    this.initCallback();
  }

  render() {
    return html`
      <hr />
      <p>Logging you in, one moment..</p>
    `;
  }

  async initCallback() {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');

    const response = await fetch(`/api/auth/verify`, {
      method: "POST",
      body: JSON.stringify({
        accessToken,
        refreshToken,
      }),
    });

    const data = await response.json();

    if (data.error) {
      this.alertState.setStatus('error');
      this.alertState.setMessage(data.error.message);
      this.alertState.setOpened(true);
      this.alertState.setIcon('exclamation-circle');
    } else {
      window.location.href = '/';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-login-callback': AniLoginCallback
  }
}
