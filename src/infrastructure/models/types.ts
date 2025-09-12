// Common types for the application

export interface IUserDocument {
  _id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin' | 'branch' | 'partner';
  firebaseUid: string;
  securityToken?: string;
  suscription: boolean;
  isStartSubscription: boolean;
  promotionDays?: number;
  picture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreateData {
  email: string;
  fullName?: string;
  firebaseUid: string;
  role?: 'user' | 'admin' | 'branch' | 'partner';
  securityToken?: string;
  suscription?: boolean;
  isStartSubscription?: boolean;
  picture?: string;
}

export interface IUserUpdateData {
  fullName?: string;
  role?: 'user' | 'admin' | 'branch' | 'partner';
  securityToken?: string;
  suscription?: boolean;
  isStartSubscription?: boolean;
  picture?: string;
}

export interface IUserQuery {
  email?: string;
  firebaseUid?: string;
  role?: 'user' | 'admin' | 'branch' | 'partner';
  suscription?: boolean;
  isStartSubscription?: boolean;
}

// Mongoose query options
export interface IUserQueryOptions {
  select?: string;
  populate?: string | string[];
  sort?: string | { [key: string]: 1 | -1 };
  limit?: number;
  skip?: number;
}

// Response types
export interface IUserResponse {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  firebaseUid: string;
  suscription: boolean;
  isStartSubscription: boolean;
  createdAt: Date;
  updatedAt: Date;
  promotionDays?: number;
  picture?: string;
}

// Error types
export interface IUserError {
  code: string;
  message: string;
  field?: string;
}

// Service response types
export interface IServiceResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: IUserError;
}

// Pagination types
export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sort?: string | { [key: string]: 1 | -1 };
}

export interface IPaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}
