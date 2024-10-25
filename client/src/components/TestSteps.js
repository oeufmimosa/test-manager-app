import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';

function TestSteps() {
  const { testId } = useParams(); // Récupère testId depuis les paramètres de l'URL
  const [testSteps, setTestSteps] = useState([]);
  const [stepDescription, setStepDescription] = useState('');
  const [editStep, setEditStep] = useState(null);
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState(null);

  // Fonction pour récupérer les étapes d'un test spécifique
  const fetchTestSteps = async () => {
    const token = localStorage.getItem('userToken');

    try {
      const response = await fetch(`http://localhost:8080/test-steps/test/${testId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTestSteps(data);
      } else {
        console.error('Erreur lors de la récupération des étapes du test');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des étapes du test:', err);
    }
  };

  // Fonction pour créer une nouvelle étape
  const createTestStep = async () => {
    const token = localStorage.getItem('userToken');
    const formData = new FormData();
    formData.append('description', stepDescription);
    images.forEach((image) => formData.append('images', image));
    formData.append('test_id', testId); // Ajoutez test_id lors de la création

    try {
      const response = await fetch('http://localhost:8080/test-steps', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Étape créée avec succès');
        resetForm(); // Réinitialiser le formulaire après la sauvegarde
        fetchTestSteps(); // Rafraîchir la liste des étapes
      } else {
        console.error('Erreur lors de la création de l\'étape');
      }
    } catch (err) {
      console.error('Erreur lors de la création de l\'étape:', err);
    }
  };

  // Fonction pour mettre à jour une étape
  const updateTestStep = async (step) => {
    const token = localStorage.getItem('userToken');
    const formData = new FormData();
    formData.append('description', step.description);

    // Si une nouvelle image est sélectionnée, elle sera utilisée, sinon, conserver l'existante
    if (newImage) {
      formData.append('images', newImage); // Ajouter la nouvelle image si elle existe
    } else {
      // Ajouter les images existantes pour les conserver
      step.images.forEach((img) => formData.append('existingImages', img));
    }

    try {
      const response = await fetch(`http://localhost:8080/test-steps/${step.step_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Étape mise à jour avec succès');
        setEditStep(null); // Quitter le mode édition après la mise à jour
        fetchTestSteps(); // Rafraîchir la liste des étapes
      } else {
        console.error('Erreur lors de la mise à jour de l\'étape');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'étape:', err);
    }
  };

  // Fonction pour supprimer une étape
  const deleteTestStep = async (id) => {
    const token = localStorage.getItem('userToken');

    try {
      const response = await fetch(`http://localhost:8080/test-steps/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Étape supprimée avec succès');
        fetchTestSteps(); // Rafraîchir la liste des étapes
      } else {
        console.error('Erreur lors de la suppression de l\'étape');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'étape:', err);
    }
  };

  // Fonction pour gérer le téléchargement d'images
  const handleImageUpload = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleNewImageUpload = (e) => {
    setNewImage(e.target.files[0]);
  };

  // Fonction pour initialiser le formulaire de modification
  const startEditingStep = (step) => {
    setEditStep(step);
    setNewImage(null);
  };

  // Fonction pour réinitialiser le formulaire de création
  const resetForm = () => {
    setStepDescription('');
    setImages([]);
  };

  useEffect(() => {
    fetchTestSteps();
  }, [testId]);

  return (
    <div>
      <Header />
      <div className="test-steps-container">
        <h2>Étapes pour le Test</h2>
        
        {/* Formulaire pour créer une nouvelle étape */}
        <div className="create-step-form">
          <textarea
            placeholder="Description de l'étape"
            value={stepDescription}
            onChange={(e) => setStepDescription(e.target.value)}
          />
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
          />
          <button onClick={createTestStep}>Créer l'Étape</button>
        </div>

        {/* Liste des étapes */}
        {testSteps.length > 0 ? (
          testSteps.map((step) => (
            <div key={step.step_id} className="step-item">
              <p>{step.description}</p>
              {step.images && step.images.map((img, index) => (
                <div key={index}>
                  <img src={`http://localhost:8080/${img}`} alt="step" width="100" />
                </div>
              ))}
              <button onClick={() => startEditingStep(step)}>Modifier</button>
              <button onClick={() => deleteTestStep(step.step_id)}>Supprimer</button>

              {/* Formulaire de modification en dessous de chaque étape si en mode édition */}
              {editStep && editStep.step_id === step.step_id && (
                <div className="edit-step-form">
                  <textarea
                    value={editStep.description}
                    onChange={(e) => setEditStep({ ...editStep, description: e.target.value })}
                    placeholder="Modifier la description"
                  />
                  <input
                    type="file"
                    onChange={handleNewImageUpload}
                  />
                  <button onClick={() => updateTestStep(editStep)}>Enregistrer les modifications</button>
                  <button onClick={() => setEditStep(null)}>Annuler</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Aucune étape trouvée pour ce test.</p>
        )}
      </div>
    </div>
  );
}

export default TestSteps;
