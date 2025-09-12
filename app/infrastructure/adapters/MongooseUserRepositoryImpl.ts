import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserResponse } from '../../domain/entities/User';

// Import the TypeScript Mongoose models
import { UserModel } from '../models/UserModel';
const Music = require('../../../src/models/music.model');
const Video = require('../../../src/models/videos.model');

export class MongooseUserRepositoryImpl implements IUserRepository {
  async findById(id: string): Promise<UserResponse | null> {
    try {
      const user = await UserModel.findById(id, { password: 0, __v: 0, role: 0 });
      return user ? this.mapToUserResponse(user) : null;
    } catch (error) {
      throw new Error(`Failed to find user by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByEmail(email: string): Promise<UserResponse | null> {
    try {
      const user = await UserModel.findOne({ email }, { password: 0, __v: 0, role: 0 });
      return user ? this.mapToUserResponse(user) : null;
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByFirebaseUid(firebaseUid: string): Promise<UserResponse | null> {
    try {
      const user = await UserModel.findOne({ firebaseUid }, { password: 0, __v: 0, role: 0 });
      return user ? this.mapToUserResponse(user) : null;
    } catch (error) {
      throw new Error(`Failed to find user by Firebase UID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async create(userData: any): Promise<UserResponse> {
    try {
      const user = new UserModel(userData);
      if (userData._id) {
        user._id = userData._id;
      }
      await user.save();
      return this.mapToUserResponse(user);
    } catch (error) {
      throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async update(id: string, userData: any): Promise<UserResponse | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        id, 
        userData, 
        { new: true, select: '-password -__v -role' }
      );
      return user ? this.mapToUserResponse(user) : null;
    } catch (error) {
      throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await UserModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<boolean> {
    try {
      const result = await UserModel.findByIdAndUpdate(
        userId,
        { password: hashedPassword },
        { new: true }
      );
      return !!result;
    } catch (error) {
      throw new Error(`Failed to update password: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async addFavoriteMusic(userId: string, musicId: string): Promise<boolean> {
    try {
      const music = await Music.findById(musicId);
      if (!music) return false;
      
      if (music.favorites.includes(userId)) {
        await Music.findByIdAndUpdate(musicId, { $pull: { favorites: userId } }, { new: true });
        return false; // Removed from favorites
      } else {
        await Music.findByIdAndUpdate(musicId, { $push: { favorites: userId } }, { new: true });
        return true; // Added to favorites
      }
    } catch (error) {
      throw new Error(`Failed to add favorite music: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async removeFavoriteMusic(userId: string, musicId: string): Promise<boolean> {
    try {
      await Music.updateMany(
        { favorites: userId },
        { $pull: { favorites: userId } }
      );
      return true;
    } catch (error) {
      throw new Error(`Failed to remove favorite music: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async addFavoriteVideo(userId: string, videoId: string): Promise<boolean> {
    try {
      const video = await Video.findById(videoId);
      if (!video) return false;
      
      if (video.favorites.includes(userId)) {
        await Video.findByIdAndUpdate(videoId, { $pull: { favorites: userId } }, { new: true });
        return false; // Removed from favorites
      } else {
        await Video.findByIdAndUpdate(videoId, { $push: { favorites: userId } }, { new: true });
        return true; // Added to favorites
      }
    } catch (error) {
      throw new Error(`Failed to add favorite video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async removeFavoriteVideo(userId: string, videoId: string): Promise<boolean> {
    try {
      await Video.updateMany(
        { favorites: userId },
        { $pull: { favorites: userId } }
      );
      return true;
    } catch (error) {
      throw new Error(`Failed to remove favorite video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private mapToUserResponse(user: any): UserResponse {
    return {
      _id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      firebaseUid: user.firebaseUid,
      suscription: user.suscription,
      isStartSubscription: user.isStartSubscription,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      promotionDays: user.promotionDays,
      picture: user.picture || null
    };
  }
}
