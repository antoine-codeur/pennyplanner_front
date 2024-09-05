// src/components/Header.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Header = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <header>
      <h1>PennyPlanner</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          {isLoggedIn && <li><Link to="/transactions">Transactions</Link></li>}
          {isLoggedIn && <li><Link to="/categories">Catégories</Link></li>}
          {isLoggedIn ? (
            <li><button onClick={logout}>Logout</button></li>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
