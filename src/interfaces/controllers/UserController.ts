import { Request, Response } from 'express';
import { UserService } from '../../application/use-cases/UserService';

export class UserController {
  constructor(private userService: UserService) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { firebaseToken, email, displayName } = req.body;

      if (!firebaseToken || !email) {
        res.status(400).json({ 
          error: 'Firebase token and email are required' 
        });
        return;
      }

      const user = await this.userService.createUser(firebaseToken, email, displayName);
      res.status(201).json(user);
    } catch (error) {
      console.error('Create user error:', error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Failed to create user' 
      });
    }
  }

  async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const firebaseToken = req.headers.authorization?.replace('Bearer ', '');

      if (!firebaseToken) {
        res.status(401).json({ 
          error: 'Authorization header is required' 
        });
        return;
      }

      const user = await this.userService.getUserProfile(firebaseToken);
      res.json(user);
    } catch (error) {
      console.error('Get user profile error:', error);
      res.status(404).json({ 
        error: error instanceof Error ? error.message : 'User not found' 
      });
    }
  }

  async updateSubscription(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { planId } = req.body;

      if (!planId) {
        res.status(400).json({ 
          error: 'Plan ID is required' 
        });
        return;
      }

      const user = await this.userService.updateSubscription(userId, planId);
      res.json(user);
    } catch (error) {
      console.error('Update subscription error:', error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Failed to update subscription' 
      });
    }
  }
}