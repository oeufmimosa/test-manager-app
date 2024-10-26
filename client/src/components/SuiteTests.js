import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from './Header';

function SuiteTests() {
  const { suiteId } = useParams();
  const navigate = useNavigate();
  const [suiteData, setSuiteData] = useState('');
  const [tests, setTests] = useState([]);
  const [allTests, setAllTests] = useState([]);
  const [testName, setTestName] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [selectedTestId, setSelectedTestId] = useState('');

  // Fonction pour récupérer les informations d'une suite spécifique
  const fetchTestSuite = async () => {
    const token = localStorage.getItem('userToken');

    try {
      const response = await fetch(`http://localhost:8080/test-suites/${suiteId}`, { // Correction de l'URL
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setSuiteData(data); // Stocker les données de la suite dans l'état
      } else {
        console.error('Erreur lors de la récupération des suites de tests');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des suites de tests:', err);
    }
  };

  // Fonction pour récupérer les tests d'une suite spécifique
  const fetchTestsForSuite = async () => {
    try {
      const response = await fetch(`http://localhost:8080/tests/suite/${suiteId}`, {
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
  };

  // Fonction pour récupérer tous les tests disponibles
  const fetchAllTests = async () => {
    try {
      const response = await fetch('http://localhost:8080/tests', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setAllTests(data);
      } else {
        console.error('Erreur lors de la récupération de tous les tests');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération de tous les tests:', err);
    }
  };

  // Fonction pour créer un nouveau test et l'ajouter à la suite
  const createAndAddTest = async () => {
    try {
      const response = await fetch('http://localhost:8080/tests', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: testName,
          description: testDescription,
          suiteIds: [suiteId], // Ajouter directement le suiteId dans suiteIds
        }),
      });

      if (response.ok) {
        alert('Test créé et ajouté à la suite avec succès');
        setTestName('');
        setTestDescription('');
        fetchTestsForSuite(); // Rafraîchir la liste des tests
      } else {
        console.error('Erreur lors de la création du test');
      }
    } catch (err) {
      console.error('Erreur lors de la création du test:', err);
    }
  };

  // Fonction pour ajouter un test existant à la suite
  const addExistingTestToSuite = async () => {
    try {
      const testResponse = await fetch(`http://localhost:8080/tests/${selectedTestId}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (testResponse.ok) {
        const test = await testResponse.json();

        let updatedSuiteIds = test.suiteIds || [];
        if (!updatedSuiteIds.includes(suiteId)) {
          updatedSuiteIds.push(suiteId);
        }

        const updateResponse = await fetch(`http://localhost:8080/tests/${selectedTestId}`, {
          method: 'PUT',
          credentials: 'include',
          body: JSON.stringify({ suiteIds: updatedSuiteIds, name: test.name, description: test.description }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (updateResponse.ok) {
          alert('Test existant ajouté à la suite avec succès');
          setSelectedTestId('');
          fetchTestsForSuite();
        } else {
          console.error('Erreur lors de la mise à jour du test existant');
        }
      } else {
        console.error('Erreur lors de la récupération du test existant');
      }
    } catch (err) {
      console.error('Erreur lors de l\'ajout du test existant à la suite:', err);
    }
  };

  // Fonction pour naviguer vers TestSteps
  const navigateToTestSteps = (testId) => {
    navigate(`/tests/${testId}/steps`);
  };

 // Fonction pour retirer le suite_id de la suite courante dans un test (plutôt que supprimer le test)
const removeSuiteFromTest = async (testId) => {
  try {
    const response = await fetch(`http://localhost:8080/tests/remove-suite/${testId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suiteIdToRemove: suiteId }), // Envoyer l'ID de la suite courante à retirer
    });

    if (response.ok) {
      alert('Test mis à jour avec succès (suite retirée)');
      setTests((prevTests) => prevTests.filter(test => test.test_id !== testId));
      await fetchTestsForSuite(); // Rafraîchir la liste des tests
    } else {
      console.error('Erreur lors de la mise à jour du test');
    }
  } catch (err) {
    console.error('Erreur lors de la mise à jour du test:', err);
  }
};


  // Fonction pour modifier un test (naviguer vers le formulaire de modification)
  const modifyTest = (testId) => {
    navigate(`/tests/${testId}/edit`);
  };

  useEffect(() => {
    fetchTestSuite();
    fetchTestsForSuite();
    fetchAllTests();
  }, [suiteId]);

  return (
    <div className="suite-tests-container">
      <Header />
      <main>
        <h2>Tests de la Suite {suiteData.name}</h2>
        <p>{suiteData.description}</p>
        <p>Créé le : {new Date(suiteData.createdAt).toLocaleDateString()}</p>

        <div className="create-test-form">
          <input
            type="text"
            placeholder="Nom du test"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
          />
          <textarea
            placeholder="Description du test"
            value={testDescription}
            onChange={(e) => setTestDescription(e.target.value)}
          />
          <button onClick={createAndAddTest}>Créer et Ajouter le Test</button>
        </div>

        <div className="add-existing-test">
          <select
            value={selectedTestId}
            onChange={(e) => setSelectedTestId(e.target.value)}
          >
            <option value="">Sélectionner un test existant</option>
            {allTests.map((test) => (
              <option key={test.test_id} value={test.test_id}>
                {test.name}
              </option>
            ))}
          </select>
          <button onClick={addExistingTestToSuite}>Ajouter à la Suite</button>
        </div>

        <div className="test-list">
          {tests.length > 0 ? (
            tests.map((test) => (
              <div key={test.test_id} className="test-item">
                <h3 onClick={() => navigateToTestSteps(test.test_id)} style={{ cursor: 'pointer' }}>
                    {test.name}
                </h3>
                <p>{test.description}</p>
                <button onClick={() => modifyTest(test.test_id)}>Modifier</button>
                <button onClick={() => removeSuiteFromTest(test.test_id)}>Retirer de la Suite</button>
              </div>
            ))
          ) : (
            <p>Aucun test trouvé pour cette suite.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default SuiteTests;
