import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';
import useAuth from '../hooks/useAuth';
import '../styles/header.scss';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, role } = useAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo">
          <img src="/favicon.ico" alt="Testman Logo" />
          <span className="logo-text">Testman</span>
        </div>
        <div className="menu-icon" onClick={toggleMenu}>
          <span>Menu</span>
        </div>
        <nav className={menuOpen ? "nav-links active" : "nav-links"}>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/suites">Suites</Link></li>
            <li><Link to="/tests">Tests</Link></li>
            <li><Link to="/executions">Execution</Link></li>
            {isAuthenticated && (role === 'admin' || role === 'superadmin') && (
              <li><Link to="/admin">Admin</Link></li>
            )}
            <li><Logout /></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
