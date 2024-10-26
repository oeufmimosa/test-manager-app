const express = require('express');
const path = require('path');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const testSuitesRoutes = require('./routes/testSuiteRoutes');
const testRoutes = require('./routes/testRoutes');
const testStepRoutes = require('./routes/testStepRoutes');
const executionRoutes = require('./routes/executionRoutes');
const cors = require('cors'); 
const app = express();
const initSuperAdmin = require('./dbInit');
const {connectDB} = require('./db');
const cookieParser = require('cookie-parser');

app.use(express.json()); // Parse les requêtes en JSON
app.use(cookieParser());

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/executions', executionRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.post('/test-steps', (req, res) => {
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  res.send('Vérification des données');
});