require('dotenv').config()

// Check if we should use the new TypeScript hexagonal architecture
const useHexagonalArchitecture = process.env.USE_HEXAGONAL === 'true' || process.env.NODE_ENV === 'development';

if (useHexagonalArchitecture) {
  // Use the new TypeScript hexagonal architecture
  console.log('Starting with Hexagonal Architecture...');
  require('./index.ts');
} else {
  // Use the existing JavaScript implementation
  console.log('Starting with Legacy JavaScript Architecture...');
  const swaggerSetup = require('../swagger');
  const app = require('./configs/server')
  const PORT = process.env.PORT || 8080; 
  require('./configs/database')
  swaggerSetup(app);

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}
