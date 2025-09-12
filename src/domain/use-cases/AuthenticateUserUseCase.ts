import { IUserRepository } from '../repositories/IUserRepository';
import { IPasswordService } from '../../application/services/PasswordService';

export class AuthenticateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService
  ) {}

  async execute(email: string, password: string): Promise<{ success: boolean; user?: any; token?: string; info?: string }> {
    try {
      if (!email || !password) {
        return { success: false, info: 'Email and password are required' };
      }

      // Find user with password included (for authentication)
      const { UserModel } = require('../../infrastructure/models/UserModel');
      const user = await UserModel.findOne({ email }, { __v: 0 });
      
      if (!user) {
        return { success: false, info: 'User not found' };
      }

      const isPasswordValid = await this.passwordService.comparePassword(password, user.password);
      
      if (!isPasswordValid) {
        return { success: false, info: 'Invalid password' };
      }

      const token = this.passwordService.generateToken(user._id.toString());
      
      return {
        success: true,
        user: this.mapToUserResponse(user),
        token
      };
    } catch (error) {
      console.error('AuthenticateUserUseCase error:', error);
      return {
        success: false,
        info: 'Authentication failed'
      };
    }
  }

  private mapToUserResponse(user: any): any {
    return {
      _id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      firebaseUid: user.firebaseUid,
      suscription: user.suscription,
      isStartSubscription: user.isStartSubscription,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      promotionDays: user.promotionDays
    };
  }
}
