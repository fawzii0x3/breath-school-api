import { IUserService } from '../../application/ports/IUserService';
import { AuthService } from '../../application/services/AuthService';
import { CreateSystemeContactUseCase } from '../../domain/use-cases/CreateSystemeContactUseCase';
import { ISystemeService } from '../../application/ports/ISystemeService';

export class UserControllerAdapterV2 {
  private createSystemeContactUseCase: CreateSystemeContactUseCase;

  constructor(
    private userService: IUserService,
    private authService: AuthService,
    private systemeService: ISystemeService
  ) {
    this.createSystemeContactUseCase = new CreateSystemeContactUseCase(systemeService);
  }

  async getCurrentUser(req: any, res: any): Promise<void> {
    try {
      // For /user/me route, user info comes from req.user (set by firebaseAuth middleware)
      if (req.user) {
        res.json({ 
          success: true, 
          data: {
            _id: req.user._id,
            email: req.user.email,
            fullName: req.user.fullName,
            role: req.user.role,
            firebaseUid: req.user.firebaseUid,
            suscription: req.user.suscription,
            isStartSubscription: req.user.isStartSubscription,
            createdAt: req.user.createdAt,
            updatedAt: req.user.updatedAt,
            promotionDays: req.user.promotionDays,
            picture: req.firebaseUser?.picture || null
          }
        });
        return;
      }
      
      // Fallback: if no user in req.user, try to get from params (for other routes)
      const { userId, email } = req.params;
      if (userId) {
        const result = await this.authService.getCurrentUser(userId);
        
        if (result.success) {
          res.json({ success: true, data: result.user });
        } else {
          res.status(404).json({ success: false, message: result.error || 'User not found' });
        }
        return;
      }
      
      // If email is provided, use the new check and create functionality
      if (email) {
        const result = await this.userService.checkAndCreateUser(email);
        
        if (!result.success) {
          res.status(404).json({ 
            success: false, 
            message: result.info 
          });
          return;
        }
        
        res.json({ 
          success: true, 
          data: result.data,
          created: result.created || false,
          message: result.info
        });
        return;
      }
      
      res.status(401).json({ success: false, message: 'User not authenticated' });
    } catch (error) {
      console.error('UserControllerAdapterV2 getCurrentUser error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async checkAndCreateUser(req: any, res: any): Promise<void> {
    try {
      const { email } = req.params;
      
      if (!email) {
        res.status(400).json({
          success: false,
          message: 'Email parameter is required'
        });
        return;
      }

      const result = await this.userService.checkAndCreateUser(email);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          created: result.created || false,
          message: result.info
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.info || 'Failed to check/create user'
        });
      }
    } catch (error) {
      console.error('UserControllerAdapterV2 checkAndCreateUser error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async createUser(req: any, res: any): Promise<void> {
    try {
      const { email, fullName, firebaseUid, role, picture } = req.body;
      
      if (!email || !firebaseUid) {
        res.status(400).json({
          success: false,
          message: 'Email and firebaseUid are required'
        });
        return;
      }

      const result = await this.userService.createUser({
        email,
        fullName,
        firebaseUid,
        role,
        picture
      });

      if (result.success) {
        res.status(201).json({
          success: true,
          data: result.data,
          message: result.info
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.info || 'Failed to create user'
        });
      }
    } catch (error) {
      console.error('UserControllerAdapterV2 createUser error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async updateSubscriptionStatus(req: any, res: any): Promise<void> {
    try {
      const { userId } = req.params;
      const { suscription, isStartSubscription } = req.body;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }

      const result = await this.userService.updateSubscriptionStatus(userId, {
        suscription,
        isStartSubscription
      });

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: result.info
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.info || 'Failed to update subscription status'
        });
      }
    } catch (error) {
      console.error('UserControllerAdapterV2 updateSubscriptionStatus error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async addFavoriteMusic(req: any, res: any): Promise<void> {
    try {
      const { userId, musicId } = req.body;
      
      if (!userId || !musicId) {
        res.status(400).json({
          success: false,
          message: 'User ID and music ID are required'
        });
        return;
      }

      const result = await this.userService.addFavoriteMusic(userId, musicId);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: result.info
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.info || 'Failed to add favorite music'
        });
      }
    } catch (error) {
      console.error('UserControllerAdapterV2 addFavoriteMusic error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async addFavoriteVideo(req: any, res: any): Promise<void> {
    try {
      const { userId, videoId } = req.body;
      
      if (!userId || !videoId) {
        res.status(400).json({
          success: false,
          message: 'User ID and video ID are required'
        });
        return;
      }

      const result = await this.userService.addFavoriteVideo(userId, videoId);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: result.info
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.info || 'Failed to add favorite video'
        });
      }
    } catch (error) {
      console.error('UserControllerAdapterV2 addFavoriteVideo error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
