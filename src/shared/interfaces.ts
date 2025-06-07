export interface IQuote {
  id: number;
  documentId: string;
  quote: string;
  likes: number[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  requote: string | null;
  requotes: number[];
  page: string;
  note: string;
  private: boolean;
  comments?: IComment[];
  user: IUser;
  book: IBook;
  // author: any;
}

export interface IComment {
  id: number;
  quoteId: number;
  documentId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  user: IUser;
}

export interface IBook {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  title: string;
  identifier: string;
}

export interface IGoogleBook {
  accessInfo: any;
  etag: string;
  id: string;
  kind: string;
  saleInfo: any;
  selfLink: string;
  volumeInfo: any;
}

export interface IUser {
  id: number;
  documentId?: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  firstName: string;
  lastName: string;
  bio: string;
  following: number[],
  role?: IRole;
  books?: IBook[];
  avatar: IAvatar;
  memberId?: string;
  memberFreePass?: boolean;
}

export interface IProfile extends IUser {}

export interface IRole {
  id: number;
  documentId: string;
  name: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface IAvatar {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null,
  caption: string | null,
  width: number;
  height: number;
  formats: any,
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null,
  provider: string;
  provider_metadata: string | null,
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface IUserCookie {
  jwt: string;
  user: IUser;
}

export interface IPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}
