const express = require('express');
const { loginUser, registerUser, getAllUsersHandler, getUserByIdHandler, updateUserHandler, deleteUserHandler, registerAdmin } = require('../controllers/userController');
const isAdmin = require('../middlewares/isAdmin'); // Middleware pour vérifier si l'utilisateur est admin
const isSuperAdmin = require('../middlewares/isSuperAdmin'); // Middleware pour vérifier si l'utilisateur est superadmin
const router = express.Router();

// Route ouverte à tous (y compris les utilisateurs standards)
router.post('/login', loginUser);

// Routes protégées par le middleware admin
router.post('/', isAdmin, registerUser);        // Seul l'admin peut créer des utilisateurs
router.get('/', isAdmin, getAllUsersHandler);        // Seul l'admin peut lister les utilisateurs
router.get('/:id', isAdmin, getUserByIdHandler);     // Seul l'admin peut consulter un utilisateur par ID
router.put('/:id', isAdmin, updateUserHandler);      // Seul l'admin peut modifier un utilisateur
router.delete('/:id', isAdmin, deleteUserHandler);   // Seul l'admin peut supprimer un utilisateur
router.post('/admin', isSuperAdmin, registerAdmin); // Restreint la création d'admins au superadmin


module.exports = router;
