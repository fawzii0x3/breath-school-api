import * as admin from 'firebase-admin';
import { AuthenticationService } from '../../domain/services/ExternalServices';
import { config } from '../../config/config';

export class FirebaseAuthService implements AuthenticationService {
  private static instance: FirebaseAuthService;

  private constructor() {
    // Only initialize Firebase if valid credentials are provided
    if (this.hasValidCredentials() && !admin.apps.length) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: config.firebase.projectId,
            privateKey: config.firebase.privateKey,
            clientEmail: config.firebase.clientEmail,
          }),
          projectId: config.firebase.projectId,
        });
        console.log('Firebase Admin SDK initialized successfully');
      } catch (error) {
        console.warn('Firebase initialization failed:', error);
      }
    } else {
      console.warn('Firebase credentials not provided or invalid - running in mock mode');
    }
  }

  private hasValidCredentials(): boolean {
    return !!(
      config.firebase.projectId &&
      config.firebase.privateKey &&
      config.firebase.clientEmail &&
      config.firebase.privateKey.includes('BEGIN PRIVATE KEY') &&
      config.firebase.privateKey.includes('END PRIVATE KEY') &&
      config.firebase.privateKey.length > 100
    );
  }

  public static getInstance(): FirebaseAuthService {
    if (!FirebaseAuthService.instance) {
      FirebaseAuthService.instance = new FirebaseAuthService();
    }
    return FirebaseAuthService.instance;
  }

  async verifyToken(token: string): Promise<{ uid: string; email: string } | null> {
    try {
      // In development/test mode without proper Firebase setup, return mock data
      if (!this.hasValidCredentials()) {
        console.warn('Firebase not configured - returning mock auth data');
        return {
          uid: 'mock_uid_' + Date.now(),
          email: 'test@example.com',
        };
      }

      const decodedToken = await admin.auth().verifyIdToken(token);
      return {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
      };
    } catch (error) {
      console.error('Firebase token verification error:', error);
      return null;
    }
  }

  async createCustomToken(uid: string): Promise<string> {
    try {
      if (!this.hasValidCredentials()) {
        console.warn('Firebase not configured - returning mock token');
        return 'mock_token_' + uid;
      }

      return await admin.auth().createCustomToken(uid);
    } catch (error) {
      console.error('Firebase custom token creation error:', error);
      throw error;
    }
  }
}