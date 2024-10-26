const { v4: uuidv4 } = require('uuid');
const { getExecutionsCollection } = require('../db'); // Assurez-vous d'avoir une collection dédiée

// Créer une nouvelle exécution
const createExecution = async (suiteId, executionName, tests) => {
    const executionsCollection = getExecutionsCollection();
    const newExecution = {
      execution_id: uuidv4(),
      createdAt: new Date(),
      suite_id: suiteId,
      execution_name: executionName, // Nom de l'exécution
      tests: tests.map(test => ({
        test_id: test.test_id,
        status: "pas fait" // Initial status is "pas fait"
      }))
    };
    await executionsCollection.insertOne(newExecution);
    return newExecution;
  };
// Mettre à jour le statut d'un test dans une exécution
const updateExecutionStatus = async (executionId, testId, newStatus) => {
  const executionsCollection = getExecutionsCollection();
  const result = await executionsCollection.updateOne(
    { execution_id: executionId, "tests.test_id": testId },
    { $set: { "tests.$.status": newStatus } }
  );
  return result;
};

// Obtenir une exécution par son ID
const getExecutionById = async (executionId) => {
  const executionsCollection = getExecutionsCollection();
  return await executionsCollection.findOne({ execution_id: executionId });
};

const getAllExecutions = async () => {
   const executionsCollection = getExecutionsCollection();
   return await executionsCollection.find({}).toArray();
};

module.exports = {
  createExecution,
  updateExecutionStatus,
  getExecutionById,
  getAllExecutions,
};
