const { MongoClient } = require('mongodb');
require('dotenv').config();


const uri = process.env.MONGODB_URI;
let db;

const connectDB = async () => {
  if (db) return db; // Si la base de données est déjà connectée, retourner l'instance.

  try {
    const client = new MongoClient(uri); 
    await client.connect();
    db = client.db("testman"); 
    console.log("Connecté à MongoDB!");
    return db;
  } catch (err) {
    console.error("Erreur de connexion à MongoDB", err);
    process.exit(1); // Arrêter l'application en cas d'échec de connexion
  }
};

const getDB = () => {
  if (!db) throw new Error("La connexion à la base de données n'a pas encore été établie.");
  return db;
};

// Récupérer la collection des users
const getUsersCollection = () => {
  return getDB().collection('users');
};

// Récupérer la collection des suites de tests
const getTestSuitesCollection = () => {
  return getDB().collection('testSuites');
};

// Récupérer la collection des tests
const getTestsCollection = () => {
  return getDB().collection('tests');
};

// Récupérer la collection des steps de test
const getTestStepsCollection = () => {
  return getDB().collection('testSteps');
};

module.exports = {
  connectDB,
  getUsersCollection,
  getTestSuitesCollection,
  getTestsCollection,
  getTestStepsCollection
};
