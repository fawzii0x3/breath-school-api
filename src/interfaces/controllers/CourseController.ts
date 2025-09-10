import { Request, Response } from 'express';
import { CourseService } from '../../application/use-cases/CourseService';
import { CourseLevel } from '../../domain/entities/Course';

export class CourseController {
  constructor(private courseService: CourseService) {}

  async getAllCourses(req: Request, res: Response): Promise<void> {
    try {
      const firebaseToken = req.headers.authorization?.replace('Bearer ', '');
      const courses = await this.courseService.getAllCourses(firebaseToken);
      res.json(courses);
    } catch (error) {
      console.error('Get all courses error:', error);
      res.status(500).json({ 
        error: 'Failed to get courses' 
      });
    }
  }

  async getCourseById(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const firebaseToken = req.headers.authorization?.replace('Bearer ', '');
      
      const course = await this.courseService.getCourseById(courseId, firebaseToken);
      res.json(course);
    } catch (error) {
      console.error('Get course by ID error:', error);
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 
                        error instanceof Error && error.message.includes('required') ? 401 : 400;
      res.status(statusCode).json({ 
        error: error instanceof Error ? error.message : 'Failed to get course' 
      });
    }
  }

  async getCoursesByLevel(req: Request, res: Response): Promise<void> {
    try {
      const { level } = req.params;

      if (!Object.values(CourseLevel).includes(level as CourseLevel)) {
        res.status(400).json({ 
          error: 'Invalid course level' 
        });
        return;
      }

      const courses = await this.courseService.getCoursesByLevel(level as CourseLevel);
      res.json(courses);
    } catch (error) {
      console.error('Get courses by level error:', error);
      res.status(500).json({ 
        error: 'Failed to get courses by level' 
      });
    }
  }

  async createCourse(req: Request, res: Response): Promise<void> {
    try {
      const courseData = req.body;
      
      // Basic validation
      if (!courseData.title || !courseData.description || !courseData.instructor || !courseData.duration || !courseData.level) {
        res.status(400).json({ 
          error: 'Title, description, instructor, duration, and level are required' 
        });
        return;
      }

      if (!Object.values(CourseLevel).includes(courseData.level)) {
        res.status(400).json({ 
          error: 'Invalid course level' 
        });
        return;
      }

      const course = await this.courseService.createCourse({
        ...courseData,
        duration: parseInt(courseData.duration),
        isPremium: courseData.isPremium || false,
        techniques: courseData.techniques || [],
      });

      res.status(201).json(course);
    } catch (error) {
      console.error('Create course error:', error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Failed to create course' 
      });
    }
  }
}