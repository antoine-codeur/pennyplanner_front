// src/components/Footer.jsx
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import CTA from './CTA';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Footer.css';

const Footer = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();
  const isOnCreatePage = location.pathname === '/transactions/create';
  const isOnRegisterPage = location.pathname === '/register';
  const isOnTransactionsPage = location.pathname === '/transactions';

  return (
    <footer>
      <div className="footer-links">
        {isLoggedIn && (
          <>
            {isOnCreatePage ? (
              <CTA icon="fa-home" alt="Home Page" url="/" />
            ) : (
              <CTA icon="fa-plus" alt="Create New Transaction" url="/transactions/create" />
            )}
          </>
        )}
        {isLoggedIn && !isOnTransactionsPage && (
          <CTA text="Transaction" alt="Transaction List" url="/transactions" />
        )}
        {!isLoggedIn && (
          <>
            {isOnRegisterPage ? (
              <Link to="/login">Login</Link>
            ) : (
              <Link to="/register">Register</Link>
            )}
            <p>© 2024 My Finance App. All rights reserved.</p>
          </>
        )}
      </div>
    </footer>
  );
};

export default Footer;
