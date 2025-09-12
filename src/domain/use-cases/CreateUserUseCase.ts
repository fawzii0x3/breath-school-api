import { IUserRepository } from '../repositories/IUserRepository';
import { UserCreateRequest, UserResponse, UserRole } from '../entities/User';

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userData: UserCreateRequest & { _id?: string }): Promise<{ success: boolean; info: string; data?: UserResponse }> {
    try {
      // Check if user already exists
      if (userData._id) {
        const existingUser = await this.userRepository.findById(userData._id);
        if (existingUser) {
          return {
            success: false,
            info: 'User with this ID already exists'
          };
        }
      }

      // Check if email already exists
      const existingUserByEmail = await this.userRepository.findByEmail(userData.email);
      if (existingUserByEmail) {
        return {
          success: false,
          info: 'User with this email already exists'
        };
      }

      // Create user
      const user = await this.userRepository.create({
        _id: userData._id,
        email: userData.email,
        fullName: userData.fullName || 'usuario',
        firebaseUid: userData.firebaseUid,
        role: userData.role || UserRole.USER
      });

      return {
        success: true,
        info: 'User created successfully',
        data: {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          firebaseUid: user.firebaseUid,
          suscription: user.suscription,
          isStartSubscription: user.isStartSubscription,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      };
    } catch (error) {
      console.error('CreateUserUseCase error:', error);
      return {
        success: false,
        info: `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}
