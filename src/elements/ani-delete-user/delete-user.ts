import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import alertStore, { type IAlertStore } from '../../store/alert';
import modalsStore, { type IModalsStore } from '../../store/modals';
import userStore, { type IUserStore } from '../../store/user';
import styles from './styles';
import sharedStyles from '../../shared/styles';

const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-delete-user')
export class AniDeleteUser extends LitElement {
  static styles = [sharedStyles, styles];

  @state()
  alertState: IAlertStore = alertStore.getInitialState();

  @state()
  modalsStore: IModalsStore = modalsStore.getInitialState();

  @state()
  userState: IUserStore = userStore.getInitialState();

  render() {
    return html`
      <section>
        <h2>Are you sure you want to delete your account?</h2>
        <div>
          <kemet-button variant="rounded" @click=${() => this.handleRemoveAccount()}>Yes, Delete my account</kemet-button>
          &nbsp;&nbsp;
          <kemet-button variant="rounded" @click=${() => this.modalsStore.setDeleteUserOpened(false)}>Cancel, get me out of here</kemet-button>
        </div>
      </section>
    `;
  }

  async handleRemoveAccount() {
    if (!!this.userState.profile.member_id) {
      const cancelRequest = await fetch(`${API_URL}/api/qenna/cancel-membership`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.userState.user.jwt}`
        },
        body: JSON.stringify({
          member_id: this.userState.profile.member_id || ''
        })
      });

      const cancelResponse = await cancelRequest.json();

      if (cancelResponse.error) {
        this.alertState.setStatus('error');
        this.alertState.setMessage(cancelResponse.message);
        this.alertState.setOpened(true);
        this.alertState.setIcon('exclamation-circle');
      } else {
        this.deleteAccount();
      }
    } else {
      this.deleteAccount()
    }
  }

  async deleteAccount() {
    const deleteRequest = await fetch(`${API_URL}/api/ani/destroyme`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.userState.user.jwt}`
      },
    });

    const deleteResponse = await deleteRequest.json();

    if (deleteResponse.error) {
      this.alertState.setStatus('error');
      this.alertState.setMessage(deleteResponse.error.message);
      this.alertState.setOpened(true);
      this.alertState.setIcon('exclamation-circle');
    } else {
      this.userState.logout();
      window.location.href = "/";
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-delete-user': AniDeleteUser
  }
}
