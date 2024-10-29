import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import '../styles/home.scss';

function Home() {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => navigate('/login');
  const handleRegister = () => navigate('/register');

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm({ ...contactForm, [name]: value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
        },
        process.env.REACT_APP_EMAILJS_USER_ID
      );
      if (response.status === 200) {
        setSuccessMessage("Votre message a été envoyé avec succès !");
        setContactForm({ name: '', email: '', message: '' });
      } else {
        setErrorMessage("Erreur lors de l'envoi du message. Veuillez réessayer.");
      }
    } catch (error) {
      setErrorMessage("Erreur de connexion avec le service d'envoi.");
    }
  };

  return (
    <div className="container">
      <header className="hero">
        <h1>Bienvenue sur Testman</h1>
        <p>
          Testman est votre solution complète pour gérer efficacement vos suites de tests.
          Accélérez votre processus de validation, améliorez la qualité de vos applications,
          et collaborez facilement avec vos équipes.
        </p>
        <div className="button-group">
          <button className="home-button" onClick={handleLogin}>Se connecter</button>
          <button className="home-button" onClick={handleRegister}>Créer un compte</button>
        </div>
      </header>
      <main>
          <section className="features-section">
            <article>
              <h2>Fonctionnalités Clés</h2>
              <p>Avec Testman, accédez à des fonctionnalités avancées pour optimiser vos processus de test :</p>
              <ul>
                <li>Gestion complète des suites de tests et des cas de test associés.</li>
                <li>Suivi d'exécution des tests avec un historique complet des résultats.</li>
                <li>Tableaux de bord intuitifs pour surveiller l'évolution des tests.</li>
              </ul>
            </article>

            <article>
              <h2>Pourquoi Choisir Testman ?</h2>
              <p>Que vous soyez développeur, testeur ou chef de projet, Testman vous aide à :</p>
              <ul>
                <li>Réduire les erreurs en centralisant vos tests.</li>
                <li>Collaborer efficacement grâce à des permissions de rôle personnalisées.</li>
                <li>Automatiser la gestion des suites de tests pour un gain de temps considérable.</li>
              </ul>
            </article>

            <article>
              <h2>Inscription et Connexion</h2>
              <p>
                Pour profiter de toutes les fonctionnalités de Testman, inscrivez-vous gratuitement ou connectez-vous si vous avez déjà un compte.
              </p>
            </article>
          </section>
        </main>
        <footer>

          <section className="contact-form-section">
            <h2>Contactez-nous</h2>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleContactSubmit} className="contact-form">
              <input
                type="text"
                name="name"
                placeholder="Nom"
                value={contactForm.name}
                onChange={handleContactChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={contactForm.email}
                onChange={handleContactChange}
                required
              />
              <textarea
                name="message"
                placeholder="Votre message"
                value={contactForm.message}
                onChange={handleContactChange}
                required
              />
              <button type="submit">Envoyer</button>
            </form>
          </section>
        </footer>
    </div>
  );
}

export default Home;
