const bcrypt = require('bcryptjs');
const { getUsersCollection } = require('./db'); // Utilisation de la fonction getUsersCollection depuis db.js
const { v4: uuidv4 } = require('uuid');

// Initialisation du superadmin s'il n'existe pas déjà dans la base de données.
const initSuperAdmin = async () => {
  const usersCollection = getUsersCollection();

  const superAdmin = await usersCollection.findOne({ role: 'superadmin' });

  if (!superAdmin) {
    const hashedPassword = await bcrypt.hash('This_is_a_test0', 10);
    const userId = uuidv4();
    const newSuperAdmin = {
      user_id: userId,
      name: 'Super Admin',
      email: 'superadmin@test.com',
      password: hashedPassword,
      role: 'superadmin',
      createdAt: new Date()
    };

    await usersCollection.insertOne(newSuperAdmin);
    console.log("Superadmin créé avec succès !");
  } else {
    console.log("Superadmin existe déjà !");
  }
};

module.exports = initSuperAdmin;
