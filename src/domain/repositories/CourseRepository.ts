import { Course } from '../entities/Course';

export interface CourseRepository {
  findById(id: string): Promise<Course | null>;
  findAll(): Promise<Course[]>;
  findByLevel(level: string): Promise<Course[]>;
  findPremiumCourses(): Promise<Course[]>;
  create(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course>;
  update(id: string, course: Partial<Course>): Promise<Course | null>;
  delete(id: string): Promise<boolean>;
}