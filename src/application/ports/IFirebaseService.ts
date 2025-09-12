import { TokenVerificationResult } from '../../domain/entities/Auth';

export interface IFirebaseService {
  verifyToken(token: string): Promise<TokenVerificationResult>;
  initialize(): Promise<void>;
  deleteUser(userId: string): Promise<{ success: boolean; error?: string }>;
}
