import { Router } from 'express';
import { BreathingSessionController } from '../controllers/BreathingSessionController';

export function createBreathingSessionRoutes(sessionController: BreathingSessionController): Router {
  const router = Router();

  router.post('/sessions', (req, res) => sessionController.createSession(req, res));
  router.get('/sessions', (req, res) => sessionController.getUserSessions(req, res));
  router.put('/sessions/:sessionId/complete', (req, res) => sessionController.completeSession(req, res));

  return router;
}