import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type IQuote } from '../../shared/interfaces';
import userStore, { type IUserStore } from '../../store/user';
import modalsStore, { type IModalsStore } from '../../store/modals';
import styles from './styles';
import sharedStyles from '../../shared/styles';

import '../ani-like/like';
import '../ani-comments/comments';

const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-requotes')
export default class AniRequotes extends LitElement {
  static styles = [sharedStyles, styles];

  @property({ type: Object })
  quote!: IQuote;

  @state()
  isSingle = location.pathname.includes('quote');

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  modalsState: IModalsStore = modalsStore.getInitialState();

  render() {
    return this.quote ? this.makeRequotesBtn(): null;
  }

  makeRequotesBtn() {
    const isSameUser = this.userState.user?.user?.id === this.quote.user.id;
    const hasRequoted = this.quote.requotes.includes(this.userState.user?.user?.id);

    if (isSameUser || hasRequoted) {
      return html`
        <kemet-icon icon="arrow-clockwise" size="24"></kemet-icon>
        <span>${this.quote.requotes?.length || 0}</span>
      `
    }

    return html`
      <button @click=${() => this.postRequote()} aria-label="Requote">
        <kemet-icon icon="arrow-clockwise" size="24"></kemet-icon>
        <span>${this.quote.requotes?.length || 0}</span>
      </button>
    `
  }

  async postRequote() {
    if (this.userState.isLoggedIn) {
      // get the latest quote data
      const currentQuote = await fetch(`${API_URL}/api/quotes/${this.quote.documentId}?populate=*`)
        .then(response => response.json());

      // update the original quote's requotes
      await fetch(`${API_URL}/api/quotes/${this.quote.documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.userState.user.jwt}`
        },
        body: JSON.stringify({ data: { requotes: [...currentQuote.data.requotes, this.userState.user.user.id] } })
      }).then(response => response.json());

      // post the requote
      fetch(`${API_URL}/api/quotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.userState.user.jwt}`
        },
        body: JSON.stringify({
          data: {
            quote: currentQuote.data.quote,
            requote: currentQuote.data.documentId,
            requotes: [],
            user: this.userState.user.user.id,
            book: currentQuote.data.book.id,
            page: currentQuote.data.page,
            note: currentQuote.data.note,
            private: false,
            likes: []
          }
        })
      });
    } else {
      this.modalsState.setSignInOpened(true);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-requotes': AniRequotes
  }
}
