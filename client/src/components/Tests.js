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
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/tests`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
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
    const url = editMode ? `${process.env.REACT_APP_SERVER_URL}/tests/${editTestId}` : `${process.env.REACT_APP_SERVER_URL}/tests`;
    const method = editMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        credentials: 'include',
        body: JSON.stringify({ name: testName, description: testDescription }),
        headers: { 'Content-Type': 'application/json' },
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
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/tests/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
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
        <div className="container">
          
          <main>
            <h2>Gestion des Tests</h2>
            <button onClick={() => {
              setEditMode(false);
              setTestName('');
              setTestDescription('');
            }}>
              {editMode ? 'Annuler' : 'Créer Test'}
            </button>

            <div className="block-item">
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

            <div className="test">
              {tests.length > 0 ? (
                tests.map((test) => (
                  <div key={test.test_id} className="block-item">
                    <h3 onClick={() => viewTestSteps(test.test_id)} style={{ cursor: 'pointer' }}>
                      {test.name}
                    </h3>
                    <p>{test.description}</p>
                    <div className="block-buttons">
                      <button onClick={() => startEditingTest(test)}>Modifier</button>
                      <button className="cancel" onClick={() => deleteTest(test.test_id)}>Supprimer</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Aucun test trouvé.</p>
              )}
            </div>
          </main>
        </div>
    </div>
  );
};

export default Tests;
