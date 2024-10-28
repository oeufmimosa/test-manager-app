import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header'

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('');
  const navigate = useNavigate();

  const fetchAllUsers = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Erreur lors de la récupération des utilisateurs');
        if (response.status === 403) {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
    }
  }, [navigate]);

  const startEditingUser = (user) => {
    if (!user.user_id) {
      console.error('ID utilisateur est manquant lors de l\'édition', user);
      return;
    }

    setEditUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
  };

  const cancelEditing = () => {
    setEditUser(null);
    setEditName('');
    setEditEmail('');
    setEditRole('');
  };

  const updateUser = async (user_id) => {
    if (!user_id) {
      console.error('ID utilisateur est manquant pour la mise à jour');
      return;
    }

    const updatedData = {
      name: editName,
      email: editEmail,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/${user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert('Utilisateur mis à jour avec succès');
        setEditUser(null);
        fetchAllUsers();
      } else {
        console.error('Erreur lors de la mise à jour de l\'utilisateur');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
    }
  };

  // Fonction pour mettre à jour le rôle d'un utilisateur (superadmin uniquement)
  const updateUserRole = async (user_id) => {
    if (!user_id) {
      console.error('ID utilisateur est manquant pour la mise à jour du rôle');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/${user_id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ role: editRole }),
      });

      if (response.ok) {
        alert('Rôle mis à jour avec succès');
        setEditUser(null);
        fetchAllUsers();
      } else {
        console.error('Erreur lors de la mise à jour du rôle de l\'utilisateur');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du rôle de l\'utilisateur:', err);
    }
  };

  const deleteUser = async (user_id) => {
    if (!user_id) {
      console.error('ID utilisateur est manquant pour la suppression');
      return;
    }

    if (currentUser.role !== 'superadmin') {
      alert('Seul le superadmin peut supprimer des utilisateurs');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/${user_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        alert('Utilisateur supprimé avec succès');
        fetchAllUsers();
      } else {
        console.error('Erreur lors de la suppression de l\'utilisateur');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', err);
    }
  };

  useEffect(() => {
    setCurrentUser({
      role: 'superadmin',
    });

    fetchAllUsers();
  }, [fetchAllUsers]);

  return (
    <div className="admin-page">
      <Header />
      <main>
      <h1>Admin - Liste des utilisateurs</h1>
      <div className="user-list">
        {users.map((user) => (
          <div key={user.user_id} className="user-item">
            <p><strong>Nom:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rôle:</strong> {user.role}</p>
            <button onClick={() => startEditingUser(user)}>
              Modifier
            </button>
            {currentUser.role === 'superadmin' && (
              <button onClick={() => deleteUser(user.user_id)}>Supprimer</button>
            )}
            {editUser && editUser.user_id === user.user_id && (
              <div className="edit-user-form">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Nom"
                />
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Email"
                />
                {currentUser.role === 'superadmin' && (
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                )}
                <button onClick={() => updateUser(user.user_id)}>Enregistrer</button>
                {currentUser.role === 'superadmin' && (
                  <button onClick={() => updateUserRole(user.user_id)}>Mettre à jour le rôle</button>
                )}
                <button onClick={cancelEditing}>Annuler</button>
              </div>
            )}
          </div>
        ))}
      </div>
      </main>
    </div>
  );
}

export default AdminPage;
