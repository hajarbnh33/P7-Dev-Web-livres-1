const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const mongoose = require('mongoose');
require('dotenv').config() //Charge les variables d'environnement à partir d'un fichier .env à la racine du projet.


const authRoutes = require('./routes/auth_route');
const booksRoutes = require('./routes/books_route');

mongoose.connect(process.env.MONGO_DB_URL, //Établit une connexion à la base de données MongoDB en utilisant l'URL fournie dans les variables d'environnement.
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();


app.use((req, res, next) => {//ajoute les en-têtes CORS à toutes les réponses HTTP de l'application pour permettre les requêtes depuis n'importe quelle origine.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.use('/api/auth/', authRoutes)
app.use('/api/books/',booksRoutes)
app.use('/images', express.static(path.join(__dirname,'images')))

module.exports = app;