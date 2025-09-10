import { BreathingSession } from '../../../domain/entities/BreathingSession';
import { BreathingSessionRepository } from '../../../domain/repositories/BreathingSessionRepository';
import { BreathingSessionModel } from '../models/BreathingSessionModel';

export class MongoBreathingSessionRepository implements BreathingSessionRepository {
  async findById(id: string): Promise<BreathingSession | null> {
    const session = await BreathingSessionModel.findById(id);
    return session ? this.mapToEntity(session) : null;
  }

  async findByUserId(userId: string): Promise<BreathingSession[]> {
    const sessions = await BreathingSessionModel.find({ userId }).sort({ createdAt: -1 });
    return sessions.map(session => this.mapToEntity(session));
  }

  async create(sessionData: Omit<BreathingSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<BreathingSession> {
    const session = new BreathingSessionModel(sessionData);
    const savedSession = await session.save();
    return this.mapToEntity(savedSession);
  }

  async update(id: string, sessionData: Partial<BreathingSession>): Promise<BreathingSession | null> {
    const session = await BreathingSessionModel.findByIdAndUpdate(id, sessionData, { new: true });
    return session ? this.mapToEntity(session) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await BreathingSessionModel.findByIdAndDelete(id);
    return !!result;
  }

  private mapToEntity(sessionDoc: any): BreathingSession {
    return {
      id: sessionDoc._id.toString(),
      userId: sessionDoc.userId,
      title: sessionDoc.title,
      description: sessionDoc.description,
      duration: sessionDoc.duration,
      technique: sessionDoc.technique,
      completed: sessionDoc.completed,
      completedAt: sessionDoc.completedAt,
      createdAt: sessionDoc.createdAt,
      updatedAt: sessionDoc.updatedAt,
    };
  }
}