# Stratégie CI/CD

## Objectifs
- **Automatisation** : à chaque modification du code, l'installation, les tests et le build se lancent tout seuls.
- **Fiabilité** : une version qui ne passe pas les tests n'est jamais déployée.
- **Qualité** : les erreurs sont trouvées tôt, avant d'arriver en production.

## Quand le pipeline se lance
- **push** sur `main` : tests et build.
- **pull request** vers `main` : tests et build. On ne peut pas fusionner si le pipeline échoue.
- **release** (tag `v1.x.x`) : tests, build puis déploiement en production.

## Les étapes
1. **Installation** : `npm ci` avec Node 20.
2. **Tests** : `npm test`, et `npm audit` pour les dépendances.
3. **Build** : `npm run build` puis construction de l'image Docker.
4. **Déploiement** (seulement pour une release) : on lance la nouvelle image sur le serveur et on vérifie que `/health` répond.

## Exemple de pipeline (GitHub Actions)
```yaml
name: CI
on:
  push: { branches: [main] }
  pull_request:
  release: { types: [published] }
jobs:
  test-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci && npm test && npm run build
      - run: docker build -t jaydee-kanban:${{ github.sha }} .
```

## Les secrets
- `JWT_SECRET` et `MONGODB_URI` sont rangés dans les **GitHub Secrets**, jamais dans le code.
- Le fichier `.env` n'est pas envoyé sur Git (`.gitignore`) ni copié dans l'image (`.dockerignore`). Seul `.env.example`, sans vraie valeur, est sur Git.

## Avant la mise en production
- Tous les tests passent et le build réussit.
- La pull request a été relue par un autre développeur.
- Le déploiement en production demande une validation manuelle.
- Après le déploiement, `/health` doit répondre 200. Sinon, on remet la version précédente.
