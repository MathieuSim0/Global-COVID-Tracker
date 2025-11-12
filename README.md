# Global COVID Tracker

Ce projet est un tableau de bord interactif pour visualiser les données mondiales du COVID-19, avec une carte, des graphiques, et des statistiques par pays.

## Prérequis
- Node.js (version 14 ou supérieure recommandée)
- npm (généralement installé avec Node.js)

## Installation et lancement

Le projet est divisé en deux parties : le **frontend** (interface utilisateur) et le **backend** (API Node.js).

### 1. Cloner le dépôt

```bash
git clone <url-du-repo>
cd Covid-19-DataViz
```

### 2. Lancer le backend

Ouvrez un terminal et exécutez les commandes suivantes :

```bash
cd backend
npm install
npm start
```

- Le backend démarre généralement sur le port 5000 (http://localhost:5000).
- Il expose des endpoints pour récupérer les données COVID-19.

### 3. Lancer le frontend

Ouvrez un **deuxième terminal** et exécutez :

```bash
cd frontend
npm install
npm run dev
```

- Le frontend démarre sur le port 5173 par défaut (http://localhost:5173).
- L'application web sera accessible dans votre navigateur.

## Structure du projet

```
Covid-19-DataViz/
├── backend/      # Serveur Node.js/Express (API)
├── frontend/     # Application React (Vite)
├── data/         # Données additionnelles (optionnel)
└── README.md     # Ce fichier
```

## Conseils
- Assurez-vous que le backend est lancé avant d'utiliser le frontend.
- Si vous modifiez le code, redémarrez le serveur concerné.
- Les ports peuvent être modifiés dans les fichiers de configuration si besoin.

## Dépendances principales
- **Frontend** : React, Vite, TailwindCSS, Leaflet, Recharts
- **Backend** : Express, csv-parser

## Aide
Pour toute question ou problème, ouvrez une issue sur le dépôt ou contactez le mainteneur.

