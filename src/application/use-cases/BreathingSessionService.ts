import { BreathingSession, BreathingTechnique } from '../../domain/entities/BreathingSession';
import { BreathingSessionRepository } from '../../domain/repositories/BreathingSessionRepository';
import { AuthenticationService } from '../../domain/services/ExternalServices';

export class BreathingSessionService {
  constructor(
    private sessionRepository: BreathingSessionRepository,
    private authService: AuthenticationService
  ) {}

  async createSession(
    firebaseToken: string,
    sessionData: {
      title: string;
      description?: string;
      duration: number;
      technique: BreathingTechnique;
    }
  ): Promise<BreathingSession> {
    const authData = await this.authService.verifyToken(firebaseToken);
    if (!authData) {
      throw new Error('Invalid Firebase token');
    }

    const session = {
      userId: authData.uid,
      title: sessionData.title,
      description: sessionData.description,
      duration: sessionData.duration,
      technique: sessionData.technique,
      completed: false,
    };

    return await this.sessionRepository.create(session);
  }

  async getUserSessions(firebaseToken: string): Promise<BreathingSession[]> {
    const authData = await this.authService.verifyToken(firebaseToken);
    if (!authData) {
      throw new Error('Invalid Firebase token');
    }

    return await this.sessionRepository.findByUserId(authData.uid);
  }

  async completeSession(firebaseToken: string, sessionId: string): Promise<BreathingSession> {
    const authData = await this.authService.verifyToken(firebaseToken);
    if (!authData) {
      throw new Error('Invalid Firebase token');
    }

    const session = await this.sessionRepository.findById(sessionId);
    if (!session || session.userId !== authData.uid) {
      throw new Error('Session not found or access denied');
    }

    return await this.sessionRepository.update(sessionId, {
      completed: true,
      completedAt: new Date(),
    }) as BreathingSession;
  }
}