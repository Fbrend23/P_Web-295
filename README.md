# P_Web-295 — Passion Lecture (API)

API **AdonisJS 6 (Node.js/TypeScript)** pour gérer une plateforme de passionnés de lecture : ouvrages, catégories, auteurs, commentaires et évaluations, avec **authentification par jeton** et **politiques d’accès (Bouncer)**.

> Objectif pédagogique (mod. 295): concevoir et livrer une API REST maintenable, validée, documentée et prête pour l’intégration front.

---

## 🚀 Stack technique

- **Runtime:** Node.js (recommandé ≥ 20)
- **Framework:** [AdonisJS 6] (HTTP, routing, middleware)
- **ORM:** Lucid (MySQL)
- **Auth:** `@adonisjs/auth` (OAT – *DbAccessTokensProvider*)
- **Validation:** `@vinejs/vine`
- **Sécurité/Accès:** `@adonisjs/bouncer` (policies)
- **DB:** MySQL (port par défaut **6033** côté projet)
- **Langage:** TypeScript

---

## 📁 Structure (extrait)

```
passion-lecture/
├─ .env.example
├─ adonisrc.ts
├─ ace.js
├─ start/
│  ├─ routes.ts            # Déclaration des routes & groupes
│  └─ kernel.ts            # Middleware globaux & nommés
├─ app/
│  ├─ controllers/         # Books, Authors, Categories, Comments, Evaluations, Users, Auth
│  ├─ models/              # Lucid models (Book, Author, Category, User, Comment, Evaluation)
│  ├─ validators/          # Schemas Vine (book, author, category, auth, etc.)
│  ├─ middleware/          # auth, force_json_response, etc.
│  └─ policies/            # BookPolicy (Bouncer)
├─ config/
│  ├─ app.ts, auth.ts, cors.ts, bodyparser.ts, database.ts
├─ database/
│  ├─ migrations/          # 1..7 tables (users, authors, categories, books, comments, evaluations)
│  ├─ seeders/             # 1_user, 2_author, 3_category, 4_book, 5_comment, 6_evaluation
│  └─ factories/           # Génération de données de test
└─ Bruno/                  # Collection Bruno (équivalent Postman)
```

---

## 🔐 Authentification

- Endpoints d’auth sous le préfixe `/user` :
  - `POST /user/register`
  - `POST /user/login`
  - `POST /user/logout` *(protégé)*
- Les routes protégées exigent l’en-tête :  
  `Authorization: Bearer <votre_token>`

**Réponse de login (exemple)**

```json
{
  "token": "...jeton OAT...",
  "id": 1,
  "username": "alice",
  "createdAt": "2025-10-30T10:00:00.000Z",
  "updatedAt": "2025-10-30T10:00:00.000Z"
}
```

---

## 🧭 Routes principales (aperçu)

> Les groupes de routes définissent les préfixes suivants : `/books`, `/books/:book_id`, `/categories`, `/users/:user_id`, `/user`.  
> Les actions **create/update/delete** sont protégées par `auth` + politiques (Bouncer).

### Livres (`/books`)
- `GET /books` — liste paginée + filtres
  - Query params supportés : `page`, `limit`, `sort`, `order`, `categoryId`, `authorId`, `userId`, `search`
  - **Par défaut** tri sur `title` (ordre `asc`)
- `GET /books/:book_id` — détail
- `POST /books` — créer *(protégé)*
- `PUT /books/:book_id` — modifier *(protégé + policy)*
- `DELETE /books/:book_id` — supprimer *(protégé + policy)*

**Exemple** : `GET /books?search=Asimov&categoryId=2&page=1&limit=12&order=desc`

### Commentaires & Evaluations (liés à un livre)
- Préfixe : `/books/:book_id`
- `resource('comments')` — **CRUD minimal** pour commentaires
- `resource('evaluations')` — création + moyenne des notes, etc.

### Catégories (`/categories`)
- `GET /categories` — liste
- `POST /categories` — créer *(protégé)*
- `PUT /categories/:category_id` — modifier *(protégé)*
- `DELETE /categories/:category_id` — supprimer *(protégé)*
- `GET /categories/:category_id/books` — livres d’une catégorie

### Utilisateurs (`/users/:user_id`)
- `resource('users')` — endpoints utilisateur (selon contrôleur)
- `resource('books')` — livres d’un utilisateur (CRUD restreint)

> 📦 **Collection Bruno** : prête à l’emploi dans `Bruno/` (login, register, books, categories, comments, evaluations, users).

---

## 🛠️ Installation & démarrage

### 1) Prérequis
- Node.js **≥ 20**
- MySQL 8.x (ou ProxySQL si vous utilisez le port 6033)
- Un utilisateur MySQL ayant les droits sur la base

### 2) Cloner le repo
```bash
git clone <URL_DU_REPO>
cd P_Web-295-main/passion-lecture
```

### 3) Variables d’environnement
Copiez `.env.example` → `.env`, puis adaptez :
```
TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=
NODE_ENV=development

DB_HOST=127.0.0.1
DB_PORT=6033
DB_USER=root
DB_PASSWORD=root
DB_DATABASE=db_passion_lecture
```

Générez la clé d’app :
```bash
node ace generate:key
```

### 4) Dépendances
```bash
npm install
```

### 5) Base de données
Créez la base si nécessaire :
```sql
CREATE DATABASE db_passion_lecture CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Puis :
```bash
# Migrations
node ace migration:run

# Jeux de données de démo
node ace db:seed
```

### 6) Lancer le serveur
```bash
# Développement (HMR)
npm run dev

# Production
npm run build
npm start
```

Le serveur écoute par défaut sur `http://localhost:3333` (voir `PORT`/`HOST`).

---

## ✅ Validation & Règles métier (extraits)

- **VineJS** : validation stricte (ex. `bookValidator`, `author`, `category`, `comment`, etc.)
- **Unicité** : `title`, `pdfLink` vérifiés côté DB
- **Références** : `categoryId`, `authorId`, `userId` doivent exister
- **Bouncer (policies)** : contrôle fin des actions sur les livres (édition/suppression seulement par le propriétaire, etc.)

---

## 🧪 Tests & collections

- Script `npm test` réservé aux tests Adonis (à compléter selon le besoin).
- Dossiers `Bruno/` : collections pour rejouer les calls d’API (équivalent Postman).  
  Importez le dossier **Bruno** directement dans **Bruno** ou **Hoppscotch/Postman**.

---

## 🧩 Exemples de requêtes

### Création d’un livre
```http
POST /books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Fondation",
  "authorId": 1,
  "categoryId": 2,
  "numberOfPages": 320,
  "pdfLink": "https://exemple.org/fondation.pdf",
  "editor": "Denoël",
  "editionYear": 1951,
  "abstract": "Cycle de SF autour de la psychohistoire…",
  "imagePath": "/uploads/fondation.jpg"
}
```

### Pagination & recherche
```http
GET /books?search=fonda&page=1&limit=10&order=asc
```

### Authentification
```http
POST /user/login
Content-Type: application/json

{ "username": "alice", "hash_password": "********" }
```

---

## 🧱 Qualité & conventions

- **Formatage** : `npm run format` (Prettier)
- **Lint** : `npm run lint` (ESLint)
- **Type-check** : `npm run typecheck`
- **Réponses JSON forcées** via middleware `force_json_response_middleware`

---

## 🤝 Contribution

1. Créer une branche (`feature/xxx`, `fix/yyy`)
2. Commiter avec un message clair
3. Ouvrir une Pull Request (revue par un pair)
4. Interdiction de pousser sur `main` si protection activée (recommandé)

---

## 📎 Notes

- Le port DB par défaut dans `.env.example` est **6033**. Adaptez à votre environnement (ex. **3306**).
- En cas de décalage entre validations et contrôleurs (ex. champs de tri), se fier au contrôleur comme **source de vérité**.
- Licence du paquet : `UNLICENSED` (choisir une licence si publication publique).

---

## 🧭 Auteurs

- Équipe P_Web-295 — **Passion Lecture** (Brendan, Maël, Mina & co.)
