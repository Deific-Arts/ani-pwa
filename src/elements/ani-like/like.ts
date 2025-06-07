import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import userStore, { IUserStore } from '../../store/user.ts';
import modalsStore, { IModalsStore } from '../../store/modals.ts';
import { IQuote } from '../../shared/interfaces';
import styles from './styles';
import sharedStyles from '../../shared/styles';


const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-like')
export default class AniLike extends LitElement {
  static styles = [styles, sharedStyles];

  @property({ type: Object })
  quote!: IQuote;

  @property({ type: Boolean, reflect: true })
  liked: boolean = false;

  @property({ type: Number })
  likes: number = 0;

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  modalsState: IModalsStore = modalsStore.getInitialState();

  firstUpdated() {
    if (this.quote) {
      this.likes = this.quote.likes.length;
      if (this.userState.isLoggedIn) this.liked = this.quote.likes.includes(this.userState.user.user.id);
    }
  }

  render() {
    return html`
      <button aria-label="Like" @click=${() => this.handleLike()}>
        <kemet-icon icon="${this.liked ? 'heart-fill' : 'heart'}" size="24"></kemet-icon>
        <span>${this.likes}</span>
      </button>
    `
  }

  async handleLike() {
    if (this.userState.isLoggedIn) {
      this.likes = this.liked ? this.likes - 1 : this.likes + 1;

      const latestQuoteRequest = await fetch(`${API_URL}/api/quotes/${this.quote.documentId}`);
      const latestQuoteResponse = await latestQuoteRequest.json();
      const likes = latestQuoteResponse.data.likes || [];

      const addLike = {
        likes: [...likes, this.userState.user.user.id]
      };

      const removeLike = {
        likes: [...likes.filter((like: number) => like !== this.userState.user.user.id)]
      }

      const likeRequestBody = this.liked ? removeLike : addLike;

      await fetch(`${API_URL}/api/quotes/${this.quote.documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: likeRequestBody })
      });

      // swap the likes AFTER above logic is complete
      this.liked = !this.liked;
    } else {
      this.modalsState.setSignInOpened(true);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-like': AniLike
  }
}
