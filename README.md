# Jaydee Kanban - API

## Le projet
Jaydee fabrique des pièces en plastique. Jaydee Kanban est son application interne pour suivre la production : chaque **OF** (ordre de fabrication) est une carte rangée dans une **colonne** du tableau (à faire, en cours, terminé...).

Ce dépôt contient l'API (Node.js, Express, TypeScript et MongoDB). Je l'ai préparée pour la mise en production : tests, Docker, CI/CD, sécurité et documentation.

## Installation
Il faut Node.js 20, Docker et Git.
```bash
npm ci                      # installer les dépendances
cp .env.example .env        # puis mettre un JWT_SECRET
docker compose up -d mongo  # lancer MongoDB
npm run dev                 # lancer l'API sur http://localhost:3000
npm test                    # lancer les tests
```
Pour tout lancer avec Docker : `docker compose up -d --build`.

Plus de détails dans [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

## Les routes
- `GET /health` : vérifier que le serveur marche
- `POST /api/auth/register` et `POST /api/auth/login` : créer un compte et se connecter
- `/api/columns` : les colonnes (token obligatoire)
- `/api/ofs` : les OF (token obligatoire)

## Choix techniques
- Express 5 et TypeScript, Mongoose pour MongoDB, Zod pour vérifier les données.
- Vitest et Supertest pour les tests, avec une base MongoDB en mémoire.
- Docker avec l'image `node:20-alpine`, et Docker Compose pour lancer l'API avec MongoDB.
- Un pipeline GitHub Actions, expliqué dans [CI_CD_STRATEGIE.md](CI_CD_STRATEGIE.md).

## Sécurité
- helmet et une limite de 100 requêtes par IP toutes les 15 minutes (`src/middlewares/security.middleware.ts`).
- Les routes des colonnes et des OF renvoient 401 sans token.
- Les secrets sont dans `.env`, qui n'est pas sur Git.

Plus de détails dans [NOTE_SECURITE.md](NOTE_SECURITE.md). L'analyse de départ est dans [ANALYSE_EXISTANT.md](ANALYSE_EXISTANT.md).

## Auteur et version
- Slim Bouras, Concepteur Développeur d'Applications (ISCOD)
- Version 1.0.0, novembre 2026
