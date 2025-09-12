// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { IUserService } from '../../application/ports/IUserService';

export class UserControllerAdapter {
  constructor(private userService: IUserService) {}

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }
      
      // For /user/me route, return the user data directly from req.user
      // since it's already been processed by the firebaseAuth middleware
      const user = req.user as any;
      res.status(200).json({
        success: true,
        data: {
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
          picture: (req as any).firebaseUser?.picture || null
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.params;
      const result = await this.userService.getUserByEmail(email);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateSubscriptionStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }
      
      const userId = (req.user as any)._id;
      const { isStartSubscription } = req.body;
      const result = await this.userService.updateSubscriptionStatus(userId, isStartSubscription);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }
      
      const userId = (req.user as any)._id;
      const result = await this.userService.deleteUser(userId);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      next(error);
    }
  }

  async addFavoriteMusic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }
      
      const userId = (req.user as any)._id;
      const { music } = req.params;
      const result = await this.userService.addFavoriteMusic(userId, music);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  }

  async addFavoriteVideo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }
      
      const userId = (req.user as any)._id;
      const { video } = req.params;
      const result = await this.userService.addFavoriteVideo(userId, video);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  }

  async checkAndCreateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.params;
      const result = await this.userService.checkAndCreateUser(email);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  }
}
