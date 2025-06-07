import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import userStore, { IUserStore } from '../../store/user.ts';
import alertStore, { IAlertStore } from '../../store/alert.ts';
import { ENUM_ALERT_STATUS } from '../../shared/enums.ts';
import sharedStyles from '../../shared/styles.ts';

const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-change-password')
export default class aniChangePassword extends LitElement {
  static styles = [sharedStyles];

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  alertState: IAlertStore = alertStore.getInitialState();

  @query('form[action*=change-password]')
  changePasswordForm!: HTMLFormElement;

  render() {
    return html`
      <kemet-card>
        <form method="post" action="api/auth/change-password" @submit=${(event: SubmitEvent) => this.changePassword(event)}>
          <fieldset>
            <legend>Change Password</legend>
            <p>
              <kemet-field label="Current Password">
                <kemet-input required rounded slot="input" type="password" name="currentPassword" validate-on-blur></kemet-input>
              </kemet-field>
            </p>
            <p>
              <kemet-field slug="new_password" label="New Password">
                <kemet-input slot="input" rounded type="password" name="password" required validate-on-blur></kemet-input>
                <kemet-password slot="component" message="The following rules are optional but recommended while creating a password:"></kemet-password>
              </kemet-field>
            </p>
            <p>
              <kemet-field label="Confirm Password">
                <kemet-input required rounded slot="input" type="password" name="passwordConfirmation" validate-on-blur></kemet-input>
              </kemet-field>
            </p>
            <br /><hr /><br />
            <kemet-button variant="rounded">
              Change Password <kemet-icon slot="right" icon="chevron-right"></kemet-icon>
            </kemet-button>
          </fieldset>
        </form>
      </kemet-card>
    `;
  }

  async changePassword(event: SubmitEvent) {
    event.preventDefault();

    const fields = this.changePasswordForm.querySelectorAll('kemet-input');
    const hasErrors = Array.from(fields).some((field) => field.status === 'error');

    if (hasErrors) {
      this.alertState.setStatus('error');
      this.alertState.setMessage('Please correct any errors in the fields.');
      this.alertState.setOpened(true);
      this.alertState.setIcon('exclamation-circle');
      return;
    }

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.userState.user.jwt}`
      },
      body: JSON.stringify(Object.fromEntries(formData))
    }

    await fetch(`${API_URL}/api/auth/change-password`, options)
      .then((response) => response.json())
      .then((responseData) => {
        this.alertState.setOpened(true);

        if (responseData.error) {
          this.alertState.setStatus(ENUM_ALERT_STATUS.ERROR);
          this.alertState.setMessage(responseData.error.message);
          this.alertState.setIcon('exclamation-circle');
        }

        if (responseData.jwt) {
          this.alertState.setStatus(ENUM_ALERT_STATUS.PRIMARY);
          this.alertState.setMessage('Password changed successfully.');
          this.alertState.setIcon('check-circle');
        }
      })
      .catch((error) => console.error(error));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-change-password': aniChangePassword
  }
}
