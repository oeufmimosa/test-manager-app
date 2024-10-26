import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('');
  const navigate = useNavigate();

  // Utilisez useCallback pour mémoriser la fonction fetchAllUsers
  const fetchAllUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:8080/users', {
        method: 'GET',
        headers: {'Content-Type': 'application/json',  }, 
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Erreur lors de la récupération des utilisateurs');
        // Rediriger si non autorisé
        if (response.status === 403) {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
    }
  }, [navigate]); // Inclure `navigate` car elle est utilisée dans la fonction

  // Fonction pour initier l'édition d'un utilisateur
  const startEditingUser = (user) => {
    setEditUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
  };

  // Fonction pour annuler l'édition
  const cancelEditing = () => {
    setEditUser(null);
    setEditName('');
    setEditEmail('');
    setEditRole('');
  };

  // Fonction pour mettre à jour un utilisateur
  const updateUser = async (id) => {
    const token = localStorage.getItem('userToken');
    const updatedData = {
      name: editName,
      email: editEmail,
    };

    // Permettre au super admin de modifier le rôle
    if (currentUser.role === 'superadmin') {
      updatedData.role = editRole;
    }

    try {
      const response = await fetch(`http://localhost:8080/users/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',  }, 
        credentials: 'include',
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert('Utilisateur mis à jour avec succès');
        setEditUser(null);
        fetchAllUsers(); // Rafraîchir la liste des utilisateurs
      } else {
        console.error('Erreur lors de la mise à jour de l\'utilisateur');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
    }
  };

  // Fonction pour supprimer un utilisateur (super admin uniquement)
  const deleteUser = async (id) => {
    if (currentUser.role !== 'superadmin') {
      alert('Seul le super admin peut supprimer des utilisateurs');
      return;
    }

    const token = localStorage.getItem('userToken');

    try {
      const response = await fetch(`http://localhost:8080/users/${id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json',  }, 
        credentials: 'include',
      });

      if (response.ok) {
        alert('Utilisateur supprimé avec succès');
        fetchAllUsers(); // Rafraîchir la liste des utilisateurs
      } else {
        console.error('Erreur lors de la suppression de l\'utilisateur');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', err);
    }
  };

  useEffect(() => {
    // Simule la récupération des infos de l'utilisateur courant, ex: depuis le token
    setCurrentUser({
      role: 'superadmin', // ou 'admin', basé sur votre implémentation réelle
    });

    fetchAllUsers();
  }, [fetchAllUsers]); // Inclure fetchAllUsers comme dépendance

  return (
    <div className="admin-page">
      <h1>Admin - Liste des utilisateurs</h1>
      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-item">
            <p><strong>Nom:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rôle:</strong> {user.role}</p>
            <button onClick={() => startEditingUser(user)}>
              Modifier
            </button>
            {currentUser.role === 'superadmin' && (
              <button onClick={() => deleteUser(user.id)}>Supprimer</button>
            )}
            {editUser && editUser.id === user.id && (
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
                <button onClick={() => updateUser(user.id)}>Enregistrer</button>
                <button onClick={cancelEditing}>Annuler</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;
