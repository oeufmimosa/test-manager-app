import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/users/logout', {
        method: 'POST',
        credentials: 'include', // Inclure les cookies pour s'assurer que le serveur peut effacer le JWT
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        alert("Déconnexion réussie !");
        navigate('/login'); // Rediriger vers la page de connexion
      } else {
        console.error("Erreur lors de la déconnexion");
      }
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;