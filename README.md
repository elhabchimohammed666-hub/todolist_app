# 🚀 TaskFlow Pro — Application To-Do List Full-Stack MERN

Application de gestion de tâches (To-Do List) moderne, robuste, hautement performante et prête pour la production, développée avec la stack **MERN** (MongoDB, Express.js, React 19, Node.js).

---

## 🏛️ Architecture du Projet

Le projet est structuré selon une architecture monorepo propre et découplée :

```text
todolist/
├── backend/                  # Serveur API RESTful (Node.js & Express.js)
│   ├── src/
│   │   ├── config/           # Connexion DB (MongoDB / Mongoose)
│   │   ├── controllers/      # Logique métier et gestion des requêtes
│   │   ├── middleware/       # Sécurité, validation, auth, gestion centralisée des erreurs
│   │   ├── models/           # Schémas stricts Mongoose (Task, User) avec indexation
│   │   ├── routes/           # Définition des endpoints RESTful
│   │   ├── validators/       # Règles de validation express-validator
│   │   ├── app.js            # Configuration d'Express et middlewares
│   │   └── server.js         # Point d'entrée avec Graceful Shutdown
│   ├── .env.example          # Gabarit des variables d'environnement
│   └── package.json
│
├── frontend/                 # Client SPA (React 19, Vite, Tailwind CSS v4)
│   ├── src/
│   │   ├── api/              # Instance Axios avec intercepteurs & services
│   │   ├── components/
│   │   │   ├── common/       # Navbar, EmptyState, SkeletonCard
│   │   │   └── tasks/        # TaskCard, TaskList, TaskFormModal, TaskFilterBar, TaskStats
│   │   ├── context/          # Context API pour le mode Sombre/Clair
│   │   ├── hooks/            # TanStack React Query hooks & useDebounce
│   │   ├── utils/            # Utilitaire cn (clsx + tailwind-merge)
│   │   ├── App.jsx           # Composant racine avec QueryClient & Dashboard
│   │   ├── main.jsx          # Point d'entrée React
│   │   └── index.css         # Styles globaux & Tailwind v4
│   ├── .env.example
│   └── package.json
│
├── package.json              # Scripts d'orchestration globaux
└── README.md                 # Documentation complète du projet
```

---

## ⚡ Caractéristiques & Bonnes Pratiques Implémentées

### 1. Base de Données (MongoDB & Mongoose)
* **Schémas stricts et typés** avec validation native Mongoose (longueurs, expressions régulières, énumérations).
* **Indexation optimisée** :
  * Index simples sur `userId`, `status`, `dueDate`, `priority`.
  * Index composés pour accélérer les requêtes combinées (`{ userId: 1, status: 1 }`, `{ userId: 1, dueDate: 1 }`).
  * Index textuel pour la recherche en texte intégral sur le titre et la description.
* **Sécurité des données** : Le mot de passe de l'utilisateur est exclu par défaut (`select: false`) et hashé automatiquement via `bcryptjs`.

### 2. Backend (Express & Node.js)
* **Sécurité renforcée** :
  * En-têtes HTTP sécurisés via `helmet`.
  * Configuration CORS explicite avec liste blanche.
  * Limitation de débit (`express-rate-limit`) contre les attaques par force brute et DoS.
  * Limitation de taille du payload JSON (`10kb`).
* **Validation rigoureuse des entrées** avec `express-validator`.
* **Gestion centralisée des erreurs** : Traduction automatique des erreurs Mongoose (`CastError`, `ValidationError`, doublons d'index `11000`) et erreurs serveur avec codes HTTP normalisés (200, 201, 400, 401, 404, 409, 500).
* **Arrêt gracieux (Graceful Shutdown)** : Écoute des signaux `SIGTERM` et `SIGINT` pour fermer les connexions sans coupure abrupte.

### 3. Frontend (React, Vite & TanStack Query)
* **State Management Moderne** : Utilisation de **TanStack React Query v5** pour la mise en cache, la déduplication de requêtes, et l'invalidation automatique du cache lors des mutations (création, mise à jour, suppression).
* **UI/UX Soignée** :
  * **Tailwind CSS v4** pour un design épuré, accessible et entièrement responsive (Mobile-First).
  * **Dark / Light mode** persistant (via `localStorage` et classe CSS `dark`).
  * **Animations fluides** avec `framer-motion` lors de l'ajout, la modification ou la suppression de cartes.
  * **États de chargement** avec des skeletons animés (Pulse) et spinners.
  * **Notifications toast** immédiates via `react-hot-toast`.
  * **Recherche en temps réel** avec débounce (`useDebounce`) pour préserver les performances de l'API.

---

## 🛠️ Instructions d'Installation & Démarrage

### Prérequis
* **Node.js** (v18.0.0 ou supérieure)
* **MongoDB** (localement sur `mongodb://localhost:27017` ou un cluster MongoDB Atlas)

---

### Étape 1 : Cloner et installer les dépendances

Depuis la racine du projet `todolist/` :

```bash
# Installer toutes les dépendances (backend et frontend)
npm run install:all
```

*(Ou alternativement)* :
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

### Étape 2 : Configuration des variables d'environnement

#### Backend (`backend/.env`)
Un fichier `.env` prêt à l'emploi a été configuré dans `backend/.env` :
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/todolist
CLIENT_URL=http://localhost:5173
JWT_SECRET=super_secret_jwt_key_production_change_me_12345
JWT_EXPIRES_IN=7d
```

#### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### Étape 3 : Démarrer l'application

#### Option A : Lancement via les scripts à la racine
Dans deux terminaux distincts :

**Terminal 1 (Backend) :**
```bash
npm run dev:backend
```
> Le serveur démarre sur **http://localhost:5000**

**Terminal 2 (Frontend) :**
```bash
npm run dev:frontend
```
> L'application s'ouvre sur **http://localhost:5173**

---

## 📡 Endpoints de l'API RESTful

| Méthode | Endpoint | Description | Paramètres / Filtres |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/tasks` | Lister les tâches | `status`, `priority`, `search`, `sortBy`, `order`, `page`, `limit` |
| **GET** | `/api/tasks/stats` | Métriques globales | (Comptages totaux, statut, priorités, % complétion) |
| **GET** | `/api/tasks/:id` | Détails d'une tâche | `id` (Mongo ObjectId) |
| **POST** | `/api/tasks` | Créer une tâche | `{ title, description, status, priority, dueDate, tags }` |
| **PUT** | `/api/tasks/:id` | Mettre à jour | `{ title, description, status, priority, dueDate, tags }` |
| **DELETE**| `/api/tasks/:id` | Supprimer une tâche | `id` (Mongo ObjectId) |
| **POST** | `/api/auth/register` | Inscription compte | `{ username, email, password }` |
| **POST** | `/api/auth/login` | Connexion compte | `{ email, password }` |
| **GET** | `/api/health` | Bilan de santé API | Uptime, statut et timestamp |
