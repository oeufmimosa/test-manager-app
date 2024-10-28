import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import '../styles/dashboard.scss';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Assurez-vous que les cookies sont inclus
        });
    
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setName(data.name);
          setEmail(data.email);
          setRole(data.role);
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données utilisateur:", err);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handlePasswordToggle = () => {
    setPasswordMode(!passwordMode);
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({ name, email }),
      });
  
      if (response.ok) {
        setUserData({ ...userData, name, email });
        setEditMode(false);
        alert('Informations mises à jour avec succès');
      } else {
        alert('Erreur lors de la mise à jour des informations');
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour des informations utilisateur:", err);
    }
  };
  

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Les nouveaux mots de passe ne correspondent pas");
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/me/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Assurez-vous que les cookies sont inclus
        body: JSON.stringify({ oldPassword, newPassword }),
      });
  
      if (response.ok) {
        alert("Mot de passe changé avec succès");
        setPasswordMode(false);
      } else {
        alert("Erreur lors de la modification du mot de passe");
      }
    } catch (err) {
      console.error("Erreur lors de la modification du mot de passe:", err);
    }
  };
  
  // supprimer le compte utilisateur
  const handleDeleteAccount = async () => {
    const confirmDeletion = window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.");
    if (!confirmDeletion) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/me`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        alert("Compte supprimé avec succès");
        navigate('/login'); // Rediriger vers la page de connexion après suppression
      } else {
        alert("Erreur lors de la suppression du compte");
      }
    } catch (err) {
      console.error("Erreur lors de la suppression du compte:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <Header />
      <main>
        <h2>Votre Synthèse Personnelle</h2>
        {userData ? (
          <div>
            {!editMode ? (
              <>
                <p>Email : {userData.email}</p>
                <p>Nom : {userData.name}</p>
                <p>Rôle : {userData.role}</p>
                <button className="dashboard-button" onClick={handleEditToggle}>Modifier les informations</button>
                <button className="dashboard-button cancel" onClick={handlePasswordToggle}>Modifier le mot de passe</button>
                <button className="dashboard-button delete" onClick={handleDeleteAccount}>Supprimer le compte</button>
              </>
            ) : (
              <>
                <input
                  type="text" className="dashboard-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input className="dashboard-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleUpdateUser}>Enregistrer</button>
                <button className="cancel" onClick={handleEditToggle}>Annuler</button>
              </>
            )}

            {passwordMode && (
              <>
                <input
                  type="password"
                  placeholder="Ancien mot de passe"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Nouveau mot de passe"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Confirmer le nouveau mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button onClick={handleChangePassword}>Changer le mot de passe</button>
                <button className="cancel" onClick={handlePasswordToggle}>Annuler</button>
              </>
            )}
          </div>
        ) : (
          <p>Chargement des informations...</p>
        )}
      </main>
    </div>
  );
}

export default Dashboard;