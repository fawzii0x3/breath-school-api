import { User } from '../../../domain/entities/User';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { UserModel } from '../models/UserModel';

export class MongoUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    return user ? this.mapToEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    return user ? this.mapToEntity(user) : null;
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    const user = await UserModel.findOne({ firebaseUid });
    return user ? this.mapToEntity(user) : null;
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user = new UserModel(userData);
    const savedUser = await user.save();
    return this.mapToEntity(savedUser);
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const user = await UserModel.findByIdAndUpdate(id, userData, { new: true });
    return user ? this.mapToEntity(user) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }

  private mapToEntity(userDoc: any): User {
    return {
      id: userDoc._id.toString(),
      email: userDoc.email,
      displayName: userDoc.displayName,
      firebaseUid: userDoc.firebaseUid,
      systemeCustomerId: userDoc.systemeCustomerId,
      subscriptionStatus: userDoc.subscriptionStatus,
      subscriptionPlan: userDoc.subscriptionPlan,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    };
  }
}