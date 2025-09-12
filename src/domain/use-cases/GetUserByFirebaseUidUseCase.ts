import { IUserRepository } from '../repositories/IUserRepository';

export class GetUserByFirebaseUidUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(firebaseUid: string): Promise<{ success: boolean; info: string; data?: any }> {
    try {
      const user = await this.userRepository.findByFirebaseUid(firebaseUid);
      
      if (!user) {
        return {
          success: false,
          info: 'User not found'
        };
      }

      return {
        success: true,
        info: 'User found successfully',
        data: user
      };
    } catch (error) {
      console.error('GetUserByFirebaseUidUseCase error:', error);
      return {
        success: false,
        info: `Failed to get user by Firebase UID: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}
