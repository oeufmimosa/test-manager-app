const { getUsersCollection } = require('../db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser, findUserById, updateUserById, deleteUserById, getAllUsers } = require('../models/userModel');


// Créer un utilisateur
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà" });
    }

    const userId = uuidv4(); // Générer un ID unique pour l'utilisateur

    // Hacher le mot de passe avant de le stocker
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur avec le rôle 'user'
    const newUser = {
      user_id: userId,
      name,
      email,
      password: hashedPassword,
      role: 'user',  // Rôle par défaut pour les utilisateurs standards
      createdAt: new Date()
    };

    await createUser(newUser);

    res.status(201).json({ message: "Utilisateur créé avec succès", user: { name, email, role: 'user' } });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création de l'utilisateur", error: err });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Un administrateur avec cet email existe déjà" });
    }
    // Générer un ID unique pour l'administrateur
    const userId = uuidv4();
    // Hacher le mot de passe avant de le stocker
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur avec le rôle 'admin'
    const newAdmin = {
      user_id: userId,
      name,
      email,
      password: hashedPassword,
      role: 'admin',  // Rôle spécifié pour les administrateurs
      createdAt: new Date()
    };

    createUser(newAdmin);

    res.status(201).json({ message: "Administrateur créé avec succès", user: { name, email, role: 'admin' } });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création de l'administrateur", error: err });
  }
};



// Obtenir tous les utilisateurs
const getAllUsersHandler = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error("Erreur lors de la récupération des utilisateurs:", err); // Log dans la console
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error: err });
  }
};

  
  // Obtenir un utilisateur par ID
const getUserByIdHandler = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    res.status(200).json(user);
  } catch (err) {
    console.error("Erreur lors de la récupération de l'utilisateur:", err);
    res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", error: err });
  }
};
  
  
  // Mettre à jour un utilisateur
const updateUserHandler = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await findUserById(userId);

    if (user.role === 'superadmin') {
      return res.status(403).json({ message: "Le superadmin ne peut pas être modifié" });
    }

    const { name, email, password } = req.body;
    const updateData = { name, email };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const result = await updateUserById(userId, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({ message: "Utilisateur mis à jour avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur", error: err });
  }
};

const deleteUserHandler = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await findUserById(userId);

    if (user.role === 'superadmin') {
      return res.status(403).json({ message: "Le superadmin ne peut pas être supprimé" });
    }

    const result = await deleteUserById(userId);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur", error: err });
  }
};

  
  // Connexion de l'utilisateur
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe sont requis" });
    }

    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const payload = {
      user_id: user.user_id,
      email: user.email,
      role: user.role // Ajouter le rôle de l'utilisateur au payload
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || '123456', {
      expiresIn: '1h'
    });

    res.status(200).json({ message: "Connexion réussie", token });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la connexion", error: err });
  }
};
  
  
module.exports = {
  registerUser,
  registerAdmin,
  loginUser,
  getAllUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
  deleteUserHandler,
};