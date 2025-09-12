import { IUserRepository } from '../repositories/IUserRepository';
import { User } from '../entities/User';

export class GetCurrentUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      if (!userId) {
        return {
          success: false,
          error: 'User ID is required'
        };
      }

      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        user: this.mapToUserResponse(user)
      };
    } catch (error) {
      console.error('GetCurrentUserUseCase error:', error);
      return {
        success: false,
        error: 'Failed to get user'
      };
    }
  }

  private mapToUserResponse(user: User): any {
    return {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      firebaseUid: user.firebaseUid,
      suscription: user.suscription,
      isStartSubscription: user.isStartSubscription,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      promotionDays: user.promotionDays,
      picture: user.picture
    };
  }
}
