import { createStore } from 'zustand/vanilla';
import { IComment, IQuote } from '../shared/interfaces';

export interface IQuoteStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  quotes: IQuote[],
  addQuote: (quote: IQuote) => void,
  addQuotes: (quotes: IQuote[]) => void,
  addInitialQuotes: (quotes: IQuote[]) => void,

  followingQuotes: IQuote[],
  addFollowingQuote: (quote: IQuote) => void,
  addFollowingQuotes: (quotes: IQuote[]) => void,
  addInitialFollowingQuotes: (quotes: IQuote[]) => void,

  mineQuotes: IQuote[],
  addMineQuote: (quote: IQuote) => void,
  addMineQuotes: (quotes: IQuote[]) => void,
  addInitialMineQuotes: (quotes: IQuote[]) => void,

  likedQuotes: IQuote[],
  addLikedQuote: (quote: IQuote) => void,
  addLikedQuotes: (quotes: IQuote[]) => void,
  addInitialLikedQuotes: (quotes: IQuote[]) => void,

  comments: IComment[],
  addComment: (comment: IComment) => void,
  addInitialComments: (comments: IComment[]) => void,
}

const store = createStore<IQuoteStore>(set => ({
  quotes: [],
  addQuote: (quote: IQuote) => set(state => { return { quotes: [quote, ...state.quotes] } }),
  addQuotes: (quotes: IQuote[]) => set(state => { return { quotes: [...state.quotes, ...quotes] } }),
  addInitialQuotes: (quotes: IQuote[]) => set(() => { return { quotes } }),

  followingQuotes: [],
  addFollowingQuote: (quote: IQuote) => set(state => { return { followingQuotes: [quote, ...state.quotes] } }),
  addFollowingQuotes: (quotes: IQuote[]) => set(state => { return { followingQuotes: [...state.followingQuotes, ...quotes] } }),
  addInitialFollowingQuotes: (quotes: IQuote[]) => set(() => { return { followingQuotes: quotes } }),

  mineQuotes: [],
  addMineQuote: (quote: IQuote) => set(state => { return { mineQuotes: [quote, ...state.quotes] } }),
  addMineQuotes: (quotes: IQuote[]) => set(state => { return { mineQuotes: [...state.mineQuotes, ...quotes] } }),
  addInitialMineQuotes: (quotes: IQuote[]) => set(() => {  return { mineQuotes: quotes } }),

  likedQuotes: [],
  addLikedQuote: (quote: IQuote) => set(state => { return { likedQuotes: [quote, ...state.quotes] } }),
  addLikedQuotes: (quotes: IQuote[]) => set(state => { return { likedQuotes: [...state.likedQuotes, ...quotes] } }),
  addInitialLikedQuotes: (quotes: IQuote[]) => set(() => { return { likedQuotes: quotes } }),

  searchQuery: '',
  setSearchQuery: (query: string) => set(() => { return { searchQuery: query } }),
  comments: [],
  addComment: (comment: IComment) => set(state => { return { comments: [...state.comments, comment] } }),
  addInitialComments: (comments: IComment[]) => set(() => { return { comments } }),
}));

export default store;
