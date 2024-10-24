const { createTest, findTestById, getAllTests, updateTestById, deleteTestById, findTestsBySuiteId } = require('../models/testModel');
const { ObjectId } = require('mongodb');
const { v4: uuidv4 } = require('uuid');


// Créer un nouveau test
const createTestHandler = async (req, res) => {
  try {
    const { name, description, suiteIds } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Le champ 'name' est requis" });
    }

    const createdBy = req.user.user_id; // Récupérer l'ID de l'utilisateur connecté
    const testId = uuidv4();

    const testData = {
      test_id: testId,
      name,
      description,
      createdBy,
      createdAt: new Date(),
      suiteIds: suiteIds || [], // Peut être un tableau vide
    };

    const result = await createTest(testData);
    
    res.status(201).json({ message: "Test créé avec succès", test: { name, description, createdBy, suiteIds} });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création du test", error: err });
  }
};

// Récupérer tous les tests
const getAllTestsHandler = async (req, res) => {
  try {
    const tests = await getAllTests();
    res.status(200).json(tests);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des tests", error: err });
  }
};

// Récupérer un test par ID
const getTestByIdHandler = async (req, res) => {
  try {
    const testId = req.params.id;
    const test = await findTestById(testId);

    if (!test) {
      return res.status(404).json({ message: "Test non trouvé" });
    }

    res.status(200).json(test);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération du test", error: err });
  }
};

// Mettre à jour un test par ID
const updateTestHandler = async (req, res) => {
  try {
    const testId = req.params.id;
    const { name, description, suiteIds } = req.body;

    const updateData = {
      name,
      description,
      suiteIds,
    };

    const result = await updateTestById(testId, updateData);
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Test non trouvé" });
    }

    res.status(200).json({ message: "Test mis à jour avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du test", error: err });
  }
};

// Supprimer un test par ID
const deleteTestHandler = async (req, res) => {
  try {
    const testId = req.params.id;
    const result = await deleteTestById(testId);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Test non trouvé" });
    }

    res.status(200).json({ message: "Test supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression du test", error: err });
  }
};


// Récupérer tous les tests associés à une suite de test par suite_id
const getTestsBySuiteIdHandler = async (req, res) => {
    try {
      const suiteId = req.params.suite_id;  // Récupérer suite_id depuis les paramètres d'URL
      const tests = await findTestsBySuiteId(suiteId);
  
      if (!tests || tests.length === 0) {
        return res.status(404).json({ message: "Aucun test trouvé pour cette suite de test" });
      }
  
      res.status(200).json(tests);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des tests pour cette suite", error: err });
    }
  };
  
  module.exports = {
    createTestHandler,
    getAllTestsHandler,
    getTestByIdHandler,
    updateTestHandler,
    deleteTestHandler,
    getTestsBySuiteIdHandler,  
  };