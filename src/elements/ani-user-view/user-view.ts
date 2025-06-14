import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import Autolinker from 'autolinker';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { switchRoute } from '../../shared/utilities';
import { IBook, IQuote, IProfile } from '../../shared/interfaces';
import userStore, { IUserStore } from '../../store/user';
import sharedStyles from '../../shared/styles';
import styles from './styles';

import '../ani-quote/quote';
import '../ani-comment/comment';

const API_URL = import.meta.env.VITE_API_URL;
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
    return html`
      <hr />
      ${this.user && this.hasFetchedUser ?
        html `
          <header>
            <div>
              ${this.user.avatar.url
                ? html`<img class="profile" src="${this.user.avatar.url}" alt="${this.user.username}" />`
                : html`<img class="profile" src="https://placehold.co/80x80?text=${this.user.username}" alt="${this.user?.username}" />`
              }
              ${this.userState.isLoggedIn && this.user.id !== this.userState.user.user.id ? html`
                <kemet-button variant="circle" outlined title="Follow ${this.user.username}" @click=${() => this.handleFollow()}>
                  <kemet-icon icon="${this.follow ? 'person-fill-dash' : 'person-fill-add'}" size="24"></kemet-icon>
                </kemet-button>
              ` : null}
            </div>
            <div>
              <h2>${this.user.username}</h2>
              <aside>
                <span>${this.quotes.length} quotes</span>
                <span>${this.followers} followers</span>
                <span>${this.user.following?.length || 0} following</span>
              </aside>
              <div>${this.parseBio(this.user.bio)}</div>
            </div>
          </header>
          ${this.makeBooks()}
        `
        : html`
          <header>
            <p>Sorry, we couldn't find the requested user.</p>
            <kemet-button variant="rounded" @click=${() => switchRoute('/home')}>Go home</kemet-button>
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
    const response = await fetch(`${API_URL}/api/users/${this.userId}?populate=*`);
    this.user = !!this.user ? this.user : await response.json();
    this.hasFetchedUser = true;

    document.title = `${this.user.username} | Ani Book Quotes`;
    if (metaDescription) metaDescription.content = this.user.bio || `User profile for ${this.user.username}`;
    if (metaPropertyTitle) metaPropertyTitle.content = `${this.user.username} | Ani Book Quotes`;
    if (metaPropertyUrl) metaPropertyUrl.content = `${APP_URL}/user/${this.user.id}`;

    this.getQuotes();
    this.getFollowers();
  }

  async getQuotes() {
    const response = await fetch(`${API_URL}/api/quotes?filters[user][username][$eq]=${this.user.username}&populate=user.avatar&populate=book`);
    const { data } = await response.json();
    this.quotes = data;
  }

  async getFollowers() {
    const response = await fetch(`${API_URL}/api/users`);
    const responseData = await response.json();
    this.followers = responseData.filter((user: IProfile) => user.following?.includes(this.user.id)).length;
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

    const latestUserRequest = await fetch(`${API_URL}/api/users/${this.userState.user.user.id}`);
    const latestUserResponse = await latestUserRequest.json();
    const following = latestUserResponse.following || [];

    const addFollow = {
      following: [...following, this.user.id]
    };

    const removeFollow = {
      following: [...following.filter((userId: number) => userId !== this.user.id)]
    }

    const followRequestBody = this.follow ? removeFollow : addFollow;

    await fetch(`${API_URL}/api/users/${this.userState.user.user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(followRequestBody)
    });

    this.follow = !this.follow;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-user-view': AniUserView
  }
}
