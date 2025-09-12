export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  BRANCH = 'branch',
  PARTNER = 'partner'
}

export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: UserRole;
  firebaseUid: string;
  securityToken?: string;
  suscription: boolean;
  isStartSubscription: boolean;
  createdAt: Date;
  updatedAt: Date;
  promotionDays?: number;
  picture?: string;
}

export interface UserCreateRequest {
  email: string;
  fullName?: string;
  firebaseUid: string;
  role?: UserRole;
  picture?: string;
}

export interface UserUpdateRequest {
  _id: string;
  fullName?: string;
  suscription?: boolean;
  isStartSubscription?: boolean;
  picture?: string;
  firebaseUid?: string;
}

export interface UserResponse {
  _id: string;
  email: string;
  fullName: string;
  role: UserRole;
  firebaseUid: string;
  suscription: boolean;
  isStartSubscription: boolean;
  createdAt: Date;
  updatedAt: Date;
  promotionDays?: number;
  picture?: string;
}

// Password-based login removed - using Firebase authentication

export interface UserFavoriteRequest {
  userId: string;
  musicId?: string;
  videoId?: string;
}

export interface UserFavoriteResponse {
  success: boolean;
  music?: any;
  video?: any;
  data?: any;
  info?: string;
}

// Add missing types for login functionality
export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  success: boolean;
  token?: string;
  user?: UserResponse;
  message?: string;
}
