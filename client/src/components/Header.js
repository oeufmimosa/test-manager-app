import React from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';
import useAuth from '../hooks/useAuth'; // Import du hook personnalisé

const Header = () => {
  const { isAuthenticated, role } = useAuth();

  console.log('Header auth:', isAuthenticated, 'Role:', role); // Ajouter un log pour vérifier l'état d'authentification

  return (
    <header className="app-header">
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/suites">Suites</Link></li>
          <li><Link to="/tests">Tests</Link></li>
          <li><Link to="/execution">Execution</Link></li>

          {/* Afficher le lien Admin uniquement si l'utilisateur est admin ou superadmin */}
          {isAuthenticated && (role === 'admin' || role === 'superadmin') && (
            <li><Link to="/admin">Admin</Link></li>
          )}

          <li><Logout /></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
