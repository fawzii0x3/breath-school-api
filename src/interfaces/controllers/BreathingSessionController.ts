import { Request, Response } from 'express';
import { BreathingSessionService } from '../../application/use-cases/BreathingSessionService';
import { BreathingTechnique } from '../../domain/entities/BreathingSession';

export class BreathingSessionController {
  constructor(private sessionService: BreathingSessionService) {}

  async createSession(req: Request, res: Response): Promise<void> {
    try {
      const firebaseToken = req.headers.authorization?.replace('Bearer ', '');
      const { title, description, duration, technique } = req.body;

      if (!firebaseToken) {
        res.status(401).json({ 
          error: 'Authorization header is required' 
        });
        return;
      }

      if (!title || !duration || !technique) {
        res.status(400).json({ 
          error: 'Title, duration, and technique are required' 
        });
        return;
      }

      if (!Object.values(BreathingTechnique).includes(technique)) {
        res.status(400).json({ 
          error: 'Invalid breathing technique' 
        });
        return;
      }

      const session = await this.sessionService.createSession(firebaseToken, {
        title,
        description,
        duration: parseInt(duration),
        technique,
      });

      res.status(201).json(session);
    } catch (error) {
      console.error('Create session error:', error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Failed to create session' 
      });
    }
  }

  async getUserSessions(req: Request, res: Response): Promise<void> {
    try {
      const firebaseToken = req.headers.authorization?.replace('Bearer ', '');

      if (!firebaseToken) {
        res.status(401).json({ 
          error: 'Authorization header is required' 
        });
        return;
      }

      const sessions = await this.sessionService.getUserSessions(firebaseToken);
      res.json(sessions);
    } catch (error) {
      console.error('Get user sessions error:', error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Failed to get sessions' 
      });
    }
  }

  async completeSession(req: Request, res: Response): Promise<void> {
    try {
      const firebaseToken = req.headers.authorization?.replace('Bearer ', '');
      const { sessionId } = req.params;

      if (!firebaseToken) {
        res.status(401).json({ 
          error: 'Authorization header is required' 
        });
        return;
      }

      const session = await this.sessionService.completeSession(firebaseToken, sessionId);
      res.json(session);
    } catch (error) {
      console.error('Complete session error:', error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Failed to complete session' 
      });
    }
  }
}