import { IUserService } from '../../application/ports/IUserService';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IFirebaseService } from '../../application/ports/IFirebaseService';
import { ISystemeService } from '../../application/ports/ISystemeService';
import { UserService } from '../../application/services/UserService';
import { AuthService } from '../../application/services/AuthService';
import { MongooseUserRepositoryImpl } from '../adapters/MongooseUserRepositoryImpl';
import { FirebaseService } from '../external-services/FirebaseService';
import { SystemeServiceV2 } from '../external-services/SystemeServiceV2';
import { UserControllerAdapter } from '../adapters/UserControllerAdapter';
import { UserControllerAdapterV2 } from '../adapters/UserControllerAdapterV2';
import { AuthControllerAdapter } from '../adapters/AuthControllerAdapter';
import { initializeSystemeConfig } from '../configs/systeme';

export class Container {
  private static instance: Container;
  private userService: IUserService;
  private authService: AuthService;
  private userRepository: IUserRepository;
  private firebaseService: IFirebaseService;
  private systemeService: ISystemeService;
  private userControllerAdapter: UserControllerAdapter;
  private userControllerAdapterV2: UserControllerAdapterV2;
  private authControllerAdapter: AuthControllerAdapter;

  private constructor() {
    this.initializeServices();
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  private initializeServices(): void {
    // Initialize external services
    this.firebaseService = new FirebaseService();
    
    // Initialize Systeme.io with proper configuration
    const systemeApiKey = initializeSystemeConfig();
    this.systemeService = new SystemeServiceV2(systemeApiKey);
    console.log('Systeme.io service initialized with API key:', systemeApiKey.substring(0, 10) + '...');

    // Initialize repository
    this.userRepository = new MongooseUserRepositoryImpl();

    // Initialize application services
    this.userService = new UserService(
      this.userRepository,
      this.firebaseService,
      this.systemeService
    );

    this.authService = new AuthService(
      this.userRepository,
      this.firebaseService
    );

    // Initialize controller adapters
    this.userControllerAdapter = new UserControllerAdapter(this.userService);
    this.userControllerAdapterV2 = new UserControllerAdapterV2(
      this.userService,
      this.authService,
      this.systemeService
    );
    this.authControllerAdapter = new AuthControllerAdapter(this.authService);
  }

  public getUserService(): IUserService {
    return this.userService;
  }

  public getAuthService(): AuthService {
    return this.authService;
  }

  public getUserRepository(): IUserRepository {
    return this.userRepository;
  }

  public getFirebaseService(): IFirebaseService {
    return this.firebaseService;
  }

  public getSystemeService(): ISystemeService {
    return this.systemeService;
  }

  public getUserControllerAdapter(): UserControllerAdapter {
    return this.userControllerAdapter;
  }

  public getUserControllerAdapterV2(): UserControllerAdapterV2 {
    return this.userControllerAdapterV2;
  }

  public getAuthControllerAdapter(): AuthControllerAdapter {
    return this.authControllerAdapter;
  }
}
