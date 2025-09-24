# WildWatch - Application de pour partager ses observations de la nature

WildWatch est une application mobile développée avec Expo et React Native qui permet aux utilisateurs de découvrir et documenter et partager la nature qui les entoure. L'application utilise la géolocalisation et Google Maps pour créer des observations géolocalisées avec photos et descriptions.


## Prérequis techniques

- Node.js (version 18 ou supérieure)
- npm ou yarn
- Expo CLI
- Un appareil mobile ou un émulateur
- Une clé API Google Maps (requis pour le fonctionnement de l'application)

## Lancer le projet

- Cloner le projet
- Installer les dépendances

```bash
npm install
# ou
yarn install
```

- Configuration de la clé API Google Maps
Créez un fichier `.env` à la racine du projet :

GOOGLE_MAPS_API_KEY=votre_cle_api_google_maps_ici


- Démarrer l'application

```bash
# Démarrer le serveur de développement
npm start
# ou
yarn start
```