import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Vérifier si les mots de passe correspondent
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    // Réinitialiser les messages d'erreur et de succès
    setError('');
    setSuccess('');

    // Envoyer les données d'inscription au backend
    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok) {
        // Afficher un message de succès et rediriger vers la page de connexion
        setSuccess("Inscription réussie. Redirection vers la page de connexion...");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Afficher un message d'erreur
        setError(data.message || "Erreur lors de la création du compte.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur. Veuillez réessayer.");
    }
  };

  return (
    <div className="register-container">
      <h2>Créer un compte</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nom de l'utilisateur"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        /> 
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}

export default Register;
