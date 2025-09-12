import { IUserRepository } from '../repositories/IUserRepository';
import { IPasswordService } from '../../application/services/PasswordService';

export class UpdatePasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService
  ) {}

  async execute(userId: string, newPassword: string): Promise<{ success: boolean; info: string }> {
    try {
      if (!userId || !newPassword) {
        return { success: false, info: 'User ID and new password are required' };
      }

      const hashedPassword = this.passwordService.hashPassword(newPassword);
      
      const result = await this.userRepository.updatePassword(userId, hashedPassword);
      
      if (result) {
        return { success: true, info: 'Password updated successfully' };
      } else {
        return { success: false, info: 'Failed to update password' };
      }
    } catch (error) {
      console.error('UpdatePasswordUseCase error:', error);
      return {
        success: false,
        info: 'Failed to update password'
      };
    }
  }
}
