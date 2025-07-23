const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const utilisateurRoutes = require('./routes/utilisateurRoutes');
const albumRoutes = require('./routes/albumRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const membreAlbumRoutes = require('./routes/membreAlbumRoutes');
const reactionRoutes = require('./routes/reactionRoutes');
const commentaireRoutes = require('./routes/commentaireRoutes');

dotenv.config();
const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://picturart.netlify.app'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(" Connecté à MongoDB"))
.catch((err) => console.error(" Erreur MongoDB :", err));

app.use('/api/utilisateurs', utilisateurRoutes);

app.use('/api/albums', albumRoutes);

app.use('/api/medias', mediaRoutes);

app.use('/api/reactions', reactionRoutes);

app.use('/api/commentaires', commentaireRoutes);

app.use('/uploads', express.static('uploads'));

app.use('/api/membrealbums', membreAlbumRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
