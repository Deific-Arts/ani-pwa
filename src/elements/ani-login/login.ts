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

  @state()
  forgotStatus: string = '';

  @state()
  resetEmail: string = '';

  @state()
  resetPassword: string = '';

  @query('kemet-tabs')
  tabs!: KemetTabs;

  @query('form[action*=auth]')
  loginForm!: HTMLFormElement;

  @query('form[action*=register]')
  registerForm!: HTMLFormElement;

  @query('form[action*=forgot-password]')
  forgotForm!: HTMLFormElement;

  @query('form[action*=set-password]')
  setPasswordForm!: HTMLFormElement;

  @query('[name=identifier]')
  loginIdentifier!: KemetInput;

  @query('[name=password]')
  loginPassword!: KemetInput;

  @query('form[action*=jwt-auth] kemet-button')
  loginButton!: KemetButton;

  constructor() {
    super();
    document.title = 'Login | Ani Book Quotes';
  }

  firstUpdated() {
    if (!!this.code) {
      this.tabs.selectedIndex = 2;
    }
  }

  render() {
    return html`
      <kemet-card>
        <kemet-tabs placement="bottom" divider>
          <kemet-tab slot="tab">Login</kemet-tab>
          <kemet-tab slot="tab">Register</kemet-tab>
          <kemet-tab slot="tab">Forgot Password</kemet-tab>
          <kemet-tab-panel slot="panel">
            <form method="post" action="api/auth/local" @submit=${(event: SubmitEvent) => this.handleLogin(event)}>
              <p>
                <kemet-field label="Username">
                  <kemet-input required slot="input" name="identifier" rounded validate-on-blur></kemet-input>
                </kemet-field>
              </p>
              <p>
                <kemet-field label="Password">
                  <kemet-input required slot="input" type="password" name="password" validate-on-blur></kemet-input>
                </kemet-field>
              </p>
              <br />
              <div class="logins">
                <kemet-button variant="rounded">
                Login <kemet-icon slot="right" icon="chevron-right"></kemet-icon>
                </kemet-button>
                <small>OR</small>
                <a href="${API_URL}/api/connect/google">
                  <div class="google-btn">
                    <div class="google-icon-wrapper">
                      <img class="google-icon" src="https://i.ibb.co/ydLySMx/google.png" />
                    </div>
                    <p class="btn-text">Google Login</p>
                  </div>
                </a>
                <a class="btn-fb" href="${API_URL}/api/connect/facebook">
                  <div class="fb-content">
                    <div class="logo">
                      <img src="https://i.ibb.co/pnpDRC6/facebook.png" alt="" width="32px" height="32px">
                    </div>
                    <p>Facebook Login</p>
                  </div>
                </a>
              </div>
            </form>
          </kemet-tab-panel>
          <kemet-tab-panel slot="panel">
            <form method="post" action="api/auth/local/register" @submit=${(event: SubmitEvent) => this.handleRegistration(event)}>
              <kemet-field slug="username" label="Username" message="A valid username is required">
                <kemet-input required slot="input" name="username" validate-on-blur></kemet-input>
              </kemet-field>
              <br />
              <kemet-field slug="user_pass" label="New Password" status="standard">
                <kemet-input slot="input" type="password" name="password" status="standard"></kemet-input>
                <kemet-password slot="component" message="The following rules are optional but recommended while creating a password:"></kemet-password>
              </kemet-field>
              <br />
              <kemet-field slug="email" label="Email" message="A valid email is required">
                <kemet-input required slot="input" name="email" type="email" validate-on-blur></kemet-input>
              </kemet-field>
              <br />
              <kemet-button variant="rounded">
                Register <kemet-icon slot="right" icon="chevron-right"></kemet-icon>
              </kemet-button>
            </form>
          </kemet-tab-panel>
          <kemet-tab-panel slot="panel">
            ${!!this.code ?
              html`
                <form method="post" action="api/auth/reset-password" @submit=${(event: SubmitEvent) => this.handleResetPassword(event)}>
                  <kemet-field slug="reset-pass" label="New Password" status="standard">
                    <kemet-input slot="input" type="password" name="password" status="standard"></kemet-input>
                    <kemet-password slot="component" message="The following rules are optional but recommended while creating a password:"></kemet-password>
                  </kemet-field>
                  <br />
                  <kemet-field slug="reset-pass-confirm" label="Confirm New Password" status="standard">
                    <kemet-input slot="input" type="password" name="passwordConfirmation" status="standard"></kemet-input>
                  </kemet-field>
                  <br />
                  <kemet-button variant="rounded">
                    Reset Password <kemet-icon slot="right" icon="chevron-right"></kemet-icon>
                  </kemet-button>
                </form>
              ` :
              html`
                <form method="post" action="api/auth/forgot-password" @submit=${(event: SubmitEvent) => this.handleForgotPassword(event)}>
                  <kemet-field slug="email" label="Email" message="A valid email is required">
                    <kemet-input
                      required
                      slot="input"
                      name="email"
                      type="email"
                      validate-on-blur
                      @kemet-input-input=${(event: CustomEvent) => this.resetEmail = event.detail }>
                    </kemet-input>
                  </kemet-field>
                  <br />
                  <kemet-button variant="rounded">
                    Reset Password <kemet-icon slot="right" icon="chevron-right"></kemet-icon>
                  </kemet-button>
                </form>
              `
            }
          </kemet-tab-panel>
        </kemet-tabs>
      </kemet-card>
    `
  }


  handleLogin(event: SubmitEvent) {
    event.preventDefault();

    const credentials = {
      identifier: this.loginIdentifier.value,
      password: this.loginPassword.value,
    };

    this.fetchLogin(credentials);
  }

  fetchLogin(credentials: ICredentials) {
    const options = {
      method: this.loginForm.getAttribute('method')?.toUpperCase(),
      body: JSON.stringify(credentials),
      headers: { 'Content-Type': 'application/json' }
    };

    const endpoint = this.loginForm.getAttribute('action');

    fetch(`${API_URL}/${endpoint}`, options)
      .then(response => response.json())
      .then(async response => {
        // bad access
        if (response.error?.status === 400) {
          this.alertState.setStatus('error');
          this.alertState.setMessage(unsafeHTML('Oh boy, looks like a bad username or password.'));
          this.alertState.setOpened(true);
          this.alertState.setIcon('exclamation-circle');
        }

        // success
        if (response.jwt) {
          const options = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${response.jwt}`
            }
          };
          const userProfile = await fetch(`${API_URL}/api/users/me?populate=*`, options).then((response) => response.json());
          this.userState.updateProfile(userProfile);
          this.userState.login(response);
          window.location.href = '/';
        }
      })
      // .catch(() => {
      //   this.alertState.setStatus('error');
      //   this.alertState.setMessage('There was an unknown problem while logging you in.');
      //   this.alertState.setOpened(true);
      //   this.alertState.setIcon('exclamation-circle');
      // });
  }

  handleRegistration(event: SubmitEvent) {
    event.preventDefault();

    const formData = new FormData(this.registerForm) as any;

    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData))
    };

    const endpoint = this.registerForm.getAttribute('action');

    fetch(`${API_URL}/${endpoint}`, options)
      .then(response => response.json())
      .then((responseData) => {
          // this.alertState.setMessage('An error was encountered while registering.');

          if (responseData.error) {
            this.alertState.setStatus('error');
            this.alertState.setMessage(responseData.error.message);
            this.alertState.setOpened(true);
            this.alertState.setIcon('exclamation-circle');
          }

          if (responseData.user) {
            const credentials = {
              identifier: responseData.user.email,
              password: formData.get('password'),
            }

            this.alertState.setStatus(ENUM_ALERT_STATUS.PRIMARY);
            this.alertState.setOpened(true);
            this.alertState.setMessage('You\'re all set!');

            this.fetchLogin(credentials);
          }


      })
      .catch(() => {
        this.alertState.setStatus(ENUM_ALERT_STATUS.ERROR);
        this.alertState.setMessage('There was an unknown problem while registering.');
        this.alertState.setOpened(true);
        this.alertState.setIcon('exclamation-circle');
      });
  }

  async handleForgotPassword(event: SubmitEvent) {
    event.preventDefault();

    const formData = new FormData(this.forgotForm) as any;

    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData))
    };

    const endpoint = this.forgotForm.getAttribute('action');

    const request = await fetch(`${API_URL}/${endpoint}`, options);
    const { error } = await request.json();

    if (error) {
      this.alertState.setStatus('error');
      this.alertState.setMessage(unsafeHTML(error.message) || 'An unknown problem has occurred.');
      this.alertState.setOpened(true);
      this.alertState.setIcon('exclamation-circle');
      return;
    }

    this.alertState.setStatus('success');
    this.alertState.setMessage('A password reset link has been sent to your email.');
    this.alertState.setOpened(true);
    this.alertState.setIcon('check-circle');
  }

  handleNewPassword(event: SubmitEvent) {
    event.preventDefault();

    const formData = new FormData(this.setPasswordForm) as any;
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData))
    };
    const endpoint = this.setPasswordForm.getAttribute('action');

    fetch(`${API_URL}/${endpoint}`, options)
      .then(response => response.json())
      .then((responseData) => {
        if (responseData.data.status === 200) {
          const credentials = {
            identifier: this.resetEmail,
            password: this.resetPassword
          }

          this.alertState.setStatus('success');
          this.alertState.setMessage(unsafeHTML(responseData.message));
          this.alertState.setOpened(true);
          this.alertState.setIcon('check-circle');

          setTimeout(() => this.fetchLogin(credentials), 1000 * 3);
        } else {
          this.alertState.setStatus('error');
          this.alertState.setMessage(unsafeHTML(responseData.message) || 'An unknown problem has occurred.');
          this.alertState.setOpened(true);
          this.alertState.setIcon('exclamation-circle');

          if (responseData.message.indexOf('You must request a new code.') > -1) {
            this.forgotStatus = 'resend';
          }
        }
      });
  }

  async handleResetPassword(event: SubmitEvent) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement
    const formData = new FormData(form) as FormData;
    formData.append('code', this.code);
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData))
    };
    const endpoint = this.setPasswordForm.getAttribute('action');

    const request = await fetch(`${API_URL}/${endpoint}`, options)
    const response = await request.json();

    if (response.error) {
      this.alertState.setStatus('error');
      this.alertState.setMessage(unsafeHTML(response.error.message) || 'An unknown problem has occurred.');
      this.alertState.setOpened(true);
      this.alertState.setIcon('exclamation-circle');
      return;
    }

    if (response.jwt) {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${response.jwt}`
        }
      };
      const userProfile = await fetch(`${API_URL}/api/users/me?populate=*`, options).then((response) => response.json());
      this.userState.updateProfile(userProfile);
      this.userState.login(response);
      window.location.href = '/';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-login': aniLogin
  }
}
