# Publications en back-end

Service back-end de gestion des publications, des mentions « J'aime » et des commentaires, avec nettoyage automatique de l'ancien contenu.

## Fonctionnalités

- Créer, lire, mettre à jour et supprimer des publications
- Aimer/ne plus aimer les publications
- Ajouter des commentaires aux publications
- Aimer/ne plus aimer les commentaires
- Nettoyage automatique des publications de plus de 2 semaines

## Configuration

1. Installer les dépendances :
```bash
npm install
```

2. Configurer les variables d'environnement dans `.env` :
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
PORT=3000
```

3. Démarrer le serveur :
```bash
npm start
```

## Points de terminaison de l'API

### Publications

- `POST /api/posts` - Créer une publication
- `GET /api/posts` - Obtenir les publications avec pagination
- `GET /api/posts/:id` - Obtenir une publication spécifique
- PUT /api/posts/:id - Mettre à jour une publication
- DELETE /api/posts/:id - Supprimer une publication

### J'aime

- POST /api/likes/:postId/like - Aimer une publication
- DELETE /api/likes/:postId/like - Désapprouver une publication

### Commentaires

- POST /api/comments/:postId/comment - Ajouter un commentaire à une publication
- GET /api/comments/:postId/comments - Obtenir les commentaires d'une publication
- POST /api/comments/comment/:commentId/like - Aimer un commentaire
- DELETE /api/comments/comment/:commentId/like - Désapprouver un commentaire

## Schéma de base de données

Le backend attend les tables suivantes dans votre base de données Supabase :

1. posts Tableau avec colonnes :
- id (UUID)
- user_id (TEXTE)
- username (TEXTE)
- avatar (TEXTE)
- content (TEXTE)
- image_url (TEXTE)
- created_at (HORODATAGE)
- updated_at (HORODATAGE)
- likes (ENTIER)
- comments (ENTIER)

2. Tableau « likes » avec colonnes :
- id (UUID)
- post_id (UUID)
- user_id (TEXTE)
- created_at (HORODATAGE)

3. Tableau « comments » avec colonnes :
- id (UUID)
- post_id (UUID)
- user_id (TEXTE)
- username (TEXTE)
- avatar (TEXTE)
- text (TEXTE)
- created_at (HORODATAGE)
- likes (ENTIER)

4. Tableau « comment_likes » avec colonnes :
- id (UUID)
- comment_id (UUID)
- user_id (TEXT)
- created_at (TIMESTAMP)

## Nettoyage automatique

Les publications de plus de deux semaines sont automatiquement supprimées chaque jour à minuit.