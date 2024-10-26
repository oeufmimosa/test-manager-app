import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Execution() {
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
        fetchSuiteDetails(data.suite_id); // Récupérer les détails de la suite
        data.tests.forEach(test => fetchTestDetails(test.test_id));
      } else {
        console.error('Erreur lors de la récupération de l\'exécution');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'exécution :', err);
    }
  }, [executionId]); // Ajouter `executionId` en tant que dépendance car cette valeur peut changer

  // Fonction pour récupérer les détails de la suite
  const fetchSuiteDetails = useCallback(async (suiteId) => {
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
  }, []); // Pas de dépendance car cette fonction est appelée avec un ID spécifique

  // Fonction pour récupérer les détails des tests
  const fetchTestDetails = useCallback(async (testId) => {
    try {
      const response = await fetch(`http://localhost:8080/tests/${testId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setTestDetails(prevDetails => ({
          ...prevDetails,
          [testId]: data,
        }));
      } else {
        console.error('Erreur lors de la récupération des détails du test');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des détails du test:', err);
    }
  }, []); // Pas de dépendance car cette fonction est appelée avec un ID spécifique

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
        fetchExecution(); // Rafraîchir les détails de l'exécution après la mise à jour
      } else {
        console.error('Erreur lors de la mise à jour du statut du test');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut du test :', err);
    }
  };

  useEffect(() => {
    fetchExecution();
  }, [fetchExecution]); // Ajouter `fetchExecution` en tant que dépendance

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

export default Execution;
