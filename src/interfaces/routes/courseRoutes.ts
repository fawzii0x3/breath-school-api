import { Router } from 'express';
import { CourseController } from '../controllers/CourseController';

export function createCourseRoutes(courseController: CourseController): Router {
  const router = Router();

  router.get('/courses', (req, res) => courseController.getAllCourses(req, res));
  router.get('/courses/:courseId', (req, res) => courseController.getCourseById(req, res));
  router.get('/courses/level/:level', (req, res) => courseController.getCoursesByLevel(req, res));
  router.post('/courses', (req, res) => courseController.createCourse(req, res));

  return router;
}