import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import passport from 'passport';

// Swagger removed

// Import routes (we'll need to convert these to TypeScript or use require for now)
const userRoutes = require('../../../src/routes/user.routes');
const authRoutes = require('../../../src/routes/auth.routes');
const projectRoutes = require('../../../src/routes/music.routes');
const purchaseRoutes = require('../../../src/routes/purchase.routes');
const contactRoutes = require('../../../src/routes/contact.routes');
const uploadRoutes = require('../../../src/routes/upload.routes');
const videosRoutes = require('../../../src/routes/video.routes');
const categories = require('../../../src/routes/categories.routes');
const appMusics = require('../../../src/routes/music.app.routes');
const courses = require('../../../src/routes/course.routes');
const theme = require('../../../src/routes/theme.routes');
const review = require('../../../src/routes/review.routes');
const videoContent = require('../../../src/routes/video.content.routes');
const { router: sseRoutes } = require('../../../src/routes/sse.routes');
const chatRoutes = require('../../../src/routes/chat/chat.route');
const chatVercelRoutes = require('../../../src/routes/chat/chat-vercel.route');

// Import passport configuration
const { jwt } = require('../../../src/configs/passport');

export function createServer(): express.Application {
  const app = express();

  // Enable CORS for all routes
  app.use(cors({ origin: '*' }));

  if (process.env.NODE_ENV === 'production') {
    app.use(cors({ origin: '*' }));
    app.use(morgan('short'));
    app.use(helmet());
  } else {
    app.use(cors({ origin: '*' }));
    app.use(morgan('dev'));
  }

  app.use(passport.initialize());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  passport.use('jwt', jwt);

  // Register routes
  app.use('/user', userRoutes);
  app.use('/auth', authRoutes);
  app.use('/musics', projectRoutes);
  app.use('/purchases', purchaseRoutes);
  app.use('/contact', contactRoutes);
  app.use('/categories', categories);
  app.use('/videos', videosRoutes);
  app.use('/uploadFiles', uploadRoutes);
  app.use('/app/musics', appMusics);
  app.use('/courses', courses);
  app.use('/themes', theme);
  app.use('/reviews', review);
  app.use('/video-content', videoContent);
  app.use('/eventos', sseRoutes);
  app.use('/chat', chatRoutes);
  app.use('/chat-vercel', chatVercelRoutes);

  // Swagger documentation removed

  return app;
}
