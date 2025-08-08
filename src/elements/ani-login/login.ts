import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import userStore, { type IUserStore } from '../../store/user';
import KemetInput from 'kemet-ui/dist/components/kemet-input/kemet-input';
import alertStore, { type IAlertStore } from '../../store/alert';
import styles from './styles';
import sharedStyles, { stylesVendors } from '../../shared/styles';
import KemetButton from 'kemet-ui/dist/components/kemet-button/kemet-button';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ENUM_ALERT_STATUS } from '../../shared/enums';
import KemetTabs from 'kemet-ui/dist/components/kemet-tabs/kemet-tabs';

interface ICredentials {
  identifier: string;
  password: string;
}

const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-login')
export default class aniLogin extends LitElement {
  static styles = [styles, sharedStyles, stylesVendors];

  @state()
  code: string = new URLSearchParams(window.location.search).get('code') || '';

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  alertState: IAlertStore = alertStore.getInitialState();





  @query('form[action*=auth]')
  loginForm!: HTMLFormElement;

  @query('[name=identifier]')
  loginIdentifier!: KemetInput;

  constructor() {
    super();
    document.title = 'Login | Ani Book Quotes';
  }

  render() {
    return html`
      <kemet-card>
        <hr /><br />
        <form method="post" action="api/auth/login" @submit=${(event: SubmitEvent) => this.handleLogin(event)}>
          <kemet-field label="Email">
            <kemet-input required slot="input" name="identifier" rounded validate-on-blur></kemet-input>
          </kemet-field>
          <kemet-button variant="rounded">
            Get magic link <kemet-icon slot="right" icon="chevron-right"></kemet-icon>
          </kemet-button>
        </form>
      </kemet-card>
    `
  }

  handleLogin(event: SubmitEvent) {
    event.preventDefault();
    this.fetchLogin(this.loginIdentifier.value);
  }

  fetchLogin(identifier: string) {
    const options = {
      method: this.loginForm.getAttribute('method')?.toUpperCase(),
      body: JSON.stringify({ identifier }),
      headers: { 'Content-Type': 'application/json' }
    };

    const endpoint = this.loginForm.getAttribute('action');

    fetch(`/${endpoint}`, options)
      .then(response => response.json())
      .then(async response => {
        // bad access
        if (response.error) {
          this.alertState.setStatus('error');
          this.alertState.setMessage(unsafeHTML(response.message));
          this.alertState.setOpened(true);
          this.alertState.setIcon('exclamation-circle');
          return;
        }

        // success
        window.location.href = '/';
      })
      // .catch(() => {
      //   this.alertState.setStatus('error');
      //   this.alertState.setMessage('There was an unknown problem while logging you in.');
      //   this.alertState.setOpened(true);
      //   this.alertState.setIcon('exclamation-circle');
      // });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-login': aniLogin
  }
}
