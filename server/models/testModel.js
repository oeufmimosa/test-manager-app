const { getTestsCollection } = require('../db');

// Créer un nouveau test
const createTest = async (testData) => {
  const testsCollection = getTestsCollection();
  return await testsCollection.insertOne(testData);
};

// Récupérer un test par ID
const findTestById = async (testId) => {
  const testsCollection = getTestsCollection();
  return await testsCollection.findOne({ test_id: testId });
};

// Récupérer tous les tests
const getAllTests = async () => {
  const testsCollection = getTestsCollection();
  return await testsCollection.find().toArray();
};

// Mettre à jour un test par ID
const updateTestById = async (testId, updateData) => {
  const testsCollection = getTestsCollection();
  return await testsCollection.updateOne({ test_id: testId }, { $set: updateData });
};

// Supprimer un test par ID
const deleteTestById = async (testId) => {
  const testsCollection = getTestsCollection();
  return await testsCollection.deleteOne({ test_id: testId });
};

// Récupérer tous les tests associés à une suite de test par suite_id
const findTestsBySuiteId = async (suiteId) => {
    const testsCollection = getTestsCollection();
    return await testsCollection.find({ suiteIds: suiteId }).toArray();
  };
  
  module.exports = {
    createTest,
    findTestById,
    getAllTests,
    updateTestById,
    deleteTestById,
    findTestsBySuiteId,  
  };
  