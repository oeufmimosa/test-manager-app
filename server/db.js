const { MongoClient } = require('mongodb');
require('dotenv').config();


const uri = process.env.MONGODB_URI;
let db;

const connectDB = async () => {
  if (db) return db; // Si la base de données est déjà connectée, retourner l'instance.

  try {
    const client = new MongoClient(uri); 
    await client.connect();
    db = client.db("Cluster0"); 
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

const getUsersCollection = () => {
  return getDB().collection('users');
};

module.exports = {
  connectDB,
  getUsersCollection,
};
