import mongoose, { Schema, Document } from 'mongoose';
import { Course, CourseLevel } from '../../../domain/entities/Course';

interface CourseDocument extends Document, Omit<Course, 'id'> {}

const CourseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  duration: { type: Number, required: true },
  level: { 
    type: String, 
    enum: Object.values(CourseLevel),
    required: true 
  },
  techniques: [{ type: String }],
  price: { type: Number },
  isPremium: { type: Boolean, default: false },
  imageUrl: { type: String },
  videoUrl: { type: String },
}, {
  timestamps: true,
});

export const CourseModel = mongoose.model<CourseDocument>('Course', CourseSchema);