import { IUserRepository } from '../repositories/IUserRepository';
import { UserResponse } from '../entities/User';

export class GetUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<{ success: boolean; info: string; data?: UserResponse }> {
    try {
      if (!userId) {
        return {
          success: false,
          info: 'Invalid data structure'
        };
      }

      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        return {
          success: false,
          info: 'User not found'
        };
      }

      return {
        success: true,
        info: 'Ok',
        data: user
      };
    } catch (error) {
      throw new Error(`Failed to get user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
