import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import quoteStore, { type IQuoteStore } from '../../store/quote';
import modalsStore, { type IModalsStore } from '../../store/modals';
import styles from './styles';
import sharedStyles from '../../shared/styles';

const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-share-contents')
export class AniShareContents extends LitElement {
  static styles = [sharedStyles, styles];

  @state()
  quoteState: IQuoteStore = quoteStore.getInitialState();

  @state()
  modalsStore: IModalsStore = modalsStore.getInitialState();

  @state()
  shareUrl: string = '';

  @property({ type: Boolean, reflect: true })
  copied: boolean = false;

  updated() {
    this.shareUrl = `${window.location.origin}/quote/${this.quoteState.currentQuote?.id}`;
  }

  constructor() {
    super();
    quoteStore.subscribe((state) => {
      this.quoteState = state;
    });
  }

  render() {
    return html`
      <section>
        <h2>Share this quote!</h2>
        <button class="copy" @click=${this.copyShareURL}>
          ${this.copied ? html`<span>Copied!</span>` : html`<span>Copy Link</span>`}
          <span>${this.shareUrl}</span>
        </button>
      </section>
    `;
  }

  private async copyShareURL() {
    try {
      await navigator.clipboard.writeText(this.shareUrl);
      this.copied = true;

      setTimeout(() => {
        this.copied = false;
      }, 2000);
    } catch (error) {
      console.error('Failed to copy: ', error);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-share-contents': AniShareContents
  }
}
