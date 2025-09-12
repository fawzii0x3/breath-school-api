import { LoginUseCase } from '../../domain/use-cases/LoginUseCase';
import { VerifyFirebaseTokenUseCase } from '../../domain/use-cases/VerifyFirebaseTokenUseCase';
import { GetCurrentUserUseCase } from '../../domain/use-cases/GetCurrentUserUseCase';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IFirebaseService } from '../ports/IFirebaseService';
import { LoginRequest, LoginResponse, AuthResult } from '../../domain/entities/Auth';

export class AuthService {
  private loginUseCase: LoginUseCase;
  private verifyFirebaseTokenUseCase: VerifyFirebaseTokenUseCase;
  private getCurrentUserUseCase: GetCurrentUserUseCase;

  constructor(
    private userRepository: IUserRepository,
    private firebaseService: IFirebaseService
  ) {
    this.loginUseCase = new LoginUseCase(userRepository, firebaseService);
    this.verifyFirebaseTokenUseCase = new VerifyFirebaseTokenUseCase(firebaseService, userRepository);
    this.getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    return this.loginUseCase.execute(request);
  }

  async verifyFirebaseToken(token: string): Promise<AuthResult> {
    return this.verifyFirebaseTokenUseCase.execute(token);
  }

  async getCurrentUser(userId: string): Promise<{ success: boolean; user?: any; error?: string }> {
    return this.getCurrentUserUseCase.execute(userId);
  }
}
