import { Course, CourseLevel } from '../../domain/entities/Course';
import { CourseRepository } from '../../domain/repositories/CourseRepository';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { AuthenticationService } from '../../domain/services/ExternalServices';
import { SubscriptionStatus } from '../../domain/entities/User';

export class CourseService {
  constructor(
    private courseRepository: CourseRepository,
    private userRepository: UserRepository,
    private authService: AuthenticationService
  ) {}

  async getAllCourses(firebaseToken?: string): Promise<Course[]> {
    let hasActiveSubscription = false;

    if (firebaseToken) {
      const authData = await this.authService.verifyToken(firebaseToken);
      if (authData) {
        const user = await this.userRepository.findByFirebaseUid(authData.uid);
        hasActiveSubscription = user?.subscriptionStatus === SubscriptionStatus.ACTIVE;
      }
    }

    const courses = await this.courseRepository.findAll();
    
    // Filter premium courses for non-subscribers
    if (!hasActiveSubscription) {
      return courses.filter(course => !course.isPremium);
    }

    return courses;
  }

  async getCourseById(courseId: string, firebaseToken?: string): Promise<Course> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Check if user has access to premium content
    if (course.isPremium && firebaseToken) {
      const authData = await this.authService.verifyToken(firebaseToken);
      if (!authData) {
        throw new Error('Authentication required for premium content');
      }

      const user = await this.userRepository.findByFirebaseUid(authData.uid);
      if (user?.subscriptionStatus !== SubscriptionStatus.ACTIVE) {
        throw new Error('Active subscription required for premium content');
      }
    } else if (course.isPremium) {
      throw new Error('Authentication required for premium content');
    }

    return course;
  }

  async getCoursesByLevel(level: CourseLevel): Promise<Course[]> {
    return await this.courseRepository.findByLevel(level);
  }

  async createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    return await this.courseRepository.create(courseData);
  }
}