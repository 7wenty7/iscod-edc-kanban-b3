import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// helmet ajoute les en-têtes de sécurité HTTP
export const securityHeaders = helmet();

// 100 requêtes max par IP toutes les 15 minutes, sinon erreur 429
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});
