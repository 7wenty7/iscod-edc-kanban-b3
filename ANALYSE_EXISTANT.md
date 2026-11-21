# Analyse de l'existant

## Le projet
C'est une API REST en Node.js avec Express 5 et TypeScript. Les données sont dans MongoDB (avec Mongoose).

Les fichiers importants :
- `src/main.ts` : le point d'entrée
- `src/server.ts` : connexion à MongoDB et démarrage du serveur
- `src/app.ts` : création de l'application Express
- `src/config/env.ts` : vérification des variables d'environnement avec Zod
- `src/models/` : les modèles `Column`, `OF` et `User`
- `src/routes/` et `src/controllers/` : les routes `/api/auth`, `/api/columns`, `/api/ofs` et `/health`
- `tests/` : les tests avec Vitest, Supertest et une base MongoDB en mémoire

Dépendances principales : express, mongoose, jsonwebtoken, bcryptjs, zod, cors, pino. helmet et express-rate-limit sont installés mais pas utilisés.

Variables d'environnement : `MONGODB_URI` et `JWT_SECRET` sont obligatoires. Il y a aussi `PORT`, `NODE_ENV`, `JWT_EXPIRES_IN` et `CORS_ORIGIN`.

Tests existants : `app`, `auth` et `ofs`. Le fichier `columns.test.ts` est vide.

## Problèmes trouvés
1. `npm test` ne marche pas : il n'y a pas de variables d'environnement pour les tests, donc `env.ts` arrête le programme. En plus, `columns.test.ts` est vide et Vitest reste en mode watch.
2. `npm run build` ne marche pas (erreur TS6059 : le dossier `tests/` est compilé alors que `rootDir` vaut `src`). Sans dossier `dist/`, `npm start` est impossible.
3. Sécurité : helmet et la limite de requêtes ne sont pas activés, donc on peut tester des mots de passe en boucle sur `/api/auth/login`. `CORS_ORIGIN` vaut `*`.
4. `npm audit` trouve 22 vulnérabilités dans les dépendances.
5. Il n'y a ni `.env.example`, ni Dockerfile, ni CI. Le README dit que `GET /api/columns` est public, ce qui est faux.

## Ce qu'il faut faire avant la mise en production
1. Faire marcher les tests.
2. Réparer le build pour pouvoir lancer `npm start`.
3. Activer helmet et la limite de requêtes.
4. Créer le Dockerfile et le guide de déploiement.
5. Mettre en place une CI qui bloque le déploiement si un test échoue.
6. Plus tard : corriger les dépendances (`npm audit fix`) et limiter CORS.
