import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/users/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
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
    const token = localStorage.getItem('userToken');

    try {
      const response = await fetch(`http://localhost:8080/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
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

    const token = localStorage.getItem('userToken');
    try {
      const response = await fetch(`http://localhost:8080/users/me/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
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

  return (
    <div className="dashboard-container">
      <header>
        <nav className="navbar">
          <div className="navbar-logo">
            <h1>Dashboard</h1>
          </div>
          <ul className="navbar-links">
            <li><Link to="/suites">Suites</Link></li>
            <li><Link to="/tests">Tests</Link></li>
            <li><Link to="/execution">Execution</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <h2>Votre Synthèse Personnelle</h2>
        {userData ? (
          <div>
            {!editMode ? (
              <>
                <p>Email : {userData.email}</p>
                <p>Nom : {userData.name}</p>
                <p>Rôle : {userData.role}</p>
                <button onClick={handleEditToggle}>Modifier les informations</button>
                <button onClick={handlePasswordToggle}>Modifier le mot de passe</button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleUpdateUser}>Enregistrer</button>
                <button onClick={handleEditToggle}>Annuler</button>
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
                <button onClick={handlePasswordToggle}>Annuler</button>
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
