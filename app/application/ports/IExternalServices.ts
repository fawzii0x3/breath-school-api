// Port for Firebase Admin service
export interface IFirebaseService {
  verifyToken(token: string): Promise<{ uid: string; email?: string; name?: string; picture?: string; phone_number?: string }>;
  createUser(userData: { email: string; password: string; displayName?: string }): Promise<{ uid: string }>;
  updateUser(uid: string, userData: { displayName?: string; email?: string }): Promise<void>;
  deleteUser(uid: string): Promise<void>;
  setCustomUserClaims(uid: string, claims: Record<string, any>): Promise<void>;
}

// Port for Systeme API service
export interface ISystemeService {
  createUserTag(userId: string, tag: string): Promise<boolean>;
  removeUserTag(userId: string, tag: string): Promise<boolean>;
  getUserTags(userId: string): Promise<string[]>;
  updateUserTags(userId: string, tags: string[]): Promise<boolean>;
  checkUserExists(email: string): Promise<boolean>;
  createUser(email: string, fullName?: string): Promise<{ success: boolean; userId?: string; error?: string }>;
  getUserByEmail(email: string): Promise<{ success: boolean; user?: any; error?: string }>;
}
