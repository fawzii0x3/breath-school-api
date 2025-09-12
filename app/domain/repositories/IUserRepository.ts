import { User, UserCreateRequest, UserUpdateRequest, UserResponse } from '../entities/User';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByFirebaseUid(firebaseUid: string): Promise<User | null>;
  create(userData: UserCreateRequest & { _id?: string }): Promise<User>;
  update(id: string, userData: Partial<UserUpdateRequest>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  updatePassword(userId: string, hashedPassword: string): Promise<boolean>;
  addFavoriteMusic(userId: string, musicId: string): Promise<boolean>;
  removeFavoriteMusic(userId: string, musicId: string): Promise<boolean>;
  addFavoriteVideo(userId: string, videoId: string): Promise<boolean>;
  removeFavoriteVideo(userId: string, videoId: string): Promise<boolean>;
}
