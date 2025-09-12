import { IUserRepository } from '../repositories/IUserRepository';

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<{ success: boolean; info: string }> {
    try {
      const deleted = await this.userRepository.delete(userId);

      if (!deleted) {
        return {
          success: false,
          info: 'User not found'
        };
      }

      return {
        success: true,
        info: 'User account successfully deleted'
      };
    } catch (error) {
      throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
