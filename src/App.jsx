// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './views/(HomePage)/HomePage';
import TransactionPage from './views/TransactionPage/TransactionPage';
import CategoriesPage from './views/CategoriesPage/CategoriesPage';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './views/Auth/LoginPage/Login';
import Register from './views/Auth/RegisterPage/Register';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/transactions" element={<TransactionPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;