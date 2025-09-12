import { AuthService } from '../../application/services/AuthService';
import { LoginRequest, LoginResponse, AuthResult } from '../../domain/entities/Auth';

export class AuthControllerAdapter {
  constructor(private authService: AuthService) {}

  async login(req: any, res: any): Promise<void> {
    try {
      const { email, password, firebaseToken } = req.body;

      const loginRequest: LoginRequest = {
        email,
        password,
        firebaseToken
      };

      const result = await this.authService.login(loginRequest);

      if (result.success) {
        res.status(200).json({
          success: true,
          user: result.user,
          token: result.token,
          message: result.message
        });
      } else {
        res.status(401).json({
          success: false,
          message: result.message || 'Login failed'
        });
      }
    } catch (error) {
      console.error('AuthControllerAdapter login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async verifyFirebaseToken(req: any, res: any): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          message: 'No Firebase ID token provided'
        });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      const result = await this.authService.verifyFirebaseToken(token);

      if (result.success) {
        res.status(200).json({
          success: true,
          user: result.user,
          firebaseUser: result.firebaseUser,
          message: 'Token verification successful'
        });
      } else {
        res.status(401).json({
          success: false,
          message: result.error || 'Token verification failed'
        });
      }
    } catch (error) {
      console.error('AuthControllerAdapter verifyFirebaseToken error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getCurrentUser(req: any, res: any): Promise<void> {
    try {
      const userId = req.user?._id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const result = await this.authService.getCurrentUser(userId);

      if (result.success) {
        res.status(200).json({
          success: true,
          data: result.user
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.error || 'User not found'
        });
      }
    } catch (error) {
      console.error('AuthControllerAdapter getCurrentUser error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
