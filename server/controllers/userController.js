require('dotenv').config();
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

// Handler pour trouver un utilisateur par ID (sans renvoyer le mot de passe)
const getUserByIdHandler = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Filtrer les champs sensibles avant d'envoyer la réponse
    const { password, ...safeUser } = user; // Exclure le mot de passe

    res.status(200).json(safeUser);
  } catch (err) {
    console.error("Erreur lors de la récupération de l'utilisateur:", err);
    res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", error: err });
  }
};
  
  
  // Mettre à jour un utilisateur
  const updateUserHandler = async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, email,} = req.body;
  
      const user = await findUserById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      // Mise à jour des informations utilisateur (nom, email)
      if (name || email) {
        await updateUserById(userId, { name, email });
      }
  
      res.status(200).json({ message: "Informations mises à jour avec succès" });
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", err);
      res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur", error: err });
    }
  };

  const changePasswordHandler = async (req, res) => {
    try {
      const userId = req.params.id;
      const { oldPassword, newPassword } = req.body;
  
      // Assurez-vous que les champs oldPassword et newPassword sont bien fournis
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Les champs 'oldPassword' et 'newPassword' sont requis" });
      }
  
      const user = await findUserById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      console.log("Ancien mot de passe:", oldPassword); // Log pour vérifier
      console.log("Mot de passe de l'utilisateur dans la base de données:", user.password); // Log pour vérifier
  
      // Vérifier si l'ancien mot de passe est correct
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "L'ancien mot de passe est incorrect" });
      }
  
      // Hacher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await updateUserById(userId, { password: hashedPassword });
  
      console.log("Mot de passe mis à jour avec succès"); // Log pour confirmer la mise à jour
  
      res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
    } catch (err) {
      console.error("Erreur lors de la mise à jour du mot de passe:", err);
      res.status(500).json({ message: "Erreur lors de la mise à jour du mot de passe", error: err });
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
      const user = await findUserByEmail(email);
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }
  
      const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: false, // Assurez-vous que c'est bien réglé pour votre environnement local
        sameSite: 'Lax',
        maxAge: 60 * 60 * 1000, // 1 heure
      });
  
      console.log("Cookie défini avec le token:", token); // Ajoutez ce log
  
      res.status(200).json({ message: "Connexion réussie" });
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la connexion", error: err });
    }
  };

  const logoutUser = (req, res) => {
    // Effacer le cookie en définissant son expiration à une date passée
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: false // Assurez-vous d'utiliser "https" en production
    });
    res.status(200).json({ message: "Déconnexion réussie" });
  };

  const checkAuth = (req, res) => {
    const token = req.cookies.authToken;
    console.log("Token du cookie pour check-auth :", token);
  
    if (!token) {
      return res.status(401).json({ message: 'Non authentifié' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Vérifiez que le token contient les informations nécessaires
      console.log("Données décodées du token :", decoded);
  
      // Extraire les informations importantes (id, role, name, etc.)
      const { id, role, name, email } = decoded;
  
      // Envoyer uniquement les informations importantes
      res.status(200).json({
        message: 'Authentifié',
        role: role,
        name: name,
        email: email,
      });
    } catch (err) {
      console.log("Erreur dans check-auth :", err);
      res.status(401).json({ message: 'Token invalide ou expiré' });
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
  changePasswordHandler,
  logoutUser,
  checkAuth,
};