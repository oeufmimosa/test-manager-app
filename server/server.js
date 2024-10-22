const express = require('express');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const testSuitesRoutes = require('./routes/testSuiteRoutes');
const testRoutes = require('./routes/testRoutes');
const testStepRoutes = require('./routes/testStepRoutes');
const cors = require('cors'); 
const app = express();
const initSuperAdmin = require('./dbInit');
const {connectDB} = require('./db');

app.use(express.json()); // Parse les requêtes en JSON

app.use(cors({
  origin: 'http://localhost:3000', // Autoriser uniquement les requêtes depuis votre frontend
  credentials: true
}));

// Démarrer la connexion à la base de données et initialiser le superadmin au démarrage du serveur
const startServer = async () => {
  try {
    await connectDB(); // Connexion à la base de données
    await initSuperAdmin(); // Initialisation du superadmin
    console.log("Connexion réussie et superadmin vérifié.");
  } catch (err) {
    console.error("Erreur au démarrage du serveur :", err);
    process.exit(1);
  }
};

startServer(); // Appeler la fonction pour démarrer le serveur

// Utiliser les routes
app.use('/users', userRoutes);
app.use('/test-suites', testSuitesRoutes);
app.use('/tests', testRoutes); 
app.use('/test-steps', testStepRoutes); 

// Démarrer le serveur
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

