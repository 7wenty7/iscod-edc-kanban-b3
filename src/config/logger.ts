import pino from 'pino';
import { env } from './env.js';

// niveau des logs : rien pendant les tests, tout en développement
let level = 'debug';
if (env.NODE_ENV === 'production') level = 'info';
if (env.NODE_ENV === 'test') level = 'silent';

export const logger = pino({
  level,
  // logs lisibles et en couleur en développement
  transport:
    env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});
