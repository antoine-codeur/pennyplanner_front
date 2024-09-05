import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './views/(HomePage)/HomePage';
import TransactionPage from './views/TransactionPage/TransactionPage';
import Header from './components/header';
import Footer from './components/Footer';
import Login from './views/Auth/LoginPage/Login';
import Register from './views/Auth/RegisterPage/Register';


function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/transactions" element={<TransactionPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;