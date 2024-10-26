const express = require('express');
const { loginUser, registerUser, getAllUsersHandler, getUserByIdHandler, updateUserHandler, deleteUserHandler, registerAdmin, changePasswordHandler, logoutUser, checkAuth} = require('../controllers/userController');
const isAdmin = require('../middlewares/isAdmin'); // Middleware pour vérifier si l'utilisateur est admin
const isSuperAdmin = require('../middlewares/isSuperAdmin'); // Middleware pour vérifier si l'utilisateur est superadmin
const isSelfOrAdmin = require('../middlewares/isSelfOrAdmin'); // Middleware pour vérifier si l'utilisateur est lui-même ou un admin
const verifyToken = require('../middlewares/authMiddleware');
const router = express.Router();

// Route ouverte à tous (y compris les utilisateurs standards)
router.post('/login', loginUser);
router.get('/check-auth', checkAuth);
router.post('/logout', logoutUser);

// Routes ouverte pour la création d'un compte user
router.post('/', registerUser);

// Route pour récupérer les informations de l'utilisateur connecté
router.get('/me', verifyToken, (req, res, next) => {
    // Assigner l'ID de l'utilisateur du token à req.params.id
    req.params.id = req.user.user_id;
    getUserByIdHandler(req, res, next);
  });

// Route pour mettre à jour les informations de l'utilisateur connecté
router.put('/me', verifyToken, async (req, res) => {
    req.params.id = req.user.user_id; 
    updateUserHandler(req, res);
});

// Route spécifique pour changer le mot de passe de l'utilisateur connecté
router.put('/me/password', verifyToken, async (req, res) => {
    req.params.id = req.user.user_id;
    changePasswordHandler(req, res);
  });
  
// Routes protégées par un middleware 
router.get('/', isAdmin, getAllUsersHandler);        // Seul l'admin peut lister les utilisateurs
router.get('/:id', isSelfOrAdmin, getUserByIdHandler);     // Seul l'admin et l'utilisateur lui même peuvent consulter le profil
router.put('/:id', isSelfOrAdmin, updateUserHandler);      // Seul l'admin et l'utilisateur lui même peuvent modifier le profil
router.delete('/:id', isSelfOrAdmin, deleteUserHandler);   // Seul l'admin et l'utilisateur lui même peuvent supprimer le compte
router.post('/admin', isSuperAdmin, registerAdmin); // Restreint la création d'admins au superadmin


module.exports = router;
