import { IUserRepository } from '../repositories/IUserRepository';
import { UserFavoriteResponse } from '../entities/User';

export class AddFavoriteVideoUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, videoId: string): Promise<UserFavoriteResponse> {
    try {
      // First check if user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return {
          success: false,
          video: null
        };
      }

      // This would need to be implemented in the repository to check if video is already favorited
      // For now, we'll assume the repository handles the toggle logic
      const result = await this.userRepository.addFavoriteVideo(userId, videoId);
      
      return {
        success: result,
        video: result ? { _id: videoId } : null
      };
    } catch (error) {
      throw new Error(`Failed to add favorite video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
