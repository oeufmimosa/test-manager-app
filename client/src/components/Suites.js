import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

function Suites() {
  const [suites, setSuites] = useState([]);
  const [suiteName, setSuiteName] = useState('');
  const [suiteDescription, setSuiteDescription] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editSuiteId, setEditSuiteId] = useState('');
  const navigate = useNavigate();

  const fetchTestSuites = async () => {

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
        console.error('Erreur lors de la récupération des suites de tests');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des suites de tests:', err);
    }
  };

  const saveTestSuite = async () => {
    const url = editMode
      ? `${process.env.REACT_APP_SERVER_URL}/test-suites/${editSuiteId}`
      : `${process.env.REACT_APP_SERVER_URL}/test-suites`;
    const method = editMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: suiteName, description: suiteDescription }),
      });

      if (response.ok) {
        alert(editMode ? 'Suite de test mise à jour avec succès' : 'Suite de test créée avec succès');
        setSuiteName('');
        setSuiteDescription('');
        setShowCreateForm(false);
        setEditMode(false);
        setEditSuiteId(null);
        fetchTestSuites(); // Rafraîchir la liste des suites
      } else {
        console.error('Erreur lors de la sauvegarde de la suite de test');
      }
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de la suite de test:', err);
    }
  };

  const deleteTestSuite = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/test-suites/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        alert('Suite de test supprimée avec succès');
        fetchTestSuites(); // Rafraîchir la liste des suites
      } else {
        console.error('Erreur lors de la suppression de la suite de test');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression de la suite de test:', err);
    }
  };

  const startEditingSuite = (suite) => {
    setSuiteName(suite.name);
    setSuiteDescription(suite.description);
    setEditMode(true);
    setEditSuiteId(suite.suite_id);
    setShowCreateForm(true);
  };

  // Fonction pour naviguer vers la page des tests pour une suite spécifique
  const viewTestsForSuite = (suiteId) => {
    navigate(`/suites/${suiteId}/tests`);
  };

  useEffect(() => {
    fetchTestSuites();
  }, []);

  return (
    <div className="suites-container">
      <Header />
      <main>
        <h2>Gestion des Suites de Tests</h2>
        <button onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditMode(false);
            setEditSuiteId(null);
            setSuiteName('');
            setSuiteDescription('');
        }}>
            {showCreateForm ? 'Annuler' : 'Créer Suite'}
        </button>

        {showCreateForm && (
            <div className="create-suite-form">
            <input
                type="text"
                placeholder="Nom de la suite"
                value={suiteName}
                onChange={(e) => setSuiteName(e.target.value)}
            />
            <textarea
                placeholder="Description de la suite"
                value={suiteDescription}
                onChange={(e) => setSuiteDescription(e.target.value)}
            />
            <button onClick={saveTestSuite}>
                {editMode ? 'Modifier' : 'Créer'}
            </button>
            </div>
        )}

        <div className="test-suites-list">
            {suites.length > 0 ? (
            suites.map((suite) => (
                <div key={suite.suite_id} className="suite-item">
                <h3 onClick={() => viewTestsForSuite(suite.suite_id)} style={{ cursor: 'pointer' }}>
                    {suite.name}
                </h3>
                <p>{suite.description}</p>
                <button onClick={() => startEditingSuite(suite)}>Modifier</button>
                <button onClick={() => deleteTestSuite(suite.suite_id)}>Supprimer</button>
                </div>
            ))
            ) : (
            <p>Aucune suite de test trouvée.</p>
            )}
        </div>
      </main>
    </div>
  );
}

export default Suites;
