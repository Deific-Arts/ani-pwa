import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import quoteStore, { type IQuoteStore } from '../../store/quote';
import userStore, { type IUserStore } from '../../store/user';
import appStore, { type IAppStore } from '../../store/app';
import styles from './styles';
import sharedStyles from '../../shared/styles';

import '../ani-quote/quote';
import '../ani-loader/loader';
import KemetTabs from 'kemet-ui/dist/components/kemet-tabs/kemet-tabs';



const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-feed')
export default class AniFeed extends LitElement {
  static styles = [sharedStyles, styles];

  private handleScroll: () => void;

  @property({ type: String })
  feed: string = 'all';

  @property({ type: String })
  current: string = 'all';

  @state()
  hasFetched: string[] = [this.current];

  @state()
  searchQuery: string = '';

  @state()
  currentPage: any = {
    all: 1,
    following: 1,
    mine: 1,
    liked: 1
  }

  @state()
  pagination: any = {
    all: {},
    following: {},
    mine: {},
    liked: {},
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

    quoteStore.subscribe((state) => {
      this.quoteState = state;
      this.searchQuery = state.searchQuery;
    })
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this.handleScroll);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this.handleScroll);
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('searchQuery') && this.searchQuery) {
      this.getQuotes();
    }
  }

  firstUpdated() {
    if (this.feed === this.current) this.getQuotes();
  }

  render() {
    switch (this.current) {
      case 'following' :
        if (this.quoteState.followingQuotes.length > 0) {
          return html`<ul>${this.quoteState.followingQuotes.map(quote => html`<li><ani-quote .quote=${quote}></ani-quote></li>`)}`;
        } else {
          if (this.searchQuery) {
            return html`<p>We could not find any quotes, but you're searching for <strong>${this.searchQuery}</strong>. Try clearing the search for better results.</p>`;
          } else {
            if (this.appState.fetchedTabs.includes('following')) {
              return html`<p>You either aren't following anyone or they haven't added any quotes yet.</p>`
            } else {
              return html`<p><ani-loader loading></ani-loader></p>`
            }
          }
        }
      case 'mine' :
        if (this.quoteState.mineQuotes.length > 0) {
          return html`<ul>${this.quoteState.mineQuotes.map(quote => html`<li><ani-quote .quote=${quote}></ani-quote></li>`)}`;
        } else {
          if (this.searchQuery) {
            return html`<p>We could not find any quotes, but you're searching for <strong>${this.searchQuery}</strong>. Try clearing the search for better results.</p>`;
          } else {
            if (this.appState.fetchedTabs.includes('mine')) {
              return html`<p>Looks like you haven't added any quotes yet.</p>`;
            } else {
              return html`<p><ani-loader loading></ani-loader></p>`
            }
          }
        }
      case 'liked' :
        if (this.quoteState.likedQuotes.length > 0) {
          return html`<ul>${this.quoteState.likedQuotes.map(quote => html`<li><ani-quote .quote=${quote}></ani-quote></li>`)}`;
        } else {
          if (this.searchQuery) {
            return html`<p>We could not find any quotes, but you're searching for <strong>${this.searchQuery}</strong>. Try clearing the search for better results.</p>`;
          } else {
            if (this.appState.fetchedTabs.includes('liked')) {
              return html`<p>Looks like you haven't liked any quotes yet.</p>`;
            } else {
              return html`<p><ani-loader loading></ani-loader></p>`
            }
          }
        }
      default :
        if (this.quoteState.quotes.length > 0) {
          return html`<ul>${this.quoteState.quotes.map(quote => html`<li><ani-quote .quote=${quote}></ani-quote></li>`)}`;
        } else {
          if (this.searchQuery) {
            return html`<p>We could not find any quotes, but you're searching for <strong>${this.searchQuery}</strong>. Try clearing the search for better results.</p>`;
          } else {
            if (this.hasFetched.includes('all')) {
              return html`<p>Uh oh. We couldn't find any quotes.</p>`;
            } else {
              return html`<p><ani-loader loading></ani-loader></p>`
            }
          }
        }
    }
  }

  onScroll() {
    const tabsElement = document.querySelector('ani-app')
      ?.shadowRoot?.querySelector('ani-home')
      ?.shadowRoot?.querySelector('kemet-tabs') as KemetTabs;

    const tabsOffset = tabsElement.offsetTop + tabsElement.clientHeight;
    const pageOffset = window.scrollY + window.innerHeight;
    const isAtBottom = pageOffset > tabsOffset;

    if (isAtBottom && this.pagination[this.current]?.page < this.pagination[this.current]?.pageCount) {
      this.currentPage[this.current]++;
      this.getQuotes(true);
    }
  }

  // search by whether or not the user, book, or quote contain the search query
  async getQuotes(isPagination = false) {
    this.appState.setFetchedTabs(this.current);
    const quotesPerPage = '4';
    const searchParams = this.quoteState.searchQuery ? `&filters[$or][0][quote][$contains]=${this.quoteState.searchQuery}&filters[$or][1][book][title][$contains]=${this.quoteState.searchQuery}&filters[$or][2][user][username][$contains]=${this.quoteState.searchQuery}` : '';
    let filters;

    switch(this.feed) {
      case "following" :
        filters = this.setFollowingUsers();
        break;
      case "mine" :
        filters = `&filters[$and][0][user][id][$eq]=${this.userState.user.user.id}`;
        break;
      case "liked" :
        filters = `&filters[$and][0][likes][$containsi]=${this.userState.user.user.id}`;
        break;
      default :
        filters = '';
    }

    const response = await fetch(`${API_URL}/api/quotes?sort[0]=createdAt:desc&populate=user.avatar&populate=book${searchParams}&pagination[pageSize]=${quotesPerPage}&pagination[page]=${this.currentPage[this.current]}${filters}`);
    const { data, meta } = await response.json();

    this.pagination[this.feed] = meta.pagination;

    switch(this.feed) {
      case 'following' :
        this.quoteState.addFollowingQuotes(data);
        break;
      case 'mine' :
        isPagination ? this.quoteState.addMineQuotes(data) : this.quoteState.addInitialMineQuotes(data);
        break;
      case 'liked' :
        isPagination ? this.quoteState.addLikedQuotes(data) : this.quoteState.addInitialLikedQuotes(data);
        break;
      default :
        isPagination ? this.quoteState.addQuotes(data) : this.quoteState.addInitialQuotes(data);
    }
  }

  setFollowingUsers() {
    let users: string = '';

    this.userState.profile.following && this.userState.profile.following.forEach((user) => {
      users += `&filters[$and][0][user][id][$eq]=${user}`;
    });

    return !!users ? users : '&filters[$and][0][user][id][$eq]=0';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-feed': AniFeed
  }
}
