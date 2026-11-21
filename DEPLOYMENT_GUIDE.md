# Guide de déploiement

## 1. Prérequis
- Node.js 20 et npm
- Docker (avec Docker Compose)
- Git

Pas besoin d'installer MongoDB : il tourne dans un conteneur Docker.

Les variables d'environnement sont dans un fichier `.env` (à créer en copiant `.env.example`) :

| Variable | À quoi elle sert |
|---|---|
| `MONGODB_URI` | adresse de la base MongoDB (obligatoire) |
| `JWT_SECRET` | clé pour signer les tokens, 32 caractères minimum (obligatoire) |
| `PORT` | port de l'API (3000 par défaut) |
| `NODE_ENV` | `development`, `production` ou `test` |
| `JWT_EXPIRES_IN` | durée de validité d'un token (par exemple `7d`) |
| `CORS_ORIGIN` | site autorisé à appeler l'API |

## 2. Lancer le projet en local
```bash
npm ci                      # installer les dépendances
cp .env.example .env        # puis mettre un vrai JWT_SECRET
docker compose up -d mongo  # lancer MongoDB dans Docker
npm run dev                 # lancer l'API
```
Pour vérifier : `curl http://localhost:3000/health` doit répondre `{"status":"ok",...}`.

En mode production : `npm run build` puis `npm start`.

## 3. Lancer le projet avec Docker
Le `Dockerfile` part de l'image `node:20-alpine`. Il installe les dépendances, copie le code, compile le TypeScript et lance `npm start`.

Le `docker-compose.yml` lance l'API et MongoDB ensemble. Les données de MongoDB sont gardées dans un volume.

```bash
docker compose up -d --build  # construire l'image et lancer les 2 conteneurs
docker compose ps             # vérifier que tout tourne
docker compose logs api       # voir les logs de l'API
docker compose down           # tout arrêter
```

## 4. Lancer les tests
```bash
npm test
```
Les tests utilisent une base MongoDB en mémoire, donc pas besoin de `.env` ni de Docker. Au premier lancement, le MongoDB des tests est téléchargé (une seule fois).

## 5. Mettre à jour l'application
```bash
git pull                      # récupérer la nouvelle version
npm ci && npm test            # vérifier que les tests passent
docker compose up -d --build  # reconstruire et relancer
```
Si la nouvelle version ne marche pas, on revient à la version d'avant avec `git checkout <version>` et on relance `docker compose up -d --build`. Les données ne sont pas perdues, elles sont dans le volume.
