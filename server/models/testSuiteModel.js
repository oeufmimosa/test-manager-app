const { getTestSuitesCollection } = require('../db'); // Importer la collection de suite de tests depuis db.js

// Créer une nouvelle suite de test
const createTestSuite = async (suiteData) => {
  const testSuitesCollection = getTestSuitesCollection();
  return await testSuitesCollection.insertOne(suiteData);
};

// Récupérer une suite de test par ID
const findTestSuiteById = async (suiteId) => {
  const testSuitesCollection = getTestSuitesCollection();
  return await testSuitesCollection.findOne({ suite_id: suiteId });
};

// Récupérer toutes les suites de tests
const getAllTestSuites = async () => {
  const testSuitesCollection = getTestSuitesCollection();
  return await testSuitesCollection.find().toArray();
};

// Mettre à jour une suite de test par ID
const updateTestSuiteById = async (suiteId, updateData) => {
  const testSuitesCollection = getTestSuitesCollection();
  return await testSuitesCollection.updateOne({ suite_id: suiteId }, { $set: updateData });
};

// Supprimer une suite de test par ID
const deleteTestSuiteById = async (suiteId) => {
  const testSuitesCollection = getTestSuitesCollection();
  return await testSuitesCollection.deleteOne({ suite_id: suiteId });
};

module.exports = {
  createTestSuite,
  findTestSuiteById,
  getAllTestSuites,
  updateTestSuiteById,
  deleteTestSuiteById,
};
