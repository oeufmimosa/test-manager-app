import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header'

function ExecutionsPage() {
  const [executions, setExecutions] = useState([]);
  const [suites, setSuites] = useState([]);
  const [suiteId, setSuiteId] = useState('');
  const [tests, setTests] = useState([]);
  const [executionName, setExecutionName] = useState('');
  const navigate = useNavigate();

  // Fonction pour récupérer les détails d'une suite
  const fetchSuiteDetails = useCallback(async (suiteId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/test-suites/${suiteId}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Erreur lors de la récupération des détails de la suite');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des détails de la suite :', err);
    }
    return null;
  }, []);

  // Fonction pour récupérer les détails des tests associés à une suite
  const fetchTestDetails = useCallback(async (suiteId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/tests/suite/${suiteId}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setTests(data);
      } else {
        console.error('Pas de test dans la suite');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des tests de la suite:', err);
    }
  }, []);

  // Fonction pour récupérer toutes les exécutions
  const fetchAllExecutions = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/executions`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();

        // Pour chaque exécution, récupérer les détails de la suite associée
        const executionsWithSuiteDetails = await Promise.all(data.map(async (execution) => {
          const suiteDetails = await fetchSuiteDetails(execution.suite_id);
          return { ...execution, suite_name: suiteDetails?.name || 'Suite inconnue' };
        }));
        setExecutions(executionsWithSuiteDetails);
      } else {
        console.error('Erreur lors de la récupération des exécutions');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des exécutions :', err);
    }
  }, [fetchSuiteDetails]); // Inclure `fetchSuiteDetails` comme dépendance

  // Fonction pour récupérer toutes les suites disponibles
  const fetchAllSuites = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/test-suites`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setSuites(data);
      } else {
        console.error('Erreur lors de la récupération des suites');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des suites :', err);
    }
  }, []);

  // Fonction pour créer une nouvelle exécution
  const createExecution = useCallback(async () => {
    if (!suiteId || !executionName || tests.length === 0) {
      alert('Veuillez sélectionner une suite, donner un nom à l\'exécution, et vous assurer qu\'elle contient des tests');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/executions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          suite_id: suiteId,
          execution_name: executionName,
          tests: tests.map(test => ({ test_id: test.test_id })),
        }),
      });

      if (response.ok) {
        alert('Nouvelle exécution créée avec succès');
        setExecutionName(''); // Réinitialiser le nom de l'exécution
        fetchAllExecutions(); // Rafraîchir la liste des exécutions
      } else {
        console.error('Erreur lors de la création de l\'exécution');
      }
    } catch (err) {
      console.error('Erreur lors de la création de l\'exécution :', err);
    }
  }, [suiteId, executionName, tests, fetchAllExecutions]);

  // Gestion des suites et tests sélectionnés
  const handleSuiteChange = useCallback((e) => {
    const selectedSuiteId = e.target.value;
    setSuiteId(selectedSuiteId);
    if (selectedSuiteId) {
      fetchTestDetails(selectedSuiteId);
    } else {
      setTests([]);
    }
  }, [fetchTestDetails]);

  // Naviguer vers les détails de l'exécution
  const navigateToExecution = useCallback((executionId) => {
    navigate(`/execution/${executionId}`);
  }, [navigate]);

  // Utiliser `useEffect` pour charger les données initiales
  useEffect(() => {
    fetchAllExecutions();
    fetchAllSuites();
  }, [fetchAllExecutions, fetchAllSuites]);

  return (
    <div> 
      <Header />
        <div className="container">
          <main>
          <h2>Liste des Exécutions</h2>

          <div className="block-item">
            <h3>Créer une Nouvelle Exécution</h3>
            <input
              type="text"
              placeholder="Nom de l'exécution"
              value={executionName}
              onChange={(e) => setExecutionName(e.target.value)}
            />
            <select value={suiteId} onChange={handleSuiteChange}>
              <option value="">Sélectionner une suite</option>
              {suites.map((suite) => (
                <option key={suite.suite_id} value={suite.suite_id}>
                  {suite.name}
                </option>
              ))}
            </select>
            <button onClick={createExecution} disabled={!suiteId || tests.length === 0 || !executionName}>
              Créer Exécution
            </button>
          </div>

          <div>
            {executions.map((execution) => (
              <div key={execution.execution_id} className="block-item">
                <p><strong>Nom de l'Exécution :</strong> {execution.execution_name}</p>
                <p><strong>Suite :</strong> {execution.suite_name}</p>
                <p><strong>Créé le :</strong> {new Date(execution.createdAt).toLocaleString()}</p>
                <button onClick={() => navigateToExecution(execution.execution_id)}>Voir Détails</button>
              </div>
            ))}
          </div>
          </main>
        </div>
    </div>
  );
}

export default ExecutionsPage;
