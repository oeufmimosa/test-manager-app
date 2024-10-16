const { getUsersCollection } = require('../db');

// Trouver un utilisateur par email
const findUserByEmail = async (email) => {
  const usersCollection = getUsersCollection();
  return await usersCollection.findOne({ email });
};

// Trouver un utilisateur par ID
const findUserById = async (id) => {
  const usersCollection = getUsersCollection();
  return await usersCollection.findOne({ _id: id });
};

// Créer un utilisateur
const createUser = async (userData) => {
  const usersCollection = getUsersCollection();
  return await usersCollection.insertOne(userData);
};

// Mettre à jour un utilisateur par ID
const updateUserById = async (id, updateData) => {
  const usersCollection = getUsersCollection();
  return await usersCollection.updateOne({ _id: id }, { $set: updateData });
};

// Supprimer un utilisateur par ID
const deleteUserById = async (id) => {
  const usersCollection = getUsersCollection();
  return await usersCollection.deleteOne({ _id: id });
};

// Récupérer tous les utilisateurs
const getAllUsers = async () => {
  const usersCollection = getUsersCollection();
  return await usersCollection.find().toArray();
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserById,
  deleteUserById,
  getAllUsers,
};