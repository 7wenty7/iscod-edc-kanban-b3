# Note de sécurité

## Les risques
1. **Abus de l'API** : sans limite, quelqu'un peut envoyer des milliers de requêtes, par exemple pour essayer plein de mots de passe sur `/api/auth/login` ou pour surcharger le serveur.
2. **Accès non autorisé** : les colonnes et les OF sont des données internes. Personne ne doit pouvoir les lire ou les modifier sans être connecté.

## Ce que j'ai mis en place
J'ai créé le fichier `src/middlewares/security.middleware.ts` avec deux middlewares, activés dans `src/app.ts` :
- **express-rate-limit** : 100 requêtes maximum par adresse IP toutes les 15 minutes sur `/api`. Ensuite, l'API répond **429 Too Many Requests**.
- **helmet** : ajoute des en-têtes de sécurité HTTP et enlève l'en-tête `X-Powered-By`, qui montrait qu'on utilise Express.

Pour le deuxième risque, les routes des colonnes et des OF étaient déjà protégées par un token JWT. J'ai vérifié qu'elles renvoient bien **401** sans token, avec un test et avec `curl`.

Le `JWT_SECRET` est dans le fichier `.env`, qui n'est ni sur Git ni dans l'image Docker.

## Pourquoi ces choix
La limite de requêtes répond directement au premier risque. helmet était déjà installé et ne demande qu'une ligne. 100 requêtes en 15 minutes, c'est assez pour une utilisation normale du Kanban.

## Les limites
- Le compteur de requêtes est en mémoire : il repart à zéro quand le serveur redémarre.
- La limite est la même pour toutes les routes. Il faudrait une limite plus stricte sur la connexion.
- Tout le monde peut créer un compte, et il n'y a pas de rôles.
- `CORS_ORIGIN` vaut `*` : en production, il faut mettre seulement l'adresse du site.
- Certaines dépendances ont encore des failles connues : il faut lancer `npm audit fix`.
- En production, l'API doit être en HTTPS.
