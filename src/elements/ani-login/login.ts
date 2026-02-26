import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import userStore, { type IUserStore } from '../../store/user';
import KemetInput from 'kemet-ui/dist/components/kemet-input/kemet-input';
import alertStore, { type IAlertStore } from '../../store/alert';
import styles from './styles';
import sharedStyles, { stylesVendors } from '../../shared/styles';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';


@customElement('ani-login')
export default class AniLogin extends LitElement {
  static styles = [styles, sharedStyles, stylesVendors];

  @state()
  success: boolean | null = null;

  @state()
  disabled: boolean = false;

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
    if (this.userState.isLoggedIn) {
      window.location.href = '/';
    }

    return html`
      <kemet-card>
        ${this.success ? html`<div class="success"><kemet-icon icon="check-lg" size="72"></kemet-icon><h2>Check your email for a magic link to login.</h2></div>` : null}
        <hr />
        <form method="post" action="api/auth/login" @submit=${(event: SubmitEvent) => this.handleLogin(event)}>
          <h2>Login</h2>
          <kemet-field label="Enter your email to continue">
            <kemet-input required slot="input" name="identifier" ?disabled=${this.disabled} rounded validate-on-blur></kemet-input>
          </kemet-field>
          <kemet-button variant="rounded" ?disabled=${this.disabled}>
            Get login link via email <kemet-icon slot="right" icon="chevron-right"></kemet-icon>
          </kemet-button>
        </form>
        <br /><span>or</span><hr /><br />
        <ul class="social-buttons">
          <li>
            <button class="facebook" @click=${() => this.handleFacebookLogin()}>
              <kemet-icon icon="facebook" size="24"></kemet-icon>
              Continue with Facebook
            </button>
          </li>
        </ul>
      </kemet-card>
    `
  }

  handleLogin(event: SubmitEvent) {
    event.preventDefault();
    this.disabled = true;
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
          this.disabled = false;
          return;
        }

        // success
        this.success = true;
      });
  }

  handleFacebookLogin() {
    fetch('/api/auth/facebook')
      .then(response => response.json())
      .then(response => {
        if (response.error) {
          this.alertState.setStatus('error');
          this.alertState.setMessage(unsafeHTML(response.message));
          this.alertState.setOpened(true);
          this.alertState.setIcon('exclamation-circle');
          return;
        }

        window.location.href = response.url;
      });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-login': AniLogin
  }
}
