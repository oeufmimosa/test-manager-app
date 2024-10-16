const bcrypt = require('bcryptjs');
const { getUsersCollection } = require('./db'); // Utilisation de la fonction getUsersCollection depuis db.js

const initSuperAdmin = async () => {
  const usersCollection = getUsersCollection();

  const superAdmin = await usersCollection.findOne({ role: 'superadmin' });

  if (!superAdmin) {
    const hashedPassword = await bcrypt.hash('superadmin', 10);

    const newSuperAdmin = {
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
