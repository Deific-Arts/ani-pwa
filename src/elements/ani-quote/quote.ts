import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type IQuote } from '../../shared/interfaces';
import { formatDistance } from 'date-fns';
import userStore, { type IUserStore } from '../../store/user';
import styles from './styles';
import sharedStyles from '../../shared/styles';

import '../ani-like/like';
import '../ani-comments/comments';
import '../ani-requotes/requotes';
import { switchRoute } from '../../shared/utilities';

const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-quote')
export default class AniQuote extends LitElement {
  static styles = [sharedStyles, styles];

  @property({ type: Object })
  quote!: IQuote;

  @state()
  originalQuote!: IQuote;

  @state()
  isSingle = location.pathname.includes('quote');

  @state()
  isRequote: boolean = false;

  @state()
  userState: IUserStore = userStore.getInitialState();

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('quote')) {
      this.isRequote = !!this.quote.requote;
      this.quote.requote && this.fetchOriginalQuote();
    }
  }

  render() {
    return this.quote && this.quote.user ? html`
      ${this.quote.user.id === this.userState.profile?.id
        ? html`<button aria-label="Delete"><kemet-icon icon="x-lg" size="16" @click=${() => this.deleteQuote()}></kemet-icon></button>`
        : null
      }
      <header>
        <a aria-label="Avatar" href=${`/user/${this.quote.user.id}`}>
          ${this.quote.user.avatar
            ? html`<img src="${this.quote.user.avatar}" alt="${this.quote.user.username}" />`
            : html`<img src="https://placehold.co/80x80?text=${this.quote.user.username}" alt="${this.quote?.user?.username}" />`
          }
        </a>
        <div>
          ${this.isRequote && this.originalQuote
            ? html`<strong>${this.quote.user.username}${this.isMember()}</strong> <span>requoted ${this.originalQuote.user.username} ${this.displayDate()} ago</span>`
            : html`<strong>${this.quote.user.username}${this.isMember()}</strong> <span>quoted ${this.displayDate()} ago</span>`
          }
        </div>
      </header>
      <figure>
        <blockquote>${this.quote.quote}</blockquote>
        <cite>&mdash;&nbsp;${this.quote.book.title}${this.quote.page && html`, page: ${this.quote.page}`}</cite>
      </figure>
      <footer>
        <div>
          <ani-comments .quote=${this.isRequote ? this.originalQuote : this.quote}></ani-comments>
        </div>
        ${!this.isRequote ? html`<div><ani-requotes .quote=${this.quote}></ani-requotes></div>` : null}
        </div>
        <div>
          <ani-like .quote=${this.isRequote ? this.originalQuote : this.quote}></ani-like>
        </div>
        ${this.quote.note ? html`
          <div>
            <kemet-tooltip distance="24" strategy="absolute">
              <button slot="trigger" aria-label="Show note"><kemet-icon icon="journal-text" size="24"></kemet-icon></button>
              <div slot="content"><strong>Note:</strong> ${this.quote.note}</div>
            </kemet-tooltip>
          </div>
        ` : html `
          <div>
            <kemet-icon icon="journal" size="24"></kemet-icon>
          </div>
        `}
        ${this.makeLink()}
      </footer>
    ` : null
  }

  displayDate() {
    const now = new Date();
    const then = new Date(this.quote.created_at);
    return formatDistance(now, then);
  }

  makeLink() {
    if (!this.isSingle) {
      const id = this.isRequote && this.originalQuote ? this.originalQuote.id : this.quote.id
      return html`
        <div>
          <a href="/quote/${id}"><kemet-icon icon="link" size="24"></kemet-icon></a>
        </div>
      `
    }
    return null;
  }

  deleteQuote() {
    fetch(`/api/quotes/${this.quote.id}`, {
      method: 'DELETE',
      // headers: {
      //   Authorization: `Bearer ${this.userState.user.jwt}`
      // }
    });

    if (this.isSingle) {
      switchRoute('/home');
    } else {
      this.setAttribute("hidden", '');
    }
  }

  async fetchOriginalQuote() {
    const { data } = await fetch(`${API_URL}/api/quotes/${this.quote.requote}?populate=*`)
      .then(response => response.json());
    this.originalQuote = data;
  }

  isMember() {
    if (this.quote.user?.member_free_pass || !!this.quote.user?.member_id) {
      return html`&nbsp;<kemet-icon icon="patch-check-fill"></kemet-icon>`;
    }
    return null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-quote': AniQuote
  }
}
