const express = require('express');
const { createExecutionHandler, updateExecutionStatusHandler, getExecutionByIdHandler, getAllExecutionsHandler } = require('../controllers/executionController');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', verifyToken, createExecutionHandler); // Créer une exécution
router.put('/status', verifyToken, updateExecutionStatusHandler); // Mettre à jour le statut d'un test
router.get('/:id', verifyToken, getExecutionByIdHandler); // Obtenir une exécution par ID
router.get('/', verifyToken, getAllExecutionsHandler);

module.exports = router;
