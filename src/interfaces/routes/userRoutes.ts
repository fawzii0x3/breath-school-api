import { Router } from 'express';
import { UserController } from '../controllers/UserController';

export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  router.post('/users', (req, res) => userController.createUser(req, res));
  router.get('/users/profile', (req, res) => userController.getUserProfile(req, res));
  router.put('/users/:userId/subscription', (req, res) => userController.updateSubscription(req, res));

  return router;
}