import { IUserRepository } from '../repositories/IUserRepository';
import { UserFavoriteResponse } from '../entities/User';

export class AddFavoriteMusicUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, musicId: string): Promise<UserFavoriteResponse> {
    try {
      // First check if music is already favorited
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return {
          success: false,
          music: null
        };
      }

      // This would need to be implemented in the repository to check if music is already favorited
      // For now, we'll assume the repository handles the toggle logic
      const result = await this.userRepository.addFavoriteMusic(userId, musicId);
      
      return {
        success: result,
        music: result ? { _id: musicId } : null
      };
    } catch (error) {
      throw new Error(`Failed to add favorite music: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
