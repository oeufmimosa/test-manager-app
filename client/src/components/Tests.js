import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

function Tests() {
  const [tests, setTests] = useState([]);
  const [testName, setTestName] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editTestId, setEditTestId] = useState(null);
  const navigate = useNavigate();

  // Fonction pour récupérer tous les tests disponibles
  const fetchAllTests = async () => {
    const token = localStorage.getItem('userToken');

    try {
      const response = await fetch('http://localhost:8080/tests', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTests(data);
      } else {
        console.error('Erreur lors de la récupération de tous les tests');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération de tous les tests:', err);
    }
  };

  // Fonction pour créer ou mettre à jour un test
  const saveTest = async () => {
    const token = localStorage.getItem('userToken');
    const url = editMode ? `http://localhost:8080/tests/${editTestId}` : 'http://localhost:8080/tests';
    const method = editMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: testName, description: testDescription }),
      });

      if (response.ok) {
        alert(editMode ? 'Test mis à jour avec succès' : 'Test créé avec succès');
        setTestName('');
        setTestDescription('');
        setEditMode(false);
        setEditTestId(null);
        fetchAllTests(); // Rafraîchir la liste des tests
      } else {
        console.error('Erreur lors de la sauvegarde du test');
      }
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du test:', err);
    }
  };

  // Fonction pour supprimer un test
  const deleteTest = async (id) => {
    const token = localStorage.getItem('userToken');

    try {
      const response = await fetch(`http://localhost:8080/tests/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Test supprimé avec succès');
        fetchAllTests(); // Rafraîchir la liste des tests
      } else {
        console.error('Erreur lors de la suppression du test');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression du test:', err);
    }
  };

  // Fonction pour initialiser le formulaire de modification
  const startEditingTest = (test) => {
    setTestName(test.name);
    setTestDescription(test.description);
    setEditMode(true);
    setEditTestId(test.test_id);
  };

  // Fonction pour naviguer vers la page des étapes de test
  const viewTestSteps = (testId) => {
    navigate(`/tests/${testId}/steps`);
  };

  useEffect(() => {
    fetchAllTests();
  }, []);

  return (
    <div>
      <Header />
      <div className="tests-container">
        <h2>Gestion des Tests</h2>
        <button onClick={() => {
          setEditMode(false);
          setTestName('');
          setTestDescription('');
        }}>
          {editMode ? 'Annuler' : 'Créer Test'}
        </button>

        <div className="test-form">
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
          <button onClick={saveTest}>
            {editMode ? 'Mettre à jour le Test' : 'Créer le Test'}
          </button>
        </div>

        <div className="test-list">
          {tests.length > 0 ? (
            tests.map((test) => (
              <div key={test.test_id} className="test-item">
                <h3 onClick={() => viewTestSteps(test.test_id)} style={{ cursor: 'pointer' }}>
                  {test.name}
                </h3>
                <p>{test.description}</p>
                <button onClick={() => startEditingTest(test)}>Modifier</button>
                <button onClick={() => deleteTest(test.test_id)}>Supprimer</button>
              </div>
            ))
          ) : (
            <p>Aucun test trouvé.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tests;
