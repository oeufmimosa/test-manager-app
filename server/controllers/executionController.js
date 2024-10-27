const { createExecution, updateExecutionStatus, getExecutionById, getAllExecutions} = require('../models/executionModel');

// Créer une nouvelle exécution pour une suite de tests
const createExecutionHandler = async (req, res) => {
    try {
      const { suite_id, execution_name, tests } = req.body;
  
      if (!suite_id || !execution_name || !tests || !Array.isArray(tests)) {
        return res.status(400).json({ message: "suite_id, execution_name, et tests sont requis" });
      }
  
      const newExecution = await createExecution(suite_id, execution_name, tests);
      res.status(201).json({ message: 'Exécution créée avec succès', execution: newExecution });
    } catch (err) {
      console.error('Erreur lors de la création de l\'exécution :', err);
      res.status(500).json({ message: "Erreur lors de la création de l'exécution", error: err.message });
    }
  };

// Mettre à jour le statut d'un test dans une exécution
const updateExecutionStatusHandler = async (req, res) => {
  try {
    const { execution_id, test_id, status } = req.body;

    if (!execution_id || !test_id || !status) {
      return res.status(400).json({ message: "execution_id, test_id, et status sont requis" });
    }

    const result = await updateExecutionStatus(execution_id, test_id, status);
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Exécution ou test non trouvé" });
    }

    res.status(200).json({ message: 'Statut du test mis à jour avec succès' });
  } catch (err) {
    console.error("Erreur lors de la mise à jour du statut du test :", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut du test", error: err.message });
  }
};

// Obtenir une exécution par son ID
const getExecutionByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const execution = await getExecutionById(id);
    if (!execution) {
      return res.status(404).json({ message: "Exécution non trouvée" });
    }

    res.status(200).json(execution);
  } catch (err) {
    console.error("Erreur lors de la récupération de l'exécution :", err);
    res.status(500).json({ message: "Erreur lors de la récupération de l'exécution", error: err.message });
  }
};

const getAllExecutionsHandler = async (req, res) => {
    try {
      const executions = await getAllExecutions();
      res.status(200).json(executions);
    } catch (err) {
      console.error("Erreur lors de la récupération des exécutions :", err);
      res.status(500).json({ message: "Erreur lors de la récupération des exécutions", error: err.message });
    }
  };

module.exports = {
  createExecutionHandler,
  updateExecutionStatusHandler,
  getExecutionByIdHandler,
  getAllExecutionsHandler,
};
