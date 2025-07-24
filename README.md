# 📸 Pictur'Art

**Pictur'Art** est une plateforme web permettant aux utilisateurs de créer des albums privés pour partager des photos et vidéos avec un cercle restreint de membres. Le projet comprend un **frontend React**, un **backend Node.js/Express**, une base de données **MongoDB**, et supporte le **mode PWA** (offline, ajout à l'écran d'accueil, etc.).

---

## 🌐 Démo

- Frontend : [https://picturart.netlify.app](https://picturart.netlify.app)
- Backend : [https://backendpicturart.onrender.com](https://backendpicturart.onrender.com)

---

## 🧱 Architecture du projet

```bash
Pictur-Art/
├── client/             # Application React
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── assets/css/
│   │   └── api/api.js
│   └── Dockerfile
├── server/             # Backend Express + MongoDB
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middlewares/
│   ├── uploads/
│   ├── .env
│   ├── Dockerfile
│   └── index.js
├── docker-compose.yml
└── README.md
````

---

## ⚙️ Technologies utilisées

### Frontend

* React + React Router
* Axios
* CSS personnalisé (Mobile First)
* PWA (Service Worker, manifest, offline.html)

### Backend

* Node.js / Express
* MongoDB Atlas
* Mongoose
* Multer (upload images/vidéos)
* JWT + Bcrypt (authentification sécurisée)
* Mailtrap (réinitialisation du mot de passe)

---

## 📦 Installation en local

### Prérequis

* Node.js (v18+)
* Docker + Docker Compose 

### Clonage du projet

```bash
git clone https://github.com/BrasSelva/Pictur-Art.git
cd Pictur-Art
```

### Lancement sans Docker

#### Backend

```bash
cd server
npm install
cp .env.example .env  
npm start
```

#### Frontend

```bash
cd client
npm install
npm start
```

### Exemple `.env` (backend)

```
PORT=5000
MONGO_URI=mongodb+srv://admin:Hitema@2025@cluster0.u1fhagw.mongodb.net/picturart
JWT_SECRET=votre_secret
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=xxxxxxxxxxxx
EMAIL_PASS=xxxxxxxxxxxx
```

---

## 🐳 Lancement avec Docker

```bash
docker-compose up --build
```

* Le frontend sera accessible sur [http://localhost:3000](http://localhost:3000)
* Le backend sur [http://localhost:5000](http://localhost:5000)

---

## 📱 Fonctionnalités principales

* 🔐 Authentification sécurisée
* 🖼️ Création d’albums privés
* 📤 Upload d’images et vidéos
* 👥 Invitation de membres à un album
* 💬 Commentaires et réactions emojis
* 🔎 Barre de recherche
* 📲 Fonctionnalité PWA (offline + écran d’accueil)
* 📧 Formulaire de contact et de récupération de mot de passe

---

## 📤 Déploiement

### Frontend

Déployé avec [Netlify](https://www.netlify.com/) :

```bash
npm run build
netlify deploy --prod --dir=build
```

### Backend

Déployé avec [Render](https://render.com/)

* Connecter le repo Git (Y mettre que le backend (/server))
* Ajouter les variables d’environnement dans Render Dashboard
* MongoDB hébergée sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## 📄 Licence

MIT

---

© 2025 Pictur'Art par Pictur'Art.

```

