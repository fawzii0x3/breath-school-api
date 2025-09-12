import { IUserRepository } from '../repositories/IUserRepository';
import { UserResponse } from '../entities/User';

export class UpdateSubscriptionStatusUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, isStartSubscription: boolean): Promise<{ success: boolean; info: string; user?: UserResponse }> {
    try {
      if (typeof isStartSubscription !== 'boolean') {
        return {
          success: false,
          info: 'Invalid subscription status'
        };
      }

      const updatedUser = await this.userRepository.update(userId, { 
        _id: userId, 
        isStartSubscription 
      });

      if (!updatedUser) {
        return {
          success: false,
          info: 'User not found'
        };
      }

      return {
        success: true,
        info: 'Subscription status updated',
        user: updatedUser
      };
    } catch (error) {
      throw new Error(`Failed to update subscription status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
