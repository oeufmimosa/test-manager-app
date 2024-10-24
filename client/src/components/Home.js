import React from 'react';
import { useNavigate } from 'react-router-dom';
// import './Home.css'; 

function Home() {
  const navigate = useNavigate();

  // Gestion des redirections
  const handleLogin = () => {
    navigate('/login'); // Redirige vers la page de connexion
  };

  const handleRegister = () => {
    navigate('/register'); // Redirige vers la page de création de compte
  };

  return (
    <div className="home-container">
      <h1>Bienvenue sur notre application</h1>
      <div className="button-group">
        <button className="home-button" onClick={handleLogin}>Se connecter</button>
        <button className="home-button" onClick={handleRegister}>Créer un compte</button>
      </div>
    </div>
  );
}

export default Home;
