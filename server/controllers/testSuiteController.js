const { createTestSuite, findTestSuiteById, getAllTestSuites, updateTestSuiteById, deleteTestSuiteById } = require('../models/testSuiteModel');
const { ObjectId } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

// Créer une nouvelle suite de test
const createTestSuiteHandler = async (req, res) => {
  try {
    const { name, description} = req.body;

    // Validation des champs obligatoires
    if (!name) {
      return res.status(400).json({ message: "Un nom est requis" });
    }
    
    const createdBy = req.user.user_id;

    const suiteId = uuidv4();

    const suiteData = {
      suite_id: suiteId,
      name,
      description,
      createdBy, // user_id
      tags: [], // Tableau vide de tags par défaut
      createdAt: new Date(),
    };

    const result = await createTestSuite(suiteData);
    res.status(201).json({ message: "Suite de test créée avec succès", suite: { name, description, createdBy } });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création de la suite de test", error: err });
  }
};

// Récupérer toutes les suites de test
const getAllTestSuitesHandler = async (req, res) => {
  try {
    const suites = await getAllTestSuites();
    res.status(200).json(suites);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des suites de tests", error: err });
  }
};

// Récupérer une suite de test par ID
const getTestSuiteByIdHandler = async (req, res) => {
  try {
    const suiteId = req.params.id;
    const suite = await findTestSuiteById(suiteId);
    
    if (!suite) {
      return res.status(404).json({ message: "Suite de test non trouvée" });
    }

    res.status(200).json(suite);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération de la suite de test", error: err });
  }
};

// Mettre à jour une suite de test par ID
const updateTestSuiteHandler = async (req, res) => {
  try {
    const suiteId = req.params.id;
    const { name, description, tags } = req.body;

    const updateData = { name, description, tags };

    const result = await updateTestSuiteById(ObjectId(suiteId), updateData);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Suite de test non trouvée" });
    }

    res.status(200).json({ message: "Suite de test mise à jour avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la suite de test", error: err });
  }
};

// Supprimer une suite de test par ID
const deleteTestSuiteHandler = async (req, res) => {
  try {
    const suiteId = req.params.id;
    const result = await deleteTestSuiteById(suiteId);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Suite de test non trouvée" });
    }

    res.status(200).json({ message: "Suite de test supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression de la suite de test", error: err });
  }
};

module.exports = {
  createTestSuiteHandler,
  getAllTestSuitesHandler,
  getTestSuiteByIdHandler,
  updateTestSuiteHandler,
  deleteTestSuiteHandler,
};
