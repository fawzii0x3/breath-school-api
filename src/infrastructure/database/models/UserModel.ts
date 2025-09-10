import mongoose, { Schema, Document } from 'mongoose';
import { User, SubscriptionStatus } from '../../../domain/entities/User';

interface UserDocument extends Document, Omit<User, 'id'> {}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  displayName: { type: String },
  firebaseUid: { type: String, required: true, unique: true },
  systemeCustomerId: { type: String },
  subscriptionStatus: { 
    type: String, 
    enum: Object.values(SubscriptionStatus),
    default: SubscriptionStatus.INACTIVE 
  },
  subscriptionPlan: { type: String },
}, {
  timestamps: true,
});

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);