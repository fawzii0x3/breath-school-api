import { IFirebaseService } from '../../application/ports/IFirebaseService';
import { IUserRepository } from '../repositories/IUserRepository';
import { TokenVerificationResult, AuthResult, FirebaseUser } from '../entities/Auth';
import { User } from '../entities/User';

export class VerifyFirebaseTokenUseCase {
  constructor(
    private firebaseService: IFirebaseService,
    private userRepository: IUserRepository
  ) {}

  async execute(token: string): Promise<AuthResult> {
    try {
      if (!token) {
        return {
          success: false,
          error: 'Token is required'
        };
      }

      // Verify Firebase token
      const verificationResult = await this.firebaseService.verifyToken(token);
      
      if (!verificationResult.success || !verificationResult.decodedToken) {
        return {
          success: false,
          error: 'Invalid or expired token'
        };
      }

      const decodedToken = verificationResult.decodedToken;
      
      // Find or create user
      let user = await this.userRepository.findByFirebaseUid(decodedToken.uid);
      
      if (!user && decodedToken.email) {
        // Try to find by email as fallback
        user = await this.userRepository.findByEmail(decodedToken.email);
        
        if (user && !user.firebaseUid) {
          // Update existing user with Firebase UID
          await this.userRepository.update(user._id, {
            firebaseUid: decodedToken.uid
          });
        }
      }

      if (!user) {
        return {
          success: false,
          error: 'User not found and could not be created'
        };
      }

      const firebaseUser: FirebaseUser = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture,
        phone_number: decodedToken.phone_number
      };

      return {
        success: true,
        user: this.mapToUserResponse(user),
        firebaseUser
      };
    } catch (error) {
      console.error('VerifyFirebaseTokenUseCase error:', error);
      return {
        success: false,
        error: 'Token verification failed'
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
