import { BreathingSession } from '../entities/BreathingSession';

export interface BreathingSessionRepository {
  findById(id: string): Promise<BreathingSession | null>;
  findByUserId(userId: string): Promise<BreathingSession[]>;
  create(session: Omit<BreathingSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<BreathingSession>;
  update(id: string, session: Partial<BreathingSession>): Promise<BreathingSession | null>;
  delete(id: string): Promise<boolean>;
}