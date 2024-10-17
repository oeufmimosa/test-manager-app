const { getUsersCollection } = require('../db');

// Trouver un utilisateur par email
const findUserByEmail = async (email) => {
  const usersCollection = getUsersCollection();
  return await usersCollection.findOne({ email },{ projection: { password: 0 } });
};

// Trouver un utilisateur par ID
const findUserById = async (userId) => {
  const usersCollection = getUsersCollection();
  return await usersCollection.findOne({ user_id: userId },{ projection: { password: 0 } });
};

// Créer un utilisateur
const createUser = async (userData) => {
  const usersCollection = getUsersCollection();
  return await usersCollection.insertOne(userData);
};

// Mettre à jour un utilisateur par ID
const updateUserById = async (userId, updateData) => {
  const usersCollection = getUsersCollection();
  return await usersCollection.updateOne({ user_id: userId }, { $set: updateData });
};

// Supprimer un utilisateur par ID
const deleteUserById = async (userId) => {
  const usersCollection = getUsersCollection();
  return await usersCollection.deleteOne({ user_id: userId },);
};

// Récupérer tous les utilisateurs
const getAllUsers = async () => {
  const usersCollection = getUsersCollection();
  return await usersCollection.find({}, { projection: { password: 0 } }).toArray();
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserById,
  deleteUserById,
  getAllUsers,
};