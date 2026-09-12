# SUP Herman - Gestion des notes de frais

Application interne de gestion des notes de frais, remplaçant le processus manuel (Slack + Excel) par une application web avec trois rôles : Employé, Manager, Comptabilité.

## Stack technique

**Frontend** : React (Vite), React Router, MUI (Material UI), Axios

**Backend** : Node.js, Express, Prisma ORM, SQLite, JWT (jsonwebtoken), bcrypt, Multer, Zod

**Déploiement** : Docker

## Installation et lancement

### .env

Changer le `backend/.env.example` en `.env` et changer le JWT_SECRET.

### Docker

Prérequis : Docker et Docker Compose installés.

À la racine du projet :

```bash
docker compose up --build -d
```

L'application est accessible sur **http://localhost:4000**. Au premier démarrage, les migrations de base de données et le compte manager par défaut sont créés automatiquement. Les données (base SQLite et fichiers uploadés) sont conservées entre les redémarrages grâce aux volumes Docker.


## Configuration

Le backend a besoin d'un fichier `.env` à la racine de `backend/` (voir `backend/.env.example`) :

| Variable | Description |
|---|---|
| `DATABASE_URL` | Chemin de la base SQLite (généré par Prisma, ne pas modifier) |
| `JWT_SECRET` | Clé secrète pour signer les tokens JWT - à changer |
| `JWT_EXPIRES_IN` | Durée de validité des sessions (ex. `2h`) |
| `PORT` | Port d'écoute du serveur (`4000` par défaut) |
| `FRONTEND_URL` | URL du frontend, utilisée pour générer les liens d'invitation |

En développement local (frontend séparé sur Vite), `FRONTEND_URL` doit valoir `http://localhost:5173`. En usage Docker/production, tout est servi sur le même port : `http://localhost:4000`.

## Compte de test

Un compte Manager est créé automatiquement au premier démarrage :

- **Email** : `manager@supherman.com`
- **Mot de passe** : `Suph3rm4n!`

Les comptes Employé et Comptabilité se créent depuis l'application via ce compte Manager (voir manuel utilisateur).

## Manuel utilisateur

### Connexion

Un compte ne peut pas s'auto-créer, il doit être créé par un Manager. À la création, aucun mot de passe n'est défini, un lien d'invitation est généré et doit être transmis manuellement à la personne concernée (par exemple via Slack), qui l'utilise pour choisir son mot de passe avant de pouvoir se connecter. Dans un contexte réel d'entreprise, un mail serait envoyé automatiquement à la personne, plutôt que d'afficher le lien et le token au manager.

### Employé

- **Mes notes de frais** (page d'accueil) : liste ses propres notes avec leur statut. Cliquer sur une note ouvre le détail (pièces jointes téléchargeables, commentaire, statut).
- **Nouvelle note** : formulaire titre + commentaire + pièces justificatives (PDF, JPEG ou PNG, 5 Mo max par fichier, plusieurs fichiers possibles).
- **Profil** : consultation de son email et son rôle.

### Manager

Accès à tout ce que voit l'Employé, plus :

- **Toutes les notes** : liste de toutes les notes de frais de l'entreprise, avec l'email de l'employé concerné. Peut Valider ou Refuser une note au statut "Créée", sauf ses propres notes.
- **Inviter un employé** : création d'un compte (email + rôle), génère un lien d'invitation à transmettre.

### Comptabilité

Accès à "Toutes les notes" et "Profil" :

- Ne voit que les notes aux statuts "Validée" ou "Traitée".
- Peut marquer une note "Validée" comme "Traitée".

## Documentation technique

### Architecture

Application découpée en deux parties dans un même dépôt (`frontend/`, `backend/`), assemblées en une seule image Docker pour la mise en production : Express sert à la fois l'API REST et les fichiers statiques du build React, ce qui évite tout problème de CORS ou de configuration réseau supplémentaire pour lancer le projet.

**Backend** :
```
routes/       -> définition des endpoints
controllers/  -> validation des entrées, orchestration
services/     -> logique métier, accès à la base via Prisma
middlewares/  -> authentification (JWT), autorisation par rôle, upload, erreurs
validators/   -> schémas de validation (Zod)
```

**Frontend** :
```
features/    -> une page par domaine (auth, expenses, users)
components/  -> composants partagés (modale de détail, badge de statut, confirmation)
context/     -> état d'authentification global
api/         -> appels vers le backend
layouts/     -> structure commune (navbar, protection de route)
```

### Modèle de données

Trois tables (voir `backend/prisma/schema.prisma`) :

- **User** : email, mot de passe (hashé), rôle, champs d'invitation (token hashé + expiration)
- **ExpenseReport** : titre, commentaire, statut, date, lié à un User
- **Attachment** : métadonnées des fichiers joints (nom original, nom stocké, type, taille), lié à une ExpenseReport

### Sécurité

- Mots de passe hashés avec bcrypt
- Autorisation par rôle vérifiée côté serveur sur chaque route sensible
- Chaque note de frais est filtrée par utilisateur au niveau de la requête base de données
- Validation des entrées avec Zod
- Fichiers uploadés : noms générés côté serveur, type et taille contrôlés
- Rate limit sur la connexion
- `helmet` pour les en-têtes HTTP, CORS restreint à l'origine du frontend
- Secrets et configuration dans `.env`, voir `.env.example`

## Dépôt Git

https://github.com/krakitooo/3EXPI-SupHerman