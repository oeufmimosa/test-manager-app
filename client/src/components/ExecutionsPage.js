import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ExecutionPage() {
  const { executionId } = useParams();
  const [execution, setExecution] = useState(null);
  const [suiteDetails, setSuiteDetails] = useState(null);
  const [testDetails, setTestDetails] = useState({});
  const navigate = useNavigate();

  // Fonction pour récupérer les détails de l'exécution
  const fetchExecution = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/executions/${executionId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setExecution(data);
      } else {
        console.error("Erreur lors de la récupération de l'exécution");
      }
    } catch (err) {
      console.error("Erreur lors de la récupération de l'exécution :", err);
    }
  }, [executionId]);

  // Fonction pour récupérer les détails de la suite
  const fetchSuiteDetails = async (suiteId) => {
    try {
      const response = await fetch(`http://localhost:8080/test-suites/${suiteId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setSuiteDetails(data);
      } else {
        console.error('Erreur lors de la récupération des détails de la suite');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des détails de la suite:', err);
    }
  };

  // Fonction pour récupérer les détails des tests
  const fetchTestDetails = async (testIds) => {
    try {
      const testDetailPromises = testIds.map(async (testId) => {
        const response = await fetch(`http://localhost:8080/tests/${testId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          return { [testId]: data };
        } else {
          console.error(`Erreur lors de la récupération des détails du test ${testId}`);
          return { [testId]: null };
        }
      });

      const testDetailsArray = await Promise.all(testDetailPromises);
      const testDetailsObject = testDetailsArray.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setTestDetails((prevDetails) => ({
        ...prevDetails,
        ...testDetailsObject,
      }));
    } catch (err) {
      console.error('Erreur lors de la récupération des détails des tests:', err);
    }
  };

  // Fonction pour mettre à jour le statut d'un test
  const updateTestStatus = async (testId, newStatus) => {
    try {
      const response = await fetch('http://localhost:8080/executions/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          execution_id: executionId,
          test_id: testId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        alert('Statut du test mis à jour avec succès');
        (async () => { await fetchExecution(); })(); // Rafraîchir les détails de l'exécution après la mise à jour
      } else {
        console.error('Erreur lors de la mise à jour du statut du test');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut du test :', err);
    }
  };

  // Utiliser `useEffect` pour récupérer les détails de l'exécution
  useEffect(() => {
    fetchExecution();
  }, [fetchExecution]);

  // Utiliser `useEffect` pour récupérer les détails de la suite dès que l'exécution est chargée
  useEffect(() => {
    if (execution) {
      fetchSuiteDetails(execution.suite_id);
      fetchTestDetails(execution.tests.map(test => test.test_id));
    }
  }, [execution]);

  if (!execution) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="execution-page">
      <h2>Exécution : {execution.execution_name}</h2>
      {suiteDetails && <p>Suite : {suiteDetails.name}</p>}
      <p>Date de création : {new Date(execution.createdAt).toLocaleString()}</p>

      <div className="test-list">
        {execution.tests.map((test) => (
          <div key={test.test_id} className="test-item">
            <p><strong>Test :</strong> {testDetails[test.test_id]?.name || test.test_id}</p>
            <p><strong>Statut :</strong> {test.status}</p>
            <button onClick={() => updateTestStatus(test.test_id, 'validé')}>Valider</button>
            <button onClick={() => updateTestStatus(test.test_id, 'non validé')}>Non Valider</button>
            <button onClick={() => navigate(`/tests/${test.test_id}/steps`)}>Voir Étapes du Test</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExecutionPage;
