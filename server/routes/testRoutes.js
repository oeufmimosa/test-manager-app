const express = require('express');
const { createTestHandler, getAllTestsHandler, getTestByIdHandler, updateTestHandler, deleteTestHandler, getTestsBySuiteIdHandler } = require('../controllers/testController');
const verifyToken = require('../middlewares/authMiddleware');
const router = express.Router();

// Routes CRUD pour les tests
router.post('/', verifyToken, createTestHandler);        // Créer un test
router.get('/', verifyToken, getAllTestsHandler);        // Obtenir tous les tests
router.get('/:id', verifyToken, getTestByIdHandler);     // Obtenir un test par ID
router.put('/:id', verifyToken, updateTestHandler);      // Mettre à jour un test par ID
router.delete('/:id', verifyToken, deleteTestHandler);   // Supprimer un test par ID

// Route pour obtenir les tests par suite_id
router.get('/suite/:suite_id', verifyToken, getTestsBySuiteIdHandler); // Récupérer tous les tests associés à une suite de test

module.exports = router;


