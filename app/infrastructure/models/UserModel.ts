import { Schema, model, Document, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import moment from 'moment';
import { IUserDocument } from './types';

// Define the User interface extending IUserDocument
export interface IUser extends IUserDocument {
  _id: string;
}

// Define the User schema
const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  fullName: {
    type: String,
    default: "usuario",
    trim: true
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin', 'branch', 'partner']
  },
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    sparse: true
  },
  securityToken: {
    type: String,
    default: null
  },
  suscription: {
    type: Boolean,
    default: false
  },
  isStartSubscription: {
    type: Boolean,
    default: false
  },
  picture: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

// Define virtual for promotion days
UserSchema.virtual('promotionDays').get(function() {
  if (this.createdAt) {
    const createdAt = moment(this.createdAt);
    const now = moment();
    const diff = now.diff(createdAt, 'days');
    return diff;
  }
  return 0;
});

// Post middleware to calculate promotion days
UserSchema.post('findOne', async function(result: IUser) {
  try {
    if (result && result.createdAt) {
      const createdAt = moment(result.createdAt);
      const now = moment();
      const diff = now.diff(createdAt, 'days');
      
      // Set the virtual field
      (result as any).set('promotionDays', diff);
      
      // Additional logic for promotion days > 7
      if (diff > 7) {
        // La fecha createdAt es mayor a 7 días respecto a la fecha actual
        // Realiza la lógica necesaria aquí
        console.log(`User ${result.email} has been active for ${diff} days`);
      }
    }
  } catch (error) {
    console.error('Error calculating promotion days:', error);
  }
});

// Define instance methods
UserSchema.methods = {
  // Get display name
  getDisplayName(): string {
    return this.fullName || this.email.split('@')[0];
  },
  
  // Check if user is active
  isActive(): boolean {
    return this.suscription === true;
  },
  
  // Check if user has started subscription
  hasStartedSubscription(): boolean {
    return this.isStartSubscription === true;
  },
  
  // Get user's promotion days
  getPromotionDays(): number {
    if (this.createdAt) {
      const createdAt = moment(this.createdAt);
      const now = moment();
      return now.diff(createdAt, 'days');
    }
    return 0;
  },
  
  // Check if user is admin
  isAdmin(): boolean {
    return this.role === 'admin';
  },
  
  // Check if user is partner
  isPartner(): boolean {
    return this.role === 'partner';
  }
};

// Define static methods
UserSchema.statics = {
  // Find user by email
  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email: email.toLowerCase() });
  },
  
  // Find user by Firebase UID
  async findByFirebaseUid(firebaseUid: string): Promise<IUser | null> {
    return this.findOne({ firebaseUid });
  },
  
  // Find active users
  async findActiveUsers(): Promise<IUser[]> {
    return this.find({ suscription: true });
  },
  
  // Find users by role
  async findByRole(role: 'user' | 'admin' | 'branch' | 'partner'): Promise<IUser[]> {
    return this.find({ role });
  }
};

// Add pagination plugin
UserSchema.plugin(mongoosePaginate);

// Create and export the model
export const UserModel: Model<IUser> = model<IUser>('User', UserSchema);

// Export the schema for use in other files if needed
export { UserSchema };

// Export default
export default UserModel;
