const express = require('express');
const { createTestSuiteHandler, getAllTestSuitesHandler, getTestSuiteByIdHandler, updateTestSuiteHandler, deleteTestSuiteHandler } = require('../controllers/testSuiteController');
const verifyToken = require('../middlewares/authMiddleware'); // Importer le middleware d'authentification
const router = express.Router();

// Routes CRUD pour les suites de tests avec authentification
router.post('/', verifyToken, createTestSuiteHandler);        // Créer une suite de test
router.get('/', verifyToken, getAllTestSuitesHandler);        // Obtenir toutes les suites de tests
router.get('/:id', verifyToken, getTestSuiteByIdHandler);     // Obtenir une suite de test par ID
router.put('/:id', verifyToken, updateTestSuiteHandler);      // Mettre à jour une suite de test par ID
router.delete('/:id', verifyToken, deleteTestSuiteHandler);   // Supprimer une suite de test par ID

module.exports = router;
