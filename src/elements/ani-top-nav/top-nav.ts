import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { svgLogo } from '../../shared/svgs';
import userStore, { IUserStore } from '../../store/user';
import quoteStore, { IQuoteStore } from '../../store/quote';
import appStore, { IAppStore } from '../../store/app';
import { switchRoute } from '../../shared/utilities';

import styles from './styles';
import sharedStyles from '../../shared/styles';

import '../ani-search/search';


@customElement('ani-top-nav')
export default class AniTopNav extends LitElement {
  static styles = [styles, sharedStyles];

  @property({ type: Boolean, reflect: true })
  loading: boolean = false;

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  quoteState: IQuoteStore = quoteStore.getInitialState();

  @state()
  appState: IAppStore = appStore.getState();

  constructor() {
    super();

    quoteStore.subscribe((state) => {
      this.quoteState = state;
    });

    userStore.subscribe((state) => {
      this.userState = state;
    });

    appStore.subscribe((state) => {
      this.appState = state;
    });
  }

  render() {
    return html`
      ${this.appState.currentRoute.includes('home') || this.appState.currentRoute === '/'
        ? html`<ani-search ?opened=${this.appState.isDrawerOpened}></ani-search>`
        : null
      }
      <section>
        <nav>
          ${this.appState.currentRoute.includes('home') || this.appState.currentRoute === '/' ? html`
            <button aria-label="Search" @click=${() => this.appState.setIsDrawerOpened(!this.appState.isDrawerOpened)}>
              <kemet-icon icon="search" size="24"></kemet-icon>
            </button>
            <span>${this.quoteState.searchQuery ? html`Looking for: <strong>${this.quoteState.searchQuery}</strong>` : ''}</span>
            ` : null
          }
        </nav>
        <button aria-label="Home" @click=${() => switchRoute('/home')}>${svgLogo}</button>
        <div>${this.makeProfileImage()}</div>
      </section>
    `
  }

  makeProfileImage() {
    const profileImage = this.userState.profile?.avatar?.url;
    const isLoginPage = this.appState.currentRoute.includes('login');

    if (this.userState.isLoggedIn) {
      return html`
        <button @click=${() => switchRoute('/profile')} aria-label="Profile Avatar">
          ${profileImage
            ? html`<img src="${profileImage}" alt="${this.userState.profile.username}" />`
            : html`<img src="https://placehold.co/80x80?text=${this.userState.profile.username}" alt="${this.userState.profile.username}" />`
          }
        </button>
      `
    }

    if (!isLoginPage) {
      return html`
        <button @click=${() => switchRoute('/login')} aria-label="Login">
          <kemet-icon icon="door-open" size="24"></kemet-icon>
        </button>
      `;
    }

    return null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-top-nav': AniTopNav;
  }
}
