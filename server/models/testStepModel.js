const { getTestStepsCollection } = require('../db');


// Créer un nouveau step de test
const createTestStep = async (stepData) => {
  try {
    const stepsCollection = getTestStepsCollection();
    const result = await stepsCollection.insertOne(stepData);
    return result;
  } catch (error) {
    console.error("Erreur lors de l'insertion de l'étape :", error);
    throw error;
  }
};

// Récupérer tous les steps liés à un test par test_id
const findTestStepsByTestId = async (testId) => {
  const testStepsCollection = getTestStepsCollection();
  return await testStepsCollection.find({ test_id: testId }).toArray();
};

// Récupérer un step de test par step_id
const findTestStepById = async (stepId) => {
  const testStepsCollection = getTestStepsCollection();
  return await testStepsCollection.findOne({ step_id: stepId });
};

// Mettre à jour un step de test par step_id
const updateTestStepById = async (stepId, updateData) => {
  const testStepsCollection = getTestStepsCollection();
  return await testStepsCollection.updateOne({ step_id: stepId }, { $set: updateData });
};

// Supprimer un step de test par step_id
const deleteTestStepById = async (stepId) => {
  const testStepsCollection = getTestStepsCollection();
  return await testStepsCollection.deleteOne({ step_id: stepId });
};

module.exports = {
  createTestStep,
  findTestStepsByTestId,
  findTestStepById,
  updateTestStepById,
  deleteTestStepById,
};
