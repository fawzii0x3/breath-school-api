import { Course } from '../../../domain/entities/Course';
import { CourseRepository } from '../../../domain/repositories/CourseRepository';
import { CourseModel } from '../models/CourseModel';

export class MongoCourseRepository implements CourseRepository {
  async findById(id: string): Promise<Course | null> {
    const course = await CourseModel.findById(id);
    return course ? this.mapToEntity(course) : null;
  }

  async findAll(): Promise<Course[]> {
    const courses = await CourseModel.find().sort({ createdAt: -1 });
    return courses.map(course => this.mapToEntity(course));
  }

  async findByLevel(level: string): Promise<Course[]> {
    const courses = await CourseModel.find({ level }).sort({ createdAt: -1 });
    return courses.map(course => this.mapToEntity(course));
  }

  async findPremiumCourses(): Promise<Course[]> {
    const courses = await CourseModel.find({ isPremium: true }).sort({ createdAt: -1 });
    return courses.map(course => this.mapToEntity(course));
  }

  async create(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    const course = new CourseModel(courseData);
    const savedCourse = await course.save();
    return this.mapToEntity(savedCourse);
  }

  async update(id: string, courseData: Partial<Course>): Promise<Course | null> {
    const course = await CourseModel.findByIdAndUpdate(id, courseData, { new: true });
    return course ? this.mapToEntity(course) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await CourseModel.findByIdAndDelete(id);
    return !!result;
  }

  private mapToEntity(courseDoc: any): Course {
    return {
      id: courseDoc._id.toString(),
      title: courseDoc.title,
      description: courseDoc.description,
      instructor: courseDoc.instructor,
      duration: courseDoc.duration,
      level: courseDoc.level,
      techniques: courseDoc.techniques,
      price: courseDoc.price,
      isPremium: courseDoc.isPremium,
      imageUrl: courseDoc.imageUrl,
      videoUrl: courseDoc.videoUrl,
      createdAt: courseDoc.createdAt,
      updatedAt: courseDoc.updatedAt,
    };
  }
}