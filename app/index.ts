import 'dotenv/config';
import { createServer } from './infrastructure/configs/server';
import { connectDatabase } from './infrastructure/configs/database';
import { Container } from './infrastructure/di/Container';

// Initialize the dependency injection container
const container = Container.getInstance();

// Initialize the application
async function startApplication() {
  try {
    console.log('Starting Breath School API with Hexagonal Architecture...');
    
    // Connect to database
    await connectDatabase();
    
    // Create Express server
    const app = createServer();
    
    // Initialize the dependency injection container
    console.log('Initializing dependency injection container...');
    // Here you can initialize your services, repositories, and use cases
    // For example:
    // const userService = container.getUserService();
    // const userRepository = container.getUserRepository();
    
    // Start the server
    const PORT = process.env.PORT || 8085;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Hexagonal architecture components loaded.');
      console.log('Application initialized successfully!');
    });
    
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Start the application
startApplication();
