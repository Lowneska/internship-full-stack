# Full Stack Internship - AI Sport Program Generator

Application full-stack permettant de générer des programmes d'entraînement sportif personnalisés.

## 🎯 Aperçu du Projet

Cette application combine authentification sécurisée et génération de programmes sportifs via IA. L'utilisateur décrit ses objectifs en langage naturel (ex: "Je veux perdre du poids, 4 séances/semaine, 45 min, sans haltères") et reçoit un programme structuré avec exercices, séries, répétitions, et conseils.

**⚠️ Note importante sur l'API OpenAI:**
Ce projet utilise un **mock de l'API OpenAI** au lieu de la vraie API payante. Le service `aiService.py` génère des programmes d'entraînement structurés de manière déterministe sans appels API réels. Cela permet de tester l'application complète sans frais. L'option AI a été implémenté mais je n'ai pas pu réellement la tester.

## Stack

| Component | Technology      |
| --------- | --------------- |
| Frontend  | React (Next.js) |
| Backend   | FastAPI         |
| Database  | SQLite          |

## Project Structure

```
├── apps/
│   ├── backend/           # API FastAPI
│   │   ├── main.py       # Point d'entrée
│   │   ├── middleware.py # CORS & auth
│   │   ├── db/           # Models & schemas
│   │   ├── modules/      # Features (auth, ai)
│   │   └── services/     # Business logic
│   └── web/              # Frontend Next.js
│       └── src/
│           ├── app/      # Pages & layouts
│           ├── features/ # Features par domaine
│           └── lib/      # Utilities
```

## 🎨 Conventions et Architecture Frontend

- **Architecture par feature** : Le code frontend est organisé par fonctionnalité (`features/auth`, `features/program`) plutôt que par type de fichier. Chaque feature contient ses composants, hooks, types et appels API.
- **Convention CSS BEM** : Tous les styles CSS suivent la méthodologie BEM (Block Element Modifier) pour une meilleure lisibilité et maintenabilité du code CSS.

## ✨ Fonctionnalités Implémentées

### 🔐 Authentification

- Inscription avec email/mot de passe
- Hash sécurisé des mots de passe (bcrypt)
- Connexion avec JWT
- Protection des routes (middleware backend + guards frontend)
- Gestion de session persistante (localStorage)

**Endpoints:**

- `POST /api/auth/signup` - Créer un compte
- `POST /api/auth/login` - Se connecter (retourne JWT)
- `GET /api/auth/me` - Récupérer l'utilisateur connecté (protégé)

### 🏋️ Générateur de Programme Sportif

- Saisie en texte libre des objectifs fitness
- Génération de programmes structurés (mock AI)
- Affichage en cartes par jour d'entraînement
- Détails: exercices, séries, répétitions, repos, calories
- Export JSON du programme
- Régénération possible

**Endpoint:**

- `POST /api/ai/program` - Générer un programme (protégé, nécessite JWT)

### 📊 Contenu Généré (Mock)

Chaque programme inclut:

- 4-6 jours d'entraînement
- Focus par jour (cardio, force, mobilité...)
- Liste d'exercices avec sets × reps
- Temps de repos entre exercices
- Échauffement et récupération
- Estimation calories brûlées
- Équipement requis

## 🚀 Installation et Lancement

### Prérequis

- Python 3.11+
- Node.js 18+
- pnpm

### Backend

```bash
cd apps/backend

# Créer l'environnement virtuel
python -m venv venv
source venv/bin/activate  # macOS/Linux
# ou: venv\Scripts\activate  # Windows

# Installer les dépendances
pip install -r requirements.txt

# Lancer le serveur
uvicorn main:app --reload
```

Le backend sera disponible sur `http://localhost:8000`

### Frontend

```bash
cd apps/web

# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm dev
```

Le frontend sera disponible sur `http://localhost:3000`

## 🔧 Configuration

### Variables d'environnement (Backend)

Créer un fichier `.env` dans `apps/backend/`:

```env
# JWT
JWT_SECRET=votre-secret-jwt-ici
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=30

# Base de données
DATABASE_URL=sqlite:///./app.db

# OpenAI (non utilisé avec le mock)
# OPENAI_API_KEY=sk-...
```

> ⚠️ La clé OpenAI n'est pas nécessaire car l'application utilise un mock.

## 📖 Documentation API

Une fois le backend lancé:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

## 🧪 Test de l'Application

1. Démarrer backend et frontend
2. Accéder à `http://localhost:3000`
3. Créer un compte via `/signup`
4. Se connecter via `/login`
5. Naviguer vers "Generate Program"
6. Saisir une description (ex: "programme perte de poids, 4 fois/semaine")
7. Cliquer "Generate" → Le mock génère un programme structuré
8. Consulter les cartes d'entraînement
9. Télécharger le JSON si besoin

## 💡 Pourquoi un Mock ?

L'API OpenAI est payante et nécessite des crédits. Pour éviter des frais pendant le développement et les tests, j'ai implémenté un service mock (`aiService.py`) qui:

- Simule la génération de programmes réalistes
- Retourne des structures JSON conformes au schema attendu
- Permet de tester toute la chaîne fonctionnelle (auth + génération + affichage)
- Peut être facilement remplacé par l'API OpenAI réelle en modifiant `aiService.py`

Pour activer l'API OpenAI réelle, il suffirait de:

1. Ajouter la clé API dans `.env`
2. Modifier `aiService.py` pour appeler OpenAI au lieu du mock
3. Installer `openai` dans `requirements.txt`
