// Repository implementations
import { MongoUserRepository } from '../infrastructure/database/repositories/MongoUserRepository';
import { MongoBreathingSessionRepository } from '../infrastructure/database/repositories/MongoBreathingSessionRepository';
import { MongoCourseRepository } from '../infrastructure/database/repositories/MongoCourseRepository';

// Service implementations
import { FirebaseAuthService } from '../infrastructure/authentication/FirebaseAuthService';
import { SystemeIOSubscriptionService } from '../infrastructure/subscriptions/SystemeIOSubscriptionService';

// Use cases
import { UserService } from '../application/use-cases/UserService';
import { BreathingSessionService } from '../application/use-cases/BreathingSessionService';
import { CourseService } from '../application/use-cases/CourseService';

// Controllers
import { UserController } from '../interfaces/controllers/UserController';
import { BreathingSessionController } from '../interfaces/controllers/BreathingSessionController';
import { CourseController } from '../interfaces/controllers/CourseController';

export class Container {
  private static instance: Container;

  // Repositories
  public readonly userRepository: MongoUserRepository;
  public readonly breathingSessionRepository: MongoBreathingSessionRepository;
  public readonly courseRepository: MongoCourseRepository;

  // External services
  public readonly authService: FirebaseAuthService;
  public readonly subscriptionService: SystemeIOSubscriptionService;

  // Use cases
  public readonly userService: UserService;
  public readonly breathingSessionService: BreathingSessionService;
  public readonly courseService: CourseService;

  // Controllers
  public readonly userController: UserController;
  public readonly breathingSessionController: BreathingSessionController;
  public readonly courseController: CourseController;

  private constructor() {
    // Initialize repositories
    this.userRepository = new MongoUserRepository();
    this.breathingSessionRepository = new MongoBreathingSessionRepository();
    this.courseRepository = new MongoCourseRepository();

    // Initialize external services
    this.authService = FirebaseAuthService.getInstance();
    this.subscriptionService = new SystemeIOSubscriptionService();

    // Initialize use cases
    this.userService = new UserService(
      this.userRepository,
      this.authService,
      this.subscriptionService
    );

    this.breathingSessionService = new BreathingSessionService(
      this.breathingSessionRepository,
      this.authService
    );

    this.courseService = new CourseService(
      this.courseRepository,
      this.userRepository,
      this.authService
    );

    // Initialize controllers
    this.userController = new UserController(this.userService);
    this.breathingSessionController = new BreathingSessionController(this.breathingSessionService);
    this.courseController = new CourseController(this.courseService);
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }
}