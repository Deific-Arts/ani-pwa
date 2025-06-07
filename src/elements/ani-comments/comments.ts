
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import userStore, { IUserStore } from '../../store/user.ts';
import modalsStore, { IModalsStore } from '../../store/modals.ts';
import { IComment, IQuote } from '../../shared/interfaces';
import styles from './styles';
import sharedStyles from '../../shared/styles';


const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-comments')
export default class AniComments extends LitElement {
  static styles = [styles, sharedStyles];

  @property({ type: Object})
  quote!: IQuote;

  @state()
  comments: IComment[] = [];

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  modalsState: IModalsStore = modalsStore.getInitialState();

  firstUpdated() {
    this.getComments();
  }

  render() {
    return html`
      <button aria-label="Comments" @click=${() => this.openComment()}>
        <kemet-icon icon="chat-left" size="24"></kemet-icon>
        <span>${this.comments?.length}</span>
      </button>
    `
  }

  async getComments() {
    const commentsRequest = await fetch(`${API_URL}/api/comments?filters[quoteId][$eq]=${this.quote?.id}`);
    const { data } = await commentsRequest.json();
    this.comments = data;
  }

  openComment() {
    if (this.userState.isLoggedIn) {
      this.modalsState.setCommentOpened(true);
      this.modalsState.setCurrentQuote(this.quote);
    } else {
      this.modalsState.setSignInOpened(true);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-comments': AniComments
  }
}
