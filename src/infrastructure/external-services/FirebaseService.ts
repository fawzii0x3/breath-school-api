import { IFirebaseService } from '../../application/ports/IFirebaseService';
import { TokenVerificationResult } from '../../domain/entities/Auth';

export class FirebaseService implements IFirebaseService {
  private admin: any;

  constructor() {
    this.initialize();
  }

  async initialize(): Promise<void> {
    try {
      const admin = require('firebase-admin');
      
      if (!admin.apps.length) {
        // Check if we have the required environment variables
        if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
          console.warn('⚠️  Firebase environment variables not found, using default configuration');
          // Initialize with default configuration (will use Application Default Credentials)
          admin.initializeApp({
            projectId: process.env.FIREBASE_PROJECT_ID || "sleepmusicapp-413415"
          });
        } else {
          // Initialize Firebase Admin SDK with service account
          const serviceAccount = {
            type: "service_account",
            project_id: process.env.FIREBASE_PROJECT_ID || "sleepmusicapp-413415",
            private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
            private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            client_id: process.env.FIREBASE_CLIENT_ID,
            auth_uri: "https://accounts.google.com/o/oauth2/auth",
            token_uri: "https://oauth2.googleapis.com/token",
            auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
            client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
          };

          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: process.env.FIREBASE_PROJECT_ID || "sleepmusicapp-413415"
          });
        }
      }

      this.admin = admin;
      console.log('✅ Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Firebase Admin SDK:', error);
      // Don't throw error, just log it and continue without Firebase
      console.log('🔧 Continuing without Firebase authentication');
    }
  }

  async verifyToken(token: string): Promise<TokenVerificationResult> {
    try {
      if (!this.admin) {
        await this.initialize();
      }

      if (!this.admin) {
        console.warn('Firebase Admin SDK not initialized, using token decoder fallback');
        // Fallback: decode token without verification (for development)
        try {
          const decodedToken = this.decodeTokenWithoutVerification(token);
          return {
            success: true,
            decodedToken: decodedToken
          };
        } catch (decodeError) {
          return {
            success: false,
            error: 'Firebase Admin SDK not initialized and token decode failed'
          };
        }
      }

      const decodedToken = await this.admin.auth().verifyIdToken(token);
      
      return {
        success: true,
        decodedToken: {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name,
          picture: decodedToken.picture,
          phone_number: decodedToken.phone_number,
          auth_time: decodedToken.auth_time,
          iat: decodedToken.iat,
          exp: decodedToken.exp,
          iss: decodedToken.iss,
          aud: decodedToken.aud,
          firebase: decodedToken.firebase
        }
      };
    } catch (error) {
      console.error('Firebase token verification error:', error);
      return {
        success: false,
        error: (error as Error).message || 'Token verification failed'
      };
    }
  }

  private decodeTokenWithoutVerification(token: string): any {
    // Decode JWT without verification (for development only)
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    
    return {
      uid: payload.user_id || payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      phone_number: payload.phone_number,
      auth_time: payload.auth_time,
      iat: payload.iat,
      exp: payload.exp,
      iss: payload.iss,
      aud: payload.aud,
      firebase: payload.firebase
    };
  }

  async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.admin.auth().deleteUser(userId);
      return { success: true };
    } catch (error) {
      console.error('Firebase user deletion error:', error);
      return {
        success: false,
        error: (error as Error).message || 'Failed to delete user'
      };
    }
  }
}