const express = require('express');
const { createTestStepHandler, getTestStepByIdHandler, getTestStepsByTestIdHandler, updateTestStepHandler, deleteTestStepHandler } = require('../controllers/testStepController');
const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../config/multer');
const router = express.Router();

// Routes CRUD pour les steps de test avec gestion des fichiers
router.post('/', verifyToken, upload.array('images', 10), createTestStepHandler); // Créer un step de test avec images
router.get('/:id', verifyToken, getTestStepByIdHandler); // Obtenir un step de test par step_id
router.get('/test/:test_id', verifyToken, getTestStepsByTestIdHandler); // Obtenir tous les steps liés à un test
router.put('/:id', verifyToken, upload.array('images', 10), updateTestStepHandler); // Mettre à jour un step avec images
router.delete('/:id', verifyToken, deleteTestStepHandler); // Supprimer un step

module.exports = router;
