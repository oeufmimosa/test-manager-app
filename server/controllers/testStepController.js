const { createTestStep, findTestStepsByTestId, findTestStepById, updateTestStepById, deleteTestStepById } = require('../models/testStepModel');
const { v4: uuidv4 } = require('uuid');

// Créer un nouveau step de test
const createTestStepHandler = async (req, res) => {
  try {
    const { test_id, description } = req.body;

    if (!test_id || !description) {
      return res.status(400).json({ message: "Les champs 'test_id' et 'description' sont requis" });
    }

    const stepId = uuidv4();

    const stepData = {
      step_id: stepId,
      test_id,
      description,
      images: req.files ? req.files.map(file => file.path) : [], // Stocker les chemins des images
      createdAt: new Date(),
    };

    const result = await createTestStep(stepData);
    
    res.status(201).json({ message: "Step de test créé avec succès", step: result.ops[0] });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création du step de test", error: err });
  }
};

// Récupérer un step de test par ID
const getTestStepByIdHandler = async (req, res) => {
    try {
      const stepId = req.params.id; // Récupérer step_id depuis les paramètres de l'URL
      const step = await findTestStepById(stepId);
  
      if (!step) {
        return res.status(404).json({ message: "Step de test non trouvé" });
      }
  
      res.status(200).json(step);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération du step de test", error: err });
    }
  };

// Récupérer tous les steps liés à un test
const getTestStepsByTestIdHandler = async (req, res) => {
  try {
    const testId = req.params.test_id;
    const steps = await findTestStepsByTestId(testId);

    if (!steps || steps.length === 0) {
      return res.status(404).json({ message: "Aucun step trouvé pour ce test" });
    }

    res.status(200).json(steps);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des steps", error: err });
  }
};

// Mettre à jour un step de test par ID
const updateTestStepHandler = async (req, res) => {
  try {
    const stepId = req.params.id;
    const { description } = req.body;

    const updateData = {
      description,
      images: req.files ? req.files.map(file => file.path) : [],
    };

    const result = await updateTestStepById(stepId, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Step de test non trouvé" });
    }

    res.status(200).json({ message: "Step de test mis à jour avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du step de test", error: err });
  }
};

// Supprimer un step de test par ID
const deleteTestStepHandler = async (req, res) => {
  try {
    const stepId = req.params.id;
    const result = await deleteTestStepById(stepId);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Step de test non trouvé" });
    }

    res.status(200).json({ message: "Step de test supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression du step de test", error: err });
  }
};

module.exports = {
  createTestStepHandler,
  getTestStepsByTestIdHandler,
  updateTestStepHandler,
  deleteTestStepHandler,
  getTestStepByIdHandler,
};
