const express = require('express');
const { loginUser, registerUser, getAllUsersHandler, getUserByIdHandler, updateUserHandler, deleteUserHandler, registerAdmin } = require('../controllers/userController');
const isAdmin = require('../middlewares/isAdmin'); // Middleware pour vérifier si l'utilisateur est admin
const isSuperAdmin = require('../middlewares/isSuperAdmin'); // Middleware pour vérifier si l'utilisateur est superadmin
const isSelfOrAdmin = require('../middlewares/isSelfOrAdmin'); // Middleware pour vérifier si l'utilisateur est lui-même ou un admin
const router = express.Router();

// Route ouverte à tous (y compris les utilisateurs standards)
router.post('/login', loginUser);
router.post('/', registerUser);

// Routes protégées par un middleware 
router.get('/', isAdmin, getAllUsersHandler);        // Seul l'admin peut lister les utilisateurs
router.get('/:id', isSelfOrAdmin, getUserByIdHandler);     // Seul l'admin et l'utilisateur lui même peuvent consulter le profil
router.put('/:id', isSelfOrAdmin, updateUserHandler);      // Seul l'admin et l'utilisateur lui même peuvent modifier le profil
router.delete('/:id', isSelfOrAdmin, deleteUserHandler);   // Seul l'admin et l'utilisateur lui même peuvent supprimer le compte
router.post('/admin', isSuperAdmin, registerAdmin); // Restreint la création d'admins au superadmin


module.exports = router;
