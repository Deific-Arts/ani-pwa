import { LitElement, html } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { loadStripe } from '@stripe/stripe-js';
import userStore, { IUserStore } from '../../store/user';
import alertStore, { IAlertStore } from '../../store/alert';
import appStore, { IAppStore } from '../../store/app';
import { isProduction } from '../../shared/utilities';

import styles from './styles';
import sharedStyles from '../../shared/styles';


const API_URL = import.meta.env.VITE_API_URL;
const STRIPE_PUBLIC_KEY_LIVE = import.meta.env.VITE_STRIPE_PUBLIC_KEY_LIVE;
const STRIPE_PUBLIC_KEY_TEST = import.meta.env.VITE_STRIPE_PUBLIC_KEY_TEST;
const stripe = await loadStripe(isProduction ? `${STRIPE_PUBLIC_KEY_LIVE}` : `${STRIPE_PUBLIC_KEY_TEST}`);
@customElement('ani-membership')
export class AniMembership extends LitElement {
  static styles = [sharedStyles, styles];

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  appState: IAppStore = appStore.getState();

  @state()
  alertState: IAlertStore = alertStore.getInitialState();

  @query('form#checkout')
  formCheckout!: HTMLFormElement;

  @query('#checkout-embed')
  pageCheckout!: HTMLSelectElement;

  constructor() {
    super();
    document.title = 'Membership | Ani Book Quotes';
    appStore.subscribe(state => {
      this.appState = state;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.appState.checkout.destroy();
  }

  firstUpdated() {
    this.appState.currentRoute.includes('checkout') && this.initCheckout();
    this.appState.currentRoute.includes('success') && this.initSuccess();
  }

  render() {
    if (this.appState.currentRoute.includes('checkout')) {
      return this.makeCheckout();
    }

    if (this.appState.currentRoute.includes('success')) {
      return this.makeSuccess();
    }

    return null;
  }

  makeCheckout() {
    return html`
      <hr />
      <h1>Become a Member of Ani Book Quotes</h1>
      <p>Being a member of Ani Book Quotes unlocks the full power of the app including features such as commenting and searching quotes.</p>
      <br />
      <form id="checkout">
        <input type="hidden" name="lookup_key" value="ani_standard_monthly" />
        <input type="hidden" name="email" value="${this.userState?.profile?.email}" />
      </form>
      <section id="checkout-embed"></section>
    `;
  }

  async initCheckout() {
    const fetchClientSecret = async () => {
      const formData = new FormData(this.formCheckout);
      const response = await fetch(`${API_URL}/api/qenna/create-checkout-session`, {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
          lookup_key: formData.get("lookup_key"),
        }),
      });
      const { clientSecret } = await response.json();
      return clientSecret;
    };

    if (await fetchClientSecret()) {
      const checkout = await stripe?.initEmbeddedCheckout({ fetchClientSecret });
      this.appState.setCheckout(checkout);
      this.appState.checkout.mount(this.pageCheckout);
    }
  }

  makeSuccess() {
    return html`
      <hr />
      <h1>Congratulations</h1>
      <p>You are now a member of Ani Book Quotes.</p>
    `;
  }

  async initSuccess() {
    const params = new URLSearchParams(window.location.search);

    const response = await fetch(`${API_URL}/api/qenna/create-membership`, {
      method: "POST",
      body: JSON.stringify({
        session_id: params.get('session_id') || '',
        user_id: this.userState?.profile?.id,
        jwt: this.userState?.user?.jwt,
      }),
    });

    const data = await response.json();

    if (data.error) {
      this.alertState.setStatus('error');
      this.alertState.setMessage(data.error.message);
      this.alertState.setOpened(true);
      this.alertState.setIcon('exclamation-circle');
    } else {
      const userProfile = await fetch(`${API_URL}/api/users/me?populate=*`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.userState?.user?.jwt}`
        }
      }).then((response) => response.json());
      this.userState.updateProfile(userProfile);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-membership': AniMembership
  }
}
