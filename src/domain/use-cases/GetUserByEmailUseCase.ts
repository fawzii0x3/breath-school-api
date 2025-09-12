import { IUserRepository } from '../repositories/IUserRepository';
import { UserResponse } from '../entities/User';

export class GetUserByEmailUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string): Promise<{ success: boolean; message: string; data?: UserResponse }> {
    try {
      if (!email) {
        return {
          success: false,
          message: 'Email is required'
        };
      }

      const user = await this.userRepository.findByEmail(email);
      
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      return {
        success: true,
        message: 'User found',
        data: user
      };
    } catch (error) {
      throw new Error(`Failed to get user by email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
