import { IUserService } from '../ports/IUserService';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IFirebaseService } from '../ports/IFirebaseService';
import { ISystemeService } from '../ports/ISystemeService';
import { IPasswordService } from './PasswordService';
import { GetUserByIdUseCase } from '../../domain/use-cases/GetUserByIdUseCase';
import { GetUserByEmailUseCase } from '../../domain/use-cases/GetUserByEmailUseCase';
import { GetUserByFirebaseUidUseCase } from '../../domain/use-cases/GetUserByFirebaseUidUseCase';
import { CreateUserUseCase } from '../../domain/use-cases/CreateUserUseCase';
import { UpdateSubscriptionStatusUseCase } from '../../domain/use-cases/UpdateSubscriptionStatusUseCase';
import { DeleteUserUseCase } from '../../domain/use-cases/DeleteUserUseCase';
import { AddFavoriteMusicUseCase } from '../../domain/use-cases/AddFavoriteMusicUseCase';
import { AddFavoriteVideoUseCase } from '../../domain/use-cases/AddFavoriteVideoUseCase';
import { CheckAndCreateUserUseCase } from '../../domain/use-cases/CheckAndCreateUserUseCase';
// Password authentication use cases removed - using Firebase authentication

export class UserService implements IUserService {
  private getUserByIdUseCase: GetUserByIdUseCase;
  private getUserByEmailUseCase: GetUserByEmailUseCase;
  private getUserByFirebaseUidUseCase: GetUserByFirebaseUidUseCase;
  private createUserUseCase: CreateUserUseCase;
  private updateSubscriptionStatusUseCase: UpdateSubscriptionStatusUseCase;
  private deleteUserUseCase: DeleteUserUseCase;
  private addFavoriteMusicUseCase: AddFavoriteMusicUseCase;
  private addFavoriteVideoUseCase: AddFavoriteVideoUseCase;
  private checkAndCreateUserUseCase: CheckAndCreateUserUseCase;

  constructor(
    private userRepository: IUserRepository,
    private firebaseService: IFirebaseService,
    private systemeService: ISystemeService
  ) {
    this.getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
    this.getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);
    this.getUserByFirebaseUidUseCase = new GetUserByFirebaseUidUseCase(userRepository);
    this.createUserUseCase = new CreateUserUseCase(userRepository);
    this.updateSubscriptionStatusUseCase = new UpdateSubscriptionStatusUseCase(userRepository);
    this.deleteUserUseCase = new DeleteUserUseCase(userRepository);
    this.addFavoriteMusicUseCase = new AddFavoriteMusicUseCase(userRepository);
    this.addFavoriteVideoUseCase = new AddFavoriteVideoUseCase(userRepository);
    this.checkAndCreateUserUseCase = new CheckAndCreateUserUseCase(userRepository, systemeService);
  }

  async getUserById(userId: string): Promise<{ success: boolean; info: string; data?: any }> {
    return this.getUserByIdUseCase.execute(userId);
  }

  async getUserByEmail(email: string): Promise<{ success: boolean; message: string; data?: any }> {
    return this.getUserByEmailUseCase.execute(email);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<{ success: boolean; info: string; data?: any }> {
    return this.getUserByFirebaseUidUseCase.execute(firebaseUid);
  }

  async createUser(userData: { _id?: string; email: string; fullName?: string; firebaseUid: string; role?: 'user' | 'admin' | 'branch' | 'partner' }): Promise<{ success: boolean; info: string; data?: any }> {
    return this.createUserUseCase.execute(userData);
  }

  async updateUser(userId: string, userData: any): Promise<{ success: boolean; info: string; data?: any }> {
    try {
      const result = await this.userRepository.update(userId, userData);
      if (result) {
        return {
          success: true,
          info: 'User updated successfully',
          data: result
        };
      } else {
        return {
          success: false,
          info: 'User not found'
        };
      }
    } catch (error) {
      console.error('UpdateUser error:', error);
      return {
        success: false,
        info: `Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async updateSubscriptionStatus(userId: string, isStartSubscription: boolean): Promise<{ success: boolean; info: string; user?: any }> {
    const result = await this.updateSubscriptionStatusUseCase.execute(userId, isStartSubscription);
    
    // Update user tags in Systeme service based on subscription status
    if (result.success && result.user) {
      try {
        if (isStartSubscription) {
          await this.systemeService.createUserTag(userId, 'premium');
        } else {
          await this.systemeService.removeUserTag(userId, 'premium');
        }
      } catch (error) {
        console.error('Failed to update user tags in Systeme:', error);
        // Don't fail the main operation if tag update fails
      }
    }

    return result;
  }

  async deleteUser(userId: string): Promise<{ success: boolean; info: string }> {
    const result = await this.deleteUserUseCase.execute(userId);
    
    // Clean up external services
    if (result.success) {
      try {
        // Remove user from Firebase
        await this.firebaseService.deleteUser(userId);
        
        // Remove all user tags from Systeme
        const tags = await this.systemeService.getUserTags(userId);
        for (const tag of tags) {
          await this.systemeService.removeUserTag(userId, tag);
        }
      } catch (error) {
        console.error('Failed to clean up external services:', error);
        // Don't fail the main operation if cleanup fails
      }
    }

    return result;
  }

  async addFavoriteMusic(userId: string, musicId: string): Promise<any> {
    const result = await this.addFavoriteMusicUseCase.execute(userId, musicId);
    
    // Update user tags in Systeme service
    if (result.success) {
      try {
        await this.systemeService.createUserTag(userId, 'music_lover');
      } catch (error) {
        console.error('Failed to update user tags in Systeme:', error);
      }
    }

    return result;
  }

  async addFavoriteVideo(userId: string, videoId: string): Promise<any> {
    const result = await this.addFavoriteVideoUseCase.execute(userId, videoId);
    
    // Update user tags in Systeme service
    if (result.success) {
      try {
        await this.systemeService.createUserTag(userId, 'video_lover');
      } catch (error) {
        console.error('Failed to update user tags in Systeme:', error);
      }
    }

    return result;
  }

  async checkAndCreateUser(email: string): Promise<{ success: boolean; info: string; data?: any; created?: boolean }> {
    return this.checkAndCreateUserUseCase.execute(email);
  }

  // Password authentication methods removed - using Firebase authentication
}