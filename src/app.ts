import express, { Express } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { securityHeaders, apiLimiter } from './middlewares/security.middleware.js';

// crée l'application Express (utilisée par server.ts et par les tests)
export function createApp(): Express {
  const app = express();

  app.use(securityHeaders); // helmet
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // log de chaque requête
  app.use((req, res, next) => {
    logger.info({ method: req.method, url: req.url }, 'Incoming request');
    next();
  });

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // routes de l'API avec la limite de requêtes
  app.use('/api', apiLimiter, routes);

  // gestion des erreurs (toujours en dernier)
  app.use(errorHandler);

  return app;
}
