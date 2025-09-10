import { User, SubscriptionStatus } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { AuthenticationService, SubscriptionService } from '../../domain/services/ExternalServices';

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthenticationService,
    private subscriptionService: SubscriptionService
  ) {}

  async createUser(firebaseToken: string, email: string, displayName?: string): Promise<User> {
    const authData = await this.authService.verifyToken(firebaseToken);
    if (!authData) {
      throw new Error('Invalid Firebase token');
    }

    const existingUser = await this.userRepository.findByFirebaseUid(authData.uid);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create customer in Systeme.io
    const { customerId } = await this.subscriptionService.createCustomer(email, displayName);

    const userData = {
      email,
      displayName,
      firebaseUid: authData.uid,
      systemeCustomerId: customerId,
      subscriptionStatus: SubscriptionStatus.INACTIVE,
    };

    return await this.userRepository.create(userData);
  }

  async getUserProfile(firebaseToken: string): Promise<User> {
    const authData = await this.authService.verifyToken(firebaseToken);
    if (!authData) {
      throw new Error('Invalid Firebase token');
    }

    const user = await this.userRepository.findByFirebaseUid(authData.uid);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateSubscription(userId: string, planId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.systemeCustomerId) {
      throw new Error('User not found or no Systeme customer ID');
    }

    const { status } = await this.subscriptionService.updateSubscription(user.systemeCustomerId, planId);
    
    return await this.userRepository.update(userId, {
      subscriptionStatus: status as SubscriptionStatus,
      subscriptionPlan: planId,
    }) as User;
  }
}