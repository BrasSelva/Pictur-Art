const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const utilisateurRoutes = require('./routes/utilisateurRoutes');
<<<<<<< HEAD
const albumRoutes = require('./routes/albumRoutes');
=======
const mediaRoutes = require('./routes/mediaRoutes');
>>>>>>> media

dotenv.config();
const app = express();

app.use(cors());
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

app.use('/uploads', express.static('uploads'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
