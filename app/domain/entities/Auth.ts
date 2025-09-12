export interface AuthToken {
  token: string;
  expiresAt: Date;
  userId: string;
}

export interface FirebaseUser {
  uid: string;
  email: string;
  name?: string;
  picture?: string;
  phone_number?: string;
}

export interface AuthResult {
  success: boolean;
  user?: any;
  token?: string;
  firebaseUser?: FirebaseUser;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
  firebaseToken?: string;
}

export interface LoginResponse {
  success: boolean;
  user?: any;
  token?: string;
  firebaseUser?: FirebaseUser;
  message?: string;
}

export interface TokenVerificationResult {
  success: boolean;
  decodedToken?: any;
  error?: string;
}

export interface AuthContext {
  user: any;
  firebaseUser?: FirebaseUser;
  isAuthenticated: boolean;
}
