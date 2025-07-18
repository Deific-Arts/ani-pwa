import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type IQuote } from '../../shared/interfaces';
import userStore, { type IUserStore } from '../../store/user';
import modalsStore, { type IModalsStore } from '../../store/modals';
import styles from './styles';
import sharedStyles from '../../shared/styles';

import '../ani-like/like';
import '../ani-comments/comments';

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
    const isSameUser = this.userState.profile?.id === this.quote.user.id;
    const hasRequoted = this.quote.requotes.includes(this.userState.profile?.id);

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
      const currentQuote = await fetch(`/api/quotes/${this.quote.id}`)
        .then(response => response.json());

      // update the original quote's requotes
      await fetch(`/api/quotes/${this.quote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requotedBy: this.userState.profile?.id })
      }).then(response => response.json());

      // post the requote
      fetch(`/api/quotes/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quote: currentQuote.quote,
          requote: currentQuote.id,
          requotes: [],
          user_id: this.userState.profile?.id,
          book_id: currentQuote.book.id,
          page: currentQuote.page,
          note: currentQuote.note,
          private: false,
          likes: []
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
