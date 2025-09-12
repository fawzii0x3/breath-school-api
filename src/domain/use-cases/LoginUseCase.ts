import { IUserRepository } from '../repositories/IUserRepository';
import { IFirebaseService } from '../../application/ports/IFirebaseService';
import { LoginRequest, LoginResponse, AuthResult } from '../entities/Auth';
import { User } from '../entities/User';

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private firebaseService: IFirebaseService
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    try {
      if (!request.email) {
        return {
          success: false,
          message: 'Email is required'
        };
      }

      // Find user by email
      const user = await this.userRepository.findByEmail(request.email);
      
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // If Firebase token is provided, verify it
      if (request.firebaseToken) {
        const verificationResult = await this.firebaseService.verifyToken(request.firebaseToken);
        
        if (!verificationResult.success) {
          return {
            success: false,
            message: 'Invalid Firebase token'
          };
        }

        // Update user with Firebase UID if not set
        if (!user.firebaseUid && verificationResult.decodedToken?.uid) {
          await this.userRepository.update(user._id, {
            firebaseUid: verificationResult.decodedToken.uid
          });
        }
      }

      return {
        success: true,
        user: this.mapToUserResponse(user),
        message: 'Login successful'
      };
    } catch (error) {
      console.error('LoginUseCase error:', error);
      return {
        success: false,
        message: 'Login failed'
      };
    }
  }

  private mapToUserResponse(user: User): any {
    return {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      firebaseUid: user.firebaseUid,
      suscription: user.suscription,
      isStartSubscription: user.isStartSubscription,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      promotionDays: user.promotionDays,
      picture: user.picture
    };
  }
}
