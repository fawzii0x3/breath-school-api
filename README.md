# Breath School API

A hexagonal architecture Node.js TypeScript API for a breath training application.

## Features

- **Hexagonal Architecture**: Clean separation of concerns with domain, application, infrastructure, and interface layers
- **MongoDB**: Data persistence using Mongoose ODM
- **Firebase Authentication**: Secure user authentication
- **Systeme.io Integration**: User subscription management
- **TypeScript**: Full type safety and modern JavaScript features

## Architecture

```
src/
├── domain/              # Business logic and entities
│   ├── entities/        # Domain entities (User, Course, BreathingSession)
│   ├── repositories/    # Repository interfaces
│   └── services/        # Domain services interfaces
├── application/         # Use cases and application services
│   ├── use-cases/       # Application business logic
│   └── services/        # Application services
├── infrastructure/      # External dependencies
│   ├── database/        # MongoDB adapters and models
│   ├── authentication/ # Firebase auth implementation
│   ├── subscriptions/   # Systeme.io integration
│   └── adapters/        # Other external service adapters
├── interfaces/          # HTTP controllers and routes
│   ├── controllers/     # HTTP request handlers
│   ├── routes/          # Route definitions
│   └── middlewares/     # Express middlewares
└── config/              # Configuration management
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Install Systeme.io SDK (if needed):
   ```bash
   npx api install "@systeme/v1.0.0#1u55f33mdzykyt4"
   ```

5. Build the project:
   ```bash
   npm run build
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Health Check
- `GET /health` - Health check endpoint

### Users
- `POST /api/v1/users` - Create a new user
- `GET /api/v1/users/profile` - Get user profile (requires auth)
- `PUT /api/v1/users/:userId/subscription` - Update user subscription

### Breathing Sessions
- `POST /api/v1/sessions` - Create a breathing session (requires auth)
- `GET /api/v1/sessions` - Get user's breathing sessions (requires auth)
- `PUT /api/v1/sessions/:sessionId/complete` - Mark session as complete (requires auth)

### Courses
- `GET /api/v1/courses` - Get all courses (premium courses hidden without subscription)
- `GET /api/v1/courses/:courseId` - Get course by ID
- `GET /api/v1/courses/level/:level` - Get courses by level
- `POST /api/v1/courses` - Create a new course

## Authentication

Use Firebase ID tokens in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

## Environment Variables

Required environment variables (see `.env.example` for all options):

- `MONGODB_URI` - MongoDB connection string
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_PRIVATE_KEY` - Firebase service account private key
- `FIREBASE_CLIENT_EMAIL` - Firebase service account email
- `SYSTEME_API_KEY` - Systeme.io API key

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technologies

- **Node.js** - Runtime environment
- **TypeScript** - Programming language
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **Firebase Admin SDK** - Authentication
- **Systeme.io** - Subscription management
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing