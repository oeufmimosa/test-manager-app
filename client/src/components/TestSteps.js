import React, { useEffect, useState, useRef,useCallback} from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';

function TestSteps() {
  const { testId } = useParams();
  const [testSteps, setTestSteps] = useState([]);
  const [stepDescription, setStepDescription] = useState('');
  const [editStep, setEditStep] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState([]);
  const createImageInputRef = useRef(null);
  const editImageInputRef = useRef(null);
  const [testDetails, setTestDetails] = useState(null);

  const fetchTestSteps = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/test-steps/test/${testId}`, {
        method: 'GET',
        credentials: 'include',
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
  }, [testId]);

  // Nouvelle fonction pour récupérer les détails du test par ID
  const fetchTestDetails = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/tests/${testId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setTestDetails(data);
      } else {
        console.error('Erreur lors de la récupération des détails du test');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des détails du test:', err);
    }
  }, [testId]);

  useEffect(() => {
    fetchTestSteps();
    fetchTestDetails();
  }, [fetchTestSteps, fetchTestDetails]);



  const createTestStep = async () => {
    const formData = new FormData();
    formData.append('description', stepDescription);
    images.forEach((image) => formData.append('images', image));
    formData.append('test_id', testId);

    try {
      const response = await fetch('http://localhost:8080/test-steps', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        alert('Étape créée avec succès');
        resetForm();
        fetchTestSteps();
      } else {
        console.error('Erreur lors de la création de l\'étape');
      }
    } catch (err) {
      console.error('Erreur lors de la création de l\'étape:', err);
    }
  };

  const updateTestStep = async (step) => {
    const formData = new FormData();
    
    // Ajouter la description modifiée au FormData
    formData.append('description', editDescription);
  
    // Ajouter les nouvelles images sélectionnées (si présentes)
    if (newImage.length > 0) {
      newImage.forEach((image) => formData.append('images', image));
    }
  
    try {
      const response = await fetch(`http://localhost:8080/test-steps/${step.step_id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData, // Utilisation de FormData comme corps de la requête
      });
  
      if (response.ok) {
        alert('Étape mise à jour avec succès');
        setEditStep(null);
        setNewImage([]); // Réinitialiser les nouvelles images
        setEditDescription(''); // Réinitialiser la description d'édition
        fetchTestSteps();
      } else {
        console.error('Erreur lors de la mise à jour de l\'étape');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'étape:', err);
    }
  };

  const deleteTestStep = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/test-steps/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        alert('Étape supprimée avec succès');
        fetchTestSteps();
      } else {
        console.error('Erreur lors de la suppression de l\'étape');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'étape:', err);
    }
  };

  const handleImageUpload = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleNewImageUpload = (e) => {
    setNewImage(Array.from(e.target.files));
  };

  const startEditingStep = (step) => {
    setEditStep(step);
    setEditDescription(step.description);
    setImages(step.images);
    setNewImage([]);
  };

  const resetForm = () => {
    setStepDescription('');
    setImages([]);
    setNewImage([]);
    if (createImageInputRef.current) {
      createImageInputRef.current.value = '';
    }
  };

    return (
    <div>
      <Header />
      <div className="test-steps-container">
        {/* Afficher les détails du test */}
        {testDetails && (
          <div className="test-details">
            <h2>{testDetails.name}</h2>
            <p>{testDetails.description}</p>
            <p><strong>Créé le:</strong> {new Date(testDetails.createdAt).toLocaleDateString()}</p>
          </div>
        )}

        <h2>Étapes pour le Test</h2>
        
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
            ref={createImageInputRef}
          />
          <button onClick={createTestStep}>Créer l'Étape</button>
        </div>

        {testSteps.length > 0 ? (
          testSteps.map((step) => (
            <div key={step.step_id} className="step-item">
              <p>{step.description}</p>
              {step.images && step.images.map((img, index) => (
                <div key={index}>
                  <img src={img} alt="step" width="100" />
                </div>
              ))}
              <button onClick={() => startEditingStep(step)}>Modifier</button>
              <button onClick={() => deleteTestStep(step.step_id)}>Supprimer</button>

              {editStep && editStep.step_id === step.step_id && (
                <div className="edit-step-form">
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Modifier la description"
                  />
                  <input
                    type="file"
                    multiple
                    onChange={handleNewImageUpload}
                    ref={editImageInputRef}
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