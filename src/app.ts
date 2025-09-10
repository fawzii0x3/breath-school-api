import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/config';
import { DatabaseConnection } from './infrastructure/database/DatabaseConnection';
import { Container } from './container/Container';
import { createUserRoutes } from './interfaces/routes/userRoutes';
import { createBreathingSessionRoutes } from './interfaces/routes/breathingSessionRoutes';
import { createCourseRoutes } from './interfaces/routes/courseRoutes';
import { errorHandler, notFoundHandler } from './interfaces/middlewares/errorHandler';

export class App {
  private app: express.Application;
  private container: Container;

  constructor() {
    this.app = express();
    this.container = Container.getInstance();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: config.app.env,
      });
    });

    // API routes
    this.app.use('/api/v1', createUserRoutes(this.container.userController));
    this.app.use('/api/v1', createBreathingSessionRoutes(this.container.breathingSessionController));
    this.app.use('/api/v1', createCourseRoutes(this.container.courseController));
  }

  private setupErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      const db = DatabaseConnection.getInstance();
      await db.connect();

      // Start server
      this.app.listen(config.app.port, () => {
        console.log(`Breath School API running on port ${config.app.port}`);
        console.log(`Environment: ${config.app.env}`);
        console.log(`Health check: http://localhost:${config.app.port}/health`);
      });
    } catch (error) {
      console.error('Failed to start application:', error);
      process.exit(1);
    }
  }

  public getApp(): express.Application {
    return this.app;
  }
}