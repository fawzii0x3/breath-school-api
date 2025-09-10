import { Request, Response, NextFunction } from 'express';
import { FirebaseAuthService } from '../../infrastructure/authentication/FirebaseAuthService';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
  };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'Authorization header is required' });
    return;
  }

  const authService = FirebaseAuthService.getInstance();
  
  authService.verifyToken(token)
    .then(user => {
      if (!user) {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }
      req.user = user;
      next();
    })
    .catch(error => {
      console.error('Authentication error:', error);
      res.status(401).json({ error: 'Authentication failed' });
    });
}

export function optionalAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    next();
    return;
  }

  const authService = FirebaseAuthService.getInstance();
  
  authService.verifyToken(token)
    .then(user => {
      if (user) {
        req.user = user;
      }
      next();
    })
    .catch(error => {
      console.error('Optional authentication error:', error);
      next();
    });
}