import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Import CommonJS module
const { jwtSecret } = require('../../../src/configs/vars');

export interface IPasswordService {
  hashPassword(password: string): string;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
  generateToken(userId: string): string;
  verifyToken(token: string): { success: boolean; userId?: string; error?: string };
}

export class PasswordService implements IPasswordService {
  private readonly saltRounds = 10;

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, this.saltRounds);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(userId: string): string {
    const payload = {
      sub: userId,
    };
    return jwt.sign(payload, jwtSecret);
  }

  verifyToken(token: string): { success: boolean; userId?: string; error?: string } {
    try {
      const decoded = jwt.verify(token, jwtSecret) as { sub: string };
      return {
        success: true,
        userId: decoded.sub
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Invalid token'
      };
    }
  }
}
