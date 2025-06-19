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
  user: IProfile;
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
  user: IProfile;
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
  email: string;
  email_verified: boolean;
  phone_verified: boolean;
  sub: string;
  username: string;
}

export interface IProfile {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  created_at: string;
  updated_at: string;
  published_at: string;
  first_name: string;
  last_name: string;
  bio: string;
  following: number[],
  role?: IRole;
  books?: IBook[];
  avatar: IAvatar;
  member_id?: string;
  member_free_pass?: boolean;
}

// export interface IProfile extends IUser {}

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
  user: IUser;
  profile: IProfile;
}

export interface IPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}
