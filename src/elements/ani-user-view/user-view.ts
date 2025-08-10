import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import Autolinker from 'autolinker';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { type IBook, type IQuote, type IProfile } from '../../shared/interfaces';
import userStore, { type IUserStore } from '../../store/user';
import sharedStyles from '../../shared/styles';
import styles from './styles';

import '../ani-quote/quote';
import '../ani-comment/comment';

// const API_URL = import.meta.env.VITE_API_URL;
const APP_URL = window.location.origin;

@customElement('ani-user-view')
export default class AniUserView extends LitElement {
  static styles = [styles, sharedStyles];

  @property()
  user!: IProfile;

  @property()
  userId: string = '';

  @property({ attribute: false })
  quotes: IQuote[] = [];

  @state()
  hasFetchedUser: boolean = false;

  @state()
  follow: boolean = false;

  @state()
  followers: number = 0;

  @state()
  userState: IUserStore = userStore.getInitialState();

  firstUpdated() {
    this.getUser();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('user')) {
      this.follow = this.userState.profile?.following?.includes(this.user.id) || false;
    }
  }

  render() {
    const displayName = this.user.username ?? this.user.email;

    return html`
      <hr />
      ${this.user && this.hasFetchedUser ?
        html `
          <header>
            <div>
              ${this.user.avatar
                ? html`<img class="profile" src="${this.user.avatar}" alt="${displayName}" />`
                : html`<img class="profile" src="https://placehold.co/80x80?text=${displayName}" alt="${displayName}" />`
              }
              ${this.userState.isLoggedIn && this.user.id !== this.userState.profile?.id ? html`
                <kemet-button variant="circle" outlined title="Follow ${displayName}" @click=${() => this.handleFollow()}>
                  <kemet-icon icon="${this.follow ? 'person-fill-dash' : 'person-fill-add'}" size="24"></kemet-icon>
                </kemet-button>
              ` : null}
            </div>
            <div>
              <h2>${displayName}</h2>
              <aside>
                <span>${this.user.counts?.quotes} quotes</span>
                <span>${this.user.counts?.followers} followers</span>
                <span>${this.user.counts?.following} following</span>
              </aside>
              <div>${this.parseBio(this.user.bio)}</div>
            </div>
          </header>
          ${this.makeBooks()}
        `
        : html`
          <header>
            <p>Sorry, that user doesn't exist.</p>
            <kemet-button variant="rounded" href="/">Go home</kemet-button>
          </header>
        `
      }
    `
  }

  async getUser() {
    const path = location.pathname.split('/');
    const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    const metaPropertyTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
    const metaPropertyUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement;

    this.userId = this.userId || path[path.length - 1];
    this.user = await fetch(`/api/users/details/${this.userId}`).then(response => response.json());
    this.hasFetchedUser = true;

    document.title = `${this.user.username} | Ani Book Quotes`;
    if (metaDescription) metaDescription.content = this.user.bio || `User profile for ${this.user.username}`;
    if (metaPropertyTitle) metaPropertyTitle.content = `${this.user.username} | Ani Book Quotes`;
    if (metaPropertyUrl) metaPropertyUrl.content = `${APP_URL}/user/${this.user.id}`;
  }

  makeBooks() {
    if (this.user.books && this.user.books.length > 0) {
      return html`
        <ul>
          ${this.user.books.map((book: IBook) => html`
            <li><ani-book identifier="${book.identifier}"></ani-book></li>
          `)}
        </ul>
      `;
    }
    return null;
  }

  parseBio(bio: string) {
    if (!bio) return;
    const bioComment = DOMPurify.sanitize(marked.parse(bio) as string);
    return html`${unsafeHTML(Autolinker.link(bioComment))}`;
  }

  async handleFollow() {
    this.followers = this.follow ? this.followers - 1 : this.followers + 1;
    this.follow = !this.follow;

    await fetch(`/api/follow/${this.userState.profile.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ follow: this.follow, follower: this.user.id })
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-user-view': AniUserView
  }
}
