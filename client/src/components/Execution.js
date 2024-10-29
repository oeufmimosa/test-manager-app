import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header'

function Execution() {
  const { executionId } = useParams();
  const [execution, setExecution] = useState(null);
  const [suiteDetails, setSuiteDetails] = useState(null);
  const [testDetails, setTestDetails] = useState({});
  const [testIds, setTestIds] = useState([]);
  const [suiteId, setSuiteId] = useState('');
  const navigate = useNavigate();

  // Fonction pour récupérer les détails de l'exécution
  const fetchExecution = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/executions/${executionId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setExecution(data);
        setSuiteId(data.suite_id);
        setTestIds(data.tests.map(test => test.test_id)); // Récupère les ID des tests pour un appel ultérieur
      } else {
        console.error('Erreur lors de la récupération de l\'exécution');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'exécution :', err);
    }
  }, [executionId]);

  // Fonction pour récupérer les détails de la suite
  const fetchSuiteDetails = useCallback(async () => {
    if (suiteId) {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/test-suites/${suiteId}`, {
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
    }
  }, [suiteId]);

  // Fonction pour récupérer les détails des tests
  const fetchTestDetails = useCallback(async () => {
    const idsToFetch = testIds.filter(testId => !testDetails[testId]); // Ne récupère que les tests non déjà chargés

    const fetchPromises = idsToFetch.map(async (testId) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/tests/${testId}`, {
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
    });

    await Promise.all(fetchPromises);
  }, [testIds, testDetails]);

  // Fonction pour mettre à jour le statut d'un test
  const updateTestStatus = async (testId, newStatus) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/executions/status`, {
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
        await fetchExecution(); // Rafraîchir les détails de l'exécution après la mise à jour
      } else {
        console.error('Erreur lors de la mise à jour du statut du test');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut du test :', err);
    }
  };

  // UseEffect pour initialiser les données d'exécution
  useEffect(() => {
    fetchExecution();
  }, [fetchExecution]);

  // UseEffect pour récupérer les détails de la suite lorsque suiteId change
  useEffect(() => {
    fetchSuiteDetails();
  }, [fetchSuiteDetails]);

  // UseEffect pour récupérer les détails des tests lorsque testIds change
  useEffect(() => {
    fetchTestDetails();
  }, [fetchTestDetails]);

  // Ajoutez une vérification conditionnelle pour éviter l'erreur `Cannot read properties of null`
  if (!execution) {
    return <div>Chargement...</div>;
  }

  return (
    <div> 
      <Header />
      <div className="container">
        
        <main>
        <h2>Exécution : {execution.execution_name}</h2>
        {suiteDetails && <p>Suite : {suiteDetails.name}</p>}
        <p>Date de création : {new Date(execution.createdAt).toLocaleString()}</p>

        <div className="block-item">
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
        </main>
      </div>
    </div>
  );
}

export default Execution;
