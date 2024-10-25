import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';

function TestSteps() {
  const { testId } = useParams(); // Récupère testId depuis les paramètres de l'URL
  const [testSteps, setTestSteps] = useState([]);

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

  useEffect(() => {
    fetchTestSteps();
  }, [testId]);

  return (
    <div>
      <Header />
      <div className="test-steps-container">
        <h2>Étapes pour le Test</h2>
        {testSteps.length > 0 ? (
          testSteps.map((step) => (
            <div key={step.step_id} className="step-item">
              <p>{step.description}</p>
              {/* Affichez les images ici si nécessaire */}
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
