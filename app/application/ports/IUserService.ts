import { UserResponse, UserCreateRequest, UserUpdateRequest, UserLoginRequest, UserLoginResponse, UserFavoriteRequest, UserFavoriteResponse } from '../../domain/entities/User';

export interface IUserService {
  getUserById(userId: string): Promise<{ success: boolean; info: string; data?: UserResponse }>;
  getUserByEmail(email: string): Promise<{ success: boolean; message: string; data?: UserResponse }>;
  getUserByFirebaseUid(firebaseUid: string): Promise<{ success: boolean; info: string; data?: UserResponse }>;
  createUser(userData: UserCreateRequest & { _id?: string }): Promise<{ success: boolean; info: string; data?: UserResponse }>;
  updateUser(userId: string, userData: Partial<UserUpdateRequest>): Promise<{ success: boolean; info: string; data?: UserResponse }>;
  updateSubscriptionStatus(userId: string, isStartSubscription: boolean): Promise<{ success: boolean; info: string; user?: UserResponse }>;
  deleteUser(userId: string): Promise<{ success: boolean; info: string }>;
  addFavoriteMusic(userId: string, musicId: string): Promise<UserFavoriteResponse>;
  addFavoriteVideo(userId: string, videoId: string): Promise<UserFavoriteResponse>;
  checkAndCreateUser(email: string): Promise<{ success: boolean; info: string; data?: UserResponse; created?: boolean }>;
}
