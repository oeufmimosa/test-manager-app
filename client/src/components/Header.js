import React from 'react';
import { Link } from 'react-router-dom';
// import './Header.css'; 

const Header = () => {
  return (
    <header className="app-header">
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/suites">Suites</Link></li>
          <li><Link to="/tests">Tests</Link></li>
          <li><Link to="/execution">Execution</Link></li>
          <li><Link to="/logout">Logout</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;