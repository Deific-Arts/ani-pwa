import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import quoteStore, { type IQuoteStore } from '../../store/quote';
import userStore, { type IUserStore } from '../../store/user';
import appStore, { type IAppStore } from '../../store/app';
import KemetTabs from 'kemet-ui/dist/components/kemet-tabs/kemet-tabs';
import { throttle } from '../../shared/utilities';
import styles from './styles';
import sharedStyles from '../../shared/styles';

import '../ani-quote/quote';
import '../ani-loader/loader';


@customElement('ani-feed')
export default class AniFeed extends LitElement {
  static styles = [sharedStyles, styles];

  private handleScroll: () => void;
  private throttledHandleScroll: () => void;

  @property({ type: String })
  feed: string | null = null;

  @property({ type: String })
  current: string = 'all';

  @state()
  hasFetched: string[] = [this.current];

  @state()
  searchQuery: string = '';

  @state()
  currentPage: number = 1;

  @state()
  pagination: any = {
    all: {},
    following: {},
    mine: {},
    liked: {},
  }

  @state()
  hasLoaded: any = {
    all: false,
    following: false,
    mine: false,
    liked: false,
  }

  @state()
  quoteState: IQuoteStore = quoteStore.getState();

  @state()
  userState: IUserStore = userStore.getState();

  @state()
  appState: IAppStore = appStore.getState()

  constructor() {
    super();

    this.handleScroll = this.onScroll.bind(this);
    this.throttledHandleScroll = throttle(this.handleScroll, 100);

    quoteStore.subscribe((state) => {
      this.quoteState = state;
      this.searchQuery = state.searchQuery;
    })
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this.throttledHandleScroll);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this.throttledHandleScroll);
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('searchQuery') && this.searchQuery) {
      this.getQuotes();
    }
  }

  firstUpdated() {
    this.getQuotes();
  }

  render() {
    const hasQuotes = this.quoteState.quotes?.length > 0;
    const hasLoaded = this.hasLoaded[this.feed as string];

    if (hasQuotes) {
      return html`<ul>${this.quoteState.quotes.map(quote => html`<li><ani-quote .quote=${quote}></ani-quote></li>`)}`;
    }

    if (!hasQuotes && this.searchQuery) {
      return html`<p>We could not find any quotes, but you're searching for <strong>${this.searchQuery}</strong>. Try clearing the search for better results.</p>`;
    }

    if (!hasQuotes && hasLoaded) {
      switch (this.feed) {
        case "mine":
          return html`<p>Looks like you haven't added any quotes yet.</p>`;
        case "following":
          return html`<p>Looks like the people you follow haven't added any quotes yet.</p>`;
        case "liked":
          return html`<p>Looks like you haven't liked any quotes yet.</p>`;
        default:
          return html`<p>Wow. Its awfully silent in here.</p>`;
      }
    }

    return html`<p><ani-loader loading></ani-loader></p>`;
  }

  onScroll() {
    const tabsElement = document.querySelector('ani-home')?.shadowRoot?.querySelector('kemet-tabs') as KemetTabs;

    const tabsOffset = tabsElement.offsetTop + tabsElement.clientHeight;
    const pageOffset = window.scrollY + window.innerHeight;
    const isAtBottom = pageOffset > tabsOffset;

    if (isAtBottom && this.pagination[this.current]?.page < this.pagination[this.current]?.pageCount) {
      this.currentPage++;
      this.getQuotes(true);
    }
  }

  async getQuotes(isPagination = false) {
    if (this.feed) {
      const quotesPerPage = '4';
      const searchParams = this.quoteState.searchQuery ? `&search=${this.quoteState.searchQuery}` : '';
      const response = await fetch(`/api/quotes/${this.feed}?page=${this.currentPage}&pageSize=${quotesPerPage}${searchParams}`);
      const quotesResponse = await response.json();
      this.pagination[this.feed] = quotesResponse.meta.pagination;
      isPagination ? this.quoteState.addQuotes(quotesResponse.quotes) : this.quoteState.addInitialQuotes(quotesResponse.quotes);
      this.hasLoaded[this.feed] = true;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-feed': AniFeed
  }
}
