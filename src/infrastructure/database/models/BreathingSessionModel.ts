import mongoose, { Schema, Document } from 'mongoose';
import { BreathingSession, BreathingTechnique } from '../../../domain/entities/BreathingSession';

interface BreathingSessionDocument extends Document, Omit<BreathingSession, 'id'> {}

const BreathingSessionSchema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: Number, required: true },
  technique: { 
    type: String, 
    enum: Object.values(BreathingTechnique),
    required: true 
  },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
}, {
  timestamps: true,
});

export const BreathingSessionModel = mongoose.model<BreathingSessionDocument>('BreathingSession', BreathingSessionSchema);